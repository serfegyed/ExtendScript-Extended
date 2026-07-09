# Function polyfills for ExtendScript

Function prototype methods for ESTK and Adobe ExtendScript. Each polyfill
installs itself only when the method is missing.

## Included methods

### `Function.prototype.bind()`

Creates a function with a fixed `this` value and optional leading arguments.

- Throws `TypeError` when called on a non-function receiver.
- Preserves bound leading arguments.
- Ignores the call-time `this` value for regular calls.
- Supports constructor calls through bound functions.
- Does not attempt to reproduce native `length` or `name` metadata.

```javascript
//@include "bind.js"

function label(value) {
    return this.prefix + value;
}

var bound = label.bind({ prefix: "ID-" });
bound("42");
// "ID-42"
```

## Tests

Run `Test/tests-Function.js` in ESTK or Node. The harness disables native
`Function.prototype.bind()` so the project implementation is tested directly.

Current Node checkpoint: **7 passed, 0 failed**.

## Compatibility

The production targets are ESTK and Adobe applications using ExtendScript.
Node is used only as a convenient behavior reference during testing.
