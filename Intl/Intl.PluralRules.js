/*
 * Minimal Intl.PluralRules subset for Adobe ExtendScript.
 *
 * Requires Intl-core.js.
 * Supported in this branch:
 * - type: "cardinal", "ordinal"
 * - select(number)
 */
var Intl = Intl || {};

(function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function requireCore() {
        if (typeof Intl.__requireCore__ !== "function") {
            throw new TypeError("Intl.PluralRules error: Intl-core.js is required.");
        }
        Intl.__requireCore__("Intl.PluralRules", true);
    }

    function readOptions(options) {
        var typeAllowed = ["cardinal", "ordinal"];
        var unsupported = [
            "minimumIntegerDigits",
            "minimumFractionDigits",
            "maximumFractionDigits",
            "minimumSignificantDigits",
            "maximumSignificantDigits",
            "roundingIncrement",
            "roundingMode",
            "roundingPriority",
            "trailingZeroDisplay"
        ];
        var index;

        options = Intl.__toObject__(options, "Intl.PluralRules");
        for (index = 0; index < unsupported.length; index++) {
            if (hasOwnProperty.call(options, unsupported[index]) && options[unsupported[index]] !== undefined) {
                throw new RangeError("Intl.PluralRules error: " + unsupported[index] + " is not supported by this subset.");
            }
        }
        return {
            type: Intl.__readStringOption__(options, "type", typeAllowed, "cardinal", "Intl.PluralRules")
        };
    }

    function isInteger(value) {
        return isFinite(value) && Math.floor(Math.abs(value)) === Math.abs(value);
    }

    function absoluteNumber(value) {
        var numberValue = Number(value);

        if (!isFinite(numberValue)) {
            return numberValue;
        }
        return Math.abs(numberValue);
    }

    function selectEnglishOrdinal(numberValue) {
        var integer = Math.floor(numberValue);
        var mod10 = integer % 10;
        var mod100 = integer % 100;

        if (!isInteger(numberValue)) {
            return "other";
        }
        if (mod10 === 1 && mod100 !== 11) {
            return "one";
        }
        if (mod10 === 2 && mod100 !== 12) {
            return "two";
        }
        if (mod10 === 3 && mod100 !== 13) {
            return "few";
        }
        return "other";
    }

    function selectCardinal(locale, numberValue) {
        var integer = Math.floor(numberValue);

        if (!isFinite(numberValue)) {
            return "other";
        }

        if (locale === "fr-FR") {
            if (integer === 0 || integer === 1) {
                return "one";
            }
            if (isInteger(numberValue) && integer !== 0 && integer % 1000000 === 0) {
                return "many";
            }
            return "other";
        }

        if ((locale === "en-US" || locale === "en-GB" || locale === "de-DE") &&
                isInteger(numberValue) && integer === 1) {
            return "one";
        }

        if (locale === "hu-HU" && numberValue === 1) {
            return "one";
        }

        return "other";
    }

    function selectOrdinal(locale, numberValue) {
        if (!isFinite(numberValue)) {
            return "other";
        }

        if (locale === "en-US" || locale === "en-GB") {
            return selectEnglishOrdinal(numberValue);
        }
        if (locale === "fr-FR" && numberValue === 1) {
            return "one";
        }
        if (locale === "hu-HU" && (numberValue === 1 || numberValue === 5)) {
            return "one";
        }
        return "other";
    }

    function PluralRules(locales, options) {
        var resolvedOptions;
        var localeData;

        if (!(this instanceof PluralRules)) {
            return new PluralRules(locales, options);
        }

        requireCore();
        resolvedOptions = readOptions(options);
        localeData = Intl.__getModuleLocaleData__("PluralRules", Intl.__resolveLocale__(locales, undefined, "en-US"));
        this.__locale__ = localeData.__locale__;
        this.__localeData__ = localeData;
        this.__type__ = resolvedOptions.type;
    }

    PluralRules.prototype.select = function (value) {
        var numberValue = absoluteNumber(value);

        if (this.__type__ === "ordinal") {
            return selectOrdinal(this.__locale__, numberValue);
        }
        return selectCardinal(this.__locale__, numberValue);
    };

    PluralRules.prototype.resolvedOptions = function () {
        var categories = this.__localeData__[this.__type__];
        var resultCategories = [];
        var index;

        for (index = 0; index < categories.length; index++) {
            resultCategories.push(categories[index]);
        }

        return {
            locale: this.__locale__,
            type: this.__type__,
            pluralCategories: resultCategories
        };
    };

    PluralRules.supportedLocalesOf = function (locales, options) {
        var requested;
        var localeData;
        var result = [];
        var index;

        requireCore();
        requested = Intl.__supportedLocalesOf__(locales, undefined, options, "Intl.PluralRules");
        for (index = 0; index < requested.length; index++) {
            localeData = Intl.__getModuleLocaleData__("PluralRules", requested[index]);
            if (localeData.__locale__ === requested[index]) {
                result.push(requested[index]);
            }
        }
        return result;
    };

    Intl.PluralRules = PluralRules;
}());

