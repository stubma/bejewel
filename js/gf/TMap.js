GameFramework.TMap = function GameFramework_TMap() {
    this.mHashtable = new System.Collections.Generic.Dictionary();
};
GameFramework.TMap.prototype = {
    mHashtable: null,
    get_Item: function GameFramework_TMap$get_Item(key) {
        var aValue = 0;
        this.mHashtable.TryGetValue(key, aValue);
        return aValue;
    },
    set_Item: function GameFramework_TMap$set_Item(key, value) {
        this.mHashtable[key] = value;
    },
    InternalGet: function GameFramework_TMap$InternalGet(key) {
        return this.mHashtable[key];
    },
    Remove: function GameFramework_TMap$Remove(theKey) {
        this.mHashtable.Remove(theKey);
    },
    ContainsKey: function GameFramework_TMap$ContainsKey(theKey) {
        return this.mHashtable.ContainsKey(theKey);
    },
    get_Keys: function GameFramework_TMap$get_Keys() {
        return new GameFramework.TMapEnumerator(this.mHashtable.GetEnumerator(), true);
    },
    get_Values: function GameFramework_TMap$get_Values() {
        return new GameFramework.TMapEnumerator(this.mHashtable.GetEnumerator(), false);
    },
    GetEnumerator: function GameFramework_TMap$GetEnumerator() {
        return new GameFramework.TMapEnumerator(this.mHashtable.GetEnumerator(), false);
    },
};
GameFramework.TMap.staticInit = function GameFramework_TMap$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.TMap.registerClass("GameFramework.TMap", null, GameFramework.misc.ISimpleDictionary);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.TMap.staticInit();
});
