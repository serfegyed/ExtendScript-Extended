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
