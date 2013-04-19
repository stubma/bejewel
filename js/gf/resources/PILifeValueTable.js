GameFramework.resources.PILifeValueTable = function GameFramework_resources_PILifeValueTable() {
}
GameFramework.resources.PILifeValueTable.prototype = {
	mLifeValuesSampleTable : null,
	Dispose : function GameFramework_resources_PILifeValueTable$Dispose() {
	}
}
GameFramework.resources.PILifeValueTable.staticInit = function GameFramework_resources_PILifeValueTable$staticInit() {
	GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE = 32;
	GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT = (31 - 5);
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PILifeValueTable.registerClass('GameFramework.resources.PILifeValueTable', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PILifeValueTable.staticInit();
});
GameFramework.resources.PILifeValueTable.LifeValue = {};
GameFramework.resources.PILifeValueTable.LifeValue.staticInit = function GameFramework_resources_PILifeValueTable_LifeValue$staticInit() {
	GameFramework.resources.PILifeValueTable.LifeValue.SIZE_X = 0;
	GameFramework.resources.PILifeValueTable.LifeValue.SIZE_Y = 1;
	GameFramework.resources.PILifeValueTable.LifeValue.VELOCITY = 2;
	GameFramework.resources.PILifeValueTable.LifeValue.WEIGHT = 3;
	GameFramework.resources.PILifeValueTable.LifeValue.SPIN = 4;
	GameFramework.resources.PILifeValueTable.LifeValue.MOTION_RAND = 5;
	GameFramework.resources.PILifeValueTable.LifeValue.COLOR = 6;
	GameFramework.resources.PILifeValueTable.LifeValue.ALPHA = 7;
	GameFramework.resources.PILifeValueTable.LifeValue.__COUNT = 8;
}
JSFExt_AddInitFunc(function() {
	GameFramework.resources.PILifeValueTable.LifeValue.staticInit();
});