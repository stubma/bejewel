GameFramework.resources.PIEmitterInstanceDef = function GameFramework_resources_PIEmitterInstanceDef() {
}
GameFramework.resources.PIEmitterInstanceDef.prototype = {
	mName : null,
	mFramesToPreload : 0,
	mEmitterDefIdx : 0,
	mEmitterGeom : null,
	mEmitIn : null,
	mEmitOut : null,
	mEmitAtPointsNum : 0,
	mEmitAtPointsNum2 : 0,
	mIsSuperEmitter : null,
	mFreeEmitterIndices : null,
	mInvertMask : null,
	mPosition : null,
	mValues : null,
	mPoints : null,
	mCurAngle : 0,
	Dispose : function GameFramework_resources_PIEmitterInstanceDef$Dispose() {
	}
}
GameFramework.resources.PIEmitterInstanceDef.staticInit = function GameFramework_resources_PIEmitterInstanceDef$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIEmitterInstanceDef.registerClass('GameFramework.resources.PIEmitterInstanceDef', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PIEmitterInstanceDef.staticInit();
});
GameFramework.resources.PIEmitterInstanceDef.Value = {};
GameFramework.resources.PIEmitterInstanceDef.Value.staticInit = function GameFramework_resources_PIEmitterInstanceDef_Value$staticInit() {
	GameFramework.resources.PIEmitterInstanceDef.Value.LIFE = 0;
	GameFramework.resources.PIEmitterInstanceDef.Value.NUMBER = 1;
	GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_X = 2;
	GameFramework.resources.PIEmitterInstanceDef.Value.VELOCITY = 3;
	GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT = 4;
	GameFramework.resources.PIEmitterInstanceDef.Value.SPIN = 5;
	GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND = 6;
	GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE = 7;
	GameFramework.resources.PIEmitterInstanceDef.Value.ZOOM = 8;
	GameFramework.resources.PIEmitterInstanceDef.Value.VISIBILITY = 9;
	GameFramework.resources.PIEmitterInstanceDef.Value.TINT_STRENGTH = 10;
	GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_ANGLE = 11;
	GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_RANGE = 12;
	GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE = 13;
	GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE = 14;
	GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS = 15;
	GameFramework.resources.PIEmitterInstanceDef.Value.YRADIUS = 16;
	GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_Y = 17;
	GameFramework.resources.PIEmitterInstanceDef.Value.UNKNOWN4 = 18;
	GameFramework.resources.PIEmitterInstanceDef.Value.__COUNT = 19;
}
JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIEmitterInstanceDef.Value.staticInit();
});
GameFramework.resources.PIEmitterInstanceDef.Geom = {};
GameFramework.resources.PIEmitterInstanceDef.Geom.staticInit = function GameFramework_resources_PIEmitterInstanceDef_Geom$staticInit() {
	GameFramework.resources.PIEmitterInstanceDef.Geom.POINT = 0;
	GameFramework.resources.PIEmitterInstanceDef.Geom.LINE = 1;
	GameFramework.resources.PIEmitterInstanceDef.Geom.ECLIPSE = 2;
	GameFramework.resources.PIEmitterInstanceDef.Geom.AREA = 3;
	GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE = 4;
}
JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIEmitterInstanceDef.Geom.staticInit();
});