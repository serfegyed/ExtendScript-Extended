# ExtendScript INI

## Overview

`INI.js` is a small settings helper for Adobe ExtendScript scripts. It reads
and writes simple INI files so application scripts do not have to repeat file
handling code.

The public interface is intentionally small:

```javascript
INI.read(data, filename);
INI.write(data, filename);
```

`data` is required and must be an object whose section values are objects, or an
empty object. `filename` is required and must be a string.

## Usage

Include `INI.js`, define your defaults, then read saved values into the same
object:

```javascript
//@include "INI.js"

var settings = {
    INIT: {
        setup1: "First setup",
        setup2: "Second setup"
    },
    result: {
        result1: "First result",
        result2: "Second result"
    }
};

INI.read(settings, "my-script.ini");
INI.write(settings, "my-script.ini");
```

The file format is:

```ini
[INIT]
setup1=First setup
setup2=Second setup

[result]
result1=First result
result2=Second result
```

If the INI file does not exist, `INI.read(data, filename)` returns the same object
unchanged. `INI.write(data, filename)` creates or updates the file.

## Filenames

Pass either a simple filename or an explicit path:

```javascript
INI.read(settings, "my-script.ini");
INI.write(settings, "my-script.ini");

INI.read(settings, "~/Desktop/my-script.ini");
INI.write(settings, "~/Desktop/my-script.ini");
```

Simple filenames are saved under `.ESTK_scripts` in the user's home folder.
On Windows, `INI.js` uses `%USERPROFILE%`; on macOS it falls back to `$HOME`.
The folder is created when needed.

Do not use relative paths such as `./settings.ini` or `../settings.ini`.
ExtendScript may resolve them relative to the ESTK or host application folder.
To save beside the running script, build the path in the caller:

```javascript
var scriptPath = File($.fileName).fsName.replace(/\\/g, "/");
var iniFile = scriptPath.substring(0, scriptPath.lastIndexOf("/")) + "/settings.ini";

INI.read(settings, iniFile);
INI.write(settings, iniFile);
```

## Format rules

- Values are read and written as strings.
- Empty lines are ignored while reading.
- Section headers use `[section]`.
- Key/value rows use `key=value`.
- Everything is handled as text.

## Tests

Run the shared harness directly in ExtendScript Toolkit:

```text
Test/tests-INI.js
```

The same file can be run with Node.js during development:

```text
node Test/tests-INI.js
```

The runtime target remains Adobe ExtendScript; Node.js is used only for the
regression harness.

## License

Provided under the MIT License.
