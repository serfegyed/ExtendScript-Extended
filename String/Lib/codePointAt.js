/**
 * Retrieves the Unicode code point at the specified position in a string.
 *
 * @param {number} pos - The position of the code point to retrieve.
 * @return {number|undefined} The Unicode code point at the specified position, or undefined if the position is invalid.
 * @example
 *	> $.writeln("👋👋👋 hello world".codePoint(0));
 *     128075
 */
if (!String.prototype.codePointAt) {
    String.prototype.codePointAt = function (pos) {
        var str = String(this);
        var size = str.length;

        if (typeof pos !== 'number' || isNaN(pos) || pos < 0 || pos >= size) {
            return undefined;
        }

        var code = str.charCodeAt(pos);
        if (code >= 0xd800 && code <= 0xdbff && pos < size - 1) {
            var hi = code;
            var lo = str.charCodeAt(pos + 1);
            if (lo >= 0xdc00 && lo <= 0xdfff) {
                code = (hi - 0xd800) * 0x400 + (lo - 0xdc00) + 0x10000;
            }
        }
        return code;
    };
}