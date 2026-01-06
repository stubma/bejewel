/**
 * @constructor
 */
Game.ElectrocutedCel = function Game_ElectrocutedCel() {};
Game.ElectrocutedCel.prototype = {
    mCol: -1,
    mRow: -1,
    mElectrocutePercent: 0.0,
};
Game.ElectrocutedCel.staticInit = function Game_ElectrocutedCel$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.ElectrocutedCel.registerClass("Game.ElectrocutedCel", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.ElectrocutedCel.staticInit();
});
