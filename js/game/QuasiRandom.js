Game.QuasiRandom = function Game_QuasiRandom() {
    this.mChance = new GameFramework.CurvedVal();
    this.mSteps = 0;
    this.mLastRoll = 0;
};
Game.QuasiRandom.prototype = {
    mChance: null,
    mSteps: 0,
    mLastRoll: 0,
    Init: function Game_QuasiRandom$Init(theCurve) {
        this.mSteps = 0;
        this.mLastRoll = 0;
        this.mChance.SetCurve(theCurve);
        var aMusicFade = new GameFramework.CurvedVal();
        aMusicFade.SetCurveRef("SpeedBoard_cs_11_21_11__05_51_47_583");
        Game.BejApp.mBejApp.PlayMusic(Game.Resources.SOUND_MUSIC_SPEED_ID, aMusicFade);
    },
    Step: function Game_QuasiRandom$Step() {
        this.Step$2(1);
    },
    Step$2: function Game_QuasiRandom$Step$2(theCount) {
        this.mSteps += theCount;
        if (this.mChance.GetOutVal() <= 0) {
            this.mLastRoll = 0;
        } else {
            this.mLastRoll =
                this.mChance.GetOutVal() *
                Math.min(2.5, Math.max(0.2, Math.pow(1.5 * this.mSteps * this.mChance.GetOutVal(), 1.2)));
        }
    },
    Check: function Game_QuasiRandom$Check(theRand) {
        if (theRand < this.mLastRoll) {
            this.mSteps = 0;
            return true;
        } else {
            return false;
        }
    },
};
Game.QuasiRandom.staticInit = function Game_QuasiRandom$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.QuasiRandom.registerClass("Game.QuasiRandom", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.QuasiRandom.staticInit();
});
