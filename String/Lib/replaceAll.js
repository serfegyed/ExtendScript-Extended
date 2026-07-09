/**
 * Replaces all occurrences of a search string with a replacement string in the target string.
 *
 * @param {RegExp|string} searchValue - The search string or regular expression to be replaced.
 * @param {string|function} replaceValue - The replacement string or a function that returns the replacement string.
 * @return {string} The modified target string with all occurrences of the search string replaced with the replacement string.
 */
if (!String.prototype.replaceAll) {
    String.prototype.replaceAll = function (searchValue, replaceValue) {
        "use strict";

        var string;
        var searchString;
        var escapedSearch;
        var replacement;
        var result;
        var index;
        var matchIndex;

        function emptySubstitution(value, position, input) {
            return String(value).replace(/\$\$|\$&|\$`|\$'/g, function (token) {
                if (token === "$$") return "$";
                if (token === "$&") return "";
                if (token === "$`") return input.slice(0, position);
                return input.slice(position);
            });
        }

        function replaceRegExpWithFunction(input, regexp, replacer) {
            var output = "";
            var nextPosition = 0;
            var current;
            var replacementArguments;

            regexp.lastIndex = 0;
            while ((current = regexp.exec(input)) !== null) {
                output += input.slice(nextPosition, current.index);
                replacementArguments = current.slice(0);
                replacementArguments.push(current.index, input);
                output += String(replacer.apply(undefined, replacementArguments));
                nextPosition = current.index + current[0].length;
                if (current.index === regexp.lastIndex) {
                    regexp.lastIndex++;
                }
            }
            regexp.lastIndex = 0;
            return output + input.slice(nextPosition);
        }

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.replaceAll called on null or undefined");
        }

        string = String(this);
        if (searchValue instanceof RegExp) {
            if (!searchValue.global) {
                throw new TypeError("replaceAll() must be called with a global RegExp");
            }
            if (typeof replaceValue === "function") {
                return replaceRegExpWithFunction(string, searchValue, replaceValue);
            }
            return string.replace(searchValue, replaceValue);
        }

        searchString = String(searchValue);
        if (searchString === "") {
            result = "";
            for (index = 0; index <= string.length; index++) {
                replacement = typeof replaceValue === "function" ?
                    replaceValue.call(undefined, "", index, string) :
                    emptySubstitution(replaceValue, index, string);
                result += String(replacement);
                if (index < string.length) {
                    result += string.charAt(index);
                }
            }
            return result;
        }
        if (typeof replaceValue === "function") {
            result = "";
            index = 0;
            while ((matchIndex = string.indexOf(searchString, index)) !== -1) {
                result += string.slice(index, matchIndex);
                result += String(replaceValue.call(undefined, searchString, matchIndex, string));
                index = matchIndex + searchString.length;
            }
            return result + string.slice(index);
        }

        escapedSearch = searchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return string.replace(new RegExp(escapedSearch, "g"), replaceValue);
    };
}
