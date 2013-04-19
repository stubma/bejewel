GameFramework.misc.CurveCacheRecord = function GameFramework_misc_CurveCacheRecord() {
}
GameFramework.misc.CurveCacheRecord.prototype = {
	mTable : null,
	mHermiteCurve : null,
	mDataStr : null
}
GameFramework.misc.CurveCacheRecord.staticInit = function GameFramework_misc_CurveCacheRecord$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.misc.CurveCacheRecord.registerClass('GameFramework.misc.CurveCacheRecord', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.misc.CurveCacheRecord.staticInit();
});