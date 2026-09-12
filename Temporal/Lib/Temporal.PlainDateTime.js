// v51 Support calendar smallestUnit in until and since
// v50 Reject inherited names in option validation tables (F18)
// v49 - Round within parent time unit for halfEven parity (F13)
// v48 - Coerce PlainDateTime.round roundingIncrement before validation (F12)
// v47 Preserve subsecond remainders alongside days (F07)
// v46 Round signed calendar remainders before taking magnitude (F06)
// v45 Anchor calendar differences to the original date and direction (F05)
// v44 Normalize numeric fields before overflow (F03)
// v43 Reuse core roundingIncrement validation in round
// v36 Project Z and numeric-offset ISO strings to UTC fields
// v42 Extract PlainDateTime overflow option normalization
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

    function normalizeOverflow(params) {
        const validOverflow = { constrain: true, reject: true };

        if (params !== undefined) {
            if (typeof params !== 'object' || params === null) {
                throw new TypeError("Invalid argument: 'params' must be an object.");
            }

            var overflow = params.overflow === undefined ? 'constrain' : params.overflow;
            if (validOverflow[overflow] !== true) {
                throw new RangeError("Invalid overflow: " + overflow);
            };
            return overflow;
        };

        return 'constrain';
    }

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
        this.hour = Temporal.__isBetween__(Temporal.__toInteger__(hour === undefined ? 0 : hour), 0, 23, overflow);
        this.minute = Temporal.__isBetween__(Temporal.__toInteger__(minute === undefined ? 0 : minute), 0, 59, overflow);
        this.second = Temporal.__isBetween__(Temporal.__toInteger__(second === undefined ? 0 : second), 0, 59, overflow);
        this.millisecond = Temporal.__isBetween__(Temporal.__toInteger__(millisecond === undefined ? 0 : millisecond), 0, 999, overflow);

        // Additional properties
        this.dayOfWeek = Temporal.__computeDayOfWeek__(this.year, this.month, this.day);
        this.dayOfYear = Temporal.__computeDayOfYear__(this.year, this.month, this.day);
        this.inLeapYear = Temporal.__isLeapYear__(this.year);
        this.daysInMonth = Temporal.__computeDaysInMonth__(this.year, this.month);
        this.daysInYear = this.inLeapYear ? 366 : 365;

        return this;
    };

    Temporal.PlainDateTime.from = function (value, params) {
        var overflow = normalizeOverflow(params);

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
                value.year,
                Temporal.__resolveISOMonth__(value),
                value.day,
                overflow
            );
            return new Temporal.PlainDateTime(
                checkedDate.year,
                checkedDate.month,
                checkedDate.day,
                Temporal.__isBetween__(Temporal.__toInteger__(value.hour === undefined ? 0 : value.hour), 0, 23, overflow),
                Temporal.__isBetween__(Temporal.__toInteger__(value.minute === undefined ? 0 : value.minute), 0, 59, overflow),
                Temporal.__isBetween__(Temporal.__toInteger__(value.second === undefined ? 0 : value.second), 0, 59, overflow),
                Temporal.__isBetween__(Temporal.__toInteger__(value.millisecond === undefined ? 0 : value.millisecond), 0, 999, overflow)
            );
        } else {
            throw new TypeError('Invalid type for Temporal.PlainDateTime.from');
        };
    };

    Temporal.PlainDateTime.prototype.toString = function (options) {
        return Temporal.__formatISO__(this, "PlainDateTime", options);
    };

    Temporal.PlainDateTime.prototype.toLocaleString = function (locales, options) {
        var formatOptions;

        if (!(this instanceof Temporal.PlainDateTime)) {
            throw new TypeError(
                "Temporal.PlainDateTime.prototype.toLocaleString called on incompatible receiver."
            );
        }
        if (Temporal.__hasIntlDateTimeFormat__()) {
            formatOptions = options === undefined ? {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                fractionalSecondDigits: this.millisecond === 0 ? undefined : 3
            } : options;
            return new Intl.DateTimeFormat(locales, formatOptions).format(this);
        }
        return this.toString();
    };

    Temporal.PlainDateTime.compare = function (one, two) {
        one = Temporal.PlainDateTime.from(one);
        two = Temporal.PlainDateTime.from(two);

        const dateResult = Temporal.__compareISODate__(one, two);
        if (dateResult !== 0) return dateResult;
        return Temporal.__compareTimeRecord__(one, two);
    };

    Temporal.PlainDateTime.prototype.with = function (dateTimeLike, params) {
        var overflow = normalizeOverflow(params);
        const validDateTimeField = {
            year: { low: Temporal.MIN_YEAR, high: Temporal.MAX_YEAR },
            day: { low: 1, high: 31 },
            hour: { low: 0, high: 23 },
            minute: { low: 0, high: 59 },
            second: { low: 0, high: 59 },
            millisecond: { low: 0, high: 999 }
        };

        if (typeof dateTimeLike !== 'object' || dateTimeLike === null) {
            throw new TypeError("Temporal error: Argument to with() must contain some date/time fields.");
        }

        const validated = {};
        var hasField = false;

        if (dateTimeLike.month !== undefined || dateTimeLike.monthCode !== undefined) {
            validated.month = Temporal.__resolveISOMonth__(dateTimeLike);
            hasField = true;
        }

        for (var key in validDateTimeField) {
            if (validDateTimeField.hasOwnProperty(key) && dateTimeLike.hasOwnProperty(key) && dateTimeLike[key] !== undefined) {
                var field = validDateTimeField[key];
                if (key === "year" || key === "day") {
                    validated[key] = dateTimeLike[key];
                } else {
                    validated[key] = Temporal.__isBetween__(Temporal.__toInteger__(dateTimeLike[key]), field.low, field.high, overflow);
                }
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
        var overflow = normalizeOverflow(params);

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

        if (methodName === "since") {
            if (roundingMode === "ceil") roundingMode = "floor";
            else if (roundingMode === "floor") roundingMode = "ceil";
            else if (roundingMode === "halfCeil") roundingMode = "halfFloor";
            else if (roundingMode === "halfFloor") roundingMode = "halfCeil";
        }

        largestUnit = Temporal.__singularUnit__(largestUnit);
        smallestUnit = Temporal.__singularUnit__(smallestUnit);

        var unitRank = { year: 8, month: 7, week: 6, day: 5, hour: 4, minute: 3, second: 2, millisecond: 1 };
        var validLargestUnit = { year: true, month: true, week: true, day: true, hour: true, minute: true, second: true, millisecond: true };
        var validSmallestUnit = { year: true, month: true, week: true, day: true, hour: true, minute: true, second: true, millisecond: true };

        if (options.largestUnit === undefined || largestUnit === "auto") {
            largestUnit = unitRank[smallestUnit] > unitRank.day ? smallestUnit : "day";
        }

        if (validLargestUnit[largestUnit] !== true) {
            throw new RangeError("Value " + largestUnit + " out of range for Temporal.PlainDateTime.prototype." + methodName + " options property largestUnit");
        }
        if (validSmallestUnit[smallestUnit] !== true) {
            throw new RangeError("Value " + smallestUnit + " out of range for Temporal.PlainDateTime.prototype." + methodName + " options property smallestUnit");
        }
        if (unitRank[smallestUnit] > unitRank[largestUnit]) {
            throw new RangeError("Temporal error: smallestUnit was larger than largestunit in DifferenceeSettings");
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

        if (smallestUnit === "year" || smallestUnit === "month" || smallestUnit === "week") {
            return this.until(endDateTime, { largestUnit: largestUnit }).round({
                largestUnit: largestUnit, smallestUnit: smallestUnit,
                roundingIncrement: roundingIncrement, roundingMode: roundingMode, relativeTo: this
            });
        }

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
            var direction = Temporal.PlainDateTime.compare(start, end) < 0 ? 1 : -1;
            var endDate = end;
            if (Temporal.__compareTimeRecord__(start, end) === direction) {
                endDate = Temporal.__balanceDateUnits__(end.year, end.month, end.day - direction);
            }
            var months = (endDate.year - start.year) * 12 + endDate.month - start.month;
            if ((months > 0 && endDate.day < start.day) || (months < 0 && endDate.day > start.day)) {
                months -= direction;
            }
            var years = largestUnit === "year" ? (months < 0 ? Math.ceil(months / 12) : Math.floor(months / 12)) : 0;
            months -= years * 12;
            var cursor = Temporal.PlainDateTime.from(start).add({ years: years, months: months });

            var remainder = durationFromMilliseconds(
                Math.abs(roundTotalMilliseconds(totalMillisecondsBetween(cursor, end), smallestUnit, roundingIncrement, roundingMode)),
                "day"
            );

            return {
                years: Math.abs(years),
                months: Math.abs(months),
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
            rawDiff = reverse ? calendarDiff(endDateTime, startDateTime) : calendarDiff(startDateTime, endDateTime);
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
        return this.until(other, options, "since").negated();
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
            roundingIncrement = roundTo.roundingIncrement === undefined ? 1 : Number(roundTo.roundingIncrement);
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
        if (validUnits[smallestUnit] !== true) {
            if (smallestUnit === "year" || smallestUnit === "month" || smallestUnit === "week") {
                throw new RangeError("Temporal error: Found date unit, expect time unit");
            }
            throw new RangeError("Value " + smallestUnit + " out of range for Temporal.PlainDateTime.prototype.round options property smallestUnit");
        }

        if (!Temporal.__isValidRoundingMode__(roundingMode)) {
            throw new RangeError("Value " + roundingMode + " out of range for Temporal.PlainDateTime.prototype.round options property roundingMode");
        }

        if (smallestUnit === "day") {
            if (roundingIncrement !== 1) {
                throw new RangeError("Temporal error: roundingIncrement exceeds maximum");
            }
        } else {
            roundingIncrement = Temporal.__validateTimeRoundingIncrement__(roundingIncrement, smallestUnit, false);
        }

        var smallestUnitMilliseconds = Temporal.__timeUnitToMilliseconds__(smallestUnit);
        var totalMilliseconds = Temporal.__timeToMilliseconds__(this);
        var parentMilliseconds = Temporal.__MILLISECONDS_PER_DAY__;
        if (smallestUnit === "minute") parentMilliseconds = Temporal.__MILLISECONDS_PER_HOUR__;
        else if (smallestUnit === "second") parentMilliseconds = Temporal.__MILLISECONDS_PER_MINUTE__;
        else if (smallestUnit === "millisecond") parentMilliseconds = Temporal.__MILLISECONDS_PER_SECOND__;
        var remainder = totalMilliseconds % parentMilliseconds;
        var roundedMilliseconds = totalMilliseconds - remainder + Temporal.__roundField__(remainder, smallestUnitMilliseconds * roundingIncrement, roundingMode);
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
