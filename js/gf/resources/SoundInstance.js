GameFramework.resources.SoundInstance = function GameFramework_resources_SoundInstance(theSoundResource) {
    this.mSoundResource = theSoundResource;
};
GameFramework.resources.SoundInstance.prototype = {
    mSoundResource: null,
    numPlays: 0,
    SetSoundGroup: function GameFramework_resources_SoundInstance$SetSoundGroup(theGroup) {},
    SetVolume: function GameFramework_resources_SoundInstance$SetVolume(volume) {},
    SetPan: function GameFramework_resources_SoundInstance$SetPan(thePan) {},
    PlayEx: function GameFramework_resources_SoundInstance$PlayEx(looping, autoRelease) {},
    Play: function GameFramework_resources_SoundInstance$Play() {
        this.PlayEx(false, true);
    },
    Stop: function GameFramework_resources_SoundInstance$Stop(dispose) {
        if (dispose === undefined) {
            dispose = true;
        }
    },
    Dispose: function GameFramework_resources_SoundInstance$Dispose() {},
    Pause: function GameFramework_resources_SoundInstance$Pause() {},
    Unpause: function GameFramework_resources_SoundInstance$Unpause() {},
    IsDone: function GameFramework_resources_SoundInstance$IsDone() {
        return true;
    },
};
GameFramework.resources.SoundInstance.staticInit = function GameFramework_resources_SoundInstance$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.SoundInstance.registerClass(
        "GameFramework.resources.SoundInstance",
        null,
        System.IDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.SoundInstance.staticInit();
});
