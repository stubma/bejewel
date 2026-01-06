GameFramework.resources.SoundManager = function GameFramework_resources_SoundManager() {
    this.mGroupVolumes = Array.Create(7, 7, 1, 1, 1, 1, 1, 1, 1);
    GameFramework.resources.SoundManager.initializeBase(this);
};
GameFramework.resources.SoundManager.prototype = {
    mGroupVolumes: null,
    RehupGroupVolumes: function GameFramework_resources_SoundManager$RehupGroupVolumes(theGroup) {},
    SetVolume: function GameFramework_resources_SoundManager$SetVolume(volume, theGroup) {
        if (theGroup === undefined) {
            theGroup = 0;
        }
        this.mGroupVolumes[theGroup] = volume;
        this.RehupGroupVolumes(theGroup);
    },
};
GameFramework.resources.SoundManager.staticInit = function GameFramework_resources_SoundManager$staticInit() {
    GameFramework.resources.SoundManager.MAX_GROUPS = 8;
};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.SoundManager.registerClass(
        "GameFramework.resources.SoundManager",
        GameFramework.events.EventDispatcher
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.SoundManager.staticInit();
});
