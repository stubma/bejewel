GameFramework.resources.JSSoundResource = function GameFramework_resources_JSSoundResource() {
    GameFramework.resources.JSSoundResource.initializeBase(this);
};
GameFramework.resources.JSSoundResource.prototype = {
    mHTML5Audio: null,
};
GameFramework.resources.JSSoundResource.staticInit = function GameFramework_resources_JSSoundResource$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.JSSoundResource.registerClass(
        "GameFramework.resources.JSSoundResource",
        GameFramework.resources.SoundResource
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.JSSoundResource.staticInit();
});
