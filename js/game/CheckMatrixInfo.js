Game.CheckMatrixInfo = function Game_CheckMatrixInfo() {};
Game.CheckMatrixInfo.prototype = {
    mProxy: null,
    mMatrixDepth: 0,
    mColorDepth: 0,
    mGraphics: null,
};
Game.CheckMatrixInfo.staticInit = function Game_CheckMatrixInfo$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.CheckMatrixInfo.registerClass("Game.CheckMatrixInfo", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.CheckMatrixInfo.staticInit();
});
