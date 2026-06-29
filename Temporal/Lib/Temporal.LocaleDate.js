// v1 - Add host-local, language-independent ISO formatting for Temporal.Instant
// v2 - Add ISO-style toLocaleString methods for the supported Plain objects
// Load after Temporal-core.js and Temporal.Instant.js.

(function (Temporal) {
    function formatYear(year) {
        if (year >= 0 && year <= 9999) {
            return Temporal.__pad__(year, 4);
        }
        return (year < 0 ? "-" : "+") + Temporal.__pad__(Math.abs(year), 6);
    }

    function formatOffset(offsetMinutes) {
        var isoMinutes = -offsetMinutes;
        var sign = isoMinutes < 0 ? "-" : "+";
        var absolute = Math.abs(isoMinutes);
        var hour = Math.floor(absolute / 60);
        var minute = absolute - hour * 60;

        return sign + Temporal.__pad__(hour, 2) + ":" + Temporal.__pad__(minute, 2);
    }

    function requireFiniteInteger(value, name) {
        if (!isFinite(value) || value !== Math.floor(value)) {
            throw Temporal.__rangeError__("Temporal host-local formatting error: Invalid " + name + ".");
        }
        return value;
    }

    function hostLocalISOString(epochMilliseconds) {
        var date = new Date(epochMilliseconds);

        if (date.getTime() !== epochMilliseconds) {
            throw Temporal.__rangeError__("Temporal host-local formatting error: Native Date rejected epoch milliseconds.");
        }

        var year = requireFiniteInteger(date.getFullYear(), "year");
        var month = requireFiniteInteger(date.getMonth(), "month") + 1;
        var day = requireFiniteInteger(date.getDate(), "day");
        var hour = requireFiniteInteger(date.getHours(), "hour");
        var minute = requireFiniteInteger(date.getMinutes(), "minute");
        var second = requireFiniteInteger(date.getSeconds(), "second");
        var millisecond = requireFiniteInteger(date.getMilliseconds(), "millisecond");
        var offsetMinutes = requireFiniteInteger(date.getTimezoneOffset(), "time-zone offset");

        return formatYear(year) + "-" + Temporal.__pad__(month, 2) + "-" +
            Temporal.__pad__(day, 2) + "T" + Temporal.__pad__(hour, 2) + ":" +
            Temporal.__pad__(minute, 2) + ":" + Temporal.__pad__(second, 2) + "." +
            Temporal.__pad__(millisecond, 3) + formatOffset(offsetMinutes);
    }

    function plainDateTimeHostLocalISOString(value) {
        var date = new Date(0);

        // Set the date at noon first so the intermediate value does not land in
        // a typical DST transition gap. Setting the requested time afterwards
        // intentionally delegates gap/overlap resolution to the host Date.
        date.setHours(12, 0, 0, 0);
        date.setFullYear(value.year, value.month - 1, value.day);
        date.setHours(value.hour, value.minute, value.second, value.millisecond);

        if (!isFinite(date.getTime())) {
            throw Temporal.__rangeError__(
                "Temporal host-local formatting error: PlainDateTime is outside the native Date range."
            );
        }

        return hostLocalISOString(date.getTime());
    }

    function installPlainISOFormatter(Constructor, kind, name) {
        if (typeof Constructor !== "function") return;

        Constructor.prototype.toLocaleString = function () {
            if (!(this instanceof Constructor)) {
                throw Temporal.__typeError__(name + ".prototype.toLocaleString called on incompatible receiver.");
            }
            return Temporal.__formatISO__(this, kind);
        };
    }

    if (typeof Temporal.Instant !== "function") {
        throw Temporal.__typeError__("Temporal.LocaleDate requires Temporal.Instant to be loaded first.");
    }

    Temporal.Instant.prototype.toLocaleString = function () {
        if (!(this instanceof Temporal.Instant)) {
            throw Temporal.__typeError__("Temporal.Instant.prototype.toLocaleString called on incompatible receiver.");
        }
        return hostLocalISOString(this.epochMilliseconds);
    };

    if (typeof Temporal.PlainDateTime === "function") {
        Temporal.PlainDateTime.prototype.toLocaleString = function () {
            if (!(this instanceof Temporal.PlainDateTime)) {
                throw Temporal.__typeError__(
                    "Temporal.PlainDateTime.prototype.toLocaleString called on incompatible receiver."
                );
            }
            return plainDateTimeHostLocalISOString(this);
        };
    }

    installPlainISOFormatter(Temporal.PlainDate, "PlainDate", "Temporal.PlainDate");
    installPlainISOFormatter(Temporal.PlainTime, "PlainTime", "Temporal.PlainTime");
    installPlainISOFormatter(Temporal.PlainYearMonth, "PlainYearMonth", "Temporal.PlainYearMonth");
    installPlainISOFormatter(Temporal.PlainMonthDay, "PlainMonthDay", "Temporal.PlainMonthDay");
}(Temporal));
