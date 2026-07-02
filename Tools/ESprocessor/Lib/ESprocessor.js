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
