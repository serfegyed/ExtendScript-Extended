# Intl.ListFormat Subset

`Intl.ListFormat.js` implements a focused, ExtendScript-friendly subset of `Intl.ListFormat`. It is table-driven and intentionally limited to direct list formatting.

`Intl-core.js` must be loaded before this file.

List pattern tables are supplied by `Intl-core.js`.

## Constructor and Methods

Implemented:

- `new Intl.ListFormat(locales, options)`
- `Intl.ListFormat(locales, options)` without `new`
- `Intl.ListFormat.supportedLocalesOf(locales, options)`
- `listFormat.format(list)`
- `listFormat.resolvedOptions()`

Not implemented:

- `listFormat.formatToParts(list)`
- general iterable input
- Set input
- Map input
- ChainListFormat special receiver behavior

## Examples

```javascript
//@include "Intl-core.js"
//@include "Intl.ListFormat.js"

var conjunction = new Intl.ListFormat("hu-HU", {
    type: "conjunction",
    style: "long"
});
conjunction.format(["alma", "korte", "barack"]);
// "alma, korte es barack"

var shortConjunction = new Intl.ListFormat("hu-HU", {
    type: "conjunction",
    style: "short"
});
shortConjunction.format(["alma", "korte", "barack"]);
// "alma, korte & barack"

var disjunction = new Intl.ListFormat("hu-HU", {
    type: "disjunction",
    style: "narrow"
});
disjunction.format(["alma", "korte", "barack"]);
// "alma/korte/barack"

var unitList = new Intl.ListFormat("hu-HU", {
    type: "unit",
    style: "narrow"
});
unitList.format(["1 m", "20 cm", "3 mm"]);
// "1 m 20 cm 3 mm"

var fromString = new Intl.ListFormat("hu-HU");
fromString.format("abc");
// "a, b es c"
```

## Supported Locales

- `en-US`
- `en-GB`
- `de-DE`
- `fr-FR`
- `hu-HU`

Unsupported requested locales fall back through `Intl.__resolveLocale__()`, defaulting to `en-US`.

The legacy input `en-UK` is accepted through `Intl-core.js` as an alias for `en-GB`.

`Intl.ListFormat.supportedLocalesOf()` returns only the implemented locales, preserving requested order after canonicalization. It accepts `localeMatcher: "best fit"` and `"lookup"` with identical behavior.

## Supported Input

Implemented:

- `Array` of strings
- `String`, treated as a character list

Not implemented:

- array-like objects
- Set
- Map
- generic iterables
- arrays containing non-string values

Unsupported input shapes throw `TypeError`.

## Supported Options

### `type`

Implemented:

- `conjunction`; default
- `disjunction`
- `unit`

Unsupported `type` values throw `RangeError`.

### `style`

Implemented:

- `long`; default
- `short`
- `narrow`

Unsupported `style` values throw `RangeError`.

Hungarian `short` and `narrow` patterns intentionally differ from Node/ICU where Node returns the same text as `long`. This subset keeps those styles useful:

- conjunction short: `A, B & C`
- conjunction narrow: `A, B, C`
- disjunction narrow: `A/B/C`
- unit short: `A, B, C`
- unit narrow: `A B C`

### `localeMatcher`

Accepted only as an ignored compatibility option.

Locale resolution is handled by `Intl.__resolveLocale__()`.

## Not Implemented

- `formatToParts()`
- general iterable consumption
- CLDR list-pattern completeness beyond the supported locale tables

## Tests

- `tests/tests-Intl-ListFormat.js`
- `tests/tests-Intl-ListFormat-examples.js`

The harness runs under both Node and ExtendScript Toolkit.
