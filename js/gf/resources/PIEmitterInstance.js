GameFramework.resources.PIEmitterInstance = function GameFramework_resources_PIEmitterInstance() {
    this.mSuperEmitterGroup = new GameFramework.resources.PIParticleGroup();
    this.mTransform = new GameFramework.geom.Matrix();
    this.mOffset = new GameFramework.geom.TPoint();
    GameFramework.resources.PIEmitterInstance.initializeBase(this);
    this.mWasActive = false;
    this.mWithinLifeFrame = true;
    this.mSuperEmitterGroup.mIsSuperEmitter = true;
    this.mNumberScale = 1.0;
    this.mVisible = true;
};
GameFramework.resources.PIEmitterInstance.prototype = {
    mEmitterInstanceDef: null,
    mWasActive: null,
    mWithinLifeFrame: null,
    mSuperEmitterParticleDefInstanceVector: null,
    mSuperEmitterGroup: null,
    mTintColorI: 0,
    mTransformSimple: null,
    mTintColor: 0,
    mMaskImage: null,
    mTransform: null,
    mOffset: null,
    mNumberScale: 0,
    mVisible: null,
    SetVisible: function GameFramework_resources_PIEmitterInstance$SetVisible(isVisible) {
        this.mVisible = isVisible;
    },
    Dispose: function GameFramework_resources_PIEmitterInstance$Dispose() {
        this.mSuperEmitterGroup.Dispose();
        GameFramework.resources.PIEmitterBase.prototype.Dispose.apply(this);
    },
};
GameFramework.resources.PIEmitterInstance.staticInit =
    function GameFramework_resources_PIEmitterInstance$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIEmitterInstance.registerClass(
        "GameFramework.resources.PIEmitterInstance",
        GameFramework.resources.PIEmitterBase
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PIEmitterInstance.staticInit();
});
