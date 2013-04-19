GameFramework.resources.popanim.PopAnimObjectPosData = function GameFramework_resources_popanim_PopAnimObjectPosData() {
	GameFramework.resources.popanim.PopAnimObjectPosData.mInstCount++;
}
GameFramework.resources.popanim.PopAnimObjectPosData.prototype = {
	mName : null,
	mObjectNum : 0,
	mIsSprite : null,
	mIsAdditive : null,
	mResNum : 0,
	mPreloadFrames : 0,
	mTimeScale : 0,
	mHasSrcRect : null,
	mSrcX : 0,
	mSrcY : 0,
	mSrcWidth : 0,
	mSrcHeight : 0,
	Duplicate : function GameFramework_resources_popanim_PopAnimObjectPosData$Duplicate() {
		var aPopAnimObjectPos = new GameFramework.resources.popanim.PopAnimObjectPosData();
		aPopAnimObjectPos.mName = this.mName;
		aPopAnimObjectPos.mObjectNum = this.mObjectNum;
		aPopAnimObjectPos.mIsSprite = this.mIsSprite;
		aPopAnimObjectPos.mIsAdditive = this.mIsAdditive;
		aPopAnimObjectPos.mResNum = this.mResNum;
		aPopAnimObjectPos.mPreloadFrames = this.mPreloadFrames;
		aPopAnimObjectPos.mTimeScale = this.mTimeScale;
		aPopAnimObjectPos.mHasSrcRect = this.mHasSrcRect;
		aPopAnimObjectPos.mSrcX = this.mSrcX;
		aPopAnimObjectPos.mSrcY = this.mSrcY;
		aPopAnimObjectPos.mSrcWidth = this.mSrcWidth;
		aPopAnimObjectPos.mSrcHeight = this.mSrcHeight;
		return aPopAnimObjectPos;
	}
}
GameFramework.resources.popanim.PopAnimObjectPosData.staticInit = function GameFramework_resources_popanim_PopAnimObjectPosData$staticInit() {
	GameFramework.resources.popanim.PopAnimObjectPosData.mInstCount = 0;
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.popanim.PopAnimObjectPosData.registerClass('GameFramework.resources.popanim.PopAnimObjectPosData', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.popanim.PopAnimObjectPosData.staticInit();
});