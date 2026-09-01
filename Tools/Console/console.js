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
 * - console.table(data, columns): Logs tabular data as an ASCII table.
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
        var logFile = null;
        var hostName = "";

        if (typeof BridgeTalk !== "undefined") {
            hostName = String(BridgeTalk.appName).toLowerCase();
        }
        if (hostName !== "" && hostName !== "estoolkit") {
            var home = $.getenv("USERPROFILE") || $.getenv("HOME") || "~";
            var logFolder = Folder(String(home).replace(/\\/g, "/") + "/.ESTK_scripts");

            if (!logFolder.exists) {
                logFolder.create();
            }
            logFile = File(logFolder.fullName + "/console.log");
            logFile.encoding = "UTF-8";
            logFile.open("w");
            logFile.writeln(hostName);
            logFile.writeln("----------------");
            logFile.close();
        }

        function writeOutput(message) {
            if (logFile !== null) {
                logFile.encoding = "UTF-8";
                if (logFile.open("a")) {
                    logFile.writeln(message);
                    logFile.close();
                    return;
                }
            }
            $.writeln(message);
        }

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

        function hasOwn(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        }

        function isArray(value) {
            return Object.prototype.toString.call(value) === "[object Array]";
        }

        function addColumn(columns, column) {
            for (var i = 0; i < columns.length; i++) {
                if (columns[i] === column) {
                    return;
                }
            }
            columns.push(column);
        }

        function stringifyCell(value) {
            if (value === null) {
                return "null";
            }
            if (typeof value === "undefined") {
                return "undefined";
            }
            if (typeof value === "function") {
                return "[Function]";
            }
            if (typeof value === "object") {
                return isArray(value) ? "[Array]" : "[Object]";
            }
            return String(value);
        }

        function getTableRows(data) {
            var rows = [];
            var i;

            if (isArray(data)) {
                for (i = 0; i < data.length; i++) {
                    rows.push({
                        index: String(i),
                        value: data[i]
                    });
                }
            } else {
                for (i in data) {
                    if (hasOwn(data, i)) {
                        rows.push({
                            index: String(i),
                            value: data[i]
                        });
                    }
                }
            }

            return rows;
        }

        function getTableColumns(rows, selectedColumns) {
            var columns = [];
            var i;
            var property;

            if (typeof selectedColumns !== "undefined") {
                if (isArray(selectedColumns)) {
                    for (i = 0; i < selectedColumns.length; i++) {
                        addColumn(columns, String(selectedColumns[i]));
                    }
                } else {
                    addColumn(columns, String(selectedColumns));
                }
                return columns;
            }

            for (i = 0; i < rows.length; i++) {
                if (rows[i].value !== null && typeof rows[i].value === "object") {
                    for (property in rows[i].value) {
                        if (hasOwn(rows[i].value, property)) {
                            addColumn(columns, String(property));
                        }
                    }
                } else {
                    addColumn(columns, "value");
                }
            }

            return columns;
        }

        function getTableCell(row, column) {
            if (row.value !== null && typeof row.value === "object") {
                return hasOwn(row.value, column) ? stringifyCell(row.value[column]) : "";
            }
            return column === "value" ? stringifyCell(row.value) : "";
        }

        function repeatCharacter(character, count) {
            var text = "";
            for (var i = 0; i < count; i++) {
                text += character;
            }
            return text;
        }

        function formatTable(data, selectedColumns) {
            var rows = getTableRows(data);
            var columns = getTableColumns(rows, selectedColumns);
            var headers = ["(index)"];
            var widths = [];
            var output = [];
            var i;
            var j;
            var line;

            for (i = 0; i < columns.length; i++) {
                headers.push(columns[i]);
            }

            for (i = 0; i < headers.length; i++) {
                widths[i] = headers[i].length;
            }

            for (i = 0; i < rows.length; i++) {
                if (rows[i].index.length > widths[0]) {
                    widths[0] = rows[i].index.length;
                }
                for (j = 0; j < columns.length; j++) {
                    line = getTableCell(rows[i], columns[j]);
                    if (line.length > widths[j + 1]) {
                        widths[j + 1] = line.length;
                    }
                }
            }

            function border() {
                var text = "+";
                for (var k = 0; k < widths.length; k++) {
                    text += repeatCharacter("-", widths[k] + 2) + "+";
                }
                return text;
            }

            function row(values) {
                var text = "|";
                for (var k = 0; k < values.length; k++) {
                    text += " " + values[k] + repeatCharacter(" ", widths[k] - values[k].length) + " |";
                }
                return text;
            }

            output.push(border());
            output.push(row(headers));
            output.push(border());
            for (i = 0; i < rows.length; i++) {
                line = [rows[i].index];
                for (j = 0; j < columns.length; j++) {
                    line.push(getTableCell(rows[i], columns[j]));
                }
                output.push(row(line));
            }
            output.push(border());

            return output.join("\n");
        }

        consoleObject.log = function () {
            writeOutput(joinArguments(arguments, 0));
        };

        consoleObject.assert = function (assertion) {
            if (!assertion) {
                var message = "Assertion failed";
                if (arguments.length > 1) {
                    message += ": " + joinArguments(arguments, 1);
                }
                writeOutput(message);
            }
        };

        consoleObject.error = function () {
            var message = joinArguments(arguments, 0);
            writeOutput("Error:" + (message ? " " + message : ""));
        };

        consoleObject.warn = function () {
            var message = joinArguments(arguments, 0);
            writeOutput("Warning:" + (message ? " " + message : ""));
        };

        consoleObject.table = function (data, columns) {
            if (data === null || typeof data === "undefined" || typeof data !== "object") {
                consoleObject.log(data);
                return;
            }
            consoleObject.log(formatTable(data, columns));
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
