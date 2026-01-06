Game.HighScoreTable = function Game_HighScoreTable() {
    this.mHighScores = Array.Create(Game.HighScoreTable.ENTRY_COUNT, null);
    for (var i = 0; i < this.mHighScores.length; ++i) {
        this.mHighScores[i] = new Game.HighScoreEntry();
    }
};
Game.HighScoreTable.prototype = {
    mHighScores: null,
    mManager: null,
    Submit: function Game_HighScoreTable$Submit(theName, theValue) {
        for (var i = 0; i < Game.HighScoreTable.ENTRY_COUNT; ++i) {
            if (theValue > this.mHighScores[i].mScore) {
                for (var j = Game.HighScoreTable.ENTRY_COUNT - 1; j > i; --j) {
                    this.mHighScores[j] = this.mHighScores[j - 1];
                }
                this.mHighScores[i] = new Game.HighScoreEntry();
                this.mHighScores[i].mName = theName;
                this.mHighScores[i].mIsNew = true;
                this.mHighScores[i].mScore = theValue;
                this.mHighScores[i].mTime = GameFramework.Utils.GetUnixTime() | 0;
                this.mManager.mNeedSave = true;
                return true;
            }
        }
        return false;
    },
    GenerateDefaults: function Game_HighScoreTable$GenerateDefaults(
        theScoreStart,
        theScoreInterval,
        theScoreIntervalHi
    ) {
        this.GenerateDefaults$2(theScoreStart, theScoreInterval, theScoreIntervalHi, true);
    },
    GenerateDefaults$2: function Game_HighScoreTable$GenerateDefaults$2(
        theScoreStart,
        theScoreInterval,
        theScoreIntervalHi,
        theGenerateNewOnly
    ) {
        var names = Array.Create(
            27,
            27,
            "Abi",
            "Bill",
            "Bob",
            "Brian",
            "Chad",
            "Chris",
            "David",
            "Derek",
            "DJ",
            "Ed",
            "Ellen",
            "Heather",
            "Jake",
            "Jason",
            "Jeremy",
            "Josh",
            "Katie",
            "Leah",
            "Matt",
            "Michael",
            "Misael",
            "John",
            "Rick",
            "Sharon",
            "Snackers",
            "Stephen",
            "Tysen"
        );
        var nameCount = names.length;
        for (var i = 0; i < Game.HighScoreTable.ENTRY_COUNT; ++i) {
            if (theGenerateNewOnly && this.mHighScores[i].mScore >= 0) {
                break;
            }
            var count = 100;
            while (--count > 0) {
                this.mHighScores[i].mName = names[GameFramework.Utils.GetRand() % nameCount];
                for (var j = i - 1; j >= 0; --j) {
                    if (this.mHighScores[i].mName == this.mHighScores[j].mName) {
                        break;
                    } else if (j == 0) {
                        count = 0;
                    }
                }
            }
            this.mHighScores[i].mIsNew = false;
            if (i < ((Game.HighScoreTable.ENTRY_COUNT / 2) | 0)) {
                this.mHighScores[i].mScore =
                    theScoreStart +
                    theScoreIntervalHi *
                        (Game.HighScoreTable.ENTRY_COUNT - i - 1 - ((Game.HighScoreTable.ENTRY_COUNT / 2) | 0)) +
                    theScoreInterval * ((Game.HighScoreTable.ENTRY_COUNT / 2) | 0);
            } else {
                this.mHighScores[i].mScore =
                    theScoreStart + theScoreInterval * (Game.HighScoreTable.ENTRY_COUNT - i - 1);
            }
            this.mHighScores[i].mTime = 0;
        }
    },
};
Game.HighScoreTable.staticInit = function Game_HighScoreTable$staticInit() {
    Game.HighScoreTable.ENTRY_COUNT = 5;
    Game.HighScoreTable.HASH_KEY = 0x42beef;
};

JSFExt_AddInitFunc(function () {
    Game.HighScoreTable.registerClass("Game.HighScoreTable", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.HighScoreTable.staticInit();
});
