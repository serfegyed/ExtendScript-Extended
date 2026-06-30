// Date.prototype.toJSON polyfill for ExtendScript

(function () {
    if (!Date.prototype.toJSON) {
        Date.prototype.toJSON = function () {
            var object = Object(this);
            var primitive;
            var toISOString;

            function typeError(message) {
                var error = new TypeError(message);

                error.name = "TypeError";
                return error;
            }

            function isPrimitive(value) {
                return value === null ||
                    (typeof value !== "object" && typeof value !== "function");
            }

            function toPrimitiveNumber(value) {
                var result;

                if (typeof value.valueOf === "function") {
                    result = value.valueOf();
                    if (isPrimitive(result)) return result;
                }
                if (typeof value.toString === "function") {
                    result = value.toString();
                    if (isPrimitive(result)) return result;
                }
                throw typeError("Cannot convert object to primitive value");
            }

            primitive = toPrimitiveNumber(object);
            if (typeof primitive === "number" && !isFinite(primitive)) {
                return null;
            }

            toISOString = object.toISOString;
            if (typeof toISOString !== "function") {
                throw typeError("toISOString is not a function");
            }
            return toISOString.call(object);
        };
    }
}());
