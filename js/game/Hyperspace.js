Game.Hyperspace = function Game_Hyperspace() {
    Game.Hyperspace.initializeBase(this);
};
Game.Hyperspace.prototype = {
    DrawBackground: function Game_Hyperspace$DrawBackground(g) {},
    GetPieceAlpha: function Game_Hyperspace$GetPieceAlpha() {
        return 1.0;
    },
    IsUsing3DTransition: function Game_Hyperspace$IsUsing3DTransition() {
        return false;
    },
    SetBGImage: function Game_Hyperspace$SetBGImage(inImage) {},
};
Game.Hyperspace.staticInit = function Game_Hyperspace$staticInit() {
    Game.Hyperspace.MAX_HYPERSPACE_LIGHT = 4;
};

JSFExt_AddInitFunc(function () {
    Game.Hyperspace.registerClass("Game.Hyperspace", GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function () {
    Game.Hyperspace.staticInit();
});
Game.Hyperspace.HyperspaceEvent = {};
Game.Hyperspace.HyperspaceEvent.staticInit = function Game_Hyperspace_HyperspaceEvent$staticInit() {
    Game.Hyperspace.HyperspaceEvent.Start = 0;
    Game.Hyperspace.HyperspaceEvent.HideAll = 1;
    Game.Hyperspace.HyperspaceEvent.BoardShatter = 2;
    Game.Hyperspace.HyperspaceEvent.NextBkg = 3;
    Game.Hyperspace.HyperspaceEvent.ZoomIn = 4;
    Game.Hyperspace.HyperspaceEvent.SlideOver = 5;
    Game.Hyperspace.HyperspaceEvent.OldLevelClear = 6;
    Game.Hyperspace.HyperspaceEvent.Finish = 7;
};
JSFExt_AddInitFunc(function () {
    Game.Hyperspace.HyperspaceEvent.staticInit();
});
