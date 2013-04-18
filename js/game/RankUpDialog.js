Game.RankUpDialog = function Game_RankUpDialog(theBoard) {
    this.mRankUpAnimPct = new GameFramework.CurvedVal();
    Game.RankUpDialog.initializeBase(this, [null, Game.Resources['IMAGE_DIALOG_BUTTON'], Game.DM.EDialog.RANK_AWARD, true, 'RANK UP', '', '', GameFramework.widgets.Dialog.BUTTONS_FOOTER]);
    this.mBoard = theBoard;
    this.mContentInsets.mTop = 17;
    this.mRankBarWidget = null;
    this.mYesButton.mLabel = 'OK';
    this.mYesButton.mWidth = 200;
    this.mYesButton.mX = (this.mWidth - 200) / 2;
    this.mYesButton.mY += 10;
    this.mYesButton = null;
    this.mRankBarWidget = new Game.RankBarWidget(1000, this.mBoard, this, false);
    this.mRankBarWidget.Move((this.mWidth - 1000) / 2, 225);
    this.AddWidget(this.mRankBarWidget);
}
Game.RankUpDialog.prototype = {
    mBoard : null,
    mRankBarWidget : null,
    mRankUpAnimPct : null,
    Draw : function Game_RankUpDialog$Draw(g) {
        Game.Bej3Dialog.prototype.Draw.apply(this, [g]);
        var _t1 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.mBoard.GetBoardAlpha()) | 0)));
        try {
            var aRank = this.mRankBarWidget.GetRank();
            var aX = ((this.mWidth / 2.0) | 0);
            var aY = 150;
            g.SetFont(Game.Resources['FONT_DIALOG_SMALL_TEXT']);
            var _t2 = g.PushColor(GameFramework.gfx.Color.RGBToInt(80, 40, 20));
            try {
                g.DrawStringCentered('You have been promoted to:', aX, aY);
                aY += 270;
                g.DrawStringCentered('Your next rank will be earned in:', aX, aY);
                aY += 55;
            } finally {
                _t2.Dispose();
            }
            if((this.mRankBarWidget.GetRankPointsRemaining() | 0) > 0) {
                g.SetFont(Game.Resources['FONT_GAMEOVER_DIALOG']);
                Game.Resources['FONT_GAMEOVER_DIALOG'].PushLayerColor('GLOW', GameFramework.gfx.Color.RGBAToInt(192, 96, 48, 80));
                Game.Resources['FONT_GAMEOVER_DIALOG'].PushLayerColor('OUTLINE', GameFramework.gfx.Color.RGBToInt(64, 32, 16));
                g.DrawStringCentered(GameFramework.Utils.CommaSeperate((this.mRankBarWidget.GetRankPointsRemaining() | 0)) + ',000 Points', aX, aY);
                Game.Resources['FONT_GAMEOVER_DIALOG'].PopLayerColor('GLOW');
                Game.Resources['FONT_GAMEOVER_DIALOG'].PopLayerColor('OUTLINE');
            }
            aY -= 260;
            var aTextScale = new GameFramework.CurvedVal();
            aTextScale.SetCurveLinked('b+1,1.5,0,1,####   P~###      P####', this.mRankUpAnimPct);
            var aGlowScale = new GameFramework.CurvedVal();
            aGlowScale.SetCurveLinked('b#1,2,0,1,#         ~~', this.mRankUpAnimPct);
            var aGlowAlpha = new GameFramework.CurvedVal();
            aGlowAlpha.SetCurveLinked('b+0,1,0,1,####     $~###    }####', this.mRankUpAnimPct);
            g.SetFont(Game.Resources['FONT_RANKUP_NAME']);
            var _t3 = g.PushScale(aTextScale.GetOutVal(), aTextScale.GetOutVal(), aX, aY - 20.0);
            try {
                g.mFont.PushLayerColor('GLOW', GameFramework.gfx.Color.RGBToInt(192, 96, 48));
                g.mFont.PushLayerColor('OUTLINE', GameFramework.gfx.Color.RGBToInt(80, 40, 20));
                g.DrawStringCentered(this.mRankBarWidget.GetRankName(aRank), aX, aY);
                g.mFont.PopLayerColor('GLOW');
                g.mFont.PopLayerColor('OUTLINE');
            } finally {
                _t3.Dispose();
            }
            var _t4 = g.PushScale(aGlowScale.GetOutVal(), aGlowScale.GetOutVal(), aX, aY - 20.0);
            try {
                var _t5 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * aGlowAlpha.GetOutVal()) | 0)));
                try {
                    g.DrawStringCentered(this.mRankBarWidget.GetRankName(aRank), aX, aY);
                } finally {
                    _t5.Dispose();
                }
            } finally {
                _t4.Dispose();
            }
        } finally {
            _t1.Dispose();
        }
    },
    Update : function Game_RankUpDialog$Update() {
        Game.Bej3Dialog.prototype.Update.apply(this);
        if((Game.BejApp.mBejApp.mAutoPlay != Game.DM.EAutoplay.None) && (!this.mScale.IsDoingCurve()) && (this.mScale.GetOutVal() == 1.0) && (this.mUpdateCnt >= 300)) {
            var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.CLICKED);
            aWidgetEvent.mX = this.mYesButton.mX;
            aWidgetEvent.mY = this.mYesButton.mY;
            this.mYesButton.DispatchEvent(aWidgetEvent);
        }
    },
    ButtonDepress : function Game_RankUpDialog$ButtonDepress(theEvent) {
        Game.Bej3Dialog.prototype.ButtonDepress.apply(this, [theEvent]);
        this.Kill();
    },
    DoRankUp : function Game_RankUpDialog$DoRankUp() {
        this.mRankUpAnimPct.SetCurve('b30,1,0.028571,1,#         ~~');
    }
}
Game.RankUpDialog.staticInit = function Game_RankUpDialog$staticInit() {
}

JS_AddInitFunc(function() {
    Game.RankUpDialog.registerClass('Game.RankUpDialog', Game.Bej3Dialog);
});
JS_AddStaticInitFunc(function() {
    Game.RankUpDialog.staticInit();
});