/**
 * Deeply compares two objects for equality.
 *
 * @param {any} obj1 - The first object to compare.
 * @param {any} obj2 - The second object to compare.
 * @return {boolean} Returns true if the objects are deeply equal, false otherwise.
 */
if (!Object.isEquals) {
    Object.isEquals = function (obj1, obj2) {
        // ES3 version
        var alreadyCompared = []

        function innerCompare(a, b) {
            if (sameValueZero(a, b)) return true

            // Check if objects have already been compared
            for (var i = 0; i < alreadyCompared.length; i++) {
                if (alreadyCompared[i][0] === a && alreadyCompared[i][1] === b) {
                    return true
                }
            }

            // No, add objects
            alreadyCompared.push([a, b])

            if (a instanceof Date && b instanceof Date)
                return a.getTime() === b.getTime()

            if (a instanceof RegExp && b instanceof RegExp)
                return a.toString() === b.toString()

            if (!a || !b || (typeof a !== "object" && typeof b !== "object"))
                return sameValueZero(a, b)

            if (a.__proto__ !== b.__proto__) return false

            const keys = Object.keys(a)
            if (keys.length !== Object.keys(b).length) return false

            return keys.every(function (k) {
                return innerCompare(a[k], b[k])
            })
        }
        return innerCompare(obj1, obj2)
    }
};