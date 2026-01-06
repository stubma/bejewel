Game.Version = function Game_Version() {};
Game.Version.Get = function Game_Version$Get() {
    return Game.Version.mVersion;
};
Game.Version.prototype = {};
Game.Version.staticInit = function Game_Version$staticInit() {
    Game.Version.mVersion = "0.9.12.9490";
};

JSFExt_AddInitFunc(function () {
    Game.Version.registerClass("Game.Version", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.Version.staticInit();
});
