/**
 * Reduces the elements of the Set to a single value using a callback function.
 *
 * @param {function} callback - The function to execute on each element of the Set.
 *                              It takes two arguments: the accumulator and the current value.
 *                              The function should return the updated accumulator value.
 * @param {any} initialValue - Optional. The initial value of the accumulator.
 * @throws {TypeError} If the callback parameter is not a function or if the Set is empty and no initial value is provided.
 * @throws {TypeError} If the types of the accumulator and the current value are different.
 * @throws {TypeError} If the reducer function returns an invalid value.
 * @return {any} The final value of the accumulator after the reduction.
 */
Set.prototype.reduce = function (callback, initialValue) {
    var iterator;
    var item;
    var accumulator;
    var hasInitialValue = arguments.length > 1;

    if (typeof callback !== "function") {
        throw new TypeError("Set.prototype.reduce: callback must be a function.");
    }

    iterator = this.values();
    item = iterator.next();

    if (hasInitialValue) {
        accumulator = initialValue;
    } else {
        if (item.done) {
            throw new TypeError(
                "Set.prototype.reduce: empty Set without an initial value."
            );
        }
        accumulator = item.value;
        item = iterator.next();
    }

    while (!item.done) {
        accumulator = callback.call(
            undefined,
            accumulator,
            item.value,
            item.value,
            this
        );
        item = iterator.next();
    }

    return accumulator;
};
