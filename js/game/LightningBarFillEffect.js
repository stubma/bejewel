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