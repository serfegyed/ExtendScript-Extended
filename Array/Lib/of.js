/**
 * Creates an Array containing the supplied arguments.
 */
if (!Array.of) {
    Array.of = function () {
        var length = arguments.length;
        var constructor = typeof this === "function" ? this : Array;
        var result = new constructor(length);
        var i;

        for (i = 0; i < length; i++) result[i] = arguments[i];
        result.length = length;
        return result;
    };
}
