/*
 * Object descriptor audit.
 *
 * This file intentionally does not load the project Object.js bundle. It
 * records native runtime behavior before deciding whether a descriptor
 * polyfill is useful in ExtendScript.
 */
//@include "../../Tools/Console/console.js"

(function () {
    function log(line) {
        console.log(line);
    }

    function valueLabel(value) {
        var type = typeof value;
        var keys;
        var i;

        if (value === undefined) return "undefined";
        if (value === null) return "null";
        if (type === "string") return '"' + value + '"';
        if (type === "number" || type === "boolean") return String(value);
        if (type === "function") return "[function]";
        if (value instanceof Array) {
            keys = [];
            for (i = 0; i < value.length; i++) {
                keys.push(valueLabel(value[i]));
            }
            return "[" + keys.join(", ") + "]";
        }
        if (type === "object") {
            keys = [];
            for (i in value) {
                if (Object.prototype.hasOwnProperty.call(value, i)) {
                    keys.push(i + ":" + valueLabel(value[i]));
                }
            }
            return "{" + keys.join(", ") + "}";
        }
        return String(value);
    }

    function descriptorLabel(descriptor) {
        var parts;

        if (descriptor === undefined) return "undefined";
        if (descriptor === null) return "null";

        parts = [];
        if ("value" in descriptor) {
            parts.push("value=" + valueLabel(descriptor.value));
        }
        if ("writable" in descriptor) {
            parts.push("writable=" + valueLabel(descriptor.writable));
        }
        if ("enumerable" in descriptor) {
            parts.push("enumerable=" + valueLabel(descriptor.enumerable));
        }
        if ("configurable" in descriptor) {
            parts.push("configurable=" + valueLabel(descriptor.configurable));
        }
        if ("get" in descriptor) {
            parts.push("get=" + valueLabel(descriptor.get));
        }
        if ("set" in descriptor) {
            parts.push("set=" + valueLabel(descriptor.set));
        }
        return "{" + parts.join(", ") + "}";
    }

    function audit(name, callback) {
        try {
            log(name + ": " + callback());
        } catch (error) {
            log(name + ": throws " + (error.name || "Error") + " " +
                (error.message || String(error)));
        }
    }

    function getDescriptor(object, name) {
        if (typeof Object.getOwnPropertyDescriptor !== "function") {
            return "missing";
        }
        return descriptorLabel(Object.getOwnPropertyDescriptor(object, name));
    }

    function getDescriptorKeys(object) {
        var descriptors;
        var keys;
        var key;

        if (typeof Object.getOwnPropertyDescriptors !== "function") {
            return "missing";
        }

        descriptors = Object.getOwnPropertyDescriptors(object);
        keys = [];
        for (key in descriptors) {
            if (Object.prototype.hasOwnProperty.call(descriptors, key)) {
                keys.push(key + "=" + descriptorLabel(descriptors[key]));
            }
        }
        keys.sort();
        return keys.join("; ");
    }

    function reflectInfoLabel(info) {
        var parts = [];
        var names = [
            "name",
            "type",
            "dataType",
            "description",
            "defaultValue",
            "min",
            "max",
            "readonly"
        ];
        var name;
        var i;

        if (info === undefined) return "undefined";
        if (info === null) return "null";

        for (i = 0; i < names.length; i++) {
            name = names[i];
            try {
                if (info[name] !== undefined) {
                    parts.push(name + "=" + valueLabel(info[name]));
                }
            } catch (error) {
                parts.push(name + "=throws");
            }
        }
        return "{" + parts.join(", ") + "}";
    }

    function reflectListLabel(list, limit) {
        var labels = [];
        var i;

        if (list === undefined) return "undefined";
        if (list === null) return "null";
        if (typeof list.length !== "number") return valueLabel(list);

        for (i = 0; i < list.length && i < limit; i++) {
            labels.push(reflectInfoLabel(list[i]));
        }
        if (list.length > limit) {
            labels.push("... " + (list.length - limit) + " more");
        }
        return "length=" + list.length + " [" + labels.join("; ") + "]";
    }

    function findReflectInfo(list, name) {
        var i;

        if (!list || typeof list.length !== "number") {
            return "no list";
        }

        for (i = 0; i < list.length; i++) {
            try {
                if (list[i].name === name) {
                    return reflectInfoLabel(list[i]);
                }
            } catch (error) {
                return "throws while reading item " + i;
            }
        }
        return "not found";
    }

    function reflectionSummary(object, name) {
        if (!object || !object.reflect) {
            return "no reflect";
        }

        return "properties " + findReflectInfo(object.reflect.properties, name) +
            "; methods " + findReflectInfo(object.reflect.methods, name);
    }

    function auditReflectionObject(label, object, propertyName) {
        audit(label + " reflect exists", function () {
            return object && object.reflect ? "yes" : "no";
        });

        audit(label + " reflect properties", function () {
            if (!object || !object.reflect) return "no reflect";
            return reflectListLabel(object.reflect.properties, 5);
        });

        audit(label + " reflect methods", function () {
            if (!object || !object.reflect) return "no reflect";
            return reflectListLabel(object.reflect.methods, 5);
        });

        audit(label + " reflect lookup " + propertyName, function () {
            return reflectionSummary(object, propertyName);
        });
    }

    log("Object descriptor audit");
    log("Object.getOwnPropertyDescriptor: " +
        typeof Object.getOwnPropertyDescriptor);
    log("Object.getOwnPropertyDescriptors: " +
        typeof Object.getOwnPropertyDescriptors);
    log("Object.defineProperty: " + typeof Object.defineProperty);
    log("Object.defineProperties: " + typeof Object.defineProperties);

    audit("plain own value", function () {
        return getDescriptor({ a: 1 }, "a");
    });

    audit("plain missing value", function () {
        return getDescriptor({ a: 1 }, "b");
    });

    audit("inherited value", function () {
        function Parent() {}
        Parent.prototype.a = 1;
        return getDescriptor(new Parent(), "a");
    });

    audit("array index", function () {
        return getDescriptor(["x"], "0");
    });

    audit("array length", function () {
        return getDescriptor(["x"], "length");
    });

    audit("function length", function () {
        return getDescriptor(function (a, b) { return a + b; }, "length");
    });

    audit("defineProperty value descriptor", function () {
        var object = {};

        if (typeof Object.defineProperty !== "function") {
            return "defineProperty missing";
        }

        Object.defineProperty(object, "a", {
            value: 1,
            enumerable: false,
            writable: false,
            configurable: false
        });
        return getDescriptor(object, "a") + "; keys=" + valueLabel(Object.keys(object));
    });

    audit("defineProperty accessor descriptor", function () {
        var object = {};

        if (typeof Object.defineProperty !== "function") {
            return "defineProperty missing";
        }

        Object.defineProperty(object, "a", {
            get: function () { return 1; },
            enumerable: true,
            configurable: true
        });
        return getDescriptor(object, "a") + "; value=" + valueLabel(object.a);
    });

    audit("all descriptors", function () {
        var object = { a: 1 };

        object.b = 2;
        return getDescriptorKeys(object);
    });

    log("Reflection audit");

    auditReflectionObject("plain object", { a: 1 }, "a");
    auditReflectionObject("array", ["x"], "length");
    auditReflectionObject("function", function (a, b) { return a + b; }, "length");

    audit("global app exists", function () {
        return typeof app;
    });

    audit("app reflect", function () {
        if (typeof app === "undefined") {
            return "app missing";
        }
        return app && app.reflect ? "yes" : "no";
    });

    audit("app reflect sample properties", function () {
        if (typeof app === "undefined" || !app.reflect) {
            return "app reflect missing";
        }
        return reflectListLabel(app.reflect.properties, 8);
    });

    audit("app reflect sample methods", function () {
        if (typeof app === "undefined" || !app.reflect) {
            return "app reflect missing";
        }
        return reflectListLabel(app.reflect.methods, 8);
    });

    audit("app reflect lookup activeDocument", function () {
        if (typeof app === "undefined") {
            return "app missing";
        }
        return reflectionSummary(app, "activeDocument");
    });
}());
