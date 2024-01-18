/**
 * Check if the given value is a primitive data type or null/undefined.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is a primitive or null/undefined, otherwise returns false.
 */
if (typeof isPrimitive === "undefined") {
    function isPrimitive(value) {
        // Check if the value is null or undefined
        if (value === null || value === undefined) {
            return true;
        }

        // Check if the value is a primitive data type (string, number, or boolean)
        return typeof value !== "object";
    };
};