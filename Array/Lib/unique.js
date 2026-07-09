/**
 * Returns the first present value for every unique SameValueZero key.
 */
if (!Array.prototype.unique) {
    function toLength(value) {
        var number = Number(value);

        if (number !== number || number <= 0) return 0;
        if (number === Infinity) return 9007199254740991;
        return Math.min(Math.floor(number), 9007199254740991);
    }

    Array.prototype.unique = function (callback, thisArg) {
        "use strict";

        var object;
        var length;
        var result = [];
        var keys = [];
        var value;
        var key;
        var seen;
        var i;
        var j;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.unique called on null or undefined.");
        }
        if (callback !== undefined && typeof callback !== "function") {
            throw new TypeError("Array.prototype.unique: callback must be a function.");
        }
        object = Object(this);
        length = toLength(object.length);
        for (i = 0; i < length; i++) {
            if (i in object) {
                value = object[i];
                key = callback === undefined ? value :
                    callback.call(thisArg, value, i, object);
                seen = false;
                for (j = 0; j < keys.length; j++) {
                    if (keys[j] === key || (keys[j] !== keys[j] && key !== key)) {
                        seen = true;
                        break;
                    }
                }
                if (!seen) {
                    keys[keys.length] = key;
                    result[result.length] = value;
                }
            }
        }
        return result;
    };
}
