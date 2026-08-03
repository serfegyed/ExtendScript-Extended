/*
 * Minimal Intl.NumberFormat subset for Adobe ExtendScript.
 *
 * Requires Intl-core.js.
 * Supported in this branch:
 * - decimal style
 * - latn numbering system
 * - grouping, minimumFractionDigits, maximumFractionDigits
 */
var Intl = Intl || {};

(function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function toInteger(value, optionName) {
        var number = Number(value);

        if (!isFinite(number)) {
            throw new RangeError("Intl.NumberFormat error: " + optionName + " is out of range.");
        }
        return number < 0 ? Math.ceil(number) : Math.floor(number);
    }

    function readIntegerDigitOption(options, optionName, defaultValue) {
        var value;

        if (!hasOwnProperty.call(options, optionName) || options[optionName] === undefined) {
            return defaultValue;
        }
        value = toInteger(options[optionName], optionName);
        if (value < 1 || value > 21) {
            throw new RangeError("Intl.NumberFormat error: " + optionName + " is out of range.");
        }
        return value;
    }

    function readFractionDigitOption(options, optionName, defaultValue) {
        var value;

        if (!hasOwnProperty.call(options, optionName) || options[optionName] === undefined) {
            return defaultValue;
        }
        value = toInteger(options[optionName], optionName);
        if (value < 0 || value > 100) {
            throw new RangeError("Intl.NumberFormat error: " + optionName + " is out of range.");
        }
        return value;
    }

    function validateOptions(options) {
        var style;
        var numberingSystem;
        var minimumIntegerDigits;
        var minimumFractionDigits;
        var maximumFractionDigits;
        var useGrouping;
        var signDisplay;
        var trailingZeroDisplay;
        var currency;
        var currencyDisplay;
        var currencySign;
        var currencyRecord;
        var currencyData;
        var defaultMinimumFractionDigits;
        var defaultMaximumFractionDigits;

        options = Intl.__toObject__(options, "Intl.NumberFormat");
        currencyData = Intl.__getLocaleData__(undefined, "currencies");
        style = options.style === undefined ? "decimal" : String(options.style);
        if (style !== "decimal" && style !== "percent" && style !== "currency") {
            throw new RangeError("Intl.NumberFormat error: style is not supported by this subset.");
        }

        numberingSystem = options.numberingSystem === undefined ? "latn" : String(options.numberingSystem);
        if (numberingSystem !== "latn") {
            throw new RangeError("Intl.NumberFormat error: numberingSystem is not supported by this subset.");
        }

        currency = undefined;
        currencyDisplay = undefined;
        currencyRecord = undefined;
        if (style === "currency") {
            if (options.currency === undefined) {
                throw new RangeError("Intl.NumberFormat error: currency is required for currency style.");
            }
            currency = String(options.currency).toUpperCase();
            if (!hasOwnProperty.call(currencyData, currency)) {
                throw new RangeError("Intl.NumberFormat error: currency is not supported by this subset.");
            }
            currencyDisplay = options.currencyDisplay === undefined ? "symbol" : String(options.currencyDisplay);
            if (currencyDisplay !== "symbol" && currencyDisplay !== "code" && currencyDisplay !== "name") {
                throw new RangeError("Intl.NumberFormat error: currencyDisplay is not supported by this subset.");
            }
            currencySign = options.currencySign === undefined ? "standard" : String(options.currencySign);
            if (currencySign !== "standard" && currencySign !== "accounting") {
                throw new RangeError("Intl.NumberFormat error: currencySign is not supported by this subset.");
            }
            currencyRecord = currencyData[currency];
        }

        minimumIntegerDigits = readIntegerDigitOption(options, "minimumIntegerDigits", 1);
        defaultMinimumFractionDigits = style === "currency" ? currencyRecord.fractionMin : 0;
        defaultMaximumFractionDigits = style === "currency" ? currencyRecord.fractionMax : (style === "percent" ? defaultMinimumFractionDigits : Math.max(defaultMinimumFractionDigits, 3));
        minimumFractionDigits = readFractionDigitOption(options, "minimumFractionDigits", defaultMinimumFractionDigits);
        maximumFractionDigits = readFractionDigitOption(options, "maximumFractionDigits", options.minimumFractionDigits !== undefined && options.maximumFractionDigits === undefined ? minimumFractionDigits : Math.max(minimumFractionDigits, defaultMaximumFractionDigits));
        if (maximumFractionDigits < minimumFractionDigits) {
            throw new RangeError("Intl.NumberFormat error: maximumFractionDigits is out of range.");
        }

        useGrouping = options.useGrouping === undefined ? "auto" : options.useGrouping;
        if (useGrouping !== false) {
            useGrouping = "auto";
        }

        signDisplay = options.signDisplay === undefined ? "auto" : String(options.signDisplay);
        if (signDisplay !== "auto" && signDisplay !== "always" && signDisplay !== "exceptZero" && signDisplay !== "never") {
            throw new RangeError("Intl.NumberFormat error: signDisplay is not supported by this subset.");
        }

        trailingZeroDisplay = options.trailingZeroDisplay === undefined ? "auto" : String(options.trailingZeroDisplay);
        if (trailingZeroDisplay !== "auto" && trailingZeroDisplay !== "stripIfInteger") {
            throw new RangeError("Intl.NumberFormat error: trailingZeroDisplay is not supported by this subset.");
        }

        return {
            style: style,
            numberingSystem: numberingSystem,
            minimumIntegerDigits: minimumIntegerDigits,
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits,
            useGrouping: useGrouping,
            currency: currency,
            currencyDisplay: currencyDisplay,
            currencySign: currencySign,
            signDisplay: signDisplay,
            trailingZeroDisplay: trailingZeroDisplay
        };
    }

    function requireCore() {
        if (typeof Intl.__requireCore__ !== "function") {
            throw new TypeError("Intl.NumberFormat error: Intl-core.js is required.");
        }
        Intl.__requireCore__("Intl.NumberFormat");
    }

    function repeat(character, count) {
        var result = "";

        while (count > 0) {
            result += character;
            count--;
        }
        return result;
    }

    function addGrouping(integerPart, separator, minimumGroupingDigits) {
        var result = "";
        var index;
        var count = 0;

        if (minimumGroupingDigits === 2 && integerPart.length <= 4) {
            return integerPart;
        }
        for (index = integerPart.length - 1; index >= 0; index--) {
            if (count > 0 && count % 3 === 0) {
                result = separator + result;
            }
            result = integerPart.charAt(index) + result;
            count++;
        }
        return result;
    }

    function trimTrailingZeros(fractionPart, minimumFractionDigits) {
        while (fractionPart.length > minimumFractionDigits && fractionPart.charAt(fractionPart.length - 1) === "0") {
            fractionPart = fractionPart.substring(0, fractionPart.length - 1);
        }
        return fractionPart;
    }

    function roundToFixed(number, fractionDigits) {
        var factor = Math.pow(10, fractionDigits);
        var rounded = Math.round((number + 1e-12) * factor) / factor;

        return rounded.toFixed(fractionDigits);
    }

    function currencyName(locale, currency, absoluteValue) {
        var names = Intl.__getLocaleData__(locale, "number").currencyNames;
        var entry = names[currency];

        return entry[Math.abs(absoluteValue) < 2 ? 0 : 1];
    }

    function currencySymbol(locale, currency, currencyDisplay) {
        if (currencyDisplay === "code") {
            return currency;
        }
        var data = Intl.__getLocaleData__(undefined, "currencies")[currency];

        if (data.symbols && data.symbols[locale]) {
            return data.symbols[locale];
        }
        return data.symbol;
    }

    function formatFiniteNumber(number, record) {
        var negative = number < 0 || (number === 0 && (1 / number < 0 || String(record.originalValue) === "-0"));
        var absolute = Math.abs(number);
        if (record.style === "percent") {
            absolute = absolute * 100;
        }
        var fixed = roundToFixed(absolute, record.maximumFractionDigits);
        var dotIndex = fixed.indexOf(".");
        var integerPart = dotIndex === -1 ? fixed : fixed.substring(0, dotIndex);
        var fractionPart = dotIndex === -1 ? "" : fixed.substring(dotIndex + 1);
        var data = Intl.__getLocaleData__(record.locale, "number");
        var formatted;
        var stripFraction = record.trailingZeroDisplay === "stripIfInteger" && /^0*$/.test(fractionPart);

        if (stripFraction) {
            fractionPart = "";
        } else {
            fractionPart = trimTrailingZeros(fractionPart, record.minimumFractionDigits);
        }
        if (!stripFraction && fractionPart.length < record.minimumFractionDigits) {
            fractionPart += repeat("0", record.minimumFractionDigits - fractionPart.length);
        }
        while (integerPart.length < record.minimumIntegerDigits) {
            integerPart = "0" + integerPart;
        }
        if (record.useGrouping !== false) {
            integerPart = addGrouping(integerPart, data.group, data.minimumGroupingDigits);
        }

        formatted = integerPart;
        if (fractionPart.length > 0) {
            formatted += data.decimal + fractionPart;
        }
        if (record.style === "percent") {
            formatted += data.percent;
        } else if (record.style === "currency") {
            var symbol;
            if (record.currencyDisplay === "name") {
                formatted += " " + currencyName(record.locale, record.currency, absolute);
            } else {
                symbol = currencySymbol(record.locale, record.currency, record.currencyDisplay);
                if (data.currencyPattern === "prefix") {
                    formatted = symbol + formatted;
                } else {
                    formatted += "\u00A0" + symbol;
                }
            }
        }
        if (record.signDisplay === "never" || (record.signDisplay === "exceptZero" && number === 0)) {
            return formatted;
        }
        if (negative) {
            if (record.style === "currency" && record.currencySign === "accounting" &&
                    (record.locale === "en-US" || record.locale === "en-GB" || record.locale === "fr-FR")) {
                return "(" + formatted + ")";
            }
            return "-" + formatted;
        }
        if (record.signDisplay === "always" || record.signDisplay === "exceptZero") {
            return "+" + formatted;
        }
        return formatted;
    }

    function NumberFormat(locales, options) {
        var resolvedOptions;

        if (!(this instanceof NumberFormat)) {
            return new NumberFormat(locales, options);
        }

        requireCore();
        resolvedOptions = validateOptions(options);
        this.__locale__ = Intl.__resolveLocale__(locales);
        this.__style__ = resolvedOptions.style;
        this.__numberingSystem__ = resolvedOptions.numberingSystem;
        this.__currency__ = resolvedOptions.currency;
        this.__currencyDisplay__ = resolvedOptions.currencyDisplay;
        this.__currencySign__ = resolvedOptions.currencySign;
        this.__minimumIntegerDigits__ = resolvedOptions.minimumIntegerDigits;
        this.__minimumFractionDigits__ = resolvedOptions.minimumFractionDigits;
        this.__maximumFractionDigits__ = resolvedOptions.maximumFractionDigits;
        this.__useGrouping__ = resolvedOptions.useGrouping;
        this.__signDisplay__ = resolvedOptions.signDisplay;
        this.__trailingZeroDisplay__ = resolvedOptions.trailingZeroDisplay;
    }

    NumberFormat.prototype.format = function (value) {
        var number = Number(value);
        var valueBeforeNumberCoercion = value;
        var record = {
            locale: this.__locale__,
            style: this.__style__,
            currency: this.__currency__,
            currencyDisplay: this.__currencyDisplay__,
            currencySign: this.__currencySign__,
            minimumIntegerDigits: this.__minimumIntegerDigits__,
            minimumFractionDigits: this.__minimumFractionDigits__,
            maximumFractionDigits: this.__maximumFractionDigits__,
            useGrouping: this.__useGrouping__,
            signDisplay: this.__signDisplay__,
            trailingZeroDisplay: this.__trailingZeroDisplay__,
            originalValue: valueBeforeNumberCoercion
        };

        if (isNaN(number)) {
            return this.__style__ === "percent" ? "NaN" + Intl.__getLocaleData__(this.__locale__, "number").percent : "NaN";
        }
        if (number === Infinity) {
            return this.__style__ === "percent" ? "\u221E" + Intl.__getLocaleData__(this.__locale__, "number").percent : "\u221E";
        }
        if (number === -Infinity) {
            return this.__style__ === "percent" ? "-\u221E" + Intl.__getLocaleData__(this.__locale__, "number").percent : "-\u221E";
        }
        return formatFiniteNumber(number, record);
    };

    NumberFormat.prototype.formatRange = function (start, end) {
        var startNumber = Number(start);
        var endNumber = Number(end);

        if (isNaN(startNumber) || isNaN(endNumber)) {
            throw new RangeError("Intl.NumberFormat error: range value must not be NaN.");
        }
        var formattedStart = this.format(start);
        var formattedEnd = this.format(end);

        if (formattedStart === formattedEnd) {
            return "~" + formattedStart;
        }
        return formattedStart + "\u2013" + formattedEnd;
    };
    NumberFormat.prototype.resolvedOptions = function () {
        var options = {
            locale: this.__locale__,
            numberingSystem: this.__numberingSystem__,
            style: this.__style__,
            minimumIntegerDigits: this.__minimumIntegerDigits__,
            minimumFractionDigits: this.__minimumFractionDigits__,
            maximumFractionDigits: this.__maximumFractionDigits__,
            useGrouping: this.__useGrouping__,
            signDisplay: this.__signDisplay__,
            trailingZeroDisplay: this.__trailingZeroDisplay__
        };

        if (this.__style__ === "currency") {
            options.currency = this.__currency__;
            options.currencyDisplay = this.__currencyDisplay__;
            options.currencySign = this.__currencySign__;
        }
        return options;
    };

    NumberFormat.supportedLocalesOf = function (locales, options) {
        requireCore();
        return Intl.__supportedLocalesOf__(locales, undefined, options, "Intl.NumberFormat");
    };

    Intl.NumberFormat = NumberFormat;
}());
