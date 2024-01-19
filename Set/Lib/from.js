/**
 * Adds values from iterable(s) and/or primitive(s)to the Set.
 *
 * @param {Object} iterables - The iterable(s) and/or primitive(s) to add to the Set.
 * @return {Set} The modified Set object.
 */
Set.prototype.from = function (iterables) {
    for (var i = 0; i < arguments.length; i++) {
        var iterable = arguments[i];

        if (isPrimitive(iterable)) {
            this.add(iterable);
        } else if (sameValueZero(iterable, NaN)) {
            this.add(iterable);
        } else if (iterable instanceof Array) {
            if (!!iterable.length) {
                for (var i = 0; i < iterable.length; i++) {
                    this.add(iterable[i]);
                }
            } else {    // to add empty array
                this.add(iterable);
            }
        } else if (iterable instanceof Set) {
            var iterator = iterable.values();
            var result = iterator.next();
            while (!result.done) {
                this.add(result.value);
                result = iterator.next();
            }
        } else if (typeof iterable === "object") {
            if (!Object.isEmpty(iterable)) {
                for (var key in iterable) {
                    if (iterable.hasOwnProperty(key)) {
                        this.add(key);
                    }
                }
            } else {    // to add empty object
                this.add(iterable);
            }
        } else {
            // For other unsupported types, directly add them to the Set.
            this.add(iterable);
        }
    }

    return this;
};