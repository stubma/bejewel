GameFramework.resources.FontDrawCmd = function GameFramework_resources_FontDrawCmd() {};
GameFramework.resources.FontDrawCmd.prototype = {
    mCharData: null,
    mFontLayer: null,
    mXOfs: 0,
    mYOfs: 0,
    mColor: 0,
};
GameFramework.resources.FontDrawCmd.staticInit = function GameFramework_resources_FontDrawCmd$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.FontDrawCmd.registerClass("GameFramework.resources.FontDrawCmd", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.FontDrawCmd.staticInit();
});
