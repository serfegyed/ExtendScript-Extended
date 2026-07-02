// v1 - Add the ExtendScript ISO/millisecond Temporal.Instant subset
// v2 - Add the public millisecond constructor and reuse shared Core helpers
// v3 - Reuse Core fixed-time and Instant-range constants
// v4 - Omit Intl- and time-zone-dependent toLocaleString
// v5 - Reuse Core Instant parsing and UTC ISO-field projection helpers

(function (Temporal) {
    function createInstant(epochMilliseconds) {
        return new Temporal.Instant(epochMilliseconds);
    }

    function toInstant(value) {
        if (value instanceof Temporal.Instant) {
            return createInstant(value.epochMilliseconds);
        }
        if (typeof value === "string" || (typeof value === "object" && value !== null)) {
            return createInstant(Temporal.__parseInstantString__(value));
        }
        throw new TypeError("Temporal error: Instant argument must be Instant or string.");
    }

    function toInstantTimeUnit(value, defaultValue) {
        var unit = value === undefined ? defaultValue : Temporal.__singularUnit__(String(value));

        if (Temporal.__timeUnitToMilliseconds__(unit) === 0 || unit === "day") {
            if (unit === "year" || unit === "month" || unit === "week" || unit === "day") {
                throw new RangeError("Temporal error: Found date unit, expect time unit");
            }
            throw new RangeError("Value " + unit + " is not a supported Instant time unit.");
        }
        return unit;
    }

    function durationToMilliseconds(value) {
        var duration = Temporal.Duration.from(value);

        if (duration.years !== 0 || duration.months !== 0 || duration.weeks !== 0 || duration.days !== 0) {
            throw new RangeError("Temporal error: Largest unit cannot be a date unit");
        }
        return duration.total({ unit: "millisecond" });
    }

    function roundInstant(epochMilliseconds, unit, increment, roundingMode) {
        var dayStart = Math.floor(epochMilliseconds / Temporal.__MILLISECONDS_PER_DAY__) *
            Temporal.__MILLISECONDS_PER_DAY__;
        var withinDay = epochMilliseconds - dayStart;
        var roundedWithinDay = Temporal.__roundField__(withinDay,
            Temporal.__timeUnitToMilliseconds__(unit) * increment, roundingMode);

        return Temporal.__validateInstantEpochMilliseconds__(dayStart + roundedWithinDay);
    }

    Temporal.Instant = function (epochMilliseconds) {
        if (!(this instanceof Temporal.Instant)) {
            throw new TypeError("Temporal.Instant constructor must be called with new");
        }
        this.epochMilliseconds = Temporal.__validateInstantEpochMilliseconds__(epochMilliseconds);
        return this;
    };

    Temporal.Instant.from = function (value) {
        return toInstant(value);
    };

    Temporal.Instant.fromEpochMilliseconds = function (epochMilliseconds) {
        return createInstant(epochMilliseconds);
    };

    Temporal.Instant.compare = function (one, two) {
        var first = toInstant(one).epochMilliseconds;
        var second = toInstant(two).epochMilliseconds;

        return first < second ? -1 : (first > second ? 1 : 0);
    };

    Temporal.Instant.prototype.add = function (duration) {
        return createInstant(this.epochMilliseconds + durationToMilliseconds(duration));
    };

    Temporal.Instant.prototype.subtract = function (duration) {
        return createInstant(this.epochMilliseconds - durationToMilliseconds(duration));
    };

    Temporal.Instant.prototype.until = function (other, options) {
        options = Temporal.__normalizeOptions__(options);

        var largestUnit = options.largestUnit === undefined ?
            "second" : Temporal.__singularUnit__(String(options.largestUnit));
        if (largestUnit === "auto") largestUnit = "second";
        largestUnit = toInstantTimeUnit(largestUnit);
        var smallestUnit = toInstantTimeUnit(options.smallestUnit, "millisecond");
        if (Temporal.__timeUnitToMilliseconds__(smallestUnit) >
                Temporal.__timeUnitToMilliseconds__(largestUnit)) {
            throw new RangeError("Temporal error: smallestUnit was larger than largestUnit.");
        }

        var roundingMode = options.roundingMode === undefined ? "trunc" : options.roundingMode;
        if (!Temporal.__isValidRoundingMode__(roundingMode)) {
            throw new RangeError("Value " + roundingMode + " is not a valid roundingMode.");
        }
        var roundingIncrement = Temporal.__validateTimeRoundingIncrement__(
            options.roundingIncrement, smallestUnit, false
        );
        var difference = toInstant(other).epochMilliseconds - this.epochMilliseconds;
        var rounded = Temporal.__roundField__(
            difference,
            Temporal.__timeUnitToMilliseconds__(smallestUnit) * roundingIncrement,
            roundingMode
        );

        return Temporal.Duration.from(
            Temporal.__millisecondsToTimeDurationFields__(rounded, largestUnit)
        );
    };

    Temporal.Instant.prototype.since = function (other, options) {
        return toInstant(other).until(this, options);
    };

    Temporal.Instant.prototype.round = function (roundTo) {
        var options;

        if (roundTo === undefined) {
            throw new TypeError("Temporal error: Must specify a roundTo parameter.");
        }
        if (typeof roundTo === "string") {
            options = { smallestUnit: roundTo };
        } else {
            options = Temporal.__normalizeOptions__(roundTo);
        }
        if (options.smallestUnit === undefined) {
            throw new RangeError("Temporal error: smallestUnit is required.");
        }

        var smallestUnit = toInstantTimeUnit(options.smallestUnit);
        var roundingMode = options.roundingMode === undefined ? "halfExpand" : options.roundingMode;
        if (!Temporal.__isValidRoundingMode__(roundingMode)) {
            throw new RangeError("Value " + roundingMode + " is not a valid roundingMode.");
        }
        var roundingIncrement = Temporal.__validateTimeRoundingIncrement__(
            options.roundingIncrement, smallestUnit, true
        );

        return createInstant(roundInstant(this.epochMilliseconds, smallestUnit, roundingIncrement, roundingMode));
    };

    Temporal.Instant.prototype.equals = function (other) {
        return this.epochMilliseconds === toInstant(other).epochMilliseconds;
    };

    Temporal.Instant.prototype.toString = function (options) {
        options = Temporal.__normalizeOptions__(options);
        if (options.smallestUnit !== undefined) {
            toInstantTimeUnit(options.smallestUnit);
        }
        return Temporal.__formatISO__(
            Temporal.__epochMillisecondsToISOFields__(this.epochMilliseconds),
            "PlainDateTime",
            options
        ) + "Z";
    };

    Temporal.Instant.prototype.toJSON = function () {
        return this.toString();
    };

    Temporal.Instant.prototype.valueOf = function () {
        throw new TypeError(
            "Do not use Temporal.Instant.prototype.valueOf; use Temporal.Instant.compare for comparison."
        );
    };
}(Temporal));
