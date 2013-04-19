GameFramework.misc.DisposeProxy = function GameFramework_misc_DisposeProxy(theProxyCall) {
	this.mProxyCall = theProxyCall;
}
GameFramework.misc.DisposeProxy.prototype = {
	mProxyCall : null,
	Dispose : function GameFramework_misc_DisposeProxy$Dispose() {
		this.mProxyCall.invoke();
	}
}
GameFramework.misc.DisposeProxy.staticInit = function GameFramework_misc_DisposeProxy$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.misc.DisposeProxy.registerClass('GameFramework.misc.DisposeProxy', null, System.IDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.misc.DisposeProxy.staticInit();
});