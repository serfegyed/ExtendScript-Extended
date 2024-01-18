/**
 * @desc Executes a provided function once per array element.
 * @param {Function} callback
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (callback /*, thisArg*/) {
		var len = this.length;
		if (typeof callback !== "function") throw new TypeError();
		var thisArg = arguments[1] || undefined;

		for (var i = 0; i < len; i++) {
			if (i in this) callback.call(thisArg, this[i], i, this);
		};
	};
};