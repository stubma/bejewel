/**
 * @constructor
 */
Game.LightningZap = function Game_LightningZap(
    theBoard,
    theStartX,
    theStartY,
    theEndX,
    theEndY,
    theColor,
    theTime,
    isFlamimg
) {
    this.mRainbowSize = new GameFramework.CurvedVal();
    this.mRainbowAlpha = new GameFramework.CurvedVal();
    this.mPoints = Array.Create(2, null, [], []);
    this.mBoard = theBoard;
    this.mDeleteMe = false;
    this.mRainbowSize.SetCurve("b;0,1,0.006667,1,#6P4 dG==] 9e###OH###Qm###bD###Mb###V?###LS###O8###|?<i^  G####");
    this.mRainbowAlpha.SetCurve("b;0,1,0.006667,1,####    *(###`:###O'###    i####");
    this.mFlaming = isFlamimg;
    this.mPercentDone = 0.0;
    this.mDoneTime = theTime;
    this.mTimer = 0.0;
    this.mColor = theColor;
    this.mStartPoint = new GameFramework.geom.TPoint(theStartX, theStartY);
    this.mEndPoint = new GameFramework.geom.TPoint(theEndX, theEndY);
    var aYDiff = this.mEndPoint.y - this.mStartPoint.y;
    var aXDiff = this.mEndPoint.x - this.mStartPoint.x;
    this.mAngle = Math.atan2(aYDiff, aXDiff);
    this.mLength = Math.sqrt(aXDiff * aXDiff + aYDiff * aYDiff);
    this.mFrame = 0;
    this.mUpdates = 0;
    this.Update();
};
Game.LightningZap.prototype = {
    mBoard: null,
    mStartPoint: null,
    mEndPoint: null,
    mRainbowSize: null,
    mRainbowAlpha: null,
    mPoints: null,
    mPercentDone: 0,
    mTimer: 0,
    mDoneTime: 0,
    mAngle: 0,
    mLength: 0,
    mColor: 0,
    mUpdates: 0,
    mFrame: 0,
    mDeleteMe: null,
    mFlaming: null,
    Update: function Game_LightningZap$Update() {
        var anImage = Game.Resources["IMAGE_LIGHTNING"];
        var wantsCalm = false;
        this.mUpdates++;
        if (wantsCalm) {
            this.mTimer += 0.05 * 1.67;
        } else {
            this.mTimer += 0.1 * 1.67;
        }
        var aDiffX = this.mEndPoint.x - this.mStartPoint.x;
        var aDiffY = this.mEndPoint.y - this.mStartPoint.y;
        var aMag = Math.max(1.0, Math.sqrt(aDiffX * aDiffX + aDiffY * aDiffY));
        var thickness = this.mFlaming ? 80.0 : 80.0;
        var aXOff = (thickness * aDiffY) / aMag;
        var aYOff = (thickness * aDiffX) / aMag;
        if ((wantsCalm && this.mUpdates % 6 == 0) || (!wantsCalm && this.mUpdates % 3 == 0)) {
            this.mPoints[0].clear();
            this.mPoints[1].clear();
            this.mFrame = Game.Util.Rand() % 5;
            var numpoints = (Math.max(1.0, (0.5 * this.mLength) / anImage.mHeight) | 0) + 1;
            for (var i = 0; i < numpoints; i++) {
                var aPoint = Array.Create(
                    2,
                    null,
                    new GameFramework.geom.TPoint(0, 0),
                    new GameFramework.geom.TPoint(0, 0)
                );
                var aRatio = i / (numpoints - 1);
                var aMaxOffset = 1;
                if (i != 0 && i < numpoints - 1) {
                    aMaxOffset = Math.max(80, ((160.0 * this.mTimer) / this.mDoneTime) | 0) | 0;
                }
                if (wantsCalm) {
                    aMaxOffset = Math.max(1, (aMaxOffset * 0.5) | 0) | 0;
                }
                aPoint[0].x = aPoint[1].x =
                    this.mStartPoint.x + aRatio * aDiffX + ((aMaxOffset / 2) | 0) - (Game.Util.Rand() % aMaxOffset);
                aPoint[0].y = aPoint[1].y =
                    this.mStartPoint.y + aRatio * aDiffY + ((aMaxOffset / 2) | 0) - (Game.Util.Rand() % aMaxOffset);
                aPoint[0].x -= aXOff;
                aPoint[1].x += aXOff;
                aPoint[0].y += aYOff;
                aPoint[1].y -= aYOff;
                this.mPoints[0].push(aPoint[0]);
                this.mPoints[1].push(aPoint[1]);
            }
        }
        this.mPercentDone = this.mTimer / this.mDoneTime;
        if (this.mPercentDone >= 1.0) {
            this.mDeleteMe = true;
        }
    },
    Draw: function Game_LightningZap$Draw(g) {
        var anImage = Game.Resources["IMAGE_LIGHTNING"];
        var aBrightness = Math.max(0, Math.min((1.0 - this.mPercentDone) * 8.0, 1.0)) * this.mBoard.GetPieceAlpha();
        anImage.mAdditive = true;
        var aMatrix = g.mReserveMatrix;
        aMatrix.identity();
        aMatrix.scale(
            (2.5 * anImage.mWidth) / anImage.mAdjustedWidth,
            (4.0 * anImage.mHeight) / anImage.mAdjustedHeight
        );
        if (this.mEndPoint.y == this.mStartPoint.y) {
            aMatrix.rotate(Math.PI / -2.0);
        }
        if (this.mEndPoint.x == this.mStartPoint.x) {
            aMatrix.translate(
                this.mBoard.GetBoardX() + this.mStartPoint.x - 104,
                this.mBoard.GetBoardY() + this.mStartPoint.y
            );
        } else {
            aMatrix.translate(
                this.mBoard.GetBoardX() + this.mStartPoint.x,
                this.mBoard.GetBoardY() + this.mStartPoint.y + 104
            );
        }
        g.PushColor(GameFramework.gfx.Color.FAlphaToInt(aBrightness));
        g.PushMatrix(aMatrix);
        g.DrawImageCel(anImage, 0, 0, this.mFrame);
        g.DrawImageCel(anImage, 0, anImage.mAdjustedHeight, (this.mFrame + 0) % anImage.mNumFrames);
        g.PopMatrix();
        g.PopColor();
        if (GameFramework.BaseApp.mApp.get_Is3D()) {
            var u0;
            var u1;
            u0 = u1 = (1.0 / 5.0) * (400.0 / 512.0);
            u0 *= this.mFrame;
            u1 += u0;
            u0 += 0.02;
            u1 += -0.02;
            var aCenterColor = (aBrightness * 255.0) | 0;
            var numpoints = this.mPoints[0].length | 0;
            var _t1 = g.PushTranslate(this.mBoard.GetBoardX(), this.mBoard.GetBoardY());
            try {
                for (var i = 0; i < numpoints - 1; i++) {
                    var v0 = 0.1;
                    var v1 = 0.9;
                    {
                        var aTriVertices = Array.Create(
                            4,
                            4,
                            new GameFramework.gfx.TriVertex(),
                            new GameFramework.gfx.TriVertex(),
                            new GameFramework.gfx.TriVertex(),
                            new GameFramework.gfx.TriVertex()
                        );
                        var thickness = 0.0;
                        var aVtx = aTriVertices[0];
                        var aXDiff =
                            this.mPoints[0][i].x -
                            this.mPoints[0][i + 1].x +
                            this.mPoints[1][i].x -
                            this.mPoints[1][i + 1].x;
                        var aYDiff =
                            this.mPoints[0][i].y -
                            this.mPoints[0][i + 1].y +
                            this.mPoints[1][i].y -
                            this.mPoints[1][i + 1].y;
                        var aMag = Math.max(1.0, Math.sqrt(aXDiff * aXDiff + aYDiff * aYDiff));
                        var aTemp = aXDiff;
                        aXDiff = (thickness * aYDiff) / aMag;
                        aYDiff = (thickness * aTemp) / aMag;
                        var aColor = GameFramework.gfx.Color.Mult(
                            this.mColor,
                            GameFramework.gfx.Color.RGBAToInt(
                                255,
                                255,
                                255,
                                Math.min(255, (800.0 * aBrightness) | 0) | 0
                            )
                        );
                        {
                            aVtx.x = this.mPoints[0][i].x - aXDiff;
                            aVtx.y = this.mPoints[0][i].y - aYDiff;
                            aVtx.u = 0.0;
                            aVtx.v = v0;
                            aVtx.color = aColor;
                            aVtx = aTriVertices[1];
                            aVtx.x = this.mPoints[1][i].x + aXDiff;
                            aVtx.y = this.mPoints[1][i].y + aYDiff;
                            aVtx.u = 1.0;
                            aVtx.v = v0;
                            aVtx.color = aColor;
                            aVtx = aTriVertices[2];
                            aVtx.x = this.mPoints[1][i + 1].x + aXDiff;
                            aVtx.y = this.mPoints[1][i + 1].y + aYDiff;
                            aVtx.u = 1.0;
                            aVtx.v = v1;
                            aVtx.color = aColor;
                            aVtx = aTriVertices[3];
                            aVtx.x = this.mPoints[0][i + 1].x - aXDiff;
                            aVtx.y = this.mPoints[0][i + 1].y - aYDiff;
                            aVtx.u = 0.0;
                            aVtx.v = v1;
                            aVtx.color = aColor;
                            var aTri = Array.Create2D(
                                2,
                                3,
                                6,
                                aTriVertices[0],
                                aTriVertices[1],
                                aTriVertices[2],
                                aTriVertices[2],
                                aTriVertices[3],
                                aTriVertices[0]
                            );
                            Game.Resources["IMAGE_GRITTYBLURRY"].set_Additive(true);
                            g.DrawTrianglesTex(Game.Resources["IMAGE_GRITTYBLURRY"], aTri);
                            g.DrawTrianglesTex(Game.Resources["IMAGE_GRITTYBLURRY"], aTri);
                        }
                    }
                    v0 = v1;
                    if (v0 >= 1.0) {
                        v0 -= 1.0;
                    }
                }
            } finally {
                _t1.Dispose();
            }
        }
    },
};
Game.LightningZap.staticInit = function Game_LightningZap$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.LightningZap.registerClass("Game.LightningZap", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.LightningZap.staticInit();
});
