/**
 * Checks if a string is well-formed.
 *
 * @return {boolean} Returns true if the string is well-formed, false otherwise.
 */
if (!String.prototype.isWellFormed) {
    String.prototype.isWellFormed = function () {
        var str = this;
        for (var i = 0; i < str.length; ++i) {
            var isSurrogate = (str.charCodeAt(i) & 0xf800) === 0xd800;
            if (!isSurrogate) {
                continue;
            }
            var isLeadingSurrogate = str.charCodeAt(i) < 0xdc00;
            if (!isLeadingSurrogate) {
                return false; // unpaired trailing surrogate
            }
            var isFollowedByTrailingSurrogate =
                i + 1 < str.length && (str.charCodeAt(i + 1) & 0xfc00) === 0xdc00;
            if (!isFollowedByTrailingSurrogate) {
                return false; // unpaired leading surrogate
            }
            ++i;
        }
        return true;
    };
}