/**
 * Checks if a value is a Date object.
 *
 * @param {any} value - The value to be checked.
 * @return {boolean} Returns true if the value is a Date object, otherwise returns false.
 */
if (typeof isDate === "undefined") {
    function isDate(date) {
        return (
            typeof date === 'object' &&
            date instanceof Date &&
            !isNaN(date.getTime())
        );
    }
};