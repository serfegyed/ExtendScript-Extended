/**
 * A function to calculate the dimensions of a multidimensional array.
 *
 * @return {Array} An array containing the dimensions of each element in the input array.
 */
Array.prototype.dim = function () {
    const dimensions = [];
    var maxDim = 0;
    for (var i = 0; i < this.length; i++) {
        maxDim = 0;
        if (Array.isArray(this[i])) {
            getDimensions(this[i]);
        };
        dimensions.push(maxDim);
    };

    function getDimensions(array) {
        maxDim++;
        for (j = 0; j < array.length; j++) {
            if (Array.isArray(array[j])) {
                getDimensions(array[j])
            }
        }
    };

    return dimensions;
};