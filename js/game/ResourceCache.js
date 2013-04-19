/**
 * @constructor
 */
Game.ResourceCache = function Game_ResourceCache() {
    this.mShrunkenGems = Array.Create((Game.DM.EGemColor._COUNT | 0), null);
}
Game.ResourceCache.prototype = {
    mShrunkenGems : null,
    MakeShrunkenGems : function Game_ResourceCache$MakeShrunkenGems() {
    }
}
Game.ResourceCache.staticInit = function Game_ResourceCache$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.ResourceCache.registerClass('Game.ResourceCache', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.ResourceCache.staticInit();
});