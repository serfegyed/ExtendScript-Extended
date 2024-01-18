/**
 * Finds the index of the first occurrence of a specified element in an array.
 *
 * @param {any} elem - The element to locate in the array.
 * @param {number} [from] - The index at which to start the search. If not provided, the search starts from index 0.
 * @return {number} - The index of the first occurrence of the specified element in the array, or -1 if not found.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
 */
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (elem /*, from*/) {
		var from = Math.floor(arguments[1]) || 0;
		if (Math.abs(from) > this.length) return -1;
		from = from < 0 ? (from += this.length) : from;
		for (var i = from; i < this.length; i++) {
			if (this[i] === elem) return i;
		}
		return -1;
	};
};