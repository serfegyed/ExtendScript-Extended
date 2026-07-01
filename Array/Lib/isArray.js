/**
 * Tests whether a value is an actual Array.
 */
if (typeof __arrayNativeObjectToString__ === "undefined") {
    var __arrayNativeObjectToString__ = Object.prototype.toString;
}
if (!Array.isArray) {
    Array.isArray = function (value) {
        if (value !== null && value !== undefined &&
                typeof value.__class__ !== "undefined") {
            return value.__class__ === "Array";
        }
        return __arrayNativeObjectToString__.call(value) === "[object Array]";
    };
}
