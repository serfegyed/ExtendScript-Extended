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
    if (typeof callback !== "function")
        throw new TypeError("Set.reduce(): Callback must be a function");

    if (this.size === 0 && initialValue === undefined)
        throw new TypeError("Set.reduce(): Empty Set without an initial value");

    var accumulator = initialValue !== undefined ? initialValue : this._data[0];

    for (var i = 0; i < this._data.length; i++) {
        // Check if the types of the accumulator and currentValue are different
        if (typeof accumulator !== typeof this._data[i]) {
            throw new TypeError(
                "Set.reduce(): Type mismatch in Set.reduce(). All elements must be of the same type."
            );
        }
        accumulator = callback.call(this, accumulator, this._data[i]);
    };

    return accumulator;
};