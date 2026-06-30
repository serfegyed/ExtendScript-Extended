// Date.prototype.toISOString polyfill for ExtendScript

(function () {
    if (!Date.prototype.toISOString) {
        Date.prototype.toISOString = function () {
            var time;

            function rangeError(message) {
                var error = new RangeError(message);

                error.name = "RangeError";
                return error;
            }

            function typeError(message) {
                var error = new TypeError(message);

                error.name = "TypeError";
                return error;
            }

            function pad(number, length) {
                var string = String(number);

                while (string.length < length) {
                    string = "0" + string;
                }
                return string;
            }

            function formatYear(year) {
                if (year >= 0 && year <= 9999) {
                    return pad(year, 4);
                }
                return (year < 0 ? "-" : "+") + pad(Math.abs(year), 6);
            }

            try {
                time = Date.prototype.getTime.call(this);
            } catch (error) {
                throw typeError("Date.prototype.toISOString called on incompatible receiver");
            }

            if (!isFinite(time)) {
                throw rangeError("Invalid time value");
            }

            return (
                formatYear(Date.prototype.getUTCFullYear.call(this)) + "-" +
                pad(Date.prototype.getUTCMonth.call(this) + 1, 2) + "-" +
                pad(Date.prototype.getUTCDate.call(this), 2) + "T" +
                pad(Date.prototype.getUTCHours.call(this), 2) + ":" +
                pad(Date.prototype.getUTCMinutes.call(this), 2) + ":" +
                pad(Date.prototype.getUTCSeconds.call(this), 2) + "." +
                pad(Date.prototype.getUTCMilliseconds.call(this), 3) + "Z"
            );
        };
    }
}());
