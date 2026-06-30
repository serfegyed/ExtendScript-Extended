/**
 * Checks whether a primitive string is empty.
 *
 * @param {string} string - The string to check.
 * @return {boolean} True only for an empty string.
 * @throws {TypeError} If the value is not a primitive string.
 */
if (!String.isEmpty) {
    String.isEmpty = function (string) {
        if (typeof string !== "string") {
            throw new TypeError(string + " is not a String");
        }

        return string.length === 0;
    };
}
