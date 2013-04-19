GameFramework.resources.popanim.PopAnimSpriteInst = function GameFramework_resources_popanim_PopAnimSpriteInst() {
}
GameFramework.resources.popanim.PopAnimSpriteInst.prototype = {
	mParent : null,
	mDelayFrames : 0,
	mFrameNum : 0,
	mFrameRepeats : 0,
	mOnNewFrame : null,
	mLastUpdated : 0,
	mCurTransform : null,
	mCurColor : 0,
	mChildren : null,
	mDef : null,
	mParticleEffectVector : null,
	GetObjectInst : function GameFramework_resources_popanim_PopAnimSpriteInst$GetObjectInst(theName) {
		var aCurName = '';
		var aNextName = '';
		var aSlashPos = theName.indexOf(String.fromCharCode(92));
		if(aSlashPos != -1) {
			aCurName = theName.substr(0, aSlashPos);
			aNextName = theName.substr(aSlashPos + 1);
		} else {
			aCurName = theName;
		}
		for(var aChildIdx = 0; aChildIdx < this.mChildren.length; aChildIdx++) {
			var anObjectInst = this.mChildren[aChildIdx];
			if((anObjectInst.mName != null) && (anObjectInst.mName == aCurName)) {
				if(aSlashPos == -1) {
					return anObjectInst;
				}
				if(anObjectInst.mSpriteInst == null) {
					return null;
				}
				return anObjectInst.mSpriteInst.GetObjectInst(aNextName);
			}
		}
		return null;
	},
	Dispose : function GameFramework_resources_popanim_PopAnimSpriteInst$Dispose() {
		if(this.mChildren != null) {
			for(var aChildIdx = 0; aChildIdx < this.mChildren.length; aChildIdx++) {
				var anObjectInst = this.mChildren[aChildIdx];
				if(anObjectInst.mSpriteInst != null) {
					anObjectInst.mSpriteInst.Dispose();
				}
			}
		}
		this.mChildren = null;
		this.mDef = null;
		this.mParticleEffectVector = null;
		this.mParent = null;
	}
}
GameFramework.resources.popanim.PopAnimSpriteInst.staticInit = function GameFramework_resources_popanim_PopAnimSpriteInst$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.popanim.PopAnimSpriteInst.registerClass('GameFramework.resources.popanim.PopAnimSpriteInst', null, System.IDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.popanim.PopAnimSpriteInst.staticInit();
});