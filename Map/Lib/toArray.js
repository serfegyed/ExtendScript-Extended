/**
 * Converts a Map object to an array.
 *
 * @return {Array} The resulting array containing the elements of the Map object.
 */
Map.prototype.toArray = function () {
    var entries = [];
    var iterator = this.entries();
    var entry = iterator.next();

    while (!entry.done) {
        entries.push(entry.value);
        entry = iterator.next();
    }
    return entries;
};
