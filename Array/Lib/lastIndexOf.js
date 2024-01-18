/**
 * Find the last index of a given element in the array.
 *
 * @param {any} element - The element to search for.
 * @param {number} [from] - The index to start searching from. If not provided, the search starts from the last element.
 * @return {number} The index of the last occurrence of the element in the array, or -1 if the element is not found.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
 */
if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function (element /*, from*/) {
		var from = arguments[1];
		from = from === null ? (from = this.length - 1) : (from = Math.floor(from));
		from =
			from < 0
				? Math.max(0, from + this.length)
				: Math.min(this.length - 1, from);

		for (var i = from; i >= 0; i--) {
			if (this[i] === element) {
				return i;
			}
		}
		return -1;
	};
};