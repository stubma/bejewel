GameFramework.TIntRect = function GameFramework_TIntRect(theX, theY, theWidth, theHeight) {
	this.mX = theX;
	this.mY = theY;
	this.mWidth = theWidth;
	this.mHeight = theHeight;
}
GameFramework.TIntRect.prototype = {
	mX : 0,
	mY : 0,
	mWidth : 0,
	mHeight : 0,
	Intersects : function GameFramework_TIntRect$Intersects(theTRect) {
		return !((theTRect.mX + theTRect.mWidth <= this.mX) || (theTRect.mY + theTRect.mHeight <= this.mY) || (theTRect.mX >= this.mX + this.mWidth) || (theTRect.mY >= this.mY + this.mHeight));
	},
	Intersection : function GameFramework_TIntRect$Intersection(theTRect) {
		var x1 = ((Math.max(this.mX, theTRect.mX)) | 0);
		var x2 = ((Math.min(this.mX + this.mWidth, theTRect.mX + theTRect.mWidth)) | 0);
		var y1 = ((Math.max(this.mY, theTRect.mY)) | 0);
		var y2 = ((Math.min(this.mY + this.mHeight, theTRect.mY + theTRect.mHeight)) | 0);
		if(((x2 - x1) < 0) || ((y2 - y1) < 0)) {
			return new GameFramework.TIntRect(0, 0, 0, 0);
		} else {
			return new GameFramework.TIntRect(x1, y1, x2 - x1, y2 - y1);
		}
	},
	Union : function GameFramework_TIntRect$Union(theTRect) {
		var x1 = ((Math.min(this.mX, theTRect.mX)) | 0);
		var x2 = ((Math.max(this.mX + this.mWidth, theTRect.mX + theTRect.mWidth)) | 0);
		var y1 = ((Math.min(this.mY, theTRect.mY)) | 0);
		var y2 = ((Math.max(this.mY + this.mHeight, theTRect.mY + theTRect.mHeight)) | 0);
		return new GameFramework.TIntRect(x1, y1, x2 - x1, y2 - y1);
	},
	Contains : function GameFramework_TIntRect$Contains(theX, theY) {
		return ((theX >= this.mX) && (theX < this.mX + this.mWidth) && (theY >= this.mY) && (theY < this.mY + this.mHeight));
	},
	Offset : function GameFramework_TIntRect$Offset(theX, theY) {
		this.mX += theX;
		this.mY += theY;
	},
	Inflate : function GameFramework_TIntRect$Inflate(theX, theY) {
		this.mX -= theX;
		this.mWidth += theX * 2;
		this.mY -= theY;
		this.mHeight += theY * 2;
		return this;
	},
	Scale : function GameFramework_TIntRect$Scale(theScaleX, theScaleY) {
		this.mX = ((this.mX * theScaleX) | 0);
		this.mY = ((this.mY * theScaleY) | 0);
		this.mWidth = ((this.mWidth * theScaleX) | 0);
		this.mHeight = ((this.mHeight * theScaleY) | 0);
	},
	ScaleFrom : function GameFramework_TIntRect$ScaleFrom(theScaleX, theScaleY, theCenterX, theCenterY) {
		this.Offset(-theCenterX, -theCenterY);
		this.Scale(theScaleX, theScaleY);
		this.Offset(theCenterX, theCenterY);
	}
}
GameFramework.TIntRect.staticInit = function GameFramework_TIntRect$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.TIntRect.registerClass('GameFramework.TIntRect', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.TIntRect.staticInit();
});