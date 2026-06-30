/**
 * ExtendScript-compatible JSON polyfill.
 *
 * Implements the ES5 JSON.parse(text, reviver) and
 * JSON.stringify(value, replacer, space) surface without eval.
 * The implementation uses only language features available in ExtendScript.
 * ESTK treats const declarations as function-scoped, so variables declared
 * repeatedly by loops intentionally use var.
 */
if (typeof JSON === "undefined") {
    JSON = {};
}

(function () {
    const objectToString = Object.prototype.toString;
    const hasOwnProperty = Object.prototype.hasOwnProperty;

    function createTypeError(message) {
        const error = (typeof TypeError === "function") ? new TypeError(message) : new Error(message);
        error.name = "TypeError";
        return error;
    }

    function createSyntaxError(message) {
        const error = (typeof SyntaxError === "function") ? new SyntaxError(message) : new Error(message);
        error.name = "SyntaxError";
        return error;
    }

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
                throw createTypeError("Converting circular structure to JSON");
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

    function parse(text, reviver) {
        const source = String(text);
        const length = source.length;
        var index = 0;

        function fail(message) {
            throw createSyntaxError(message + " at position " + index);
        }

        function isDigit(character) {
            return character >= "0" && character <= "9";
        }

        function isHexDigit(character) {
            return (character >= "0" && character <= "9") ||
                (character >= "a" && character <= "f") ||
                (character >= "A" && character <= "F");
        }

        function skipWhitespace() {
            while (index < length) {
                var code = source.charCodeAt(index);
                if (code === 0x20 || code === 0x09 || code === 0x0A || code === 0x0D) {
                    index++;
                } else {
                    break;
                }
            }
        }

        function parseString() {
            var result = "";
            index++;

            while (index < length) {
                var character = source.charAt(index);
                var code = source.charCodeAt(index);

                if (character === "\"") {
                    index++;
                    return result;
                }

                if (character === "\\") {
                    index++;
                    if (index >= length) {
                        fail("Unterminated escape sequence");
                    }

                    var escape = source.charAt(index);
                    index++;

                    if (escape === "\"" || escape === "\\" || escape === "/") {
                        result += escape;
                    } else if (escape === "b") {
                        result += "\b";
                    } else if (escape === "f") {
                        result += "\f";
                    } else if (escape === "n") {
                        result += "\n";
                    } else if (escape === "r") {
                        result += "\r";
                    } else if (escape === "t") {
                        result += "\t";
                    } else if (escape === "u") {
                        if (index + 4 > length) {
                            fail("Invalid Unicode escape sequence");
                        }

                        var hex = "";
                        for (var h = 0; h < 4; h++) {
                            var hexCharacter = source.charAt(index + h);
                            if (!isHexDigit(hexCharacter)) {
                                fail("Invalid Unicode escape sequence");
                            }
                            hex += hexCharacter;
                        }

                        result += String.fromCharCode(parseInt(hex, 16));
                        index += 4;
                    } else {
                        fail("Invalid escape sequence");
                    }
                } else {
                    if (code < 0x20) {
                        fail("Unescaped control character in string");
                    }
                    result += character;
                    index++;
                }
            }

            fail("Unterminated string");
        }

        function parseNumber() {
            const start = index;

            if (source.charAt(index) === "-") {
                index++;
            }

            if (source.charAt(index) === "0") {
                index++;
                if (isDigit(source.charAt(index))) {
                    fail("Leading zero in number");
                }
            } else {
                if (source.charAt(index) < "1" || source.charAt(index) > "9") {
                    fail("Invalid number");
                }
                while (isDigit(source.charAt(index))) {
                    index++;
                }
            }

            if (source.charAt(index) === ".") {
                index++;
                if (!isDigit(source.charAt(index))) {
                    fail("Missing digits after decimal point");
                }
                while (isDigit(source.charAt(index))) {
                    index++;
                }
            }

            if (source.charAt(index) === "e" || source.charAt(index) === "E") {
                index++;
                if (source.charAt(index) === "+" || source.charAt(index) === "-") {
                    index++;
                }
                if (!isDigit(source.charAt(index))) {
                    fail("Missing exponent digits");
                }
                while (isDigit(source.charAt(index))) {
                    index++;
                }
            }

            return Number(source.substring(start, index));
        }

        function parseLiteral(literal, value) {
            if (source.substring(index, index + literal.length) !== literal) {
                fail("Unexpected token");
            }
            index += literal.length;
            return value;
        }

        function parseArray() {
            const result = [];
            index++;
            skipWhitespace();

            if (source.charAt(index) === "]") {
                index++;
                return result;
            }

            while (true) {
                result.push(parseValue());
                skipWhitespace();

                if (source.charAt(index) === "]") {
                    index++;
                    return result;
                }

                if (source.charAt(index) !== ",") {
                    fail("Expected ',' or ']'");
                }

                index++;
                skipWhitespace();
                if (source.charAt(index) === "]") {
                    fail("Trailing comma in array");
                }
            }
        }

        function defineParsedProperty(object, key, value) {
            if (key === "__proto__" && typeof Object.defineProperty === "function") {
                try {
                    Object.defineProperty(object, key, {
                        value: value,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                    if (hasOwnProperty.call(object, key)) {
                        return;
                    }
                } catch (ignore) {
                }
            }

            if (key === "__proto__") {
                try {
                    /*
                     * Old ExtendScript engines expose __proto__ as an inherited
                     * mutator and cannot define a shadowing data property. A
                     * null prototype removes that mutator, after which the key
                     * can safely be stored as an own enumerable property.
                     */
                    object.__proto__ = null;
                    object[key] = value;
                    if (hasOwnProperty.call(object, key)) {
                        return;
                    }
                } catch (ignoreFallback) {
                }
                return;
            }

            object[key] = value;
        }

        function parseObject() {
            const result = {};
            index++;
            skipWhitespace();

            if (source.charAt(index) === "}") {
                index++;
                return result;
            }

            while (true) {
                if (source.charAt(index) !== "\"") {
                    fail("Expected a string property name");
                }

                var key = parseString();
                skipWhitespace();
                if (source.charAt(index) !== ":") {
                    fail("Expected ':' after property name");
                }

                index++;
                defineParsedProperty(result, key, parseValue());
                skipWhitespace();

                if (source.charAt(index) === "}") {
                    index++;
                    return result;
                }

                if (source.charAt(index) !== ",") {
                    fail("Expected ',' or '}'");
                }

                index++;
                skipWhitespace();
                if (source.charAt(index) === "}") {
                    fail("Trailing comma in object");
                }
            }
        }

        function parseValue() {
            skipWhitespace();
            const character = source.charAt(index);

            if (character === "\"") {
                return parseString();
            }
            if (character === "[") {
                return parseArray();
            }
            if (character === "{") {
                return parseObject();
            }
            if (character === "t") {
                return parseLiteral("true", true);
            }
            if (character === "f") {
                return parseLiteral("false", false);
            }
            if (character === "n") {
                return parseLiteral("null", null);
            }
            if (character === "-" || isDigit(character)) {
                return parseNumber();
            }

            fail("Unexpected token");
        }

        function walk(holder, key) {
            var value = holder[key];

            if (value !== null && typeof value === "object") {
                if (isArray(value)) {
                    for (var i = 0; i < value.length; i++) {
                        var arrayResult = walk(value, String(i));
                        if (typeof arrayResult === "undefined") {
                            delete value[i];
                        } else {
                            value[i] = arrayResult;
                        }
                    }
                } else {
                    for (var property in value) {
                        if (hasOwnProperty.call(value, property)) {
                            var objectResult = walk(value, property);
                            if (typeof objectResult === "undefined") {
                                delete value[property];
                            } else {
                                value[property] = objectResult;
                            }
                        }
                    }
                }
            }

            return reviver.call(holder, key, value);
        }

        const result = parseValue();
        skipWhitespace();
        if (index !== length) {
            fail("Unexpected trailing character");
        }

        if (typeof reviver === "function") {
            return walk({"": result}, "");
        }

        return result;
    }

    if (typeof JSON.stringify !== "function") {
        JSON.stringify = stringify;
    }

    if (typeof JSON.parse !== "function") {
        JSON.parse = parse;
    }
}());
