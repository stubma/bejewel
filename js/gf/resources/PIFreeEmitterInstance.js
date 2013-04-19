GameFramework.resources.PIFreeEmitterInstance = function GameFramework_resources_PIFreeEmitterInstance() {
	this.mEmitter = new GameFramework.resources.PIEmitterBase();
	GameFramework.resources.PIFreeEmitterInstance.initializeBase(this);
	this.mEmitter.mParticleGroup.mWasEmitted = true;
}
GameFramework.resources.PIFreeEmitterInstance.prototype = {
	mEmitter : null,
	Dispose : function GameFramework_resources_PIFreeEmitterInstance$Dispose() {
		this.mEmitter.Dispose();
		GameFramework.resources.PIParticleInstance.prototype.Dispose.apply(this);
	}
}
GameFramework.resources.PIFreeEmitterInstance.staticInit = function GameFramework_resources_PIFreeEmitterInstance$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIFreeEmitterInstance.registerClass('GameFramework.resources.PIFreeEmitterInstance', GameFramework.resources.PIParticleInstance);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PIFreeEmitterInstance.staticInit();
});