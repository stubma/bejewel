/**
 * @constructor
 */
Game.Board = function Game_Board(theApp) {
    this.mBarInstanceVector = [];
    this.mRand = new Game.MTRand();
    this.mUiConfig = Game.Board.EUIConfig.Standard;
    this.mBackgroundIdxSet = [];
    this.mBoardColors = Array.Create(2, null);
    this.mPointsBreakdown = [];
    this.mLevelBarBonusAlpha = new GameFramework.CurvedVal();
    this.mSpeedModeFactor = new GameFramework.CurvedVal();
    this.mSpeedometerPopup = new GameFramework.CurvedVal();
    this.mSpeedometerGlow = new GameFramework.CurvedVal();
    this.mSpeedBonusDisp = new GameFramework.CurvedVal();
    this.mFlameSoundBlazingVol = new GameFramework.CurvedVal();
    this.mFavorGemColors = [];
    this.mNewGemColors = [];
    this.mSpeedBonusTextShowPct = new GameFramework.CurvedVal();
    this.mSpeedFireBarPIEffect = Array.Create(2, null);
    this.mSpeedBonusPointsGlow = new GameFramework.CurvedVal();
    this.mSpeedBonusPointsScale = new GameFramework.CurvedVal();
    this.mComboFlashPct = new GameFramework.CurvedVal();
    this.gExplodePoints = Array.Create2D(64, 2, 0);
    this.gShardPoints = Array.Create2D(64, 2, 0);
    this.gShardExplodeCenter = Array.Create2D(64, 2, 0);
    this.gShardTypes = Array.Create(64, 0);
    this.mPrevPointMultAlpha = new GameFramework.CurvedVal();
    this.mSrcPointMultPos = new GameFramework.geom.TPoint();
    this.mPointMultPosPct = new GameFramework.CurvedVal();
    this.mPointMultTextMorph = new GameFramework.CurvedVal();
    this.mPointMultScale = new GameFramework.CurvedVal();
    this.mPointMultAlpha = new GameFramework.CurvedVal();
    this.mPointMultYAdd = new GameFramework.CurvedVal();
    this.mPointMultDarkenPct = new GameFramework.CurvedVal();
    this.mTimerInflate = new GameFramework.CurvedVal();
    this.mTimerAlpha = new GameFramework.CurvedVal();
    this.mPointMultSoundQueue = [];
    this.mGemCountAlpha = new GameFramework.CurvedVal();
    this.mGemScalarAlpha = new GameFramework.CurvedVal();
    this.mGemCountCurve = new GameFramework.CurvedVal();
    this.mCascadeCountAlpha = new GameFramework.CurvedVal();
    this.mCascadeScalarAlpha = new GameFramework.CurvedVal();
    this.mCascadeCountCurve = new GameFramework.CurvedVal();
    this.mComplementAlpha = new GameFramework.CurvedVal();
    this.mComplementScale = new GameFramework.CurvedVal();
    this.mDeferredTutorialVector = [];
    this.mTutorialPieceIrisPct = new GameFramework.CurvedVal();
    this.mSunPosition = new GameFramework.CurvedVal();
    this.mAlpha = new GameFramework.CurvedVal();
    this.mScale = new GameFramework.CurvedVal();
    this.mSlideUIPct = new GameFramework.CurvedVal();
    this.mSideAlpha = new GameFramework.CurvedVal();
    this.mSideXOff = new GameFramework.CurvedVal();
    this.mBoostShowPct = new GameFramework.CurvedVal();
    this.mRestartPct = new GameFramework.CurvedVal();
    this.mBkgGlowPct = new GameFramework.CurvedVal();
    this.mNukeRadius = new GameFramework.CurvedVal();
    this.mNukeAlpha = new GameFramework.CurvedVal();
    this.mNovaRadius = new GameFramework.CurvedVal();
    this.mNovaAlpha = new GameFramework.CurvedVal();
    this.mGameOverPieceScale = new GameFramework.CurvedVal();
    this.mGameOverPieceGlow = new GameFramework.CurvedVal();
    this.mDeferredSounds = [];
    this.mQuestPortalPct = new GameFramework.CurvedVal();
    this.mQuestPortalCenterPct = new GameFramework.CurvedVal();
    this.mDistortionPieces = [];
    this.mDistortionQuads = [];
    this.mAnnouncements = [];
    this.UpdateComplements_gComplementPoints = Array.Create(6, 0, 3, 6, 12, 20, 30, 45);
    Game.Board.initializeBase(this);
    this.mBoardX = Game.Util.ImgCXOfs(Game.Resources['IMAGE_BOARD_MARKER_CHECKERBOARD']) + this.mWidescreenX;
    this.mBoardY = Game.Util.ImgCYOfs(Game.Resources['IMAGE_BOARD_MARKER_CHECKERBOARD']) - 60;
    this.mShowPointMultiplier = false;
    this.mPointMultSidebarOffset = new GameFramework.geom.TPoint(-70, -200);
}
Game.Board.ParseGridLayout = function Game_Board$ParseGridLayout(theBoard, theStr, outGrid, theEnforceStdGridSize, theColCount, theRowCount) {
    var count = 0;
    for(var loc = 0; loc < theStr.length; ++loc) {
        if(GameFramework.Utils.IsLetterAt(theStr, loc)) {
            var grid = outGrid[outGrid.length - 1];
            if(count == 0) {
                grid = outGrid[outGrid.length - 1];
                count = grid.mTiles.length - 1;
            }
            grid.At((((((count - 1) / theBoard.mRowCount) | 0)) | 0), (count - 1) % theBoard.mColCount).mAttr = GameFramework.Utils.GetCharAt(theStr, loc);
        } else if(GameFramework.Utils.IsDigitAt(theStr, loc)) {
            if(theEnforceStdGridSize && (outGrid.length == 0 || count >= theBoard.mColCount * theBoard.mRowCount)) {
                count = 0;
                outGrid.length = outGrid.length + 1;
                outGrid[outGrid.length - 1].mTiles.length = theBoard.mColCount * theBoard.mRowCount;
            } else if(!theEnforceStdGridSize && (outGrid.length == 0 || ((((count | 0) / theBoard.mColCount) | 0)) >= outGrid[outGrid.length - 1].GetRowCount())) {
                if(outGrid.length == 0) {
                    outGrid.push(new Game.GridData(theColCount, theRowCount));
                }
                outGrid[outGrid.length - 1].AddRow();
            }
            outGrid[outGrid.length - 1].At(((((count / theBoard.mRowCount) | 0)) | 0), count % theBoard.mColCount).mBack.push(GameFramework.Utils.ToInt(theStr.substr(loc, 1)));
            ++count;
        } else if(theStr.substr(loc, 1) == '\'') {
            var anEndPos = theStr.indexOf(String.fromCharCode(39), loc + 1);
            var aGridTileData = outGrid[outGrid.length - 1].At((((((count - 1) / theBoard.mRowCount) | 0)) | 0), (count - 1) % theBoard.mColCount);
            if(aGridTileData.mSettings == null) {
                aGridTileData.mSettings = {};
            }
            var aKey = theStr.substr(loc + 1, anEndPos - loc - 1);
            var aValue = '';
            var anEqPos = aKey.indexOf(String.fromCharCode(61));
            if(anEqPos != -1) {
                aValue = aKey.substr(anEqPos + 1);
                aKey = aKey.substr(0, anEqPos);
            }
            aGridTileData.mSettings[aKey] = aValue;
            loc = anEndPos;
        } else if(theStr.substr(loc, 1) == '/') {
            --count;
        }
    }
}
Game.Board.prototype = {
    mGameId : null,
    mBackground : null,
    mRowCount : 8,
    mColCount : 8,
    mFullLaser : true,
    mBarInstanceVector : null,
    mUpdateAcc : 1.0,
    mNextPieceId : 0,
    mBoard : null,
    mBumpVelocities : null,
    mNextColumnCredit : null,
    mRand : null,
    mLastHitSoundTick : 0,
    mPieceMap : null,
    mSwapDataVector : null,
    mMoveDataVector : null,
    mQueuedMoveVector : null,
    mStateInfoVector : null,
    mGameStats : null,
    mLevelStats : null,
    mGameOverCount : 0,
    mLevelCompleteCount : 0,
    mPoints : 0,
    mInLoadSave : null,
    mUiConfig : null,
    mBackgroundIdx : -1,
    mBackgroundIdxSet : null,
    mTutorialMgr : null,
    mFlameSound : null,
    mWantReset : null,
    mNeverAllowCascades : null,
    mBoardColors : null,
    mPointsBreakdown : null,
    mDispPoints : 0,
    mLevelBarPct : 0,
    mCountdownBarPct : 0,
    mLevelBarSizeBias : 0,
    mGameFinished : null,
    mLevelBarBonusAlpha : null,
    mLevelPointsTotal : 0,
    mLevel : 0,
    mAutohintOverridePieceId : -1,
    mAutohintOverrideTime : -1,
    mHypermixerCheckRow : 0,
    mPointMultiplier : 0,
    mPointMultSidebarOffset : null,
    mShowPointMultiplier : null,
    mCurMoveCreditId : 0,
    mCurMatchId : 0,
    mGemFallDelay : 0,
    mTimeExpired : null,
    mLastWarningTick : 0,
    mScrambleUsesLeft : 0,
    mMoveCounter : 0,
    mGameTicks : 0,
    mIdleTicks : 0,
    mSettlingDelay : 0,
    mLastMatchTick : 0,
    mLastMatchTime : 0,
    mMatchTallyCount : 0,
    mLastMatchTally : 0,
    mSpeedModeFactor : null,
    mSpeedBonusAlpha : 0,
    mSpeedBonusText : null,
    mSpeedometerPopup : null,
    mSpeedometerGlow : null,
    mSpeedBonusDisp : null,
    mFlameSoundBlazingVol : null,
    mSpeedNeedle : 0,
    mSpeedBonusPoints : 0,
    mFavorComboGems : null,
    mFavorGemColors : null,
    mNewGemColors : null,
    mSpeedBonusNum : 0,
    mSpeedBonusCount : 0,
    mSpeedBonusCountHighest : 0,
    mSpeedBonusTextShowPct : null,
    mSpeedBonusLastCount : 0,
    mPowerGemThreshold : 0,
    mColorCountStart : 0,
    mColorCount : 0,
    mIsBoardStill : null,
    mSpeedFirePIEffect : null,
    mSpeedFireBarPIEffect : null,
    mSpeedBonusPointsGlow : null,
    mSpeedBonusPointsScale : null,
    mSpeedBonusFlameModePct : 0,
    mHasBoardSettled : null,
    mContinuedFromLoad : null,
    mBoardUIOffsetY : 0,
    mComboCount : 0,
    mLastComboCount : 0,
    mComboLen : 0,
    mComboCountDisp : 0,
    mComboFlashPct : null,
    mComboSelectorAngle : 0,
    mLastPlayerSwapColor : null,
    mComboBonusSlowdownPct : 0,
    mLightningStorms : null,
    mPointsManager : null,
    mLastMoveSave : null,
    mTestSave : null,
    mPreFXManager : null,
    mPostFXManager : null,
    mUserPaused : null,
    mBoardHidePct : 0,
    mVisPausePct : 0,
    mShowAutohints : null,
    mWidescreenX : -160,
    gExplodeCount : 0,
    gExplodePoints : null,
    gShardPoints : null,
    gShardExplodeCenter : null,
    gShardTypes : null,
    mWantLevelup : false,
    mHyperspace : null,
    mCoinMultiplier : 1,
    mPrevPointMultAlpha : null,
    mSrcPointMultPos : null,
    mPointMultPosPct : null,
    mPointMultTextMorph : null,
    mPointMultScale : null,
    mPointMultAlpha : null,
    mPointMultYAdd : null,
    mPointMultDarkenPct : null,
    mPointMultColor : 0,
    mTimerInflate : null,
    mTimerAlpha : null,
    mPointMultSoundQueue : null,
    mPointMultSoundDelay : 0,
    mBottomFillRow : 0,
    mGemCountValueDisp : 0,
    mGemCountValueCheck : 0,
    mGemCountAlpha : null,
    mGemScalarAlpha : null,
    mGemCountCurve : null,
    mCascadeCountValueDisp : 0,
    mCascadeCountValueCheck : 0,
    mCascadeCountAlpha : null,
    mCascadeScalarAlpha : null,
    mCascadeCountCurve : null,
    mComplementAlpha : null,
    mComplementScale : null,
    mComplementNum : 0,
    mLastComplement : 0,
    mSidebarText : '',
    mShowLevelPoints : null,
    mHintCooldownTicks : 0,
    mWantHintTicks : 0,
    mLastMoveTicks : 0,
    mDeferredTutorialVector : null,
    mTutorialPieceIrisPct : null,
    mShowMoveCredit : null,
    mDoThirtySecondVoice : null,
    mSunPosition : null,
    mSunFired : null,
    mLastSunTick : 0,
    mBoardDarken : 0,
    mBoardDarkenAnnounce : 0,
    mWarningGlowColor : 0,
    mWarningGlowAlpha : 0,
    mMouseDown : null,
    mMouseDownX : 0,
    mMouseDownY : 0,
    mMouseUpPiece : null,
    mHintButton : null,
    mMenuButton : null,
    mResetButton : null,
    mZenOptionsButton : null,
    mScrambleDelayTicks : 0,
    mSliderSetTicks : 0,
    mDoAutoload : null,
    mAlpha : null,
    mScale : null,
    mOfsX : 0.0,
    mOfsY : 0.0,
    mKilling : null,
    mSlideUIPct : null,
    mSideAlpha : null,
    mSideXOff : null,
    mBoostShowPct : null,
    mStartDelay : 0,
    mRestartPct : null,
    mBkgGlowPct : null,
    mIsFacebookGame : null,
    mBoostsEnabled : 0,
    mCursorSelectPos : null,
    mNukeRadius : null,
    mNukeAlpha : null,
    mNovaRadius : null,
    mNovaAlpha : null,
    mGameOverPieceScale : null,
    mGameOverPieceGlow : null,
    mGameOverPiece : null,
    mDrawAll : null,
    mDrawGameElements : null,
    mWantsReddishFlamegems : null,
    mDeferredSounds : null,
    mQuestPortalPct : null,
    mQuestPortalCenterPct : null,
    mQuestPortalOrigin : null,
    mNeedsMaskCleared : null,
    mDistortionPieces : null,
    mDistortionQuads : null,
    mAnnouncements : null,
    mMessager : null,
    mReadyDelayCount : 0,
    mGoDelayCount : 0,
    mBoardX : 0,
    mBoardY : 0,
    mLastMouseX : 0,
    mLastMouseY : 0,
    UpdateComplements_gComplementPoints : null,
    Update_aSpeed : 1.0,
    RemoveAllButtons : function Game_Board$RemoveAllButtons() {
        var allBtns = Array.Create(3, null, this.mHintButton, this.mMenuButton, this.mResetButton);
        for(var i = 0; i < (allBtns.length); ++i) {
            if(allBtns[i] != null) {
                this.RemoveWidget(allBtns[i]);
            }
        }
    },
    InitUI : function Game_Board$InitUI() {
        if(this.mUiConfig == Game.Board.EUIConfig.Standard || this.mUiConfig == Game.Board.EUIConfig.WithReset) {
            if(this.mHintButton == null) {
                this.mHintButton = new Game.Bej3Button((Game.Board.Widgets.BUTTON_HINT | 0));
                this.mHintButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.HintButtonPressed));
                this.mHintButton.AddEventListener(GameFramework.widgets.WidgetEvent.MOUSE_DOWN, ss.Delegate.create(this, this.ButtonDown));
                if(this.mUiConfig == Game.Board.EUIConfig.Standard) {
                    this.mHintButton.mButtonImage = Game.Resources['IMAGE_BOARD_HINT_BUTTON_CLASSIC'];
                } else if(this.mUiConfig == Game.Board.EUIConfig.WithReset) {
                    this.mHintButton.mButtonImage = Game.Resources['IMAGE_BOARD_HINT_BUTTON_LIGHTNING'];
                }
                this.mHintButton.mDownImage = this.mHintButton.mButtonImage;
                this.mHintButton.mOverImage = this.mHintButton.mButtonImage;
                this.mHintButton.mOverCel = 1;
                this.mHintButton.mDownCel = 1;
                this.mHintButton.mBoundsRadius = 84.0;
                this.mHintButton.Resize(this.mWidescreenX + this.mHintButton.mButtonImage.mOffsetX + this.GetLeftUIOffsetX(), this.mHintButton.mButtonImage.mOffsetY, this.mHintButton.mButtonImage.mWidth, this.mHintButton.mButtonImage.mHeight);
                this.AddWidget(this.mHintButton);
            }
            if(this.mMenuButton == null) {
                this.mMenuButton = new Game.Bej3Button((Game.Board.Widgets.BUTTON_MENU | 0));
                if(this.mUiConfig == Game.Board.EUIConfig.Standard) {
                    this.mMenuButton.mButtonImage = Game.Resources['IMAGE_BOARD_MENU_BUTTON_CLASSIC'];
                } else if(this.mUiConfig == Game.Board.EUIConfig.WithReset) {
                    this.mMenuButton.mButtonImage = Game.Resources['IMAGE_BOARD_MENU_BUTTON_LIGHTNING'];
                }
                this.mMenuButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.MenuButtonPressed));
                this.mMenuButton.AddEventListener(GameFramework.widgets.WidgetEvent.MOUSE_DOWN, ss.Delegate.create(this, this.ButtonDown));
                this.mMenuButton.mDownImage = this.mMenuButton.mButtonImage;
                this.mMenuButton.mOverImage = this.mMenuButton.mButtonImage;
                this.mMenuButton.mOverCel = 1;
                this.mMenuButton.mDownCel = 1;
                this.mMenuButton.mBoundsRadius = 50.0;
                this.mMenuButton.Resize(this.mWidescreenX + this.mMenuButton.mButtonImage.mOffsetX + this.GetLeftUIOffsetX(), this.mMenuButton.mButtonImage.mOffsetY, this.mMenuButton.mButtonImage.mWidth, this.mMenuButton.mButtonImage.mHeight);
                this.AddWidget(this.mMenuButton);
            }
        }
        switch(this.mUiConfig) {
            case Game.Board.EUIConfig.WithReset:
            {
                if(this.mResetButton == null) {
                    this.mResetButton = new Game.Bej3Button((Game.Board.Widgets.BUTTON_RESET | 0));
                    this.mResetButton.mButtonImage = Game.Resources['IMAGE_BOARD_RESET_BUTTON_LIGHTNING'];
                    this.mResetButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.ResetButtonPressed));
                    this.mResetButton.AddEventListener(GameFramework.widgets.WidgetEvent.MOUSE_DOWN, ss.Delegate.create(this, this.ButtonDown));
                    this.mResetButton.mDownImage = this.mResetButton.mButtonImage;
                    this.mResetButton.mOverImage = this.mResetButton.mButtonImage;
                    this.mResetButton.mOverCel = 1;
                    this.mResetButton.mDownCel = 1;
                    this.mResetButton.mBoundsRadius = 50.0;
                    this.mResetButton.Resize(this.mWidescreenX + this.mResetButton.mButtonImage.mOffsetX + this.GetLeftUIOffsetX(), this.mResetButton.mButtonImage.mOffsetY, this.mResetButton.mButtonImage.mWidth, this.mResetButton.mButtonImage.mHeight);
                    this.AddWidget(this.mResetButton);
                }
                break;
            }

        }
    },
    Init : function Game_Board$Init() {
        this.RemoveAllButtons();
        this.mDeferredTutorialVector.clear();
        this.mBumpVelocities = Array.Create(this.mRowCount, null);
        this.mNextColumnCredit = Array.Create(this.mRowCount, 0);
        if(this.mBoard != null) {

            {
                var $srcArray3 = this.mBoard;
                for(var $enum3 = 0; $enum3 < $srcArray3.length; $enum3++) {
                    var aPiece = $srcArray3[$enum3];
                    if(aPiece != null) {
                        aPiece.ClearBoundEffects();
                    }
                }
            }
        }
        this.mBoard = Array.Create2D(this.mRowCount, this.mColCount, null);
        this.mFlameSoundBlazingVol.SetConstant(0.0);
        this.mSpeedBonusTextShowPct.SetConstant(0.0);
        this.mNeverAllowCascades = false;
        this.mWantReset = false;
        for(var row = 0; row < this.mRowCount; ++row) {
            for(var col = 0; col < this.mColCount; ++col) {
                this.mBoard[this.mBoard.mIdxMult0 * (row) + col] = null;
            }
        }
        this.ClearAllPieces();
        this.mPieceMap = {};
        this.mMoveDataVector = [];
        this.mQueuedMoveVector = [];
        this.mStateInfoVector = [];
        this.mLightningStorms = [];
        this.mBoardColors[0] = GameFramework.gfx.Color.RGBAToInt(6, 6, 6, 160);
        this.mBoardColors[1] = GameFramework.gfx.Color.RGBAToInt(24, 24, 24, 160);
        this.mGameStats = Array.Create((Game.DM.EStat._COUNT | 0), 0);
        this.mLevelStats = Array.Create((Game.DM.EStat._COUNT | 0), 0);
        this.mColorCountStart = (Game.DM.EGemColor._COUNT | 0);
        this.mColorCount = this.mColorCountStart;
        this.mBoardUIOffsetY = 0;
        this.mGameFinished = false;
        this.mGameTicks = 0;
        this.mIdleTicks = 0;
        this.mGameOverCount = 0;
        this.mSettlingDelay = 0;
        this.mLastMatchTick = -1000;
        this.mLastMatchTime = 1000;
        this.mMatchTallyCount = 0;
        this.mLastMatchTally = 0;
        this.mUpdateCnt = 0;
        this.mSpeedNeedle = 50;
        this.mSpeedBonusAlpha = 0.0;
        this.mSpeedBonusPoints = 0;
        this.mSpeedModeFactor.SetConstant(1.0);
        this.mSpeedBonusNum = 0;
        this.mSpeedBonusCount = 0;
        this.mSpeedBonusCountHighest = 0;
        this.mSpeedBonusLastCount = 0;
        this.mSpeedBonusFlameModePct = 0;
        this.mSpeedBonusPointsScale.SetConstant(0.0);
        this.mHypermixerCheckRow = 3;
        this.mLastWarningTick = 0;
        this.mCurMoveCreditId = 0;
        this.mCurMatchId = 0;
        this.mGemFallDelay = 0;
        this.mPointMultiplier = 1;
        this.mPoints = 0;
        this.mPointsBreakdown.length = 0;
        this.AddPointBreakdownSection();
        this.mDispPoints = 0;
        this.mLevelBarPct = 0;
        this.mCountdownBarPct = 0;
        this.mLevelPointsTotal = 0;
        this.mLevel = 0;
        this.mScrambleUsesLeft = 2;
        this.mDeferredSounds.length = 0;
        this.mComboCount = 0;
        this.mLastComboCount = 0;
        this.mComboCountDisp = 0;
        this.mComboSelectorAngle = 22;
        this.mLastPlayerSwapColor = Game.DM.EGemColor.WHITE;
        this.mComboBonusSlowdownPct = 0;
        this.mGemCountValueDisp = 0;
        this.mCascadeCountValueDisp = 0;
        this.mGemCountValueCheck = 0;
        this.mCascadeCountValueCheck = 0;
        this.mHintCooldownTicks = 0;
        this.mWantHintTicks = 0;
        this.mBoardDarken = 0;
        this.mBoardDarkenAnnounce = 0;
        this.mWarningGlowAlpha = 0;
        this.mTimeExpired = false;
        this.mPointMultPosPct.SetConstant(1);
        this.mTimerInflate.SetCurve('b+0,1,0.005,1,~###    V~###     J####');
        this.mTimerAlpha.SetConstant(1.0);
        for(var aCol = 0; aCol < this.mColCount; aCol++) {
            this.mBumpVelocities[aCol] = 0;
            this.mNextColumnCredit[aCol] = -1;
        }
        this.mReadyDelayCount = 0;
        this.mGoDelayCount = 0;
        this.mAnnouncements = [];
        this.mHintButton = null;
        this.mMenuButton = null;
        this.mResetButton = null;
        this.mGameFinished = false;
        this.mNextPieceId = 1;
        this.mBottomFillRow = this.mRowCount - 1;
        var aRand = Game.Util.Rand();
        this.mRand.SRand((aRand | 0));
        for(var i = 0; i < (Game.DM.EStat._COUNT | 0); i++) {
            this.mGameStats[i] = 0;
        }
        this.mFullLaser = true;
        this.mUpdateAcc = 0;
        this.mGameOverCount = 0;
        this.mLevelCompleteCount = 0;
        this.mScrambleDelayTicks = 0;
        this.mInLoadSave = false;
        this.mComplementNum = -1;
        this.mLastComplement = -1;
        this.mLastHitSoundTick = 0;
        this.mShowAutohints = true;
        this.mMouseDown = false;
        this.mMouseDownX = 0;
        this.mMouseDownY = 0;
        this.mMouseUpPiece = null;
        this.mContinuedFromLoad = false;
        this.mSidebarText = '';
        this.mShowLevelPoints = false;
        this.mFavorComboGems = false;
        this.mUserPaused = false;
        this.mBoardHidePct = 0.0;
        this.mVisPausePct = 0.0;
        this.mTimeExpired = false;
        this.mLastWarningTick = 0;
        this.mShowMoveCredit = false;
        this.mDoThirtySecondVoice = true;
        this.mSunFired = false;
        this.mLastSunTick = 0;
        this.mPointsManager = new Game.PointsManager();
        this.AddWidget(this.mPointsManager);
        this.mPreFXManager = new Game.EffectsManager(this);
        this.mPostFXManager = new Game.EffectsManager(this);
        this.AddWidget(this.mPostFXManager);
        this.mSideAlpha.SetConstant(1.0);
        this.mSideXOff.SetConstant(0.0);
        this.mAlpha.SetConstant(1.0);
        this.mScale.SetConstant(1.0);
        this.mKilling = false;
        this.mSliderSetTicks = -1;
        this.mStartDelay = 0;
        this.mCursorSelectPos = new GameFramework.geom.TIntPoint(-1, -1);
        this.mMoveCounter = 0;
        this.mDrawAll = true;
        this.mDrawGameElements = true;
        this.mNeedsMaskCleared = false;
        this.mWantsReddishFlamegems = false;
        this.mPowerGemThreshold = 5;
        this.InitUI();
        for(var aGemColor = 0; aGemColor < (7 | 0); aGemColor++) {
            this.mNewGemColors.push(aGemColor);
            this.mNewGemColors.push(aGemColor);
        }
        this.mMessager = Game.BejApp.mBejApp.mMessager;
    },
    GetTutorialSequence : function Game_Board$GetTutorialSequence() {
        return null;
    },
    Dispose : function Game_Board$Dispose() {
        this.mAnnouncements.clear();
        this.mLightningStorms.clear();
        this.mHyperspace = null;
        this.ClearAllPieces();
        GameFramework.widgets.ClassicWidget.prototype.Dispose.apply(this);
        if(this.mPreFXManager != null) {
            this.mPreFXManager.Dispose();
            this.mPreFXManager = null;
        }
        if(this.mPostFXManager != null) {
            this.mPostFXManager.Dispose();
            this.mPostFXManager = null;
        }
        if(this.mFlameSound != null) {
            this.mFlameSound.Dispose();
        }
    },
    GetLevelBarRect : function Game_Board$GetLevelBarRect() {
        return new GameFramework.TRect(554, 1108, 900, 40);
    },
    GetCountdownBarRect : function Game_Board$GetCountdownBarRect() {
        return new GameFramework.TRect(0, 200, 1000, 200);
    },
    WantsCalmEffects : function Game_Board$WantsCalmEffects() {
        return false;
    },
    GetTutorialIrisPiece : function Game_Board$GetTutorialIrisPiece() {
        return null;
    },
    GetMusicName : function Game_Board$GetMusicName() {
        return 'Classic';
    },
    AllowNoMoreMoves : function Game_Board$AllowNoMoreMoves() {
        return (this.mLevel != 0) && (this.mSpeedBonusFlameModePct == 0);
    },
    AllowSpeedBonus : function Game_Board$AllowSpeedBonus() {
        return false;
    },
    AllowPowerups : function Game_Board$AllowPowerups() {
        return true;
    },
    AllowLaserGems : function Game_Board$AllowLaserGems() {
        return true;
    },
    AllowHints : function Game_Board$AllowHints() {
        return true;
    },
    AllowTooltips : function Game_Board$AllowTooltips() {
        if((this.mScale.GetOutVal() != 1.0) || (this.GetPieceAlpha() != 1.0)) {
            return false;
        }
        if((this.mIsOver) && (this.mIsBoardStill) && (this.GetPieceAlpha() == 1.0)) {
            return true;
        }
        return false;
    },
    HasLargeExplosions : function Game_Board$HasLargeExplosions() {
        return false;
    },
    ForceSwaps : function Game_Board$ForceSwaps() {
        return false;
    },
    CanPlay : function Game_Board$CanPlay() {
        if(this.mAnnouncements.length > 0) {
            for(var i = 0; i < this.mAnnouncements.length; ++i) {
                if(this.mAnnouncements[i].mBlocksPlay) {
                    return false;
                }
            }
        }
        if(!this.mHasBoardSettled) {
            return false;
        }
        if(this.mReadyDelayCount != 0) {
            return false;
        }
        if(this.mLevelCompleteCount != 0) {
            return false;
        }
        if(this.mGameOverCount != 0) {
            return false;
        }
        if(this.GetTicksLeft() == 0) {
            return false;
        }

        {
            var $srcArray4 = this.mBoard;
            for(var $enum4 = 0; $enum4 < $srcArray4.length; $enum4++) {
                var aPiece = $srcArray4[$enum4];
                if(aPiece != null && (aPiece.IsFlagSet(Game.Piece.EFlag.BOMB) || aPiece.IsFlagSet(Game.Piece.EFlag.REALTIME_BOMB)) && (aPiece.mCounter == 0)) {
                    return false;
                }
            }
        }
        if((this.mWantLevelup) || (this.mHyperspace != null)) {
            return false;
        }
        return true;
    },
    WantsBackground : function Game_Board$WantsBackground() {
        return true;
    },
    WantsLevelBasedBackground : function Game_Board$WantsLevelBasedBackground() {
        return true;
    },
    IsGameSuspended : function Game_Board$IsGameSuspended() {
        return (this.mReadyDelayCount > 0) || (this.mTimeExpired) || (this.mLightningStorms.length > 0) || Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.OPTIONS) != null || this.mTutorialMgr.WantsBlockTimer() || (Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.TUTORIAL) != null && Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.TUTORIAL).IsModal());
    },
    CanPiecesFall : function Game_Board$CanPiecesFall() {
        return ((Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.TUTORIAL) == null || !Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.TUTORIAL).mIsModal) && (this.mGemFallDelay == 0) && (this.mLightningStorms.length == 0));
    },
    IsGamePaused : function Game_Board$IsGamePaused() {
        return (this.mUserPaused || Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.OPTIONS) != null || Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.RESET) != null || Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.MAIN_MENU_CONFIRM) != null) && this.WantsHideOnPause();
    },
    GetPowerGemThreshold : function Game_Board$GetPowerGemThreshold() {
        return this.mPowerGemThreshold;
    },
    GetTimeLimit : function Game_Board$GetTimeLimit() {
        return 0;
    },
    GetTimeDrawX : function Game_Board$GetTimeDrawX() {
        return this.GetBoardCenterX();
    },
    GetHintTime : function Game_Board$GetHintTime() {
        return 15;
    },
    WantsHideOnPause : function Game_Board$WantsHideOnPause() {
        return this.GetTimeLimit() != 0;
    },
    WantHypermixerEdgeCheck : function Game_Board$WantHypermixerEdgeCheck() {
        return false;
    },
    WantHypermixerBottomCheck : function Game_Board$WantHypermixerBottomCheck() {
        return true;
    },
    WantAnnihilatorReplacement : function Game_Board$WantAnnihilatorReplacement() {
        return false;
    },
    GetGemCountPopupThreshold : function Game_Board$GetGemCountPopupThreshold() {
        return 10;
    },
    GetMinComplementLevel : function Game_Board$GetMinComplementLevel() {
        return 0;
    },
    GetGravityFactor : function Game_Board$GetGravityFactor() {
        return 1.0 + (this.mSpeedModeFactor.GetOutVal() - 1.0) * 0.65;
    },
    GetSwapSpeed : function Game_Board$GetSwapSpeed() {
        return this.mSpeedModeFactor.GetOutVal();
    },
    GetMatchSpeed : function Game_Board$GetMatchSpeed() {
        return this.mSpeedModeFactor.GetOutVal();
    },
    GetGameSpeed : function Game_Board$GetGameSpeed() {
        return 1.0;
    },
    GetSpeedModeFactorScale : function Game_Board$GetSpeedModeFactorScale() {
        return 1.0;
    },
    GetModePointMultiplier : function Game_Board$GetModePointMultiplier() {
        return 1.0;
    },
    GetRankPointMultiplier : function Game_Board$GetRankPointMultiplier() {
        return this.GetModePointMultiplier();
    },
    GetTopWidgetButtonText : function Game_Board$GetTopWidgetButtonText() {
        return '';
    },
    GetBottomWidgetOffset : function Game_Board$GetBottomWidgetOffset() {
        return 0;
    },
    WantColorCombos : function Game_Board$WantColorCombos() {
        return false;
    },
    BackToMenu : function Game_Board$BackToMenu() {
        if(this.mAlpha.get_v() > 0.0) {
            this.mAlpha.SetCurve('b;0,1,0.02,1,~###         ~#EAC');
        }
        this.mScale.SetCurve('b;1,1.2,0.02,1,####         ~~^bn');
        if(this.mFlameSound != null) {
            this.mFlameSound.Dispose();
        }
        this.mFlameSound = null;
        Game.BejApp.mBejApp.PlaySound(Game.Resources['SOUND_BACKTOMAIN']);
        this.mKilling = true;
        this.mTutorialMgr.Kill();
        this.DisableUI(true);
        Game.BejApp.mBejApp.BackToMenu();
        if(this.mBackground != null) {
            this.mBackground.RemoveSelf();
        }
    },
    WantHyperMixers : function Game_Board$WantHyperMixers() {
        return false;
    },
    WantBulgeCascades : function Game_Board$WantBulgeCascades() {
        return true;
    },
    WantDrawTimer : function Game_Board$WantDrawTimer() {
        return true;
    },
    WantsTutorial : function Game_Board$WantsTutorial(theTutorialFlag) {
        if(Game.BejApp.mBejApp.mAutoPlay != Game.DM.EAutoplay.None) {
            return false;
        }
        return (!this.HasClearedTutorial(theTutorialFlag)) && (this.mSpeedBonusFlameModePct == 0) && (!this.mTimeExpired);
    },
    HypermixerDropped : function Game_Board$HypermixerDropped() {
    },
    SetupBackground : function Game_Board$SetupBackground(theDeltaIdx) {
        if(theDeltaIdx === undefined) {
            theDeltaIdx = 0;
        }
        if((theDeltaIdx == 0) && (this.mBackgroundIdx >= 0) && (this.mBackground != null)) {
            return;
        }
        if(this.mBackground != null) {
            this.mBackground.RemoveSelf();
            this.mBackground = null;
        }
        if(!this.WantsBackground()) {
            return;
        }
        if(this.mParent == null) {
            return;
        }
        this.mBackground = new Game.Background(true, false);
        this.mBackground.NextBkg();
        this.mBackground.Resize(-160, 0, 1920, 1200);
        var parentWidget = this.mParent;
        if(parentWidget != null) {
            this.RemoveSelf();
            parentWidget.AddWidget(this.mBackground);
            parentWidget.AddWidget(this);
        }
    },
    GetGameType : function Game_Board$GetGameType() {
        return 'GameType';
    },
    NewGame : function Game_Board$NewGame() {
        if(this.mTutorialMgr != null) {
            this.mTutorialMgr.Kill();
        }
        this.mTutorialMgr = new Game.TutorialMgr(this);
        this.mTutorialMgr.SetTutorialSequence(this.GetTutorialSequence());
        this.mGameId = GameFramework.Utils.CreateGUID();
        Game.BejApp.mBejApp.SubmitStandardMetrics('game_started', [new GameFramework.misc.KeyVal('GameId', this.mGameId)]);
        this.mUserPaused = false;
        this.mVisPausePct = 0;
        this.mAutohintOverridePieceId = -1;
        this.mAutohintOverrideTime = -1;
        var randSeedOverride = this.GetRandSeedOverride();
        if(randSeedOverride != 0) {
            this.mRand.SRand(randSeedOverride);
            GameFramework.Utils.Trace(String.format('Tutorial Seed Override: {0}\r\n', randSeedOverride));
        }
        for(var i = 0; i < (Game.DM.EStat._COUNT | 0); i++) {
            this.mGameStats[i] = 0;
        }
        this.mWantLevelup = false;
        this.mBackgroundIdx = -1;
        this.SetupBackground(1);
        Game.BejApp.mBejApp.mBaseWidgetAppState.SetFocus(this);
        this.mHasBoardSettled = false;
        this.mContinuedFromLoad = false;
        this.NewCombo();
        this.FillInBlanksEx(false);
        this.mReadyDelayCount = 0;
        this.mGoDelayCount = 25;
        this.mSettlingDelay = 0;
        var d = Game.BejApp.mBejApp.mDialogMgr.GetDialog(Game.DM.EDialog.END_LEVEL);
        if(d != null) {
            d.Kill();
        }
        this.ExtraTutorialSetup();
    },
    ExtraTutorialSetup : function Game_Board$ExtraTutorialSetup() {
    },
    BoardSettled : function Game_Board$BoardSettled() {
    },
    DialogClosed : function Game_Board$DialogClosed(theId) {
    },
    TallyPiece : function Game_Board$TallyPiece(thePiece, thePieceDestroyed) {
        if(!thePiece.mTallied) {
            thePiece.mTallied = true;
            this.PieceTallied(thePiece);
            if(thePieceDestroyed) {
                if(!thePiece.IsFlagSet(Game.Piece.EFlag.DIG)) {
                    this.AddToStatCred(Game.DM.EStat.GEMS_CLEARED, 1, thePiece.mMoveCreditId);
                    JS_Assert(thePiece.mColor < Game.DM.EGemColor._COUNT);
                    if(thePiece.mColor != Game.DM.EGemColor._INVALID) {
                        var aStat = ((Game.DM.EStat.RED_CLEARED | 0) + (thePiece.mColor | 0));
                        this.AddToStatCred(aStat, 1, thePiece.mMoveCreditId);
                    }
                    if(thePiece.mMoveCreditId != -1) {
                        this.MaxStat(Game.DM.EStat.BIGGESTMOVE, this.GetMoveStat(thePiece.mMoveCreditId, Game.DM.EStat.POINTS));
                        this.MaxStat(Game.DM.EStat.BIGGEST_GEMS_CLEARED, this.GetMoveStat(thePiece.mMoveCreditId, Game.DM.EStat.GEMS_CLEARED));
                    }
                }
                if(thePiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) {
                    this.IncPointMult(thePiece);
                }
            }
        }
    },
    PieceTallied : function Game_Board$PieceTallied(thePiece) {
        if((thePiece.IsFlagSet(Game.Piece.EFlag.COUNTER)) && (this.mGameOverPiece == null)) {
            var aCX = (thePiece.CX() | 0);
            var aCY = (thePiece.CY() | 0);
            var aLight = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.LIGHT);
            aLight.mFlags = (Game.Effect.EFlag.ALPHA_FADEINOUT | 0);
            aLight.mX = aCX;
            aLight.mY = aCY;
            aLight.mZ = 0.08;
            aLight.mValue[0] = 45.1;
            aLight.mValue[1] = -0.5;
            aLight.mAlpha = 0.3;
            aLight.mDAlpha = 0.06 * 1.67;
            aLight.mScale = 300.0;
            this.mPostFXManager.AddEffect(aLight);
            Game.SoundUtil.Play(Game.Resources['SOUND_GEM_COUNTDOWN_DESTROYED']);
            this.BumpColumn(thePiece, 2.0);
            for(var i = 0; i < 20; i++) {
                var anEffect = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.COUNTDOWN_SHARD);
                anEffect.mColor = Game.DM.gGemColors[(thePiece.mColor | 0)];
                anEffect.mX = aCX;
                anEffect.mY = aCY;
                this.mPostFXManager.AddEffect(anEffect);
            }
        }
    },
    AddToStatCred : function Game_Board$AddToStatCred(theStatNum, theNumber, theMoveCreditId) {
        this.AddToStatEx(theStatNum, theNumber, theMoveCreditId, true);
    },
    AddToStat : function Game_Board$AddToStat(theStatNum, theNumber) {
        this.AddToStatEx(theStatNum, theNumber, -1, true);
    },
    IncStat : function Game_Board$IncStat(theStatNum) {
        this.AddToStatEx(theStatNum, 1, -1, true);
    },
    AddToStatEx : function Game_Board$AddToStatEx(theStatNum, theNumber, theMoveCreditId, addToProfile) {
        this.mGameStats[(theStatNum | 0)] += theNumber;
        if(this.mGameStats[(theStatNum | 0)] < 0) {
            this.mGameStats[(theStatNum | 0)] = 0x7fffffff;
        }
        this.mLevelStats[(theStatNum | 0)] += theNumber;
        if(this.mLevelStats[(theStatNum | 0)] < 0) {
            this.mLevelStats[(theStatNum | 0)] = 0x7fffffff;
        }
        if(addToProfile) {
            Game.BejApp.mBejApp.mProfile.mStats[(theStatNum | 0)] = Game.BejApp.mBejApp.mProfile.mStats[(theStatNum | 0)] + theNumber;
            if(Game.BejApp.mBejApp.mProfile.mStats[(theStatNum | 0)] < 0) {
                Game.BejApp.mBejApp.mProfile.mStats[(theStatNum | 0)] = 0x7fffffff;
            }
        }
        if(theMoveCreditId != -1) {
            for(var aMoveDataIdx = 0; aMoveDataIdx < (this.mMoveDataVector.length | 0); aMoveDataIdx++) {
                if(this.mMoveDataVector[aMoveDataIdx].mMoveCreditId == theMoveCreditId) {
                    this.mMoveDataVector[aMoveDataIdx].mStats[(theStatNum | 0)] = this.mMoveDataVector[aMoveDataIdx].mStats[(theStatNum | 0)] + theNumber;
                }
            }
        }
    },
    MaxStat : function Game_Board$MaxStat(theStatNum, theNumber) {
        this.MaxStatCred(theStatNum, theNumber, -1);
    },
    MaxStatCred : function Game_Board$MaxStatCred(theStatNum, theNumber, theMoveCreditId) {
        this.mGameStats[(theStatNum | 0)] = (Math.max(this.mGameStats[(theStatNum | 0)], theNumber) | 0);
        this.mLevelStats[(theStatNum | 0)] = (Math.max(this.mLevelStats[(theStatNum | 0)], theNumber) | 0);
        Game.BejApp.mBejApp.mProfile.mStats[(theStatNum | 0)] = (Math.max(Game.BejApp.mBejApp.mProfile.mStats[(theStatNum | 0)], theNumber) | 0);
        if(theMoveCreditId != -1) {
            for(var aMoveDataIdx = 0; aMoveDataIdx < (this.mMoveDataVector.length | 0); aMoveDataIdx++) {
                if(this.mMoveDataVector[aMoveDataIdx].mMoveCreditId == theMoveCreditId) {
                    this.mMoveDataVector[aMoveDataIdx].mStats[(theStatNum | 0)] = (Math.max(this.mMoveDataVector[aMoveDataIdx].mStats[(theStatNum | 0)], theNumber) | 0);
                }
            }
        }
    },
    GetMoveStat : function Game_Board$GetMoveStat(theMoveCreditId, theStatNum) {
        return this.GetMoveStatEx(theMoveCreditId, theStatNum, 0);
    },
    GetMoveStatEx : function Game_Board$GetMoveStatEx(theMoveCreditId, theStatNum, theDefault) {
        for(var aMoveDataIdx = 0; aMoveDataIdx < (this.mMoveDataVector.length | 0); aMoveDataIdx++) {
            if(this.mMoveDataVector[aMoveDataIdx].mMoveCreditId == theMoveCreditId) {
                return this.mMoveDataVector[aMoveDataIdx].mStats[(theStatNum | 0)];
            }
        }
        return theDefault;
    },
    GetTotalMovesStat : function Game_Board$GetTotalMovesStat(theStatNum) {
        var aTotal = 0;
        for(var aMoveDataIdx = 0; aMoveDataIdx < (this.mMoveDataVector.length | 0); aMoveDataIdx++) {
            aTotal += this.mMoveDataVector[aMoveDataIdx].mStats[(theStatNum | 0)];
        }
        return aTotal;
    },
    GetMaxMovesStat : function Game_Board$GetMaxMovesStat(theStatNum) {
        var aMax = 0;
        for(var aMoveDataIdx = 0; aMoveDataIdx < (this.mMoveDataVector.length | 0); aMoveDataIdx++) {
            if((aMoveDataIdx == 0) || (this.mMoveDataVector[aMoveDataIdx].mStats[(theStatNum | 0)] > aMax)) {
                aMax = this.mMoveDataVector[aMoveDataIdx].mStats[(theStatNum | 0)];
            }
        }
        return aMax;
    },
    SubmitStats : function Game_Board$SubmitStats(endOfGame) {
        var aStats = endOfGame ? this.mGameStats : this.mLevelStats;
        var aSpeedPoints = 0;
        var aHurrahPoints = 0;
        var aMatchPoints = 0;
        if(endOfGame) {

            {
                var $srcArray5 = this.mPointsBreakdown;
                for(var $enum5 = 0; $enum5 < $srcArray5.length; $enum5++) {
                    var aPointsTypes = $srcArray5[$enum5];
                    aSpeedPoints += aPointsTypes[(Game.Board.EPointType.SPEED | 0)];
                    aMatchPoints += aPointsTypes[(Game.Board.EPointType.MATCH | 0)];
                }
            }
            if(this.GetGameType() == 'Speed') {

                {
                    var $srcArray6 = this.mPointsBreakdown[this.mPointsBreakdown.length - 1];
                    for(var $enum6 = 0; $enum6 < $srcArray6.length; $enum6++) {
                        var aPoints = $srcArray6[$enum6];
                        aHurrahPoints += aPoints;
                    }
                }
            }
        } else {
            aSpeedPoints += this.mPointsBreakdown[this.mPointsBreakdown.length - 1][(Game.Board.EPointType.SPEED | 0)];
            aMatchPoints += this.mPointsBreakdown[this.mPointsBreakdown.length - 1][(Game.Board.EPointType.MATCH | 0)];
        }
        var aData = [new GameFramework.misc.KeyVal('IsSlow', Game.BejApp.mBejApp.mIsSlow), new GameFramework.misc.KeyVal('MusicVolume', Game.BejApp.mBejApp.mProfile.mMusicVolume), new GameFramework.misc.KeyVal('SfxVolume', Game.BejApp.mBejApp.mProfile.mSfxVolume), new GameFramework.misc.KeyVal('GameId', this.mGameId), new GameFramework.misc.KeyVal('GameMode', this.GetGameType()), new GameFramework.misc.KeyVal('GameTimePlayed', aStats[(Game.DM.EStat.SECONDS_PLAYED | 0)] * 10), new GameFramework.misc.KeyVal('WasGameCompleted', this.mGameFinished), new GameFramework.misc.KeyVal('FpsAverage', ((aStats[(Game.DM.EStat.FPS_SAMPLE_TOTAL | 0)] / Math.max(1, aStats[(Game.DM.EStat.FPS_SAMPLE_COUNT | 0)])) | 0)), new GameFramework.misc.KeyVal('FpsLow', aStats[(Game.DM.EStat.FPS_MIN | 0)]), new GameFramework.misc.KeyVal('FpsHigh', aStats[(Game.DM.EStat.FPS_MAX | 0)]), new GameFramework.misc.KeyVal('Level', Math.max(this.mPointMultiplier, this.mLevel + 1)), new GameFramework.misc.KeyVal('Points', this.mPoints), new GameFramework.misc.KeyVal('SpeedPoints', aSpeedPoints), new GameFramework.misc.KeyVal('HurrahPoints', aHurrahPoints), new GameFramework.misc.KeyVal('MatchPoints', aMatchPoints), new GameFramework.misc.KeyVal('GemsCleared', aStats[(Game.DM.EStat.GEMS_CLEARED | 0)]), new GameFramework.misc.KeyVal('FlamegemsCleared', aStats[(Game.DM.EStat.FLAMEGEMS_USED | 0)]), new GameFramework.misc.KeyVal('StargemsCleared', aStats[(Game.DM.EStat.LASERGEMS_USED | 0)]), new GameFramework.misc.KeyVal('HypergemsCleared', aStats[(Game.DM.EStat.HYPERCUBES_USED | 0)]), new GameFramework.misc.KeyVal('SupernovagemsCleared', aStats[(Game.DM.EStat.SUPERNOVAS_USED | 0)]), new GameFramework.misc.KeyVal('FlamegemsMade', aStats[(Game.DM.EStat.FLAMEGEMS_MADE | 0)]), new GameFramework.misc.KeyVal('StargemsMade', aStats[(Game.DM.EStat.LASERGEMS_MADE | 0)]), new GameFramework.misc.KeyVal('HypergemsMade', aStats[(Game.DM.EStat.HYPERCUBES_MADE | 0)]), new GameFramework.misc.KeyVal('SupernovagemsMade', aStats[(Game.DM.EStat.SUPERNOVAS_MADE | 0)]), new GameFramework.misc.KeyVal('NumMoves', aStats[(Game.DM.EStat.NUM_MOVES | 0)]), new GameFramework.misc.KeyVal('NumMovesDrag', aStats[(Game.DM.EStat.NUM_MOVES_DRAG | 0)]), new GameFramework.misc.KeyVal('NumMovesClick', aStats[(Game.DM.EStat.NUM_MOVES_CLICK | 0)]), new GameFramework.misc.KeyVal('NumGoodMoves', aStats[(Game.DM.EStat.NUM_GOOD_MOVES | 0)]), new GameFramework.misc.KeyVal('NumMatches', aStats[(Game.DM.EStat.MATCHES | 0)]), new GameFramework.misc.KeyVal('TotalXP', Game.BejApp.mBejApp.mProfile.mOfflineRankPoints), new GameFramework.misc.KeyVal('PlayerRank', Game.BejApp.mBejApp.mProfile.mOfflineRank), new GameFramework.misc.KeyVal('HintsUsed', aStats[(Game.DM.EStat.HINT_USED | 0)])];
        Game.BejApp.mBejApp.SubmitStandardMetrics('gameplay', aData);
    },
    UpdateDeferredSounds : function Game_Board$UpdateDeferredSounds() {
        if(this.mDeferredSounds.length == 0) {
            return;
        }
        for(var i = 0; i < this.mDeferredSounds.length;) {
            if(this.mGameTicks >= this.mDeferredSounds[i].mOnGameTick) {
                Game.SoundUtil.Play(this.mDeferredSounds[i].mId);
                this.mDeferredSounds.removeAt(i);
            } else {
                ++i;
            }
        }
    },
    AddDeferredSound : function Game_Board$AddDeferredSound(theSoundId, theDelayGameTicks) {
        this.AddDeferredSoundEx(theSoundId, theDelayGameTicks, 1.0);
    },
    AddDeferredSoundEx : function Game_Board$AddDeferredSoundEx(theSoundId, theDelayGameTicks, theVol) {
        var ds = new Game.DeferredSound(theSoundId, this.mGameTicks + theDelayGameTicks, theVol);
        this.mDeferredSounds.push(ds);
    },
    DoSpeedText : function Game_Board$DoSpeedText(anIndex) {
        Game.SoundUtil.Play(Game.Resources['SOUND_FLAMEBONUS']);
        Game.SoundUtil.Play(Game.Resources['SOUND_VOICE_BLAZINGSPEED']);
        this.mFlameSoundBlazingVol.SetCurve('b;0,1,0.01,8,~###        h~### 9#:tT');
        this.DoComplement(6);
        var anEffect;
        anEffect = Game.Resources['PIEFFECT_SPEEDBOARD_FLAME'].Duplicate();
        anEffect.mDrawTransform.translate(1040, 120);
        anEffect.mDrawTransform.scale(1.0, 1.0);
        this.mSpeedFireBarPIEffect[0] = anEffect;
        anEffect = Game.Resources['PIEFFECT_SPEEDBOARD_FLAME'].Duplicate();
        anEffect.mDrawTransform.translate(1040, 1165);
        anEffect.mDrawTransform.scale(1.0, 1.0);
        this.mSpeedFireBarPIEffect[1] = anEffect;
        this.mSpeedBonusFlameModePct = 1.0;
        this.IncStat(Game.DM.EStat.INFERNO_COUNT);
    },
    DoComplement : function Game_Board$DoComplement(theComplementNum) {
        var gComplements = Array.Create(7, "", Game.Resources.SOUND_VOICE_GOOD_ID, Game.Resources.SOUND_VOICE_EXCELLENT_ID, Game.Resources.SOUND_VOICE_AWESOME_ID, Game.Resources.SOUND_VOICE_SPECTACULAR_ID, Game.Resources.SOUND_VOICE_EXTRAORDINARY_ID, Game.Resources.SOUND_VOICE_UNBELIEVABLE_ID, Game.Resources.SOUND_VOICE_BLAZINGSPEED_ID);
        Game.SoundUtil.PlayVoice(GameFramework.BaseApp.mApp.mResourceManager.GetSoundResourceById(gComplements[theComplementNum]));
        this.mComplementNum = theComplementNum;
        if(this.mComplementNum > 0) {
            this.mComplementAlpha.SetCurve('b+0,1,0.005714,1,#### 0~r2d        q#G_h');
            this.mComplementScale.SetCurveLinked('b+0,1,0,1,#7+F  td,P9       -~P##', this.mComplementAlpha);
        }
        this.mLastComplement = theComplementNum;
    },
    NewHyperMixer : function Game_Board$NewHyperMixer() {
    },
    NewCombo : function Game_Board$NewCombo() {
    },
    ComboProcess : function Game_Board$ComboProcess(theColor) {
        return false;
    },
    ComboFailed : function Game_Board$ComboFailed() {
        if(!this.WantColorCombos()) {
            return;
        }
        this.mComboCount = (Math.max(0, this.mComboCount - 1) | 0);
    },
    ComboCompleted : function Game_Board$ComboCompleted() {
        if(!this.WantColorCombos()) {
            return;
        }
        this.mComboCount = 0;
        this.mComboFlashPct.SetCurve('b-0,1,0.006667,1,#### 3{### oO### jk### TI### ]W###  &####');
    },
    GetPanPositionByPiece : function Game_Board$GetPanPositionByPiece(thePiece) {
        return this.GetPanPosition((thePiece.GetScreenX() | 0) + ((Game.Board.GEM_WIDTH / 2) | 0));
    },
    GetPanPosition : function Game_Board$GetPanPosition(theX) {
        var aFieldWidth = this.GetColX(this.mColCount - 1) + Game.Board.GEM_WIDTH;
        var aPixOffset = theX - (this.GetBoardX() + ((aFieldWidth / 2) | 0));
        var aPerOffset = aPixOffset / aFieldWidth * 2.0;
        return aPerOffset * 0.5;
    },
    GetPiecePanPosition : function Game_Board$GetPiecePanPosition(thePiece) {
        if(thePiece == null) {
            return 0;
        }
        return this.GetPanPosition((thePiece.GetScreenX() | 0) + ((Game.Board.GEM_WIDTH / 2) | 0));
    },
    DoAddPoints : function Game_Board$DoAddPoints(theX, theY, thePoints, theColor, theId, addtotube, usePointMultiplier, theMoveCreditId, theForceAdd, thePointType) {
        if(thePoints <= 0 && !theForceAdd) {
            return null;
        }
        var aMultiplier = this.mPointMultiplier;
        if(!usePointMultiplier) {
            aMultiplier = 1.0;
        }
        var aPointsLeft = ((thePoints * aMultiplier) | 0);
        while(aPointsLeft > 0) {
            var aCurPointAdd = (Math.min(aPointsLeft, 10) | 0);
            var aPow = 0.8;
            var aCurMovePts = ((this.GetMoveStat(theMoveCreditId, Game.DM.EStat.POINTS) / this.GetModePointMultiplier()) | 0);
            var aLevelPointsDelta = Math.pow((aCurMovePts + aCurPointAdd), aPow) - Math.pow(aCurMovePts, aPow);
            aLevelPointsDelta *= 3.0;
            if(addtotube) {
                this.mLevelPointsTotal += (aLevelPointsDelta | 0);
            }
            aPointsLeft -= aCurPointAdd;
            var aStatPoints = ((aCurPointAdd * this.GetModePointMultiplier()) | 0);
            this.AddToStatEx(Game.DM.EStat.POINTS, aStatPoints, theMoveCreditId, true);
            this.mPoints += aStatPoints;
            if(this.mPoints < 0) {
                this.mPoints = 0x7fffffff;
            }
        }
        return this.mPointsManager.Add(theX, theY, thePoints, theColor, theId, usePointMultiplier, theMoveCreditId, theForceAdd);
    },
    AddPoints : function Game_Board$AddPoints(theX, theY, thePoints, theColor, theId, addtotube, usePointMultiplier, theMoveCreditId, theForceAdd, thePointType) {
        if(theColor === undefined) {
            theColor = ~0;
        }
        if(theId === undefined) {
            theId = ~0;
        }
        if(addtotube === undefined) {
            addtotube = true;
        }
        if(usePointMultiplier === undefined) {
            usePointMultiplier = true;
        }
        if(theMoveCreditId === undefined) {
            theMoveCreditId = -1;
        }
        if(theForceAdd === undefined) {
            theForceAdd = false;
        }
        if(thePointType === undefined) {
            thePointType = Game.Board.EPointType.SPECIAL;
        }
        var aPrevPoints = this.mPoints;
        var aPoint = this.DoAddPoints(theX, theY, thePoints, theColor, theId, addtotube, usePointMultiplier, theMoveCreditId, theForceAdd, thePointType);
        var aPointDelta = this.mPoints - aPrevPoints;
        this.mPointsBreakdown[this.mPointsBreakdown.length - 1][(thePointType | 0)] += aPointDelta;
        return aPoint;
    },
    AddPointBreakdownSection : function Game_Board$AddPointBreakdownSection() {
        var anIntVector = [];
        for(var i = 0; i < (Game.Board.EPointType.__COUNT | 0); ++i) {
            anIntVector.push(0);
        }
        this.mPointsBreakdown.push(anIntVector);
    },
    GetLevelPoints : function Game_Board$GetLevelPoints() {
        return (2500 + this.mLevel * 750);
    },
    GetLevelPointsTotal : function Game_Board$GetLevelPointsTotal() {
        return this.mLevelPointsTotal;
    },
    RandomizeBoard : function Game_Board$RandomizeBoard(ClearFlags) {
        if(ClearFlags === undefined) {
            ClearFlags = false;
        }
        var foundNewPattern = false;
        var aPieceVector = [];
        do {
            aPieceVector.length = 0;
            for(var aPieceIter = new Game.PieceIter(this); aPieceIter.Next();) {
                var aPiece = aPieceIter.GetPiece();
                if(aPiece != null) {
                    aPieceVector.push(aPiece);
                    aPiece.mDestCol = aPiece.mCol = 7 - aPiece.mCol;
                    aPiece.mDestRow = aPiece.mRow = 7 - aPiece.mRow;
                }
            }
            for(var aPieceIdx = 0; aPieceIdx < (aPieceVector.length | 0); aPieceIdx++) {
                var aPiece_2 = aPieceVector[aPieceIdx];
                this.mBoard[this.mBoard.mIdxMult0 * (aPiece_2.mDestRow) + aPiece_2.mDestCol] = aPiece_2;
            }
            var aSwapGemOffsets = Array.Create2D(3, 2, 0, 1, 0, 1, 1, 0, 1);
            for(var anItr = 0; ((anItr < 16) || (!this.FindMove(null, 0, true, true, false, null, false))) && (anItr < 20); anItr++) {
                var aSwapCol1 = ((this.mRand.Next() | 0) % this.mColCount) & ~1;
                var aSwapRow1 = ((this.mRand.Next() | 0) % this.mRowCount) & ~1;
                var aPiece1 = this.mBoard[this.mBoard.mIdxMult0 * (aSwapRow1) + aSwapCol1];
                if((aPiece1.mDestCol == aPiece1.mCol) && (aPiece1.mDestRow == aPiece1.mRow)) {
                    for(var aRotCount = 0; aRotCount < 4; aRotCount++) {
                        for(var aSwapIdx = 0; aSwapIdx < 3; aSwapIdx++) {
                            var aSwapCol2 = aSwapCol1 + aSwapGemOffsets[aSwapGemOffsets.mIdxMult0 * (aSwapIdx) + 0];
                            var aSwapRow2 = aSwapRow1 + aSwapGemOffsets[aSwapGemOffsets.mIdxMult0 * (aSwapIdx) + 1];
                            var aSwapPiece1 = this.mBoard[this.mBoard.mIdxMult0 * (aSwapRow1) + aSwapCol1];
                            var aSwapPiece2 = this.mBoard[this.mBoard.mIdxMult0 * (aSwapRow2) + aSwapCol2];
                            var aSwapDest = aSwapPiece2.mDestCol;
                            aSwapPiece2.mDestCol = aSwapPiece1.mDestCol;
                            aSwapPiece1.mDestCol = aSwapDest;
                            aSwapDest = aSwapPiece2.mDestRow;
                            aSwapPiece2.mDestRow = aSwapPiece1.mDestRow;
                            aSwapPiece1.mDestRow = aSwapDest;
                            this.mBoard[this.mBoard.mIdxMult0 * (aSwapPiece1.mDestRow) + aSwapPiece1.mDestCol] = aSwapPiece1;
                            this.mBoard[this.mBoard.mIdxMult0 * (aSwapPiece2.mDestRow) + aSwapPiece2.mDestCol] = aSwapPiece2;
                        }
                        if(((aRotCount & 1) == 0) && (!this.HasSet())) {
                            break;
                        }
                    }
                }
            }
            foundNewPattern = this.FindMove(null, 0, true, true, false, null, false);
            for(var aPieceIdx_2 = 0; aPieceIdx_2 < aPieceVector.length; aPieceIdx_2++) {
                var aPiece_3 = aPieceVector[aPieceIdx_2];
                this.mBoard[this.mBoard.mIdxMult0 * (aPiece_3.mRow) + aPiece_3.mCol] = aPiece_3;
            }
        } while(!foundNewPattern);
        for(var aPieceIdx_3 = 0; aPieceIdx_3 < aPieceVector.length; aPieceIdx_3++) {
            var aPiece_4 = aPieceVector[aPieceIdx_3];
            aPiece_4.mCol = aPiece_4.mDestCol;
            aPiece_4.mRow = aPiece_4.mDestRow;
            aPiece_4.mX = this.GetColX(aPiece_4.mCol);
            aPiece_4.mY = this.GetRowY(aPiece_4.mRow);
            this.mBoard[this.mBoard.mIdxMult0 * (aPiece_4.mRow) + aPiece_4.mCol] = aPiece_4;
        }
        for(; ;) {
            for(var i = 0; i < 3; i++) {
                var aPiece1_2 = this.mBoard[this.mBoard.mIdxMult0 * (this.mRand.NextInt() % this.mRowCount) + this.mRand.NextInt() % this.mColCount];
                var aPiece2 = this.mBoard[this.mBoard.mIdxMult0 * (this.mRand.NextInt() % this.mRowCount) + this.mRand.NextInt() % this.mColCount];
                if(aPiece1_2 != null && aPiece2 != null) {
                    for(var aSwapCount = 0; aSwapCount < 2; aSwapCount++) {
                        var p = this.mBoard[this.mBoard.mIdxMult0 * (aPiece1_2.mRow) + aPiece1_2.mCol];
                        this.mBoard[this.mBoard.mIdxMult0 * (aPiece1_2.mRow) + aPiece1_2.mCol] = this.mBoard[this.mBoard.mIdxMult0 * (aPiece2.mRow) + aPiece2.mCol];
                        this.mBoard[this.mBoard.mIdxMult0 * (aPiece2.mRow) + aPiece2.mCol] = p;
                        var t = aPiece1_2.mCol;
                        aPiece1_2.mCol = aPiece2.mCol;
                        aPiece2.mCol = t;
                        t = aPiece1_2.mRow;
                        aPiece1_2.mRow = aPiece2.mRow;
                        aPiece2.mRow = t;
                        if(!this.HasSet()) {
                            break;
                        }
                    }
                }
            }
            var aCoords = Array.Create(4, 0);
            if(this.FindMove(aCoords, 3, true, true, true, null, false) && (aCoords[1] >= this.mRowCount - 4)) {
                break;
            }
        }
        for(var aPieceIter_2 = new Game.PieceIter(this); aPieceIter_2.Next();) {
            var aPiece_5 = aPieceIter_2.GetPiece();
            if(aPiece_5 != null) {
                aPiece_5.mX = this.GetColX(aPiece_5.mCol);
                aPiece_5.mY = this.GetRowY(aPiece_5.mRow);
            }
        }
    },
    LevelUp : function Game_Board$LevelUp() {
        if(this.mGameFinished || (this.mWantLevelup) || (this.mHyperspace != null) || (this.mGameOverCount > 0)) {
            return;
        }
        this.mWantLevelup = true;
    },
    HyperspaceEvent : function Game_Board$HyperspaceEvent(inEvent) {
        switch(inEvent) {
            case Game.Hyperspace.HyperspaceEvent.Start:
            {
                this.mSideXOff.SetCurve('b+0,-202,0.00625,1,####    G####     Y~Ws|');
                break;
            }
            case Game.Hyperspace.HyperspaceEvent.HideAll:
            {
                this.mSideAlpha.SetConstant(1.0);
                this.mDrawGameElements = false;
                for(var aPieceIter = new Game.PieceIter(this); aPieceIter.Next();) {
                    var aPiece = aPieceIter.GetPiece();
                    if(aPiece.IsFlagSet(Game.Piece.EFlag.FLAME)) {
                        this.Start3DFireGemEffect(aPiece);
                    }
                }
                this.RandomizeBoard();
                break;
            }
            case Game.Hyperspace.HyperspaceEvent.BoardShatter:
            {
                this.mDrawAll = false;
                break;
            }
            case Game.Hyperspace.HyperspaceEvent.NextBkg:
            {
                this.mBackground.NextBkg();
                break;
            }
            case Game.Hyperspace.HyperspaceEvent.OldLevelClear:
            {
                this.mLevel++;
                this.mLevelPointsTotal = 0;
                this.mMoveCounter = 0;
                break;
            }
            case Game.Hyperspace.HyperspaceEvent.ZoomIn:
            {
                this.mDrawAll = true;
                this.mDrawGameElements = true;
                this.mOfsX = 0;
                this.mOfsY = 0;
                this.mSideXOff.SetConstant(-202);
                this.mScale.SetCurve('b+0.26,1,0.008333,1,#&Mg      /~a[J   r~P##');
                break;
            }
            case Game.Hyperspace.HyperspaceEvent.SlideOver:
            {
                this.mSideXOff.SetCurve('b+0,-202,0.009091,1,~},XB~P## ;olsb        F#O%V');
                this.mScale.SetConstant(1.0);
                for(var aPieceIter_2 = new Game.PieceIter(this); aPieceIter_2.Next();) {
                    var aPiece_2 = aPieceIter_2.GetPiece();
                    if(aPiece_2.IsFlagSet(Game.Piece.EFlag.FLAME)) {
                        aPiece_2.ClearHyperspaceEffects();
                    }
                }
                break;
            }
            case Game.Hyperspace.HyperspaceEvent.Finish:
            {
                this.mHyperspace.RemoveSelf();
                this.mHyperspace = null;
                var anAnnouncement = new Game.Announcement(this, String.format('LEVEL {0}', this.mLevel + 1));
                anAnnouncement.mAlpha.SetCurve('b+0,1,0.004,1,#### F####  (~###    +~###  M####');
                anAnnouncement.mScale.SetCurve('b+0,2,0.004,1,#### D####  ,P}}}    +P###  K####');
                anAnnouncement.mHorzScaleMult.SetCurve('b+1,10,0.004,1,~### D~i%C  ,####      S####');
                anAnnouncement.mBlocksPlay = false;
                anAnnouncement.mDarkenBoard = false;
                break;
            }
        }
    },
    GameOverAnnounce : function Game_Board$GameOverAnnounce() {
        if((this.GetTicksLeft() == 0) && (this.GetTimeLimit() > 0)) {
            new Game.Announcement(this, 'TIME UP');
            Game.SoundUtil.Play(Game.Resources['SOUND_VOICE_TIMEUP']);
        } else {
            new Game.Announcement(this, 'GAME OVER');
            Game.SoundUtil.Play(Game.Resources['SOUND_VOICE_GAMEOVER']);
        }
    },
    AllowGameOver : function Game_Board$AllowGameOver() {
        return (this.mHyperspace == null) && (!this.mWantLevelup);
    },
    GameOver : function Game_Board$GameOver(visible) {
        if(visible === undefined) {
            visible = true;
        }
        if(!this.AllowGameOver()) {
            return;
        }
        this.mCursorSelectPos = new GameFramework.geom.TIntPoint(-1, -1);
        if(this.mGameFinished || this.mGameOverCount > 0 || this.mLevelCompleteCount > 0) {
            return;
        }
        this.mGameFinished = true;
        if(visible) {
            this.GameOverAnnounce();
        }
        this.SubmitStats(true);
        this.mGameOverCount = 1;
    },
    BombExploded : function Game_Board$BombExploded(thePiece) {
        if(this.mLevelCompleteCount != 0) {
            return;
        }
        if(this.mGameOverPiece != null) {
            return;
        }
        this.GameOver();
        this.mGameOverPiece = thePiece;
        this.mNukeRadius.SetCurve('b#0,50,0.0065,2,#    %#  (j   w~');
        this.mNukeAlpha.SetCurveLinked('b+0,1,0,2,~###        >~}ir 3eiIFJ)hD5+#Mfq', this.mNukeRadius);
        this.mNovaRadius.SetCurveLinked('b#0,12,0,2,# _#  |`  g~  [}', this.mNukeRadius);
        this.mNovaAlpha.SetCurveLinked('b#0,1,0,1,~       1w  p#', this.mNukeRadius);
        this.mGameOverPieceScale.SetCurveLinked('b#1,2,0,1,# E# d7ae m6  P# w#', this.mNukeRadius);
        this.mGameOverPieceGlow.SetCurveLinked('b#0,1,0.004,2,# V: Yf Y] T~   b~', this.mNukeRadius);
        this.mNukeRadius.IncInValBy(0.1);
    },
    UpdateBombExplode : function Game_Board$UpdateBombExplode() {
        if(!this.mNukeRadius.IsDoingCurve()) {
            return;
        }
        var done = !this.mNukeRadius.IncInVal();
        this.mGameOverPiece.Update();
        var aKillGemRadius = this.mNovaRadius.GetOutVal() * 280.0;
        var aCenterX = this.mGameOverPiece.mX + ((Game.Board.GEM_WIDTH / 2) | 0);
        var aCenterY = this.mGameOverPiece.mY + ((Game.Board.GEM_HEIGHT / 2) | 0);
        for(var aRow = 0; aRow < this.mRowCount; aRow++) {
            for(var aCol = 0; aCol < this.mColCount; aCol++) {
                var aPiece = this.GetPieceAtRowCol(aRow, aCol);
                if((aPiece != null) && (aPiece != this.mGameOverPiece)) {
                    var aDistX = (aPiece.mX + ((Game.Board.GEM_WIDTH / 2) | 0)) - aCenterX;
                    var aDistY = (aPiece.mY + ((Game.Board.GEM_HEIGHT / 2) | 0)) - aCenterY;
                    var aDist = Math.sqrt((aDistX * aDistX + aDistY * aDistY));
                    if(aDist < aKillGemRadius) {
                        for(var i = 0; i < 8; i++) {
                            var anEffect = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.GEM_SHARD);
                            anEffect.mColor = Game.DM.gGemColors[(aPiece.mColor | 0)];
                            var aRot = i * 0.503 + ((Game.Util.Rand() % 100)) / 800.0;
                            anEffect.mX = aPiece.CX() + GameFramework.Utils.GetRandFloat() * Game.Board.GEM_WIDTH / 2;
                            anEffect.mY = aPiece.CY() + GameFramework.Utils.GetRandFloat() * Game.Board.GEM_HEIGHT / 2;
                            anEffect.mAngle = aRot;
                            anEffect.mDAngle = (0.05 * GameFramework.Utils.GetRandFloat()) * 1.67;
                            anEffect.mScale = 1.0;
                            anEffect.mAlpha = 1.0;
                            anEffect.mDecel = (0.8 + GameFramework.Utils.GetRandFloat() * 0.15);
                            var anAng = Math.atan2(aDistY, aDistX);
                            var aRatio = 1.0 * 1.67;
                            anEffect.mDX = (aRatio * 4.0 * GameFramework.Utils.GetRandFloat() + Math.cos(anAng) * 16.0) * 1.67;
                            anEffect.mDY = (aRatio * 4.0 * GameFramework.Utils.GetRandFloat() + Math.sin(anAng) * 16.0) * 1.67;
                            anEffect.mGravity = aRatio * 0.05;
                            anEffect.mValue[0] = GameFramework.Utils.GetRandFloat() * Game.MathUtil.PI_M2;
                            anEffect.mValue[1] = anEffect.mValue[0] + 0.25 * Game.MathUtil.PI_M2;
                            anEffect.mValue[2] = (GameFramework.Utils.GetRandFloat() > 0) ? 0 : 1;
                            anEffect.mValue[3] = 0.045 * (3.0 * Math.abs(GameFramework.Utils.GetRandFloat()) + 1.0);
                            anEffect.mDAlpha = (-0.005 * (4.0 * Math.abs(GameFramework.Utils.GetRandFloat()) + 2.0)) * 1.67;
                            this.mPostFXManager.AddEffect(anEffect);
                        }
                        this.DeletePiece(aPiece);
                    }
                }
            }
        }
        if(this.mNukeRadius.CheckInThreshold(1.65)) {
            this.mGameOverPiece.mFlags = 0;
            this.mPostFXManager.Clear();
            this.mDrawAll = false;
        }
        if(done) {
            this.GameOver();
        }
    },
    IncPointMult : function Game_Board$IncPointMult(thePieceFrom) {
        var aNextMult = this.mPointMultiplier + 1;
        if(!this.mTimeExpired) {
            if(this.mPointMultSoundQueue.length == 0) {
                this.mPointMultSoundDelay = 0;
            }
            this.mPointMultiplier++;
            this.mPrevPointMultAlpha.SetCurve('b+0,1,0.01,1,~###         ~####');
            if(thePieceFrom == null) {
                this.mSrcPointMultPos = new GameFramework.geom.TPoint(this.GetBoardCenterX(), 1000);
            } else {
                this.mSrcPointMultPos = new GameFramework.geom.TPoint(thePieceFrom.CX(), thePieceFrom.CY());
                if((thePieceFrom.mColor | 0) == 6) {
                    this.mSrcPointMultPos.y += -10;
                }
                if((thePieceFrom.mColor | 0) == 4) {
                    this.mSrcPointMultPos.y += 12;
                }
            }
            this.mPointMultPosPct.SetCurve('b+0,1,0.006667,1,####M&0:N uP###   OP###   Nz-xH`~P##');
            this.mPointMultTextMorph.SetConstant(0);
            this.mPointMultScale.SetCurveLinked('b+0,1.25,0,1,F### q[/8@sPXY5  d~###    U8=f}', this.mPointMultPosPct);
            this.mPointMultAlpha.SetCurveLinked('b+0,1,0,1,####     6~###    k~###', this.mPointMultPosPct);
            this.mPointMultYAdd.SetCurveLinked('b+0,-80,0,1,####     g####  7~|4(  &#;-0', this.mPointMultPosPct);
            this.mPointMultDarkenPct.SetCurveLinked('b+0,1,0,1,####     $~###    }####', this.mPointMultPosPct);
            var aMultColor = Array.Create(7, null, GameFramework.gfx.Color.RGBToInt(255, 128, 128), GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(128, 255, 128), GameFramework.gfx.Color.RGBToInt(255, 255, 128), GameFramework.gfx.Color.RGBToInt(255, 128, 255), GameFramework.gfx.Color.RGBToInt(255, 192, 128), GameFramework.gfx.Color.RGBToInt(128, 255, 255));
            if((thePieceFrom == null) || (thePieceFrom.mColor == Game.DM.EGemColor._INVALID)) {
                this.mPointMultColor = GameFramework.gfx.Color.RGBToInt(255, 255, 255);
            } else {
                this.mPointMultColor = aMultColor[(thePieceFrom.mColor | 0)];
            }
        }
        if((thePieceFrom != null) && (thePieceFrom.mColor != Game.DM.EGemColor._INVALID)) {
            this.AddPoints((thePieceFrom.CX() | 0), (thePieceFrom.CY() | 0), 1000 * aNextMult, Game.DM.gGemColors[(thePieceFrom.mColor | 0)], thePieceFrom.mMatchId, false, false, -1, false, Game.Board.EPointType.SPECIAL);
        }
        this.AddPointBreakdownSection();
        this.SubmitStats(false);
        for(var i = 0; i < (Game.DM.EStat._COUNT | 0); i++) {
            this.mLevelStats[i] = 0;
        }
    },
    Flamify : function Game_Board$Flamify(thePiece) {
        if((thePiece.mColor | 0) == -1) {
            return;
        }
        if(!thePiece.SetFlag(Game.Piece.EFlag.FLAME)) {
            return;
        }
        Game.SoundUtil.Play(Game.Resources['SOUND_POWERGEM_CREATED']);
        thePiece.ClearDisallowFlags();
        thePiece.SetFlagTo(Game.Piece.EFlag.COUNTER, false);
        thePiece.SetFlagTo(Game.Piece.EFlag.BOMB, false);
        thePiece.SetFlagTo(Game.Piece.EFlag.REALTIME_BOMB, false);
        thePiece.mImmunityCount = 25;
        var anEffect = new Game.PopAnimEffect(Game.Resources['POPANIM_FLAMEGEMCREATION']);
        anEffect.mX = thePiece.CX();
        anEffect.mY = thePiece.CY();
        anEffect.mScale = 2.0;
        anEffect.mDoubleSpeed = true;
        anEffect.Play$2('Creation_Below Gem_Horizontal');
        anEffect.Update();
        this.mPreFXManager.AddEffect(anEffect);
        anEffect = new Game.PopAnimEffect(Game.Resources['POPANIM_FLAMEGEMCREATION']);
        anEffect.mX = thePiece.CX();
        anEffect.mY = thePiece.CY();
        anEffect.mScale = 2.0;
        anEffect.mOverlay = true;
        anEffect.mDoubleSpeed = true;
        anEffect.Play$2('Creation_Above Gem');
        anEffect.Update();
        this.mPostFXManager.AddEffect(anEffect);
    },
    Hypercubeify : function Game_Board$Hypercubeify(thePiece) {
        this.HypercubeifyEx(thePiece, true);
    },
    HypercubeifyEx : function Game_Board$HypercubeifyEx(thePiece, theStartEffect) {
        if(!thePiece.CanSetFlag(Game.Piece.EFlag.HYPERCUBE)) {
            return;
        }
        thePiece.ClearFlags();
        thePiece.SetFlag(Game.Piece.EFlag.HYPERCUBE);
        thePiece.mChangedTick = this.mUpdateCnt;
        thePiece.mLastColor = thePiece.mColor;
        thePiece.mColor = Game.DM.EGemColor.HYPERCUBE;
        thePiece.mImmunityCount = 25;
        thePiece.ClearFlag(Game.Piece.EFlag.FLAME);
        if(theStartEffect) {
            this.StartHypercubeEffect(thePiece);
            if(this.WantsCalmEffects()) {
                Game.SoundUtil.PlayEx(Game.Resources['SOUND_HYPERCUBE_CREATE'], 0, 0.4);
            } else {
                Game.SoundUtil.Play(Game.Resources['SOUND_HYPERCUBE_CREATE']);
            }
        }
    },
    Laserify : function Game_Board$Laserify(thePiece) {
        if((thePiece.mColor | 0) == -1) {
            return;
        }
        if(!thePiece.SetFlag(Game.Piece.EFlag.LASER)) {
            return;
        }
        Game.SoundUtil.Play(Game.Resources['SOUND_LASERGEM_CREATED']);
        thePiece.ClearDisallowFlags();
        thePiece.SetFlagTo(Game.Piece.EFlag.COUNTER, false);
        thePiece.SetFlagTo(Game.Piece.EFlag.BOMB, false);
        thePiece.SetFlagTo(Game.Piece.EFlag.REALTIME_BOMB, false);
        thePiece.mImmunityCount = 25;
        this.StartLaserGemEffect(thePiece);
    },
    Bombify : function Game_Board$Bombify(thePiece, theCounter, realTime) {
        if(!thePiece.CanSetFlag(Game.Piece.EFlag.COUNTER) && (realTime ? thePiece.CanSetFlag(Game.Piece.EFlag.REALTIME_BOMB) : thePiece.CanSetFlag(Game.Piece.EFlag.BOMB))) {
            return;
        }
        thePiece.ClearFlags();
        thePiece.ClearDisallowFlags();
        thePiece.SetFlag(Game.Piece.EFlag.COUNTER);
        if(realTime) {
            thePiece.SetFlag(Game.Piece.EFlag.REALTIME_BOMB);
        } else {
            thePiece.SetFlag(Game.Piece.EFlag.BOMB);
        }
        thePiece.mCounter = theCounter;
        thePiece.mImmunityCount = 25;
    },
    Doomify : function Game_Board$Doomify(thePiece, theCounter) {
        if(!thePiece.CanSetFlag(Game.Piece.EFlag.DOOM) || !thePiece.CanSetFlag(Game.Piece.EFlag.COUNTER)) {
            return;
        }
        thePiece.ClearFlags();
        thePiece.ClearDisallowFlags();
        thePiece.SetFlag(Game.Piece.EFlag.DOOM);
        thePiece.SetFlag(Game.Piece.EFlag.COUNTER);
        thePiece.mColor = Game.DM.EGemColor._INVALID;
        thePiece.mCounter = theCounter;
        thePiece.mImmunityCount = 25;
    },
    Blastify : function Game_Board$Blastify(thePiece) {
        if(!thePiece.CanSetFlag(Game.Piece.EFlag.BLAST_GEM)) {
            return;
        }
        thePiece.SetFlag(Game.Piece.EFlag.BLAST_GEM);
        this.StartPieceEffect(thePiece);
    },
    StartPieceEffect : function Game_Board$StartPieceEffect(thePiece) {
        if(thePiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) {
            this.StartMultiplierGemEffect(thePiece);
        }
        if(thePiece.IsFlagSet(Game.Piece.EFlag.LASER)) {
            this.StartLaserGemEffect(thePiece);
        }
        if(thePiece.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) {
            this.StartHypercubeEffect(thePiece);
        } else if(thePiece.IsFlagSet(Game.Piece.EFlag.DETONATOR) || thePiece.IsFlagSet(Game.Piece.EFlag.SCRAMBLE)) {
            this.StartBoostGemEffect(thePiece);
        } else if(thePiece.IsFlagSet(Game.Piece.EFlag.BLAST_GEM)) {
            this.StartBlastgemEffect(thePiece);
        }
    },
    Start3DFireGemEffect : function Game_Board$Start3DFireGemEffect(thePiece) {
        var anEffect;
        anEffect = new Game.ParticleEffect(Game.Resources['PIEFFECT_FIREGEM_HYPERSPACE']);
        anEffect.SetEmitAfterTimeline(true);
        anEffect.mDoDrawTransform = true;
        anEffect.mFlags |= (Game.Effect.EFlag.HYPERSPACE_ONLY | 0);
        thePiece.BindEffect(anEffect);
        this.mPreFXManager.AddEffect(anEffect);
    },
    StartLaserGemEffect : function Game_Board$StartLaserGemEffect(thePiece) {
        var anEffect = this.NewBottomLaserEffect(thePiece.mColor);
        thePiece.BindEffect(anEffect);
        this.mPreFXManager.AddEffect(anEffect);
        anEffect = this.NewTopLaserEffect(thePiece.mColor);
        thePiece.BindEffect(anEffect);
        this.mPostFXManager.AddEffect(anEffect);
    },
    NewTopLaserEffect : function Game_Board$NewTopLaserEffect(theGemColor) {
        var anEffect;
        var aLayer;
        var anEmitter;
        anEffect = new Game.ParticleEffect(Game.Resources['PIEFFECT_STARGEM']);
        anEffect.SetEmitAfterTimeline(true);
        anEffect.mDoDrawTransform = true;
        for(var i = 0; i < 7; i++) {
            aLayer = anEffect.GetLayer(i + 1);
            if((i == (theGemColor | 0)) && (GameFramework.BaseApp.mApp.get_Is3D()) && (!Game.BejApp.mBejApp.mIsSlow)) {
                aLayer.SetVisible(true);
            } else {
                aLayer.SetVisible(false);
            }
        }
        aLayer = anEffect.GetLayer((theGemColor | 0) + 1);
        anEmitter = aLayer.GetEmitter$2('Glow');
        if(anEmitter != null) {
            anEmitter.SetVisible(false);
        }
        return anEffect;
    },
    NewBottomLaserEffect : function Game_Board$NewBottomLaserEffect(theGemColor) {
        var anEffect;
        var aLayer;
        var anEmitter;
        anEffect = new Game.ParticleEffect(Game.Resources['PIEFFECT_STARGEM']);
        anEffect.SetEmitAfterTimeline(true);
        anEffect.mDoDrawTransform = true;
        anEffect.mDoubleSpeed = true;
        for(var i = 0; i < 7; i++) {
            aLayer = anEffect.GetLayer(i + 1);
            if((i == (theGemColor | 0)) && (GameFramework.BaseApp.mApp.get_Is3D()) && (!Game.BejApp.mBejApp.mIsSlow)) {
                aLayer.SetVisible(true);
            } else {
                aLayer.SetVisible(false);
            }
        }
        anEffect.GetLayer$2('Top').SetVisible(false);
        aLayer = anEffect.GetLayer((theGemColor | 0) + 1);
        anEmitter = aLayer.GetEmitter$2('Stars');
        if(anEmitter != null) {
            anEmitter.SetVisible(false);
        }
        return anEffect;
    },
    StartMultiplierGemEffect : function Game_Board$StartMultiplierGemEffect(thePiece) {
        thePiece.mAnimCurve.SetCurve('b390,-90,0.005,1,~         ~#');
        thePiece.mAnimCurve.SetMode(GameFramework.CurvedVal.MODE_REPEAT);
        var anEffect = new Game.ParticleEffect(Game.Resources['PIEFFECT_MULTIPLIER']);
        anEffect.mPieceIdRel = thePiece.mId;
        anEffect.mDoDrawTransform = true;
        anEffect.mDoubleSpeed = true;
        anEffect.SetEmitAfterTimeline(true);
        var outlineLayer = anEffect.GetLayer$2('OUTLINE');
        var gasLayer = anEffect.GetLayer$2('Offgassing');
        for(var aColor = 0; aColor < 7; aColor++) {
            var aLayer = anEffect.GetLayer(aColor + 1);
            if(aColor == (thePiece.mColor | 0)) {
                aLayer.SetVisible(true);
            } else {
                aLayer.SetVisible(false);
            }
        }
        this.mPostFXManager.AddEffect(anEffect);
    },
    StartHypercubeEffect : function Game_Board$StartHypercubeEffect(thePiece) {
        if((!GameFramework.BaseApp.mApp.get_Is3D()) || (Game.BejApp.mBejApp.mIsSlow)) {
            return;
        }
        var anEffect = new Game.ParticleEffect(Game.Resources['PIEFFECT_HYPERCUBE']);
        anEffect.mPieceIdRel = thePiece.mId;
        anEffect.SetEmitAfterTimeline(true);
        anEffect.mDoDrawTransform = true;
        this.mPreFXManager.AddEffect(anEffect);
    },
    StartBlastgemEffect : function Game_Board$StartBlastgemEffect(thePiece) {
    },
    StartBoostGemEffect : function Game_Board$StartBoostGemEffect(thePiece) {
    },
    GetSelectedPiece : function Game_Board$GetSelectedPiece() {
        for(var aPieceIter = new Game.PieceIter(this); aPieceIter.Next();) {
            var aPiece = aPieceIter.GetPiece();
            if(aPiece != null && aPiece.mSelected) {
                return aPiece;
            }
        }
        return null;
    },
    GetNewGemColors : function Game_Board$GetNewGemColors() {
        var ret = this.mNewGemColors;
        for(var i = 0; i < (this.mFavorGemColors.length | 0); i++) {
            ret.push(this.mFavorGemColors[i]);
        }
        return ret;
    },
    CreateNewPiece : function Game_Board$CreateNewPiece(theRow, theCol) {
        var aPiece = new Game.Piece(this);
        aPiece.mCreatedTick = this.mUpdateCnt;
        aPiece.mLastActiveTick = this.mUpdateCnt;
        aPiece.mCol = theCol;
        aPiece.mRow = theRow;
        aPiece.mIsPieceStill = false;
        aPiece.mX = this.GetColX(theCol);
        aPiece.mY = this.GetRowY(theRow);
        JS_Assert(this.mBoard[this.mBoard.mIdxMult0 * (theRow) + theCol] == null);
        this.mBoard[this.mBoard.mIdxMult0 * (theRow) + theCol] = aPiece;
        return aPiece;
    },
    IsTurnBased : function Game_Board$IsTurnBased() {
        return false;
    },
    WantPointComplements : function Game_Board$WantPointComplements() {
        return true;
    },
    IsHypermixerCancelledBy : function Game_Board$IsHypermixerCancelledBy(thePiece) {
        return thePiece.IsFlagSet(Game.Piece.EFlag.HYPERCUBE);
    },
    GetColX : function Game_Board$GetColX(theCol) {
        return theCol * Game.Board.GEM_WIDTH;
    },
    GetRowY : function Game_Board$GetRowY(theRow) {
        return theRow * Game.Board.GEM_HEIGHT;
    },
    GetColScreenX : function Game_Board$GetColScreenX(theCol) {
        return this.GetColX(theCol) + this.GetBoardX();
    },
    GetRowScreenY : function Game_Board$GetRowScreenY(theRow) {
        return this.GetRowY(theRow) + this.GetBoardY();
    },
    GetColAt : function Game_Board$GetColAt(theX) {
        for(var aCol = 0; aCol < this.mColCount; aCol++) {
            var aColX = this.GetColX(aCol);
            if((theX >= aColX) && (theX < aColX + Game.Board.GEM_WIDTH)) {
                return aCol;
            }
        }
        return -1;
    },
    GetRowAt : function Game_Board$GetRowAt(theY) {
        for(var aRow = 0; aRow < this.mRowCount; aRow++) {
            var aRowY = this.GetRowY(aRow);
            if((theY >= aRowY) && (theY < aRowY + Game.Board.GEM_HEIGHT)) {
                return aRow;
            }
        }
        return -1;
    },
    GetBoardX : function Game_Board$GetBoardX() {
        return this.mBoardX;
    },
    GetBoardY : function Game_Board$GetBoardY() {
        return this.mBoardY;
    },
    GetBoardCenterX : function Game_Board$GetBoardCenterX() {
        return this.GetBoardX() + ((Game.Board.GEM_WIDTH * this.mColCount / 2) | 0);
    },
    GetBoardCenterY : function Game_Board$GetBoardCenterY() {
        return this.GetBoardY() + ((Game.Board.GEM_HEIGHT * this.mRowCount / 2) | 0);
    },
    GetAlpha : function Game_Board$GetAlpha() {
        return this.mAlpha.GetOutVal();
    },
    GetBoardAlpha : function Game_Board$GetBoardAlpha() {
        return this.GetAlpha();
    },
    GetPieceAlpha : function Game_Board$GetPieceAlpha() {
        return (1.0 - (this.mBoardHidePct)) * this.GetBoardAlpha();
    },
    GetPieceAtRowCol : function Game_Board$GetPieceAtRowCol(theRow, theCol) {
        return this.GetPieceAtColRow(theCol, theRow);
    },
    GetPieceAtColRow : function Game_Board$GetPieceAtColRow(theCol, theRow) {
        if((theRow < 0) || (theRow >= this.mRowCount) || (theCol < 0) || (theCol >= this.mColCount)) {
            return null;
        }
        return this.mBoard[this.mBoard.mIdxMult0 * (theRow) + theCol];
    },
    GetPieceAtXY : function Game_Board$GetPieceAtXY(theX, theY) {

        {
            var $srcArray7 = this.mBoard;
            for(var $enum7 = 0; $enum7 < $srcArray7.length; $enum7++) {
                var aPiece = $srcArray7[$enum7];
                if(aPiece != null && (theX >= aPiece.mX) && (theY >= aPiece.mY) && (theX < aPiece.mX + Game.Board.GEM_WIDTH) && (theY < aPiece.mY + Game.Board.GEM_WIDTH)) {
                    return aPiece;
                }
            }
        }
        return null;
    },
    GetPieceAtScreenXY : function Game_Board$GetPieceAtScreenXY(theX, theY) {
        return this.GetPieceAtXY(theX - this.GetBoardX(), theY - this.GetBoardY());
    },
    GetPieceById : function Game_Board$GetPieceById(theId) {
        if(theId == -1) {
            return null;
        }
        return this.mPieceMap[theId];
    },
    GetRandomPieceOnGrid : function Game_Board$GetRandomPieceOnGrid() {
        var aPieceList = [];

        {
            var $srcArray8 = this.mBoard;
            for(var $enum8 = 0; $enum8 < $srcArray8.length; $enum8++) {
                var aPiece = $srcArray8[$enum8];
                if(aPiece != null) {
                    aPieceList.push(aPiece);
                }
            }
        }
        if(aPieceList.length > 0) {
            return aPieceList[((this.mRand.Next() % aPieceList.length) | 0)];
        } else {
            return null;
        }
    },
    DeletePiece : function Game_Board$DeletePiece(thePiece) {
        this.TallyPiece(thePiece, true);
        for(var i = 0; i < (this.mSwapDataVector.length | 0);) {
            var aSwapData = this.mSwapDataVector[i];
            if((aSwapData.mPiece1 == thePiece) || (aSwapData.mPiece2 == thePiece)) {
                if(aSwapData.mSwapPct.get_v() < 0.0 && aSwapData.mPiece1 != null && aSwapData.mPiece2 != null) {
                    var tmp = aSwapData.mPiece1.mCol;
                    aSwapData.mPiece1.mCol = aSwapData.mPiece2.mCol;
                    aSwapData.mPiece2.mCol = tmp;
                    tmp = aSwapData.mPiece1.mRow;
                    aSwapData.mPiece1.mRow = aSwapData.mPiece2.mRow;
                    aSwapData.mPiece2.mRow = tmp;
                    var tmpPiece = this.mBoard[this.mBoard.mIdxMult0 * (aSwapData.mPiece1.mRow) + aSwapData.mPiece1.mCol];
                    this.mBoard[this.mBoard.mIdxMult0 * (aSwapData.mPiece1.mRow) + aSwapData.mPiece1.mCol] = this.mBoard[this.mBoard.mIdxMult0 * (aSwapData.mPiece2.mRow) + aSwapData.mPiece2.mCol];
                    this.mBoard[this.mBoard.mIdxMult0 * (aSwapData.mPiece2.mRow) + aSwapData.mPiece2.mCol] = tmpPiece;
                }
                if(aSwapData.mPiece1 != null) {
                    aSwapData.mPiece1.mX = this.GetColX(aSwapData.mPiece1.mCol);
                    aSwapData.mPiece1.mY = this.GetRowY(aSwapData.mPiece1.mRow);
                    aSwapData.mPiece1 = null;
                }
                if(aSwapData.mPiece2 != null) {
                    aSwapData.mPiece2.mX = this.GetColX(aSwapData.mPiece2.mCol);
                    aSwapData.mPiece2.mY = this.GetRowY(aSwapData.mPiece2.mRow);
                    aSwapData.mPiece2 = null;
                }
                this.mSwapDataVector.removeAt(i);
            } else {
                ++i;
            }
        }
        for(var aRow = 0; aRow < thePiece.mRow; aRow++) {
            var aFallPiece = this.mBoard[this.mBoard.mIdxMult0 * (aRow) + thePiece.mCol];
            if(aFallPiece != null) {
                this.SetMoveCredit(aFallPiece, thePiece.mMoveCreditId);
            }
        }
        this.mNextColumnCredit[thePiece.mCol] = (Math.max(this.mNextColumnCredit[thePiece.mCol], thePiece.mMoveCreditId) | 0);
        this.mBoard[this.mBoard.mIdxMult0 * (thePiece.mRow) + thePiece.mCol] = null;
        thePiece.Dispose();
    },
    ClearAllPieces : function Game_Board$ClearAllPieces() {
        for(var aPieceIter = new Game.PieceIter(this); aPieceIter.Next();) {
            var aPiece = aPieceIter.GetPiece();
            if(aPiece != null) {
                this.mBoard[this.mBoard.mIdxMult0 * (aPieceIter.GetRow()) + aPieceIter.GetCol()] = null;
                aPiece.Dispose();
                aPiece = null;
            }
        }
        this.mSwapDataVector = [];
    },
    AddToPieceMap : function Game_Board$AddToPieceMap(theId, thePiece) {
        JS_Assert(this.mPieceMap[theId] == null);
        this.mPieceMap[theId] = thePiece;
    },
    RemoveFromPieceMap : function Game_Board$RemoveFromPieceMap(theId) {
        delete this.mPieceMap[theId];
    },
    IsPieceSwappingIncludeIgnored : function Game_Board$IsPieceSwappingIncludeIgnored(thePiece, includeIgnored) {
        return this.IsPieceSwappingEx(thePiece, includeIgnored, false);
    },
    IsPieceSwapping : function Game_Board$IsPieceSwapping(thePiece) {
        if(this.mSwapDataVector.length == 0) {
            return false;
        }
        return this.IsPieceSwappingEx(thePiece, false, false);
    },
    IsPieceSwappingEx : function Game_Board$IsPieceSwappingEx(thePiece, includeIgnored, onlyCheckForwardSwaps) {
        for(var i = 0; i < (this.mSwapDataVector.length | 0); i++) {
            if((!this.mSwapDataVector[i].mIgnore || includeIgnored) && ((this.mSwapDataVector[i].mForwardSwap && (this.mSwapDataVector[i].mHoldingSwap == 0)) || !onlyCheckForwardSwaps) && ((this.mSwapDataVector[i].mPiece1 == thePiece) || (this.mSwapDataVector[i].mPiece2 == thePiece))) {
                return true;
            }
        }
        return false;
    },
    IsPieceMatching : function Game_Board$IsPieceMatching(thePiece) {
        return thePiece.IsShrinking();
    },
    IsPieceStill : function Game_Board$IsPieceStill(thePiece) {
        return (thePiece.mFallVelocity == 0) && (!thePiece.mDestPct.IsDoingCurve()) && (this.GetRowY(thePiece.mRow) == thePiece.mY) && (!this.IsPieceMatching(thePiece)) && (!this.IsPieceSwapping(thePiece)) && (thePiece.mCanMatch || thePiece.IsFlagSet(Game.Piece.EFlag.DIG)) && (thePiece.mExplodeDelay == 0.0) && (thePiece.mDestPct.get_v() == 0.0) && (!thePiece.IsFlagSet(Game.Piece.EFlag.MYSTERY));
    },
    WillPieceBeStill : function Game_Board$WillPieceBeStill(thePiece) {
        return (!this.IsPieceMatching(thePiece)) && (!this.IsPieceSwappingEx(thePiece, false, true)) && (thePiece.mCanMatch) && (thePiece.mExplodeDelay == 0) && (thePiece.mDestPct.get_v() == 0) && (!thePiece.IsFlagSet(Game.Piece.EFlag.MYSTERY));
    },
    CanBakeShadow : function Game_Board$CanBakeShadow(thePiece) {
        return (!this.IsPieceSwapping(thePiece)) && (thePiece.mRotPct == 0.0) && (!thePiece.IsFlagSet(Game.Piece.EFlag.FLAME)) && (!thePiece.IsFlagSet(Game.Piece.EFlag.LASER)) && (!thePiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER) && (!thePiece.IsFlagSet(Game.Piece.EFlag.DETONATOR)) && (!thePiece.IsFlagSet(Game.Piece.EFlag.SCRAMBLE)));
    },
    IsBoardStill : function Game_Board$IsBoardStill() {
        if(this.mSettlingDelay != 0) {
            return false;
        }

        {
            var $srcArray9 = this.mBoard;
            for(var $enum9 = 0; $enum9 < $srcArray9.length; $enum9++) {
                var aPiece = $srcArray9[$enum9];
                if(aPiece != null && !aPiece.mIsPieceStill) {
                    return false;
                }
            }
        }
        if(this.HasSet()) {
            return false;
        }
        if(this.mLightningStorms.length != 0) {
            return false;
        }
        if(!this.mHasBoardSettled) {
            this.mHasBoardSettled = true;
            this.BoardSettled();
        }
        return true;
    },
    IsGameIdle : function Game_Board$IsGameIdle() {
        if(this.mSettlingDelay != 0) {
            return false;
        }

        {
            var $srcArray10 = this.mBoard;
            for(var $enum10 = 0; $enum10 < $srcArray10.length; $enum10++) {
                var aPiece = $srcArray10[$enum10];
                if(aPiece != null && !aPiece.mIsPieceStill && !this.IsPieceSwapping(aPiece)) {
                    return false;
                }
            }
        }
        if(this.HasSet()) {
            return false;
        }
        if(this.mLightningStorms.length != 0) {
            return false;
        }
        if(this.mScrambleDelayTicks != 0) {
            return false;
        }
        return true;
    },
    DoHypercubeColor : function Game_Board$DoHypercubeColor(thePiece, theColor) {
        if(theColor == Game.DM.EGemColor._INVALID) {
            this.AddToStatCred(Game.DM.EStat.HYPERCUBE_ANNIHILATION, 1, thePiece.mMoveCreditId);
        }
        this.AddToStatCred(Game.DM.EStat.HYPERCUBES_USED, 1, thePiece.mMoveCreditId);
        this.ComboProcess(theColor);
        thePiece.mDestructing = true;
        var aLightningStorm = new Game.LightningStorm(this, thePiece, Game.LightningStorm.EStormType.HYPERCUBE);
        aLightningStorm.mColor = theColor;
        this.mLightningStorms.push(aLightningStorm);
    },
    DoHypercube : function Game_Board$DoHypercube(thePiece, theSwappedPiece) {
        this.DoHypercubeColor(thePiece, theSwappedPiece.mColor);
        Game.SoundUtil.Play(Game.Resources['SOUND_ELECTRO_PATH']);
        var aLightningStorm = this.mLightningStorms[this.mLightningStorms.length - 1];
        aLightningStorm.AddLightning((thePiece.mX | 0) + ((Game.Board.GEM_WIDTH / 2) | 0), (thePiece.mY | 0) + ((Game.Board.GEM_HEIGHT / 2) | 0), (theSwappedPiece.mX | 0) + ((Game.Board.GEM_WIDTH / 2) | 0), (theSwappedPiece.mY | 0) + ((Game.Board.GEM_HEIGHT / 2) | 0));
    },
    ExamineBoard : function Game_Board$ExamineBoard() {
    },
    WantSpecialPiece : function Game_Board$WantSpecialPiece(thePieceVector) {
        return false;
    },
    DropSpecialPiece : function Game_Board$DropSpecialPiece(thePieceVector) {
        return false;
    },
    TryingDroppedPieces : function Game_Board$TryingDroppedPieces(thePieceVector, theTryCount) {
        return true;
    },
    PiecesDropped : function Game_Board$PiecesDropped(thePieceVector) {
        return true;
    },
    NumPiecesWithFlag : function Game_Board$NumPiecesWithFlag(theFlag) {
        var aNum = 0;

        {
            var $srcArray11 = this.mBoard;
            for(var $enum11 = 0; $enum11 < $srcArray11.length; $enum11++) {
                var aPiece = $srcArray11[$enum11];
                if((aPiece != null) && aPiece.IsFlagSet(theFlag)) {
                    aNum++;
                }
            }
        }
        return aNum;
    },
    CanTimeUp : function Game_Board$CanTimeUp() {
        return this.mIsBoardStill;
    },
    GetTicksLeft : function Game_Board$GetTicksLeft() {
        var aTimeLimit = this.GetTimeLimit();
        if(aTimeLimit == 0) {
            return -1;
        }
        var anAmnesty = 250;
        var aTicksLeft = (Math.min(aTimeLimit * 60, Math.max(0, (aTimeLimit * 60) - Math.max(0, this.mGameTicks - anAmnesty))) | 0);
        return aTicksLeft;
    },
    GetLevelPct : function Game_Board$GetLevelPct() {
        var aLevelPoints = this.GetLevelPoints();
        var aLevelPct;
        var writeTicksLeft = (this.mUpdateCnt % 20) == 0;
        if(aLevelPoints != 0) {
            aLevelPct = Math.min(1.0, this.GetLevelPointsTotal() / aLevelPoints);
        } else {
            aLevelPct = 0.0;
        }
        return aLevelPct;
    },
    GetCountdownPct : function Game_Board$GetCountdownPct() {
        var aTimeLimit = this.GetTimeLimit();
        var aCountdownPct;
        var writeTicksLeft = (this.mUpdateCnt % 20) == 0;
        aCountdownPct = Math.max(0.0, this.GetTicksLeft() / (aTimeLimit * 60.0));
        this.CheckCountdownBar();
        var aTicksLeft = this.GetTicksLeft();
        var aTimeBetweenWarnings = 35 + ((aTicksLeft * 0.1) | 0);
        if((this.mUpdateCnt - this.mLastWarningTick >= aTimeBetweenWarnings) && (aTicksLeft > 0) && (this.WantWarningGlow())) {
            var aWarningStartTick = (this.GetTimeLimit() > 60) ? 1500 : 1000;
            Game.SoundUtil.Play(Game.Resources['SOUND_COUNTDOWN_WARNING']);
            this.mLastWarningTick = this.mUpdateCnt;
        }
        if((aTicksLeft == 30 * 60) && (this.mLevelCompleteCount == 0)) {
            if(this.mDoThirtySecondVoice) {
                writeTicksLeft = true;
                this.mDoThirtySecondVoice = false;
                Game.SoundUtil.Play(Game.Resources['SOUND_VOICE_THIRTYSECONDS']);
            }
        } else {
            this.mDoThirtySecondVoice = true;
        }
        return aCountdownPct;
    },
    SwapSucceeded : function Game_Board$SwapSucceeded(theSwapData) {
    },
    SwapFailed : function Game_Board$SwapFailed(theSwapData) {
    },
    IsSwapLegal : function Game_Board$IsSwapLegal(theSelected, theSwappedRow, theSwappedCol) {
        if(this.mLightningStorms.length != 0) {
            return false;
        }
        if(!theSelected.mCanSwap) {
            return false;
        }
        var aSwappedPiece = this.GetPieceAtRowCol(theSwappedRow, theSwappedCol);
        if((!this.IsPieceStill(theSelected)) || (theSelected.IsFlagSet(Game.Piece.EFlag.DOOM))) {
            return false;
        }
        if(aSwappedPiece != null) {
            if(!aSwappedPiece.mCanSwap || !this.IsPieceStill(aSwappedPiece) || aSwappedPiece.IsFlagSet(Game.Piece.EFlag.DOOM)) {
                return false;
            }
        }
        if(this.mDeferredTutorialVector.length > 0) {
            return false;
        }
        var aDirX = theSwappedCol - theSelected.mCol;
        var aDirY = theSwappedRow - theSelected.mRow;
        if(((theSelected.IsButton()) && (Math.abs(aDirX) + Math.abs(aDirY) != 0)) || ((!theSelected.IsButton()) && (Math.abs(aDirX) + Math.abs(aDirY) != 1))) {
            return false;
        }
        return true;
    },
    QueueSwap : function Game_Board$QueueSwap(theSelected, theSwappedRow, theSwappedCol, forceSwap, playerSwapped, destroyTarget, dragSwap) {
        if(forceSwap === undefined) {
            forceSwap = false;
        }
        if(playerSwapped === undefined) {
            playerSwapped = true;
        }
        if(destroyTarget === undefined) {
            destroyTarget = false;
        }
        if(dragSwap === undefined) {
            dragSwap = false;
        }
        if(!this.IsSwapLegal(theSelected, theSwappedRow, theSwappedCol)) {
            return false;
        }
        var aSwappedPiece = this.GetPieceAtRowCol(theSwappedRow, theSwappedCol);
        var aQueuedMove = new Game.QueuedMove();
        aQueuedMove.mUpdateCnt = this.mUpdateCnt;
        aQueuedMove.mSelectedId = theSelected.mId;
        aQueuedMove.mSwappedRow = theSwappedRow;
        aQueuedMove.mSwappedCol = theSwappedCol;
        aQueuedMove.mForceSwap = forceSwap;
        aQueuedMove.mPlayerSwapped = playerSwapped;
        aQueuedMove.mDestroyTarget = destroyTarget;
        aQueuedMove.mDragSwap = dragSwap;
        this.mQueuedMoveVector.push(aQueuedMove);
        return true;
    },
    TrySwap : function Game_Board$TrySwap(theSelected, theSwappedRow, theSwappedCol, isDragSwap) {
        return this.TrySwapEx(theSelected, theSwappedRow, theSwappedCol, false, true, false, isDragSwap);
    },
    TrySwapEx : function Game_Board$TrySwapEx(theSelected, theSwappedRow, theSwappedCol, forceSwap, playerSwapped, destroyTarget, isDragSwap) {
        if(theSelected == null) {
            return false;
        }
        if(theSwappedRow < 0 || theSwappedRow >= this.mRowCount || theSwappedCol < 0 || theSwappedCol >= this.mColCount) {
            return false;
        }
        if(!this.IsSwapLegal(theSelected, theSwappedRow, theSwappedCol)) {
            return false;
        }
        if(playerSwapped) {
            this.mLastPlayerSwapColor = theSelected.mColor;
        }
        this.mLastMoveTicks = 0;
        var aDirX = theSwappedCol - theSelected.mCol;
        var aDirY = theSwappedRow - theSelected.mRow;
        if(playerSwapped) {
            theSelected.mSelected = false;
            theSelected.mSelectorAlpha.SetCurve('b+0,1,0.066667,1,~###         ~#@yd');
        }
        var aCurMoveCreditId = this.mCurMoveCreditId;
        this.PushMoveData(theSelected, theSwappedRow, theSwappedCol, isDragSwap);
        var aSwappedPiece = this.GetPieceAtRowCol(theSwappedRow, theSwappedCol);
        theSelected.mMoveCreditId = aCurMoveCreditId;
        if(aSwappedPiece != null) {
            aSwappedPiece.mMoveCreditId = aCurMoveCreditId;
        }
        if(theSelected.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) {
            if(aSwappedPiece != null) {
                if(!aSwappedPiece.mCanDestroy) {
                    return false;
                }
                this.mWantHintTicks = 0;
                this.DecrementAllCounterGems(false);
                this.DoHypercube(theSelected, aSwappedPiece);
                return true;
            }
        }
        if(aSwappedPiece != null && aSwappedPiece.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) {
            if(aSwappedPiece != null) {
                if(!theSelected.mCanDestroy) {
                    return false;
                }
                this.mWantHintTicks = 0;
                this.DecrementAllCounterGems(false);
                this.DoHypercube(aSwappedPiece, theSelected);
                return true;
            }
        }
        if(playerSwapped) {
            Game.SoundUtil.Play(Game.Resources['SOUND_START_ROTATE']);
        }
        theSelected.mLastActiveTick = this.mUpdateCnt;
        if(aSwappedPiece != null) {
            aSwappedPiece.mLastActiveTick = this.mUpdateCnt - 1;
        }
        if(theSelected != null) {
            theSelected.mIsPieceStill = false;
        }
        if(aSwappedPiece != null) {
            aSwappedPiece.mIsPieceStill = false;
        }
        this.mIsBoardStill = false;
        var aSwapData = new Game.SwapData();
        aSwapData.mPiece1 = theSelected;
        aSwapData.mPiece2 = aSwappedPiece;
        aSwapData.mSwapDir = new GameFramework.geom.TIntPoint(theSwappedCol - theSelected.mCol, theSwappedRow - theSelected.mRow);
        aSwapData.mSwapPct.SetCurve('b+-1,1,0.033333,1,~x:*    }Ppt+     $#LPR');
        aSwapData.mGemScale.SetCurve('b+-0.075,0.075,0.033333,1,P&X%     \'~###    zPL=I');
        aSwapData.mSwapPct.mIncRate *= this.GetSwapSpeed();
        aSwapData.mGemScale.mIncRate *= this.GetSwapSpeed();
        aSwapData.mForwardSwap = true;
        aSwapData.mHoldingSwap = 0;
        aSwapData.mIgnore = false;
        aSwapData.mForceSwap = forceSwap;
        aSwapData.mDestroyTarget = destroyTarget;
        aSwapData.mDragSwap = isDragSwap;
        this.mSwapDataVector.push(aSwapData);
        return true;
    },
    PushMoveData : function Game_Board$PushMoveData(theSelected, theSwappedRow, theSwappedCol, isDragSwap) {
        var aMoveData = new Game.MoveData();
        aMoveData.mUpdateCnt = this.mUpdateCnt;
        aMoveData.mSelectedId = theSelected.mId;
        aMoveData.mSwappedRow = theSwappedRow;
        aMoveData.mSwappedCol = theSwappedCol;
        aMoveData.mMoveCreditId = this.mCurMoveCreditId++;
        aMoveData.mStats = [];
        ;
        for(var i = 0; i < (Game.DM.EStat._COUNT | 0); i++) {
            aMoveData.mStats.push(0);
        }
        this.mMoveDataVector.push(aMoveData);
    },
    SwapPieceLocations : function Game_Board$SwapPieceLocations(thePieceA, thePieceB, theIncludeXY) {
        var tmp = thePieceA.mRow;
        thePieceA.mRow = thePieceB.mRow;
        thePieceB.mRow = tmp;
        tmp = thePieceA.mCol;
        thePieceA.mCol = thePieceB.mCol;
        thePieceB.mCol = tmp;
        var tmpP = this.mBoard[this.mBoard.mIdxMult0 * (thePieceA.mRow) + thePieceA.mCol];
        this.mBoard[this.mBoard.mIdxMult0 * (thePieceA.mRow) + thePieceA.mCol] = this.mBoard[this.mBoard.mIdxMult0 * (thePieceB.mRow) + thePieceB.mCol];
        this.mBoard[this.mBoard.mIdxMult0 * (thePieceB.mRow) + thePieceB.mCol] = tmpP;
        if(theIncludeXY) {
            var tmpF = thePieceA.mX;
            thePieceA.mX = thePieceB.mX;
            thePieceB.mX = tmpF;
            tmpF = thePieceA.mY;
            thePieceA.mY = thePieceB.mY;
            thePieceB.mY = tmpF;
        }
    },
    TrySwapAndRecordForce : function Game_Board$TrySwapAndRecordForce(theSelected, theSwappedRow, theSwappedCol, forceSwap, dragSwap) {
        return this.TrySwapAndRecordEx(theSelected, theSwappedRow, theSwappedCol, forceSwap, true, dragSwap);
    },
    TrySwapAndRecord : function Game_Board$TrySwapAndRecord(theSelected, theSwappedRow, theSwappedCol, dragSwap) {
        return this.TrySwapAndRecordEx(theSelected, theSwappedRow, theSwappedCol, false, true, dragSwap);
    },
    TrySwapAndRecordEx : function Game_Board$TrySwapAndRecordEx(theSelected, theSwappedRow, theSwappedCol, forceSwap, playerSwapped, dragSwap) {
        if(this.TrySwapEx(theSelected, theSwappedRow, theSwappedCol, forceSwap, playerSwapped, false, dragSwap)) {
            return true;
        }
        return false;
    },
    PieceDestroyedInSwap : function Game_Board$PieceDestroyedInSwap(thePiece) {
    },
    BumpColumn : function Game_Board$BumpColumn(thePiece, thePower) {
        var aNewVel = 0.0;
        for(var aRow = 7; aRow >= 0; aRow--) {
            var aLastCheckVal = 0.0;
            for(var aCol = thePiece.mCol; aCol <= thePiece.mCol; aCol++) {
                var aPiece = this.GetPieceAtRowCol(aRow, aCol);
                if(aPiece != null && aPiece.mY < thePiece.mY) {
                    var aDist = Math.abs(aPiece.mY - thePiece.mY);
                    var aRatio = Math.min(1.0, aDist / Game.Board.BumpColumn_MAX_DIST);
                    aRatio = 1.0 - aRatio;
                    aLastCheckVal = thePower * -3.75 * aRatio;
                    if(aLastCheckVal > -0.9 && aLastCheckVal < 0) {
                        aLastCheckVal = 0;
                    }
                    if(aNewVel == 0) {
                        aNewVel = aLastCheckVal;
                    }
                    aPiece.mFallVelocity = Math.min(aPiece.mFallVelocity, aNewVel);
                    aPiece.mIsPieceStill = false;
                }
                this.mBumpVelocities[aCol] = Math.max(aNewVel, aLastCheckVal);
            }
        }
    },
    BumpColumns : function Game_Board$BumpColumns(theX, theY, thePower) {
        for(var aCol = 0; aCol < this.mColCount; aCol++) {
            var aNewVel = 0.0;
            var aLastCheckVal = 0.0;
            var aFirstBumpedPiece = null;
            for(var aRow = this.mRowCount - 1; aRow >= -1; aRow--) {
                var aPiece = this.GetPieceAtRowCol(aRow, aCol);
                var aDX;
                var aDY;
                var setPiece = false;
                if(aPiece != null && aPiece.GetScreenY() + ((Game.Board.GEM_HEIGHT / 2) | 0) < theY) {
                    aDX = (aPiece.GetScreenX() + ((Game.Board.GEM_WIDTH / 2) | 0)) - theX;
                    aDY = (aPiece.GetScreenY() + ((Game.Board.GEM_HEIGHT / 2) | 0)) - theY;
                    setPiece = true;
                } else if(aRow == -1) {
                    aDX = (this.GetColScreenX(aCol) + ((Game.Board.GEM_WIDTH / 2) | 0)) - theX;
                    aDY = (this.GetRowScreenY(aRow) + ((Game.Board.GEM_HEIGHT / 2) | 0)) - theY;
                } else {
                    continue;
                }
                var anAngle = Math.atan2(aDY, aDX);
                var aGemDist = Math.sqrt(aDX * aDX + aDY * aDY) / Game.Board.GEM_WIDTH;
                var aForce = (thePower / ((Math.max(0, aGemDist - 1.0)) + 1.0)) * Math.abs(Math.sin(anAngle));
                aLastCheckVal = aForce * -5.25;
                if(aLastCheckVal > -0.9 && aLastCheckVal < 0) {
                    aLastCheckVal = 0;
                }
                if(setPiece) {
                    if(aNewVel == 0) {
                        aNewVel = aLastCheckVal;
                    }
                    aPiece.mFallVelocity = Math.min(aPiece.mFallVelocity, aNewVel);
                    aPiece.mIsPieceStill = false;
                    if(this.IsPieceSwapping(aPiece)) {
                        aFirstBumpedPiece = null;
                        for(var aChangeRow = aRow; aChangeRow < this.mRowCount; aChangeRow++) {
                            var aChangePiece = this.mBoard[this.mBoard.mIdxMult0 * (aChangeRow) + aCol];
                            if(aChangePiece != null) {
                                aChangePiece.mFallVelocity = Math.max(0, aChangePiece.mFallVelocity);
                            }
                        }
                    } else {
                        if(aFirstBumpedPiece == null) {
                            aFirstBumpedPiece = aPiece;
                        }
                    }
                }
            }
            this.mBumpVelocities[aCol] = Math.min(aNewVel, aLastCheckVal);
        }
    },
    CelDestroyedBySpecial : function Game_Board$CelDestroyedBySpecial(theCol, theRow) {
    },
    UpdateLightning : function Game_Board$UpdateLightning() {
        var aCandidatePieces = [];
        var wantsCalm = this.WantsCalmEffects();
        var doDelete;
        var aTotalLightningPieces = 0;

        {
            var $srcArray12 = this.mBoard;
            for(var $enum12 = 0; $enum12 < $srcArray12.length; $enum12++) {
                var aPiece = $srcArray12[$enum12];
                if(aPiece != null && aPiece.mIsElectrocuting) {
                    aTotalLightningPieces++;
                }
            }
        }
        var aWantDelay = 0;
        this.mBoardDarken = Math.max(this.mBoardDarken - 0.02 * 1.67, 0.0);
        if(this.mLightningStorms.length > 0) {
            this.mBoardDarken = Math.min(this.mBoardDarken + 0.05 * 1.67, 1.0);
        }
        for(var aStormIdx = 0; aStormIdx < (this.mLightningStorms.length | 0); aStormIdx++) {
            var anInfo = this.mLightningStorms[aStormIdx];
            anInfo.Update();
            doDelete = false;
            switch(anInfo.mStormType) {
                case Game.LightningStorm.EStormType.HORZ:
                case Game.LightningStorm.EStormType.VERT:
                case Game.LightningStorm.EStormType.BOTH:
                case Game.LightningStorm.EStormType.SHORT:
                case Game.LightningStorm.EStormType.STAR:
                case Game.LightningStorm.EStormType.SCREEN:
                case Game.LightningStorm.EStormType.FLAMING:
                {
                    var aSpread = (anInfo.mStormType == Game.LightningStorm.EStormType.FLAMING) ? 1 : 0;
                    var stormover = true;
                    for(var i = 1; i < anInfo.mPieceIds.length;) {
                        var aSubPiece = this.GetPieceById(anInfo.mPieceIds[i]);
                        if(aSubPiece != null) {
                            if(aSubPiece.mCanDestroy) {
                                if(wantsCalm) {
                                    aSubPiece.mElectrocutePercent += 0.01 * 1.67;
                                } else {
                                    aSubPiece.mElectrocutePercent += 0.015 * 1.67;
                                }
                                if(aSubPiece.mElectrocutePercent >= 1.0) {
                                    var aSrcPiece = this.GetPieceById(anInfo.mElectrocuterId);
                                    if(!aSubPiece.mDestructing) {
                                        this.SetMoveCredit(aSubPiece, anInfo.mMoveCreditId);
                                        aSubPiece.mMatchId = anInfo.mMatchId;
                                        aSubPiece.mExplodeSourceId = anInfo.mElectrocuterId;
                                        aSubPiece.mExplodeSourceFlags |= anInfo.mStartPieceFlags;
                                        if(aSubPiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) {
                                            aSubPiece.mExplodeDelay = 3;
                                        } else if((!this.TriggerSpecialEx(aSubPiece, aSrcPiece)) && (!aSubPiece.mDestructing)) {
                                            aSubPiece.mExplodeDelay = 1;
                                        }
                                        aSubPiece.mIsPieceStill = false;
                                    }
                                    anInfo.mPieceIds.removeAt(i);
                                    continue;
                                } else {
                                    stormover = false;
                                }
                            }
                        }
                        ++i;
                    }
                    for(var i_2 = 0; i_2 < anInfo.mElectrocutedCelVector.length;) {
                        var anElectrocuteCel = anInfo.mElectrocutedCelVector[i_2];
                        if(wantsCalm) {
                            anElectrocuteCel.mElectrocutePercent += 0.01 * 1.67;
                        } else {
                            anElectrocuteCel.mElectrocutePercent += 0.015 * 1.67;
                        }
                        if(anElectrocuteCel.mElectrocutePercent >= 1.0) {
                            this.CelDestroyedBySpecial(anElectrocuteCel.mCol, anElectrocuteCel.mRow);
                            anInfo.mElectrocutedCelVector.removeAt(i_2);
                            continue;
                        }
                        ++i_2;
                    }
                    anInfo.mTimer -= 0.01 * 1.67;
                    if(anInfo.mTimer <= 0) {
                        if(wantsCalm) {
                            anInfo.mTimer = 0.15 * 1.67;
                        } else {
                            anInfo.mTimer = 0.1 * 1.67;
                        }
                        var offsets = Array.Create2D(8, 2, 0, 1, 0, -1, 0, 0, 1, 0, -1, -1, -1, -1, 1, 1, -1, 1, 1);
                        var anOffsetStart = 0;
                        var anOffsetEnd = 4;
                        if(anInfo.mStormType == Game.LightningStorm.EStormType.HORZ) {
                            anOffsetEnd = 2;
                        }
                        if(anInfo.mStormType == Game.LightningStorm.EStormType.VERT) {
                            anOffsetStart = 2;
                        }
                        if(anInfo.mStormType == Game.LightningStorm.EStormType.STAR) {
                            anOffsetEnd = 8;
                        }
                        if(anInfo.mStormType == Game.LightningStorm.EStormType.SCREEN) {
                            var aDist = (Math.min(anInfo.mDist, 7) | 0);
                            var anIdx = 0;
                            for(var aHorz = -aDist; aHorz <= aDist; aHorz++) {
                                offsets[offsets.mIdxMult0 * (anIdx) + 0] = aHorz;
                                offsets[offsets.mIdxMult0 * (anIdx++) + 1] = -aDist;
                                offsets[offsets.mIdxMult0 * (anIdx) + 0] = aHorz;
                                offsets[offsets.mIdxMult0 * (anIdx++) + 1] = aDist;
                            }
                            for(var aVert = -aDist + 1; aVert <= aDist - 1; aVert++) {
                                offsets[offsets.mIdxMult0 * (anIdx) + 0] = -aDist;
                                offsets[offsets.mIdxMult0 * (anIdx++) + 1] = aVert;
                                offsets[offsets.mIdxMult0 * (anIdx) + 0] = aDist;
                                offsets[offsets.mIdxMult0 * (anIdx++) + 1] = aVert;
                            }
                            anOffsetEnd = anIdx;
                        }
                        for(var anOffset = anOffsetStart; anOffset < anOffsetEnd; anOffset++) {
                            for(var aSubOffset = -aSpread; aSubOffset <= aSpread; aSubOffset++) {
                                var aDist_2 = (anInfo.mStormType == Game.LightningStorm.EStormType.SCREEN) ? 1 : anInfo.mDist;
                                var aSubX = anInfo.mCX + (aDist_2 * offsets[offsets.mIdxMult0 * (anOffset) + 0] + offsets[offsets.mIdxMult0 * (anOffset) + 1] * aSubOffset) * Game.Board.GEM_WIDTH;
                                var aSubY = anInfo.mCY + (aDist_2 * offsets[offsets.mIdxMult0 * (anOffset) + 1] + offsets[offsets.mIdxMult0 * (anOffset) + 0] * aSubOffset) * Game.Board.GEM_HEIGHT;
                                var aSubPiece_2 = this.GetPieceAtXY(aSubX, aSubY);
                                if(aDist_2 > anInfo.mStormLength) {
                                    continue;
                                }
                                if(aSubX < 0 || aSubX >= this.GetColX(this.mColCount)) {
                                    continue;
                                }
                                if(aSubY < 0 || aSubY >= this.GetRowY(this.mRowCount)) {
                                    continue;
                                }
                                if((aSubX != anInfo.mCX) || (aSubY != anInfo.mCY)) {
                                    var anElectrocutedCel = new Game.ElectrocutedCel();
                                    anElectrocutedCel.mCol = this.GetColAt(aSubX);
                                    anElectrocutedCel.mRow = this.GetRowAt(aSubY);
                                    anElectrocutedCel.mElectrocutePercent = 0.01;
                                    anInfo.mElectrocutedCelVector.push(anElectrocutedCel);
                                }
                                if(aSubPiece_2 != null && !aSubPiece_2.mDestructing) {
                                    var found = false;
                                    for(var j = 0; j < this.mLightningStorms.length; j++) {
                                        for(var i_3 = 0; i_3 < this.mLightningStorms[j].mPieceIds.length; i_3++) {
                                            if(aSubPiece_2.mId == this.mLightningStorms[j].mPieceIds[i_3]) {
                                                found = true;
                                            }
                                        }
                                    }
                                    if(found) {
                                        continue;
                                    }
                                    stormover = false;
                                    if(aSubPiece_2.mElectrocutePercent == 0) {
                                        anInfo.mPieceIds.push(aSubPiece_2.mId);
                                        aSubPiece_2.mElectrocutePercent = 0.01 * 1.67;
                                        if((!GameFramework.BaseApp.mApp.get_Is3D()) || (Game.BejApp.mBejApp.mIsSlow)) {
                                            for(var i_4 = 0; i_4 < 5; i_4++) {
                                                var anEffect = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.SPARKLE_SHARD);
                                                anEffect.mX = aSubX + this.GetBoardX() + GameFramework.Utils.GetRandFloat() * Math.abs(offsets[offsets.mIdxMult0 * (anOffset) + 0]) * Game.Board.GEM_WIDTH / 3;
                                                anEffect.mY = aSubY + this.GetBoardY() + GameFramework.Utils.GetRandFloat() * Math.abs(offsets[offsets.mIdxMult0 * (anOffset) + 1]) * Game.Board.GEM_HEIGHT / 3;
                                                anEffect.mDX = ((GameFramework.Utils.GetRandFloat() * (Math.abs(offsets[offsets.mIdxMult0 * (anOffset) + 1]) + 0.5) * 10) | 0) * 1.67;
                                                anEffect.mDY = ((GameFramework.Utils.GetRandFloat() * (Math.abs(offsets[offsets.mIdxMult0 * (anOffset) + 0]) + 0.5) * 10) | 0) * 1.67;
                                                this.mPostFXManager.AddEffect(anEffect);
                                            }
                                        } else {
                                            for(var i_5 = 0; i_5 < 20; i_5++) {
                                                var anEffect_2 = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.SPARKLE_SHARD);
                                                anEffect_2.mX = aSubX + this.GetBoardX() + GameFramework.Utils.GetRandFloat() * Math.abs(offsets[offsets.mIdxMult0 * (anOffset) + 0]) * Game.Board.GEM_WIDTH / 3;
                                                anEffect_2.mY = aSubY + this.GetBoardY() + GameFramework.Utils.GetRandFloat() * Math.abs(offsets[offsets.mIdxMult0 * (anOffset) + 1]) * Game.Board.GEM_HEIGHT / 3;
                                                anEffect_2.mDX = ((GameFramework.Utils.GetRandFloat() * (Math.abs(offsets[offsets.mIdxMult0 * (anOffset) + 1]) + 0.5) * 10) | 0) * 1.67;
                                                anEffect_2.mDY = ((GameFramework.Utils.GetRandFloat() * (Math.abs(offsets[offsets.mIdxMult0 * (anOffset) + 0]) + 0.5) * 10) | 0) * 1.67;
                                                this.mPostFXManager.AddEffect(anEffect_2);
                                            }
                                        }
                                    }
                                    aSubPiece_2.mShakeScale = Math.min(1.0, Math.max(aSubPiece_2.mShakeScale, aSubPiece_2.mElectrocutePercent));
                                }
                            }
                        }
                        if(anInfo.mDist == 0) {
                            Game.SoundUtil.Play(Game.Resources['SOUND_ELECTRO_EXPLODE']);
                        }
                        anInfo.mDist++;
                        var aMax = anInfo.mStormLength;
                        if(anInfo.mDist < aMax) {
                            stormover = false;
                        }
                        if(stormover) {
                            this.mComboBonusSlowdownPct = 1.0;
                            var aPiece_2 = this.GetPieceById(anInfo.mPieceIds[0]);
                            if(aPiece_2 != null) {
                                aPiece_2.ClearFlag(Game.Piece.EFlag.LASER);
                                if(aPiece_2.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) {
                                    this.TriggerSpecialEx(aPiece_2, aPiece_2);
                                } else {
                                    this.CelDestroyedBySpecial(aPiece_2.mCol, aPiece_2.mRow);
                                    aPiece_2.mExplodeDelay = 1;
                                    aPiece_2.mExplodeSourceId = aPiece_2.mId;
                                    aPiece_2.mExplodeSourceFlags |= aPiece_2.mFlags;
                                    aPiece_2.mIsPieceStill = false;
                                }
                            }
                            anInfo.mHoldDelay -= 0.25 * 1.67;

                            {
                                var $srcArray13 = this.mBoard;
                                for(var $enum13 = 0; $enum13 < $srcArray13.length; $enum13++) {
                                    var aFallPiece = $srcArray13[$enum13];
                                    if(aFallPiece != null) {
                                        aFallPiece.mFallVelocity = 0.0;
                                    }
                                }
                            }
                            if(anInfo.mHoldDelay <= 0) {
                                doDelete = true;
                            }
                        }
                    }
                    break;
                }
            }
            if((anInfo.mDoneDelay > 0) && (--anInfo.mDoneDelay == 0)) {
                doDelete = true;
            }
            if(doDelete) {
                this.mLightningStorms.removeAt(aStormIdx);
                if((this.mLightningStorms.length == 0)) {
                    this.FillInBlanks();
                }
                aStormIdx--;
            } else {
                if(anInfo.mUpdateCnt < aWantDelay) {
                    break;
                }
                aWantDelay += 15;
            }
        }
    },
    FindStormIdxFor : function Game_Board$FindStormIdxFor(thePiece) {
        for(var aLightningNum = 0; aLightningNum < (this.mLightningStorms.length | 0); aLightningNum++) {
            var aLightning = this.mLightningStorms[aLightningNum];
            if(aLightning.mElectrocuterId == thePiece.mId) {
                return aLightningNum;
            }
        }
        return -1;
    },
    DrawLightning : function Game_Board$DrawLightning(g) {
        for(var aLightningNum = 0; aLightningNum < (this.mLightningStorms.length | 0); aLightningNum++) {
            var aLightning = this.mLightningStorms[aLightningNum];
            aLightning.Draw(g);
        }
    },
    ExplodeAtHelper : function Game_Board$ExplodeAtHelper(theX, theY) {
        var aXCenter = theX;
        var aYCenter = theY;
        var aCenterPiece = this.GetPieceAtScreenXY(theX, theY);
        if(aCenterPiece != null) {
            aXCenter = (aCenterPiece.GetScreenX() | 0) + ((Game.Board.GEM_WIDTH / 2) | 0);
            aYCenter = (aCenterPiece.GetScreenY() | 0) + ((Game.Board.GEM_HEIGHT / 2) | 0);
        }
        this.gExplodePoints[this.gExplodePoints.mIdxMult0 * (this.gExplodeCount) + 0] = aXCenter;
        this.gExplodePoints[this.gExplodePoints.mIdxMult0 * (this.gExplodeCount) + 1] = aYCenter;
        this.gExplodeCount++;
        {
            var anEffect = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.LIGHT);
            anEffect.mFlags = (Game.Effect.EFlag.ALPHA_FADEINOUT | 0);
            anEffect.mX = aXCenter;
            anEffect.mY = aYCenter;
            anEffect.mZ = 0.04;
            anEffect.mValue[0] = 7000.0;
            anEffect.mValue[1] = -5000.0;
            anEffect.mValue[2] = 1.0;
            anEffect.mAlpha = 0.0;
            anEffect.mDAlpha = 0.1 * 1.67;
            anEffect.mScale = 3.0;
            this.mPostFXManager.AddEffect(anEffect);
        }
        var aSmCheckPositions = Array.Create2D(9, 2, 0, -1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1, 0, 0);
        var aLgCheckPositions = Array.Create2D(13, 2, 0, -1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1, 0, -2, -2, 0, 2, 0, 0, 2, 0, 0);
        var aCheckPositions = this.HasLargeExplosions() ? aLgCheckPositions : aSmCheckPositions;
        for(var anOffsets = 0; anOffsets < ((aCheckPositions.length / 2) | 0); anOffsets++) {
            var aX = theX + aCheckPositions[aCheckPositions.mIdxMult0 * (anOffsets) + 0] * Game.Board.GEM_WIDTH;
            var aY = theY + aCheckPositions[aCheckPositions.mIdxMult0 * (anOffsets) + 1] * Game.Board.GEM_HEIGHT;
            var celX;
            var celY;
            if(aCenterPiece != null) {
                celX = aCenterPiece.mCol + aCheckPositions[aCheckPositions.mIdxMult0 * (anOffsets) + 0];
                celY = aCenterPiece.mRow + aCheckPositions[aCheckPositions.mIdxMult0 * (anOffsets) + 1];
            } else {
                celX = this.GetColAt(theX - this.GetBoardX());
                celY = this.GetRowAt(theY - this.GetBoardY());
            }
            if(celX >= 0 && celX < this.mColCount && celY >= 0 && celY < this.mRowCount) {
                this.CelDestroyedBySpecial(celX, celY);
            }
            var aPiece = this.GetPieceAtScreenXY(aX, aY);
            if((aPiece != null) && ((aPiece.mExplodeDelay == 0) || (anOffsets == 8))) {
                var aPieceCenterX = (aPiece.GetScreenX() | 0) + ((Game.Board.GEM_WIDTH / 2) | 0);
                var aPieceCenterY = (aPiece.GetScreenY() | 0) + ((Game.Board.GEM_HEIGHT / 2) | 0);
                var doChainReaction = false;
                var aDistVX = ((0.013 * (aX - theX)) | 0);
                var aDistVY = ((0.013 * (aY - theY)) | 0);
                if((aCheckPositions[aCheckPositions.mIdxMult0 * (anOffsets) + 0] != 0) || (aCheckPositions[aCheckPositions.mIdxMult0 * (anOffsets) + 1] != 0)) {
                    if((GameFramework.BaseApp.mApp.get_Is3D()) && (!Game.BejApp.mBejApp.mIsSlow)) {
                        if(this.WantsCalmEffects()) {
                            for(var i = 0; i < 14; i++) {
                                var anEffect_2 = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.SPARKLE_SHARD);
                                var anAngle = GameFramework.Utils.GetRandFloat() * Game.MathUtil.PI;
                                var aSpeed = (0.0 + (2.0 * Math.abs(GameFramework.Utils.GetRandFloat())));
                                anEffect_2.mDX = (aSpeed * Math.cos(anAngle) + aDistVX) * 1.67;
                                anEffect_2.mDY = (aSpeed * Math.sin(anAngle) + aDistVY) * 1.67;
                                anEffect_2.mDX *= 2.5 * Math.abs(GameFramework.Utils.GetRandFloat()) * 1.67;
                                anEffect_2.mDY *= 2.5 * Math.abs(GameFramework.Utils.GetRandFloat()) * 1.67;
                                var aRatio = Math.abs(GameFramework.Utils.GetRandFloat());
                                aRatio *= aRatio;
                                anEffect_2.mX = aRatio * aXCenter + (1.0 - aRatio) * aPieceCenterX + Math.cos(anAngle) * 64.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                                anEffect_2.mY = aRatio * aYCenter + (1.0 - aRatio) * aPieceCenterY + Math.sin(anAngle) * 64.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                                anEffect_2.mColor = GameFramework.gfx.Color.WHITE_RGB;
                                anEffect_2.mIsAdditive = false;
                                anEffect_2.mDScale = 0.015 * 1.67;
                                anEffect_2.mScale = 0.1 + Math.abs(GameFramework.Utils.GetRandFloat()) * 1.0;
                                this.mPostFXManager.AddEffect(anEffect_2);
                            }
                        } else {
                            for(var i_2 = 0; i_2 < 14; i_2++) {
                                var anEffect_3 = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.STEAM);
                                var anAngle_2 = GameFramework.Utils.GetRandFloat() * Game.MathUtil.PI;
                                var aSpeed_2 = (0.0 + (2.0 * Math.abs(GameFramework.Utils.GetRandFloat()))) * 1.67;
                                anEffect_3.mDX = (aSpeed_2 * Math.cos(anAngle_2) + aDistVX);
                                anEffect_3.mDY = (aSpeed_2 * Math.sin(anAngle_2) + aDistVY);
                                anEffect_3.mDX *= 2.5 * Math.abs(GameFramework.Utils.GetRandFloat());
                                anEffect_3.mDY *= 2.5 * Math.abs(GameFramework.Utils.GetRandFloat());
                                var aRatio_2 = Math.abs(GameFramework.Utils.GetRandFloat());
                                aRatio_2 *= aRatio_2;
                                anEffect_3.mX = aRatio_2 * aXCenter + (1.0 - aRatio_2) * aPieceCenterX + Math.cos(anAngle_2) * 64.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                                anEffect_3.mY = aRatio_2 * aYCenter + (1.0 - aRatio_2) * aPieceCenterY + Math.sin(anAngle_2) * 64.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                                anEffect_3.mColor = GameFramework.gfx.Color.RGBAToInt(255, 96, 32, 64);
                                anEffect_3.mIsAdditive = false;
                                anEffect_3.mDScale = 0.015 * 1.67;
                                anEffect_3.mScale = 0.1 + Math.abs(GameFramework.Utils.GetRandFloat()) * 1.0;
                                this.mPostFXManager.AddEffect(anEffect_3);
                            }
                        }
                        for(var i_3 = 0; i_3 < 25; i_3++) {
                            var anEffect_4 = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.GEM_SHARD);
                            anEffect_4.mColor = Game.DM.gGemColors[(aPiece.mColor | 0) + 1];
                            var aDist = i_3 * (((i_3 + 120) / 120.0) | 0);
                            var aRot = i_3 * 0.503 + (Game.Util.Rand() % 100) / 800.0;
                            var aSpeed_3 = 1.2 + Math.abs(GameFramework.Utils.GetRandFloat()) * 1.2;
                            anEffect_4.mDX = Math.cos(aRot) * aSpeed_3 + aDistVX * 1.67;
                            anEffect_4.mDY = Math.sin(aRot) * aSpeed_3 + -2.0 + aDistVY * 1.67;
                            if((aDistVX != 0) || (aDistVY != 0)) {
                                aRot = GameFramework.Utils.GetRandFloat() * 3.14159;
                                aDist = ((GameFramework.Utils.GetRandFloat() * 48.0) | 0);
                                anEffect_4.mX = aPieceCenterX + ((1.0 * aDist * Math.cos(aRot)) | 0);
                                anEffect_4.mY = aPieceCenterY + ((1.0 * aDist * Math.sin(aRot)) | 0);
                                aRot = Math.atan2(anEffect_4.mY - aYCenter, anEffect_4.mX - aXCenter) + GameFramework.Utils.GetRandFloat() * 0.3;
                                aSpeed_3 = 3.5 + Math.abs(GameFramework.Utils.GetRandFloat()) * 1.0;
                                anEffect_4.mDX = (Math.cos(aRot) * aSpeed_3) * 1.67;
                                anEffect_4.mDY = (Math.sin(aRot) * aSpeed_3 + -2.0) * 1.67;
                                anEffect_4.mDecel = 0.965 + GameFramework.Utils.GetRandFloat() * 0.005;
                            } else {
                                anEffect_4.mX = aPieceCenterX + ((1.2 * aDist * anEffect_4.mDX) | 0) + 14.0;
                                anEffect_4.mY = aPieceCenterY + ((1.2 * aDist * anEffect_4.mDY) | 0) + 10.0;
                            }
                            anEffect_4.mAngle = aRot;
                            anEffect_4.mDAngle = 0.05 * GameFramework.Utils.GetRandFloat() * 1.67;
                            anEffect_4.mGravity = 0.06;
                            anEffect_4.mValue[0] = GameFramework.Utils.GetRandFloat() * Game.MathUtil.PI * 2;
                            anEffect_4.mValue[1] = GameFramework.Utils.GetRandFloat() * Game.MathUtil.PI * 2;
                            anEffect_4.mValue[2] = 0.045 * (3.0 * Math.abs(GameFramework.Utils.GetRandFloat()) + 1.0);
                            anEffect_4.mValue[3] = 0.045 * (3.0 * Math.abs(GameFramework.Utils.GetRandFloat()) + 1.0);
                            anEffect_4.mDAlpha = (-0.0025 * (2.0 * Math.abs(GameFramework.Utils.GetRandFloat()) + 4.0)) * 1.67;
                            this.mPostFXManager.AddEffect(anEffect_4);
                        }
                        for(var i_4 = 0; i_4 < 14; i_4++) {
                            var anEffect_5 = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.STEAM);
                            var anAngle_3 = i_4 * Game.MathUtil.PI * 2.0 / 14.0;
                            var aSpeed_4 = (0.5 + (5.75 * Math.abs(GameFramework.Utils.GetRandFloat())));
                            anEffect_5.mDX = (aSpeed_4 * Math.cos(anAngle_3) + aDistVX) * 1.67;
                            anEffect_5.mDY = (aSpeed_4 * Math.sin(anAngle_3) + aDistVY) * 1.67;
                            anEffect_5.mX = aPieceCenterX + Math.cos(anAngle_3) * 25.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                            anEffect_5.mY = aPieceCenterY + Math.sin(anAngle_3) * 25.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                            anEffect_5.mIsAdditive = false;
                            anEffect_5.mScale = 0.5;
                            anEffect_5.mDScale = 0.005 * 1.67;
                            anEffect_5.mValue[1] *= 1.0 - Math.abs(GameFramework.Utils.GetRandFloat() * 0.5);
                            anEffect_5.mColor = GameFramework.gfx.Color.RGBToInt(128, 128, 128);
                            this.mPostFXManager.AddEffect(anEffect_5);
                        }
                    } else {
                        for(var i_5 = 0; i_5 < 6; i_5++) {
                            var anEffect_6 = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.STEAM);
                            var anAngle_4 = i_5 * Game.MathUtil.PI * 2.0 / 6.0;
                            var aSpeed_5 = (0.5 + (5.75 * Math.abs(GameFramework.Utils.GetRandFloat())));
                            anEffect_6.mDX = (aSpeed_5 * Math.cos(anAngle_4) + aDistVX) * 1.67;
                            anEffect_6.mDY = (aSpeed_5 * Math.sin(anAngle_4) + aDistVY) * 1.67;
                            anEffect_6.mX = aPieceCenterX + Math.cos(anAngle_4) * 20.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                            anEffect_6.mY = aPieceCenterY + Math.sin(anAngle_4) * 20.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                            anEffect_6.mIsAdditive = false;
                            anEffect_6.mScale = 1.0;
                            anEffect_6.mDScale = 0.01 * 1.67;
                            anEffect_6.mAlpha = 0.5;
                            anEffect_6.mValue[1] *= 1.0 - Math.abs(GameFramework.Utils.GetRandFloat() * 0.5);
                            anEffect_6.mColor = 0xffffffff;
                            this.mPostFXManager.AddEffect(anEffect_6);
                        }
                    }
                    if(aPiece.IsFlagSet(Game.Piece.EFlag.FLAME)) {
                        doChainReaction = true;
                    }
                }
                var aLastType = aPiece.mColor;
                if(doChainReaction) {
                }
                if(aPiece.mImmunityCount == 0) {
                    if(aCenterPiece != null) {
                        this.SetMoveCredit(aPiece, aCenterPiece.mMoveCreditId);
                        if(aCenterPiece.mMatchId == -1) {
                            aCenterPiece.mMatchId = this.mCurMoveCreditId++;
                        }
                        aPiece.mMatchId = aCenterPiece.mMatchId;
                    }
                    if(doChainReaction) {
                        if(this.WantsCalmEffects()) {
                            aPiece.mExplodeDelay = 25;
                        } else {
                            aPiece.mExplodeDelay = 15;
                        }
                        aPiece.mExplodeSourceId = aCenterPiece.mId;
                        aPiece.mExplodeSourceFlags |= aCenterPiece.mFlags;
                        aPiece.mIsPieceStill = false;
                    } else if(aPiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) {
                        aPiece.mExplodeDelay = 5;
                        aPiece.mExplodeSourceId = aCenterPiece.mId;
                        aPiece.mExplodeSourceFlags |= aCenterPiece.mFlags;
                        aPiece.mIsPieceStill = false;
                    } else {
                        if(aPiece.IsFlagSet(Game.Piece.EFlag.LASER)) {
                            var aStormIdx = this.FindStormIdxFor(aPiece);
                            if(aStormIdx != -1) {
                                var aLightingStorm = this.mLightningStorms[aStormIdx];
                                if((aLightingStorm.mUpdateCnt == 0) && ((aLightingStorm.mStormType == Game.LightningStorm.EStormType.HORZ) || (aLightingStorm.mStormType == Game.LightningStorm.EStormType.VERT))) {
                                    this.mLightningStorms.removeAt(aStormIdx);
                                    aPiece.mDestructing = false;
                                }
                            }
                        }
                        if((((aPiece.IsFlagSet(Game.Piece.EFlag.FLAME)) || (aPiece.IsFlagSet(Game.Piece.EFlag.BLAST_GEM))) && (!aPiece.IsFlagSet(Game.Piece.EFlag.LASER))) || (!this.TriggerSpecialEx(aPiece, aCenterPiece))) {
                            if(aPiece.mCanDestroy) {
                                aPiece.mIsExploding = true;
                                if(aCenterPiece != null) {
                                    aPiece.mExplodeSourceId = aCenterPiece.mId;
                                    aPiece.mExplodeSourceFlags |= aCenterPiece.mFlags;
                                }
                                this.AddPoints((aPiece.GetScreenX() | 0), (aPiece.GetScreenY() | 0), 20, Game.DM.gGemColors[(aPiece.mColor | 0) + 1], aPiece.mMatchId, true, true, aPiece.mMoveCreditId, false, Game.Board.EPointType.SPECIAL);
                                this.DeletePiece(aPiece);
                            }
                        }
                    }
                }
            }
        }
    },
    ExplodeAt : function Game_Board$ExplodeAt(theX, theY) {
        this.gExplodeCount = 0;
        if(this.WantsCalmEffects()) {
            this.BumpColumns(theX, theY, 0.6);
        } else {
            this.BumpColumns(theX, theY, 1.0);
        }
        var aCenterPiece = this.GetPieceAtScreenXY(theX, theY);
        var aChainReactionCount = 0;
        if(aCenterPiece != null) {
            aChainReactionCount = this.GetMoveStatEx(aCenterPiece.mMoveCreditId, Game.DM.EStat.FLAMEGEMS_USED, 0);
        }
        this.ExplodeAtHelper(theX, theY);
        var anEffect = new Game.PopAnimEffect(Game.Resources['POPANIM_FLAMEGEMEXPLODE']);
        anEffect.mX = theX;
        anEffect.mY = theY;
        anEffect.mOverlay = true;
        anEffect.mScale = 2.0;
        anEffect.Play();
        this.mPostFXManager.AddEffect(anEffect);
    },
    SmallExplodeAt : function Game_Board$SmallExplodeAt(thePiece, theCenterX, theCenterY, process, fromFlame) {
        if((!thePiece.IsFlagSet(Game.Piece.EFlag.SCRAMBLE)) && (!thePiece.IsFlagSet(Game.Piece.EFlag.DETONATOR))) {
            this.AddPoints((thePiece.GetScreenX() | 0), (thePiece.GetScreenY() | 0), 50, Game.DM.gGemColors[(thePiece.mColor | 0) + 1], thePiece.mMatchId, true, true, thePiece.mMoveCreditId, false, Game.Board.EPointType.SPECIAL);
        }
        if((thePiece.IsFlagSet(Game.Piece.EFlag.COIN))) {
            this.DeletePiece(thePiece);
            return;
        }
        var aXCenter = (thePiece.GetScreenX() | 0) + ((Game.Board.GEM_WIDTH / 2) | 0);
        var aYCenter = (thePiece.GetScreenY() | 0) + ((Game.Board.GEM_HEIGHT / 2) | 0);
        var aDistVX = 0.01 * (aXCenter - theCenterX);
        var aDistVY = 0.01 * (aYCenter - theCenterY);
        if(aDistVX == 0.0) {
            aDistVY *= 2.0;
        }
        if(aDistVY == 0.0) {
            aDistVX *= 2.0;
        }
        if((GameFramework.BaseApp.mApp.get_Is3D()) && (!Game.BejApp.mBejApp.mIsSlow)) {
            for(var i = 0; i < 14; i++) {
                var anEffect = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.STEAM);
                var anAngle = GameFramework.Utils.GetRandFloat() * Game.MathUtil.PI;
                var aSpeed = (0.0 + (2.0 * Math.abs(GameFramework.Utils.GetRandFloat())));
                anEffect.mDX = (aSpeed * Math.cos(anAngle) + aDistVX) * 1.67;
                anEffect.mDY = (aSpeed * Math.sin(anAngle) + aDistVY) * 1.67;
                if(fromFlame) {
                    anEffect.mDX *= 2.5 * Math.abs(GameFramework.Utils.GetRandFloat());
                    anEffect.mDY *= 2.5 * Math.abs(GameFramework.Utils.GetRandFloat());
                    var aRatio = Math.abs(GameFramework.Utils.GetRandFloat());
                    aRatio *= aRatio;
                    anEffect.mX = aRatio * theCenterX + (1.0 - aRatio) * aXCenter + Math.cos(anAngle) * 64.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                    anEffect.mY = aRatio * theCenterY + (1.0 - aRatio) * aYCenter + Math.sin(anAngle) * 64.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                    anEffect.mColor = GameFramework.gfx.Color.RGBAToInt(255, 96, 32, 64);
                    anEffect.mIsAdditive = false;
                    anEffect.mDScale = 0.015;
                } else {
                    anEffect.mX = aXCenter + Math.cos(anAngle) * 24.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                    anEffect.mY = aYCenter + Math.sin(anAngle) * 24.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                    anEffect.mColor = Game.DM.gGemColors[(thePiece.mColor | 0) + 1];
                    anEffect.mIsAdditive = false;
                    anEffect.mDScale = 0.02;
                }
                anEffect.mScale = 0.1 + Math.abs(GameFramework.Utils.GetRandFloat()) * 1.0;
                this.mPostFXManager.AddEffect(anEffect);
            }
        }
        for(var i_2 = 0; i_2 < 25; i_2++) {
            var anEffect_2 = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.GEM_SHARD);
            anEffect_2.mColor = Game.DM.gGemColors[(thePiece.mColor | 0) + 1];
            var aDist = i_2 * (((i_2 + 120) / 120.0) | 0);
            var aRot = i_2 * 0.503 + (Game.Util.Rand() % 100) / 800.0;
            var aSpeed_2 = 1.2 + Math.abs(GameFramework.Utils.GetRandFloat()) * 1.2;
            anEffect_2.mDX = (Math.cos(aRot) * aSpeed_2 + aDistVX) * 1.67;
            anEffect_2.mDY = (Math.sin(aRot) * aSpeed_2 + -2.0 + aDistVY) * 1.67;
            if((aDistVX != 0) || (aDistVY != 0)) {
                aRot = ((GameFramework.Utils.GetRandFloat() * 3.14159) | 0);
                aDist = ((GameFramework.Utils.GetRandFloat() * 48.0) | 0);
                anEffect_2.mX = aXCenter + ((1.0 * aDist * Math.cos(aRot)) | 0);
                anEffect_2.mY = aYCenter + ((1.0 * aDist * Math.sin(aRot)) | 0);
                aRot = Math.atan2(anEffect_2.mY - theCenterY, anEffect_2.mX - theCenterX) + GameFramework.Utils.GetRandFloat() * 0.3;
                aSpeed_2 = 3.5 + Math.abs(GameFramework.Utils.GetRandFloat()) * 1.0;
                anEffect_2.mDX = (Math.cos(aRot) * aSpeed_2) * 1.67;
                anEffect_2.mDY = (Math.sin(aRot) * aSpeed_2 + -2.0) * 1.67;
                anEffect_2.mDecel = 0.98 + GameFramework.Utils.GetRandFloat() * 0.005;
            } else {
                anEffect_2.mX = aXCenter + ((1.2 * aDist * anEffect_2.mDX) | 0) + 14.0;
                anEffect_2.mY = aYCenter + ((1.2 * aDist * anEffect_2.mDY) | 0) + 10.0;
            }
            anEffect_2.mAngle = aRot;
            anEffect_2.mDAngle = (0.05 * GameFramework.Utils.GetRandFloat()) * 1.67;
            anEffect_2.mGravity = 0.06;
            anEffect_2.mValue[0] = GameFramework.Utils.GetRandFloat() * Game.MathUtil.PI * 2;
            anEffect_2.mValue[1] = GameFramework.Utils.GetRandFloat() * Game.MathUtil.PI * 2;
            anEffect_2.mValue[2] = 0.045 * (3.0 * Math.abs(GameFramework.Utils.GetRandFloat()) + 1.0);
            anEffect_2.mValue[3] = 0.045 * (3.0 * Math.abs(GameFramework.Utils.GetRandFloat()) + 1.0);
            anEffect_2.mDAlpha = -0.0025 * (2.0 * Math.abs(GameFramework.Utils.GetRandFloat()) + 4.0);
            this.mPostFXManager.AddEffect(anEffect_2);
        }
        if((GameFramework.BaseApp.mApp.get_Is3D()) && (!Game.BejApp.mBejApp.mIsSlow)) {
            for(var i_3 = 0; i_3 < 14; i_3++) {
                var anEffect_3 = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.STEAM);
                var anAngle_2 = i_3 * Game.MathUtil.PI * 2.0 / 20.0;
                var aSpeed_3 = (0.5 + (5.75 * Math.abs(GameFramework.Utils.GetRandFloat())));
                anEffect_3.mDX = (aSpeed_3 * Math.cos(anAngle_2) + aDistVX) * 1.67;
                anEffect_3.mDY = (aSpeed_3 * Math.sin(anAngle_2) + aDistVY) * 1.67;
                anEffect_3.mX = aXCenter + Math.cos(anAngle_2) * 25.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                anEffect_3.mY = aYCenter + Math.sin(anAngle_2) * 25.0 * Math.abs(GameFramework.Utils.GetRandFloat());
                anEffect_3.mIsAdditive = false;
                anEffect_3.mScale = 0.5;
                anEffect_3.mDScale = 0.005 * 1.67;
                anEffect_3.mValue[1] *= 1.0 - Math.abs(GameFramework.Utils.GetRandFloat() * 0.5);
                anEffect_3.mColor = GameFramework.gfx.Color.RGBToInt(128, 128, 128);
                this.mPostFXManager.AddEffect(anEffect_3);
            }
            if(thePiece.mElectrocutePercent > 0) {
                var aMgr = this.mPostFXManager;
                var aCount = 15;
                for(var j = 0; j < aCount; j++) {
                    var anEffect_4 = aMgr.AllocEffect(Game.Effect.EFxType.FRUIT_SPARK);
                    var aSpeed_4 = 1.0 + Math.abs(GameFramework.Utils.GetRandFloat()) * 2.0;
                    var anAngle_3 = GameFramework.Utils.GetRandFloat() * Game.MathUtil.PI;
                    anEffect_4.mScale = 1.0 + GameFramework.Utils.GetRandFloat() * 0.5;
                    anEffect_4.mDX = (aSpeed_4 * Math.cos(anAngle_3)) * 1.67;
                    anEffect_4.mDY = (aSpeed_4 * Math.sin(anAngle_3)) * 1.67;
                    anEffect_4.mX = thePiece.GetScreenX() + ((Game.Board.GEM_WIDTH / 2) | 0) + Math.cos(anAngle_3) * Game.Board.GEM_WIDTH / 2;
                    anEffect_4.mY = thePiece.GetScreenY() + ((Game.Board.GEM_HEIGHT / 2) | 0) + Math.sin(anAngle_3) * Game.Board.GEM_HEIGHT / 2;
                    anEffect_4.mIsAdditive = false;
                    anEffect_4.mAlpha = 1.0;
                    anEffect_4.mDAlpha = -0.005 * 1.67;
                    anEffect_4.mGravity = 0.0;
                    aMgr.AddEffect(anEffect_4);
                }
            }
            {
            }
        }
        thePiece.mIsExploding = true;
        this.DeletePiece(thePiece);
    },
    FindRandomMove : function Game_Board$FindRandomMove(theCoords) {
        return this.FindRandomMoveCoords(theCoords, false);
    },
    FindRandomMoveCoords : function Game_Board$FindRandomMoveCoords(theCoords, thePowerGemMove) {
        var reverseFind = GameFramework.Utils.GetRandFloat() >= 0;
        var aMoveNum = ((GameFramework.Utils.GetRandFloatU() * 10) | 0);
        for(var i = 0; i < 2; i++) {
            for(var m = aMoveNum; m >= 0; m--) {
                if(this.FindMove(theCoords, m, true, true, reverseFind, null, thePowerGemMove)) {
                    return true;
                }
            }
            for(var m_2 = aMoveNum; m_2 >= 0; m_2--) {
                if(this.FindMove(theCoords, m_2, true, true, !reverseFind, null, thePowerGemMove)) {
                    return true;
                }
            }
        }
        return false;
    },
    FindMoveBasic : function Game_Board$FindMoveBasic(theCoords, theMoveNum, horz, vert) {
        return this.FindMove(theCoords, theMoveNum, horz, vert, false, null, false);
    },
    FindMove : function Game_Board$FindMove(theCoords, theMoveNum, horz, vert, reverse, theIncludePiece, powerGemMove) {
        var aSwapArray = Array.Create2D(4, 2, 0, 1, 0, -1, 0, 0, 1, 0, -1);
        var aMoveNum = 0;
        var aStartRow = reverse ? this.mRowCount - 1 : 0;
        var anEndRow = reverse ? -1 : this.mRowCount;
        for(var aCheckRow = aStartRow; aCheckRow != anEndRow;) {
            for(var aCheckCol = 0; aCheckCol < this.mColCount; aCheckCol++) {
                var aPiece = this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aCheckCol];
                if(aPiece == null) {
                    continue;
                }
                if(aPiece != null) {
                    if(!aPiece.mWillPieceBeStill) {
                        continue;
                    }
                    if(aPiece.IsFlagSet(Game.Piece.EFlag.DOOM) || !aPiece.mCanSwap) {
                        continue;
                    }
                }
                for(var aSwapIdx = 0; aSwapIdx < 4; aSwapIdx++) {
                    var aSwapCol = aCheckCol + aSwapArray[aSwapArray.mIdxMult0 * (aSwapIdx) + 0];
                    var aSwapRow = aCheckRow + aSwapArray[aSwapArray.mIdxMult0 * (aSwapIdx) + 1];
                    if((aSwapCol >= 0) && (aSwapCol < 8) && (aSwapRow >= 0) && (aSwapRow < 8)) {
                        var aSwapPiece = aPiece;
                        var moveIsValid = false;
                        var includedPiece = theIncludePiece == null;
                        if((aPiece != null) && (aPiece.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) && (this.mBoard[this.mBoard.mIdxMult0 * (aSwapRow) + aSwapCol] != null)) {
                            if((theIncludePiece != null) && (aPiece.mColor == theIncludePiece.mColor)) {
                                includedPiece = true;
                            }
                            moveIsValid = true;
                        }
                        if((this.mBoard[this.mBoard.mIdxMult0 * (aSwapRow) + aSwapCol] != null) && (this.mBoard[this.mBoard.mIdxMult0 * (aSwapRow) + aSwapCol].mColor != Game.DM.EGemColor._INVALID) && (this.mBoard[this.mBoard.mIdxMult0 * (aSwapRow) + aSwapCol].mWillPieceBeStill)) {
                            this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aCheckCol] = this.mBoard[this.mBoard.mIdxMult0 * (aSwapRow) + aSwapCol];
                            this.mBoard[this.mBoard.mIdxMult0 * (aSwapRow) + aSwapCol] = aSwapPiece;
                            if(theIncludePiece == this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aCheckCol]) {
                                includedPiece = true;
                            }
                            var aLeftCol = aCheckCol;
                            var aRightCol = aCheckCol;
                            while((aLeftCol > 0) && (this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aLeftCol - 1] != null) && (this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aCheckCol].mColor == this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aLeftCol - 1].mColor) && (this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aLeftCol - 1].mWillPieceBeStill)) {
                                if(theIncludePiece == this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aLeftCol - 1]) {
                                    includedPiece = true;
                                }
                                aLeftCol--;
                            }
                            while((aRightCol < 7) && (this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aRightCol + 1] != null) && (this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aCheckCol].mColor == this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aRightCol + 1].mColor) && (this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aRightCol + 1].mWillPieceBeStill)) {
                                if(theIncludePiece == this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aRightCol + 1]) {
                                    includedPiece = true;
                                }
                                aRightCol++;
                            }
                            var aTopRow = aCheckRow;
                            var aBottomRow = aCheckRow;
                            while((aTopRow > 0) && (this.mBoard[this.mBoard.mIdxMult0 * (aTopRow - 1) + aCheckCol] != null) && (this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aCheckCol].mColor == this.mBoard[this.mBoard.mIdxMult0 * (aTopRow - 1) + aCheckCol].mColor) && (this.mBoard[this.mBoard.mIdxMult0 * (aTopRow - 1) + aCheckCol].mWillPieceBeStill)) {
                                if(theIncludePiece == this.mBoard[this.mBoard.mIdxMult0 * (aTopRow - 1) + aCheckCol]) {
                                    includedPiece = true;
                                }
                                aTopRow--;
                            }
                            while((aBottomRow < 7) && (this.mBoard[this.mBoard.mIdxMult0 * (aBottomRow + 1) + aCheckCol] != null) && (this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aCheckCol].mColor == this.mBoard[this.mBoard.mIdxMult0 * (aBottomRow + 1) + aCheckCol].mColor) && (this.mBoard[this.mBoard.mIdxMult0 * (aBottomRow + 1) + aCheckCol].mWillPieceBeStill)) {
                                if(theIncludePiece == this.mBoard[this.mBoard.mIdxMult0 * (aBottomRow + 1) + aCheckCol]) {
                                    includedPiece = true;
                                }
                                aBottomRow++;
                            }
                            aSwapPiece = this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aCheckCol];
                            this.mBoard[this.mBoard.mIdxMult0 * (aCheckRow) + aCheckCol] = this.mBoard[this.mBoard.mIdxMult0 * (aSwapRow) + aSwapCol];
                            this.mBoard[this.mBoard.mIdxMult0 * (aSwapRow) + aSwapCol] = aSwapPiece;
                            if(powerGemMove) {
                                if(((aRightCol - aLeftCol >= 3) && (horz)) || ((aBottomRow - aTopRow >= 3) && (vert))) {
                                    moveIsValid = true;
                                }
                                if(((aRightCol - aLeftCol >= 2) && (horz)) && ((aBottomRow - aTopRow >= 2) && (vert))) {
                                    moveIsValid = true;
                                }
                            } else {
                                if(((aRightCol - aLeftCol >= 2) && (horz)) || ((aBottomRow - aTopRow >= 2) && (vert))) {
                                    moveIsValid = true;
                                }
                            }
                        }
                        if((moveIsValid) && (includedPiece)) {
                            if(aMoveNum == theMoveNum) {
                                if(theCoords != null) {
                                    theCoords[0] = aCheckCol;
                                    theCoords[1] = aCheckRow;
                                    theCoords[2] = aSwapCol;
                                    theCoords[3] = aSwapRow;
                                }
                                return true;
                            } else {
                                ++aMoveNum;
                            }
                        }
                    }
                }
            }
            if(reverse) {
                aCheckRow--;
            } else {
                aCheckRow++;
            }
        }
        return false;
    },
    HasSet : function Game_Board$HasSet() {
        return this.HasSetEx(null);
    },
    HasSetEx : function Game_Board$HasSetEx(theCheckPiece) {
        var aRow;
        var aCol;
        for(aRow = 0; aRow < 8; aRow++) {
            var aMatchCount = 0;
            var aLastColor = Game.DM.EGemColor._INVALID;
            var foundCheckPiece = false;
            for(aCol = 0; aCol < 8; aCol++) {
                var aPiece = this.mBoard[this.mBoard.mIdxMult0 * (aRow) + aCol];
                if(aPiece != null) {
                    if((aPiece.mColor != Game.DM.EGemColor._INVALID) && (aPiece.mColor == aLastColor)) {
                        if(aPiece == theCheckPiece) {
                            foundCheckPiece = true;
                        }
                        if((++aMatchCount >= 3) && (foundCheckPiece)) {
                            return true;
                        }
                    } else {
                        aLastColor = aPiece.mColor;
                        aMatchCount = 1;
                        foundCheckPiece = (aPiece == theCheckPiece) || (theCheckPiece == null);
                    }
                } else {
                    aLastColor = Game.DM.EGemColor._INVALID;
                }
            }
        }
        for(aCol = 0; aCol < 8; aCol++) {
            var aMatchCount_2 = 0;
            var aLastColor_2 = Game.DM.EGemColor._INVALID;
            var foundCheckPiece_2 = false;
            for(aRow = 0; aRow < 8; aRow++) {
                var aPiece_2 = this.mBoard[this.mBoard.mIdxMult0 * (aRow) + aCol];
                if(aPiece_2 != null) {
                    if((aPiece_2.mColor != Game.DM.EGemColor._INVALID) && (aPiece_2.mColor == aLastColor_2)) {
                        if(aPiece_2 == theCheckPiece) {
                            foundCheckPiece_2 = true;
                        }
                        if((++aMatchCount_2 >= 3) && (foundCheckPiece_2)) {
                            return true;
                        }
                    } else {
                        aLastColor_2 = aPiece_2.mColor;
                        aMatchCount_2 = 1;
                        foundCheckPiece_2 = (aPiece_2 == theCheckPiece) || (theCheckPiece == null);
                    }
                } else {
                    aLastColor_2 = Game.DM.EGemColor._INVALID;
                }
            }
        }
        return false;
    },
    HasIllegalSet : function Game_Board$HasIllegalSet() {
        var aRow;
        var aCol;
        for(aRow = 0; aRow < 8; aRow++) {
            var aMatchCount = 0;
            var aLastColor = Game.DM.EGemColor._INVALID;
            var hasProtectedGem = false;
            for(aCol = 0; aCol < 8; aCol++) {
                var aPiece = this.mBoard[this.mBoard.mIdxMult0 * (aRow) + aCol];
                if(aPiece != null) {
                    var isGemProtected = (aPiece.mCreatedTick == this.mUpdateCnt) && (aPiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER));
                    if((aPiece.mColor != Game.DM.EGemColor._INVALID) && (aPiece.mColor == aLastColor)) {
                        if(isGemProtected) {
                            hasProtectedGem = true;
                        }
                        if((++aMatchCount >= 3) && (hasProtectedGem)) {
                            return true;
                        }
                    } else {
                        aLastColor = aPiece.mColor;
                        aMatchCount = 1;
                        hasProtectedGem = isGemProtected;
                    }
                } else {
                    aLastColor = Game.DM.EGemColor._INVALID;
                }
            }
        }
        for(aCol = 0; aCol < 8; aCol++) {
            var aMatchCount_2 = 0;
            var aLastColor_2 = Game.DM.EGemColor._INVALID;
            var hasProtectedGem_2 = false;
            for(aRow = 0; aRow < 8; aRow++) {
                var aPiece_2 = this.mBoard[this.mBoard.mIdxMult0 * (aRow) + aCol];
                if(aPiece_2 != null) {
                    var isGemProtected_2 = (aPiece_2.mCreatedTick == this.mUpdateCnt) && (aPiece_2.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER));
                    if((aPiece_2.mColor != Game.DM.EGemColor._INVALID) && (aPiece_2.mColor == aLastColor_2)) {
                        if(isGemProtected_2) {
                            hasProtectedGem_2 = true;
                        }
                        if((++aMatchCount_2 >= 3) && (hasProtectedGem_2)) {
                            return true;
                        }
                    } else {
                        aLastColor_2 = aPiece_2.mColor;
                        aMatchCount_2 = 1;
                        hasProtectedGem_2 = isGemProtected_2;
                    }
                } else {
                    aLastColor_2 = Game.DM.EGemColor._INVALID;
                }
            }
        }
        return false;
    },
    TriggerSpecial : function Game_Board$TriggerSpecial(thePiece) {
        return this.TriggerSpecialEx(thePiece, null);
    },
    TriggerSpecialEx : function Game_Board$TriggerSpecialEx(thePiece, theSrc) {
        if(thePiece.mDestructing) {
            return false;
        }
        if((thePiece.IsFlagSet(Game.Piece.EFlag.FLAME)) && (!thePiece.IsFlagSet(Game.Piece.EFlag.LASER))) {
            thePiece.mExplodeDelay = 1;
            thePiece.mExplodeSourceId = theSrc != null ? theSrc.mId : -1;
            thePiece.mExplodeSourceFlags |= theSrc != null ? theSrc.mFlags : 0;
            thePiece.mIsPieceStill = false;
            return true;
        }
        if(thePiece.IsFlagSet(Game.Piece.EFlag.BLAST_GEM)) {
            thePiece.mExplodeDelay = 1;
            thePiece.mExplodeSourceId = theSrc != null ? theSrc.mId : -1;
            thePiece.mExplodeSourceFlags |= theSrc != null ? theSrc.mFlags : 0;
            thePiece.mIsPieceStill = false;
            return true;
        }
        if((thePiece.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) && (this.FindStormIdxFor(thePiece) == -1)) {
            var aColor;
            if(theSrc != null) {
                if(theSrc.mColor == Game.DM.EGemColor._INVALID) {
                    aColor = theSrc.mLastColor;
                } else {
                    aColor = theSrc.mColor;
                }
            } else if(thePiece.mLastColor != Game.DM.EGemColor._INVALID) {
                aColor = thePiece.mLastColor;
            } else {
                aColor = (this.mRand.Next() % ((Game.DM.EGemColor._COUNT | 0)));
            }
            this.DoHypercubeColor(thePiece, aColor);
            return true;
        }
        if((thePiece.IsFlagSet(Game.Piece.EFlag.LASER)) && (this.FindStormIdxFor(thePiece) == -1)) {
            thePiece.mDestructing = true;
            if(thePiece.IsFlagSet(Game.Piece.EFlag.FLAME)) {
                this.AddToStatCred(Game.DM.EStat.SUPERNOVAS_USED, 1, thePiece.mMoveCreditId);
            }
            this.AddToStatCred(Game.DM.EStat.LASERGEMS_USED, 1, thePiece.mMoveCreditId);
            var aLightningStorm = new Game.LightningStorm(this, thePiece, Game.LightningStorm.EStormType.BOTH);
            this.mLightningStorms.push(aLightningStorm);
            return true;
        }
        if(thePiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) {
            thePiece.mDestructing = true;
            thePiece.mExplodeDelay = 1;
            thePiece.mIsPieceStill = false;
            thePiece.mExplodeSourceId = theSrc != null ? theSrc.mId : -1;
            thePiece.mExplodeSourceFlags |= theSrc != null ? theSrc.mFlags : 0;
            return true;
        }
        return false;
    },
    FindSets : function Game_Board$FindSets() {
        return this.FindSetsEx(false, null, null);
    },
    FindSetsEx : function Game_Board$FindSetsEx(fromUpdateSwapping, thePiece1, thePiece2) {
        var aPrevNumPoints = this.mPoints;
        var hadFutureMatches = false;
        var aFoundCount = 0;
        var aFoundChains = 0;
        var aCumSetX = 0;
        var aCumSetY = 0;
        var aBulgeTriggerPieceSet = [];
        var aDelayingPieceSet = [];
        var aTallyPieceSet = [];
        var aPowerupPieceSet = [];
        var aMatchedSets = [];
        var hasDelayableSwaps = false;
        for(var i = 0; i < (this.mSwapDataVector.length | 0); i++) {
            var aSwapData = this.mSwapDataVector[i];
            if((!aSwapData.mSwapPct.HasBeenTriggered()) && (aSwapData.mForceSwap)) {
                hasDelayableSwaps = true;
            }
        }
        var aMoveCreditSet = [];
        var aDeferPowerupMapPiece = [];
        var aDeferPowerupMapInt = [];
        var aDeferPowerupMapPieceBackup = [];
        var aDeferLaserSet = [];
        var aDeferExplodeVector = [];
        for(var i_2 = 0; i_2 < 2; i_2++) {
            for(var i1 = 0; i1 < 8; i1++) {
                var isFutureMatch = false;
                var aMatchCount = 0;
                var aLastType = -1;
                var aFirstMatchRow = 0;
                var aFirstMatchCol = 0;
                var aLastMatchRow = 0;
                var aLastMatchCol = 0;
                for(var i2 = 0; i2 < 8; i2++) {
                    var aCol;
                    var aRow;
                    if(i_2 == 0) {
                        aCol = i1;
                        aRow = i2;
                    } else {
                        aCol = i2;
                        aRow = i1;
                    }
                    var aCurType = -1;
                    var pieceMatch = false;
                    var aPiece = this.mBoard[this.mBoard.mIdxMult0 * (aRow) + aCol];
                    var isPieceStill = (((aPiece != null) && (aPiece.mIsPieceStill)) || (aTallyPieceSet.indexOf(aPiece) != -1)) && (aDelayingPieceSet.indexOf(aPiece) == -1);
                    var matchablePiece = (aPiece != null) && ((aPiece.mWillPieceBeStill) || (aTallyPieceSet.indexOf(aPiece) != -1));
                    if(matchablePiece) {
                        if(aPiece.mChangedTick == this.mUpdateCnt) {
                            aCurType = (aPiece.mLastColor | 0);
                        } else {
                            aCurType = (aPiece.mColor | 0);
                        }
                        if((aCurType == aLastType) && (aCurType != -1)) {
                            if(!isPieceStill || hasDelayableSwaps) {
                                isFutureMatch = true;
                            }
                            aLastMatchCol = aCol;
                            aLastMatchRow = aRow;
                            pieceMatch = true;
                            ++aMatchCount;
                        }
                    }
                    if((!pieceMatch) || (i2 == 7)) {
                        if(aMatchCount >= 3) {
                            var aNewestTime = 0;
                            this.mIsBoardStill = false;
                            var justSwapped = false;
                            var aMatchSet = new Game.MatchSet();
                            var matchedCombo = false;
                            var needsSettling = false;
                            var aMoveCreditId = -1;
                            var aLastMoveCreditId = -1;
                            aMatchSet.mMatchId = this.mCurMoveCreditId++;
                            aMatchSet.mMoveCreditId = -1;
                            aMatchSet.mExplosionCount = 0;
                            var isSetBulging = false;
                            for(var aMarkRow = aFirstMatchRow; aMarkRow <= aLastMatchRow; aMarkRow++) {
                                for(var aMarkCol = aFirstMatchCol; aMarkCol <= aLastMatchCol; aMarkCol++) {
                                    var aMarkPiece = this.mBoard[this.mBoard.mIdxMult0 * (aMarkRow) + aMarkCol];
                                    if(aMarkPiece != null) {
                                        if(aBulgeTriggerPieceSet.indexOf(aMarkPiece) != -1) {
                                            isSetBulging = true;
                                        }
                                        var aGemsPerp = 0;
                                        var hadUnsettledPerp = false;
                                        var anOffsets = Array.Create2D(4, 2, 0, -1, 0, 1, 0, 0, -1, 0, 1);
                                        for(var anOffsetIdx = 0; anOffsetIdx < 4; anOffsetIdx++) {
                                            for(var aDist = 1; aDist < 8; aDist++) {
                                                var anAdjacentPiece = this.GetPieceAtRowCol(aMarkPiece.mRow + anOffsets[anOffsets.mIdxMult0 * (anOffsetIdx) + 0] * aDist, aMarkPiece.mCol + anOffsets[anOffsets.mIdxMult0 * (anOffsetIdx) + 1] * aDist);
                                                if((anAdjacentPiece != null) && (anAdjacentPiece.mColor == aMarkPiece.mColor)) {
                                                    var isUnsettled = (!anAdjacentPiece.mIsPieceStill) && (anAdjacentPiece.mWillPieceBeStill);
                                                    if((((anOffsetIdx / 2) | 0)) != i_2) {
                                                        aGemsPerp++;
                                                        if(isUnsettled) {
                                                            hadUnsettledPerp = true;
                                                        }
                                                    } else {
                                                        if(isUnsettled) {
                                                            needsSettling = true;
                                                        }
                                                    }
                                                } else {
                                                    break;
                                                }
                                            }
                                        }
                                        if((aGemsPerp >= 2) && hadUnsettledPerp) {
                                            needsSettling = true;
                                        }
                                        if((aMarkPiece.mColor | 0) == aLastType) {
                                            if(aMarkPiece.mSwapTick == this.mUpdateCnt) {
                                                justSwapped = true;
                                            }
                                            aMatchSet.mPieces.push(aMarkPiece);
                                        }
                                        aMoveCreditId = (Math.max(aMoveCreditId, aMarkPiece.mMoveCreditId) | 0);
                                        aLastMoveCreditId = (Math.max(aLastMoveCreditId, aMarkPiece.mLastMoveCreditId) | 0);
                                    }
                                }
                            }
                            if(aMoveCreditId == -1) {
                                aMoveCreditId = aLastMoveCreditId;
                            }
                            aMatchSet.mMoveCreditId = aMoveCreditId;
                            if((isFutureMatch) || needsSettling) {
                                hadFutureMatches = true;
                                for(var aMarkRow_2 = aFirstMatchRow; aMarkRow_2 <= aLastMatchRow; aMarkRow_2++) {
                                    for(var aMarkCol_2 = aFirstMatchCol; aMarkCol_2 <= aLastMatchCol; aMarkCol_2++) {
                                        var aMarkPiece_2 = this.mBoard[this.mBoard.mIdxMult0 * (aMarkRow_2) + aMarkCol_2];
                                        if(aMarkPiece_2 != null) {
                                            aMarkPiece_2.mMoveCreditId = aMoveCreditId;
                                            if(aDelayingPieceSet.indexOf(aMarkPiece_2) == -1) {
                                                aDelayingPieceSet.push(aMarkPiece_2);
                                            }
                                        }
                                    }
                                }
                            } else {
                                aFoundCount++;
                                if(!justSwapped) {
                                    aFoundChains++;
                                }
                                var aPowerupCandidates = [];
                                var aNewestPowerupCandidates = [];
                                for(var aMarkRow_3 = aFirstMatchRow; aMarkRow_3 <= aLastMatchRow; aMarkRow_3++) {
                                    for(var aMarkCol_3 = aFirstMatchCol; aMarkCol_3 <= aLastMatchCol; aMarkCol_3++) {
                                        var aMarkPiece_3 = this.mBoard[this.mBoard.mIdxMult0 * (aMarkRow_3) + aMarkCol_3];
                                        if(aMarkPiece_3 != null) {
                                            if(aMarkPiece_3.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) {
                                                this.IncPointMult(aMarkPiece_3);
                                                aMarkPiece_3.ClearFlag(Game.Piece.EFlag.POINT_MULTIPLIER);
                                                this.mPostFXManager.FreePieceEffect(aMarkPiece_3.mId);
                                            }
                                        }
                                    }
                                }
                                for(var aMarkRow_4 = aFirstMatchRow; aMarkRow_4 <= aLastMatchRow; aMarkRow_4++) {
                                    for(var aMarkCol_4 = aFirstMatchCol; aMarkCol_4 <= aLastMatchCol; aMarkCol_4++) {
                                        var aMarkPiece_4 = this.mBoard[this.mBoard.mIdxMult0 * (aMarkRow_4) + aMarkCol_4];
                                        if(aMarkPiece_4 != null) {
                                            aMarkPiece_4.mMatchId = aMatchSet.mMatchId;
                                            aMarkPiece_4.mMoveCreditId = aMoveCreditId;
                                            if(aMarkPiece_4.IsFlagSet(Game.Piece.EFlag.COIN)) {
                                                aMarkPiece_4.ClearFlag(Game.Piece.EFlag.COIN);
                                            }
                                            if(!matchedCombo) {
                                                matchedCombo = this.ComboProcess(aMarkPiece_4.mColor);
                                            }
                                            var isCandidate = false;
                                            if((aMarkPiece_4.IsFlagSet(Game.Piece.EFlag.FLAME)) || (aMarkPiece_4.IsFlagSet(Game.Piece.EFlag.BLAST_GEM))) {
                                                aDeferExplodeVector.push(aMarkPiece_4);
                                                aMatchSet.mExplosionCount++;
                                            }
                                            if((aMarkPiece_4.IsFlagSet(Game.Piece.EFlag.LASER)) && (aMarkPiece_4.mChangedTick != this.mUpdateCnt)) {
                                                var aStormIdx = this.FindStormIdxFor(aMarkPiece_4);
                                                if(aStormIdx == -1) {
                                                    this.AddToStatCred(Game.DM.EStat.LASERGEMS_USED, 1, aMoveCreditId);
                                                    var aStorm = new Game.LightningStorm(this, aMarkPiece_4, this.mFullLaser ? Game.LightningStorm.EStormType.BOTH : Game.LightningStorm.EStormType.SHORT);
                                                    this.mLightningStorms.push(aStorm);
                                                }
                                            } else if((aMarkPiece_4.mChangedTick == this.mUpdateCnt) && (aMarkPiece_4.mColor != Game.DM.EGemColor._INVALID)) {
                                                if((aMarkPiece_4.mFlags == 0) || (aMarkPiece_4.IsFlagSet(Game.Piece.EFlag.FLAME))) {
                                                    if(this.AllowPowerups()) {
                                                        if(this.WantsTutorial(Game.DM.ETutorial.LASER)) {
                                                            this.DeferTutorialDialog(Game.DM.ETutorial.LASER, aMarkPiece_4);
                                                            isSetBulging = true;
                                                        } else if(!isSetBulging) {
                                                            aMarkPiece_4.mScale.SetConstant(1.0);
                                                            aMarkPiece_4.mChangedTick = this.mUpdateCnt;
                                                            if(aPowerupPieceSet.indexOf(aMarkPiece_4) == -1) {
                                                                aPowerupPieceSet.push(aMarkPiece_4);
                                                            }
                                                            aMarkPiece_4.mMoveCreditId = aMoveCreditId;
                                                            if(aDeferLaserSet.indexOf(aMarkPiece_4) == -1) {
                                                                aDeferLaserSet.push(aMarkPiece_4);
                                                            }
                                                        }
                                                    } else {
                                                    }
                                                    isCandidate = false;
                                                }
                                            } else if(aMarkPiece_4.mChangedTick != this.mUpdateCnt) {
                                                isCandidate = (aMarkPiece_4.mFlags == 0);
                                                if(justSwapped) {
                                                    aMarkPiece_4.mScale.SetCurve('b+1,1.2,0.333333,1,#+Ky         ~~###');
                                                } else if(this.WantBulgeCascades()) {
                                                    aMarkPiece_4.mScale.SetCurve('b+1,1.22,0.033333,1,#+Kx      uw*7u   ,~###');
                                                } else {
                                                    aMarkPiece_4.mScale.SetCurve('b+1,1.22,0.066667,1,#+Kx      uw*7t   ,~###');
                                                }
                                                aMarkPiece_4.mRotPct = 0.0;
                                                aMarkPiece_4.mScale.mIncRate *= this.GetMatchSpeed();
                                                aMarkPiece_4.mChangedTick = this.mUpdateCnt;
                                                aMarkPiece_4.mLastColor = aMarkPiece_4.mColor;
                                                if(aTallyPieceSet.indexOf(aMarkPiece_4) == -1) {
                                                    aTallyPieceSet.push(aMarkPiece_4);
                                                }
                                            }
                                            if(isCandidate) {
                                                if(aMarkPiece_4.mLastActiveTick > aNewestTime) {
                                                    aNewestTime = aMarkPiece_4.mLastActiveTick;
                                                    aNewestPowerupCandidates.length = 0;
                                                }
                                                if(aMarkPiece_4.mLastActiveTick == aNewestTime) {
                                                    aNewestPowerupCandidates.push(aMarkPiece_4);
                                                }
                                                aPowerupCandidates.push(aMarkPiece_4);
                                            }
                                        }
                                    }
                                }
                                if(aPowerupCandidates.length > 0) {
                                    var aPowerupPiece = aNewestPowerupCandidates[((((aNewestPowerupCandidates.length / 2) | 0)) | 0)];
                                    for(var anIdx = 0; anIdx < (aPowerupCandidates.length | 0); anIdx++) {
                                        var aTestPiece = aPowerupCandidates[anIdx];
                                        var aSide1;
                                        var aSide2;
                                        if(i_2 == 0) {
                                            aSide1 = this.GetPieceAtRowCol(aTestPiece.mRow, aTestPiece.mCol + 1);
                                            aSide2 = this.GetPieceAtRowCol(aTestPiece.mRow, aTestPiece.mCol - 1);
                                        } else {
                                            aSide1 = this.GetPieceAtRowCol(aTestPiece.mRow + 1, aTestPiece.mCol);
                                            aSide2 = this.GetPieceAtRowCol(aTestPiece.mRow - 1, aTestPiece.mCol);
                                        }
                                        if((aSide1 != null) && (aSide1.mColor == aTestPiece.mColor) && (aSide2 != null) && (aSide2.mColor == aTestPiece.mColor)) {
                                            aPowerupPiece = aTestPiece;
                                        }
                                    }
                                    var aStartDist = (Math.max(Math.abs(aFirstMatchCol - aPowerupPiece.mCol), Math.abs(aFirstMatchRow - aPowerupPiece.mRow)) | 0);
                                    var anEndDist = (Math.max(Math.abs(aLastMatchCol - aPowerupPiece.mCol), Math.abs(aLastMatchRow - aPowerupPiece.mRow)) | 0);
                                    var aPowerupPieceBackup = null;
                                    for(var aDist_2 = 1; aDist_2 <= 2; aDist_2++) {
                                        if(aStartDist > anEndDist) {
                                            if(i_2 == 0) {
                                                aPowerupPieceBackup = this.GetPieceAtRowCol(((Math.max(aFirstMatchRow, aPowerupPiece.mRow - aDist_2)) | 0), aPowerupPiece.mCol);
                                            } else {
                                                aPowerupPieceBackup = this.GetPieceAtRowCol(aPowerupPiece.mRow, ((Math.max(aFirstMatchCol, aPowerupPiece.mCol - aDist_2)) | 0));
                                            }
                                        } else {
                                            if(i_2 == 0) {
                                                aPowerupPieceBackup = this.GetPieceAtRowCol(((Math.min(aLastMatchRow, aPowerupPiece.mRow + aDist_2)) | 0), aPowerupPiece.mCol);
                                            } else {
                                                aPowerupPieceBackup = this.GetPieceAtRowCol(aPowerupPiece.mRow, ((Math.min(aLastMatchCol, aPowerupPiece.mCol + aDist_2)) | 0));
                                            }
                                        }
                                        if(aPowerupPieceBackup != null && aPowerupPieceBackup.mFlags == 0) {
                                            break;
                                        }
                                    }
                                    if(this.AllowPowerups()) {
                                        if((aMatchCount >= 6) && (aPowerupPiece.CanSetFlag(Game.Piece.EFlag.LASER)) && (aPowerupPiece.CanSetFlag(Game.Piece.EFlag.FLAME))) {
                                            if(this.WantsTutorial(Game.DM.ETutorial.SUPERNOVA)) {
                                                this.DeferTutorialDialog(Game.DM.ETutorial.SUPERNOVA, aPowerupPiece);
                                                isSetBulging = true;
                                            } else if(!isSetBulging) {
                                                aPowerupPiece.mMoveCreditId = aMoveCreditId;
                                                if(aPowerupPieceBackup != null) {
                                                    aPowerupPieceBackup.mMoveCreditId = aMoveCreditId;
                                                }
                                                var findIdx = aDeferPowerupMapPiece.indexOf(aPowerupPiece);
                                                if(findIdx != -1) {
                                                    aDeferPowerupMapPiece.removeAt(findIdx);
                                                }
                                                aDeferPowerupMapPiece.push(aPowerupPiece);
                                                aDeferPowerupMapInt.push(aMatchCount);
                                                aDeferPowerupMapPieceBackup.push(aPowerupPieceBackup);
                                            }
                                        } else if((aMatchCount >= 5) && (!aPowerupPiece.IsFlagSet(Game.Piece.EFlag.LASER)) && (aBulgeTriggerPieceSet.indexOf(aPowerupPiece) == -1)) {
                                            if(this.WantsTutorial(Game.DM.ETutorial.HYPERCUBE)) {
                                                this.DeferTutorialDialog(Game.DM.ETutorial.HYPERCUBE, aPowerupPiece);
                                                isSetBulging = true;
                                            } else if(!isSetBulging) {
                                                aPowerupPiece.mMoveCreditId = aMoveCreditId;
                                                if(aPowerupPieceBackup != null) {
                                                    aPowerupPieceBackup.mMoveCreditId = aMoveCreditId;
                                                }
                                                var findIdx_2 = aDeferPowerupMapPiece.indexOf(aPowerupPiece);
                                                if(findIdx_2 != -1) {
                                                    aDeferPowerupMapPiece.removeAt(findIdx_2);
                                                }
                                                aDeferPowerupMapPiece.push(aPowerupPiece);
                                                aDeferPowerupMapInt.push(aMatchCount);
                                                aDeferPowerupMapPieceBackup.push(aPowerupPieceBackup);
                                            }
                                        } else if(aMatchCount >= 4) {
                                            if(this.WantsTutorial(Game.DM.ETutorial.FLAME)) {
                                                this.DeferTutorialDialog(Game.DM.ETutorial.FLAME, aPowerupPiece);
                                                isSetBulging = true;
                                            } else if(!isSetBulging) {
                                                aPowerupPiece.mMoveCreditId = aMoveCreditId;
                                                if(aPowerupPieceBackup != null) {
                                                    aPowerupPieceBackup.mMoveCreditId = aMoveCreditId;
                                                }
                                                var findIdx_3 = aDeferPowerupMapPiece.indexOf(aPowerupPiece);
                                                if(findIdx_3 != -1) {
                                                    aDeferPowerupMapPiece.removeAt(findIdx_3);
                                                }
                                                aDeferPowerupMapPiece.push(aPowerupPiece);
                                                aDeferPowerupMapInt.push(aMatchCount);
                                                aDeferPowerupMapPieceBackup.push(aPowerupPieceBackup);
                                            }
                                        }
                                    }
                                    if(this.CreateMatchPowerup(aMatchCount, aPowerupPiece, aTallyPieceSet)) {
                                        aPowerupPiece.mScale.SetConstant(1.0);
                                    }
                                }
                                if(isSetBulging) {
                                    for(var aMarkRow_5 = aFirstMatchRow; aMarkRow_5 <= aLastMatchRow; aMarkRow_5++) {
                                        for(var aMarkCol_5 = aFirstMatchCol; aMarkCol_5 <= aLastMatchCol; aMarkCol_5++) {
                                            var aMarkPiece_5 = this.mBoard[this.mBoard.mIdxMult0 * (aMarkRow_5) + aMarkCol_5];
                                            if(aMarkPiece_5 != null) {
                                                if(aBulgeTriggerPieceSet.indexOf(aMarkPiece_5) == -1) {
                                                    aBulgeTriggerPieceSet.push(aMarkPiece_5);
                                                }
                                                var findIdx_4 = aDeferLaserSet.indexOf(aMarkPiece_5);
                                                if(findIdx_4 != -1) {
                                                    aDeferLaserSet.removeAt(findIdx_4);
                                                }
                                            }
                                        }
                                    }
                                }
                                aMatchedSets.push(aMatchSet);
                            }
                        }
                        aLastType = aCurType;
                        aMatchCount = 1;
                        isFutureMatch = !isPieceStill;
                        aFirstMatchCol = aCol;
                        aFirstMatchRow = aRow;
                        aLastMatchCol = aCol;
                        aLastMatchRow = aRow;
                    }
                }
            }
        }
        for(var anExplodeIdx = 0; anExplodeIdx < (aDeferExplodeVector.length | 0); anExplodeIdx++) {
            var aPiece_2 = aDeferExplodeVector[anExplodeIdx];
            aPiece_2.mExplodeDelay = 1;
            aPiece_2.mExplodeSourceId = aPiece_2.mId;
            aPiece_2.mExplodeSourceFlags |= aPiece_2.mFlags;
            aPiece_2.mScale.SetConstant(1.0);
            aPiece_2.mIsPieceStill = false;
        }
        for(var i_3 = 0; i_3 < aDeferLaserSet.length; ++i_3) {
            var aPiece_3 = aDeferLaserSet[i_3];
            if((aPiece_3.IsFlagSet(Game.Piece.EFlag.FLAME)) || (aPiece_3.IsFlagSet(Game.Piece.EFlag.BLAST_GEM))) {
                aPiece_3.mExplodeDelay = 1;
                aPiece_3.mExplodeSourceId = aPiece_3.mId;
                aPiece_3.mExplodeSourceFlags = aPiece_3.mFlags;
                aPiece_3.mIsPieceStill = false;
                aPiece_3.mFlags = 0;
            }
            if(this.AllowLaserGems()) {
                this.AddToStatCred(Game.DM.EStat.GEMS_CLEARED, 1, aPiece_3.mMoveCreditId);
                this.AddToStatCred(Game.DM.EStat.LASERGEMS_MADE, 1, aPiece_3.mMoveCreditId);
                this.Laserify(aPiece_3);
            } else {
                this.AddToStatCred(Game.DM.EStat.GEMS_CLEARED, 1, aPiece_3.mMoveCreditId);
                this.AddToStatCred(Game.DM.EStat.FLAMEGEMS_MADE, 1, aPiece_3.mMoveCreditId);
                this.Flamify(aPiece_3);
            }
        }
        for(var i_4 = 0; i_4 < aDeferPowerupMapPiece.length; ++i_4) {
            var aPowerupPiece_2 = aDeferPowerupMapPiece[i_4];
            if(aPowerupPiece_2.IsFlagSet(Game.Piece.EFlag.LASER)) {
                aPowerupPiece_2 = aDeferPowerupMapPieceBackup[i_4];
            }
            if((aPowerupPiece_2.mFlags == 0) && (aBulgeTriggerPieceSet.indexOf(aPowerupPiece_2) == -1)) {
                if(aPowerupPieceSet.indexOf(aPowerupPiece_2) == -1) {
                    aPowerupPieceSet.push(aPowerupPiece_2);
                }
                if(aDeferPowerupMapInt[i_4] > 5) {
                    this.AddToStatCred(Game.DM.EStat.GEMS_CLEARED, 1, aPowerupPiece_2.mMoveCreditId);
                    this.AddToStatCred(Game.DM.EStat.FLAMEGEMS_MADE, 1, aPowerupPiece_2.mMoveCreditId);
                    this.AddToStatCred(Game.DM.EStat.LASERGEMS_MADE, 1, aPowerupPiece_2.mMoveCreditId);
                    this.AddToStatCred(Game.DM.EStat.SUPERNOVAS_MADE, 1, aPowerupPiece_2.mMoveCreditId);
                    this.Laserify(aPowerupPiece_2);
                    this.Flamify(aPowerupPiece_2);
                    aPowerupPiece_2.mScale.SetConstant(1.0);
                } else if(aDeferPowerupMapInt[i_4] > 4) {
                    this.AddToStatCred(Game.DM.EStat.GEMS_CLEARED, 1, aPowerupPiece_2.mMoveCreditId);
                    this.AddToStatCred(Game.DM.EStat.HYPERCUBES_MADE, 1, aPowerupPiece_2.mMoveCreditId);
                    this.Hypercubeify(aPowerupPiece_2);
                    aPowerupPiece_2.mScale.SetConstant(1.0);
                } else {
                    this.Flamify(aPowerupPiece_2);
                    this.AddToStatCred(Game.DM.EStat.GEMS_CLEARED, 1, aPowerupPiece_2.mMoveCreditId);
                    this.AddToStatCred(Game.DM.EStat.FLAMEGEMS_MADE, 1, aPowerupPiece_2.mMoveCreditId);
                }
                aPowerupPiece_2.mChangedTick = this.mUpdateCnt;
                if((aPowerupPiece_2.mColor != Game.DM.EGemColor._INVALID) && (aPowerupPiece_2.mColor != Game.DM.EGemColor.HYPERCUBE)) {
                    aPowerupPiece_2.mLastColor = aPowerupPiece_2.mColor;
                }
                aPowerupPiece_2.mScale.SetConstant(1.0);
                aPowerupPiece_2.mIsPieceStill = false;
            }
        }
        if(aMatchedSets.length > 0) {
            this.ProcessMatches(aMatchedSets, aTallyPieceSet, fromUpdateSwapping);
        }
        var doMatchSounds = false;
        for(var aSetIdx = 0; aSetIdx < (aMatchedSets.length | 0); aSetIdx++) {
            var aMatchSet_2 = aMatchedSets[aSetIdx];
            var aSpecialPiece = null;
            var isLaserifying = false;
            var isBulging = false;
            var aTotalX = 0;
            var aTotalY = 0;
            for(var aPieceIdx = 0; aPieceIdx < (aMatchSet_2.mPieces.length | 0); aPieceIdx++) {
                var aPiece_4 = aMatchSet_2.mPieces[aPieceIdx];
                aPiece_4.mIsPieceStill = false;
                aTotalX += (aPiece_4.GetScreenX() | 0);
                aTotalY += (aPiece_4.GetScreenY() | 0);
                if(aPowerupPieceSet.indexOf(aPiece_4) != -1) {
                    aSpecialPiece = aPiece_4;
                }
                if((aPiece_4.IsFlagSet(Game.Piece.EFlag.LASER)) && (aPiece_4.mChangedTick != this.mUpdateCnt)) {
                    isLaserifying = true;
                }
                if(aBulgeTriggerPieceSet.indexOf(aPiece_4) != -1) {
                    isBulging = true;
                }
            }
            if((fromUpdateSwapping) && (this.mSpeedBonusFlameModePct > 0)) {
                var aLatestTick = 0;
                var aBestPiece = null;
                for(var aPieceIdx_2 = 0; aPieceIdx_2 < (aMatchSet_2.mPieces.length | 0); aPieceIdx_2++) {
                    var aPiece_5 = aMatchSet_2.mPieces[aPieceIdx_2];
                    if(aPiece_5.mSwapTick > aLatestTick) {
                        aBestPiece = aPiece_5;
                        aLatestTick = aPiece_5.mSwapTick;
                    }
                }
                if(aBestPiece != null) {
                    aBestPiece.SetFlag(Game.Piece.EFlag.INFERNO_SWAP);
                    this.AddToStat(Game.DM.EStat.BLAZING_SPEED_EXPLOSION, 1);
                    aBestPiece.mExplodeDelay = 1;
                    aBestPiece.mExplodeSourceId = aBestPiece.mId;
                    aBestPiece.mExplodeSourceFlags |= aBestPiece.mFlags;
                    aBestPiece.mIsPieceStill = false;
                }
            }
            if(isBulging) {
                for(var aPieceIdx_3 = 0; aPieceIdx_3 < (aMatchSet_2.mPieces.length | 0); aPieceIdx_3++) {
                    var aPiece_6 = aMatchSet_2.mPieces[aPieceIdx_3];
                    aPiece_6.mIsPieceStill = false;
                    aPiece_6.mScale.SetCurve('b+0,2,0.006667,1,PzL;  >l### ~H### P`### qK### fV###ZP###');
                    aPiece_6.mIsBulging = true;
                    aPiece_6.mExplodeDelay = 0;
                    aPiece_6.mExplodeSourceId = aPiece_6.mId;
                    aPiece_6.mExplodeSourceFlags |= aPiece_6.mFlags;
                    var aStormIdx_2 = this.FindStormIdxFor(aPiece_6);
                    if(aStormIdx_2 != -1) {
                        this.mLightningStorms.removeAt(aStormIdx_2);
                    }
                    if(aPowerupPieceSet.indexOf(aPiece_6) == -1) {
                        aPowerupPieceSet.push(aPiece_6);
                    }
                }
            } else {
                doMatchSounds = true;
                if(isLaserifying) {
                    for(var aPieceIdx_4 = 0; aPieceIdx_4 < (aMatchSet_2.mPieces.length | 0); aPieceIdx_4++) {
                        var aPiece_7 = aMatchSet_2.mPieces[aPieceIdx_4];
                        aPiece_7.mScale.SetConstant(1.0);
                        aPiece_7.mCanMatch = false;
                    }
                } else {
                    if(aSpecialPiece != null) {
                        for(var aPieceIdx_5 = 0; aPieceIdx_5 < (aMatchSet_2.mPieces.length | 0); aPieceIdx_5++) {
                            var aPiece_8 = aMatchSet_2.mPieces[aPieceIdx_5];
                            if((aPiece_8 != aSpecialPiece) && (aPiece_8.mFlags == 0)) {
                                aPiece_8.mIsPieceStill = false;
                                aPiece_8.mScale.SetCurve('b+0,1,0.033333,1,~zL>         %]Bt(|#:M@');
                                aPiece_8.mScale.mIncRate *= this.GetMatchSpeed();
                                aPiece_8.mDestPct.SetCurve('b+0,1,0.033333,1,#.ht         ~~W[d');
                                aPiece_8.mDestPct.mIncRate *= this.GetMatchSpeed();
                                aPiece_8.mAlpha.SetCurve('b+0,1,0.033333,1,~r)6         H;?D,X#>3Z');
                                aPiece_8.mAlpha.mIncRate *= this.GetMatchSpeed();
                                aPiece_8.mDestCol = aSpecialPiece.mCol;
                                aPiece_8.mDestRow = aSpecialPiece.mRow;
                                var aDirX = aSpecialPiece.mCol - aPiece_8.mCol;
                                var aDirY = aSpecialPiece.mRow - aPiece_8.mRow;
                                if(aSpecialPiece.IsFlagSet(Game.Piece.EFlag.FLAME)) {
                                    var anEffect = new Game.PopAnimEffect(Game.Resources['POPANIM_FLAMEGEMCREATION']);
                                    anEffect.mPieceIdRel = aPiece_8.mId;
                                    anEffect.mX = aPiece_8.CX();
                                    anEffect.mY = aPiece_8.CY();
                                    anEffect.mOverlay = true;
                                    anEffect.mDoubleSpeed = true;
                                    if(aDirX != 0) {
                                        anEffect.Play$2('smear horizontal');
                                        if(aDirX < 0) {
                                            anEffect.mAngle = Game.MathUtil.PI;
                                        }
                                    } else {
                                        anEffect.Play$2('smear vertical');
                                        if(aDirY < 0) {
                                            anEffect.mAngle = Game.MathUtil.PI;
                                        }
                                    }
                                    this.mPostFXManager.AddEffect(anEffect);
                                }
                            }
                        }
                    }
                }
                var aMatchCount_2 = (aMatchSet_2.mPieces.length | 0);
                var anAvgX = ((aTotalX / aMatchCount_2) | 0);
                var anAvgY = ((aTotalY / aMatchCount_2) | 0);
                aCumSetX += anAvgX;
                aCumSetY += anAvgY;
                var aNumPoints = 0;
                this.AddToStatCred(Game.DM.EStat.MATCHES, 1, aMatchSet_2.mMoveCreditId);
                var aComboCount = ((Math.max(1, this.GetMoveStat(aMatchSet_2.mMoveCreditId, Game.DM.EStat.MATCHES))) | 0);
                aNumPoints = 50 * aComboCount + (aMatchCount_2 - 3) * 50;
                if(aMatchCount_2 >= 5) {
                    aNumPoints += (aMatchCount_2 - 4) * 350;
                }
                this.AddPoints(anAvgX + ((Game.Board.GEM_WIDTH / 2) | 0), anAvgY + ((Game.Board.GEM_HEIGHT / 2) | 0) - 8, aNumPoints, Game.DM.gPointColors[(aMatchSet_2.mPieces[0].mColor | 0) + 1], aMatchSet_2.mMatchId, true, true, aMatchSet_2.mMoveCreditId, false, Game.Board.EPointType.MATCH);
                this.MaxStatCred(Game.DM.EStat.BIGGESTMATCH, aMatchCount_2, aMatchSet_2.mMoveCreditId);
                if(aMoveCreditSet.indexOf(aMatchSet_2.mMoveCreditId) == -1) {
                    aMoveCreditSet.push(aMatchSet_2.mMoveCreditId);
                }
            }
        }
        if(doMatchSounds) {
            var aPan = this.GetPanPosition(((aCumSetX / aFoundCount) | 0) + ((Game.Board.GEM_WIDTH / 2) | 0));
            if(aFoundCount > 1) {
                Game.SoundUtil.PlayEx(Game.Resources['SOUND_DOUBLESET'], aPan, 1.0);
            }
            var aComboSoundIdx = this.GetMaxMovesStat(Game.DM.EStat.CASCADES) + 1;
            if(aFoundChains == 0) {
                aComboSoundIdx = 1;
            }
            if(aComboSoundIdx > 6) {
                aComboSoundIdx = 6;
            }
            if((fromUpdateSwapping) && (this.mSpeedBonusCount > 0)) {
                if(this.mSpeedBonusNum > 0.01) {
                    Game.SoundUtil.PlayEx(Game.Resources['SOUND_FLAMESPEED1'], aPan, 1.0);
                } else {
                    Game.SoundUtil.PlayEx(GameFramework.BaseApp.mApp.mResourceManager.GetSoundResourceById('SOUND_SPEEDMATCH' + (Math.min(8 + 1, this.mSpeedBonusCount + 1) | 0)), aPan, 1.0);
                }
            } else {
                Game.SoundUtil.PlayEx(GameFramework.BaseApp.mApp.mResourceManager.GetSoundResourceById('SOUND_COMBO_' + (aComboSoundIdx + 1)), aPan, 1.0);
            }
            for(var i_5 = 0; i_5 < aMoveCreditSet.length; ++i_5) {
                this.AddToStatCred(Game.DM.EStat.CASCADES, 1, aMoveCreditSet[i_5]);
            }
        }
        for(var i_6 = 0; i_6 < aTallyPieceSet.length; ++i_6) {
            var aPiece_9 = aTallyPieceSet[i_6];
            aPiece_9.mIsPieceStill = false;
            if(!aPiece_9.mIsBulging) {
                this.TallyPiece(aPiece_9, aPowerupPieceSet.indexOf(aPiece_9) == -1);
            }
        }
        if(hadFutureMatches && fromUpdateSwapping) {
            if(aDelayingPieceSet.indexOf(thePiece1) != -1 || aDelayingPieceSet.indexOf(thePiece2) != -1) {
                return 2;
            }
        }
        return (aFoundCount > 0) ? 1 : 0;
    },
    ShowHint : function Game_Board$ShowHint(fromButton) {
        if(this.mAutohintOverridePieceId != -1) {
            var p = this.GetPieceById(this.mAutohintOverridePieceId);
            if(p != null) {
                this.ShowPieceHint(p, false);
            }
            this.mWantHintTicks = 0;
            return;
        }
        if(fromButton) {
            this.mHintCooldownTicks = 150;
        }
        this.mWantHintTicks = 0;
        if(!fromButton && !this.mShowAutohints) {
            return;
        }
        var aCoords = Array.Create(4, 0);
        if(this.FindRandomMove(aCoords)) {
            var aPiece = this.mBoard[this.mBoard.mIdxMult0 * (aCoords[3]) + aCoords[2]];
            var aPiece2 = this.mBoard[this.mBoard.mIdxMult0 * (aCoords[1]) + aCoords[0]];
            if((aPiece2 != null) && (aPiece2.IsFlagSet(Game.Piece.EFlag.HYPERCUBE))) {
                aPiece = aPiece2;
            }
            this.ShowPieceHint(aPiece, fromButton);
        }
    },
    ButtonDown : function Game_Board$ButtonDown(e) {
        Game.SoundUtil.Play(Game.Resources['SOUND_BUTTON_PRESS']);
    },
    HintButtonPressed : function Game_Board$HintButtonPressed(e) {
        var aStep = this.mTutorialMgr.GetCurrentStep();
        if(aStep != null) {
            if(!aStep.mAllowStandardHints) {
                return;
            }
            if(aStep.mSpecialBehavior == Game.TutorialStep.ESpecialBehavior.HintBtn) {
                aStep.Finish();
            }
        }
        Game.SoundUtil.Play(Game.Resources['SOUND_BUTTON_RELEASE']);
        this.ShowHint(true);
        this.mHintButton.SetMouseVisible(false);
        this.AddToStat(Game.DM.EStat.HINT_USED, 1);
    },
    MenuButtonPressed : function Game_Board$MenuButtonPressed(e) {
        Game.SoundUtil.Play(Game.Resources['SOUND_BUTTON_RELEASE']);
        var aMenu = new Game.OptionsDialog(true);
        Game.BejApp.mBejApp.mDialogMgr.AddDialog(aMenu);
        aMenu.mX = this.GetBoardCenterX() - aMenu.mWidth / 2;
        aMenu.mY = 200;
        aMenu.AddEventListener(GameFramework.widgets.DialogEvent.CLOSED, ss.Delegate.create(this, this.handleGameMenuClosed));
    },
    handleGameMenuClosed : function Game_Board$handleGameMenuClosed(e) {
        if((e).mCloseResult == (Game.OptionsDialog.EResult.BackToMain | 0)) {
            this.BackToMenu();
        } else if((e).mCloseResult == (Game.OptionsDialog.EResult.LaunchTutorial | 0)) {
            this.mWantReset = true;
        }
        if(!this.mTutorialMgr.GetTutorialEnabled() && this.IsTutorialBusy()) {
            this.mTutorialMgr.Kill();
            var d = Game.BejApp.mBejApp.mDialogMgr.GetDialog(Game.DM.EDialog.TUTORIAL);
            if(d != null) {
                d.Kill();
            }
        }
    },
    ResetButtonPressed : function Game_Board$ResetButtonPressed(e) {
        Game.SoundUtil.Play(Game.Resources['SOUND_BUTTON_RELEASE']);
        if(this.mTutorialMgr.IsBusy()) {
            return;
        }
        if(this.mGameOverCount == 0) {
            var aDialog = Game.BejApp.mBejApp.DoModalDialog('RESET', 'Abandon the current game and start over?', '', GameFramework.widgets.Dialog.BUTTONS_YES_NO, Game.DM.EDialog.RESET);
            var aWidth = 850;
            aDialog.Resize(this.GetBoardCenterX() - ((aWidth / 2) | 0), 350, aWidth, aDialog.GetPreferredHeight(aWidth));
            aDialog.AddEventListener(GameFramework.widgets.DialogEvent.CLOSED, ss.Delegate.create(this, this.handleResetDialogClosed));
        }
    },
    handleResetDialogClosed : function Game_Board$handleResetDialogClosed(theEvent) {
        if((theEvent).WasYesPressed()) {
            this.mWantReset = true;
        }
    },
    ShowPieceHint : function Game_Board$ShowPieceHint(thePiece, theShowArrow) {
        thePiece.mHintScale.SetCurve('b+1,1.5,0.033333,1,#+Kx  >~###       c####');
        thePiece.mHintAlpha.SetCurve('b+0,1,0.006667,1,#### ;~###       O~### 9####');
        thePiece.mHintArrowPos.SetCurve('b+80,64,0.006667,1,####  &}### |####  #~### z####  &~###');
        if(this.WantsCalmEffects()) {
            thePiece.mHintScale.mIncRate *= 0.5;
            thePiece.mHintAlpha.mIncRate *= 0.5;
            thePiece.mHintArrowPos.mIncRate *= 0.5;
        }
        if(theShowArrow) {
            var anEffect = new Game.ParticleEffect(Game.Resources['PIEFFECT_HINTFLASH']);
            anEffect.mPieceIdRel = thePiece.mId;
            anEffect.mDoubleSpeed = true;
            this.mPostFXManager.AddEffect(anEffect);
        }
    },
    FillInBlanks : function Game_Board$FillInBlanks() {
        this.FillInBlanksEx(true);
    },
    FillInBlanksEx : function Game_Board$FillInBlanksEx(allowCascades) {
        if(this.mNeverAllowCascades) {
            allowCascades = false;
        }
        if(this.mGameOverPiece != null) {
            return;
        }
        for(var aRow = this.mBottomFillRow; aRow >= 0; aRow--) {
            for(var aCol = 0; aCol < 8; aCol++) {
                var aPiece = this.mBoard[this.mBoard.mIdxMult0 * (aRow) + aCol];
                if((aPiece != null) && (aPiece.mExplodeDelay > 0)) {
                    return;
                }
            }
        }
        var aNewPieceVector = [];
        var aGravityFactor = 0.265 * this.GetGravityFactor();
        var movedPieces;
        do {
            movedPieces = false;
            for(var aCol_2 = 0; aCol_2 < 8; aCol_2++) {
                var colFalling = false;
                var aTopY = -this.GetBoardY();
                var aMoveCreditId = this.mNextColumnCredit[aCol_2];
                var aLastFallVelocity = this.mBumpVelocities[aCol_2];
                var aFallStart = 0;
                var aFallCount = 0;
                for(var aRow_2 = this.mBottomFillRow; aRow_2 >= 0; aRow_2--) {
                    var aPiece_2 = this.mBoard[this.mBoard.mIdxMult0 * (aRow_2) + aCol_2];
                    if(aPiece_2 != null) {
                        aPiece_2.mCanMatch = true;
                        if(aPiece_2.mY < aTopY) {
                            aTopY = (aPiece_2.mY | 0);
                        }
                        if((colFalling) && ((this.IsPieceSwapping(aPiece_2)) || (aPiece_2.mDestPct.IsDoingCurve()) || (aPiece_2.mDestRow == -1) || (this.IsPieceMatching(aPiece_2)))) {
                            aFallCount = 0;
                            this.mBoard[this.mBoard.mIdxMult0 * (aRow_2 + 1) + aCol_2] = null;
                            colFalling = false;
                        }
                        if(colFalling) {
                            movedPieces = true;
                            if(aPiece_2.mFallVelocity == 0.0) {
                                aPiece_2.mFallVelocity += this.mBumpVelocities[aCol_2] + 1;
                                aPiece_2.mLastActiveTick = this.mUpdateCnt;
                            }
                            aFallCount++;
                            aLastFallVelocity = aPiece_2.mFallVelocity;
                            aPiece_2.mRow++;
                            aPiece_2.mIsPieceStill = false;
                            this.mBoard[this.mBoard.mIdxMult0 * (aRow_2) + aCol_2] = null;
                            this.mBoard[this.mBoard.mIdxMult0 * (aRow_2 + 1) + aCol_2] = aPiece_2;
                            aMoveCreditId = aPiece_2.mMoveCreditId;
                        }
                    } else {
                        if(colFalling) {
                            this.mBoard[this.mBoard.mIdxMult0 * (aRow_2 + 1) + aCol_2] = null;
                            aFallCount++;
                        } else {
                            aFallStart = aRow_2;
                            aFallCount = 0;
                            colFalling = true;
                        }
                    }
                }
                if(colFalling) {
                    movedPieces = true;
                    var aPiece_3 = this.CreateNewPiece(0, aCol_2);
                    aPiece_3.mFallVelocity = aLastFallVelocity - 0.55;
                    aPiece_3.mMoveCreditId = aMoveCreditId;
                    aPiece_3.mIsPieceStill = false;
                    aPiece_3.mY = aTopY - Game.Board.GEM_HEIGHT - (this.mRand.Next() % 15) - 10.0;
                    if(aPiece_3.GetScreenY() > -Game.Board.GEM_HEIGHT) {
                        aPiece_3.mY = -Game.Board.GEM_HEIGHT - this.GetBoardY();
                    }
                    aNewPieceVector.push(aPiece_3);
                    var aPiecesAbove = 0;
                    for(var aRow_3 = this.mBottomFillRow; aRow_3 >= 0; aRow_3--) {
                        var aFillPiece = this.mBoard[this.mBoard.mIdxMult0 * (aRow_3) + aCol_2];
                        if(aFillPiece != null) {
                            var aY = aFillPiece.GetScreenY();
                            if(aFillPiece.GetScreenY() < -this.GetBoardY()) {
                                aPiecesAbove++;
                                aY = -aPiecesAbove * Game.Board.GEM_HEIGHT * 2 - this.GetBoardY();
                            }
                        }
                    }
                }
                this.mNextColumnCredit[aCol_2] = -1;
            }
        } while(movedPieces);
        if(aNewPieceVector.length > 0) {
            var aTryCount = 0;
            var done = this.AllowNoMoreMoves();
            var wantSpecial = this.WantSpecialPiece(aNewPieceVector);
            var specialDropped = false;
            var hyperMixerDropped = false;
            var aGemList = this.GetNewGemColors();
            for(; ;) {
                specialDropped = false;
                for(var aGemNum = 0; aGemNum < (aNewPieceVector.length | 0); aGemNum++) {
                    aNewPieceVector[aGemNum].ClearFlags();
                    aNewPieceVector[aGemNum].mColor = Game.DM.EGemColor._INVALID;
                    aNewPieceVector[aGemNum].mCanDestroy = true;
                    aNewPieceVector[aGemNum].mCanMatch = true;
                    aNewPieceVector[aGemNum].mCounter = 0;
                }
                if(wantSpecial) {
                    specialDropped = this.DropSpecialPiece(aNewPieceVector);
                }
                if(this.WantHyperMixers()) {
                    var doHyperCube = true;

                    {
                        var $srcArray14 = this.mBoard;
                        for(var $enum14 = 0; $enum14 < $srcArray14.length; $enum14++) {
                            var aPiece_4 = $srcArray14[$enum14];
                            if(aPiece_4 != null && this.IsHypermixerCancelledBy(aPiece_4)) {
                                doHyperCube = false;
                                break;
                            }
                        }
                    }
                    if(doHyperCube) {
                        var aCoords = Array.Create(4, 0);
                        var dropHyper = false;
                        if(this.WantHypermixerBottomCheck() && this.FindMove(aCoords, 0, true, true, true, null, false)) {
                            if(aCoords[1] < this.mHypermixerCheckRow && aCoords[3] < this.mHypermixerCheckRow) {
                                dropHyper = true;
                            }
                        }
                        if(!dropHyper && this.WantHypermixerEdgeCheck()) {
                            var pieceId = 0;
                            var foundL = false;
                            var foundR = false;
                            while((!foundL || !foundR) && this.FindMove(aCoords, pieceId++, true, true, false, null, false)) {
                                if(aCoords[0] <= 3 || aCoords[2] <= 3) {
                                    foundL = true;
                                }
                                if(aCoords[0] >= this.mColCount - 4 || aCoords[2] >= this.mColCount - 4) {
                                    foundR = true;
                                }
                            }
                            if(!foundL || !foundR) {
                                dropHyper = true;
                            }
                        }
                        if(dropHyper) {
                            for(; ;) {
                                var aPiece_5 = aNewPieceVector[((GameFramework.Utils.GetRandFloatU() * aNewPieceVector.length) | 0)];
                                if(aPiece_5.mFlags == 0) {
                                    aPiece_5.mColor = Game.DM.EGemColor._INVALID;
                                    aPiece_5.SetFlag(Game.Piece.EFlag.HYPERCUBE);
                                    hyperMixerDropped = true;
                                    this.HypermixerDropped();
                                    break;
                                }
                            }
                        }
                    }
                }
                for(var aGemNum_2 = 0; aGemNum_2 < (aNewPieceVector.length | 0); aGemNum_2++) {
                    var aPiece_6 = aNewPieceVector[aGemNum_2];
                    if(aPiece_6.mFlags == 0 || aPiece_6.IsFlagSet(Game.Piece.EFlag.BOMB) || aPiece_6.IsFlagSet(Game.Piece.EFlag.REALTIME_BOMB)) {
                        aPiece_6.mColor = aGemList[(this.mRand.NextRange((aGemList.length | 0)) | 0)];
                    }
                    var aTryThresh = this.mHasBoardSettled ? 200 : 200000;
                    if((aTryCount >= aTryThresh) && (aGemNum_2 == 0)) {
                        allowCascades = true;
                        done = true;
                    }
                }
                if(this.TryingDroppedPieces(aNewPieceVector, aTryCount)) {
                    if(this.FindMove(null, 0, true, true, false, null, aTryCount < this.GetPowerGemThreshold())) {
                        done = true;
                    }
                }
                if(!allowCascades) {
                    if(this.HasSet()) {
                        done = false;
                    }
                }
                if(this.HasIllegalSet()) {
                    done = false;
                }
                if(done) {
                    if(!this.PiecesDropped(aNewPieceVector)) {
                        done = false;
                    }
                }
                if(done) {
                    break;
                }
                aTryCount++;
            }
            if((aNewPieceVector.length == this.mColCount * this.mRowCount) && (this.mGameTicks > 0) && (this.WantAnnihilatorReplacement())) {
                for(var aCubeNum = 0; aCubeNum < 2; aCubeNum++) {
                    for(var aHyperTryCount = 0; aHyperTryCount < 64; aHyperTryCount++) {
                        var aPiece_7 = aNewPieceVector[((this.mRand.Next() % aNewPieceVector.length) | 0)];
                        if(aPiece_7.mFlags == 0) {
                            aPiece_7.mColor = Game.DM.EGemColor._INVALID;
                            aPiece_7.SetFlag(Game.Piece.EFlag.HYPERCUBE);
                            this.StartPieceEffect(aPiece_7);
                            break;
                        }
                    }
                }
            }
            if(hyperMixerDropped) {
                this.NewHyperMixer();
            }
            this.BlanksFilled(specialDropped);
            for(var aGemNum_3 = 0; aGemNum_3 < (aNewPieceVector.length | 0); aGemNum_3++) {
                var aPiece_8 = aNewPieceVector[aGemNum_3];
                this.StartPieceEffect(aPiece_8);
            }
        }
    },
    BlanksFilled : function Game_Board$BlanksFilled(specialDropped) {
    },
    MatchMade : function Game_Board$MatchMade(theSwapData) {
        var aNewTime = (((this.mIdleTicks - this.mLastMatchTick) * 1.67) | 0);
        this.mMoveCounter++;
        if(theSwapData != null && !theSwapData.mForceSwap) {
            this.DecrementAllCounterGems(false);
        }
        this.mLastMoveTicks = 0;
        this.mWantHintTicks = 0;
        this.mAutohintOverridePieceId = -1;
        this.mAutohintOverrideTime = -1;
        var aStep = this.mTutorialMgr.GetCurrentStep();
        if(aStep != null && aStep.mType == Game.TutorialStep.EType.ModalDialogMoveClear) {
            aStep.Finish();
        }
        if(!this.AllowSpeedBonus()) {
            return;
        }
        this.mMatchTallyCount++;
        if((this.mSpeedBonusCount >= 9) && (this.mSpeedBonusFlameModePct == 0) && ((this.GetTimeLimit() == 0) || (this.GetTicksLeft() >= 5))) {
            var aPctHit = 1.5;
            if(aNewTime >= Game.DM.SPEED_TIME_RIGHT) {
                aPctHit = Math.max(0.0, Math.min(1.5, 1.0 - ((aNewTime - Game.DM.SPEED_TIME_RIGHT) / (Game.DM.SPEED_TIME_RIGHT - Game.DM.SPEED_TIME_LEFT))));
            }
            var aDelta = (aPctHit - this.mSpeedBonusNum);
            if(aDelta > 0) {
                this.mSpeedBonusNum = Math.min(1.0, this.mSpeedBonusNum + Math.min(0.1, aDelta * this.GetSpeedBonusRamp()));
                if((this.mSpeedBonusNum >= 1.0) && (this.mSpeedBonusFlameModePct == 0)) {
                    this.mSpeedBonusNum = 1.0;
                    this.mSpeedBonusDisp.SetCurve('b+0,1,0.05,1,####         ~~###');
                    this.DoSpeedText(0);
                }
            }
        }
        if((this.mSpeedBonusCount > 0) || ((this.mLastMatchTime >= 0) && (aNewTime + this.mLastMatchTime <= 300))) {
            if(this.mSpeedBonusCount == 0) {
                this.mSpeedBonusDisp.SetCurve('b+0,1,0.05,1,####         ~~###');
            }
            this.mSpeedBonusCount++;
            this.mSpeedBonusTextShowPct.Intercept('b;0,1,0.01,0.25,####         ~~###');
            this.mSpeedBonusCountHighest = (Math.max(this.mSpeedBonusCountHighest, this.mSpeedBonusCount) | 0);
            this.mSpeedBonusPointsGlow.SetCurve('b+0,1,0.033333,1,#### ;I-7l        f####');
            this.mSpeedBonusPointsScale.SetCurve('b+1,2,0.033333,1,####  >4###       c####');

            {
                var $srcArray15 = this.mPointsManager.mPointsList;
                for(var $enum15 = 0; $enum15 < $srcArray15.length; $enum15++) {
                    var aPoints = $srcArray15[$enum15];
                    if(aPoints.mUpdateCnt == 0) {
                        var aNumPoints = (Math.min(200, (this.mSpeedBonusCount + 1) * 20) | 0);
                        this.mSpeedBonusPoints += ((aNumPoints * this.mPointMultiplier * this.GetModePointMultiplier()) | 0);
                        this.AddPoints((aPoints.mX | 0), (aPoints.mY | 0), aNumPoints, aPoints.mColor, aPoints.mId, false, true, aPoints.mMoveCreditId, false, Game.Board.EPointType.SPEED);
                        aPoints.mUpdateCnt++;
                        break;
                    }
                }
            }
        }
        this.mLastMatchTime = (aNewTime | 0);
        this.mLastMatchTick = this.mIdleTicks;
    },
    CreateMatchPowerup : function Game_Board$CreateMatchPowerup(theMatchCount, thePiece, thePieceSet) {
        return false;
    },
    UpdateSpeedBonus : function Game_Board$UpdateSpeedBonus() {
        if((Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.TUTORIAL) != null) || (this.mLightningStorms.length != 0)) {
            this.mLastMatchTick = this.mIdleTicks;
        }
        var aNewTime = (((this.mIdleTicks - this.mLastMatchTick) * 1.67) | 0);
        var aPctPrev = aNewTime / Game.DM.SPEED_TIME1;
        var aPctPrevPrev = (aNewTime + Math.min(this.mLastMatchTime, Game.DM.SPEED_TIME1)) / Game.DM.SPEED_TIME2;
        var aPct = Math.max(aPctPrev, aPctPrevPrev);
        var aTimeScalar = 1.0;
        if(this.mMoveCounter == 0) {
            aTimeScalar = 2.0;
        } else if(this.mMoveCounter == 1) {
            aTimeScalar = 1.5;
        }
        if(this.mMatchTallyCount == Game.DM.SPEED_START_THRESHOLD) {
            aPct = aPctPrev * 0.75;
        }
        var aSpeedTally = (Math.min(this.mMatchTallyCount - Game.DM.SPEED_START_THRESHOLD + 1, Game.DM.SPEED_MAX_THRESHOLD) | 0);
        var aGoalTime = (Game.DM.SPEED_TIME_LEFT + this.mSpeedBonusNum * (Game.DM.SPEED_TIME_RIGHT - Game.DM.SPEED_TIME_LEFT));
        aGoalTime *= aTimeScalar;
        if((aNewTime >= aGoalTime) && (this.mSpeedBonusNum > 0) && (this.mSpeedBonusFlameModePct == 0)) {
            this.mSpeedBonusNum = this.mSpeedBonusNum * 0.985;
        }
        this.mSpeedModeFactor.SetConstant((1.0 + this.mSpeedBonusNum * 0.65) * this.GetSpeedModeFactorScale());
        this.mSpeedNeedle += (((0.5 - this.mSpeedBonusNum) * 132.0) - this.mSpeedNeedle) * 0.1;
        var aMatchTimeAllowed = (100.0 + Math.min(10, this.mSpeedBonusCount + 1) * 13.75) * aTimeScalar;
        if((aNewTime >= aMatchTimeAllowed) && (this.mSpeedBonusCount > 0)) {
            this.EndSpeedBonus();
        }
    },
    EndSpeedBonus : function Game_Board$EndSpeedBonus() {
        this.mLastMatchTick = -1000;
        this.mLastMatchTime = 1000;
        this.mSpeedBonusLastCount = this.mSpeedBonusCount;
        this.mSpeedBonusTextShowPct.Intercept('b;0,1.2,0.01,0.7,o2be ~~###       ~####');
        this.mSpeedBonusCount = 0;
        this.mSpeedBonusNum = 0;
        this.mSpeedBonusDisp.SetCurve('b+0,1,0.003333,1,~###       +~###  @####X####');
        this.mSpeedBonusPointsScale.SetCurve('b+0,2,0.003333,1,P###  RF###  t`###    X####');
    },
    AllowUI : function Game_Board$AllowUI() {
        return this.mLevelCompleteCount <= 0 && this.mGameOverCount <= 0;
    },
    DoGemCountPopup : function Game_Board$DoGemCountPopup(theCount) {
        this.mGemCountValueDisp = theCount;
        this.mGemCountCurve.SetCurve('b+1,2,0.008,1,$###7h6t6qjk=] ,.n[(  c####     .####');
        this.mGemCountAlpha.SetCurve('b+0,1,0.01,1,~###         ~####');
        this.mGemScalarAlpha.SetCurve('b+0,1,0.01,1,~###         ~####');
    },
    DoCascadePopup : function Game_Board$DoCascadePopup(theCount) {
        this.mCascadeCountValueDisp = theCount;
        this.mCascadeCountCurve.SetCurve('b+1,2,0.008,1,$###7h6t6qjk=] ,.n[(  c####     .####');
        this.mCascadeCountAlpha.SetCurve('b+0,1,0.01,1,~###         ~####');
        this.mGemScalarAlpha.SetCurve('b+0,1,0.01,1,~###         ~####');
    },
    UpdateCountPopups : function Game_Board$UpdateCountPopups() {
        var aGemsCleared = this.GetTotalMovesStat(Game.DM.EStat.GEMS_CLEARED);
        if((aGemsCleared >= this.GetGemCountPopupThreshold()) && (aGemsCleared > this.mGemCountValueCheck)) {
            this.DoGemCountPopup(aGemsCleared);
        }
        if((aGemsCleared == 0) || (aGemsCleared > this.mGemCountValueCheck)) {
            this.mGemCountValueCheck = aGemsCleared;
        } else {
            if(aGemsCleared < this.mGemCountValueCheck - 4) {
                this.mGemCountValueCheck = aGemsCleared + 4;
            }
        }
        var aChainCount = this.GetMaxMovesStat(Game.DM.EStat.CASCADES);
        if((aChainCount >= 3) && (aChainCount > this.mCascadeCountValueCheck)) {
            this.DoCascadePopup(aChainCount);
        }
        this.mCascadeCountValueCheck = aChainCount;
    },
    CalcAwesomeness : function Game_Board$CalcAwesomeness(theMoveCreditId) {
        var anAwesomeness = (Math.max(0, Math.pow(Math.max(0, this.GetMoveStat(theMoveCreditId, Game.DM.EStat.CASCADES) - 1), 1.5)) | 0);
        var aStat = this.GetMoveStat(theMoveCreditId, Game.DM.EStat.FLAMEGEMS_USED);
        anAwesomeness += (Math.max(0, aStat * 2 - 1) | 0);
        aStat = this.GetMoveStat(theMoveCreditId, Game.DM.EStat.LASERGEMS_USED);
        anAwesomeness += (Math.max(0, ((aStat * 2.5) | 0) - 1) | 0);
        aStat = this.GetMoveStat(theMoveCreditId, Game.DM.EStat.HYPERCUBES_USED);
        anAwesomeness += (Math.max(0, aStat * 3 - 1) | 0);
        aStat = this.GetMoveStat(theMoveCreditId, Game.DM.EStat.FLAMEGEMS_MADE);
        anAwesomeness += aStat;
        aStat = this.GetMoveStat(theMoveCreditId, Game.DM.EStat.LASERGEMS_MADE);
        anAwesomeness += aStat;
        aStat = this.GetMoveStat(theMoveCreditId, Game.DM.EStat.HYPERCUBES_MADE);
        anAwesomeness += aStat * 2;
        aStat = this.GetMoveStat(theMoveCreditId, Game.DM.EStat.BIGGESTMATCH);
        anAwesomeness += (Math.max(0, (aStat - 5) * 8) | 0);
        anAwesomeness += (Math.pow(this.GetMoveStat(theMoveCreditId, Game.DM.EStat.GEMS_CLEARED) / 15.0, 1.5) | 0);
        return anAwesomeness;
    },
    UpdateComplements : function Game_Board$UpdateComplements() {
        if(!this.WantPointComplements()) {
            return;
        }
        var aValue = 0;
        for(var aMoveDataIdx = 0; aMoveDataIdx < (this.mMoveDataVector.length | 0); aMoveDataIdx++) {
            aValue += this.CalcAwesomeness(this.mMoveDataVector[aMoveDataIdx].mMoveCreditId);
        }
        var aCurComplementLevel = -1;
        for(var i = this.UpdateComplements_gComplementPoints.length - 1; i >= 0; i--) {
            if(aValue >= this.UpdateComplements_gComplementPoints[i]) {
                aCurComplementLevel = i;
                if(i > this.mLastComplement) {
                    if(i >= this.GetMinComplementLevel()) {
                        this.DoComplement(i);
                    }
                }
                break;
            }
        }
        if((aValue == 0) || (aCurComplementLevel > this.mLastComplement)) {
            this.mLastComplement = aCurComplementLevel;
        } else {
            if(aCurComplementLevel < this.mLastComplement - 1) {
                this.mLastComplement = aCurComplementLevel + 1;
            }
        }
        if((this.mComplementNum != -1)) {
            this.mComplementAlpha.IncInVal();
        }
    },
    DoCombineAnim : function Game_Board$DoCombineAnim(i_fromPiece, i_tgtPiece) {
        if((i_fromPiece != i_tgtPiece) && (i_fromPiece.mFlags == 0)) {
            i_fromPiece.mIsPieceStill = false;
            i_fromPiece.mScale.SetCurve('b+0,1,0.033333,1,~zL>         %]Bt(|#:M@');
            i_fromPiece.mDestPct.SetCurve('b+0,1,0.033333,1,#.ht         ~~W[d');
            i_fromPiece.mDestPct.mIncRate *= this.GetMatchSpeed();
            i_fromPiece.mAlpha.SetCurve('b+0,1,0.033333,1,~r)6         H;?D,X#>3Z');
            i_fromPiece.mDestCol = i_tgtPiece.mCol;
            i_fromPiece.mDestRow = i_tgtPiece.mRow;
            var aDirX = i_tgtPiece.mCol - i_fromPiece.mCol;
            var aDirY = i_tgtPiece.mRow - i_fromPiece.mRow;
            if(i_tgtPiece.IsFlagSet(Game.Piece.EFlag.FLAME)) {
                var anEffect = new Game.PopAnimEffect(Game.Resources['POPANIM_FLAMEGEMCREATION']);
                anEffect.mPieceIdRel = i_fromPiece.mId;
                anEffect.mX = i_fromPiece.CX();
                anEffect.mY = i_fromPiece.CY();
                anEffect.mOverlay = true;
                if(aDirX != 0) {
                    anEffect.Play$2('smear horizontal');
                    if(aDirX < 0) {
                        anEffect.mAngle = Game.MathUtil.PI;
                    }
                } else {
                    anEffect.Play$2('smear vertical');
                    if(aDirY < 0) {
                        anEffect.mAngle = Game.MathUtil.PI;
                    }
                }
                this.mPostFXManager.AddEffect(anEffect);
            }
        }
    },
    ProcessMatches : function Game_Board$ProcessMatches(theMatches, theTallySet, fromUpdateSwapping) {
    },
    DecrementAllCounterGems : function Game_Board$DecrementAllCounterGems(immediate) {

        {
            var $srcArray16 = this.mBoard;
            for(var $enum16 = 0; $enum16 < $srcArray16.length; $enum16++) {
                var aPiece = $srcArray16[$enum16];
                if((aPiece != null) && !aPiece.IsFlagSet(Game.Piece.EFlag.REALTIME_BOMB) && !aPiece.IsFlagSet(Game.Piece.EFlag.DOOM)) {
                    this.DecrementCounterGem(aPiece, immediate);
                }
            }
        }
        return false;
    },
    DecrementAllDoomGems : function Game_Board$DecrementAllDoomGems(immediate) {

        {
            var $srcArray17 = this.mBoard;
            for(var $enum17 = 0; $enum17 < $srcArray17.length; $enum17++) {
                var aPiece = $srcArray17[$enum17];
                if((aPiece != null) && aPiece.IsFlagSet(Game.Piece.EFlag.DOOM)) {
                    this.DecrementCounterGem(aPiece, immediate);
                }
            }
        }
    },
    DecrementCounterGem : function Game_Board$DecrementCounterGem(thePiece, immediate) {
        if(thePiece.mCounter > 0) {
            if(immediate) {
                thePiece.mCounter--;
                if(thePiece.mCounter == 0) {
                    if(thePiece.IsFlagSet(Game.Piece.EFlag.COUNTER)) {
                        if(this.mGameOverCount == 0) {
                            this.GameOver();
                        }
                    }
                }
            } else {
                if(thePiece.IsFlagSet(Game.Piece.EFlag.COUNTER)) {
                    thePiece.mSpinFrame = 1;
                    thePiece.mSpinSpeed = 0.33;
                }
            }
        }
        return false;
    },
    SetMoveCredit : function Game_Board$SetMoveCredit(thePiece, theMoveCreditId) {
        thePiece.mMoveCreditId = (Math.max(thePiece.mMoveCreditId, theMoveCreditId) | 0);
    },
    HasClearedTutorial : function Game_Board$HasClearedTutorial(theTutorial) {
        return this.mTutorialMgr.HasClearedTutorial((theTutorial | 0));
    },
    SetTutorialCleared : function Game_Board$SetTutorialCleared(theTutorial, isCleared, sendTutorialCleared) {
        if(isCleared === undefined) {
            isCleared = true;
        }
        if(sendTutorialCleared === undefined) {
            sendTutorialCleared = true;
        }
        if(((this.mTutorialMgr.GetTutorialFlags() & (1 << (theTutorial | 0))) == 0) && (isCleared) && (sendTutorialCleared)) {
            var aTutorialName = Game.DM.gTutorialNames[(theTutorial | 0)];
            if(aTutorialName != null) {
                Game.BejApp.mBejApp.SubmitStandardMetrics('tutorial_cleared', [new GameFramework.misc.KeyVal('GameId', this.mGameId), new GameFramework.misc.KeyVal('TutorialType', aTutorialName), new GameFramework.misc.KeyVal('TutorialsEnabled', Game.BejApp.mBejApp.mProfile.mTutorialEnabled)]);
            }
        }
        Game.BejApp.mBejApp.mProfile.SetTutorialCleared((theTutorial | 0), isCleared);
    },
    DeferTutorialDialog : function Game_Board$DeferTutorialDialog(theTutorialFlag, thePiece) {
        var aDeferredTutorial = new Game.DeferredTutorial();
        aDeferredTutorial.mTutorialFlag = theTutorialFlag;
        aDeferredTutorial.mPieceId = thePiece.mId;
        this.mDeferredTutorialVector.push(aDeferredTutorial);
        this.SetTutorialCleared(theTutorialFlag, true, false);
    },
    CheckForTutorialDialogs : function Game_Board$CheckForTutorialDialogs() {
        if((Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.TUTORIAL) != null) || (Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.HELP) != null)) {
            return;
        }
        if((this.mLevelCompleteCount != 0) || (this.mGameOverCount != 0) || !this.mTutorialMgr.GetTutorialEnabled()) {
            this.mDeferredTutorialVector.clear();
            return;
        }
        while(this.mDeferredTutorialVector.length > 0) {
            if(this.mTimeExpired) {
                this.mDeferredTutorialVector.clear();
                return;
            }
            var aDeferredTutorial = this.mDeferredTutorialVector[0];
            if(this.GetPieceById(aDeferredTutorial.mPieceId) == null) {
                this.SetTutorialCleared(aDeferredTutorial.mTutorialFlag, false);
                this.mDeferredTutorialVector.removeAt(0);
                continue;
            }
            var aHeader = '';
            var aText = '';
            switch(aDeferredTutorial.mTutorialFlag) {
                case Game.DM.ETutorial.FLAME:
                {
                    aHeader = 'FLAME GEM';
                    aText = 'You made a ^007700^FLAME GEM^000000^ by matching 4 Gems in a row. Match it for an explosion!';
                    break;
                }
                case Game.DM.ETutorial.LASER:
                {
                    aHeader = 'STAR GEM';
                    aText = 'You made a ^007700^STAR GEM^000000^ by creating\ntwo intersecting matches!';
                    break;
                }
                case Game.DM.ETutorial.HYPERCUBE:
                {
                    aHeader = 'HYPERCUBE';
                    aText = 'You made a ^007700^HYPERCUBE^000000^ by matching 5 Gems in a row. Swap it to trigger!';
                    break;
                }
                case Game.DM.ETutorial.SUPERNOVA:
                {
                    aHeader = 'SUPERNOVA GEM';
                    aText = 'You made a ^007700^SUPERNOVA GEM^000000^ by matching 6+ Gems in a row. This powerful Gem explodes with the force of a million suns when matched.';
                    break;
                }
                case Game.DM.ETutorial.MULTIPLIER:
                {
                    aHeader = 'MULTIPLIER GEM';
                    aText = 'You have received a ^007700^MULTIPLIER GEM^000000^! Match it to multiply your score for the rest of the game.';
                    break;
                }
                case Game.DM.ETutorial.TIME_BONUS:
                {
                    aHeader = 'TIME GEM';
                    aText = 'You have received a ^007700^TIME GEM^000000^! Collect them to extend your game after the timer bar empties!';
                    break;
                }
            }
            var aDialog = new Game.HintDialog(aHeader, aText, true);
            aDialog.mTutorialFlag = aDeferredTutorial.mTutorialFlag;
            Game.BejApp.mBejApp.mDialogMgr.AddDialog(aDialog);
            aDialog.AddEventListener(GameFramework.widgets.DialogEvent.CLOSED, ss.Delegate.create(this, this.HandleHintDialogClosed));
            aDialog.mFlushPriority = 1;
            var aPiece = this.GetPieceById(aDeferredTutorial.mPieceId);
            if(aPiece != null) {
                if(aPiece.mRow < 4) {
                    aDialog.Move(this.GetBoardCenterX() - aDialog.mWidth / 2, aPiece.GetScreenY() + Game.Board.GEM_HEIGHT + 15);
                } else {
                    aDialog.Move(this.GetBoardCenterX() - aDialog.mWidth / 2, aPiece.GetScreenY() - 15 - aDialog.mHeight);
                }
            }
            this.mTutorialPieceIrisPct.SetCurve('b;0,1,0.028571,1,####         ~~###');
            break;
        }
    },
    HandleHintDialogClosed : function Game_Board$HandleHintDialogClosed(theEvent) {
        var aHintDialog = theEvent.target;
        if(aHintDialog.mNoHintsCheckbox.IsChecked()) {
            this.mTutorialMgr.SetTutorialEnabled(false);
            this.mDeferredTutorialVector.clear();
        }
        if(aHintDialog.mTutorialFlag != Game.DM.ETutorial.NONE) {
            this.SetTutorialCleared(aHintDialog.mTutorialFlag, false);
            this.SetTutorialCleared(aHintDialog.mTutorialFlag, true);
        }
        if(this.mDeferredTutorialVector.length > 0) {
            var aDeferredTutorial = this.mDeferredTutorialVector[0];
            this.mDeferredTutorialVector.removeAt(0);
        }
        this.mTutorialPieceIrisPct.SetConstant(0);
    },
    SetColorCount : function Game_Board$SetColorCount(theColorCount) {
        if(this.mColorCount != theColorCount) {
            this.mColorCount = theColorCount;
            GameFramework.Utils.Trace('ColorCount:' + this.mColorCount);
            this.mNewGemColors = [];
            for(var aGemColor = 0; aGemColor < theColorCount; aGemColor++) {
                if((theColorCount <= (Game.DM.EGemColor.BLUE | 0)) && (aGemColor == (Game.DM.EGemColor.ORANGE | 0))) {
                    aGemColor = (Game.DM.EGemColor.BLUE | 0);
                }
                this.mNewGemColors.push(aGemColor);
                this.mNewGemColors.push(aGemColor);
            }
        }
    },
    UpdateBulging : function Game_Board$UpdateBulging() {
        var hasBulging = false;

        {
            var $srcArray18 = this.mBoard;
            for(var $enum18 = 0; $enum18 < $srcArray18.length; $enum18++) {
                var aPiece = $srcArray18[$enum18];
                if((aPiece != null) && aPiece.mIsBulging) {
                    hasBulging = true;
                    if(!aPiece.mScale.IncInVal()) {
                        aPiece.mScale.SetConstant(1.0);
                        aPiece.mIsBulging = false;
                    }
                }
            }
        }
        return hasBulging;
    },
    FlipHeldSwaps : function Game_Board$FlipHeldSwaps() {
        for(var i = 0; i < (this.mSwapDataVector.length | 0); i++) {
            var aSwapData = this.mSwapDataVector[i];
            if((aSwapData.mHoldingSwap > 0) && (aSwapData.mPiece1 != null) && (aSwapData.mPiece2 != null)) {
                this.SwapPieceLocations(aSwapData.mPiece1, aSwapData.mPiece2, false);
                aSwapData.mSwapDir.x = -aSwapData.mSwapDir.x;
                aSwapData.mSwapDir.y = -aSwapData.mSwapDir.y;
            }
        }
    },
    UpdateSwapping : function Game_Board$UpdateSwapping() {
        for(var aSwapDataIdx = 0; aSwapDataIdx < (this.mSwapDataVector.length | 0); aSwapDataIdx++) {
            var aSwapData = this.mSwapDataVector[aSwapDataIdx];
            var done = false;
            aSwapData.mGemScale.IncInVal();
            if(!aSwapData.mSwapPct.IncInVal()) {
                done = true;
            }
            var aSwapCenterX = this.GetColX(aSwapData.mPiece1.mCol) + ((aSwapData.mSwapDir.x * Game.Board.GEM_WIDTH / 2) | 0);
            var aSwapCenterY = this.GetRowY(aSwapData.mPiece1.mRow) + ((aSwapData.mSwapDir.y * Game.Board.GEM_WIDTH / 2) | 0);
            aSwapData.mPiece1.mX = aSwapCenterX - aSwapData.mSwapPct.get_v() * aSwapData.mSwapDir.x * Game.Board.GEM_WIDTH / 2;
            aSwapData.mPiece1.mY = aSwapCenterY - aSwapData.mSwapPct.get_v() * aSwapData.mSwapDir.y * Game.Board.GEM_WIDTH / 2;
            if(!aSwapData.mDestroyTarget && aSwapData.mPiece2 != null) {
                aSwapData.mPiece2.mX = aSwapCenterX + aSwapData.mSwapPct.get_v() * aSwapData.mSwapDir.x * Game.Board.GEM_WIDTH / 2;
                aSwapData.mPiece2.mY = aSwapCenterY + aSwapData.mSwapPct.get_v() * aSwapData.mSwapDir.y * Game.Board.GEM_WIDTH / 2;
            }
            if(done) {
                var aPrevSize = (this.mSwapDataVector.length | 0);
                if((aSwapData.mForwardSwap)) {
                    var forceSwap = aSwapData.mForceSwap || this.ForceSwaps();
                    var aSwapRow = aSwapData.mPiece1.mRow + aSwapData.mSwapDir.y;
                    var aSwapCol = aSwapData.mPiece1.mCol + aSwapData.mSwapDir.x;
                    for(var aSwapPass = 0; aSwapPass < 2; aSwapPass++) {
                        if(aSwapData.mDestroyTarget) {
                            this.PieceDestroyedInSwap(aSwapData.mPiece2);
                            aSwapData.mPiece2 = null;
                            aSwapData.mPiece2 = null;
                        }
                        if(aSwapData.mPiece2 != null) {
                            this.SwapPieceLocations(aSwapData.mPiece1, aSwapData.mPiece2, false);
                        } else {
                            this.mBoard[this.mBoard.mIdxMult0 * (aSwapData.mPiece1.mRow) + aSwapData.mPiece1.mCol] = null;
                            aSwapData.mPiece1.mCol = aSwapCol;
                            aSwapData.mPiece1.mRow = aSwapRow;
                            this.mBoard[this.mBoard.mIdxMult0 * (aSwapData.mPiece1.mRow) + aSwapData.mPiece1.mCol] = aSwapData.mPiece1;
                        }
                        aSwapData.mIgnore = aSwapPass == 0;
                        aSwapData.mPiece1.mSwapTick = this.mUpdateCnt;
                        if(aSwapData.mPiece2 != null) {
                            aSwapData.mPiece2.mSwapTick = this.mUpdateCnt;
                        }
                        this.mLastComboCount = this.mComboCount;
                        var foundSets = 0;
                        if(aSwapData.mPiece1 != null) {
                            aSwapData.mPiece1.mIsPieceStill = true;
                            aSwapData.mPiece1.mWillPieceBeStill = true;
                        }
                        if(aSwapData.mPiece2 != null) {
                            aSwapData.mPiece2.mIsPieceStill = true;
                            aSwapData.mPiece2.mWillPieceBeStill = true;
                        }
                        if(aSwapPass != 1) {
                            foundSets = this.FindSetsEx(true, aSwapData.mPiece1, aSwapData.mPiece2);
                        }
                        if(aSwapData.mPiece1 != null) {
                            aSwapData.mPiece1.mIsPieceStill = false;
                            aSwapData.mPiece1.mWillPieceBeStill = false;
                        }
                        if(aSwapData.mPiece2 != null) {
                            aSwapData.mPiece2.mIsPieceStill = false;
                            aSwapData.mPiece2.mWillPieceBeStill = false;
                        }
                        if((aSwapPass == 1) || (foundSets != 0) || (forceSwap)) {
                            if((foundSets == 2 && !forceSwap) || (aSwapData.mPiece1 != null && aSwapData.mPiece1.mIsBulging) || (aSwapData.mPiece2 != null && aSwapData.mPiece2.mIsBulging)) {
                                aSwapData.mHoldingSwap++;
                                if(aSwapData.mHoldingSwap > 400) {
                                    foundSets = 0;
                                    aSwapData.mHoldingSwap = 0;
                                } else {
                                    done = false;
                                    continue;
                                }
                            }
                            if(foundSets != 0) {
                                this.MatchMade(aSwapData);
                            } else {
                                if(forceSwap) {
                                    this.DecrementAllDoomGems(false);
                                }
                            }
                            if((aSwapPass == 0) && (this.mLastComboCount == this.mComboCount) && aSwapData.mPiece1.mColor == this.mLastPlayerSwapColor) {
                                this.ComboFailed();
                            }
                            if(aSwapPass == 0) {
                                if(aSwapData.mDragSwap) {
                                    this.IncStat(Game.DM.EStat.NUM_MOVES_DRAG);
                                } else {
                                    this.IncStat(Game.DM.EStat.NUM_MOVES_CLICK);
                                }
                                this.IncStat(Game.DM.EStat.NUM_MOVES);
                                this.IncStat(Game.DM.EStat.NUM_GOOD_MOVES);
                                this.SwapSucceeded(aSwapData);
                            }
                            break;
                        }
                        if(aSwapData.mDragSwap) {
                            this.IncStat(Game.DM.EStat.NUM_MOVES_DRAG);
                        } else {
                            this.IncStat(Game.DM.EStat.NUM_MOVES_CLICK);
                        }
                        this.IncStat(Game.DM.EStat.NUM_MOVES);
                        this.SwapFailed(aSwapData);
                        Game.SoundUtil.Play(Game.Resources['SOUND_BADMOVE']);
                        aSwapData.mHoldingSwap = 0;
                        aSwapData.mForwardSwap = false;
                        aSwapData.mSwapPct.SetCurve('b+-1,1,0.022222,1,#$)h B####    cObb4   z~LPQ');
                        aSwapData.mGemScale.SetCurve('b+-0.075,0.075,0.022222,1,P#FJ FP###    C~###    :PL=H');
                        aSwapData.mIgnore = false;
                        done = false;
                    }
                }
                if((done)) {
                    for(var aCheckSwapIdx = 0; aCheckSwapIdx < (this.mSwapDataVector.length | 0); aCheckSwapIdx++) {
                        var aCheckSwapData = this.mSwapDataVector[aCheckSwapIdx];
                        if(aCheckSwapData == aSwapData) {
                            this.mSwapDataVector.removeAt(aCheckSwapIdx);
                            aCheckSwapIdx--;
                            break;
                        }
                    }
                }
            }
        }
    },
    UpdateFalling : function Game_Board$UpdateFalling() {
        if(!this.CanPiecesFall()) {
            if(this.mGemFallDelay > 0) {
                --this.mGemFallDelay;
            }

            {
                var $srcArray19 = this.mBoard;
                for(var $enum19 = 0; $enum19 < $srcArray19.length; $enum19++) {
                    var aPiece = $srcArray19[$enum19];
                    if((aPiece != null) && (aPiece.mFallVelocity != 0)) {
                        aPiece.mFallVelocity = 0.01;
                    }
                }
            }
            for(var i = 0; i < this.mColCount; i++) {
                this.mBumpVelocities[i] = 0;
            }
            return;
        }
        var aHitCount = 0;
        var aCumHitX = 0;
        var aFallVel = this.GetGravityFactor() * 0.4675;
        {
            for(var aCol = 0; aCol < this.mColCount; aCol++) {
                var aLastY = 1200;
                var aLastVelY = 0;
                for(var aRow = this.mRowCount - 1; aRow >= 0; aRow--) {
                    var aPiece_2 = this.mBoard[this.mBoard.mIdxMult0 * (aRow) + aCol];
                    if((aPiece_2 != null) && ((aPiece_2.mIsPieceStill) || ((!this.IsPieceSwapping(aPiece_2)) && (!this.IsPieceMatching(aPiece_2))) || (aPiece_2.mFallVelocity < 0))) {
                        aPiece_2.mY += aPiece_2.mFallVelocity * 1.67;
                        var hit;
                        hit = aPiece_2.mY >= this.GetRowY(aRow);
                        if(hit) {
                            aPiece_2.mY = this.GetRowY(aRow);
                            if(aPiece_2.mFallVelocity >= 2.0) {
                                aHitCount++;
                                aCumHitX += (aPiece_2.GetScreenX() | 0) + ((Game.Board.GEM_WIDTH / 2) | 0);
                            }
                            if(aPiece_2.mFallVelocity > 0) {
                                aPiece_2.mFallVelocity = 0;
                            }
                        } else if(aPiece_2.mY >= aLastY - Game.Board.GEM_HEIGHT) {
                            aPiece_2.mY = aLastY - Game.Board.GEM_HEIGHT;
                            aPiece_2.mFallVelocity = aLastVelY;
                            this.mIsBoardStill = false;
                            aPiece_2.mIsPieceStill = false;
                        } else {
                            this.mIsBoardStill = false;
                            aPiece_2.mIsPieceStill = false;
                            aPiece_2.mFallVelocity += aFallVel;
                        }
                        if(aPiece_2.mFallVelocity != 0) {
                            aPiece_2.mLastActiveTick = this.mUpdateCnt;
                        }
                        aLastY = aPiece_2.mY;
                        aLastVelY = aPiece_2.mFallVelocity;
                    }
                }
            }
        }
        if((aHitCount > 0) && (Math.abs(this.mLastHitSoundTick - this.mUpdateCnt) >= 5)) {
            this.mLastHitSoundTick = this.mUpdateCnt;
            Game.SoundUtil.PlayEx(Game.Resources['SOUND_GEM_HIT'], this.GetPanPosition(((aCumHitX / aHitCount) | 0)), 1.0);
        }
    },
    UpdateHint : function Game_Board$UpdateHint() {
        if((this.mIsBoardStill) && (this.mBoardHidePct == 0) && (this.CanPlay()) && Game.BejApp.mBejApp.mDialogMgr.GetDialog(Game.DM.EDialog.TUTORIAL) == null && (!this.mTutorialMgr.IsBusy() || this.mTutorialMgr.AllowHints())) {
            this.mLastMoveTicks++;
            this.mWantHintTicks++;
            var hintTime = (this.mAutohintOverrideTime != -1 ? this.mAutohintOverrideTime : this.GetHintTime()) * 60;
            if(this.mWantHintTicks == hintTime) {
                this.ShowHint(false);
            }
        }
    },
    UpdateLevelBar : function Game_Board$UpdateLevelBar() {
        var aLevelPct = this.GetLevelPct();
        if(this.mLevelBarPct < aLevelPct) {
            if(this.mTimerAlpha.get_v() == 0) {
                this.mLevelBarPct = Math.min(aLevelPct, this.mLevelBarPct + (aLevelPct - this.mLevelBarPct) * 0.0255 + 0.0012);
            } else {
                this.mLevelBarPct = Math.min(aLevelPct, this.mLevelBarPct + (aLevelPct - this.mLevelBarPct) * 0.025 + 0.0005);
            }
        } else {
            this.mLevelBarPct = Math.max(aLevelPct, this.mLevelBarPct + (aLevelPct - this.mLevelBarPct) * 0.05 - 0.0001);
        }
        this.UpdateLevelBarEffect();
        this.CheckWin();
    },
    UpdateLevelBarEffect : function Game_Board$UpdateLevelBarEffect() {
        var aBarRect = this.GetLevelBarRect();
    },
    UpdateCountdownBar : function Game_Board$UpdateCountdownBar() {
        var aCountdownPct = this.GetCountdownPct();
        if(this.mCountdownBarPct < aCountdownPct) {
            if(this.mTimerAlpha.get_v() == 0) {
                this.mCountdownBarPct = Math.min(aCountdownPct, this.mCountdownBarPct + (aCountdownPct - this.mCountdownBarPct) * 0.0275 + 0.00125);
            } else {
                this.mCountdownBarPct = Math.min(aCountdownPct, this.mCountdownBarPct + (aCountdownPct - this.mCountdownBarPct) * 0.025 + 0.0005);
            }
        } else {
            this.mCountdownBarPct = Math.max(aCountdownPct, this.mCountdownBarPct + (aCountdownPct - this.mCountdownBarPct) * 0.05 - 0.0001);
        }
        var aBarRect = this.GetCountdownBarRect();
        this.CheckCountdownBar();
    },
    CheckCountdownBar : function Game_Board$CheckCountdownBar() {
        var aCountdownPct = Math.max(0.0, this.GetTicksLeft() / (this.GetTimeLimit() * 60.0));
        if((this.GetTimeLimit() > 0) && (aCountdownPct <= 0.0) && (this.CanTimeUp()) && this.mDeferredTutorialVector.length == 0 && (this.mGameOverCount == 0)) {
            this.mTimeExpired = true;
            this.GameOver();
        }
    },
    CheckWin : function Game_Board$CheckWin() {
        var aLevelPoints = this.GetLevelPoints();
        var aTimeLimit = this.GetTimeLimit();
        if(aTimeLimit == 0) {
            var aLevelPointsTotal = this.GetLevelPointsTotal();
            if((this.mLevelBarPct >= 1.0) && (aLevelPointsTotal >= aLevelPoints) && (this.mSpeedBonusFlameModePct == 0)) {
                this.LevelUp();
                return true;
            }
        } else {
            if(aLevelPoints > 0 && this.GetLevelPointsTotal() >= aLevelPoints) {
                this.LevelUp();
                return true;
            }
        }
        return false;
    },
    WantWarningGlow : function Game_Board$WantWarningGlow() {
        var aTimeLimit = this.GetTimeLimit();
        var aTicksLeft = this.GetTicksLeft();
        var aWarningStartTick = (aTimeLimit > 60) ? 1500 : 1000;
        return ((aTimeLimit > 0) && (aTicksLeft < aWarningStartTick));
    },
    GetSpeedBonusRamp : function Game_Board$GetSpeedBonusRamp() {
        return 0.075;
    },
    GetWarningGlowColor : function Game_Board$GetWarningGlowColor() {
        var aTicksLeft = this.GetTicksLeft();
        var aWarningStartTick = (this.GetTimeLimit() > 60) ? 1500 : 1000;
        var aMult = (aWarningStartTick - aTicksLeft) / aWarningStartTick;
        if(aTicksLeft == 0) {
            var aTimeLimit = this.GetTimeLimit();
            aMult *= Math.max(0, 120 - ((this.mGameTicks - 150) - aTimeLimit * 60)) / 120;
            aMult *= Math.max(0, 1.0 - this.mGameOverCount / 20.0);
        }
        var c = (((Math.sin(this.mUpdateCnt * 0.15) * 127 + 127) * aMult * this.GetPieceAlpha()) | 0);
        return GameFramework.gfx.Color.RGBAToInt(255, 255, 255, c);
    },
    WantBottomLevelBar : function Game_Board$WantBottomLevelBar() {
        return this.GetTimeLimit() == 0;
    },
    WantBottomFrame : function Game_Board$WantBottomFrame() {
        return true;
    },
    WantTopFrame : function Game_Board$WantTopFrame() {
        return true;
    },
    WantDrawButtons : function Game_Board$WantDrawButtons() {
        return true;
    },
    WantDrawScore : function Game_Board$WantDrawScore() {
        return true;
    },
    WantDrawBackground : function Game_Board$WantDrawBackground() {
        return true;
    },
    WantCountdownBar : function Game_Board$WantCountdownBar() {
        return this.GetTimeLimit() > 0;
    },
    UpdateMoveData : function Game_Board$UpdateMoveData() {
        for(var aMoveDataIdx = 0; aMoveDataIdx < (this.mMoveDataVector.length | 0); aMoveDataIdx++) {
            var aMoveData = this.mMoveDataVector[aMoveDataIdx];
            if(this.mLightningStorms.length == 0) {
                var found = false;

                {
                    var $srcArray20 = this.mBoard;
                    for(var $enum20 = 0; $enum20 < $srcArray20.length; $enum20++) {
                        var aPiece = $srcArray20[$enum20];
                        if(aPiece != null) {
                            if(aPiece.mMoveCreditId == aMoveData.mMoveCreditId) {
                                if(this.IsPieceStill(aPiece)) {
                                    aPiece.mLastMoveCreditId = aPiece.mMoveCreditId;
                                    aPiece.mMoveCreditId = -1;
                                    aPiece.mLastActiveTick = 0;
                                } else {
                                    found = true;
                                }
                            }
                        }
                    }
                }
                for(var aCol = 0; aCol < this.mColCount; aCol++) {
                    if(this.mNextColumnCredit[aCol] == aMoveData.mMoveCreditId) {
                        found = true;
                    }
                }
                if(!found) {

                    {
                        var $srcArray21 = this.mBoard;
                        for(var $enum21 = 0; $enum21 < $srcArray21.length; $enum21++) {
                            var aPiece_2 = $srcArray21[$enum21];
                            if((aPiece_2 != null) && aPiece_2.mLastMoveCreditId == aMoveData.mMoveCreditId) {
                                aPiece_2.mLastMoveCreditId = -1;
                            }
                        }
                    }
                    this.mMoveDataVector.removeAt(aMoveDataIdx);
                    aMoveDataIdx--;
                    continue;
                }
            }
        }
    },
    GetRandSeedOverride : function Game_Board$GetRandSeedOverride() {
        if(this.mTutorialMgr.GetTutorialSequence() != null && this.mTutorialMgr.GetTutorialSequence().mBoardSeed != 0) {
            return this.mTutorialMgr.GetTutorialSequence().mBoardSeed;
        }
        return 0;
    },
    DrawSpeedBonus : function Game_Board$DrawSpeedBonus(g) {
        if(this.mSpeedBonusPointsScale.GetOutVal() > 0) {
            var aTransform = new GameFramework.geom.Matrix();
            aTransform.translate(0.0, -30.0);
            aTransform.scale(this.mSpeedBonusPointsScale.GetOutVal(), this.mSpeedBonusPointsScale.GetOutVal());
            aTransform.translate(0.0, 30.0);
            aTransform.translate(238.0, 60.0);
            var _t22 = g.PushMatrix(aTransform);
            try {

                {
                }

            } finally {
                _t22.Dispose();
            }
        }
    },
    UpdateTooltip : function Game_Board$UpdateTooltip() {
        if(!this.AllowTooltips()) {
            return;
        }
    },
    GetTooltipText : function Game_Board$GetTooltipText(thePiece, theHeader, theBody) {
        var usePiece = false;
        if(thePiece.IsFlagSet(Game.Piece.EFlag.FLAME)) {
            if(thePiece.IsFlagSet(Game.Piece.EFlag.LASER)) {
                theHeader = 'SUPERNOVA GEM';
                theBody = 'Created by matching 6+ Gems in a row, this powerful Gem explodes with the force of a million suns when matched.';
            } else {
                theHeader = 'FLAME GEM';
                theBody = 'Created by forming 4 Gems of the same color in a line. Explodes when matched!';
            }
            usePiece = true;
        } else if(thePiece.IsFlagSet(Game.Piece.EFlag.LASER)) {
            theHeader = 'STAR GEM';
            theBody = 'Created by making two intersecting matches. Match it to fire lightning 4 ways!';
            usePiece = true;
        } else if(thePiece.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) {
            theHeader = 'HYPERCUBE';
            theBody = 'Created by matching 5 Gems in a line. Swap it with a Gem to zap all Gems of the same color onscreen.';
            usePiece = true;
        } else if(thePiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) {
            theHeader = 'MULTIPLIER GEM';
            theBody = 'Randomly drops onto your board. Match it to increase your score multiplier by 1!';
            usePiece = true;
        } else if(thePiece.IsFlagSet(Game.Piece.EFlag.DETONATOR)) {
            theHeader = 'DETONATOR';
            theBody = 'Click to detonate all Special Gems on the board.';
            usePiece = true;
        } else if(thePiece.IsFlagSet(Game.Piece.EFlag.BOMB) || thePiece.IsFlagSet(Game.Piece.EFlag.REALTIME_BOMB)) {
            theHeader = 'TIME BOMB';
            theBody = 'Match this Gem before the counter reaches zero!';
            usePiece = true;
        }
        return usePiece;
    },
    UpdatePoints : function Game_Board$UpdatePoints() {
        if(this.mUpdateCnt % 4 == 0) {
            if(this.mDispPoints < this.mPoints) {
                this.mDispPoints = (Math.min(this.mPoints, this.mDispPoints + (((this.mPoints - this.mDispPoints) * 0.2) | 0) + 1) | 0);
            } else if(this.mDispPoints > this.mPoints) {
                this.mDispPoints = (Math.max(this.mPoints, this.mDispPoints + (((this.mPoints - this.mDispPoints) * 0.2) | 0) - 1) | 0);
            }
        }
    },
    UpdateGame : function Game_Board$UpdateGame() {
        if(this.mAnnouncements.length > 0) {
            this.mAnnouncements[0].Update();
        }
        this.mSunPosition.IncInVal();
        this.mAlpha.IncInVal();
        this.mSideAlpha.IncInVal();
        this.mSideXOff.IncInVal();
        this.mScale.IncInVal();
        this.mPrevPointMultAlpha.IncInVal();
        this.mPointMultPosPct.IncInVal();
        this.mPointMultTextMorph.IncInVal();
        this.mSpeedBonusDisp.IncInVal();
        this.mSpeedBonusPointsGlow.IncInVal();
        this.mSpeedBonusPointsScale.IncInVal();
        this.mTutorialPieceIrisPct.IncInVal();
        this.mGemCountCurve.IncInVal();
        this.mGemCountAlpha.IncInVal();
        this.mGemScalarAlpha.IncInVal();
        this.mCascadeCountCurve.IncInVal();
        this.mCascadeCountAlpha.IncInVal();
        this.mGemScalarAlpha.IncInVal();
        this.mBoostShowPct.IncInVal();
        this.mTimerInflate.IncInVal();
        this.mTimerAlpha.IncInVal();
        if(this.mKilling) {
            return;
        }
        if(this.mPointMultPosPct.CheckUpdatesFromEndThreshold(1)) {
            this.mPointMultTextMorph.SetCurve('b+0,1,0.02,1,####         ~~###');
        }
        if(!this.IsGameSuspended()) {
            Game.Board.mTotalTicks++;
            this.mGameTicks++;
            if((this.mGameTicks % 6 == 0) && (this.mLastMoveTicks < 60 * 60)) {
                this.IncStat(Game.DM.EStat.SECONDS_PLAYED);
            }
            this.UpdateDeferredSounds();
        }
        this.FlipHeldSwaps();
        this.FindSets();
        this.FlipHeldSwaps();
        if(this.mGameOverPiece != null) {
            this.UpdateBombExplode();
        } else {
            if(this.mLightningStorms.length == 0) {
                this.FillInBlanks();
            }
            this.UpdateMoveData();
            this.UpdateSwapping();
            this.UpdateFalling();
        }
        this.mPointMultSoundDelay = (Math.max(0, this.mPointMultSoundDelay - 1) | 0);
        if(this.mPointMultSoundDelay == 0 && this.mPointMultSoundQueue.length > 0) {
            Game.SoundUtil.Play(this.mPointMultSoundQueue[0]);
            this.mPointMultSoundQueue.removeAt(0);
            this.mPointMultSoundDelay = ((40 / 1.67) | 0);
        }
        if(!this.CanPlay()) {
            var aSelectedPiece = this.GetSelectedPiece();
            if(aSelectedPiece != null) {
                aSelectedPiece.mSelected = false;
                aSelectedPiece.mSelectorAlpha.SetConstant(0.0);
            }
        }
        for(var aCol = 0; aCol < this.mColCount; aCol++) {
            this.mBumpVelocities[aCol] = Math.min(0, this.mBumpVelocities[aCol] + 0.275 * 1.67);
        }

        {
            var $srcArray23 = this.mBoard;
            for(var $enum23 = 0; $enum23 < $srcArray23.length; $enum23++) {
                var aPiece = $srcArray23[$enum23];
                if(aPiece != null) {
                    if(aPiece.mImmunityCount != 0) {
                        --aPiece.mImmunityCount;
                    }
                    if((aPiece.IsFlagSet(Game.Piece.EFlag.BOMB) || aPiece.IsFlagSet(Game.Piece.EFlag.REALTIME_BOMB) || aPiece.IsFlagSet(Game.Piece.EFlag.DOOM)) && (aPiece.mCounter == 0) && (this.mIsBoardStill)) {
                        this.BombExploded(aPiece);
                    }
                    if(aPiece.mSpinSpeed != 0) {
                        var aFrameCount = 20;
                        aPiece.mSpinFrame += aPiece.mSpinSpeed;
                        if(aPiece.mSpinFrame < 0) {
                            aPiece.mSpinFrame += aFrameCount;
                        }
                        if(aPiece.IsFlagSet(Game.Piece.EFlag.COUNTER)) {
                            if(aPiece.mSpinFrame >= aFrameCount) {
                                aPiece.mSpinFrame = 0;
                                aPiece.mSpinSpeed = 0;
                            }
                            if((aPiece.mSpinSpeed != 0) && aPiece.mSpinFrame >= 5 && aPiece.mSpinFrame <= 10) {
                                aPiece.mCounter--;
                                aPiece.mSpinFrame = 16;
                            }
                        }
                    }
                    if(aPiece.IsFlagSet(Game.Piece.EFlag.REALTIME_BOMB) && (this.mGameOverCount == 0) && (this.mLevelCompleteCount == 0) && (!this.IsGameSuspended())) {
                        aPiece.mTimer = (aPiece.mTimer + 1) % aPiece.mTimerThreshold;
                        if(aPiece.mTimer == 0) {
                            this.DecrementCounterGem(aPiece, false);
                        }
                    }
                }
            }
        }
        this.ExamineBoard();
        var doBoom = false;
        var doElectroBoom = false;
        var didMultiplierBoom = false;
        var anExplodeCount = 0;
        var anExplodeAccumX = 0;

        {
            var $srcArray24 = this.mBoard;
            for(var $enum24 = 0; $enum24 < $srcArray24.length; $enum24++) {
                var aPiece_2 = $srcArray24[$enum24];
                if((aPiece_2 != null) && (aPiece_2.mExplodeDelay > 0) && (--aPiece_2.mExplodeDelay == 0)) {
                    if(aPiece_2.IsFlagSet(Game.Piece.EFlag.INFERNO_SWAP)) {
                        var aPrevImmunity = aPiece_2.mImmunityCount;
                        aPiece_2.mImmunityCount = 1;
                        anExplodeAccumX += (aPiece_2.CX() | 0);
                        anExplodeCount++;
                        this.ExplodeAt((aPiece_2.CX() | 0), (aPiece_2.CY() | 0));
                        doBoom = true;
                        aPiece_2.mImmunityCount = aPrevImmunity;
                        aPiece_2.ClearFlag(Game.Piece.EFlag.INFERNO_SWAP);
                    } else {
                        if((aPiece_2.IsFlagSet(Game.Piece.EFlag.FLAME)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.BLAST_GEM)) || ((aPiece_2.IsFlagSet(Game.Piece.EFlag.LASER)) && (aPiece_2.mImmunityCount > 0))) {
                            if(aPiece_2.IsFlagSet(Game.Piece.EFlag.BLAST_GEM)) {
                                var aBlastCount = this.mGameStats[(Game.DM.EStat.BLASTGEMS_USED | 0)];
                                this.AddPoints((aPiece_2.CX() | 0), (aPiece_2.CY() | 0), 1000 * aBlastCount, Game.DM.gGemColors[(aPiece_2.mColor | 0)], aPiece_2.mMatchId, false, false, -1, false, Game.Board.EPointType.SPECIAL);
                                this.AddToStatCred(Game.DM.EStat.BLASTGEMS_USED, 1, aPiece_2.mMoveCreditId);
                                var aCurMoveCreditId = aPiece_2.mMoveCreditId;
                                var aSpecialCount = 0;

                                {
                                    var $srcArray25 = this.mBoard;
                                    for(var $enum25 = 0; $enum25 < $srcArray25.length; $enum25++) {
                                        var aSubPiece = $srcArray25[$enum25];
                                        if((aSubPiece != null) && (aSubPiece.IsFlagSet(Game.Piece.EFlag.FLAME) || aSubPiece.IsFlagSet(Game.Piece.EFlag.HYPERCUBE) || aSubPiece.IsFlagSet(Game.Piece.EFlag.LASER) || aSubPiece.IsFlagSet(Game.Piece.EFlag.COIN) || aSubPiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER) || aSubPiece.IsFlagSet(Game.Piece.EFlag.BLAST_GEM))) {
                                            if(aSubPiece.IsFlagSet(Game.Piece.EFlag.COIN)) {
                                                if(aSpecialCount == 0) {
                                                    aSpecialCount++;
                                                }
                                                aSubPiece.ClearFlag(Game.Piece.EFlag.COIN);
                                                continue;
                                            }
                                            aSubPiece.mMoveCreditId = aCurMoveCreditId;
                                            aSubPiece.mExplodeDelay = 1 + aSpecialCount * 15;
                                            aSubPiece.mImmunityCount = 0;
                                            aSpecialCount++;
                                        }
                                    }
                                }
                            } else {
                                this.AddToStatCred(Game.DM.EStat.FLAMEGEMS_USED, 1, aPiece_2.mMoveCreditId);
                            }
                            anExplodeAccumX += (aPiece_2.CX() | 0);
                            anExplodeCount++;
                            this.AddPoints((aPiece_2.CX() | 0), (aPiece_2.CY() | 0), 20, GameFramework.gfx.Color.WHITE_RGB, aPiece_2.mMatchId, true, true, aPiece_2.mMoveCreditId, false, Game.Board.EPointType.SPECIAL);
                            this.ExplodeAt((aPiece_2.CX() | 0), (aPiece_2.CY() | 0));
                            doBoom = true;
                        } else if(((aPiece_2.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.LASER)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.COIN)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER))) && (this.TriggerSpecialEx(aPiece_2, null))) {
                        } else {
                            if(aPiece_2.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) {
                                if(!didMultiplierBoom) {
                                    didMultiplierBoom = true;
                                }
                            } else {
                                doElectroBoom = true;
                            }
                            if((aPiece_2.IsFlagSet(Game.Piece.EFlag.DETONATOR)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.SCRAMBLE))) {
                                this.AddPoints((aPiece_2.CX() | 0), (aPiece_2.CY() | 0), 300, GameFramework.gfx.Color.WHITE_RGB, aPiece_2.mMatchId, true, true, aPiece_2.mMoveCreditId, false, Game.Board.EPointType.SPECIAL);
                            }
                            this.SmallExplodeAt(aPiece_2, aPiece_2.CX(), aPiece_2.CY(), true, false);
                        }
                    }
                }
            }
        }
        if(doBoom) {
            if(this.WantsCalmEffects()) {
                if(anExplodeCount > 0) {
                    Game.SoundUtil.PlayEx(Game.Resources['SOUND_PREBLAST'], 0.0, 0.5);
                    Game.SoundUtil.PlayEx(Game.Resources['SOUND_GEM_SHATTERS'], this.GetPanPosition(((anExplodeAccumX / anExplodeCount) | 0)), 0.5);
                }
                Game.SoundUtil.PlayEx(Game.Resources['SOUND_BOMB_EXPLODE'], 0.0, 0.5);
            } else {
                if(anExplodeCount > 0) {
                    Game.SoundUtil.Play(Game.Resources['SOUND_PREBLAST']);
                    Game.SoundUtil.PlayEx(Game.Resources['SOUND_GEM_SHATTERS'], this.GetPanPosition(((anExplodeAccumX / anExplodeCount) | 0)), 1.0);
                }
                Game.SoundUtil.Play(Game.Resources['SOUND_BOMB_EXPLODE']);
            }
        } else if(doElectroBoom) {
            if(this.WantsCalmEffects()) {
                Game.SoundUtil.PlayEx(Game.Resources['SOUND_SMALL_EXPLODE'], 0, 0.5);
            } else {
                Game.SoundUtil.Play(Game.Resources['SOUND_SMALL_EXPLODE']);
            }
        }

        {
            var $srcArray26 = this.mBoard;
            for(var $enum26 = 0; $enum26 < $srcArray26.length; $enum26++) {
                var aPiece_3 = $srcArray26[$enum26];
                if((aPiece_3 != null) && !aPiece_3.mScale.IncInVal()) {
                    if((aPiece_3.mScale.get_v() > 1.0)) {
                        aPiece_3.mScale.SetCurve('b+0,1.2,0.05,1,~###         ~#Blc');
                    } else if(aPiece_3.mScale.get_v() == 1.0) {
                        aPiece_3.mScale.SetConstant(1.0);
                    } else if((aPiece_3.mScale.get_v() == 0.0) && (!aPiece_3.mDestPct.IsDoingCurve())) {
                        this.DeletePiece(aPiece_3);
                    }
                }
            }
        }

        {
            var $srcArray27 = this.mBoard;
            for(var $enum27 = 0; $enum27 < $srcArray27.length; $enum27++) {
                var aPiece_4 = $srcArray27[$enum27];
                if(aPiece_4 != null) {
                    aPiece_4.mSelectorAlpha.IncInVal();
                    if((aPiece_4.mRotPct != 0.0) || (aPiece_4.mSelected)) {
                        aPiece_4.mRotPct += 0.02 * 1.67;
                        if(aPiece_4.mRotPct >= 1.0) {
                            aPiece_4.mRotPct = 0.0;
                        }
                    }
                }
            }
        }

        {
            var $srcArray28 = this.mBoard;
            for(var $enum28 = 0; $enum28 < $srcArray28.length; $enum28++) {
                var aPiece_5 = $srcArray28[$enum28];
                if(aPiece_5 != null) {
                    if(aPiece_5.mDestPct.get_v() != 0.0) {
                        aPiece_5.mX = this.GetColX(aPiece_5.mCol) * (1.0 - aPiece_5.mDestPct.get_v()) + this.GetColX(aPiece_5.mDestCol) * aPiece_5.mDestPct.get_v();
                        aPiece_5.mY = this.GetRowY(aPiece_5.mRow) * (1.0 - aPiece_5.mDestPct.get_v()) + this.GetRowY(aPiece_5.mDestRow) * aPiece_5.mDestPct.get_v();
                    } else {
                        aPiece_5.mFlyVY += aPiece_5.mFlyAY * 1.67;
                        aPiece_5.mX += aPiece_5.mFlyVX * 1.67;
                        aPiece_5.mY += aPiece_5.mFlyVY * 1.67;
                    }
                }
            }
        }
        if(this.mLightningStorms.length == 0) {
            this.FillInBlanks();
        }
        if(this.mIsBoardStill) {
            this.CheckForTutorialDialogs();
            if((this.mGameOverCount == 0) && (!this.ForceSwaps()) && (!this.FindMove(null, 0, true, true, false, null, false)) && (!this.mWantLevelup)) {
                this.GameOver();
            }
        }
        this.UpdateLightning();
        if(this.IsGameIdle()) {
            this.mIdleTicks++;
        }
        if((this.mComboFlashPct.IsInitialized()) && (!this.mComboFlashPct.HasBeenTriggered())) {
            this.mComboCountDisp = Math.min(this.mComboLen, this.mComboCountDisp + 0.04);
        } else if(this.mComboCountDisp < this.mComboCount) {
            this.mComboCountDisp = Math.min(this.mComboCount, this.mComboCountDisp + 0.04);
        } else {
            this.mComboCountDisp = Math.max(this.mComboCount, this.mComboCountDisp - 0.04);
        }
        if((this.mComboFlashPct.IsInitialized()) && (!this.mComboFlashPct.IncInVal())) {
            this.NewCombo();
        }
        this.UpdateSpeedBonus();
        this.UpdateCountPopups();
        this.UpdateComplements();
        this.UpdateLevelBar();
        this.UpdateCountdownBar();
        this.UpdateHint();
        if(this.mGameOverCount > 0 && this.mDeferredTutorialVector.length == 0) {
            this.mDeferredTutorialVector.length = 0;
            if((++this.mGameOverCount == 240) && (Game.DialogMgr.mDialogMgr.mDialogList.length == 0)) {
                this.GameOverExit();
            }
        }
        this.mPostFXManager.mAlpha = this.GetPieceAlpha();
        this.mPreFXManager.mAlpha = this.GetPieceAlpha();
        if(this.mIsBoardStill) {
            var aMovesPerSecond = Math.max(0.1, this.mGameStats[(Game.DM.EStat.NUM_MOVES | 0)] / (this.mGameTicks / 60.0));
            if(((GameFramework.Utils.GetRandFloatU() < 0.01) && (this.mLastSunTick == 0) && (this.mUpdateCnt >= 50)) || ((GameFramework.BaseApp.mApp.mCurFPS >= 45) && (GameFramework.Utils.GetRandFloatU() < 0.003 * aMovesPerSecond) && (!this.mSunFired)) || ((GameFramework.BaseApp.mApp.mCurFPS >= 45) && (GameFramework.Utils.GetRandFloatU() < 0.0006 * aMovesPerSecond))) {
                this.mSunPosition.SetCurve('b+-200,1500,0.006667,1,#0zN         ~~W7v');
                this.mSunFired = true;
                this.mLastSunTick = this.mUpdateCnt;
            }
        } else {
            this.mSunFired = false;
        }
        if(this.mComboFlashPct.get_v() == 0) {
            var aComboSpace = ((44 - this.mComboLen * 5.5) | 0);
            var anAngle = -this.mComboCount * aComboSpace + (((this.mComboLen - 1) * aComboSpace / 2) | 0);
            this.mComboSelectorAngle += ((anAngle - this.mComboSelectorAngle) / 20) * 1.67;
        }
        if((this.mWantLevelup) && (this.mIsBoardStill) && (this.mDeferredTutorialVector.length == 0)) {
            this.SubmitStats(false);
            for(var i = 0; i < (Game.DM.EStat._COUNT | 0); i++) {
                this.mLevelStats[i] = 0;
            }
            var anAnnouncement = new Game.Announcement(this, 'LEVEL\nCOMPLETE');
            anAnnouncement.mBlocksPlay = false;
            anAnnouncement.mDarkenBoard = false;
            Game.SoundUtil.Play(Game.Resources['SOUND_VOICE_LEVELCOMPLETE']);
            if((GameFramework.BaseApp.mApp.get_Is3D()) && (!Game.BejApp.mBejApp.mIsSlow)) {
                this.mHyperspace = new Game.HyperspaceUltra(this);
                Game.BejApp.mBejApp.mGameLayerWidget.AddWidget(this.mHyperspace);
            } else {
                this.mHyperspace = new Game.HyperspaceFallback(this);
                var aParentWidget = this.mParent;
                this.RemoveSelf();
                aParentWidget.AddWidget(this.mHyperspace);
                aParentWidget.AddWidget(this);
                this.mAppState.SetFocus(this);
            }
            {
                this.mHyperspace.Resize(-160, 0, 1920, 1200);
            }
            this.mWantLevelup = false;
        }
        if(this.mPointMultDarkenPct.get_v() > 0 && !this.mTimeExpired) {
            if(this.mLightningStorms.length > 0) {
                this.mBoardDarken = Math.max(this.mBoardDarken, this.mPointMultDarkenPct.get_v());
            } else {
                this.mBoardDarken = this.mPointMultDarkenPct.get_v();
            }
        }
        if(this.mBoardDarkenAnnounce > 0) {
            this.mBoardDarken = Math.max(this.mBoardDarken, this.mBoardDarkenAnnounce);
        }
        if(this.mHintCooldownTicks > 0) {
            --this.mHintCooldownTicks;
            this.mHintButton.SetMouseVisible(false);
        } else {
            this.mHintButton.SetMouseVisible(true);
        }
        if((this.mLightningStorms.length == 0) && (this.mSpeedBonusFlameModePct > 0)) {
            this.mSpeedBonusFlameModePct = Math.max(0, this.mSpeedBonusFlameModePct - 0.00125 * 1.67);
            if(this.mSpeedBonusFlameModePct == 0) {
                this.mSpeedBonusNum = 0;
            }
        }
        if(this.mSettlingDelay > 0) {
            this.mSettlingDelay--;
        }
        if(this.mScrambleDelayTicks > 0) {
            this.mScrambleDelayTicks--;
        }
        if(this.mFlameSound == null) {
            this.mFlameSound = GameFramework.BaseApp.mApp.GetSoundInst(Game.Resources['SOUND_SPEEDBOARD_FLAMELOOP']);
            if(this.mFlameSound != null) {
                this.mFlameSound.SetVolume(0.0);
                this.mFlameSound.PlayEx(true, false);
            }
        }
        if(this.mFlameSound != null) {
            this.mFlameSound.SetVolume(Math.max(this.mFlameSoundBlazingVol.GetOutVal(), Math.max(0.0, 1.0 - (1.0 - this.mSpeedBonusNum) * 2.5)) * this.mAlpha.GetOutVal() * this.GetPieceAlpha());
        }
        {
            if(Game.BejApp.mBejApp.mAutoPlay == Game.DM.EAutoplay.TestHyper) {
                if(this.GetLevelPct() < 0.95) {
                    this.mLevelPointsTotal = ((Math.max(this.mLevelPointsTotal, ((this.GetLevelPoints() * 0.95) | 0))) | 0);
                    Game.BejApp.mBejApp.mAutoLevelUpCount = 0;
                } else if(this.GetLevelPct() >= 1.0) {
                    Game.BejApp.mBejApp.mAutoLevelUpCount = ((Math.max(0, Game.BejApp.mBejApp.mAutoLevelUpCount + 1)) | 0);
                    if(Game.BejApp.mBejApp.mAutoLevelUpCount == 1) {
                        for(var i_2 = 0; i_2 < 3; ++i_2) {
                            var randPiece = this.GetPieceAtRowCol(Game.Util.Rand() % this.mRowCount, Game.Util.Rand() % this.mColCount);
                            if(randPiece != null && this.IsPieceStill(randPiece)) {
                                this.Hypercubeify(randPiece);
                            }
                        }
                    }
                }
            }
            if(!this.WantFreezeAutoplay() && (Game.BejApp.mBejApp.mAutoPlay != Game.DM.EAutoplay.None) && (this.CanPlay()) && (((this.IsBoardStill()) && (Game.Util.Rand() % 40 == 0)) || (Game.BejApp.mBejApp.mAutoPlay == Game.DM.EAutoplay.NoDelay || Game.BejApp.mBejApp.mAutoPlay == Game.DM.EAutoplay.NoDelayWithInvalidMoves || Game.BejApp.mBejApp.mAutoPlay == Game.DM.EAutoplay.TestHyper || Game.Util.Rand() % 60 == 0))) {
                var tryQueueSwap = false;
                if(Game.Util.Rand() % 8 < 8) {
                    tryQueueSwap = true;
                    var aCoords = Array.Create(4, 0);
                    if((Game.BejApp.mBejApp.mAutoPlay == Game.DM.EAutoplay.TestHyper && this.FindRandomMoveCoords(aCoords, true)) || this.FindRandomMove(aCoords)) {
                        var aPiece_6 = this.mBoard[this.mBoard.mIdxMult0 * (aCoords[3]) + aCoords[2]];
                        var aPiece2 = this.mBoard[this.mBoard.mIdxMult0 * (aCoords[1]) + aCoords[0]];
                        this.QueueSwap(aPiece_6, aPiece2.mRow, aPiece2.mCol, false, true);
                    }
                }
                if(!tryQueueSwap || (Game.BejApp.mBejApp.mAutoPlay == Game.DM.EAutoplay.NoDelayWithInvalidMoves && this.mUpdateCnt % 1 == 0) || (Game.BejApp.mBejApp.mAutoPlay == Game.DM.EAutoplay.TestHyper && this.mUpdateCnt % 40 == 0)) {
                    var aPiece_7 = this.mBoard[this.mBoard.mIdxMult0 * (Game.Util.Rand() % this.mRowCount) + Game.Util.Rand() % this.mColCount];
                    if(aPiece_7 != null) {
                        var anOffsets = Array.Create2D(4, 2, 0, -1, 0, 1, 0, 0, -1, 0, 1);
                        var aDir = Game.Util.Rand() % 4;
                        this.QueueSwap(aPiece_7, aPiece_7.mRow + anOffsets[anOffsets.mIdxMult0 * (aDir) + 1], aPiece_7.mCol + anOffsets[anOffsets.mIdxMult0 * (aDir) + 0], false, true);
                    }
                }
            }
        }
    },
    WantFreezeAutoplay : function Game_Board$WantFreezeAutoplay() {
        if(Game.BejApp.mBejApp.mAutoPlay == Game.DM.EAutoplay.TestHyper) {
            return Game.BejApp.mBejApp.mAutoLevelUpCount >= 300;
        } else {
            return this.mWantLevelup;
        }
    },
    GameOverExit : function Game_Board$GameOverExit() {
    },
    IsTutorialBusy : function Game_Board$IsTutorialBusy() {
        return this.mTutorialMgr.IsBusy() || Game.BejApp.mBejApp.mDialogMgr.GetDialog(Game.DM.EDialog.TUTORIAL) != null;
    },
    DoUpdate : function Game_Board$DoUpdate() {
        {
            for(var i = 0; i < 2; i++) {
                if(this.mSpeedFireBarPIEffect[i] != null) {
                    this.mSpeedFireBarPIEffect[i].Update();
                    if(!this.mSpeedFireBarPIEffect[i].IsActive()) {
                        this.mSpeedFireBarPIEffect[i] = null;
                    }
                }
            }
        }
        if(Game.BejApp.mBejApp.mDialogMgr.GetDialog(Game.DM.EDialog.END_LEVEL) != null) {
            return;
        }

        {
            var $srcArray29 = this.mBoard;
            for(var $enum29 = 0; $enum29 < $srcArray29.length; $enum29++) {
                var aPiece = $srcArray29[$enum29];
                if(aPiece != null) {
                    aPiece.mIsPieceStill = this.IsPieceStill(aPiece);
                    aPiece.mWillPieceBeStill = this.WillPieceBeStill(aPiece);
                }
            }
        }
        this.mIsBoardStill = this.IsBoardStill();
        this.mPreFXManager.Update();
        if((this.mAlpha.get_v() == 1) && (this.mScale.get_v() == 1) && (this.mUpdateCnt >= 200)) {
            this.UpdateTooltip();
        }
        if((this.mUserPaused || ((Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.QUEST_HELP) != null && this.mTimerAlpha.GetOutVal() == 1.0) || Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.OPTIONS) != null || Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.MAIN_MENU_CONFIRM) != null || Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.RESET) != null)) && this.WantsHideOnPause()) {
            this.mBoardHidePct = Math.min(1.0, this.mBoardHidePct + 0.035);
            if((Game.DialogMgr.mDialogMgr.mDialogList.length == 0) && (this.mStartDelay == 0)) {
                this.mVisPausePct = Math.min(1.0, this.mVisPausePct + 0.035);
            }
            if(this.mBoardHidePct >= 0.75) {
                return;
            }
        } else if(this.mScale.get_v() == 1.0) {
            this.mBoardHidePct = Math.max(0.0, this.mBoardHidePct - 0.075);
            this.mVisPausePct = Math.max(0.0, this.mVisPausePct - 0.075);
        }
        if(Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.HELP) != null || Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.OPTIONS) != null) {
            return;
        }
        if(this.mStartDelay > 0) {
            if(this.mStartDelay == 10) {
                this.CheckForTutorialDialogs();
                if(Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.HELP) != null) {
                    return;
                }
            }
            if(--this.mStartDelay == 0) {
                this.DisableUI(false);
            }
            return;
        }

        {
            var $srcArray30 = this.mBoard;
            for(var $enum30 = 0; $enum30 < $srcArray30.length; $enum30++) {
                var aPiece_2 = $srcArray30[$enum30];
                if(aPiece_2 != null) {
                    aPiece_2.Update();
                }
            }
        }
        if((this.mAlpha.get_v() == 1) && (this.mScale.get_v() == 1) && (Game.DialogMgr.mDialogMgr.mDialogList.length == 0) && (this.mGameOverCount == 0) && (this.mHasBoardSettled) && !this.IsTutorialBusy()) {
            if(this.mReadyDelayCount > 0) {
                if(--this.mReadyDelayCount == 110) {
                    if(true) {
                        var anAnnouncement = new Game.Announcement(this, 'GET READY');
                        anAnnouncement.mBlocksPlay = false;
                        anAnnouncement.mAlpha.mIncRate *= 3.0;
                        anAnnouncement.mScale.mIncRate *= 3.0;
                        anAnnouncement.mDarkenBoard = false;
                    }
                    Game.SoundUtil.PlayVoice(Game.Resources['SOUND_VOICE_GETREADY']);
                }
            }
            if(((this.mTimerInflate.get_v() == 0) || (this.GetTimeLimit() == 0) || (this.mGoDelayCount > 1)) && ((this.mGoDelayCount >= 0) && (--this.mGoDelayCount == 0))) {
                var anAnnouncement_2 = new Game.Announcement(this, 'GO!');
                anAnnouncement_2.mBlocksPlay = false;
                anAnnouncement_2.mAlpha.mIncRate *= 3.0;
                anAnnouncement_2.mScale.mIncRate *= 3.0;
                anAnnouncement_2.mDarkenBoard = false;
                Game.SoundUtil.PlayVoice(Game.Resources['SOUND_VOICE_GO']);
            }
        }
        for(var aQueuedMoveIdx = 0; aQueuedMoveIdx < (this.mQueuedMoveVector.length | 0); aQueuedMoveIdx++) {
            var aQueuedMove = this.mQueuedMoveVector[aQueuedMoveIdx];
            if(this.mUpdateCnt >= aQueuedMove.mUpdateCnt) {
                if(aQueuedMove.mUpdateCnt == this.mUpdateCnt) {
                    var aSelectedPiece = this.GetPieceById(aQueuedMove.mSelectedId);
                    if(aSelectedPiece != null) {
                        this.TrySwapEx(aSelectedPiece, aQueuedMove.mSwappedRow, aQueuedMove.mSwappedCol, aQueuedMove.mForceSwap, aQueuedMove.mPlayerSwapped, false, aQueuedMove.mDragSwap);
                    }
                }
                var anOldestWanted = this.mUpdateCnt - 1;
                if(this.mMoveDataVector.length > 0) {
                    anOldestWanted = this.mMoveDataVector[0].mUpdateCnt;
                }
                if(aQueuedMove.mUpdateCnt < anOldestWanted) {
                    this.mQueuedMoveVector.removeAt(aQueuedMoveIdx);
                    aQueuedMoveIdx--;
                }
            }
        }

        {
            var $srcArray31 = this.mBoard;
            for(var $enum31 = 0; $enum31 < $srcArray31.length; $enum31++) {
                var aPiece_3 = $srcArray31[$enum31];
                if(aPiece_3 != null) {
                    aPiece_3.mDestPct.IncInVal();
                    aPiece_3.mAlpha.IncInVal();
                    aPiece_3.mHintAlpha.IncInVal();
                    aPiece_3.mHintArrowPos.IncInVal();
                    aPiece_3.mHintFlashScale.IncInVal();
                    aPiece_3.mHintFlashAlpha.IncInVal();
                }
            }
        }
        if(this.UpdateBulging()) {

            {
                var $srcArray32 = this.mBoard;
                for(var $enum32 = 0; $enum32 < $srcArray32.length; $enum32++) {
                    var aPiece_4 = $srcArray32[$enum32];
                    if(aPiece_4 != null) {
                        aPiece_4.mSelectorAlpha.IncInVal();
                        if((aPiece_4.mRotPct != 0.0) || (aPiece_4.mSelected)) {
                            aPiece_4.mRotPct += 0.02;
                            if(aPiece_4.mRotPct >= 1.0) {
                                aPiece_4.mRotPct = 0.0;
                            }
                        }
                    }
                }
            }
            return;
        }
        this.UpdatePoints();
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
        this.UpdateGame();
    },
    UpdateCheckReset : function Game_Board$UpdateCheckReset() {
        if(this.mWantReset) {
            this.mWantReset = false;
            this.Init();
            this.NewGame();
            return true;
        }
        return false;
    },
    Update : function Game_Board$Update() {
        if(this.UpdateCheckReset()) {
            return;
        }
        if(Game.BejApp.mBejApp.mDialogMgr.GetDialog(Game.DM.EDialog.OPTIONS) == null && Game.BejApp.mBejApp.mDialogMgr.GetDialog(Game.DM.EDialog.RESET) == null) {
            this.mTutorialMgr.Update();
        }
        var allBtns = Array.Create(3, null, this.mHintButton, this.mMenuButton, this.mResetButton);

        {
            var $srcArray33 = allBtns;
            for(var $enum33 = 0; $enum33 < $srcArray33.length; $enum33++) {
                var btn = $srcArray33[$enum33];
                if(btn != null) {
                    btn.mAlpha = this.mAlpha.get_v();
                }
            }
        }
        if((GameFramework.BaseApp.mApp.get_Is3D()) && (!Game.BejApp.mBejApp.mIsSlow)) {
            GameFramework.BaseApp.mApp.mResourceManager.PauseStreaming((this.mHyperspace == null) || (this.mHyperspace.mUpdateCnt < 96));
        } else {
            GameFramework.BaseApp.mApp.mResourceManager.PauseStreaming(this.mHyperspace == null);
        }
        if(this.mBackground != null) {
            this.mBackground.mVisible = !Game.BejApp.mBejApp.mMainMenu.IsTransitioning() || !GameFramework.BaseApp.mApp.get_Is3D();
        }
        if(!this.AllowUI()) {
            this.DisableUI(true);
        }
        var aWantSpeed = 1.0;
        var anInterpVal = 0.95;
        this.Update_aSpeed = anInterpVal * this.Update_aSpeed + (1.0 - anInterpVal) * aWantSpeed;
        if(Math.abs(this.Update_aSpeed - aWantSpeed) < 0.01) {
            this.Update_aSpeed = aWantSpeed;
        }
        this.Update_aSpeed *= this.GetGameSpeed();
        this.mUpdateAcc += this.Update_aSpeed;
        var aNumUpdates = (this.mUpdateAcc | 0);
        this.mUpdateAcc -= aNumUpdates;
        var aPrevUpdateCnt = this.mUpdateCnt;
        for(var i = 0; i < aNumUpdates; i++) {
            this.DoUpdate();
        }
        this.mPreFXManager.mAlpha = this.GetPieceAlpha();
        this.mPostFXManager.mAlpha = this.GetPieceAlpha();
        if(Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.AWARD) != null) {
            this.mNeedsMaskCleared = true;
            if(this.mGameOverCount > 0) {
                this.mGameOverCount = 400;
            }
            this.DoUpdate();
        }
        this.mMenuButton.mMouseVisible = this.GetAlpha() * this.mSideAlpha.get_v() == 1.0;
        if((this.mHintButton != null) && (this.mHintCooldownTicks == 0)) {
            this.mHintButton.mMouseVisible = this.mMenuButton.mMouseVisible;
        }
        if(this.mResetButton != null) {
            this.mResetButton.mMouseVisible = this.mMenuButton.mMouseVisible;
        }
        this.mHintButton.mVisible = ((this.mSideXOff.get_v() == 0) && (this.mScale.get_v() >= 0.8));
        this.mMenuButton.mVisible = ((this.mSideXOff.get_v() == 0) && (this.mScale.get_v() >= 0.8));
        if((this.mAlpha.get_v() == 0) && (this.mKilling) && (Game.BejApp.mBejApp.mBoard == this)) {
        }
        if(((this.mUpdateCnt % 20 == 0) && (this.mUpdateCnt != aPrevUpdateCnt)) || (this.mBarInstanceVector.length < 3)) {
            var aBarInstance = new Game.BarInstance();
            aBarInstance.mSrcX = GameFramework.Utils.GetRandFloatU();
            aBarInstance.mSrcY = GameFramework.Utils.GetRandFloatU();
            aBarInstance.mAlpha = 0;
            aBarInstance.mDAlpha = 0.018 + GameFramework.Utils.GetRandFloatU() * 0.003;
            this.mBarInstanceVector.push(aBarInstance);
        }
        for(var aBarIdx = 0; aBarIdx < this.mBarInstanceVector.length; aBarIdx++) {
            var aBarInstance_2 = this.mBarInstanceVector[aBarIdx];
            aBarInstance_2.mAlpha += aBarInstance_2.mDAlpha;
            if(aBarInstance_2.mAlpha >= 1.0) {
                aBarInstance_2.mAlpha = 1.0;
                aBarInstance_2.mDAlpha = -aBarInstance_2.mDAlpha;
            } else if(aBarInstance_2.mAlpha <= 0.0) {
                this.mBarInstanceVector.removeAt(aBarIdx);
                aBarIdx--;
            }
        }
        if(this.mGameOverCount == 400) {
            this.Init();
            this.NewGame();
        }
        if(this.mBackground != null) {
            this.mBackground.mWantAnim = ((this.mHyperspace == null) || (this.mScale.get_v() == 1.0)) && (this.GetAlpha() == 1.0) && (this.mScale.get_v() == 1.0) && (this.mHasBoardSettled) && (Game.BejApp.mBejApp.mDialogMgr.mDialogList.length == 0);
        }
        if(this.mUpdateCnt % 60 == 0) {
            this.AddToStat(Game.DM.EStat.FPS_SAMPLE_COUNT, 1);
            this.AddToStat(Game.DM.EStat.FPS_SAMPLE_TOTAL, GameFramework.BaseApp.mApp.mCurFPS);
            this.MaxStat(Game.DM.EStat.FPS_MAX, GameFramework.BaseApp.mApp.mCurFPS);
            if((GameFramework.BaseApp.mApp.mCurFPS < this.mLevelStats[(Game.DM.EStat.FPS_MIN | 0)]) || (this.mLevelStats[(Game.DM.EStat.FPS_MIN | 0)] == 0)) {
                this.mLevelStats[(Game.DM.EStat.FPS_MIN | 0)] = GameFramework.BaseApp.mApp.mCurFPS;
            }
            if((GameFramework.BaseApp.mApp.mCurFPS < this.mGameStats[(Game.DM.EStat.FPS_MIN | 0)]) || (this.mGameStats[(Game.DM.EStat.FPS_MIN | 0)] == 0)) {
                this.mGameStats[(Game.DM.EStat.FPS_MIN | 0)] = GameFramework.BaseApp.mApp.mCurFPS;
            }
        }
    },
    DrawGemLighting : function Game_Board$DrawGemLighting(g, thePiece) {
        if((!GameFramework.BaseApp.mApp.get_Is3D()) || (thePiece.mColor == Game.DM.EGemColor.HYPERCUBE) || (thePiece.mScale.get_v() != 1.0) || (thePiece.mRotPct != 0.0) || (this.GetPieceAlpha() != 1.0)) {
            return;
        }
        if(this.mPostFXManager.mEffects[(Game.Effect.EFxType.LIGHT | 0)] != null) {
            var aLights = null;
            var aXOfs = this.GetBoardX() + ((Game.Board.GEM_WIDTH / 2) | 0);
            var aYOfs = this.GetBoardY() + ((Game.Board.GEM_WIDTH / 2) | 0);

            {
                var $srcArray34 = this.mPostFXManager.mEffects[(Game.Effect.EFxType.LIGHT | 0)];
                for(var $enum34 = 0; $enum34 < $srcArray34.length; $enum34++) {
                    var anEffect = $srcArray34[$enum34];
                    var aX = anEffect.mX - aXOfs;
                    var aY = anEffect.mY - aYOfs;
                    if(aLights == null) {
                        aLights = Game.Board.mGemLightData;
                        Game.Board.mGemLightData[0] = 0;
                        Game.Board.mGemLightData[1] = 0;
                        Game.Board.mGemLightData[2] = 0;
                        Game.Board.mGemLightData[3] = 0;
                        Game.Board.mGemLightData[4] = 0;
                        Game.Board.mGemLightData[5] = 0;
                        Game.Board.mGemLightData[6] = 0;
                        Game.Board.mGemLightData[7] = 0;
                        Game.Board.mGemLightData[8] = 0;
                    }
                    {
                        var aDX = (aX - thePiece.mX) / anEffect.mScale;
                        var aDY = (aY - thePiece.mY) / anEffect.mScale;
                        var aDistSq = aDX * aDX + aDY * aDY;
                        var anIntensity = Math.min(anEffect.mValue[2], anEffect.mValue[0] / Math.max(1.0, aDistSq + anEffect.mValue[1]));
                        if(anIntensity <= 0.2) {
                            continue;
                        }
                        var aDXDY = aDX / aDY;
                        var aDYDX = aDX / aDY;
                        var aDir = 8;
                        if(aDistSq < 500) {
                            aDir = 8;
                        } else if(aDY < 0) {
                            if(aDXDY >= 2.414) {
                                aDir = 2;
                            } else if(aDXDY >= 0.414) {
                                aDir = 1;
                            } else if(aDXDY >= -0.414) {
                                aDir = 0;
                            } else if(aDXDY >= -2.414) {
                                aDir = 7;
                            } else {
                                aDir = 6;
                            }
                        } else {
                            if(aDXDY <= -2.414) {
                                aDir = 2;
                            } else if(aDXDY <= -0.414) {
                                aDir = 3;
                            } else if(aDXDY <= 0.414) {
                                aDir = 4;
                            } else if(aDXDY <= 2.414) {
                                aDir = 5;
                            } else {
                                aDir = 6;
                            }
                        }
                        aLights[aDir] = Math.min(1.0, aLights[aDir] + anIntensity * anEffect.mAlpha);
                    }
                }
            }
            if(aLights != null) {
                var anOfsX = ((thePiece.GetScreenX() + thePiece.mShakeOfsX) | 0);
                var anOfsY = ((thePiece.GetScreenY() + thePiece.mShakeOfsY) | 0);
                for(var aLightDir = 0; aLightDir < aLights.length; aLightDir++) {
                    if((aLights[aLightDir] != 0.0) && (thePiece.mColor != Game.DM.EGemColor.HYPERCUBE)) {
                        Game.Resources['IMAGE_GEMLIGHTING'].mAdditive = true;
                        var _t35 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(aLights[aLightDir]));
                        try {
                            g.DrawImageCel(Game.Resources['IMAGE_GEMLIGHTING'].get_OffsetImage(), anOfsX, anOfsY, (thePiece.mColor | 0) * 9 + aLightDir);
                        } finally {
                            _t35.Dispose();
                        }
                    }
                }
            }
        }
        if((this.mSunPosition.IsInitialized()) && (!this.mSunPosition.HasBeenTriggered())) {
            Game.Resources['IMAGE_GEMLIGHTING'].mAdditive = true;
            var aPieceDist = ((thePiece.CX() - this.GetBoardX()) + (thePiece.CY() - this.GetRowY(0))) * 0.707;
            var aSunDist = aPieceDist - this.mSunPosition.get_v();
            if(Math.abs(aSunDist) > 160) {
                return;
            }
            var anOfsX_2 = ((thePiece.GetScreenX() + thePiece.mShakeOfsX) | 0);
            var anOfsY_2 = ((thePiece.GetScreenY() + thePiece.mShakeOfsY) | 0);
            var aLightUL = Math.min(0.5, 8.0 / Math.max(1, (Math.abs(aSunDist - 32.0))));
            if(aLightUL > 0) {
                var _t36 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(aLightUL));
                try {
                    g.DrawImageCel(Game.Resources['IMAGE_GEMLIGHTING'].get_OffsetImage(), anOfsX_2, anOfsY_2, (thePiece.mColor | 0) * 9 + 1);
                } finally {
                    _t36.Dispose();
                }
            }
            var aLightTop = Math.min(0.5, 8.0 / Math.max(1, (Math.abs(aSunDist) - 0)));
            if(aLightTop > 0) {
                var _t37 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(aLightTop));
                try {
                    g.DrawImageCel(Game.Resources['IMAGE_GEMLIGHTING'].get_OffsetImage(), anOfsX_2, anOfsY_2, (thePiece.mColor | 0) * 9 + 8);
                } finally {
                    _t37.Dispose();
                }
            }
            var aLightLR = Math.min(0.5, 8.0 / Math.max(1, (Math.abs(aSunDist + 32.0))));
            if(aLightLR > 0) {
                var _t38 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(aLightLR));
                try {
                    g.DrawImageCel(Game.Resources['IMAGE_GEMLIGHTING'].get_OffsetImage(), anOfsX_2, anOfsY_2, (thePiece.mColor | 0) * 9 + 5);
                } finally {
                    _t38.Dispose();
                }
            }
        }
    },
    DrawHypercube : function Game_Board$DrawHypercube(g, thePiece) {
        var aHyperFrame = ((((Game.BejApp.mBejApp.mUpdateCnt / 3) | 0)) | 0) % 60;
        g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.GetPieceAlpha()));
        g.DrawImageCel(Game.Resources['IMAGE_HYPERCUBE_FRAME'].get_OffsetImage(), thePiece.GetScreenX() - 16, thePiece.GetScreenY() - 16, aHyperFrame);
        //JS
        gCanvasAllowAdditive = true;
        //-JS
        var img = Game.Resources['IMAGE_HYPERCUBE_COLORGLOW'];
        img.mAdditive = true;
        g.DrawImageCel(img.get_OffsetImage(), img.mOffsetX + thePiece.GetScreenX() - 16, img.mOffsetY + thePiece.GetScreenY() - 16, aHyperFrame);
        img.mAdditive = false;
        g.PopColor();
        //JS
        gCanvasAllowAdditive = false;
        //-JS
    },
    DrawBombGem : function Game_Board$DrawBombGem(g, thePiece) {
    },
    DrawDoomGem : function Game_Board$DrawDoomGem(g, thePiece) {
    },
    DrawPieceShadow : function Game_Board$DrawPieceShadow(g, thePiece) {
        var aScale = thePiece.mScale.get_v();
        var anOfsX = ((thePiece.GetScreenX() + thePiece.mShakeOfsX) | 0);
        var anOfsY = ((thePiece.GetScreenY() + thePiece.mShakeOfsY) | 0);
        if(aScale != 1.0) {
            g.PushScale(aScale, aScale, thePiece.GetScreenX() + ((Game.Board.GEM_WIDTH / 2) | 0), thePiece.GetScreenY() + ((Game.Board.GEM_HEIGHT / 2) | 0));
        }
        var anAlpha;
        if(this.mHyperspace != null) {
            anAlpha = thePiece.mAlpha.get_v() * this.mHyperspace.GetPieceAlpha();
        } else {
            anAlpha = thePiece.mAlpha.get_v() * this.GetPieceAlpha();
        }
        g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255 * anAlpha) | 0)));
        if(thePiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) {
            var aFrame = (Math.min(thePiece.mRotPct * Game.Resources['IMAGE_GEMS_RED'].mNumFrames, Game.Resources['IMAGE_GEMS_RED'].mNumFrames - 1) | 0);
            g.DrawImageCel(Game.BejUtil.GetGemColorImageShadow(thePiece.mColor).get_OffsetImage(), anOfsX, anOfsY, aFrame);
        } else if(((thePiece.mColor | 0) > -1 && (thePiece.mColor | 0) < 7) || thePiece.IsFlagSet(Game.Piece.EFlag.LASER)) {
            var aFrame_2 = (Math.min(((thePiece.mRotPct * Game.Resources['IMAGE_GEMS_RED'].mNumFrames) | 0), Game.Resources['IMAGE_GEMS_RED'].mNumFrames - 1) | 0);
            g.DrawImageCel(Game.BejUtil.GetGemColorImageShadow(thePiece.mColor).get_OffsetImage(), anOfsX, anOfsY, aFrame_2);
        }
        g.PopColor();
        if(aScale != 1.0) {
            g.PopMatrix();
        }
    },
    DrawPiece : function Game_Board$DrawPiece(g, thePiece, theScale, fromHyperspace) {
        if(fromHyperspace === undefined) {
            fromHyperspace = false;
        }
        var aScale = thePiece.mScale.get_v();
        var anAlpha;
        if((this.mHyperspace != null) && (!fromHyperspace)) {
            anAlpha = thePiece.mAlpha.get_v() * this.mHyperspace.GetPieceAlpha();
        } else {
            anAlpha = thePiece.mAlpha.get_v() * this.GetPieceAlpha();
        }
        if(anAlpha == 0) {
            return;
        }
        if(thePiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) {
            aScale += this.mBoostShowPct.get_v() * 0.25;
        }
        aScale *= theScale;
        var anOfsX = ((thePiece.GetScreenX() + thePiece.mShakeOfsX) | 0);
        var anOfsY = ((thePiece.GetScreenY() + thePiece.mShakeOfsY) | 0);
        var drawGem = false;
        if(aScale != 1.0) {
            g.PushScale(aScale, aScale, thePiece.GetScreenX() + ((Game.Board.GEM_WIDTH / 2) | 0), thePiece.GetScreenY() + ((Game.Board.GEM_HEIGHT / 2) | 0));
        }
        if(this.mShowMoveCredit) {
            g.PushColor(GameFramework.gfx.Color.WHITE_RGB);
            g.SetFont(Game.Resources['FONT_HUMANST19']);
            if(thePiece.mMoveCreditId != -1) {
                g.DrawString(GameFramework.Utils.ToString(thePiece.mMoveCreditId), thePiece.GetScreenX() + 10, thePiece.GetScreenY() + 20);
            }
            if(thePiece.mCounter != 0) {
                g.DrawString(GameFramework.Utils.ToString(thePiece.mCounter), thePiece.GetScreenX() + 80, thePiece.GetScreenY() + 20);
            }
            g.PopColor();
        }
        g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255 * anAlpha) | 0)));
        if(thePiece.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) {
            this.DrawHypercube(g, thePiece);
        } else if(thePiece.IsFlagSet(Game.Piece.EFlag.BOMB) || thePiece.IsFlagSet(Game.Piece.EFlag.REALTIME_BOMB)) {
            this.DrawBombGem(g, thePiece);
        } else if(thePiece.IsFlagSet(Game.Piece.EFlag.DOOM)) {
            this.DrawDoomGem(g, thePiece);
        } else if(thePiece.IsFlagSet(Game.Piece.EFlag.DIG)) {
            if(thePiece.mColor >= 0) {
                drawGem = true;
            }
        } else {
            drawGem = true;
        }
        if(drawGem && thePiece.mColor >= 0) {
            if(this.CanBakeShadow(thePiece)) {
                g.DrawImageCel(Game.Resources['IMAGE_GEMS_SHADOWED'].get_OffsetImage(), anOfsX, anOfsY, (thePiece.mColor | 0));
            } else {
                var gemColors = Array.Create(7, null, GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(192, 192, 192), GameFramework.gfx.Color.RGBToInt(32, 192, 32), GameFramework.gfx.Color.RGBToInt(224, 192, 32), GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(255, 160, 32), GameFramework.gfx.Color.RGBToInt(255, 255, 255));
                if(thePiece.IsFlagSet(Game.Piece.EFlag.LASER)) {
                    g.PushColor(GameFramework.gfx.Color.UInt_AToInt(gemColors[(thePiece.mColor | 0)], ((255.0 * thePiece.mAlpha.get_v() * this.GetPieceAlpha()) | 0)));
                }
                var anImage = Game.BejUtil.GetGemColorImage(thePiece.mColor);
                var aFrameF = thePiece.mRotPct * anImage.mNumFrames;
                {
                    g.DrawImageCel(anImage.get_OffsetImage(), anOfsX, anOfsY, (aFrameF | 0));
                }
                if(thePiece.IsFlagSet(Game.Piece.EFlag.LASER)) {
                    g.PopColor();
                }
            }
            if(thePiece.IsFlagSet(Game.Piece.EFlag.POINT_MULTIPLIER)) {
            }
        }
        g.PopColor();
        if(aScale != 1.0) {
            g.PopMatrix();
        }
        if(thePiece.IsFlagSet(Game.Piece.EFlag.COUNTER) && !thePiece.IsShrinking()) {
            if((thePiece.mSpinFrame < 5 || thePiece.mSpinFrame > 15)) {
            }
        }
        if(thePiece.mHidePct > 0) {
            var aHidePct = 0.15 + (thePiece.mHidePct * 0.85);
            g.PushColor(GameFramework.gfx.Color.RGBAToInt(128, 128, 128, ((aHidePct * 255) | 0)));
            g.FillRect(thePiece.GetScreenX() + 1, thePiece.GetScreenY() + 1, Game.Board.GEM_WIDTH - 2, Game.Board.GEM_HEIGHT - 2);
            g.PopColor();
        }
        if(thePiece.mSelectorAlpha.get_v() != 0) {
            g.PushColor(GameFramework.gfx.Color.FAlphaToInt(thePiece.mSelectorAlpha.get_v() * this.GetPieceAlpha()));
            g.DrawImage(Game.Resources['IMAGE_SELECTOR'], thePiece.GetScreenX(), thePiece.GetScreenY());
            g.PopColor();
        }
    },
    DrawFrame : function Game_Board$DrawFrame(g) {
        {
            this.DrawTopFrame(g);
            this.DrawBottomFrame(g);
        }
    },
    DrawTopFrame : function Game_Board$DrawTopFrame(g) {
        g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetBoardAlpha()) | 0)));
        if(this.WantTopFrame()) {
            g.DrawImage(Game.Resources['IMAGE_BOARD_TOP_FRAME'].get_CenteredImage(), this.GetBoardCenterX(), this.GetBoardY() - 5);
            if(this.WantWarningGlow()) {
                g.PushColor(this.GetWarningGlowColor());
                var img = Game.Resources['IMAGE_BOARD_TOP_FRAME_GLOW'];
                img.mAdditive = true;
                g.DrawImage(img.get_CenteredImage(), this.GetBoardCenterX(), this.GetBoardY() - 5);
                img.mAdditive = false;
                g.PopColor();
            }
        }
        g.PopColor();
    },
    DrawBottomFrame : function Game_Board$DrawBottomFrame(g) {
        if(this.WantCountdownBar()) {
            this.DrawCountdownBar(g);
            if(this.WantBottomFrame()) {
                var _t39 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetBoardAlpha()) | 0)));
                try {
                    g.DrawImage(Game.Resources['IMAGE_BOARD_BOTTOM_FRAME'].get_CenteredImage(), this.GetBoardCenterX(), this.GetBoardY() + Game.Board.GEM_HEIGHT * this.mRowCount + 33);
                } finally {
                    _t39.Dispose();
                }
            }
        } else if(this.WantBottomLevelBar()) {
            this.DrawLevelBar(g);
            if(this.WantBottomFrame()) {
                var _t40 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetBoardAlpha()) | 0)));
                try {
                    g.DrawImage(Game.Resources['IMAGE_BOARD_BOTTOM_FRAME'].get_CenteredImage(), this.GetBoardCenterX(), this.GetBoardY() + Game.Board.GEM_HEIGHT * this.mRowCount + 33);
                } finally {
                    _t40.Dispose();
                }
            }
        } else if(this.WantBottomFrame()) {
            var _t41 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetBoardAlpha()) | 0)));
            try {
                g.DrawImage(Game.Resources['IMAGE_BOARD_THIN_BOTTOM_FRAME'].get_CenteredImage(), this.GetBoardCenterX(), this.GetBoardY() + Game.Board.GEM_HEIGHT * this.mRowCount + 11);
            } finally {
                _t41.Dispose();
            }
        }
        if(this.WantBottomFrame() && this.WantWarningGlow()) {
            var _t42 = g.PushColor(this.GetWarningGlowColor());
            try {
                if(this.WantBottomLevelBar() || this.GetTimeLimit() > 0) {
                    g.DrawImage(Game.Resources['IMAGE_BOARD_BOTTOM_FRAME_GLOW'].get_CenteredImage(), this.GetBoardCenterX(), this.GetBoardY() + Game.Board.GEM_HEIGHT * this.mRowCount + 33);
                } else {
                    g.DrawImage(Game.Resources['IMAGE_BOARD_THIN_BOTTOM_FRAME_GLOW'].get_CenteredImage(), this.GetBoardCenterX(), this.GetBoardY() + Game.Board.GEM_HEIGHT * this.mRowCount + 11);
                }
            } finally {
                _t42.Dispose();
            }
        }
    },
    DrawLevelBar : function Game_Board$DrawLevelBar(g) {
        var anAlpha = Math.pow(this.GetBoardAlpha(), 4.0);
        var _t43 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((this.GetBoardAlpha() * 255.0) | 0)));
        try {
            g.DrawImage(Game.Resources['IMAGE_BOARD_BOTTOM_FRAME_BACK'].get_CenteredImage(), this.GetBoardCenterX(), this.GetBoardY() + 1054);
            var aBarRect = this.GetLevelBarRect();
            var noAdditive = !GameFramework.BaseApp.mApp.get_Is3D();
            aBarRect.mWidth = ((aBarRect.mWidth * this.mLevelBarPct) | 0);
            var aSnappedStartX = g.GetSnappedX(aBarRect.mX);
            var aSnappedEndX = g.GetSnappedX(aBarRect.mX + aBarRect.mWidth);
            var aSnappedWidth = aSnappedEndX - aSnappedStartX;
            if(!noAdditive) {
                var _t44 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(12, 35, 47, 255));
                try {
                    g.FillRect(aSnappedStartX, aBarRect.mY, aSnappedWidth, aBarRect.mHeight);
                } finally {
                    _t44.Dispose();
                }
            }
            {
                for(var aBarIdx = 0; aBarIdx < this.mBarInstanceVector.length; aBarIdx++) {
                    var aBarInstance = this.mBarInstanceVector[aBarIdx];
                    var anImageInst = Game.Resources['IMAGE_BARFILL'].CreateImageInstRect(((aBarInstance.mSrcX * 1000 * g.mScale) | 0), ((aBarInstance.mSrcY * 210 * g.mScale) | 0), ((aSnappedWidth * g.mScale) | 0), ((aBarRect.mHeight * g.mScale) | 0));
                    if(!noAdditive) {
                        anImageInst.mAdditive = true;
                    }
                    var _t45 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((aBarInstance.mAlpha * anAlpha * 255.0) | 0)));
                    try {
                        g.DrawImage(anImageInst, aSnappedStartX, aBarRect.mY);
                    } finally {
                        _t45.Dispose();
                    }
                }
                if(noAdditive) {
                    var _t46 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(128, 200, 255, 100));
                    try {
                        g.FillRect(aSnappedStartX, aBarRect.mY, aSnappedWidth, aBarRect.mHeight);
                    } finally {
                        _t46.Dispose();
                    }
                }
            }
        } finally {
            _t43.Dispose();
        }
    },
    DrawCountdownBar : function Game_Board$DrawCountdownBar(g) {
        var anAlpha = Math.pow(this.GetBoardAlpha(), 4.0);
        var aX;
        var aY;
        var aBarRect = this.GetCountdownBarRect();
        var _t47 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((this.GetBoardAlpha() * 255.0) | 0)));
        try {
            aX = this.GetBoardCenterX();
            aY = this.GetBoardY() + Game.Board.GEM_HEIGHT * this.mRowCount + 30;
            g.DrawImage(Game.Resources['IMAGE_BOARD_BOTTOM_FRAME_BACK'].get_CenteredImage(), aX, aY);
        } finally {
            _t47.Dispose();
        }
        var _t48 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(0xbc, 0x43, 0x89, ((anAlpha * 100.0) | 0)));
        try {
            if(this.WantWarningGlow()) {
                var aColor = this.GetWarningGlowColor();
                if(aColor > 0xffffff) {
                    var _t49 = g.PushColor(aColor);
                    try {
                        g.DrawImage(Game.Resources['IMAGE_BOARD_BOTTOM_FRAME_BACK'].get_CenteredImage(), aX, aY);
                    } finally {
                        _t49.Dispose();
                    }
                }
            }
            aBarRect.mWidth = ((this.mCountdownBarPct * aBarRect.mWidth + this.mLevelBarSizeBias) | 0);
            g.FillRect(aBarRect.mX, aBarRect.mY, aBarRect.mWidth, aBarRect.mHeight);
            if(this.mLevelBarBonusAlpha.get_v() > 0) {
                var aCountdownBar = this.GetCountdownBarRect();
                aCountdownBar.mWidth = ((aCountdownBar.mWidth * this.GetLevelPct()) | 0);
                var _t50 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(240, 255, 200, ((this.mLevelBarBonusAlpha.get_v() * 255.0) | 0)));
                try {
                    g.FillRect(aCountdownBar.mX, aCountdownBar.mY, aCountdownBar.mWidth, aCountdownBar.mHeight);
                } finally {
                    _t50.Dispose();
                }
            }
        } finally {
            _t48.Dispose();
        }
    },
    DrawCountPopups : function Game_Board$DrawCountPopups(g) {
        if(!GameFramework.BaseApp.mApp.get_Is3D()) {
            return;
        }
        var aCX = this.GetBoardX() + -95;
        var aCY;
        if(this.mGemCountAlpha.get_v() > 0) {
            var aColor = GameFramework.gfx.Color.RGBToInt(96, 96, 255);
            aCY = ((this.GetRowY(3) + Game.Board.GEM_HEIGHT * -0.185) | 0);
            var anAlpha = this.mGemScalarAlpha.get_v() * this.GetPieceAlpha();
            var aScale = 2.0 + (1.0 - this.mGemScalarAlpha.get_v()) * 2.0;
            var aString = GameFramework.Utils.ToString(this.mGemCountValueDisp);
            var aFont = Game.Resources['FONT_POPUP_COUNT'];
            var aDrawWidth = (aFont.StringWidth(aString) | 0);
            var aDrawHeight = (aFont.GetAscent() | 0);
            g.SetFont(aFont);
            g.PushScale(aScale, aScale, aCX, aCY);
            g.PushColor(GameFramework.gfx.Color.RGBAToInt(96, 96, 255, ((255.0 * anAlpha) | 0)));
            g.DrawString(aString, aCX - ((aDrawWidth / 2) | 0), aCY + ((aDrawHeight / 2) | 0));
            g.PopColor();
            aScale = this.mGemCountCurve.get_v() * 0.9;
            anAlpha = this.mGemCountAlpha.get_v() * this.GetPieceAlpha();
            g.PopMatrix();
            g.PushScale(aScale, aScale, aCX, aCY);
            g.PushColor(GameFramework.gfx.Color.UInt_AToInt(0, ((128.0 * anAlpha) | 0)));
            g.DrawString(aString, aCX - ((aDrawWidth / 2) | 0) + 8, aCY + ((aDrawHeight / 2) | 0) + 8);
            g.PopColor();
            g.PushColor(GameFramework.gfx.Color.UInt_AToInt(aColor, ((255.0 * anAlpha) | 0)));
            g.DrawString(aString, aCX - ((aDrawWidth / 2) | 0), aCY + ((aDrawHeight / 2) | 0));
            g.PopColor();
            g.SetFont(Game.Resources['FONT_POPUP_TEXT']);
            aString = 'GEMS';
            var aTextX = aCX - (((g.StringWidth(aString) | 0) / 2) | 0) + 10;
            aCY += 130;
            g.PushColor(GameFramework.gfx.Color.FAlphaToInt(anAlpha));
            g.DrawString(aString, aTextX, aCY);
            g.PopColor();
            g.PopMatrix();
        }
        if(this.mCascadeCountAlpha.get_v() > 0) {
            var aColor_2 = GameFramework.gfx.Color.RGBToInt(255, 64, 64);
            aCY = this.GetRowY(4) + ((0.6 * Game.Board.GEM_HEIGHT) | 0);
            var anAlpha_2 = this.mCascadeScalarAlpha.get_v() * this.GetPieceAlpha();
            var aScale_2 = 1.0 + (1.0 - this.mCascadeScalarAlpha.get_v()) * 0.9;
            var aString_2 = GameFramework.Utils.ToString(this.mCascadeCountValueDisp);
            var aFont_2 = Game.Resources['FONT_POPUP_COUNT'];
            var aDrawWidth_2 = (aFont_2.StringWidth(aString_2) | 0);
            var aDrawHeight_2 = (aFont_2.GetAscent() | 0);
            g.SetFont(aFont_2);
            g.PushScale(aScale_2, aScale_2, aCX, aCY);
            g.PushColor(GameFramework.gfx.Color.UInt_AToInt(aColor_2, ((255.0 * anAlpha_2) | 0)));
            g.DrawString(aString_2, aCX - ((aDrawWidth_2 / 2) | 0), aCY + ((aDrawHeight_2 / 2) | 0));
            g.PopColor();
            aScale_2 = this.mCascadeCountCurve.get_v() * 1.0;
            anAlpha_2 = this.mCascadeCountAlpha.get_v() * this.GetPieceAlpha();
            g.PopMatrix();
            g.PushScale(aScale_2, aScale_2, aCX, aCY);
            var aShadowColor = GameFramework.gfx.Color.UInt_AToInt(0, ((128.0 * anAlpha_2) | 0));
            g.PushColor(GameFramework.gfx.Color.UInt_AToInt(0, ((128.0 * anAlpha_2) | 0)));
            g.DrawString(aString_2, aCX - ((aDrawWidth_2 / 2) | 0) + 8, aCY + ((aDrawHeight_2 / 2) | 0) + 8);
            g.PopColor();
            g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 64, 64, ((255.0 * anAlpha_2) | 0)));
            g.DrawString(aString_2, aCX - ((aDrawWidth_2 / 2) | 0), aCY + ((aDrawHeight_2 / 2) | 0));
            g.PopColor();
            g.SetFont(Game.Resources['FONT_POPUP_TEXT']);
            aString_2 = 'CASCADES';
            var aTextX_2 = aCX - (((g.StringWidth(aString_2) | 0) / 2) | 0) + 0;
            aCY += 130;
            g.PushColor(GameFramework.gfx.Color.FAlphaToInt(anAlpha_2));
            g.DrawString(aString_2, aTextX_2, aCY);
            g.PopColor();
            g.PopMatrix();
        }
    },
    DrawComplements : function Game_Board$DrawComplements(g) {
        if((this.mComplementAlpha.get_v() != 0) && this.mComplementNum != -1 && (GameFramework.BaseApp.mApp.get_Is3D())) {
            var gWordId = Array.Create(7, "", Game.Resources.IMAGE_COMPLEMENT_GOOD_ID, Game.Resources.IMAGE_COMPLEMENT_EXCELLENT_ID, Game.Resources.IMAGE_COMPLEMENT_AWESOME_ID, Game.Resources.IMAGE_COMPLEMENT_SPECTACULAR_ID, Game.Resources.IMAGE_COMPLEMENT_EXTRAORDINARY_ID, Game.Resources.IMAGE_COMPLEMENT_UNBELIEVABLE_ID, Game.Resources.IMAGE_COMPLEMENT_BLAZINGSPEED_ID);
            g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mComplementAlpha.get_v() * this.GetPieceAlpha()));
            g.PushScale(this.mComplementScale.get_v(), this.mComplementScale.get_v(), this.GetBoardCenterX(), 450.0);
            g.DrawImage(GameFramework.BaseApp.mApp.mResourceManager.GetImageResourceById(gWordId[this.mComplementNum]).get_CenteredImage(), this.GetBoardCenterX(), 450.0);
            g.PopMatrix();
            g.PopColor();
        }
    },
    DrawPointMultiplier : function Game_Board$DrawPointMultiplier(g, front) {
        if(!this.mShowPointMultiplier) {
            return;
        }
        var aMultX = 241;
        var aMultY = 255;
        var aSidebarPos = new GameFramework.geom.TPoint(aMultX + -3, aMultY + -2);
        aSidebarPos.x += this.mPointMultSidebarOffset.x;
        aSidebarPos.y += this.mPointMultSidebarOffset.y;
        if(!front) {
            if((this.mPrevPointMultAlpha.get_v() != 0) && (this.mPointMultiplier > 2)) {
            }
            if(this.mPointMultPosPct.get_v() == 1 && (this.mPointMultiplier >= 1 || (this.mTimeExpired && this.mPointMultiplier > 0))) {
                Game.Resources['FONT_MULTIPLIER'].PushLayerColor('MAIN', GameFramework.gfx.Color.RGBAToInt(255, 255, 255, 230));
                Game.Resources['FONT_MULTIPLIER'].PushLayerColor('OUTLINE', GameFramework.gfx.Color.RGBAToInt(128, 0, 80, 230));
                Game.Resources['FONT_MULTIPLIER'].PushLayerColor('GLOW', GameFramework.gfx.Color.RGBAToInt(255, 0, 160, 128));
                g.SetFont(Game.Resources['FONT_MULTIPLIER']);
                var aString = 'x' + GameFramework.Utils.ToString(this.mPointMultiplier);
                var _t51 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.GetAlpha()));
                try {
                    g.DrawString(aString, aMultX - Game.Resources['FONT_MULTIPLIER'].StringWidth(aString) * 0.5 + Game.DM.UI_SLIDE_LEFT * this.mSlideUIPct.get_v() + this.mPointMultSidebarOffset.x, aMultY + 20 + this.mPointMultSidebarOffset.y);
                } finally {
                    _t51.Dispose();
                }
                Game.Resources['FONT_MULTIPLIER'].PopLayerColor('MAIN');
                Game.Resources['FONT_MULTIPLIER'].PopLayerColor('OUTLINE');
                Game.Resources['FONT_MULTIPLIER'].PopLayerColor('GLOW');
            }
            return;
        }
        if(this.mPointMultiplier > 1 && (this.mPointMultTextMorph.IsDoingCurve() || this.mPointMultAlpha.IsDoingCurve())) {
            var aString_2 = 'x' + GameFramework.Utils.ToString(this.mPointMultiplier);
            var aSrcPos = this.mSrcPointMultPos;
            var aCenterPos = new GameFramework.geom.TPoint(this.GetBoardCenterX(), 500);
            var aPoint = new GameFramework.geom.TPoint();
            if(this.mTimeExpired) {
                aPoint.x = Math.max(0.0, 1.0 - (this.mPointMultPosPct.get_v())) * aSrcPos.x + Math.max(0.0, (this.mPointMultPosPct.get_v())) * aSidebarPos.x;
                aPoint.y = Math.max(0.0, 1.0 - (this.mPointMultPosPct.get_v())) * aSrcPos.y + Math.max(0.0, (this.mPointMultPosPct.get_v())) * aSidebarPos.y;
            } else {
                aPoint.x = Math.max(0.0, 1.0 - (this.mPointMultPosPct.get_v() * 2.0)) * aSrcPos.x + (1.0 - Math.abs((this.mPointMultPosPct.get_v() - 0.5) * 2)) * aCenterPos.x + Math.max(0.0, 2 * (this.mPointMultPosPct.get_v() - 0.5)) * aSidebarPos.x;
                aPoint.y = Math.max(0.0, 1.0 - (this.mPointMultPosPct.get_v() * 2.0)) * aSrcPos.y + (1.0 - Math.abs((this.mPointMultPosPct.get_v() - 0.5) * 2)) * aCenterPos.y + Math.max(0.0, 2 * (this.mPointMultPosPct.get_v() - 0.5)) * aSidebarPos.y;
            }
            aPoint.y += this.mPointMultYAdd.get_v();
            var aScaleCenter = new GameFramework.geom.TPoint(aPoint.x, aPoint.y);
            if(!this.mTimeExpired) {
                var pct = (Math.abs((this.mPointMultPosPct.get_v() - 0.5) * 2.0));
                aScaleCenter.x = (1.0 - pct) * this.GetBoardCenterX() + pct * (aPoint.x);
                aScaleCenter.y = (1.0 - pct) * 480.0 + pct * (aPoint.y);
            }
            var didPushScale = true;
            if(this.mTimeExpired) {
                g.PushScale(0.292, 0.292, aScaleCenter.x, aScaleCenter.y);
            } else if(this.mPointMultScale.get_v() != 1.0) {
                g.PushScale(this.mPointMultScale.get_v(), this.mPointMultScale.get_v(), aScaleCenter.x, aScaleCenter.y);
            } else {
                didPushScale = false;
            }
            if(this.mPointMultiplier <= 9) {
                var aColor = GameFramework.Utils.LerpColor(this.mPointMultColor, 0xffffff, this.mPointMultAlpha.get_v());
                aColor = GameFramework.gfx.Color.UInt_AToInt(aColor, ((255 * this.GetPieceAlpha() * (1.0 - this.mSlideUIPct.get_v()) * this.mPointMultAlpha.get_v() * (1.0 - this.mPointMultTextMorph.get_v()) * 0.5) | 0));
                g.PushColor(aColor);
                g.DrawImageCel(Game.Resources['IMAGE_MULTIPLIER_LARGE_BACK'].get_CenteredImage(), aPoint.x, aPoint.y, ((Math.min(9, this.mPointMultiplier) - 1) | 0));
                g.PopColor();
                aColor = GameFramework.gfx.Color.UInt_AToInt(aColor, ((255 * this.GetPieceAlpha() * (1.0 - this.mSlideUIPct.get_v()) * (1.0 - this.mPointMultTextMorph.get_v())) | 0));
                g.PushColor(aColor);
                g.DrawImageCel(Game.Resources['IMAGE_MULTIPLIER_LARGE_FRONT'].get_CenteredImage(), aPoint.x, aPoint.y, ((Math.min(9, this.mPointMultiplier) - 1) | 0));
                g.PopColor();
            }
            if(didPushScale) {
                g.PopMatrix();
            }
        }
    },
    DrawOverlay : function Game_Board$DrawOverlay(g) {
        this.DrawPointMultiplier(g, false);
        if(this.WantDrawTimer()) {
            this.DrawTimer(g);
        }
        if((!Game.BejApp.mBejApp.mIsSlow) && (GameFramework.BaseApp.mApp.get_Is3D())) {
            if(this.mSpeedFireBarPIEffect[0] != null) {
                this.mSpeedFireBarPIEffect[0].Draw(g);
            }
            if(this.mSpeedFireBarPIEffect[1] != null) {
                this.mSpeedFireBarPIEffect[1].Draw(g);
            }
        }
        if(this.mBoardDarken > 0) {
            var aRect = new GameFramework.TRect(0, 0, Game.BejApp.mBejApp.mWidth, Game.BejApp.mBejApp.mHeight);
            g.PushColor(GameFramework.gfx.Color.RGBAToInt(0, 0, 0, ((this.GetBoardAlpha() * this.mBoardDarken * 128.0) | 0)));
            g.FillRect(this.mWidescreenX - 50, -50, 1920 + 100, 1200 + 100);
            g.PopColor();
            this.DrawPieces(g, true);
        }
        this.DrawLightning(g);
        if(this.WantsHideOnPause()) {
            if(this.mVisPausePct > 0) {
                var aString = 'PAUSED';
                g.SetFont(Game.Resources['FONT_HUGE']);
                g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mVisPausePct));
                g.DrawString(aString, this.GetBoardCenterX() - g.GetFont().StringWidth(aString) / 2, 540);
                g.PopColor();
            }
        }
        this.mPointsManager.DrawOverlay(g);
        this.DrawCountPopups(g);
        this.DrawComplements(g);
        this.DrawPointMultiplier(g, true);
        var tutorialIrisPiece = this.GetTutorialIrisPiece();
        if(tutorialIrisPiece != null) {
        }
        if(this.mAnnouncements.length > 0) {
            this.mAnnouncements[0].Draw(g);
        }
        if(Game.BejApp.mBejApp.mDebugKeysEnabled) {
            g.SetFont(Game.Resources['FONT_DEFAULT']);
            g.DrawStringEx(GameFramework.Utils.ToString(GameFramework.BaseApp.mApp.mCurFPS), 1585, 1185, 0, 1);
        }
        if(this.WantBaseDrawSpeedBonusText()) {
            this.DrawSpeedBonusDynImage(g);
        }
        this.mTutorialMgr.Draw(g);
        if(this.mTutorialMgr.IsBusy() && this.mScale.get_v() == 1.0) {
            var _t52 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(0.5));
            try {
                var _t53 = g.PushTranslate(this.mMenuButton.mX + ((this.mSideXOff.get_v() * 4.0) | 0), this.mMenuButton.mY);
                try {
                    this.mMenuButton.Draw(g);
                } finally {
                    _t53.Dispose();
                }
            } finally {
                _t52.Dispose();
            }
        }
        if(this.mTutorialMgr.WantDrawFxOnTop()) {
            this.mPostFXManager.Draw(g);
        }
    },
    WantBaseDrawSpeedBonusText : function Game_Board$WantBaseDrawSpeedBonusText() {
        return true;
    },
    DbgDrawMarkers : function Game_Board$DbgDrawMarkers(g) {
    },
    Draw : function Game_Board$Draw(g) {
        if((this.mSlideUIPct.get_v() >= 1) && (this.mGameOverCount > 0)) {
            return;
        }
        var tx = 0.0;
        if(this.mSideXOff.get_v() != 0) {
            tx = this.mSideXOff.get_v();
        } else {
            tx = Game.DM.UI_SLIDE_RIGHT * this.mSlideUIPct.get_v();
        }
        var _t54 = g.PushTranslate(this.mSideXOff.get_v(), 0.0);
        try {
            var anAng = this.mSpeedBonusFlameModePct * 60;
            var aC1Normal = GameFramework.gfx.Color.UInt_AToInt(this.mBoardColors[0], ((((0xff000000 & this.mBoardColors[0]) >>> 24) * this.GetBoardAlpha()) | 0));
            var aC1Blaze = GameFramework.gfx.Color.RGBAToInt(180, 100 + ((Math.sin(anAng) * 14) | 0), 48 + ((Math.sin(anAng) * 8) | 0), ((200 * this.GetBoardAlpha()) | 0));
            var aC1 = GameFramework.Utils.LerpColor(aC1Normal, aC1Blaze, Math.min(1.0, this.mSpeedBonusFlameModePct * 5.0));
            var aC2Normal = GameFramework.gfx.Color.UInt_AToInt(this.mBoardColors[1], ((((0xff000000 & this.mBoardColors[1]) >>> 24) * this.GetBoardAlpha()) | 0));
            var aC2Blaze = GameFramework.gfx.Color.RGBAToInt(160, 90 + ((Math.sin(anAng) * 12) | 0), 40 + ((Math.sin(anAng) * 7) | 0), ((200 * this.GetBoardAlpha()) | 0));
            var aC2 = GameFramework.Utils.LerpColor(aC2Normal, aC2Blaze, Math.min(1.0, this.mSpeedBonusFlameModePct * 5.0));
            var aColXs = Array.Create(this.mColCount + 1, 0);
            for(var aCol = 0; aCol < this.mColCount + 1; aCol++) {
                aColXs[aCol] = this.GetColScreenX(aCol);
            }
            if(this.mBoardUIOffsetY != 0) {
                g.PushTranslate(0, this.mBoardUIOffsetY);
            }
            this.DrawGrid(g);
            if(this.mWarningGlowAlpha > 0.0) {
                var bw = this.mColCount * Game.Board.GEM_WIDTH;
                var bh = this.mRowCount * Game.Board.GEM_HEIGHT;
                var bx = this.GetBoardX();
                var by = this.GetBoardY();
                var scale = 0.5 + 2.5 * Math.pow(this.mWarningGlowAlpha, 0.5);
                var h = ((Game.Resources['IMAGE_DANGERBORDERUP'].mHeight * scale) | 0);
                var w = ((Game.Resources['IMAGE_DANGERBORDERLEFT'].mWidth * scale) | 0);
                var _t55 = g.PushColor(GameFramework.gfx.Color.UInt_FAToInt(this.mWarningGlowColor, this.mWarningGlowAlpha));
                try {
                    g.DrawImage(Game.Resources['IMAGE_DANGERBORDERUP'], bx, by);
                    g.DrawImage(Game.Resources['IMAGE_DANGERBORDERLEFT'], bx, by);
                    var t = new GameFramework.geom.Matrix();
                    t.scale(bw, 0 - scale);
                    var _t56 = g.PushMatrix(t);
                    try {
                        g.DrawImage(Game.Resources['IMAGE_DANGERBORDERUP'], bx + ((bw / 2) | 0), bh + ((Game.Resources['IMAGE_DANGERBORDERUP'].mHeight / 2) | 0));
                    } finally {
                        _t56.Dispose();
                    }
                } finally {
                    _t55.Dispose();
                }
            }
            if(this.mBoardUIOffsetY != 0) {
                g.PopMatrix();
            }
            if(this.mScale.get_v() >= 0.8) {
                this.DrawSideUI(g);
            }
            {
                this.DrawGameElements(g);
            }
        } finally {
            _t54.Dispose();
        }
    },
    DrawGrid : function Game_Board$DrawGrid(g) {
        var aColXs = Array.Create(this.mColCount + 1, 0);
        for(var aCol = 0; aCol < this.mColCount + 1; aCol++) {
            aColXs[aCol] = this.GetColScreenX(aCol);
        }
        var anAng = this.mSpeedBonusFlameModePct * 60;
        var aC1Normal = GameFramework.gfx.Color.UInt_AToInt(this.mBoardColors[0], ((((0xff000000 & this.mBoardColors[0]) >>> 24) * this.GetBoardAlpha()) | 0));
        var aC1Blaze = GameFramework.gfx.Color.RGBAToInt(180, 100 + ((Math.sin(anAng) * 14) | 0), 48 + ((Math.sin(anAng) * 8) | 0), ((200 * this.GetBoardAlpha()) | 0));
        var aC1 = GameFramework.Utils.LerpColor(aC1Normal, aC1Blaze, Math.min(1.0, this.mSpeedBonusFlameModePct * 5.0));
        var aC2Normal = GameFramework.gfx.Color.UInt_AToInt(this.mBoardColors[1], ((((0xff000000 & this.mBoardColors[1]) >>> 24) * this.GetBoardAlpha()) | 0));
        var aC2Blaze = GameFramework.gfx.Color.RGBAToInt(160, 90 + ((Math.sin(anAng) * 12) | 0), 40 + ((Math.sin(anAng) * 7) | 0), ((200 * this.GetBoardAlpha()) | 0));
        var aC2 = GameFramework.Utils.LerpColor(aC2Normal, aC2Blaze, Math.min(1.0, this.mSpeedBonusFlameModePct * 5.0));
        for(var aRow = 0; aRow < this.mRowCount; aRow++) {
            var aStartY = this.GetRowScreenY(aRow);
            var anEndY = this.GetRowScreenY(aRow + 1);
            for(var aCol_2 = 0; aCol_2 < this.mColCount; aCol_2++) {
                var aStartX = aColXs[aCol_2];
                var anEndX = aColXs[aCol_2 + 1];
                if((aRow + aCol_2) % 2 == 0) {
                    g.PushColor(aC1);
                } else {
                    g.PushColor(aC2);
                }
                g.FillRect(aStartX, aStartY, anEndX - aStartX, anEndY - aStartY);
                g.PopColor();
            }
        }
    },
    GetBoardMatrix : function Game_Board$GetBoardMatrix() {
        return new GameFramework.geom.Matrix();
    },
    DrawSideUI : function Game_Board$DrawSideUI(g) {
        if(this.mSideAlpha.get_v() != 1) {
            g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mSideAlpha.get_v()));
        }
        if(this.mSideXOff.get_v() != 0) {
            g.PushTranslate(((this.mSideXOff.get_v() * 4.0) | 0), 0.0);
        }
        this.DrawTopWidget(g);
        if(this.WantDrawScore()) {
            this.DrawScore(g);
        }
        this.DrawBottomWidget(g);
        if(this.mSideXOff.get_v() != 0) {
            g.PopMatrix();
        }
        if(this.mSideAlpha.get_v() != 1) {
            g.PopColor();
        }
    },
    DrawBottomWidget : function Game_Board$DrawBottomWidget(g) {
        var _t57 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetBoardAlpha()) | 0)));
        try {
            switch(this.mUiConfig) {
                case Game.Board.EUIConfig.Standard:
                {
                    g.DrawImage(Game.Resources['IMAGE_BOARD_BOTTOM_WIDGET_CLASSIC'].get_OffsetImage(), this.mWidescreenX, this.GetBottomWidgetOffset());
                    break;
                }
                case Game.Board.EUIConfig.WithReset:
                {
                    g.DrawImage(Game.Resources['IMAGE_BOARD_BOTTOM_WIDGET_LIGHTNING'].get_OffsetImage(), this.mWidescreenX, this.GetBottomWidgetOffset());
                    break;
                }
            }
        } finally {
            _t57.Dispose();
        }
    },
    DrawTimer : function Game_Board$DrawTimer(g) {
        var aTimeLimit = this.GetTimeLimit();
        if(aTimeLimit == 0) {
            return;
        }
        var aTimeLeft = this.GetTicksLeft();
        var aBarRect = this.GetCountdownBarRect();
        var aSrcPoint = new GameFramework.geom.TPoint(this.GetBoardCenterX(), 500);
        var aDestPoint = new GameFramework.geom.TPoint(this.GetTimeDrawX(), aBarRect.mY + aBarRect.mHeight / 2);
        var aPoint = aDestPoint;
        var aScale = 0.22 + this.mTimerInflate.get_v() * 1.0;
        var aString = GameFramework.Utils.ToString((((((aTimeLeft + 59) / 60) | 0)) | 0) % 60);
        if(aString.length == 1) {
            aString = '0' + aString;
        }
        aString = GameFramework.Utils.ToString((((((((aTimeLeft + 59) / 60) | 0) / 60) | 0)) | 0)) + ':' + aString;
        if(this.IsTurnBased()) {
            aString = GameFramework.Utils.ToString(((aTimeLeft / 60) | 0));
        }
        if(this.mTimerInflate.get_v() > 0) {
            g.SetFont(Game.Resources['FONT_TIMER_LARGE']);
            var _t58 = g.PushScale(aScale, aScale, aPoint.x, aPoint.y);
            try {
                var _t59 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetAlpha() * this.mTimerAlpha.get_v() * (1.0 - this.mVisPausePct * this.mTimerInflate.get_v())) | 0)));
                try {
                    g.DrawStringEx(aString, aPoint.x, aPoint.y + 30, -1, 0);
                } finally {
                    _t59.Dispose();
                }

            } finally {
                _t58.Dispose();
            }
        } else if(this.mTimerInflate.get_v() == 0) {
            g.SetFont(Game.Resources['FONT_TIMER_SMALL']);
            Game.Resources['FONT_TIMER_SMALL'].PushLayerColor('GLOW', GameFramework.gfx.Color.BLACK_RGB);
            var _t60 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetAlpha() * this.mTimerAlpha.get_v()) | 0)));
            try {
                g.DrawStringEx(aString, aPoint.x, aPoint.y + 14, -1, 0);
            } finally {
                _t60.Dispose();
            }
            Game.Resources['FONT_TIMER_SMALL'].PopLayerColor('GLOW');
        }
    },
    DrawButtons : function Game_Board$DrawButtons(g) {
        if(this.mScale.get_v() < 0.8) {
            return;
        }
        g.PushTranslate(this.mHintButton.mX + ((this.mSideXOff.get_v() * 4.0) | 0), this.mHintButton.mY);
        this.mHintButton.Draw(g);
        g.PopMatrix();
        g.PushTranslate(this.mMenuButton.mX + ((this.mSideXOff.get_v() * 4.0) | 0), this.mMenuButton.mY);
        this.mMenuButton.Draw(g);
        g.PopMatrix();
        if(this.mResetButton != null) {
            g.PushTranslate(this.mResetButton.mX + ((this.mSideXOff.get_v() * 4.0) | 0), this.mResetButton.mY);
            this.mResetButton.Draw(g);
            g.PopMatrix();
        }
        if(this.mZenOptionsButton != null) {
            g.PushTranslate(this.mZenOptionsButton.mX + ((this.mSideXOff.get_v() * 4.0) | 0), this.mZenOptionsButton.mY);
            this.mZenOptionsButton.Draw(g);
            g.PopMatrix();
        }
    },
    DrawSpeedBonusDynImage : function Game_Board$DrawSpeedBonusDynImage(g) {
        if((!this.AllowSpeedBonus()) || (this.mSpeedBonusDisp.GetOutVal() == 0.0)) {
            return;
        }
        var _t61 = g.PushScale(this.mSpeedBonusPointsScale.GetOutVal(), this.mSpeedBonusPointsScale.GetOutVal(), 244, 100);
        try {
            var _t62 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetAlpha() * this.mSideAlpha.get_v()) | 0)));
            try {
                Game.Resources['FONT_SPEED_SCORE'].PushLayerColor('OUTLINE', GameFramework.gfx.Color.BLACK_RGB);
                Game.Resources['FONT_SPEED_SCORE'].PushLayerColor('GLOW', GameFramework.gfx.Color.FAlphaToInt(this.mSpeedBonusPointsGlow.GetOutVal()));
                Game.Resources['FONT_SPEED_TEXT'].PushLayerColor('OUTLINE', GameFramework.gfx.Color.BLACK_RGB);
                g.SetFont(Game.Resources['FONT_SPEED_TEXT']);
                g.DrawStringCentered(String.format('{0} MATCH CHAIN', (this.mSpeedBonusCount == 0) ? this.mSpeedBonusLastCount : this.mSpeedBonusCount), 244, 120);
                if(this.mSpeedBonusTextShowPct.get_v() > 0.0 || this.mSpeedBonusCount > 0) {
                    g.SetFont(Game.Resources['FONT_SPEED_SCORE']);
                    var fullString = String.format('SPEED +{0}', ((Math.min(200.0, ((this.mSpeedBonusCount == 0 ? this.mSpeedBonusLastCount : this.mSpeedBonusCount) + 1.0) * 20.0) * this.GetModePointMultiplier()) | 0));
                    var fullStringW = g.GetFont().StringWidth(fullString);
                    if(this.mSpeedBonusTextShowPct.get_v() > 0.0) {
                        var _t63 = g.PushScale(this.mSpeedBonusTextShowPct.get_v(), this.mSpeedBonusTextShowPct.get_v(), 244.0, 96.0 - g.GetFont().GetHeight() / 2);
                        try {
                            g.DrawString(fullString, 244 - fullStringW / 2, 66);
                        } finally {
                            _t63.Dispose();
                        }
                    }
                    if(this.mSpeedBonusCount > 0) {
                        var pctString = '';
                        var tgtPct = Math.max(0.0, this.mSpeedBonusNum * 1.25 - 0.25);
                        var tgtStringW = fullStringW * tgtPct;
                        var testStringW = 0.0;
                        var stringLen = 0;
                        for(stringLen = 1; stringLen <= fullString.length; ++stringLen) {
                            var testString = fullString.substr(0, stringLen);
                            testStringW = g.GetFont().StringWidth(testString);
                            pctString = testString;
                            if(testStringW > tgtStringW) {
                                break;
                            }
                        }
                        var pctStringFullW = g.GetFont().StringWidth(pctString);
                        var pctStringLastLetter = '';
                        if(pctString.length > 0) {
                            pctStringLastLetter = pctString.substr(pctString.length - 1);
                            pctString = pctString.substr(0, pctString.length - 1);
                        }
                        var pctStringW = g.GetFont().StringWidth(pctString);
                        var deltaW = pctStringFullW - pctStringW;
                        var overflowPct = 1.0;
                        if(deltaW > 0.0) {
                            overflowPct = (tgtStringW - pctStringW) / deltaW;
                        }
                        if(this.mSpeedBonusNum > 0.0) {
                            if((!GameFramework.BaseApp.mApp.get_Is3D()) && (Game.Resources['FONT_SPEED_SCORE_ORANGE'] != null)) {
                                g.SetFont(Game.Resources['FONT_SPEED_SCORE_ORANGE']);
                                if(pctString.length > 0) {
                                    var _t64 = g.PushColor(0xffffffff);
                                    try {
                                        g.DrawString(pctString, 244 - fullStringW / 2, 66);
                                    } finally {
                                        _t64.Dispose();
                                    }
                                }
                                if(pctStringLastLetter.length > 0) {
                                    var _t65 = g.PushColor(GameFramework.gfx.Color.UInt_FAToInt(0xffffff, overflowPct));
                                    try {
                                        g.DrawString(pctStringLastLetter, 244 - fullStringW / 2 + g.GetFont().StringWidth(pctString + '0') - g.GetFont().StringWidth('0'), 66);
                                    } finally {
                                        _t65.Dispose();
                                    }
                                }
                            } else {
                                if(pctString.length > 0) {
                                    var _t66 = g.PushColor(0xffe09040);
                                    try {
                                        g.SetFont(Game.Resources['FONT_SPEED_SCORE']);
                                        g.DrawString(pctString, 244 - fullStringW / 2, 66);
                                    } finally {
                                        _t66.Dispose();
                                    }
                                }
                                if(pctStringLastLetter.length > 0) {
                                    var _t67 = g.PushColor(GameFramework.gfx.Color.UInt_FAToInt(0xe09040, overflowPct));
                                    try {
                                        g.DrawString(pctStringLastLetter, 244 - fullStringW / 2 + g.GetFont().StringWidth(pctString + '0') - g.GetFont().StringWidth('0'), 66);
                                    } finally {
                                        _t67.Dispose();
                                    }
                                }
                            }
                        }
                    }
                }
                Game.Resources['FONT_SPEED_SCORE'].PopLayerColor('OUTLINE');
                Game.Resources['FONT_SPEED_SCORE'].PopLayerColor('GLOW');
                Game.Resources['FONT_SPEED_TEXT'].PopLayerColor('OUTLINE');
            } finally {
                _t62.Dispose();
            }
        } finally {
            _t61.Dispose();
        }
    },
    DrawGameElements : function Game_Board$DrawGameElements(g) {
        if(this.WantDrawButtons()) {
            var _t68 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetAlpha() * this.mSideAlpha.get_v()) | 0)));
            try {
                this.DrawButtons(g);
            } finally {
                _t68.Dispose();
            }
        }
        var _t69 = g.PushTranslate(Game.DM.UI_SLIDE_RIGHT * this.mSlideUIPct.get_v(), 0);
        try {
            this.DrawFrame(g);
            if(this.mDrawGameElements) {
                this.DrawPieces(g, false);

                {
                    var $srcArray70 = this.mBoard;
                    for(var $enum70 = 0; $enum70 < $srcArray70.length; $enum70++) {
                        var aPiece = $srcArray70[$enum70];
                        if((aPiece != null) && (aPiece.mHintAlpha.get_v() != 0)) {
                            var _t71 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((this.GetPieceAlpha() * aPiece.mHintAlpha.get_v() * 255.0) | 0)));
                            try {
                                var aTrans = new GameFramework.geom.Matrix();
                                aTrans.translate(0, aPiece.mHintArrowPos.get_v());
                                var aOfs = Array.Create(4, null, new GameFramework.geom.TPoint(1, 0), new GameFramework.geom.TPoint(0, 0), new GameFramework.geom.TPoint(0, 0), new GameFramework.geom.TPoint(0, 1));
                                for(var i = 0; i < 4; i++) {
                                    var aMat = aTrans.clone();
                                    aMat.translate(aPiece.CX() + aOfs[i].x, aPiece.CY() + aOfs[i].y);
                                    g.PushMatrix(aMat);
                                    g.DrawImage(Game.Resources['IMAGE_HINTARROW'].get_CenteredImage(), 0, 0);
                                    g.PopMatrix();
                                    aTrans.rotate(Game.MathUtil.PI_D2);
                                }
                            } finally {
                                _t71.Dispose();
                            }
                        }
                    }
                }
            }
        } finally {
            _t69.Dispose();
        }
    },
    DrawPieces : function Game_Board$DrawPieces(g, thePostFX) {
        var gemMask = 0;
        if(!thePostFX) {

            {
                var $srcArray72 = this.mBoard;
                for(var $enum72 = 0; $enum72 < $srcArray72.length; $enum72++) {
                    var aPiece = $srcArray72[$enum72];
                    if((aPiece != null) && !aPiece.IsFlagSet(Game.Piece.EFlag.FLAME) && !aPiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS) && !this.CanBakeShadow(aPiece)) {
                        this.DrawPieceShadow(g, aPiece);
                    }
                }
            }
            this.mPreFXManager.Draw(g);
            gemMask = 0xffffffff;
        } else {
            for(var anIdx = 0; anIdx < this.mLightningStorms.length; anIdx++) {
                if(this.mLightningStorms[anIdx].mStormType == Game.LightningStorm.EStormType.HYPERCUBE) {
                    gemMask |= ((1 << ((this.mLightningStorms[anIdx].mColor | 0) + 1)) | 0);
                }
            }
        }

        {
            var $srcArray73 = this.mBoard;
            for(var $enum73 = 0; $enum73 < $srcArray73.length; $enum73++) {
                var aPiece_2 = $srcArray73[$enum73];
                if((aPiece_2 != null) && !this.IsPieceSwapping(aPiece_2) && aPiece_2 != this.mGameOverPiece && (!thePostFX || aPiece_2.mElectrocutePercent > 0 || (gemMask & ((1 << ((aPiece_2.mColor | 0) + 1)) | 0)) != 0) && (!thePostFX || (!aPiece_2.IsFlagSet(Game.Piece.EFlag.SCRAMBLE) && !aPiece_2.IsFlagSet(Game.Piece.EFlag.DETONATOR)))) {
                    this.DrawPiece(g, aPiece_2, 1.0);
                }
            }
        }

        {
            var $srcArray74 = this.mBoard;
            for(var $enum74 = 0; $enum74 < $srcArray74.length; $enum74++) {
                var aPiece_3 = $srcArray74[$enum74];
                if((aPiece_3 != null) && !this.IsPieceSwapping(aPiece_3) && aPiece_3 != this.mGameOverPiece && (!thePostFX || aPiece_3.mElectrocutePercent > 0 || (gemMask & ((1 << ((aPiece_3.mColor | 0) + 1)) | 0)) != 0) && (!thePostFX || (!aPiece_3.IsFlagSet(Game.Piece.EFlag.SCRAMBLE) && !aPiece_3.IsFlagSet(Game.Piece.EFlag.DETONATOR)))) {
                    this.DrawGemLighting(g, aPiece_3);
                }
            }
        }
        for(var i = 0; i < (this.mSwapDataVector.length | 0); i++) {
            var aSwapData = this.mSwapDataVector[i];
            var aScale = aSwapData.mGemScale.get_v();
            if(!aSwapData.mDestroyTarget && (aSwapData.mPiece2 != null) && aSwapData.mSwapPct.get_v() <= Game.MathUtil.PI) {
                this.DrawPiece(g, aSwapData.mPiece2, 1.0 - aScale);
            }
            this.DrawPiece(g, aSwapData.mPiece1, 1.0 + aScale);
            if(!aSwapData.mDestroyTarget && (aSwapData.mPiece2 != null) && aSwapData.mSwapPct.get_v() > Game.MathUtil.PI) {
                this.DrawPiece(g, aSwapData.mPiece2, 1.0 - aScale);
            }
        }
        if((this.mCursorSelectPos.x != -1) && (this.GetSelectedPiece() == null)) {
            g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetPieceAlpha()) | 0)));
            g.DrawImage(Game.Resources['IMAGE_SELECTOR'], this.GetBoardX() + this.GetColX(this.mCursorSelectPos.x), this.GetBoardY() + this.GetRowY(this.mCursorSelectPos.y));
            g.PopColor();
        }
    },
    DrawIris : function Game_Board$DrawIris(g, theCX, theCY, theAlpha, theScale) {
        theAlpha *= this.GetBoardAlpha();
        {
            Game.Resources['IMAGE_TRANSPARENT_HOLE'].mPixelSnapping = GameFramework.resources.PixelSnapping.Always;
            Game.Resources['IMAGE_TRANSPARENT_HOLE'].mSizeSnapping = true;
            var aWidth = ((Game.Resources['IMAGE_TRANSPARENT_HOLE'].mWidth / theScale * 6) | 0);
            var aHeight = ((Game.Resources['IMAGE_TRANSPARENT_HOLE'].mHeight / theScale * 6) | 0);
            var aDestRect = new GameFramework.TRect(theCX - ((aWidth / 2) | 0), theCY - ((aHeight / 2) | 0), aWidth, aHeight);
            g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * theAlpha) | 0)));
            g.PopColor();
            g.PushColor(GameFramework.gfx.Color.RGBAToInt(0, 0, 0, ((255.0 * theAlpha) | 0)));
            g.FillRect(0, 0, this.mWidth, aDestRect.mY);
            g.FillRect(0, aDestRect.mY, aDestRect.mX, aDestRect.mHeight);
            g.FillRect(aDestRect.mX + aDestRect.mWidth, aDestRect.mY, this.mWidth - (aDestRect.mX + aDestRect.mWidth), aDestRect.mHeight);
            g.FillRect(0, aDestRect.mY + aDestRect.mHeight, this.mWidth, this.mHeight - (aDestRect.mY + aDestRect.mHeight));
            g.PopColor();
        }
    },
    GetLeftUIOffsetX : function Game_Board$GetLeftUIOffsetX() {
        return 0;
    },
    DrawTopWidget : function Game_Board$DrawTopWidget(g) {
        var aLabelIdx = this.WantExpandedTopWidget();
        this.DrawSpeedBonus(g);
        var _t75 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetAlpha()) | 0)));
        try {
            var img = Game.Resources['IMAGE_BOARD_TOP_WIDGET'];
            g.DrawImageCel(img, this.GetLeftUIOffsetX() + img.mOffsetX - 160, img.mOffsetY, 0);
            g.SetFont(Game.Resources['FONT_LEVEL']);
            g.DrawStringEx(GameFramework.Utils.CommaSeperate(this.mLevel + 1), this.GetLeftUIOffsetX() + 243, 250, 0, 0);
        } finally {
            _t75.Dispose();
        }
    },
    DrawAll : function Game_Board$DrawAll(g) {
        if(this.mAlpha.get_v() == 0) {
            return;
        }
        var hasScale = this.mScale.get_v() != 1.0;
        this.DeferOverlay();
        if(hasScale) {
            g.PushScale(this.mScale.get_v(), this.mScale.get_v(), ((1600 / 2) | 0), ((1200 / 2) | 0));
        }
        if(this.mDrawAll) {
            g.mMatrix.tx += this.mOfsX;
            g.mMatrix.ty += this.mOfsY;
            GameFramework.widgets.ClassicWidget.prototype.DrawAll.apply(this, [g]);
            g.mMatrix.tx -= this.mOfsX;
            g.mMatrix.ty -= this.mOfsY;
        }
        if(hasScale) {
            g.PopMatrix();
        }
    },
    IsGridLockedAt : function Game_Board$IsGridLockedAt(theCol, theRow) {
        return this.mTutorialMgr.WantsBlockUi() && this.mTutorialMgr.IsGridLockedAt(theCol, theRow);
    },
    MouseDown : function Game_Board$MouseDown(x, y) {
        GameFramework.widgets.ClassicWidget.prototype.MouseDown.apply(this, [x, y]);
        if(!this.mIsOver) {
            return;
        }
        if((this.mAlpha.get_v() != 1.0) || (this.mScale.get_v() != 1.0)) {
            return;
        }
        if((this.mUserPaused) || (this.mVisPausePct > 0.5)) {
            this.mUserPaused = false;
            return;
        }
        if(!this.CanPlay()) {
            return;
        }
        this.mCursorSelectPos = new GameFramework.geom.TIntPoint(-1, -1);
        this.mMouseDown = true;
        this.mMouseDownX = (x | 0);
        this.mMouseDownY = (y | 0);
        var theBtnNum = 0;
        var aCol = this.GetColAt((x | 0) - this.GetBoardX());
        var aRow = this.GetRowAt((y | 0) - this.GetBoardY());
        GameFramework.Utils.Trace(String.format('{0},{1}', aCol, aRow));
        if(this.IsGridLockedAt(aCol, aRow)) {
            return;
        }
        var aSelectedPiece = this.GetSelectedPiece();
        if(theBtnNum != 0) {
            if(aSelectedPiece != null) {
                aSelectedPiece.mSelected = false;
                aSelectedPiece.mSelectorAlpha.SetConstant(0.0);
            }
            return;
        }
        var aClickPiece = this.GetPieceAtScreenXY((x | 0), (y | 0));
        if(aSelectedPiece == aClickPiece) {
            return;
        }
        var failed = false;
        if(aClickPiece == null) {
            aClickPiece = this.GetPieceAtRowCol(aRow, aCol);
            if(aClickPiece != null) {
                failed = true;
            }
        } else {
            aCol = aClickPiece.mCol;
            aRow = aClickPiece.mRow;
        }
        if(aClickPiece != null && !aClickPiece.mCanSwap) {
            failed = true;
        }
        if((!failed) && (aClickPiece != aSelectedPiece)) {
            if(aSelectedPiece != null) {
                if((this.mLightningStorms.length == 0) && (!this.QueueSwap(aSelectedPiece, aRow, aCol, false, true, false, false))) {
                    aSelectedPiece.mSelected = false;
                    aSelectedPiece.mSelectorAlpha.SetConstant(0.0);
                    if(Game.BejApp.mBejApp.mProfile.mStats[(Game.DM.EStat.NUM_GOOD_MOVES | 0)] < 3) {
                        Game.SoundUtil.Play(Game.Resources['SOUND_BADMOVE']);
                    } else if(aClickPiece != null) {
                        aClickPiece.mSelected = true;
                        aClickPiece.mSelectorAlpha.SetConstant(1.0);
                    }
                }
            } else {
                if(aClickPiece != null) {
                    if(aClickPiece.IsButton()) {
                        this.QueueSwap(aClickPiece, aClickPiece.mRow, aClickPiece.mCol, false, true, false, false);
                    } else {
                        aClickPiece.mSelected = true;
                        aClickPiece.mSelectorAlpha.SetConstant(1.0);
                        Game.SoundUtil.Play(Game.Resources['SOUND_SELECT']);
                    }
                }
            }
        } else {
            if(aSelectedPiece != null) {
                aSelectedPiece.mSelected = false;
                aSelectedPiece.mSelectorAlpha.SetConstant(0.0);
            }
            return;
        }
    },
    MouseUp : function Game_Board$MouseUp(x, y) {
        GameFramework.widgets.ClassicWidget.prototype.MouseUp.apply(this, [x, y]);
        this.mMouseDown = false;
        var aSelectedPiece = this.GetSelectedPiece();
        if(aSelectedPiece != null && aSelectedPiece == this.mMouseUpPiece && !this.IsPieceSwapping(aSelectedPiece)) {
            aSelectedPiece.mSelected = false;
            aSelectedPiece.mSelectorAlpha.SetConstant(0.0);
            this.mMouseUpPiece = null;
        } else {
            this.mMouseUpPiece = aSelectedPiece;
        }
    },
    MouseMove : function Game_Board$MouseMove(x, y) {
        this.mLastMouseX = x;
        this.mLastMouseY = y;
        GameFramework.widgets.ClassicWidget.prototype.MouseMove.apply(this, [x, y]);
        if((this.mIsDown) || (this.mAppState.IsKeyDown(GameFramework.KeyCode.Control))) {
            this.MouseDrag((x | 0), (y | 0));
        }
    },
    MouseDrag : function Game_Board$MouseDrag(x, y) {
        if(!this.CanPlay()) {
            return;
        }
        var aSelectedPiece = this.GetSelectedPiece();
        if(aSelectedPiece == null) {
            return;
        }
        var aXDif = x - this.mMouseDownX;
        var aYDif = y - this.mMouseDownY;
        if((Math.abs(aXDif) >= 40) || (Math.abs(aYDif) >= 40)) {
            var aSwapPoint = new GameFramework.geom.TIntPoint(-1, -1);
            if(Math.abs(aXDif) > Math.abs(aYDif)) {
                if(aXDif > 0 && aSelectedPiece.mCol < this.mColCount - 1) {
                    aSwapPoint = new GameFramework.geom.TIntPoint(aSelectedPiece.mCol + 1, aSelectedPiece.mRow);
                } else if(aXDif < 0 && aSelectedPiece.mCol > 0) {
                    aSwapPoint = new GameFramework.geom.TIntPoint(aSelectedPiece.mCol - 1, aSelectedPiece.mRow);
                }
            } else {
                if(aYDif > 0 && aSelectedPiece.mRow < this.mRowCount - 1) {
                    aSwapPoint = new GameFramework.geom.TIntPoint(aSelectedPiece.mCol, aSelectedPiece.mRow + 1);
                } else if(aYDif < 0 && aSelectedPiece.mRow > 0) {
                    aSwapPoint = new GameFramework.geom.TIntPoint(aSelectedPiece.mCol, aSelectedPiece.mRow - 1);
                }
            }
            if(aSwapPoint != new GameFramework.geom.TIntPoint(-1, -1)) {
                if(this.IsGridLockedAt(aSwapPoint.x, aSwapPoint.y)) {
                    return;
                }
                this.QueueSwap(aSelectedPiece, aSwapPoint.y, aSwapPoint.x, false, true, false, true);
            }
        }
    },
    KeyUp : function Game_Board$KeyUp(theKeyCode) {
        GameFramework.widgets.ClassicWidget.prototype.KeyUp.apply(this, [theKeyCode]);
        if(theKeyCode == GameFramework.KeyCode.Control) {
            var aSelectedPiece = this.GetSelectedPiece();
            if(aSelectedPiece != null) {
                aSelectedPiece.mSelected = false;
                aSelectedPiece.mSelectorAlpha.SetConstant(0.0);
                this.mMouseUpPiece = null;
            }
        }
    },
    KeyDown : function Game_Board$KeyDown(theKeyCode) {
        if(!this.CanPlay() || this.mTutorialMgr.IsBusy()) {
            return;
        }
        var aDir = new GameFramework.geom.TIntPoint();
        var selectPiece = false;
        var moveCursor = false;
        switch(theKeyCode) {
            case GameFramework.KeyCode.Control:
            {
                this.MouseDown(this.mLastMouseX, this.mLastMouseY);
                this.mMouseDown = false;
                this.mIsDown = false;
                break;
            }
            case GameFramework.KeyCode.Escape:
            {
                break;
            }
            case GameFramework.KeyCode.Left:
            {
                moveCursor = true;
                aDir = new GameFramework.geom.TIntPoint(-1, 0);
                break;
            }
            case GameFramework.KeyCode.Right:
            {
                moveCursor = true;
                aDir = new GameFramework.geom.TIntPoint(1, 0);
                break;
            }
            case GameFramework.KeyCode.Up:
            {
                moveCursor = true;
                aDir = new GameFramework.geom.TIntPoint(0, -1);
                break;
            }
            case GameFramework.KeyCode.Down:
            {
                moveCursor = true;
                aDir = new GameFramework.geom.TIntPoint(0, 1);
                break;
            }
            case 32:
            {
                var aPiece = this.GetSelectedPiece();
                if(aPiece != null) {
                    aPiece.mSelected = false;
                    aPiece.mSelectorAlpha.SetConstant(0.0);
                } else {
                    selectPiece = true;
                }
                break;
            }
            case 65:
            {
                selectPiece = true;
                aDir = new GameFramework.geom.TIntPoint(-1, 0);
                break;
            }
            case 68:
            {
                selectPiece = true;
                aDir = new GameFramework.geom.TIntPoint(1, 0);
                break;
            }
            case 87:
            {
                selectPiece = true;
                aDir = new GameFramework.geom.TIntPoint(0, -1);
                break;
            }
            case 83:
            {
                selectPiece = true;
                aDir = new GameFramework.geom.TIntPoint(0, 1);
                break;
            }
        }
        var aSwapPiece = null;
        if(!this.mTimeExpired && this.CanPlay()) {
            if((selectPiece) && (this.GetSelectedPiece() == null)) {
                var aPiece_2 = null;
                if(this.mCursorSelectPos.x == -1) {
                    aPiece_2 = this.GetPieceAtScreenXY((this.mLastMouseX | 0), (this.mLastMouseY | 0));
                } else {
                    aPiece_2 = this.GetPieceAtScreenXY(this.GetBoardX() + this.GetColX(this.mCursorSelectPos.x) + ((Game.Board.GEM_WIDTH / 2) | 0), this.GetBoardY() + this.GetRowY(this.mCursorSelectPos.y) + ((Game.Board.GEM_HEIGHT / 2) | 0));
                }
                if(aPiece_2 != null) {
                    if((aPiece_2.IsFlagSet(Game.Piece.EFlag.DETONATOR)) || (aPiece_2.IsFlagSet(Game.Piece.EFlag.SCRAMBLE))) {
                        if(this.mCursorSelectPos.x != -1) {
                            aSwapPiece = aPiece_2;
                        }
                    } else if((aDir.x != 0) || (aDir.y != 0) || (this.mCursorSelectPos.x != -1)) {
                        if(!this.IsPieceSwapping(aPiece_2)) {
                            aPiece_2.mSelected = true;
                            aPiece_2.mSelectorAlpha.SetConstant(1.0);
                        }
                    }
                }
            }
            if((aDir.x != 0) || (aDir.y != 0) || (aSwapPiece != null)) {
                var aPiece_3 = aSwapPiece;
                if(aPiece_3 == null) {
                    aPiece_3 = this.GetSelectedPiece();
                }
                if(aPiece_3 != null) {
                    aSwapPiece = this.GetPieceAtRowCol(aPiece_3.mRow + aDir.y, aPiece_3.mCol + aDir.x);
                    if((this.IsGameSuspended()) || (!this.QueueSwap(aPiece_3, aPiece_3.mRow + aDir.y, aPiece_3.mCol + aDir.x, false, true, false, true))) {
                        aPiece_3.mSelected = false;
                        aPiece_3.mSelectorAlpha.SetCurve('b+0,1,0.066667,1,~###         ~#@yd');
                        return;
                    }
                }
                if(this.mCursorSelectPos.x == -1) {
                    if(!selectPiece) {
                        this.mCursorSelectPos = new GameFramework.geom.TIntPoint(((3 + Math.max(0, aDir.x)) | 0), ((3 + Math.max(0, aDir.y)) | 0));
                    }
                } else if(moveCursor) {
                    this.mCursorSelectPos.x = ((Math.max(0, Math.min(this.mColCount - 1, this.mCursorSelectPos.x + aDir.x))) | 0);
                    this.mCursorSelectPos.y = ((Math.max(0, Math.min(this.mRowCount - 1, this.mCursorSelectPos.y + aDir.y))) | 0);
                }
            }
        }
    },
    KeyChar : function Game_Board$KeyChar(theChar) {
        GameFramework.widgets.ClassicWidget.prototype.KeyChar.apply(this, [theChar]);
        if(Game.BejApp.mBejApp.mDebugKeysEnabled) {
            var aCursorPiece = this.GetPieceAtScreenXY((this.mLastMouseX | 0), (this.mLastMouseY | 0));
            if(theChar == 116) {
                if(this.mMessager != null) {
                    this.mMessager.AddMessage('tutorial reset');
                }
                this.mTutorialMgr.SetTutorialFlags(0);
                this.mTutorialMgr.SetTutorialEnabled(true);
            } else if(theChar == 120) {
                this.mSunPosition.SetCurve('b+-200,1500,0.006667,1,#0zN         ~~W7v');
            } else if(theChar == 122) {
                var aLight = this.mPostFXManager.AllocEffect(Game.Effect.EFxType.LIGHT);
                aLight.mFlags = (Game.Effect.EFlag.ALPHA_FADEINOUT | 0);
                aLight.mX = this.mLastMouseX;
                aLight.mY = this.mLastMouseY;
                aLight.mLightIntensity = 1.0;
                aLight.mZ = 0.08;
                aLight.mValue[0] = 5000;
                aLight.mValue[1] = -4000;
                aLight.mValue[2] = 1.0;
                aLight.mAlpha = 0.3;
                aLight.mDAlpha = 0.06 * 1.67;
                aLight.mScale = 1.0;
                this.mPostFXManager.AddEffect(aLight);
            } else if(theChar == 65) {
                Game.BejApp.mBejApp.mAutoPlay = (((Game.BejApp.mBejApp.mAutoPlay | 0) + 1) % (Game.DM.EAutoplay._COUNT | 0));
                this.mMessager.AddMessage(String.format('Autoplay: {0}', Game.DM.gAutoplayDesc[(Game.BejApp.mBejApp.mAutoPlay | 0)]));
                this.mMessager.AddMessage(String.format('Ticks elapsed u:{0},g:{1}', this.mUpdateCnt, this.mGameTicks));
            } else if(theChar == 33) {
                this.mMessager.AddMessage('Reset tutorial sequence');
                var oldIdx = -1;
                this.SetTutorialCleared(Game.DM.ETutorial.CLASSIC_TUTORIAL_MAKE_MORE_MATCHES, false);
                this.SetTutorialCleared(Game.DM.ETutorial.SPEED_TUTORIAL_TIME_GEM, false);
                if(this.mTutorialMgr.GetTutorialSequence() != null) {
                    oldIdx = this.mTutorialMgr.GetTutorialSequence().mCurStepIdx;
                }
                this.mTutorialMgr.SetTutorialSequence(this.GetTutorialSequence());
                if(this.mTutorialMgr.GetTutorialSequence() != null) {
                    this.mTutorialMgr.GetTutorialSequence().mCurStepIdx = oldIdx - 1;
                    this.mTutorialMgr.GetTutorialSequence().AdvanceStep();
                }
            } else if((theChar >= 48) && (theChar <= 55)) {
                if(aCursorPiece == null) {
                    aCursorPiece = this.CreateNewPiece(this.GetRowAt((this.mLastMouseY | 0)), this.GetColAt((this.mLastMouseX | 0) - this.GetBoardX()));
                }
                aCursorPiece.mColor = (GameFramework.Utils.GetCharCode(theChar) - GameFramework.Utils.GetCharCode(48));
                aCursorPiece.mColor = (((aCursorPiece.mColor | 0)) % (Game.DM.EGemColor._COUNT | 0));
                aCursorPiece.mFlags = 0;
            }
            if(aCursorPiece != null) {
                if(theChar == 72) {
                    var thePiece = this.mBoard[this.mBoard.mIdxMult0 * (0) + 0];
                    thePiece.mHintScale.SetCurve('b+1,1.5,0.033333,1,#+Kx  >~###       c####');
                    thePiece.mHintAlpha.SetCurve('b+0,1,0.006667,1,#### ;~###       O~### 9####');
                    thePiece.mHintArrowPos.SetCurve('b+80,64,0.006667,1,####  &}### |####  #~### z####  &~###');
                } else if(theChar == 102) {
                    this.Flamify(aCursorPiece);
                } else if(theChar == 108) {
                    this.Laserify(aCursorPiece);
                } else if(theChar == 104) {
                    this.Hypercubeify(aCursorPiece);
                } else if(theChar == 109) {
                    if(this.NumPiecesWithFlag(Game.Piece.EFlag.POINT_MULTIPLIER) < (8 - this.mPointMultiplier)) {
                        aCursorPiece.ClearFlags();
                        aCursorPiece.SetFlag(Game.Piece.EFlag.POINT_MULTIPLIER);
                        this.StartMultiplierGemEffect(aCursorPiece);
                    }
                } else if(GameFramework.Utils.GetCharCode(theChar) == 8) {
                    this.DeletePiece(aCursorPiece);
                    aCursorPiece = null;
                } else if(theChar == 33) {
                    aCursorPiece.mColor = Game.DM.EGemColor._INVALID;
                    aCursorPiece.SetFlag(Game.Piece.EFlag.DETONATOR);
                    aCursorPiece.mCanDestroy = false;
                    this.StartPieceEffect(aCursorPiece);
                } else if(theChar == 64) {
                    aCursorPiece.mColor = Game.DM.EGemColor._INVALID;
                    aCursorPiece.SetFlag(Game.Piece.EFlag.SCRAMBLE);
                    aCursorPiece.mCanDestroy = false;
                    this.StartPieceEffect(aCursorPiece);
                }
            }
            if(theChar == 45) {
                GameFramework.BaseApp.mApp.mTimeScale *= 0.75;
                //JS
                gTimeScale *= 0.75;
                //-JS
            } else if(theChar == 43) {
                GameFramework.BaseApp.mApp.mTimeScale /= 0.75;
                //JS
                gTimeScale /= 0.75;
                //-JS
            } else if(theChar == 61) {
                GameFramework.BaseApp.mApp.mTimeScale = 1.0;
                //JS
                gTimeScale = 1.0;
                //-JS
            } else if(theChar == 82) {
                Game.BejApp.mBejApp.ChangeArtRes((GameFramework.BaseApp.mApp.mArtRes == 768) ? 480 : 768);
            } else if(theChar == 93) {
                for(var i = 0; i < 500; i++) {
                    this.Update();
                }
            } else if(theChar == 91) {
                this.mGameTicks = this.GetTimeLimit() * 60;
            }
            if(theChar == 70) {
                this.mSpeedBonusNum = 1.0;
                this.mSpeedBonusCount = 10;
                this.mSpeedBonusTextShowPct.Intercept('b;0,1,0.01,0.25,####         ~~###');
                this.mSpeedBonusDisp.SetCurve('b+0,1,0.05,1,####         ~~###');
                this.DoSpeedText(0);
                this.mSpeedBonusPoints = 1000;
                this.mSpeedBonusPointsGlow.SetCurve('b+0,1,0.033333,1,#### ;I-7l        f####');
                this.mSpeedBonusPointsScale.SetCurve('b+1,2,0.033333,1,####  >4###       c####');
            } else if(theChar == 78) {
                this.LevelUp();
            } else if(theChar == 113) {

                {
                    var $srcArray76 = this.mBoard;
                    for(var $enum76 = 0; $enum76 < $srcArray76.length; $enum76++) {
                        var aPiece = $srcArray76[$enum76];
                        if(aPiece != null) {
                            aPiece.mColor = ((aPiece.mCol + aPiece.mRow) % 7);
                        }
                    }
                }
            } else if(theChar == 77) {
                this.MatchMade(null);
                this.DecrementAllCounterGems(false);
            } else if(theChar == 90) {
                if(this.mBackground != null) {
                    this.mBackground.RemoveSelf();
                }
                this.SetupBackground(-1);
                this.mAppState.SetFocus(this);
                this.mMessager.AddMessage(String.format('Background changed to idx: {0}\n', this.mBackgroundIdx));
            } else if(theChar == 88) {
                if(this.mBackground != null) {
                    this.mBackground.RemoveSelf();
                }
                this.SetupBackground(1);
                this.mAppState.SetFocus(this);
                this.mMessager.AddMessage(String.format('Background changed to idx: {0}\n', this.mBackgroundIdx));
            }
            if(theChar == 112) {
                this.AddPoints(800, 600, 100);
            } else if(theChar == 80) {
                this.AddPoints(800, 600, 2000);
            } else if(theChar == 114) {
                this.mMessager.AddMessageColor('RESET STATS', 0xffff6666);
                for(var i_2 = 0; i_2 < (Game.DM.EStat._COUNT | 0); i_2++) {
                    Game.BejApp.mBejApp.mProfile.mStats[i_2] = 0;
                }
            } else if(theChar == 82) {
                this.mMessager.AddMessageColor('RESET PROFILE', 0xffff6666);
                Game.BejApp.mBejApp.mProfile = new Game.Profile();
            } else if(theChar == 72) {
                this.mMessager.AddMessageColor('RESET HIGH SCORES', 0xffff6666);
                Game.BejApp.mBejApp.mHighScoreMgr = new Game.HighScoreMgr();
                Game.BejApp.mBejApp.InitDefaultHighScores();
                Game.BejApp.mBejApp.mHighScoreMgr.Save();
            }
        }
        if((theChar == 32) && (this.mCursorSelectPos.x == -1) && (this.WantsHideOnPause() || this.mUserPaused) && !this.IsTutorialBusy()) {
            this.mUserPaused = !this.mUserPaused;
        }
    },
    ButtonDepress : function Game_Board$ButtonDepress(theId) {
        if(!this.AllowUI()) {
            return;
        }
    },
    SliderVal : function Game_Board$SliderVal(theId, theVal) {
        this.mSliderSetTicks = 0;
    },
    DialogButtonDepress : function Game_Board$DialogButtonDepress(theDialogId, theButtonId) {
    },
    WantExpandedTopWidget : function Game_Board$WantExpandedTopWidget() {
        return 0;
    },
    DisableUI : function Game_Board$DisableUI(disabled) {
    },
    GetSidebarTextY : function Game_Board$GetSidebarTextY() {
        return 320;
    },
    DrawScore : function Game_Board$DrawScore(g) {
        g.SetFont(Game.Resources['FONT_SCORE']);
        Game.Resources['FONT_SCORE'].PushLayerColor('GLOW', 0x9f000000);
        var aScore = GameFramework.Utils.CommaSeperate(this.mDispPoints);
        if(this.mShowLevelPoints) {
            aScore += ' of ' + GameFramework.Utils.CommaSeperate(this.GetLevelPoints());
        }
        g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.GetAlpha()) | 0)));
        g.DrawStringEx(aScore, this.GetLeftUIOffsetX() + 242, 202.0, 0, 0);
        g.PopColor();
        Game.Resources['FONT_SCORE'].PopLayerColor('GLOW');
    },
    HandleAnnouncementAdded : function Game_Board$HandleAnnouncementAdded(theAnnouncement) {
        this.mAnnouncements.push(theAnnouncement);
    },
    HandleAnnouncementComplete : function Game_Board$HandleAnnouncementComplete(theAnnouncement) {
        for(var idx = 0; idx < this.mAnnouncements.length; ++idx) {
            if(this.mAnnouncements[idx] == theAnnouncement) {
                this.mAnnouncements.removeAt(idx);
            } else {
                ++idx;
            }
        }
    }
}
Game.Board.staticInit = function Game_Board$staticInit() {
    Game.Board.GEM_WIDTH = 128;
    Game.Board.GEM_HEIGHT = 128;
    Game.Board.NUM_COLS = 8;
    Game.Board.NUM_ROWS = 8;
    Game.Board.PIECE_NEIGHBORS = Array.Create2D(4, 2, 0, 1, 0, -1, 0, 0, 1, 0, -1);
    Game.Board.BACKGROUND_NAMES = Array.Create(20, "", 'canyon_wall_castle.pam', 'crystal_mountain_peak.pam', 'dark_cave_thing.pam', 'desert_pyramids_sunset.pam', 'fairy_cave_village.pam', 'floating_rock_city.pam', 'flying_sail_boat.pam', 'horse_forest_tree.pam', 'jungle_ruins_path.pam', 'lantern_plants_world.pam', 'Lion_tower_cascade.pam', 'pointy_ice_path.pam', 'rock_city_lake.pam', 'bridge_shroom_castles.pam', 'snowy_cliffs_castle.pam', 'treehouse_waterfall.pam', 'tube_forest_night.pam', 'water_bubble_city.pam', 'water_fall_cliff.pam', 'pointy_ice_path_purple.pam');
    Game.Board.DESIRED_ORDER_LIST = Array.Create(19, 19, 10, 7, 5, 9, 14, 11, 8, 18, 12, 16, 2, 17, 4, 0, 15, 13, 1, 3, 6);
    Game.Board.mTotalTicks = 0;
    Game.Board.BumpColumn_MAX_DIST = Game.Board.GEM_HEIGHT * 2.0;
    Game.Board.mGemLightData = Array.Create(9, null);
}

JSFExt_AddInitFunc(function() {
    Game.Board.registerClass('Game.Board', GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function() {
    Game.Board.staticInit();
});
Game.Board.Widgets = {};
Game.Board.Widgets.staticInit = function Game_Board_Widgets$staticInit() {
    Game.Board.Widgets.BUTTON_HINT = 0;
    Game.Board.Widgets.BUTTON_MENU = 1;
    Game.Board.Widgets.BUTTON_RESET = 2;
    Game.Board.Widgets.BUTTON_REPLAY = 3;
    Game.Board.Widgets.BUTTON_QUEST_HELP = 4;
    Game.Board.Widgets.BUTTON_ZEN_OPTIONS = 5;
    Game.Board.Widgets.__COUNT = 6;
}
JSFExt_AddInitFunc(function() {
    Game.Board.Widgets.staticInit();
});
Game.Board.EPointType = {};
Game.Board.EPointType.staticInit = function Game_Board_EPointType$staticInit() {
    Game.Board.EPointType.MATCH = 0;
    Game.Board.EPointType.SPECIAL = 1;
    Game.Board.EPointType.SPEED = 2;
    Game.Board.EPointType.COLUMN_CLEAR = 3;
    Game.Board.EPointType.COLUMN_COMBO = 4;
    Game.Board.EPointType.__COUNT = 5;
}
JSFExt_AddInitFunc(function() {
    Game.Board.EPointType.staticInit();
});
Game.Board.EUIConfig = {};
Game.Board.EUIConfig.staticInit = function Game_Board_EUIConfig$staticInit() {
    Game.Board.EUIConfig.Standard = 0;
    Game.Board.EUIConfig.WithReset = 1;
}
JSFExt_AddInitFunc(function() {
    Game.Board.EUIConfig.staticInit();
});