/**
 * Adds padding to the start of a string until it reaches the target length.
 *
 * @param {number} targetLength - The desired length of the string.
 * @param {string} padString - The string used for padding. Defaults to a space character.
 * @return {string} - The padded string.
 */
if (!String.prototype.padStart) {
    String.prototype.padStart = function (targetLength, padString) {
        padString = padString || ' ';
        targetLength = Math.max(targetLength, this.length);  // Target length cannot be less than the string's current length

        if (this.length === targetLength) {
            return String(this);
        }

        var repeatTimes = Math.ceil((targetLength - this.length) / padString.length);

        // Build the padded string and return it
        var paddedString = padString.repeat(repeatTimes).slice(0, targetLength - this.length) + this;
        return paddedString;
    };
};