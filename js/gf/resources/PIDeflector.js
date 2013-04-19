GameFramework.resources.PIDeflector = function GameFramework_resources_PIDeflector() {
}
GameFramework.resources.PIDeflector.prototype = {
	mName : null,
	mBounce : 0,
	mHits : 0,
	mThickness : 0,
	mVisible : null,
	mPos : null,
	mActive : null,
	mAngle : null,
	mPoints : null,
	mCurPoints : null
}
GameFramework.resources.PIDeflector.staticInit = function GameFramework_resources_PIDeflector$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIDeflector.registerClass('GameFramework.resources.PIDeflector', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PIDeflector.staticInit();
});