/**
 * Checks if the given argument is an array.
 *
 * @param {any} arg - The argument to be checked.
 * @return {boolean} Returns true if the argument is an array, false otherwise.
 */
if (!Array.isArray) {
  Array.isArray = function (arg) {
    return arg instanceof Array;
  };
};