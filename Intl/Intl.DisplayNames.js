/*
 * Minimal Intl.DisplayNames subset for Adobe ExtendScript.
 *
 * Requires Intl-core.js.
 * Supported in this branch:
 * - type: "language", "region", "currency"
 * - style: "long"
 * - fallback: "code", "none"
 * - languageDisplay: "dialect", "standard" for type "language"
 */
var Intl = Intl || {};

(function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function requireCore() {
        if (typeof Intl.__requireCore__ !== "function") {
            throw new TypeError("Intl.DisplayNames error: Intl-core.js is required.");
        }
        Intl.__requireCore__("Intl.DisplayNames", true);
    }

    function validateOptions(options) {
        var typeAllowed = ["language", "region", "currency"];
        var styleAllowed = ["long"];
        var fallbackAllowed = ["code", "none"];
        var languageDisplayAllowed = ["dialect", "standard"];
        var type;

        if (options === undefined || options === null) {
            throw new TypeError("Intl.DisplayNames error: options object is required.");
        }

        type = Intl.__readStringOption__(options, "type", typeAllowed, undefined, "Intl.DisplayNames");
        if (type === undefined) {
            throw new TypeError("Intl.DisplayNames error: type option is required.");
        }

        return {
            type: type,
            style: Intl.__readStringOption__(options, "style", styleAllowed, "long", "Intl.DisplayNames"),
            fallback: Intl.__readStringOption__(options, "fallback", fallbackAllowed, "code", "Intl.DisplayNames"),
            languageDisplay: type === "language" ?
                Intl.__readStringOption__(options, "languageDisplay", languageDisplayAllowed, "dialect", "Intl.DisplayNames") :
                undefined
        };
    }

    function canonicalizeLanguageCode(code) {
        return Intl.__canonicalizeLocales__(String(code))[0];
    }

    function canonicalizeRegionCode(code) {
        var value = String(code);

        if (!/^[A-Za-z]{2}$/.test(value)) {
            throw new RangeError("Intl.DisplayNames error: invalid region code.");
        }
        return value.toUpperCase();
    }

    function canonicalizeCurrencyCode(code) {
        var value = String(code);

        if (!/^[A-Za-z]{3}$/.test(value)) {
            throw new RangeError("Intl.DisplayNames error: invalid currency code.");
        }
        return value.toUpperCase();
    }

    function fallbackValue(code, fallback) {
        return fallback === "none" ? undefined : code;
    }

    function DisplayNames(locales, options) {
        var resolvedOptions;

        if (!(this instanceof DisplayNames)) {
            return new DisplayNames(locales, options);
        }

        requireCore();
        resolvedOptions = validateOptions(options);
        this.__locale__ = Intl.__resolveLocale__(locales, undefined, "en-US");
        this.__style__ = resolvedOptions.style;
        this.__type__ = resolvedOptions.type;
        this.__fallback__ = resolvedOptions.fallback;
        this.__languageDisplay__ = resolvedOptions.languageDisplay;
    }

    DisplayNames.prototype.of = function (code) {
        var value;
        var names;

        if (code === undefined) {
            throw new TypeError("Intl.DisplayNames error: code is required.");
        }

        if (this.__type__ === "language") {
            value = canonicalizeLanguageCode(code);
            names = Intl.__getLocaleData__(undefined, "displayNames").languages[this.__languageDisplay__][this.__locale__];
            return hasOwnProperty.call(names, value) ? names[value] : fallbackValue(value, this.__fallback__);
        }
        if (this.__type__ === "region") {
            value = canonicalizeRegionCode(code);
            names = Intl.__getLocaleData__(undefined, "displayNames").regions[this.__locale__];
            return hasOwnProperty.call(names, value) ? names[value] : fallbackValue(value, this.__fallback__);
        }

        value = canonicalizeCurrencyCode(code);
        names = Intl.__getLocaleData__(undefined, "displayNames").currencies[this.__locale__];
        return hasOwnProperty.call(names, value) ? names[value] : fallbackValue(value, this.__fallback__);
    };

    DisplayNames.prototype.resolvedOptions = function () {
        var result = {
            locale: this.__locale__,
            style: this.__style__,
            type: this.__type__,
            fallback: this.__fallback__
        };

        if (this.__type__ === "language") {
            result.languageDisplay = this.__languageDisplay__;
        }

        return result;
    };

    DisplayNames.supportedLocalesOf = function (locales, options) {
        requireCore();
        return Intl.__supportedLocalesOf__(locales, undefined, options, "Intl.DisplayNames");
    };

    if (!Intl.DisplayNames) {
        Intl.DisplayNames = DisplayNames;
    }
}());
