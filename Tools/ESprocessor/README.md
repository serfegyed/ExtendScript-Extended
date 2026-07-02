# ExtendScript File Processor

## Overview

ESprocessor consolidates an ExtendScript source file and its recursive include
dependencies into one output file. Duplicate includes are expanded only once.

The tool targets ESTK and Adobe ExtendScript hosts. Node.js support exists only
for running the development harness.

## Features

- Recognizes `#include` and `//@include` directives.
- Recognizes `#includepath` and `//@includepath` directives.
- Accepts indented directives.
- Resolves `./` and `../` paths from the file containing the directive.
- Accepts `/` and `\` path separators.
- Recursively expands nested includes.
- Prevents duplicate expansion.
- Preserves `.js`, `.jsx`, and `.jsxinc` output extensions.
- Optionally writes console messages, include markers, and a log file.

## Files

- `ESprocessor_1_5.js` is the include-only interactive bundle.
- `Lib/ESprocessor.js` contains the reusable processing engine.
- `Lib/run.js` opens the ESTK file dialog with the default options.
- `Test/tests-ESprocessor.js` is the shared ESTK/Node harness.

The bundle loads its Console, Array, and String dependencies through ordered
`//@include` directives. No dependency code is copied into the bundle.

## Interactive usage

Run `ESprocessor_1_5.js` in ESTK or an Adobe ExtendScript host. Select a `.js`,
`.jsx`, or `.jsxinc` source file when prompted.

The generated filename inserts `_full` before the original extension:

```text
script.jsx -> script_full.jsx
```

With default settings, a matching `.log` file is also created.

## Programmatic usage

Include the dependencies and `Lib/ESprocessor.js`, then call:

```javascript
ESprocessor.process(sourceFile, {
    log: true,
    logFile: true,
    indent: true
});
```

`sourceFile` must be an ExtendScript `File`. The method returns processing
metadata, or `null` when no file was selected or the source does not exist.

To open the standard file dialog programmatically:

```javascript
ESprocessor.run({
    log: true,
    logFile: true,
    indent: true
});
```

## Tests

Run `Test/tests-ESprocessor.js` directly in ESTK. The harness creates isolated
fixtures under `Folder.temp`, tests the real processing engine, and removes the
fixtures afterward.

The same file can be run with Node.js during development:

```text
node Test/tests-ESprocessor.js
```

The harness covers nested includes, duplicate suppression, both directive
styles, absolute and relative include paths, missing files, logging, and absent
input handling.

## Version history

- **1.5**: Split the engine from the interactive runner, added the shared
  harness, fixed relative include-path resolution, and converted the root file
  to an include-only bundle.
- **1.4**: Preserved source extensions and added logging switches.
- **1.3**: Added relative-path handling.
- **1.2**: Added indented directives, include paths, and `//@include` support.
- **1.1**: Cleaned up the original implementation.
- **1.0**: Added basic `#include` processing.

## License

Provided under the MIT License.
