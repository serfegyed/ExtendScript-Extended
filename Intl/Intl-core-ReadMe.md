# Intl Core Subset

`Intl-core.js` provides the shared locale helpers and central locale data tables used by the local Intl subset. It is intentionally small and table-driven.

## Implemented Public API

- `Intl.getCanonicalLocales(locales)`
- `Intl.supportedValuesOf(key)`

Supported input behavior:

- `undefined` returns an empty array.
- A string returns a one-item canonicalized array.
- An array-like object returns a canonicalized array.
- Duplicate canonical locale strings are removed, preserving first occurrence order.
- Locale casing is normalized, for example `en-us` becomes `en-US`.
- `en-UK` is accepted as an alias for `en-GB`.
- Simple unknown language tags such as `banana` are returned as simple canonical strings; locale support is decided by the resolver, not by canonicalization.

Errors:

- An empty string throws `RangeError` in Node; under ESTK the shared harness only requires that an error is thrown because native ExtendScript error names are not stable.
- Non-string, non-array-like inputs throw `TypeError` in Node; under ESTK the harness only requires a throw.
- Multi-part tags outside this subset, such as `en-US-extra`, throw.

## Implemented Internal Helpers

- `Intl.__canonicalizeLocales__(locales)`
- `Intl.__resolveLocale__(locales, availableLocales, fallbackLocale)`
- `Intl.__supportedLocalesOf__(locales, availableLocales, options, ownerName)`
- `Intl.__getLocaleData__(locale, section)`
- `Intl.__requireCore__(ownerName, needsCanonicalLocales)`
- `Intl.__toObject__(options, ownerName)`
- `Intl.__readStringOption__(options, name, allowed, defaultValue, ownerName)`
- `Intl.__pad__(value, length)`

`Intl.__resolveLocale__()` checks requested locales in order and returns the first supported locale. If no requested locale is supported, it returns the fallback locale. The default fallback is `en-US`.

`Intl.__supportedLocalesOf__()` returns the canonical requested locales that are implemented by the caller. It preserves requested order, drops unsupported locales, accepts `localeMatcher: "best fit"` and `"lookup"` with identical behavior, and throws `RangeError` for other `localeMatcher` values.

`Intl.__getLocaleData__()` returns the central table data used by the formatter modules. With a locale argument it returns that locale's table. With `undefined` or `null` as the locale argument it returns top-level shared tables such as currencies, collation maps, duration unit labels, and DisplayNames tables.

The other internal helpers are small shared primitives used by the formatter modules. They are not public Intl APIs.

## Central Locale Data

The core file owns the supported locale matrices so a new locale does not require duplicating basic tables across every formatter module.

Implemented central sections:

- `locales[locale].number`: separators, percent spacing, currency pattern, and currency names
- `locales[locale].dateTime`: default date fields, default hour cycle, month names, and weekday names
- `locales[locale].collation`: selected collation record map
- `locales[locale].listFormat`: list patterns for conjunction, disjunction, and unit formatting
- `currencies`: symbols and default fraction ranges for `EUR`, `USD`, `GBP`, and `HUF`
- `pluralRules`: cardinal and ordinal category lists for the supported locales
- `relativeTimeFormat`: phrase and unit-label tables for the supported locales
- `collation`: lowercase maps and small accent records
- `durationUnitLabels`: `short`, `long`, `digital`, and `narrow` unit labels
- `displayNames`: language, region, and currency name tables

Formatter modules may still contain object-specific algorithms and option validation. They should not reintroduce per-locale matrices unless that table is genuinely private to one algorithm.

## `Intl.supportedValuesOf()`

Implemented as a forgiving subset query. It returns a new array each time and does not throw for unknown keys.

Implemented values:

- `calendar`: `["gregory"]`
- `collation`: `["default", "standard"]`
- `currency`: `["EUR", "GBP", "HUF", "USD"]`
- `numberingSystem`: `["latn"]`
- `timeZone`: `[]`
- `unit`: `[]`

Unknown keys, `undefined`, and `null` return `[]`.

## Supported Locales

- `en-US`
- `en-GB`
- `de-DE`
- `fr-FR`
- `hu-HU`

Alias:

- `en-UK` -> `en-GB`

## Examples

```javascript
//@include "Intl-core.js"

var locales = Intl.getCanonicalLocales(["hu-hu", "en-UK", "hu-HU"]);
// ["hu-HU", "en-GB"]

var supportedCurrencies = Intl.supportedValuesOf("currency");
// ["EUR", "GBP", "HUF", "USD"]

var supportedCollations = Intl.supportedValuesOf("collation");
// ["default", "standard"]

var unknownValues = Intl.supportedValuesOf("unknown-key");
// []
```

## Not Implemented

- full BCP 47 validation
- Unicode extension parsing, including `-u-nu-*`
- real locale matcher behavior beyond accepting `best fit` and `lookup`
- lookup vs best-fit negotiation
- language-script-region canonicalization beyond the simple language-region shape
- CLDR-backed available locale discovery

## Tests

- `tests/tests-Intl-core.js`

The harness runs under both Node and ExtendScript Toolkit.
