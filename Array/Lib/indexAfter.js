/**
 * Finds the index of the given element in the array and returns the index
 * of the element that comes after it. If the element is not found, it
 * returns -1.
 * Does not check whether there is actually a next element.
 *
 * @param {any} element - The element to find the index of.
 * @return {number} The index of the element that comes after the given
 * element, or -1 if the element is not found.
 * !dependencies: indexOf()
 */
#include ".\\indexOf.js"
if (!Array.prototype.indexAfter) {
	Array.prototype.indexAfter = function (element/*, fromIndex*/) {
		// Check if fromIndex is out of bounds
		var fromIndex = Math.floor(arguments[1]) || 0;
		if (Math.abs(fromIndex) > this.length) return -1;
		fromIndex = fromIndex < 0 ? (fromIndex += this.length) : fromIndex;

		// Find the index of the element starting from fromIndex
		const index = this.indexOf(element, fromIndex);

		// Check if the element is found and not the last element
		if (index >= 0 && index < this.length - 1) {
			return index + 1;
		}

		return -1;
	};
};