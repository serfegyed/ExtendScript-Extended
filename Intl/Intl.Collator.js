/*
 * Minimal Intl.Collator subset for Adobe ExtendScript.
 *
 * Requires Intl-core.js.
 * Supported in this branch:
 * - usage: sort, search (same compare core)
 * - sensitivity: base, accent, case, variant
 * - ignorePunctuation
 * - caseFirst: false, upper, lower
 */
var Intl = Intl || {};

(function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function requireCore() {
        if (typeof Intl.__requireCore__ !== "function") {
            throw new TypeError("Intl.Collator error: Intl-core.js is required.");
        }
        Intl.__requireCore__("Intl.Collator");
    }

    function validateOptions(options) {
        var usage;
        var sensitivity;
        var ignorePunctuation;
        var numeric;
        var caseFirst;
        var collation;
        var localeMatcher;

        options = Intl.__toObject__(options, "Intl.Collator");

        usage = options.usage === undefined ? "sort" : String(options.usage);
        if (usage !== "sort" && usage !== "search") {
            throw new RangeError("Intl.Collator error: usage is not supported by this subset.");
        }

        sensitivity = options.sensitivity === undefined ? "variant" : String(options.sensitivity);
        if (sensitivity !== "base" && sensitivity !== "accent" && sensitivity !== "case" && sensitivity !== "variant") {
            throw new RangeError("Intl.Collator error: sensitivity is not supported by this subset.");
        }

        ignorePunctuation = options.ignorePunctuation === undefined ? false : Boolean(options.ignorePunctuation);

        numeric = options.numeric === undefined ? false : Boolean(options.numeric);
        if (numeric) {
            throw new RangeError("Intl.Collator error: numeric collation is not supported yet.");
        }

        caseFirst = options.caseFirst === undefined ? "false" : String(options.caseFirst);
        if (caseFirst !== "false" && caseFirst !== "upper" && caseFirst !== "lower") {
            throw new RangeError("Intl.Collator error: caseFirst is not supported by this subset.");
        }

        collation = options.collation === undefined ? "default" : String(options.collation);
        if (collation !== "default" && collation !== "standard") {
            throw new RangeError("Intl.Collator error: collation is not supported by this subset.");
        }

        localeMatcher = options.localeMatcher === undefined ? "best fit" : String(options.localeMatcher);
        if (localeMatcher !== "best fit" && localeMatcher !== "lookup") {
            throw new RangeError("Intl.Collator error: localeMatcher is not supported by this subset.");
        }

        return {
            usage: usage,
            sensitivity: sensitivity,
            ignorePunctuation: ignorePunctuation,
            numeric: false,
            caseFirst: caseFirst,
            collation: "default"
        };
    }

    function isPunctuation(character) {
        var code = character.charCodeAt(0);

        return (code >= 33 && code <= 47) ||
            (code >= 58 && code <= 64) ||
            (code >= 91 && code <= 96) ||
            (code >= 123 && code <= 126);
    }

    function stripPunctuation(value) {
        var result = "";
        var index;
        var character;

        for (index = 0; index < value.length; index++) {
            character = value.charAt(index);
            if (!isPunctuation(character)) {
                result += character;
            }
        }
        return result;
    }

    function lowerCharacter(character) {
        var map = Intl.__getLocaleData__(undefined, "collation").lowercase;

        return hasOwnProperty.call(map, character) ? map[character] : character.toLowerCase();
    }

    function isUpperCaseLetter(character) {
        return lowerCharacter(character) !== character;
    }

    function mappedRecord(character, mapName) {
        var lower = lowerCharacter(character);
        var map = Intl.__getLocaleData__(undefined, "collation")[mapName];

        if (hasOwnProperty.call(map, lower)) {
            return map[lower];
        }
        return { base: lower, accent: 0 };
    }

    function characterRecord(character, locale) {
        return mappedRecord(character, Intl.__getLocaleData__(locale, "collation").recordMap);
    }

    function makeKey(value, locale, ignorePunctuation, caseFirst) {
        var string = String(value);
        var primary = "";
        var accent = "";
        var cssCase = "";
        var index;
        var character;
        var record;

        if (ignorePunctuation) {
            string = stripPunctuation(string);
        }

        for (index = 0; index < string.length; index++) {
            character = string.charAt(index);
            record = characterRecord(character, locale);
            primary += record.base;
            accent += String(record.accent);
            cssCase += isUpperCaseLetter(character) ? (caseFirst === "upper" ? "0" : "1") : (caseFirst === "upper" ? "1" : "0");
        }

        return {
            primary: primary,
            accent: accent,
            cssCase: cssCase,
            original: string
        };
    }

    function compareText(left, right) {
        if (left < right) {
            return -1;
        }
        if (left > right) {
            return 1;
        }
        return 0;
    }

    function compareValues(left, right, locale, options) {
        var leftKey = makeKey(left, locale, options.ignorePunctuation, options.caseFirst);
        var rightKey = makeKey(right, locale, options.ignorePunctuation, options.caseFirst);
        var result;

        result = compareText(leftKey.primary, rightKey.primary);
        if (result !== 0 || options.sensitivity === "base") {
            return result;
        }

        if (options.sensitivity === "accent" || options.sensitivity === "variant") {
            result = compareText(leftKey.accent, rightKey.accent);
            if (result !== 0) {
                return result;
            }
        }

        if (options.sensitivity === "case" || options.sensitivity === "variant") {
            result = compareText(leftKey.cssCase, rightKey.cssCase);
            if (result !== 0) {
                return result;
            }
        }

        return 0;
    }

    function Collator(locales, options) {
        var resolvedOptions;

        if (!(this instanceof Collator)) {
            return new Collator(locales, options);
        }

        requireCore();
        resolvedOptions = validateOptions(options);
        this.__locale__ = Intl.__resolveLocale__(locales, undefined, "en-US");
        this.__usage__ = resolvedOptions.usage;
        this.__sensitivity__ = resolvedOptions.sensitivity;
        this.__ignorePunctuation__ = resolvedOptions.ignorePunctuation;
        this.__collation__ = resolvedOptions.collation;
        this.__numeric__ = resolvedOptions.numeric;
        this.__caseFirst__ = resolvedOptions.caseFirst;
    }

    Collator.prototype.compare = function (a, b) {
        return compareValues(a, b, this.__locale__, {
            sensitivity: this.__sensitivity__,
            ignorePunctuation: this.__ignorePunctuation__,
            caseFirst: this.__caseFirst__
        });
    };

    Collator.prototype.resolvedOptions = function () {
        return {
            locale: this.__locale__,
            usage: this.__usage__,
            sensitivity: this.__sensitivity__,
            ignorePunctuation: this.__ignorePunctuation__,
            collation: this.__collation__,
            numeric: this.__numeric__,
            caseFirst: this.__caseFirst__
        };
    };

    Collator.supportedLocalesOf = function (locales, options) {
        requireCore();
        return Intl.__supportedLocalesOf__(locales, undefined, options, "Intl.Collator");
    };

    Intl.Collator = Collator;
}());
