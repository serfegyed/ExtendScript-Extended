#include ".\\Set_standard.js";
#include ".\\Set_non-standard.js";

/**
 * @title Set class - ExtendScript (ES3)
 *
 * @description A lightweight Set class implemented in Extendscript (ES3).
 *
 * @author Egyed Serf
 * @license MIT
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/
 *
 *  * Set composition:
 *  - difference() - Calculates the difference between the current set and another set.
 *  - intersection() - Calculates the intersection of two sets.
 *  - isDisjointFrom() - Checks if the current set is a disjoint of another set
 *  - isEqual() - Checks if the current set is equal to another set
 *  - isSubsetOf() - Checks if the current set is a subset of another set
 *  - isSupersetOf() - Checks if the current set is a superset of another set
 *  - symmetricDifference() - Calculates the symmetric difference between this set and another set.
 *  - union() - Returns a new Set with the union of the two sets
 *
 */

/**
 * Returns a new set that is the union of the current set and the otherSet.
 *
 * @param {Set} otherSet - The set to be combined with the current set.
 * @throws {TypeError} If the otherSet parameter is not an instance of Set.
 * @return {Set} A new set that contains all the elements from both sets.
 */
Set.prototype.union = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.union(): wrong parameter type.");
    }

    var unionSet = new Set();
    return unionSet.from(this, otherSet);
};

/**
 * Calculates the difference between the current set and another set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @return {Set} The set containing the elements that are in the current set but not in the other set.
 */
Set.prototype.difference = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.difference(): wrong parameter type.");
    }
    var originalData = this.toArray();
    // Make a copy to avoid modification during iteration
    var diffSet = new Set(originalData);

    for (var i = 0; i < originalData.length; i++) {
        if (otherSet.has(originalData[i])) {
            diffSet.delete(originalData[i]);
        }
    };

    return diffSet;
};

/**
 * Calculates the symmetric difference between this set and another set.
 *
 * @param {Set} otherSet - The set to calculate the difference with.
 * @return {Set} The set containing the elements that are in either this set or the other set, but not in both.
 */
Set.prototype.symmetricDifference = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.symmetricDifference(): wrong parameter type.");
    }

    var diffSet1 = this.difference(otherSet);
    var diffSet2 = otherSet.difference(this);

    return diffSet1.from(diffSet2);
};

/**
 * Calculates the intersection of two sets.
 *
 * @param {Set} otherSet - The set to intersect with.
 * @return {Set} A new set containing the elements that are common to both sets.
 */
Set.prototype.intersection = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.intersection(): wrong parameter type.");
    }

    var intersectionSet = new Set();
    for (var i = 0; i < this._data.length; i++) {
        if (otherSet.has(this._data[i])) {
            intersectionSet.add(this._data[i]);
        }
    };

    return intersectionSet;
};

/**
 * Checks if the current set is a subset of the given set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter type is not a Set.
 * @return {boolean} Returns true if the current set is a subset of the given set, otherwise false.
 */
Set.prototype.isSubsetOf = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isSubsetOf(): wrong parameter type.");
    }
    if (this.size > otherSet.size) {
        return false;
    }
    if (Set.isEmpty(this)) {
        // An empty set is subset of any other sets
        return true;
    }

    for (var i = 0; i < this._data.length; i++) {
        if (!otherSet.has(this._data[i])) {
            // If any element isn't found in both sets, 'this' is not a subset
            return false;
        }
    };

    return true;
};

/**
 * Checks if this set is a superset of the given set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter is not a Set.
 * @return {boolean} True if this set is a superset of the given set, false otherwise.
 */
Set.prototype.isSupersetOf = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isSubsetOf(): wrong parameter type.");
    }
    if (this.size < otherSet.size) {
        return false;
    }
    if (Set.isEmpty(otherSet)) {
        // An empty set is subset of any other sets so 'this' is a superset
        return true;
    }

    return otherSet.isSubsetOf(this);
};

/**
 * Checks if the current set is disjoint with another set.
 *
 * @param {Set} otherSet - The set to compare with.
 * @return {boolean} Returns true if the sets are disjoint, false otherwise.
 */
Set.prototype.isDisjointFrom = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isDisjointFrom(): wrong parameter type.");
    }

    if (Set.isEmpty(this) || Set.isEmpty(otherSet)) {
        // Two empty sets are always disjoint
        return true;
    }

    for (var i = 0; i < this._data.length; i++) {
        if (otherSet.has(this._data[i])) {
            // If any element isn't found in both sets, 'this' is not a subset
            return false;
        }
    };

    // If no common elements are found, they are disjoint
    return true;
};

/**
 * Checks if the current set is equal to another set.
 *
 * @param {Set} otherSet - The set to compare against.
 * @throws {TypeError} If the parameter is not a set.
 * @return {boolean} Returns true if the sets are equal, false otherwise.
 */
Set.prototype.isEqual = function (otherSet) {
    if (!Set.isSet(otherSet)) {
        throw new TypeError("Set.isEqual(): wrong parameter type.");
    }
    if (this.size !== otherSet.size) {
        return false;
    }

    for (var i = 0; i < this._data.length; i++) {
        if (!otherSet.has(this._data[i])) {
            return false;
        }
    };

    return true;
};
