// Number.parseFloat polyfill for ExtendScript

if (!Number.parseFloat) {
    Number.parseFloat = function (string) {
        return parseFloat(string);
    };
}
