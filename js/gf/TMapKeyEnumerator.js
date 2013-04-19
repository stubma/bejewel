GameFramework.TMapKeyEnumerator = function GameFramework_TMapKeyEnumerator(theEnumerator) {
	this.mEnumerator = theEnumerator;
}
GameFramework.TMapKeyEnumerator.prototype = {
	mEnumerator : null,
	Dispose : function GameFramework_TMapKeyEnumerator$Dispose() {
	},
	get_Current : function GameFramework_TMapKeyEnumerator$get_Current() {
		return (this.mEnumerator.get_Current()).get_Key();
	},
	MoveNext : function GameFramework_TMapKeyEnumerator$MoveNext() {
		return this.mEnumerator.MoveNext();
	},
	Reset : function GameFramework_TMapKeyEnumerator$Reset() {
		this.mEnumerator.Reset();
	},
	GetEnumerator : function GameFramework_TMapKeyEnumerator$GetEnumerator() {
		return this;
	}
}
GameFramework.TMapKeyEnumerator.staticInit = function GameFramework_TMapKeyEnumerator$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.TMapKeyEnumerator.registerClass('GameFramework.TMapKeyEnumerator', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.TMapKeyEnumerator.staticInit();
});