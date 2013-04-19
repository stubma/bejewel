Game.EffectsManager = function Game_EffectsManager(theBoard) {
    this.mEffects = Array.Create((Game.Effect.EFxType.__COUNT | 0), null);
    Game.EffectsManager.initializeBase(this);
    this.mBoard = theBoard;
    this.mApplyBoardTransformToDraw = false;
    this.mDisableMask = false;
    this.mAlpha = 1.0;
    this.mUpdateCnt = 0;
    this.mX = this.mY = 0;
    this.mMouseVisible = false;
    this.mHeightImageDirty = false;
    this.mRewindEffect = false;
    for(var i = 0; i < this.mEffects.length; ++i) {
        this.mEffects[i] = null;
    }
}
Game.EffectsManager.prototype = {
    mBoard : null,
    mEffects : null,
    mApplyBoardTransformToDraw : null,
    mDisableMask : null,
    mDoDistorts : null,
    mHeightImageDirty : null,
    mRewindEffect : null,
    mAlpha : 0,
    Dispose : function Game_EffectsManager$Dispose() {
        this.Clear();
    },
    Update : function Game_EffectsManager$Update() {
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
        if((this.mBoard != null) && (this.mBoard.mBoardHidePct == 1.0)) {
            return;
        }
        this.mWidth = GameFramework.BaseApp.mApp.mWidth;
        this.mHeight = GameFramework.BaseApp.mApp.mHeight;

        {
            var $srcArray1 = this.mEffects;
            for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
                var fxArr = $srcArray1[$enum1];
                if(fxArr == null) {
                    continue;
                }
                for(var i = 0; i < fxArr.length;) {
                    var anEffect = fxArr[i];
                    var anUpdateDiv = (anEffect.mUpdateDiv == 0) ? 1 : anEffect.mUpdateDiv;
                    if(anUpdateDiv != 1) {
                        anEffect.mX += anEffect.mDX / anUpdateDiv;
                        anEffect.mY += anEffect.mDY / anUpdateDiv;
                        anEffect.mZ += anEffect.mDZ / anUpdateDiv;
                    } else {
                        anEffect.mX += anEffect.mDX;
                        anEffect.mY += anEffect.mDY;
                        anEffect.mZ += anEffect.mDZ;
                    }
                    if((anUpdateDiv == 1) || (this.mUpdateCnt % anUpdateDiv == 0)) {
                        anEffect.mDY += anEffect.mGravity;
                        anEffect.mDX *= anEffect.mDXScalar;
                        anEffect.mDY *= anEffect.mDYScalar;
                        anEffect.mDZ *= anEffect.mDZScalar;
                        if((anEffect.mFlags & (Game.Effect.EFlag.ALPHA_FADEINDELAY | 0)) != 0 && anEffect.mDelay > 0) {
                            anEffect.mDelay -= 0.01;
                            if(anEffect.mDelay <= 0) {
                                anEffect.mDelay = 0;
                            }
                        } else {
                            anEffect.mAlpha += anEffect.mDAlpha;
                            anEffect.mScale += anEffect.mDScale;
                        }
                    }
                    switch(anEffect.mType) {
                        case Game.Effect.EFxType.SPARKLE_SHARD:
                        {
                            anEffect.mDX *= 0.95;
                            anEffect.mDY *= 0.95;
                            if(this.mUpdateCnt % anEffect.mUpdateDiv == 0) {
                                anEffect.mFrame = (anEffect.mFrame + 1) % 40;
                            }
                            if(anEffect.mFrame == 14) {
                                anEffect.mDeleteMe = true;
                            }
                            break;
                        }
                        case Game.Effect.EFxType.EMBER_BOTTOM:
                        case Game.Effect.EFxType.EMBER:
                        case Game.Effect.EFxType.EMBER_FADEINOUT:
                        {
                            anEffect.mScale += anEffect.mDScale;
                            anEffect.mAngle += anEffect.mDAngle;
                            if((anEffect.mType == Game.Effect.EFxType.EMBER_FADEINOUT) || (anEffect.mType == Game.Effect.EFxType.EMBER_FADEINOUT_BOTTOM)) {
                                anEffect.mAlpha += anEffect.mDAlpha;
                                if(anEffect.mAlpha >= 1) {
                                    anEffect.mDeleteMe = true;
                                }
                                anEffect.mFrame = ((12.0 * anEffect.mAlpha) | 0);
                            } else {
                                if((anEffect.mColor & 0xff00ff) != 0) {
                                } else {
                                    anEffect.mScale += 0.02;
                                    anEffect.mAlpha -= 0.01;
                                    if(anEffect.mAlpha <= 0) {
                                        anEffect.mDeleteMe = true;
                                    }
                                }
                            }
                            break;
                        }
                        case Game.Effect.EFxType.COUNTDOWN_SHARD:
                        {
                            anEffect.mAngle += anEffect.mDAngle;
                            var aSmoke = this.AllocEffect(Game.Effect.EFxType.SMOKE_PUFF);
                            aSmoke.mScale *= anEffect.mScale * (0.0 + Math.abs(GameFramework.Utils.GetRandFloat()) * 0.45);
                            aSmoke.mAlpha *= 0.3 + Math.abs(GameFramework.Utils.GetRandFloat()) * 0.05;
                            aSmoke.mAlpha *= anEffect.mAlpha;
                            aSmoke.mAngle = GameFramework.Utils.GetRandFloat() * 3.141593;
                            aSmoke.mDAngle = GameFramework.Utils.GetRandFloat() * 3.141593 * 0.1;
                            aSmoke.mIsAdditive = anEffect.mIsAdditive;
                            aSmoke.mGravity = 0;
                            aSmoke.mDY = -1.0;
                            aSmoke.mX = anEffect.mX;
                            aSmoke.mY = anEffect.mY;
                            this.AddEffect(aSmoke);
                            if(anEffect.mScale < 0.02) {
                                anEffect.mDeleteMe = true;
                            }
                            break;
                        }
                        case Game.Effect.EFxType.SMOKE_PUFF:
                        {
                            anEffect.mDX *= 0.95;
                            break;
                        }
                        case Game.Effect.EFxType.STEAM_COMET:
                        {
                            if(anEffect.mScale < 0.1) {
                                anEffect.mAlpha = 0;
                            } else {
                                if(this.mUpdateCnt % 10 == 9) {
                                    anEffect.mDX += 1.3 * GameFramework.Utils.GetRandFloat();
                                    anEffect.mDY += 1.3 * GameFramework.Utils.GetRandFloat();
                                }
                                if(this.mUpdateCnt % 2 != 0) {
                                    var anNewEffect = this.AllocEffect(Game.Effect.EFxType.STEAM);
                                    anNewEffect.mDX = 0.0;
                                    anNewEffect.mDY = 0.0;
                                    anNewEffect.mX = anEffect.mX;
                                    anNewEffect.mY = anEffect.mY;
                                    anNewEffect.mIsAdditive = false;
                                    anNewEffect.mScale = anEffect.mScale;
                                    anNewEffect.mDScale = 0.0;
                                    this.AddEffect(anNewEffect);
                                }
                                break;
                            }
                        }
                        case Game.Effect.EFxType.DROPLET:
                        {
                            if(anEffect.mScale < 0.0) {
                                anEffect.mAlpha = 0;
                            }
                            anEffect.mAngle = 0.0 + Math.atan2(anEffect.mDX, anEffect.mDY);
                            break;
                        }
                        case Game.Effect.EFxType.BLAST_RING:
                        {
                            anEffect.mScale += 0.8;
                            anEffect.mAlpha -= 0.02;
                            break;
                        }
                        case Game.Effect.EFxType.STEAM:
                        {
                            var aSpeed = Math.sqrt(anEffect.mDX * anEffect.mDX + anEffect.mDY * anEffect.mDY);
                            anEffect.mDX *= anEffect.mValue[2];
                            if(aSpeed > anEffect.mValue[0]) {
                                anEffect.mDY *= anEffect.mValue[2];
                            } else {
                                anEffect.mDAlpha = anEffect.mValue[1];
                            }
                        }

                            anEffect.mAngle += anEffect.mDAngle;
                            anEffect.mScale += anEffect.mDScale;
                            break;
                        case Game.Effect.EFxType.GLITTER_SPARK:
                        {
                            anEffect.mAlpha = ((Game.Util.Rand() % 5) == 0) ? 1.0 : 0.25;
                            break;
                        }
                        case Game.Effect.EFxType.FRUIT_SPARK:
                        {
                            anEffect.mDY += anEffect.mGravity;
                            anEffect.mAngle += anEffect.mDY * 0.02;
                            anEffect.mScale += 0.05;
                            if(anEffect.mScale > 0.5) {
                                anEffect.mScale = 0.5;
                            }
                            break;
                        }
                        case Game.Effect.EFxType.GEM_SHARD:
                        {
                            anEffect.mFrame = (anEffect.mFrame + 1) % 40;
                            anEffect.mDX *= anEffect.mDecel;
                            anEffect.mDY *= anEffect.mDecel;
                            anEffect.mAngle += anEffect.mDAngle;
                            anEffect.mValue[0] += anEffect.mValue[2];
                            anEffect.mValue[1] += 1.0 * anEffect.mValue[3];
                            break;
                        }
                        case Game.Effect.EFxType.NONE:
                        {
                            if((anEffect.mUpdateDiv == 0) || (this.mUpdateCnt % anEffect.mUpdateDiv == 0)) {
                                if(anEffect.mIsCyclingColor) {
                                    anEffect.mCurHue = (anEffect.mCurHue + 8) % 256;
                                    anEffect.mColor = Game.Util.HSLToRGB((anEffect.mCurHue | 0), 255, 128);
                                }
                                anEffect.mAngle += anEffect.mDAngle;
                                break;
                            }
                        }
                        case Game.Effect.EFxType.WALL_ROCK:
                        {
                            anEffect.mDX *= anEffect.mDecel;
                            if(anEffect.mY > 1300) {
                                anEffect.mDeleteMe = true;
                            }
                            break;
                        }
                        case Game.Effect.EFxType.QUAKE_DUST:
                        {
                            if(anEffect.mAlpha >= 1.0) {
                                anEffect.mAlpha = 1.0;
                                anEffect.mDAlpha = -0.01;
                                break;
                            }
                        }
                        case Game.Effect.EFxType.HYPERCUBE_ENERGIZE:
                        {
                            anEffect.mAngle += anEffect.mDAngle;
                            break;
                        }
                        case Game.Effect.EFxType.LIGHT:
                        {
                            anEffect.mLightSize = anEffect.mScale;
                            anEffect.mLightIntensity = anEffect.mAlpha;
                            break;
                        }
                        default:
                        {
                            anEffect.Update();
                            if(anEffect.mDoubleSpeed) {
                                anEffect.Update();
                            }
                            break;
                        }
                    }
                    if(anEffect.mScale < anEffect.mMinScale) {
                        anEffect.mDeleteMe = true;
                        anEffect.mScale = anEffect.mMinScale;
                    } else if(anEffect.mScale > anEffect.mMaxScale) {
                        anEffect.mScale = anEffect.mMaxScale;
                        if((anEffect.mFlags & (Game.Effect.EFlag.SCALE_FADEINOUT | 0)) != 0) {
                            anEffect.mDScale = -anEffect.mDScale;
                        }
                    }
                    if(anEffect.mAlpha > anEffect.mMaxAlpha) {
                        anEffect.mAlpha = anEffect.mMaxAlpha;
                        if((anEffect.mFlags & (Game.Effect.EFlag.ALPHA_FADEINOUT | 0)) != 0) {
                            anEffect.mDAlpha = -anEffect.mDAlpha;
                        } else {
                            anEffect.mDeleteMe = true;
                        }
                    } else if(anEffect.mAlpha <= 0) {
                        anEffect.mDeleteMe = true;
                    }
                    if((anEffect.mDeleteMe) && (anEffect.mRefCount == 0)) {
                        this.FreeEffect(anEffect);
                        fxArr.removeAt(i);
                    } else {
                        ++i;
                    }
                }
            }
        }
    },
    Draw : function Game_EffectsManager$Draw(g) {
        this.DoDraw(g, false);
    },
    DrawOverlay : function Game_EffectsManager$DrawOverlay(g) {
        GameFramework.widgets.ClassicWidget.prototype.DrawOverlay.apply(this, [g]);
        this.DoDraw(g, true);
    },
    DoDraw : function Game_EffectsManager$DoDraw(g, isOverlay) {
        if(this.mAlpha == 0) {
            return;
        }
        if((this.mBoard != null) && (this.mBoard.mGameOverCount > 0) && (this.mBoard.mSlideUIPct.GetOutVal() >= 1)) {
            return;
        }
        var hadOverlays = false;

        {
            var $srcArray2 = this.mEffects;
            for(var $enum2 = 0; $enum2 < $srcArray2.length; $enum2++) {
                var fxArr = $srcArray2[$enum2];
                if(fxArr == null) {
                    continue;
                }
                for(var i = 0; i < fxArr.length; ++i) {
                    var anEffect = fxArr[i];
                    if(anEffect.mOverlay != isOverlay) {
                        if(anEffect.mOverlay) {
                            hadOverlays = true;
                        }
                        continue;
                    }
                    if(anEffect.mDeleteMe) {
                        continue;
                    }
                    var aPieceRel = null;
                    if(this.mBoard != null && anEffect.mPieceIdRel != -1) {
                        aPieceRel = this.mBoard.GetPieceById(anEffect.mPieceIdRel);
                        if(aPieceRel != null && aPieceRel.mAlpha.GetOutVal() <= 0.0) {
                            continue;
                        }
                    }
                    if(anEffect.mPieceIdRel != -1 && anEffect.mType != Game.Effect.EFxType.PI && anEffect.mType != Game.Effect.EFxType.POPANIM && anEffect.mType != Game.Effect.EFxType.TIME_BONUS && anEffect.mType != Game.Effect.EFxType.TIME_BONUS_TOP && anEffect.mType != Game.Effect.EFxType.CUSTOMCLASS) {
                        if(this.mBoard != null) {
                            aPieceRel = this.mBoard.GetPieceById(anEffect.mPieceIdRel);
                        }
                        if(aPieceRel == null) {
                            continue;
                        }
                        anEffect.mX += aPieceRel.GetScreenX();
                        anEffect.mY += aPieceRel.GetScreenY();
                        if((this.mBoard != null) && (this.mBoard.mPostFXManager == this)) {
                            anEffect.mX += this.mBoard.mSideXOff.GetOutVal();
                        }
                    }
                    if(anEffect.mType == Game.Effect.EFxType.CUSTOMCLASS) {
                        anEffect.Draw(g);
                        continue;
                    }
                    var anAlpha = Math.min(1.0, anEffect.mAlpha) * this.mAlpha;
                    if(this.mBoard != null) {
                        this.mAlpha *= (1.0 - this.mBoard.mBoardHidePct);
                    }
                    switch(anEffect.mType) {
                        case Game.Effect.EFxType.NONE:
                        {
                            var _t3 = g.PushColor(GameFramework.gfx.Color.UInt_AToInt(anEffect.mColor, ((255.0 * anAlpha) | 0)));
                            try {
                                if(anEffect.mImage != null) {
                                    JS_Assert(anEffect.mFrame >= 0 && anEffect.mFrame < anEffect.mImage.mNumFrames);
                                    anEffect.mImage.mAdditive = anEffect.mIsAdditive;
                                    var m = new GameFramework.geom.Matrix();
                                    m.rotate(anEffect.mAngle);
                                    m.scale(anEffect.mScale, anEffect.mScale);
                                    g.PushMatrix(m);
                                    g.DrawImageCel(anEffect.mImage, anEffect.mX, anEffect.mY, anEffect.mFrame);
                                    g.PopMatrix();
                                    anEffect.mImage.mAdditive = false;
                                }
                            } finally {
                                _t3.Dispose();
                            }
                            break;
                        }

                        case Game.Effect.EFxType.GEM_SHARD:
                        {
                            var aColor = anEffect.mColor;
                            var aScale = anEffect.mScale;
                            var aTrans = new GameFramework.geom.Matrix();
                            aTrans.rotate(anEffect.mAngle);
                            var aMin = 0.25;
                            var anXScale = Math.sin(anEffect.mValue[0]);
                            if(anXScale > 0.0 && anXScale < aMin) {
                                anXScale = aMin;
                            }
                            if(anXScale < 0.0 && anXScale > -aMin) {
                                anXScale = -aMin;
                            }
                            var anYScale = Math.sin(anEffect.mValue[1]);
                            if(anYScale > 0.0 && anYScale < aMin) {
                                anYScale = aMin;
                            }
                            if(anYScale < 0.0 && anYScale > -aMin) {
                                anYScale = -aMin;
                            }
                            aTrans.scale(1.4 * anXScale * aScale, 1.4 * anYScale * aScale);
                            aTrans.scale(1.15 * anEffect.mScale, 1.15 * anEffect.mScale);
                            aTrans.translate(anEffect.mX, anEffect.mY);
                            g.PushMatrix(aTrans);
                            aColor = GameFramework.gfx.Color.UInt_AToInt(aColor, ((anAlpha * 255.0) | 0));
                            var aFrame = 0;
                            g.PushColor(aColor);
                            Game.Resources['IMAGE_SM_SHARDS'].mAdditive = true;
                            g.DrawImageCel(Game.Resources['IMAGE_SM_SHARDS'], 0, 0, aFrame);
                            Game.Resources['IMAGE_SM_SHARDS'].mAdditive = false;
                            g.PopColor();
                            g.PopMatrix();
                            break;
                        }
                        case Game.Effect.EFxType.SPARKLE_SHARD:
                        {
                            var anImage = Game.Resources['IMAGE_SPARKLE'];
                            anImage.mAdditive = true;
                            anEffect.mColor = GameFramework.gfx.Color.UInt_AToInt(anEffect.mColor, ((255.0 * anAlpha) | 0));
                            g.PushColor(anEffect.mColor);
                            var aWidth = ((anEffect.mScale * anImage.mPhysCelWidth) | 0);
                            var aHeight = ((anEffect.mScale * anImage.mPhysCelHeight) | 0);
                            g.DrawImageCel(anImage, anEffect.mX - ((aWidth / 2) | 0), anEffect.mY - ((aHeight / 2) | 0), anEffect.mFrame);
                            g.PopColor();
                            anImage.mAdditive = false;
                            break;
                        }
                        case Game.Effect.EFxType.STEAM:
                        {
                            var aColor_2 = GameFramework.gfx.Color.UInt_AToInt(anEffect.mColor, ((255.0 * anAlpha) | 0));
                            var aFrame_2 = anEffect.mFrame;
                            g.PushColor(aColor_2);
                            anEffect.mImage.mAdditive = true;
                            var aMatrix = new GameFramework.geom.Matrix();
                            aMatrix.rotate(anEffect.mAngle);
                            aMatrix.scale(anEffect.mScale, anEffect.mScale);
                            aMatrix.translate(anEffect.mX, anEffect.mY);
                            g.PushMatrix(aMatrix);
                            g.DrawImage(anEffect.mImage.get_CenteredImage(), 0, 0);
                            g.PopMatrix();
                            anEffect.mImage.mAdditive = false;
                            g.PopColor();
                            break;
                        }
                        case Game.Effect.EFxType.GLITTER_SPARK:
                        {
                            break;
                        }
                        case Game.Effect.EFxType.FRUIT_SPARK:
                        {
                            break;
                        }
                        case Game.Effect.EFxType.EMBER_BOTTOM:
                        case Game.Effect.EFxType.EMBER:
                        case Game.Effect.EFxType.EMBER_FADEINOUT_BOTTOM:
                        case Game.Effect.EFxType.EMBER_FADEINOUT:
                        {
                            g.mTempMatrix.a = anEffect.mScale;
                            g.mTempMatrix.b = 0;
                            g.mTempMatrix.c = 0;
                            g.mTempMatrix.d = anEffect.mScale;
                            g.mTempMatrix.tx = anEffect.mX - anEffect.mImage.mWidth / 2.0 * anEffect.mScale;
                            g.mTempMatrix.ty = anEffect.mY - anEffect.mImage.mHeight / 2.0 * anEffect.mScale;
                            g.PushMatrix(g.mTempMatrix);
                            var anEmberAlpha;

                            if(GameFramework.BaseApp.mApp.get_Is3D()) {
                                anEmberAlpha = 0.8 * anAlpha;
                                anEffect.mImage.mAdditive = true;
                            } else {
                                anEmberAlpha = Math.min(1.0, 1.5 * anAlpha);
                                anEffect.mImage.mAdditive = false;
                            }

                            g.PushColor(GameFramework.gfx.Color.UInt_FAToInt(anEffect.mColor, anEmberAlpha));
                            if((anEffect.mType == Game.Effect.EFxType.EMBER_FADEINOUT) || (anEffect.mType == Game.Effect.EFxType.EMBER_FADEINOUT_BOTTOM)) {
                                var aFrame_3 = ((63.99 * anEffect.mAlpha) | 0);
                                g.DrawImageCel(anEffect.mImage, 0, 0, aFrame_3);
                            } else {
                                g.DrawImageCel(anEffect.mImage, 0, 0, anEffect.mFrame);
                            }

                            g.PopColor();
                            g.PopMatrix();
                            break;
                        }
                        case Game.Effect.EFxType.COUNTDOWN_SHARD:
                        {
                            break;
                        }
                        case Game.Effect.EFxType.STEAM_COMET:
                        case Game.Effect.EFxType.SMOKE_PUFF:
                        {
                            g.PushColor(GameFramework.gfx.Color.UInt_AToInt(anEffect.mColor, ((255.0 * anAlpha) | 0)));
                            anEffect.mImage.mAdditive = anEffect.mIsAdditive;
                            var m_2 = new GameFramework.geom.Matrix();
                            m_2.scale(anEffect.mScale, anEffect.mScale);
                            m_2.rotate(anEffect.mAngle);
                            g.PushMatrix(m_2);
                            g.DrawImageCel(anEffect.mImage, anEffect.mX, anEffect.mY, anEffect.mFrame);
                            g.PopMatrix();
                            anEffect.mImage.mAdditive = false;
                            g.PopColor();
                            break;
                        }
                        case Game.Effect.EFxType.DROPLET:
                        {
                            break;
                        }
                        case Game.Effect.EFxType.LIGHT:
                        {
                            break;
                        }
                        case Game.Effect.EFxType.WALL_ROCK:
                        {
                            g.DrawImageCel(anEffect.mImage, anEffect.mX - ((anEffect.mImage.mPhysCelWidth / 2) | 0), anEffect.mY - ((anEffect.mImage.mPhysCelHeight / 2) | 0), anEffect.mFrame);
                            if(anEffect.mColor != GameFramework.gfx.Color.WHITE_RGB) {
                                g.PushColor(anEffect.mColor);
                                anEffect.mImage.mAdditive = true;
                                g.DrawImageCel(anEffect.mImage, anEffect.mX - ((anEffect.mImage.mPhysCelWidth / 2) | 0), anEffect.mY - ((anEffect.mImage.mPhysCelHeight / 2) | 0), anEffect.mFrame);
                                anEffect.mImage.mAdditive = false;
                                g.PopColor();
                            }
                            break;
                        }
                        case Game.Effect.EFxType.QUAKE_DUST:
                        {
                            g.PushColor(GameFramework.gfx.Color.UInt_AToInt(GameFramework.gfx.Color.WHITE_RGB, (anEffect.mAlpha | 0) * 255));
                            g.DrawImage(anEffect.mImage, anEffect.mX, anEffect.mY);
                            g.PopColor();
                            break;
                        }
                        default:
                        {
                            anEffect.Draw(g);
                            break;
                        }
                    }
                    if(aPieceRel != null && anEffect.mType != Game.Effect.EFxType.PI && anEffect.mType != Game.Effect.EFxType.POPANIM && anEffect.mType != Game.Effect.EFxType.TIME_BONUS && anEffect.mType != Game.Effect.EFxType.TIME_BONUS_TOP) {
                        anEffect.mX -= aPieceRel.GetScreenX();
                        anEffect.mY -= aPieceRel.GetScreenY();
                        if((this.mBoard != null) && (this.mBoard.mPostFXManager == this)) {
                            anEffect.mX -= this.mBoard.mSideXOff.GetOutVal();
                        }
                    }
                }
            }
        }
        if((hadOverlays) && (this.mAppState != null)) {
            this.DeferOverlay();
        }
    },
    IsEmpty : function Game_EffectsManager$IsEmpty() {
        return false;
    },
    AllocEffect : function Game_EffectsManager$AllocEffect(theType) {
        var anEffect = new Game.Effect(theType);
        return anEffect;
    },
    FreeEffect : function Game_EffectsManager$FreeEffect(theEffect) {
        if(theEffect != null) {
            theEffect.Dispose();
        }
    },
    GetActiveCount : function Game_EffectsManager$GetActiveCount() {
        var ret = 0;
        for(var i = 0; i < this.mEffects.length; ++i) {
            if(this.mEffects[i] != null) {
                ret += this.mEffects[i].length;
            }
        }
        return ret;
    },
    AddEffect : function Game_EffectsManager$AddEffect(theEffect) {
        if(this.mEffects[(theEffect.mType | 0)] == null) {
            this.mEffects[(theEffect.mType | 0)] = [];
        }
        this.mEffects[(theEffect.mType | 0)].push(theEffect);
        theEffect.mFXManager = this;
    },
    FreePieceEffect : function Game_EffectsManager$FreePieceEffect(thePieceId) {

        {
            var $srcArray4 = this.mEffects;
            for(var $enum4 = 0; $enum4 < $srcArray4.length; $enum4++) {
                var fxArr = $srcArray4[$enum4];
                if(fxArr == null) {
                    continue;
                }
                for(var i = 0; i < fxArr.length;) {
                    if(fxArr[i].mPieceIdRel == thePieceId) {
                        fxArr.removeAt(i);
                    } else {
                        ++i;
                    }
                }
            }
        }
    },
    AddSteamExplosion : function Game_EffectsManager$AddSteamExplosion(theX, theY, theColor) {
        for(var i = 0; i < 30; i++) {
            var anEffect = this.AllocEffect(Game.Effect.EFxType.STEAM);
            var anAngle = GameFramework.Utils.GetRandFloat() * 3.141593;
            var aSpeed = (0.0 + (4.0 * Math.abs(GameFramework.Utils.GetRandFloat())));
            anEffect.mDX = aSpeed * Math.cos(anAngle);
            anEffect.mDY = aSpeed * Math.sin(anAngle);
            anEffect.mX = theX + Math.cos(anAngle) * 25.0;
            anEffect.mY = theY + Math.sin(anAngle) * 25.0;
            anEffect.mIsAdditive = false;
            anEffect.mScale = 0.1 + Math.abs(GameFramework.Utils.GetRandFloat()) * 1.0;
            anEffect.mDScale = 0.02;
            this.AddEffect(anEffect);
        }
        for(var i_2 = 0; i_2 < 30; i_2++) {
            var anEffect_2 = this.AllocEffect(Game.Effect.EFxType.DROPLET);
            var anAngle_2 = GameFramework.Utils.GetRandFloat() * 3.141593;
            var aSpeed_2 = (1.0 + (5.0 * Math.abs(GameFramework.Utils.GetRandFloat())));
            anEffect_2.mDX = aSpeed_2 * Math.cos(anAngle_2);
            anEffect_2.mDY = aSpeed_2 * Math.sin(anAngle_2) + -1.5;
            anEffect_2.mX = theX + Math.cos(anAngle_2) * 25.0;
            anEffect_2.mY = theY + Math.sin(anAngle_2) * 25.0;
            anEffect_2.mIsAdditive = false;
            anEffect_2.mScale = 0.6 + Math.abs(GameFramework.Utils.GetRandFloat()) * 0.2;
            anEffect_2.mDScale = -0.01;
            anEffect_2.mAlpha = 0.6;
            anEffect_2.mColor = 0xaaaacc;
            this.AddEffect(anEffect_2);
        }
        for(var i_3 = 0; i_3 < 6; i_3++) {
            var anEffect_3 = this.AllocEffect(Game.Effect.EFxType.STEAM_COMET);
            var anAngle_3 = i_3 * 3.141593 / 3.0 + GameFramework.Utils.GetRandFloat() * 0.2;
            var aSpeed_3 = (6.0 + (2.0 * Math.abs(GameFramework.Utils.GetRandFloat())));
            anEffect_3.mValue[0] = theX;
            anEffect_3.mValue[1] = theY;
            anEffect_3.mDX = aSpeed_3 * Math.cos(anAngle_3);
            anEffect_3.mDY = aSpeed_3 * Math.sin(anAngle_3);
            anEffect_3.mX = theX + Math.cos(anAngle_3) * 25.0;
            anEffect_3.mY = theY + Math.sin(anAngle_3) * 25.0;
            anEffect_3.mIsAdditive = false;
            anEffect_3.mScale = 2.5 + Math.abs(GameFramework.Utils.GetRandFloat()) * 0.1;
            anEffect_3.mDScale = -0.08;
            this.AddEffect(anEffect_3);
        }
        for(var i_4 = 0; i_4 < 50; i_4++) {
            var anEffect_4 = this.AllocEffect(Game.Effect.EFxType.GEM_SHARD);
            anEffect_4.mColor = theColor.ToInt();
            var aDist = i_4 * (((i_4 + 120) / 120.0) | 0);
            var aRot = i_4 * 0.503 + (Game.Util.Rand() % 100) / 800.0;
            var aSpeed_4 = 1.2 + Math.abs(GameFramework.Utils.GetRandFloat()) * 1.2;
            aRot = GameFramework.Utils.GetRandFloat() * 3.14159;
            aDist = ((GameFramework.Utils.GetRandFloat() * 48.0) | 0);
            anEffect_4.mX = theX + ((1.0 * aDist * Math.cos(aRot)) | 0);
            anEffect_4.mY = theY + ((1.0 * aDist * Math.sin(aRot)) | 0);
            aRot = Math.atan2((anEffect_4.mY - theY), (anEffect_4.mX - theX)) + GameFramework.Utils.GetRandFloat() * 0.3;
            aSpeed_4 = 4.5 + Math.abs(GameFramework.Utils.GetRandFloat()) * 1.5;
            anEffect_4.mDX = Math.cos(aRot) * aSpeed_4;
            anEffect_4.mDY = Math.sin(aRot) * aSpeed_4 + -2.0;
            anEffect_4.mDecel = 0.99 + GameFramework.Utils.GetRandFloat() * 0.005;
            anEffect_4.mAngle = aRot;
            anEffect_4.mDAngle = 0.05 * GameFramework.Utils.GetRandFloat();
            anEffect_4.mGravity = 0.06;
            anEffect_4.mValue[0] = GameFramework.Utils.GetRandFloat() * 3.141593 * 2.0;
            anEffect_4.mValue[1] = GameFramework.Utils.GetRandFloat() * 3.141593 * 2.0;
            anEffect_4.mValue[2] = 0.045 * (3.0 * Math.abs(GameFramework.Utils.GetRandFloat()) + 1.0);
            anEffect_4.mValue[3] = 0.045 * (3.0 * Math.abs(GameFramework.Utils.GetRandFloat()) + 1.0);
            anEffect_4.mDAlpha = -0.0025 * (2.0 * Math.abs(GameFramework.Utils.GetRandFloat()) + 4.0);
            this.AddEffect(anEffect_4);
        }
    },
    Clear : function Game_EffectsManager$Clear() {

        {
            var $srcArray5 = this.mEffects;
            for(var $enum5 = 0; $enum5 < $srcArray5.length; $enum5++) {
                var fxArr = $srcArray5[$enum5];
                if(fxArr == null) {
                    continue;
                }
                for(var i = 0; i < fxArr.length; i++) {
                    var anEffect = fxArr[i];
                    anEffect.Dispose();
                }
            }
        }
        this.mEffects = Array.Create((Game.Effect.EFxType.__COUNT | 0), null);
    }
}
Game.EffectsManager.staticInit = function Game_EffectsManager$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.EffectsManager.registerClass('Game.EffectsManager', GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function() {
    Game.EffectsManager.staticInit();
});