//Start:CrystalBall
/**
 * @constructor
 */
Game.CrystalBall = function Game_CrystalBall(theLabel, theId) {
    this.mImage = null;
    this.mImageSrcRect = new GameFramework.TIntRect(0, 0, 0, 0);
    this.mFullPct = new GameFramework.CurvedVal();
    this.mScale = new GameFramework.CurvedVal();
    this.mOffset = new GameFramework.geom.TPoint();
    this.mXBob = new GameFramework.CurvedVal();
    this.mYBob = new GameFramework.CurvedVal();
    this.mLeftArrowPct = new GameFramework.CurvedVal();
    this.mRightArrowPct = new GameFramework.CurvedVal();
    this.mDists = Array.Create(Game.CrystalBall.NUM_DIST_POINTS, null);
    this.mTexDists = Array.Create(Game.CrystalBall.NUM_DIST_POINTS, null);
    this.mAlphas = Array.Create(Game.CrystalBall.NUM_DIST_POINTS, null);
    this.mDistMults = Array.Create(Game.CrystalBall.NUM_RADIAL_POINTS + 1, null);
    this.mSins = Array.Create(Game.CrystalBall.NUM_RADIAL_POINTS + 1, null);
    this.mCoss = Array.Create(Game.CrystalBall.NUM_RADIAL_POINTS + 1, null);
    Game.CrystalBall.initializeBase(this, [theId]);
    this.mFlushPriority = -1;
    this.mScale.SetConstant(0.17);
    this.mZ = 0.0;
    this.mLabel = theLabel;
    this.mTextAlpha = 1;
    this.mMouseOverPct = 0;
    this.mBaseAlpha = 0;
    this.mLocked = false;
    this.mDoBob = true;
    this.mUpdateCnt = 0;
    this.mTextIsQuestionMark = false;
    this.mExtraFontScaling = 0.0;
    this.mGlowEffect = Game.Resources["PIEFFECT_CRYSTALBALL"].Duplicate();
    this.mGlowEffect.mEmitAfterTimeline = true;
    this.mRayEffect = Game.Resources["PIEFFECT_CRYSTALRAYS"].Duplicate();
    this.mRayEffect.mEmitAfterTimeline = true;
    this.mFontColor = GameFramework.gfx.Color.RGBAToInt(128, 0, 64, 160);
    {
        this.mXBob.SetCurve("b;-3,3,0.003333,1,####     $~###    }####");
        this.mXBob.SetMode(GameFramework.CurvedVal.MODE_REPEAT);
        this.mXBob.mInitAppUpdateCount = GameFramework.Utils.GetRand() % 100;
        this.mYBob.SetCurve("b;-3,3,0.005,1,####     $~###    }####");
        this.mYBob.SetMode(GameFramework.CurvedVal.MODE_REPEAT);
        this.mYBob.mInitAppUpdateCount = GameFramework.Utils.GetRand() % 100;
    }
};
Game.CrystalBall.prototype = {
    mImage: null,
    mImageSrcRect: null,
    mGlowEffect: null,
    mRayEffect: null,
    mFullPct: null,
    mScale: null,
    mOffset: null,
    mZ: 0,
    mXBob: null,
    mYBob: null,
    mTextAlpha: 0,
    mLeftArrowPct: null,
    mRightArrowPct: null,
    mMouseOverPct: 0,
    mBaseAlpha: 0,
    mColor: ~0,
    mFontColor: ~0,
    mExtraFontScaling: 0,
    mFlushPriority: 0,
    mLocked: null,
    mDoBob: null,
    mShowShadow: true,
    mTextIsQuestionMark: null,
    mDists: null,
    mTexDists: null,
    mAlphas: null,
    mDistMults: null,
    mSins: null,
    mCoss: null,
    Contains: function Game_CrystalBall$Contains(x, y) {
        var xDelta = x - this.mWidth / 2.0;
        var yDelta = y - this.mHeight / 2.0;
        var distSq = xDelta * xDelta + yDelta * yDelta;
        return (distSq * 0.1675) / this.mScale.get_v() < 15000;
    },
    Move: function Game_CrystalBall$Move(x, y) {
        GameFramework.widgets.ButtonWidget.prototype.Move.apply(this, [x, y]);
        var aTrans = new GameFramework.geom.Matrix();
        aTrans.identity();
        var aScale = this.mScale.GetOutVal();
        if (this.mZ > 0) {
            aScale *= 0.00195 / this.mZ;
        }
        aTrans.scale(
            aScale * 5.3 * (1.0 + this.mFullPct.GetOutVal() * 0.5),
            aScale * 5.3 * (1.0 + this.mFullPct.GetOutVal() * 0.2)
        );
        this.mGlowEffect.mDrawTransform = aTrans.clone();
        this.mRayEffect.mDrawTransform = aTrans.clone();
    },
    Draw: function Game_CrystalBall$Draw(g) {
        if (this.mParent != null && this.mWidth == 0) {
            return;
        }
        var aTrans = new GameFramework.geom.Matrix();
        aTrans.translate(this.mOffset.x, this.mOffset.y);
        g.PushMatrix(aTrans);
        var aScale = this.mScale.GetOutVal();
        if (this.mZ > 0) {
            aScale *= 0.00255 / this.mZ;
        }
        var drawEffects =
            Game.BejApp.mBejApp.mBoard == null ||
            (!Game.BejApp.mBejApp.mIsSlow && GameFramework.BaseApp.mApp.get_Is3D());
        var _t1 = g.PushTranslate(this.mWidth / 2, this.mHeight / 2);
        try {
            if (!this.mLocked && this.mDoBob) {
                g.PushTranslate(
                    this.mXBob.GetOutVal() * (1.0 - this.mFullPct.GetOutVal()),
                    this.mYBob.GetOutVal() * (1.0 - this.mFullPct.GetOutVal())
                );
            }
            var aScaleX = aScale * 5.3 * (1.0 + this.mFullPct.GetOutVal() * 0.5);
            var aScaleY = aScale * 5.3 * (1.0 + this.mFullPct.GetOutVal() * 0.2);
            var aVisibility = 1.0 - this.mFullPct.GetOutVal();
            var c = Math.max(0, aVisibility * 255) | 0;
            this.mRayEffect.mColor = GameFramework.gfx.Color.RGBToInt(c, c, c);
            this.mGlowEffect.mColor = GameFramework.gfx.Color.RGBToInt(c, c, c);
            if (!this.mLocked) {
                this.mRayEffect.mDrawTransform.identity();
                this.mRayEffect.mDrawTransform.scale(aScaleX, aScaleY);
                if (drawEffects) {
                    this.mRayEffect.Draw(g);
                }
            }
            var clr;
            if (this.mLocked) {
                clr = GameFramework.gfx.Color.UInt_AToInt(
                    this.mColor & 0xffffff,
                    (255.0 * GameFramework.gfx.Color.GetAlphaFromInt(this.mColor) * 0.5) | 0
                );
            } else {
                clr = this.mColor;
            }
            var _t2 = g.PushColor(clr);
            try {
                var cel = this.mLocked ? 0 : ((this.mUpdateCnt / 4) | 0) % 40;
                var aTransform = new GameFramework.geom.Matrix();
                aTransform.scale(Math.min(1.0, aScaleX), Math.min(1.0, aScaleY));
                var _t3 = g.PushMatrix(aTransform);
                try {
                    if (this.mShowShadow) {
                        g.DrawImage(Game.Resources["IMAGE_CRYSTALBALL_SHADOW"].get_CenteredImage(), 0, 0);
                    }
                } finally {
                    _t3.Dispose();
                }
                aTransform = new GameFramework.geom.Matrix();
                aTransform.scale(aScaleX, aScaleY);
                var _t4 = g.PushMatrix(aTransform);
                try {
                    g.DrawImageCel(Game.Resources["IMAGE_CRYSTALBALL"].get_CenteredImage(), 0, 0, cel);
                } finally {
                    _t4.Dispose();
                }
            } finally {
                _t2.Dispose();
            }
            if (!this.mLocked) {
                for (var aDistIdx = 0; aDistIdx < Game.CrystalBall.NUM_DIST_POINTS; aDistIdx++) {
                    this.mDists[aDistIdx] = aDistIdx / (Game.CrystalBall.NUM_DIST_POINTS - 2.5);
                    this.mTexDists[aDistIdx] = Math.pow(
                        this.mDists[aDistIdx],
                        1.0 + (1.0 - this.mFullPct.GetOutVal()) * 1.0
                    );
                    this.mDists[aDistIdx] *= aScale;
                    this.mAlphas[aDistIdx] =
                        this.mBaseAlpha +
                        this.mFullPct.GetOutVal() * (1.0 - this.mBaseAlpha) -
                        this.mTexDists[aDistIdx] * 0.5 * (1.0 - this.mFullPct.GetOutVal());
                    this.mTexDists[aDistIdx] *= 0.75 + this.mFullPct.GetOutVal() * 0.25;
                    if (aDistIdx == Game.CrystalBall.NUM_DIST_POINTS - 1) {
                        this.mAlphas[aDistIdx] = 1.0 - (1.0 - this.mFullPct.GetOutVal()) * 10.0;
                    }
                }
                for (var aRadIdx = 0; aRadIdx <= Game.CrystalBall.NUM_RADIAL_POINTS; aRadIdx++) {
                    var anAngle = ((aRadIdx + 0.5) / Game.CrystalBall.NUM_RADIAL_POINTS) * 3.14159 * 2.0;
                    this.mSins[aRadIdx] = Math.sin(anAngle);
                    this.mCoss[aRadIdx] = Math.cos(anAngle);
                    this.mDistMults[aRadIdx] =
                        1.0 + this.mFullPct.GetOutVal() * Math.pow(Math.abs(Math.sin(anAngle * 2.0)), 6.0) * 0.2;
                }
                if (this.mImage != null) {
                    var aVertices = Array.Create2D(
                        Game.CrystalBall.NUM_RADIAL_POINTS,
                        Game.CrystalBall.NUM_DIST_POINTS,
                        null
                    );
                    for (var aDistIdx_2 = 0; aDistIdx_2 < Game.CrystalBall.NUM_DIST_POINTS; aDistIdx_2++) {
                        for (var aRadIdx_2 = 0; aRadIdx_2 < Game.CrystalBall.NUM_RADIAL_POINTS; aRadIdx_2++) {
                            var aDist = this.mDists[aDistIdx_2] * this.mDistMults[aRadIdx_2];
                            var aRadX = 1200.0 / 2.0 + ((1920.0 - 1200.0) / 2.0) * this.mFullPct.GetOutVal();
                            var aRadY = 1200.0 / 2.0;
                            var aTexStretch = aRadX / aRadY / (1920.0 / 1200.0);
                            var aTexStretchY = 1.0;
                            var aTexDist = this.mTexDists[aDistIdx_2] * this.mDistMults[aRadIdx_2];
                            var aTexOffset = 0.0;
                            if (this.mImageSrcRect.mWidth != 0.0) {
                                aTexStretch *= this.mImage.mHeight / this.mImage.mWidth / (1200.0 / 1920.0);
                                aTexOffset =
                                    (this.mImageSrcRect.mX + ((this.mImageSrcRect.mWidth / 2) | 0)) /
                                        this.mImage.mWidth -
                                    0.5;
                            } else {
                                aTexStretch *= this.mImage.mHeight / this.mImage.mWidth / (1200.0 / 1920.0);
                            }
                            var anAlpha = this.mAlphas[aDistIdx_2];
                            var aVtx = new GameFramework.gfx.TriVertex(
                                this.mCoss[aRadIdx_2] * aRadX * aDist,
                                this.mSins[aRadIdx_2] * aRadY * aDist,
                                0.5 + this.mCoss[aRadIdx_2] * 0.5 * aTexDist * aTexStretch + aTexOffset,
                                0.5 + this.mSins[aRadIdx_2] * 0.5 * aTexDist * aTexStretchY,
                                GameFramework.gfx.Color.FAlphaToInt(Math.max(0.0, anAlpha))
                            );
                            aVertices[aVertices.mIdxMult0 * aRadIdx_2 + aDistIdx_2] = aVtx;
                        }
                    }
                    var aTriStrip = Array.Create(Game.CrystalBall.NUM_RADIAL_POINTS * 2 + 2, null);
                    for (var aDistIdx_3 = 0; aDistIdx_3 < Game.CrystalBall.NUM_DIST_POINTS - 1; aDistIdx_3++) {
                        for (var aRadIdx_3 = 0; aRadIdx_3 <= Game.CrystalBall.NUM_RADIAL_POINTS; aRadIdx_3++) {
                            aTriStrip[aRadIdx_3 * 2] =
                                aVertices[
                                    aVertices.mIdxMult0 * (aRadIdx_3 % Game.CrystalBall.NUM_RADIAL_POINTS) + aDistIdx_3
                                ];
                            aTriStrip[aRadIdx_3 * 2 + 1] =
                                aVertices[
                                    aVertices.mIdxMult0 * (aRadIdx_3 % Game.CrystalBall.NUM_RADIAL_POINTS) +
                                        aDistIdx_3 +
                                        1
                                ];
                        }
                        if (Game.BejApp.mBejApp.get_Is3D()) {
                            var aTriIdx = 0;
                            var aTriVertIdx = 0;
                            var aNumVertices = Game.CrystalBall.NUM_RADIAL_POINTS * 2;
                            var aTriangles = Array.Create2D(aNumVertices, 3, null);
                            aTriangles[aTriangles.mIdxMult0 * aTriIdx + 0] = aTriStrip[aTriVertIdx++];
                            aTriangles[aTriangles.mIdxMult0 * aTriIdx + 1] = aTriStrip[aTriVertIdx++];
                            aTriangles[aTriangles.mIdxMult0 * aTriIdx++ + 2] = aTriStrip[aTriVertIdx++];
                            --aNumVertices;
                            while (aNumVertices > 0) {
                                aTriangles[aTriangles.mIdxMult0 * aTriIdx + 0] = aTriStrip[aTriVertIdx - 2];
                                aTriangles[aTriangles.mIdxMult0 * aTriIdx + 1] = aTriStrip[aTriVertIdx - 1];
                                aTriangles[aTriangles.mIdxMult0 * aTriIdx++ + 2] = aTriStrip[aTriVertIdx++];
                                --aNumVertices;
                            }
                            g.DrawTrianglesTex(this.mImage, aTriangles);
                        }
                    }
                }
                this.mGlowEffect.mDrawTransform.identity();
                this.mGlowEffect.mDrawTransform.scale(aScaleX, aScaleY);
                if (drawEffects) {
                    this.mGlowEffect.Draw(g);
                }
            }
        } finally {
            _t1.Dispose();
        }
        g.PopMatrix();
        {
            g.PopMatrix();
        }
        var aScaleCurve = new GameFramework.CurvedVal();
        aScaleCurve.SetCurve("b+1,1.3,0,1,####         ~~###");
        aScale *= aScaleCurve.GetOutValAt(this.mMouseOverPct) * 4.0 + this.mExtraFontScaling;
        var aTextAlpha = (1.0 - this.mFullPct.GetOutVal() * 2.0) * this.mTextAlpha;
        if (this.mLabel.length > 0 && aTextAlpha > 0) {
            g.SetFont(Game.Resources["FONT_PLAYBUTTONS"]);
            var _t5 = g.PushScale(aScale, aScale, this.mWidth / 2, this.mHeight / 2);
            try {
                var _t6 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, (255.0 * aTextAlpha) | 0));
                try {
                    g.DrawString(
                        this.mLabel,
                        this.mWidth / 2 - Game.Resources["FONT_PLAYBUTTONS"].StringWidth(this.mLabel) / 2,
                        this.mHeight / 2 + 34
                    );
                } finally {
                    _t6.Dispose();
                }
            } finally {
                _t5.Dispose();
            }
        }
    },
    Update: function Game_CrystalBall$Update() {
        GameFramework.widgets.ButtonWidget.prototype.Update.apply(this);
        if (!this.mVisible) {
            return;
        }
        ++this.mUpdateCnt;
        this.mGlowEffect.Update();
        this.mRayEffect.Update();
        if (this.mIsOver) {
            this.mMouseOverPct = Math.min(1.0, this.mMouseOverPct + 0.05);
        } else {
            this.mMouseOverPct = Math.max(0.0, this.mMouseOverPct - 0.05);
        }
    },
    MouseDown: function Game_CrystalBall$MouseDown(x, y) {
        GameFramework.widgets.ButtonWidget.prototype.MouseDown.apply(this, [x, y]);
    },
};
Game.CrystalBall.staticInit = function Game_CrystalBall$staticInit() {
    Game.CrystalBall.NUM_DIST_POINTS = 10;
    Game.CrystalBall.NUM_RADIAL_POINTS = 30;
};

JSFExt_AddInitFunc(function () {
    Game.CrystalBall.registerClass("Game.CrystalBall", GameFramework.widgets.ButtonWidget);
});
JSFExt_AddStaticInitFunc(function () {
    Game.CrystalBall.staticInit();
});
