Game.Piece = function Game_Piece(theBoard) {
    this.mScale = new GameFramework.CurvedVal();
    this.mAlpha = new GameFramework.CurvedVal();
    this.mSelectorAlpha = new GameFramework.CurvedVal();
    this.mDestPct = new GameFramework.CurvedVal();
    this.mHintAlpha = new GameFramework.CurvedVal();
    this.mHintArrowPos = new GameFramework.CurvedVal();
    this.mHintFlashScale = new GameFramework.CurvedVal();
    this.mHintFlashAlpha = new GameFramework.CurvedVal();
    this.mHintScale = new GameFramework.CurvedVal();
    this.mOverlayCurve = new GameFramework.CurvedVal();
    this.mOverlayBulge = new GameFramework.CurvedVal();
    this.mAnimCurve = new GameFramework.CurvedVal();
    this.mBoundEffects = [];
    this.mBoard = theBoard;
    this.Init(this.mBoard.mNextPieceId++);
}
Game.Piece.GetFlagBit = function Game_Piece$GetFlagBit(theFlag) {
    return (1 << (theFlag | 0));
}
Game.Piece.GetRadiusPoint = function Game_Piece$GetRadiusPoint(theFrame, theColorIdx, theRadius) {
    var anIdx = theFrame * 7 * 256 + theColorIdx * 256 + theRadius;
    if(anIdx < 12544) {
        return Game.BejApp.mBejApp.mGemOutlines.GEM_OUTLINE_RADIUS_POINTS[anIdx];
    } else {
        return Game.BejApp.mBejApp.mGemOutlines.GEM_OUTLINE_RADIUS_POINTS2[anIdx - 12544];
    }
}
Game.Piece.GetAngleRadiusColorFrame = function Game_Piece$GetAngleRadiusColorFrame(theAngle, theColor, theFrame) {
    while(theAngle >= 3.141593 * 2.0) {
        theAngle -= 3.141593 * 2.0;
    }
    while(theAngle < 0.0) {
        theAngle += 3.141593 * 2.0;
    }
    var aNum = 256.0 * theAngle / (3.141593 * 2.0);
    var anIdx = (aNum | 0);
    var aColorIdx = (theColor | 0);
    if(anIdx < 0) {
        return Game.Piece.GetRadiusPoint(theFrame, aColorIdx, 0);
    } else if(anIdx >= 255) {
        return Game.Piece.GetRadiusPoint(theFrame, aColorIdx, 255);
    } else {
        var aPct = aNum - anIdx;
        return Game.Piece.GetRadiusPoint(theFrame, aColorIdx, anIdx) * (1.0 - aPct) + Game.Piece.GetRadiusPoint(theFrame, aColorIdx, anIdx + 1) * aPct;
    }
}
Game.Piece.prototype = {
    mBoard : null,
    mId : 0,
    mCol : 0,
    mRow : 0,
    mX : 0,
    mY : 0,
    mCreatedTick : 0,
    mFallVelocity : 0,
    mScale : null,
    mAlpha : null,
    mSelectorAlpha : null,
    mRotPct : 0,
    mIsElectrocuting : null,
    mElectrocutePercent : 0,
    mDestructing : null,
    mIsExploding : null,
    mCanMatch : null,
    mCanSwap : null,
    mCanScramble : null,
    mTallied : null,
    mCanDestroy : null,
    mIsBulging : null,
    mImmunityCount : 0,
    mMoveCreditId : 0,
    mLastMoveCreditId : 0,
    mMatchId : 0,
    mIsPieceStill : false,
    mWillPieceBeStill : true,
    mDestPct : null,
    mDestCol : 0,
    mDestRow : 0,
    mChangedTick : 0,
    mSwapTick : 0,
    mLastActiveTick : 0,
    mLastColor : null,
    mColor : null,
    mDestColor : null,
    mFlags : 0,
    mDisallowFlags : 0,
    mExplodeDelay : 0,
    mExplodeSourceId : 0,
    mExplodeSourceFlags : 0,
    mSelected : null,
    mHidePct : 0,
    mCounter : 0,
    mCounterDelay : 0,
    mTimer : 0,
    mTimerThreshold : 0,
    mShakeOfsX : 0,
    mShakeOfsY : 0,
    mShakeTime : 0,
    mShakeScale : 0,
    mShakeAngle : 0,
    mSpinFrame : 0,
    mSpinSpeed : 0,
    mDestSpinSpeed : 0,
    mSpinSpeedHoldTime : 0,
    mHintAlpha : null,
    mHintArrowPos : null,
    mHintFlashScale : null,
    mHintFlashAlpha : null,
    mHintScale : null,
    mOverlayCurve : null,
    mOverlayBulge : null,
    mAnimCurve : null,
    mFlyVX : 0,
    mFlyVY : 0,
    mFlyAY : 0,
    mBoundEffects : null,
    Dispose : function Game_Piece$Dispose() {
        this.ClearBoundEffects();
        this.mBoard.RemoveFromPieceMap(this.mId);
    },
    Init : function Game_Piece$Init(theId) {
        this.mCreatedTick = 0;
        this.mFlags = 0;
        this.mDisallowFlags = 0;
        this.mColor = Game.DM.EGemColor.WHITE;
        this.mLastColor = Game.DM.EGemColor.WHITE;
        this.mDestColor = Game.DM.EGemColor.WHITE;
        this.mExplodeDelay = 0;
        this.mExplodeSourceId = -1;
        this.mExplodeSourceFlags = 0;
        this.mLastActiveTick = 0;
        this.mChangedTick = 0;
        this.mSwapTick = -1;
        this.mIsElectrocuting = false;
        this.mElectrocutePercent = 0;
        this.mDestructing = false;
        this.mIsExploding = false;
        this.mCanMatch = true;
        this.mCanSwap = true;
        this.mCanScramble = true;
        this.mTallied = false;
        this.mCanDestroy = true;
        this.mIsBulging = false;
        this.mImmunityCount = 0;
        this.mMoveCreditId = -1;
        this.mLastMoveCreditId = -1;
        this.mMatchId = -1;
        this.mX = 0;
        this.mY = 0;
        this.mCol = 0;
        this.mRow = 0;
        this.mFallVelocity = 0;
        this.mDestCol = 0;
        this.mDestRow = 0;
        this.mAlpha.SetConstant(1.0);
        this.mRotPct = 0;
        this.mSelected = false;
        this.mHidePct = 0;
        this.mScale.SetConstant(1.0);
        this.mCounter = 0;
        this.mCounterDelay = 0;
        this.mTimer = 0;
        this.mTimerThreshold = 100;
        this.mShakeOfsX = 0;
        this.mShakeOfsY = 0;
        this.mShakeScale = 0;
        this.mShakeAngle = 0;
        this.mShakeTime = 0;
        this.mSpinFrame = 0;
        this.mSpinSpeed = 0;
        this.mDestSpinSpeed = 0;
        this.mSpinSpeedHoldTime = 0;
        this.mFlyVX = 0;
        this.mFlyVY = 0;
        this.mFlyAY = 0;
        this.mId = theId;
        this.mBoard.AddToPieceMap(this.mId, this);
    },
    IsShrinking : function Game_Piece$IsShrinking() {
        return this.mScale.mRamp == GameFramework.CurvedVal.RAMP_CURVEDATA;
    },
    IsButton : function Game_Piece$IsButton() {
        return this.IsFlagSet(Game.Piece.EFlag.DETONATOR) || this.IsFlagSet(Game.Piece.EFlag.SCRAMBLE);
    },
    BindEffect : function Game_Piece$BindEffect(theEffect) {
        theEffect.mPieceIdRel = this.mId;
        theEffect.mRefCount++;
        this.mBoundEffects.push(theEffect);
    },
    ClearBoundEffects : function Game_Piece$ClearBoundEffects() {
        for(var i = 0; i < this.mBoundEffects.length; ++i) {
            this.mBoundEffects[i].mPieceIdRel = 0;
            this.mBoundEffects[i].mRefCount--;
        }
        this.mBoundEffects.clear();
    },
    ClearHyperspaceEffects : function Game_Piece$ClearHyperspaceEffects() {
        for(var i = 0; i < this.mBoundEffects.length; ++i) {
            if((this.mBoundEffects[i].mFlags & (Game.Effect.EFlag.HYPERSPACE_ONLY | 0)) != 0) {
                this.mBoundEffects[i].mPieceIdRel = 0;
                this.mBoundEffects[i].mRefCount--;
                this.mBoundEffects.removeAt(i);
                i--;
            }
        }
        this.mBoundEffects.clear();
    },
    CancelMatch : function Game_Piece$CancelMatch() {
        this.mScale.SetConstant(1.0);
    },
    CX : function Game_Piece$CX() {
        return this.GetScreenX() + ((Game.Board.GEM_WIDTH / 2) | 0);
    },
    CY : function Game_Piece$CY() {
        return this.GetScreenY() + ((Game.Board.GEM_HEIGHT / 2) | 0);
    },
    GetScreenX : function Game_Piece$GetScreenX() {
        return this.mX + this.mBoard.GetBoardX();
    },
    GetScreenY : function Game_Piece$GetScreenY() {
        return this.mY + this.mBoard.GetBoardY();
    },
    FindRowFromY : function Game_Piece$FindRowFromY() {
        return this.mBoard.GetRowAt((this.mY | 0));
    },
    FindColFromX : function Game_Piece$FindColFromX() {
        return this.mBoard.GetColAt((this.mX | 0));
    },
    SetFlag : function Game_Piece$SetFlag(theFlag) {
        return this.SetFlagTo(theFlag, true);
    },
    SetFlagTo : function Game_Piece$SetFlagTo(theFlag, theValue) {
        var aBit = Game.Piece.GetFlagBit(theFlag);
        if(theValue && ((aBit & this.mDisallowFlags) != 0)) {
            return false;
        }
        if(theValue) {
            this.mFlags = this.mFlags | aBit;
        } else {
            this.mFlags = this.mFlags & ~aBit;
        }
        return true;
    },
    CanSetFlag : function Game_Piece$CanSetFlag(theFlag) {
        return (Game.Piece.GetFlagBit(theFlag) & this.mDisallowFlags) == 0;
    },
    ClearFlag : function Game_Piece$ClearFlag(theFlag) {
        this.SetFlagTo(theFlag, false);
    },
    ClearFlags : function Game_Piece$ClearFlags() {
        this.mFlags = 0;
    },
    SetDisallowFlag : function Game_Piece$SetDisallowFlag(theFlag) {
        this.SetDisallowFlagTo(theFlag, true);
    },
    SetDisallowFlagTo : function Game_Piece$SetDisallowFlagTo(theFlag, theValue) {
        var aBit = Game.Piece.GetFlagBit(theFlag);
        if(theValue) {
            this.mDisallowFlags = this.mDisallowFlags | aBit;
        } else {
            this.mDisallowFlags = this.mDisallowFlags & ~aBit;
        }
        this.mFlags &= ~this.mDisallowFlags;
    },
    ClearDisallowFlag : function Game_Piece$ClearDisallowFlag(theFlag) {
        this.SetDisallowFlagTo(theFlag, false);
    },
    ClearDisallowFlags : function Game_Piece$ClearDisallowFlags() {
        this.mDisallowFlags = 0;
    },
    GetAngleRadius : function Game_Piece$GetAngleRadius(theAngle) {
        var aFrame = ((Math.min(19, 20 * this.mRotPct)) | 0);
        return Game.Piece.GetAngleRadiusColorFrame(theAngle, this.mColor, aFrame);
    },
    Update : function Game_Piece$Update() {
        this.mOverlayBulge.IncInVal();
        this.mOverlayCurve.IncInVal();
        if(this.mShakeScale > 0) {
            this.mShakeAngle = 3.141593 * GameFramework.Utils.GetRandFloat();
            this.mShakeOfsX = Math.cos(this.mShakeAngle) * this.mShakeScale * Game.Board.GEM_WIDTH / 20.0;
            this.mShakeOfsY = Math.sin(this.mShakeAngle) * this.mShakeScale * Game.Board.GEM_HEIGHT / 20.0;
        } else {
            this.mShakeOfsX = 0.0;
            this.mShakeOfsY = 0.0;
        }
        if(this.mElectrocutePercent > 0.0) {
        }
        if(this.IsFlagSet(Game.Piece.EFlag.FLAME)) {
            for(var i = 0; i < 4; i++) {
                var anEffect;
                if((Game.BejApp.mBejApp.mFXScale != 1.0) && (GameFramework.Utils.GetRandFloatU() > 0.4 + Game.BejApp.mBejApp.mFXScale * 0.6)) {
                    continue;
                }
                var isFlame = (Game.Util.Rand() % 5) != 0;
                if((!isFlame) && ((!GameFramework.BaseApp.mApp.get_Is3D()) || (Game.BejApp.mBejApp.mIsSlow))) {
                    continue;
                }
                var aManager;
                if(isFlame) {
                    aManager = (Game.Util.Rand() % 32 == 0) ? this.mBoard.mPostFXManager : this.mBoard.mPreFXManager;
                    anEffect = aManager.AllocEffect(Game.Effect.EFxType.EMBER_FADEINOUT);
                    {
                        anEffect.mAngle = 0.0;
                        anEffect.mDAngle = 0.0;
                        anEffect.mAlpha = 0.0;
                        anEffect.mDAlpha = (0.0075 + 0.0015 * GameFramework.Utils.GetRandFloat()) * 1.67;
                        anEffect.mScale = 0.12 + 0.035 * GameFramework.Utils.GetRandFloat();
                        anEffect.mDScale = (0.01 + 0.005 * GameFramework.Utils.GetRandFloat()) * 1.67;
                        anEffect.mDY = (-0.12 + -0.05 * GameFramework.Utils.GetRandFloat()) * 1.67;
                    }
                    var doRedFlame = ((this.mBoard.mWantsReddishFlamegems) && ((Game.Util.Rand() % 4 <= 0) && (aManager == this.mBoard.mPreFXManager)));
                    if((this.mColor == Game.DM.EGemColor.YELLOW) || (doRedFlame)) {
                        anEffect.mColor = GameFramework.gfx.Color.RGBToInt(255, 128, 128);
                        if(doRedFlame) {
                            anEffect.mType = Game.Effect.EFxType.EMBER_FADEINOUT_BOTTOM;
                        }
                    } else {
                        anEffect.mColor = GameFramework.gfx.Color.RGBToInt(255, 255, 255);
                    }
                } else {
                    aManager = (Game.Util.Rand() % 2 == 0) ? this.mBoard.mPostFXManager : this.mBoard.mPreFXManager;
                    anEffect = aManager.AllocEffect(Game.Effect.EFxType.EMBER);
                    anEffect.mAlpha = 1.0;
                    anEffect.mScale = 2.0;
                    anEffect.mDScale = (-0.01) * 1.67;
                    anEffect.mFrame = 0;
                    anEffect.mImage = Game.Resources['IMAGE_SPARKLET'];
                    anEffect.mDY = (-0.4 + GameFramework.Utils.GetRandFloat() * 0.15) * 1.67;
                    anEffect.mColor = GameFramework.gfx.Color.RGBToInt(128, Game.Util.Rand() % 32 + 48, Game.Util.Rand() % 24 + 24);
                    var doRedFlame_2 = ((this.mBoard.mWantsReddishFlamegems) && ((Game.Util.Rand() % 3 <= 0) && (aManager == this.mBoard.mPreFXManager)));
                    if((this.mColor == Game.DM.EGemColor.YELLOW) || (doRedFlame_2)) {
                        anEffect.mColor = GameFramework.gfx.Color.RGBToInt(255, 0, 0);
                        if(doRedFlame_2) {
                            anEffect.mType = Game.Effect.EFxType.EMBER_BOTTOM;
                        }
                    } else if(this.mColor == Game.DM.EGemColor.RED) {
                        anEffect.mColor = GameFramework.gfx.Color.RGBToInt(240, 128, 64);
                    }
                }
                var anAngle = 3.141593 + Math.abs(GameFramework.Utils.GetRandFloat() * 3.141593 * 2);
                var aRadius = (this.GetAngleRadius(anAngle));
                var aCos1 = Math.cos(anAngle);
                var aSin1 = Math.sin(anAngle);
                if((isFlame) && (aSin1 > 0.0) && (Game.Util.Rand() % 2) != 0) {
                    var anAngDelta;
                    if(aCos1 < 0) {
                        anAngDelta = 0.001;
                    } else {
                        anAngDelta = -0.001;
                    }
                    var aCos2 = (Math.cos(anAngle + anAngDelta) + Math.cos(anAngle + anAngDelta * 2)) / 2;
                    var aSin2 = (Math.sin(anAngle + anAngDelta) + Math.sin(anAngle + anAngDelta * 2)) / 2;
                    var aTanAng = Math.atan2(aSin2 - aSin1, aCos2 - aCos1);
                    var aSpeed = 0.12 + 0.05 * GameFramework.Utils.GetRandFloat();
                    var aNewDX = Math.cos(aTanAng) * aSpeed;
                    var aNewDY = Math.sin(aTanAng) * aSpeed;
                    anEffect.mDX = ((anEffect.mDX + aNewDX) / 2) * 1.67;
                    anEffect.mDY = ((anEffect.mDY + aNewDY) / 2) * 1.67;
                }
                var aScreenXPhys = this.GetScreenX();
                if(aManager == this.mBoard.mPostFXManager) {
                    aScreenXPhys += this.mBoard.mSideXOff.GetOutVal();
                }
                if((Game.BejApp.mBejApp.mIsSlow) || (!Game.BejApp.mBejApp.get_Is3D())) {
                    aRadius *= 0.8;
                    anEffect.mScale *= 2.0;
                    anEffect.mDScale *= 2.0;
                }
                anEffect.mX = aScreenXPhys + ((Game.Board.GEM_WIDTH / 2) | 0) + Math.cos(anAngle) * aRadius;
                anEffect.mY = this.GetScreenY() + ((Game.Board.GEM_HEIGHT / 2) | 0) + Math.sin(anAngle) * aRadius + 2.0;
                if(Game.Util.Rand() % 6 != 0) {
                    anEffect.mX -= aScreenXPhys;
                    anEffect.mY -= this.GetScreenY();
                    anEffect.mPieceIdRel = this.mId;
                }
                aManager.AddEffect(anEffect);
                if(Game.BejApp.mBejApp.mIsSlow) {
                    break;
                }
            }
            if(((Game.BejApp.mBejApp.mUpdateCnt + this.mId) % 24 == 0) || (Game.Util.Rand() % 64 == 0)) {
                var anEffect_2 = this.mBoard.mPostFXManager.AllocEffect(Game.Effect.EFxType.LIGHT);
                anEffect_2.mFlags = (Game.Effect.EFlag.ALPHA_FADEINOUT | 0);
                anEffect_2.mX = this.CX() + GameFramework.Utils.GetRandFloat() * 30.0;
                anEffect_2.mY = this.CY() + GameFramework.Utils.GetRandFloat() * 30.0 + 0.0;
                anEffect_2.mZ = 0.08;
                anEffect_2.mValue[0] = 6000.0;
                anEffect_2.mValue[1] = -4000.0;
                anEffect_2.mValue[2] = 0.5;
                anEffect_2.mAlpha = 0.0;
                anEffect_2.mDAlpha = 0.07;
                anEffect_2.mScale = 0.75;
                anEffect_2.mColor = Game.Util.HSLToRGB(((Game.Util.Rand() % 255) | 0), 255, 128);
                if(Game.Util.Rand() % 2 != 0) {
                    anEffect_2.mPieceId = this.mId;
                }
                this.mBoard.mPostFXManager.AddEffect(anEffect_2);
            }
        }
        if(this.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) {
            if(((Game.BejApp.mBejApp.mUpdateCnt + this.mId) % 24 == 0) || (Game.Util.Rand() % 64 == 0)) {
                var anEffect_3 = this.mBoard.mPostFXManager.AllocEffect(Game.Effect.EFxType.LIGHT);
                anEffect_3.mFlags = (Game.Effect.EFlag.ALPHA_FADEINOUT | 0);
                anEffect_3.mX = this.CX() + GameFramework.Utils.GetRandFloat() * 30.0;
                anEffect_3.mY = this.CY() + GameFramework.Utils.GetRandFloat() * 30.0 + 0.0;
                anEffect_3.mZ = 0.08;
                anEffect_3.mValue[0] = 6000.0;
                anEffect_3.mValue[1] = -4000.0;
                anEffect_3.mValue[2] = 1.0;
                anEffect_3.mAlpha = 0.0;
                anEffect_3.mDAlpha = 0.07;
                anEffect_3.mScale = 1.0;
                anEffect_3.mColor = Game.Util.HSLToRGB(((Game.Util.Rand() % 255) | 0), 255, 128);
                if(Game.Util.Rand() % 2 != 0) {
                    anEffect_3.mPieceId = this.mId;
                }
                this.mBoard.mPostFXManager.AddEffect(anEffect_3);
            }
        }
        for(var i_2 = 0; i_2 < (this.mBoundEffects.length | 0);) {
            var anEffect_4 = this.mBoundEffects[i_2];
            if(anEffect_4.mDeleteMe) {
                anEffect_4.mRefCount--;
                this.mBoundEffects.removeAt(i_2);
            } else {
                ++i_2;
            }
        }
    },
    IsFlagSet : function Game_Piece$IsFlagSet(theFlag) {
        var aBit = (1 << (theFlag | 0));
        return (this.mFlags & aBit) != 0;
    }
}
Game.Piece.staticInit = function Game_Piece$staticInit() {
}

JS_AddInitFunc(function() {
    Game.Piece.registerClass('Game.Piece', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    Game.Piece.staticInit();
});
Game.Piece.EFlag = {};
Game.Piece.EFlag.staticInit = function Game_Piece_EFlag$staticInit() {
    Game.Piece.EFlag.FLAME = 0;
    Game.Piece.EFlag.HYPERCUBE = 1;
    Game.Piece.EFlag.LASER = 2;
    Game.Piece.EFlag.RESERVED = 3;
    Game.Piece.EFlag.POINT_MULTIPLIER = 4;
    Game.Piece.EFlag.BOMB = 5;
    Game.Piece.EFlag.REALTIME_BOMB = 6;
    Game.Piece.EFlag.DOOM = 7;
    Game.Piece.EFlag.COUNTER = 8;
    Game.Piece.EFlag.COIN = 9;
    Game.Piece.EFlag.DETONATOR = 10;
    Game.Piece.EFlag.SCRAMBLE = 11;
    Game.Piece.EFlag.MYSTERY = 12;
    Game.Piece.EFlag.SKULL = 13;
    Game.Piece.EFlag.INFERNO_SWAP = 14;
    Game.Piece.EFlag.DIG = 15;
    Game.Piece.EFlag.BLAST_GEM = 16;
    Game.Piece.EFlag.TIME_BONUS = 17;
}
JS_AddInitFunc(function() {
    Game.Piece.EFlag.staticInit();
});