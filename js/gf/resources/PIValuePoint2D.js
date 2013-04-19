GameFramework.resources.PIValuePoint2D = function GameFramework_resources_PIValuePoint2D() {
}
GameFramework.resources.PIValuePoint2D.prototype = {
	mTime : 0,
	mValue : null,
	Dispose : function GameFramework_resources_PIValuePoint2D$Dispose() {
	}
}
GameFramework.resources.PIValuePoint2D.staticInit = function GameFramework_resources_PIValuePoint2D$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIValuePoint2D.registerClass('GameFramework.resources.PIValuePoint2D', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PIValuePoint2D.staticInit();
});