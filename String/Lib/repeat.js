/**
 * Repeats the string a specified number of times.
 *
 * @param {number} count - The number of times to repeat the string.
 * @return {string} The repeated string.
 */
if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        if (this == null) {
            throw new TypeError("can't convert " + this + " to object");
        }
        var str = '' + this; // Ensure it's a string
        count = +count; // Convert to a number
        if (count !== count) {
            count = 0; // NaN handling
        }
        if (count < 0 || count === Infinity) {
            throw new RangeError("Invalid count value");
        }
        count = Math.floor(count);
        if (str.length === 0 || count === 0) {
            return '';
        }
        // Ensuring count is a 31-bit integer allows us to heavily optimize the main part.
        if (str.length * count >= 1 << 28) {
            throw new RangeError("repeat count must not overflow maximum string size");
        }

        var maxCount = str.length * count;
        count = Math.floor(Math.log(count) / Math.log(2));
        while (count) {
            str += str;
            count--;
        }
        str += str.substring(0, maxCount - str.length);
        return str;
    };
}