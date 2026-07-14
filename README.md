
# ExtendScript Additions and Polyfills
This repository is a humble attempt to enhance the functionality of Adobe's ExtendScript, bringing in some of the conveniences from modern JavaScript, specifically ES6 and later. ExtendScript, being an extended form of JavaScript used primarily in Adobe's Creative Suite, sorely lacks these newer features, which this project aims to partially address.

## Overview
The aim of this repository is to provide a collection of polyfills and additional functionalities that complement the traditional ExtendScript capabilities. It's designed to be a helpful resource for ExtendScript users who wish to incorporate some aspects of modern JavaScript into their scripting.
This version can be used with Adobe programs such as  InDesign/InCopy, Photoshop, etc.
This project was originally made as a learning tool and to solve problems encountered when creating InDesign scripts.

## What's Inside
- **Array Extensions**: A set of methods added to the native Array object, inspired by ES6 features.
- **Date Extensions**: ISO serialization and Temporal conversion methods for the native Date object.
- **Function Extensions**: Function.prototype.bind() for fixed receivers and leading arguments.
- **INI Settings**: Simple settings persistence for scripts using object-of-objects data and INI files.
- **JSON Extensions**: JSON.stringify() and JSON.parse() methods, inspired by ES6 features.
- **Math Extensions**: Additional math functions and constants.
- **Number Extensions**: Methods like Number.isNaN(), Number.isFinite(), Number.isInteger(), and Number.isSafeInteger() as well as some constants.
- **RegExp Extensions**: RegExp.escape() for safely embedding literal text in regular expression patterns.
- **String Enhancements**: New methods for the String object to aid in text processing and to bring it closer to the modern JavaScript standard.
- **Object Utilities**: Enhancements for the Object class, focusing on property management and object introspection.
- **Map and Set**: Introducing Map and Set objects for more advanced data structures.
- **Temporal Subset**: ISO/Gregorian date, time, duration, Instant, and host-local formatting support designed for ExtendScript's millisecond precision.
- **TypeTest**: A collection of type testing methods like sameValueZero(), isPrimitive(), and isArrayLike(), etc.
- **Development Tools**: Console helpers, ESprocessor for consolidating recursive include dependencies, and the ExtendScript Linker.

## How to Use
Each category (e.g. Array, String, Object) has its own README.md file with a detailed explanation.
Each category provides an ESTK/Node-compatible harness, either in its `Test`
folder or beside the implementation. Standard and nonstandard surfaces are
tested separately where appropriate.

Most methods are in separate files, so they can be included individually.
Categories that provide bundles keep them as ordered `//@include`-only files;
implementation bodies are not copied into bundles. Dependencies should also be
loaded with `//@include` directives.

The Temporal subset is documented in [`Temporal/README.md`](Temporal/README.md). Include `Temporal/Temporal.js` for the complete ordered module set, or select individual runtime files from `Temporal/Lib/`.

## Contributions
This project is somewhat open to contributions. Suggestions, improvements or any form of participation are always welcome. But you must understand that this is a side project for which I have very few resources.
Don't expect an immediate response or frequent updates.

## License
All contents of this repository are released under the MIT License. Feel free to use, adapt, and share these scripts in your projects.
