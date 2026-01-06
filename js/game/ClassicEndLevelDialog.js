//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\ClassicBoard.cs
//LineMap:2=3 5=13 7=12 8=14 14=18 22=27 38=44 41=48 44=53 46=56 49=60 56=68 57=77 66=87 68=90 86=109 104=128 126=151 145=171 161=188 169=197 181=210 185=215 203=238
//Start:ClassicEndLevelDialog
/**
 * @constructor
 */
Game.ClassicEndLevelDialog = function Game_ClassicEndLevelDialog(theBoard) {
    Game.ClassicEndLevelDialog.initializeBase(this, [theBoard]);
    this.mClassicBoard = theBoard;
    this.NudgeButtons(-40);
    this.mRankBar.mY += 30;
};
Game.ClassicEndLevelDialog.prototype = {
    mClassicBoard: null,
    DrawStatsLabels: function Game_ClassicEndLevelDialog$DrawStatsLabels(g) {
        g.DrawStringEx("Level Achieved", 230, 475 + 48 * 0, -1, -1);
        g.DrawStringEx("Best Move", 230, 475 + 48 * 1, -1, -1);
        g.DrawStringEx("Longest Cascade", 230, 475 + 48 * 2, -1, -1);
        g.DrawStringEx("Total Time", 230, 475 + 48 * 3, -1, -1);
    },
    DrawStatsText: function Game_ClassicEndLevelDialog$DrawStatsText(g) {
        g.DrawStringEx(GameFramework.Utils.CommaSeperate(this.mLevel + 1), 760, 475 + 48 * 0, -1, 1);
        g.DrawStringEx(
            GameFramework.Utils.CommaSeperate(this.mGameStats[Game.DM.EStat.BIGGESTMOVE | 0]),
            760,
            475 + 48 * 1,
            -1,
            1
        );
        g.DrawStringEx(
            GameFramework.Utils.CommaSeperate(this.mGameStats[Game.DM.EStat.BIGGESTMATCH | 0]),
            760,
            475 + 48 * 2,
            -1,
            1
        );
        var aSeconds = (this.mGameStats[Game.DM.EStat.SECONDS_PLAYED | 0] / 10) | 0;
        g.DrawStringEx(String.format("{0}:{1:00}", (aSeconds / 60) | 0, aSeconds % 60), 760, 475 + 48 * 3, -1, 1);
    },
    DrawNewHighScoreFrame: function Game_ClassicEndLevelDialog$DrawNewHighScoreFrame(g, theOffsetX, theOffsetY) {
        var _t1 = g.PushTranslate(theOffsetX, theOffsetY - 90);
        try {
            var x = this.mWidth / 2.0;
            var y = 400.0;
            g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG"]);
            g.GetFont().PushLayerColor("MAIN", 0xff884818);
            g.GetFont().PushLayerColor("OUTLINE", 0xffffffff);
            g.GetFont().PushLayerColor("GLOW", 0);
            g.DrawStringCentered("New Top Score:", x, y + 4);
            g.GetFont().PopLayerColor("MAIN");
            g.GetFont().PopLayerColor("OUTLINE");
            g.GetFont().PopLayerColor("GLOW");
            var _t2 = g.PushColor(0xfff4f4d0);
            try {
                g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG"]);
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("MAIN", ~0);
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("OUTLINE", 0xff404000);
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("GLOW", 0);
                g.DrawStringCentered("Please enter your name:", x, y + 100.0);
            } finally {
                _t2.Dispose();
            }
            this.mNameWidget.Resize(this.mWidth / 2 - ((500 / 2) | 0) + theOffsetX, 500 + theOffsetY, 500, 50);
            this.mNameWidget.mAlpha = this.mNewHighScoreNameEntryShowPct.get_v();
            this.mHighScoreAcceptBtn.Move(
                this.mWidth / 2 - this.mHighScoreAcceptBtn.mWidth / 2 + theOffsetX,
                570 + theOffsetY
            );
            this.mHighScoreAcceptBtn.mAlpha = this.mNewHighScoreNameEntryShowPct.get_v();
            Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("MAIN");
            Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("OUTLINE");
            Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("GLOW");
        } finally {
            _t1.Dispose();
        }
    },
    DrawFrames: function Game_ClassicEndLevelDialog$DrawFrames(g) {
        var _t3 = g.PushTranslate(0, 60);
        try {
            g.DrawImageBox(
                Game.Resources["IMAGE_GAMEOVER_SECTION_LABEL"],
                195,
                385 - 0,
                600,
                Game.Resources["IMAGE_GAMEOVER_SECTION_LABEL"].mHeight,
                0
            );
            var _t4 = g.PushTranslate(0, 60);
            try {
                g.DrawImageBox(Game.Resources["IMAGE_GAMEOVER_LIGHT_BOX"], 195.0, 385.0, 602.0, 282.0, 0);
            } finally {
                _t4.Dispose();
            }
            if (this.mNewHighScoreNameEntryShowPct.get_v() > 0.0 && this.mNameWidget != null) {
                if (this.mNewHighScoreNameEntryShowPct.get_v() < 1.0) {
                    g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mNewHighScoreNameEntryShowPct.get_v()));
                }
                this.DrawNewHighScoreFrame(g, -300.0, 120.0);
                if (this.mNewHighScoreNameEntryShowPct.get_v() < 1.0) {
                    g.PopColor();
                }
            }
            if (this.mNewHighScoreNameEntryShowPct.get_v() < 1.0) {
                if (this.mNewHighScoreNameEntryShowPct.get_v() > 0.0) {
                    g.PushColor(GameFramework.gfx.Color.FAlphaToInt(1.0 - this.mNewHighScoreNameEntryShowPct.get_v()));
                }
                this.DrawLabeledStatsFrame(g);
                if (this.mNewHighScoreNameEntryShowPct.get_v() > 0.0) {
                    g.PopColor();
                }
            }
            this.DrawLabeledHighScores(g);
        } finally {
            _t3.Dispose();
        }
        if (this.mNameWidget != null) {
            this.mNameWidget.mAlpha = this.mNewHighScoreNameEntryShowPct.get_v();
        }
        if (this.mHighScoreAcceptBtn != null) {
            this.mHighScoreAcceptBtn.mAlpha = this.mNewHighScoreNameEntryShowPct.get_v();
        }
        var _t5 = g.PushTranslate(0, 10);
        try {
            this.DrawSpecialGemDisplay(g);
        } finally {
            _t5.Dispose();
        }
    },
};
Game.ClassicEndLevelDialog.staticInit = function Game_ClassicEndLevelDialog$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.ClassicEndLevelDialog.registerClass("Game.ClassicEndLevelDialog", Game.EndLevelDialog);
});
JSFExt_AddStaticInitFunc(function () {
    Game.ClassicEndLevelDialog.staticInit();
});
