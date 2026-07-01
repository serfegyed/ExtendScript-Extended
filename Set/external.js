/**
 * Determines whether two values are equal using SameValueZero.
 */
if (typeof sameValueZero === "undefined") {
    function sameValueZero(x, y) {
        if (typeof x === "number" && typeof y === "number") {
            return x === y || (x !== x && y !== y);
        }
        return x === y;
    }
}

/**
 * Checks whether a value has a usable indexed length.
 */
if (typeof isArrayLike === "undefined") {
    function isArrayLike(object) {
        if (object === null || object === undefined) return false;
        return typeof object.length === "number" && object.length >= 0 &&
            (object.length === 0 || (object.length - 1) in object);
    }
}
