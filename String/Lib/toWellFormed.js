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
