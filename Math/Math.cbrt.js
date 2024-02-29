Math.cbrt = function(x) {
    if (x === 0) return 0;
    var negate = x < 0,
        result;
    if (negate) {
        x = -x;
    }
    result = Math.exp(Math.log(x) / 3);
    return negate ? -result : result;
};