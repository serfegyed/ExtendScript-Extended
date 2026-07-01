# ExtendScript Map

A lightweight `Map` implementation for ESTK and Adobe ExtendScript applications.
Node.js is used only as a development reference and test runner; it is not a
production target.

## Bundles

- `Map_standard.js` includes the core implementation and the standard methods.
- `Map_full.js` includes `Map_standard.js` and every project extension.
- Files in `Lib` can be included individually after their documented dependencies.

Both bundles contain only ordered `#include` directives. Implementation code is
kept in `Map_basic.js`, `External`, and `Lib`.

## Standard surface

The standard bundle provides:

- `clear`, `delete`, `entries`, `forEach`, `get`, `has`, `keys`, `set`, `values`
- `Map.groupBy`
- `getOrInsert`, `getOrInsertComputed`
- the `size` data property

`getOrInsert` returns an existing value without replacing it, or inserts and
returns the supplied default. `getOrInsertComputed` calls its callback only for
a missing key and passes that key as its sole argument.

This is an ExtendScript-oriented subset rather than a complete modern engine
replacement. Construction supports arrays of two-element key-value pairs, and
the iterator objects expose `next()` but not the ES6 symbol iterator protocol.

## Project extensions

The full bundle additionally provides:

- Queries: `Map.isMap`, `Map.isEmpty`, `includes`, `keyOf`
- Predicates and search: `every`, `some`, `find`, `findKey`
- Transformations: `filter`, `mapKeys`, `mapValues`, `reduce`
- Bulk mutation: `deleteAll`, `deleteEach`, `setAll`, `setEach`
- Construction and merging: `Map.from`, `merge`
- Output helpers: `toArray`, `toString`

Most callback methods receive `(value, key, map)`. For compatibility with the
original project API, `mapKeys` receives `(key, value, map)`. `Map.from` accepts
Maps, arrays of pairs, array-like objects, and plain objects; its optional mapper
also receives `(value, key)` and must return a two-element pair.

## Dependencies

`External/external.js` supplies `sameValueZero()`. It is already included by
`Map_standard.js` and therefore also by `Map_full.js`.

## Tests

- `Test/tests-Map-standard.js`: standard surface, 17 tests
- `Test/tests-Map-nonstandard.js`: project extensions, 18 tests

Both harnesses run in ESTK and Node.js.
