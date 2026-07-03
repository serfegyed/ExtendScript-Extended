# ExtendScript Linker

## Current checkpoint

The Linker is a conservative build-time tool. It examines an ExtendScript
source file, distinguishes known ESTK and Adobe host APIs from indexed
polyfills, inserts each required `//@include` once in a shared header block,
and reports unresolved APIs. `#target` and `#targetengine` directives remain
before the generated includes.

The current analyzer recognizes primitive and array literals, direct
constructor calls, `new` expressions, simple assignments, direct member
accesses, property chains, and chained calls whose return type is known by a
catalog. Unknown receiver types are reported instead of guessed.

Application sources may provide missing type information with JSDoc `@type`,
`@param`, and `@returns` tags. These hints participate in the same native,
polyfill, and host-object analysis as inferred types:

```javascript
/** @type {Document} */
var document = acquireDocument();

/**
 * @param {Document} source
 * @returns {Page}
 */
function firstPage(source) {
    return source.pages.item(0);
}
```

`var` and ExtendScript `const` declarations use function scope. Function
parameters and nested function scopes shadow outer variables and built-in
names during type analysis.

## Requirements

The Linker tooling requires Node.js 18 or newer. Its Node-side implementation
uses modern JavaScript syntax, while generated application sources and
polyfills remain compatible with Adobe ExtendScript.

## Catalogs

- `Catalog/estk-3.json` is the preliminary, versioned native ESTK baseline.
- `build-index.js` rebuilds `Catalog/polyfills.json` from atomic polyfill files.
- `Catalog/Generated` contains ignored local catalogs built from the installed
  Adobe OMV XML files. It is created on demand.
- Common ExtendScript OMV data is loaded when available. A source-level
  `#target indesign` or `//@target indesign` directive selects the matching
  host automatically; no host command-line option is required.
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

Build or refresh the Common OMV catalog explicitly:

```text
node build-catalogs.js
```

Build or refresh one host catalog explicitly:

```text
node build-catalogs.js indesign
```

The normal Linker command performs the same work lazily. It processes only the
latest available catalog for the source's target and rebuilds a generated
catalog when its source XML changes.

### Host application and OMV cache

The Linker itself does not require the target Adobe application to be running.
It reads an existing static OMV XML file or an OMV XML cache previously created
by ExtendScript Toolkit.

- Static dictionaries, such as an installed Illustrator `omv.xml`, can be used
  without launching the host application.
- Dynamic dictionaries, such as InDesign's DOM, can be used without a running
  host after ESTK has generated the corresponding `omv$...xml` cache once.
- After installing a new host version, ESTK may need to connect to that host
  once to create or refresh its OMV cache.
- The current Linker does not launch a host or request its DOM automatically.
  If no matching OMV source is available, it prints a warning and continues
  without that host catalog.
- Running the linked ExtendScript still requires its target application. A
  source-level directive such as `#target indesign` or `//@target indesign`
  may launch or select it.

### Discovery platforms

Windows discovery checks the 32-bit and 64-bit Adobe shared-dictionary folders
and the user's ESTK cache under `%APPDATA%`. macOS discovery checks Adobe's
shared dictionaries under `/Library/Application Support`, plus legacy ESTK
caches under the user's `Library/Preferences` and `Library/Application
Support` folders. The macOS paths are covered by platform-independent unit
tests but have not been verified on a physical Mac.

### Validated hosts

The catalog builder has been validated against these locally installed Adobe
dictionaries:

| Host | OMV source | Result | Host-specific note |
| --- | --- | --- | --- |
| InDesign 2026 | Dynamic ESTK cache, DOM 21.3 | Passed | Several compatibility DOM versions are cached; the Linker selects the newest non-empty version. |
| Illustrator 2026 | Static installed `omv.xml` | Passed | The installed dictionary is available without launching Illustrator. |
| Photoshop 2026 | Static installed `omv.xml` | Passed | The installed XML identifies itself as the Photoshop CC 2015.5 Object Library, so newer DOM additions may be absent. |

Host validation confirms catalog generation and type-chain resolution. It does
not claim that every member of an Adobe DOM has been exercised at runtime.

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

For an InDesign host-object report using the installed OMV catalog:

```text
node Linker.js Test/linker-indesign-input.js --report
```

Validate without writing an output file:

```text
node Linker.js source.js --check
```

Preview the output path and exact include directives without writing:

```text
node Linker.js source.js --out build/source.js --dry-run
```

Print a detailed, non-writing dependency report to standard output:

```text
node Linker.js source.js --report
```

The report classifies unique API uses as `native`, `polyfill`, `unknown`, or
`unresolved` in source order. Redirect standard output to save it:

```text
node Linker.js source.js --report > linker-report.txt
```

All three analysis modes return exit code 2 when any dependency is missing or
its receiver type cannot be inferred. `--check`, `--dry-run`, and `--report`
are mutually exclusive.

## Deliberate limits of this checkpoint

The analyzer intentionally stops at the documented `@type`, `@param`, and
`@returns` support. Computed properties, unannotated user-function return
inference, and advanced JSDoc constructs are outside the current scope.
Unsupported cases remain visible as diagnostics rather than being linked on a
guess. `TODO.md` records that no further development items are currently
active.
