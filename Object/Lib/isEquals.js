/**
 * Deeply compares two objects for equality.
 *
 * @param {any} value - The first value to compare.
 * @param {any} other - The second value to compare.
 * @return {boolean} Returns true if the objects are deeply equal, false otherwise.
 */
if (!Object.isEquals) {
    Object.isEquals = function (value, other) {
        var alreadyCompared = [];

        function sameValueZero(a, b) {
            return a === b || (a !== a && b !== b);
        }

        function isRegExp(value) {
            return value instanceof RegExp || value.__class__ === "RegExp" ||
                value.reflect && value.reflect.name === "RegExp" ||
                typeof value.exec === "function" && typeof value.test === "function" &&
                typeof value.global === "boolean" &&
                typeof value.ignoreCase === "boolean" &&
                typeof value.multiline === "boolean";
        }

        function innerCompare(a, b) {
            var aIsArray;
            var bIsArray;
            var aIsRegExp;
            var bIsRegExp;
            var countA = 0;
            var countB = 0;
            var i;
            var key;

            if (sameValueZero(a, b)) return true;

            if (a === null || b === null) return false;

            aIsRegExp = isRegExp(a);
            bIsRegExp = isRegExp(b);
            if (aIsRegExp || bIsRegExp) {
                return aIsRegExp && bIsRegExp && String(a) === String(b);
            }

            if (typeof a !== "object" || typeof b !== "object") return false;

            if (a instanceof Date || b instanceof Date) {
                return a instanceof Date && b instanceof Date &&
                    sameValueZero(a.getTime(), b.getTime());
            }

            aIsArray = a instanceof Array;
            bIsArray = b instanceof Array;
            if (aIsArray !== bIsArray || aIsArray && a.length !== b.length) return false;

            if (a.__proto__ !== b.__proto__) return false;

            for (i = 0; i < alreadyCompared.length; i++) {
                if (alreadyCompared[i][0] === a && alreadyCompared[i][1] === b) {
                    return true;
                }
            }

            alreadyCompared.push([a, b]);

            for (key in a) {
                if (Object.prototype.hasOwnProperty.call(a, key)) {
                    countA++;
                    if (!Object.prototype.hasOwnProperty.call(b, key) ||
                            !innerCompare(a[key], b[key])) return false;
                }
            }
            for (key in b) {
                if (Object.prototype.hasOwnProperty.call(b, key)) countB++;
            }

            return countA === countB;
        }
        return innerCompare(value, other);
    };
}
