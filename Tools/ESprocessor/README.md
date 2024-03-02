# ExtendScript File Processor

## Overview

ESTK handles include files rather stupidly. If you insert an #include file twice, it will insert the source code twice in the final one. This is almost inevitable if the included files contain additional #include lines.
The ExtendScript File Processor is a script to automate the process of merging ExtendScript files and their dependencies into a single file. This tool is useful for Adobe ExtendScript developers who want to simplify their workflow by efficiently handling `#include` statements, and thus integrate the contents of referenced files into a single coherent script without unnecessary repetition.

## Features

- **File Dialog Selection**: Opens a file dialog to select the source ExtendScript file to be processed.
- **Dependency Integration**:  
  - Recursively processes `#include` statements to integrate content from referenced files.  
  - Supports various formats including `#include` or `//@include`, and `#includepath` or `//@includepath` directives.  
  - Handles leading spaces and indentation in `#include` statements.
- **Enhanced Logging**: Offers configurable logging capabilities, including toggles for general logging, log file creation, and indentation in log files for better readability.
- **Path Resolution**: 
  - Handles relative paths(`./` and`../`), facilitating the organization of script files and dependencies.  
  - Accepts `\\` or/and `/` as path separators.

## Sample

The Test folder contains the result of running the ESprocessor_1_4.js file on itself. 😈

## Installation

1. Ensure you have Adobe ExtendScript Toolkit installed or any Adobe application that supports ExtendScript scripting.
2. Download the script files into your project directory.

## Dependencies

Before running the ExtendScript File Processor, include the necessary polyfills as follows:

- **Console Polyfill**: Place`console.js` in your project directory.  Include it in your script with `#include "~/path/to/console.js"`.
- **String and Array Polyfills**: Include `startsWith.js` and`indexOf.js` in your project and reference them using `#include` directives at the beginning of your main script.

## Usage

1. **Running the Script**: Execute the script in the ExtendScript Toolkit. A file dialog will prompt you to select a source file.
2. **Selecting a Source File**: Choose the ExtendScript file you wish to process. It accepts `.js`, `.jsx` and `.jsxinc` files. The script will handle `#include` statements and consolidate dependencies into a single output file.
3. **Output**: The script generates a consolidated file with a`_full` suffix added before the source file extension. If logging is enabled, a`.log` file will also be created detailing the consolidation process.

## Configuration

Toggle the following constants at the beginning of the script to customize the logging output:

- `LOG`: Enables or disables general logging to the console.
- `LOGFILE`: Toggles the creation of a log file (requires`LOG` to be`true`).
- `INDENT`: Controls indentation in the log file for better readability (requires`LOGFILE` to be`true`).

## Author

- Egyed Serf

## Version History

- **1.4**: Added support for preserving source file extension and introduced configurable logging constants.
- **1.3**: Improved path resolution to handle relative paths.
- **1.2**: Enhanced include file recognition and added support for various`#include` statement formats.
- **1.1**: Performed a small code cleanup to reduce redundancy.
- **1.0**: Initial version with basic functionality for recognizing`#include` statements.

## License

This project is licensed under the MIT License.
