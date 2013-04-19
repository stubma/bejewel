GameFramework.resources.popanim.PopAnimSpriteDef = function GameFramework_resources_popanim_PopAnimSpriteDef() {
}
GameFramework.resources.popanim.PopAnimSpriteDef.prototype = {
	mName : null,
	mFrames : null,
	mWorkAreaStart : 0,
	mWorkAreaDuration : 0,
	mLabels : null,
	mObjectDefVector : null,
	mAnimRate : 0,
	GetLabelFrame : function GameFramework_resources_popanim_PopAnimSpriteDef$GetLabelFrame(theLabel) {
		if(theLabel == '') {
			return 0;
		}
		return (this.mLabels[theLabel] | 0);
	}
}
GameFramework.resources.popanim.PopAnimSpriteDef.staticInit = function GameFramework_resources_popanim_PopAnimSpriteDef$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.popanim.PopAnimSpriteDef.registerClass('GameFramework.resources.popanim.PopAnimSpriteDef', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.popanim.PopAnimSpriteDef.staticInit();
});