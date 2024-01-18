/**
 * Deletes all the specified keys from the map.
 *
 * @param {type} key1 - the first key to delete
 * @param {...} ... - additional keys to delete
 * @return {Map} - the updated map after deleting the keys
 */
Map.prototype.deleteAll = function (key1/*, ..., keyN*/) {
    for (var i = 0; i < arguments.length; i++) {
        this.delete(arguments[i]);
    };

    return this;
};