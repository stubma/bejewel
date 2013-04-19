GameFramework.resources.PIForce = function GameFramework_resources_PIForce() {
	this.mCurPoints = Array.Create(5, null);
}
GameFramework.resources.PIForce.prototype = {
	mName : null,
	mVisible : null,
	mPos : null,
	mStrength : null,
	mDirection : null,
	mActive : null,
	mAngle : null,
	mWidth : null,
	mHeight : null,
	mCurPoints : null
}
GameFramework.resources.PIForce.staticInit = function GameFramework_resources_PIForce$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIForce.registerClass('GameFramework.resources.PIForce', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PIForce.staticInit();
});