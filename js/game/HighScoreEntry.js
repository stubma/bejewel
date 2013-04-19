Game.HighScoreEntry = function Game_HighScoreEntry() {
    this.mTime = 0;
    this.mScore = -1;
    this.mIsNew = false;
}
Game.HighScoreEntry.prototype = {
    mName : null,
    mTime : 0,
    mScore : 0,
    mIsNew : null,
    Clone : function Game_HighScoreEntry$Clone() {
        var ret = new Game.HighScoreEntry();
        ret.mName = this.mName;
        ret.mScore = this.mScore;
        ret.mTime = this.mTime;
        ret.mIsNew = this.mIsNew;
        return ret;
    }
}
Game.HighScoreEntry.staticInit = function Game_HighScoreEntry$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.HighScoreEntry.registerClass('Game.HighScoreEntry', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.HighScoreEntry.staticInit();
});