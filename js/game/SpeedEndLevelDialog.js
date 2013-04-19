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

JSFExt_AddInitFunc(function() {
	Game.SpeedEndLevelDialog.registerClass('Game.SpeedEndLevelDialog', Game.EndLevelDialog);
});
JSFExt_AddStaticInitFunc(function() {
	Game.SpeedEndLevelDialog.staticInit();
});