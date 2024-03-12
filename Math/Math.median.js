/**
 * Calculate the median of the given array or values. Be careful using non-number values.
 *
 * @param {array | values} values - The array of values or individual values
 * @return {number} The median value of the input array
 */
if (!Math.median) {
    Math.median = function (/* array | values */) {
        var values = arguments[0] instanceof Array ? arguments[0] : Array.prototype.slice.call(arguments);
        if (!values.length) return NaN; // Return NaN if no values

        values.sort(function (a, b) {
            return a - b;
        });

        var half = Math.floor(values.length / 2);
        if (values.length % 2) {
            return values[half];
        } else {
            return (values[half - 1] + values[half]) / 2.0;
        }
    };
}