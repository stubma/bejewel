GameFramework.resources.JSRenderEffectPass = function GameFramework_resources_JSRenderEffectPass() {
}
GameFramework.resources.JSRenderEffectPass.prototype = {
	mGLProgram : null
}
GameFramework.resources.JSRenderEffectPass.staticInit = function GameFramework_resources_JSRenderEffectPass$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.JSRenderEffectPass.registerClass('GameFramework.resources.JSRenderEffectPass', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.JSRenderEffectPass.staticInit();
});