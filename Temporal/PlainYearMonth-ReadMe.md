# Temporal.PlainYearMonth

`Lib/Temporal.PlainYearMonth.js` represents an ISO/Gregorian year and month without a day, time, or time zone. It is a separate Temporal type rather than a PlainDate subclass.

This module is part of the focused ExtendScript/InDesign Temporal subset. Node Temporal is used as a behavior oracle for the implemented surface, not as a requirement to reproduce every calendar field or API.

## References

- [TC39 Temporal.PlainYearMonth documentation](https://tc39.es/proposal-temporal/docs/plainyearmonth.html)
- [MDN Temporal.PlainYearMonth reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainYearMonth)

## Files

- Active implementation: `Lib/Temporal.PlainYearMonth.js`
- Tests: `Test/tests-PlainYearMonth.js`
- Required includes: `Lib/Temporal-core.js`, `Lib/Temporal.Duration.js`, `Lib/Temporal.PlainYearMonth.js`

Include `Lib/Temporal.PlainDate.js` when `toPlainDate()` is needed.

```javascript
//@include "Lib/Temporal-core.js"
//@include "Lib/Temporal.Duration.js"
//@include "Lib/Temporal.PlainYearMonth.js"
//@include "Lib/Temporal.PlainTime.js"
//@include "Lib/Temporal.PlainDate.js"
//@include "Lib/Temporal.PlainDateTime.js"
```

## Supported Surface

- `new Temporal.PlainYearMonth(year, month)`
- `Temporal.PlainYearMonth.from(thing, options)`
- `Temporal.PlainYearMonth.compare(one, two)`
- `plainYearMonth.with(yearMonthLike, options)`
- `plainYearMonth.add(duration, options)`
- `plainYearMonth.subtract(duration, options)`
- `plainYearMonth.until(other, options)`
- `plainYearMonth.since(other, options)`
- `plainYearMonth.equals(other)`
- `plainYearMonth.toString()`
- `plainYearMonth.toJSON()`
- `plainYearMonth.toPlainDate({ day })`
- `plainYearMonth.valueOf()` rejection

Available fields:

- `year`
- `month`
- `daysInMonth`
- `daysInYear`
- `monthsInYear`
- `inLeapYear`

## Construction And Parsing

```javascript
var yearMonth = new Temporal.PlainYearMonth(2024, 2);
yearMonth.toString();
// "2024-02"

Temporal.PlainYearMonth.from({ year: 2024, month: 13 }).toString();
// "2024-12"
```

`from()` accepts another PlainYearMonth, an ISO year-month string, a valid ISO date or date-time string, or a property bag containing `year` and `month`.

A complete date-time string with `Z` or a numeric offset is parsed as an Instant and projected to its UTC year and month. For example, `2024-01-01T00:30:00+01:00` becomes `2023-12`. This is a documented project extension; short year-month strings remain offset-free local values. Bracketed zone names require an accompanying `Z` or numeric offset and are not resolved.

Property bags default to `overflow: "constrain"`. Use `overflow: "reject"` to reject a month above 12. Month zero and negative months always throw.

Extended ISO years are supported. The valid YearMonth range is `-271821-04` through `+275760-09`. These endpoints are checked as year-month values; the implementation does not incorrectly reject the minimum merely because `-271821-04-01` is outside the PlainDate range.

## Replacement And Comparison

```javascript
var yearMonth = Temporal.PlainYearMonth.from("2024-02");

yearMonth.with({ year: 2023 }).toString();
// "2023-02"

Temporal.PlainYearMonth.compare("2024-02", "2024-03");
// -1
```

`with()` requires at least one supported year or month field and returns a new PlainYearMonth.

## Arithmetic

`add()` and `subtract()` use only the `years` and `months` fields of a Duration. Week, day, and time fields do not affect a YearMonth.

```javascript
Temporal.PlainYearMonth
    .from("2024-02")
    .add({ years: 1, months: 11 })
    .toString();
// "2026-01"
```

Arithmetic that would move below `-271821-04` or above `+275760-09` throws a RangeError.

## Differences And Rounding

`until()` and `since()` return a `Temporal.Duration` using only year and month fields.

Supported units are:

- `year`
- `month`

The options `largestUnit`, `smallestUnit`, `roundingIncrement`, and the supported Temporal rounding modes are available. Rounding uses real ISO calendar month and year lengths, including directional `since()` behavior. A rounding increment must be a positive integer; fractional increments are rejected instead of silently truncated.

```javascript
Temporal.PlainYearMonth
    .from("2024-02")
    .until("2025-08", { largestUnit: "month" })
    .toString();
// "P18M"
```

## PlainDate Interop

`toPlainDate()` requires an object with a `day` field. A day above the end of the month is constrained to the last day. Zero and negative days throw.

```javascript
Temporal.PlainYearMonth
    .from("2024-02")
    .toPlainDate({ day: 30 })
    .toString();
// "2024-02-29"
```

At the global ISO limits, the resulting PlainDate must also be valid. For example, `-271821-04-19` and `+275760-09-13` are valid, while an earlier or later day respectively throws.

## String And Primitive Behavior

`toString()` and `toJSON()` return the ISO year-month string. `valueOf()` always throws; use `Temporal.PlainYearMonth.compare()` or `equals()` instead.

## Intentional Limits

- ISO/Gregorian calendar behavior only
- no `monthCode`, `calendarId`, `era`, or `eraYear` fields
- no optional calendar/reference-day constructor overload; the supported constructor is `(year, month)`
- no `withCalendar()`
- no Intl localization or locale/options processing
- no named-zone rule lookup, DST calculation, or time-zone APIs
- no full Node object-shape parity

The native `referenceISODay` behavior was audited for range handling, but it is not stored or exposed by this two-argument subset. The YearMonth endpoints are validated directly, so omitting that overload does not reintroduce the invalid-first-day boundary bug.

Loading the optional `Lib/Temporal.LocaleDate.js` adapter installs `toLocaleString()` as a language-independent `YYYY-MM` alias. It does not invent a day or time-zone offset.

## Verification

The branch-specific harness contains 10 test groups and runs under both ExtendScript and Node. It covers construction, parsing, overflow, ISO boundaries, arithmetic, signed calendar rounding, conversion to PlainDate, and the intentionally omitted compatibility surface.

Current Node result:

```text
Passed: 10
Failed: 0
Skipped: 0
```
