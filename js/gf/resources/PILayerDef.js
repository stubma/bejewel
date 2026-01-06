GameFramework.resources.PILayerDef = function GameFramework_resources_PILayerDef() {
    this.mOrigOffset = new GameFramework.geom.TPoint();
};
GameFramework.resources.PILayerDef.prototype = {
    mName: null,
    mEmitterInstanceDefVector: null,
    mDeflectorVector: null,
    mBlockerVector: null,
    mForceVector: null,
    mOffset: null,
    mOrigOffset: null,
    mAngle: null,
    Dispose: function GameFramework_resources_PILayerDef$Dispose() {},
};
GameFramework.resources.PILayerDef.staticInit = function GameFramework_resources_PILayerDef$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PILayerDef.registerClass(
        "GameFramework.resources.PILayerDef",
        null,
        GameFramework.IExplicitDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PILayerDef.staticInit();
});
