Game.EndLevelDialog = function Game_EndLevelDialog(theBoard) {
    this.mBtns = {};
    this.mHighScores = [];
    this.mCountupPct = new GameFramework.CurvedVal();
    this.mGameStats = Array.Create(Game.DM.EStat._COUNT | 0, 0);
    this.mPointsBreakdown = [];
    this.mNewHighScoreNameEntryShowPct = new GameFramework.CurvedVal();
    this.mNewHighScoreTextExtraScaling = new GameFramework.CurvedVal();
    this.mNewHighScoreIntroAnimOut = new GameFramework.CurvedVal();
    Game.EndLevelDialog.initializeBase(this, [null, null, Game.DM.EDialog.END_LEVEL, true, "", "", "", 0]);
    this.mBoard = theBoard;
    this.mBoard.mPointsBreakdown.length = this.mBoard.mPointsBreakdown.length;
    for (var i = 0; i < this.mBoard.mPointsBreakdown.length; ++i) {
        this.mPointsBreakdown[i] = [];
        this.mPointsBreakdown[i].length = this.mBoard.mPointsBreakdown[i].length;
        for (var j = 0; j < this.mBoard.mPointsBreakdown[i].length; ++j) {
            this.mPointsBreakdown[i][j] = this.mBoard.mPointsBreakdown[i][j];
        }
    }
    for (var i_2 = 0; i_2 < (Game.DM.EStat._COUNT | 0); i_2++) {
        this.mGameStats[i_2] = this.mBoard.mGameStats[i_2];
    }
    this.mPoints = this.mBoard.mPoints;
    this.mLevel = this.mBoard.mLevel;
    this.mPointMultiplier = this.mBoard.mPointMultiplier;
    this.mCountupPct.SetCurve("b+0,1,0.016667,1,####  M#1^;       S~TEC");
    this.Resize(0, 0, 1600, 1200);
    this.mContentInsets.mBottom = 60;
    var btnWidth = 280;
    var aButton = this.NewButton$2(
        Game.EndLevelDialog.EWidgetId.eId_MainMenu | 0,
        btnWidth,
        Game.Resources["IMAGE_DIALOG_SMALL_BUTTON"]
    );
    aButton.Resize(
        this.mWidth / 2 - ((btnWidth / 2) | 0) + 325,
        this.mHeight - this.mContentInsets.mBottom - aButton.mHeight + 0,
        btnWidth,
        aButton.mHeight
    );
    aButton.mLabel = "MAIN MENU";
    this.mBtns[aButton.mId] = aButton;
    aButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.ButtonDepress));
    this.AddWidget(aButton);
    aButton = this.NewButton$2(
        Game.EndLevelDialog.EWidgetId.eId_Records | 0,
        btnWidth,
        Game.Resources["IMAGE_DIALOG_SMALL_BUTTON"]
    );
    aButton.Resize(
        this.mWidth / 2 - ((btnWidth / 2) | 0) - 325,
        this.mHeight - this.mContentInsets.mBottom - aButton.mHeight + 0,
        btnWidth,
        aButton.mHeight
    );
    aButton.mLabel = "RECORDS";
    this.mBtns[aButton.mId] = aButton;
    aButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.ButtonDepress));
    this.AddWidget(aButton);
    btnWidth += 80;
    aButton = this.NewButton(Game.EndLevelDialog.EWidgetId.eId_PlayAgain | 0, btnWidth);
    aButton.Resize(
        this.mWidth / 2 - ((btnWidth / 2) | 0) - 0,
        this.mHeight - this.mContentInsets.mBottom - aButton.mHeight + 10,
        btnWidth,
        aButton.mHeight
    );
    aButton.mLabel = "PLAY AGAIN";
    this.mBtns[aButton.mId] = aButton;
    aButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.ButtonDepress));
    this.AddWidget(aButton);
    this.mFlushPriority = 100;
    this.mAllowDrag = false;
    this.mRankBar = new Game.RankBarWidget(1195, this.mBoard, null, true);
    this.mRankBar.Move(200, 240);
    this.AddWidget(this.mRankBar);
    Game.BejApp.mBejApp.mBaseWidgetAppState.SetFocus(this.mRankBar);
};
Game.EndLevelDialog.prototype = {
    mBoard: null,
    mBtns: null,
    mScoreTableName: "",
    mHighScores: null,
    mCountupPct: null,
    mRankBar: null,
    mNameWidget: null,
    mHighScoreAcceptBtn: null,
    mPoints: 0,
    mGameStats: null,
    mPointsBreakdown: null,
    mLevel: 0,
    mPointMultiplier: 0,
    mNewHighScoreNameEntryShowPct: null,
    mNewHighScoreTextExtraScaling: null,
    mNewHighScoreIntroAnimOut: null,
    EditWidgetAllowKey: function Game_EndLevelDialog$EditWidgetAllowKey(theId, theCode) {
        return true;
    },
    EditWidgetAllowChar: function Game_EndLevelDialog$EditWidgetAllowChar(id, c) {
        if (this.mNameWidget.GetFont().CharWidthKern(c, 32) == 0) {
            return false;
        }
        var valid_chars = [];
        for (var i = 97 | 0; i <= (122 | 0); i++) {
            valid_chars.push(i | 0);
            valid_chars.push((i - 32) | 0);
        }
        for (var i_2 = 48 | 0; i_2 <= (57 | 0); i_2++) {
            valid_chars.push(i_2 | 0);
        }
        valid_chars.push(32);
        for (var i_3 = 0; i_3 < (valid_chars.length | 0); i_3++) {
            if (valid_chars[i_3] == c) {
                return true;
            }
        }
        return false;
    },
    EditWidgetAllowText: function Game_EndLevelDialog$EditWidgetAllowText(theId, theText) {
        var valid_chars = "";
        for (var i = 97; i <= 122; i++) {
            valid_chars += String.fromCharCode(i | 0);
            valid_chars += String.fromCharCode((i - 32) | 0);
        }
        for (var i_2 = 48; i_2 <= 57; i_2++) {
            valid_chars += String.fromCharCode(i_2);
        }
        valid_chars += String.fromCharCode(32);
        var valid_chars_str = valid_chars.toString();
        for (var i_3 = 0; i_3 < (theText.length | 0); i_3++) {
            {
                if (
                    (valid_chars_str.indexOf(String.fromCharCode(theText.charCodeAt(i_3))) | 0) == -1 ||
                    this.mNameWidget.GetFont().CharWidthKern(theText.charCodeAt(i_3), 32) == 0
                ) {
                    return false;
                }
            }
        }
        return true;
    },
    MouseDown: function Game_EndLevelDialog$MouseDown(x, y) {
        Game.Bej3Dialog.prototype.MouseDown.apply(this, [x, y]);
    },
    StartNewHighScoreAnim: function Game_EndLevelDialog$StartNewHighScoreAnim() {
        if (this.mScoreTableName == "") {
            return;
        }
        if (this.mNameWidget == null) {
            this.mNameWidget = new Game.Bej3EditWidget();
            this.mNameWidget.set_FontJustification(0);
            this.mNameWidget.SetText(Game.BejApp.mBejApp.mProfile.mProfileName, false);
            this.mNameWidget.AddEventListener(
                GameFramework.widgets.WidgetEvent.EDIT_TEXT,
                ss.Delegate.create(this, this.handleHighScoreNameEdited)
            );
            Game.BejApp.mBejApp.mBaseWidgetAppState.SetFocus(this.mNameWidget);
            this.AddWidget(this.mNameWidget);
            this.mNameWidget.mValidator = this;
        }
        if (this.mHighScoreAcceptBtn == null) {
            var btnWidth = 280;
            this.mHighScoreAcceptBtn = this.NewButton$2(
                Game.EndLevelDialog.EWidgetId.eId_HighScoreAccept | 0,
                btnWidth,
                Game.Resources["IMAGE_DIALOG_SMALL_BUTTON"]
            );
            this.mHighScoreAcceptBtn.Resize(
                this.mWidth / 2 - ((btnWidth / 2) | 0) + 325,
                this.mHeight - this.mContentInsets.mBottom - this.mHighScoreAcceptBtn.mHeight + 0,
                btnWidth,
                this.mHighScoreAcceptBtn.mHeight
            );
            this.mHighScoreAcceptBtn.mLabel = "OK";
            this.mBtns[this.mHighScoreAcceptBtn.mId] = this.mHighScoreAcceptBtn;
            this.mHighScoreAcceptBtn.AddEventListener(
                GameFramework.widgets.WidgetEvent.CLICKED,
                ss.Delegate.create(this, this.ButtonDepress)
            );
            this.AddWidget(this.mHighScoreAcceptBtn);
        }
        this.mNameWidget.mMaxPixels = 480;
        this.mHighScoreAcceptBtn.Move(this.mWidth / 2 - this.mHighScoreAcceptBtn.mWidth / 2, 590);
        this.mNewHighScoreNameEntryShowPct.SetConstant(1.0);
        this.mNewHighScoreTextExtraScaling.SetConstant(1.0);
    },
    Kill: function Game_EndLevelDialog$Kill() {
        this.FinishHighScoreNameEntry();
        Game.Bej3Dialog.prototype.Kill.apply(this);
    },
    ShowPromptForValidNameDlg: function Game_EndLevelDialog$ShowPromptForValidNameDlg() {
        var aDialog = Game.BejApp.mBejApp.DoModalDialog(
            "INVALID NAME",
            "Please enter a valid name.",
            "OK",
            GameFramework.widgets.Dialog.BUTTONS_FOOTER,
            Game.DM.EDialog.UNKNOWN_MODAL
        );
        var aWidth = 850;
        var aHeight = aDialog.GetPreferredHeight(aWidth);
        aDialog.Resize(
            this.mX + this.mWidth / 2 - ((aWidth / 2) | 0),
            this.mY + this.mHeight / 2 - aHeight / 2,
            aWidth,
            aHeight
        );
    },
    IsCurrentHighScoreNameValid: function Game_EndLevelDialog$IsCurrentHighScoreNameValid() {
        return this.mNewHighScoreNameEntryShowPct.get_v() != 1.0 || this.mNameWidget.GetText() != "";
    },
    ButtonDepress: function Game_EndLevelDialog$ButtonDepress(theEvent) {
        if (
            !this.IsCurrentHighScoreNameValid() &&
            (theEvent.target == this.mBtns[Game.EndLevelDialog.EWidgetId.eId_MainMenu | 0] ||
                theEvent.target == this.mBtns[Game.EndLevelDialog.EWidgetId.eId_PlayAgain | 0] ||
                theEvent.target == this.mBtns[Game.EndLevelDialog.EWidgetId.eId_HighScoreAccept | 0])
        ) {
            this.ShowPromptForValidNameDlg();
            return;
        }
        Game.Bej3Dialog.prototype.ButtonDepress.apply(this, [theEvent]);
        if (theEvent.target == this.mBtns[Game.EndLevelDialog.EWidgetId.eId_MainMenu | 0]) {
            var aBoard = Game.BejApp.mBejApp.mBoard;
            if (aBoard != null) {
                this.Kill();
                aBoard.BackToMenu();
            }
        } else if (theEvent.target == this.mBtns[Game.EndLevelDialog.EWidgetId.eId_PlayAgain | 0]) {
            var aBoard_2 = Game.BejApp.mBejApp.mBoard;
            if (aBoard_2 != null) {
                this.Kill();
                aBoard_2.Init();
                aBoard_2.NewGame();
                Game.BejApp.mBejApp.mBaseWidgetAppState.SetFocus(aBoard_2);
            }
        } else if (theEvent.target == this.mBtns[Game.EndLevelDialog.EWidgetId.eId_Records | 0]) {
            this.mScale.SetCurve("b;0,1,0.01,0.25,~t4G         ~O###");
            var dlg = new Game.RecordsDialog(true);
            Game.BejApp.mBejApp.mDialogMgr.AddDialog(dlg);
            dlg.AddEventListener(
                GameFramework.widgets.DialogEvent.CLOSED,
                ss.Delegate.create(this, this.handleRecordsDlgClosed)
            );
        } else if (theEvent.target == this.mBtns[Game.EndLevelDialog.EWidgetId.eId_HighScoreAccept | 0]) {
            this.CheckFinishScoreNameEntry();
        }
    },
    CheckFinishScoreNameEntry: function Game_EndLevelDialog$CheckFinishScoreNameEntry() {
        var s = GameFramework.Utils.StrTrim(this.mNameWidget.GetText());
        if (s.length == 0) {
        }
        {
            this.FinishHighScoreNameEntry();
        }
    },
    FinishHighScoreNameEntry: function Game_EndLevelDialog$FinishHighScoreNameEntry() {
        if (this.mNewHighScoreNameEntryShowPct.get_v() != 1.0) {
            return;
        }
        var aName = GameFramework.Utils.StrTrim(this.mNameWidget.GetText());
        if (aName.length == 0) {
            aName = "Player";
        }
        this.mNewHighScoreNameEntryShowPct.SetCurve("b;0,1,0.01,0.3,~###         ~#>>l");
        var oldName = Game.BejApp.mBejApp.mProfile.mProfileName;
        this.mNameWidget.SetText(aName, true);
        this.UpdateHighScoreEntryText();
        if (oldName != aName) {
            Game.BejApp.mBejApp.mProfile.mProfileName = aName;
            var table = Game.BejApp.mBejApp.mHighScoreMgr.GetOrCreateTable(this.mScoreTableName);
            for (var i = 0; i < Game.HighScoreTable.ENTRY_COUNT; ++i) {
                var entry = table.mHighScores[i];
                if (entry.mName == oldName && entry.mScore == this.mPoints) {
                    entry.mName = Game.BejApp.mBejApp.mProfile.mProfileName;
                }
            }
            Game.BejApp.mBejApp.SaveHighscores(true);
        }
    },
    handleHighScoreNameEdited: function Game_EndLevelDialog$handleHighScoreNameEdited(theEvent) {
        this.CheckFinishScoreNameEntry();
    },
    handleRecordsDlgClosed: function Game_EndLevelDialog$handleRecordsDlgClosed(theEvent) {
        this.mScale.SetCurve("b+0,1,0.01,0.25,P+1x         ~~###");
        if (this.mNameWidget != null && this.mNewHighScoreNameEntryShowPct.get_v() > 0.0) {
            Game.BejApp.mBejApp.mBaseWidgetAppState.SetFocus(this.mNameWidget);
        }
    },
    Update: function Game_EndLevelDialog$Update() {
        if (Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.UNLOCK) != null) {
            return;
        }
        Game.Bej3Dialog.prototype.Update.apply(this);
        if (this.mNewHighScoreNameEntryShowPct.get_v() > 0.0 && this.mNameWidget != null) {
            this.UpdateHighScoreEntryText();
        }
        this.mCountupPct.IncInVal();
        if (
            Game.BejApp.mBejApp.mAutoPlay != Game.DM.EAutoplay.None &&
            !this.mScale.IsDoingCurve() &&
            this.mScale.GetOutVal() == 1.0 &&
            this.mUpdateCnt >= 300
        ) {
            var btn = this.mBtns[Game.EndLevelDialog.EWidgetId.eId_PlayAgain | 0];
            var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.CLICKED);
            aWidgetEvent.mX = btn.mX;
            aWidgetEvent.mY = btn.mY;
            btn.DispatchEvent(aWidgetEvent);
        }
    },
    UpdateHighScoreEntryText: function Game_EndLevelDialog$UpdateHighScoreEntryText() {
        var masterTable = Game.BejApp.mBejApp.mHighScoreMgr.GetOrCreateTable(this.mScoreTableName);
        for (var i = 0; i < this.mHighScores.length; ++i) {
            var e = this.mHighScores[i];
            if (e.mIsNew) {
                e.mName = GameFramework.Utils.StrTrim(this.mNameWidget.GetText());
                if (masterTable != null && masterTable.mHighScores != null && i < masterTable.mHighScores.length) {
                    var masterEntry = masterTable.mHighScores[i];
                    if (masterEntry != null) {
                        masterEntry.mName = e.mName;
                    }
                }
                break;
            }
        }
    },
    Draw: function Game_EndLevelDialog$Draw(g) {
        g.DrawImageBox(Game.Resources["IMAGE_GAMEOVER_DIALOG"], 110.0, 0.0, 1380.0, 1200.0, 0);
        g.DrawImage(Game.Resources["IMAGE_GAMEOVER_STAMP"].get_OffsetImage(), -160, 0);
        g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG_HUGE"]);
        g.GetFont().PushLayerColor("MAIN", 0xff884818);
        g.DrawStringCentered("Final Score:", 800, 140);
        g.GetFont().PopLayerColor("MAIN");
        g.GetFont().PushLayerColor("LAYER_2", 0xffc28055);
        g.DrawStringCentered(
            GameFramework.Utils.CommaSeperate((this.mPoints * this.mCountupPct.GetOutVal()) | 0),
            800,
            220
        );
        g.GetFont().PopLayerColor("LAYER_2");
        this.DrawFrames(g);
    },
    KeyDown: function Game_EndLevelDialog$KeyDown(theKey) {
        if (theKey == GameFramework.KeyCode.Escape) {
            var btn = this.mBtns[Game.EndLevelDialog.EWidgetId.eId_MainMenu | 0];
            var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.CLICKED);
            aWidgetEvent.mX = btn.mX;
            aWidgetEvent.mY = btn.mY;
            btn.DispatchEvent(aWidgetEvent);
        }
    },
    SetQuestName: function Game_EndLevelDialog$SetQuestName(theQuest) {
        this.mScoreTableName = theQuest;
        var table = Game.BejApp.mBejApp.mHighScoreMgr.GetOrCreateTable(this.mScoreTableName);
        for (var i = 0; i < table.mHighScores.length; ++i) {
            if (i < Game.EndLevelDialog.MAX_HIGH_SCORES) {
                this.mHighScores.push(table.mHighScores[i].Clone());
            }
        }
        var highScoreAchieved = false;
        for (var i_2 = 0; i_2 < Game.HighScoreTable.ENTRY_COUNT; ++i_2) {
            var entry = table.mHighScores[i_2];
            if (entry.mIsNew) {
                if (i_2 < Game.EndLevelDialog.MAX_HIGH_SCORES) {
                    highScoreAchieved = true;
                }
                entry.mIsNew = false;
            }
        }
        if (highScoreAchieved) {
            this.StartNewHighScoreAnim();
        }
    },
    NudgeButtons: function Game_EndLevelDialog$NudgeButtons(theOffset) {
        {
            for ($enum1 in this.mBtns) {
                var btn = this.mBtns[$enum1];
                btn.mY += theOffset;
            }
        }
    },
    DrawSpecialGemDisplay: function Game_EndLevelDialog$DrawSpecialGemDisplay(g) {
        g.DrawImage(Game.Resources["IMAGE_GAMEOVER_SECTION_SMALL"].get_OffsetImage(), -160 + -35, 280);
        g.DrawImage(Game.Resources["IMAGE_GAMEOVER_ICON_FLAME_LRG"].get_OffsetImage(), -160 + 30, 175);
        g.DrawImage(Game.Resources["IMAGE_GAMEOVER_ICON_STAR_LRG"].get_OffsetImage(), -160 + 220, 175);
        g.DrawImage(Game.Resources["IMAGE_GAMEOVER_ICON_HYPERCUBE_LRG"].get_OffsetImage(), -160 + 410, 170);
        g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG"]);
        Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("GLOW", 0);
        Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("OUTLINE", 0);
        g.DrawStringEx(String.format("x {0:d}", this.mGameStats[Game.DM.EStat.FLAMEGEMS_MADE | 0]), 400, 900, -1, -1);
        g.DrawStringEx(String.format("x {0:d}", this.mGameStats[Game.DM.EStat.LASERGEMS_MADE | 0]), 780, 900, -1, -1);
        g.DrawStringEx(String.format("x {0:d}", this.mGameStats[Game.DM.EStat.HYPERCUBES_MADE | 0]), 1150, 900, -1, -1);
        Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("OUTLINE");
        Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("GLOW");
    },
    DrawHighScores: function Game_EndLevelDialog$DrawHighScores(g) {
        g.DrawImageBox(Game.Resources["IMAGE_GAMEOVER_LIGHT_BOX"], 800.0, 385.0, 600.0, 280.0, 0);
        var hasNewHighScore = false;
        for (var i = 0; i < (Math.min(Game.EndLevelDialog.MAX_HIGH_SCORES, this.mHighScores.length) | 0); ++i) {
            if (this.mHighScores[i].mIsNew) {
                hasNewHighScore = true;
            }
        }
        var xOff = 830;
        var yOff = 455;
        for (var i_2 = 0; i_2 < (Math.min(Game.EndLevelDialog.MAX_HIGH_SCORES, this.mHighScores.length) | 0); ++i_2) {
            var aScore = Game.GlobalMembersEndLevelDialog.Unkern(
                GameFramework.Utils.CommaSeperate(this.mHighScores[i_2].mScore)
            );
            var aPossibleLength = 455 - (g.StringWidth(aScore) | 0);
            var clr = ~0;
            if (this.mHighScores[i_2].mIsNew || i_2 == -1) {
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("GLOW", 0);
                if (!GameFramework.BaseApp.mApp.get_Is3D()) {
                    Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor(
                        "OUTLINE",
                        GameFramework.gfx.Color.FAlphaToInt(
                            Math.max(0.0, Math.min(1.0, (Math.cos(this.mUpdateCnt * 0.1) + 1.0) / 2.0))
                        )
                    );
                    Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("GLOW", 0xffffffff);
                    Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("MAIN", 0xffffffff);
                } else {
                    Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("OUTLINE", 0x40ffffff);
                    var p = 45;
                    var u = (this.mUpdateCnt % p) / p;
                    if (u > 0.5) {
                        u = 1.0 - u;
                    }
                    u *= 2.0;
                    Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor(
                        "MAIN",
                        Game.Util.HSLToRGB(185 + ((u * 20.0) | 0), 255, 150)
                    );
                }
                this.mNameWidget.mMaxPixels = aPossibleLength;
            } else {
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("OUTLINE", 0xffffffff);
                Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("GLOW", 0);
                if (hasNewHighScore && !GameFramework.BaseApp.mApp.get_Is3D()) {
                    Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("MAIN", 0xc8ffffff);
                } else {
                    clr = 0xffffcb58;
                    Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("MAIN", ~0);
                }
            }
            var _t2 = g.PushColor(clr);
            try {
                g.DrawStringEx(String.format("{0:d}.", i_2 + 1), xOff + 0, yOff + 45 * i_2, 1, -1);
                g.DrawStringEx(
                    Game.GfxUtil.GetEllipsisString(g, this.mHighScores[i_2].mName, aPossibleLength),
                    xOff + 50,
                    yOff + 45 * i_2,
                    -1,
                    -1
                );
                g.DrawStringEx(aScore, xOff + 540, yOff + 45 * i_2, -1, 1);
                Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("OUTLINE");
                Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("GLOW");
                Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("MAIN");
            } finally {
                _t2.Dispose();
            }
        }
    },
    DrawStatsLabels: function Game_EndLevelDialog$DrawStatsLabels(g) {},
    DrawStatsText: function Game_EndLevelDialog$DrawStatsText(g) {},
    DrawLabeledHighScores: function Game_EndLevelDialog$DrawLabeledHighScores(g) {
        g.DrawImageBox(
            Game.Resources["IMAGE_GAMEOVER_SECTION_LABEL"],
            800.0,
            385.0,
            600.0,
            Game.Resources["IMAGE_GAMEOVER_SECTION_LABEL"].mHeight,
            0
        );
        g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG"]);
        g.GetFont().PushLayerColor("MAIN", 0xff884818);
        g.GetFont().PushLayerColor("OUTLINE", 0xffffffff);
        g.GetFont().PushLayerColor("GLOW", 0);
        g.DrawStringCentered("Top Scores:", 1085, 435);
        g.GetFont().PopLayerColor("MAIN");
        g.GetFont().PopLayerColor("OUTLINE");
        g.GetFont().PopLayerColor("GLOW");
        var _t3 = g.PushTranslate(0, 60);
        try {
            this.DrawHighScores(g);
        } finally {
            _t3.Dispose();
        }
    },
    DrawStatsFrame: function Game_EndLevelDialog$DrawStatsFrame(g) {
        g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG"]);
        g.GetFont().PushLayerColor("MAIN", ~0);
        g.GetFont().PushLayerColor("GLOW", 0);
        var _t4 = g.PushColor(0xfff4f4d0);
        try {
            this.DrawStatsLabels(g);
        } finally {
            _t4.Dispose();
        }
        var _t5 = g.PushColor(0xffffff60);
        try {
            this.DrawStatsText(g);
        } finally {
            _t5.Dispose();
        }
        g.GetFont().PopLayerColor("MAIN");
        g.GetFont().PopLayerColor("GLOW");
    },
    DrawLabeledStatsFrame: function Game_EndLevelDialog$DrawLabeledStatsFrame(g) {
        g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG"]);
        g.GetFont().PushLayerColor("MAIN", 0xff884818);
        g.GetFont().PushLayerColor("OUTLINE", 0xffffffff);
        g.GetFont().PushLayerColor("GLOW", 0);
        g.DrawStringEx("Statistics", 485, 435, 0, 0);
        g.GetFont().PopLayerColor("MAIN");
        g.GetFont().PopLayerColor("OUTLINE");
        g.GetFont().PopLayerColor("GLOW");
        var _t6 = g.PushTranslate(0, 60);
        try {
            this.DrawStatsFrame(g);
        } finally {
            _t6.Dispose();
        }
    },
    DrawNewHighScoreFrame: function Game_EndLevelDialog$DrawNewHighScoreFrame(g, theOffsetX, theOffsetY) {
        var _t7 = g.PushTranslate(theOffsetX, theOffsetY);
        try {
            g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG"]);
            Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("MAIN", ~0);
            Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("OUTLINE", 0xff404000);
            Game.Resources["FONT_GAMEOVER_DIALOG"].PushLayerColor("GLOW", 0);
            var _t8 = g.PushColor(0xfff4f4d0);
            try {
                var x = this.mWidth / 2.0;
                var y = 460.0;
                g.SetFont(Game.Resources["FONT_DIALOG_HEADER"]);
                var clrMain = 0xffffffff;
                var clrOutline = 0xff000000;
                if (this.mNewHighScoreTextExtraScaling.get_v() != 1.0) {
                    clrMain = GameFramework.Utils.LerpColor(
                        clrMain,
                        0xfffff295,
                        Math.min(1.0, 5.0 * (this.mNewHighScoreTextExtraScaling.get_v() - 1.0))
                    );
                    clrOutline = GameFramework.Utils.LerpColor(
                        clrMain,
                        0xffffff00,
                        Math.min(1.0, 5.0 * (this.mNewHighScoreTextExtraScaling.get_v() - 1.0))
                    );
                }
                g.GetFont().PushLayerColor("MAIN", clrMain);
                g.GetFont().PushLayerColor("OUTLINE", clrOutline);
                g.GetFont().PushLayerColor("GLOW", 0x0);
                if (this.mNewHighScoreTextExtraScaling.get_v() != 1.0) {
                    g.PushTranslate(0.0, 10.0 * (this.mNewHighScoreTextExtraScaling.get_v() - 1.0));
                    g.PushScale(
                        this.mNewHighScoreTextExtraScaling.get_v(),
                        this.mNewHighScoreTextExtraScaling.get_v(),
                        x,
                        y
                    );
                }
                g.DrawStringCentered("A NEW TOP SCORE!", x, y);
                if (this.mNewHighScoreTextExtraScaling.get_v() != 1.0) {
                    g.PopMatrix();
                    g.PopMatrix();
                }
                g.GetFont().PopLayerColor("MAIN");
                g.GetFont().PopLayerColor("OUTLINE");
                g.GetFont().PopLayerColor("GLOW");
                g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG"]);
                g.DrawStringCentered("Please enter your name:", x, y + 55.0);
            } finally {
                _t8.Dispose();
            }
            this.mNameWidget.Resize(this.mWidth / 2 - ((500 / 2) | 0) + theOffsetX, 528 + theOffsetY, 500, 54);
            this.mNameWidget.mAlpha = this.mNewHighScoreNameEntryShowPct.get_v();
            this.mHighScoreAcceptBtn.Move(
                this.mWidth / 2 - this.mHighScoreAcceptBtn.mWidth / 2 + theOffsetX,
                590 + theOffsetY
            );
            this.mHighScoreAcceptBtn.mAlpha = this.mNewHighScoreNameEntryShowPct.get_v();
            Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("MAIN");
            Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("OUTLINE");
            Game.Resources["FONT_GAMEOVER_DIALOG"].PopLayerColor("GLOW");
        } finally {
            _t7.Dispose();
        }
    },
    DrawFrames: function Game_EndLevelDialog$DrawFrames(g) {
        g.DrawImageBox(Game.Resources["IMAGE_GAMEOVER_LIGHT_BOX"], 195.0, 385.0, 602.0, 282.0, 0);
        if (this.mNewHighScoreNameEntryShowPct.get_v() > 0.0 && this.mNameWidget != null) {
            if (this.mNewHighScoreNameEntryShowPct.get_v() < 1.0) {
                g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mNewHighScoreNameEntryShowPct.get_v()));
            }
            this.DrawNewHighScoreFrame(g, -300.0, 0.0);
            if (this.mNewHighScoreNameEntryShowPct.get_v() < 1.0) {
                g.PopColor();
            }
        }
        if (this.mNewHighScoreNameEntryShowPct.get_v() < 1.0) {
            if (this.mNewHighScoreNameEntryShowPct.get_v() > 0.0) {
                g.PushColor(GameFramework.gfx.Color.FAlphaToInt(1.0 - this.mNewHighScoreNameEntryShowPct.get_v()));
            }
            this.DrawStatsFrame(g);
            if (this.mNewHighScoreNameEntryShowPct.get_v() > 0.0) {
                g.PopColor();
            }
        }
        this.DrawHighScores(g);
        if (this.mNameWidget != null) {
            this.mNameWidget.mAlpha = this.mNewHighScoreNameEntryShowPct.get_v();
        }
        if (this.mHighScoreAcceptBtn != null) {
            this.mHighScoreAcceptBtn.mAlpha = this.mNewHighScoreNameEntryShowPct.get_v();
        }
    },
};
Game.EndLevelDialog.staticInit = function Game_EndLevelDialog$staticInit() {
    Game.EndLevelDialog.MAX_HIGH_SCORES = 5;
};

JSFExt_AddInitFunc(function () {
    Game.EndLevelDialog.registerClass(
        "Game.EndLevelDialog",
        Game.Bej3Dialog,
        GameFramework.widgets.EditWidgetTextValidator
    );
});
JSFExt_AddStaticInitFunc(function () {
    Game.EndLevelDialog.staticInit();
});
Game.EndLevelDialog.EWidgetId = {};
Game.EndLevelDialog.EWidgetId.staticInit = function Game_EndLevelDialog_EWidgetId$staticInit() {
    Game.EndLevelDialog.EWidgetId.eId_MainMenu = 0;
    Game.EndLevelDialog.EWidgetId.eId_PlayAgain = 1;
    Game.EndLevelDialog.EWidgetId.eId_Records = 2;
    Game.EndLevelDialog.EWidgetId.eId_HighScoreAccept = 3;
    Game.EndLevelDialog.EWidgetId._COUNT = 4;
};
JSFExt_AddInitFunc(function () {
    Game.EndLevelDialog.EWidgetId.staticInit();
});
