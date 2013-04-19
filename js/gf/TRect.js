GameFramework.TRect = function GameFramework_TRect(theX, theY, theWidth, theHeight) {
	this.mX = theX;
	this.mY = theY;
	this.mWidth = theWidth;
	this.mHeight = theHeight;
}
GameFramework.TRect.prototype = {
	mX : 0,
	mY : 0,
	mWidth : 0,
	mHeight : 0,
	Intersects : function GameFramework_TRect$Intersects(theTRect) {
		return !((theTRect.mX + theTRect.mWidth <= this.mX) || (theTRect.mY + theTRect.mHeight <= this.mY) || (theTRect.mX >= this.mX + this.mWidth) || (theTRect.mY >= this.mY + this.mHeight));
	},
	Intersection : function GameFramework_TRect$Intersection(theTRect) {
		var x1 = Math.max(this.mX, theTRect.mX);
		var x2 = Math.min(this.mX + this.mWidth, theTRect.mX + theTRect.mWidth);
		var y1 = Math.max(this.mY, theTRect.mY);
		var y2 = Math.min(this.mY + this.mHeight, theTRect.mY + theTRect.mHeight);
		if(((x2 - x1) < 0) || ((y2 - y1) < 0)) {
			return new GameFramework.TRect(0, 0, 0, 0);
		} else {
			return new GameFramework.TRect(x1, y1, x2 - x1, y2 - y1);
		}
	},
	Union : function GameFramework_TRect$Union(theTRect) {
		var x1 = Math.min(this.mX, theTRect.mX);
		var x2 = Math.max(this.mX + this.mWidth, theTRect.mX + theTRect.mWidth);
		var y1 = Math.min(this.mY, theTRect.mY);
		var y2 = Math.max(this.mY + this.mHeight, theTRect.mY + theTRect.mHeight);
		return new GameFramework.TRect(x1, y1, x2 - x1, y2 - y1);
	},
	Contains : function GameFramework_TRect$Contains(theX, theY) {
		return ((theX >= this.mX) && (theX < this.mX + this.mWidth) && (theY >= this.mY) && (theY < this.mY + this.mHeight));
	},
	Offset : function GameFramework_TRect$Offset(theX, theY) {
		this.mX += theX;
		this.mY += theY;
	},
	Inflate : function GameFramework_TRect$Inflate(theX, theY) {
		this.mX -= theX;
		this.mWidth += theX * 2;
		this.mY -= theY;
		this.mHeight += theY * 2;
		return this;
	},
	Scale : function GameFramework_TRect$Scale(theScaleX, theScaleY) {
		this.mX = (this.mX * theScaleX);
		this.mY = (this.mY * theScaleY);
		this.mWidth = (this.mWidth * theScaleX);
		this.mHeight = (this.mHeight * theScaleY);
	},
	ScaleFrom : function GameFramework_TRect$ScaleFrom(theScaleX, theScaleY, theCenterX, theCenterY) {
		this.Offset(-theCenterX, -theCenterY);
		this.Scale(theScaleX, theScaleY);
		this.Offset(theCenterX, theCenterY);
	}
}
GameFramework.TRect.staticInit = function GameFramework_TRect$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.TRect.registerClass('GameFramework.TRect', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.TRect.staticInit();
});