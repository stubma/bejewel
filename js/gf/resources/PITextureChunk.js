GameFramework.resources.PITextureChunk = function GameFramework_resources_PITextureChunk() {};
GameFramework.resources.PITextureChunk.prototype = {
    mSrcTexture: null,
    mImage: null,
    mCel: 0,
    mScaleXFactor: 0,
    mScaleYFactor: 0,
    mRefOfsX: 0,
    mRefOfsY: 0,
    mScaleRef: 0,
    Dispose: function GameFramework_resources_PITextureChunk$Dispose() {},
};
GameFramework.resources.PITextureChunk.staticInit = function GameFramework_resources_PITextureChunk$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PITextureChunk.registerClass(
        "GameFramework.resources.PITextureChunk",
        null,
        GameFramework.IExplicitDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PITextureChunk.staticInit();
});
