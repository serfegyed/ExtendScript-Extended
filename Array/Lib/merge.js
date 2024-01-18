/**
 * Merges multiple arrays into the current array.
 *
 * @param {Array} arr1 ... arrN - The arrays to be merged.
 * @return {Array} - The merged array.
 */
if (!Array.prototype.merge) {
    #include ".\\isArray.js"
    Array.prototype.merge = function (/*arr1 ... arrN*/) {
        for (var i = 0; i < arguments.length; i++) {
            var array = arguments[i];
            if (Array.isArray(array)) {
                Array.prototype.push.apply(this, array)
            }
        }
        return this;
    };
};