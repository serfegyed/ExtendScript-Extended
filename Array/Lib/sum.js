/**
 * Calculates the sum of the elements in an array.
 *
 * @param {string|Function} salient - A function or string representing the property to compare for each element.
 *        If a string, the elements are mapped using the property value.
 *        If a function, the elements are mapped using the function's return value.
 *        If not provided, the elements themselves are used.
 * @return {number} The sum of the mapped elements in the array.
 * @example
 *     > var persons = [
 *     ... {'name': 'Abraham', 'children': 5},
 *     ... {'name': 'Joe', 'children': 3},
 *     ... {'name': 'Zed', 'children': 0}
 *     ... ];
 *     > persons.sum('children');
 *     8
 *! dependency map(), reduce()
 */
if (!Array.prototype.sum) {
    #include ".\\map.js"
    #include ".\\reduce.js"
    Array.prototype.sum = function (salient) {
        if (salient && typeof salient === "string") {
            var mapper = function (obj) {
                return obj[salient];
            };
        } else {
            var mapper = salient || function (obj) {
                return obj;
            };
        }
        var features = Array.prototype.map.call(this, mapper);
        return Array.prototype.reduce.call(features, function (a, b) {
            return a + b;
        });
    };
};