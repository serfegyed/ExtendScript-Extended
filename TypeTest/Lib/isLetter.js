/**
 * Checks if a character is a letter.
 *
 * @param {string} chr - The character to check.
 * @return {boolean} Returns true if the character is a letter, otherwise returns false.
 */
if (typeof isLetter === "undefined") {
    function isLetter(chr) {
        return /[a-zA-ZÀ-ÖØ-öø-ž]/.test(chr);
    };
};