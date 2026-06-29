//@include "../../Tools/Console/console.js"
//@include "../Lib/Temporal-core.js"
//@include "../Lib/Temporal.Duration.js"
//@include "../Lib/Temporal.Instant.js"

if (typeof require === "function" && typeof process !== "undefined") {
    (function () {
        var fs = require("fs");
        var path = require("path");

        function load(relativePath) {
            (0, eval)(fs.readFileSync(path.join(__dirname, relativePath), "utf8"));
        }

        load("../Lib/Temporal-core.js");
        load("../Lib/Temporal.Duration.js");
        load("../Lib/Temporal.Instant.js");
    }());
}

(function () {
    function writeLine(message) {
        if (typeof console !== "undefined" && console.log) console.log(message);
        else if (typeof $ !== "undefined" && $.writeln) $.writeln(message);
    }

    function sameNumber(actual, expected) {
        return typeof actual === "number" && !isNaN(actual) && actual === expected;
    }

    function readLocalFields(epochMilliseconds) {
        var date = new Date(epochMilliseconds);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
            millisecond: date.getMilliseconds(),
            offsetMinutes: date.getTimezoneOffset()
        };
    }

    function formatLocalFields(fields) {
        return "year=" + fields.year +
            ", month=" + fields.month +
            ", day=" + fields.day +
            ", hour=" + fields.hour +
            ", minute=" + fields.minute +
            ", second=" + fields.second +
            ", millisecond=" + fields.millisecond +
            ", getTimezoneOffset=" + fields.offsetMinutes;
    }

    var cases = [
        { name: "epoch-Z", instant: Temporal.Instant.fromEpochMilliseconds(0) },
        { name: "millisecond", instant: Temporal.Instant.from("2024-01-01T00:00:00.123Z") },
        { name: "pre-epoch", instant: Temporal.Instant.fromEpochMilliseconds(-1) },
        { name: "positive-extended-year", instant: Temporal.Instant.from("+010000-01-01T00:00:00Z") },
        { name: "negative-extended-year", instant: Temporal.Instant.from("-000001-01-01T00:00:00Z") },
        { name: "minimum-instant", instant: Temporal.Instant.fromEpochMilliseconds(Temporal.__MIN_INSTANT_EPOCH_MILLISECONDS__) },
        { name: "maximum-instant", instant: Temporal.Instant.fromEpochMilliseconds(Temporal.__MAX_INSTANT_EPOCH_MILLISECONDS__) }
    ];
    var isoPassed = 0;
    var epochPassed = 0;
    var i;

    writeLine("Temporal 0.5 host Date audit");
    writeLine("================================");

    for (i = 0; i < cases.length; i++) {
        var item = cases[i];
        var epoch = item.instant.epochMilliseconds;
        var iso = item.instant.toString();
        var parsedEpoch;
        var isoStatus;
        var epochStatus;

        try {
            parsedEpoch = new Date(iso).getTime();
            isoStatus = sameNumber(parsedEpoch, epoch) ? "PASS" : "FAIL";
        } catch (isoError) {
            parsedEpoch = "THREW: " + isoError.message;
            isoStatus = "FAIL";
        }
        if (isoStatus === "PASS") isoPassed += 1;

        var constructedEpoch;
        try {
            constructedEpoch = new Date(epoch).getTime();
            epochStatus = sameNumber(constructedEpoch, epoch) ? "PASS" : "FAIL";
        } catch (epochError) {
            constructedEpoch = "THREW: " + epochError.message;
            epochStatus = "FAIL";
        }
        if (epochStatus === "PASS") epochPassed += 1;

        writeLine("ISO_PARSE " + item.name + ": " + isoStatus +
            " | " + iso + " | expected=" + epoch + " | actual=" + parsedEpoch);
        writeLine("EPOCH_CONSTRUCTOR " + item.name + ": " + epochStatus +
            " | expected=" + epoch + " | actual=" + constructedEpoch);
    }

    var winter = Temporal.Instant.from("2026-01-15T12:34:56.123Z");
    var summer = Temporal.Instant.from("2026-07-15T12:34:56.123Z");

    writeLine("LOCAL_FIELDS winter: " + formatLocalFields(readLocalFields(winter.epochMilliseconds)));
    writeLine("LOCAL_FIELDS summer: " + formatLocalFields(readLocalFields(summer.epochMilliseconds)));
    writeLine("--------------------------------");
    writeLine("ISO_PARSE_SUMMARY: " + isoPassed + "/" + cases.length);
    writeLine("EPOCH_CONSTRUCTOR_SUMMARY: " + epochPassed + "/" + cases.length);
    writeLine("Use epochMilliseconds for the adapter unless both summaries are complete.");
}());
