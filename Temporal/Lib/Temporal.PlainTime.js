//
// v1 Extract PlainTime from PlainDateTime and add the ISO/millisecond subset
// v2 Reject rounding increments equal to the unit radix like Node Temporal
// v3 Align half-even time rounding increments to their parent unit
// v4 Remove non-specification PlainTime.toPlainDateTime
// v5 Preserve negative difference fields and sign on ExtendScript
// v6 Derive difference direction before rounding for ExtendScript
// v7 Parenthesize nested sign ternaries for ExtendScript
// v8 Parenthesize the remaining nested rounding-radix ternary
// v9 Align explicit largestUnit auto and leap-second string parsing
// v10 Align inherited fields, plural units, and toString option coercion
// v11 Reuse shared Temporal-core16 helpers
// v12 Align local ISO hour-only and date-time separator forms
// v14 Project full Z and numeric-offset ISO strings to UTC time fields
// v13 Reuse Temporal-core20 fixed-time constants
//

(function (Temporal) {
    function normalizeOverflow(options) {
        options = Temporal.__normalizeOptions__(options);
        var overflow = options.overflow === undefined ? "constrain" : options.overflow;
        if (overflow !== "constrain" && overflow !== "reject") {
            throw new RangeError("Invalid overflow: " + overflow);
        }
        return overflow;
    }

    function normalizeField(value, maximum, overflow) {
        var integer = Temporal.__toInteger__(value);
        return Temporal.__isBetween__(integer, 0, maximum, overflow);
    }

    function createTime(hour, minute, second, millisecond, overflow) {
        return new Temporal.PlainTime(
            normalizeField(hour === undefined ? 0 : hour, 23, overflow),
            normalizeField(minute === undefined ? 0 : minute, 59, overflow),
            normalizeField(second === undefined ? 0 : second, 59, overflow),
            normalizeField(millisecond === undefined ? 0 : millisecond, 999, overflow)
        );
    }

    function parseTimeString(value) {
        if (/[zZ]$/.test(value) || /[+-]\d{2}:?\d{2}$/.test(value)) {
            throw new RangeError("UTC designator or offset is not valid for PlainTime parsing.");
        }

        var match = value.match(/^(?:(?:([-+]?\d{4,6})-(\d{2})-(\d{2})[Tt ])|[Tt])?(\d{2})(?::(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?)?$/);
        if (!match) {
            throw new RangeError("Invalid ISO time string");
        }

        if (match[1] !== undefined) {
            Temporal.__validateDate__(Number(match[1]), Number(match[2]), Number(match[3]), "reject");
        }

        var fraction = match[7] || "";
        var milliseconds = Number((fraction + "000").substring(0, 3));
        var second = Number(match[6] || 0);
        if (second === 60) second = 59;
        var minute = (match[5] === undefined) ? 0 : Number(match[5]);
        return createTime(Number(match[4]), minute, second, milliseconds, "reject");
    }

    function millisecondsToTime(milliseconds) {
        var balanced = Temporal.__balanceTimeUnits__(0, 0, 0, milliseconds);
        return new Temporal.PlainTime(balanced.hour, balanced.minute, balanced.second, balanced.millisecond);
    }

    function unitRank(unit) {
        if (unit === "hour") return 3;
        if (unit === "minute") return 2;
        if (unit === "second") return 1;
        if (unit === "millisecond") return 0;
        return -1;
    }

    function validateRoundingIncrement(value, unit) {
        var increment = value === undefined ? 1 : Number(value);
        var maximum = (unit === "hour") ? 24 :
            ((unit === "millisecond") ? Temporal.__MILLISECONDS_PER_SECOND__ : 60);

        if (!isFinite(increment) || increment < 1 || increment !== Math.floor(increment)) {
            throw new RangeError("Temporal error: roundingIncrement must be a positive integer.");
        }
        if (increment >= maximum || maximum % increment !== 0) {
            throw new RangeError("Temporal error: dividend is not divisible by roundingIncrement.");
        }
        return increment;
    }

    function durationFromMilliseconds(milliseconds, largestUnit, sign) {
        var remainder = Math.abs(milliseconds);
        var fields = { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };

        if (largestUnit === "hour") {
            fields.hours = Math.floor(remainder / Temporal.__MILLISECONDS_PER_HOUR__);
            remainder -= fields.hours * Temporal.__MILLISECONDS_PER_HOUR__;
        }
        if (largestUnit === "hour" || largestUnit === "minute") {
            fields.minutes = Math.floor(remainder / Temporal.__MILLISECONDS_PER_MINUTE__);
            remainder -= fields.minutes * Temporal.__MILLISECONDS_PER_MINUTE__;
        }
        if (largestUnit !== "millisecond") {
            fields.seconds = Math.floor(remainder / Temporal.__MILLISECONDS_PER_SECOND__);
            remainder -= fields.seconds * Temporal.__MILLISECONDS_PER_SECOND__;
        }
        fields.milliseconds = remainder;

        var duration = Temporal.Duration.from(fields);
        return ((sign < 0) && !duration.blank) ? duration.negated() : duration;
    }

    function roundTime(time, smallestUnit, increment, roundingMode) {
        var total = Temporal.__timeToMilliseconds__(time);
        var parentStart;

        if (smallestUnit === "hour") {
            parentStart = 0;
        } else if (smallestUnit === "minute") {
            parentStart = time.hour * Temporal.__MILLISECONDS_PER_HOUR__;
        } else if (smallestUnit === "second") {
            parentStart = (time.hour * 60 + time.minute) * Temporal.__MILLISECONDS_PER_MINUTE__;
        } else {
            parentStart = ((time.hour * 60 + time.minute) * 60 + time.second) * Temporal.__MILLISECONDS_PER_SECOND__;
        }

        return millisecondsToTime(parentStart + Temporal.__roundField__(
            total - parentStart,
            Temporal.__timeUnitToMilliseconds__(smallestUnit) * increment,
            roundingMode
        ));
    }

    function difference(start, end, options) {
        options = Temporal.__normalizeOptions__(options);
        var largestUnit = options.largestUnit === undefined ? "hour" : options.largestUnit;
        var smallestUnit = options.smallestUnit === undefined ? "millisecond" : options.smallestUnit;
        var roundingMode = options.roundingMode === undefined ? "trunc" : options.roundingMode;

        largestUnit = Temporal.__singularUnit__(largestUnit);
        smallestUnit = Temporal.__singularUnit__(smallestUnit);
        if (largestUnit === "auto") largestUnit = "hour";

        if (unitRank(largestUnit) < 0 || unitRank(smallestUnit) < 0) {
            throw new RangeError("Temporal error: PlainTime differences require time units.");
        }
        if (unitRank(largestUnit) < unitRank(smallestUnit)) {
            throw new RangeError("Temporal error: largestUnit must not be smaller than smallestUnit.");
        }
        if (!Temporal.__isValidRoundingMode__(roundingMode)) {
            throw new RangeError("Invalid roundingMode: " + roundingMode);
        }

        var increment = validateRoundingIncrement(options.roundingIncrement, smallestUnit);
        var rawDifference = Temporal.__timeToMilliseconds__(end) - Temporal.__timeToMilliseconds__(start);
        var direction = (rawDifference < 0) ? -1 : ((rawDifference > 0) ? 1 : 0);
        var roundedMagnitude = Math.abs(Temporal.__roundField__(
            rawDifference,
            Temporal.__timeUnitToMilliseconds__(smallestUnit) * increment,
            roundingMode
        ));
        return durationFromMilliseconds(
            roundedMagnitude,
            largestUnit,
            (roundedMagnitude === 0) ? 0 : direction
        );
    }

    Temporal.PlainTime = function (hour, minute, second, millisecond) {
        if (!(this instanceof Temporal.PlainTime)) {
            throw new TypeError("Temporal.PlainTime constructor must be called with new");
        }

        this.hour = normalizeField(hour === undefined ? 0 : hour, 23, "reject");
        this.minute = normalizeField(minute === undefined ? 0 : minute, 59, "reject");
        this.second = normalizeField(second === undefined ? 0 : second, 59, "reject");
        this.millisecond = normalizeField(millisecond === undefined ? 0 : millisecond, 999, "reject");
        return this;
    };

    Temporal.PlainTime.from = function (thing, options) {
        var overflow = normalizeOverflow(options);

        if (thing instanceof Temporal.PlainTime) {
            return new Temporal.PlainTime(thing.hour, thing.minute, thing.second, thing.millisecond);
        }
        if (typeof Temporal.PlainDateTime === "function" && thing instanceof Temporal.PlainDateTime) {
            return new Temporal.PlainTime(thing.hour, thing.minute, thing.second, thing.millisecond);
        }
        if (typeof thing === "string") {
            var projected = Temporal.__projectOffsetISOStringToUTCFields__(thing);
            if (projected !== null) {
                return createTime(
                    projected.hour,
                    projected.minute,
                    projected.second,
                    projected.millisecond,
                    "reject"
                );
            }
            return parseTimeString(thing);
        }
        if (thing !== null && typeof thing === "object") {
            var names = ["hour", "minute", "second", "millisecond"];
            var values = {};
            var found = false;
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                if ((name in thing) && thing[name] !== undefined) {
                    values[name] = thing[name];
                    found = true;
                }
            }
            if (!found) {
                throw new TypeError("Temporal error: Must specify at least one time field.");
            }
            return createTime(values.hour, values.minute, values.second, values.millisecond, overflow);
        }
        throw new TypeError("Temporal error: Time-like argument must be object or string.");
    };

    Temporal.PlainTime.compare = function (one, two) {
        return Temporal.__compareTimeRecord__(Temporal.PlainTime.from(one), Temporal.PlainTime.from(two));
    };

    Temporal.PlainTime.prototype.toString = function (options) {
        if (options === undefined) return Temporal.__formatISO__(this, "PlainTime");
        options = Temporal.__normalizeOptions__(options);

        var smallestUnit = options.smallestUnit;
        var fractionalSecondDigits = options.fractionalSecondDigits;
        var roundingMode = options.roundingMode === undefined ? "trunc" : options.roundingMode;
        if (!Temporal.__isValidRoundingMode__(roundingMode)) {
            throw new RangeError("Invalid roundingMode: " + roundingMode);
        }
        var increment = 1;
        if (smallestUnit !== undefined) {
            smallestUnit = Temporal.__singularUnit__(smallestUnit);
            if (smallestUnit !== "minute" && smallestUnit !== "second" && smallestUnit !== "millisecond") {
                throw new RangeError("Invalid smallestUnit: " + smallestUnit);
            }
            increment = Temporal.__timeUnitToMilliseconds__(smallestUnit);
        } else if (fractionalSecondDigits !== undefined && fractionalSecondDigits !== "auto") {
            if (typeof fractionalSecondDigits !== "number" || !isFinite(fractionalSecondDigits) ||
                    fractionalSecondDigits < 0 || fractionalSecondDigits >= 4) {
                throw new RangeError("fractionalSecondDigits value is out of range for the millisecond subset.");
            }
            fractionalSecondDigits = Math.floor(fractionalSecondDigits);
            increment = fractionalSecondDigits === 0 ?
                Temporal.__MILLISECONDS_PER_SECOND__ : Math.pow(10, 3 - fractionalSecondDigits);
        }

        if (smallestUnit !== undefined && fractionalSecondDigits !== undefined && fractionalSecondDigits !== "auto") {
            if (typeof fractionalSecondDigits !== "number" || !isFinite(fractionalSecondDigits) ||
                    fractionalSecondDigits < 0 || fractionalSecondDigits >= 4) {
                throw new RangeError("fractionalSecondDigits value is out of range for the millisecond subset.");
            }
            fractionalSecondDigits = Math.floor(fractionalSecondDigits);
        }

        var rounded = millisecondsToTime(Temporal.__roundField__(Temporal.__timeToMilliseconds__(this), increment, roundingMode));
        var result = Temporal.__pad__(rounded.hour, 2) + ":" + Temporal.__pad__(rounded.minute, 2);
        if (smallestUnit === "minute") return result;
        result += ":" + Temporal.__pad__(rounded.second, 2);

        if (smallestUnit === "second") return result;
        var fraction = Temporal.__pad__(rounded.millisecond, 3);
        if (smallestUnit === "millisecond") return result + "." + fraction;
        if (fractionalSecondDigits === 0) return result;
        if (typeof fractionalSecondDigits === "number") {
            fraction = fraction.substring(0, fractionalSecondDigits);
        } else {
            fraction = fraction.replace(/0+$/, "");
        }
        return fraction ? result + "." + fraction : result;
    };

    Temporal.PlainTime.prototype.toJSON = function () {
        return this.toString();
    };

    Temporal.PlainTime.prototype.valueOf = function () {
        throw new TypeError("Do not use Temporal.PlainTime.prototype.valueOf; use Temporal.PlainTime.compare for comparison.");
    };

    Temporal.PlainTime.prototype.equals = function (other) {
        return Temporal.PlainTime.compare(this, other) === 0;
    };

    Temporal.PlainTime.prototype.with = function (timeLike, options) {
        if (timeLike === null || typeof timeLike !== "object") {
            throw new TypeError("Invalid PlainTime object.");
        }
        if (("calendar" in timeLike) || ("timeZone" in timeLike)) {
            throw new TypeError("PlainTime.with does not accept calendar or timeZone fields.");
        }
        var names = ["hour", "minute", "second", "millisecond"];
        var values = { hour: this.hour, minute: this.minute, second: this.second, millisecond: this.millisecond };
        var found = false;
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            if ((name in timeLike) && timeLike[name] !== undefined) {
                values[name] = timeLike[name];
                found = true;
            }
        }
        if (!found) {
            throw new TypeError("Temporal.PlainTime.prototype.with requires at least one time field.");
        }
        return createTime(values.hour, values.minute, values.second, values.millisecond, normalizeOverflow(options));
    };

    Temporal.PlainTime.prototype.add = function (duration) {
        duration = Temporal.Duration.from(duration);
        return millisecondsToTime(
            Temporal.__timeToMilliseconds__(this) + duration.hours * Temporal.__MILLISECONDS_PER_HOUR__ + duration.minutes * Temporal.__MILLISECONDS_PER_MINUTE__ +
            duration.seconds * Temporal.__MILLISECONDS_PER_SECOND__ + duration.milliseconds
        );
    };

    Temporal.PlainTime.prototype.subtract = function (duration) {
        return this.add(Temporal.Duration.from(duration).negated());
    };

    Temporal.PlainTime.prototype.until = function (other, options) {
        return difference(this, Temporal.PlainTime.from(other), options);
    };

    Temporal.PlainTime.prototype.since = function (other, options) {
        return difference(Temporal.PlainTime.from(other), this, options);
    };

    Temporal.PlainTime.prototype.round = function (roundTo) {
        if (roundTo === undefined) {
            throw new TypeError("Temporal error: Must specify a roundTo parameter.");
        }
        var options = typeof roundTo === "string" ? { smallestUnit: roundTo } : Temporal.__normalizeOptions__(roundTo);
        var smallestUnit = Temporal.__singularUnit__(options.smallestUnit);
        var roundingMode = options.roundingMode === undefined ? "halfExpand" : options.roundingMode;
        if (unitRank(smallestUnit) < 0) {
            throw new RangeError("Temporal error: PlainTime.round requires a time unit.");
        }
        if (!Temporal.__isValidRoundingMode__(roundingMode)) {
            throw new RangeError("Invalid roundingMode: " + roundingMode);
        }
        var increment = validateRoundingIncrement(options.roundingIncrement, smallestUnit);
        return roundTime(this, smallestUnit, increment, roundingMode);
    };

    Temporal.__plainTimeVersion__ = 12;
})(Temporal);
