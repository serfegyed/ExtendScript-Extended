/*
 * Script Name: ExtendScript File Processor
 *
 * Description: This script automates the process of consolidating ExtendScript files and their dependencies into a single file. 
 *              It includes functionalities such as opening a file dialog to select a source file, logging file properties,
 *              and recursively processing #include statements to integrate content from referenced files. 
 *              
 * Author: Egyed Serf
 * Date: 12/02/2024
 * Version: 1.0
 *			Initial version. Recognising only #include statements
 * Version: 1.1
 *			Small code clean (redundacy)
 * Version: 1.2
 *			Refactored include file recognition. Now accept indented #include statements too 
 *			Accepts #includepath
 *			Accepts //@include and //@includepath format
 *			Uses Array instead of Set to reduce code size
 *			Uses '!', '?' and '*' to accent log lines if you use "Better Comment" VS Code plugin 
 * Version: 1.3
 *			Handles relative path (./ and ../)
 *			Small code cleaning
 * Version: 1.4
 *			Preserves source file extension
 *			Added three switchable constant in source
 *				Log ON/OFF switch
 *				Log file ON/OFF switch
 *				Log file indent ON/OFF switch
 *
 * Usage:
 * 1. Run the script in an ExtendScript compatible Adobe application.
 * 2. Select a source file through the opened file dialog.
 * 3. The script processes the selected file and its dependencies, logging information and 
 *    creating a consolidated output file with '_full' suffix.
 *
 * Dependencies:
 * - Console polyfill
 * - String.startsWith polyfill
 * - Array.indexOf polyfill 
 */
//@include "~/Extendscript/Github repo/Extendscript/console/console.js"
//@includepath "D:\\OneDrive\\Extendscript\\Github Public\\ExtendScript-Extended\\Array\\Lib\\"
//@include "indexOf.js"
#include "D:/OneDrive/Extendscript/Github Public\\ExtendScript-Extended/String/Lib/startsWith.js"
#include "D:/OneDrive/Extendscript/Github Public\\ExtendScript-Extended/String/Lib/repeat.js"

// Toggle these constants to change output
const LOG = true;
const LOGFILE = true;	// Works if LOG === true
const INDENT = true;	// Works if LOGFILE === true

var indentLevel = 0;

const fileTypes = "Javascript files:*.js;*.jsx;*.jsxinc,All files:*.*";
var sourceFile = File.openDialog("Open", fileTypes);

// Array to hold include paths
var includePaths = [];

// Array to register files already included
var seen = [];

if (!sourceFile) {
	if (LOG) {
		console.log("No file selected");
	};
} else if (!sourceFile.exists) {
	if (LOG) {
		console.log("Source file does not exist.");
	};
} else {
	seen.push(sourceFile.relativeURI);
	// register files already included

	sourceFile.open("r");

	// Create the target file path by adding '_full' suffix before the file extension
	var targetFilePath = sourceFile.relativeURI.replace(/(\.\w+)$/, "_full$1");
	var targetFile = new File(targetFilePath);
	targetFile.open("w");

	if (LOG) {
		logText = "Started consolidating " + sourceFile.relativeURI;
		console.log(logText);
		if (LOGFILE) {
			var logFilePath = sourceFile.relativeURI.replace(/(\.\w+)$/, ".log");
			var logFile = new File(logFilePath);
			logFile.open("w");
			logFile.writeln(logText);
		};
	};

	// the source file's directory is the first include path
	includePaths.push(sourceFile.parent.fsName)

	processFile(sourceFile, sourceFile.parent.fsName);

	sourceFile.close();
	targetFile.close();

	// clean register array
	seen.length = 0;

	if (LOG) {
		var logText = "File was consolidated successfully to: " + targetFile.displayName;
		console.log(logText);
		if (LOGFILE) {
			logFile.writeln(logText);
			logFile.close();
		};
	};
};

function processFile(source, sourceFileDirectory) {
	while (!source.eof) {
		var line = source.readln();
		var includeMatch = line.match(/^\s*(?:#|\/\/@)include\s+"([^"]+)"/);
		var includePathMatch = line.match(/^\s*(?:#|\/\/@)includepath\s+"([^"]+)"/);

		if (includeMatch) {
			var include = includeMatch[1];
			processInclude(include, sourceFileDirectory);
		} else if (includePathMatch) {
			var includePath = includePathMatch[1];
			if (includePaths.indexOf(includePath) === -1) {
				includePaths.push(includePath);
			}
		} else {
			targetFile.writeln(line);
		}
	}
}

function processInclude(include, sourceFileDirectory) {
	var includeFile = resolveIncludeFile(include, sourceFileDirectory);
	if (includeFile && includeFile.exists) {
		if (seen.indexOf(includeFile.relativeURI) === -1) {
			seen.push(includeFile.relativeURI);
			if (LOG) {
				logText = "//* Include file start: " + include;
				targetFile.writeln("\n" + logText);
				console.log(logText);
				if (LOGFILE) {
					logFile.writeln("\n" + (INDENT ? "\t".repeat(++indentLevel) : "") + logText);
				};
			};
			includeFile.open("r");
			processFile(includeFile, includeFile.parent.fsName);
			includeFile.close();
			if (LOG) {
				logText = "//* Include file end: " + include + "\n";
				targetFile.writeln(logText);
				console.log(logText);
				if (LOGFILE) {
					logFile.writeln((INDENT ? "\t".repeat(indentLevel--) : "") + logText);
				};
			};
		} else {
			if (LOG) {
				logText = "//? " + include + " already included.\n";
				targetFile.writeln(logText);
				console.log(logText);
				if (LOGFILE) {
					logFile.writeln(logText);
				};
			};
		};
	} else {
		if (LOG) {
			logText = "//! " + include + " doesn't exist.\n"
			targetFile.writeln(logText);
			console.log(logText);
			if (LOGFILE) {
				logFile.writeln(logText);
			};
		};
	}
}

function resolveIncludeFile(include, sourceFileDirectory) {
	// Resolve relative paths based on the source file's directory
	if (include.startsWith("./") || include.startsWith("../")) {
		var basePath = sourceFileDirectory;
		var fullPath = basePath + "/" + include;
		var file = new File(fullPath);
		if (file.exists) {
			return file;
		}
	}

	var file = new File(include);
	if (file.exists) {
		return file;
	}

	// Attempt to resolve the file using include paths
	for (var i = 0; i < includePaths.length; i++) {
		var path = includePaths[i];
		var fullPath = path + "/" + include;
		file = new File(fullPath);
		if (file.exists) {
			return file;
		}
	}

	return null; // File not found
}