/**
 * Finds the minimum value in an array.
 *
 * @param {function|string} salient - A function or string representing the property to compare for each element.
 * @return {*} The minimum value in the array.
 */
if (!Array.prototype.min) {
    Array.prototype.min = function (salient) {
        var mapper;
        if (salient && typeof salient === "string") {
            mapper = function (obj) {
                return obj[salient];
            };
        } else {
            mapper = salient || function (obj) {
                return obj;
            };
        }

        var minValue = this[0];
        for (var i = 1; i < this.length; i++) {
            if (mapper(this[i]) < mapper(minValue)) {
                minValue = this[i];
            }
        }

        return minValue;
    };
};