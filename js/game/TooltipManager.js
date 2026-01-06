Game.TooltipManager = function Game_TooltipManager() {
    this.mCurrentRequestedPos = new GameFramework.geom.TPoint(0, 0);
    this.mTooltips = [];
    this.mAlpha = new GameFramework.CurvedVal();
    this.mArrowOffset = new GameFramework.CurvedVal();
    Game.TooltipManager.initializeBase(this);
    this.mAlpha.SetCurve("b+0,1,0.01,1,####         ~~###");
    this.mArrowOffset.SetConstant(-16);
};
Game.TooltipManager.prototype = {
    mCurrentRequestedPos: null,
    mCurrentTooltipIdx: 0,
    mTooltips: null,
    mAlpha: null,
    mArrowOffset: null,
    RequestTooltip: function Game_TooltipManager$RequestTooltip(
        theCallingWidget,
        theHeaderText,
        theBodyText,
        thePos,
        theWidth,
        theArrowDir,
        theTimer
    ) {
        this.RequestTooltipEx(
            theCallingWidget,
            theHeaderText,
            theBodyText,
            thePos,
            theWidth,
            theArrowDir,
            theTimer,
            null,
            null,
            0,
            0xffffffff
        );
    },
    RequestTooltipEx: function Game_TooltipManager$RequestTooltipEx(
        theCallingWidget,
        theHeaderText,
        theBodyText,
        thePos,
        theWidth,
        theArrowDir,
        theTimer,
        theFontResourceTitle,
        theFontResource,
        theHeightAdj,
        theColor
    ) {
        for (var i = 0; i < (this.mTooltips.length | 0); i++) {
            if (thePos == this.mTooltips[i].mRequestedPos && theBodyText == this.mTooltips[i].mBodyText) {
                this.mTooltips[i].mAppearing = true;
                return;
            }
        }
        var aTip = new Game.Tooltip();
        aTip.mHeaderText = theHeaderText;
        aTip.mBodyText = theBodyText;
        aTip.mRequestedPos = new GameFramework.geom.TPoint(thePos.x, thePos.y);
        aTip.mArrowDir = theArrowDir;
        aTip.mTimer = theTimer;
        aTip.mAppearing = true;
        aTip.mAlphaPct = 0;
        aTip.mWidth = theWidth;
        aTip.mColor = theColor;
        aTip.mFontResourceTitle =
            theFontResourceTitle != null ? theFontResourceTitle : Game.Resources["FONT_TOOLTIP_BOLD"];
        aTip.mFontResource = theFontResource != null ? theFontResource : Game.Resources["FONT_TOOLTIP"];
        aTip.mHeight = Game.Resources["IMAGE_TOOLTIP"].mHeight - 20;
        var g = new GameFramework.gfx.Graphics(Game.BejApp.mBejApp.mWidth, Game.BejApp.mBejApp.mHeight);
        g.SetFont(aTip.mFontResource);
        var aTextHeight = 0;
        var aTestText = "";
        if (aTip.mHeaderText != "") {
            aTestText += aTip.mHeaderText;
            if (aTip.mBodyText != "") {
                aTestText += "\n";
            }
        }
        if (aTip.mBodyText != "") {
            if (aTextHeight > 0) {
                aTestText += aTip.mBodyText;
            }
        }
        if (aTip.mHeight < aTextHeight + 75) {
            aTip.mHeight = aTextHeight + 75;
        }
        aTip.mHeight += theHeightAdj;
        aTip.mOffsetPos.x = aTip.mRequestedPos.x;
        aTip.mOffsetPos.y = aTip.mRequestedPos.y;
        var anOffset = 20;
        switch (aTip.mArrowDir) {
            case Game.Tooltip.EArrowDir.ARROW_UP: {
                aTip.mOffsetPos.x += -aTip.mWidth / 2.0;
                aTip.mOffsetPos.y += anOffset;
                break;
            }
            case Game.Tooltip.EArrowDir.ARROW_DOWN: {
                aTip.mOffsetPos.x += -aTip.mWidth / 2.0;
                aTip.mOffsetPos.y += -aTip.mHeight - anOffset;
                break;
            }
            case Game.Tooltip.EArrowDir.ARROW_LEFT: {
                aTip.mOffsetPos.x += anOffset;
                aTip.mOffsetPos.y += -aTip.mHeight / 2.0;
                break;
            }
            case Game.Tooltip.EArrowDir.ARROW_RIGHT: {
                aTip.mOffsetPos.x += -aTip.mWidth - anOffset;
                aTip.mOffsetPos.y += -aTip.mHeight / 2.0;
                break;
            }
        }
        this.mTooltips.push(aTip);
        this.mCurrentRequestedPos = new GameFramework.geom.TPoint(thePos.x, thePos.y);
    },
};
Game.TooltipManager.staticInit = function Game_TooltipManager$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.TooltipManager.registerClass("Game.TooltipManager", GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function () {
    Game.TooltipManager.staticInit();
});
