GameFramework.resources.FontDrawData = function GameFramework_resources_FontDrawData() {
}
GameFramework.resources.FontDrawData.prototype = {
	mFirstDraw : true,
	mMinDrawX : 0,
	mMinDrawY : 0,
	mMaxDrawX : 0,
	mMaxDrawY : 0,
	mFontMinRelX : 0,
	mFontMinRelY : 0,
	mFontAscent : 0,
	mFontDescent : 0
}
GameFramework.resources.FontDrawData.staticInit = function GameFramework_resources_FontDrawData$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.FontDrawData.registerClass('GameFramework.resources.FontDrawData', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.FontDrawData.staticInit();
});