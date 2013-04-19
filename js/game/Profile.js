Game.Profile = function Game_Profile() {
    this.mStats = Array.Create((Game.DM.EStat._COUNT | 0), 0);
    this.mGameStats = Array.Create((Game.DM.EStat._COUNT | 0), 0);
    this.ClearProfile();
    this.mProfileName = 'Player';
}
Game.Profile.prototype = {
    mProfileName : null,
    mFlags : 0,
    mNeedMoveProfileFiles : null,
    mIsNew : null,
    mStats : null,
    mLastQuestPage : 0,
    mLastQuestBlink : null,
    mGameStats : null,
    mOfflineRank : 0,
    mOfflineRankPoints : 0,
    mOnlineRank : 0,
    mOnlineRankPoints : 0,
    mOfflineGames : 0,
    mOnlineGames : 0,
    mTutorialFlags : 0,
    mTutorialEnabled : null,
    mSfxVolume : 0,
    mMusicVolume : 0,
    mAnimateBackground : null,
    mTipIdx : 0,
    ClearProfile : function Game_Profile$ClearProfile() {
        this.mProfileName = '';
        this.mIsNew = true;
        this.mOfflineRank = 0;
        this.mOfflineRankPoints = 0;
        this.mOnlineRank = 0;
        this.mOnlineRankPoints = 0;
        this.mOfflineGames = 0;
        this.mOnlineGames = 0;
        this.mFlags = 0;
        this.mLastQuestPage = 0;
        this.mAnimateBackground = GameFramework.BaseApp.mApp.get_Is3D();
        this.mLastQuestBlink = false;
        this.mSfxVolume = 0.5;
        this.mMusicVolume = 0.5;
        var i;
        for(i = 0; i < (Game.DM.EStat._COUNT | 0); i++) {
            this.mStats[i] = 0;
        }
        for(i = 0; i < (Game.DM.EStat._COUNT | 0); i++) {
            this.mGameStats[i] = 0;
        }
        this.mTutorialFlags = 0;
        this.mTutorialEnabled = true;
        this.mTipIdx = 0;
        this.mNeedMoveProfileFiles = false;
    },
    WriteProfile : function Game_Profile$WriteProfile() {
        GameFramework.Utils.Trace('WriteProfile()');
        var aSaveData = {};
        aSaveData['_VERSION'] = Game.Profile.VERSION;
        aSaveData['OfflineRank'] = this.mOfflineRank;
        aSaveData['OfflineRankPoints'] = this.mOfflineRankPoints;
        aSaveData['TutorialEnabled'] = this.mTutorialEnabled;
        aSaveData['TutorialFlags'] = (this.mTutorialFlags | 0);
        aSaveData['AnimateBackground'] = this.mAnimateBackground;
        aSaveData['MusicVolume'] = this.mMusicVolume;
        aSaveData['SfxVolume'] = this.mSfxVolume;
        var statArr = [];

        {
            var $srcArray1 = this.mStats;
            for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
                var aStat = $srcArray1[$enum1];
                statArr.push(aStat);
            }
        }
        aSaveData['Stats'] = statArr;
        GameFramework.BaseApp.mApp.SetLocalData(GameFramework.BaseApp.mApp.mProdName, 'Profile', GameFramework.BaseApp.mApp.EncodeJSON(aSaveData));
    },
    LoadProfile : function Game_Profile$LoadProfile() {
        var version = 0;
        GameFramework.Utils.Trace('LoadProfile()');
        try {
            var aData = GameFramework.BaseApp.mApp.GetLocalData(GameFramework.BaseApp.mApp.mProdName, 'Profile');
            if(aData != null) {
                var aSaveData = {};
                GameFramework.BaseApp.mApp.DecodeJSON(aData, aSaveData);
                if(aSaveData.hasOwnProperty('_VERSION')) {
                    version = (aSaveData['_VERSION'] | 0);
                }
                if(aSaveData.hasOwnProperty('OfflineRank')) {
                    this.mOfflineRank = (aSaveData['OfflineRank'] | 0);
                }
                if(aSaveData.hasOwnProperty('OfflineRankPoints')) {
                    this.mOfflineRankPoints = (aSaveData['OfflineRankPoints'] | 0);
                }
                if(aSaveData.hasOwnProperty('TutorialEnabled')) {
                    this.mTutorialEnabled = aSaveData['TutorialEnabled'];
                }
                if(aSaveData.hasOwnProperty('TutorialFlags')) {
                    this.mTutorialFlags = (((aSaveData['TutorialFlags'] | 0)) | 0);
                }
                if(aSaveData.hasOwnProperty('AnimateBackground')) {
                    this.mAnimateBackground = aSaveData['AnimateBackground'];
                }
                if(aSaveData.hasOwnProperty('MusicVolume')) {
                    this.mMusicVolume = aSaveData['MusicVolume'];
                }
                if(aSaveData.hasOwnProperty('SfxVolume')) {
                    this.mSfxVolume = aSaveData['SfxVolume'];
                }
                if(aSaveData.hasOwnProperty('Stats')) {
                    var statArr = aSaveData['Stats'];
                    var i = 0;
                    for(i = 0; i < (Game.DM.EStat._COUNT | 0); i++) {
                        this.mStats[i] = 0;
                    }
                    i = 0;

                    {
                        var $enum2 = ss.IEnumerator.getEnumerator(statArr);
                        while($enum2.moveNext()) {
                            var aStat = $enum2.get_current();
                            this.mStats[i++] = aStat;
                        }
                    }
                }
            }
        } catch(theE) {
            GameFramework.Utils.Trace('!!! Profile Read Error: ' + theE.get_Message());
        }
    },
    HasClearedTutorial : function Game_Profile$HasClearedTutorial(theTutorial) {
        return !this.mTutorialEnabled || (this.mTutorialFlags & (1 << theTutorial)) != 0;
    },
    AsBitField : function Game_Profile$AsBitField(theVal) {
        var s = '';
        for(var i = 31; i >= 0; --i) {
            s += ((theVal & (1 << i)) != 0) ? '1' : '0';
        }
        return s;
    },
    SetTutorialCleared : function Game_Profile$SetTutorialCleared(theTutorial, isCleared) {
        if(isCleared === undefined) {
            isCleared = true;
        }
        if(isCleared) {
            this.mTutorialFlags |= 1 << theTutorial;
        } else {
            this.mTutorialFlags &= ~(1 << theTutorial);
        }
    },
    GetRankPointsK : function Game_Profile$GetRankPointsK(theRank) {
        var aRankCutoff = 0;
        for(var aRankIdx = 0; aRankIdx < theRank; aRankIdx++) {
            var aThisRankPoints = 150;
            if(aRankIdx > 0) {
                aThisRankPoints += (aRankIdx | 0) * 100;
            }
            aRankCutoff += aThisRankPoints;
        }
        return aRankCutoff;
    },
    GetRankAtPointsK : function Game_Profile$GetRankAtPointsK(thePointsK) {
        var aNewRank = 0;
        var aRankCutoff = 0;
        var aThisRankPoints = 0;
        var aPointsLeft = thePointsK;
        for(; ;) {
            var aThisOtherRankPoints = 150;
            if(aNewRank > 0) {
                aThisOtherRankPoints += aNewRank * 100;
            }
            aRankCutoff += aThisOtherRankPoints;
            if(thePointsK < aRankCutoff) {
                break;
            }
            aPointsLeft -= aThisOtherRankPoints;
            aNewRank++;
        }
        if(aThisRankPoints != 0) {
            return aNewRank + (aPointsLeft / aThisRankPoints);
        } else {
            return aNewRank;
        }
    }
}
Game.Profile.staticInit = function Game_Profile$staticInit() {
    Game.Profile.VERSION = 1;
}

JSFExt_AddInitFunc(function() {
    Game.Profile.registerClass('Game.Profile', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.Profile.staticInit();
});
Game.Profile.PROF_FLAG_HELPSEEN = {};
Game.Profile.PROF_FLAG_HELPSEEN.staticInit = function Game_Profile_PROF_FLAG_HELPSEEN$staticInit() {
    Game.Profile.PROF_FLAG_HELPSEEN.POKER = 0;
    Game.Profile.PROF_FLAG_HELPSEEN.BUTTERFLY = 1;
    Game.Profile.PROF_FLAG_HELPSEEN.ICESTORM = 2;
    Game.Profile.PROF_FLAG_HELPSEEN.GOLDRUSH = 3;
}
JSFExt_AddInitFunc(function() {
    Game.Profile.PROF_FLAG_HELPSEEN.staticInit();
});