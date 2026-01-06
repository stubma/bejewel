///////////////////////////////////////////////////////////////////////////////
// StringBuilder

/**
 * @constructor
 */
ss.StringBuilder = function StringBuilder$(s) {
    this._parts = ss.isNullOrUndefined(s) ? [] : [s];
};
ss.StringBuilder.prototype = {
    get_isEmpty: function StringBuilder$get_isEmpty() {
        return this._parts.length == 0;
    },

    append: function StringBuilder$append(s) {
        if (!ss.isNullOrUndefined(s)) {
            this._parts.add(s);
        }
        return this;
    },

    appendLine: function StringBuilder$appendLine(s) {
        this.append(s);
        this.append("\r\n");
        return this;
    },

    clear: function StringBuilder$clear() {
        this._parts.clear();
    },

    toString: function StringBuilder$toString(s) {
        return this._parts.join(s || "");
    },
};

ss.StringBuilder.registerClass("StringBuilder");
