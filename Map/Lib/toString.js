/**
 * Converts the data in the object to a string representation.
 *
 * @return {string} The string representation of the data in the object in {key: value} format.
 */
Map.prototype.toString = function () {
    var isFirst = true;
    var string = "";
    for (var i = 0; i < this._entries.length; i++) {
        if (!isFirst) {
            string += ", ";
        }
        string += "[" + this._entries[i][0] + ": " + (typeof this._entries[i][1] === "string" ? '"' + this._entries[i][1] + '"' : this._entries[i][1]) + "]";
        isFirst = false;
    }
    return "Map: <" + string + ">";
};