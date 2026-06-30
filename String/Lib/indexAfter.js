/**
 * Returns the index immediately after the first matching substring.
 *
 * @param {string} substring - The substring to search for.
 * @return {number} The index after the match, or -1 when not found.
 */
if (!String.prototype.indexAfter) {
    String.prototype.indexAfter = function (substring) {
        var string = String(this);
        var search = String(substring);
        var index = string.indexOf(search);

        return index === -1 ? -1 : index + search.length;
    };
}
