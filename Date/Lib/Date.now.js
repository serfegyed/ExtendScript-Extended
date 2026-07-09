// Date.now polyfill for ExtendScript

(function () {
    if (!Date.now) {
        Date.now = function () {
            return new Date().getTime();
        };
    }
}());
