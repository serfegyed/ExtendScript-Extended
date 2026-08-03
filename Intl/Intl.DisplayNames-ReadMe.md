# Intl.DisplayNames Subset

`Intl.DisplayNames.js` implements a focused, ExtendScript-friendly subset of `Intl.DisplayNames`. It is table-driven and intentionally limited to names that are useful for the current Intl and Temporal work.

`Intl-core.js` must be loaded before this file.

Language, region, and currency display-name tables are supplied by `Intl-core.js`.

## Constructor and Methods

Implemented:

- `new Intl.DisplayNames(locales, options)`
- `Intl.DisplayNames(locales, options)` without `new`
- `Intl.DisplayNames.supportedLocalesOf(locales, options)`
- `displayNames.of(code)`
- `displayNames.resolvedOptions()`

Not implemented:

- ChainDisplayNames special receiver behavior

## Examples

```javascript
//@include "Intl-core.js"
//@include "Intl.DisplayNames.js"

var languages = new Intl.DisplayNames("hu-HU", { type: "language" });
languages.of("en-US");
// "amerikai angol"

var standardLanguages = new Intl.DisplayNames("hu-HU", {
    type: "language",
    languageDisplay: "standard"
});
standardLanguages.of("en-US");
// "angol (Egyesült Államok)"

var regions = new Intl.DisplayNames("fr-FR", { type: "region" });
regions.of("US");
// "États-Unis"

var currencies = new Intl.DisplayNames("de-DE", { type: "currency" });
currencies.of("GBP");
// "Britisches Pfund"

var fallbackCode = new Intl.DisplayNames("hu-HU", {
    type: "region",
    fallback: "code"
});
fallbackCode.of("IT");
// "IT"

var fallbackNone = new Intl.DisplayNames("hu-HU", {
    type: "region",
    fallback: "none"
});
fallbackNone.of("IT");
// undefined
```

## Supported Locales

- `en-US`
- `en-GB`
- `de-DE`
- `fr-FR`
- `hu-HU`

Unsupported requested locales fall back through `Intl.__resolveLocale__()`, defaulting to `en-US`.

The legacy input `en-UK` is accepted through `Intl-core.js` as an alias for `en-GB`.

`Intl.DisplayNames.supportedLocalesOf()` returns only the implemented locales, preserving requested order after canonicalization. It accepts `localeMatcher: "best fit"` and `"lookup"` with identical behavior.

## Supported Types

Implemented `type` values:

- `language`
- `region`
- `currency`

Not implemented `type` values:

- `script`
- `calendar`
- `dateTimeField`

Unsupported `type` values throw `RangeError`.

## Supported Options

### `type`

Required.

Implemented:

- `language`
- `region`
- `currency`

### `style`

Implemented:

- `long`; default

Not implemented:

- `short`
- `narrow`

Unsupported `style` values throw `RangeError`.

### `fallback`

Implemented:

- `code`; default
- `none`

For known table entries, `of()` returns the localized name. For well-formed unknown codes, `fallback: "code"` returns the canonicalized code and `fallback: "none"` returns `undefined`.

Unsupported `fallback` values throw `RangeError`.

### `languageDisplay`

Implemented for `type: "language"`:

- `dialect`; default
- `standard`

For non-language types, `languageDisplay` is ignored and omitted from `resolvedOptions()`.

Unsupported `languageDisplay` values throw `RangeError`.

### `localeMatcher`

Accepted only as an ignored compatibility option.

Locale resolution is handled by `Intl.__resolveLocale__()`.

## Supported Codes

### Language Codes

Implemented table entries:

- `en`
- `en-US`
- `en-GB`
- `de`
- `de-DE`
- `fr`
- `fr-FR`
- `hu`
- `hu-HU`

Language codes are canonicalized through the narrow `Intl-core.js` locale canonicalizer.

### Region Codes

Implemented table entries:

- `US`
- `GB`
- `DE`
- `FR`
- `HU`

Region codes must be two ASCII letters.

### Currency Codes

Implemented table entries:

- `USD`
- `GBP`
- `EUR`
- `HUF`

Currency codes must be three ASCII letters.

## Not Implemented

- full CLDR display name data
- full BCP 47 parsing
- Unicode extension parsing
- localized unknown-region names such as CLDR "Unknown Region"
- short or narrow display-name tables
- script names
- calendar names
- date-time field names
- language names outside the table above
- region names outside the table above
- currency names outside the table above
