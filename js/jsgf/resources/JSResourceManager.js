GameFramework.resources.JSResourceManager = function GameFramework_resources_JSResourceManager() {
	GameFramework.resources.JSResourceManager.initializeBase(this);
}
GameFramework.resources.JSResourceManager.prototype = {

	SetResType : function GameFramework_resources_JSResourceManager$SetResType(theId, theObject) {
		GameFramework.resources.ResourceManager.prototype.SetResType.apply(this, [theId, theObject]);
		//JS
		Game.Resources[theId] = theObject;
		//-JS
	},
	ParseRenderEffectData : function GameFramework_resources_JSResourceManager$ParseRenderEffectData(theResourceStreamer) {
		var aJSRenderEffect = new GameFramework.resources.JSRenderEffect();
		aJSRenderEffect.ReadData(theResourceStreamer.mResultData);
		this.RegisterRenderEffect(theResourceStreamer.mId, aJSRenderEffect);
	},
	ParseMeshResourceData : function GameFramework_resources_JSResourceManager$ParseMeshResourceData(theResourceStreamer) {
		var aBuffer = theResourceStreamer.mResultData;
		var aMeshResource = new GameFramework.resources.JSMeshResource();
		aMeshResource.LoadMesh(aBuffer, theResourceStreamer);
		this.RegisterMeshResource(theResourceStreamer.mId, aMeshResource);
	},
	ResourceLoaded : function GameFramework_resources_JSResourceManager$ResourceLoaded(theResourceStreamer) {
		if(theResourceStreamer.mResType == GameFramework.resources.ResourceManager.RESTYPE_IMAGE) {
			if((theResourceStreamer.mId != null) && (this.mImages[theResourceStreamer.mId] != null)) {
				theResourceStreamer.mResultData = this.mImages[theResourceStreamer.mId];
				return;
			}
			var anImageResource = new GameFramework.resources.JSImageResource();
			var aContentScale = 1;
			anImageResource.mContentScale = aContentScale;
			anImageResource.mHTMLImageResource = theResourceStreamer.mResultData;
			if(theResourceStreamer.mBaseRes != null) {
				anImageResource.mCols = theResourceStreamer.mBaseRes.mCols;
				anImageResource.mRows = theResourceStreamer.mBaseRes.mRows;
				anImageResource.mWidth = theResourceStreamer.mBaseRes.mOrigWidth;
				anImageResource.mHeight = theResourceStreamer.mBaseRes.mOrigHeight;
				anImageResource.mOffsetX = theResourceStreamer.mBaseRes.mOffsetX;
				anImageResource.mOffsetY = theResourceStreamer.mBaseRes.mOffsetY;
			}
			anImageResource.mNumFrames = anImageResource.mCols * anImageResource.mRows;
			if((theResourceStreamer.mBaseRes != null) && (theResourceStreamer.mBaseRes.mRTParent != null)) {
				var aRTParent = this.mImages[theResourceStreamer.mBaseRes.mRTParent];
				var aParent = this.mImages[theResourceStreamer.mBaseRes.mParent];
				var aRTParentBaseRes = this.mResMap[theResourceStreamer.mBaseRes.mRTParent];
				if(aRTParent == null) {
					aRTParent = new GameFramework.resources.JSImageResource();
					aRTParent.mTexWidth = aRTParentBaseRes.mWidth;
					aRTParent.mTexHeight = aRTParentBaseRes.mHeight;
					aRTParent.mOwnsImageData = true;
					//JS
					aRTParent.mGLTex = JSFExt_CreateEmptyGLTex();
					aRTParent.mCompositeImageData = JSFExt_CreateCompositeImageData(aRTParentBaseRes.mWidth, aRTParentBaseRes.mHeight);
					//-JS
					this.mImages[aRTParentBaseRes.mId] = aRTParent;
				}
				//JS
				//JSFExt_CopyTexBits(aRTParent.mGLTex, theResourceStreamer.mBaseRes.mAtlasX, theResourceStreamer.mBaseRes.mAtlasY, theResourceStreamer.mBaseRes.mAtlasWidth, theResourceStreamer.mBaseRes.mAtlasHeight,
				//aParent.mColorImage, aParent.mAlphaImage, theResourceStreamer.mBaseRes.mAtlasRTX, theResourceStreamer.mBaseRes.mAtlasRTY);
				JSFExt_CopyToImageData(aRTParent.mCompositeImageData, theResourceStreamer.mBaseRes.mAtlasX, theResourceStreamer.mBaseRes.mAtlasY, theResourceStreamer.mBaseRes.mAtlasWidth, theResourceStreamer.mBaseRes.mAtlasHeight, aParent.mColorImage, aParent.mAlphaImage, theResourceStreamer.mBaseRes.mAtlasRTX, theResourceStreamer.mBaseRes.mAtlasRTY);
				//-JS
				aRTParentBaseRes.mRTChildLoadedCount++;
				if(aRTParentBaseRes.mRTChildLoadedCount == aRTParentBaseRes.mRTChildCount) {
					//JS
					JSFExt_SetGLTexImage(aRTParent.mGLTex, aRTParent.mCompositeImageData);
					aRTParent.mCompositeImageData = null; // We're done with this now...
					//-JS
				}
				anImageResource.mGLTex = aRTParent.mGLTex;
				anImageResource.mTexOfsX = theResourceStreamer.mBaseRes.mAtlasRTX;
				anImageResource.mTexOfsY = theResourceStreamer.mBaseRes.mAtlasRTY;
				anImageResource.mPhysCelWidth = ((theResourceStreamer.mBaseRes.mAtlasWidth / theResourceStreamer.mBaseRes.mCols) | 0);
				anImageResource.mPhysCelHeight = ((theResourceStreamer.mBaseRes.mAtlasHeight / theResourceStreamer.mBaseRes.mRows) | 0);
				anImageResource.mTexWidth = aRTParent.mTexWidth;
				anImageResource.mTexHeight = aRTParent.mTexHeight;
			} else if(anImageResource.mHTMLImageResource == null) {
				var aParentImageResource = this.GetImageResourceById(theResourceStreamer.mBaseRes.mParent);
				anImageResource.mHTMLImageResource = aParentImageResource.mHTMLImageResource;
				anImageResource.mGLTex = aParentImageResource.mGLTex;
				anImageResource.mTexOfsX = theResourceStreamer.mBaseRes.mAtlasX;
				anImageResource.mTexOfsY = theResourceStreamer.mBaseRes.mAtlasY;
				anImageResource.mPhysCelWidth = ((theResourceStreamer.mBaseRes.mAtlasWidth / theResourceStreamer.mBaseRes.mCols) | 0);
				anImageResource.mPhysCelHeight = ((theResourceStreamer.mBaseRes.mAtlasHeight / theResourceStreamer.mBaseRes.mRows) | 0);
				anImageResource.mTexWidth = aParentImageResource.mTexWidth;
				anImageResource.mTexHeight = aParentImageResource.mTexHeight;
			} else {
				//JS
				anImageResource.mOwnsImageData = true;
				anImageResource.mGLTex = theResourceStreamer.mGLTex;
				anImageResource.mTexWidth = anImageResource.mHTMLImageResource.width;
				anImageResource.mTexHeight = anImageResource.mHTMLImageResource.height;
				anImageResource.mPhysCelWidth = anImageResource.mHTMLImageResource.width / anImageResource.mCols;
				anImageResource.mPhysCelHeight = anImageResource.mHTMLImageResource.height / anImageResource.mRows;
				anImageResource.mColorImage = theResourceStreamer.mColorImage;
				anImageResource.mAlphaImage = theResourceStreamer.mAlphaImage;
				//-JS
			}
			if(theResourceStreamer.mBaseRes == null) {
				anImageResource.mWidth = ((anImageResource.mPhysCelWidth / GameFramework.BaseApp.mApp.mGraphics.mScale) | 0);
				anImageResource.mHeight = ((anImageResource.mPhysCelHeight / GameFramework.BaseApp.mApp.mGraphics.mScale) | 0);
			}
			anImageResource.mAdjustedWidth = anImageResource.mPhysCelWidth / GameFramework.BaseApp.mApp.mGraphics.mScale;
			anImageResource.mAdjustedHeight = anImageResource.mPhysCelHeight / GameFramework.BaseApp.mApp.mGraphics.mScale;
			theResourceStreamer.mResultData = anImageResource;
			if(theResourceStreamer.mId != null) {
				this.SetResType(theResourceStreamer.mId, anImageResource);
				this.mImages[theResourceStreamer.mId] = anImageResource;
			}
		} else if(theResourceStreamer.mResType == GameFramework.resources.ResourceManager.RESTYPE_SOUND) {
			var aSoundResource = new GameFramework.resources.JSSoundResource();
			aSoundResource.mHTML5Audio = theResourceStreamer.mResultData;
			if(theResourceStreamer.mBaseRes != null) {
				aSoundResource.mNumSamples = theResourceStreamer.mBaseRes.mNumSamples;
			}
			this.SetResType(theResourceStreamer.mId, aSoundResource);
			this.mSounds[theResourceStreamer.mId] = aSoundResource;
		}
	},
	ZResourceLoaded : function GameFramework_resources_JSResourceManager$ZResourceLoaded(theId, theData) {
		var aBaseRes = this.mResMap[theId];
		if(aBaseRes.mType == GameFramework.resources.ResourceManager.RESTYPE_IMAGE) {
			var anImageResource = new GameFramework.resources.JSImageResource();
			anImageResource.mHTMLImageResource = theData;
			anImageResource.mCols = aBaseRes.mCols;
			anImageResource.mRows = aBaseRes.mRows;
			//JS
			anImageResource.mColPX = theData.width / anImageResource.mCols;
			anImageResource.mRowPX = theData.height / anImageResource.mRows;
			//-JS
			this.SetResType(theId, anImageResource);
			this.mImages[theId] = anImageResource;
		}
	}
}
GameFramework.resources.JSResourceManager.staticInit = function GameFramework_resources_JSResourceManager$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.JSResourceManager.registerClass('GameFramework.resources.JSResourceManager', GameFramework.resources.ResourceManager);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.JSResourceManager.staticInit();
});