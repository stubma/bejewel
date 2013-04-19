Game.PointsManager = function Game_PointsManager() {
    this.mPointsList = [];
    this.Add_gCycleColors = Array.Create(6, 6, new GameFramework.gfx.Color(255, 0, 0, 255), new GameFramework.gfx.Color(255, 255, 0, 255), new GameFramework.gfx.Color(0, 255, 0, 255), new GameFramework.gfx.Color(0, 255, 255, 255), new GameFramework.gfx.Color(0, 0, 255, 255), new GameFramework.gfx.Color(255, 0, 255, 255));
    Game.PointsManager.initializeBase(this);
    this.mMouseVisible = false;
    this.mOverlayLevel = 1;
}
Game.PointsManager.prototype = {
    mPointsList : null,
    mOverlayLevel : 0,
    Add_gCycleColors : null,
    Update : function Game_PointsManager$Update() {
        for(var i = 0; i < this.mPointsList.length;) {
            var aPoints = this.mPointsList[i];
            if(aPoints.mState == Game.Points.EState.VERT_SHIFTING) {
            }
            aPoints.Update();
            if(aPoints.mDeleteMe) {
                this.mPointsList.removeAt(i);
            } else {
                ++i;
            }
        }
    },
    Add : function Game_PointsManager$Add(theX, theY, thePoints, theColor, theId, usePointMultiplier, theMoveCreditId, theForceAdd) {
        if(thePoints <= 0 && !theForceAdd) {
            return null;
        }
        var aMultiplier = Game.BejApp.mBejApp.mBoard.mPointMultiplier * Game.BejApp.mBejApp.mBoard.GetModePointMultiplier();
        if(!usePointMultiplier) {
            aMultiplier = 1.0;
        }
        var aNewPoints = null;
        var anOrigPoints = thePoints;
        var i;
        thePoints = ((thePoints * aMultiplier) | 0);
        if(theX >= 0 && theY >= 0) {
            var aLowScore = 50;
            var aHighScore = 1000;
            var aLowScale = 0.6;
            var aHighScale = 1.0;
            var aLife = 1.0;
            var theDispPoints = thePoints;
            var aScalePoints = anOrigPoints;
            var aCorrectedPoints = ((aScalePoints * Math.pow(Game.BejApp.mBejApp.mBoard.mPointMultiplier, 0.45)) | 0);
            if(theId != -1) {
                for(i = 0; i < this.mPointsList.length; i++) {
                    var aPoints = this.mPointsList[i];
                    if(aPoints.mId == theId) {
                        aPoints.mState = Game.Points.EState.RISING;
                        aPoints.mAlpha = 1.0;
                        aPoints.mValue += thePoints;
                        aPoints.mDestScale = Math.min(aHighScale, aPoints.mDestScale + 0.05);
                        aPoints.mTimer = aLife;
                        aNewPoints = aPoints;
                        theDispPoints = aPoints.mValue;
                        aCorrectedPoints += aPoints.mCorrectedPoints;
                        aScalePoints += aPoints.mScalePoints;
                        break;
                    }
                }
            }
            var aString = GameFramework.Utils.ToString(theDispPoints);
            var aScoreDiff = aHighScore - aLowScore;
            var aScaleDiff = aHighScale - aLowScale;
            var aRatio = Math.max(0.0, Math.min(1.0, (aScalePoints - aLowScore) / aHighScore));
            var aCorrectedRatio = Math.max(0.0, Math.min(1.0, (aCorrectedPoints - aLowScore) / aHighScore));
            var aScale = aLowScale + Math.min(1.0, aRatio * 2.0) * aScaleDiff;
            theY = ((Math.max(theY, 120)) | 0);
            if(aNewPoints == null && Game.Resources['FONT_FLOATERS'] != null) {
                var aMode = -1;
                aNewPoints = new Game.Points(Game.BejApp.mBejApp, Game.Resources['FONT_FLOATERS'], aString, theX, theY, aLife, 0, theColor, aMode);
                aNewPoints.mMoveCreditId = theMoveCreditId;
                aNewPoints.mId = theId;
                aNewPoints.mDestScale = aScale;
                aNewPoints.mScaleDifMult = 0.15;
                aNewPoints.mScaleDampening = 0.46 + (aScalePoints * 0.0015);
                if(aNewPoints.mScaleDampening > 0.962) {
                    aNewPoints.mScaleDampening = 0.962;
                }
                aNewPoints.mValue = thePoints;
                this.mPointsList.push(aNewPoints);
            } else if(aNewPoints != null) {
                aNewPoints.mString = aString;
                aNewPoints.RestartWobble();
                if(!aNewPoints.mDrawn) {
                    aNewPoints.mX = (theX + aNewPoints.mX) / 2;
                    aNewPoints.mY = (theY + aNewPoints.mY) / 2;
                }
            }
            aNewPoints.mColor = theColor;
            aNewPoints.mColorCycle[0].mCycleColors.clear();
            aNewPoints.mColorCycle[1].mCycleColors.clear();
            for(i = 0; i < 6; i++) {
                for(var aLayer = 0; aLayer < 3; aLayer++) {
                    var aLightness = 0;
                    var anAlpha = 0;
                    var aColorPct = 0;
                    var anInnerRatio = 0;
                    if(aLayer == 0) {
                        aColorPct = Math.min(1.0, Math.max(0.0, (aCorrectedRatio - 0.3) * 2.0));
                        anInnerRatio = Math.max(0.0, aCorrectedRatio - 0.5);
                        aLightness = (i % 2 == 0) ? 0.5 : (0.5 + anInnerRatio * 1.0);
                        anAlpha = 1.0;
                    } else if(aLayer == 1) {
                        aColorPct = Math.min(1.0, Math.max(0.0, (aCorrectedRatio - 0.3) * 2.0));
                        anInnerRatio = Math.max(0.0, aCorrectedRatio - 0.1);
                        aLightness = (i % 2 == 0) ? 0.5 : (0.5 + anInnerRatio * 1.0);
                        anAlpha = Math.max(0, (aCorrectedRatio - 0.5) * 3.0);
                    } else if(aLayer == 2) {
                        aColorPct = Math.min(1.0, Math.max(0.0, (aCorrectedRatio - 1.0) * 1.0));
                        aLightness = 1.0;
                        anAlpha = 0.7;
                    }
                    var aColor = GameFramework.gfx.Color.CreateFromInt(theColor);
                    aNewPoints.mColorCycle[aLayer].mCycleColors.push(GameFramework.gfx.Color.RGBAToInt((((this.Add_gCycleColors[i].mRed * aColorPct) + Math.min(255, aColor.mRed * aLightness * (1.0 - aColorPct))) | 0), (((this.Add_gCycleColors[i].mGreen * aColorPct) + Math.min(255, aColor.mGreen * aLightness * (1.0 - aColorPct))) | 0), (((this.Add_gCycleColors[i].mBlue * aColorPct) + Math.min(255, aColor.mBlue * aLightness * (1.0 - aColorPct))) | 0), ((anAlpha * 255) | 0)));
                }
            }
            aNewPoints.mColorCycle[0].SetPosition(0.25);
            aNewPoints.mColorCycle[1].SetPosition(0.75);
            aNewPoints.mColorCycling = true;
            aNewPoints.mCorrectedPoints = aCorrectedPoints;
            aNewPoints.mScalePoints = aScalePoints;
            aNewPoints.mWobbleScale = aRatio * 0.7;
            aNewPoints.mColor = 0xffffff | ((((255.0 * Math.min(1.0, 0.75 + aCorrectedRatio * 0.0)) | 0)) << 24);
            aNewPoints.mTimer = 0.6 + aRatio * 1.6;
            if(aNewPoints != null) {
                aNewPoints.mScale = aNewPoints.mDestScale * 0.1;
            }
        }
        return aNewPoints;
    },
    Find : function Game_PointsManager$Find(theId) {
        for(var i = 0; i < this.mPointsList.length; i++) {
            var aPoints = this.mPointsList[i];
            if(aPoints.mId == theId) {
                return aPoints;
            }
        }
        return null;
    },
    DrawOverlay : function Game_PointsManager$DrawOverlay(g) {

        {
            var $srcArray1 = this.mPointsList;
            for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
                var aPoints = $srcArray1[$enum1];
                aPoints.Draw(g);
            }
        }
    }
}
Game.PointsManager.staticInit = function Game_PointsManager$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.PointsManager.registerClass('Game.PointsManager', GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function() {
    Game.PointsManager.staticInit();
});