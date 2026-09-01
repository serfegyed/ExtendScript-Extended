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

    function fieldSpace(durationData, field, style) {
        var spaces = durationData.spaces[style];

        if (spaces[field] !== undefined) {
            return spaces[field];
        }
        return spaces["default"];
    }

    function formatUnit(durationData, style, field, value) {
        var labels = durationData.labels[style][field];
        var label = labels[isPlural(value) ? 1 : 0];

        return String(value) + fieldSpace(durationData, field, style) + label;
    }

    function ruleMatches(rule, style, parts) {
        var index;

        if (rule.styles !== undefined) {
            for (index = 0; index < rule.styles.length; index++) {
                if (rule.styles[index] === style) {
                    break;
                }
            }
            if (index >= rule.styles.length) {
                return false;
            }
        }
        if (parts.length < rule.minParts) {
            return false;
        }
        if (rule.lastFields !== undefined) {
            for (index = 0; index < rule.lastFields.length; index++) {
                if (parts[parts.length - 1].field === rule.lastFields[index]) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }

    function findConnectorRule(durationData, style, parts) {
        var rules = durationData.join.connectorRules;
        var index;

        for (index = 0; index < rules.length; index++) {
            if (ruleMatches(rules[index], style, parts)) {
                return rules[index];
            }
        }
        return undefined;
    }

    function joinParts(durationData, style, parts) {
        var texts = [];
        var index;
        var last;
        var connectorRule;
        var separator;

        if (parts.length === 0) {
            return "";
        }
        if (parts.length === 1) {
            return parts[0].text;
        }

        for (index = 0; index < parts.length; index++) {
            texts.push(parts[index].text);
        }

        connectorRule = findConnectorRule(durationData, style, parts);
        separator = style === "narrow" && durationData.join.narrowSeparator !== undefined ? durationData.join.narrowSeparator : durationData.join.defaultSeparator;
        if (connectorRule !== undefined) {
            last = texts.pop();
            return texts.join(durationData.join.defaultSeparator) + connectorRule.connector + last;
        }

        return texts.join(separator);
    }



    function formatDigitalTime(durationData, record) {
        var text = String(record.hours) + ":" + Intl.__pad__(record.minutes, 2) + ":" + Intl.__pad__(record.seconds, 2);

        if (record.milliseconds !== 0) {
            text += durationData.fractionalSeparator + Intl.__pad__(record.milliseconds, 3);
        }
        return text;
    }

    function formatRecord(durationData, style, record) {
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
                        text: formatUnit(durationData, "short", field, value)
                    });
                }
            }
            parts.push({
                field: "digitalTime",
                text: formatDigitalTime(durationData, record)
            });
            return joinParts(durationData, "digital", parts);
        }

        for (index = 0; index < durationFields.length; index++) {
            field = durationFields[index];
            value = record[field];
            if (value !== 0) {
                parts.push({
                    field: field,
                    text: formatUnit(durationData, style, field, value)
                });
            }
        }
        return joinParts(durationData, style, parts);
    }

    function DurationFormat(locales, options) {
        var resolvedLocale;
        var localeData;
        var resolvedOptions;

        if (!(this instanceof DurationFormat)) {
            return new DurationFormat(locales, options);
        }

        requireCore();
        resolvedLocale = Intl.__resolveLocale__(locales, undefined, "en-US");
        localeData = Intl.__getModuleLocaleData__("DurationFormat", resolvedLocale);
        resolvedLocale = localeData.__locale__;
        resolvedOptions = validateOptions(options);

        this.__locale__ = resolvedLocale;
        this.__durationData__ = localeData;
        this.__numberingSystem__ = resolvedOptions.numberingSystem;
        this.__style__ = resolvedOptions.style;
    }

    DurationFormat.prototype.format = function (value) {
        return formatRecord(this.__durationData__, this.__style__, durationRecord(value));
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
        var requested;
        var result = [];
        var localeData;
        var index;

        requireCore();
        requested = Intl.__supportedLocalesOf__(locales, undefined, options, "Intl.DurationFormat");
        for (index = 0; index < requested.length; index++) {
            localeData = Intl.__getModuleLocaleData__("DurationFormat", requested[index]);
            if (localeData.__locale__ === requested[index]) {
                result.push(requested[index]);
            }
        }
        return result;
    };

    Intl.DurationFormat = DurationFormat;
}());



