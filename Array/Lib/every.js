/**
 * A callback function is executed on each element in the array, until it finds an element for which the callback returns a falsy value. If such an element is found, the method immediately returns false. Otherwise, if the callback returns a truthy value for all elements, the method returns true.
 *
 * @param {function} callback - The function to execute on each element.
 * @param {any} [thisArg] - An object to which the this keyword can refer in the callback function. If thisArg is omitted, undefined is used as the this value.
 * @return {boolean} - Returns true if the callback returns a truthy value for all elements in the array; otherwise, returns false.
 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
 */
if (!Array.prototype.every) {
  Array.prototype.every = function (callback /*, thisArg*/) {
    var len = this.length;
    if (typeof callback !== "function") throw new TypeError();
    var thisArg = arguments[1] || undefined;

    for (var i = 0; i < len; i++) {
      if (i in this && !callback.call(thisArg, this[i], i, this))
        return false;
    }
    return true;
  };
};