/**
 * @constructor
 */
Game.MatchSet = function Game_MatchSet() {
    this.mPieces = [];
}
Game.MatchSet.prototype = {
    mPieces : null,
    mMatchId : 0,
    mMoveCreditId : 0,
    mExplosionCount : 0
}
Game.MatchSet.staticInit = function Game_MatchSet$staticInit() {
}

JS_AddInitFunc(function() {
    Game.MatchSet.registerClass('Game.MatchSet', null);
});
JS_AddStaticInitFunc(function() {
    Game.MatchSet.staticInit();
});