/**
 *	@description: String methods - a possible implementation some of Extendscript's missing String functions
 *	@author: Egyed Serf, 2023
 *	@based on: https://github.com/debrouwere/Extendables/blob/master/patches/string.jsx
 *  @copyright: MIT
 * 
 *	Non-standard functions:
 *		contains()		:	Checks if the string contains a specific substring.
 *		format()		:	Formats a string by replacing placeholders with values.
 *		indexAfter()	:	Returns the index of the character immediately following the first occurrence of the specified substring.
 *		insert()	    :	Inserts the specified element at the specified index in the string.
 *		isEmpty()		:	Checks if a string is empty.
 *		reverse()		:	Reverses the order of the characters in the string
 */

/**
 * Checks if the string contains a specific substring.
 *
 * @param {string} substring - The substring to check for.
 * @return {boolean} Returns true if the string contains the substring, false otherwise.
 */
if (!String.prototype.contains) {
    String.prototype.contains = function (substring) {
        return String(this).indexOf(String(substring)) !== -1;
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
        var string = String(this);
        var isNamed = typeof arguments[0] === "object" && arguments[0] !== null;
        var values;
        var marker;
        var index;
        var key;
        var i;

        if (isNamed) {
            values = arguments[0];
            for (key in values) {
                if (Object.prototype.hasOwnProperty.call(values, key)) {
                    marker = "{" + key + "}";
                    string = string.split(marker).join(String(values[key]));
                }
            }
        } else {
            for (i = 0; i < arguments.length; i++) {
                index = string.indexOf("{}");
                if (index === -1) {
                    break;
                }
                string = string.slice(0, index) + String(arguments[i]) +
                    string.slice(index + 2);
            }
        }

        return string;
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
        var string = String(this);
        var search = String(substring);
        var index = string.indexOf(search);

        return index === -1 ? -1 : index + search.length;
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
    String.prototype.insert = function (element, index) {
        var string = String(this);
        var insertion = String(element);
        var position = Number(index);

        if (!isFinite(position) || position < 0 || position > string.length) {
            throw new RangeError("String.insert: index out of range");
        }

        position = Math.floor(position);
        return string.slice(0, position) + insertion + string.slice(position);
    };
}

/**
 * Checks if a string is empty.
 *
 * @param {String} str - The string to check.
 * @return {boolean} Returns true if the string is empty, otherwise false.
 */
if (!String.isEmpty) {
    String.isEmpty = function (string) {
        if (typeof string !== "string") {
            throw new TypeError(string + " is not a String");
        }

        return string.length === 0;
    };
}

/**
 * Reverses the characters in a string.
 *
 * @return {string} - The reversed string.
 */
if (!String.prototype.reverse) {
    String.prototype.reverse = function () {
        var string = String(this);
        var characters = string.match(/[\ud800-\udbff][\udc00-\udfff]|[\s\S]/g);

        return characters ? characters.reverse().join("") : "";
    };
}
