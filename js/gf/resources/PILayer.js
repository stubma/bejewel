GameFramework.resources.PILayer = function GameFramework_resources_PILayer() {
	this.mCurOffset = new GameFramework.geom.TPoint();
	this.mVisible = true;
	this.mColor = 0xffffffff;
	this.mBkgImage = null;
}
GameFramework.resources.PILayer.prototype = {
	mLayerDef : null,
	mEmitterInstanceVector : null,
	mCurOffset : null,
	mCurAngle : 0,
	mVisible : null,
	mColor : 0,
	mBkgImage : null,
	mBkgImgDrawOfs : null,
	mBkgTransform : null,
	Dispose : function GameFramework_resources_PILayer$Dispose() {
	},
	SetVisible : function GameFramework_resources_PILayer$SetVisible(isVisible) {
		this.mVisible = isVisible;
	},
	GetEmitter : function GameFramework_resources_PILayer$GetEmitter(theIdx) {
		if(theIdx < (this.mEmitterInstanceVector.length | 0)) {
			return this.mEmitterInstanceVector[theIdx];
		}
		return null;
	},
	GetEmitter$2 : function GameFramework_resources_PILayer$GetEmitter$2(theName) {
		for(var i = 0; i < (this.mEmitterInstanceVector.length | 0); i++) {
			if((theName.length == 0) || (this.mEmitterInstanceVector[i].mEmitterInstanceDef.mName == theName)) {
				return this.mEmitterInstanceVector[i];
			}
		}
		return null;
	}
}
GameFramework.resources.PILayer.staticInit = function GameFramework_resources_PILayer$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PILayer.registerClass('GameFramework.resources.PILayer', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PILayer.staticInit();
});