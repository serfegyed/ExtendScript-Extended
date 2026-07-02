# JSON Polyfill for ExtendScript

An ExtendScript-compatible implementation of:

- `JSON.stringify(value, replacer, space)`
- `JSON.parse(text, reviver)`

The parser is a strict recursive-descent parser. It does not use `eval`.

## Target

The polyfill targets the ES5 JSON API produces strict JSON text. The implementation deliberately uses ExtendScript-compatible syntax and does not require modern Array or Object methods.

If a host already provides either JSON method, that method is left unchanged.

## Installation

Include only the method that is used:

```javascript
//@include "JSON.stringify.js"
```

```javascript
//@include "JSON.parse.js"
```

The convenience bundle loads both standalone methods:

```javascript
//@include "JSON.js"
```

`JSON.js` is include-only and contains no copied implementation bodies.

## Stringification

```javascript
const value = {
    name: "Ada",
    active: true,
    scores: [10, 20, 30]
};

const text = JSON.stringify(value);
// {"name":"Ada","active":true,"scores":[10,20,30]}
```

Supported behavior includes:

- Correct escaping of quotation marks, backslashes, control characters, and
  lone UTF-16 surrogate code units.
- `NaN`, `Infinity`, and `-Infinity` are serialized as `null`.
- Unsupported object properties are omitted; unsupported array elements and
  holes are serialized as `null`.
- Circular structures throw a `TypeError`.
- Boxed String, Number, and Boolean values are unwrapped.
- Replacer functions, replacer property lists, and indentation are supported.

### `toJSON()`

Before applying the replacer, `JSON.stringify` calls an object's inherited or
own `toJSON(key)` method when present.

```javascript
const value = {
    created: {
        year: 2026,
        month: 6,
        day: 30,
        toJSON: function (key) {
            return this.year + "-06-30";
        }
    }
};

JSON.stringify(value);
// {"created":"2026-06-30"}
```

The polyfill does not add `Date.prototype.toJSON`. Dates and other custom
objects use their existing `toJSON()` implementations when available.

## Parsing

```javascript
const value = JSON.parse('{"name":"Ada","scores":[10,20,30]}');
```

The parser accepts only JSON whitespace, strings, numbers, booleans, `null`,
arrays, and objects. It rejects extensions such as comments, single-quoted
strings, trailing commas, leading-zero numbers, invalid escapes, and trailing
input.

The optional reviver walks child values before their parents. Returning
`undefined` deletes the corresponding property or array element.

## Known host limitations

- Object property output order follows the enumeration order of the active
  ExtendScript host and should not be treated as a stable sorting guarantee.
- Adobe application host objects are outside the guaranteed data model. Plain
  JavaScript objects and arrays are the intended input.
- An object containing an own `__proto__` key receives a null prototype on old
  ExtendScript hosts that cannot define a shadowing data property. This keeps
  the parsed key as data and prevents prototype injection.
- Recursion depth is limited by the host JavaScript stack.
- Modern APIs such as `JSON.rawJSON`, BigInt handling, and reviver context
  objects are intentionally outside the ExtendScript target.

## Tests

`JSON-test.js` runs in both environments:

- Node.js saves the native JSON implementation as the behavior reference,
  disables it, loads the polyfill, and checks both results.
- ExtendScript loads `Console/console.js` and both standalone JSON files through include
  directives and executes the same fixed expectations.

Node.js:

```text
node JSON-test.js
```

`JSON-integration-test.js` loads the active Date and Temporal polyfills from
`../Temporal/Lib` and verifies that `JSON.stringify` uses the real `toJSON()`
methods of Date, Duration, Instant, PlainDateTime, PlainDate, PlainTime,
PlainYearMonth, and PlainMonthDay objects.

```text
node JSON-integration-test.js
```
