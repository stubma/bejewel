GameFramework.resources.PIEmitter = function GameFramework_resources_PIEmitter() {};
GameFramework.resources.PIEmitter.prototype = {
    mName: null,
    mValues: null,
    mParticleDefVector: null,
    mKeepInOrder: null,
    mOldestInFront: null,
    mIsSuperEmitter: null,
    mCurWeight: 0,
    mCurSpin: 0,
    mCurMotionRand: 0,
    Dispose: function GameFramework_resources_PIEmitter$Dispose() {},
};
GameFramework.resources.PIEmitter.staticInit = function GameFramework_resources_PIEmitter$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIEmitter.registerClass(
        "GameFramework.resources.PIEmitter",
        null,
        GameFramework.IExplicitDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PIEmitter.staticInit();
});
GameFramework.resources.PIEmitter.Value = {};
GameFramework.resources.PIEmitter.Value.staticInit = function GameFramework_resources_PIEmitter_Value$staticInit() {
    GameFramework.resources.PIEmitter.Value.F_LIFE = 0;
    GameFramework.resources.PIEmitter.Value.F_NUMBER = 1;
    GameFramework.resources.PIEmitter.Value.F_VELOCITY = 2;
    GameFramework.resources.PIEmitter.Value.F_WEIGHT = 3;
    GameFramework.resources.PIEmitter.Value.F_SPIN = 4;
    GameFramework.resources.PIEmitter.Value.F_MOTION_RAND = 5;
    GameFramework.resources.PIEmitter.Value.F_BOUNCE = 6;
    GameFramework.resources.PIEmitter.Value.F_ZOOM = 7;
    GameFramework.resources.PIEmitter.Value.LIFE = 8;
    GameFramework.resources.PIEmitter.Value.NUMBER = 9;
    GameFramework.resources.PIEmitter.Value.SIZE_X = 10;
    GameFramework.resources.PIEmitter.Value.SIZE_Y = 11;
    GameFramework.resources.PIEmitter.Value.VELOCITY = 12;
    GameFramework.resources.PIEmitter.Value.WEIGHT = 13;
    GameFramework.resources.PIEmitter.Value.SPIN = 14;
    GameFramework.resources.PIEmitter.Value.MOTION_RAND = 15;
    GameFramework.resources.PIEmitter.Value.BOUNCE = 16;
    GameFramework.resources.PIEmitter.Value.ZOOM = 17;
    GameFramework.resources.PIEmitter.Value.VISIBILITY = 18;
    GameFramework.resources.PIEmitter.Value.UNKNOWN3 = 19;
    GameFramework.resources.PIEmitter.Value.TINT_STRENGTH = 20;
    GameFramework.resources.PIEmitter.Value.EMISSION_ANGLE = 21;
    GameFramework.resources.PIEmitter.Value.EMISSION_RANGE = 22;
    GameFramework.resources.PIEmitter.Value.F_LIFE_VARIATION = 23;
    GameFramework.resources.PIEmitter.Value.F_NUMBER_VARIATION = 24;
    GameFramework.resources.PIEmitter.Value.F_SIZE_X_VARIATION = 25;
    GameFramework.resources.PIEmitter.Value.F_SIZE_Y_VARIATION = 26;
    GameFramework.resources.PIEmitter.Value.F_VELOCITY_VARIATION = 27;
    GameFramework.resources.PIEmitter.Value.F_WEIGHT_VARIATION = 28;
    GameFramework.resources.PIEmitter.Value.F_SPIN_VARIATION = 29;
    GameFramework.resources.PIEmitter.Value.F_MOTION_RAND_VARIATION = 30;
    GameFramework.resources.PIEmitter.Value.F_BOUNCE_VARIATION = 31;
    GameFramework.resources.PIEmitter.Value.F_ZOOM_VARIATION = 32;
    GameFramework.resources.PIEmitter.Value.F_NUMBER_OVER_LIFE = 33;
    GameFramework.resources.PIEmitter.Value.F_SIZE_X_OVER_LIFE = 34;
    GameFramework.resources.PIEmitter.Value.F_SIZE_Y_OVER_LIFE = 35;
    GameFramework.resources.PIEmitter.Value.F_VELOCITY_OVER_LIFE = 36;
    GameFramework.resources.PIEmitter.Value.F_WEIGHT_OVER_LIFE = 37;
    GameFramework.resources.PIEmitter.Value.F_SPIN_OVER_LIFE = 38;
    GameFramework.resources.PIEmitter.Value.F_MOTION_RAND_OVER_LIFE = 39;
    GameFramework.resources.PIEmitter.Value.F_BOUNCE_OVER_LIFE = 40;
    GameFramework.resources.PIEmitter.Value.F_ZOOM_OVER_LIFE = 41;
    GameFramework.resources.PIEmitter.Value.__COUNT = 42;
};
JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIEmitter.Value.staticInit();
});
