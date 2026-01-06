/**
 * @constructor
 */
Game.Lightning = function Game_Lightning() {
    this.mPoints = Array.Create2D(Game.Lightning.NUM_LIGHTNING_POINTS, 2, null);
};
Game.Lightning.prototype = {
    mPoints: null,
    mPercentDone: 0.0,
    mPullX: 0.0,
    mPullY: 0.0,
};
Game.Lightning.staticInit = function Game_Lightning$staticInit() {
    Game.Lightning.NUM_LIGHTNING_POINTS = 8;
};

JSFExt_AddInitFunc(function () {
    Game.Lightning.registerClass("Game.Lightning", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.Lightning.staticInit();
});
