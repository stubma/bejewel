GameFramework.resources.PIEffectDef = function GameFramework_resources_PIEffectDef() {
	this.mCountScale = 1.0;
	this.mRefCount = 1;
}
GameFramework.resources.PIEffectDef.prototype = {
	mRefCount : 0,
	mCountScale : 0,
	mEmitterVector : null,
	mTextureVector : null,
	mLayerDefVector : null,
	mEmitterRefMap : null,
	Dispose : function GameFramework_resources_PIEffectDef$Dispose() {
	}
}
GameFramework.resources.PIEffectDef.staticInit = function GameFramework_resources_PIEffectDef$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIEffectDef.registerClass('GameFramework.resources.PIEffectDef', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PIEffectDef.staticInit();
});