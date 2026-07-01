/**
 * Maps each present item to one of its properties.
 */
//@include "./map.js"
if (!Array.prototype.pluck) {
    Array.prototype.pluck = function (name) {
        "use strict";

        return Array.prototype.map.call(this, function (item) {
            return item[name];
        });
    };
}
