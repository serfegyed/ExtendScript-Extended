/**
 * Deletes multiple values from the set.
 *
 * @param {any} value1 - The first value to be deleted.
 * @param {...any} valueN - Additional values to be deleted.
 * @return {Set} - The updated set after deleting the values.
 */
Set.prototype.deleteAll = function (value1/*, ..., valueN*/) {
    for (var i = 0; i < arguments.length; i++) {
        this.delete(arguments[i]);
    }
    return this;
};