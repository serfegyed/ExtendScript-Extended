/**
 * Checks whether a string contains specified search text.
 *
 * @param {string} searchString - The text to search for.
 * @return {boolean} True when the search text is present.
 */
if (!String.prototype.contains) {
    String.prototype.contains = function (searchString) {
        return String(this).indexOf(String(searchString)) !== -1;
    };
}
