/**
 * Reduce the Map to a single value by applying a callback function to each key-value pair.
 *
 * @param {Function} callback - The function to execute on each key-value pair, taking four arguments:
 *        - accumulator: The value previously returned in the last invocation of the callback,
 *                       or initialValue if provided.
 *        - value: The current value being processed.
 *        - key: The key of the current value being processed.
 *        - map: The Map object that the reduce method was called upon.
 * @param {*} initialValue - A value to use as the first argument to the first call of the callback.
 * @return {*} - The value that results from the reduction.
 * @throws {TypeError} - If the callback is not a function or if the Map is empty and no initialValue is provided.
 * @external Map.prototype.entries
 */
Map.prototype.reduce = function (callback, initialValue) {
    var iterator;
    var entry;
    var accumulator;
    var hasInitialValue = arguments.length > 1;

    if (typeof callback !== "function") {
        throw new TypeError("Map.prototype.reduce: callback must be a function.");
    }

    iterator = this.entries();
    entry = iterator.next();

    if (hasInitialValue) {
        accumulator = initialValue;
    } else {
        if (entry.done) {
            throw new TypeError("Map.prototype.reduce: empty Map without an initial value.");
        }
        accumulator = entry.value[1];
        entry = iterator.next();
    }

    while (!entry.done) {
        accumulator = callback.call(
            undefined,
            accumulator,
            entry.value[1],
            entry.value[0],
            this
        );
        entry = iterator.next();
    }

    return accumulator;
};
