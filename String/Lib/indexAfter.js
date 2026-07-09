/**
 * Returns the index immediately after the first matching search text.
 *
 * @param {string} searchString - The text to search for.
 * @return {number} The index after the match, or -1 when not found.
 */
if (!String.prototype.indexAfter) {
    String.prototype.indexAfter = function (searchString) {
        var string = String(this);
        var search = String(searchString);
        var index = string.indexOf(search);

        return index === -1 ? -1 : index + search.length;
    };
}
