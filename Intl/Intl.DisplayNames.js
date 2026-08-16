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
        var resolvedLocale;
        var localeData;
        var resolvedOptions;

        if (!(this instanceof DisplayNames)) {
            return new DisplayNames(locales, options);
        }

        requireCore();
        resolvedOptions = validateOptions(options);
        resolvedLocale = Intl.__resolveLocale__(locales, undefined, "en-US");
        localeData = Intl.__getModuleLocaleData__("DisplayNames", resolvedLocale);
        this.__locale__ = localeData.__locale__;
        this.__displayNamesData__ = localeData;
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
            names = this.__displayNamesData__.languages[this.__languageDisplay__];
            return hasOwnProperty.call(names, value) ? names[value] : fallbackValue(value, this.__fallback__);
        }
        if (this.__type__ === "region") {
            value = canonicalizeRegionCode(code);
            names = this.__displayNamesData__.regions;
            return hasOwnProperty.call(names, value) ? names[value] : fallbackValue(value, this.__fallback__);
        }

        value = canonicalizeCurrencyCode(code);
        names = this.__displayNamesData__.currencies;
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
        var requested;
        var result = [];
        var localeData;
        var index;

        requireCore();
        requested = Intl.__supportedLocalesOf__(locales, undefined, options, "Intl.DisplayNames");
        for (index = 0; index < requested.length; index++) {
            localeData = Intl.__getModuleLocaleData__("DisplayNames", requested[index]);
            if (localeData.__locale__ === requested[index]) {
                result.push(requested[index]);
            }
        }
        return result;
    };

    if (!Intl.DisplayNames) {
        Intl.DisplayNames = DisplayNames;
    }
}());
