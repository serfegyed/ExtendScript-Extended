/**
 * Checks if an object is iterable.
 *
 * @param {any} value - The value to check for iterability.
 * @return {boolean} Returns true if the object is iterable, false otherwise.
 */
if (typeof isIterable === "undefined"){
    function isIterable(value) {
        if (value === null || value === undefined) {
            return false;
        }

        return typeof value.length === 'number' || typeof value.size === 'number';
    };
};
