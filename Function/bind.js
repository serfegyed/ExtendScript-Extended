// Function.prototype.bind polyfill for ExtendScript

(function () {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (thisArg) {
            var target = this;
            var boundArgs = Array.prototype.slice.call(arguments, 1);
            var Empty = function () {};
            var bound;

            if (typeof target !== "function") {
                throw new TypeError("Function.prototype.bind called on incompatible receiver");
            }

            bound = function () {
                var callArguments = boundArgs.concat(Array.prototype.slice.call(arguments));
                var result;

                if (this instanceof bound) {
                    result = target.apply(this, callArguments);
                    if (result !== null &&
                            (typeof result === "object" ||
                                typeof result === "function")) {
                        return result;
                    }
                    return this;
                }

                return target.apply(thisArg, callArguments);
            };

            if (target.prototype &&
                    (typeof target.prototype === "object" ||
                        typeof target.prototype === "function")) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                Empty.prototype = null;
            }

            return bound;
        };
    }
}());
