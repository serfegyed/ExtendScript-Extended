/**
 * Sets multiple key-value pairs in the Map.
 *
 * @param {Array} argArr - An array of key-value pairs to be set in the Map.
 * Each pair should be an array with two elements: [key, value].
 * @return {Map} - The modified Map object with the new key-value pairs set.
 */
Map.prototype.setAll = function (argArr) {
    if (argArr instanceof Array) {
        for (var i = 0; i < argArr.length; i++) {
            var entry = argArr[i];
            if (entry instanceof Array && entry.length === 2) {
                this.set(entry[0], entry[1]);
            };
        };
    };

    return this;
};