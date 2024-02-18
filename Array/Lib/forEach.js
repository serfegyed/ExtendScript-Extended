/**
 * @desc Executes a provided function once per array element.
 * @param {Function} callback
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */
Array.prototype.forEach = function (callback, thisArg) {
	if (typeof callback !== "function") throw new TypeError("Callback must be a function");

	var length = this.length;
	for (var i = 0; i < length; i++) {
		if (i in this) {
			callback.call(thisArg, this[i], i, this);
		}
	}
};