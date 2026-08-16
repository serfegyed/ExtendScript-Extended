# Intl.PluralRules Subset

`Intl.PluralRules.js` implements a focused, ExtendScript-friendly subset of `Intl.PluralRules`. It uses small hand-written rules based on CLDR plural categories for the supported locales.

`Intl-core.js` must be loaded before this file. It explicitly includes the Public `JSON.parse.js` helper, so no separate JSON include is required for Intl.

The `en-US` category baseline is built into `Intl-core.js`; non-`en-US` category tables are read from `Data/PluralRules.json` through Core.

## Constructor and Methods

Implemented:

- `new Intl.PluralRules(locales, options)`
- `Intl.PluralRules(locales, options)` without `new`
- `Intl.PluralRules.supportedLocalesOf(locales, options)`
- `pluralRules.select(number)`
- `pluralRules.resolvedOptions()`

Not implemented:

- `pluralRules.selectRange(start, end)`
- digit and rounding options
- full CLDR plural-rule expression parsing
- compact/exponent plural operands
- ChainPluralRules special receiver behavior

## Examples

```javascript
//@include "Intl-core.js"
//@include "Intl.PluralRules.js"

var englishCardinal = new Intl.PluralRules("en-US");
englishCardinal.select(1);
// "one"
englishCardinal.select(2);
// "other"

var englishOrdinal = new Intl.PluralRules("en-US", {
    type: "ordinal"
});
englishOrdinal.select(1);
// "one"
englishOrdinal.select(2);
// "two"
englishOrdinal.select(3);
// "few"
englishOrdinal.select(11);
// "other"

var frenchCardinal = new Intl.PluralRules("fr-FR");
frenchCardinal.select(0);
// "one"
frenchCardinal.select(1000000);
// "many"

var hungarianOrdinal = new Intl.PluralRules("hu-HU", {
    type: "ordinal"
});
hungarianOrdinal.select(5);
// "one"
```

## Supported Locales

- `en-US`
- `en-GB`
- `de-DE`
- `fr-FR`
- `hu-HU`

Unsupported requested locales fall back through `Intl.__resolveLocale__()`, defaulting to `en-US`.

The legacy input `en-UK` is accepted through `Intl-core.js` as an alias for `en-GB`.

`Intl.PluralRules.supportedLocalesOf()` returns only the implemented locales, preserving requested order after canonicalization. It accepts `localeMatcher: "best fit"` and `"lookup"` with identical behavior.

## Returned Categories

`select()` returns standard CLDR/Intl category strings:

- `zero`
- `one`
- `two`
- `few`
- `many`
- `other`

The implemented locales currently use only the categories listed by `resolvedOptions().pluralCategories`.

## Supported Options

### `type`

Implemented:

- `cardinal`; default
- `ordinal`

Unsupported `type` values throw `RangeError`.

### `localeMatcher`

Accepted only as an ignored compatibility option.

Locale resolution is handled by `Intl.__resolveLocale__()`.

## Implemented Category Sets

### Cardinal

- `en-US`: `one`, `other`
- `en-GB`: `one`, `other`
- `de-DE`: `one`, `other`
- `fr-FR`: `one`, `many`, `other`
- `hu-HU`: `one`, `other`

### Ordinal

- `en-US`: `one`, `two`, `few`, `other`
- `en-GB`: `one`, `two`, `few`, `other`
- `de-DE`: `other`
- `fr-FR`: `one`, `other`
- `hu-HU`: `one`, `other`

## Not Implemented Options

These options throw `RangeError` when provided:

- `minimumIntegerDigits`
- `minimumFractionDigits`
- `maximumFractionDigits`
- `minimumSignificantDigits`
- `maximumSignificantDigits`
- `roundingIncrement`
- `roundingMode`
- `roundingPriority`
- `trailingZeroDisplay`

## Tests

- `tests/tests-Intl-PluralRules.js`
- `tests/tests-Intl-PluralRules-examples.js`
- `Data/PluralRules.json`

The harness runs under both Node and ExtendScript Toolkit.
