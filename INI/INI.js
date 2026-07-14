/**
 * Simple INI reader/writer for Adobe ExtendScript.
 *
 * Public API:
 * - INI.read(data, filename)
 * - INI.write(data, filename)
 *
 * The data argument must be an object whose section values are objects, or an
 * empty object. Missing files leave the passed object unchanged.
 */
var INI = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function isObject(value) {
        return value !== null && typeof value === "object";
    }

    function fail(message) {
        throw new Error("INI: " + message);
    }

    function validateData(data) {
        if (!isObject(data)) {
            fail("data must be an object");
        }
    }

    function validateObjectOfObjects(data) {
        validateData(data);
        for (var sectionName in data) {
            if (hasOwnProperty.call(data, sectionName)) {
                if (!isObject(data[sectionName])) {
                    fail("section must be an object: " + sectionName);
                }
            }
        }
    }

    function trim(text) {
        return String(text).replace(/^\s+|\s+$/g, "");
    }

    function getFile(filename) {
        if (typeof filename !== "string" || filename === "") {
            fail("filename must be a non-empty string");
        }
        if (typeof File === "undefined") {
            fail("File object is unavailable");
        }
        return File(filename);
    }

    function readFile(file, data) {
        var currentSection = null;

        if (!file.exists) {
            return data;
        }

        file.encoding = "UTF-8";
        if (!file.open("r")) {
            fail("cannot open file for reading: " + file);
        }

        try {
            while (!file.eof) {
                var line = trim(file.readln());

                if (line === "") {
                    continue;
                }

                if (line.charAt(0) === "[" && line.charAt(line.length - 1) === "]") {
                    currentSection = trim(line.substring(1, line.length - 1));
                    if (!hasOwnProperty.call(data, currentSection)) {
                        data[currentSection] = {};
                    } else if (!isObject(data[currentSection])) {
                        fail("section must be an object: " + currentSection);
                    }
                    continue;
                }

                var equalsIndex = line.indexOf("=");
                if (equalsIndex !== -1 && currentSection !== null) {
                    var keyName = trim(line.substring(0, equalsIndex));
                    if (keyName !== "") {
                        data[currentSection][keyName] = trim(line.substring(equalsIndex + 1));
                    }
                }
            }
        } finally {
            file.close();
        }

        return data;
    }

    function mergeData(target, source) {
        for (var sectionName in source) {
            if (hasOwnProperty.call(source, sectionName)) {
                if (!hasOwnProperty.call(target, sectionName)) {
                    target[sectionName] = {};
                } else if (!isObject(target[sectionName])) {
                    fail("section must be an object: " + sectionName);
                }

                for (var keyName in source[sectionName]) {
                    if (hasOwnProperty.call(source[sectionName], keyName)) {
                        target[sectionName][keyName] = source[sectionName][keyName];
                    }
                }
            }
        }
        return target;
    }

    function writeFile(file, data) {
        var firstSection = true;
        var outputData = {};

        validateObjectOfObjects(data);
        readFile(file, outputData);
        mergeData(outputData, data);

        file.encoding = "UTF-8";
        if (!file.open("w")) {
            fail("cannot open file for writing: " + file);
        }

        try {
            for (var sectionName in outputData) {
                if (hasOwnProperty.call(outputData, sectionName)) {
                    if (!firstSection) {
                        file.writeln("");
                    }
                    firstSection = false;
                    file.writeln("[" + sectionName + "]");

                    for (var keyName in outputData[sectionName]) {
                        if (hasOwnProperty.call(outputData[sectionName], keyName)) {
                            file.writeln(keyName + "=" + String(outputData[sectionName][keyName]));
                        }
                    }
                }
            }
        } finally {
            file.close();
        }
    }

    return {
        read: function (data, filename) {
            validateObjectOfObjects(data);
            return readFile(getFile(filename), data);
        },

        write: function (data, filename) {
            writeFile(getFile(filename), data);
            return data;
        }
    };
}());
