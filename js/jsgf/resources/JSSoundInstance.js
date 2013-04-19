GameFramework.resources.JSSoundInstance = function GameFramework_resources_JSSoundInstance(theSoundResource) {
	GameFramework.resources.JSSoundInstance.initializeBase(this, [theSoundResource]);
	this.mJSSoundResource = theSoundResource;
}
GameFramework.resources.JSSoundInstance.prototype = {
	mJSSoundResource : null,
	mVolume : 1.0,
	mPan : 0.0,
	mSoundObject : null,
	mSoundGroup : 0,
	SetPan : function GameFramework_resources_JSSoundInstance$SetPan(thePan) {
		this.mPan = thePan;
	},
	SetSoundGroup : function GameFramework_resources_JSSoundInstance$SetSoundGroup(theGroup) {
		this.mSoundGroup = theGroup;
		this.RehupVolume();
	},
	RehupVolume : function GameFramework_resources_JSSoundInstance$RehupVolume() {
		var aVolume = this.mVolume * GameFramework.BaseApp.mApp.mSoundManager.mGroupVolumes[this.mSoundGroup];
		//JS
		if(this.mSoundObject) {
			JSFExt_AudioSetVolume(this.mSoundObject, aVolume);
		}
		//-JS
	},
	SetVolume : function GameFramework_resources_JSSoundInstance$SetVolume(volume) {
		if(this.mVolume != volume) {
			this.mVolume = volume;
			this.RehupVolume();
		}
	},
	PlayEx : function GameFramework_resources_JSSoundInstance$PlayEx(looping, autoRelease) {
		var aHTML5Audio = this.mJSSoundResource.mHTML5Audio;
		var aVolume = this.mVolume * GameFramework.BaseApp.mApp.mSoundManager.mGroupVolumes[this.mSoundGroup];
		//JS
		this.mSoundObject = JSFExt_PlayAudio(aHTML5Audio, aVolume, this.mPan, looping, this.mJSSoundResource.mNumSamples);
		//-JS
	},
	Stop : function GameFramework_resources_JSSoundInstance$Stop(dispose) {
		if(dispose === undefined) {
			dispose = true;
		}
		GameFramework.resources.SoundInstance.prototype.Stop.apply(this, [dispose]);
		//JS
		JSFExt_StopAudio(this.mSoundObject);
		//-JS
	},
	Dispose : function GameFramework_resources_JSSoundInstance$Dispose() {
		//JS
		if(this.mSoundObject) {
			JSFExt_StopAudio(this.mSoundObject);
		}
		//-JS
		this.mSoundObject = null;
	}
}
GameFramework.resources.JSSoundInstance.staticInit = function GameFramework_resources_JSSoundInstance$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.JSSoundInstance.registerClass('GameFramework.resources.JSSoundInstance', GameFramework.resources.SoundInstance);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.JSSoundInstance.staticInit();
});