/**
 * @constructor
 */
Game.LightningStorm = function Game_LightningStorm(theBoard, thePiece, theType) {
    this.mZaps = [];
    this.mLightningVector = [];
    this.mPieceIds = [];
    this.mElectrocutedCelVector = [];
    this.mNovaScale = new GameFramework.CurvedVal();
    this.mNovaAlpha = new GameFramework.CurvedVal();
    this.mNukeScale = new GameFramework.CurvedVal();
    this.mNukeAlpha = new GameFramework.CurvedVal();
    this.mLightingAlpha = new GameFramework.CurvedVal();
    this.mBoard = theBoard;
    this.mUpdateCnt = 0;
    this.mLightningCount = 1;
    this.mGemAlpha = 1.0;
    this.mMatchType = thePiece.mColor;
    this.mPieceIds.push(thePiece.mId);
    this.mDoneDelay = 0;
    this.mLastElectroSound = 0;
    this.mStartPieceFlags = thePiece.mFlags;
    this.mMoveCreditId = thePiece.mMoveCreditId;
    this.mMatchId = thePiece.mMatchId;
    this.mExplodeTimer = 0.0;
    if(thePiece.IsFlagSet(Game.Piece.EFlag.FLAME)) {
        this.mNovaScale.SetCurve('b+0,1.5,0.013333,1,#4I(         ~~P##');
        this.mNovaAlpha.SetCurveLinked('b+0,1,0,1,####    e~###     <####', this.mNovaScale);
        this.mNukeScale.SetCurve('b+0,2,0.006667,1,####   ^X### bX### S~###   /####');
        this.mNukeAlpha.SetCurveLinked('b+0,1,0,1,#### o~###     Y}###  V####', this.mNukeScale);
        this.mStormType = Game.LightningStorm.EStormType.FLAMING;
    } else {
        this.mStormType = theType;
    }
    this.mElectrocuterId = thePiece.mId;
    this.mCX = (thePiece.CX() | 0) - this.mBoard.GetBoardX();
    this.mCY = (thePiece.CY() | 0) - this.mBoard.GetBoardY();
    this.mOriginCol = thePiece.mCol;
    this.mOriginRow = thePiece.mRow;
    thePiece.mIsElectrocuting = true;
    if(this.mStormType != Game.LightningStorm.EStormType.HYPERCUBE) {
        thePiece.mElectrocutePercent = 0.9;
    }
    this.mColor = Game.DM.EGemColor._INVALID;
    this.mTimer = 0;
    this.mDist = 0;
    this.mHoldDelay = 1.0;
    this.mStormLength = (this.mStormType == Game.LightningStorm.EStormType.SHORT) ? (3) : (7);
    if(this.mStormType != Game.LightningStorm.EStormType.HYPERCUBE) {
        for(var anOffset = ((this.mStormType == Game.LightningStorm.EStormType.FLAMING) ? -1 : 0); anOffset <= ((this.mStormType == Game.LightningStorm.EStormType.FLAMING) ? 1 : 0); anOffset++) {
            var aRow = this.mBoard.GetRowAt((thePiece.mY | 0) + ((Game.Board.GEM_HEIGHT / 2) | 0) + anOffset * Game.Board.GEM_HEIGHT);
            if((aRow >= 0) && (aRow < this.mBoard.mRowCount) && (this.mStormType != Game.LightningStorm.EStormType.VERT)) {
                var aZap = new Game.LightningZap(this.mBoard, ((Math.max(0, this.mCX - this.mStormLength * Game.Board.GEM_WIDTH - ((Game.Board.GEM_WIDTH / 2) | 0))) | 0), (thePiece.mY | 0) + ((Game.Board.GEM_HEIGHT / 2) | 0) + anOffset * Game.Board.GEM_HEIGHT, ((Math.min(this.mBoard.GetColX(this.mBoard.mColCount), this.mCX + this.mStormLength * Game.Board.GEM_WIDTH + ((Game.Board.GEM_WIDTH / 2) | 0))) | 0), (thePiece.mY | 0) + ((Game.Board.GEM_HEIGHT / 2) | 0) + anOffset * Game.Board.GEM_HEIGHT, Game.DM.gElectColors[(this.mMatchType | 0) + 1], (10.0), this.mStormType == Game.LightningStorm.EStormType.FLAMING);
                this.mZaps.push(aZap);
            }
            var aCol = this.mBoard.GetColAt((thePiece.mX | 0) + ((Game.Board.GEM_WIDTH / 2) | 0) + anOffset * Game.Board.GEM_WIDTH);
            if((aCol >= 0) && (aCol < this.mBoard.mColCount) && (this.mStormType != Game.LightningStorm.EStormType.HORZ)) {
                var aZap_2 = new Game.LightningZap(this.mBoard, (thePiece.mX | 0) + ((Game.Board.GEM_WIDTH / 2) | 0) + anOffset * Game.Board.GEM_WIDTH, ((Math.max(0, this.mCY - this.mStormLength * Game.Board.GEM_HEIGHT - ((Game.Board.GEM_HEIGHT / 2) | 0))) | 0), (thePiece.mX | 0) + ((Game.Board.GEM_WIDTH / 2) | 0) + anOffset * Game.Board.GEM_WIDTH, ((Math.min(this.mBoard.GetRowY(this.mBoard.mRowCount), this.mCY + this.mStormLength * Game.Board.GEM_HEIGHT + ((Game.Board.GEM_HEIGHT / 2) | 0))) | 0), Game.DM.gElectColors[(this.mMatchType | 0) + 1], 10.0, this.mStormType == Game.LightningStorm.EStormType.FLAMING);
                this.mZaps.push(aZap_2);
            }
        }
        this.mLightingAlpha.SetCurve('b;0,1,0.00885,1,####oCh;uZV###X^8.tQ<###Uqh*Kzk###QG###R~###hI###u~### $#### 2y### *####');
    } else {
        if((thePiece != null) && (thePiece.mColor == Game.DM.EGemColor.HYPERCUBE)) {
            thePiece.mDestructing = true;
        }
    }
}
Game.LightningStorm.prototype = {
    mBoard : null,
    mCX : 0,
    mCY : 0,
    mUpdateCnt : 0,
    mColor : null,
    mStormLength : 0,
    mLastElectroSound : 0,
    mStartPieceFlags : 0,
    mMatchType : null,
    mLightningCount : 0,
    mStormType : null,
    mExplodeTimer : 0,
    mHoldDelay : 0,
    mElectrocuterId : 0,
    mMoveCreditId : 0,
    mMatchId : 0,
    mOriginCol : 0,
    mOriginRow : 0,
    mDist : 0,
    mTimer : 0,
    mZaps : null,
    mLightningVector : null,
    mPieceIds : null,
    mElectrocutedCelVector : null,
    mParams : null,
    mNovaScale : null,
    mNovaAlpha : null,
    mNukeScale : null,
    mNukeAlpha : null,
    mLightingAlpha : null,
    mGemAlpha : 0,
    mDoneDelay : 0,
    AddLightning : function Game_LightningStorm$AddLightning(theStartX, theStartY, theEndX, theEndY) {
        var aLightning = new Game.Lightning();
        aLightning.mPercentDone = 0.0;
        var aYDiff = (theEndY - theStartY);
        var aXDiff = (theEndX - theStartX);
        var aRot = Math.atan2(aYDiff, aXDiff);
        var aDist = Math.sqrt(aXDiff * aXDiff + aYDiff * aYDiff);
        aLightning.mPullX = Math.cos(aRot - 3.14159 / 2) * aDist * 0.4;
        aLightning.mPullY = Math.sin(aRot - 3.14159 / 2) * aDist * 0.4;
        for(var aLightningPointNum = 0; aLightningPointNum < Game.LightningStorm.NUM_LIGTNING_POINTS; aLightningPointNum++) {
            var aDistAlong = aLightningPointNum / (Game.LightningStorm.NUM_LIGTNING_POINTS - 1);
            var aCenterX = (theStartX * (1.0 - aDistAlong)) + (theEndX * aDistAlong);
            var aCenterY = (theStartY * (1.0 - aDistAlong)) + (theEndY * aDistAlong);
            var aPoint = new GameFramework.geom.TIntPoint(0, 0);
            aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum) + 0] = aPoint;
            var aPointR = new GameFramework.geom.TIntPoint(0, 0);
            aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum) + 1] = aPointR;
            aPoint.x = (aCenterX | 0);
            aPoint.y = (aCenterY | 0);
            aPointR.x = (aCenterX | 0);
            aPointR.y = (aCenterY | 0);
        }
        this.mLightningVector.push(aLightning);
    },
    UpdateLightning : function Game_LightningStorm$UpdateLightning() {
        if(this.mDoneDelay > 0) {
            return;
        }
        var wantsCalm = this.mBoard.WantsCalmEffects();
        var anElectrocutedPieces = Array.Create(64, null);
        var aNumElectrocutedPieces = 0;
        var anElectrocuterPieces = Array.Create(64, null);
        var aNumElectrocuterPieces = 0;
        var aMatchingPieces = Array.Create(64, null);
        var aNumMatchingPieces = 0;
        var hadWildcardEffect = false;
        var hasExplodingPieces = false;
        for(var aRow = 0; aRow < 8; aRow++) {
            for(var aCol = 0; aCol < 8; aCol++) {
                var aPiece = this.mBoard.mBoard[this.mBoard.mBoard.mIdxMult0 * (aRow) + aCol];
                if(aPiece != null) {
                    if(aPiece.mExplodeDelay > 0) {
                        hasExplodingPieces = true;
                    }
                    if(aPiece.mIsElectrocuting) {
                        if(wantsCalm) {
                            if(aPiece.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) {
                                aPiece.mElectrocutePercent += (0.0075);
                            } else {
                                aPiece.mElectrocutePercent += (0.01);
                            }
                        } else {
                            if(aPiece.IsFlagSet(Game.Piece.EFlag.HYPERCUBE)) {
                                aPiece.mElectrocutePercent += (0.01) * 1.67;
                            } else {
                                aPiece.mElectrocutePercent += 0.015 * 1.67;
                            }
                        }
                        if(aPiece.mElectrocutePercent > 1.0) {
                            this.mBoard.SetMoveCredit(aPiece, this.mMoveCreditId);
                            aPiece.mExplodeSourceId = this.mElectrocuterId;
                            var aSrcPiece = this.mBoard.GetPieceById(this.mElectrocuterId);
                            aPiece.mExplodeSourceFlags |= this.mStartPieceFlags;
                            if(!this.mBoard.TriggerSpecialEx(aPiece, this.mBoard.GetPieceById(this.mElectrocuterId))) {
                                aPiece.mExplodeDelay = 1;
                            }
                        } else {
                            if(aPiece.mElectrocutePercent < 0.04) {
                                anElectrocuterPieces[aNumElectrocuterPieces++] = aPiece;
                            }
                            anElectrocutedPieces[aNumElectrocutedPieces++] = aPiece;
                        }
                    } else if((aPiece.mColor == this.mColor || this.mColor == Game.DM.EGemColor.HYPERCUBE) && aPiece.GetScreenY() > -Game.Board.GEM_HEIGHT && !aPiece.IsFlagSet(Game.Piece.EFlag.DIG) && !aPiece.IsFlagSet(Game.Piece.EFlag.DETONATOR) && !aPiece.IsFlagSet(Game.Piece.EFlag.SCRAMBLE)) {
                        aMatchingPieces[aNumMatchingPieces++] = aPiece;
                    }
                }
            }
        }
        var aRandIdx = ((((((20 / (aNumElectrocutedPieces + 1)) | 0)) + 5) / 1.67) | 0);
        if(wantsCalm) {
            aRandIdx = ((aRandIdx * (1.4)) | 0);
        }
        if((this.mColor | 0) == -1) {
            aRandIdx = ((aRandIdx) / (2)) | 0;
        }
        if((aNumMatchingPieces > 0) && ((this.mLightningVector.length == 0) || (this.mBoard.mRand.Next() % aRandIdx == 0))) {
            var aNewPiece = null;
            var anElectrocuter = null;
            if(aNumElectrocuterPieces > 0) {
                anElectrocuter = anElectrocuterPieces[this.mBoard.mRand.Next() % aNumElectrocuterPieces];
            } else if(aNumElectrocutedPieces > 0) {
                anElectrocuter = anElectrocutedPieces[this.mBoard.mRand.Next() % aNumElectrocutedPieces];
            }
            if(anElectrocuter != null) {
                var aClosestDist = 0x7fffffff;
                for(var aCheckPieceIdx = 0; aCheckPieceIdx < aNumMatchingPieces; aCheckPieceIdx++) {
                    var aCheckPiece = aMatchingPieces[aCheckPieceIdx];
                    var aDist = (Math.min(Math.abs(aCheckPiece.mCol - anElectrocuter.mCol), Math.abs(aCheckPiece.mRow - anElectrocuter.mRow)) | 0);
                    if(aDist < aClosestDist) {
                        aNewPiece = aCheckPiece;
                    }
                }
                var aRot = Math.atan2(aNewPiece.mY - anElectrocuter.mY, aNewPiece.mX - anElectrocuter.mX);
                this.AddLightning((aNewPiece.mX | 0) + ((Game.Board.GEM_WIDTH / 2) | 0), (aNewPiece.mY | 0) + ((Game.Board.GEM_HEIGHT / 2) | 0), (anElectrocuter.mX | 0) + ((Game.Board.GEM_WIDTH / 2) | 0), (anElectrocuter.mY | 0) + ((Game.Board.GEM_HEIGHT / 2) | 0));
                if((this.mUpdateCnt - this.mLastElectroSound >= (20)) || (this.mLastElectroSound == 0)) {
                    if(wantsCalm) {
                        Game.SoundUtil.PlayEx(Game.Resources['SOUND_ELECTRO_PATH2'], (0), (0.67));
                    } else {
                        Game.SoundUtil.Play(Game.Resources['SOUND_ELECTRO_PATH2']);
                    }
                    this.mLastElectroSound = 0;
                }
            } else {
                aNewPiece = aMatchingPieces[this.mBoard.mRand.Next() % aNumMatchingPieces];
            }
            aNewPiece.mIsElectrocuting = true;
        }
        for(var aLightningNum = 0; aLightningNum < (this.mLightningVector.length | 0); aLightningNum++) {
            var aLightning = this.mLightningVector[aLightningNum];
            aLightning.mPercentDone += 0.012 * 1.67;
            if(aLightning.mPercentDone > 1.0) {
                this.mLightningVector.removeAt(aLightningNum);
                aLightningNum--;
                continue;
            }
            var aPullFactor = Math.max(0.0, 1.0 - ((1.0 - aLightning.mPercentDone) * 3.0));
            if(((wantsCalm) && (this.mUpdateCnt % (5) == 0)) || ((!wantsCalm) && (this.mUpdateCnt % 2 == 0))) {
                var aStartX = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (0) + 0].x;
                var aStartY = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (0) + 0].y;
                var anEndX = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (Game.LightningStorm.NUM_LIGTNING_POINTS - 1) + 0].x;
                var anEndY = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (Game.LightningStorm.NUM_LIGTNING_POINTS - 1) + 0].y;
                for(var aLightningPointNum = 0; aLightningPointNum < Game.LightningStorm.NUM_LIGTNING_POINTS; aLightningPointNum++) {
                    var aDistAlong = aLightningPointNum / (Game.LightningStorm.NUM_LIGTNING_POINTS - 1);
                    var aCenterMult = 1.0 - Math.abs(1.0 - aDistAlong * 2.0);
                    var aCenterX = (aStartX * (1.0 - aDistAlong)) + (anEndX * aDistAlong) + aCenterMult * (GameFramework.Utils.GetRandFloat() * 40.0 + aPullFactor * aLightning.mPullX);
                    var aCenterY = (aStartY * (1.0 - aDistAlong)) + (anEndY * aDistAlong) + aCenterMult * (GameFramework.Utils.GetRandFloat() * 40.0 + aPullFactor * aLightning.mPullY);
                    if(wantsCalm) {
                        aCenterX = (aStartX * (1.0 - aDistAlong)) + (anEndX * aDistAlong) + aCenterMult * (GameFramework.Utils.GetRandFloat() * 15.0 + aPullFactor * aLightning.mPullX);
                        aCenterY = (aStartY * (1.0 - aDistAlong)) + (anEndY * aDistAlong) + aCenterMult * (GameFramework.Utils.GetRandFloat() * 15.0 + aPullFactor * aLightning.mPullY);
                    }
                    var aPoint = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum) + 0];
                    var aPointR = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum) + 1];
                    if((aLightningPointNum == 0) || (aLightningPointNum == Game.LightningStorm.NUM_LIGTNING_POINTS - 1)) {
                        aPoint.x = (aCenterX | 0);
                        aPoint.y = (aCenterY | 0);
                        aPointR.x = (aCenterX | 0);
                        aPointR.y = (aCenterY | 0);
                    } else {
                        var aWidthMult = GameFramework.BaseApp.mApp.get_Is3D() ? 32.0 : 26.0;
                        aPoint.x = ((aCenterX + GameFramework.Utils.GetRandFloat() * aWidthMult) | 0);
                        aPoint.y = ((aCenterY + GameFramework.Utils.GetRandFloat() * aWidthMult) | 0);
                        aPointR.x = ((aCenterX + GameFramework.Utils.GetRandFloat() * aWidthMult) | 0);
                        aPointR.y = ((aCenterY + GameFramework.Utils.GetRandFloat() * aWidthMult) | 0);
                    }
                }
            }
        }
        if((!hasExplodingPieces) && (aNumElectrocutedPieces == 0) && (aNumMatchingPieces == 0) && (this.mLightningVector.length == 0) && (!hadWildcardEffect)) {
            for(var aRow_2 = 0; aRow_2 < 8; aRow_2++) {
                for(var aCol_2 = 0; aCol_2 < 8; aCol_2++) {
                    var aPiece_2 = this.mBoard.mBoard[this.mBoard.mBoard.mIdxMult0 * (aRow_2) + aCol_2];
                    if(aPiece_2 != null) {
                        aPiece_2.mFallVelocity = 0.0;
                    }
                }
            }
            this.mDoneDelay = 30;
        }
    },
    DrawLightning : function Game_LightningStorm$DrawLightning(g) {
        g.PushTranslate((this.mBoard.GetBoardX()), (this.mBoard.GetBoardY()));
        for(var aLightningNum = 0; aLightningNum < (this.mLightningVector.length | 0); aLightningNum++) {
            var aLightning = this.mLightningVector[aLightningNum];
            var aBrightness = Math.min((1.0 - aLightning.mPercentDone) * 8.0, 1.0) * this.mBoard.GetPieceAlpha();
            var aCenterColor = GameFramework.gfx.Color.FAlphaToInt(aBrightness);
            if(GameFramework.BaseApp.mApp.get_Is3D()) {
                var aTriVertices = Array.Create2D((Game.LightningStorm.NUM_LIGTNING_POINTS - 1) * 2 - 2, 3, null);
                var aTriCount = 0;
                for(var aLightningPointNum = 0; aLightningPointNum < Game.LightningStorm.NUM_LIGTNING_POINTS - 1; aLightningPointNum++) {
                    var aPoint = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum) + 0];
                    var aPointR = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum) + 1];
                    var aPointD = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum + 1) + 0];
                    var aPointRD = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum + 1) + 1];
                    var aV = aLightningPointNum / (Game.LightningStorm.NUM_LIGTNING_POINTS - 1);
                    var aVD = (aLightningPointNum + 1) / (Game.LightningStorm.NUM_LIGTNING_POINTS - 1);
                    var aColor = GameFramework.gfx.Color.UInt_FAToInt(Game.DM.gElectColors[(this.mColor | 0) + 1], aBrightness);
                    if(aLightningPointNum == 0) {
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 0] = new GameFramework.gfx.TriVertex(aPoint.x, aPoint.y, 0.5, aV, aColor);
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 1] = new GameFramework.gfx.TriVertex(aPointRD.x, aPointRD.y, 1.0, aVD, aColor);
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 2] = new GameFramework.gfx.TriVertex(aPointD.x, aPointD.y, 0.0, aVD, aColor);
                        aTriCount++;
                    } else if(aLightningPointNum == Game.LightningStorm.NUM_LIGTNING_POINTS - 2) {
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 0] = new GameFramework.gfx.TriVertex(aPoint.x, aPoint.y, 0.0, aV, aColor);
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 1] = new GameFramework.gfx.TriVertex(aPointR.x, aPointR.y, 1.0, aV, aColor);
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 2] = new GameFramework.gfx.TriVertex(aPointD.x, aPointD.y, 0.5, aVD, aColor);
                        aTriCount++;
                    } else {
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 0] = new GameFramework.gfx.TriVertex(aPoint.x, aPoint.y, 0.0, aV, aColor);
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 1] = new GameFramework.gfx.TriVertex(aPointRD.x, aPointRD.y, 1.0, aVD, aColor);
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 2] = new GameFramework.gfx.TriVertex(aPointD.x, aPointD.y, 0.0, aVD, aColor);
                        aTriCount++;
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 0] = new GameFramework.gfx.TriVertex(aPoint.x, aPoint.y, 0.0, aV, aColor);
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 1] = new GameFramework.gfx.TriVertex(aPointR.x, aPointR.y, 1.0, aV, aColor);
                        aTriVertices[aTriVertices.mIdxMult0 * (aTriCount) + 2] = new GameFramework.gfx.TriVertex(aPointRD.x, aPointRD.y, 1.0, aVD, aColor);
                        aTriCount++;
                    }
                }
                Game.Resources['IMAGE_LIGHTNING_TEX'].set_Additive(true);
                g.DrawTrianglesTex(Game.Resources['IMAGE_LIGHTNING_TEX'], aTriVertices);

                {
                    var $srcArray2 = aTriVertices;
                    for(var $enum2 = 0; $enum2 < $srcArray2.length; $enum2++) {
                        var aTriVertex = $srcArray2[$enum2];
                        aTriVertex.color = aCenterColor;
                    }
                }
                Game.Resources['IMAGE_LIGHTNING_CENTER'].set_Additive(true);
                g.DrawTrianglesTex(Game.Resources['IMAGE_LIGHTNING_CENTER'], aTriVertices);
            } else {
                var aColor_2 = GameFramework.gfx.Color.UInt_AToInt(Game.DM.gElectColors[(this.mColor | 0) + 1], ((aBrightness * 255.0) | 0));
                for(var aLightningPointNum_2 = 0; aLightningPointNum_2 < Game.LightningStorm.NUM_LIGTNING_POINTS - 1; aLightningPointNum_2++) {
                    var aPoint_2 = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum_2) + 0];
                    var aPointR_2 = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum_2) + 1];
                    var aPointD_2 = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum_2 + 1) + 0];
                    var aPointRD_2 = aLightning.mPoints[aLightning.mPoints.mIdxMult0 * (aLightningPointNum_2 + 1) + 1];
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
                    g.PushColor(aColor_2);
                    aPt[aPt.mIdxMult0 * (0) + 0] = ((aPoint_2.x) | 0);
                    aPt[aPt.mIdxMult0 * (0) + 1] = ((aPoint_2.y) | 0);
                    aPt[aPt.mIdxMult0 * (1) + 0] = ((aPointRD_2.x) | 0);
                    aPt[aPt.mIdxMult0 * (1) + 1] = ((aPointRD_2.y) | 0);
                    aPt[aPt.mIdxMult0 * (2) + 0] = ((aPointD_2.x) | 0);
                    aPt[aPt.mIdxMult0 * (2) + 1] = ((aPointD_2.y) | 0);
                    g.PolyFill(aPt);
                    aPt[aPt.mIdxMult0 * (0) + 0] = ((aPoint_2.x) | 0);
                    aPt[aPt.mIdxMult0 * (0) + 1] = ((aPoint_2.y) | 0);
                    aPt[aPt.mIdxMult0 * (1) + 0] = ((aPointR_2.x) | 0);
                    aPt[aPt.mIdxMult0 * (1) + 1] = ((aPointR_2.y) | 0);
                    aPt[aPt.mIdxMult0 * (2) + 0] = ((aPointRD_2.x) | 0);
                    aPt[aPt.mIdxMult0 * (2) + 1] = ((aPointRD_2.y) | 0);
                    g.PolyFill(aPt);
                    g.PopColor();
                    g.PushColor(aCenterColor);
                    aPt[aPt.mIdxMult0 * (0) + 0] = ((aCenterX) | 0);
                    aPt[aPt.mIdxMult0 * (0) + 1] = ((aCenterY) | 0);
                    aPt[aPt.mIdxMult0 * (1) + 0] = ((aCenterRDX) | 0);
                    aPt[aPt.mIdxMult0 * (1) + 1] = ((aCenterRDY) | 0);
                    aPt[aPt.mIdxMult0 * (2) + 0] = ((aCenterDX) | 0);
                    aPt[aPt.mIdxMult0 * (2) + 1] = ((aCenterDY) | 0);
                    g.PolyFill(aPt);
                    aPt[aPt.mIdxMult0 * (0) + 0] = ((aCenterX) | 0);
                    aPt[aPt.mIdxMult0 * (0) + 1] = ((aCenterY) | 0);
                    aPt[aPt.mIdxMult0 * (1) + 0] = ((aCenterRX) | 0);
                    aPt[aPt.mIdxMult0 * (1) + 1] = ((aCenterRY) | 0);
                    aPt[aPt.mIdxMult0 * (2) + 0] = ((aCenterRDX) | 0);
                    aPt[aPt.mIdxMult0 * (2) + 1] = ((aCenterRDY) | 0);
                    g.PolyFill(aPt);
                    g.PopColor();
                }
            }
        }
        g.PopMatrix();
    },
    Update : function Game_LightningStorm$Update() {
        this.mUpdateCnt++;
        this.mNovaScale.IncInVal();
        this.mNukeScale.IncInVal();
        if(this.mStormType == Game.LightningStorm.EStormType.FLAMING) {
            if(this.mNukeScale.CheckInThreshold((1.6))) {
                Game.SoundUtil.Play(Game.Resources['SOUND_BOMB_EXPLODE']);
            }
        }
        for(var aZapNum = 0; aZapNum < (this.mZaps.length | 0); aZapNum++) {
            var aZap = this.mZaps[aZapNum];
            aZap.Update();
        }
        this.mGemAlpha = Math.max(0, this.mGemAlpha - (0.01) * 1.67);
        if(this.mStormType == Game.LightningStorm.EStormType.HYPERCUBE) {
            this.UpdateLightning();
        }
    },
    Draw : function Game_LightningStorm$Draw(g) {
        for(var i = 0; i < this.mZaps.length; i++) {
            var aZap = this.mZaps[i];
            aZap.Draw(g);
        }
        if(this.mStormType == Game.LightningStorm.EStormType.HYPERCUBE) {
            this.DrawLightning(g);
        }
    }
}
Game.LightningStorm.staticInit = function Game_LightningStorm$staticInit() {
    Game.LightningStorm.NUM_LIGTNING_POINTS = 8;
}

JS_AddInitFunc(function() {
    Game.LightningStorm.registerClass('Game.LightningStorm', null);
});
JS_AddStaticInitFunc(function() {
    Game.LightningStorm.staticInit();
});
Game.LightningStorm.EStormType = {};
Game.LightningStorm.EStormType.staticInit = function Game_LightningStorm_EStormType$staticInit() {
    Game.LightningStorm.EStormType.HORZ = 0;
    Game.LightningStorm.EStormType.VERT = 1;
    Game.LightningStorm.EStormType.BOTH = 2;
    Game.LightningStorm.EStormType.SHORT = 3;
    Game.LightningStorm.EStormType.STAR = 4;
    Game.LightningStorm.EStormType.SCREEN = 5;
    Game.LightningStorm.EStormType.FLAMING = 6;
    Game.LightningStorm.EStormType.HYPERCUBE = 7;
}
JS_AddInitFunc(function() {
    Game.LightningStorm.EStormType.staticInit();
});