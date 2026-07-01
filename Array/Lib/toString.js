/**
 * Intentionally overrides native Array output for readable ExtendScript logs.
 */
Array.prototype.toString = function () {
    var elements = new Array(this.length);
    var value;
    var i;

    for (i = 0; i < this.length; i++) {
        if (i in this) {
            value = this[i];
            if (typeof value === "string") {
                elements[i] = "\"" + value
                    .replace(/\\/g, "\\\\")
                    .replace(/\"/g, "\\\"")
                    .replace(/\r/g, "\\r")
                    .replace(/\n/g, "\\n") + "\"";
            } else if (value === null) {
                elements[i] = "null";
            } else if (typeof value === "undefined") {
                elements[i] = "undefined";
            } else {
                elements[i] = String(value);
            }
        }
    }
    return "[" + elements.join(", ") + "]";
};
