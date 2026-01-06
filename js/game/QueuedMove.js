/**
 * @constructor
 */
Game.QueuedMove = function Game_QueuedMove() {};
Game.QueuedMove.prototype = {
    mUpdateCnt: 0,
    mSelectedId: 0,
    mSwappedRow: 0,
    mSwappedCol: 0,
    mForceSwap: null,
    mPlayerSwapped: null,
    mDestroyTarget: null,
    mDragSwap: null,
};
Game.QueuedMove.staticInit = function Game_QueuedMove$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.QueuedMove.registerClass("Game.QueuedMove", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.QueuedMove.staticInit();
});
