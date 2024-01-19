/**
 * Returns an iterator of all results matching a string against a regular expression, including capturing groups.
 *
 * @param {RegExp} regexp - The regular expression to match against the string.
 * @throws {TypeError} - If the passed argument is not a regular expression.
 * @return {Iterator} - An iterator that contains all the matches found in the string.
 */
if (!String.prototype.matchAll) {
    String.prototype.matchAll = function (regexp) {
        if (!(regexp instanceof RegExp)) {
            throw new TypeError("Argument must be a regular expression");
        }

        if (!regexp.global) {
            regexp = new RegExp(regexp.source, 'g');
        }

        var match;
        var matches = [];

        while ((match = regexp.exec(this)) !== null) {
            var matchArray = Array.from(match);
            matchArray.index = match.index;
            matchArray.input = match.input;
            matches.push(matchArray);

            if (match.index === regexp.lastIndex) {
                regexp.lastIndex++;
            }
        }
        return matches.values(); // Using Array.prototype.values
    };
}