// Date.prototype.toTemporalInstant polyfill for ExtendScript

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
