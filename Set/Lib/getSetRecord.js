/**
 * Validates a Set-like object and captures its composition interface.
 *
 * @param {Object} object - A Set or Set-like object.
 * @return {Object} Internal Set record.
 */
function __getSetRecord__(object) {
    var size;

    if (object === null || object === undefined ||
            (typeof object !== "object" && typeof object !== "function")) {
        throw new TypeError("Set composition argument must be Set-like.");
    }

    size = Number(object.size);
    if (size !== size) {
        throw new TypeError("Set-like size must be numeric.");
    }
    size = size < 0 ? Math.ceil(size) : Math.floor(size);
    if (size < 0) {
        throw new RangeError("Set-like size must not be negative.");
    }
    if (typeof object.has !== "function" || typeof object.keys !== "function") {
        throw new TypeError("Set-like value must provide has() and keys().");
    }

    return {object: object, size: size, has: object.has, keys: object.keys};
}
