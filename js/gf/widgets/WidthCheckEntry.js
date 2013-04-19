GameFramework.widgets.WidthCheckEntry = function GameFramework_widgets_WidthCheckEntry() {
}
GameFramework.widgets.WidthCheckEntry.prototype = {
	mFontResource : null,
	mWidth : 0
}
GameFramework.widgets.WidthCheckEntry.staticInit = function GameFramework_widgets_WidthCheckEntry$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.widgets.WidthCheckEntry.registerClass('GameFramework.widgets.WidthCheckEntry', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.widgets.WidthCheckEntry.staticInit();
});