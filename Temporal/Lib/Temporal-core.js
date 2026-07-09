var Temporal = Temporal || {};

(function () {
	// v16 Share options, fixed-time conversion, and rounding-mode helpers
	// v17 Share ISO monthCode formatting, parsing, and property-bag resolution
	// v18 Format PlainMonthDay with the Node-compatible MM-DD representation
	// v19 Share day-serial inversion and fixed-time Duration/rounding helpers
	// v20 Share fixed-time and Instant-range constants across modules
	// v21 Share Instant parsing and UTC ISO-field projection across modules
	const MIN_YEAR = -271821;
    const MAX_YEAR = 275760;
	const MILLISECONDS_PER_SECOND = 1000;
	const MILLISECONDS_PER_MINUTE = 60000;
	const MILLISECONDS_PER_HOUR = 3600000;
	const MILLISECONDS_PER_DAY = 86400000;
	const MILLISECONDS_PER_WEEK = 604800000;
	const MIN_INSTANT_EPOCH_MILLISECONDS = -8640000000000000;
	const MAX_INSTANT_EPOCH_MILLISECONDS = 8640000000000000;
	/**
     * Compute the day of the week for a given date.
     *
     * Zeller's Congruence is used to compute the day of the week for a given date.
     *
     */
    function computeDayOfWeek (year, month, day) {
        var dayFromEpoch = rawDateToDaySerial(year, month, day);
        return (((dayFromEpoch + 3) % 7) + 7) % 7 + 1;
    };

    function computeDayOfYear  (year, month, day) {
        // Days in each month for a non-leap year
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust February for leap years
        if (Temporal.__isLeapYear__(year)) {
            daysInMonth[1] = 29;
        }

        // Compute the cumulative days up to the previous month
        var dayOfYear = 0;
        for (var i = 0; i < month - 1; i++) {
            dayOfYear += daysInMonth[i];
        }

        // Add the current day
        dayOfYear += day;

        return dayOfYear;
    };

    function computeDaysInMonth (year, month) {
        // Days in each month for a non-leap year
        var daysInMonthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust February for leap years
        if (month === 2 && Temporal.__isLeapYear__(year)) {
            return 29;
        }

        // Return days for the given month
        return daysInMonthArray[month - 1];
    };

	function isBetween (num, low, high, overflow) {
		if (!num) num = 0;
		if (overflow === 'constrain') {
			if (num < low) num = low;
			if (num > high) num = high;
			return num;
		} else {
			if (num < low || num > high) {
				throw new RangeError("Value out of range: " + num + ". Valid range: " + low + " to " + high);
			}
			return num;  
		}
	};

	function toInteger(value) {
		var number = Number(value);

		if (isNaN(number) || !isFinite(number)) {
			throw new RangeError("Temporal error: Expected finite integer.");
		}

		return number < 0 ? Math.ceil(number) : Math.floor(number);
	}

	function formatISOMonthCode(month) {
		month = toInteger(month);
		if (month < 1 || month > 12) {
			throw new RangeError("Temporal error: Month code out of range.");
		}
		return "M" + pad(month, 2);
	}

	function parseISOMonthCode(monthCode) {
		var value = String(monthCode);
		var match = /^M(0[1-9]|1[0-2])$/.exec(value);

		if (!match) {
			throw new RangeError("Temporal error: Month code out of range.");
		}

		return parseInt(match[1], 10);
	}

	function resolveISOMonth(fields) {
		var hasMonth = fields.month !== undefined;
		var hasMonthCode = fields.monthCode !== undefined;
		var month = hasMonth ? toInteger(fields.month) : undefined;
		var monthFromCode = hasMonthCode ? parseISOMonthCode(fields.monthCode) : undefined;

		if (hasMonth && hasMonthCode && month !== monthFromCode) {
			throw new RangeError("Temporal error: month and monthCode could not be resolved.");
		}

		return hasMonth ? month : monthFromCode;
	}

	function normalizeOptions(options) {
		if (options === undefined) return {};
		if (options === null || typeof options !== "object") {
			throw new TypeError("invalid_argument");
		}
		return options;
	}

	function isLeapYear(year) {
		return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
	};

	function validateDate(year, month, day, param) {
		year = toInteger(year);
		month = toInteger(month);
		day = toInteger(day);

		if (month <= 0 || day <= 0) {
			throw new RangeError("Temporal error: Expected positive integer.");
		}
		year = isBetween(year, MIN_YEAR, MAX_YEAR, "reject");
		month = isBetween(month, 1, 12, param);

		var daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if (isLeapYear(year)) daysInMonths[1] = 29; // February has 29 days in a leap year
		day = isBetween(day, 1, daysInMonths[month - 1], param);

		if ((year === MIN_YEAR && (month < 4 || (month === 4 && day < 19))) ||
			(year === MAX_YEAR && (month > 9 || (month === 9 && day > 13)))) {
			throw new RangeError("Date is not within ISO date limits.");
		}

		return {year: year, month: month, day: day};
	}

	function rawDateToDaySerial(year, month, day) {
		year -= month <= 2 ? 1 : 0;

		var era = Math.floor(year / 400);
		var yearOfEra = year - era * 400;
		var monthForDayOfYear = month + (month > 2 ? -3 : 9);
		var dayOfYear = Math.floor((153 * monthForDayOfYear + 2) / 5) + day - 1;
		var dayOfEra = yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;

		return era * 146097 + dayOfEra - 719468;
	}

	function dateToDaySerial(year, month, day) {
		var checked = validateDate(year, month, day, 'reject');
		return rawDateToDaySerial(checked.year, checked.month, checked.day);
	}

	function daySerialToDate(daySerial) {
		var shifted;
		var era;
		var dayOfEra;
		var yearOfEra;
		var year;
		var dayOfYear;
		var monthPart;
		var day;
		var month;

		daySerial = Number(daySerial);
		if (!isFinite(daySerial) || daySerial !== Math.floor(daySerial)) {
			throw new RangeError("Temporal error: Expected finite integer.");
		}

		shifted = daySerial + 719468;
		era = Math.floor(shifted / 146097);
		dayOfEra = shifted - era * 146097;
		yearOfEra = Math.floor((dayOfEra - Math.floor(dayOfEra / 1460) +
			Math.floor(dayOfEra / 36524) - Math.floor(dayOfEra / 146096)) / 365);
		year = yearOfEra + era * 400;
		dayOfYear = dayOfEra - (365 * yearOfEra + Math.floor(yearOfEra / 4) -
			Math.floor(yearOfEra / 100));
		monthPart = Math.floor((5 * dayOfYear + 2) / 153);
		day = dayOfYear - Math.floor((153 * monthPart + 2) / 5) + 1;
		month = monthPart + (monthPart < 10 ? 3 : -9);
		year += month <= 2 ? 1 : 0;

		return validateDate(year, month, day, "reject");
	}

	function validateInstantEpochMilliseconds(value) {
		var milliseconds = Number(value);

		if (!isFinite(milliseconds) || milliseconds !== Math.floor(milliseconds)) {
			throw new RangeError("Temporal error: Expected finite integer.");
		}
		if (milliseconds < MIN_INSTANT_EPOCH_MILLISECONDS ||
				milliseconds > MAX_INSTANT_EPOCH_MILLISECONDS) {
			throw new RangeError("Temporal error: Instant milliseconds are not within a valid epoch range.");
		}
		return milliseconds;
	}

	function epochMillisecondsToISOFields(epochMilliseconds) {
		epochMilliseconds = validateInstantEpochMilliseconds(epochMilliseconds);
		var daySerial = Math.floor(epochMilliseconds / MILLISECONDS_PER_DAY);
		var time = epochMilliseconds - daySerial * MILLISECONDS_PER_DAY;
		var date = daySerialToDate(daySerial);
		var hour = Math.floor(time / MILLISECONDS_PER_HOUR);

		time -= hour * MILLISECONDS_PER_HOUR;
		var minute = Math.floor(time / MILLISECONDS_PER_MINUTE);
		time -= minute * MILLISECONDS_PER_MINUTE;
		var second = Math.floor(time / MILLISECONDS_PER_SECOND);

		return {
			year: date.year,
			month: date.month,
			day: date.day,
			hour: hour,
			minute: minute,
			second: second,
			millisecond: time - second * MILLISECONDS_PER_SECOND
		};
	}

	function hasNonZeroSubMillisecond(fraction) {
		return fraction.length > 3 && /[1-9]/.test(fraction.substring(3));
	}

	function parseInstantString(value) {
		var source = String(value);
		var bracket;
		var match;

		while ((bracket = /\[[^\]]*\]$/.exec(source))) {
			source = source.substring(0, bracket.index);
		}

		match = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})[Tt ](\d{2}):(\d{2})(?::(\d{2})(?:[.,](\d{1,9}))?)?([zZ]|([+-])(\d{2})(?::?(\d{2}))?)$/.exec(source);
		if (!match) {
			throw new RangeError("Temporal error: Required fields missing from Instant string.");
		}

		var year = Number(match[1]);
		var month = Number(match[2]);
		var day = Number(match[3]);
		var hour = Number(match[4]);
		var minute = Number(match[5]);
		var second = Number(match[6] || 0);
		var fraction = match[7] || "";
		var millisecond = Number((fraction + "000").substring(0, 3));
		var offsetHour = Number(match[10] || 0);
		var offsetMinute = Number(match[11] || 0);
		var offsetSign = match[9] === "-" ? -1 : 1;

		validateDate(year, month, day, "reject");
		if (hour < 0 || hour > 23 || minute < 0 || minute > 59 ||
				second < 0 || second > 60 || offsetHour > 23 || offsetMinute > 59) {
			throw new RangeError("Temporal error: Invalid Instant time or offset.");
		}
		if (second === 60) second = 59;

		var offsetMilliseconds = (match[8] === "Z" || match[8] === "z") ? 0 :
			offsetSign * (offsetHour * MILLISECONDS_PER_HOUR +
				offsetMinute * MILLISECONDS_PER_MINUTE);
		var epochMilliseconds = dateToDaySerial(year, month, day) * MILLISECONDS_PER_DAY +
			hour * MILLISECONDS_PER_HOUR +
			minute * MILLISECONDS_PER_MINUTE +
			second * MILLISECONDS_PER_SECOND +
			millisecond - offsetMilliseconds;

		if (epochMilliseconds === MAX_INSTANT_EPOCH_MILLISECONDS &&
				hasNonZeroSubMillisecond(fraction)) {
			throw new RangeError("Temporal error: Instant milliseconds are not within a valid epoch range.");
		}
		return validateInstantEpochMilliseconds(epochMilliseconds);
	}

	function projectOffsetISOStringToUTCFields(value) {
		var original = String(value);
		var source = original;
		var bracket;
		var hasTimeZoneAnnotation = false;
		var hasDateTimeSeparator;

		while ((bracket = /\[[^\]]*\]$/.exec(source))) {
			if (bracket[0].indexOf("=") === -1) {
				hasTimeZoneAnnotation = true;
			}
			source = source.substring(0, bracket.index);
		}

		hasDateTimeSeparator = /[Tt ]/.test(source);
		if (/[zZ]$/.test(source) ||
				(hasDateTimeSeparator && /[+-]\d{2}(?::?\d{2})?(?::?\d{2}(?:[.,]\d{1,9})?)?$/.test(source))) {
			return epochMillisecondsToISOFields(parseInstantString(original));
		}

		if (hasTimeZoneAnnotation) {
			throw new RangeError("Temporal error: A bracketed time-zone annotation requires Z or a numeric offset.");
		}

		return null;
	}

	function daysBetweenDates(start, end) {
		return dateToDaySerial(end.year, end.month, end.day) -
			dateToDaySerial(start.year, start.month, start.day);
	}

	/**
	 * Parses an ISO 8601 date string (e.g., "2025-01-16").
	 * Accepts a full date-time string but extracts and parses only the date part.
	 *
	 * @param {string} isoString - The ISO date or date-time string.
	 * @returns {Object} An object containing year, month, and day.
	 */
	function parseISODateString(dateStr) {
		var dateMatch = dateStr.match(/^([-+]?\d{4,6})-(\d{2})-(\d{2}).*$/);
		if (!dateMatch) return undefined;
			return  {
				year: parseInt(dateMatch[1], 10),
				month: parseInt(dateMatch[2], 10),
				day: parseInt(dateMatch[3], 10)
			};
	}

	/**
	 * Parses an ISO 8601 time string (e.g., "14:35:29.123Z").
	 * Accepts a full date-time string but extracts and parses only the time part.
	 *
	 * @param {string} isoString - The ISO time or date-time string.
	 * @returns {Object} An object containing hours, minutes, seconds, milliseconds, and time zone offset.
	 */
	function parseISOTimeString(timeStr) {
		var timeMatch = timeStr.match(/(\d{2}):(\d{2}):?(\d{2})?(?:\.(\d{1,3}))?.*$/)
		if (!timeMatch) return undefined;

		return {
			hour: parseInt(timeMatch[1], 10),
			minute: parseInt(timeMatch[2] || 0, 10),
			second: parseInt(timeMatch[3] || 0, 10),
			millisecond: parseInt((timeMatch[4] || "0") + "000".slice(0, 3 - (timeMatch[4] || "0").length), 10)
		};
	}

	/**
	 * Parses an ISO 8601 date-time string (e.g., "2025-01-16T14:35:29.123Z").
	 *
	 * @param {string} isoString - The ISO date-time string.
	 * @returns {Object} An object containing all date and time components.
	 */
	function parseISOString(dateTimeStr) {
		var datePart = parseISODateString(dateTimeStr)// || { year: 0, month: 0, day: 0 };
		var timePart = parseISOTimeString(dateTimeStr) || { hour: 0, minute: 0, second: 0, millisecond: 0 };
		
		if (!datePart) throw new TypeError('Invalid ISO DateTime string')
		
		return {
			year: datePart.year,
			month: datePart.month,
			day: datePart.day,
			hour: timePart.hour,
			minute: timePart.minute,
			second: timePart.second,
			millisecond: timePart.millisecond
		};
	}

	function copyFields(thisObject) {
		if (typeof thisObject !== 'object' || thisObject === null) {
			return {};
		}

		var copied = {};

		for (var key in thisObject) { 
			if (thisObject.hasOwnProperty(key)) {
				copied[key] = thisObject[key];
			}
		}

		return copied;
	};

	function compareISODate(one, two){
		if (one.year > two.year) return 1;
		if (one.year < two.year) return -1;
		if (one.month > two.month) return 1;
		if (one.month < two.month) return -1;
		if (one.day > two.day) return 1;
		if (one.day < two.day) return -1;
		return 0;
	};

	function compareTimeRecord(one, two){
		if (one.hour > two.hour) return 1;
		if (one.hour < two.hour) return -1;
		if (one.minute > two.minute) return 1;
		if (one.minute < two.minute) return -1;
		if (one.second > two.second) return 1;
		if (one.second < two.second) return -1;
		if (one.millisecond > two.millisecond) return 1;
		if (one.millisecond < two.millisecond) return -1;
		return 0;
	};

	function timeToMilliseconds(time) {
		return (((time.hour * 60 + time.minute) * 60 + time.second) *
			MILLISECONDS_PER_SECOND) + time.millisecond;
	}

	function balanceDateUnits(year, month, day) {
	  // Normalize month values using modulo arithmetic
	  if (month > 12 || month < 1) {
		year += Math.floor((month - 1) / 12);
		month = ((month - 1) % 12 + 12) % 12 + 1;
	  }

	  // Balance days by moving forward if day exceeds the month's length
	  var daysInMonth;
	  while (day > (daysInMonth = Temporal.__computeDaysInMonth__(year, month))) {
		day -= daysInMonth;
		month++;
		if (month > 12) {
		  month = 1;
		  year++;
		}
	  }

	  // Balance days by moving backward if day is less than 1
	  while (day < 1) {
		month--;
		if (month < 1) {
		  month = 12;
		  year--;
		}
		day += Temporal.__computeDaysInMonth__(year, month);
	  }

	  return { year: year, month: month, day: day };
	}


	function balanceTimeUnits(hour, minute, second, millisecond) {
		var totalMilliseconds = (((hour * 60 + minute) * 60 + second) *
			MILLISECONDS_PER_SECOND) + millisecond;
		var extraDays = Math.floor(totalMilliseconds / MILLISECONDS_PER_DAY);
		var remaining = totalMilliseconds - (extraDays * MILLISECONDS_PER_DAY);

		hour = Math.floor(remaining / MILLISECONDS_PER_HOUR);
		remaining -= hour * MILLISECONDS_PER_HOUR;

		minute = Math.floor(remaining / MILLISECONDS_PER_MINUTE);
		remaining -= minute * MILLISECONDS_PER_MINUTE;

		second = Math.floor(remaining / MILLISECONDS_PER_SECOND);
		millisecond = remaining - (second * MILLISECONDS_PER_SECOND);

		return { extraDays: extraDays, hour: hour, minute: minute, second: second, millisecond: millisecond };
	}

	function timeUnitToMilliseconds(unit) {
		if (unit === "day") return MILLISECONDS_PER_DAY;
		if (unit === "hour") return MILLISECONDS_PER_HOUR;
		if (unit === "minute") return MILLISECONDS_PER_MINUTE;
		if (unit === "second") return MILLISECONDS_PER_SECOND;
		if (unit === "millisecond") return 1;
		return 0;
	}

	function millisecondsToTimeDurationFields(milliseconds, largestUnit) {
		var sign;
		var remaining;
		var result = {
			years: 0,
			months: 0,
			weeks: 0,
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		};

		milliseconds = Number(milliseconds);
		largestUnit = singularUnit(largestUnit);
		if (!isFinite(milliseconds) || milliseconds !== Math.floor(milliseconds)) {
			throw new RangeError("Temporal error: Expected finite integer.");
		}
		if (largestUnit !== "hour" && largestUnit !== "minute" &&
				largestUnit !== "second" && largestUnit !== "millisecond") {
			throw new RangeError("Temporal error: Fixed-time Duration requires a time unit.");
		}

		sign = milliseconds < 0 ? -1 : (milliseconds > 0 ? 1 : 0);
		remaining = Math.abs(milliseconds);
		if (largestUnit === "hour") {
			result.hours = sign * Math.floor(remaining / MILLISECONDS_PER_HOUR);
			remaining -= Math.abs(result.hours) * MILLISECONDS_PER_HOUR;
		}
		if (largestUnit === "hour" || largestUnit === "minute") {
			result.minutes = sign * Math.floor(remaining / MILLISECONDS_PER_MINUTE);
			remaining -= Math.abs(result.minutes) * MILLISECONDS_PER_MINUTE;
		}
		if (largestUnit !== "millisecond") {
			result.seconds = sign * Math.floor(remaining / MILLISECONDS_PER_SECOND);
			remaining -= Math.abs(result.seconds) * MILLISECONDS_PER_SECOND;
		}
		result.milliseconds = sign * remaining;
		return result;
	}

	function validateTimeRoundingIncrement(value, unit, allowMaximum) {
		var increment = value === undefined ? 1 : Number(value);
		var maximum;

		unit = singularUnit(unit);
		if (unit === "hour") maximum = 24;
		else if (unit === "minute" || unit === "second") maximum = 60;
		else if (unit === "millisecond") maximum = MILLISECONDS_PER_SECOND;
		else throw new RangeError("Temporal error: Fixed-time rounding requires a time unit.");

		if (!isFinite(increment) || increment < 1 || increment !== Math.floor(increment)) {
			throw new RangeError("Temporal error: roundingIncrement must be a positive integer.");
		}
		if ((allowMaximum ? increment > maximum : increment >= maximum) || maximum % increment !== 0) {
			throw new RangeError("Temporal error: dividend is not divisible by roundingIncrement.");
		}
		return increment;
	}

	function isValidRoundingMode(mode) {
		return mode === "ceil" || mode === "floor" || mode === "expand" || mode === "trunc" ||
			mode === "halfCeil" || mode === "halfFloor" || mode === "halfExpand" ||
			mode === "halfTrunc" || mode === "halfEven";
	}

	// Helper: Round a numeric value to the nearest multiple of the given increment.
    // This function is used to round the "total" value for the field.
	function roundField(n, increment, mode) {
		if (increment <= 0) throw new Error("Increment must be positive"); // Already checked, maybe can be deleted

		const scaled = n / increment; // Scale the number to a base of 1
		var rounded;
		
		// Math.trunc helper
		const trunc = function (v) {
			if (isNaN(v)) { return NaN; }
			return v < 0 ? Math.ceil(v) : Math.floor(v);
		};

		switch (mode) {
			case "ceil": // Toward +âˆž
				rounded = Math.ceil(scaled);
				break;
			case "floor": // Toward -âˆž
				rounded = Math.floor(scaled);
				break;
			case "expand": // Away from 0
				rounded = scaled > 0 ? Math.ceil(scaled) : Math.floor(scaled);
				break;
			case "trunc": // Toward 0
				rounded = trunc(scaled);
				break;
			case "halfCeil": // Ties toward +âˆž
				rounded = (scaled % 1 === 0.5 || scaled % 1 === -0.5) ? Math.ceil(scaled) : Math.round(scaled);
				break;
			case "halfFloor": // Ties toward -âˆž
				rounded = (scaled % 1 === 0.5 || scaled % 1 === -0.5) ? Math.floor(scaled) : Math.round(scaled);
				break;
			case "halfExpand": // Ties away from 0
				if (scaled % 1 === 0.5 || scaled % 1 === -0.5) {
					rounded = scaled > 0 ? Math.ceil(scaled) : Math.floor(scaled);
				} else {
					rounded = Math.round(scaled);
				}
				break;
			case "halfTrunc": // Ties toward 0
				if (scaled % 1 === 0.5 || scaled % 1 === -0.5) {
					rounded = scaled > 0 ? Math.floor(scaled) : Math.ceil(scaled);
				} else {
					rounded = Math.round(scaled);
				}
				break;
			case "halfEven": // Ties toward even multiple of increment
				const baseRound = Math.round(scaled);
				if (scaled % 1 === 0.5 || scaled % 1 === -0.5) {
					rounded = (baseRound * increment) % (2 * increment) === 0 ? baseRound : baseRound - 1;
				} else {
					rounded = baseRound;
				}
				break;
			default:
				throw new Error("Unknown rounding mode");
		}

		return rounded * increment; // Scale back to the original increment
	}

	function pad(value, length) {
		var text = String(value);
		while (text.length < length) {
			text = "0" + text;
		}
		return text;
	};

	function singularUnit(unit) {
		if (unit === "years") return "year";
		if (unit === "months") return "month";
		if (unit === "weeks") return "week";
		if (unit === "days") return "day";
		if (unit === "hours") return "hour";
		if (unit === "minutes") return "minute";
		if (unit === "seconds") return "second";
		if (unit === "milliseconds") return "millisecond";
		if (unit === "microseconds") return "microsecond";
		if (unit === "nanoseconds") return "nanosecond";
		return unit;
	};

	function formatISO(fields, kind, options) {
		function validateSmallestUnit(unit) {
			var validUnits = {
				minute: true,
				second: true,
				millisecond: true,
				microsecond: true,
				nanosecond: true
			};

			if (unit === undefined) {
				return undefined;
			}

			unit = singularUnit(unit);

			if (validUnits[unit]) {
				return unit;
			}

			if (unit === "year" || unit === "month" || unit === "week" || unit === "day") {
				throw new RangeError("Temporal error: Found date unit, expect time unit");
			}

			if (unit === "hour") {
				throw new RangeError("Temporal error: smallestUnit must be a valid time unit.");
			}

			throw new RangeError("Value " + unit + " out of range for Temporal.DateTime.prototype.toString options property smallestUnit");
		}

		function validateRoundingMode(mode) {
			if (mode === undefined) {
				return "trunc";
			}

			if (!isValidRoundingMode(mode)) {
				throw new RangeError("Value " + mode + " out of range for Temporal.DateTime.prototype.toString options property roundingMode");
			}

			return mode;
		}

		function validateFractionalSecondDigits(value) {
			if (value === undefined) {
				return "auto";
			}

			if (value === "auto") {
				return "auto";
			}

			if (typeof value === "number" && isFinite(value) && value >= 0 && value < 10) {
				return Math.floor(value);
			}

			throw new RangeError("fractionalSecondDigits value is out of range.");
		}

		function formatYear(year) {
			if (year < 0) {
				return "-" + pad(Math.abs(year), 6);
			}

			if (year > 9999) {
				return "+" + pad(Math.abs(year), 6);
			}

			return pad(year, 4);
		}

		function formatDate(fields) {
			return formatYear(fields.year) +
				"-" + pad(fields.month, 2) +
				"-" + pad(fields.day, 2);
		}

		function fractionDigitsForSmallestUnit(unit) {
			if (unit === "millisecond") return 3;
			if (unit === "microsecond") return 6;
			if (unit === "nanosecond") return 9;
			return 0;
		}

		function formatFraction(milliseconds, digits, trim) {
			var fraction = pad(milliseconds, 3);

			while (fraction.length < digits) {
				fraction += "0";
			}

			fraction = fraction.substring(0, digits);

			if (trim) {
				fraction = fraction.replace(/0+$/, "");
			}

			return fraction ? "." + fraction : "";
		}

		function roundedFields(fields, smallestUnit, fractionalSecondDigits, roundingMode) {
			var totalMilliseconds;
			var increment;
			var balancedTime;
			var balancedDate;

			if (smallestUnit === "minute") {
				increment = MILLISECONDS_PER_MINUTE;
			} else if (smallestUnit === "second") {
				increment = MILLISECONDS_PER_SECOND;
			} else if (smallestUnit === "millisecond" || smallestUnit === "microsecond" || smallestUnit === "nanosecond") {
				increment = 1;
			} else if (typeof fractionalSecondDigits === "number") {
				increment = fractionalSecondDigits < 3 ? Math.pow(10, 3 - fractionalSecondDigits) : 1;
			} else {
				increment = 1;
			}

			totalMilliseconds = (((fields.hour || 0) * 60 + (fields.minute || 0)) * 60 +
				(fields.second || 0)) * MILLISECONDS_PER_SECOND + (fields.millisecond || 0);
			balancedTime = balanceTimeUnits(0, 0, 0, roundField(totalMilliseconds, increment, roundingMode));

			if (kind === "PlainDateTime") {
				balancedDate = balanceDateUnits(fields.year, fields.month, fields.day + balancedTime.extraDays);
				return {
					year: balancedDate.year,
					month: balancedDate.month,
					day: balancedDate.day,
					hour: balancedTime.hour,
					minute: balancedTime.minute,
					second: balancedTime.second,
					millisecond: balancedTime.millisecond
				};
			}

			return {
				hour: balancedTime.hour,
				minute: balancedTime.minute,
				second: balancedTime.second,
				millisecond: balancedTime.millisecond
			};
		}

		function formatTime(fields, smallestUnit, fractionalSecondDigits) {
			var digits;
			var trimFraction = false;
			var result = pad(fields.hour || 0, 2) + ":" + pad(fields.minute || 0, 2);

			if (smallestUnit === "minute") {
				return result;
			}

			result += ":" + pad(fields.second || 0, 2);

			if (smallestUnit !== undefined) {
				digits = fractionDigitsForSmallestUnit(smallestUnit);
			} else if (typeof fractionalSecondDigits === "number") {
				digits = fractionalSecondDigits;
			} else {
				digits = 3;
				trimFraction = true;
			}

			if (digits > 0) {
				result += formatFraction(fields.millisecond || 0, digits, trimFraction);
			}

			return result;
		}

		options = normalizeOptions(options);

		if (kind === "PlainDateTime") {
			var smallestUnit = validateSmallestUnit(options.smallestUnit);
			var fractionalSecondDigits = validateFractionalSecondDigits(options.fractionalSecondDigits);
			var roundingMode = validateRoundingMode(options.roundingMode);
			var rounded = roundedFields(fields, smallestUnit, fractionalSecondDigits, roundingMode);
			return formatDate(rounded) + "T" + formatTime(rounded, smallestUnit, fractionalSecondDigits);
		}

		if (kind === "PlainDate") {
			return formatDate(fields);
		}

		if (kind === "PlainTime") {
			return formatTime(fields, undefined, "auto");
		}

		if (kind === "PlainYearMonth") {
			return formatYear(fields.year) + "-" + pad(fields.month, 2);
		}

	if (kind === "PlainMonthDay") {
			return pad(fields.month, 2) + "-" + pad(fields.day, 2);
		}

		throw new RangeError("Invalid ISO format kind: " + kind);
	};


    /**
	 *	Expose utilities to Temporal namespace
	 */
	// Constans
	Temporal.MIN_YEAR = MIN_YEAR;
	Temporal.MAX_YEAR = MAX_YEAR;
	Temporal.__MILLISECONDS_PER_SECOND__ = MILLISECONDS_PER_SECOND;
	Temporal.__MILLISECONDS_PER_MINUTE__ = MILLISECONDS_PER_MINUTE;
	Temporal.__MILLISECONDS_PER_HOUR__ = MILLISECONDS_PER_HOUR;
	Temporal.__MILLISECONDS_PER_DAY__ = MILLISECONDS_PER_DAY;
	Temporal.__MILLISECONDS_PER_WEEK__ = MILLISECONDS_PER_WEEK;
	Temporal.__MIN_INSTANT_EPOCH_MILLISECONDS__ = MIN_INSTANT_EPOCH_MILLISECONDS;
	Temporal.__MAX_INSTANT_EPOCH_MILLISECONDS__ = MAX_INSTANT_EPOCH_MILLISECONDS;
 
	// Date utilities
    Temporal.__isLeapYear__ = isLeapYear;
	Temporal.__validateDate__ = validateDate;
    Temporal.__computeDayOfWeek__ = computeDayOfWeek;
    Temporal.__computeDayOfYear__ = computeDayOfYear;
    Temporal.__computeDaysInMonth__ = computeDaysInMonth;
	
	// ISO date/time string parsing functions
	Temporal.__parseISOString__ = parseISOString;
	
	// Comparing functions
	Temporal.__compareISODate__ = compareISODate;
	Temporal.__compareTimeRecord__ = compareTimeRecord;
	
	// Balancing functions
	Temporal.__balanceDateUnits__ = balanceDateUnits;
	Temporal.__balanceTimeUnits__ = balanceTimeUnits;
	
	// Other functions
	Temporal.__isBetween__ = isBetween;
	Temporal.__dateToDaySerial__ = dateToDaySerial;
	Temporal.__daySerialToDate__ = daySerialToDate;
	Temporal.__validateInstantEpochMilliseconds__ = validateInstantEpochMilliseconds;
	Temporal.__parseInstantString__ = parseInstantString;
	Temporal.__epochMillisecondsToISOFields__ = epochMillisecondsToISOFields;
	Temporal.__projectOffsetISOStringToUTCFields__ = projectOffsetISOStringToUTCFields;
	Temporal.__daysBetweenDates__ = daysBetweenDates;
	Temporal.__copyFields__ = copyFields;
	Temporal.__copyThisObject__ = copyFields;
	Temporal.__roundField__ = roundField;
	Temporal.__pad__ = pad;
	Temporal.__singularUnit__ = singularUnit;
	Temporal.__toInteger__ = toInteger;
	Temporal.__normalizeOptions__ = normalizeOptions;
	Temporal.__timeToMilliseconds__ = timeToMilliseconds;
	Temporal.__timeUnitToMilliseconds__ = timeUnitToMilliseconds;
	Temporal.__millisecondsToTimeDurationFields__ = millisecondsToTimeDurationFields;
	Temporal.__validateTimeRoundingIncrement__ = validateTimeRoundingIncrement;
	Temporal.__isValidRoundingMode__ = isValidRoundingMode;
	Temporal.__formatISO__ = formatISO;
	Temporal.__formatISOMonthCode__ = formatISOMonthCode;
	Temporal.__parseISOMonthCode__ = parseISOMonthCode;
	Temporal.__resolveISOMonth__ = resolveISOMonth;
})();
