/**
 * Adds values from one or more project-supported source forms.
 *
 * Arrays, array-like objects, and Sets contribute their values. Plain objects
 * contribute their own property names. Other values are added directly.
 *
 * @return {Set} The modified Set.
 */
Set.prototype.from = function (iterables) {
    var i;
    var j;
    var key;
    var iterable;
    var iterator;
    var item;

    for (i = 0; i < arguments.length; i++) {
        iterable = arguments[i];

        if (iterable instanceof Set) {
            iterator = iterable.values();
            item = iterator.next();
            while (!item.done) {
                this.add(item.value);
                item = iterator.next();
            }
        } else if (iterable instanceof Array ||
                (typeof iterable !== "string" && isArrayLike(iterable))) {
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
