
//* Include file start: ../Console/console.js
/**
 * ExtendScript Console Object Polyfill
 * =====================================
 *
 * A lightweight (or "poor man's") console interface for Adobe ExtendScript.
 * It lets scripts use familiar console calls in both Node.js and ExtendScript:
 * Node.js keeps its native console, while ExtendScript receives this fallback.
 *
 * Methods included:
 * - console.log(...args): Logs general messages to the console.
 * - console.assert(assertion, ...args): Logs a message if an assertion fails.
 * - console.error(...args): Logs error messages to the console.
 * - console.warn(...args): Logs warning messages to the console.
 * - console.time(label): Starts a named timer.
 * - console.timeLog(label, ...args): Logs a timer's current duration.
 * - console.timeEnd(label): Stops a named timer and logs its duration.
 *
 * Usage:
 * Include this script at the beginning of an ExtendScript file. The polyfill is
 * installed only when no console object already exists.
 */
if (typeof console === "undefined") {
    console = (function () {
        var timers = [];
        var consoleObject = {};

        function joinArguments(argumentList, startIndex) {
            var message = "";
            for (var i = startIndex; i < argumentList.length; i++) {
                message += (i > startIndex ? " " : "") + String(argumentList[i]);
            }
            return message;
        }

        function getTimerLabel(argumentList) {
            if (argumentList.length === 0 || typeof argumentList[0] === "undefined") {
                return "default";
            }
            return String(argumentList[0]);
        }

        function findTimerIndex(label) {
            for (var i = 0; i < timers.length; i++) {
                if (timers[i].label === label) {
                    return i;
                }
            }
            return -1;
        }

        consoleObject.log = function () {
            $.writeln(joinArguments(arguments, 0));
        };

        consoleObject.assert = function (assertion) {
            if (!assertion) {
                var message = "Assertion failed";
                if (arguments.length > 1) {
                    message += ": " + joinArguments(arguments, 1);
                }
                $.writeln(message);
            }
        };

        consoleObject.error = function () {
            var message = joinArguments(arguments, 0);
            $.writeln("Error:" + (message ? " " + message : ""));
        };

        consoleObject.warn = function () {
            var message = joinArguments(arguments, 0);
            $.writeln("Warning:" + (message ? " " + message : ""));
        };

        consoleObject.time = function (label) {
            label = getTimerLabel(arguments);
            if (findTimerIndex(label) !== -1) {
                consoleObject.warn('Timer "' + label + '" already exists');
            } else {
                timers.push({
                    label: label,
                    startTime: new Date().getTime()
                });
            }
        };

        consoleObject.timeLog = function (label) {
            label = getTimerLabel(arguments);
            var timerIndex = findTimerIndex(label);

            if (timerIndex !== -1) {
                var duration = new Date().getTime() - timers[timerIndex].startTime;
                var message = label + ": " + duration + "ms";
                if (arguments.length > 1) {
                    message += " " + joinArguments(arguments, 1);
                }
                consoleObject.log(message);
            } else {
                consoleObject.warn('No such timer: "' + label + '"');
            }
        };

        consoleObject.timeEnd = function (label) {
            label = getTimerLabel(arguments);
            var timerIndex = findTimerIndex(label);

            if (timerIndex !== -1) {
                var duration = new Date().getTime() - timers[timerIndex].startTime;
                consoleObject.log(label + ": " + duration + "ms");
                timers.splice(timerIndex, 1);
            } else {
                consoleObject.warn('No such timer: "' + label + '"');
            }
        };

        return consoleObject;
    }());
}
//* Include file end: ../Console/console.js


//* Include file start: ../../Array/Lib/indexOf.js
/**
 * Finds the first present index containing a strictly equal value.
 */

//* Include file start: ./arrayInternals.js
/**
 * Shared numeric conversions for Array polyfills.
 */
if (typeof __arrayToInteger__ === "undefined") {
    function __arrayToInteger__(value) {
        var number = Number(value);

        if (number !== number || number === 0) return 0;
        if (number === Infinity || number === -Infinity) return number;
        return number < 0 ? Math.ceil(number) : Math.floor(number);
    }
}

if (typeof __arrayToLength__ === "undefined") {
    function __arrayToLength__(value) {
        var number = Number(value);

        if (number !== number || number <= 0) return 0;
        if (number === Infinity) return 9007199254740991;
        return Math.min(Math.floor(number), 9007199254740991);
    }
}

if (typeof __arrayDefaultCompare__ === "undefined") {
    function __arrayDefaultCompare__(a, b) {
        if (a === undefined) return b === undefined ? 0 : 1;
        if (b === undefined) return -1;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }
}
//* Include file end: ./arrayInternals.js

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        "use strict";

        var object;
        var length;
        var from;
        var i;

        if (this === null || this === undefined) {
            throw new TypeError("Array.prototype.indexOf called on null or undefined.");
        }

        object = Object(this);
        length = __arrayToLength__(object.length);
        if (length === 0) return -1;
        from = __arrayToInteger__(fromIndex);
        if (from === Infinity) return -1;
        i = from >= 0 ? from : Math.max(length + from, 0);
        for (; i < length; i++) {
            if (i in object && object[i] === searchElement) return i;
        }
        return -1;
    };
}
//* Include file end: ../../Array/Lib/indexOf.js


//* Include file start: ../../String/Lib/startsWith.js
/**
 * Checks if the string starts with the specified search text.
 *
 * @param {string} searchString - The text to search for.
 * @param {number} position - Optional start position.
 * @return {boolean} Returns true if the string starts with the search text, otherwise returns false.
 */
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        "use strict";

        function isRegExp(value) {
            var matcher;

            if (value === null || value === undefined) {
                return false;
            }
            if (typeof Symbol !== "undefined" && Symbol.match) {
                matcher = value[Symbol.match];
                if (matcher !== undefined) {
                    return Boolean(matcher);
                }
            }
            return Object.prototype.toString.call(value) === "[object RegExp]";
        }

        var string;
        var search;
        var start;
        var number;

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.startsWith called on null or undefined");
        }
        string = String(this);
        if (isRegExp(searchString)) {
            throw new TypeError("First argument to String.prototype.startsWith must not be a regular expression");
        }
        search = String(searchString);
        number = position === undefined ? 0 : Number(position);

        if (number !== number) {
            number = 0;
        } else if (number !== 0 && number !== Infinity && number !== -Infinity) {
            number = number < 0 ? Math.ceil(number) : Math.floor(number);
        }
        start = Math.min(Math.max(number, 0), string.length);

        return string.slice(start, start + search.length) === search;
    };
}
//* Include file end: ../../String/Lib/startsWith.js


//* Include file start: ../../String/Lib/repeat.js
/**
 * Repeats the string a specified number of times.
 *
 * @param {number} count - The number of times to repeat the string.
 * @return {string} The repeated string.
 */
if (!String.prototype.repeat) {
    String.prototype.repeat = function (count) {
        "use strict";

        var string;
        var number;
        var result = "";

        if (this === null || this === undefined) {
            throw new TypeError("String.prototype.repeat called on null or undefined");
        }

        string = String(this);
        number = Number(count);
        if (number !== number) {
            number = 0;
        } else if (number !== 0 && number !== Infinity && number !== -Infinity) {
            number = number < 0 ? Math.ceil(number) : Math.floor(number);
        }
        if (number < 0 || number === Infinity) {
            throw new RangeError("Invalid count value");
        }
        if (string.length === 0 || number === 0) {
            return "";
        }
        if (string.length * number >= (1 << 28)) {
            throw new RangeError("repeat count must not overflow maximum string size");
        }

        while (number > 0) {
            if (number % 2 === 1) {
                result += string;
            }
            number = Math.floor(number / 2);
            if (number > 0) {
                string += string;
            }
        }

        return result;
    };
}
//* Include file end: ../../String/Lib/repeat.js


//* Include file start: Lib/ESprocessor.js
/*
 * ExtendScript File Processor engine.
 *
 * The engine is separate from the interactive runner so it can be exercised
 * by the same harness in ESTK and Node.js.
 */
var ESprocessor = (function () {
    function option(options, name, fallback) {
        return options && options[name] !== undefined ? options[name] : fallback;
    }

    function targetPath(sourcePath) {
        return /\.\w+$/.test(sourcePath) ?
            sourcePath.replace(/(\.\w+)$/, "_full$1") :
            sourcePath + "_full";
    }

    function logPath(sourcePath) {
        return /\.\w+$/.test(sourcePath) ?
            sourcePath.replace(/(\.\w+)$/, ".log") :
            sourcePath + ".log";
    }

    function writeConsole(state, message) {
        if (state.log && typeof console !== "undefined" && console.log) {
            console.log(message);
        }
    }

    function writeLog(state, message) {
        if (state.logFile) {
            state.logFile.writeln(message);
        }
    }

    function isRelativePath(path) {
        return path.startsWith("./") || path.startsWith("../") ||
            path.startsWith(".\\") || path.startsWith("..\\");
    }

    function resolveIncludeFile(include, sourceFileDirectory, includePaths) {
        var basePath;
        var fullPath;
        var file;
        var i;

        if (isRelativePath(include)) {
            basePath = sourceFileDirectory;
            fullPath = basePath + "/" + include;
            file = new File(fullPath);
            if (file.exists) {
                return file;
            }
        }

        file = new File(include);
        if (file.exists) {
            return file;
        }

        for (i = 0; i < includePaths.length; i++) {
            fullPath = includePaths[i] + "/" + include;
            file = new File(fullPath);
            if (file.exists) {
                return file;
            }
        }

        return null;
    }

    function processInclude(include, sourceFileDirectory, state) {
        var includeFile = resolveIncludeFile(
            include,
            sourceFileDirectory,
            state.includePaths
        );
        var logText;

        if (!includeFile || !includeFile.exists) {
            if (state.log) {
                logText = "//! " + include + " doesn't exist.\n";
                state.targetFile.writeln(logText);
                writeConsole(state, logText);
                writeLog(state, logText);
            }
            return;
        }

        if (state.seen.indexOf(includeFile.relativeURI) !== -1) {
            if (state.log) {
                logText = "//? " + include + " already included.\n";
                state.targetFile.writeln(logText);
                writeConsole(state, logText);
                writeLog(state, logText);
            }
            return;
        }

        state.seen.push(includeFile.relativeURI);
        if (state.log) {
            logText = "//* Include file start: " + include;
            state.targetFile.writeln("\n" + logText);
            writeConsole(state, logText);
            state.indentLevel++;
            writeLog(
                state,
                "\n" + (state.indent ? "\t".repeat(state.indentLevel) : "") + logText
            );
        }

        if (!includeFile.open("r")) {
            throw new Error("Could not open include file: " + includeFile.fsName);
        }
        try {
            processFile(includeFile, includeFile.parent.fsName, state);
        } finally {
            includeFile.close();
        }

        if (state.log) {
            logText = "//* Include file end: " + include + "\n";
            state.targetFile.writeln(logText);
            writeConsole(state, logText);
            writeLog(
                state,
                (state.indent ? "\t".repeat(state.indentLevel) : "") + logText
            );
            state.indentLevel--;
        }
    }

    function processFile(source, sourceFileDirectory, state) {
        var line;
        var includeMatch;
        var includePathMatch;
        var includePath;

        while (!source.eof) {
            line = source.readln();
            includeMatch = line.match(/^\s*(?:#|\/\/@)include\s+"([^"]+)"/);
            includePathMatch = line.match(/^\s*(?:#|\/\/@)includepath\s+"([^"]+)"/);

            if (includeMatch) {
                processInclude(includeMatch[1], sourceFileDirectory, state);
            } else if (includePathMatch) {
                includePath = includePathMatch[1];
                if (isRelativePath(includePath)) {
                    includePath = sourceFileDirectory + "/" + includePath;
                }
                if (state.includePaths.indexOf(includePath) === -1) {
                    state.includePaths.push(includePath);
                }
            } else {
                state.targetFile.writeln(line);
            }
        }
    }

    function process(sourceFile, options) {
        var log = option(options, "log", true);
        var useLogFile = log && option(options, "logFile", true);
        var indent = option(options, "indent", true);
        var outputPath;
        var targetFile;
        var logFile = null;
        var message;
        var state;

        if (!sourceFile) {
            if (log) {
                console.log("No file selected");
            }
            return null;
        }
        if (!sourceFile.exists) {
            if (log) {
                console.log("Source file does not exist.");
            }
            return null;
        }

        outputPath = targetPath(sourceFile.relativeURI);
        targetFile = new File(outputPath);
        if (!targetFile.open("w")) {
            throw new Error("Could not open target file: " + outputPath);
        }

        if (useLogFile) {
            logFile = new File(logPath(sourceFile.relativeURI));
            if (!logFile.open("w")) {
                targetFile.close();
                throw new Error("Could not open log file: " + logFile.fsName);
            }
        }

        state = {
            indent: indent,
            indentLevel: 0,
            includePaths: [sourceFile.parent.fsName],
            log: log,
            logFile: logFile,
            seen: [sourceFile.relativeURI],
            targetFile: targetFile
        };

        message = "Started consolidating " + sourceFile.relativeURI;
        writeConsole(state, message);
        writeLog(state, message);

        if (!sourceFile.open("r")) {
            targetFile.close();
            if (logFile) {
                logFile.close();
            }
            throw new Error("Could not open source file: " + sourceFile.fsName);
        }

        try {
            processFile(sourceFile, sourceFile.parent.fsName, state);
        } catch (error) {
            sourceFile.close();
            targetFile.close();
            if (logFile) {
                logFile.close();
            }
            throw error;
        }
        sourceFile.close();
        targetFile.close();

        message = "File was consolidated successfully to: " + targetFile.displayName;
        writeConsole(state, message);
        writeLog(state, message);
        if (logFile) {
            logFile.close();
        }

        return {
            includePaths: state.includePaths,
            outputFile: targetFile,
            seen: state.seen
        };
    }

    function run(options) {
        var fileTypes = "Javascript files:*.js;*.jsx;*.jsxinc,All files:*.*";
        return process(File.openDialog("Open", fileTypes), options);
    }

    return {
        process: process,
        run: run
    };
}());
//* Include file end: Lib/ESprocessor.js


//* Include file start: Lib/run.js
ESprocessor.run({
    log: true,
    logFile: true,
    indent: true
});
//* Include file end: Lib/run.js

