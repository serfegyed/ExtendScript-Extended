# Intl.DurationFormat Subset

`Intl.DurationFormat.js` implements a deliberately small `Intl.DurationFormat` subset for Adobe ExtendScript. It is intended for the local Temporal millisecond subset and avoids full CLDR, PluralRules, and ListFormat.

`Intl-core.js` must be loaded before this file.

Locale duration unit-label tables are supplied by `Intl-core.js`.

## Constructor and Methods

Implemented:

- `new Intl.DurationFormat(locales, options)`
- `Intl.DurationFormat(locales, options)` without `new`
- `Intl.DurationFormat.supportedLocalesOf(locales, options)`
- `durationFormat.format(value)`
- `durationFormat.resolvedOptions()`

Not implemented:

- `formatToParts()`

## Examples

```javascript
//@include "Intl-core.js"
//@include "Intl.DurationFormat.js"

var value = {
    years: 1,
    months: 2,
    days: 3,
    hours: 4,
    minutes: 5,
    seconds: 6
};

var shortHu = new Intl.DurationFormat("hu-HU", { style: "short" });
shortHu.format(value);
// "1 év, 2 hónap, 3 nap, 4 ó, 5 p és 6 mp"

var longEn = new Intl.DurationFormat("en-US", { style: "long" });
longEn.format(value);
// "1 year, 2 months, 3 days, 4 hours, 5 minutes, 6 seconds"

var narrowFr = new Intl.DurationFormat("fr-FR", { style: "narrow" });
narrowFr.format({ seconds: 1, milliseconds: 234 });
// "1 s et 234 ms" with locale spacing

var digital = new Intl.DurationFormat("hu-HU", { style: "digital" });
digital.format(value);
// "1 év, 2 hónap, 3 nap és 4:05:06"

var iso = new Intl.DurationFormat("hu-HU", { style: "short" });
iso.format("P1Y2M3DT4H5M6S");
// "1 év, 2 hónap, 3 nap, 4 ó, 5 p és 6 mp"

var zero = new Intl.DurationFormat("en-US", { style: "digital" });
zero.format("PT0S");
// "0:00:00"
```

## Supported Locales

- `en-US`
- `en-GB`
- `de-DE`
- `fr-FR`
- `hu-HU`

Unsupported locales fall back through `Intl-core.js`, currently to `en-US` unless a supported requested locale is found. The legacy input `en-UK` resolves to `en-GB`.

`Intl.DurationFormat.supportedLocalesOf()` returns only the implemented locales, preserving requested order after canonicalization. It accepts `localeMatcher: "best fit"` and `"lookup"` with identical behavior.

## Supported Input Values

Implemented for `format(value)`:

- object input with plural field names:
  - `years`
  - `months`
  - `weeks`
  - `days`
  - `hours`
  - `minutes`
  - `seconds`
  - `milliseconds`
- narrow ISO duration string input:
  - `P1Y`
  - `P2M`
  - `P3W`
  - `P4D`
  - `PT1H`
  - `PT2M`
  - `PT3S`
  - `PT0S`
  - `PT0.123S`
  - `P1Y2M3DT4H5M6S`
- integer field values
- string values that coerce to integers
- a single negative duration sign across all non-zero fields
- explicit zero fields; if every supplied field is zero, output is the empty string, matching the approved Node-observed case

Not implemented:

- singular field aliases such as `year`
- lowercase ISO strings
- ISO strings with more than 3 fractional second digits
- `microseconds`
- `nanoseconds`
- mixed-sign durations
- fractional field values
- non-object input

Unknown fields are ignored.

## Implemented Options

### `style`

Implemented values:

- `short`
- `long`
- `digital`
- `narrow`

### `numberingSystem`

Implemented value:

- `latn` (default)

Other values throw `RangeError`.

### `localeMatcher`

Recognized values:

- `best fit` (default)
- `lookup`

Both currently use the same `Intl-core.js` locale resolver. Unsupported values throw `RangeError`.

## Per-Unit Options

Not implemented:

- `years`
- `yearsDisplay`
- `months`
- `monthsDisplay`
- `weeks`
- `weeksDisplay`
- `days`
- `daysDisplay`
- `hours`
- `hoursDisplay`
- `minutes`
- `minutesDisplay`
- `seconds`
- `secondsDisplay`
- `milliseconds`
- `millisecondsDisplay`
- `microseconds`
- `microsecondsDisplay`
- `nanoseconds`
- `nanosecondsDisplay`

Known per-unit options throw `RangeError` instead of being silently ignored.

## Short Output Tables

The `short` style is table-driven and intentionally small. Examples:

- `en-US`: `1 yr, 2 mths, 3 days, 4 hr, 5 min, 6 sec`
- `en-GB`: `1 yr, 2 mths, 3 days, 4 hrs, 5 mins, 6 secs`
- `de-DE`: `1 J, 2 Mon., 3 Tg., 4 Std., 5 Min. und 6 Sek.`
- `fr-FR`: `1 NBSP an, 2 NNBSP m., 3 NNBSP j, 4 NNBSP h, 5 NBSP min et 6 NNBSP s`
- `hu-HU`: `1 \u00E9v, 2 h\u00F3nap, 3 nap, 4 \u00F3, 5 p \u00E9s 6 mp`

The actual implementation uses Unicode `\u00A0` NBSP and `\u202F` narrow NBSP where required by the approved Node-observed French cases.

## Long Output Tables

The `long` style is also table-driven. Examples:

- `en-US`: `1 year, 2 months, 3 days, 4 hours, 5 minutes, 6 seconds`
- `de-DE`: `1 Jahr, 2 Monate, 3 Tage, 4 Stunden, 5 Minuten und 6 Sekunden`
- `fr-FR`: `1 NBSP an, 2 NBSP mois, 3 NBSP jours, 4 NBSP heures, 5 minutes et 6 NBSP secondes`
- `hu-HU`: `1 \u00E9v, 2 h\u00F3nap, 3 nap, 4 \u00F3ra, 5 perc \u00E9s 6 m\u00E1sodperc`

## Digital Output

The `digital` style formats the time part as `H:MM:SS` and appends milliseconds as `.mmm` for `en-US`/`en-GB`, or `,mmm` for the other supported locales. Date-like units before the time are formatted with the `short` table.

Examples:

- `en-US`: `1 yr, 2 mths, 3 days, 4:05:06`
- `de-DE`: `1 J, 2 Mon., 3 Tg. und 4:05:06`
- `fr-FR`: `1 NBSP an, 2 NNBSP m., 3 NNBSP j et 4:05:06`
- `hu-HU`: `1 \u00E9v, 2 h\u00F3nap, 3 nap \u00E9s 4:05:06`
- all-zero explicit fields: `0:00:00`

## Narrow Output Tables

The `narrow` style is table-driven and intentionally follows only the approved Node-observed cases. It is most visibly different from `short` in English and French. In Hungarian it mostly differs in `months`, which uses `h.`.

Examples:

- `en-US`: `1y 2m 3d 4h 5m 6s`
- `de-DE`: `1 J, 2 M, 3 T, 4h, 5 Min. und 6 Sek.`
- `fr-FR`: `1a 2m. 3j 4h 5min 6s`
- `hu-HU`: `1 \u00E9v, 2 h., 3 nap, 4 \u00F3, 5 p \u00E9s 6 mp`

## Not Implemented

- `formatToParts()`
- full CLDR duration formatting
- PluralRules-backed grammar
- ListFormat-backed list joining
- non-`latn` numbering systems
- microsecond and nanosecond fields

## Tests

Regression coverage is in:

- `tests/tests-Intl-DurationFormat.js`
- `tests/tests-Intl-DurationFormat-examples.js`

The test files run under both Node and ExtendScript Toolkit. Node is used only for fast development verification and observed reference behavior; ExtendScript remains the production target.
