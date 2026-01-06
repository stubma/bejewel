GameFramework.resources.PIEmitterBase = function GameFramework_resources_PIEmitterBase() {
    this.mParticleGroup = new GameFramework.resources.PIParticleGroup();
};
GameFramework.resources.PIEmitterBase.prototype = {
    mParticleDefInstanceVector: null,
    mParticleGroup: null,
    Dispose: function GameFramework_resources_PIEmitterBase$Dispose() {
        this.mParticleGroup.Dispose();
    },
};
GameFramework.resources.PIEmitterBase.staticInit = function GameFramework_resources_PIEmitterBase$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIEmitterBase.registerClass(
        "GameFramework.resources.PIEmitterBase",
        null,
        GameFramework.IExplicitDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PIEmitterBase.staticInit();
});
