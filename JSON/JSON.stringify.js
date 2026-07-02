/**
 * ExtendScript-compatible JSON.stringify polyfill.
 */
if (typeof JSON === "undefined") {
    JSON = {};
}

(function () {
    const objectToString = Object.prototype.toString;
    const hasOwnProperty = Object.prototype.hasOwnProperty;

    function isArray(value) {
        if (typeof Array.isArray === "function") {
            return Array.isArray(value);
        }
        return objectToString.call(value) === "[object Array]";
    }

    function indexOfIdentity(array, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return i;
            }
        }
        return -1;
    }

    function fourHexDigits(code) {
        const hex = code.toString(16);
        return "0000".substring(hex.length) + hex;
    }

    function quoteString(value) {
        var result = "\"";

        for (var i = 0; i < value.length; i++) {
            var code = value.charCodeAt(i);

            if (code === 34) {
                result += "\\\"";
            } else if (code === 92) {
                result += "\\\\";
            } else if (code === 8) {
                result += "\\b";
            } else if (code === 9) {
                result += "\\t";
            } else if (code === 10) {
                result += "\\n";
            } else if (code === 12) {
                result += "\\f";
            } else if (code === 13) {
                result += "\\r";
            } else if (code < 32) {
                result += "\\u" + fourHexDigits(code);
            } else if (code >= 0xD800 && code <= 0xDBFF) {
                var nextCode = (i + 1 < value.length) ? value.charCodeAt(i + 1) : -1;
                if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                    result += value.charAt(i) + value.charAt(i + 1);
                    i++;
                } else {
                    result += "\\u" + fourHexDigits(code);
                }
            } else if (code >= 0xDC00 && code <= 0xDFFF) {
                result += "\\u" + fourHexDigits(code);
            } else {
                result += value.charAt(i);
            }
        }

        return result + "\"";
    }

    function makePropertyList(replacer) {
        if (!isArray(replacer)) {
            return null;
        }

        const propertyList = [];

        for (var i = 0; i < replacer.length; i++) {
            var item = replacer[i];
            var itemTag = item !== null && typeof item === "object"
                ? objectToString.call(item)
                : "";
            var propertyName;

            if (typeof item === "string" || typeof item === "number") {
                propertyName = String(item);
            } else if (itemTag === "[object String]" || itemTag === "[object Number]") {
                propertyName = String(item.valueOf());
            }

            if (typeof propertyName !== "undefined" && indexOfIdentity(propertyList, propertyName) === -1) {
                propertyList.push(propertyName);
            }
        }

        return propertyList;
    }

    function makeGap(space) {
        const tag = space !== null && typeof space === "object"
            ? objectToString.call(space)
            : "";

        if (tag === "[object Number]") {
            space = Number(space.valueOf());
        } else if (tag === "[object String]") {
            space = String(space.valueOf());
        }

        if (typeof space === "number") {
            var count = isNaN(space) || space <= 0 ? 0 : Math.min(10, Math.floor(space));
            var gap = "";
            while (count > 0) {
                gap += " ";
                count--;
            }
            return gap;
        }

        if (typeof space === "string") {
            return space.substring(0, 10);
        }

        return "";
    }

    function stringify(value, replacer, space) {
        const replacerFunction = typeof replacer === "function" ? replacer : null;
        const propertyList = makePropertyList(replacer);
        const gap = makeGap(space);
        const stack = [];
        var indent = "";

        function serializeProperty(holder, key) {
            var current = holder[key];

            if (current !== null &&
                (typeof current === "object" || typeof current === "function") &&
                typeof current.toJSON === "function") {
                current = current.toJSON(key);
            }

            if (replacerFunction !== null) {
                current = replacerFunction.call(holder, key, current);
            }

            if (current !== null && typeof current === "object") {
                const currentTag = objectToString.call(current);
                if (currentTag === "[object Number]") {
                    current = Number(current.valueOf());
                } else if (currentTag === "[object String]") {
                    current = String(current.valueOf());
                } else if (currentTag === "[object Boolean]") {
                    current = Boolean(current.valueOf());
                }
            }

            if (current === null) {
                return "null";
            }

            if (typeof current === "string") {
                return quoteString(current);
            }

            if (typeof current === "number") {
                return isFinite(current) ? String(current) : "null";
            }

            if (typeof current === "boolean") {
                return current ? "true" : "false";
            }

            if (typeof current !== "object") {
                return undefined;
            }

            if (indexOfIdentity(stack, current) !== -1) {
                throw new TypeError("Converting circular structure to JSON");
            }

            stack.push(current);
            const previousIndent = indent;
            indent += gap;

            var result;
            if (isArray(current)) {
                result = serializeArray(current, previousIndent);
            } else {
                result = serializeObject(current, previousIndent);
            }

            stack.pop();
            indent = previousIndent;
            return result;
        }

        function serializeArray(array, previousIndent) {
            const partial = [];

            for (var i = 0; i < array.length; i++) {
                var item = serializeProperty(array, String(i));
                partial.push(typeof item === "undefined" ? "null" : item);
            }

            if (partial.length === 0) {
                return "[]";
            }

            if (gap === "") {
                return "[" + partial.join(",") + "]";
            }

            return "[\n" + indent + partial.join(",\n" + indent) + "\n" + previousIndent + "]";
        }

        function serializeObject(object, previousIndent) {
            const partial = [];

            function appendProperty(key) {
                const propertyValue = serializeProperty(object, key);
                if (typeof propertyValue !== "undefined") {
                    partial.push(quoteString(key) + (gap === "" ? ":" : ": ") + propertyValue);
                }
            }

            if (propertyList !== null) {
                for (var i = 0; i < propertyList.length; i++) {
                    appendProperty(propertyList[i]);
                }
            } else {
                for (var key in object) {
                    if (hasOwnProperty.call(object, key)) {
                        appendProperty(key);
                    }
                }
            }

            if (partial.length === 0) {
                return "{}";
            }

            if (gap === "") {
                return "{" + partial.join(",") + "}";
            }

            return "{\n" + indent + partial.join(",\n" + indent) + "\n" + previousIndent + "}";
        }

        return serializeProperty({"": value}, "");
    }

    if (typeof JSON.stringify !== "function") {
        JSON.stringify = stringify;
    }
}());
