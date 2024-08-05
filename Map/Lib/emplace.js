/**
 * Inserts or updates a key-value pair in the map.
 *
 * @param {any} key - The key to be inserted or updated.
 * @param {Object} handlers - An object containing the insert and update functions.
 * @param {function} handlers.insert - The function to be called if the key does not exist in the map.
 * @param {function} [handlers.update] - The function to be called if the key exists in the map.
 * @throws {TypeError} Throws an error if the handlers object is invalid or does not contain an insert function.
 * @return {any} Returns the new value associated with the key if it was inserted or updated, otherwise returns the current value.
 */
Map.prototype.emplace = function (key, handlers) {
    // Check if the handlers object is valid and contains at least an insert function
    if (!handlers || typeof handlers.insert !== 'function') {
        throw new TypeError('handlers must be an object with at least an insert function');
    }

    // Check if the key exists in the map
    if (this.has(key)) {
        var currentValue = this.get(key);
        // Key exists, update the value using the update function
        if (typeof handlers.update === 'function') {
            var newValue = handlers.update(currentValue, key, this);
            this.set(key, newValue);
            return newValue;
        }
        // If no update function is provided, do nothing and return the current value
        return currentValue;
    } else {
        // Key does not exist, insert the value using the insert function
        var insertedValue = handlers.insert(key, this);
        this.set(key, insertedValue);
        return insertedValue;
    }
};