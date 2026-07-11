/**
 * Adds values from one or more project-supported source forms.
 *
 * Arrays, array-like objects, and Sets contribute their values. Plain objects
 * contribute their own property names. Other values are added directly.
 *
 * @return {Set} The modified Set.
 */
function __SetFromIsArrayLike__(object) {
    if (object === null || object === undefined) return false;
    return typeof object.length === "number" && object.length >= 0 &&
        (object.length === 0 || (object.length - 1) in object);
}

Set.prototype.from = function (iterables) {
    var i;
    var j;
    var key;
    var iterable;

    for (i = 0; i < arguments.length; i++) {
        iterable = arguments[i];

        if (iterable instanceof Set) {
            for (j = 0; j < iterable._data.length; j++) {
                this.add(iterable._data[j]);
            }
        } else if (iterable instanceof Array ||
                (typeof iterable !== "string" &&
                    __SetFromIsArrayLike__(iterable))) {
            for (j = 0; j < iterable.length; j++) {
                this.add(iterable[j]);
            }
        } else if (iterable !== null && typeof iterable === "object") {
            for (key in iterable) {
                if (Object.prototype.hasOwnProperty.call(iterable, key)) {
                    this.add(key);
                }
            }
        } else {
            this.add(iterable);
        }
    }

    return this;
};
