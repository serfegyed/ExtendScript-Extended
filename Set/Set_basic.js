/**
 * Core Set implementation for ExtendScript.
 *
 * @external sameValueZero()
 */
function Set(elements) {
    var i;

    if (!(this instanceof Set)) {
        throw new TypeError("Constructor Set requires 'new'.");
    }

    this._data = [];
    this._records = [];
    this.size = 0;

    if (elements instanceof Array) {
        for (i = 0; i < elements.length; i++) this.add(elements[i]);
    } else if (elements instanceof Set) {
        for (i = 0; i < elements._data.length; i++) this.add(elements._data[i]);
    }
}

Set.prototype.indexOf = function (value) {
    for (var i = 0; i < this._data.length; i++) {
        if (sameValueZero(value, this._data[i])) return i;
    }
    return -1;
};

Set.prototype.add = function (value) {
    if (this.indexOf(value) === -1) {
        this._data.push(value);
        this._records.push({value: value, active: true});
        this.size = this._data.length;
    }
    return this;
};

Set.prototype.has = function (value) {
    return this.indexOf(value) !== -1;
};

Set.prototype.delete = function (value) {
    var index = this.indexOf(value);
    var i;

    if (index === -1) return false;

    this._data.splice(index, 1);
    for (i = 0; i < this._records.length; i++) {
        if (this._records[i].active &&
                sameValueZero(this._records[i].value, value)) {
            this._records[i].active = false;
            break;
        }
    }
    this.size = this._data.length;
    return true;
};
