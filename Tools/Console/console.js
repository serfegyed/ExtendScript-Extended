/**
 * ExtendScript Console Object Polyfill
 * =====================================
 *
 * This script provides a simple polyfill for the `console` object commonly used in web development,
 * making it easier to debug Adobe ExtendScript code by introducing `console.log`, `console.assert`,
 * and `console.error` methods. These methods mimic the behavior of their web console counterparts,
 * allowing for a more familiar debugging experience.
 *
 * Methods included:
 * - console.log(...args): Logs general messages to the console.
 * - console.assert(assertion, ...args): Logs a message if an assertion fails.
 * - console.error(...args): Logs error messages to the console.
 *
 * Usage:
 * Simply include this script at the beginning of your ExtendScript files to make the `console`
 * methods available throughout your code.
 */
if (typeof console === 'undefined') {
    console = {};

    console.log = function () {
        var message = "";
        for (var i = 0; i < arguments.length; i++) {
            message += (i > 0 ? " " : "") + String(arguments[i]);
        }
        $.writeln(message);
    };

    console.assert = function (assertion) {
        if (!assertion) {
            var message = "Assertion failed: ";
            for (var i = 1; i < arguments.length; i++) {
                message += (i > 1 ? " " : "") + String(arguments[i]);
            }
            $.writeln(message);
        }
    };

    console.error = function () {
        var message = "Error: ";
        for (var i = 0; i < arguments.length; i++) {
            message += (i > 0 ? " " : "") + String(arguments[i]);
        }
        $.writeln(message);
    };

    console._timers = {};

    console.time = function (label) {
        label = label || 'default';
        if (console._timers.hasOwnProperty(label)) {
            console.error('Timer "' + label + '" already exists');
        } else {
            console._timers[label] = new Date().getTime();
        }
    };

    console.timeEnd = function (label) {
        label = label || 'default';
        if (console._timers.hasOwnProperty(label)) {
            var startTime = console._timers[label];
            var duration = new Date().getTime() - startTime;
            console.log(label + ': ' + duration + 'ms');
            delete console._timers[label];
        } else {
            console.error('No such timer: "' + label + '"');
        }
    };
}