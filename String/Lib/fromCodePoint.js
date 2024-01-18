/**
 * Generates a string from the given Unicode code points.
 *
 * @param {number} arguments - The Unicode code points to convert into a string.
 * @throws {RangeError} If an invalid code point is provided.
 * @return {string} The generated string.
 * @example
 *	        >$.writeln(String.fromCodePoint(128075, 128075, 128075) + " hello world");
 *          >"👋👋👋 hello world"
 */
if (!String.fromCodePoint) {
    String.fromCodePoint = function () {
        var MAX_SIZE = 0x10ffff;
        var codeUnits = [];

        for (var i = 0, len = arguments.length; i < len; i++) {
            var codePoint = Number(arguments[i]);

            // Check if the code point is valid
            if (
                !isFinite(codePoint) || // Negative, NaN, or Infinity
                codePoint < 0 || // Less than 0
                codePoint > MAX_SIZE || // Greater than the maximum value
                Math.floor(codePoint) !== codePoint
            ) {
                // Not an integer
                throw new RangeError("Invalid code point " + codePoint); // Throw an error
            }

            if (codePoint <= 0xffff) {
                // BMP code point
                codeUnits.push(codePoint);
            } else {
                // Supplementary code point
                codePoint -= 0x10000;
                codeUnits.push((codePoint >> 10) + 0xd800); // High surrogate
                codeUnits.push((codePoint % 0x400) + 0xdc00); // Low surrogate
            }
        }

        return String.fromCharCode.apply(null, codeUnits);
    };
}