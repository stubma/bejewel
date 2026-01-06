GameFramework.resources.PIInterpolatorPoint = function GameFramework_resources_PIInterpolatorPoint() {};
GameFramework.resources.PIInterpolatorPoint.prototype = {
    mValue: 0,
    mTime: 0,
    Dispose: function GameFramework_resources_PIInterpolatorPoint$Dispose() {},
};
GameFramework.resources.PIInterpolatorPoint.staticInit =
    function GameFramework_resources_PIInterpolatorPoint$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIInterpolatorPoint.registerClass(
        "GameFramework.resources.PIInterpolatorPoint",
        null,
        GameFramework.IExplicitDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PIInterpolatorPoint.staticInit();
});
