/**
 * Plucks the specified property from each item in the array.
 *
 * @param {string} name - The name of the property to pluck.
 * @return {Array} An array containing the values of the specified property from each item.
 * @example
 *     > var people = [{'name': 'Alfred', age: 33}, {'name': 'Zed', age: 45}];
 *     > people.pluck('age');
 *     [33,45]
 *     > people.pluck('age').sum();
 *     78
 *     > people.sum('age');
 *     78
 *     > people.sum(function (person) { return person.age });
 *     78
 * !dependency map()
 */
if (!Array.prototype.pluck) {
    #include ".\\map.js"
    Array.prototype.pluck = function (name) {
        return this.map(function (item) {
            return item[name];
        });
    };
};