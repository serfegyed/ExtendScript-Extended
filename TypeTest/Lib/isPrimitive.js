/**
 * Check if the given value is a primitive data type or null/undefined.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is a primitive or null/undefined, otherwise returns false.
 */
if (typeof isPrimitive === "undefined") {
    function isPrimitive(value) {
        return value === null ||
            (typeof value !== "object" && typeof value !== "function");
    };
};
