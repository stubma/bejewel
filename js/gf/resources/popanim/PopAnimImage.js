GameFramework.resources.popanim.PopAnimImage = function GameFramework_resources_popanim_PopAnimImage() {
	this.mImages = [];
	this.mImageNames = [];
}
GameFramework.resources.popanim.PopAnimImage.prototype = {
	mImages : null,
	mImageNames : null,
	mOrigHeight : 0,
	mOrigWidth : 0,
	mCols : 0,
	mRows : 0,
	mImageName : null,
	mDrawMode : 0,
	mTransform : null,
	ImageLoaded : function GameFramework_resources_popanim_PopAnimImage$ImageLoaded(e) {
		var aResourceStreamer = (e.target);
		var anImageResource = (aResourceStreamer.mResultData);
		this.mImages[this.mImageNames.indexOf(aResourceStreamer.mId)] = anImageResource;
	}
}
GameFramework.resources.popanim.PopAnimImage.staticInit = function GameFramework_resources_popanim_PopAnimImage$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.popanim.PopAnimImage.registerClass('GameFramework.resources.popanim.PopAnimImage', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.popanim.PopAnimImage.staticInit();
});