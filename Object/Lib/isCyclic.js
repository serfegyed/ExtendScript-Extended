/**
 * Detects cyclic references in an object.
 *
 * @param {Object} obj - The object to check for cyclic references.
 * @return {boolean} True if the object contains cyclic references, false otherwise.
 * @dependecy isPrimitive()
 */
if (!Object.isCyclic) {
    Object.isCyclic = function (obj) {
        var visited = [];
        var detected = false;

        function detect(obj) {
            if (isPrimitive(obj)) {
                return false;
            };
            if (visited.indexOf(obj) !== -1) {
                return detected = true;
            }

            visited.push(obj)
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    detect(obj[key])
                };
            };
            visited.pop();
        }
        detect(obj);
        return detected;
    };
};