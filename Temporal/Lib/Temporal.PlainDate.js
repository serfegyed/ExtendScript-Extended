// v23 Project Z and numeric-offset ISO strings to UTC date fields
// v22 Reuse Temporal-core20 fixed-time constants
var Temporal = Temporal || {};

(function () {
    // v17 Align since calendar differences and directional rounding with Node
    // v18 Reuse Temporal-core16 rounding-mode validation
    // v19 Add shared ISO monthCode input and static calendarId
    // v20 Add PlainDate.toPlainYearMonth conversion
    // v21 Add PlainDate.toPlainMonthDay conversion

    const DATE_UNITS = { year: true, month: true, week: true, day: true };
    const UNIT_RANK = { year: 4, month: 3, week: 2, day: 1 };
    const DURATION_ZERO = {
        years: 0,
        months: 0,
        weeks: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
    };

    function normalizeOverflow(params) {
        var overflow = "constrain";

        if (params !== undefined) {
            if (typeof params !== "object" || params === null) {
                throw Temporal.__typeError__("Invalid argument: 'params' must be an object.");
            }
            overflow = params.overflow === undefined ? "constrain" : params.overflow;
        }

        if (overflow !== "constrain" && overflow !== "reject") {
            throw Temporal.__rangeError__("Invalid overflow: " + overflow);
        }

        return overflow;
    }

    function normalizeUnit(unit, methodName, propertyName) {
        if (propertyName === "largestUnit" && unit === "auto") {
            return "day";
        }

        unit = Temporal.__singularUnit__(unit);
        if (!DATE_UNITS[unit]) {
            throw Temporal.__rangeError__("Value " + unit + " out of range for Temporal.PlainDate.prototype." + methodName + " options property " + propertyName);
        }
        return unit;
    }

    function validateRoundingMode(mode, methodName) {
        if (!Temporal.__isValidRoundingMode__(mode)) {
            throw Temporal.__rangeError__("Value " + mode + " out of range for Temporal.PlainDate.prototype." + methodName + " options property roundingMode");
        }
    }

    function negateRoundingMode(mode) {
        if (mode === "ceil") return "floor";
        if (mode === "floor") return "ceil";
        if (mode === "halfCeil") return "halfFloor";
        if (mode === "halfFloor") return "halfCeil";
        return mode;
    }

    function validateRoundingIncrement(increment, unit) {
        if (isNaN(increment) || !isFinite(increment) || increment < 1) {
            throw Temporal.__rangeError__("Temporal error: Integer out of range.");
        }

        if (increment !== Math.floor(increment)) {
            throw Temporal.__rangeError__("Temporal error: Integer out of range.");
        }

    }

    function createDate(year, month, day, overflow) {
        var checked = Temporal.__validateDate__(Number(year), Number(month), Number(day), overflow);
        if (!checked) {
            throw Temporal.__rangeError__("Invalid PlainDate");
        }
        return new Temporal.PlainDate(checked.year, checked.month, checked.day);
    }

    function parsePlainDateString(value) {
        var match = value.match(/^(\d{4}|[-+]\d{6})-(\d{2})-(\d{2})(?:[Tt ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?)?$/);

        if (!match || match[1] === "-000000") {
            throw Temporal.__rangeError__("Invalid ISO PlainDate string");
        }

        if (match[4] !== undefined &&
            (Number(match[4]) > 23 || Number(match[5]) > 59 || (match[6] !== undefined && Number(match[6]) > 59))) {
            throw Temporal.__rangeError__("Invalid time in ISO PlainDate string");
        }

        return createDate(Number(match[1]), Number(match[2]), Number(match[3]), "reject");
    }

    function computeISOWeek(date) {
        var weekOfYear = Math.floor((date.dayOfYear - date.dayOfWeek + 10) / 7);
        var yearOfWeek = date.year;

        function weeksInISOYear(year) {
            var firstDay = Temporal.__computeDayOfWeek__(year, 1, 1);
            return firstDay === 4 || (firstDay === 3 && Temporal.__isLeapYear__(year)) ? 53 : 52;
        }

        if (weekOfYear < 1) {
            yearOfWeek -= 1;
            weekOfYear = weeksInISOYear(yearOfWeek);
        } else if (weekOfYear === 53 && weeksInISOYear(yearOfWeek) === 52) {
            yearOfWeek += 1;
            weekOfYear = 1;
        }

        return {
            weekOfYear: weekOfYear,
            yearOfWeek: yearOfWeek
        };
    }

    function hasDateFields(thing) {
        return thing.year !== undefined &&
            (thing.month !== undefined || thing.monthCode !== undefined) &&
            thing.day !== undefined;
    }

    function hasPartialDateFields(thing) {
        return thing.year !== undefined ||
            thing.month !== undefined ||
            thing.monthCode !== undefined ||
            thing.day !== undefined;
    }

    function getDateDuration(duration) {
        var normalized = Temporal.Duration.from(duration);
        var timeMilliseconds =
            (normalized.hours * Temporal.__MILLISECONDS_PER_HOUR__) +
            (normalized.minutes * Temporal.__MILLISECONDS_PER_MINUTE__) +
            (normalized.seconds * Temporal.__MILLISECONDS_PER_SECOND__) +
            normalized.milliseconds;
        var timeDays = timeMilliseconds < 0 ?
            Math.ceil(timeMilliseconds / Temporal.__MILLISECONDS_PER_DAY__) :
            Math.floor(timeMilliseconds / Temporal.__MILLISECONDS_PER_DAY__);

        return {
            years: normalized.years || 0,
            months: normalized.months || 0,
            weeks: normalized.weeks || 0,
            days: (normalized.days || 0) + timeDays
        };
    }

    function addDateDuration(date, duration, overflow) {
        var toAdd = getDateDuration(duration);
        var addedDate = Temporal.__balanceDateUnits__(date.year + toAdd.years, date.month + toAdd.months, 1);
        var maxDay = Temporal.__computeDaysInMonth__(addedDate.year, addedDate.month);

        addedDate.day = Temporal.__isBetween__(date.day, 1, maxDay, overflow);
        addedDate.day = addedDate.day + (toAdd.weeks * 7) + toAdd.days;
        addedDate = Temporal.__balanceDateUnits__(addedDate.year, addedDate.month, addedDate.day);

        return new Temporal.PlainDate(addedDate.year, addedDate.month, addedDate.day);
    }

    function emptyDuration() {
        return Temporal.Duration.from(DURATION_ZERO);
    }

    function signDurationFields(fields) {
        return Temporal.Duration.from(fields);
    }

    function durationFromDays(days, largestUnit) {
        var sign = days < 0 ? -1 : 1;
        var remaining = Math.abs(days);
        var result = {
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0
        };

        if (largestUnit === "week") {
            result.weeks = Math.floor(remaining / 7) * sign;
            remaining = remaining % 7;
        }

        result.days = remaining * sign;
        return Temporal.Duration.from(result);
    }

    function calendarDiff(start, end, largestUnit) {
        var comparison = Temporal.PlainDate.compare(start, end);
        var years = 0;
        var months = 0;
        var cursor;
        var result = {
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0
        };

        if (largestUnit === "year") {
            years = end.year - start.year;

            if (comparison < 0 && (end.month < start.month || (end.month === start.month && end.day < start.day))) {
                years -= 1;
            } else if (comparison > 0 && (end.month > start.month || (end.month === start.month && end.day > start.day))) {
                years += 1;
            }
        }

        if (largestUnit === "year" || largestUnit === "month") {
            months = ((end.year - (start.year + years)) * 12) + end.month - start.month;

            if (months > 0 && end.day < start.day) {
                months -= 1;
            } else if (months < 0 && end.day > start.day) {
                months += 1;
            }
        }

        cursor = start.add({ years: years, months: months });
        result.years = years;
        result.months = months;
        result.days = Temporal.__daysBetweenDates__(cursor, end);

        return result;
    }

    function roundCalendarDuration(start, end, fields, smallestUnit, roundingIncrement, roundingMode, largestUnit) {
        var direction = Temporal.PlainDate.compare(start, end) < 0 ? 1 : -1;
        var wholeUnits = smallestUnit === "year" ? fields.years : (fields.years * 12) + fields.months;
        var truncatedUnits = wholeUnits < 0 ?
            Math.ceil(wholeUnits / roundingIncrement) * roundingIncrement :
            Math.floor(wholeUnits / roundingIncrement) * roundingIncrement;
        var expandedUnits = truncatedUnits + (direction * roundingIncrement);
        var truncatedDate = smallestUnit === "year" ?
            start.add({ years: truncatedUnits }) :
            start.add({ months: truncatedUnits });
        var expandedDate = smallestUnit === "year" ?
            start.add({ years: expandedUnits }) :
            start.add({ months: expandedUnits });
        var intervalDays = Math.abs(Temporal.__daysBetweenDates__(truncatedDate, expandedDate));
        var progressDays = Math.abs(Temporal.__daysBetweenDates__(truncatedDate, end));
        var fractionalUnits = truncatedUnits +
            (direction * roundingIncrement * progressDays / intervalDays);
        var roundedUnits = Temporal.__roundField__(fractionalUnits, roundingIncrement, roundingMode);
        var result = {
            years: 0,
            months: 0,
            weeks: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0
        };

        if (smallestUnit === "year") {
            result.years = roundedUnits;
        } else if (largestUnit === "year") {
            result.years = roundedUnits < 0 ? Math.ceil(roundedUnits / 12) : Math.floor(roundedUnits / 12);
            result.months = roundedUnits - (result.years * 12);
        } else {
            result.months = roundedUnits;
        }

        return result;
    }

    function roundDateDuration(start, end, fields, smallestUnit, roundingIncrement, roundingMode, largestUnit) {
        if (smallestUnit === "day") {
            var direction = Temporal.PlainDate.compare(start, end) < 0 ? 1 : -1;
            var roundedDays = Temporal.__roundField__(fields.days, roundingIncrement, roundingMode);
            var anchor = start.add({ years: fields.years, months: fields.months });
            var boundary = start.add({ years: fields.years, months: fields.months + direction });
            var daysToBoundary = Temporal.__daysBetweenDates__(anchor, boundary);

            if (roundedDays !== fields.days &&
                ((direction > 0 && roundedDays >= daysToBoundary) ||
                (direction < 0 && roundedDays <= daysToBoundary))) {
                fields.months += direction;
                fields.days = 0;

                if (largestUnit === "year" && fields.months === 12) {
                    fields.years += 1;
                    fields.months = 0;
                } else if (largestUnit === "year" && fields.months === -12) {
                    fields.years -= 1;
                    fields.months = 0;
                }
            } else {
                fields.days = roundedDays;
            }

            return fields;
        }

        if (smallestUnit === "month" || smallestUnit === "year") {
            return roundCalendarDuration(start, end, fields, smallestUnit, roundingIncrement, roundingMode, largestUnit);
        }

        if (smallestUnit === "week" && fields.years === 0 && fields.months === 0) {
            var days = (fields.weeks * 7) + fields.days;
            var roundedDays = Temporal.__roundField__(days, roundingIncrement * 7, roundingMode);
            return {
                years: 0,
                months: 0,
                weeks: roundedDays / 7,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                milliseconds: 0
            };
        }

        return fields;
    }

    Temporal.PlainDate = function (year, month, day) {
        if (!(this instanceof Temporal.PlainDate)) {
            throw Temporal.__typeError__("Temporal.PlainDate constructor must be called with new");
        }

        var checkedDate = Temporal.__validateDate__(Number(year), Number(month), Number(day), "reject");
        if (!checkedDate) {
            throw Temporal.__rangeError__("Invalid PlainDate");
        }

        var isoWeek;

        this.year = checkedDate.year;
        this.month = checkedDate.month;
        this.monthCode = Temporal.__formatISOMonthCode__(this.month);
        this.calendarId = "iso8601";
        this.day = checkedDate.day;
        this.dayOfWeek = Temporal.__computeDayOfWeek__(this.year, this.month, this.day);
        this.dayOfYear = Temporal.__computeDayOfYear__(this.year, this.month, this.day);
        this.daysInWeek = 7;
        this.monthsInYear = 12;
        this.inLeapYear = Temporal.__isLeapYear__(this.year);
        this.daysInMonth = Temporal.__computeDaysInMonth__(this.year, this.month);
        this.daysInYear = this.inLeapYear ? 366 : 365;
        isoWeek = computeISOWeek(this);
        this.weekOfYear = isoWeek.weekOfYear;
        this.yearOfWeek = isoWeek.yearOfWeek;

        return this;
    };

    Temporal.PlainDate.from = function (thing, params) {
        var overflow = normalizeOverflow(params);

        if (thing instanceof Temporal.PlainDate) {
            return new Temporal.PlainDate(thing.year, thing.month, thing.day);
        }

        if (typeof Temporal.PlainDateTime === "function" && thing instanceof Temporal.PlainDateTime) {
            return new Temporal.PlainDate(thing.year, thing.month, thing.day);
        }

        if (typeof thing === "string") {
            var projected = Temporal.__projectOffsetISOStringToUTCFields__(thing);
            if (projected !== null) {
                return createDate(projected.year, projected.month, projected.day, "reject");
            }
            if (/T.*Z$/i.test(thing)) {
                throw Temporal.__rangeError__("Temporal error: UTC designator is not valid for PlainDate parsing.");
            }
            return parsePlainDateString(thing);
        }

        if (typeof thing === "object" && thing !== null) {
            if (!hasDateFields(thing)) {
                throw Temporal.__typeError__("Invalid PlainDate object: missing required fields");
            }

            return createDate(thing.year, Temporal.__resolveISOMonth__(thing), thing.day, overflow);
        }

        throw Temporal.__typeError__("Invalid type for Temporal.PlainDate.from");
    };

    Temporal.PlainDate.compare = function (one, two) {
        one = Temporal.PlainDate.from(one);
        two = Temporal.PlainDate.from(two);
        return Temporal.__compareISODate__(one, two);
    };

    Temporal.PlainDate.prototype.toString = function () {
        return Temporal.__formatISO__(this, "PlainDate");
    };

    Temporal.PlainDate.prototype.toJSON = function () {
        return this.toString();
    };

    Temporal.PlainDate.prototype.valueOf = function () {
        throw Temporal.__typeError__("Do not use Temporal.PlainDate.prototype.valueOf; use Temporal.PlainDate.compare for comparison.");
    };

    Temporal.PlainDate.prototype.equals = function (other) {
        return Temporal.PlainDate.compare(this, other) === 0;
    };

    Temporal.PlainDate.prototype.with = function (dateLike, params) {
        if (dateLike === undefined || dateLike === null || typeof dateLike !== "object") {
            throw Temporal.__typeError__("Invalid PlainDate object");
        }

        if (!hasPartialDateFields(dateLike)) {
            throw Temporal.__typeError__("PlainDate.with requires at least one date field");
        }

        var overflow = normalizeOverflow(params);
        var copied = {
            year: this.year,
            month: this.month,
            day: this.day
        };

        if (dateLike.year !== undefined) copied.year = dateLike.year;
        if (dateLike.month !== undefined || dateLike.monthCode !== undefined) {
            copied.month = Temporal.__resolveISOMonth__(dateLike);
        }
        if (dateLike.day !== undefined) copied.day = dateLike.day;

        return createDate(copied.year, copied.month, copied.day, overflow);
    };

    Temporal.PlainDate.prototype.add = function (duration, params) {
        return addDateDuration(this, duration, normalizeOverflow(params));
    };

    Temporal.PlainDate.prototype.subtract = function (duration, params) {
        return this.add(Temporal.Duration.from(duration).negated(), params);
    };

    Temporal.PlainDate.prototype.until = function (other, options) {
        var methodName = (arguments.length > 2 && arguments[2] === "since") ? "since" : "until";
        var end = Temporal.PlainDate.from(other);

        if (options !== undefined && (options === null || typeof options !== "object")) {
            throw Temporal.__typeError__("invalid_argument");
        }

        options = options || {};

        var largestUnit = normalizeUnit(options.largestUnit !== undefined ? options.largestUnit : "day", methodName, "largestUnit");
        var smallestUnit = normalizeUnit(options.smallestUnit !== undefined ? options.smallestUnit : "day", methodName, "smallestUnit");
        var roundingMode = options.roundingMode !== undefined ? options.roundingMode : "trunc";
        var roundingIncrement = options.roundingIncrement !== undefined ? Number(options.roundingIncrement) : 1;

        validateRoundingMode(roundingMode, methodName);
        validateRoundingIncrement(roundingIncrement, smallestUnit);

        if (largestUnit === "day" && smallestUnit === "week") {
            largestUnit = "week";
        }

        if (UNIT_RANK[smallestUnit] > UNIT_RANK[largestUnit]) {
            throw Temporal.__rangeError__("Temporal error: smallestUnit was larger than largestunit in DifferenceeSettings");
        }

        if (Temporal.PlainDate.compare(this, end) === 0) {
            return emptyDuration();
        }

        if (largestUnit === "day" || largestUnit === "week") {
            var days = Temporal.__daysBetweenDates__(this, end);
            if (smallestUnit === "week") {
                days = Temporal.__roundField__(days, roundingIncrement * 7, roundingMode);
            } else if (smallestUnit === "day") {
                days = Temporal.__roundField__(days, roundingIncrement, roundingMode);
            }
            return durationFromDays(days, largestUnit);
        }

        var diff = calendarDiff(this, end, largestUnit);
        diff = roundDateDuration(this, end, diff, smallestUnit, roundingIncrement, roundingMode, largestUnit);

        return signDurationFields(diff);
    };

    Temporal.PlainDate.prototype.since = function (other, options) {
        var sinceOptions = options;

        if (options !== undefined && options !== null && typeof options === "object") {
            sinceOptions = {};
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    sinceOptions[key] = options[key];
                }
            }
            sinceOptions.roundingMode = negateRoundingMode(
                options.roundingMode !== undefined ? options.roundingMode : "trunc"
            );
        }

        return this.until(other, sinceOptions, "since").negated();
    };

    Temporal.PlainDate.prototype.toPlainYearMonth = function () {
        return new Temporal.PlainYearMonth(this.year, this.month);
    };

    Temporal.PlainDate.prototype.toPlainMonthDay = function () {
        return new Temporal.PlainMonthDay(this.month, this.day);
    };

    Temporal.PlainDate.prototype.toPlainDateTime = function (plainTime) {
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
})();
