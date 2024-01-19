/**
 * Returns a string representation of the contents of the Set, enclosed in curly braces.
 *
 * @return {string} A string representation of the contents of the object.
 */
Set.prototype.toString = function () {
    var str = "";
    for (var value in this._data) {
        if (str !== "") {
            str += ", ";
        };
        str += (typeof value === 'string') ? '"' + value + '"' : value;
    }

    return "{" + str + "}";
};