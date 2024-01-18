/**
 * Checks if a value is defined.
 *
 * @param {any} value - The value to check.
 * @return {boolean} Returns true if the value is defined, false otherwise.
 */
if (typeof isDefined === "undefined") {
    function isDefined(value) {
        return value !== undefined;
    };
};