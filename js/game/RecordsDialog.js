Game.RecordsDialog = function Game_RecordsDialog(theFromEndLevelDialog) {
    if (theFromEndLevelDialog === undefined) {
        theFromEndLevelDialog = false;
    }
    this.mSpeedHighScores = [];
    this.mClassicHighScores = [];
    Game.RecordsDialog.initializeBase(this, [
        Game.Resources["IMAGE_DIALOG_HEADERLESS_BKG"],
        Game.Resources["IMAGE_DIALOG_BUTTON"],
        Game.DM.EDialog.RECORDS,
        true,
        "",
        "",
        "",
        GameFramework.widgets.Dialog.BUTTONS_FOOTER,
    ]);
    this.mFromEndLevelDialog = theFromEndLevelDialog;
    this.mRankBar = new Game.RankBarWidget(1195, null, null, true);
    this.mRankBar.Move(200, 240);
    this.AddWidget(this.mRankBar);
    Game.BejApp.mBejApp.mBaseWidgetAppState.SetFocus(this.mRankBar);
    this.CollectHighScores("Lightning", this.mSpeedHighScores);
    this.CollectHighScores("Classic", this.mClassicHighScores);
    this.mYesButton.mLabel = "OK";
};
Game.RecordsDialog.prototype = {
    mRankBar: null,
    mFromEndLevelDialog: null,
    mSpeedHighScores: null,
    mClassicHighScores: null,
    Update: function Game_RecordsDialog$Update() {
        Game.Bej3Dialog.prototype.Update.apply(this);
        var w = 1400;
        var h = this.mFromEndLevelDialog ? 930 : 1050;
        this.mRankBar.Move(((w / 2) | 0) - this.mRankBar.mWidth / 2, (h / 2) | 0);
        this.Resize(
            ((Game.BejApp.mBejApp.mWidth / 2) | 0) - ((w / 2) | 0),
            ((Game.BejApp.mBejApp.mHeight / 2) | 0) - ((h / 2) | 0),
            w,
            h
        );
    },
    Draw: function Game_RecordsDialog$Draw(g) {
        Game.Bej3Dialog.prototype.Draw.apply(this, [g]);
        var stampX = this.mWidth / 2.0 - 2;
        var stampY = 142.0;
        var _t1 = g.PushScale(0.65, 0.65, stampX, stampY);
        try {
            g.DrawImage(Game.Resources["IMAGE_GAMEOVER_STAMP"].get_CenteredImage(), stampX, stampY);
        } finally {
            _t1.Dispose();
        }
        g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG_HUGE"]);
        g.GetFont().PushLayerColor("MAIN", 0xff884818);
        g.DrawStringCentered("Records", this.mWidth / 2, 152);
        g.GetFont().PopLayerColor("MAIN");
        var _t2 = g.PushTranslate(0.0, -10.0);
        try {
            this.DrawStats(g);
        } finally {
            _t2.Dispose();
        }
        this.DrawTopScores(g);
    },
    DrawStats: function Game_RecordsDialog$DrawStats(g) {
        g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG"]);
        g.mFont.PushLayerColor("OUTLINE", GameFramework.gfx.Color.RGBToInt(64, 24, 8));
        g.mFont.PushLayerColor("GLOW", GameFramework.gfx.Color.RGBAToInt(0, 0, 0, 0));
        var aColorStr = "N/A";
        var aFavIdx = -1;
        var aFavNum = 0;
        for (var i = 0; i < 7; i++) {
            if (Game.BejApp.mBejApp.mProfile.mStats[(Game.DM.EStat.RED_CLEARED | 0) + i] > aFavNum) {
                aFavNum = Game.BejApp.mBejApp.mProfile.mStats[(Game.DM.EStat.RED_CLEARED | 0) + i];
                aFavIdx = i;
            }
        }
        if (aFavIdx > -1) {
            aColorStr = Game.RecordsDialog.mColorStrs[aFavIdx];
        }
        var aTime = (Game.BejApp.mBejApp.mProfile.mStats[Game.DM.EStat.SECONDS_PLAYED | 0] / 10) | 0;
        var aTimeStr;
        if (aTime < 60) {
            aTimeStr = String.format("{0} second", aTime);
            if (aTime != 1) {
                aTimeStr += String.fromCharCode(115);
            }
        } else if (aTime < 3600) {
            aTime = (aTime / 60) | 0;
            aTimeStr = String.format("{0} minute", aTime);
            if (aTime != 1) {
                aTimeStr += String.fromCharCode(115);
            }
        } else {
            aTimeStr = String.format("{0:0.0} hours", aTime / 3600);
        }
        var statFields = Array.Create(
            4,
            "",
            "All-Time Best Move:",
            "Total Time Played:",
            "Gems Matched:",
            "Favorite Gem Color:"
        );
        var statFieldResults = Array.Create(
            4,
            "",
            GameFramework.Utils.CommaSeperate(Game.BejApp.mBejApp.mProfile.mStats[Game.DM.EStat.BIGGESTMOVE | 0]) +
                " pts",
            aTimeStr,
            GameFramework.Utils.CommaSeperate(Game.BejApp.mBejApp.mProfile.mStats[Game.DM.EStat.GEMS_CLEARED | 0]),
            aColorStr
        );
        if (this.mFromEndLevelDialog) {
            g.PushTranslate(0, -120);
        }
        if (!this.mFromEndLevelDialog) {
            g.DrawImageBox(Game.Resources["IMAGE_GAMEOVER_LIGHT_BOX"], 110, 610, 1175, 300, 0);
        } else {
            g.DrawImageBox(Game.Resources["IMAGE_GAMEOVER_LIGHT_BOX"], 110, 650, 1175, 260, 0);
        }
        var _t3 = g.PushColor(0xffddccaa);
        try {
            g.DrawImageBox(Game.Resources["IMAGE_GAMEOVER_LIGHT_BOX"], 125, 670, 1145, 225, 0);
        } finally {
            _t3.Dispose();
        }
        var x = 205;
        var y = 730;
        var _t4 = g.PushColor(0xfffec968);
        try {
            for (var i_2 = 0; i_2 < statFields.length; ++i_2) {
                g.DrawString(statFields[i_2], x, y);
                var wantColorize = statFieldResults[i_2] == aColorStr && aFavIdx >= 0;
                if (wantColorize) {
                    g.SetColor(Game.RecordsDialog.mColorInts[aFavIdx]);
                }
                g.DrawStringEx(statFieldResults[i_2], x + 984, y, 0, 1);
                if (wantColorize) {
                    g.UndoSetColor();
                }
                y += 46;
            }
        } finally {
            _t4.Dispose();
        }
        if (this.mFromEndLevelDialog) {
            g.PopMatrix();
        }
        g.mFont.PopLayerColor("OUTLINE");
        g.mFont.PopLayerColor("GLOW");
    },
    DrawTopScores: function Game_RecordsDialog$DrawTopScores(g) {
        var _t5 = g.PushTranslate(98, 240);
        try {
            this.DrawHighScores(g, "CLASSIC", this.mClassicHighScores);
        } finally {
            _t5.Dispose();
        }
        var _t6 = g.PushTranslate(this.mWidth - 600 - 102, 240);
        try {
            this.DrawHighScores(g, "SPEED", this.mSpeedHighScores);
        } finally {
            _t6.Dispose();
        }
    },
    CollectHighScores: function Game_RecordsDialog$CollectHighScores(theName, theScores) {
        var table = Game.BejApp.mBejApp.mHighScoreMgr.GetOrCreateTable(theName);
        for (var i = 0; i < table.mHighScores.length; ++i) {
            theScores.push(table.mHighScores[i]);
        }
    },
    DrawHighScores: function Game_RecordsDialog$DrawHighScores(g, theHeader, theScores) {
        g.SetFont(this.mHeaderFont);
        g.GetFont().PushLayerColor("MAIN", 0xffffffff);
        g.GetFont().PushLayerColor("OUTLINE", 0xff000000);
        g.GetFont().PushLayerColor("GLOW", 0x0);
        g.DrawStringCentered(theHeader, 300, -10);
        g.GetFont().PopLayerColor("MAIN");
        g.GetFont().PopLayerColor("OUTLINE");
        g.GetFont().PopLayerColor("GLOW");
        g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG"]);
        g.DrawImageBox(Game.Resources["IMAGE_GAMEOVER_LIGHT_BOX"], 0.0, 0.0, 600.0, 280.0, 0);
        var xOff = 30;
        var yOff = 70;
        for (var i = 0; i < (Math.min(5, theScores.length) | 0); ++i) {
            var clr = ~0;
            if (theScores[i].mIsNew || i == -1) {
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("MAIN", 0xfffdf7b0);
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("OUTLINE", 0xff404000);
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor(
                    "GLOW",
                    GameFramework.gfx.Color.RGBAToInt(
                        255,
                        255,
                        0,
                        215 + ((40.0 * Math.sin(this.mUpdateCnt * 0.07)) | 0)
                    )
                );
            } else {
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("MAIN", 0xfffdf7b0);
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("OUTLINE", 0xff404000);
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("GLOW", 0);
            }
            var _t7 = g.PushColor(clr);
            try {
                if (theScores[i].mName != null) {
                    var aScore = Game.GlobalMembersEndLevelDialog.Unkern(
                        GameFramework.Utils.CommaSeperate(theScores[i].mScore)
                    );
                    g.DrawStringEx(String.format("{0:d}.", i + 1), xOff + 0, yOff + 45 * i, 1, -1);
                    g.DrawStringEx(
                        Game.GfxUtil.GetEllipsisString(g, theScores[i].mName, 455 - (g.StringWidth(aScore) | 0)),
                        xOff + 50,
                        yOff + 45 * i,
                        -1,
                        -1
                    );
                    g.DrawStringEx(aScore, xOff + 540, yOff + 45 * i, -1, 1);
                } else if (i == 0) {
                    g.DrawStringEx("No scores posted", 300, 120, -1, 0);
                }
                Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("MAIN");
                Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("OUTLINE");
                Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("GLOW");
            } finally {
                _t7.Dispose();
            }
        }
    },
    ButtonDepress: function Game_RecordsDialog$ButtonDepress(theEvent) {
        Game.Bej3Dialog.prototype.ButtonDepress.apply(this, [theEvent]);
        this.Kill();
    },
};
Game.RecordsDialog.staticInit = function Game_RecordsDialog$staticInit() {
    Game.RecordsDialog.mColorStrs = Array.Create(7, 7, "Red", "White", "Green", "Yellow", "Purple", "Orange", "Blue");
    Game.RecordsDialog.mColorInts = Array.Create(
        7,
        7,
        0xffff0000,
        0xffffffff,
        0xff00ff00,
        0xffffff00,
        0xffff00ff,
        0xffff9900,
        0xff0099ff
    );
};

JSFExt_AddInitFunc(function () {
    Game.RecordsDialog.registerClass("Game.RecordsDialog", Game.Bej3Dialog);
});
JSFExt_AddStaticInitFunc(function () {
    Game.RecordsDialog.staticInit();
});
