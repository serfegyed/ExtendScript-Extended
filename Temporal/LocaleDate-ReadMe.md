# Temporal.LocaleDate Adapter

`Lib/Temporal.LocaleDate.js` is an optional final adapter that adds language-independent ISO-style `toLocaleString()` methods to every supported Temporal object that has that specification surface.

It is intentionally separate from Temporal Core and Instant. The arithmetic and parsing modules remain independent of native `Date`; only this adapter asks the host for local calendar fields and the offset that applies to an already validated Instant.

## Related References

- [TC39 Temporal documentation](https://tc39.es/proposal-temporal/docs/)
- [MDN Temporal reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)

`Temporal.LocaleDate` is a project adapter, not a standard Temporal object. The object-specific reference links are listed in the corresponding README files.

## Files And Loading

- Active adapter: `Lib/Temporal.LocaleDate.js`
- Tests: `Test/tests-LocaleDate.js`
- ESTK host audit: `Test/audit-HostLocalDate.js`

Load the adapter after all Temporal object modules:

```javascript
//@include "Lib/Temporal-core.js"
//@include "Lib/Temporal.Duration.js"
//@include "Lib/Temporal.Instant.js"
//@include "Lib/Temporal.LocaleDate.js"
```

## Supported Surface

The adapter installs one method:

- `Temporal.Instant.prototype.toLocaleString()`
- `Temporal.PlainDateTime.prototype.toLocaleString()`
- `Temporal.PlainDate.prototype.toLocaleString()`
- `Temporal.PlainTime.prototype.toLocaleString()`
- `Temporal.PlainYearMonth.prototype.toLocaleString()`
- `Temporal.PlainMonthDay.prototype.toLocaleString()`

Duration already supplies `Duration.prototype.toLocaleString()` as an ISO `toString()` alias and is not patched by this adapter.

```javascript
var instant = Temporal.Instant.from("2026-07-15T12:34:56.123Z");
instant.toLocaleString();
// Example on a UTC+02:00 host:
// "2026-07-15T14:34:56.123+02:00"
```

The name follows the familiar Temporal surface, but the behavior is deliberately narrower. This is a host-local ISO string, not language-sensitive localization.

PlainDateTime is interpreted as host-local wall time and receives the offset that applies to that local date-time. If the fields fall in a DST gap or overlap, native Date selects the normalized occurrence. PlainDate, PlainTime, PlainYearMonth, and PlainMonthDay have insufficient fields for a date-specific offset, so they return only their own ISO fields and never invent a date or time.

The output format is:

```text
YYYY-MM-DDTHH:mm:ss.sss+HH:mm
```

Extended years use signed six-digit ISO notation. The numeric offset is calculated from `getTimezoneOffset()` with the ISO sign direction: a host result of `-120` becomes `+02:00`.

## Native Date Boundary

The Instant Date construction path is:

```javascript
new Date(instant.epochMilliseconds)
```

The adapter reads only these host values:

- `getFullYear()`
- `getMonth()`
- `getDate()`
- `getHours()`
- `getMinutes()`
- `getSeconds()`
- `getMilliseconds()`
- `getTimezoneOffset()`

Native `Date` is not used for Temporal parsing, arithmetic, validation, internal representation, or ISO formatting. `Date.prototype.toLocaleString()` is never called.

PlainDateTime uses the numeric local setters `setFullYear()` and `setHours()` rather than parsing a string. This deliberately delegates DST gap normalization and overlap selection to the host.

The ESTK audit demonstrated why this boundary is strict:

- native ISO string parsing: 0/7
- direct epoch-millisecond construction: 7/7
- winter and summer local getters returned the expected host DST offsets

## Intentional Limits

- current host time zone only
- no selectable IANA zone such as `Europe/Budapest`
- no bundled time-zone database or custom DST calculation
- no Intl localization
- no locale or options processing; extra arguments are ignored
- no day or month names
- millisecond precision only
- no invented date/time fields for partial Plain objects

## Verification

The branch harness contains 10 test groups covering numeric layout, milliseconds, pre-epoch values, extended years, Instant range endpoints, winter/summer offsets, avoidance of ISO reparsing, ignored arguments, and receiver validation.

The all-object `Test/tests-LocaleString.js` harness contains 10 additional groups covering all seven supported specification objects, partial-field preservation, PlainDateTime DST behavior, offset syntax, ignored arguments, and receiver validation.

Current results:

```text
Node:                     Passed: 10, Failed: 0
ExtendScript Toolkit:     Passed: 10, Failed: 0
America/New_York Node:    Passed: 10, Failed: 0
Asia/Kathmandu Node:      Passed: 10, Failed: 0
All-object Node:           Passed: 10, Failed: 0
All-object ESTK:           Passed: 10, Failed: 0
```
