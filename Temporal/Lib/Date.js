// v1 - Add Date.prototype.toISOString for ExtendScript
// v2 - Add Date.prototype.toJSON with generic ES behavior
// v3 - Normalize RangeError and TypeError names for ExtendScript
// v4 - Add Date.prototype.toTemporalInstant with runtime Temporal validation
// v5 - Isolate every polyfill and move its helpers inside the method
// v6 - Call native Date prototype methods directly

(function () {
    if (!Date.prototype.toISOString) {
        Date.prototype.toISOString = function () {
            var time;

            function rangeError(message) {
                var error = new RangeError(message);

                error.name = "RangeError";
                return error;
            }

            function typeError(message) {
                var error = new TypeError(message);

                error.name = "TypeError";
                return error;
            }

            function pad(number, length) {
                var string = String(number);

                while (string.length < length) {
                    string = "0" + string;
                }
                return string;
            }

            function formatYear(year) {
                if (year >= 0 && year <= 9999) {
                    return pad(year, 4);
                }
                return (year < 0 ? "-" : "+") + pad(Math.abs(year), 6);
            }

            try {
                time = Date.prototype.getTime.call(this);
            } catch (error) {
                throw typeError("Date.prototype.toISOString called on incompatible receiver");
            }

            if (!isFinite(time)) {
                throw rangeError("Invalid time value");
            }

            return (
                formatYear(Date.prototype.getUTCFullYear.call(this)) + "-" +
                pad(Date.prototype.getUTCMonth.call(this) + 1, 2) + "-" +
                pad(Date.prototype.getUTCDate.call(this), 2) + "T" +
                pad(Date.prototype.getUTCHours.call(this), 2) + ":" +
                pad(Date.prototype.getUTCMinutes.call(this), 2) + ":" +
                pad(Date.prototype.getUTCSeconds.call(this), 2) + "." +
                pad(Date.prototype.getUTCMilliseconds.call(this), 3) + "Z"
            );
        };
    }
}());

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

(function () {
    if (!Date.prototype.toTemporalInstant) {
        Date.prototype.toTemporalInstant = function () {
            var time;

            function rangeError(message) {
                var error = new RangeError(message);

                error.name = "RangeError";
                return error;
            }

            function typeError(message) {
                var error = new TypeError(message);

                error.name = "TypeError";
                return error;
            }

            try {
                time = Date.prototype.getTime.call(this);
            } catch (error) {
                throw typeError("Date.prototype.toTemporalInstant called on incompatible receiver");
            }

            if (!isFinite(time)) {
                throw rangeError("Invalid time value");
            }
            if (typeof Temporal === "undefined" || Temporal === null ||
                    typeof Temporal !== "object") {
                throw typeError("Temporal namespace is unavailable");
            }
            if (typeof Temporal.Instant !== "function" ||
                    typeof Temporal.Instant.fromEpochMilliseconds !== "function") {
                throw typeError("Temporal.Instant.fromEpochMilliseconds is unavailable");
            }

            return Temporal.Instant.fromEpochMilliseconds(time);
        };
    }
}());
