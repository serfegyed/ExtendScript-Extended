/**
 * Converts an array to a string representation.
 *
 * @return {string} The string representation of the array.
 */
Array.prototype.toString = function () {
    var arr = this;
    var result = "";
    if (arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (result !== "") {
                result += ", ";
            };
            result += (typeof arr[i] === 'string') ? '"' + arr[i] + '"' : arr[i];
        };
    };
    return "[" + result + "]";
};