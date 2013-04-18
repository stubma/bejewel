Game.RankBarWidget = function Game_RankBarWidget(theWidth, theBoard, theRankUpDialog, drawText) {
    this.mRankupGlow = new GameFramework.CurvedVal();
    Game.RankBarWidget.initializeBase(this);
    this.mBoard = theBoard;
    this.mRankUpDialog = theRankUpDialog;
    this.mDrawText = drawText;
    this.mPrevFocus = null;
    this.mDispRank = Game.BejApp.mBejApp.mProfile.mOfflineRank;
    var aPrevRankPoints = Game.BejApp.mBejApp.mProfile.mOfflineRankPoints;
    this.mRankDelay = 0;
    if(this.mBoard != null) {
        var app = Game.BejApp.mBejApp;
        app.mProfile.mOfflineRankPoints += ((this.mBoard.mGameStats[(Game.DM.EStat.POINTS | 0)] / this.mBoard.GetRankPointMultiplier() / 1000) | 0);
        app.mProfile.mOfflineRank = (app.mProfile.GetRankAtPointsK(app.mProfile.mOfflineRankPoints) | 0);
    }
    this.mDispRankPointsOffset = (aPrevRankPoints - Game.BejApp.mBejApp.mProfile.mOfflineRankPoints);
    this.Resize(0, 0, theWidth, 142);
}
Game.RankBarWidget.prototype = {
    mRankupGlow : null,
    mDispRankPointsOffset : 0,
    mDispRank : 0,
    mRankDelay : 0,
    mDrawText : null,
    mBoard : null,
    mRankUpDialog : null,
    mPrevFocus : null,
    Update : function Game_RankBarWidget$Update() {
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
        var app = Game.BejApp.mBejApp;
        if(app.GetDialog(Game.DM.EDialog.UNLOCK) != null) {
            return;
        }
        if(this.mBoard == null) {
            return;
        }
        this.mRankupGlow.IncInVal();
        if(this.mRankDelay > 0) {
            --this.mRankDelay;
        } else if((this.mDispRankPointsOffset < 0) && (this.mUpdateCnt >= 90)) {
            if(this.mUpdateCnt % 12 == 0) {
                app.PlaySound(Game.Resources['SOUND_RANK_COUNTUP']);
            }
            this.mDispRankPointsOffset = Math.min(0.0, this.mDispRankPointsOffset + (-this.mDispRankPointsOffset) / 100.0 + 0.1);
            var aNewRank = (app.mProfile.GetRankAtPointsK((this.mDispRankPointsOffset | 0) + Game.BejApp.mBejApp.mProfile.mOfflineRankPoints) | 0);
            if(aNewRank > this.mDispRank) {
                app.PlaySound(Game.Resources['SOUND_RANKUP']);
                this.mDispRank = aNewRank;
                this.mDispRankPointsOffset = 0;
                this.mRankDelay = 84;
                this.mRankupGlow.SetCurve('b+0,1,0.004167,1,#### 9~### (#### 5g### .#### 3W### ;#### BJ### X####');
                if(this.mRankUpDialog != null) {
                    this.mRankUpDialog.DoRankUp();
                }
            }
        }
    },
    Draw : function Game_RankBarWidget$Draw(g) {
        var app = Game.BejApp.mBejApp;
        if(this.mBoard == null && !app.mMainMenu.mDrawMainMenu) {
            return;
        }
        g.SetFont(Game.Resources['FONT_GAMEOVER_DIALOG']);
        g.GetFont().PushLayerColor('MAIN', 0xffffffff);
        g.GetFont().PushLayerColor('OUTLINE', 0xff000000);
        g.GetFont().PushLayerColor('GLOW', 0);
        var aRank = this.GetRank();
        var aRankPoints = this.GetRankPoints();
        var aY = 95;
        var aNextRankPoints = this.GetNextRankPoints();
        var aBaseRankPoints = app.mProfile.GetRankPointsK((aRank | 0));
        if(this.mRankDelay > 0) {
            aBaseRankPoints = app.mProfile.GetRankPointsK((aRank | 0) - 1);
        }
        var aNextRankPct = Math.min(((aRankPoints - aBaseRankPoints) + this.mDispRankPointsOffset) / (aNextRankPoints - aBaseRankPoints), 1.0);
        g.DrawImage(Game.Resources['IMAGE_RECORDS_RANK_PLATE'].get_OffsetImage(), 0, 0);
        var aShowPct = aNextRankPct;
        if(aShowPct != 0.0) {
            var anImageInst = Game.Resources['IMAGE_RECORDS_RANK_FILL'].CreateImageInstRect(0, 0, ((Game.Resources['IMAGE_RECORDS_RANK_FILL'].mPhysCelWidth * aShowPct) | 0), Game.Resources['IMAGE_RECORDS_RANK_FILL'].mPhysCelHeight);
            g.DrawImage(anImageInst, Game.Resources['IMAGE_RECORDS_RANK_FILL'].mOffsetX, Game.Resources['IMAGE_RECORDS_RANK_FILL'].mOffsetY);
        }
        if((this.mRankupGlow != null) && (this.mRankupGlow.get_v() != 0)) {
            Game.Resources['IMAGE_RECORDS_RANK_GLOW'].mAdditive = true;
            var _t1 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mRankupGlow.get_v()));
            try {
                g.DrawImage(Game.Resources['IMAGE_RECORDS_RANK_GLOW'].get_OffsetImage(), 0, 0);
            } finally {
                _t1.Dispose();
            }
        }
        if(this.mDrawText) {
            g.DrawStringEx(String.format('Rank: {0:d}', aRank + 1), 170, aY, -1, -1);
            if(this.mBoard != null) {
                g.DrawStringEx(app.mRankNames[((Math.min((aRank | 0), (app.mRankNames.length | 0) - 1)) | 0)], this.mWidth / 2 + 40, aY, -1, 0);
                g.DrawStringEx(String.format('{0}k to go', GameFramework.Utils.CommaSeperate((this.GetRankPointsRemaining() | 0))), this.mWidth - 40, aY, -1, 1);
            } else {
                g.DrawStringEx(this.GetRankName(aRank), this.mWidth - 40, aY, -1, 1);
            }
        }
        g.GetFont().PopLayerColor('MAIN');
        g.GetFont().PopLayerColor('OUTLINE');
        g.GetFont().PopLayerColor('GLOW');
    },
    GetRank : function Game_RankBarWidget$GetRank() {
        if(this.mBoard != null) {
            return (this.mDispRank | 0);
        } else {
            return (Game.BejApp.mBejApp.mProfile.mOfflineRank | 0);
        }
    },
    GetRankPoints : function Game_RankBarWidget$GetRankPoints() {
        return Game.BejApp.mBejApp.mProfile.mOfflineRankPoints;
    },
    GetNextRankPoints : function Game_RankBarWidget$GetNextRankPoints() {
        if(this.mRankDelay > 0) {
            return Game.BejApp.mBejApp.mProfile.GetRankPointsK((this.GetRank() | 0));
        } else {
            return Game.BejApp.mBejApp.mProfile.GetRankPointsK((this.GetRank() | 0) + 1);
        }
    },
    GetRankName : function Game_RankBarWidget$GetRankName(aRank) {
        return Game.BejApp.mBejApp.mRankNames[((Math.min((aRank | 0), (Game.BejApp.mBejApp.mRankNames.length | 0) - 1)) | 0)];
    },
    GetRankPointsRemaining : function Game_RankBarWidget$GetRankPointsRemaining() {
        return ((Math.max(0, (((((this.GetNextRankPoints() - this.GetRankPoints() - this.mDispRankPointsOffset) * this.mBoard.GetRankPointMultiplier())) | 0)))) | 0);
    },
    MouseEnter : function Game_RankBarWidget$MouseEnter() {
        GameFramework.widgets.ClassicWidget.prototype.MouseEnter.apply(this);
        if(Game.BejApp.mBejApp.mDebugKeysEnabled) {
            this.mPrevFocus = Game.BejApp.mBejApp.mBaseWidgetAppState.mFocusWidget;
            Game.BejApp.mBejApp.mBaseWidgetAppState.SetFocus(this);
        }
    },
    MouseLeave : function Game_RankBarWidget$MouseLeave() {
        GameFramework.widgets.ClassicWidget.prototype.MouseLeave.apply(this);
        if(Game.BejApp.mBejApp.mDebugKeysEnabled) {
            if(this.mPrevFocus != null) {
                Game.BejApp.mBejApp.mBaseWidgetAppState.SetFocus(this.mPrevFocus);
            }
        }
    },
    KeyChar : function Game_RankBarWidget$KeyChar(theChar) {
        if(Game.BejApp.mBejApp.mDebugKeysEnabled) {
            switch(theChar) {
                case 61:
                case 43:
                {
                    Game.BejApp.mBejApp.mProfile.mOfflineRank++;
                    Game.BejApp.mBejApp.mProfile.mOfflineRankPoints = (Game.BejApp.mBejApp.mProfile.GetRankPointsK((Game.BejApp.mBejApp.mProfile.mOfflineRank | 0)) | 0) + 50;
                    this.mDispRankPointsOffset = -100.0;
                    break;
                }

                case 45:
                {
                    if(Game.BejApp.mBejApp.mProfile.mOfflineRank > 0) {
                        Game.BejApp.mBejApp.mProfile.mOfflineRank--;
                        Game.BejApp.mBejApp.mProfile.mOfflineRankPoints = (Game.BejApp.mBejApp.mProfile.GetRankPointsK((Game.BejApp.mBejApp.mProfile.mOfflineRank | 0)) | 0);
                        if(this.mDispRank > Game.BejApp.mBejApp.mProfile.mOfflineRank) {
                            this.mDispRank = Game.BejApp.mBejApp.mProfile.mOfflineRank;
                        }
                        this.mDispRankPointsOffset = 0;
                    }
                    break;
                }

            }
            ;
        }
        GameFramework.widgets.ClassicWidget.prototype.KeyChar.apply(this, [theChar]);
    }
}
Game.RankBarWidget.staticInit = function Game_RankBarWidget$staticInit() {
}

JS_AddInitFunc(function() {
    Game.RankBarWidget.registerClass('Game.RankBarWidget', GameFramework.widgets.ClassicWidget);
});
JS_AddStaticInitFunc(function() {
    Game.RankBarWidget.staticInit();
});