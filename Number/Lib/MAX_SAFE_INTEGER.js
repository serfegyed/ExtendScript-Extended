/**
 * Largest integer that can be represented exactly by Number.
 */
if (typeof Number.MAX_SAFE_INTEGER === "undefined") {
    Number.MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
}
