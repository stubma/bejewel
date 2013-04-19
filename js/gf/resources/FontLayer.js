GameFramework.resources.FontLayer = function GameFramework_resources_FontLayer() {
	this.mRequiredTags = [];
	this.mExcludedTags = [];
	this.mCharHashtable = {};
}
GameFramework.resources.FontLayer.prototype = {
	mLayerName : null,
	mRequiredTags : null,
	mExcludedTags : null,
	mKerningData : null,
	mColorAdd : 0,
	mColorMult : 0,
	mDrawMode : 0,
	mOfsX : 0,
	mOfsY : 0,
	mSpacing : 0,
	mMinPointSize : 0,
	mMaxPointSize : 0,
	mPointSize : 0,
	mAscent : 0,
	mAscentPadding : 0,
	mHeight : 0,
	mDefaultHeight : 0,
	mLineSpacingOffset : 0,
	mBaseOrder : 0,
	mImage : null,
	mColorVector : null,
	mCharHashtable : null,
	ImageLoaded : function GameFramework_resources_FontLayer$ImageLoaded(e) {
		var aResourceStreamer = e.target;
		if(aResourceStreamer.mId != null) {
			this.mImage = GameFramework.BaseApp.mApp.mResourceManager.GetImageResourceById(aResourceStreamer.mId);
		} else {
			this.mImage = aResourceStreamer.mResultData;
		}

		{
			for($enum1 in this.mCharHashtable) {
				var aFontCharaData = this.mCharHashtable[$enum1];
				aFontCharaData.mImageInst = this.mImage.CreateImageInstRect(aFontCharaData.mRectX, aFontCharaData.mRectY, aFontCharaData.mRectWidth, aFontCharaData.mRectHeight);
			}
		}
	},
	PushColor : function GameFramework_resources_FontLayer$PushColor(theColor) {
		if(this.mColorVector == null) {
			this.mColorVector = [];
		}
		this.mColorVector.push(this.mColorMult);
		this.mColorMult = (((((((this.mColorMult >>> 24) & 0xff) * ((theColor >>> 24) & 0xff)) / 255) | 0)) << 24) | (((((((this.mColorMult >>> 16) & 0xff) * ((theColor >>> 16) & 0xff)) / 255) | 0)) << 16) | (((((((this.mColorMult >>> 8) & 0xff) * ((theColor >>> 8) & 0xff)) / 255) | 0)) << 8) | (((((((this.mColorMult >>> 0) & 0xff) * ((theColor >>> 0) & 0xff)) / 255) | 0)) << 0);
	},
	PopColor : function GameFramework_resources_FontLayer$PopColor() {
		this.mColorMult = ((this.mColorVector.pop()) | 0);
	}
}
GameFramework.resources.FontLayer.staticInit = function GameFramework_resources_FontLayer$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.FontLayer.registerClass('GameFramework.resources.FontLayer', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.FontLayer.staticInit();
});