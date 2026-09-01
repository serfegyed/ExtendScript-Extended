/*
 * Minimal Intl.RelativeTimeFormat subset for Adobe ExtendScript.
 *
 * Requires Intl-core.js and Intl.PluralRules.js.
 * Supported in this branch:
 * - style: "long", "short", "narrow"
 * - numeric: "always", "auto"
 * - unit: "second", "minute", "hour", "day", "week", "month", "year"
 * - format(value, unit)
 */
var Intl = Intl || {};

(function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var unitAliases = {
        second: "second",
        seconds: "second",
        minute: "minute",
        minutes: "minute",
        hour: "hour",
        hours: "hour",
        day: "day",
        days: "day",
        week: "week",
        weeks: "week",
        month: "month",
        months: "month",
        year: "year",
        years: "year"
    };

    function requireCore() {
        if (typeof Intl.__requireCore__ !== "function") {
            throw new TypeError("Intl.RelativeTimeFormat error: Intl-core.js is required.");
        }
        Intl.__requireCore__("Intl.RelativeTimeFormat", true);
        if (typeof Intl.PluralRules !== "function") {
            throw new TypeError("Intl.RelativeTimeFormat error: Intl.PluralRules.js is required.");
        }
    }

    function readOptions(options) {
        var styleAllowed = ["long", "short", "narrow"];
        var numericAllowed = ["always", "auto"];

        options = Intl.__toObject__(options, "Intl.RelativeTimeFormat");
        return {
            style: Intl.__readStringOption__(options, "style", styleAllowed, "long", "Intl.RelativeTimeFormat"),
            numeric: Intl.__readStringOption__(options, "numeric", numericAllowed, "always", "Intl.RelativeTimeFormat")
        };
    }

    function isNegativeZero(value) {
        return value === 0 && 1 / value === -Infinity;
    }

    function normalizeUnit(unit) {
        var key = String(unit);

        if (!hasOwnProperty.call(unitAliases, key)) {
            throw new RangeError("Intl.RelativeTimeFormat error: unit is not supported by this subset.");
        }
        return unitAliases[key];
    }

    function applyPattern(pattern, value, unit) {
        return pattern.replace("{0}", value).replace("{1}", unit);
    }

    function unitLabel(data, unit, category, isPast) {
        var units = data.units;
        var labels;

        if (!isPast && data.futureUnits) {
            units = data.futureUnits;
        }
        labels = units[unit];
        return labels[category === "one" ? 0 : 1];
    }

    function RelativeTimeFormat(locales, options) {
        var resolvedOptions;

        if (!(this instanceof RelativeTimeFormat)) {
            return new RelativeTimeFormat(locales, options);
        }

        requireCore();
        resolvedOptions = readOptions(options);
        this.__locale__ = Intl.__resolveLocale__(locales, undefined, "en-US");
        this.__relativeTimeData__ = Intl.__getModuleLocaleData__("RelativeTimeFormat", this.__locale__);
        this.__locale__ = this.__relativeTimeData__.__locale__;
        this.__style__ = resolvedOptions.style;
        this.__numeric__ = resolvedOptions.numeric;
    }

    RelativeTimeFormat.prototype.format = function (value, unit) {
        var numberValue = Number(value);
        var normalizedUnit = normalizeUnit(unit);
        var isPast = numberValue < 0 || isNegativeZero(numberValue, value);
        var absValue;
        var data;
        var autoData;
        var autoKey;
        var category;
        var label;
        var pattern;

        if (!isFinite(numberValue)) {
            throw new RangeError("Intl.RelativeTimeFormat error: value must be a finite number.");
        }

        data = this.__relativeTimeData__[this.__style__];
        if (this.__numeric__ === "auto") {
            autoData = data.auto && data.auto[normalizedUnit];
            autoKey = String(numberValue);
            if (autoData && hasOwnProperty.call(autoData, autoKey)) {
                return autoData[autoKey];
            }
        }

        absValue = Math.abs(numberValue);
        category = new Intl.PluralRules(this.__locale__, { type: "cardinal" }).select(absValue);
        label = unitLabel(data, normalizedUnit, category, isPast);
        pattern = isPast && data.pastPattern ? data.pastPattern : (isPast ? data.past : data.future);
        return applyPattern(pattern, String(absValue), label);
    };

    RelativeTimeFormat.prototype.resolvedOptions = function () {
        return {
            locale: this.__locale__,
            style: this.__style__,
            numeric: this.__numeric__
        };
    };

    RelativeTimeFormat.supportedLocalesOf = function (locales, options) {
        var requested;
        var result = [];
        var index;
        var localeData;

        requireCore();
        requested = Intl.__supportedLocalesOf__(locales, undefined, options, "Intl.RelativeTimeFormat");
        for (index = 0; index < requested.length; index++) {
            localeData = Intl.__getModuleLocaleData__("RelativeTimeFormat", requested[index]);
            if (localeData.__locale__ === requested[index]) {
                result.push(requested[index]);
            }
        }
        return result;
    };

    Intl.RelativeTimeFormat = RelativeTimeFormat;
}());
