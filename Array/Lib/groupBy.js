/**
 * Groups the elements according to the string values returned by a callback function
 *
 * @param {Function} callback - Should return a string that determines the group of the element.
 * @return {Object} An object containing arrays of elements grouped by the callback function.
 * 					The keys are the groups returned by the callback function.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group
 */
if (!Array.prototype.groupBy) {
    Array.prototype.groupBy = function (callback, thisArg) { // ChatGPT-4 version
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }
        if (this == null || !this.length) {
            throw new TypeError('Array.prototype.groupBy called on null or undefined');
        }

        var len = this.length;
        var groups = {};

        for (var i = 0; i < len; i++) {
            // Handle sparse arrays
            if (!(i in this)) {
                continue;
            }

            var groupName = callback.call(thisArg, this[i], i, this);
            if (Object.prototype.hasOwnProperty.call(groups, groupName)) {
                groups[groupName].push(this[i]);
            } else {
                groups[groupName] = [this[i]];
            }
        }
        return groups;
    };
};