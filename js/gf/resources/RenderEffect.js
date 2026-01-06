GameFramework.resources.RenderEffect = function GameFramework_resources_RenderEffect() {};
GameFramework.resources.RenderEffect.prototype = {
    SetVector: function GameFramework_resources_RenderEffect$SetVector(theName, theVector) {},
    SetFloatArray: function GameFramework_resources_RenderEffect$SetFloatArray(theName, theVector) {},
    SetFloat: function GameFramework_resources_RenderEffect$SetFloat(theName, theValue) {},
    SetMatrix: function GameFramework_resources_RenderEffect$SetMatrix(theName, theMatrix) {},
    Begin: function GameFramework_resources_RenderEffect$Begin(g3D, theTechnique) {
        if (theTechnique === undefined) {
            theTechnique = null;
        }
        return null;
    },
    End: function GameFramework_resources_RenderEffect$End(theRenderEffectHandle) {},
    BeginPass: function GameFramework_resources_RenderEffect$BeginPass(theRenderEffectHandle, thePass) {},
    EndPass: function GameFramework_resources_RenderEffect$EndPass(theRenderEffectHandle, thePass) {},
    PassUsesVertexShader: function GameFramework_resources_RenderEffect$PassUsesVertexShader(inPass) {
        return false;
    },
    PassUsesPixelShader: function GameFramework_resources_RenderEffect$PassUsesPixelShader(inPass) {
        return false;
    },
};
GameFramework.resources.RenderEffect.staticInit = function GameFramework_resources_RenderEffect$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.RenderEffect.registerClass("GameFramework.resources.RenderEffect", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.RenderEffect.staticInit();
});
