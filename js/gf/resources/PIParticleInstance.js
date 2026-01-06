GameFramework.resources.PIParticleInstance = function GameFramework_resources_PIParticleInstance() {
    this.mVariationValues = Array.Create(GameFramework.resources.PIParticleInstance.Variation.__COUNT | 0, null);
    this.mTransform = new GameFramework.geom.Matrix();
    this.mPrev = null;
    this.mNext = null;
    this.mTransformScaleFactor = 1.0;
    this.mImgIdx = 0;
    this.mBkgColor = 0xffffffff;
    this.mSrcSizeXMult = 1.0;
    this.mSrcSizeYMult = 1.0;
    this.mParentFreeEmitter = null;
    this.mHasDrawn = false;
};
GameFramework.resources.PIParticleInstance.prototype = {
    mNext: null,
    mParticleDef: null,
    mParticleDefInstance: null,
    mPos: null,
    mVel: null,
    mImgAngle: 0,
    mImgIdx: 0,
    mLifePctInt: 0,
    mLifePctIntInc: 0,
    mVariationValues: null,
    mColorMask: 0,
    mColorOr: 0,
    mTicks: 0,
    mLife: 0,
    mLifePct: 0,
    mLifePctInc: 0,
    mLifeValueDeltaIdx: 0,
    mEmitterSrc: null,
    mNum: 0,
    mPrev: null,
    mParentFreeEmitter: null,
    mOrigPos: null,
    mEmittedPos: null,
    mLastEmitterPos: null,
    mZoom: 0,
    mSrcSizeXMult: 0,
    mSrcSizeYMult: 0,
    mGradientRand: 0,
    mOrigEmitterAng: 0,
    mAnimFrameRand: 0,
    mTransform: null,
    mTextureChunk: null,
    mTransformScaleFactor: 0,
    mThicknessHitVariation: 0,
    mHasDrawn: null,
    mBkgColor: 0,
    mImage: null,
    mSrcRect: null,
    Dispose: function GameFramework_resources_PIParticleInstance$Dispose() {},
};
GameFramework.resources.PIParticleInstance.staticInit =
    function GameFramework_resources_PIParticleInstance$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIParticleInstance.registerClass(
        "GameFramework.resources.PIParticleInstance",
        null,
        GameFramework.IExplicitDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PIParticleInstance.staticInit();
});
GameFramework.resources.PIParticleInstance.Variation = {};
GameFramework.resources.PIParticleInstance.Variation.staticInit =
    function GameFramework_resources_PIParticleInstance_Variation$staticInit() {
        GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND = 0;
        GameFramework.resources.PIParticleInstance.Variation.VELOCITY = 1;
        GameFramework.resources.PIParticleInstance.Variation.WEIGHT = 2;
        GameFramework.resources.PIParticleInstance.Variation.SPIN = 3;
        GameFramework.resources.PIParticleInstance.Variation.SIZE_X = 4;
        GameFramework.resources.PIParticleInstance.Variation.SIZE_Y = 5;
        GameFramework.resources.PIParticleInstance.Variation.BOUNCE = 6;
        GameFramework.resources.PIParticleInstance.Variation.LIFE = 7;
        GameFramework.resources.PIParticleInstance.Variation.ZOOM = 8;
        GameFramework.resources.PIParticleInstance.Variation.__COUNT = 9;
    };
JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIParticleInstance.Variation.staticInit();
});
