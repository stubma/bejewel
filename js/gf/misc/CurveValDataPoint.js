GameFramework.misc.CurveValDataPoint = function GameFramework_misc_CurveValDataPoint() {};
GameFramework.misc.CurveValDataPoint.prototype = {
    mX: 0,
    mY: 0,
    mAngleDeg: 0,
};
GameFramework.misc.CurveValDataPoint.staticInit = function GameFramework_misc_CurveValDataPoint$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.misc.CurveValDataPoint.registerClass("GameFramework.misc.CurveValDataPoint", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.misc.CurveValDataPoint.staticInit();
});
