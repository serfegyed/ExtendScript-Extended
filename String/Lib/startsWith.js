/**
 * Checks if the string starts with the specified substring.
 *
 * @param {string} substring - The substring to check.
 * @return {boolean} Returns true if the string starts with the specified substring, otherwise returns false.
 */
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        "use strict";

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

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.startsWith called on null or undefined");
        }
        string = String(this);
        if (isRegExp(searchString)) {
            throw new TypeError("First argument to String.prototype.startsWith must not be a regular expression");
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
