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
