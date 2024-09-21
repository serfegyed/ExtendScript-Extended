/**
 * Find the last index of a given element in the array.
 *
 * @param {any} searchElement - The element to search for.
 * @param {number} [fromIndex] - The index to start searching from. If not provided, the search starts from the last element.
 * @return {number} The index of the last occurrence of the element in the array, or -1 if the element is not found.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/lastIndexOf
 */
if (!Array.prototype.lastIndexOf) {
	Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
		var length = this.length;
		var from = isNaN(fromIndex) ? length - 1 : parseInt(fromIndex, 10);
		from = from >= 0 ? Math.min(from, length - 1) : from + length;
		for (var i = from; i >= 0; i--) {
			if (this[i] === searchElement) {
				return i;
			}
		}
		return -1;
	};
}