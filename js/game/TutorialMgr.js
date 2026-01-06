Game.TutorialMgr = function Game_TutorialMgr(theBoard) {
    Game.TutorialMgr.G = this;
    this.mBoard = theBoard;
    this.mProfile = Game.BejApp.mBejApp.mProfile;
};
Game.TutorialMgr.DrawHighlightCircle = function Game_TutorialMgr$DrawHighlightCircle(g, theRect, theScreenRect) {
    if (theScreenRect === undefined) {
        theScreenRect = null;
    }
    var _t3 = g.PushColor(0xc0000000);
    try {
        var aX1 = g.GetSnappedX(theRect.mX);
        var aX2 = g.GetSnappedX(theRect.mX + theRect.mWidth);
        var aY1 = g.GetSnappedX(theRect.mY);
        var aY2 = g.GetSnappedX(theRect.mY + theRect.mHeight);
        theRect = new GameFramework.TRect(aX1, aY1, aX2 - aX1, aY2 - aY1);
        if (theScreenRect == null) {
            theScreenRect = new GameFramework.TRect(
                GameFramework.BaseApp.mApp.mX,
                GameFramework.BaseApp.mApp.mY,
                GameFramework.BaseApp.mApp.mDrawWidth,
                GameFramework.BaseApp.mApp.mDrawHeight
            );
        }
        g.FillRect(theScreenRect.mX, theScreenRect.mY, theRect.mX - theScreenRect.mX, theScreenRect.mHeight);
        g.FillRect(theRect.mX, theScreenRect.mY, theRect.mWidth, theRect.mY);
        g.FillRect(
            theRect.mX,
            theRect.mY + theRect.mHeight,
            theRect.mWidth,
            theScreenRect.mHeight - (theRect.mY + theRect.mHeight)
        );
        g.FillRect(
            theRect.mX + theRect.mWidth,
            theScreenRect.mY,
            theScreenRect.mWidth - (theRect.mX - theScreenRect.mX + theRect.mWidth),
            theScreenRect.mHeight
        );
        var anImageInst = Game.Resources["IMAGE_BOARD_HIGHLIGHT_CIRCLE"].CreateImageInstRect(
            1,
            1,
            Game.Resources["IMAGE_BOARD_HIGHLIGHT_CIRCLE"].mPhysCelWidth - 2,
            Game.Resources["IMAGE_BOARD_HIGHLIGHT_CIRCLE"].mPhysCelHeight - 2
        );
        var _t4 = g.PushScale(
            theRect.mWidth / (anImageInst.mSrcWidth / g.mScale),
            theRect.mHeight / (anImageInst.mSrcHeight / g.mScale),
            aX1,
            aY1
        );
        try {
            g.DrawImage(anImageInst, aX1, aY1);
        } finally {
            _t4.Dispose();
        }
    } finally {
        _t3.Dispose();
    }
};
Game.TutorialMgr.DrawHighlightBox = function Game_TutorialMgr$DrawHighlightBox(g, theRect, theScreenRect) {
    if (theScreenRect === undefined) {
        theScreenRect = null;
    }
    if (theScreenRect == null) {
        theScreenRect = new GameFramework.TRect(
            GameFramework.BaseApp.mApp.mX,
            GameFramework.BaseApp.mApp.mY,
            GameFramework.BaseApp.mApp.mDrawWidth,
            GameFramework.BaseApp.mApp.mDrawHeight
        );
    }
    var _t5 = g.PushColor(0xc0000000);
    try {
        var aX1 = g.GetSnappedX(theRect.mX);
        var aX2 = g.GetSnappedX(theRect.mX + theRect.mWidth);
        var aY1 = g.GetSnappedX(theRect.mY);
        var aY2 = g.GetSnappedX(theRect.mY + theRect.mHeight);
        theRect = new GameFramework.TRect(aX1, aY1, aX2 - aX1, aY2 - aY1);
        g.FillRect(theScreenRect.mX, theScreenRect.mY, theRect.mX - theScreenRect.mX, theScreenRect.mHeight);
        g.FillRect(theRect.mX, theScreenRect.mY, theRect.mWidth, theRect.mY);
        g.FillRect(
            theRect.mX,
            theRect.mY + theRect.mHeight,
            theRect.mWidth,
            theScreenRect.mHeight - (theRect.mY + theRect.mHeight)
        );
        g.FillRect(
            theRect.mX + theRect.mWidth,
            theScreenRect.mY,
            theScreenRect.mWidth - (theRect.mX - theScreenRect.mX + theRect.mWidth),
            theScreenRect.mHeight
        );
        g.DrawImageBox(
            Game.Resources["IMAGE_BOARD_HIGHLIGHT_FULL"],
            theRect.mX,
            theRect.mY,
            theRect.mWidth,
            theRect.mHeight,
            0
        );
    } finally {
        _t5.Dispose();
    }
};
Game.TutorialMgr.prototype = {
    mProfile: null,
    mBoard: null,
    mCurTutorial: null,
    GetTutorialFlags: function Game_TutorialMgr$GetTutorialFlags() {
        return this.mProfile.mTutorialFlags;
    },
    SetTutorialFlags: function Game_TutorialMgr$SetTutorialFlags(theFlags) {
        this.mProfile.mTutorialFlags = theFlags;
    },
    GetTutorialEnabled: function Game_TutorialMgr$GetTutorialEnabled() {
        return this.mProfile.mTutorialEnabled;
    },
    SetTutorialEnabled: function Game_TutorialMgr$SetTutorialEnabled(theEnabled) {
        this.mProfile.mTutorialEnabled = theEnabled;
    },
    GetTutorialSequence: function Game_TutorialMgr$GetTutorialSequence() {
        return this.mCurTutorial;
    },
    SetTutorialSequence: function Game_TutorialMgr$SetTutorialSequence(theSeq) {
        this.mCurTutorial = theSeq;
        if (this.mCurTutorial != null) {
            this.mCurTutorial.mMgr = this;
        }
    },
    Kill: function Game_TutorialMgr$Kill() {
        if (this.mCurTutorial != null) {
            this.mCurTutorial.KillCurrent(true);
            this.mCurTutorial.mRunning = false;
            this.mCurTutorial = null;
        }
    },
    Update: function Game_TutorialMgr$Update() {
        if (this.mCurTutorial != null && this.mCurTutorial.mRunning) {
            this.mCurTutorial.Update();
        }
    },
    GetCurrentStep: function Game_TutorialMgr$GetCurrentStep() {
        if (this.GetTutorialEnabled() && this.mCurTutorial != null) {
            return this.mCurTutorial.GetCurrentStep();
        }
        return null;
    },
    Draw: function Game_TutorialMgr$Draw(g) {
        var a = this.mBoard.GetPieceAlpha();
        if (a != 1.0) {
            g.PushColor(GameFramework.gfx.Color.FAlphaToInt(a));
        }
        if (this.mCurTutorial != null) {
            this.mCurTutorial.Draw(g);
        }
        if (a != 1.0) {
            g.PopColor();
        }
    },
    WantDrawFxOnTop: function Game_TutorialMgr$WantDrawFxOnTop() {
        var aStep = this.GetCurrentStep();
        return aStep != null && aStep.mWantDrawFxOnTop;
    },
    HasClearedTutorial: function Game_TutorialMgr$HasClearedTutorial(theTutorial) {
        return (this.GetTutorialFlags() & (1 << theTutorial)) != 0 || !this.GetTutorialEnabled();
    },
    AllowHints: function Game_TutorialMgr$AllowHints() {
        var aStep = this.GetCurrentStep();
        return aStep == null || aStep.mAutohintPieceLoc != null || aStep.mAllowStandardHints;
    },
    IsBusy: function Game_TutorialMgr$IsBusy() {
        return this.GetCurrentStep() != null;
    },
    WantsBlockUi: function Game_TutorialMgr$WantsBlockUi() {
        var aStep = this.GetCurrentStep();
        if (aStep != null) {
            return !(aStep.mDelay > 0 && !aStep.mBlockDuringDelay);
        }
        return false;
    },
    IsGridLockedAt: function Game_TutorialMgr$IsGridLockedAt(theCol, theRow) {
        var aStep = this.GetCurrentStep();
        if (aStep != null) {
            if (!aStep.mLimitUiAccessibleGems) {
                return false;
            }

            {
                var $srcArray6 = aStep.mUiAccessibleGems;
                for (var $enum6 = 0; $enum6 < $srcArray6.length; $enum6++) {
                    var pt = $srcArray6[$enum6];
                    if (pt.x == theCol && pt.y == theRow) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    },
    HasTutorialQueued: function Game_TutorialMgr$HasTutorialQueued(theTutorial) {
        if (this.mCurTutorial == null) {
            return false;
        }
        return this.mCurTutorial.HasTutorialQueued(theTutorial);
    },
    WantsBlockTimer: function Game_TutorialMgr$WantsBlockTimer() {
        var aStep = this.GetCurrentStep();
        if (aStep != null) {
            switch (aStep.mBlockTimer) {
                case Game.TutorialStep.EBlockTimerType.None: {
                    return false;
                }
                case Game.TutorialStep.EBlockTimerType.Pause: {
                    return true;
                }
                case Game.TutorialStep.EBlockTimerType.PauseAfterParam: {
                    return aStep.mUpdateCnt > aStep.mBlockTimerParam;
                }
                case Game.TutorialStep.EBlockTimerType.PauseUntilParam: {
                    return aStep.mUpdateCnt < aStep.mBlockTimerParam;
                }
                case Game.TutorialStep.EBlockTimerType.PauseBetweenParams: {
                    return aStep.mBlockTimerParam < aStep.mUpdateCnt && aStep.mUpdateCnt < aStep.mBlockTimerParam2;
                }
                case Game.TutorialStep.EBlockTimerType.PlayBetweenParams: {
                    return aStep.mBlockTimerParam > aStep.mUpdateCnt || aStep.mUpdateCnt > aStep.mBlockTimerParam2;
                }
            }
        }
        return false;
    },
};
Game.TutorialMgr.staticInit = function Game_TutorialMgr$staticInit() {
    Game.TutorialMgr.G = null;
};

JSFExt_AddInitFunc(function () {
    Game.TutorialMgr.registerClass("Game.TutorialMgr", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.TutorialMgr.staticInit();
});
