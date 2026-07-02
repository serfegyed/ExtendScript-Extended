/**
 * Difference between 1 and the smallest greater representable Number.
 */
if (typeof Number.EPSILON === "undefined") {
    Number.EPSILON = Math.pow(2, -52);
}
