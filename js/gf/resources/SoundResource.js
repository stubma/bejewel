GameFramework.resources.SoundResource = function GameFramework_resources_SoundResource() {};
GameFramework.resources.SoundResource.prototype = {
    mNumSamples: 0,
};
GameFramework.resources.SoundResource.staticInit = function GameFramework_resources_SoundResource$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.SoundResource.registerClass("GameFramework.resources.SoundResource", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.SoundResource.staticInit();
});
