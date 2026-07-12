# ExtendScript Array

Modern Array methods and project-specific utilities for Adobe ExtendScript.
The runtime target is ESTK and Adobe applications; Node is used only as a
convenient test reference.

## Bundles

- `array_standard.js` installs the standard-compatible polyfills.
- `array_non-standard.js` installs the project-specific extensions and their
  required standard dependencies.

Both bundles contain only ordered `//@include` directives. Every file in
`Lib` can also be included independently; its dependencies are declared with
the same Node-compatible directive form.

## Standard-compatible methods

- `Array.from()` — creates a dense Array from an array-like value. The
  iterator branch is intentionally unavailable because ExtendScript has no
  standard iterator protocol.
- `Array.isArray()`
- `Array.of()`
- `Array.prototype.at()`
- `Array.prototype.copyWithin()`
- `Array.prototype.entries()`
- `Array.prototype.every()`
- `Array.prototype.fill()`
- `Array.prototype.filter()`
- `Array.prototype.find()`
- `Array.prototype.findIndex()`
- `Array.prototype.findLast()`
- `Array.prototype.findLastIndex()`
- `Array.prototype.flat()`
- `Array.prototype.flatMap()`
- `Array.prototype.forEach()`
- `Array.prototype.includes()`
- `Array.prototype.indexOf()`
- `Array.prototype.keys()`
- `Array.prototype.lastIndexOf()`
- `Array.prototype.map()`
- `Array.prototype.reduce()`
- `Array.prototype.reduceRight()`
- `Array.prototype.some()`
- `Array.prototype.toReversed()`
- `Array.prototype.toSorted()`
- `Array.prototype.toSpliced()`
- `Array.prototype.values()`
- `Array.prototype.with()`

The generic methods support array-like receivers where the ECMAScript method
is generic. Sparse behavior is tested separately for true holes, explicit
`undefined`, inherited indices, callback visitation, and copy density.

## Project-specific methods

- `Array.info()` — reports nested lengths, uniformity, maximum depth, and leaf
  types.
- `Array.isEmpty()` — validates an Array and tests whether its length is zero.
- `Array.isSorted()` — tests ordering with the shared default or a custom
  comparator.
- `Array.prototype.append()` — mutates the receiver by appending another
  Array, with optional flattening.
- `Array.prototype.clear()` — empties and returns the receiver.
- `Array.prototype.compact()` — returns the truthy values as a dense Array.
- `Array.prototype.dim()` — reports the maximum nested Array depth of each
  indexed value.
- `Array.prototype.first()` / `last()` — return endpoint values.
- `Array.prototype.indexAfter()` — returns the index after a matching value.
- `Array.prototype.insert()` / `remove()` — return shallow copies without
  changing the source.
- `Array.prototype.max()` / `min()` / `sum()` — aggregate direct values or
  mapped keys.
- `Array.prototype.merge()` — mutates a sorted receiver by merging another
  sorted Array.
- `Array.prototype.pluck()` — maps a property from every present item.
- `Array.prototype.random()` — returns the value at a random index.
- `Array.prototype.reject()` — returns the inverse of `filter()`.
- `Array.prototype.rotate()` — returns a shallow copy; positive steps rotate
  right and negative steps rotate left.
- `Array.prototype.shuffle()` — shuffles the receiver in place.
- `Array.prototype.toShuffled()` — returns a shuffled shallow copy.
- `Array.prototype.unique()` - keeps the first value for each SameValueZero
  key.

The shuffle methods preserve true sparse slots rather than converting them to
explicit `undefined` values.

## Tests

- `Test/tests-Array-standard.js`
- `Test/tests-Array-non-standard.js`

Both harnesses run in ESTK and Node. Current checkpoints: 34 standard tests
and 28 non-standard tests.
