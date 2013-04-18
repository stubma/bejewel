/**
 * @constructor
 */
Game.BarInstance = function Game_BarInstance() {
}
Game.BarInstance.prototype = {
    mSrcX : 0,
    mSrcY : 0,
    mAlpha : 0,
    mDAlpha : 0
}
Game.BarInstance.staticInit = function Game_BarInstance$staticInit() {
}

JS_AddInitFunc(function() {
    Game.BarInstance.registerClass('Game.BarInstance', null);
});
JS_AddStaticInitFunc(function() {
    Game.BarInstance.staticInit();
});