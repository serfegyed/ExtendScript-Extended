# ExtendScript Console Polyfill

## Overview

This project provides a lightweight (or "poor man's") console interface for Adobe ExtendScript. It allows the same script to use familiar console calls in both Node.js and ExtendScript environments.

If a `console` object already exists, as it does in Node.js, the polyfill leaves it untouched. If no `console` object exists, it installs the fallback implementation. In the ExtendScript Toolkit (`estoolkit`) it writes through `$.writeln`; in any other BridgeTalk host, such as Illustrator, InCopy, InDesign, or Photoshop, it clears and writes to `.ESTK_scripts/console.log` in the user's home folder. The first line contains the host application's BridgeTalk name, followed by a `----------------` separator line.

## Features

- **console.log(...args)**: Outputs general messages to the JavaScript Console.
- **console.assert(assertion, ...args)**: Outputs a message when an assertion is false.
- **console.error(...args)**: Outputs a message prefixed with `Error:`.
- **console.warn(...args)**: Outputs a message prefixed with `Warning:`.
- **console.table(data, columns)**: Outputs simple tabular data as an ASCII table.
- **console.time(label)**: Starts a named timer.
- **console.timeLog(label, ...args)**: Outputs the current elapsed milliseconds without stopping the timer.
- **console.timeEnd(label)**: Stops a named timer and outputs its elapsed milliseconds.

Arguments are converted to strings and separated by spaces. Web-console format specifiers such as `%s`, `%d`, and `%o`, and interactive object inspection, are not implemented. `console.table()` supports flat arrays and objects, optional selected columns, and ASCII text output only.

## Installation

1. Copy `console.js` into your project directory.
2. Include it at the beginning of an ExtendScript file:

```javascript
//@include "console.js"
```

ExtendScript processes this as an include directive, while Node.js treats it as a comment and keeps using its native `console` object.

The InDesign log can be opened or followed with any text editor that supports automatic file refresh, such as Visual Studio Code.

## Usage Example

```javascript
console.log("This is a log message");
console.assert(myVariable !== undefined, "myVariable should not be undefined");
console.error("This is an error message");
console.warn("This is a warning message");
console.table([
    { name: "A", age: 1 },
    { name: "B", age: 2 }
]);

console.time("work");
// Do some work.
console.timeLog("work", "Still working");
console.timeEnd("work");
```

## Tests

- Run `node tests-console.js` for deterministic polyfill regression tests.
- Run `tests-console-estk.js` in either Node.js or ExtendScript for a cross-environment smoke test. Node.js ignores its `//@include` directive as a comment, while ExtendScript loads `console.js`.
