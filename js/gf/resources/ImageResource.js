GameFramework.resources.ImageResource = function GameFramework_resources_ImageResource() {
	this.mPixelSnapping = GameFramework.resources.PixelSnapping.Auto;
	GameFramework.resources.ImageResource.mInstanceCount++;
	this.mId = GameFramework.resources.ImageResource.mInstanceCount;
}
GameFramework.resources.ImageResource.prototype = {
	mRows : 1,
	mCols : 1,
	mNumFrames : 1,
	mId : 0,
	mPhysCelWidth : 0,
	mPhysCelHeight : 0,
	mContentScale : 1.0,
	mWidth : 0,
	mHeight : 0,
	mAdjustedWidth : 0,
	mAdjustedHeight : 0,
	mAdditive : false,
	mSmoothing : true,
	mPixelSnapping : null,
	mSizeSnapping : false,
	mOffsetX : 0,
	mOffsetY : 0,
	mOffsetImageResource : null,
	mCenteredImageResource : null,
	get_Additive : function GameFramework_resources_ImageResource$get_Additive() {
		return this.mAdditive;
	},
	set_Additive : function GameFramework_resources_ImageResource$set_Additive(value) {
		this.mAdditive = value;
	},
	Dispose : function GameFramework_resources_ImageResource$Dispose() {
	},
	DrawEx : function GameFramework_resources_ImageResource$DrawEx(g, theMatrix, theX, theY, theCel) {
	},
	get_OffsetImage : function GameFramework_resources_ImageResource$get_OffsetImage() {
		if(this.mOffsetImageResource == null) {
			this.mOffsetImageResource = new GameFramework.gfx.OffsetDrawable(this, this.mOffsetX, this.mOffsetY);
		}
		return this.mOffsetImageResource;
	},
	get_CenteredImage : function GameFramework_resources_ImageResource$get_CenteredImage() {
		if(this.mCenteredImageResource == null) {
			this.mCenteredImageResource = new GameFramework.gfx.OffsetDrawable(this, -this.mWidth / 2.0, -this.mHeight / 2.0);
		}
		return this.mCenteredImageResource;
	},
	GetRotatedImage : function GameFramework_resources_ImageResource$GetRotatedImage(theAngle) {
		var aMatrix = new GameFramework.geom.Matrix();
		aMatrix.translate(-this.mWidth / 2.0, -this.mHeight / 2.0);
		aMatrix.rotate(theAngle);
		aMatrix.translate(this.mWidth / 2.0, this.mHeight / 2.0);
		return new GameFramework.gfx.TransformedDrawable(this, aMatrix);
	},
	GetRotatedImageEx : function GameFramework_resources_ImageResource$GetRotatedImageEx(theAngle, theCenterX, theCenterY) {
		var aMatrix = new GameFramework.geom.Matrix();
		aMatrix.translate(-theCenterX, -theCenterY);
		aMatrix.rotate(theAngle);
		aMatrix.translate(theCenterX, theCenterY);
		return new GameFramework.gfx.TransformedDrawable(this, aMatrix);
	},
	CreateImageInst : function GameFramework_resources_ImageResource$CreateImageInst() {
		var anImageInst = new GameFramework.resources.ImageInst(this);
		anImageInst.mSrcX = 0;
		anImageInst.mSrcY = 0;
		anImageInst.mSrcWidth = this.mPhysCelWidth;
		anImageInst.mSrcHeight = this.mPhysCelHeight;
		return anImageInst;
	},
	CreateImageInstCel : function GameFramework_resources_ImageResource$CreateImageInstCel(theCel) {
		var aCol = theCel % this.mCols;
		var aRow = ((theCel / this.mCols) | 0);
		var anImageInst = new GameFramework.resources.ImageInst(this);
		anImageInst.mSource = this;
		anImageInst.mSrcX = aCol * this.mPhysCelWidth;
		anImageInst.mSrcY = aRow * this.mPhysCelHeight;
		anImageInst.mSrcWidth = this.mPhysCelWidth;
		anImageInst.mSrcHeight = this.mPhysCelHeight;
		return anImageInst;
	},
	CreateImageInstRect : function GameFramework_resources_ImageResource$CreateImageInstRect(theSrcX, theSrcY, theSrcWidth, theSrcHeight) {
		var anImageInst = new GameFramework.resources.ImageInst(this);
		anImageInst.mSource = this;
		anImageInst.mSrcX = theSrcX;
		anImageInst.mSrcY = theSrcY;
		anImageInst.mSrcWidth = theSrcWidth;
		anImageInst.mSrcHeight = theSrcHeight;
		return anImageInst;
	}
}
GameFramework.resources.ImageResource.staticInit = function GameFramework_resources_ImageResource$staticInit() {
	GameFramework.resources.ImageResource.mInstanceCount = 0;
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.ImageResource.registerClass('GameFramework.resources.ImageResource', null, GameFramework.gfx.IDrawable, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.ImageResource.staticInit();
});