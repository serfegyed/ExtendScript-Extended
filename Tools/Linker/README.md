# ExtendScript Linker

## Current checkpoint

The Linker is a conservative build-time tool. It examines an ExtendScript
source file, distinguishes known ESTK APIs from indexed polyfills, inserts each
required `//@include` once in a shared header block before the first
non-comment source token, and reports unresolved APIs.

The current analyzer recognizes primitive and array literals, direct
constructor calls, `new` expressions, simple assignments, direct member
accesses, and chained calls whose return type is known by a catalog. Unknown
receiver types are reported instead of guessed.

`var` and ExtendScript `const` declarations use function scope. Function
parameters and nested function scopes shadow outer variables and built-in
names during type analysis.

## Catalogs

- `Catalog/estk-3.json` is the preliminary, versioned native ESTK baseline.
- `build-index.js` rebuilds `Catalog/polyfills.json` from atomic polyfill files.
- Files exposing several public API symbols are listed under `warnings` and are
  excluded as providers until they are split.
- Bundle files are not providers.
- A provider's own nested includes remain inside that provider. The Linker
  inserts the requested atomic provider once; it does not duplicate the
  provider's internal include graph in the application source.

Rebuild the polyfill catalog from this directory:

```text
node build-index.js
```

## Linking a source

```text
node Linker.js path/to/source.js
```

The default output is `source_linked.js`. Use `--out path/to/result.js` to pick
another output path. Generated and existing relative include paths are adjusted
to the output file's directory. A missing known API is reported and sets exit
code 2.

For a manual smoke test covering several native and polyfilled APIs:

```text
node Linker.js Test/linker-smoke-input.js
```

## Deliberate limits of this checkpoint

This version does not yet implement computed properties, user-function return
analysis, or JSDoc type hints in application sources. Those cases remain
visible as diagnostics rather than being linked on a guess.
