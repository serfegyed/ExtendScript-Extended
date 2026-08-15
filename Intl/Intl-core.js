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
 * - Intl.__requireCore__(ownerName, needsCanonicalLocales)
 * - Intl.__toObject__(options, ownerName)
 * - Intl.__readStringOption__(options, name, allowed, defaultValue, ownerName)
 * - Intl.__pad__(value, length)
 */
var Intl = Intl || {};

(function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var localeAliases = {
        "en-uk": "en-GB"
    };
    var languageOnlyLocales = {
        "en": "en",
        "de": "de",
        "fr": "fr",
        "hu": "hu"
    };
    var availableLocales = {
        "en-US": true,
        "en-GB": true,
        "de-DE": true,
        "fr-FR": true,
        "hu-HU": true
    };
    var localeData = {
        locales: {
            "en-US": {
                number: {
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
                },
                dateTime: {
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
                },
                collation: { recordMap: "generic" },
                listFormat: {
                    conjunction: {
                        "long": { pair: "{0} and {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, and {1}" },
                        "short": { pair: "{0} & {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, & {1}" },
                        "narrow": { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" }
                    },
                    disjunction: {
                        "long": { pair: "{0} or {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, or {1}" },
                        "short": { pair: "{0} or {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, or {1}" },
                        "narrow": { pair: "{0} or {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, or {1}" }
                    },
                    unit: {
                        "long": { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" },
                        "short": { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" },
                        "narrow": { pair: "{0} {1}", start: "{0} {1}", middle: "{0} {1}", end: "{0} {1}" }
                    }
                }
            },
            "en-GB": {
                number: {
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
                },
                dateTime: {
                    defaultHourCycle: "h23",
                    defaultDateOptions: { year: "numeric", month: "2-digit", day: "2-digit" },
                    weekdays: {
                        "short": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        "long": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                    },
                    months: {
                        "short": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        "long": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                    }
                },
                collation: { recordMap: "generic" },
                listFormat: {
                    conjunction: {
                        "long": { pair: "{0} and {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} and {1}" },
                        "short": { pair: "{0} and {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} and {1}" },
                        "narrow": { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" }
                    },
                    disjunction: {
                        "long": { pair: "{0} or {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} or {1}" },
                        "short": { pair: "{0} or {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} or {1}" },
                        "narrow": { pair: "{0} or {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} or {1}" }
                    },
                    unit: {
                        "long": { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" },
                        "short": { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" },
                        "narrow": { pair: "{0} {1}", start: "{0} {1}", middle: "{0} {1}", end: "{0} {1}" }
                    }
                }
            },
            "de-DE": {
                number: {
                    group: ".",
                    decimal: ",",
                    percent: "\u00A0%",
                    currencyPattern: "suffix",
                    currencyNames: {
                        "EUR": ["Euro", "Euro"],
                        "USD": ["US-Dollar", "US-Dollar"],
                        "GBP": ["Britische Pfund", "Britische Pfund"],
                        "HUF": ["Ungarischer Forint", "Ungarische Forint"]
                    }
                },
                dateTime: {
                    defaultHourCycle: "h23",
                    defaultDateOptions: { year: "numeric", month: "numeric", day: "numeric" },
                    weekdays: {
                        "short": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                        "long": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"]
                    },
                    months: {
                        "short": ["Jan.", "Feb.", "M\u00E4rz", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."],
                        "long": ["Januar", "Februar", "M\u00E4rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
                    }
                },
                collation: { recordMap: "generic" },
                listFormat: {
                    conjunction: {
                        "long": { pair: "{0} und {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} und {1}" },
                        "short": { pair: "{0} und {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} und {1}" },
                        "narrow": { pair: "{0} und {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} und {1}" }
                    },
                    disjunction: {
                        "long": { pair: "{0} oder {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} oder {1}" },
                        "short": { pair: "{0} oder {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} oder {1}" },
                        "narrow": { pair: "{0} oder {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} oder {1}" }
                    },
                    unit: {
                        "long": { pair: "{0} und {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} und {1}" },
                        "short": { pair: "{0} und {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} und {1}" },
                        "narrow": { pair: "{0} und {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} und {1}" }
                    }
                }
            },
            "fr-FR": {
                number: {
                    group: "\u00A0",
                    decimal: ",",
                    percent: "\u00A0%",
                    currencyPattern: "suffix",
                    currencyNames: {
                        "EUR": ["euro", "euros"],
                        "USD": ["dollar des \u00C9tats-Unis", "dollars des \u00C9tats-Unis"],
                        "GBP": ["livre sterling", "livres sterling"],
                        "HUF": ["forint hongrois", "forints hongrois"]
                    }
                },
                dateTime: {
                    defaultHourCycle: "h23",
                    defaultDateOptions: { year: "numeric", month: "2-digit", day: "2-digit" },
                    weekdays: {
                        "short": ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
                        "long": ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
                    },
                    months: {
                        "short": ["janv.", "f\u00E9vr.", "mars", "avr.", "mai", "juin", "juil.", "ao\u00FBt", "sept.", "oct.", "nov.", "d\u00E9c."],
                        "long": ["janvier", "f\u00E9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\u00FBt", "septembre", "octobre", "novembre", "d\u00E9cembre"]
                    }
                },
                collation: { recordMap: "generic" },
                listFormat: {
                    conjunction: {
                        "long": { pair: "{0} et {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} et {1}" },
                        "short": { pair: "{0} et {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} et {1}" },
                        "narrow": { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" }
                    },
                    disjunction: {
                        "long": { pair: "{0} ou {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} ou {1}" },
                        "short": { pair: "{0} ou {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} ou {1}" },
                        "narrow": { pair: "{0} ou {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} ou {1}" }
                    },
                    unit: {
                        "long": { pair: "{0} et {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} et {1}" },
                        "short": { pair: "{0} et {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} et {1}" },
                        "narrow": { pair: "{0} {1}", start: "{0} {1}", middle: "{0} {1}", end: "{0} {1}" }
                    }
                }
            },
            "hu-HU": {
                number: {
                    group: "\u00A0",
                    decimal: ",",
                    percent: "%",
                    currencyPattern: "suffix",
                    minimumGroupingDigits: 2,
                    currencyNames: {
                        "EUR": ["eur\u00F3", "eur\u00F3"],
                        "USD": ["USA-doll\u00E1r", "USA-doll\u00E1r"],
                        "GBP": ["angol font", "angol font"],
                        "HUF": ["magyar forint", "magyar forint"]
                    }
                },
                dateTime: {
                    defaultHourCycle: "h23",
                    defaultDateOptions: { year: "numeric", month: "2-digit", day: "2-digit" },
                    weekdays: {
                        "short": ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
                        "long": ["vas\u00E1rnap", "h\u00E9tf\u0151", "kedd", "szerda", "cs\u00FCt\u00F6rt\u00F6k", "p\u00E9ntek", "szombat"]
                    },
                    months: {
                        "short": ["jan.", "febr.", "m\u00E1rc.", "\u00E1pr.", "m\u00E1j.", "j\u00FAn.", "j\u00FAl.", "aug.", "szept.", "okt.", "nov.", "dec."],
                        "long": ["janu\u00E1r", "febru\u00E1r", "m\u00E1rcius", "\u00E1prilis", "m\u00E1jus", "j\u00FAnius", "j\u00FAlius", "augusztus", "szeptember", "okt\u00F3ber", "november", "december"]
                    }
                },
                collation: { recordMap: "hungarian" },
                listFormat: {
                    conjunction: {
                        "long": { pair: "{0} \u00E9s {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} \u00E9s {1}" },
                        "short": { pair: "{0} & {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} & {1}" },
                        "narrow": { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" }
                    },
                    disjunction: {
                        "long": { pair: "{0} vagy {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} vagy {1}" },
                        "short": { pair: "{0} vagy {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} vagy {1}" },
                        "narrow": { pair: "{0}/{1}", start: "{0}/{1}", middle: "{0}/{1}", end: "{0}/{1}" }
                    },
                    unit: {
                        "long": { pair: "{0} \u00E9s {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0} \u00E9s {1}" },
                        "short": { pair: "{0}, {1}", start: "{0}, {1}", middle: "{0}, {1}", end: "{0}, {1}" },
                        "narrow": { pair: "{0} {1}", start: "{0} {1}", middle: "{0} {1}", end: "{0} {1}" }
                    }
                }
            }
        },
        currencies: {
            "EUR": { symbol: "\u20AC", symbols: { "hu-HU": "EUR" }, fractionMin: 2, fractionMax: 2 },
            "USD": { symbol: "$", symbols: { "en-GB": "US$", "fr-FR": "$US", "hu-HU": "USD" }, fractionMin: 2, fractionMax: 2 },
            "GBP": { symbol: "\u00A3", symbols: { "fr-FR": "\u00A3GB", "hu-HU": "GBP" }, fractionMin: 2, fractionMax: 2 },
            "HUF": { symbol: "HUF", symbols: { "hu-HU": "Ft" }, fractionMin: 0, fractionMax: 2 }
        },
        pluralRules: {
            "en-US": {
                cardinal: ["one", "other"],
                ordinal: ["one", "two", "few", "other"]
            },
            "en-GB": {
                cardinal: ["one", "other"],
                ordinal: ["one", "two", "few", "other"]
            },
            "de-DE": {
                cardinal: ["one", "other"],
                ordinal: ["other"]
            },
            "fr-FR": {
                cardinal: ["one", "many", "other"],
                ordinal: ["one", "other"]
            },
            "hu-HU": {
                cardinal: ["one", "other"],
                ordinal: ["one", "other"]
            }
        },
        displayNames: {
            regions: {
                    "en-US": {
                        US: "United States",
                        GB: "United Kingdom",
                        DE: "Germany",
                        FR: "France",
                        HU: "Hungary"
                    },
                    "en-GB": {
                        US: "United States",
                        GB: "United Kingdom",
                        DE: "Germany",
                        FR: "France",
                        HU: "Hungary"
                    },
                    "de-DE": {
                        US: "Vereinigte Staaten",
                        GB: "Vereinigtes K\u00F6nigreich",
                        DE: "Deutschland",
                        FR: "Frankreich",
                        HU: "Ungarn"
                    },
                    "fr-FR": {
                        US: "\u00C9tats-Unis",
                        GB: "Royaume-Uni",
                        DE: "Allemagne",
                        FR: "France",
                        HU: "Hongrie"
                    },
                    "hu-HU": {
                        US: "Egyes\u00FClt \u00C1llamok",
                        GB: "Egyes\u00FClt Kir\u00E1lys\u00E1g",
                        DE: "N\u00E9metorsz\u00E1g",
                        FR: "Franciaorsz\u00E1g",
                        HU: "Magyarorsz\u00E1g"
                    }
                },
            currencies: {
                    "en-US": {
                        USD: "US Dollar",
                        GBP: "British Pound",
                        EUR: "Euro",
                        HUF: "Hungarian Forint"
                    },
                    "en-GB": {
                        USD: "US Dollar",
                        GBP: "British Pound",
                        EUR: "Euro",
                        HUF: "Hungarian Forint"
                    },
                    "de-DE": {
                        USD: "US-Dollar",
                        GBP: "Britisches Pfund",
                        EUR: "Euro",
                        HUF: "Ungarischer Forint"
                    },
                    "fr-FR": {
                        USD: "dollar des \u00C9tats-Unis",
                        GBP: "livre sterling",
                        EUR: "euro",
                        HUF: "forint hongrois"
                    },
                    "hu-HU": {
                        USD: "USA-doll\u00E1r",
                        GBP: "angol font",
                        EUR: "eur\u00F3",
                        HUF: "magyar forint"
                    }
                },
            languages: {
                    dialect: {
                        "en-US": {
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
                        "en-GB": {
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
                        "de-DE": {
                            en: "Englisch",
                            "en-US": "Englisch (Vereinigte Staaten)",
                            "en-GB": "Englisch (Vereinigtes K\u00F6nigreich)",
                            de: "Deutsch",
                            "de-DE": "Deutsch (Deutschland)",
                            fr: "Franz\u00F6sisch",
                            "fr-FR": "Franz\u00F6sisch (Frankreich)",
                            hu: "Ungarisch",
                            "hu-HU": "Ungarisch (Ungarn)"
                        },
                        "fr-FR": {
                            en: "anglais",
                            "en-US": "anglais am\u00E9ricain",
                            "en-GB": "anglais britannique",
                            de: "allemand",
                            "de-DE": "allemand (Allemagne)",
                            fr: "fran\u00E7ais",
                            "fr-FR": "fran\u00E7ais (France)",
                            hu: "hongrois",
                            "hu-HU": "hongrois (Hongrie)"
                        },
                        "hu-HU": {
                            en: "angol",
                            "en-US": "amerikai angol",
                            "en-GB": "brit angol",
                            de: "n\u00E9met",
                            "de-DE": "n\u00E9met (N\u00E9metorsz\u00E1g)",
                            fr: "francia",
                            "fr-FR": "francia (Franciaorsz\u00E1g)",
                            hu: "magyar",
                            "hu-HU": "magyar (Magyarorsz\u00E1g)"
                        }
                    },
                    standard: {
                        "en-US": {
                            en: "English",
                            "en-US": "English (United States)",
                            "en-GB": "English (United Kingdom)",
                            de: "German",
                            "de-DE": "German (Germany)",
                            fr: "French",
                            "fr-FR": "French (France)",
                            hu: "Hungarian",
                            "hu-HU": "Hungarian (Hungary)"
                        },
                        "en-GB": {
                            en: "English",
                            "en-US": "English (United States)",
                            "en-GB": "English (United Kingdom)",
                            de: "German",
                            "de-DE": "German (Germany)",
                            fr: "French",
                            "fr-FR": "French (France)",
                            hu: "Hungarian",
                            "hu-HU": "Hungarian (Hungary)"
                        },
                        "de-DE": {
                            en: "Englisch",
                            "en-US": "Englisch (Vereinigte Staaten)",
                            "en-GB": "Englisch (Vereinigtes K\u00F6nigreich)",
                            de: "Deutsch",
                            "de-DE": "Deutsch (Deutschland)",
                            fr: "Franz\u00F6sisch",
                            "fr-FR": "Franz\u00F6sisch (Frankreich)",
                            hu: "Ungarisch",
                            "hu-HU": "Ungarisch (Ungarn)"
                        },
                        "fr-FR": {
                            en: "anglais",
                            "en-US": "anglais (\u00C9tats-Unis)",
                            "en-GB": "anglais (Royaume-Uni)",
                            de: "allemand",
                            "de-DE": "allemand (Allemagne)",
                            fr: "fran\u00E7ais",
                            "fr-FR": "fran\u00E7ais (France)",
                            hu: "hongrois",
                            "hu-HU": "hongrois (Hongrie)"
                        },
                        "hu-HU": {
                            en: "angol",
                            "en-US": "angol (Egyes\u00FClt \u00C1llamok)",
                            "en-GB": "angol (Egyes\u00FClt Kir\u00E1lys\u00E1g)",
                            de: "n\u00E9met",
                            "de-DE": "n\u00E9met (N\u00E9metorsz\u00E1g)",
                            fr: "francia",
                            "fr-FR": "francia (Franciaorsz\u00E1g)",
                            hu: "magyar",
                            "hu-HU": "magyar (Magyarorsz\u00E1g)"
                        }
                    }
                }
        },
        durationUnitLabels: {
            "short": {
                "en-US": {
                    years: ["yr", "yrs"],
                    months: ["mth", "mths"],
                    weeks: ["wk", "wks"],
                    days: ["day", "days"],
                    hours: ["hr", "hr"],
                    minutes: ["min", "min"],
                    seconds: ["sec", "sec"],
                    milliseconds: ["ms", "ms"]
                },
                "en-GB": {
                    years: ["yr", "yrs"],
                    months: ["mth", "mths"],
                    weeks: ["wk", "wks"],
                    days: ["day", "days"],
                    hours: ["hr", "hrs"],
                    minutes: ["min", "mins"],
                    seconds: ["sec", "secs"],
                    milliseconds: ["ms", "ms"]
                },
                "de-DE": {
                    years: ["J", "J"],
                    months: ["Mon.", "Mon."],
                    weeks: ["Wo.", "Wo."],
                    days: ["Tg.", "Tg."],
                    hours: ["Std.", "Std."],
                    minutes: ["Min.", "Min."],
                    seconds: ["Sek.", "Sek."],
                    milliseconds: ["ms", "ms"]
                },
                "fr-FR": {
                    years: ["an", "ans"],
                    months: ["m.", "m."],
                    weeks: ["sem.", "sem."],
                    days: ["j", "j"],
                    hours: ["h", "h"],
                    minutes: ["min", "min"],
                    seconds: ["s", "s"],
                    milliseconds: ["ms", "ms"]
                },
                "hu-HU": {
                    years: ["\u00E9v", "\u00E9v"],
                    months: ["h\u00F3nap", "h\u00F3nap"],
                    weeks: ["h\u00E9t", "h\u00E9t"],
                    days: ["nap", "nap"],
                    hours: ["\u00F3", "\u00F3"],
                    minutes: ["p", "p"],
                    seconds: ["mp", "mp"],
                    milliseconds: ["ms", "ms"]
                }
            },
            "long": {
                "en-US": {
                    years: ["year", "years"],
                    months: ["month", "months"],
                    weeks: ["week", "weeks"],
                    days: ["day", "days"],
                    hours: ["hour", "hours"],
                    minutes: ["minute", "minutes"],
                    seconds: ["second", "seconds"],
                    milliseconds: ["millisecond", "milliseconds"]
                },
                "en-GB": {
                    years: ["year", "years"],
                    months: ["month", "months"],
                    weeks: ["week", "weeks"],
                    days: ["day", "days"],
                    hours: ["hour", "hours"],
                    minutes: ["minute", "minutes"],
                    seconds: ["second", "seconds"],
                    milliseconds: ["millisecond", "milliseconds"]
                },
                "de-DE": {
                    years: ["Jahr", "Jahre"],
                    months: ["Monat", "Monate"],
                    weeks: ["Woche", "Wochen"],
                    days: ["Tag", "Tage"],
                    hours: ["Stunde", "Stunden"],
                    minutes: ["Minute", "Minuten"],
                    seconds: ["Sekunde", "Sekunden"],
                    milliseconds: ["Millisekunde", "Millisekunden"]
                },
                "fr-FR": {
                    years: ["an", "ans"],
                    months: ["mois", "mois"],
                    weeks: ["semaine", "semaines"],
                    days: ["jour", "jours"],
                    hours: ["heure", "heures"],
                    minutes: ["minute", "minutes"],
                    seconds: ["seconde", "secondes"],
                    milliseconds: ["milliseconde", "millisecondes"]
                },
                "hu-HU": {
                    years: ["\u00E9v", "\u00E9v"],
                    months: ["h\u00F3nap", "h\u00F3nap"],
                    weeks: ["h\u00E9t", "h\u00E9t"],
                    days: ["nap", "nap"],
                    hours: ["\u00F3ra", "\u00F3ra"],
                    minutes: ["perc", "perc"],
                    seconds: ["m\u00E1sodperc", "m\u00E1sodperc"],
                    milliseconds: ["ezredm\u00E1sodperc", "ezredm\u00E1sodperc"]
                }
            },
            "narrow": {
                "en-US": {
                    years: ["y", "y"],
                    months: ["m", "m"],
                    weeks: ["w", "w"],
                    days: ["d", "d"],
                    hours: ["h", "h"],
                    minutes: ["m", "m"],
                    seconds: ["s", "s"],
                    milliseconds: ["ms", "ms"]
                },
                "en-GB": {
                    years: ["y", "y"],
                    months: ["m", "m"],
                    weeks: ["w", "w"],
                    days: ["d", "d"],
                    hours: ["h", "h"],
                    minutes: ["m", "m"],
                    seconds: ["s", "s"],
                    milliseconds: ["ms", "ms"]
                },
                "de-DE": {
                    years: ["J", "J"],
                    months: ["M", "M"],
                    weeks: ["W", "W"],
                    days: ["T", "T"],
                    hours: ["h", "h"],
                    minutes: ["Min.", "Min."],
                    seconds: ["Sek.", "Sek."],
                    milliseconds: ["ms", "ms"]
                },
                "fr-FR": {
                    years: ["a", "a"],
                    months: ["m.", "m."],
                    weeks: ["sem.", "sem."],
                    days: ["j", "j"],
                    hours: ["h", "h"],
                    minutes: ["min", "min"],
                    seconds: ["s", "s"],
                    milliseconds: ["ms", "ms"]
                },
                "hu-HU": {
                    years: ["\u00E9v", "\u00E9v"],
                    months: ["h.", "h."],
                    weeks: ["h\u00E9t", "h\u00E9t"],
                    days: ["nap", "nap"],
                    hours: ["\u00F3", "\u00F3"],
                    minutes: ["p", "p"],
                    seconds: ["mp", "mp"],
                    milliseconds: ["ms", "ms"]
                }
            }
        },
        collation: {
            lowercase: {
                "A": "a", "B": "b", "C": "c", "D": "d", "E": "e", "F": "f", "G": "g", "H": "h", "I": "i", "J": "j", "K": "k", "L": "l", "M": "m",
                "N": "n", "O": "o", "P": "p", "Q": "q", "R": "r", "S": "s", "T": "t", "U": "u", "V": "v", "W": "w", "X": "x", "Y": "y", "Z": "z",
                "\u00C0": "\u00E0", "\u00C1": "\u00E1", "\u00C2": "\u00E2", "\u00C4": "\u00E4", "\u00C7": "\u00E7", "\u00C8": "\u00E8", "\u00C9": "\u00E9", "\u00CA": "\u00EA",
                "\u00CD": "\u00ED", "\u00D3": "\u00F3", "\u00D6": "\u00F6", "\u0150": "\u0151", "\u00DA": "\u00FA", "\u00DC": "\u00FC", "\u0170": "\u0171"
            },
            generic: {
                "\u00E0": { base: "a", accent: 1 },
                "\u00E1": { base: "a", accent: 1 },
                "\u00E2": { base: "a", accent: 1 },
                "\u00E4": { base: "a", accent: 1 },
                "\u00E7": { base: "c", accent: 1 },
                "\u00E8": { base: "e", accent: 1 },
                "\u00E9": { base: "e", accent: 1 },
                "\u00EA": { base: "e", accent: 1 },
                "\u00ED": { base: "i", accent: 1 },
                "\u00F3": { base: "o", accent: 1 },
                "\u00F6": { base: "o", accent: 1 },
                "\u0151": { base: "o", accent: 1 },
                "\u00FA": { base: "u", accent: 1 },
                "\u00FC": { base: "u", accent: 1 },
                "\u0171": { base: "u", accent: 1 }
            },
            hungarian: {
                "\u00E1": { base: "a", accent: 1 },
                "\u00E9": { base: "e", accent: 1 },
                "\u00ED": { base: "i", accent: 1 },
                "\u00F3": { base: "o", accent: 1 },
                "\u00F6": { base: "oz", accent: 0 },
                "\u0151": { base: "oz", accent: 1 },
                "\u00FA": { base: "u", accent: 1 },
                "\u00FC": { base: "uz", accent: 0 },
                "\u0171": { base: "uz", accent: 1 }
            }
        }
    };
    var supportedValues = {
        calendar: ["gregory"],
        collation: ["default", "standard"],
        currency: ["EUR", "GBP", "HUF", "USD"],
        numberingSystem: ["latn"],
        timeZone: [],
        unit: []
    };


    function isArrayLike(value) {
        return value !== null && typeof value === "object" && typeof value.length === "number";
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

    function getLocaleData(locale, section) {
        var data;

        if (locale === undefined || locale === null) {
            data = localeData;
        } else {
            data = localeData.locales[canonicalizeLocaleTag(locale)];
        }
        if (data === undefined) {
            return undefined;
        }
        return section === undefined ? data : data[section];
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

        for (index = 0; index < list.length; index++) {
            result.push(list[index]);
        }
        return result;
    }

    Intl.__canonicalizeLocales__ = canonicalizeLocales;
    Intl.__resolveLocale__ = resolveLocale;
    Intl.__supportedLocalesOf__ = supportedLocalesOf;
    Intl.__getLocaleData__ = getLocaleData;
    Intl.__requireCore__ = requireCore;
    Intl.__toObject__ = toObject;
    Intl.__readStringOption__ = readStringOption;
    Intl.__pad__ = pad;

    if (!Intl.getCanonicalLocales) {
        Intl.getCanonicalLocales = canonicalizeLocales;
    }
    Intl.supportedValuesOf = supportedValuesOf;
}());

