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
    if (typeof callback !== "function")
        throw new TypeError("Map.reduce(): Callback must be a function");

    if (this.size() === 0 && initialValue === undefined)
        throw new TypeError("Map.reduce(): Empty Map without an initial value");

    var iterator = this.entries();
    var entry = iterator.next();
    var accumulator = initialValue || undefined;

    if (!entry.done || !accumulator) {
        accumulator = entry.value[1];
        entry = iterator.next();
    }

    while (!entry.done) {
        var key = entry.value[0];
        var value = entry.value[1];
        accumulator = callback.call(this, accumulator, value, key, this);
        entry = iterator.next();
    }

    if (accumulator === undefined)
        throw new TypeError("Map.reduce(): Reducer function returns an invalid value");

    return accumulator;
};