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
    Game.Resources['PIEFFECT_LIGHTNING_POWERED_MEGASHARD'].ResetAnim();
    Game.Resources['PIEFFECT_LIGHTNING_POWERED_MEGASHARD'].mDrawTransform.identity();
    Game.Resources['PIEFFECT_LIGHTNING_POWERED_MEGASHARD'].mDrawTransform.scale(1.0, 1.0);
    Game.Resources['PIEFFECT_LIGHTNING_POWERED_MEGASHARD'].mEmitAfterTimeline = true;
    Game.Resources['PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT'].ResetAnim();
    Game.Resources['PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT'].mDrawTransform.identity();
    Game.Resources['PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT'].mDrawTransform.scale(1.0, 1.0);
    Game.Resources['PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT'].mEmitAfterTimeline = true;
    Game.Resources['POPANIM_ANIMS_GEM_MEGA'].mPIEffectIdSearchVector = [];
    Game.Resources['POPANIM_ANIMS_GEM_MEGA'].mPIEffectIdSearchVector.push('PIEFFECT_ANIMS_GEM_MEGA_');
    this.mCurTempo = 0;
}
Game.SpeedBoard.prototype = {
    mPreHurrahPoints : 0,
    mSpeedTier : 0,
    mPointsGoal : 0,
    mPrevPointsGoal : 0,
    mPMDropLevel : 0,
    mUsePM : null,
    mUseCheckpoints : null,
    mDidTimeUp : null,
    mTimeUpAnnouncement : null,
    mTimeFXManager : null,
    mHumSoundEffect : null,
    mTimeUpCount : 0,
    mTotalGameTicks : 0,
    mBonusTime : 0,
    mTotalBonusTime : 0,
    mBonusTimeDisp : 0,
    mTimedPenaltyAmnesty : 0,
    mTimedPenaltyVel : 0,
    mTimedPenaltyAccel : 0,
    mTimedPenaltyJerk : 0,
    mTimedLevelBonus : 0,
    mBonusPenalty : 0,
    mPointMultiplierStart : 0,
    mAddPointMultiplierPerLevel : 0,
    mReadyForDrop : null,
    mWantGemsCleared : 0,
    mDropGameTick : 0,
    mTimeStart : 0,
    mTimeChange : 0,
    mMaxTicksLeft : 0,
    mPointsGoalStart : 0,
    mAddPointsGoalPerLevel : 0,
    mPointsGoalAddPower : 0,
    m5SecChance : null,
    m10SecChance : null,
    mTimeStep : 0,
    mLevelTimeStep : 0,
    mGameTicksF : 0,
    mTimeScaleOverride : 0,
    mCollectorExtendPct : null,
    mCollectedTimeAlpha : null,
    mTimerGoldPct : null,
    mLastHurrahAlpha : null,
    mLastHurrahUpdates : 0,
    mPanicScalePct : 0,
    mCurUIFrameLabel : null,
    mCurTempo : 0,
    Dispose : function Game_SpeedBoard$Dispose() {
        if(this.mTimeFXManager != null) {
            this.mTimeFXManager.Dispose();
        }
        this.mTimeFXManager = null;
        Game.Board.prototype.Dispose.apply(this);
    },
    GetGameType : function Game_SpeedBoard$GetGameType() {
        return 'Speed';
    },
    GetMusicName : function Game_SpeedBoard$GetMusicName() {
        return 'Speed';
    },
    AllowSpeedBonus : function Game_SpeedBoard$AllowSpeedBonus() {
        return true;
    },
    GetHintTime : function Game_SpeedBoard$GetHintTime() {
        return 5;
    },
    Init : function Game_SpeedBoard$Init() {
        Game.Board.prototype.Init.apply(this);
        this.UIBlendTo('unpowered', 0);
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
        this.m5SecChance.Init('b+0,0.05,1,8,yilV `Jvb2        A/###');
        this.m10SecChance.Init('b+0,0.007,1,8,~q+p         ~/###');
        this.mTimedPenaltyVel = 0.0;
        this.mTimedPenaltyAccel = 0.0;
        this.mTimedPenaltyJerk = 0.0;
        this.mTimedLevelBonus = 0.0;
        this.mTimeStep = 2.0;
        this.mLevelTimeStep = 8.0;
        this.mPointMultiplierStart = 0.0;
        this.mAddPointMultiplierPerLevel = 0.0;
        this.mUseCheckpoints = (this.mPointsGoalStart > 0) && (this.mTimeStart > 0);
        this.mMaxTicksLeft = 60 * 60;
        this.mPanicScalePct = 0;
        this.mGameTicksF = 0;
        this.mTimeScaleOverride = 0;
        this.mCurTempo = 0;
        this.mCollectedTimeAlpha.SetConstant(1.0);
        this.mCollectorExtendPct.SetConstant(0);
        this.mLastHurrahAlpha.SetConstant(0);
    },
    UIBlendTo : function Game_SpeedBoard$UIBlendTo(theFrameLabel, theBlendTicks) {
        this.mCurUIFrameLabel = theFrameLabel;
        Game.Resources['POPANIM_ANIMS_LIGHTNINGUIBOTTOM'].Play(theFrameLabel, false);
        Game.Resources['POPANIM_ANIMS_LIGHTNINGUI'].Play(theFrameLabel, false);
        Game.Resources['POPANIM_ANIMS_GEM_MEGA'].Play(theFrameLabel, false);
    },
    ExtraTutorialSetup : function Game_SpeedBoard$ExtraTutorialSetup() {
        if(this.mTutorialMgr.GetTutorialSequence() != null) {
            this.mGoDelayCount = 50;
            this.SetTutorialCleared(Game.DM.ETutorial.SPEED_TUTORIAL_BASIC_MATCH, false);
            this.SetTutorialCleared(Game.DM.ETutorial.SPEED_TUTORIAL_TIMER, false);
            this.SetTutorialCleared(Game.DM.ETutorial.SPEED_TUTORIAL_TIME_GEM, false);
            this.SetTutorialCleared(Game.DM.ETutorial.SPEED_TUTORIAL_MULTIPLIER_UP, false);
            var gridLayout = '04166423' + '12344654' + '54211212' + '23540355' + '6112t332' + '34264125' + '61465133' + '61351542';
            for(var i = 0; i < gridLayout.length; ++i) {
                if(gridLayout.charCodeAt(i) == 116) {
                    var demoBlastPiece = this.mBoard[this.mBoard.mIdxMult0 * (((i / Game.Board.NUM_COLS) | 0)) + i % Game.Board.NUM_COLS];
                    demoBlastPiece.SetFlag(Game.Piece.EFlag.TIME_BONUS);
                    demoBlastPiece.mColor = Game.DM.EGemColor.BLUE;
                    demoBlastPiece.mCounter = 5;
                    this.StartTimeBonusEffect(demoBlastPiece);
                } else if(gridLayout.charCodeAt(i) != 63) {
                    this.mBoard[this.mBoard.mIdxMult0 * (((i / Game.Board.NUM_COLS) | 0)) + i % Game.Board.NUM_COLS].mColor = (gridLayout.charCodeAt(i) - 48);
                }
            }
            this.mGameTicks += 120;
            this.mGameTicksF += 120.0;
        }
    },
    GetTutorialSequence : function Game_SpeedBoard$GetTutorialSequence() {
        if(!this.WantsTutorial(Game.DM.ETutorial.SPEED_TUTORIAL_TIME_GEM)) {
            return null;
        }
        var ret = new Game.TutorialSequence();
        ret.mBoardSeed = 4321;
        var aStep = new Game.TutorialStep();
        aStep.mType = Game.TutorialStep.EType.ModalDialogMoveClear;
        aStep.mTextHeader = 'Speed Mode';
        aStep.mText = 'Swap adjacent gems to make a set of 3 in a row!';
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
        aStep.mTextHeader = 'Timer';
        aStep.mText = '... but watch the clock! You only have 60 seconds to start with.';
        aStep.mTutorialId = Game.DM.ETutorial.SPEED_TUTORIAL_TIMER;
        aStep.mBlockTimer = Game.TutorialStep.EBlockTimerType.PauseAfterParam;
        aStep.mBlockTimerParam = 6 * 60;
        aStep.mSpecialBehavior = Game.TutorialStep.ESpecialBehavior.Timer;
        aStep.mHighlightRect = new GameFramework.TRect(490, 0, 1100, 150);
        aStep.mDialogAnchorX = 602.0;
        aStep.mDialogAnchorY = 180.0;
        aStep.mDialogWidth = 890.0;
        aStep.mShowOkBtnCv = new GameFramework.CurvedVal();
        aStep.mShowOkBtnCv.SetCurveRef('SpeedBoard_cs_11_15_11__17_35_36_339');
        aStep.mArrowDir = Game.TutorialStep.EArrowDir.Right;
        aStep.mArrowX = 1500;
        aStep.mArrowY = 72;
        aStep.mDelay = 15;
        aStep.mBlockDuringDelay = true;
        ret.Add(aStep);
        aStep = new Game.TutorialStep();
        aStep.mType = Game.TutorialStep.EType.ModalDialogMoveClear;
        aStep.mBlockTimer = Game.TutorialStep.EBlockTimerType.Pause;
        aStep.mTextHeader = 'Time Gem';
        aStep.mText = 'Score big to earn ^007700^TIME GEMS^oldclr^. Match these to collect Bonus Time!';
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
        if(this.WantsTutorial(Game.DM.ETutorial.CLASSIC_TUTORIAL_HINT_BUTTON)) {
            aStep = new Game.TutorialStep();
            aStep.mType = Game.TutorialStep.EType.ModalDialog;
            aStep.mTextHeader = 'Hints';
            aStep.mText = 'If you are stuck, use the ^007700^HINT^oldclr^ Button to find a match.';
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
            var xDelta = this.mHintButton.mWidth * (oversizeScale - 1.0) / 2.0;
            var yDelta = this.mHintButton.mHeight * (oversizeScale - 1.0) / 2.0;
            aStep.mHighlightRect = new GameFramework.TRect(this.mHintButton.mX - xDelta, this.mHintButton.mY - yDelta, this.mHintButton.mWidth * oversizeScale, this.mHintButton.mHeight * oversizeScale);
            aStep.mDelay = 0;
            aStep.mBlockDuringDelay = true;
            ret.Add(aStep);
        }
        return ret;
    },
    MenuButtonPressed : function Game_SpeedBoard$MenuButtonPressed(e) {
        Game.Board.prototype.MenuButtonPressed.apply(this, [e]);
    },
    GetBoardY : function Game_SpeedBoard$GetBoardY() {
        return 130;
    },
    GetTooltipText : function Game_SpeedBoard$GetTooltipText(thePiece, theHeader, theBody) {
        if(Game.Board.prototype.GetTooltipText.apply(this, [thePiece, theHeader, theBody])) {
            return true;
        } else if(thePiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS)) {
            theHeader = 'TIME GEM';
            theBody = 'Match this Gem to add ' + GameFramework.Utils.CommaSeperate(thePiece.mCounter) + ' seconds to the clock!';
            return true;
        }
        return false;
    },
    GameOverExit : function Game_SpeedBoard$GameOverExit() {
        var table = Game.BejApp.mBejApp.mHighScoreMgr.GetOrCreateTable('Lightning');
        if(table.Submit(Game.BejApp.mBejApp.mProfile.mProfileName, this.mPoints)) {
            Game.BejApp.mBejApp.SaveHighscores(false);
        }
        var anEndLevelDialog = new Game.SpeedEndLevelDialog(this);
        Game.BejApp.mBejApp.mDialogMgr.AddDialog(anEndLevelDialog);
        anEndLevelDialog.SetQuestName('Lightning');
        Game.BejApp.mBejApp.mProfile.WriteProfile();
    },
    GameOverAnnounce : function Game_SpeedBoard$GameOverAnnounce() {
        new Game.Announcement(this, 'TIME UP');
        Game.SoundUtil.Play(Game.Resources['SOUND_VOICE_TIMEUP']);
    },
    PieceTallied : function Game_SpeedBoard$PieceTallied(thePiece) {
        if(thePiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS)) {
            this.mBonusTime += thePiece.mCounter;
            this.mTotalBonusTime += thePiece.mCounter;
            var fx = new Game.SpeedCollectEffect(this, new GameFramework.geom.TIntPoint((thePiece.CX() | 0), (thePiece.CY() | 0)), new GameFramework.geom.TIntPoint(240, 430), thePiece.mCounter, 1.0);
            this.mTimeFXManager.AddEffect(fx);
            fx.Init(thePiece);
            thePiece.mAlpha.SetConstant(0);
            if(thePiece.mCounter == 5) {
                Game.SoundUtil.Play(Game.Resources['SOUND_SPEEDBOARD_TIMEBONUS_5']);
            } else {
                Game.SoundUtil.Play(Game.Resources['SOUND_SPEEDBOARD_TIMEBONUS_10']);
            }
            var aTimeOver = ((Math.max(0, this.mBonusTime - 60)) | 0);
            if(aTimeOver > 0) {
                var aPoints = this.AddPoints((thePiece.CX() | 0), (thePiece.CY() | 0), thePiece.mCounter * 50, Game.DM.gGemColors[(thePiece.mColor | 0)], thePiece.mMatchId, true, true, thePiece.mMoveCreditId, false, Game.Board.EPointType.SPECIAL);
            }
            var aString = String.format('+{0:d} sec', thePiece.mCounter);
            var aNewPoints = new Game.Points(Game.BejApp.mBejApp, Game.Resources['FONT_DIALOG_HEADER'], aString, (thePiece.CX() | 0), (thePiece.CY() | 0), 1.0, 0, Game.DM.gGemColors[(thePiece.mColor | 0)], -1);
            aNewPoints.mDestScale = 1.5;
            aNewPoints.mScaleDifMult = 0.2;
            aNewPoints.mScaleDampening = 0.8;
            aNewPoints.mDY *= 0.2;
        }
        Game.Board.prototype.PieceTallied.apply(this, [thePiece]);
    },
    GetLevelBarRect : function Game_SpeedBoard$GetLevelBarRect() {
        var aX = this.GetBoardCenterX();
        var aY = this.GetBoardY() + -55;
        var aBarRect = new GameFramework.TRect(0, 0, Game.Resources['IMAGE_LIGHTNING_TOP_BACK_LIGHTNING'].mWidth, Game.Resources['IMAGE_LIGHTNING_TOP_BACK_LIGHTNING'].mHeight);
        aBarRect.Offset(aX - aBarRect.mWidth / 2, aY - aBarRect.mHeight / 2);
        aBarRect.mWidth -= 120;
        return aBarRect;
    },
    GetCountdownBarRect : function Game_SpeedBoard$GetCountdownBarRect() {
        return this.GetLevelBarRect();
    },
    GetTimeDrawX : function Game_SpeedBoard$GetTimeDrawX() {
        var aLevelBarRect = this.GetLevelBarRect();
        return aLevelBarRect.mX + (aLevelBarRect.mWidth * this.mLevelBarPct) + 64;
    },
    CanTimeUp : function Game_SpeedBoard$CanTimeUp() {
        if(this.mBonusTime == 0) {
            return Game.Board.prototype.CanTimeUp.apply(this);
        }
        return true;
    },
    GetTicksLeft : function Game_SpeedBoard$GetTicksLeft() {
        var aTimeLimit = this.GetTimeLimit();
        if(aTimeLimit == 0) {
            return -1;
        }
        var anAmnesty = 150;
        var aTicksLeft = (Math.min(((aTimeLimit * 60.0) | 0), Math.max(0, ((aTimeLimit * 60.0) | 0) - Math.max(0, (this.mGameTicksF | 0) - anAmnesty))) | 0);
        return ((Math.min(this.mMaxTicksLeft, aTicksLeft)) | 0);
    },
    GetTimeLimit : function Game_SpeedBoard$GetTimeLimit() {
        return 60;
    },
    GetLevelPoints : function Game_SpeedBoard$GetLevelPoints() {
        return this.mPointsGoalStart + this.mAddPointsGoalPerLevel * this.mSpeedTier;
    },
    GetLevelPointsTotal : function Game_SpeedBoard$GetLevelPointsTotal() {
        return this.mLevelPointsTotal - (this.mBonusPenalty | 0);
    },
    LevelUp : function Game_SpeedBoard$LevelUp() {
        this.mSpeedTier++;
        this.mBonusPenalty = 0;
        this.mLevelPointsTotal = 0;
        this.mTimedPenaltyAmnesty = 500;
        var aTimeToAdvance = this.mTimedLevelBonus;
        this.mTimedPenaltyVel = Math.max(0.0, this.mTimedPenaltyVel - this.mTimedPenaltyAccel * aTimeToAdvance);
        this.mTimedPenaltyAccel = Math.max(0.0, this.mTimedPenaltyAccel - this.mTimedPenaltyJerk * aTimeToAdvance);
        Game.SoundUtil.Play(Game.Resources['SOUND_SPEEDBOARD_BACKGROUND_CHANGE']);
    },
    WantExpandedTopWidget : function Game_SpeedBoard$WantExpandedTopWidget() {
        return 1;
    },
    GetTopWidgetButtonText : function Game_SpeedBoard$GetTopWidgetButtonText() {
        return Game.Board.prototype.GetTopWidgetButtonText.apply(this);
    },
    GetModePointMultiplier : function Game_SpeedBoard$GetModePointMultiplier() {
        return 5;
    },
    GetRankPointMultiplier : function Game_SpeedBoard$GetRankPointMultiplier() {
        return 85000.0 / 15000.0;
    },
    GameOver : function Game_SpeedBoard$GameOver(visible) {
        if(visible === undefined) {
            visible = true;
        }
        if(this.mTimeFXManager.GetActiveCount() > 0) {
            return;
        }
        if((this.mBonusTime == 0) && ((this.mPointsBreakdown.length | 0) <= this.mPointMultiplier)) {
            this.AddPointBreakdownSection();
        }
        for(var aPieceIter = new Game.PieceIter(this); aPieceIter.Next();) {
            var aPiece = aPieceIter.GetPiece();
            if(aPiece == null) {
                continue;
            }
            if(aPiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS)) {
                if(this.mBonusTime == 0) {
                    var aPoints = this.AddPoints((aPiece.CX() | 0), (aPiece.CY() | 0), aPiece.mCounter * 50, Game.DM.gGemColors[(aPiece.mColor | 0)], aPiece.mMatchId, true, true, aPiece.mMoveCreditId, false, Game.Board.EPointType.SPECIAL);
                    aPoints.mTimer *= 1.5;
                } else {
                    if(aPiece.mCounter >= 10) {
                        this.Laserify(aPiece);
                    } else {
                        this.Flamify(aPiece);
                    }
                }
                aPiece.ClearFlag(Game.Piece.EFlag.TIME_BONUS);
                aPiece.mCounter = 0;
            }
        }
        if(this.mBonusTime > 0) {
            this.mTimeExpired = false;
            if(this.WantsTutorial(Game.DM.ETutorial.SPEED_TUTORIAL_MULTIPLIER_UP)) {
                var aSeq = this.mTutorialMgr.GetTutorialSequence();
                if(aSeq == null) {
                    aSeq = new Game.TutorialSequence();
                    this.mTutorialMgr.SetTutorialSequence(aSeq);
                }
                if(!aSeq.HasTutorialQueued(Game.DM.ETutorial.SPEED_TUTORIAL_MULTIPLIER_UP)) {
                    var aStep = new Game.TutorialStep();
                    aStep.mType = Game.TutorialStep.EType.ModalDialogOkBtnClear;
                    aStep.mTextHeader = 'Bonus Round';
                    aStep.mText = 'If you have Bonus Time stored, you\'ll get a ^007700^BONUS ROUND^oldclr^ when time runs out.\n\nEach ^007700^BONUS ROUND^oldclr^ ups your multiplier by 1!';
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
                    aStep.mShowOkBtnCv.SetCurveRef('SpeedBoard_cs_11_15_11__17_35_36_339');
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
        if(this.mSpeedBonusFlameModePct > 0) {
            return;
        }
        var aHurrahPieceCount = 0;
        this.mCursorSelectPos = new GameFramework.geom.TIntPoint(-1, -1);
        var aSpecialCount = 0;
        if(!this.mDidTimeUp) {
            this.mPreHurrahPoints = this.mPoints;
            this.mCollectedTimeAlpha.SetCurve('b;0,1,0.05,1,~###         ~####');
            this.UIBlendTo('death', 15);
            var aMusicFade = new GameFramework.CurvedVal();
            aMusicFade.SetCurveRef('SpeedBoard_cs_11_21_11__05_58_39_924');
            Game.BejApp.mBejApp.PlayMusic(Game.Resources.SOUND_MUSIC_SPEED_END_ID, aMusicFade, false);
            Game.SoundUtil.Play(Game.Resources['SOUND_BOMB_EXPLODE']);
            Game.SoundUtil.Play(Game.Resources['SOUND_VOICE_TIMEUP']);
            this.mDidTimeUp = true;
            new Game.Announcement(this, 'TIME UP');
        }
        if(this.mSpeedBonusCount > 0) {
            this.EndSpeedBonus();
        }
        var hasCoin = false;
        for(var aPieceIter_2 = new Game.PieceIter(this); aPieceIter_2.Next();) {
            var aPiece_2 = aPieceIter_2.GetPiece();
            if(aPiece_2 == null) {
                continue;
            }
            hasCoin |= aPiece_2.IsFlagSet(Game.Piece.EFlag.COIN);
            if((aPiece_2.IsFlagSet(Game.Piece.EFlag.FLAME)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.LASER)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.DETONATOR)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.SCRAMBLE)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.BLAST_GEM)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.TIME_BONUS))) {
                if(aPiece_2.IsFlagSet(Game.Piece.EFlag.COIN)) {
                    aPiece_2.mDestructing = true;
                }
                if(this.mTimeUpCount == 0) {
                    aPiece_2.mExplodeDelay = 175 + aSpecialCount * 25;
                } else {
                    aPiece_2.mExplodeDelay = 25 + aSpecialCount * 25;
                }
                aSpecialCount++;
                aHurrahPieceCount++;
            }
        }
        if(aSpecialCount == 0) {
            for(var aPieceIter_3 = new Game.PieceIter(this); aPieceIter_3.Next();) {
                var aPiece_3 = aPieceIter_3.GetPiece();
                if(aPiece_3 == null) {
                    continue;
                }
                if((aPiece_3.IsFlagSet(Game.Piece.EFlag.COIN)) && (!aPiece_3.mTallied)) {
                    if(aPiece_3.IsFlagSet(Game.Piece.EFlag.COIN)) {
                        aPiece_3.mDestructing = true;
                    }
                    this.TallyPiece(aPiece_3, true);
                    aPiece_3.mAlpha.SetConstant(1.0);
                    aPiece_3.ClearFlag(Game.Piece.EFlag.COIN);
                    aSpecialCount++;
                }
            }
        }
        if((aSpecialCount > 0) && (this.mLastHurrahAlpha.GetOutVal() == 0)) {
            this.mLastHurrahAlpha.SetCurve('b+0,1,0.008333,1,####    v####     +~###');
            this.mLastHurrahUpdates = 0;
        }
        var aWantCoinStart = (aHurrahPieceCount == 0) ? 125 : 200;
        if((aSpecialCount == 0)) {
            Game.Board.prototype.GameOver.apply(this, [false]);
            if(this.mLastHurrahAlpha.GetOutVal() > 0) {
                this.mGameOverCount = 200;
                this.mLastHurrahAlpha.SetCurve('b+0,1,0.01,1,~###     N~###    R####');
            }
        }
    },
    DoMultiplierUp : function Game_SpeedBoard$DoMultiplierUp() {
        if(this.IsGameSuspended()) {
            return;
        }
        Game.SoundUtil.Play(Game.Resources['SOUND_SPEEDBOARD_LIGHTNING_ENERGIZE']);
        this.UIBlendTo('energize', 15);
        this.mCollectorExtendPct.SetCurveMult('b;0,1,0.01,1,~###         ~####');
        this.mTimerGoldPct.SetCurve('b;0,1,0.01,1,####  K~###       U####');
        this.m5SecChance.Step$2(this.mLevelTimeStep);
        this.m10SecChance.Step$2(this.mLevelTimeStep);
        this.m5SecChance.mChance.IncInValBy(this.m5SecChance.mChance.mIncRate);
        this.m10SecChance.mChance.IncInValBy(this.m10SecChance.mChance.mIncRate);
        this.mTimeExpired = false;
        var multiplierSnd = Game.Resources['SOUND_SPEEDBOARD_MULTIPLIER_UP2_1'];
        switch(Math.min(3, this.mPointMultiplier - 1)) {
            case 1:
            {
                multiplierSnd = Game.Resources['SOUND_SPEEDBOARD_MULTIPLIER_UP2_2'];
                break;
            }
            case 2:
            {
                multiplierSnd = Game.Resources['SOUND_SPEEDBOARD_MULTIPLIER_UP2_3'];
                break;
            }
            case 3:
            {
                multiplierSnd = Game.Resources['SOUND_SPEEDBOARD_MULTIPLIER_UP2_4'];
                break;
            }
        }
        Game.SoundUtil.Play(multiplierSnd);
        this.mPrevPointMultAlpha.SetCurve('b+0,1,0.01,1,~###         ~####');
        this.mPointMultPosPct.SetCurve('b+0,1,0.008333,1,~###         ~~###');
        this.mPointMultTextMorph.SetConstant(0);
        this.mPointMultScale.SetCurveLinked('b+0,1.2,0,1,####    {~###     &####', this.mPointMultPosPct);
        this.mPointMultAlpha.SetCurveLinked('b+0,1,0,1,####  `~###    v~###  I####', this.mPointMultPosPct);
        this.mPointMultYAdd.SetCurveLinked('b+0,-80,0,1,####         ~####', this.mPointMultPosPct);
        this.mPointMultiplier++;
        this.AddPointBreakdownSection();
        this.mMaxTicksLeft = this.mBonusTime * 60;
        this.mGameTicks = ((Math.max(0, (60 - this.mBonusTime) * 60 + -0)) | 0);
        this.mGameTicksF = this.mGameTicks;
        this.mBonusTime = 0;
        this.mTimeScaleOverride = 0;
        var anEffect = new Game.LightningBarFillEffect();
        anEffect.mOverlay = true;
        this.mPostFXManager.AddEffect(anEffect);
    },
    AddPoints : function Game_SpeedBoard$AddPoints(theX, theY, thePoints, theColor, theId, addtotube, usePointMultiplier, theMoveCreditId, theForceAdd, thePointType) {
        var aPrevPoints = this.mPoints;
        var aPoint = Game.Board.prototype.AddPoints.apply(this, [theX, theY, thePoints, theColor, theId, addtotube, usePointMultiplier, theMoveCreditId, theForceAdd, thePointType]);
        var aPointDelta = this.mPoints - aPrevPoints;
        return aPoint;
    },
    WantSpecialPiece : function Game_SpeedBoard$WantSpecialPiece(thePieceVector) {
        if(this.mUsePM) {
            return (this.mPMDropLevel < this.mSpeedTier) && (this.mSpeedTier < 8);
        } else if(this.mTimeStart == 0) {
            return (this.mPMDropLevel < this.mSpeedTier) && (this.mSpeedTier < 8);
        } else {
            var mDroppingBlastGem = false;
            if((this.mReadyForDrop) && (this.mWantGemsCleared != 0) && (!this.mDidTimeUp)) {
                if(mDroppingBlastGem) {
                    return true;
                }
            }
            return false;
        }
    },
    WantWarningGlow : function Game_SpeedBoard$WantWarningGlow() {
        if(this.mBonusTime != 0) {
            return false;
        }
        return Game.Board.prototype.WantWarningGlow.apply(this);
    },
    StartTimeBonusEffect : function Game_SpeedBoard$StartTimeBonusEffect(thePiece) {
        var anEffectBottom = new Game.TimeBonusEffectTop(thePiece);
        anEffectBottom.mX = ((Game.Board.GEM_WIDTH / 2) | 0);
        anEffectBottom.mY = ((Game.Board.GEM_HEIGHT / 2) | 0);
        anEffectBottom.mZ = 0.08;
        this.mPostFXManager.AddEffect(anEffectBottom);
        var anEffect = new Game.TimeBonusEffect(thePiece);
        anEffect.mX = ((Game.Board.GEM_WIDTH / 2) | 0);
        anEffect.mY = ((Game.Board.GEM_HEIGHT / 2) | 0);
        anEffect.mZ = 0.08;
        this.mPostFXManager.AddEffect(anEffect);
    },
    GetLevelPct : function Game_SpeedBoard$GetLevelPct() {
        var aLevelPct = 0.0;
        var aLevelPoints = this.GetLevelPoints();
        if(aLevelPoints > 0) {
            var aLevelPointsTotal = this.GetLevelPointsTotal();
            aLevelPct = Math.min(1.0, Math.max(0.0, 0.5 + (aLevelPointsTotal / aLevelPoints) * 0.5));
            if(this.mDidTimeUp) {
                aLevelPct = 0;
            }
            if((aLevelPct <= 0.0) && (this.IsBoardStill()) && (this.mGameOverCount == 0)) {
                this.mTimeExpired = true;
                this.GameOver();
            }
            var aTicksLeft = ((aLevelPct * 4000.0) | 0);
            var aTimeBetweenWarnings = 35 + ((aTicksLeft * 0.1) | 0);
            if((this.mUpdateCnt - this.mLastWarningTick >= aTimeBetweenWarnings) && (aTicksLeft > 0) && (aTicksLeft <= 1000)) {
                Game.SoundUtil.PlayEx(Game.Resources['SOUND_COUNTDOWN_WARNING'], 0.0, Math.min(1.0, 0.5 - aTicksLeft * 0.0005));
                this.mLastWarningTick = this.mUpdateCnt;
            }
            return aLevelPct;
        }
        var aTimeLimit = this.GetTimeLimit();
        var writeTicksLeft = (this.mUpdateCnt % 20) == 0;
        if(aTimeLimit != 0) {
            aLevelPct = Math.max(0.0, this.GetTicksLeft() / (aTimeLimit * 60.0));
            if((aLevelPct <= 0.0) && (this.IsBoardStill()) && (this.mGameOverCount == 0)) {
                this.mTimeExpired = true;
                this.GameOver();
            }
            var aTicksLeft_2 = this.GetTicksLeft();
            var aTimeBetweenWarnings_2 = 35 + ((aTicksLeft_2 * 0.1) | 0);
            if(this.mUseCheckpoints) {
                if((this.mUpdateCnt - this.mLastWarningTick >= aTimeBetweenWarnings_2) && (aTicksLeft_2 > 0) && (aTicksLeft_2 <= 1000)) {
                    Game.SoundUtil.PlayEx(Game.Resources['SOUND_COUNTDOWN_WARNING'], 0.0, Math.min(1.0, 0.5 - aTicksLeft_2 * 0.0005));
                    this.mLastWarningTick = this.mUpdateCnt;
                }
            } else {
                if((this.mUpdateCnt - this.mLastWarningTick >= aTimeBetweenWarnings_2) && (aTicksLeft_2 > 0) && (this.WantWarningGlow()) && (!this.mKilling)) {
                    var aWarningStartTick = (this.GetTimeLimit() > 60) ? 1500 : 1000;
                    Game.SoundUtil.PlayEx(Game.Resources['SOUND_COUNTDOWN_WARNING'], 0.0, Math.min(1.0, 0.5 - aTicksLeft_2 / aWarningStartTick / 2.0));
                    this.mLastWarningTick = this.mUpdateCnt;
                }
            }
            if((aTicksLeft_2 == 30 * 60) && (this.mLevelCompleteCount == 0)) {
                if(this.mDoThirtySecondVoice) {
                    writeTicksLeft = true;
                    this.mDoThirtySecondVoice = false;
                    Game.SoundUtil.Play(Game.Resources['SOUND_VOICE_THIRTYSECONDS']);
                }
            } else {
                this.mDoThirtySecondVoice = true;
            }
        }
        if(this.mUseCheckpoints) {
            aLevelPct = (this.mPoints - this.mPrevPointsGoal) / (this.mPointsGoal - this.mPrevPointsGoal);
        }
        return aLevelPct;
    },
    GetCountdownPct : function Game_SpeedBoard$GetCountdownPct() {
        return this.GetLevelPct();
    },
    DropSpecialPiece : function Game_SpeedBoard$DropSpecialPiece(thePieceVector) {
        if(this.mUsePM) {
            var anIdx = GameFramework.Utils.GetRand() % (thePieceVector.length | 0);
            for(var aTryCount = 0; aTryCount < 7; aTryCount++) {
                thePieceVector[anIdx].mColor = (this.mRand.Next() % (Game.DM.EGemColor._COUNT | 0));
                var aColorCount = 0;
                for(var aPieceIter = new Game.PieceIter(this); aPieceIter.Next();) {
                    var aPiece = aPieceIter.GetPiece();
                    if(aPiece != null && (aPiece.GetScreenY() > 0) && (aPiece.mColor == thePieceVector[anIdx].mColor)) {
                        aColorCount++;
                    }
                }
                if(aColorCount > 3) {
                    break;
                }
            }
            thePieceVector[anIdx].SetFlag(Game.Piece.EFlag.POINT_MULTIPLIER);
            this.mPMDropLevel++;
        } else {
            var anIdx_2 = ((this.mRand.Next() % (thePieceVector.length | 0)) | 0);
            for(var aTryCount_2 = 0; aTryCount_2 < 7; aTryCount_2++) {
                thePieceVector[anIdx_2].mColor = (this.mRand.Next() % (Game.DM.EGemColor._COUNT | 0));
                var aColorCount_2 = 0;
                for(var aPieceIter_2 = new Game.PieceIter(this); aPieceIter_2.Next();) {
                    var aPiece_2 = aPieceIter_2.GetPiece();
                    if(aPiece_2 == null) {
                        continue;
                    }
                    if((aPiece_2.mY > 0) && (aPiece_2.mColor == thePieceVector[anIdx_2].mColor)) {
                        aColorCount_2++;
                    }
                }
                if(aColorCount_2 > 3) {
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
    PiecesDropped : function Game_SpeedBoard$PiecesDropped(thePieceVector) {
        var aTimeAdd = 0;
        for(var i = 0; i < (thePieceVector.length | 0); i++) {
            var aPiece = thePieceVector[i];
            aPiece.mY += 120;
        }
        if((this.mGameTicks > 60) && (!this.mTimeExpired)) {
            for(var i_2 = 0; i_2 < (thePieceVector.length | 0); i_2++) {
                this.m5SecChance.Step();
                this.m10SecChance.Step();
                if(this.m10SecChance.Check((this.mRand.Next() % 100000) / 100000.0)) {
                    aTimeAdd = 10;
                } else if(this.m5SecChance.Check((this.mRand.Next() % 100000) / 100000.0)) {
                    aTimeAdd = 5;
                }
            }
        }
        if(aTimeAdd > 0) {
            var anIdx = ((this.mRand.Next() % (thePieceVector.length | 0)) | 0);
            var aPiece_2 = thePieceVector[anIdx];
            if(aPiece_2.mFlags == 0) {
                aPiece_2.SetFlag(Game.Piece.EFlag.TIME_BONUS);
                aPiece_2.mCounter = aTimeAdd;
                if(aPiece_2.mCounter == 5) {
                    Game.SoundUtil.PlayEx(Game.Resources['SOUND_SPEEDBOARD_TIMEBONUS_APPEARS_5'], this.GetPanPositionByPiece(aPiece_2), 1.0);
                } else {
                    Game.SoundUtil.PlayEx(Game.Resources['SOUND_SPEEDBOARD_TIMEBONUS_APPEARS_10'], this.GetPanPositionByPiece(aPiece_2), 1.0);
                }
            }
        }
        return true;
    },
    TimeCollected : function Game_SpeedBoard$TimeCollected(theTimeCollected) {
        if(theTimeCollected <= 5) {
            Game.SoundUtil.Play(Game.Resources['SOUND_SPEEDBOARD_LIGHTNING_TUBE_FILL_5']);
        } else {
            Game.SoundUtil.Play(Game.Resources['SOUND_SPEEDBOARD_LIGHTNING_TUBE_FILL_10']);
        }
        var aLastVal = this.mCollectorExtendPct.GetOutVal();
        this.mCollectorExtendPct.SetCurve('b;0,1,0.02,1,#.^$         ~~###');
        this.mCollectorExtendPct.mOutMin = aLastVal;
        this.mCollectorExtendPct.mOutMax = Math.min(1.0, this.mBonusTime / 60.0);
        this.UIBlendTo(String.format('pulse{0:d}', Math.min(5, ((this.mBonusTime * 5 / 60) | 0) + 1)), 12);
        if((this.mCollectorExtendPct.GetOutVal() == 0.0)) {
            var anEffect = new Game.ParticleEffect(Game.Resources['PIEFFECT_LIGHTNING_STEAMPULSE']);
            anEffect.mX = 245;
            anEffect.mY = 255;
            anEffect.mOverlay = true;
            this.mPostFXManager.AddEffect(anEffect);
        }
    },
    StartPieceEffect : function Game_SpeedBoard$StartPieceEffect(thePiece) {
        Game.Board.prototype.StartPieceEffect.apply(this, [thePiece]);
        if(thePiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS)) {
            this.StartTimeBonusEffect(thePiece);
        }
    },
    Update : function Game_SpeedBoard$Update() {
        var aPrevGameTick = this.mGameTicks;
        this.mLastHurrahAlpha.IncInVal();
        this.mLastHurrahUpdates++;
        Game.Board.prototype.Update.apply(this);
        this.mBackground.mWantAnim = false;
        if(this.mGameTicks != aPrevGameTick) {
            var aPrevTicksI = (this.mGameTicksF | 0);
            if(this.mTimeScaleOverride == 0) {
                var aTimeScale = Math.min(1.0, 0.7 + (this.GetTicksLeft() / 360.0) * 0.3);
                this.mGameTicksF += aTimeScale;
            } else {
                this.mGameTicksF += this.mTimeScaleOverride;
            }
            this.m5SecChance.Step$2(this.mTimeStep / 60.0);
            this.m10SecChance.Step$2(this.mTimeStep / 60.0);
            this.mTotalGameTicks++;
            if(!this.WantWarningGlow()) {
                var aTicksLeft = this.GetTicksLeft();
                if((aTicksLeft % 60 == 0) && (aTicksLeft > 0) && (aTicksLeft <= 8 * 60) && (aTicksLeft != this.mMaxTicksLeft) && (aPrevTicksI != (this.mGameTicksF | 0))) {
                    Game.SoundUtil.Play(Game.Resources['SOUND_TICK']);
                }
            }
        }
        if(this.mDidTimeUp) {
            this.mTimeUpCount++;
        }
        var aPenaltyPct = Math.min(this.GetLevelPct() + 0.65, 1.0);
        this.mBonusTimeDisp += (this.mBonusTime - this.mBonusTimeDisp) / 50;
        if(this.mTimedPenaltyAmnesty > 0) {
            this.mTimedPenaltyAmnesty--;
        } else {
            this.mBonusPenalty += (this.mTimedPenaltyVel * aPenaltyPct) / 60.0;
            this.mTimedPenaltyVel += (this.mTimedPenaltyAccel * aPenaltyPct) / 60.0;
            this.mTimedPenaltyAccel += (this.mTimedPenaltyJerk * aPenaltyPct) / 60.0;
        }
        if(this.mWantGemsCleared == 0) {
            this.mWantGemsCleared = 20;
        }
        if((this.mGameTicks % 240 == 0) && (aPrevGameTick != this.mGameTicks)) {
            this.mWantGemsCleared = ((Math.max(5, ((this.mWantGemsCleared - this.mRand.Next() % 5) | 0))) | 0);
        }
        if((this.mUseCheckpoints) && (this.mPoints > this.mPointsGoal)) {
            Game.SoundUtil.Play(Game.Resources['SOUND_SPEEDBOARD_BACKGROUND_CHANGE']);
            this.mSpeedTier++;
            this.mPrevPointsGoal = this.mPointsGoal;
            if(this.mUsePM) {
                this.mPointsGoal += ((this.mPointsGoalStart + this.mAddPointsGoalPerLevel * Math.pow(this.mSpeedTier, this.mPointsGoalAddPower)) | 0) * (this.mSpeedTier + 1);
            } else {
                this.mPointsGoal += (((this.mPointsGoalStart + this.mAddPointsGoalPerLevel * Math.pow(this.mSpeedTier, this.mPointsGoalAddPower)) | 0));
            }
            this.mGameTicks = 0;
        }
        Game.Resources['POPANIM_ANIMS_GEM_MEGA'].Update();
        Game.Resources['POPANIM_ANIMS_GEM_MEGA'].mColor = GameFramework.gfx.Color.FAlphaToInt(this.GetAlpha());
        Game.Resources['POPANIM_ANIMS_LIGHTNINGUIBOTTOM'].Update();
        Game.Resources['POPANIM_ANIMS_LIGHTNINGUIBOTTOM'].mColor = GameFramework.gfx.Color.FAlphaToInt(this.GetAlpha());
        Game.Resources['POPANIM_ANIMS_LIGHTNINGUI'].Update();
        Game.Resources['POPANIM_ANIMS_LIGHTNINGUI'].mColor = GameFramework.gfx.Color.FAlphaToInt(this.GetAlpha());
        var aPoweredScaleVal = Math.pow(this.mCollectorExtendPct.GetOutVal(), 0.7);
        var aLayer = Game.Resources['PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT'].GetLayer(0);
        for(var anEmitterIdx = 0; anEmitterIdx < 2; anEmitterIdx++) {
            var anEmitterInstDef = aLayer.mLayerDef.mEmitterInstanceDefVector[anEmitterIdx];
            anEmitterInstDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.LIFE | 0)].mValuePointVector[0].mValue = 0.75 + aPoweredScaleVal * 1.5;
            anEmitterInstDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.NUMBER | 0)].mValuePointVector[0].mValue = (this.mCollectorExtendPct.GetOutVal() > 0.0) ? (0.33 + aPoweredScaleVal * 1.0) : 0.0;
            anEmitterInstDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_X | 0)].mValuePointVector[0].mValue = 0.75 + aPoweredScaleVal * 0.5;
            anEmitterInstDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_Y | 0)].mValuePointVector[0].mValue = 0.75 + aPoweredScaleVal * 0.5;
        }
        aLayer = Game.Resources['PIEFFECT_LIGHTNING_POWERED_MEGASHARD'].GetLayer(0);
        for(var anEmitterIdx_2 = 0; anEmitterIdx_2 < 2; anEmitterIdx_2++) {
            var anEmitterInstDef_2 = aLayer.mLayerDef.mEmitterInstanceDefVector[anEmitterIdx_2];
            anEmitterInstDef_2.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.NUMBER | 0)].mValuePointVector[0].mValue = (this.mCollectorExtendPct.GetOutVal() > 0.0) ? (0.1 + aPoweredScaleVal * 0.9) : 0.0;
        }
        Game.Resources['PIEFFECT_LIGHTNING_POWERED_MEGASHARD'].Update();
        Game.Resources['PIEFFECT_LIGHTNING_POWERED_MEGASHARD'].mColor = GameFramework.gfx.Color.FAlphaToInt(this.GetAlpha());
        Game.Resources['PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT'].Update();
        Game.Resources['PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT'].mColor = GameFramework.gfx.Color.FAlphaToInt(this.GetAlpha());
        this.mTimeFXManager.Update();
        if(this.mBonusTime > 0) {
            this.mPanicScalePct = Math.max(0, this.mPanicScalePct - 0.01);
        } else {
            this.mPanicScalePct = Math.min(1, this.mPanicScalePct + 0.01);
        }
        if((this.mUpdateCnt > 150) && (this.mGameOverCount == 0)) {
        }
        if((this.mTimeUpCount > 0) && (this.mTimeUpCount < 60)) {
            if(this.mUpdateCnt % 2 == 0) {
                this.mX = GameFramework.Utils.GetRandFloat() * (60 - this.mTimeUpCount) / 60.0 * 12.0;
                this.mY = GameFramework.Utils.GetRandFloat() * (60 - this.mTimeUpCount) / 60.0 * 12.0;
            }
        } else {
            this.mX = 0;
            this.mY = 0;
        }
        if(this.mSpeedBonusFlameModePct > 0) {
            if(this.mTimeScaleOverride == 0) {
                var aTicksLeft_2 = this.GetTicksLeft();
                var aFlameTicksLeft = ((480.0 * this.mSpeedBonusFlameModePct) | 0);
                if(aTicksLeft_2 * 1.3 < aFlameTicksLeft) {
                    this.mTimeScaleOverride = aTicksLeft_2 / aFlameTicksLeft;
                }
            }
        } else {
            this.mTimeScaleOverride = 0;
        }
    },
    DrawLevelBar : function Game_SpeedBoard$DrawLevelBar(g) {
        var aBarRect = this.GetLevelBarRect();
        var anAlpha = Math.pow(this.GetBoardAlpha(), 4.0);
        var aXOfs = this.GetBoardX() - 523 - 160;
        var aYOfs = this.GetBoardY() - 100;
        var noAdditive = !GameFramework.BaseApp.mApp.get_Is3D();
        aBarRect.mWidth = ((this.mLevelBarPct * aBarRect.mWidth + this.mLevelBarSizeBias) | 0);
        var aSnappedStartX = g.GetSnappedX(aBarRect.mX);
        var aSnappedEndX = g.GetSnappedX(aBarRect.mX + aBarRect.mWidth);
        var aSnappedWidth = aSnappedEndX - aSnappedStartX;
        if(!noAdditive) {
            var _t1 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(180, 120, 70, ((anAlpha * 255.0) | 0)));
            try {
                g.FillRect(aSnappedStartX, aBarRect.mY, aSnappedWidth, aBarRect.mHeight);
            } finally {
                _t1.Dispose();
            }
        }
        if(this.mLevelBarBonusAlpha.GetOutVal() > 0.0) {
            g.PushColor(GameFramework.gfx.Color.RGBAToInt(240, 255, 200, ((this.mLevelBarBonusAlpha.GetOutVal() * 255.0) | 0)));
            g.FillRect(aSnappedStartX, aBarRect.mY, aSnappedWidth, aBarRect.mHeight);
            g.PopColor();
        }
        for(var aBarIdx = 0; aBarIdx < this.mBarInstanceVector.length; aBarIdx++) {
            var aBarInstance = this.mBarInstanceVector[aBarIdx];
            var anImageInst = Game.Resources['IMAGE_BARFILLRED'].CreateImageInstRect(((aBarInstance.mSrcX * 1000 * g.mScale) | 0), ((aBarInstance.mSrcY * 100 * g.mScale) | 0), ((aSnappedWidth * g.mScale) | 0), ((aBarRect.mHeight * g.mScale) | 0));
            if(!noAdditive) {
                anImageInst.mAdditive = true;
            }
            var _t2 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((aBarInstance.mAlpha * anAlpha * 255.0) | 0)));
            try {
                g.DrawImage(anImageInst, aSnappedStartX, aBarRect.mY);
            } finally {
                _t2.Dispose();
            }
        }
        if(noAdditive) {
            var _t3 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 160, 60, ((anAlpha * 160.0) | 0)));
            try {
                g.FillRect(aSnappedStartX, aBarRect.mY, aSnappedWidth, aBarRect.mHeight);
            } finally {
                _t3.Dispose();
            }
        }
    },
    KeyChar : function Game_SpeedBoard$KeyChar(theChar) {
        if(Game.BejApp.mBejApp.mDebugKeysEnabled) {
            var aCursorPiece = this.GetPieceAtScreenXY((this.mLastMouseX | 0), (this.mLastMouseY | 0));
            if(theChar == 116) {
                if(aCursorPiece != null) {
                    aCursorPiece.SetFlag(Game.Piece.EFlag.TIME_BONUS);
                    aCursorPiece.mCounter = 5;
                    this.StartTimeBonusEffect(aCursorPiece);
                    return;
                }
            } else if(theChar == 92) {
                this.mTutorialMgr.SetTutorialFlags(0);
                this.mTutorialMgr.SetTutorialEnabled(true);
                this.mBonusTime = 5;
                this.mGameTicks = ((Math.max(0, (60 - 1) * 60 + 250)) | 0);
                this.mGameTicksF = this.mGameTicks;
                return;
            } else if(theChar == 91) {
                this.mGameTicks = ((Math.max(0, (60 - 5) * 60 + 250)) | 0);
                this.mGameTicksF = this.mGameTicks;
                return;
            }
        }
        Game.Board.prototype.KeyChar.apply(this, [theChar]);
    },
    DrawScore : function Game_SpeedBoard$DrawScore(g) {
        g.SetFont(Game.Resources['FONT_SCORE_LARGE']);
        g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255 * this.GetAlpha()) | 0)));
        var aScore = GameFramework.Utils.CommaSeperate(this.mDispPoints);
        g.DrawStringEx(aScore, 242, 210, 0, 0);
        g.PopColor();
    },
    DrawFrame : function Game_SpeedBoard$DrawFrame(g) {
        var _t4 = g.PushTranslate(-160, 0);
        try {
            Game.Resources['POPANIM_ANIMS_LIGHTNINGUIBOTTOM'].Draw(g);
        } finally {
            _t4.Dispose();
        }
    },
    GetWarningGlowColor : function Game_SpeedBoard$GetWarningGlowColor() {
        var aTicksLeft = this.GetTicksLeft();
        var aWarningStartTick = (this.GetTimeLimit() > 60) ? 1500 : 1000;
        var aMult = (aWarningStartTick - aTicksLeft) / aWarningStartTick;
        if(aTicksLeft == 0) {
            var aTimeLimit = this.GetTimeLimit();
            aMult *= Math.max(0, 120 - ((this.mGameTicks - 150) - aTimeLimit * 60)) / 120;
            aMult *= Math.max(0, 1.0 - (this.mTimeUpCount) / 20.0);
        }
        var c = (((Math.sin(this.mUpdateCnt * 0.15) * 127 + 127) * aMult * this.GetPieceAlpha()) | 0);
        return GameFramework.gfx.Color.RGBAToInt(255, 255, 255, c);
    },
    DrawFrame2 : function Game_SpeedBoard$DrawFrame2(g) {
        var _t5 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetBoardAlpha()) | 0)));
        try {
            var aScaledShowPct = 0;
            if(this.mCollectorExtendPct.GetOutVal() > 0.0) {
                aScaledShowPct = Math.pow(this.mCollectorExtendPct.GetOutVal(), 0.5) * 1.0 + 0.0;
            }
            var _t6 = g.PushTranslate(56, -22 + aScaledShowPct * 280);
            try {
                Game.Resources['POPANIM_ANIMS_GEM_MEGA'].Draw(g);
                var _t7 = g.PushTranslate(170, 300);
                try {
                    Game.Resources['PIEFFECT_LIGHTNING_POWERED_MEGASHARD'].Draw(g);
                } finally {
                    _t7.Dispose();
                }
                if(this.WantWarningGlow()) {
                    var _t8 = g.PushColor(this.GetWarningGlowColor());
                    try {
                        g.DrawImage(Game.Resources['IMAGE_LIGHTNING_MEGASHARD_RED_LIGHTNING'], 45, 34);
                    } finally {
                        _t8.Dispose();
                    }
                }
                g.SetFont(Game.Resources['FONT_SCORE']);
                g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetAlpha() * this.mCollectedTimeAlpha.GetOutVal()) | 0)));
                Game.Resources['FONT_SCORE'].PushLayerColor('GLOW', 0x9f000000);
                var aTimeDisp = ((this.mCollectorExtendPct.GetOutVal() * 60.0 + 0.5) | 0);
                g.DrawStringEx(String.format('+{0:d}:{1:00}', ((aTimeDisp / 60) | 0), aTimeDisp % 60), 186, 442, 0, 0);
                Game.Resources['FONT_SCORE'].PopLayerColor('GLOW');
            } finally {
                _t6.Dispose();
            }
            g.PopColor();
            var aXOfs = this.GetBoardX() - 523 - 160;
            var aYOfs = this.GetBoardY() - 130;
            g.DrawImage(Game.Resources['IMAGE_LIGHTNING_TOP_BACK_LIGHTNING'].get_OffsetImage(), (aXOfs), (aYOfs));
            this.DrawLevelBar(g);
            var _t9 = g.PushTranslate(-160, 0);
            try {
                Game.Resources['POPANIM_ANIMS_LIGHTNINGUI'].Draw(g);
            } finally {
                _t9.Dispose();
            }
            if((this.mLastHurrahAlpha != null) && (this.mLastHurrahAlpha.get_v() > 0)) {
                g.SetFont(Game.Resources['FONT_SPEED_TEXT']);
                var _t10 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mLastHurrahAlpha.GetOutVal() * this.GetPieceAlpha()));
                try {
                    g.GetFont().PushLayerColor('GLOW', GameFramework.gfx.Color.BLACK_RGB);
                    g.GetFont().PushLayerColor('OUTLINE', GameFramework.gfx.Color.BLACK_RGB);
                    var aScale = 1.25 + Math.sin(this.mLastHurrahUpdates * 0.1) * 0.25;
                    g.PushScale(aScale, aScale, this.GetBoardCenterX(), 75);
                    g.DrawStringEx('Last Hurrah', this.GetBoardCenterX(), 98, 0, 0);
                    g.PopMatrix();
                    g.GetFont().PopLayerColor('GLOW');
                    g.GetFont().PopLayerColor('OUTLINE');
                } finally {
                    _t10.Dispose();
                }
            }
            var _t11 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.GetAlpha()));
            try {
                g.DrawImage(Game.Resources['IMAGE_LIGHTNING_TIMER_LIGHTNING'].get_CenteredImage(), this.GetTimeDrawX() + -2, 76);
            } finally {
                _t11.Dispose();
            }
            if(this.mTimerGoldPct != null) {
                var _t12 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mTimerGoldPct.GetOutVal()));
                try {
                    g.DrawImage(Game.Resources['IMAGE_LIGHTNING_TIMER_GOLD_LIGHTNING'].get_CenteredImage(), this.GetTimeDrawX() + -2, 76);
                } finally {
                    _t12.Dispose();
                }
            }
            this.DrawSpeedBonus(g);
            var _t13 = g.PushTranslate(240, 240);
            try {
                Game.Resources['PIEFFECT_LIGHTNING_POWERED_LEFTRIGHT'].Draw(g);
            } finally {
                _t13.Dispose();
            }
            if(this.WantWarningGlow()) {
                var _t14 = g.PushColor(this.GetWarningGlowColor());
                try {
                    Game.Resources['IMAGE_LIGHTNING_TOP_RED_LIGHTNING'].set_Additive(true);
                    Game.Resources['IMAGE_LIGHTNING_BOTTOM_RED_LIGHTNING'].set_Additive(true);
                    g.DrawImage(Game.Resources['IMAGE_LIGHTNING_TOP_RED_LIGHTNING'].get_OffsetImage(), aXOfs, aYOfs);
                    g.DrawImage(Game.Resources['IMAGE_LIGHTNING_BOTTOM_RED_LIGHTNING'].get_OffsetImage(), aXOfs, aYOfs);
                    g.DrawImage(Game.Resources['IMAGE_LIGHTNING_TIMER_RED_LIGHTNING'].get_CenteredImage(), this.GetTimeDrawX() + -2, 76);
                } finally {
                    _t14.Dispose();
                }
            }
            this.DrawScore(g);
        } finally {
            _t5.Dispose();
        }
    },
    WantBaseDrawSpeedBonusText : function Game_SpeedBoard$WantBaseDrawSpeedBonusText() {
        return false;
    },
    DrawOverlay : function Game_SpeedBoard$DrawOverlay(g) {
        this.DrawFrame2(g);
        this.mTimeFXManager.Draw(g);
        Game.Board.prototype.DrawOverlay.apply(this, [g]);
        this.DrawSpeedBonusDynImage(g);
    },
    Draw : function Game_SpeedBoard$Draw(g) {
        Game.Board.prototype.Draw.apply(this, [g]);
    },
    DrawSideUI : function Game_SpeedBoard$DrawSideUI(g) {
        this.DrawBottomWidget(g);
    }
}
Game.SpeedBoard.staticInit = function Game_SpeedBoard$staticInit() {
}

JS_AddInitFunc(function() {
    Game.SpeedBoard.registerClass('Game.SpeedBoard', Game.Board);
});
JS_AddStaticInitFunc(function() {
    Game.SpeedBoard.staticInit();
});
/**
 * @constructor
 */
Game.ElectroBolt = function Game_ElectroBolt() {
    this.mMidPointsPos = Array.Create(8, null);
    this.mMidPointsPosD = Array.Create(8, null);
}
Game.ElectroBolt.prototype = {
    mAngStart : 0,
    mAngStartD : 0,
    mAngEnd : 0,
    mAngEndD : 0,
    mCrossover : null,
    mHitOtherGem : null,
    mHitOtherGemId : 0,
    mMidPointsPos : null,
    mMidPointsPosD : null,
    mNumMidPoints : 0
}
Game.ElectroBolt.staticInit = function Game_ElectroBolt$staticInit() {
}

JS_AddInitFunc(function() {
    Game.ElectroBolt.registerClass('Game.ElectroBolt', null);
});
JS_AddStaticInitFunc(function() {
    Game.ElectroBolt.staticInit();
});
/**
 * @constructor
 */
Game.TimeBonusEffectTop = function Game_TimeBonusEffectTop(thePiece) {
    this.mCirclePct = new GameFramework.CurvedVal();
    this.mRadiusScale = new GameFramework.CurvedVal();
    Game.TimeBonusEffectTop.initializeBase(this, [Game.Effect.EFxType.TIME_BONUS_TOP]);
    this.mPieceIdRel = thePiece.mId;
    this.mGemColor = thePiece.mColor;
    this.mTimeBonus = thePiece.mCounter;
    this.mDAlpha = 0;
    this.mRadiusScale.SetConstant(1.0);
}
Game.TimeBonusEffectTop.prototype = {
    mGemColor : null,
    mTimeBonus : 0,
    mCirclePct : null,
    mRadiusScale : null,
    Update : function Game_TimeBonusEffectTop$Update() {
        this.mCirclePct.IncInVal();
        this.mRadiusScale.IncInVal();
        var aRelPiece = this.mFXManager.mBoard.GetPieceById(this.mPieceIdRel);
        if(aRelPiece != null) {
            this.mOverlay = false;
            this.mX = aRelPiece.GetScreenX() + ((Game.Board.GEM_WIDTH / 2) | 0);
            this.mY = aRelPiece.GetScreenY() + ((Game.Board.GEM_HEIGHT / 2) | 0);
            this.mTimeBonus = aRelPiece.mCounter;
            for(var anIdx = 0; anIdx < (this.mFXManager.mBoard.mLightningStorms.length | 0); anIdx++) {
                if(this.mFXManager.mBoard.mLightningStorms[anIdx].mStormType == Game.LightningStorm.EStormType.HYPERCUBE) {
                    if(this.mFXManager.mBoard.mLightningStorms[anIdx].mColor == aRelPiece.mColor) {
                        this.mOverlay = true;
                    }
                }
            }
        }
        if((this.mPieceIdRel != -1) && ((aRelPiece == null) || ((!aRelPiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS))))) {
            this.mDeleteMe = true;
        }
    },
    Draw : function Game_TimeBonusEffectTop$Draw(g) {
        var anAlpha = this.mAlpha * this.mFXManager.mAlpha;
        var aRelPiece = this.mFXManager.mBoard.GetPieceById(this.mPieceIdRel);
        if(aRelPiece != null) {
            if(aRelPiece.mScale.GetOutVal() != 1.0) {
                g.PushScale(aRelPiece.mScale.GetOutVal(), aRelPiece.mScale.GetOutVal(), aRelPiece.CX(), aRelPiece.CY());
            }
        }
        var _t15 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(anAlpha));
        try {
            if(this.mTimeBonus > 0) {
                var aPieceX = ((this.mX - Game.Board.GEM_WIDTH / 2.0) | 0);
                var aPieceY = ((this.mY - Game.Board.GEM_HEIGHT / 2.0) | 0);
                var gemImg;
                switch((this.mGemColor | 0)) {
                    case (Game.DM.EGemColor.RED | 0):
                    {
                        gemImg = Game.Resources['IMAGE_LIGHTNING_GEMNUMS_RED'];
                        break;
                    }
                    case (Game.DM.EGemColor.WHITE | 0):
                    {
                        gemImg = Game.Resources['IMAGE_LIGHTNING_GEMNUMS_WHITE'];
                        break;
                    }
                    case (Game.DM.EGemColor.GREEN | 0):
                    {
                        gemImg = Game.Resources['IMAGE_LIGHTNING_GEMNUMS_GREEN'];
                        break;
                    }
                    case (Game.DM.EGemColor.YELLOW | 0):
                    {
                        gemImg = Game.Resources['IMAGE_LIGHTNING_GEMNUMS_YELLOW'];
                        break;
                    }
                    case (Game.DM.EGemColor.PURPLE | 0):
                    {
                        gemImg = Game.Resources['IMAGE_LIGHTNING_GEMNUMS_PURPLE'];
                        break;
                    }
                    case (Game.DM.EGemColor.ORANGE | 0):
                    {
                        gemImg = Game.Resources['IMAGE_LIGHTNING_GEMNUMS_ORANGE'];
                        break;
                    }
                    case (Game.DM.EGemColor.BLUE | 0):
                    {
                        gemImg = Game.Resources['IMAGE_LIGHTNING_GEMNUMS_BLUE'];
                        break;
                    }
                    default:
                    {
                        gemImg = Game.Resources['IMAGE_LIGHTNING_GEMNUMS_CLEAR'];
                        break;
                    }
                }
                g.DrawImageCel(gemImg, aPieceX, aPieceY, ((this.mTimeBonus / 5) | 0) - 1);
                if((aRelPiece != null) && (this.mFXManager.mBoard.GetTicksLeft() <= 500) && ((((this.mFXManager.mBoard.mGameTicks / 18) | 0)) % 2 == 0)) {
                    var _t16 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 200, 200, 255));
                    try {
                        g.DrawImageCel(Game.Resources['IMAGE_LIGHTNING_GEMNUMS_WHITE'], aPieceX, aPieceY, ((this.mTimeBonus / 5) | 0) - 1);
                    } finally {
                        _t16.Dispose();
                    }
                }
            }
        } finally {
            _t15.Dispose();
        }
        if(aRelPiece != null) {
            if(aRelPiece.mScale.GetOutVal() != 1.0) {
                g.PopMatrix();
            }
        }
    }
}
Game.TimeBonusEffectTop.staticInit = function Game_TimeBonusEffectTop$staticInit() {
}

JS_AddInitFunc(function() {
    Game.TimeBonusEffectTop.registerClass('Game.TimeBonusEffectTop', Game.Effect);
});
JS_AddStaticInitFunc(function() {
    Game.TimeBonusEffectTop.staticInit();
});
/**
 * @constructor
 */
Game.TimeBonusEffect = function Game_TimeBonusEffect(thePiece) {
    this.mCirclePct = new GameFramework.CurvedVal();
    this.mRadiusScale = new GameFramework.CurvedVal();
    Game.TimeBonusEffect.initializeBase(this, [Game.Effect.EFxType.TIME_BONUS]);
    this.mElectroBoltVector = [];
    this.mPieceIdRel = thePiece.mId;
    this.mGemColor = thePiece.mColor;
    this.mTimeBonus = thePiece.mCounter;
    this.mDAlpha = 0;
    this.mRadiusScale.SetConstant(1.0);
}
Game.TimeBonusEffect.prototype = {
    mElectroBoltVector : null,
    mGemColor : null,
    mTimeBonus : 0,
    mCirclePct : null,
    mRadiusScale : null,
    Update : function Game_TimeBonusEffect$Update() {
        this.mCirclePct.IncInVal();
        this.mRadiusScale.IncInVal();
        var aRelPiece = this.mFXManager.mBoard.GetPieceById(this.mPieceIdRel);
        if(aRelPiece != null) {
            this.mOverlay = false;
            this.mX = aRelPiece.GetScreenX() + ((Game.Board.GEM_WIDTH / 2) | 0);
            this.mY = aRelPiece.GetScreenY() + ((Game.Board.GEM_HEIGHT / 2) | 0);
            this.mTimeBonus = aRelPiece.mCounter;
            for(var anIdx = 0; anIdx < (this.mFXManager.mBoard.mLightningStorms.length | 0); anIdx++) {
                if(this.mFXManager.mBoard.mLightningStorms[anIdx].mStormType == Game.LightningStorm.EStormType.HYPERCUBE) {
                    if(this.mFXManager.mBoard.mLightningStorms[anIdx].mColor == aRelPiece.mColor) {
                        this.mOverlay = true;
                    }
                }
            }
        }
        var aFrame = 0;
        if(aRelPiece != null) {
            aFrame = ((Math.min(19, ((20.0 * aRelPiece.mRotPct) | 0))) | 0);
        }
        var noEffect = ((Game.BejApp.mBejApp.mFXScale != 1.0) && (GameFramework.Utils.GetRandFloatU() > 0.5 + Game.BejApp.mBejApp.mFXScale * 0.5));
        {
            var anElectroMult = Math.min(4.0, this.mTimeBonus - 1.0) / 4.0;
            if(!Game.BejApp.mBejApp.mIsSlow) {
                if((GameFramework.Utils.GetRandFloatU() < 0.025 * Math.min(5.0, this.mTimeBonus - 1.0)) && (!noEffect)) {
                    var anEffect = this.mFXManager.AllocEffect(Game.Effect.EFxType.EMBER);
                    var anAngle = GameFramework.Utils.GetRandFloat() * Math.PI;
                    var aDist = Game.Piece.GetAngleRadiusColorFrame(anAngle, this.mGemColor, aFrame);
                    var aSpeed = 0.35 + GameFramework.Utils.GetRandFloatU() * 0.1;
                    anEffect.mAlpha = 1.0;
                    anEffect.mScale = 1.0;
                    anEffect.mDScale = -0.0;
                    anEffect.mDAlpha = -0.012;
                    anEffect.mFrame = 0;
                    Game.Resources['IMAGE_SPARKLET'].mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
                    anEffect.mImage = Game.Resources['IMAGE_SPARKLET'];
                    anEffect.mX = ((Game.Board.GEM_WIDTH / 2) | 0) + Math.cos(anAngle) * aDist;
                    anEffect.mY = ((Game.Board.GEM_HEIGHT / 2) | 0) + Math.sin(anAngle) * aDist;
                    anEffect.mDX = Math.cos(anAngle) * aSpeed;
                    anEffect.mDY = Math.sin(anAngle) * aSpeed;
                    anEffect.mColor = Game.DM.gArcColors[(this.mGemColor | 0)];
                    anEffect.mPieceIdRel = aRelPiece == null ? -1 : aRelPiece.mId;
                    this.mFXManager.mBoard.mPreFXManager.AddEffect(anEffect);
                }
            }
            if(Game.BejApp.mBejApp.mIsSlow) {
                anElectroMult *= 0.25;
            }
            var wantElectro = GameFramework.Utils.GetRandFloatU() < 0.15 * anElectroMult;
            wantElectro |= (this.mElectroBoltVector.length | 0) < Math.min(3, this.mTimeBonus * 2 - 1);
            if(noEffect) {
                wantElectro = false;
            }
            if(wantElectro) {
                var aBolt = new Game.ElectroBolt();
                aBolt.mHitOtherGem = false;
                aBolt.mCrossover = (!aBolt.mHitOtherGem) && (GameFramework.Utils.GetRandFloatU() < 0.02);
                if(Game.BejApp.mBejApp.mIsSlow) {
                    aBolt.mCrossover |= (!aBolt.mHitOtherGem) && (GameFramework.Utils.GetRandFloatU() < 0.1);
                }
                if(aBolt.mHitOtherGem) {
                    aBolt.mAngStart = Math.abs(GameFramework.Utils.GetRandFloat()) * Math.PI * 2.0;
                    var aPiece = this.mFXManager.mBoard.GetPieceAtScreenXY(((this.mX + Game.Board.GEM_WIDTH / 2.0 + Math.cos(aBolt.mAngStart) * Game.Board.GEM_WIDTH * 0.6) | 0), ((this.mY + Game.Board.GEM_HEIGHT / 2 + Math.sin(aBolt.mAngStart) * Game.Board.GEM_HEIGHT * 0.6) | 0));
                    if((aPiece != null) && (aPiece != aRelPiece)) {
                        aBolt.mHitOtherGemId = aPiece.mId;
                    } else {
                        aBolt.mHitOtherGem = false;
                    }
                }
                if(aBolt.mHitOtherGem) {
                    aBolt.mAngEnd = Math.PI + aBolt.mAngStart + Math.abs(GameFramework.Utils.GetRandFloat()) * 0.5;
                    aBolt.mAngStartD = GameFramework.Utils.GetRandFloat() * 0.03;
                    aBolt.mAngEndD = GameFramework.Utils.GetRandFloat() * 0.03;
                } else if(aBolt.mCrossover) {
                    aBolt.mAngStart = Math.abs(GameFramework.Utils.GetRandFloat()) * Math.PI * 2.0;
                    aBolt.mAngEnd = aBolt.mAngStart;
                    aBolt.mAngStartD = GameFramework.Utils.GetRandFloat() * 0.02;
                    if(aBolt.mAngStartD < 0) {
                        aBolt.mAngStartD += -0.02;
                    } else {
                        aBolt.mAngStartD += 0.02;
                    }
                    aBolt.mAngEndD = -aBolt.mAngStartD + GameFramework.Utils.GetRandFloat() * 0.02;
                } else {
                    aBolt.mAngStart = Math.abs(GameFramework.Utils.GetRandFloat()) * Math.PI * 2.0;
                    aBolt.mAngEnd = aBolt.mAngStart + Math.abs(GameFramework.Utils.GetRandFloat()) * 0.5 + 0.5;
                    aBolt.mAngStartD = GameFramework.Utils.GetRandFloat() * 0.0075;
                    aBolt.mAngEndD = aBolt.mAngStartD + GameFramework.Utils.GetRandFloat() * 0.002;
                }
                aBolt.mNumMidPoints = 2;
                for(var aPtNum = 0; aPtNum < aBolt.mNumMidPoints; aPtNum++) {
                    aBolt.mMidPointsPos[aPtNum] = GameFramework.Utils.GetRandFloat() * 10.0;
                    aBolt.mMidPointsPosD[aPtNum] = GameFramework.Utils.GetRandFloat() * 0.2;
                }
                this.mElectroBoltVector.push(aBolt);
            }
            for(var aBoltNum = 0; aBoltNum < (this.mElectroBoltVector.length | 0); aBoltNum++) {
                var aBolt_2 = this.mElectroBoltVector[aBoltNum];
                aBolt_2.mAngStart += aBolt_2.mAngStartD;
                aBolt_2.mAngEnd += aBolt_2.mAngEndD;
                var deleteMe = false;
                for(var aPtNum_2 = 0; aPtNum_2 < aBolt_2.mNumMidPoints; aPtNum_2++) {
                    aBolt_2.mMidPointsPos[aPtNum_2] += aBolt_2.mMidPointsPosD[aPtNum_2];
                    if(aBolt_2.mHitOtherGem) {
                        if(Math.abs(aBolt_2.mMidPointsPos[aPtNum_2]) >= 25) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] *= -0.65;
                        } else if(GameFramework.Utils.GetRandFloatU() < 0.2) {
                            aBolt_2.mMidPointsPos[aPtNum_2] = GameFramework.Utils.GetRandFloat() * 15.0;
                        } else if(GameFramework.Utils.GetRandFloatU() < 0.05) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] += GameFramework.Utils.GetRandFloat() * 1.5;
                        } else if(GameFramework.Utils.GetRandFloatU() < 0.05) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] = GameFramework.Utils.GetRandFloat() * 1.5;
                        }
                    } else if(aBolt_2.mCrossover) {
                        if(Math.abs(aBolt_2.mMidPointsPos[aPtNum_2]) >= 25) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] *= -0.65;
                        } else if(GameFramework.Utils.GetRandFloatU() < 0.2) {
                            aBolt_2.mMidPointsPos[aPtNum_2] = GameFramework.Utils.GetRandFloat() * 15.0;
                        } else if(GameFramework.Utils.GetRandFloatU() < 0.1) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] += GameFramework.Utils.GetRandFloat() * 1.5;
                        } else if(GameFramework.Utils.GetRandFloatU() < 0.1) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] = GameFramework.Utils.GetRandFloat() * 1.5;
                        }
                    } else {
                        if(aBolt_2.mMidPointsPos[aPtNum_2] <= 0) {
                            aBolt_2.mMidPointsPos[aPtNum_2] = 0;
                            aBolt_2.mMidPointsPosD[aPtNum_2] = GameFramework.Utils.GetRandFloatU() * 0.1;
                        } else if(GameFramework.Utils.GetRandFloatU() < 0.05) {
                            var aMoveTend = (4.0 - aBolt_2.mMidPointsPos[aPtNum_2]) * 0.1;
                            aBolt_2.mMidPointsPosD[aPtNum_2] = aMoveTend + GameFramework.Utils.GetRandFloat() * 1.0;
                        } else if(GameFramework.Utils.GetRandFloatU() < 0.025) {
                            aBolt_2.mMidPointsPos[aPtNum_2] = GameFramework.Utils.GetRandFloatU() * 18.0;
                        } else if(GameFramework.Utils.GetRandFloatU() < 0.04) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] += GameFramework.Utils.GetRandFloat() * 2.5;
                        }
                        if(GameFramework.Utils.GetRandFloatU() < 0.1) {
                            var aPrevVal = 0.0;
                            var aNextVal = 0.0;
                            if(aPtNum_2 - 1 >= 0) {
                                aPrevVal = aBolt_2.mMidPointsPos[aPtNum_2 - 1];
                            }
                            if(aPtNum_2 + 1 < aBolt_2.mNumMidPoints) {
                                aNextVal = aBolt_2.mMidPointsPos[aPtNum_2 + 1];
                            }
                            aBolt_2.mMidPointsPos[aPtNum_2] = (aBolt_2.mMidPointsPos[aPtNum_2] + aPrevVal + aNextVal) / 3;
                        }
                        if(GameFramework.Utils.GetRandFloatU() < 0.2) {
                            var aMoveTowardPt = aPtNum_2 + GameFramework.Utils.GetRand() % 3 - 1;
                            if((aMoveTowardPt >= 0) && (aMoveTowardPt < aBolt_2.mNumMidPoints)) {
                                var aDelta = aBolt_2.mMidPointsPos[aMoveTowardPt] - aBolt_2.mMidPointsPos[aPtNum_2];
                                aBolt_2.mMidPointsPosD[aPtNum_2] += aDelta * 0.2;
                            }
                        }
                        if(GameFramework.Utils.GetRandFloatU() < 0.1) {
                            var aPrevVal_2 = 0.0;
                            var aNextVal_2 = 0.0;
                            if(aPtNum_2 - 1 >= 0) {
                                aPrevVal_2 = aBolt_2.mMidPointsPosD[aPtNum_2 - 1];
                            }
                            if(aPtNum_2 + 1 < aBolt_2.mNumMidPoints) {
                                aNextVal_2 = aBolt_2.mMidPointsPosD[aPtNum_2 + 1];
                            }
                            aBolt_2.mMidPointsPosD[aPtNum_2] = (aPrevVal_2 + aNextVal_2) / 2;
                        }
                    }
                    if((aBolt_2.mMidPointsPos[aPtNum_2] > 18.0) || ((anElectroMult <= 0) && (GameFramework.Utils.GetRandFloatU() < 0.0075))) {
                        deleteMe = true;
                    }
                }
                if(aBolt_2.mHitOtherGem) {
                    var aLastDist = Game.Piece.GetAngleRadiusColorFrame(aBolt_2.mAngStart, this.mGemColor, aFrame) + 0.0;
                    var aLastX = Math.cos(aBolt_2.mAngStart) * aLastDist;
                    var aLastY = Math.sin(aBolt_2.mAngStart) * aLastDist;
                    var aPiece_2 = this.mFXManager.mBoard.GetPieceById(aBolt_2.mHitOtherGemId);
                    if(aPiece_2 != null) {
                        var aEndDist = aPiece_2.GetAngleRadius(aBolt_2.mAngEnd);
                        var aEndX = (aPiece_2.mX - this.mX) / 1.0 + Math.cos(aBolt_2.mAngEnd) * aEndDist;
                        var aEndY = (aPiece_2.mY - this.mY) / 1.0 + Math.sin(aBolt_2.mAngEnd) * aEndDist;
                        var aDX = aLastX - aEndX;
                        var aDY = aLastY - aEndY;
                        if(Math.sqrt(aDX * aDX + aDY * aDY) > 90.0) {
                            deleteMe = true;
                        }
                        var aPieceAng = Math.atan2(aPiece_2.mY - this.mY, aPiece_2.mX - this.mX);
                        var aMyElectDot = (Math.cos(aBolt_2.mAngStart) * Math.cos(aPieceAng) + Math.sin(aBolt_2.mAngStart) * Math.sin(aPieceAng));
                        if(aMyElectDot < 0.75) {
                            deleteMe = true;
                        }
                        var aHitElectDot = Math.cos(aBolt_2.mAngEnd) * Math.cos(aPieceAng + Math.PI) + Math.sin(aBolt_2.mAngEnd) * Math.sin(aPieceAng + Math.PI);
                        if(aHitElectDot < 0.75) {
                            deleteMe = true;
                        }
                    } else {
                        deleteMe = true;
                    }
                    if(GameFramework.Utils.GetRandFloatU() < 0.001) {
                        deleteMe = true;
                    }
                } else if(aBolt_2.mCrossover) {
                    if(GameFramework.Utils.GetRandFloatU() < 0.001) {
                        deleteMe = true;
                    }
                    if(Math.abs(aBolt_2.mAngStart - aBolt_2.mAngEnd) >= Math.PI * 2) {
                        deleteMe = true;
                    }
                } else {
                    if(GameFramework.Utils.GetRandFloatU() < 0.005) {
                        deleteMe = true;
                    }
                }
                if(deleteMe) {
                    this.mElectroBoltVector.removeAt(aBoltNum);
                    aBoltNum--;
                    continue;
                }
            }
        }
        if(GameFramework.Utils.GetRand() % 25 == 0) {
            var anEffect_2 = this.mFXManager.AllocEffect(Game.Effect.EFxType.LIGHT);
            anEffect_2.mFlags = (Game.Effect.EFlag.ALPHA_FADEINOUT | 0);
            anEffect_2.mX = this.mX + GameFramework.Utils.GetRandFloat() * 20.0;
            anEffect_2.mY = this.mY + GameFramework.Utils.GetRandFloat() * 20.0;
            anEffect_2.mZ = 0.08;
            anEffect_2.mZ = 0.08;
            anEffect_2.mValue[0] = 6000.0;
            anEffect_2.mValue[1] = -4000.0;
            anEffect_2.mValue[2] = 0.5;
            anEffect_2.mAlpha = 0.0;
            anEffect_2.mDAlpha = 0.07;
            anEffect_2.mScale = 0.75;
            anEffect_2.mColor = GameFramework.gfx.Color.RGBToInt(255, 255, 255);
            if(GameFramework.Utils.GetRand() % 2 != 0 && this.mPieceIdRel != -1) {
                anEffect_2.mPieceId = this.mPieceIdRel;
            }
            this.mFXManager.AddEffect(anEffect_2);
        }
        if((this.mPieceIdRel != -1) && ((aRelPiece == null) || ((!aRelPiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS)) && (this.mElectroBoltVector.length == 0)))) {
            this.mDeleteMe = true;
        }
    },
    DrawElectroLine : function Game_TimeBonusEffect$DrawElectroLine(g, theImage, theStartX, theStartY, theEndX, theEndY, theWidth, theColor1, theColor2) {
        if(Game.BejApp.mBejApp.get_Is3D()) {
            var aDX = theEndX - theStartX;
            var aDY = theEndY - theStartY;
            var anAng = Math.atan2(aDY, aDX);
            var aCos = Math.cos(anAng);
            var aSin = Math.sin(anAng);
            var aCosT = -aSin;
            var aSinT = aCos;
            var aStartXE = theStartX + aCos * -theWidth;
            var aStartYE = theStartY + aSin * -theWidth;
            var aEndXE = theEndX + aCos * theWidth;
            var aEndYE = theEndY + aSin * theWidth;
            var color0 = GameFramework.gfx.Color.WHITE_RGB;
            var w = theWidth;
            var color1 = theColor1;
            var color2 = theColor2;
            if(Game.TimeBonusEffect.mElectoLineVertices == null) {
                Game.TimeBonusEffect.mElectoLineVertices = Array.Create2D(6, 3, null, new GameFramework.gfx.TriVertex(aStartXE + aCosT * w, theStartY + aSinT * w, 0.0, 0, color1), new GameFramework.gfx.TriVertex(aStartXE + aCosT * -w, theStartY + aSinT * -w, 0.0, 1, color1), new GameFramework.gfx.TriVertex(theStartX + aCosT * w, theStartY + aSinT * w, 0.5, 0, color1), new GameFramework.gfx.TriVertex(aStartXE + aCosT * -w, theStartY + aSinT * -w, 0.0, 1, color1), new GameFramework.gfx.TriVertex(theStartX + aCosT * w, theStartY + aSinT * w, 0.5, 0, color1), new GameFramework.gfx.TriVertex(theStartX + aCosT * -w, theStartY + aSinT * -w, 0.5, 1, color1), new GameFramework.gfx.TriVertex(theStartX + aCosT * w, theStartY + aSinT * w, 0.5, 0, color1), new GameFramework.gfx.TriVertex(theStartX + aCosT * -w, theStartY + aSinT * -w, 0.5, 1, color1), new GameFramework.gfx.TriVertex(theEndX + aCosT * w, theEndY + aSinT * w, 0.5, 0, color2), new GameFramework.gfx.TriVertex(theStartX + aCosT * -w, theStartY + aSinT * -w, 0.5, 1, color1), new GameFramework.gfx.TriVertex(theEndX + aCosT * w, theEndY + aSinT * w, 0.5, 0, color2), new GameFramework.gfx.TriVertex(theEndX + aCosT * -w, theEndY + aSinT * -w, 0.5, 1, color2), new GameFramework.gfx.TriVertex(theEndX + aCosT * w, theEndY + aSinT * w, 0.5, 0, color2), new GameFramework.gfx.TriVertex(theEndX + aCosT * -w, theEndY + aSinT * -w, 0.5, 1, color2), new GameFramework.gfx.TriVertex(aEndXE + aCosT * w, theEndY + aSinT * w, 1.0, 0, color2), new GameFramework.gfx.TriVertex(theEndX + aCosT * -w, theEndY + aSinT * -w, 0.5, 1, color2), new GameFramework.gfx.TriVertex(aEndXE + aCosT * w, theEndY + aSinT * w, 1.0, 0, color2), new GameFramework.gfx.TriVertex(aEndXE + aCosT * -w, theEndY + aSinT * -w, 1.0, 1, color2));
            } else {
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (0) + 0].x = aStartXE + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (0) + 0].y = theStartY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (0) + 0].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (0) + 1].x = aStartXE + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (0) + 1].y = theStartY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (0) + 1].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (0) + 2].x = theStartX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (0) + 2].y = theStartY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (0) + 2].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (1) + 0].x = aStartXE + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (1) + 0].y = theStartY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (1) + 0].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (1) + 1].x = theStartX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (1) + 1].y = theStartY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (1) + 1].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (1) + 2].x = theStartX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (1) + 2].y = theStartY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (1) + 2].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (2) + 0].x = theStartX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (2) + 0].y = theStartY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (2) + 0].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (2) + 1].x = theStartX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (2) + 1].y = theStartY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (2) + 1].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (2) + 2].x = theEndX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (2) + 2].y = theEndY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (2) + 2].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (3) + 0].x = theStartX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (3) + 0].y = theStartY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (3) + 0].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (3) + 1].x = theEndX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (3) + 1].y = theEndY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (3) + 1].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (3) + 2].x = theEndX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (3) + 2].y = theEndY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (3) + 2].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (4) + 0].x = theEndX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (4) + 0].y = theEndY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (4) + 0].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (4) + 1].x = theEndX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (4) + 1].y = theEndY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (4) + 1].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (4) + 2].x = aEndXE + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (4) + 2].y = theEndY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (4) + 2].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (5) + 0].x = theEndX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (5) + 0].y = theEndY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (5) + 0].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (5) + 1].x = aEndXE + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (5) + 1].y = theEndY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (5) + 1].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (5) + 2].x = aEndXE + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (5) + 2].y = theEndY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * (5) + 2].color = color2;
            }
            theImage.set_Additive(true);
            g.DrawTrianglesTex(theImage, Game.TimeBonusEffect.mElectoLineVertices);
        }
    },
    Draw : function Game_TimeBonusEffect$Draw(g) {
        var anAlpha = this.mAlpha * this.mFXManager.mAlpha;
        var aFrame = 0;
        var _t17 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(anAlpha));
        try {
            var aPieceX = ((this.mX - Game.Board.GEM_WIDTH / 2.0) | 0);
            var aPieceY = ((this.mY - Game.Board.GEM_HEIGHT / 2.0) | 0);
            var aRelPiece = this.mFXManager.mBoard.GetPieceById(this.mPieceIdRel);
            if(aRelPiece != null) {
                if(aRelPiece.mScale.GetOutVal() != 1.0) {
                    g.PushScale(aRelPiece.mScale.GetOutVal(), aRelPiece.mScale.GetOutVal(), aRelPiece.CX(), aRelPiece.CY());
                }
                aFrame = (Math.min(19.0, 20.0 * aRelPiece.mRotPct) | 0);
                if((aRelPiece.mRotPct == 0) && (this.mElectroBoltVector.length != 0)) {
                    var _t18 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(Math.min(this.mElectroBoltVector.length * 32.0, 255.0) * this.mAlpha / 255.0));
                    try {
                        Game.Resources['IMAGE_GEMOUTLINES'].set_Additive(true);
                        var _t19 = g.PushScale(0.5, 0.5, aRelPiece.CX(), aRelPiece.CY());
                        try {
                            g.DrawImageCel(Game.Resources['IMAGE_GEMOUTLINES'].get_CenteredImage(), aRelPiece.CX(), aRelPiece.CY() - 2, (this.mGemColor | 0));
                        } finally {
                            _t19.Dispose();
                        }
                    } finally {
                        _t18.Dispose();
                    }
                }
            }
            for(var aBoltNum = 0; aBoltNum < (this.mElectroBoltVector.length | 0); aBoltNum++) {
                var aBolt = this.mElectroBoltVector[aBoltNum];
                var aColor = GameFramework.gfx.Color.CreateFromIntAlpha(aBolt.mCrossover ? Game.DM.gCrossoverColors[(this.mGemColor | 0)] : Game.DM.gArcColors[(this.mGemColor | 0)], ((255.0 * this.mAlpha) | 0));
                var _t20 = g.PushColor(aColor.ToInt());
                try {
                    var aLastDistAdd = 0.0;
                    var aLastDist = Game.Piece.GetAngleRadiusColorFrame(aBolt.mAngStart, this.mGemColor, aFrame);
                    aLastDist = ((this.mCirclePct.GetOutVal() * 48.0) + ((1.0 - this.mCirclePct.GetOutVal()) * aLastDist)) * this.mRadiusScale.GetOutVal();
                    var aLastX = Math.cos(aBolt.mAngStart) * aLastDist;
                    var aLastY = Math.sin(aBolt.mAngStart) * aLastDist;
                    var aStartX = aLastX;
                    var aStartY = aLastY;
                    var aEndDist = Game.Piece.GetAngleRadiusColorFrame(aBolt.mAngEnd, this.mGemColor, aFrame);
                    aEndDist = ((this.mCirclePct.GetOutVal() * 48.0) + ((1.0 - this.mCirclePct.GetOutVal()) * aEndDist)) * this.mRadiusScale.GetOutVal();
                    var aEndX = Math.cos(aBolt.mAngEnd) * aEndDist;
                    var aEndY = Math.sin(aBolt.mAngEnd) * aEndDist;
                    if(aBolt.mHitOtherGem) {
                        var aPiece = this.mFXManager.mBoard.GetPieceById(aBolt.mHitOtherGemId);
                        if(aPiece != null) {
                            aEndDist = Game.Piece.GetAngleRadiusColorFrame(aBolt.mAngEnd, this.mGemColor, aFrame);
                            aEndDist = (this.mCirclePct.GetOutVal() * 48.0) + ((1.0 - this.mCirclePct.GetOutVal()) * aEndDist);
                            aEndX = (aPiece.mX - aPieceX) / 1.0 + Math.cos(aBolt.mAngEnd) * aEndDist;
                            aEndY = (aPiece.mY - aPieceY) / 1.0 + Math.sin(aBolt.mAngEnd) * aEndDist;
                        }
                    }
                    for(var aPtNum = 0; aPtNum < aBolt.mNumMidPoints + 1; aPtNum++) {
                        var aPct = (aPtNum + 1) / (aBolt.mNumMidPoints + 1);
                        var anAng = aBolt.mAngStart * (1.0 - aPct) + aBolt.mAngEnd * aPct;
                        var aDistAdd = 0.0;
                        if(aPtNum < aBolt.mNumMidPoints) {
                            aDistAdd = aBolt.mMidPointsPos[aPtNum];
                        }
                        var aDist = Game.Piece.GetAngleRadiusColorFrame(anAng, this.mGemColor, aFrame);
                        aDist = ((this.mCirclePct.GetOutVal() * 48.0) + ((1.0 - this.mCirclePct.GetOutVal()) * aDist) + aDistAdd) * this.mRadiusScale.GetOutVal();
                        var aX = Math.cos(anAng) * aDist;
                        var aY = Math.sin(anAng) * aDist;
                        if((aBolt.mCrossover) || (aBolt.mHitOtherGem)) {
                            var aTrajAng = Math.atan2(aEndY - aLastY, aEndX - aLastX);
                            aX = aStartX * (1.0 - aPct) + aEndX * aPct;
                            aY = aStartY * (1.0 - aPct) + aEndY * aPct;
                            if(aPtNum < aBolt.mNumMidPoints) {
                                aX += Math.sin(aTrajAng) * aBolt.mMidPointsPos[aPtNum];
                                aY += Math.cos(aTrajAng) * aBolt.mMidPointsPos[aPtNum];
                            }
                        }
                        var aColor1 = aColor;
                        var aColor2 = aColor;
                        if((!aBolt.mCrossover) && (!aBolt.mHitOtherGem)) {
                            aColor1.mAlpha = ((Math.max(2, ((255.0 * (1.0 - aLastDistAdd * 0.03)) | 0))) | 0);
                            aColor2.mAlpha = ((Math.max(2, ((255.0 * (1.0 - aDistAdd * 0.03)) | 0))) | 0);
                        }
                        aColor1.mAlpha = ((aColor1.mAlpha * anAlpha) | 0);
                        aColor2.mAlpha = ((aColor2.mAlpha * anAlpha) | 0);
                        this.DrawElectroLine(g, Game.Resources['IMAGE_ELECTROTEX'], (aPieceX + ((Game.Board.GEM_WIDTH / 2) | 0) + aLastX), (aPieceY + ((Game.Board.GEM_HEIGHT / 2) | 0) + aLastY), (aPieceX + ((Game.Board.GEM_WIDTH / 2) | 0) + aX), (aPieceY + ((Game.Board.GEM_HEIGHT / 2) | 0) + aY), aBolt.mHitOtherGem ? 8.0 : (aBolt.mCrossover ? 9.0 : 6.0), aColor2.ToInt(), aColor1.ToInt());
                        var aColorCenter1 = GameFramework.gfx.Color.CreateFromInt(GameFramework.gfx.Color.WHITE_RGB);
                        var aColorCenter2 = GameFramework.gfx.Color.CreateFromInt(GameFramework.gfx.Color.WHITE_RGB);
                        if((!aBolt.mCrossover) && (!aBolt.mHitOtherGem)) {
                            aColorCenter1.mAlpha = ((Math.max(2, ((255.0 * (0.85 - aLastDistAdd * 0.04)) | 0))) | 0);
                            aColorCenter2.mAlpha = ((Math.max(2, ((255.0 * (0.85 - aDistAdd * 0.04)) | 0))) | 0);
                        }
                        if(aBolt.mCrossover) {
                            aColorCenter1.mAlpha = ((aColorCenter1.mAlpha * 0.5) | 0);
                            aColorCenter2.mAlpha = ((aColorCenter2.mAlpha * 0.5) | 0);
                        }
                        aColorCenter1.mAlpha = ((aColorCenter1.mAlpha * anAlpha) | 0);
                        aColorCenter2.mAlpha = ((aColorCenter2.mAlpha * anAlpha) | 0);
                        this.DrawElectroLine(g, Game.Resources['IMAGE_ELECTROTEX_CENTER'], aPieceX + ((Game.Board.GEM_WIDTH / 2) | 0) + aLastX, aPieceY + ((Game.Board.GEM_HEIGHT / 2) | 0) + aLastY, aPieceX + Game.Board.GEM_WIDTH / 2.0 + aX, aPieceY + Game.Board.GEM_HEIGHT / 2.0 + aY, aBolt.mHitOtherGem ? 8.0 : (aBolt.mCrossover ? 8.0 : 6.0), aColorCenter1.ToInt(), aColorCenter2.ToInt());
                        aLastX = aX;
                        aLastY = aY;
                        aLastDist = aDist;
                        aLastDistAdd = aDistAdd;
                    }
                } finally {
                    _t20.Dispose();
                }
            }
            if(aRelPiece != null) {
                if(aRelPiece.mScale.GetOutVal() != 1.0) {
                    g.PopMatrix();
                }
            }
        } finally {
            _t17.Dispose();
        }
    }
}
Game.TimeBonusEffect.staticInit = function Game_TimeBonusEffect$staticInit() {
    Game.TimeBonusEffect.mElectoLineVertices = null;
}

JS_AddInitFunc(function() {
    Game.TimeBonusEffect.registerClass('Game.TimeBonusEffect', Game.Effect);
});
JS_AddStaticInitFunc(function() {
    Game.TimeBonusEffect.staticInit();
});
/**
 * @constructor
 */
Game.SpeedCollectEffect = function Game_SpeedCollectEffect(theSpeedBoard, theSrc, theTgt, theTimeCollected, theTimeMod) {
    this.mSpline = new GameFramework.misc.BSpline();
    this.mSplineInterp = new GameFramework.CurvedVal();
    this.mAlphaOut = new GameFramework.CurvedVal();
    this.mScaleCv = new GameFramework.CurvedVal();
    this.mStartPoint = new GameFramework.geom.TIntPoint();
    this.mTargetPoint = new GameFramework.geom.TIntPoint();
    this.mLastPoint = new GameFramework.geom.TIntPoint();
    Game.SpeedCollectEffect.initializeBase(this, [Game.Effect.EFxType.CUSTOMCLASS]);
    this.mTimeCollected = theTimeCollected;
    this.mBoard = theSpeedBoard;
    this.mX = theSrc.x;
    this.mY = theSrc.y;
    this.mLastPoint = new GameFramework.geom.TIntPoint(theSrc.x, theSrc.y);
    this.mDAlpha = 0;
    this.mUpdateCnt = 0;
    this.mStartPoint = new GameFramework.geom.TIntPoint(theSrc.x, theSrc.y);
    this.mTargetPoint = new GameFramework.geom.TIntPoint(theTgt.x, theTgt.y);
    this.mLastRotation = 0.0;
    this.mCentering = false;
    this.mTimeMod = theTimeMod;
    this.mSparkles = null;
    this.mTimeBonusEffect = null;
}
Game.SpeedCollectEffect.prototype = {
    mSpline : null,
    mSplineInterp : null,
    mAlphaOut : null,
    mScaleCv : null,
    mSparkles : null,
    mTimeBonusEffect : null,
    mUpdateCnt : 0,
    mAccel : 0,
    mBoard : null,
    mCentering : null,
    mStartPoint : null,
    mTargetPoint : null,
    mLastPoint : null,
    mLastRotation : 0,
    mTimeMod : 0,
    mTimeCollected : 0,
    Dispose : function Game_SpeedCollectEffect$Dispose() {
        if(this.mSparkles != null) {
            this.mSparkles.mDeleteMe = true;
            this.mSparkles.mRefCount--;
        }
        this.mSparkles = null;
        if(this.mTimeBonusEffect != null) {
            this.mTimeBonusEffect.mDeleteMe = true;
            this.mTimeBonusEffect.mRefCount--;
        }
        this.mTimeBonusEffect = null;
    },
    Init : function Game_SpeedCollectEffect$Init(thePiece) {
        this.mSplineInterp.mAppUpdateCountSrc = this.mFXManager;
        this.mScaleCv.mAppUpdateCountSrc = this.mFXManager;
        this.mSplineInterp.SetCurve('b-0,1,0.016667,2,####   R0+vy      N~TJe');
        this.mSplineInterp.SetInRange(0.0, this.mSplineInterp.mInMax * this.mTimeMod);
        this.mAlphaOut.SetCurve('b-0,1,0,1,~###      H~###   X####');
        this.mAlphaOut.mIncRate = this.mSplineInterp.mIncRate;
        this.mAlphaOut.mInMax = this.mSplineInterp.mInMax + 0.0;
        this.mScaleCv.SetConstant(1.0);
        this.mSpline.AddPoint(this.mX, this.mY);
        this.mSpline.AddPoint(520, 150);
        this.mSpline.AddPoint(this.mTargetPoint.x, this.mTargetPoint.y);
        this.mSpline.CalculateSpline(false);
        this.mSparkles = new Game.ParticleEffect(Game.Resources['PIEFFECT_QUEST_DIG_COLLECT_GOLD']);
        this.mSparkles.SetEmitAfterTimeline(true);
        this.mSparkles.mDoDrawTransform = false;
        this.mSparkles.mRefCount++;
        this.mFXManager.AddEffect(this.mSparkles);
        var fxArr = this.mFXManager.mBoard.mPostFXManager.mEffects[(Game.Effect.EFxType.TIME_BONUS | 0)];
        for(var i = 0; i < fxArr.length; ++i) {
            var anEffect = fxArr[(i | 0)];
            if(anEffect.mPieceIdRel == thePiece.mId) {
                this.mTimeBonusEffect = anEffect;
                this.mTimeBonusEffect.mLightIntensity = 6.0;
                this.mTimeBonusEffect.mLightSize = 300.0;
                this.mTimeBonusEffect.mValue = Array.Create(2, null);
                this.mTimeBonusEffect.mValue[0] = 50.0;
                this.mTimeBonusEffect.mValue[1] = -0.0005;
                this.mTimeBonusEffect.mRefCount++;
                this.mTimeBonusEffect.mPieceIdRel = -1;
                this.mTimeBonusEffect.mOverlay = true;
                this.mTimeBonusEffect.mCirclePct.SetCurve('b+0,1,0.04,1,####         ~~###');
                this.mTimeBonusEffect.mRadiusScale.SetCurve('b+0.65,1,0.02,1,~n%T         ~#?j,');
                break;
            }
        }
    },
    CalcRotation : function Game_SpeedCollectEffect$CalcRotation() {
        if(this.mCentering) {
            return 0.0;
        }
        if(!this.mSplineInterp.HasBeenTriggered()) {
            var rotation = Math.atan2(this.mLastPoint.y - this.mY, this.mX - this.mLastPoint.x);
            var deltaRotation = rotation - this.mLastRotation;
            deltaRotation = (deltaRotation < 0.0 ? -1.0 : 1.0) * Math.min(0.03, Math.abs(deltaRotation));
            this.mLastRotation += deltaRotation;
            this.mLastPoint.x = (this.mX | 0);
            this.mLastPoint.y = (this.mY | 0);
        }
        return this.mLastRotation;
    },
    Update : function Game_SpeedCollectEffect$Update() {
        Game.Effect.prototype.Update.apply(this);
        ++this.mUpdateCnt;
        if(this.mCentering) {
            this.mX = this.mStartPoint.x + this.mSplineInterp.GetOutVal() * (this.mFXManager.mBoard.GetBoardCenterX() - this.mStartPoint.x);
            this.mY = this.mStartPoint.y + this.mSplineInterp.GetOutVal() * (this.mFXManager.mBoard.GetBoardCenterY() - this.mStartPoint.y);
            if(!this.mSplineInterp.IncInVal()) {
                Game.SoundUtil.Play(Game.Resources['SOUND_QUEST_GET']);
                this.mSplineInterp.SetCurve('b-0,1,0.01,2,####  `D2UB       A~###');
                this.mSplineInterp.SetInRange(0.0, this.mSplineInterp.mInMax * this.mTimeMod);
                this.mCentering = false;
                this.mSpline.AddPoint(this.mX, this.mY);
                this.mSpline.AddPoint(800, 150);
                this.mSpline.AddPoint(600, 175);
                this.mSpline.AddPoint(400, 150);
                this.mSpline.AddPoint(200, 300);
                this.mSpline.AddPoint(this.mTargetPoint.x, this.mTargetPoint.y);
                this.mSpline.CalculateSpline(false);
                this.mScaleCv.SetCurve('b;1,3,0.01,1,~###  q####       0####');
                this.mScaleCv.SetInRange(0.0, this.mScaleCv.mInMax * this.mTimeMod);
            }
        } else {
            this.mX = this.mSpline.GetXPoint(this.mSplineInterp.GetOutVal() * this.mSpline.GetMaxT());
            this.mY = this.mSpline.GetYPoint(this.mSplineInterp.GetOutVal() * this.mSpline.GetMaxT());
        }
        if(this.mSparkles != null) {
            this.mSparkles.mX = this.mX + -30;
            this.mSparkles.mY = this.mY + -20;
        }
        if(this.mTimeBonusEffect != null) {
            this.mTimeBonusEffect.mX = this.mX;
            this.mTimeBonusEffect.mY = this.mY;
        }
        this.mScaleCv.IncInVal();
        if(this.mCentering) {
            return;
        }
        if(!this.mSplineInterp.IncInVal()) {
        }
        if(this.mAlphaOut.IsDoingCurve()) {
            if(this.mAlphaOut.CheckUpdatesFromEndThreshold(10)) {
                this.mBoard.TimeCollected(this.mTimeCollected);
            }
            if(!this.mAlphaOut.IncInVal()) {
                this.mDeleteMe = true;
            }
            if(this.mSparkles != null) {
                this.mSparkles.mAlpha = this.mAlphaOut.GetOutVal();
            }
            if(this.mTimeBonusEffect != null) {
                this.mTimeBonusEffect.mAlpha = this.mAlphaOut.GetOutVal();
            }
        }
    },
    Draw : function Game_SpeedCollectEffect$Draw(g) {
    },
    WantExpandedTopWidget : function Game_SpeedCollectEffect$WantExpandedTopWidget() {
        return 1;
    }
}
Game.SpeedCollectEffect.staticInit = function Game_SpeedCollectEffect$staticInit() {
}

JS_AddInitFunc(function() {
    Game.SpeedCollectEffect.registerClass('Game.SpeedCollectEffect', Game.Effect);
});
JS_AddStaticInitFunc(function() {
    Game.SpeedCollectEffect.staticInit();
});
/**
 * @constructor
 */
Game.LightningBarFillEffect = function Game_LightningBarFillEffect() {
    this.mPoints = Array.Create2D(Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS, 2, null);
    Game.LightningBarFillEffect.initializeBase(this, [Game.Effect.EFxType.CUSTOMCLASS]);
    this.mPercentDone = 0.0;
    for(var i = 0; i < Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS; ++i) {
        for(var j = 0; j < 2; ++j) {
            this.mPoints[this.mPoints.mIdxMult0 * (i) + j] = new GameFramework.geom.TPoint();
        }
    }
}
Game.LightningBarFillEffect.prototype = {
    mPoints : null,
    mPercentDone : 0,
    Update : function Game_LightningBarFillEffect$Update() {
        var isNew = this.mPercentDone == 0.0;
        this.mPercentDone += 0.012 * 1.67;
        if(this.mPercentDone > 1.0) {
            this.mDeleteMe = true;
            return;
        }
        var aPullFactor = Math.max(0.0, 1.0 - ((1.0 - this.mPercentDone) * 3.0));
        if((this.mFXManager.mBoard.mUpdateCnt % 2 == 0) || (isNew)) {
            var aStartX = 200;
            var aStartY = 320;
            var anEndX = 550 + this.mFXManager.mBoard.mLevelBarPct * 1000;
            var anEndY = 70;
            for(var aLightningPointNum = 0; aLightningPointNum < Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS; aLightningPointNum++) {
                var aDistAlong = aLightningPointNum / (Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS - 1);
                var aCenterMult = 1.0 - Math.abs(1.0 - aDistAlong * 2.0);
                var aCenterX = (aStartX * (1.0 - aDistAlong)) + (anEndX * aDistAlong) + aCenterMult * (GameFramework.Utils.GetRandFloat() * 60.0);
                var aCenterY = (aStartY * (1.0 - aDistAlong)) + (anEndY * aDistAlong) + aCenterMult * (GameFramework.Utils.GetRandFloat() * 60.0);
                var aPoint = this.mPoints[this.mPoints.mIdxMult0 * (aLightningPointNum) + 0];
                var aPointR = this.mPoints[this.mPoints.mIdxMult0 * (aLightningPointNum) + 1];
                if((aLightningPointNum == 0) || (aLightningPointNum == Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS - 1)) {
                    aPoint.x = aCenterX;
                    aPoint.y = aCenterY;
                    aPointR.x = aCenterX;
                    aPointR.y = aCenterY;
                } else {
                    var aWidthMult = 60.0;
                    aPoint.x = aCenterX + GameFramework.Utils.GetRandFloat() * aWidthMult;
                    aPoint.y = aCenterY + GameFramework.Utils.GetRandFloat() * aWidthMult;
                    aPointR.x = aCenterX + GameFramework.Utils.GetRandFloat() * aWidthMult;
                    aPointR.y = aCenterY + GameFramework.Utils.GetRandFloat() * aWidthMult;
                }
            }
        }
    },
    Draw : function Game_LightningBarFillEffect$Draw(g) {
        var aBrightness = Math.min((1.0 - this.mPercentDone) * 8.0, 1.0) * this.mFXManager.mBoard.GetPieceAlpha();
        var aCenterColor = ((aBrightness * 255.0) | 0);
        if(GameFramework.BaseApp.mApp.get_Is3D()) {
            var aTriVertices = Array.Create2D((Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS - 1) * 2, 3, null);
            for(var i = 0; i < (Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS - 1) * 2; i++) {
                aTriVertices[aTriVertices.mIdxMult0 * (i) + 0] = new GameFramework.gfx.TriVertex();
                aTriVertices[aTriVertices.mIdxMult0 * (i) + 1] = new GameFramework.gfx.TriVertex();
                aTriVertices[aTriVertices.mIdxMult0 * (i) + 2] = new GameFramework.gfx.TriVertex();
            }
            var aTriCount = 0;
            var aColor = GameFramework.gfx.Color.RGBAToInt(255, 200, 100, aCenterColor);
            for(var aLightningPointNum = 0; aLightningPointNum < Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS - 1; aLightningPointNum++) {
                var aPoint = this.mPoints[this.mPoints.mIdxMult0 * (aLightningPointNum) + 0];
                var aPointR = this.mPoints[this.mPoints.mIdxMult0 * (aLightningPointNum) + 1];
                var aPointD = this.mPoints[this.mPoints.mIdxMult0 * (aLightningPointNum + 1) + 0];
                var aPointRD = this.mPoints[this.mPoints.mIdxMult0 * (aLightningPointNum + 1) + 1];
                var aV = aLightningPointNum / (Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS - 1);
                var aVD = (aLightningPointNum + 1) / (Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS - 1);
                if(aLightningPointNum == 0) {
                    var aTri = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 0];
                    aTri.x = aPoint.x;
                    aTri.y = aPoint.y;
                    aTri.u = 0.5;
                    aTri.v = aV;
                    aTri.color = aColor;
                    aTri = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 1];
                    aTri.x = aPointRD.x;
                    aTri.y = aPointRD.y;
                    aTri.u = 1.0;
                    aTri.v = aVD;
                    aTri.color = aColor;
                    aTri = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 2];
                    aTri.x = aPointD.x;
                    aTri.y = aPointD.y;
                    aTri.u = 0.0;
                    aTri.v = aVD;
                    aTri.color = aColor;
                    aTriCount++;
                } else if(aLightningPointNum == Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS - 2) {
                    var aTri_2 = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 0];
                    aTri_2.x = aPoint.x;
                    aTri_2.y = aPoint.y;
                    aTri_2.u = 0.0;
                    aTri_2.v = aV;
                    aTri_2.color = aColor;
                    aTri_2 = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 1];
                    aTri_2.x = aPointR.x;
                    aTri_2.y = aPointR.y;
                    aTri_2.u = 1.0;
                    aTri_2.v = aV;
                    aTri_2.color = aColor;
                    aTri_2 = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 2];
                    aTri_2.x = aPointD.x;
                    aTri_2.y = aPointD.y;
                    aTri_2.u = 0.5;
                    aTri_2.v = aVD;
                    aTri_2.color = aColor;
                    aTriCount++;
                } else {
                    var aTri_3 = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 0];
                    aTri_3.x = aPoint.x;
                    aTri_3.y = aPoint.y;
                    aTri_3.u = 0.0;
                    aTri_3.v = aV;
                    aTri_3.color = aColor;
                    aTri_3 = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 1];
                    aTri_3.x = aPointRD.x;
                    aTri_3.y = aPointRD.y;
                    aTri_3.u = 1.0;
                    aTri_3.v = aVD;
                    aTri_3.color = aColor;
                    aTri_3 = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 2];
                    aTri_3.x = aPointD.x;
                    aTri_3.y = aPointD.y;
                    aTri_3.u = 0.0;
                    aTri_3.v = aVD;
                    aTri_3.color = aColor;
                    aTriCount++;
                    aTri_3 = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 0];
                    aTri_3.x = aPoint.x;
                    aTri_3.y = aPoint.y;
                    aTri_3.u = 0.0;
                    aTri_3.v = aV;
                    aTri_3.color = aColor;
                    aTri_3 = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 1];
                    aTri_3.x = aPointR.x;
                    aTri_3.y = aPointR.y;
                    aTri_3.u = 1.0;
                    aTri_3.v = aV;
                    aTri_3.color = aColor;
                    aTri_3 = aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 2];
                    aTri_3.x = aPointRD.x;
                    aTri_3.y = aPointRD.y;
                    aTri_3.u = 1.0;
                    aTri_3.v = aVD;
                    aTri_3.color = aColor;
                    aTriCount++;
                }
            }
            Game.Resources['IMAGE_LIGHTNING_TEX'].set_Additive(true);
            g.DrawTrianglesTex(Game.Resources['IMAGE_LIGHTNING_TEX'], aTriVertices);
            var aCenterColorI = GameFramework.gfx.Color.RGBAToInt(aCenterColor, aCenterColor, aCenterColor, 255);

            {
                var $srcArray21 = aTriVertices;
                for(var $enum21 = 0; $enum21 < $srcArray21.length; $enum21++) {
                    var aTriVertex = $srcArray21[$enum21];
                    aTriVertex.color = aCenterColorI;
                }
            }
            Game.Resources['IMAGE_LIGHTNING_CENTER'].set_Additive(true);
            g.DrawTrianglesTex(Game.Resources['IMAGE_LIGHTNING_CENTER'], aTriVertices);
        } else {
            var aColor_2 = GameFramework.gfx.Color.RGBToInt(255, 200, 100);
            for(var aLightningPointNum_2 = 0; aLightningPointNum_2 < Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS - 1; aLightningPointNum_2++) {
                var aPoint_2 = this.mPoints[this.mPoints.mIdxMult0 * (aLightningPointNum_2) + 0];
                var aPointR_2 = this.mPoints[this.mPoints.mIdxMult0 * (aLightningPointNum_2) + 1];
                var aPointD_2 = this.mPoints[this.mPoints.mIdxMult0 * (aLightningPointNum_2 + 1) + 0];
                var aPointRD_2 = this.mPoints[this.mPoints.mIdxMult0 * (aLightningPointNum_2 + 1) + 1];
                var aSidePct = 0.3;
                var aCenterX = ((aPoint_2.x) * aSidePct) + ((aPointR_2.x) * (1.0 - aSidePct));
                var aCenterY = ((aPoint_2.y) * aSidePct) + ((aPointR_2.y) * (1.0 - aSidePct));
                var aCenterRX = ((aPointR_2.x) * aSidePct) + ((aPoint_2.x) * (1.0 - aSidePct));
                var aCenterRY = ((aPointR_2.y) * aSidePct) + ((aPoint_2.y) * (1.0 - aSidePct));
                var aCenterDX = ((aPointD_2.x) * aSidePct) + ((aPointRD_2.x) * (1.0 - aSidePct));
                var aCenterDY = ((aPointD_2.y) * aSidePct) + ((aPointRD_2.y) * (1.0 - aSidePct));
                var aCenterRDX = ((aPointRD_2.x) * aSidePct) + ((aPointD_2.x) * (1.0 - aSidePct));
                var aCenterRDY = ((aPointRD_2.y) * aSidePct) + ((aPointD_2.y) * (1.0 - aSidePct));
                var aPt = Array.Create2D(3, 2, null);
                var _t22 = g.PushColor(aColor_2);
                try {
                    aPt[aPt.mIdxMult0 * (0) + 0] = (aPoint_2.x | 0);
                    aPt[aPt.mIdxMult0 * (0) + 1] = (aPoint_2.y | 0);
                    aPt[aPt.mIdxMult0 * (1) + 0] = (aPointRD_2.x | 0);
                    aPt[aPt.mIdxMult0 * (1) + 1] = (aPointRD_2.y | 0);
                    aPt[aPt.mIdxMult0 * (2) + 0] = (aPointD_2.x | 0);
                    aPt[aPt.mIdxMult0 * (2) + 1] = (aPointD_2.y | 0);
                    aPt[aPt.mIdxMult0 * (0) + 0] = (aPoint_2.x | 0);
                    aPt[aPt.mIdxMult0 * (0) + 1] = (aPoint_2.y | 0);
                    aPt[aPt.mIdxMult0 * (1) + 0] = (aPointR_2.x | 0);
                    aPt[aPt.mIdxMult0 * (1) + 1] = (aPointR_2.y | 0);
                    aPt[aPt.mIdxMult0 * (2) + 0] = (aPointRD_2.x | 0);
                    aPt[aPt.mIdxMult0 * (2) + 1] = (aPointRD_2.y | 0);
                } finally {
                    _t22.Dispose();
                }
                var _t23 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, aCenterColor));
                try {
                    aPt[aPt.mIdxMult0 * (0) + 0] = (aCenterX | 0);
                    aPt[aPt.mIdxMult0 * (0) + 1] = (aCenterY | 0);
                    aPt[aPt.mIdxMult0 * (1) + 0] = (aCenterRDX | 0);
                    aPt[aPt.mIdxMult0 * (1) + 1] = (aCenterRDY | 0);
                    aPt[aPt.mIdxMult0 * (2) + 0] = (aCenterDX | 0);
                    aPt[aPt.mIdxMult0 * (2) + 1] = (aCenterDY | 0);
                    g.PolyFill(aPt);
                    aPt[aPt.mIdxMult0 * (0) + 0] = (aCenterX | 0);
                    aPt[aPt.mIdxMult0 * (0) + 1] = (aCenterY | 0);
                    aPt[aPt.mIdxMult0 * (1) + 0] = (aCenterRX | 0);
                    aPt[aPt.mIdxMult0 * (1) + 1] = (aCenterRY | 0);
                    aPt[aPt.mIdxMult0 * (2) + 0] = (aCenterRDX | 0);
                    aPt[aPt.mIdxMult0 * (2) + 1] = (aCenterRDY | 0);
                    g.PolyFill(aPt);
                } finally {
                    _t23.Dispose();
                }
            }
        }
    }
}
Game.LightningBarFillEffect.staticInit = function Game_LightningBarFillEffect$staticInit() {
    Game.LightningBarFillEffect.NUM_BARFILL_LIGTNING_POINTS = 8;
}

JS_AddInitFunc(function() {
    Game.LightningBarFillEffect.registerClass('Game.LightningBarFillEffect', Game.Effect);
});
JS_AddStaticInitFunc(function() {
    Game.LightningBarFillEffect.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\SpeedBoard.cs
//LineMap:2=3 5=21 7=16 8=22 17=26 22=32 32=43 50=60 59=65 62=129 64=109 66=117 70=128 71=130 73=133 74=137 76=148 80=153 84=158 86=161 138=164 143=172 166=196 169=200 170=202 183=216 188=235 192=240 194=243 196=246 200=251 202=254 204=257 205=259 218=283 220=289 225=295 
//LineMap:228=299 232=314 233=323 243=331 244=334 246=338 255=348 257=351 278=373 298=394 321=418 337=435 345=444 364=461 366=465 370=470 378=479 381=483 384=487 390=492 396=499 397=501 399=504 400=506 402=510 407=516 409=519 414=543 416=546 421=552 428=560 431=564 434=566 
//LineMap:439=570 445=575 452=581 457=587 459=590 467=597 472=601 477=605 482=611 486=616 499=628 504=632 511=637 512=643 514=646 516=649 518=652 523=658 533=667 538=673 542=678 553=690 579=715 583=718 584=720 586=723 588=726 589=728 590=730 591=732 594=740 595=742 596=744 
//LineMap:599=748 601=753 602=757 604=762 606=765 607=767 610=771 612=774 613=776 615=779 617=782 625=791 630=797 632=800 634=803 636=806 639=810 643=815 648=821 649=823 652=827 664=840 665=842 668=846 670=849 672=852 673=855 675=856 678=858 680=858 682=859 683=859 685=859 
//LineMap:687=860 688=860 691=862 692=864 698=872 699=874 700=876 701=878 705=883 710=890 713=895 715=898 724=905 726=910 728=913 730=914 731=916 736=922 740=925 742=932 754=945 765=957 769=962 771=966 776=972 777=974 783=981 785=984 786=989 787=991 790=996 795=1002 
//LineMap:797=1005 808=1015 815=1025 821=1032 826=1036 828=1041 830=1044 846=1064 847=1066 850=1070 852=1074 855=1079 858=1083 859=1089 868=1102 869=1104 872=1108 874=1111 877=1116 880=1120 881=1122 884=1127 886=1130 889=1132 892=1137 897=1143 903=1150 905=1153 908=1157 
//LineMap:916=1171 922=1178 931=1189 935=1194 936=1197 958=1220 959=1222 960=1240 963=1244 970=1250 971=1252 973=1255 974=1257 979=1264 983=1269 987=1274 988=1276 989=1278 991=1281 993=1282 997=1287 999=1290 1003=1296 1006=1300 1012=1307 1014=1314 1020=1323 1021=1325 
//LineMap:1030=1335 1036=1343 1040=1348 1041=1350 1045=1355 1048=1380 1059=1390 1062=1394 1068=1401 1074=1406 1077=1410 1081=1415 1083=1420 1084=1422 1085=1424 1087=1427 1088=1429 1100=1438 1106=1445 1115=1452 1122=1455 1127=1459 1136=1497 1138=1500 1141=1504 1151=1511 
//LineMap:1153=1516 1155=1519 1160=1522 1162=1526 1167=1533 1170=1535 1174=1541 1175=1543 1179=1548 1184=1551 1192=1554 1196=1559 1197=1561 1203=1568 1204=1570 1212=1579 1218=1584 1219=1588 1222=1590 1228=1593 1233=1597 1240=1601 1243=1605 1245=1608 1251=1610 1252=1612 
//LineMap:1254=1615 1256=1618 1259=1619 1265=1621 1271=1626 1274=1631 1276=1634 1285=1640 1288=1642 1294=1645 1299=1649 1306=1653 1307=1655 1310=1657 1316=1660 1321=1664 1325=1669 1332=1673 1340=1677 1342=1680 1348=1687 1349=1689 1350=1696 1369=1710 1374=1720 1396=1725 
//LineMap:1399=1734 1401=1729 1403=1733 1404=1735 1417=1742 1421=1747 1422=1749 1428=1756 1435=1764 1442=1773 1448=1780 1451=1782 1455=1787 1457=1788 1460=1790 1462=1790 1464=1791 1465=1791 1467=1791 1469=1792 1470=1792 1472=1792 1474=1793 1475=1793 1477=1793 1479=1794 
//LineMap:1480=1794 1482=1794 1484=1795 1485=1795 1487=1795 1489=1796 1490=1796 1492=1796 1494=1797 1495=1797 1499=1802 1504=1806 1517=1812 1530=1820 1533=1830 1535=1825 1537=1829 1538=1831 1553=1839 1557=1844 1558=1846 1564=1853 1571=1861 1574=1865 1575=1868 1577=1871 
//LineMap:1585=1880 1598=1894 1601=1898 1603=1901 1604=1906 1605=1908 1607=1911 1609=1914 1610=1917 1611=1922 1614=1926 1618=1931 1623=1937 1629=1941 1631=1945 1640=1955 1642=1956 1647=1964 1648=1972 1655=1980 1660=1986 1661=1988 1664=1992 1670=1996 1672=2000 1674=2000 
//LineMap:1676=2004 1678=2004 1680=2008 1683=2008 1685=2013 1689=2015 1691=2019 1693=2019 1695=2023 1697=2023 1699=2027 1702=2031 1704=2032 1709=2035 1711=2039 1712=2041 1714=2041 1716=2045 1718=2045 1720=2049 1722=2052 1724=2055 1726=2058 1730=2063 1732=2066 1734=2069 
//LineMap:1741=2077 1743=2080 1745=2083 1749=2088 1752=2092 1755=2096 1760=2102 1766=2109 1770=2114 1774=2119 1780=2124 1781=2126 1784=2127 1786=2131 1788=2134 1791=2138 1793=2139 1796=2143 1804=2152 1823=2172 1827=2178 1829=2181 1833=2186 1834=2188 1838=2193 1842=2198 
//LineMap:1843=2200 1844=2202 1846=2206 1851=2243 1853=2244 1862=2254 1871=2264 1880=2274 1889=2284 1898=2294 1908=2308 1913=2351 1917=2356 1920=2358 1922=2361 1927=2367 1928=2369 1933=2373 1934=2378 1937=2380 1950=2386 1953=2390 1957=2393 1962=2399 1964=2402 1968=2407 
//LineMap:1979=2419 1983=2424 1988=2430 1990=2433 1993=2437 1995=2440 2001=2447 2008=2455 2010=2460 2011=2469 2018=2477 2023=2483 2025=2486 2026=2496 2037=2504 2056=2513 2059=2538 2061=2515 2065=2525 2068=2537 2069=2539 2103=2555 2111=2564 2123=2577 2125=2580 2128=2584 
//LineMap:2129=2586 2133=2591 2138=2597 2164=2624 2180=2641 2184=2646 2187=2650 2190=2654 2197=2662 2204=2668 2207=2672 2212=2678 2217=2684 2218=2686 2220=2689 2223=2697 2229=2704 2231=2708 2233=2711 2240=2717 2255=2727 2258=2735 2260=2731 2261=2734 2262=2736 2263=2738 
//LineMap:2272=2743 2275=2747 2281=2754 2282=2756 2286=2761 2288=2764 2291=2768 2292=2770 2294=2773 2296=2776 2306=2787 2307=2789 2320=2803 2322=2807 2323=2809 2329=2816 2331=2819 2337=2826 2339=2829 2341=2832 2347=2839 2353=2846 2359=2853 2361=2853 2363=2858 2369=2865 
//LineMap:2375=2872 2381=2879 2383=2882 2391=2891 2397=2898 2403=2905 2404=2907 2410=2914 2416=2921 2422=2928 2425=2932 2427=2935 2430=2936 2434=2937 2437=2938 2441=2946 2443=2947 2444=2949 2450=2956 2451=2958 2459=2967 2460=2973 2463=2975 2469=2984 2483=2997 2490=3005 
//LineMap:2508=2729 
//Start:SpeedEndLevelDialog
/**
 * @constructor
 */
Game.SpeedEndLevelDialog = function Game_SpeedEndLevelDialog(theBoard) {
    Game.SpeedEndLevelDialog.initializeBase(this, [theBoard]);
    this.mSpeedBoard = theBoard;
    this.mTotalBonusTime = this.mSpeedBoard.mTotalBonusTime;
}
Game.SpeedEndLevelDialog.prototype = {
    mSpeedBoard : null,
    mTotalBonusTime : 0,
    Update : function Game_SpeedEndLevelDialog$Update() {
        Game.EndLevelDialog.prototype.Update.apply(this);
    },
    DrawStatsLabels : function Game_SpeedEndLevelDialog$DrawStatsLabels(g) {
        g.DrawStringEx('Highest Multiplier', 230, 475 + 48 * 0, -1, -1);
        g.DrawStringEx('Best Move', 230, 475 + 48 * 1, -1, -1);
        g.DrawStringEx('Longest Cascade', 230, 475 + 48 * 2, -1, -1);
        g.DrawStringEx('Total Time', 230, 475 + 48 * 3, -1, -1);
    },
    DrawStatsText : function Game_SpeedEndLevelDialog$DrawStatsText(g) {
        g.DrawStringEx(String.format('x{0}', this.mPointMultiplier), 765, 475 + 48 * 0, -1, 1);
        g.DrawStringEx(GameFramework.Utils.CommaSeperate(this.mGameStats[(Game.DM.EStat.BIGGESTMOVE | 0)]), 765, 475 + 48 * 1, -1, 1);
        g.DrawStringEx(GameFramework.Utils.CommaSeperate(this.mGameStats[(Game.DM.EStat.BIGGESTMATCH | 0)]), 765, 475 + 48 * 2, -1, 1);
        var aSeconds = 60 + this.mTotalBonusTime;
        g.DrawStringEx(String.format('{0}:{1:00}', ((aSeconds / 60) | 0), aSeconds % 60), 765, 475 + 48 * 3, -1, 1);
    },
    Draw : function Game_SpeedEndLevelDialog$Draw(g) {
        Game.EndLevelDialog.prototype.Draw.apply(this, [g]);
        var _t1 = g.PushTranslate(-160, 0);
        try {
            g.DrawImage(Game.Resources['IMAGE_GAMEOVER_SECTION_GRAPH'].get_OffsetImage(), 0, 0);
            g.DrawImage(Game.Resources['IMAGE_GAMEOVER_LINES'].get_OffsetImage(), 0, 0);
            g.DrawImage(Game.Resources['IMAGE_GAMEOVER_ICON_FLAME'].get_OffsetImage(), 0, 0);
            g.DrawImage(Game.Resources['IMAGE_GAMEOVER_ICON_STAR'].get_OffsetImage(), 0, 0);
            g.DrawImage(Game.Resources['IMAGE_GAMEOVER_ICON_HYPERCUBE'].get_OffsetImage(), 0, 0);
            g.DrawImage(Game.Resources['IMAGE_GAMEOVER_ICON_LIGHTNING'].get_OffsetImage(), 0, 0);
            g.DrawImage(Game.Resources['IMAGE_GAMEOVER_BOX_YELLOW'].get_OffsetImage(), 0, 0);
            g.DrawImage(Game.Resources['IMAGE_GAMEOVER_BOX_PINK'].get_OffsetImage(), 0, 0);
            g.DrawImage(Game.Resources['IMAGE_GAMEOVER_BOX_ORANGE'].get_OffsetImage(), 0, 0);
        } finally {
            _t1.Dispose();
        }
        g.SetFont(Game.Resources['FONT_GAMEOVER_DIALOG_SMALL']);
        Game.Resources['FONT_GAMEOVER_DIALOG_SMALL'].PushLayerColor('OUTLINE', 0xf404020);
        g.DrawString(String.format('FLAME x{0}', this.mGameStats[(Game.DM.EStat.FLAMEGEMS_MADE | 0)]), 276, 723);
        g.DrawString(String.format('STAR x{0}', this.mGameStats[(Game.DM.EStat.LASERGEMS_MADE | 0)]), 467, 723);
        g.DrawString(String.format('HYPER x{0}', this.mGameStats[(Game.DM.EStat.HYPERCUBES_MADE | 0)]), 645, 723);
        g.DrawString(String.format('TIME +{0}:{1:00}', ((this.mTotalBonusTime / 60) | 0), this.mTotalBonusTime % 60), 830, 723);
        g.DrawString('SPEED', 1005, 723);
        g.DrawString('SPECIAL', 1130, 723);
        g.DrawString('MATCHES', 1275, 723);
        Game.Resources['FONT_GAMEOVER_DIALOG_SMALL'].PopLayerColor('OUTLINE');
        var aMaxSectionPoints = 0;
        var aPointTypes = Array.Create(3, 3, Game.Board.EPointType.MATCH, Game.Board.EPointType.SPECIAL, Game.Board.EPointType.SPEED);
        var aTotalPoints = 0;
        for(var aPointSection = 0; aPointSection < (this.mPointsBreakdown.length | 0); aPointSection++) {
            var aCurSectionPoints = 0;
            for(var aPointTypeIdx = 0; aPointTypeIdx < aPointTypes.length; aPointTypeIdx++) {
                aCurSectionPoints += this.mPointsBreakdown[aPointSection][(aPointTypes[aPointTypeIdx] | 0)];
            }
            aMaxSectionPoints = ((Math.max(aMaxSectionPoints, aCurSectionPoints)) | 0);
            aTotalPoints += aCurSectionPoints;
        }
        var aChunkPoints;
        if(aMaxSectionPoints <= 5000) {
            aChunkPoints = 1000;
        } else if(aMaxSectionPoints <= 10000) {
            aChunkPoints = 2000;
        } else {
            aChunkPoints = ((((aMaxSectionPoints + 24999) / 25000) | 0)) * 5000;
        }
        var aCurX = 360;
        var aSectionWidth = ((880 / (this.mPointsBreakdown.length | 0)) | 0);
        g.SetFont(Game.Resources['FONT_GAMEOVER_DIALOG_MED']);
        var _t2 = g.PushColor(0xffd0b090);
        try {
            for(var i = 0; i < 5; i++) {
                g.DrawStringEx(String.format('{0}k', (((i + 1) * aChunkPoints / 1000) | 0)), 330, 975 + i * -46, -1, 1);
            }
        } finally {
            _t2.Dispose();
        }
        for(var aPointSection_2 = 0; aPointSection_2 < (this.mPointsBreakdown.length | 0); aPointSection_2++) {
            for(var aPointTypeIdx_2 = aPointTypes.length - 1; aPointTypeIdx_2 >= 0; aPointTypeIdx_2--) {
                var aCurSectionPoints_2 = 0;
                for(var aPointTypeAdd = 0; aPointTypeAdd <= aPointTypeIdx_2; aPointTypeAdd++) {
                    aCurSectionPoints_2 += this.mPointsBreakdown[aPointSection_2][(aPointTypes[aPointTypeAdd] | 0)];
                }
                var aBarImages = Array.Create(3, 3, Game.Resources['IMAGE_GAMEOVER_BAR__PINK'], Game.Resources['IMAGE_GAMEOVER_BAR_ORANGE'], Game.Resources['IMAGE_GAMEOVER_BAR_YELLOW']);
                var aHeight = ((225.0 * aCurSectionPoints_2 / (aChunkPoints * 5.0) * this.mCountupPct.GetOutVal()) | 0);
                if(aHeight > 0) {
                    aHeight = ((Math.max(aHeight, 10)) | 0);
                    g.DrawImageBox(aBarImages[aPointTypeIdx_2], aCurX + 10, 1005 - aHeight, aSectionWidth - 20, aHeight, 0);
                }
                g.DrawStringCentered((aPointSection_2 == (this.mPointsBreakdown.length | 0) - 1) ? 'Last' : String.format('x{0}', aPointSection_2 + 1), aCurX + ((aSectionWidth / 2) | 0), 1043);
            }
            aCurX += aSectionWidth;
        }
    }
}
Game.SpeedEndLevelDialog.staticInit = function Game_SpeedEndLevelDialog$staticInit() {
}

JS_AddInitFunc(function() {
    Game.SpeedEndLevelDialog.registerClass('Game.SpeedEndLevelDialog', Game.EndLevelDialog);
});
JS_AddStaticInitFunc(function() {
    Game.SpeedEndLevelDialog.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\SpeedEndLevelDialog.cs
//LineMap:1=2 2=4 5=21 7=20 8=22 16=26 29=38 38=49 41=53 44=55 46=58 58=67 64=74 67=78 68=80 69=82 70=84 71=86 74=90 76=93 79=97 82=101 85=105 87=108 91=111 98=115 105=123 106=125 112=132 114=135 
//Start:SpreadCurve
/**
 * @constructor
 */
Game.SpreadCurve = function Game_SpreadCurve(theSize) {
    this.mSize = theSize;
    this.mVals = Array.Create(this.mSize, null);
    for(var i = 0; i < this.mSize; ++i) {
        this.mVals[i] = i / theSize;
    }
}
Game.SpreadCurve.CreateFromCurve = function Game_SpreadCurve$CreateFromCurve(theCurve) {
    var ret = new Game.SpreadCurve(256);
    ret.SetToCurve(theCurve);
    return ret;
}
Game.SpreadCurve.prototype = {
    mVals : null,
    mSize : 0,
    SetToCurve : function Game_SpreadCurve$SetToCurve(theCurve) {
        var tempDist = Array.Create(this.mSize, null);
        for(var i = 0; i < this.mSize; ++i) {
            tempDist[i] = 0.0;
        }
        JS_Assert(theCurve.mOutMax <= 1.0);
        JS_Assert(theCurve.mInMax >= 0.0);
        var total = 0.0;
        for(var i_2 = 0; i_2 < this.mSize; ++i_2) {
            var val = theCurve.GetOutValAt(i_2 / this.mSize);
            tempDist[i_2] += val;
            total += val;
        }
        var cur = 0;
        var tgt = 0.0;
        var sizeDbl = this.mSize;
        for(var i_3 = 0; i_3 < this.mSize; ++i_3) {
            this.mVals[i_3] = 1.0;
            tgt += tempDist[i_3] / total * (sizeDbl - 1.0);
            var val_2 = i_3 / (sizeDbl - 1.0);
            while(cur <= tgt) {
                if(cur < sizeDbl) {
                    JS_Assert(val_2 <= 1.0 && val_2 >= 0.0);
                    this.mVals[cur] = val_2;
                }
                ++cur;
            }
        }
    },
    GetOutVal : function Game_SpreadCurve$GetOutVal(theVal) {
        var idx = (Math.max(0, Math.min(this.mSize - 1, ((theVal * (this.mSize - 1)) | 0))) | 0);
        return this.mVals[idx];
    }
}
Game.SpreadCurve.staticInit = function Game_SpreadCurve$staticInit() {
}

JS_AddInitFunc(function() {
    Game.SpreadCurve.registerClass('Game.SpreadCurve', null);
});
JS_AddStaticInitFunc(function() {
    Game.SpreadCurve.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\SpreadCurve.cs
//LineMap:1=2 2=4 5=11 7=12 9=15 12=19 23=26 28=32 30=35 37=44 40=48 43=52 52=62 57=66 
//Start:Tooltip
/**
 * @constructor
 */
Game.TooltipManager = function Game_TooltipManager() {
    this.mCurrentRequestedPos = new GameFramework.geom.TPoint(0, 0);
    this.mTooltips = [];
    this.mAlpha = new GameFramework.CurvedVal();
    this.mArrowOffset = new GameFramework.CurvedVal();
    Game.TooltipManager.initializeBase(this);
    this.mAlpha.SetCurve('b+0,1,0.01,1,####         ~~###');
    this.mArrowOffset.SetConstant(-16);
}
Game.TooltipManager.prototype = {
    mCurrentRequestedPos : null,
    mCurrentTooltipIdx : 0,
    mTooltips : null,
    mAlpha : null,
    mArrowOffset : null,
    RequestTooltip : function Game_TooltipManager$RequestTooltip(theCallingWidget, theHeaderText, theBodyText, thePos, theWidth, theArrowDir, theTimer) {
        this.RequestTooltipEx(theCallingWidget, theHeaderText, theBodyText, thePos, theWidth, theArrowDir, theTimer, null, null, 0, 0xffffffff);
    },
    RequestTooltipEx : function Game_TooltipManager$RequestTooltipEx(theCallingWidget, theHeaderText, theBodyText, thePos, theWidth, theArrowDir, theTimer, theFontResourceTitle, theFontResource, theHeightAdj, theColor) {
        for(var i = 0; i < (this.mTooltips.length | 0); i++) {
            if((thePos == this.mTooltips[i].mRequestedPos) && (theBodyText == this.mTooltips[i].mBodyText)) {
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
        aTip.mFontResourceTitle = theFontResourceTitle != null ? theFontResourceTitle : Game.Resources['FONT_TOOLTIP_BOLD'];
        aTip.mFontResource = theFontResource != null ? theFontResource : Game.Resources['FONT_TOOLTIP'];
        aTip.mHeight = Game.Resources['IMAGE_TOOLTIP'].mHeight - 20;
        var g = new GameFramework.gfx.Graphics(Game.BejApp.mBejApp.mWidth, Game.BejApp.mBejApp.mHeight);
        g.SetFont(aTip.mFontResource);
        var aTextHeight = 0;
        var aTestText = '';
        if(aTip.mHeaderText != '') {
            aTestText += aTip.mHeaderText;
            if(aTip.mBodyText != '') {
                aTestText += '\n';
            }
        }
        if(aTip.mBodyText != '') {
            if(aTextHeight > 0) {
                aTestText += aTip.mBodyText;
            }
        }
        if(aTip.mHeight < aTextHeight + 75) {
            aTip.mHeight = aTextHeight + 75;
        }
        aTip.mHeight += theHeightAdj;
        aTip.mOffsetPos.x = aTip.mRequestedPos.x;
        aTip.mOffsetPos.y = aTip.mRequestedPos.y;
        var anOffset = 20;
        switch(aTip.mArrowDir) {
            case Game.Tooltip.EArrowDir.ARROW_UP:
            {
                aTip.mOffsetPos.x += -aTip.mWidth / 2.0;
                aTip.mOffsetPos.y += anOffset;
                break;
            }
            case Game.Tooltip.EArrowDir.ARROW_DOWN:
            {
                aTip.mOffsetPos.x += -aTip.mWidth / 2.0;
                aTip.mOffsetPos.y += -aTip.mHeight - anOffset;
                break;
            }
            case Game.Tooltip.EArrowDir.ARROW_LEFT:
            {
                aTip.mOffsetPos.x += anOffset;
                aTip.mOffsetPos.y += -aTip.mHeight / 2.0;
                break;
            }
            case Game.Tooltip.EArrowDir.ARROW_RIGHT:
            {
                aTip.mOffsetPos.x += -aTip.mWidth - anOffset;
                aTip.mOffsetPos.y += -aTip.mHeight / 2.0;
                break;
            }
        }
        this.mTooltips.push(aTip);
        this.mCurrentRequestedPos = new GameFramework.geom.TPoint(thePos.x, thePos.y);
    }
}
Game.TooltipManager.staticInit = function Game_TooltipManager$staticInit() {
}

JS_AddInitFunc(function() {
    Game.TooltipManager.registerClass('Game.TooltipManager', GameFramework.widgets.ClassicWidget);
});
JS_AddStaticInitFunc(function() {
    Game.TooltipManager.staticInit();
});
/**
 * @constructor
 */
Game.Tooltip = function Game_Tooltip() {
    this.mRequestedPos = new GameFramework.geom.TPoint(0, 0);
    this.mOffsetPos = new GameFramework.geom.TPoint(0, 0);
}
Game.Tooltip.prototype = {
    mRequestedPos : null,
    mOffsetPos : null,
    mWidth : 0,
    mHeight : 0,
    mArrowDir : null,
    mHeaderText : null,
    mBodyText : null,
    mTimer : 0,
    mAlphaPct : 0,
    mAppearing : null,
    mFontResourceTitle : null,
    mFontResource : null,
    mColor : 0
}
Game.Tooltip.staticInit = function Game_Tooltip$staticInit() {
}

JS_AddInitFunc(function() {
    Game.Tooltip.registerClass('Game.Tooltip', null);
});
JS_AddStaticInitFunc(function() {
    Game.Tooltip.staticInit();
});
Game.Tooltip.EArrowDir = {};
Game.Tooltip.EArrowDir.staticInit = function Game_Tooltip_EArrowDir$staticInit() {
    Game.Tooltip.EArrowDir.ARROW_UP = 0;
    Game.Tooltip.EArrowDir.ARROW_DOWN = 1;
    Game.Tooltip.EArrowDir.ARROW_LEFT = 2;
    Game.Tooltip.EArrowDir.ARROW_RIGHT = 3;
    Game.Tooltip.EArrowDir.NONE = 4;
}
JS_AddInitFunc(function() {
    Game.Tooltip.EArrowDir.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\Tooltip.cs
//LineMap:2=3 5=21 7=14 8=16 12=25 13=28 23=66 30=86 38=95 39=97 41=100 50=112 51=114 53=117 55=120 58=125 61=129 65=134 68=141 70=144 71=148 74=152 75=152 77=155 81=157 87=161 93=165 101=174 110=278 115=289 140=280 143=282 
//Start:TutorialMgr
/**
 * @constructor
 */
Game.TutorialStep = function Game_TutorialStep() {
    this.mType = Game.TutorialStep.EType.ModalDialogOkBtnClear;
    this.mArrowShowPct = GameFramework.CurvedVal.CreateAsConstant(0.0);
    this.mUiAccessibleGems = [];
    this.mHighlightShowPct = GameFramework.CurvedVal.CreateAsConstant(0.0);
    this.mHighlightRect = null;
    this.mDialogInsets = null;
    this.mShowOkBtnCv = null;
    this.mAutohintPieceLoc = null;
    this.mArrowDir = Game.TutorialStep.EArrowDir.None;
    this.mTutorialId = Game.DM.ETutorial._COUNT;
    this.mBlockTimer = Game.TutorialStep.EBlockTimerType.None;
    this.mState = Game.TutorialStep.EState.Init;
    this.mSpecialBehavior = Game.TutorialStep.ESpecialBehavior.None;
    this.mHintDlg = null;
}
Game.TutorialStep.AddGemGridXYToRect = function Game_TutorialStep$AddGemGridXYToRect(theBoard, theRect, theCol, theRow, theHighlightRectGemPadding) {
    if(theHighlightRectGemPadding === undefined) {
        theHighlightRectGemPadding = 0.0;
    }
    var gemRect = new GameFramework.TRect(theBoard.GetColScreenX(theCol) - theHighlightRectGemPadding, theBoard.GetRowScreenY(theRow) - theHighlightRectGemPadding, Game.Board.GEM_WIDTH + theHighlightRectGemPadding * 2.0, Game.Board.GEM_HEIGHT + theHighlightRectGemPadding * 2.0);
    if(theRect == null || theRect.mWidth == 0 || theRect.mHeight == 0) {
        return gemRect;
    }
    return theRect.Union(gemRect);
}
Game.TutorialStep.prototype = {
    mSequence : null,
    mTextHeader : '',
    mText : '',
    mType : null,
    mArrowShowPct : null,
    mUiAccessibleGems : null,
    mLimitUiAccessibleGems : true,
    mHighlightShowPct : null,
    mHighlightRect : null,
    mDialogWidth : 0.0,
    mDialogHeight : 0.0,
    mDialogAnchorX : 0.0,
    mDialogAnchorY : 0.0,
    mDialogInsets : null,
    mDialogSpaceAfterHeader : 0,
    mWantDrawFxOnTop : false,
    mShowOkBtnCv : null,
    mAllowStandardHints : false,
    mAutohintPieceLoc : null,
    mAutohintTime : -1,
    mArrowDir : null,
    mTutorialId : null,
    mArrowX : -1.0,
    mArrowY : -1.0,
    mDelay : 0,
    mBlockDuringDelay : false,
    mBlockTimer : null,
    mBlockTimerParam : 0,
    mBlockTimerParam2 : 0,
    mHighlightRectGemPadding : 10.0,
    mState : null,
    mSpecialBehavior : null,
    mHintDlg : null,
    mUpdateCnt : 0,
    mFinishCountdown : 0,
    Finish : function Game_TutorialStep$Finish() {
        if(this.mSpecialBehavior == Game.TutorialStep.ESpecialBehavior.TimeGem && this.mState != Game.TutorialStep.EState.Finishing) {
            this.mFinishCountdown = ((60.0 * 2.5) | 0);
            this.mState = Game.TutorialStep.EState.Finishing;
        } else {
            this.mState = Game.TutorialStep.EState.Finished;
        }
    },
    WasFinished : function Game_TutorialStep$WasFinished() {
        return this.mState == Game.TutorialStep.EState.Finished;
    },
    Kill : function Game_TutorialStep$Kill(theDoFadeOut) {
        if(this.mHintDlg != null) {
            this.mHintDlg.Kill();
        }
        this.mArrowShowPct.SetCurveRef('TutorialMgr_cs_11_14_11__19_18_09_946');
        if(theDoFadeOut) {
            this.mHighlightShowPct.SetCurveRef('TutorialMgr_cs_11_14_11__19_05_53_409');
        } else {
            this.mHighlightShowPct.SetConstant(0.0);
        }
    },
    Update : function Game_TutorialStep$Update() {
        if(this.mShowOkBtnCv != null) {
            this.mShowOkBtnCv.IncInVal();
            if(this.mHintDlg != null) {
                this.mHintDlg.mShowBtnPct = this.mShowOkBtnCv.get_v();
            }
        }
        if(this.mState == Game.TutorialStep.EState.Init) {
            if(this.mDelay > 0) {
                --this.mDelay;
            } else {
                this.Start();
            }
        } else {
            ++this.mUpdateCnt;
        }
        if(this.mState != Game.TutorialStep.EState.Finished && this.mFinishCountdown > 0) {
            --this.mFinishCountdown;
            if(this.mFinishCountdown == 0) {
                this.Finish();
            }
        }
    },
    Draw : function Game_TutorialStep$Draw(g) {
        if(this.mHintDlg != null) {
            this.mHintDlg.Move(this.mDialogAnchorX, this.mDialogAnchorY);
        }
        var _t1 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(Math.min(1.0, this.mHighlightShowPct.get_v())));
        try {
            if(this.mHighlightRect != null) {
                if(this.mSpecialBehavior == Game.TutorialStep.ESpecialBehavior.HintBtn) {
                    Game.TutorialMgr.DrawHighlightCircle(g, this.mHighlightRect);
                } else {
                    if(this.mSpecialBehavior == Game.TutorialStep.ESpecialBehavior.MultiplierUp) {
                        var sepX = 450.0;
                        Game.TutorialMgr.DrawHighlightBox(g, new GameFramework.TRect(62.0, 240.0, 360.0, 500.0), new GameFramework.TRect(0, 0, sepX, GameFramework.BaseApp.mApp.mHeight));
                        Game.TutorialMgr.DrawHighlightBox(g, this.mHighlightRect, new GameFramework.TRect(sepX, 0, GameFramework.BaseApp.mApp.mWidth - sepX, GameFramework.BaseApp.mApp.mHeight));
                    } else if(this.mSpecialBehavior == Game.TutorialStep.ESpecialBehavior.TimeGem && (this.mState == Game.TutorialStep.EState.Finishing || this.mState == Game.TutorialStep.EState.Finished)) {
                        var sepX_2 = 450.0;
                        Game.TutorialMgr.DrawHighlightBox(g, new GameFramework.TRect(62.0, 240.0, 360.0, 500.0), new GameFramework.TRect(0, 0, sepX_2, GameFramework.BaseApp.mApp.mHeight));
                        Game.TutorialMgr.DrawHighlightBox(g, this.mHighlightRect, new GameFramework.TRect(sepX_2, 0, GameFramework.BaseApp.mApp.mWidth - sepX_2, GameFramework.BaseApp.mApp.mHeight));
                    } else {
                        Game.TutorialMgr.DrawHighlightBox(g, this.mHighlightRect);
                    }
                }
            }
        } finally {
            _t1.Dispose();
        }
        var _t2 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mArrowShowPct.get_v()));
        try {
            if(this.mArrowDir != Game.TutorialStep.EArrowDir.None) {
                var rotation = 0.0;
                var extraDist = 50.0 + (Math.sin(this.mUpdateCnt / 10.0) / 2.0 + 0.5) * 50.0;
                var extraX = 0.0;
                var extraY = 0.0;
                var arrRes = Game.Resources['IMAGE_BOARD_HIGHLIGHT_ARROW'];
                if(this.mSpecialBehavior == Game.TutorialStep.ESpecialBehavior.Timer) {
                    extraX -= (this.mSequence.mMgr.mBoard.mGameTicks - 120.0) * 0.25;
                }
                switch(this.mArrowDir) {
                    case Game.TutorialStep.EArrowDir.Down:
                    {
                        rotation = Math.PI / 2.0;
                        extraY += -extraDist;
                        break;
                    }
                    case Game.TutorialStep.EArrowDir.Up:
                    {
                        rotation = -Math.PI / 2.0;
                        extraY += extraDist;
                        break;
                    }
                    case Game.TutorialStep.EArrowDir.Left:
                    {
                        rotation = Math.PI;
                        extraX += extraDist;
                        break;
                    }
                    default:
                    {
                        rotation = 0.0;
                        extraX += -extraDist;
                        break;
                    }
                }
                var m = new GameFramework.geom.Matrix();
                m.translate(-this.mArrowX - arrRes.mWidth / 2.0, -this.mArrowY);
                m.rotate(rotation);
                m.translate(this.mArrowX + extraX, this.mArrowY + extraY);
                g.PushMatrix(m);
                g.DrawImage(arrRes.get_CenteredImage(), this.mArrowX, this.mArrowY);
                g.PopMatrix();
            }
        } finally {
            _t2.Dispose();
        }
    },
    Start : function Game_TutorialStep$Start() {
        this.mState = Game.TutorialStep.EState.Started;
        var aBoard = this.mSequence.mMgr.mBoard;
        if(this.mAutohintPieceLoc != null) {
            var aPiece = aBoard.GetPieceAtColRow(this.mAutohintPieceLoc.x, this.mAutohintPieceLoc.y);
            if(aPiece != null) {
                aBoard.mAutohintOverridePieceId = aPiece.mId;
                aBoard.mAutohintOverrideTime = this.mAutohintTime;
            }
        } else {
            aBoard.mAutohintOverridePieceId = -1;
            aBoard.mAutohintOverrideTime = -1;
        }
        if(this.mHighlightShowPct.get_v() == 0.0) {
            this.mHighlightShowPct.SetCurveRef('TutorialMgr_cs_11_11_11__15_19_51_707');
        }
        this.mArrowShowPct.SetCurveRef('TutorialMgr_cs_11_11_11__15_19_51_707');
        if(this.mHintDlg != null) {
            this.mHintDlg.Kill();
        }
        if(this.mType == Game.TutorialStep.EType.ModalDialogOkBtnClear) {
            this.mHintDlg = new Game.HintDialog(this.mTextHeader, this.mText, true, false);
            this.mHintDlg.mWantsDarken = false;
        } else if(this.mType == Game.TutorialStep.EType.ModalDialogMoveClear || this.mType == Game.TutorialStep.EType.ModalDialog) {
            this.mHintDlg = new Game.HintDialog(this.mTextHeader, this.mText, true, false);
            this.mHintDlg.mWantsDarken = false;
            this.mHintDlg.mShowBtnPct = 0.0;
        }
        Game.BejApp.mBejApp.mDialogMgr.AddDialog(this.mHintDlg);
        this.mHintDlg.AddEventListener(GameFramework.widgets.DialogEvent.CLOSED, ss.Delegate.create(this, this.handleHintDialogClosed));
        this.mHintDlg.mFlushPriority = 1;
        if(this.mDialogWidth != 0.0 || this.mDialogHeight != 0.0) {
            if(this.mDialogInsets != null) {
                this.mHintDlg.mContentInsets = this.mDialogInsets;
            }
            if(this.mDialogSpaceAfterHeader != 0) {
                this.mHintDlg.mSpaceAfterHeader = this.mDialogSpaceAfterHeader;
            }
            this.mHintDlg.Resize(this.mHintDlg.mX, this.mHintDlg.mY, this.mDialogWidth != 0.0 ? this.mDialogWidth : this.mHintDlg.mWidth, this.mDialogHeight != 0.0 ? this.mDialogHeight : this.mHintDlg.mHeight);
            this.mHintDlg.mFullHeight = this.mHintDlg.mHeight;
        }
        this.mHintDlg.Move(this.mDialogAnchorX, this.mDialogAnchorY);
    },
    handleHintDialogClosed : function Game_TutorialStep$handleHintDialogClosed(e) {
        this.mState = Game.TutorialStep.EState.Finished;
        if(this.mHintDlg != null && this.mHintDlg.mNoHintsCheckbox.IsChecked()) {
            this.mSequence.mMgr.SetTutorialEnabled(false);
            if(this.mTutorialId != Game.DM.ETutorial._COUNT) {
                Game.BejApp.mBejApp.mBoard.SetTutorialCleared(this.mTutorialId);
            }
        }
    },
    PointArrowAt : function Game_TutorialStep$PointArrowAt(theBoard, theCol, theRow, theArrowDir) {
        var gemRect = new GameFramework.TRect(theBoard.GetColScreenX(theCol), theBoard.GetRowScreenY(theRow), Game.Board.GEM_WIDTH, Game.Board.GEM_HEIGHT);
        this.mArrowDir = theArrowDir;
        this.mArrowX = gemRect.mX + gemRect.mWidth / 2;
        this.mArrowY = gemRect.mY + gemRect.mHeight / 2;
    },
    AddGemGridXY : function Game_TutorialStep$AddGemGridXY(theBoard, theCol, theRow, theIsUISelectable, theAddToHighlightRect) {
        if(theIsUISelectable === undefined) {
            theIsUISelectable = true;
        }
        if(theAddToHighlightRect === undefined) {
            theAddToHighlightRect = true;
        }
        var newPt = new GameFramework.geom.TIntPoint(theCol, theRow);
        if(theIsUISelectable) {
            this.mUiAccessibleGems.push(newPt);
        }
        if(theAddToHighlightRect) {
            this.mHighlightRect = Game.TutorialStep.AddGemGridXYToRect(theBoard, this.mHighlightRect, theCol, theRow, this.mHighlightRectGemPadding);
        }
    }
}
Game.TutorialStep.staticInit = function Game_TutorialStep$staticInit() {
}

JS_AddInitFunc(function() {
    Game.TutorialStep.registerClass('Game.TutorialStep', null);
});
JS_AddStaticInitFunc(function() {
    Game.TutorialStep.staticInit();
});
Game.TutorialStep.EType = {};
Game.TutorialStep.EType.staticInit = function Game_TutorialStep_EType$staticInit() {
    Game.TutorialStep.EType.ModalDialogOkBtnClear = 0;
    Game.TutorialStep.EType.ModalDialogMoveClear = 1;
    Game.TutorialStep.EType.ModalDialog = 2;
}
JS_AddInitFunc(function() {
    Game.TutorialStep.EType.staticInit();
});
Game.TutorialStep.EArrowDir = {};
Game.TutorialStep.EArrowDir.staticInit = function Game_TutorialStep_EArrowDir$staticInit() {
    Game.TutorialStep.EArrowDir.None = -1;
    Game.TutorialStep.EArrowDir.Left = 0;
    Game.TutorialStep.EArrowDir.Right = 1;
    Game.TutorialStep.EArrowDir.Up = 2;
    Game.TutorialStep.EArrowDir.Down = 3;
}
JS_AddInitFunc(function() {
    Game.TutorialStep.EArrowDir.staticInit();
});
Game.TutorialStep.EState = {};
Game.TutorialStep.EState.staticInit = function Game_TutorialStep_EState$staticInit() {
    Game.TutorialStep.EState.Init = 0;
    Game.TutorialStep.EState.Started = 1;
    Game.TutorialStep.EState.Finishing = 2;
    Game.TutorialStep.EState.Finished = 3;
}
JS_AddInitFunc(function() {
    Game.TutorialStep.EState.staticInit();
});
Game.TutorialStep.ESpecialBehavior = {};
Game.TutorialStep.ESpecialBehavior.staticInit = function Game_TutorialStep_ESpecialBehavior$staticInit() {
    Game.TutorialStep.ESpecialBehavior.None = 0;
    Game.TutorialStep.ESpecialBehavior.HintBtn = 1;
    Game.TutorialStep.ESpecialBehavior.Timer = 2;
    Game.TutorialStep.ESpecialBehavior.TimeGem = 3;
    Game.TutorialStep.ESpecialBehavior.MultiplierUp = 4;
}
JS_AddInitFunc(function() {
    Game.TutorialStep.ESpecialBehavior.staticInit();
});
Game.TutorialStep.EBlockTimerType = {};
Game.TutorialStep.EBlockTimerType.staticInit = function Game_TutorialStep_EBlockTimerType$staticInit() {
    Game.TutorialStep.EBlockTimerType.None = 0;
    Game.TutorialStep.EBlockTimerType.Pause = 1;
    Game.TutorialStep.EBlockTimerType.PauseAfterParam = 2;
    Game.TutorialStep.EBlockTimerType.PauseUntilParam = 3;
    Game.TutorialStep.EBlockTimerType.PlayBetweenParams = 4;
    Game.TutorialStep.EBlockTimerType.PauseBetweenParams = 5;
}
JS_AddInitFunc(function() {
    Game.TutorialStep.EBlockTimerType.staticInit();
});
/**
 * @constructor
 */
Game.TutorialSequence = function Game_TutorialSequence() {
    this.mTutorialSteps = [];
}
Game.TutorialSequence.prototype = {
    mTutorialSteps : null,
    mCurStepIdx : -1,
    mRunning : true,
    mMgr : null,
    mBoardSeed : 0,
    mKillStep : null,
    Add : function Game_TutorialSequence$Add(theStep) {
        theStep.mSequence = this;
        this.mTutorialSteps.push(theStep);
    },
    AdvanceStep : function Game_TutorialSequence$AdvanceStep() {
        var wantDisableTutorials = false;
        var aStep = this.GetCurrentStep();
        if(aStep != null && aStep.mHintDlg != null && aStep.mHintDlg.mNoHintsCheckbox.IsChecked()) {
            wantDisableTutorials = true;
        }
        if(aStep != null && aStep.mTutorialId != Game.DM.ETutorial._COUNT) {
            if(wantDisableTutorials) {
                this.mMgr.SetTutorialEnabled(false);
            }
            Game.BejApp.mBejApp.mBoard.SetTutorialCleared(aStep.mTutorialId);
        }
        this.KillCurrent(wantDisableTutorials || this.mCurStepIdx + 1 >= this.mTutorialSteps.length || !this.mMgr.GetTutorialEnabled());
        if(wantDisableTutorials) {
            this.mCurStepIdx = this.mTutorialSteps.length;
        } else if(this.mCurStepIdx < this.mTutorialSteps.length) {
            ++this.mCurStepIdx;
        }
        if(this.mCurStepIdx > 0) {
            aStep = this.GetCurrentStep();
            if(aStep != null) {
                aStep.mHighlightShowPct.SetConstant(1.0);
            }
        }
        return this.mCurStepIdx < this.mTutorialSteps.length;
    },
    GetCurrentStep : function Game_TutorialSequence$GetCurrentStep() {
        if(this.mCurStepIdx < this.mTutorialSteps.length && this.mCurStepIdx >= 0) {
            return this.mTutorialSteps[this.mCurStepIdx];
        }
        return null;
    },
    KillCurrent : function Game_TutorialSequence$KillCurrent(theDoFadeOut) {
        this.mKillStep = this.GetCurrentStep();
        if(this.mKillStep != null) {
            this.mKillStep.Kill(theDoFadeOut);
        }
    },
    HasTutorialQueued : function Game_TutorialSequence$HasTutorialQueued(theTutorial) {
        for(var i = 0; i < this.mTutorialSteps.length; ++i) {
            if(this.mTutorialSteps[i].mTutorialId == theTutorial) {
                return true;
            }
        }
        return false;
    },
    Update : function Game_TutorialSequence$Update() {
        var aStep = this.GetCurrentStep();
        if(aStep == null || aStep.WasFinished()) {
            while(true) {
                this.AdvanceStep();
                var thisStep = this.GetCurrentStep();
                if(thisStep == null || (this.mMgr.GetTutorialFlags() & (1 << (thisStep.mTutorialId | 0))) == 0) {
                    break;
                }
            }
        } else if(aStep != null) {
            aStep.Update();
        }
        if(this.mKillStep != null && this.mKillStep.mArrowShowPct.get_v() + this.mKillStep.mHighlightShowPct.get_v() == 0.0) {
            this.mKillStep = null;
        }
    },
    Draw : function Game_TutorialSequence$Draw(g) {
        var curStep = this.GetCurrentStep();
        if(curStep != null) {
            curStep.Draw(g);
        }
        if(this.mKillStep != null) {
            this.mKillStep.Draw(g);
        }
    }
}
Game.TutorialSequence.staticInit = function Game_TutorialSequence$staticInit() {
}

JS_AddInitFunc(function() {
    Game.TutorialSequence.registerClass('Game.TutorialSequence', null);
});
JS_AddStaticInitFunc(function() {
    Game.TutorialSequence.staticInit();
});
/**
 * @constructor
 */
Game.TutorialMgr = function Game_TutorialMgr(theBoard) {
    Game.TutorialMgr.G = this;
    this.mBoard = theBoard;
    this.mProfile = Game.BejApp.mBejApp.mProfile;
}
Game.TutorialMgr.DrawHighlightCircle = function Game_TutorialMgr$DrawHighlightCircle(g, theRect, theScreenRect) {
    if(theScreenRect === undefined) {
        theScreenRect = null;
    }
    var _t3 = g.PushColor(0xc0000000);
    try {
        var aX1 = g.GetSnappedX(theRect.mX);
        var aX2 = g.GetSnappedX(theRect.mX + theRect.mWidth);
        var aY1 = g.GetSnappedX(theRect.mY);
        var aY2 = g.GetSnappedX(theRect.mY + theRect.mHeight);
        theRect = new GameFramework.TRect(aX1, aY1, aX2 - aX1, aY2 - aY1);
        if(theScreenRect == null) {
            theScreenRect = new GameFramework.TRect(GameFramework.BaseApp.mApp.mX, GameFramework.BaseApp.mApp.mY, GameFramework.BaseApp.mApp.mDrawWidth, GameFramework.BaseApp.mApp.mDrawHeight);
        }
        g.FillRect(theScreenRect.mX, theScreenRect.mY, theRect.mX - theScreenRect.mX, theScreenRect.mHeight);
        g.FillRect(theRect.mX, theScreenRect.mY, theRect.mWidth, theRect.mY);
        g.FillRect(theRect.mX, theRect.mY + theRect.mHeight, theRect.mWidth, theScreenRect.mHeight - (theRect.mY + theRect.mHeight));
        g.FillRect(theRect.mX + theRect.mWidth, theScreenRect.mY, theScreenRect.mWidth - (theRect.mX - theScreenRect.mX + theRect.mWidth), theScreenRect.mHeight);
        var anImageInst = Game.Resources['IMAGE_BOARD_HIGHLIGHT_CIRCLE'].CreateImageInstRect(1, 1, Game.Resources['IMAGE_BOARD_HIGHLIGHT_CIRCLE'].mPhysCelWidth - 2, Game.Resources['IMAGE_BOARD_HIGHLIGHT_CIRCLE'].mPhysCelHeight - 2);
        var _t4 = g.PushScale(theRect.mWidth / (anImageInst.mSrcWidth / g.mScale), theRect.mHeight / (anImageInst.mSrcHeight / g.mScale), aX1, aY1);
        try {
            g.DrawImage(anImageInst, aX1, aY1);
        } finally {
            _t4.Dispose();
        }
    } finally {
        _t3.Dispose();
    }
}
Game.TutorialMgr.DrawHighlightBox = function Game_TutorialMgr$DrawHighlightBox(g, theRect, theScreenRect) {
    if(theScreenRect === undefined) {
        theScreenRect = null;
    }
    if(theScreenRect == null) {
        theScreenRect = new GameFramework.TRect(GameFramework.BaseApp.mApp.mX, GameFramework.BaseApp.mApp.mY, GameFramework.BaseApp.mApp.mDrawWidth, GameFramework.BaseApp.mApp.mDrawHeight);
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
        g.FillRect(theRect.mX, theRect.mY + theRect.mHeight, theRect.mWidth, theScreenRect.mHeight - (theRect.mY + theRect.mHeight));
        g.FillRect(theRect.mX + theRect.mWidth, theScreenRect.mY, theScreenRect.mWidth - (theRect.mX - theScreenRect.mX + theRect.mWidth), theScreenRect.mHeight);
        g.DrawImageBox(Game.Resources['IMAGE_BOARD_HIGHLIGHT_FULL'], theRect.mX, theRect.mY, theRect.mWidth, theRect.mHeight, 0);
    } finally {
        _t5.Dispose();
    }
}
Game.TutorialMgr.prototype = {
    mProfile : null,
    mBoard : null,
    mCurTutorial : null,
    GetTutorialFlags : function Game_TutorialMgr$GetTutorialFlags() {
        return this.mProfile.mTutorialFlags;
    },
    SetTutorialFlags : function Game_TutorialMgr$SetTutorialFlags(theFlags) {
        this.mProfile.mTutorialFlags = theFlags;
    },
    GetTutorialEnabled : function Game_TutorialMgr$GetTutorialEnabled() {
        return this.mProfile.mTutorialEnabled;
    },
    SetTutorialEnabled : function Game_TutorialMgr$SetTutorialEnabled(theEnabled) {
        this.mProfile.mTutorialEnabled = theEnabled;
    },
    GetTutorialSequence : function Game_TutorialMgr$GetTutorialSequence() {
        return this.mCurTutorial;
    },
    SetTutorialSequence : function Game_TutorialMgr$SetTutorialSequence(theSeq) {
        this.mCurTutorial = theSeq;
        if(this.mCurTutorial != null) {
            this.mCurTutorial.mMgr = this;
        }
    },
    Kill : function Game_TutorialMgr$Kill() {
        if(this.mCurTutorial != null) {
            this.mCurTutorial.KillCurrent(true);
            this.mCurTutorial.mRunning = false;
            this.mCurTutorial = null;
        }
    },
    Update : function Game_TutorialMgr$Update() {
        if(this.mCurTutorial != null && this.mCurTutorial.mRunning) {
            this.mCurTutorial.Update();
        }
    },
    GetCurrentStep : function Game_TutorialMgr$GetCurrentStep() {
        if(this.GetTutorialEnabled() && this.mCurTutorial != null) {
            return this.mCurTutorial.GetCurrentStep();
        }
        return null;
    },
    Draw : function Game_TutorialMgr$Draw(g) {
        var a = this.mBoard.GetPieceAlpha();
        if(a != 1.0) {
            g.PushColor(GameFramework.gfx.Color.FAlphaToInt(a));
        }
        if(this.mCurTutorial != null) {
            this.mCurTutorial.Draw(g);
        }
        if(a != 1.0) {
            g.PopColor();
        }
    },
    WantDrawFxOnTop : function Game_TutorialMgr$WantDrawFxOnTop() {
        var aStep = this.GetCurrentStep();
        return aStep != null && aStep.mWantDrawFxOnTop;
    },
    HasClearedTutorial : function Game_TutorialMgr$HasClearedTutorial(theTutorial) {
        return ((this.GetTutorialFlags() & (1 << theTutorial)) != 0) || !this.GetTutorialEnabled();
    },
    AllowHints : function Game_TutorialMgr$AllowHints() {
        var aStep = this.GetCurrentStep();
        return aStep == null || aStep.mAutohintPieceLoc != null || aStep.mAllowStandardHints;
    },
    IsBusy : function Game_TutorialMgr$IsBusy() {
        return this.GetCurrentStep() != null;
    },
    WantsBlockUi : function Game_TutorialMgr$WantsBlockUi() {
        var aStep = this.GetCurrentStep();
        if(aStep != null) {
            return !(aStep.mDelay > 0 && !aStep.mBlockDuringDelay);
        }
        return false;
    },
    IsGridLockedAt : function Game_TutorialMgr$IsGridLockedAt(theCol, theRow) {
        var aStep = this.GetCurrentStep();
        if(aStep != null) {
            if(!aStep.mLimitUiAccessibleGems) {
                return false;
            }

            {
                var $srcArray6 = aStep.mUiAccessibleGems;
                for(var $enum6 = 0; $enum6 < $srcArray6.length; $enum6++) {
                    var pt = $srcArray6[$enum6];
                    if(pt.x == theCol && pt.y == theRow) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    },
    HasTutorialQueued : function Game_TutorialMgr$HasTutorialQueued(theTutorial) {
        if(this.mCurTutorial == null) {
            return false;
        }
        return this.mCurTutorial.HasTutorialQueued(theTutorial);
    },
    WantsBlockTimer : function Game_TutorialMgr$WantsBlockTimer() {
        var aStep = this.GetCurrentStep();
        if(aStep != null) {
            switch(aStep.mBlockTimer) {
                case Game.TutorialStep.EBlockTimerType.None:
                {
                    return false;
                }
                case Game.TutorialStep.EBlockTimerType.Pause:
                {
                    return true;
                }
                case Game.TutorialStep.EBlockTimerType.PauseAfterParam:
                {
                    return aStep.mUpdateCnt > aStep.mBlockTimerParam;
                }
                case Game.TutorialStep.EBlockTimerType.PauseUntilParam:
                {
                    return aStep.mUpdateCnt < aStep.mBlockTimerParam;
                }
                case Game.TutorialStep.EBlockTimerType.PauseBetweenParams:
                {
                    return aStep.mBlockTimerParam < aStep.mUpdateCnt && aStep.mUpdateCnt < aStep.mBlockTimerParam2;
                }
                case Game.TutorialStep.EBlockTimerType.PlayBetweenParams:
                {
                    return aStep.mBlockTimerParam > aStep.mUpdateCnt || aStep.mUpdateCnt > aStep.mBlockTimerParam2;
                }
            }
        }
        return false;
    }
}
Game.TutorialMgr.staticInit = function Game_TutorialMgr$staticInit() {
    Game.TutorialMgr.G = null;
}

JS_AddInitFunc(function() {
    Game.TutorialMgr.registerClass('Game.TutorialMgr', null);
});
JS_AddStaticInitFunc(function() {
    Game.TutorialMgr.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\TutorialMgr.cs
//LineMap:2=3 7=62 8=64 10=69 12=76 13=81 14=84 15=87 16=89 17=96 18=101 22=109 24=109 25=111 28=115 33=60 38=66 41=72 47=79 49=83 54=91 56=94 61=100 65=105 68=118 72=123 78=128 93=144 94=146 105=158 108=162 118=171 120=174 122=177 134=190 141=198 143=199 149=203 151=208 
//LineMap:155=213 157=214 166=220 169=222 176=230 178=233 180=236 181=236 184=238 185=238 187=238 189=239 190=239 191=239 193=239 195=240 196=240 197=240 199=240 201=241 202=241 203=241 211=250 212=252 221=257 225=262 237=273 240=277 242=280 243=282 245=285 250=288 252=293 
//LineMap:256=298 263=306 265=309 274=319 286=332 292=336 293=336 294=338 297=342 309=15 312=17 320=24 330=33 336=40 339=42 349=51 357=350 362=352 367=353 368=355 373=362 379=369 385=376 387=379 389=382 391=387 392=389 394=392 395=394 401=401 408=409 410=412 429=432 
//LineMap:437=441 439=444 440=446 443=450 447=450 448=455 449=457 451=460 462=472 474=479 477=498 479=499 483=547 485=547 486=549 489=551 493=556 494=558 496=564 500=570 501=573 504=574 516=579 518=579 519=581 521=584 524=586 528=591 529=593 546=483 548=483 551=484 553=484 
//LineMap:556=486 558=486 561=487 563=487 566=504 592=531 600=540 602=543 605=601 610=607 612=610 622=621 633=634 645=647 655=658 657=658 661=660 669=669 676=677 685=685 689=687 691=688 693=688 695=689 697=689 699=690 701=690 703=691 705=691 707=692 
//Start:Util
/**
 * @constructor
 */
Game.CheckMatrixInfo = function Game_CheckMatrixInfo() {
}
Game.CheckMatrixInfo.prototype = {
    mProxy : null,
    mMatrixDepth : 0,
    mColorDepth : 0,
    mGraphics : null
}
Game.CheckMatrixInfo.staticInit = function Game_CheckMatrixInfo$staticInit() {
}

JS_AddInitFunc(function() {
    Game.CheckMatrixInfo.registerClass('Game.CheckMatrixInfo', null);
});
JS_AddStaticInitFunc(function() {
    Game.CheckMatrixInfo.staticInit();
});
/**
 * @constructor
 */
Game.ColorTracker = function Game_ColorTracker(g) {
    this.mG = g;
    this.mPushCount = 0;
}
Game.ColorTracker.prototype = {
    mG : null,
    mPushCount : 0,
    Set : function Game_ColorTracker$Set(theColor) {
        this.PopAll();
        this.Push(theColor);
    },
    Push : function Game_ColorTracker$Push(theColor) {
        this.mG.PushColor(theColor);
        ++this.mPushCount;
    },
    Pop : function Game_ColorTracker$Pop() {
        this.mG.PopColor();
        --this.mPushCount;
    },
    PopAll : function Game_ColorTracker$PopAll() {
        for(var i = 0; i < this.mPushCount; ++i) {
            this.mG.PopColor();
        }
        this.mPushCount = 0;
    },
    PopTo : function Game_ColorTracker$PopTo(thePushIdx) {
        for(var i = this.mPushCount; i > thePushIdx; --i) {
            this.mG.PopColor();
            --this.mPushCount;
        }
    }
}
Game.ColorTracker.staticInit = function Game_ColorTracker$staticInit() {
}

JS_AddInitFunc(function() {
    Game.ColorTracker.registerClass('Game.ColorTracker', null);
});
JS_AddStaticInitFunc(function() {
    Game.ColorTracker.staticInit();
});
/**
 * @constructor
 */
Game.BejUtil = function Game_BejUtil() {
}
Game.BejUtil.GetGemColorImage = function Game_BejUtil$GetGemColorImage(theColor) {
    switch(theColor) {
        case Game.DM.EGemColor.BLUE:
        {
            return Game.Resources['IMAGE_GEMS_BLUE'];
        }
        case Game.DM.EGemColor.GREEN:
        {
            return Game.Resources['IMAGE_GEMS_GREEN'];
        }
        case Game.DM.EGemColor.ORANGE:
        {
            return Game.Resources['IMAGE_GEMS_ORANGE'];
        }
        case Game.DM.EGemColor.PURPLE:
        {
            return Game.Resources['IMAGE_GEMS_PURPLE'];
        }
        case Game.DM.EGemColor.RED:
        {
            return Game.Resources['IMAGE_GEMS_RED'];
        }
        case Game.DM.EGemColor.WHITE:
        {
            return Game.Resources['IMAGE_GEMS_WHITE'];
        }
        case Game.DM.EGemColor.YELLOW:
        {
            return Game.Resources['IMAGE_GEMS_YELLOW'];
        }
    }
    JS_Assert(false);
    return Game.Resources['IMAGE_GEMS_WHITE'];
}
Game.BejUtil.GetGemColorImageShadow = function Game_BejUtil$GetGemColorImageShadow(theColor) {
    switch(theColor) {
        case Game.DM.EGemColor.BLUE:
        {
            return Game.Resources['IMAGE_GEMSSHADOW_BLUE'];
        }
        case Game.DM.EGemColor.GREEN:
        {
            return Game.Resources['IMAGE_GEMSSHADOW_GREEN'];
        }
        case Game.DM.EGemColor.ORANGE:
        {
            return Game.Resources['IMAGE_GEMSSHADOW_ORANGE'];
        }
        case Game.DM.EGemColor.PURPLE:
        {
            return Game.Resources['IMAGE_GEMSSHADOW_PURPLE'];
        }
        case Game.DM.EGemColor.RED:
        {
            return Game.Resources['IMAGE_GEMSSHADOW_RED'];
        }
        case Game.DM.EGemColor.WHITE:
        {
            return Game.Resources['IMAGE_GEMSSHADOW_WHITE'];
        }
        case Game.DM.EGemColor.YELLOW:
        {
            return Game.Resources['IMAGE_GEMSSHADOW_YELLOW'];
        }
    }
    JS_Assert(false);
    return Game.Resources['IMAGE_GEMSSHADOW_WHITE'];
}
Game.BejUtil.prototype = {

}
Game.BejUtil.staticInit = function Game_BejUtil$staticInit() {
}

JS_AddInitFunc(function() {
    Game.BejUtil.registerClass('Game.BejUtil', null);
});
JS_AddStaticInitFunc(function() {
    Game.BejUtil.staticInit();
});
/**
 * @constructor
 */
Game.GfxUtil = function Game_GfxUtil() {
}
Game.GfxUtil.GetEllipsisString = function Game_GfxUtil$GetEllipsisString(g, theString, theWidth) {
    if(g.StringWidth(theString) <= theWidth) {
        return theString;
    }
    var aTempString = theString;
    while((aTempString.length > 0) && (g.StringWidth(aTempString + '...') > theWidth)) {
        aTempString = aTempString.remove(aTempString.length - 1);
    }
    return aTempString + '...';
}
Game.GfxUtil.prototype = {

}
Game.GfxUtil.staticInit = function Game_GfxUtil$staticInit() {
}

JS_AddInitFunc(function() {
    Game.GfxUtil.registerClass('Game.GfxUtil', null);
});
JS_AddStaticInitFunc(function() {
    Game.GfxUtil.staticInit();
});
/**
 * @constructor
 */
Game.MathUtil = function Game_MathUtil() {
}
Game.MathUtil.Abs = function Game_MathUtil$Abs(theA) {
    return Math.abs(theA);
}
Game.MathUtil.Min = function Game_MathUtil$Min(theA, theB) {
    return Math.min(theA, theB);
}
Game.MathUtil.Max = function Game_MathUtil$Max(theA, theB) {
    return Math.max(theA, theB);
}
Game.MathUtil.prototype = {

}
Game.MathUtil.staticInit = function Game_MathUtil$staticInit() {
    Game.MathUtil.PI = 3.141593;
    Game.MathUtil.PI_M2 = 6.283185;
    Game.MathUtil.PI_D2 = 1.570796;
    Game.MathUtil.E = 2.71828;
    Game.MathUtil.EPSILON = 0.001;
    Game.MathUtil.EPSILONSQ = 0.000001;
}

JS_AddInitFunc(function() {
    Game.MathUtil.registerClass('Game.MathUtil', null);
});
JS_AddStaticInitFunc(function() {
    Game.MathUtil.staticInit();
});
/**
 * @constructor
 */
Game.SoundUtil = function Game_SoundUtil() {
}
Game.SoundUtil.Play = function Game_SoundUtil$Play(theSound) {
    Game.SoundUtil.PlayEx(theSound, 0.0, 1.0);
}
Game.SoundUtil.PlayEx = function Game_SoundUtil$PlayEx(theSound, thePan, theVolume) {
    GameFramework.BaseApp.mApp.PlaySoundEx(theSound, theVolume, thePan);
}
Game.SoundUtil.PlayVoice = function Game_SoundUtil$PlayVoice(theSound) {
    Game.SoundUtil.PlayVoiceEx(theSound, 0.0, 1.0, -1);
}
Game.SoundUtil.PlayVoiceEx = function Game_SoundUtil$PlayVoiceEx(theSound, thePan, theVolume, theInterruptId) {
    if(Game.SoundUtil.mIgnoreSound) {
        return;
    }
    Game.SoundUtil.PlayEx(theSound, thePan, theVolume);
    if(Game.SoundUtil.mNextVoice != null) {
    }
}
Game.SoundUtil.prototype = {

}
Game.SoundUtil.staticInit = function Game_SoundUtil$staticInit() {
    Game.SoundUtil.mIgnoreSound = false;
    Game.SoundUtil.mNextVoice = null;
}

JS_AddInitFunc(function() {
    Game.SoundUtil.registerClass('Game.SoundUtil', null);
});
JS_AddStaticInitFunc(function() {
    Game.SoundUtil.staticInit();
});
/**
 * @constructor
 */
Game.Util = function Game_Util() {
}
Game.Util.Rand = function Game_Util$Rand() {
    return (Game.Util.gRand.Next() | 0);
}
Game.Util.ReverseIntVector = function Game_Util$ReverseIntVector(theVec) {
    for(var i = 0; i < ((theVec.length / 2) | 0); ++i) {
        var t = theVec[i];
        var swapIdx = theVec.length - 1 - i;
        theVec[i] = theVec[swapIdx];
        theVec[swapIdx] = t;
    }
}
Game.Util.RandWithin = function Game_Util$RandWithin(theMax) {
    return (Game.Util.gRand.Next() | 0) % theMax;
}
Game.Util.DbgDrawCenter = function Game_Util$DbgDrawCenter(g, theRes, theIsWidescreenSrc) {
    Game.Util.DbgDrawMarker(g, (theIsWidescreenSrc ? -160 : 0) + Game.Util.ImgCXOfs(theRes), Game.Util.ImgCYOfs(theRes));
}
Game.Util.DbgDrawMarker = function Game_Util$DbgDrawMarker(g, x, y) {
    var _t1 = g.PushColor(0x0);
    try {
        g.FillRect(x - 12, y - 12, 24, 24);
    } finally {
        _t1.Dispose();
    }
    var _t2 = g.PushColor(0xffff0000);
    try {
        g.FillRect(x - 8, y - 8, 16, 16);
    } finally {
        _t2.Dispose();
    }
    var _t3 = g.PushColor(0xffffffff);
    try {
        g.FillRect(x - 4, y - 4, 8, 8);
    } finally {
        _t3.Dispose();
    }
}
Game.Util.ImgCXOfs = function Game_Util$ImgCXOfs(theRes) {
    return theRes.mOffsetX + ((theRes.mWidth / 2) | 0);
}
Game.Util.ImgCYOfs = function Game_Util$ImgCYOfs(theRes) {
    return theRes.mOffsetY + ((theRes.mHeight / 2) | 0);
}
Game.Util.ControlKey = function Game_Util$ControlKey(theKey) {
    return ((GameFramework.Utils.GetCharCode(theKey) - 65 + 1) | 0);
}
Game.Util.DrawImageStretched = function Game_Util$DrawImageStretched(g, theImg, theNewWidth, theNewHeight, theX, theY, theDrawCentered) {
    var m = new GameFramework.geom.Matrix();
    if(theDrawCentered) {
        m.translate(0 - ((theImg.mWidth / 2) | 0), 0 - ((theImg.mHeight / 2) | 0));
    }
    m.scale(theNewWidth / theImg.mWidth, theNewHeight / theImg.mHeight);
    var _t4 = g.PushMatrix(m);
    try {
        g.DrawImage(theImg, theX, theY);
    } finally {
        _t4.Dispose();
    }
}
Game.Util.DrawImageMatrix = function Game_Util$DrawImageMatrix(g, theImg, theMatrix) {
    g.PushMatrix(theMatrix);
    g.DrawImage(theImg.get_CenteredImage(), 0.0, 0.0);
    g.PopMatrix();
}
Game.Util.DrawImageMatrixT = function Game_Util$DrawImageMatrixT(g, theImg, theMatrix, theX, theY) {
    theMatrix.tx += theX;
    theMatrix.ty += theY;
    g.PushMatrix(theMatrix);
    g.DrawImage(theImg.get_CenteredImage(), 0, 0);
    g.PopMatrix();
    theMatrix.tx -= theX;
    theMatrix.ty -= theY;
}
Game.Util.DrawImageSRT = function Game_Util$DrawImageSRT(g, theImg, theScale, theRot, theX, theY) {
    var m = new GameFramework.geom.Matrix();
    m.rotate(theRot);
    m.scale(theScale, theScale);
    m.translate(theX, theY);
    g.PushMatrix(m);
    g.DrawImage(theImg, 0.0, 0.0);
    g.PopMatrix();
}
Game.Util.DrawImageRT = function Game_Util$DrawImageRT(g, theImg, theRot, theX, theY) {
    var m = new GameFramework.geom.Matrix();
    m.rotate(theRot);
    m.translate(theX, theY);
    g.PushMatrix(m);
    g.DrawImage(theImg, 0.0, 0.0);
    g.PopMatrix();
}
Game.Util.DrawImageR = function Game_Util$DrawImageR(g, theImg, theRot) {
    var m = new GameFramework.geom.Matrix();
    m.rotate(theRot);
    g.PushMatrix(m);
    g.DrawImage(theImg, 0.0, 0.0);
    g.PopMatrix();
}
Game.Util.DrawImageAtDef = function Game_Util$DrawImageAtDef(g, theImg, theIsAdditive) {
    theImg.mAdditive = theIsAdditive;
    g.DrawImage(theImg, theImg.mOffsetX, theImg.mOffsetY);
    theImg.mAdditive = false;
}
Game.Util.DrawImageAtDefXY = function Game_Util$DrawImageAtDefXY(g, theImg, theOffsetX, theOffsetY, theIsAdditive) {
    theImg.mAdditive = theIsAdditive;
    g.DrawImage(theImg, theImg.mOffsetX + theOffsetX, theImg.mOffsetY + theOffsetY);
    theImg.mAdditive = false;
}
Game.Util.DrawImageCentered = function Game_Util$DrawImageCentered(g, theImg, theOffsetX, theOffsetY) {
    g.DrawImage(theImg, theOffsetX - theImg.mWidth / 2.0, theOffsetY - theImg.mHeight / 2.0);
}
Game.Util.ShuffleIntArr = function Game_Util$ShuffleIntArr(theVec) {
    for(var i = theVec.length - 1; i >= 1; --i) {
        var j = (Game.Util.gRand.Next() | 0) % i;
        var t = theVec[i];
        theVec[i] = theVec[j];
        theVec[j] = t;
    }
}
Game.Util.RGBToHSL = function Game_Util$RGBToHSL(r, g, b) {
    var maxval = (((Math.max(r, Math.max(g, b)) | 0)) | 0);
    var minval = (((Math.min(r, Math.min(g, b)) | 0)) | 0);
    var hue = 0;
    var saturation = 0;
    var luminosity = (((minval + maxval) / 2) | 0);
    var delta = maxval - minval;
    if(delta != 0) {
        saturation = (((delta * 256) / ((luminosity <= 128) ? (minval + maxval) : (512 - maxval - minval))) | 0);
        if(r == maxval) {
            hue = (g == minval ? 1280 + (((((maxval - b) * 256) / delta) | 0)) : 256 - (((((maxval - g) * 256) / delta) | 0)));
        } else if(g == maxval) {
            hue = (b == minval ? 256 + (((((maxval - r) * 256) / delta) | 0)) : 768 - (((((maxval - b) * 256) / delta) | 0)));
        } else {
            hue = (r == minval ? 768 + (((((maxval - g) * 256) / delta) | 0)) : 1280 - (((((maxval - r) * 256) / delta) | 0)));
        }
        hue = ((hue) / 6) | 0;
    }
    return 0xff000000 | (hue) | (saturation << 8) | (luminosity << 16);
}
Game.Util.HSLToRGB = function Game_Util$HSLToRGB(h, s, l) {
    var r;
    var g;
    var b;
    var v = (l < 128) ? (((l * (255 + s)) / 255) | 0) : (l + s - ((l * s / 255) | 0));
    var y = ((2 * l - v) | 0);
    var aColorDiv = (((6 * h) / 256) | 0);
    var x = ((y + (v - y) * ((h - (((aColorDiv * 256 / 6) | 0))) * 6) / 255) | 0);
    if(x > 255) {
        x = 255;
    }
    var z = ((v - (v - y) * ((h - (((aColorDiv * 256 / 6) | 0))) * 6) / 255) | 0);
    if(z < 0) {
        z = 0;
    }
    switch(aColorDiv) {
        case 0:
        {
            r = (v | 0);
            g = (x | 0);
            b = (y | 0);
            break;
        }
        case 1:
        {
            r = (z | 0);
            g = (v | 0);
            b = (y | 0);
            break;
        }
        case 2:
        {
            r = (y | 0);
            g = (v | 0);
            b = (x | 0);
            break;
        }
        case 3:
        {
            r = (y | 0);
            g = (z | 0);
            b = (v | 0);
            break;
        }
        case 4:
        {
            r = (x | 0);
            g = (y | 0);
            b = (v | 0);
            break;
        }
        case 5:
        {
            r = (v | 0);
            g = (y | 0);
            b = (z | 0);
            break;
        }
        default:
        {
            r = (v | 0);
            g = (x | 0);
            b = (y | 0);
            break;
        }
    }
    return 0xff000000 | (r << 16) | (g << 8) | (b);
}
Game.Util.TicksToString = function Game_Util$TicksToString(theTicks) {
    theTicks = ((theTicks) / 60) | 0;
    var sec = theTicks % 60;
    theTicks = ((theTicks) / 60) | 0;
    var min = theTicks % 60;
    var hours = (((theTicks / 60) | 0)) % 24;
    var days = (((((theTicks / 60) | 0)) / 24) | 0);
    if(days > 0) {
        return String.format('{0} days {1:00} hours {2:00} min {3:00} sec', days, hours, min, sec);
    } else if(hours > 0) {
        return String.format('{0:00} hours {1:00} min {2:00} sec', hours, min, sec);
    } else if(min > 0) {
        return String.format('{0:00} min {1:00} sec', min, sec);
    } else {
        return String.format('{0:00} sec', sec);
    }
}
Game.Util.SplitStr = function Game_Util$SplitStr(i_str, outVals, theType) {
    Game.Util.SplitStrEx(i_str, outVals, theType, 44, false, -1);
}
Game.Util.SplitStrEx = function Game_Util$SplitStrEx(i_str, outVals, theType, theSplitChar, theTrimLeadingWhitespace, theMaxEntries) {
    if(i_str.length == 0) {
        return;
    }
    var idx = 0;
    var oldIdx = 0;
    var count = 0;
    while(true) {
        var lastEntry = (theMaxEntries != -1 && (count + 1 == theMaxEntries));
        idx = lastEntry ? -1 : i_str.indexOf(String.fromCharCode(theSplitChar), oldIdx);
        var done = idx == -1;
        if(done) {
            idx = i_str.length;
        }
        if(theTrimLeadingWhitespace) {
            while(oldIdx < idx && GameFramework.Utils.IsWhitespaceAt(i_str, oldIdx)) {
                ++oldIdx;
            }
        }
        switch(theType) {
            case Game.Util.ESplitStrType.TVector_STRING:
            {
                var aStrVec = Type.safeCast(outVals, GameFramework.TVector);
                aStrVec.push(i_str.substr(oldIdx, idx - oldIdx));
            	break;
            }
            case Game.Util.ESplitStrType.TIntVector:
            {
                (outVals).push(GameFramework.Utils.ToInt(i_str.substr(oldIdx, idx - oldIdx)));
                break;
            }
            case Game.Util.ESplitStrType.TVector_FLOAT:
            {
                var aNumVec = Type.safeCast(outVals, GameFramework.TVector);
                aNumVec.push(GameFramework.Utils.ToFloat(i_str.substr(oldIdx, idx - oldIdx)));
            	break;
            }
        }
        ++count;
        if(done || lastEntry) {
            break;
        }
        oldIdx = idx + 1;
    }
}
Game.Util.CheckGraphicsState = function Game_Util$CheckGraphicsState(g) {
    var m = new Game.CheckMatrixInfo();
    m.mMatrixDepth = g.mMatrixDepth;
    m.mColorDepth = g.mColorVector.length;
    m.mGraphics = g;
    m.mProxy = new GameFramework.misc.DisposeProxy(ss.Delegate.create(this, Game.Util.CheckGraphicsStatePop));
    Game.Util.mAutoPopCheckMatrix.push(m);
    return m.mProxy;
}
Game.Util.CheckGraphicsStatePop = function Game_Util$CheckGraphicsStatePop() {
    JS_Assert(Game.Util.mAutoPopCheckMatrix[Game.Util.mAutoPopCheckMatrix.length - 1].mMatrixDepth == Game.Util.mAutoPopCheckMatrix[Game.Util.mAutoPopCheckMatrix.length - 1].mGraphics.mMatrixDepth, 'CheckGraphicsState MATRIX calls not aligned (check push/pop calls)');
    JS_Assert(Game.Util.mAutoPopCheckMatrix[Game.Util.mAutoPopCheckMatrix.length - 1].mColorDepth == Game.Util.mAutoPopCheckMatrix[Game.Util.mAutoPopCheckMatrix.length - 1].mGraphics.mColorVector.length, 'CheckGraphicsState COLOR calls not aligned (check push/pop calls)');
}
Game.Util.prototype = {

    GetAlphaFromColorInt : function Game_Util$GetAlphaFromColorInt(theColorInt) {
        return (theColorInt >>> 24) & 0xff;
    },
    ModAlphaOnColorInt : function Game_Util$ModAlphaOnColorInt(theColorInt, theAlpha) {
        return ((theAlpha & 0xff) << 24) | (theColorInt & 0xffffff);
    }
}
Game.Util.staticInit = function Game_Util$staticInit() {
    Game.Util.mAutoPopCheckMatrix = [];
    Game.Util.gRand = new Game.MTRand();
}

JS_AddInitFunc(function() {
    Game.Util.registerClass('Game.Util', null);
});
JS_AddStaticInitFunc(function() {
    Game.Util.staticInit();
});
Game.Util.ESplitStrType = {};
Game.Util.ESplitStrType.staticInit = function Game_Util_ESplitStrType$staticInit() {
    Game.Util.ESplitStrType.TIntVector = 0;
    Game.Util.ESplitStrType.TVector_STRING = 1;
    Game.Util.ESplitStrType.TVector_FLOAT = 2;
}
JS_AddInitFunc(function() {
    Game.Util.ESplitStrType.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\Util.cs
//LineMap:1=2 2=4 21=22 26=26 34=30 58=55 76=72 82=75 85=77 89=79 91=80 93=80 95=81 97=81 99=82 101=82 103=83 105=83 107=84 109=84 111=85 117=92 120=94 124=96 126=97 128=97 130=98 132=98 134=99 136=99 138=100 140=100 142=101 144=101 146=102 162=110 168=112 172=117 175=121 
//LineMap:187=125 193=136 197=141 201=146 211=127 221=152 229=162 231=165 235=170 239=175 243=180 244=187 254=155 260=202 266=204 270=209 280=220 284=225 288=230 293=234 299=237 302=239 308=242 311=244 318=248 322=253 326=258 330=264 335=270 339=273 346=277 352=284 362=296 
//LineMap:372=307 381=317 389=326 395=333 401=340 405=345 407=348 415=357 423=366 426=370 428=373 431=377 433=380 435=383 440=389 441=391 442=393 446=398 449=402 450=402 453=404 454=404 455=404 457=404 459=405 460=405 461=405 462=405 464=405 466=406 467=406 468=406 469=406 
//LineMap:471=406 473=407 474=407 475=407 476=407 478=407 480=408 481=408 482=408 483=408 485=408 487=409 488=409 489=409 490=409 492=409 494=410 495=410 496=410 497=410 502=426 510=435 511=435 513=436 516=438 518=448 522=453 526=458 529=462 533=467 536=471 539=475 540=475 
//LineMap:541=478 543=479 547=482 548=482 553=485 554=487 556=488 560=491 562=494 563=496 565=499 568=505 576=514 578=517 581=521 586=416 598=503 599=527 604=441 607=443 
//Start:Version
/**
 * @constructor
 */
Game.Version = function Game_Version() {
}
Game.Version.Get = function Game_Version$Get() {
    return Game.Version.mVersion;
}
Game.Version.prototype = {

}
Game.Version.staticInit = function Game_Version$staticInit() {
    Game.Version.mVersion = '0.9.12.9490';
}

JS_AddInitFunc(function() {
    Game.Version.registerClass('Game.Version', null);
});
JS_AddStaticInitFunc(function() {
    Game.Version.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\Version.cs
//LineMap:2=3 8=7 18=5 
