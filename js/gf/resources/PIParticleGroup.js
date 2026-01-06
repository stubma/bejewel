GameFramework.resources.PIParticleGroup = function GameFramework_resources_PIParticleGroup() {
    this.mIsSuperEmitter = false;
    this.mWasEmitted = false;
    this.mHead = null;
    this.mTail = null;
    this.mCount = 0;
    this.mHasColorSampling = false;
    this.mHasVelocityEffectors = false;
    this.mHasAlignToMotion = false;
    this.mHasIntense = false;
    this.mHasPreserveColor = false;
    this.mHasSingleParticles = false;
    this.mHasAttachToEmitters = false;
    this.mHasImageCycle = false;
    this.mHasDeferredUpdate = false;
};
GameFramework.resources.PIParticleGroup.prototype = {
    mHead: null,
    mTail: null,
    mCount: 0,
    mIsSuperEmitter: null,
    mWasEmitted: null,
    mHasColorSampling: null,
    mHasVelocityEffectors: null,
    mHasAlignToMotion: null,
    mHasIntense: null,
    mHasPreserveColor: null,
    mHasSingleParticles: null,
    mHasAttachToEmitters: null,
    mHasImageCycle: null,
    mHasDeferredUpdate: null,
    Dispose: function GameFramework_resources_PIParticleGroup$Dispose() {},
};
GameFramework.resources.PIParticleGroup.staticInit = function GameFramework_resources_PIParticleGroup$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIParticleGroup.registerClass(
        "GameFramework.resources.PIParticleGroup",
        null,
        GameFramework.IExplicitDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PIParticleGroup.staticInit();
});
