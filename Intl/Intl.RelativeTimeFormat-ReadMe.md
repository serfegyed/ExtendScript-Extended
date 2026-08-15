# Intl.RelativeTimeFormat Subset

`Intl.RelativeTimeFormat.js` implements a focused, ExtendScript-friendly subset of `Intl.RelativeTimeFormat`. It is table-driven and intentionally limited to direct relative time formatting.

`Intl-core.js` and `Intl.PluralRules.js` must be loaded before this file.

Relative time phrase tables are supplied by `Intl-core.js`.

## Constructor and Methods

Implemented:

- `new Intl.RelativeTimeFormat(locales, options)`
- `Intl.RelativeTimeFormat(locales, options)` without `new`
- `Intl.RelativeTimeFormat.supportedLocalesOf(locales, options)`
- `relativeTimeFormat.format(value, unit)`
- `relativeTimeFormat.resolvedOptions()`

Not implemented:

- `relativeTimeFormat.formatToParts(value, unit)`
- quarter units
- broad unit alias tables beyond singular and plural English unit names
- ChainRelativeTimeFormat special receiver behavior

## Examples

```javascript
//@include "Intl-core.js"
//@include "Intl.PluralRules.js"
//@include "Intl.RelativeTimeFormat.js"

var english = new Intl.RelativeTimeFormat("en-US");
english.format(-3, "day");
// "3 days ago"
english.format(1, "year");
// "in 1 year"

var shortEnglish = new Intl.RelativeTimeFormat("en-US", {
    style: "short"
});
shortEnglish.format(-2, "minute");
// "2 min. ago"

var narrowEnglish = new Intl.RelativeTimeFormat("en-US", {
    style: "narrow"
});
narrowEnglish.format(2, "week");
// "+2w"

var automaticGerman = new Intl.RelativeTimeFormat("de-DE", {
    numeric: "auto"
});
automaticGerman.format(-2, "day");
// "vorgestern"
automaticGerman.format(2, "day");
// "übermorgen"

var automaticHungarian = new Intl.RelativeTimeFormat("hu-HU", {
    numeric: "auto"
});
automaticHungarian.format(-2, "day");
// "tegnapelőtt"
automaticHungarian.format(2, "day");
// "holnapután"

var narrowHungarian = new Intl.RelativeTimeFormat("hu-HU", {
    style: "narrow"
});
narrowHungarian.format(-2, "week");
// "2 hete"
narrowHungarian.format(3, "hour");
// "3 ó múlva"
```

## Supported Locales

- `en-US`
- `en-GB`
- `de-DE`
- `fr-FR`
- `hu-HU`

Unsupported requested locales fall back through `Intl.__resolveLocale__()`, defaulting to `en-US`.

The legacy input `en-UK` is accepted through `Intl-core.js` as an alias for `en-GB`.

`Intl.RelativeTimeFormat.supportedLocalesOf()` returns only the implemented locales, preserving requested order after canonicalization. It accepts `localeMatcher: "best fit"` and `"lookup"` with identical behavior.

## Supported Units

Implemented unit arguments:

- `second`, `seconds`
- `minute`, `minutes`
- `hour`, `hours`
- `day`, `days`
- `week`, `weeks`
- `month`, `months`
- `year`, `years`

Unsupported unit values throw `RangeError`.

## Supported Options

### `style`

Implemented:

- `long`; default
- `short`
- `narrow`

Unsupported `style` values throw `RangeError`.

Hungarian `short` and `narrow` forms are intentionally useful rather than exact full-CLDR coverage. For example, narrow past output uses compact Hungarian forms such as `2 hete` and `2 éve`.

### `numeric`

Implemented:

- `always`; default
- `auto`

`numeric: "auto"` implements lexical day forms for the supported locale tables:

- English: `yesterday`, `today`, `tomorrow`; `-2` and `2` stay numeric
- German: `vorgestern`, `gestern`, `heute`, `morgen`, `übermorgen`
- French: `avant-hier`, `hier`, `aujourd’hui`, `demain`, `après-demain`
- Hungarian: `tegnapelőtt`, `tegnap`, `ma`, `holnap`, `holnapután`

### `localeMatcher`

Accepted only as an ignored compatibility option.

Locale resolution is handled by `Intl.__resolveLocale__()`.

## Supported Values

- `value` is coerced with `Number(value)`.
- `NaN`, `Infinity`, and `-Infinity` throw `RangeError`.
- Negative zero is treated as past, matching the observed Intl behavior.

## Not Implemented

- `formatToParts()`
- `quarter` / `quarters`
- fractional-value grammar beyond simple numeric substitution
- full CLDR grammar, inflection, and contextual forms
- non-decimal numbering systems
- Unicode locale extension option parsing

## Tests

- `tests/tests-Intl-RelativeTimeFormat.js`
- `tests/tests-Intl-RelativeTimeFormat-examples.js`

The harness runs under both Node and ExtendScript Toolkit.