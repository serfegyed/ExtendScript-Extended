/**
 * Returns an evaluable source representation of the Map.
 *
 * @return {string} Source text that can recreate the Map entries.
 */
Map.prototype.toSource = function () {
    var entries = this.toArray();
    var result = [];
    var pair;
    var i;

    if (typeof entries.toSource === "function") {
        return "(new Map(" + entries.toSource() + "))";
    }

    function quoteString(value) {
        return "\"" + value
            .replace(/\\/g, "\\\\")
            .replace(/\"/g, "\\\"")
            .replace(/\r/g, "\\r")
            .replace(/\n/g, "\\n") + "\"";
    }

    function sourceValue(value) {
        return typeof value === "string" ? quoteString(value) : String(value);
    }

    for (i = 0; i < entries.length; i++) {
        pair = entries[i];
        result.push("[" + sourceValue(pair[0]) + ", " +
            sourceValue(pair[1]) + "]");
    }

    return "(new Map([" + result.join(", ") + "]))";
};
