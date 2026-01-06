GameFramework.resources.popanim.PopAnimParticleEffect =
    function GameFramework_resources_popanim_PopAnimParticleEffect() {};
GameFramework.resources.popanim.PopAnimParticleEffect.prototype = {
    mEffect: null,
    mName: null,
    mLastUpdated: 0,
    mBehind: null,
    mAttachEmitter: null,
    mTransform: null,
    mXOfs: 0,
    mYOfs: 0,
};
GameFramework.resources.popanim.PopAnimParticleEffect.staticInit =
    function GameFramework_resources_popanim_PopAnimParticleEffect$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.popanim.PopAnimParticleEffect.registerClass(
        "GameFramework.resources.popanim.PopAnimParticleEffect",
        null
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.popanim.PopAnimParticleEffect.staticInit();
});
