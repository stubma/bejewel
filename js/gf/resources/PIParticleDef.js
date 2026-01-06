GameFramework.resources.PIParticleDef = function GameFramework_resources_PIParticleDef() {};
GameFramework.resources.PIParticleDef.prototype = {
    mLifeValueTable: null,
    mParent: null,
    mName: null,
    mTextureIdx: 0,
    mTextureChunkVector: null,
    mValues: null,
    mRefPointOfs: null,
    mLockAspect: null,
    mIntense: null,
    mSingleParticle: null,
    mPreserveColor: null,
    mAttachToEmitter: null,
    mAnimSpeed: 0,
    mAnimStartOnRandomFrame: null,
    mAttachVal: 0,
    mFlipHorz: null,
    mFlipVert: null,
    mRepeatColor: 0,
    mRepeatAlpha: 0,
    mRandomGradientColor: null,
    mUseNextColorKey: null,
    mGetColorFromLayer: null,
    mUpdateColorFromLayer: null,
    mGetTransparencyFromLayer: null,
    mUpdateTransparencyFromLayer: null,
    mNumberOfEachColor: 0,
    mLinkTransparencyToColor: null,
    mUseKeyColorsOnly: null,
    mUseEmitterAngleAndRange: null,
    mAngleAlignToMotion: null,
    mAngleKeepAlignedToMotion: null,
    mAngleRandomAlign: null,
    mAngleAlignOffset: 0,
    mAngleValue: 0,
    mAngleRange: 0,
    mAngleOffset: 0,
    mCalcParticleTransformWantsBaseRotTrans: null,
    mColor: null,
    mAlpha: null,
    Dispose: function GameFramework_resources_PIParticleDef$Dispose() {},
};
GameFramework.resources.PIParticleDef.staticInit = function GameFramework_resources_PIParticleDef$staticInit() {
    GameFramework.resources.PIParticleDef.mPILifeValueTableMap = {};
};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIParticleDef.registerClass(
        "GameFramework.resources.PIParticleDef",
        null,
        GameFramework.IExplicitDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PIParticleDef.staticInit();
});
GameFramework.resources.PIParticleDef.Value = {};
GameFramework.resources.PIParticleDef.Value.staticInit =
    function GameFramework_resources_PIParticleDef_Value$staticInit() {
        GameFramework.resources.PIParticleDef.Value.LIFE = 0;
        GameFramework.resources.PIParticleDef.Value.NUMBER = 1;
        GameFramework.resources.PIParticleDef.Value.SIZE_X = 2;
        GameFramework.resources.PIParticleDef.Value.VELOCITY = 3;
        GameFramework.resources.PIParticleDef.Value.WEIGHT = 4;
        GameFramework.resources.PIParticleDef.Value.SPIN = 5;
        GameFramework.resources.PIParticleDef.Value.MOTION_RAND = 6;
        GameFramework.resources.PIParticleDef.Value.BOUNCE = 7;
        GameFramework.resources.PIParticleDef.Value.LIFE_VARIATION = 8;
        GameFramework.resources.PIParticleDef.Value.NUMBER_VARIATION = 9;
        GameFramework.resources.PIParticleDef.Value.SIZE_X_VARIATION = 10;
        GameFramework.resources.PIParticleDef.Value.VELOCITY_VARIATION = 11;
        GameFramework.resources.PIParticleDef.Value.WEIGHT_VARIATION = 12;
        GameFramework.resources.PIParticleDef.Value.SPIN_VARIATION = 13;
        GameFramework.resources.PIParticleDef.Value.MOTION_RAND_VARIATION = 14;
        GameFramework.resources.PIParticleDef.Value.BOUNCE_VARIATION = 15;
        GameFramework.resources.PIParticleDef.Value.SIZE_X_OVER_LIFE = 16;
        GameFramework.resources.PIParticleDef.Value.VELOCITY_OVER_LIFE = 17;
        GameFramework.resources.PIParticleDef.Value.WEIGHT_OVER_LIFE = 18;
        GameFramework.resources.PIParticleDef.Value.SPIN_OVER_LIFE = 19;
        GameFramework.resources.PIParticleDef.Value.MOTION_RAND_OVER_LIFE = 20;
        GameFramework.resources.PIParticleDef.Value.BOUNCE_OVER_LIFE = 21;
        GameFramework.resources.PIParticleDef.Value.VISIBILITY = 22;
        GameFramework.resources.PIParticleDef.Value.EMISSION_ANGLE = 23;
        GameFramework.resources.PIParticleDef.Value.EMISSION_RANGE = 24;
        GameFramework.resources.PIParticleDef.Value.SIZE_Y = 25;
        GameFramework.resources.PIParticleDef.Value.SIZE_Y_VARIATION = 26;
        GameFramework.resources.PIParticleDef.Value.SIZE_Y_OVER_LIFE = 27;
        GameFramework.resources.PIParticleDef.Value.__COUNT = 28;
    };
JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIParticleDef.Value.staticInit();
});
