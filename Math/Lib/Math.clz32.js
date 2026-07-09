/**
 * Counts leading zero bits in the 32-bit unsigned integer conversion.
 *
 * @param {number} value - The value to convert and inspect.
 * @return {number} The number of leading zero bits.
 */
if (!Math.clz32) {
    Math.clz32 = function (value) {
        var number = value >>> 0;
        var count = 0;

        if (number === 0) {
            return 32;
        }

        while ((number & 0x80000000) === 0) {
            count++;
            number <<= 1;
        }
        return count;
    };
}
