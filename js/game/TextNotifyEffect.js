/**
 * @constructor
 */
Game.TextNotifyEffect = function Game_TextNotifyEffect() {
    Game.TextNotifyEffect.initializeBase(this, [Game.Effect.EFxType.CUSTOMCLASS]);
    this.mUpdateCnt = 0;
    this.mDuration = 200;
    this.mFont = Game.Resources['FONT_HUGE'];
    this.mDAlpha = 0;
    this.Draw_cvScaleIn = new GameFramework.CurvedVal().SetCurve('b+0,1.3,0,0.2,#6g<     8~###    ii###');
    this.Draw_cvScaleOut = new GameFramework.CurvedVal().SetCurve('b+0,1,0,0.2,~###         ~#>Hu');
}
Game.TextNotifyEffect.prototype = {
    mText : null,
    mUpdateCnt : 0,
    mDuration : 0,
    mFont : null,
    Draw_cvScaleIn : null,
    Draw_cvScaleOut : null,
    Draw : function Game_TextNotifyEffect$Draw(g) {
        {
            var scale = 1.0;
            var secStart = this.mUpdateCnt / 100.0;
            var secEnd = (this.mUpdateCnt - (this.mDuration - ((this.Draw_cvScaleOut.mInMax * 100) | 0))) / 100.0;
            if(secStart < this.Draw_cvScaleIn.mInMax) {
                scale = this.Draw_cvScaleIn.GetOutValAt(secStart);
            } else if(secEnd > 0.0) {
                scale = this.Draw_cvScaleOut.GetOutValAt(secEnd);
            }
            if(Math.abs(scale - 1.0) > 0.005) {
            }
        }
    },
    Update : function Game_TextNotifyEffect$Update() {
        if(this.mDelay > 0) {
            --this.mDelay;
            return;
        }
        ++this.mUpdateCnt;
        if(this.mUpdateCnt < 0) {
            return;
        }
        if(this.mUpdateCnt >= this.mDuration) {
            this.mDeleteMe = true;
        }
    }
}
Game.TextNotifyEffect.staticInit = function Game_TextNotifyEffect$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.TextNotifyEffect.registerClass('Game.TextNotifyEffect', Game.Effect);
});
JSFExt_AddStaticInitFunc(function() {
    Game.TextNotifyEffect.staticInit();
});