/**
 *	@description: String methods - a possible implementation some of Extendscript's missing String functions
 *	@author: Egyed Serf, 2023
 *	@based on: https://github.com/debrouwere/Extendables/blob/master/patches/string.jsx
 *  @copyright: MIT
 * 
 *	Non-standard functions:
 *		chop()			:	Removes specified characters from the start and end of a string.
 *		chopEnd()		:	Removes trailing characters from the string until the last occurrence of the specified character.
 *		chopStart()		:	Removes leading characters from the string until the first occurrence of the specified character.
 *		contains()		:	Checks if the string contains a specific substring.
 *		format()		:	Formats a string by replacing placeholders with values.
 *		indexAfter()	:	Returns the index of the character immediately following the first occurrence of the specified substring.
 *		insert()	    :	Inserts the specified element at the specified index in the string.
 *		isEmpty()		:	Checks if a string is empty.
 *		reverse()		:	Reverses the order of the characters in the string
 */

/**
 * Removes specified characters from the start and end of a string.
 *
 * @param {string} chr - The character(s) to be removed.
 * @return {string} - The modified string with the specified characters removed.
 * @example
 *     > $.writeln("   hello world   ".trim());
 *     "hello world"
 * @example
 * > $.writeln("*-*-*-hello world*-*-*-".trim("*-"));
 *     "hello world"
 */
if (!String.prototype.chop) {
    String.prototype.chop = function (chr) {
        return chr ? this.chopStart(chr).chopEnd(chr) : this.replace(/^\s+|\s+$/g, "");
    };
}

/**
 * Removes trailing characters from the end of a string.
 *
 * @param {string} chr - The character or characters to remove.
 * @return {string} - The modified string.
 * @example 
 *	> $.writeln("   hello world   ".trimEnd());
 *     "   hello world"
 * @example 
    > $.writeln("*-*-*-hello world*-*-*-".trimEnd("*-"));
 *     "*-*-*-hello world"
 */
if (!String.prototype.chopEnd) {
    String.prototype.chopEnd = function (chr) {
        if (!chr) {
            return this.replace(/\s+$/, "");
        } else {
            return this.endsWith(chr)
                ? this.slice(0, -chr.length).chopEnd(chr)
                : this;
        }
    };
}


/**
 * Removes leading characters from the string until the first occurrence of the specified character.
 *
 * @param {string} chr - The character to search for.
 * @return {string} - The resulting string after removing the leading characters.
 * @example > $.writeln("   hello world   ".trimStart());
 *     "hello world   "
 * @example > $.writeln("*-*-*-hello world*-*-*-".trimStart("*-"));
 *     "hello world*-*-*-"
 */
if (!String.prototype.chopStart) {
    String.prototype.chopStart = function (chr) {
        if (!chr) {
            return this.replace(/^\s+/, "");
        } else {
            return this.startsWith(chr) ? this.substring(chr.length).chopStart(chr) : this;
        }
    };
}

/**
 * Checks if the string contains a specific substring.
 *
 * @param {string} substring - The substring to check for.
 * @return {boolean} Returns true if the string contains the substring, false otherwise.
 */
if (!String.prototype.contains) {
    String.prototype.contains = function (substring) {
        return this.indexOf(substring) !== -1;
    };
}

/**
 * Formats a string by replacing placeholders with values.
 * This is a narrowed ExtendScript version of ES6 Template literal
 * 
 * @desc In unnamed mode, specify placeholders with the `{}` symbol.
 *   In named mode, specify placeholders with `{propname}`.
 *
 * @param {...*} values - The values to replace the placeholders with.
 * @return {string} The formatted string.
 * @example - Unnamed mode
 *     > var person = {'salutation': 'mister', 'name': 'John Smith'};
 *     > var hello = "hello {}, I've heard your name is {}!".format(person.salutation, person.name);
 *     > $.writeln(hello);
 *     "hello mister, I've heard your name is John Smith"
 * @example - Named mode
 *     > var person = {'salutation': 'mister', 'name': 'John Smith'};
 *     > var hello = "hello {salutation}, I've heard your name is {name}!".format(person);
 *     > $.writeln(hello);
 *     "hello mister, I've heard your name is John Smith"
 */
if (!String.prototype.format) {
    String.prototype.format = function () {
        var str = this;
        var isNamed = typeof arguments[0] === "object" && arguments[0] !== null;

        if (isNamed) {
            var dict = arguments[0];
            for (var key in dict) {
                if (dict.hasOwnProperty(key)) {
                    str = str.replace("{" + key + "}", dict[key], "g");
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                str = str.replace('{}', arguments[i]);
            }
        }
        return str;
    };
}

/**
 * Returns the index of the character immediately following the first occurrence of the specified substring.
 *
 * @param {string} substring - The substring to search for.
 * @return {number} The index after the first occurrence of the substring. If the substring is not found, returns -1.
 */
if (!String.prototype.indexAfter) {
    String.prototype.indexAfter = function (substring) {
        return (index = this.indexOf(substring)) === -1 ? index : index + substring.length;
    };
}

/**
 * Inserts the specified element at the specified index in the string.
 *
 * @param {any} elem - The element to insert.
 * @param {number} index - The index at which to insert the element.
 * @throws {RangeError} If the index is out of range.
 * @return {string} The modified string with the element inserted.
 */
if (!String.prototype.insert) {
    String.prototype.insert = function (elem, index) {
        elem = String(elem);  // Convert elem to a string
        if (index < 0 || index > this.length) {
            throw new RangeError("String.insert: index out of range");
        }

        if (elem === '') {
            return this;
        }

        return this.slice(0, index) + elem + this.slice(index);
    };
}

/**
 * Checks if a string is empty.
 *
 * @param {String} str - The string to check.
 * @return {boolean} Returns true if the string is empty, otherwise false.
 */
if (!String.isEmpty) {
    String.isEmpty = function (str) {
        if (typeof str !== "string")
            throw new TypeError(str + " is not a String");
        return str.length === 0 ? true : false;
    };
}

/**
 * Reverses the characters in a string.
 *
 * @return {string} - The reversed string.
 */
if (!String.prototype.reverse) {
    String.prototype.reverse = function () {
        return this.split("").reverse().join("");
    };
}