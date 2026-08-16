# ExtendScript Intl Subset

This folder contains a deliberately small Intl-inspired subset for Adobe ExtendScript. It is not a complete Intl polyfill. The goal is to provide the locale and formatting behavior needed by ExtendScript scripts and by the local Temporal subset without bringing in full CLDR, time zones, full BCP 47 parsing, or the rest of Intl.

Node's Intl implementation is used as a development oracle for implemented behavior. It is not treated as a full compatibility target. Where ExtendScript limitations or project scope require it, this subset documents the intentional difference and keeps the implementation small.

## Implemented Files

- `Intl-core.js`: locale canonicalization, locale resolution helpers, shared data loading, and formatter baselines.
- `Intl.NumberFormat.js`: decimal, percent, and currency number formatting for the supported locales.
- `Intl.Collator.js`: small table-driven string comparison for the supported locales.
- `Intl.DateTimeFormat.js`: localized date and time formatting for the supported locales.
- `Intl.DurationFormat.js`: short duration formatting for the supported locales.
- `Intl.DisplayNames.js`: small table-driven display names for languages, regions, and currencies.
- `Intl.ListFormat.js`: localized list joining for the supported locales.
- `Intl.PluralRules.js`: small CLDR-backed plural category selection for the supported locales.
- `Intl.RelativeTimeFormat.js`: relative time phrase formatting for the supported locales.
- `Data/`: shared registry and module-specific locale data loaded on demand; currently `Data/Collation.json`, `Data/Collator.json`, `Data/Currencies.json`, `Data/DateTimeFormat.json`, `Data/DisplayNames.json`, `Data/DurationFormat.json`, `Data/ListFormat.json`, `Data/Locales.json`, `Data/NumberFormat.json`, `Data/PluralRules.json`, and `Data/RelativeTimeFormat.json`.

Detailed notes:

- `Intl-core-ReadMe.md`
- `Intl.NumberFormat-ReadMe.md`
- `Intl.Collator-ReadMe.md`
- `Intl.DateTimeFormat-ReadMe.md`
- `Intl.DurationFormat-ReadMe.md`
- `Intl.DisplayNames-ReadMe.md`
- `Intl.ListFormat-ReadMe.md`
- `Intl.PluralRules-ReadMe.md`
- `Intl.RelativeTimeFormat-ReadMe.md`

Tests:

- `all_tests.js`
- `tests/tests-Intl-core.js`
- `tests/tests-Intl-NumberFormat.js`
- `tests/tests-Intl-NumberFormat-examples.js`
- `tests/tests-Intl-Collator.js`
- `tests/tests-Intl-Collator-examples.js`
- `tests/tests-Intl-DateTimeFormat.js`
- `tests/tests-Intl-DateTimeFormat-examples.js`
- `tests/tests-Intl-DurationFormat.js`
- `tests/tests-Intl-DurationFormat-examples.js`
- `tests/tests-Intl-DisplayNames.js`
- `tests/tests-Intl-DisplayNames-examples.js`
- `tests/tests-Intl-ListFormat.js`
- `tests/tests-Intl-ListFormat-examples.js`
- `tests/tests-Intl-PluralRules.js`
- `tests/tests-Intl-PluralRules-examples.js`
- `tests/tests-Intl-RelativeTimeFormat.js`
- `tests/tests-Intl-RelativeTimeFormat-examples.js`

The individual test files and `all_tests.js` run under both Node and ExtendScript Toolkit. Node is used for fast development verification; ExtendScript remains the production target.

## Quick Examples

### Loading

`Intl-core.js` explicitly includes the Public `JSON.parse.js` helper used for module-specific JSON data. User scripts should include `Intl-core.js` before any Intl formatter module; no separate JSON include is required for Intl.

```javascript
//@include "Intl-core.js"
//@include "Intl.NumberFormat.js"
//@include "Intl.Collator.js"
//@include "Intl.DateTimeFormat.js"
//@include "Intl.DurationFormat.js"
//@include "Intl.DisplayNames.js"
//@include "Intl.ListFormat.js"
//@include "Intl.PluralRules.js"
//@include "Intl.RelativeTimeFormat.js"
```

### NumberFormat

```javascript
var price = new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF"
});
price.format(1234.56);
// "1234,56 Ft"

var percent = new Intl.NumberFormat("fr-FR", { style: "percent" });
percent.format(0.12);
// "12 %"
```

### Collator And Array.sort()

```javascript
var collator = new Intl.Collator("hu-HU", {
    sensitivity: "base",
    caseFirst: "upper"
});

var names = ["Éva", "Adam", "Ábel", "Zoé"];
names.sort(function (a, b) {
    return collator.compare(a, b);
});

var natural = new Intl.Collator("en-US", { numeric: true });
var files = ["file10", "file2", "file1"];
files.sort(function (a, b) {
    return natural.compare(a, b);
});
// ["file1", "file2", "file10"]
```

### DateTimeFormat

```javascript
var date = new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric"
});
date.format({ year: 2026, month: 7, day: 15 });
// "2026. július 15."

var time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
});
time.format({ hour: 5, minute: 6, second: 7 });
// "5:06:07 AM"
```

### DurationFormat

```javascript
var duration = new Intl.DurationFormat("hu-HU", { style: "digital" });
duration.format({ hours: 4, minutes: 5, seconds: 6 });
// "4:05:06"

duration.format("PT1H2M");
// "1:02:00"
```

### DisplayNames

```javascript
var regionNames = new Intl.DisplayNames("fr-FR", { type: "region" });
regionNames.of("US");
// "États-Unis"

var currencyNames = new Intl.DisplayNames("hu-HU", { type: "currency" });
currencyNames.of("HUF");
// "magyar forint"
```

### ListFormat

```javascript
var list = new Intl.ListFormat("hu-HU", {
    type: "conjunction",
    style: "long"
});
list.format(["alma", "korte", "barack"]);
// "alma, korte es barack"

var compact = new Intl.ListFormat("hu-HU", {
    type: "unit",
    style: "narrow"
});
compact.format(["1 m", "20 cm", "3 mm"]);
// "1 m 20 cm 3 mm"

var characters = new Intl.ListFormat("hu-HU");
characters.format("abc");
// "a, b es c"
```

### PluralRules

```javascript
var cardinal = new Intl.PluralRules("hu-HU");
cardinal.select(1);
// "one"
cardinal.select(2);
// "other"

var ordinal = new Intl.PluralRules("en-US", { type: "ordinal" });
ordinal.select(1);
// "one"
ordinal.select(2);
// "two"
ordinal.select(3);
// "few"
ordinal.select(11);
// "other"
```
### RelativeTimeFormat

```javascript
var relative = new Intl.RelativeTimeFormat("hu-HU");
relative.format(-2, "second");
// "2 mésodperccel ezelőtt"
relative.format(2, "month");
// "2 hónap múlva"

var automatic = new Intl.RelativeTimeFormat("hu-HU", { numeric: "auto" });
automatic.format(-2, "day");
// "tegnapelőtt"
automatic.format(2, "day");
// "holnapután"

var compact = new Intl.RelativeTimeFormat("en-US", { style: "narrow" });
compact.format(2, "week");
// "+2w"
```

## Supported Locales

- `en-US`
- `en-GB`
- `de-DE`
- `fr-FR`
- `hu-HU`

The legacy input `en-UK` is accepted as an alias for `en-GB`.

## Developer Notes

### Adding A Locale

A data-only locale change should not require editing JavaScript files. For a new locale such as `pl-PL`, update only the relevant JSON files under `Data/`:

- `Data/Locales.json`: add the canonical locale to `availableLocales`; add an alias or language-only rule only when needed.
- `Data/NumberFormat.json`, `Data/DateTimeFormat.json`, `Data/DisplayNames.json`, `Data/DurationFormat.json`, `Data/ListFormat.json`, `Data/PluralRules.json`, `Data/RelativeTimeFormat.json`: add the locale only for modules that are actually implemented for that locale.
- `Data/Collator.json`: add the locale-to-record-map choice when Collator should support the locale.
- `Data/Currencies.json`: add or adjust currency records when a new currency code, symbol override, or fraction range is needed.
- `Data/Collation.json`: add shared character tables only when the Collator algorithm needs new shared records.

If a locale is present in `Data/Locales.json` but a formatter module has no matching entry, that module falls back to the built-in `en-US` baseline. In that case `resolvedOptions().locale` reports `en-US`, so partial locale support is explicit rather than hidden.

### Data Shape

The JSON files intentionally use simple object maps, not generated CLDR blobs:

- `Data/Locales.json` contains `aliases`, `languageOnlyLocales`, and `availableLocales` maps.
- `Data/Currencies.json` maps currency codes to `{ symbol, symbols, fractionMin, fractionMax }` records.
- `Data/Collation.json` contains shared Collator maps such as `lowercase`, `generic`, and locale-specific record maps used by `Data/Collator.json`.
- Module locale files use canonical locale tags as top-level keys. Each value has the same shape as that module's `en-US` baseline in `Intl-core.js`.

Keep all `Data/*.json` files ASCII-only. Non-ASCII text should be stored with `\u....` escapes so ExtendScript Toolkit reads the files reliably.

JavaScript files should only change when adding a new module, a new option, a new algorithmic behavior, or a new kind of shared registry data.

## Implemented Intl Surface

### Intl Core

Implemented:

- `Intl.getCanonicalLocales(locales)`
- `Intl.supportedValuesOf(key)`

The `Intl.__...__` helpers in `Intl-core.js` are internal support functions for the formatter modules. They are intentionally not part of the public Intl surface.

Not implemented:

- full BCP 47 parsing
- Unicode extension parsing such as `-u-nu-latn`
- locale negotiation modes
- strict `Intl.supportedValuesOf()` RangeError behavior for unknown keys; this subset returns `[]` instead

Current `Intl.supportedValuesOf()` tables:

- `calendar`: `gregory`
- `collation`: `default`, `standard`
- `currency`: `EUR`, `GBP`, `HUF`, `USD`
- `numberingSystem`: `latn`
- `timeZone`: empty
- `unit`: empty

Shared registry data lives in `Data/Currencies.json`, `Data/Collation.json`, and `Data/Locales.json`.

Collator, DateTimeFormat, DisplayNames, DurationFormat, ListFormat, NumberFormat, PluralRules, and RelativeTimeFormat use module-specific locale data: each module keeps its `en-US` baseline in Core, and non-`en-US` locale tables live in `Data/Collator.json`, `Data/DateTimeFormat.json`, `Data/DisplayNames.json`, `Data/DurationFormat.json`, `Data/ListFormat.json`, `Data/NumberFormat.json`, `Data/PluralRules.json`, and `Data/RelativeTimeFormat.json`. `Intl-core.js` includes the Public `JSON.parse.js` helper for this. Adding module-specific locale data should happen in that module JSON file.

### Intl.NumberFormat

Implemented:

- callable and constructable `Intl.NumberFormat(locales, options)`
- `Intl.NumberFormat.supportedLocalesOf(locales, options)`
- `numberFormat.format(value)`
- `numberFormat.formatRange(start, end)`
- `numberFormat.resolvedOptions()`

Implemented styles:

- `decimal`
- `percent`
- `currency`

Implemented options:

- `style`
- `currency`
- `currencyDisplay`
- `currencySign`
- `numberingSystem`
- `useGrouping`
- `minimumIntegerDigits`
- `minimumFractionDigits`
- `maximumFractionDigits`
- `signDisplay`
- `trailingZeroDisplay`

Not implemented:

- `formatToParts()`
- `formatRangeToParts()`
- `notation`
- `compactDisplay`
- `unit`
- `unitDisplay`
- `minimumSignificantDigits`
- `maximumSignificantDigits`
- `roundingPriority`
- `roundingIncrement`
- `roundingMode`
- non-`latn` numbering systems
- Unicode locale extension option parsing
- full CLDR data

### Intl.Collator

Implemented:

- callable and constructable `Intl.Collator(locales, options)`
- `Intl.Collator.supportedLocalesOf(locales, options)`
- `collator.compare(a, b)`
- `collator.resolvedOptions()`

Implemented options:

- `usage`
- `sensitivity`
- `ignorePunctuation`
- `caseFirst`
- `numeric`

Recognized compatibility options:

- `localeMatcher`
- `collation` (`default`; `standard` accepted as alias)

Not implemented:

- full Unicode Collation Algorithm
- full CLDR locale tailoring
- Unicode digit numeric collation
- decimal, negative-number, or exponent parsing for `numeric: true`
- collation variants such as German phonebook collation
- separate search collation tailoring

### Intl.DateTimeFormat

Implemented:

- callable and constructable `Intl.DateTimeFormat(locales, options)`
- `Intl.DateTimeFormat.supportedLocalesOf(locales, options)`
- `dateTimeFormat.format(value)`
- `dateTimeFormat.formatToParts(value)`
- `dateTimeFormat.formatRange(start, end)`
- `dateTimeFormat.resolvedOptions()`

Implemented options:

- `year`
- `month`
- `day`
- `weekday`
- `hour`
- `minute`
- `second`
- `fractionalSecondDigits`
- `hour12`
- `hourCycle`
- `numberingSystem` (`latn` only)
- `localeMatcher`

Implemented input values:

- native `Date`
- timestamp number
- Temporal-like `{ year, month, day }`, `{ hour, minute, second }`, or combined date-time object
- `undefined` for current host date

Not implemented:

- `formatRangeToParts()`
- `era`
- `weekday: "narrow"`
- `dayPeriod`
- `timeZone`
- `calendar` option handling
- `dateStyle` / `timeStyle`
- full CLDR pattern data

### Intl.DurationFormat

Implemented:

- callable and constructable `Intl.DurationFormat(locales, options)`
- `Intl.DurationFormat.supportedLocalesOf(locales, options)`
- `durationFormat.format(value)`
- `durationFormat.resolvedOptions()`

Implemented style:

- `short`
- `long`
- `digital`
- `narrow`

Implemented options:

- `style`
- `numberingSystem` (`latn` only)
- `localeMatcher`

Implemented input fields:

- `years`
- `months`
- `weeks`
- `days`
- `hours`
- `minutes`
- `seconds`
- `milliseconds`

Implemented string input:

- narrow ISO duration strings such as `PT1H2M`, `P3D`, `PT0.123S`, and `P1Y2M3DT4H5M6S`

Not implemented:

- `formatToParts()`
- per-unit style and display options
- singular field aliases
- lowercase or fully general ISO duration parsing
- `microseconds`
- `nanoseconds`
- mixed-sign durations
- full CLDR duration formatting

### Intl.DisplayNames

Implemented:

- callable and constructable `Intl.DisplayNames(locales, options)`
- `Intl.DisplayNames.supportedLocalesOf(locales, options)`
- `displayNames.of(code)`
- `displayNames.resolvedOptions()`

Implemented types:

- `language`
- `region`
- `currency`

Implemented options:

- `type`
- `style` (`long` only)
- `fallback`
- `languageDisplay`
- `localeMatcher`

Implemented code tables:

- languages: `en`, `en-US`, `en-GB`, `de`, `de-DE`, `fr`, `fr-FR`, `hu`, `hu-HU`
- regions: `US`, `GB`, `DE`, `FR`, `HU`
- currencies: `USD`, `GBP`, `EUR`, `HUF`

Not implemented:

- `type: "script"`
- `type: "calendar"`
- `type: "dateTimeField"`
- `style: "short"`
- `style: "narrow"`
- full CLDR display-name data

### Intl.ListFormat

Implemented:

- callable and constructable `Intl.ListFormat(locales, options)`
- `Intl.ListFormat.supportedLocalesOf(locales, options)`
- `listFormat.format(list)`
- `listFormat.resolvedOptions()`

Implemented types:

- `conjunction`
- `disjunction`
- `unit`

Implemented styles:

- `long`
- `short`
- `narrow`

Implemented input:

- `Array` of strings
- `String`, treated as a character list

Implemented options:

- `type`
- `style`
- `localeMatcher`

Not implemented:

- `formatToParts()`
- general iterable input
- Set input
- Map input
- array-like object input
- arrays containing non-string values
- full CLDR list-pattern data

### Intl.PluralRules

Implemented:

- callable and constructable `Intl.PluralRules(locales, options)`
- `Intl.PluralRules.supportedLocalesOf(locales, options)`
- `pluralRules.select(number)`
- `pluralRules.resolvedOptions()`

Implemented types:

- `cardinal`
- `ordinal`

Implemented options:

- `type`
- `localeMatcher`

Returned categories use standard CLDR/Intl strings, not localized category names:

- `zero`
- `one`
- `two`
- `few`
- `many`
- `other`

Implemented category sets:

- cardinal: English, German, and Hungarian `one|other`; French `one|many|other`
- ordinal: English `one|two|few|other`; German `other`; French and Hungarian `one|other`

Not implemented:

- `selectRange()`
- digit and rounding options
- full CLDR plural-rule expression parsing
- compact/exponent plural operands

### Intl.RelativeTimeFormat

Implemented:

- callable and constructable `Intl.RelativeTimeFormat(locales, options)`
- `Intl.RelativeTimeFormat.supportedLocalesOf(locales, options)`
- `relativeTimeFormat.format(value, unit)`
- `relativeTimeFormat.resolvedOptions()`

Implemented units:

- `second`, `seconds`
- `minute`, `minutes`
- `hour`, `hours`
- `day`, `days`
- `week`, `weeks`
- `month`, `months`
- `year`, `years`

Implemented options:

- `style`: `long`, `short`, `narrow`
- `numeric`: `always`, `auto`
- `localeMatcher`

Implemented value behavior:

- `Number(value)` coercion
- negative zero as a past value
- `RangeError` for `NaN`, `Infinity`, and `-Infinity`

Not implemented:

- `formatToParts()`
- `quarter` / `quarters`
- broad unit alias tables beyond singular and plural English unit names
- full CLDR grammar, inflection, and contextual forms
- non-`latn` numbering systems

## Not Implemented Intl Objects

These are outside the current subset:

- `Intl.Segmenter`

Some of these may be added later as similarly small, table-driven subsets.
