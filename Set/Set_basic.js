/**
 * Core Set implementation for ExtendScript.
 */
function __SetSameValueZero__(x, y) {
    if (typeof x === "number" && typeof y === "number") {
        return x === y || (x !== x && y !== y);
    }
    return x === y;
}

function Set(elements) {
    var i;

    if (!(this instanceof Set)) {
        throw new TypeError("Constructor Set requires 'new'.");
    }

    this._data = [];
    this._records = [];
    this._nextId = 0;
    this.size = 0;

    if (elements instanceof Array) {
        for (i = 0; i < elements.length; i++) this.add(elements[i]);
    } else if (elements instanceof Set) {
        for (i = 0; i < elements._data.length; i++) this.add(elements._data[i]);
    }
}

Set.prototype.indexOf = function (value) {
    for (var i = 0; i < this._data.length; i++) {
        if (__SetSameValueZero__(value, this._data[i])) return i;
    }
    return -1;
};

Set.prototype.add = function (value) {
    if (value === 0) value = 0;
    if (this.indexOf(value) === -1) {
        this._data.push(value);
        this._records.push({id: this._nextId++, value: value});
        this.size = this._data.length;
    }
    return this;
};

Set.prototype.has = function (value) {
    return this.indexOf(value) !== -1;
};

Set.prototype.delete = function (value) {
    var index = this.indexOf(value);

    if (index === -1) return false;

    this._data.splice(index, 1);
    this._records.splice(index, 1);
    this.size = this._data.length;
    return true;
};
