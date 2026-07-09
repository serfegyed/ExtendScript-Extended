# ExtendScript Object extensions

Object methods for ESTK and Adobe ExtendScript. `Object.js` is the complete
include-only bundle; every implementation is also available separately in
`Lib`.

## Standard-compatible methods

- `Object.assign()`
- `Object.create()`
- `Object.defineProperty()`
- `Object.defineProperties()`
- `Object.entries()`
- `Object.fromEntries()`
- `Object.getOwnPropertyDescriptor()`
- `Object.getOwnPropertyDescriptors()`
- `Object.getOwnPropertyNames()`
- `Object.getPrototypeOf()`
- `Object.groupBy()`
- `Object.hasOwn()`
- `Object.is()`
- `Object.keys()`
- `Object.values()`

These are ExtendScript-compatible subsets where ES3 cannot expose the full
modern object model:

- `fromEntries()` accepts arrays of two-element rows.
- `getOwnPropertyDescriptor()` reports best-effort data descriptors for own
  values, array `length`, and function `length`. Accessors and true ES5
  writability/configurability are not emulated.
- `getOwnPropertyDescriptors()` builds on that same supported descriptor
  subset.
- `getOwnPropertyNames()` can return only enumerable own names.
- `getPrototypeOf()` accepts objects and functions, not primitive values.
- `create()` uses direct property values instead of descriptor maps.
- `defineProperty()` and `defineProperties()` always create own data
  properties. They use descriptor `value`; accessor and flag descriptors are
  accepted but not emulated, so they create properties with `undefined` values
  when no `value` is present.
- `groupBy()` supports array-like and `forEach` collections. Maps contribute
  `[key, value]` pairs; Sets contribute values. ESTK cannot represent an own
  `__proto__` group, so that key throws `TypeError`.

## Non-standard extensions

- `Object.compact()` recursively removes falsy values from objects and arrays.
- `Object.deepCopy()` creates independent copies and rejects cyclic references.
- `Object.flat()` flattens nested own properties. Depends on `Object.isCyclic()`.
- `Object.isCyclic()` detects true recursive cycles without rejecting shared references.
- `Object.isEmpty()` checks enumerable own properties.
- `Object.isEquals()` deeply compares supported values and cyclic structures.
- `Object.isObject()` recognizes non-null objects and functions.
- `Object.prototype.merge()` performs a shallow-key merge with deeply copied
  values. Depends on `Object.deepCopy()`.
- `Object.prototype.toString()` intentionally replaces native output with a
  readable representation for the ExtendScript Console.

## Tests

- `Test/tests-Object-standard.js`
- `Test/tests-Object-nonstandard.js`

Both harnesses run in ESTK and Node. Node is used only as a convenient behavior
reference; ESTK and Adobe applications are the production targets.
