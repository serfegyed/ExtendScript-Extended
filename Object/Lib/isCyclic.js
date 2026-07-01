/**
 * Detects cyclic references in an object.
 *
 * @param {Object} obj - The object to check for cyclic references.
 * @return {boolean} True if the object contains cyclic references, false otherwise.
 */
if (!Object.isCyclic) {
    Object.isCyclic = function (obj) {
        var stack = [];

        function detect(value) {
            var i;
            var key;

            if (value === null ||
                    (typeof value !== "object" && typeof value !== "function")) {
                return false;
            }
            for (i = 0; i < stack.length; i++) {
                if (stack[i] === value) return true;
            }

            stack.push(value);
            for (key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key) &&
                        detect(value[key])) {
                    stack.pop();
                    return true;
                }
            }
            stack.pop();
            return false;
        }

        return detect(obj);
    };
}
