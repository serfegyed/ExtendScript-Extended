/**
 * Captures and validates the iterator protocol used by Set-like arguments.
 */
function __SetIterator__(iterator) {
    var next;
    if (iterator === null ||
            (typeof iterator !== "object" && typeof iterator !== "function")) {
        throw new TypeError("Set-like keys() must return an iterator.");
    }
    next = iterator.next;
    if (typeof next !== "function") {
        throw new TypeError("Set-like iterator next must be a function.");
    }
    return {
        next: function () {
            var item = next.call(iterator);
            if (item === null ||
                    (typeof item !== "object" && typeof item !== "function")) {
                throw new TypeError("Set-like iterator result must be an object.");
            }
            return item;
        },
        close: function () {
            var method = iterator["return"];
            var result;
            if (method === undefined || method === null) return;
            if (typeof method !== "function") {
                throw new TypeError("Set-like iterator return must be a function.");
            }
            result = method.call(iterator);
            if (result === null ||
                    (typeof result !== "object" && typeof result !== "function")) {
                throw new TypeError("Set-like iterator return result must be an object.");
            }
        }
    };
}
