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
