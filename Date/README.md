# Date polyfills for ExtendScript

Date prototype methods for ESTK and Adobe ExtendScript. Each polyfill is an
individually includable file in `Lib` and installs itself only when the method
is missing. This folder currently has no aggregate bundle.

## Included methods

### `Date.prototype.toISOString()`

Returns the Date value as a UTC ISO string with millisecond precision.

- Supports regular years and signed six-digit extended years.
- Throws `RangeError` for invalid Date values.
- Throws `TypeError` for incompatible receivers.
- Uses native Date prototype getters, so overridden instance getters do not
  affect the result.

```javascript
//@include "Lib/Date.toISOString.js"

new Date(0).toISOString();
// "1970-01-01T00:00:00.000Z"
```

### `Date.prototype.toJSON()`

Implements Date JSON conversion behavior.

- Returns the ISO string for valid dates.
- Returns `null` for non-finite numeric Date values.
- Is generic and calls the receiver's own `toISOString()` method.
- Throws `TypeError` when `toISOString` is not callable.

Include `Date.toISOString.js` first when ExtendScript does not already provide
that method.

```javascript
//@include "Lib/Date.toISOString.js"
//@include "Lib/Date.toJSON.js"

new Date(0).toJSON();
// "1970-01-01T00:00:00.000Z"
```

### `Date.prototype.toTemporalInstant()`

Converts the exact epoch-millisecond Date value to `Temporal.Instant`.

- Preserves positive and negative epoch millisecond values.
- Throws `RangeError` for invalid Date values.
- Throws `TypeError` for incompatible receivers or an unavailable Temporal
  implementation.

`Temporal-core.js` and `Temporal.Instant.js` must be loaded before the method is
called.

```javascript
//@include "../Temporal/Lib/Temporal-core.js"
//@include "../Temporal/Lib/Temporal.Instant.js"
//@include "Lib/Date.toTemporalInstant.js"

new Date(0).toTemporalInstant().toString();
// "1970-01-01T00:00:00Z"
```

## Tests

Run `Test/tests-Date.js` in ESTK or Node. The harness disables native Date
methods so the project implementations are tested directly, and it loads the
required Temporal subset for `toTemporalInstant()`.

Current ESTK checkpoint: **14 passed, 0 failed**.

## Compatibility

The production targets are ESTK and Adobe applications using ExtendScript.
Node is used only as a convenient behavior reference during testing.
