/**
 * Returns a string representation of the contents of the Set, enclosed in curly braces.
 *
 * @return {string} A string representation of the contents of the object.
 */
Set.prototype.toString = function () {
    var str = "";
    for (var i = 0; i < this._data.length; i++) {
        if (str !== "") {
            str += ", ";
        };
        str += (typeof this._data[i] === 'string') ? '"' + this._data[i] + '"' : this._data[i];
    }

    return "{" + str + "}";
};