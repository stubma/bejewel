Game.HighScoreMgr = function Game_HighScoreMgr() {
    this.mHighScoreMap = {};
    this.mNeedSave = false;
}
Game.HighScoreMgr.prototype = {
    mHighScoreMap : null,
    mNeedSave : null,
    Dispose : function Game_HighScoreMgr$Dispose() {
    },
    Submit : function Game_HighScoreMgr$Submit(theTable, theName, theValue) {
        if(this.GetOrCreateTable(theTable).Submit(theName, theValue)) {
            return true;
        }
        return false;
    },
    GetOrCreateTable : function Game_HighScoreMgr$GetOrCreateTable(theTable) {
        var findIt = this.mHighScoreMap[theTable];
        if(findIt != null) {
            return findIt;
        } else {
            this.mHighScoreMap[theTable] = new Game.HighScoreTable();
            this.mHighScoreMap[theTable].mManager = this;
            this.mNeedSave = true;
            return this.mHighScoreMap[theTable];
        }
    },
    GenerateDefaults : function Game_HighScoreMgr$GenerateDefaults(theTable, theScoreStart, theScoreInterval, theScoreIntervalHi) {
        this.GenerateDefaults$3(theTable, theScoreStart, theScoreInterval, theScoreIntervalHi, true);
    },
    GenerateDefaults$2 : function Game_HighScoreMgr$GenerateDefaults$2(theTable, theScoreStart, theScoreInterval) {
        this.GenerateDefaults$3(theTable, theScoreStart, theScoreInterval, -1, true);
    },
    GenerateDefaults$3 : function Game_HighScoreMgr$GenerateDefaults$3(theTable, theScoreStart, theScoreInterval, theScoreIntervalHi, theGenerateNewOnly) {
        if(theScoreIntervalHi == -1) {
            theScoreIntervalHi = theScoreInterval;
        }
        var aTable = this.GetOrCreateTable(theTable);
        aTable.GenerateDefaults$2(theScoreStart, theScoreInterval, theScoreIntervalHi, theGenerateNewOnly);
    },
    RenameDefaultScore : function Game_HighScoreMgr$RenameDefaultScore(theName) {

        {
            for($enum1 in this.mHighScoreMap) {
                var aTable = this.mHighScoreMap[$enum1];
                for(var anEntryIdx = 0; anEntryIdx < Game.HighScoreTable.ENTRY_COUNT; anEntryIdx++) {
                    if(aTable.mHighScores[anEntryIdx].mTime == 0 && aTable.mHighScores[anEntryIdx].mName == theName) {
                        aTable.mHighScores[anEntryIdx].mName = 'Noni';
                        this.mNeedSave = true;
                    }
                }
            }
        }
    },
    Load : function Game_HighScoreMgr$Load() {
        var aHighScoreString = GameFramework.BaseApp.mApp.GetLocalData(GameFramework.BaseApp.mApp.mProdName, 'HighScores');
        if(aHighScoreString == null) {
            return false;
        }
        var aSaveTable = {};
        GameFramework.BaseApp.mApp.DecodeJSON(aHighScoreString, aSaveTable);
        if(aSaveTable.hasOwnProperty('_VERSION')) {
            var aVersion = (aSaveTable['_VERSION'] | 0);
            delete aSaveTable['_VERSION'];
        }
        this.mHighScoreMap = {};

        {
            for(aName in aSaveTable) {
                var aHighScoreTable = new Game.HighScoreTable();
                aHighScoreTable.mManager = this;
                this.mHighScoreMap[aName] = aHighScoreTable;
                var anIdx = 0;

                {
                    var $enum3 = ss.IEnumerator.getEnumerator(aSaveTable[aName]);
                    while($enum3.moveNext()) {
                        var aDictionary = $enum3.get_current();
                        var anEntry = new Game.HighScoreEntry();
                        anEntry.mName = aDictionary['Name'];
                        anEntry.mScore = (aDictionary['Score'] | 0);
                        anEntry.mTime = ((aDictionary['Time'] | 0) | 0);
                        if(anIdx < aHighScoreTable.mHighScores.length) {
                            aHighScoreTable.mHighScores[anIdx++] = anEntry;
                        }
                    }
                }
            }
        }
        return false;
    },
    Save : function Game_HighScoreMgr$Save() {
        var aSaveData = {};
        aSaveData['_VERSION'] = Game.HighScoreMgr.VERSION;

        {
            for(aName in this.mHighScoreMap) {
                var aSaveTable = [];
                aSaveData[aName] = aSaveTable;

                {
                    var $srcArray5 = this.mHighScoreMap[aName].mHighScores;
                    for(var $enum5 = 0; $enum5 < $srcArray5.length; $enum5++) {
                        var aHighScoreEntry = $srcArray5[$enum5];
                        aSaveTable.push(Array.Create(3, null, new GameFramework.misc.KeyVal('Name', aHighScoreEntry.mName), new GameFramework.misc.KeyVal('Score', aHighScoreEntry.mScore), new GameFramework.misc.KeyVal('Time', aHighScoreEntry.mTime)));
                    }
                }
            }
        }
        GameFramework.BaseApp.mApp.SetLocalData(GameFramework.BaseApp.mApp.mProdName, 'HighScores', GameFramework.BaseApp.mApp.EncodeJSON(aSaveData));
        return true;
    }
}
Game.HighScoreMgr.staticInit = function Game_HighScoreMgr$staticInit() {
    Game.HighScoreMgr.VERSION = 1;
}

JSFExt_AddInitFunc(function() {
    Game.HighScoreMgr.registerClass('Game.HighScoreMgr', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.HighScoreMgr.staticInit();
});