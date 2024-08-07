﻿/**
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
        // Check if index is a number and not NaN
        if (typeof index !== 'number' || isNaN(index)) {
            throw new TypeError('Index must be a valid number');
        }
        // Check range
        if (index < -this.length || index >= this.length) {
            return undefined;
        }

        // Adjust negative index
        index = index < 0 ? this.length + index : index;

        return this.charAt(index);
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
    String.prototype.codePointAt = function (pos) {
        var str = String(this);
        var size = str.length;

        if (typeof pos !== 'number' || isNaN(pos) || pos < 0 || pos >= size) {
            return undefined;
        }

        var code = str.charCodeAt(pos);
        if (code >= 0xd800 && code <= 0xdbff && pos < size - 1) {
            var hi = code;
            var lo = str.charCodeAt(pos + 1);
            if (lo >= 0xdc00 && lo <= 0xdfff) {
                code = (hi - 0xd800) * 0x400 + (lo - 0xdc00) + 0x10000;
            }
        }
        return code;
    };
}

/**
 * Determines whether the string ends with the specified substring.
 *
 * @param {String} substring
 * @returns {Bool} True or false.
 */
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (substring) {
        return this.slice(-substring.length) === substring;
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
        var codeUnits = [];

        for (var i = 0, len = arguments.length; i < len; i++) {
            var codePoint = Number(arguments[i]);

            // Check if the code point is valid
            if (
                !isFinite(codePoint) || // Negative, NaN, or Infinity
                codePoint < 0 || // Less than 0
                codePoint > MAX_SIZE || // Greater than the maximum value
                Math.floor(codePoint) !== codePoint
            ) {
                // Not an integer
                throw new RangeError("Invalid code point " + codePoint); // Throw an error
            }

            if (codePoint <= 0xffff) {
                // BMP code point
                codeUnits.push(codePoint);
            } else {
                // Supplementary code point
                codePoint -= 0x10000;
                codeUnits.push((codePoint >> 10) + 0xd800); // High surrogate
                codeUnits.push((codePoint % 0x400) + 0xdc00); // Low surrogate
            }
        }

        return String.fromCharCode.apply(null, codeUnits);
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
    String.prototype.includes = function (substring, position) {
        position = position || 0;
        return this.indexOf(substring, position) !== -1;
    };
}

/**
 * Checks if a string is well-formed.
 *
 * @return {boolean} Returns true if the string is well-formed, false otherwise.
 */
if (!String.prototype.isWellFormed) {
    String.prototype.isWellFormed = function () {
        var str = this;
        for (var i = 0; i < str.length; ++i) {
            var isSurrogate = (str.charCodeAt(i) & 0xf800) === 0xd800;
            if (!isSurrogate) {
                continue;
            }
            var isLeadingSurrogate = str.charCodeAt(i) < 0xdc00;
            if (!isLeadingSurrogate) {
                return false; // unpaired trailing surrogate
            }
            var isFollowedByTrailingSurrogate =
                i + 1 < str.length && (str.charCodeAt(i + 1) & 0xfc00) === 0xdc00;
            if (!isFollowedByTrailingSurrogate) {
                return false; // unpaired leading surrogate
            }
            ++i;
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
        if (!(regexp instanceof RegExp)) {
            throw new TypeError("matchAll(): Argument must be a regular expression");
        };

        if (!regexp.global) {
            throw new TypeError("matchAll(): Called with a non-global RegExp argument");
        };

        var match;
        var matches = [];

        while ((match = regexp.exec(this)) !== null) {
            var matchArray = Array.from(match);
            matchArray.index = match.index;
            matchArray.input = match.input;
            matches.push(matchArray);

            if (match.index === regexp.lastIndex) {
                regexp.lastIndex++;
            }
        }
        return matches.values(); // Using Array.prototype.values
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
        padString = padString || "\u0020";
        if (!padString || targetLength <= this.length) return String(this);
        var repeatCount = Math.ceil(
            (targetLength - this.length) / padString.length
        );
        return (
            this + padString.repeat(repeatCount).slice(0, targetLength - this.length)
        );
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
        padString = padString || ' ';
        targetLength = Math.max(targetLength, this.length);  // Target length cannot be less than the string's current length

        if (this.length === targetLength) {
            return String(this);
        }

        var repeatTimes = Math.ceil((targetLength - this.length) / padString.length);

        // Build the padded string and return it
        var paddedString = padString.repeat(repeatTimes).slice(0, targetLength - this.length) + this;
        return paddedString;
    };
};

/**
 * Repeats the string a specified number of times.
 *
 * @param {number} count - The number of times to repeat the string.
 * @return {string} The repeated string.
 */
if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        if (this == null) {
            throw new TypeError("can't convert " + this + " to object");
        }
        var str = '' + this; // Ensure it's a string
        count = +count; // Convert to a number
        if (count !== count) {
            count = 0; // NaN handling
        }
        if (count < 0 || count === Infinity) {
            throw new RangeError("Invalid count value");
        }
        count = Math.floor(count);
        if (str.length === 0 || count === 0) {
            return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the main part.
        if (str.length * count >= 1 << 28) {
            throw new RangeError("repeat count must not overflow maximum string size");
        }

        var maxCount = str.length * count;
        count = Math.floor(Math.log(count) / Math.log(2));
        while (count) {
            str += str;
            count--;
        }
        str += str.substring(0, maxCount - str.length);
        return str;
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
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        if (search instanceof RegExp) {
            if (!search.global) {
                throw new TypeError('replaceAll() must be called with a global RegExp');
            }
            return target.replace(search, replacement);
        } else {
            if (search === '') {  // Handle empty string case
                return replacement + target.split(search).join(replacement) + replacement;
            } else {
                if (typeof replacement === 'function') {
                    var match;
                    var result = '';
                    var index = 0;
                    while ((match = target.indexOf(search, index)) !== -1) {
                        result += target.slice(index, match) + replacement.call(undefined, search, match, target);
                        index = match + search.length;
                    }
                    result += target.slice(index);
                    return result;
                } else {
                    return target.split(search).join(replacement);
                }
            }
        }
    };
}

/**
 * Checks if the string starts with the specified substring.
 *
 * @param {string} substring - The substring to check.
 * @return {boolean} Returns true if the string starts with the specified substring, otherwise returns false.
 */
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (substring) {
        return this.substring(0, substring.length) === substring;
    };
};

/**
 * Trims the specified characters from the beginning and end of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the string
 * @return {string} The trimmed string
 */
String.prototype.trim = function (chars) {
    if (!chars) {
        chars = '\\s';
    } else {
        // Create a character class for individual characters to trim
        chars = '[' + chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ']';
    }
    var re = new RegExp('^' + chars + '+|' + chars + '+$', 'g');
    return this.replace(re, '');
};

/**
 * Trims the specified characters from the end of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the end of the string
 * @return {string} The string with the specified characters trimmed from the end
 */
String.prototype.trimEnd = function (chars) {
    if (!chars) {
        chars = '\\s';
    } else {
        chars = '[' + chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ']';
    }
    var re = new RegExp(chars + '+$', 'g');
    return this.replace(re, '');
};

/**
 * Trims the specified characters from the beginning of the string.
 * This is an extension of the original standard method.
 * See: https://github.com/Kingwl/proposal-string-trim-characters
 *
 * @param {string} chars - The characters to trim from the beginning of the string.
 * @return {string} The string with the specified characters trimmed from the beginning.
 */
String.prototype.trimStart = function (chars) {
    if (!chars) {
        chars = '\\s';
    } else {
        chars = '[' + chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ']';
    }
    var re = new RegExp('^' + chars + '+', 'g');
    return this.replace(re, '');
};

/**
 * Converts a string to a well-formed string.
 *
 * @return {string} The well-formed string.
 */
if (!String.prototype.toWellFormed) {
    String.prototype.toWellFormed = function () {
        if (!this.isWellFormed()) {
            return this.replace(/[\uD800-\uDFFF]/g, "\uFFFD");
        }

        return String(this);
    };
};

