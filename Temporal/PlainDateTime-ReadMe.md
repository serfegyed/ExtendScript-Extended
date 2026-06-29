# Temporal.PlainDateTime

`Lib/Temporal.PlainDateTime.js` is the date-time object for this ExtendScript/InDesign-focused Temporal subset. It represents an ISO/Gregorian calendar date and a millisecond-precision wall-clock time, without a time zone.

This is not a full Temporal.PlainDateTime polyfill. The goal is stable date-time arithmetic, ISO parsing/formatting, and Duration interop for practical InDesign scripting.

## References

- [TC39 Temporal.PlainDateTime documentation](https://tc39.es/proposal-temporal/docs/plaindatetime.html)
- [MDN Temporal.PlainDateTime reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDateTime)

## Files

- Active implementation: `Lib/Temporal.PlainDateTime.js`
- Tests: `Test/tests-PlainDateTime.js`
- Required includes: `Lib/Temporal-core.js`, `Lib/Temporal.Duration.js`, `Lib/Temporal.PlainTime.js`, `Lib/Temporal.PlainDate.js`, `Lib/Temporal.PlainDateTime.js`

```javascript
//@include "Lib/Temporal-core.js"
//@include "Lib/Temporal.Duration.js"
//@include "Lib/Temporal.PlainTime.js"
//@include "Lib/Temporal.PlainDate.js"
//@include "Lib/Temporal.PlainDateTime.js"
```

## Role In This Subset

`Temporal.PlainDateTime` is a date-time value with no time zone and no calendar object.

Supported focus:

- ISO date-time string parsing
- Gregorian calendar validation
- leap-year and month-end handling
- millisecond precision
- Duration addition and subtraction
- differences between two PlainDateTime values
- ISO string formatting

Out of scope:

- named-zone rule lookup, DST calculation, and time-zone conversion
- `Temporal.ZonedDateTime`
- non-ISO calendars
- Intl localization and locale/options processing
- microsecond/nanosecond storage

## Implemented Properties

Instance properties:

```javascript
var dt = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");

dt.year;        // 2024
dt.month;       // 2
dt.day;         // 29
dt.hour;        // 10
dt.minute;      // 20
dt.second;      // 30
dt.millisecond; // 123
```

Convenience calendar properties:

```javascript
dt.dayOfWeek;   // ISO/Gregorian calculation
dt.dayOfYear;
dt.inLeapYear;
dt.daysInMonth;
dt.daysInYear;
```

Intentionally absent:

- `calendarId`
- `calendar`
- `era`
- `eraYear`
- `microsecond`
- `nanosecond`
- `offset`
- `timeZone`

## Constructor

### `new Temporal.PlainDateTime(...)`

Argument order:

```javascript
new Temporal.PlainDateTime(year, month, day, hour, minute, second, millisecond);
```

Example:

```javascript
new Temporal.PlainDateTime(2024, 2, 29, 10, 20, 30, 123).toString();
// "2024-02-29T10:20:30.123"
```

Notes:

- The constructor validates with reject-style overflow.
- Invalid dates, such as 2023-02-29, throw.
- Missing minute, second, or millisecond fields default to zero.
- Calling without `new` currently delegates to `Temporal.PlainDateTime.from(...)`.

## Static Methods

### `Temporal.PlainDateTime.from(thing, params)`

Accepts:

- ISO date-time strings
- date-only ISO strings, with time defaulting to `00:00:00`
- another `Temporal.PlainDateTime` instance
- property bag objects with at least `year`, `month`, and `day`

Examples:

```javascript
Temporal.PlainDateTime.from("2024-02-29T10:20:30.123").toString();
// "2024-02-29T10:20:30.123"

Temporal.PlainDateTime.from("2024-02-29").toString();
// "2024-02-29T00:00:00"

Temporal.PlainDateTime.from("2024-02-29 10:20:30").toString();
// "2024-02-29T10:20:30"

Temporal.PlainDateTime.from({
    year: 2024,
    month: 2,
    day: 29,
    hour: "8",
    minute: "05"
}).toString();
// "2024-02-29T08:05:00"
```

Complete ISO date-time strings with `Z` or a numeric offset use the repository's UTC projection extension:

```javascript
Temporal.PlainDateTime.from("2024-03-01T00:30:00+02:00").toString();
// "2024-02-29T22:30:00"
```

The input is parsed through the shared Instant parser and normalized to UTC before the PlainDateTime fields are created. This intentionally differs from Node Temporal, which discards a numeric offset for PlainDateTime input and rejects `Z`.

An offset may be followed by a bracketed zone annotation. The explicit offset remains authoritative; no IANA zone lookup or offset-versus-zone validation is performed. A bracketed zone without `Z` or an offset is rejected.

Overflow:

```javascript
Temporal.PlainDateTime.from({ year: 2023, month: 2, day: 29 }).toString();
// "2023-02-28T00:00:00"

Temporal.PlainDateTime.from(
    { year: 2023, month: 2, day: 29 },
    { overflow: "reject" }
);
// RangeError
```

Errors:

- `undefined`, `null`, number, boolean: `TypeError`
- missing `year` / `month` / `day`: `TypeError`
- invalid ISO string: `RangeError`
- bracketed zone annotation without `Z` or a numeric offset: `RangeError`
- invalid overflow option: `RangeError`

### `Temporal.PlainDateTime.compare(one, two)`

Returns `-1`, `0`, or `1`.

```javascript
Temporal.PlainDateTime.compare(
    "2024-02-29T10:20:30",
    { year: 2024, month: 2, day: 29, hour: 10, minute: 20, second: 31 }
);
// -1

Temporal.PlainDateTime.compare(
    { year: 2024, month: 3, day: 1 },
    "2024-02-29T23:59:59"
);
// 1
```

Both inputs are normalized through `PlainDateTime.from()`, so the same parsing and validation rules apply.

## Instance Methods

### `plainDateTime.toString(options)`

Default ISO output:

```javascript
Temporal.PlainDateTime.from("2024-02-29T10:20:30.123").toString();
// "2024-02-29T10:20:30.123"
```

Supported options subset:

```javascript
var dt = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");

dt.toString({ smallestUnit: "second" });
// "2024-02-29T10:20:30"

dt.toString({ smallestUnit: "minute" });
// "2024-02-29T10:20"

dt.toString({ fractionalSecondDigits: 2 });
// "2024-02-29T10:20:30.12"

dt.toString({ fractionalSecondDigits: 0, roundingMode: "ceil" });
// "2024-02-29T10:20:31"
```

Note: the formatter can emit microsecond/nanosecond-length strings padded with zeros to match Node Temporal output, but the internal model remains millisecond-precision only.

```javascript
dt.toString({ fractionalSecondDigits: 6 });
// "2024-02-29T10:20:30.123000"
```

### `plainDateTime.with(dateTimeLike, params)`

Replaces selected fields and returns a new instance.

```javascript
Temporal.PlainDateTime
    .from("2024-02-29T10:20:30")
    .with({ hour: 8, minute: 5 })
    .toString();
// "2024-02-29T08:05:30"
```

Overflow:

```javascript
Temporal.PlainDateTime
    .from("2024-01-31T10:00:00")
    .with({ month: 2 })
    .toString();
// "2024-02-29T10:00:00"

Temporal.PlainDateTime
    .from("2024-01-31T10:00:00")
    .with({ month: 2 }, { overflow: "reject" });
// RangeError
```

At least one date/time field must be supplied.

### `plainDateTime.withPlainTime(plainTime)`

Keeps the current date and replaces the time part.

```javascript
Temporal.PlainDateTime
    .from("2024-02-29T10:20:30")
    .withPlainTime({ hour: 8, minute: 5 })
    .toString();
// "2024-02-29T08:05:00"
```

Without an argument, it sets midnight:

```javascript
Temporal.PlainDateTime
    .from("2024-02-29T10:20:30")
    .withPlainTime()
    .toString();
// "2024-02-29T00:00:00"
```

### `plainDateTime.add(duration, params)`

Adds a Duration.

```javascript
Temporal.PlainDateTime
    .from("2024-02-28T00:00:00")
    .add(Temporal.Duration.from("P1D"))
    .toString();
// "2024-02-29T00:00:00"

Temporal.PlainDateTime
    .from("2024-01-31T10:20:30")
    .add({ months: 1 })
    .toString();
// "2024-02-29T10:20:30"

Temporal.PlainDateTime
    .from("2024-02-29T23:59:59.999")
    .add(Temporal.Duration.from("PT0.001S"))
    .toString();
// "2024-03-01T00:00:00"
```

Overflow:

```javascript
Temporal.PlainDateTime
    .from("2023-01-31T10:20:30")
    .add(Temporal.Duration.from("P1M"), { overflow: "reject" });
// RangeError
```

### `plainDateTime.subtract(duration, params)`

Uses `duration.negated()`, then delegates to `add()`.

```javascript
Temporal.PlainDateTime
    .from("2024-03-01T00:00:00")
    .subtract(Temporal.Duration.from("P1D"))
    .toString();
// "2024-02-29T00:00:00"

Temporal.PlainDateTime
    .from("2024-03-01T00:00:00")
    .subtract(Temporal.Duration.from("PT0.001S"))
    .toString();
// "2024-02-29T23:59:59.999"
```

### `plainDateTime.until(other, options)`

Computes the difference from this value to `other`.

Defaults: `largestUnit: "day"`, `smallestUnit: "millisecond"`, `roundingMode: "trunc"`, `roundingIncrement: 1`.

```javascript
Temporal.PlainDateTime
    .from("2024-02-01T00:00:00")
    .until("2024-02-15T00:00:00")
    .toString();
// "P14D"

Temporal.PlainDateTime
    .from("2024-02-01T00:00:00")
    .until("2024-02-15T00:00:00", { largestUnit: "week" })
    .toString();
// "P2W"

Temporal.PlainDateTime
    .from("2024-01-31T10:30:00")
    .until("2024-03-01T11:45:00", {
        largestUnit: "month",
        smallestUnit: "minute"
    })
    .toString();
// "P1M1DT1H15M"
```

Rounding:

```javascript
Temporal.PlainDateTime
    .from("2024-02-01T00:00:00")
    .until("2024-02-16T12:00:00", {
        largestUnit: "week",
        smallestUnit: "day",
        roundingMode: "halfExpand"
    })
    .toString();
// "P2W2D"
```

Supported `largestUnit`: `year`, `month`, `week`, `day`, `hour`, `minute`, `second`, `millisecond`, with plural aliases.

Supported `smallestUnit`: `day`, `hour`, `minute`, `second`, `millisecond`, with plural aliases.

Note: `smallestUnit: "year"`, `"month"`, or `"week"` currently returns an empty duration. This is a documented oddity and not a recommended usage path.

### `plainDateTime.since(other, options)`

The inverse direction of `until()`.

```javascript
Temporal.PlainDateTime
    .from("2024-03-01T11:45:00")
    .since("2024-01-31T10:30:00", {
        largestUnit: "month",
        smallestUnit: "hour"
    })
    .toString();
// "P1M1DT1H"
```

### `plainDateTime.round(roundTo)`

Rounds to a time/day unit.

```javascript
var dt = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");

dt.round("second").toString();
// "2024-02-29T10:20:30"

dt.round("minute").toString();
// "2024-02-29T10:21:00"

dt.round("hour").toString();
// "2024-02-29T10:00:00"

dt.round("day").toString();
// "2024-02-29T00:00:00"
```

Increment example:

```javascript
Temporal.PlainDateTime
    .from("2024-02-29T10:07:30")
    .round({
        smallestUnit: "minute",
        roundingIncrement: 15,
        roundingMode: "halfExpand"
    })
    .toString();
// "2024-02-29T10:15:00"
```

Day rollover:

```javascript
Temporal.PlainDateTime
    .from("2024-02-29T23:59:59.999")
    .round("day")
    .toString();
// "2024-03-01T00:00:00"
```

Unsupported round `smallestUnit`: `year`, `month`, `week`.

### `plainDateTime.equals(other)`

Uses `compare()` internally.

```javascript
var dt = Temporal.PlainDateTime.from("2024-02-29T10:20:30.123");

dt.equals("2024-02-29T10:20:30.123"); // true
dt.equals("2024-02-29T10:20:30.124"); // false
dt.equals({ year: 2024, month: 2, day: 29, hour: 10, minute: 20, second: 30, millisecond: 123 }); // true
```

### `plainDateTime.toJSON()`

Returns an ISO string:

```javascript
Temporal.PlainDateTime.from("2024-02-29T10:20:30.123").toJSON();
// "2024-02-29T10:20:30.123"
```

ExtendScript should not assume a global `JSON.stringify()` path exists; `toJSON()` itself is supported.

### `plainDateTime.valueOf()`

Always throws `TypeError`.

```javascript
Temporal.PlainDateTime.from("2024-02-29T10:20:30").valueOf();
// TypeError
```

Use `Temporal.PlainDateTime.compare()` or `equals()` for comparisons.

### `plainDateTime.toPlainDate()`

Returns a standalone `Temporal.PlainDate` instance.

```javascript
Temporal.PlainDateTime
    .from("2024-02-29T10:20:30.123")
    .toPlainDate()
    .toString();
// "2024-02-29"
```

### `plainDateTime.toPlainTime()`

Returns a standalone `Temporal.PlainTime` instance.

```javascript
Temporal.PlainDateTime
    .from("2024-02-29T10:20:30.123")
    .toPlainTime()
    .toString();
// "10:20:30.123"
```

## Related Standalone Objects

`Temporal.PlainDate` and `Temporal.PlainTime` are separate audited modules. `PlainDateTime` uses them for `toPlainDate()`, `toPlainTime()`, and `withPlainTime()`.

- Active date implementation: `Lib/Temporal.PlainDate.js`
- Active time implementation: `Lib/Temporal.PlainTime.js`
- PlainDate object notes: `PlainDate-ReadMe.md`
- PlainTime object notes: `PlainTime-ReadMe.md`
- Tests: `Test/tests-PlainDate.js`, `Test/tests-PlainTime.js`

## Unsupported Or Omitted Surface

Intentionally absent:

- named-zone rule lookup and time-zone conversion
- `Temporal.ZonedDateTime`
- `toZonedDateTime()`
- `withCalendar()`
- non-ISO calendars
- no Intl localization or locale/options processing
- `calendarId`, `era`, `eraYear`
- internal microsecond/nanosecond precision
- full Node Temporal object-shape parity

## Node Temporal Compatibility Notes

The implemented surface has been checked against Node Temporal for:

- ISO string parsing
- property bag coercion
- overflow `constrain` / `reject`
- leap-day and month-end add/subtract
- `toString()` options subset
- `compare()` input normalization
- `equals()` and `valueOf()`
- `round()` rounding modes and increment rules
- many `until()` / `since()` edge cases
- basic `toPlainDate()` and `toPlainTime()` behavior

UTC/offset projection is a documented project extension and is tested separately from this Node-parity surface.

Node Temporal is a reference and test oracle, not a full API contract. The documentation should therefore be explicit about omitted calendar/time-zone/locale/nano areas.

## Known Oddities And Edge Cases

- A complete ISO date-time with `Z` or a numeric offset is accepted as a project extension and projected to UTC fields.
- A numeric offset is authoritative beside a bracketed zone annotation; the zone name is not resolved.
- Date-only input is accepted and defaults the time part to midnight.
- Property bag input defaults to `overflow: "constrain"`; invalid ISO string dates throw, matching Node Temporal.
- `toString()` can emit microsecond/nanosecond-length output padded with zeros, but there is no internal precision beyond milliseconds.
- `until()` / `since()` with calendar units as `smallestUnit` is not fully supported and should be avoided.
- TypeError/RangeError values are created through the shared `Temporal.__typeError__()` / `Temporal.__rangeError__()` helpers.

When the optional `Lib/Temporal.LocaleDate.js` adapter is loaded last, `toLocaleString()` interprets the PlainDateTime fields as host-local wall time and returns `YYYY-MM-DDTHH:mm:ss.sss+HH:mm`. Native Date resolves DST gaps and overlaps; no IANA zone is selectable.

## Quick Example

```javascript
var start = Temporal.PlainDateTime.from("2024-01-31T10:30:00");
var duration = Temporal.Duration.from("P1M1DT1H15M");

var end = start.add(duration);
end.toString(); // "2024-03-01T11:45:00"

start.until(end, {
    largestUnit: "month",
    smallestUnit: "minute"
}).toString();
// "P1M1DT1H15M"
```
