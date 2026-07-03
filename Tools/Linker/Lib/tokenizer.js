"use strict";

const isIdentifierStart = character => /[A-Za-z_$]/.test(character);
const isIdentifierPart = character => /[A-Za-z0-9_$]/.test(character);

function tokenize(source) {
    const tokens = [];
    const length = source.length;
    let index = 0;
    let lineStart = 0;

    const add = (type, value, start, end) => {
        tokens.push({type, value, start, end, lineStart});
    };

    while (index < length) {
        let character = source[index];

        if (character === "\r" || character === "\n") {
            if (character === "\r" && source[index + 1] === "\n") index++;
            lineStart = ++index;
            continue;
        }
        if (/\s/.test(character)) {
            index++;
            continue;
        }
        if (source.slice(index, index + 2) === "//") {
            index += 2;
            while (index < length && !/[\r\n]/.test(source[index])) index++;
            continue;
        }
        if (source.slice(index, index + 2) === "/*") {
            index += 2;
            while (index < length && source.slice(index, index + 2) !== "*/") {
                if (source[index] === "\n") lineStart = index + 1;
                index++;
            }
            index = Math.min(index + 2, length);
            continue;
        }
        if (character === "\"" || character === "'") {
            const start = index;
            const quote = character;
            index++;
            while (index < length) {
                character = source[index];
                if (character === "\\") index += 2;
                else if (character === quote) {
                    index++;
                    break;
                } else index++;
            }
            add("string", source.slice(start, index), start, index);
            continue;
        }
        if (isIdentifierStart(character)) {
            const start = index++;
            while (index < length && isIdentifierPart(source[index])) index++;
            add("identifier", source.slice(start, index), start, index);
            continue;
        }
        if (/[0-9]/.test(character) || (character === "." && /[0-9]/.test(source[index + 1]))) {
            const start = index++;
            while (index < length && /[0-9A-Fa-fxX.eE+-]/.test(source[index])) index++;
            add("number", source.slice(start, index), start, index);
            continue;
        }

        add("punctuator", character, index, index + 1);
        index++;
    }

    return tokens;
}

module.exports = {tokenize};
