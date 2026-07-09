/**
 * Checks if a character is a letter.
 *
 * @param {string} character - The character to check.
 * @return {boolean} Returns true if the character is a letter, otherwise returns false.
 */
if (typeof isLetter === "undefined") {
    function isLetter(character) {
        return typeof character === "string" &&
            character.length === 1 &&
            /^[a-zA-ZÀ-ÖØ-öø-ž]$/.test(character);
    };
};
