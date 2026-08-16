# Intl.Collator Subset

`Intl.Collator.js` implements a deliberately small, table-driven `Intl.Collator` subset for Adobe ExtendScript. It is intended for predictable string comparison in the supported locales, not for full Unicode Collation Algorithm or CLDR parity.

`Intl-core.js` must be loaded before this file.

The small lowercase and accent collation tables are supplied by `Intl-core.js`.

## Constructor and Methods

Implemented:

- `new Intl.Collator(locales, options)`
- `Intl.Collator(locales, options)` without `new`
- `Intl.Collator.supportedLocalesOf(locales, options)`
- `collator.compare(a, b)`
- `collator.resolvedOptions()`

Not implemented:

- bound `compare` getter semantics
- full Unicode Collation Algorithm
- full CLDR locale tailoring

## Examples

```javascript
//@include "Intl-core.js"
//@include "Intl.Collator.js"

var base = new Intl.Collator("fr-FR", { sensitivity: "base" });
base.compare("resume", "résumé");
// 0

var accent = new Intl.Collator("de-DE", { sensitivity: "accent" });
accent.compare("u", "ü");
// negative value

var caseFirst = new Intl.Collator("hu-HU", {
    sensitivity: "case",
    caseFirst: "upper"
});
caseFirst.compare("ű", "Ű");
// positive value

var punctuation = new Intl.Collator("en-US", { ignorePunctuation: true });
punctuation.compare("a-b", "ab");
// 0

var natural = new Intl.Collator("en-US", { numeric: true });
natural.compare("file2", "file10");
// negative value

var words = ["Éva", "Adam", "Ábel", "Zoé"];
var sorter = new Intl.Collator("hu-HU", {
    sensitivity: "base",
    caseFirst: "upper"
});
words.sort(function (a, b) {
    return sorter.compare(a, b);
});
// words is now sorted with the local Intl subset comparator

var files = ["file10", "file2", "file1"];
var naturalSorter = new Intl.Collator("en-US", { numeric: true });
files.sort(function (a, b) {
    return naturalSorter.compare(a, b);
});
// ["file1", "file2", "file10"]
```

## Supported Locales

- `en-US`
- `en-GB`
- `de-DE`
- `fr-FR`
- `hu-HU`

Unsupported locales fall back through `Intl-core.js`, currently to `en-US` unless a supported requested locale is found. The legacy input `en-UK` resolves to `en-GB`.

`Intl.Collator.supportedLocalesOf()` returns only the implemented locales, preserving requested order after canonicalization. It accepts `localeMatcher: "best fit"` and `"lookup"` with identical behavior.

## Implemented Options

### `usage`

Implemented values:

- `sort` (default)
- `search`

`search` is accepted and returned from `resolvedOptions()`, but it uses the same compare core as `sort`. There is no separate search collation tailoring in this subset.

Unsupported values throw `RangeError`.

### `sensitivity`

Implemented values:

- `base`
- `accent`
- `case`
- `variant` (default)

Implemented behavior:

- `base` ignores accents and case where the locale table says the letters share a base.
- `accent` keeps accents but ignores case.
- `case` keeps case but ignores accents.
- `variant` keeps both accents and case.

Hungarian has a small special table: `a/a-acute`, `o/o-acute`, and `u/u-acute` share base groups, but `o/o-umlaut` and `u/u-umlaut` remain distinct base groups.

Unsupported values throw `RangeError`.

### `caseFirst`

Implemented values:

- `false` (default; lower-case variants sort before upper-case variants in this subset)
- `upper`
- `lower`

`caseFirst` is applied only when `sensitivity` keeps case differences: `case` or `variant`. It uses the same small uppercase/lowercase table as the comparator, including supported accented Latin pairs such as A-acute/a-acute, E-acute/e-acute, O-double-acute/o-double-acute, and U-double-acute/u-double-acute.

Unsupported values throw `RangeError`.

### `ignorePunctuation`

Implemented values:

- `false` (default)
- `true`

When true, ASCII punctuation is removed before comparison. This is intentionally narrow and does not implement full Unicode punctuation classes.

## Recognized But Not Implemented Options

### `localeMatcher`

Recognized values:

- `best fit` (default)
- `lookup`

Both currently use the same `Intl-core.js` locale resolver. Unsupported values throw `RangeError`.

### `numeric`

Implemented values:

- `false` (default)
- `true`

`true` enables a deliberately narrow ASCII digit-run comparison. Consecutive `0..9` characters are compared as integer digit sequences without converting them to `Number`, so very long digit runs do not lose precision.

Implemented behavior:

- `file2` sorts before `file10`
- `2` sorts before `10`
- leading zeros are ignored, so `file02` compares equal to `file2`
- separators such as `.`, `,`, `-`, `+`, and `e` remain ordinary characters; there is no decimal, negative-number, or exponent parsing

Not implemented:

- Unicode digit classes
- locale decimal separators
- floating-point number parsing
- negative-number parsing

### `collation`

Recognized value:

- `default` (default)
- `standard` (accepted as an alias)

`standard` is accepted as the MDN-named default ordering alias, but `resolvedOptions().collation` returns the subset's normalized value: `default`. Other collation values throw `RangeError`.

## Out of Scope

- locale-specific digraph and trigraph collation such as full Hungarian `cs`, `dzs`, `gy`, `ly`, `ny`, `sz`, `ty`, `zs`
- German phonebook collation
- French backwards accent sorting
- Unicode normalization beyond the small built-in accent tables
- emoji, kana, width, script, or non-Latin collation handling
- collation variants other than `default`
- separate `search` tailoring

## Tests

Regression coverage is in:

- `tests/tests-Intl-Collator.js`
- `tests/tests-Intl-Collator-examples.js`
- `Data/Collator.json`

The test file runs under both Node and ExtendScript Toolkit. Node is used only for fast development verification and observed reference behavior; ExtendScript remains the production target.
