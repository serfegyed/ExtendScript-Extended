/*
 * Minimal Intl.DurationFormat subset for Adobe ExtendScript.
 *
 * Requires Intl-core.js.
 * Supported in this branch:
 * - style: "short", "long", "digital", "narrow"
 * - years, months, weeks, days, hours, minutes, seconds, milliseconds
 * - object input with plural duration field names
 * - narrow ISO duration string input
 */
var Intl = Intl || {};

(function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var durationFields = ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];
    var unsupportedOptions = [
        "years", "yearsDisplay", "months", "monthsDisplay", "weeks", "weeksDisplay",
        "days", "daysDisplay", "hours", "hoursDisplay", "minutes", "minutesDisplay",
        "seconds", "secondsDisplay", "milliseconds", "millisecondsDisplay",
        "microseconds", "microsecondsDisplay", "nanoseconds", "nanosecondsDisplay"
    ];
    function requireCore() {
        if (typeof Intl.__requireCore__ !== "function") {
            throw new TypeError("Intl.DurationFormat error: Intl-core.js is required.");
        }
        Intl.__requireCore__("Intl.DurationFormat");
    }

    function validateOptions(options) {
        var index;
        var localeMatcher;
        var numberingSystem;
        var style;

        options = Intl.__toObject__(options, "Intl.DurationFormat");

        localeMatcher = options.localeMatcher === undefined ? "best fit" : String(options.localeMatcher);
        if (localeMatcher !== "best fit" && localeMatcher !== "lookup") {
            throw new RangeError("Intl.DurationFormat error: localeMatcher is not supported by this subset.");
        }

        numberingSystem = options.numberingSystem === undefined ? "latn" : String(options.numberingSystem);
        if (numberingSystem !== "latn") {
            throw new RangeError("Intl.DurationFormat error: numberingSystem is not supported by this subset.");
        }

        for (index = 0; index < unsupportedOptions.length; index++) {
            if (options[unsupportedOptions[index]] !== undefined) {
                throw new RangeError("Intl.DurationFormat error: " + unsupportedOptions[index] + " is not supported by this subset.");
            }
        }

        style = Intl.__readStringOption__(options, "style", ["short", "long", "digital", "narrow"], "short", "Intl.DurationFormat");
        return {
            localeMatcher: localeMatcher,
            numberingSystem: numberingSystem,
            style: style
        };
    }

    function readDurationField(input, name) {
        var value;

        if (!hasOwnProperty.call(input, name) || input[name] === undefined) {
            return undefined;
        }
        value = Number(input[name]);
        if (!isFinite(value) || Math.floor(value) !== value) {
            throw new RangeError("Intl.DurationFormat error: " + name + " must be a finite integer.");
        }
        return value;
    }

    function parseISODurationString(value) {
        var text = String(value);
        var sign = 1;
        var tIndex;
        var datePart;
        var timePart;
        var hasField = false;
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

        if (text.charAt(0) === "-" || text.charAt(0) === "+") {
            sign = text.charAt(0) === "-" ? -1 : 1;
            text = text.substring(1);
        }
        if (text.charAt(0) !== "P") {
            throw new RangeError("Intl.DurationFormat error: invalid ISO duration string.");
        }
        text = text.substring(1);
        tIndex = text.indexOf("T");
        datePart = tIndex < 0 ? text : text.substring(0, tIndex);
        timePart = tIndex < 0 ? "" : text.substring(tIndex + 1);

        hasField = scanISODatePart(datePart, result) || hasField;
        hasField = scanISOTimePart(timePart, result) || hasField;
        if (!hasField) {
            throw new RangeError("Intl.DurationFormat error: invalid ISO duration string.");
        }

        result.years *= sign;
        result.months *= sign;
        result.weeks *= sign;
        result.days *= sign;
        result.hours *= sign;
        result.minutes *= sign;
        result.seconds *= sign;
        result.milliseconds *= sign;
        result.__hasField__ = true;
        return result;
    }

    function scanISODatePart(text, result) {
        var order = { Y: 1, M: 2, W: 3, D: 4 };
        var fields = { Y: "years", M: "months", W: "weeks", D: "days" };
        var re = /(\d+)([YMWD])/g;
        var sign;
        var match;
        var consumed = "";
        var lastOrder = 0;
        var hasField = false;

        if (text === "") {
            return false;
        }
        while ((match = re.exec(text)) !== null) {
            if (order[match[2]] <= lastOrder) {
                throw new RangeError("Intl.DurationFormat error: invalid ISO duration string.");
            }
            lastOrder = order[match[2]];
            consumed += match[0];
            result[fields[match[2]]] = Number(match[1]);
            hasField = true;
        }
        if (consumed !== text) {
            throw new RangeError("Intl.DurationFormat error: invalid ISO duration string.");
        }
        return hasField;
    }

    function scanISOTimePart(text, result) {
        var order = { H: 1, M: 2, S: 3 };
        var fields = { H: "hours", M: "minutes", S: "seconds" };
        var re = /(\d+(?:\.\d{1,3})?)([HMS])/g;
        var match;
        var consumed = "";
        var lastOrder = 0;
        var hasField = false;
        var numberText;
        var fractionIndex;

        if (text === "") {
            return false;
        }
        while ((match = re.exec(text)) !== null) {
            if (order[match[2]] <= lastOrder || (match[2] !== "S" && match[1].indexOf(".") >= 0)) {
                throw new RangeError("Intl.DurationFormat error: invalid ISO duration string.");
            }
            lastOrder = order[match[2]];
            consumed += match[0];
            numberText = match[1];
            if (match[2] === "S") {
                fractionIndex = numberText.indexOf(".");
                if (fractionIndex >= 0) {
                    result.seconds = Number(numberText.substring(0, fractionIndex));
                    result.milliseconds = Number((numberText.substring(fractionIndex + 1) + "000").substring(0, 3));
                } else {
                    result.seconds = Number(numberText);
                }
            } else {
                result[fields[match[2]]] = Number(numberText);
            }
            hasField = true;
        }
        if (consumed !== text) {
            throw new RangeError("Intl.DurationFormat error: invalid ISO duration string.");
        }
        return hasField;
    }

    function durationRecord(value) {
        var input;
        var result = {};
        var hasField = false;
        var sign = 0;
        var index;
        var field;
        var fieldValue;

        if (typeof value === "string") {
            return parseISODurationString(value);
        }
        if (value === null || typeof value !== "object") {
            throw new TypeError("Intl.DurationFormat error: value must be a duration-like object.");
        }
        input = value;

        for (index = 0; index < durationFields.length; index++) {
            field = durationFields[index];
            fieldValue = readDurationField(input, field);
            if (fieldValue === undefined) {
                result[field] = 0;
                continue;
            }
            hasField = true;
            result[field] = fieldValue;
            if (fieldValue < 0) {
                if (sign > 0) {
                    throw new RangeError("Intl.DurationFormat error: mixed-sign durations are not supported.");
                }
                sign = -1;
            } else if (fieldValue > 0) {
                if (sign < 0) {
                    throw new RangeError("Intl.DurationFormat error: mixed-sign durations are not supported.");
                }
                sign = 1;
            }
        }

        if (!hasField) {
            throw new TypeError("Intl.DurationFormat error: value has no supported duration fields.");
        }
        result.__hasField__ = hasField;
        return result;
    }

    function isPlural(value) {
        return Math.abs(value) !== 1;
    }

    function fieldSpace(locale, field, style) {
        if (style === "narrow") {
            if (locale === "en-US" || locale === "en-GB" || locale === "fr-FR") {
                return "";
            }
            if (locale === "de-DE" && field === "hours") {
                return "";
            }
        }
        if (locale === "fr-FR" && style === "long") {
            return field === "minutes" ? " " : "\u00A0";
        }
        if (locale === "fr-FR") {
            return field === "years" || field === "minutes" ? "\u00A0" : "\u202F";
        }
        return " ";
    }

    function formatUnit(locale, style, field, value) {
        var labels = Intl.__getLocaleData__(undefined, "durationUnitLabels")[style][locale][field];
        var label = labels[isPlural(value) ? 1 : 0];

        return String(value) + fieldSpace(locale, field, style) + label;
    }

    function shouldGermanUseUnd(parts, style) {
        if (parts.length < 2) {
            return false;
        }
        if (style === "narrow") {
            return parts.length > 2 && (
                parts[parts.length - 1].field === "seconds" ||
                parts[parts.length - 1].field === "milliseconds"
            );
        }
        if (style === "short") {
            return parts[parts.length - 1].field === "seconds";
        }
        return parts.length > 2 && (
            parts[parts.length - 1].field === "days" ||
            parts[parts.length - 1].field === "seconds" ||
            parts[parts.length - 1].field === "milliseconds"
        );
    }

    function joinParts(locale, style, parts) {
        var texts = [];
        var index;
        var last;
        var connector;

        if (parts.length === 0) {
            return "";
        }
        if (parts.length === 1) {
            return parts[0].text;
        }

        for (index = 0; index < parts.length; index++) {
            texts.push(parts[index].text);
        }

        if (style === "narrow" && (locale === "en-US" || locale === "en-GB" || locale === "fr-FR")) {
            return texts.join(" ");
        }

        if ((style !== "narrow" && locale === "fr-FR") || locale === "hu-HU" || (locale === "de-DE" && shouldGermanUseUnd(parts, style))) {
            last = texts.pop();
            connector = locale === "de-DE" ? " und " : (locale === "fr-FR" ? " et " : " \u00E9s ");
            return texts.join(", ") + connector + last;
        }

        return texts.join(", ");
    }

    function hasDateFields(record) {
        return record.years !== 0 || record.months !== 0 || record.weeks !== 0 || record.days !== 0;
    }

    function hasTimeFields(record) {
        return record.hours !== 0 || record.minutes !== 0 || record.seconds !== 0 || record.milliseconds !== 0;
    }

    function fractionalSeparator(locale) {
        return locale === "en-US" || locale === "en-GB" ? "." : ",";
    }

    function formatDigitalTime(locale, record) {
        var text = String(record.hours) + ":" + Intl.__pad__(record.minutes, 2) + ":" + Intl.__pad__(record.seconds, 2);

        if (record.milliseconds !== 0) {
            text += fractionalSeparator(locale) + Intl.__pad__(record.milliseconds, 3);
        }
        return text;
    }

    function formatRecord(locale, style, record) {
        var parts = [];
        var index;
        var field;
        var value;

        if (style === "digital") {
            for (index = 0; index < 4; index++) {
                field = durationFields[index];
                value = record[field];
                if (value !== 0) {
                    parts.push({
                        field: field,
                        text: formatUnit(locale, "short", field, value)
                    });
                }
            }
            if (hasDateFields(record) || hasTimeFields(record) || record.__hasField__) {
                parts.push({
                    field: "digitalTime",
                    text: formatDigitalTime(locale, record)
                });
            }
            return joinParts(locale, "digital", parts);
        }

        for (index = 0; index < durationFields.length; index++) {
            field = durationFields[index];
            value = record[field];
            if (value !== 0) {
                parts.push({
                    field: field,
                    text: formatUnit(locale, style, field, value)
                });
            }
        }
        return joinParts(locale, style, parts);
    }

    function DurationFormat(locales, options) {
        var resolvedLocale;
        var resolvedOptions;

        if (!(this instanceof DurationFormat)) {
            return new DurationFormat(locales, options);
        }

        requireCore();
        resolvedLocale = Intl.__resolveLocale__(locales, undefined, "en-US");
        resolvedOptions = validateOptions(options);

        this.__locale__ = resolvedLocale;
        this.__numberingSystem__ = resolvedOptions.numberingSystem;
        this.__style__ = resolvedOptions.style;
    }

    DurationFormat.prototype.format = function (value) {
        return formatRecord(this.__locale__, this.__style__, durationRecord(value));
    };

    DurationFormat.prototype.resolvedOptions = function () {
        var result = {
            locale: this.__locale__,
            numberingSystem: this.__numberingSystem__,
            style: this.__style__
        };
        var index;
        var field;

        for (index = 0; index < durationFields.length; index++) {
            field = durationFields[index];
            if (this.__style__ === "digital" && (field === "hours" || field === "minutes" || field === "seconds" || field === "milliseconds")) {
                result[field] = field === "hours" || field === "milliseconds" ? "numeric" : "2-digit";
            } else {
            result[field] = this.__style__ === "digital" ? "short" : this.__style__;
            }
            result[field + "Display"] = this.__style__ === "digital" && (field === "hours" || field === "minutes" || field === "seconds") ? "always" : "auto";
        }

        return result;
    };

    DurationFormat.supportedLocalesOf = function (locales, options) {
        requireCore();
        return Intl.__supportedLocalesOf__(locales, undefined, options, "Intl.DurationFormat");
    };

    Intl.DurationFormat = DurationFormat;
}());
