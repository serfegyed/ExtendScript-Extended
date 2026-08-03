# Intl.NumberFormat Subset

`Intl.NumberFormat.js` implements a focused, ExtendScript-friendly subset of `Intl.NumberFormat`. It is designed for practical decimal, percent, and currency output in the supported locales, not for full Intl or CLDR parity.

`Intl-core.js` must be loaded before this file.

Locale number separators, percent spacing, currency symbols, currency fraction defaults, and currency-name tables are supplied by `Intl-core.js`.

## Constructor and Methods

Implemented:

- `new Intl.NumberFormat(locales, options)`
- `Intl.NumberFormat(locales, options)` without `new`
- `Intl.NumberFormat.supportedLocalesOf(locales, options)`
- `numberFormat.format(value)`
- `numberFormat.formatRange(start, end)`
- `numberFormat.resolvedOptions()`

Not implemented:

- ChainNumberFormat special receiver behavior
- `formatToParts()`
- `formatRangeToParts()`

## Examples

```javascript
//@include "Intl-core.js"
//@include "Intl.NumberFormat.js"

var decimal = new Intl.NumberFormat("de-DE");
decimal.format(1234.56);
// "1.234,56"

var noGrouping = new Intl.NumberFormat("hu-HU", { useGrouping: false });
noGrouping.format(12345.6);
// "12345,6"

var percent = new Intl.NumberFormat("fr-FR", { style: "percent" });
percent.format(0.12);
// "12 %"

var currency = new Intl.NumberFormat("hu-HU", {
    style: "currency",
    currency: "HUF",
    currencyDisplay: "symbol"
});
currency.format(1234.56);
// "1234,56 Ft"

var code = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "code"
});
code.formatRange(1, 2);
// "EUR 1.00-EUR 2.00" with an N-dash between the two formatted values

var accounting = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencySign: "accounting"
});
accounting.format(-1234.56);
// "($1,234.56)"

var padded = new Intl.NumberFormat("en-US", { minimumIntegerDigits: 3 });
padded.format(7);
// "007"

var stripped = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    trailingZeroDisplay: "stripIfInteger"
});
stripped.format(1);
// "1 EUR" with the locale currency pattern and no decimal zeros
```

## Supported Locales

- `en-US`
- `en-GB`
- `de-DE`
- `fr-FR`
- `hu-HU`

Unsupported requested locales fall back through `Intl.__resolveLocale__()`, defaulting to `en-US`.

`Intl.NumberFormat.supportedLocalesOf()` returns only the implemented locales, preserving requested order after canonicalization. It accepts `localeMatcher: "best fit"` and `"lookup"` with identical behavior.

## Supported Styles

Implemented `style` values:

- `decimal`
- `percent`
- `currency`

Not implemented:

- `unit`

Unsupported `style` values throw `RangeError`.

## Supported Options

### `style`

Implemented:

- `decimal`; default
- `percent`
- `currency`

Not implemented:

- `unit`

### `currency`

Implemented only when `style` is `currency`.

Supported currency codes:

- `EUR`
- `USD`
- `GBP`
- `HUF`

Behavior:

- `currency` is required for `style: "currency"`.
- Input is normalized to uppercase.
- Unsupported currency codes throw `RangeError`.

### `currencyDisplay`

Implemented:

- `symbol`; default
- `code`
- `name`

`name` uses a small built-in currency-name table. It does not expose `Intl.DisplayNames` and does not implement general plural rules.

Minimal name behavior:

- `hu-HU`: fixed names such as `eur\u00F3`, `USA-doll\u00E1r`, `angol font`, `magyar forint`.
- `fr-FR`: singular if absolute value is less than 2, plural otherwise.
- `en-US` and `en-GB`: EUR, USD, and GBP use fixed plural names; HUF switches between `Hungarian forint` and `Hungarian forints`.
- `de-DE`: EUR, USD, and GBP use fixed names; HUF switches between `Ungarischer Forint` and `Ungarische Forint`.

Not implemented:

- `narrowSymbol`
- CLDR-backed currency names
- full plural rules

### `currencySign`

Implemented:

- `standard`; default
- `accounting`

Accounting behavior:

- `en-US`, `en-GB`, and `fr-FR` use parentheses for negative currency values.
- `de-DE` and `hu-HU` keep the standard minus-sign shape, matching the observed Node behavior for these locales.
- `signDisplay: "never"` suppresses negative sign display, so accounting parentheses are not shown.

### `numberingSystem`

Implemented:

- `latn`; default and only supported value

Not implemented:

- non-`latn` numbering systems such as `arab`
- Unicode locale extension parsing such as `en-US-u-nu-latn`

Unsupported numbering systems throw `RangeError`.

### `useGrouping`

Implemented:

- default grouping behavior, reported as `auto`
- `false` to disable grouping

Any value other than `false` is treated as `auto` in this subset.

Locale notes:

- `fr-FR` and `hu-HU` use `\u00A0` NBSP for grouping.
- `hu-HU` uses a two-digit minimum grouping rule: four-digit numbers are not grouped, five-digit and longer numbers are grouped.

### `minimumIntegerDigits`

Implemented:

- default `1`
- range `1..21`
- numeric coercion and truncation toward zero

Padding is applied before grouping.

### `minimumFractionDigits`

Implemented:

- numeric coercion and truncation toward zero
- range `0..100`

Defaults:

- decimal: `0`
- percent: `0`
- EUR, USD, GBP: `2`
- HUF: `0`

### `maximumFractionDigits`

Implemented:

- numeric coercion and truncation toward zero
- range `0..100`
- must not be less than `minimumFractionDigits`

Defaults:

- decimal: max of `minimumFractionDigits` and `3`
- percent: follows `minimumFractionDigits` when no maximum is provided
- EUR, USD, GBP: `2`
- HUF: `2`

### `signDisplay`

Implemented:

- `auto`; default
- `always`
- `exceptZero`
- `never`

Not implemented:

- `negative`

`negative` is intentionally omitted because numeric `-0` is not stable in ExtendScript Toolkit.

### `trailingZeroDisplay`

Implemented:

- `auto`; default
- `stripIfInteger`

`stripIfInteger` removes the fraction part when the rounded formatted value is an integer. It works for decimal, percent, and currency output.

## `formatRange(start, end)`

Implemented as a small subset:

- formats both endpoints with the same formatter
- joins different formatted endpoints with `\u2013` N-dash, without surrounding spaces
- if the two formatted endpoints are identical, returns `~` plus the formatted value
- throws on `NaN` endpoints

Not implemented:

- locale-specific range affix compression
- `formatRangeToParts()`
- Node's full range-pattern behavior

## Not Implemented Options

The following `Intl.NumberFormat` options are outside this subset:

- `notation`
- `compactDisplay`
- `unit`
- `unitDisplay`
- `minimumSignificantDigits`
- `maximumSignificantDigits`
- `roundingPriority`
- `roundingIncrement`
- `roundingMode`

## Tests

Regression harness:

- `tests/tests-Intl-NumberFormat.js`

Public examples harness:

- `tests/tests-Intl-NumberFormat-examples.js`

Both run under Node and ExtendScript Toolkit.
