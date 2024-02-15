/**
 * Join the elements of the Set into a string separated by the specified separator.
 *
 * @param {string} separator - The separator to use. If not provided, a comma will be used as the default separator.
 * @return {string} The joined string.
 */
Set.prototype.join = function (separator) {
    separator = separator !== undefined ? separator : ',';
    return this.toArray().join(separator);
};