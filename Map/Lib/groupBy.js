/**
 * Groups iterable values according to a callback result.
 *
 * ExtendScript subset: array-like values, Map entries, and forEach collections.
 *
 * @param {Object} iterable - The collection to group.
 * @param {Function} callback - Receives the iterated value and numeric index.
 * @return {Map} A Map whose values are arrays of grouped elements.
 */
if (!Map.groupBy) {
    Map.groupBy = function (iterable, callback) {
        var groups = new Map();
        var index = 0;
        var i;

        if (typeof callback !== "function") {
            throw new TypeError("Map.groupBy: callback must be a function.");
        }
        if (iterable === null || iterable === undefined ||
                (typeof iterable.length !== "number" &&
                typeof iterable.forEach !== "function")) {
            throw new TypeError("Map.groupBy: value must be array-like or support forEach.");
        }

        function add(value) {
            var groupKey = callback.call(undefined, value, index++);

            if (!groups.has(groupKey)) groups.set(groupKey, []);
            groups.get(groupKey).push(value);
        }

        if (iterable instanceof Map) {
            iterable.forEach(function (value, key) {
                add([key, value]);
            });
        } else if (typeof iterable.length === "number") {
            for (i = 0; i < iterable.length; i++) {
                add(iterable[i]);
            }
        } else {
            iterable.forEach(function (value) {
                add(value);
            });
        }

        return groups;
    };
}
