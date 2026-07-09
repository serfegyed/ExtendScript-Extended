// v13 - The `total` function implemented
// v14 - The duration <-> millisecond converson functions rewritten
//		to handle negative duration and/or relativeTo

// v15 - Fix copy helper usage, weeks in negated/abs, and basic add/subtract
// v16 - Use __copyFields__ and restore milliseconds conversion in add/subtract
// v17 - Use proleptic Gregorian day serials for years/months in durationToMilliseconds
// v18 - Use proleptic Gregorian day serials in millisecondsToDuration calendar balancing
// v19 - Remove unused native Date based diffMilliseconds helper
// v20 - Remove unused ISOStringToDate helper
// v21 - Route Duration.total through relativeTo-aware milliseconds conversion for all units
// v22 - Match Node Temporal year/month total fractions for negative durations
// v23 - Use same-direction next calendar unit for negative total fractions
// v24 - Calculate year/month total fraction denominators from original relativeTo markers
// v25 - Fix Duration.round largestUnit auto detection
// v26 - Ensure Duration.round auto largestUnit is at least smallestUnit
// v27 - Fix Duration.round expand mode assignment
// v28 - Preserve weeks when Duration.round smallestUnit is week
// v29 - Drop day remainder when Duration.round smallestUnit is week
// v30 - Align Duration.round validation errors with Node Temporal
// v31 - Preserve RangeError.name in ExtendScript for Duration.round validation
// v32 - Align remaining Duration.from/with/compare/add-subtract edge cases
// v33 - Preserve TypeError.name in ExtendScript for Duration edge validation
// v34 - Preserve add/subtract largest time unit and add basic toString options
// v35 - Align constructor edge validation and add toLocaleString alias
// v36 - Align Duration.total option validation and error names
// v37 - Align Duration.round option validation, plural units, and time-unit balancing
// v38 - Add closing Duration.compare and JSON regressions
// v39 - Delegate stable error helpers to Temporal-core4 shared helpers
// v40 - Require shared core error helpers without fallback
// v41 - Use shared core error helpers consistently
// v42 - Call shared core error helpers directly
// v43 - Share Duration unit alias normalization between round and total
// v44 - Match Node Duration.toString for date parts with fractional-only seconds
// v45 - Parenthesize nested sign ternaries for ExtendScript
// v46 - Hide fractional-only seconds when a higher time unit is present
// v47 - Reuse Temporal-core16 rounding-mode validation
// v48-v50 - Superseded incomplete constant-extraction snapshots
// v51 - Rebuild the Temporal-core20 fixed-time constant refactor

(function (Temporal) {

	// ExtendScript target precision is intentionally limited to milliseconds.
	const DURATION_FIELDS = ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];
	const DURATION_UNIT_ALIASES = {
		year: "year",
		years: "year",
		month: "month",
		months: "month",
		week: "week",
		weeks: "week",
		day: "day",
		days: "day",
		hour: "hour",
		hours: "hour",
		minute: "minute",
		minutes: "minute",
		second: "second",
		seconds: "second",
		millisecond: "millisecond",
		milliseconds: "millisecond"
	};
	/**
	 * Checks if the given string is a valid ISO 8601 duration string.
	 *
	 * @param {string} durationString - The duration string to validate.
	 * @returns {boolean} True if the duration string is valid, false otherwise.
	 */
	function isValidDurationString(durationString) {
		const regex = /^[-+]?P(?!$)(?:\d+Y)?(?:\d+M)?(?:\d+W)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$/;
		return regex.test(durationString);
	}

	/**
	 * Parses an ISO 8601 duration string and returns an object representing the duration.
	 *
	 * @param {string} isoString - The ISO 8601 duration string to parse.
	 * @returns {Object} An object representing the parsed duration with the following properties:
	 * @throws {Error} If the provided string is not a valid ISO 8601 duration string.
	 */
	function parseISO8601Duration(isoString) {

		if (!isValidDurationString(isoString)) {
			if (isoString === "P" || isoString === "+P" || isoString === "-P") {
				throw new RangeError("Temporal error: Parsing ended abruptly.");
			};
			if (/T$/.test(isoString)) {
				throw new RangeError("Temporal error: Invalid time duration designator.");
			};
			throw new RangeError('Temporal error: Invalid ISO 8601 duration string');
		}
		// Determine the sign
		const sign = isoString.charAt(0) === ('-') ? -1 : 1;
		// Parse
		const regex = /^[+-]?P(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(?:T(\d+H)?(\d+M)?(?:(\d+(?:\.\d+)?)S)?)?/;
		const match = isoString.match(regex);
		// Parse values (index 0 is the string to parse)
		const years = parseInt(match[1] || '0', 10);
		const months = parseInt(match[2] || '0', 10);
		const weeks = parseInt(match[3] || '0', 10);
		const days = parseInt(match[4] || '0', 10);
		const hours = parseInt(match[5] || '0', 10);
		const minutes = parseInt(match[6] || '0', 10);
		const seconds = parseFloat(match[7] || '0');

		// Extract milliseconds from fractional seconds
		const wholeSeconds = Math.floor(seconds);
		const milliseconds = Math.round((seconds % 1) * Temporal.__MILLISECONDS_PER_SECOND__);

		const isBlank = (years === 0 && months === 0 && weeks === 0 && days === 0 &&
			hours === 0 && minutes === 0 && seconds === 0);

		// Return a Temporal.Duration-like object
		return {
			sign: (isBlank ? 0 : sign),
			blank: isBlank,
			years: isBlank ? 0 : sign * years,
			months: isBlank ? 0 : sign * months,
			weeks: isBlank ? 0 : sign * weeks,
			days: isBlank ? 0 : sign * days,
			hours: isBlank ? 0 : sign * hours,
			minutes: isBlank ? 0 : sign * minutes,
			seconds: isBlank ? 0 : sign * wholeSeconds,
			milliseconds: isBlank ? 0 : sign * milliseconds
		};
	};

	/**
	 * Checks whether a parameter is present in a simple lookup object.
	 *
	 * @param {*} parameter The value to look up.
	 * @param {Object} validKeys Object whose values are accepted parameters.
	 * @throws {TypeError} If either argument is missing.
	 * @returns {boolean} True when the parameter is accepted.
	 */
	function isValidParameter(parameter, validKeys) {
		if (parameter === null || validKeys === null) {
			throw new TypeError('Missing parameter'); // Handle empty inputs
		};

		for (var key in validKeys) {

			if (validKeys[key] === parameter) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Checks that every own key in an object is present in a valid-key lookup.
	 *
	 * @param {Object} parameters Object to validate.
	 * @param {Object} validKeys Object whose keys are accepted.
	 * @throws {TypeError} If either argument is missing.
	 * @returns {boolean} True when all keys are accepted.
	 */
	function isValidParameters(parameters, validKeys) {
		if (parameters === null || validKeys === null) {
			throw new TypeError('Missing parameter'); // Handle empty inputs
		};

		for (var key in parameters) {
			if (!validKeys.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Checks whether an object contains only Duration field names and metadata.
	 *
	 * @param {*} durationLike Candidate object.
	 * @returns {boolean} True when the object has no unknown Duration keys.
	 */
	function isDurationLike(durationLike) {
		if (typeof durationLike !== 'object' || durationLike === null) {
			return false; // Handle non-object inputs
		}

		const validKeys = {
			years: true,
			months: true,
			weeks: true,
			days: true,
			hours: true,
			minutes: true,
			seconds: true,
			milliseconds: true,
			sign: true,
			blank: true
		};

		return isValidParameters(durationLike, validKeys);
	}

	/**
	 * Checks whether an object provides at least one real Duration field.
	 *
	 * @param {Object} durationLike Candidate object.
	 * @returns {boolean} True when any supported Duration field is present.
	 */
	function hasDurationField(durationLike) {
		for (var i = 0; i < DURATION_FIELDS.length; i++) {
			if (durationLike.hasOwnProperty(DURATION_FIELDS[i])) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Normalizes a Duration-like object into integer Duration fields.
	 *
	 * Unknown object keys are ignored, but at least one Duration field is required.
	 *
	 * @param {*} durationLike Object to normalize.
	 * @param {string} nullMessage Error message for null or non-object inputs.
	 * @throws {TypeError} If the object is missing or has no Duration fields.
	 * @throws {RangeError} If a field is not a finite integer or signs are mixed.
	 * @returns {Object} Normalized Duration field record.
	 */
	function normalizeDurationLike(durationLike, nullMessage) {
		if (typeof durationLike !== 'object' || durationLike === null) {
			throw new TypeError(nullMessage || "Temporal error: Duration argument must be Duration or string.");
		};

		if (!hasDurationField(durationLike)) {
			throw new TypeError("Temporal error: Did not provide any valid Duration fields.");
		};

		return normalizeDurationFields(durationLike, true, false);
	}

	/**
	 * Converts raw field values to finite integer Duration fields.
	 *
	 * @param {Object} durationLike Object containing raw field values.
	 * @param {boolean} requireOwnField Whether absent fields should be ignored.
	 * @param {boolean} undefinedIsZero Whether explicit undefined should become zero.
	 * @throws {RangeError} If a field is not a finite integer or signs are mixed.
	 * @returns {Object} Normalized Duration field record.
	 */
	function normalizeDurationFields(durationLike, requireOwnField, undefinedIsZero) {
		var normalized = {};
		for (var i = 0; i < DURATION_FIELDS.length; i++) {
			var field = DURATION_FIELDS[i];
			var hasField = !requireOwnField || durationLike.hasOwnProperty(field);
			var value = (hasField && !(undefinedIsZero && durationLike[field] === undefined)) ? Number(durationLike[field]) : 0;

			if (value !== 0 && (isNaN(value) || !isFinite(value) || Math.floor(value) !== value)) {
				throw new RangeError("Temporal error: Expected finite integer.");
			};
			if (value === 0 && hasField && (isNaN(value) || !isFinite(value))) {
				throw new RangeError("Temporal error: Expected finite integer.");
			};

			normalized[field] = value || 0;
		};

		return checkInputValues(normalized);
	}

	/**
	 * Checks the input values of a given object to ensure they are all integers and have the same sign.
	 * If the values are valid, it sets the `sign` and `blank` properties on the object.
	 * If the values are invalid, it throws a RangeError.
	 *
	 * @param {Object} fields The Duration fields to check.
	 * @throws {RangeError} If the non-zero values have different signs or are not integers.
	 * @returns {Object} The modified object with `sign` and `blank` properties set.
	 */
	function checkInputValues(fields) {
		var allValues = [
			fields.years, fields.months, fields.weeks, fields.days,
			fields.hours, fields.minutes, fields.seconds, fields.milliseconds
		];

		var hasNegative = false;
		var hasPositive = false;
		var allIntegers = true;

		for (var i = 0; i < allValues.length; i++) {
			if (!allValues[i]) continue;
			if (allValues[i] < 0) {
				hasNegative = true;
			} else if (allValues[i] > 0) {
				hasPositive = true;
			}
			if (typeof allValues[i] !== 'number' || isNaN(allValues[i]) || !isFinite(allValues[i]) || Math.floor(allValues[i]) !== allValues[i]) {
				allIntegers = false;
			}
		}

		if (!allIntegers) {
			throw new RangeError("Temporal error: Expected finite integer.");
		}

		if (hasNegative && hasPositive) {
			throw new RangeError("Temporal error: Duration was not valid.");
		}

		fields.sign = fields.sign || ((hasNegative) ? -1 : ((hasPositive) ? 1 : 0));
		fields.blank = fields.sign === 0;

		return fields
	}

	/**
	 * Converts a Duration record to milliseconds, using relativeTo for calendar fields.
	 *
	 * @param {Temporal.Duration|Object} duration Duration-like record.
	 * @param {Temporal.PlainDateTime|Object|string=} relativeTo Calendar anchor.
	 * @throws {RangeError} If year or month fields need a missing relativeTo.
	 * @returns {number} Absolute millisecond magnitude.
	 */
	function durationToMilliseconds(duration, relativeTo) {
		var totalMs = 0;
		var datePartDays = 0;

		if (relativeTo === undefined && (duration.years !== 0 || duration.months !== 0)) {
			throw new RangeError('Missing relativeTo')
		};

		if (duration.years !== 0 || duration.months !== 0) {
			var targetMonth = relativeTo.month + duration.months;
			var targetDate = Temporal.__balanceDateUnits__(relativeTo.year + duration.years, targetMonth, 1);
			var targetDay = Math.min(relativeTo.day, Temporal.__computeDaysInMonth__(targetDate.year, targetDate.month));

			targetDate.day = targetDay;
			datePartDays = Temporal.__daysBetweenDates__(relativeTo, targetDate);
		};

		totalMs += ((datePartDays || 0) * Temporal.__MILLISECONDS_PER_DAY__) +
			((duration.weeks || 0) * Temporal.__MILLISECONDS_PER_WEEK__) +
			((duration.days || 0) * Temporal.__MILLISECONDS_PER_DAY__) +
			((duration.hours || 0) * Temporal.__MILLISECONDS_PER_HOUR__) +
			((duration.minutes || 0) * Temporal.__MILLISECONDS_PER_MINUTE__) +
			((duration.seconds || 0) * Temporal.__MILLISECONDS_PER_SECOND__) +
			(duration.milliseconds || 0);

		return Math.abs(totalMs);
	};

	/**
	 * Computes the calendar date reached by adding years and months to relativeTo.
	 *
	 * @param {Temporal.PlainDateTime|Object} relativeTo Calendar anchor.
	 * @param {number} years Year offset.
	 * @param {number} months Month offset.
	 * @returns {Object} Date record with year, month, and day.
	 */
	function calendarDateFromRelative(relativeTo, years, months) {
		var balanced = Temporal.__balanceDateUnits__(relativeTo.year + years, relativeTo.month + months, 1);
		balanced.day = Math.min(relativeTo.day, Temporal.__computeDaysInMonth__(balanced.year, balanced.month));
		return balanced;
	};

	/**
	 * Counts Gregorian calendar days from relativeTo to a year/month offset.
	 *
	 * @param {Temporal.PlainDateTime|Object} relativeTo Calendar anchor.
	 * @param {number} years Year offset.
	 * @param {number} months Month offset.
	 * @returns {number} Signed number of calendar days.
	 */
	function calendarDaysFromRelative(relativeTo, years, months) {
		return Temporal.__daysBetweenDates__(relativeTo, calendarDateFromRelative(relativeTo, years, months));
	};

	/**
	 * Balances milliseconds back into Duration fields.
	 *
	 * @param {number} ms Signed millisecond count.
	 * @param {Object=} options Balancing options, including relativeTo and largestUnit.
	 * @returns {Object} Duration field record.
	 */
	function millisecondsToDuration(ms, options) {
		const result = {
			years: 0,
			months: 0,
			weeks: 0,
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		};
		const sign = (ms < 0) ? -1 : ((ms > 0) ? 1 : 0);

		var relativeTo;
		var largestUnit = "day";
		var smallestUnit;

		if (options !== undefined) {
			if (options.year !== undefined && options.month !== undefined && options.day !== undefined) {
				relativeTo = options;
				largestUnit = "year";
			} else {
				relativeTo = options.relativeTo;
				largestUnit = options.largestUnit || largestUnit;
				smallestUnit = options.smallestUnit;
			}
		};

		if (largestUnit === "hour" || largestUnit === "minute" || largestUnit === "second" || largestUnit === "millisecond") {
			return millisecondsToTimeDuration(ms, largestUnit);
		};

		var remaining = Math.abs(ms);
		var wholeDays = Math.floor(remaining / Temporal.__MILLISECONDS_PER_DAY__);
		remaining = remaining % Temporal.__MILLISECONDS_PER_DAY__;

		if (relativeTo !== undefined && (largestUnit === "year" || largestUnit === "month")) {
			relativeTo = Temporal.PlainDateTime.from(relativeTo);

			if (largestUnit === "year") {
				var yearGuess = Math.floor(wholeDays / 365.2425);
				result.years = sign * yearGuess;

				while (Math.abs(calendarDaysFromRelative(relativeTo, result.years + sign, 0)) <= wholeDays) {
					result.years += sign;
				};
				while (Math.abs(calendarDaysFromRelative(relativeTo, result.years, 0)) > wholeDays) {
					result.years -= sign;
				};
			};

			var usedDays = Math.abs(calendarDaysFromRelative(relativeTo, result.years, 0));
			var monthGuess = Math.floor((wholeDays - usedDays) / 30.436875);
			result.months = sign * monthGuess;

			while (Math.abs(calendarDaysFromRelative(relativeTo, result.years, result.months + sign)) <= wholeDays) {
				result.months += sign;
			};
			while (Math.abs(calendarDaysFromRelative(relativeTo, result.years, result.months)) > wholeDays) {
				result.months -= sign;
			};

			usedDays = calendarDaysFromRelative(relativeTo, result.years, result.months);
			result.days = sign * (wholeDays - Math.abs(usedDays));
			if (smallestUnit === "week") {
				result.weeks = sign * Math.round(Math.abs(result.days) / 7);
				result.days = 0;
			};
		} else if (largestUnit === "week") {
			result.weeks = sign * Math.floor(wholeDays / 7);
			result.days = sign * (wholeDays % 7);
		} else {
			result.days = sign * wholeDays;
		};

		result.hours = sign * Math.floor(remaining / Temporal.__MILLISECONDS_PER_HOUR__); remaining = remaining % Temporal.__MILLISECONDS_PER_HOUR__;
		result.minutes = sign * Math.floor(remaining / Temporal.__MILLISECONDS_PER_MINUTE__); remaining = remaining % Temporal.__MILLISECONDS_PER_MINUTE__;
		result.seconds = sign * Math.floor(remaining / Temporal.__MILLISECONDS_PER_SECOND__);
		result.milliseconds = sign * (remaining % Temporal.__MILLISECONDS_PER_SECOND__);

		return result;
	};

	/**
	 * Creates a Temporal.Duration instance with millisecond precision.
	 *
	 * @constructor
	 * @param {number=} years Years component.
	 * @param {number=} months Months component.
	 * @param {number=} weeks Weeks component.
	 * @param {number=} days Days component.
	 * @param {number=} hours Hours component.
	 * @param {number=} minutes Minutes component.
	 * @param {number=} seconds Seconds component.
	 * @param {number=} milliseconds Milliseconds component.
	 * @throws {TypeError} If called without new.
	 * @throws {RangeError} If fields are not finite integers or signs are mixed.
	 */
	Temporal.Duration = function (years, months, weeks, days, hours, minutes, seconds, milliseconds, sign, blank) {
		if (!(this instanceof Temporal.Duration)) {
			throw new TypeError("Method invoked on an object that is not Temporal.Duration.");
		};

		var normalized = normalizeDurationFields({
			years: years,
			months: months,
			weeks: weeks,
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
			milliseconds: milliseconds
		}, false, true);

		this.years = normalized.years;
		this.months = normalized.months;
		this.weeks = normalized.weeks;
		this.days = normalized.days;
		this.hours = normalized.hours;
		this.minutes = normalized.minutes;
		this.seconds = normalized.seconds;
		this.milliseconds = normalized.milliseconds;
		this.sign = normalized.sign;
		this.blank = normalized.blank;

		if (arguments.length === 0) {
			return this
		};

		return this
	};

	/**
	 * @returns {string} A string representation of the duration in ISO 8601 format.
	 */
	Temporal.Duration.prototype.toString = function (options) {
		if (options !== undefined) {
			return durationToStringWithOptions(this, options);
		};

		if (this.blank) {
			return 'PT0S'
		};

		var result = 'P';
		if (this.years) result += Math.abs(this.years) + 'Y';
		if (this.months) result += Math.abs(this.months) + 'M';
		if (this.weeks) result += Math.abs(this.weeks) + 'W';
		if (this.days) result += Math.abs(this.days) + 'D';

		var hasHigherUnit = !!(this.years || this.months || this.weeks || this.days || this.hours || this.minutes);
		var shouldShowFractionOnlySeconds = !hasHigherUnit || this.seconds !== 0;

		if (this.hours || this.minutes || this.seconds || (this.milliseconds && shouldShowFractionOnlySeconds)) {
			result += 'T';
			if (this.hours) result += Math.abs(this.hours) + 'H';
			if (this.minutes) result += Math.abs(this.minutes) + 'M';
			if (this.seconds !== 0 || (Math.abs(this.milliseconds) !== 0 && shouldShowFractionOnlySeconds)) {
				var secs = Math.abs(this.seconds * Temporal.__MILLISECONDS_PER_SECOND__ + this.milliseconds) / Temporal.__MILLISECONDS_PER_SECOND__;
				result += secs.toFixed(3).replace(/\.?0+$/, '') + "S"; // Trim trailing zeros
			}
		};

		result = (this.sign === -1 ? '-' + result : result);

		return result;
	};

	/**
	 * Serializes the Duration as an ISO 8601 duration string.
	 *
	 * @returns {string} ISO 8601 duration string.
	 */
	Temporal.Duration.prototype.toJSON = function () {
		return this.toString();
	};

	/**
	 * Returns a locale string for the Duration.
	 *
	 * ExtendScript has no Intl.DurationFormat, so this intentionally aliases toString().
	 *
	 * @returns {string} ISO 8601 duration string.
	 */
	Temporal.Duration.prototype.toLocaleString = function () {
		return this.toString();
	};

	/**
	 * Creates a Duration from another Duration, a string, or a Duration-like object.
	 *
	 * @param {Temporal.Duration|string|Object} value Source value.
	 * @throws {TypeError} If the source is missing or unsupported.
	 * @throws {RangeError} If the source contains invalid Duration values.
	 * @returns {Temporal.Duration} New Duration instance.
	 */
	Temporal.Duration.from = function (value) {
		var duration;

		// Empty
		if (value === undefined || value === null) {
			throw new TypeError("Temporal error: Duration argument must be Duration or string.");

			// Temporal.Duration object
		} else if (value instanceof Temporal.Duration) {
			duration = value;

			// Other object.
		} else if (typeof value === 'object' && value !== null) {
			duration = normalizeDurationLike(value);

			// Temporal.Duration string format
		} else if (typeof value === 'string') {
			duration = parseISO8601Duration(value);

			// Any other cases
		} else {
			throw new TypeError("Temporal error: Duration argument must be Duration or string.");
		};

		const isBlank = (duration.years === 0 && duration.months === 0 && duration.weeks === 0 && duration.days === 0 &&
			duration.hours === 0 && duration.minutes === 0 && duration.seconds === 0 && duration.milliseconds === 0);

		duration.sign = isBlank ? 0 : duration.sign;
		duration.blank = isBlank;
		return new Temporal.Duration(
			duration.years || 0,
			duration.months || 0,
			duration.weeks || 0,
			duration.days || 0,
			duration.hours || 0,
			duration.minutes || 0,
			duration.seconds || 0,
			duration.milliseconds || 0,
			duration.sign,
			duration.blank
		);
	};

	/**
	 * Compares two Durations.
	 *
	 * Calendar units require a relativeTo option unless both Duration fields match exactly.
	 *
	 * @param {Temporal.Duration|string|Object} one First Duration-like value.
	 * @param {Temporal.Duration|string|Object} two Second Duration-like value.
	 * @param {Object=} options Optional compare options.
	 * @throws {RangeError} If calendar units cannot be compared without relativeTo.
	 * @returns {number} -1, 0, or 1.
	 */
	Temporal.Duration.compare = function (one, two, options) {
		var oneD = Temporal.Duration.from(one);
		var twoD = Temporal.Duration.from(two);
		var relativeTo;
		var oneMs;
		var twoMs;

		if (options !== undefined && options !== null && options.relativeTo !== undefined) {
			relativeTo = Temporal.PlainDateTime.from(options.relativeTo);
		};

		if (relativeTo === undefined && (hasCalendarUnit(oneD, true) || hasCalendarUnit(twoD, true))) {
			if (sameDurationFields(oneD, twoD)) {
				return 0;
			};
			if (options === null) {
				throw new TypeError("Temporal error: Option must be object: relativeTo.");
			};
			throw new RangeError("Temporal error: ");
		};

		oneMs = signedDurationMilliseconds(oneD, relativeTo);
		twoMs = signedDurationMilliseconds(twoD, relativeTo);

		if (oneMs > twoMs) return 1;
		if (oneMs < twoMs) return -1;
		return 0;
	};

	/**
	 * Returns a copy of this Duration with selected fields replaced.
	 *
	 * @param {Object} durationLike Duration fields to replace.
	 * @throws {TypeError} If no Duration fields are supplied.
	 * @throws {RangeError} If replacement fields produce mixed signs or invalid values.
	 * @returns {Temporal.Duration} New Duration instance.
	 */
	Temporal.Duration.prototype.with = function (durationLike) {
		// Copy this
		var newDuration = Temporal.__copyFields__(this);
		var changes = normalizeDurationLike(durationLike, "Temporal error: Must provide a duration.");

		// Check signs
		for (var i = 0; i < DURATION_FIELDS.length; i++) {
			var key = DURATION_FIELDS[i];
			if (durationLike.hasOwnProperty(key)) {
				newDuration[key] = changes[key];
			}
		};

		// return a new Duration
		if (checkInputValues(newDuration)) {
			return Temporal.Duration.from(newDuration);
		};

		return this;
	};

	/**
	 * Adds another Duration to this Duration.
	 *
	 * Calendar units are rejected for Duration-to-Duration addition.
	 *
	 * @param {Temporal.Duration|string|Object} other Duration-like value to add.
	 * @throws {RangeError} If either Duration contains calendar units.
	 * @returns {Temporal.Duration} Sum Duration.
	 */
	Temporal.Duration.prototype.add = function (other) {
		const toAdd = Temporal.Duration.from(other);
		const thisD = Temporal.__copyFields__(this);
		const toAddD = Temporal.__copyFields__(toAdd);
		if (hasCalendarUnit(thisD, true) || hasCalendarUnit(toAddD, true)) {
			throw new RangeError("Temporal error: Largest unit cannot be a calendar unit when adding two durations.");
		};
		const thisMs = signedDurationMilliseconds(thisD);
		const toAddMs = signedDurationMilliseconds(toAddD);
		const result = millisecondsToDuration(thisMs + toAddMs, {
			largestUnit: largestAddSubtractTimeUnit(thisD, toAddD)
		});

		return Temporal.Duration.from(result)
	};

	/**
	 * Subtracts another Duration from this Duration.
	 *
	 * @param {Temporal.Duration|string|Object} other Duration-like value to subtract.
	 * @returns {Temporal.Duration} Difference Duration.
	 */
	Temporal.Duration.prototype.subtract = function (other) {
		const toSub = Temporal.Duration.from(other).negated();

		return this.add(toSub);
	};

	/**
	 * Returns the Duration with all fields negated.
	 *
	 * @returns {Temporal.Duration} Negated Duration.
	 */
	Temporal.Duration.prototype.negated = function () {
		const negated = Temporal.__copyFields__(this);
		negated.sign = -negated.sign;
		negated.years = -negated.years;
		negated.months = -negated.months;
		negated.weeks = -negated.weeks;
		negated.days = -negated.days;
		negated.hours = -negated.hours;
		negated.minutes = -negated.minutes;
		negated.seconds = -negated.seconds
		negated.milliseconds = -negated.milliseconds;

		return Temporal.Duration.from(negated)
	};

	/**
	 * Returns the absolute value of the Duration.
	 *
	 * @returns {Temporal.Duration} Absolute Duration.
	 */
	Temporal.Duration.prototype.abs = function () {
		const absolut = Temporal.__copyFields__(this);
		absolut.sign = Math.abs(absolut.sign);
		absolut.years = Math.abs(absolut.years);
		absolut.months = Math.abs(absolut.months);
		absolut.weeks = Math.abs(absolut.weeks);
		absolut.days = Math.abs(absolut.days);
		absolut.hours = Math.abs(absolut.hours);
		absolut.minutes = Math.abs(absolut.minutes);
		absolut.seconds = Math.abs(absolut.seconds);
		absolut.milliseconds = Math.abs(absolut.milliseconds);

		return Temporal.Duration.from(absolut)
	};

	/**
	 * Rounds the Duration using Temporal-style rounding options.
	 *
	 * @param {string|Object} roundTo Smallest unit string or round options object.
	 * @throws {TypeError} If roundTo is missing or not an object/string.
	 * @throws {RangeError} If units, increments, or calendar options are invalid.
	 * @returns {Temporal.Duration} Rounded Duration.
	 */
	Temporal.Duration.prototype.round = function (roundTo) {
		var smallestUnit, roundingIncrement, roundingMode, relativeTo, largestUnit;
		// Allowed units
		const allowedUnits = { year: 8, month: 7, week: 6, day: 5, hour: 4, minute: 3, second: 2, millisecond: 1, auto: 0 };

		// Process options.
		if (roundTo === undefined) {
			throw new TypeError("Temporal error: Must specify a roundTo parameter.");
		} else if (roundTo === null) {
			throw new TypeError("Temporal error: roundTo must be an object.");
		} else if (typeof roundTo === "string") {
			smallestUnit = normalizeDurationUnit(roundTo, "round", "smallestUnit");
			largestUnit = "day";
			roundingIncrement = 1;
			roundingMode = "halfExpand";
		} else if (typeof roundTo === "object" && roundTo !== null) {
			if (!("smallestUnit" in roundTo) && !("largestUnit" in roundTo)) {
				throw new RangeError("Temporal error: smallestUnit and largestUnit cannot both be None.");
			};
			smallestUnit = ("smallestUnit" in roundTo) ? normalizeDurationUnit(roundTo.smallestUnit, "round", "smallestUnit") : "millisecond";
			roundingIncrement = ("roundingIncrement" in roundTo) ? Number(roundTo.roundingIncrement) : 1;
			roundingMode = ("roundingMode" in roundTo && roundTo.roundingMode !== undefined) ? roundTo.roundingMode : "halfExpand";
			relativeTo = roundTo.relativeTo;
			largestUnit = ("largestUnit" in roundTo && roundTo.largestUnit !== undefined) ? normalizeDurationUnit(roundTo.largestUnit, "round", "largestUnit", true) : "auto";
			if (largestUnit === "auto") {
				largestUnit = largestUnitOfDuration(this, smallestUnit, allowedUnits);
			};
			if ((largestUnit === 'week' || largestUnit === 'month' || largestUnit === 'year') && roundTo.relativeTo === undefined) {
				throw new RangeError("Temporal error: largestUnit when rounding Duration was not the largest provided unit");
			};
			if (allowedUnits[smallestUnit] > allowedUnits[largestUnit]) {
				throw new RangeError("Temporal error: smallestUnit is larger than largestUnit.");
			};
		} else {
			throw new TypeError("Temporal error: roundTo must be an object.");
		}

		if (!allowedUnits[smallestUnit]) {
			throw new RangeError("Value " + smallestUnit + " out of range for Temporal.Duration.prototype.round options property smallestUnit");
		};
		if (!Temporal.__isValidRoundingMode__(roundingMode)) {
			throw new RangeError("Value " + roundingMode + " out of range for Temporal.Duration.prototype.round options property roundingMode");
		};
		if (isNaN(roundingIncrement) || !isFinite(roundingIncrement)) {
			throw new RangeError("Temporal error: Expected finite integer.");
		};
		if (roundingIncrement !== Math.floor(roundingIncrement) || roundingIncrement < 1) {
			throw new RangeError("Temporal error: Integer out of range.");
		};
		validateRoundingIncrement(roundingIncrement, smallestUnit);

		var totalMs;
		if (relativeTo !== undefined) {
			var start = Temporal.PlainDateTime.from(relativeTo);
			totalMs = (this.sign === -1 ? -1 : 1) * durationToMilliseconds(Temporal.Duration.from(this), start);
		} else {
			// For time-only durations without calendar fields, use fixed conversion.
			totalMs =
				((this.days || 0) * Temporal.__MILLISECONDS_PER_DAY__) +
				((this.hours || 0) * Temporal.__MILLISECONDS_PER_HOUR__) +
				((this.minutes || 0) * Temporal.__MILLISECONDS_PER_MINUTE__) +
				((this.seconds || 0) * Temporal.__MILLISECONDS_PER_SECOND__) +
				(this.milliseconds || 0);
		}

		// Determine the conversion factor (in milliseconds) for the chosen smallest unit.
		var unitMs;
		if (smallestUnit === "day") {
			unitMs = Temporal.__MILLISECONDS_PER_DAY__;
		} else if (smallestUnit === "hour") {
			unitMs = Temporal.__MILLISECONDS_PER_HOUR__;
		} else if (smallestUnit === "minute") {
			unitMs = Temporal.__MILLISECONDS_PER_MINUTE__;
		} else if (smallestUnit === "second") {
			unitMs = Temporal.__MILLISECONDS_PER_SECOND__;
		} else { // "millisecond"
			unitMs = 1;
		}

		var incrementMs = roundingIncrement * unitMs;
		var quotient = totalMs / incrementMs;
		var roundedQuotient;

		// Apply the rounding mode.
		if (roundingMode === "floor") {
			roundedQuotient = Math.floor(quotient);
		} else if (roundingMode === "ceil") {
			roundedQuotient = Math.ceil(quotient);
		} else if (roundingMode === "expand") {
			roundedQuotient = quotient > 0 ? Math.ceil(quotient) : Math.floor(quotient);
		} else if (roundingMode === "trunc") {
			roundedQuotient = (quotient < 0 ? Math.ceil(quotient) : Math.floor(quotient));
		} else if (roundingMode === "halfCeil") {
			roundedQuotient = (quotient % 1 === 0.5 || quotient % 1 === -0.5) ? Math.ceil(quotient) : Math.round(quotient);
		} else if (roundingMode === "halfFloor") {
			roundedQuotient = (quotient % 1 === 0.5 || quotient % 1 === -0.5) ? Math.floor(quotient) : Math.round(quotient);
		} else if (roundingMode === "halfExpand") {
			roundedQuotient = (quotient >= 0 ? Math.floor(quotient + 0.5) : Math.ceil(quotient - 0.5));
		} else if (roundingMode === "halfTrunc") {
			if (quotient % 1 === 0.5 || quotient % 1 === -0.5) {
				roundedQuotient = quotient > 0 ? Math.floor(quotient) : Math.ceil(quotient);
			} else {
				roundedQuotient = Math.round(quotient);
			};
		} else if (roundingMode === "halfEven") {
			const baseRound = Math.round(quotient);
			if (quotient % 1 === 0.5 || quotient % 1 === -0.5) {
				roundedQuotient = (baseRound * incrementMs) % (2 * incrementMs) === 0 ? baseRound : baseRound - 1;
			} else {
				roundedQuotient = baseRound;
			}
		} else {
			throw new RangeError("Invalid rounding mode: " + roundingMode);
		}

		var roundedTotalMs = roundedQuotient * incrementMs;

		return Temporal.Duration.from(millisecondsToDuration(roundedTotalMs, {
			relativeTo: relativeTo,
			largestUnit: largestUnit,
			smallestUnit: smallestUnit
		}));
	};


	/**
	 * Checks whether a unit is a time-only unit.
	 *
	 * @param {string} unit Unit name.
	 * @returns {boolean} True for hour through millisecond.
	 */
	function isTimeUnit(unit) {
		const validUnits = { hour: true, minute: true, second: true, millisecond: true };
		return (unit in validUnits);
	};

	/**
	 * Checks whether a unit is day or a time-only unit.
	 *
	 * @param {string} unit Unit name.
	 * @returns {boolean} True for day through millisecond.
	 */
	function isTimeUnitWithDay(unit) {
		const validUnits = { day: true, hour: true, minute: true, second: true, millisecond: true };
		return (unit in validUnits);
	};

	/**
	 * Checks whether a unit is a date unit.
	 *
	 * @param {string} unit Unit name.
	 * @returns {boolean} True for year through day.
	 */
	function isDateUnit(unit) {
		const validUnits = { year: true, month: true, week: true, day: true };
		return (unit in validUnits);
	};

	/**
	 * Checks whether a unit is a calendar unit excluding day.
	 *
	 * @param {string} unit Unit name.
	 * @returns {boolean} True for year, month, or week.
	 */
	function isDateUnitWithoutDay(unit) {
		const validUnits = { year: true, month: true, week: true };
		return (unit in validUnits);
	};

	/**
	 * Checks whether a unit is supported by Duration date/time math.
	 *
	 * @param {string} unit Unit name.
	 * @returns {boolean} True for supported date and time units.
	 */
	function isDateTimeUnit(unit) {
		const validUnits = { year: true, month: true, week: true, day: true, hour: true, minute: true, second: true, millisecond: true };
		return (unit in validUnits);
	};

	/**
	 * Normalizes singular and plural Duration unit names.
	 *
	 * @param {*} unit Unit value.
	 * @param {string} methodName Duration method used in error messages.
	 * @param {string} propertyName Option property used in error messages.
	 * @param {boolean=} allowAuto Whether auto is accepted.
	 * @throws {RangeError} If the unit is not accepted.
	 * @returns {string} Singular normalized unit.
	 */
	function normalizeDurationUnit(unit, methodName, propertyName, allowAuto) {
		if (allowAuto && unit === "auto") {
			return "auto";
		};
		if (DURATION_UNIT_ALIASES.hasOwnProperty(unit)) {
			return DURATION_UNIT_ALIASES[unit];
		};

		throw new RangeError("Value " + unit + " out of range for Temporal.Duration.prototype." + methodName + " options property " + propertyName);
	};

	/**
	 * Finds the largest non-zero unit in a Duration.
	 *
	 * @param {Temporal.Duration|Object} duration Duration record.
	 * @param {string=} fallbackUnit Unit to use when it is larger than the first non-zero field.
	 * @param {Object} unitRank Ranking lookup for units.
	 * @returns {string} Largest unit name.
	 */
	function largestUnitOfDuration(duration, fallbackUnit, unitRank) {
		const units = ["year", "month", "week", "day", "hour", "minute", "second", "millisecond"];
		const fields = ["years", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];

		for (var i = 0; i < fields.length; i++) {
			if (duration[fields[i]] !== 0) {
				if (fallbackUnit && unitRank[units[i]] < unitRank[fallbackUnit]) {
					return fallbackUnit;
				};
				return units[i];
			}
		};

		return fallbackUnit || "millisecond";
	};

	/**
	 * Validates a rounding increment for the selected smallest unit.
	 *
	 * @param {number} roundingIncrement Increment value.
	 * @param {string} smallestUnit Smallest unit.
	 * @throws {RangeError} If the increment is too large or does not divide the unit.
	 */
	function validateRoundingIncrement(roundingIncrement, smallestUnit) {
		var maximum;

		if (smallestUnit === "hour") {
			maximum = 24;
		} else if (smallestUnit === "minute" || smallestUnit === "second") {
			maximum = 60;
		} else if (smallestUnit === "millisecond") {
			maximum = 1000;
		};

		if (maximum !== undefined) {
			if (roundingIncrement > maximum) {
				throw new RangeError("Temporal error: roundingIncrement exceeds maximum");
			};
			if (maximum % roundingIncrement !== 0) {
				throw new RangeError("Temporal error: dividend is not divisible by roundingIncrement");
			};
		};
	};

	/**
	 * Checks whether a Duration contains calendar units.
	 *
	 * @param {Temporal.Duration|Object} duration Duration record.
	 * @param {boolean} includeWeeks Whether weeks count as calendar units.
	 * @returns {boolean} True when calendar fields are non-zero.
	 */
	function hasCalendarUnit(duration, includeWeeks) {
		return duration.years !== 0 || duration.months !== 0 || (includeWeeks && duration.weeks !== 0);
	};

	/**
	 * Converts a Duration to signed milliseconds.
	 *
	 * @param {Temporal.Duration|Object} duration Duration record.
	 * @param {Temporal.PlainDateTime|Object|string=} relativeTo Calendar anchor.
	 * @returns {number} Signed millisecond count.
	 */
	function signedDurationMilliseconds(duration, relativeTo) {
		return (duration.sign === -1 ? -1 : 1) * durationToMilliseconds(duration, relativeTo);
	};

	/**
	 * Checks whether two Duration records have identical supported fields.
	 *
	 * @param {Temporal.Duration|Object} one First Duration.
	 * @param {Temporal.Duration|Object} two Second Duration.
	 * @returns {boolean} True when all supported fields match.
	 */
	function sameDurationFields(one, two) {
		for (var i = 0; i < DURATION_FIELDS.length; i++) {
			var field = DURATION_FIELDS[i];
			if (one[field] !== two[field]) {
				return false;
			};
		};
		return true;
	};

	/**
	 * Finds the largest time unit that should be preserved for add/subtract.
	 *
	 * @param {Temporal.Duration|Object} one First Duration.
	 * @param {Temporal.Duration|Object} two Second Duration.
	 * @returns {string} Largest time unit name.
	 */
	function largestAddSubtractTimeUnit(one, two) {
		var units = ["day", "hour", "minute", "second", "millisecond"];
		var fields = ["days", "hours", "minutes", "seconds", "milliseconds"];

		for (var i = 0; i < fields.length; i++) {
			if (one[fields[i]] !== 0 || two[fields[i]] !== 0) {
				return units[i];
			};
		};
		return "millisecond";
	};

	/**
	 * Formats a Duration with the supported toString options subset.
	 *
	 * @param {Temporal.Duration} duration Duration to format.
	 * @param {Object} options Formatting options.
	 * @throws {RangeError} If unsupported or invalid options are supplied.
	 * @returns {string} ISO 8601 duration string.
	 */
	function durationToStringWithOptions(duration, options) {
		var smallestUnit = options.smallestUnit;
		var fractionalSecondDigits = options.fractionalSecondDigits;
		var roundingMode = options.roundingMode || "trunc";
		var rounded = duration;

		if (smallestUnit === "hour" || smallestUnit === "minute") {
			throw new RangeError("Temporal error: string rounding options cannot have hour or minute smallest unit.");
		};

		if (fractionalSecondDigits !== undefined && fractionalSecondDigits !== "auto") {
			fractionalSecondDigits = Number(fractionalSecondDigits);
			if (isNaN(fractionalSecondDigits) || !isFinite(fractionalSecondDigits) || Math.floor(fractionalSecondDigits) !== fractionalSecondDigits || fractionalSecondDigits < 0 || fractionalSecondDigits > 3) {
				throw new RangeError("fractionalSecondDigits value is out of range.");
			};
		};

		if (smallestUnit === "second") {
			rounded = duration.round({ smallestUnit: "second", roundingMode: roundingMode });
		};

		var result = rounded.toString();

		if (fractionalSecondDigits === undefined || fractionalSecondDigits === "auto") {
			return result;
		};

		if (fractionalSecondDigits === 0) {
			if (smallestUnit !== "second") {
				rounded = duration.round({ smallestUnit: "second", roundingMode: roundingMode });
				result = rounded.toString();
			};
			return result.replace(/\.\d+S$/, "S");
		};

		var sign = rounded.sign === -1 ? "-" : "";
		var millis = Math.abs(rounded.milliseconds || 0);
		var seconds = Math.abs(rounded.seconds || 0);
		var text = result;
		var fraction = ("00" + millis).slice(-3).slice(0, fractionalSecondDigits);

		if (millis === 0 && seconds === 0 && result.indexOf("T") === -1) {
			return result;
		};

		if (/\d+(?:\.\d+)?S$/.test(text)) {
			text = text.replace(/(\d+)(?:\.\d+)?S$/, "$1." + fraction + "S");
		} else {
			text = sign + result.replace(/^-/, "");
			if (text.indexOf("T") === -1) {
				text += "T";
			};
			text += "0." + fraction + "S";
		};

		return text;
	};

	/**
	 * Balances milliseconds into time fields while preserving a largest time unit.
	 *
	 * @param {number} ms Signed millisecond count.
	 * @param {string} largestUnit Largest time unit to preserve.
	 * @returns {Object} Duration field record.
	 */
	function millisecondsToTimeDuration(ms, largestUnit) {
		const result = {
			years: 0,
			months: 0,
			weeks: 0,
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		};
		const sign = (ms < 0) ? -1 : ((ms > 0) ? 1 : 0);
		var remaining = Math.abs(ms);

		if (largestUnit === "millisecond") {
			result.milliseconds = sign * remaining;
			return result;
		};
		if (largestUnit === "second") {
			result.seconds = sign * Math.floor(remaining / Temporal.__MILLISECONDS_PER_SECOND__);
			result.milliseconds = sign * (remaining % Temporal.__MILLISECONDS_PER_SECOND__);
			return result;
		};
		if (largestUnit === "minute") {
			result.minutes = sign * Math.floor(remaining / Temporal.__MILLISECONDS_PER_MINUTE__);
			remaining = remaining % Temporal.__MILLISECONDS_PER_MINUTE__;
			result.seconds = sign * Math.floor(remaining / Temporal.__MILLISECONDS_PER_SECOND__);
			result.milliseconds = sign * (remaining % Temporal.__MILLISECONDS_PER_SECOND__);
			return result;
		};
		if (largestUnit === "hour") {
			result.hours = sign * Math.floor(remaining / Temporal.__MILLISECONDS_PER_HOUR__);
			remaining = remaining % Temporal.__MILLISECONDS_PER_HOUR__;
			result.minutes = sign * Math.floor(remaining / Temporal.__MILLISECONDS_PER_MINUTE__);
			remaining = remaining % Temporal.__MILLISECONDS_PER_MINUTE__;
			result.seconds = sign * Math.floor(remaining / Temporal.__MILLISECONDS_PER_SECOND__);
			result.milliseconds = sign * (remaining % Temporal.__MILLISECONDS_PER_SECOND__);
			return result;
		};

		return millisecondsToDuration(ms);
	};

	/**
	 * Checks whether a Duration contains years or months.
	 *
	 * @param {Temporal.Duration|Object} duration Duration record.
	 * @returns {boolean} True when years or months are non-zero.
	 */
	function hasYearsOrMonths(duration) {
		return duration.years !== 0 || duration.months !== 0;
	};

	/**
	 * Computes a fractional year or month total from milliseconds.
	 *
	 * @param {number} totalMilliseconds Absolute millisecond count.
	 * @param {Temporal.PlainDateTime} relativeTo Calendar anchor.
	 * @param {string} unit Calendar unit, year or month.
	 * @param {number} sign Duration sign.
	 * @returns {number} Absolute fractional calendar total.
	 */
	function totalCalendarUnit(totalMilliseconds, relativeTo, unit, sign) {
		var balanced = millisecondsToDuration((sign < 0 ? -1 : 1) * totalMilliseconds, {
			relativeTo: relativeTo,
			largestUnit: unit
		});
		var usedDays;
		var remainingMs;
		var unitMs;
		var nextMarkerDays;

		if (unit === "year") {
			usedDays = Math.abs(calendarDaysFromRelative(relativeTo, balanced.years, 0));
			remainingMs = totalMilliseconds - usedDays * Temporal.__MILLISECONDS_PER_DAY__;

			if (remainingMs === 0) {
				return Math.abs(balanced.years);
			};

			nextMarkerDays = Math.abs(calendarDaysFromRelative(relativeTo, balanced.years + (sign < 0 ? -1 : 1), 0));
			unitMs = (nextMarkerDays - usedDays) * Temporal.__MILLISECONDS_PER_DAY__;
			return Math.abs(balanced.years) + remainingMs / unitMs;
		};

		if (unit === "month") {
			usedDays = Math.abs(calendarDaysFromRelative(relativeTo, 0, balanced.months));
			remainingMs = totalMilliseconds - usedDays * Temporal.__MILLISECONDS_PER_DAY__;

			if (remainingMs === 0) {
				return Math.abs(balanced.months);
			};

			nextMarkerDays = Math.abs(calendarDaysFromRelative(relativeTo, 0, balanced.months + (sign < 0 ? -1 : 1)));
			unitMs = (nextMarkerDays - usedDays) * Temporal.__MILLISECONDS_PER_DAY__;
			return Math.abs(balanced.months) + remainingMs / unitMs;
		};
	};

	/**
	 * Computes the total length of the Duration in a requested unit.
	 *
	 * @param {string|Object} totalOf Unit string or options object with unit and relativeTo.
	 * @throws {TypeError} If totalOf is missing or null.
	 * @throws {RangeError} If the unit or required relativeTo is invalid.
	 * @returns {number} Total in the requested unit.
	 */
	Temporal.Duration.prototype.total = function (totalOf) {
		const sign = this.sign;
		const thisD = Temporal.Duration.from(this)//.abs();
		var theUnit;
		var relativeToCopy;

		var totalMilliseconds;
		var result = 0;

		if (totalOf === undefined) {
			throw new TypeError("Temporal error: Must specify a totalOf parameter");
		};

		if (totalOf === null) {
			throw new TypeError("Temporal error: totalOf must be an object.");
		};

		if (typeof totalOf !== "string" && typeof totalOf !== "object") {
			throw new RangeError("Value " + totalOf + " out of range for Temporal.Duration.prototype.total options property unit");
		};

		theUnit = normalizeDurationUnit((typeof totalOf === "string") ? totalOf : totalOf.unit, "total", "unit");

		if (typeof totalOf === "object" && totalOf.relativeTo !== undefined) {
			relativeToCopy = Temporal.PlainDateTime.from(totalOf.relativeTo);
		};

		if ((theUnit === "year" || theUnit === "month") && relativeToCopy === undefined) {
			throw new RangeError("Temporal error: ");
		};

		if (hasCalendarUnit(thisD, true) && relativeToCopy === undefined) {
			throw new RangeError("Temporal error: ");
		};

		if (relativeToCopy !== undefined) {
			totalMilliseconds = durationToMilliseconds(thisD, relativeToCopy);
		} else {
			totalMilliseconds = durationToMilliseconds(thisD);
		};

		switch (theUnit) {
			case "year":
				result = totalCalendarUnit(totalMilliseconds, relativeToCopy, "year", sign);
				break;
			case "month":
				result = totalCalendarUnit(totalMilliseconds, relativeToCopy, "month", sign);
				break;
			case "week":
				result = totalMilliseconds / Temporal.__MILLISECONDS_PER_WEEK__;
				break;
			case "day":
				result = totalMilliseconds / Temporal.__MILLISECONDS_PER_DAY__;
				break;
			case "hour":
				result = totalMilliseconds / Temporal.__MILLISECONDS_PER_HOUR__;
				break;
			case "minute":
				result = totalMilliseconds / Temporal.__MILLISECONDS_PER_MINUTE__;
				break;
			case "second":
				result = totalMilliseconds / Temporal.__MILLISECONDS_PER_SECOND__;
				break;
			case "millisecond":
				result = totalMilliseconds;
		};

		return (sign === -1 ? -1 : 1) * result;
	};

	/**
	 * Prevents numeric coercion of Duration instances.
	 *
	 * Temporal.Duration values cannot be compared with numeric relational operators.
	 *
	 * @throws {TypeError} Always.
	 * @returns {never}
	 */
	Temporal.Duration.prototype.valueOf = function () {
		throw new TypeError('Cannot use valueOf')
	};

})(Temporal);
