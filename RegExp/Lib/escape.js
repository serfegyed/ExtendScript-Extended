// RegExp.escape polyfill for ExtendScript

(function () {
    if (!RegExp.escape) {
        RegExp.escape = function (string) {
            var escaped = "";
            var i;
            var code;
            var next;

            if (typeof string !== "string") {
                throw new TypeError("RegExp.escape requires a string");
            }

            function hex(number, length) {
                var value = number.toString(16);

                while (value.length < length) {
                    value = "0" + value;
                }
                return value;
            }

            function isAsciiLetterOrDigit(codeUnit) {
                return (codeUnit >= 48 && codeUnit <= 57) ||
                    (codeUnit >= 65 && codeUnit <= 90) ||
                    (codeUnit >= 97 && codeUnit <= 122);
            }

            function isSyntaxCharacter(codeUnit) {
                return codeUnit === 94 || codeUnit === 36 ||
                    codeUnit === 92 || codeUnit === 46 ||
                    codeUnit === 42 || codeUnit === 43 ||
                    codeUnit === 63 || codeUnit === 40 ||
                    codeUnit === 41 || codeUnit === 91 ||
                    codeUnit === 93 || codeUnit === 123 ||
                    codeUnit === 125 || codeUnit === 124 ||
                    codeUnit === 47;
            }

            function isOtherPunctuator(codeUnit) {
                return codeUnit === 44 || codeUnit === 45 ||
                    codeUnit === 61 || codeUnit === 60 ||
                    codeUnit === 62 || codeUnit === 35 ||
                    codeUnit === 38 || codeUnit === 33 ||
                    codeUnit === 37 || codeUnit === 58 ||
                    codeUnit === 59 || codeUnit === 64 ||
                    codeUnit === 126 || codeUnit === 39 ||
                    codeUnit === 96 || codeUnit === 34;
            }

            function isWhiteSpaceOrLineTerminator(codeUnit) {
                return codeUnit === 9 || codeUnit === 10 ||
                    codeUnit === 11 || codeUnit === 12 ||
                    codeUnit === 13 || codeUnit === 32 ||
                    codeUnit === 160 || codeUnit === 5760 ||
                    codeUnit === 6158 || codeUnit === 8192 ||
                    codeUnit === 8193 || codeUnit === 8194 ||
                    codeUnit === 8195 || codeUnit === 8196 ||
                    codeUnit === 8197 || codeUnit === 8198 ||
                    codeUnit === 8199 || codeUnit === 8200 ||
                    codeUnit === 8201 || codeUnit === 8202 ||
                    codeUnit === 8232 || codeUnit === 8233 ||
                    codeUnit === 8239 || codeUnit === 8287 ||
                    codeUnit === 12288 || codeUnit === 65279;
            }

            function isLeadingSurrogate(codeUnit) {
                return codeUnit >= 0xD800 && codeUnit <= 0xDBFF;
            }

            function isTrailingSurrogate(codeUnit) {
                return codeUnit >= 0xDC00 && codeUnit <= 0xDFFF;
            }

            function encode(codeUnit) {
                if (isSyntaxCharacter(codeUnit)) {
                    return "\\" + String.fromCharCode(codeUnit);
                }

                if (codeUnit === 12) {
                    return "\\f";
                }
                if (codeUnit === 10) {
                    return "\\n";
                }
                if (codeUnit === 13) {
                    return "\\r";
                }
                if (codeUnit === 9) {
                    return "\\t";
                }
                if (codeUnit === 11) {
                    return "\\v";
                }

                if (isOtherPunctuator(codeUnit) ||
                        isWhiteSpaceOrLineTerminator(codeUnit) ||
                        isLeadingSurrogate(codeUnit) ||
                        isTrailingSurrogate(codeUnit)) {
                    if (codeUnit <= 0xFF) {
                        return "\\x" + hex(codeUnit, 2);
                    }
                    return "\\u" + hex(codeUnit, 4);
                }

                return String.fromCharCode(codeUnit);
            }

            for (i = 0; i < string.length; i++) {
                code = string.charCodeAt(i);

                if (escaped === "" && isAsciiLetterOrDigit(code)) {
                    escaped = "\\x" + hex(code, 2);
                } else if (isLeadingSurrogate(code) && i + 1 < string.length) {
                    next = string.charCodeAt(i + 1);
                    if (isTrailingSurrogate(next)) {
                        escaped += string.charAt(i) + string.charAt(i + 1);
                        i++;
                    } else {
                        escaped += encode(code);
                    }
                } else {
                    escaped += encode(code);
                }
            }

            return escaped;
        };
    }
}());
