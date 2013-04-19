GameFramework.JSONHelperData = function GameFramework_JSONHelperData() {
}
GameFramework.JSONHelperData.prototype = {
	mLineNum : 1,
	mStrIdx : 0
}
GameFramework.JSONHelperData.staticInit = function GameFramework_JSONHelperData$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.JSONHelperData.registerClass('GameFramework.JSONHelperData', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.JSONHelperData.staticInit();
});