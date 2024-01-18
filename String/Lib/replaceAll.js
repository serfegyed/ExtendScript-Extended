/**
 * Replaces all occurrences of a search string with a replacement string in the target string.
 *
 * @param {RegExp|string} search - The search string or regular expression to be replaced.
 * @param {string|function} replacement - The replacement string or a function that returns the replacement string.
 * @return {string} The modified target string with all occurrences of the search string replaced with the replacement string.
 */
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        if (search instanceof RegExp) {
            if (!search.global) {
                throw new TypeError('replaceAll() must be called with a global RegExp');
            }
            return target.replace(search, replacement);
        } else {
            if (search === '') {  // Handle empty string case
                return replacement + target.split(search).join(replacement) + replacement;
            } else {
                if (typeof replacement === 'function') {
                    var match;
                    var result = '';
                    var index = 0;
                    while ((match = target.indexOf(search, index)) !== -1) {
                        result += target.slice(index, match) + replacement.call(undefined, search, match, target);
                        index = match + search.length;
                    }
                    result += target.slice(index);
                    return result;
                } else {
                    return target.split(search).join(replacement);
                }
            }
        }
    };
}