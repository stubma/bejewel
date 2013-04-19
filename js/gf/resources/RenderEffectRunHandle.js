GameFramework.resources.RenderEffectRunHandle = function GameFramework_resources_RenderEffectRunHandle(theRenderEffect) {
	this.mRenderEffect = theRenderEffect;
}
GameFramework.resources.RenderEffectRunHandle.prototype = {
	mRenderEffect : null,
	get_NumPasses : function GameFramework_resources_RenderEffectRunHandle$get_NumPasses() {
		return 0;
	},
	Dispose : function GameFramework_resources_RenderEffectRunHandle$Dispose() {
		this.mRenderEffect.End(this);
	},
	BeginPass : function GameFramework_resources_RenderEffectRunHandle$BeginPass(thePass) {
		var aRenderEffectPass = new GameFramework.resources.RenderEffectPass(this, thePass);
		this.mRenderEffect.BeginPass(this, thePass);
		return aRenderEffectPass;
	},
	EndPass : function GameFramework_resources_RenderEffectRunHandle$EndPass(thePass) {
		this.mRenderEffect.EndPass(this, thePass);
	}
}
GameFramework.resources.RenderEffectRunHandle.staticInit = function GameFramework_resources_RenderEffectRunHandle$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.RenderEffectRunHandle.registerClass('GameFramework.resources.RenderEffectRunHandle', null, System.IDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.RenderEffectRunHandle.staticInit();
});