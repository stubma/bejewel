GameFramework.resources.PIBlocker = function GameFramework_resources_PIBlocker() {};
GameFramework.resources.PIBlocker.prototype = {
    mName: null,
    mUseLayersBelowForBg: null,
    mPos: null,
    mActive: null,
    mAngle: null,
    mPoints: null,
};
GameFramework.resources.PIBlocker.staticInit = function GameFramework_resources_PIBlocker$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIBlocker.registerClass("GameFramework.resources.PIBlocker", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PIBlocker.staticInit();
});
