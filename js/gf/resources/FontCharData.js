GameFramework.resources.FontCharData = function GameFramework_resources_FontCharData() {
}
GameFramework.resources.FontCharData.prototype = {
	mChar : 0,
	mRectX : 0,
	mRectY : 0,
	mRectWidth : 0,
	mRectHeight : 0,
	mOffsetX : 0,
	mOffsetY : 0,
	mKerningFirst : 0,
	mKerningCount : 0,
	mWidth : 0,
	mOrder : 0,
	mImageInst : null
}
GameFramework.resources.FontCharData.staticInit = function GameFramework_resources_FontCharData$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.FontCharData.registerClass('GameFramework.resources.FontCharData', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.FontCharData.staticInit();
});