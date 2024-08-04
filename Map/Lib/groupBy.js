/**
 * Groups the elements of an iterable according to the result of a callback function.
 *
 * @param {Iterable} iterable - The iterable to group.
 * @param {Function} callback - The function that produces the grouping key.
 * @return {Map} A Map object with the grouped elements.
 */
Map.groupBy = function (iterable, callback) {
    if (typeof callback !== 'function') {
        throw new TypeError('Second argument must be a function');
    }

    var groups = new Map();

    if (iterable instanceof Map) {
        iterable.forEach(function (value, key) {
            var groupName = callback(value, key, iterable);
            if (!groups.has(groupName)) {
                groups.set(groupName, []);
            }
            groups.get(groupName).push(value);
        });
    } else if (iterable instanceof Array || typeof iterable === 'object') {
        for (var key in iterable) {
            if (iterable.hasOwnProperty(key)) {
                var value = iterable[key];
                var groupName = callback(value, key, iterable);
                if (!groups.has(groupName)) {
                    groups.set(groupName, []);
                }
                groups.get(groupName).push(value);
            }
        }
    } else {
        throw new TypeError('First argument must be an iterable (Map, Array, or Object)');
    }

    return groups;
};