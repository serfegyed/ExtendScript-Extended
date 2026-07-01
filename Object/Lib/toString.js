/**
 * Overrides Object.prototype.toString for readable ExtendScript Console output.
 *
 * @return {string} A string representation of enumerable own properties.
 */
Object.prototype.toString = function () {
    var result = "";
    var key;

    for (key in this) {
        if (Object.prototype.hasOwnProperty.call(this, key)) {
            if (result !== "") result += ", ";
            result += key + ": " +
                (typeof this[key] === "string" ? '"' + this[key] + '"' : this[key]);
        }
    }

    return "{" + result + "}";
};
