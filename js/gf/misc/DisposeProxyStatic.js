GameFramework.misc.DisposeProxyStatic = function GameFramework_misc_DisposeProxyStatic(theProxyCall) {
	this.mProxyCall = theProxyCall;
}
GameFramework.misc.DisposeProxyStatic.prototype = {
	mProxyCall : null,
	Dispose : function GameFramework_misc_DisposeProxyStatic$Dispose() {
		this.mProxyCall.invoke();
	}
}
GameFramework.misc.DisposeProxyStatic.staticInit = function GameFramework_misc_DisposeProxyStatic$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.misc.DisposeProxyStatic.registerClass('GameFramework.misc.DisposeProxyStatic', null, GameFramework.IStaticDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.misc.DisposeProxyStatic.staticInit();
});