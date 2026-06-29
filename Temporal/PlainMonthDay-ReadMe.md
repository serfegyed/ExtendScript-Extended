# Temporal.PlainMonthDay

`Lib/Temporal.PlainMonthDay.js` represents an ISO month and day without a year, time, or time zone. Typical uses include birthdays, anniversaries, and other annually recurring dates.

This is a focused ExtendScript/InDesign subset, not a complete Temporal polyfill. Node Temporal is used as the behavior reference for the supported surface.

## References

- [TC39 Temporal.PlainMonthDay documentation](https://tc39.es/proposal-temporal/docs/plainmonthday.html)
- [MDN Temporal.PlainMonthDay reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainMonthDay)

## Files

- Active implementation: `Lib/Temporal.PlainMonthDay.js`
- Tests: `Test/tests-PlainMonthDay.js`
- Required include: `Lib/Temporal-core.js`, `Lib/Temporal.PlainMonthDay.js`

Include `Lib/Temporal.PlainDate.js` when `toPlainDate()` is needed.

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

- `new Temporal.PlainMonthDay(month, day)`
- `Temporal.PlainMonthDay.from(thing, options)`
- `plainMonthDay.with(monthDayLike, options)`
- `plainMonthDay.equals(other)`
- `plainMonthDay.toString()`
- `plainMonthDay.toJSON()`
- `plainMonthDay.toPlainDate({ year })`
- `plainMonthDay.valueOf()` rejection

Available fields:

- `month`
- `monthCode`
- `day`

The numeric `month` property is an intentional project extension for practical ISO-only scripting. `monthCode` is also supported because it is the stable year-independent month identifier and is useful in property bags. Compatibility-only `calendarId` is omitted.

## Construction And Parsing

```javascript
var leapDay = new Temporal.PlainMonthDay(2, 29);
leapDay.toString();
// "02-29"
```

The public constructor accepts only `month` and `day`. Internally, month-day validation uses the ISO leap reference year 1972, so February 29 is valid without exposing Node's calendar and reference-year constructor arguments.

`from()` accepts another PlainMonthDay, supported PlainDate or PlainDateTime objects, property bags, month-day strings, and valid ISO date or date-time strings.

```javascript
Temporal.PlainMonthDay.from("--02-29").toString();
// "02-29"

Temporal.PlainMonthDay.from({ monthCode: "M05", day: 17 }).toString();
// "05-17"

Temporal.PlainMonthDay.from({ year: 2023, month: 2, day: 29 }).toString();
// "02-28"

Temporal.PlainMonthDay.from("2024-03-01T00:30:00+02:00").toString();
// "02-29"
```

Property bags default to `overflow: "constrain"`; `overflow: "reject"` rejects out-of-range values. If a `year` is present, it participates in validation. Strings must already contain a valid month-day or full ISO date.

A complete date-time string with `Z` or a numeric offset is parsed as an Instant and projected to its UTC month and day. Date-only strings with `Z` remain invalid because they do not identify an Instant. Bracketed zone names require an accompanying `Z` or numeric offset and are not resolved.

Only an omitted calendar or explicit `calendar: "iso8601"` is accepted. Other calendar systems are outside this project.

## Replacement And Equality

`with()` accepts partial `year`, `month`, `monthCode`, and `day` fields. February is treated as having 29 days when no year is supplied.

```javascript
Temporal.PlainMonthDay.from("02-01").with({ day: 31 }).toString();
// "02-29"

Temporal.PlainMonthDay.from("02-29").with({ year: 2023 }).toString();
// "02-28"
```

`equals()` converts its argument through `PlainMonthDay.from()` and compares the ISO month and day.

## PlainDate Interop

`toPlainDate({ year })` combines the month-day with a year and follows Node's constraining behavior for dates that do not exist in that year.

```javascript
Temporal.PlainMonthDay
    .from("02-29")
    .toPlainDate({ year: 2017 })
    .toString();
// "2017-02-28"
```

## String And Primitive Behavior

`toString()` and `toJSON()` return `MM-DD`. `valueOf()` always throws; use `equals()` instead.

## Intentional Limits

- ISO/Gregorian calendar behavior only
- no `calendarId` field
- no `Temporal.PlainMonthDay.compare()` static method
- no `add()`, `subtract()`, `until()`, or `since()`
- no `withCalendar()`
- no named-zone rule lookup, DST calculation, or time-zone APIs
- no Intl localization or locale/options processing
- no full Node Temporal object-shape parity

## Verification

Loading the optional `Lib/Temporal.LocaleDate.js` adapter installs `toLocaleString()` as a language-independent `MM-DD` alias. It does not invent a year, time, or offset.

The branch-specific harness contains 10 test groups and runs under both ExtendScript and Node. Every supported behavior uses fixed expected values captured from Node Temporal.

UTC/offset projection is a documented project extension covered separately by `Test/tests-UTCProjection.js`: 13 passed under both Node and ExtendScript Toolkit.

A separate differential audit compared 13,166 supported constructor, property-bag, string, `with()`, and `toPlainDate()` outcomes with Node Temporal and found zero differences.

Current Node result:

```text
Passed: 10
Failed: 0
Skipped: 0
```
