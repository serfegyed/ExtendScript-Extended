# Intl.DateTimeFormat Subset

`Intl.DateTimeFormat.js` implements a deliberately small, date/time `Intl.DateTimeFormat` subset for Adobe ExtendScript. It is intended as the first step toward a useful localized `toLocaleString()` path for the local Temporal subset.

`Intl-core.js` must be loaded before this file.

`en-US` locale date defaults, hour-cycle defaults, month names, and weekday names are built into `Intl-core.js`; non-`en-US` DateTimeFormat locale data lives in `Data/DateTimeFormat.json`.

## Constructor and Methods

Implemented:

- `new Intl.DateTimeFormat(locales, options)`
- `Intl.DateTimeFormat(locales, options)` without `new`
- `Intl.DateTimeFormat.supportedLocalesOf(locales, options)`
- `dateTimeFormat.format(value)`
- `dateTimeFormat.formatToParts(value)`
- `dateTimeFormat.formatRange(start, end)`
- `dateTimeFormat.resolvedOptions()`

Not implemented:

- `formatRangeToParts()`

## Examples

```javascript
//@include "Intl-core.js"
//@include "Intl.DateTimeFormat.js"

var date = { year: 2026, month: 7, day: 15 };

var defaultHu = new Intl.DateTimeFormat("hu-HU");
defaultHu.format(date);
// "2026. 07. 15."

var longMonth = new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric"
});
longMonth.format(date);
// "2026. július 15."

var weekday = new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});
weekday.format(date);
// "Mittwoch, 15. Juli 2026"

var time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
});
time.format({ hour: 5, minute: 6, second: 7 });
// "5:06:07 AM"

var fractional = new Intl.DateTimeFormat("hu-HU", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 2
});
fractional.format({ hour: 12, minute: 34, second: 56, millisecond: 987 });
// "12:34:56,98"

var yearMonth = new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit"
});
yearMonth.formatToParts({ year: 2026, month: 7, day: 1 });
// [{ type: "year", value: "2026" }, ..., { type: "month", value: "07" }, ...]

var range = new Intl.DateTimeFormat("hu-HU");
range.formatRange(
    { year: 2026, month: 7, day: 15 },
    { year: 2026, month: 7, day: 16 }
);
// "2026. 07. 15.-2026. 07. 16." with an N-dash between the two dates
```

## Supported Locales

- `en-US`
- `en-GB`
- `de-DE`
- `fr-FR`
- `hu-HU`

Unsupported locales fall back through `Intl-core.js`, currently to `en-US` unless a supported requested locale is found. The legacy input `en-UK` resolves to `en-GB`.

`Intl.DateTimeFormat.supportedLocalesOf()` returns only the implemented locales, preserving requested order after canonicalization. It accepts `localeMatcher: "best fit"` and `"lookup"` with identical behavior.

## Supported Input Values

Implemented for `format(value)`:

- native `Date` objects, using host-local date fields
- timestamp numbers, converted through native `Date` and host-local date fields
- Temporal-like date objects with `year`, `month`, and `day` fields
- `undefined`, which formats the current host date

Not implemented:

- ISO string input
- Temporal object detection beyond simple `year/month/day` fields
- time-only objects without an `hour` field
- `Instant` time-zone projection

## Implemented Options

### `year`

Implemented values:

- `numeric`
- `2-digit`

### `month`

Implemented values:

- `numeric`
- `2-digit`
- `short`
- `long`

Month names are stored in small locale tables. They are not CLDR-complete.

### `day`

Implemented values:

- `numeric`
- `2-digit`

### `weekday`

Implemented values:

- `short`
- `long`

`narrow` is intentionally not implemented and throws `RangeError`.
### `hour`

Implemented values:

- `numeric`
- `2-digit`

Default output follows the locale table: `en-US` uses `h12`, the other supported locales use `h23` unless `hour12` or `hourCycle` overrides it.

### `minute`

Implemented values:

- `numeric`
- `2-digit`

When `minute` is present, this subset normalizes output to `2-digit`, matching the approved Node-observed cases.

### `second`

Implemented values:

- `numeric`
- `2-digit`

When `second` is present together with `hour` or `minute`, this subset normalizes output to `2-digit`, matching the approved Node-observed time cases. Standalone `second: "numeric"` remains numeric.

### `fractionalSecondDigits`

Implemented values:

- `1`
- `2`
- `3`

String values that coerce to those integers are accepted. This subset requires `second` when `fractionalSecondDigits` is present. Fractional seconds use `.` in `en-US` and `en-GB`, and `,` in `de-DE`, `fr-FR`, and `hu-HU`.

### `hour12`

Implemented values:

- `true`
- `false`

When present, `hour12` selects `h12` for `true` and `h23` for `false`. If both `hour12` and `hourCycle` are present, `hour12` wins, matching the approved Node-observed behavior.

### `hourCycle`

Implemented values:

- `h11`
- `h12`
- `h23`
- `h24`

This subset implements only fixed AM/PM/de./du. markers from the small locale tables. `dayPeriod` remains unsupported.

### `numberingSystem`

Implemented value:

- `latn` (default)

Other values throw `RangeError`.

### `localeMatcher`

Recognized values:

- `best fit` (default)
- `lookup`

Both currently use the same `Intl-core.js` locale resolver. Unsupported values throw `RangeError`.

## Defaults

When no date fields are supplied, the subset formats `year`, `month`, and `day`.

Default output follows the approved small locale tables:

- `en-US`: `7/15/2026`
- `en-GB`: `15/07/2026`
- `de-DE`: `15.7.2026`
- `fr-FR`: `15/07/2026`
- `hu-HU`: `2026. 07. 15.`

## Not Implemented

- `era`
- `weekday: "narrow"`
- `timeZone`
- `timeZoneName`
- `calendar` option handling
- `dateStyle`
- `timeStyle`
- `dayPeriod`
- non-`latn` numbering systems
- calendars beyond the fixed Gregorian output table
- full CLDR pattern data

Unsupported known date/time options throw `RangeError` instead of being silently ignored.

## `formatToParts(value)`

Implemented as a narrow subset for the fields this formatter already supports. Returned part types:

- `year`
- `month`
- `day`
- `weekday`
- `hour`
- `minute`
- `second`
- `fractionalSecond`
- `dayPeriod`
- `literal`

The concatenated `value` fields match `format(value)`. This method exists primarily so Temporal `PlainYearMonth` and `PlainMonthDay` can use localized partial-date output without parsing formatted strings.

## Tests

Regression coverage is in:

- `tests/tests-Intl-DateTimeFormat.js`
- `tests/tests-Intl-DateTimeFormat-examples.js`

The test files run under both Node and ExtendScript Toolkit. Node is used only for fast development verification and observed reference behavior; ExtendScript remains the production target.
