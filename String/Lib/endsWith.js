/**
 * Determines whether the string ends with the specified search text.
 *  
 * @param {String} searchString - The text to search for.
 * @param {number} position - Optional end position.
 * @returns {Bool} True or false.
 */
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        "use strict";

        function isRegExp(value) {
            if (value === null || value === undefined) {
                return false;
            }
            return Object.prototype.toString.call(value) === "[object RegExp]";
        }

        var string;
        var search;
        var length;
        var end;
        var number;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.endsWith called on null or undefined");
        }
        string = String(this);
        if (isRegExp(searchString)) {
            throw new TypeError("First argument to String.prototype.endsWith must not be a regular expression");
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
