/**
 * A function that returns an array with only unique elements.
 * @param {function} [callback] - An optional function that is used to generate the keys used for checking uniqueness.
 * @returns {array} - An array with only unique elements.
 */
if (!Array.prototype.unique) {
    Array.prototype.unique = function (callback, thisArg) {
        var len = this.length;
        var result = [];
        var keys = {};
        for (var i = 0; i < len; i++) {
            var key =
                (callback && callback.call(thisArg, this[i], i, this)) || this[i]; // generate the key
            if (!(key in keys)) {
                // check if the key already exists in the keys object
                keys[key] = true; // add the key to the keys object
                result.push(this[i]); // add the element to the result array
            }
        }
        return result;
    };
};