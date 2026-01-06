Game.FrameButton = function Game_FrameButton() {
    Game.FrameButton.initializeBase(this);
};
Game.FrameButton.prototype = {
    Draw: function Game_FrameButton$Draw(g) {
        GameFramework.widgets.ButtonWidget.prototype.Draw.apply(this, [g]);
        g.DrawImage(Game.Resources["IMAGE_BOARD_HDSD_BUTTON_FRAME"].get_OffsetImage(), -160.0 - this.mX, 0.0 - this.mY);
    },
};
Game.FrameButton.staticInit = function Game_FrameButton$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.FrameButton.registerClass("Game.FrameButton", GameFramework.widgets.ButtonWidget);
});
JSFExt_AddStaticInitFunc(function () {
    Game.FrameButton.staticInit();
});
