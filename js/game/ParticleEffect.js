Game.ParticleEffect = function Game_ParticleEffect(thePIEffect) {
    Game.ParticleEffect.initializeBase(this, [Game.Effect.EFxType.PI]);
    this.mPIEffect = thePIEffect.Duplicate();
    this.mDoDrawTransform = false;
    this.mDAlpha = 0;
    this.mIsFirstUpdate = true;
};
Game.ParticleEffect.prototype = {
    mPIEffect: null,
    mIsFirstUpdate: null,
    mDoDrawTransform: null,
    Dispose: function Game_ParticleEffect$Dispose() {
        Game.Effect.prototype.Dispose.apply(this);
        this.mPIEffect.Dispose();
        this.mPIEffect = null;
    },
    Update: function Game_ParticleEffect$Update() {
        Game.Effect.prototype.Update.apply(this);
        var trans = new GameFramework.geom.Matrix();
        trans.scale(this.mScale, this.mScale);
        trans.rotate(this.mAngle);
        var aPieceRel = null;
        if (this.mPieceIdRel != -1) {
            if (this.mFXManager.mBoard != null) {
                aPieceRel = this.mFXManager.mBoard.GetPieceById(this.mPieceIdRel);
            }
            if (aPieceRel == null) {
                this.Stop();
                this.mPieceIdRel = -1;
            }
        }
        if (aPieceRel != null) {
            this.mX = aPieceRel.CX();
            this.mY = aPieceRel.CY();
            if (this.mFXManager.mBoard != null) {
                this.mX += Game.DM.UI_SLIDE_RIGHT * this.mFXManager.mBoard.mSlideUIPct.get_v();
            }
            if (this.mFXManager.mBoard != null && this.mFXManager.mBoard.mPostFXManager == this.mFXManager) {
                this.mX += this.mFXManager.mBoard.mSideXOff.get_v();
            }
            if (aPieceRel.mHidePct > 0) {
                this.mPIEffect.mColor = GameFramework.gfx.Color.Mult(
                    this.mPIEffect.mColor,
                    GameFramework.gfx.Color.RGBAToInt(255, 255, 255, (255 - aPieceRel.mHidePct * 255) | 0)
                );
            }
        }
        trans.translate(this.mX, this.mY);
        if (this.mDoDrawTransform) {
            trans.scale(1.0, 1.0);
            this.mPIEffect.mDrawTransform = trans;
        } else {
            this.mPIEffect.mDrawTransform.identity();
            this.mPIEffect.mEmitterTransform = trans;
        }
        if (this.mIsFirstUpdate) {
            this.mPIEffect.ResetAnim();
            this.mIsFirstUpdate = false;
        } else {
            this.mPIEffect.Update();
        }
        if (!this.mPIEffect.IsActive()) {
            this.mDeleteMe = true;
        }
    },
    Draw: function Game_ParticleEffect$Draw(g) {
        if (this.mIsFirstUpdate) {
            return;
        }
        this.mPIEffect.mColor = GameFramework.gfx.Color.FAlphaToInt(this.mFXManager.mAlpha * this.mAlpha);
        this.mPIEffect.Draw(g);
    },
    SetEmitAfterTimeline: function Game_ParticleEffect$SetEmitAfterTimeline(emitAfterTimeline) {
        this.mPIEffect.mEmitAfterTimeline = emitAfterTimeline;
    },
    SetLineEmitterPoint: function Game_ParticleEffect$SetLineEmitterPoint(
        theLayerIdx,
        theEmitterIdx,
        thePointIdx,
        theKeyFrame,
        thePoint
    ) {
        var aLayer = this.mPIEffect.GetLayer(theLayerIdx);
        if (aLayer == null) {
            return false;
        }
        var anEmitter = aLayer.GetEmitter(theEmitterIdx);
        if (anEmitter == null) {
            return false;
        }
        if (anEmitter.mEmitterInstanceDef.mEmitterGeom != GameFramework.resources.PIEmitterInstanceDef.Geom.LINE) {
            return false;
        }
        if (thePointIdx >= (anEmitter.mEmitterInstanceDef.mPoints.length | 0)) {
            return false;
        }
        if (theKeyFrame >= (anEmitter.mEmitterInstanceDef.mPoints[thePointIdx].mValuePoint2DVector.length | 0)) {
            return false;
        }
        anEmitter.mEmitterInstanceDef.mPoints[thePointIdx].mValuePoint2DVector[theKeyFrame].mValue =
            new GameFramework.geom.TPoint(thePoint.x, thePoint.y);
        return true;
    },
    SetEmitterTint: function Game_ParticleEffect$SetEmitterTint(theLayerIdx, theEmitterIdx, theColor) {
        var aLayer = this.mPIEffect.GetLayer(theLayerIdx);
        if (aLayer == null) {
            return false;
        }
        var anEmitter = aLayer.GetEmitter(theEmitterIdx);
        if (anEmitter == null) {
            return false;
        }
        anEmitter.mTintColor = theColor;
        return true;
    },
    Stop: function Game_ParticleEffect$Stop() {
        this.SetEmitAfterTimeline(false);
        if (this.mPIEffect.mFrameNum < this.mPIEffect.mLastFrameNum - 1) {
            this.mPIEffect.mFrameNum = this.mPIEffect.mLastFrameNum - 1;
        }
    },
    GetLayer: function Game_ParticleEffect$GetLayer(theIdx) {
        return this.mPIEffect.GetLayer(theIdx);
    },
    GetLayer$2: function Game_ParticleEffect$GetLayer$2(theName) {
        return this.mPIEffect.GetLayer$2(theName);
    },
};
Game.ParticleEffect.staticInit = function Game_ParticleEffect$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.ParticleEffect.registerClass("Game.ParticleEffect", Game.Effect);
});
JSFExt_AddStaticInitFunc(function () {
    Game.ParticleEffect.staticInit();
});
