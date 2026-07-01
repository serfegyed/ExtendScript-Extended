/**
 * Groups the items based on the provided callback function.
 *
 * @param {Array|String|Map|Set|Object} items - Array-like or `forEach` collection.
 * @param {function} callback - The function to be called on each item to determine the group.
 * @throws {TypeError} If the callback parameter is not a function or if the items parameter is not an iterable.
 * @return {Object} An object containing the groups as keys and arrays of items as values.
 */
if (!Object.groupBy) {
    Object.groupBy = function (items, callback) {
        var groups = {};
        var index = 0;

        if (typeof callback !== "function") {
            throw new TypeError("Object.groupBy: callback must be a function.");
        }

        if (items === null || items === undefined ||
                (typeof items.length !== "number" && typeof items.forEach !== "function")) {
            throw new TypeError("Object.groupBy: items must be array-like or support forEach.");
        }

        function add(value) {
            var groupName = String(callback.call(undefined, value, index++));

            if (groupName === "__proto__") {
                throw new TypeError("Object.groupBy: __proto__ group name is not supported.");
            }
            if (!Object.prototype.hasOwnProperty.call(groups, groupName)) {
                groups[groupName] = [];
            }
            groups[groupName].push(value);
        }

        if (typeof items.length === "number") {
            for (var i = 0; i < items.length; i++) {
                add(items[i]);
            }
        } else if (typeof Map !== "undefined" && items instanceof Map) {
            items.forEach(function (value, key) {
                add([key, value]);
            });
        } else {
            items.forEach(function (value) {
                add(value);
            });
        }

        return groups;
    };
}
