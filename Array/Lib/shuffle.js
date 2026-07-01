/**
 * Shuffles indexed slots in place using Fisher-Yates.
 */
if (!Array.prototype.shuffle) {
    Array.prototype.shuffle = function () {
        "use strict";

        var i = this.length;
        var j;
        var hasI;
        var hasJ;
        var valueI;
        var valueJ;

        while (--i > 0) {
            j = Math.floor(Math.random() * (i + 1));
            hasI = i in this;
            hasJ = j in this;
            valueI = this[i];
            valueJ = this[j];
            if (hasJ) this[i] = valueJ;
            else delete this[i];
            if (hasI) this[j] = valueI;
            else delete this[j];
        }
        return this;
    };
}
