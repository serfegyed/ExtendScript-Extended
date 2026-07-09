// v36 Project Z and numeric-offset ISO strings to UTC fields
// v35 Reuse Temporal-core20 fixed-time constants
//
// v5 This refactor is about the the change of methods parameter checking
// v6 The Compare method refactor in accordance to specification
// v7 The balancing functions are put out to `Temporal-core.js`
// v8 Implementing `until` options
//	`roundField` funtion hoisted to `Temporal-core.js`
// v9 Fix `subtract` to delegate to `add` through a negated Duration
// v10 Use internal __copyFields__ helper name
// v11 Add PlainDate/PlainTime conversion helpers for PlainDateTime
// v12 Use RangeError for invalid Temporal values
// v13 Align PlainDateTime.from edge cases with Node Temporal
// v14 Use shared core error helpers consistently
// v15 Align PlainDateTime.with edge cases with Node Temporal
// v16 Add Node-reference compare edge coverage
// v17 Align minimal PlainTime helper for PlainDateTime conversions
// v18 Use shared Temporal.__pad__ helper from Temporal-core6.js
// v19 Delegate ISO string formatting to Temporal.__formatISO__
// v20 Align add/subtract calendar and time edge cases with Node Temporal
// v21 Align until/since basics and largestUnit behavior with Node Temporal
// v22 Align round basics, validation, and day rollover with Node Temporal
// v23 Align equals/valueOf object protocol edge behavior with Node Temporal
// v24 Add Node-aligned PlainDateTime.toString options subset
// v25 Use Temporal-core10 ISO formatter for toString fractional digit coercion
// v26 Align until/since smallestUnit validation and unit ordering edge cases
// v27 Align until/since roundingIncrement coercion and divisibility checks
// v28 Apply smallestUnit rounding to year/month until/since calendar remainders
// v29 Close until/since week largestUnit and option-shape edge cases
// v32 Remove the embedded PlainTime implementation after module extraction
// v33 Reuse shared Temporal-core16 time and rounding helpers
// v34 Add shared ISO monthCode input and static calendarId
//

(function (Temporal) {

    Temporal.PlainDateTime = function (year, month, day, hour, minute, second, millisecond) {

        if (!(this instanceof Temporal.PlainDateTime)) {
            return Temporal.PlainDateTime.from(year, month, day, hour, minute, second, millisecond);
        }

        // Basic validation
        const overflow = 'reject'; // Default of new PlainDateTime object generation

        var checkedDate = Temporal.__validateDate__(year, month, day, overflow);

        this.year = checkedDate.year;
        this.month = checkedDate.month;
        this.monthCode = Temporal.__formatISOMonthCode__(this.month);
        this.calendarId = "iso8601";
        this.day = checkedDate.day;
        this.hour = Temporal.__isBetween__(hour, 0, 23, overflow);
        this.minute = minute ? Temporal.__isBetween__(minute, 0, 59, overflow) : 0;
        this.second = second ? Temporal.__isBetween__(second, 0, 59, overflow) : 0;
        this.millisecond = millisecond ? Temporal.__isBetween__(millisecond, 0, 999, overflow) : 0;

        // Additional properties
        this.dayOfWeek = Temporal.__computeDayOfWeek__(this.year, this.month, this.day);
        this.dayOfYear = Temporal.__computeDayOfYear__(this.year, this.month, this.day);
        this.inLeapYear = Temporal.__isLeapYear__(this.year);
        this.daysInMonth = Temporal.__computeDaysInMonth__(this.year, this.month);
        this.daysInYear = this.inLeapYear ? 366 : 365;

        return this;
    };

    Temporal.PlainDateTime.from = function (value, params) {
        const validOverflow = { constrain: true, reject: true };
        var overflow = 'constrain';

        if (params !== undefined) {
            if (typeof params !== 'object' || params === null) {
                throw new TypeError("Invalid argument: 'params' must be an object.");
            }

            overflow = params.overflow === undefined ? 'constrain' : params.overflow;
            if (!validOverflow[overflow]) {
                throw new RangeError("Invalid overflow: " + overflow);
            };
        };

        if (value === undefined || value === null || typeof value === "number" || typeof value === "boolean") {
            throw new TypeError("Temporal error: DateTime argument must be object or string.");
        } else if (value instanceof Temporal.PlainDateTime) {
            return new Temporal.PlainDateTime(value.year, value.month, value.day, value.hour, value.minute, value.second, value.millisecond)
        } else if (typeof value === "string") {
            var projected = Temporal.__projectOffsetISOStringToUTCFields__(value);
            if (projected !== null) {
                return new Temporal.PlainDateTime(
                    projected.year,
                    projected.month,
                    projected.day,
                    projected.hour,
                    projected.minute,
                    projected.second,
                    projected.millisecond
                );
            }
            if (value.indexOf("Z") !== -1) {
                throw new RangeError("Temporal error: UTC designator is not valid for DateTime parsing.");
            }

            try {
                var parts = Temporal.__parseISOString__(value);
            } catch (error) {
                throw new RangeError(error.message);
            }

            var checkedDate = Temporal.__validateDate__(
                parseInt(parts.year, 10),
                parseInt(parts.month, 10),
                parseInt(parts.day, 10),
                "reject"
            );
            return new Temporal.PlainDateTime(
                checkedDate.year,
                checkedDate.month,
                checkedDate.day,
                Temporal.__isBetween__(parseInt(parts.hour, 10), 0, 23, overflow),
                parts.minute ? Temporal.__isBetween__(parseInt(parts.minute, 10), 0, 59, overflow) : 0,
                parts.second ? Temporal.__isBetween__(parseInt(parts.second, 10), 0, 59, overflow) : 0,
                parts.millisecond ? Temporal.__isBetween__(parts.millisecond, 0, 999, overflow) : 0
            );
        } else if (typeof value === "object" && value !== null) {
            // Check for required fields
            if (value.year === undefined ||
                (value.month === undefined && value.monthCode === undefined) ||
                value.day === undefined) {
                throw new TypeError("Invalid PlainDateTime object: missing required fields");
            }
            var checkedDate = Temporal.__validateDate__(
                parseInt(value.year, 10),
                Temporal.__resolveISOMonth__(value),
                parseInt(value.day, 10),
                overflow
            );
            return new Temporal.PlainDateTime(
                checkedDate.year,
                checkedDate.month,
                checkedDate.day,
                Temporal.__isBetween__(parseInt(value.hour, 10), 0, 23, overflow),
                value.minute ? Temporal.__isBetween__(parseInt(value.minute, 10), 0, 59, overflow) : 0,
                value.second ? Temporal.__isBetween__(parseInt(value.second, 10), 0, 59, overflow) : 0,
                value.millisecond ? Temporal.__isBetween__(value.millisecond, 0, 999, overflow) : 0
            );
        } else {
            throw new TypeError('Invalid type for Temporal.PlainDateTime.from');
        };
    };

    Temporal.PlainDateTime.prototype.toString = function (options) {
        return Temporal.__formatISO__(this, "PlainDateTime", options);
    };

    Temporal.PlainDateTime.compare = function (one, two) {
        one = Temporal.PlainDateTime.from(one);
        two = Temporal.PlainDateTime.from(two);

        const dateResult = Temporal.__compareISODate__(one, two);
        if (dateResult !== 0) return dateResult;
        return Temporal.__compareTimeRecord__(one, two);
    };

    Temporal.PlainDateTime.prototype.with = function (dateTimeLike, params) {
        const validOverflow = { constrain: true, reject: true };
        var overflow = 'constrain';
        const validDateTimeField = {
            year: { low: Temporal.MIN_YEAR, high: Temporal.MAX_YEAR },
            day: { low: 1, high: 31 },
            hour: { low: 0, high: 23 },
            minute: { low: 0, high: 59 },
            second: { low: 0, high: 59 },
            millisecond: { low: 0, high: 999 }
        };

        // Check params
        if (params !== undefined) {
            if (typeof params !== 'object' || params === null) {
                throw new TypeError("Invalid argument: 'params' must be an object.");
            }

            overflow = params.overflow === undefined ? 'constrain' : params.overflow;
            if (!validOverflow[overflow]) {
                throw new RangeError("Invalid overflow: " + overflow);
            };
        };

        if (typeof dateTimeLike !== 'object' || dateTimeLike === null) {
            throw new TypeError("Temporal error: Argument to with() must contain some date/time fields.");
        }

        const validated = {};
        var hasField = false;

		if (dateTimeLike.month !== undefined || dateTimeLike.monthCode !== undefined) {
			validated.month = Temporal.__isBetween__(Temporal.__resolveISOMonth__(dateTimeLike), 1, 12, overflow);
			hasField = true;
		}

        for (var key in validDateTimeField) {
            if (validDateTimeField.hasOwnProperty(key) && dateTimeLike.hasOwnProperty(key) && dateTimeLike[key] !== undefined) {
                var field = validDateTimeField[key];
                validated[key] = Temporal.__isBetween__(Number(dateTimeLike[key]), field.low, field.high, overflow);
                hasField = true;
            }
        }

        if (!hasField) {
            throw new TypeError("Temporal error: Must specify at least one calendar field.");
        }

        // Copy this
        const copied = Temporal.__copyFields__(this);

        // Overwrite copied with dateTimeLike
        for (var key in validated) {
            copied[key] = validated[key];
        };

        // Check if new date valid
        const checked = Temporal.__validateDate__(copied.year, copied.month, copied.day, overflow);
        copied.year = checked.year;
        copied.month = checked.month;
        copied.day = checked.day;

        return new Temporal.PlainDateTime(
            copied.year,
            copied.month,
            copied.day,
            copied.hour,
            copied.minute,
            copied.second,
            copied.millisecond
        );
    };

    Temporal.PlainDateTime.prototype.withPlainTime = function (plainTime) {
        var time = plainTime === undefined ? new Temporal.PlainTime(0, 0, 0, 0) : Temporal.PlainTime.from(plainTime);

        return new Temporal.PlainDateTime(
            this.year,
            this.month,
            this.day,
            time.hour,
            time.minute,
            time.second,
            time.millisecond
        );
    };

    Temporal.PlainDateTime.prototype.add = function (duration, params) {
        const validOverflow = { constrain: true, reject: true };
        var overflow = 'constrain';

        // Check params
        if (params !== undefined) {
            if (typeof params !== 'object' || params === null) {
                throw new TypeError("Invalid argument: 'params' must be an object.");
            }

            overflow = params.overflow === undefined ? 'constrain' : params.overflow;
            if (!validOverflow[overflow]) {
                throw new RangeError("Invalid overflow: " + overflow);
            }
        };

        // To be sure of all duration's field exists
        const toAdd = (duration instanceof Temporal.Duration ? duration : Temporal.Duration.from(duration))

        const copied = Temporal.__copyFields__(this);
        // Add year-month, and balance. But the day remains intact.
        var addedDate = {};
        addedDate.year = copied.year + toAdd.years;
        addedDate.month = copied.month + toAdd.months;
        addedDate.day = 1;

        addedDate = Temporal.__balanceDateUnits__(addedDate.year, addedDate.month, addedDate.day);

        // Normalize day
        const maxDay = Temporal.__computeDaysInMonth__(addedDate.year, addedDate.month);
        addedDate.day = Temporal.__isBetween__(copied.day, 1, maxDay, overflow);

        // Add time part
        const addedTime = Temporal.__balanceTimeUnits__(copied.hour + toAdd.hours,
            copied.minute + toAdd.minutes,
            copied.second + toAdd.seconds,
            copied.millisecond + toAdd.milliseconds);
        // Add extra days to date part and balance again
        addedDate.day = addedDate.day + (toAdd.weeks * 7) + toAdd.days + addedTime.extraDays;
        addedDate = Temporal.__balanceDateUnits__(addedDate.year, addedDate.month, addedDate.day)

        return Temporal.PlainDateTime.from({
            year: addedDate.year, month: addedDate.month, day: addedDate.day,
            hour: addedTime.hour, minute: addedTime.minute, second: addedTime.second, millisecond: addedTime.millisecond
        });
    };

    Temporal.PlainDateTime.prototype.subtract = function (duration, params) {
        // subtract() is an add() function after the duration is negated
        const toSubtract = Temporal.Duration.from(duration).negated();

        return this.add(toSubtract, params);
    };

    Temporal.PlainDateTime.prototype.until = function (other, options) {
        var methodName = (arguments.length > 2 && arguments[2] === "since") ? "since" : "until";

        if (options !== undefined && (options === null || typeof options !== "object")) {
            throw new TypeError("invalid_argument");
        }

        options = options || {};
        var largestUnit = (options.largestUnit !== undefined) ? options.largestUnit : "day";
        var smallestUnit = (options.smallestUnit !== undefined) ? options.smallestUnit : "millisecond";
        var roundingMode = (options.roundingMode !== undefined) ? options.roundingMode : "trunc";
        var roundingIncrement = (options.roundingIncrement !== undefined) ? Number(options.roundingIncrement) : 1;

        largestUnit = Temporal.__singularUnit__(largestUnit);
        smallestUnit = Temporal.__singularUnit__(smallestUnit);

        var unitRank = { year: 8, month: 7, week: 6, day: 5, hour: 4, minute: 3, second: 2, millisecond: 1 };
        var validLargestUnit = { year: true, month: true, week: true, day: true, hour: true, minute: true, second: true, millisecond: true };
        var validSmallestUnit = { day: true, hour: true, minute: true, second: true, millisecond: true };

        if (!validLargestUnit[largestUnit]) {
            throw new RangeError("Value " + largestUnit + " out of range for Temporal.PlainDateTime.prototype." + methodName + " options property largestUnit");
        }
        if (!validSmallestUnit[smallestUnit]) {
            if (smallestUnit === "year" || smallestUnit === "month" || smallestUnit === "week") {
                return new Temporal.Duration();
            }
            throw new RangeError("Value " + smallestUnit + " out of range for Temporal.PlainDateTime.prototype." + methodName + " options property smallestUnit");
        }
        if (unitRank[smallestUnit] > unitRank[largestUnit]) {
            throw new RangeError("Temporal error: smallestUnit was larger than largestunit in DifferenceeSettings");
        }
        if (smallestUnit === "week") {
            return new Temporal.Duration();
        }
        if (!Temporal.__isValidRoundingMode__(roundingMode)) {
            throw new RangeError("Value " + roundingMode + " out of range for Temporal.PlainDateTime.prototype." + methodName + " options property roundingMode");
        }
        if (isNaN(roundingIncrement) || !isFinite(roundingIncrement) || roundingIncrement < 1) {
            throw new RangeError("Temporal error: Integer out of range.");
        }
        roundingIncrement = Math.floor(roundingIncrement);
        validateRoundingIncrement(roundingIncrement, smallestUnit);

        var startDateTime = Temporal.__copyFields__(this);
        var endDateTime = Temporal.PlainDateTime.from(other);

        if (Temporal.PlainDateTime.compare(startDateTime, endDateTime) === 0) {
            return new Temporal.Duration();
        }

        var reverse = false;
        if (Temporal.PlainDateTime.compare(startDateTime, endDateTime) > 0) {
            var swapDateTime = startDateTime;
            startDateTime = endDateTime;
            endDateTime = swapDateTime;
            reverse = true;
        }

        function totalMillisecondsBetween(start, end) {
            return (Temporal.__daysBetweenDates__(start, end) * Temporal.__MILLISECONDS_PER_DAY__) +
                Temporal.__timeToMilliseconds__(end) - Temporal.__timeToMilliseconds__(start);
        }

        function roundTotalMilliseconds(totalMilliseconds, unit, increment, mode) {
            return Temporal.__roundField__(totalMilliseconds, Temporal.__timeUnitToMilliseconds__(unit) * increment, mode);
        }

        function validateRoundingIncrement(increment, unit) {
            var maximum;

            if (unit === "hour") {
                maximum = 24;
            } else if (unit === "minute" || unit === "second") {
                maximum = 60;
            } else if (unit === "millisecond") {
                maximum = Temporal.__MILLISECONDS_PER_SECOND__;
            }

            if (maximum !== undefined) {
                if (increment >= maximum) {
                    throw new RangeError("Temporal error: roundingIncrement exceeds maximum");
                }
                if (maximum % increment !== 0) {
                    throw new RangeError("Temporal error: dividend is not divisible by roundingIncrement");
                }
            }
        }

        function durationFromMilliseconds(totalMilliseconds, unit) {
            var raw = { years: 0, months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
            var remaining = totalMilliseconds;

            if (unit === "week") {
                raw.weeks = Math.floor(remaining / Temporal.__MILLISECONDS_PER_WEEK__);
                remaining -= raw.weeks * Temporal.__MILLISECONDS_PER_WEEK__;
            }
            if (unit === "day" || unit === "week") {
                raw.days = Math.floor(remaining / Temporal.__MILLISECONDS_PER_DAY__);
                remaining -= raw.days * Temporal.__MILLISECONDS_PER_DAY__;
                if (raw.days !== 0 && remaining < Temporal.__MILLISECONDS_PER_SECOND__) {
                    remaining = 0;
                }
            }
            if (unit === "hour" || unit === "day" || unit === "week") {
                raw.hours = Math.floor(remaining / Temporal.__MILLISECONDS_PER_HOUR__);
                remaining -= raw.hours * Temporal.__MILLISECONDS_PER_HOUR__;
            }
            if (unit === "minute" || unit === "hour" || unit === "day" || unit === "week") {
                raw.minutes = Math.floor(remaining / Temporal.__MILLISECONDS_PER_MINUTE__);
                remaining -= raw.minutes * Temporal.__MILLISECONDS_PER_MINUTE__;
            }
            if (unit === "second" || unit === "minute" || unit === "hour" || unit === "day" || unit === "week") {
                raw.seconds = Math.floor(remaining / Temporal.__MILLISECONDS_PER_SECOND__);
                remaining -= raw.seconds * Temporal.__MILLISECONDS_PER_SECOND__;
            }
            raw.milliseconds = remaining;

            return raw;
        }

        function calendarDiff(start, end) {
            var cursor = Temporal.PlainDateTime.from(start);
            var years = 0;
            var months = 0;

            if (largestUnit === "year") {
                while (true) {
                    var nextYear = cursor.add({ years: 1 });
                    if (Temporal.PlainDateTime.compare(nextYear, end) > 0) break;
                    cursor = nextYear;
                    years += 1;
                }
            }

            while (true) {
                var nextMonth = cursor.add({ months: 1 });
                if (Temporal.PlainDateTime.compare(nextMonth, end) > 0) break;
                cursor = nextMonth;
                months += 1;
            }

            var remainder = durationFromMilliseconds(
                roundTotalMilliseconds(totalMillisecondsBetween(cursor, end), smallestUnit, roundingIncrement, roundingMode),
                "day"
            );

            return {
                years: years,
                months: months,
                weeks: 0,
                days: remainder.days,
                hours: remainder.hours,
                minutes: remainder.minutes,
                seconds: remainder.seconds,
                milliseconds: remainder.milliseconds
            };
        }
        var rawDiff;
        if (largestUnit === "year" || largestUnit === "month") {
            rawDiff = calendarDiff(startDateTime, endDateTime);
        } else {
            var signedMilliseconds = totalMillisecondsBetween(startDateTime, endDateTime);
            if (reverse) {
                signedMilliseconds = -signedMilliseconds;
            }
            var roundedMilliseconds = roundTotalMilliseconds(signedMilliseconds, smallestUnit, roundingIncrement, roundingMode);
            rawDiff = durationFromMilliseconds(Math.abs(roundedMilliseconds), largestUnit);
            if (roundedMilliseconds < 0) {
                rawDiff.years = -rawDiff.years;
                rawDiff.months = -rawDiff.months;
                rawDiff.weeks = -rawDiff.weeks;
                rawDiff.days = -rawDiff.days;
                rawDiff.hours = -rawDiff.hours;
                rawDiff.minutes = -rawDiff.minutes;
                rawDiff.seconds = -rawDiff.seconds;
                rawDiff.milliseconds = -rawDiff.milliseconds;
            }
            reverse = false;
        }

        if (reverse) {
            rawDiff.years = -rawDiff.years;
            rawDiff.months = -rawDiff.months;
            rawDiff.days = -rawDiff.days;
            rawDiff.hours = -rawDiff.hours;
            rawDiff.minutes = -rawDiff.minutes;
            rawDiff.seconds = -rawDiff.seconds;
            rawDiff.milliseconds = -rawDiff.milliseconds;
        }

        return Temporal.Duration.from(rawDiff);
    };
    Temporal.PlainDateTime.prototype.since = function (other, options) {
        // 'since' is simply the inverse of 'until'
        return Temporal.PlainDateTime.from(other).until(this, options, "since");
    };

    Temporal.PlainDateTime.prototype.round = function (roundTo) {
        var smallestUnit, roundingMode, roundingIncrement;

        if (roundTo === undefined) {
            throw new TypeError("Temporal error: Must specify a roundTo parameter.");
        }

        if (typeof roundTo === "string") {
            smallestUnit = roundTo;
            roundingMode = "halfExpand";
            roundingIncrement = 1;
        } else if (typeof roundTo === "object" && roundTo !== null) {
            if (!roundTo.hasOwnProperty("smallestUnit")) {
                throw new RangeError("Value undefined out of range for Temporal.PlainDateTime.prototype.round options property smallestUnit");
            }
            smallestUnit = roundTo.smallestUnit;
            roundingMode = roundTo.roundingMode || "halfExpand";
            roundingIncrement = (typeof roundTo.roundingIncrement === "number") ? roundTo.roundingIncrement : 1;
        } else {
            throw new TypeError("Temporal error: roundTo must be an object.");
        }

        smallestUnit = Temporal.__singularUnit__(smallestUnit);

        var validUnits = {
            millisecond: true,
            second: true,
            minute: true,
            hour: true,
            day: true
        };
        if (!validUnits[smallestUnit]) {
            if (smallestUnit === "year" || smallestUnit === "month" || smallestUnit === "week") {
                throw new RangeError("Temporal error: Found date unit, expect time unit");
            }
            throw new RangeError("Value " + smallestUnit + " out of range for Temporal.PlainDateTime.prototype.round options property smallestUnit");
        }

        if (!Temporal.__isValidRoundingMode__(roundingMode)) {
            throw new RangeError("Value " + roundingMode + " out of range for Temporal.PlainDateTime.prototype.round options property roundingMode");
        }

        if (typeof roundingIncrement !== "number" || roundingIncrement < 1 || roundingIncrement % 1 !== 0) {
            throw new RangeError("Temporal error: Integer out of range.");
        }

        var smallestUnitMilliseconds = Temporal.__timeUnitToMilliseconds__(smallestUnit);
        if (smallestUnitMilliseconds &&
                Temporal.__timeUnitToMilliseconds__("day") % (smallestUnitMilliseconds * roundingIncrement) !== 0) {
            throw new RangeError("Temporal error: dividend is not divisible by roundingIncrement");
        }

        var totalMilliseconds = Temporal.__timeToMilliseconds__(this);
        var roundedMilliseconds = Temporal.__roundField__(totalMilliseconds, smallestUnitMilliseconds * roundingIncrement, roundingMode);
        var balancedTime = Temporal.__balanceTimeUnits__(0, 0, 0, roundedMilliseconds);
        var balancedDate = Temporal.__balanceDateUnits__(this.year, this.month, this.day + balancedTime.extraDays);

        return Temporal.PlainDateTime.from({
            year: balancedDate.year,
            month: balancedDate.month,
            day: balancedDate.day,
            hour: balancedTime.hour,
            minute: balancedTime.minute,
            second: balancedTime.second,
            millisecond: balancedTime.millisecond
        });
    };

    Temporal.PlainDateTime.prototype.equals = function (other) {
        return Temporal.PlainDateTime.compare(this, other) === 0;
    };

    Temporal.PlainDateTime.prototype.toJSON = function () {
        return this.toString();
    };

    Temporal.PlainDateTime.prototype.valueOf = function () {
        throw new TypeError('Do not use Temporal.PlainDateTime.prototype.valueOf; use Temporal.PlainDateTime.prototype.compare for comparison.');
    };

    Temporal.PlainDateTime.prototype.toPlainDate = function () {
        return new Temporal.PlainDate(this.year, this.month, this.day);
    };

    Temporal.PlainDateTime.prototype.toPlainTime = function () {
        return new Temporal.PlainTime(this.hour, this.minute, this.second, this.millisecond);
    };

})(Temporal);
