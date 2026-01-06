Game.TextButton = function Game_TextButton(theBtnText, theId) {
    this.mScale$2 = new GameFramework.CurvedVal();
    Game.TextButton.initializeBase(this, [theId]);
    this.mFont = Game.Resources["FONT_MENU_BTN"];
    this.mScale$2.SetConstant(1.0);
    this.mText = theBtnText;
    this.refreshExtents();
};
Game.TextButton.prototype = {
    mText: null,
    mBackPaddingX: 30.0,
    mBackPaddingY: 20.0,
    mScale$2: null,
    mBackColor: 0,
    SetFont: function Game_TextButton$SetFont(theFont) {
        this.mFont = theFont;
        this.refreshExtents();
    },
    refreshExtents: function Game_TextButton$refreshExtents() {
        this.mWidth = this.mFont.StringWidth(this.mText) + this.mBackPaddingX;
        this.mHeight = this.mFont.GetHeight() + this.mBackPaddingY;
    },
    get_BackPaddingX: function Game_TextButton$get_BackPaddingX() {
        return this.mBackPaddingX;
    },
    set_BackPaddingX: function Game_TextButton$set_BackPaddingX(value) {
        this.mBackPaddingX = value;
        this.refreshExtents();
    },
    get_BackPaddingY: function Game_TextButton$get_BackPaddingY() {
        return this.mBackPaddingY;
    },
    set_BackPaddingY: function Game_TextButton$set_BackPaddingY(value) {
        this.mBackPaddingY = value;
        this.refreshExtents();
    },
    Draw: function Game_TextButton$Draw(g) {
        Game.Bej3Button.prototype.Draw.apply(this, [g]);
        if (this.mBackColor != 0) {
            var _t1 = g.PushColor(this.mBackColor);
            try {
                g.FillRect(0, 0, this.mWidth, this.mHeight);
            } finally {
                _t1.Dispose();
            }
        }
        var aScale = this.mScale$2.get_v();
        if (aScale != 1.0) {
            g.PushScale(aScale, aScale, this.mWidth / 2, this.mHeight / 2);
        }
        g.SetFont(this.mFont);
        this.mFont.PushLayerColor("OUTLINE", 0xffffff);
        this.mFont.PushLayerColor("MAIN", 0xff9c3762);
        this.mFont.PushLayerColor("GLOW", 0xffffff);
        g.DrawString(
            this.mText,
            this.mBackPaddingX / 2.0,
            -this.mBackPaddingY / 2.0 + this.mHeight - this.mFont.GetPhysDescent()
        );
        this.mFont.PopLayerColor("GLOW");
        this.mFont.PopLayerColor("OUTLINE");
        this.mFont.PopLayerColor("MAIN");
        if (aScale != 1.0) {
            g.PopMatrix();
        }
    },
    WantsMouseEvent: function Game_TextButton$WantsMouseEvent(x, y) {
        return Game.Bej3Button.prototype.WantsMouseEvent.apply(this, [x, y]);
    },
};
Game.TextButton.staticInit = function Game_TextButton$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.TextButton.registerClass("Game.TextButton", Game.Bej3Button);
});
JSFExt_AddStaticInitFunc(function () {
    Game.TextButton.staticInit();
});
