GameFramework.gfx.JSGraphics = function GameFramework_gfx_JSGraphics(theWidth, theHeight) {
    GameFramework.gfx.JSGraphics.initializeBase(this, [theWidth, theHeight]);
};
GameFramework.gfx.JSGraphics.prototype = {
    mLastColor: 0,
    mLastColorStr: "#800000",
    GetColorString: function GameFramework_gfx_JSGraphics$GetColorString() {
        if (this.mColor != this.mLastColor) {
            this.mLastColorStr =
                "rgba(" +
                ((this.mColor >>> 16) & 0xff) +
                "," +
                ((this.mColor >>> 8) & 0xff) +
                "," +
                (this.mColor & 0xff) +
                "," +
                ((this.mColor >>> 24) & 0xff) / 255.0 +
                ")";
            this.mLastColor = this.mColor;
        }
        return this.mLastColorStr;
    },
    FillRect: function GameFramework_gfx_JSGraphics$FillRect(x, y, w, h) {
        var aColorStr = this.GetColorString();
        if (GameFramework.JSBaseApp.mJSApp.mUseGL) {
            //JS
            var aStartX = ((x * this.mMatrix.a + this.mMatrix.tx) * this.mScale) | 0;
            var aStartY = ((y * this.mMatrix.d + this.mMatrix.ty) * this.mScale) | 0;
            var anEndX = (((x + w) * this.mMatrix.a + this.mMatrix.tx) * this.mScale) | 0;
            var anEndY = (((y + h) * this.mMatrix.d + this.mMatrix.ty) * this.mScale) | 0;
            JSFExt_GLDraw(
                gWhiteDotTex,
                aStartX,
                aStartY,
                1,
                0,
                0,
                1,
                0,
                0,
                anEndX - aStartX,
                anEndY - aStartY,
                1,
                1,
                false,
                this.mColor
            );
            //-JS
        } else {
            //JS
            var ctx = document.getElementById("GameCanvas").getContext("2d");
            ctx.fillStyle = aColorStr;
            ctx.globalAlpha = 1.0;
            gCanvasAlpha = 1.0;
            if (this.mMatrix.b == 0 && this.mMatrix.c == 0) {
                var aScaleX = this.mScale * this.mMatrix.a;
                var aScaleY = this.mScale * this.mMatrix.d;

                var aStartX = (this.mMatrix.tx * this.mScale + x * aScaleX) | 0;
                var aStartY = (this.mMatrix.ty * this.mScale + y * aScaleY) | 0;
                var anEndX = (this.mMatrix.tx * this.mScale + (x + w) * aScaleX) | 0;
                var anEndY = (this.mMatrix.ty * this.mScale + (y + h) * aScaleY) | 0;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.fillRect(aStartX, aStartY, anEndX - aStartX, anEndY - aStartY);
                gCanvasHasTrans = false;
            } else {
                var aNewMatrix = new GameFramework.geom.Matrix();
                aNewMatrix.identity();
                aNewMatrix.tx = x;
                aNewMatrix.ty = y;
                aNewMatrix.a = w;
                aNewMatrix.d = h;
                aNewMatrix.concat(this.mMatrix);

                ctx.setTransform(aNewMatrix.a, aNewMatrix.b, aNewMatrix.c, aNewMatrix.d, aNewMatrix.tx, aNewMatrix.ty);
                ctx.fillRect(0, 0, 1, 1);
                gCanvasHasTrans = true;
            }
            //-JS
        }
    },
    PolyFill: function GameFramework_gfx_JSGraphics$PolyFill(thePoints) {
        for (var aPtIdx = 0; aPtIdx < ((thePoints.length / 2) | 0) - 2; aPtIdx++) {
            var aX1 =
                (this.mMatrix.tx +
                    this.mMatrix.a * thePoints[thePoints.mIdxMult0 * aPtIdx + 0] +
                    this.mMatrix.c * thePoints[thePoints.mIdxMult0 * aPtIdx + 1]) *
                this.mScale;
            var aY1 =
                (this.mMatrix.ty +
                    this.mMatrix.c * thePoints[thePoints.mIdxMult0 * aPtIdx + 0] +
                    this.mMatrix.d * thePoints[thePoints.mIdxMult0 * aPtIdx + 1]) *
                this.mScale;
            var aX2 =
                (this.mMatrix.tx +
                    this.mMatrix.a * thePoints[thePoints.mIdxMult0 * aPtIdx + 2] +
                    this.mMatrix.c * thePoints[thePoints.mIdxMult0 * aPtIdx + 3]) *
                this.mScale;
            var aY2 =
                (this.mMatrix.ty +
                    this.mMatrix.c * thePoints[thePoints.mIdxMult0 * aPtIdx + 2] +
                    this.mMatrix.d * thePoints[thePoints.mIdxMult0 * aPtIdx + 3]) *
                this.mScale;
            var aX3 =
                (this.mMatrix.tx +
                    this.mMatrix.a * thePoints[thePoints.mIdxMult0 * aPtIdx + 4] +
                    this.mMatrix.c * thePoints[thePoints.mIdxMult0 * aPtIdx + 5]) *
                this.mScale;
            var aY3 =
                (this.mMatrix.ty +
                    this.mMatrix.c * thePoints[thePoints.mIdxMult0 * aPtIdx + 4] +
                    this.mMatrix.d * thePoints[thePoints.mIdxMult0 * aPtIdx + 5]) *
                this.mScale;
            if (GameFramework.JSBaseApp.mJSApp.mUseGL) {
                //JS
                JSFExt_GLDrawTri(gWhiteDotTex, aX1, aY1, aX2, aY2, aX3, aY3, false, this.mColor);
                //-JS
            } else {
                var aColorStr = this.GetColorString();
                //JS
                var ctx = document.getElementById("GameCanvas").getContext("2d");
                ctx.fillStyle = aColorStr;
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.beginPath();
                ctx.moveTo(aX1, aY1);
                ctx.lineTo(aX2, aY2);
                ctx.lineTo(aX3, aY3);
                ctx.closePath();
                ctx.fill();
                //-JS
            }
        }
    },
    DrawTrianglesTex: function GameFramework_gfx_JSGraphics$DrawTrianglesTex(theImage, theVertices) {
        for (var aVtxIdx = 0; aVtxIdx < ((theVertices.length / 3) | 0); aVtxIdx++) {
            var aX1 =
                (this.mMatrix.tx +
                    this.mMatrix.a * theVertices[theVertices.mIdxMult0 * aVtxIdx + 0].x +
                    this.mMatrix.c * theVertices[theVertices.mIdxMult0 * aVtxIdx + 0].y) *
                this.mScale;
            var aY1 =
                (this.mMatrix.ty +
                    this.mMatrix.c * theVertices[theVertices.mIdxMult0 * aVtxIdx + 0].x +
                    this.mMatrix.d * theVertices[theVertices.mIdxMult0 * aVtxIdx + 0].y) *
                this.mScale;
            var aX2 =
                (this.mMatrix.tx +
                    this.mMatrix.a * theVertices[theVertices.mIdxMult0 * aVtxIdx + 1].x +
                    this.mMatrix.c * theVertices[theVertices.mIdxMult0 * aVtxIdx + 1].y) *
                this.mScale;
            var aY2 =
                (this.mMatrix.ty +
                    this.mMatrix.c * theVertices[theVertices.mIdxMult0 * aVtxIdx + 1].x +
                    this.mMatrix.d * theVertices[theVertices.mIdxMult0 * aVtxIdx + 1].y) *
                this.mScale;
            var aX3 =
                (this.mMatrix.tx +
                    this.mMatrix.a * theVertices[theVertices.mIdxMult0 * aVtxIdx + 2].x +
                    this.mMatrix.c * theVertices[theVertices.mIdxMult0 * aVtxIdx + 2].y) *
                this.mScale;
            var aY3 =
                (this.mMatrix.ty +
                    this.mMatrix.c * theVertices[theVertices.mIdxMult0 * aVtxIdx + 2].x +
                    this.mMatrix.d * theVertices[theVertices.mIdxMult0 * aVtxIdx + 2].y) *
                this.mScale;
            if (GameFramework.JSBaseApp.mJSApp.mUseGL) {
                //JS
                JSFExt_GLDrawTriTex(
                    theImage.mGLTex,
                    aX1,
                    aY1,
                    (theVertices[aVtxIdx * 3 + 0].u * theImage.mPhysCelWidth + theImage.mTexOfsX) / theImage.mTexWidth,
                    (theVertices[aVtxIdx * 3 + 0].v * theImage.mPhysCelHeight + theImage.mTexOfsY) /
                        theImage.mTexHeight,
                    theVertices[aVtxIdx * 3 + 0].color,
                    aX2,
                    aY2,
                    (theVertices[aVtxIdx * 3 + 1].u * theImage.mPhysCelWidth + theImage.mTexOfsX) / theImage.mTexWidth,
                    (theVertices[aVtxIdx * 3 + 1].v * theImage.mPhysCelHeight + theImage.mTexOfsY) /
                        theImage.mTexHeight,
                    theVertices[aVtxIdx * 3 + 1].color,
                    aX3,
                    aY3,
                    (theVertices[aVtxIdx * 3 + 2].u * theImage.mPhysCelWidth + theImage.mTexOfsX) / theImage.mTexWidth,
                    (theVertices[aVtxIdx * 3 + 2].v * theImage.mPhysCelHeight + theImage.mTexOfsY) /
                        theImage.mTexHeight,
                    theVertices[aVtxIdx * 3 + 2].color,
                    theImage.mAdditive
                );
                //-JS
            }
        }
    },
    Begin3DScene: function GameFramework_gfx_JSGraphics$Begin3DScene(
        theViewMatrix,
        theWorldMatrix,
        theProjectionMatrix
    ) {
        if (theViewMatrix === undefined) {
            theViewMatrix = null;
        }
        if (theWorldMatrix === undefined) {
            theWorldMatrix = null;
        }
        if (theProjectionMatrix === undefined) {
            theProjectionMatrix = null;
        }
        //JS
        JSFExt_Begin3DScene();
        //-JS
        var aGraphics3D = new GameFramework.gfx.JSGraphics3D(this);
        if (theViewMatrix != null) {
            aGraphics3D.SetViewTransform(theViewMatrix);
        }
        if (theWorldMatrix != null) {
            aGraphics3D.SetViewTransform(theWorldMatrix);
        }
        if (theProjectionMatrix != null) {
            aGraphics3D.SetViewTransform(theProjectionMatrix);
        }
        return aGraphics3D;
    },
    End3DScene: function GameFramework_gfx_JSGraphics$End3DScene(theGraphics3D) {
        //JS
        JSFExt_End3DScene();
        //-JS
    },
};
GameFramework.gfx.JSGraphics.staticInit = function GameFramework_gfx_JSGraphics$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.gfx.JSGraphics.registerClass("GameFramework.gfx.JSGraphics", GameFramework.gfx.Graphics);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.gfx.JSGraphics.staticInit();
});
