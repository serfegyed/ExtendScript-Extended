/**
 * A deep copy function that safely copies objects and arrays to avoid circular references.
 *
 * @param {object|array} obj - The object or array to be copied.
 * @param {array} cache - An optional parameter to store the copied objects and arrays to check for circular references.
 * @return {object|array} - The deep copied object or array.
 * @dependency Map() class
 */
if (!Object.safeDeepCopy) {
    Object.safeDeepCopy = function (obj, hash) { // Handle circular references.
        if (!hash) { var hash = new Map() }
        if (obj === null) return null;
        if (typeof obj !== 'object') return obj; // Primitives

        if (obj instanceof Date) { 	// Handle Date objects
            new Date(obj);
        }

        if (obj instanceof RegExp) {	// Handle RegExp objects
            return new RegExp(obj);
        }

        // Gotcha Alert: Circular references? We got them covered!
        if (hash.has(obj)) return hash.get(obj);

        const clonedObj = Array.isArray(obj) ? [] : {};
        hash.set(obj, clonedObj);

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = Object.safeDeepCopy(obj[key], hash);
            }
        }

        return clonedObj;
    };
};