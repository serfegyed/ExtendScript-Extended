/**
 * Returns an iterator of all results matching a string against a regular expression, including capturing groups.
 *
 * @param {RegExp} regexp - The regular expression to match against the string.
 * @throws {TypeError} - If the passed argument is not a regular expression.
 * @throws {TypeError} - If the regexp is not passed with the global flag.
 * @return {Iterator} - An iterator that contains all the matches found in the string.
 */
if (!String.prototype.matchAll) {
    String.prototype.matchAll = function (regexp) {
        "use strict";

        var string;
        var matcher;
        var flags;
        var match;
        var matches = [];

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.matchAll called on null or undefined");
        }

        string = String(this);

        if (regexp instanceof RegExp && !regexp.global) {
            throw new TypeError("matchAll(): Called with a non-global RegExp argument");
        }

        if (regexp instanceof RegExp) {
            flags = "g";
            flags += regexp.ignoreCase ? "i" : "";
            flags += regexp.multiline ? "m" : "";
            matcher = new RegExp(regexp.source, flags);
            matcher.lastIndex = regexp.lastIndex;
        } else {
            matcher = new RegExp(regexp, "g");
        }

        while ((match = matcher.exec(string)) !== null) {
            var matchArray = Array.from(match);
            matchArray.index = match.index;
            matchArray.input = match.input;
            matches.push(matchArray);

            if (match.index === matcher.lastIndex) {
                matcher.lastIndex++;
            }
        }

        return matches.values();
    };
}
