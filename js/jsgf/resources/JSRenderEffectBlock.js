GameFramework.resources.JSRenderEffectBlock = function GameFramework_resources_JSRenderEffectBlock(theCount, theOffset, theSize) {
	this.mCount = theCount;
	this.mOffset = theOffset;
	this.mSize = theSize;
}
GameFramework.resources.JSRenderEffectBlock.prototype = {
	mCount : 0,
	mOffset : 0,
	mSize : 0
}
GameFramework.resources.JSRenderEffectBlock.staticInit = function GameFramework_resources_JSRenderEffectBlock$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.JSRenderEffectBlock.registerClass('GameFramework.resources.JSRenderEffectBlock', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.JSRenderEffectBlock.staticInit();
});