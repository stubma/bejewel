GameFramework.resources.PIParticleDefInstance = function GameFramework_resources_PIParticleDefInstance() {
    this.Reset();
};
GameFramework.resources.PIParticleDefInstance.prototype = {
    mNumberAcc: 0,
    mCurNumberVariation: 0,
    mParticlesEmitted: 0,
    mTicks: 0,
    mAlphaI: 0,
    mCurWeight: 0,
    mCurSpin: 0,
    mCurMotionRand: 0,
    Reset: function GameFramework_resources_PIParticleDefInstance$Reset() {
        this.mNumberAcc = 0;
        this.mCurNumberVariation = 0;
        this.mParticlesEmitted = 0;
        this.mTicks = 0;
    },
    Dispose: function GameFramework_resources_PIParticleDefInstance$Dispose() {},
};
GameFramework.resources.PIParticleDefInstance.staticInit =
    function GameFramework_resources_PIParticleDefInstance$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIParticleDefInstance.registerClass(
        "GameFramework.resources.PIParticleDefInstance",
        null,
        GameFramework.IExplicitDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PIParticleDefInstance.staticInit();
});
