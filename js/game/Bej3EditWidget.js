Game.Bej3EditWidget = function Game_Bej3EditWidget() {
    Game.Bej3EditWidget.initializeBase(this);
    this.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG"]);
    if (!GameFramework.BaseApp.mApp.get_Is3D()) {
        this.mColors[GameFramework.widgets.EditWidget.COLOR_BKG] = 0xff706050;
        this.mColors[GameFramework.widgets.EditWidget.COLOR_HILITE] = 0xff000000;
        this.mColors[GameFramework.widgets.EditWidget.COLOR_HILITE_TEXT] = 0xffffffff;
    }
};
Game.Bej3EditWidget.prototype = {
    mAlpha: 1.0,
    Draw: function Game_Bej3EditWidget$Draw(g) {
        if (this.mAlpha == 0.0) {
            return;
        }
        if (this.mAlpha < 1.0) {
            g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mAlpha));
        }
        Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor(
            "OUTLINE",
            GameFramework.gfx.Color.RGBAToInt(64, 24, 8, 0)
        );
        Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("GLOW", GameFramework.gfx.Color.RGBAToInt(0, 0, 0, 0));
        GameFramework.widgets.EditWidget.prototype.Draw.apply(this, [g]);
        Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("OUTLINE");
        Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("GLOW");
        if (this.mAlpha < 1.0) {
            g.PopColor();
        }
    },
};
Game.Bej3EditWidget.staticInit = function Game_Bej3EditWidget$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.Bej3EditWidget.registerClass("Game.Bej3EditWidget", GameFramework.widgets.EditWidget);
});
JSFExt_AddStaticInitFunc(function () {
    Game.Bej3EditWidget.staticInit();
});
