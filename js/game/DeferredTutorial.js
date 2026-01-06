/**
 * @constructor
 */
Game.DeferredTutorial = function Game_DeferredTutorial() {};
Game.DeferredTutorial.prototype = {
    mTutorialFlag: null,
    mPieceId: 0,
};
Game.DeferredTutorial.staticInit = function Game_DeferredTutorial$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.DeferredTutorial.registerClass("Game.DeferredTutorial", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.DeferredTutorial.staticInit();
});
