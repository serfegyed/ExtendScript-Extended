/**
 * Overrides the default `toString` method of `Object` prototype
 * to return a string representation of the object.
 *
 * @return {string} A string representation of the object.
 */

Object.prototype.toString = function () {
    var results = "";
    var obj = this;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (results !== "") results += ", ";
            results += key + ": " + (typeof obj[key] === "string" ? '"' + obj[key] + '"' : obj[key]);
        }
    }
    return "{" + results + "}";
};