/**
 * Checks whether the given character is a digit.
 *
 * @param {string} character - The character to be checked.
 * @return {boolean} True if the character is a digit, false otherwise.
 */
if (typeof isDigit === "undefined") {
    function isDigit(character) {
        return typeof character === "string" &&
            character.length === 1 &&
            /^[0-9]$/.test(character);
    };
};
