GameFramework.resources.PIGeomDataEx = function GameFramework_resources_PIGeomDataEx() {};
GameFramework.resources.PIGeomDataEx.prototype = {
    mTravelAngle: 0,
    isMaskedOut: null,
    Dispose: function GameFramework_resources_PIGeomDataEx$Dispose() {},
};
GameFramework.resources.PIGeomDataEx.staticInit = function GameFramework_resources_PIGeomDataEx$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIGeomDataEx.registerClass(
        "GameFramework.resources.PIGeomDataEx",
        null,
        GameFramework.IExplicitDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PIGeomDataEx.staticInit();
});
