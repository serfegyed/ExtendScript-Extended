
# ExtendScript Additions and Polyfills
This repository is a humble attempt to enhance the functionality of Adobe's ExtendScript, bringing in some of the conveniences from modern JavaScript, specifically ES6 and later. ExtendScript, being an extended form of JavaScript used primarily in Adobe's Creative Suite, sorely lacks these newer features, which this project aims to partially address.

## Overview
The aim of this repository is to provide a collection of polyfills and additional functionalities that complement the traditional ExtendScript capabilities. It's designed to be a helpful resource for ExtendScript users who wish to incorporate some aspects of modern JavaScript into their scripting.
This version can be used with Adobe programs such as  InDesign/InCopy, Photoshop, etc.
This project was originally made as a learning tool and to solve problems encountered when creating InDesign scripts.

## What's Inside
- **Array Extensions**: A set of methods added to the native Array object, inspired by ES6 features.
- **JSON Extensions**: JSON.stringify() and JSON.parse() methods, inspired by ES6 features.
- **Math Extensions**: Additional math functions and constants.
- **Number Extensions**: Methods like Number.isNaN(), Number.isFinite(), Number.isInteger(), and Number.isSafeInteger() as well as some constants.
- **String Enhancements**: New methods for the String object to aid in text processing and to bring it closer to the modern JavaScript standard.
- **Object Utilities**: Enhancements for the Object class, focusing on property management and object introspection.
- **Map and Set**: Introducing Map and Set objects for more advanced data structures.
- **TypeTest**: A collection of type testing methods like sameValueZero(), isPrimitive(), and isArrayLike(), etc.
- **Other Utilities**: Various utilities and functions targeted at specific scripting needs in ExtendScript.

## How to Use
Each category (e.g. Array, String, Object) has its own README.md file with a detailed explanation.
Each function has tests in the corresponding 'Test' folder.
Most methods are in separate files, so it is easy to use them.
Each category also contains a collection file if you want to use all the functions at once.
Some methods use external functions. They must include with  the #include preprocessor directive.

## Contributions
This project is somewhat open to contributions. Suggestions, improvements or any form of participation are always welcome. But you must understand that this is a side project for which I have very few resources.
Don't expect an immediate response or frequent updates.

## License
All contents of this repository are released under the MIT License. Feel free to use, adapt, and share these scripts in your projects.