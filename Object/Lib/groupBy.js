/**
 * Groups the items based on the provided callback function.
 *
 * @param {Array|String|Map|Set|Object} items - The array, string, or iterable object to be grouped.
 * @param {function} callback - The function to be called on each item to determine the group.
 * @throws {TypeError} If the callback parameter is not a function or if the items parameter is not an iterable.
 * @return {Object} An object containing the groups as keys and arrays of items as values.
 */
if (!Object.groupBy) {
    Object.groupBy = function (items, callback) {
        if (typeof callback !== "function") {
            throw new TypeError("Object.groupBy: callback must be a function.");
        }

        if (!((items != null) && (items.length >= 0 || items.size >= 0))) {
            throw new TypeError("Object.groupBy: items must be an iterable (Array, String, Map, Set, or Object).");
        }

        var groups = {};
        var groupName;
        var item, key;

        // Consolidated iteration logic
        var iterate = (typeof items.length === 'number') ?
            function (callback) { for (var i = 0; i < items.length; i++) callback(items[i], i); } :
            function (callback) { items.forEach(function (value, k) { callback(value, k); }); };

        iterate(function (value, k) {
            key = (typeof items.length === 'number') ? k : value;
            item = (typeof items.length === 'number') ? value : [k, value];
            groupName = callback.call(undefined, item, key);

            groups[groupName] = groups[groupName] || [];
            groups[groupName].push(item);
        });

        return groups;
    };
};