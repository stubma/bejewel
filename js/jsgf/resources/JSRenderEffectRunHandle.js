GameFramework.resources.JSRenderEffectRunHandle = function GameFramework_resources_JSRenderEffectRunHandle(
    theRenderEffect
) {
    GameFramework.resources.JSRenderEffectRunHandle.initializeBase(this, [theRenderEffect]);
};
GameFramework.resources.JSRenderEffectRunHandle.prototype = {
    mTechnique: null,
    get_NumPasses: function GameFramework_resources_JSRenderEffectRunHandle$get_NumPasses() {
        return this.mTechnique.mPasses.length;
    },
};
GameFramework.resources.JSRenderEffectRunHandle.staticInit =
    function GameFramework_resources_JSRenderEffectRunHandle$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.JSRenderEffectRunHandle.registerClass(
        "GameFramework.resources.JSRenderEffectRunHandle",
        GameFramework.resources.RenderEffectRunHandle
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.JSRenderEffectRunHandle.staticInit();
});
