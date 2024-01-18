/**
 * Retrieves the character at the specified index of the string.
 *
 * @param {number} index - The index of the character to retrieve.
 * @return {string} - The character at the specified index.
 * @example 
 *	> $.writeln("hello world".at(0));
 *     "h"
 * @example 
 *	> $.writeln("hello world".at(-1));
 *     "e"
 */
if (!String.prototype.at) {
    String.prototype.at = function (index) {
        // Check if index is a number and not NaN
        if (typeof index !== 'number' || isNaN(index)) {
            throw new TypeError('Index must be a valid number');
        }
        // Check range
        if (index < -this.length || index >= this.length) {
            return undefined;
        }

        // Adjust negative index
        index = index < 0 ? this.length + index : index;

        return this.charAt(index);
    };
}