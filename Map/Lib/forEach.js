/**
 * Iterates through each element of the object and applies a callback function.
 *
 * @param {function} callback - function to be called for each element in the object
 * @param {object} [thisArg=this] - object to use as 'this' when executing callback
 */
Map.prototype.forEach = function (callback, thisArg) {
    var visited = [];
    var entry;
    var i;
    var j;
    var wasVisited;

    if (typeof callback !== "function") {
        throw new TypeError("Map.prototype.forEach: callback must be a function.");
    }

    while (true) {
        entry = null;
        for (i = 0; i < this._entries.length; i++) {
            wasVisited = false;
            for (j = 0; j < visited.length; j++) {
                if (visited[j] === this._entries[i]) {
                    wasVisited = true;
                    break;
                }
            }
            if (!wasVisited) {
                entry = this._entries[i];
                break;
            }
        }
        if (!entry) return;

        visited.push(entry);
        callback.call(thisArg, entry[1], entry[0], this);
    }
};
