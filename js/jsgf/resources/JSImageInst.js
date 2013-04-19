GameFramework.resources.JSImageInst = function GameFramework_resources_JSImageInst(theImageResource) {
	GameFramework.resources.JSImageInst.initializeBase(this, [theImageResource]);
}
GameFramework.resources.JSImageInst.prototype = {

	DrawEx : function GameFramework_resources_JSImageInst$DrawEx(g, theMatrix, theX, theY, theCel) {
		if((this.mSrcWidth == 0) || (this.mSrcHeight == 0)) {
			return;
		}
		var aGlobalAlpha = (g.mColor >>> 24) / 255.0;
		var aNewMatrix = new GameFramework.geom.Matrix();
		aNewMatrix.tx = theX;
		aNewMatrix.ty = theY;
		aNewMatrix.concat(theMatrix);
		aNewMatrix.tx *= g.mScale;
		aNewMatrix.ty *= g.mScale;
		if((this.mPixelSnapping == GameFramework.resources.PixelSnapping.Always) || ((this.mPixelSnapping == GameFramework.resources.PixelSnapping.Auto) && (aNewMatrix.a == 1) && (aNewMatrix.b == 0) && (aNewMatrix.c == 0) && (aNewMatrix.d == 1))) {
			var aSnappedX = (((aNewMatrix.tx) | 0));
			var aSnappedY = (((aNewMatrix.ty) | 0));
			if(this.mSizeSnapping) {
				aNewMatrix.a = ((((aNewMatrix.tx + this.mSrcWidth * aNewMatrix.a) | 0)) - aSnappedX) / this.mSrcWidth;
				aNewMatrix.d = ((((aNewMatrix.ty + this.mSrcHeight * aNewMatrix.d) | 0)) - aSnappedY) / this.mSrcHeight;
			}
			aNewMatrix.tx = aSnappedX;
			aNewMatrix.ty = aSnappedY;
		}
		if(GameFramework.JSBaseApp.mJSApp.mUseGL) {
			//JS
			JSFExt_GLDraw(this.mSource.mGLTex, aNewMatrix.tx, aNewMatrix.ty, aNewMatrix.a, aNewMatrix.b, aNewMatrix.c, aNewMatrix.d, this.mSrcX + this.mSource.mTexOfsX, this.mSrcY + this.mSource.mTexOfsY, this.mSrcWidth, this.mSrcHeight, this.mSource.mTexWidth, this.mSource.mTexHeight, this.mAdditive, g.mColor);
			//-JS
		} else {
			//JS
			JSFExt_CanvasDraw(this.mSource.mHTMLImageResource, aGlobalAlpha, this.mAdditive, aNewMatrix.a, aNewMatrix.b, aNewMatrix.c, aNewMatrix.d, aNewMatrix.tx, aNewMatrix.ty, this.mSource.mTexOfsX + this.mSrcX, this.mSource.mTexOfsY + this.mSrcY, this.mSrcWidth, this.mSrcHeight);
			//-JS
		}
	}
}
GameFramework.resources.JSImageInst.staticInit = function GameFramework_resources_JSImageInst$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.JSImageInst.registerClass('GameFramework.resources.JSImageInst', GameFramework.resources.ImageInst);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.JSImageInst.staticInit();
});