Game.Metrics = function Game_Metrics() {
    this.mPendingSubmits = [];
    this.mMetricsProb = {};
}
Game.Metrics.prototype = {
    mSamplingProbRoll : 0,
    mMetricsVersion : 1,
    mIsAdmin : false,
    mPendingSubmits : null,
    mGotThrottlingData : false,
    mRequestedThrottlingData : false,
    mMetricsURL : null,
    mMetricsProb : null,
    Init : function Game_Metrics$Init() {
        var aSamplingProbStr = GameFramework.BaseApp.mApp.GetLocalData('Global', 'SamplingProbRoll');
        if(aSamplingProbStr != null) {
            this.mSamplingProbRoll = GameFramework.Utils.ToFloat(aSamplingProbStr);
        }
    },
    SetSamplingProbRoll : function Game_Metrics$SetSamplingProbRoll(theSamplingProbRoll) {
        this.mSamplingProbRoll = theSamplingProbRoll;
        GameFramework.BaseApp.mApp.SetLocalData('Global', 'SamplingProbRoll', String.format('{0}', this.mSamplingProbRoll));
    },
    SubmitReport : function Game_Metrics$SubmitReport(theMetricsType, theMetricsData, force, theAlternateURL) {
        if(force === undefined) {
            force = false;
        }
        if(theAlternateURL === undefined) {
            theAlternateURL = null;
        }
        var aSamplingProb = 1.0;
        if((!force) && (this.mMetricsProb.hasOwnProperty(theMetricsType))) {
            aSamplingProb = this.mMetricsProb[theMetricsType];
        }
        var aStats = [new GameFramework.misc.KeyVal('MetricsType', theMetricsType), new GameFramework.misc.KeyVal('MetricsVersion', 'v1.0'), new GameFramework.misc.KeyVal('SamplingProb', aSamplingProb)];
        if(Type.tryCast(theMetricsData, Array)) {

            {
                var $srcArray1 = theMetricsData;
                for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
                    var aKeyVal = $srcArray1[$enum1];
                    aStats.push(aKeyVal);
                }
            }
        }
        if(Type.tryCast(theMetricsData, GameFramework.TVector)) {

            {
                var $srcArray2 = theMetricsData;
                for(var $enum2 = 0; $enum2 < $srcArray2.length; $enum2++) {
                    var aKeyVal_2 = $srcArray2[$enum2];
                    aStats.push(aKeyVal_2);
                }
            }
        }
        if(force) {
            this.Update();
            this.SendMetrics(aStats, (theAlternateURL != null) ? theAlternateURL : this.mMetricsURL);
            GameFramework.BaseApp.mApp.UpdateConnectedRequests();
        } else {
            this.mPendingSubmits.push(aStats);
        }
    },
    SetThrottlingURL : function Game_Metrics$SetThrottlingURL(theThrottlingURL) {
        if(GameFramework.BaseApp.mApp.mHTTPService == null) {
            GameFramework.BaseApp.mApp.CreateHTTPService();
        }
        var aConnectedRequest = GameFramework.BaseApp.mApp.mHTTPService.Get(theThrottlingURL);
        aConnectedRequest.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(this, this.GotThrottlingData));
        this.mRequestedThrottlingData = true;
    },
    GotThrottlingData : function Game_Metrics$GotThrottlingData(e) {
        var aConnectedRequest = e.target;
        var aResult = aConnectedRequest.mResult;
        try {
            var aDictionary = {};
            GameFramework.BaseApp.mApp.DecodeJSON(aResult, aDictionary);

            {
                for(aStatsGroup in aDictionary) {
                    var aGroupData = aDictionary[aStatsGroup];
                    var aSamplingProb = GameFramework.Utils.ToFloat(aGroupData['value']);
                    if((this.mIsAdmin) && (aGroupData.hasOwnProperty('admin'))) {
                        aSamplingProb = (aGroupData['admin']) ? 1.0 : 0.0;
                    }
                    this.mMetricsProb[aStatsGroup] = aSamplingProb;
                    this.mGotThrottlingData = true;
                }
            }
        } catch(_ex4) {
        }
    },
    SetMetricsURL : function Game_Metrics$SetMetricsURL(theMetricsURL) {
        this.mMetricsURL = theMetricsURL;
        this.Update();
    },
    SendMetrics : function Game_Metrics$SendMetrics(theDict, theMetricsURL) {
        if(this.mMetricsURL != null) {
            if(GameFramework.BaseApp.mApp.mHTTPService == null) {
                GameFramework.BaseApp.mApp.CreateHTTPService();
            }
            var aJSONString = GameFramework.BaseApp.mApp.EncodeJSON(theDict);
            GameFramework.BaseApp.mApp.mHTTPService.Post(theMetricsURL, aJSONString);
        }
    },
    Update : function Game_Metrics$Update() {
        if((this.mGotThrottlingData) || (!this.mRequestedThrottlingData)) {
            while(this.mPendingSubmits.length > 0) {
                var aMetricsDict = this.mPendingSubmits[0];
                var aSamplingProb = 1.0;
                if(this.mMetricsProb.hasOwnProperty(aMetricsDict[0].mValue)) {
                    aSamplingProb = this.mMetricsProb[aMetricsDict[0].mValue];
                }
                if((aMetricsDict.length > 2) && (aMetricsDict[2].mKey == 'SamplingProb')) {
                    aMetricsDict[2].mValue = aSamplingProb;
                }
                if(this.mSamplingProbRoll < aSamplingProb) {
                    this.SendMetrics(aMetricsDict, this.mMetricsURL);
                }
                this.mPendingSubmits.removeAt(0);
            }
        }
    }
}
Game.Metrics.staticInit = function Game_Metrics$staticInit() {
}

JS_AddInitFunc(function() {
    Game.Metrics.registerClass('Game.Metrics', null);
});
JS_AddStaticInitFunc(function() {
    Game.Metrics.staticInit();
});