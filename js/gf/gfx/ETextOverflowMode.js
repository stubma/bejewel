GameFramework.gfx.ETextOverflowMode = {};
GameFramework.gfx.ETextOverflowMode.staticInit = function GameFramework_gfx_ETextOverflowMode$staticInit() {
    GameFramework.gfx.ETextOverflowMode.Draw = 0;
    GameFramework.gfx.ETextOverflowMode.Clip = 1;
    GameFramework.gfx.ETextOverflowMode.Wrap = 2;
    GameFramework.gfx.ETextOverflowMode.Ellipsis = 3;
};
JSFExt_AddInitFunc(function () {
    GameFramework.gfx.ETextOverflowMode.staticInit();
});
