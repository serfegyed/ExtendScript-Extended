/**
 * Retrieves the Unicode code point at the specified position in a string.
 *
 * @param {number} position - The position of the code point to retrieve.
 * @return {number|undefined} The Unicode code point at the specified position, or undefined if the position is invalid.
 * @example
 *	> $.writeln("👋👋👋 hello world".codePoint(0));
 *     128075
 */
if (!String.prototype.codePointAt) {
    String.prototype.codePointAt = function (position) {
        "use strict";

        var string;
        var size;
        var number;
        var index;
        var first;
        var second;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.codePointAt called on null or undefined");
        }

        string = String(this);
        size = string.length;
        number = Number(position);
        if (number !== number) {
            number = 0;
        } else if (number !== 0 && number !== Infinity && number !== -Infinity) {
            number = number < 0 ? Math.ceil(number) : Math.floor(number);
        }
        index = number;

        if (index < 0 || index >= size) {
            return undefined;
        }

        first = string.charCodeAt(index);
        if (first < 0xd800 || first > 0xdbff || index + 1 === size) {
            return first;
        }

        second = string.charCodeAt(index + 1);
        if (second < 0xdc00 || second > 0xdfff) {
            return first;
        }

        return (first - 0xd800) * 0x400 + (second - 0xdc00) + 0x10000;
    };
}
