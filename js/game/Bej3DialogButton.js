//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\Bej3Button.cs
//LineMap:2=4 5=14 7=13 11=11 13=17 17=22 18=24
//Start:Bej3Dialog
/**
 * @constructor
 */
Game.Bej3DialogButton = function Game_Bej3DialogButton(theId) {
    Game.Bej3DialogButton.initializeBase(this, [theId]);
    this.mAlpha = 1;
    this.SetFont(Game.Resources["FONT_DIALOG_BUTTONS"]);
    this.mButtonImage = Game.Resources["IMAGE_DIALOG_BUTTON"];
    this.mOverCel = 1;
    this.mDownCel = 2;
};
Game.Bej3DialogButton.prototype = {
    mTooltipHeader: null,
    mTooltip: null,
    DrawAll: function Game_Bej3DialogButton$DrawAll(g) {
        var _t1 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, (255 * this.mAlpha) | 0));
        try {
            GameFramework.widgets.ButtonWidget.prototype.DrawAll.apply(this, [g]);
        } finally {
            _t1.Dispose();
        }
    },
    Update: function Game_Bej3DialogButton$Update() {
        GameFramework.widgets.ButtonWidget.prototype.Update.apply(this);
        if (this.mIsOver && this.mTooltip != null && this.mTooltip.length > 0) {
            Game.BejApp.mBejApp.mTooltipManager.RequestTooltip(
                this,
                this.mTooltipHeader,
                "^FFAACC^" + this.mTooltip,
                new GameFramework.geom.TPoint(this.mX + this.mWidth / 2, this.mY + 0),
                400,
                Game.Tooltip.EArrowDir.ARROW_DOWN,
                10
            );
        }
    },
    MouseEnter: function Game_Bej3DialogButton$MouseEnter() {
        GameFramework.widgets.ButtonWidget.prototype.MouseEnter.apply(this);
        Game.BejApp.mBejApp.PlaySound(Game.Resources["SOUND_BUTTON_MOUSEOVER"]);
    },
    MouseLeave: function Game_Bej3DialogButton$MouseLeave() {
        GameFramework.widgets.ButtonWidget.prototype.MouseLeave.apply(this);
        Game.BejApp.mBejApp.PlaySound(Game.Resources["SOUND_BUTTON_MOUSELEAVE"]);
        Game.BejApp.mBejApp.mPauseFrames = -10;
    },
};
Game.Bej3DialogButton.staticInit = function Game_Bej3DialogButton$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.Bej3DialogButton.registerClass("Game.Bej3DialogButton", GameFramework.widgets.ButtonWidget);
});
JSFExt_AddStaticInitFunc(function () {
    Game.Bej3DialogButton.staticInit();
});
