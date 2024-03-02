# ExtendScript Console Polyfill

## Overview
This project introduces a `console` object polyfill for Adobe ExtendScript, providing developers with familiar methods like`console.log`, `console.assert`, and`console.error` for easier debugging within the ExtendScript environment.

## Features

- **console.log(...args)**: Outputs general messages to the console, useful for logging variable values, execution flow, etc.
- **console.assert(assertion, ...args)**: Tests if an assertion is false, and if so, outputs the provided message, aiding in validating code logic.
- **console.error(...args)**: Specifically designed for error logging, marking messages distinctly as errors.

## Installation
To use this polyfill in your ExtendScript projects, follow these steps:
1. Copy the `console.js` script file into your project directory.
2. Include the script at the beginning of your ExtendScript files with `#include "console.js"`.

## Usage Example
```javascript
console.log('This is a log message');
console.assert(myVariable !== undefined, 'myVariable should not be undefined');
console.error('This is an error message');
```
