/*
 * Intl.DateTimeFormat subset tests for ESTK and Node.js.
 */
//@include "../../ExtendScript-Extended/Tools/Console/console.js"
//@include "../Intl-core.js"
//@include "../Intl.DateTimeFormat.js"

var isNodeRuntime = typeof require === "function" &&
    typeof process !== "undefined" && process.versions && process.versions.node;
var nodeIntl;

if (isNodeRuntime) {
    nodeIntl = Intl;
    Intl = undefined;

    (function () {
        var fs = require("fs");
        var path = require("path");

        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl-core.js"), "utf8"));
        (0, eval)(fs.readFileSync(path.join(__dirname, "..", "Intl.DateTimeFormat.js"), "utf8"));
    }());
}

(function () {
    var passed = 0;
    var failed = 0;
    var sampleDate = new Date(2026, 6, 15, 12, 34, 56, 123);
    var sampleTime = sampleDate.getTime();
    var sampleObject = { year: 2026, month: 7, day: 15 };

    function writeLine(message) {
        if (typeof console !== "undefined" && console.log) {
            console.log(message);
        } else if (typeof $ !== "undefined" && $.writeln) {
            $.writeln(message);
        }
    }

    function fail(message) {
        throw new Error(message);
    }

    function assert(condition, message) {
        if (!condition) fail(message || "Assertion failed");
    }

    function assertEquals(actual, expected, message) {
        if (actual !== expected) {
            fail((message || "Values are not equal") +
                "\n  expected: " + expected +
                "\n  actual:   " + actual);
        }
    }

    function partsToText(parts) {
        var text = "";
        var index;

        for (index = 0; index < parts.length; index++) {
            text += parts[index].value;
        }
        return text;
    }

    function assertThrowsWith(fn, expectedName, message) {
        try {
            fn();
        } catch (error) {
            if (isNodeRuntime) {
                assertEquals(error.name, expectedName, message || "Unexpected error name");
            }
            return;
        }
        fail(message || "Expected function to throw");
    }

    function test(name, fn) {
        try {
            fn();
            passed++;
            writeLine("[PASS] " + name);
        } catch (error) {
            failed++;
            writeLine("[FAIL] " + name);
            writeLine("       " + error);
        }
    }

    writeLine("Intl.DateTimeFormat subset tests");
    writeLine("--------------------------------");

    test("constructor works with and without new", function () {
        var withNew = new Intl.DateTimeFormat("de-DE");
        var withoutNew = Intl.DateTimeFormat("de-DE");

        assert(withNew instanceof Intl.DateTimeFormat, "new should create DateTimeFormat");
        assert(withoutNew instanceof Intl.DateTimeFormat, "call should create DateTimeFormat");
        assertEquals(withNew.format(sampleDate), "15.7.2026", "new formatter output");
        assertEquals(withoutNew.format(sampleDate), "15.7.2026", "called formatter output");
    });

    test("supportedLocalesOf reports implemented locales", function () {
        assertEquals(typeof Intl.DateTimeFormat.supportedLocalesOf, "function", "static method exists");
        assertEquals(Intl.DateTimeFormat.supportedLocalesOf(["hu-hu", "banana", "en-UK", "hu-HU"], { localeMatcher: "lookup" }).join("|"), "hu-HU|en-GB", "filters supported locales");
        assertEquals(Intl.DateTimeFormat.supportedLocalesOf("en-us", { localeMatcher: "best fit" }).join("|"), "en-US", "string locale");
        assertEquals(Intl.DateTimeFormat.supportedLocalesOf(undefined).join("|"), "", "undefined locales");

        assertThrowsWith(function () {
            Intl.DateTimeFormat.supportedLocalesOf(["en-US"], { localeMatcher: "bad" });
        }, "RangeError", "unsupported localeMatcher");
    });

    test("default date formatting follows the approved locale tables", function () {
        assertEquals(new Intl.DateTimeFormat("en-US").format(sampleDate), "7/15/2026", "en-US default");
        assertEquals(new Intl.DateTimeFormat("en-GB").format(sampleDate), "15/07/2026", "en-GB default");
        assertEquals(new Intl.DateTimeFormat("de-DE").format(sampleDate), "15.7.2026", "de-DE default");
        assertEquals(new Intl.DateTimeFormat("fr-FR").format(sampleDate), "15/07/2026", "fr-FR default");
        assertEquals(new Intl.DateTimeFormat("hu-HU").format(sampleDate), "2026. 07. 15.", "hu-HU default");
    });

    test("year month day options format numeric and two-digit dates", function () {
        assertEquals(new Intl.DateTimeFormat("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" }).format(sampleDate), "07/15/26", "en-US 2-digit");
        assertEquals(new Intl.DateTimeFormat("en-GB", { year: "2-digit", month: "2-digit", day: "2-digit" }).format(sampleDate), "15/07/26", "en-GB 2-digit");
        assertEquals(new Intl.DateTimeFormat("de-DE", { year: "2-digit", month: "2-digit", day: "2-digit" }).format(sampleDate), "15.07.26", "de-DE 2-digit");
        assertEquals(new Intl.DateTimeFormat("fr-FR", { year: "2-digit", month: "2-digit", day: "2-digit" }).format(sampleDate), "15/07/26", "fr-FR 2-digit");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { year: "2-digit", month: "2-digit", day: "2-digit" }).format(sampleDate), "26. 07. 15.", "hu-HU 2-digit");
    });

    test("short and long month names format supported locales", function () {
        assertEquals(new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(sampleDate), "Jul 15, 2026", "en-US short month");
        assertEquals(new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "numeric" }).format(sampleDate), "15 Jul 2026", "en-GB short month");
        assertEquals(new Intl.DateTimeFormat("de-DE", { year: "numeric", month: "short", day: "numeric" }).format(sampleDate), "15. Juli 2026", "de-DE short month July follows Node-observed table");
        assertEquals(new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "short", day: "numeric" }).format(sampleDate), "15 juil. 2026", "fr-FR short month");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "short", day: "numeric" }).format(sampleDate), "2026. j\u00FAl. 15.", "hu-HU short month");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "long", day: "2-digit" }).format(sampleDate), "2026. j\u00FAlius 15.", "hu-HU long month");
    });

    test("weekday formats standalone and combined date output", function () {
        assertEquals(new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(sampleDate), "Wed", "en-US short weekday");
        assertEquals(new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(sampleDate), "Wednesday", "en-US long weekday");
        assertEquals(new Intl.DateTimeFormat("en-US", { weekday: "short", year: "numeric", month: "numeric", day: "numeric" }).format(sampleDate), "Wed, 7/15/2026", "en-US combined weekday");
        assertEquals(new Intl.DateTimeFormat("en-GB", { weekday: "short", month: "long", day: "numeric" }).format(sampleDate), "Wed, 15 July", "en-GB combined weekday");
        assertEquals(new Intl.DateTimeFormat("de-DE", { weekday: "short", year: "numeric", month: "numeric", day: "numeric" }).format(sampleDate), "Mi., 15.7.2026", "de-DE short weekday with date");
        assertEquals(new Intl.DateTimeFormat("de-DE", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(sampleDate), "Mittwoch, 15. Juli 2026", "de-DE long weekday with date");
        assertEquals(new Intl.DateTimeFormat("fr-FR", { weekday: "short", month: "long", day: "numeric" }).format(sampleDate), "mer. 15 juillet", "fr-FR combined weekday");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { weekday: "short", year: "numeric", month: "numeric", day: "numeric" }).format(sampleDate), "2026. 07. 15., Sze", "hu-HU short weekday with date");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(sampleDate), "2026. j\u00FAlius 15., szerda", "hu-HU long weekday with date");
    });
    test("partial date fields are allowed", function () {
        assertEquals(new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric" }).format(sampleDate), "July 15", "en-US month day");
        assertEquals(new Intl.DateTimeFormat("en-GB", { month: "long", day: "numeric" }).format(sampleDate), "15 July", "en-GB month day");
        assertEquals(new Intl.DateTimeFormat("de-DE", { month: "long", day: "numeric" }).format(sampleDate), "15. Juli", "de-DE month day");
        assertEquals(new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "long" }).format(sampleDate), "juillet 2026", "fr-FR year month");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "long" }).format(sampleDate), "2026. j\u00FAlius", "hu-HU year month");
    });

    test("time fields format supported locales", function () {
        var early = new Date(2026, 6, 15, 5, 6, 7, 8);

        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format(early), "5 AM", "en-US numeric hour");
        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "2-digit" }).format(early), "05 AM", "en-US 2-digit hour");
        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", second: "numeric" }).format(sampleDate), "12:34:56 PM", "en-US time with seconds");
        assertEquals(new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", second: "numeric" }).format(sampleDate), "12:34:56", "en-GB time");
        assertEquals(new Intl.DateTimeFormat("de-DE", { hour: "numeric" }).format(sampleDate), "12 Uhr", "de-DE standalone hour");
        assertEquals(new Intl.DateTimeFormat("fr-FR", { hour: "numeric" }).format(sampleDate), "12 h", "fr-FR standalone hour");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", second: "numeric" }).format(early), "5:06:07", "hu-HU numeric hour keeps single digit");
    });


    test("hour12 and hourCycle select 12-hour and 24-hour output", function () {
        var early = new Date(2026, 6, 15, 5, 6, 7, 8);
        var midnight = new Date(2026, 6, 15, 0, 5, 6, 7);

        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", hour12: false }).format(early), "05:06", "en-US hour12 false uses h23 width");
        assertEquals(new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", hour12: true }).format(early), "5:06 am", "en-GB hour12 true marker");
        assertEquals(new Intl.DateTimeFormat("de-DE", { hour: "numeric", minute: "numeric", hourCycle: "h11" }).format(sampleDate), "0:34 PM", "de-DE h11 noon");
        assertEquals(new Intl.DateTimeFormat("fr-FR", { hour: "numeric", minute: "numeric", hourCycle: "h24" }).format(early), "5:06", "fr-FR h24 keeps numeric hour");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", hour12: true }).format(early), "de. 5:06", "hu-HU hour12 true marker before time");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", hourCycle: "h24" }).format(midnight), "24:05", "hu-HU h24 midnight");
        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", hour12: false, hourCycle: "h12" }).resolvedOptions().hourCycle, "h23", "hour12 overrides hourCycle");
    });

    test("fractionalSecondDigits formats the approved millisecond subset", function () {
        var early = new Date(2026, 6, 15, 5, 6, 7, 123);

        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", second: "numeric", fractionalSecondDigits: 1 }).format(early), "5:06:07.1 AM", "en-US one fractional digit");
        assertEquals(new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", second: "numeric", fractionalSecondDigits: 2 }).format(early), "05:06:07.12", "en-GB two fractional digits");
        assertEquals(new Intl.DateTimeFormat("de-DE", { hour: "numeric", minute: "numeric", second: "numeric", fractionalSecondDigits: 3 }).format(early), "05:06:07,123", "de-DE comma fractional separator");
        assertEquals(new Intl.DateTimeFormat("fr-FR", { second: "numeric", fractionalSecondDigits: 3 }).format(early), "7,123", "fr-FR second-only fractional output");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", second: "numeric", fractionalSecondDigits: "2" }).format(early), "5:06:07,12", "hu-HU string option coerces to number");
    });

    test("edge cases keep the approved DateTimeFormat subset stable", function () {
        var midnight = new Date(2026, 6, 15, 0, 5, 6, 9);
        var noon = new Date(2026, 6, 15, 12, 5, 6, 987);
        var late = new Date(2026, 6, 15, 23, 59, 59, 999);

        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", hourCycle: "h11" }).format(midnight), "0:05 AM", "h11 midnight starts at zero");
        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", hourCycle: "h12" }).format(midnight), "12:05 AM", "h12 midnight starts at twelve");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", hourCycle: "h23" }).format(midnight), "0:05", "hu-HU default-style h23 midnight");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", hourCycle: "h24" }).format(midnight), "24:05", "h24 midnight uses twenty-four");
        assertEquals(new Intl.DateTimeFormat("de-DE", { hour: "numeric", minute: "numeric", hourCycle: "h11" }).format(noon), "0:05 PM", "h11 noon wraps to zero");
        assertEquals(new Intl.DateTimeFormat("fr-FR", { hour: "numeric", minute: "numeric", hourCycle: "h24" }).format(late), "23:59", "h24 late hour remains twenty-three");
        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", hour12: "false" }).format(midnight), "12:05 AM", "hour12 string false follows Boolean coercion");
        assertEquals(new Intl.DateTimeFormat("en-US", { second: "numeric", fractionalSecondDigits: 3 }).format(midnight), "6.009", "fractional seconds pad milliseconds");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { second: "numeric", fractionalSecondDigits: 2 }).format(late), "59,99", "fractional seconds truncate milliseconds");
        assertEquals(new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "numeric", second: "numeric", fractionalSecondDigits: 3 }).resolvedOptions().hour, "2-digit", "en-GB numeric hour normalizes in h23 time");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric", second: "numeric", fractionalSecondDigits: 3 }).resolvedOptions().hour, "numeric", "hu-HU numeric hour remains numeric");
        assertEquals(new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" }).format({ year: 2026, month: 1, day: 2 }), "Jan 02", "Temporal-like date uses supplied date fields");
    });

    test("date and time fields combine with locale separators", function () {
        assertEquals(new Intl.DateTimeFormat("en-US", { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).format(sampleDate), "7/15/2026, 12:34:56 PM", "en-US date time");
        assertEquals(new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).format(sampleDate), "15/07/2026, 12:34:56", "en-GB date time");
        assertEquals(new Intl.DateTimeFormat("de-DE", { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).format(sampleDate), "15.7.2026, 12:34:56", "de-DE date time");
        assertEquals(new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).format(sampleDate), "15/07/2026 12:34:56", "fr-FR date time");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).format(sampleDate), "2026. 07. 15. 12:34:56", "hu-HU date time");
    });

    test("formatRange joins formatted endpoints with an en dash", function () {
        var same = new Date(2026, 6, 15, 12, 34, 56, 987);
        var nextDay = new Date(2026, 6, 16, 12, 34, 56, 987);
        var later = new Date(2026, 6, 15, 13, 34, 56, 987);

        assertEquals(new Intl.DateTimeFormat("hu-HU").formatRange(sampleDate, nextDay), "2026. 07. 15.\u20132026. 07. 16.", "hu-HU date range");
        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric" }).formatRange(sampleDate, later), "12:34 PM\u20131:34 PM", "en-US time range");
        assertEquals(new Intl.DateTimeFormat("de-DE", { year: "numeric", month: "long", day: "numeric" }).formatRange(sampleDate, same), "15. Juli 2026", "same formatted endpoints collapse");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { hour: "numeric", minute: "numeric" }).formatRange({ hour: 5, minute: 6 }, { hour: 7, minute: 8 }), "5:06\u20137:08", "Temporal-like time range");

        assertThrowsWith(function () {
            new Intl.DateTimeFormat("en-US").formatRange(sampleDate, "2026-07-16");
        }, "TypeError", "invalid end value follows format validation");
    });

    test("format accepts Temporal-like time and date-time objects", function () {
        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", second: "numeric" }).format({ hour: 5, minute: 6, second: 7 }), "5:06:07 AM", "time-like object");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).format({ year: 2026, month: 7, day: 15, hour: 5, minute: 6, second: 7 }), "2026. 07. 15. 5:06:07", "date-time-like object");
    });
    test("format accepts timestamp numbers and Temporal-like date objects", function () {
        var formatter = new Intl.DateTimeFormat("hu-HU");

        assertEquals(formatter.format(sampleTime), "2026. 07. 15.", "timestamp number");
        assertEquals(formatter.format(sampleObject), "2026. 07. 15.", "Temporal-like object");
        assertEquals(new Intl.DateTimeFormat("en-US").format({ year: "2026", month: "7", day: "15" }), "7/15/2026", "date-like object fields coerce to numbers");
    });

    test("formatToParts exposes the narrow implemented date and time fields", function () {
        var formatter = new Intl.DateTimeFormat("hu-HU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            fractionalSecondDigits: 3
        });
        var parts = formatter.formatToParts({ year: 2026, month: 7, day: 15, hour: 12, minute: 34, second: 56, millisecond: 123 });
        var text = "";
        var types = [];
        var index;

        for (index = 0; index < parts.length; index++) {
            text += parts[index].value;
            types.push(parts[index].type);
        }

        assertEquals(text, formatter.format({ year: 2026, month: 7, day: 15, hour: 12, minute: 34, second: 56, millisecond: 123 }), "parts concatenate to format output");
        assertEquals(types.join("|"), "year|literal|month|literal|day|literal|hour|literal|minute|literal|second|literal|fractionalSecond", "part types");
        assertEquals(parts[0].value, "2026", "year part");
        assertEquals(parts[2].value, "07", "month part");
        assertEquals(parts[4].value, "15", "day part");
        assertEquals(parts[11].value, ",", "fraction literal");
        assertEquals(parts[12].value, "123", "fractionalSecond part");
    });

    test("formatToParts supports the partial date shapes needed by Temporal toLocaleString", function () {
        var yearMonthFormatter = new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "2-digit" });
        var monthDayFormatter = new Intl.DateTimeFormat("hu-HU", { month: "2-digit", day: "2-digit" });
        var usMonthDayFormatter = new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit" });
        var yearMonth = yearMonthFormatter.formatToParts({ year: 2026, month: 7, day: 1 });
        var monthDay = monthDayFormatter.formatToParts({ year: 1972, month: 7, day: 15 });
        var usMonthDay = usMonthDayFormatter.formatToParts({ year: 1972, month: 7, day: 15 });

        assertEquals(yearMonth[0].type + ":" + yearMonth[0].value, "year:2026", "YearMonth year part");
        assertEquals(yearMonth[2].type + ":" + yearMonth[2].value, "month:07", "YearMonth month part");
        assertEquals(partsToText(yearMonth), "2026. 07.", "YearMonth text");
        assertEquals(partsToText(monthDay), "07. 15.", "hu-HU MonthDay text");
        assertEquals(partsToText(usMonthDay), "07/15", "en-US MonthDay text");
    });

    test("resolvedOptions exposes the supported subset", function () {
        var options = new Intl.DateTimeFormat("hu-hu", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            numberingSystem: "latn",
            localeMatcher: "lookup"
        }).resolvedOptions();

        assertEquals(options.locale, "hu-HU", "locale");
        assertEquals(options.calendar, "gregory", "calendar");
        assertEquals(options.numberingSystem, "latn", "numberingSystem");
        assertEquals(options.year, "numeric", "year");
        assertEquals(options.month, "2-digit", "month normalized to locale output width");
        assertEquals(options.day, "2-digit", "day normalized to locale output width");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { weekday: "long" }).resolvedOptions().weekday, "long", "weekday resolved option");
        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", second: "numeric" }).resolvedOptions().hourCycle, "h12", "en-US hourCycle");
        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", second: "numeric" }).resolvedOptions().minute, "2-digit", "minute normalizes to 2-digit");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { hour: "numeric" }).resolvedOptions().hour, "numeric", "hu-HU numeric hour remains numeric");
        assertEquals(new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false }).resolvedOptions().hourCycle, "h23", "hour12 false resolved hourCycle");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { hour: "numeric", hourCycle: "h12" }).resolvedOptions().hour12, true, "hourCycle h12 resolved hour12");
        assertEquals(new Intl.DateTimeFormat("hu-HU", { second: "numeric", fractionalSecondDigits: 3 }).resolvedOptions().fractionalSecondDigits, 3, "fractionalSecondDigits resolved option");
    });

    test("unsupported locale falls back through Intl-core", function () {
        assertEquals(new Intl.DateTimeFormat("banana").resolvedOptions().locale, "en-US", "fallback locale");
        assertEquals(new Intl.DateTimeFormat("en-UK").resolvedOptions().locale, "en-GB", "legacy alias");
    });

    test("unsupported options throw RangeError", function () {
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { era: "short" }); }, "RangeError", "era unsupported");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { timeZone: "UTC" }); }, "RangeError", "timeZone unsupported");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { hourCycle: "h25" }); }, "RangeError", "invalid hourCycle unsupported");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { second: "numeric", fractionalSecondDigits: 0 }); }, "RangeError", "fractionalSecondDigits zero unsupported");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { second: "numeric", fractionalSecondDigits: 4 }); }, "RangeError", "fractionalSecondDigits four unsupported");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { second: "numeric", fractionalSecondDigits: "banana" }); }, "RangeError", "fractionalSecondDigits invalid string unsupported");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { hour: "numeric", fractionalSecondDigits: 3 }); }, "RangeError", "fractionalSecondDigits requires second in this subset");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { dateStyle: "short" }); }, "RangeError", "dateStyle unsupported");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { numberingSystem: "arab" }); }, "RangeError", "numberingSystem unsupported");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { month: "narrow" }); }, "RangeError", "month narrow unsupported");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { weekday: "narrow" }); }, "RangeError", "weekday narrow unsupported");
    });

    test("invalid values throw", function () {
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US").format(new Date(NaN)); }, "RangeError", "invalid Date");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US").format("2026-07-15"); }, "TypeError", "string input unsupported in this branch");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US").format({ year: 2026, month: 7 }); }, "TypeError", "missing day field");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { hour: "numeric" }).format({ hour: 24 }); }, "RangeError", "invalid hour field");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { second: "numeric" }).format({ hour: 1, second: 60 }); }, "RangeError", "invalid second field");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { second: "numeric", fractionalSecondDigits: 3 }).format({ hour: 1, second: 1, millisecond: 1000 }); }, "RangeError", "invalid millisecond field");
        assertThrowsWith(function () { new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric" }).format({ hour: 1, minute: 60 }); }, "RangeError", "invalid minute field");
    });

    writeLine("Passed: " + passed);
    if (failed > 0) {
        writeLine("Failed: " + failed);
        throw new Error("Intl.DateTimeFormat subset tests failed");
    }
}());
