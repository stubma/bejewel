GameFramework.resources.JSRenderEffectTechnique = function GameFramework_resources_JSRenderEffectTechnique() {
    this.mPasses = [];
};
GameFramework.resources.JSRenderEffectTechnique.prototype = {
    mPasses: null,
};
GameFramework.resources.JSRenderEffectTechnique.staticInit =
    function GameFramework_resources_JSRenderEffectTechnique$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.JSRenderEffectTechnique.registerClass(
        "GameFramework.resources.JSRenderEffectTechnique",
        null
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.JSRenderEffectTechnique.staticInit();
});
