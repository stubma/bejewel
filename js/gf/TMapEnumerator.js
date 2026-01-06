GameFramework.TMapEnumerator = function GameFramework_TMapEnumerator(theEnumerator, keys) {
    this.mEnumerator = theEnumerator;
    this.mKeys = keys;
};
GameFramework.TMapEnumerator.prototype = {
    mEnumerator: null,
    mKeys: false,
    get_Current: function GameFramework_TMapEnumerator$get_Current() {
        if (this.mKeys) {
            return this.mEnumerator.get_Current().get_Key();
        } else {
            return this.mEnumerator.get_Current().get_Value();
        }
    },
    MoveNext: function GameFramework_TMapEnumerator$MoveNext() {
        return this.mEnumerator.MoveNext();
    },
    Reset: function GameFramework_TMapEnumerator$Reset() {},
    GetEnumerator: function GameFramework_TMapEnumerator$GetEnumerator() {
        return this;
    },
};
GameFramework.TMapEnumerator.staticInit = function GameFramework_TMapEnumerator$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.TMapEnumerator.registerClass("GameFramework.TMapEnumerator", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.TMapEnumerator.staticInit();
});
