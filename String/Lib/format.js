/**
 * Formats unnamed `{}` placeholders or named `{property}` placeholders.
 *
 * @param {...*} values - Positional values, or one object with named values.
 * @return {string} The formatted string.
 */
if (!String.prototype.format) {
    String.prototype.format = function () {
        var string = String(this);
        var isNamed = typeof arguments[0] === "object" && arguments[0] !== null;
        var values;
        var marker;
        var index;
        var key;
        var i;

        if (isNamed) {
            values = arguments[0];
            for (key in values) {
                if (Object.prototype.hasOwnProperty.call(values, key)) {
                    marker = "{" + key + "}";
                    string = string.split(marker).join(String(values[key]));
                }
            }
        } else {
            for (i = 0; i < arguments.length; i++) {
                index = string.indexOf("{}");
                if (index === -1) {
                    break;
                }
                string = string.slice(0, index) + String(arguments[i]) +
                    string.slice(index + 2);
            }
        }

        return string;
    };
}
