"use strict";

function isIdentifierStart(character) {
    return /[A-Za-z_$]/.test(character);
}

function isIdentifierPart(character) {
    return /[A-Za-z0-9_$]/.test(character);
}

function tokenize(source) {
    var tokens = [];
    var index = 0;
    var lineStart = 0;
    var length = source.length;

    function add(type, value, start, end, tokenLineStart) {
        tokens.push({
            type: type,
            value: value,
            start: start,
            end: end,
            lineStart: tokenLineStart
        });
    }

    while (index < length) {
        var character = source.charAt(index);
        var start;
        var quote;

        if (character === "\r" || character === "\n") {
            if (character === "\r" && source.charAt(index + 1) === "\n") index++;
            index++;
            lineStart = index;
            continue;
        }

        if (/\s/.test(character)) {
            index++;
            continue;
        }

        if (character === "/" && source.charAt(index + 1) === "/") {
            index += 2;
            while (index < length && source.charAt(index) !== "\r" && source.charAt(index) !== "\n") index++;
            continue;
        }

        if (character === "/" && source.charAt(index + 1) === "*") {
            index += 2;
            while (index < length && !(source.charAt(index) === "*" && source.charAt(index + 1) === "/")) {
                if (source.charAt(index) === "\n") lineStart = index + 1;
                index++;
            }
            index = Math.min(index + 2, length);
            continue;
        }

        if (character === "\"" || character === "'") {
            start = index;
            quote = character;
            index++;
            while (index < length) {
                character = source.charAt(index);
                if (character === "\\") {
                    index += 2;
                } else if (character === quote) {
                    index++;
                    break;
                } else {
                    index++;
                }
            }
            add("string", source.slice(start, index), start, index, lineStart);
            continue;
        }

        if (isIdentifierStart(character)) {
            start = index++;
            while (index < length && isIdentifierPart(source.charAt(index))) index++;
            add("identifier", source.slice(start, index), start, index, lineStart);
            continue;
        }

        if (/[0-9]/.test(character) || (character === "." && /[0-9]/.test(source.charAt(index + 1)))) {
            start = index++;
            while (index < length && /[0-9A-Fa-fxX.eE+-]/.test(source.charAt(index))) index++;
            add("number", source.slice(start, index), start, index, lineStart);
            continue;
        }

        add("punctuator", character, index, index + 1, lineStart);
        index++;
    }

    return tokens;
}

module.exports = {
    tokenize: tokenize
};
