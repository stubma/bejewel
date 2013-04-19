GameFramework.TMapValueEnumerator = function GameFramework_TMapValueEnumerator(theEnumerator) {
	this.mEnumerator = theEnumerator;
}
GameFramework.TMapValueEnumerator.prototype = {
	mEnumerator : null,
	Dispose : function GameFramework_TMapValueEnumerator$Dispose() {
	},
	get_Current : function GameFramework_TMapValueEnumerator$get_Current() {
		return (this.mEnumerator.get_Current()).get_Value();
	},
	get_CurrentTyped : function GameFramework_TMapValueEnumerator$get_CurrentTyped() {
		return (this.mEnumerator.get_Current()).get_Value();
	},
	MoveNext : function GameFramework_TMapValueEnumerator$MoveNext() {
		return this.mEnumerator.MoveNext();
	},
	Reset : function GameFramework_TMapValueEnumerator$Reset() {
		this.mEnumerator.Reset();
	},
	GetEnumerator : function GameFramework_TMapValueEnumerator$GetEnumerator() {
		return this;
	}
}
GameFramework.TMapValueEnumerator.staticInit = function GameFramework_TMapValueEnumerator$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.TMapValueEnumerator.registerClass('GameFramework.TMapValueEnumerator', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.TMapValueEnumerator.staticInit();
});