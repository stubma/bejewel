GameFramework.resources.PILifeValueSample = function GameFramework_resources_PILifeValueSample() {
}
GameFramework.resources.PILifeValueSample.prototype = {
	mSizeX : 0,
	mSizeY : 0,
	mVelocity : 0,
	mWeight : 0,
	mSpin : 0,
	mMotionRand : 0,
	mColor : 0,
	Dispose : function GameFramework_resources_PILifeValueSample$Dispose() {
	}
}
GameFramework.resources.PILifeValueSample.staticInit = function GameFramework_resources_PILifeValueSample$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PILifeValueSample.registerClass('GameFramework.resources.PILifeValueSample', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PILifeValueSample.staticInit();
});