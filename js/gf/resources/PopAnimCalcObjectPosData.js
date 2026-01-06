GameFramework.resources.PopAnimCalcObjectPosData = function GameFramework_resources_PopAnimCalcObjectPosData() {};
GameFramework.resources.PopAnimCalcObjectPosData.prototype = {
    mTransform: null,
    mColor: 0,
};
GameFramework.resources.PopAnimCalcObjectPosData.staticInit =
    function GameFramework_resources_PopAnimCalcObjectPosData$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PopAnimCalcObjectPosData.registerClass(
        "GameFramework.resources.PopAnimCalcObjectPosData",
        null
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PopAnimCalcObjectPosData.staticInit();
});
