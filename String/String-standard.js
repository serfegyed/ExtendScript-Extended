/**
 *	@description: String methods - a possible implementation some of Extendscript's missing String functions
 *	@author: Egyed Serf, 2023
 *	@based on: https://github.com/debrouwere/Extendables/blob/master/patches/string.jsx
 *  @copyright: MIT
 *
 *	Standard functions:
 *		at()			:	Retrieves the character at the specified index of the string.
 *		codePointAt()	:	Retrieves the Unicode code point at the specified position in a string.
 *		endsWith()		:	Tests whether the string ends with the specified substring.
 *		fromCodePoint()	:	Returns a string created by using the specified sequence of code points
 *		includes()		:	Checks if the string includes the given substring.
 *		isWellFormed()	:	Checks whether a string is well-formed.
 *		matchAll()		:	Matches a string against a regular expression
 *		pad()			:	Pads the current string from the beginning and end with a given string
 *		padEnd()		:	Pads the current string from the end with a given string
 *		padStart()		:	Pads the current string from the start with a given string
 *		repeat()		:	Constructs and returns a new string which contains the specified number of copies of the string on which it was called
 *      replaceAll()	:	Replaces all occurrences of a specified search string or regular expression
 *		startsWith()	:	Determines whether a string begins with the characters of a specified string, returning true or false as appropriate
 *		trim()			:	Removes the spaces from both ends of the string.
 *		trimEnd()		:	Removes the spaces from the end of the string.
 *		trimStart()		:	Removes whitespace from the beginning of a string.
 *		toWellFormed()	:	Converts a string to a well-formed string.
 */

/**
 * Retrieves the character at the specified index of the string.
 *
 * @param {number} index - The index of the character to retrieve.
 * @return {string} - The character at the specified index.
 * @example
 *	> $.writeln("hello world".at(0));
 *     "h"
 * @example
 *	> $.writeln("hello world".at(-1));
 *     "e"
 */
if (!String.prototype.at) {
    String.prototype.at = function (index) {
        "use strict";

        function typeError(message) {
            var error = new TypeError(message);

            error.name = "TypeError";
            return error;
        }

        if (this === null || this === undefined ||
                (typeof $ !== "undefined" && $.global && this === $.global)) {
            throw typeError("String.prototype.at called on null or undefined");
        }

        var string = String(this);
        var length = string.length;

        index = Number(index);
        if (index !== index || index === 0) {
            index = 0;
        } else if (index !== Infinity && index !== -Infinity) {
            index = index < 0 ? Math.ceil(index) : Math.floor(index);
        }

        if (index < -length || index >= length) {
            return undefined;
        }

        index = index < 0 ? length + index : index;

        return string.charAt(index);
    };
}

/**
 * Retrieves the Unicode code point at the specified position in a string.
 *
 * @param {number} pos - The position of the code point to retrieve.
 * @return {number|undefined} The Unicode code point at the specified position, or undefined if the position is invalid.
 * @example
 *	> $.writeln("👋👋👋 hello world".codePoint(0));
 *     128075
 */
if (!String.prototype.codePointAt) {
    String.prototype.codePointAt = function (position) {
        "use strict";

        var string;
        var size;
        var number;
        var index;
        var first;
        var second;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.codePointAt called on null or undefined");
        }

        string = String(this);
        size = string.length;
        number = Number(position);
        if (number !== number) {
            number = 0;
        } else if (number !== 0 && number !== Infinity && number !== -Infinity) {
            number = number < 0 ? Math.ceil(number) : Math.floor(number);
        }
        index = number;

        if (index < 0 || index >= size) {
            return undefined;
        }

        first = string.charCodeAt(index);
        if (first < 0xd800 || first > 0xdbff || index + 1 === size) {
            return first;
        }

        second = string.charCodeAt(index + 1);
        if (second < 0xdc00 || second > 0xdfff) {
            return first;
        }

        return (first - 0xd800) * 0x400 + (second - 0xdc00) + 0x10000;
    };
}

/**
 * Determines whether the string ends with the specified substring.
 *
 * @param {String} substring
 * @returns {Bool} True or false.
 */
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        "use strict";

        function typeError(message) {
            var error = new TypeError(message);

            error.name = "TypeError";
            return error;
        }

        function isRegExp(value) {
            var matcher;

            if (value === null || value === undefined) {
                return false;
            }
            if (typeof Symbol !== "undefined" && Symbol.match) {
                matcher = value[Symbol.match];
                if (matcher !== undefined) {
                    return Boolean(matcher);
                }
            }
            return Object.prototype.toString.call(value) === "[object RegExp]";
        }

        var string;
        var search;
        var length;
        var end;
        var number;

        if (this === null || this === undefined ||
                (typeof $ !== "undefined" && $.global && this === $.global)) {
            throw typeError("String.prototype.endsWith called on null or undefined");
        }
        string = String(this);
        if (isRegExp(searchString)) {
            throw typeError("First argument to String.prototype.endsWith must not be a regular expression");
        }
        search = String(searchString);
        length = string.length;

        if (position === undefined) {
            end = length;
        } else {
            number = Number(position);
            if (number !== number) {
                number = 0;
            } else if (number !== 0 && number !== Infinity && number !== -Infinity) {
                number = number < 0 ? Math.ceil(number) : Math.floor(number);
            }
            end = Math.min(Math.max(number, 0), length);
        }

        return string.slice(end - search.length, end) === search;
    };
}

/**
 * Generates a string from the given Unicode code points.
 *
 * @param {number} arguments - The Unicode code points to convert into a string.
 * @throws {RangeError} If an invalid code point is provided.
 * @return {string} The generated string.
 * @example
 *	        >$.writeln(String.fromCodePoint(128075, 128075, 128075) + " hello world");
 *          >"👋👋👋 hello world"
 */
if (!String.fromCodePoint) {
    String.fromCodePoint = function () {
        var MAX_SIZE = 0x10ffff;
        var CHUNK_SIZE = 0x4000;
        var codeUnits = [];
        var result = "";

        for (var i = 0, len = arguments.length; i < len; i++) {
            var codePoint = Number(arguments[i]);

            if (
                !isFinite(codePoint) ||
                codePoint < 0 ||
                codePoint > MAX_SIZE ||
                Math.floor(codePoint) !== codePoint
            ) {
                throw new RangeError("Invalid code point " + codePoint);
            }

            if (codePoint <= 0xffff) {
                codeUnits.push(codePoint);
            } else {
                codePoint -= 0x10000;
                codeUnits.push((codePoint >> 10) + 0xd800);
                codeUnits.push((codePoint % 0x400) + 0xdc00);
            }

            if (codeUnits.length >= CHUNK_SIZE) {
                result += String.fromCharCode.apply(null, codeUnits);
                codeUnits = [];
            }
        }

        return result + String.fromCharCode.apply(null, codeUnits);
    };
}

/**
 * Checks if the string includes the given substring.
 *
 * @param {string} substring - The substring to search for.
 * @param {number} position - The starting position for the search (optional).
 * @return {boolean} Returns true if the substring is found, false otherwise.
 */
if (!String.prototype.includes) {
    String.prototype.includes = function (searchString, position) {
        "use strict";

        function typeError(message) {
            var error = new TypeError(message);

            error.name = "TypeError";
            return error;
        }

        function isRegExp(value) {
            var matcher;

            if (value === null || value === undefined) {
                return false;
            }
            if (typeof Symbol !== "undefined" && Symbol.match) {
                matcher = value[Symbol.match];
                if (matcher !== undefined) {
                    return Boolean(matcher);
                }
            }
            return Object.prototype.toString.call(value) === "[object RegExp]";
        }

        var string;
        var search;
        var start;
        var number;

        if (this === null || this === undefined ||
                (typeof $ !== "undefined" && $.global && this === $.global)) {
            throw typeError("String.prototype.includes called on null or undefined");
        }

        string = String(this);
        if (isRegExp(searchString)) {
            throw typeError("First argument to String.prototype.includes must not be a regular expression");
        }

        search = String(searchString);
        number = position === undefined ? 0 : Number(position);
        if (number !== number) {
            number = 0;
        } else if (number !== 0 && number !== Infinity && number !== -Infinity) {
            number = number < 0 ? Math.ceil(number) : Math.floor(number);
        }
        start = Math.min(Math.max(number, 0), string.length);

        return string.indexOf(search, start) !== -1;
    };
}

/**
 * Checks if a string is well-formed.
 *
 * @return {boolean} Returns true if the string is well-formed, false otherwise.
 */
if (!String.prototype.isWellFormed) {
    String.prototype.isWellFormed = function () {
        "use strict";

        var string;
        var i;
        var code;
        var next;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.isWellFormed called on null or undefined");
        }

        string = String(this);
        for (i = 0; i < string.length; i++) {
            code = string.charCodeAt(i);
            if (code >= 0xd800 && code <= 0xdbff) {
                if (i + 1 >= string.length) {
                    return false;
                }
                next = string.charCodeAt(i + 1);
                if (next < 0xdc00 || next > 0xdfff) {
                    return false;
                }
                i++;
            } else if (code >= 0xdc00 && code <= 0xdfff) {
                return false;
            }
        }

        return true;
    };
}

/**
 * Returns an iterator of all results matching a string against a regular expression, including capturing groups.
 *
 * @param {RegExp} regexp - The regular expression to match against the string.
 * @throws {TypeError} - If the passed argument is not a regular expression.
 * @throws {TypeError} - If the regexp is not passed with the global flag.
 * @return {Iterator} - An iterator that contains all the matches found in the string.
 */
if (!String.prototype.matchAll) {
    String.prototype.matchAll = function (regexp) {
        "use strict";

        var string;
        var matcher;
        var flags;
        var match;
        var matches = [];

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.matchAll called on null or undefined");
        }

        string = String(this);

        if (regexp instanceof RegExp && !regexp.global) {
            throw new TypeError("matchAll(): Called with a non-global RegExp argument");
        }

        if (regexp instanceof RegExp) {
            flags = "g";
            flags += regexp.ignoreCase ? "i" : "";
            flags += regexp.multiline ? "m" : "";
            matcher = new RegExp(regexp.source, flags);
            matcher.lastIndex = regexp.lastIndex;
        } else {
            matcher = new RegExp(regexp, "g");
        }

        while ((match = matcher.exec(string)) !== null) {
            var matchArray = Array.from(match);
            matchArray.index = match.index;
            matchArray.input = match.input;
            matches.push(matchArray);

            if (match.index === matcher.lastIndex) {
                matcher.lastIndex++;
            }
        }

        return matches.values();
    };
}

/**
 * Pad the end of a string with a specified character to a target length.
 *
 * @param {number} targetLength - The desired length of the resulting string.
 * @param {string} padString - The character to pad the string with. Default is a space character.
 * @return {string} - The padded string.
 */
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function (targetLength, padString) {
        "use strict";

        function typeError(message) {
            var error = new TypeError(message);

            error.name = "TypeError";
            return error;
        }

        function rangeError(message) {
            var error = new RangeError(message);

            error.name = "RangeError";
            return error;
        }

        var string;
        var length;
        var number;
        var filler;
        var fillLength;
        var padding = "";

        if (this === null || this === undefined ||
                (typeof $ !== "undefined" && $.global && this === $.global)) {
            throw typeError("String.prototype.padEnd called on null or undefined");
        }

        string = String(this);
        number = Number(targetLength);
        if (number !== number || number <= 0) {
            length = 0;
        } else if (number === Infinity) {
            length = 9007199254740991;
        } else {
            length = Math.floor(number);
            length = Math.min(length, 9007199254740991);
        }

        if (length <= string.length) {
            return string;
        }

        filler = padString === undefined ? " " : String(padString);
        if (filler === "") {
            return string;
        }

        fillLength = length - string.length;
        if (fillLength >= (1 << 28)) {
            throw rangeError("padEnd result exceeds maximum string size");
        }
        while (padding.length < fillLength) {
            padding += filler.slice(0, fillLength - padding.length);
        }

        return string + padding;
    };
}

/**
 * Adds padding to the start of a string until it reaches the target length.
 *
 * @param {number} targetLength - The desired length of the string.
 * @param {string} padString - The string used for padding. Defaults to a space character.
 * @return {string} - The padded string.
 */
if (!String.prototype.padStart) {
    String.prototype.padStart = function (targetLength, padString) {
        "use strict";

        function typeError(message) {
            var error = new TypeError(message);

            error.name = "TypeError";
            return error;
        }

        function rangeError(message) {
            var error = new RangeError(message);

            error.name = "RangeError";
            return error;
        }

        var string;
        var length;
        var number;
        var filler;
        var fillLength;
        var padding = "";

        if (this === null || this === undefined ||
                (typeof $ !== "undefined" && $.global && this === $.global)) {
            throw typeError("String.prototype.padStart called on null or undefined");
        }

        string = String(this);
        number = Number(targetLength);
        if (number !== number || number <= 0) {
            length = 0;
        } else if (number === Infinity) {
            length = 9007199254740991;
        } else {
            length = Math.floor(number);
            length = Math.min(length, 9007199254740991);
        }

        if (length <= string.length) {
            return string;
        }

        filler = padString === undefined ? " " : String(padString);
        if (filler === "") {
            return string;
        }

        fillLength = length - string.length;
        if (fillLength >= (1 << 28)) {
            throw rangeError("padStart result exceeds maximum string size");
        }
        while (padding.length < fillLength) {
            padding += filler.slice(0, fillLength - padding.length);
        }

        return padding + string;
    };
}

/**
 * Repeats the string a specified number of times.
 *
 * @param {number} count - The number of times to repeat the string.
 * @return {string} The repeated string.
 */
if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        "use strict";

        function typeError(message) {
            var error = new TypeError(message);

            error.name = "TypeError";
            return error;
        }

        function rangeError(message) {
            var error = new RangeError(message);

            error.name = "RangeError";
            return error;
        }

        var string;
        var number;
        var result = "";

        if (this === null || this === undefined ||
                (typeof $ !== "undefined" && $.global && this === $.global)) {
            throw typeError("String.prototype.repeat called on null or undefined");
        }

        string = String(this);
        number = Number(count);
        if (number !== number) {
            number = 0;
        } else if (number !== 0 && number !== Infinity && number !== -Infinity) {
            number = number < 0 ? Math.ceil(number) : Math.floor(number);
        }
        if (number < 0 || number === Infinity) {
            throw rangeError("Invalid count value");
        }
        if (string.length === 0 || number === 0) {
            return "";
        }
        if (string.length * number >= (1 << 28)) {
            throw rangeError("repeat count must not overflow maximum string size");
        }

        while (number > 0) {
            if (number % 2 === 1) {
                result += string;
            }
            number = Math.floor(number / 2);
            if (number > 0) {
                string += string;
            }
        }

        return result;
    };
}

/**
 * Replaces all occurrences of a search string with a replacement string in the target string.
 *
 * @param {RegExp|string} search - The search string or regular expression to be replaced.
 * @param {string|function} replacement - The replacement string or a function that returns the replacement string.
 * @return {string} The modified target string with all occurrences of the search string replaced with the replacement string.
 */
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (searchValue, replaceValue) {
        "use strict";

        var string;
        var searchString;
        var escapedSearch;
        var replacement;
        var result;
        var index;
        var matchIndex;

        function emptySubstitution(value, position, input) {
            return String(value).replace(/\$\$|\$&|\$`|\$'/g, function (token) {
                if (token === "$$") return "$";
                if (token === "$&") return "";
                if (token === "$`") return input.slice(0, position);
                return input.slice(position);
            });
        }

        function replaceRegExpWithFunction(input, regexp, replacer) {
            var output = "";
            var nextPosition = 0;
            var current;
            var args;

            regexp.lastIndex = 0;
            while ((current = regexp.exec(input)) !== null) {
                output += input.slice(nextPosition, current.index);
                args = current.slice(0);
                args.push(current.index, input);
                output += String(replacer.apply(undefined, args));
                nextPosition = current.index + current[0].length;
                if (current.index === regexp.lastIndex) {
                    regexp.lastIndex++;
                }
            }
            regexp.lastIndex = 0;
            return output + input.slice(nextPosition);
        }

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.replaceAll called on null or undefined");
        }

        string = String(this);
        if (searchValue instanceof RegExp) {
            if (!searchValue.global) {
                throw new TypeError("replaceAll() must be called with a global RegExp");
            }
            if (typeof replaceValue === "function") {
                return replaceRegExpWithFunction(string, searchValue, replaceValue);
            }
            return string.replace(searchValue, replaceValue);
        }

        searchString = String(searchValue);
        if (searchString === "") {
            result = "";
            for (index = 0; index <= string.length; index++) {
                replacement = typeof replaceValue === "function" ?
                    replaceValue.call(undefined, "", index, string) :
                    emptySubstitution(replaceValue, index, string);
                result += String(replacement);
                if (index < string.length) {
                    result += string.charAt(index);
                }
            }
            return result;
        }
        if (typeof replaceValue === "function") {
            result = "";
            index = 0;
            while ((matchIndex = string.indexOf(searchString, index)) !== -1) {
                result += string.slice(index, matchIndex);
                result += String(replaceValue.call(undefined, searchString, matchIndex, string));
                index = matchIndex + searchString.length;
            }
            return result + string.slice(index);
        }

        escapedSearch = searchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return string.replace(new RegExp(escapedSearch, "g"), replaceValue);
    };
}

/**
 * Checks if the string starts with the specified substring.
 *
 * @param {string} substring - The substring to check.
 * @return {boolean} Returns true if the string starts with the specified substring, otherwise returns false.
 */
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        "use strict";

        function typeError(message) {
            var error = new TypeError(message);

            error.name = "TypeError";
            return error;
        }

        function isRegExp(value) {
            var matcher;

            if (value === null || value === undefined) {
                return false;
            }
            if (typeof Symbol !== "undefined" && Symbol.match) {
                matcher = value[Symbol.match];
                if (matcher !== undefined) {
                    return Boolean(matcher);
                }
            }
            return Object.prototype.toString.call(value) === "[object RegExp]";
        }

        var string;
        var search;
        var start;
        var number;

        if (this === null || this === undefined ||
                (typeof $ !== "undefined" && $.global && this === $.global)) {
            throw typeError("String.prototype.startsWith called on null or undefined");
        }
        string = String(this);
        if (isRegExp(searchString)) {
            throw typeError("First argument to String.prototype.startsWith must not be a regular expression");
        }
        search = String(searchString);
        number = position === undefined ? 0 : Number(position);

        if (number !== number) {
            number = 0;
        } else if (number !== 0 && number !== Infinity && number !== -Infinity) {
            number = number < 0 ? Math.ceil(number) : Math.floor(number);
        }
        start = Math.min(Math.max(number, 0), string.length);

        return string.slice(start, start + search.length) === search;
    };
}

/**
 * Trims the specified characters from the beginning and end of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the string
 * @return {string} The trimmed string
 */
if (!String.prototype.trim) {
    String.prototype.trim = function (chars) {
        "use strict";

        var string;
        var re;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.trim called on null or undefined");
        }

        string = String(this);
        if (!chars) {
            chars = '\\s';
        } else {
            // Create a character class for individual characters to trim
            chars = '[' + chars.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&') + ']';
        }
        re = new RegExp('^' + chars + '+|' + chars + '+$', 'g');
        return string.replace(re, '');
    };
}

/**
 * Trims the specified characters from the end of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the end of the string
 * @return {string} The string with the specified characters trimmed from the end
 */
if (!String.prototype.trimEnd) {
    String.prototype.trimEnd = function (chars) {
        "use strict";

        var string;
        var re;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.trimEnd called on null or undefined");
        }

        string = String(this);
        if (!chars) {
            chars = '\\s';
        } else {
            chars = '[' + chars.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&') + ']';
        }
        re = new RegExp(chars + '+$', 'g');
        return string.replace(re, '');
    };
}

/**
 * Trims the specified characters from the beginning of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the beginning of the string.
 * @return {string} The string with the specified characters trimmed from the beginning.
 */
if (!String.prototype.trimStart) {
    String.prototype.trimStart = function (chars) {
        "use strict";

        var string;
        var re;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.trimStart called on null or undefined");
        }

        string = String(this);
        if (!chars) {
            chars = '\\s';
        } else {
            chars = '[' + chars.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&') + ']';
        }
        re = new RegExp('^' + chars + '+', 'g');
        return string.replace(re, '');
    };
}

/**
 * Converts a string to a well-formed string.
 *
 * @return {string} The well-formed string.
 */
if (!String.prototype.toWellFormed) {
    String.prototype.toWellFormed = function () {
        "use strict";

        var string;
        var result = "";
        var i;
        var code;
        var next;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.toWellFormed called on null or undefined");
        }

        string = String(this);
        for (i = 0; i < string.length; i++) {
            code = string.charCodeAt(i);
            if (code >= 0xd800 && code <= 0xdbff) {
                if (i + 1 < string.length) {
                    next = string.charCodeAt(i + 1);
                    if (next >= 0xdc00 && next <= 0xdfff) {
                        result += string.charAt(i) + string.charAt(i + 1);
                        i++;
                        continue;
                    }
                }
                result += "\ufffd";
            } else if (code >= 0xdc00 && code <= 0xdfff) {
                result += "\ufffd";
            } else {
                result += string.charAt(i);
            }
        }

        return result;
    };
}

