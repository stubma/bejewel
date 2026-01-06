GameFramework.TDictionaryEnumerator = function GameFramework_TDictionaryEnumerator(theEnumerator, keys) {
    this.mEnumerator = theEnumerator;
    this.mKeys = keys;
};
GameFramework.TDictionaryEnumerator.prototype = {
    mEnumerator: null,
    mKeys: false,
    get_Current: function GameFramework_TDictionaryEnumerator$get_Current() {
        if (this.mKeys) {
            return this.mEnumerator.get_Current().get_Key();
        } else {
            return this.mEnumerator.get_Current().get_Value();
        }
    },
    MoveNext: function GameFramework_TDictionaryEnumerator$MoveNext() {
        return this.mEnumerator.MoveNext();
    },
    Reset: function GameFramework_TDictionaryEnumerator$Reset() {
        this.mEnumerator.Reset();
    },
    GetEnumerator: function GameFramework_TDictionaryEnumerator$GetEnumerator() {
        return this;
    },
};
GameFramework.TDictionaryEnumerator.staticInit = function GameFramework_TDictionaryEnumerator$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.TDictionaryEnumerator.registerClass("GameFramework.TDictionaryEnumerator", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.TDictionaryEnumerator.staticInit();
});
