GameFramework.resources.PIValuePoint = function GameFramework_resources_PIValuePoint() {
}
GameFramework.resources.PIValuePoint.prototype = {
	mTime : 0,
	mValue : 0,
	Dispose : function GameFramework_resources_PIValuePoint$Dispose() {
	}
}
GameFramework.resources.PIValuePoint.staticInit = function GameFramework_resources_PIValuePoint$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIValuePoint.registerClass('GameFramework.resources.PIValuePoint', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PIValuePoint.staticInit();
});