Game.TimeBonusEffect = function Game_TimeBonusEffect(thePiece) {
    this.mCirclePct = new GameFramework.CurvedVal();
    this.mRadiusScale = new GameFramework.CurvedVal();
    Game.TimeBonusEffect.initializeBase(this, [Game.Effect.EFxType.TIME_BONUS]);
    this.mElectroBoltVector = [];
    this.mPieceIdRel = thePiece.mId;
    this.mGemColor = thePiece.mColor;
    this.mTimeBonus = thePiece.mCounter;
    this.mDAlpha = 0;
    this.mRadiusScale.SetConstant(1.0);
};
Game.TimeBonusEffect.prototype = {
    mElectroBoltVector: null,
    mGemColor: null,
    mTimeBonus: 0,
    mCirclePct: null,
    mRadiusScale: null,
    Update: function Game_TimeBonusEffect$Update() {
        this.mCirclePct.IncInVal();
        this.mRadiusScale.IncInVal();
        var aRelPiece = this.mFXManager.mBoard.GetPieceById(this.mPieceIdRel);
        if (aRelPiece != null) {
            this.mOverlay = false;
            this.mX = aRelPiece.GetScreenX() + ((Game.Board.GEM_WIDTH / 2) | 0);
            this.mY = aRelPiece.GetScreenY() + ((Game.Board.GEM_HEIGHT / 2) | 0);
            this.mTimeBonus = aRelPiece.mCounter;
            for (var anIdx = 0; anIdx < (this.mFXManager.mBoard.mLightningStorms.length | 0); anIdx++) {
                if (
                    this.mFXManager.mBoard.mLightningStorms[anIdx].mStormType ==
                    Game.LightningStorm.EStormType.HYPERCUBE
                ) {
                    if (this.mFXManager.mBoard.mLightningStorms[anIdx].mColor == aRelPiece.mColor) {
                        this.mOverlay = true;
                    }
                }
            }
        }
        var aFrame = 0;
        if (aRelPiece != null) {
            aFrame = Math.min(19, (20.0 * aRelPiece.mRotPct) | 0) | 0;
        }
        var noEffect =
            Game.BejApp.mBejApp.mFXScale != 1.0 &&
            GameFramework.Utils.GetRandFloatU() > 0.5 + Game.BejApp.mBejApp.mFXScale * 0.5;
        {
            var anElectroMult = Math.min(4.0, this.mTimeBonus - 1.0) / 4.0;
            if (!Game.BejApp.mBejApp.mIsSlow) {
                if (GameFramework.Utils.GetRandFloatU() < 0.025 * Math.min(5.0, this.mTimeBonus - 1.0) && !noEffect) {
                    var anEffect = this.mFXManager.AllocEffect(Game.Effect.EFxType.EMBER);
                    var anAngle = GameFramework.Utils.GetRandFloat() * Math.PI;
                    var aDist = Game.Piece.GetAngleRadiusColorFrame(anAngle, this.mGemColor, aFrame);
                    var aSpeed = 0.35 + GameFramework.Utils.GetRandFloatU() * 0.1;
                    anEffect.mAlpha = 1.0;
                    anEffect.mScale = 1.0;
                    anEffect.mDScale = -0.0;
                    anEffect.mDAlpha = -0.012;
                    anEffect.mFrame = 0;
                    Game.Resources["IMAGE_SPARKLET"].mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
                    anEffect.mImage = Game.Resources["IMAGE_SPARKLET"];
                    anEffect.mX = ((Game.Board.GEM_WIDTH / 2) | 0) + Math.cos(anAngle) * aDist;
                    anEffect.mY = ((Game.Board.GEM_HEIGHT / 2) | 0) + Math.sin(anAngle) * aDist;
                    anEffect.mDX = Math.cos(anAngle) * aSpeed;
                    anEffect.mDY = Math.sin(anAngle) * aSpeed;
                    anEffect.mColor = Game.DM.gArcColors[this.mGemColor | 0];
                    anEffect.mPieceIdRel = aRelPiece == null ? -1 : aRelPiece.mId;
                    this.mFXManager.mBoard.mPreFXManager.AddEffect(anEffect);
                }
            }
            if (Game.BejApp.mBejApp.mIsSlow) {
                anElectroMult *= 0.25;
            }
            var wantElectro = GameFramework.Utils.GetRandFloatU() < 0.15 * anElectroMult;
            wantElectro |= (this.mElectroBoltVector.length | 0) < Math.min(3, this.mTimeBonus * 2 - 1);
            if (noEffect) {
                wantElectro = false;
            }
            if (wantElectro) {
                var aBolt = new Game.ElectroBolt();
                aBolt.mHitOtherGem = false;
                aBolt.mCrossover = !aBolt.mHitOtherGem && GameFramework.Utils.GetRandFloatU() < 0.02;
                if (Game.BejApp.mBejApp.mIsSlow) {
                    aBolt.mCrossover |= !aBolt.mHitOtherGem && GameFramework.Utils.GetRandFloatU() < 0.1;
                }
                if (aBolt.mHitOtherGem) {
                    aBolt.mAngStart = Math.abs(GameFramework.Utils.GetRandFloat()) * Math.PI * 2.0;
                    var aPiece = this.mFXManager.mBoard.GetPieceAtScreenXY(
                        (this.mX +
                            Game.Board.GEM_WIDTH / 2.0 +
                            Math.cos(aBolt.mAngStart) * Game.Board.GEM_WIDTH * 0.6) |
                            0,
                        (this.mY +
                            Game.Board.GEM_HEIGHT / 2 +
                            Math.sin(aBolt.mAngStart) * Game.Board.GEM_HEIGHT * 0.6) |
                            0
                    );
                    if (aPiece != null && aPiece != aRelPiece) {
                        aBolt.mHitOtherGemId = aPiece.mId;
                    } else {
                        aBolt.mHitOtherGem = false;
                    }
                }
                if (aBolt.mHitOtherGem) {
                    aBolt.mAngEnd = Math.PI + aBolt.mAngStart + Math.abs(GameFramework.Utils.GetRandFloat()) * 0.5;
                    aBolt.mAngStartD = GameFramework.Utils.GetRandFloat() * 0.03;
                    aBolt.mAngEndD = GameFramework.Utils.GetRandFloat() * 0.03;
                } else if (aBolt.mCrossover) {
                    aBolt.mAngStart = Math.abs(GameFramework.Utils.GetRandFloat()) * Math.PI * 2.0;
                    aBolt.mAngEnd = aBolt.mAngStart;
                    aBolt.mAngStartD = GameFramework.Utils.GetRandFloat() * 0.02;
                    if (aBolt.mAngStartD < 0) {
                        aBolt.mAngStartD += -0.02;
                    } else {
                        aBolt.mAngStartD += 0.02;
                    }
                    aBolt.mAngEndD = -aBolt.mAngStartD + GameFramework.Utils.GetRandFloat() * 0.02;
                } else {
                    aBolt.mAngStart = Math.abs(GameFramework.Utils.GetRandFloat()) * Math.PI * 2.0;
                    aBolt.mAngEnd = aBolt.mAngStart + Math.abs(GameFramework.Utils.GetRandFloat()) * 0.5 + 0.5;
                    aBolt.mAngStartD = GameFramework.Utils.GetRandFloat() * 0.0075;
                    aBolt.mAngEndD = aBolt.mAngStartD + GameFramework.Utils.GetRandFloat() * 0.002;
                }
                aBolt.mNumMidPoints = 2;
                for (var aPtNum = 0; aPtNum < aBolt.mNumMidPoints; aPtNum++) {
                    aBolt.mMidPointsPos[aPtNum] = GameFramework.Utils.GetRandFloat() * 10.0;
                    aBolt.mMidPointsPosD[aPtNum] = GameFramework.Utils.GetRandFloat() * 0.2;
                }
                this.mElectroBoltVector.push(aBolt);
            }
            for (var aBoltNum = 0; aBoltNum < (this.mElectroBoltVector.length | 0); aBoltNum++) {
                var aBolt_2 = this.mElectroBoltVector[aBoltNum];
                aBolt_2.mAngStart += aBolt_2.mAngStartD;
                aBolt_2.mAngEnd += aBolt_2.mAngEndD;
                var deleteMe = false;
                for (var aPtNum_2 = 0; aPtNum_2 < aBolt_2.mNumMidPoints; aPtNum_2++) {
                    aBolt_2.mMidPointsPos[aPtNum_2] += aBolt_2.mMidPointsPosD[aPtNum_2];
                    if (aBolt_2.mHitOtherGem) {
                        if (Math.abs(aBolt_2.mMidPointsPos[aPtNum_2]) >= 25) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] *= -0.65;
                        } else if (GameFramework.Utils.GetRandFloatU() < 0.2) {
                            aBolt_2.mMidPointsPos[aPtNum_2] = GameFramework.Utils.GetRandFloat() * 15.0;
                        } else if (GameFramework.Utils.GetRandFloatU() < 0.05) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] += GameFramework.Utils.GetRandFloat() * 1.5;
                        } else if (GameFramework.Utils.GetRandFloatU() < 0.05) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] = GameFramework.Utils.GetRandFloat() * 1.5;
                        }
                    } else if (aBolt_2.mCrossover) {
                        if (Math.abs(aBolt_2.mMidPointsPos[aPtNum_2]) >= 25) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] *= -0.65;
                        } else if (GameFramework.Utils.GetRandFloatU() < 0.2) {
                            aBolt_2.mMidPointsPos[aPtNum_2] = GameFramework.Utils.GetRandFloat() * 15.0;
                        } else if (GameFramework.Utils.GetRandFloatU() < 0.1) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] += GameFramework.Utils.GetRandFloat() * 1.5;
                        } else if (GameFramework.Utils.GetRandFloatU() < 0.1) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] = GameFramework.Utils.GetRandFloat() * 1.5;
                        }
                    } else {
                        if (aBolt_2.mMidPointsPos[aPtNum_2] <= 0) {
                            aBolt_2.mMidPointsPos[aPtNum_2] = 0;
                            aBolt_2.mMidPointsPosD[aPtNum_2] = GameFramework.Utils.GetRandFloatU() * 0.1;
                        } else if (GameFramework.Utils.GetRandFloatU() < 0.05) {
                            var aMoveTend = (4.0 - aBolt_2.mMidPointsPos[aPtNum_2]) * 0.1;
                            aBolt_2.mMidPointsPosD[aPtNum_2] = aMoveTend + GameFramework.Utils.GetRandFloat() * 1.0;
                        } else if (GameFramework.Utils.GetRandFloatU() < 0.025) {
                            aBolt_2.mMidPointsPos[aPtNum_2] = GameFramework.Utils.GetRandFloatU() * 18.0;
                        } else if (GameFramework.Utils.GetRandFloatU() < 0.04) {
                            aBolt_2.mMidPointsPosD[aPtNum_2] += GameFramework.Utils.GetRandFloat() * 2.5;
                        }
                        if (GameFramework.Utils.GetRandFloatU() < 0.1) {
                            var aPrevVal = 0.0;
                            var aNextVal = 0.0;
                            if (aPtNum_2 - 1 >= 0) {
                                aPrevVal = aBolt_2.mMidPointsPos[aPtNum_2 - 1];
                            }
                            if (aPtNum_2 + 1 < aBolt_2.mNumMidPoints) {
                                aNextVal = aBolt_2.mMidPointsPos[aPtNum_2 + 1];
                            }
                            aBolt_2.mMidPointsPos[aPtNum_2] =
                                (aBolt_2.mMidPointsPos[aPtNum_2] + aPrevVal + aNextVal) / 3;
                        }
                        if (GameFramework.Utils.GetRandFloatU() < 0.2) {
                            var aMoveTowardPt = aPtNum_2 + (GameFramework.Utils.GetRand() % 3) - 1;
                            if (aMoveTowardPt >= 0 && aMoveTowardPt < aBolt_2.mNumMidPoints) {
                                var aDelta = aBolt_2.mMidPointsPos[aMoveTowardPt] - aBolt_2.mMidPointsPos[aPtNum_2];
                                aBolt_2.mMidPointsPosD[aPtNum_2] += aDelta * 0.2;
                            }
                        }
                        if (GameFramework.Utils.GetRandFloatU() < 0.1) {
                            var aPrevVal_2 = 0.0;
                            var aNextVal_2 = 0.0;
                            if (aPtNum_2 - 1 >= 0) {
                                aPrevVal_2 = aBolt_2.mMidPointsPosD[aPtNum_2 - 1];
                            }
                            if (aPtNum_2 + 1 < aBolt_2.mNumMidPoints) {
                                aNextVal_2 = aBolt_2.mMidPointsPosD[aPtNum_2 + 1];
                            }
                            aBolt_2.mMidPointsPosD[aPtNum_2] = (aPrevVal_2 + aNextVal_2) / 2;
                        }
                    }
                    if (
                        aBolt_2.mMidPointsPos[aPtNum_2] > 18.0 ||
                        (anElectroMult <= 0 && GameFramework.Utils.GetRandFloatU() < 0.0075)
                    ) {
                        deleteMe = true;
                    }
                }
                if (aBolt_2.mHitOtherGem) {
                    var aLastDist =
                        Game.Piece.GetAngleRadiusColorFrame(aBolt_2.mAngStart, this.mGemColor, aFrame) + 0.0;
                    var aLastX = Math.cos(aBolt_2.mAngStart) * aLastDist;
                    var aLastY = Math.sin(aBolt_2.mAngStart) * aLastDist;
                    var aPiece_2 = this.mFXManager.mBoard.GetPieceById(aBolt_2.mHitOtherGemId);
                    if (aPiece_2 != null) {
                        var aEndDist = aPiece_2.GetAngleRadius(aBolt_2.mAngEnd);
                        var aEndX = (aPiece_2.mX - this.mX) / 1.0 + Math.cos(aBolt_2.mAngEnd) * aEndDist;
                        var aEndY = (aPiece_2.mY - this.mY) / 1.0 + Math.sin(aBolt_2.mAngEnd) * aEndDist;
                        var aDX = aLastX - aEndX;
                        var aDY = aLastY - aEndY;
                        if (Math.sqrt(aDX * aDX + aDY * aDY) > 90.0) {
                            deleteMe = true;
                        }
                        var aPieceAng = Math.atan2(aPiece_2.mY - this.mY, aPiece_2.mX - this.mX);
                        var aMyElectDot =
                            Math.cos(aBolt_2.mAngStart) * Math.cos(aPieceAng) +
                            Math.sin(aBolt_2.mAngStart) * Math.sin(aPieceAng);
                        if (aMyElectDot < 0.75) {
                            deleteMe = true;
                        }
                        var aHitElectDot =
                            Math.cos(aBolt_2.mAngEnd) * Math.cos(aPieceAng + Math.PI) +
                            Math.sin(aBolt_2.mAngEnd) * Math.sin(aPieceAng + Math.PI);
                        if (aHitElectDot < 0.75) {
                            deleteMe = true;
                        }
                    } else {
                        deleteMe = true;
                    }
                    if (GameFramework.Utils.GetRandFloatU() < 0.001) {
                        deleteMe = true;
                    }
                } else if (aBolt_2.mCrossover) {
                    if (GameFramework.Utils.GetRandFloatU() < 0.001) {
                        deleteMe = true;
                    }
                    if (Math.abs(aBolt_2.mAngStart - aBolt_2.mAngEnd) >= Math.PI * 2) {
                        deleteMe = true;
                    }
                } else {
                    if (GameFramework.Utils.GetRandFloatU() < 0.005) {
                        deleteMe = true;
                    }
                }
                if (deleteMe) {
                    this.mElectroBoltVector.removeAt(aBoltNum);
                    aBoltNum--;
                    continue;
                }
            }
        }
        if (GameFramework.Utils.GetRand() % 25 == 0) {
            var anEffect_2 = this.mFXManager.AllocEffect(Game.Effect.EFxType.LIGHT);
            anEffect_2.mFlags = Game.Effect.EFlag.ALPHA_FADEINOUT | 0;
            anEffect_2.mX = this.mX + GameFramework.Utils.GetRandFloat() * 20.0;
            anEffect_2.mY = this.mY + GameFramework.Utils.GetRandFloat() * 20.0;
            anEffect_2.mZ = 0.08;
            anEffect_2.mZ = 0.08;
            anEffect_2.mValue[0] = 6000.0;
            anEffect_2.mValue[1] = -4000.0;
            anEffect_2.mValue[2] = 0.5;
            anEffect_2.mAlpha = 0.0;
            anEffect_2.mDAlpha = 0.07;
            anEffect_2.mScale = 0.75;
            anEffect_2.mColor = GameFramework.gfx.Color.RGBToInt(255, 255, 255);
            if (GameFramework.Utils.GetRand() % 2 != 0 && this.mPieceIdRel != -1) {
                anEffect_2.mPieceId = this.mPieceIdRel;
            }
            this.mFXManager.AddEffect(anEffect_2);
        }
        if (
            this.mPieceIdRel != -1 &&
            (aRelPiece == null ||
                (!aRelPiece.IsFlagSet(Game.Piece.EFlag.TIME_BONUS) && this.mElectroBoltVector.length == 0))
        ) {
            this.mDeleteMe = true;
        }
    },
    DrawElectroLine: function Game_TimeBonusEffect$DrawElectroLine(
        g,
        theImage,
        theStartX,
        theStartY,
        theEndX,
        theEndY,
        theWidth,
        theColor1,
        theColor2
    ) {
        if (Game.BejApp.mBejApp.get_Is3D()) {
            var aDX = theEndX - theStartX;
            var aDY = theEndY - theStartY;
            var anAng = Math.atan2(aDY, aDX);
            var aCos = Math.cos(anAng);
            var aSin = Math.sin(anAng);
            var aCosT = -aSin;
            var aSinT = aCos;
            var aStartXE = theStartX + aCos * -theWidth;
            var aStartYE = theStartY + aSin * -theWidth;
            var aEndXE = theEndX + aCos * theWidth;
            var aEndYE = theEndY + aSin * theWidth;
            var color0 = GameFramework.gfx.Color.WHITE_RGB;
            var w = theWidth;
            var color1 = theColor1;
            var color2 = theColor2;
            if (Game.TimeBonusEffect.mElectoLineVertices == null) {
                Game.TimeBonusEffect.mElectoLineVertices = Array.Create2D(
                    6,
                    3,
                    null,
                    new GameFramework.gfx.TriVertex(aStartXE + aCosT * w, theStartY + aSinT * w, 0.0, 0, color1),
                    new GameFramework.gfx.TriVertex(aStartXE + aCosT * -w, theStartY + aSinT * -w, 0.0, 1, color1),
                    new GameFramework.gfx.TriVertex(theStartX + aCosT * w, theStartY + aSinT * w, 0.5, 0, color1),
                    new GameFramework.gfx.TriVertex(aStartXE + aCosT * -w, theStartY + aSinT * -w, 0.0, 1, color1),
                    new GameFramework.gfx.TriVertex(theStartX + aCosT * w, theStartY + aSinT * w, 0.5, 0, color1),
                    new GameFramework.gfx.TriVertex(theStartX + aCosT * -w, theStartY + aSinT * -w, 0.5, 1, color1),
                    new GameFramework.gfx.TriVertex(theStartX + aCosT * w, theStartY + aSinT * w, 0.5, 0, color1),
                    new GameFramework.gfx.TriVertex(theStartX + aCosT * -w, theStartY + aSinT * -w, 0.5, 1, color1),
                    new GameFramework.gfx.TriVertex(theEndX + aCosT * w, theEndY + aSinT * w, 0.5, 0, color2),
                    new GameFramework.gfx.TriVertex(theStartX + aCosT * -w, theStartY + aSinT * -w, 0.5, 1, color1),
                    new GameFramework.gfx.TriVertex(theEndX + aCosT * w, theEndY + aSinT * w, 0.5, 0, color2),
                    new GameFramework.gfx.TriVertex(theEndX + aCosT * -w, theEndY + aSinT * -w, 0.5, 1, color2),
                    new GameFramework.gfx.TriVertex(theEndX + aCosT * w, theEndY + aSinT * w, 0.5, 0, color2),
                    new GameFramework.gfx.TriVertex(theEndX + aCosT * -w, theEndY + aSinT * -w, 0.5, 1, color2),
                    new GameFramework.gfx.TriVertex(aEndXE + aCosT * w, theEndY + aSinT * w, 1.0, 0, color2),
                    new GameFramework.gfx.TriVertex(theEndX + aCosT * -w, theEndY + aSinT * -w, 0.5, 1, color2),
                    new GameFramework.gfx.TriVertex(aEndXE + aCosT * w, theEndY + aSinT * w, 1.0, 0, color2),
                    new GameFramework.gfx.TriVertex(aEndXE + aCosT * -w, theEndY + aSinT * -w, 1.0, 1, color2)
                );
            } else {
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 0 + 0].x =
                    aStartXE + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 0 + 0].y =
                    theStartY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 0 + 0
                ].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 0 + 1].x =
                    aStartXE + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 0 + 1].y =
                    theStartY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 0 + 1
                ].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 0 + 2].x =
                    theStartX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 0 + 2].y =
                    theStartY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 0 + 2
                ].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 1 + 0].x =
                    aStartXE + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 1 + 0].y =
                    theStartY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 1 + 0
                ].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 1 + 1].x =
                    theStartX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 1 + 1].y =
                    theStartY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 1 + 1
                ].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 1 + 2].x =
                    theStartX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 1 + 2].y =
                    theStartY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 1 + 2
                ].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 2 + 0].x =
                    theStartX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 2 + 0].y =
                    theStartY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 2 + 0
                ].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 2 + 1].x =
                    theStartX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 2 + 1].y =
                    theStartY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 2 + 1
                ].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 2 + 2].x =
                    theEndX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 2 + 2].y =
                    theEndY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 2 + 2
                ].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 3 + 0].x =
                    theStartX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 3 + 0].y =
                    theStartY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 3 + 0
                ].color = color1;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 3 + 1].x =
                    theEndX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 3 + 1].y =
                    theEndY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 3 + 1
                ].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 3 + 2].x =
                    theEndX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 3 + 2].y =
                    theEndY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 3 + 2
                ].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 4 + 0].x =
                    theEndX + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 4 + 0].y =
                    theEndY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 4 + 0
                ].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 4 + 1].x =
                    theEndX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 4 + 1].y =
                    theEndY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 4 + 1
                ].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 4 + 2].x =
                    aEndXE + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 4 + 2].y =
                    theEndY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 4 + 2
                ].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 5 + 0].x =
                    theEndX + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 5 + 0].y =
                    theEndY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 5 + 0
                ].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 5 + 1].x =
                    aEndXE + aCosT * w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 5 + 1].y =
                    theEndY + aSinT * w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 5 + 1
                ].color = color2;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 5 + 2].x =
                    aEndXE + aCosT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 5 + 2].y =
                    theEndY + aSinT * -w;
                Game.TimeBonusEffect.mElectoLineVertices[
                    Game.TimeBonusEffect.mElectoLineVertices.mIdxMult0 * 5 + 2
                ].color = color2;
            }
            theImage.set_Additive(true);
            g.DrawTrianglesTex(theImage, Game.TimeBonusEffect.mElectoLineVertices);
        }
    },
    Draw: function Game_TimeBonusEffect$Draw(g) {
        var anAlpha = this.mAlpha * this.mFXManager.mAlpha;
        var aFrame = 0;
        var _t17 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(anAlpha));
        try {
            var aPieceX = (this.mX - Game.Board.GEM_WIDTH / 2.0) | 0;
            var aPieceY = (this.mY - Game.Board.GEM_HEIGHT / 2.0) | 0;
            var aRelPiece = this.mFXManager.mBoard.GetPieceById(this.mPieceIdRel);
            if (aRelPiece != null) {
                if (aRelPiece.mScale.GetOutVal() != 1.0) {
                    g.PushScale(
                        aRelPiece.mScale.GetOutVal(),
                        aRelPiece.mScale.GetOutVal(),
                        aRelPiece.CX(),
                        aRelPiece.CY()
                    );
                }
                aFrame = Math.min(19.0, 20.0 * aRelPiece.mRotPct) | 0;
                if (aRelPiece.mRotPct == 0 && this.mElectroBoltVector.length != 0) {
                    var _t18 = g.PushColor(
                        GameFramework.gfx.Color.FAlphaToInt(
                            (Math.min(this.mElectroBoltVector.length * 32.0, 255.0) * this.mAlpha) / 255.0
                        )
                    );
                    try {
                        Game.Resources["IMAGE_GEMOUTLINES"].set_Additive(true);
                        var _t19 = g.PushScale(0.5, 0.5, aRelPiece.CX(), aRelPiece.CY());
                        try {
                            g.DrawImageCel(
                                Game.Resources["IMAGE_GEMOUTLINES"].get_CenteredImage(),
                                aRelPiece.CX(),
                                aRelPiece.CY() - 2,
                                this.mGemColor | 0
                            );
                        } finally {
                            _t19.Dispose();
                        }
                    } finally {
                        _t18.Dispose();
                    }
                }
            }
            for (var aBoltNum = 0; aBoltNum < (this.mElectroBoltVector.length | 0); aBoltNum++) {
                var aBolt = this.mElectroBoltVector[aBoltNum];
                var aColor = GameFramework.gfx.Color.CreateFromIntAlpha(
                    aBolt.mCrossover
                        ? Game.DM.gCrossoverColors[this.mGemColor | 0]
                        : Game.DM.gArcColors[this.mGemColor | 0],
                    (255.0 * this.mAlpha) | 0
                );
                var _t20 = g.PushColor(aColor.ToInt());
                try {
                    var aLastDistAdd = 0.0;
                    var aLastDist = Game.Piece.GetAngleRadiusColorFrame(aBolt.mAngStart, this.mGemColor, aFrame);
                    aLastDist =
                        (this.mCirclePct.GetOutVal() * 48.0 + (1.0 - this.mCirclePct.GetOutVal()) * aLastDist) *
                        this.mRadiusScale.GetOutVal();
                    var aLastX = Math.cos(aBolt.mAngStart) * aLastDist;
                    var aLastY = Math.sin(aBolt.mAngStart) * aLastDist;
                    var aStartX = aLastX;
                    var aStartY = aLastY;
                    var aEndDist = Game.Piece.GetAngleRadiusColorFrame(aBolt.mAngEnd, this.mGemColor, aFrame);
                    aEndDist =
                        (this.mCirclePct.GetOutVal() * 48.0 + (1.0 - this.mCirclePct.GetOutVal()) * aEndDist) *
                        this.mRadiusScale.GetOutVal();
                    var aEndX = Math.cos(aBolt.mAngEnd) * aEndDist;
                    var aEndY = Math.sin(aBolt.mAngEnd) * aEndDist;
                    if (aBolt.mHitOtherGem) {
                        var aPiece = this.mFXManager.mBoard.GetPieceById(aBolt.mHitOtherGemId);
                        if (aPiece != null) {
                            aEndDist = Game.Piece.GetAngleRadiusColorFrame(aBolt.mAngEnd, this.mGemColor, aFrame);
                            aEndDist =
                                this.mCirclePct.GetOutVal() * 48.0 + (1.0 - this.mCirclePct.GetOutVal()) * aEndDist;
                            aEndX = (aPiece.mX - aPieceX) / 1.0 + Math.cos(aBolt.mAngEnd) * aEndDist;
                            aEndY = (aPiece.mY - aPieceY) / 1.0 + Math.sin(aBolt.mAngEnd) * aEndDist;
                        }
                    }
                    for (var aPtNum = 0; aPtNum < aBolt.mNumMidPoints + 1; aPtNum++) {
                        var aPct = (aPtNum + 1) / (aBolt.mNumMidPoints + 1);
                        var anAng = aBolt.mAngStart * (1.0 - aPct) + aBolt.mAngEnd * aPct;
                        var aDistAdd = 0.0;
                        if (aPtNum < aBolt.mNumMidPoints) {
                            aDistAdd = aBolt.mMidPointsPos[aPtNum];
                        }
                        var aDist = Game.Piece.GetAngleRadiusColorFrame(anAng, this.mGemColor, aFrame);
                        aDist =
                            (this.mCirclePct.GetOutVal() * 48.0 +
                                (1.0 - this.mCirclePct.GetOutVal()) * aDist +
                                aDistAdd) *
                            this.mRadiusScale.GetOutVal();
                        var aX = Math.cos(anAng) * aDist;
                        var aY = Math.sin(anAng) * aDist;
                        if (aBolt.mCrossover || aBolt.mHitOtherGem) {
                            var aTrajAng = Math.atan2(aEndY - aLastY, aEndX - aLastX);
                            aX = aStartX * (1.0 - aPct) + aEndX * aPct;
                            aY = aStartY * (1.0 - aPct) + aEndY * aPct;
                            if (aPtNum < aBolt.mNumMidPoints) {
                                aX += Math.sin(aTrajAng) * aBolt.mMidPointsPos[aPtNum];
                                aY += Math.cos(aTrajAng) * aBolt.mMidPointsPos[aPtNum];
                            }
                        }
                        var aColor1 = aColor;
                        var aColor2 = aColor;
                        if (!aBolt.mCrossover && !aBolt.mHitOtherGem) {
                            aColor1.mAlpha = Math.max(2, (255.0 * (1.0 - aLastDistAdd * 0.03)) | 0) | 0;
                            aColor2.mAlpha = Math.max(2, (255.0 * (1.0 - aDistAdd * 0.03)) | 0) | 0;
                        }
                        aColor1.mAlpha = (aColor1.mAlpha * anAlpha) | 0;
                        aColor2.mAlpha = (aColor2.mAlpha * anAlpha) | 0;
                        this.DrawElectroLine(
                            g,
                            Game.Resources["IMAGE_ELECTROTEX"],
                            aPieceX + ((Game.Board.GEM_WIDTH / 2) | 0) + aLastX,
                            aPieceY + ((Game.Board.GEM_HEIGHT / 2) | 0) + aLastY,
                            aPieceX + ((Game.Board.GEM_WIDTH / 2) | 0) + aX,
                            aPieceY + ((Game.Board.GEM_HEIGHT / 2) | 0) + aY,
                            aBolt.mHitOtherGem ? 8.0 : aBolt.mCrossover ? 9.0 : 6.0,
                            aColor2.ToInt(),
                            aColor1.ToInt()
                        );
                        var aColorCenter1 = GameFramework.gfx.Color.CreateFromInt(GameFramework.gfx.Color.WHITE_RGB);
                        var aColorCenter2 = GameFramework.gfx.Color.CreateFromInt(GameFramework.gfx.Color.WHITE_RGB);
                        if (!aBolt.mCrossover && !aBolt.mHitOtherGem) {
                            aColorCenter1.mAlpha = Math.max(2, (255.0 * (0.85 - aLastDistAdd * 0.04)) | 0) | 0;
                            aColorCenter2.mAlpha = Math.max(2, (255.0 * (0.85 - aDistAdd * 0.04)) | 0) | 0;
                        }
                        if (aBolt.mCrossover) {
                            aColorCenter1.mAlpha = (aColorCenter1.mAlpha * 0.5) | 0;
                            aColorCenter2.mAlpha = (aColorCenter2.mAlpha * 0.5) | 0;
                        }
                        aColorCenter1.mAlpha = (aColorCenter1.mAlpha * anAlpha) | 0;
                        aColorCenter2.mAlpha = (aColorCenter2.mAlpha * anAlpha) | 0;
                        this.DrawElectroLine(
                            g,
                            Game.Resources["IMAGE_ELECTROTEX_CENTER"],
                            aPieceX + ((Game.Board.GEM_WIDTH / 2) | 0) + aLastX,
                            aPieceY + ((Game.Board.GEM_HEIGHT / 2) | 0) + aLastY,
                            aPieceX + Game.Board.GEM_WIDTH / 2.0 + aX,
                            aPieceY + Game.Board.GEM_HEIGHT / 2.0 + aY,
                            aBolt.mHitOtherGem ? 8.0 : aBolt.mCrossover ? 8.0 : 6.0,
                            aColorCenter1.ToInt(),
                            aColorCenter2.ToInt()
                        );
                        aLastX = aX;
                        aLastY = aY;
                        aLastDist = aDist;
                        aLastDistAdd = aDistAdd;
                    }
                } finally {
                    _t20.Dispose();
                }
            }
            if (aRelPiece != null) {
                if (aRelPiece.mScale.GetOutVal() != 1.0) {
                    g.PopMatrix();
                }
            }
        } finally {
            _t17.Dispose();
        }
    },
};
Game.TimeBonusEffect.staticInit = function Game_TimeBonusEffect$staticInit() {
    Game.TimeBonusEffect.mElectoLineVertices = null;
};

JSFExt_AddInitFunc(function () {
    Game.TimeBonusEffect.registerClass("Game.TimeBonusEffect", Game.Effect);
});
JSFExt_AddStaticInitFunc(function () {
    Game.TimeBonusEffect.staticInit();
});
