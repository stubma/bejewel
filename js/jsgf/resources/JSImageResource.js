GameFramework.resources.JSImageResource = function GameFramework_resources_JSImageResource() {
    GameFramework.resources.JSImageResource.initializeBase(this);
};
GameFramework.resources.JSImageResource.prototype = {
    mHTMLImageResource: null,
    mColorImage: null,
    mAlphaImage: null,
    mGLTex: null,
    mCompositeImageData: null,
    mOwnsImageData: null,
    mTexOfsX: 0,
    mTexOfsY: 0,
    mTexWidth: 0,
    mTexHeight: 0,
    DrawEx: function GameFramework_resources_JSImageResource$DrawEx(g, theMatrix, theX, theY, theCel) {
        var aCol = (theCel | 0) % this.mCols | 0;
        var aRow = ((theCel | 0) / this.mCols) | 0 | 0;
        var aColPX = this.mPhysCelWidth;
        var aRowPX = this.mPhysCelHeight;
        var aNewMatrix = new GameFramework.geom.Matrix();
        aNewMatrix.identity();
        aNewMatrix.tx = theX;
        aNewMatrix.ty = theY;
        aNewMatrix.concat(theMatrix);
        aNewMatrix.tx *= g.mScale;
        aNewMatrix.ty *= g.mScale;
        if (
            this.mPixelSnapping == GameFramework.resources.PixelSnapping.Always ||
            (this.mPixelSnapping == GameFramework.resources.PixelSnapping.Auto &&
                aNewMatrix.a == 1 &&
                aNewMatrix.b == 0 &&
                aNewMatrix.c == 0 &&
                aNewMatrix.d == 1)
        ) {
            var aSnappedX = Math.round(aNewMatrix.tx);
            var aSnappedY = Math.round(aNewMatrix.ty);
            if (this.mSizeSnapping) {
                aNewMatrix.a =
                    (Math.round(aNewMatrix.tx + this.mPhysCelWidth * aNewMatrix.a) - aSnappedX) / this.mPhysCelWidth;
                aNewMatrix.d =
                    (Math.round(aNewMatrix.ty + this.mPhysCelHeight * aNewMatrix.d) - aSnappedY) / this.mPhysCelHeight;
            }
            aNewMatrix.tx = aSnappedX;
            aNewMatrix.ty = aSnappedY;
        }
        var aJSGraphics = g;
        if (GameFramework.JSBaseApp.mJSApp.mUseGL) {
            //JS
            JSFExt_GLDraw(
                this.mGLTex,
                aNewMatrix.tx,
                aNewMatrix.ty,
                aNewMatrix.a,
                aNewMatrix.b,
                aNewMatrix.c,
                aNewMatrix.d,
                aCol * aColPX + this.mTexOfsX,
                aRow * aRowPX + this.mTexOfsY,
                aColPX,
                aRowPX,
                this.mTexWidth,
                this.mTexHeight,
                this.mAdditive,
                g.mColor
            );
            //-JS
        } else {
            var aGlobalAlpha = (g.mColor >>> 24) / 255.0;
            //JS
            JSFExt_CanvasDraw(
                this.mHTMLImageResource,
                aGlobalAlpha,
                this.mAdditive,
                aNewMatrix.a,
                aNewMatrix.b,
                aNewMatrix.c,
                aNewMatrix.d,
                aNewMatrix.tx,
                aNewMatrix.ty,
                this.mTexOfsX + aCol * aColPX,
                this.mTexOfsY + aRow * aRowPX,
                aColPX,
                aRowPX
            );
            //-JS
        }
    },
    Dispose: function GameFramework_resources_JSImageResource$Dispose() {
        GameFramework.resources.ImageResource.prototype.Dispose.apply(this);
        if (this.mGLTex != null && this.mOwnsImageData) {
            //JS
            gGL.deleteTexture(this.mGLTex);
            //-JS
        }
        this.mGLTex = null;
        this.mHTMLImageResource = null;
    },
    CreateImageInst: function GameFramework_resources_JSImageResource$CreateImageInst() {
        var anImageInst = new GameFramework.resources.JSImageInst(this);
        anImageInst.mSrcX = 0;
        anImageInst.mSrcY = 0;
        anImageInst.mSrcWidth = this.mPhysCelWidth;
        anImageInst.mSrcHeight = this.mPhysCelHeight;
        return anImageInst;
    },
    CreateImageInstCel: function GameFramework_resources_JSImageResource$CreateImageInstCel(theCel) {
        var aCol = theCel % this.mCols;
        var aRow = (theCel / this.mCols) | 0;
        var anImageInst = new GameFramework.resources.JSImageInst(this);
        anImageInst.mSrcX = aCol * this.mPhysCelWidth;
        anImageInst.mSrcY = aRow * this.mPhysCelHeight;
        anImageInst.mSrcWidth = this.mPhysCelWidth;
        anImageInst.mSrcHeight = this.mPhysCelHeight;
        return anImageInst;
    },
    CreateImageInstRect: function GameFramework_resources_JSImageResource$CreateImageInstRect(
        theSrcX,
        theSrcY,
        theSrcWidth,
        theSrcHeight
    ) {
        var anImageInst = new GameFramework.resources.JSImageInst(this);
        anImageInst.mSrcX = theSrcX;
        anImageInst.mSrcY = theSrcY;
        anImageInst.mSrcWidth = theSrcWidth;
        anImageInst.mSrcHeight = theSrcHeight;
        return anImageInst;
    },
};
GameFramework.resources.JSImageResource.staticInit = function GameFramework_resources_JSImageResource$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.JSImageResource.registerClass(
        "GameFramework.resources.JSImageResource",
        GameFramework.resources.ImageResource
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.JSImageResource.staticInit();
});
