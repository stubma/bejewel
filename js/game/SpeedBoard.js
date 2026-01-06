Game.SpeedBoard = function Game_SpeedBoard(theApp) {
    this.m5SecChance = new Game.QuasiRandom();
    this.m10SecChance = new Game.QuasiRandom();
    this.mCollectorExtendPct = new GameFramework.CurvedVal();
    this.mCollectedTimeAlpha = new GameFramework.CurvedVal();
    this.mTimerGoldPct = new GameFramework.CurvedVal();
    this.mLastHurrahAlpha = new GameFramework.CurvedVal();
    Game.SpeedBoard.initializeBase(this, [theApp]);
    this.mShowPointMultiplier = true;
    this.mPointMultSidebarOffset = new GameFramework.geom.TPoint(0, 50);
    this.mUiConfig = Game.Board.EUIConfig.WithReset;
    this.mTimeFXManager = new Game.EffectsManager(this);
    this.mLevelBarSizeBias = 40;
    Game.Resources["PIEFFECT_LIGHTNING_POWERED_MEGASHARD"].ResetAnim();
    Game.Resources["PIEFFECT_LIGHTNING_POWERED_MEGASHARD"].mDrawTransform.identity();
    Game.Resources["PIEFFECT_LIGHTNING_POWERED_MEGASHARD"].mDrawTransform.scale(1.0, 1.0);
    Game.Resources["PIEFFECT_LIGHTNING_POWERED_MEGASHARD"].mEmitAfterTimeline = true;
    Game.Resources["PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT"].ResetAnim();
    Game.Resources["PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT"].mDrawTransform.identity();
    Game.Resources["PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT"].mDrawTransform.scale(1.0, 1.0);
    Game.Resources["PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT"].mEmitAfterTimeline = true;
    Game.Resources["POPANIM_ANIMS_GEM_MEGA"].mPIEffectIdSearchVector = [];
    Game.Resources["POPANIM_ANIMS_GEM_MEGA"].mPIEffectIdSearchVector.push("PIEFFECT_ANIMS_GEM_MEGA_");
    this.mCurTempo = 0;
};
Game.SpeedBoard.prototype = {
    mPreHurrahPoints: 0,
    mSpeedTier: 0,
    mPointsGoal: 0,
    mPrevPointsGoal: 0,
    mPMDropLevel: 0,
    mUsePM: null,
    mUseCheckpoints: null,
    mDidTimeUp: null,
    mTimeUpAnnouncement: null,
    mTimeFXManager: null,
    mHumSoundEffect: null,
    mTimeUpCount: 0,
    mTotalGameTicks: 0,
    mBonusTime: 0,
    mTotalBonusTime: 0,
    mBonusTimeDisp: 0,
    mTimedPenaltyAmnesty: 0,
    mTimedPenaltyVel: 0,
    mTimedPenaltyAccel: 0,
    mTimedPenaltyJerk: 0,
    mTimedLevelBonus: 0,
    mBonusPenalty: 0,
    mPointMultiplierStart: 0,
    mAddPointMultiplierPerLevel: 0,
    mReadyForDrop: null,
    mWantGemsCleared: 0,
    mDropGameTick: 0,
    mTimeStart: 0,
    mTimeChange: 0,
    mMaxTicksLeft: 0,
    mPointsGoalStart: 0,
    mAddPointsGoalPerLevel: 0,
    mPointsGoalAddPower: 0,
    m5SecChance: null,
    m10SecChance: null,
    mTimeStep: 0,
    mLevelTimeStep: 0,
    mGameTicksF: 0,
    mTimeScaleOverride: 0,
    mCollectorExtendPct: null,
    mCollectedTimeAlpha: null,
    mTimerGoldPct: null,
    mLastHurrahAlpha: null,
    mLastHurrahUpdates: 0,
    mPanicScalePct: 0,
    mCurUIFrameLabel: null,
    mCurTempo: 0,
    Dispose: function Game_SpeedBoard$Dispose() {
        if (this.mTimeFXManager != null) {
            this.mTimeFXManager.Dispose();
        }
        this.mTimeFXManager = null;
        Game.Board.prototype.Dispose.apply(this);
    },
    GetGameType: function Game_SpeedBoard$GetGameType() {
        return "Speed";
    },
    GetMusicName: function Game_SpeedBoard$GetMusicName() {
        return "Speed";
    },
    AllowSpeedBonus: function Game_SpeedBoard$AllowSpeedBonus() {
        return true;
    },
    GetHintTime: function Game_SpeedBoard$GetHintTime() {
        return 5;
    },
    Init: function Game_SpeedBoard$Init() {
        Game.Board.prototype.Init.apply(this);
        this.UIBlendTo("unpowered", 0);
        this.mPreHurrahPoints = 0;
        this.mSpeedTier = 0;
        this.mPrevPointsGoal = 0;
        this.mPMDropLevel = 0;
        this.mPointsGoal = 2500;
        this.mDoThirtySecondVoice = false;
        this.mUsePM = false;
        this.mDidTimeUp = false;
        this.mTimeUpCount = 0;
        this.mBonusTime = 0;
        this.mTotalBonusTime = 0;
        this.mBonusTimeDisp = 0;
        this.mTotalGameTicks = 0;
        this.mReadyForDrop = true;
        this.mWantGemsCleared = 0;
        this.mDropGameTick = 0;
        this.mBonusPenalty = 0;
        this.mTimedPenaltyAmnesty = 150;
        this.mUsePM = false;
        this.mPointsGoalStart = this.mPointsGoal = 0;
        this.mAddPointsGoalPerLevel = 0;
        this.mPointsGoalAddPower = 0;
        this.mTimeStart = 60;
        this.mTimeChange = 0;
        this.m5SecChance.Init("b+0,0.05,1,8,yilV `Jvb2        A/###");
        this.m10SecChance.Init("b+0,0.007,1,8,~q+p         ~/###");
        this.mTimedPenaltyVel = 0.0;
        this.mTimedPenaltyAccel = 0.0;
        this.mTimedPenaltyJerk = 0.0;
        this.mTimedLevelBonus = 0.0;
        this.mTimeStep = 2.0;
        this.mLevelTimeStep = 8.0;
        this.mPointMultiplierStart = 0.0;
        this.mAddPointMultiplierPerLevel = 0.0;
        this.mUseCheckpoints = this.mPointsGoalStart > 0 && this.mTimeStart > 0;
        this.mMaxTicksLeft = 60 * 60;
        this.mPanicScalePct = 0;
        this.mGameTicksF = 0;
        this.mTimeScaleOverride = 0;
        this.mCurTempo = 0;
        this.mCollectedTimeAlpha.SetConstant(1.0);
        this.mCollectorExtendPct.SetConstant(0);
        this.mLastHurrahAlpha.SetConstant(0);
    },
    UIBlendTo: function Game_SpeedBoard$UIBlendTo(theFrameLabel, theBlendTicks) {
        this.mCurUIFrameLabel = theFrameLabel;
        Game.Resources["POPANIM_ANIMS_LIGHTNINGUIBOTTOM"].Play(theFrameLabel, false);
        Game.Resources["POPANIM_ANIMS_LIGHTNINGUI"].Play(theFrameLabel, false);
        Game.Resources["POPANIM_ANIMS_GEM_MEGA"].Play(theFrameLabel, false);
    },
    ExtraTutorialSetup: function Game_SpeedBoard$ExtraTutorialSetup() {
        if (this.mTutorialMgr.GetTutorialSequence() != null) {
            this.mGoDelayCount = 50;
            this.SetTutorialCleared(Game.DM.ETutorial.SPEED_TUTORIAL_BASIC_MATCH, false);
            this.SetTutorialCleared(Game.DM.ETutorial.SPEED_TUTORIAL_TIMER, false);
            this.SetTutorialCleared(Game.DM.ETutorial.SPEED_TUTORIAL_TIME_GEM, false);
            this.SetTutorialCleared(Game.DM.ETutorial.SPEED_TUTORIAL_MULTIPLIER_UP, false);
            var gridLayout =
                "04166423" + "12344654" + "54211212" + "23540355" + "6112t332" + "34264125" + "61465133" + "61351542";
            for (var i = 0; i < gridLayout.length; ++i) {
                if (gridLayout.charCodeAt(i) == 116) {
                    var demoBlastPiece =
                        this.mBoard[
                            this.mBoard.mIdxMult0 * ((i / Game.Board.NUM_COLS) | 0) + (i % Game.Board.NUM_COLS)
                        ];
                    demoBlastPiece.SetFlag(Game.Piece.EFlag.TIME_BONUS);
                    demoBlastPiece.mColor = Game.DM.EGemColor.BLUE;
                    demoBlastPiece.mCounter = 5;
                    this.StartTimeBonusEffect(demoBlastPiece);
                } else if (gridLayout.charCodeAt(i) != 63) {
                    this.mBoard[
                        this.mBoard.mIdxMult0 * ((i / Game.Board.NUM_COLS) | 0) + (i % Game.Board.NUM_COLS)
                    ].mColor = gridLayout.charCodeAt(i) - 48;
                }
            }
            this.mGameTicks += 120;
            this.mGameTicksF += 120.0;
        }
    },
    GetTutorialSequence: function Game_SpeedBoard$GetTutorialSequence() {
        if (!this.WantsTutorial(Game.DM.ETutorial.SPEED_TUTORIAL_TIME_GEM)) {
            return null;
        }
        var ret = new Game.TutorialSequence();
        ret.mBoardSeed = 4321;
        var aStep = new Game.TutorialStep();
        aStep.mType = Game.TutorialStep.EType.ModalDialogMoveClear;
        aStep.mTextHeader = "Speed Mode";
        aStep.mText = "Swap adjacent gems to make a set of 3 in a row!";
        aStep.mTutorialId = Game.DM.ETutorial.SPEED_TUTORIAL_BASIC_MATCH;
        aStep.mDialogAnchorX = 708.0;
        aStep.mDialogAnchorY = 420.0;
        aStep.mDialogWidth = 650.0;
        aStep.mDelay = 70;
        aStep.mAutohintPieceLoc = new GameFramework.geom.TIntPoint(5, 1);
        aStep.mAutohintTime = 2;
        aStep.mBlockDuringDelay = true;
        aStep.mBlockTimer = Game.TutorialStep.EBlockTimerType.Pause;
        aStep.PointArrowAt(this, 5, 1, Game.TutorialStep.EArrowDir.Left);
        aStep.AddGemGridXY(this, 3, 0, false);
        aStep.AddGemGridXY(this, 4, 0, false);
        aStep.AddGemGridXY(this, 5, 0);
        aStep.AddGemGridXY(this, 3, 1, false);
        aStep.AddGemGridXY(this, 4, 1, false);
        aStep.AddGemGridXY(this, 5, 1);
        ret.Add(aStep);
        aStep = new Game.TutorialStep();
        aStep.mType = Game.TutorialStep.EType.ModalDialogOkBtnClear;
        aStep.mTextHeader = "Timer";
        aStep.mText = "... but watch the clock! You only have 60 seconds to start with.";
        aStep.mTutorialId = Game.DM.ETutorial.SPEED_TUTORIAL_TIMER;
        aStep.mBlockTimer = Game.TutorialStep.EBlockTimerType.PauseAfterParam;
        aStep.mBlockTimerParam = 6 * 60;
        aStep.mSpecialBehavior = Game.TutorialStep.ESpecialBehavior.Timer;
        aStep.mHighlightRect = new GameFramework.TRect(490, 0, 1100, 150);
        aStep.mDialogAnchorX = 602.0;
        aStep.mDialogAnchorY = 180.0;
        aStep.mDialogWidth = 890.0;
        aStep.mShowOkBtnCv = new GameFramework.CurvedVal();
        aStep.mShowOkBtnCv.SetCurveRef("SpeedBoard_cs_11_15_11__17_35_36_339");
        aStep.mArrowDir = Game.TutorialStep.EArrowDir.Right;
        aStep.mArrowX = 1500;
        aStep.mArrowY = 72;
        aStep.mDelay = 15;
        aStep.mBlockDuringDelay = true;
        ret.Add(aStep);
        aStep = new Game.TutorialStep();
        aStep.mType = Game.TutorialStep.EType.ModalDialogMoveClear;
        aStep.mBlockTimer = Game.TutorialStep.EBlockTimerType.Pause;
        aStep.mTextHeader = "Time Gem";
        aStep.mText = "Score big to earn ^007700^TIME GEMS^oldclr^. Match these to collect Bonus Time!";
        aStep.mTutorialId = Game.DM.ETutorial.SPEED_TUTORIAL_TIME_GEM;
        aStep.mSpecialBehavior = Game.TutorialStep.ESpecialBehavior.TimeGem;
        aStep.mWantDrawFxOnTop = true;
        aStep.mDialogAnchorX = 644.0;
        aStep.mDialogAnchorY = 250.0;
        aStep.mDialogWidth = 790.0;
        aStep.mDelay = 0;
        aStep.mAutohintPieceLoc = new GameFramework.geom.TIntPoint(4, 4);
        aStep.mAutohintTime = 2;
        aStep.mBlockDuringDelay = true;
        aStep.PointArrowAt(this, 4, 4, Game.TutorialStep.EArrowDir.Left);
        aStep.AddGemGridXY(this, 3, 4, true);
        aStep.AddGemGridXY(this, 3, 5, false);
        aStep.AddGemGridXY(this, 3, 6, false);
        aStep.AddGemGridXY(this, 4, 4, true);
        aStep.AddGemGridXY(this, 4, 5, false);
        aStep.AddGemGridXY(this, 4, 6, false);
        ret.Add(aStep);
        if (this.WantsTutorial(Game.DM.ETutorial.CLASSIC_TUTORIAL_HINT_BUTTON)) {
            aStep = new Game.TutorialStep();
            aStep.mType = Game.TutorialStep.EType.ModalDialog;
            aStep.mTextHeader = "Hints";
            aStep.mText = "If you are stuck, use the ^007700^HINT^oldclr^ Button to find a match.";
            aStep.mTutorialId = Game.DM.ETutorial.CLASSIC_TUTORIAL_HINT_BUTTON;
            aStep.mSpecialBehavior = Game.TutorialStep.ESpecialBehavior.HintBtn;
            aStep.mBlockTimer = Game.TutorialStep.EBlockTimerType.Pause;
            aStep.mArrowDir = Game.TutorialStep.EArrowDir.Down;
            aStep.mArrowX = this.mHintButton.mX + this.mHintButton.mWidth / 2;
            aStep.mArrowY = this.mHintButton.mY + this.mHintButton.mHeight / 2 - 50;
            aStep.mDialogAnchorX = 426.0;
            aStep.mDialogAnchorY = 708.0;
            aStep.mDialogWidth = 700.0;
            aStep.mAllowStandardHints = true;
            var oversizeScale = 1.65;
            var xDelta = (this.mHintButton.mWidth * (oversizeScale - 1.0)) / 2.0;
            var yDelta = (this.mHintButton.mHeight * (oversizeScale - 1.0)) / 2.0;
            aStep.mHighlightRect = new GameFramework.TRect(
                this.mHintButton.mX - xDelta,
                this.mHintButton.mY - yDelta,
                this.mHintButton.mWidth * oversizeScale,
                this.mHintButton.mHeight * oversizeScale
            );
            aStep.mDelay = 0;
            aStep.mBlockDuringDelay = true;
            ret.Add(aStep);
        }
        return ret;
    },
    MenuButtonPressed: function Game_SpeedBoard$MenuButtonPressed(e) {
        Game.Board.prototype.MenuButtonPressed.apply(this, [e]);
    },
    GetBoardY: function Game_SpeedBoard$GetBoardY() {
        return 130;
    },
    GetTooltipText: function Game_SpeedBoard$GetTooltipText(thePiece, theHeader, theBody) {
        if (Game.Board.prototype.GetTooltipText.apply(this, [thePiece, theHeader, theBody])) {
            return true;
        } else if (thePiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS)) {
            theHeader = "TIME GEM";
            theBody =
                "Match this Gem to add " +
                GameFramework.Utils.CommaSeperate(thePiece.mCounter) +
                " seconds to the clock!";
            return true;
        }
        return false;
    },
    GameOverExit: function Game_SpeedBoard$GameOverExit() {
        var table = Game.BejApp.mBejApp.mHighScoreMgr.GetOrCreateTable("Lightning");
        if (table.Submit(Game.BejApp.mBejApp.mProfile.mProfileName, this.mPoints)) {
            Game.BejApp.mBejApp.SaveHighscores(false);
        }
        var anEndLevelDialog = new Game.SpeedEndLevelDialog(this);
        Game.BejApp.mBejApp.mDialogMgr.AddDialog(anEndLevelDialog);
        anEndLevelDialog.SetQuestName("Lightning");
        Game.BejApp.mBejApp.mProfile.WriteProfile();
    },
    GameOverAnnounce: function Game_SpeedBoard$GameOverAnnounce() {
        new Game.Announcement(this, "TIME UP");
        Game.SoundUtil.Play(Game.Resources["SOUND_VOICE_TIMEUP"]);
    },
    PieceTallied: function Game_SpeedBoard$PieceTallied(thePiece) {
        if (thePiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS)) {
            this.mBonusTime += thePiece.mCounter;
            this.mTotalBonusTime += thePiece.mCounter;
            var fx = new Game.SpeedCollectEffect(
                this,
                new GameFramework.geom.TIntPoint(thePiece.CX() | 0, thePiece.CY() | 0),
                new GameFramework.geom.TIntPoint(240, 430),
                thePiece.mCounter,
                1.0
            );
            this.mTimeFXManager.AddEffect(fx);
            fx.Init(thePiece);
            thePiece.mAlpha.SetConstant(0);
            if (thePiece.mCounter == 5) {
                Game.SoundUtil.Play(Game.Resources["SOUND_SPEEDBOARD_TIMEBONUS_5"]);
            } else {
                Game.SoundUtil.Play(Game.Resources["SOUND_SPEEDBOARD_TIMEBONUS_10"]);
            }
            var aTimeOver = Math.max(0, this.mBonusTime - 60) | 0;
            if (aTimeOver > 0) {
                var aPoints = this.AddPoints(
                    thePiece.CX() | 0,
                    thePiece.CY() | 0,
                    thePiece.mCounter * 50,
                    Game.DM.gGemColors[thePiece.mColor | 0],
                    thePiece.mMatchId,
                    true,
                    true,
                    thePiece.mMoveCreditId,
                    false,
                    Game.Board.EPointType.SPECIAL
                );
            }
            var aString = String.format("+{0:d} sec", thePiece.mCounter);
            var aNewPoints = new Game.Points(
                Game.BejApp.mBejApp,
                Game.Resources["FONT_DIALOG_HEADER"],
                aString,
                thePiece.CX() | 0,
                thePiece.CY() | 0,
                1.0,
                0,
                Game.DM.gGemColors[thePiece.mColor | 0],
                -1
            );
            aNewPoints.mDestScale = 1.5;
            aNewPoints.mScaleDifMult = 0.2;
            aNewPoints.mScaleDampening = 0.8;
            aNewPoints.mDY *= 0.2;
        }
        Game.Board.prototype.PieceTallied.apply(this, [thePiece]);
    },
    GetLevelBarRect: function Game_SpeedBoard$GetLevelBarRect() {
        var aX = this.GetBoardCenterX();
        var aY = this.GetBoardY() + -55;
        var aBarRect = new GameFramework.TRect(
            0,
            0,
            Game.Resources["IMAGE_LIGHTNING_TOP_BACK_LIGHTNING"].mWidth,
            Game.Resources["IMAGE_LIGHTNING_TOP_BACK_LIGHTNING"].mHeight
        );
        aBarRect.Offset(aX - aBarRect.mWidth / 2, aY - aBarRect.mHeight / 2);
        aBarRect.mWidth -= 120;
        return aBarRect;
    },
    GetCountdownBarRect: function Game_SpeedBoard$GetCountdownBarRect() {
        return this.GetLevelBarRect();
    },
    GetTimeDrawX: function Game_SpeedBoard$GetTimeDrawX() {
        var aLevelBarRect = this.GetLevelBarRect();
        return aLevelBarRect.mX + aLevelBarRect.mWidth * this.mLevelBarPct + 64;
    },
    CanTimeUp: function Game_SpeedBoard$CanTimeUp() {
        if (this.mBonusTime == 0) {
            return Game.Board.prototype.CanTimeUp.apply(this);
        }
        return true;
    },
    GetTicksLeft: function Game_SpeedBoard$GetTicksLeft() {
        var aTimeLimit = this.GetTimeLimit();
        if (aTimeLimit == 0) {
            return -1;
        }
        var anAmnesty = 150;
        var aTicksLeft =
            Math.min(
                (aTimeLimit * 60.0) | 0,
                Math.max(0, ((aTimeLimit * 60.0) | 0) - Math.max(0, (this.mGameTicksF | 0) - anAmnesty))
            ) | 0;
        return Math.min(this.mMaxTicksLeft, aTicksLeft) | 0;
    },
    GetTimeLimit: function Game_SpeedBoard$GetTimeLimit() {
        return 60;
    },
    GetLevelPoints: function Game_SpeedBoard$GetLevelPoints() {
        return this.mPointsGoalStart + this.mAddPointsGoalPerLevel * this.mSpeedTier;
    },
    GetLevelPointsTotal: function Game_SpeedBoard$GetLevelPointsTotal() {
        return this.mLevelPointsTotal - (this.mBonusPenalty | 0);
    },
    LevelUp: function Game_SpeedBoard$LevelUp() {
        this.mSpeedTier++;
        this.mBonusPenalty = 0;
        this.mLevelPointsTotal = 0;
        this.mTimedPenaltyAmnesty = 500;
        var aTimeToAdvance = this.mTimedLevelBonus;
        this.mTimedPenaltyVel = Math.max(0.0, this.mTimedPenaltyVel - this.mTimedPenaltyAccel * aTimeToAdvance);
        this.mTimedPenaltyAccel = Math.max(0.0, this.mTimedPenaltyAccel - this.mTimedPenaltyJerk * aTimeToAdvance);
        Game.SoundUtil.Play(Game.Resources["SOUND_SPEEDBOARD_BACKGROUND_CHANGE"]);
    },
    WantExpandedTopWidget: function Game_SpeedBoard$WantExpandedTopWidget() {
        return 1;
    },
    GetTopWidgetButtonText: function Game_SpeedBoard$GetTopWidgetButtonText() {
        return Game.Board.prototype.GetTopWidgetButtonText.apply(this);
    },
    GetModePointMultiplier: function Game_SpeedBoard$GetModePointMultiplier() {
        return 5;
    },
    GetRankPointMultiplier: function Game_SpeedBoard$GetRankPointMultiplier() {
        return 85000.0 / 15000.0;
    },
    GameOver: function Game_SpeedBoard$GameOver(visible) {
        if (visible === undefined) {
            visible = true;
        }
        if (this.mTimeFXManager.GetActiveCount() > 0) {
            return;
        }
        if (this.mBonusTime == 0 && (this.mPointsBreakdown.length | 0) <= this.mPointMultiplier) {
            this.AddPointBreakdownSection();
        }
        for (var aPieceIter = new Game.PieceIter(this); aPieceIter.Next(); ) {
            var aPiece = aPieceIter.GetPiece();
            if (aPiece == null) {
                continue;
            }
            if (aPiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS)) {
                if (this.mBonusTime == 0) {
                    var aPoints = this.AddPoints(
                        aPiece.CX() | 0,
                        aPiece.CY() | 0,
                        aPiece.mCounter * 50,
                        Game.DM.gGemColors[aPiece.mColor | 0],
                        aPiece.mMatchId,
                        true,
                        true,
                        aPiece.mMoveCreditId,
                        false,
                        Game.Board.EPointType.SPECIAL
                    );
                    aPoints.mTimer *= 1.5;
                } else {
                    if (aPiece.mCounter >= 10) {
                        this.Laserify(aPiece);
                    } else {
                        this.Flamify(aPiece);
                    }
                }
                aPiece.ClearFlag(Game.Piece.EFlag.TIME_BONUS);
                aPiece.mCounter = 0;
            }
        }
        if (this.mBonusTime > 0) {
            this.mTimeExpired = false;
            if (this.WantsTutorial(Game.DM.ETutorial.SPEED_TUTORIAL_MULTIPLIER_UP)) {
                var aSeq = this.mTutorialMgr.GetTutorialSequence();
                if (aSeq == null) {
                    aSeq = new Game.TutorialSequence();
                    this.mTutorialMgr.SetTutorialSequence(aSeq);
                }
                if (!aSeq.HasTutorialQueued(Game.DM.ETutorial.SPEED_TUTORIAL_MULTIPLIER_UP)) {
                    var aStep = new Game.TutorialStep();
                    aStep.mType = Game.TutorialStep.EType.ModalDialogOkBtnClear;
                    aStep.mTextHeader = "Bonus Round";
                    aStep.mText =
                        "If you have Bonus Time stored, you'll get a ^007700^BONUS ROUND^oldclr^ when time runs out.\n\nEach ^007700^BONUS ROUND^oldclr^ ups your multiplier by 1!";
                    aStep.mTutorialId = Game.DM.ETutorial.SPEED_TUTORIAL_MULTIPLIER_UP;
                    aStep.mBlockTimer = Game.TutorialStep.EBlockTimerType.PlayBetweenParams;
                    aStep.mBlockTimerParam = 100;
                    aStep.mBlockTimerParam2 = 120;
                    aStep.mSpecialBehavior = Game.TutorialStep.ESpecialBehavior.MultiplierUp;
                    aStep.mHighlightRect = new GameFramework.TRect(490, 0, 1100, 150);
                    aStep.mDialogAnchorX = 602.0;
                    aStep.mDialogAnchorY = 180.0;
                    aStep.mDialogWidth = 680.0;
                    aStep.mShowOkBtnCv = new GameFramework.CurvedVal();
                    aStep.mShowOkBtnCv.SetCurveRef("SpeedBoard_cs_11_15_11__17_35_36_339");
                    aStep.mArrowDir = Game.TutorialStep.EArrowDir.Left;
                    aStep.mArrowX = 280;
                    aStep.mArrowY = 300;
                    aStep.mDelay = 15;
                    aStep.mBlockDuringDelay = true;
                    aSeq.Add(aStep);
                } else {
                    this.DoMultiplierUp();
                }
            } else {
                this.DoMultiplierUp();
            }
            return;
        }
        if (this.mSpeedBonusFlameModePct > 0) {
            return;
        }
        var aHurrahPieceCount = 0;
        this.mCursorSelectPos = new GameFramework.geom.TIntPoint(-1, -1);
        var aSpecialCount = 0;
        if (!this.mDidTimeUp) {
            this.mPreHurrahPoints = this.mPoints;
            this.mCollectedTimeAlpha.SetCurve("b;0,1,0.05,1,~###         ~####");
            this.UIBlendTo("death", 15);
            var aMusicFade = new GameFramework.CurvedVal();
            aMusicFade.SetCurveRef("SpeedBoard_cs_11_21_11__05_58_39_924");
            Game.BejApp.mBejApp.PlayMusic(Game.Resources.SOUND_MUSIC_SPEED_END_ID, aMusicFade, false);
            Game.SoundUtil.Play(Game.Resources["SOUND_BOMB_EXPLODE"]);
            Game.SoundUtil.Play(Game.Resources["SOUND_VOICE_TIMEUP"]);
            this.mDidTimeUp = true;
            new Game.Announcement(this, "TIME UP");
        }
        if (this.mSpeedBonusCount > 0) {
            this.EndSpeedBonus();
        }
        var hasCoin = false;
        for (var aPieceIter_2 = new Game.PieceIter(this); aPieceIter_2.Next(); ) {
            var aPiece_2 = aPieceIter_2.GetPiece();
            if (aPiece_2 == null) {
                continue;
            }
            hasCoin |= aPiece_2.IsFlagSet(Game.Piece.EFlag.COIN);
            if (
                aPiece_2.IsFlagSet(Game.Piece.EFlag.FLAME) ||
                aPiece_2.IsFlagSet(Game.Piece.EFlag.HYPERCUBE) ||
                aPiece_2.IsFlagSet(Game.Piece.EFlag.LASER) ||
                aPiece_2.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER) ||
                aPiece_2.IsFlagSet(Game.Piece.EFlag.DETONATOR) ||
                aPiece_2.IsFlagSet(Game.Piece.EFlag.SCRAMBLE) ||
                aPiece_2.IsFlagSet(Game.Piece.EFlag.BLAST_GEM) ||
                aPiece_2.IsFlagSet(Game.Piece.EFlag.TIME_BONUS)
            ) {
                if (aPiece_2.IsFlagSet(Game.Piece.EFlag.COIN)) {
                    aPiece_2.mDestructing = true;
                }
                if (this.mTimeUpCount == 0) {
                    aPiece_2.mExplodeDelay = 175 + aSpecialCount * 25;
                } else {
                    aPiece_2.mExplodeDelay = 25 + aSpecialCount * 25;
                }
                aSpecialCount++;
                aHurrahPieceCount++;
            }
        }
        if (aSpecialCount == 0) {
            for (var aPieceIter_3 = new Game.PieceIter(this); aPieceIter_3.Next(); ) {
                var aPiece_3 = aPieceIter_3.GetPiece();
                if (aPiece_3 == null) {
                    continue;
                }
                if (aPiece_3.IsFlagSet(Game.Piece.EFlag.COIN) && !aPiece_3.mTallied) {
                    if (aPiece_3.IsFlagSet(Game.Piece.EFlag.COIN)) {
                        aPiece_3.mDestructing = true;
                    }
                    this.TallyPiece(aPiece_3, true);
                    aPiece_3.mAlpha.SetConstant(1.0);
                    aPiece_3.ClearFlag(Game.Piece.EFlag.COIN);
                    aSpecialCount++;
                }
            }
        }
        if (aSpecialCount > 0 && this.mLastHurrahAlpha.GetOutVal() == 0) {
            this.mLastHurrahAlpha.SetCurve("b+0,1,0.008333,1,####    v####     +~###");
            this.mLastHurrahUpdates = 0;
        }
        var aWantCoinStart = aHurrahPieceCount == 0 ? 125 : 200;
        if (aSpecialCount == 0) {
            Game.Board.prototype.GameOver.apply(this, [false]);
            if (this.mLastHurrahAlpha.GetOutVal() > 0) {
                this.mGameOverCount = 200;
                this.mLastHurrahAlpha.SetCurve("b+0,1,0.01,1,~###     N~###    R####");
            }
        }
    },
    DoMultiplierUp: function Game_SpeedBoard$DoMultiplierUp() {
        if (this.IsGameSuspended()) {
            return;
        }
        Game.SoundUtil.Play(Game.Resources["SOUND_SPEEDBOARD_LIGHTNING_ENERGIZE"]);
        this.UIBlendTo("energize", 15);
        this.mCollectorExtendPct.SetCurveMult("b;0,1,0.01,1,~###         ~####");
        this.mTimerGoldPct.SetCurve("b;0,1,0.01,1,####  K~###       U####");
        this.m5SecChance.Step$2(this.mLevelTimeStep);
        this.m10SecChance.Step$2(this.mLevelTimeStep);
        this.m5SecChance.mChance.IncInValBy(this.m5SecChance.mChance.mIncRate);
        this.m10SecChance.mChance.IncInValBy(this.m10SecChance.mChance.mIncRate);
        this.mTimeExpired = false;
        var multiplierSnd = Game.Resources["SOUND_SPEEDBOARD_MULTIPLIER_UP2_1"];
        switch (Math.min(3, this.mPointMultiplier - 1)) {
            case 1: {
                multiplierSnd = Game.Resources["SOUND_SPEEDBOARD_MULTIPLIER_UP2_2"];
                break;
            }
            case 2: {
                multiplierSnd = Game.Resources["SOUND_SPEEDBOARD_MULTIPLIER_UP2_3"];
                break;
            }
            case 3: {
                multiplierSnd = Game.Resources["SOUND_SPEEDBOARD_MULTIPLIER_UP2_4"];
                break;
            }
        }
        Game.SoundUtil.Play(multiplierSnd);
        this.mPrevPointMultAlpha.SetCurve("b+0,1,0.01,1,~###         ~####");
        this.mPointMultPosPct.SetCurve("b+0,1,0.008333,1,~###         ~~###");
        this.mPointMultTextMorph.SetConstant(0);
        this.mPointMultScale.SetCurveLinked("b+0,1.2,0,1,####    {~###     &####", this.mPointMultPosPct);
        this.mPointMultAlpha.SetCurveLinked("b+0,1,0,1,####  `~###    v~###  I####", this.mPointMultPosPct);
        this.mPointMultYAdd.SetCurveLinked("b+0,-80,0,1,####         ~####", this.mPointMultPosPct);
        this.mPointMultiplier++;
        this.AddPointBreakdownSection();
        this.mMaxTicksLeft = this.mBonusTime * 60;
        this.mGameTicks = Math.max(0, (60 - this.mBonusTime) * 60 + -0) | 0;
        this.mGameTicksF = this.mGameTicks;
        this.mBonusTime = 0;
        this.mTimeScaleOverride = 0;
        var anEffect = new Game.LightningBarFillEffect();
        anEffect.mOverlay = true;
        this.mPostFXManager.AddEffect(anEffect);
    },
    AddPoints: function Game_SpeedBoard$AddPoints(
        theX,
        theY,
        thePoints,
        theColor,
        theId,
        addtotube,
        usePointMultiplier,
        theMoveCreditId,
        theForceAdd,
        thePointType
    ) {
        var aPrevPoints = this.mPoints;
        var aPoint = Game.Board.prototype.AddPoints.apply(this, [
            theX,
            theY,
            thePoints,
            theColor,
            theId,
            addtotube,
            usePointMultiplier,
            theMoveCreditId,
            theForceAdd,
            thePointType,
        ]);
        var aPointDelta = this.mPoints - aPrevPoints;
        return aPoint;
    },
    WantSpecialPiece: function Game_SpeedBoard$WantSpecialPiece(thePieceVector) {
        if (this.mUsePM) {
            return this.mPMDropLevel < this.mSpeedTier && this.mSpeedTier < 8;
        } else if (this.mTimeStart == 0) {
            return this.mPMDropLevel < this.mSpeedTier && this.mSpeedTier < 8;
        } else {
            var mDroppingBlastGem = false;
            if (this.mReadyForDrop && this.mWantGemsCleared != 0 && !this.mDidTimeUp) {
                if (mDroppingBlastGem) {
                    return true;
                }
            }
            return false;
        }
    },
    WantWarningGlow: function Game_SpeedBoard$WantWarningGlow() {
        if (this.mBonusTime != 0) {
            return false;
        }
        return Game.Board.prototype.WantWarningGlow.apply(this);
    },
    StartTimeBonusEffect: function Game_SpeedBoard$StartTimeBonusEffect(thePiece) {
        var anEffectBottom = new Game.TimeBonusEffectTop(thePiece);
        anEffectBottom.mX = (Game.Board.GEM_WIDTH / 2) | 0;
        anEffectBottom.mY = (Game.Board.GEM_HEIGHT / 2) | 0;
        anEffectBottom.mZ = 0.08;
        this.mPostFXManager.AddEffect(anEffectBottom);
        var anEffect = new Game.TimeBonusEffect(thePiece);
        anEffect.mX = (Game.Board.GEM_WIDTH / 2) | 0;
        anEffect.mY = (Game.Board.GEM_HEIGHT / 2) | 0;
        anEffect.mZ = 0.08;
        this.mPostFXManager.AddEffect(anEffect);
    },
    GetLevelPct: function Game_SpeedBoard$GetLevelPct() {
        var aLevelPct = 0.0;
        var aLevelPoints = this.GetLevelPoints();
        if (aLevelPoints > 0) {
            var aLevelPointsTotal = this.GetLevelPointsTotal();
            aLevelPct = Math.min(1.0, Math.max(0.0, 0.5 + (aLevelPointsTotal / aLevelPoints) * 0.5));
            if (this.mDidTimeUp) {
                aLevelPct = 0;
            }
            if (aLevelPct <= 0.0 && this.IsBoardStill() && this.mGameOverCount == 0) {
                this.mTimeExpired = true;
                this.GameOver();
            }
            var aTicksLeft = (aLevelPct * 4000.0) | 0;
            var aTimeBetweenWarnings = 35 + ((aTicksLeft * 0.1) | 0);
            if (
                this.mUpdateCnt - this.mLastWarningTick >= aTimeBetweenWarnings &&
                aTicksLeft > 0 &&
                aTicksLeft <= 1000
            ) {
                Game.SoundUtil.PlayEx(
                    Game.Resources["SOUND_COUNTDOWN_WARNING"],
                    0.0,
                    Math.min(1.0, 0.5 - aTicksLeft * 0.0005)
                );
                this.mLastWarningTick = this.mUpdateCnt;
            }
            return aLevelPct;
        }
        var aTimeLimit = this.GetTimeLimit();
        var writeTicksLeft = this.mUpdateCnt % 20 == 0;
        if (aTimeLimit != 0) {
            aLevelPct = Math.max(0.0, this.GetTicksLeft() / (aTimeLimit * 60.0));
            if (aLevelPct <= 0.0 && this.IsBoardStill() && this.mGameOverCount == 0) {
                this.mTimeExpired = true;
                this.GameOver();
            }
            var aTicksLeft_2 = this.GetTicksLeft();
            var aTimeBetweenWarnings_2 = 35 + ((aTicksLeft_2 * 0.1) | 0);
            if (this.mUseCheckpoints) {
                if (
                    this.mUpdateCnt - this.mLastWarningTick >= aTimeBetweenWarnings_2 &&
                    aTicksLeft_2 > 0 &&
                    aTicksLeft_2 <= 1000
                ) {
                    Game.SoundUtil.PlayEx(
                        Game.Resources["SOUND_COUNTDOWN_WARNING"],
                        0.0,
                        Math.min(1.0, 0.5 - aTicksLeft_2 * 0.0005)
                    );
                    this.mLastWarningTick = this.mUpdateCnt;
                }
            } else {
                if (
                    this.mUpdateCnt - this.mLastWarningTick >= aTimeBetweenWarnings_2 &&
                    aTicksLeft_2 > 0 &&
                    this.WantWarningGlow() &&
                    !this.mKilling
                ) {
                    var aWarningStartTick = this.GetTimeLimit() > 60 ? 1500 : 1000;
                    Game.SoundUtil.PlayEx(
                        Game.Resources["SOUND_COUNTDOWN_WARNING"],
                        0.0,
                        Math.min(1.0, 0.5 - aTicksLeft_2 / aWarningStartTick / 2.0)
                    );
                    this.mLastWarningTick = this.mUpdateCnt;
                }
            }
            if (aTicksLeft_2 == 30 * 60 && this.mLevelCompleteCount == 0) {
                if (this.mDoThirtySecondVoice) {
                    writeTicksLeft = true;
                    this.mDoThirtySecondVoice = false;
                    Game.SoundUtil.Play(Game.Resources["SOUND_VOICE_THIRTYSECONDS"]);
                }
            } else {
                this.mDoThirtySecondVoice = true;
            }
        }
        if (this.mUseCheckpoints) {
            aLevelPct = (this.mPoints - this.mPrevPointsGoal) / (this.mPointsGoal - this.mPrevPointsGoal);
        }
        return aLevelPct;
    },
    GetCountdownPct: function Game_SpeedBoard$GetCountdownPct() {
        return this.GetLevelPct();
    },
    DropSpecialPiece: function Game_SpeedBoard$DropSpecialPiece(thePieceVector) {
        if (this.mUsePM) {
            var anIdx = GameFramework.Utils.GetRand() % (thePieceVector.length | 0);
            for (var aTryCount = 0; aTryCount < 7; aTryCount++) {
                thePieceVector[anIdx].mColor = this.mRand.Next() % (Game.DM.EGemColor._COUNT | 0);
                var aColorCount = 0;
                for (var aPieceIter = new Game.PieceIter(this); aPieceIter.Next(); ) {
                    var aPiece = aPieceIter.GetPiece();
                    if (aPiece != null && aPiece.GetScreenY() > 0 && aPiece.mColor == thePieceVector[anIdx].mColor) {
                        aColorCount++;
                    }
                }
                if (aColorCount > 3) {
                    break;
                }
            }
            thePieceVector[anIdx].SetFlag(Game.Piece.EFlag.POINT_MULTIPLIER);
            this.mPMDropLevel++;
        } else {
            var anIdx_2 = this.mRand.Next() % (thePieceVector.length | 0) | 0;
            for (var aTryCount_2 = 0; aTryCount_2 < 7; aTryCount_2++) {
                thePieceVector[anIdx_2].mColor = this.mRand.Next() % (Game.DM.EGemColor._COUNT | 0);
                var aColorCount_2 = 0;
                for (var aPieceIter_2 = new Game.PieceIter(this); aPieceIter_2.Next(); ) {
                    var aPiece_2 = aPieceIter_2.GetPiece();
                    if (aPiece_2 == null) {
                        continue;
                    }
                    if (aPiece_2.mY > 0 && aPiece_2.mColor == thePieceVector[anIdx_2].mColor) {
                        aColorCount_2++;
                    }
                }
                if (aColorCount_2 > 3) {
                    break;
                }
            }
            this.Blastify(thePieceVector[anIdx_2]);
            this.mDropGameTick = this.mGameTicks;
            this.mReadyForDrop = false;
            this.mWantGemsCleared = 0;
            this.mPMDropLevel++;
        }
        return true;
    },
    PiecesDropped: function Game_SpeedBoard$PiecesDropped(thePieceVector) {
        var aTimeAdd = 0;
        for (var i = 0; i < (thePieceVector.length | 0); i++) {
            var aPiece = thePieceVector[i];
            aPiece.mY += 120;
        }
        if (this.mGameTicks > 60 && !this.mTimeExpired) {
            for (var i_2 = 0; i_2 < (thePieceVector.length | 0); i_2++) {
                this.m5SecChance.Step();
                this.m10SecChance.Step();
                if (this.m10SecChance.Check((this.mRand.Next() % 100000) / 100000.0)) {
                    aTimeAdd = 10;
                } else if (this.m5SecChance.Check((this.mRand.Next() % 100000) / 100000.0)) {
                    aTimeAdd = 5;
                }
            }
        }
        if (aTimeAdd > 0) {
            var anIdx = this.mRand.Next() % (thePieceVector.length | 0) | 0;
            var aPiece_2 = thePieceVector[anIdx];
            if (aPiece_2.mFlags == 0) {
                aPiece_2.SetFlag(Game.Piece.EFlag.TIME_BONUS);
                aPiece_2.mCounter = aTimeAdd;
                if (aPiece_2.mCounter == 5) {
                    Game.SoundUtil.PlayEx(
                        Game.Resources["SOUND_SPEEDBOARD_TIMEBONUS_APPEARS_5"],
                        this.GetPanPositionByPiece(aPiece_2),
                        1.0
                    );
                } else {
                    Game.SoundUtil.PlayEx(
                        Game.Resources["SOUND_SPEEDBOARD_TIMEBONUS_APPEARS_10"],
                        this.GetPanPositionByPiece(aPiece_2),
                        1.0
                    );
                }
            }
        }
        return true;
    },
    TimeCollected: function Game_SpeedBoard$TimeCollected(theTimeCollected) {
        if (theTimeCollected <= 5) {
            Game.SoundUtil.Play(Game.Resources["SOUND_SPEEDBOARD_LIGHTNING_TUBE_FILL_5"]);
        } else {
            Game.SoundUtil.Play(Game.Resources["SOUND_SPEEDBOARD_LIGHTNING_TUBE_FILL_10"]);
        }
        var aLastVal = this.mCollectorExtendPct.GetOutVal();
        this.mCollectorExtendPct.SetCurve("b;0,1,0.02,1,#.^$         ~~###");
        this.mCollectorExtendPct.mOutMin = aLastVal;
        this.mCollectorExtendPct.mOutMax = Math.min(1.0, this.mBonusTime / 60.0);
        this.UIBlendTo(String.format("pulse{0:d}", Math.min(5, (((this.mBonusTime * 5) / 60) | 0) + 1)), 12);
        if (this.mCollectorExtendPct.GetOutVal() == 0.0) {
            var anEffect = new Game.ParticleEffect(Game.Resources["PIEFFECT_LIGHTNING_STEAMPULSE"]);
            anEffect.mX = 245;
            anEffect.mY = 255;
            anEffect.mOverlay = true;
            this.mPostFXManager.AddEffect(anEffect);
        }
    },
    StartPieceEffect: function Game_SpeedBoard$StartPieceEffect(thePiece) {
        Game.Board.prototype.StartPieceEffect.apply(this, [thePiece]);
        if (thePiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS)) {
            this.StartTimeBonusEffect(thePiece);
        }
    },
    Update: function Game_SpeedBoard$Update() {
        var aPrevGameTick = this.mGameTicks;
        this.mLastHurrahAlpha.IncInVal();
        this.mLastHurrahUpdates++;
        Game.Board.prototype.Update.apply(this);
        this.mBackground.mWantAnim = false;
        if (this.mGameTicks != aPrevGameTick) {
            var aPrevTicksI = this.mGameTicksF | 0;
            if (this.mTimeScaleOverride == 0) {
                var aTimeScale = Math.min(1.0, 0.7 + (this.GetTicksLeft() / 360.0) * 0.3);
                this.mGameTicksF += aTimeScale;
            } else {
                this.mGameTicksF += this.mTimeScaleOverride;
            }
            this.m5SecChance.Step$2(this.mTimeStep / 60.0);
            this.m10SecChance.Step$2(this.mTimeStep / 60.0);
            this.mTotalGameTicks++;
            if (!this.WantWarningGlow()) {
                var aTicksLeft = this.GetTicksLeft();
                if (
                    aTicksLeft % 60 == 0 &&
                    aTicksLeft > 0 &&
                    aTicksLeft <= 8 * 60 &&
                    aTicksLeft != this.mMaxTicksLeft &&
                    aPrevTicksI != (this.mGameTicksF | 0)
                ) {
                    Game.SoundUtil.Play(Game.Resources["SOUND_TICK"]);
                }
            }
        }
        if (this.mDidTimeUp) {
            this.mTimeUpCount++;
        }
        var aPenaltyPct = Math.min(this.GetLevelPct() + 0.65, 1.0);
        this.mBonusTimeDisp += (this.mBonusTime - this.mBonusTimeDisp) / 50;
        if (this.mTimedPenaltyAmnesty > 0) {
            this.mTimedPenaltyAmnesty--;
        } else {
            this.mBonusPenalty += (this.mTimedPenaltyVel * aPenaltyPct) / 60.0;
            this.mTimedPenaltyVel += (this.mTimedPenaltyAccel * aPenaltyPct) / 60.0;
            this.mTimedPenaltyAccel += (this.mTimedPenaltyJerk * aPenaltyPct) / 60.0;
        }
        if (this.mWantGemsCleared == 0) {
            this.mWantGemsCleared = 20;
        }
        if (this.mGameTicks % 240 == 0 && aPrevGameTick != this.mGameTicks) {
            this.mWantGemsCleared = Math.max(5, (this.mWantGemsCleared - (this.mRand.Next() % 5)) | 0) | 0;
        }
        if (this.mUseCheckpoints && this.mPoints > this.mPointsGoal) {
            Game.SoundUtil.Play(Game.Resources["SOUND_SPEEDBOARD_BACKGROUND_CHANGE"]);
            this.mSpeedTier++;
            this.mPrevPointsGoal = this.mPointsGoal;
            if (this.mUsePM) {
                this.mPointsGoal +=
                    ((this.mPointsGoalStart +
                        this.mAddPointsGoalPerLevel * Math.pow(this.mSpeedTier, this.mPointsGoalAddPower)) |
                        0) *
                    (this.mSpeedTier + 1);
            } else {
                this.mPointsGoal +=
                    (this.mPointsGoalStart +
                        this.mAddPointsGoalPerLevel * Math.pow(this.mSpeedTier, this.mPointsGoalAddPower)) |
                    0;
            }
            this.mGameTicks = 0;
        }
        Game.Resources["POPANIM_ANIMS_GEM_MEGA"].Update();
        Game.Resources["POPANIM_ANIMS_GEM_MEGA"].mColor = GameFramework.gfx.Color.FAlphaToInt(this.GetAlpha());
        Game.Resources["POPANIM_ANIMS_LIGHTNINGUIBOTTOM"].Update();
        Game.Resources["POPANIM_ANIMS_LIGHTNINGUIBOTTOM"].mColor = GameFramework.gfx.Color.FAlphaToInt(this.GetAlpha());
        Game.Resources["POPANIM_ANIMS_LIGHTNINGUI"].Update();
        Game.Resources["POPANIM_ANIMS_LIGHTNINGUI"].mColor = GameFramework.gfx.Color.FAlphaToInt(this.GetAlpha());
        var aPoweredScaleVal = Math.pow(this.mCollectorExtendPct.GetOutVal(), 0.7);
        var aLayer = Game.Resources["PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT"].GetLayer(0);
        for (var anEmitterIdx = 0; anEmitterIdx < 2; anEmitterIdx++) {
            var anEmitterInstDef = aLayer.mLayerDef.mEmitterInstanceDefVector[anEmitterIdx];
            anEmitterInstDef.mValues[
                GameFramework.resources.PIEmitterInstanceDef.Value.LIFE | 0
            ].mValuePointVector[0].mValue = 0.75 + aPoweredScaleVal * 1.5;
            anEmitterInstDef.mValues[
                GameFramework.resources.PIEmitterInstanceDef.Value.NUMBER | 0
            ].mValuePointVector[0].mValue =
                this.mCollectorExtendPct.GetOutVal() > 0.0 ? 0.33 + aPoweredScaleVal * 1.0 : 0.0;
            anEmitterInstDef.mValues[
                GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_X | 0
            ].mValuePointVector[0].mValue = 0.75 + aPoweredScaleVal * 0.5;
            anEmitterInstDef.mValues[
                GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_Y | 0
            ].mValuePointVector[0].mValue = 0.75 + aPoweredScaleVal * 0.5;
        }
        aLayer = Game.Resources["PIEFFECT_LIGHTNING_POWERED_MEGASHARD"].GetLayer(0);
        for (var anEmitterIdx_2 = 0; anEmitterIdx_2 < 2; anEmitterIdx_2++) {
            var anEmitterInstDef_2 = aLayer.mLayerDef.mEmitterInstanceDefVector[anEmitterIdx_2];
            anEmitterInstDef_2.mValues[
                GameFramework.resources.PIEmitterInstanceDef.Value.NUMBER | 0
            ].mValuePointVector[0].mValue =
                this.mCollectorExtendPct.GetOutVal() > 0.0 ? 0.1 + aPoweredScaleVal * 0.9 : 0.0;
        }
        Game.Resources["PIEFFECT_LIGHTNING_POWERED_MEGASHARD"].Update();
        Game.Resources["PIEFFECT_LIGHTNING_POWERED_MEGASHARD"].mColor = GameFramework.gfx.Color.FAlphaToInt(
            this.GetAlpha()
        );
        Game.Resources["PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT"].Update();
        Game.Resources["PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT"].mColor = GameFramework.gfx.Color.FAlphaToInt(
            this.GetAlpha()
        );
        this.mTimeFXManager.Update();
        if (this.mBonusTime > 0) {
            this.mPanicScalePct = Math.max(0, this.mPanicScalePct - 0.01);
        } else {
            this.mPanicScalePct = Math.min(1, this.mPanicScalePct + 0.01);
        }
        if (this.mUpdateCnt > 150 && this.mGameOverCount == 0) {
        }
        if (this.mTimeUpCount > 0 && this.mTimeUpCount < 60) {
            if (this.mUpdateCnt % 2 == 0) {
                this.mX = ((GameFramework.Utils.GetRandFloat() * (60 - this.mTimeUpCount)) / 60.0) * 12.0;
                this.mY = ((GameFramework.Utils.GetRandFloat() * (60 - this.mTimeUpCount)) / 60.0) * 12.0;
            }
        } else {
            this.mX = 0;
            this.mY = 0;
        }
        if (this.mSpeedBonusFlameModePct > 0) {
            if (this.mTimeScaleOverride == 0) {
                var aTicksLeft_2 = this.GetTicksLeft();
                var aFlameTicksLeft = (480.0 * this.mSpeedBonusFlameModePct) | 0;
                if (aTicksLeft_2 * 1.3 < aFlameTicksLeft) {
                    this.mTimeScaleOverride = aTicksLeft_2 / aFlameTicksLeft;
                }
            }
        } else {
            this.mTimeScaleOverride = 0;
        }
    },
    DrawLevelBar: function Game_SpeedBoard$DrawLevelBar(g) {
        var aBarRect = this.GetLevelBarRect();
        var anAlpha = Math.pow(this.GetBoardAlpha(), 4.0);
        var aXOfs = this.GetBoardX() - 523 - 160;
        var aYOfs = this.GetBoardY() - 100;
        var noAdditive = !GameFramework.BaseApp.mApp.get_Is3D();
        aBarRect.mWidth = (this.mLevelBarPct * aBarRect.mWidth + this.mLevelBarSizeBias) | 0;
        var aSnappedStartX = g.GetSnappedX(aBarRect.mX);
        var aSnappedEndX = g.GetSnappedX(aBarRect.mX + aBarRect.mWidth);
        var aSnappedWidth = aSnappedEndX - aSnappedStartX;
        if (!noAdditive) {
            var _t1 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(180, 120, 70, (anAlpha * 255.0) | 0));
            try {
                g.FillRect(aSnappedStartX, aBarRect.mY, aSnappedWidth, aBarRect.mHeight);
            } finally {
                _t1.Dispose();
            }
        }
        if (this.mLevelBarBonusAlpha.GetOutVal() > 0.0) {
            g.PushColor(
                GameFramework.gfx.Color.RGBAToInt(240, 255, 200, (this.mLevelBarBonusAlpha.GetOutVal() * 255.0) | 0)
            );
            g.FillRect(aSnappedStartX, aBarRect.mY, aSnappedWidth, aBarRect.mHeight);
            g.PopColor();
        }
        for (var aBarIdx = 0; aBarIdx < this.mBarInstanceVector.length; aBarIdx++) {
            var aBarInstance = this.mBarInstanceVector[aBarIdx];
            var anImageInst = Game.Resources["IMAGE_BARFILLRED"].CreateImageInstRect(
                (aBarInstance.mSrcX * 1000 * g.mScale) | 0,
                (aBarInstance.mSrcY * 100 * g.mScale) | 0,
                (aSnappedWidth * g.mScale) | 0,
                (aBarRect.mHeight * g.mScale) | 0
            );
            if (!noAdditive) {
                anImageInst.mAdditive = true;
            }
            var _t2 = g.PushColor(
                GameFramework.gfx.Color.RGBAToInt(255, 255, 255, (aBarInstance.mAlpha * anAlpha * 255.0) | 0)
            );
            try {
                g.DrawImage(anImageInst, aSnappedStartX, aBarRect.mY);
            } finally {
                _t2.Dispose();
            }
        }
        if (noAdditive) {
            var _t3 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 160, 60, (anAlpha * 160.0) | 0));
            try {
                g.FillRect(aSnappedStartX, aBarRect.mY, aSnappedWidth, aBarRect.mHeight);
            } finally {
                _t3.Dispose();
            }
        }
    },
    KeyChar: function Game_SpeedBoard$KeyChar(theChar) {
        if (Game.BejApp.mBejApp.mDebugKeysEnabled) {
            var aCursorPiece = this.GetPieceAtScreenXY(this.mLastMouseX | 0, this.mLastMouseY | 0);
            if (theChar == 116) {
                if (aCursorPiece != null) {
                    aCursorPiece.SetFlag(Game.Piece.EFlag.TIME_BONUS);
                    aCursorPiece.mCounter = 5;
                    this.StartTimeBonusEffect(aCursorPiece);
                    return;
                }
            } else if (theChar == 92) {
                this.mTutorialMgr.SetTutorialFlags(0);
                this.mTutorialMgr.SetTutorialEnabled(true);
                this.mBonusTime = 5;
                this.mGameTicks = Math.max(0, (60 - 1) * 60 + 250) | 0;
                this.mGameTicksF = this.mGameTicks;
                return;
            } else if (theChar == 91) {
                this.mGameTicks = Math.max(0, (60 - 5) * 60 + 250) | 0;
                this.mGameTicksF = this.mGameTicks;
                return;
            }
        }
        Game.Board.prototype.KeyChar.apply(this, [theChar]);
    },
    DrawScore: function Game_SpeedBoard$DrawScore(g) {
        g.SetFont(Game.Resources["FONT_SCORE_LARGE"]);
        g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, (255 * this.GetAlpha()) | 0));
        var aScore = GameFramework.Utils.CommaSeperate(this.mDispPoints);
        g.DrawStringEx(aScore, 242, 210, 0, 0);
        g.PopColor();
    },
    DrawFrame: function Game_SpeedBoard$DrawFrame(g) {
        var _t4 = g.PushTranslate(-160, 0);
        try {
            Game.Resources["POPANIM_ANIMS_LIGHTNINGUIBOTTOM"].Draw(g);
        } finally {
            _t4.Dispose();
        }
    },
    GetWarningGlowColor: function Game_SpeedBoard$GetWarningGlowColor() {
        var aTicksLeft = this.GetTicksLeft();
        var aWarningStartTick = this.GetTimeLimit() > 60 ? 1500 : 1000;
        var aMult = (aWarningStartTick - aTicksLeft) / aWarningStartTick;
        if (aTicksLeft == 0) {
            var aTimeLimit = this.GetTimeLimit();
            aMult *= Math.max(0, 120 - (this.mGameTicks - 150 - aTimeLimit * 60)) / 120;
            aMult *= Math.max(0, 1.0 - this.mTimeUpCount / 20.0);
        }
        var c = ((Math.sin(this.mUpdateCnt * 0.15) * 127 + 127) * aMult * this.GetPieceAlpha()) | 0;
        return GameFramework.gfx.Color.RGBAToInt(255, 255, 255, c);
    },
    DrawFrame2: function Game_SpeedBoard$DrawFrame2(g) {
        var _t5 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, (255.0 * this.GetBoardAlpha()) | 0));
        try {
            var aScaledShowPct = 0;
            if (this.mCollectorExtendPct.GetOutVal() > 0.0) {
                aScaledShowPct = Math.pow(this.mCollectorExtendPct.GetOutVal(), 0.5) * 1.0 + 0.0;
            }
            var _t6 = g.PushTranslate(56, -22 + aScaledShowPct * 280);
            try {
                Game.Resources["POPANIM_ANIMS_GEM_MEGA"].Draw(g);
                var _t7 = g.PushTranslate(170, 300);
                try {
                    Game.Resources["PIEFFECT_LIGHTNING_POWERED_MEGASHARD"].Draw(g);
                } finally {
                    _t7.Dispose();
                }
                if (this.WantWarningGlow()) {
                    var _t8 = g.PushColor(this.GetWarningGlowColor());
                    try {
                        g.DrawImage(Game.Resources["IMAGE_LIGHTNING_MEGASHARD_RED_LIGHTNING"], 45, 34);
                    } finally {
                        _t8.Dispose();
                    }
                }
                g.SetFont(Game.Resources["FONT_SCORE"]);
                g.PushColor(
                    GameFramework.gfx.Color.RGBAToInt(
                        255,
                        255,
                        255,
                        (255.0 * this.GetAlpha() * this.mCollectedTimeAlpha.GetOutVal()) | 0
                    )
                );
                Game.Resources["FONT_SCORE"].PushLayerColor("GLOW", 0x9f000000);
                var aTimeDisp = (this.mCollectorExtendPct.GetOutVal() * 60.0 + 0.5) | 0;
                g.DrawStringEx(String.format("+{0:d}:{1:00}", (aTimeDisp / 60) | 0, aTimeDisp % 60), 186, 442, 0, 0);
                Game.Resources["FONT_SCORE"].PopLayerColor("GLOW");
            } finally {
                _t6.Dispose();
            }
            g.PopColor();
            var aXOfs = this.GetBoardX() - 523 - 160;
            var aYOfs = this.GetBoardY() - 130;
            g.DrawImage(Game.Resources["IMAGE_LIGHTNING_TOP_BACK_LIGHTNING"].get_OffsetImage(), aXOfs, aYOfs);
            this.DrawLevelBar(g);
            var _t9 = g.PushTranslate(-160, 0);
            try {
                Game.Resources["POPANIM_ANIMS_LIGHTNINGUI"].Draw(g);
            } finally {
                _t9.Dispose();
            }
            if (this.mLastHurrahAlpha != null && this.mLastHurrahAlpha.get_v() > 0) {
                g.SetFont(Game.Resources["FONT_SPEED_TEXT"]);
                var _t10 = g.PushColor(
                    GameFramework.gfx.Color.FAlphaToInt(this.mLastHurrahAlpha.GetOutVal() * this.GetPieceAlpha())
                );
                try {
                    g.GetFont().PushLayerColor("GLOW", GameFramework.gfx.Color.BLACK_RGB);
                    g.GetFont().PushLayerColor("OUTLINE", GameFramework.gfx.Color.BLACK_RGB);
                    var aScale = 1.25 + Math.sin(this.mLastHurrahUpdates * 0.1) * 0.25;
                    g.PushScale(aScale, aScale, this.GetBoardCenterX(), 75);
                    g.DrawStringEx("Last Hurrah", this.GetBoardCenterX(), 98, 0, 0);
                    g.PopMatrix();
                    g.GetFont().PopLayerColor("GLOW");
                    g.GetFont().PopLayerColor("OUTLINE");
                } finally {
                    _t10.Dispose();
                }
            }
            var _t11 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.GetAlpha()));
            try {
                g.DrawImage(
                    Game.Resources["IMAGE_LIGHTNING_TIMER_LIGHTNING"].get_CenteredImage(),
                    this.GetTimeDrawX() + -2,
                    76
                );
            } finally {
                _t11.Dispose();
            }
            if (this.mTimerGoldPct != null) {
                var _t12 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mTimerGoldPct.GetOutVal()));
                try {
                    g.DrawImage(
                        Game.Resources["IMAGE_LIGHTNING_TIMER_GOLD_LIGHTNING"].get_CenteredImage(),
                        this.GetTimeDrawX() + -2,
                        76
                    );
                } finally {
                    _t12.Dispose();
                }
            }
            this.DrawSpeedBonus(g);
            var _t13 = g.PushTranslate(240, 240);
            try {
                Game.Resources["PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT"].Draw(g);
            } finally {
                _t13.Dispose();
            }
            if (this.WantWarningGlow()) {
                var _t14 = g.PushColor(this.GetWarningGlowColor());
                try {
                    Game.Resources["IMAGE_LIGHTNING_TOP_RED_LIGHTNING"].set_Additive(true);
                    Game.Resources["IMAGE_LIGHTNING_BOTTOM_RED_LIGHTNING"].set_Additive(true);
                    g.DrawImage(Game.Resources["IMAGE_LIGHTNING_TOP_RED_LIGHTNING"].get_OffsetImage(), aXOfs, aYOfs);
                    g.DrawImage(Game.Resources["IMAGE_LIGHTNING_BOTTOM_RED_LIGHTNING"].get_OffsetImage(), aXOfs, aYOfs);
                    g.DrawImage(
                        Game.Resources["IMAGE_LIGHTNING_TIMER_RED_LIGHTNING"].get_CenteredImage(),
                        this.GetTimeDrawX() + -2,
                        76
                    );
                } finally {
                    _t14.Dispose();
                }
            }
            this.DrawScore(g);
        } finally {
            _t5.Dispose();
        }
    },
    WantBaseDrawSpeedBonusText: function Game_SpeedBoard$WantBaseDrawSpeedBonusText() {
        return false;
    },
    DrawOverlay: function Game_SpeedBoard$DrawOverlay(g) {
        this.DrawFrame2(g);
        this.mTimeFXManager.Draw(g);
        Game.Board.prototype.DrawOverlay.apply(this, [g]);
        this.DrawSpeedBonusDynImage(g);
    },
    Draw: function Game_SpeedBoard$Draw(g) {
        Game.Board.prototype.Draw.apply(this, [g]);
    },
    DrawSideUI: function Game_SpeedBoard$DrawSideUI(g) {
        this.DrawBottomWidget(g);
    },
};
Game.SpeedBoard.staticInit = function Game_SpeedBoard$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.SpeedBoard.registerClass("Game.SpeedBoard", Game.Board);
});
JSFExt_AddStaticInitFunc(function () {
    Game.SpeedBoard.staticInit();
});
