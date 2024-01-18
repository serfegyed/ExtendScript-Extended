/**
 * Pad the end of a string with a specified character to a target length.
 *
 * @param {number} targetLength - The desired length of the resulting string.
 * @param {string} padString - The character to pad the string with. Default is a space character.
 * @return {string} - The padded string.
 */
if (!String.prototype.padEnd) {
    String.prototype.padEnd = function (targetLength, padString) {
        padString = padString || "\u0020";
        if (!padString || targetLength <= this.length) return String(this);
        var repeatCount = Math.ceil(
            (targetLength - this.length) / padString.length
        );
        return (
            this + padString.repeat(repeatCount).slice(0, targetLength - this.length)
        );
    };
}