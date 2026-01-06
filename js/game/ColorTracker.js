Game.ColorTracker = function Game_ColorTracker(g) {
    this.mG = g;
    this.mPushCount = 0;
};
Game.ColorTracker.prototype = {
    mG: null,
    mPushCount: 0,
    Set: function Game_ColorTracker$Set(theColor) {
        this.PopAll();
        this.Push(theColor);
    },
    Push: function Game_ColorTracker$Push(theColor) {
        this.mG.PushColor(theColor);
        ++this.mPushCount;
    },
    Pop: function Game_ColorTracker$Pop() {
        this.mG.PopColor();
        --this.mPushCount;
    },
    PopAll: function Game_ColorTracker$PopAll() {
        for (var i = 0; i < this.mPushCount; ++i) {
            this.mG.PopColor();
        }
        this.mPushCount = 0;
    },
    PopTo: function Game_ColorTracker$PopTo(thePushIdx) {
        for (var i = this.mPushCount; i > thePushIdx; --i) {
            this.mG.PopColor();
            --this.mPushCount;
        }
    },
};
Game.ColorTracker.staticInit = function Game_ColorTracker$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.ColorTracker.registerClass("Game.ColorTracker", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.ColorTracker.staticInit();
});
