/**
 * Clears the array by setting its length to 0.
 *
 * @return {Array} The cleared array.
 */
if (!Array.prototype.clear) {
    Array.prototype.clear = function () {
        this.length = 0;
        return this;
    };
};