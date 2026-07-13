# ExtendScript Set

A lightweight `Set` implementation for ESTK and Adobe ExtendScript applications.
Node.js is used only as a development reference and test runner; it is not a
production target.

## Bundles

- `Set_standard.js` includes the core and complete supported standard surface.
- `Set_operators.js` includes the standard bundle and optional ESTK operator
  overloads.
- `Set_non-standard.js` includes the standard bundle and all project extensions.
- `Set_full.js` is a compatibility alias for `Set_non-standard.js`.
- `Set_composition.js` is a compatibility alias for `Set_standard.js`, because
  Set composition is now standardized.

All bundle files contain only ordered `//@include` directives. The constructor and
core storage live in `Set_basic.js`; individual methods live in `Lib`.

## Standard surface

The standard bundle provides:

- `add`, `clear`, `delete`, `entries`, `forEach`, `has`, `keys`, `values`
- `difference`, `intersection`, `symmetricDifference`, `union`
- `isDisjointFrom`, `isSubsetOf`, `isSupersetOf`
- the `size` data property

Composition arguments may be Sets or Set-like objects with a numeric `size`
property and callable `has()` and `keys()` methods.

This is an ExtendScript-oriented subset rather than a complete modern engine
replacement. Construction supports arrays and project Set instances. Iterator
objects expose `next()` but not the ES6 symbol iterator protocol.

Set values use SameValueZero equality. Iteration is live: deletions are skipped,
new values are visited, and a deleted then re-added value receives a new position.
The internal iteration record list intentionally retains inactive records so
existing iterators remain valid.

## Project extensions

The non-standard bundle additionally provides:

- Queries: `Set.isSet`, `Set.isEmpty`, `isEqual`
- Predicates and search: `every`, `some`, `find`
- Transformations: `filter`, `map`, `reduce`
- Bulk mutation: `addAll`, `addEach`, `deleteAll`, `deleteEach`
- Aggregation and output: `from`, `toArray`, `toSource`, `toString`, `join`

Set callback methods generally receive `(value, value, set)`. `addEach` receives
`(value, index, set)` from its source array, while `deleteEach` uses the same
shape over a stable snapshot of the Set values.

`from` accepts multiple inputs. Arrays, array-like objects, and Sets contribute
their values; plain objects contribute their own property names; other values
are added directly. Empty collections are no-ops.

## ESTK operator sugar

`Set_operators.js` is an optional ExtendScript-only layer. It depends only on
`Set_standard.js` and does not require the project non-standard extensions.

The operators are intended only as a more expressive syntax for standard Set
operations. They do not add new Set capabilities. Operator overloads may be more
expensive than direct method calls, especially relational checks that need size
or membership tests. Prefer the named methods in performance-sensitive code.

| Operator | Equivalent |
|---|---|
| `A | B` | `A.union(B)` |
| `A & B` | `A.intersection(B)` |
| `A - B` | `A.difference(B)` |
| `A ^ B` | `A.symmetricDifference(B)` |
| `A == B` | `A.size === B.size && A.isSubsetOf(B)` |
| `A << B` | `A.isSubsetOf(B)` |
| `A >> B` | `A.isSupersetOf(B)` |
| `A % B` | `A.isDisjointFrom(B)` |

Strict equality (`===`) is intentionally left untouched and keeps object
identity semantics.

## Dependencies

`Set_basic.js` keeps its SameValueZero comparison helper internal. `Set.from()`
keeps its array-like detection helper internal. The standard and non-standard
bundles do not require external helper files.

## Tests

- `Test/tests-Set-standard.js`: standard surface, 13 tests
- `Test/tests-Set-operators.js`: ESTK operator overloads, 2 tests
- `Test/tests-Set-nonstandard.js`: project extensions, 15 tests

The standard and non-standard harnesses run in ESTK and Node.js. The operator
harness is ESTK-only and skips itself under Node.js.
