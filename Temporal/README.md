# ExtendScript Temporal Subset

This repository is a focused Temporal-inspired date and duration library for Adobe ExtendScript, with InDesign scripting as the primary target environment.

It is not intended to be a complete Temporal polyfill. The goal is to provide a practical, ISO-based, millisecond-precision subset of Temporal that works in ExtendScript, is pleasant to use in real scripts, and avoids the most fragile parts of older `Date`-based calendar logic.

Node's Temporal implementation is used as a development reference and test oracle for the parts implemented here. It is not treated as a full compatibility contract for the whole Temporal API.

## References

- [TC39 Temporal documentation](https://tc39.es/proposal-temporal/docs/)
- [MDN Temporal reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)

## Project Status And Support

This Temporal project was created primarily for learning and experimentation while solving practical ExtendScript and InDesign scripting problems.

The code is not optimized. Clarity, inspectability, and compatibility with the older ExtendScript runtime have taken priority over performance tuning.

The code is provided as-is and must be accepted in its current form. It may or may not receive further development, and no support, maintenance schedule, or compatibility guarantee is provided.

## Overview

ExtendScript is based on an older JavaScript engine and does not provide modern date/time tools. This project brings a carefully selected part of Temporal into that environment, with behavior shaped around scripting needs rather than full platform parity.

The implemented features focus on:

- ISO date, time, date-time, and duration strings
- Gregorian calendar math
- millisecond precision
- deterministic core behavior without depending on native `Date` time-zone behavior
- Node-referenced tests for implemented behavior
- small, inspectable modules that can be included from ExtendScript scripts

The project is especially aimed at workflows where InDesign scripts need reliable date-time arithmetic, duration formatting, and ISO parsing without introducing a large runtime dependency.

## Supported Subset

### Temporal Core

Shared helpers live in `Lib/Temporal-core.js`.

Current coverage includes:

- `Temporal` namespace setup
- shared ExtendScript-safe error helpers
- ISO date, time, and date-time parsing helpers
- ISO formatting helpers
- Gregorian leap-year and days-in-month helpers
- day-of-week and day-of-year helpers
- date and time comparison helpers
- calendar and time balancing helpers
- rounding helpers used by the implemented Temporal types
- shared fixed-time millisecond constants and Instant epoch boundaries
- shared Instant parsing, epoch-millisecond validation, and epoch-to-UTC ISO-field projection

The public runtime module is kept in `Lib/`.

Tests: `Test/tests-Temporal-core.js`

### Temporal.Duration

The active implementation lives in `Lib/Temporal.Duration.js`.

Detailed object notes: `Duration-ReadMe.md`

Current coverage includes:

- `new Temporal.Duration(...)`
- `Temporal.Duration.from(...)`
- `Temporal.Duration.compare(...)`
- `duration.with(...)`
- `duration.add(...)`
- `duration.subtract(...)`
- `duration.negated()`
- `duration.abs()`
- `duration.round(...)`
- `duration.total(...)`
- `duration.toString(...)`
- `duration.toJSON()`
- `duration.toLocaleString()`, currently as a simple `toString()` alias
- `duration.valueOf()` rejection, matching Temporal's non-primitive comparison rule

The implementation supports years, months, weeks, days, hours, minutes, seconds, and milliseconds. It intentionally stops at millisecond precision.

The public runtime module is kept in `Lib/`.

Tests: `Test/tests-Duration.js`

### Temporal.Instant

The active implementation lives in `Lib/Temporal.Instant.js`.

Detailed object notes: `Instant-ReadMe.md`

Current coverage includes:

- `Temporal.Instant.from(...)`
- `new Temporal.Instant(epochMilliseconds)`
- `Temporal.Instant.fromEpochMilliseconds(...)`
- `Temporal.Instant.compare(...)`
- `instant.epochMilliseconds`
- `instant.add(...)`
- `instant.subtract(...)`
- `instant.until(...)`
- `instant.since(...)`
- `instant.round(...)`
- `instant.equals(...)`
- `instant.toString(...)`
- `instant.toJSON()`
- optional `instant.toLocaleString()` through `Lib/Temporal.LocaleDate.js`
- `instant.valueOf()` rejection

Instant values use an integer epoch-millisecond representation. Because ExtendScript has no BigInt, the public constructor accepts epoch milliseconds; `fromEpochMilliseconds()` and `from()` are equivalent creation paths for their respective inputs.

ISO strings with UTC or numeric offsets are normalized to UTC without using native `Date`, local time-zone behavior, or a time-zone database. Arithmetic and differences support fixed hour through millisecond units.

The public runtime module is kept in `Lib/`.

Tests: `Test/tests-Instant.js`

### Temporal.LocaleDate Adapter

The optional active adapter lives in `Lib/Temporal.LocaleDate.js` and should be included after all Temporal object modules. It adds:

- `Temporal.Instant.prototype.toLocaleString()`
- `Temporal.PlainDateTime.prototype.toLocaleString()`
- `Temporal.PlainDate.prototype.toLocaleString()`
- `Temporal.PlainTime.prototype.toLocaleString()`
- `Temporal.PlainYearMonth.prototype.toLocaleString()`
- `Temporal.PlainMonthDay.prototype.toLocaleString()`

`Duration.prototype.toLocaleString()` already exists in the Duration module as a direct ISO `toString()` alias.

Despite the familiar method name, this is not Intl localization. It returns a fixed, language-independent host-local ISO string:

```javascript
Temporal.Instant.from("2026-07-15T12:34:56.123Z").toLocaleString();
// Example on a UTC+02:00 host: "2026-07-15T14:34:56.123+02:00"
```

Instant passes its already validated integer `epochMilliseconds` directly to native `Date`. PlainDateTime constructs a host-local Date from its numeric fields; DST gaps and overlaps are resolved by that host Date. Both paths read numeric local fields and `getTimezoneOffset()` and format the result internally. The adapter never passes an ISO string to the host Date parser and never calls `Date.prototype.toLocaleString()`.

Objects without a complete date-time do not invent missing context: PlainDate, PlainTime, PlainYearMonth, and PlainMonthDay return their own ISO field representation without an offset. Duration keeps its existing ISO alias.

The output always contains year, month, day, hour, minute, second, three millisecond digits, and a numeric offset. Locale and options arguments are intentionally ignored. Only the machine's current time-zone rules are available; there is no selectable zone or IANA database.

The public runtime module is kept in `Lib/`.

Tests: `Test/tests-LocaleDate.js`

All-object tests: `Test/tests-LocaleString.js`

### Temporal.Now

The active implementation lives in `Lib/Temporal.Now.js`.

Detailed object notes: `Now-ReadMe.md`

Current coverage includes:

- `Temporal.Now.instant()`

`Temporal.Now` is a namespace object. Its only supported method reads the native system clock as epoch milliseconds and returns a fresh `Temporal.Instant`.

Native `Date` is used only for this system-clock read. No local calendar, DST, locale, or time-zone calculation is delegated to it.

The public runtime module is kept in `Lib/`.

Tests: `Test/tests-Now.js`

### Temporal.PlainDate

The active implementation lives in `Lib/Temporal.PlainDate.js`.

Detailed object notes: `PlainDate-ReadMe.md`

Current coverage includes:

- `new Temporal.PlainDate(...)`
- `Temporal.PlainDate.from(...)`
- `Temporal.PlainDate.compare(...)`
- `plainDate.with(...)`
- `plainDate.add(...)`
- `plainDate.subtract(...)`
- `plainDate.until(...)`
- `plainDate.since(...)`
- `plainDate.equals(...)`
- `plainDate.toString(...)`
- `plainDate.toJSON()`
- `plainDate.toPlainDateTime(...)`
- `plainDate.toPlainYearMonth()`
- `plainDate.toPlainMonthDay()`
- `plainDate.valueOf()` rejection
- ISO-derived date properties such as `dayOfWeek`, `dayOfYear`, and `weekOfYear`

The public runtime module is kept in `Lib/`.

Tests: `Test/tests-PlainDate.js`

### Temporal.PlainYearMonth

The active implementation lives in `Lib/Temporal.PlainYearMonth.js`.

Detailed object notes: `PlainYearMonth-ReadMe.md`

Current coverage includes:

- `new Temporal.PlainYearMonth(...)`
- `Temporal.PlainYearMonth.from(...)`
- `Temporal.PlainYearMonth.compare(...)`
- `plainYearMonth.with(...)`
- `plainYearMonth.add(...)`
- `plainYearMonth.subtract(...)`
- `plainYearMonth.until(...)`
- `plainYearMonth.since(...)`
- `plainYearMonth.equals(...)`
- `plainYearMonth.toString()`
- `plainYearMonth.toJSON()`
- `plainYearMonth.toPlainDate(...)`
- `plainYearMonth.valueOf()` rejection

The implementation uses ISO/Gregorian year-month arithmetic and real calendar lengths for year/month difference rounding. It deliberately omits compatibility-only calendar fields and APIs.

The public runtime module is kept in `Lib/`.

Tests: `Test/tests-PlainYearMonth.js`

### Temporal.PlainMonthDay

The active implementation lives in `Lib/Temporal.PlainMonthDay.js`.

Detailed object notes: `PlainMonthDay-ReadMe.md`

Current coverage includes:

- `new Temporal.PlainMonthDay(...)`
- `Temporal.PlainMonthDay.from(...)`
- `plainMonthDay.with(...)`
- `plainMonthDay.equals(...)`
- `plainMonthDay.toString()`
- `plainMonthDay.toJSON()`
- `plainMonthDay.toPlainDate(...)`
- `plainMonthDay.valueOf()` rejection

The implementation is ISO-only. It exposes a practical numeric `month` property as well as the semantically useful `monthCode`, while omitting multi-calendar and Intl-dependent surface.

The public runtime module is kept in `Lib/`.

Tests: `Test/tests-PlainMonthDay.js`

### Temporal.PlainTime

The active implementation lives in `Lib/Temporal.PlainTime.js`.

Detailed object notes: `PlainTime-ReadMe.md`

Current coverage includes:

- `new Temporal.PlainTime(...)`
- `Temporal.PlainTime.from(...)`
- `Temporal.PlainTime.compare(...)`
- `plainTime.with(...)`
- `plainTime.add(...)`
- `plainTime.subtract(...)`
- `plainTime.until(...)`
- `plainTime.since(...)`
- `plainTime.round(...)`
- `plainTime.equals(...)`
- `plainTime.toString(...)`
- `plainTime.toJSON()`
- `plainTime.valueOf()` rejection

The implementation represents a time without a date or time zone and intentionally stops at millisecond precision.

The public runtime module is kept in `Lib/`.

Tests: `Test/tests-PlainTime.js`

### Temporal.PlainDateTime

The active implementation lives in `Lib/Temporal.PlainDateTime.js`.

Detailed object notes: `PlainDateTime-ReadMe.md`

Current coverage includes:

- `new Temporal.PlainDateTime(...)`
- `Temporal.PlainDateTime.from(...)`
- `Temporal.PlainDateTime.compare(...)`
- `plainDateTime.with(...)`
- `plainDateTime.withPlainTime(...)`
- `plainDateTime.add(...)`
- `plainDateTime.subtract(...)`
- `plainDateTime.until(...)`
- `plainDateTime.since(...)`
- `plainDateTime.round(...)`
- `plainDateTime.equals(...)`
- `plainDateTime.toString(...)`
- `plainDateTime.toJSON()`
- `plainDateTime.toPlainDate()`
- `plainDateTime.toPlainTime()`
- `plainDateTime.valueOf()` rejection, matching Temporal's non-primitive comparison rule

`Temporal.PlainDate` and `Temporal.PlainTime` are separate audited modules used by the conversion methods.

The public runtime module is kept in `Lib/`.

Tests: `Test/tests-PlainDateTime.js`

### UTC/Offset String Projection Extension

The five implemented Plain types accept a complete ISO date-time string ending in `Z` or a supported numeric offset through their `from()` methods. The string is parsed as an exact Instant, normalized to UTC, and then projected to the fields represented by the target type:

```javascript
Temporal.PlainDateTime.from("2024-03-01T00:30:00+02:00").toString();
// "2024-02-29T22:30:00"

Temporal.PlainDate.from("2024-03-01T00:30:00+02:00").toString();
// "2024-02-29"
```

This is an intentional project extension. Node Temporal Plain types normally discard numeric offsets and reject `Z`; this subset instead uses the offset to preserve the exact-time meaning needed at script boundaries. Offset-free Plain ISO strings keep their existing local-field behavior.

Bracketed zone annotations are accepted only when `Z` or a numeric offset already determines the instant. The annotation is not resolved or checked against an IANA database; the explicit offset is authoritative. Time-only offset strings are rejected because they do not contain a date and therefore cannot identify an instant.

## Intentional Limits

This project deliberately does not try to cover the full Temporal proposal.

Currently out of scope:

- IANA or host-local time-zone calculations and time-zone databases
- `Temporal.ZonedDateTime`
- calendar systems beyond the ISO/Gregorian behavior needed here
- locale-first formatting or full `Intl` / `toLocaleString` options behavior
- microsecond and nanosecond precision
- full object-shape parity with Node Temporal
- compatibility-only fields not used by the active modules, such as `era`, `eraYear`, `microsecond`, or `nanosecond`
- unsupported calendar or time-zone conversion APIs such as `withCalendar` or `toZonedDateTime`

The rule of thumb is simple: implemented behavior should be tested against Node Temporal where that makes sense; unsupported Temporal surface should be documented instead of stubbed.

## Project Layout

```text
Temporal.js
README.md
*-ReadMe.md

Lib/
  Temporal-core.js
  Temporal.Duration.js
  Temporal.Instant.js
  Temporal.Now.js
  Temporal.PlainDate.js
  Temporal.PlainTime.js
  Temporal.PlainDateTime.js
  Temporal.PlainYearMonth.js
  Temporal.PlainMonthDay.js
  Temporal.LocaleDate.js

Test/
  tests-Temporal-core.js
  tests-Duration.js
  tests-Instant.js
  tests-LocaleDate.js
  tests-LocaleString.js
  audit-HostLocalDate.js
  tests-Now.js
  tests-PlainYearMonth.js
  tests-PlainMonthDay.js
  tests-PlainDate.js
  tests-PlainTime.js
  tests-PlainDateTime.js
  tests-UTCProjection.js
```

`Lib/` contains the current public runtime files. Numbered development snapshots are intentionally not published in this repository.
The Date polyfills used by `Temporal.js` live in the sibling `Date/Lib/` directory as independently includeable files.

## How to Use

For the complete public subset, include the package entry file:

```javascript
//@include "Temporal.js"
```

`Temporal.js` contains only ordered `#include` directives. If a script needs only part of the library, individual files can instead be included from `Lib/`, with Core first and LocaleDate after all Temporal object modules:

```javascript
//@include "Lib/Temporal-core.js"
//@include "Lib/Temporal.Duration.js"
//@include "Lib/Temporal.Instant.js"
//@include "Lib/Temporal.Now.js"
//@include "Lib/Temporal.PlainYearMonth.js"
//@include "Lib/Temporal.PlainMonthDay.js"
//@include "Lib/Temporal.PlainTime.js"
//@include "Lib/Temporal.PlainDate.js"
//@include "Lib/Temporal.PlainDateTime.js"
//@include "Lib/Temporal.LocaleDate.js" // optional; load last
```

Then use the available subset:

```javascript
var start = Temporal.PlainDateTime.from("2026-06-26T09:30:00");
var duration = Temporal.Duration.from("P1DT2H");
var end = start.add(duration);

$.writeln(end.toString());
```

The test files are plain `.js` files with ExtendScript `//@include` lines and a Node fallback loader, so they can be run from VS Code or another terminal with Node during development.

## Tests

Current local test status:

```text
Test/tests-Temporal-core.js      Passed: 6,  Failed: 0
Test/tests-Duration.js           Passed: 33, Failed: 0
Test/tests-Instant.js            Passed: 14, Failed: 0
Test/tests-Now.js                Passed: 5,  Failed: 0
Test/tests-PlainYearMonth.js     Passed: 10, Failed: 0
Test/tests-PlainMonthDay.js      Passed: 10, Failed: 0
Test/tests-PlainDate.js          Passed: 10, Failed: 0
Test/tests-PlainDateTime.js      Passed: 16, Failed: 0
Test/tests-PlainTime.js          Passed: 10, Failed: 0
Test/tests-UTCProjection.js      Passed: 13, Failed: 0
Test/tests-LocaleDate.js         Passed: 10, Failed: 0
Test/tests-LocaleString.js       Passed: 10, Failed: 0
```

Each implemented behavior should have a matching project test. Where practical, expected behavior is derived from Node Temporal first, then copied into this repository's tests.

`Test/tests-Now.js`, the 13-group UTC projection harness, the 10-group LocaleDate harness, and the 10-group all-object LocaleString harness pass under ExtendScript Toolkit. The host audit showed that ESTK ISO Date parsing is unusable (0/7), while direct epoch-millisecond construction is reliable across the Instant range (7/7); the adapter therefore never reparses ISO through Date.

## Development Philosophy

This repository follows a narrow, practical rule:

- implement only the Temporal behavior that is useful for the ExtendScript/InDesign target
- use Node Temporal as the reference for implemented behavior
- keep unsupported areas explicit in this README
- prefer predictable ISO and millisecond behavior over broad API surface
- avoid depending on native `Date` behavior where it would introduce local time-zone or DST surprises
- keep active root files simple to include, while preserving numbered development files for history

After each completed subproject, this README should be updated with the current module status, supported methods, known limits, and test state.

## Contributions

Suggestions and improvements are welcome, especially when they are grounded in real ExtendScript or InDesign scripting needs.

Please keep in mind that this is a focused subset project, not a general-purpose Temporal polyfill. Additions should fit the project's ISO/millisecond ExtendScript target and should include tests.

## License

All contents of this repository are released under the MIT License. Feel free to use, adapt, and share these scripts in your projects.
