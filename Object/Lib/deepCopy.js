/**
 * Copies an object deeply, including nested objects, arrays, and Date objects.
 *
 * @param {object} obj - The object to be copied.
 * @return {object} The deep copy of the object.
 */
if (!Object.deepCopy) {
    Object.deepCopy = function (obj) {
        var stack = [];

        function isRegExp(value) {
            return value instanceof RegExp || value.__class__ === "RegExp" ||
                value.reflect && value.reflect.name === "RegExp";
        }

        function clone(value) {
            var cloned;
            var i;
            var key;
            var text;
            var slash;

            if (value === null) return null;

            if (isRegExp(value)) {
                text = String(value);
                slash = text.lastIndexOf("/");
                return new RegExp(text.substring(1, slash), text.substring(slash + 1));
            }

            if (typeof value !== "object") return value;
            if (value instanceof Date) return new Date(value.getTime());

            for (i = 0; i < stack.length; i++) {
                if (stack[i] === value) {
                    throw new TypeError("Object.deepCopy: cyclic reference.");
                }
            }

            cloned = value instanceof Array ? [] : {};
            if (value instanceof Array) cloned.length = value.length;

            stack.push(value);
            for (key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    cloned[key] = clone(value[key]);
                }
            }
            stack.pop();

            return cloned;
        }

        return clone(obj);
    };
}
