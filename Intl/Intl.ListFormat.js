/*
 * Minimal Intl.ListFormat subset for Adobe ExtendScript.
 *
 * Requires Intl-core.js.
 * Supported in this branch:
 * - type: "conjunction", "disjunction", "unit"
 * - style: "long", "short", "narrow"
 * - format() for Array and String inputs
 */
var Intl = Intl || {};

(function () {
    function requireCore() {
        if (typeof Intl.__requireCore__ !== "function") {
            throw new TypeError("Intl.ListFormat error: Intl-core.js is required.");
        }
        Intl.__requireCore__("Intl.ListFormat", true);
    }

    function readOptions(options) {
        var typeAllowed = ["conjunction", "disjunction", "unit"];
        var styleAllowed = ["long", "short", "narrow"];

        options = Intl.__toObject__(options, "Intl.ListFormat");
        return {
            type: Intl.__readStringOption__(options, "type", typeAllowed, "conjunction", "Intl.ListFormat"),
            style: Intl.__readStringOption__(options, "style", styleAllowed, "long", "Intl.ListFormat")
        };
    }

    function applyPattern(pattern, first, second) {
        return pattern.replace("{0}", first).replace("{1}", second);
    }

    function toStringList(list) {
        var result = [];
        var index;

        if (typeof list === "string") {
            for (index = 0; index < list.length; index++) {
                result.push(list.charAt(index));
            }
            return result;
        }

        if (Object.prototype.toString.call(list) !== "[object Array]") {
            throw new TypeError("Intl.ListFormat error: list must be an Array or String.");
        }

        for (index = 0; index < list.length; index++) {
            if (typeof list[index] !== "string") {
                throw new TypeError("Intl.ListFormat error: list values must be strings.");
            }
            result.push(list[index]);
        }
        return result;
    }

    function ListFormat(locales, options) {
        var resolvedLocale;
        var localeData;
        var resolvedOptions;

        if (!(this instanceof ListFormat)) {
            return new ListFormat(locales, options);
        }

        requireCore();
        resolvedOptions = readOptions(options);
        resolvedLocale = Intl.__resolveLocale__(locales, undefined, "en-US");
        localeData = Intl.__getModuleLocaleData__("ListFormat", resolvedLocale);
        this.__locale__ = localeData.__locale__;
        this.__listData__ = localeData;
        this.__type__ = resolvedOptions.type;
        this.__style__ = resolvedOptions.style;
    }

    ListFormat.prototype.format = function (list) {
        var values = toStringList(list);
        var patterns = this.__listData__[this.__type__][this.__style__];
        var result;
        var index;

        if (values.length === 0) {
            return "";
        }
        if (values.length === 1) {
            return values[0];
        }
        if (values.length === 2) {
            return applyPattern(patterns.pair, values[0], values[1]);
        }

        result = applyPattern(patterns.start, values[0], values[1]);
        for (index = 2; index < values.length - 1; index++) {
            result = applyPattern(patterns.middle, result, values[index]);
        }
        return applyPattern(patterns.end, result, values[values.length - 1]);
    };

    ListFormat.prototype.resolvedOptions = function () {
        return {
            locale: this.__locale__,
            type: this.__type__,
            style: this.__style__
        };
    };

    ListFormat.supportedLocalesOf = function (locales, options) {
        var requested;
        var result = [];
        var localeData;
        var index;

        requireCore();
        requested = Intl.__supportedLocalesOf__(locales, undefined, options, "Intl.ListFormat");
        for (index = 0; index < requested.length; index++) {
            localeData = Intl.__getModuleLocaleData__("ListFormat", requested[index]);
            if (localeData.__locale__ === requested[index]) {
                result.push(requested[index]);
            }
        }
        return result;
    };

    if (!Intl.ListFormat) {
        Intl.ListFormat = ListFormat;
    }
}());
