Game.IconButton = function Game_IconButton() {
    Game.IconButton.initializeBase(this);
}
Game.IconButton.prototype = {
    mImage : null,
    mImageCelEnabled : 0,
    mImageCelDisabled : 0,
    mEnabled : true,
    Draw : function Game_IconButton$Draw(g) {
        g.DrawImageCel(this.mImage, 0, 0, this.mEnabled ? this.mImageCelEnabled : this.mImageCelDisabled);
    }
}
Game.IconButton.staticInit = function Game_IconButton$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.IconButton.registerClass('Game.IconButton', GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function() {
    Game.IconButton.staticInit();
});