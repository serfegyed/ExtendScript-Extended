/**
 * Rejects elements in the array that satisfy the provided testing function.
 *
 * @param {Function} fun - The testing function.
 * @param {*} [thisp] - Optional. The value to use as `this` when executing the testing function.
 * @return {Array} - A new array with the elements that do not satisfy the testing function.
 */
if (!Array.prototype.reject) {
	Array.prototype.reject = function (callback /*, thisArg*/) {
		var len = this.length;
		if (typeof callback !== "function")
			throw new TypeError("Callback must be a function");

		var res = [];
		var thisArg = thisArg || undefined;
		for (var i = 0; i < len; i++) {
			if (i in this) {
				var val = this[i]; // in case fun mutates this
				if (!callback.call(thisArg, val, i, this)) res[res.length] = val;
			}
		}
		return res;
	};
};