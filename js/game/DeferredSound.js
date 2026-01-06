/**
 * @constructor
 */
Game.DeferredSound = function Game_DeferredSound(theSound, theOnGameTick, theVolume) {
    this.mId = theSound;
    this.mOnGameTick = theOnGameTick;
    this.mVolume = theVolume;
};
Game.DeferredSound.prototype = {
    mId: null,
    mOnGameTick: 0,
    mVolume: 0,
};
Game.DeferredSound.staticInit = function Game_DeferredSound$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.DeferredSound.registerClass("Game.DeferredSound", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.DeferredSound.staticInit();
});
