/**
 * Checks if the array includes a certain element, returning true or false as appropriate.
 *
 * @param {type} element - The element to search for in the array.
 * @param {type} from - The index to start the search from. (optional)
 * @return {type} Returns true if the element is found, otherwise false.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
 */
if (!Array.prototype.includes) {
	Array.prototype.includes = function (element /*, from*/) {
		var from = Math.floor(arguments[1]) || 0;
		var length = this.length;
		from = from < 0 ? from + length : from;
		from = from < 0 ? 0 : from;
		if (from >= length) return false;

		// Handle NaN separately
		if (typeof element === "number" && isNaN(element)) {
			for (var i = from; i < length; i++) {
				if (isNaN(this[i])) {
					return true;
				}
			}
			return false;
		}
		// Any other tan NaN
		return this.indexOf(element, from) !== -1;
	};
};