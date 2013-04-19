/**
 * @constructor
 */
Game.StateInfo = function Game_StateInfo() {
}
Game.StateInfo.prototype = {
    mUpdateCnt : 0,
    mPoints : 0,
    mNextPieceId : 0,
    mIdleTicks : 0
}
Game.StateInfo.staticInit = function Game_StateInfo$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.StateInfo.registerClass('Game.StateInfo', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.StateInfo.staticInit();
});