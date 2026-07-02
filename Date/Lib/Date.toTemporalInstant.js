// Date.prototype.toTemporalInstant polyfill for ExtendScript

(function () {
    if (!Date.prototype.toTemporalInstant) {
        Date.prototype.toTemporalInstant = function () {
            var time;

            try {
                time = Date.prototype.getTime.call(this);
            } catch (error) {
                throw new TypeError("Date.prototype.toTemporalInstant called on incompatible receiver");
            }

            if (!isFinite(time)) {
                throw new RangeError("Invalid time value");
            }
            if (typeof Temporal === "undefined" || Temporal === null ||
                    typeof Temporal !== "object") {
                throw new TypeError("Temporal namespace is unavailable");
            }
            if (typeof Temporal.Instant !== "function" ||
                    typeof Temporal.Instant.fromEpochMilliseconds !== "function") {
                throw new TypeError("Temporal.Instant.fromEpochMilliseconds is unavailable");
            }

            return Temporal.Instant.fromEpochMilliseconds(time);
        };
    }
}());
