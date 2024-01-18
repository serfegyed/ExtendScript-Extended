/**
 * Converts the data in the object to a string representation.
 *
 * @return {string} The string representation of the data in the object in {key: value} format.
 */
Map.prototype.toString = function () {
    var isFirst = true;
    var string = "";
    for (var key in this._data) {
        if (this._data.hasOwnProperty(key)) {
            if (!isFirst) {
                string += ", ";
            }
            string += "{" + key + "=>" + (typeof this._data[key] === "string" ? '"' + this._data[key] + '"' : this._data[key]) + "}";
            isFirst = false;
        }
    }
    return "{" + string + "}";
};