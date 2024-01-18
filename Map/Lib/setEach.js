/**
 * Sets each element in the given array as key-value pairs in the Map object, 
 * based on the result of the callback function.
 * 
 * @param {Array} argArr - The array containing the elements to be added to the Map object.
 * @param {Function} callback - The function to execute on each element in the array.
 * @param {Object} thisArg - Optional. The value to use as 'this' when executing the callback function.
 * @throws {TypeError} - If argArr is not an instance of Array or if callback is not a function.
 * @return {Map} - The updated Map object.
 */
Map.prototype.setEach = function (argArr, callback, thisArg) {
    if (!(argArr instanceof Array))
        throw new TypeError("Map.setEach(): Need array to add elements");

    if (typeof callback !== "function")
        throw new TypeError("Map.setEach(): Missing callback function");

    for (var i = 0; i < argArr.length; i++) {
        var entry = argArr[i];
        if (entry instanceof Array && entry.length === 2) {
            if (callback.call(thisArg, entry[1], entry[0], this)) {
                this.set(entry[0], entry[1]);
            }
        };
    };

    return this;
};