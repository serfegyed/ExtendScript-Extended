/**
 * Returns an evaluable source representation of the Set.
 *
 * @return {string} Source text that can recreate the Set values.
 */
Set.prototype.toSource = function () {
    var values = this.toArray();
    var result = [];
    var i;

    if (typeof values.toSource === "function") {
        return "(new Set(" + values.toSource() + "))";
    }

    for (i = 0; i < values.length; i++) {
        if (typeof values[i] === "string") {
            result.push("\"" + values[i]
                .replace(/\\/g, "\\\\")
                .replace(/\"/g, "\\\"")
                .replace(/\r/g, "\\r")
                .replace(/\n/g, "\\n") + "\"");
        } else {
            result.push(String(values[i]));
        }
    }

    return "(new Set([" + result.join(", ") + "]))";
};
