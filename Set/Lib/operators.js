/**
 * Optional ESTK operator overloads for standard Set operations.
 */
Set.prototype["|"] = function (other) {
    return this.union(other);
};

Set.prototype["&"] = function (other) {
    return this.intersection(other);
};

Set.prototype["-"] = function (other) {
    return this.difference(other);
};

Set.prototype["^"] = function (other) {
    return this.symmetricDifference(other);
};

Set.prototype["=="] = function (other) {
    return other instanceof Set &&
        this.size === other.size &&
        this.isSubsetOf(other);
};

Set.prototype["<<"] = function (other) {
    return this.isSubsetOf(other);
};

Set.prototype[">>"] = function (other) {
    return this.isSupersetOf(other);
};

Set.prototype["%"] = function (other) {
    return this.isDisjointFrom(other);
};
