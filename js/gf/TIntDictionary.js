GameFramework.TIntDictionary = function GameFramework_TIntDictionary() {
	this.mHashtable = {};
}
GameFramework.TIntDictionary.prototype = {
	mHashtable : null,
	get_Item : function GameFramework_TIntDictionary$get_Item(key) {
		return this.mHashtable[key];
	},
	set_Item : function GameFramework_TIntDictionary$set_Item(key, value) {
		this.mHashtable[key] = value;
	},
	InternalGet : function GameFramework_TIntDictionary$InternalGet(key) {
		return this.mHashtable[(key | 0)];
	},
	Remove : function GameFramework_TIntDictionary$Remove(theKey) {
		delete this.mHashtable[theKey];
	},
	containsKey : function GameFramework_TIntDictionary$containsKey(theKey) {
		return this.mHashtable.hasOwnProperty(theKey);
	},
	get_Keys : function GameFramework_TIntDictionary$get_Keys() {
		return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), true);
	},
	get_Values : function GameFramework_TIntDictionary$get_Values() {
		return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), false);
	},
	GetEnumerator : function GameFramework_TIntDictionary$GetEnumerator() {
		return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), false);
	}
}
GameFramework.TIntDictionary.staticInit = function GameFramework_TIntDictionary$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.TIntDictionary.registerClass('GameFramework.TIntDictionary', null, GameFramework.misc.ISimpleDictionary);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.TIntDictionary.staticInit();
});