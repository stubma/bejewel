GameFramework.TIntMap = function GameFramework_TIntMap() {
    this.mHashtable = new System.Collections.Generic.Dictionary();
};
GameFramework.TIntMap.prototype = {
    mHashtable: null,
    get_Item: function GameFramework_TIntMap$get_Item(key) {
        var aValue = 0;
        this.mHashtable.TryGetValue(key, aValue);
        return aValue;
    },
    set_Item: function GameFramework_TIntMap$set_Item(key, value) {
        this.mHashtable[key] = value;
    },
    InternalGet: function GameFramework_TIntMap$InternalGet(key) {
        return this.mHashtable[key | 0];
    },
    Remove: function GameFramework_TIntMap$Remove(theKey) {
        this.mHashtable.Remove(theKey);
    },
    ContainsKey: function GameFramework_TIntMap$ContainsKey(theKey) {
        return this.mHashtable.ContainsKey(theKey);
    },
    get_Keys: function GameFramework_TIntMap$get_Keys() {
        return new GameFramework.TMapKeyEnumerator(this.mHashtable.GetEnumerator());
    },
    get_Values: function GameFramework_TIntMap$get_Values() {
        return new GameFramework.TMapValueEnumerator(this.mHashtable.GetEnumerator());
    },
    GetEnumerator: function GameFramework_TIntMap$GetEnumerator() {
        return new GameFramework.TMapValueEnumerator(this.mHashtable.GetEnumerator());
    },
};
GameFramework.TIntMap.staticInit = function GameFramework_TIntMap$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.TIntMap.registerClass("GameFramework.TIntMap", null, GameFramework.misc.ISimpleDictionary);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.TIntMap.staticInit();
});
