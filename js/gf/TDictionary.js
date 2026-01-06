GameFramework.TDictionary = function GameFramework_TDictionary() {
    this.mHashtable = {};
};
GameFramework.TDictionary.prototype = {
    mHashtable: null,
    get_Item: function GameFramework_TDictionary$get_Item(key) {
        return this.mHashtable[key];
    },
    set_Item: function GameFramework_TDictionary$set_Item(key, value) {
        this.mHashtable[key] = value;
    },
    InternalGet: function GameFramework_TDictionary$InternalGet(key) {
        return this.mHashtable[key];
    },
    Remove: function GameFramework_TDictionary$Remove(theKey) {
        delete this.mHashtable[theKey];
    },
    ContainsKey: function GameFramework_TDictionary$ContainsKey(theKey) {
        return this.mHashtable.hasOwnProperty(theKey);
    },
    get_Keys: function GameFramework_TDictionary$get_Keys() {
        return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), true);
    },
    get_Values: function GameFramework_TDictionary$get_Values() {
        return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), false);
    },
    GetEnumerator: function GameFramework_TDictionary$GetEnumerator() {
        return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), false);
    },
};
GameFramework.TDictionary.staticInit = function GameFramework_TDictionary$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.TDictionary.registerClass("GameFramework.TDictionary", null, GameFramework.misc.ISimpleDictionary);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.TDictionary.staticInit();
});
