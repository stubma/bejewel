/**
 * @constructor
 */
Game.ScalingIconButton = function Game_ScalingIconButton() {
    Game.ScalingIconButton.initializeBase(this);
}
Game.ScalingIconButton.prototype = {
    mImageDisabledOverlay : null,
    mImageDisabledOverlayOffsetX : 0.0,
    mImageDisabledOverlayOffsetY : 0.0,
    mScale : 1.0,
    mScaleRate : 0.035,
    mMouseOverMaxScale : 1.25,
    Draw : function Game_ScalingIconButton$Draw(g) {
        if(this.mIsOver && this.mScale < this.mMouseOverMaxScale) {
            this.mScale = Math.min(this.mMouseOverMaxScale, this.mScale + this.mScaleRate);
        } else if(!this.mIsOver && this.mScale > 1.0) {
            this.mScale = Math.max(1.0, this.mScale - this.mScaleRate);
        }
        var _t1 = g.PushScale(this.mScale, this.mScale, this.mWidth / 2, this.mHeight / 2);
        try {
            Game.IconButton.prototype.Draw.apply(this, [g]);
            if(!this.mEnabled && this.mImageDisabledOverlay != null) {
                g.DrawImage(this.mImageDisabledOverlay, this.mImageDisabledOverlayOffsetX, this.mImageDisabledOverlayOffsetY);
            }
        } finally {
            _t1.Dispose();
        }
    }
}
Game.ScalingIconButton.staticInit = function Game_ScalingIconButton$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.ScalingIconButton.registerClass('Game.ScalingIconButton', Game.IconButton);
});
JSFExt_AddStaticInitFunc(function() {
    Game.ScalingIconButton.staticInit();
});