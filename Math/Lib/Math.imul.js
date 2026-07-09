/**
 * Performs C-like 32-bit integer multiplication.
 *
 * @param {number} a - The first multiplicand.
 * @param {number} b - The second multiplicand.
 * @return {number} The signed 32-bit multiplication result.
 */
if (!Math.imul) {
    Math.imul = function (a, b) {
        var ah = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;

        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
    };
}
