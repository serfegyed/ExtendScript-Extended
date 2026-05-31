if (!Date.prototype.toISOString) {
    Date.prototype.toISOString = function () {
        function _isopad(number, length) {
            var str = String(number);
            while (str.length < length) str = "0" + str;
            return str;
        }

        function _isoyear(year) {
            if (year >= 0 && year <= 9999) {
                return _isopad(year, 4);
            }
            return (year < 0 ? "-" : "+") + _isopad(Math.abs(year), 6);
        }

		if (!isFinite(this.getTime())) {
			throw new RangeError("Invalid time value");
		}

        return (
            _isoyear(this.getUTCFullYear())       + "-" +
            _isopad(this.getUTCMonth() + 1, 2)    + "-" +
            _isopad(this.getUTCDate(), 2)          + "T" +
            _isopad(this.getUTCHours(), 2)         + ":" +
            _isopad(this.getUTCMinutes(), 2)       + ":" +
            _isopad(this.getUTCSeconds(), 2)       + "." +
            _isopad(this.getUTCMilliseconds(), 3)  + "Z"
        );
    };
}