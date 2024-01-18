/**
 * Checks if an object is iterable.
 *
 * @param {any} obj - The object to check for iterability.
 * @return {boolean} Returns true if the object is iterable, false otherwise.
 */
if (typeof isIterable === "undefined"){
    function isIterable(obj) {
        if (obj === null || obj === undefined) {
            return false;
        }

        return typeof obj.length === 'number' || typeof obj.size === 'number';
    };
};