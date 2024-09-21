/**
 * Analyzes the provided array and returns information about its uniformity, depth, type and structure.
 *
 * @param {Array} arr - The input array to be analyzed
 * @return {Object} An object containing the following properties:
 *   - `isUniform` {boolean}: Indicates whether the array is uniform at all depths
 *   - `maxDepth` {number}: The maximum depth of the array
 *   - `lengthsAtDepth` {Object}: An object containing arrays of lengths at each depth
 *   - `typeOfElements` {string}: The type of elements in the array or 'mixed'.
 *                                If all elements are 'null', 'undefined' and/or empty then 'undefined' is returned.
 * @dependencies Array.isArray, Object.keys
 */
if (!Array.info) {
    //@include "./isArray.js"
    //@include "../../Object/Lib/keys.js"
    Array.info = function (arr) {
        var uniformityInfo = {
            isUniform: true,
            maxDepth: 0,
            lengthsAtDepth: {},
            typeOfElements: "undefined" // Default type
        };

        var typesEncountered = {}; // Tracks types encountered

        const analyzeArray = function (array, depth) {
            if (depth === undefined) depth = 0;

            // Update maximum depth if necessary
            uniformityInfo.maxDepth = Math.max(uniformityInfo.maxDepth, depth);

            // Initialize lengths array for this depth if it does not exist
            if (!uniformityInfo.lengthsAtDepth[depth]) {
                uniformityInfo.lengthsAtDepth[depth] = [];
            }
            // Add the length of the current array to the lengths array for this depth
            uniformityInfo.lengthsAtDepth[depth].push(array.length);

            for (var i = 0, len = array.length; i < len; i++) {
                var item = array[i];
                if (Array.isArray(item)) {
                    // Recurse for sub-arrays
                    analyzeArray(item, depth + 1);
                } else {
                    // Inspect element type
                    var itemType = item === null ? "undefined" : typeof item; // Treat null as 'undefined'
                    typesEncountered[itemType] = true;
                }
            }
        };

        analyzeArray(arr); // Start the analysis with the provided array

        // Determine typeOfElements
        var keys = Object.keys(typesEncountered);
        if (keys.length > 1) {
            uniformityInfo.typeOfElements = "mixed";
        } else if (keys.length === 1) {
            uniformityInfo.typeOfElements = keys[0];
        } // Default to 'undefined' if keys.length is 0

        // Check uniformity at each depth
        for (var depth in uniformityInfo.lengthsAtDepth) {
            var lengths = uniformityInfo.lengthsAtDepth[depth];
            var firstLength = lengths[0];
            for (var i = 0; i < lengths.length; i++) {
                if (lengths[i] !== firstLength) {
                    uniformityInfo.isUniform = false;
                    break;
                }
            }
            if (!uniformityInfo.isUniform) break; // Exit early if uniformity is broken
        }

        return uniformityInfo;
    };
}