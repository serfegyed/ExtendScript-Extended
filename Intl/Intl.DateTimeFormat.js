/*
 * Minimal Intl.DateTimeFormat subset for Adobe ExtendScript.
 *
 * Requires Intl-core.js.
 * Supported in this branch:
 * - date and time formatting
 * - year, month, day, weekday, hour, minute, second, hour12, hourCycle options
 * - native Date, timestamp number, and Temporal-like date/time objects
 */
var Intl = Intl || {};

(function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var unsupportedOptions = [
        "era",
        "timeZone", "timeZoneName", "dayPeriod",
        "dateStyle", "timeStyle"
    ];

    function requireCore() {
        if (typeof Intl.__requireCore__ !== "function") {
            throw new TypeError("Intl.DateTimeFormat error: Intl-core.js is required.");
        }
        Intl.__requireCore__("Intl.DateTimeFormat");
    }

    function hasExplicitFormatFields(options) {
        return options.year !== undefined || options.month !== undefined || options.day !== undefined || options.weekday !== undefined ||
            options.hour !== undefined || options.minute !== undefined || options.second !== undefined;
    }

    function readIntegerOption(options, name, minimum, maximum, defaultValue) {
        var value;

        if (!hasOwnProperty.call(options, name) || options[name] === undefined) {
            return defaultValue;
        }
        value = Number(options[name]);
        if (!isFinite(value) || Math.floor(value) !== value || value < minimum || value > maximum) {
            throw new RangeError("Intl.DateTimeFormat error: " + name + " is not supported by this subset.");
        }
        return value;
    }

    function validateOptions(options, locale, dateTimeData) {
        var index;
        var localeMatcher;
        var numberingSystem;
        var defaults;
        var year;
        var month;
        var day;
        var weekday;
        var hour;
        var minute;
        var second;
        var fractionalSecondDigits;
        var hour12;
        var hourCycle;

        options = Intl.__toObject__(options, "Intl.DateTimeFormat");

        localeMatcher = options.localeMatcher === undefined ? "best fit" : String(options.localeMatcher);
        if (localeMatcher !== "best fit" && localeMatcher !== "lookup") {
            throw new RangeError("Intl.DateTimeFormat error: localeMatcher is not supported by this subset.");
        }

        numberingSystem = options.numberingSystem === undefined ? "latn" : String(options.numberingSystem);
        if (numberingSystem !== "latn") {
            throw new RangeError("Intl.DateTimeFormat error: numberingSystem is not supported by this subset.");
        }

        if (options.calendar !== undefined) {
            if (String(options.calendar) !== "gregory" && String(options.calendar) !== "iso8601") {
                throw new RangeError("Intl.DateTimeFormat error: calendar is not supported by this subset.");
            }
            throw new RangeError("Intl.DateTimeFormat error: calendar option is intentionally not supported.");
        }

        for (index = 0; index < unsupportedOptions.length; index++) {
            if (options[unsupportedOptions[index]] !== undefined) {
                throw new RangeError("Intl.DateTimeFormat error: " + unsupportedOptions[index] + " is not supported by this subset.");
            }
        }

        defaults = defaultDateOptions(dateTimeData);
        year = Intl.__readStringOption__(options, "year", ["numeric", "2-digit"], hasExplicitFormatFields(options) ? undefined : defaults.year, "Intl.DateTimeFormat");
        month = Intl.__readStringOption__(options, "month", ["numeric", "2-digit", "short", "long"], hasExplicitFormatFields(options) ? undefined : defaults.month, "Intl.DateTimeFormat");
        day = Intl.__readStringOption__(options, "day", ["numeric", "2-digit"], hasExplicitFormatFields(options) ? undefined : defaults.day, "Intl.DateTimeFormat");
        weekday = Intl.__readStringOption__(options, "weekday", ["short", "long"], undefined, "Intl.DateTimeFormat");
        hour = Intl.__readStringOption__(options, "hour", ["numeric", "2-digit"], undefined, "Intl.DateTimeFormat");
        minute = Intl.__readStringOption__(options, "minute", ["numeric", "2-digit"], undefined, "Intl.DateTimeFormat");
        second = Intl.__readStringOption__(options, "second", ["numeric", "2-digit"], undefined, "Intl.DateTimeFormat");
        fractionalSecondDigits = readIntegerOption(options, "fractionalSecondDigits", 1, 3, undefined);
        if (fractionalSecondDigits !== undefined && second === undefined) {
            throw new RangeError("Intl.DateTimeFormat error: fractionalSecondDigits requires second in this subset.");
        }
        hourCycle = Intl.__readStringOption__(options, "hourCycle", ["h11", "h12", "h23", "h24"], defaultHourCycle(dateTimeData), "Intl.DateTimeFormat");
        if (options.hour12 !== undefined) {
            hour12 = Boolean(options.hour12);
            hourCycle = hour12 ? "h12" : "h23";
        }

        return normalizeWidths(locale, {
            year: year,
            month: month,
            day: day,
            weekday: weekday,
            hour: hour,
            minute: minute,
            second: second,
            fractionalSecondDigits: fractionalSecondDigits,
            hourCycle: hourCycle,
            hour12: hourCycle === "h11" || hourCycle === "h12",
            numberingSystem: numberingSystem
        });
    }

    function defaultHourCycle(dateTimeData) {
        return dateTimeData.defaultHourCycle;
    }

    function defaultDateOptions(dateTimeData) {
        return dateTimeData.defaultDateOptions;
    }

    function normalizeWidths(locale, options) {
        if ((locale === "en-GB" || locale === "fr-FR" || locale === "hu-HU") && options.month === "numeric" && options.day === "numeric") {
            options.month = "2-digit";
            options.day = "2-digit";
        }
        if (options.hour === "numeric" && ((locale === "en-US" && (options.hourCycle === "h23" || options.hourCycle === "h24")) || ((locale === "en-GB" || locale === "de-DE" || locale === "fr-FR") && options.hourCycle === "h23"))) {
            options.hour = "2-digit";
        }
        if (options.minute === "numeric") {
            options.minute = "2-digit";
        }
        if (options.second === "numeric" && (options.hour !== undefined || options.minute !== undefined)) {
            options.second = "2-digit";
        }
        return options;
    }

    function formatYear(year, width) {
        if (width === undefined) {
            return undefined;
        }
        if (width === "2-digit") {
            return Intl.__pad__(year % 100, 2);
        }
        return String(year);
    }

    function formatMonth(dateTimeData, month, width) {
        if (width === undefined) {
            return undefined;
        }
        if (width === "2-digit") {
            return Intl.__pad__(month, 2);
        }
        if (width === "numeric") {
            return String(month);
        }
        return dateTimeData.months[width][month - 1];
    }

    function formatWeekday(dateTimeData, dayOfWeek, width) {
        if (width === undefined) {
            return undefined;
        }
        return dateTimeData.weekdays[width][dayOfWeek];
    }

    function formatDay(day, width) {
        if (width === undefined) {
            return undefined;
        }
        return width === "2-digit" ? Intl.__pad__(day, 2) : String(day);
    }

    function finiteInteger(value, name) {
        if (!isFinite(value) || Math.floor(value) !== value) {
            throw new RangeError("Intl.DateTimeFormat error: invalid " + name + ".");
        }
        return value;
    }


    function timeField(value, max, name) {
        var number = finiteInteger(Number(value), name);

        if (number < 0 || number > max) {
            throw new RangeError("Intl.DateTimeFormat error: invalid " + name + ".");
        }
        return number;
    }
    function fieldsFromDate(value) {
        var date = value instanceof Date ? value : new Date(Number(value));
        var time = date.getTime();

        if (!isFinite(time)) {
            throw new RangeError("Intl.DateTimeFormat error: invalid date value.");
        }
        return {
            year: finiteInteger(date.getFullYear(), "year"),
            month: finiteInteger(date.getMonth(), "month") + 1,
            day: finiteInteger(date.getDate(), "day"),
            dayOfWeek: finiteInteger(date.getDay(), "dayOfWeek"),
            hour: finiteInteger(date.getHours(), "hour"),
            minute: finiteInteger(date.getMinutes(), "minute"),
            second: finiteInteger(date.getSeconds(), "second"),
            millisecond: finiteInteger(date.getMilliseconds(), "millisecond")
        };
    }

    function computeDayOfWeek(year, month, day) {
        var adjustedMonth = month < 3 ? month + 12 : month;
        var adjustedYear = month < 3 ? year - 1 : year;
        var zeroBased = (day + Math.floor((13 * (adjustedMonth + 1)) / 5) + adjustedYear + Math.floor(adjustedYear / 4) - Math.floor(adjustedYear / 100) + Math.floor(adjustedYear / 400)) % 7;

        return (zeroBased + 6) % 7;
    }
    function fieldsFromTemporalLike(value) {
        var year = finiteInteger(Number(value.year), "year");
        var month = finiteInteger(Number(value.month), "month");
        var day = finiteInteger(Number(value.day), "day");

        if (month < 1 || month > 12 || day < 1 || day > 31) {
            throw new RangeError("Intl.DateTimeFormat error: invalid date-like object.");
        }
        return {
            year: year,
            month: month,
            day: day,
            dayOfWeek: computeDayOfWeek(year, month, day),
            hour: value.hour === undefined ? 0 : timeField(value.hour, 23, "hour"),
            minute: value.minute === undefined ? 0 : timeField(value.minute, 59, "minute"),
            second: value.second === undefined ? 0 : timeField(value.second, 59, "second"),
            millisecond: value.millisecond === undefined ? 0 : timeField(value.millisecond, 999, "millisecond")
        };
    }


    function fieldsFromTimeLike(value) {
        return {
            year: 1970,
            month: 1,
            day: 1,
            dayOfWeek: 4,
            hour: timeField(value.hour, 23, "hour"),
            minute: value.minute === undefined ? 0 : timeField(value.minute, 59, "minute"),
            second: value.second === undefined ? 0 : timeField(value.second, 59, "second"),
            millisecond: value.millisecond === undefined ? 0 : timeField(value.millisecond, 999, "millisecond")
        };
    }
    function dateFields(value) {
        if (value === undefined) {
            return fieldsFromDate(new Date());
        }
        if (value instanceof Date || typeof value === "number") {
            return fieldsFromDate(value);
        }
        if (value !== null && typeof value === "object" && value.year !== undefined && value.month !== undefined && value.day !== undefined) {
            return fieldsFromTemporalLike(value);
        }
        if (value !== null && typeof value === "object" && value.hour !== undefined) {
            return fieldsFromTimeLike(value);
        }
        throw new TypeError("Intl.DateTimeFormat error: value must be a Date, timestamp number, or date/time-like object.");
    }


    function formatHour(hour, width, hourCycle) {
        var value = hour;

        if (width === undefined) {
            return undefined;
        }
        if (hourCycle === "h11") {
            value = hour % 12;
        } else if (hourCycle === "h12") {
            value = hour % 12;
            if (value === 0) value = 12;
        } else if (hourCycle === "h24" && hour === 0) {
            value = 24;
        }
        return width === "2-digit" ? Intl.__pad__(value, 2) : String(value);
    }

    function formatTime(locale, options, fields) {
        var parts = [];
        var hour = formatHour(fields.hour, options.hour, options.hourCycle);
        var marker;
        var second;

        if (hour === undefined) {
            if (options.second === undefined) {
                return undefined;
            }
            second = formatSecond(locale, fields.second, fields.millisecond, options);
            return second;
        }
        parts.push(hour);
        if (options.minute !== undefined) {
            parts.push(Intl.__pad__(fields.minute, 2));
        }
        if (options.second !== undefined) {
            parts.push(formatSecond(locale, fields.second, fields.millisecond, options));
        }
        if (options.hour12) {
            marker = fields.hour < 12 ? amMarker(locale) : pmMarker(locale);
            return locale === "hu-HU" ? marker + " " + parts.join(":") : parts.join(":") + " " + marker;
        }
        if (parts.length === 1 && locale === "de-DE") {
            return parts[0] + " Uhr";
        }
        if (parts.length === 1 && locale === "fr-FR") {
            return parts[0] + " h";
        }
        return parts.join(":");
    }

    function fractionalSecondSeparator(locale) {
        return locale === "en-US" || locale === "en-GB" ? "." : ",";
    }

    function formatSecond(locale, second, millisecond, options) {
        var text = Intl.__pad__(second, 2);

        if (options.second === "numeric") {
            text = String(second);
        }
        if (options.fractionalSecondDigits !== undefined) {
            text += fractionalSecondSeparator(locale) + Intl.__pad__(millisecond, 3).substring(0, options.fractionalSecondDigits);
        }
        return text;
    }

    function amMarker(locale) {
        if (locale === "en-GB") return "am";
        if (locale === "hu-HU") return "de.";
        return "AM";
    }

    function pmMarker(locale) {
        if (locale === "en-GB") return "pm";
        if (locale === "hu-HU") return "du.";
        return "PM";
    }

    function combineDateAndTime(locale, dateText, timeText, hasDate) {
        if (timeText === undefined) {
            return dateText;
        }
        if (!hasDate) {
            return timeText;
        }
        if (locale === "fr-FR" || locale === "hu-HU") {
            return dateText + " " + timeText;
        }
        return dateText + ", " + timeText;
    }
    function withWeekday(locale, weekday, dateText, hasDate) {
        if (weekday === undefined) {
            return dateText;
        }
        if (!hasDate) {
            return weekday;
        }
        if (locale === "hu-HU") {
            return dateText + ", " + weekday;
        }
        if (locale === "fr-FR") {
            return weekday + " " + dateText;
        }
        return weekday + ", " + dateText;
    }

    function part(type, value) {
        return { type: type, value: value };
    }

    function appendLiteral(parts, value) {
        if (value === "") {
            return;
        }
        if (parts.length > 0 && parts[parts.length - 1].type === "literal") {
            parts[parts.length - 1].value += value;
        } else {
            parts.push(part("literal", value));
        }
    }

    function formatSecondParts(locale, second, millisecond, options) {
        var parts = [];
        var text = options.second === "numeric" ? String(second) : Intl.__pad__(second, 2);

        parts.push(part("second", text));
        if (options.fractionalSecondDigits !== undefined) {
            appendLiteral(parts, fractionalSecondSeparator(locale));
            parts.push(part("fractionalSecond", Intl.__pad__(millisecond, 3).substring(0, options.fractionalSecondDigits)));
        }
        return parts;
    }

    function formatTimeParts(locale, options, fields) {
        var parts = [];
        var hour = formatHour(fields.hour, options.hour, options.hourCycle);
        var secondParts;
        var marker;
        var i;

        if (hour === undefined) {
            if (options.second === undefined) {
                return undefined;
            }
            return formatSecondParts(locale, fields.second, fields.millisecond, options);
        }
        if (options.hour12 && locale === "hu-HU") {
            marker = fields.hour < 12 ? amMarker(locale) : pmMarker(locale);
            parts.push(part("dayPeriod", marker));
            appendLiteral(parts, " ");
        }
        parts.push(part("hour", hour));
        if (options.minute !== undefined) {
            appendLiteral(parts, ":");
            parts.push(part("minute", Intl.__pad__(fields.minute, 2)));
        }
        if (options.second !== undefined) {
            appendLiteral(parts, ":");
            secondParts = formatSecondParts(locale, fields.second, fields.millisecond, options);
            for (i = 0; i < secondParts.length; i++) {
                parts.push(secondParts[i]);
            }
        }
        if (options.hour12 && locale !== "hu-HU") {
            marker = fields.hour < 12 ? amMarker(locale) : pmMarker(locale);
            appendLiteral(parts, " ");
            parts.push(part("dayPeriod", marker));
        }
        if (parts.length === 1 && locale === "de-DE") {
            appendLiteral(parts, " Uhr");
        }
        if (parts.length === 1 && locale === "fr-FR") {
            appendLiteral(parts, " h");
        }
        return parts;
    }

    function joinUSParts(parts, options) {
        var result = [];

        if (options.year !== undefined && options.month !== undefined && options.day !== undefined) {
            result.push(part("month", parts.month));
            appendLiteral(result, options.month === "short" || options.month === "long" ? " " : "/");
            result.push(part("day", parts.day));
            appendLiteral(result, options.month === "short" || options.month === "long" ? ", " : "/");
            result.push(part("year", parts.year));
            return result;
        }
        if (options.month !== undefined && options.day !== undefined) {
            result.push(part("month", parts.month));
            appendLiteral(result, options.month === "short" || options.month === "long" ? " " : "/");
            result.push(part("day", parts.day));
            return result;
        }
        if (options.year !== undefined && options.month !== undefined) {
            result.push(part("month", parts.month));
            appendLiteral(result, options.month === "short" || options.month === "long" ? " " : "/");
            result.push(part("year", parts.year));
            return result;
        }
        if (parts.year !== undefined) return [part("year", parts.year)];
        if (parts.month !== undefined) return [part("month", parts.month)];
        return parts.day === undefined ? [] : [part("day", parts.day)];
    }

    function joinDayMonthYearParts(parts, options, separator, dayDot) {
        var result = [];
        var namedMonth = options.month === "short" || options.month === "long";

        if (options.year !== undefined && options.month !== undefined && options.day !== undefined) {
            result.push(part("day", parts.day));
            appendLiteral(result, namedMonth && dayDot ? ". " : (namedMonth ? " " : separator));
            result.push(part("month", parts.month));
            appendLiteral(result, namedMonth ? " " : separator);
            result.push(part("year", parts.year));
            return result;
        }
        if (options.month !== undefined && options.day !== undefined) {
            result.push(part("day", parts.day));
            appendLiteral(result, namedMonth && dayDot ? ". " : (namedMonth ? " " : separator));
            result.push(part("month", parts.month));
            return result;
        }
        if (options.year !== undefined && options.month !== undefined) {
            result.push(part("month", parts.month));
            appendLiteral(result, namedMonth ? " " : separator);
            result.push(part("year", parts.year));
            return result;
        }
        if (parts.year !== undefined) return [part("year", parts.year)];
        if (parts.month !== undefined) return [part("month", parts.month)];
        return parts.day === undefined ? [] : [part("day", parts.day)];
    }

    function joinHungarianParts(parts, options) {
        var result = [];
        var namedMonth = options.month === "short" || options.month === "long";

        if (options.year !== undefined && options.month !== undefined && options.day !== undefined) {
            result.push(part("year", parts.year));
            appendLiteral(result, ". ");
            result.push(part("month", parts.month));
            appendLiteral(result, namedMonth ? " " : ". ");
            result.push(part("day", parts.day));
            appendLiteral(result, ".");
            return result;
        }
        if (options.month !== undefined && options.day !== undefined) {
            result.push(part("month", parts.month));
            appendLiteral(result, namedMonth ? " " : ". ");
            result.push(part("day", parts.day));
            appendLiteral(result, ".");
            return result;
        }
        if (options.year !== undefined && options.month !== undefined) {
            result.push(part("year", parts.year));
            appendLiteral(result, ". ");
            result.push(part("month", parts.month));
            if (!namedMonth) {
                appendLiteral(result, ".");
            }
            return result;
        }
        if (parts.year !== undefined) return [part("year", parts.year)];
        if (parts.month !== undefined) return [part("month", parts.month)];
        if (parts.day !== undefined) {
            result.push(part("day", parts.day));
            appendLiteral(result, ".");
        }
        return result;
    }

    function withWeekdayParts(locale, weekday, dateParts, hasDate) {
        var result = [];
        var i;

        if (weekday === undefined) {
            return dateParts;
        }
        if (!hasDate) {
            return [part("weekday", weekday)];
        }
        if (locale === "hu-HU") {
            for (i = 0; i < dateParts.length; i++) result.push(dateParts[i]);
            appendLiteral(result, ", ");
            result.push(part("weekday", weekday));
            return result;
        }
        result.push(part("weekday", weekday));
        appendLiteral(result, locale === "fr-FR" ? " " : ", ");
        for (i = 0; i < dateParts.length; i++) result.push(dateParts[i]);
        return result;
    }

    function combineDateAndTimeParts(locale, dateParts, timeParts, hasDate) {
        var result = [];
        var i;

        if (timeParts === undefined) {
            return dateParts;
        }
        if (!hasDate) {
            return timeParts;
        }
        for (i = 0; i < dateParts.length; i++) result.push(dateParts[i]);
        appendLiteral(result, locale === "fr-FR" || locale === "hu-HU" ? " " : ", ");
        for (i = 0; i < timeParts.length; i++) result.push(timeParts[i]);
        return result;
    }

    function joinUS(parts, options) {
        if (options.year !== undefined && options.month !== undefined && options.day !== undefined) {
            if (options.month === "short" || options.month === "long") {
                return parts.month + " " + parts.day + ", " + parts.year;
            }
            return parts.month + "/" + parts.day + "/" + parts.year;
        }
        if (options.month !== undefined && options.day !== undefined) {
            return (options.month === "short" || options.month === "long") ? parts.month + " " + parts.day : parts.month + "/" + parts.day;
        }
        if (options.year !== undefined && options.month !== undefined) {
            return (options.month === "short" || options.month === "long") ? parts.month + " " + parts.year : parts.month + "/" + parts.year;
        }
        return parts.year || parts.month || parts.day;
    }

    function joinDayMonthYear(parts, options, separator, dayDot) {
        if (options.year !== undefined && options.month !== undefined && options.day !== undefined) {
            if (options.month === "short" || options.month === "long") {
                return parts.day + (dayDot ? "." : "") + " " + parts.month + " " + parts.year;
            }
            return parts.day + separator + parts.month + separator + parts.year;
        }
        if (options.month !== undefined && options.day !== undefined) {
            if (options.month === "short" || options.month === "long") {
                return parts.day + (dayDot ? "." : "") + " " + parts.month;
            }
            return parts.day + separator + parts.month;
        }
        if (options.year !== undefined && options.month !== undefined) {
            return (options.month === "short" || options.month === "long") ? parts.month + " " + parts.year : parts.month + separator + parts.year;
        }
        return parts.year || parts.month || parts.day;
    }

    function joinHungarian(parts, options) {
        if (options.year !== undefined && options.month !== undefined && options.day !== undefined) {
            if (options.month === "short" || options.month === "long") {
                return parts.year + ". " + parts.month + " " + parts.day + ".";
            }
            return parts.year + ". " + parts.month + ". " + parts.day + ".";
        }
        if (options.month !== undefined && options.day !== undefined) {
            return (options.month === "short" || options.month === "long") ? parts.month + " " + parts.day + "." : parts.month + ". " + parts.day + ".";
        }
        if (options.year !== undefined && options.month !== undefined) {
            return options.month === "short" || options.month === "long" ? parts.year + ". " + parts.month : parts.year + ". " + parts.month + ".";
        }
        return parts.year || parts.month || (parts.day === undefined ? undefined : parts.day + ".");
    }

    function formatFields(locale, dateTimeData, options, fields) {
        var parts = {
            year: formatYear(fields.year, options.year),
            month: formatMonth(dateTimeData, fields.month, options.month),
            day: formatDay(fields.day, options.day),
            weekday: formatWeekday(dateTimeData, fields.dayOfWeek, options.weekday)
        };

        var dateText;
        var timeText = formatTime(locale, options, fields);
        var hasDate = options.year !== undefined || options.month !== undefined || options.day !== undefined;

        if (locale === "en-US") {
            dateText = joinUS(parts, options);
        } else if (locale === "de-DE") {
            dateText = joinDayMonthYear(parts, options, ".", true);
        } else if (locale === "fr-FR" || locale === "en-GB") {
            dateText = joinDayMonthYear(parts, options, "/", false);
        } else {
            dateText = joinHungarian(parts, options);
        }
        if (locale === "de-DE" && parts.weekday === "Mi" && hasDate) {
            parts.weekday = "Mi.";
        }
        dateText = withWeekday(locale, parts.weekday, dateText, hasDate);
        return combineDateAndTime(locale, dateText, timeText, hasDate);
    }

    function formatFieldsToParts(locale, dateTimeData, options, fields) {
        var values = {
            year: formatYear(fields.year, options.year),
            month: formatMonth(dateTimeData, fields.month, options.month),
            day: formatDay(fields.day, options.day),
            weekday: formatWeekday(dateTimeData, fields.dayOfWeek, options.weekday)
        };
        var dateParts;
        var timeParts = formatTimeParts(locale, options, fields);
        var hasDate = options.year !== undefined || options.month !== undefined || options.day !== undefined;

        if (locale === "en-US") {
            dateParts = joinUSParts(values, options);
        } else if (locale === "de-DE") {
            dateParts = joinDayMonthYearParts(values, options, ".", true);
        } else if (locale === "fr-FR" || locale === "en-GB") {
            dateParts = joinDayMonthYearParts(values, options, "/", false);
        } else {
            dateParts = joinHungarianParts(values, options);
        }
        if (locale === "de-DE" && values.weekday === "Mi" && hasDate) {
            values.weekday = "Mi.";
        }
        dateParts = withWeekdayParts(locale, values.weekday, dateParts, hasDate);
        return combineDateAndTimeParts(locale, dateParts, timeParts, hasDate);
    }

    function DateTimeFormat(locales, options) {
        var resolvedLocale;
        var localeData;
        var resolvedOptions;

        if (!(this instanceof DateTimeFormat)) {
            return new DateTimeFormat(locales, options);
        }

        requireCore();
        resolvedLocale = Intl.__resolveLocale__(locales, undefined, "en-US");
        localeData = Intl.__getModuleLocaleData__("DateTimeFormat", resolvedLocale);
        resolvedLocale = localeData.__locale__;
        resolvedOptions = validateOptions(options, resolvedLocale, localeData);

        this.__locale__ = resolvedLocale;
        this.__dateTimeData__ = localeData;
        this.__calendar__ = "gregory";
        this.__numberingSystem__ = resolvedOptions.numberingSystem;
        this.__year__ = resolvedOptions.year;
        this.__month__ = resolvedOptions.month;
        this.__day__ = resolvedOptions.day;
        this.__weekday__ = resolvedOptions.weekday;
        this.__hour__ = resolvedOptions.hour;
        this.__minute__ = resolvedOptions.minute;
        this.__second__ = resolvedOptions.second;
        this.__fractionalSecondDigits__ = resolvedOptions.fractionalSecondDigits;
        this.__hourCycle__ = resolvedOptions.hourCycle;
        this.__hour12__ = resolvedOptions.hour12;
    }

    DateTimeFormat.prototype.format = function (value) {
        return formatFields(this.__locale__, this.__dateTimeData__, {
            year: this.__year__,
            month: this.__month__,
            day: this.__day__,
            weekday: this.__weekday__,
            hour: this.__hour__,
            minute: this.__minute__,
            second: this.__second__,
            fractionalSecondDigits: this.__fractionalSecondDigits__,
            hourCycle: this.__hourCycle__,
            hour12: this.__hour12__
        }, dateFields(value));
    };

    DateTimeFormat.prototype.formatToParts = function (value) {
        return formatFieldsToParts(this.__locale__, this.__dateTimeData__, {
            year: this.__year__,
            month: this.__month__,
            day: this.__day__,
            weekday: this.__weekday__,
            hour: this.__hour__,
            minute: this.__minute__,
            second: this.__second__,
            fractionalSecondDigits: this.__fractionalSecondDigits__,
            hourCycle: this.__hourCycle__,
            hour12: this.__hour12__
        }, dateFields(value));
    };

    DateTimeFormat.prototype.formatRange = function (start, end) {
        var formattedStart = this.format(start);
        var formattedEnd = this.format(end);

        if (formattedStart === formattedEnd) {
            return formattedStart;
        }
        return formattedStart + "\u2013" + formattedEnd;
    };

    DateTimeFormat.prototype.resolvedOptions = function () {
        var result = {
            locale: this.__locale__,
            calendar: this.__calendar__,
            numberingSystem: this.__numberingSystem__
        };

        if (this.__year__ !== undefined) result.year = this.__year__;
        if (this.__month__ !== undefined) result.month = this.__month__;
        if (this.__day__ !== undefined) result.day = this.__day__;
        if (this.__weekday__ !== undefined) result.weekday = this.__weekday__;
        if (this.__hour__ !== undefined) {
            result.hourCycle = this.__hourCycle__;
            result.hour12 = this.__hour12__;
            result.hour = this.__hour__;
        }
        if (this.__minute__ !== undefined) result.minute = this.__minute__;
        if (this.__second__ !== undefined) result.second = this.__second__;
        if (this.__fractionalSecondDigits__ !== undefined) result.fractionalSecondDigits = this.__fractionalSecondDigits__;
        return result;
    };

    DateTimeFormat.supportedLocalesOf = function (locales, options) {
        var requested;
        var result = [];
        var localeData;
        var index;

        requireCore();
        requested = Intl.__supportedLocalesOf__(locales, undefined, options, "Intl.DateTimeFormat");
        for (index = 0; index < requested.length; index++) {
            localeData = Intl.__getModuleLocaleData__("DateTimeFormat", requested[index]);
            if (localeData.__locale__ === requested[index]) {
                result.push(requested[index]);
            }
        }
        return result;
    };

    Intl.DateTimeFormat = DateTimeFormat;
}());
