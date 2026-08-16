/*
 * Minimal Intl core subset for Adobe ExtendScript.
 *
 * Public API:
 * - Intl.getCanonicalLocales(locales)
 * - Intl.supportedValuesOf(key)
 *
 * Internal helpers:
 * - Intl.__canonicalizeLocales__(locales)
 * - Intl.__resolveLocale__(locales, availableLocales, fallbackLocale)
 * - Intl.__supportedLocalesOf__(locales, availableLocales, options, ownerName)
 * - Intl.__getLocaleData__(locale, section)
 * - Intl.__getModuleLocaleData__(moduleName, locale)
 * - Intl.__requireCore__(ownerName, needsCanonicalLocales)
 * - Intl.__toObject__(options, ownerName)
 * - Intl.__readStringOption__(options, name, allowed, defaultValue, ownerName)
 * - Intl.__pad__(value, length)
 */
//@include "../JSON/JSON.parse.js"
var Intl = Intl || {};

(function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var nodeRequire = typeof require === "function" ? require : ((typeof process !== "undefined" && typeof process.getBuiltinModule === "function") ? function (name) { return process.getBuiltinModule(name); } : null);
    var localeAliases = {};
    var languageOnlyLocales = {};
    var availableLocales = { "en-US": true };
    var localeRegistryLoaded = false;
    var localeData = {
        locales: {}
    };
    var moduleLocaleData = {
        DateTimeFormat: {
            "en-US": {
                defaultHourCycle: "h12",
                defaultDateOptions: { year: "numeric", month: "numeric", day: "numeric" },
                weekdays: {
                    "short": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                    "long": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                },
                months: {
                    "short": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    "long": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                }
            }
        },
        DisplayNames: {
            "en-US": {
                regions: {
                    US: "United States",
                    GB: "United Kingdom",
                    DE: "Germany",
                    FR: "France",
                    HU: "Hungary"
                },
                currencies: {
                    USD: "US Dollar",
                    GBP: "British Pound",
                    EUR: "Euro",
                    HUF: "Hungarian Forint"
                },
                languages: {
                    dialect: {
                        en: "English",
                        "en-US": "American English",
                        "en-GB": "British English",
                        de: "German",
                        "de-DE": "German (Germany)",
                        fr: "French",
                        "fr-FR": "French (France)",
                        hu: "Hungarian",
                        "hu-HU": "Hungarian (Hungary)"
                    },
                    standard: {
                        en: "English",
                        "en-US": "English (United States)",
                        "en-GB": "English (United Kingdom)",
                        de: "German",
                        "de-DE": "German (Germany)",
                        fr: "French",
                        "fr-FR": "French (France)",
                        hu: "Hungarian",
                        "hu-HU": "Hungarian (Hungary)"
                    }
                }
            }
        },
        DurationFormat: {
            "en-US": {
                labels: {
                    "short": {
                        years: ["yr", "yrs"],
                        months: ["mth", "mths"],
                        weeks: ["wk", "wks"],
                        days: ["day", "days"],
                        hours: ["hr", "hr"],
                        minutes: ["min", "min"],
                        seconds: ["sec", "sec"],
                        milliseconds: ["ms", "ms"]
                    },
                    "long": {
                        years: ["year", "years"],
                        months: ["month", "months"],
                        weeks: ["week", "weeks"],
                        days: ["day", "days"],
                        hours: ["hour", "hours"],
                        minutes: ["minute", "minutes"],
                        seconds: ["second", "seconds"],
                        milliseconds: ["millisecond", "milliseconds"]
                    },
                    narrow: {
                        years: ["y", "y"],
                        months: ["m", "m"],
                        weeks: ["w", "w"],
                        days: ["d", "d"],
                        hours: ["h", "h"],
                        minutes: ["m", "m"],
                        seconds: ["s", "s"],
                        milliseconds: ["ms", "ms"]
                    }
                },
                spaces: {
                    "short": { "default": " " },
                    "long": { "default": " " },
                    narrow: { "default": "" }
                },
                join: {
                    defaultSeparator: ", ",
                    narrowSeparator: " ",
                    connectorRules: []
                },
                fractionalSeparator: "."
            }
        },
        ListFormat: {
            "en-US": {
                conjunction: {
                    "long": { pair: "{0} and {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, and {1}" },
                    "short": { pair: "{0} & {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, & {1}" },
                    narrow: { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" }
                },
                disjunction: {
                    "long": { pair: "{0} or {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, or {1}" },
                    "short": { pair: "{0} or {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, or {1}" },
                    narrow: { pair: "{0} or {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} or {1}" }
                },
                unit: {
                    "long": { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" },
                    "short": { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" },
                    narrow: { pair: "{0} {1}", start: "{0} {1}", middle: "{0} {1}", end: "{0} {1}" }
                }
            }
        },
        Collator: {
            "en-US": { recordMap: "generic" }
        },
        NumberFormat: {
            "en-US": {
                group: ",",
                decimal: ".",
                percent: "%",
                currencyPattern: "prefix",
                currencyNames: {
                    "EUR": ["euros", "euros"],
                    "USD": ["US dollars", "US dollars"],
                    "GBP": ["British pounds", "British pounds"],
                    "HUF": ["Hungarian forint", "Hungarian forints"]
                }
            }
        },
        RelativeTimeFormat: {
            "en-US": {
          "long": {
                    "past": "{0} {1} ago",
                    "future": "in {0} {1}",
                    "units": {
                              "second": [
                                        "second",
                                        "seconds"
                              ],
                              "minute": [
                                        "minute",
                                        "minutes"
                              ],
                              "hour": [
                                        "hour",
                                        "hours"
                              ],
                              "day": [
                                        "day",
                                        "days"
                              ],
                              "week": [
                                        "week",
                                        "weeks"
                              ],
                              "month": [
                                        "month",
                                        "months"
                              ],
                              "year": [
                                        "year",
                                        "years"
                              ]
                    },
                    "auto": {
                              "day": {
                                        "0": "today",
                                        "1": "tomorrow",
                                        "-1": "yesterday"
                              }
                    }
          },
          "short": {
                    "past": "{0} {1} ago",
                    "future": "in {0} {1}",
                    "units": {
                              "second": [
                                        "sec.",
                                        "sec."
                              ],
                              "minute": [
                                        "min.",
                                        "min."
                              ],
                              "hour": [
                                        "hr.",
                                        "hr."
                              ],
                              "day": [
                                        "day",
                                        "days"
                              ],
                              "week": [
                                        "wk.",
                                        "wk."
                              ],
                              "month": [
                                        "mo.",
                                        "mo."
                              ],
                              "year": [
                                        "yr.",
                                        "yr."
                              ]
                    },
                    "auto": {
                              "day": {
                                        "0": "today",
                                        "1": "tomorrow",
                                        "-1": "yesterday"
                              }
                    }
          },
          "narrow": {
                    "past": "-{0}{1}",
                    "future": "+{0}{1}",
                    "units": {
                              "second": [
                                        "s",
                                        "s"
                              ],
                              "minute": [
                                        "m",
                                        "m"
                              ],
                              "hour": [
                                        "h",
                                        "h"
                              ],
                              "day": [
                                        "d",
                                        "d"
                              ],
                              "week": [
                                        "w",
                                        "w"
                              ],
                              "month": [
                                        "mo",
                                        "mo"
                              ],
                              "year": [
                                        "y",
                                        "y"
                              ]
                    },
                    "auto": {
                              "day": {
                                        "0": "today",
                                        "1": "tomorrow",
                                        "-1": "yesterday"
                              }
                    }
          }
}
        },
        PluralRules: {
            "en-US": {
                cardinal: ["one", "other"],
                ordinal: ["one", "two", "few", "other"]
            }
        }
    };
    var moduleDataFiles = {
        Collation: "Data/Collation.json",
        Collator: "Data/Collator.json",
        Currencies: "Data/Currencies.json",
        DateTimeFormat: "Data/DateTimeFormat.json",
        DisplayNames: "Data/DisplayNames.json",
        DurationFormat: "Data/DurationFormat.json",
        Locales: "Data/Locales.json",
        ListFormat: "Data/ListFormat.json",
        NumberFormat: "Data/NumberFormat.json",
        PluralRules: "Data/PluralRules.json",
        RelativeTimeFormat: "Data/RelativeTimeFormat.json"
    };
    var supportedValues = {
        calendar: ["gregory"],
        collation: ["default", "standard"],
        numberingSystem: ["latn"],
        timeZone: [],
        unit: []
    };


    function isArrayLike(value) {
        return value !== null && typeof value === "object" && typeof value.length === "number";
    }

    function copyObject(source) {
        var result = {};
        var key;

        if (!source) {
            return result;
        }
        for (key in source) {
            if (hasOwnProperty.call(source, key)) {
                result[key] = source[key];
            }
        }
        return result;
    }

    function ensureLocaleRegistry() {
        var registry;
        var locale;

        if (localeRegistryLoaded) {
            return;
        }
        localeRegistryLoaded = true;
        registry = readModuleData("Locales");
        localeAliases = copyObject(registry.aliases);
        languageOnlyLocales = copyObject(registry.languageOnlyLocales);
        availableLocales = copyObject(registry.availableLocales);
        availableLocales["en-US"] = true;

        localeData.locales = {};
        for (locale in availableLocales) {
            if (hasOwnProperty.call(availableLocales, locale)) {
                localeData.locales[locale] = {};
            }
        }
    }

    function canonicalizeLocaleTag(locale) {
        var tag = String(locale);
        var lowerTag = tag.toLowerCase();
        var parts;
        var language;
        var region;

        if (tag === "") {
            throw new RangeError("Intl error: Invalid language tag.");
        }
        ensureLocaleRegistry();
        if (hasOwnProperty.call(localeAliases, lowerTag)) {
            return localeAliases[lowerTag];
        }

        parts = tag.split("-");
        if (parts.length === 1) {
            language = parts[0].toLowerCase();
            return hasOwnProperty.call(languageOnlyLocales, language) ? languageOnlyLocales[language] : language;
        }
        if (parts.length === 2) {
            language = parts[0].toLowerCase();
            region = parts[1].toUpperCase();
            return language + "-" + region;
        }

        throw new RangeError("Intl error: Invalid language tag.");
    }

    function canonicalizeLocales(locales) {
        var result = [];
        var seen = {};
        var locale;
        var canonical;
        var index;

        if (locales === undefined) {
            return result;
        }

        if (typeof locales === "string") {
            canonical = canonicalizeLocaleTag(locales);
            result.push(canonical);
            return result;
        }

        if (!isArrayLike(locales)) {
            throw new TypeError("Intl error: locales must be a string or array-like object.");
        }

        for (index = 0; index < locales.length; index++) {
            locale = locales[index];
            if (locale === undefined) {
                continue;
            }
            canonical = canonicalizeLocaleTag(locale);
            if (!hasOwnProperty.call(seen, canonical)) {
                seen[canonical] = true;
                result.push(canonical);
            }
        }

        return result;
    }

    function normalizeAvailableLocales(locales) {
        var normalized = {};
        var index;

        ensureLocaleRegistry();
        if (locales === undefined) {
            return availableLocales;
        }
        if (typeof locales === "string") {
            normalized[canonicalizeLocaleTag(locales)] = true;
            return normalized;
        }
        if (isArrayLike(locales)) {
            for (index = 0; index < locales.length; index++) {
                if (locales[index] !== undefined) {
                    normalized[canonicalizeLocaleTag(locales[index])] = true;
                }
            }
            return normalized;
        }

        throw new TypeError("Intl error: availableLocales must be a string or array-like object.");
    }

    function resolveLocale(locales, supportedLocales, fallbackLocale) {
        var requested = canonicalizeLocales(locales);
        var available = normalizeAvailableLocales(supportedLocales);
        var fallback = fallbackLocale === undefined ? "en-US" : canonicalizeLocaleTag(fallbackLocale);
        var index;

        for (index = 0; index < requested.length; index++) {
            if (hasOwnProperty.call(available, requested[index])) {
                return requested[index];
            }
        }
        if (hasOwnProperty.call(available, fallback)) {
            return fallback;
        }

        return "en-US";
    }

    function sharedDataModuleName(section) {
        if (section === "currencies") {
            return "Currencies";
        }
        if (section === "collation") {
            return "Collation";
        }
        return null;
    }

    function getSharedLocaleData(section) {
        var moduleName = sharedDataModuleName(section);

        if (moduleName !== null && localeData[section] === undefined) {
            localeData[section] = readModuleData(moduleName);
        }
        return localeData[section];
    }

    function getLocaleData(locale, section) {
        var data;

        if (locale === undefined || locale === null) {
            if (section !== undefined) {
                return getSharedLocaleData(section);
            }
            return localeData;
        }
        data = localeData.locales[canonicalizeLocaleTag(locale)];
        if (data === undefined) {
            return undefined;
        }
        return section === undefined ? data : data[section];
    }

    function copyModuleLocaleRecord(record, locale) {
        var result = {};
        var key;

        for (key in record) {
            if (hasOwnProperty.call(record, key)) {
                result[key] = record[key];
            }
        }
        result.__locale__ = locale;
        return result;
    }

    function readModuleDataText(moduleName) {
        var relativePath = moduleDataFiles[moduleName];
        var fs;
        var path;
        var candidates;
        var index;
        var file;
        var text;
        var base;

        if (relativePath === undefined) {
            return null;
        }

        if (nodeRequire !== null) {
            try {
                fs = nodeRequire("fs");
                path = nodeRequire("path");
                candidates = [];
                if (typeof __dirname !== "undefined") {
                    candidates.push(path.join(__dirname, "..", relativePath));
                    candidates.push(path.join(__dirname, relativePath));
                }
                if (typeof process !== "undefined" && process.cwd) {
                    candidates.push(path.join(process.cwd(), relativePath));
                    candidates.push(path.join(process.cwd(), "..", relativePath));
                }
                for (index = 0; index < candidates.length; index++) {
                    if (fs.existsSync(candidates[index])) {
                        return fs.readFileSync(candidates[index], "utf8");
                    }
                }
            } catch (ignoreNodeFileError) {
            }
        }

        if (typeof $ !== "undefined" && typeof File === "function") {
            candidates = [];
            if (typeof $ !== "undefined" && $.fileName) {
                base = File($.fileName).parent;
                candidates.push(base + "/" + relativePath);
                candidates.push(base + "/../" + relativePath);
            }
            candidates.push(relativePath);
            candidates.push("../" + relativePath);

            for (index = 0; index < candidates.length; index++) {
                file = File(candidates[index]);
                if (file.exists) {
                    if (!file.open("r")) {
                        return null;
                    }
                    text = file.read();
                    file.close();
                    return text;
                }
            }
        }

        return null;
    }

    function readModuleData(moduleName) {
        var text = readModuleDataText(moduleName);

        if (text === null || typeof JSON === "undefined" || typeof JSON.parse !== "function") {
            return {};
        }
        try {
            return JSON.parse(text);
        } catch (ignoreJSONError) {
            return {};
        }
    }
    function getModuleLocaleData(moduleName, locale) {
        var moduleBaseline = moduleLocaleData[moduleName];
        var baseline;
        var canonical;
        var moduleData;

        if (moduleBaseline === undefined || moduleBaseline["en-US"] === undefined) {
            throw new Error("Intl error: Missing en-US baseline data for " + moduleName + ".");
        }

        baseline = moduleBaseline["en-US"];
        canonical = locale === undefined || locale === null ? "en-US" : canonicalizeLocaleTag(locale);
        if (canonical === "en-US") {
            return copyModuleLocaleRecord(baseline, "en-US");
        }

        moduleData = readModuleData(moduleName);
        if (moduleData && hasOwnProperty.call(moduleData, canonical)) {
            return copyModuleLocaleRecord(moduleData[canonical], canonical);
        }

        return copyModuleLocaleRecord(baseline, "en-US");
    }
    function supportedLocalesOf(locales, supportedLocales, options, ownerName) {
        var requested = canonicalizeLocales(locales);
        var available = normalizeAvailableLocales(supportedLocales);
        var result = [];
        var localeMatcher;
        var index;

        options = toObject(options, ownerName || "Intl");
        localeMatcher = options.localeMatcher === undefined ? "best fit" : String(options.localeMatcher);
        if (localeMatcher !== "best fit" && localeMatcher !== "lookup") {
            throw new RangeError((ownerName || "Intl") + " error: localeMatcher is not supported by this subset.");
        }

        for (index = 0; index < requested.length; index++) {
            if (hasOwnProperty.call(available, requested[index])) {
                result.push(requested[index]);
            }
        }
        return result;
    }

    function requireCore(ownerName, needsCanonicalLocales) {
        if (typeof Intl.__resolveLocale__ !== "function" ||
                typeof Intl.__getLocaleData__ !== "function" ||
                (needsCanonicalLocales && typeof Intl.__canonicalizeLocales__ !== "function")) {
            throw new TypeError(ownerName + " error: Intl-core.js is required.");
        }
    }

    function toObject(options, ownerName) {
        if (options === undefined) {
            return {};
        }
        if (options === null || typeof options !== "object") {
            throw new TypeError(ownerName + " error: options must be an object.");
        }
        return options;
    }

    function readStringOption(options, name, allowed, defaultValue, ownerName) {
        var value;
        var index;

        if (!hasOwnProperty.call(options, name) || options[name] === undefined) {
            return defaultValue;
        }
        value = String(options[name]);
        for (index = 0; index < allowed.length; index++) {
            if (value === allowed[index]) {
                return value;
            }
        }
        throw new RangeError(ownerName + " error: " + name + " is not supported by this subset.");
    }

    function pad(value, length) {
        var result = String(Math.abs(value));

        while (result.length < length) {
            result = "0" + result;
        }
        return result;
    }

    function supportedValuesOf(key) {
        var value = key === undefined || key === null ? "" : String(key);
        var list = hasOwnProperty.call(supportedValues, value) ? supportedValues[value] : [];
        var result = [];
        var index;
        var data;
        var code;

        if (value === "currency") {
            data = getSharedLocaleData("currencies");
            for (code in data) {
                if (hasOwnProperty.call(data, code)) {
                    result.push(code);
                }
            }
            result.sort();
            return result;
        }

        for (index = 0; index < list.length; index++) {
            result.push(list[index]);
        }
        return result;
    }

    Intl.__canonicalizeLocales__ = canonicalizeLocales;
    Intl.__resolveLocale__ = resolveLocale;
    Intl.__supportedLocalesOf__ = supportedLocalesOf;
    Intl.__getLocaleData__ = getLocaleData;
    Intl.__getModuleLocaleData__ = getModuleLocaleData;
    Intl.__requireCore__ = requireCore;
    Intl.__toObject__ = toObject;
    Intl.__readStringOption__ = readStringOption;
    Intl.__pad__ = pad;

    if (!Intl.getCanonicalLocales) {
        Intl.getCanonicalLocales = canonicalizeLocales;
    }
    Intl.supportedValuesOf = supportedValuesOf;
}());

