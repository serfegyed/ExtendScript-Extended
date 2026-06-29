# Temporal.PlainTime

`Lib/Temporal.PlainTime.js` is the wall-clock time object for this ExtendScript/InDesign-focused Temporal subset. It represents an ISO time without a date or time zone and stores hour, minute, second, and millisecond fields.

This is not a complete Temporal polyfill. The implementation is intentionally limited to practical ISO and millisecond behavior for ExtendScript.

## References

- [TC39 Temporal.PlainTime documentation](https://tc39.es/proposal-temporal/docs/plaintime.html)
- [MDN Temporal.PlainTime reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainTime)

## Files

- Active implementation: `Lib/Temporal.PlainTime.js`
- Tests: `Test/tests-PlainTime.js`
- Required includes: `Lib/Temporal-core.js`, `Lib/Temporal.Duration.js`, `Lib/Temporal.PlainTime.js`

Include `Lib/Temporal.PlainDate.js` and `Lib/Temporal.PlainDateTime.js` after PlainTime when date/time conversion methods are needed.

```javascript
//@include "Lib/Temporal-core.js"
//@include "Lib/Temporal.Duration.js"
//@include "Lib/Temporal.PlainTime.js"
//@include "Lib/Temporal.PlainDate.js"
//@include "Lib/Temporal.PlainDateTime.js"
```

## Supported Surface

- `new Temporal.PlainTime(hour, minute, second, millisecond)`
- `Temporal.PlainTime.from(thing, options)`
- `Temporal.PlainTime.compare(one, two)`
- `plainTime.with(timeLike, options)`
- `plainTime.add(duration)`
- `plainTime.subtract(duration)`
- `plainTime.until(other, options)`
- `plainTime.since(other, options)`
- `plainTime.round(roundTo)`
- `plainTime.equals(other)`
- `plainTime.toString(options)`
- `plainTime.toJSON()`
- `plainTime.valueOf()` rejection

Available fields:

- `hour`
- `minute`
- `second`
- `millisecond`

## Construction And Parsing

```javascript
var time = new Temporal.PlainTime(10, 20, 30, 123);
time.toString();
// "10:20:30.123"
```

`Temporal.PlainTime.from()` accepts another PlainTime, a PlainDateTime, a time-like property bag, or a supported local ISO string.

```javascript
Temporal.PlainTime.from("08:05").toString();
// "08:05:00"

Temporal.PlainTime.from("2024-02-29T10:20:30.123").toString();
// "10:20:30.123"

Temporal.PlainTime.from("2024-03-01T00:30:00+02:00").toString();
// "22:30:00"

Temporal.PlainTime.from({ hour: 8, minute: 5 }).toString();
// "08:05:00"
```

Supported local string forms include hour-only values, `T`-prefixed values, date-time strings with `T`, `t`, or a space separator, comma or period fractions, and leap-second input. A parsed second value of 60 is constrained to 59.

A complete date-time string with `Z` or a numeric offset is parsed as an Instant and projected to its UTC time. Time-only offset strings such as `00:30+01:00` remain invalid because they do not identify an exact instant. A bracketed zone name requires an accompanying `Z` or numeric offset; its rules are not evaluated.

Property bags default to `overflow: "constrain"`. Use `overflow: "reject"` to reject out-of-range fields.

## Replacement And Comparison

```javascript
var time = Temporal.PlainTime.from("10:20:30.123");

time.with({ minute: 5, millisecond: 7 }).toString();
// "10:05:30.007"

Temporal.PlainTime.compare("10:00", "11:00");
// -1

time.equals("10:20:30.123");
// true
```

`with()` requires at least one supported time field. `calendar` and `timeZone` fields are rejected.

## Arithmetic

`add()` and `subtract()` apply the time portion of a Duration and wrap within the 24-hour day.

```javascript
Temporal.PlainTime
    .from("23:59:59.900")
    .add({ milliseconds: 200 })
    .toString();
// "00:00:00.1"
```

Date units in the Duration do not change a PlainTime, matching the implemented Node-referenced behavior.

## Differences

`until()` and `since()` return a `Temporal.Duration`.

Supported largest and smallest units are:

- `hour`
- `minute`
- `second`
- `millisecond`

`largestUnit: "auto"` behaves as `hour`. Singular and plural unit spellings are accepted.

```javascript
Temporal.PlainTime
    .from("10:20:30.123")
    .until("12:22:33.456")
    .toString();
// "PT2H2M3.333S"
```

Rounding modes supported by `until()`, `since()`, `round()`, and relevant formatting paths are `ceil`, `floor`, `expand`, `trunc`, `halfCeil`, `halfFloor`, `halfExpand`, `halfTrunc`, and `halfEven`.

Rounding increments must be positive integers and must divide the radix of the selected unit. Fractional rounding increments are intentionally rejected.

## Rounding And Formatting

```javascript
Temporal.PlainTime
    .from("10:07:30")
    .round({
        smallestUnit: "minute",
        roundingIncrement: 15,
        roundingMode: "halfExpand"
    })
    .toString();
// "10:15:00"
```

`toString()` supports `smallestUnit`, `fractionalSecondDigits`, and `roundingMode` within the millisecond subset. `fractionalSecondDigits` is limited to 0 through 3.

`toJSON()` returns the default ISO time string. `valueOf()` always throws; use `compare()` or `equals()` instead.

## Date And Date-Time Interop

PlainTime does not have a `toPlainDateTime()` method. To combine a date and time, use `Temporal.PlainDate.prototype.toPlainDateTime()`.

```javascript
Temporal.PlainDate
    .from("2024-02-29")
    .toPlainDateTime(Temporal.PlainTime.from("10:20:30.123"))
    .toString();
// "2024-02-29T10:20:30.123"
```

`Temporal.PlainDateTime.prototype.toPlainTime()` and `withPlainTime()` use the standalone PlainTime module.

## Intentional Limits

- millisecond precision only
- no `microsecond` or `nanosecond` fields
- no named-zone rule lookup, DST calculation, or time-zone conversion
- no offset processing for time-only strings; UTC projection requires a complete date-time
- no calendar systems or calendar conversion APIs
- no Intl localization or locale/options processing
- no compatibility-only `calendarId` field
- no `toPlainDateTime()` method on PlainTime

These limits keep the implementation aligned with the repository's ExtendScript/InDesign target instead of expanding toward a full polyfill.

Loading the optional `Lib/Temporal.LocaleDate.js` adapter installs `toLocaleString()` as a language-independent ISO time alias. It does not invent a date, so no DST-dependent offset is appended.

## Verification

The branch-specific harness contains 10 test groups and runs under both ExtendScript and Node. Expected values are derived from Node Temporal for the implemented surface.

UTC/offset projection is covered separately by `Test/tests-UTCProjection.js`: 13 passed under both Node and ExtendScript Toolkit.

Before closure, the final deterministic Node audit compared 10,000 PlainTime operations covering parsing, property bags, comparison, replacement, arithmetic, differences, rounding, and formatting with zero mismatches.
