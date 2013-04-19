GameFramework.resources.RenderEffectPass = function GameFramework_resources_RenderEffectPass(theRenderEffectHandle, thePassNum) {
	this.mRenderEffectHandle = theRenderEffectHandle;
	this.mPassNum = thePassNum;
}
GameFramework.resources.RenderEffectPass.prototype = {
	mRenderEffectHandle : null,
	mPassNum : 0,
	Dispose : function GameFramework_resources_RenderEffectPass$Dispose() {
		this.mRenderEffectHandle.EndPass(this.mPassNum);
	}
}
GameFramework.resources.RenderEffectPass.staticInit = function GameFramework_resources_RenderEffectPass$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.RenderEffectPass.registerClass('GameFramework.resources.RenderEffectPass', null, System.IDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.RenderEffectPass.staticInit();
});