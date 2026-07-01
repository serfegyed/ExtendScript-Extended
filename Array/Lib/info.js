/**
 * Reports nested Array dimensions, uniformity, and leaf value types.
 */
//@include "./isArray.js"
if (!Array.info) {
    Array.info = function (array) {
        var result = {
            isUniform: true,
            maxDepth: 0,
            lengthsAtDepth: {},
            typeOfElements: "undefined"
        };
        var types = [];
        var depth;

        function recordType(type) {
            var i;

            for (i = 0; i < types.length; i++) {
                if (types[i] === type) return;
            }
            types[types.length] = type;
        }

        function analyze(current, currentDepth) {
            var item;
            var itemType;
            var i;

            if (currentDepth > result.maxDepth) result.maxDepth = currentDepth;
            if (!result.lengthsAtDepth[currentDepth]) {
                result.lengthsAtDepth[currentDepth] = [];
            }
            result.lengthsAtDepth[currentDepth].push(current.length);
            for (i = 0; i < current.length; i++) {
                item = current[i];
                if (Array.isArray(item)) {
                    analyze(item, currentDepth + 1);
                } else {
                    itemType = item === null ? "undefined" : typeof item;
                    recordType(itemType);
                }
            }
        }

        if (!Array.isArray(array)) {
            throw new TypeError("Array.info requires an Array.");
        }
        analyze(array, 0);
        if (types.length > 1) result.typeOfElements = "mixed";
        else if (types.length === 1) result.typeOfElements = types[0];

        for (depth in result.lengthsAtDepth) {
            if (Object.prototype.hasOwnProperty.call(result.lengthsAtDepth, depth)) {
                var lengths = result.lengthsAtDepth[depth];
                var firstLength = lengths[0];
                var i;

                for (i = 1; i < lengths.length; i++) {
                    if (lengths[i] !== firstLength) {
                        result.isUniform = false;
                        return result;
                    }
                }
            }
        }
        return result;
    };
}
