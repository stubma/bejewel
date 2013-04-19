GameFramework.resources.PITexture = function GameFramework_resources_PITexture() {
	this.mTextureChunkVector = [];
}
GameFramework.resources.PITexture.prototype = {
	mTextureChunkVector : null,
	mName : null,
	mImageVector : null,
	mImageStrip : null,
	mNumCels : 0,
	mPadded : null,
	Dispose : function GameFramework_resources_PITexture$Dispose() {
	},
	ImageLoaded : function GameFramework_resources_PITexture$ImageLoaded(e) {
		var aResourceStreamer = e.target;
		if(aResourceStreamer.mId != null) {
			this.mImageStrip = GameFramework.BaseApp.mApp.mResourceManager.GetImageResourceById(aResourceStreamer.mId);
		} else {
			this.mImageStrip = aResourceStreamer.mResultData;
		}
	}
}
GameFramework.resources.PITexture.staticInit = function GameFramework_resources_PITexture$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PITexture.registerClass('GameFramework.resources.PITexture', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PITexture.staticInit();
});