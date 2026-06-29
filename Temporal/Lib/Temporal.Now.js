// v1 - Add the system-clock Temporal.Now.instant subset

(function (Temporal) {
    Temporal.Now = {};

    Temporal.Now.instant = function () {
        return new Temporal.Instant(new Date().getTime());
    };
}(Temporal));
