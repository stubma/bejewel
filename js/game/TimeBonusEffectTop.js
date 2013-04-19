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

JSFExt_AddInitFunc(function() {
	Game.TimeBonusEffectTop.registerClass('Game.TimeBonusEffectTop', Game.Effect);
});
JSFExt_AddStaticInitFunc(function() {
	Game.TimeBonusEffectTop.staticInit();
});