// Number.parseInt polyfill for ExtendScript

if (!Number.parseInt) {
    Number.parseInt = function (string, radix) {
        if (radix === undefined || radix === 0) {
            string = String(string);
            if (/^\s*[+-]?0[xX]/.test(string)) {
                return parseInt(string, 16);
            }
            return parseInt(string, 10);
        }
        return parseInt(string, radix);
    };
}
