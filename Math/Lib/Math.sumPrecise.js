/**
 * Returns a more precise sum of an array-like collection of numbers.
 *
 * This ExtendScript-oriented subset accepts array-like numeric collections,
 * not the full ES iterable protocol.
 *
 * @param {Object} numbers - Array-like collection of numbers.
 * @return {number} The compensated sum.
 */
if (!Math.sumPrecise) {
    Math.sumPrecise = function (numbers) {
        var partials = [];
        var length;
        var zeroSum = 0;
        var hasNonZero = false;
        var positiveInfinity = false;
        var negativeInfinity = false;
        var i;
        var j;
        var x;
        var y;
        var hi;
        var lo;
        var temp;
        var result;

        if (numbers === null || numbers === undefined ||
                typeof numbers.length !== "number") {
            throw new TypeError("Math.sumPrecise: numbers must be array-like.");
        }

        length = numbers.length;
        if (length !== length || length < 0 || Math.floor(length) !== length) {
            throw new TypeError("Math.sumPrecise: numbers must be array-like.");
        }

        for (i = 0; i < length; i++) {
            x = numbers[i];
            if (typeof x !== "number") {
                throw new TypeError("Math.sumPrecise: values must be numbers.");
            }
            if (x !== x) {
                return NaN;
            }
            if (x === Infinity) {
                positiveInfinity = true;
                continue;
            }
            if (x === -Infinity) {
                negativeInfinity = true;
                continue;
            }
            if (x === 0) {
                zeroSum += x;
                continue;
            }

            hasNonZero = true;
            for (j = 0; j < partials.length; j++) {
                y = partials[j];
                if (Math.abs(x) < Math.abs(y)) {
                    temp = x;
                    x = y;
                    y = temp;
                }
                hi = x + y;
                lo = y - (hi - x);
                if (lo !== 0) {
                    partials[j] = lo;
                } else {
                    partials.splice(j, 1);
                    j--;
                }
                x = hi;
            }
            if (x !== 0) {
                partials.push(x);
            }
        }

        if (positiveInfinity && negativeInfinity) return NaN;
        if (positiveInfinity) return Infinity;
        if (negativeInfinity) return -Infinity;
        if (!hasNonZero) return length === 0 ? -0 : zeroSum;

        result = 0;
        for (i = 0; i < partials.length; i++) {
            result += partials[i];
        }
        return result;
    };
}
