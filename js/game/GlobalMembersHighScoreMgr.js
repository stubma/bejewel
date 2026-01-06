Game.GlobalMembersHighScoreMgr = function Game_GlobalMembersHighScoreMgr() {};
Game.GlobalMembersHighScoreMgr.prototype = {};
Game.GlobalMembersHighScoreMgr.staticInit = function Game_GlobalMembersHighScoreMgr$staticInit() {
    Game.GlobalMembersHighScoreMgr.HIGHSCORE_VERSION = 1;
    Game.GlobalMembersHighScoreMgr.HIGHSCORE_VERSION_MIN = 1;
    Game.GlobalMembersHighScoreMgr.HIGHSCORE_KEY = 0xb9e7e3f9;
};

JSFExt_AddInitFunc(function () {
    Game.GlobalMembersHighScoreMgr.registerClass("Game.GlobalMembersHighScoreMgr", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.GlobalMembersHighScoreMgr.staticInit();
});
