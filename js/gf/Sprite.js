GameFramework.Sprite = function GameFramework_Sprite() {};
GameFramework.Sprite.prototype = {};
GameFramework.Sprite.staticInit = function GameFramework_Sprite$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.Sprite.registerClass("GameFramework.Sprite", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.Sprite.staticInit();
});
