# Temporal.Instant

`Lib/Temporal.Instant.js` represents an exact point on the UTC timeline in this ExtendScript/InDesign-focused Temporal subset.

The implementation stores one integer epoch-millisecond value. It does not emulate Temporal's native BigInt nanosecond representation.

## References

- [TC39 Temporal.Instant documentation](https://tc39.es/proposal-temporal/docs/instant.html)
- [MDN Temporal.Instant reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Instant)

## Files

- Active implementation: `Lib/Temporal.Instant.js`
- Tests: `Test/tests-Instant.js`; optional host-local adapter tests: `Test/tests-LocaleDate.js`
- Required includes: `Lib/Temporal-core.js`, `Lib/Temporal.Duration.js`, `Lib/Temporal.Instant.js`
- Optional final include: `Lib/Temporal.LocaleDate.js`

```javascript
//@include "Lib/Temporal-core.js"
//@include "Lib/Temporal.Duration.js"
//@include "Lib/Temporal.Instant.js"
```

## Supported Surface

- `new Temporal.Instant(epochMilliseconds)`
- `Temporal.Instant.from(value)`
- `Temporal.Instant.fromEpochMilliseconds(epochMilliseconds)`
- `Temporal.Instant.compare(one, two)`
- `instant.epochMilliseconds`
- `instant.add(duration)`
- `instant.subtract(duration)`
- `instant.until(other, options)`
- `instant.since(other, options)`
- `instant.round(roundTo)`
- `instant.equals(other)`
- `instant.toString(options)`
- `instant.toJSON()`
- `instant.toLocaleString()` when `Lib/Temporal.LocaleDate.js` is loaded
- `instant.valueOf()` rejection

## Construction

The native Temporal constructor accepts epoch nanoseconds as a BigInt. ExtendScript has no BigInt, so this project defines the corresponding constructor entry point in the project's supported precision: integer epoch milliseconds.

```javascript
var instant = new Temporal.Instant(0);
instant.toString();
// "1970-01-01T00:00:00Z"
```

The explicit factory is an equivalent entry point:

```javascript
var instant = Temporal.Instant.fromEpochMilliseconds(0);
instant.toString();
// "1970-01-01T00:00:00Z"
```

The constructor and `fromEpochMilliseconds()` apply numeric coercion but require the result to be a finite integer within the Temporal Instant range:

- minimum: `-8640000000000000`
- maximum: `8640000000000000`

Fractional, infinite, NaN, and out-of-range values are rejected.

## String Parsing

`Temporal.Instant.from()` accepts another Instant or a supported ISO date-time string with a UTC designator or numeric offset.

```javascript
Temporal.Instant
    .from("2024-01-01T01:30:00+01:30")
    .toString();
// "2024-01-01T00:00:00Z"
```

Supported parsing behavior includes:

- `Z` and `z`
- positive and negative numeric offsets
- colon, compact, and hour-only offsets
- extended ISO years
- pre-epoch values
- fractional seconds with 1 through 9 digits
- bracketed time-zone annotations when `Z` or a numeric offset is present
- leap-second input, constrained to second 59 like the Node reference

Date-only strings and date-time strings without an offset are rejected.

The internal value is always millisecond precision. Sub-millisecond string input is reduced to the same `epochMilliseconds` value reported by Node Temporal. Digits below milliseconds are not retained.

The Instant parser, epoch-millisecond range validation, and UTC ISO-field conversion are shared through `Lib/Temporal-core.js`. The Plain date/time types reuse this exact path for the repository's documented UTC projection extension; there is no second offset parser.

## Arithmetic

`add()` and `subtract()` accept only fixed time Duration fields:

- hours
- minutes
- seconds
- milliseconds

Years, months, weeks, and days are rejected because an Instant has no calendar or time-zone context.

```javascript
Temporal.Instant
    .from("2024-01-01T00:00:00.123Z")
    .add({ hours: 1, milliseconds: 2 })
    .toString();
// "2024-01-01T01:00:00.125Z"
```

Arithmetic that crosses the minimum or maximum Instant boundary is rejected.

## Differences And Rounding

`until()` and `since()` return a `Temporal.Duration`.

Supported largest and smallest units are:

- hour
- minute
- second
- millisecond

Singular and plural unit spellings are accepted. Date units are rejected.

Supported rounding modes are:

- `ceil`
- `floor`
- `expand`
- `trunc`
- `halfCeil`
- `halfFloor`
- `halfExpand`
- `halfTrunc`
- `halfEven`

Rounding increments must be positive integers and obey the selected unit's divisibility and maximum rules.

```javascript
Temporal.Instant
    .fromEpochMilliseconds(0)
    .until(
        Temporal.Instant.fromEpochMilliseconds(90061001),
        { largestUnit: "hour" }
    )
    .toString();
// "PT25H1M1.001S"
```

## Formatting

`toString()` always produces UTC output ending in `Z`.

Supported options include:

- `smallestUnit`: minute, second, or millisecond
- `fractionalSecondDigits`
- `roundingMode`

Extended years and pre-epoch values are formatted without relying on native `Date`, the machine's local time zone, or DST behavior.

`toJSON()` returns the default ISO string. `valueOf()` always throws; use `Temporal.Instant.compare()` or `equals()` instead.

### Optional Host-Local ISO Formatting

Loading `Lib/Temporal.LocaleDate.js` after Instant installs `Instant.prototype.toLocaleString()`. The result is a fixed numeric host-local ISO string, not locale-sensitive Intl output:

```javascript
Temporal.Instant.from("2026-01-15T12:34:56.123Z").toLocaleString();
// Example on a UTC+01:00 host: "2026-01-15T13:34:56.123+01:00"
```

The adapter constructs native `Date` directly from `epochMilliseconds`, then reads `getFullYear()`, `getMonth()`, `getDate()`, `getHours()`, `getMinutes()`, `getSeconds()`, `getMilliseconds()`, and `getTimezoneOffset()`. It does not use native ISO parsing, native locale formatting, Date arithmetic, or Date-based Temporal validation.

The output always has millisecond precision. Extra locale and options arguments are intentionally ignored. See `LocaleDate-ReadMe.md` for the adapter contract and ESTK audit results.

## Intentional Limits

- public construction is millisecond-based rather than BigInt nanosecond-based
- no `epochNanoseconds` or `epochMicroseconds`
- no `fromEpochNanoseconds()`
- no microsecond or nanosecond storage
- no `toZonedDateTimeISO()`
- no IANA time-zone calculations or time-zone database
- no `Temporal.ZonedDateTime`
- no Intl-based locale formatting or locale/options processing
- no `Temporal.Now` in this module

## Verification

The branch-specific harness contains 14 test groups and runs under both ExtendScript and Node.

- Node reference: Node 26.3.1 Temporal
- focused differential audit: 1027 passed, 0 failed
- branch harness under Node: 14 passed, 0 failed
- UTC projection harness under Node: 13 passed, 0 failed
- UTC projection harness under ExtendScript Toolkit: 13 passed, 0 failed
- LocaleDate harness under Node: 10 passed, 0 failed
- LocaleDate harness under ExtendScript Toolkit: 10 passed, 0 failed
- complete Node regression after implementation: 127 passed, 0 failed

Expected values were captured from Node Temporal for matching inputs before being fixed in the project harness.
