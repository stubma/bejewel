Game.PopAnimEffect = function Game_PopAnimEffect(thePopAnim) {
    Game.PopAnimEffect.initializeBase(this, [Game.Effect.EFxType.POPANIM]);
    this.mPopAnim = thePopAnim.Duplicate();
    this.mDAlpha = 0;
    this.mDoubleSpeedPopAnim = true;
}
Game.PopAnimEffect.prototype = {
    mPopAnim : null,
    mDoubleSpeedPopAnim : null,
    Dispose : function Game_PopAnimEffect$Dispose() {
        if(this.mPopAnim != null) {
            this.mPopAnim.Dispose();
        }
        Game.Effect.prototype.Dispose.apply(this);
    },
    Play : function Game_PopAnimEffect$Play() {
        this.mPopAnim.Play();
    },
    Play$2 : function Game_PopAnimEffect$Play$2(theComposition) {
        this.mPopAnim.Play(theComposition);
    },
    Update : function Game_PopAnimEffect$Update() {
        Game.Effect.prototype.Update.apply(this);
        var aScale = this.mScale;
        var aWidth = this.mPopAnim.mWidth * aScale;
        var aHeight = this.mPopAnim.mHeight * aScale;
        var trans = new GameFramework.geom.Matrix();
        trans.scale(aScale, aScale);
        trans.translate(-aWidth / 2, -aHeight / 2);
        trans.rotate(this.mAngle);
        trans.translate(aWidth / 2, aHeight / 2);
        var aPieceRel = null;
        if(this.mPieceIdRel != -1) {
            if(this.mFXManager.mBoard != null) {
                aPieceRel = this.mFXManager.mBoard.GetPieceById(this.mPieceIdRel);
            }
            if(aPieceRel == null) {
                this.Stop();
                this.mPieceIdRel = -1;
            }
        }
        if(aPieceRel != null) {
            this.mX = aPieceRel.CX();
            this.mY = aPieceRel.CY();
            if(this.mFXManager.mBoard != null) {
                this.mX += Game.DM.UI_SLIDE_RIGHT * this.mFXManager.mBoard.mSlideUIPct.get_v();
            }
        }
        trans.translate(this.mX - aWidth / 2, this.mY - aHeight / 2);
        this.mPopAnim.mTransform = trans;
        this.mPopAnim.Update();
        if(this.mDoubleSpeedPopAnim) {
            this.mPopAnim.Update();
        }
        if(!this.mPopAnim.IsActive()) {
            this.mDeleteMe = true;
        }
    },
    Draw : function Game_PopAnimEffect$Draw(g) {
        this.mPopAnim.mColor = GameFramework.gfx.Color.FAlphaToInt(this.mFXManager.mAlpha);
        this.mPopAnim.Draw(g);
    },
    Stop : function Game_PopAnimEffect$Stop() {
    }
}
Game.PopAnimEffect.staticInit = function Game_PopAnimEffect$staticInit() {
}

JS_AddInitFunc(function() {
    Game.PopAnimEffect.registerClass('Game.PopAnimEffect', Game.Effect);
});
JS_AddStaticInitFunc(function() {
    Game.PopAnimEffect.staticInit();
});