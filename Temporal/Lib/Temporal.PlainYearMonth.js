var Temporal = Temporal || {};

(function () {
    // v1 Implement the ISO PlainYearMonth subset with Node-referenced behavior
    // v2 Round differences across real calendar month/year lengths
    // v3 Apply directional rounding semantics to since
    // v4 Cap rounded month remainders only after choosing the increment boundary
    // v5 Project full Z and numeric-offset ISO strings to UTC year/month fields

    var YEAR_MONTH_UNITS = { year: true, month: true };
    var UNIT_RANK = { year: 2, month: 1 };

    function normalizeOverflow(options) {
        var normalized = Temporal.__normalizeOptions__(options);
        var overflow = normalized.overflow === undefined ? "constrain" : normalized.overflow;

        if (overflow !== "constrain" && overflow !== "reject") {
            throw new RangeError("Invalid overflow: " + overflow);
        }

        return overflow;
    }

    function validateYearMonth(year, month, overflow) {
        year = Temporal.__toInteger__(year);
        month = Temporal.__toInteger__(month);

        if (month <= 0) {
            throw new RangeError("Temporal error: Expected positive integer.");
        }

        if (overflow === "constrain" && month > 12) {
            month = 12;
        } else if (month > 12) {
            throw new RangeError("Temporal error: month value is not in a valid range.");
        }

        if (year < Temporal.MIN_YEAR || year > Temporal.MAX_YEAR ||
            (year === Temporal.MIN_YEAR && month < 4) ||
            (year === Temporal.MAX_YEAR && month > 9)) {
            throw new RangeError("Temporal error: Exceeded valid range.");
        }

        return { year: year, month: month };
    }

    function createYearMonth(year, month, overflow) {
        var checked = validateYearMonth(year, month, overflow);
        return new Temporal.PlainYearMonth(checked.year, checked.month);
    }

    function parseYearMonthString(value) {
        var match = String(value).match(/^(\d{4}|[-+]\d{6})-(\d{2})(?:-(\d{2})(?:[Tt ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?)?)?$/);
        var year;
        var month;

        if (!match || match[1] === "-000000") {
            throw new RangeError("Invalid ISO PlainYearMonth string");
        }

        year = Number(match[1]);
        month = Number(match[2]);

        if (match[3] !== undefined) {
            if (match[4] !== undefined &&
                (Number(match[4]) > 23 || Number(match[5]) > 59 ||
                (match[6] !== undefined && Number(match[6]) > 59))) {
                throw new RangeError("Invalid time in ISO PlainYearMonth string");
            }

            Temporal.__validateDate__(year, month, Number(match[3]), "reject");
        }

        return createYearMonth(year, month, "reject");
    }

    function hasYearMonthFields(fields) {
        return fields.year !== undefined && fields.month !== undefined;
    }

    function hasPartialYearMonthFields(fields) {
        return fields.year !== undefined || fields.month !== undefined;
    }

    function monthIndex(yearMonth) {
        return (yearMonth.year * 12) + (yearMonth.month - 1);
    }

    function fromMonthIndex(index) {
        var year = Math.floor(index / 12);
        var month = index - (year * 12) + 1;
        return createYearMonth(year, month, "reject");
    }

    function addMonths(yearMonth, months) {
        return fromMonthIndex(monthIndex(yearMonth) + months);
    }

    function conceptualFirstDaySerial(yearMonth) {
        if (yearMonth.year === Temporal.MIN_YEAR && yearMonth.month === 4) {
            return Temporal.__dateToDaySerial__(yearMonth.year, yearMonth.month, 19) - 18;
        }

        return Temporal.__dateToDaySerial__(yearMonth.year, yearMonth.month, 1);
    }

    function truncateTowardZero(value) {
        return value < 0 ? Math.ceil(value) : Math.floor(value);
    }

    function chooseCalendarBoundary(truncated, expanded, progress, interval, roundingMode, increment) {
        var lower = Math.min(truncated, expanded);
        var upper = Math.max(truncated, expanded);
        var direction = expanded > truncated ? 1 : -1;
        var twiceProgress;
        var truncatedStep;

        if (roundingMode === "ceil") return upper;
        if (roundingMode === "floor") return lower;
        if (roundingMode === "expand") return direction > 0 ? expanded : lower;
        if (roundingMode === "trunc") return direction > 0 ? truncated : upper;

        twiceProgress = progress * 2;
        if (twiceProgress < interval) return truncated;
        if (twiceProgress > interval) return expanded;

        if (roundingMode === "halfCeil") return upper;
        if (roundingMode === "halfFloor") return lower;
        if (roundingMode === "halfExpand") return expanded;
        if (roundingMode === "halfTrunc") return truncated;

        truncatedStep = Math.floor(Math.abs(truncated) / increment);
        return truncatedStep % 2 === 0 ? truncated : expanded;
    }

    function roundCalendarOffset(anchor, end, incrementInMonths, roundingMode, capInMonths) {
        var totalMonths = monthIndex(end) - monthIndex(anchor);
        var direction = totalMonths < 0 ? -1 : 1;
        var truncatedMonths = truncateTowardZero(totalMonths / incrementInMonths) * incrementInMonths;
        var expandedMonths;
        var truncatedYearMonth;
        var expandedYearMonth;
        var intervalDays;
        var progressDays;
        var roundedMonths;

        if (totalMonths === truncatedMonths) {
            return totalMonths;
        }

        expandedMonths = truncatedMonths + (direction * incrementInMonths);
        truncatedYearMonth = addMonths(anchor, truncatedMonths);
        expandedYearMonth = addMonths(anchor, expandedMonths);
        intervalDays = Math.abs(
            conceptualFirstDaySerial(expandedYearMonth) - conceptualFirstDaySerial(truncatedYearMonth)
        );
        progressDays = Math.abs(
            conceptualFirstDaySerial(end) - conceptualFirstDaySerial(truncatedYearMonth)
        );

        roundedMonths = chooseCalendarBoundary(
            truncatedMonths,
            expandedMonths,
            progressDays,
            intervalDays,
            roundingMode,
            incrementInMonths
        );

        if (capInMonths !== undefined && Math.abs(roundedMonths) > capInMonths) {
            roundedMonths = direction * capInMonths;
        }

        return roundedMonths;
    }

    function normalizeDifferenceUnit(unit, propertyName) {
        if (propertyName === "largestUnit" && unit === "auto") {
            return "year";
        }

        unit = Temporal.__singularUnit__(unit);
        if (!YEAR_MONTH_UNITS[unit]) {
            throw new RangeError("Temporal error: Weeks and days are not allowed in this operation.");
        }
        return unit;
    }

    function validateRoundingIncrement(value) {
        var increment = Number(value);

        if (isNaN(increment) || !isFinite(increment) || increment < 1 || increment !== Math.floor(increment)) {
            throw new RangeError("Temporal error: Integer out of range.");
        }

        return increment;
    }

    function negateRoundingMode(mode) {
        if (mode === "ceil") return "floor";
        if (mode === "floor") return "ceil";
        if (mode === "halfCeil") return "halfFloor";
        if (mode === "halfFloor") return "halfCeil";
        return mode;
    }

    function difference(start, end, options) {
        options = Temporal.__normalizeOptions__(options);

        var largestUnit = normalizeDifferenceUnit(
            options.largestUnit === undefined ? "auto" : options.largestUnit,
            "largestUnit"
        );
        var smallestUnit = normalizeDifferenceUnit(
            options.smallestUnit === undefined ? "month" : options.smallestUnit,
            "smallestUnit"
        );
        var roundingMode = options.roundingMode === undefined ? "trunc" : options.roundingMode;
        var roundingIncrement = validateRoundingIncrement(
            options.roundingIncrement === undefined ? 1 : options.roundingIncrement
        );
        var months;
        var wholeYears;
        var anchor;
        var roundedRemainder;
        var years = 0;

        if (!Temporal.__isValidRoundingMode__(roundingMode)) {
            throw new RangeError("Invalid rounding mode: " + roundingMode);
        }

        if (UNIT_RANK[smallestUnit] > UNIT_RANK[largestUnit]) {
            throw new RangeError("Temporal error: smallestUnit was larger than largestunit in DifferenceeSettings");
        }

        months = monthIndex(end) - monthIndex(start);

        if (smallestUnit === "year") {
            months = roundCalendarOffset(start, end, roundingIncrement * 12, roundingMode);
        } else if (largestUnit === "month") {
            months = roundCalendarOffset(start, end, roundingIncrement, roundingMode);
        } else {
            wholeYears = truncateTowardZero(months / 12);
            anchor = addMonths(start, wholeYears * 12);
            roundedRemainder = roundCalendarOffset(anchor, end, roundingIncrement, roundingMode, 12);
            months = (wholeYears * 12) + roundedRemainder;
        }

        if (largestUnit === "year") {
            years = months < 0 ? Math.ceil(months / 12) : Math.floor(months / 12);
            months -= years * 12;
        }

        return Temporal.Duration.from({ years: years, months: months });
    }

    Temporal.PlainYearMonth = function (year, month) {
        if (!(this instanceof Temporal.PlainYearMonth)) {
            throw new TypeError("Temporal.PlainYearMonth constructor must be called with new");
        }

        var checked = validateYearMonth(year, month, "reject");

        this.year = checked.year;
        this.month = checked.month;
        this.daysInMonth = Temporal.__computeDaysInMonth__(this.year, this.month);
        this.inLeapYear = Temporal.__isLeapYear__(this.year);
        this.daysInYear = this.inLeapYear ? 366 : 365;
        this.monthsInYear = 12;

        return this;
    };

    Temporal.PlainYearMonth.from = function (value, options) {
        var overflow = normalizeOverflow(options);

        if (value instanceof Temporal.PlainYearMonth) {
            return new Temporal.PlainYearMonth(value.year, value.month);
        }

        if (typeof value === "string") {
            var projected = Temporal.__projectOffsetISOStringToUTCFields__(value);
            if (projected !== null) {
                return createYearMonth(projected.year, projected.month, "reject");
            }
            if (/Z$/i.test(value)) {
                throw new RangeError("UTC designator is not valid for PlainYearMonth parsing.");
            }
            return parseYearMonthString(value);
        }

        if (typeof value === "object" && value !== null) {
            if (!hasYearMonthFields(value)) {
                throw new TypeError("Invalid PlainYearMonth object: missing required fields");
            }
            return createYearMonth(value.year, value.month, overflow);
        }

        throw new TypeError("Invalid type for Temporal.PlainYearMonth.from");
    };

    Temporal.PlainYearMonth.compare = function (one, two) {
        var first = Temporal.PlainYearMonth.from(one);
        var second = Temporal.PlainYearMonth.from(two);
        var firstIndex = monthIndex(first);
        var secondIndex = monthIndex(second);

        return firstIndex < secondIndex ? -1 : (firstIndex > secondIndex ? 1 : 0);
    };

    Temporal.PlainYearMonth.prototype.with = function (yearMonthLike, options) {
        if (yearMonthLike === undefined || yearMonthLike === null || typeof yearMonthLike !== "object") {
            throw new TypeError("Invalid PlainYearMonth object");
        }
        if (!hasPartialYearMonthFields(yearMonthLike)) {
            throw new TypeError("PlainYearMonth.with requires at least one year or month field");
        }

        var overflow = normalizeOverflow(options);
        var year = yearMonthLike.year === undefined ? this.year : yearMonthLike.year;
        var month = yearMonthLike.month === undefined ? this.month : yearMonthLike.month;

        return createYearMonth(year, month, overflow);
    };

    Temporal.PlainYearMonth.prototype.add = function (duration, options) {
        var overflow = normalizeOverflow(options);
        var normalized = Temporal.Duration.from(duration);
        var resultIndex = monthIndex(this) + (normalized.years * 12) + normalized.months;

        // Overflow has no observable effect for year/month-only arithmetic, but it is validated above.
        overflow = overflow;
        return fromMonthIndex(resultIndex);
    };

    Temporal.PlainYearMonth.prototype.subtract = function (duration, options) {
        return this.add(Temporal.Duration.from(duration).negated(), options);
    };

    Temporal.PlainYearMonth.prototype.until = function (other, options) {
        return difference(this, Temporal.PlainYearMonth.from(other), options);
    };

    Temporal.PlainYearMonth.prototype.since = function (other, options) {
        var sinceOptions = options;

        if (options !== undefined && options !== null && typeof options === "object") {
            sinceOptions = {};
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    sinceOptions[key] = options[key];
                }
            }
            sinceOptions.roundingMode = negateRoundingMode(
                options.roundingMode === undefined ? "trunc" : options.roundingMode
            );
        }

        return this.until(other, sinceOptions).negated();
    };

    Temporal.PlainYearMonth.prototype.equals = function (other) {
        return Temporal.PlainYearMonth.compare(this, other) === 0;
    };

    Temporal.PlainYearMonth.prototype.toString = function () {
        return Temporal.__formatISO__(this, "PlainYearMonth");
    };

    Temporal.PlainYearMonth.prototype.toJSON = function () {
        return this.toString();
    };

    Temporal.PlainYearMonth.prototype.valueOf = function () {
        throw new TypeError("Do not use Temporal.PlainYearMonth.prototype.valueOf; use Temporal.PlainYearMonth.compare for comparison.");
    };

    Temporal.PlainYearMonth.prototype.toPlainDate = function (item) {
        if (item === undefined || item === null || typeof item !== "object") {
            throw new TypeError("PlainYearMonth.toPlainDate requires an object");
        }
        if (item.day === undefined) {
            throw new TypeError("PlainYearMonth.toPlainDate requires a day field");
        }

        var day = Temporal.__toInteger__(item.day);
        if (day <= 0) {
            throw new RangeError("Temporal error: Expected positive integer.");
        }
        if (day > this.daysInMonth) {
            day = this.daysInMonth;
        }

        return new Temporal.PlainDate(this.year, this.month, day);
    };
}());
