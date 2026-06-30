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
