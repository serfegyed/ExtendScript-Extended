/**
 * Reverses a string while preserving UTF-16 surrogate pairs.
 *
 * @return {string} The reversed string.
 */
if (!String.prototype.reverse) {
    String.prototype.reverse = function () {
        var string = String(this);
        var characters = string.match(/[\ud800-\udbff][\udc00-\udfff]|[\s\S]/g);

        return characters ? characters.reverse().join("") : "";
    };
}
