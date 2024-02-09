/*****************************************************************************************************************
 *   @name JSON
 *   @desc  These implementations are simplified and do not include all of the features
 *		    and options of the ECMAScript 5 `JSON` object.
 *          It supports all the standard JSON data types including numbers, booleans, null, strings, arrays, and objects.
 *   @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
 ****************************************************************************************************************/
if (!JSON) {
    const JSON = Object;

    /**
     * Converts a JavaScript value to a JSON string representation.
     *
     * @param {any} value - The value to be converted to a JSON string.
     * @return {string} The JSON string representation of the input value.
     */
    JSON.stringify = function (value) {
        if (value === null) {
            return "null";
        }

        if (typeof value === 'number' || typeof value === 'boolean') {
            return value.toString();
        }

        if (typeof value === 'string') {
            return '"' + value + '"';
        }

        // If the value is an array, recursively call stringify on each element
        if (Array.isArray(value)) {
            const arrayContents = value.map(function (element) { return JSON.stringify(element) }).join(',');
            return '[' + arrayContents + ']';
        }

        // If the value is a plain object, recursively call stringify on each value, 
        // ignore non-serializable values
        if (typeof value === 'object') {
            const keys = Object.keys(value);
            const keyValuePairStrings = keys.map(function (key) {
                const valString = JSON.stringify(value[key]);
                if (valString === undefined || typeof value[key] === 'function') {
                    // Skip undefined and functions since they are not valid JSON
                    return '';
                }
                return '"' + key + '":' + valString;
            }).filter(Boolean); // Remove any undefined values resulting from non-serializable values
            return '{' + keyValuePairStrings.join(',') + '}';
        }

        // For all other types that are not serializable to JSON, such as undefined or functions,
        // return undefined (which will be filtered out in the object case)
        return undefined;
    }

    /**
     * Converts a JSON string to a JavaScript value.
     *
     * @param {string} jsonString - The JSON string to be converted to a JavaScript value.
     * @return {any} The JavaScript value represented by the input JSON string.
     */
    JSON.parse = function (jsonString) {
        var index = 0;

        // Skip spaces
        var skipSpaces = function () {
            while (
                index < jsonString.length &&
                /\s/.test(jsonString.charAt(index))
            ) {
                index++;
            }
        };

        // Parse a JSON value recursively
        var parseValue = function () {
            skipSpaces();

            var ch = jsonString.charAt(index);
            var value;

            // Handle strings
            if (ch === '"') {
                return parseString();
            }

            // Handle numbers and booleans
            if (ch === "-" || (ch >= "0" && ch <= "9")) {
                return parseNumber();
            }
            if (jsonString.substring(index, index + 4) === "true") {
                index += 4;
                return true;
            }
            if (jsonString.substring(index, index + 5) === "false") {
                index += 5;
                return false;
            }

            // Handle null
            if (jsonString.substring(index, index + 4) === "null") {
                index += 4;
                return null;
            }


            // Handle arrays
            if (ch === "[") {
                return parseArray();
            }

            // Handle objects
            if (ch === "{") {
                return parseObject();
            }

            // Handle invalid JSON
            throw new SyntaxError("Unexpected token " + ch);
        };

        // Parse a JSON string recursively
        var parseString = function () {
            var quote = jsonString.charAt(index);
            var value = "";
            index++;
            while (jsonString.charAt(index) !== quote) {
                if (jsonString.charAt(index) === "\\") {
                    index++;
                    value += parseEscape();
                } else {
                    value += jsonString.charAt(index);
                    index++;
                }
            }
            index++;
            return value;
        };

        // Parse a JSON number
        var parseNumber = function () {
            var start = index;
            var ch = jsonString.charAt(index);
            while (
                (ch >= "0" && ch <= "9") ||
                ch === "-" ||
                ch === "+" ||
                ch === "." ||
                ch === "e" ||
                ch === "E"
            ) {
                index++;
                ch = jsonString.charAt(index);
            }
            var numString = jsonString.substring(start, index);
            var num = parseFloat(numString);
            if (isNaN(num)) {
                throw new SyntaxError("Invalid number " + numString);
            }
            return num;
        };

        // Parse a JSON escape sequence
        var parseEscape = function () {
            var ch = jsonString.charAt(index);
            switch (ch) {
                case '"':
                case "\\":
                case "/":
                    index++;
                    return ch;
                case "b":
                    index++;
                    return "\b";
                case "f":
                    index++;
                    return "\f";
                case "n":
                    index++;
                    return "\n";
                case "r":
                    index++;
                    return "\r";
                case "t":
                    index++;
                    return "\t";
                case "u":
                    index++;
                    var hex = jsonString.substring(index, index + 4);
                    var code = parseInt(hex, 16);
                    if (isNaN(code)) {
                        throw new SyntaxError(
                            "Invalid unicode escape sequence " + hex
                        );
                    }
                    index += 4;
                    return String.fromCharCode(code);
                default:
                    throw new SyntaxError("Unexpected escape sequence \\" + ch);
            }
        };

        // Parse a JSON array recursively
        var parseArray = function () {
            var arr = [];
            index++; // Move past the opening '['
            skipSpaces();
            if (jsonString.charAt(index) === "]") { // Check for empty array
                index++;
                return arr;
            }
            while (true) {
                var value = parseValue();
                arr.push(value);
                skipSpaces();
                if (jsonString.charAt(index) === ",") {
                    index++;
                    skipSpaces();
                    if (jsonString.charAt(index) === "]") { // Handle trailing comma
                        throw new SyntaxError("Unexpected end of array");
                    }
                } else if (jsonString.charAt(index) === "]") {
                    index++; // Move past the closing ']'
                    break;
                } else {
                    throw new SyntaxError("Expected ',' or ']' in array");
                }
            }
            return arr;
        };


        // Parse a JSON object recursively
        var parseObject = function () {
            var obj = {};
            index++; // Move past the opening '{'
            skipSpaces();
            if (jsonString.charAt(index) === "}") { // Check for empty object
                index++;
                return obj;
            }
            while (true) {
                if (jsonString.charAt(index) !== '"') {
                    throw new SyntaxError("Expected string key");
                }
                var key = parseString();
                skipSpaces();
                if (jsonString.charAt(index) !== ":") {
                    throw new SyntaxError("Expected ':' after key");
                }
                index++; // Move past the colon
                var value = parseValue();
                obj[key] = value;
                skipSpaces();
                if (jsonString.charAt(index) === ",") {
                    index++;
                    skipSpaces();
                    if (jsonString.charAt(index) === "}") { // Handle trailing comma
                        throw new SyntaxError("Unexpected end of object");
                    }
                } else if (jsonString.charAt(index) === "}") {
                    index++; // Move past the closing '}'
                    break;
                } else {
                    throw new SyntaxError("Expected ',' or '}' in object");
                }
            }
            return obj;
        };


        // Start parsing the JSON string
        var result = parseValue();

        // Make sure there are no trailing characters
        while (index < jsonString.length) {
            var ch = jsonString.charAt(index);
            if (/\s/.test(ch)) {
                index++;
            } else {
                throw new SyntaxError("Unexpected token " + ch);
            }
        }

        return result;
    };
};