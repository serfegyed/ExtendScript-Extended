# Temporal.Now

`Lib/Temporal.Now.js` is the system-clock namespace for this ExtendScript/InDesign-focused Temporal subset.

The supported surface is intentionally limited to obtaining the current exact time as a millisecond-precision `Temporal.Instant`.

## References

- [TC39 Temporal.Now documentation](https://tc39.es/proposal-temporal/docs/now.html)
- [MDN Temporal.Now reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Now)

## Files

- Active implementation: `Lib/Temporal.Now.js`
- Tests: `Test/tests-Now.js`
- Required includes: `Lib/Temporal-core.js`, `Lib/Temporal.Instant.js`, `Lib/Temporal.Now.js`

```javascript
//@include "Lib/Temporal-core.js"
//@include "Lib/Temporal.Instant.js"
//@include "Lib/Temporal.Now.js"
```

## Supported Surface

- `Temporal.Now.instant()`

`Temporal.Now` is a namespace object, not a constructor.

```javascript
var now = Temporal.Now.instant();

now instanceof Temporal.Instant;
// true

now.epochMilliseconds;
// integer epoch milliseconds from the native system clock
```

Each call returns a fresh `Temporal.Instant`. Extra arguments are ignored, matching the Node Temporal method shape.

## System Clock

`Temporal.Now.instant()` reads the native system clock with:

```javascript
new Date().getTime()
```

This is the only module where native `Date` is intentionally used. It supplies an epoch-millisecond clock value only. No local calendar fields, time-zone offsets, DST rules, parsing, or formatting are delegated to `Date`.

The clock value is passed through the project's public millisecond `Temporal.Instant` constructor, so the shared integer and Instant-range validation remains in one place.

## Intentional Limits

The following Node Temporal.Now methods are not implemented:

- `Temporal.Now.timeZoneId()`
- `Temporal.Now.plainDateTimeISO()`
- `Temporal.Now.zonedDateTimeISO()`
- `Temporal.Now.plainDateISO()`
- `Temporal.Now.plainTimeISO()`

They require a local time-zone identity, time-zone conversion, or ZonedDateTime behavior that is outside this repository's ISO/millisecond target.

There is no IANA time-zone database, `Temporal.ZonedDateTime`, locale formatting, or implicit local-time conversion in this module.

## Verification

The branch-specific harness contains 5 test groups and runs under both ExtendScript Toolkit and Node.

- Node 26 branch harness: 5 passed, 0 failed
- bundled Node 24 branch harness: 5 passed, 0 failed
- ExtendScript Toolkit branch harness: 5 passed, 0 failed
- system-clock differential invariants: 2000 passed, 0 failed
- complete Node regression after implementation: 114 passed, 0 failed

Because the current time is inherently variable, the tests use the same invariant verified against Node Temporal: the returned value is a fresh Instant with integer epoch milliseconds inside the surrounding native system-clock window.
