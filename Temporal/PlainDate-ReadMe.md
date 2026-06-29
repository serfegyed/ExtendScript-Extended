# Temporal.PlainDate

`Lib/Temporal.PlainDate.js` is the date-only object for this ExtendScript/InDesign-focused Temporal subset. It represents an ISO/Gregorian calendar date without a time or time zone.

This is not a complete Temporal polyfill. The implementation focuses on practical date parsing, calendar arithmetic, comparison, date differences, and PlainDateTime interop at the scope needed by ExtendScript scripts.

## References

- [TC39 Temporal.PlainDate documentation](https://tc39.es/proposal-temporal/docs/plaindate.html)
- [MDN Temporal.PlainDate reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate)

## Files

- Active implementation: `Lib/Temporal.PlainDate.js`
- Tests: `Test/tests-PlainDate.js`
- Required includes: `Lib/Temporal-core.js`, `Lib/Temporal.Duration.js`, `Lib/Temporal.PlainDate.js`

Include PlainYearMonth for `toPlainYearMonth()`, PlainMonthDay for `toPlainMonthDay()`, and PlainTime and PlainDateTime when `toPlainDateTime()` is needed.

```javascript
//@include "Lib/Temporal-core.js"
//@include "Lib/Temporal.Duration.js"
//@include "Lib/Temporal.PlainYearMonth.js"
//@include "Lib/Temporal.PlainMonthDay.js"
//@include "Lib/Temporal.PlainTime.js"
//@include "Lib/Temporal.PlainDate.js"
//@include "Lib/Temporal.PlainDateTime.js"
```

## Supported Surface

- `new Temporal.PlainDate(year, month, day)`
- `Temporal.PlainDate.from(thing, options)`
- `Temporal.PlainDate.compare(one, two)`
- `plainDate.with(dateLike, options)`
- `plainDate.add(duration, options)`
- `plainDate.subtract(duration, options)`
- `plainDate.until(other, options)`
- `plainDate.since(other, options)`
- `plainDate.equals(other)`
- `plainDate.toString()`
- `plainDate.toJSON()`
- `plainDate.toPlainYearMonth()`
- `plainDate.toPlainMonthDay()`
- `plainDate.toPlainDateTime(plainTime)`
- `plainDate.valueOf()` rejection

Available date fields:

- `year`
- `month`
- `monthCode`
- `calendarId`
- `day`
- `dayOfWeek`
- `dayOfYear`
- `daysInWeek`
- `daysInMonth`
- `daysInYear`
- `monthsInYear`
- `weekOfYear`
- `yearOfWeek`
- `inLeapYear`

## Construction And Parsing

```javascript
var date = new Temporal.PlainDate(2024, 2, 29);
date.toString();
// "2024-02-29"
```

`Temporal.PlainDate.from()` accepts another PlainDate, a PlainDateTime, a date-like property bag, an ISO date string, or a supported ISO date-time string.

```javascript
Temporal.PlainDate.from("2024-02-29").toString();
// "2024-02-29"

Temporal.PlainDate.from("2024-02-29T10:20:30.123").toString();
// "2024-02-29"

Temporal.PlainDate.from("2024-03-01T00:30:00+02:00").toString();
// "2024-02-29"

Temporal.PlainDate.from({ year: 2024, month: 2, day: 29 }).toString();
// "2024-02-29"
```

Property bags default to `overflow: "constrain"`. Use `overflow: "reject"` to reject invalid month/day combinations. Invalid dates in strings always throw.

Extended ISO years are supported within the repository's ISO date limits.

A complete date-time string with `Z` or a numeric offset is parsed as an Instant, normalized to UTC, and projected to its UTC date. This is a documented project extension rather than Node PlainDate behavior. An offset-free date or date-time keeps its local fields. Bracketed zone names require an accompanying `Z` or numeric offset and are not resolved through a time-zone database.

## Replacement And Comparison

```javascript
var date = Temporal.PlainDate.from("2024-02-29");

date.with({ year: 2023 }).toString();
// "2023-02-28"

Temporal.PlainDate.compare("2024-02-29", "2024-03-01");
// -1

date.equals({ year: 2024, month: 2, day: 29 });
// true
```

`with()` requires at least one supported date field and returns a new PlainDate.

## Arithmetic

`add()` and `subtract()` support years, months, weeks, days, and whole-day carry from time fields in a Duration.

```javascript
Temporal.PlainDate
    .from("2024-01-31")
    .add({ months: 1 })
    .toString();
// "2024-02-29"
```

Time fields below a complete 24-hour day do not change the date. Complete days carried by hours, minutes, seconds, or milliseconds do change it.

## Differences

`until()` and `since()` return a `Temporal.Duration`.

Supported date units are:

- `year`
- `month`
- `week`
- `day`

`largestUnit: "auto"` behaves as `day`. Singular and plural unit spellings are accepted.

```javascript
Temporal.PlainDate
    .from("2024-01-31")
    .until("2024-03-01", { largestUnit: "month" })
    .toString();
// "P1M1D"
```

The implemented difference options support `largestUnit`, `smallestUnit`, `roundingIncrement`, and the Temporal rounding modes used elsewhere in this subset.

## String And Primitive Behavior

`toString()` and `toJSON()` return an ISO date string.

```javascript
Temporal.PlainDate.from("2024-02-29").toJSON();
// "2024-02-29"
```

`valueOf()` always throws. Use `Temporal.PlainDate.compare()` or `equals()` instead.

PlainDate does not implement a `round()` method.

## PlainYearMonth Interop

`toPlainYearMonth()` returns the matching separate PlainYearMonth type and drops the day component.

```javascript
Temporal.PlainDate
    .from("2024-02-29")
    .toPlainYearMonth()
    .toString();
// "2024-02"
```

## PlainMonthDay Interop

`toPlainMonthDay()` returns the matching separate PlainMonthDay type and drops the year component.

```javascript
Temporal.PlainDate
    .from("2024-02-29")
    .toPlainMonthDay()
    .toString();
// "02-29"
```

## PlainDateTime Interop

`toPlainDateTime()` combines the date with a PlainTime. Without an argument, it uses midnight.

```javascript
Temporal.PlainDate
    .from("2024-02-29")
    .toPlainDateTime("10:20:30.123")
    .toString();
// "2024-02-29T10:20:30.123"
```

## Intentional Limits

- ISO/Gregorian calendar behavior only
- no named-zone rule lookup, DST calculation, or time-zone conversion
- no `Temporal.ZonedDateTime`
- no `withCalendar()` or `toZonedDateTime()`
- no Intl localization or locale/options processing
- no `era` or `eraYear` fields
- no full Node Temporal object-shape parity

These limits keep the implementation aligned with the repository's ExtendScript/InDesign target instead of expanding toward a complete polyfill.

Loading the optional `Lib/Temporal.LocaleDate.js` adapter installs `toLocaleString()` as a language-independent ISO date alias. It returns only `YYYY-MM-DD`; no time or offset is invented.

## Verification

The branch-specific harness contains 10 test groups and runs under both ExtendScript and Node. Expected values are derived from Node Temporal for the implemented surface.

UTC/offset projection is covered separately by `Test/tests-UTCProjection.js`: 13 passed under both Node and ExtendScript Toolkit.

Current Node result:

```text
Passed: 10
Failed: 0
Skipped: 0
```
