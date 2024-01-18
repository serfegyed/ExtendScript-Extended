/**
 * Checks whether the given character is a digit.
 *
 * @param {string} chr - The character to be checked.
 * @return {boolean} True if the character is a digit, false otherwise.
 */
if (typeof isDigit === "undefined") {
    function isDigit(chr) {
        return /[0-9]/.test(chr);
    };
};