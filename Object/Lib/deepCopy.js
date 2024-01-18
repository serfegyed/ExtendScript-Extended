/**
 * Copies an object deeply, including nested objects, arrays, and Date objects.
 *
 * @param {object} obj - The object to be copied.
 * @return {object} The deep copy of the object.
 * @dependecy Object.isCyclic()
 */
if (!Object.deepCopy) {
    Object.deepCopy = function (obj) {
        if (Object.isCyclic(obj)) {
            throw new Error("Object.deepCopy(): Object has cyclic reference.");
        }

        if (obj === null) return null;
        if (typeof obj !== 'object') return obj; // Primitives

        if (obj instanceof Date) { 	// Handle Date objects
            new Date(obj);
        }

        if (obj instanceof RegExp) {	// Handle RegExp objects
            return new RegExp(obj);
        }

        const clonedObj = Array.isArray(obj) ? [] : {};

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = Object.deepCopy(obj[key]);
            }
        }

        return clonedObj;
    };
};