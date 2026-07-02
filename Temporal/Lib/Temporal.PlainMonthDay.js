var Temporal = Temporal || {};

(function () {
    // v1 Implement the ISO PlainMonthDay subset with Node-referenced behavior
    // v2 Do not confuse Z in bracketed time-zone names with a UTC designator
    // v3 Project full Z and numeric-offset ISO strings to UTC month/day fields

    var REFERENCE_ISO_YEAR = 1972;

    function normalizeOverflow(options) {
        var normalized = Temporal.__normalizeOptions__(options);
        var overflow = normalized.overflow === undefined ? "constrain" : normalized.overflow;

        if (overflow !== "constrain" && overflow !== "reject") {
            throw new RangeError("Invalid overflow: " + overflow);
        }

        return overflow;
    }

    function validateMonthDay(month, day, overflow, referenceYear) {
        var checked = Temporal.__validateDate__(
            referenceYear === undefined ? REFERENCE_ISO_YEAR : referenceYear,
            month,
            day,
            overflow
        );

        return { month: checked.month, day: checked.day };
    }

    function createMonthDay(month, day, overflow, referenceYear) {
        var checked = validateMonthDay(month, day, overflow, referenceYear);
        return new Temporal.PlainMonthDay(checked.month, checked.day);
    }

    function validateISOCalendar(fields) {
        var calendar = fields.calendar;

        if (calendar !== undefined && String(calendar) !== "iso8601") {
            throw new RangeError("Only the iso8601 calendar is supported");
        }
    }

    function hasMonthDayFields(fields) {
        return fields.day !== undefined &&
            (fields.month !== undefined || fields.monthCode !== undefined);
    }

    function hasPartialMonthDayFields(fields) {
        return fields.year !== undefined || fields.month !== undefined ||
            fields.monthCode !== undefined || fields.day !== undefined;
    }

    function parseMonthDayString(value) {
        var stringValue = String(value);
        var monthDayMatch;
        var dateTimeMatch;
        var year;
        var month;
        var day;

        monthDayMatch = /^(?:--)?(\d{2})-?(\d{2})$/.exec(stringValue);
        if (monthDayMatch) {
            return createMonthDay(Number(monthDayMatch[1]), Number(monthDayMatch[2]), "reject");
        }

        dateTimeMatch = /^(\d{4}|[-+]\d{6})-(\d{2})-(\d{2})(?:[Tt ](\d{2}):(\d{2})(?::(\d{2})(?:[.,]\d{1,9})?)?(?:[-+](\d{2}):?(\d{2})(?::?\d{2}(?:[.,]\d{1,9})?)?)?(?:\[[^\]]+\])*)?$/.exec(stringValue);
        if (!dateTimeMatch || dateTimeMatch[1] === "-000000") {
            throw new RangeError("Invalid ISO PlainMonthDay string");
        }

        year = Number(dateTimeMatch[1]);
        month = Number(dateTimeMatch[2]);
        day = Number(dateTimeMatch[3]);

        if (dateTimeMatch[4] !== undefined &&
            (Number(dateTimeMatch[4]) > 23 || Number(dateTimeMatch[5]) > 59 ||
            (dateTimeMatch[6] !== undefined && Number(dateTimeMatch[6]) > 59) ||
            (dateTimeMatch[7] !== undefined &&
                (Number(dateTimeMatch[7]) > 23 || Number(dateTimeMatch[8]) > 59)))) {
            throw new RangeError("Invalid time in ISO PlainMonthDay string");
        }

        Temporal.__validateDate__(year, month, day, "reject");
        return createMonthDay(month, day, "reject");
    }

    Temporal.PlainMonthDay = function (month, day) {
        if (!(this instanceof Temporal.PlainMonthDay)) {
            throw new TypeError("Temporal.PlainMonthDay constructor must be called with new");
        }

        var checked = validateMonthDay(month, day, "reject");

        this.month = checked.month;
        this.monthCode = Temporal.__formatISOMonthCode__(this.month);
        this.day = checked.day;

        return this;
    };

    Temporal.PlainMonthDay.from = function (thing, options) {
        var overflow = normalizeOverflow(options);
        var month;
        var referenceYear;

        if (thing instanceof Temporal.PlainMonthDay) {
            return new Temporal.PlainMonthDay(thing.month, thing.day);
        }

        if (typeof thing === "string") {
            var projected = Temporal.__projectOffsetISOStringToUTCFields__(thing);
            if (projected !== null) {
                return createMonthDay(projected.month, projected.day, "reject", projected.year);
            }
            return parseMonthDayString(thing);
        }

        if (typeof thing === "object" && thing !== null) {
            validateISOCalendar(thing);
            if (!hasMonthDayFields(thing)) {
                throw new TypeError("Invalid PlainMonthDay object: missing required fields");
            }

            month = Temporal.__resolveISOMonth__(thing);
            referenceYear = thing.year === undefined ? REFERENCE_ISO_YEAR : thing.year;
            return createMonthDay(month, thing.day, overflow, referenceYear);
        }

        throw new TypeError("Invalid type for Temporal.PlainMonthDay.from");
    };

    Temporal.PlainMonthDay.prototype.with = function (monthDayLike, options) {
        var overflow;
        var month;
        var day;
        var referenceYear;

        if (monthDayLike === undefined || monthDayLike === null || typeof monthDayLike !== "object") {
            throw new TypeError("Invalid PlainMonthDay object");
        }
        if (monthDayLike.calendar !== undefined || monthDayLike.timeZone !== undefined) {
            throw new TypeError("PlainMonthDay.with does not accept calendar or timeZone");
        }
        if (!hasPartialMonthDayFields(monthDayLike)) {
            throw new TypeError("PlainMonthDay.with requires at least one supported field");
        }

        overflow = normalizeOverflow(options);
        month = (monthDayLike.month === undefined && monthDayLike.monthCode === undefined) ?
            this.month : Temporal.__resolveISOMonth__(monthDayLike);
        day = monthDayLike.day === undefined ? this.day : monthDayLike.day;
        referenceYear = monthDayLike.year === undefined ? REFERENCE_ISO_YEAR : monthDayLike.year;

        return createMonthDay(month, day, overflow, referenceYear);
    };

    Temporal.PlainMonthDay.prototype.equals = function (other) {
        var monthDay = Temporal.PlainMonthDay.from(other);
        return this.month === monthDay.month && this.day === monthDay.day;
    };

    Temporal.PlainMonthDay.prototype.toString = function () {
        return Temporal.__formatISO__(this, "PlainMonthDay");
    };

    Temporal.PlainMonthDay.prototype.toJSON = function () {
        return this.toString();
    };

    Temporal.PlainMonthDay.prototype.valueOf = function () {
        throw new TypeError("Do not use Temporal.PlainMonthDay.prototype.valueOf; use Temporal.PlainMonthDay.prototype.equals for comparison.");
    };

    Temporal.PlainMonthDay.prototype.toPlainDate = function (item) {
        var checked;

        if (item === undefined || item === null || typeof item !== "object") {
            throw new TypeError("PlainMonthDay.toPlainDate requires an object");
        }
        if (item.year === undefined) {
            throw new TypeError("PlainMonthDay.toPlainDate requires a year field");
        }

        checked = Temporal.__validateDate__(item.year, this.month, this.day, "constrain");
        return new Temporal.PlainDate(checked.year, checked.month, checked.day);
    };
}());
