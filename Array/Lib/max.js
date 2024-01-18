/**
 * Finds the maximum value in an array based on a salient property or the element itself.
 *
 * @param {string|function} salient - A function or string representing the property to compare for each element.
 * @return {*} The maximum value in the array.
 * @example
 *     > var people = [{'name': 'Alfred'}, {'name': 'Zed'}];
 *     > people.max(function (obj) {return obj.name});
 *     {'name': 'Zed'}
 */
if (!Array.prototype.max) {
    Array.prototype.max = function (salient) {
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

        var maxValue = this[0];
        for (var i = 1; i < this.length; i++) {
            if (mapper(this[i]) > mapper(maxValue)) {
                maxValue = this[i];
            }
        }

        return maxValue;
    };
};