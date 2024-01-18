/**
 * Returns the first element of the array.
 *
 * @return {any} The first element of the array.
 */
if (!Array.prototype.first) {
	Array.prototype.first = function () {
		return this[0];
	};
};