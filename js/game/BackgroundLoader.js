//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\Announcement.cs
//LineMap:1=15 2=17 3=37 6=38 8=27 9=29 12=39 13=41 19=48 26=56 41=60 51=69 56=75 64=84 68=87 72=92 73=94 78=100 79=102 81=105 87=116 88=118
//Start:Background
/**
 * @constructor
 */
Game.BackgroundLoader = function Game_BackgroundLoader(theIdx) {
    this.mIdx = theIdx;
};
Game.BackgroundLoader.prototype = {
    mIdx: 0,
    BackgroundLoaded: function Game_BackgroundLoader$BackgroundLoaded(e) {
        var aResourceStreamer = e.target;
        Game.Background.mLoadedImages[this.mIdx] = Type.safeCast(
            aResourceStreamer.mResultData,
            GameFramework.resources.ImageResource
        );
        Game.Background.mIsBkgLoaded[this.mIdx] = true;
        GameFramework.BaseApp.mApp.ClearUpdateBacklog();
    },
};
Game.BackgroundLoader.staticInit = function Game_BackgroundLoader$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.BackgroundLoader.registerClass("Game.BackgroundLoader", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.BackgroundLoader.staticInit();
});
