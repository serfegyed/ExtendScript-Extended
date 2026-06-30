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
        var CHUNK_SIZE = 0x4000;
        var codeUnits = [];
        var result = "";

        for (var i = 0, len = arguments.length; i < len; i++) {
            var codePoint = Number(arguments[i]);

            if (
                !isFinite(codePoint) ||
                codePoint < 0 ||
                codePoint > MAX_SIZE ||
                Math.floor(codePoint) !== codePoint
            ) {
                throw new RangeError("Invalid code point " + codePoint);
            }

            if (codePoint <= 0xffff) {
                codeUnits.push(codePoint);
            } else {
                codePoint -= 0x10000;
                codeUnits.push((codePoint >> 10) + 0xd800);
                codeUnits.push((codePoint % 0x400) + 0xdc00);
            }

            if (codeUnits.length >= CHUNK_SIZE) {
                result += String.fromCharCode.apply(null, codeUnits);
                codeUnits = [];
            }
        }

        return result + String.fromCharCode.apply(null, codeUnits);
    };
}
