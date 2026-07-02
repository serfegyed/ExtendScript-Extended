/**
 * ExtendScript-compatible JSON.parse polyfill.
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

    function parse(text, reviver) {
        const source = String(text);
        const length = source.length;
        var index = 0;

        function fail(message) {
            throw new SyntaxError(message + " at position " + index);
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

    if (typeof JSON.parse !== "function") {
        JSON.parse = parse;
    }
}());
