//Start:BaseApp
GameFramework = Type.registerNamespace('GameFramework');
/**
 * @constructor
 */
GameFramework.JSONHelperData = function GameFramework_JSONHelperData() {
}
GameFramework.JSONHelperData.prototype = {
    mLineNum : 1,
    mStrIdx : 0
}
GameFramework.JSONHelperData.staticInit = function GameFramework_JSONHelperData$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.JSONHelperData.registerClass('GameFramework.JSONHelperData', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.JSONHelperData.staticInit();
});
/**
 * @constructor
 */
GameFramework.JSONFormatException = function GameFramework_JSONFormatException(theInnerException, theData) {
    GameFramework.JSONFormatException.initializeBase(this, [theInnerException.get_Message() + ' at line ' + theData.mLineNum]);
    this.mInnerException = theInnerException;
    this.mLineNum = theData.mLineNum;
}
GameFramework.JSONFormatException.prototype = {
    mInnerException : null,
    mLineNum : 0
}
GameFramework.JSONFormatException.staticInit = function GameFramework_JSONFormatException$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.JSONFormatException.registerClass('GameFramework.JSONFormatException', System.Exception);
});
JS_AddStaticInitFunc(function() {
    GameFramework.JSONFormatException.staticInit();
});
/**
 * @constructor
 */
GameFramework.Sprite = function GameFramework_Sprite() {
}
GameFramework.Sprite.prototype = {

}
GameFramework.Sprite.staticInit = function GameFramework_Sprite$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.Sprite.registerClass('GameFramework.Sprite', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.Sprite.staticInit();
});
/**
 * @constructor
 */
GameFramework.BaseApp = function GameFramework_BaseApp() {
    this.mCommands = {};
    this.mState = null;
    this.mDispatcher = new GameFramework.events.EventDispatcher();
    this.mDrawTicks = Array.Create(100, 0);
    this.mEventQueue = [];
    this.mExternalCallbackMap = {};
    this.mResourceStreamerList = [];
    this.mConnectedRequestQueue = [];
    this.mLogArray = [];
    GameFramework.BaseApp.initializeBase(this);
    GameFramework.BaseApp.mApp = this;
    this.mSoundManager = new GameFramework.resources.SoundManager();
    this.mResourceManager = new GameFramework.resources.ResourceManager();
    this.mURLBase = './';
}
GameFramework.BaseApp.prototype = {
    mCommands : null,
    mVolume : 1.0,
    mState : null,
    mSoundManager : null,
    mResourceManager : null,
    mUserId : null,
    mDeviceId : null,
    mExecutionUserId : null,
    mExecutionId : null,
    mProdName : 'PopCapGame',
    mVersion : '',
    mURLBase : null,
    mGraphics : null,
    mSocialService : null,
    mDatabase : null,
    mHTTPService : null,
    mDispatcher : null,
    mX : 0,
    mY : 0,
    mDrawWidth : 0,
    mDrawHeight : 0,
    mWidth : 0,
    mHeight : 0,
    mLandscapeWidth : 0,
    mLandscapeHeight : 0,
    mAllowRotation : false,
    mArtRes : 0,
    mScale : 1.0,
    mPhysWidth : 0,
    mPhysHeight : 0,
    mUpdateCnt : 0,
    mFrameTime : 10.0,
    mTimeScale : 1.0,
    mExecutionStopped : null,
    mDrawCount : 0,
    mDrawTicks : null,
    mCurFPS : 0,
    mLastCurFPSTick : 0,
    mEventQueue : null,
    mExternalCallbackMap : null,
    mResourceStreamerList : null,
    mConnectedRequestQueue : null,
    mLogArray : null,
    mExceptionString : null,
    mExceptionCallback : null,
    mBackgrounded : false,
    get_Is3D : function GameFramework_BaseApp$get_Is3D() {
        return false;
    },
    AddEventListener : function GameFramework_BaseApp$AddEventListener(theType, theCallback) {
        this.mDispatcher.AddEventListener(theType, theCallback);
    },
    HasEventListener : function GameFramework_BaseApp$HasEventListener(theType) {
        return this.mDispatcher.HasEventListener(theType);
    },
    DispatchEvent : function GameFramework_BaseApp$DispatchEvent(theEvent) {
        this.mDispatcher.DispatchEvent(theEvent);
    },
    AddExternalCallback : function GameFramework_BaseApp$AddExternalCallback(theObject, theName) {
        this.mExternalCallbackMap[theName] = theObject;
    },
    GenerateExecutionId : function GameFramework_BaseApp$GenerateExecutionId() {
        if(this.mExecutionId != null) {
            return;
        }
        if(this.mExecutionUserId == null) {
            this.mExecutionUserId = this.GetLocalData(this.mProdName, 'ExecutionUserId');
        }
        if(this.mExecutionUserId == null) {
            this.mExecutionUserId = '';
            var aString = 'ABCDEFGHJIJKLMNOPQRSTUVWXYZ';
            var aPrefixInt = ((GameFramework.Utils.GetRandFloatU() * 1000000000) | 0);
            while(aPrefixInt != 0) {
                this.mExecutionUserId += aString.substr(aPrefixInt % aString.length, 1);
                aPrefixInt = ((((aPrefixInt / aString.length) | 0)) | 0);
            }
            this.SetLocalData(this.mProdName, 'ExecutionUserId', this.mExecutionUserId);
        }
        this.mExecutionId = this.mExecutionUserId + GameFramework.Utils.ToString((GameFramework.Utils.GetUnixTime() | 0));
    },
    SetExceptionCallback : function GameFramework_BaseApp$SetExceptionCallback(theExceptionCallback) {
        this.mExceptionCallback = theExceptionCallback;
    },
    HandleException : function GameFramework_BaseApp$HandleException(theException) {
        this.mExecutionStopped = true;
        if(this.mExceptionCallback != null) {
            if(!this.mExceptionCallback.invoke(theException)) {
                throw theException;
            }
        } else {
            throw theException;
        }
    },
    RunStep : function GameFramework_BaseApp$RunStep() {
        return true;
    },
    RunDone : function GameFramework_BaseApp$RunDone() {
    },
    CreateGraphics : function GameFramework_BaseApp$CreateGraphics() {
    },
    Init : function GameFramework_BaseApp$Init() {
        if(this.mLandscapeWidth == 0) {
            this.mLandscapeWidth = this.mWidth;
            this.mLandscapeHeight = this.mHeight;
        } else {
            this.mWidth = this.mLandscapeWidth;
            this.mHeight = this.mLandscapeHeight;
        }
        this.mDrawWidth = this.mWidth;
        this.mDrawHeight = this.mHeight;
        this.GenerateExecutionId();
        GameFramework.Utils.Log('Init', Array.Create(3, null, new GameFramework.misc.KeyVal('ProdName', this.mProdName), new GameFramework.misc.KeyVal('Version', this.mVersion), new GameFramework.misc.KeyVal('ExecutionId', this.mExecutionId)));
        this.CreateDatabase();
        this.CreateGraphics();
        this.CreateHTTPService();
    },
    SizeChanged : function GameFramework_BaseApp$SizeChanged(theWidth, theHeight) {
        this.mPhysWidth = theWidth;
        this.mPhysHeight = theHeight;
        this.mScale = this.mPhysHeight / this.mHeight;
    },
    SetBackgrounded : function GameFramework_BaseApp$SetBackgrounded(isBackgrounded) {
    },
    ShutdownHook : function GameFramework_BaseApp$ShutdownHook() {
    },
    QueueEvent : function GameFramework_BaseApp$QueueEvent(theEvent, theDispatcher) {
        //JS            
        theEvent.dispatcher = theDispatcher;
        theEvent.target = theDispatcher;
        mEventQueue.Add(theEvent);
        //-JS
    },
    SendQueuedEvents : function GameFramework_BaseApp$SendQueuedEvents() {
        /*CS|JS
         for (;;)
         {
         var anEvent = null;
         -CS|JS*/
        /*CS|JS
         {
         if (this.mEventQueue.length == 0)
         break;
         anEvent = (this.mEventQueue[0]);
         this.mEventQueue.removeAt(0);
         }
         anEvent.dispatcher.DispatchEvent(anEvent);
         }
         -CS|JS*/
    },
    Trace : function GameFramework_BaseApp$Trace(theString) {
    },
    ClearUpdateBacklog : function GameFramework_BaseApp$ClearUpdateBacklog() {
    },
    IsMuted : function GameFramework_BaseApp$IsMuted() {
        return false;
    },
    GetSoundInst : function GameFramework_BaseApp$GetSoundInst(theSoundResource) {
        var aSoundInst = new GameFramework.resources.SoundInstance(theSoundResource);
        return aSoundInst;
    },
    PlaySound : function GameFramework_BaseApp$PlaySound(theSoundResource) {
        var aSoundInst = this.GetSoundInst(theSoundResource);
        if(aSoundInst != null) {
            aSoundInst.Play();
        }
        return aSoundInst;
    },
    PlaySoundEx : function GameFramework_BaseApp$PlaySoundEx(theSoundResource, theVolume, thePan) {
        var aSoundInst = this.GetSoundInst(theSoundResource);
        if(aSoundInst != null) {
            aSoundInst.SetVolume(theVolume);
            aSoundInst.SetPan(thePan);
            aSoundInst.PlayEx(false, true);
        }
        return aSoundInst;
    },
    TranslateString : function GameFramework_BaseApp$TranslateString(theStringId) {
        return theStringId;
    },
    ImageLoading : function GameFramework_BaseApp$ImageLoading(theId) {
    },
    ImageLoaded : function GameFramework_BaseApp$ImageLoaded(theId) {
    },
    Run : function GameFramework_BaseApp$Run() {
    },
    Start : function GameFramework_BaseApp$Start(theState) {
        this.mState = theState;
    },
    AddResourceStreamer : function GameFramework_BaseApp$AddResourceStreamer(theResourceStreamer) {
        this.mResourceStreamerList.push(theResourceStreamer);
    },
    GetResourceStreamerForId : function GameFramework_BaseApp$GetResourceStreamerForId(theId) {

        {
            var $enum1 = ss.IEnumerator.getEnumerator(this.mResourceStreamerList);
            while($enum1.moveNext()) {
                var aResourceStreamer = $enum1.get_current();
                if(aResourceStreamer.mId == theId) {
                    return aResourceStreamer;
                }
            }
        }
        return null;
    },
    HasResourceStreamerForId : function GameFramework_BaseApp$HasResourceStreamerForId(theId) {

        {
            var $enum2 = ss.IEnumerator.getEnumerator(this.mResourceStreamerList);
            while($enum2.moveNext()) {
                var aResourceStreamer = $enum2.get_current();
                if(aResourceStreamer.mId == theId) {
                    return true;
                }
            }
        }
        return false;
    },
    PrioritizeResourceStreamer : function GameFramework_BaseApp$PrioritizeResourceStreamer(theResourceStreamer) {
        {
            JS_SpliceArray(this.mResourceStreamerList, this.mResourceStreamerList.indexOf(theResourceStreamer), 1);
            JS_SpliceArray(this.mResourceStreamerList, 0, 0, theResourceStreamer);
        }
    },
    GetResourceStreamerLoadingCount : function GameFramework_BaseApp$GetResourceStreamerLoadingCount() {
        var aCount = 0;

        {
            var $enum3 = ss.IEnumerator.getEnumerator(this.mResourceStreamerList);
            while($enum3.moveNext()) {
                var aResourceStreamer = $enum3.get_current();
                if((aResourceStreamer.mResourcesLoaded == 0) && (aResourceStreamer.mId != null) && (aResourceStreamer.mPath != null) && (!aResourceStreamer.mPath.startsWith('!'))) {
                    aCount++;
                }
            }
        }
        return aCount;
    },
    CreateDatabase : function GameFramework_BaseApp$CreateDatabase() {
        return null;
    },
    CreateHTTPService : function GameFramework_BaseApp$CreateHTTPService() {
        this.mHTTPService = new GameFramework.connected.HTTPService();
        return this.mHTTPService;
    },
    CreateSocialService : function GameFramework_BaseApp$CreateSocialService(theName) {
        return null;
    },
    CreateConnectRequest : function GameFramework_BaseApp$CreateConnectRequest() {
        var aConnectRequest = new GameFramework.connected.ConnectedRequest();
        this.mConnectedRequestQueue.push(aConnectRequest);
        return aConnectRequest;
    },
    GotScreenSize : function GameFramework_BaseApp$GotScreenSize(theWidth, theHeight) {
    },
    Update : function GameFramework_BaseApp$Update() {
        this.mUpdateCnt++;
        if(this.mState != null) {
            this.mState.Update();
        }
        if(this.mDatabase != null) {
            this.mDatabase.Update();
        }
        if(this.mSocialService != null) {
            this.mSocialService.Update();
        }
        if(this.mHTTPService != null) {
            this.mHTTPService.Update();
        }
        this.SendQueuedEvents();
        var anEvent = new GameFramework.events.Event('update');
        this.DispatchEvent(anEvent);
    },
    Draw : function GameFramework_BaseApp$Draw() {
        if(this.mState != null) {
            this.mState.Draw(10);
        }
        var aMS = GameFramework.Utils.GetRunningMilliseconds();
        this.mDrawTicks[this.mDrawCount % 100] = aMS;
        var aTotalDraws = 0;
        var aTotalTicks = 0;
        var aPrevTick = aMS;
        var aCheckOffset = -1;
        while((aCheckOffset > -100) && (aTotalTicks < 1000)) {
            var aCurTick = this.mDrawTicks[(this.mDrawCount + 100 + aCheckOffset) % 100];
            if(aCurTick == 0) {
                break;
            }
            aTotalTicks += aPrevTick - aCurTick;
            aTotalDraws++;
            aPrevTick = aCurTick;
            aCheckOffset--;
        }
        if((aTotalTicks >= 500) && (aMS - this.mLastCurFPSTick >= 200)) {
            this.mCurFPS = (((aTotalDraws * 1000) / aTotalTicks + 0.5) | 0);
            this.mLastCurFPSTick = aMS;
        }
        this.mDrawCount++;
    },
    ParseXML : function GameFramework_BaseApp$ParseXML(theXML, theData) {
    },
    DecodeJSON : function GameFramework_BaseApp$DecodeJSON(theData, theDataObject) {
    },
    EncodeJSON : function GameFramework_BaseApp$EncodeJSON(theDataObject) {
        return '';
    },
    GetLocalData : function GameFramework_BaseApp$GetLocalData(theGroupName, theDataName) {
        return null;
    },
    SetLocalData : function GameFramework_BaseApp$SetLocalData(theGroupName, theDataName, theData) {
    },
    DeleteLocalData : function GameFramework_BaseApp$DeleteLocalData(theGroupName, theDataName) {
    },
    Log : function GameFramework_BaseApp$Log(theEvent, theParam) {
        this.mLogArray.push(this.EncodeJSON(Array.Create(3, null, new GameFramework.misc.KeyVal('Event', theEvent), new GameFramework.misc.KeyVal('Time', GameFramework.Utils.GetUnixTime()), new GameFramework.misc.KeyVal('Param', theParam))));
    },
    LogJSON : function GameFramework_BaseApp$LogJSON(theEvent, theJSONParam) {
        this.mLogArray.push(this.EncodeJSON(Array.Create(3, null, new GameFramework.misc.KeyVal('Event', theEvent), new GameFramework.misc.KeyVal('Time', GameFramework.Utils.GetUnixTime()), new GameFramework.misc.KeyVal('Param', new GameFramework.misc.JSONString(theJSONParam)))));
    },
    CreateBufferData : function GameFramework_BaseApp$CreateBufferData() {
        return new GameFramework.DataBufferData();
    },
    UpdateConnectedRequests : function GameFramework_BaseApp$UpdateConnectedRequests() {
    }
}
GameFramework.BaseApp.prototype['SetExceptionCallback'] = GameFramework.BaseApp.prototype.SetExceptionCallback;
GameFramework.BaseApp.staticInit = function GameFramework_BaseApp$staticInit() {
    GameFramework.BaseApp.mApp = null;
}

JS_AddInitFunc(function() {
    GameFramework.BaseApp.registerClass('GameFramework.BaseApp', GameFramework.Sprite);
});
JS_AddStaticInitFunc(function() {
    GameFramework.BaseApp.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\BaseApp.cs
//LineMap:1=5 2=7 11=34 20=38 23=46 25=45 26=47 40=53 56=58 59=185 61=60 62=63 63=80 64=102 65=106 66=108 71=186 74=194 79=62 87=71 95=82 99=87 112=101 123=114 127=116 130=118 145=136 154=146 166=159 168=162 171=166 179=175 186=181 189=200 198=210 212=223 215=227 217=230 
//LineMap:248=272 256=283 259=287 262=291 271=306 306=375 319=389 323=394 328=406 330=411 337=416 341=417 345=419 352=424 356=425 360=427 365=435 374=445 376=445 380=448 381=450 416=486 417=488 428=500 436=509 437=511 440=515 442=518 452=529 457=535 464=543 468=548 486=567 
//LineMap:491=573 496=579 
//Start:CurvedVal
/**
 * @constructor
 */
GameFramework.CurvedVal = function GameFramework_CurvedVal(theOptionalCurve) {
    if(theOptionalCurve === undefined) {
        theOptionalCurve = '';
    }
    this.InitVarDefaults();
    if(theOptionalCurve.length > 0) {
        this.SetCurve(theOptionalCurve);
    }
}
GameFramework.CurvedVal.CreateAsConstant = function GameFramework_CurvedVal$CreateAsConstant(theVal) {
    var ret = new GameFramework.CurvedVal();
    ret.SetConstant(theVal);
    return ret;
}
GameFramework.CurvedVal.CVCharToFloat = function GameFramework_CurvedVal$CVCharToFloat(theChar) {
    if(theChar >= 92) {
        theChar--;
    }
    return (theChar - 35) / 90.0;
}
GameFramework.CurvedVal.CVCharToInt = function GameFramework_CurvedVal$CVCharToInt(theChar) {
    if(theChar >= 92) {
        theChar--;
    }
    return theChar - 35;
}
GameFramework.CurvedVal.CVStrToAngle = function GameFramework_CurvedVal$CVStrToAngle(theStr) {
    var aAngleInt = 0;
    aAngleInt += GameFramework.CurvedVal.CVCharToInt(GameFramework.Utils.GetCharCodeAt(theStr, 0));
    aAngleInt *= 90;
    aAngleInt += GameFramework.CurvedVal.CVCharToInt(GameFramework.Utils.GetCharCodeAt(theStr, 1));
    aAngleInt *= 90;
    aAngleInt += GameFramework.CurvedVal.CVCharToInt(GameFramework.Utils.GetCharCodeAt(theStr, 2));
    return aAngleInt * 360.0 / (90.0 * 90.0 * 90.0);
}
GameFramework.CurvedVal.prototype = {
    mMode : 0,
    mRamp : 0,
    mIncRate : 0,
    mOutMin : 0,
    mOutMax : 0,
    mChangeIdx : 0,
    mInitAppUpdateCount : 0,
    mAppUpdateCountSrc : null,
    mLinkedVal : null,
    mRefName : null,
    mCurveCacheRecord : null,
    mCurOutVal : 0,
    mPrevOutVal : 0,
    mInMin : 0,
    mInMax : 0,
    mNoClip : null,
    mSingleTrigger : null,
    mOutputSync : null,
    mTriggered : null,
    mIsHermite : null,
    mAutoInc : null,
    mInitialized : false,
    mPrevInVal : 0,
    mInVal : 0,
    SetCurveRefLinked : function GameFramework_CurvedVal$SetCurveRefLinked(theRef, theLinkedVal) {
        var aCurveData;
        //JS
        var aCurveData = '';
        aCurveData = Game.CurvedValTable[theRef];
        //-JS
        this.SetCurveLinked(aCurveData, theLinkedVal);
        this.mRefName = theRef;
        return this;
    },
    SetCurveRef : function GameFramework_CurvedVal$SetCurveRef(theRef) {
        var aCurveData;
        //JS
        var aCurveData = '';
        aCurveData = Game.CurvedValTable[theRef];
        //-JS
        this.SetCurveLinked(aCurveData, null);
        this.mRefName = theRef;
        return this;
    },
    SetCurveLinked : function GameFramework_CurvedVal$SetCurveLinked(theData, theLinkedVal) {
        this.mRefName = null;
        if(this.mAppUpdateCountSrc != null) {
            this.mInitAppUpdateCount = this.mAppUpdateCountSrc.mUpdateCnt;
        } else {
            this.mInitAppUpdateCount = GameFramework.BaseApp.mApp.mUpdateCnt;
        }
        this.mTriggered = false;
        this.mLinkedVal = theLinkedVal;
        this.mRamp = GameFramework.CurvedVal.RAMP_CURVEDATA;
        this.ParseDataString(theData);
        this.mInVal = this.mInMin;
        return this;
    },
    SetCurve : function GameFramework_CurvedVal$SetCurve(theData) {
        this.SetCurveLinked(theData, null);
        return this;
    },
    InitVarDefaults : function GameFramework_CurvedVal$InitVarDefaults() {
        this.mMode = GameFramework.CurvedVal.MODE_CLAMP;
        this.mRamp = GameFramework.CurvedVal.RAMP_NONE;
        this.mCurveCacheRecord = null;
        this.mSingleTrigger = false;
        this.mNoClip = false;
        this.mOutputSync = false;
        this.mTriggered = false;
        this.mIsHermite = false;
        this.mAutoInc = false;
        this.mInitAppUpdateCount = 0;
        this.mAppUpdateCountSrc = null;
        this.mOutMin = 0.0;
        this.mOutMax = 1.0;
        this.mInMin = 0.0;
        this.mInMax = 1.0;
        this.mLinkedVal = null;
        this.mCurOutVal = 0;
        this.mInVal = 0.0;
        this.mPrevInVal = 0.0;
        this.mIncRate = 0;
        this.mPrevOutVal = 0;
    },
    GenerateTable : function GameFramework_CurvedVal$GenerateTable(theDataPointVector, theBuffer) {
        var aSpline = new GameFramework.misc.BSpline();
        var i;
        for(i = 0; i < (theDataPointVector.length | 0); i++) {
            var aCurvePoint = (theDataPointVector[i]);
            aSpline.AddPoint(aCurvePoint.mX, aCurvePoint.mY);
        }
        aSpline.CalculateSpline(false);
        var first = true;
        var aLastGX = 0;
        var aLastX = 0;
        var aLastY = 0;
        var aDataPointLength = theDataPointVector.length;
        var aBufferLength = theBuffer.length;
        for(i = 1; i < aDataPointLength; i++) {
            var aPrevPoint = (theDataPointVector[i - 1]);
            var aPoint = (theDataPointVector[i]);
            var aStartX = ((aPrevPoint.mX * (aBufferLength - 1) + 0.5) | 0);
            var anEndX = ((aPoint.mX * (aBufferLength - 1) + 0.5) | 0);
            for(var aCheckX = aStartX; aCheckX <= anEndX; aCheckX++) {
                var aT = i - 1 + (aCheckX - aStartX) / (anEndX - aStartX);
                var aSY = aSpline.GetYPoint(aT);
                var aSX = aSpline.GetXPoint(aT);
                var aGX = ((aSX * (aBufferLength - 1) + 0.5) | 0);
                if((aGX >= aLastGX) && (aGX <= anEndX)) {
                    if(!first) {
                        var aVal;
                        if(aGX > aLastGX + 1) {
                            for(var aX = aLastGX; aX <= aGX; aX++) {
                                var aDist = (aX - aLastGX) / (aGX - aLastGX);
                                aVal = aDist * aSY + (1.0 - aDist) * aLastY;
                                if(!this.mNoClip) {
                                    aVal = Math.min(Math.max(aVal, 0.0), 1.0);
                                }
                                theBuffer[aX] = aVal;
                            }
                        } else {
                            aVal = aSY;
                            if(!this.mNoClip) {
                                aVal = Math.min(Math.max(aVal, 0.0), 1.0);
                            }
                            theBuffer[aGX] = aVal;
                        }
                    }
                    aLastGX = aGX;
                    aLastX = aSX;
                    aLastY = aSY;
                    first = false;
                }
            }
        }
        for(i = 0; i < aDataPointLength; i++) {
            var anExactPoint = (theDataPointVector[i]);
            var aXPt = ((anExactPoint.mX * (aBufferLength - 1) + 0.5) | 0);
            theBuffer[aXPt] = anExactPoint.mY;
        }
    },
    ParseDataString : function GameFramework_CurvedVal$ParseDataString(theString) {
        this.mIncRate = 0;
        this.mOutMin = 0;
        this.mOutMax = 1;
        this.mSingleTrigger = false;
        this.mNoClip = false;
        this.mOutputSync = false;
        this.mIsHermite = false;
        this.mAutoInc = false;
        var anIdx = 0;
        var aVersion = 0;
        var aFirstChar = GameFramework.Utils.GetCharCodeAt(theString, 0);
        if((aFirstChar >= 97) && (aFirstChar <= 98)) {
            aVersion = aFirstChar - 97;
        }
        anIdx++;
        if(aVersion >= 1) {
            var aFlags = GameFramework.CurvedVal.CVCharToInt(GameFramework.Utils.GetCharCodeAt(theString, anIdx++));
            this.mNoClip = (aFlags & GameFramework.CurvedVal.DFLAG_NOCLIP) != 0;
            this.mSingleTrigger = (aFlags & GameFramework.CurvedVal.DFLAG_SINGLETRIGGER) != 0;
            this.mOutputSync = (aFlags & GameFramework.CurvedVal.DFLAG_OUTPUTSYNC) != 0;
            this.mIsHermite = (aFlags & GameFramework.CurvedVal.DFLAG_HERMITE) != 0;
            this.mAutoInc = (aFlags & GameFramework.CurvedVal.DFLAG_AUTOINC) != 0;
        }
        var aCommaPos = (theString.indexOf(String.fromCharCode(44), anIdx) | 0);
        if(aCommaPos == -1) {
            this.mIsHermite = true;
            return;
        }
        var aVal = GameFramework.Utils.ToFloat(theString.substr(anIdx, aCommaPos - anIdx));
        this.mOutMin = aVal;
        anIdx = aCommaPos + 1;
        aCommaPos = theString.indexOf(String.fromCharCode(44), anIdx);
        if(aCommaPos == -1) {
            return;
        }
        aVal = GameFramework.Utils.ToFloat(theString.substr(anIdx, aCommaPos - anIdx));
        this.mOutMax = aVal;
        anIdx = aCommaPos + 1;
        aCommaPos = theString.indexOf(String.fromCharCode(44), anIdx);
        if(aCommaPos == -1) {
            return;
        }
        aVal = GameFramework.Utils.ToFloat(theString.substr(anIdx, aCommaPos - anIdx));
        this.mIncRate = aVal;
        anIdx = aCommaPos + 1;
        if(aVersion >= 1) {
            aCommaPos = theString.indexOf(String.fromCharCode(44), anIdx);
            if(aCommaPos == -1) {
                return;
            }
            aVal = GameFramework.Utils.ToFloat(theString.substr(anIdx, aCommaPos - anIdx));
            this.mInMax = aVal;
            anIdx = aCommaPos + 1;
        }
        var aCurveString = theString.substr(anIdx);
        this.mChangeIdx = GameFramework.CurvedVal.mCurCurveChangeIdx;
        this.mCurveCacheRecord = (GameFramework.CurvedVal.mCurveCacheMap[aCurveString]);
        if(this.mCurveCacheRecord == null) {
            this.mCurveCacheRecord = new GameFramework.misc.CurveCacheRecord();
            GameFramework.CurvedVal.mCurveCacheMap[aCurveString] = this.mCurveCacheRecord;
            var aDataPointVector = [];
            var aCurTime = 0;
            while(anIdx < theString.length) {
                var aChar = GameFramework.Utils.GetCharCodeAt(theString, anIdx++);
                var aDataPoint = new GameFramework.misc.CurveValDataPoint();
                aDataPoint.mX = aCurTime;
                aDataPoint.mY = GameFramework.CurvedVal.CVCharToFloat(aChar);
                if(this.mIsHermite) {
                    var aAngleStr = theString.substr(anIdx, 3);
                    aDataPoint.mAngleDeg = GameFramework.CurvedVal.CVStrToAngle(aAngleStr);
                    anIdx += 3;
                } else {
                    aDataPoint.mAngleDeg = 0.0;
                }
                aDataPointVector.push(aDataPoint);
                while(anIdx < theString.length) {
                    aChar = GameFramework.Utils.GetCharCodeAt(theString, anIdx++);
                    if(aChar == 32) {
                        aCurTime += 0.1;
                        continue;
                    }
                    aCurTime = Math.min(aCurTime + GameFramework.CurvedVal.CVCharToFloat(aChar) * 0.1, 1.0);
                    break;
                }
            }
            if(!this.mIsHermite) {
                this.mCurveCacheRecord.mTable = Array.Create(GameFramework.CurvedVal.CV_NUM_SPLINE_POINTS, null);
                this.GenerateTable(aDataPointVector, this.mCurveCacheRecord.mTable);
            }
            this.mCurveCacheRecord.mDataStr = theString;
            this.mCurveCacheRecord.mHermiteCurve = new GameFramework.misc.SexyMathHermite();
            this.mCurveCacheRecord.mHermiteCurve.mPoints.clear();
            for(var i = 0; i < (aDataPointVector.length | 0); ++i) {
                var aPoint = (aDataPointVector[i]);
                var aSlope = Math.tan(aPoint.mAngleDeg * 3.14159 / 180.0);
                this.mCurveCacheRecord.mHermiteCurve.AddPoint(aPoint.mX, aPoint.mY, aSlope);
            }
            this.mCurveCacheRecord.mHermiteCurve.Rebuild();
        }
        this.mInitialized = true;
    },
    SetCurveMultLinked : function GameFramework_CurvedVal$SetCurveMultLinked(theData, theLinkedVal) {
        var aCurVal = this.GetOutVal();
        this.SetCurveLinked(theData, theLinkedVal);
        this.mOutMax *= aCurVal;
    },
    SetCurveMult : function GameFramework_CurvedVal$SetCurveMult(theData) {
        var aCurVal = this.GetOutVal();
        this.SetCurveLinked(theData, null);
        this.mOutMax *= aCurVal;
    },
    SetConstant : function GameFramework_CurvedVal$SetConstant(theValue) {
        this.mInVal = 0;
        this.mTriggered = false;
        this.mLinkedVal = null;
        this.mRamp = GameFramework.CurvedVal.RAMP_NONE;
        this.mInMin = this.mInMax = 0;
        this.mOutMin = this.mOutMax = theValue;
        this.mIncRate = 0;
        this.mInitialized = true;
    },
    IsInitialized : function GameFramework_CurvedVal$IsInitialized() {
        return this.mInitialized;
    },
    CheckCurveChange : function GameFramework_CurvedVal$CheckCurveChange() {
        if((this.mRefName != null) && (GameFramework.CurvedVal.mCurCurveChangeIdx != this.mChangeIdx)) {
            this.ParseDataString((GameFramework.CurvedVal.mRefToStringMap[this.mRefName]));
        }
    },
    CheckClamping : function GameFramework_CurvedVal$CheckClamping() {
        this.CheckCurveChange();
        if(this.mMode == GameFramework.CurvedVal.MODE_CLAMP) {
            if(this.mInVal < this.mInMin) {
                this.mInVal = this.mInMin;
                return false;
            }
            if(this.mInVal > this.mInMax) {
                this.mInVal = this.mInMax;
                return false;
            }
        } else if((this.mMode == GameFramework.CurvedVal.MODE_REPEAT) || (this.mMode == GameFramework.CurvedVal.MODE_PING_PONG)) {
            var aRangeSpan = this.mInMax - this.mInMin;
            if((this.mInVal > this.mInMax) || (this.mInVal < this.mInMin)) {
                this.mInVal = this.mInMin + ((this.mInVal - this.mInMin + aRangeSpan) % (aRangeSpan));
            }
        }
        return true;
    },
    SetMode : function GameFramework_CurvedVal$SetMode(theMode) {
        this.mMode = theMode;
    },
    SetRamp : function GameFramework_CurvedVal$SetRamp(theRamp) {
        this.mRamp = theRamp;
    },
    SetOutRange : function GameFramework_CurvedVal$SetOutRange(theMin, theMax) {
        this.mOutMin = theMin;
        this.mOutMax = theMax;
    },
    SetInRange : function GameFramework_CurvedVal$SetInRange(theMin, theMax) {
        this.mInMin = theMin;
        this.mInMax = theMax;
    },
    get_v : function GameFramework_CurvedVal$get_v() {
        if(this.mRamp == GameFramework.CurvedVal.RAMP_NONE) {
            return this.mOutMin;
        } else {
            return this.GetOutVal();
        }
    },
    GetOutValAt : function GameFramework_CurvedVal$GetOutValAt(theInVal) {
        var anAngle;
        switch(this.mRamp) {
            case GameFramework.CurvedVal.RAMP_NONE:
            {
                return this.mOutMin;
            }
            case GameFramework.CurvedVal.RAMP_LINEAR:

            {
                if(this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    if((theInVal - this.mInMin) <= ((this.mInMax - this.mInMin) / 2.0)) {
                        return this.mOutMin + (((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) * (this.mOutMax - this.mOutMin) * 2.0);
                    } else {
                        return this.mOutMin + ((1.0 - ((theInVal - this.mInMin) / (this.mInMax - this.mInMin))) * (this.mOutMax - this.mOutMin) * 2.0);
                    }
                } else {
                    if(this.mInMin == this.mInMax) {
                        return this.mOutMin;
                    } else {
                        return this.mOutMin + (((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) * (this.mOutMax - this.mOutMin));
                    }
                }
            }

            case GameFramework.CurvedVal.RAMP_SLOW_TO_FAST:

            {
                anAngle = ((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) * GameFramework.CurvedVal.PI / 2.0;
                if(this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    anAngle *= 2.0;
                }
                if(anAngle > GameFramework.CurvedVal.PI / 2.0) {
                    anAngle = GameFramework.CurvedVal.PI - anAngle;
                }
                return this.mOutMin + ((1.0 - Math.cos(anAngle)) * (this.mOutMax - this.mOutMin));
            }

            case GameFramework.CurvedVal.RAMP_FAST_TO_SLOW:

            {
                anAngle = ((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) * GameFramework.CurvedVal.PI / 2.0;
                if(this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    anAngle *= 2.0;
                }
                return this.mOutMin + ((Math.sin(anAngle)) * (this.mOutMax - this.mOutMin));
            }

            case GameFramework.CurvedVal.RAMP_SLOW_FAST_SLOW:

            {
                anAngle = ((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) * GameFramework.CurvedVal.PI;
                if(this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    anAngle *= 2.0;
                }
                return this.mOutMin + (((-Math.cos(anAngle) + 1.0) / 2.0) * (this.mOutMax - this.mOutMin));
            }

            case GameFramework.CurvedVal.RAMP_FAST_SLOW_FAST:

            {
                anAngle = ((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) * GameFramework.CurvedVal.PI;
                if(this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    anAngle *= 2.0;
                }
                if(anAngle > GameFramework.CurvedVal.PI) {
                    anAngle = GameFramework.CurvedVal.PI * 2 - anAngle;
                }
                if(anAngle < GameFramework.CurvedVal.PI / 2.0) {
                    return this.mOutMin + ((Math.sin(anAngle) / 2.0) * (this.mOutMax - this.mOutMin));
                } else {
                    return this.mOutMin + (((2.0 - Math.sin(anAngle)) / 2.0) * (this.mOutMax - this.mOutMin));
                }
            }

            case GameFramework.CurvedVal.RAMP_CURVEDATA:

            {
                this.CheckCurveChange();
                if(this.mCurveCacheRecord == null) {
                    return 0;
                }
                if((this.mInMax - this.mInMin) == 0) {
                    return 0;
                }
                var aCheckInVal = Math.min(((theInVal - this.mInMin) / (this.mInMax - this.mInMin)), 1.0);
                if(this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    if(aCheckInVal > 0.5) {
                        aCheckInVal = (1.0 - aCheckInVal) * 2.0;
                    } else {
                        aCheckInVal *= 2.0;
                    }
                }
                if(this.mIsHermite) {
                    var anOutVal = this.mOutMin + this.mCurveCacheRecord.mHermiteCurve.Evaluate(aCheckInVal) * (this.mOutMax - this.mOutMin);
                    if(!this.mNoClip) {
                        if(this.mOutMin < this.mOutMax) {
                            anOutVal = Math.min(Math.max(anOutVal, this.mOutMin), this.mOutMax);
                        } else {
                            anOutVal = Math.max(Math.min(anOutVal, this.mOutMin), this.mOutMax);
                        }
                    }
                    return anOutVal;
                }
                var aGX = aCheckInVal * (GameFramework.CurvedVal.CV_NUM_SPLINE_POINTS - 1);
                var aLeft = (aGX | 0);
                if(aLeft == GameFramework.CurvedVal.CV_NUM_SPLINE_POINTS - 1) {
                    return this.mOutMin + this.mCurveCacheRecord.mTable[aLeft] * (this.mOutMax - this.mOutMin);
                }
                var aFrac = aGX - aLeft;
                var aTableOutVal = this.mOutMin + (this.mCurveCacheRecord.mTable[aLeft] * (1.0 - aFrac) + this.mCurveCacheRecord.mTable[aLeft + 1] * aFrac) * (this.mOutMax - this.mOutMin);
                return aTableOutVal;
            }

        }
        return this.mOutMin;
    },
    GetOutFinalVal : function GameFramework_CurvedVal$GetOutFinalVal() {
        return this.GetOutValAt(this.mInMax);
    },
    GetOutVal : function GameFramework_CurvedVal$GetOutVal() {
        var anOutVal = this.GetOutValAt(this.GetInVal());
        this.mCurOutVal = anOutVal;
        return anOutVal;
    },
    GetInVal : function GameFramework_CurvedVal$GetInVal() {
        var anInVal = this.mInVal;
        if(this.mLinkedVal != null) {
            if(this.mLinkedVal.mOutputSync) {
                anInVal = this.mLinkedVal.GetOutVal();
            } else {
                anInVal = this.mLinkedVal.GetInVal();
            }
        } else if(this.mAutoInc) {
            var aCurUpdateCnt;
            if(this.mAppUpdateCountSrc != null) {
                aCurUpdateCnt = this.mAppUpdateCountSrc.mUpdateCnt;
            } else {
                aCurUpdateCnt = GameFramework.BaseApp.mApp.mUpdateCnt;
            }
            anInVal = this.mInMin + (aCurUpdateCnt - this.mInitAppUpdateCount) * this.mIncRate * GameFramework.BaseApp.mApp.mFrameTime / 10.0;
            if((this.mMode == GameFramework.CurvedVal.MODE_REPEAT) || (this.mMode == GameFramework.CurvedVal.MODE_PING_PONG)) {
                anInVal = ((anInVal - this.mInMin) % (this.mInMax - this.mInMin)) + this.mInMin;
            } else {
                anInVal = Math.min(anInVal, this.mInMax);
            }
        }
        if(this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
            var aCheckInVal = ((anInVal - this.mInMin) / (this.mInMax - this.mInMin));
            if(aCheckInVal > 0.5) {
                return this.mInMin + (1.0 - aCheckInVal) * 2 * (this.mInMax - this.mInMin);
            } else {
                return this.mInMin + aCheckInVal * 2 * (this.mInMax - this.mInMin);
            }
        } else {
            return anInVal;
        }
    },
    SetInVal : function GameFramework_CurvedVal$SetInVal(theVal, theRealignAutoInc) {
        this.mPrevOutVal = this.GetOutVal();
        this.mTriggered = false;
        this.mPrevInVal = theVal;
        if(this.mAutoInc && theRealignAutoInc) {
            this.mInitAppUpdateCount -= (((theVal - this.mInVal) * 1000.0 / GameFramework.BaseApp.mApp.mFrameTime) | 0);
        }
        this.mInVal = theVal;
        var going = this.CheckClamping();
        if(!going) {
            if(!this.mTriggered) {
                this.mTriggered = true;
                return false;
            }
            return this.mSingleTrigger;
        }
        return true;
    },
    IncInValBy : function GameFramework_CurvedVal$IncInValBy(theInc) {
        this.mPrevOutVal = this.GetOutVal();
        this.mPrevInVal = this.mInVal;
        this.mInVal += theInc;
        var going = this.CheckClamping();
        if(!going) {
            if(!this.mTriggered) {
                this.mTriggered = true;
                return false;
            }
            return this.mSingleTrigger;
        }
        return true;
    },
    IncInVal : function GameFramework_CurvedVal$IncInVal() {
        if(this.mIncRate == 0.0) {
            return false;
        }
        return this.IncInValBy(this.mIncRate * GameFramework.BaseApp.mApp.mFrameTime / 10.0);
    },
    CheckInThreshold : function GameFramework_CurvedVal$CheckInThreshold(theInVal) {
        var aCurInVal = this.mInVal;
        var aPrevInVal = this.mPrevInVal;
        if(this.mAutoInc) {
            aCurInVal = this.GetInVal();
            aPrevInVal = aCurInVal - this.mIncRate * 1.5;
        }
        return (theInVal > aPrevInVal) && (theInVal <= aCurInVal);
    },
    CheckUpdatesFromEndThreshold : function GameFramework_CurvedVal$CheckUpdatesFromEndThreshold(theUpdateCount) {
        return this.CheckInThreshold(this.GetInValAtUpdate(this.GetLengthInUpdates() - theUpdateCount));
    },
    GetInValAtUpdate : function GameFramework_CurvedVal$GetInValAtUpdate(theUpdateCount) {
        return this.mInMin + theUpdateCount * this.mIncRate;
    },
    GetLengthInUpdates : function GameFramework_CurvedVal$GetLengthInUpdates() {
        if(this.mIncRate == 0) {
            return -1;
        }
        return (Math.ceil((this.mInMax - this.mInMin) / this.mIncRate) | 0);
    },
    GetOutValDelta : function GameFramework_CurvedVal$GetOutValDelta() {
        return this.GetOutVal() - this.mPrevOutVal;
    },
    HasBeenTriggered : function GameFramework_CurvedVal$HasBeenTriggered() {
        if(this.mAutoInc) {
            this.mTriggered = this.GetInVal() == this.mInMax;
        }
        return this.mTriggered;
    },
    ClearTrigger : function GameFramework_CurvedVal$ClearTrigger() {
        this.mTriggered = false;
    },
    IsDoingCurve : function GameFramework_CurvedVal$IsDoingCurve() {
        return (this.GetInVal() != this.mInMax) && (this.mRamp != GameFramework.CurvedVal.RAMP_NONE);
    },
    Intercept : function GameFramework_CurvedVal$Intercept(theDataP) {
        this.InterceptEx(theDataP, 0.01, false);
    },
    InterceptEx : function GameFramework_CurvedVal$InterceptEx(theDataP, theCheckInIncrPct, theStopAtLocalMin) {
        var curInVal = this.get_v();
        if(theDataP.indexOf(String.fromCharCode(44)) != -1) {
            this.SetCurve(theDataP);
        } else {
            this.SetCurveRef(theDataP);
        }
        this.SetInVal(this.FindClosestInToOutVal(curInVal, theCheckInIncrPct, 0.0, 1.0, theStopAtLocalMin), true);
    },
    FindClosestInToOutVal : function GameFramework_CurvedVal$FindClosestInToOutVal(theTargetOutVal, theCheckInIncrPct, theCheckInRangeMinPct, theCheckInRangeMaxPct, theStopAtLocalMin) {
        var delta = (this.mInMax - this.mInMin);
        var toVal = this.mInMin + delta * theCheckInRangeMaxPct;
        var bestOutVal = 0;
        var bestInVal = -1.0;
        for(var checkInVal = this.mInMin + delta * theCheckInRangeMinPct; checkInVal <= toVal; checkInVal += delta * theCheckInIncrPct) {
            var curDelta = Math.abs(theTargetOutVal - this.GetOutValAt(checkInVal));
            if(bestInVal < 0.0 || curDelta < bestOutVal) {
                bestOutVal = curDelta;
                bestInVal = checkInVal;
            } else if(theStopAtLocalMin) {
                return bestInVal;
            }
        }
        return bestInVal;
    }
}
GameFramework.CurvedVal.staticInit = function GameFramework_CurvedVal$staticInit() {
    GameFramework.CurvedVal.CV_NUM_SPLINE_POINTS = 256;
    GameFramework.CurvedVal.PI = 3.14159;
    GameFramework.CurvedVal.MODE_CLAMP = 0;
    GameFramework.CurvedVal.MODE_REPEAT = 1;
    GameFramework.CurvedVal.MODE_PING_PONG = 2;
    GameFramework.CurvedVal.RAMP_NONE = 0;
    GameFramework.CurvedVal.RAMP_LINEAR = 1;
    GameFramework.CurvedVal.RAMP_SLOW_TO_FAST = 2;
    GameFramework.CurvedVal.RAMP_FAST_TO_SLOW = 3;
    GameFramework.CurvedVal.RAMP_SLOW_FAST_SLOW = 4;
    GameFramework.CurvedVal.RAMP_FAST_SLOW_FAST = 5;
    GameFramework.CurvedVal.RAMP_CURVEDATA = 6;
    GameFramework.CurvedVal.DFLAG_NOCLIP = 1;
    GameFramework.CurvedVal.DFLAG_SINGLETRIGGER = 2;
    GameFramework.CurvedVal.DFLAG_OUTPUTSYNC = 4;
    GameFramework.CurvedVal.DFLAG_HERMITE = 8;
    GameFramework.CurvedVal.DFLAG_AUTOINC = 16;
    GameFramework.CurvedVal.mRefToStringMap = null;
    GameFramework.CurvedVal.mCurvedValFileName = null;
    GameFramework.CurvedVal.mCurCurveChangeIdx = 0;
    GameFramework.CurvedVal.mCurveCacheMap = {};
}

JS_AddInitFunc(function() {
    GameFramework.CurvedVal.registerClass('GameFramework.CurvedVal', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.CurvedVal.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\CurvedVal.cs
//LineMap:2=3 5=74 7=73 8=75 12=80 18=231 24=238 30=245 42=43 47=50 63=68 67=166 74=182 75=184 86=204 87=206 112=256 124=269 125=271 127=274 129=277 137=288 147=299 157=310 159=313 164=319 165=321 184=339 190=346 193=350 197=355 210=369 215=375 221=382 230=392 239=402 
//LineMap:245=409 251=416 260=426 262=429 267=435 268=437 269=439 272=443 284=454 287=458 299=471 304=477 305=479 318=505 332=526 358=553 365=561 371=564 373=569 374=571 377=575 404=604 410=611 414=614 416=617 418=617 419=619 421=620 423=623 430=629 436=634 443=637 444=641 
//LineMap:446=642 447=645 449=648 451=651 454=651 455=654 457=655 458=658 460=661 463=661 464=664 467=669 469=672 472=672 473=675 476=680 478=683 480=686 486=689 487=692 489=693 490=695 492=698 494=701 502=710 514=723 520=730 542=753 549=758 551=762 557=769 562=775 565=779 
//LineMap:569=782 573=785 581=794 583=797 584=799 626=842 631=848 685=903 688=912 690=916 699=926 702=927 704=931 707=935 712=17 714=20 717=24 724=32 731=40 
//Start:DataBuffer
/**
 * @constructor
 */
GameFramework.DataBuffer = function GameFramework_DataBuffer() {
    this.mBufferData = GameFramework.BaseApp.mApp.CreateBufferData();
}
GameFramework.DataBuffer.prototype = {
    mBufferData : null,
    mDidInit : false,
    get_BytesAvailable : function GameFramework_DataBuffer$get_BytesAvailable() {
        return this.mBufferData.get_BytesAvailable();
    },
    get_Size : function GameFramework_DataBuffer$get_Size() {
        return this.mBufferData.get_DataLength();
    },
    get_Position : function GameFramework_DataBuffer$get_Position() {
        return this.mBufferData.get_Position();
    },
    set_Position : function GameFramework_DataBuffer$set_Position(value) {
        this.mBufferData.set_Position(value);
    },
    InitRead : function GameFramework_DataBuffer$InitRead(theData) {
        this.mDidInit = true;
        this.mBufferData.InitRead(theData);
    },
    InitWrite : function GameFramework_DataBuffer$InitWrite() {
        this.mDidInit = true;
        this.mBufferData.InitWrite();
    },
    ToByteArray : function GameFramework_DataBuffer$ToByteArray() {
        return this.mBufferData.ToByteArray();
    },
    ReadByte : function GameFramework_DataBuffer$ReadByte() {
        return this.mBufferData.ReadByte();
    },
    ReadSByte : function GameFramework_DataBuffer$ReadSByte() {
        return this.mBufferData.ReadSByte();
    },
    ReadInt : function GameFramework_DataBuffer$ReadInt() {
        return this.mBufferData.ReadInt();
    },
    ReadShort : function GameFramework_DataBuffer$ReadShort() {
        return this.mBufferData.ReadShort();
    },
    ReadFloat : function GameFramework_DataBuffer$ReadFloat() {
        return this.mBufferData.ReadFloat();
    },
    ReadDouble : function GameFramework_DataBuffer$ReadDouble() {
        return this.mBufferData.ReadDouble();
    },
    ReadBoolean : function GameFramework_DataBuffer$ReadBoolean() {
        return this.mBufferData.ReadBoolean();
    },
    ReadAsciiBytes : function GameFramework_DataBuffer$ReadAsciiBytes(theCount) {
        return this.mBufferData.ReadAsciiBytes(theCount);
    },
    ReadBytes : function GameFramework_DataBuffer$ReadBytes(theBytes, theOffset, theSize) {
        this.mBufferData.ReadBytes(theBytes, theOffset, theSize);
    },
    ReadAsciiString : function GameFramework_DataBuffer$ReadAsciiString() {
        var aCount = this.ReadShort();
        return this.mBufferData.ReadAsciiBytes(aCount);
    },
    ReadUTF8Bytes : function GameFramework_DataBuffer$ReadUTF8Bytes(theCount) {
        return this.mBufferData.ReadUTF8Bytes(theCount);
    },
    ReadUTF8String : function GameFramework_DataBuffer$ReadUTF8String() {
        var aCount = this.mBufferData.ReadInt();
        return this.ReadUTF8Bytes(aCount);
    },
    ReadUTF8CString : function GameFramework_DataBuffer$ReadUTF8CString() {
        var aCurString = '';
        var aBuffer = Array.Create(1024, 0);
        var aBufferIdx = 0;
        while(true) {
            var aByte = this.ReadByte();
            if(aByte == 0) {
                break;
            }
            aBuffer[aBufferIdx++] = aByte;
            if(aBufferIdx >= 1024) {
                aCurString += GameFramework.Utils.ByteArrayToASCII(aBuffer, aBufferIdx);
                aBufferIdx = 0;
            }
        }
        aCurString += GameFramework.Utils.ByteArrayToASCII(aBuffer, aBufferIdx);
        return GameFramework.Utils.UTF8ToString(aCurString);
    },
    ReadBSON : function GameFramework_DataBuffer$ReadBSON(theObject) {
        this.mBufferData.ReadBSON(theObject);
    },
    ToUTF8String : function GameFramework_DataBuffer$ToUTF8String() {
        return this.mBufferData.ToUTF8String();
    },
    WriteInt : function GameFramework_DataBuffer$WriteInt(theInt) {
        if(!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteInt(theInt);
    },
    WriteShort : function GameFramework_DataBuffer$WriteShort(theShort) {
        if(!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteShort(theShort);
    },
    WriteByte : function GameFramework_DataBuffer$WriteByte(theByte) {
        if(!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteByte(theByte);
    },
    WriteFloat : function GameFramework_DataBuffer$WriteFloat(theFloat) {
        if(!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteFloat(theFloat);
    },
    WriteASCIICString : function GameFramework_DataBuffer$WriteASCIICString(theString) {
        if(!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteASCIIString(theString);
        this.mBufferData.WriteByte(0);
    },
    WriteASCIIString : function GameFramework_DataBuffer$WriteASCIIString(theString) {
        if(!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteInt(theString.length);
        this.mBufferData.WriteASCIIString(theString);
    },
    WriteUTF8CString : function GameFramework_DataBuffer$WriteUTF8CString(theString) {
        if(!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteASCIIString(GameFramework.Utils.StringToUTF8(theString));
        this.mBufferData.WriteByte(0);
    },
    WriteUTF8String : function GameFramework_DataBuffer$WriteUTF8String(theString) {
        if(!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteASCIIString(GameFramework.Utils.StringToUTF8(theString));
    },
    WriteBytes : function GameFramework_DataBuffer$WriteBytes(theBytes, theOffset, theSize) {
        this.mBufferData.WriteBytes(theBytes, theOffset, theSize);
    },
    WriteBSON : function GameFramework_DataBuffer$WriteBSON(theObject) {
        if(!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteBSON(theObject);
    }
}
GameFramework.DataBuffer.staticInit = function GameFramework_DataBuffer$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.DataBuffer.registerClass('GameFramework.DataBuffer', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.DataBuffer.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\DataBuffer.cs
//LineMap:2=3 5=11 7=12 12=8 14=15 29=28 31=28 35=31 117=114 119=117 124=123 125=125 131=132 
//Start:DataBufferData
/**
 * @constructor
 */
GameFramework.DataBufferData = function GameFramework_DataBufferData() {
}
GameFramework.DataBufferData.prototype = {
    mLength : 0,
    mPosition : 0,
    get_BytesAvailable : function GameFramework_DataBufferData$get_BytesAvailable() {
        return ((this.mLength - this.mPosition) | 0);
    },
    get_DataLength : function GameFramework_DataBufferData$get_DataLength() {
        return ((this.mLength) | 0);
    },
    get_Position : function GameFramework_DataBufferData$get_Position() {
        return ((this.mPosition) | 0);
    },
    set_Position : function GameFramework_DataBufferData$set_Position(value) {
        this.mPosition = value;
    },
    InitRead : function GameFramework_DataBufferData$InitRead(theData) {
    },
    InitWrite : function GameFramework_DataBufferData$InitWrite() {
    },
    ToByteArray : function GameFramework_DataBufferData$ToByteArray() {
        return null;
    },
    ReadByte : function GameFramework_DataBufferData$ReadByte() {
        return 0;
    },
    ReadSByte : function GameFramework_DataBufferData$ReadSByte() {
        var aSByte = (this.ReadByte());
        return aSByte;
    },
    ReadInt : function GameFramework_DataBufferData$ReadInt() {
        var a = this.ReadByte();
        var b = this.ReadByte();
        var c = this.ReadByte();
        var d = this.ReadByte();
        return a | (b << 8) | (c << 16) | (d << 24);
    },
    ReadShort : function GameFramework_DataBufferData$ReadShort() {
        var a = this.ReadByte();
        var b = this.ReadByte();
        return ((a | (b << 8)) | 0);
    },
    ReadFloat : function GameFramework_DataBufferData$ReadFloat() {
        return 0;
    },
    ReadDouble : function GameFramework_DataBufferData$ReadDouble() {
        return 0;
    },
    ReadBoolean : function GameFramework_DataBufferData$ReadBoolean() {
        return this.ReadByte() != 0;
    },
    ReadBytes : function GameFramework_DataBufferData$ReadBytes(theBytes, theOffset, theSize) {
        for(var i = 0; i < theSize; i++) {
            theBytes[i + theOffset] = this.ReadByte();
        }
    },
    ReadAsciiBytes : function GameFramework_DataBufferData$ReadAsciiBytes(theCount) {
        var aString = '';
        for(var i = 0; i < theCount; i++) {
            aString += GameFramework.Utils.StringFromCharCode(this.ReadByte());
        }
        return aString;
    },
    ReadUTF8Bytes : function GameFramework_DataBufferData$ReadUTF8Bytes(theCount) {
        return GameFramework.Utils.StringToUTF8(this.ReadAsciiBytes(theCount));
    },
    ToUTF8String : function GameFramework_DataBufferData$ToUTF8String() {
        return '';
    },
    ReadBSON : function GameFramework_DataBufferData$ReadBSON(theObject) {
    },
    WriteByte : function GameFramework_DataBufferData$WriteByte(theByte) {
    },
    WriteASCIIString : function GameFramework_DataBufferData$WriteASCIIString(theString) {
        for(var i = 0; i < theString.length; i++) {
            this.WriteByte((GameFramework.Utils.GetCharCodeAt(theString, i) | 0));
        }
    },
    WriteInt : function GameFramework_DataBufferData$WriteInt(theInt) {
        this.WriteByte(((theInt & 0xff) | 0));
        this.WriteByte((((theInt >> 8) & 0xff) | 0));
        this.WriteByte((((theInt >> 16) & 0xff) | 0));
        this.WriteByte((((theInt >> 24) & 0xff) | 0));
    },
    WriteShort : function GameFramework_DataBufferData$WriteShort(theShort) {
        this.WriteByte(((theShort & 0xff) | 0));
        this.WriteByte((((theShort >> 8) & 0xff) | 0));
    },
    WriteFloat : function GameFramework_DataBufferData$WriteFloat(theFloat) {
    },
    WriteBytes : function GameFramework_DataBufferData$WriteBytes(theBytes, theOffset, theSize) {
        for(var i = 0; i < theSize; i++) {
            this.WriteByte(theBytes[i + theOffset]);
        }
    },
    WriteBSON : function GameFramework_DataBufferData$WriteBSON(theObject) {
    }
}
GameFramework.DataBufferData.staticInit = function GameFramework_DataBufferData$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.DataBufferData.registerClass('GameFramework.DataBufferData', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.DataBufferData.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\DataBufferData.cs
//LineMap:2=3 5=27 10=7 28=23 30=23 34=35 110=113 
//Start:IAppState

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\IAppState.cs
//LineMap:2=3 
//Start:IAppStateMachine

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\IAppStateMachine.cs
//LineMap:2=3 
//Start:IExplicitDisposable

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\IExplicitDisposable.cs
//LineMap:2=8 
//Start:Insets
/**
 * @constructor
 */
GameFramework.Insets = function GameFramework_Insets(theLeft, theTop, theRight, theBottom) {
    if(theLeft === undefined) {
        theLeft = 0.0;
    }
    if(theTop === undefined) {
        theTop = 0.0;
    }
    if(theRight === undefined) {
        theRight = 0.0;
    }
    if(theBottom === undefined) {
        theBottom = 0.0;
    }
    this.mLeft = theLeft;
    this.mTop = theTop;
    this.mRight = theRight;
    this.mBottom = theBottom;
}
GameFramework.Insets.prototype = {
    mLeft : 0,
    mTop : 0,
    mRight : 0,
    mBottom : 0,
    ToRect : function GameFramework_Insets$ToRect() {
        return new GameFramework.TRect(this.mLeft, this.mBottom, this.mRight - this.mLeft, this.mTop - this.mBottom);
    }
}
GameFramework.Insets.staticInit = function GameFramework_Insets$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.Insets.registerClass('GameFramework.Insets', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.Insets.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\Insets.cs
//LineMap:2=8 5=16 7=15 8=15 9=15 10=15 11=17 23=23 
//Start:KeyCode
GameFramework.KeyCode = {};
GameFramework.KeyCode.staticInit = function GameFramework_KeyCode$staticInit() {
    GameFramework.KeyCode.Unknown = 0x0;
    GameFramework.KeyCode.LButton = 0x1;
    GameFramework.KeyCode.RButton = 0x2;
    GameFramework.KeyCode.Cancel = 0x3;
    GameFramework.KeyCode.MButton = 0x4;
    GameFramework.KeyCode.Back = 0x8;
    GameFramework.KeyCode.Tab = 0x9;
    GameFramework.KeyCode.Clear = 0xc;
    GameFramework.KeyCode.Return = 0xd;
    GameFramework.KeyCode.Shift = 0x10;
    GameFramework.KeyCode.Control = 0x11;
    GameFramework.KeyCode.Menu = 0x12;
    GameFramework.KeyCode.Pause = 0x13;
    GameFramework.KeyCode.Capital = 0x14;
    GameFramework.KeyCode.Kana = 0x15;
    GameFramework.KeyCode.Hangeul = 0x15;
    GameFramework.KeyCode.Hangul = 0x15;
    GameFramework.KeyCode.Junja = 0x17;
    GameFramework.KeyCode.Final = 0x18;
    GameFramework.KeyCode.Hanja = 0x19;
    GameFramework.KeyCode.Kanji = 0x19;
    GameFramework.KeyCode.Escape = 0x1b;
    GameFramework.KeyCode.Convert = 0x1c;
    GameFramework.KeyCode.NonConvert = 0x1d;
    GameFramework.KeyCode.Accept = 0x1e;
    GameFramework.KeyCode.ModeChange = 0x1f;
    GameFramework.KeyCode.Space = 0x20;
    GameFramework.KeyCode.Prior = 0x21;
    GameFramework.KeyCode.Next = 0x22;
    GameFramework.KeyCode.End = 0x23;
    GameFramework.KeyCode.Home = 0x24;
    GameFramework.KeyCode.Left = 0x25;
    GameFramework.KeyCode.Up = 0x26;
    GameFramework.KeyCode.Right = 0x27;
    GameFramework.KeyCode.Down = 0x28;
    GameFramework.KeyCode.Select = 0x29;
    GameFramework.KeyCode.Print = 0x2a;
    GameFramework.KeyCode.Execute = 0x2b;
    GameFramework.KeyCode.Snapshot = 0x2c;
    GameFramework.KeyCode.Insert = 0x2d;
    GameFramework.KeyCode.Delete = 0x2e;
    GameFramework.KeyCode.Help = 0x2f;
    GameFramework.KeyCode.Asciibegin = 0x30;
    GameFramework.KeyCode.Asciiend = 0x5a;
    GameFramework.KeyCode.Lwin = 0x5b;
    GameFramework.KeyCode.Rwin = 0x5c;
    GameFramework.KeyCode.Apps = 0x5d;
    GameFramework.KeyCode.Numpad0 = 0x60;
    GameFramework.KeyCode.Numpad1 = 0x61;
    GameFramework.KeyCode.Numpad2 = 0x62;
    GameFramework.KeyCode.Numpad3 = 0x63;
    GameFramework.KeyCode.Numpad4 = 0x64;
    GameFramework.KeyCode.Numpad5 = 0x65;
    GameFramework.KeyCode.Numpad6 = 0x66;
    GameFramework.KeyCode.Numpad7 = 0x67;
    GameFramework.KeyCode.Numpad8 = 0x68;
    GameFramework.KeyCode.Numpad9 = 0x69;
    GameFramework.KeyCode.Multiply = 0x6a;
    GameFramework.KeyCode.Add = 0x6b;
    GameFramework.KeyCode.Separator = 0x6c;
    GameFramework.KeyCode.Subtract = 0x6d;
    GameFramework.KeyCode.Decimal = 0x6e;
    GameFramework.KeyCode.Divide = 0x6f;
    GameFramework.KeyCode.F1 = 0x70;
    GameFramework.KeyCode.F2 = 0x71;
    GameFramework.KeyCode.F3 = 0x72;
    GameFramework.KeyCode.F4 = 0x73;
    GameFramework.KeyCode.F5 = 0x74;
    GameFramework.KeyCode.F6 = 0x75;
    GameFramework.KeyCode.F7 = 0x76;
    GameFramework.KeyCode.F8 = 0x77;
    GameFramework.KeyCode.F9 = 0x78;
    GameFramework.KeyCode.F10 = 0x79;
    GameFramework.KeyCode.F11 = 0x7a;
    GameFramework.KeyCode.F12 = 0x7b;
    GameFramework.KeyCode.F13 = 0x7c;
    GameFramework.KeyCode.F14 = 0x7d;
    GameFramework.KeyCode.F15 = 0x7e;
    GameFramework.KeyCode.F16 = 0x7f;
    GameFramework.KeyCode.F17 = 0x80;
    GameFramework.KeyCode.F18 = 0x81;
    GameFramework.KeyCode.F19 = 0x82;
    GameFramework.KeyCode.F20 = 0x83;
    GameFramework.KeyCode.F21 = 0x84;
    GameFramework.KeyCode.F22 = 0x85;
    GameFramework.KeyCode.F23 = 0x86;
    GameFramework.KeyCode.F24 = 0x87;
    GameFramework.KeyCode.Numlock = 0x90;
    GameFramework.KeyCode.Scroll = 0x91;
    GameFramework.KeyCode.Asciibegin2 = 0xb3;
    GameFramework.KeyCode.Asciiend2 = 0xe0;
    GameFramework.KeyCode.Command = 0xf0;
    GameFramework.KeyCode.COUNT = 0xff;
}
JS_AddInitFunc(function() {
    GameFramework.KeyCode.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\KeyCode.cs
//LineMap:2=8 5=10 
//Start:NoRename
/**
 * @constructor
 */
GameFramework.NoRename = function GameFramework_NoRename() {
    GameFramework.NoRename.initializeBase(this);
}
GameFramework.NoRename.prototype = {

}
GameFramework.NoRename.staticInit = function GameFramework_NoRename$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.NoRename.registerClass('GameFramework.NoRename', System.Attribute);
});
JS_AddStaticInitFunc(function() {
    GameFramework.NoRename.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\NoRename.cs
//LineMap:2=8 
//Start:TArray
/**
 * @constructor
 */
GameFramework.TArray = function GameFramework_TArray() {
    this.mCSArrayList = [];
}
GameFramework.TArray.prototype = {
    mCSArrayList : null,
    get_Item : function GameFramework_TArray$get_Item(index) {
        return this.mCSArrayList[index];
    },
    set_Item : function GameFramework_TArray$set_Item(index, value) {
        while(index > this.mCSArrayList.length) {
            this.mCSArrayList.push(null);
        }
        if(index == this.mCSArrayList.length) {
            this.mCSArrayList.push(value);
        } else {
            this.mCSArrayList[index] = value;
        }
    },
    get_Count : function GameFramework_TArray$get_Count() {
        return this.mCSArrayList.length;
    },
    set_Count : function GameFramework_TArray$set_Count(value) {
        if(value < this.mCSArrayList.length) {
            this.mCSArrayList.removeRange(value, this.mCSArrayList.length - value);
        } else {
            while(value > this.mCSArrayList.length) {
                this.mCSArrayList.push(null);
            }
        }
    },
    Add : function GameFramework_TArray$Add(item) {
        this.mCSArrayList.push(item);
    },
    Pop : function GameFramework_TArray$Pop() {
        var aThing = this[this.mCSArrayList.length - 1];
        this.mCSArrayList.removeAt(this.mCSArrayList.length - 1);
        return aThing;
    },
    Splice : function GameFramework_TArray$Splice(startIndex, deleteCount, $insert) {
        this.mCSArrayList.removeRange(startIndex, deleteCount);
        for(var i = 0; i < (arguments.length - 2); i++) {
            this.mCSArrayList.insert(startIndex + i, arguments[(i) + 2]);
        }
    },
    Compare : function GameFramework_TArray$Compare(x, y) {
        return Utils.CompareTo(x.toString(), y.toString());
    },
    Sort : function GameFramework_TArray$Sort() {
        //JS
        mCSArrayList.Sort(Compare);
        //-JS
    },
    RemoveAt : function GameFramework_TArray$RemoveAt(theIdx) {
        this.mCSArrayList.removeAt(theIdx);
    },
    RemoveRange : function GameFramework_TArray$RemoveRange(theIdx, theCount) {
        this.mCSArrayList.removeRange(theIdx, theCount);
    },
    Clear : function GameFramework_TArray$Clear() {
        this.mCSArrayList.clear();
    },
    Insert : function GameFramework_TArray$Insert(theIdx, theValue) {
        this.mCSArrayList.insert(theIdx, theValue);
    },
    IndexOf : function GameFramework_TArray$IndexOf(value) {
        return this.mCSArrayList.indexOf(value);
    },
    GetObjectArray : function GameFramework_TArray$GetObjectArray() {
        return null;
    },
    GetEnumerator : function GameFramework_TArray$GetEnumerator() {
        return this.mCSArrayList.GetEnumerator();
    }
}
GameFramework.TArray.staticInit = function GameFramework_TArray$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TArray.registerClass('GameFramework.TArray', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TArray.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\TArray.cs
//LineMap:1=3 2=5 5=16 7=17 13=20 18=20 20=25 34=38 36=39 39=41 51=56 56=72 58=76 63=82 75=97 102=126 
//Start:TDictionary
/**
 * @constructor
 */
GameFramework.TDictionary = function GameFramework_TDictionary() {
    this.mHashtable = {};
}
GameFramework.TDictionary.prototype = {
    mHashtable : null,
    get_Item : function GameFramework_TDictionary$get_Item(key) {
        return this.mHashtable[key];
    },
    set_Item : function GameFramework_TDictionary$set_Item(key, value) {
        this.mHashtable[key] = value;
    },
    InternalGet : function GameFramework_TDictionary$InternalGet(key) {
        return this.mHashtable[key];
    },
    Remove : function GameFramework_TDictionary$Remove(theKey) {
        delete this.mHashtable[theKey];
    },
    ContainsKey : function GameFramework_TDictionary$ContainsKey(theKey) {
        return this.mHashtable.hasOwnProperty(theKey);
    },
    get_Keys : function GameFramework_TDictionary$get_Keys() {
        return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), true);
    },
    get_Values : function GameFramework_TDictionary$get_Values() {
        return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), false);
    },
    GetEnumerator : function GameFramework_TDictionary$GetEnumerator() {
        return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), false);
    }
}
GameFramework.TDictionary.staticInit = function GameFramework_TDictionary$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TDictionary.registerClass('GameFramework.TDictionary', null, GameFramework.misc.ISimpleDictionary);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TDictionary.staticInit();
});
/**
 * @constructor
 */
GameFramework.TDictionaryEnumerator = function GameFramework_TDictionaryEnumerator(theEnumerator, keys) {
    this.mEnumerator = theEnumerator;
    this.mKeys = keys;
}
GameFramework.TDictionaryEnumerator.prototype = {
    mEnumerator : null,
    mKeys : false,
    get_Current : function GameFramework_TDictionaryEnumerator$get_Current() {
        if(this.mKeys) {
            return (this.mEnumerator.get_Current()).get_Key();
        } else {
            return (this.mEnumerator.get_Current()).get_Value();
        }
    },
    MoveNext : function GameFramework_TDictionaryEnumerator$MoveNext() {
        return this.mEnumerator.MoveNext();
    },
    Reset : function GameFramework_TDictionaryEnumerator$Reset() {
        this.mEnumerator.Reset();
    },
    GetEnumerator : function GameFramework_TDictionaryEnumerator$GetEnumerator() {
        return this;
    }
}
GameFramework.TDictionaryEnumerator.staticInit = function GameFramework_TDictionaryEnumerator$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TDictionaryEnumerator.registerClass('GameFramework.TDictionaryEnumerator', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TDictionaryEnumerator.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\TDictionary.cs
//LineMap:1=3 2=5 7=11 13=13 15=17 18=13 20=22 41=45 44=49 46=53 49=57 60=63 63=72 65=73 71=69 73=77 75=81 81=88 
//Start:TIntDictionary
/**
 * @constructor
 */
GameFramework.TIntDictionary = function GameFramework_TIntDictionary() {
    this.mHashtable = {};
}
GameFramework.TIntDictionary.prototype = {
    mHashtable : null,
    get_Item : function GameFramework_TIntDictionary$get_Item(key) {
        return this.mHashtable[key];
    },
    set_Item : function GameFramework_TIntDictionary$set_Item(key, value) {
        this.mHashtable[key] = value;
    },
    InternalGet : function GameFramework_TIntDictionary$InternalGet(key) {
        return this.mHashtable[(key | 0)];
    },
    Remove : function GameFramework_TIntDictionary$Remove(theKey) {
        delete this.mHashtable[theKey];
    },
    containsKey : function GameFramework_TIntDictionary$containsKey(theKey) {
        return this.mHashtable.hasOwnProperty(theKey);
    },
    get_Keys : function GameFramework_TIntDictionary$get_Keys() {
        return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), true);
    },
    get_Values : function GameFramework_TIntDictionary$get_Values() {
        return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), false);
    },
    GetEnumerator : function GameFramework_TIntDictionary$GetEnumerator() {
        return new GameFramework.TDictionaryEnumerator(this.mHashtable.GetEnumerator(), false);
    }
}
GameFramework.TIntDictionary.staticInit = function GameFramework_TIntDictionary$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TIntDictionary.registerClass('GameFramework.TIntDictionary', null, GameFramework.misc.ISimpleDictionary);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TIntDictionary.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\TIntDictionary.cs
//LineMap:1=3 2=5 7=11 13=13 15=17 18=13 20=22 41=45 44=49 46=53 49=57 
//Start:TIntMap
/**
 * @constructor
 */
GameFramework.TMapKeyEnumerator = function GameFramework_TMapKeyEnumerator(theEnumerator) {
    this.mEnumerator = theEnumerator;
}
GameFramework.TMapKeyEnumerator.prototype = {
    mEnumerator : null,
    Dispose : function GameFramework_TMapKeyEnumerator$Dispose() {
    },
    get_Current : function GameFramework_TMapKeyEnumerator$get_Current() {
        return (this.mEnumerator.get_Current()).get_Key();
    },
    MoveNext : function GameFramework_TMapKeyEnumerator$MoveNext() {
        return this.mEnumerator.MoveNext();
    },
    Reset : function GameFramework_TMapKeyEnumerator$Reset() {
        this.mEnumerator.Reset();
    },
    GetEnumerator : function GameFramework_TMapKeyEnumerator$GetEnumerator() {
        return this;
    }
}
GameFramework.TMapKeyEnumerator.staticInit = function GameFramework_TMapKeyEnumerator$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TMapKeyEnumerator.registerClass('GameFramework.TMapKeyEnumerator', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TMapKeyEnumerator.staticInit();
});
/**
 * @constructor
 */
GameFramework.TMapValueEnumerator = function GameFramework_TMapValueEnumerator(theEnumerator) {
    this.mEnumerator = theEnumerator;
}
GameFramework.TMapValueEnumerator.prototype = {
    mEnumerator : null,
    Dispose : function GameFramework_TMapValueEnumerator$Dispose() {
    },
    get_Current : function GameFramework_TMapValueEnumerator$get_Current() {
        return (this.mEnumerator.get_Current()).get_Value();
    },
    get_CurrentTyped : function GameFramework_TMapValueEnumerator$get_CurrentTyped() {
        return (this.mEnumerator.get_Current()).get_Value();
    },
    MoveNext : function GameFramework_TMapValueEnumerator$MoveNext() {
        return this.mEnumerator.MoveNext();
    },
    Reset : function GameFramework_TMapValueEnumerator$Reset() {
        this.mEnumerator.Reset();
    },
    GetEnumerator : function GameFramework_TMapValueEnumerator$GetEnumerator() {
        return this;
    }
}
GameFramework.TMapValueEnumerator.staticInit = function GameFramework_TMapValueEnumerator$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TMapValueEnumerator.registerClass('GameFramework.TMapValueEnumerator', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TMapValueEnumerator.staticInit();
});
/**
 * @constructor
 */
GameFramework.TIntMap = function GameFramework_TIntMap() {
    this.mHashtable = new System.Collections.Generic.Dictionary();
}
GameFramework.TIntMap.prototype = {
    mHashtable : null,
    get_Item : function GameFramework_TIntMap$get_Item(key) {
        var aValue = 0;
        this.mHashtable.TryGetValue(key, aValue);
        return aValue;
    },
    set_Item : function GameFramework_TIntMap$set_Item(key, value) {
        this.mHashtable[key] = value;
    },
    InternalGet : function GameFramework_TIntMap$InternalGet(key) {
        return this.mHashtable[(key | 0)];
    },
    Remove : function GameFramework_TIntMap$Remove(theKey) {
        this.mHashtable.Remove(theKey);
    },
    ContainsKey : function GameFramework_TIntMap$ContainsKey(theKey) {
        return this.mHashtable.ContainsKey(theKey);
    },
    get_Keys : function GameFramework_TIntMap$get_Keys() {
        return new GameFramework.TMapKeyEnumerator(this.mHashtable.GetEnumerator());
    },
    get_Values : function GameFramework_TIntMap$get_Values() {
        return new GameFramework.TMapValueEnumerator(this.mHashtable.GetEnumerator());
    },
    GetEnumerator : function GameFramework_TIntMap$GetEnumerator() {
        return new GameFramework.TMapValueEnumerator(this.mHashtable.GetEnumerator());
    }
}
GameFramework.TIntMap.staticInit = function GameFramework_TIntMap$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TIntMap.registerClass('GameFramework.TIntMap', null, GameFramework.misc.ISimpleDictionary);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TIntMap.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\TIntMap.cs
//LineMap:1=4 2=6 5=20 7=21 13=24 19=32 22=46 43=62 46=70 48=71 54=74 60=82 63=87 65=91 68=96 89=113 94=115 100=117 102=121 103=124 104=126 107=117 109=131 130=154 133=158 135=162 138=166 
//Start:TIntRect
/**
 * @constructor
 */
GameFramework.TIntRect = function GameFramework_TIntRect(theX, theY, theWidth, theHeight) {
    this.mX = theX;
    this.mY = theY;
    this.mWidth = theWidth;
    this.mHeight = theHeight;
}
GameFramework.TIntRect.prototype = {
    mX : 0,
    mY : 0,
    mWidth : 0,
    mHeight : 0,
    Intersects : function GameFramework_TIntRect$Intersects(theTRect) {
        return !((theTRect.mX + theTRect.mWidth <= this.mX) || (theTRect.mY + theTRect.mHeight <= this.mY) || (theTRect.mX >= this.mX + this.mWidth) || (theTRect.mY >= this.mY + this.mHeight));
    },
    Intersection : function GameFramework_TIntRect$Intersection(theTRect) {
        var x1 = ((Math.max(this.mX, theTRect.mX)) | 0);
        var x2 = ((Math.min(this.mX + this.mWidth, theTRect.mX + theTRect.mWidth)) | 0);
        var y1 = ((Math.max(this.mY, theTRect.mY)) | 0);
        var y2 = ((Math.min(this.mY + this.mHeight, theTRect.mY + theTRect.mHeight)) | 0);
        if(((x2 - x1) < 0) || ((y2 - y1) < 0)) {
            return new GameFramework.TIntRect(0, 0, 0, 0);
        } else {
            return new GameFramework.TIntRect(x1, y1, x2 - x1, y2 - y1);
        }
    },
    Union : function GameFramework_TIntRect$Union(theTRect) {
        var x1 = ((Math.min(this.mX, theTRect.mX)) | 0);
        var x2 = ((Math.max(this.mX + this.mWidth, theTRect.mX + theTRect.mWidth)) | 0);
        var y1 = ((Math.min(this.mY, theTRect.mY)) | 0);
        var y2 = ((Math.max(this.mY + this.mHeight, theTRect.mY + theTRect.mHeight)) | 0);
        return new GameFramework.TIntRect(x1, y1, x2 - x1, y2 - y1);
    },
    Contains : function GameFramework_TIntRect$Contains(theX, theY) {
        return ((theX >= this.mX) && (theX < this.mX + this.mWidth) && (theY >= this.mY) && (theY < this.mY + this.mHeight));
    },
    Offset : function GameFramework_TIntRect$Offset(theX, theY) {
        this.mX += theX;
        this.mY += theY;
    },
    Inflate : function GameFramework_TIntRect$Inflate(theX, theY) {
        this.mX -= theX;
        this.mWidth += theX * 2;
        this.mY -= theY;
        this.mHeight += theY * 2;
        return this;
    },
    Scale : function GameFramework_TIntRect$Scale(theScaleX, theScaleY) {
        this.mX = ((this.mX * theScaleX) | 0);
        this.mY = ((this.mY * theScaleY) | 0);
        this.mWidth = ((this.mWidth * theScaleX) | 0);
        this.mHeight = ((this.mHeight * theScaleY) | 0);
    },
    ScaleFrom : function GameFramework_TIntRect$ScaleFrom(theScaleX, theScaleY, theCenterX, theCenterY) {
        this.Offset(-theCenterX, -theCenterY);
        this.Scale(theScaleX, theScaleY);
        this.Offset(theCenterX, theCenterY);
    }
}
GameFramework.TIntRect.staticInit = function GameFramework_TIntRect$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TIntRect.registerClass('GameFramework.TIntRect', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TIntRect.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\TIntRect.cs
//LineMap:2=3 5=13 7=14 19=20 24=28 50=55 62=68 
//Start:TIntVector
/**
 * @constructor
 */
GameFramework.TIntVector = function GameFramework_TIntVector() {
    this.mCSList = [];
}
GameFramework.TIntVector.prototype = {
    mCSList : null,
    isFixed : false,
    get_Count : function GameFramework_TIntVector$get_Count() {
        return this.mCSList.get_Count();
    },
    set_Count : function GameFramework_TIntVector$set_Count(value) {
        if(value < this.mCSList.get_Count()) {
            this.mCSList.RemoveRange(value, this.mCSList.get_Count() - value);
        }
    },
    get_Item : function GameFramework_TIntVector$get_Item(index) {
        return (this.mCSList[index] | 0);
    },
    set_Item : function GameFramework_TIntVector$set_Item(index, value) {
        while(index > this.mCSList.get_Count()) {
            this.mCSList.Add(0);
        }
        if(index == this.mCSList.get_Count()) {
            this.mCSList.Add(value);
        } else {
            this.mCSList[index] = value;
        }
    },
    Add : function GameFramework_TIntVector$Add(arg) {
        this.mCSList.Add(arg);
    },
    Pop : function GameFramework_TIntVector$Pop() {
        var aThing = this[this.mCSList.get_Count() - 1];
        this.mCSList.RemoveAt(this.mCSList.get_Count() - 1);
        return aThing;
    },
    Splice : function GameFramework_TIntVector$Splice(startIndex, deleteCount, $insert) {
        this.mCSList.RemoveRange(startIndex, deleteCount);
        for(var i = 0; i < (arguments.length - 2); i++) {
            this.mCSList.Insert(startIndex + i, (arguments[(i) + 2] | 0));
        }
    },
    RemoveAt : function GameFramework_TIntVector$RemoveAt(theIdx) {
        this.mCSList.RemoveAt(theIdx);
    },
    RemoveRange : function GameFramework_TIntVector$RemoveRange(theIdx, theCount) {
        this.mCSList.RemoveRange(theIdx, theCount);
    },
    Insert : function GameFramework_TIntVector$Insert(theIdx, theValue) {
        this.mCSList.Insert(theIdx, theValue);
    },
    IndexOf : function GameFramework_TIntVector$IndexOf(value) {
        return this.mCSList.IndexOf(value);
    },
    GetEnumerator : function GameFramework_TIntVector$GetEnumerator() {
        return this.mCSList.GetEnumerator();
    }
}
GameFramework.TIntVector.staticInit = function GameFramework_TIntVector$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TIntVector.registerClass('GameFramework.TIntVector', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TIntVector.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\TIntVector.cs
//LineMap:1=3 2=5 5=19 7=20 12=16 14=23 19=27 21=28 31=33 33=38 44=54 47=68 49=75 54=97 56=101 61=107 
//Start:TMap
/**
 * @constructor
 */
GameFramework.TMapEnumerator = function GameFramework_TMapEnumerator(theEnumerator, keys) {
    this.mEnumerator = theEnumerator;
    this.mKeys = keys;
}
GameFramework.TMapEnumerator.prototype = {
    mEnumerator : null,
    mKeys : false,
    get_Current : function GameFramework_TMapEnumerator$get_Current() {
        if(this.mKeys) {
            return ((this.mEnumerator.get_Current())).get_Key();
        } else {
            return ((this.mEnumerator.get_Current())).get_Value();
        }
    },
    MoveNext : function GameFramework_TMapEnumerator$MoveNext() {
        return this.mEnumerator.MoveNext();
    },
    Reset : function GameFramework_TMapEnumerator$Reset() {
    },
    GetEnumerator : function GameFramework_TMapEnumerator$GetEnumerator() {
        return this;
    }
}
GameFramework.TMapEnumerator.staticInit = function GameFramework_TMapEnumerator$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TMapEnumerator.registerClass('GameFramework.TMapEnumerator', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TMapEnumerator.staticInit();
});
/**
 * @constructor
 */
GameFramework.TMap = function GameFramework_TMap() {
    this.mHashtable = new System.Collections.Generic.Dictionary();
}
GameFramework.TMap.prototype = {
    mHashtable : null,
    get_Item : function GameFramework_TMap$get_Item(key) {
        var aValue = 0;
        this.mHashtable.TryGetValue(key, aValue);
        return aValue;
    },
    set_Item : function GameFramework_TMap$set_Item(key, value) {
        this.mHashtable[key] = value;
    },
    InternalGet : function GameFramework_TMap$InternalGet(key) {
        return this.mHashtable[key];
    },
    Remove : function GameFramework_TMap$Remove(theKey) {
        this.mHashtable.Remove(theKey);
    },
    ContainsKey : function GameFramework_TMap$ContainsKey(theKey) {
        return this.mHashtable.ContainsKey(theKey);
    },
    get_Keys : function GameFramework_TMap$get_Keys() {
        return new GameFramework.TMapEnumerator(this.mHashtable.GetEnumerator(), true);
    },
    get_Values : function GameFramework_TMap$get_Values() {
        return new GameFramework.TMapEnumerator(this.mHashtable.GetEnumerator(), false);
    },
    GetEnumerator : function GameFramework_TMap$GetEnumerator() {
        return new GameFramework.TMapEnumerator(this.mHashtable.GetEnumerator(), false);
    }
}
GameFramework.TMap.staticInit = function GameFramework_TMap$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TMap.registerClass('GameFramework.TMap', null, GameFramework.misc.ISimpleDictionary);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TMap.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\TMap.cs
//LineMap:1=3 2=5 5=22 7=23 13=19 15=27 17=31 23=38 32=48 43=54 48=56 54=58 56=62 57=65 58=67 61=58 63=72 84=95 87=99 89=103 92=107 
//Start:TRect
/**
 * @constructor
 */
GameFramework.TRect = function GameFramework_TRect(theX, theY, theWidth, theHeight) {
    this.mX = theX;
    this.mY = theY;
    this.mWidth = theWidth;
    this.mHeight = theHeight;
}
GameFramework.TRect.prototype = {
    mX : 0,
    mY : 0,
    mWidth : 0,
    mHeight : 0,
    Intersects : function GameFramework_TRect$Intersects(theTRect) {
        return !((theTRect.mX + theTRect.mWidth <= this.mX) || (theTRect.mY + theTRect.mHeight <= this.mY) || (theTRect.mX >= this.mX + this.mWidth) || (theTRect.mY >= this.mY + this.mHeight));
    },
    Intersection : function GameFramework_TRect$Intersection(theTRect) {
        var x1 = Math.max(this.mX, theTRect.mX);
        var x2 = Math.min(this.mX + this.mWidth, theTRect.mX + theTRect.mWidth);
        var y1 = Math.max(this.mY, theTRect.mY);
        var y2 = Math.min(this.mY + this.mHeight, theTRect.mY + theTRect.mHeight);
        if(((x2 - x1) < 0) || ((y2 - y1) < 0)) {
            return new GameFramework.TRect(0, 0, 0, 0);
        } else {
            return new GameFramework.TRect(x1, y1, x2 - x1, y2 - y1);
        }
    },
    Union : function GameFramework_TRect$Union(theTRect) {
        var x1 = Math.min(this.mX, theTRect.mX);
        var x2 = Math.max(this.mX + this.mWidth, theTRect.mX + theTRect.mWidth);
        var y1 = Math.min(this.mY, theTRect.mY);
        var y2 = Math.max(this.mY + this.mHeight, theTRect.mY + theTRect.mHeight);
        return new GameFramework.TRect(x1, y1, x2 - x1, y2 - y1);
    },
    Contains : function GameFramework_TRect$Contains(theX, theY) {
        return ((theX >= this.mX) && (theX < this.mX + this.mWidth) && (theY >= this.mY) && (theY < this.mY + this.mHeight));
    },
    Offset : function GameFramework_TRect$Offset(theX, theY) {
        this.mX += theX;
        this.mY += theY;
    },
    Inflate : function GameFramework_TRect$Inflate(theX, theY) {
        this.mX -= theX;
        this.mWidth += theX * 2;
        this.mY -= theY;
        this.mHeight += theY * 2;
        return this;
    },
    Scale : function GameFramework_TRect$Scale(theScaleX, theScaleY) {
        this.mX = (this.mX * theScaleX);
        this.mY = (this.mY * theScaleY);
        this.mWidth = (this.mWidth * theScaleX);
        this.mHeight = (this.mHeight * theScaleY);
    },
    ScaleFrom : function GameFramework_TRect$ScaleFrom(theScaleX, theScaleY, theCenterX, theCenterY) {
        this.Offset(-theCenterX, -theCenterY);
        this.Scale(theScaleX, theScaleY);
        this.Offset(theCenterX, theCenterY);
    }
}
GameFramework.TRect.staticInit = function GameFramework_TRect$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TRect.registerClass('GameFramework.TRect', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TRect.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\TRect.cs
//LineMap:2=3 5=13 7=14 19=20 24=28 50=55 62=68 
//Start:TVector
/**
 * @constructor
 */
GameFramework.TVector = function GameFramework_TVector($args) {
    this.mCSList = [];

    {
        var $srcArray1 = arguments;
        for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
            var arg = $srcArray1[$enum1];
            this.mCSList.Add(arg);
        }
    }
}
GameFramework.TVector.CreateSized = function GameFramework_TVector$CreateSized(theLength, isFixed) {
    var aVector = [];
    aVector.mCSList = [(theLength | 0)];
    aVector.isFixed = isFixed;
    for(var i = 0; i < theLength; i++) {
        aVector.mCSList.Add(0);
    }
    return aVector;
}
GameFramework.TVector.prototype = {
    mCSList : null,
    isFixed : false,
    get_Count : function GameFramework_TVector$get_Count() {
        return this.mCSList.get_Count();
    },
    set_Count : function GameFramework_TVector$set_Count(value) {
        if(value < this.mCSList.get_Count()) {
            this.mCSList.RemoveRange(value, this.mCSList.get_Count() - value);
        } else {
            while(value > this.mCSList.get_Count()) {
                this.mCSList.Add(0);
            }
        }
    },
    get_Item : function GameFramework_TVector$get_Item(index) {
        return this.mCSList[index];
    },
    set_Item : function GameFramework_TVector$set_Item(index, value) {
        if(index == this.mCSList.get_Count()) {
            this.mCSList.Add(value);
        } else {
            this.mCSList[index] = value;
        }
    },
    Add : function GameFramework_TVector$Add(arg) {
        this.mCSList.Add(arg);
    },
    Pop : function GameFramework_TVector$Pop() {
        var aThing = this[this.mCSList.get_Count() - 1];
        this.mCSList.RemoveAt(this.mCSList.get_Count() - 1);
        return aThing;
    },
    Slice : function GameFramework_TVector$Slice(startIndex, endIndex) {
        var aNewVector = [];
        if(aNewVector.mCSList.get_Count() == 0) {
            var $enum2 = ss.IEnumerator.getEnumerator(this.mCSList);
            while($enum2.moveNext()) {
                var aVal = $enum2.get_current();
                aNewVector.mCSList.Add(aVal);
            }
        }
        return aNewVector;
    },
    Duplicate : function GameFramework_TVector$Duplicate() {
        var aNewVector = [];

        {
            var $enum3 = ss.IEnumerator.getEnumerator(this.mCSList);
            while($enum3.moveNext()) {
                var aValue = $enum3.get_current();
                aNewVector.mCSList.Add(aValue);
            }
        }
        return aNewVector;
    },
    Splice : function GameFramework_TVector$Splice(startIndex, deleteCount) {
        this.mCSList.RemoveRange(startIndex, deleteCount);
    },
    Splice1 : function GameFramework_TVector$Splice1(startIndex, deleteCount, insert) {
        this.mCSList.RemoveRange(startIndex, deleteCount);
        this.mCSList.Insert(startIndex, insert);
    },
    RemoveAt : function GameFramework_TVector$RemoveAt(theIdx) {
        this.mCSList.RemoveAt(theIdx);
    },
    RemoveRange : function GameFramework_TVector$RemoveRange(theIdx, theCount) {
        this.mCSList.RemoveRange(theIdx, theCount);
    },
    Clear : function GameFramework_TVector$Clear() {
        this.mCSList.Clear();
    },
    Insert : function GameFramework_TVector$Insert(theIdx, theValue) {
        this.mCSList.Insert(theIdx, theValue);
    },
    IndexOf : function GameFramework_TVector$IndexOf(value) {
        return this.mCSList.IndexOf(value);
    },
    Sort : function GameFramework_TVector$Sort(theSortCallback) {
        if(theSortCallback === undefined) {
            theSortCallback = null;
        }
        if(theSortCallback == null) {
            this.mCSList.Sort();
        } else {
            this.mCSList.Sort$2(theSortCallback);
        }
    }
}
GameFramework.TVector.staticInit = function GameFramework_TVector$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.TVector.registerClass('GameFramework.TVector', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.TVector.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\TVector.cs
//LineMap:1=3 2=5 5=26 7=27 10=28 14=29 18=32 30=16 32=42 37=46 39=47 42=49 52=54 54=59 61=80 63=87 68=97 76=108 79=109 83=110 86=111 92=118 94=118 98=119 101=120 142=159 143=161 
//Start:Utils
/**
 * @constructor
 */
GameFramework.Utils = function GameFramework_Utils() {
}
GameFramework.Utils.ToInt = function GameFramework_Utils$ToInt(theString) {
    //JS
    return (theString | 0);
    //-JS
}
GameFramework.Utils.ToDouble = function GameFramework_Utils$ToDouble(theString) {
    //JS
    return Number(theString);
    //-JS
}
GameFramework.Utils.ToFloat = function GameFramework_Utils$ToFloat(theObject) {
    //JS
    return Number(theObject);
    //-JS
}
GameFramework.Utils.ToBool = function GameFramework_Utils$ToBool(theString) {
    return (theString != null) && (theString != '0') && (theString != 'no') && (theString != 'off') && (theString != 'false') && (theString.length > 0);
}
GameFramework.Utils.CharToUpper = function GameFramework_Utils$CharToUpper(theValue) {
    //JS
    return (String.fromCharCode(theValue, 1)).toUpperCase().charCodeAt(0);
    //-JS
}
GameFramework.Utils.CharToLower = function GameFramework_Utils$CharToLower(theValue) {
    //JS
    return (String.fromCharCode(theValue)).toLowerCase().charCodeAt(0);
    //-JS
}
GameFramework.Utils.ToUpper = function GameFramework_Utils$ToUpper(theValue) {
    //JS
    return theValue.toUpperCase();
    //-JS
}
GameFramework.Utils.ToString = function GameFramework_Utils$ToString(theValue) {
    //JS
    return theValue.toString();
    //-JS
}
GameFramework.Utils.CommaSeperate = function GameFramework_Utils$CommaSeperate(value) {
    var delimeter = ',';
    var str = '';
    var front = GameFramework.Utils.ToString(value);
    while(front.length > 3) {
        str = delimeter + front.substr(front.length - 3, 3) + str;
        front = front.substr(0, front.length - 3);
    }
    str = front + str;
    return str;
}
GameFramework.Utils.ReplaceChars = function GameFramework_Utils$ReplaceChars(theOrigString, theFindString, theReplaceString) {
    var aNewString = theOrigString;
    aNewString.replaceAll(theFindString, theReplaceString);
    return aNewString;
}
GameFramework.Utils.adjustBrightness = function GameFramework_Utils$adjustBrightness(rgb, brite) {
    return rgb;
}
GameFramework.Utils.adjustBrightness2 = function GameFramework_Utils$adjustBrightness2(rgb, brite) {
    return rgb;
}
GameFramework.Utils.GetRandFloatU = function GameFramework_Utils$GetRandFloatU() {
    //JS
    return Math.random();
    //-JS
}
GameFramework.Utils.GetRandFloat = function GameFramework_Utils$GetRandFloat() {
    //JS
    return (Math.random() - 0.5) * 2.0;
    //-JS
}
GameFramework.Utils.GetRand = function GameFramework_Utils$GetRand() {
    //JS
    return ((Math.random() * 0x7FFFFFFF) | 0);
    //-JS
}
GameFramework.Utils.GetArrayObject = function GameFramework_Utils$GetArrayObject(theArray) {
    var anArray = [];

    {
        var $srcArray1 = theArray;
        for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
            var anObject = $srcArray1[$enum1];
            anArray.push(anObject);
        }
    }
    return anArray;
}
GameFramework.Utils.IsDictionaryEmpty = function GameFramework_Utils$IsDictionaryEmpty(theDict) {

    {
        for($enum2 in theDict) {
            var aVal = theDict[$enum2];
            return true;
        }
    }
    return false;
}
GameFramework.Utils.IsIntDictionaryEmpty = function GameFramework_Utils$IsIntDictionaryEmpty(theDict) {

    {
        var $enum3 = ss.IEnumerator.getEnumerator(theDict);
        while($enum3.moveNext()) {
            var aVal = $enum3.get_current();
            return true;
        }
    }
    return false;
}
GameFramework.Utils.UTF8ToString = function GameFramework_Utils$UTF8ToString(theString) {
    //JS
    return "";
    //-JS
}
GameFramework.Utils.StringToUTF8 = function GameFramework_Utils$StringToUTF8(theString) {
    //JS
    return "";
    //-JS
}
GameFramework.Utils.ByteArrayToASCII = function GameFramework_Utils$ByteArrayToASCII(theArray, theLength) {
    //JS
    return "";
    //-JS
}
GameFramework.Utils.ByteArrayToUTF8 = function GameFramework_Utils$ByteArrayToUTF8(theArray, theLength) {
    //JS
    return "";
    //-JS
}
GameFramework.Utils.StringFromCharCode = function GameFramework_Utils$StringFromCharCode(theCharCode) {
    return String.fromCharCode(((theCharCode | 0)));
}
GameFramework.Utils.GetCharCode = function GameFramework_Utils$GetCharCode(theChar) {
    //JS
    return theChar;
    //-JS
}
GameFramework.Utils.GetCharCodeAt = function GameFramework_Utils$GetCharCodeAt(theString, theIdx) {
    //JS
    return theString.charCodeAt(theIdx);
    //-JS
}
GameFramework.Utils.GetCharAt = function GameFramework_Utils$GetCharAt(theString, theIdx) {
    //JS
    return theString.charCodeAt(theIdx);
    //-JS
}
GameFramework.Utils.StringReplaceChar = function GameFramework_Utils$StringReplaceChar(theString, theFindChar, theReplaceChar) {
    return theString.replaceAll(String.fromCharCode(theFindChar), String.fromCharCode(theReplaceChar));
}
GameFramework.Utils.IsWhitespace = function GameFramework_Utils$IsWhitespace(theChar) {
    //JS
    return ((theChar == ' ') || (theChar == '\t') || (theChar == '\r') || (theChar == '\n'));
    //-JS
}
GameFramework.Utils.IsDigit = function GameFramework_Utils$IsDigit(theChar) {
    //JS
    return ((theChar >= '0') && (theChar <= '9'));
    //-JS
}
GameFramework.Utils.IsWhitespaceAt = function GameFramework_Utils$IsWhitespaceAt(theString, theIdx) {
    //JS
    var aCharCode = theString.charCodeAt(theIdx);
    return ((aCharCode == 32) || (aCharCode == 9) || (aCharCode == 10) || (aCharCode == 13));
    //-JS
}
GameFramework.Utils.IsLetterAt = function GameFramework_Utils$IsLetterAt(theString, theIdx) {
    //JS
    var aCharCode = theString.charCodeAt(theIdx);
    return (((aCharCode >= 65) && (aCharCode <= 90)) || ((aCharCode >= 97) && (aCharCode <= 122)));
    //-JS
}
GameFramework.Utils.IsDigitAt = function GameFramework_Utils$IsDigitAt(theString, theIdx) {
    /*CS!
     return GameFramework.Utils.IsDigit(theString.charCodeAt(theIdx));
     -CS*/
    //JS
    var aCharCode = theString.charCodeAt(theIdx);
    return ((aCharCode >= 48) && (aCharCode <= 57));
    //-JS
}
GameFramework.Utils.SortIntVector = function GameFramework_Utils$SortIntVector(theIntVector) {
    //JS
    theIntVector.sort(function(a, b) {
        return a - b
    });
    //-JS
}
GameFramework.Utils.CreateIntMapSortVector = function GameFramework_Utils$CreateIntMapSortVector(theIntMap, theCompareCallback) {
    var anIntVector = [];

    {
        for(aKey in theIntMap) {
            anIntVector.push(aKey);
        }
    }
    anIntVector.mCSList.Sort$2((new GameFramework.misc.TMapSorter(theIntMap, theCompareCallback)));
    return anIntVector;
}
GameFramework.Utils.CreateMapSortVector = function GameFramework_Utils$CreateMapSortVector(theMap, theCompareCallback) {
    var aStringVector = [];

    {
        for(aKey in theMap) {
            aStringVector.push(aKey);
        }
    }
    aStringVector.mCSList.Sort$2((new GameFramework.misc.TMapSorter(theMap, theCompareCallback)));
    return aStringVector;
}
GameFramework.Utils.StrFormat = function GameFramework_Utils$StrFormat(str, $theParams) {
    var aNewString = str;
    for(var i = 0; i < aNewString.length; i++) {
        if(aNewString.charCodeAt(i) == 123) {
            var anEnd;
            for(anEnd = i + 1; anEnd < aNewString.length; anEnd++) {
                if(aNewString.charCodeAt(anEnd) == 125) {
                    break;
                }
            }
            var anIdx = aNewString.charCodeAt(i + 1) - 48;
            var aReplaceStr = '?';
            var aParam = arguments[(anIdx) + 1];
            if(Type.tryCast(aParam, Number)) {
                aReplaceStr = '' + ((aParam | 0));
            } else if(Type.tryCast(aParam, Number)) {
                aReplaceStr = '' + (((aParam | 0) | 0));
            } else if(Type.tryCast(aParam, Number)) {
                aReplaceStr = '' + (aParam);
            } else if(Type.tryCast(aParam, Number)) {
                aReplaceStr = '' + (aParam);
            } else if(Type.tryCast(aParam, String)) {
                aReplaceStr = aParam;
            }
            var aFormatString = aNewString.substr(i + 2, anEnd - i - 2);
            if(aFormatString == ':00') {
                if(aReplaceStr.length == 1) {
                    aReplaceStr = '0' + aReplaceStr;
                }
            }
            if(aFormatString.startsWith(':0.') && aFormatString.endsWith('#')) {
                var aDotPos = aReplaceStr.indexOf(String.fromCharCode(46));
                var aTrimLen = (aReplaceStr.length - aDotPos) - (aFormatString.length - 2);
                if(aTrimLen > 0) {
                    aReplaceStr = aReplaceStr.substr(0, aReplaceStr.length - aTrimLen);
                }
            }
            if(anEnd < aNewString.length - 1) {
                aNewString = aNewString.substr(0, i) + aReplaceStr + aNewString.substr(anEnd + 1);
            } else {
                aNewString = aNewString.substr(0, i) + aReplaceStr;
            }
            i += aReplaceStr.length - 1;
        }
    }
    return aNewString;
}
GameFramework.Utils.StrRemove = function GameFramework_Utils$StrRemove(str, theStart, theLength) {
    if(theLength === undefined) {
        theLength = 1;
    }
    if(theStart + theLength >= str.length) {
        return str.substr(0, theStart);
    }
    return str.substr(0, theStart) + str.substr(theStart + theLength);
}
GameFramework.Utils.StrStartsWith = function GameFramework_Utils$StrStartsWith(theString, theCheck) {
    if(theString.length < theCheck.length) {
        return false;
    }
    return theString.substr(0, theCheck.length) == theCheck;
}
GameFramework.Utils.StrEndsWith = function GameFramework_Utils$StrEndsWith(theString, theCheck) {
    if(theString.length < theCheck.length) {
        return false;
    }
    return theString.substr(theString.length - theCheck.length) == theCheck;
}
GameFramework.Utils.StrTrimStart = function GameFramework_Utils$StrTrimStart(theString) {
    var aCheckIdx = 0;
    while(true) {
        if(aCheckIdx >= theString.length) {
            return '';
        }
        if(!GameFramework.Utils.IsWhitespaceAt(theString, aCheckIdx)) {
            break;
        }
        aCheckIdx++;
    }
    return theString.substr(aCheckIdx);
}
GameFramework.Utils.StrTrimEnd = function GameFramework_Utils$StrTrimEnd(theString) {
    var aCheckIdx = theString.length - 1;
    while(true) {
        if(aCheckIdx < 0) {
            return '';
        }
        if(!GameFramework.Utils.IsWhitespaceAt(theString, aCheckIdx)) {
            break;
        }
        aCheckIdx--;
    }
    return theString.substr(0, aCheckIdx + 1);
}
GameFramework.Utils.StrTrim = function GameFramework_Utils$StrTrim(theString) {
    return GameFramework.Utils.StrTrimStart(GameFramework.Utils.StrTrimEnd(theString));
}
GameFramework.Utils.Trace = function GameFramework_Utils$Trace(theString) {
}
GameFramework.Utils.Log = function GameFramework_Utils$Log(theData, theParam) {
    if(theParam === undefined) {
        theParam = null;
    }
    if(theParam == null) {
        GameFramework.Utils.mLog.push(Array.Create(2, null, new GameFramework.misc.KeyVal('Time', GameFramework.Utils.GetUnixTime()), new GameFramework.misc.KeyVal('Data', theData)));
    } else {
        GameFramework.Utils.mLog.push(Array.Create(3, null, new GameFramework.misc.KeyVal('Time', GameFramework.Utils.GetUnixTime()), new GameFramework.misc.KeyVal('Data', theData), new GameFramework.misc.KeyVal('Param', theParam)));
    }
}
GameFramework.Utils.LerpMatrix = function GameFramework_Utils$LerpMatrix(theMat1, theMat2, thePct) {
    var omp = 1.0 - thePct;
    var aMatrix = new GameFramework.geom.Matrix();
    aMatrix.a = (theMat1.a * omp) + (theMat2.a * thePct);
    aMatrix.b = (theMat1.b * omp) + (theMat2.b * thePct);
    aMatrix.c = (theMat1.c * omp) + (theMat2.c * thePct);
    aMatrix.d = (theMat1.d * omp) + (theMat2.d * thePct);
    aMatrix.tx = (theMat1.tx * omp) + (theMat2.tx * thePct);
    aMatrix.ty = (theMat1.ty * omp) + (theMat2.ty * thePct);
    return aMatrix;
}
GameFramework.Utils.LerpColor = function GameFramework_Utils$LerpColor(theColor1, theColor2, thePct) {
    if(theColor1 == theColor2) {
        return theColor1;
    }
    var a = ((thePct * 256.0) | 0);
    var oma = 256 - a;
    var aColor = ((((theColor1 & 0xff) * oma) + ((theColor2 & 0xff) * a) >>> 8) & 0xff) | ((((theColor1 & 0xff00) * oma) + ((theColor2 & 0xff00) * a) >>> 8) & 0xff00) | ((((theColor1 & 0xff0000) * oma) + ((theColor2 & 0xff0000) * a) >>> 8) & 0xff0000) | (((((theColor1 >>> 24) & 0xff) * oma) + (((theColor2 >>> 24) & 0xff) * a) & 0xff00) << 16);
    return aColor;
}
GameFramework.Utils.IsPacificDST = function GameFramework_Utils$IsPacificDST(theUnixTime) {
    return false;
}
GameFramework.Utils.GetWeekNum = function GameFramework_Utils$GetWeekNum(theUnixTime, theDayNumStart, theHourStart) {
    //JS
    return 0;
    //-JS
}
GameFramework.Utils.GetUnixTime = function GameFramework_Utils$GetUnixTime() {
    //JS
    return 0;
    //-JS
}
GameFramework.Utils.CreateGUID = function GameFramework_Utils$CreateGUID() {
    var aTemplate = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    var aHexChars = '0123456789abcdef';
    var aGUID = '';
    for(var i = 0; i < aTemplate.length; i++) {
        if((aTemplate.charCodeAt(i) == 120) || (aTemplate.charCodeAt(i) == 121)) {
            var aRandomNumber = 0;
            //JS
            aRandomNumber = gBaseRNG();
            //-JS
            var aCharIdx = ((aRandomNumber * 16) | 0);
            if(aTemplate.charCodeAt(i) == 121) {
                aCharIdx = (aCharIdx & 3) | 8;
            }
            aGUID += String.fromCharCode(aHexChars.charCodeAt(aCharIdx));
        } else {
            aGUID += String.fromCharCode(aTemplate.charCodeAt(i));
        }
    }
    return aGUID;
}
GameFramework.Utils.GetRunningMilliseconds = function GameFramework_Utils$GetRunningMilliseconds() {
    //JS            
    if(GameFramework.Utils.sStartTime == 0) {
        GameFramework.Utils.sStartTime = new Date().getTime();
    }
    return  new Date().getTime() - GameFramework.Utils.sStartTime;
    //-JS
    return 0;
}
GameFramework.Utils.prototype = {

}
GameFramework.Utils.staticInit = function GameFramework_Utils$staticInit() {
    GameFramework.Utils.mLog = [];
    GameFramework.Utils.sStartTime = 0;
}

JS_AddInitFunc(function() {
    GameFramework.Utils.registerClass('GameFramework.Utils', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.Utils.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\Utils.cs
//LineMap:1=5 2=7 8=46 14=61 20=74 26=92 30=102 36=115 42=128 48=141 54=154 67=168 73=180 77=185 81=190 87=203 93=216 99=229 104=232 108=233 111=234 113=237 117=239 119=239 123=241 125=244 129=246 133=247 136=248 138=251 144=295 150=332 156=348 162=361 166=366 172=379 
//LineMap:178=392 184=405 186=414 188=417 194=430 200=443 207=458 214=473 224=488 230=502 233=506 235=506 237=507 243=528 246=533 248=533 250=534 253=536 256=616 259=620 267=629 268=637 269=640 270=642 272=645 273=645 274=647 275=647 276=649 277=649 278=651 279=653 280=655 
//LineMap:285=662 288=666 292=672 296=677 299=692 301=695 303=695 304=697 308=702 314=709 320=716 327=724 329=727 331=730 333=733 336=737 340=742 342=745 344=748 346=751 350=756 353=766 355=766 356=768 361=779 363=780 366=791 369=795 376=803 378=806 382=811 385=819 387=822 
//LineMap:389=872 391=876 397=931 403=945 407=950 416=963 423=969 425=972 427=983 434=996 442=23 443=979 
//Start:XMLParser
/**
 * @constructor
 */
GameFramework.XMLParser = function GameFramework_XMLParser() {
    this.mParent = null;
}
GameFramework.XMLParser.prototype = {
    mGroupedChildren : null,
    mChildren : null,
    mAttributes : null,
    mAttribueNames : null,
    mName : null,
    mParent : null,
    ParseXML : function GameFramework_XMLParser$ParseXML(theXMLData) {
        GameFramework.BaseApp.mApp.ParseXML(this, theXMLData);
    },
    Name : function GameFramework_XMLParser$Name() {
        return this.mName;
    },
    GetValue : function GameFramework_XMLParser$GetValue() {
        return this.mName;
    },
    GetChildren : function GameFramework_XMLParser$GetChildren() {
        return this.mChildren;
    },
    GetGroupedChildren : function GameFramework_XMLParser$GetGroupedChildren(key) {
        if(this.mGroupedChildren == null) {
            return new GameFramework.XMLParserList();
        }
        if(this.mGroupedChildren[key] != null) {
            return (this.mGroupedChildren[key]);
        }
        return new GameFramework.XMLParserList();
    },
    GetAttribute : function GameFramework_XMLParser$GetAttribute(theName) {
        if(this.mAttributes == null) {
            return new GameFramework.XMLParserList();
        }
        if(this.mAttributes[theName] == null) {
            return new GameFramework.XMLParserList();
        }
        return (this.mAttributes[theName]);
    },
    GetAttributesLength : function GameFramework_XMLParser$GetAttributesLength() {
        return this.mAttribueNames.length;
    },
    GetAttributeType : function GameFramework_XMLParser$GetAttributeType(theIdx) {
        return (this.mAttribueNames[theIdx]);
    },
    GetAttributeValue : function GameFramework_XMLParser$GetAttributeValue(theIdx) {
        return (this.mAttributes[this.mAttribueNames[theIdx]]);
    }
}
GameFramework.XMLParser.staticInit = function GameFramework_XMLParser$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.XMLParser.registerClass('GameFramework.XMLParser', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.XMLParser.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\XMLParser.cs
//LineMap:2=3 5=21 7=14 23=40 38=67 56=94 
//Start:XMLParserList
/**
 * @constructor
 */
GameFramework.XMLParserList = function GameFramework_XMLParserList() {
}
GameFramework.XMLParserList.prototype = {
    mEntries : null,
    mValue : null,
    Count : function GameFramework_XMLParserList$Count() {
        if(this.mEntries != null) {
            return this.mEntries.length;
        }
        if(this.mValue != null) {
            return 1;
        }
        return 0;
    },
    GetItem : function GameFramework_XMLParserList$GetItem(key) {
        if(this.mEntries == null) {
            return null;
        }
        return (this.mEntries[key]);
    },
    GetValue : function GameFramework_XMLParserList$GetValue() {
        if(this.mEntries == null) {
            if(this.mValue == null) {
                return '';
            } else {
                return this.mValue;
            }
        }
        return (this.mEntries[0]);
    }
}
GameFramework.XMLParserList.staticInit = function GameFramework_XMLParserList$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.XMLParserList.registerClass('GameFramework.XMLParserList', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.XMLParserList.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\XMLParserList.cs
//LineMap:2=3 13=11 
//Start:ads\AdAPIEvent
GameFramework.ads = Type.registerNamespace('GameFramework.ads');
/**
 * @constructor
 */
GameFramework.ads.AdAPIEvent = function GameFramework_ads_AdAPIEvent(theType) {
    GameFramework.ads.AdAPIEvent.initializeBase(this, [theType]);
}
GameFramework.ads.AdAPIEvent.prototype = {

}
GameFramework.ads.AdAPIEvent.staticInit = function GameFramework_ads_AdAPIEvent$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.ads.AdAPIEvent.registerClass('GameFramework.ads.AdAPIEvent', GameFramework.events.Event);
});
JS_AddStaticInitFunc(function() {
    GameFramework.ads.AdAPIEvent.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\ads\AdAPIEvent.cs
//LineMap:2=3 3=8 6=9 8=8 
//Start:connected\ConnectedRequest
GameFramework.connected = Type.registerNamespace('GameFramework.connected');
/**
 * @constructor
 */
GameFramework.connected.ConnectedRequest = function GameFramework_connected_ConnectedRequest() {
    GameFramework.connected.ConnectedRequest.initializeBase(this);
    GameFramework.connected.ConnectedRequest.mRequestCount++;
    this.mRequestId = GameFramework.connected.ConnectedRequest.mRequestCount;
}
GameFramework.connected.ConnectedRequest.LinkedRequestDoneStatic = function GameFramework_connected_ConnectedRequest$LinkedRequestDoneStatic(e) {
}
GameFramework.connected.ConnectedRequest.prototype = {
    mRequestType : GameFramework.connected.ConnectedRequest.REQUESTTYPE_NONE,
    mRequestId : 0,
    mLinkedRequestCount : 0,
    mRequest : null,
    mRequestParams : null,
    mGetterObject : null,
    mDataTarget : null,
    mError : null,
    mWantsRecv : null,
    mResult : null,
    mIsDone : null,
    mIsMultiResult : null,
    LinkRequest : function GameFramework_connected_ConnectedRequest$LinkRequest(theRequiredRequest) {
        this.mLinkedRequestCount++;
        theRequiredRequest.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(this, this.LinkedRequestDone));
    },
    LinkedRequestDone : function GameFramework_connected_ConnectedRequest$LinkedRequestDone(e) {
        this.mLinkedRequestCount--;
    }
}
GameFramework.connected.ConnectedRequest.staticInit = function GameFramework_connected_ConnectedRequest$staticInit() {
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_NONE = 0;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_GET = 1;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_BLIND_GET = 2;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_POST = 3;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_FBGRAPH = 4;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_DATABASE_UPDATE = 5;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_DATABASE_QUERY = 6;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_CUSTOM = 7;
    GameFramework.connected.ConnectedRequest.mRequestCount = 0;
}

JS_AddInitFunc(function() {
    GameFramework.connected.ConnectedRequest.registerClass('GameFramework.connected.ConnectedRequest', GameFramework.events.EventDispatcher);
});
JS_AddStaticInitFunc(function() {
    GameFramework.connected.ConnectedRequest.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\connected\ConnectedRequest.cs
//LineMap:2=3 3=33 6=34 9=35 12=45 17=17 30=39 36=49 43=8 51=19 
//Start:connected\Database
/**
 * @constructor
 */
GameFramework.connected.Database = function GameFramework_connected_Database() {
    this.mRequestIdToRequest = {};
    this.mLinkedRequestMap = {};
}
GameFramework.connected.Database.prototype = {
    mRequestId : 0,
    mURL : 'http://mooami.internal.popcap.com/p4_managed/PrimeSharp/prime/Database/query_engine.php',
    mRequestIdToRequest : null,
    mLinkedRequestMap : null,
    UpdateDB : function GameFramework_connected_Database$UpdateDB(theDBName, theCollectionName, theSelector, theUpdate, theFlags) {
        var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
        var aFlags = null;
        if(theFlags != 0) {
            aFlags = {};
            if((theFlags & GameFramework.connected.Database.FLAGS_UPSERT) != 0) {
                aFlags['upsert'] = true;
            }
            if((theFlags & GameFramework.connected.Database.FLAGS_MULTIUPDATE) != 0) {
                aFlags['multiupdate'] = true;
            }
        }
        var aJSONString = GameFramework.BaseApp.mApp.EncodeJSON(Array.Create(7, null, new GameFramework.misc.KeyVal('db', theDBName), new GameFramework.misc.KeyVal('collection', theCollectionName), new GameFramework.misc.KeyVal('cmd', 'update'), new GameFramework.misc.KeyVal('flags', aFlags), new GameFramework.misc.KeyVal('reqid', this.mRequestId), new GameFramework.misc.KeyVal('selector', theSelector), new GameFramework.misc.KeyVal('update', theUpdate)));
        aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_DATABASE_UPDATE;
        aConnectedRequest.mRequest = new GameFramework.misc.JSONString(aJSONString);
        aConnectedRequest.mWantsRecv = false;
        this.mRequestIdToRequest[this.mRequestId] = aConnectedRequest;
        this.mRequestId++;
        return aConnectedRequest;
    },
    UpdateId : function GameFramework_connected_Database$UpdateId(theDBName, theCollectionName, theId, theUpdate, theFlags) {
        return this.UpdateDB(theDBName, theCollectionName, Array.Create(1, null, new GameFramework.misc.KeyVal('_id', theId)), theUpdate, theFlags);
    },
    QueryDB : function GameFramework_connected_Database$QueryDB(theDBName, theCollectionName, theQuery, theFieldSelector, theFlags) {
        var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
        var aCmd;
        if((theFlags & GameFramework.connected.Database.FLAGS_EXHAUST) != 0) {
            aCmd = 'find';
        } else {
            aCmd = 'findOne';
        }
        var aJSONString = GameFramework.BaseApp.mApp.EncodeJSON(Array.Create(6, null, new GameFramework.misc.KeyVal('db', theDBName), new GameFramework.misc.KeyVal('collection', theCollectionName), new GameFramework.misc.KeyVal('cmd', aCmd), new GameFramework.misc.KeyVal('reqid', this.mRequestId), new GameFramework.misc.KeyVal('query', theQuery), new GameFramework.misc.KeyVal('fields', theFieldSelector)));
        aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_DATABASE_QUERY;
        aConnectedRequest.mRequest = new GameFramework.misc.JSONString(aJSONString);
        aConnectedRequest.mWantsRecv = true;
        this.mRequestIdToRequest[this.mRequestId] = aConnectedRequest;
        this.mRequestId++;
        return aConnectedRequest;
    },
    QueryId : function GameFramework_connected_Database$QueryId(theDBName, theCollectionName, theId, theFieldSelector, theFlags) {
        return this.QueryDB(theDBName, theCollectionName, new GameFramework.misc.KeyVal('_id', theId), theFieldSelector, theFlags);
    },
    ParseResponse : function GameFramework_connected_Database$ParseResponse(theJSONData) {
        var aResponseArray = [];
        GameFramework.BaseApp.mApp.DecodeJSON(theJSONData, aResponseArray);

        {
            var $enum1 = ss.IEnumerator.getEnumerator(aResponseArray);
            while($enum1.moveNext()) {
                var aResponseData = $enum1.get_current();
                var aRequestId = (aResponseData['reqid'] | 0);
                var aResult = aResponseData['result'];
                var anError = aResponseData['error'];
                var aConnectedRequest = this.mRequestIdToRequest[aRequestId];
                if(aConnectedRequest != null) {
                    delete this.mRequestIdToRequest[aRequestId];
                    aConnectedRequest.mResult = true;
                    aConnectedRequest.mDataTarget = aResult;
                    aConnectedRequest.mError = anError;
                }
            }
        }
    },
    Update : function GameFramework_connected_Database$Update() {
    }
}
GameFramework.connected.Database.staticInit = function GameFramework_connected_Database$staticInit() {
    GameFramework.connected.Database.FLAGS_UPSERT = 1;
    GameFramework.connected.Database.FLAGS_MULTIUPDATE = 2;
    GameFramework.connected.Database.FLAGS_EXHAUST = 1 << 6;
}

JS_AddInitFunc(function() {
    GameFramework.connected.Database.registerClass('GameFramework.connected.Database', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.connected.Database.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\connected\Database.cs
//LineMap:2=3 7=28 12=25 17=31 20=35 29=45 30=56 34=61 35=63 46=75 51=81 52=91 56=96 57=98 65=107 67=111 69=114 71=114 75=116 78=120 79=122 90=132 96=13 97=18 98=23 
//Start:connected\Facebook
/**
 * @constructor
 */
GameFramework.connected.Facebook = function GameFramework_connected_Facebook() {
    GameFramework.connected.Facebook.initializeBase(this);
}
GameFramework.connected.Facebook.prototype = {
    mAppId : '105312389549092',
    mLoginRequest : null,
    mAccessToken : null,
    SetAppInfo : function GameFramework_connected_Facebook$SetAppInfo(theAppId) {
    },
    ParseUserData : function GameFramework_connected_Facebook$ParseUserData(e) {
        var aConnectedRequest = e.target;
        var aDict = {};
        GameFramework.BaseApp.mApp.DecodeJSON(aConnectedRequest.mResult, aDict);
        this.mMyInfo = new GameFramework.connected.UserInfo();
        this.mMyInfo.mSocialUserId = aDict['id'];
        this.mMyInfo.mUserDBId = 'fb' + aDict['id'];
        this.mMyInfo.mName = aDict['name'];
    },
    ParseFriendData : function GameFramework_connected_Facebook$ParseFriendData(e) {
        var aConnectedRequest = e.target;
        var aDict = {};
        GameFramework.BaseApp.mApp.DecodeJSON(aConnectedRequest.mResult, aDict);
        var anArray = Type.safeCast(aDict['data'], GameFramework.TArray);
        this.mFriendArray = [];

        {
            var $enum1 = ss.IEnumerator.getEnumerator(anArray);
            while($enum1.moveNext()) {
                var aUserData = $enum1.get_current();
                var aUserInfo = new GameFramework.connected.UserInfo();
                aUserInfo.mSocialUserId = aUserData['id'];
                aUserInfo.mUserDBId = 'fb' + aUserData['id'];
                aUserInfo.mName = aUserData['name'];
                this.mFriendArray.push(aUserInfo);
            }
        }
    },
    TryGetProfilePicture : function GameFramework_connected_Facebook$TryGetProfilePicture(theUserInfo) {
        if(!theUserInfo.mLoadingProfilePicture) {
            var aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImageFromPath('https://graph.facebook.com/' + theUserInfo.mSocialUserId + '/picture?access_token=' + this.mAccessToken);
            aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(theUserInfo, theUserInfo.ProfilePicLoaded));
            theUserInfo.mLoadingProfilePicture = true;
        }
        return theUserInfo.mImageResource;
    },
    EnsureLoggedIn : function GameFramework_connected_Facebook$EnsureLoggedIn(theConnectedRequest) {
        if(this.mAccessToken == null) {
            var aLoginRequest = this.Login();
            theConnectedRequest.LinkRequest(aLoginRequest);
        }
    },
    CreateGraphRequest : function GameFramework_connected_Facebook$CreateGraphRequest(theRequest) {
        var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
        aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_FBGRAPH;
        aConnectedRequest.mRequest = theRequest;
        this.EnsureLoggedIn(aConnectedRequest);
        return aConnectedRequest;
    },
    GetUserData : function GameFramework_connected_Facebook$GetUserData() {
        var aMeId = 'me';
        var aFriendRequest = this.CreateGraphRequest('/' + aMeId + '/friends');
        aFriendRequest.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(this, this.ParseFriendData));
        var aConnectedRequest = this.CreateGraphRequest('/' + aMeId);
        aConnectedRequest.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(this, this.ParseUserData));
        aConnectedRequest.LinkRequest(aFriendRequest);
        return aConnectedRequest;
    }
}
GameFramework.connected.Facebook.staticInit = function GameFramework_connected_Facebook$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.connected.Facebook.registerClass('GameFramework.connected.Facebook', GameFramework.connected.SocialService);
});
JS_AddStaticInitFunc(function() {
    GameFramework.connected.Facebook.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\connected\Facebook.cs
//LineMap:2=3 11=10 19=19 24=25 35=37 36=39 39=40 43=42 52=53 60=62 84=88 86=91 
//Start:connected\HTTPService
/**
 * @constructor
 */
GameFramework.connected.HTTPService = function GameFramework_connected_HTTPService() {
}
GameFramework.connected.HTTPService.URLEncode = function GameFramework_connected_HTTPService$URLEncode(theString) {
    var aHexChars = '0123456789ABCDEF';
    var aString = "";
    for(var i = 0; i < theString.length; i++) {
        switch(theString.charCodeAt(i)) {
            case 32:
            case 63:
            case 38:
            case 37:
            case 43:
            case 13:
            case 10:
            case 9:
            {
                aString += String.fromCharCode(37);
                aString += String.fromCharCode(aHexChars.charCodeAt((theString.charCodeAt(i) >> 4) & 0xf));
                aString += String.fromCharCode(aHexChars.charCodeAt((theString.charCodeAt(i)) & 0xf));
                break;
            }
            default:
            {
                aString += String.fromCharCode(theString.charCodeAt(i));
                break;
            }
        }
    }
    return aString.toString();
}
GameFramework.connected.HTTPService.prototype = {

    Post : function GameFramework_connected_HTTPService$Post(theURL, theData) {
        var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
        aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_POST;
        aConnectedRequest.mRequest = theURL;
        aConnectedRequest.mRequestParams = theData;
        return aConnectedRequest;
    },
    Get : function GameFramework_connected_HTTPService$Get(theURL) {
        var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
        aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_GET;
        aConnectedRequest.mRequest = theURL;
        return aConnectedRequest;
    },
    BlindGet : function GameFramework_connected_HTTPService$BlindGet(theURL) {
        var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
        aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_BLIND_GET;
        aConnectedRequest.mRequest = theURL;
        return aConnectedRequest;
    },
    Update : function GameFramework_connected_HTTPService$Update() {
    }
}
GameFramework.connected.HTTPService.staticInit = function GameFramework_connected_HTTPService$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.connected.HTTPService.registerClass('GameFramework.connected.HTTPService', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.connected.HTTPService.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\connected\HTTPService.cs
//LineMap:2=8 8=35 11=39 12=41 15=43 16=45 29=56 41=10 66=66 
//Start:connected\SocialService
/**
 * @constructor
 */
GameFramework.connected.SocialService = function GameFramework_connected_SocialService() {
    this.mFriendArray = [];
}
GameFramework.connected.SocialService.prototype = {
    mFriendArray : null,
    mMyInfo : null,
    Init : function GameFramework_connected_SocialService$Init() {
        return null;
    },
    Login : function GameFramework_connected_SocialService$Login() {
        return null;
    },
    TryGetProfilePicture : function GameFramework_connected_SocialService$TryGetProfilePicture(theUserInfo) {
        return null;
    },
    GetUserData : function GameFramework_connected_SocialService$GetUserData() {
        return null;
    },
    Update : function GameFramework_connected_SocialService$Update() {
    }
}
GameFramework.connected.SocialService.staticInit = function GameFramework_connected_SocialService$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.connected.SocialService.registerClass('GameFramework.connected.SocialService', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.connected.SocialService.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\connected\SocialService.cs
//LineMap:2=3 14=11 
//Start:connected\UserInfo
/**
 * @constructor
 */
GameFramework.connected.UserInfo = function GameFramework_connected_UserInfo() {
}
GameFramework.connected.UserInfo.prototype = {
    mName : null,
    mSocialUserId : null,
    mUserDBId : null,
    mImageResource : null,
    mLoadingProfilePicture : false,
    ProfilePicLoaded : function GameFramework_connected_UserInfo$ProfilePicLoaded(e) {
        var aResourceStreamer = e.target;
        this.mImageResource = aResourceStreamer.mResultData;
    }
}
GameFramework.connected.UserInfo.staticInit = function GameFramework_connected_UserInfo$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.connected.UserInfo.registerClass('GameFramework.connected.UserInfo', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.connected.UserInfo.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\connected\UserInfo.cs
//LineMap:2=3 14=14 
//Start:events\Event
GameFramework.events = Type.registerNamespace('GameFramework.events');
/**
 * @constructor
 */
GameFramework.events.Event = function GameFramework_events_Event(theType) {
    this.type = theType;
}
GameFramework.events.Event.prototype = {
    type : null,
    text : null,
    target : null,
    dispatcher : null
}
GameFramework.events.Event.staticInit = function GameFramework_events_Event$staticInit() {
    GameFramework.events.Event.CANCEL = 'cancel';
    GameFramework.events.Event.CHANGE = 'change';
    GameFramework.events.Event.COMPLETE = 'complete';
    GameFramework.events.Event.ENTER_FRAME = 'enterFrame';
    GameFramework.events.Event.EXIT_FRAME = 'exitFrame';
}

JS_AddInitFunc(function() {
    GameFramework.events.Event.registerClass('GameFramework.events.Event', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.events.Event.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\events\Event.cs
//LineMap:2=5 3=18 6=19 8=20 19=7 
//Start:events\EventDispatcher
/**
 * @constructor
 */
GameFramework.events.EventDispatcher = function GameFramework_events_EventDispatcher() {
    this.mListeners = {};
}
GameFramework.events.EventDispatcher.prototype = {
    mListeners : null,
    AddEventListener : function GameFramework_events_EventDispatcher$AddEventListener(theType, theCallback) {
        if(!this.mListeners.hasOwnProperty(theType)) {
            this.mListeners[theType] = [];
        }
        (this.mListeners[theType]).push(theCallback);
    },
    HasEventListener : function GameFramework_events_EventDispatcher$HasEventListener(theType) {
        return this.mListeners.hasOwnProperty(theType);
    },
    DispatchEvent : function GameFramework_events_EventDispatcher$DispatchEvent(theEvent) {
        if(this.mListeners == null) {
            return;
        }
        theEvent.target = this;
        if(!this.mListeners.hasOwnProperty(theEvent.type)) {
            return;
        }

        {
            var $enum1 = ss.IEnumerator.getEnumerator(this.mListeners[theEvent.type]);
            while($enum1.moveNext()) {
                var aCallback = $enum1.get_current();
                aCallback.invoke(theEvent);
            }
        }
    },
    Dispose : function GameFramework_events_EventDispatcher$Dispose() {
        this.mListeners = null;
    }
}
GameFramework.events.EventDispatcher.staticInit = function GameFramework_events_EventDispatcher$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.events.EventDispatcher.registerClass('GameFramework.events.EventDispatcher', null, System.IDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.events.EventDispatcher.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\events\EventDispatcher.cs
//LineMap:2=6 7=14 13=16 20=25 34=37 38=39 43=43 
//Start:events\IEventDispatcher

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\events\IEventDispatcher.cs
//LineMap:2=5 
//Start:events\IOErrorEvent
/**
 * @constructor
 */
GameFramework.events.IOErrorEvent = function GameFramework_events_IOErrorEvent(theType) {
    GameFramework.events.IOErrorEvent.initializeBase(this, [theType]);
}
GameFramework.events.IOErrorEvent.prototype = {

}
GameFramework.events.IOErrorEvent.staticInit = function GameFramework_events_IOErrorEvent$staticInit() {
    GameFramework.events.IOErrorEvent.IO_ERROR = 'ioError';
}

JS_AddInitFunc(function() {
    GameFramework.events.IOErrorEvent.registerClass('GameFramework.events.IOErrorEvent', GameFramework.events.Event);
});
JS_AddStaticInitFunc(function() {
    GameFramework.events.IOErrorEvent.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\events\IOErrorEvent.cs
//LineMap:2=5 5=10 7=9 15=7 
//Start:geom\Axes3
GameFramework.geom = Type.registerNamespace('GameFramework.geom');
/**
 * @constructor
 */
GameFramework.geom.Axes3 = function GameFramework_geom_Axes3(inX, inY, inZ) {
    if(inX === undefined) {
        inX = null;
    }
    if(inY === undefined) {
        inY = null;
    }
    if(inZ === undefined) {
        inZ = null;
    }
    this.vX = (inX != null) ? inX : new GameFramework.geom.Vector3(1, 0, 0);
    this.vY = (inY != null) ? inY : new GameFramework.geom.Vector3(0, 1, 0);
    this.vZ = (inZ != null) ? inZ : new GameFramework.geom.Vector3(0, 0, 1);
}
GameFramework.geom.Axes3.prototype = {
    vX : null,
    vY : null,
    vZ : null,
    CopyFrom : function GameFramework_geom_Axes3$CopyFrom(theAxes3) {
        this.vX = theAxes3.vX;
        this.vY = theAxes3.vY;
        this.vZ = theAxes3.vZ;
    },
    Duplicate : function GameFramework_geom_Axes3$Duplicate() {
        return new GameFramework.geom.Axes3(this.vX, this.vY, this.vZ);
    },
    Enter : function GameFramework_geom_Axes3$Enter(inAxes) {
        return new GameFramework.geom.Axes3(this.vX.Enter(inAxes), this.vY.Enter(inAxes), this.vZ.Enter(inAxes));
    },
    Leave : function GameFramework_geom_Axes3$Leave(inAxes) {
        return new GameFramework.geom.Axes3(this.vX.Leave(inAxes), this.vY.Leave(inAxes), this.vZ.Leave(inAxes));
    },
    Inverse : function GameFramework_geom_Axes3$Inverse() {
        return new GameFramework.geom.Axes3().Enter(this);
    },
    OrthoNormalize : function GameFramework_geom_Axes3$OrthoNormalize() {
        var a = new GameFramework.geom.Axes3(this.vX, this.vY, this.vZ);
        a.vX = a.vY.Cross(a.vZ).Normalize();
        a.vY = a.vZ.Cross(a.vX).Normalize();
        a.vZ = a.vX.Cross(a.vY).Normalize();
        return a;
    },
    DeltaTo : function GameFramework_geom_Axes3$DeltaTo(inAxes) {
        return inAxes.Inverse().Leave(this);
    },
    SlerpTo : function GameFramework_geom_Axes3$SlerpTo(inAxes, inAlpha, inFastButLessAccurate) {
        if(inFastButLessAccurate === undefined) {
            inFastButLessAccurate = false;
        }
        return GameFramework.geom.Quat3.Slerp(GameFramework.geom.Quat3.CreateFromAxes(this), GameFramework.geom.Quat3.CreateFromAxes(inAxes), inAlpha, inFastButLessAccurate).GetAxes3();
    },
    RotateRadAxis : function GameFramework_geom_Axes3$RotateRadAxis(inRot, inNormalizedAxis) {
        var a = GameFramework.geom.Quat3.AxisAngle(inNormalizedAxis, inRot).GetAxes3();
        this.CopyFrom(this.Leave(a));
    },
    RotateRadX : function GameFramework_geom_Axes3$RotateRadX(inRot) {
        var sinRot = Math.sin(inRot);
        var cosRot = Math.cos(inRot);
        var a = new GameFramework.geom.Axes3();
        a.vY.y = cosRot;
        a.vZ.y = -sinRot;
        a.vY.z = sinRot;
        a.vZ.z = cosRot;
        this.CopyFrom(this.Leave(a));
    },
    RotateRadY : function GameFramework_geom_Axes3$RotateRadY(inRot) {
        var sinRot = Math.sin(inRot);
        var cosRot = Math.cos(inRot);
        var a = new GameFramework.geom.Axes3();
        a.vX.x = cosRot;
        a.vX.z = -sinRot;
        a.vZ.x = sinRot;
        a.vZ.z = cosRot;
        this.CopyFrom(this.Leave(a));
    },
    RotateRadZ : function GameFramework_geom_Axes3$RotateRadZ(inRot) {
        var sinRot = Math.sin(inRot);
        var cosRot = Math.cos(inRot);
        var a = new GameFramework.geom.Axes3();
        a.vX.x = cosRot;
        a.vX.y = sinRot;
        a.vY.x = -sinRot;
        a.vY.y = cosRot;
        this.CopyFrom(this.Leave(a));
    },
    LookAt : function GameFramework_geom_Axes3$LookAt(inTargetDir, inUpVector) {
        var tempZ = inTargetDir.Normalize();
        if(Math.abs(inUpVector.Dot(tempZ)) > (1.0 - 0.00001)) {
            return;
        }
        var a = new GameFramework.geom.Axes3();
        a.vZ = tempZ;
        a.vX = inUpVector.Cross(a.vZ).Normalize();
        a.vY = a.vZ.Cross(a.vX).Normalize();
        this.CopyFrom(this.Leave(a));
    }
}
GameFramework.geom.Axes3.staticInit = function GameFramework_geom_Axes3$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.geom.Axes3.registerClass('GameFramework.geom.Axes3', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.geom.Axes3.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\geom\Axes3.cs
//LineMap:2=8 3=12 6=13 8=12 9=12 10=12 11=14 21=19 43=46 57=59 62=71 64=71 65=73 68=80 78=91 83=97 90=105 95=111 102=119 107=125 115=134 119=139 
//Start:geom\Coords3
/**
 * @constructor
 */
GameFramework.geom.Coords3 = function GameFramework_geom_Coords3(inT, inR, inS) {
    if(inT === undefined) {
        inT = null;
    }
    if(inR === undefined) {
        inR = null;
    }
    if(inS === undefined) {
        inS = null;
    }
    this.t = (inT != null) ? inT : new GameFramework.geom.Vector3(0, 0, 0);
    this.r = (inR != null) ? inR : new GameFramework.geom.Axes3();
    this.s = (inS != null) ? inS : new GameFramework.geom.Vector3(1, 1, 1);
}
GameFramework.geom.Coords3.prototype = {
    t : null,
    r : null,
    s : null,
    CopyFrom : function GameFramework_geom_Coords3$CopyFrom(inC) {
        this.t = inC.t;
        this.r = inC.r;
        this.s = inC.s;
        return this;
    },
    Enter : function GameFramework_geom_Coords3$Enter(inCoords) {
        return new GameFramework.geom.Coords3(this.t.Enter$2(inCoords), this.r.Enter(inCoords.r), this.s.Div(inCoords.s));
    },
    Leave : function GameFramework_geom_Coords3$Leave(inCoords) {
        return new GameFramework.geom.Coords3(this.t.Leave$2(inCoords), this.r.Leave(inCoords.r), this.s.Mult(inCoords.s));
    },
    Inverse : function GameFramework_geom_Coords3$Inverse() {
        return new GameFramework.geom.Coords3().Enter(this);
    },
    DeltaTo : function GameFramework_geom_Coords3$DeltaTo(inCoords) {
        return inCoords.Inverse().Leave(this);
    },
    Translate : function GameFramework_geom_Coords3$Translate(inX, inY, inZ) {
        this.t = this.t.Add(new GameFramework.geom.Vector3(inX, inY, inZ));
    },
    RotateRadAxis : function GameFramework_geom_Coords3$RotateRadAxis(inRot, inNormalizedAxis) {
        this.r.RotateRadAxis(inRot, inNormalizedAxis);
    },
    RotateRadX : function GameFramework_geom_Coords3$RotateRadX(inRot) {
        this.r.RotateRadX(inRot);
    },
    RotateRadY : function GameFramework_geom_Coords3$RotateRadY(inRot) {
        this.r.RotateRadY(inRot);
    },
    RotateRadZ : function GameFramework_geom_Coords3$RotateRadZ(inRot) {
        this.r.RotateRadZ(inRot);
    },
    Scale : function GameFramework_geom_Coords3$Scale(inX, inY, inZ) {
        this.s = this.s.Mult(new GameFramework.geom.Vector3(inX, inY, inZ));
    },
    LookAt : function GameFramework_geom_Coords3$LookAt(inTargetPos, inUpVector) {
        var tempZ = this.t.Sub(inTargetPos);
        if(tempZ.ApproxZero()) {
            return false;
        }
        tempZ = tempZ.Normalize();
        if(Math.abs(inUpVector.Dot(tempZ)) > (1.0 - 0.0000001)) {
            return false;
        }
        this.r.vZ = tempZ;
        this.r.vX = inUpVector.Cross(this.r.vZ).Normalize();
        this.r.vY = this.r.vZ.Cross(this.r.vX).Normalize();
        return true;
    },
    LookAt$2 : function GameFramework_geom_Coords3$LookAt$2(inViewPos, inTargetPos, inUpVector) {
        this.t = inViewPos;
        return this.LookAt(inTargetPos, inUpVector);
    },
    GetInboundMatrix : function GameFramework_geom_Coords3$GetInboundMatrix(outM) {
        if(outM == null) {
            return;
        }
        var negT = this.t.Scale(-1.0);
        var vsX = this.r.vX.ScaleDiv(this.s.x);
        var vsY = this.r.vY.ScaleDiv(this.s.y);
        var vsZ = this.r.vZ.ScaleDiv(this.s.z);
        outM.m[outM.m.mIdxMult0 * (0) + 0] = vsX.x;
        outM.m[outM.m.mIdxMult0 * (0) + 1] = vsY.x;
        outM.m[outM.m.mIdxMult0 * (0) + 2] = vsZ.x;
        outM.m[outM.m.mIdxMult0 * (0) + 3] = 0.0;
        outM.m[outM.m.mIdxMult0 * (1) + 0] = vsX.y;
        outM.m[outM.m.mIdxMult0 * (1) + 1] = vsY.y;
        outM.m[outM.m.mIdxMult0 * (1) + 2] = vsZ.y;
        outM.m[outM.m.mIdxMult0 * (1) + 3] = 0.0;
        outM.m[outM.m.mIdxMult0 * (2) + 0] = vsX.z;
        outM.m[outM.m.mIdxMult0 * (2) + 1] = vsY.z;
        outM.m[outM.m.mIdxMult0 * (2) + 2] = vsZ.z;
        outM.m[outM.m.mIdxMult0 * (2) + 3] = 0.0;
        outM.m[outM.m.mIdxMult0 * (3) + 0] = negT.Dot(vsX);
        outM.m[outM.m.mIdxMult0 * (3) + 1] = negT.Dot(vsY);
        outM.m[outM.m.mIdxMult0 * (3) + 2] = negT.Dot(vsZ);
        outM.m[outM.m.mIdxMult0 * (3) + 3] = 1.0;
    },
    GetOutboundMatrix : function GameFramework_geom_Coords3$GetOutboundMatrix(outM) {
        if(outM == null) {
            return;
        }
        outM.m[outM.m.mIdxMult0 * (0) + 0] = this.r.vX.x * this.s.x;
        outM.m[outM.m.mIdxMult0 * (0) + 1] = this.r.vX.y * this.s.x;
        outM.m[outM.m.mIdxMult0 * (0) + 2] = this.r.vX.z * this.s.x;
        outM.m[outM.m.mIdxMult0 * (0) + 3] = 0.0;
        outM.m[outM.m.mIdxMult0 * (1) + 0] = this.r.vY.x * this.s.y;
        outM.m[outM.m.mIdxMult0 * (1) + 1] = this.r.vY.y * this.s.y;
        outM.m[outM.m.mIdxMult0 * (1) + 2] = this.r.vY.z * this.s.y;
        outM.m[outM.m.mIdxMult0 * (1) + 3] = 0.0;
        outM.m[outM.m.mIdxMult0 * (2) + 0] = this.r.vZ.x * this.s.z;
        outM.m[outM.m.mIdxMult0 * (2) + 1] = this.r.vZ.y * this.s.z;
        outM.m[outM.m.mIdxMult0 * (2) + 2] = this.r.vZ.z * this.s.z;
        outM.m[outM.m.mIdxMult0 * (2) + 3] = 0.0;
        outM.m[outM.m.mIdxMult0 * (3) + 0] = this.t.x;
        outM.m[outM.m.mIdxMult0 * (3) + 1] = this.t.y;
        outM.m[outM.m.mIdxMult0 * (3) + 2] = this.t.z;
        outM.m[outM.m.mIdxMult0 * (3) + 3] = 1.0;
    }
}
GameFramework.geom.Coords3.staticInit = function GameFramework_geom_Coords3$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.geom.Coords3.registerClass('GameFramework.geom.Coords3', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.geom.Coords3.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\geom\Coords3.cs
//LineMap:2=8 5=15 7=14 8=14 9=14 10=16 23=28 24=28 25=28 38=46 50=56 53=57 55=57 58=58 60=58 63=59 65=59 68=60 70=60 73=61 75=61 78=63 92=76 102=87 106=92 107=92 108=92 109=92 111=93 112=93 113=93 115=94 116=94 117=94 119=95 120=95 121=95 128=103 129=103 130=103 131=103 
//LineMap:133=104 134=104 135=104 137=105 138=105 139=105 141=106 142=106 143=106 
//Start:geom\Matrix
/**
 * @constructor
 */
GameFramework.geom.Matrix = function GameFramework_geom_Matrix() {
    this.identity();
}
GameFramework.geom.Matrix.Create = function GameFramework_geom_Matrix$Create(_a, _b, _c, _d, _tx, _ty) {
    var aMatrix = new GameFramework.geom.Matrix();
    aMatrix.a = _a;
    aMatrix.b = _b;
    aMatrix.c = _c;
    aMatrix.d = _d;
    aMatrix.tx = _tx;
    aMatrix.ty = _ty;
    return aMatrix;
}
GameFramework.geom.Matrix.prototype = {
    a : 0,
    b : 0,
    c : 0,
    d : 0,
    tx : 0,
    ty : 0,
    clone : function GameFramework_geom_Matrix$clone() {
        return GameFramework.geom.Matrix.Create(this.a, this.b, this.c, this.d, this.tx, this.ty);
    },
    identity : function GameFramework_geom_Matrix$identity() {
        this.tx = 0;
        this.ty = 0;
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
    },
    translate : function GameFramework_geom_Matrix$translate(theX, theY) {
        this.tx += theX;
        this.ty += theY;
    },
    scale : function GameFramework_geom_Matrix$scale(theScaleX, theScaleY) {
        this.a *= theScaleX;
        this.b *= theScaleY;
        this.c *= theScaleX;
        this.d *= theScaleY;
        this.tx *= theScaleX;
        this.ty *= theScaleY;
    },
    rotate : function GameFramework_geom_Matrix$rotate(theAngle) {
        var _a = this.a;
        var _b = this.b;
        var _c = this.c;
        var _d = this.d;
        var _tx = this.tx;
        var _ty = this.ty;
        var sin = Math.sin(theAngle);
        var cos = Math.cos(theAngle);
        this.a = _a * cos - _b * sin;
        this.b = _a * sin + _b * cos;
        this.c = _c * cos - _d * sin;
        this.d = _c * sin + _d * cos;
        this.tx = _tx * cos - _ty * sin;
        this.ty = _tx * sin + _ty * cos;
    },
    concat : function GameFramework_geom_Matrix$concat(theMat2) {
        var _a = this.a;
        var _b = this.b;
        var _c = this.c;
        var _d = this.d;
        var _tx = this.tx;
        var _ty = this.ty;
        this.a = _a * theMat2.a + _b * theMat2.c;
        this.b = _a * theMat2.b + _b * theMat2.d;
        this.c = _c * theMat2.a + _d * theMat2.c;
        this.d = _c * theMat2.b + _d * theMat2.d;
        this.tx = _tx * theMat2.a + _ty * theMat2.c + theMat2.tx;
        this.ty = _tx * theMat2.b + _ty * theMat2.d + theMat2.ty;
    },
    invert : function GameFramework_geom_Matrix$invert() {
        var _a = this.a;
        var _b = this.b;
        var _c = this.c;
        var _d = this.d;
        var _tx = this.tx;
        var _ty = this.ty;
        var den = this.a * this.d - this.b * this.c;
        this.a = _d / den;
        this.b = -_b / den;
        this.c = -_c / den;
        this.d = _a / den;
        this.tx = (_c * _ty - _d * _tx) / den;
        this.ty = -(_a * _ty - _b * _tx) / den;
    },
    transformPoint : function GameFramework_geom_Matrix$transformPoint(thePoint) {
        return new GameFramework.geom.TPoint(this.tx + this.a * thePoint.x + this.c * thePoint.y, this.ty + this.b * thePoint.x + this.d * thePoint.y);
    },
    deltaTransformPoint : function GameFramework_geom_Matrix$deltaTransformPoint(thePoint) {
        return new GameFramework.geom.TPoint(this.a * thePoint.x + this.c * thePoint.y, this.b * thePoint.x + this.d * thePoint.y);
    }
}
GameFramework.geom.Matrix.staticInit = function GameFramework_geom_Matrix$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.geom.Matrix.registerClass('GameFramework.geom.Matrix', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.geom.Matrix.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\geom\Matrix.cs
//LineMap:2=3 5=15 7=16 9=30 29=42 68=82 70=85 86=102 90=107 102=120 103=122 
//Start:geom\Matrix3D
/**
 * @constructor
 */
GameFramework.geom.Matrix3D = function GameFramework_geom_Matrix3D() {
    this.m = Array.Create2D(4, 4, 16, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
}
GameFramework.geom.Matrix3D.prototype = {
    m : null,
    Identity : function GameFramework_geom_Matrix3D$Identity() {
        this.m[this.m.mIdxMult0 * (0) + 0] = 1;
        this.m[this.m.mIdxMult0 * (0) + 1] = 0;
        this.m[this.m.mIdxMult0 * (0) + 2] = 0;
        this.m[this.m.mIdxMult0 * (0) + 3] = 0;
        this.m[this.m.mIdxMult0 * (1) + 0] = 0;
        this.m[this.m.mIdxMult0 * (1) + 1] = 1;
        this.m[this.m.mIdxMult0 * (1) + 2] = 0;
        this.m[this.m.mIdxMult0 * (1) + 3] = 0;
        this.m[this.m.mIdxMult0 * (2) + 0] = 0;
        this.m[this.m.mIdxMult0 * (2) + 1] = 0;
        this.m[this.m.mIdxMult0 * (2) + 2] = 1;
        this.m[this.m.mIdxMult0 * (2) + 3] = 0;
        this.m[this.m.mIdxMult0 * (3) + 0] = 0;
        this.m[this.m.mIdxMult0 * (3) + 1] = 0;
        this.m[this.m.mIdxMult0 * (3) + 2] = 0;
        this.m[this.m.mIdxMult0 * (3) + 3] = 1;
    },
    CopyFrom : function GameFramework_geom_Matrix3D$CopyFrom(theMatrix) {
        for(var i = 0; i < 4; i++) {
            for(var j = 0; j < 4; j++) {
                this.m[this.m.mIdxMult0 * (i) + j] = theMatrix.m[theMatrix.m.mIdxMult0 * (i) + j];
            }
        }
    },
    Append : function GameFramework_geom_Matrix3D$Append(lhs) {
        var i;
        var j;
        for(i = 0; i < 4; i++) {
            for(j = 0; j < 4; j++) {
                GameFramework.geom.Matrix3D.aTemp[GameFramework.geom.Matrix3D.aTemp.mIdxMult0 * (i) + j] = this.m[this.m.mIdxMult0 * (i) + j];
            }
        }
        for(i = 0; i < 4; i++) {
            for(j = 0; j < 4; j++) {
                var x = 0;
                for(var k = 0; k < 4; k++) {
                    x += lhs.m[lhs.m.mIdxMult0 * (i) + k] * GameFramework.geom.Matrix3D.aTemp[GameFramework.geom.Matrix3D.aTemp.mIdxMult0 * (k) + j];
                }
                this.m[this.m.mIdxMult0 * (i) + j] = x;
            }
        }
    }
}
GameFramework.geom.Matrix3D.staticInit = function GameFramework_geom_Matrix3D$staticInit() {
    GameFramework.geom.Matrix3D.aTemp = Array.Create2D(4, 4, null);
}

JS_AddInitFunc(function() {
    GameFramework.geom.Matrix3D.registerClass('GameFramework.geom.Matrix3D', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.geom.Matrix3D.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\geom\Matrix3D.cs
//LineMap:2=8 7=10 13=12 19=19 23=24 27=29 33=37 47=52 54=60 61=35 
//Start:geom\Quat3
/**
 * @constructor
 */
GameFramework.geom.Quat3 = function GameFramework_geom_Quat3(inV, inS) {
    if(inV === undefined) {
        inV = null;
    }
    if(inS === undefined) {
        inS = 1.0;
    }
    this.v = (inV != null) ? inV : new GameFramework.geom.Vector3(0, 0, 0);
    this.s = inS;
}
GameFramework.geom.Quat3.CreateFromAxes = function GameFramework_geom_Quat3$CreateFromAxes(inAxes) {
    var f = inAxes.OrthoNormalize();
    var s = 0;
    var v = new GameFramework.geom.Vector3();
    var rot = Array.Create(3, 3, 1, 2, 0);
    var c = Array.Create2D(3, 3, 9, f.vX.x, f.vY.x, f.vZ.x, 0, 0, 0, 0, 0, 0);
    var i;
    var j;
    var k;
    var d;
    var sq;
    var q = Array.Create(4, null);
    d = c[c.mIdxMult0 * (0) + 0] + c[c.mIdxMult0 * (1) + 1] + c[c.mIdxMult0 * (2) + 2];
    if(d > 0.0) {
        sq = Math.sqrt(d + 1.0);
        s = sq * 0.5;
        sq = 0.5 / sq;
        v.x = (c[c.mIdxMult0 * (1) + 2] - c[c.mIdxMult0 * (2) + 1]) * sq;
        v.y = (c[c.mIdxMult0 * (2) + 0] - c[c.mIdxMult0 * (0) + 2]) * sq;
        v.z = (c[c.mIdxMult0 * (0) + 1] - c[c.mIdxMult0 * (1) + 0]) * sq;
        return new GameFramework.geom.Quat3(v, s);
        ;
    }
    i = 0;
    if(c[c.mIdxMult0 * (1) + 1] > c[c.mIdxMult0 * (0) + 0]) {
        i = 1;
    }
    if(c[c.mIdxMult0 * (2) + 2] > c[c.mIdxMult0 * (i) + i]) {
        i = 2;
    }
    j = rot[i];
    k = rot[j];
    sq = Math.sqrt((c[c.mIdxMult0 * (i) + i] - (c[c.mIdxMult0 * (j) + j] + c[c.mIdxMult0 * (k) + k])) + 1.0);
    q[i] = sq * 0.5;
    if(sq != 0.0) {
        sq = 0.5 / sq;
    }
    s = (c[c.mIdxMult0 * (j) + k] - c[c.mIdxMult0 * (k) + j]) * sq;
    q[j] = (c[c.mIdxMult0 * (i) + j] + c[c.mIdxMult0 * (j) + i]) * sq;
    q[k] = (c[c.mIdxMult0 * (i) + k] + c[c.mIdxMult0 * (k) + i]) * sq;
    v.x = q[0];
    v.y = q[1];
    v.z = q[2];
    return new GameFramework.geom.Quat3(v, s);
}
GameFramework.geom.Quat3.AxisAngle = function GameFramework_geom_Quat3$AxisAngle(inAxis, inAngleRad) {
    var q = new GameFramework.geom.Quat3();
    inAngleRad *= 0.5;
    q.v = inAxis.Normalize();
    q.v = q.v.Scale(Math.sin(inAngleRad));
    q.s = Math.cos(inAngleRad);
    return q;
}
GameFramework.geom.Quat3.Slerp = function GameFramework_geom_Quat3$Slerp(inL, inR, inAlpha, inLerpOnly) {
    if(inL.ApproxEquals(inR, 0.00001)) {
        return inL;
    }
    var omalpha = Math.min(Math.max(inAlpha, 0.0), 1.0);
    var alpha = 1.0 - omalpha;
    var tempR = inR;
    var cosang = inL.Dot(inR);
    if(cosang < 0.0) {
        cosang = -cosang;
        tempR.v.x = -tempR.v.x;
        tempR.v.y = -tempR.v.y;
        tempR.v.z = -tempR.v.z;
    }
    if(((1.0 - cosang) > 0.00001) && (!inLerpOnly)) {
        var ang = Math.acos(cosang);
        if((ang >= 0.00001) && ((Math.PI - ang) >= 0.00001) && (Math.abs(ang) < 100000000.0)) {
            var sinang = Math.sin(ang);
            var oosinang = 1.0 / sinang;
            var sA = Math.sin(alpha * ang) * oosinang;
            var sB = Math.sin(omalpha * ang) * oosinang;
            var s = inL.s * sA + tempR.s * sB;
            var v = inL.v.Scale(sA).Add(tempR.v.Scale(sB));
            return new GameFramework.geom.Quat3(v, s).Normalize();
        }
    }
    var s2 = inL.s * alpha + tempR.s * omalpha;
    var v2 = inL.v.Scale(alpha).Add(tempR.v.Scale(omalpha));
    return new GameFramework.geom.Quat3(v2, s2).Normalize();
}
GameFramework.geom.Quat3.prototype = {
    v : null,
    s : 0,
    GetAxes3 : function GameFramework_geom_Quat3$GetAxes3() {
        var x = this.v.x;
        var y = this.v.y;
        var z = this.v.z;
        var w = this.s;
        var x2 = x * 2.0;
        var y2 = y * 2.0;
        var z2 = z * 2.0;
        var w2 = w * 2.0;
        var xx2 = x * x2;
        var yy2 = y * y2;
        var zz2 = z * z2;
        var xy2 = x * y2;
        var xz2 = x * z2;
        var xw2 = x * w2;
        var yz2 = y * z2;
        var yw2 = y * w2;
        var zw2 = z * w2;
        return new GameFramework.geom.Axes3(new GameFramework.geom.Vector3(1.0 - (yy2 + zz2), xy2 + zw2, xz2 - yw2), new GameFramework.geom.Vector3(xy2 - zw2, 1.0 - (xx2 + zz2), yz2 + xw2), new GameFramework.geom.Vector3(xz2 + yw2, yz2 - xw2, 1.0 - (xx2 + yy2)));
    },
    ScaleDiv : function GameFramework_geom_Quat3$ScaleDiv(inT) {
        return new GameFramework.geom.Quat3(this.v.ScaleDiv(inT), this.s / inT);
    },
    Dot : function GameFramework_geom_Quat3$Dot(inQ) {
        return this.v.Dot(inQ.v) + (this.s * inQ.s);
    },
    Magnitude : function GameFramework_geom_Quat3$Magnitude() {
        return Math.sqrt(this.v.x * this.v.x + this.v.y * this.v.y + this.v.z * this.v.z + this.s * this.s);
    },
    Normalize : function GameFramework_geom_Quat3$Normalize() {
        var aMag = this.Magnitude();
        return aMag != 0 ? this.ScaleDiv(aMag) : this;
    },
    ApproxEquals : function GameFramework_geom_Quat3$ApproxEquals(inQ, inTol) {
        return ((Math.abs(this.s - inQ.s) <= inTol) && this.v.ApproxEquals(inQ.v, inTol));
    }
}
GameFramework.geom.Quat3.staticInit = function GameFramework_geom_Quat3$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.geom.Quat3.registerClass('GameFramework.geom.Quat3', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.geom.Quat3.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\geom\Quat3.cs
//LineMap:2=8 5=16 7=15 8=15 9=17 12=28 15=32 17=35 20=37 21=37 23=38 35=49 37=52 44=60 45=62 48=66 49=68 51=71 54=75 56=108 59=112 63=117 65=120 69=125 71=130 83=144 89=151 91=154 94=158 96=161 103=81 122=101 125=181 127=181 130=183 137=188 140=190 
//Start:geom\TIntPoint
/**
 * @constructor
 */
GameFramework.geom.TIntPoint = function GameFramework_geom_TIntPoint(theX, theY) {
    if(theX === undefined) {
        theX = 0;
    }
    if(theY === undefined) {
        theY = 0;
    }
    this.x = theX;
    this.y = theY;
}
GameFramework.geom.TIntPoint.distance = function GameFramework_geom_TIntPoint$distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}
GameFramework.geom.TIntPoint.prototype = {
    x : 0,
    y : 0,
    get_length : function GameFramework_geom_TIntPoint$get_length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
GameFramework.geom.TIntPoint.staticInit = function GameFramework_geom_TIntPoint$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.geom.TIntPoint.registerClass('GameFramework.geom.TIntPoint', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.geom.TIntPoint.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\geom\TIntPoint.cs
//LineMap:2=3 5=16 7=15 8=15 9=17 12=21 23=10 
//Start:geom\TPoint
/**
 * @constructor
 */
GameFramework.geom.TPoint = function GameFramework_geom_TPoint(theX, theY) {
    if(theX === undefined) {
        theX = 0;
    }
    if(theY === undefined) {
        theY = 0;
    }
    this.x = theX;
    this.y = theY;
}
GameFramework.geom.TPoint.distance = function GameFramework_geom_TPoint$distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}
GameFramework.geom.TPoint.interpolate = function GameFramework_geom_TPoint$interpolate(p1, p2, aPct) {
    return new GameFramework.geom.TPoint(p2.x + (p1.x - p2.x) * aPct, p2.y + (p1.y - p2.y) * aPct);
}
GameFramework.geom.TPoint.prototype = {
    x : 0,
    y : 0,
    get_length : function GameFramework_geom_TPoint$get_length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    clone : function GameFramework_geom_TPoint$clone() {
        return new GameFramework.geom.TPoint(this.x, this.y);
    },
    offset : function GameFramework_geom_TPoint$offset(ofsX, ofsY) {
        this.x += ofsX;
        this.y += ofsY;
    },
    add : function GameFramework_geom_TPoint$add(pt) {
        return new GameFramework.geom.TPoint(this.x + pt.x, this.y + pt.y);
    },
    subtract : function GameFramework_geom_TPoint$subtract(pt) {
        return new GameFramework.geom.TPoint(this.x - pt.x, this.y - pt.y);
    },
    scale : function GameFramework_geom_TPoint$scale(scale) {
        return new GameFramework.geom.TPoint(this.x * scale, this.y * scale);
    },
    normalize : function GameFramework_geom_TPoint$normalize(thickness) {
        var aScale = thickness / this.get_length();
        this.x *= aScale;
        this.y *= aScale;
    }
}
GameFramework.geom.TPoint.staticInit = function GameFramework_geom_TPoint$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.geom.TPoint.registerClass('GameFramework.geom.TPoint', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.geom.TPoint.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\geom\TPoint.cs
//LineMap:2=3 5=16 7=15 8=15 9=17 12=26 18=54 27=10 32=21 37=33 58=59 
//Start:geom\Vector3
/**
 * @constructor
 */
GameFramework.geom.Vector3 = function GameFramework_geom_Vector3(theX, theY, theZ) {
    if(theX === undefined) {
        theX = 0;
    }
    if(theY === undefined) {
        theY = 0;
    }
    if(theZ === undefined) {
        theZ = 0;
    }
    this.x = theX;
    this.y = theY;
    this.z = theZ;
}
GameFramework.geom.Vector3.prototype = {
    x : null,
    y : 0,
    z : 0,
    Dot : function GameFramework_geom_Vector3$Dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },
    Cross : function GameFramework_geom_Vector3$Cross(v) {
        return new GameFramework.geom.Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    },
    Add : function GameFramework_geom_Vector3$Add(v) {
        return new GameFramework.geom.Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    },
    Sub : function GameFramework_geom_Vector3$Sub(v) {
        return new GameFramework.geom.Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    },
    Scale : function GameFramework_geom_Vector3$Scale(t) {
        return new GameFramework.geom.Vector3(t * this.x, t * this.y, t * this.z);
    },
    Mult : function GameFramework_geom_Vector3$Mult(v) {
        return new GameFramework.geom.Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    },
    ScaleDiv : function GameFramework_geom_Vector3$ScaleDiv(t) {
        var oot = 1.0 / t;
        return new GameFramework.geom.Vector3(this.x * oot, this.y * oot, this.z * oot);
    },
    Div : function GameFramework_geom_Vector3$Div(v) {
        return new GameFramework.geom.Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
    },
    Magnitude : function GameFramework_geom_Vector3$Magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    Normalize : function GameFramework_geom_Vector3$Normalize() {
        var aMag = this.Magnitude();
        return aMag != 0 ? this.ScaleDiv(aMag) : this;
    },
    ApproxEquals : function GameFramework_geom_Vector3$ApproxEquals(inV, inTol) {
        if(inTol === undefined) {
            inTol = 0.00001;
        }
        return ((Math.abs(this.x - inV.x) <= inTol) && (Math.abs(this.y - inV.y) <= inTol) && (Math.abs(this.z - inV.z) <= inTol));
    },
    ApproxZero : function GameFramework_geom_Vector3$ApproxZero(inTol) {
        if(inTol === undefined) {
            inTol = 0.00001;
        }
        return ((Math.abs(this.x) <= inTol) && (Math.abs(this.y) <= inTol) && (Math.abs(this.z) <= inTol));
    },
    Enter : function GameFramework_geom_Vector3$Enter(inAxes) {
        return new GameFramework.geom.Vector3(this.Dot(inAxes.vX), this.Dot(inAxes.vY), this.Dot(inAxes.vZ));
    },
    Enter$2 : function GameFramework_geom_Vector3$Enter$2(inCoords) {
        return ((this.Sub(inCoords.t)).Enter(inCoords.r)).Div(inCoords.s);
    },
    Leave : function GameFramework_geom_Vector3$Leave(inAxes) {
        return new GameFramework.geom.Vector3(this.x * inAxes.vX.x + this.y * inAxes.vY.x + this.z * inAxes.vZ.x, this.x * inAxes.vX.y + this.y * inAxes.vY.y + this.z * inAxes.vZ.y, this.x * inAxes.vX.z + this.y * inAxes.vY.z + this.z * inAxes.vZ.z);
    },
    Leave$2 : function GameFramework_geom_Vector3$Leave$2(inCoords) {
        return ((this.Mult(inCoords.s)).Leave(inCoords.r)).Add(inCoords.t);
    }
}
GameFramework.geom.Vector3.staticInit = function GameFramework_geom_Vector3$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.geom.Vector3.registerClass('GameFramework.geom.Vector3', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.geom.Vector3.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\geom\Vector3.cs
//LineMap:2=8 5=13 7=12 8=12 9=12 10=14 20=19 32=29 35=30 37=30 40=31 42=31 45=32 47=32 50=33 52=33 53=33 56=34 58=34 61=36 74=47 75=49 78=54 80=54 81=56 84=61 99=80 
//Start:gfx\Camera
GameFramework.gfx = Type.registerNamespace('GameFramework.gfx');
/**
 * @constructor
 */
GameFramework.gfx.Camera = function GameFramework_gfx_Camera() {
    this.mCoords = new GameFramework.geom.Coords3();
    this.mZNear = 1.0;
    this.mZFar = 10000.0;
}
GameFramework.gfx.Camera.prototype = {
    mCoords : null,
    mZNear : 0,
    mZFar : 0,
    GetCoords : function GameFramework_gfx_Camera$GetCoords() {
        return this.mCoords;
    },
    SetCoords : function GameFramework_gfx_Camera$SetCoords(inCoords) {
        this.mCoords = inCoords;
    },
    GetViewMatrix : function GameFramework_gfx_Camera$GetViewMatrix(outM) {
        if(outM == null) {
            return;
        }
        var tempCoords = new GameFramework.geom.Coords3();
        tempCoords.CopyFrom(this.mCoords);
        tempCoords.s = new GameFramework.geom.Vector3(tempCoords.s.x, tempCoords.s.y, -tempCoords.s.z);
        tempCoords.GetInboundMatrix(outM);
    },
    GetProjectionMatrix : function GameFramework_gfx_Camera$GetProjectionMatrix(outM) {
    },
    IsOrtho : function GameFramework_gfx_Camera$IsOrtho() {
        return false;
    },
    IsPerspective : function GameFramework_gfx_Camera$IsPerspective() {
        return false;
    },
    EyeToScreen : function GameFramework_gfx_Camera$EyeToScreen(inEyePos) {
        return null;
    },
    WorldToEye : function GameFramework_gfx_Camera$WorldToEye(inWorldPos) {
        return inWorldPos.Enter$2(this.mCoords);
    },
    WorldToScreen : function GameFramework_gfx_Camera$WorldToScreen(inWorldPos) {
        return this.EyeToScreen(this.WorldToEye(inWorldPos));
    },
    LookAt : function GameFramework_gfx_Camera$LookAt(inTargetPos, inUpVector) {
        var c = this.mCoords;
        if(!c.LookAt(inTargetPos, inUpVector)) {
            return false;
        }
        this.SetCoords(c);
        return true;
    },
    LookAt$2 : function GameFramework_gfx_Camera$LookAt$2(inViewPos, inTargetPos, inUpVector) {
        var c = this.mCoords;
        if(!c.LookAt$2(inViewPos, inTargetPos, inUpVector)) {
            return false;
        }
        this.SetCoords(c);
        return true;
    }
}
GameFramework.gfx.Camera.staticInit = function GameFramework_gfx_Camera$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.gfx.Camera.registerClass('GameFramework.gfx.Camera', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.gfx.Camera.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\gfx\Camera.cs
//LineMap:2=10 3=15 6=19 8=20 18=25 20=25 23=26 25=26 28=28 42=39 44=39 47=40 49=40 52=42 54=42 57=44 
//Start:gfx\Color
/**
 * @constructor
 */
GameFramework.gfx.Color = function GameFramework_gfx_Color(r, g, b, a) {
    this.mRed = r;
    this.mGreen = g;
    this.mBlue = b;
    this.mAlpha = a;
}
GameFramework.gfx.Color.CreateFromRGB = function GameFramework_gfx_Color$CreateFromRGB(r, g, b) {
    return new GameFramework.gfx.Color(r, g, b, 255);
}
GameFramework.gfx.Color.CreateFromInt = function GameFramework_gfx_Color$CreateFromInt(theColorInt) {
    return new GameFramework.gfx.Color(((theColorInt >>> 16) | 0) & 0xff, ((theColorInt >>> 8) | 0) & 0xff, (theColorInt | 0) & 0xff, ((theColorInt >>> 24) | 0) & 0xff);
}
GameFramework.gfx.Color.CreateFromIntAlpha = function GameFramework_gfx_Color$CreateFromIntAlpha(theColorInt, theAlpha) {
    return new GameFramework.gfx.Color(((theColorInt >>> 16) | 0) & 0xff, ((theColorInt >>> 8) | 0) & 0xff, (theColorInt | 0) & 0xff, (theAlpha | 0) & 0xff);
}
GameFramework.gfx.Color.CreateFromFAlpha = function GameFramework_gfx_Color$CreateFromFAlpha(theAlpha) {
    return GameFramework.gfx.Color.CreateFromInt(0xffffff | ((((255.0 * theAlpha) | 0)) << 24));
}
GameFramework.gfx.Color.FAlphaToInt = function GameFramework_gfx_Color$FAlphaToInt(theAlpha) {
    return 0xffffff | ((((255.0 * theAlpha) | 0)) << 24);
}
GameFramework.gfx.Color.GetAlphaFromInt = function GameFramework_gfx_Color$GetAlphaFromInt(theColor) {
    return ((0xff & (theColor >>> 24))) / 255.0;
}
GameFramework.gfx.Color.RGBAToInt = function GameFramework_gfx_Color$RGBAToInt(r, g, b, a) {
    return (((a << 24) | (r << 16) | (g << 8) | (b)) | 0);
}
GameFramework.gfx.Color.UInt_AToInt = function GameFramework_gfx_Color$UInt_AToInt(rgb, a) {
    return ((((a | 0) << 24) | (rgb & 0xffffff)) | 0);
}
GameFramework.gfx.Color.UInt_FAToInt = function GameFramework_gfx_Color$UInt_FAToInt(rgb, a) {
    return (((((a * 255) | 0) << 24) | (rgb & 0xffffff)) | 0);
}
GameFramework.gfx.Color.RGBToInt = function GameFramework_gfx_Color$RGBToInt(r, g, b) {
    return ((((0xff000000 | 0)) | ((r | 0) << 16) | ((g | 0) << 8) | ((b | 0))) | 0);
}
GameFramework.gfx.Color.HSLAToInt = function GameFramework_gfx_Color$HSLAToInt(h, s, l, a) {
    var r;
    var g;
    var b;
    var v = (l < 128) ? (((l * (255 + s)) / 255) | 0) : (l + s - ((l * s / 255) | 0));
    var y = ((2 * l - v) | 0);
    var aColorDiv = (((6 * h) / 256) | 0);
    var x = ((y + (v - y) * ((h - (((aColorDiv * 256 / 6) | 0))) * 6) / 255) | 0);
    if(x > 255) {
        x = 255;
    }
    var z = ((v - (v - y) * ((h - (((aColorDiv * 256 / 6) | 0))) * 6) / 255) | 0);
    if(z < 0) {
        z = 0;
    }
    switch(aColorDiv) {
        case 0:
        {
            r = (v | 0);
            g = x;
            b = y;
            break;
        }
        case 1:
        {
            r = z;
            g = (v | 0);
            b = y;
            break;
        }
        case 2:
        {
            r = y;
            g = (v | 0);
            b = x;
            break;
        }
        case 3:
        {
            r = y;
            g = z;
            b = (v | 0);
            break;
        }
        case 4:
        {
            r = x;
            g = y;
            b = (v | 0);
            break;
        }
        case 5:
        {
            r = (v | 0);
            g = y;
            b = z;
            break;
        }
        default:
        {
            r = (v | 0);
            g = x;
            b = y;
            break;
        }
    }
    return (((a << 24) | (r << 16) | (g << 8) | (b)) | 0);
}
GameFramework.gfx.Color.Mult = function GameFramework_gfx_Color$Mult(theColor, theColorMult) {
    if(theColor == 0xffffffff) {
        return theColorMult;
    }
    if(theColorMult == 0xffffffff) {
        return theColor;
    }
    var aResult = (((((((theColor >>> 24) & 0xff) * ((theColorMult >>> 24) & 0xff)) / 255) | 0)) << 24) | (((((((theColor >>> 16) & 0xff) * ((theColorMult >>> 16) & 0xff)) / 255) | 0)) << 16) | (((((((theColor >>> 8) & 0xff) * ((theColorMult >>> 8) & 0xff)) / 255) | 0)) << 8) | ((((((theColor) & 0xff) * ((theColorMult) & 0xff)) / 255) | 0));
    return aResult;
}
GameFramework.gfx.Color.prototype = {
    mRed : 0,
    mGreen : 0,
    mBlue : 0,
    mAlpha : 0,
    ToInt : function GameFramework_gfx_Color$ToInt() {
        return GameFramework.gfx.Color.RGBAToInt(this.mRed, this.mGreen, this.mBlue, this.mAlpha);
    },
    Clone : function GameFramework_gfx_Color$Clone() {
        return new GameFramework.gfx.Color(this.mRed, this.mGreen, this.mBlue, this.mAlpha);
    }
}
GameFramework.gfx.Color.staticInit = function GameFramework_gfx_Color$staticInit() {
    GameFramework.gfx.Color.BLACK = new GameFramework.gfx.Color(0, 0, 0, 255);
    GameFramework.gfx.Color.WHITE = new GameFramework.gfx.Color(255, 255, 255, 255);
    GameFramework.gfx.Color.BLACK_RGB = GameFramework.gfx.Color.BLACK.ToInt();
    GameFramework.gfx.Color.WHITE_RGB = GameFramework.gfx.Color.WHITE.ToInt();
}

JS_AddInitFunc(function() {
    GameFramework.gfx.Color.registerClass('GameFramework.gfx.Color', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.gfx.Color.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\gfx\Color.cs
//LineMap:2=3 5=18 7=19 12=35 16=40 20=48 24=56 28=61 32=66 36=71 40=76 44=81 48=86 52=91 57=97 58=100 59=102 63=107 66=111 67=111 70=113 71=113 72=113 74=113 76=114 77=114 78=114 79=114 81=114 83=115 84=115 85=115 86=115 88=115 90=116 91=116 92=116 93=116 95=116 97=117 
//LineMap:98=117 99=117 100=117 102=117 104=118 105=118 106=118 107=118 109=118 111=119 112=119 113=119 114=119 119=125 125=132 126=137 135=25 147=12 
//Start:gfx\Graphics
GameFramework.gfx.ETextOverflowMode = {};
GameFramework.gfx.ETextOverflowMode.staticInit = function GameFramework_gfx_ETextOverflowMode$staticInit() {
    GameFramework.gfx.ETextOverflowMode.Draw = 0;
    GameFramework.gfx.ETextOverflowMode.Clip = 1;
    GameFramework.gfx.ETextOverflowMode.Wrap = 2;
    GameFramework.gfx.ETextOverflowMode.Ellipsis = 3;
}
JS_AddInitFunc(function() {
    GameFramework.gfx.ETextOverflowMode.staticInit();
});
/**
 * @constructor
 */
GameFramework.gfx.TriVertex = function GameFramework_gfx_TriVertex(theX, theY, theU, theV, theColor) {
    if(theX === undefined) {
        theX = 0;
    }
    if(theY === undefined) {
        theY = 0;
    }
    if(theU === undefined) {
        theU = 0;
    }
    if(theV === undefined) {
        theV = 0;
    }
    if(theColor === undefined) {
        theColor = 0xffffffff;
    }
    this.x = theX;
    this.y = theY;
    this.u = theU;
    this.v = theV;
    this.color = theColor;
}
GameFramework.gfx.TriVertex.prototype = {
    x : 0,
    y : 0,
    u : 0,
    v : 0,
    color : 0
}
GameFramework.gfx.TriVertex.staticInit = function GameFramework_gfx_TriVertex$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.gfx.TriVertex.registerClass('GameFramework.gfx.TriVertex', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.gfx.TriVertex.staticInit();
});
/**
 * @constructor
 */
GameFramework.gfx.Graphics = function GameFramework_gfx_Graphics(theWidth, theHeight) {
    this.mColorVector = [];
    this.mPushSetColor = [];
    this.mColorComponentVector = [];
    this.mTempMatrix = new GameFramework.geom.Matrix();
    this.mReserveMatrix = new GameFramework.geom.Matrix();
    this.mButtonPieces = {};
    this.mImageBoxPieces = {};
    this.mAutoPopMatrix = new GameFramework.misc.DisposeProxyStatic(ss.Delegate.create(this, this.PopMatrix));
    this.mAutoPopColor = new GameFramework.misc.DisposeProxyStatic(ss.Delegate.create(this, this.PopColor));
    this.mMatrixVector = [];
    this.mMatrix = new GameFramework.geom.Matrix();
    this.mMatrixDepth = 0;
    this.mScale = GameFramework.BaseApp.mApp.mArtRes / GameFramework.BaseApp.mApp.mHeight;
}
GameFramework.gfx.Graphics.WordWrapHelper = function GameFramework_gfx_Graphics$WordWrapHelper(g, theFont, theString, theX, theY, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData, theParseColorizers) {
    if(theWidth === undefined) {
        theWidth = 0;
    }
    if(theJustification === undefined) {
        theJustification = -1;
    }
    if(theTextOverflowMode === undefined) {
        theTextOverflowMode = GameFramework.gfx.ETextOverflowMode.Draw;
    }
    if(theLineSpacingOffset === undefined) {
        theLineSpacingOffset = 0;
    }
    if(theFontDrawData === undefined) {
        theFontDrawData = null;
    }
    if(theParseColorizers === undefined) {
        theParseColorizers = true;
    }
    var aCurPos = 0;
    var aLineStartPos = 0;
    var aCurWidth = 0;
    var aCurChar = 0;
    var aPrevChar = 0;
    var aSpacePos = -1;
    var aYOffset = 0;
    var aLineCount = 0;
    while(aCurPos < theString.length) {
        aCurChar = GameFramework.Utils.GetCharAt(theString, aCurPos);
        if(aCurChar == 94 && theParseColorizers) {
            if(aCurPos + 1 < theString.length) {
                if(theString.charCodeAt(aCurPos + 1) == 94) {
                    aCurPos++;
                } else {
                    aCurPos += 8;
                    continue;
                }
            }
        } else if(aCurChar == 32) {
            aSpacePos = aCurPos;
        } else if(aCurChar == 10) {
            aCurWidth = theWidth + 1;
            aSpacePos = aCurPos;
            aCurPos++;
        }
        aCurWidth += theFont.CharWidthKern(aCurChar, aPrevChar);
        aPrevChar = aCurChar;
        if(aCurWidth > theWidth) {
            aLineCount++;
            if(aSpacePos != -1) {
                if(g != null) {
                    g.DrawStringEx(theString.substr(aLineStartPos, aSpacePos - aLineStartPos), theX, theY + aYOffset, theWidth, theJustification);
                }
                aCurPos = aSpacePos + 1;
                if(aCurChar != 10) {
                    while(aCurPos < theString.length && GameFramework.Utils.GetCharAt(theString, aCurPos) == 32) {
                        aCurPos++;
                    }
                }
                aLineStartPos = aCurPos;
            }

            aLineStartPos = aCurPos;
            aSpacePos = -1;
            aCurWidth = 0;
            aPrevChar = 0;
            aYOffset += theFont.GetLineSpacing() + theLineSpacingOffset;
        } else {
            aCurPos++;
        }
    }
    if(aLineStartPos < theString.length) {
        if(g != null) {
            g.DrawStringEx(theString.substr(aLineStartPos), theX, theY + aYOffset, theWidth, theJustification);
        }
        aYOffset += theFont.GetLineSpacing() + theLineSpacingOffset;
    } else if(aCurChar == 10) {
    }
    if(theFontDrawData != null) {
        theFontDrawData.mFontAscent = theFont.GetAscent();
        theFontDrawData.mFontDescent = aYOffset - theFontDrawData.mFontAscent;
    }
}
GameFramework.gfx.Graphics.GetDrawStringData = function GameFramework_gfx_Graphics$GetDrawStringData(theString, theFont, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData) {
    if(theWidth === undefined) {
        theWidth = 0;
    }
    if(theJustification === undefined) {
        theJustification = -1;
    }
    if(theTextOverflowMode === undefined) {
        theTextOverflowMode = GameFramework.gfx.ETextOverflowMode.Draw;
    }
    if(theLineSpacingOffset === undefined) {
        theLineSpacingOffset = 0;
    }
    if(theFontDrawData === undefined) {
        theFontDrawData = null;
    }
    if(theTextOverflowMode == GameFramework.gfx.ETextOverflowMode.Draw) {
    } else if(theTextOverflowMode == GameFramework.gfx.ETextOverflowMode.Wrap) {
        GameFramework.gfx.Graphics.WordWrapHelper(null, theFont, theString, 0, 0, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData);
    }
}
GameFramework.gfx.Graphics.prototype = {
    mMatrixVector : null,
    mMatrix : null,
    mMatrixDepth : 0,
    mColorVector : null,
    mPushSetColor : null,
    mColorComponentVector : null,
    mColor : 0xffffffff,
    mScale : 1.0,
    mColorComponents : null,
    mFont : null,
    mTempMatrix : null,
    mReserveMatrix : null,
    mAutoPopMatrix : null,
    mAutoPopColor : null,
    mButtonPieces : null,
    mImageBoxPieces : null,
    GetSnappedX : function GameFramework_gfx_Graphics$GetSnappedX(theX) {
        var aScale = this.mMatrix.a * this.mScale;
        return ((((theX * aScale) | 0)) / aScale) + 0.00001;
    },
    GetSnappedY : function GameFramework_gfx_Graphics$GetSnappedY(theY) {
        var aScale = this.mMatrix.d * this.mScale;
        return ((((theY * aScale) | 0)) / aScale) + 0.00001;
    },
    Reset : function GameFramework_gfx_Graphics$Reset() {
        this.mColor = 0xffffffff;
        this.mMatrixDepth = 0;
        this.mMatrix.identity();
        this.mFont = null;
        this.mColorVector.clear();
    },
    GetMatrix : function GameFramework_gfx_Graphics$GetMatrix() {
        return this.mMatrix;
    },
    PushColor : function GameFramework_gfx_Graphics$PushColor(theColor) {
        if(theColor === undefined) {
            theColor = 0xffffffff;
        }
        if(this.mColorComponents != null) {
            return this.PushColorComponents(((this.mColor >>> 24) | 0) & 0xff, ((this.mColor >>> 16) | 0) & 0xff, ((this.mColor >>> 8) | 0) & 0xff, ((this.mColor >>> 0) | 0) & 0xff);
        } else {
            this.mColorVector.push(this.mColor);
            if(this.mColor == 0xffffffff) {
                this.mColor = theColor;
            } else {
                this.mColor = (((((((this.mColor >>> 24) & 0xff) * ((theColor >>> 24) & 0xff)) / 255) | 0)) << 24) | (((((((this.mColor >>> 16) & 0xff) * ((theColor >>> 16) & 0xff)) / 255) | 0)) << 16) | (((((((this.mColor >>> 8) & 0xff) * ((theColor >>> 8) & 0xff)) / 255) | 0)) << 8) | (((((((this.mColor >>> 0) & 0xff) * ((theColor >>> 0) & 0xff)) / 255) | 0)) << 0);
            }
            this.mPushSetColor.push(this.mColor);
            return this.mAutoPopColor;
        }
    },
    SetColor : function GameFramework_gfx_Graphics$SetColor(theColor) {
        if(this.mColorComponents != null) {
            if(this.mColorComponentVector.length == 0) {
                this.mColorComponents = Array.Create(4, 0, ((this.mColor >>> 24) | 0) & 0xff, ((this.mColor >>> 16) | 0) & 0xff, ((this.mColor >>> 8) | 0) & 0xff, ((this.mColor >>> 0) | 0) & 0xff);
            } else {
                var aPrevColorComponents = this.mColorComponentVector[this.mColorComponentVector.length - 1];
                this.mColorComponents[0] = (((aPrevColorComponents[0] * ((this.mColor >>> 24) | 0) & 0xff) / 255) | 0);
                this.mColorComponents[1] = (((aPrevColorComponents[1] * ((this.mColor >>> 16) | 0) & 0xff) / 255) | 0);
                this.mColorComponents[2] = (((aPrevColorComponents[2] * ((this.mColor >>> 8) | 0) & 0xff) / 255) | 0);
                this.mColorComponents[3] = (((aPrevColorComponents[3] * ((this.mColor) | 0) & 0xff) / 255) | 0);
            }
        } else {
            if((this.mColorVector.length == 0) || (this.mColorVector[this.mColorVector.length - 1] == 0xffffffff)) {
                this.mColor = theColor;
            } else {
                this.mColor = this.mColorVector[this.mColorVector.length - 1];
                this.mColor = (((((((this.mColor >>> 24) & 0xff) * ((theColor >>> 24) & 0xff)) / 255) | 0)) << 24) | (((((((this.mColor >>> 16) & 0xff) * ((theColor >>> 16) & 0xff)) / 255) | 0)) << 16) | (((((((this.mColor >>> 8) & 0xff) * ((theColor >>> 8) & 0xff)) / 255) | 0)) << 8) | (((((((this.mColor >>> 0) & 0xff) * ((theColor >>> 0) & 0xff)) / 255) | 0)) << 0);
            }
        }
    },
    UndoSetColor : function GameFramework_gfx_Graphics$UndoSetColor() {
        if(this.mPushSetColor.length > 0) {
            this.mColor = this.mPushSetColor[this.mPushSetColor.length - 1];
        } else {
            this.mColor = 0xffffffff;
        }
    },
    PushColorComponents : function GameFramework_gfx_Graphics$PushColorComponents(r, g, b, a) {
        if(this.mColorComponents == null) {
            this.mColorComponents = Array.Create(4, 0, r, g, b, a);
        } else {
            this.mColorComponentVector.push(this.mColorComponents);
            this.mColorComponents[0] = (((this.mColorComponents[0] * r) / 255) | 0);
            this.mColorComponents[1] = (((this.mColorComponents[1] * g) / 255) | 0);
            this.mColorComponents[2] = (((this.mColorComponents[2] * b) / 255) | 0);
            this.mColorComponents[3] = (((this.mColorComponents[3] * a) / 255) | 0);
        }
        return this.mAutoPopColor;
    },
    PopColor : function GameFramework_gfx_Graphics$PopColor() {
        if(this.mColorComponents != null) {
            if(this.mColorComponentVector.length == 0) {
                this.mColorComponents = null;
            } else {
                this.mColorComponents = this.mColorComponentVector.pop();
            }
        } else {
            this.mColor = this.mColorVector.pop();
            this.mPushSetColor.pop();
        }
    },
    PushTranslate : function GameFramework_gfx_Graphics$PushTranslate(theX, theY) {
        this.mMatrixVector[this.mMatrixDepth++] = this.mMatrix;
        var anOldMatrix = this.mMatrix;
        this.mMatrix = new GameFramework.geom.Matrix();
        this.mMatrix.translate(theX, theY);
        this.mMatrix.concat(anOldMatrix);
        return this.mAutoPopMatrix;
    },
    PushScale : function GameFramework_gfx_Graphics$PushScale(theScaleX, theScaleY, theX, theY) {
        this.mMatrixVector[this.mMatrixDepth++] = this.mMatrix;
        var anOldMatrix = this.mMatrix;
        this.mMatrix = new GameFramework.geom.Matrix();
        this.mMatrix.translate(-theX, -theY);
        this.mMatrix.scale(theScaleX, theScaleY);
        this.mMatrix.translate(theX, theY);
        if(this.mMatrixDepth != 1) {
            this.mMatrix.concat(anOldMatrix);
        }
        return this.mAutoPopMatrix;
    },
    PushMatrix : function GameFramework_gfx_Graphics$PushMatrix(theMatrix) {
        this.mMatrixVector[this.mMatrixDepth++] = this.mMatrix;
        var anOldMatrix = this.mMatrix;
        if(this.mReserveMatrix == null) {
            this.mMatrix = theMatrix.clone();
        } else if(theMatrix == this.mTempMatrix) {
            this.mMatrix = this.mTempMatrix;
            this.mTempMatrix = this.mReserveMatrix;
            this.mReserveMatrix = null;
        } else {
            this.mMatrix = this.mReserveMatrix;
            this.mMatrix.a = theMatrix.a;
            this.mMatrix.b = theMatrix.b;
            this.mMatrix.c = theMatrix.c;
            this.mMatrix.d = theMatrix.d;
            this.mMatrix.tx = theMatrix.tx;
            this.mMatrix.ty = theMatrix.ty;
            this.mReserveMatrix = null;
        }
        if(this.mMatrixDepth != 1) {
            this.mMatrix.concat(anOldMatrix);
        }
        return this.mAutoPopMatrix;
    },
    PopMatrix : function GameFramework_gfx_Graphics$PopMatrix() {
        this.mReserveMatrix = this.mMatrix;
        this.mMatrixDepth--;
        this.mMatrix = this.mMatrixVector[this.mMatrixDepth];
    },
    DrawImageCel : function GameFramework_gfx_Graphics$DrawImageCel(img, theX, theY, theCel) {
        if(this.mColorComponents != null) {
            var aPrevColor = this.mColor;
            var aR = this.mColorComponents[0];
            var aG = this.mColorComponents[1];
            var aB = this.mColorComponents[2];
            var aA = this.mColorComponents[3];
            var aR1 = ((Math.min(aR, 255)) | 0);
            var aG1 = ((Math.min(aG, 255)) | 0);
            var aB1 = ((Math.min(aB, 255)) | 0);
            var aA1 = ((Math.min(aA, 255)) | 0);
            this.mColor = (((aA1 << 24) | (aR1 << 16) | (aB1 << 8) | (aG1)) | 0);
            img.DrawEx(this, this.mMatrix, theX, theY, theCel);
            var aR2 = ((((aR * aA) - (aR1 * aA1)) / 255) | 0);
            var aG2 = ((((aG * aA) - (aG1 * aA1)) / 255) | 0);
            var aB2 = ((((aB * aA) - (aB1 * aA1)) / 255) | 0);
            if((aR2 != 0) || (aG2 != 0) || (aB2 != 0)) {
                this.mColor = (((0xff << 24) | (aR2 << 16) | (aB2 << 8) | (aG2)) | 0);
                var wasAdditive = img.get_Additive();
                img.set_Additive(true);
                img.DrawEx(this, this.mMatrix, theX, theY, theCel);
                img.set_Additive(wasAdditive);
            }
            this.mColor = aPrevColor;
        } else {
            img.DrawEx(this, this.mMatrix, theX, theY, theCel);
        }
    },
    DrawImage : function GameFramework_gfx_Graphics$DrawImage(img, theX, theY) {
        if(this.mColorComponents != null) {
            this.DrawImageCel(img, theX, theY, 0);
        } else {
            img.DrawEx(this, this.mMatrix, theX, theY, 0);
        }
    },
    DrawButton : function GameFramework_gfx_Graphics$DrawButton(theImage, theX, theY, theWidth, theCel) {
        if(theWidth == theImage.mWidth) {
            this.DrawImageCel(theImage, theX, theY, theCel);
            return;
        }
        var aCheckId = (theImage.mId << 10) + theCel;
        var aButtonPieces = this.mButtonPieces[aCheckId];
        if(aButtonPieces == null) {
            aButtonPieces = Array.Create(3, null, theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel));
            var anOrigWidth = aButtonPieces[0].mSrcWidth;
            var aChunkWidth = ((anOrigWidth / 3) | 0);
            var anOrigX = aButtonPieces[0].mSrcX;
            aButtonPieces[0].mSrcX = anOrigX;
            aButtonPieces[0].mSrcWidth = aChunkWidth;
            aButtonPieces[1].mSrcX = anOrigX + aChunkWidth;
            aButtonPieces[1].mSrcWidth = anOrigWidth - aChunkWidth * 2;
            aButtonPieces[2].mSrcX = anOrigX + anOrigWidth - aChunkWidth;
            aButtonPieces[2].mSrcWidth = aChunkWidth;

            {
                var $srcArray1 = aButtonPieces;
                for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
                    var anImageInst = $srcArray1[$enum1];
                    if(!GameFramework.BaseApp.mApp.get_Is3D()) {
                        anImageInst.mPixelSnapping = GameFramework.resources.PixelSnapping.Always;
                        anImageInst.mSizeSnapping = true;
                    } else {
                        anImageInst.mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
                    }
                    anImageInst.Prepare();
                }
            }
            this.mButtonPieces[aCheckId] = aButtonPieces;
        }
        var aLogChunkWidth = aButtonPieces[2].mSrcWidth / this.mScale;
        this.DrawImage(aButtonPieces[0], theX, theY);
        this.PushScale((theWidth - aLogChunkWidth * 2) / (aButtonPieces[1].mSrcWidth / this.mScale), 1.0, theX + aLogChunkWidth, theY);
        this.DrawImage(aButtonPieces[1], theX + aLogChunkWidth, theY);
        this.PopMatrix();
        this.DrawImage(aButtonPieces[2], theX + theWidth - aLogChunkWidth, theY);
    },
    DrawImageBox : function GameFramework_gfx_Graphics$DrawImageBox(theImage, theX, theY, theWidth, theHeight, theCel) {
        var aCheckId = (theImage.mId << 10) + theCel;
        var aButtonPieces = this.mImageBoxPieces[aCheckId];
        if(aButtonPieces == null) {
            aButtonPieces = Array.Create(9, null, theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel));
            var anOrigWidth = aButtonPieces[0].mSrcWidth;
            var anOrigHeight = aButtonPieces[0].mSrcHeight;
            var aChunkWidth = ((anOrigWidth / 3) | 0);
            var aChunkHeight = ((anOrigHeight / 3) | 0);
            var anOrigX = aButtonPieces[0].mSrcX;
            var anOrigY = aButtonPieces[0].mSrcY;
            aButtonPieces[0].mSrcX = anOrigX;
            aButtonPieces[0].mSrcWidth = aChunkWidth;
            aButtonPieces[0].mSrcY = anOrigY;
            aButtonPieces[0].mSrcHeight = aChunkHeight;
            aButtonPieces[1].mSrcX = anOrigX + aChunkWidth;
            aButtonPieces[1].mSrcWidth = anOrigWidth - aChunkWidth * 2;
            aButtonPieces[1].mSrcY = anOrigY;
            aButtonPieces[1].mSrcHeight = aChunkHeight;
            aButtonPieces[2].mSrcX = anOrigX + anOrigWidth - aChunkWidth;
            aButtonPieces[2].mSrcWidth = aChunkWidth;
            aButtonPieces[2].mSrcY = anOrigY;
            aButtonPieces[2].mSrcHeight = aChunkHeight;
            aButtonPieces[3].mSrcX = anOrigX;
            aButtonPieces[3].mSrcWidth = aChunkWidth;
            aButtonPieces[3].mSrcY = anOrigY + aChunkHeight;
            aButtonPieces[3].mSrcHeight = anOrigHeight - aChunkHeight * 2;
            aButtonPieces[4].mSrcX = anOrigX + aChunkWidth;
            aButtonPieces[4].mSrcWidth = anOrigWidth - aChunkWidth * 2;
            aButtonPieces[4].mSrcY = anOrigY + aChunkHeight;
            aButtonPieces[4].mSrcHeight = anOrigHeight - aChunkHeight * 2;
            aButtonPieces[5].mSrcX = anOrigX + anOrigWidth - aChunkWidth;
            aButtonPieces[5].mSrcWidth = aChunkWidth;
            aButtonPieces[5].mSrcY = anOrigY + aChunkHeight;
            aButtonPieces[5].mSrcHeight = anOrigHeight - aChunkHeight * 2;
            aButtonPieces[6].mSrcX = anOrigX;
            aButtonPieces[6].mSrcWidth = aChunkWidth;
            aButtonPieces[6].mSrcY = anOrigY + anOrigHeight - aChunkHeight;
            aButtonPieces[6].mSrcHeight = aChunkHeight;
            aButtonPieces[7].mSrcX = anOrigX + aChunkWidth;
            aButtonPieces[7].mSrcWidth = anOrigWidth - aChunkWidth * 2;
            aButtonPieces[7].mSrcY = anOrigY + anOrigHeight - aChunkHeight;
            aButtonPieces[7].mSrcHeight = aChunkHeight;
            aButtonPieces[8].mSrcX = anOrigX + anOrigWidth - aChunkWidth;
            aButtonPieces[8].mSrcWidth = aChunkWidth;
            aButtonPieces[8].mSrcY = anOrigY + anOrigHeight - aChunkHeight;
            aButtonPieces[8].mSrcHeight = aChunkHeight;

            {
                var $srcArray2 = aButtonPieces;
                for(var $enum2 = 0; $enum2 < $srcArray2.length; $enum2++) {
                    var anImageInst = $srcArray2[$enum2];
                    if(!GameFramework.BaseApp.mApp.get_Is3D()) {
                        anImageInst.mPixelSnapping = GameFramework.resources.PixelSnapping.Always;
                        anImageInst.mSizeSnapping = true;
                    } else {
                        anImageInst.mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
                    }
                    anImageInst.Prepare();
                }
            }
            this.mImageBoxPieces[aCheckId] = aButtonPieces;
        }
        var aLogChunkWidth = aButtonPieces[0].mSrcWidth / this.mScale;
        var aLogChunkHeight = aButtonPieces[0].mSrcHeight / this.mScale;
        var aRepeatX = 1.0;
        var aRepeatY = 1.0;
        var hasVertCenter = theHeight > aLogChunkHeight * 2;
        var hasHorzCenter = theWidth > aLogChunkWidth * 2;
        this.DrawImage(aButtonPieces[0], theX, theY);
        if(hasHorzCenter) {
            this.PushScale((theWidth - aLogChunkWidth * 2) / (aButtonPieces[1].mSrcWidth / this.mScale), 1.0, theX + aLogChunkWidth, theY);
            aButtonPieces[1].mRepeatX = aRepeatX;
            this.DrawImage(aButtonPieces[1], theX + aLogChunkWidth, theY);
            this.PopMatrix();
        }
        this.DrawImage(aButtonPieces[2], theX + theWidth - aLogChunkWidth, theY);
        if(hasVertCenter) {
            this.PushScale(1.0, (theHeight - aLogChunkHeight * 2) / (aButtonPieces[3].mSrcHeight / this.mScale), theX, theY + aLogChunkHeight);
            aButtonPieces[3].mRepeatY = aRepeatY;
            this.DrawImage(aButtonPieces[3], theX, theY + aLogChunkHeight);
            this.PopMatrix();
            if(hasHorzCenter) {
                this.PushScale((theWidth - aLogChunkWidth * 2) / (aButtonPieces[7].mSrcWidth / this.mScale), (theHeight - aLogChunkHeight * 2) / (aButtonPieces[4].mSrcHeight / this.mScale), theX + aLogChunkWidth, theY + aLogChunkHeight);
                aButtonPieces[4].mRepeatX = aRepeatX;
                aButtonPieces[4].mRepeatY = aRepeatY;
                this.DrawImage(aButtonPieces[4], theX + aLogChunkWidth, theY + aLogChunkHeight);
                this.PopMatrix();
            }
            this.PushScale(1.0, (theHeight - aLogChunkHeight * 2) / (aButtonPieces[5].mSrcHeight / this.mScale), theX + theWidth - aLogChunkWidth, theY + aLogChunkHeight);
            aButtonPieces[5].mRepeatY = aRepeatY;
            this.DrawImage(aButtonPieces[5], theX + theWidth - aLogChunkWidth, theY + aLogChunkHeight);
            this.PopMatrix();
        }
        this.DrawImage(aButtonPieces[6], theX, theY + theHeight - aLogChunkHeight);
        if(hasHorzCenter) {
            this.PushScale((theWidth - aLogChunkWidth * 2) / (aButtonPieces[7].mSrcWidth / this.mScale), 1.0, theX + aLogChunkWidth, theY + theHeight - aLogChunkHeight);
            aButtonPieces[7].mRepeatX = aRepeatX;
            this.DrawImage(aButtonPieces[7], theX + aLogChunkWidth, theY + theHeight - aLogChunkHeight);
            this.PopMatrix();
        }
        this.DrawImage(aButtonPieces[8], theX + theWidth - aLogChunkWidth, theY + theHeight - aLogChunkHeight);
    },
    FillRect : function GameFramework_gfx_Graphics$FillRect(x, y, w, h) {
        var aNewMatrix = new GameFramework.geom.Matrix();
        aNewMatrix.tx = x;
        aNewMatrix.ty = y;
        aNewMatrix.a = w;
        aNewMatrix.d = h;
        aNewMatrix.concat(this.mMatrix);
    },
    SetFont : function GameFramework_gfx_Graphics$SetFont(theFont) {
        this.mFont = theFont;
    },
    GetFont : function GameFramework_gfx_Graphics$GetFont() {
        return this.mFont;
    },
    DrawStringCentered : function GameFramework_gfx_Graphics$DrawStringCentered(theString, theX, theY) {
        this.DrawStringEx(theString, theX, theY, 0, 0);
    },
    DrawString : function GameFramework_gfx_Graphics$DrawString(theString, theX, theY) {
        this.mFont.Draw(this, theString, theX, theY);
    },
    DrawStringEx : function GameFramework_gfx_Graphics$DrawStringEx(theString, theX, theY, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData) {
        if(theWidth === undefined) {
            theWidth = 0;
        }
        if(theJustification === undefined) {
            theJustification = -1;
        }
        if(theTextOverflowMode === undefined) {
            theTextOverflowMode = GameFramework.gfx.ETextOverflowMode.Draw;
        }
        if(theLineSpacingOffset === undefined) {
            theLineSpacingOffset = 0;
        }
        if(theFontDrawData === undefined) {
            theFontDrawData = null;
        }
        if(theTextOverflowMode != GameFramework.gfx.ETextOverflowMode.Wrap) {
            var aCurPos = 0;
            for(; ;) {
                var aBrPos = theString.indexOf(String.fromCharCode(10), aCurPos);
                if(aBrPos == -1) {
                    if(aCurPos != 0) {
                        theString = theString.substr(aCurPos);
                    }
                    break;
                }
                this.DrawStringEx(theString.substr(aCurPos, aBrPos - aCurPos), theX, theY, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData);
                theY += this.mFont.GetLineSpacing() + theLineSpacingOffset;
                aCurPos = aBrPos + 1;
            }
        }
        if(theTextOverflowMode == GameFramework.gfx.ETextOverflowMode.Draw) {
            if(theJustification == 0) {
                theX += (theWidth - this.mFont.StringWidth(theString)) / 2.0;
            } else if(theJustification == 1) {
                theX += (theWidth - this.mFont.StringWidth(theString));
            }
            this.mFont.Draw(this, theString, theX, theY);
        } else if(theTextOverflowMode == GameFramework.gfx.ETextOverflowMode.Wrap) {
            GameFramework.gfx.Graphics.WordWrapHelper(this, this.mFont, theString, theX, theY, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData);
        }
    },
    StringWidth : function GameFramework_gfx_Graphics$StringWidth(theString) {
        return this.mFont.StringWidth(theString);
    },
    AddRect : function GameFramework_gfx_Graphics$AddRect(x, y, w, h, color) {
    },
    PolyFill : function GameFramework_gfx_Graphics$PolyFill(thePoints) {
    },
    DrawTrianglesTex : function GameFramework_gfx_Graphics$DrawTrianglesTex(theImage, theVertices) {
    },
    BeginFrame : function GameFramework_gfx_Graphics$BeginFrame() {
    },
    EndFrame : function GameFramework_gfx_Graphics$EndFrame() {
    },
    Begin3DScene : function GameFramework_gfx_Graphics$Begin3DScene(theViewMatrix, theWorldMatrix, theProjectionMatrix) {
        if(theViewMatrix === undefined) {
            theViewMatrix = null;
        }
        if(theWorldMatrix === undefined) {
            theWorldMatrix = null;
        }
        if(theProjectionMatrix === undefined) {
            theProjectionMatrix = null;
        }
        return null;
    },
    End3DScene : function GameFramework_gfx_Graphics$End3DScene(theGraphics3D) {
    }
}
GameFramework.gfx.Graphics.staticInit = function GameFramework_gfx_Graphics$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.gfx.Graphics.registerClass('GameFramework.gfx.Graphics', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.gfx.Graphics.staticInit();
});
/**
 * @constructor
 */
GameFramework.gfx.Graphics3D = function GameFramework_gfx_Graphics3D(theGraphics) {
    this.mGraphics = theGraphics;
}
GameFramework.gfx.Graphics3D.prototype = {
    mGraphics : null,
    Dispose : function GameFramework_gfx_Graphics3D$Dispose() {
        this.mGraphics.End3DScene(this);
    },
    Setup2DDrawing : function GameFramework_gfx_Graphics3D$Setup2DDrawing(theDrawDepth) {
        if(theDrawDepth === undefined) {
            theDrawDepth = 0.0;
        }
    },
    End2DDrawing : function GameFramework_gfx_Graphics3D$End2DDrawing() {
    },
    SetViewTransform : function GameFramework_gfx_Graphics3D$SetViewTransform(theTransform) {
    },
    SetProjectionTransform : function GameFramework_gfx_Graphics3D$SetProjectionTransform(theTransform) {
    },
    SetWorldTransform : function GameFramework_gfx_Graphics3D$SetWorldTransform(theTransform) {
    },
    SetTexture : function GameFramework_gfx_Graphics3D$SetTexture(inTextureIndex, inImage) {
        return false;
    },
    SetTextureWrap : function GameFramework_gfx_Graphics3D$SetTextureWrap(inTextureIndex, inWrap) {
        if(inWrap === undefined) {
            inWrap = true;
        }
    },
    SetTextureWrapUV : function GameFramework_gfx_Graphics3D$SetTextureWrapUV(inTextureIndex, inWrapU, inWrapV) {
        if(inWrapU === undefined) {
            inWrapU = true;
        }
        if(inWrapV === undefined) {
            inWrapV = true;
        }
    },
    SetBlend : function GameFramework_gfx_Graphics3D$SetBlend(theSrcBlend, theDestBlend) {
    },
    SetBackfaceCulling : function GameFramework_gfx_Graphics3D$SetBackfaceCulling(cullClockwise, cullCounterClockwise) {
    },
    SetDepthState : function GameFramework_gfx_Graphics3D$SetDepthState(theDepthCompare, depthWriteEnable) {
    },
    ClearDepthBuffer : function GameFramework_gfx_Graphics3D$ClearDepthBuffer() {
    },
    RenderMesh : function GameFramework_gfx_Graphics3D$RenderMesh(theMeshResource) {
    }
}
GameFramework.gfx.Graphics3D.staticInit = function GameFramework_gfx_Graphics3D$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.gfx.Graphics3D.registerClass('GameFramework.gfx.Graphics3D', null, System.IDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.gfx.Graphics3D.staticInit();
});
GameFramework.gfx.Graphics3D.ECompareFunc = {};
GameFramework.gfx.Graphics3D.ECompareFunc.staticInit = function GameFramework_gfx_Graphics3D_ECompareFunc$staticInit() {
    GameFramework.gfx.Graphics3D.ECompareFunc.Never = 1;
    GameFramework.gfx.Graphics3D.ECompareFunc.Less = 2;
    GameFramework.gfx.Graphics3D.ECompareFunc.Equal = 3;
    GameFramework.gfx.Graphics3D.ECompareFunc.LessEqual = 4;
    GameFramework.gfx.Graphics3D.ECompareFunc.Greater = 5;
    GameFramework.gfx.Graphics3D.ECompareFunc.GreaterEqual = 6;
    GameFramework.gfx.Graphics3D.ECompareFunc.Always = 7;
}
JS_AddInitFunc(function() {
    GameFramework.gfx.Graphics3D.ECompareFunc.staticInit();
});
GameFramework.gfx.Graphics3D.EBlend = {};
GameFramework.gfx.Graphics3D.EBlend.staticInit = function GameFramework_gfx_Graphics3D_EBlend$staticInit() {
    GameFramework.gfx.Graphics3D.EBlend.Zero = 1;
    GameFramework.gfx.Graphics3D.EBlend.One = 2;
    GameFramework.gfx.Graphics3D.EBlend.SrcColor = 3;
    GameFramework.gfx.Graphics3D.EBlend.InvSrcColor = 4;
    GameFramework.gfx.Graphics3D.EBlend.SrcAlpha = 5;
    GameFramework.gfx.Graphics3D.EBlend.InvSrcAlpha = 6;
    GameFramework.gfx.Graphics3D.EBlend.DestAlpha = 7;
    GameFramework.gfx.Graphics3D.EBlend.InvDestAlpha = 8;
    GameFramework.gfx.Graphics3D.EBlend.DestColor = 9;
    GameFramework.gfx.Graphics3D.EBlend.InvDestColor = 10;
    GameFramework.gfx.Graphics3D.EBlend.SrcAlphaSat = 11;
    GameFramework.gfx.Graphics3D.EBlend.Default = 0xffff;
}
JS_AddInitFunc(function() {
    GameFramework.gfx.Graphics3D.EBlend.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\gfx\Graphics.cs
//LineMap:2=3 5=11 14=26 16=25 17=25 18=25 19=25 20=25 21=27 41=35 44=72 46=41 49=51 51=56 53=73 60=563 62=563 63=563 64=563 65=563 66=563 67=563 68=565 74=573 76=576 79=580 85=587 87=588 92=589 93=594 94=594 96=597 100=602 102=605 105=610 107=613 109=620 121=650 129=657 
//LineMap:131=660 137=664 140=697 146=704 148=704 149=704 150=704 151=704 152=704 153=706 156=707 158=712 169=44 170=46 180=59 192=81 203=94 208=97 209=99 216=105 219=109 221=110 223=116 239=131 249=140 251=143 253=144 259=154 276=170 282=177 297=191 332=227 336=232 
//LineMap:338=233 359=300 364=306 368=311 374=318 385=330 389=333 407=352 408=354 409=356 412=360 415=364 421=371 423=371 427=373 434=379 440=386 441=388 451=399 452=401 455=408 461=415 473=428 485=441 497=454 499=454 503=456 510=462 516=469 518=483 520=487 522=490 531=500 
//LineMap:550=520 571=543 591=716 593=716 594=716 595=716 596=716 597=716 598=718 610=731 615=737 619=742 622=743 624=747 637=770 655=786 656=786 657=786 658=788 671=796 674=829 676=830 682=833 689=838 692=843 715=864 718=868 720=868 721=868 724=872 750=798 753=800 765=811 
//LineMap:776=823 
//Start:gfx\IDrawable

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\gfx\IDrawable.cs
//LineMap:2=3 
//Start:gfx\OffsetDrawable
/**
 * @constructor
 */
GameFramework.gfx.OffsetDrawable = function GameFramework_gfx_OffsetDrawable(theDrawable, theOffsetX, theOffsetY) {
    this.mDrawable = theDrawable;
    this.mOffsetX = theOffsetX;
    this.mOffsetY = theOffsetY;
}
GameFramework.gfx.OffsetDrawable.prototype = {
    mDrawable : null,
    mOffsetX : 0,
    mOffsetY : 0,
    get_Additive : function GameFramework_gfx_OffsetDrawable$get_Additive() {
        return this.mDrawable.get_Additive();
    },
    set_Additive : function GameFramework_gfx_OffsetDrawable$set_Additive(value) {
        this.mDrawable.set_Additive(value);
    },
    DrawEx : function GameFramework_gfx_OffsetDrawable$DrawEx(g, theMatrix, theX, theY, theCel) {
        this.mDrawable.DrawEx(g, theMatrix, theX + this.mOffsetX, theY + this.mOffsetY, theCel);
    }
}
GameFramework.gfx.OffsetDrawable.staticInit = function GameFramework_gfx_OffsetDrawable$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.gfx.OffsetDrawable.registerClass('GameFramework.gfx.OffsetDrawable', null, GameFramework.gfx.IDrawable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.gfx.OffsetDrawable.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\gfx\OffsetDrawable.cs
//LineMap:2=3 5=17 7=18 17=14 19=14 22=14 24=14 28=23 
//Start:gfx\PerspectiveCamera
/**
 * @constructor
 */
GameFramework.gfx.PerspectiveCamera = function GameFramework_gfx_PerspectiveCamera(inFovDegrees, inAspectRatio, inZNear, inZFar) {
    if(inFovDegrees === undefined) {
        inFovDegrees = 0;
    }
    if(inAspectRatio === undefined) {
        inAspectRatio = 0;
    }
    if(inZNear === undefined) {
        inZNear = 1.0;
    }
    if(inZFar === undefined) {
        inZFar = 10000.0;
    }
    GameFramework.gfx.PerspectiveCamera.initializeBase(this);
    if(inFovDegrees == 0) {
        this.mProjS = new GameFramework.geom.Vector3(0, 0, 0);
        this.mProjT = 0;
    } else {
        this.Init(inFovDegrees, inAspectRatio, inZNear, inZFar);
    }
}
GameFramework.gfx.PerspectiveCamera.prototype = {
    mProjS : null,
    mProjT : 0,
    Init : function GameFramework_gfx_PerspectiveCamera$Init(inFovDegrees, inAspectRatio, inZNear, inZFar) {
        if(inZNear === undefined) {
            inZNear = 1.0;
        }
        if(inZFar === undefined) {
            inZFar = 10000.0;
        }
        var aAngleX = (inFovDegrees * 0.5) * Math.PI / 180.0;
        var aAngleY = aAngleX / inAspectRatio;
        this.mProjS.y = Math.cos(aAngleY) / Math.sin(aAngleY);
        this.mProjS.x = this.mProjS.y / inAspectRatio;
        this.mProjS.z = inZFar / (inZFar - inZNear);
        this.mProjT = -this.mProjS.z * inZNear;
        this.mZNear = inZNear;
        this.mZFar = inZFar;
    },
    GetProjectionMatrix : function GameFramework_gfx_PerspectiveCamera$GetProjectionMatrix(outM) {
        if(outM == null) {
            return;
        }
        outM.Identity();
        outM.m[outM.m.mIdxMult0 * (0) + 0] = this.mProjS.x;
        outM.m[outM.m.mIdxMult0 * (1) + 1] = this.mProjS.y;
        outM.m[outM.m.mIdxMult0 * (2) + 2] = this.mProjS.z;
        outM.m[outM.m.mIdxMult0 * (2) + 3] = 1.0;
        outM.m[outM.m.mIdxMult0 * (3) + 2] = this.mProjT;
        outM.m[outM.m.mIdxMult0 * (3) + 3] = 0.0;
    },
    IsOrtho : function GameFramework_gfx_PerspectiveCamera$IsOrtho() {
        return false;
    },
    IsPerspective : function GameFramework_gfx_PerspectiveCamera$IsPerspective() {
        return true;
    },
    EyeToScreen : function GameFramework_gfx_PerspectiveCamera$EyeToScreen(inEyePos) {
        var aResult = new GameFramework.geom.Vector3();
        var negZ = -inEyePos.z;
        aResult.x = inEyePos.x * this.mProjS.x / negZ;
        aResult.y = inEyePos.y * this.mProjS.y / negZ;
        aResult.z = (negZ * this.mProjS.z + this.mProjT) / this.mZFar;
        aResult.x = (aResult.x * 0.5) + 0.5;
        aResult.y = (aResult.y * -0.5) + 0.5;
        return aResult;
    }
}
GameFramework.gfx.PerspectiveCamera.staticInit = function GameFramework_gfx_PerspectiveCamera$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.gfx.PerspectiveCamera.registerClass('GameFramework.gfx.PerspectiveCamera', GameFramework.gfx.Camera);
});
JS_AddStaticInitFunc(function() {
    GameFramework.gfx.PerspectiveCamera.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\gfx\PerspectiveCamera.cs
//LineMap:2=10 5=22 7=21 8=21 9=21 10=21 19=29 26=32 28=32 29=32 30=34 32=37 36=42 44=52 45=54 55=62 58=63 60=63 63=65 70=74 72=77 
//Start:gfx\TransformedDrawable
/**
 * @constructor
 */
GameFramework.gfx.TransformedDrawable = function GameFramework_gfx_TransformedDrawable(theDrawable, theMatrix) {
    this.mDrawable = theDrawable;
    this.mMatrix = theMatrix;
}
GameFramework.gfx.TransformedDrawable.prototype = {
    mDrawable : null,
    mMatrix : null,
    get_Additive : function GameFramework_gfx_TransformedDrawable$get_Additive() {
        return this.mDrawable.get_Additive();
    },
    set_Additive : function GameFramework_gfx_TransformedDrawable$set_Additive(value) {
        this.mDrawable.set_Additive(value);
    },
    DrawEx : function GameFramework_gfx_TransformedDrawable$DrawEx(g, theMatrix, theX, theY, theCel) {
        var aNewMatrix = this.mMatrix.clone();
        aNewMatrix.tx += theX;
        aNewMatrix.ty += theY;
        aNewMatrix.concat(theMatrix);
        this.mDrawable.DrawEx(g, aNewMatrix, 0, 0, theCel);
    }
}
GameFramework.gfx.TransformedDrawable.staticInit = function GameFramework_gfx_TransformedDrawable$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.gfx.TransformedDrawable.registerClass('GameFramework.gfx.TransformedDrawable', null, GameFramework.gfx.IDrawable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.gfx.TransformedDrawable.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\gfx\TransformedDrawable.cs
//LineMap:2=3 5=16 7=17 15=13 17=13 20=13 22=13 26=21 
//Start:misc\Bezier
GameFramework.misc = Type.registerNamespace('GameFramework.misc');
/**
 * @constructor
 */
GameFramework.misc.Bezier = function GameFramework_misc_Bezier() {
}
GameFramework.misc.Bezier.prototype = {
    mTimes : null,
    mLengths : null,
    mTotalLength : 0,
    mCount : 0,
    mControls : null,
    mPositions : null,
    IsInitialized : function GameFramework_misc_Bezier$IsInitialized() {
        return this.mCount > 0;
    },
    GetTotalLength : function GameFramework_misc_Bezier$GetTotalLength() {
        return this.mTotalLength;
    },
    GetNumPoints : function GameFramework_misc_Bezier$GetNumPoints() {
        return this.mCount;
    },
    Distance : function GameFramework_misc_Bezier$Distance(p1x, p1y, p2x, p2y, sqrt) {
        if(sqrt === undefined) {
            sqrt = true;
        }
        var x = p2x - p1x;
        var y = p2y - p1y;
        var val = x * x + y * y;
        return sqrt ? Math.sqrt(val) : val;
    },
    Clean : function GameFramework_misc_Bezier$Clean() {
        this.mTimes = null;
        this.mLengths = null;
        this.mControls = null;
        this.mPositions = null;
        this.mCount = 0;
        this.mTotalLength = 0;
    },
    InitWithControls : function GameFramework_misc_Bezier$InitWithControls(positions, controls, times) {
        if(this.mCount != 0) {
            return false;
        }
        var count = positions.length;
        if((count < 2) || (positions == null) || (times == null) || (controls == null)) {
            return false;
        }
        this.mPositions = Array.Create(count, null);
        this.mControls = Array.Create(2 * (count - 1), null);
        this.mTimes = Array.Create(count, null);
        this.mCount = count;
        for(var i = 0; i < count; ++i) {
            this.mPositions[i] = positions[i];
            this.mTimes[i] = times[i];
        }
        for(var i_2 = 0; i_2 < 2 * (count - 1); ++i_2) {
            this.mControls[i_2] = controls[i_2];
        }
        this.mLengths = Array.Create(count - 1, null);
        this.mTotalLength = 0.0;
        for(var i_3 = 0; i_3 < count - 1; ++i_3) {
            this.mLengths[i_3] = this.SegmentArcLength(i_3, 0.0, 1.0);
            this.mTotalLength += this.mLengths[i_3];
        }
        return true;
    },
    Init : function GameFramework_misc_Bezier$Init(positions, times) {
        if(this.mCount != 0) {
            return false;
        }
        var count = positions.length;
        if((count < 2) || (positions == null) || (times == null)) {
            return false;
        }
        this.mPositions = Array.Create(count, null);
        this.mControls = Array.Create(2 * (count - 1), null);
        this.mTimes = Array.Create(count, null);
        this.mCount = count;
        for(var i = 0; i < count; ++i) {
            this.mPositions[i] = positions[i];
            this.mTimes[i] = times[i];
        }
        for(var i_2 = 0; i_2 < count - 1; ++i_2) {
            if(i_2 > 0) {
                var aPoint = this.mPositions[i_2 + 1].subtract(this.mPositions[i_2 - 1]);
                aPoint.x /= 3.0;
                aPoint.y /= 3.0;
                this.mControls[2 * i_2] = this.mPositions[i_2].add(aPoint);
            }
            if(i_2 < count - 2) {
                var aPoint_2 = this.mPositions[i_2 + 2].subtract(this.mPositions[i_2]);
                aPoint_2.x /= 3.0;
                aPoint_2.y /= 3.0;
                this.mControls[2 * i_2 + 1] = this.mPositions[i_2 + 1].subtract(aPoint_2);
            }
        }
        var aPt2 = this.mPositions[1].subtract(this.mPositions[0]);
        aPt2.x /= 3.0;
        aPt2.y /= 3.0;
        this.mControls[0] = this.mControls[1].subtract(aPt2);
        var aPt3 = this.mPositions[count - 1].subtract(this.mPositions[count - 2]);
        aPt3.x /= 3.0;
        aPt3.y /= 3.0;
        this.mControls[2 * count - 3] = this.mControls[2 * count - 4].add(aPt3);
        this.mLengths = Array.Create(count - 1, null);
        this.mTotalLength = 0.0;
        for(var i_3 = 0; i_3 < count - 1; ++i_3) {
            this.mLengths[i_3] = this.SegmentArcLength(i_3, 0.0, 1.0);
            this.mTotalLength += this.mLengths[i_3];
        }
        return true;
    },
    Evaluate : function GameFramework_misc_Bezier$Evaluate(t) {
        if(this.mCount < 2) {
            return new GameFramework.geom.TPoint(0, 0);
        }
        if(t <= this.mTimes[0]) {
            return this.mPositions[0];
        } else if(t >= this.mTimes[this.mCount - 1]) {
            return this.mPositions[this.mCount - 1];
        }
        var i = 0;
        for(i = 0; i < this.mCount - 1; ++i) {
            if(t < this.mTimes[i + 1]) {
                break;
            }
        }
        var t0 = this.mTimes[i];
        var t1 = this.mTimes[i + 1];
        var u = (t - t0) / (t1 - t0);
        var AX = this.mPositions[i + 1].x - this.mControls[2 * i + 1].x * 3.0 + this.mControls[2 * i].x * 3.0 - this.mPositions[i].x;
        var AY = this.mPositions[i + 1].y - this.mControls[2 * i + 1].y * 3.0 + this.mControls[2 * i].y * 3.0 - this.mPositions[i].y;
        var BX = this.mControls[2 * i + 1].x * 3.0 - this.mControls[2 * i].x * 6.0 + this.mPositions[i].x * 3.0;
        var BY = this.mControls[2 * i + 1].y * 3.0 - this.mControls[2 * i].y * 6.0 + this.mPositions[i].y * 3.0;
        var CX = this.mControls[2 * i].x * 3.0 - this.mPositions[i].x * 3.0;
        var CY = this.mControls[2 * i].y * 3.0 - this.mPositions[i].y * 3.0;
        return new GameFramework.geom.TPoint(this.mPositions[i].x + (CX + (BX + AX * u) * u) * u, this.mPositions[i].y + (CY + (BY + AY * u) * u) * u);
    },
    Velocity : function GameFramework_misc_Bezier$Velocity(t, clamp) {
        if(this.mCount < 2) {
            return new GameFramework.geom.TPoint(0, 0);
        }
        if(t <= this.mTimes[0]) {
            if(!clamp) {
                return new GameFramework.geom.TPoint(0, 0);
            }
            return this.mPositions[0];
        } else if(t >= this.mTimes[this.mCount - 1]) {
            if(!clamp) {
                return new GameFramework.geom.TPoint(0, 0);
            }
            return this.mPositions[this.mCount - 1];
        }
        var i;
        for(i = 0; i < this.mCount - 1; ++i) {
            if(t < this.mTimes[i + 1]) {
                break;
            }
        }
        var t0 = this.mTimes[i];
        var t1 = this.mTimes[i + 1];
        var u = (t - t0) / (t1 - t0);
        var AX = this.mPositions[i + 1].x - this.mControls[2 * i + 1].x * 3.0 + this.mControls[2 * i].x * 3.0 - this.mPositions[i].x;
        var AY = this.mPositions[i + 1].y - this.mControls[2 * i + 1].y * 3.0 + this.mControls[2 * i].y * 3.0 - this.mPositions[i].y;
        var BX = this.mControls[2 * i + 1].x * 6.0 - this.mControls[2 * i].x * 12.0 + this.mPositions[i].x * 6.0;
        var BY = this.mControls[2 * i + 1].y * 6.0 - this.mControls[2 * i].y * 12.0 + this.mPositions[i].y * 6.0;
        var CX = this.mControls[2 * i].x * 3.0 - this.mPositions[i].x * 3.0;
        var CY = this.mControls[2 * i].y * 3.0 - this.mPositions[i].y * 3.0;
        return new GameFramework.geom.TPoint(CX + (BX + AX * u * 3.0) * u, CY + (BY + AY * u * 3.0) * u);
    },
    Acceleration : function GameFramework_misc_Bezier$Acceleration(t) {
        if(this.mCount < 2) {
            return new GameFramework.geom.TPoint(0, 0);
        }
        if(t <= this.mTimes[0]) {
            return this.mPositions[0];
        } else if(t >= this.mTimes[this.mCount - 1]) {
            return this.mPositions[this.mCount - 1];
        }
        var i;
        for(i = 0; i < this.mCount - 1; ++i) {
            if(t < this.mTimes[i + 1]) {
                break;
            }
        }
        var t0 = this.mTimes[i];
        var t1 = this.mTimes[i + 1];
        var u = (t - t0) / (t1 - t0);
        var AX = this.mPositions[i + 1].x - this.mControls[2 * i + 1].x * 3.0 + this.mControls[2 * i].x * 3.0 - this.mPositions[i].x;
        var AY = this.mPositions[i + 1].y - this.mControls[2 * i + 1].y * 3.0 + this.mControls[2 * i].y * 3.0 - this.mPositions[i].y;
        var BX = this.mControls[2 * i + 1].x * 6.0 - this.mControls[2 * i].x * 12.0 + this.mPositions[i].x * 6.0;
        var BY = this.mControls[2 * i + 1].y * 6.0 - this.mControls[2 * i].y * 12.0 + this.mPositions[i].y * 6.0;
        return new GameFramework.geom.TPoint(BX + AX * u * 6.0, BY + AY * u * 6.0);
    },
    ArcLength : function GameFramework_misc_Bezier$ArcLength(t1, t2) {
        if(t2 <= t1) {
            return 0.0;
        }
        if(t1 < this.mTimes[0]) {
            t1 = this.mTimes[0];
        }
        if(t2 > this.mTimes[this.mCount - 1]) {
            t2 = this.mTimes[this.mCount - 1];
        }
        var seg1;
        for(seg1 = 0; seg1 < this.mCount - 1; ++seg1) {
            if(t1 < this.mTimes[seg1 + 1]) {
                break;
            }
        }
        var u1 = (t1 - this.mTimes[seg1]) / (this.mTimes[seg1 + 1] - this.mTimes[seg1]);
        var seg2;
        for(seg2 = 0; seg2 < this.mCount - 1; ++seg2) {
            if(t2 <= this.mTimes[seg2 + 1]) {
                break;
            }
        }
        var u2 = (t2 - this.mTimes[seg2]) / (this.mTimes[seg2 + 1] - this.mTimes[seg2]);
        var result;
        if(seg1 == seg2) {
            result = this.SegmentArcLength(seg1, u1, u2);
        } else {
            result = this.SegmentArcLength(seg1, u1, 1.0);
            for(var i = seg1 + 1; i < seg2; ++i) {
                result += this.mLengths[i];
            }
            result += this.SegmentArcLength(seg2, 0.0, u2);
        }
        return result;
    },
    SegmentArcLength : function GameFramework_misc_Bezier$SegmentArcLength(i, u1, u2) {
        if(u2 <= u1) {
            return 0.0;
        }
        if(u1 < 0.0) {
            u1 = 0.0;
        }
        if(u2 > 1.0) {
            u2 = 1.0;
        }
        var P0 = this.mPositions[i];
        var P1 = this.mControls[2 * i];
        var P2 = this.mControls[2 * i + 1];
        var P3 = this.mPositions[i + 1];
        var minus_u2 = (1.0 - u2);
        var L1X = P0.x * minus_u2 + P1.x * u2;
        var L1Y = P0.y * minus_u2 + P1.y * u2;
        var HX = P1.x * minus_u2 + P2.x * u2;
        var HY = P1.y * minus_u2 + P2.y * u2;
        var L2X = L1X * minus_u2 + HX * u2;
        var L2Y = L1Y * minus_u2 + HY * u2;
        var L3X = L2X * minus_u2 + (HX * minus_u2 + (P2.x * minus_u2 + P3.x * u2) * u2) * u2;
        var L3Y = L2Y * minus_u2 + (HY * minus_u2 + (P2.y * minus_u2 + P3.y * u2) * u2) * u2;
        var minus_u1 = (1.0 - u1);
        HX = L1X * minus_u1 + L2X * u1;
        HY = L1Y * minus_u1 + L2Y * u1;
        var R3X = L3X;
        var R3Y = L3Y;
        var R2X = L2X * minus_u1 + L3X * u1;
        var R2Y = L2Y * minus_u1 + L3Y * u1;
        var R1X = HX * minus_u1 + R2X * u1;
        var R1Y = HY * minus_u1 + R2Y * u1;
        var R0X = ((P0.x * minus_u1 + L1X * u1) * minus_u1 + HX * u1) * minus_u1 + R1X * u1;
        var R0Y = ((P0.y * minus_u1 + L1Y * u1) * minus_u1 + HY * u1) * minus_u1 + R1Y * u1;
        return this.SubdivideLength(R0X, R0Y, R1X, R1Y, R2X, R2Y, R3X, R3Y);
    },
    SubdivideLength : function GameFramework_misc_Bezier$SubdivideLength(P0X, P0Y, P1X, P1Y, P2X, P2Y, P3X, P3Y) {
        var Lmin = this.Distance(P0X, P0Y, P3X, P3Y);
        var Lmax = this.Distance(P0X, P0Y, P1X, P1Y) + this.Distance(P1X, P1Y, P2X, P2Y) + this.Distance(P2X, P2Y, P3X, P3Y);
        var diff = Lmin - Lmax;
        if(diff * diff < 0.001) {
            return 0.5 * (Lmin + Lmax);
        }
        var L1X = (P0X + P1X) * 0.5;
        var L1Y = (P0Y + P1Y) * 0.5;
        var HX = (P1X + P2X) * 0.5;
        var HY = (P1Y + P2Y) * 0.5;
        var L2X = (L1X + HX) * 0.5;
        var L2Y = (L1Y + HY) * 0.5;
        var R2X = (P2X + P3X) * 0.5;
        var R2Y = (P2Y + P3Y) * 0.5;
        var R1X = (HX + R2X) * 0.5;
        var R1Y = (HY + R2Y) * 0.5;
        var midX = (L2X + R1X) * 0.5;
        var midY = (L2Y + R1Y) * 0.5;
        return this.SubdivideLength(P0X, P0Y, L1X, L1Y, L2X, L2Y, midX, midY) + this.SubdivideLength(midX, midY, R1X, R1Y, R2X, R2Y, P3X, P3Y);
    }
}
GameFramework.misc.Bezier.staticInit = function GameFramework_misc_Bezier$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.misc.Bezier.registerClass('GameFramework.misc.Bezier', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.misc.Bezier.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\misc\Bezier.cs
//LineMap:2=9 3=39 6=40 14=14 18=19 20=19 23=20 25=20 28=21 30=21 33=31 35=31 36=33 42=43 48=50 54=57 56=60 57=63 59=67 63=73 68=80 70=84 77=92 80=96 82=99 84=102 85=105 87=109 91=115 96=122 113=140 117=145 121=151 128=159 133=166 135=170 137=173 138=176 144=183 147=193 
//LineMap:149=196 151=199 153=207 156=212 158=215 160=219 166=223 168=227 172=233 178=240 181=251 187=258 190=263 192=266 194=270 196=273 197=276 203=283 206=293 210=298 213=303 217=308 219=311 221=315 227=322 228=325 234=332 235=334 236=336 238=339 243=345 245=348 250=355 
//LineMap:252=358 254=361 256=364 260=388 269=399 280=412 283=417 285=420 288=424 290=428 302=442 
//Start:misc\BSpline
/**
 * @constructor
 */
GameFramework.misc.BSpline = function GameFramework_misc_BSpline() {
    this.Reset();
}
GameFramework.misc.BSpline.prototype = {
    mXPoints : null,
    mYPoints : null,
    mArcLengths : null,
    mXCoef : null,
    mYCoef : null,
    eqs : null,
    sol : null,
    mRowSize : 0,
    mCurRow : 0,
    Reset : function GameFramework_misc_BSpline$Reset() {
        this.mXPoints = [];
        this.mYPoints = [];
        this.mArcLengths = [];
        this.mXCoef = [];
        this.mYCoef = [];
    },
    AddPoint : function GameFramework_misc_BSpline$AddPoint(x, y) {
        this.mXPoints.push(x);
        this.mYPoints.push(y);
    },
    CalcArcLengths : function GameFramework_misc_BSpline$CalcArcLengths() {
        this.mArcLengths = [];
        var numCurves = (this.mXPoints.length | 0) - 1;
        for(var i = 0; i < numCurves; i++) {
            var x1 = (this.mXPoints[i]);
            var y1 = (this.mYPoints[i]);
            var x2 = (this.mXPoints[i + 1]);
            var y2 = (this.mYPoints[i + 1]);
            var aLength = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            this.mArcLengths.push(aLength);
        }
    },
    GetNextPoint : function GameFramework_misc_BSpline$GetNextPoint(theVals) {
        var t = theVals[2];
        var anIndex = (Math.floor(t) | 0);
        if(anIndex < 0 || anIndex >= (this.mXPoints.length | 0) - 1) {
            theVals[0] = this.GetXPoint(t);
            theVals[1] = this.GetYPoint(t);
            return false;
        }
        var aLength = 1 / (this.mArcLengths[anIndex] * 100);
        var ox = this.GetXPoint(t);
        var oy = this.GetYPoint(t);
        var nt = t;
        var nx;
        var ny;
        while(true) {
            nt += aLength;
            nx = this.GetXPoint(nt);
            ny = this.GetYPoint(nt);
            var dist = (nx - ox) * (nx - ox) + (ny - oy) * (ny - oy);
            if(dist >= 1.0) {
                break;
            }
            if(nt > this.mXPoints.length - 1) {
                break;
            }
        }
        theVals[0] = nx;
        theVals[1] = ny;
        theVals[2] = nt;
        return true;
    },
    GetMaxT : function GameFramework_misc_BSpline$GetMaxT() {
        return (this.mXPoints.length | 0) - 1;
    },
    EquationSystem_Init : function GameFramework_misc_BSpline$EquationSystem_Init(theNumVariables, theSol) {
        this.mRowSize = theNumVariables + 1;
        this.mCurRow = 0;
        this.eqs = [];
        for(var anEqNum = 0; anEqNum < this.mRowSize * theNumVariables; anEqNum++) {
            this.eqs.push(0.0);
        }
        this.sol = theSol;
        for(var aSols = 0; aSols < theNumVariables; aSols++) {
            this.sol.push(0.0);
        }
    },
    EquationSystem_SetCoefficientAtRow : function GameFramework_misc_BSpline$EquationSystem_SetCoefficientAtRow(theRow, theCol, theValue) {
        var anIndex = this.mRowSize * theRow + theCol;
        this.eqs[anIndex] = theValue;
    },
    EquationSystem_SetCoefficient : function GameFramework_misc_BSpline$EquationSystem_SetCoefficient(theCol, theValue) {
        this.EquationSystem_SetCoefficientAtRow(this.mCurRow, theCol, theValue);
    },
    EquationSystem_SetConstantTerm : function GameFramework_misc_BSpline$EquationSystem_SetConstantTerm(theValue) {
        this.EquationSystem_SetConstantTermAtRow(this.mCurRow, theValue);
    },
    EquationSystem_SetConstantTermAtRow : function GameFramework_misc_BSpline$EquationSystem_SetConstantTermAtRow(theRow, theValue) {
        var anIndex = this.mRowSize * theRow + this.mRowSize - 1;
        this.eqs[anIndex] = theValue;
    },
    EquationSystem_NextEquation : function GameFramework_misc_BSpline$EquationSystem_NextEquation() {
        this.mCurRow++;
    },
    EquationSystem_Solve : function GameFramework_misc_BSpline$EquationSystem_Solve() {
        var i;
        var j;
        var k;
        var max;
        var r;
        var N;
        var temp;
        r = this.mRowSize;
        N = this.mRowSize - 1;
        for(i = 0; i < N; i++) {
            max = i;
            for(j = i + 1; j < N; j++) {
                if(Math.abs((this.eqs[j * r + i])) > Math.abs((this.eqs[max * r + i]))) {
                    max = j;
                }
            }
            for(k = 0; k < N + 1; k++) {
                var swap = (this.eqs[i * r + k]);
                this.eqs[i * r + k] = this.eqs[max * r + k];
                this.eqs[max * r + k] = swap;
            }
            for(j = i + 1; j < N; j++) {
                var mult = (this.eqs[j * r + i]) / (this.eqs[i * r + i]);
                if(mult == 0) {
                    continue;
                }
                for(k = N; k >= i; k--) {
                    this.eqs[j * r + k] = (this.eqs[j * r + k]) - (this.eqs[i * r + k]) * mult;
                }
            }
        }
        for(j = N - 1; j >= 0; j--) {
            temp = 0;
            for(k = j + 1; k < N; k++) {
                temp += (this.eqs[j * r + k]) * (this.sol[k]);
            }
            this.sol[j] = ((this.eqs[j * r + N]) - temp) / (this.eqs[j * r + j]);
        }
    },
    CalculateSplinePrv : function GameFramework_misc_BSpline$CalculateSplinePrv(thePoints, theCoef) {
        if(thePoints.length < 2) {
            return;
        }
        var numCurves = (thePoints.length | 0) - 1;
        var numVariables = numCurves * 4;
        var i;
        this.EquationSystem_Init(numVariables, theCoef);
        this.EquationSystem_SetCoefficient(2, 1);
        this.EquationSystem_NextEquation();
        var c = 0;
        for(i = 0; i < numCurves; i++, c += 4) {
            this.EquationSystem_SetCoefficient(c + 3, 1);
            this.EquationSystem_SetConstantTerm((thePoints[i]));
            this.EquationSystem_NextEquation();
            this.EquationSystem_SetCoefficient(c, 1);
            this.EquationSystem_SetCoefficient(c + 1, 1);
            this.EquationSystem_SetCoefficient(c + 2, 1);
            this.EquationSystem_SetConstantTerm((thePoints[i + 1]) - (thePoints[i]));
            this.EquationSystem_NextEquation();
            this.EquationSystem_SetCoefficient(c, 3);
            this.EquationSystem_SetCoefficient(c + 1, 2);
            this.EquationSystem_SetCoefficient(c + 2, 1);
            if(i < numCurves - 1) {
                this.EquationSystem_SetCoefficient(c + 6, -1);
            }
            this.EquationSystem_NextEquation();
            if(i < numCurves - 1) {
                this.EquationSystem_SetCoefficient(c, 6);
                this.EquationSystem_SetCoefficient(c + 1, 2);
                this.EquationSystem_SetCoefficient(c + 5, -2);
                this.EquationSystem_NextEquation();
            }
        }
        this.EquationSystem_Solve();
    },
    CalculateSplinePrvSemiLinear : function GameFramework_misc_BSpline$CalculateSplinePrvSemiLinear(thePoints, theCoef) {
        if(thePoints.length < 2) {
            return;
        }
        var numCurves = (thePoints.length | 0) - 1;
        var i;
        var aNewPoints = [];
        var p1;
        var p2;
        for(i = 0; i < numCurves; i++) {
            var mix = (this.mArcLengths[i]);
            if(mix <= 100) {
                mix = 1;
            } else {
                mix = 100 / mix;
            }
            mix = 0.3;
            p1 = (thePoints[i]);
            p2 = (thePoints[i + 1]);
            if(i > 0) {
                aNewPoints.push(mix * p2 + (1 - mix) * p1);
            } else {
                aNewPoints.push(p1);
            }
            if(i < numCurves - 1) {
                aNewPoints.push(mix * p1 + (1 - mix) * p2);
            } else {
                aNewPoints.push(p2);
            }
        }
        thePoints = aNewPoints;
        numCurves = (aNewPoints.length | 0) - 1;
        for(i = 0; i < numCurves; i++) {
            p1 = (aNewPoints[i]);
            p2 = (aNewPoints[i + 1]);
            var c = i * 4;
            if(((i & 1) != 0) && (i < numCurves - 1)) {
                var p0 = (aNewPoints[i - 1]);
                var p3 = (aNewPoints[i + 2]);
                var A;
                var B;
                var C;
                var D;
                D = p1;
                C = p1 - p0;
                A = -2 * (p2 - 2 * p1 + p0) - C + (p3 - p2);
                B = -A + p2 - 2 * p1 + p0;
                theCoef.push(A);
                theCoef.push(B);
                theCoef.push(C);
                theCoef.push(D);
            } else {
                theCoef.push(0.0);
                theCoef.push(0.0);
                theCoef.push(p2 - p1);
                theCoef.push(p1);
            }
        }
    },
    CalculateSplinePrvLinear : function GameFramework_misc_BSpline$CalculateSplinePrvLinear(thePoints, theCoef) {
        if(thePoints.length < 2) {
            return;
        }
        var numCurves = (thePoints.length | 0) - 1;
        for(var i = 0; i < numCurves; i++) {
            var c = i * 4;
            var p1 = (thePoints[i]);
            var p2 = (thePoints[i + 1]);
            theCoef.push(0.0);
            theCoef.push(0.0);
            theCoef.push(p2 - p1);
            theCoef.push(p1);
        }
    },
    CalculateSpline : function GameFramework_misc_BSpline$CalculateSpline(linear) {
        this.CalcArcLengths();
        if(linear) {
            this.CalculateSplinePrvLinear(this.mXPoints, this.mXCoef);
            this.CalculateSplinePrvLinear(this.mYPoints, this.mYCoef);
        } else {
            this.CalculateSplinePrv(this.mXPoints, this.mXCoef);
            this.CalculateSplinePrv(this.mYPoints, this.mYCoef);
        }
        this.CalcArcLengths();
    },
    GetPoint : function GameFramework_misc_BSpline$GetPoint(t, theCoef) {
        var anIndex = (Math.floor(t) | 0);
        if(anIndex < 0) {
            anIndex = 0;
            t = 0;
        } else if(anIndex >= (this.mXPoints.length | 0) - 1) {
            anIndex = (this.mXPoints.length | 0) - 2;
            t = anIndex + 1;
        }
        var s = t - anIndex;
        anIndex *= 4;
        var A = (theCoef[anIndex]);
        var B = (theCoef[anIndex + 1]);
        var C = (theCoef[anIndex + 2]);
        var D = (theCoef[anIndex + 3]);
        var s2 = s * s;
        var s3 = s2 * s;
        return A * s3 + B * s2 + C * s + D;
    },
    GetXPoint : function GameFramework_misc_BSpline$GetXPoint(t) {
        return this.GetPoint(t, this.mXCoef);
    },
    GetYPoint : function GameFramework_misc_BSpline$GetYPoint(t) {
        return this.GetPoint(t, this.mYCoef);
    }
}
GameFramework.misc.BSpline.staticInit = function GameFramework_misc_BSpline$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.misc.BSpline.registerClass('GameFramework.misc.BSpline', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.misc.BSpline.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\misc\BSpline.cs
//LineMap:2=3 5=14 7=15 21=18 39=37 44=43 46=46 61=62 67=69 72=75 75=79 78=83 84=94 86=94 89=96 96=104 137=146 139=152 141=155 145=161 151=169 156=175 160=181 165=187 173=196 175=199 176=202 177=205 179=208 182=212 185=217 190=224 195=230 196=233 211=249 212=251 216=258 
//LineMap:223=266 224=268 230=275 236=283 237=285 241=290 242=292 250=301 254=306 262=313 270=322 274=327 275=329 278=333 280=336 287=344 298=354 312=366 314=370 317=374 319=377 325=384 
//Start:misc\CurveCacheRecord
/**
 * @constructor
 */
GameFramework.misc.CurveCacheRecord = function GameFramework_misc_CurveCacheRecord() {
}
GameFramework.misc.CurveCacheRecord.prototype = {
    mTable : null,
    mHermiteCurve : null,
    mDataStr : null
}
GameFramework.misc.CurveCacheRecord.staticInit = function GameFramework_misc_CurveCacheRecord$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.misc.CurveCacheRecord.registerClass('GameFramework.misc.CurveCacheRecord', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.misc.CurveCacheRecord.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\misc\CurveCacheRecord.cs
//LineMap:2=3 
//Start:misc\CurveValDataPoint
/**
 * @constructor
 */
GameFramework.misc.CurveValDataPoint = function GameFramework_misc_CurveValDataPoint() {
}
GameFramework.misc.CurveValDataPoint.prototype = {
    mX : 0,
    mY : 0,
    mAngleDeg : 0
}
GameFramework.misc.CurveValDataPoint.staticInit = function GameFramework_misc_CurveValDataPoint$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.misc.CurveValDataPoint.registerClass('GameFramework.misc.CurveValDataPoint', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.misc.CurveValDataPoint.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\misc\CurveValDataPoint.cs
//LineMap:2=3 
//Start:misc\DisposeProxy
/**
 * @constructor
 */
GameFramework.misc.DisposeProxy = function GameFramework_misc_DisposeProxy(theProxyCall) {
    this.mProxyCall = theProxyCall;
}
GameFramework.misc.DisposeProxy.prototype = {
    mProxyCall : null,
    Dispose : function GameFramework_misc_DisposeProxy$Dispose() {
        this.mProxyCall.invoke();
    }
}
GameFramework.misc.DisposeProxy.staticInit = function GameFramework_misc_DisposeProxy$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.misc.DisposeProxy.registerClass('GameFramework.misc.DisposeProxy', null, System.IDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.misc.DisposeProxy.staticInit();
});
/**
 * @constructor
 */
GameFramework.misc.DisposeProxyStatic = function GameFramework_misc_DisposeProxyStatic(theProxyCall) {
    this.mProxyCall = theProxyCall;
}
GameFramework.misc.DisposeProxyStatic.prototype = {
    mProxyCall : null,
    Dispose : function GameFramework_misc_DisposeProxyStatic$Dispose() {
        this.mProxyCall.invoke();
    }
}
GameFramework.misc.DisposeProxyStatic.staticInit = function GameFramework_misc_DisposeProxyStatic$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.misc.DisposeProxyStatic.registerClass('GameFramework.misc.DisposeProxyStatic', null, GameFramework.IStaticDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.misc.DisposeProxyStatic.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\misc\DisposeProxy.cs
//LineMap:2=3 5=19 7=20 13=31 24=37 27=49 29=50 35=61 
//Start:misc\ISimpleDictionary

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\misc\ISimpleDictionary.cs
//LineMap:2=3 
//Start:misc\JSONString
/**
 * @constructor
 */
GameFramework.misc.JSONString = function GameFramework_misc_JSONString(theString) {
    this.mString = theString;
}
GameFramework.misc.JSONString.prototype = {
    mString : null
}
GameFramework.misc.JSONString.staticInit = function GameFramework_misc_JSONString$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.misc.JSONString.registerClass('GameFramework.misc.JSONString', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.misc.JSONString.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\misc\JSONString.cs
//LineMap:2=3 5=10 7=11 
//Start:misc\Key1
/**
 * @constructor
 */
GameFramework.misc.Key1 = function GameFramework_misc_Key1(theKey) {
    GameFramework.misc.Key1.initializeBase(this, [theKey, 1]);
}
GameFramework.misc.Key1.prototype = {

}
GameFramework.misc.Key1.staticInit = function GameFramework_misc_Key1$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.misc.Key1.registerClass('GameFramework.misc.Key1', GameFramework.misc.KeyVal);
});
JS_AddStaticInitFunc(function() {
    GameFramework.misc.Key1.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\misc\Key1.cs
//LineMap:2=3 5=8 7=7 
//Start:misc\KeyVal
/**
 * @constructor
 */
GameFramework.misc.KeyVal = function GameFramework_misc_KeyVal(theKey, theValue) {
    this.mKey = theKey;
    this.mValue = theValue;
}
GameFramework.misc.KeyVal.prototype = {
    mKey : null,
    mValue : null
}
GameFramework.misc.KeyVal.staticInit = function GameFramework_misc_KeyVal$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.misc.KeyVal.registerClass('GameFramework.misc.KeyVal', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.misc.KeyVal.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\misc\KeyVal.cs
//LineMap:2=3 5=11 7=12 
//Start:misc\SexyMathHermite
/**
 * @constructor
 */
GameFramework.misc.SexyMathHermite = function GameFramework_misc_SexyMathHermite() {
    this.mPoints = [];
    this.mPieces = [];
}
GameFramework.misc.SexyMathHermite.prototype = {
    mIsBuilt : null,
    mPoints : null,
    mPieces : null,
    Rebuild : function GameFramework_misc_SexyMathHermite$Rebuild() {
        this.mIsBuilt = false;
    },
    Evaluate : function GameFramework_misc_SexyMathHermite$Evaluate(inX) {
        if(!this.mIsBuilt) {
            if(!this.BuildCurve()) {
                return (0.0);
            }
            this.mIsBuilt = true;
        }
        var pieceCount = this.mPieces.length;
        for(var i = 0; i < pieceCount; i++) {
            var aPoints = Type.safeCast(this.mPoints[i + 1], Array);
            if(inX < aPoints[0]) {
                return this.EvaluatePiece(inX, i, Type.safeCast(this.mPieces[i], Array));
            }
        }
        var aResult = Type.safeCast(this.mPoints[this.mPoints.length - 1], Array);
        return aResult[1];
    },
    CreatePiece : function GameFramework_misc_SexyMathHermite$CreatePiece(thePtIdx, outPiece) {
        var q = Array.Create(GameFramework.misc.SexyMathHermite.dim * GameFramework.misc.SexyMathHermite.dim, null);
        var z = Array.Create(GameFramework.misc.SexyMathHermite.dim, null);
        var i;
        for(i = 0; i <= 1; i++) {
            var anInPoint = Type.safeCast(this.mPoints[thePtIdx + i], Array);
            var i2 = 2 * i;
            z[i2] = anInPoint[0];
            z[i2 + 1] = anInPoint[0];
            q[i2] = anInPoint[1];
            q[i2 + 1] = anInPoint[1];
            q[i2 + 1 + (1 * GameFramework.misc.SexyMathHermite.dim)] = anInPoint[2];
            if(i != 0) {
                q[i2 + (1 * GameFramework.misc.SexyMathHermite.dim)] = (q[i2] - q[i2 - 1]) / (z[i2] - z[i2 - 1]);
            }
        }
        for(i = 2; i < GameFramework.misc.SexyMathHermite.dim; i++) {
            for(var j = 2; j <= i; j++) {
                q[i + (j * GameFramework.misc.SexyMathHermite.dim)] = (q[i + (j - 1) * GameFramework.misc.SexyMathHermite.dim] - q[i - 1 + (j - 1) * GameFramework.misc.SexyMathHermite.dim]) / (z[i] - z[i - j]);
            }
        }
        for(i = 0; i < GameFramework.misc.SexyMathHermite.dim; i++) {
            outPiece[i] = q[i + i * GameFramework.misc.SexyMathHermite.dim];
        }
    },
    EvaluatePiece : function GameFramework_misc_SexyMathHermite$EvaluatePiece(inX, thePtIdx, inPiece) {
        var xSub = Array.Create(2, null);
        xSub[0] = inX - (Type.safeCast((this.mPoints[thePtIdx + 0]), Array))[0];
        xSub[1] = inX - (Type.safeCast((this.mPoints[thePtIdx + 1]), Array))[0];
        var f = 1.0;
        var h = inPiece[0];
        for(var i = 1; i < GameFramework.misc.SexyMathHermite.dim; i++) {
            f *= xSub[(((((i - 1) / 2) | 0)) | 0)];
            h += f * inPiece[i];
        }
        return h;
    },
    BuildCurve : function GameFramework_misc_SexyMathHermite$BuildCurve() {
        this.mPieces.clear();
        var pointCount = this.mPoints.length;
        if(pointCount < 2) {
            return false;
        }
        var pieceCount = pointCount - 1;
        var i;
        for(i = 0; i < pieceCount; i++) {
            this.mPieces.push(Array.Create(4, null));
        }
        for(i = 0; i < pieceCount; i++) {
            this.CreatePiece(i, Type.safeCast((this.mPieces[i]), Array));
        }
        return true;
    },
    AddPoint : function GameFramework_misc_SexyMathHermite$AddPoint(theX, theFx, theFxPrime) {
        this.mPoints.push(Array.Create(3, null, theX, theFx, theFxPrime));
    }
}
GameFramework.misc.SexyMathHermite.staticInit = function GameFramework_misc_SexyMathHermite$staticInit() {
    GameFramework.misc.SexyMathHermite.dim = 4;
}

JS_AddInitFunc(function() {
    GameFramework.misc.SexyMathHermite.registerClass('GameFramework.misc.SexyMathHermite', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.misc.SexyMathHermite.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\misc\SexyMathHermite.cs
//LineMap:2=3 7=9 16=12 29=27 40=39 44=45 48=50 64=68 70=75 73=80 105=38 
//Start:misc\TMapSorter
/**
 * @constructor
 */
GameFramework.misc.TMapSorter = function GameFramework_misc_TMapSorter(theDict, theCompareCallback) {
    this.mDict = theDict;
    this.mCompareCallback = theCompareCallback;
}
GameFramework.misc.TMapSorter.prototype = {
    mCompareCallback : null,
    mDict : null,
    Compare : function GameFramework_misc_TMapSorter$Compare(x, y) {
        return this.mCompareCallback.invoke(this.mDict.InternalGet(x), this.mDict.InternalGet(y));
    }
}
GameFramework.misc.TMapSorter.staticInit = function GameFramework_misc_TMapSorter$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.misc.TMapSorter.registerClass('GameFramework.misc.TMapSorter', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.misc.TMapSorter.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\misc\TMapSorter.cs
//LineMap:2=3 5=20 7=21 15=25 
//Start:resources\BaseRes
GameFramework.resources = Type.registerNamespace('GameFramework.resources');
/**
 * @constructor
 */
GameFramework.resources.BaseRes = function GameFramework_resources_BaseRes() {
}
GameFramework.resources.BaseRes.prototype = {
    mType : 0,
    mId : null,
    mPath : null,
    mParent : null,
    mGroup : null,
    mCols : 1,
    mRows : 1,
    mOffsetX : 0,
    mOffsetY : 0,
    mNumSamples : 0,
    mOrigWidth : 0,
    mOrigHeight : 0,
    mWidth : 0,
    mHeight : 0,
    mTags : null,
    mChildren : null,
    mExtensions : null,
    mRTParent : null,
    mAtlasX : 0,
    mAtlasY : 0,
    mAtlasWidth : 0,
    mAtlasHeight : 0,
    mAtlasRTX : 0,
    mAtlasRTY : 0,
    mAtlasRTFlags : 0,
    mIsRuntimeImage : null,
    mIsNotRuntimeImage : null,
    mRTChildCount : 0,
    mRTChildLoadedCount : 0,
    mDisposableResource : null
}
GameFramework.resources.BaseRes.staticInit = function GameFramework_resources_BaseRes$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.BaseRes.registerClass('GameFramework.resources.BaseRes', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.BaseRes.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\BaseRes.cs
//LineMap:2=3 16=12 
//Start:resources\FontCharData
/**
 * @constructor
 */
GameFramework.resources.FontCharData = function GameFramework_resources_FontCharData() {
}
GameFramework.resources.FontCharData.prototype = {
    mChar : 0,
    mRectX : 0,
    mRectY : 0,
    mRectWidth : 0,
    mRectHeight : 0,
    mOffsetX : 0,
    mOffsetY : 0,
    mKerningFirst : 0,
    mKerningCount : 0,
    mWidth : 0,
    mOrder : 0,
    mImageInst : null
}
GameFramework.resources.FontCharData.staticInit = function GameFramework_resources_FontCharData$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.FontCharData.registerClass('GameFramework.resources.FontCharData', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.FontCharData.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\FontCharData.cs
//LineMap:2=3 
//Start:resources\FontDrawCmd
/**
 * @constructor
 */
GameFramework.resources.FontDrawCmd = function GameFramework_resources_FontDrawCmd() {
}
GameFramework.resources.FontDrawCmd.prototype = {
    mCharData : null,
    mFontLayer : null,
    mXOfs : 0,
    mYOfs : 0,
    mColor : 0
}
GameFramework.resources.FontDrawCmd.staticInit = function GameFramework_resources_FontDrawCmd$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.FontDrawCmd.registerClass('GameFramework.resources.FontDrawCmd', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.FontDrawCmd.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\FontDrawCmd.cs
//LineMap:2=3 
//Start:resources\FontDrawData
/**
 * @constructor
 */
GameFramework.resources.FontDrawData = function GameFramework_resources_FontDrawData() {
}
GameFramework.resources.FontDrawData.prototype = {
    mFirstDraw : true,
    mMinDrawX : 0,
    mMinDrawY : 0,
    mMaxDrawX : 0,
    mMaxDrawY : 0,
    mFontMinRelX : 0,
    mFontMinRelY : 0,
    mFontAscent : 0,
    mFontDescent : 0
}
GameFramework.resources.FontDrawData.staticInit = function GameFramework_resources_FontDrawData$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.FontDrawData.registerClass('GameFramework.resources.FontDrawData', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.FontDrawData.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\FontDrawData.cs
//LineMap:2=8 10=10 
//Start:resources\FontLayer
/**
 * @constructor
 */
GameFramework.resources.FontLayer = function GameFramework_resources_FontLayer() {
    this.mRequiredTags = [];
    this.mExcludedTags = [];
    this.mCharHashtable = {};
}
GameFramework.resources.FontLayer.prototype = {
    mLayerName : null,
    mRequiredTags : null,
    mExcludedTags : null,
    mKerningData : null,
    mColorAdd : 0,
    mColorMult : 0,
    mDrawMode : 0,
    mOfsX : 0,
    mOfsY : 0,
    mSpacing : 0,
    mMinPointSize : 0,
    mMaxPointSize : 0,
    mPointSize : 0,
    mAscent : 0,
    mAscentPadding : 0,
    mHeight : 0,
    mDefaultHeight : 0,
    mLineSpacingOffset : 0,
    mBaseOrder : 0,
    mImage : null,
    mColorVector : null,
    mCharHashtable : null,
    ImageLoaded : function GameFramework_resources_FontLayer$ImageLoaded(e) {
        var aResourceStreamer = e.target;
        if(aResourceStreamer.mId != null) {
            this.mImage = GameFramework.BaseApp.mApp.mResourceManager.GetImageResourceById(aResourceStreamer.mId);
        } else {
            this.mImage = aResourceStreamer.mResultData;
        }

        {
            for($enum1 in this.mCharHashtable) {
                var aFontCharaData = this.mCharHashtable[$enum1];
                aFontCharaData.mImageInst = this.mImage.CreateImageInstRect(aFontCharaData.mRectX, aFontCharaData.mRectY, aFontCharaData.mRectWidth, aFontCharaData.mRectHeight);
            }
        }
    },
    PushColor : function GameFramework_resources_FontLayer$PushColor(theColor) {
        if(this.mColorVector == null) {
            this.mColorVector = [];
        }
        this.mColorVector.push(this.mColorMult);
        this.mColorMult = (((((((this.mColorMult >>> 24) & 0xff) * ((theColor >>> 24) & 0xff)) / 255) | 0)) << 24) | (((((((this.mColorMult >>> 16) & 0xff) * ((theColor >>> 16) & 0xff)) / 255) | 0)) << 16) | (((((((this.mColorMult >>> 8) & 0xff) * ((theColor >>> 8) & 0xff)) / 255) | 0)) << 8) | (((((((this.mColorMult >>> 0) & 0xff) * ((theColor >>> 0) & 0xff)) / 255) | 0)) << 0);
    },
    PopColor : function GameFramework_resources_FontLayer$PopColor() {
        this.mColorMult = ((this.mColorVector.pop()) | 0);
    }
}
GameFramework.resources.FontLayer.staticInit = function GameFramework_resources_FontLayer$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.FontLayer.registerClass('GameFramework.resources.FontLayer', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.FontLayer.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\FontLayer.cs
//LineMap:2=3 7=11 9=32 36=34 43=42 45=42 47=42 48=44 53=48 61=60 
//Start:resources\FontResource
/**
 * @constructor
 */
GameFramework.resources.FontResource = function GameFramework_resources_FontResource() {
    this.mTags = [];
    this.mPixelSnappingOverride = GameFramework.resources.PixelSnapping.Default;
}
GameFramework.resources.FontResource.prototype = {
    mAscent : 0,
    mAscentPadding : 0,
    mHeight : 0,
    mLineSpacingOffset : 0,
    mInitialized : null,
    mDefaultPointSize : 0,
    mFontLayers : null,
    mLayerMap : null,
    mPointSize : 0,
    mScale : 1.0,
    mForceScaledImagesWhite : null,
    mActivateAllLayers : null,
    mTags : null,
    mActiveLayers : null,
    mActiveListValid : false,
    mPixelSnappingOverride : null,
    SetPixelSnappingOverride : function GameFramework_resources_FontResource$SetPixelSnappingOverride(thePixelSnapping) {
        this.mPixelSnappingOverride = thePixelSnapping;
    },
    Duplicate : function GameFramework_resources_FontResource$Duplicate() {
        var aFontResource = new GameFramework.resources.FontResource();
        aFontResource.mAscent = this.mAscent;
        aFontResource.mAscentPadding = this.mAscentPadding;
        aFontResource.mLineSpacingOffset = this.mLineSpacingOffset;
        aFontResource.mInitialized = this.mInitialized;
        aFontResource.mDefaultPointSize = this.mDefaultPointSize;
        aFontResource.mFontLayers = this.mFontLayers;
        aFontResource.mLayerMap = this.mLayerMap;
        aFontResource.mPointSize = this.mPointSize;
        aFontResource.mScale = this.mScale;
        aFontResource.mForceScaledImagesWhite = this.mForceScaledImagesWhite;
        aFontResource.mActivateAllLayers = this.mActivateAllLayers;

        {
            var $enum1 = ss.IEnumerator.getEnumerator(this.mTags);
            while($enum1.moveNext()) {
                var aTag = $enum1.get_current();
                aFontResource.mTags.push(aTag);
            }
        }
        aFontResource.mActiveLayers = [];

        {
            var $enum2 = ss.IEnumerator.getEnumerator(this.mFontLayers);
            while($enum2.moveNext()) {
                var aFontLayer = $enum2.get_current();
                aFontResource.mActiveLayers.push(aFontLayer);
            }
        }
        aFontResource.mActiveListValid = this.mActiveListValid;
        return aFontResource;
    },
    SerializeRead : function GameFramework_resources_FontResource$SerializeRead(theBuffer, theParentStreamer) {
        this.mFontLayers = [];
        this.mLayerMap = {};
        var aStrLen;
        var i1 = theBuffer.ReadInt();
        var i2 = theBuffer.ReadInt();
        var i3 = theBuffer.ReadInt();
        var i4 = theBuffer.ReadInt();
        this.mAscent = theBuffer.ReadInt();
        this.mAscentPadding = theBuffer.ReadInt();
        this.mHeight = theBuffer.ReadInt();
        this.mLineSpacingOffset = theBuffer.ReadInt();
        this.mInitialized = theBuffer.ReadBoolean();
        this.mDefaultPointSize = theBuffer.ReadInt();
        var aCharMapSize = theBuffer.ReadInt();
        for(var aCharMapIdx = 0; aCharMapIdx < aCharMapSize; aCharMapIdx++) {
            var aCharFrom = theBuffer.ReadShort();
            var aCharTo = theBuffer.ReadShort();
        }
        var aNumFontLayers = theBuffer.ReadInt();
        for(var aLayerIdx = 0; aLayerIdx < aNumFontLayers; aLayerIdx++) {
            var aFontLayer = new GameFramework.resources.FontLayer();
            aStrLen = theBuffer.ReadInt();
            aFontLayer.mLayerName = theBuffer.ReadAsciiBytes(aStrLen);
            var aTagIdx;
            var aNumTags = theBuffer.ReadInt();
            var aTag;
            for(aTagIdx = 0; aTagIdx < aNumTags; aTagIdx++) {
                aStrLen = theBuffer.ReadInt();
                aTag = theBuffer.ReadAsciiBytes(aStrLen);
                aFontLayer.mRequiredTags.push(aTag);
            }
            aNumTags = theBuffer.ReadInt();
            for(aTagIdx = 0; aTagIdx < aNumTags; aTagIdx++) {
                aStrLen = theBuffer.ReadInt();
                aTag = theBuffer.ReadAsciiBytes(aStrLen);
                aFontLayer.mExcludedTags.push(aTag);
            }
            var aKerningDataSize = theBuffer.ReadInt();
            aFontLayer.mKerningData = Array.Create(aKerningDataSize, 0);
            for(var aKernIdx = 0; aKernIdx < aKerningDataSize; aKernIdx++) {
                aFontLayer.mKerningData[aKernIdx] = theBuffer.ReadInt();
            }
            var aCharDataSize = theBuffer.ReadInt();
            for(var i = 0; i < aCharDataSize; i++) {
                var aFontCharData = new GameFramework.resources.FontCharData();
                var aChar = (theBuffer.ReadShort() | 0);
                aFontCharData.mChar = aChar;
                aFontCharData.mRectX = theBuffer.ReadInt();
                aFontCharData.mRectY = theBuffer.ReadInt();
                aFontCharData.mRectWidth = theBuffer.ReadInt();
                aFontCharData.mRectHeight = theBuffer.ReadInt();
                aFontCharData.mOffsetX = theBuffer.ReadInt();
                aFontCharData.mOffsetY = theBuffer.ReadInt();
                aFontCharData.mKerningFirst = theBuffer.ReadShort();
                aFontCharData.mKerningCount = theBuffer.ReadShort();
                aFontCharData.mWidth = theBuffer.ReadInt();
                aFontCharData.mOrder = theBuffer.ReadInt();
                aFontLayer.mCharHashtable[aChar] = aFontCharData;
            }
            var r = (theBuffer.ReadInt() | 0);
            var g = (theBuffer.ReadInt() | 0);
            var b = (theBuffer.ReadInt() | 0);
            var a = (theBuffer.ReadInt() | 0);
            aFontLayer.mColorMult = (a << 24) | (r << 16) | (g << 8) | b;
            r = (theBuffer.ReadInt() | 0);
            g = (theBuffer.ReadInt() | 0);
            b = (theBuffer.ReadInt() | 0);
            a = (theBuffer.ReadInt() | 0);
            aFontLayer.mColorAdd = (a << 24) | (r << 16) | (g << 8) | b;
            var aFileNameLen = theBuffer.ReadInt();
            var aFileName = theBuffer.ReadAsciiBytes(aFileNameLen);
            aFileName = GameFramework.Utils.StringReplaceChar(aFileName, 92, 47);
            var anId = GameFramework.BaseApp.mApp.mResourceManager.PathToId(aFileName);
            var aResourceStreamer;
            if(anId != null) {
                aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImage(anId);
            } else {
                aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImageFromPath(aFileName);
            }
            GameFramework.BaseApp.mApp.mResourceManager.PrioritizeResourceStreamer(aResourceStreamer);
            aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(aFontLayer, aFontLayer.ImageLoaded));
            if(theParentStreamer != null) {
                theParentStreamer.mResourceCount++;
                aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildCompleted));
                aResourceStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildFailed));
            }
            aFontLayer.mDrawMode = theBuffer.ReadInt();
            aFontLayer.mOfsX = theBuffer.ReadInt();
            aFontLayer.mOfsY = theBuffer.ReadInt();
            aFontLayer.mSpacing = theBuffer.ReadInt();
            aFontLayer.mMinPointSize = theBuffer.ReadInt();
            aFontLayer.mMaxPointSize = theBuffer.ReadInt();
            aFontLayer.mPointSize = theBuffer.ReadInt();
            aFontLayer.mAscent = theBuffer.ReadInt();
            aFontLayer.mAscentPadding = theBuffer.ReadInt();
            aFontLayer.mHeight = theBuffer.ReadInt();
            aFontLayer.mDefaultHeight = theBuffer.ReadInt();
            aFontLayer.mLineSpacingOffset = theBuffer.ReadInt();
            aFontLayer.mBaseOrder = theBuffer.ReadInt();
            this.mFontLayers.push(aFontLayer);
            this.mLayerMap[aFontLayer.mLayerName] = aFontLayer;
        }
        aStrLen = theBuffer.ReadInt();
        var aSourceFile = theBuffer.ReadAsciiBytes(aStrLen);
        aStrLen = theBuffer.ReadInt();
        var aFontErrorHeader = theBuffer.ReadAsciiBytes(aStrLen);
        this.mPointSize = theBuffer.ReadInt();
        this.mScale = 1.0;
        theBuffer.ReadInt();
        theBuffer.ReadInt();
        this.mForceScaledImagesWhite = theBuffer.ReadBoolean();
        this.mActivateAllLayers = theBuffer.ReadBoolean();
        this.mActiveListValid = false;
    },
    GetPhysAscent : function GameFramework_resources_FontResource$GetPhysAscent() {
        this.Prepare();
        var aMinY = 0;

        {
            var $enum3 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
            while($enum3.moveNext()) {
                var aFontLayer = $enum3.get_current();
                var aCharData = (aFontLayer.mCharHashtable[65]);
                if((aCharData != null) && (aCharData.mRectHeight > 0)) {
                    aMinY = Math.min(aMinY, aFontLayer.mOfsY + aCharData.mOffsetY - this.mAscent);
                }
            }
        }
        return -aMinY;
    },
    GetPhysDescent : function GameFramework_resources_FontResource$GetPhysDescent() {
        this.Prepare();
        var aMaxY = 0;

        {
            var $enum4 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
            while($enum4.moveNext()) {
                var aFontLayer = $enum4.get_current();
                var aCharData = (aFontLayer.mCharHashtable[65]);
                if(aCharData != null) {
                    aMaxY = Math.max(aMaxY, aFontLayer.mOfsY + aCharData.mOffsetY - this.mAscent + aCharData.mRectHeight);
                }
            }
        }
        return aMaxY;
    },
    CharWidthKernPhys : function GameFramework_resources_FontResource$CharWidthKernPhys(theChar, theNextChar) {
        this.Prepare();
        var anOrderIdx = 0;
        var aCurXPos = 0;
        var aMaxXPos = 0;

        {
            var $enum5 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
            while($enum5.moveNext()) {
                var aFontLayer = $enum5.get_current();
                var aColor = aFontLayer.mColorMult;
                var aLayerXPos = aCurXPos;
                var aCharData = (aFontLayer.mCharHashtable[theChar]);
                if(aCharData != null) {
                    var aCharWidth = aCharData.mWidth;
                    var aSpacing;
                    if(theNextChar != 0) {
                        aSpacing = aFontLayer.mSpacing;
                        if(aCharData.mKerningCount > 0) {
                            var aKernCount = aCharData.mKerningCount;
                            var aKernIdx = aCharData.mKerningFirst;
                            for(var i = 0; i < aKernCount; i++) {
                                if((aFontLayer.mKerningData[aKernIdx] & 0xffff) == theNextChar) {
                                    aSpacing += aFontLayer.mKerningData[aKernIdx] >> 16;
                                }
                                aKernIdx++;
                            }
                        }
                    } else {
                        aSpacing = 0;
                    }
                    aLayerXPos += aSpacing + aCharData.mWidth;
                }
                if(aLayerXPos > aMaxXPos) {
                    aMaxXPos = aLayerXPos;
                }
                anOrderIdx++;
            }
        }
        aCurXPos = aMaxXPos;
        return aCurXPos;
    },
    CharWidthKern : function GameFramework_resources_FontResource$CharWidthKern(theChar, theNextChar) {
        return this.CharWidthKernPhys(theChar, theNextChar) / GameFramework.BaseApp.mApp.mGraphics.mScale;
    },
    StringWidthPhys : function GameFramework_resources_FontResource$StringWidthPhys(theString, theParseColorizers) {
        if(theParseColorizers === undefined) {
            theParseColorizers = true;
        }
        this.Prepare();
        var anOrderIdx = 0;
        var aCurXPos = 0;
        for(var aCharIdx = 0; aCharIdx < theString.length; aCharIdx++) {
            var aChar = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx);
            if(aChar == 94 && theParseColorizers) {
                if(aCharIdx + 1 < theString.length) {
                    if(theString.charCodeAt(aCharIdx + 1) == 94) {
                        aCharIdx++;
                    } else {
                        aCharIdx += 8;
                        continue;
                    }
                }
            }
            var aNextChar = 0;
            if(aCharIdx < theString.length - 1) {
                aNextChar = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx + 1);
            }
            var aMaxXPos = 0;

            {
                var $enum6 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
                while($enum6.moveNext()) {
                    var aFontLayer = $enum6.get_current();
                    var aColor = aFontLayer.mColorMult;
                    var aLayerXPos = aCurXPos;
                    var aCharData = (aFontLayer.mCharHashtable[aChar]);
                    if(aCharData != null) {
                        var aCharWidth = aCharData.mWidth;
                        var aSpacing;
                        if(aNextChar != 0) {
                            aSpacing = aFontLayer.mSpacing;
                            if(aCharData.mKerningCount > 0) {
                                var aKernCount = aCharData.mKerningCount;
                                var aKernIdx = aCharData.mKerningFirst;
                                for(var i = 0; i < aKernCount; i++) {
                                    if((aFontLayer.mKerningData[aKernIdx] & 0xffff) == aNextChar) {
                                        aSpacing += aFontLayer.mKerningData[aKernIdx] >> 16;
                                    }
                                    aKernIdx++;
                                }
                            }
                        } else {
                            aSpacing = 0;
                        }
                        aLayerXPos += aSpacing + aCharData.mWidth;
                    }
                    if(aLayerXPos > aMaxXPos) {
                        aMaxXPos = aLayerXPos;
                    }
                    anOrderIdx++;
                }
            }
            aCurXPos = aMaxXPos;
        }
        return aCurXPos;
    },
    StringWidth : function GameFramework_resources_FontResource$StringWidth(theString, theParseColorizers) {
        if(theParseColorizers === undefined) {
            theParseColorizers = true;
        }
        return this.StringWidthPhys(theString, theParseColorizers) / GameFramework.BaseApp.mApp.mGraphics.mScale;
    },
    GetAscent : function GameFramework_resources_FontResource$GetAscent() {
        return this.mAscent / GameFramework.BaseApp.mApp.mGraphics.mScale;
    },
    GetAscentPadding : function GameFramework_resources_FontResource$GetAscentPadding() {
        return this.mAscentPadding / GameFramework.BaseApp.mApp.mGraphics.mScale;
    },
    GetHeight : function GameFramework_resources_FontResource$GetHeight() {
        this.Prepare();
        return this.mHeight / GameFramework.BaseApp.mApp.mGraphics.mScale;
    },
    GetLineSpacing : function GameFramework_resources_FontResource$GetLineSpacing() {
        return (this.mHeight + this.mLineSpacingOffset) / GameFramework.BaseApp.mApp.mGraphics.mScale;
    },
    GenerateActiveFontLayers : function GameFramework_resources_FontResource$GenerateActiveFontLayers() {
        this.mActiveLayers = [];
        this.mAscent = 0;
        this.mAscentPadding = 0;
        this.mHeight = 0;
        this.mLineSpacingOffset = 0;
        var firstLayer = true;

        {
            var $enum7 = ss.IEnumerator.getEnumerator(this.mFontLayers);
            while($enum7.moveNext()) {
                var aFontLayer = $enum7.get_current();
                var active = true;

                {
                    var $enum8 = ss.IEnumerator.getEnumerator(aFontLayer.mRequiredTags);
                    while($enum8.moveNext()) {
                        var aReqTag = $enum8.get_current();
                        if(this.mTags.indexOf(aReqTag) == -1) {
                            active = false;
                        }
                    }
                }

                {
                    var $enum9 = ss.IEnumerator.getEnumerator(aFontLayer.mExcludedTags);
                    while($enum9.moveNext()) {
                        var aExTag = $enum9.get_current();
                        if(this.mTags.indexOf(aExTag) != -1) {
                            active = false;
                        }
                    }
                }
                if(this.mActivateAllLayers) {
                    active = true;
                }
                if(active) {
                    this.mActiveLayers.push(aFontLayer);
                    if(aFontLayer.mAscent > this.mAscent) {
                        this.mAscent = aFontLayer.mAscent;
                    }
                    if(aFontLayer.mHeight > this.mHeight) {
                        this.mAscent = aFontLayer.mAscent;
                    }
                    if((firstLayer) || (aFontLayer.mAscentPadding > this.mAscentPadding)) {
                        this.mAscentPadding = aFontLayer.mAscentPadding;
                    }
                    if((firstLayer) || (aFontLayer.mLineSpacingOffset > this.mLineSpacingOffset)) {
                        this.mAscentPadding = aFontLayer.mLineSpacingOffset;
                    }
                    if((firstLayer) || (aFontLayer.mHeight > this.mHeight)) {
                        this.mHeight = aFontLayer.mHeight;
                    }
                    firstLayer = false;
                }
            }
        }
    },
    Prepare : function GameFramework_resources_FontResource$Prepare() {
        if(!this.mActiveListValid) {
            this.GenerateActiveFontLayers();
            this.mActiveListValid = true;
        }
    },
    AddTag : function GameFramework_resources_FontResource$AddTag(theTag) {
        this.mTags.push(theTag);
        this.mActiveListValid = false;
    },
    RemoveTag : function GameFramework_resources_FontResource$RemoveTag(theTag) {
        this.mTags.removeAt(this.mTags.indexOf(theTag));
        this.mActiveListValid = false;
    },
    PushLayerColor : function GameFramework_resources_FontResource$PushLayerColor(theLayer, theColor) {
        var aLayer = (this.mLayerMap[theLayer]);
        aLayer.PushColor(theColor);
        aLayer = (this.mLayerMap[theLayer + '__MOD']);
        if(aLayer != null) {
            aLayer.PushColor(theColor);
        }
    },
    PopLayerColor : function GameFramework_resources_FontResource$PopLayerColor(theLayer) {
        var aLayer = (this.mLayerMap[theLayer]);
        aLayer.PopColor();
        aLayer = (this.mLayerMap[theLayer + '__MOD']);
        if(aLayer != null) {
            aLayer.PopColor();
        }
    },
    Draw : function GameFramework_resources_FontResource$Draw(g, theString, theX, theY, theParseColorizers) {
        if(theParseColorizers === undefined) {
            theParseColorizers = true;
        }
        var aString = '';
        var aXOffset = 0.0;
        for(var aCharIdx = 0; aCharIdx < theString.length; aCharIdx++) {
            var aChar = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx);
            if((theString.charCodeAt(aCharIdx) == 94) && theParseColorizers) {
                if(aCharIdx + 1 < theString.length && theString.charCodeAt(aCharIdx + 1) == 94) {
                    aString += String.fromCharCode(94);
                    aCharIdx++;
                } else if(aCharIdx > theString.length - 8) {
                    break;
                } else {
                    this.DrawUncolorized(g, aString, theX + aXOffset, theY);
                    var aColor = 0;
                    if(theString.charCodeAt(aCharIdx + 1) == 111) {
                        if(theString.substr(aCharIdx + 1, 'oldclr'.length) == 'oldclr') {
                            g.UndoSetColor();
                        }
                    } else {
                        for(var aDigitNum = 0; aDigitNum < 6; aDigitNum++) {
                            var aDigitChar = theString.charCodeAt(aCharIdx + aDigitNum + 1);
                            var aVal = 0;
                            if((aDigitChar >= 48) && (aDigitChar <= 57)) {
                                aVal = ((aDigitChar - 48) | 0);
                            } else if((aDigitChar >= 65) && (aDigitChar <= 70)) {
                                aVal = (((aDigitChar - 65) + 10) | 0);
                            } else if((aDigitChar >= 97) && (aDigitChar <= 102)) {
                                aVal = (((aDigitChar - 97) + 10) | 0);
                            }
                            aColor += (aVal << ((5 - aDigitNum) * 4));
                        }
                        g.SetColor(GameFramework.gfx.Color.RGBAToInt((((aColor >>> 16) & 0xff) | 0), (((aColor >>> 8) & 0xff) | 0), (((aColor) & 0xff) | 0), 255));
                    }
                    aCharIdx += 7;
                    aXOffset += this.StringWidth(aString);
                    aString = '';
                }
            } else {
                aString += String.fromCharCode(theString.charCodeAt(aCharIdx));
            }
        }
        this.DrawUncolorized(g, aString, theX + aXOffset, theY);
    },
    DrawUncolorized : function GameFramework_resources_FontResource$DrawUncolorized(g, theString, theX, theY) {
        this.Prepare();
        if(this.mActiveLayers.length > 2) {
            var aDrawList = {};
            var aDrawOrderArray = [];
            var anOrderIdx = 0;
            var aCurXPos = 0;
            for(var aCharIdx = 0; aCharIdx < theString.length; aCharIdx++) {
                var aChar = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx);
                var aNextChar = 0;
                if(aCharIdx < theString.length - 1) {
                    aNextChar = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx + 1);
                }
                var aMaxXPos = 0;

                {
                    var $enum10 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
                    while($enum10.moveNext()) {
                        var aFontLayer = $enum10.get_current();
                        var aColor = aFontLayer.mColorMult;
                        var aLayerXPos = aCurXPos;
                        var aCharData = aFontLayer.mCharHashtable[aChar];
                        if(aCharData != null) {
                            var aDrawOrder = ((aFontLayer.mBaseOrder + aCharData.mOrder) << 16) + anOrderIdx;
                            var aFontDrawCmd;
                            if(GameFramework.resources.FontResource.mDrawCmdPool.length == 0) {
                                aFontDrawCmd = new GameFramework.resources.FontDrawCmd();
                            } else {
                                aFontDrawCmd = GameFramework.resources.FontResource.mDrawCmdPool.pop();
                            }
                            aFontDrawCmd.mFontLayer = aFontLayer;
                            aFontDrawCmd.mCharData = aCharData;
                            aFontDrawCmd.mXOfs = aLayerXPos + aFontLayer.mOfsX + aCharData.mOffsetX;
                            aFontDrawCmd.mYOfs = -(aFontLayer.mAscent - aFontLayer.mOfsY - aCharData.mOffsetY);
                            var aCharWidth = aCharData.mWidth;
                            var aSpacing;
                            if(aNextChar != 0) {
                                aSpacing = aFontLayer.mSpacing;
                                if(aCharData.mKerningCount > 0) {
                                    var aKernCount = aCharData.mKerningCount;
                                    var aKernIdx = aCharData.mKerningFirst;
                                    for(var i = 0; i < aKernCount; i++) {
                                        if((aFontLayer.mKerningData[aKernIdx] & 0xffff) == aNextChar) {
                                            aSpacing += aFontLayer.mKerningData[aKernIdx] >> 16;
                                        }
                                        aKernIdx++;
                                    }
                                }
                            } else {
                                aSpacing = 0;
                            }
                            aDrawOrderArray.push(aDrawOrder);
                            aDrawList[aDrawOrder] = aFontDrawCmd;
                            aLayerXPos += aSpacing + aCharData.mWidth;
                        }
                        if(aLayerXPos > aMaxXPos) {
                            aMaxXPos = aLayerXPos;
                        }
                        anOrderIdx++;
                    }
                }
                aCurXPos = aMaxXPos;
            }
            if(aDrawOrderArray.length == 0) {
                return;
            }
            GameFramework.Utils.SortIntVector(aDrawOrderArray);
            var aLastColor = 0xffffffff;
            var aMatrix = g.mTempMatrix;
            aMatrix.identity();
            aMatrix.translate(theX, theY);
            aMatrix.concat(g.mMatrix);
            var aLastX = 0;
            var aLastY = 0;
            var aScaleInv = 1.0 / GameFramework.BaseApp.mApp.mGraphics.mScale;

            {
                var $srcArray11 = aDrawOrderArray;
                for(var $enum11 = 0; $enum11 < $srcArray11.length; $enum11++) {
                    var aCurDrawOrder = $srcArray11[$enum11];
                    var aDrawCmd = aDrawList[aCurDrawOrder];
                    var aDrawCharData = aDrawCmd.mCharData;
                    if(aDrawCmd.mFontLayer.mColorMult != aLastColor) {
                        if(aLastColor != 0xffffffff) {
                            g.PopColor();
                        }
                        aLastColor = aDrawCmd.mFontLayer.mColorMult;
                        if(aLastColor != 0xffffffff) {
                            g.PushColor(aLastColor);
                        }
                    }
                    var aXDelta = (aDrawCmd.mXOfs * aScaleInv) - aLastX;
                    var aYDelta = (aDrawCmd.mYOfs * aScaleInv) - aLastY;
                    aMatrix.tx += aXDelta * aMatrix.a + aYDelta * aMatrix.b;
                    aMatrix.ty += aXDelta * aMatrix.c + aYDelta * aMatrix.d;
                    if(this.mPixelSnappingOverride != GameFramework.resources.PixelSnapping.Default) {
                        var anOldPixelSnapping = aDrawCharData.mImageInst.mPixelSnapping;
                        aDrawCharData.mImageInst.mPixelSnapping = this.mPixelSnappingOverride;
                        aDrawCharData.mImageInst.DrawEx(g, aMatrix, 0, 0, 0);
                        aDrawCharData.mImageInst.mPixelSnapping = anOldPixelSnapping;
                    } else {
                        aDrawCharData.mImageInst.DrawEx(g, aMatrix, 0, 0, 0);
                    }
                    aLastX += aXDelta;
                    aLastY += aYDelta;
                }
            }
            if(aLastColor != 0xffffffff) {
                g.PopColor();
            }
        } else {
            var anOrderIdx_2 = 0;
            var aCurXPos_2 = 0;
            var aLastColor_2 = 0xffffffff;
            var aScaleInv_2 = 1.0 / GameFramework.BaseApp.mApp.mGraphics.mScale;
            var aMatrix_2 = g.mReserveMatrix;
            aMatrix_2.identity();
            aMatrix_2.translate(theX, theY);
            aMatrix_2.concat(g.mMatrix);
            var aLastX_2 = 0;
            var aLastY_2 = 0;
            for(var aCharIdx_2 = 0; aCharIdx_2 < theString.length; aCharIdx_2++) {
                var aChar_2 = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx_2);
                var aNextChar_2 = 0;
                if(aCharIdx_2 < theString.length - 1) {
                    aNextChar_2 = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx_2 + 1);
                }
                var aMaxXPos_2 = 0;

                {
                    var $enum12 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
                    while($enum12.moveNext()) {
                        var aFontLayer_2 = $enum12.get_current();
                        var aColor_2 = aFontLayer_2.mColorMult;
                        var aLayerXPos_2 = aCurXPos_2;
                        var aCharData_2 = aFontLayer_2.mCharHashtable[aChar_2];
                        if(aCharData_2 != null) {
                            var aDrawOrder_2 = ((aFontLayer_2.mBaseOrder + aCharData_2.mOrder) << 16) + anOrderIdx_2;
                            var aXOfs = aLayerXPos_2 + aFontLayer_2.mOfsX + aCharData_2.mOffsetX;
                            var aYOfs = -(aFontLayer_2.mAscent - aFontLayer_2.mOfsY - aCharData_2.mOffsetY);
                            if(aFontLayer_2.mColorMult != aLastColor_2) {
                                if(aLastColor_2 != 0xffffffff) {
                                    g.PopColor();
                                }
                                aLastColor_2 = aFontLayer_2.mColorMult;
                                if(aLastColor_2 != 0xffffffff) {
                                    g.PushColor(aLastColor_2);
                                }
                            }
                            var aXDelta_2 = (aXOfs * aScaleInv_2) - aLastX_2;
                            var aYDelta_2 = (aYOfs * aScaleInv_2) - aLastY_2;
                            aMatrix_2.tx += aXDelta_2 * aMatrix_2.a + aYDelta_2 * aMatrix_2.b;
                            aMatrix_2.ty += aXDelta_2 * aMatrix_2.c + aYDelta_2 * aMatrix_2.d;
                            aCharData_2.mImageInst.DrawEx(g, aMatrix_2, 0, 0, 0);
                            aLastX_2 += aXDelta_2;
                            aLastY_2 += aYDelta_2;
                            var aCharWidth_2 = aCharData_2.mWidth;
                            var aSpacing_2;
                            if(aNextChar_2 != 0) {
                                aSpacing_2 = aFontLayer_2.mSpacing;
                                if(aCharData_2.mKerningCount > 0) {
                                    var aKernCount_2 = aCharData_2.mKerningCount;
                                    var aKernIdx_2 = aCharData_2.mKerningFirst;
                                    for(var i_2 = 0; i_2 < aKernCount_2; i_2++) {
                                        if((aFontLayer_2.mKerningData[aKernIdx_2] & 0xffff) == aNextChar_2) {
                                            aSpacing_2 += aFontLayer_2.mKerningData[aKernIdx_2] >> 16;
                                        }
                                        aKernIdx_2++;
                                    }
                                }
                            } else {
                                aSpacing_2 = 0;
                            }
                            aLayerXPos_2 += aSpacing_2 + aCharData_2.mWidth;
                        }
                        if(aLayerXPos_2 > aMaxXPos_2) {
                            aMaxXPos_2 = aLayerXPos_2;
                        }
                        anOrderIdx_2++;
                    }
                }
                aCurXPos_2 = aMaxXPos_2;
            }
            if(aLastColor_2 != 0xffffffff) {
                g.PopColor();
            }
        }
    }
}
GameFramework.resources.FontResource.staticInit = function GameFramework_resources_FontResource$staticInit() {
    GameFramework.resources.FontResource.mDrawCmdPool = [];
}

JS_AddInitFunc(function() {
    GameFramework.resources.FontResource.registerClass('GameFramework.resources.FontResource', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.FontResource.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\FontResource.cs
//LineMap:2=3 5=33 7=25 8=30 21=21 26=28 29=36 48=56 50=56 54=57 57=59 60=60 64=61 67=63 68=65 75=73 76=76 80=81 84=86 86=89 92=96 96=101 98=104 107=114 114=122 118=127 122=132 123=134 134=146 136=149 141=155 146=161 150=166 157=174 163=182 176=196 179=200 184=207 187=211 
//LineMap:195=220 196=222 198=222 202=224 213=236 214=238 216=238 220=240 231=252 233=256 234=258 236=258 240=260 241=262 242=264 246=269 253=277 258=283 264=288 265=290 267=293 269=296 283=308 284=310 285=312 287=315 290=319 296=326 298=327 303=333 306=337 307=339 309=339 
//LineMap:313=341 314=343 315=345 319=350 326=358 331=364 337=369 338=371 340=374 342=377 347=383 352=386 353=388 380=416 384=421 385=423 387=423 391=425 392=427 394=427 398=428 402=431 404=431 408=432 412=435 414=438 417=442 427=453 433=458 472=499 474=499 475=501 477=505 
//LineMap:480=509 487=514 488=517 489=519 491=520 492=522 501=530 505=535 507=538 508=538 509=540 510=542 512=545 514=548 515=550 516=552 521=556 523=559 529=566 533=571 535=574 538=578 541=582 542=584 544=584 548=586 549=588 550=590 554=595 559=601 561=604 564=608 571=616 
//LineMap:576=622 582=627 583=629 585=632 587=635 589=638 594=644 596=647 597=649 598=669 602=674 604=677 605=679 607=679 611=681 621=692 623=695 635=706 641=713 647=718 649=721 651=724 655=729 657=732 663=739 664=741 666=741 670=743 671=745 672=747 676=755 678=758 686=767 
//LineMap:688=770 693=777 694=779 701=787 706=793 712=798 713=800 715=803 717=806 722=812 729=497 
//Start:resources\ImageInst
/**
 * @constructor
 */
GameFramework.resources.ImageInst = function GameFramework_resources_ImageInst(theImageResource) {
    this.mSource = null;
    this.mPixelSnapping = 0;
    this.mSource = theImageResource;
    this.mAdditive = this.mSource.mAdditive;
    this.mPixelSnapping = this.mSource.mPixelSnapping;
    this.mSmoothing = this.mSource.mSmoothing;
}
GameFramework.resources.ImageInst.prototype = {
    mSource : null,
    mSrcX : 0,
    mSrcY : 0,
    mSrcWidth : 0,
    mSrcHeight : 0,
    mAdditive : false,
    mPixelSnapping : null,
    mSmoothing : true,
    mSizeSnapping : false,
    mRepeatX : 1.0,
    mRepeatY : 1.0,
    get_Additive : function GameFramework_resources_ImageInst$get_Additive() {
        return this.mAdditive;
    },
    set_Additive : function GameFramework_resources_ImageInst$set_Additive(value) {
        this.mAdditive = value;
    },
    Prepare : function GameFramework_resources_ImageInst$Prepare() {
    },
    DrawEx : function GameFramework_resources_ImageInst$DrawEx(g, theMatrix, theX, theY, theCel) {
    }
}
GameFramework.resources.ImageInst.staticInit = function GameFramework_resources_ImageInst$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.ImageInst.registerClass('GameFramework.resources.ImageInst', null, GameFramework.gfx.IDrawable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.ImageInst.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\ImageInst.cs
//LineMap:2=3 5=32 7=10 8=22 9=33 21=17 23=23 25=28 28=26 30=26 33=26 35=26 39=39 
//Start:resources\ImageResource
GameFramework.resources.PixelSnapping = {};
GameFramework.resources.PixelSnapping.staticInit = function GameFramework_resources_PixelSnapping$staticInit() {
    GameFramework.resources.PixelSnapping.Never = 0;
    GameFramework.resources.PixelSnapping.Always = 1;
    GameFramework.resources.PixelSnapping.Auto = 2;
    GameFramework.resources.PixelSnapping.Default = 3;
}
JS_AddInitFunc(function() {
    GameFramework.resources.PixelSnapping.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.ImageResource = function GameFramework_resources_ImageResource() {
    this.mPixelSnapping = GameFramework.resources.PixelSnapping.Auto;
    GameFramework.resources.ImageResource.mInstanceCount++;
    this.mId = GameFramework.resources.ImageResource.mInstanceCount;
}
GameFramework.resources.ImageResource.prototype = {
    mRows : 1,
    mCols : 1,
    mNumFrames : 1,
    mId : 0,
    mPhysCelWidth : 0,
    mPhysCelHeight : 0,
    mContentScale : 1.0,
    mWidth : 0,
    mHeight : 0,
    mAdjustedWidth : 0,
    mAdjustedHeight : 0,
    mAdditive : false,
    mSmoothing : true,
    mPixelSnapping : null,
    mSizeSnapping : false,
    mOffsetX : 0,
    mOffsetY : 0,
    mOffsetImageResource : null,
    mCenteredImageResource : null,
    get_Additive : function GameFramework_resources_ImageResource$get_Additive() {
        return this.mAdditive;
    },
    set_Additive : function GameFramework_resources_ImageResource$set_Additive(value) {
        this.mAdditive = value;
    },
    Dispose : function GameFramework_resources_ImageResource$Dispose() {
    },
    DrawEx : function GameFramework_resources_ImageResource$DrawEx(g, theMatrix, theX, theY, theCel) {
    },
    get_OffsetImage : function GameFramework_resources_ImageResource$get_OffsetImage() {
        if(this.mOffsetImageResource == null) {
            this.mOffsetImageResource = new GameFramework.gfx.OffsetDrawable(this, this.mOffsetX, this.mOffsetY);
        }
        return this.mOffsetImageResource;
    },
    get_CenteredImage : function GameFramework_resources_ImageResource$get_CenteredImage() {
        if(this.mCenteredImageResource == null) {
            this.mCenteredImageResource = new GameFramework.gfx.OffsetDrawable(this, -this.mWidth / 2.0, -this.mHeight / 2.0);
        }
        return this.mCenteredImageResource;
    },
    GetRotatedImage : function GameFramework_resources_ImageResource$GetRotatedImage(theAngle) {
        var aMatrix = new GameFramework.geom.Matrix();
        aMatrix.translate(-this.mWidth / 2.0, -this.mHeight / 2.0);
        aMatrix.rotate(theAngle);
        aMatrix.translate(this.mWidth / 2.0, this.mHeight / 2.0);
        return new GameFramework.gfx.TransformedDrawable(this, aMatrix);
    },
    GetRotatedImageEx : function GameFramework_resources_ImageResource$GetRotatedImageEx(theAngle, theCenterX, theCenterY) {
        var aMatrix = new GameFramework.geom.Matrix();
        aMatrix.translate(-theCenterX, -theCenterY);
        aMatrix.rotate(theAngle);
        aMatrix.translate(theCenterX, theCenterY);
        return new GameFramework.gfx.TransformedDrawable(this, aMatrix);
    },
    CreateImageInst : function GameFramework_resources_ImageResource$CreateImageInst() {
        var anImageInst = new GameFramework.resources.ImageInst(this);
        anImageInst.mSrcX = 0;
        anImageInst.mSrcY = 0;
        anImageInst.mSrcWidth = this.mPhysCelWidth;
        anImageInst.mSrcHeight = this.mPhysCelHeight;
        return anImageInst;
    },
    CreateImageInstCel : function GameFramework_resources_ImageResource$CreateImageInstCel(theCel) {
        var aCol = theCel % this.mCols;
        var aRow = ((theCel / this.mCols) | 0);
        var anImageInst = new GameFramework.resources.ImageInst(this);
        anImageInst.mSource = this;
        anImageInst.mSrcX = aCol * this.mPhysCelWidth;
        anImageInst.mSrcY = aRow * this.mPhysCelHeight;
        anImageInst.mSrcWidth = this.mPhysCelWidth;
        anImageInst.mSrcHeight = this.mPhysCelHeight;
        return anImageInst;
    },
    CreateImageInstRect : function GameFramework_resources_ImageResource$CreateImageInstRect(theSrcX, theSrcY, theSrcWidth, theSrcHeight) {
        var anImageInst = new GameFramework.resources.ImageInst(this);
        anImageInst.mSource = this;
        anImageInst.mSrcX = theSrcX;
        anImageInst.mSrcY = theSrcY;
        anImageInst.mSrcWidth = theSrcWidth;
        anImageInst.mSrcHeight = theSrcHeight;
        return anImageInst;
    }
}
GameFramework.resources.ImageResource.staticInit = function GameFramework_resources_ImageResource$staticInit() {
    GameFramework.resources.ImageResource.mInstanceCount = 0;
}

JS_AddInitFunc(function() {
    GameFramework.resources.ImageResource.registerClass('GameFramework.resources.ImageResource', null, GameFramework.gfx.IDrawable, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.ImageResource.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\ImageResource.cs
//LineMap:2=3 5=9 14=80 16=61 17=81 22=17 26=27 27=31 28=33 29=38 30=43 31=48 32=53 33=55 36=62 37=67 38=72 42=77 44=77 47=77 49=77 53=85 63=97 68=103 70=107 75=113 107=146 129=22 
//Start:resources\IResources

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\IResources.cs
//LineMap:2=3 
//Start:resources\MeshResource
/**
 * @constructor
 */
GameFramework.resources.MeshPiece = function GameFramework_resources_MeshPiece() {
}
GameFramework.resources.MeshPiece.prototype = {
    mObjectName : null,
    mSetName : null,
    mSexyVF : 0,
    mVertexSize : 0,
    mVertexBufferCount : 0,
    mVertexData : null,
    mIndexBufferCount : 0,
    mIndexData : null,
    mImage : null,
    ImageLoaded : function GameFramework_resources_MeshPiece$ImageLoaded(e) {
        var aResourceStreamer = e.target;
        if(aResourceStreamer.mId != null) {
            this.mImage = GameFramework.BaseApp.mApp.mResourceManager.GetImageResourceById(aResourceStreamer.mId);
        } else {
            this.mImage = aResourceStreamer.mResultData;
        }
    }
}
GameFramework.resources.MeshPiece.staticInit = function GameFramework_resources_MeshPiece$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.MeshPiece.registerClass('GameFramework.resources.MeshPiece', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.MeshPiece.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.MeshEvent = function GameFramework_resources_MeshEvent(theType) {
    GameFramework.resources.MeshEvent.initializeBase(this, [theType]);
}
GameFramework.resources.MeshEvent.prototype = {
    mMeshResource : null,
    mSetName : null
}
GameFramework.resources.MeshEvent.staticInit = function GameFramework_resources_MeshEvent$staticInit() {
    GameFramework.resources.MeshEvent.PREDRAW = 'mesh_predraw';
    GameFramework.resources.MeshEvent.POSTDRAW = 'mesh_postdraw';
    GameFramework.resources.MeshEvent.PREDRAW_SET = 'mesh_predrawset';
    GameFramework.resources.MeshEvent.POSTDRAW_SET = 'mesh_postdrawset';
}

JS_AddInitFunc(function() {
    GameFramework.resources.MeshEvent.registerClass('GameFramework.resources.MeshEvent', GameFramework.events.Event);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.MeshEvent.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.MeshResource = function GameFramework_resources_MeshResource() {
    this.mPieces = [];
    GameFramework.resources.MeshResource.initializeBase(this);
}
GameFramework.resources.MeshResource.prototype = {
    mPieces : null,
    CreateMeshPiece : function GameFramework_resources_MeshResource$CreateMeshPiece() {
        return new GameFramework.resources.MeshPiece();
    },
    LoadMesh : function GameFramework_resources_MeshResource$LoadMesh(theDataBuffer, theParentStreamer) {
        if(theDataBuffer.ReadInt() != 0x3dbeef00) {
            return false;
        }
        var aVersion = theDataBuffer.ReadInt();
        if(aVersion > 2) {
            return false;
        }
        var anObjectCount = theDataBuffer.ReadShort();
        for(var anObjIdx = 0; anObjIdx < anObjectCount; anObjIdx++) {
            var anObjectName = theDataBuffer.ReadAsciiString();
            var aSetCount = theDataBuffer.ReadShort();
            var aSetIdx;
            for(aSetIdx = 0; aSetIdx < aSetCount; aSetIdx++) {
                if(aVersion > 1) {
                    var aFlags = theDataBuffer.ReadByte();
                    if(aFlags == 0) {
                        continue;
                    }
                }
                var aPiece = new GameFramework.resources.MeshPiece();
                this.mPieces.push(aPiece);
                var aSetName = theDataBuffer.ReadAsciiString();
                var aTexFileName = null;
                var aBumpFileName = null;
                aPiece.mObjectName = anObjectName;
                aPiece.mSetName = aSetName;
                var aPropCount = theDataBuffer.ReadShort();
                for(var i = 0; i < aPropCount; i++) {
                    var aPropName = theDataBuffer.ReadAsciiString();
                    var aPropValue = theDataBuffer.ReadAsciiString();
                    if(aPropName == 'texture0.fileName') {
                        aTexFileName = aPropValue;
                    }
                    if(aPropName == 'bump.fileName') {
                        aBumpFileName = aPropValue;
                    }
                }
                if(aTexFileName != null) {
                    aTexFileName = GameFramework.Utils.StringReplaceChar(aTexFileName, 92, 47);
                    aTexFileName = aTexFileName.substr(0, aTexFileName.indexOf(String.fromCharCode(46)));
                    var anId = GameFramework.BaseApp.mApp.mResourceManager.PathToId('images/' + GameFramework.BaseApp.mApp.mArtRes + '/tex/' + aTexFileName);
                    if(anId == null) {
                        anId = GameFramework.BaseApp.mApp.mResourceManager.PathToId('images/' + GameFramework.BaseApp.mApp.mArtRes + '/NonResize/' + aTexFileName);
                    }
                    var aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImage(anId);
                    aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(aPiece, aPiece.ImageLoaded));
                    aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildCompleted));
                    aResourceStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildFailed));
                    theParentStreamer.mResourceCount++;
                    GameFramework.BaseApp.mApp.mResourceManager.PrioritizeResourceStreamer(aResourceStreamer);
                }
                var aType = theDataBuffer.ReadShort();
                var aFVF = (theDataBuffer.ReadInt() | 0);
                var aVertexSize = 4 * (3 + 3 + 2) + 4;
                aPiece.mSexyVF = aFVF;
                aPiece.mVertexSize = aVertexSize;
                var aReadVertexSize = aVertexSize;
                aPiece.mVertexBufferCount = theDataBuffer.ReadShort();
                var aData = Array.Create(aVertexSize * aPiece.mVertexBufferCount, 0);
                theDataBuffer.ReadBytes(aData, 0, aVertexSize * aPiece.mVertexBufferCount);
                aPiece.mVertexData = new GameFramework.DataBuffer();
                aPiece.mVertexData.InitRead(aData);
                aPiece.mIndexBufferCount = theDataBuffer.ReadShort() * 3;
                aData = Array.Create(aPiece.mIndexBufferCount * 2, 0);
                theDataBuffer.ReadBytes(aData, 0, aPiece.mIndexBufferCount * 2);
                aPiece.mIndexData = new GameFramework.DataBuffer();
                aPiece.mIndexData.InitRead(aData);
            }
            if(aSetIdx < aSetCount) {
                return false;
            }
        }
        return true;
    }
}
GameFramework.resources.MeshResource.staticInit = function GameFramework_resources_MeshResource$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.MeshResource.registerClass('GameFramework.resources.MeshResource', GameFramework.events.EventDispatcher);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.MeshResource.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\MeshResource.cs
//LineMap:2=10 20=24 35=34 38=46 40=45 49=36 57=50 62=52 69=54 78=64 81=73 85=78 95=89 97=92 98=94 100=97 102=100 107=108 112=114 117=120 119=123 121=127 123=130 126=161 129=165 132=169 133=171 137=176 143=183 146=187 
//Start:resources\PIEffect
/**
 * @constructor
 */
GameFramework.resources.PIValuePoint = function GameFramework_resources_PIValuePoint() {
}
GameFramework.resources.PIValuePoint.prototype = {
    mTime : 0,
    mValue : 0,
    Dispose : function GameFramework_resources_PIValuePoint$Dispose() {
    }
}
GameFramework.resources.PIValuePoint.staticInit = function GameFramework_resources_PIValuePoint$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIValuePoint.registerClass('GameFramework.resources.PIValuePoint', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIValuePoint.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIGeomDataEx = function GameFramework_resources_PIGeomDataEx() {
}
GameFramework.resources.PIGeomDataEx.prototype = {
    mTravelAngle : 0,
    isMaskedOut : null,
    Dispose : function GameFramework_resources_PIGeomDataEx$Dispose() {
    }
}
GameFramework.resources.PIGeomDataEx.staticInit = function GameFramework_resources_PIGeomDataEx$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIGeomDataEx.registerClass('GameFramework.resources.PIGeomDataEx', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIGeomDataEx.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIValue = function GameFramework_resources_PIValue() {
}
GameFramework.resources.PIValue.prototype = {
    mQuantTable : null,
    mValuePointVector : null,
    mBezier : null,
    mLastTime : -1.0,
    mLastValue : 0,
    mLastCurveT : 0.0,
    mLastCurveTDelta : 0.01,
    Dispose : function GameFramework_resources_PIValue$Dispose() {
    },
    QuantizeCurve : function GameFramework_resources_PIValue$QuantizeCurve() {
        var aMinTime = this.mValuePointVector[0].mTime;
        var aMaxTime = this.mValuePointVector[this.mValuePointVector.length - 1].mTime;
        this.mQuantTable = [];
        this.mQuantTable.length = GameFramework.resources.PIValue.PI_QUANT_SIZE;
        var first = true;
        var aLastGX = 0;
        var aLastX = 0;
        var aLastY = 0;
        var aCurT = aMinTime;
        var aTIncr = (aMaxTime - aMinTime) / GameFramework.resources.PIValue.PI_QUANT_SIZE / 2.0;
        var aPointIdx = 0;
        for(; ;) {
            var aFoundPoint = this.mBezier.Evaluate(aCurT);
            var aGX = (((((aFoundPoint.x) - aMinTime) / (aMaxTime - aMinTime) * (GameFramework.resources.PIValue.PI_QUANT_SIZE - 1) + 0.5)) | 0);
            var done = false;
            while(aFoundPoint.x >= this.mValuePointVector[aPointIdx + 1].mTime) {
                aPointIdx++;
                if(aPointIdx >= (this.mValuePointVector.length | 0) - 1) {
                    done = true;
                    break;
                }
            }
            if(done) {
                break;
            }
            if(aFoundPoint.x >= this.mValuePointVector[aPointIdx].mTime) {
                if((!first) && (aGX > aLastGX + 1)) {
                    for(var aX = aLastGX; aX <= aGX; aX++) {
                        var aDist = (aX - aLastGX) / (aGX - aLastGX);
                        var aVal = aDist * aFoundPoint.y + (1.0 - aDist) * aLastY;
                        this.mQuantTable[aX] = aVal;
                    }
                } else {
                    var aVal_2 = aFoundPoint.y;
                    this.mQuantTable[aGX] = aVal_2;
                }
                aLastGX = aGX;
                aLastX = aFoundPoint.x;
                aLastY = aFoundPoint.y;
            }
            first = false;
            aCurT += aTIncr;
        }
        for(var i = 0; i < (this.mValuePointVector.length | 0); i++) {
            var anIdx = (((((this.mValuePointVector[i].mTime) - aMinTime) / (aMaxTime - aMinTime) * (GameFramework.resources.PIValue.PI_QUANT_SIZE - 1) + 0.5)) | 0);
            this.mQuantTable[anIdx] = this.mValuePointVector[i].mValue;
        }
    },
    GetValueAt : function GameFramework_resources_PIValue$GetValueAt(theTime, theDefault) {
        if(theDefault === undefined) {
            theDefault = 0;
        }
        if(this.mLastTime == theTime) {
            return this.mLastValue;
        }
        var aPrevTime = this.mLastTime;
        this.mLastTime = theTime;
        if(this.mValuePointVector.length == 1) {
            return this.mLastValue = this.mValuePointVector[0].mValue;
        }
        if(this.mBezier != null) {
            var aMinTime = this.mValuePointVector[0].mTime;
            var aMaxTime = this.mValuePointVector[this.mValuePointVector.length - 1].mTime;
            if(aMaxTime <= 1.001) {
                if(this.mQuantTable == null) {
                    this.QuantizeCurve();
                }
                var aQPos = ((((theTime) - aMinTime) / (aMaxTime - aMinTime) * (GameFramework.resources.PIValue.PI_QUANT_SIZE - 1) + 0.5));
                if(aQPos <= 0.0) {
                    return this.mLastValue = this.mValuePointVector[0].mValue;
                }
                if(aQPos >= GameFramework.resources.PIValue.PI_QUANT_SIZE - 1) {
                    return this.mLastValue = this.mValuePointVector[this.mValuePointVector.length - 1].mValue;
                }
                var aLeft = (aQPos | 0);
                var aFrac = aQPos - aLeft;
                this.mLastValue = this.mQuantTable[aLeft] * (1.0 - aFrac) + this.mQuantTable[aLeft + 1] * aFrac;
                return this.mLastValue;
            }
            var aMaxError = Math.min(0.1, (aMaxTime - aMinTime) / 1000.0);
            if(theTime <= aMinTime) {
                return this.mLastValue = this.mValuePointVector[0].mValue;
            }
            if(theTime >= aMaxTime) {
                return this.mLastValue = this.mValuePointVector[this.mValuePointVector.length - 1].mValue;
            }
            var aL = aMinTime;
            var aR = aMaxTime;
            var aPt = new GameFramework.geom.TPoint();
            var aTryT = 0;
            var isBigChange = ((theTime - aPrevTime) / (aMaxTime - aMinTime)) > 0.05;
            var anErrorFactor = Array.Create(4, 4, 0.1, 0.1, 0.1, 0.5);
            var aFactors = Array.Create(3, 3, 1.0, 0.75, 1.25);
            for(var aTryCount = 0; aTryCount < 1000; aTryCount++) {
                var aWantError = aMaxError;
                if((aTryCount < 4) && (!isBigChange)) {
                    aWantError *= anErrorFactor[aTryCount];
                }
                if((aTryCount < 3) && (this.mLastCurveTDelta != 0) && (!isBigChange)) {
                    aTryT = this.mLastCurveT + this.mLastCurveTDelta * aFactors[aTryCount];
                } else {
                    aTryT = aL + (aR - aL) / 2.0;
                }
                if((aTryT >= aL) && (aTryT <= aR)) {
                    aPt = this.mBezier.Evaluate(aTryT);
                    var aDiff = aPt.x - theTime;
                    if(Math.abs(aDiff) <= aWantError) {
                        break;
                    }
                    if(aDiff < 0) {
                        aL = aTryT;
                    } else {
                        aR = aTryT;
                    }
                }
            }
            this.mLastCurveTDelta = this.mLastCurveTDelta * 0.5 + (aTryT - this.mLastCurveT) * 0.5;
            this.mLastCurveT = aTryT;
            return this.mLastValue = aPt.y;
        }
        for(var i = 1; i < this.mValuePointVector.length; i++) {
            var aP1 = this.mValuePointVector[i - 1];
            var aP2 = this.mValuePointVector[i];
            if(((theTime >= aP1.mTime) && (theTime <= aP2.mTime)) || (i == (this.mValuePointVector.length | 0) - 1)) {
                return this.mLastValue = aP1.mValue + (aP2.mValue - aP1.mValue) * Math.min(1.0, (theTime - aP1.mTime) / (aP2.mTime - aP1.mTime));
            }
        }
        return this.mLastValue = theDefault;
    },
    GetLastKeyframe : function GameFramework_resources_PIValue$GetLastKeyframe(theTime) {
        for(var i = (this.mValuePointVector.length | 0) - 1; i >= 0; i--) {
            var aPt = this.mValuePointVector[i];
            if(theTime >= aPt.mTime) {
                return aPt.mValue;
            }
        }
        return 0;
    },
    GetLastKeyframeTime : function GameFramework_resources_PIValue$GetLastKeyframeTime(theTime) {
        for(var i = (this.mValuePointVector.length | 0) - 1; i >= 0; i--) {
            var aPt = this.mValuePointVector[i];
            if(theTime >= aPt.mTime) {
                return aPt.mTime;
            }
        }
        return 0;
    },
    GetNextKeyframeTime : function GameFramework_resources_PIValue$GetNextKeyframeTime(theTime) {
        for(var i = 0; i < (this.mValuePointVector.length | 0); i++) {
            var aPt = this.mValuePointVector[i];
            if(aPt.mTime >= theTime) {
                return aPt.mTime;
            }
        }
        return 0;
    },
    GetNextKeyframeIdx : function GameFramework_resources_PIValue$GetNextKeyframeIdx(theTime) {
        for(var i = 0; i < (this.mValuePointVector.length | 0); i++) {
            var aPt = this.mValuePointVector[i];
            if(aPt.mTime >= theTime) {
                return i;
            }
        }
        return -1;
    }
}
GameFramework.resources.PIValue.staticInit = function GameFramework_resources_PIValue$staticInit() {
    GameFramework.resources.PIValue.PI_QUANT_SIZE = 256;
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIValue.registerClass('GameFramework.resources.PIValue', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIValue.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIValuePoint2D = function GameFramework_resources_PIValuePoint2D() {
}
GameFramework.resources.PIValuePoint2D.prototype = {
    mTime : 0,
    mValue : null,
    Dispose : function GameFramework_resources_PIValuePoint2D$Dispose() {
    }
}
GameFramework.resources.PIValuePoint2D.staticInit = function GameFramework_resources_PIValuePoint2D$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIValuePoint2D.registerClass('GameFramework.resources.PIValuePoint2D', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIValuePoint2D.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIValue2D = function GameFramework_resources_PIValue2D() {
}
GameFramework.resources.PIValue2D.prototype = {
    mValuePoint2DVector : null,
    mBezier : null,
    mLastTime : -1,
    mLastPoint : null,
    mLastVelocityTime : 0,
    mLastVelocity : null,
    Dispose : function GameFramework_resources_PIValue2D$Dispose() {
    },
    GetValueAt : function GameFramework_resources_PIValue2D$GetValueAt(theTime) {
        if(this.mLastTime == theTime) {
            return this.mLastPoint;
        }
        this.mLastTime = theTime;
        if(this.mValuePoint2DVector.length == 1) {
            return this.mLastPoint = this.mValuePoint2DVector[0].mValue;
        }
        if(this.mBezier != null) {
            this.mLastPoint = this.mBezier.Evaluate(theTime);
            return this.mLastPoint;
        }
        for(var i = 1; i < (this.mValuePoint2DVector.length | 0); i++) {
            var aP1 = this.mValuePoint2DVector[i - 1];
            var aP2 = this.mValuePoint2DVector[i];
            if(((theTime >= aP1.mTime) && (theTime <= aP2.mTime)) || (i == (this.mValuePoint2DVector.length | 0) - 1)) {
                this.mLastPoint = GameFramework.geom.TPoint.interpolate(aP2.mValue, aP1.mValue, Math.min(1.0, (theTime - aP1.mTime) / (aP2.mTime - aP1.mTime)));
                return this.mLastPoint;
            }
        }
        return this.mLastPoint = new GameFramework.geom.TPoint(0, 0);
    },
    GetVelocityAt : function GameFramework_resources_PIValue2D$GetVelocityAt(theTime) {
        if(this.mLastVelocityTime == theTime) {
            return this.mLastVelocity;
        }
        this.mLastVelocityTime = theTime;
        if(this.mValuePoint2DVector.length <= 1) {
            return new GameFramework.geom.TPoint(0, 0);
        }
        if(this.mBezier != null) {
            return this.mLastVelocity = this.mBezier.Velocity(theTime, false);
        }
        for(var i = 1; i < (this.mValuePoint2DVector.length | 0); i++) {
            var aP1 = this.mValuePoint2DVector[i - 1];
            var aP2 = this.mValuePoint2DVector[i];
            if(((theTime >= aP1.mTime) && (theTime <= aP2.mTime)) || (i == (this.mValuePoint2DVector.length | 0) - 1)) {
                return this.mLastVelocity = aP2.mValue.subtract(aP1.mValue);
            }
        }
        return this.mLastVelocity = new GameFramework.geom.TPoint(0, 0);
    }
}
GameFramework.resources.PIValue2D.staticInit = function GameFramework_resources_PIValue2D$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIValue2D.registerClass('GameFramework.resources.PIValue2D', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIValue2D.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIInterpolatorPoint = function GameFramework_resources_PIInterpolatorPoint() {
}
GameFramework.resources.PIInterpolatorPoint.prototype = {
    mValue : 0,
    mTime : 0,
    Dispose : function GameFramework_resources_PIInterpolatorPoint$Dispose() {
    }
}
GameFramework.resources.PIInterpolatorPoint.staticInit = function GameFramework_resources_PIInterpolatorPoint$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIInterpolatorPoint.registerClass('GameFramework.resources.PIInterpolatorPoint', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIInterpolatorPoint.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIInterpolator = function GameFramework_resources_PIInterpolator() {
    this.mInterpolatorPointVector = [];
}
GameFramework.resources.PIInterpolator.prototype = {
    mInterpolatorPointVector : null,
    Dispose : function GameFramework_resources_PIInterpolator$Dispose() {
    },
    GetValueAt : function GameFramework_resources_PIInterpolator$GetValueAt(theTime) {
        if(this.mInterpolatorPointVector.length == 1) {
            return this.mInterpolatorPointVector[0].mValue;
        }
        var aScaledTime = this.mInterpolatorPointVector[0].mTime + theTime * (this.mInterpolatorPointVector[this.mInterpolatorPointVector.length - 1].mTime - this.mInterpolatorPointVector[0].mTime);
        for(var i = 1; i < (this.mInterpolatorPointVector.length | 0); i++) {
            var aP1 = this.mInterpolatorPointVector[i - 1];
            var aP2 = this.mInterpolatorPointVector[i];
            if((aScaledTime >= aP1.mTime) && (aScaledTime <= aP2.mTime)) {
                return GameFramework.Utils.LerpColor(aP1.mValue, aP2.mValue, Math.min(1.0, (aScaledTime - aP1.mTime) / (aP2.mTime - aP1.mTime)));
            }
            if(i == (this.mInterpolatorPointVector.length | 0) - 1) {
                return aP2.mValue;
            }
        }
        return 0;
    },
    GetKeyframeNum : function GameFramework_resources_PIInterpolator$GetKeyframeNum(theIdx) {
        if(this.mInterpolatorPointVector.length == 0) {
            return 0;
        }
        return this.mInterpolatorPointVector[theIdx % this.mInterpolatorPointVector.length].mValue;
    },
    GetKeyframeTime : function GameFramework_resources_PIInterpolator$GetKeyframeTime(theIdx) {
        if(this.mInterpolatorPointVector.length == 0) {
            return 0;
        }
        return this.mInterpolatorPointVector[theIdx % this.mInterpolatorPointVector.length].mTime;
    }
}
GameFramework.resources.PIInterpolator.staticInit = function GameFramework_resources_PIInterpolator$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIInterpolator.registerClass('GameFramework.resources.PIInterpolator', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIInterpolator.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PITextureChunk = function GameFramework_resources_PITextureChunk() {
}
GameFramework.resources.PITextureChunk.prototype = {
    mSrcTexture : null,
    mImage : null,
    mCel : 0,
    mScaleXFactor : 0,
    mScaleYFactor : 0,
    mRefOfsX : 0,
    mRefOfsY : 0,
    mScaleRef : 0,
    Dispose : function GameFramework_resources_PITextureChunk$Dispose() {
    }
}
GameFramework.resources.PITextureChunk.staticInit = function GameFramework_resources_PITextureChunk$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PITextureChunk.registerClass('GameFramework.resources.PITextureChunk', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PITextureChunk.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PITexture = function GameFramework_resources_PITexture() {
    this.mTextureChunkVector = [];
}
GameFramework.resources.PITexture.prototype = {
    mTextureChunkVector : null,
    mName : null,
    mImageVector : null,
    mImageStrip : null,
    mNumCels : 0,
    mPadded : null,
    Dispose : function GameFramework_resources_PITexture$Dispose() {
    },
    ImageLoaded : function GameFramework_resources_PITexture$ImageLoaded(e) {
        var aResourceStreamer = e.target;
        if(aResourceStreamer.mId != null) {
            this.mImageStrip = GameFramework.BaseApp.mApp.mResourceManager.GetImageResourceById(aResourceStreamer.mId);
        } else {
            this.mImageStrip = aResourceStreamer.mResultData;
        }
    }
}
GameFramework.resources.PITexture.staticInit = function GameFramework_resources_PITexture$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PITexture.registerClass('GameFramework.resources.PITexture', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PITexture.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PILifeValueSample = function GameFramework_resources_PILifeValueSample() {
}
GameFramework.resources.PILifeValueSample.prototype = {
    mSizeX : 0,
    mSizeY : 0,
    mVelocity : 0,
    mWeight : 0,
    mSpin : 0,
    mMotionRand : 0,
    mColor : 0,
    Dispose : function GameFramework_resources_PILifeValueSample$Dispose() {
    }
}
GameFramework.resources.PILifeValueSample.staticInit = function GameFramework_resources_PILifeValueSample$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PILifeValueSample.registerClass('GameFramework.resources.PILifeValueSample', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PILifeValueSample.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PILifeValueTable = function GameFramework_resources_PILifeValueTable() {
}
GameFramework.resources.PILifeValueTable.prototype = {
    mLifeValuesSampleTable : null,
    Dispose : function GameFramework_resources_PILifeValueTable$Dispose() {
    }
}
GameFramework.resources.PILifeValueTable.staticInit = function GameFramework_resources_PILifeValueTable$staticInit() {
    GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE = 32;
    GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT = (31 - 5);
}

JS_AddInitFunc(function() {
    GameFramework.resources.PILifeValueTable.registerClass('GameFramework.resources.PILifeValueTable', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PILifeValueTable.staticInit();
});
GameFramework.resources.PILifeValueTable.LifeValue = {};
GameFramework.resources.PILifeValueTable.LifeValue.staticInit = function GameFramework_resources_PILifeValueTable_LifeValue$staticInit() {
    GameFramework.resources.PILifeValueTable.LifeValue.SIZE_X = 0;
    GameFramework.resources.PILifeValueTable.LifeValue.SIZE_Y = 1;
    GameFramework.resources.PILifeValueTable.LifeValue.VELOCITY = 2;
    GameFramework.resources.PILifeValueTable.LifeValue.WEIGHT = 3;
    GameFramework.resources.PILifeValueTable.LifeValue.SPIN = 4;
    GameFramework.resources.PILifeValueTable.LifeValue.MOTION_RAND = 5;
    GameFramework.resources.PILifeValueTable.LifeValue.COLOR = 6;
    GameFramework.resources.PILifeValueTable.LifeValue.ALPHA = 7;
    GameFramework.resources.PILifeValueTable.LifeValue.__COUNT = 8;
}
JS_AddInitFunc(function() {
    GameFramework.resources.PILifeValueTable.LifeValue.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIParticleDef = function GameFramework_resources_PIParticleDef() {
}
GameFramework.resources.PIParticleDef.prototype = {
    mLifeValueTable : null,
    mParent : null,
    mName : null,
    mTextureIdx : 0,
    mTextureChunkVector : null,
    mValues : null,
    mRefPointOfs : null,
    mLockAspect : null,
    mIntense : null,
    mSingleParticle : null,
    mPreserveColor : null,
    mAttachToEmitter : null,
    mAnimSpeed : 0,
    mAnimStartOnRandomFrame : null,
    mAttachVal : 0,
    mFlipHorz : null,
    mFlipVert : null,
    mRepeatColor : 0,
    mRepeatAlpha : 0,
    mRandomGradientColor : null,
    mUseNextColorKey : null,
    mGetColorFromLayer : null,
    mUpdateColorFromLayer : null,
    mGetTransparencyFromLayer : null,
    mUpdateTransparencyFromLayer : null,
    mNumberOfEachColor : 0,
    mLinkTransparencyToColor : null,
    mUseKeyColorsOnly : null,
    mUseEmitterAngleAndRange : null,
    mAngleAlignToMotion : null,
    mAngleKeepAlignedToMotion : null,
    mAngleRandomAlign : null,
    mAngleAlignOffset : 0,
    mAngleValue : 0,
    mAngleRange : 0,
    mAngleOffset : 0,
    mCalcParticleTransformWantsBaseRotTrans : null,
    mColor : null,
    mAlpha : null,
    Dispose : function GameFramework_resources_PIParticleDef$Dispose() {
    }
}
GameFramework.resources.PIParticleDef.staticInit = function GameFramework_resources_PIParticleDef$staticInit() {
    GameFramework.resources.PIParticleDef.mPILifeValueTableMap = {};
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIParticleDef.registerClass('GameFramework.resources.PIParticleDef', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIParticleDef.staticInit();
});
GameFramework.resources.PIParticleDef.Value = {};
GameFramework.resources.PIParticleDef.Value.staticInit = function GameFramework_resources_PIParticleDef_Value$staticInit() {
    GameFramework.resources.PIParticleDef.Value.LIFE = 0;
    GameFramework.resources.PIParticleDef.Value.NUMBER = 1;
    GameFramework.resources.PIParticleDef.Value.SIZE_X = 2;
    GameFramework.resources.PIParticleDef.Value.VELOCITY = 3;
    GameFramework.resources.PIParticleDef.Value.WEIGHT = 4;
    GameFramework.resources.PIParticleDef.Value.SPIN = 5;
    GameFramework.resources.PIParticleDef.Value.MOTION_RAND = 6;
    GameFramework.resources.PIParticleDef.Value.BOUNCE = 7;
    GameFramework.resources.PIParticleDef.Value.LIFE_VARIATION = 8;
    GameFramework.resources.PIParticleDef.Value.NUMBER_VARIATION = 9;
    GameFramework.resources.PIParticleDef.Value.SIZE_X_VARIATION = 10;
    GameFramework.resources.PIParticleDef.Value.VELOCITY_VARIATION = 11;
    GameFramework.resources.PIParticleDef.Value.WEIGHT_VARIATION = 12;
    GameFramework.resources.PIParticleDef.Value.SPIN_VARIATION = 13;
    GameFramework.resources.PIParticleDef.Value.MOTION_RAND_VARIATION = 14;
    GameFramework.resources.PIParticleDef.Value.BOUNCE_VARIATION = 15;
    GameFramework.resources.PIParticleDef.Value.SIZE_X_OVER_LIFE = 16;
    GameFramework.resources.PIParticleDef.Value.VELOCITY_OVER_LIFE = 17;
    GameFramework.resources.PIParticleDef.Value.WEIGHT_OVER_LIFE = 18;
    GameFramework.resources.PIParticleDef.Value.SPIN_OVER_LIFE = 19;
    GameFramework.resources.PIParticleDef.Value.MOTION_RAND_OVER_LIFE = 20;
    GameFramework.resources.PIParticleDef.Value.BOUNCE_OVER_LIFE = 21;
    GameFramework.resources.PIParticleDef.Value.VISIBILITY = 22;
    GameFramework.resources.PIParticleDef.Value.EMISSION_ANGLE = 23;
    GameFramework.resources.PIParticleDef.Value.EMISSION_RANGE = 24;
    GameFramework.resources.PIParticleDef.Value.SIZE_Y = 25;
    GameFramework.resources.PIParticleDef.Value.SIZE_Y_VARIATION = 26;
    GameFramework.resources.PIParticleDef.Value.SIZE_Y_OVER_LIFE = 27;
    GameFramework.resources.PIParticleDef.Value.__COUNT = 28;
}
JS_AddInitFunc(function() {
    GameFramework.resources.PIParticleDef.Value.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIEmitter = function GameFramework_resources_PIEmitter() {
}
GameFramework.resources.PIEmitter.prototype = {
    mName : null,
    mValues : null,
    mParticleDefVector : null,
    mKeepInOrder : null,
    mOldestInFront : null,
    mIsSuperEmitter : null,
    mCurWeight : 0,
    mCurSpin : 0,
    mCurMotionRand : 0,
    Dispose : function GameFramework_resources_PIEmitter$Dispose() {
    }
}
GameFramework.resources.PIEmitter.staticInit = function GameFramework_resources_PIEmitter$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIEmitter.registerClass('GameFramework.resources.PIEmitter', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIEmitter.staticInit();
});
GameFramework.resources.PIEmitter.Value = {};
GameFramework.resources.PIEmitter.Value.staticInit = function GameFramework_resources_PIEmitter_Value$staticInit() {
    GameFramework.resources.PIEmitter.Value.F_LIFE = 0;
    GameFramework.resources.PIEmitter.Value.F_NUMBER = 1;
    GameFramework.resources.PIEmitter.Value.F_VELOCITY = 2;
    GameFramework.resources.PIEmitter.Value.F_WEIGHT = 3;
    GameFramework.resources.PIEmitter.Value.F_SPIN = 4;
    GameFramework.resources.PIEmitter.Value.F_MOTION_RAND = 5;
    GameFramework.resources.PIEmitter.Value.F_BOUNCE = 6;
    GameFramework.resources.PIEmitter.Value.F_ZOOM = 7;
    GameFramework.resources.PIEmitter.Value.LIFE = 8;
    GameFramework.resources.PIEmitter.Value.NUMBER = 9;
    GameFramework.resources.PIEmitter.Value.SIZE_X = 10;
    GameFramework.resources.PIEmitter.Value.SIZE_Y = 11;
    GameFramework.resources.PIEmitter.Value.VELOCITY = 12;
    GameFramework.resources.PIEmitter.Value.WEIGHT = 13;
    GameFramework.resources.PIEmitter.Value.SPIN = 14;
    GameFramework.resources.PIEmitter.Value.MOTION_RAND = 15;
    GameFramework.resources.PIEmitter.Value.BOUNCE = 16;
    GameFramework.resources.PIEmitter.Value.ZOOM = 17;
    GameFramework.resources.PIEmitter.Value.VISIBILITY = 18;
    GameFramework.resources.PIEmitter.Value.UNKNOWN3 = 19;
    GameFramework.resources.PIEmitter.Value.TINT_STRENGTH = 20;
    GameFramework.resources.PIEmitter.Value.EMISSION_ANGLE = 21;
    GameFramework.resources.PIEmitter.Value.EMISSION_RANGE = 22;
    GameFramework.resources.PIEmitter.Value.F_LIFE_VARIATION = 23;
    GameFramework.resources.PIEmitter.Value.F_NUMBER_VARIATION = 24;
    GameFramework.resources.PIEmitter.Value.F_SIZE_X_VARIATION = 25;
    GameFramework.resources.PIEmitter.Value.F_SIZE_Y_VARIATION = 26;
    GameFramework.resources.PIEmitter.Value.F_VELOCITY_VARIATION = 27;
    GameFramework.resources.PIEmitter.Value.F_WEIGHT_VARIATION = 28;
    GameFramework.resources.PIEmitter.Value.F_SPIN_VARIATION = 29;
    GameFramework.resources.PIEmitter.Value.F_MOTION_RAND_VARIATION = 30;
    GameFramework.resources.PIEmitter.Value.F_BOUNCE_VARIATION = 31;
    GameFramework.resources.PIEmitter.Value.F_ZOOM_VARIATION = 32;
    GameFramework.resources.PIEmitter.Value.F_NUMBER_OVER_LIFE = 33;
    GameFramework.resources.PIEmitter.Value.F_SIZE_X_OVER_LIFE = 34;
    GameFramework.resources.PIEmitter.Value.F_SIZE_Y_OVER_LIFE = 35;
    GameFramework.resources.PIEmitter.Value.F_VELOCITY_OVER_LIFE = 36;
    GameFramework.resources.PIEmitter.Value.F_WEIGHT_OVER_LIFE = 37;
    GameFramework.resources.PIEmitter.Value.F_SPIN_OVER_LIFE = 38;
    GameFramework.resources.PIEmitter.Value.F_MOTION_RAND_OVER_LIFE = 39;
    GameFramework.resources.PIEmitter.Value.F_BOUNCE_OVER_LIFE = 40;
    GameFramework.resources.PIEmitter.Value.F_ZOOM_OVER_LIFE = 41;
    GameFramework.resources.PIEmitter.Value.__COUNT = 42;
}
JS_AddInitFunc(function() {
    GameFramework.resources.PIEmitter.Value.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIParticleInstance = function GameFramework_resources_PIParticleInstance() {
    this.mVariationValues = Array.Create((GameFramework.resources.PIParticleInstance.Variation.__COUNT | 0), null);
    this.mTransform = new GameFramework.geom.Matrix();
    this.mPrev = null;
    this.mNext = null;
    this.mTransformScaleFactor = 1.0;
    this.mImgIdx = 0;
    this.mBkgColor = 0xffffffff;
    this.mSrcSizeXMult = 1.0;
    this.mSrcSizeYMult = 1.0;
    this.mParentFreeEmitter = null;
    this.mHasDrawn = false;
}
GameFramework.resources.PIParticleInstance.prototype = {
    mNext : null,
    mParticleDef : null,
    mParticleDefInstance : null,
    mPos : null,
    mVel : null,
    mImgAngle : 0,
    mImgIdx : 0,
    mLifePctInt : 0,
    mLifePctIntInc : 0,
    mVariationValues : null,
    mColorMask : 0,
    mColorOr : 0,
    mTicks : 0,
    mLife : 0,
    mLifePct : 0,
    mLifePctInc : 0,
    mLifeValueDeltaIdx : 0,
    mEmitterSrc : null,
    mNum : 0,
    mPrev : null,
    mParentFreeEmitter : null,
    mOrigPos : null,
    mEmittedPos : null,
    mLastEmitterPos : null,
    mZoom : 0,
    mSrcSizeXMult : 0,
    mSrcSizeYMult : 0,
    mGradientRand : 0,
    mOrigEmitterAng : 0,
    mAnimFrameRand : 0,
    mTransform : null,
    mTextureChunk : null,
    mTransformScaleFactor : 0,
    mThicknessHitVariation : 0,
    mHasDrawn : null,
    mBkgColor : 0,
    mImage : null,
    mSrcRect : null,
    Dispose : function GameFramework_resources_PIParticleInstance$Dispose() {
    }
}
GameFramework.resources.PIParticleInstance.staticInit = function GameFramework_resources_PIParticleInstance$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIParticleInstance.registerClass('GameFramework.resources.PIParticleInstance', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIParticleInstance.staticInit();
});
GameFramework.resources.PIParticleInstance.Variation = {};
GameFramework.resources.PIParticleInstance.Variation.staticInit = function GameFramework_resources_PIParticleInstance_Variation$staticInit() {
    GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND = 0;
    GameFramework.resources.PIParticleInstance.Variation.VELOCITY = 1;
    GameFramework.resources.PIParticleInstance.Variation.WEIGHT = 2;
    GameFramework.resources.PIParticleInstance.Variation.SPIN = 3;
    GameFramework.resources.PIParticleInstance.Variation.SIZE_X = 4;
    GameFramework.resources.PIParticleInstance.Variation.SIZE_Y = 5;
    GameFramework.resources.PIParticleInstance.Variation.BOUNCE = 6;
    GameFramework.resources.PIParticleInstance.Variation.LIFE = 7;
    GameFramework.resources.PIParticleInstance.Variation.ZOOM = 8;
    GameFramework.resources.PIParticleInstance.Variation.__COUNT = 9;
}
JS_AddInitFunc(function() {
    GameFramework.resources.PIParticleInstance.Variation.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIParticleDefInstance = function GameFramework_resources_PIParticleDefInstance() {
    this.Reset();
}
GameFramework.resources.PIParticleDefInstance.prototype = {
    mNumberAcc : 0,
    mCurNumberVariation : 0,
    mParticlesEmitted : 0,
    mTicks : 0,
    mAlphaI : 0,
    mCurWeight : 0,
    mCurSpin : 0,
    mCurMotionRand : 0,
    Reset : function GameFramework_resources_PIParticleDefInstance$Reset() {
        this.mNumberAcc = 0;
        this.mCurNumberVariation = 0;
        this.mParticlesEmitted = 0;
        this.mTicks = 0;
    },
    Dispose : function GameFramework_resources_PIParticleDefInstance$Dispose() {
    }
}
GameFramework.resources.PIParticleDefInstance.staticInit = function GameFramework_resources_PIParticleDefInstance$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIParticleDefInstance.registerClass('GameFramework.resources.PIParticleDefInstance', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIParticleDefInstance.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIParticleGroup = function GameFramework_resources_PIParticleGroup() {
    this.mIsSuperEmitter = false;
    this.mWasEmitted = false;
    this.mHead = null;
    this.mTail = null;
    this.mCount = 0;
    this.mHasColorSampling = false;
    this.mHasVelocityEffectors = false;
    this.mHasAlignToMotion = false;
    this.mHasIntense = false;
    this.mHasPreserveColor = false;
    this.mHasSingleParticles = false;
    this.mHasAttachToEmitters = false;
    this.mHasImageCycle = false;
    this.mHasDeferredUpdate = false;
}
GameFramework.resources.PIParticleGroup.prototype = {
    mHead : null,
    mTail : null,
    mCount : 0,
    mIsSuperEmitter : null,
    mWasEmitted : null,
    mHasColorSampling : null,
    mHasVelocityEffectors : null,
    mHasAlignToMotion : null,
    mHasIntense : null,
    mHasPreserveColor : null,
    mHasSingleParticles : null,
    mHasAttachToEmitters : null,
    mHasImageCycle : null,
    mHasDeferredUpdate : null,
    Dispose : function GameFramework_resources_PIParticleGroup$Dispose() {
    }
}
GameFramework.resources.PIParticleGroup.staticInit = function GameFramework_resources_PIParticleGroup$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIParticleGroup.registerClass('GameFramework.resources.PIParticleGroup', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIParticleGroup.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIEmitterBase = function GameFramework_resources_PIEmitterBase() {
    this.mParticleGroup = new GameFramework.resources.PIParticleGroup();
}
GameFramework.resources.PIEmitterBase.prototype = {
    mParticleDefInstanceVector : null,
    mParticleGroup : null,
    Dispose : function GameFramework_resources_PIEmitterBase$Dispose() {
        this.mParticleGroup.Dispose();
    }
}
GameFramework.resources.PIEmitterBase.staticInit = function GameFramework_resources_PIEmitterBase$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIEmitterBase.registerClass('GameFramework.resources.PIEmitterBase', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIEmitterBase.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIFreeEmitterInstance = function GameFramework_resources_PIFreeEmitterInstance() {
    this.mEmitter = new GameFramework.resources.PIEmitterBase();
    GameFramework.resources.PIFreeEmitterInstance.initializeBase(this);
    this.mEmitter.mParticleGroup.mWasEmitted = true;
}
GameFramework.resources.PIFreeEmitterInstance.prototype = {
    mEmitter : null,
    Dispose : function GameFramework_resources_PIFreeEmitterInstance$Dispose() {
        this.mEmitter.Dispose();
        GameFramework.resources.PIParticleInstance.prototype.Dispose.apply(this);
    }
}
GameFramework.resources.PIFreeEmitterInstance.staticInit = function GameFramework_resources_PIFreeEmitterInstance$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIFreeEmitterInstance.registerClass('GameFramework.resources.PIFreeEmitterInstance', GameFramework.resources.PIParticleInstance);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIFreeEmitterInstance.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIEmitterInstanceDef = function GameFramework_resources_PIEmitterInstanceDef() {
}
GameFramework.resources.PIEmitterInstanceDef.prototype = {
    mName : null,
    mFramesToPreload : 0,
    mEmitterDefIdx : 0,
    mEmitterGeom : null,
    mEmitIn : null,
    mEmitOut : null,
    mEmitAtPointsNum : 0,
    mEmitAtPointsNum2 : 0,
    mIsSuperEmitter : null,
    mFreeEmitterIndices : null,
    mInvertMask : null,
    mPosition : null,
    mValues : null,
    mPoints : null,
    mCurAngle : 0,
    Dispose : function GameFramework_resources_PIEmitterInstanceDef$Dispose() {
    }
}
GameFramework.resources.PIEmitterInstanceDef.staticInit = function GameFramework_resources_PIEmitterInstanceDef$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIEmitterInstanceDef.registerClass('GameFramework.resources.PIEmitterInstanceDef', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIEmitterInstanceDef.staticInit();
});
GameFramework.resources.PIEmitterInstanceDef.Value = {};
GameFramework.resources.PIEmitterInstanceDef.Value.staticInit = function GameFramework_resources_PIEmitterInstanceDef_Value$staticInit() {
    GameFramework.resources.PIEmitterInstanceDef.Value.LIFE = 0;
    GameFramework.resources.PIEmitterInstanceDef.Value.NUMBER = 1;
    GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_X = 2;
    GameFramework.resources.PIEmitterInstanceDef.Value.VELOCITY = 3;
    GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT = 4;
    GameFramework.resources.PIEmitterInstanceDef.Value.SPIN = 5;
    GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND = 6;
    GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE = 7;
    GameFramework.resources.PIEmitterInstanceDef.Value.ZOOM = 8;
    GameFramework.resources.PIEmitterInstanceDef.Value.VISIBILITY = 9;
    GameFramework.resources.PIEmitterInstanceDef.Value.TINT_STRENGTH = 10;
    GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_ANGLE = 11;
    GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_RANGE = 12;
    GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE = 13;
    GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE = 14;
    GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS = 15;
    GameFramework.resources.PIEmitterInstanceDef.Value.YRADIUS = 16;
    GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_Y = 17;
    GameFramework.resources.PIEmitterInstanceDef.Value.UNKNOWN4 = 18;
    GameFramework.resources.PIEmitterInstanceDef.Value.__COUNT = 19;
}
JS_AddInitFunc(function() {
    GameFramework.resources.PIEmitterInstanceDef.Value.staticInit();
});
GameFramework.resources.PIEmitterInstanceDef.Geom = {};
GameFramework.resources.PIEmitterInstanceDef.Geom.staticInit = function GameFramework_resources_PIEmitterInstanceDef_Geom$staticInit() {
    GameFramework.resources.PIEmitterInstanceDef.Geom.POINT = 0;
    GameFramework.resources.PIEmitterInstanceDef.Geom.LINE = 1;
    GameFramework.resources.PIEmitterInstanceDef.Geom.ECLIPSE = 2;
    GameFramework.resources.PIEmitterInstanceDef.Geom.AREA = 3;
    GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE = 4;
}
JS_AddInitFunc(function() {
    GameFramework.resources.PIEmitterInstanceDef.Geom.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIEmitterInstance = function GameFramework_resources_PIEmitterInstance() {
    this.mSuperEmitterGroup = new GameFramework.resources.PIParticleGroup();
    this.mTransform = new GameFramework.geom.Matrix();
    this.mOffset = new GameFramework.geom.TPoint();
    GameFramework.resources.PIEmitterInstance.initializeBase(this);
    this.mWasActive = false;
    this.mWithinLifeFrame = true;
    this.mSuperEmitterGroup.mIsSuperEmitter = true;
    this.mNumberScale = 1.0;
    this.mVisible = true;
}
GameFramework.resources.PIEmitterInstance.prototype = {
    mEmitterInstanceDef : null,
    mWasActive : null,
    mWithinLifeFrame : null,
    mSuperEmitterParticleDefInstanceVector : null,
    mSuperEmitterGroup : null,
    mTintColorI : 0,
    mTransformSimple : null,
    mTintColor : 0,
    mMaskImage : null,
    mTransform : null,
    mOffset : null,
    mNumberScale : 0,
    mVisible : null,
    SetVisible : function GameFramework_resources_PIEmitterInstance$SetVisible(isVisible) {
        this.mVisible = isVisible;
    },
    Dispose : function GameFramework_resources_PIEmitterInstance$Dispose() {
        this.mSuperEmitterGroup.Dispose();
        GameFramework.resources.PIEmitterBase.prototype.Dispose.apply(this);
    }
}
GameFramework.resources.PIEmitterInstance.staticInit = function GameFramework_resources_PIEmitterInstance$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIEmitterInstance.registerClass('GameFramework.resources.PIEmitterInstance', GameFramework.resources.PIEmitterBase);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIEmitterInstance.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIDeflector = function GameFramework_resources_PIDeflector() {
}
GameFramework.resources.PIDeflector.prototype = {
    mName : null,
    mBounce : 0,
    mHits : 0,
    mThickness : 0,
    mVisible : null,
    mPos : null,
    mActive : null,
    mAngle : null,
    mPoints : null,
    mCurPoints : null
}
GameFramework.resources.PIDeflector.staticInit = function GameFramework_resources_PIDeflector$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIDeflector.registerClass('GameFramework.resources.PIDeflector', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIDeflector.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIBlocker = function GameFramework_resources_PIBlocker() {
}
GameFramework.resources.PIBlocker.prototype = {
    mName : null,
    mUseLayersBelowForBg : null,
    mPos : null,
    mActive : null,
    mAngle : null,
    mPoints : null
}
GameFramework.resources.PIBlocker.staticInit = function GameFramework_resources_PIBlocker$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIBlocker.registerClass('GameFramework.resources.PIBlocker', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIBlocker.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIForce = function GameFramework_resources_PIForce() {
    this.mCurPoints = Array.Create(5, null);
}
GameFramework.resources.PIForce.prototype = {
    mName : null,
    mVisible : null,
    mPos : null,
    mStrength : null,
    mDirection : null,
    mActive : null,
    mAngle : null,
    mWidth : null,
    mHeight : null,
    mCurPoints : null
}
GameFramework.resources.PIForce.staticInit = function GameFramework_resources_PIForce$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIForce.registerClass('GameFramework.resources.PIForce', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIForce.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PILayerDef = function GameFramework_resources_PILayerDef() {
    this.mOrigOffset = new GameFramework.geom.TPoint();
}
GameFramework.resources.PILayerDef.prototype = {
    mName : null,
    mEmitterInstanceDefVector : null,
    mDeflectorVector : null,
    mBlockerVector : null,
    mForceVector : null,
    mOffset : null,
    mOrigOffset : null,
    mAngle : null,
    Dispose : function GameFramework_resources_PILayerDef$Dispose() {
    }
}
GameFramework.resources.PILayerDef.staticInit = function GameFramework_resources_PILayerDef$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PILayerDef.registerClass('GameFramework.resources.PILayerDef', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PILayerDef.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PILayer = function GameFramework_resources_PILayer() {
    this.mCurOffset = new GameFramework.geom.TPoint();
    this.mVisible = true;
    this.mColor = 0xffffffff;
    this.mBkgImage = null;
}
GameFramework.resources.PILayer.prototype = {
    mLayerDef : null,
    mEmitterInstanceVector : null,
    mCurOffset : null,
    mCurAngle : 0,
    mVisible : null,
    mColor : 0,
    mBkgImage : null,
    mBkgImgDrawOfs : null,
    mBkgTransform : null,
    Dispose : function GameFramework_resources_PILayer$Dispose() {
    },
    SetVisible : function GameFramework_resources_PILayer$SetVisible(isVisible) {
        this.mVisible = isVisible;
    },
    GetEmitter : function GameFramework_resources_PILayer$GetEmitter(theIdx) {
        if(theIdx < (this.mEmitterInstanceVector.length | 0)) {
            return this.mEmitterInstanceVector[theIdx];
        }
        return null;
    },
    GetEmitter$2 : function GameFramework_resources_PILayer$GetEmitter$2(theName) {
        for(var i = 0; i < (this.mEmitterInstanceVector.length | 0); i++) {
            if((theName.length == 0) || (this.mEmitterInstanceVector[i].mEmitterInstanceDef.mName == theName)) {
                return this.mEmitterInstanceVector[i];
            }
        }
        return null;
    }
}
GameFramework.resources.PILayer.staticInit = function GameFramework_resources_PILayer$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PILayer.registerClass('GameFramework.resources.PILayer', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PILayer.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIEffectDef = function GameFramework_resources_PIEffectDef() {
    this.mCountScale = 1.0;
    this.mRefCount = 1;
}
GameFramework.resources.PIEffectDef.prototype = {
    mRefCount : 0,
    mCountScale : 0,
    mEmitterVector : null,
    mTextureVector : null,
    mLayerDefVector : null,
    mEmitterRefMap : null,
    Dispose : function GameFramework_resources_PIEffectDef$Dispose() {
    }
}
GameFramework.resources.PIEffectDef.staticInit = function GameFramework_resources_PIEffectDef$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIEffectDef.registerClass('GameFramework.resources.PIEffectDef', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIEffectDef.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PIEffect = function GameFramework_resources_PIEffect() {
    this.mStringVector = [];
    this.mDrawTransform = new GameFramework.geom.Matrix();
    this.mEmitterTransform = new GameFramework.geom.Matrix();
    this.mLoaded = false;
    this.mFileIdx = 0;
    this.mAutoPadImages = true;
    this.mFrameNum = 0;
    this.mUpdateCnt = 0;
    this.mCurNumParticles = 0;
    this.mCurNumEmitters = 0;
    this.mLastDrawnPixelCount = 0;
    this.mFirstFrameNum = 0;
    this.mLastFrameNum = 0;
    this.mWantsSRand = true;
    this.mAnimSpeed = 1.0;
    this.mColor = 0xffffffff;
    this.mDebug = false;
    this.mDrawBlockers = true;
    this.mEmitAfterTimeline = false;
    this.mFrameTime = GameFramework.BaseApp.mApp.mFrameTime;
    if(this.mFrameTime < 10) {
        this.mFrameTime *= 2.0;
    }
    this.mDef = new GameFramework.resources.PIEffectDef();
}
GameFramework.resources.PIEffect.WrapFloat = function GameFramework_resources_PIEffect$WrapFloat(theNum, theRepeat) {
    if(theRepeat == 1) {
        return theNum;
    } else {
        theNum *= theRepeat;
        return theNum - (theNum | 0);
    }
}
GameFramework.resources.PIEffect.DegToRad = function GameFramework_resources_PIEffect$DegToRad(theDeg) {
    return theDeg * 3.14159 / 180.0;
}
GameFramework.resources.PIEffect.LineSegmentIntersects = function GameFramework_resources_PIEffect$LineSegmentIntersects(aPtA1, aPtA2, aPtB1, aPtB2) {
    var aDenom = (aPtB2.y - aPtB1.y) * (aPtA2.x - aPtA1.x) - (aPtB2.x - aPtB1.x) * (aPtA2.y - aPtA1.y);
    if(aDenom != 0) {
        var aUa = ((aPtB2.x - aPtB1.x) * (aPtA1.y - aPtB1.y) - (aPtB2.y - aPtB1.y) * (aPtA1.x - aPtB1.x)) / aDenom;
        if(aUa >= 0.0 && aUa <= 1.0) {
            var aUb = ((aPtA2.x - aPtA1.x) * (aPtA1.y - aPtB1.y) - (aPtA2.y - aPtA1.y) * (aPtA1.x - aPtB1.x)) / aDenom;
            if(aUb >= 0.0 && aUb <= 1.0) {
                var aRetVal = Array.Create(3, 3, aUa, aPtA1.x + (aPtA2.x - aPtA1.x) * aUa, aPtA1.y + (aPtA2.y - aPtA1.y) * aUa);
                return aRetVal;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}
GameFramework.resources.PIEffect.IntegrateAffectors = function GameFramework_resources_PIEffect$IntegrateAffectors(thePIEffect, theLayer, theEmitterInstance, theEmitter, theParticleDef, theParticleGroup, theCurVel, theLayerDef, theParticleInstance) {
    var aCurPhysPoint = null;
    if((theParticleInstance.mLifePctInt == theParticleInstance.mLifePctIntInc) && (theLayerDef.mDeflectorVector.length > 0)) {
        var aPrevPhysPoint = theParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
        var aPrevPos = theParticleInstance.mPos;
        theParticleInstance.mPos.x += theCurVel.x;
        theParticleInstance.mPos.y += theCurVel.y;
        thePIEffect.CalcParticleTransform(theLayer, theEmitterInstance, theEmitter, theParticleDef, theParticleGroup, theParticleInstance);
        aCurPhysPoint = theParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
        for(var aDeflectorIdx = 0; aDeflectorIdx < (theLayerDef.mDeflectorVector.length | 0); aDeflectorIdx++) {
            var aDeflector = theLayerDef.mDeflectorVector[aDeflectorIdx];
            if(aDeflector.mActive.GetLastKeyframe(thePIEffect.mFrameNum) < 0.99) {
                continue;
            }
            for(var aPtIdx = 1; aPtIdx < (aDeflector.mCurPoints.length | 0); aPtIdx++) {
                var aPt1 = aDeflector.mCurPoints[aPtIdx - 1].subtract(new GameFramework.geom.TPoint(thePIEffect.mDrawTransform.tx, thePIEffect.mDrawTransform.ty));
                var aPt2 = aDeflector.mCurPoints[aPtIdx].subtract(new GameFramework.geom.TPoint(thePIEffect.mDrawTransform.tx, thePIEffect.mDrawTransform.ty));
                var aLineDir = new GameFramework.geom.TPoint(aPt2.x - aPt1.x, aPt2.y - aPt1.y);
                var aLineNormal = aLineDir.clone();
                aLineNormal.normalize(1.0);
                var aTemp = aLineNormal.x;
                aLineNormal.x = -aLineNormal.y;
                aLineNormal.y = aTemp;
                var aLineTranslate = new GameFramework.geom.TPoint(aLineNormal.x, aLineNormal.y);
                aLineTranslate.x = aLineTranslate.x * aDeflector.mThickness * theParticleInstance.mThicknessHitVariation;
                aLineTranslate.y = aLineTranslate.y * aDeflector.mThickness * theParticleInstance.mThicknessHitVariation;
                var aLineSegmentResult = GameFramework.resources.PIEffect.LineSegmentIntersects(aPrevPhysPoint, aCurPhysPoint, aPt1.add(aLineTranslate), aPt2.add(aLineTranslate));
                if(aLineSegmentResult != null) {
                    var aCollPoint = new GameFramework.geom.TPoint(aLineSegmentResult[1], aLineSegmentResult[2]);
                    if(thePIEffect.GetRandFloatU() > aDeflector.mHits) {
                        continue;
                    }
                    var aLifePct = theParticleInstance.mLifePctInt / 0x7fffffff;
                    var aBounce = aDeflector.mBounce;
                    if(theParticleGroup.mIsSuperEmitter) {
                        aBounce *= ((theParticleGroup.mWasEmitted ? (theEmitter.mValues[(GameFramework.resources.PIEmitter.Value.BOUNCE | 0)].GetValueAt(thePIEffect.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0)].GetValueAt(thePIEffect.mFrameNum))) * (theEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_BOUNCE_OVER_LIFE | 0)].GetValueAt(aLifePct, 1.0)) * ((theEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_BOUNCE | 0)].GetValueAt(thePIEffect.mFrameNum)) + (theParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0)])));
                    } else {
                        aBounce *= ((theParticleGroup.mWasEmitted ? (theEmitter.mValues[(GameFramework.resources.PIEmitter.Value.BOUNCE | 0)].GetValueAt(thePIEffect.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0)].GetValueAt(thePIEffect.mFrameNum))) * (theParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.BOUNCE_OVER_LIFE | 0)].GetValueAt(aLifePct)) * ((theParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.BOUNCE | 0)].GetValueAt(thePIEffect.mFrameNum)) + (theParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0)])));
                    }
                    var aCurVelVec = new GameFramework.geom.TPoint(theCurVel.x, theCurVel.y);
                    var aDot = aCurVelVec.x * aLineNormal.x + aCurVelVec.y * aLineNormal.y;
                    var aNewVel = new GameFramework.geom.TPoint(aCurVelVec.x - aLineNormal.x * 2 * aDot, aCurVelVec.y - aLineNormal.y * 2 * aDot);
                    var aPctBounce = Math.min(1.0, Math.abs(aNewVel.y / aNewVel.x));
                    aNewVel.y *= (1.0 - aPctBounce) + aPctBounce * Math.pow(aBounce, (0.5));
                    theParticleInstance.mVel.x = aNewVel.x * 100.0;
                    theParticleInstance.mVel.y = aNewVel.y * 100.0;
                    if(aBounce > 0.001) {
                        theParticleInstance.mPos = aPrevPos;
                    }
                    thePIEffect.CalcParticleTransform(theLayer, theEmitterInstance, theEmitter, theParticleDef, theParticleGroup, theParticleInstance);
                    aCurPhysPoint = theParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
                }
            }
        }
    } else {
        theParticleInstance.mPos.x += theCurVel.x;
        theParticleInstance.mPos.y += theCurVel.y;
        if(theLayerDef.mForceVector.length > 0) {
            thePIEffect.CalcParticleTransform(theLayer, theEmitterInstance, theEmitter, theParticleDef, theParticleGroup, theParticleInstance);
            aCurPhysPoint = theParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
        }
    }
    for(var aForceIdx = 0; aForceIdx < (theLayerDef.mForceVector.length | 0); aForceIdx++) {
        var aForce = theLayerDef.mForceVector[aForceIdx];
        if(aForce.mActive.GetLastKeyframe(thePIEffect.mFrameNum) < 0.99) {
            continue;
        }
        var inside = false;
        var i;
        var j;
        for(i = 0, j = 4 - 1; i < 4; j = i++) {
            if((((aForce.mCurPoints[i].y <= aCurPhysPoint.y) && (aCurPhysPoint.y < aForce.mCurPoints[j].y)) || ((aForce.mCurPoints[j].y <= aCurPhysPoint.y) && (aCurPhysPoint.y < aForce.mCurPoints[i].y))) && (aCurPhysPoint.x < (aForce.mCurPoints[j].x - aForce.mCurPoints[i].x) * (aCurPhysPoint.y - aForce.mCurPoints[i].y) / (aForce.mCurPoints[j].y - aForce.mCurPoints[i].y) + aForce.mCurPoints[i].x)) {
                inside = !inside;
            }
        }
        if(inside) {
            var anAngle = GameFramework.resources.PIEffect.DegToRad(-aForce.mDirection.GetValueAt(thePIEffect.mFrameNum)) + GameFramework.resources.PIEffect.DegToRad(-aForce.mAngle.GetValueAt(thePIEffect.mFrameNum));
            var aFactor = 0.085 * thePIEffect.mFramerate / 100.0;
            aFactor *= 1.0 + (thePIEffect.mFramerate - 100.0) * 0.004;
            var aStrength = aForce.mStrength.GetValueAt(thePIEffect.mFrameNum) * aFactor;
            theParticleInstance.mVel.x += Math.cos(anAngle) * aStrength * 100.0;
            theParticleInstance.mVel.y += Math.sin(anAngle) * aStrength * 100.0;
        }
    }
}
GameFramework.resources.PIEffect.prototype = {
    mAllowDeferredUpdate : false,
    mGlobalAllowPreserveColor : true,
    mReadBuffer : null,
    mFileChecksum : 0,
    mIsPPF : null,
    mAutoPadImages : null,
    mVersion : 0,
    mSrcFileName : null,
    mDestFileName : null,
    mStartupState : null,
    mBufTemp : 0,
    mBufPos : 0,
    mChecksumPos : 0,
    mNotes : null,
    mFileIdx : 0,
    mStringVector : null,
    mWidth : 0,
    mHeight : 0,
    mBkgColor : 0,
    mFramerate : 0,
    mFirstFrameNum : 0,
    mLastFrameNum : 0,
    mThumbnail : null,
    mNotesParams : null,
    mDef : null,
    mLayerVector : null,
    mError : null,
    mLoaded : null,
    mUpdateCnt : 0,
    mFrameNum : 0,
    mIsNewFrame : null,
    mHasEmitterTransform : null,
    mHasDrawTransform : null,
    mDrawTransformSimple : null,
    mCurNumParticles : 0,
    mCurNumEmitters : 0,
    mLastDrawnPixelCount : 0,
    mAnimSpeed : 0,
    mColor : 0,
    mDebug : null,
    mDrawBlockers : null,
    mEmitAfterTimeline : null,
    mRandSeeds : null,
    mWantsSRand : null,
    mDrawTransform : null,
    mEmitterTransform : null,
    mFrameTime : 0,
    InitFrom : function GameFramework_resources_PIEffect$InitFrom(rhs) {
        if(--this.mDef.mRefCount == 0) {
            this.mDef.Dispose();
        }
        this.mFileChecksum = rhs.mFileChecksum;
        this.mSrcFileName = rhs.mSrcFileName;
        this.mVersion = rhs.mVersion;
        this.mStartupState = rhs.mStartupState;
        this.mNotes = rhs.mNotes;
        this.mWidth = rhs.mWidth;
        this.mHeight = rhs.mHeight;
        this.mBkgColor = rhs.mBkgColor;
        this.mFramerate = rhs.mFramerate;
        this.mFirstFrameNum = rhs.mFirstFrameNum;
        this.mLastFrameNum = rhs.mLastFrameNum;
        this.mNotesParams = rhs.mNotesParams;
        this.mError = rhs.mError;
        this.mLoaded = rhs.mLoaded;
        this.mAnimSpeed = rhs.mAnimSpeed;
        this.mColor = rhs.mColor;
        this.mDebug = rhs.mDebug;
        this.mDrawBlockers = rhs.mDrawBlockers;
        this.mEmitAfterTimeline = rhs.mEmitAfterTimeline;
        this.mRandSeeds = rhs.mRandSeeds;
        this.mWantsSRand = rhs.mWantsSRand;
        this.mDrawTransform = rhs.mDrawTransform;
        if(this.mDrawTransform != null) {
            this.mDrawTransform = this.mDrawTransform.clone();
        }
        this.mEmitterTransform = rhs.mEmitterTransform;
        if(this.mEmitterTransform != null) {
            this.mEmitterTransform = this.mEmitterTransform.clone();
        }
        this.mFrameTime = rhs.mFrameTime;
        this.mFileIdx = 0;
        this.mFrameNum = 0;
        this.mUpdateCnt = 0;
        this.mIsNewFrame = false;
        this.mHasEmitterTransform = false;
        this.mHasDrawTransform = false;
        this.mDrawTransformSimple = false;
        this.mCurNumParticles = 0;
        this.mCurNumEmitters = 0;
        this.mLastDrawnPixelCount = 0;
        this.mDef = rhs.mDef;
        this.mDef.mRefCount++;
        this.mLayerVector = [];
        this.mLayerVector.length = this.mDef.mLayerDefVector.length;
        for(var aLayerIdx = 0; aLayerIdx < (this.mLayerVector.length | 0); aLayerIdx++) {
            var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
            var aLayer;
            this.mLayerVector[aLayerIdx] = aLayer = new GameFramework.resources.PILayer();
            aLayer.mLayerDef = aLayerDef;
            aLayer.mEmitterInstanceVector = [];
            aLayer.mEmitterInstanceVector.length = aLayerDef.mEmitterInstanceDefVector.length;
            for(var anEmitterIdx = 0; anEmitterIdx < aLayerDef.mEmitterInstanceDefVector.length; anEmitterIdx++) {
                var aRHSEmitterInstance = rhs.mLayerVector[aLayerIdx].mEmitterInstanceVector[anEmitterIdx];
                var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterIdx];
                var anEmitterInstance;
                aLayer.mEmitterInstanceVector[anEmitterIdx] = anEmitterInstance = new GameFramework.resources.PIEmitterInstance();
                var anEmitter = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                anEmitterInstance.mEmitterInstanceDef = anEmitterInstanceDef;
                anEmitterInstance.mTintColor = aRHSEmitterInstance.mTintColor;
                anEmitterInstance.mParticleDefInstanceVector = [];
                anEmitterInstance.mParticleDefInstanceVector.length = anEmitter.mParticleDefVector.length;
                for(var i = 0; i < anEmitterInstance.mParticleDefInstanceVector.length; i++) {
                    anEmitterInstance.mParticleDefInstanceVector[i] = new GameFramework.resources.PIParticleDefInstance();
                }
                anEmitterInstance.mSuperEmitterParticleDefInstanceVector = [];
                anEmitterInstance.mSuperEmitterParticleDefInstanceVector.length = aRHSEmitterInstance.mSuperEmitterParticleDefInstanceVector.length;
                for(var i_2 = 0; i_2 < anEmitterInstance.mSuperEmitterParticleDefInstanceVector.length; i_2++) {
                    anEmitterInstance.mSuperEmitterParticleDefInstanceVector[i_2] = new GameFramework.resources.PIParticleDefInstance();
                }
            }
        }
        this.DetermineGroupFlags();
        this.ResetAnim();
    },
    Dispose : function GameFramework_resources_PIEffect$Dispose() {
        this.ResetAnim();

        {
            var $srcArray1 = this.mLayerVector;
            for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
                var aLayer = $srcArray1[$enum1];

                {
                    var $srcArray2 = aLayer.mEmitterInstanceVector;
                    for(var $enum2 = 0; $enum2 < $srcArray2.length; $enum2++) {
                        var anEmitterInstance = $srcArray2[$enum2];

                        {
                            var $srcArray3 = anEmitterInstance.mParticleDefInstanceVector;
                            for(var $enum3 = 0; $enum3 < $srcArray3.length; $enum3++) {
                                var aParticleDefInstance = $srcArray3[$enum3];
                                aParticleDefInstance.Dispose();
                            }
                        }
                        anEmitterInstance.Dispose();
                    }
                }
                aLayer.Dispose();
            }
        }
        this.mLayerVector = null;
        if(--this.mDef.mRefCount == 0) {
            this.mDef.Dispose();
        }
    },
    IsIdentityMatrix : function GameFramework_resources_PIEffect$IsIdentityMatrix(theMatrix) {
        return (theMatrix.a == 1.0) && (theMatrix.b == 0.0) && (theMatrix.c == 0.0) && (theMatrix.d == 1.0) && (theMatrix.tx == 0.0) && (theMatrix.ty == 0.0);
    },
    InterpColor : function GameFramework_resources_PIEffect$InterpColor(theColor1, theColor2, thePct) {
        var Pct = ((thePct * 256.0) | 0);
        var InvPct = 256 - Pct;
        var aColor = (theColor1 & 0xff000000) | (((((theColor1 & 0xff00ff) * InvPct) + ((theColor2 & 0xff00ff) * Pct)) >>> 8) & 0xff00ff) | (((((theColor1 & 0xff00) * InvPct) + ((theColor2 & 0xff00) * Pct)) >>> 8) & 0xff00);
        return aColor;
    },
    InterpColorI : function GameFramework_resources_PIEffect$InterpColorI(theColor1, theColor2, Pct) {
        var InvPct = ((256 - Pct) | 0);
        var aColor = (theColor1 & 0xff000000) | ((((((theColor1 & 0xff00ff) * InvPct) | 0) + (((theColor2 & 0xff00ff) * Pct) | 0)) >>> 8) & 0xff00ff) | ((((((theColor1 & 0xff00) * InvPct) | 0) + (((theColor2 & 0xff00) * Pct) | 0)) >>> 8) & 0xff00);
        return aColor;
    },
    Duplicate : function GameFramework_resources_PIEffect$Duplicate() {
        var aPIEffect = new GameFramework.resources.PIEffect();
        aPIEffect.InitFrom(this);
        return aPIEffect;
    },
    GetImage : function GameFramework_resources_PIEffect$GetImage(theName, theFilename, theParentStreamer) {
        var aBarPos = theFilename.indexOf(String.fromCharCode(124));
        if(aBarPos != -1) {
            var anId = theFilename.substr(aBarPos + 1);
            var aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImage(anId);
            aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildCompleted));
            aResourceStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildFailed));
            theParentStreamer.mResourceCount++;
            GameFramework.BaseApp.mApp.mResourceManager.PrioritizeResourceStreamer(aResourceStreamer);
            return aResourceStreamer;
        }
        return null;
    },
    Fail : function GameFramework_resources_PIEffect$Fail(theError) {
        if(this.mError.length == 0) {
            this.mError = theError;
        }
        return false;
    },
    GetRandFloat : function GameFramework_resources_PIEffect$GetRandFloat() {
        return GameFramework.Utils.GetRandFloat();
    },
    GetRandFloatU : function GameFramework_resources_PIEffect$GetRandFloatU() {
        return GameFramework.Utils.GetRandFloatU();
    },
    GetRandSign : function GameFramework_resources_PIEffect$GetRandSign() {
        if(GameFramework.Utils.GetRand() % 2 == 0) {
            return 1;
        } else {
            return -1;
        }
    },
    GetVariationScalar : function GameFramework_resources_PIEffect$GetVariationScalar() {
        return this.GetRandFloat() * this.GetRandFloat();
    },
    GetVariationScalarU : function GameFramework_resources_PIEffect$GetVariationScalarU() {
        return this.GetRandFloatU() * this.GetRandFloatU();
    },
    ReadTransform2D : function GameFramework_resources_PIEffect$ReadTransform2D(theDataBuffer) {
        var aMatrix = new GameFramework.geom.Matrix();
        aMatrix.a = theDataBuffer.ReadFloat();
        aMatrix.b = theDataBuffer.ReadFloat();
        theDataBuffer.ReadFloat();
        aMatrix.c = theDataBuffer.ReadFloat();
        aMatrix.d = theDataBuffer.ReadFloat();
        theDataBuffer.ReadFloat();
        aMatrix.tx = theDataBuffer.ReadFloat();
        aMatrix.ty = theDataBuffer.ReadFloat();
        theDataBuffer.ReadFloat();
        return aMatrix;
    },
    ReadString : function GameFramework_resources_PIEffect$ReadString() {
        var aLen = this.mReadBuffer.ReadByte();
        return this.mReadBuffer.ReadAsciiBytes(aLen);
    },
    ReadStringS : function GameFramework_resources_PIEffect$ReadStringS() {
        var aLen = this.mReadBuffer.ReadShort();
        var aString;
        if(aLen == -1) {
            var aSomething = this.mReadBuffer.ReadShort();
            aLen = this.mReadBuffer.ReadShort();
        } else if((aLen & 0x8000) != 0) {
            aString = this.mStringVector[(((aLen | 0)) & 0x7fff)];
            this.mStringVector.push(aString);
            return aString;
        }
        aString = this.mReadBuffer.ReadAsciiBytes(aLen);
        this.mStringVector.push(aString);
        this.mStringVector.push(aString);
        return aString;
    },
    ExpectCmd : function GameFramework_resources_PIEffect$ExpectCmd(theCmdExpected) {
        if(this.mIsPPF) {
            return true;
        }
        var aString = this.ReadStringS();
        if(aString != theCmdExpected) {
            return this.Fail('Expected \'' + theCmdExpected + '\'');
        }
        return true;
    },
    ReadValue2D : function GameFramework_resources_PIEffect$ReadValue2D(theValue2D) {
        var aKeyCount = this.mReadBuffer.ReadShort();
        var aTimes = Array.Create(aKeyCount, null);
        var aPoints = Array.Create(aKeyCount, null);
        var aControlPoints = Array.Create(aKeyCount, null);
        var hasCurve = false;
        if((this.mIsPPF) && (aKeyCount > 1)) {
            hasCurve = this.mReadBuffer.ReadBoolean();
        }
        theValue2D.mValuePoint2DVector = [];
        for(var aKeyIdx = 0; aKeyIdx < aKeyCount; aKeyIdx++) {
            this.ExpectCmd('CKey');
            var aTime = this.mReadBuffer.ReadInt();
            aTimes[aKeyIdx] = aTime;
            var aPt = new GameFramework.geom.TPoint();
            aPt.x = this.mReadBuffer.ReadFloat();
            aPt.y = this.mReadBuffer.ReadFloat();
            aPoints[aKeyIdx] = aPt;
            if((!this.mIsPPF) || (hasCurve)) {
                var aControlPt1 = new GameFramework.geom.TPoint();
                aControlPt1.x = this.mReadBuffer.ReadFloat();
                aControlPt1.y = this.mReadBuffer.ReadFloat();
                if(aKeyIdx > 0) {
                    aControlPoints[aKeyIdx] = aPt.add(aControlPt1);
                }
                var aControlPt2 = new GameFramework.geom.TPoint();
                aControlPt2.x = this.mReadBuffer.ReadFloat();
                aControlPt2.y = this.mReadBuffer.ReadFloat();
                aControlPoints[aKeyIdx] = aPt.add(aControlPt2);
            }
            if(!this.mIsPPF) {
                var aFlags1 = this.mReadBuffer.ReadInt();
                var aFlags2 = this.mReadBuffer.ReadInt();
                hasCurve |= (aFlags2 & 1) == 0;
            }
            var aValuePoint2D = new GameFramework.resources.PIValuePoint2D();
            aValuePoint2D.mValue = aPt;
            aValuePoint2D.mTime = aTime;
            theValue2D.mValuePoint2DVector.push(aValuePoint2D);
        }
        if((aKeyCount > 1) && (hasCurve)) {
            theValue2D.mBezier.InitWithControls(aPoints, aControlPoints, aTimes);
        }
    },
    ReadEPoint : function GameFramework_resources_PIEffect$ReadEPoint(theValue2D) {
        var aPointCount = this.mReadBuffer.ReadShort();
        theValue2D.mValuePoint2DVector = [];
        for(var i = 0; i < aPointCount; i++) {
            this.ExpectCmd('CPointKey');
            var aPoint = new GameFramework.resources.PIValuePoint2D();
            aPoint.mTime = this.mReadBuffer.ReadInt();
            aPoint.mValue = new GameFramework.geom.TPoint();
            aPoint.mValue.x = this.mReadBuffer.ReadFloat();
            aPoint.mValue.y = this.mReadBuffer.ReadFloat();
            theValue2D.mValuePoint2DVector.push(aPoint);
        }
    },
    ReadValue : function GameFramework_resources_PIEffect$ReadValue(theValue) {
        var aFlags = this.mIsPPF ? this.mReadBuffer.ReadByte() : (0 | 0);
        var aDataCount = aFlags & 7;
        if((!this.mIsPPF) || (aDataCount == 7)) {
            aDataCount = this.mReadBuffer.ReadShort();
        }
        var hasCurve = false;
        if(aDataCount > 1) {
            hasCurve |= (aFlags & 8) != 0;
        }
        var aTimes = Array.Create(aDataCount, null);
        var aPoints = Array.Create(aDataCount, null);
        var aControlPoints = Array.Create(Math.max(aDataCount * 2 - 1, 0), null);
        var anArrayIdx = 0;
        var aControlIdx = 0;
        theValue.mValuePointVector = [];
        theValue.mValuePointVector.length = aDataCount;
        for(var aDataIdx = 0; aDataIdx < aDataCount; aDataIdx++) {
            var okay = true;
            var aCmd = null;
            if(!this.mIsPPF) {
                aCmd = this.ReadStringS();
                okay = ((aCmd == 'CDataKey') || (aCmd == 'CDataOverLifeKey'));
            }
            if(okay) {
                var aTime;
                if(((aFlags & 0x10) != 0) && (aDataIdx == 0)) {
                    aTime = 0.0;
                } else if(aCmd == 'CDataKey') {
                    aTime = this.mReadBuffer.ReadInt();
                } else {
                    aTime = this.mReadBuffer.ReadFloat();
                }
                aTimes[anArrayIdx] = aTime;
                var aValue;
                if((aDataIdx != 0) || (aFlags & 0x60) == 0x0) {
                    aValue = this.mReadBuffer.ReadFloat();
                } else if((aFlags & 0x60) == 0x20) {
                    aValue = 0.0;
                } else if((aFlags & 0x60) == 0x40) {
                    aValue = 1.0;
                } else {
                    aValue = 2.0;
                }
                var aPt = new GameFramework.geom.TPoint();
                aPt.x = aTime;
                aPt.y = aValue;
                aPoints[anArrayIdx] = aPt;
                if((!this.mIsPPF) || (hasCurve)) {
                    var aControlPt1 = new GameFramework.geom.TPoint();
                    aControlPt1.x = this.mReadBuffer.ReadFloat();
                    aControlPt1.y = this.mReadBuffer.ReadFloat();
                    if(aDataIdx > 0) {
                        aControlPoints[aControlIdx++] = aPt.add(aControlPt1);
                    }
                    var aControlPt2 = new GameFramework.geom.TPoint();
                    aControlPt2.x = this.mReadBuffer.ReadFloat();
                    aControlPt2.y = this.mReadBuffer.ReadFloat();
                    aControlPoints[aControlIdx++] = aPt.add(aControlPt2);
                }
                if(!this.mIsPPF) {
                    var aFlags1 = this.mReadBuffer.ReadInt();
                    var aFlags2 = this.mReadBuffer.ReadInt();
                    hasCurve |= (aFlags2 & 1) == 0;
                }
                var aValuePoint = new GameFramework.resources.PIValuePoint();
                aValuePoint.mValue = aPt.y;
                aValuePoint.mTime = aTime;
                theValue.mValuePointVector[aDataIdx] = aValuePoint;
                anArrayIdx++;
            } else {
                this.Fail('CDataKey or CDataOverLifeKey expected');
            }
        }
        if((!hasCurve) && (theValue.mValuePointVector.length == 2) && (theValue.mValuePointVector[0].mValue == theValue.mValuePointVector[1].mValue)) {
            theValue.mValuePointVector.length--;
        }
        if((aDataCount > 1) && (hasCurve)) {
            theValue.mBezier = new GameFramework.misc.Bezier();
            theValue.mBezier.InitWithControls(aPoints, aControlPoints, aTimes);
        }
    },
    ReadEmitterType : function GameFramework_resources_PIEffect$ReadEmitterType(theEmitter) {
        var aMyst1 = this.mReadBuffer.ReadInt();
        theEmitter.mName = this.ReadString();
        theEmitter.mKeepInOrder = this.mReadBuffer.ReadBoolean();
        var l = this.mReadBuffer.ReadInt();
        theEmitter.mOldestInFront = this.mReadBuffer.ReadBoolean();
        var aParticleCount = this.mReadBuffer.ReadShort();
        theEmitter.mParticleDefVector = [];
        theEmitter.mParticleDefVector.length = aParticleCount;
        for(var aParticleIdx = 0; aParticleIdx < aParticleCount; aParticleIdx++) {
            GameFramework.resources.PIEffect.gParticleTypeCount++;
            var aParticle = new GameFramework.resources.PIParticleDef();
            this.ExpectCmd('CEmParticleType');
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadFloat();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            aParticle.mIntense = this.mReadBuffer.ReadBoolean();
            aParticle.mSingleParticle = this.mReadBuffer.ReadBoolean();
            aParticle.mPreserveColor = this.mReadBuffer.ReadBoolean();
            if(aParticle.mPreserveColor && !this.mGlobalAllowPreserveColor) {
                aParticle.mPreserveColor = false;
            }
            aParticle.mAttachToEmitter = this.mReadBuffer.ReadBoolean();
            aParticle.mAttachVal = this.mReadBuffer.ReadFloat();
            aParticle.mFlipHorz = this.mReadBuffer.ReadBoolean();
            aParticle.mFlipVert = this.mReadBuffer.ReadBoolean();
            aParticle.mAnimStartOnRandomFrame = this.mReadBuffer.ReadBoolean();
            aParticle.mRepeatColor = this.mReadBuffer.ReadInt();
            aParticle.mRepeatAlpha = this.mReadBuffer.ReadInt();
            aParticle.mLinkTransparencyToColor = this.mReadBuffer.ReadBoolean();
            aParticle.mName = this.ReadString();
            aParticle.mAngleAlignToMotion = this.mReadBuffer.ReadBoolean();
            aParticle.mAngleRandomAlign = this.mReadBuffer.ReadBoolean();
            aParticle.mAngleKeepAlignedToMotion = this.mReadBuffer.ReadBoolean();
            aParticle.mAngleValue = this.mReadBuffer.ReadInt();
            aParticle.mAngleAlignOffset = this.mReadBuffer.ReadInt();
            aParticle.mAnimSpeed = this.mReadBuffer.ReadInt();
            aParticle.mRandomGradientColor = this.mReadBuffer.ReadBoolean();
            l = this.mReadBuffer.ReadInt();
            aParticle.mTextureIdx = this.mReadBuffer.ReadInt();
            aParticle.mColor = new GameFramework.resources.PIInterpolator();
            var aColorPointCount = this.mReadBuffer.ReadShort();
            for(var anIdx = 0; anIdx < aColorPointCount; anIdx++) {
                this.ExpectCmd('CColorPoint');
                var r = this.mReadBuffer.ReadByte();
                var g = this.mReadBuffer.ReadByte();
                var b = this.mReadBuffer.ReadByte();
                var aColor = 0xff000000 | (((r | 0)) << 16) | (((g | 0)) << 8) | (((b | 0)) << 0);
                var aPct = this.mReadBuffer.ReadFloat();
                var aPoint = new GameFramework.resources.PIInterpolatorPoint();
                aPoint.mValue = aColor;
                aPoint.mTime = aPct;
                aParticle.mColor.mInterpolatorPointVector.push(aPoint);
            }
            aParticle.mAlpha = new GameFramework.resources.PIInterpolator();
            var anAlphaPointCount = this.mReadBuffer.ReadShort();
            for(var anIdx_2 = 0; anIdx_2 < anAlphaPointCount; anIdx_2++) {
                this.ExpectCmd('CAlphaPoint');
                var a = this.mReadBuffer.ReadByte();
                var aPct_2 = this.mReadBuffer.ReadFloat();
                var aPoint_2 = new GameFramework.resources.PIInterpolatorPoint();
                aPoint_2.mValue = a;
                aPoint_2.mTime = aPct_2;
                aParticle.mAlpha.mInterpolatorPointVector.push(aPoint_2);
            }
            aParticle.mValues = [];
            aParticle.mValues.length = (GameFramework.resources.PIParticleDef.Value.__COUNT | 0);
            for(var aValIdx = 0; aValIdx < (GameFramework.resources.PIParticleDef.Value.__COUNT | 0); aValIdx++) {
                aParticle.mValues[aValIdx] = new GameFramework.resources.PIValue();
            }
            for(var aValIdx_2 = 0; aValIdx_2 < 23; aValIdx_2++) {
                this.ReadValue(aParticle.mValues[aValIdx_2]);
            }
            aParticle.mRefPointOfs = new GameFramework.geom.TPoint();
            aParticle.mRefPointOfs.x = this.mReadBuffer.ReadFloat();
            aParticle.mRefPointOfs.y = this.mReadBuffer.ReadFloat();
            if(!this.mIsPPF) {
                var anImage = this.mDef.mTextureVector[aParticle.mTextureIdx].mImageVector[0];
                aParticle.mRefPointOfs.x /= anImage.mWidth;
                aParticle.mRefPointOfs.y /= anImage.mHeight;
            }
            aParticle.mTextureChunkVector = this.mDef.mTextureVector[aParticle.mTextureIdx].mTextureChunkVector;
            for(var aChunkIdx = 0; aChunkIdx < (aParticle.mTextureChunkVector.length | 0); aChunkIdx++) {
                aParticle.mTextureChunkVector[aChunkIdx].mRefOfsX = -aParticle.mRefPointOfs.x * aParticle.mTextureChunkVector[aChunkIdx].mScaleRef;
                aParticle.mTextureChunkVector[aChunkIdx].mRefOfsY = -aParticle.mRefPointOfs.y * aParticle.mTextureChunkVector[aChunkIdx].mScaleRef;
                if(aParticle.mFlipHorz) {
                    aParticle.mTextureChunkVector[aChunkIdx].mScaleXFactor *= -1.0;
                }
                if(aParticle.mFlipVert) {
                    aParticle.mTextureChunkVector[aChunkIdx].mScaleYFactor *= -1.0;
                }
            }
            l = this.mReadBuffer.ReadInt();
            l = this.mReadBuffer.ReadInt();
            aParticle.mLockAspect = this.mReadBuffer.ReadBoolean();
            this.ReadValue(aParticle.mValues[(GameFramework.resources.PIParticleDef.Value.SIZE_Y | 0)]);
            this.ReadValue(aParticle.mValues[(GameFramework.resources.PIParticleDef.Value.SIZE_Y_VARIATION | 0)]);
            this.ReadValue(aParticle.mValues[(GameFramework.resources.PIParticleDef.Value.SIZE_Y_OVER_LIFE | 0)]);
            aParticle.mAngleRange = this.mReadBuffer.ReadInt();
            aParticle.mAngleOffset = this.mReadBuffer.ReadInt();
            aParticle.mGetColorFromLayer = this.mReadBuffer.ReadBoolean();
            aParticle.mUpdateColorFromLayer = this.mReadBuffer.ReadBoolean();
            aParticle.mUseEmitterAngleAndRange = this.mReadBuffer.ReadBoolean();
            this.ReadValue(aParticle.mValues[(GameFramework.resources.PIParticleDef.Value.EMISSION_ANGLE | 0)]);
            this.ReadValue(aParticle.mValues[(GameFramework.resources.PIParticleDef.Value.EMISSION_RANGE | 0)]);
            l = this.mReadBuffer.ReadInt();
            var aValue = new GameFramework.resources.PIValue();
            this.ReadValue(aValue);
            aParticle.mUseKeyColorsOnly = this.mReadBuffer.ReadBoolean();
            aParticle.mUpdateTransparencyFromLayer = this.mReadBuffer.ReadBoolean();
            aParticle.mUseNextColorKey = this.mReadBuffer.ReadBoolean();
            aParticle.mNumberOfEachColor = this.mReadBuffer.ReadInt();
            aParticle.mGetTransparencyFromLayer = this.mReadBuffer.ReadBoolean();
            var aPILifeValueTable = new GameFramework.resources.PILifeValueTable();
            aPILifeValueTable.mLifeValuesSampleTable = Array.Create(GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE + 1, null);
            for(var aLifeValueIdx = 0; aLifeValueIdx < (GameFramework.resources.PILifeValueTable.LifeValue.__COUNT | 0); aLifeValueIdx++) {
                var aPIValue = null;
                var aPIInterpolator = null;
                var aValuePointVector = [];
                switch(aLifeValueIdx) {
                    case (GameFramework.resources.PILifeValueTable.LifeValue.SIZE_X | 0):
                    {
                        aPIValue = aParticle.mValues[(GameFramework.resources.PIParticleDef.Value.SIZE_X_OVER_LIFE | 0)];
                        break;
                    }
                    case (GameFramework.resources.PILifeValueTable.LifeValue.SIZE_Y | 0):
                    {
                        aPIValue = aParticle.mValues[(GameFramework.resources.PIParticleDef.Value.SIZE_Y_OVER_LIFE | 0)];
                        break;
                    }
                    case (GameFramework.resources.PILifeValueTable.LifeValue.VELOCITY | 0):
                    {
                        aPIValue = aParticle.mValues[(GameFramework.resources.PIParticleDef.Value.VELOCITY_OVER_LIFE | 0)];
                        break;
                    }
                    case (GameFramework.resources.PILifeValueTable.LifeValue.WEIGHT | 0):
                    {
                        aPIValue = aParticle.mValues[(GameFramework.resources.PIParticleDef.Value.WEIGHT_OVER_LIFE | 0)];
                        break;
                    }
                    case (GameFramework.resources.PILifeValueTable.LifeValue.SPIN | 0):
                    {
                        aPIValue = aParticle.mValues[(GameFramework.resources.PIParticleDef.Value.SPIN_OVER_LIFE | 0)];
                        break;
                    }
                    case (GameFramework.resources.PILifeValueTable.LifeValue.MOTION_RAND | 0):
                    {
                        aPIValue = aParticle.mValues[(GameFramework.resources.PIParticleDef.Value.MOTION_RAND_OVER_LIFE | 0)];
                        break;
                    }
                    case (GameFramework.resources.PILifeValueTable.LifeValue.COLOR | 0):
                    {
                        aPIInterpolator = aParticle.mColor;
                        break;
                    }
                    case (GameFramework.resources.PILifeValueTable.LifeValue.ALPHA | 0):
                    {
                        aPIInterpolator = aParticle.mAlpha;
                        break;
                    }
                }
                for(var aSampleIdx = 0; aSampleIdx < GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE + 1; aSampleIdx++) {
                    var aSampleTime = aSampleIdx / (GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE);
                    if(aLifeValueIdx == (GameFramework.resources.PILifeValueTable.LifeValue.COLOR | 0)) {
                        aSampleTime = aSampleTime * (aParticle.mRepeatColor + 1);
                    } else if(aLifeValueIdx == (GameFramework.resources.PILifeValueTable.LifeValue.ALPHA | 0)) {
                        aSampleTime = aSampleTime * (aParticle.mRepeatAlpha + 1);
                    }
                    if(aSampleTime > 1.0001) {
                        aSampleTime -= (aSampleTime | 0);
                    }
                    var aIVal = 0;
                    var aFVal = 0;
                    if(aPIValue != null) {
                        aFVal = aPIValue.GetValueAt(aSampleTime);
                    } else {
                        aIVal = aPIInterpolator.GetValueAt(aSampleTime);
                    }
                    switch(aLifeValueIdx) {
                        case (GameFramework.resources.PILifeValueTable.LifeValue.SIZE_X | 0):
                        {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx] = new GameFramework.resources.PILifeValueSample();
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mSizeX = aFVal;
                            break;
                        }
                        case (GameFramework.resources.PILifeValueTable.LifeValue.SIZE_Y | 0):
                        {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mSizeY = aFVal;
                            break;
                        }
                        case (GameFramework.resources.PILifeValueTable.LifeValue.VELOCITY | 0):
                        {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mVelocity = aFVal;
                            break;
                        }
                        case (GameFramework.resources.PILifeValueTable.LifeValue.WEIGHT | 0):
                        {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mWeight = aFVal - 1.0;
                            break;
                        }
                        case (GameFramework.resources.PILifeValueTable.LifeValue.SPIN | 0):
                        {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mSpin = aFVal - 1.0;
                            break;
                        }
                        case (GameFramework.resources.PILifeValueTable.LifeValue.MOTION_RAND | 0):
                        {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mMotionRand = aFVal;
                            break;
                        }
                        case (GameFramework.resources.PILifeValueTable.LifeValue.COLOR | 0):
                        {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mColor = aIVal & 0xffffff;
                            break;
                        }
                        case (GameFramework.resources.PILifeValueTable.LifeValue.ALPHA | 0):
                        {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mColor |= aIVal << 24;
                            break;
                        }
                    }
                }
                if(aValuePointVector.length == 1) {
                    var aPIValuePoint = new GameFramework.resources.PIValuePoint();
                    aPIValuePoint.mTime = 1.0;
                    aPIValuePoint.mValue = aValuePointVector[0].mValue;
                    aValuePointVector.push(aPIValuePoint);
                }
            }
            aParticle.mLifeValueTable = aPILifeValueTable;
            aParticle.mCalcParticleTransformWantsBaseRotTrans = (aParticle.mAttachToEmitter) || (aParticle.mSingleParticle);
            if(theEmitter.mOldestInFront) {
                theEmitter.mParticleDefVector[aParticleCount - aParticleIdx - 1] = aParticle;
            } else {
                theEmitter.mParticleDefVector[aParticleIdx] = aParticle;
            }
        }
        var aMyst2 = this.mReadBuffer.ReadInt();
        theEmitter.mValues = Array.Create(42, null);
        for(var aValIdx_3 = 0; aValIdx_3 < 42; aValIdx_3++) {
            theEmitter.mValues[aValIdx_3] = new GameFramework.resources.PIValue();
            this.ReadValue(theEmitter.mValues[aValIdx_3]);
        }
        theEmitter.mIsSuperEmitter = theEmitter.mValues[0].mValuePointVector.length != 0;
        var aMyst3 = this.mReadBuffer.ReadInt();
        var aMyst4 = this.mReadBuffer.ReadInt();
    },
    LoadParticleDefInstance : function GameFramework_resources_PIEffect$LoadParticleDefInstance(theBuffer, theParticleDefInstance) {
        theParticleDefInstance.mNumberAcc = theBuffer.ReadFloat();
        theParticleDefInstance.mCurNumberVariation = theBuffer.ReadFloat();
        theParticleDefInstance.mParticlesEmitted = theBuffer.ReadInt();
        theParticleDefInstance.mTicks = theBuffer.ReadInt();
    },
    LoadParticle : function GameFramework_resources_PIEffect$LoadParticle(theBuffer, theLayer, theParticle) {
        theParticle.mTicks = theBuffer.ReadFloat();
        theParticle.mLife = theBuffer.ReadFloat();
        theParticle.mLifePct = theBuffer.ReadFloat();
        theParticle.mZoom = theBuffer.ReadFloat();
        var anUpdateRate = (1000.0 / this.mFrameTime) / this.mAnimSpeed;
        var aLifeTicks = theParticle.mLife / (1.0 / anUpdateRate);
        theParticle.mLifePctInt = ((theParticle.mLifePct * 0x7fffffff) | 0);
        theParticle.mLifePctIntInc = ((0x7fffffff / aLifeTicks) | 0);
        if(theParticle.mLifePctInt < 0) {
            theParticle.mLifePctInt = 0x7fffffff;
        }
        theParticle.mLifeValueDeltaIdx = 0;
        if((theParticle.mParticleDef != null) && (theParticle.mParticleDef.mSingleParticle)) {
            theParticle.mLifePctInt = 1;
            theParticle.mLifePctIntInc = 0;
            theParticle.mLifePctInc = 0;
        }
        theParticle.mPos = new GameFramework.geom.TPoint();
        theParticle.mPos.x = theBuffer.ReadDouble();
        theParticle.mPos.y = theBuffer.ReadDouble();
        theParticle.mVel = new GameFramework.geom.TPoint();
        theParticle.mVel.x = theBuffer.ReadDouble();
        theParticle.mVel.y = theBuffer.ReadDouble();
        theParticle.mEmittedPos = new GameFramework.geom.TPoint();
        theParticle.mEmittedPos.x = theBuffer.ReadDouble();
        theParticle.mEmittedPos.y = theBuffer.ReadDouble();
        theParticle.mOrigPos = new GameFramework.geom.TPoint();
        if((theParticle.mParticleDef != null) && (theParticle.mParticleDef.mAttachToEmitter)) {
            theParticle.mOrigPos.x = theBuffer.ReadDouble();
            theParticle.mOrigPos.y = theBuffer.ReadDouble();
            theParticle.mOrigEmitterAng = theBuffer.ReadFloat();
        }
        theParticle.mImgAngle = theBuffer.ReadFloat();
        var aVariationFlags = theBuffer.ReadShort();
        for(var aVar = 0; aVar < (GameFramework.resources.PIParticleInstance.Variation.__COUNT | 0); aVar++) {
            if((aVariationFlags & (1 << aVar)) != 0) {
                theParticle.mVariationValues[aVar] = theBuffer.ReadFloat();
            } else {
                theParticle.mVariationValues[aVar] = 0.0;
            }
        }
        theParticle.mSrcSizeXMult = theBuffer.ReadFloat();
        theParticle.mSrcSizeYMult = theBuffer.ReadFloat();
        theParticle.mColorMask = 0xffffffff;
        theParticle.mColorOr = 0;
        if((theParticle.mParticleDef != null) && (theParticle.mParticleDef.mRandomGradientColor)) {
            var aParticleDef = theParticle.mParticleDef;
            theParticle.mGradientRand = theBuffer.ReadFloat();
            theParticle.mColorMask &= 0xff000000;
            if(aParticleDef.mUseKeyColorsOnly) {
                var aKeyframe = ((Math.max(((theParticle.mGradientRand * aParticleDef.mColor.mInterpolatorPointVector.length) | 0), aParticleDef.mColor.mInterpolatorPointVector.length - 1)) | 0);
                theParticle.mColorOr |= aParticleDef.mColor.GetKeyframeNum(aKeyframe) & 0xffffff;
            } else {
                var aColorPosUsed = theParticle.mGradientRand;
                theParticle.mColorOr |= aParticleDef.mColor.GetValueAt(aColorPosUsed) & 0xffffff;
            }
        }
        if((theParticle.mParticleDef != null) && (theParticle.mParticleDef.mUseNextColorKey)) {
            var aParticleDef_2 = theParticle.mParticleDef;
            var aKeyframe_2 = (((theParticle.mNum / aParticleDef_2.mNumberOfEachColor) | 0)) % (aParticleDef_2.mColor.mInterpolatorPointVector.length | 0);
            theParticle.mColorOr |= aParticleDef_2.mColor.GetKeyframeNum(aKeyframe_2) & 0xffffff;
            theParticle.mColorMask &= 0xff000000;
        }
        if((theParticle.mParticleDef != null) && (theParticle.mParticleDef.mAnimStartOnRandomFrame)) {
            theParticle.mAnimFrameRand = theBuffer.ReadShort();
        }
        if(theLayer.mLayerDef.mDeflectorVector.length > 0) {
            theParticle.mThicknessHitVariation = theBuffer.ReadFloat();
        }
        if((theParticle.mParticleDef != null) && (theParticle.mParticleDef.mAnimStartOnRandomFrame)) {
            theParticle.mAnimFrameRand = GameFramework.Utils.GetRand() & 0x7fff;
        } else {
            theParticle.mAnimFrameRand = 0;
        }
    },
    GetGeomPos : function GameFramework_resources_PIEffect$GetGeomPos(theEmitterInstance, theParticleInstance, thePIGeomDataEx) {
        if(thePIGeomDataEx === undefined) {
            thePIGeomDataEx = null;
        }
        var aPos = null;
        var anEmitterInstanceDef = theEmitterInstance.mEmitterInstanceDef;
        switch(anEmitterInstanceDef.mEmitterGeom) {
            case GameFramework.resources.PIEmitterInstanceDef.Geom.LINE:

            {
                if(anEmitterInstanceDef.mPoints.length >= 2) {
                    var aStartIdx = 0;
                    var aPct = 0;
                    var aPt1;
                    var aPt2;
                    var aPtDiff;
                    var aLenSq;
                    var aTotalLengthSq = 0;
                    for(var i = 0; i < (anEmitterInstanceDef.mPoints.length | 0) - 1; i++) {
                        aPt1 = anEmitterInstanceDef.mPoints[i].GetValueAt(this.mFrameNum);
                        aPt2 = anEmitterInstanceDef.mPoints[i + 1].GetValueAt(this.mFrameNum);
                        aPtDiff = aPt2.subtract(aPt1);
                        aLenSq = aPtDiff.x * aPtDiff.x + aPtDiff.y * aPtDiff.y;
                        aTotalLengthSq += (aLenSq | 0);
                    }
                    var aWantLenSq;
                    if(anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                        var aPointIdx = theParticleInstance.mNum % anEmitterInstanceDef.mEmitAtPointsNum;
                        aWantLenSq = (aPointIdx * aTotalLengthSq) / (anEmitterInstanceDef.mEmitAtPointsNum - 1);
                    } else {
                        aWantLenSq = this.GetRandFloatU() * aTotalLengthSq;
                    }
                    aTotalLengthSq = 0;
                    for(var i_2 = 0; i_2 < (anEmitterInstanceDef.mPoints.length | 0) - 1; i_2++) {
                        aPt1 = anEmitterInstanceDef.mPoints[i_2].GetValueAt(this.mFrameNum);
                        aPt2 = anEmitterInstanceDef.mPoints[i_2 + 1].GetValueAt(this.mFrameNum);
                        aPtDiff = aPt2.subtract(aPt1);
                        aLenSq = aPtDiff.x * aPtDiff.x + aPtDiff.y * aPtDiff.y;
                        if((aWantLenSq >= aTotalLengthSq) && (aWantLenSq <= aTotalLengthSq + aLenSq)) {
                            aPct = (aWantLenSq - aTotalLengthSq) / aLenSq;
                            aStartIdx = i_2;
                            break;
                        }
                        aTotalLengthSq += (aLenSq | 0);
                    }
                    aPt1 = anEmitterInstanceDef.mPoints[aStartIdx].GetValueAt(this.mFrameNum);
                    aPt2 = anEmitterInstanceDef.mPoints[aStartIdx + 1].GetValueAt(this.mFrameNum);
                    aPtDiff = aPt2.subtract(aPt1);
                    aPos = GameFramework.geom.TPoint.interpolate(aPt2, aPt1, aPct);
                    var aSign = anEmitterInstanceDef.mEmitIn ? (anEmitterInstanceDef.mEmitOut ? this.GetRandSign() : -1) : 1;
                    if(thePIGeomDataEx != null) {
                        var anAngleChange = Math.atan2(aPtDiff.y, aPtDiff.x) + Math.PI / 2.0 + aSign * Math.PI / 2.0;
                        thePIGeomDataEx.mTravelAngle += anAngleChange;
                    }
                }
            }

                break;
            case GameFramework.resources.PIEmitterInstanceDef.Geom.ECLIPSE:

            {
                var aXRad = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0)].GetValueAt(this.mFrameNum));
                var aYRad = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.YRADIUS | 0)].GetValueAt(this.mFrameNum));
                var anAng;
                if(anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                    var aPointIdx_2 = theParticleInstance.mNum % anEmitterInstanceDef.mEmitAtPointsNum;
                    anAng = (aPointIdx_2 * Math.PI * 2) / anEmitterInstanceDef.mEmitAtPointsNum;
                    if(anAng > Math.PI) {
                        anAng = anAng - Math.PI * 2;
                    }
                } else {
                    anAng = this.GetRandFloat() * Math.PI;
                }
                if(aXRad > aYRad) {
                    var aFavorSidesFactor = 1.0 + ((aXRad / aYRad) - 1.0) * 0.3;
                    if(anAng < -Math.PI / 2) {
                        anAng = Math.PI + Math.pow((anAng + Math.PI) / (Math.PI / 2), aFavorSidesFactor) * Math.PI / 2;
                    } else if(anAng < 0) {
                        anAng = -Math.pow(-anAng / (Math.PI / 2), aFavorSidesFactor) * Math.PI / 2;
                    } else if(anAng < Math.PI / 2) {
                        anAng = Math.pow(anAng / (Math.PI / 2), aFavorSidesFactor) * Math.PI / 2;
                    } else {
                        anAng = Math.PI - Math.pow((Math.PI - anAng) / (Math.PI / 2), aFavorSidesFactor) * Math.PI / 2;
                    }
                } else if(aYRad > aXRad) {
                    var aFavorSidesFactor_2 = 1.0 + ((aYRad / aXRad) - 1.0) * 0.3;
                    if(anAng < -Math.PI / 2) {
                        anAng = -Math.PI / 2 - Math.pow((-Math.PI / 2 - anAng) / (Math.PI / 2), aFavorSidesFactor_2) * Math.PI / 2;
                    } else if(anAng < 0) {
                        anAng = -Math.PI / 2 + Math.pow((anAng + Math.PI / 2) / (Math.PI / 2), aFavorSidesFactor_2) * Math.PI / 2;
                    } else if(anAng < Math.PI / 2) {
                        anAng = Math.PI / 2 - Math.pow((Math.PI / 2 - anAng) / (Math.PI / 2), aFavorSidesFactor_2) * Math.PI / 2;
                    } else {
                        anAng = Math.PI / 2 + Math.pow((anAng - Math.PI / 2) / (Math.PI / 2), aFavorSidesFactor_2) * Math.PI / 2;
                    }
                }
                aPos = new GameFramework.geom.TPoint(Math.cos(anAng) * aXRad, Math.sin(anAng) * aYRad);
                if(thePIGeomDataEx != null) {
                    var aSign_2 = anEmitterInstanceDef.mEmitIn ? (anEmitterInstanceDef.mEmitOut ? this.GetRandSign() : -1) : 1;
                    var anAngleChange_2 = anAng + aSign_2 * Math.PI / 2.0;
                    thePIGeomDataEx.mTravelAngle += anAngleChange_2;
                }
            }

                break;
            case GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE:

            {
                var aRad = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0)].GetValueAt(this.mFrameNum));
                var anAng_2;
                if(anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                    var aPointIdx_3 = theParticleInstance.mNum % anEmitterInstanceDef.mEmitAtPointsNum;
                    anAng_2 = (aPointIdx_3 * Math.PI * 2) / anEmitterInstanceDef.mEmitAtPointsNum;
                } else {
                    anAng_2 = this.GetRandFloat() * Math.PI;
                }
                aPos = new GameFramework.geom.TPoint(Math.cos(anAng_2) * aRad, Math.sin(anAng_2) * aRad);
                if(thePIGeomDataEx != null) {
                    var aSign_3 = anEmitterInstanceDef.mEmitIn ? (anEmitterInstanceDef.mEmitOut ? this.GetRandSign() : -1) : 1;
                    var anAngleChange_3 = anAng_2 + aSign_3 * Math.PI / 2.0;
                    thePIGeomDataEx.mTravelAngle += anAngleChange_3;
                }
            }

                break;
            case GameFramework.resources.PIEmitterInstanceDef.Geom.AREA:

            {
                var aW = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0)].GetValueAt(this.mFrameNum));
                var aH = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.YRADIUS | 0)].GetValueAt(this.mFrameNum));
                if(anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                    var aPointIdxX = theParticleInstance.mNum % anEmitterInstanceDef.mEmitAtPointsNum;
                    var aPointIdxY = (((theParticleInstance.mNum / anEmitterInstanceDef.mEmitAtPointsNum) | 0)) % anEmitterInstanceDef.mEmitAtPointsNum2;
                    aPos = new GameFramework.geom.TPoint();
                    if(anEmitterInstanceDef.mEmitAtPointsNum > 1) {
                        aPos.x = (aPointIdxX / (anEmitterInstanceDef.mEmitAtPointsNum - 1) - 0.5) * aW;
                    }
                    if(anEmitterInstanceDef.mEmitAtPointsNum2 > 1) {
                        aPos.y = (aPointIdxY / (anEmitterInstanceDef.mEmitAtPointsNum2 - 1) - 0.5) * aH;
                    }
                } else {
                    aPos = new GameFramework.geom.TPoint(this.GetRandFloat() * aW / 2.0, this.GetRandFloat() * aH / 2.0);
                }
                if((theEmitterInstance.mMaskImage != null) && (thePIGeomDataEx != null)) {
                    var aXPct = (aPos.x / aW) + 0.5;
                    var aYPct = (aPos.y / aH) + 0.5;
                    var anImgW = theEmitterInstance.mMaskImage.mWidth;
                    var anImgH = theEmitterInstance.mMaskImage.mHeight;
                }
            }

                break;
            case GameFramework.resources.PIEmitterInstanceDef.Geom.POINT:
            {
                aPos = new GameFramework.geom.TPoint();
                break;
            }
        }
        aPos = aPos.add(this.GetEmitterPos(theEmitterInstance, false));
        aPos.offset(theEmitterInstance.mOffset.x, theEmitterInstance.mOffset.y);
        aPos = theEmitterInstance.mTransform.transformPoint(aPos);
        if(this.mEmitterTransform != null) {
            aPos = this.mEmitterTransform.transformPoint(aPos);
        }
        return aPos;
    },
    LoadEffect : function GameFramework_resources_PIEffect$LoadEffect(theDataBuffer, theParentStreamer) {
        this.mDef = new GameFramework.resources.PIEffectDef();
        this.Clear();
        this.mVersion = 0;
        this.mFileChecksum = 0;
        this.mReadBuffer = theDataBuffer;
        this.mIsPPF = true;
        var aHeader = this.ReadString();
        if(this.mIsPPF) {
            this.mVersion = this.mReadBuffer.ReadInt();
        }
        if(this.mVersion < GameFramework.resources.PIEffect.PPF_MIN_VERSION) {
            this.Fail('PPF version too old');
        }
        this.mNotes = this.ReadString();
        this.mDef.mTextureVector = [];
        var aTexCount = this.mReadBuffer.ReadShort();
        for(var aTexIdx = 0; aTexIdx < aTexCount; aTexIdx++) {
            this.ExpectCmd('CMultiTexture');
            var aTexture = new GameFramework.resources.PITexture();
            aTexture.mName = this.ReadString();
            var aCount = this.mReadBuffer.ReadShort();
            aTexture.mNumCels = aCount;
            if(this.mIsPPF) {
                var aRowCount = this.mReadBuffer.ReadShort();
                aTexture.mPadded = this.mReadBuffer.ReadBoolean();
                var aFileName = this.ReadString();
                var aResourceStreamer = this.GetImage(aTexture.mName, aFileName, theParentStreamer);
                var aBaseRes = aResourceStreamer.mBaseRes;
                aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(aTexture, aTexture.ImageLoaded));
                for(var aCelIdx = 0; aCelIdx < aCount; aCelIdx++) {
                    var aPITextureChunk = new GameFramework.resources.PITextureChunk();
                    aPITextureChunk.mSrcTexture = aTexture;
                    aPITextureChunk.mCel = aCelIdx;
                    aPITextureChunk.mScaleRef = Math.max(aBaseRes.mOrigWidth, aBaseRes.mOrigHeight);
                    aPITextureChunk.mScaleXFactor = aBaseRes.mOrigWidth / aPITextureChunk.mScaleRef;
                    aPITextureChunk.mScaleYFactor = aBaseRes.mOrigHeight / aPITextureChunk.mScaleRef;
                    aTexture.mTextureChunkVector.push(aPITextureChunk);
                }
            }

            this.mDef.mTextureVector.push(aTexture);
        }
        var anEmitterCount = this.mReadBuffer.ReadShort();
        this.mDef.mEmitterVector = [];
        this.mDef.mEmitterVector.length = anEmitterCount;
        for(var anEmitterIdx = 0; anEmitterIdx < anEmitterCount; anEmitterIdx++) {
            this.mDef.mEmitterVector[anEmitterIdx] = new GameFramework.resources.PIEmitter();
            this.ExpectCmd('CEmitterType');
            if(!this.mIsPPF) {
                this.mDef.mEmitterRefMap[(this.mStringVector.length | 0)] = anEmitterIdx;
            }
            this.ReadEmitterType(this.mDef.mEmitterVector[anEmitterIdx]);
        }
        var anEmitterDefUsedVector = [];
        anEmitterDefUsedVector.length = this.mDef.mEmitterVector.length;
        var aTextureUsedVector = [];
        aTextureUsedVector.length = this.mDef.mTextureVector.length;
        var aLayerCount = this.mReadBuffer.ReadShort();
        this.mDef.mLayerDefVector = [];
        this.mDef.mLayerDefVector.length = aLayerCount;
        this.mLayerVector = [];
        this.mLayerVector.length = aLayerCount;
        for(var aLayerIdx = 0; aLayerIdx < aLayerCount; aLayerIdx++) {
            var aLayerDef;
            this.mDef.mLayerDefVector[aLayerIdx] = aLayerDef = new GameFramework.resources.PILayerDef();
            var aLayer;
            this.mLayerVector[aLayerIdx] = aLayer = new GameFramework.resources.PILayer();
            aLayer.mLayerDef = aLayerDef;
            this.ExpectCmd('CLayer');
            aLayerDef.mName = this.ReadString();
            anEmitterCount = this.mReadBuffer.ReadShort();
            aLayer.mEmitterInstanceVector = [];
            aLayer.mEmitterInstanceVector.length = anEmitterCount;
            aLayerDef.mEmitterInstanceDefVector = [];
            aLayerDef.mEmitterInstanceDefVector.length = anEmitterCount;
            for(var anEmitterIdx_2 = 0; anEmitterIdx_2 < anEmitterCount; anEmitterIdx_2++) {
                var anEmitterInstanceDef;
                aLayerDef.mEmitterInstanceDefVector[anEmitterIdx_2] = anEmitterInstanceDef = new GameFramework.resources.PIEmitterInstanceDef();
                var anEmitterInstance;
                aLayer.mEmitterInstanceVector[anEmitterIdx_2] = anEmitterInstance = new GameFramework.resources.PIEmitterInstance();
                anEmitterInstance.mEmitterInstanceDef = anEmitterInstanceDef;
                this.ExpectCmd('CEmitter');
                var f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                var l = this.mReadBuffer.ReadInt();
                l = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mFramesToPreload = this.mReadBuffer.ReadInt();
                l = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mName = this.ReadString();
                anEmitterInstanceDef.mEmitterGeom = this.mReadBuffer.ReadInt();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                var isCircle = this.mReadBuffer.ReadBoolean();
                if((isCircle) && (anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.ECLIPSE)) {
                    anEmitterInstanceDef.mEmitterGeom = GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE;
                }
                anEmitterInstanceDef.mEmitIn = this.mReadBuffer.ReadBoolean();
                anEmitterInstanceDef.mEmitOut = this.mReadBuffer.ReadBoolean();
                var aColor;
                aColor = ((((this.mReadBuffer.ReadByte() | 0) | 0)) << 16) | 0xff000000;
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                aColor |= (((this.mReadBuffer.ReadByte() | 0) | 0)) << 8;
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                aColor |= (this.mReadBuffer.ReadByte() | 0);
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                anEmitterInstance.mTintColor = aColor;
                l = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mEmitAtPointsNum = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mEmitterDefIdx = this.mReadBuffer.ReadInt();
                anEmitterDefUsedVector[anEmitterInstanceDef.mEmitterDefIdx] = true;
                var anEmitter = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                anEmitterInstance.mParticleDefInstanceVector = [];
                anEmitterInstance.mParticleDefInstanceVector.length = anEmitter.mParticleDefVector.length;
                for(var aParticleIdx = 0; aParticleIdx < (anEmitter.mParticleDefVector.length | 0); aParticleIdx++) {
                    anEmitterInstance.mParticleDefInstanceVector[aParticleIdx] = new GameFramework.resources.PIParticleDefInstance();
                    aTextureUsedVector[anEmitter.mParticleDefVector[aParticleIdx].mTextureIdx] = true;
                }
                anEmitterInstanceDef.mPosition = new GameFramework.resources.PIValue2D();
                this.ReadValue2D(anEmitterInstanceDef.mPosition);
                var aNumEPoints = this.mReadBuffer.ReadShort();
                anEmitterInstanceDef.mPoints = [];
                for(var i = 0; i < aNumEPoints; i++) {
                    this.ExpectCmd('CEPoint');
                    var aV1 = this.mReadBuffer.ReadFloat();
                    var aV2 = this.mReadBuffer.ReadFloat();
                    var aPoint2D = new GameFramework.resources.PIValue2D();
                    this.ReadEPoint(aPoint2D);
                    anEmitterInstanceDef.mPoints.push(aPoint2D);
                }
                anEmitterInstanceDef.mValues = [];
                anEmitterInstanceDef.mValues.length = (GameFramework.resources.PIEmitterInstanceDef.Value.__COUNT | 0);
                for(var i_2 = 0; i_2 < (GameFramework.resources.PIEmitterInstanceDef.Value.__COUNT | 0); i_2++) {
                    anEmitterInstanceDef.mValues[i_2] = new GameFramework.resources.PIValue();
                }
                for(var i_3 = 0; i_3 < 17; i_3++) {
                    this.ReadValue(anEmitterInstanceDef.mValues[i_3]);
                }
                anEmitterInstanceDef.mEmitAtPointsNum2 = this.mReadBuffer.ReadInt();
                l = this.mReadBuffer.ReadInt();
                this.ReadValue(anEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_Y | 0)]);
                l = this.mReadBuffer.ReadInt();
                this.ReadValue(anEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.UNKNOWN4 | 0)]);
                var anImgCount = this.mReadBuffer.ReadShort();
                var aMaskImageName = null;
                for(var i_4 = 0; i_4 < anImgCount; i_4++) {
                    aMaskImageName = this.ReadString();
                }
                var hasMaskImage = this.mReadBuffer.ReadBoolean();
                var aMaskImagePath = this.ReadString();
                l = this.mReadBuffer.ReadInt();
                l = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mInvertMask = this.mReadBuffer.ReadBoolean();
                l = this.mReadBuffer.ReadInt();
                l = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mIsSuperEmitter = this.mReadBuffer.ReadBoolean();
                anEmitterInstanceDef.mFreeEmitterIndices = [];
                var aNumFreeEmitters = this.mReadBuffer.ReadShort();
                for(var i_5 = 0; i_5 < aNumFreeEmitters; i_5++) {
                    if(this.mIsPPF) {
                        var anEmitterIdxInner = this.mReadBuffer.ReadShort();
                        anEmitterInstanceDef.mFreeEmitterIndices.push(anEmitterIdxInner);
                        anEmitterDefUsedVector[anEmitterIdx_2] = true;
                    } else {
                        var aStringIdx = this.mReadBuffer.ReadShort();
                        anEmitterInstanceDef.mFreeEmitterIndices.push(this.mDef.mEmitterRefMap[aStringIdx]);
                        anEmitterDefUsedVector[this.mDef.mEmitterRefMap[aStringIdx]] = true;
                    }
                }
                anEmitterInstance.mSuperEmitterParticleDefInstanceVector = [];
                anEmitterInstance.mSuperEmitterParticleDefInstanceVector.length = aNumFreeEmitters;
                for(var i_6 = 0; i_6 < anEmitterInstance.mSuperEmitterParticleDefInstanceVector.length; i_6++) {
                    anEmitterInstance.mSuperEmitterParticleDefInstanceVector[i_6] = new GameFramework.resources.PIParticleDefInstance();
                }
                l = this.mReadBuffer.ReadInt();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
            }
            aLayerDef.mDeflectorVector = [];
            var aDeflectorCount = this.mReadBuffer.ReadShort();
            for(var i_7 = 0; i_7 < aDeflectorCount; i_7++) {
                var aDeflector = new GameFramework.resources.PIDeflector();
                this.ExpectCmd('CDeflector');
                aDeflector.mName = this.ReadString();
                aDeflector.mBounce = this.mReadBuffer.ReadFloat();
                aDeflector.mHits = this.mReadBuffer.ReadFloat();
                aDeflector.mThickness = this.mReadBuffer.ReadFloat();
                aDeflector.mVisible = this.mReadBuffer.ReadBoolean();
                aDeflector.mPos = new GameFramework.resources.PIValue2D();
                this.ReadValue2D(aDeflector.mPos);
                var aNumEPoints_2 = this.mReadBuffer.ReadShort();
                aDeflector.mPoints = [];
                aDeflector.mCurPoints = [];
                for(var j = 0; j < aNumEPoints_2; j++) {
                    this.ExpectCmd('CEPoint');
                    var aV1_2 = this.mReadBuffer.ReadFloat();
                    var aV2_2 = this.mReadBuffer.ReadFloat();
                    var aPoint2D_2 = new GameFramework.resources.PIValue2D();
                    this.ReadEPoint(aPoint2D_2);
                    aDeflector.mPoints.push(aPoint2D_2);
                    aDeflector.mCurPoints.push(new GameFramework.geom.TPoint());
                }
                aDeflector.mActive = new GameFramework.resources.PIValue();
                this.ReadValue(aDeflector.mActive);
                aDeflector.mAngle = new GameFramework.resources.PIValue();
                this.ReadValue(aDeflector.mAngle);
                aLayerDef.mDeflectorVector.push(aDeflector);
            }
            var aBlockerCount = this.mReadBuffer.ReadShort();
            for(var i_8 = 0; i_8 < aBlockerCount; i_8++) {
                var aBlocker = new GameFramework.resources.PIBlocker();
                this.ExpectCmd('CBlocker');
                aBlocker.mName = this.ReadString();
                var l_2 = this.mReadBuffer.ReadInt();
                l_2 = this.mReadBuffer.ReadInt();
                l_2 = this.mReadBuffer.ReadInt();
                l_2 = this.mReadBuffer.ReadInt();
                l_2 = this.mReadBuffer.ReadInt();
                aBlocker.mPos = new GameFramework.resources.PIValue2D();
                this.ReadValue2D(aBlocker.mPos);
                var aNumEPoints_3 = this.mReadBuffer.ReadShort();
                aBlocker.mPoints = [];
                for(var j_2 = 0; j_2 < aNumEPoints_3; j_2++) {
                    this.ExpectCmd('CEPoint');
                    var aV1_3 = this.mReadBuffer.ReadFloat();
                    var aV2_3 = this.mReadBuffer.ReadFloat();
                    var aPoint2D_3 = new GameFramework.resources.PIValue2D();
                    this.ReadEPoint(aPoint2D_3);
                    aBlocker.mPoints.push(aPoint2D_3);
                }
                aBlocker.mActive = new GameFramework.resources.PIValue();
                this.ReadValue(aBlocker.mActive);
                aBlocker.mAngle = new GameFramework.resources.PIValue();
                this.ReadValue(aBlocker.mAngle);
                aLayerDef.mBlockerVector.push(aBlocker);
            }
            aLayerDef.mOffset = new GameFramework.resources.PIValue2D();
            this.ReadValue2D(aLayerDef.mOffset);
            aLayerDef.mOrigOffset = aLayerDef.mOffset.GetValueAt(0.0);
            aLayerDef.mAngle = new GameFramework.resources.PIValue();
            this.ReadValue(aLayerDef.mAngle);
            var aBkgPath = this.ReadString();
            for(var i_9 = 0; i_9 < 32; i_9++) {
                this.mReadBuffer.ReadByte();
            }
            var aCount_2 = this.mReadBuffer.ReadShort();
            var aBkgFileName;
            for(var i_10 = 0; i_10 < aCount_2; i_10++) {
                aBkgFileName = this.ReadString();
            }
            for(var i_11 = 0; i_11 < 36; i_11++) {
                this.mReadBuffer.ReadByte();
            }
            aLayerDef.mForceVector = [];
            var aForceCount = this.mReadBuffer.ReadShort();
            for(var aForceIdx = 0; aForceIdx < aForceCount; aForceIdx++) {
                this.ExpectCmd('CForce');
                var aForce = new GameFramework.resources.PIForce();
                aForce.mName = this.ReadString();
                aForce.mVisible = this.mReadBuffer.ReadBoolean();
                aForce.mPos = new GameFramework.resources.PIValue2D();
                this.ReadValue2D(aForce.mPos);
                aForce.mActive = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mActive);
                var aVal = new GameFramework.resources.PIValue();
                this.ReadValue(aVal);
                aForce.mStrength = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mStrength);
                aForce.mWidth = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mWidth);
                aForce.mHeight = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mHeight);
                aForce.mAngle = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mAngle);
                aForce.mDirection = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mDirection);
                aLayerDef.mForceVector.push(aForce);
            }
            for(var i_12 = 0; i_12 < 28; i_12++) {
                this.mReadBuffer.ReadByte();
            }
        }
        var anEmitterRemapMap = [];
        anEmitterRemapMap.length = this.mDef.mEmitterVector.length;
        var anEmittersUsedCount = 0;
        for(var anEmitterIdx_3 = 0; anEmitterIdx_3 < (this.mDef.mEmitterVector.length | 0); anEmitterIdx_3++) {
            if(anEmitterDefUsedVector[anEmitterIdx_3]) {
                anEmitterRemapMap[anEmitterIdx_3] = anEmittersUsedCount++;
            }
        }
        var aCheckIdx = 0;
        var anEraseIdx = 0;
        for(var anEmitterIdx_4 = 0; anEmitterIdx_4 < (this.mDef.mEmitterVector.length | 0); anEmitterIdx_4++) {
            if(!anEmitterDefUsedVector[aCheckIdx]) {
                this.mDef.mEmitterVector.removeAt(anEraseIdx);
                anEmitterIdx_4--;
            } else {
                anEraseIdx++;
            }
            aCheckIdx++;
        }
        for(var aLayerIdx_2 = 0; aLayerIdx_2 < (this.mDef.mLayerDefVector.length | 0); aLayerIdx_2++) {
            var aLayer_2 = this.mDef.mLayerDefVector[aLayerIdx_2];
            for(var anEmitterIdx_5 = 0; anEmitterIdx_5 < aLayer_2.mEmitterInstanceDefVector.length; anEmitterIdx_5++) {
                var anEmitterInstance_2 = aLayer_2.mEmitterInstanceDefVector[anEmitterIdx_5];
                anEmitterInstance_2.mEmitterDefIdx = anEmitterRemapMap[anEmitterInstance_2.mEmitterDefIdx];
                for(var aFreeEmitterIdx = 0; aFreeEmitterIdx < anEmitterInstance_2.mFreeEmitterIndices.length; aFreeEmitterIdx++) {
                    anEmitterInstance_2.mFreeEmitterIndices[aFreeEmitterIdx] = anEmitterRemapMap[anEmitterInstance_2.mFreeEmitterIndices[aFreeEmitterIdx]];
                }
            }
        }
        var aTextureRemapMap = [];
        aTextureRemapMap.length = this.mDef.mTextureVector.length;
        var aTexturesUsedCount = 0;
        for(var anTextureIdx = 0; anTextureIdx < (this.mDef.mTextureVector.length | 0); anTextureIdx++) {
            if(aTextureUsedVector[anTextureIdx]) {
                aTextureRemapMap[anTextureIdx] = aTexturesUsedCount++;
            }
        }
        aCheckIdx = 0;
        anEraseIdx = 0;
        for(var anTextureIdx_2 = 0; anTextureIdx_2 < (this.mDef.mTextureVector.length | 0); anTextureIdx_2++) {
            if(!aTextureUsedVector[aCheckIdx]) {
                this.mDef.mTextureVector.removeAt(anEraseIdx);
                anTextureIdx_2--;
            } else {
                anEraseIdx++;
            }
            aCheckIdx++;
        }
        for(var anEmitterIdx_6 = 0; anEmitterIdx_6 < (this.mDef.mEmitterVector.length | 0); anEmitterIdx_6++) {
            var anEmitter_2 = this.mDef.mEmitterVector[anEmitterIdx_6];
            for(var aParticleIdx_2 = 0; aParticleIdx_2 < anEmitter_2.mParticleDefVector.length; aParticleIdx_2++) {
                var aParticleDef = anEmitter_2.mParticleDefVector[aParticleIdx_2];
                aParticleDef.mTextureIdx = aTextureRemapMap[aParticleDef.mTextureIdx];
            }
        }
        var aBkgColor;
        aBkgColor = (((this.mReadBuffer.ReadByte() | 0)) << 16) | 0xff000000;
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        aBkgColor |= ((this.mReadBuffer.ReadByte() | 0)) << 8;
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        aBkgColor |= this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        this.mBkgColor = aBkgColor;
        this.mReadBuffer.ReadInt();
        this.mReadBuffer.ReadInt();
        this.mFramerate = this.mReadBuffer.ReadShort();
        this.mReadBuffer.ReadShort();
        this.mReadBuffer.ReadShort();
        this.mReadBuffer.ReadShort();
        this.mWidth = this.mReadBuffer.ReadInt();
        this.mHeight = this.mReadBuffer.ReadInt();
        var aJunk = this.mReadBuffer.ReadInt();
        aJunk = this.mReadBuffer.ReadInt();
        aJunk = this.mReadBuffer.ReadInt();
        aJunk = this.mReadBuffer.ReadInt();
        aJunk = this.mReadBuffer.ReadInt();
        this.mFirstFrameNum = this.mReadBuffer.ReadInt();
        this.mLastFrameNum = this.mReadBuffer.ReadInt();
        var aThumbString = this.ReadString();
        var aByte = this.mReadBuffer.ReadByte();
        var aThumbWidth = this.mReadBuffer.ReadShort();
        var aThumbHeight = this.mReadBuffer.ReadShort();
        if((this.mIsPPF) && (this.mVersion >= 1)) {
            var aStartupStateSize = this.mReadBuffer.ReadInt();
            if(aStartupStateSize > 0) {
                this.mStartupState = new GameFramework.DataBuffer();
                var aBytes = Array.Create(aStartupStateSize, 0);
                theDataBuffer.ReadBytes(aBytes, 0, aStartupStateSize);
                this.mStartupState.InitRead(aBytes);
            }
        } else {
            this.mStartupState = null;
        }
        var aCurCrPos = 0;
        while(aCurCrPos < (this.mNotes.length | 0)) {
            var aLine;
            var aCommaPos = (this.mNotes.indexOf(String.fromCharCode(10), aCurCrPos) | 0);
            if(aCommaPos != (-1 | 0)) {
                aLine = this.mNotes.substr(aCurCrPos, aCommaPos - aCurCrPos).trim();
                aCurCrPos = aCommaPos + 1;
            } else {
                aLine = this.mNotes.substr(aCurCrPos).trim();
                aCurCrPos = this.mNotes.length;
            }
            if(aLine.length > 0) {
                if(this.mNotesParams == null) {
                    this.mNotesParams = {};
                }
                var aColonPos = aLine.indexOf(String.fromCharCode(58));
                if(aColonPos != -1) {
                    this.mNotesParams[aLine.substr(0, aColonPos).toUpperCase()] = aLine.substr(aColonPos + 1).trim();
                } else {
                    this.mNotesParams[aLine.toUpperCase()] = '';
                }
            }
        }
        var aRandParam = this.GetNotesParam('Rand');
        var aCurPos = 0;
        while(aCurPos < (aRandParam.length | 0)) {
            var aCommaPos_2 = (aRandParam.indexOf(String.fromCharCode(44), aCurPos) | 0);
            if(aCommaPos_2 != (-1 | 0)) {
                this.mRandSeeds.push(GameFramework.Utils.ToInt(aRandParam.substr(aCurPos, aCommaPos_2 - aCurPos).trim()));
                aCurPos = aCommaPos_2 + 1;
            } else {
                this.mRandSeeds.push(GameFramework.Utils.ToInt(aRandParam.substr(aCurPos).trim()));
                break;
            }
        }
        this.mEmitAfterTimeline = this.GetNotesParam('EmitAfter', 'no') != 'no';
        this.DetermineGroupFlags();
        return this.mLoaded = (this.mError == null);
    },
    DetermineGroupFlags : function GameFramework_resources_PIEffect$DetermineGroupFlags() {
        for(var aLayerIdx = 0; aLayerIdx < (this.mDef.mLayerDefVector.length | 0); aLayerIdx++) {
            var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
            var aLayer = this.mLayerVector[aLayerIdx];
            for(var anEmitterInstanceIdx = 0; anEmitterInstanceIdx < aLayer.mEmitterInstanceVector.length; anEmitterInstanceIdx++) {
                var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
                var anEmitterInstance = aLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
                if(anEmitterInstanceDef.mIsSuperEmitter) {
                    for(var aFreeEmitterIdx = 0; aFreeEmitterIdx < anEmitterInstanceDef.mFreeEmitterIndices.length; aFreeEmitterIdx++) {
                        var anEmitter = this.mDef.mEmitterVector[anEmitterInstanceDef.mFreeEmitterIndices[aFreeEmitterIdx]];
                        for(var aParticleDefIdx = 0; (aParticleDefIdx | 0) < anEmitter.mParticleDefVector.length; aParticleDefIdx++) {
                            var aParticleGroup = anEmitterInstance.mParticleGroup;
                            var aParticleDef = anEmitter.mParticleDefVector[aParticleDefIdx];
                            anEmitterInstance.mParticleGroup.mHasColorSampling |= aParticleDef.mUpdateColorFromLayer || aParticleDef.mUpdateTransparencyFromLayer;
                            anEmitterInstance.mParticleGroup.mHasVelocityEffectors |= (aLayer.mLayerDef.mForceVector.length > 0) || (aLayer.mLayerDef.mDeflectorVector.length > 0);
                            anEmitterInstance.mParticleGroup.mHasAlignToMotion |= aParticleDef.mAngleAlignToMotion;
                            anEmitterInstance.mParticleGroup.mHasIntense |= aParticleDef.mIntense;
                            anEmitterInstance.mParticleGroup.mHasPreserveColor |= aParticleDef.mPreserveColor;
                            anEmitterInstance.mParticleGroup.mHasSingleParticles |= aParticleDef.mSingleParticle;
                            anEmitterInstance.mParticleGroup.mHasAttachToEmitters |= aParticleDef.mAttachToEmitter;
                            var aTexture = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                            anEmitterInstance.mParticleGroup.mHasImageCycle |= ((aParticleDef.mAnimSpeed != -1) && (aTexture.mNumCels > 1));
                        }
                    }
                } else {
                    var anEmitter_2 = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                    for(var aParticleDefIdx_2 = 0; aParticleDefIdx_2 < anEmitter_2.mParticleDefVector.length; aParticleDefIdx_2++) {
                        var aParticleGroup_2 = anEmitterInstance.mParticleGroup;
                        var aParticleDef_2 = anEmitter_2.mParticleDefVector[aParticleDefIdx_2];
                        anEmitterInstance.mParticleGroup.mHasColorSampling |= aParticleDef_2.mUpdateColorFromLayer || aParticleDef_2.mUpdateTransparencyFromLayer;
                        anEmitterInstance.mParticleGroup.mHasVelocityEffectors |= (aLayer.mLayerDef.mForceVector.length > 0) || (aLayer.mLayerDef.mDeflectorVector.length > 0);
                        anEmitterInstance.mParticleGroup.mHasAlignToMotion |= aParticleDef_2.mAngleAlignToMotion;
                        anEmitterInstance.mParticleGroup.mHasIntense |= aParticleDef_2.mIntense;
                        anEmitterInstance.mParticleGroup.mHasPreserveColor |= aParticleDef_2.mPreserveColor;
                        anEmitterInstance.mParticleGroup.mHasSingleParticles |= aParticleDef_2.mSingleParticle;
                        anEmitterInstance.mParticleGroup.mHasAttachToEmitters |= aParticleDef_2.mAttachToEmitter;
                        var aTexture_2 = this.mDef.mTextureVector[aParticleDef_2.mTextureIdx];
                        anEmitterInstance.mParticleGroup.mHasImageCycle |= ((aParticleDef_2.mAnimSpeed != -1) && (aTexture_2.mNumCels > 1));
                    }
                }
            }
        }
    },
    LoadState : function GameFramework_resources_PIEffect$LoadState(theBuffer, shortened) {
        if(this.mError != null) {
            return false;
        }
        this.ResetAnim();
        var aSize = theBuffer.ReadInt();
        var anEnd = theBuffer.get_Size();
        var aVersion = theBuffer.ReadShort();
        if(!shortened) {
            var aSrcFileName = theBuffer.ReadAsciiString();
            var aChecksum = theBuffer.ReadInt();
            if(aChecksum != this.mFileChecksum) {
                return false;
            }
        }
        this.mFrameNum = theBuffer.ReadFloat();
        if(!shortened) {
            var aRandSeed = theBuffer.ReadAsciiString();
            this.mWantsSRand = false;
        }
        if(!shortened) {
            this.mEmitAfterTimeline = theBuffer.ReadBoolean();
            this.mEmitterTransform = this.ReadTransform2D(theBuffer);
            this.mDrawTransform = this.ReadTransform2D(theBuffer);
        } else if(aVersion == 0) {
            theBuffer.ReadBoolean();
        }
        if(this.mFrameNum > 0.0) {
            for(var aLayerIdx = 0; aLayerIdx < (this.mDef.mLayerDefVector.length | 0); aLayerIdx++) {
                var aLayer = this.mLayerVector[aLayerIdx];
                var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
                for(var anEmitterInstanceIdx = 0; anEmitterInstanceIdx < aLayerDef.mEmitterInstanceDefVector.length; anEmitterInstanceIdx++) {
                    var anEmitterInstance = aLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
                    var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
                    if(theBuffer.ReadBoolean()) {
                        anEmitterInstance.mTransform = this.ReadTransform2D(theBuffer);
                    }
                    anEmitterInstance.mWasActive = theBuffer.ReadBoolean();
                    anEmitterInstance.mWithinLifeFrame = theBuffer.ReadBoolean();
                    var aDefEmitter = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                    for(var aParticleDefIdx = 0; aParticleDefIdx < aDefEmitter.mParticleDefVector.length; aParticleDefIdx++) {
                        var aParticleDefInstance = anEmitterInstance.mParticleDefInstanceVector[aParticleDefIdx];
                        this.LoadParticleDefInstance(theBuffer, aParticleDefInstance);
                    }
                    for(var aFreeEmitterIdx = 0; aFreeEmitterIdx < anEmitterInstanceDef.mFreeEmitterIndices.length; aFreeEmitterIdx++) {
                        var aParticleDefInstance_2 = anEmitterInstance.mSuperEmitterParticleDefInstanceVector[aFreeEmitterIdx];
                        this.LoadParticleDefInstance(theBuffer, aParticleDefInstance_2);
                    }
                    var aSuperEmitterCount = theBuffer.ReadInt();
                    for(var aSuperEmitterIdx = 0; aSuperEmitterIdx < aSuperEmitterCount; aSuperEmitterIdx++) {
                        var aChildEmitterInstance = new GameFramework.resources.PIFreeEmitterInstance();
                        var anEmitterIdx = theBuffer.ReadShort();
                        aChildEmitterInstance.mEmitterSrc = this.mDef.mEmitterVector[anEmitterInstanceDef.mFreeEmitterIndices[anEmitterIdx]];
                        aChildEmitterInstance.mParentFreeEmitter = null;
                        aChildEmitterInstance.mParticleDef = null;
                        aChildEmitterInstance.mNum = aSuperEmitterIdx;
                        this.LoadParticle(theBuffer, aLayer, aChildEmitterInstance);
                        var anEmitter = aChildEmitterInstance.mEmitterSrc;
                        aChildEmitterInstance.mEmitter.mParticleDefInstanceVector = [];
                        for(var aParticleDefIdx_2 = 0; aParticleDefIdx_2 < anEmitter.mParticleDefVector.length; aParticleDefIdx_2++) {
                            var aParticleDefInstance_3 = new GameFramework.resources.PIParticleDefInstance();
                            aChildEmitterInstance.mEmitter.mParticleDefInstanceVector.push(aParticleDefInstance_3);
                            this.LoadParticleDefInstance(theBuffer, aParticleDefInstance_3);
                        }
                        if(aSuperEmitterIdx > 0) {
                            anEmitterInstance.mSuperEmitterGroup.mTail.mNext = aChildEmitterInstance;
                            aChildEmitterInstance.mPrev = anEmitterInstance.mSuperEmitterGroup.mTail;
                        } else {
                            anEmitterInstance.mSuperEmitterGroup.mHead = aChildEmitterInstance;
                        }
                        anEmitterInstance.mSuperEmitterGroup.mTail = aChildEmitterInstance;
                        anEmitterInstance.mSuperEmitterGroup.mCount++;
                        var aParticlesCount = theBuffer.ReadInt();
                        for(var aParticleIdx = 0; aParticleIdx < aParticlesCount; aParticleIdx++) {
                            var aParticleInstance = new GameFramework.resources.PIParticleInstance();
                            aParticleInstance.mEmitterSrc = aChildEmitterInstance.mEmitterSrc;
                            aParticleInstance.mParentFreeEmitter = aChildEmitterInstance;
                            var aParticleDefIdx_3 = theBuffer.ReadShort();
                            aParticleInstance.mParticleDef = aParticleInstance.mEmitterSrc.mParticleDefVector[aParticleDefIdx_3];
                            aParticleInstance.mParticleDefInstance = aChildEmitterInstance.mEmitter.mParticleDefInstanceVector[aParticleDefIdx_3];
                            aParticleInstance.mNum = aParticleIdx;
                            this.LoadParticle(theBuffer, aLayer, aParticleInstance);
                            this.CalcParticleTransform(aLayer, anEmitterInstance, aParticleInstance.mEmitterSrc, aParticleInstance.mParticleDef, aChildEmitterInstance.mEmitter.mParticleGroup, aParticleInstance);
                            if(aParticleIdx > 0) {
                                aChildEmitterInstance.mEmitter.mParticleGroup.mTail.mNext = aParticleInstance;
                                aParticleInstance.mPrev = aChildEmitterInstance.mEmitter.mParticleGroup.mTail;
                            } else {
                                aChildEmitterInstance.mEmitter.mParticleGroup.mHead = aParticleInstance;
                            }
                            aChildEmitterInstance.mEmitter.mParticleGroup.mTail = aParticleInstance;
                            aChildEmitterInstance.mEmitter.mParticleGroup.mCount++;
                        }
                    }
                    var aParticleCount = theBuffer.ReadInt();
                    for(var aParticleIdx_2 = 0; aParticleIdx_2 < aParticleCount; aParticleIdx_2++) {
                        var aParticleInstance_2 = new GameFramework.resources.PIParticleInstance();
                        aParticleInstance_2.mEmitterSrc = aDefEmitter;
                        aParticleInstance_2.mParentFreeEmitter = null;
                        var aParticleDefIdx_4 = theBuffer.ReadShort();
                        aParticleInstance_2.mParticleDef = aParticleInstance_2.mEmitterSrc.mParticleDefVector[aParticleDefIdx_4];
                        aParticleInstance_2.mParticleDefInstance = anEmitterInstance.mParticleDefInstanceVector[aParticleDefIdx_4];
                        aParticleInstance_2.mNum = aParticleIdx_2;
                        this.LoadParticle(theBuffer, aLayer, aParticleInstance_2);
                        this.CalcParticleTransform(aLayer, anEmitterInstance, aParticleInstance_2.mEmitterSrc, aParticleInstance_2.mParticleDef, anEmitterInstance.mParticleGroup, aParticleInstance_2);
                        if(aParticleIdx_2 > 0) {
                            anEmitterInstance.mParticleGroup.mTail.mNext = aParticleInstance_2;
                            aParticleInstance_2.mPrev = anEmitterInstance.mParticleGroup.mTail;
                        } else {
                            anEmitterInstance.mParticleGroup.mHead = aParticleInstance_2;
                        }
                        anEmitterInstance.mParticleGroup.mTail = aParticleInstance_2;
                        anEmitterInstance.mParticleGroup.mCount++;
                    }
                }
            }
        } else {
            theBuffer.set_Position(anEnd);
        }
        return true;
    },
    ResetAnim : function GameFramework_resources_PIEffect$ResetAnim() {
        this.mFrameNum = 0;
        if(this.mDef.mLayerDefVector != null) {
            for(var aLayerIdx = 0; aLayerIdx < this.mDef.mLayerDefVector.length; aLayerIdx++) {
                var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
                var aLayer = this.mLayerVector[aLayerIdx];
                for(var anEmitterInstanceIdx = 0; anEmitterInstanceIdx < (aLayer.mEmitterInstanceVector.length | 0); anEmitterInstanceIdx++) {
                    var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
                    var anEmitterInstance = aLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
                    var aParticleInstance;
                    var aChildEmitterInstance = anEmitterInstance.mSuperEmitterGroup.mHead;
                    while(aChildEmitterInstance != null) {
                        var aNext = aChildEmitterInstance.mNext;
                        aParticleInstance = aChildEmitterInstance.mEmitter.mParticleGroup.mHead;
                        while(aParticleInstance != null) {
                            var anotherNext = aParticleInstance.mNext;
                            aParticleInstance.Dispose();
                            aParticleInstance = anotherNext;
                        }
                        aChildEmitterInstance.Dispose();
                        aChildEmitterInstance = aNext;
                    }
                    anEmitterInstance.mSuperEmitterGroup.mHead = null;
                    anEmitterInstance.mSuperEmitterGroup.mTail = null;
                    anEmitterInstance.mSuperEmitterGroup.mCount = 0;
                    aParticleInstance = anEmitterInstance.mParticleGroup.mHead;
                    while(aParticleInstance != null) {
                        var aNext_2 = aParticleInstance.mNext;
                        aParticleInstance.Dispose();
                        aParticleInstance = aNext_2;
                    }
                    anEmitterInstance.mParticleGroup.mHead = null;
                    anEmitterInstance.mParticleGroup.mTail = null;
                    anEmitterInstance.mParticleGroup.mCount = 0;
                    for(var aFreeEmitterIdx = 0; aFreeEmitterIdx < (anEmitterInstanceDef.mFreeEmitterIndices.length | 0); aFreeEmitterIdx++) {
                        var aParticleDefInstance = anEmitterInstance.mSuperEmitterParticleDefInstanceVector[aFreeEmitterIdx];
                        aParticleDefInstance.Reset();
                    }
                    var anEmitter = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                    for(var aParticleDefIdx = 0; (aParticleDefIdx | 0) < (anEmitter.mParticleDefVector.length | 0); aParticleDefIdx++) {
                        var aParticleDefInstance_2 = anEmitterInstance.mParticleDefInstanceVector[aParticleDefIdx];
                        aParticleDefInstance_2.Reset();
                    }
                    anEmitterInstance.mWithinLifeFrame = true;
                    anEmitterInstance.mWasActive = false;
                }
            }
        }
        this.mCurNumEmitters = 0;
        this.mCurNumParticles = 0;
        this.mLastDrawnPixelCount = 0;
        this.mWantsSRand = true;
    },
    Clear : function GameFramework_resources_PIEffect$Clear() {
        this.mError = null;
        this.ResetAnim();
        this.mStringVector = null;
        this.mNotesParams = null;
        this.mDef.mEmitterVector = null;
        this.mDef.mTextureVector = null;
        this.mDef.mLayerDefVector = null;
        this.mDef.mEmitterRefMap = null;
        this.mRandSeeds = null;
        this.mVersion = 0;
        this.mLoaded = false;
    },
    GetLayer : function GameFramework_resources_PIEffect$GetLayer(theIdx) {
        if(theIdx < (this.mDef.mLayerDefVector.length | 0)) {
            return this.mLayerVector[theIdx];
        }
        return null;
    },
    GetLayer$2 : function GameFramework_resources_PIEffect$GetLayer$2(theName) {
        for(var i = 0; i < (this.mDef.mLayerDefVector.length | 0); i++) {
            if((theName.length == 0) || (this.mDef.mLayerDefVector[i].mName == theName)) {
                return this.mLayerVector[i];
            }
        }
        return null;
    },
    GetEmitterPos : function GameFramework_resources_PIEffect$GetEmitterPos(theEmitterInstance, doTransform) {
        var aCurPoint = theEmitterInstance.mEmitterInstanceDef.mPosition.GetValueAt(this.mFrameNum);
        if(doTransform) {
            aCurPoint = theEmitterInstance.mTransform.transformPoint(aCurPoint);
            if(this.mEmitterTransform != null) {
                aCurPoint = this.mEmitterTransform.transformPoint(aCurPoint);
            }
            aCurPoint.offset(theEmitterInstance.mOffset.x, theEmitterInstance.mOffset.y);
        }
        return aCurPoint;
    },
    CountParticles : function GameFramework_resources_PIEffect$CountParticles(theStart) {
        var aCount = 0;
        while(theStart != null) {
            aCount++;
            theStart = theStart.mNext;
        }
        return aCount;
    },
    CalcParticleTransform : function GameFramework_resources_PIEffect$CalcParticleTransform(theLayer, theEmitterInstance, theEmitter, theParticleDef, theParticleGroup, theParticleInstance) {
        var anEmitter = theEmitter;
        var aParticleDef = theParticleDef;
        var aParticleInstance = theParticleInstance;
        var aLifePct = aParticleInstance.mLifePct;
        var anEmitterDef = theEmitterInstance.mEmitterInstanceDef;
        var aBaseRotTrans = new GameFramework.geom.Matrix();
        var aScaleX;
        var aScaleY;
        var aTransform = new GameFramework.geom.Matrix();
        var anEmitterPos;
        if(theParticleDef != null) {
            var anIdx = (((aParticleInstance.mLifePctInt / (((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0))) | 0));
            var aLifeValueSample = theParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx];
            var aTextureChunk = theParticleDef.mTextureChunkVector[aParticleInstance.mImgIdx];
            aParticleInstance.mTextureChunk = aTextureChunk;
            if(theParticleDef.mSingleParticle) {
                aParticleInstance.mSrcSizeXMult = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_X | 0)].GetValueAt(this.mFrameNum)) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SIZE_X | 0)].GetValueAt(this.mFrameNum)) + aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0)]);
                aParticleInstance.mSrcSizeYMult = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_Y | 0)].GetValueAt(this.mFrameNum)) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SIZE_Y | 0)].GetValueAt(this.mFrameNum)) + aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0)]);
            }
            var aSizeX = Math.max(aLifeValueSample.mSizeX * aParticleInstance.mSrcSizeXMult, 1.5);
            var aSizeY = Math.max(aLifeValueSample.mSizeY * aParticleInstance.mSrcSizeYMult, 1.5);
            aScaleX = aSizeX * aTextureChunk.mScaleXFactor;
            aScaleY = aSizeY * aTextureChunk.mScaleYFactor;
            if(theParticleDef.mCalcParticleTransformWantsBaseRotTrans) {
                aBaseRotTrans.identity();
                var anEmitterRot = anEmitterDef.mCurAngle;
                if(anEmitterRot != 0) {
                    aBaseRotTrans.rotate(anEmitterRot);
                }
                if((aParticleInstance.mParentFreeEmitter != null) && (aParticleInstance.mParentFreeEmitter.mImgAngle != 0)) {
                    aBaseRotTrans.rotate(-aParticleInstance.mParentFreeEmitter.mImgAngle);
                }
            }
            var aRot = aParticleInstance.mImgAngle;
            if(theParticleDef.mAttachToEmitter) {
                if(aParticleInstance.mParentFreeEmitter != null) {
                    aRot += (aParticleInstance.mParentFreeEmitter.mImgAngle - aParticleInstance.mOrigEmitterAng) * theParticleDef.mAttachVal;
                } else {
                    aRot += anEmitterDef.mCurAngle * theParticleDef.mAttachVal;
                }
            }
            if(theParticleDef.mSingleParticle) {
                if((!theParticleDef.mAngleKeepAlignedToMotion) || (theParticleDef.mAttachToEmitter)) {
                    aRot += anEmitterDef.mCurAngle;
                }
            }
            if((theParticleDef != null) && (theParticleDef.mSingleParticle)) {
                aParticleInstance.mZoom = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ZOOM | 0)].GetValueAt(this.mFrameNum)) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.ZOOM | 0)].GetValueAt(this.mFrameNum, 1.0));
            }
            var aParticlePos = aParticleInstance.mPos;
            if(theParticleDef.mAttachToEmitter) {
                var aBackTrans = new GameFramework.geom.Matrix();
                aBackTrans.rotate(aParticleInstance.mOrigEmitterAng);
                var aBackPoint = aBackTrans.transformPoint(aParticlePos);
                var aCurRotPos = aBaseRotTrans.transformPoint(aBackPoint);
                aParticlePos.x = (aParticlePos.x * (1.0 - theParticleDef.mAttachVal)) + (aCurRotPos.x * theParticleDef.mAttachVal);
                aParticlePos.y = (aParticlePos.y * (1.0 - theParticleDef.mAttachVal)) + (aCurRotPos.y * theParticleDef.mAttachVal);
            }
            if(aParticleInstance.mZoom != 1.0) {
                var sin = Math.sin(aRot) * aParticleInstance.mZoom;
                var cos = Math.cos(aRot) * aParticleInstance.mZoom;
                aTransform.a = cos * aScaleX;
                aTransform.b = sin * aScaleX;
                aTransform.c = -sin * aScaleY;
                aTransform.d = cos * aScaleY;
                aTransform.tx = (aParticlePos.x + aTextureChunk.mRefOfsX * aScaleX) * aParticleInstance.mZoom;
                aTransform.ty = (aParticlePos.y + aTextureChunk.mRefOfsY * aScaleY) * aParticleInstance.mZoom;
            } else {
                var sin_2 = Math.sin(aRot);
                var cos_2 = Math.cos(aRot);
                aTransform.a = cos_2 * aScaleX;
                aTransform.b = sin_2 * aScaleX;
                aTransform.c = -sin_2 * aScaleY;
                aTransform.d = cos_2 * aScaleY;
                aTransform.tx = aParticlePos.x + aTextureChunk.mRefOfsX * aScaleX;
                aTransform.ty = aParticlePos.y + aTextureChunk.mRefOfsY * aScaleY;
            }
            anEmitterPos = aParticleInstance.mEmittedPos;
            if(theParticleDef.mSingleParticle) {
                var aCurEmitPos = aBaseRotTrans.transformPoint(aParticleInstance.mOrigPos);
                var aTempEmitterPos = this.GetEmitterPos(theEmitterInstance, !theParticleGroup.mWasEmitted);
                aCurEmitPos.x += aTempEmitterPos.x;
                aCurEmitPos.y += aTempEmitterPos.y;
                anEmitterPos = aCurEmitPos;
            } else if((theParticleDef.mAttachToEmitter) && (!theParticleGroup.mIsSuperEmitter)) {
                var aCurEmitPos_2;
                if(aParticleInstance.mParentFreeEmitter != null) {
                    aCurEmitPos_2 = new GameFramework.geom.TPoint(aParticleInstance.mParentFreeEmitter.mLastEmitterPos.x + aParticleInstance.mParentFreeEmitter.mOrigPos.x + aParticleInstance.mParentFreeEmitter.mPos.x, aParticleInstance.mParentFreeEmitter.mLastEmitterPos.y + aParticleInstance.mParentFreeEmitter.mOrigPos.y + aParticleInstance.mParentFreeEmitter.mPos.y);
                } else {
                    aCurEmitPos_2 = aBaseRotTrans.transformPoint(aParticleInstance.mOrigPos);
                    var aCurEmitterPos = this.GetEmitterPos(theEmitterInstance, !theParticleGroup.mWasEmitted);
                    aCurEmitPos_2.x += aCurEmitterPos.x;
                    aCurEmitPos_2.y += aCurEmitterPos.y;
                }
                anEmitterPos.x = (anEmitterPos.x * (1.0 - theParticleDef.mAttachVal)) + (aCurEmitPos_2.x * theParticleDef.mAttachVal);
                anEmitterPos.y = (anEmitterPos.y * (1.0 - theParticleDef.mAttachVal)) + (aCurEmitPos_2.y * theParticleDef.mAttachVal);
            }
        } else {
            if(aParticleInstance.mImgAngle != 0) {
                aTransform.rotate(aParticleInstance.mImgAngle);
            }
            var aParticlePos_2 = aParticleInstance.mPos;
            aTransform.translate(aParticlePos_2.x, aParticlePos_2.y);
            if(aParticleInstance.mZoom != 1.0) {
                aTransform.scale(aParticleInstance.mZoom, aParticleInstance.mZoom);
            }
            anEmitterPos = aParticleInstance.mEmittedPos;
        }
        aParticleInstance.mLastEmitterPos = anEmitterPos;
        aTransform.translate(anEmitterPos.x + theLayer.mCurOffset.x, anEmitterPos.y + theLayer.mCurOffset.y);
        if(theLayer.mCurAngle != 0) {
            aTransform.rotate(theLayer.mCurAngle);
        }
        theParticleInstance.mTransform = aTransform;
    },
    CalcParticleTransformSimple : function GameFramework_resources_PIEffect$CalcParticleTransformSimple(theLayer, theEmitterInstance, theEmitter, theParticleDef, theParticleGroup, theParticleInstance, theScaleX, theScaleY) {
        var anEmitter = theEmitter;
        var aParticleDef = theParticleDef;
        var aParticleInstance = theParticleInstance;
        var aLifePct = aParticleInstance.mLifePct;
        var anEmitterDef = theEmitterInstance.mEmitterInstanceDef;
        var aBaseRotTrans = new GameFramework.geom.Matrix();
        var aScaleX;
        var aScaleY;
        var aTransform = theParticleInstance.mTransform;
        var anEmitterPos;
        var aTextureChunk = theParticleDef.mTextureChunkVector[aParticleInstance.mImgIdx];
        aParticleInstance.mTextureChunk = aTextureChunk;
        var aSizeX = Math.max(theScaleX * aParticleInstance.mSrcSizeXMult, 1.5);
        var aSizeY = Math.max(theScaleY * aParticleInstance.mSrcSizeYMult, 1.5);
        aScaleX = aSizeX * aTextureChunk.mScaleXFactor;
        aScaleY = aSizeY * aTextureChunk.mScaleYFactor;
        if(aParticleInstance.mZoom != 1.0) {
            var sin = Math.sin(aParticleInstance.mImgAngle) * aParticleInstance.mZoom;
            var cos = Math.cos(aParticleInstance.mImgAngle) * aParticleInstance.mZoom;
            aTransform.a = cos * aScaleX;
            aTransform.b = sin * aScaleX;
            aTransform.c = -sin * aScaleY;
            aTransform.d = cos * aScaleY;
            aTransform.tx = (aParticleInstance.mPos.x + aTextureChunk.mRefOfsX * aScaleX) * aParticleInstance.mZoom;
            aTransform.ty = (aParticleInstance.mPos.y + aTextureChunk.mRefOfsY * aScaleY) * aParticleInstance.mZoom;
        } else {
            var sin_2 = Math.sin(aParticleInstance.mImgAngle);
            var cos_2 = Math.cos(aParticleInstance.mImgAngle);
            aTransform.a = cos_2 * aScaleX;
            aTransform.b = sin_2 * aScaleX;
            aTransform.c = -sin_2 * aScaleY;
            aTransform.d = cos_2 * aScaleY;
            aTransform.tx = aParticleInstance.mPos.x + aTextureChunk.mRefOfsX * aScaleX;
            aTransform.ty = aParticleInstance.mPos.y + aTextureChunk.mRefOfsY * aScaleY;
        }
        anEmitterPos = aParticleInstance.mEmittedPos;
        aTransform.translate(anEmitterPos.x + theLayer.mCurOffset.x, anEmitterPos.y + theLayer.mCurOffset.y);
        if(theLayer.mCurAngle != 0) {
            aTransform.rotate(theLayer.mCurAngle);
        }
    },
    UpdateParticleDef : function GameFramework_resources_PIEffect$UpdateParticleDef(theLayer, theEmitter, theEmitterInstance, theParticleDef, theParticleDefInstance, theParticleGroup, theFreeEmitter) {
        var anEmitterInstanceDef = theEmitterInstance.mEmitterInstanceDef;
        var anUpdateRate = (1000.0 / this.mFrameTime) / this.mAnimSpeed;
        var anEmitter = theEmitter;
        var aParticleDef = theParticleDef;
        var anEmitterLifePct = 0;
        if(theFreeEmitter != null) {
            anEmitterLifePct = theFreeEmitter.mLifePct;
        }
        if(aParticleDef != null) {
            var anOrigAlphaI = ((((((((this.mColor >>> 24) & 0xff) * (((theLayer.mColor >>> 24) & 0xff) * 256) / 255) | 0) / 255) | 0)) | 0);
            theParticleDefInstance.mAlphaI = ((anOrigAlphaI * (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.VISIBILITY | 0)].GetValueAt(this.mFrameNum)) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.VISIBILITY | 0)].GetValueAt(this.mFrameNum, 1.0)) * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.VISIBILITY | 0)].GetValueAt(this.mFrameNum))) | 0);
            theParticleDefInstance.mCurWeight = (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum));
            theParticleDefInstance.mCurSpin = (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SPIN | 0)].GetValueAt(this.mFrameNum));
            theParticleDefInstance.mCurMotionRand = (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum));
        }
        if(theParticleDefInstance.mTicks % 25 == 0) {
            if(!theParticleGroup.mIsSuperEmitter) {
                if(theParticleDefInstance.mTicks == 0) {
                    theParticleDefInstance.mCurNumberVariation = (this.GetRandFloat() * 0.5) * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.NUMBER_VARIATION | 0)].GetValueAt(this.mFrameNum)) / 2.0;
                } else {
                    theParticleDefInstance.mCurNumberVariation = (this.GetRandFloat() * 0.75) * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.NUMBER_VARIATION | 0)].GetValueAt(this.mFrameNum)) / 2.0;
                }
            }
        }
        theParticleDefInstance.mTicks++;
        var aNumber;
        if(theParticleGroup.mIsSuperEmitter) {
            aNumber = (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.NUMBER | 0)].GetValueAt(this.mFrameNum)) * (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.NUMBER | 0)].GetValueAt(this.mFrameNum));
        } else {
            aNumber = (theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.NUMBER | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.NUMBER | 0)].GetValueAt(this.mFrameNum))) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.NUMBER | 0)].GetValueAt(this.mFrameNum)) + theParticleDefInstance.mCurNumberVariation) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_NUMBER_OVER_LIFE | 0)].GetValueAt(anEmitterLifePct, 1.0));
            aNumber = Math.max(0.0, aNumber);
            if((theParticleGroup.mWasEmitted) && (anEmitterLifePct >= 1.0)) {
                aNumber = 0;
            }
        }
        aNumber *= theEmitterInstance.mNumberScale;
        if(theParticleGroup.mIsSuperEmitter) {
            aNumber *= 30.0;
        } else if(!theParticleGroup.mWasEmitted) {
            switch(anEmitterInstanceDef.mEmitterGeom) {
                case GameFramework.resources.PIEmitterInstanceDef.Geom.LINE:

                {
                    if(anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                        aNumber *= anEmitterInstanceDef.mEmitAtPointsNum;
                    } else {
                        var aTotalLength = 0.0;
                        for(var i = 0; i < (anEmitterInstanceDef.mPoints.length | 0) - 1; i++) {
                            var aPt1 = anEmitterInstanceDef.mPoints[i].GetValueAt(this.mFrameNum);
                            var aPt2 = anEmitterInstanceDef.mPoints[i + 1].GetValueAt(this.mFrameNum);
                            aTotalLength += GameFramework.geom.TPoint.distance(aPt2, aPt1);
                        }
                        aNumber *= (aTotalLength / 35.0);
                    }
                }

                    break;
                case GameFramework.resources.PIEmitterInstanceDef.Geom.ECLIPSE:

                {
                    var aXRad = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0)].GetValueAt(this.mFrameNum));
                    var aYRad = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.YRADIUS | 0)].GetValueAt(this.mFrameNum));
                    if(anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                        aNumber *= anEmitterInstanceDef.mEmitAtPointsNum;
                    } else {
                        var aCircumf = 3.14159 * 2.0 * Math.sqrt((aXRad * aXRad + aYRad * aYRad) / 2.0);
                        aNumber *= (aCircumf / 35.0);
                    }
                }

                    break;
                case GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE:

                {
                    var aRad = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0)].GetValueAt(this.mFrameNum));
                    if(anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                        aNumber *= anEmitterInstanceDef.mEmitAtPointsNum;
                    } else {
                        var aCircumf_2 = 3.14159 * 2.0 * Math.sqrt(aRad * aRad);
                        aNumber *= (aCircumf_2 / 35.0);
                    }
                }

                    break;
                case GameFramework.resources.PIEmitterInstanceDef.Geom.AREA:

                {
                    if(anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                        aNumber *= anEmitterInstanceDef.mEmitAtPointsNum * anEmitterInstanceDef.mEmitAtPointsNum2;
                    } else {
                        var aW = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0)].GetValueAt(this.mFrameNum));
                        var aH = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.YRADIUS | 0)].GetValueAt(this.mFrameNum));
                        aNumber *= 1.0 + (aW * aH / 900.0 / 4.0);
                    }
                }

                    break;
            }
        }
        theParticleDefInstance.mNumberAcc += aNumber / anUpdateRate * GameFramework.resources.PIEffect.mGlobalCountScale * this.mDef.mCountScale;
        if(((!anEmitterInstanceDef.mIsSuperEmitter) && (!theEmitterInstance.mWasActive)) || (!theEmitterInstance.mWithinLifeFrame)) {
            theParticleDefInstance.mNumberAcc = 0.0;
        }
        var canUseGeom = true;
        if((!theParticleGroup.mIsSuperEmitter) && (theParticleDef.mSingleParticle)) {
            var aWantCount;
            if((anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.LINE) || (anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE)) {
                aWantCount = anEmitterInstanceDef.mEmitAtPointsNum;
            } else if(anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.AREA) {
                aWantCount = anEmitterInstanceDef.mEmitAtPointsNum * anEmitterInstanceDef.mEmitAtPointsNum2;
            } else {
                aWantCount = 1;
            }
            if(aWantCount == 0) {
                canUseGeom = false;
                aWantCount = 1;
            }
            var aCount = 0;
            var aCheckInstance = theParticleGroup.mHead;
            while(aCheckInstance != null) {
                if(aCheckInstance.mParticleDef == aParticleDef) {
                    aCount++;
                }
                aCheckInstance = aCheckInstance.mNext;
            }
            theParticleDefInstance.mNumberAcc = aWantCount - aCount;
        }
        while(theParticleDefInstance.mNumberAcc >= 1.0) {
            theParticleDefInstance.mNumberAcc -= 1.0;
            var aParticleInstance;
            if(theParticleGroup.mIsSuperEmitter) {
                var anEmitterInstance = new GameFramework.resources.PIFreeEmitterInstance();
                anEmitterInstance.mEmitter.mParticleDefInstanceVector = [];
                for(var i_2 = 0; i_2 < theEmitter.mParticleDefVector.length; i_2++) {
                    anEmitterInstance.mEmitter.mParticleDefInstanceVector.push(new GameFramework.resources.PIParticleDefInstance());
                }
                aParticleInstance = anEmitterInstance;
            } else {
                aParticleInstance = new GameFramework.resources.PIParticleInstance();
            }
            aParticleInstance.mParticleDef = theParticleDef;
            aParticleInstance.mParticleDefInstance = theParticleDefInstance;
            aParticleInstance.mEmitterSrc = theEmitter;
            aParticleInstance.mParentFreeEmitter = theFreeEmitter;
            aParticleInstance.mNum = theParticleDefInstance.mParticlesEmitted++;
            var anAngle;
            if(!theParticleGroup.mIsSuperEmitter) {
                if(theParticleDef.mUseEmitterAngleAndRange) {
                    if(theParticleGroup.mWasEmitted) {
                        anAngle = (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.EMISSION_ANGLE | 0)].GetValueAt(this.mFrameNum)) + (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.EMISSION_RANGE | 0)].GetValueAt(this.mFrameNum)) * this.GetRandFloat() / 2.0;
                    } else {
                        anAngle = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_ANGLE | 0)].GetValueAt(this.mFrameNum)) + (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_RANGE | 0)].GetValueAt(this.mFrameNum)) * this.GetRandFloat() / 2.0;
                    }
                } else {
                    anAngle = (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.EMISSION_ANGLE | 0)].GetValueAt(this.mFrameNum)) + (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.EMISSION_RANGE | 0)].GetValueAt(this.mFrameNum)) * this.GetRandFloat() / 2.0;
                }
            } else {
                anAngle = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_ANGLE | 0)].GetValueAt(this.mFrameNum)) + (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_RANGE | 0)].GetValueAt(this.mFrameNum)) * this.GetRandFloat() / 2.0;
            }
            anAngle = GameFramework.resources.PIEffect.DegToRad(-anAngle);
            var anEmitterAngle;
            if(theFreeEmitter != null) {
                anEmitterAngle = theFreeEmitter.mImgAngle;
            } else {
                anEmitterAngle = GameFramework.resources.PIEffect.DegToRad(-(theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0)].GetValueAt(this.mFrameNum)));
            }
            anAngle += anEmitterAngle;
            aParticleInstance.mOrigEmitterAng = anEmitterAngle;
            if((theParticleDef != null) && (theParticleDef.mAnimStartOnRandomFrame)) {
                aParticleInstance.mAnimFrameRand = GameFramework.Utils.GetRand() & 0x7fff;
            } else {
                aParticleInstance.mAnimFrameRand = 0;
            }
            if(aParticleDef != null) {
                var aTexture = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                aParticleInstance.mImgIdx = aParticleInstance.mAnimFrameRand % aTexture.mNumCels;
                if(aParticleDef.mAnimSpeed == -1) {
                    aParticleInstance.mImgIdx = aParticleInstance.mAnimFrameRand % aTexture.mNumCels;
                }
            }
            aParticleInstance.mZoom = (theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.ZOOM | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ZOOM | 0)].GetValueAt(this.mFrameNum)));
            if(!theParticleGroup.mIsSuperEmitter) {
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.LIFE | 0)] = this.GetVariationScalar() * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.LIFE_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0)] = this.GetVariationScalar() * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SIZE_X_VARIATION | 0)].GetValueAt(this.mFrameNum));
                if((theParticleDef == null) || (theParticleDef.mLockAspect)) {
                    aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0)] = aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0)];
                } else {
                    aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0)] = this.GetVariationScalar() * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SIZE_Y_VARIATION | 0)].GetValueAt(this.mFrameNum));
                }
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.VELOCITY | 0)] = this.GetVariationScalar() * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.VELOCITY_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)] = this.GetVariationScalar() * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.WEIGHT_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)] = this.GetVariationScalar() * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SPIN_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0)] = this.GetVariationScalar() * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.MOTION_RAND_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0)] = this.GetVariationScalar() * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.BOUNCE_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mSrcSizeXMult = (theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.SIZE_X | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_X | 0)].GetValueAt(this.mFrameNum))) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SIZE_X | 0)].GetValueAt(this.mFrameNum)) + aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0)]);
                aParticleInstance.mSrcSizeYMult = (theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.SIZE_Y | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_Y | 0)].GetValueAt(this.mFrameNum))) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SIZE_Y | 0)].GetValueAt(this.mFrameNum)) + aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0)]);
                if(theParticleGroup.mWasEmitted) {
                    aParticleInstance.mSrcSizeXMult *= (1.0 + theFreeEmitter.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0)]) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_SIZE_X_OVER_LIFE | 0)].GetValueAt(anEmitterLifePct, 1.0));
                    aParticleInstance.mSrcSizeYMult *= (1.0 + theFreeEmitter.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0)]) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_SIZE_Y_OVER_LIFE | 0)].GetValueAt(anEmitterLifePct, 1.0));
                    aParticleInstance.mZoom *= (1.0 + theFreeEmitter.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.ZOOM | 0)]) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_ZOOM_OVER_LIFE | 0)].GetValueAt(anEmitterLifePct, 1.0));
                }
            } else {
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.LIFE | 0)] = this.GetVariationScalar() * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_LIFE_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0)] = this.GetRandFloat() * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_SIZE_X_VARIATION | 0)].GetValueAt(this.mFrameNum));
                if((theParticleDef == null) || (theParticleDef.mLockAspect)) {
                    aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0)] = aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0)];
                } else {
                    aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0)] = this.GetRandFloat() * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_SIZE_Y_VARIATION | 0)].GetValueAt(this.mFrameNum));
                }
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.VELOCITY | 0)] = this.GetVariationScalar() * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_VELOCITY_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)] = this.GetVariationScalar() * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_WEIGHT_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)] = this.GetVariationScalar() * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_SPIN_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0)] = this.GetVariationScalar() * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_MOTION_RAND_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0)] = this.GetVariationScalar() * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_BOUNCE_VARIATION | 0)].GetValueAt(this.mFrameNum));
                aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.ZOOM | 0)] = this.GetVariationScalar() * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_ZOOM_VARIATION | 0)].GetValueAt(this.mFrameNum));
            }
            GameFramework.resources.PIEffect.sPIGeomDataEx.mTravelAngle = anAngle;
            GameFramework.resources.PIEffect.sPIGeomDataEx.isMaskedOut = false;
            aParticleInstance.mGradientRand = this.GetRandFloatU();
            aParticleInstance.mTicks = 0;
            aParticleInstance.mThicknessHitVariation = this.GetRandFloat();
            aParticleInstance.mImgAngle = 0;
            if(theParticleGroup.mIsSuperEmitter) {
                aParticleInstance.mLife = ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_LIFE | 0)].GetValueAt(this.mFrameNum)) + aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.LIFE | 0)]) * 5 * (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.LIFE | 0)].GetValueAt(this.mFrameNum));
            } else {
                aParticleInstance.mLife = (theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.LIFE | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.LIFE | 0)].GetValueAt(this.mFrameNum))) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.LIFE | 0)].GetValueAt(this.mFrameNum)) + aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.LIFE | 0)]);
            }
            if(aParticleInstance.mLife <= 0.00000001) {
                aParticleInstance.mLifePct = 1.0;
            }
            var aLifeTicks = aParticleInstance.mLife / (1.0 / anUpdateRate);
            aParticleInstance.mLifePctInc = 1.0 / aLifeTicks;
            aParticleInstance.mLifePctInt = 0;
            aParticleInstance.mLifePctIntInc = ((0x7fffffff / aLifeTicks) | 0);
            aParticleInstance.mLifeValueDeltaIdx = 0;
            if((aParticleDef != null) && (aParticleDef.mSingleParticle)) {
                aParticleInstance.mLifePctInt = 1;
                aParticleInstance.mLifePctIntInc = 0;
                aParticleInstance.mLifePctInc = 0;
            }
            var aPos = null;
            if(theParticleGroup.mWasEmitted) {
                if(theFreeEmitter.mLastEmitterPos == null) {
                    theFreeEmitter.mLastEmitterPos = new GameFramework.geom.TPoint();
                }
                aParticleInstance.mEmittedPos = theFreeEmitter.mLastEmitterPos.add(theFreeEmitter.mPos);
                aParticleInstance.mLastEmitterPos = aParticleInstance.mEmittedPos;
                aPos = new GameFramework.geom.TPoint();
            } else {
                aParticleInstance.mEmittedPos = this.GetEmitterPos(theEmitterInstance, true);
                aParticleInstance.mLastEmitterPos = aParticleInstance.mEmittedPos;
                var isMaskedOut = false;
                if(canUseGeom) {
                    aPos = this.GetGeomPos(theEmitterInstance, aParticleInstance, GameFramework.resources.PIEffect.sPIGeomDataEx).subtract(aParticleInstance.mEmittedPos);
                }
                if(isMaskedOut) {
                    continue;
                }
            }
            var aVelScale;
            if(theParticleGroup.mIsSuperEmitter) {
                aVelScale = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.VELOCITY | 0)].GetValueAt(this.mFrameNum)) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_VELOCITY | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.VELOCITY | 0)])) * 160.0;
            } else {
                aVelScale = ((theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.VELOCITY | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.VELOCITY | 0)].GetValueAt(this.mFrameNum))) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.VELOCITY | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.VELOCITY | 0)])));
            }
            aParticleInstance.mPos = new GameFramework.geom.TPoint(0, 0);
            aParticleInstance.mVel = new GameFramework.geom.TPoint(Math.cos(GameFramework.resources.PIEffect.sPIGeomDataEx.mTravelAngle) * aVelScale, Math.sin(GameFramework.resources.PIEffect.sPIGeomDataEx.mTravelAngle) * aVelScale);
            if(!theParticleGroup.mIsSuperEmitter) {
                if(theParticleDef.mAngleAlignToMotion) {
                    if((aParticleInstance.mVel.x == 0.0) && (aParticleInstance.mVel.y == 0.0)) {
                        GameFramework.resources.PIEffect.sPIGeomDataEx.mTravelAngle = 0;
                        aParticleInstance.mImgAngle = 0;
                        if((theParticleDef.mSingleParticle) && (theParticleDef.mAngleKeepAlignedToMotion) && (!theParticleDef.mAttachToEmitter)) {
                            aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad((theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0)].GetValueAt(this.mFrameNum)));
                        }
                    } else {
                        aParticleInstance.mImgAngle = -GameFramework.resources.PIEffect.sPIGeomDataEx.mTravelAngle;
                    }
                    aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad(theParticleDef.mAngleAlignOffset);
                } else if(theParticleDef.mAngleRandomAlign) {
                    aParticleInstance.mImgAngle = GameFramework.resources.PIEffect.DegToRad(-(theParticleDef.mAngleOffset + this.GetRandFloat() * theParticleDef.mAngleRange / 2.0));
                } else {
                    aParticleInstance.mImgAngle = GameFramework.resources.PIEffect.DegToRad(theParticleDef.mAngleValue);
                }
            }
            aParticleInstance.mColorMask = 0xffffffff;
            aParticleInstance.mColorOr = 0;
            if(aParticleDef != null) {
                if(aParticleDef.mRandomGradientColor) {
                    aParticleInstance.mColorMask &= 0xff000000;
                    if(aParticleDef.mUseKeyColorsOnly) {
                        var aKeyframe = ((Math.max(((aParticleInstance.mGradientRand * aParticleDef.mColor.mInterpolatorPointVector.length) | 0), aParticleDef.mColor.mInterpolatorPointVector.length - 1)) | 0);
                        aParticleInstance.mColorOr |= aParticleDef.mColor.GetKeyframeNum(aKeyframe) & 0xffffff;
                    } else {
                        var aColorPosUsed = aParticleInstance.mGradientRand;
                        aParticleInstance.mColorOr |= aParticleDef.mColor.GetValueAt(aColorPosUsed) & 0xffffff;
                    }
                } else if(aParticleDef.mUseNextColorKey) {
                    aParticleInstance.mColorMask &= 0xff000000;
                    var aKeyframe_2 = (((aParticleInstance.mNum / aParticleDef.mNumberOfEachColor) | 0)) % (aParticleDef.mColor.mInterpolatorPointVector.length | 0);
                    aParticleInstance.mColorOr |= aParticleDef.mColor.GetKeyframeNum(aKeyframe_2) & 0xffffff;
                }
            }
            aParticleInstance.mPos = new GameFramework.geom.TPoint();
            aParticleInstance.mOrigPos = aPos;
            var aTransform = new GameFramework.geom.Matrix();
            aTransform.rotate(-GameFramework.resources.PIEffect.DegToRad((theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0)].GetValueAt(this.mFrameNum))));
            var aTransPoint = aTransform.transformPoint(aPos);
            aParticleInstance.mEmittedPos.x += aTransPoint.x;
            aParticleInstance.mEmittedPos.y += aTransPoint.y;
            if(theEmitter.mOldestInFront) {
                if(theParticleGroup.mHead != null) {
                    theParticleGroup.mHead.mPrev = aParticleInstance;
                }
                aParticleInstance.mNext = theParticleGroup.mHead;
                if(theParticleGroup.mTail == null) {
                    theParticleGroup.mTail = aParticleInstance;
                }
                theParticleGroup.mHead = aParticleInstance;
            } else {
                if(theParticleGroup.mTail != null) {
                    theParticleGroup.mTail.mNext = aParticleInstance;
                }
                aParticleInstance.mPrev = theParticleGroup.mTail;
                if(theParticleGroup.mHead == null) {
                    theParticleGroup.mHead = aParticleInstance;
                }
                theParticleGroup.mTail = aParticleInstance;
            }
            theParticleGroup.mCount++;
        }
    },
    FreeParticle : function GameFramework_resources_PIEffect$FreeParticle(theEffect, theParticleInstance, theParticleGroup) {
        if(theParticleInstance.mPrev != null) {
            theParticleInstance.mPrev.mNext = theParticleInstance.mNext;
        }
        if(theParticleInstance.mNext != null) {
            theParticleInstance.mNext.mPrev = theParticleInstance.mPrev;
        }
        if(theParticleGroup.mHead == theParticleInstance) {
            theParticleGroup.mHead = theParticleInstance.mNext;
        }
        if(theParticleGroup.mTail == theParticleInstance) {
            theParticleGroup.mTail = theParticleInstance.mPrev;
        }
        theParticleGroup.mCount--;
        theParticleInstance.Dispose();
    },
    UpdateParticleGroupSuperEmitter : function GameFramework_resources_PIEffect$UpdateParticleGroupSuperEmitter(theLayer, theEmitterInstance, theParticleGroup) {
        var anUpdateRate = (1000.0 / this.mFrameTime) / this.mAnimSpeed;
        var aParticleInstance = theParticleGroup.mHead;
        var aLayerDef = theLayer.mLayerDef;
        var anEmitterInstanceDef = theEmitterInstance.mEmitterInstanceDef;
        while(aParticleInstance != null) {
            var aNext = aParticleInstance.mNext;
            var anEmitter = aParticleInstance.mEmitterSrc;
            var aParticleDef = aParticleInstance.mParticleDef;
            var anEmitterLifePct = 0;
            if(aParticleInstance.mParentFreeEmitter != null) {
                anEmitterLifePct = aParticleInstance.mParentFreeEmitter.mLifePct;
            }
            var isNew = aParticleInstance.mTicks == 0.0;
            aParticleInstance.mTicks += 1.0 / anUpdateRate;
            var aLifePct;
            if((aParticleDef != null) && (aParticleDef.mSingleParticle)) {
                var aNextToggleTime = theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0)].GetNextKeyframeTime(this.mFrameNum);
                var aNextKeyIdx = theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0)].GetNextKeyframeIdx(this.mFrameNum);
                if((aNextToggleTime >= this.mFrameNum) && (aNextKeyIdx == 1)) {
                    aLifePct = Math.min(1.0, (this.mFrameNum + anEmitterInstanceDef.mFramesToPreload) / Math.max(1, aNextToggleTime));
                } else {
                    aLifePct = 0.02;
                }
            } else {
                aLifePct = aParticleInstance.mTicks / aParticleInstance.mLife;
            }
            aParticleInstance.mLifePct = aLifePct;
            if((aParticleInstance.mLifePct >= 0.9999999) || (aParticleInstance.mLife <= 0.00000001) || ((!theEmitterInstance.mWasActive) && (!anEmitterInstanceDef.mIsSuperEmitter))) {
                if((theParticleGroup.mIsSuperEmitter) && ((aParticleInstance).mEmitter.mParticleGroup.mHead != null)) {
                    aParticleInstance = aNext;
                    continue;
                }
                if((!theParticleGroup.mIsSuperEmitter) && (aParticleDef.mSingleParticle) && (theEmitterInstance.mWasActive)) {
                } else {
                    aParticleInstance.Dispose();
                    if(aParticleInstance.mPrev != null) {
                        aParticleInstance.mPrev.mNext = aParticleInstance.mNext;
                    }
                    if(aParticleInstance.mNext != null) {
                        aParticleInstance.mNext.mPrev = aParticleInstance.mPrev;
                    }
                    if(theParticleGroup.mHead == aParticleInstance) {
                        theParticleGroup.mHead = aParticleInstance.mNext;
                    }
                    if(theParticleGroup.mTail == aParticleInstance) {
                        theParticleGroup.mTail = aParticleInstance.mPrev;
                    }
                    theParticleGroup.mCount--;
                    aParticleInstance = aNext;
                    continue;
                }
            }
            if(aParticleDef != null) {
                var aTexture = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                if(aParticleDef.mAnimSpeed == -1) {
                    aParticleInstance.mImgIdx = aParticleInstance.mAnimFrameRand % aTexture.mNumCels;
                } else {
                    aParticleInstance.mImgIdx = (((aParticleInstance.mTicks * this.mFramerate / (aParticleDef.mAnimSpeed + 1)) | 0) + aParticleInstance.mAnimFrameRand) % aTexture.mNumCels;
                }
            }
            if((theParticleGroup.mIsSuperEmitter) || (!aParticleDef.mSingleParticle)) {
                if(this.mIsNewFrame) {
                    var aRand1 = this.GetRandFloat() * this.GetRandFloat();
                    var aRand2 = this.GetRandFloat() * this.GetRandFloat();
                    var aMotionRand;
                    if(theParticleGroup.mIsSuperEmitter) {
                        aMotionRand = Math.max(0.0, ((theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum)) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_MOTION_RAND_OVER_LIFE | 0)].GetValueAt(aLifePct, 1.0)) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_MOTION_RAND | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0)])))) * 30.0;
                    } else {
                        aMotionRand = Math.max(0.0, ((theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum))) * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.MOTION_RAND | 0)].GetValueAt(aLifePct)) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0)]))));
                    }
                    aParticleInstance.mVel.x += aRand1 * aMotionRand;
                    aParticleInstance.mVel.y += aRand2 * aMotionRand;
                }
                var aWeight;
                if(theParticleGroup.mIsSuperEmitter) {
                    aWeight = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum)) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_WEIGHT_OVER_LIFE | 0)].GetValueAt(aLifePct, 1.0)) - 1.0) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_WEIGHT | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)])) / 2.0 * 100.0;
                } else {
                    aWeight = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum)) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.WEIGHT_OVER_LIFE | 0)].GetValueAt(aLifePct)) - 1.0) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)])) * 100.0;
                }
                aWeight *= 1.0 + (this.mFramerate - 100.0) * 0.0005;
                aParticleInstance.mVel.y += aWeight / anUpdateRate;
                var aVelScale;
                if(theParticleGroup.mIsSuperEmitter) {
                    aVelScale = (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_VELOCITY_OVER_LIFE | 0)].GetValueAt(aLifePct, 1.0));
                } else {
                    aVelScale = (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.VELOCITY_OVER_LIFE | 0)].GetValueAt(aLifePct));
                }
                var aCurVel = new GameFramework.geom.TPoint(aParticleInstance.mVel.x * aVelScale / anUpdateRate, aParticleInstance.mVel.y * aVelScale / anUpdateRate);
                var aCurPhysPoint = null;
                if((!isNew) && (aLayerDef.mDeflectorVector.length > 0)) {
                    var aPrevPhysPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
                    var aPrevPos = aParticleInstance.mPos;
                    aParticleInstance.mPos.x += aCurVel.x;
                    aParticleInstance.mPos.y += aCurVel.y;
                    this.CalcParticleTransform(theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aParticleInstance);
                    aCurPhysPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
                    for(var aDeflectorIdx = 0; aDeflectorIdx < (aLayerDef.mDeflectorVector.length | 0); aDeflectorIdx++) {
                        var aDeflector = aLayerDef.mDeflectorVector[aDeflectorIdx];
                        if(aDeflector.mActive.GetLastKeyframe(this.mFrameNum) < 0.99) {
                            continue;
                        }
                        for(var aPtIdx = 1; aPtIdx < (aDeflector.mCurPoints.length | 0); aPtIdx++) {
                            var aPt1 = aDeflector.mCurPoints[aPtIdx - 1].subtract(new GameFramework.geom.TPoint(this.mDrawTransform.tx, this.mDrawTransform.ty));
                            var aPt2 = aDeflector.mCurPoints[aPtIdx].subtract(new GameFramework.geom.TPoint(this.mDrawTransform.tx, this.mDrawTransform.ty));
                            var aLineDir = new GameFramework.geom.TPoint(aPt2.x - aPt1.x, aPt2.y - aPt1.y);
                            var aLineNormal = aLineDir.clone();
                            aLineNormal.normalize(1.0);
                            var aTemp = aLineNormal.x;
                            aLineNormal.x = -aLineNormal.y;
                            aLineNormal.y = aTemp;
                            var aLineTranslate = new GameFramework.geom.TPoint(aLineNormal.x, aLineNormal.y);
                            aLineTranslate.x = aLineTranslate.x * aDeflector.mThickness * aParticleInstance.mThicknessHitVariation;
                            aLineTranslate.y = aLineTranslate.y * aDeflector.mThickness * aParticleInstance.mThicknessHitVariation;
                            var aLineSegmentResult = GameFramework.resources.PIEffect.LineSegmentIntersects(aPrevPhysPoint, aCurPhysPoint, aPt1.add(aLineTranslate), aPt2.add(aLineTranslate));
                            if(aLineSegmentResult != null) {
                                var aCollPoint = new GameFramework.geom.TPoint(aLineSegmentResult[1], aLineSegmentResult[2]);
                                if(this.GetRandFloatU() > aDeflector.mHits) {
                                    continue;
                                }
                                var aBounce = aDeflector.mBounce;
                                if(theParticleGroup.mIsSuperEmitter) {
                                    aBounce *= ((theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.BOUNCE | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0)].GetValueAt(this.mFrameNum))) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_BOUNCE_OVER_LIFE | 0)].GetValueAt(aLifePct, 1.0)) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_BOUNCE | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0)])));
                                } else {
                                    aBounce *= ((theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.BOUNCE | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0)].GetValueAt(this.mFrameNum))) * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.BOUNCE_OVER_LIFE | 0)].GetValueAt(aLifePct)) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.BOUNCE | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0)])));
                                }
                                var aCurVelVec = new GameFramework.geom.TPoint(aCurVel.x, aCurVel.y);
                                var aDot = aCurVelVec.x * aLineNormal.x + aCurVelVec.y * aLineNormal.y;
                                var aNewVel = new GameFramework.geom.TPoint(aCurVelVec.x - aLineNormal.x * 2 * aDot, aCurVelVec.y - aLineNormal.y * 2 * aDot);
                                var aPctBounce = Math.min(1.0, Math.abs(aNewVel.y / aNewVel.x));
                                aNewVel.y *= (1.0 - aPctBounce) + aPctBounce * Math.pow(aBounce, (0.5));
                                aParticleInstance.mVel.x = aNewVel.x * 100.0;
                                aParticleInstance.mVel.y = aNewVel.y * 100.0;
                                if(aBounce > 0.001) {
                                    aParticleInstance.mPos = aPrevPos;
                                }
                                this.CalcParticleTransform(theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aParticleInstance);
                                aCurPhysPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
                            }
                        }
                    }
                } else {
                    aParticleInstance.mPos.x += aCurVel.x;
                    aParticleInstance.mPos.y += aCurVel.y;
                    if(aLayerDef.mForceVector.length > 0) {
                        this.CalcParticleTransform(theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aParticleInstance);
                        aCurPhysPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
                    }
                }
                for(var aForceIdx = 0; aForceIdx < (aLayerDef.mForceVector.length | 0); aForceIdx++) {
                    var aForce = aLayerDef.mForceVector[aForceIdx];
                    if(aForce.mActive.GetLastKeyframe(this.mFrameNum) < 0.99) {
                        continue;
                    }
                    var inside = false;
                    var i;
                    var j;
                    for(i = 0, j = 4 - 1; i < 4; j = i++) {
                        if((((aForce.mCurPoints[i].y <= aCurPhysPoint.y) && (aCurPhysPoint.y < aForce.mCurPoints[j].y)) || ((aForce.mCurPoints[j].y <= aCurPhysPoint.y) && (aCurPhysPoint.y < aForce.mCurPoints[i].y))) && (aCurPhysPoint.x < (aForce.mCurPoints[j].x - aForce.mCurPoints[i].x) * (aCurPhysPoint.y - aForce.mCurPoints[i].y) / (aForce.mCurPoints[j].y - aForce.mCurPoints[i].y) + aForce.mCurPoints[i].x)) {
                            inside = !inside;
                        }
                    }
                    if(inside) {
                        var anAngle = GameFramework.resources.PIEffect.DegToRad(-aForce.mDirection.GetValueAt(this.mFrameNum)) + GameFramework.resources.PIEffect.DegToRad(-aForce.mAngle.GetValueAt(this.mFrameNum));
                        var aFactor = 0.085 * this.mFramerate / 100.0;
                        aFactor *= 1.0 + (this.mFramerate - 100.0) * 0.004;
                        var aStrength = aForce.mStrength.GetValueAt(this.mFrameNum) * aFactor;
                        aParticleInstance.mVel.x += Math.cos(anAngle) * aStrength * 100.0;
                        aParticleInstance.mVel.y += Math.sin(anAngle) * aStrength * 100.0;
                    }
                }
                if((!theParticleGroup.mIsSuperEmitter) && (aParticleDef.mAngleAlignToMotion) && (aParticleDef.mAngleKeepAlignedToMotion)) {
                    aParticleInstance.mImgAngle = Math.atan2(aCurVel.y, aCurVel.x) + GameFramework.resources.PIEffect.DegToRad(aParticleDef.mAngleAlignOffset);
                }
            } else if(aParticleDef.mSingleParticle) {
                var canUseGeom = false;
                if((anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.LINE) || (anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE)) {
                    canUseGeom = anEmitterInstanceDef.mEmitAtPointsNum != 0;
                } else if(anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.AREA) {
                    canUseGeom = (anEmitterInstanceDef.mEmitAtPointsNum * anEmitterInstanceDef.mEmitAtPointsNum2) != 0;
                }
                if(canUseGeom) {
                    var aPos = this.GetGeomPos(theEmitterInstance, aParticleInstance);
                    aParticleInstance.mEmittedPos = this.GetEmitterPos(theEmitterInstance, true);
                    aParticleInstance.mLastEmitterPos = aParticleInstance.mEmittedPos;
                    aParticleInstance.mOrigPos = aPos.subtract(aParticleInstance.mEmittedPos);
                    var aTransform = new GameFramework.geom.Matrix();
                    aTransform.rotate(GameFramework.resources.PIEffect.DegToRad(theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0)].GetValueAt(this.mFrameNum)));
                    var anAddPoint = aTransform.transformPoint(aPos);
                    aParticleInstance.mEmittedPos.x += anAddPoint.x;
                    aParticleInstance.mEmittedPos.y += anAddPoint.y;
                }
                if((aParticleDef.mAngleKeepAlignedToMotion) && (!aParticleDef.mAttachToEmitter)) {
                    var aCurVel_2 = anEmitterInstanceDef.mPosition.GetVelocityAt(this.mFrameNum);
                    if((aCurVel_2.x != 0) || (aCurVel_2.y != 0)) {
                        aParticleInstance.mImgAngle = Math.atan2(aCurVel_2.y, aCurVel_2.x);
                    } else {
                        aParticleInstance.mImgAngle = 0;
                    }
                    aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad(aParticleDef.mAngleAlignOffset);
                }
            }
            if(aParticleDef != null) {
                var wantColor = (!aParticleInstance.mHasDrawn && aParticleDef.mGetColorFromLayer) || aParticleDef.mUpdateColorFromLayer;
                var wantTransparency = (!aParticleInstance.mHasDrawn && aParticleDef.mGetTransparencyFromLayer) || aParticleDef.mUpdateTransparencyFromLayer;
                if(wantColor || wantTransparency) {
                    var aDrawPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0, 0));
                    var aCheckX = ((aDrawPoint.x + theLayer.mBkgImgDrawOfs.x) | 0);
                    var aCheckY = ((aDrawPoint.y + theLayer.mBkgImgDrawOfs.y) | 0);
                    var aColor = 0;
                    if((theLayer.mBkgImage != null) && (aCheckX >= 0) && (aCheckY >= 0) && (aCheckX < theLayer.mBkgImage.mWidth) && (aCheckY < theLayer.mBkgImage.mHeight)) {
                    } else {
                        aColor = 0;
                    }
                    if(wantColor) {
                        aParticleInstance.mBkgColor = (aParticleInstance.mBkgColor & 0xff000000) | (aColor & 0xffffff);
                    }
                    if(wantTransparency) {
                        aParticleInstance.mBkgColor = (aParticleInstance.mBkgColor & 0xffffff) | (aColor & 0xff000000);
                    }
                }
            }
            if(theParticleGroup.mIsSuperEmitter) {
                aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad(-((theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0)].GetValueAt(this.mFrameNum)) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_SPIN_OVER_LIFE | 0)].GetValueAt(aLifePct, 1.0)) - 1.0) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_SPIN | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)])))) / anUpdateRate * 160.0;
            } else if(!aParticleDef.mAngleKeepAlignedToMotion) {
                aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad(-((theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.SPIN | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0)].GetValueAt(this.mFrameNum))) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SPIN_OVER_LIFE | 0)].GetValueAt(aLifePct)) - 1.0) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SPIN | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)])))) / anUpdateRate;
            }
            aParticleInstance = aNext;
        }
    },
    UpdateParticleGroupWithSingleParticles : function GameFramework_resources_PIEffect$UpdateParticleGroupWithSingleParticles(theLayer, theEmitterInstance, theParticleGroup) {
        var anUpdateRate = (1000.0 / this.mFrameTime) / this.mAnimSpeed;
        var aParticleInstance = theParticleGroup.mHead;
        var aLayerDef = theLayer.mLayerDef;
        var anEmitterInstanceDef = theEmitterInstance.mEmitterInstanceDef;
        while(aParticleInstance != null) {
            var aNext = aParticleInstance.mNext;
            var anEmitter = aParticleInstance.mEmitterSrc;
            var aParticleDef = aParticleInstance.mParticleDef;
            var anEmitterLifePct = 0;
            if(aParticleInstance.mParentFreeEmitter != null) {
                anEmitterLifePct = aParticleInstance.mParentFreeEmitter.mLifePct;
            }
            var isNew = aParticleInstance.mTicks == 0.0;
            aParticleInstance.mTicks += 1.0 / anUpdateRate;
            var aLifePct;
            if((aParticleDef != null) && (aParticleDef.mSingleParticle)) {
                var aNextToggleTime = theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0)].GetNextKeyframeTime(this.mFrameNum);
                var aNextKeyIdx = theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0)].GetNextKeyframeIdx(this.mFrameNum);
                if((aNextToggleTime >= this.mFrameNum) && (aNextKeyIdx == 1)) {
                    aLifePct = Math.min(1.0, (this.mFrameNum + anEmitterInstanceDef.mFramesToPreload) / Math.max(1, aNextToggleTime));
                } else {
                    aLifePct = 0.02;
                }
            } else {
                aLifePct = aParticleInstance.mTicks / aParticleInstance.mLife;
            }
            aParticleInstance.mLifePct = aLifePct;
            aParticleInstance.mLifePctInt += aParticleInstance.mLifePctIntInc;
            if((aParticleInstance.mLifePctInt & 0x80000000) != 0) {
                this.FreeParticle(this, aParticleInstance, theParticleGroup);
                aParticleInstance = aNext;
                continue;
            }
            var anIdx = (((aParticleInstance.mLifePctInt / (((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0))) | 0));
            var aLifeValueSample = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx];
            if(aParticleDef != null) {
                var aTexture = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                if(aParticleDef.mAnimSpeed == -1) {
                    aParticleInstance.mImgIdx = aParticleInstance.mAnimFrameRand % aTexture.mNumCels;
                } else {
                    aParticleInstance.mImgIdx = (((aParticleInstance.mTicks * this.mFramerate / (aParticleDef.mAnimSpeed + 1)) | 0) + aParticleInstance.mAnimFrameRand) % aTexture.mNumCels;
                }
            }
            if((theParticleGroup.mIsSuperEmitter) || (!aParticleDef.mSingleParticle)) {
                if(this.mIsNewFrame) {
                    var aRand1 = this.GetRandFloat() * this.GetRandFloat();
                    var aRand2 = this.GetRandFloat() * this.GetRandFloat();
                    var aMotionRand;
                    if(theParticleGroup.mIsSuperEmitter) {
                        aMotionRand = Math.max(0.0, ((theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum)) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_MOTION_RAND_OVER_LIFE | 0)].GetValueAt(aLifePct, 1.0)) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_MOTION_RAND | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0)])))) * 30.0;
                    } else {
                        aMotionRand = Math.max(0.0, ((theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum))) * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.MOTION_RAND_OVER_LIFE | 0)].GetValueAt(aLifePct)) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0)]))));
                    }
                    aParticleInstance.mVel.x += aRand1 * aMotionRand;
                    aParticleInstance.mVel.y += aRand2 * aMotionRand;
                }
                var aWeight;
                if(theParticleGroup.mIsSuperEmitter) {
                    aWeight = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum)) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_WEIGHT_OVER_LIFE | 0)].GetValueAt(aLifePct, 1.0)) - 1.0) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_WEIGHT | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)])) / 2.0 * 100.0;
                } else {
                    aWeight = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum)) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.WEIGHT_OVER_LIFE | 0)].GetValueAt(aLifePct)) - 1.0) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)])) * 100.0;
                }
                aWeight *= 1.0 + (this.mFramerate - 100.0) * 0.0005;
                aParticleInstance.mVel.y += aWeight / anUpdateRate;
                var aVelScale;
                if(theParticleGroup.mIsSuperEmitter) {
                    aVelScale = (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_VELOCITY_OVER_LIFE | 0)].GetValueAt(aLifePct, 1.0));
                } else {
                    aVelScale = (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.VELOCITY_OVER_LIFE | 0)].GetValueAt(aLifePct));
                }
                var aCurVel = new GameFramework.geom.TPoint(aParticleInstance.mVel.x * aVelScale / anUpdateRate, aParticleInstance.mVel.y * aVelScale / anUpdateRate);
                var aCurPhysPoint = null;
                if((!isNew) && (aLayerDef.mDeflectorVector.length > 0)) {
                    var aPrevPhysPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
                    var aPrevPos = aParticleInstance.mPos;
                    aParticleInstance.mPos.x += aCurVel.x;
                    aParticleInstance.mPos.y += aCurVel.y;
                    this.CalcParticleTransform(theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aParticleInstance);
                    aCurPhysPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
                    for(var aDeflectorIdx = 0; aDeflectorIdx < (aLayerDef.mDeflectorVector.length | 0); aDeflectorIdx++) {
                        var aDeflector = aLayerDef.mDeflectorVector[aDeflectorIdx];
                        if(aDeflector.mActive.GetLastKeyframe(this.mFrameNum) < 0.99) {
                            continue;
                        }
                        for(var aPtIdx = 1; aPtIdx < (aDeflector.mCurPoints.length | 0); aPtIdx++) {
                            var aPt1 = aDeflector.mCurPoints[aPtIdx - 1].subtract(new GameFramework.geom.TPoint(this.mDrawTransform.tx, this.mDrawTransform.ty));
                            var aPt2 = aDeflector.mCurPoints[aPtIdx].subtract(new GameFramework.geom.TPoint(this.mDrawTransform.tx, this.mDrawTransform.ty));
                            var aLineDir = new GameFramework.geom.TPoint(aPt2.x - aPt1.x, aPt2.y - aPt1.y);
                            var aLineNormal = aLineDir.clone();
                            aLineNormal.normalize(1.0);
                            var aTemp = aLineNormal.x;
                            aLineNormal.x = -aLineNormal.y;
                            aLineNormal.y = aTemp;
                            var aLineTranslate = new GameFramework.geom.TPoint(aLineNormal.x, aLineNormal.y);
                            aLineTranslate.x = aLineTranslate.x * aDeflector.mThickness * aParticleInstance.mThicknessHitVariation;
                            aLineTranslate.y = aLineTranslate.y * aDeflector.mThickness * aParticleInstance.mThicknessHitVariation;
                            var aLineSegmentResult = GameFramework.resources.PIEffect.LineSegmentIntersects(aPrevPhysPoint, aCurPhysPoint, aPt1.add(aLineTranslate), aPt2.add(aLineTranslate));
                            if(aLineSegmentResult != null) {
                                var aCollPoint = new GameFramework.geom.TPoint(aLineSegmentResult[1], aLineSegmentResult[2]);
                                if(this.GetRandFloatU() > aDeflector.mHits) {
                                    continue;
                                }
                                var aBounce = aDeflector.mBounce;
                                if(theParticleGroup.mIsSuperEmitter) {
                                    aBounce *= ((theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.BOUNCE | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0)].GetValueAt(this.mFrameNum))) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_BOUNCE_OVER_LIFE | 0)].GetValueAt(aLifePct, 1.0)) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_BOUNCE | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0)])));
                                } else {
                                    aBounce *= ((theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.BOUNCE | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0)].GetValueAt(this.mFrameNum))) * (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.BOUNCE_OVER_LIFE | 0)].GetValueAt(aLifePct)) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.BOUNCE | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0)])));
                                }
                                var aCurVelVec = new GameFramework.geom.TPoint(aCurVel.x, aCurVel.y);
                                var aDot = aCurVelVec.x * aLineNormal.x + aCurVelVec.y * aLineNormal.y;
                                var aNewVel = new GameFramework.geom.TPoint(aCurVelVec.x - aLineNormal.x * 2 * aDot, aCurVelVec.y - aLineNormal.y * 2 * aDot);
                                var aPctBounce = Math.min(1.0, Math.abs(aNewVel.y / aNewVel.x));
                                aNewVel.y *= (1.0 - aPctBounce) + aPctBounce * Math.pow(aBounce, (0.5));
                                aParticleInstance.mVel.x = aNewVel.x * 100.0;
                                aParticleInstance.mVel.y = aNewVel.y * 100.0;
                                if(aBounce > 0.001) {
                                    aParticleInstance.mPos = aPrevPos;
                                }
                                this.CalcParticleTransform(theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aParticleInstance);
                                aCurPhysPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
                            }
                        }
                    }
                } else {
                    aParticleInstance.mPos.x += aCurVel.x;
                    aParticleInstance.mPos.y += aCurVel.y;
                    if(aLayerDef.mForceVector.length > 0) {
                        this.CalcParticleTransform(theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aParticleInstance);
                        aCurPhysPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
                    }
                }
                for(var aForceIdx = 0; aForceIdx < (aLayerDef.mForceVector.length | 0); aForceIdx++) {
                    var aForce = aLayerDef.mForceVector[aForceIdx];
                    if(aForce.mActive.GetLastKeyframe(this.mFrameNum) < 0.99) {
                        continue;
                    }
                    var inside = false;
                    var i;
                    var j;
                    for(i = 0, j = 4 - 1; i < 4; j = i++) {
                        if((((aForce.mCurPoints[i].y <= aCurPhysPoint.y) && (aCurPhysPoint.y < aForce.mCurPoints[j].y)) || ((aForce.mCurPoints[j].y <= aCurPhysPoint.y) && (aCurPhysPoint.y < aForce.mCurPoints[i].y))) && (aCurPhysPoint.x < (aForce.mCurPoints[j].x - aForce.mCurPoints[i].x) * (aCurPhysPoint.y - aForce.mCurPoints[i].y) / (aForce.mCurPoints[j].y - aForce.mCurPoints[i].y) + aForce.mCurPoints[i].x)) {
                            inside = !inside;
                        }
                    }
                    if(inside) {
                        var anAngle = GameFramework.resources.PIEffect.DegToRad(-aForce.mDirection.GetValueAt(this.mFrameNum)) + GameFramework.resources.PIEffect.DegToRad(-aForce.mAngle.GetValueAt(this.mFrameNum));
                        var aFactor = 0.085 * this.mFramerate / 100.0;
                        aFactor *= 1.0 + (this.mFramerate - 100.0) * 0.004;
                        var aStrength = aForce.mStrength.GetValueAt(this.mFrameNum) * aFactor;
                        aParticleInstance.mVel.x += Math.cos(anAngle) * aStrength * 100.0;
                        aParticleInstance.mVel.y += Math.sin(anAngle) * aStrength * 100.0;
                    }
                }
                if((!theParticleGroup.mIsSuperEmitter) && (aParticleDef.mAngleAlignToMotion) && (aParticleDef.mAngleKeepAlignedToMotion)) {
                    aParticleInstance.mImgAngle = Math.atan2(aCurVel.y, aCurVel.x) + GameFramework.resources.PIEffect.DegToRad(aParticleDef.mAngleAlignOffset);
                }
            } else if(aParticleDef.mSingleParticle) {
                var canUseGeom = false;
                if((anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.LINE) || (anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE)) {
                    canUseGeom = anEmitterInstanceDef.mEmitAtPointsNum != 0;
                } else if(anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.AREA) {
                    canUseGeom = (anEmitterInstanceDef.mEmitAtPointsNum * anEmitterInstanceDef.mEmitAtPointsNum2) != 0;
                }
                if(canUseGeom) {
                    var aPos = this.GetGeomPos(theEmitterInstance, aParticleInstance);
                    aParticleInstance.mEmittedPos = this.GetEmitterPos(theEmitterInstance, true);
                    aParticleInstance.mLastEmitterPos = aParticleInstance.mEmittedPos;
                    aParticleInstance.mOrigPos = aPos.subtract(aParticleInstance.mEmittedPos);
                    var aTransform = new GameFramework.geom.Matrix();
                    aTransform.rotate(GameFramework.resources.PIEffect.DegToRad(theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0)].GetValueAt(this.mFrameNum)));
                    var anAddPoint = aTransform.transformPoint(aPos);
                    aParticleInstance.mEmittedPos.x += anAddPoint.x;
                    aParticleInstance.mEmittedPos.y += anAddPoint.y;
                }
                if((aParticleDef.mAngleKeepAlignedToMotion) && (!aParticleDef.mAttachToEmitter)) {
                    var aCurVel_2 = anEmitterInstanceDef.mPosition.GetVelocityAt(this.mFrameNum);
                    if((aCurVel_2.x != 0) || (aCurVel_2.y != 0)) {
                        aParticleInstance.mImgAngle = Math.atan2(aCurVel_2.y, aCurVel_2.x);
                    } else {
                        aParticleInstance.mImgAngle = 0;
                    }
                    aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad(aParticleDef.mAngleAlignOffset);
                }
            }
            if(aParticleDef != null) {
                var wantColor = (!aParticleInstance.mHasDrawn && aParticleDef.mGetColorFromLayer) || aParticleDef.mUpdateColorFromLayer;
                var wantTransparency = (!aParticleInstance.mHasDrawn && aParticleDef.mGetTransparencyFromLayer) || aParticleDef.mUpdateTransparencyFromLayer;
                if(wantColor || wantTransparency) {
                    var aDrawPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0, 0));
                    var aCheckX = ((aDrawPoint.x + theLayer.mBkgImgDrawOfs.x) | 0);
                    var aCheckY = ((aDrawPoint.y + theLayer.mBkgImgDrawOfs.y) | 0);
                    var aColor = 0;
                    if((theLayer.mBkgImage != null) && (aCheckX >= 0) && (aCheckY >= 0) && (aCheckX < theLayer.mBkgImage.mWidth) && (aCheckY < theLayer.mBkgImage.mHeight)) {
                    } else {
                        aColor = 0;
                    }
                    if(wantColor) {
                        aParticleInstance.mBkgColor = (aParticleInstance.mBkgColor & 0xff000000) | (aColor & 0xffffff);
                    }
                    if(wantTransparency) {
                        aParticleInstance.mBkgColor = (aParticleInstance.mBkgColor & 0xffffff) | (aColor & 0xff000000);
                    }
                }
            }
            if(theParticleGroup.mIsSuperEmitter) {
                aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad(-((theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0)].GetValueAt(this.mFrameNum)) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_SPIN_OVER_LIFE | 0)].GetValueAt(aLifePct, 1.0)) - 1.0) * ((anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.F_SPIN | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)])))) / anUpdateRate * 160.0;
            } else if(!aParticleDef.mAngleKeepAlignedToMotion) {
                aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad(-((theParticleGroup.mWasEmitted ? (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.SPIN | 0)].GetValueAt(this.mFrameNum)) : (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0)].GetValueAt(this.mFrameNum))) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SPIN_OVER_LIFE | 0)].GetValueAt(aLifePct)) - 1.0) * ((aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SPIN | 0)].GetValueAt(this.mFrameNum)) + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)])))) / anUpdateRate;
            }
            aParticleInstance = aNext;
        }
    },
    UpdateParticleGroup : function GameFramework_resources_PIEffect$UpdateParticleGroup(theLayer, theEmitterInstance, theParticleGroup) {
        if(GameFramework.resources.PIEffect.gRandSquareIdx == -1) {
            GameFramework.resources.PIEffect.gRandSquareTable = Array.Create(1024, null);
            for(var i = 0; i < 1024; i++) {
                GameFramework.resources.PIEffect.gRandSquareTable[i] = this.GetRandFloat() * this.GetRandFloat();
            }
            GameFramework.resources.PIEffect.gRandSquareIdx = 0;
        }
        if(theParticleGroup.mHasSingleParticles) {
            this.UpdateParticleGroupWithSingleParticles(theLayer, theEmitterInstance, theParticleGroup);
            return;
        }
        if(theParticleGroup.mIsSuperEmitter) {
            this.UpdateParticleGroupSuperEmitter(theLayer, theEmitterInstance, theParticleGroup);
            return;
        }
        var anUpdateRate = (1000.0 / this.mFrameTime) / this.mAnimSpeed;
        var aWeightscale = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate;
        var aSpinScale = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate);
        var aParticleInstance = theParticleGroup.mHead;
        var aLayerDef = theLayer.mLayerDef;
        var anEmitterInstanceDef = theEmitterInstance.mEmitterInstanceDef;
        var aParticleDef = null;
        var aParticleDefInstance = null;
        var anEmitter = null;
        var hasVelocityEffectors = (aLayerDef.mForceVector.length > 0) && (aLayerDef.mDeflectorVector.length > 0);

        var doImageCycle = theParticleGroup.mHasImageCycle;
        var checkColorSampling = false;
        var aParamEmitterWeight = 0;
        var aParamParticleDefWeight = 0;
        var aParamEmitterSpin = 0;
        var aParamParticleDefSpin = 0;
        var aParamEmitterMotionRand = 0;
        var aParamParticleDefMotionRand = 0;
        if(!theEmitterInstance.mWasActive) {
            var aClearParticleInstance = theParticleGroup.mHead;
            while(aClearParticleInstance != null) {
                var aNext = aClearParticleInstance.mNext;
                aClearParticleInstance.mLifePct = 0x80000000;
                aClearParticleInstance = aNext;
            }
        }
        if((theParticleGroup.mHasColorSampling) || (theParticleGroup.mHasVelocityEffectors)) {
            doImageCycle = false;
            while(aParticleInstance != null) {
                var aNext_2 = aParticleInstance.mNext;
                if(aParticleDef != aParticleInstance.mParticleDef) {
                    anEmitter = aParticleInstance.mEmitterSrc;
                    aParticleDef = aParticleInstance.mParticleDef;
                    aParamEmitterWeight = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum)) * 100.0;
                    aParamParticleDefWeight = (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum));
                    aParamEmitterSpin = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0)].GetValueAt(this.mFrameNum)) * aSpinScale;
                    aParamParticleDefSpin = (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.SPIN | 0)].GetValueAt(this.mFrameNum));
                    aParamEmitterMotionRand = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum));
                    aParamParticleDefMotionRand = (aParticleDef.mValues[(GameFramework.resources.PIParticleDef.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum));
                    checkColorSampling = (aParticleDef != null) && (aParticleDef.mGetColorFromLayer || aParticleDef.mUpdateColorFromLayer || aParticleDef.mGetTransparencyFromLayer || aParticleDef.mUpdateTransparencyFromLayer);
                    var aTexture = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                    doImageCycle = ((aParticleDef.mAnimSpeed != -1) && (aTexture.mNumCels > 1));
                }
                aParticleInstance.mLifePctInt += aParticleInstance.mLifePctIntInc;
                if((aParticleInstance.mLifePctInt & 0x80000000) != 0) {
                    this.FreeParticle(this, aParticleInstance, theParticleGroup);
                    aParticleInstance = aNext_2;
                    continue;
                }
                var anIdx = (((aParticleInstance.mLifePctInt / (((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0))) | 0));
                var aLifeValueSample = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx];
                if(doImageCycle) {
                    var aTexture_2 = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                    aParticleInstance.mImgIdx = (((aParticleInstance.mTicks * this.mFramerate / (aParticleDef.mAnimSpeed + 1)) | 0) + aParticleInstance.mAnimFrameRand) % aTexture_2.mNumCels;
                }
                if(this.mIsNewFrame) {
                    var aRand1 = GameFramework.resources.PIEffect.gRandSquareTable[GameFramework.resources.PIEffect.gRandSquareIdx];
                    var aRand2 = GameFramework.resources.PIEffect.gRandSquareTable[GameFramework.resources.PIEffect.gRandSquareIdx + 1];
                    GameFramework.resources.PIEffect.gRandSquareIdx = (GameFramework.resources.PIEffect.gRandSquareIdx + 2) % 1024;
                    var aMotionRand = aParamEmitterMotionRand * aLifeValueSample.mMotionRand * (aParamParticleDefMotionRand + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0)]));
                    if(aMotionRand > 0) {
                        aParticleInstance.mVel.x += aRand1 * aMotionRand;
                        aParticleInstance.mVel.y += aRand2 * aMotionRand;
                    }
                }
                var aWeight = aParamEmitterWeight * (aLifeValueSample.mWeight) * (aParamParticleDefWeight + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)]));
                aWeight *= aWeightscale;
                aParticleInstance.mVel.y += aWeight;
                var aCurVel = new GameFramework.geom.TPoint((aParticleInstance.mVel.x / anUpdateRate) * aLifeValueSample.mVelocity, (aParticleInstance.mVel.y / anUpdateRate) * aLifeValueSample.mVelocity);
                if(!hasVelocityEffectors) {
                    aParticleInstance.mPos.x += aCurVel.x;
                    aParticleInstance.mPos.y += aCurVel.y;
                } else {
                    GameFramework.resources.PIEffect.IntegrateAffectors(this, theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aCurVel, aLayerDef, aParticleInstance);
                }
                if(checkColorSampling) {
                    var wantColor = (!aParticleInstance.mHasDrawn && aParticleDef.mGetColorFromLayer) || aParticleDef.mUpdateColorFromLayer;
                    var wantTransparency = (!aParticleInstance.mHasDrawn && aParticleDef.mGetTransparencyFromLayer) || aParticleDef.mUpdateTransparencyFromLayer;
                    if(wantColor || wantTransparency) {
                        var aDrawPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0, 0));
                        var aCheckX = ((aDrawPoint.x + theLayer.mBkgImgDrawOfs.x) | 0);
                        var aCheckY = ((aDrawPoint.y + theLayer.mBkgImgDrawOfs.y) | 0);
                        var aColor = 0;
                        if((theLayer.mBkgImage != null) && (aCheckX >= 0) && (aCheckY >= 0) && (aCheckX < theLayer.mBkgImage.mWidth) && (aCheckY < theLayer.mBkgImage.mHeight)) {
                        } else {
                            aColor = 0;
                        }
                        if(wantColor) {
                            aParticleInstance.mBkgColor = (aParticleInstance.mBkgColor & 0xff000000) | (aColor & 0xffffff);
                        }
                        if(wantTransparency) {
                            aParticleInstance.mBkgColor = (aParticleInstance.mBkgColor & 0xffffff) | (aColor & 0xff000000);
                        }
                    }
                }
                if(!aParticleDef.mAngleAlignToMotion) {
                    aParticleInstance.mImgAngle += aParamEmitterSpin * (aLifeValueSample.mSpin) * (aParamParticleDefSpin + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)]));
                } else {
                    if(aParticleDef.mAngleKeepAlignedToMotion) {
                        aParticleInstance.mImgAngle = Math.atan2(aCurVel.y, aCurVel.x) + GameFramework.resources.PIEffect.DegToRad(aParticleDef.mAngleAlignOffset);
                    }
                }
                aParticleInstance = aNext_2;
            }
        } else if((theParticleGroup.mHasImageCycle) || (theParticleGroup.mHasAlignToMotion)) {
            doImageCycle = false;
            while(aParticleInstance != null) {
                var aNext_3 = aParticleInstance.mNext;
                if(aParticleDef != aParticleInstance.mParticleDef) {
                    anEmitter = aParticleInstance.mEmitterSrc;
                    aParticleDef = aParticleInstance.mParticleDef;
                    aParticleDefInstance = aParticleInstance.mParticleDefInstance;
                    var aTexture_3 = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                    doImageCycle = ((aParticleDef.mAnimSpeed != -1) && (aTexture_3.mNumCels > 1));
                }
                aParticleInstance.mLifePctInt += aParticleInstance.mLifePctIntInc;
                if((aParticleInstance.mLifePctInt & 0x80000000) != 0) {
                    this.FreeParticle(this, aParticleInstance, theParticleGroup);
                    aParticleInstance = aNext_3;
                    continue;
                }
                var anIdx_2 = (((aParticleInstance.mLifePctInt / (((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0))) | 0));
                var aLifeValueSample_2 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_2];
                if(doImageCycle) {
                    aParticleInstance.mTicks += 1.0 / anUpdateRate;
                    var aTexture_4 = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                    aParticleInstance.mImgIdx = (((aParticleInstance.mTicks * this.mFramerate / (aParticleDef.mAnimSpeed + 1)) | 0) + aParticleInstance.mAnimFrameRand) % aTexture_4.mNumCels;
                }
                if(this.mIsNewFrame) {
                    var aRand1_2 = GameFramework.resources.PIEffect.gRandSquareTable[GameFramework.resources.PIEffect.gRandSquareIdx];
                    var aRand2_2 = GameFramework.resources.PIEffect.gRandSquareTable[GameFramework.resources.PIEffect.gRandSquareIdx + 1];
                    GameFramework.resources.PIEffect.gRandSquareIdx = (GameFramework.resources.PIEffect.gRandSquareIdx + 2) % 1024;
                    var aMotionRand_2 = anEmitter.mCurMotionRand * aLifeValueSample_2.mMotionRand * (aParticleDefInstance.mCurMotionRand + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0)]));
                    if(aMotionRand_2 > 0) {
                        aParticleInstance.mVel.x += aRand1_2 * aMotionRand_2;
                        aParticleInstance.mVel.y += aRand2_2 * aMotionRand_2;
                    }
                }
                var aWeight_2 = anEmitter.mCurWeight * (aLifeValueSample_2.mWeight) * (aParticleDefInstance.mCurWeight + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)]));
                aParticleInstance.mVel.y += aWeight_2;
                var aVelX = (aParticleInstance.mVel.x / anUpdateRate) * aLifeValueSample_2.mVelocity;
                var aVelY = (aParticleInstance.mVel.y / anUpdateRate) * aLifeValueSample_2.mVelocity;
                aParticleInstance.mVel.y += aWeight_2;
                aParticleInstance.mPos.x += aVelX;
                aParticleInstance.mPos.y += aVelY;
                if(!aParticleDef.mAngleAlignToMotion) {
                    aParticleInstance.mImgAngle += aParamEmitterSpin * (aLifeValueSample_2.mSpin) * (aParamParticleDefSpin + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)]));
                } else {
                    if(aParticleDef.mAngleKeepAlignedToMotion) {
                        aParticleInstance.mImgAngle = Math.atan2(aVelY, aVelX) + GameFramework.resources.PIEffect.DegToRad(aParticleDef.mAngleAlignOffset);
                    }
                }
                aParticleInstance = aNext_3;
            }
        } else if((!theParticleGroup.mHasDeferredUpdate) && (!theParticleGroup.mHasSingleParticles) && (this.mAllowDeferredUpdate)) {
            theParticleGroup.mHasDeferredUpdate = true;
        } else {
            if(this.mIsNewFrame) {
                while(aParticleInstance != null) {
                    var aNext_4 = aParticleInstance.mNext;
                    aParticleDef = aParticleInstance.mParticleDef;
                    aParticleDefInstance = aParticleInstance.mParticleDefInstance;
                    anEmitter = aParticleInstance.mEmitterSrc;
                    aParticleInstance.mLifePctInt += aParticleInstance.mLifePctIntInc;
                    if((aParticleInstance.mLifePctInt & 0x80000000) != 0) {
                        this.FreeParticle(this, aParticleInstance, theParticleGroup);
                        aParticleInstance = aNext_4;
                        continue;
                    }
                    var anIdx_3 = (((aParticleInstance.mLifePctInt / (((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0))) | 0));
                    var aLifeValueSample_3 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_3];
                    var aRand1_3 = GameFramework.resources.PIEffect.gRandSquareTable[GameFramework.resources.PIEffect.gRandSquareIdx];
                    var aRand2_3 = GameFramework.resources.PIEffect.gRandSquareTable[GameFramework.resources.PIEffect.gRandSquareIdx + 1];
                    GameFramework.resources.PIEffect.gRandSquareIdx = (GameFramework.resources.PIEffect.gRandSquareIdx + 2) % 1024;
                    var aMotionRand_3 = anEmitter.mCurMotionRand * aLifeValueSample_3.mMotionRand * (aParticleDefInstance.mCurMotionRand + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0)]));
                    if(aMotionRand_3 > 0) {
                        aParticleInstance.mVel.x += aRand1_3 * aMotionRand_3;
                        aParticleInstance.mVel.y += aRand2_3 * aMotionRand_3;
                    }
                    var aWeight_3 = anEmitter.mCurWeight * (aLifeValueSample_3.mWeight) * (aParticleDefInstance.mCurWeight + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)]));
                    aParticleInstance.mVel.y += aWeight_3;
                    aParticleInstance.mPos.x += (aParticleInstance.mVel.x / anUpdateRate) * aLifeValueSample_3.mVelocity;
                    aParticleInstance.mPos.y += (aParticleInstance.mVel.y / anUpdateRate) * aLifeValueSample_3.mVelocity;
                    aParticleInstance.mImgAngle += anEmitter.mCurSpin * (aLifeValueSample_3.mSpin) * (aParticleDefInstance.mCurSpin + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)]));
                    aParticleInstance = aNext_4;
                }
            } else {
                while(aParticleInstance != null) {
                    var aNext_5 = aParticleInstance.mNext;
                    aParticleDef = aParticleInstance.mParticleDef;
                    aParticleDefInstance = aParticleInstance.mParticleDefInstance;
                    anEmitter = aParticleInstance.mEmitterSrc;
                    aParticleInstance.mLifePctInt += aParticleInstance.mLifePctIntInc;
                    if((aParticleInstance.mLifePctInt & 0x80000000) != 0) {
                        this.FreeParticle(this, aParticleInstance, theParticleGroup);
                        aParticleInstance = aNext_5;
                        continue;
                    }
                    var anIdx_4 = (((aParticleInstance.mLifePctInt / (((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0))) | 0));
                    var aLifeValueSample_4 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_4];
                    var aWeight_4 = anEmitter.mCurWeight * (aLifeValueSample_4.mWeight) * (aParticleDefInstance.mCurWeight + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)]));
                    aParticleInstance.mVel.y += aWeight_4;
                    aParticleInstance.mPos.x += (aParticleInstance.mVel.x / anUpdateRate) * aLifeValueSample_4.mVelocity;
                    aParticleInstance.mPos.y += (aParticleInstance.mVel.y / anUpdateRate) * aLifeValueSample_4.mVelocity;
                    aParticleInstance.mImgAngle += anEmitter.mCurSpin * (aLifeValueSample_4.mSpin) * (aParticleDefInstance.mCurSpin + (aParticleInstance.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)]));
                    aParticleInstance = aNext_5;
                }
            }
        }
    },
    Update : function GameFramework_resources_PIEffect$Update() {
        if(this.mError != null) {
            return;
        }
        this.mUpdateCnt++;
        if((this.mFrameTime == GameFramework.BaseApp.mApp.mFrameTime * 2.0) && (this.mUpdateCnt % 2 == 0)) {
            return;
        }
        var isFirstFrame = this.mFrameNum == 0.0;
        if((isFirstFrame) && (this.mStartupState != null)) {
            this.mStartupState.set_Position(0);
            this.LoadState(this.mStartupState, true);
            this.mWantsSRand = false;
            return;
        }
        var doOneFrame = true;
        while((this.mFrameNum < this.mFirstFrameNum) || (doOneFrame)) {
            doOneFrame = false;
            this.mCurNumEmitters = 0;
            this.mCurNumParticles = 0;
            var anUpdateRate = (1000.0 / this.mFrameTime) / this.mAnimSpeed;
            var aPrevFrameI = (this.mFrameNum | 0);
            if(isFirstFrame) {
                this.mFrameNum += 0.0001;
            } else {
                this.mFrameNum += this.mFramerate / anUpdateRate;
            }
            this.mIsNewFrame = aPrevFrameI != (this.mFrameNum | 0);
            for(var aLayerIdx = 0; aLayerIdx < (this.mDef.mLayerDefVector.length | 0); aLayerIdx++) {
                var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
                var aLayer = this.mLayerVector[aLayerIdx];
                aLayer.mCurOffset = aLayerDef.mOffset.GetValueAt(this.mFrameNum).subtract(aLayerDef.mOrigOffset);
                aLayer.mCurAngle = -GameFramework.resources.PIEffect.DegToRad(aLayerDef.mAngle.GetValueAt(this.mFrameNum));
                if(aLayer.mVisible) {
                    for(var aDeflectorIdx = 0; aDeflectorIdx < (aLayerDef.mDeflectorVector.length | 0); aDeflectorIdx++) {
                        var aDeflector = aLayerDef.mDeflectorVector[aDeflectorIdx];
                        var aTransform = new GameFramework.geom.Matrix();
                        var aDeflectorAng = aDeflector.mAngle.GetValueAt(this.mFrameNum);
                        if(aDeflectorAng != 0) {
                            aTransform.rotate(GameFramework.resources.PIEffect.DegToRad(aDeflectorAng));
                        }
                        var aDeflectorPos = aDeflector.mPos.GetValueAt(this.mFrameNum);
                        aTransform.translate(aDeflectorPos.x, aDeflectorPos.y);
                        var anOffset = aLayerDef.mOffset.GetValueAt(this.mFrameNum);
                        aTransform.translate(anOffset.x, anOffset.y);
                        var anAngle = aLayerDef.mAngle.GetValueAt(this.mFrameNum);
                        if(anAngle != 0) {
                            aTransform.rotate(GameFramework.resources.PIEffect.DegToRad(anAngle));
                        }
                        aTransform.concat(this.mDrawTransform);
                        for(var i = 0; i < (aDeflector.mPoints.length | 0); i++) {
                            aDeflector.mCurPoints[i] = aTransform.transformPoint(aDeflector.mPoints[i].GetValueAt(this.mFrameNum));
                        }
                    }
                    for(var aForceIdx = 0; aForceIdx < (aLayerDef.mForceVector.length | 0); aForceIdx++) {
                        var aForce = aLayerDef.mForceVector[aForceIdx];
                        var aTransform_2 = new GameFramework.geom.Matrix();
                        aTransform_2.scale(aForce.mWidth.GetValueAt(this.mFrameNum) / 2.0, aForce.mHeight.GetValueAt(this.mFrameNum) / 2.0);
                        var aForceAngle = aForce.mAngle.GetValueAt(this.mFrameNum);
                        if(aForceAngle != 0) {
                            aTransform_2.rotate(GameFramework.resources.PIEffect.DegToRad(aForceAngle));
                        }
                        var aForcePos = aForce.mPos.GetValueAt(this.mFrameNum);
                        aTransform_2.translate(aForcePos.x, aForcePos.y);
                        var anOffset_2 = aLayerDef.mOffset.GetValueAt(this.mFrameNum);
                        aTransform_2.translate(anOffset_2.x, anOffset_2.y);
                        var anAngle_2 = aLayerDef.mAngle.GetValueAt(this.mFrameNum);
                        if(anAngle_2 != 0) {
                            aTransform_2.rotate(GameFramework.resources.PIEffect.DegToRad(anAngle_2));
                        }
                        aTransform_2.concat(this.mDrawTransform);
                        var aPoints = Array.Create(5, 5, new GameFramework.geom.TPoint(-1, -1), new GameFramework.geom.TPoint(1, -1), new GameFramework.geom.TPoint(1, 1), new GameFramework.geom.TPoint(-1, 1), new GameFramework.geom.TPoint(0, 0));
                        for(var aPtIdx = 0; aPtIdx < 5; aPtIdx++) {
                            aForce.mCurPoints[aPtIdx] = aTransform_2.transformPoint(aPoints[aPtIdx]);
                        }
                    }
                    for(var anEmitterInstanceIdx = 0; anEmitterInstanceIdx < (aLayer.mEmitterInstanceVector.length | 0); anEmitterInstanceIdx++) {
                        var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
                        var anEmitterInstance = aLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
                        anEmitterInstance.mTintColorI = anEmitterInstance.mTintColor;
                        anEmitterInstanceDef.mCurAngle = GameFramework.resources.PIEffect.DegToRad(anEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0)].GetValueAt(this.mFrameNum));
                        var anEmitterCount = 0;
                        var aParticleCount = 0;
                        var anIterationsLeft = 1;
                        while(anEmitterInstance.mVisible && anIterationsLeft > 0) {
                            anEmitterCount = 0;
                            aParticleCount = 0;
                            anIterationsLeft--;
                            var isActive = anEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0)].GetLastKeyframe(this.mFrameNum) > 0.99;
                            if(!isActive) {
                                anIterationsLeft = 0;
                            } else if(!anEmitterInstance.mWasActive) {
                                anIterationsLeft += ((anEmitterInstanceDef.mFramesToPreload * anUpdateRate / this.mFramerate) | 0);
                            }
                            anEmitterInstance.mWasActive = isActive;
                            var aFirstTime = anEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0)].GetNextKeyframeTime(0.0);
                            var aLastTime = anEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0)].GetLastKeyframeTime(this.mLastFrameNum + 1.0);
                            var aLastValue = anEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0)].GetLastKeyframe(this.mLastFrameNum + 1.0);
                            anEmitterInstance.mWithinLifeFrame = (this.mFrameNum >= aFirstTime) && ((this.mFrameNum < aLastTime) || (aLastValue > 0.99)) && ((this.mEmitAfterTimeline) || (this.mFrameNum < this.mLastFrameNum));
                            if((isActive) || ((anEmitterInstanceDef.mIsSuperEmitter) && (anEmitterInstance.mWithinLifeFrame))) {
                                anEmitterCount++;
                            }
                            if(anEmitterInstanceDef.mIsSuperEmitter) {
                                for(var aFreeEmitterIdx = 0; aFreeEmitterIdx < (anEmitterInstanceDef.mFreeEmitterIndices.length | 0); aFreeEmitterIdx++) {
                                    var anEmitter = this.mDef.mEmitterVector[anEmitterInstanceDef.mFreeEmitterIndices[aFreeEmitterIdx]];
                                    var aWeightscale = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate;
                                    var aSpinScale = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate);
                                    anEmitter.mCurWeight = (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum)) * 100.0 * aWeightscale;
                                    anEmitter.mCurSpin = (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.SPIN | 0)].GetValueAt(this.mFrameNum)) * aSpinScale;
                                    anEmitter.mCurMotionRand = (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum));
                                    var aParticleDefInstance = anEmitterInstance.mSuperEmitterParticleDefInstanceVector[aFreeEmitterIdx];
                                    this.UpdateParticleDef(aLayer, anEmitter, anEmitterInstance, null, aParticleDefInstance, anEmitterInstance.mSuperEmitterGroup, null);
                                }
                                this.UpdateParticleGroup(aLayer, anEmitterInstance, anEmitterInstance.mSuperEmitterGroup);
                                var aChildEmitterInstance = anEmitterInstance.mSuperEmitterGroup.mHead;
                                while(aChildEmitterInstance != null) {
                                    var aNext = aChildEmitterInstance.mNext;
                                    var anEmitter_2 = aChildEmitterInstance.mEmitterSrc;
                                    for(var aParticleDefIdx = 0; (aParticleDefIdx | 0) < anEmitter_2.mParticleDefVector.length; aParticleDefIdx++) {
                                        var aParticleDef = anEmitter_2.mParticleDefVector[aParticleDefIdx];
                                        var aParticleDefInstance_2 = aChildEmitterInstance.mEmitter.mParticleDefInstanceVector[aParticleDefIdx];
                                        this.UpdateParticleDef(aLayer, anEmitter_2, anEmitterInstance, aParticleDef, aParticleDefInstance_2, aChildEmitterInstance.mEmitter.mParticleGroup, aChildEmitterInstance);
                                    }
                                    this.UpdateParticleGroup(aLayer, anEmitterInstance, aChildEmitterInstance.mEmitter.mParticleGroup);
                                    aParticleCount += aChildEmitterInstance.mEmitter.mParticleGroup.mCount;
                                    anEmitterCount++;
                                    aChildEmitterInstance = aNext;
                                }
                            } else {
                                var anEmitter_3 = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                                var theEmitterInstance = anEmitterInstance;
                                var aWeightscale_2 = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate;
                                var aSpinScale_2 = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate);
                                anEmitter_3.mCurWeight = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum)) * 100.0 * aWeightscale_2;
                                anEmitter_3.mCurSpin = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0)].GetValueAt(this.mFrameNum)) * aSpinScale_2;
                                anEmitter_3.mCurMotionRand = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum));
                                for(var aParticleDefIdx_2 = 0; (aParticleDefIdx_2 | 0) < (anEmitter_3.mParticleDefVector.length | 0); aParticleDefIdx_2++) {
                                    var aParticleGroup = anEmitterInstance.mParticleGroup;
                                    var aParticleDef_2 = anEmitter_3.mParticleDefVector[aParticleDefIdx_2];
                                    var aParticleDefInstance_3 = anEmitterInstance.mParticleDefInstanceVector[aParticleDefIdx_2];
                                    this.UpdateParticleDef(aLayer, anEmitter_3, anEmitterInstance, aParticleDef_2, aParticleDefInstance_3, aParticleGroup, null);
                                }
                                this.UpdateParticleGroup(aLayer, anEmitterInstance, anEmitterInstance.mParticleGroup);
                                aParticleCount += anEmitterInstance.mParticleGroup.mCount;
                            }
                        }
                        this.mCurNumEmitters += anEmitterCount;
                        this.mCurNumParticles += aParticleCount;
                    }
                }
            }
            isFirstFrame = false;
        }
    },
    DrawParticleGroup : function GameFramework_resources_PIEffect$DrawParticleGroup(g, theLayer, theEmitterInstance, theParticleGroup, isDarkeningPass) {
        if(!theEmitterInstance.mWasActive) {
            return;
        }
        var aColorMult = GameFramework.gfx.Color.Mult(this.mColor, theLayer.mColor);
        var anOrigAlpha = ((this.mColor >>> 24) | 0) & 0xff;
        var anOrigAlphaI = ((((((this.mColor >>> 24) & 0xff) * 256) | 0) / 255) | 0);
        var anAlphaI = (((this.mColor >>> 24) & 0xff) | 0);
        var hasColor = (aColorMult & 0xffffff) != 0xffffff;
        var aParticleDef = null;
        var aParticleDefInstance = null;
        var anEmitter = null;
        var aTintPct = 0.0;
        var doPass = false;
        var additive = false;
        if((theParticleGroup.mHasColorSampling) || (theParticleGroup.mHasPreserveColor)) {
            var aParticleInstance = theParticleGroup.mHead;
            while(aParticleInstance != null) {
                var aNext = aParticleInstance.mNext;
                if(aParticleDef != aParticleInstance.mParticleDef) {
                    aParticleDef = aParticleInstance.mParticleDef;
                    aParticleDefInstance = aParticleInstance.mParticleDefInstance;
                    if((aParticleDef.mIntense) && (!isDarkeningPass)) {
                        additive = true;
                    } else {
                        additive = false;
                    }
                    doPass = (((!aParticleDef.mIntense) || (!aParticleDef.mPreserveColor)) && (isDarkeningPass));
                }
                if(doPass) {
                    aParticleInstance = aNext;
                    continue;
                }
                if(anEmitter != aParticleInstance.mEmitterSrc) {
                    anEmitter = aParticleInstance.mEmitterSrc;
                    aTintPct = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.TINT_STRENGTH | 0)].GetValueAt(this.mFrameNum)) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.TINT_STRENGTH | 0)].GetValueAt(this.mFrameNum, 1.0));
                }
                var anEmitterLifePct = 0;
                if(aParticleInstance.mParentFreeEmitter != null) {
                    anEmitterLifePct = aParticleInstance.mParentFreeEmitter.mLifePct;
                }
                var anIdx = (((aParticleInstance.mLifePctInt / (((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0))) | 0));
                var aLifeValueSample = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx];
                var aColorI = aLifeValueSample.mColor;
                if(aParticleDef.mGetColorFromLayer) {
                    aColorI = (aColorI & 0xff000000) | (aParticleInstance.mBkgColor & 0xffffff);
                }
                if(aParticleDef.mGetTransparencyFromLayer) {
                    aColorI = (aColorI & 0xffffff) | (aParticleInstance.mBkgColor & 0xff000000);
                }
                if(aTintPct != 0.0) {
                    aColorI = this.InterpColor(aColorI, theEmitterInstance.mTintColor, aTintPct);
                }
                if(isDarkeningPass) {
                    aColorI = aColorI & 0xff000000;
                }
                if(hasColor) {
                    aColorI = GameFramework.gfx.Color.Mult(aColorI, aColorMult);
                } else if(aParticleDefInstance.mAlphaI != 256) {
                    aColorI = (aColorI & 0xffffff) | ((((aColorI >>> 24) * aParticleDefInstance.mAlphaI) | 0) & 0xff00) << 16;
                }
                if((aColorI & 0xff000000) != 0) {
                    this.CalcParticleTransform(theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aParticleInstance);
                    var aMatrix = aParticleInstance.mTransform;
                    var aPITextureChunk = aParticleInstance.mTextureChunk;
                    var anImageResource = aPITextureChunk.mSrcTexture.mImageStrip;
                    if(this.mHasDrawTransform) {
                        aMatrix.concat(this.mDrawTransform);
                    } else {
                        var aW = anImageResource.mWidth * 0.5;
                        var aH = anImageResource.mHeight * 0.5;
                        aMatrix.tx += -aMatrix.a - aMatrix.c;
                        aMatrix.ty += -aMatrix.b - aMatrix.d;
                        aMatrix.tx = aMatrix.tx * this.mDrawTransform.a + this.mDrawTransform.tx;
                        aMatrix.ty = aMatrix.ty * this.mDrawTransform.d + this.mDrawTransform.ty;
                        aMatrix.a *= this.mDrawTransform.a / aW;
                        aMatrix.b *= this.mDrawTransform.a / aW;
                        aMatrix.c *= this.mDrawTransform.d / aH;
                        aMatrix.d *= this.mDrawTransform.d / aH;
                    }
                    aParticleInstance.mTextureChunk.mSrcTexture.mImageStrip.set_Additive(additive);
                    var _t4 = g.PushColor(aColorI);
                    try {
                        aParticleInstance.mTextureChunk.mSrcTexture.mImageStrip.DrawEx(g, aMatrix, 0, 0, aPITextureChunk.mCel);
                    } finally {
                        _t4.Dispose();
                    }
                    aParticleInstance.mHasDrawn = true;
                }
                aParticleInstance = aNext;
            }
        } else if((theParticleGroup.mHasSingleParticles) || (theParticleGroup.mHasAttachToEmitters)) {
            if(isDarkeningPass) {
                return;
            }
            var aParticleInstance_2 = theParticleGroup.mHead;
            if(aParticleInstance_2 != null) {
                aParticleDef = aParticleInstance_2.mParticleDef;
                aParticleDefInstance = aParticleInstance_2.mParticleDefInstance;
                anEmitter = aParticleInstance_2.mEmitterSrc;
                aTintPct = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.TINT_STRENGTH | 0)].GetValueAt(this.mFrameNum)) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.TINT_STRENGTH | 0)].GetValueAt(this.mFrameNum, 1.0));
            }
            while(aParticleInstance_2 != null) {
                var aNext_2 = aParticleInstance_2.mNext;
                aParticleDef = aParticleInstance_2.mParticleDef;
                var anIdx_2 = (((aParticleInstance_2.mLifePctInt / (((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0))) | 0));
                var aLifeValueSample_2 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_2];
                var aColorI_2 = (aLifeValueSample_2.mColor & aParticleInstance_2.mColorMask) | aParticleInstance_2.mColorOr;
                if(aTintPct != 0.0) {
                    aColorI_2 = this.InterpColor(aColorI_2, theEmitterInstance.mTintColorI, aTintPct);
                }
                if(hasColor) {
                    aColorI_2 = ((((((aColorI_2 >>> 24) & 0xff) * aParticleDefInstance.mAlphaI) << 16) | 0) & 0xff000000) | ((((((aColorI_2 >>> 16) & 0xff) * (((aColorMult >>> 16) & 0xff) + 1)) << 8) | 0) & 0xff0000) | ((((((aColorI_2 >>> 8) & 0xff) * (((aColorMult >>> 8) & 0xff) + 1))) | 0) & 0xff00) | ((((((aColorI_2) & 0xff) * ((aColorMult & 0xff) + 1)) >>> 8) | 0) & 0xff);
                } else if(aParticleDefInstance.mAlphaI != 256) {
                    aColorI_2 = (aColorI_2 & 0xffffff) | ((((aColorI_2 >>> 24) * aParticleDefInstance.mAlphaI) | 0) & 0xff00) << 16;
                }
                if((aColorI_2 & 0xff000000) != 0) {
                    this.CalcParticleTransform(theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aParticleInstance_2);
                    var aMatrix_2 = aParticleInstance_2.mTransform;
                    var aPITextureChunk_2 = aParticleInstance_2.mTextureChunk;
                    var anImageResource_2 = aPITextureChunk_2.mSrcTexture.mImageStrip;
                    if(this.mHasDrawTransform) {
                        aMatrix_2.concat(this.mDrawTransform);
                    } else {
                        var aW_2 = anImageResource_2.mWidth * 0.5;
                        var aH_2 = anImageResource_2.mHeight * 0.5;
                        aMatrix_2.tx += -aMatrix_2.a - aMatrix_2.c;
                        aMatrix_2.ty += -aMatrix_2.b - aMatrix_2.d;
                        aMatrix_2.tx = aMatrix_2.tx * this.mDrawTransform.a + this.mDrawTransform.tx;
                        aMatrix_2.ty = aMatrix_2.ty * this.mDrawTransform.d + this.mDrawTransform.ty;
                        aMatrix_2.a *= this.mDrawTransform.a / aW_2;
                        aMatrix_2.b *= this.mDrawTransform.a / aW_2;
                        aMatrix_2.c *= this.mDrawTransform.d / aH_2;
                        aMatrix_2.d *= this.mDrawTransform.d / aH_2;
                    }
                    aParticleInstance_2.mTextureChunk.mSrcTexture.mImageStrip.set_Additive(aParticleInstance_2.mParticleDef.mIntense);
                    var _t5 = g.PushColor(aColorI_2);
                    try {
                        aParticleInstance_2.mTextureChunk.mSrcTexture.mImageStrip.DrawEx(g, aMatrix_2, 0, 0, aPITextureChunk_2.mCel);
                    } finally {
                        _t5.Dispose();
                    }
                    aParticleInstance_2.mHasDrawn = true;
                }
                aParticleInstance_2 = aNext_2;
            }
        } else if(theParticleGroup.mHasDeferredUpdate) {
            if(isDarkeningPass) {
                return;
            }
            var anUpdateRate = (1000.0 / this.mFrameTime) / this.mAnimSpeed;
            var aWeightscale = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate;
            var aSpinScale = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate);
            anAlphaI = 256;
            var aParticleInstance_3 = theParticleGroup.mHead;
            if(aParticleInstance_3 != null) {
                aParticleDef = aParticleInstance_3.mParticleDef;
                aParticleDefInstance = aParticleInstance_3.mParticleDefInstance;
                anEmitter = aParticleInstance_3.mEmitterSrc;
                aTintPct = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.TINT_STRENGTH | 0)].GetValueAt(this.mFrameNum)) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.TINT_STRENGTH | 0)].GetValueAt(this.mFrameNum, 1.0));
            }
            if(this.mIsNewFrame) {
                while(aParticleInstance_3 != null) {
                    var aNext_3 = aParticleInstance_3.mNext;
                    aParticleDef = aParticleInstance_3.mParticleDef;
                    aParticleInstance_3.mLifePctInt += aParticleInstance_3.mLifePctIntInc;
                    if((aParticleInstance_3.mLifePctInt & 0x80000000) != 0) {
                        this.FreeParticle(this, aParticleInstance_3, theParticleGroup);
                        aParticleInstance_3 = aNext_3;
                        continue;
                    }
                    var anIdx_3 = aParticleInstance_3.mLifePctInt >> GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT;
                    var aLifeValueSample_3 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_3];
                    var aLifeValueSampleNext = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_3 + 1];
                    var aPct = (aParticleInstance_3.mLifePctInt & ((1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT) - 1)) / (1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT);
                    var aSizeX = (aLifeValueSample_3.mSizeX * (1.0 - aPct)) + (aLifeValueSampleNext.mSizeX * aPct);
                    var aSizeY = (aLifeValueSample_3.mSizeY * (1.0 - aPct)) + (aLifeValueSampleNext.mSizeY * aPct);
                    var aRand1 = GameFramework.resources.PIEffect.gRandSquareTable[GameFramework.resources.PIEffect.gRandSquareIdx];
                    var aRand2 = GameFramework.resources.PIEffect.gRandSquareTable[GameFramework.resources.PIEffect.gRandSquareIdx + 1];
                    GameFramework.resources.PIEffect.gRandSquareIdx = (GameFramework.resources.PIEffect.gRandSquareIdx + 2) % 1024;
                    var aMotionRand = anEmitter.mCurMotionRand * aLifeValueSample_3.mMotionRand * (aParticleDefInstance.mCurMotionRand + (aParticleInstance_3.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0)]));
                    if(aMotionRand > 0) {
                        aParticleInstance_3.mVel.x += aRand1 * aMotionRand;
                        aParticleInstance_3.mVel.y += aRand2 * aMotionRand;
                    }
                    var aWeight = anEmitter.mCurWeight * (aLifeValueSample_3.mWeight) * (aParticleDefInstance.mCurWeight + (aParticleInstance_3.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)]));
                    aParticleInstance_3.mVel.y += aWeight;
                    aParticleInstance_3.mPos.x += (aParticleInstance_3.mVel.x / anUpdateRate) * aLifeValueSample_3.mVelocity;
                    aParticleInstance_3.mPos.y += (aParticleInstance_3.mVel.y / anUpdateRate) * aLifeValueSample_3.mVelocity;
                    aParticleInstance_3.mImgAngle += anEmitter.mCurSpin * (aLifeValueSample_3.mSpin) * (aParticleDefInstance.mCurSpin + (aParticleInstance_3.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)]));
                    var aColorI_3 = (this.InterpColor(aLifeValueSample_3.mColor, aLifeValueSampleNext.mColor, aPct) & aParticleInstance_3.mColorMask) | aParticleInstance_3.mColorOr;
                    if(aTintPct != 0.0) {
                        aColorI_3 = this.InterpColor(aColorI_3, theEmitterInstance.mTintColorI, aTintPct);
                    }
                    if(hasColor) {
                        aColorI_3 = ((((((aColorI_3 >>> 24) & 0xff) * aParticleDefInstance.mAlphaI) << 16) | 0) & 0xff000000) | ((((((aColorI_3 >>> 16) & 0xff) * (((aColorMult >>> 16) & 0xff) + 1)) << 8) | 0) & 0xff0000) | ((((((aColorI_3 >>> 8) & 0xff) * (((aColorMult >>> 8) & 0xff) + 1))) | 0) & 0xff00) | ((((((aColorI_3) & 0xff) * ((aColorMult & 0xff) + 1)) >>> 8) | 0) & 0xff);
                    } else if(aParticleDefInstance.mAlphaI != 256) {
                        aColorI_3 = (aColorI_3 & 0xffffff) | ((((aColorI_3 >>> 24) * aParticleDefInstance.mAlphaI) | 0) & 0xff00) << 16;
                    }
                    if((aColorI_3 & 0xff000000) != 0) {
                        this.CalcParticleTransform(theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aParticleInstance_3);
                        var aMatrix_3 = aParticleInstance_3.mTransform;
                        var aPITextureChunk_3 = aParticleInstance_3.mTextureChunk;
                        var anImageResource_3 = aPITextureChunk_3.mSrcTexture.mImageStrip;
                        if(this.mHasDrawTransform) {
                            aMatrix_3.concat(this.mDrawTransform);
                        } else {
                            var aW_3 = anImageResource_3.mWidth * 0.5;
                            var aH_3 = anImageResource_3.mHeight * 0.5;
                            aMatrix_3.tx += -aMatrix_3.a - aMatrix_3.c;
                            aMatrix_3.ty += -aMatrix_3.b - aMatrix_3.d;
                            aMatrix_3.tx = aMatrix_3.tx * this.mDrawTransform.a + this.mDrawTransform.tx;
                            aMatrix_3.ty = aMatrix_3.ty * this.mDrawTransform.d + this.mDrawTransform.ty;
                            aMatrix_3.a *= this.mDrawTransform.a / aW_3;
                            aMatrix_3.b *= this.mDrawTransform.a / aW_3;
                            aMatrix_3.c *= this.mDrawTransform.d / aH_3;
                            aMatrix_3.d *= this.mDrawTransform.d / aH_3;
                        }
                        aParticleInstance_3.mTextureChunk.mSrcTexture.mImageStrip.set_Additive(aParticleInstance_3.mParticleDef.mIntense);
                        var _t6 = g.PushColor(aColorI_3);
                        try {
                            aParticleInstance_3.mTextureChunk.mSrcTexture.mImageStrip.DrawEx(g, aMatrix_3, 0, 0, aPITextureChunk_3.mCel);
                        } finally {
                            _t6.Dispose();
                        }
                        aParticleInstance_3.mHasDrawn = true;
                    }
                    aParticleInstance_3 = aNext_3;
                }
            } else {
                while(aParticleInstance_3 != null) {
                    var aNext_4 = aParticleInstance_3.mNext;
                    aParticleDef = aParticleInstance_3.mParticleDef;
                    aParticleDefInstance = aParticleInstance_3.mParticleDefInstance;
                    aParticleInstance_3.mLifePctInt += aParticleInstance_3.mLifePctIntInc;
                    if((aParticleInstance_3.mLifePctInt & 0x80000000) != 0) {
                        this.FreeParticle(this, aParticleInstance_3, theParticleGroup);
                        aParticleInstance_3 = aNext_4;
                        continue;
                    }
                    var anIdx_4 = aParticleInstance_3.mLifePctInt >> GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT;
                    var aLifeValueSample_4 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_4];
                    var aLifeValueSampleNext_2 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_4 + 1];
                    var aPct_2 = (aParticleInstance_3.mLifePctInt & ((1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT) - 1)) / (1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT);
                    var aSizeX_2 = (aLifeValueSample_4.mSizeX * (1.0 - aPct_2)) + (aLifeValueSampleNext_2.mSizeX * aPct_2);
                    var aSizeY_2 = (aLifeValueSample_4.mSizeY * (1.0 - aPct_2)) + (aLifeValueSampleNext_2.mSizeY * aPct_2);
                    var aWeight_2 = anEmitter.mCurWeight * (aLifeValueSample_4.mWeight) * (aParticleDefInstance.mCurWeight + (aParticleInstance_3.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0)]));
                    aParticleInstance_3.mVel.y += aWeight_2;
                    aParticleInstance_3.mPos.x += (aParticleInstance_3.mVel.x / anUpdateRate) * aLifeValueSample_4.mVelocity;
                    aParticleInstance_3.mPos.y += (aParticleInstance_3.mVel.y / anUpdateRate) * aLifeValueSample_4.mVelocity;
                    aParticleInstance_3.mImgAngle += anEmitter.mCurSpin * (aLifeValueSample_4.mSpin) * (aParticleDefInstance.mCurSpin + (aParticleInstance_3.mVariationValues[(GameFramework.resources.PIParticleInstance.Variation.SPIN | 0)]));
                    var aColorI_4 = (this.InterpColor(aLifeValueSample_4.mColor, aLifeValueSampleNext_2.mColor, aPct_2) & aParticleInstance_3.mColorMask) | aParticleInstance_3.mColorOr;
                    if(aTintPct != 0.0) {
                        aColorI_4 = this.InterpColor(aColorI_4, theEmitterInstance.mTintColorI, aTintPct);
                    }
                    if(hasColor) {
                        aColorI_4 = ((((((aColorI_4 >>> 24) & 0xff) * aParticleDefInstance.mAlphaI) << 16) | 0) & 0xff000000) | ((((((aColorI_4 >>> 16) & 0xff) * (((aColorMult >>> 16) & 0xff) + 1)) << 8) | 0) & 0xff0000) | ((((((aColorI_4 >>> 8) & 0xff) * (((aColorMult >>> 8) & 0xff) + 1))) | 0) & 0xff00) | ((((((aColorI_4) & 0xff) * ((aColorMult & 0xff) + 1)) >>> 8) | 0) & 0xff);
                    } else if(aParticleDefInstance.mAlphaI != 256) {
                        aColorI_4 = (aColorI_4 & 0xffffff) | ((((aColorI_4 >>> 24) * aParticleDefInstance.mAlphaI) | 0) & 0xff00) << 16;
                    }
                    if((aColorI_4 & 0xff000000) != 0) {
                        this.CalcParticleTransformSimple(theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aParticleInstance_3, aSizeX_2, aSizeY_2);
                        var aMatrix_4 = aParticleInstance_3.mTransform;
                        var aPITextureChunk_4 = aParticleInstance_3.mTextureChunk;
                        var anImageResource_4 = aPITextureChunk_4.mSrcTexture.mImageStrip;
                        if(this.mHasDrawTransform) {
                            aMatrix_4.concat(this.mDrawTransform);
                        } else {
                            var aW_4 = anImageResource_4.mWidth * 0.5;
                            var aH_4 = anImageResource_4.mHeight * 0.5;
                            aMatrix_4.tx += -aMatrix_4.a - aMatrix_4.c;
                            aMatrix_4.ty += -aMatrix_4.b - aMatrix_4.d;
                            aMatrix_4.tx = aMatrix_4.tx * this.mDrawTransform.a + this.mDrawTransform.tx;
                            aMatrix_4.ty = aMatrix_4.ty * this.mDrawTransform.d + this.mDrawTransform.ty;
                            aMatrix_4.a *= this.mDrawTransform.a / aW_4;
                            aMatrix_4.b *= this.mDrawTransform.a / aW_4;
                            aMatrix_4.c *= this.mDrawTransform.d / aH_4;
                            aMatrix_4.d *= this.mDrawTransform.d / aH_4;
                        }
                        aParticleInstance_3.mTextureChunk.mSrcTexture.mImageStrip.set_Additive(aParticleInstance_3.mParticleDef.mIntense);
                        var _t7 = g.PushColor(aColorI_4);
                        try {
                            aParticleInstance_3.mTextureChunk.mSrcTexture.mImageStrip.DrawEx(g, aMatrix_4, 0, 0, aPITextureChunk_4.mCel);
                        } finally {
                            _t7.Dispose();
                        }
                        aParticleInstance_3.mHasDrawn = true;
                    }
                    aParticleInstance_3 = aNext_4;
                }
            }
            theParticleGroup.mHasDeferredUpdate = false;
        } else {
            if(isDarkeningPass) {
                return;
            }
            var aParticleInstance_4 = theParticleGroup.mHead;
            if(aParticleInstance_4 != null) {
                aParticleDef = aParticleInstance_4.mParticleDef;
                anEmitter = aParticleInstance_4.mEmitterSrc;
                aTintPct = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.TINT_STRENGTH | 0)].GetValueAt(this.mFrameNum)) * (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.TINT_STRENGTH | 0)].GetValueAt(this.mFrameNum, 1.0));
            }
            while(aParticleInstance_4 != null) {
                var aNext_5 = aParticleInstance_4.mNext;
                aParticleDef = aParticleInstance_4.mParticleDef;
                aParticleDefInstance = aParticleInstance_4.mParticleDefInstance;
                var anIdx_5 = aParticleInstance_4.mLifePctInt >> GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT;
                if(anIdx_5 + 1 >= aParticleDef.mLifeValueTable.mLifeValuesSampleTable.length) {
                    aParticleInstance_4 = aNext_5;
                    continue;
                }
                var aLifeValueSample_5 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_5];
                var aLifeValueSampleNext_3 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_5 + 1];
                var aPct_3 = (aParticleInstance_4.mLifePctInt & ((1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT) - 1)) / (1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT);
                var aSizeX_3 = (aLifeValueSample_5.mSizeX * (1.0 - aPct_3)) + (aLifeValueSampleNext_3.mSizeX * aPct_3);
                var aSizeY_3 = (aLifeValueSample_5.mSizeY * (1.0 - aPct_3)) + (aLifeValueSampleNext_3.mSizeY * aPct_3);
                var aColorI_5 = (this.InterpColor(aLifeValueSample_5.mColor, aLifeValueSampleNext_3.mColor, aPct_3) & aParticleInstance_4.mColorMask) | aParticleInstance_4.mColorOr;
                if(aTintPct != 0.0) {
                    aColorI_5 = this.InterpColor(aColorI_5, theEmitterInstance.mTintColorI, aTintPct);
                }
                if(hasColor) {
                    aColorI_5 = ((((((aColorI_5 >>> 24) & 0xff) * aParticleDefInstance.mAlphaI) << 16) | 0) & 0xff000000) | ((((((aColorI_5 >>> 16) & 0xff) * (((aColorMult >>> 16) & 0xff) + 1)) << 8) | 0) & 0xff0000) | ((((((aColorI_5 >>> 8) & 0xff) * (((aColorMult >>> 8) & 0xff) + 1))) | 0) & 0xff00) | ((((((aColorI_5) & 0xff) * ((aColorMult & 0xff) + 1)) >>> 8) | 0) & 0xff);
                } else if(aParticleDefInstance.mAlphaI != 256) {
                    aColorI_5 = (aColorI_5 & 0xffffff) | ((((aColorI_5 >>> 24) * aParticleDefInstance.mAlphaI) | 0) & 0xff00) << 16;
                }
                if((aColorI_5 & 0xff000000) != 0) {
                    this.CalcParticleTransformSimple(theLayer, theEmitterInstance, anEmitter, aParticleDef, theParticleGroup, aParticleInstance_4, aSizeX_3, aSizeY_3);
                    var aMatrix_5 = aParticleInstance_4.mTransform;
                    var aPITextureChunk_5 = aParticleInstance_4.mTextureChunk;
                    var anImageResource_5 = aPITextureChunk_5.mSrcTexture.mImageStrip;
                    if(this.mHasDrawTransform) {
                        aMatrix_5.concat(this.mDrawTransform);
                    } else {
                        var aW_5 = anImageResource_5.mWidth * 0.5;
                        var aH_5 = anImageResource_5.mHeight * 0.5;
                        aMatrix_5.tx += -aMatrix_5.a - aMatrix_5.c;
                        aMatrix_5.ty += -aMatrix_5.b - aMatrix_5.d;
                        aMatrix_5.tx = aMatrix_5.tx * this.mDrawTransform.a + this.mDrawTransform.tx;
                        aMatrix_5.ty = aMatrix_5.ty * this.mDrawTransform.d + this.mDrawTransform.ty;
                        aMatrix_5.a *= this.mDrawTransform.a / aW_5;
                        aMatrix_5.b *= this.mDrawTransform.a / aW_5;
                        aMatrix_5.c *= this.mDrawTransform.d / aH_5;
                        aMatrix_5.d *= this.mDrawTransform.d / aH_5;
                    }
                    aParticleInstance_4.mTextureChunk.mSrcTexture.mImageStrip.set_Additive(aParticleInstance_4.mParticleDef.mIntense);
                    var _t8 = g.PushColor(aColorI_5);
                    try {
                        aParticleInstance_4.mTextureChunk.mSrcTexture.mImageStrip.DrawEx(g, aMatrix_5, 0, 0, aPITextureChunk_5.mCel);
                    } finally {
                        _t8.Dispose();
                    }
                    aParticleInstance_4.mHasDrawn = true;
                }
                aParticleInstance_4 = aNext_5;
            }
        }
    },
    DrawLayer : function GameFramework_resources_PIEffect$DrawLayer(g, theLayer) {
        var aLayerDef = theLayer.mLayerDef;
        for(var anEmitterInstanceIdx = 0; anEmitterInstanceIdx < (theLayer.mEmitterInstanceVector.length | 0); anEmitterInstanceIdx++) {
            var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
            var anEmitterInstance = theLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
            if(!anEmitterInstance.mVisible) {
                continue;
            }
            for(var aPass = 0; aPass < 2; aPass++) {
                if((aPass == 0) && (!this.mGlobalAllowPreserveColor)) {
                    continue;
                }
                if(anEmitterInstanceDef.mIsSuperEmitter) {
                    for(var aFreeEmitterIdx = 0; aFreeEmitterIdx < (anEmitterInstanceDef.mFreeEmitterIndices.length | 0); aFreeEmitterIdx++) {
                        var anUpdateRate = (1000.0 / this.mFrameTime) / this.mAnimSpeed;
                        var anEmitter = this.mDef.mEmitterVector[anEmitterInstanceDef.mFreeEmitterIndices[aFreeEmitterIdx]];
                        var aWeightscale = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate;
                        var aSpinScale = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate);
                        anEmitter.mCurWeight = (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum)) * 100.0 * aWeightscale;
                        anEmitter.mCurSpin = (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.SPIN | 0)].GetValueAt(this.mFrameNum)) * aSpinScale;
                        anEmitter.mCurMotionRand = (anEmitter.mValues[(GameFramework.resources.PIEmitter.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum));
                        var aChildEmitterInstance = anEmitterInstance.mSuperEmitterGroup.mHead;
                        while(aChildEmitterInstance != null) {
                            this.DrawParticleGroup(g, theLayer, anEmitterInstance, aChildEmitterInstance.mEmitter.mParticleGroup, aPass == 0);
                            aChildEmitterInstance = aChildEmitterInstance.mNext;
                        }
                    }
                } else {
                    var anEmitter_2 = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                    var theEmitterInstance = anEmitterInstance;
                    var anUpdateRate_2 = (1000.0 / this.mFrameTime) / this.mAnimSpeed;
                    var aWeightscale_2 = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate_2;
                    var aSpinScale_2 = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate_2);
                    anEmitter_2.mCurWeight = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0)].GetValueAt(this.mFrameNum)) * 100.0 * aWeightscale_2;
                    anEmitter_2.mCurSpin = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0)].GetValueAt(this.mFrameNum)) * aSpinScale_2;
                    anEmitter_2.mCurMotionRand = (theEmitterInstance.mEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0)].GetValueAt(this.mFrameNum));
                    this.DrawParticleGroup(g, theLayer, anEmitterInstance, anEmitterInstance.mParticleGroup, aPass == 0);
                }
            }
        }
    },
    Draw : function GameFramework_resources_PIEffect$Draw(g) {
        var anOldMatrix = this.mDrawTransform;
        g.PushMatrix(this.mDrawTransform);
        this.mDrawTransform = g.mMatrix;
        this.mHasDrawTransform = (this.mDrawTransform.b != 0.0) || (this.mDrawTransform.c != 0.0);
        this.mLastDrawnPixelCount = 0;
        for(var aLayerIdx = 0; aLayerIdx < (this.mDef.mLayerDefVector.length | 0); aLayerIdx++) {
            var aLayer = this.mLayerVector[aLayerIdx];
            if(aLayer.mVisible) {
                this.DrawLayer(g, aLayer);
            }
        }
        g.PopMatrix();
        this.mDrawTransform = anOldMatrix;
    },
    HasTimelineExpired : function GameFramework_resources_PIEffect$HasTimelineExpired() {
        return this.mFrameNum >= this.mLastFrameNum;
    },
    IsActive : function GameFramework_resources_PIEffect$IsActive() {
        for(var aLayerIdx = 0; aLayerIdx < (this.mDef.mLayerDefVector.length | 0); aLayerIdx++) {
            var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
            var aLayer = this.mLayerVector[aLayerIdx];
            if(aLayer.mVisible) {
                for(var anEmitterInstanceIdx = 0; anEmitterInstanceIdx < aLayer.mEmitterInstanceVector.length; anEmitterInstanceIdx++) {
                    var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
                    var anEmitterInstance = aLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
                    if(anEmitterInstance.mVisible) {
                        if(anEmitterInstanceDef.mValues[(GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0)].GetNextKeyframeTime(this.mFrameNum) >= this.mFrameNum) {
                            return true;
                        }
                        if(anEmitterInstance.mWithinLifeFrame) {
                            return true;
                        }
                        if(anEmitterInstance.mSuperEmitterGroup.mHead != null) {
                            return true;
                        }
                        if(anEmitterInstance.mParticleGroup.mHead != null) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },
    GetNotesParam : function GameFramework_resources_PIEffect$GetNotesParam(theName, theDefault) {
        if(theDefault === undefined) {
            theDefault = '';
        }
        theName = theName.toUpperCase();
        if((this.mNotesParams != null) && (this.mNotesParams.hasOwnProperty(theName))) {
            return this.mNotesParams[theName];
        } else {
            return theDefault;
        }
    }
}
GameFramework.resources.PIEffect.staticInit = function GameFramework_resources_PIEffect$staticInit() {
    GameFramework.resources.PIEffect.PPF_MIN_VERSION = 0;
    GameFramework.resources.PIEffect.PPF_VERSION = 1;
    GameFramework.resources.PIEffect.PPF_STATE_VERSION = 1;
    GameFramework.resources.PIEffect.mGlobalCountScale = 1.0;
    GameFramework.resources.PIEffect.gParticleTypeCount = 0;
    GameFramework.resources.PIEffect.sPIGeomDataEx = new GameFramework.resources.PIGeomDataEx();
    GameFramework.resources.PIEffect.gRandSquareTable = null;
    GameFramework.resources.PIEffect.gRandSquareIdx = -1;
}

JS_AddInitFunc(function() {
    GameFramework.resources.PIEffect.registerClass('GameFramework.resources.PIEffect', null, GameFramework.IExplicitDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PIEffect.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\PIEffect.cs
//LineMap:2=59 13=64 23=71 34=76 44=81 55=89 57=92 68=104 70=107 74=112 77=116 80=120 81=122 91=133 93=136 107=149 110=153 114=158 117=162 126=169 127=171 131=176 133=179 137=185 141=191 146=197 151=203 152=205 156=210 158=213 160=216 161=218 168=226 172=231 175=235 
//LineMap:178=239 184=246 188=251 192=256 197=262 208=274 219=286 230=298 241=310 246=83 251=315 262=320 272=327 282=331 296=346 298=349 303=355 307=360 309=363 313=368 321=377 323=380 325=383 329=388 334=394 343=400 354=405 364=412 369=414 375=416 383=425 384=428 388=433 
//LineMap:392=439 395=443 418=463 435=478 445=483 450=485 461=492 496=521 506=526 516=546 522=528 528=531 531=533 542=553 590=634 596=590 601=555 604=557 629=583 632=587 635=644 653=709 663=646 666=648 674=657 684=668 689=674 699=685 708=695 711=724 714=792 716=749 717=777 
//LineMap:718=793 720=796 769=807 779=726 782=728 794=814 797=827 799=828 812=831 830=846 833=865 835=866 867=882 877=889 882=892 889=894 900=900 903=905 905=902 907=906 913=909 925=919 949=974 959=921 962=923 971=933 977=940 981=945 987=950 994=981 997=1003 999=988 
//LineMap:1000=997 1003=1004 1006=1009 1007=1011 1025=1014 1042=1028 1067=1046 1088=1060 1093=1073 1114=1078 1119=1086 1132=1089 1142=1096 1145=1112 1147=1101 1148=1113 1164=1120 1194=1149 1197=1160 1199=1161 1211=1165 1221=1178 1224=1260 1226=1208 1227=1252 1229=1261 
//LineMap:1231=1264 1234=1268 1237=1272 1240=1276 1245=1284 1248=1288 1250=1412 1254=1417 1256=1418 1260=1423 1264=1447 1266=1451 1267=1453 1270=1457 1272=1460 1273=1462 1275=1469 1296=4538 1298=4546 1299=4549 1307=4558 1310=4562 1312=4565 1316=4570 1322=4577 1325=4581 
//LineMap:1329=4586 1331=4589 1338=4598 1340=4599 1342=4604 1343=4606 1344=4608 1345=4610 1347=4614 1351=4619 1362=4631 1368=4639 1371=4643 1373=4646 1375=4647 1379=4654 1381=4657 1384=4662 1386=4665 1394=1184 1395=1187 1442=1291 1446=1296 1474=1325 1475=1327 1481=1334 
//LineMap:1484=1338 1486=1341 1493=1349 1499=1356 1503=1361 1515=1374 1524=1381 1528=1383 1530=1383 1534=1385 1536=1385 1540=1387 1549=1395 1550=1397 1559=1428 1564=1435 1571=1444 1574=1502 1583=1514 1588=1521 1590=1524 1594=1529 1606=1542 1611=1548 1647=1632 1657=1643 
//LineMap:1662=1646 1664=1650 1668=1655 1687=1675 1690=1679 1693=1683 1697=1688 1699=1691 1703=1696 1710=1704 1715=1710 1721=1717 1726=1723 1733=1731 1748=1750 1752=1755 1755=1759 1758=1763 1760=1766 1765=1772 1771=1779 1776=1785 1780=1790 1783=1794 1784=1794 1785=1796 
//LineMap:1788=1800 1792=1805 1799=1813 1804=1819 1810=1826 1814=1831 1819=1835 1822=1840 1824=1843 1831=1852 1835=1857 1836=1859 1837=1861 1838=1863 1839=1865 1844=1871 1845=1873 1846=1875 1850=1880 1854=1885 1858=1890 1862=1895 1869=1903 1871=1906 1874=1910 1876=1914 
//LineMap:1879=1918 1881=1921 1885=1926 1890=1932 1893=1936 1895=1939 1900=1945 1905=1951 1907=1954 1912=1960 1916=1988 1918=1991 1921=1995 1927=2002 1930=2006 1937=2014 1940=2019 1943=2023 1945=2026 1948=2030 1951=2034 1953=2037 1954=2039 1958=2044 1960=2047 1965=2053 
//LineMap:1966=2053 1968=2056 1971=2057 1976=2060 1981=2063 1986=2066 1991=2069 1996=2072 2001=2075 2010=2085 2014=2087 2016=2091 2018=2094 2020=2097 2022=2100 2026=2105 2027=2105 2029=2108 2033=2110 2038=2113 2043=2116 2048=2119 2053=2122 2058=2125 2063=2128 2078=2163 
//LineMap:2079=2165 2080=2167 2085=2173 2086=2176 2093=2184 2111=2203 2115=2208 2117=2211 2118=2213 2124=2220 2133=2230 2140=2238 2141=2241 2151=2250 2154=2254 2156=2257 2158=2260 2161=2264 2163=2267 2171=2274 2188=2292 2196=2298 2197=2300 2198=2302 2199=2304 2200=2304 
//LineMap:2201=2307 2203=2308 2211=2317 2220=2327 2229=2335 2231=2338 2238=2346 2244=2353 2246=2356 2249=2361 2250=2363 2251=2365 2259=2372 2260=2372 2261=2374 2263=2375 2265=2378 2276=2388 2278=2391 2280=2394 2283=2398 2284=2398 2285=2400 2289=2402 2291=2407 2294=2411 
//LineMap:2295=2411 2296=2413 2300=2418 2309=2426 2310=2426 2311=2428 2314=2432 2323=2440 2334=2450 2335=2450 2336=2452 2338=2455 2340=2458 2344=2463 2352=2470 2353=2472 2357=2477 2362=2492 2363=2492 2369=2503 2374=2509 2380=2522 2381=2524 2382=2526 2383=2536 2385=2542 
//LineMap:2386=2544 2388=2547 2390=2550 2391=2554 2392=2556 2395=2561 2396=2563 2397=2565 2400=2569 2405=2575 2406=2577 2407=2579 2408=2597 2411=2617 2412=2634 2423=2688 2425=2691 2428=2696 2431=2700 2432=2702 2434=2705 2436=2708 2438=2711 2440=2714 2452=2727 2453=2729 
//LineMap:2454=2731 2459=2740 2466=2748 2467=2750 2483=2767 2484=2769 2492=2778 2506=2793 2508=2796 2510=2799 2513=2803 2518=2809 2520=2812 2525=2818 2527=2821 2531=2826 2535=2831 2537=2834 2539=2837 2542=2841 2548=2851 2551=2855 2554=2859 2567=2871 2572=2877 2576=2883 
//LineMap:2577=2885 2580=2892 2585=2898 2586=2900 2587=2902 2591=2907 2593=2910 2599=2918 2601=2921 2606=2927 2610=2932 2612=2935 2616=2940 2617=2942 2618=2944 2623=2950 2625=2953 2630=2959 2632=2962 2636=2967 2640=2972 2642=2975 2647=2986 2654=2994 2656=2997 2661=3003 
//LineMap:2663=3006 2664=3008 2668=3013 2670=3016 2680=3027 2682=3030 2685=3041 2693=3051 2699=3058 2704=3062 2707=3067 2714=3075 2718=3081 2726=3091 2737=3101 2740=3106 2749=3116 2763=3131 2765=3134 2766=3136 2769=3140 2771=3143 2776=3149 2778=3152 2779=3154 2782=3158 
//LineMap:2787=3166 2788=3169 2795=3175 2796=3219 2800=3224 2809=3232 2812=3236 2823=3248 2836=3260 2840=3265 2841=3267 2842=3272 2851=3282 2855=3287 2860=3293 2879=3311 2880=3313 2903=3337 2904=3341 2906=3345 2907=3347 2910=3352 2913=3357 2916=3361 2917=3364 2920=3368 
//LineMap:2922=3371 2925=3375 2928=3376 2930=3380 2932=3386 2938=3393 2942=3398 2946=3403 2948=3406 2954=3413 2959=3419 2969=3430 2971=3433 2977=3440 2984=3446 2987=3450 2999=3463 3006=3469 3011=3475 3023=3488 3030=3494 3039=3502 3040=3504 3043=3632 3046=3636 3048=3639 
//LineMap:3052=3644 3057=3650 3061=3655 3068=3663 3074=3670 3084=3681 3089=3687 3095=3694 3100=3700 3141=3745 3157=3762 3167=3773 3168=3776 3170=3781 3171=3783 3172=3785 3176=3790 3178=3793 3180=3796 3181=3800 3183=3804 3185=3807 3187=3810 3196=3820 3197=3822 3199=3825 
//LineMap:3205=3830 3207=3836 3212=3843 3214=3846 3216=3850 3226=3862 3230=3867 3240=3876 3242=3879 3249=3887 3258=3894 3260=3898 3266=3905 3268=3906 3282=3921 3284=3925 3286=3928 3288=3936 3289=3940 3290=3942 3292=3945 3295=3949 3302=3957 3303=3959 3305=3964 3306=3966 
//LineMap:3307=3971 3309=3974 3311=3977 3313=3980 3317=3985 3327=3994 3329=3997 3336=4005 3338=4008 3342=4014 3344=4018 3345=4020 3346=4022 3351=4028 3354=4032 3355=4036 3359=4041 3363=4049 3365=4053 3374=4063 3375=4065 3378=4069 3381=4073 3384=4078 3385=4081 3389=4086 
//LineMap:3391=4089 3393=4089 3395=4095 3396=4095 3397=4098 3399=4099 3406=4105 3411=4114 3413=4117 3417=4120 3418=4120 3419=4122 3421=4125 3423=4128 3430=4134 3435=4138 3436=4138 3437=4140 3440=4144 3442=4147 3447=4151 3452=4155 3453=4155 3454=4157 3456=4158 3463=4166 
//LineMap:3465=4169 3469=4172 3472=4176 3473=4179 3475=4182 3481=4189 3484=4193 3489=4199 3497=4209 3499=4213 3502=4217 3503=4219 3506=4223 3513=4229 3514=4231 3519=4237 3526=4245 3529=4249 3535=4256 3541=4263 3545=4268 3546=4270 3549=4274 3561=4285 3562=4287 3569=4298 
//LineMap:3570=4301 3572=4317 3583=4329 3584=4331 3585=4337 3595=4346 3608=4360 3610=4364 3614=4369 3616=4372 3619=4377 3623=4385 3625=4389 3626=4392 3627=4394 3630=4398 3636=4405 3648=4416 3650=4419 3656=4426 3659=4430 3662=4434 3666=4440 3668=4443 3675=4452 3676=4456 
//LineMap:3678=4459 3683=4463 3686=4464 3687=4467 3691=4475 3693=4478 3698=4484 3706=4491 3710=4492 3712=4497 3713=4499 3717=4504 3719=4507 3720=4509 3721=4511 3724=4515 3726=4518 3736=4527 3747=4672 3758=4684 3763=4691 3764=4694 3767=4698 3770=4702 3775=4708 3782=4716 
//LineMap:3788=4721 3792=4724 3794=4727 3796=4730 3801=4736 3805=4741 3807=4742 3808=4744 3817=4754 3821=4759 3829=4768 3833=4774 3838=4780 3841=4785 3845=4791 3848=4797 3851=4801 3854=4806 3858=4814 3859=4816 3863=4821 3871=4830 3872=4833 3880=4842 3883=4846 3885=4849 
//LineMap:3889=4854 3895=4861 3898=4865 3904=4873 3910=4881 3912=4882 3914=4887 3915=4889 3916=4891 3917=4893 3919=4897 3923=4902 3932=4910 3934=4913 3940=4921 3943=4925 3945=4928 3947=4929 3951=4936 3953=4939 3956=4944 3958=4947 3963=4953 3966=4954 3968=4958 3971=4962 
//LineMap:3979=4971 3984=4977 3994=4990 4001=4998 4003=5001 4009=5009 4010=5011 4016=5018 4018=5021 4022=5028 4024=5033 4030=5041 4031=5044 4034=5048 4037=5052 4042=5058 4049=5066 4055=5071 4059=5074 4061=5077 4068=5085 4070=5088 4078=5097 4082=5103 4090=5113 4094=5119 
//LineMap:4097=5125 4100=5129 4103=5134 4107=5142 4108=5144 4112=5149 4120=5158 4121=5161 4129=5170 4132=5174 4134=5177 4138=5182 4144=5189 4147=5193 4153=5201 4159=5209 4161=5210 4163=5215 4164=5217 4165=5219 4166=5221 4168=5225 4172=5230 4181=5238 4183=5241 4189=5249 
//LineMap:4192=5253 4194=5256 4196=5257 4200=5264 4202=5267 4205=5272 4207=5275 4212=5281 4215=5282 4217=5286 4220=5290 4228=5299 4233=5305 4243=5318 4250=5326 4252=5329 4258=5337 4259=5339 4265=5346 4267=5349 4271=5356 4273=5361 4277=5368 4279=5372 4286=5380 4291=5386 
//LineMap:4296=5394 4299=5399 4305=5406 4306=5406 4315=5418 4317=5421 4325=5430 4328=5434 4331=5438 4335=5450 4341=5457 4342=5459 4345=5463 4352=5471 4354=5474 4359=5480 4361=5484 4364=5488 4371=5496 4372=5499 4373=5501 4374=5503 4375=5505 4383=5512 4385=5515 4392=5523 
//LineMap:4394=5526 4400=5533 4401=5535 4407=5542 4414=5548 4417=5552 4420=5552 4422=5557 4423=5559 4426=5563 4431=5569 4434=5573 4441=5581 4443=5584 4449=5591 4451=5595 4454=5599 4461=5607 4462=5611 4463=5618 4465=5621 4475=5630 4478=5634 4481=5634 4483=5639 4485=5642 
//LineMap:4487=5643 4495=5652 4502=5660 4504=5665 4507=5669 4513=5676 4514=5679 4518=5684 4524=5689 4530=5696 4537=5704 4539=5707 4540=5709 4541=5711 4544=5715 4552=5725 4554=5728 4555=5730 4557=5733 4558=5744 4560=5747 4565=5753 4569=5758 4578=5768 4582=5773 4584=5776 
//LineMap:4586=5779 4589=5783 4600=5795 4601=5797 4604=5802 4607=5806 4619=5819 4620=5821 4624=5827 4628=5832 4630=5835 4638=5844 4641=5848 4643=5851 4646=5855 4647=5858 4649=5861 4659=5872 4663=5877 4668=5883 4674=5890 4683=5898 4684=5900 4685=5902 4690=5908 4701=5920 
//LineMap:4706=5926 4714=5936 4715=5938 4718=5944 4719=5946 4724=5956 4725=5958 4727=5962 4731=5968 4735=5973 4739=5978 4741=5981 4746=5987 4749=5991 4751=5995 4754=5999 4756=6002 4757=6004 4761=6009 4763=6012 4765=6015 4769=6017 4771=6021 4773=6025 4775=6028 4779=6033 
//LineMap:4786=6039 4788=6042 4790=6045 4792=6048 4797=6054 4801=6056 4807=6058 4809=6061 4812=6061 4814=6066 4816=6069 4817=6071 4822=6077 4824=6081 4826=6085 4828=6088 4830=6091 4831=6093 4833=6096 4837=6101 4839=6105 4841=6109 4847=6116 4854=6122 4856=6125 4858=6128 
//LineMap:4860=6131 4865=6137 4869=6139 4875=6141 4877=6144 4880=6144 4882=6151 4884=6154 4887=6164 4888=6166 4894=6173 4896=6177 4902=6184 4909=6195 4915=6202 4918=6206 4924=6213 4925=6215 4929=6220 4930=6222 4932=6225 4936=6230 4938=6234 4940=6238 4946=6245 4953=6251 
//LineMap:4955=6254 4957=6257 4959=6260 4964=6266 4968=6268 4974=6270 4976=6273 4982=6278 4987=6284 4994=6296 5000=6303 5001=6305 5002=6307 5005=6311 5006=6313 5008=6316 5012=6321 5014=6325 5016=6329 5022=6336 5029=6342 5031=6345 5033=6348 5035=6351 5040=6357 5044=6359 
//LineMap:5050=6361 5052=6364 5055=6368 5057=6371 5059=6372 5061=6375 5062=6377 5066=6382 5068=6386 5070=6390 5073=6394 5074=6396 5076=6399 5079=6403 5084=6409 5085=6411 5087=6414 5091=6419 5093=6423 5095=6427 5101=6434 5108=6440 5110=6443 5112=6446 5114=6449 5119=6455 
//LineMap:5123=6457 5129=6459 5131=6462 5138=6472 5139=6474 5143=6479 5145=6483 5149=6488 5160=6500 5171=6510 5172=6512 5179=6520 5185=6672 5187=6687 5190=6691 5191=6693 5195=6698 5198=6723 5213=6739 5219=6746 5233=6761 5238=6764 5239=6766 5248=1180 5251=1186 5252=1850 
//LineMap:5253=4012 5255=5366 
//Start:resources\PopAnimResource
/**
 * @constructor
 */
GameFramework.resources.PopAnimCalcObjectPosData = function GameFramework_resources_PopAnimCalcObjectPosData() {
}
GameFramework.resources.PopAnimCalcObjectPosData.prototype = {
    mTransform : null,
    mColor : 0
}
GameFramework.resources.PopAnimCalcObjectPosData.staticInit = function GameFramework_resources_PopAnimCalcObjectPosData$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.PopAnimCalcObjectPosData.registerClass('GameFramework.resources.PopAnimCalcObjectPosData', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PopAnimCalcObjectPosData.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.PopAnimResource = function GameFramework_resources_PopAnimResource() {
    this.mTransform = new GameFramework.geom.Matrix();
    this.mOfsTab = Array.Create(3, 0, 0, 1, 2);
    this.mNextObjectPos = null;
    this.mZeroPt = new GameFramework.geom.TPoint(0, 0);
    GameFramework.resources.PopAnimResource.initializeBase(this);
    this.mMouseVisible = false;
}
GameFramework.resources.PopAnimResource.prototype = {
    mAnimRate : 0,
    mImageVector : null,
    mObjectNamePool : null,
    mMainSpriteInst : null,
    mMainAnimDef : null,
    mTransDirty : true,
    mBlendTicksTotal : 0,
    mBlendTicksCur : 0,
    mBlendDelay : 0,
    mAnimRunning : null,
    mPaused : null,
    mLastPlayedFrameLabel : null,
    mInterpolate : true,
    mTransform : null,
    mDrawScale : 1.0,
    mColor : 0xffffffff,
    mLoaded : false,
    mAdditive : false,
    mVersion : 0,
    mAnimSpeedScale : 1.0,
    mPIEffectIdSearchVector : null,
    mOfsTab : null,
    mNextObjectPos : null,
    mZeroPt : null,
    Duplicate : function GameFramework_resources_PopAnimResource$Duplicate() {
        var aPopAnimResource = new GameFramework.resources.PopAnimResource();
        aPopAnimResource.mX = this.mX;
        aPopAnimResource.mY = this.mY;
        aPopAnimResource.mWidth = this.mWidth;
        aPopAnimResource.mHeight = this.mHeight;
        aPopAnimResource.mAnimRate = this.mAnimRate;
        aPopAnimResource.mImageVector = this.mImageVector;
        aPopAnimResource.mObjectNamePool = this.mObjectNamePool;
        aPopAnimResource.mMainAnimDef = this.mMainAnimDef;
        aPopAnimResource.mDrawScale = this.mDrawScale;
        aPopAnimResource.mLoaded = this.mLoaded;
        aPopAnimResource.mMainSpriteInst = new GameFramework.resources.popanim.PopAnimSpriteInst();
        return aPopAnimResource;
    },
    Dispose : function GameFramework_resources_PopAnimResource$Dispose() {
        GameFramework.widgets.ClassicWidget.prototype.Dispose.apply(this);
        this.mMainSpriteInst.Dispose();
        this.mMainSpriteInst = null;
    },
    GetObjectInst : function GameFramework_resources_PopAnimResource$GetObjectInst(theName) {
        this.SetupSpriteInst('');
        return this.mMainSpriteInst.GetObjectInst(theName);
    },
    FrameHit : function GameFramework_resources_PopAnimResource$FrameHit(theSpriteInst, theFrame, theObjectPos) {
        theSpriteInst.mOnNewFrame = false;
        for(var anObjectPosIdx = 0; anObjectPosIdx < (theFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
            var anObjectPos = (theFrame.mFrameObjectPosVector[anObjectPosIdx]);
            if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
                var aSpriteInst = ((theSpriteInst.mChildren[anObjectPos.mData.mObjectNum])).mSpriteInst;
                if(aSpriteInst != null) {
                    for(var aPreload = 0; aPreload < anObjectPos.mData.mPreloadFrames; aPreload++) {
                        this.IncSpriteInstFrame(aSpriteInst, anObjectPos, ((1000.0 / GameFramework.BaseApp.mApp.mFrameTime) / theSpriteInst.mDef.mAnimRate));
                    }
                }
            }
        }
        if(theFrame.mCommandVector != null) {
            for(var aCmdNum = 0; aCmdNum < (theFrame.mCommandVector.length | 0); aCmdNum++) {
                var aCommand = (theFrame.mCommandVector[aCmdNum]);
                {
                    if(aCommand.mCommand.toLowerCase() == 'addparticleeffect') {
                        var aParams = aCommand.mParam;
                        GameFramework.Utils.Trace('addparticleeffect: ' + aParams);
                        var aParticleEffect = new GameFramework.resources.popanim.PopAnimParticleEffect();
                        aParticleEffect.mXOfs = 0;
                        aParticleEffect.mYOfs = 0;
                        aParticleEffect.mBehind = false;
                        aParticleEffect.mEffect = null;
                        aParticleEffect.mAttachEmitter = false;
                        aParticleEffect.mTransform = false;
                        aParticleEffect.mLastUpdated = this.mUpdateCnt;
                        var once = false;
                        var aFileName = '';
                        var firstParam = true;
                        while(aParams.length > 0) {
                            var aCurParam;
                            var aCommaPos = aParams.indexOf(String.fromCharCode(44));
                            if(aCommaPos == -1) {
                                aCurParam = aParams;
                            } else {
                                aCurParam = aParams.substr(0, aCommaPos);
                            }
                            aCurParam = aCurParam.trim();
                            if(firstParam) {
                                aParticleEffect.mName = aCurParam;
                                aFileName = aCurParam;
                                firstParam = false;
                            } else {
                                var aSpacePos;
                                while((aSpacePos = (aCurParam.indexOf(String.fromCharCode(32)) | 0)) != -1) {
                                    aCurParam = aCurParam.remove(aSpacePos);
                                }
                                var aLowerParam = aCurParam.toLowerCase();
                                if(aLowerParam.substr(0, 2) == 'x=') {
                                    aParticleEffect.mXOfs = GameFramework.Utils.ToFloat(aCurParam.substr(2));
                                } else if(aLowerParam.substr(0, 2) == 'y=') {
                                    aParticleEffect.mYOfs = GameFramework.Utils.ToFloat(aCurParam.substr(2));
                                } else if(aLowerParam == 'attachemitter') {
                                    aParticleEffect.mAttachEmitter = true;
                                } else if(aLowerParam == 'once') {
                                    once = true;
                                } else if(aLowerParam == 'behind') {
                                    aParticleEffect.mBehind = true;
                                } else if(aLowerParam == 'transform') {
                                    aParticleEffect.mTransform = true;
                                }
                            }
                            if(aCommaPos == -1) {
                                break;
                            }
                            aParams = aParams.substr(aCommaPos + 1);
                        }
                        if(once) {
                            if(theSpriteInst.mParticleEffectVector != null) {
                                for(var i = 0; i < (theSpriteInst.mParticleEffectVector.length | 0); i++) {
                                    var aCheckParticleEffect = theSpriteInst.mParticleEffectVector[i];
                                    if(aCheckParticleEffect.mName == aFileName) {
                                        return;
                                    }
                                }
                            }
                        }
                        if(this.mPIEffectIdSearchVector != null) {

                            {
                                var $srcArray1 = this.mPIEffectIdSearchVector;
                                for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
                                    var anIdSearch = $srcArray1[$enum1];
                                    aParticleEffect.mEffect = GameFramework.BaseApp.mApp.mResourceManager.GetPIEffectById(anIdSearch + aParticleEffect.mName.toUpperCase());
                                    if(aParticleEffect.mEffect == null) {
                                        break;
                                    }
                                    aParticleEffect.mEffect = aParticleEffect.mEffect.Duplicate();
                                }
                            }
                        }
                        if(aParticleEffect.mEffect != null) {
                            if(theSpriteInst.mParticleEffectVector == null) {
                                theSpriteInst.mParticleEffectVector = [];
                            }
                            theSpriteInst.mParticleEffectVector.push(aParticleEffect);
                        }
                    }
                }
            }
        }
    },
    DoFramesHit : function GameFramework_resources_PopAnimResource$DoFramesHit(theSpriteInst, theObjectPos) {
        var aCurFrame = (theSpriteInst.mDef.mFrames[(theSpriteInst.mFrameNum | 0)]);
        this.FrameHit(theSpriteInst, aCurFrame, theObjectPos);
        for(var anObjectPosIdx = 0; anObjectPosIdx < (aCurFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
            var anObjectPos = (aCurFrame.mFrameObjectPosVector[anObjectPosIdx]);
            if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
                var aSpriteInst = ((theSpriteInst.mChildren[anObjectPos.mData.mObjectNum])).mSpriteInst;
                if(aSpriteInst != null) {
                    this.DoFramesHit(aSpriteInst, anObjectPos);
                }
            }
        }
    },
    InitSpriteInst : function GameFramework_resources_PopAnimResource$InitSpriteInst(theSpriteInst, theSpriteDef) {
        theSpriteInst.mFrameRepeats = 0;
        theSpriteInst.mDelayFrames = 0;
        theSpriteInst.mDef = theSpriteDef;
        theSpriteInst.mLastUpdated = -1;
        theSpriteInst.mOnNewFrame = true;
        theSpriteInst.mFrameNum = 0;
        theSpriteInst.mChildren = [];
        if(theSpriteDef.mObjectDefVector != null) {
            for(var anObjectNum = 0; anObjectNum < (theSpriteDef.mObjectDefVector.length | 0); anObjectNum++) {
                var anObjectDef = (theSpriteDef.mObjectDefVector[anObjectNum]);
                var anObjectInst = new GameFramework.resources.popanim.PopAnimObjectInst();
                anObjectInst.mColorMult = 0xffffffff;
                anObjectInst.mName = anObjectDef.mName;
                anObjectInst.mIsBlending = false;
                var aChildSpriteDef = anObjectDef.mSpriteDef;
                if(aChildSpriteDef != null) {
                    var aChildSpriteInst = new GameFramework.resources.popanim.PopAnimSpriteInst();
                    aChildSpriteInst.mParent = theSpriteInst;
                    this.InitSpriteInst(aChildSpriteInst, aChildSpriteDef);
                    anObjectInst.mSpriteInst = aChildSpriteInst;
                }
                theSpriteInst.mChildren.push(anObjectInst);
            }
        }
        if(theSpriteInst == this.mMainSpriteInst) {
            this.GetToFirstFrame();
        }
    },
    SetupSpriteInst : function GameFramework_resources_PopAnimResource$SetupSpriteInst(theName) {
        if(this.mMainSpriteInst == null) {
            return false;
        }
        if((this.mMainSpriteInst.mDef != null) && (theName == null)) {
            return true;
        }
        if(this.mMainAnimDef.mMainSpriteDef != null) {
            this.InitSpriteInst(this.mMainSpriteInst, this.mMainAnimDef.mMainSpriteDef);
            return true;
        }
        if(this.mMainAnimDef.mSpriteDefVector.length == 0) {
            return false;
        }
        var aName = theName;
        if(aName == null) {
            aName = 'main';
        }
        var aWantDef = null;
        for(var i = 0; i < (this.mMainAnimDef.mSpriteDefVector.length | 0); i++) {
            var aPopAnimSpriteDef = (this.mMainAnimDef.mSpriteDefVector[i]);
            if((aPopAnimSpriteDef.mName != null) && (aPopAnimSpriteDef.mName == aName)) {
                aWantDef = aPopAnimSpriteDef;
            }
        }
        if(aWantDef == null) {
            aWantDef = (this.mMainAnimDef.mSpriteDefVector[0]);
        }
        if(aWantDef != this.mMainSpriteInst.mDef) {
            if(this.mMainSpriteInst.mDef != null) {
                this.mMainSpriteInst = new GameFramework.resources.popanim.PopAnimSpriteInst();
            }
            this.InitSpriteInst(this.mMainSpriteInst, aWantDef);
            this.mTransDirty = true;
        }
        return true;
    },
    DrawParticleEffects : function GameFramework_resources_PopAnimResource$DrawParticleEffects(g, theSpriteInst, theTransform, theColor, front) {
        if((theSpriteInst.mParticleEffectVector != null) && (theSpriteInst.mParticleEffectVector.length > 0)) {
            for(var i = 0; i < (theSpriteInst.mParticleEffectVector.length | 0); i++) {
                var aParticleEffect = theSpriteInst.mParticleEffectVector[i];
                if(aParticleEffect.mTransform) {
                    if(!aParticleEffect.mAttachEmitter) {
                        var aTransform = new GameFramework.geom.Matrix();
                        aTransform.translate(aParticleEffect.mEffect.mWidth / 2.0, aParticleEffect.mEffect.mHeight / 2.0);
                        var aNewTransform = theTransform.clone();
                        aNewTransform.concat(aTransform);
                        aParticleEffect.mEffect.mDrawTransform = aNewTransform;
                    } else {
                    }
                    aParticleEffect.mEffect.mColor = theColor;
                }
                if(aParticleEffect.mBehind == !front) {
                    aParticleEffect.mEffect.Draw(g);
                }
            }
        }
    },
    ResetAnimHelper : function GameFramework_resources_PopAnimResource$ResetAnimHelper(theSpriteInst) {
        theSpriteInst.mFrameNum = 0;
        theSpriteInst.mFrameRepeats = 0;
        theSpriteInst.mDelayFrames = 0;
        theSpriteInst.mLastUpdated = -1;
        theSpriteInst.mOnNewFrame = true;
        if(theSpriteInst.mParticleEffectVector != null) {
            for(var i = 0; i < (theSpriteInst.mParticleEffectVector.length | 0); i++) {
                var aParticleEffect = theSpriteInst.mParticleEffectVector[i];
                aParticleEffect.mEffect.ResetAnim();
            }
        }
        for(var aSpriteIdx = 0; aSpriteIdx < (theSpriteInst.mChildren.length | 0); aSpriteIdx++) {
            var aPopAnimObjectInst = (theSpriteInst.mChildren[aSpriteIdx]);
            var aSpriteInst = (aPopAnimObjectInst.mSpriteInst);
            if(aSpriteInst != null) {
                this.ResetAnimHelper(aSpriteInst);
            }
        }
        this.mTransDirty = true;
    },
    ResetAnim : function GameFramework_resources_PopAnimResource$ResetAnim() {
        this.ResetAnimHelper(this.mMainSpriteInst);
        this.mAnimRunning = false;
        this.GetToFirstFrame();
        this.mBlendTicksTotal = 0;
        this.mBlendTicksCur = 0;
        this.mBlendDelay = 0;
    },
    GetToFirstFrame : function GameFramework_resources_PopAnimResource$GetToFirstFrame() {
        while((this.mMainSpriteInst.mDef != null) && (this.mMainSpriteInst.mFrameNum < this.mMainSpriteInst.mDef.mWorkAreaStart)) {
            var wasAnimRunning = this.mAnimRunning;
            var wasPaused = this.mPaused;
            this.mAnimRunning = true;
            this.mPaused = false;
            this.Update();
            this.mAnimRunning = wasAnimRunning;
            this.mPaused = wasPaused;
        }
    },
    PlayFrom : function GameFramework_resources_PopAnimResource$PlayFrom(theFrameNum, resetAnim) {
        if(!this.SetupSpriteInst(null)) {
            return false;
        }
        if(theFrameNum >= (this.mMainSpriteInst.mDef.mFrames.length | 0)) {
            this.mAnimRunning = false;
            return false;
        }
        if((this.mMainSpriteInst.mFrameNum != theFrameNum) && (resetAnim)) {
            this.ResetAnim();
        }
        this.mPaused = false;
        this.mAnimRunning = true;
        this.mMainSpriteInst.mDelayFrames = 0;
        this.mMainSpriteInst.mFrameNum = theFrameNum;
        this.mMainSpriteInst.mFrameRepeats = 0;
        if(this.mBlendDelay == 0) {
            this.DoFramesHit(this.mMainSpriteInst, null);
        }
        return true;
    },
    Play : function GameFramework_resources_PopAnimResource$Play(theFrameLabel, resetAnim) {
        if(theFrameLabel === undefined) {
            theFrameLabel = '';
        }
        if(resetAnim === undefined) {
            resetAnim = true;
        }
        this.mAnimRunning = false;
        if(this.mMainAnimDef.mMainSpriteDef != null) {
            if(!this.SetupSpriteInst(null)) {
                return false;
            }
            var aFrameNum = this.mMainAnimDef.mMainSpriteDef.GetLabelFrame(theFrameLabel);
            if(aFrameNum == -1) {
                return false;
            } else {
                this.mLastPlayedFrameLabel = theFrameLabel;
                return this.PlayFrom(aFrameNum, resetAnim);
            }
        } else {
            this.SetupSpriteInst(theFrameLabel);
            return this.PlayFrom(this.mMainSpriteInst.mDef.mWorkAreaStart, resetAnim);
        }
    },
    LoadSpriteDef : function GameFramework_resources_PopAnimResource$LoadSpriteDef(theBuffer, theSpriteDef) {
        var aCurObjectMap = [];
        if(this.mVersion >= 4) {
            this.mObjectNamePool.push(theBuffer.ReadAsciiString());
            theSpriteDef.mName = (this.mObjectNamePool[this.mObjectNamePool.length - 1]);
            theSpriteDef.mAnimRate = theBuffer.ReadInt() / 0x10000;
        } else {
            theSpriteDef.mAnimRate = this.mAnimRate;
        }
        var aNumFrames = theBuffer.ReadShort();
        if(this.mVersion >= 5) {
            theSpriteDef.mWorkAreaStart = theBuffer.ReadShort();
            theSpriteDef.mWorkAreaDuration = theBuffer.ReadShort();
        } else {
            theSpriteDef.mWorkAreaStart = 0;
            theSpriteDef.mWorkAreaDuration = aNumFrames - 1;
        }
        theSpriteDef.mWorkAreaDuration = ((Math.min(theSpriteDef.mWorkAreaStart + theSpriteDef.mWorkAreaDuration, aNumFrames - 1) - theSpriteDef.mWorkAreaStart) | 0);
        theSpriteDef.mFrames = [];
        for(var aFrameNum = 0; aFrameNum < aNumFrames; aFrameNum++) {
            var aFrame = new GameFramework.resources.popanim.PopAnimFrame();
            var aPopAnimObjectPos;
            var aFrameFlags = theBuffer.ReadByte();
            if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_REMOVES) != 0) {
                var aNumRemoves = theBuffer.ReadByte();
                if(aNumRemoves == 0xff) {
                    aNumRemoves = theBuffer.ReadShort();
                }
                for(var aRemoveNum = 0; aRemoveNum < aNumRemoves; aRemoveNum++) {
                    var anObjectId = theBuffer.ReadShort();
                    if(anObjectId >= 0x7ff) {
                        anObjectId = theBuffer.ReadInt();
                    }
                    aCurObjectMap[anObjectId] = null;
                }
            }
            if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_ADDS) != 0) {
                var aNumAdds = theBuffer.ReadByte();
                if(aNumAdds == 0xff) {
                    aNumAdds = theBuffer.ReadShort();
                }
                for(var anAddNum = 0; anAddNum < aNumAdds; anAddNum++) {
                    aPopAnimObjectPos = new GameFramework.resources.popanim.PopAnimObjectPos();
                    aPopAnimObjectPos.mData = new GameFramework.resources.popanim.PopAnimObjectPosData();
                    var anObjectNumAndType = (theBuffer.ReadShort() | 0);
                    aPopAnimObjectPos.mColor = 0xffffffff;
                    aPopAnimObjectPos.mAnimFrameNum = 0;
                    aPopAnimObjectPos.mData.mObjectNum = (anObjectNumAndType & 0x7ff);
                    if(aPopAnimObjectPos.mData.mObjectNum == 0x7ff) {
                        aPopAnimObjectPos.mData.mObjectNum = theBuffer.ReadInt();
                    }
                    aPopAnimObjectPos.mData.mIsSprite = (anObjectNumAndType & 0x8000) != 0;
                    aPopAnimObjectPos.mData.mIsAdditive = (anObjectNumAndType & 0x4000) != 0;
                    aPopAnimObjectPos.mData.mResNum = theBuffer.ReadByte();
                    aPopAnimObjectPos.mData.mHasSrcRect = false;
                    aPopAnimObjectPos.mData.mTimeScale = 1.0;
                    aPopAnimObjectPos.mData.mName = null;
                    aPopAnimObjectPos.mTransform = new GameFramework.geom.Matrix();
                    if((anObjectNumAndType & 0x2000) != 0) {
                        aPopAnimObjectPos.mData.mPreloadFrames = theBuffer.ReadShort();
                    } else {
                        aPopAnimObjectPos.mData.mPreloadFrames = 0;
                    }
                    if((anObjectNumAndType & 0x1000) != 0) {
                        this.mMainAnimDef.mObjectNamePool.push(theBuffer.ReadAsciiString());
                        aPopAnimObjectPos.mData.mName = (this.mMainAnimDef.mObjectNamePool[this.mMainAnimDef.mObjectNamePool.length - 1]);
                    }
                    if((anObjectNumAndType & 0x800) != 0) {
                        aPopAnimObjectPos.mData.mTimeScale = theBuffer.ReadInt() / 0x10000;
                    }
                    if(theSpriteDef.mObjectDefVector == null) {
                        theSpriteDef.mObjectDefVector = [];
                    }
                    while(theSpriteDef.mObjectDefVector.length < aPopAnimObjectPos.mData.mObjectNum + 1) {
                        theSpriteDef.mObjectDefVector.push(null);
                    }
                    if((theSpriteDef.mObjectDefVector[aPopAnimObjectPos.mData.mObjectNum]) == null) {
                        theSpriteDef.mObjectDefVector[aPopAnimObjectPos.mData.mObjectNum] = new GameFramework.resources.popanim.PopAnimObjectDef();
                    }
                    ((theSpriteDef.mObjectDefVector[aPopAnimObjectPos.mData.mObjectNum])).mName = aPopAnimObjectPos.mData.mName;
                    if(aPopAnimObjectPos.mData.mIsSprite) {
                        ((theSpriteDef.mObjectDefVector[aPopAnimObjectPos.mData.mObjectNum])).mSpriteDef = (this.mMainAnimDef.mSpriteDefVector[aPopAnimObjectPos.mData.mResNum]);
                    }
                    while(aCurObjectMap.length <= aPopAnimObjectPos.mData.mObjectNum) {
                        aCurObjectMap.push(null);
                    }
                    aCurObjectMap[aPopAnimObjectPos.mData.mObjectNum] = aPopAnimObjectPos;
                }
            }
            if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_MOVES) != 0) {
                var aNumMoves = theBuffer.ReadByte();
                if(aNumMoves == 0xff) {
                    aNumMoves = theBuffer.ReadShort();
                }
                for(var aMoveNum = 0; aMoveNum < aNumMoves; aMoveNum++) {
                    var aFlagsAndObjectNum = (theBuffer.ReadShort() | 0);
                    var anObjectNum = aFlagsAndObjectNum & 0x3ff;
                    if(anObjectNum == 0x3ff) {
                        anObjectNum = theBuffer.ReadInt();
                    }
                    aPopAnimObjectPos = (aCurObjectMap[anObjectNum]);
                    aPopAnimObjectPos = aPopAnimObjectPos.Duplicate();
                    aCurObjectMap[anObjectNum] = aPopAnimObjectPos;
                    aPopAnimObjectPos.mTransform = new GameFramework.geom.Matrix();
                    if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_MATRIX) != 0) {
                        aPopAnimObjectPos.mTransform.a = theBuffer.ReadInt() / 65536.0;
                        aPopAnimObjectPos.mTransform.c = theBuffer.ReadInt() / 65536.0;
                        aPopAnimObjectPos.mTransform.b = theBuffer.ReadInt() / 65536.0;
                        aPopAnimObjectPos.mTransform.d = theBuffer.ReadInt() / 65536.0;
                    } else if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_ROTATE) != 0) {
                        var aRot = theBuffer.ReadShort() / 1000.0;
                        aPopAnimObjectPos.mTransform.identity();
                        aPopAnimObjectPos.mTransform.rotate(aRot);
                    }
                    var aMatrix = new GameFramework.geom.Matrix();
                    if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_LONGCOORDS) != 0) {
                        var i = theBuffer.ReadInt();
                        aMatrix.tx = i / 20.0;
                        aMatrix.ty = theBuffer.ReadInt() / 20.0;
                    } else {
                        aMatrix.tx = theBuffer.ReadShort() / 20.0;
                        aMatrix.ty = theBuffer.ReadShort() / 20.0;
                    }
                    aPopAnimObjectPos.mTransform.concat(aMatrix);
                    var hasSrcRect = (aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_SRCRECT) != 0;
                    if(hasSrcRect != aPopAnimObjectPos.mData.mHasSrcRect) {
                        aPopAnimObjectPos.mData.mHasSrcRect = hasSrcRect;
                        if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_SRCRECT) != 0) {
                            aPopAnimObjectPos.mData.mSrcX = ((theBuffer.ReadShort() / 20) | 0);
                            aPopAnimObjectPos.mData.mSrcY = ((theBuffer.ReadShort() / 20) | 0);
                            aPopAnimObjectPos.mData.mSrcWidth = ((theBuffer.ReadShort() / 20) | 0);
                            aPopAnimObjectPos.mData.mSrcHeight = ((theBuffer.ReadShort() / 20) | 0);
                        }
                    }
                    if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_COLOR) != 0) {
                        var aRed = theBuffer.ReadByte();
                        var aGreen = theBuffer.ReadByte();
                        var aBlue = theBuffer.ReadByte();
                        var anAlpha = theBuffer.ReadByte();
                        aPopAnimObjectPos.mColor = (anAlpha << 24) | (aRed << 16) | (aGreen << 8) | aBlue;
                    }
                    if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_ANIMFRAMENUM) != 0) {
                        aPopAnimObjectPos.mAnimFrameNum = theBuffer.ReadShort();
                    }
                }
            }
            if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_FRAME_NAME) != 0) {
                var aFrameName = theBuffer.ReadAsciiString();
                aFrameName = GameFramework.Utils.ToUpper(aFrameName);
                if(theSpriteDef.mLabels == null) {
                    theSpriteDef.mLabels = {};
                }
                theSpriteDef.mLabels[aFrameName] = aFrameNum;
            }
            if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_STOP) != 0) {
                aFrame.mHasStop = true;
            }
            if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_COMMANDS) != 0) {
                var aNumCmds = theBuffer.ReadByte();
                aFrame.mCommandVector = [];
                for(var aCmdNum = 0; aCmdNum < aNumCmds; aCmdNum++) {
                    var aPopAnimCommand = new GameFramework.resources.popanim.PopAnimCommand();
                    aPopAnimCommand.mCommand = theBuffer.ReadAsciiString();
                    aPopAnimCommand.mParam = theBuffer.ReadAsciiString();
                    aFrame.mCommandVector.push(aPopAnimCommand);
                }
            }
            aFrame.mFrameObjectPosVector = [];
            var aCurObjectNum = 0;

            {
                var $enum2 = ss.IEnumerator.getEnumerator(aCurObjectMap);
                while($enum2.moveNext()) {
                    var anObjectPos = $enum2.get_current();
                    if(anObjectPos != null) {
                        aFrame.mFrameObjectPosVector.push(anObjectPos);
                        if(anObjectPos.mData.mPreloadFrames != 0) {
                            anObjectPos.mData = anObjectPos.mData.Duplicate();
                            anObjectPos.mData.mPreloadFrames = 0;
                        }
                    } else {
                        aFrame.mFrameObjectPosVector.push(null);
                    }
                    ++aCurObjectNum;
                }
            }
            theSpriteDef.mFrames.push(aFrame);
        }
        if(aNumFrames == 0) {
            theSpriteDef.mFrames.push(new GameFramework.resources.popanim.PopAnimFrame());
        }
    },
    SerializeRead : function GameFramework_resources_PopAnimResource$SerializeRead(theBuffer, theParentStreamer) {
        this.mMainAnimDef = new GameFramework.resources.popanim.PopAnimDef();
        this.mMainSpriteInst = new GameFramework.resources.popanim.PopAnimSpriteInst();
        this.mObjectNamePool = [];
        var aMagic = (theBuffer.ReadInt() | 0);
        this.mVersion = theBuffer.ReadInt();
        this.mAnimRate = theBuffer.ReadByte();
        this.mX = theBuffer.ReadShort() / 20.0;
        this.mY = theBuffer.ReadShort() / 20.0;
        this.mWidth = (theBuffer.ReadShort() | 0) / 20.0;
        this.mHeight = (theBuffer.ReadShort() | 0) / 20.0;
        this.mImageVector = [];
        var aNumImages = theBuffer.ReadShort();
        for(var anImageNum = 0; anImageNum < aNumImages; anImageNum++) {
            var anImage = new GameFramework.resources.popanim.PopAnimImage();
            var anOrigName = theBuffer.ReadAsciiString();
            anImage.mImageName = anOrigName;
            anImage.mCols = 1;
            anImage.mRows = 1;
            anImage.mOrigWidth = theBuffer.ReadShort();
            anImage.mOrigHeight = theBuffer.ReadShort();
            anImage.mTransform = new GameFramework.geom.Matrix();
            anImage.mTransform.a = theBuffer.ReadInt() / (65536.0 * 20.0);
            anImage.mTransform.b = theBuffer.ReadInt() / (65536.0 * 20.0);
            anImage.mTransform.c = theBuffer.ReadInt() / (65536.0 * 20.0);
            anImage.mTransform.d = theBuffer.ReadInt() / (65536.0 * 20.0);
            anImage.mTransform.tx = theBuffer.ReadShort() / 20.0;
            anImage.mTransform.ty = theBuffer.ReadShort() / 20.0;
            if((Math.abs(anImage.mTransform.a - 1.0) < 0.005) && (anImage.mTransform.b == 0.0) && (anImage.mTransform.c == 0.0) && (Math.abs(anImage.mTransform.d - 1.0) < 0.005) && (anImage.mTransform.tx == 0.0) && (anImage.mTransform.ty == 0.0)) {
                anImage.mTransform = null;
            }
            var aBarPos = anOrigName.indexOf(String.fromCharCode(124));
            if(aBarPos != -1) {
                var anId = anOrigName.substr(aBarPos + 1);
                anImage.mImageNames.push(anId);
                var aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImage(anId);
                aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(anImage, anImage.ImageLoaded));
                aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildCompleted));
                aResourceStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildFailed));
                theParentStreamer.mResourceCount++;
                GameFramework.BaseApp.mApp.mResourceManager.PrioritizeResourceStreamer(aResourceStreamer);
            } else {
                anImage.mImageNames.push(anOrigName);
            }
            this.mImageVector.push(anImage);
        }
        this.mMainAnimDef.mSpriteDefVector = [];
        var aNumSprites = theBuffer.ReadShort();
        var aSpriteIdx;
        for(aSpriteIdx = 0; aSpriteIdx < aNumSprites; aSpriteIdx++) {
            var aPopAnimSpriteDef = new GameFramework.resources.popanim.PopAnimSpriteDef();
            this.mMainAnimDef.mSpriteDefVector[aSpriteIdx] = aPopAnimSpriteDef;
        }
        for(aSpriteIdx = 0; aSpriteIdx < aNumSprites; aSpriteIdx++) {
            this.LoadSpriteDef(theBuffer, (this.mMainAnimDef.mSpriteDefVector[aSpriteIdx]));
        }
        var hasMainSpriteDef = theBuffer.ReadBoolean();
        if(hasMainSpriteDef) {
            this.mMainAnimDef.mMainSpriteDef = new GameFramework.resources.popanim.PopAnimSpriteDef();
            this.LoadSpriteDef(theBuffer, this.mMainAnimDef.mMainSpriteDef);
        }
        this.mLoaded = true;
    },
    UpdateParticles : function GameFramework_resources_PopAnimResource$UpdateParticles(theSpriteInst, theObjectPos) {
        if(theSpriteInst == null) {
            return;
        }
        if(theSpriteInst.mParticleEffectVector != null) {
            for(var i = 0; i < theSpriteInst.mParticleEffectVector.length; i++) {
                var aParticleEffect = theSpriteInst.mParticleEffectVector[i];
                var aVec = null;
                if(!aParticleEffect.mAttachEmitter) {
                    aVec = theSpriteInst.mCurTransform.transformPoint(new GameFramework.geom.TPoint(aParticleEffect.mXOfs, aParticleEffect.mYOfs));
                }
                aParticleEffect.mEffect.mDrawTransform.identity();
                if(aVec != null) {
                    aParticleEffect.mEffect.mDrawTransform.translate(aVec.x, aVec.y);
                }
                aParticleEffect.mEffect.mDrawTransform.scale(this.mDrawScale, this.mDrawScale);
                if((aParticleEffect.mTransform) && (theObjectPos != null)) {
                    aParticleEffect.mEffect.mAnimSpeed = 1.0 / theObjectPos.mData.mTimeScale;
                }
                aParticleEffect.mEffect.Update();
                aParticleEffect.mLastUpdated = this.mUpdateCnt;
                if(!aParticleEffect.mEffect.IsActive()) {
                    theSpriteInst.mParticleEffectVector.removeAt(i);
                    i--;
                }
            }
        }
        var aFrame = theSpriteInst.mDef.mFrames[(theSpriteInst.mFrameNum | 0)];
        for(var anObjectPosIdx = 0; anObjectPosIdx < (aFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
            var anObjectPos = aFrame.mFrameObjectPosVector[anObjectPosIdx];
            if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
                var aChildSpriteInst = theSpriteInst.mChildren[anObjectPos.mData.mObjectNum].mSpriteInst;
                this.UpdateParticles(aChildSpriteInst, anObjectPos);
            }
        }
    },
    CleanParticles : function GameFramework_resources_PopAnimResource$CleanParticles(theSpriteInst, force) {
        if(force === undefined) {
            force = false;
        }
        if(theSpriteInst == null) {
            return;
        }
        if(theSpriteInst.mParticleEffectVector != null) {
            for(var i = 0; i < (theSpriteInst.mParticleEffectVector.length | 0); i++) {
                var aParticleEffect = theSpriteInst.mParticleEffectVector[i];
                if((aParticleEffect.mLastUpdated != this.mUpdateCnt) || (force)) {
                    theSpriteInst.mParticleEffectVector.removeAt(i);
                    i--;
                }
            }
        }
        for(var i_2 = 0; i_2 < (theSpriteInst.mChildren.length | 0); i_2++) {
            var aChildSpriteInst = theSpriteInst.mChildren[i_2].mSpriteInst;
            if(aChildSpriteInst != null) {
                this.CleanParticles(aChildSpriteInst, force);
            }
        }
    },
    HasParticles : function GameFramework_resources_PopAnimResource$HasParticles(theSpriteInst) {
        if(theSpriteInst == null) {
            return false;
        }
        if(theSpriteInst.mParticleEffectVector == null) {
            return false;
        }
        if(theSpriteInst.mParticleEffectVector.length != 0) {
            return true;
        }
        for(var i = 0; i < (theSpriteInst.mChildren.length | 0); i++) {
            var aChildSpriteInst = theSpriteInst.mChildren[i].mSpriteInst;
            if(aChildSpriteInst != null) {
                if(this.HasParticles(aChildSpriteInst)) {
                    return true;
                }
            }
        }
        return false;
    },
    IsActive : function GameFramework_resources_PopAnimResource$IsActive() {
        if(this.mAnimRunning) {
            return true;
        }
        if(this.HasParticles(this.mMainSpriteInst)) {
            return true;
        }
        return false;
    },
    CalcObjectPos : function GameFramework_resources_PopAnimResource$CalcObjectPos(theSpriteInst, theObjectPosIdx, frozen, thePopAnimCalcObjectPosData) {
        if(this.mNextObjectPos == null) {
            this.mNextObjectPos = Array.Create(3, null, null, null, null);
        } else {
            this.mNextObjectPos[0] = null;
            this.mNextObjectPos[1] = null;
            this.mNextObjectPos[2] = null;
        }
        var iFrameNum = (theSpriteInst.mFrameNum | 0);
        var aFrame = theSpriteInst.mDef.mFrames[iFrameNum];
        var anObjectPos = (aFrame.mFrameObjectPosVector[theObjectPosIdx]);
        var anObjectInst = (theSpriteInst.mChildren[anObjectPos.mData.mObjectNum]);
        this.mOfsTab[0] = theSpriteInst.mDef.mFrames.length - 1;
        if((theSpriteInst == this.mMainSpriteInst) && (theSpriteInst.mFrameNum >= theSpriteInst.mDef.mWorkAreaStart)) {
            this.mOfsTab[0] = theSpriteInst.mDef.mWorkAreaDuration - 1;
        }
        var aCurTransform;
        var aCurColor;
        if((this.mInterpolate) && (!frozen)) {
            for(var anOfsIdx = 0; anOfsIdx < 3; anOfsIdx++) {
                var aNextFrame = theSpriteInst.mDef.mFrames[(iFrameNum + this.mOfsTab[anOfsIdx]) % theSpriteInst.mDef.mFrames.length];
                if((theSpriteInst == this.mMainSpriteInst) && (theSpriteInst.mFrameNum >= theSpriteInst.mDef.mWorkAreaStart)) {
                    aNextFrame = theSpriteInst.mDef.mFrames[(iFrameNum + this.mOfsTab[anOfsIdx] - theSpriteInst.mDef.mWorkAreaStart) % (theSpriteInst.mDef.mWorkAreaDuration + 1) + theSpriteInst.mDef.mWorkAreaStart];
                } else {
                    aNextFrame = theSpriteInst.mDef.mFrames[(iFrameNum + this.mOfsTab[anOfsIdx]) % theSpriteInst.mDef.mFrames.length];
                }
                if(aFrame.mHasStop) {
                    aNextFrame = aFrame;
                }
                if((aNextFrame.mFrameObjectPosVector.length | 0) > theObjectPosIdx) {
                    this.mNextObjectPos[anOfsIdx] = aNextFrame.mFrameObjectPosVector[theObjectPosIdx];
                    if((this.mNextObjectPos[anOfsIdx] == null) || (this.mNextObjectPos[anOfsIdx].mData.mObjectNum != anObjectPos.mData.mObjectNum)) {
                        this.mNextObjectPos[anOfsIdx] = null;
                    }
                }
                if(this.mNextObjectPos[anOfsIdx] == null) {
                    for(var aCheckObjectPosIdx = 0; aCheckObjectPosIdx < (aNextFrame.mFrameObjectPosVector.length | 0); aCheckObjectPosIdx++) {
                        if((aNextFrame.mFrameObjectPosVector[aCheckObjectPosIdx] != null) && ((aNextFrame.mFrameObjectPosVector[aCheckObjectPosIdx])).mData.mObjectNum == anObjectPos.mData.mObjectNum) {
                            this.mNextObjectPos[anOfsIdx] = aNextFrame.mFrameObjectPosVector[aCheckObjectPosIdx];
                            break;
                        }
                    }
                }
            }
            if((this.mNextObjectPos[1] != null) && ((anObjectPos.mTransform != this.mNextObjectPos[1].mTransform) || (anObjectPos.mColor != this.mNextObjectPos[1].mColor))) {
                var anInterp = theSpriteInst.mFrameNum - (theSpriteInst.mFrameNum | 0);
                var aCur = anObjectPos.mTransform.transformPoint(this.mZeroPt);
                var aNext = this.mNextObjectPos[1].mTransform.transformPoint(this.mZeroPt);
                aCurTransform = GameFramework.Utils.LerpMatrix(anObjectPos.mTransform, this.mNextObjectPos[1].mTransform, anInterp);
                if(anObjectPos.mColor != this.mNextObjectPos[1].mColor) {
                    aCurColor = GameFramework.Utils.LerpColor(anObjectPos.mColor, this.mNextObjectPos[1].mColor, anInterp);
                } else {
                    aCurColor = anObjectPos.mColor;
                }
            } else {
                aCurTransform = anObjectPos.mTransform;
                aCurColor = anObjectPos.mColor;
            }
        } else {
            aCurTransform = anObjectPos.mTransform;
            aCurColor = anObjectPos.mColor;
        }
        var aMatrix = (anObjectInst.mTransform != null) ? anObjectInst.mTransform.clone() : new GameFramework.geom.Matrix();
        aMatrix.concat(aCurTransform);
        aCurTransform = aMatrix;
        if((anObjectInst.mIsBlending) && (this.mBlendTicksTotal != 0) && (theSpriteInst == this.mMainSpriteInst)) {
            var aBlendInterp = this.mBlendTicksCur / this.mBlendTicksTotal;
            aCurTransform = GameFramework.Utils.LerpMatrix(anObjectInst.mBlendSrcTransform, aCurTransform, aBlendInterp);
            aCurColor = GameFramework.Utils.LerpColor(anObjectInst.mBlendSrcColor, aCurColor, aBlendInterp);
        }
        thePopAnimCalcObjectPosData.mTransform = aCurTransform;
        thePopAnimCalcObjectPosData.mColor = aCurColor;
    },
    UpdateTransforms : function GameFramework_resources_PopAnimResource$UpdateTransforms(theSpriteInst, theTransform, theColor, parentFrozen) {
        if(theTransform != null) {
            theSpriteInst.mCurTransform = theTransform;
        } else {
            theSpriteInst.mCurTransform = this.mTransform;
        }
        theSpriteInst.mCurColor = theColor;
        var aFrame = theSpriteInst.mDef.mFrames[(theSpriteInst.mFrameNum | 0)];
        var aPopAnimCalcObjectPosData = new GameFramework.resources.PopAnimCalcObjectPosData();
        var aCurTransform;
        var aCurColor;
        var frozen = parentFrozen || (theSpriteInst.mDelayFrames > 0) || (aFrame.mHasStop);
        for(var anObjectPosIdx = 0; anObjectPosIdx < (aFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
            var anObjectPos = aFrame.mFrameObjectPosVector[anObjectPosIdx];
            if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
                this.CalcObjectPos(theSpriteInst, anObjectPosIdx, frozen, aPopAnimCalcObjectPosData);
                aCurTransform = aPopAnimCalcObjectPosData.mTransform;
                aCurColor = aPopAnimCalcObjectPosData.mColor;
                if(theTransform != null) {
                    aCurTransform.concat(theTransform);
                }
                this.UpdateTransforms(theSpriteInst.mChildren[anObjectPos.mData.mObjectNum].mSpriteInst, aCurTransform, aCurColor, frozen);
            }
        }
        if(theSpriteInst.mParticleEffectVector != null) {
            for(var i = 0; i < (theSpriteInst.mParticleEffectVector.length | 0); i++) {
                var aParticleEffect = theSpriteInst.mParticleEffectVector[i];
                if(aParticleEffect.mAttachEmitter) {
                    if(aParticleEffect.mTransform) {
                        aParticleEffect.mEffect.mEmitterTransform.identity();
                        aParticleEffect.mEffect.mEmitterTransform.translate(aParticleEffect.mEffect.mWidth / 2.0, aParticleEffect.mEffect.mHeight / 2.0);
                        aParticleEffect.mEffect.mEmitterTransform.concat(theSpriteInst.mCurTransform);
                    }
                }
            }
        }
    },
    IncSpriteInstFrame : function GameFramework_resources_PopAnimResource$IncSpriteInstFrame(theSpriteInst, theObjectPos, theFrac) {
        var aLastFrameNum = (theSpriteInst.mFrameNum | 0);
        var aLastFrame = theSpriteInst.mDef.mFrames[aLastFrameNum];
        if(aLastFrame.mHasStop) {
            return;
        }
        var aTimeScale = (theObjectPos != null) ? theObjectPos.mData.mTimeScale : 1.0;
        theSpriteInst.mFrameNum += theFrac * (theSpriteInst.mDef.mAnimRate / (1000.0 / GameFramework.BaseApp.mApp.mFrameTime)) / aTimeScale;
        if(theSpriteInst == this.mMainSpriteInst) {
            if(!theSpriteInst.mDef.mFrames[theSpriteInst.mDef.mFrames.length - 1].mHasStop) {
                if((theSpriteInst.mFrameNum | 0) >= theSpriteInst.mDef.mWorkAreaStart + theSpriteInst.mDef.mWorkAreaDuration + 1) {
                    theSpriteInst.mFrameRepeats++;
                    theSpriteInst.mFrameNum -= theSpriteInst.mDef.mWorkAreaDuration + 1;
                }
            } else {
                if((theSpriteInst.mFrameNum | 0) >= theSpriteInst.mDef.mWorkAreaStart + theSpriteInst.mDef.mWorkAreaDuration) {
                    theSpriteInst.mOnNewFrame = true;
                    theSpriteInst.mFrameNum = (theSpriteInst.mDef.mWorkAreaStart + theSpriteInst.mDef.mWorkAreaDuration);
                    if(theSpriteInst.mDef.mWorkAreaDuration != 0) {
                        this.mAnimRunning = false;
                        var anEvent = new GameFramework.resources.popanim.PopAnimEvent(GameFramework.resources.popanim.PopAnimEvent.STOPPED);
                        this.DispatchEvent(anEvent);
                        return;
                    } else {
                        theSpriteInst.mFrameRepeats++;
                    }
                }
            }
        } else if((theSpriteInst.mFrameNum | 0) >= theSpriteInst.mDef.mFrames.length) {
            theSpriteInst.mFrameRepeats++;
            theSpriteInst.mFrameNum -= theSpriteInst.mDef.mFrames.length;
        }
        theSpriteInst.mOnNewFrame = (theSpriteInst.mFrameNum | 0) != aLastFrameNum;
        if((theSpriteInst.mOnNewFrame) && (theSpriteInst.mDelayFrames > 0)) {
            theSpriteInst.mOnNewFrame = false;
            theSpriteInst.mFrameNum = aLastFrameNum;
            theSpriteInst.mDelayFrames--;
            return;
        }
        for(var anObjectPosIdx = 0; anObjectPosIdx < (aLastFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
            var anObjectPos = aLastFrame.mFrameObjectPosVector[anObjectPosIdx];
            if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
                var aSpriteInst = theSpriteInst.mChildren[anObjectPos.mData.mObjectNum].mSpriteInst;
                this.IncSpriteInstFrame(aSpriteInst, anObjectPos, theFrac / aTimeScale);
            }
        }
    },
    PrepSpriteInstFrame : function GameFramework_resources_PopAnimResource$PrepSpriteInstFrame(theSpriteInst, theObjectPos) {
        var aCurFrame = (theSpriteInst.mDef.mFrames[(theSpriteInst.mFrameNum | 0)]);
        if(theSpriteInst.mOnNewFrame) {
            this.FrameHit(theSpriteInst, aCurFrame, theObjectPos);
        }
        if(aCurFrame.mHasStop) {
            if(theSpriteInst == this.mMainSpriteInst) {
                this.mAnimRunning = false;
            }
            return;
        }
        for(var anObjectPosIdx = 0; anObjectPosIdx < (aCurFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
            var anObjectPos = (aCurFrame.mFrameObjectPosVector[anObjectPosIdx]);
            if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
                var aSpriteInst = ((theSpriteInst.mChildren[anObjectPos.mData.mObjectNum])).mSpriteInst;
                if(aSpriteInst != null) {
                    var aPhysFrameNum = (theSpriteInst.mFrameNum | 0) + theSpriteInst.mFrameRepeats * (theSpriteInst.mDef.mFrames.length | 0);
                    var aPhysLastFrameNum = aPhysFrameNum - 1;
                    if((aSpriteInst.mLastUpdated != aPhysLastFrameNum) && (aSpriteInst.mLastUpdated != aPhysFrameNum)) {
                        aSpriteInst.mFrameNum = 0;
                        aSpriteInst.mFrameRepeats = 0;
                        aSpriteInst.mDelayFrames = 0;
                        aSpriteInst.mOnNewFrame = true;
                    }
                    this.PrepSpriteInstFrame(aSpriteInst, anObjectPos);
                    aSpriteInst.mLastUpdated = aPhysFrameNum;
                }
            }
        }
    },
    AnimUpdate : function GameFramework_resources_PopAnimResource$AnimUpdate(theFrac) {
        if(!this.mAnimRunning) {
            return;
        }
        if(this.mBlendTicksTotal > 0) {
            this.mBlendTicksCur += theFrac;
            if(this.mBlendTicksCur >= this.mBlendTicksTotal) {
                this.mBlendTicksTotal = 0;
            }
        }
        this.mTransDirty = true;
        if(this.mBlendDelay > 0) {
            this.mBlendDelay -= theFrac;
            if(this.mBlendDelay <= 0) {
                this.mBlendDelay = 0;
                this.DoFramesHit(this.mMainSpriteInst, null);
            }
            return;
        } else {
            this.IncSpriteInstFrame(this.mMainSpriteInst, null, theFrac);
        }
        this.PrepSpriteInstFrame(this.mMainSpriteInst, null);
    },
    DrawSprite : function GameFramework_resources_PopAnimResource$DrawSprite(g, theSpriteInst, theTransform, theColor, additive, parentFrozen) {
        this.DrawParticleEffects(g, theSpriteInst, theTransform, theColor, false);
        var aFrame = theSpriteInst.mDef.mFrames[(theSpriteInst.mFrameNum | 0)];
        var aCurTransform;
        var aCurColor;
        var aChildSpriteInst;
        var aPopAnimCalcObjectPosData = new GameFramework.resources.PopAnimCalcObjectPosData();
        var frozen = parentFrozen || (theSpriteInst.mDelayFrames > 0) || (aFrame.mHasStop);
        for(var anObjectPosIdx = 0; anObjectPosIdx < (aFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
            var anObjectPos = aFrame.mFrameObjectPosVector[anObjectPosIdx];
            if(anObjectPos == null) {
                continue;
            }
            var anObjectInst = theSpriteInst.mChildren[anObjectPos.mData.mObjectNum];
            if(anObjectPos.mData.mIsSprite) {
                aChildSpriteInst = theSpriteInst.mChildren[anObjectPos.mData.mObjectNum].mSpriteInst;
                aCurColor = aChildSpriteInst.mCurColor;
                aCurTransform = aChildSpriteInst.mCurTransform;
            } else {
                this.CalcObjectPos(theSpriteInst, anObjectPosIdx, frozen, aPopAnimCalcObjectPosData);
                aCurTransform = aPopAnimCalcObjectPosData.mTransform;
                aCurColor = aPopAnimCalcObjectPosData.mColor;
            }
            if(anObjectInst.mPredrawCallback != null) {
                aCurColor = anObjectInst.mPredrawCallback.invoke(g, theSpriteInst, anObjectInst, theTransform, aCurColor);
            }
            var aNewTransform;
            if((theTransform == null) && (this.mDrawScale != 1.0)) {
                var aTrans = this.mTransform.clone();
                aTrans.scale(this.mDrawScale, this.mDrawScale);
                aNewTransform = aCurTransform.clone();
                aNewTransform.concat(aTrans);
            } else if((theTransform == null) || (anObjectPos.mData.mIsSprite)) {
                aNewTransform = aCurTransform;
                if(this.mDrawScale != 1.0) {
                    var aDrawScaleTrans = aNewTransform.clone();
                    aDrawScaleTrans.scale(this.mDrawScale, this.mDrawScale);
                    aNewTransform.concat(aDrawScaleTrans);
                }
                aNewTransform.concat(this.mTransform);
            } else {
                aNewTransform = aCurTransform.clone();
                aNewTransform.concat(theTransform);
            }
            var aNewColor = GameFramework.gfx.Color.Mult(GameFramework.gfx.Color.Mult(aCurColor, theColor), anObjectInst.mColorMult);
            if((aNewColor & 0xff000000) == 0) {
                continue;
            }
            if(anObjectPos.mData.mIsSprite) {
                aChildSpriteInst = theSpriteInst.mChildren[anObjectPos.mData.mObjectNum].mSpriteInst;
                this.DrawSprite(g, aChildSpriteInst, aNewTransform, aNewColor, anObjectPos.mData.mIsAdditive || additive, frozen);
            } else {
                for(var anImageDrawCount = 0; true; anImageDrawCount++) {
                    var anImage = (this.mImageVector[anObjectPos.mData.mResNum]);
                    var anImageTransform;
                    if(anImage.mTransform != null) {
                        anImageTransform = anImage.mTransform.clone();
                        anImageTransform.concat(aNewTransform);
                    } else {
                        anImageTransform = aNewTransform;
                    }
                    if(aNewColor != 0xffffffff) {
                        g.PushColor(aNewColor);
                    }
                    var aDrawImage;
                    var aDrawFrame;
                    g.PushMatrix(anImageTransform);
                    if((anObjectPos.mAnimFrameNum == 0) || (anImage.mImages.length == 1)) {
                        aDrawImage = (anImage.mImages[0]);
                        aDrawFrame = anObjectPos.mAnimFrameNum;
                    } else {
                        aDrawImage = (anImage.mImages[anObjectPos.mAnimFrameNum]);
                        aDrawFrame = 0;
                    }
                    aDrawImage.mAdditive = (anObjectPos.mData.mIsAdditive) || (anImage.mDrawMode == 1);
                    g.DrawImageCel(aDrawImage, 0, 0, aDrawFrame);
                    g.PopMatrix();
                    if(aNewColor != 0xffffffff) {
                        g.PopColor();
                    }
                    break;
                }
            }
        }
        this.DrawParticleEffects(g, theSpriteInst, theTransform, theColor, true);
    },
    Draw : function GameFramework_resources_PopAnimResource$Draw(g) {
        if(!this.mLoaded) {
            return;
        }
        if(!this.SetupSpriteInst(null)) {
            return;
        }
        if(this.mTransDirty) {
            this.UpdateTransforms(this.mMainSpriteInst, null, this.mColor, false);
            this.mTransDirty = false;
        }
        this.DrawSprite(g, this.mMainSpriteInst, null, this.mColor, this.mAdditive, false);
    },
    UpdateF : function GameFramework_resources_PopAnimResource$UpdateF(theFrac) {
        if(this.mPaused) {
            return;
        }
        this.AnimUpdate(theFrac);
    },
    Update : function GameFramework_resources_PopAnimResource$Update() {
        if(!this.mLoaded) {
            return;
        }
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
        if(!this.SetupSpriteInst(null)) {
            return;
        }
        this.UpdateF(this.mAnimSpeedScale);
        this.UpdateTransforms(this.mMainSpriteInst, null, this.mColor, false);
        this.mTransDirty = false;
        if(!this.mPaused) {
            this.UpdateParticles(this.mMainSpriteInst, null);
            this.CleanParticles(this.mMainSpriteInst);
        }
    }
}
GameFramework.resources.PopAnimResource.staticInit = function GameFramework_resources_PopAnimResource$staticInit() {
    GameFramework.resources.PopAnimResource.POPANIM_MAGIC = 0xbaf01954;
    GameFramework.resources.PopAnimResource.POPANIM_VERSION = 5;
    GameFramework.resources.PopAnimResource.POPANIM_STATE_VERSION = 1;
    GameFramework.resources.PopAnimResource.PI = 3.14159;
    GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_REMOVES = 0x1;
    GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_ADDS = 0x2;
    GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_MOVES = 0x4;
    GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_FRAME_NAME = 0x8;
    GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_STOP = 0x10;
    GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_COMMANDS = 0x20;
    GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_SRCRECT = 0x8000;
    GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_ROTATE = 0x4000;
    GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_COLOR = 0x2000;
    GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_MATRIX = 0x1000;
    GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_LONGCOORDS = 0x800;
    GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_ANIMFRAMENUM = 0x400;
}

JS_AddInitFunc(function() {
    GameFramework.resources.PopAnimResource.registerClass('GameFramework.resources.PopAnimResource', GameFramework.widgets.ClassicWidget);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.PopAnimResource.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\PopAnimResource.cs
//LineMap:2=3 19=17 22=64 24=54 25=1057 29=65 38=46 58=68 78=89 91=103 104=117 109=124 110=189 113=193 114=195 122=204 123=206 124=208 134=219 143=227 146=231 147=233 149=236 150=236 151=238 152=238 153=240 154=240 155=242 156=242 157=244 159=247 163=252 175=265 179=267 
//LineMap:183=269 190=318 192=339 206=355 226=376 227=378 233=385 236=389 244=398 247=402 255=411 257=414 262=420 264=423 267=427 276=437 280=442 282=445 285=449 295=460 301=468 306=479 309=484 311=487 324=501 332=510 339=518 345=525 347=528 361=544 370=554 375=560 377=563 
//LineMap:382=570 384=574 389=577 390=577 391=579 392=581 396=586 399=590 401=591 408=597 416=606 425=614 427=617 436=625 439=629 441=632 445=637 446=639 451=645 459=654 464=660 468=665 492=690 496=696 498=699 501=703 506=711 511=717 517=726 521=731 528=736 530=741 534=746 
//LineMap:544=755 547=759 548=761 549=763 560=775 568=785 572=790 576=797 580=802 582=805 585=810 594=825 598=827 602=829 613=839 619=846 627=855 628=857 630=860 635=866 640=872 642=877 644=880 646=883 653=891 655=895 657=898 662=904 664=907 666=910 671=914 672=916 674=919 
//LineMap:682=928 684=931 690=938 697=946 702=952 705=956 708=966 709=968 711=971 713=974 720=982 734=994 735=996 737=999 739=1002 749=1013 752=1017 761=1027 763=1031 765=1034 768=1038 772=1043 779=1051 781=1054 784=1061 788=1066 790=1067 794=1072 795=1074 798=1078 801=1082 
//LineMap:803=1085 808=1091 812=1096 814=1099 820=1107 832=1120 835=1125 837=1160 846=1168 853=1174 856=1178 859=1182 865=1189 876=1201 878=1204 880=1207 884=1212 889=1218 891=1221 894=1225 903=1235 908=1245 916=1259 922=1266 924=1269 926=1275 937=1285 944=1296 950=1301 
//LineMap:954=1301 956=1307 959=1311 967=1321 970=1325 981=1337 983=1340 989=1351 991=1355 994=1359 997=1363 1001=1368 1003=1371 1008=1377 1019=1389 1025=1396 1026=1398 1038=1409 1044=1416 1045=1418 1046=1420 1050=1425 1056=1432 1057=1438 1066=1446 1070=1451 1072=1454 
//LineMap:1077=1460 1080=1461 1082=1465 1083=1467 1089=1474 1091=1477 1093=1478 1096=1482 1097=1484 1099=1487 1107=1494 1109=1497 1110=1499 1118=1506 1119=1508 1121=1511 1123=1514 1132=1522 1136=1527 1138=1530 1140=1534 1144=1542 1147=1548 1151=1553 1153=1556 1158=1565 
//LineMap:1165=1573 1172=1581 1173=1583 1175=1586 1176=1588 1178=1591 1187=19 1191=24 1197=31 
//Start:resources\RenderEffect
/**
 * @constructor
 */
GameFramework.resources.RenderEffectPass = function GameFramework_resources_RenderEffectPass(theRenderEffectHandle, thePassNum) {
    this.mRenderEffectHandle = theRenderEffectHandle;
    this.mPassNum = thePassNum;
}
GameFramework.resources.RenderEffectPass.prototype = {
    mRenderEffectHandle : null,
    mPassNum : 0,
    Dispose : function GameFramework_resources_RenderEffectPass$Dispose() {
        this.mRenderEffectHandle.EndPass(this.mPassNum);
    }
}
GameFramework.resources.RenderEffectPass.staticInit = function GameFramework_resources_RenderEffectPass$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.RenderEffectPass.registerClass('GameFramework.resources.RenderEffectPass', null, System.IDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.RenderEffectPass.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.RenderEffectRunHandle = function GameFramework_resources_RenderEffectRunHandle(theRenderEffect) {
    this.mRenderEffect = theRenderEffect;
}
GameFramework.resources.RenderEffectRunHandle.prototype = {
    mRenderEffect : null,
    get_NumPasses : function GameFramework_resources_RenderEffectRunHandle$get_NumPasses() {
        return 0;
    },
    Dispose : function GameFramework_resources_RenderEffectRunHandle$Dispose() {
        this.mRenderEffect.End(this);
    },
    BeginPass : function GameFramework_resources_RenderEffectRunHandle$BeginPass(thePass) {
        var aRenderEffectPass = new GameFramework.resources.RenderEffectPass(this, thePass);
        this.mRenderEffect.BeginPass(this, thePass);
        return aRenderEffectPass;
    },
    EndPass : function GameFramework_resources_RenderEffectRunHandle$EndPass(thePass) {
        this.mRenderEffect.EndPass(this, thePass);
    }
}
GameFramework.resources.RenderEffectRunHandle.staticInit = function GameFramework_resources_RenderEffectRunHandle$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.RenderEffectRunHandle.registerClass('GameFramework.resources.RenderEffectRunHandle', null, System.IDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.RenderEffectRunHandle.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.RenderEffect = function GameFramework_resources_RenderEffect() {
}
GameFramework.resources.RenderEffect.prototype = {

    SetVector : function GameFramework_resources_RenderEffect$SetVector(theName, theVector) {
    },
    SetFloatArray : function GameFramework_resources_RenderEffect$SetFloatArray(theName, theVector) {
    },
    SetFloat : function GameFramework_resources_RenderEffect$SetFloat(theName, theValue) {
    },
    SetMatrix : function GameFramework_resources_RenderEffect$SetMatrix(theName, theMatrix) {
    },
    Begin : function GameFramework_resources_RenderEffect$Begin(g3D, theTechnique) {
        if(theTechnique === undefined) {
            theTechnique = null;
        }
        return null;
    },
    End : function GameFramework_resources_RenderEffect$End(theRenderEffectHandle) {
    },
    BeginPass : function GameFramework_resources_RenderEffect$BeginPass(theRenderEffectHandle, thePass) {
    },
    EndPass : function GameFramework_resources_RenderEffect$EndPass(theRenderEffectHandle, thePass) {
    },
    PassUsesVertexShader : function GameFramework_resources_RenderEffect$PassUsesVertexShader(inPass) {
        return false;
    },
    PassUsesPixelShader : function GameFramework_resources_RenderEffect$PassUsesPixelShader(inPass) {
        return false;
    }
}
GameFramework.resources.RenderEffect.staticInit = function GameFramework_resources_RenderEffect$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.RenderEffect.registerClass('GameFramework.resources.RenderEffect', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.RenderEffect.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\RenderEffect.cs
//LineMap:2=10 5=16 7=17 15=21 26=27 29=33 31=34 37=30 39=30 42=37 65=55 74=57 92=73 93=75 
//Start:resources\ResourceManager
/**
 * @constructor
 */
GameFramework.resources.ResourceManager = function GameFramework_resources_ResourceManager() {
    this.mResMap = {};
    this.mResGroupMap = {};
    this.mPathToResMap = {};
    this.mImages = {};
    this.mSounds = {};
    this.mFonts = {};
    this.mPopAnims = {};
    this.mPIEffects = {};
    this.mMeshResources = {};
    this.mRenderEffects = {};
    this.mResourceStreamers = {};
}
GameFramework.resources.ResourceManager.prototype = {
    mResMap : null,
    mResGroupMap : null,
    mPathToResMap : null,
    mImages : null,
    mSounds : null,
    mFonts : null,
    mPopAnims : null,
    mPIEffects : null,
    mMeshResources : null,
    mRenderEffects : null,
    mResourceStreamers : null,
    mStreamingPaused : false,
    PauseStreaming : function GameFramework_resources_ResourceManager$PauseStreaming(pauseStreaming) {
        if(pauseStreaming === undefined) {
            pauseStreaming = true;
        }
        this.mStreamingPaused = pauseStreaming;
    },
    ParseFontData : function GameFramework_resources_ResourceManager$ParseFontData(theResourceStreamer) {
        var aBuffer = theResourceStreamer.mResultData;
        var aFontResource = new GameFramework.resources.FontResource();
        aFontResource.SerializeRead(aBuffer, theResourceStreamer);
        this.RegisterFontResource(theResourceStreamer.mId, aFontResource);
    },
    ParsePopAnimData : function GameFramework_resources_ResourceManager$ParsePopAnimData(theResourceStreamer) {
        var aBuffer = theResourceStreamer.mResultData;
        var aPopAnimResource = new GameFramework.resources.PopAnimResource();
        aPopAnimResource.SerializeRead(aBuffer, theResourceStreamer);
        this.RegisterPopAnimResource(theResourceStreamer.mId, aPopAnimResource);
    },
    ParsePIEffectData : function GameFramework_resources_ResourceManager$ParsePIEffectData(theResourceStreamer) {
        var aBuffer = theResourceStreamer.mResultData;
        var aPIEffect = new GameFramework.resources.PIEffect();
        aPIEffect.LoadEffect(aBuffer, theResourceStreamer);
        this.RegisterPIEffect(theResourceStreamer.mId, aPIEffect);
    },
    ParseMeshResourceData : function GameFramework_resources_ResourceManager$ParseMeshResourceData(theResourceStreamer) {
        var aBuffer = theResourceStreamer.mResultData;
        var aMeshResource = new GameFramework.resources.MeshResource();
        aMeshResource.LoadMesh(aBuffer, theResourceStreamer);
        this.RegisterMeshResource(theResourceStreamer.mId, aMeshResource);
    },
    ParseResourceManifest : function GameFramework_resources_ResourceManager$ParseResourceManifest(theXMLData) {
        // parse resource manifest
        var anXMLParser = new GameFramework.XMLParser();
        anXMLParser.ParseXML(theXMLData);

        // visit elements of root, but we only process Resources tag
        var anXMLList = anXMLParser.GetChildren();
        for(var aGroupIdx = 0; aGroupIdx < anXMLList.Count(); aGroupIdx++) {
            // only process resources tag
            var aGroup = anXMLList.GetItem(aGroupIdx);
            if(aGroup.GetValue() != 'Resources') {
                continue;
            }

            // get id
            var aGroupName = aGroup.GetAttribute('id').GetValue();
            if(aGroup.mAttributes.hasOwnProperty('parent')) {
                aGroupName = aGroup.GetAttribute('parent').GetValue();
            }

            // lazy initialize resource map
            if(!this.mResGroupMap.hasOwnProperty(aGroupName)) {
                this.mResGroupMap[aGroupName] = {};
            }

            // get sub elements
            var aResList = aGroup.GetChildren();
            if(aResList == null) {
                continue;
            }

            // if app resolution is set, we can skip resources whose resolution is not matched
            // if not set, just set it
            if(aGroup.mAttributes.hasOwnProperty('res')) {
                var aRes = GameFramework.Utils.ToInt(aGroup.GetAttribute('res').GetValue());
                if(GameFramework.BaseApp.mApp.mArtRes == 0) {
                    GameFramework.BaseApp.mApp.mArtRes = aRes;
                } else if(GameFramework.BaseApp.mApp.mArtRes != aRes) {
                    continue;
                }
            }

            // visit sub elements of resources
            for(var aResIdx = 0; aResIdx < aResList.Count(); aResIdx++) {
                // get sub node in resources, create a base resource object
                var aResXML = aResList.GetItem(aResIdx);
                var aResType = aResXML.GetValue();
                var aBaseRes = new GameFramework.resources.BaseRes();

                // parent id, or aka group name
                aBaseRes.mGroup = aGroupName;

                // resource type
                if(aResType == 'Font') {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_FONT;
                }
                if(aResType == 'Image') {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_IMAGE;
                }
                if(aResType == 'Sound') {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_SOUND;
                }
                if(aResType == 'PopAnim') {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_POPANIM;
                }
                if(aResType == 'PIEffect') {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_PIEFFECT;
                }
                if(aResType == 'RenderEffect') {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_RENDEREFFECT;
                }

                // id
                aBaseRes.mId = aResXML.GetAttribute('id').GetValue();

                // parent
                if(aResXML.GetAttribute('parent').GetValue().length > 0) {
                    aBaseRes.mParent = aResXML.GetAttribute('parent').GetValue();
                }

                // increase child count of runtime parent
                if(aResXML.GetAttribute('rtparent').GetValue().length > 0) {
                    aBaseRes.mRTParent = aResXML.GetAttribute('rtparent').GetValue();
                    var aRTParent = this.mResMap[aBaseRes.mRTParent];
                    aRTParent.mRTChildCount++;
                }

                // put to parent children list
                if(aBaseRes.mParent != null) {
                    var aParent = this.mResMap[aBaseRes.mParent];
                    if(aParent.mChildren == null) {
                        aParent.mChildren = [];
                    }
                    aParent.mChildren.push(aBaseRes);
                }

                // unix style path
                aBaseRes.mPath = aResXML.GetAttribute('path').GetValue();
                aBaseRes.mPath = GameFramework.Utils.StringReplaceChar(aBaseRes.mPath, 92, 47);

                // other attributes
                if(aResXML.GetAttribute('width').GetValue().length > 0) {
                    aBaseRes.mWidth = GameFramework.Utils.ToInt(aResXML.GetAttribute('width').GetValue());
                }
                if(aResXML.GetAttribute('height').GetValue().length > 0) {
                    aBaseRes.mHeight = GameFramework.Utils.ToInt(aResXML.GetAttribute('height').GetValue());
                }
                if(aResXML.GetAttribute('origw').GetValue().length > 0) {
                    aBaseRes.mOrigWidth = GameFramework.Utils.ToInt(aResXML.GetAttribute('origw').GetValue());
                }
                if(aResXML.GetAttribute('origh').GetValue().length > 0) {
                    aBaseRes.mOrigHeight = GameFramework.Utils.ToInt(aResXML.GetAttribute('origh').GetValue());
                }
                if(aResXML.GetAttribute('cols').GetValue().length > 0) {
                    aBaseRes.mCols = GameFramework.Utils.ToInt(aResXML.GetAttribute('cols').GetValue());
                }
                if(aResXML.GetAttribute('rows').GetValue().length > 0) {
                    aBaseRes.mRows = GameFramework.Utils.ToInt(aResXML.GetAttribute('rows').GetValue());
                }
                if(aResXML.GetAttribute('samples').GetValue().length > 0) {
                    aBaseRes.mNumSamples = GameFramework.Utils.ToInt(aResXML.GetAttribute('samples').GetValue());
                }
                if(aResXML.GetAttribute('x').GetValue().length > 0) {
                    aBaseRes.mOffsetX = GameFramework.Utils.ToInt(aResXML.GetAttribute('x').GetValue());
                }
                if(aResXML.GetAttribute('y').GetValue().length > 0) {
                    aBaseRes.mOffsetY = GameFramework.Utils.ToInt(aResXML.GetAttribute('y').GetValue());
                }
                if(aResXML.GetAttribute('ax').GetValue().length > 0) {
                    aBaseRes.mAtlasX = GameFramework.Utils.ToInt(aResXML.GetAttribute('ax').GetValue());
                }
                if(aResXML.GetAttribute('ay').GetValue().length > 0) {
                    aBaseRes.mAtlasY = GameFramework.Utils.ToInt(aResXML.GetAttribute('ay').GetValue());
                }
                if(aResXML.GetAttribute('aw').GetValue().length > 0) {
                    aBaseRes.mAtlasWidth = GameFramework.Utils.ToInt(aResXML.GetAttribute('aw').GetValue());
                }
                if(aResXML.GetAttribute('ah').GetValue().length > 0) {
                    aBaseRes.mAtlasHeight = GameFramework.Utils.ToInt(aResXML.GetAttribute('ah').GetValue());
                }
                if(aResXML.GetAttribute('rtax').GetValue().length > 0) {
                    aBaseRes.mAtlasRTX = GameFramework.Utils.ToInt(aResXML.GetAttribute('rtax').GetValue());
                }
                if(aResXML.GetAttribute('rtay').GetValue().length > 0) {
                    aBaseRes.mAtlasRTY = GameFramework.Utils.ToInt(aResXML.GetAttribute('rtay').GetValue());
                }
                if(aResXML.GetAttribute('rtaflags').GetValue().length > 0) {
                    aBaseRes.mAtlasRTFlags = GameFramework.Utils.ToInt(aResXML.GetAttribute('rtaflags').GetValue());
                }
                if(aResXML.GetAttribute('runtime').GetValue().length > 0) {
                    aBaseRes.mIsRuntimeImage = aResXML.GetAttribute('runtime').GetValue() == 'true';
                    aBaseRes.mIsNotRuntimeImage = aResXML.GetAttribute('runtime').GetValue() == 'false';
                }
                if(aResXML.GetAttribute('tags').GetValue().length > 0) {
                    aBaseRes.mTags = aResXML.GetAttribute('tags').GetValue();
                }
                if(aResXML.GetAttribute('exts').GetValue().length > 0) {
                    aBaseRes.mExtensions = [];
                    var anExts = aResXML.GetAttribute('exts').GetValue();
                    while(anExts.indexOf(String.fromCharCode(59)) != -1) {
                        var aSemiPos = anExts.indexOf(String.fromCharCode(59));
                        aBaseRes.mExtensions.push(anExts.substr(0, aSemiPos));
                        anExts = anExts.substr(aSemiPos + 1);
                    }
                    aBaseRes.mExtensions.push(anExts);
                }
                if(aResType == 'File') {
                    if(aBaseRes.mPath.endsWith('.p3d')) {
                        aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_MESH;
                    }
                }

                // save in map, path map and group map
                this.mResMap[aBaseRes.mId] = aBaseRes;
                this.mPathToResMap[aBaseRes.mPath] = aBaseRes;
                (this.mResGroupMap[aGroupName])[aBaseRes.mId] = aBaseRes;
            }
        }
    },
    RegisterResourceObject : function GameFramework_resources_ResourceManager$RegisterResourceObject(theResources) {
    },
    PathToId : function GameFramework_resources_ResourceManager$PathToId(thePath) {
        var aBaseRes = this.mPathToResMap[thePath];
        if(aBaseRes == null) {
            return null;
        }
        return aBaseRes.mId;
    },
    LoadResourceGroup : function GameFramework_resources_ResourceManager$LoadResourceGroup(theGroup) {
    },
    GetGroupResourceCount : function GameFramework_resources_ResourceManager$GetGroupResourceCount(theGroup) {
        var aHashtable = (this.mResGroupMap[theGroup]);
        var aCount = 0;

        {
            for($enum1 in aHashtable) {
                var anEntry = aHashtable[$enum1];
                aCount++;
            }
        }
        return aCount;
    },
    PrioritizeResourceStreamer : function GameFramework_resources_ResourceManager$PrioritizeResourceStreamer(theResourceStreamer) {
        GameFramework.BaseApp.mApp.PrioritizeResourceStreamer(theResourceStreamer);
    },
    UnloadResourceGroup : function GameFramework_resources_ResourceManager$UnloadResourceGroup(theGroup) {
        var aGroup = (this.mResGroupMap[theGroup]);

        {
            for($enum2 in aGroup) {
                var aRes = aGroup[$enum2];
                if(aRes.mParent != null) {
                    var aParent = this.mResMap[aRes.mParent];
                    if(aParent.mDisposableResource != null) {
                        aParent.mDisposableResource.Dispose();
                        aParent.mDisposableResource = null;
                    }
                }
                if(aRes.mRTParent != null) {
                    var aParent_2 = this.mResMap[aRes.mRTParent];
                    aParent_2.mRTChildLoadedCount = 0;
                    if(aParent_2.mDisposableResource != null) {
                        aParent_2.mDisposableResource.Dispose();
                        aParent_2.mDisposableResource = null;
                    }
                }
                if(aRes.mDisposableResource != null) {
                    aRes.mDisposableResource.Dispose();
                    aRes.mDisposableResource = null;
                }
                if(this.mImages[aRes.mId] != null) {
                    this.mImages[aRes.mId].Dispose();
                    this.mImages[aRes.mId] = null;
                }
            }
        }
    },
    StreamResourceGroup : function GameFramework_resources_ResourceManager$StreamResourceGroup(theGroup) {
        // create top stream
        var aResourceStreamer = new GameFramework.resources.ResourceStreamer();
        aResourceStreamer.mGroupName = theGroup;
        aResourceStreamer.mResourceCount = 0;

        // get grouped resources
        var aGroup = (this.mResGroupMap[theGroup]);

        // visit every resource
        for($enum3 in aGroup) {
            // if parent resource doesn't have stream associated, create parent resource stream and install event
            var aRes = aGroup[$enum3];
            if(aRes.mParent != null) {
                if(this.mImages[aRes.mParent] == null && !GameFramework.BaseApp.mApp.HasResourceStreamerForId(aRes.mParent)) {
                    var aParentResStreamer = this.StreamImage(aRes.mParent);
                    aParentResStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(aResourceStreamer, aResourceStreamer.ChildFailed));
                }
            }

            // for unknown type resource or runtime image, skip loading
            if((aRes.mType == GameFramework.resources.ResourceManager.RESTYPE_NONE) || (aRes.mIsRuntimeImage)) {
                continue;
            }

            // if extensions are more than 1, should save a path in mPath2 field
            var aPath = aRes.mPath;
            var aChildResourceStreamer = new GameFramework.resources.ResourceStreamer();
            if(aRes.mExtensions != null) {
                if(aRes.mExtensions.length > 1) {
                    aChildResourceStreamer.mPath2 = aPath + aRes.mExtensions[1];
                }
                aPath += aRes.mExtensions[0];
            }

            // copy other info from parent resource
            aChildResourceStreamer.mResType = aRes.mType;
            aChildResourceStreamer.mId = aRes.mId;
            aChildResourceStreamer.mPath = aPath;
            aChildResourceStreamer.mBaseRes = aRes;
            aChildResourceStreamer.mResourceCount = 1;

            // install event
            aChildResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(aResourceStreamer, aResourceStreamer.ChildCompleted));
            aChildResourceStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(aResourceStreamer, aResourceStreamer.ChildFailed));

            // add stream to loading queue
            GameFramework.BaseApp.mApp.AddResourceStreamer(aChildResourceStreamer);

            // increase child count in parent resource
            aResourceStreamer.mResourceCount++;
        }

        GameFramework.BaseApp.mApp.AddResourceStreamer(aResourceStreamer);
        return aResourceStreamer;
    },
    StreamTextFile : function GameFramework_resources_ResourceManager$StreamTextFile(thePath) {
        var aResourceStreamer = new GameFramework.resources.ResourceStreamer();
        aResourceStreamer.mPath = thePath;
        aResourceStreamer.mResType = GameFramework.resources.ResourceManager.RESTYPE_TEXTFILE;
        aResourceStreamer.mResourceCount = 1;
        GameFramework.BaseApp.mApp.AddResourceStreamer(aResourceStreamer);
        return aResourceStreamer;
    },
    StreamBinaryFile : function GameFramework_resources_ResourceManager$StreamBinaryFile(theId) {
        var aRes = this.mResMap[theId];
        var aResourceStreamer = new GameFramework.resources.ResourceStreamer();
        aResourceStreamer.mPath = aRes.mPath;
        if(aRes.mExtensions != null) {
            aResourceStreamer.mPath += aRes.mExtensions[0];
        }
        aResourceStreamer.mResType = GameFramework.resources.ResourceManager.RESTYPE_BINFILE;
        aResourceStreamer.mResourceCount = 1;
        GameFramework.BaseApp.mApp.AddResourceStreamer(aResourceStreamer);
        return aResourceStreamer;
    },
    StreamImage : function GameFramework_resources_ResourceManager$StreamImage(theId) {
        var aPrevResourceStreamer = GameFramework.BaseApp.mApp.GetResourceStreamerForId(theId);
        if(aPrevResourceStreamer != null) {
            return aPrevResourceStreamer;
        }
        var aResourceStreamer = new GameFramework.resources.ResourceStreamer();
        var aBaseRes = (this.mResMap[theId]);
        if(aBaseRes.mParent != null) {
            if((this.mImages[aBaseRes.mParent] == null) && (!GameFramework.BaseApp.mApp.HasResourceStreamerForId(aBaseRes.mParent))) {
                var aParentResStreamer = this.StreamImage(aBaseRes.mParent);
                aParentResStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(aResourceStreamer, aResourceStreamer.ChildFailed));
            }
        }
        aResourceStreamer.mId = theId;
        aResourceStreamer.mBaseRes = aBaseRes;
        aResourceStreamer.mPath = aResourceStreamer.mBaseRes.mPath;
        if(aResourceStreamer.mBaseRes.mExtensions != null) {
            aResourceStreamer.mPath = aResourceStreamer.mBaseRes.mPath + aResourceStreamer.mBaseRes.mExtensions[0];
            if(aResourceStreamer.mBaseRes.mExtensions.length > 1) {
                aResourceStreamer.mPath2 = aResourceStreamer.mBaseRes.mPath + aResourceStreamer.mBaseRes.mExtensions[1];
            }
        }
        aResourceStreamer.mPath = GameFramework.Utils.StringReplaceChar(aResourceStreamer.mPath, 92, 47);
        aResourceStreamer.mResType = GameFramework.resources.ResourceManager.RESTYPE_IMAGE;
        aResourceStreamer.mResourceCount = 1;
        GameFramework.BaseApp.mApp.AddResourceStreamer(aResourceStreamer);
        return aResourceStreamer;
    },
    StreamImageFromPath : function GameFramework_resources_ResourceManager$StreamImageFromPath(thePath) {
        var aResourceStreamer = new GameFramework.resources.ResourceStreamer();
        aResourceStreamer.mPath = thePath;
        aResourceStreamer.mResType = GameFramework.resources.ResourceManager.RESTYPE_IMAGE;
        aResourceStreamer.mResourceCount = 1;
        GameFramework.BaseApp.mApp.AddResourceStreamer(aResourceStreamer);
        return aResourceStreamer;
    },
    SetResType : function GameFramework_resources_ResourceManager$SetResType(theId, theObject) {
        var aBaseRes = this.mResMap[theId];
        aBaseRes.mDisposableResource = Type.safeCast(theObject, System.IDisposable);
    },
    RegisterFontResource : function GameFramework_resources_ResourceManager$RegisterFontResource(theId, theFontResource) {
        var aBaseRes = this.mResMap[theId];
        if(aBaseRes.mTags != null) {
            var anIdx = 0;
            while(true) {
                var aSpaceIdx = aBaseRes.mTags.indexOf(' ', anIdx);
                if(aSpaceIdx != -1) {
                    theFontResource.AddTag(aBaseRes.mTags.substr(anIdx, aSpaceIdx - anIdx));
                    anIdx = aSpaceIdx + 1;
                } else {
                    theFontResource.AddTag(aBaseRes.mTags.substr(anIdx));
                    break;
                }
            }
        }
        this.mFonts[theId] = theFontResource;
        this.SetResType(theId, theFontResource);
    },
    RegisterPopAnimResource : function GameFramework_resources_ResourceManager$RegisterPopAnimResource(theId, thePopAnimResource) {
        this.mPopAnims[theId] = thePopAnimResource;
        this.SetResType(theId, thePopAnimResource);
    },
    RegisterPIEffect : function GameFramework_resources_ResourceManager$RegisterPIEffect(theId, thePIEffect) {
        this.mPIEffects[theId] = thePIEffect;
        this.SetResType(theId, thePIEffect);
    },
    RegisterMeshResource : function GameFramework_resources_ResourceManager$RegisterMeshResource(theId, theMeshResource) {
        this.mMeshResources[theId] = theMeshResource;
        this.SetResType(theId, theMeshResource);
    },
    RegisterRenderEffect : function GameFramework_resources_ResourceManager$RegisterRenderEffect(theId, theRenderEffect) {
        this.mRenderEffects[theId] = theRenderEffect;
        this.SetResType(theId, theRenderEffect);
    },
    GetFontResourceById : function GameFramework_resources_ResourceManager$GetFontResourceById(theId) {
        return this.mFonts[theId];
    },
    GetImageResourceById : function GameFramework_resources_ResourceManager$GetImageResourceById(theId) {
        return this.mImages[theId];
    },
    GetSoundResourceById : function GameFramework_resources_ResourceManager$GetSoundResourceById(theId) {
        return this.mSounds[theId];
    },
    GetMeshResourceById : function GameFramework_resources_ResourceManager$GetMeshResourceById(theId) {
        return this.mMeshResources[theId];
    },
    GetPopAnimResourceById : function GameFramework_resources_ResourceManager$GetPopAnimResourceById(theId) {
        return this.mPopAnims[theId];
    },
    GetPIEffectById : function GameFramework_resources_ResourceManager$GetPIEffectById(theId) {
        return this.mPIEffects[theId];
    }
}
GameFramework.resources.ResourceManager.staticInit = function GameFramework_resources_ResourceManager$staticInit() {
    GameFramework.resources.ResourceManager.RESTYPE_NONE = 0;
    GameFramework.resources.ResourceManager.RESTYPE_IMAGE = 1;
    GameFramework.resources.ResourceManager.RESTYPE_SOUND = 2;
    GameFramework.resources.ResourceManager.RESTYPE_FONT = 3;
    GameFramework.resources.ResourceManager.RESTYPE_POPANIM = 4;
    GameFramework.resources.ResourceManager.RESTYPE_PIEFFECT = 5;
    GameFramework.resources.ResourceManager.RESTYPE_MESH = 6;
    GameFramework.resources.ResourceManager.RESTYPE_RENDEREFFECT = 7;
    GameFramework.resources.ResourceManager.RESTYPE_TEXTFILE = 8;
    GameFramework.resources.ResourceManager.RESTYPE_BINFILE = 9;
}

JS_AddInitFunc(function() {
    GameFramework.resources.ResourceManager.registerClass('GameFramework.resources.ResourceManager', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.ResourceManager.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\ResourceManager.cs
//LineMap:2=3 5=41 7=26 10=30 32=38 34=44 36=44 37=46 43=53 45=56 51=63 53=66 59=73 61=76 67=83 69=86 76=94 80=100 82=103 83=105 85=108 87=111 90=116 93=120 95=123 97=127 100=131 101=133 115=148 126=160 133=168 135=174 186=226 191=232 192=234 193=236 202=246 214=259 
//LineMap:220=263 222=263 226=265 237=277 239=277 241=277 242=279 251=289 261=300 266=306 275=314 280=320 281=322 283=322 285=322 286=324 294=333 296=336 298=345 304=357 309=363 311=366 312=368 332=389 349=407 359=418 408=466 413=473 473=15 
//Start:resources\ResourceStreamer
/**
 * @constructor
 */
GameFramework.resources.ResourceStreamer = function GameFramework_resources_ResourceStreamer() {
    this.mFailedChild = null;
    GameFramework.resources.ResourceStreamer.initializeBase(this);
}
GameFramework.resources.ResourceStreamer.prototype = {
    mGroupName : null,
    mParentResId : null,
    mId : null,
    mPath : null,
    mPath2 : null,
    mBaseRes : null,
    mResultData : null,
    mResType : 0,
    mResourceCount : 0,
    mResourcesLoaded : 0,
    mFailed : false,
    mFailedChild : null,
    get_percentage : function GameFramework_resources_ResourceStreamer$get_percentage() {
        return this.mResourcesLoaded / this.mResourceCount;
    },
    ChildCompleted : function GameFramework_resources_ResourceStreamer$ChildCompleted(e) {
        this.mResourcesLoaded++;
    },
    ChildFailed : function GameFramework_resources_ResourceStreamer$ChildFailed(e) {
        this.mFailedChild = Type.safeCast(e.target, GameFramework.resources.ResourceStreamer);
        this.DispatchEvent(e);
    }
}
GameFramework.resources.ResourceStreamer.staticInit = function GameFramework_resources_ResourceStreamer$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.ResourceStreamer.registerClass('GameFramework.resources.ResourceStreamer', GameFramework.events.EventDispatcher);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.ResourceStreamer.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\ResourceStreamer.cs
//LineMap:2=3 7=21 19=16 20=18 
//Start:resources\SoundInstance
/**
 * @constructor
 */
GameFramework.resources.SoundInstance = function GameFramework_resources_SoundInstance(theSoundResource) {
    this.mSoundResource = theSoundResource;
}
GameFramework.resources.SoundInstance.prototype = {
    mSoundResource : null,
    numPlays : 0,
    SetSoundGroup : function GameFramework_resources_SoundInstance$SetSoundGroup(theGroup) {
    },
    SetVolume : function GameFramework_resources_SoundInstance$SetVolume(volume) {
    },
    SetPan : function GameFramework_resources_SoundInstance$SetPan(thePan) {
    },
    PlayEx : function GameFramework_resources_SoundInstance$PlayEx(looping, autoRelease) {
    },
    Play : function GameFramework_resources_SoundInstance$Play() {
        this.PlayEx(false, true);
    },
    Stop : function GameFramework_resources_SoundInstance$Stop(dispose) {
        if(dispose === undefined) {
            dispose = true;
        }
    },
    Dispose : function GameFramework_resources_SoundInstance$Dispose() {
    },
    Pause : function GameFramework_resources_SoundInstance$Pause() {
    },
    Unpause : function GameFramework_resources_SoundInstance$Unpause() {
    },
    IsDone : function GameFramework_resources_SoundInstance$IsDone() {
        return true;
    }
}
GameFramework.resources.SoundInstance.staticInit = function GameFramework_resources_SoundInstance$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.SoundInstance.registerClass('GameFramework.resources.SoundInstance', null, System.IDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.SoundInstance.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\SoundInstance.cs
//LineMap:2=3 5=17 7=18 12=12 14=21 22=33 37=46 40=50 48=59 
//Start:resources\SoundManager
/**
 * @constructor
 */
GameFramework.resources.SoundManager = function GameFramework_resources_SoundManager() {
    this.mGroupVolumes = Array.Create(7, 7, 1, 1, 1, 1, 1, 1, 1);
    GameFramework.resources.SoundManager.initializeBase(this);
}
GameFramework.resources.SoundManager.prototype = {
    mGroupVolumes : null,
    RehupGroupVolumes : function GameFramework_resources_SoundManager$RehupGroupVolumes(theGroup) {
    },
    SetVolume : function GameFramework_resources_SoundManager$SetVolume(volume, theGroup) {
        if(theGroup === undefined) {
            theGroup = 0;
        }
        this.mGroupVolumes[theGroup] = volume;
        this.RehupGroupVolumes(theGroup);
    }
}
GameFramework.resources.SoundManager.staticInit = function GameFramework_resources_SoundManager$staticInit() {
    GameFramework.resources.SoundManager.MAX_GROUPS = 8;
}

JS_AddInitFunc(function() {
    GameFramework.resources.SoundManager.registerClass('GameFramework.resources.SoundManager', GameFramework.events.EventDispatcher);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.SoundManager.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\SoundManager.cs
//LineMap:2=3 7=10 14=12 18=17 20=17 21=19 27=9 
//Start:resources\SoundResource
/**
 * @constructor
 */
GameFramework.resources.SoundResource = function GameFramework_resources_SoundResource() {
}
GameFramework.resources.SoundResource.prototype = {
    mNumSamples : 0
}
GameFramework.resources.SoundResource.staticInit = function GameFramework_resources_SoundResource$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.SoundResource.registerClass('GameFramework.resources.SoundResource', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.SoundResource.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\SoundResource.cs
//LineMap:2=3 
//Start:resources\popanim\PopAnimCommand
GameFramework.resources.popanim = Type.registerNamespace('GameFramework.resources.popanim');
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimCommand = function GameFramework_resources_popanim_PopAnimCommand() {
}
GameFramework.resources.popanim.PopAnimCommand.prototype = {
    mCommand : null,
    mParam : null
}
GameFramework.resources.popanim.PopAnimCommand.staticInit = function GameFramework_resources_popanim_PopAnimCommand$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimCommand.registerClass('GameFramework.resources.popanim.PopAnimCommand', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimCommand.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimCommand.cs
//LineMap:2=3 
//Start:resources\popanim\PopAnimDef
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimDef = function GameFramework_resources_popanim_PopAnimDef() {
    this.mObjectNamePool = [];
}
GameFramework.resources.popanim.PopAnimDef.prototype = {
    mMainSpriteDef : null,
    mSpriteDefVector : null,
    mObjectNamePool : null
}
GameFramework.resources.popanim.PopAnimDef.staticInit = function GameFramework_resources_popanim_PopAnimDef$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimDef.registerClass('GameFramework.resources.popanim.PopAnimDef', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimDef.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimDef.cs
//LineMap:2=3 7=9 
//Start:resources\popanim\PopAnimEvent
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimEvent = function GameFramework_resources_popanim_PopAnimEvent(theType) {
    GameFramework.resources.popanim.PopAnimEvent.initializeBase(this, [theType]);
}
GameFramework.resources.popanim.PopAnimEvent.prototype = {

}
GameFramework.resources.popanim.PopAnimEvent.staticInit = function GameFramework_resources_popanim_PopAnimEvent$staticInit() {
    GameFramework.resources.popanim.PopAnimEvent.STOPPED = 'popanim.stopped';
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimEvent.registerClass('GameFramework.resources.popanim.PopAnimEvent', GameFramework.events.Event);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimEvent.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimEvent.cs
//LineMap:2=9 5=14 7=13 15=11 
//Start:resources\popanim\PopAnimFrame
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimFrame = function GameFramework_resources_popanim_PopAnimFrame() {
}
GameFramework.resources.popanim.PopAnimFrame.prototype = {
    mFrameObjectPosVector : null,
    mHasStop : false,
    mCommandVector : null
}
GameFramework.resources.popanim.PopAnimFrame.staticInit = function GameFramework_resources_popanim_PopAnimFrame$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimFrame.registerClass('GameFramework.resources.popanim.PopAnimFrame', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimFrame.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimFrame.cs
//LineMap:2=3 11=8 
//Start:resources\popanim\PopAnimImage
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimImage = function GameFramework_resources_popanim_PopAnimImage() {
    this.mImages = [];
    this.mImageNames = [];
}
GameFramework.resources.popanim.PopAnimImage.prototype = {
    mImages : null,
    mImageNames : null,
    mOrigHeight : 0,
    mOrigWidth : 0,
    mCols : 0,
    mRows : 0,
    mImageName : null,
    mDrawMode : 0,
    mTransform : null,
    ImageLoaded : function GameFramework_resources_popanim_PopAnimImage$ImageLoaded(e) {
        var aResourceStreamer = (e.target);
        var anImageResource = (aResourceStreamer.mResultData);
        this.mImages[this.mImageNames.indexOf(aResourceStreamer.mId)] = anImageResource;
    }
}
GameFramework.resources.popanim.PopAnimImage.staticInit = function GameFramework_resources_popanim_PopAnimImage$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimImage.registerClass('GameFramework.resources.popanim.PopAnimImage', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimImage.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimImage.cs
//LineMap:2=3 7=11 22=21 
//Start:resources\popanim\PopAnimObjectDef
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimObjectDef = function GameFramework_resources_popanim_PopAnimObjectDef() {
}
GameFramework.resources.popanim.PopAnimObjectDef.prototype = {
    mName : null,
    mSpriteDef : null
}
GameFramework.resources.popanim.PopAnimObjectDef.staticInit = function GameFramework_resources_popanim_PopAnimObjectDef$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimObjectDef.registerClass('GameFramework.resources.popanim.PopAnimObjectDef', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimObjectDef.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimObjectDef.cs
//LineMap:2=3 
//Start:resources\popanim\PopAnimObjectInst
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimObjectInst = function GameFramework_resources_popanim_PopAnimObjectInst() {
}
GameFramework.resources.popanim.PopAnimObjectInst.prototype = {
    mName : null,
    mSpriteInst : null,
    mBlendSrcTransform : null,
    mBlendSrcColor : 0,
    mIsBlending : null,
    mTransform : null,
    mColorMult : 0xffffffff,
    mPredrawCallback : null
}
GameFramework.resources.popanim.PopAnimObjectInst.staticInit = function GameFramework_resources_popanim_PopAnimObjectInst$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimObjectInst.registerClass('GameFramework.resources.popanim.PopAnimObjectInst', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimObjectInst.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimObjectInst.cs
//LineMap:2=3 16=19 
//Start:resources\popanim\PopAnimObjectPos
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimObjectPos = function GameFramework_resources_popanim_PopAnimObjectPos() {
    GameFramework.resources.popanim.PopAnimObjectPos.mInstCount++;
}
GameFramework.resources.popanim.PopAnimObjectPos.prototype = {
    mTransform : null,
    mData : null,
    mColor : 0,
    mAnimFrameNum : 0,
    Duplicate : function GameFramework_resources_popanim_PopAnimObjectPos$Duplicate() {
        var aPopAnimObjectPos = new GameFramework.resources.popanim.PopAnimObjectPos();
        aPopAnimObjectPos.mTransform = this.mTransform;
        aPopAnimObjectPos.mData = this.mData;
        aPopAnimObjectPos.mColor = this.mColor;
        aPopAnimObjectPos.mAnimFrameNum = this.mAnimFrameNum;
        return aPopAnimObjectPos;
    }
}
GameFramework.resources.popanim.PopAnimObjectPos.staticInit = function GameFramework_resources_popanim_PopAnimObjectPos$staticInit() {
    GameFramework.resources.popanim.PopAnimObjectPos.mInstCount = 0;
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimObjectPos.registerClass('GameFramework.resources.popanim.PopAnimObjectPos', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimObjectPos.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimObjectPos.cs
//LineMap:2=3 5=16 7=17 16=20 28=13 
//Start:resources\popanim\PopAnimObjectPosData
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimObjectPosData = function GameFramework_resources_popanim_PopAnimObjectPosData() {
    GameFramework.resources.popanim.PopAnimObjectPosData.mInstCount++;
}
GameFramework.resources.popanim.PopAnimObjectPosData.prototype = {
    mName : null,
    mObjectNum : 0,
    mIsSprite : null,
    mIsAdditive : null,
    mResNum : 0,
    mPreloadFrames : 0,
    mTimeScale : 0,
    mHasSrcRect : null,
    mSrcX : 0,
    mSrcY : 0,
    mSrcWidth : 0,
    mSrcHeight : 0,
    Duplicate : function GameFramework_resources_popanim_PopAnimObjectPosData$Duplicate() {
        var aPopAnimObjectPos = new GameFramework.resources.popanim.PopAnimObjectPosData();
        aPopAnimObjectPos.mName = this.mName;
        aPopAnimObjectPos.mObjectNum = this.mObjectNum;
        aPopAnimObjectPos.mIsSprite = this.mIsSprite;
        aPopAnimObjectPos.mIsAdditive = this.mIsAdditive;
        aPopAnimObjectPos.mResNum = this.mResNum;
        aPopAnimObjectPos.mPreloadFrames = this.mPreloadFrames;
        aPopAnimObjectPos.mTimeScale = this.mTimeScale;
        aPopAnimObjectPos.mHasSrcRect = this.mHasSrcRect;
        aPopAnimObjectPos.mSrcX = this.mSrcX;
        aPopAnimObjectPos.mSrcY = this.mSrcY;
        aPopAnimObjectPos.mSrcWidth = this.mSrcWidth;
        aPopAnimObjectPos.mSrcHeight = this.mSrcHeight;
        return aPopAnimObjectPos;
    }
}
GameFramework.resources.popanim.PopAnimObjectPosData.staticInit = function GameFramework_resources_popanim_PopAnimObjectPosData$staticInit() {
    GameFramework.resources.popanim.PopAnimObjectPosData.mInstCount = 0;
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimObjectPosData.registerClass('GameFramework.resources.popanim.PopAnimObjectPosData', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimObjectPosData.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimObjectPosData.cs
//LineMap:2=3 5=26 7=27 24=30 44=23 
//Start:resources\popanim\PopAnimParticleEffect
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimParticleEffect = function GameFramework_resources_popanim_PopAnimParticleEffect() {
}
GameFramework.resources.popanim.PopAnimParticleEffect.prototype = {
    mEffect : null,
    mName : null,
    mLastUpdated : 0,
    mBehind : null,
    mAttachEmitter : null,
    mTransform : null,
    mXOfs : 0,
    mYOfs : 0
}
GameFramework.resources.popanim.PopAnimParticleEffect.staticInit = function GameFramework_resources_popanim_PopAnimParticleEffect$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimParticleEffect.registerClass('GameFramework.resources.popanim.PopAnimParticleEffect', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimParticleEffect.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimParticleEffect.cs
//LineMap:2=10 
//Start:resources\popanim\PopAnimSpriteDef
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimSpriteDef = function GameFramework_resources_popanim_PopAnimSpriteDef() {
}
GameFramework.resources.popanim.PopAnimSpriteDef.prototype = {
    mName : null,
    mFrames : null,
    mWorkAreaStart : 0,
    mWorkAreaDuration : 0,
    mLabels : null,
    mObjectDefVector : null,
    mAnimRate : 0,
    GetLabelFrame : function GameFramework_resources_popanim_PopAnimSpriteDef$GetLabelFrame(theLabel) {
        if(theLabel == '') {
            return 0;
        }
        return (this.mLabels[theLabel] | 0);
    }
}
GameFramework.resources.popanim.PopAnimSpriteDef.staticInit = function GameFramework_resources_popanim_PopAnimSpriteDef$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimSpriteDef.registerClass('GameFramework.resources.popanim.PopAnimSpriteDef', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimSpriteDef.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimSpriteDef.cs
//LineMap:2=3 18=15 
//Start:resources\popanim\PopAnimSpriteInst
/**
 * @constructor
 */
GameFramework.resources.popanim.PopAnimSpriteInst = function GameFramework_resources_popanim_PopAnimSpriteInst() {
}
GameFramework.resources.popanim.PopAnimSpriteInst.prototype = {
    mParent : null,
    mDelayFrames : 0,
    mFrameNum : 0,
    mFrameRepeats : 0,
    mOnNewFrame : null,
    mLastUpdated : 0,
    mCurTransform : null,
    mCurColor : 0,
    mChildren : null,
    mDef : null,
    mParticleEffectVector : null,
    GetObjectInst : function GameFramework_resources_popanim_PopAnimSpriteInst$GetObjectInst(theName) {
        var aCurName = '';
        var aNextName = '';
        var aSlashPos = theName.indexOf(String.fromCharCode(92));
        if(aSlashPos != -1) {
            aCurName = theName.substr(0, aSlashPos);
            aNextName = theName.substr(aSlashPos + 1);
        } else {
            aCurName = theName;
        }
        for(var aChildIdx = 0; aChildIdx < this.mChildren.length; aChildIdx++) {
            var anObjectInst = this.mChildren[aChildIdx];
            if((anObjectInst.mName != null) && (anObjectInst.mName == aCurName)) {
                if(aSlashPos == -1) {
                    return anObjectInst;
                }
                if(anObjectInst.mSpriteInst == null) {
                    return null;
                }
                return anObjectInst.mSpriteInst.GetObjectInst(aNextName);
            }
        }
        return null;
    },
    Dispose : function GameFramework_resources_popanim_PopAnimSpriteInst$Dispose() {
        if(this.mChildren != null) {
            for(var aChildIdx = 0; aChildIdx < this.mChildren.length; aChildIdx++) {
                var anObjectInst = this.mChildren[aChildIdx];
                if(anObjectInst.mSpriteInst != null) {
                    anObjectInst.mSpriteInst.Dispose();
                }
            }
        }
        this.mChildren = null;
        this.mDef = null;
        this.mParticleEffectVector = null;
        this.mParent = null;
    }
}
GameFramework.resources.popanim.PopAnimSpriteInst.staticInit = function GameFramework_resources_popanim_PopAnimSpriteInst$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.resources.popanim.PopAnimSpriteInst.registerClass('GameFramework.resources.popanim.PopAnimSpriteInst', null, System.IDisposable);
});
JS_AddStaticInitFunc(function() {
    GameFramework.resources.popanim.PopAnimSpriteInst.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\resources\popanim\PopAnimSpriteInst.cs
//LineMap:2=3 22=20 26=25 34=32 35=34 47=47 
//Start:widgets\ButtonWidget
GameFramework.widgets = Type.registerNamespace('GameFramework.widgets');
/**
 * @constructor
 */
GameFramework.widgets.ButtonWidget = function GameFramework_widgets_ButtonWidget(theId) {
    if(theId === undefined) {
        theId = 0;
    }
    this.mColors = Array.Create(2, null, 0xffffffff, 0xffffffff);
    this.mFont = null;
    this.mButtonImage = null;
    this.mIconImage = null;
    this.mOverImage = null;
    this.mDownImage = null;
    this.mDisabledImage = null;
    this.mBoundsRect = null;
    GameFramework.widgets.ButtonWidget.initializeBase(this);
    this.mId = theId;
}
GameFramework.widgets.ButtonWidget.prototype = {
    mColors : null,
    mAlpha : 1.0,
    mAlphaVisibilityThreshold : 0.5,
    mId : 0,
    mLabel : null,
    mLabelJustify : 0,
    mLabelYOfs : 0,
    mFont : null,
    mButtonImage : null,
    mIconImage : null,
    mOverImage : null,
    mDownImage : null,
    mDisabledImage : null,
    mNormalCel : -1,
    mOverCel : -1,
    mDownCel : -1,
    mDisabledCel : -1,
    mDisabled : false,
    mInverted : false,
    mOverAlpha : 0.0,
    mBoundsRadius : 0.0,
    mBoundsRect : null,
    IsButtonDown : function GameFramework_widgets_ButtonWidget$IsButtonDown() {
        return this.mIsDown && this.mIsOver && !this.mDisabled;
    },
    HaveButtonImage : function GameFramework_widgets_ButtonWidget$HaveButtonImage(theImage, theCel) {
        return (theImage != null || theCel != -1);
    },
    MouseClicked : function GameFramework_widgets_ButtonWidget$MouseClicked(x, y) {
        if(!this.mDisabled) {
            GameFramework.widgets.ClassicWidget.prototype.MouseClicked.apply(this, [x, y]);
        }
    },
    ResizeFromImage : function GameFramework_widgets_ButtonWidget$ResizeFromImage(theImageResource, theOffsetX, theOffsetY) {
        if(theOffsetX === undefined) {
            theOffsetX = 0;
        }
        if(theOffsetY === undefined) {
            theOffsetY = 0;
        }
        this.mX = theImageResource.mOffsetX + theOffsetX;
        this.mY = theImageResource.mOffsetY + theOffsetY;
        this.mWidth = theImageResource.mWidth;
        this.mHeight = theImageResource.mHeight;
    },
    DrawAll : function GameFramework_widgets_ButtonWidget$DrawAll(g) {
        var wantColorize = this.mAlpha != 1.0;
        if(wantColorize) {
            g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((255.0 * this.mAlpha) | 0)));
        }
        GameFramework.widgets.ClassicWidget.prototype.DrawAll.apply(this, [g]);
        if(wantColorize) {
            g.PopColor();
        }
    },
    DrawButtonImage : function GameFramework_widgets_ButtonWidget$DrawButtonImage(g, theImage, theCel, x, y) {
        var aVScale = this.mHeight / this.mButtonImage.mHeight;
        if(aVScale != 1.0) {
            g.PushScale(1.0, aVScale, 0, 0);
        }
        if(theCel != -1) {
            g.DrawButton(this.mButtonImage == null ? theImage : this.mButtonImage, x, y, this.mWidth, theCel);
        } else {
            g.DrawButton(theImage, x, y, this.mWidth, 0);
        }
        if(aVScale != 1.0) {
            g.PopMatrix();
        }
    },
    SetFont : function GameFramework_widgets_ButtonWidget$SetFont(theFont) {
        this.mFont = theFont;
    },
    SetColor : function GameFramework_widgets_ButtonWidget$SetColor(theIdx, theColor) {
        this.mColors[theIdx] = theColor;
    },
    Draw : function GameFramework_widgets_ButtonWidget$Draw(g) {
        var isDown = this.mIsDown && this.mIsOver && !this.mDisabled;
        if(this.mInverted) {
            isDown = !isDown;
        }
        var aFontX = 0;
        var aFontY = 0;
        g.SetFont(this.mFont);
        if(this.mFont != null) {
            if(this.mLabelJustify == 0) {
                aFontX = (this.mWidth - this.mFont.StringWidth(this.mLabel)) / 2;
            } else if(this.mLabelJustify == 1) {
                aFontX = this.mWidth - this.mFont.StringWidth(this.mLabel);
            }
            var aPhysAscent = this.mFont.GetPhysAscent();
            var aPhysDescent = this.mFont.GetPhysDescent();
            aFontY = this.mHeight / 2 + this.mFont.GetHeight() / 2 + this.mLabelYOfs;
        }
        var anIconX = 0;
        var anIconY = 0;
        var aDownOffset = 1.0 / GameFramework.BaseApp.mApp.mScale;
        if((this.mButtonImage == null) && (this.mDownImage == null)) {
        } else {
            if(!isDown) {
                if(this.mDisabled && this.HaveButtonImage(this.mDisabledImage, this.mDisabledCel)) {
                    this.DrawButtonImage(g, this.mDisabledImage, this.mDisabledCel, 0, 0);
                } else if((this.mOverAlpha > 0) && this.HaveButtonImage(this.mOverImage, this.mOverCel)) {
                    if(this.HaveButtonImage(this.mButtonImage, this.mNormalCel) && this.mOverAlpha < 1) {
                        this.DrawButtonImage(g, this.mButtonImage, this.mNormalCel, 0, 0);
                    }
                    g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, ((this.mOverAlpha * 255) | 0)));
                    this.DrawButtonImage(g, this.mOverImage, this.mOverCel, 0, 0);
                    g.PopColor();
                } else if((this.mIsOver || this.mIsDown) && this.HaveButtonImage(this.mOverImage, this.mOverCel)) {
                    this.DrawButtonImage(g, this.mOverImage, this.mOverCel, 0, 0);
                } else if(this.HaveButtonImage(this.mButtonImage, this.mNormalCel)) {
                    this.DrawButtonImage(g, this.mButtonImage, this.mNormalCel, 0, 0);
                }
                if(this.mIsOver) {
                    g.PushColor(this.mColors[GameFramework.widgets.ButtonWidget.COLOR_LABEL_HILITE]);
                } else {
                    g.PushColor(this.mColors[GameFramework.widgets.ButtonWidget.COLOR_LABEL]);
                }
                if(this.mIconImage != null) {
                    g.DrawImage(this.mIconImage, anIconX, anIconY);
                } else if(this.mLabel != null) {
                    g.DrawString(this.mLabel, aFontX, aFontY);
                }
                g.PopColor();
            } else {
                if(this.HaveButtonImage(this.mDownImage, this.mDownCel)) {
                    this.DrawButtonImage(g, this.mDownImage, this.mDownCel, 0, 0);
                } else if(this.HaveButtonImage(this.mOverImage, this.mOverCel)) {
                    this.DrawButtonImage(g, this.mOverImage, this.mOverCel, 1, 1);
                } else {
                    this.DrawButtonImage(g, this.mButtonImage, this.mNormalCel, 1, 1);
                }
                g.PushColor(this.mColors[GameFramework.widgets.ButtonWidget.COLOR_LABEL_HILITE]);
                if(this.mIconImage != null) {
                    g.DrawImage(this.mIconImage, anIconX + aDownOffset, anIconY + aDownOffset);
                } else if(this.mLabel != null) {
                    g.DrawString(this.mLabel, aFontX + aDownOffset, aFontY + aDownOffset);
                }
                g.PopColor();
            }
        }
    },
    Contains : function GameFramework_widgets_ButtonWidget$Contains(x, y) {
        return GameFramework.widgets.ClassicWidget.prototype.Contains.apply(this, [x, y]) && this.mAlpha > this.mAlphaVisibilityThreshold && (this.mBoundsRadius == 0.0 || (x - this.mWidth / 2.0) * (x - this.mWidth / 2.0) + (y - this.mHeight / 2.0) * (y - this.mHeight / 2.0) < this.mBoundsRadius * this.mBoundsRadius) && (this.mBoundsRect == null || this.mBoundsRect.Contains(x, y));
    }
}
GameFramework.widgets.ButtonWidget.staticInit = function GameFramework_widgets_ButtonWidget$staticInit() {
    GameFramework.widgets.ButtonWidget.COLOR_LABEL = 0;
    GameFramework.widgets.ButtonWidget.COLOR_LABEL_HILITE = 1;
}

JS_AddInitFunc(function() {
    GameFramework.widgets.ButtonWidget.registerClass('GameFramework.widgets.ButtonWidget', GameFramework.widgets.ClassicWidget);
});
JS_AddStaticInitFunc(function() {
    GameFramework.widgets.ButtonWidget.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\widgets\ButtonWidget.cs
//LineMap:2=3 3=40 6=41 8=40 9=16 10=24 16=38 18=42 23=18 45=45 63=61 64=61 65=63 76=75 77=77 86=87 90=92 106=111 109=115 111=118 112=120 116=125 119=129 121=134 123=137 124=150 128=214 130=215 135=221 137=224 141=226 143=230 145=230 146=233 147=235 151=240 153=243 154=245 
//LineMap:159=249 161=252 164=256 165=258 167=261 168=263 180=13 
//Start:widgets\Checkbox
Game = Type.registerNamespace('Game');
/**
 * @constructor
 */
Game.Checkbox = function Game_Checkbox(theUncheckedImage, theCheckedImage) {
    this.mCheckedRect = new GameFramework.TRect(0, 0, 0, 0);
    this.mUncheckedRect = new GameFramework.TRect(0, 0, 0, 0);
    Game.Checkbox.initializeBase(this);
    this.mUncheckedImage = theUncheckedImage;
    this.mCheckedImage = theCheckedImage;
    this.mChecked = false;
    this.mOutlineColor = GameFramework.gfx.Color.WHITE_RGB;
    this.mBkgColor = GameFramework.gfx.Color.RGBToInt(80, 80, 80);
    this.mCheckColor = GameFramework.gfx.Color.RGBToInt(255, 255, 0);
}
Game.Checkbox.prototype = {
    mChecked : null,
    mUncheckedImage : null,
    mCheckedImage : null,
    mCheckedRect : null,
    mUncheckedRect : null,
    mOutlineColor : 0,
    mBkgColor : 0,
    mCheckColor : 0,
    mAlpha : 1.0,
    SetChecked : function Game_Checkbox$SetChecked(theChecked, tellListener) {
        if(tellListener === undefined) {
            tellListener = true;
        }
        this.mChecked = theChecked;
        if(tellListener) {
            var e = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.CHECKBOX_CHECKED);
            this.DispatchEvent(e);
        }
    },
    IsChecked : function Game_Checkbox$IsChecked() {
        return this.mChecked;
    },
    MouseDown : function Game_Checkbox$MouseDown(x, y) {
        GameFramework.widgets.ClassicWidget.prototype.MouseDown.apply(this, [x, y]);
        this.mChecked = !this.mChecked;
        var e = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.CHECKBOX_CHECKED);
        this.DispatchEvent(e);
    },
    Draw : function Game_Checkbox$Draw(g) {
        var needAlpha = this.mAlpha != 0.0;
        if(needAlpha) {
            g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mAlpha));
        }
        GameFramework.widgets.ClassicWidget.prototype.Draw.apply(this, [g]);
        if((this.mCheckedRect.mWidth == 0) && (this.mCheckedImage != null) && (this.mUncheckedImage != null)) {
            if(this.mChecked) {
                g.DrawImage(this.mCheckedImage, 0, 0);
            } else {
                g.DrawImage(this.mUncheckedImage, 0, 0);
            }
        } else if((this.mCheckedRect.mWidth != 0) && (this.mUncheckedImage != null)) {
        } else if((this.mUncheckedImage == null) && (this.mCheckedImage == null)) {
            var _t1 = g.PushColor(this.mOutlineColor);
            try {
                g.FillRect(0, 0, this.mWidth, this.mHeight);
            } finally {
                _t1.Dispose();
            }
            var _t2 = g.PushColor(this.mBkgColor);
            try {
                g.FillRect(1, 1, this.mWidth - 2, this.mHeight - 2);
            } finally {
                _t2.Dispose();
            }
            if(this.mChecked) {
                var _t3 = g.PushColor(this.mCheckColor);
                try {
                    g.FillRect(3, 3, this.mWidth - 6, this.mHeight - 6);
                } finally {
                    _t3.Dispose();
                }
            }
        }
        if(needAlpha) {
            g.PopColor();
        }
    }
}
Game.Checkbox.staticInit = function Game_Checkbox$staticInit() {
}

JS_AddInitFunc(function() {
    Game.Checkbox.registerClass('Game.Checkbox', GameFramework.widgets.ClassicWidget);
});
JS_AddStaticInitFunc(function() {
    Game.Checkbox.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\widgets\Checkbox.cs
//LineMap:1=2 2=4 3=109 6=110 8=21 11=111 28=28 32=30 33=32 49=49 59=60 60=67 67=72 72=84 75=86 81=89 84=91 90=94 95=98 103=105 
//Start:widgets\ClassicWidget
/**
 * @constructor
 */
GameFramework.widgets.ClassicWidget = function GameFramework_widgets_ClassicWidget() {
    this.mWidgets = [];
    GameFramework.widgets.ClassicWidget.initializeBase(this);
}
GameFramework.widgets.ClassicWidget.prototype = {
    mWidgets : null,
    mUpdateCnt : 0,
    mParent : null,
    mAppState : null,
    mX : 0,
    mY : 0,
    mWidth : 0,
    mHeight : 0,
    mIsOver : false,
    mIsDown : false,
    mVisible : true,
    mMouseVisible : true,
    mHasFocus : false,
    mLastDrawX : 0,
    mLastDrawY : 0,
    RemoveAllWidgets : function GameFramework_widgets_ClassicWidget$RemoveAllWidgets(recursive) {
        if(recursive === undefined) {
            recursive = true;
        }

        {
            var $enum1 = ss.IEnumerator.getEnumerator(this.mWidgets);
            while($enum1.moveNext()) {
                var aChild = $enum1.get_current();
                if(recursive) {
                    aChild.RemoveAllWidgets();
                }
                aChild.mParent = null;
                aChild.mAppState = null;
            }
        }
        this.mWidgets.clear();
    },
    Dispose : function GameFramework_widgets_ClassicWidget$Dispose() {
        if(this.mAppState != null) {
            if(this.mAppState.mFocusWidget == this) {
                this.mAppState.mFocusWidget = null;
            }
            if(this.mAppState.mLastWidgetOver == this) {
                this.mAppState.mLastWidgetOver = null;
            }
            this.mAppState = null;
        }
        this.mParent = null;

        {
            var $enum2 = ss.IEnumerator.getEnumerator(this.mWidgets);
            while($enum2.moveNext()) {
                var aChild = $enum2.get_current();
                aChild.Dispose();
            }
        }
        this.mWidgets.clear();
        GameFramework.events.EventDispatcher.prototype.Dispose.apply(this);
    },
    DeferOverlay : function GameFramework_widgets_ClassicWidget$DeferOverlay() {
        this.mAppState.mDeferDraws.push(this);
    },
    GotFocus : function GameFramework_widgets_ClassicWidget$GotFocus() {
        this.mHasFocus = true;
    },
    LostFocus : function GameFramework_widgets_ClassicWidget$LostFocus() {
        this.mHasFocus = false;
    },
    Resize : function GameFramework_widgets_ClassicWidget$Resize(theX, theY, theWidth, theHeight) {
        this.mX = theX;
        this.mY = theY;
        this.mWidth = theWidth;
        this.mHeight = theHeight;
    },
    Update : function GameFramework_widgets_ClassicWidget$Update() {
        this.mUpdateCnt++;
    },
    UpdateAll : function GameFramework_widgets_ClassicWidget$UpdateAll() {
        this.Update();
        for(var i = 0; i < this.mWidgets.length; i++) {
            var aWidget = (this.mWidgets[i]);
            aWidget.UpdateAll();
        }
    },
    SetMouseVisible : function GameFramework_widgets_ClassicWidget$SetMouseVisible(mouseVisible) {
        this.mMouseVisible = mouseVisible;
        if((this.mIsOver) && (!this.mMouseVisible)) {
            this.mAppState.RehupMouse();
        }
    },
    AddWidget : function GameFramework_widgets_ClassicWidget$AddWidget(theWidget) {
        if(theWidget.mParent != null) {
            theWidget.mParent.RemoveWidget(theWidget);
        }
        this.mWidgets.push(theWidget);
        theWidget.mParent = this;
        theWidget.mAppState = this.mAppState;
        if(this.mAppState != null) {
            this.mAppState.mWantRehupMouse = true;
        }
    },
    RemoveWidget : function GameFramework_widgets_ClassicWidget$RemoveWidget(theWidget) {
        var anIdx = this.mWidgets.indexOf(theWidget);
        this.mWidgets.removeAt(anIdx);
        if(theWidget.mAppState != null) {
            if(theWidget.mAppState.mLastWidgetOver == theWidget) {
                theWidget.MouseLeave();
                theWidget.mIsOver = false;
                theWidget.mAppState.mLastWidgetOver = null;
                this.mAppState.mWantRehupMouse = true;
            }
            if(theWidget.mAppState.mFocusWidget == theWidget) {
                theWidget.LostFocus();
                theWidget.mAppState.mFocusWidget = null;
            }
        }
        theWidget.mParent = null;
        theWidget.mAppState = null;
    },
    RemoveSelf : function GameFramework_widgets_ClassicWidget$RemoveSelf() {
        if(this.mParent != null) {
            this.mParent.RemoveWidget(this);
        }
    },
    Draw : function GameFramework_widgets_ClassicWidget$Draw(g) {
    },
    DrawOverlay : function GameFramework_widgets_ClassicWidget$DrawOverlay(g) {
    },
    DrawAll : function GameFramework_widgets_ClassicWidget$DrawAll(g) {
        var aMatrixDepth = g.mMatrixDepth;
        var aColorDepth = g.mColorVector.length;
        this.Draw(g);
        JS_Assert(aMatrixDepth == g.mMatrixDepth, 'Matrix stack error - pops don\'t match pushes');
        JS_Assert(aColorDepth == g.mColorVector.length, 'Color stack error - pops don\'t match pushes');

        {
            var $enum3 = ss.IEnumerator.getEnumerator(this.mWidgets);
            while($enum3.moveNext()) {
                var aWidget = $enum3.get_current();
                if(aWidget.mVisible) {
                    g.PushTranslate(aWidget.mX, aWidget.mY);
                    aWidget.mLastDrawX = g.mMatrix.tx;
                    aWidget.mLastDrawY = g.mMatrix.ty;
                    aWidget.DrawAll(g);
                    g.PopMatrix();
                }
                JS_Assert(aMatrixDepth == g.mMatrixDepth, 'Matrix stack error - pops don\'t match pushes');
                JS_Assert(aColorDepth == g.mColorVector.length, 'Color stack error - pops don\'t match pushes');
            }
        }
    },
    Move : function GameFramework_widgets_ClassicWidget$Move(theX, theY) {
        this.mX = theX;
        this.mY = theY;
    },
    KeyDown : function GameFramework_widgets_ClassicWidget$KeyDown(theKeyCode) {
        var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_DOWN);
        aWidgetEvent.mKeyCode = theKeyCode;
        this.DispatchEvent(aWidgetEvent);
    },
    KeyUp : function GameFramework_widgets_ClassicWidget$KeyUp(theKeyCode) {
        var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_UP);
        aWidgetEvent.mKeyCode = theKeyCode;
        this.DispatchEvent(aWidgetEvent);
    },
    KeyChar : function GameFramework_widgets_ClassicWidget$KeyChar(theChar) {
        var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_CHAR);
        aWidgetEvent.mKeyChar = theChar;
        this.DispatchEvent(aWidgetEvent);
    },
    MouseEnter : function GameFramework_widgets_ClassicWidget$MouseEnter() {
        var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.MOUSE_ENTER);
        this.DispatchEvent(aWidgetEvent);
    },
    MouseLeave : function GameFramework_widgets_ClassicWidget$MouseLeave() {
        var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.MOUSE_LEAVE);
        this.DispatchEvent(aWidgetEvent);
    },
    FindWidget : function GameFramework_widgets_ClassicWidget$FindWidget(x, y) {
        for(var i = this.mWidgets.length - 1; i >= 0; --i) {
            var aWidget = (this.mWidgets[i]);
            var anOverWidget = aWidget.FindWidget(x - aWidget.mX, y - aWidget.mY);
            if(anOverWidget != null) {
                return anOverWidget;
            }
        }
        if((this.mMouseVisible) && (this.mVisible) && (this.Contains(x, y))) {
            return this;
        }
        return null;
    },
    MouseMove : function GameFramework_widgets_ClassicWidget$MouseMove(x, y) {
        for(var i = this.mWidgets.length - 1; i >= 0; i--) {
            var aWidget = (this.mWidgets[i]);
            if(aWidget.WantsMouseEvent(x - aWidget.mX, y - aWidget.mY)) {
                aWidget.MouseMove(x - aWidget.mX, y - aWidget.mY);
            }
        }
    },
    MouseDown : function GameFramework_widgets_ClassicWidget$MouseDown(x, y) {
        var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.MOUSE_DOWN);
        aWidgetEvent.mX = x;
        aWidgetEvent.mY = y;
        this.DispatchEvent(aWidgetEvent);
        if(this.mIsOver) {
            this.mIsDown = true;
        }
        for(var i = this.mWidgets.length - 1; i >= 0; i--) {
            var aWidget = (this.mWidgets[i]);
            if(aWidget.WantsMouseEvent(x - aWidget.mX, y - aWidget.mY)) {
                aWidget.MouseDown(x - aWidget.mX, y - aWidget.mY);
            }
        }
    },
    MouseClicked : function GameFramework_widgets_ClassicWidget$MouseClicked(x, y) {
        var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.CLICKED);
        aWidgetEvent.mX = x;
        aWidgetEvent.mY = y;
        this.DispatchEvent(aWidgetEvent);
    },
    MouseUp : function GameFramework_widgets_ClassicWidget$MouseUp(x, y) {
        var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.MOUSE_UP);
        aWidgetEvent.mX = x;
        aWidgetEvent.mY = y;
        this.DispatchEvent(aWidgetEvent);
        if(this.mIsOver && this.mIsDown) {
            this.MouseClicked(x, y);
        }
        this.mIsDown = false;
        for(var i = 0; i < this.mWidgets.length; i++) {
            var aWidget = (this.mWidgets[i]);
            if(aWidget.WantsMouseEvent(x - aWidget.mX, y - aWidget.mY)) {
                aWidget.MouseUp(x - aWidget.mX, y - aWidget.mY);
            }
        }
    },
    Pause : function GameFramework_widgets_ClassicWidget$Pause() {
    },
    Contains : function GameFramework_widgets_ClassicWidget$Contains(x, y) {
        return ((this.mWidth != 0) && (x >= 0) && (y >= 0) && (x < this.mWidth) && (y < this.mHeight));
    },
    WantsMouseEvent : function GameFramework_widgets_ClassicWidget$WantsMouseEvent(x, y) {
        if(this.mIsDown || this.mIsOver) {
            return true;
        }

        {
            var $enum4 = ss.IEnumerator.getEnumerator(this.mWidgets);
            while($enum4.moveNext()) {
                var aWidget = $enum4.get_current();
                if(aWidget.WantsMouseEvent(x - aWidget.mX, y - aWidget.mY)) {
                    return true;
                }
            }
        }
        return false;
    }
}
GameFramework.widgets.ClassicWidget.staticInit = function GameFramework_widgets_ClassicWidget$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.widgets.ClassicWidget.registerClass('GameFramework.widgets.ClassicWidget', GameFramework.events.EventDispatcher);
});
JS_AddStaticInitFunc(function() {
    GameFramework.widgets.ClassicWidget.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\widgets\ClassicWidget.cs
//LineMap:2=3 7=13 13=14 16=18 25=28 30=31 31=33 33=33 37=35 43=40 46=46 48=49 57=59 59=59 63=60 66=61 67=63 70=67 101=99 130=129 145=145 163=164 167=169 168=171 170=174 172=174 176=176 184=185 190=190 238=239 259=261 261=264 271=275 285=290 287=293 288=295 305=313 309=321 
//LineMap:311=321 315=323 
//Start:widgets\ClassicWidgetAppState
/**
 * @constructor
 */
GameFramework.widgets.ClassicWidgetAppState = function GameFramework_widgets_ClassicWidgetAppState() {
    this.mRootWidget = new GameFramework.widgets.ClassicWidget();
    this.mLastWidgetOver = null;
    this.mFocusWidget = null;
    this.mDeferDraws = [];
    this.mKeysDown = Array.Create((GameFramework.KeyCode.COUNT | 0), null);
    GameFramework.widgets.ClassicWidgetAppState.initializeBase(this);
    this.mRootWidget.mAppState = this;
}
GameFramework.widgets.ClassicWidgetAppState.prototype = {
    mRootWidget : null,
    mGraphics : null,
    mPaused : false,
    mLastWidgetOver : null,
    mFocusWidget : null,
    mDeferDraws : null,
    mLastMouseX : -1000,
    mLastMouseY : -1000,
    mWantRehupMouse : false,
    mKeysDown : null,
    handlePause : function GameFramework_widgets_ClassicWidgetAppState$handlePause(e) {
        this.togglePause(true);
    },
    handleUnpause : function GameFramework_widgets_ClassicWidgetAppState$handleUnpause(e) {
        this.togglePause(false);
    },
    togglePause : function GameFramework_widgets_ClassicWidgetAppState$togglePause(paused) {
        this.mPaused = paused;
    },
    SetFocus : function GameFramework_widgets_ClassicWidgetAppState$SetFocus(theWidget) {
        if(this.mFocusWidget != null) {
            this.mFocusWidget.LostFocus();
        }
        this.mFocusWidget = theWidget;
        if(this.mFocusWidget != null) {
            this.mFocusWidget.GotFocus();
        }
    },
    Update : function GameFramework_widgets_ClassicWidgetAppState$Update() {
        if(this.mWantRehupMouse) {
            this.RehupMouse();
            this.mWantRehupMouse = false;
        }
        if(this.mPaused) {
            return;
        }
        this.mRootWidget.UpdateAll();
    },
    FlushDeferDraws : function GameFramework_widgets_ClassicWidgetAppState$FlushDeferDraws() {
        for(var i = 0; i < this.mDeferDraws.length; i++) {
            var aClassicWidget = this.mDeferDraws[i];
            var _t1 = this.mGraphics.PushTranslate(aClassicWidget.mLastDrawX - this.mGraphics.mMatrix.tx, aClassicWidget.mLastDrawY - this.mGraphics.mMatrix.ty);
            try {
                aClassicWidget.DrawOverlay(this.mGraphics);
            } finally {
                _t1.Dispose();
            }
        }
        this.mDeferDraws.clear();
    },
    Draw : function GameFramework_widgets_ClassicWidgetAppState$Draw(elapsed) {
        if(this.mPaused) {
            return;
        }
        this.mGraphics.Reset();
        var aScale = 1.0;
        if(this.mGraphics.mScale != GameFramework.BaseApp.mApp.mScale) {
            aScale = GameFramework.BaseApp.mApp.mScale / this.mGraphics.mScale;
        }
        if(aScale != 1.0) {
            this.mGraphics.PushScale(aScale + 0.00000001, aScale + 0.00000001, 0, 0);
        }
        this.mGraphics.PushTranslate(this.mRootWidget.mX, this.mRootWidget.mY);
        this.mRootWidget.DrawAll(this.mGraphics);
        this.mGraphics.PopMatrix();
        this.FlushDeferDraws();
        if(aScale != 1.0) {
            this.mGraphics.PopMatrix();
        }
    },
    onEnter : function GameFramework_widgets_ClassicWidgetAppState$onEnter() {
    },
    onExit : function GameFramework_widgets_ClassicWidgetAppState$onExit() {
    },
    onPush : function GameFramework_widgets_ClassicWidgetAppState$onPush() {
    },
    onPop : function GameFramework_widgets_ClassicWidgetAppState$onPop() {
    },
    MouseUp : function GameFramework_widgets_ClassicWidgetAppState$MouseUp(x, y) {
        this.mRootWidget.MouseUp(x - this.mRootWidget.mX, y - this.mRootWidget.mY);
    },
    MouseDown : function GameFramework_widgets_ClassicWidgetAppState$MouseDown(x, y) {
        this.mRootWidget.MouseDown(x - this.mRootWidget.mX, y - this.mRootWidget.mY);
    },
    RehupMouse : function GameFramework_widgets_ClassicWidgetAppState$RehupMouse() {
        var aWidgetOver = this.mRootWidget.FindWidget(this.mLastMouseX - this.mRootWidget.mX, this.mLastMouseY - this.mRootWidget.mY);
        if(aWidgetOver != this.mLastWidgetOver) {
            if(this.mLastWidgetOver != null) {
                this.mLastWidgetOver.MouseLeave();
                this.mLastWidgetOver.mIsOver = false;
            }
            this.mLastWidgetOver = aWidgetOver;
            if(aWidgetOver != null) {
                this.mLastWidgetOver.MouseEnter();
                this.mLastWidgetOver.mIsOver = true;
            }
        }
    },
    MouseMove : function GameFramework_widgets_ClassicWidgetAppState$MouseMove(x, y) {
        this.mLastMouseX = x;
        this.mLastMouseY = y;
        this.RehupMouse();
        this.mRootWidget.MouseMove(x - this.mRootWidget.mX, y - this.mRootWidget.mY);
    },
    IsKeyDown : function GameFramework_widgets_ClassicWidgetAppState$IsKeyDown(theKeyCode) {
        return this.mKeysDown[(theKeyCode | 0)];
    },
    KeyUp : function GameFramework_widgets_ClassicWidgetAppState$KeyUp(theKeyCode) {
        this.mKeysDown[(theKeyCode | 0)] = false;
        var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_UP);
        aWidgetEvent.mKeyCode = theKeyCode;
        GameFramework.BaseApp.mApp.DispatchEvent(aWidgetEvent);
        if(this.mFocusWidget != null) {
            this.mFocusWidget.KeyUp(theKeyCode);
        }
    },
    KeyDown : function GameFramework_widgets_ClassicWidgetAppState$KeyDown(theKeyCode) {
        this.mKeysDown[(theKeyCode | 0)] = true;
        var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_DOWN);
        aWidgetEvent.mKeyCode = theKeyCode;
        GameFramework.BaseApp.mApp.DispatchEvent(aWidgetEvent);
        if(this.mFocusWidget != null) {
            this.mFocusWidget.KeyDown(theKeyCode);
        }
    },
    KeyChar : function GameFramework_widgets_ClassicWidgetAppState$KeyChar(theChar) {
        var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_CHAR);
        aWidgetEvent.mKeyChar = theChar;
        GameFramework.BaseApp.mApp.DispatchEvent(aWidgetEvent);
        if(this.mFocusWidget != null) {
            this.mFocusWidget.KeyChar(theChar);
        }
    }
}
GameFramework.widgets.ClassicWidgetAppState.staticInit = function GameFramework_widgets_ClassicWidgetAppState$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.widgets.ClassicWidgetAppState.registerClass('GameFramework.widgets.ClassicWidgetAppState', GameFramework.events.EventDispatcher, GameFramework.IAppState);
});
JS_AddStaticInitFunc(function() {
    GameFramework.widgets.ClassicWidgetAppState.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\widgets\ClassicWidgetAppState.cs
//LineMap:2=3 5=25 7=12 8=15 11=22 13=26 19=14 28=29 52=58 59=67 63=72 74=81 81=83 86=92 90=97 91=101 94=105 99=111 112=125 116=130 120=135 122=140 127=148 140=163 141=165 165=190 168=194 175=202 178=206 187=216 
//Start:widgets\Dialog
/**
 * @constructor
 */
GameFramework.widgets.DialogEvent = function GameFramework_widgets_DialogEvent(theType, theDialog) {
    GameFramework.widgets.DialogEvent.initializeBase(this, [theType]);
    this.mDialog = theDialog;
}
GameFramework.widgets.DialogEvent.prototype = {
    mCloseResult : -1,
    mDialog : null,
    WasYesPressed : function GameFramework_widgets_DialogEvent$WasYesPressed() {
        return this.mCloseResult == GameFramework.widgets.Dialog.ID_YES;
    }
}
GameFramework.widgets.DialogEvent.staticInit = function GameFramework_widgets_DialogEvent$staticInit() {
    GameFramework.widgets.DialogEvent.CLOSED = 'closed';
}

JS_AddInitFunc(function() {
    GameFramework.widgets.DialogEvent.registerClass('GameFramework.widgets.DialogEvent', GameFramework.events.Event);
});
JS_AddStaticInitFunc(function() {
    GameFramework.widgets.DialogEvent.staticInit();
});
/**
 * @constructor
 */
GameFramework.widgets.Dialog = function GameFramework_widgets_Dialog(theComponentImage, theButtonComponentImage, isModal, theDialogHeader, theDialogLines, theDialogFooter, theButtonMode) {
    this.mColors = Array.Create(6, null, 0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff, 0xffffffff);
    this.mBackgroundInsets = new GameFramework.Insets();
    this.mContentInsets = new GameFramework.Insets();
    GameFramework.widgets.Dialog.initializeBase(this);
    this.mResult = 0x7fffffff;
    this.mComponentImage = theComponentImage;
    this.mStretchBG = false;
    this.mIsKilling = false;
    this.mIsModal = isModal;
    this.mContentInsets = new GameFramework.Insets(24, 24, 24, 24);
    this.mTextAlign = 0;
    this.mLineSpacingOffset = 0;
    this.mSpaceAfterHeader = 0;
    this.mButtonSidePadding = 0;
    this.mButtonHorzSpacing = 8;
    this.mDialogHeader = theDialogHeader;
    this.mDialogFooter = theDialogFooter;
    this.mButtonMode = theButtonMode;
    if((this.mButtonMode == GameFramework.widgets.Dialog.BUTTONS_YES_NO) || (this.mButtonMode == GameFramework.widgets.Dialog.BUTTONS_OK_CANCEL)) {
        this.mYesButton = this.CreateButton(theButtonComponentImage);
        this.mYesButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.HandleYesBtnClicked));
        this.mNoButton = this.CreateButton(theButtonComponentImage);
        this.mNoButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.HandleNoBtnClicked));
        if(this.mButtonMode == GameFramework.widgets.Dialog.BUTTONS_YES_NO) {
            this.mYesButton.mLabel = 'YES';
            this.mNoButton.mLabel = 'NO';
        } else {
            this.mYesButton.mLabel = 'OK';
            this.mNoButton.mLabel = 'CANCEL';
        }
    } else if(this.mButtonMode == GameFramework.widgets.Dialog.BUTTONS_FOOTER) {
        this.mYesButton = this.CreateButton(theButtonComponentImage);
        this.mYesButton.mLabel = this.mDialogFooter;
        this.mYesButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.HandleYesBtnClicked));
        this.AddWidget(this.mYesButton);
        this.mNoButton = null;
    } else {
        this.mYesButton = null;
        this.mNoButton = null;
        this.mNumButtons = 0;
    }
    this.mDialogLines = theDialogLines;
    this.mButtonHeight = (theButtonComponentImage == null) ? 24 : theButtonComponentImage.mHeight;
    this.mHeaderFont = null;
    this.mLinesFont = null;
    this.mDragging = false;
    if(theButtonComponentImage == null) {
        this.mColors[GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT] = 0xff000000;
        this.mColors[GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT_HILITE] = 0xff000000;
    } else {
        this.mColors[GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT] = 0xffffffff;
        this.mColors[GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT_HILITE] = 0xffffffff;
    }
}
GameFramework.widgets.Dialog.prototype = {
    mColors : null,
    mComponentImage : null,
    mStretchBG : null,
    mYesButton : null,
    mNoButton : null,
    mNumButtons : 0,
    mDialogHeader : null,
    mDialogFooter : null,
    mDialogLines : null,
    mIsKilling : null,
    mButtonMode : 0,
    mHeaderFont : null,
    mLinesFont : null,
    mTextAlign : 0,
    mLineSpacingOffset : 0,
    mButtonHeight : 0,
    mBackgroundInsets : null,
    mContentInsets : null,
    mSpaceAfterHeader : 0,
    mAllowDragging : null,
    mDragging : null,
    mDragMouseX : 0,
    mDragMouseY : 0,
    mIsModal : null,
    mResult : 0,
    mButtonHorzSpacing : 0,
    mButtonSidePadding : 0,
    CreateButton : function GameFramework_widgets_Dialog$CreateButton(theButtonImage) {
        var ret = new GameFramework.widgets.ButtonWidget(0);
        this.ConfigureButton(ret, theButtonImage);
        return ret;
    },
    ConfigureButton : function GameFramework_widgets_Dialog$ConfigureButton(theBtn, theButtonImage) {
        theBtn.mButtonImage = theButtonImage;
        theBtn.mOverImage = theButtonImage;
        theBtn.mOverCel = ((Math.min(1, theButtonImage.mNumFrames - 1)) | 0);
        theBtn.mDownImage = theButtonImage;
        theBtn.mDownCel = ((Math.min(2, theButtonImage.mNumFrames - 1)) | 0);
        ;
        theBtn.mWidth = theBtn.mButtonImage.mWidth;
        theBtn.mHeight = theBtn.mButtonImage.mHeight;
        this.AddWidget(theBtn);
    },
    SetColor : function GameFramework_widgets_Dialog$SetColor(theIdx, theColor) {
        if(theIdx == GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT) {
            if(this.mYesButton != null) {
                this.mYesButton.SetColor(GameFramework.widgets.ButtonWidget.COLOR_LABEL, theColor);
            }
            if(this.mNoButton != null) {
                this.mNoButton.SetColor(GameFramework.widgets.ButtonWidget.COLOR_LABEL, theColor);
            }
        } else if(theIdx == GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT_HILITE) {
            if(this.mYesButton != null) {
                this.mYesButton.SetColor(GameFramework.widgets.ButtonWidget.COLOR_LABEL_HILITE, theColor);
            }
            if(this.mNoButton != null) {
                this.mNoButton.SetColor(GameFramework.widgets.ButtonWidget.COLOR_LABEL_HILITE, theColor);
            }
        }
        this.mColors[theIdx] = theColor;
    },
    SetButtonFont : function GameFramework_widgets_Dialog$SetButtonFont(theFont) {
        if(this.mYesButton != null) {
            this.mYesButton.SetFont(theFont);
        }
        if(this.mNoButton != null) {
            this.mNoButton.SetFont(theFont);
        }
    },
    SetHeaderFont : function GameFramework_widgets_Dialog$SetHeaderFont(theFont) {
        this.mHeaderFont = theFont;
    },
    SetLinesFont : function GameFramework_widgets_Dialog$SetLinesFont(theFont) {
        this.mLinesFont = theFont;
    },
    EnsureFonts : function GameFramework_widgets_Dialog$EnsureFonts() {
    },
    GetPreferredHeight : function GameFramework_widgets_Dialog$GetPreferredHeight(theWidth) {
        this.EnsureFonts();
        var aHeight = this.mContentInsets.mTop + this.mContentInsets.mBottom + this.mBackgroundInsets.mTop + this.mBackgroundInsets.mBottom;
        var needSpace = false;
        if(this.mDialogHeader.length > 0 && this.mHeaderFont != null) {
            aHeight += this.mHeaderFont.GetHeight() - this.mHeaderFont.GetAscentPadding();
            needSpace = true;
        }
        if(this.mDialogLines.length > 0 && this.mLinesFont != null) {
            if(needSpace) {
                aHeight += this.mSpaceAfterHeader;
            }
            var aFontDrawData = new GameFramework.resources.FontDrawData();
            GameFramework.gfx.Graphics.GetDrawStringData(this.mDialogLines, this.mLinesFont, theWidth - this.mContentInsets.mLeft - this.mContentInsets.mRight - this.mBackgroundInsets.mLeft - this.mBackgroundInsets.mRight - 4, 0, GameFramework.gfx.ETextOverflowMode.Wrap, this.mLineSpacingOffset, aFontDrawData);
            aHeight += aFontDrawData.mFontDescent + aFontDrawData.mFontAscent;
            needSpace = true;
        }
        if((this.mDialogFooter != null) && (this.mDialogFooter.length != 0) && (this.mButtonMode != GameFramework.widgets.Dialog.BUTTONS_FOOTER) && this.mHeaderFont != null) {
            if(needSpace) {
                aHeight += this.mLinesFont.GetHeight() - this.mLinesFont.GetAscent();
            }
            aHeight += (this.mHeaderFont.GetLineSpacing() | 0);
            needSpace = true;
        }
        if(this.mYesButton != null) {
            if(needSpace) {
                aHeight += this.mLinesFont.GetHeight() - this.mLinesFont.GetAscent();
            }
            aHeight += this.mButtonHeight + 8;
        }
        return aHeight;
    },
    Draw : function GameFramework_widgets_Dialog$Draw(g) {
        this.mAppState.FlushDeferDraws();
        this.EnsureFonts();
        var aBoxRect = new GameFramework.TRect(this.mBackgroundInsets.mLeft, this.mBackgroundInsets.mTop, this.mWidth - this.mBackgroundInsets.mLeft - this.mBackgroundInsets.mRight, this.mHeight - this.mBackgroundInsets.mTop - this.mBackgroundInsets.mBottom);
        if(this.mComponentImage != null) {
            if(!this.mStretchBG) {
                g.DrawImageBox(this.mComponentImage, aBoxRect.mX, aBoxRect.mY, aBoxRect.mWidth, aBoxRect.mHeight, 0);
            }
        } else {
            var _t1 = g.PushColor(this.mColors[GameFramework.widgets.Dialog.COLOR_BKG]);
            try {
                g.FillRect(12 + 1, 12 + 1, this.mWidth - 12 * 2 - 2, this.mHeight - 12 * 2 - 2);
            } finally {
                _t1.Dispose();
            }
            var _t2 = g.PushColor(0x7f000000);
            try {
                g.FillRect(this.mWidth - 12, 12 * 2, 12, this.mHeight - 12 * 3);
                g.FillRect(12 * 2, this.mHeight - 12, this.mWidth - 12 * 2, 12);
            } finally {
                _t2.Dispose();
            }
        }
        var aCurY = this.mContentInsets.mTop + this.mBackgroundInsets.mTop;
        if(this.mDialogHeader.length > 0) {
            aCurY += this.mHeaderFont.GetAscent() - this.mHeaderFont.GetAscentPadding();
            g.SetFont(this.mHeaderFont);
            var _t3 = g.PushColor(this.mColors[GameFramework.widgets.Dialog.COLOR_HEADER]);
            try {
                g.DrawStringEx(this.mDialogHeader, 0, aCurY, this.mWidth, 0);
            } finally {
                _t3.Dispose();
            }
            aCurY += this.mHeaderFont.GetHeight() - this.mHeaderFont.GetAscent();
            var lastChar = -1;
            while(true) {
                lastChar = this.mDialogHeader.indexOf(String.fromCharCode(10), lastChar + 1);
                if(lastChar == -1) {
                    break;
                }
                aCurY += this.mHeaderFont.GetHeight();
            }
            aCurY += this.mSpaceAfterHeader;
        }
        g.SetFont(this.mLinesFont);
        var aRect = new GameFramework.TRect(this.mBackgroundInsets.mLeft + this.mContentInsets.mLeft + 2, aCurY, this.mWidth - this.mContentInsets.mLeft - this.mContentInsets.mRight - this.mBackgroundInsets.mLeft - this.mBackgroundInsets.mRight - 4, 0);
        var _t4 = g.PushColor(this.mColors[GameFramework.widgets.Dialog.COLOR_LINES]);
        try {
            g.DrawStringEx(this.mDialogLines, this.mBackgroundInsets.mLeft + this.mContentInsets.mLeft + 2, aCurY + this.mLinesFont.GetAscent(), this.mWidth - this.mContentInsets.mLeft - this.mContentInsets.mRight - this.mBackgroundInsets.mLeft - this.mBackgroundInsets.mRight - 4, this.mTextAlign, GameFramework.gfx.ETextOverflowMode.Wrap, this.mLineSpacingOffset);
        } finally {
            _t4.Dispose();
        }
        if((this.mDialogFooter != null) && (this.mDialogFooter.length != 0) && (this.mButtonMode != GameFramework.widgets.Dialog.BUTTONS_FOOTER)) {
            aCurY += 8;
            aCurY += this.mHeaderFont.GetLineSpacing();
            g.SetFont(this.mHeaderFont);
            var _t5 = g.PushColor(this.mColors[GameFramework.widgets.Dialog.COLOR_FOOTER]);
            try {
                g.DrawStringEx(this.mDialogFooter, 0, aCurY, this.mWidth, 0);
            } finally {
                _t5.Dispose();
            }
        }
    },
    Resize : function GameFramework_widgets_Dialog$Resize(theX, theY, theWidth, theHeight) {
        GameFramework.widgets.ClassicWidget.prototype.Resize.apply(this, [theX, theY, theWidth, theHeight]);
        if((this.mYesButton != null) && (this.mNoButton != null)) {
            var aBtnWidth = (this.mWidth - this.mContentInsets.mLeft - this.mContentInsets.mRight - this.mBackgroundInsets.mLeft - this.mBackgroundInsets.mRight - this.mButtonSidePadding * 2 - this.mButtonHorzSpacing) / 2;
            var aBtnHeight = this.mButtonHeight;
            this.mYesButton.Resize(this.mBackgroundInsets.mLeft + this.mContentInsets.mLeft + this.mButtonSidePadding, this.mHeight - this.mContentInsets.mBottom - this.mBackgroundInsets.mBottom - aBtnHeight, aBtnWidth, aBtnHeight);
            this.mNoButton.Resize(this.mYesButton.mX + aBtnWidth + this.mButtonHorzSpacing, this.mYesButton.mY, aBtnWidth, aBtnHeight);
        } else if(this.mYesButton != null) {
            var aBtnHeight_2 = this.mButtonHeight;
            this.mYesButton.Resize(this.mContentInsets.mLeft + this.mBackgroundInsets.mLeft, this.mHeight - this.mContentInsets.mBottom - this.mBackgroundInsets.mBottom - aBtnHeight_2, this.mWidth - this.mContentInsets.mLeft - this.mContentInsets.mRight - this.mBackgroundInsets.mLeft - this.mBackgroundInsets.mRight, aBtnHeight_2);
        }
    },
    MouseDown : function GameFramework_widgets_Dialog$MouseDown(x, y) {
        if((this.mIsOver) && (this.mAllowDragging) && (!this.mDragging) && (GameFramework.widgets.ClassicWidget.prototype.Contains.apply(this, [x, y]))) {
            this.mDragging = true;
            this.mDragMouseX = x;
            this.mDragMouseY = y;
        }
        GameFramework.widgets.ClassicWidget.prototype.MouseDown.apply(this, [x, y]);
    },
    MouseMove : function GameFramework_widgets_Dialog$MouseMove(x, y) {
        GameFramework.widgets.ClassicWidget.prototype.MouseMove.apply(this, [x, y]);
        if(this.mDragging) {
            var aNewX = this.mX + x - this.mDragMouseX;
            var aNewY = this.mY + y - this.mDragMouseY;
            if(aNewX < -8) {
                aNewX = -8;
            } else if(aNewX + this.mWidth > GameFramework.BaseApp.mApp.mWidth + 8) {
                aNewX = GameFramework.BaseApp.mApp.mWidth - this.mWidth + 8;
            }
            if(aNewY < -8) {
                aNewY = -8;
            } else if(aNewY + this.mHeight > GameFramework.BaseApp.mApp.mHeight + 8) {
                aNewY = GameFramework.BaseApp.mApp.mHeight - this.mHeight + 8;
            }
            this.mDragMouseX = this.mX + x - aNewX;
            this.mDragMouseY = this.mY + y - aNewY;
            if(this.mDragMouseX < 8) {
                this.mDragMouseX = 8;
            } else if(this.mDragMouseX > this.mWidth - 9) {
                this.mDragMouseX = this.mWidth - 9;
            }
            if(this.mDragMouseY < 8) {
                this.mDragMouseY = 8;
            } else if(this.mDragMouseY > this.mHeight - 9) {
                this.mDragMouseY = this.mHeight - 9;
            }
            this.Move(aNewX, aNewY);
        }
    },
    Contains : function GameFramework_widgets_Dialog$Contains(x, y) {
        return this.mIsModal || GameFramework.widgets.ClassicWidget.prototype.Contains.apply(this, [x, y]);
    },
    MouseUp : function GameFramework_widgets_Dialog$MouseUp(x, y) {
        if(this.mDragging) {
            this.mDragging = false;
        }
        GameFramework.widgets.ClassicWidget.prototype.MouseUp.apply(this, [x, y]);
    },
    Update : function GameFramework_widgets_Dialog$Update() {
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
    },
    IsModal : function GameFramework_widgets_Dialog$IsModal() {
        return this.mIsModal;
    },
    Kill : function GameFramework_widgets_Dialog$Kill() {
        if(this.mIsKilling) {
            return;
        }
        this.mIsKilling = true;
        var e = new GameFramework.widgets.DialogEvent(GameFramework.widgets.DialogEvent.CLOSED, this);
        e.mCloseResult = this.mResult;
        this.DispatchEvent(e);
        this.mParent.RemoveWidget(this);
    },
    HandleYesBtnClicked : function GameFramework_widgets_Dialog$HandleYesBtnClicked(theEvent) {
        if(!this.mIsKilling) {
            this.mResult = GameFramework.widgets.Dialog.ID_YES;
            this.Kill();
        }
    },
    HandleNoBtnClicked : function GameFramework_widgets_Dialog$HandleNoBtnClicked(theEvent) {
        if(!this.mIsKilling) {
            this.mResult = GameFramework.widgets.Dialog.ID_NO;
            this.Kill();
        }
    }
}
GameFramework.widgets.Dialog.staticInit = function GameFramework_widgets_Dialog$staticInit() {
    GameFramework.widgets.Dialog.BUTTONS_NONE = 0;
    GameFramework.widgets.Dialog.BUTTONS_YES_NO = 1;
    GameFramework.widgets.Dialog.BUTTONS_OK_CANCEL = 2;
    GameFramework.widgets.Dialog.BUTTONS_FOOTER = 3;
    GameFramework.widgets.Dialog.COLOR_HEADER = 0;
    GameFramework.widgets.Dialog.COLOR_LINES = 1;
    GameFramework.widgets.Dialog.COLOR_FOOTER = 2;
    GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT = 3;
    GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT_HILITE = 4;
    GameFramework.widgets.Dialog.COLOR_BKG = 5;
    GameFramework.widgets.Dialog.COLOR_OUTLINE = 6;
    GameFramework.widgets.Dialog.ID_YES = 1000;
    GameFramework.widgets.Dialog.ID_NO = 1001;
    GameFramework.widgets.Dialog.ID_OK = 1000;
    GameFramework.widgets.Dialog.ID_CANCEL = 1001;
    GameFramework.widgets.Dialog.ID_FOOTER = 1000;
}

JS_AddInitFunc(function() {
    GameFramework.widgets.Dialog.registerClass('GameFramework.widgets.Dialog', GameFramework.widgets.ClassicWidget);
});
JS_AddStaticInitFunc(function() {
    GameFramework.widgets.Dialog.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\widgets\Dialog.cs
//LineMap:2=13 5=22 7=21 8=23 12=17 15=26 22=15 27=33 30=88 32=48 33=74 36=89 47=101 50=105 56=118 64=125 68=126 70=131 73=135 76=139 78=140 82=145 83=147 84=152 86=155 87=158 95=165 129=172 143=185 146=191 151=198 158=203 160=207 165=213 172=221 190=245 193=249 194=251 
//LineMap:200=258 204=264 207=268 209=271 216=279 222=286 228=293 229=295 236=304 238=307 241=308 247=310 250=312 258=317 259=319 262=323 266=325 272=327 273=329 279=336 281=339 283=343 284=353 288=355 294=359 298=364 302=366 311=370 314=374 318=379 321=380 323=384 324=386 
//LineMap:328=391 330=395 332=398 342=409 346=414 348=417 349=419 351=422 352=424 354=427 356=430 357=432 359=435 360=437 366=444 373=452 383=464 392=474 393=476 396=480 419=35 423=40 430=50 
//Start:widgets\EditWidget
/**
 * @constructor
 */
GameFramework.widgets.WidthCheckEntry = function GameFramework_widgets_WidthCheckEntry() {
}
GameFramework.widgets.WidthCheckEntry.prototype = {
    mFontResource : null,
    mWidth : 0
}
GameFramework.widgets.WidthCheckEntry.staticInit = function GameFramework_widgets_WidthCheckEntry$staticInit() {
}

JS_AddInitFunc(function() {
    GameFramework.widgets.WidthCheckEntry.registerClass('GameFramework.widgets.WidthCheckEntry', null);
});
JS_AddStaticInitFunc(function() {
    GameFramework.widgets.WidthCheckEntry.staticInit();
});
/**
 * @constructor
 */
GameFramework.widgets.EditWidget = function GameFramework_widgets_EditWidget() {
    this.mWidthCheckList = [];
    this.mColors = Array.Create(5, null, 0xffffffff, 0xff000000, 0xff000000, 0xff000000, 0xffffffff);
    GameFramework.widgets.EditWidget.initializeBase(this);
    this.mFont = null;
    this.mHadDoubleClick = false;
    this.mHilitePos = -1;
    this.mLastModifyIdx = -1;
    this.mLeftPos = 0;
    this.mUndoCursor = 0;
    this.mUndoHilitePos = 0;
    this.mLastModifyIdx = 0;
    this.mBlinkAcc = 0;
    this.mCursorPos = 0;
    this.mShowingCursor = false;
    this.mMaxChars = -1;
    this.mMaxPixels = -1;
    this.mPasswordChar = (0 | 0);
    this.mBlinkDelay = 40;
    this.mFontJustification = -1;
}
GameFramework.widgets.EditWidget.prototype = {
    mValidator : null,
    mString : '',
    mPasswordDisplayString : null,
    mFont : null,
    mFontJustification : 0,
    mWidthCheckList : null,
    mShowingCursor : null,
    mHadDoubleClick : null,
    mCursorPos : 0,
    mHilitePos : 0,
    mBlinkAcc : 0,
    mBlinkDelay : 0,
    mLeftPos : 0,
    mMaxChars : 0,
    mMaxPixels : 0,
    mPasswordChar : 0,
    mUndoString : null,
    mUndoCursor : 0,
    mUndoHilitePos : 0,
    mLastModifyIdx : 0,
    mColors : null,
    get_FontJustification : function GameFramework_widgets_EditWidget$get_FontJustification() {
        return this.mFontJustification;
    },
    set_FontJustification : function GameFramework_widgets_EditWidget$set_FontJustification(value) {
        this.mFontJustification = value;
    },
    SetFont : function GameFramework_widgets_EditWidget$SetFont(theFont) {
        this.mFont = theFont;
    },
    GetFont : function GameFramework_widgets_EditWidget$GetFont() {
        return this.mFont;
    },
    ClearWidthCheckFonts : function GameFramework_widgets_EditWidget$ClearWidthCheckFonts() {
        this.mWidthCheckList.clear();
    },
    AddWidthCheckFont : function GameFramework_widgets_EditWidget$AddWidthCheckFont(theFont, theMaxPixels) {
        var aWidthCheckEntry = new GameFramework.widgets.WidthCheckEntry();
        aWidthCheckEntry.mFontResource = theFont;
        aWidthCheckEntry.mWidth = theMaxPixels;
        this.mWidthCheckList.push(aWidthCheckEntry);
    },
    SetText : function GameFramework_widgets_EditWidget$SetText(theText, leftPosToZero) {
        this.mString = theText;
        this.mCursorPos = this.mString.length;
        this.mHilitePos = 0;
        if(leftPosToZero) {
            this.mLeftPos = 0;
        } else {
            this.FocusCursor(true);
        }
    },
    GetText : function GameFramework_widgets_EditWidget$GetText() {
        return this.mString;
    },
    GetDisplayString : function GameFramework_widgets_EditWidget$GetDisplayString() {
        if(this.mPasswordChar == 0) {
            return this.mString;
        }
        if((this.mPasswordDisplayString == null) || (this.mPasswordDisplayString.length != this.mString.length)) {
            this.mPasswordDisplayString = '';
            for(var i = 0; i < this.mString.length; i++) {
                this.mPasswordDisplayString += String.fromCharCode(this.mPasswordChar);
            }
        }
        return this.mPasswordDisplayString;
    },
    WantsFocus : function GameFramework_widgets_EditWidget$WantsFocus() {
        return true;
    },
    Resize : function GameFramework_widgets_EditWidget$Resize(theX, theY, theWidth, theHeight) {
        GameFramework.widgets.ClassicWidget.prototype.Resize.apply(this, [theX, theY, theWidth, theHeight]);
        this.FocusCursor(false);
    },
    Draw : function GameFramework_widgets_EditWidget$Draw(g) {
        var aString = this.GetDisplayString();
        var _t1 = g.PushColor(this.mColors[GameFramework.widgets.EditWidget.COLOR_OUTLINE]);
        try {
            g.FillRect(-1, -1, this.mWidth - 1, this.mHeight - 1);
        } finally {
            _t1.Dispose();
        }
        var _t2 = g.PushColor(this.mColors[GameFramework.widgets.EditWidget.COLOR_BKG]);
        try {
            g.FillRect(1, 1, this.mWidth - 2, this.mHeight - 2);
        } finally {
            _t2.Dispose();
        }
        g.SetFont(this.mFont);
        var strWidth = 0.0;
        if(this.mFontJustification != -1) {
            strWidth = this.mFont.StringWidth(this.mString);
        }
        for(var aPass = 0; aPass < 2; aPass++) {
            var aX = 0;
            var aCursorPos = 0;
            for(var i = this.mLeftPos; i < this.mString.length; i++) {
                var aChar = this.mString.charCodeAt(i);
                var aNextChar = (0 | 0);
                if(i < this.mString.length - 1) {
                    aNextChar = this.mString.charCodeAt(i + 1);
                }
                var aWidth = this.mFont.CharWidthKern(aChar, aNextChar);
                if((this.mHilitePos != -1) && ((i >= this.mHilitePos) && (i < this.mCursorPos)) || ((i >= this.mCursorPos) && (i < this.mHilitePos))) {
                    if(aPass == 0) {
                        var _t3 = g.PushColor(this.mColors[GameFramework.widgets.EditWidget.COLOR_HILITE]);
                        try {
                            g.FillRect(this.applyJustification(aX, strWidth), 1, aWidth + 3, this.mHeight - 2);
                        } finally {
                            _t3.Dispose();
                        }
                    } else {
                        var _t4 = g.PushColor(this.mColors[GameFramework.widgets.EditWidget.COLOR_HILITE_TEXT]);
                        try {
                            this.mFont.Draw(g, '' + String.fromCharCode(aChar), this.applyJustification(aX, strWidth), (this.mHeight - this.mFont.GetHeight()) / 2 + this.mFont.GetAscent());
                        } finally {
                            _t4.Dispose();
                        }
                    }
                } else {
                    if(aPass == 1) {
                        var _t5 = g.PushColor(this.mColors[GameFramework.widgets.EditWidget.COLOR_TEXT]);
                        try {
                            this.mFont.Draw(g, '' + String.fromCharCode(aChar), this.applyJustification(aX, strWidth), (this.mHeight - this.mFont.GetHeight()) / 2 + this.mFont.GetAscent());
                        } finally {
                            _t5.Dispose();
                        }
                    }
                }
                aX += aWidth;
                if((i == this.mCursorPos - 1) && (aPass == 0)) {
                    aCursorPos = aX;
                }
            }
            if((aPass == 0) && (this.mShowingCursor)) {
                aCursorPos = this.applyJustification(aCursorPos, strWidth);
                var _t6 = g.PushColor(this.mColors[GameFramework.widgets.EditWidget.COLOR_HILITE]);
                try {
                    g.FillRect(aCursorPos + 3.0, 1.0, 3.0, this.mHeight - 2);
                } finally {
                    _t6.Dispose();
                }
            }
        }
    },
    applyJustification : function GameFramework_widgets_EditWidget$applyJustification(theVal, theStrLen) {
        if(this.mFontJustification == -1) {
            return theVal;
        } else if(this.mFontJustification == 0) {
            return theVal + (this.mWidth - theStrLen) / 2.0;
        }
        return theVal + (this.mWidth - theStrLen);
    },
    GotFocus : function GameFramework_widgets_EditWidget$GotFocus() {
        GameFramework.widgets.ClassicWidget.prototype.GotFocus.apply(this);
        this.mShowingCursor = true;
        this.mBlinkAcc = 0;
    },
    LostFocus : function GameFramework_widgets_EditWidget$LostFocus() {
        GameFramework.widgets.ClassicWidget.prototype.LostFocus.apply(this);
        this.mShowingCursor = false;
    },
    Update : function GameFramework_widgets_EditWidget$Update() {
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
        if(this.mHasFocus) {
            if(++this.mBlinkAcc > this.mBlinkDelay) {
                this.mBlinkAcc = 0;
                this.mShowingCursor = !this.mShowingCursor;
            }
        }
    },
    EnforceMaxPixels : function GameFramework_widgets_EditWidget$EnforceMaxPixels() {
        if(this.mMaxPixels <= 0 && this.mWidthCheckList.length == 0) {
            return;
        }
        if(this.mWidthCheckList.length == 0) {
            while(this.mFont.StringWidth(this.mString) > this.mMaxPixels) {
                this.mString = this.mString.substr(0, this.mString.length - 1);
            }
            return;
        }

        {
            var $srcArray7 = this.mWidthCheckList;
            for(var $enum7 = 0; $enum7 < $srcArray7.length; $enum7++) {
                var aWidthCheckEntry = $srcArray7[$enum7];
                var aWidth = aWidthCheckEntry.mWidth;
                if(aWidth <= 0) {
                    aWidth = this.mMaxPixels;
                    if(aWidth <= 0) {
                        continue;
                    }
                }
                while(aWidthCheckEntry.mFontResource.StringWidth(this.mString) > aWidth) {
                    this.mString = this.mString.substr(0, this.mString.length - 1);
                }
            }
        }
    },
    IsPartOfWord : function GameFramework_widgets_EditWidget$IsPartOfWord(theChar) {
        return (((theChar >= 65) && (theChar <= 90)) || ((theChar >= 97) && (theChar <= 122)) || ((theChar >= 48) && (theChar <= 57)) || ((theChar >= 0xbf) && (theChar <= 0x2c7)) || (theChar == 95));
    },
    ProcessKey : function GameFramework_widgets_EditWidget$ProcessKey(theKey, theChar) {
        var shiftDown = this.mAppState.IsKeyDown(GameFramework.KeyCode.Shift);
        var controlDown = this.mAppState.IsKeyDown(GameFramework.KeyCode.Control);
        if((theKey == GameFramework.KeyCode.Shift) || (theKey == GameFramework.KeyCode.Control) || (theKey == GameFramework.KeyCode.Command)) {
            return;
        }
        var bigChange = false;
        var removeHilite = !shiftDown;
        if(shiftDown && (this.mHilitePos == -1)) {
            this.mHilitePos = this.mCursorPos;
        }
        var anOldString = this.mString;
        var anOldCursorPos = this.mCursorPos;
        var anOldHilitePos = this.mHilitePos;
        var anOldLeftPos = this.mLeftPos;
        if(theKey == GameFramework.KeyCode.Left) {
            if(controlDown) {
                while((this.mCursorPos > 0) && (!this.IsPartOfWord(this.mString.charCodeAt(this.mCursorPos - 1)))) {
                    this.mCursorPos--;
                }
                while((this.mCursorPos > 0) && (this.IsPartOfWord(this.mString.charCodeAt(this.mCursorPos - 1)))) {
                    this.mCursorPos--;
                }
            } else if(shiftDown || (this.mHilitePos == -1)) {
                this.mCursorPos--;
            } else {
                this.mCursorPos = ((Math.min(this.mCursorPos, this.mHilitePos)) | 0);
            }
        } else if(theKey == GameFramework.KeyCode.Right) {
            if(controlDown) {
                while((this.mCursorPos < (this.mString.length | 0) - 1) && (this.IsPartOfWord(this.mString.charCodeAt(this.mCursorPos + 1)))) {
                    this.mCursorPos++;
                }
                while((this.mCursorPos < (this.mString.length | 0) - 1) && (!this.IsPartOfWord(this.mString.charCodeAt(this.mCursorPos + 1)))) {
                    this.mCursorPos++;
                }
            }
            if(shiftDown || (this.mHilitePos == -1)) {
                this.mCursorPos++;
            } else {
                this.mCursorPos = ((Math.max(this.mCursorPos, this.mHilitePos)) | 0);
            }
        } else if(theKey == GameFramework.KeyCode.Back) {
            if(this.mString.length > 0) {
                if((this.mHilitePos != -1) && (this.mHilitePos != this.mCursorPos)) {
                    this.mString = this.mString.substr(0, ((Math.min(this.mCursorPos, this.mHilitePos)) | 0)) + this.mString.substr(((Math.max(this.mCursorPos, this.mHilitePos)) | 0));
                    this.mCursorPos = ((Math.min(this.mCursorPos, this.mHilitePos)) | 0);
                    this.mHilitePos = -1;
                    bigChange = true;
                } else {
                    if(this.mCursorPos > 0) {
                        this.mString = this.mString.substr(0, this.mCursorPos - 1) + this.mString.substr(this.mCursorPos);
                    } else {
                        this.mString = this.mString.substr(this.mCursorPos);
                    }
                    this.mCursorPos--;
                    this.mHilitePos = -1;
                    if(this.mCursorPos != this.mLastModifyIdx) {
                        bigChange = true;
                    }
                    this.mLastModifyIdx = this.mCursorPos - 1;
                }
            }
        } else if(theKey == GameFramework.KeyCode.Delete) {
            if(this.mString.length > 0) {
                if((this.mHilitePos != -1) && (this.mHilitePos != this.mCursorPos)) {
                    this.mString = this.mString.substr(0, ((Math.min(this.mCursorPos, this.mHilitePos)) | 0)) + this.mString.substr(((Math.max(this.mCursorPos, this.mHilitePos)) | 0));
                    this.mCursorPos = ((Math.min(this.mCursorPos, this.mHilitePos)) | 0);
                    this.mHilitePos = -1;
                    bigChange = true;
                } else {
                    if(this.mCursorPos < (this.mString.length | 0)) {
                        this.mString = this.mString.substr(0, this.mCursorPos) + this.mString.substr(this.mCursorPos + 1);
                    }
                    if(this.mCursorPos != this.mLastModifyIdx) {
                        bigChange = true;
                    }
                    this.mLastModifyIdx = this.mCursorPos;
                }
            }
        } else if(theKey == GameFramework.KeyCode.Home) {
            this.mCursorPos = 0;
        } else if(theKey == GameFramework.KeyCode.End) {
            this.mCursorPos = this.mString.length;
        } else if(theKey == GameFramework.KeyCode.Return) {
            var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.EDIT_TEXT);
            aWidgetEvent.mString = this.mString;
            this.DispatchEvent(aWidgetEvent);
        } else {
            var uTheChar = (theChar | 0);
            var aString = '' + String.fromCharCode(theChar);
            var range = 127;
            if((uTheChar >= 32) && (uTheChar <= range) && (this.mFont.StringWidth(aString) > 0) && this.mValidator.EditWidgetAllowChar(this, theChar)) {
                if((this.mHilitePos != -1) && (this.mHilitePos != this.mCursorPos)) {
                    this.mString = this.mString.substr(0, ((Math.min(this.mCursorPos, this.mHilitePos)) | 0)) + String.fromCharCode(theChar) + this.mString.substr(((Math.max(this.mCursorPos, this.mHilitePos)) | 0));
                    this.mCursorPos = ((Math.min(this.mCursorPos, this.mHilitePos)) | 0);
                    this.mHilitePos = -1;
                    bigChange = true;
                } else {
                    this.mString = this.mString.substr(0, this.mCursorPos) + String.fromCharCode(theChar) + this.mString.substr(this.mCursorPos);
                    if(this.mCursorPos != this.mLastModifyIdx + 1) {
                        bigChange = true;
                    }
                    this.mLastModifyIdx = this.mCursorPos;
                    this.mHilitePos = -1;
                }
                this.mCursorPos++;
                this.FocusCursor(false);
            } else {
                removeHilite = false;
            }
        }
        if((this.mMaxChars != -1) && ((this.mString.length | 0) > this.mMaxChars)) {
            this.mString = this.mString.substr(0, this.mMaxChars);
        }
        this.EnforceMaxPixels();
        if(this.mCursorPos < 0) {
            this.mCursorPos = 0;
        } else if(this.mCursorPos > (this.mString.length | 0)) {
            this.mCursorPos = this.mString.length;
        }
        if(anOldCursorPos != this.mCursorPos) {
            this.mBlinkAcc = 0;
            this.mShowingCursor = true;
        }
        this.FocusCursor(true);
        if(removeHilite || this.mHilitePos == this.mCursorPos) {
            this.mHilitePos = -1;
        }
        if(!this.mValidator.EditWidgetAllowText(this, this.mString)) {
            this.mString = anOldString;
            this.mCursorPos = anOldCursorPos;
            this.mHilitePos = anOldHilitePos;
            this.mLeftPos = anOldLeftPos;
        } else if(bigChange) {
            this.mUndoString = anOldString;
            this.mUndoCursor = anOldCursorPos;
            this.mUndoHilitePos = anOldHilitePos;
        }
    },
    KeyDown : function GameFramework_widgets_EditWidget$KeyDown(theKey) {
        if((((theKey | 0) < 65) || ((theKey | 0) >= 90)) && this.mValidator.EditWidgetAllowKey(this, theKey)) {
            this.ProcessKey(theKey, (0 | 0));
        }
        GameFramework.widgets.ClassicWidget.prototype.KeyDown.apply(this, [theKey]);
    },
    KeyChar : function GameFramework_widgets_EditWidget$KeyChar(theChar) {
        if(this.mValidator.EditWidgetAllowChar(this, theChar)) {
            this.ProcessKey(0, theChar);
        }
        GameFramework.widgets.ClassicWidget.prototype.KeyChar.apply(this, [theChar]);
    },
    GetCharAt : function GameFramework_widgets_EditWidget$GetCharAt(x, y) {
        var aPos = 0;
        var aString = this.GetDisplayString();
        var strWidth = 0;
        if(this.mFontJustification != -1) {
            strWidth = this.mFont.StringWidth(this.mString);
        }
        x -= this.applyJustification(0, strWidth);
        for(var i = this.mLeftPos; i < (aString.length | 0); i++) {
            var aLoSubStr = aString.substr(this.mLeftPos, i - this.mLeftPos);
            var aHiSubStr = aString.substr(this.mLeftPos, i - this.mLeftPos + 1);
            var aLoLen = this.mFont.StringWidth(aLoSubStr);
            var aHiLen = this.mFont.StringWidth(aHiSubStr);
            if(x >= (aLoLen + aHiLen) / 2 + 5) {
                aPos = i + 1;
            }
        }
        return aPos;
    },
    FocusCursor : function GameFramework_widgets_EditWidget$FocusCursor(bigJump) {
        while(this.mCursorPos < this.mLeftPos) {
            if(bigJump) {
                this.mLeftPos = ((Math.max(0, this.mLeftPos - 10)) | 0);
            } else {
                this.mLeftPos = ((Math.max(0, this.mLeftPos - 1)) | 0);
            }
        }
        if(this.mFont != null) {
            var aString = this.GetDisplayString();
            while((this.mWidth - 8 > 0) && (this.mFont.StringWidth(aString.substr(0, this.mCursorPos)) - this.mFont.StringWidth(aString.substr(0, this.mLeftPos)) >= this.mWidth - 8)) {
                if(bigJump) {
                    this.mLeftPos = ((Math.min(this.mLeftPos + 10, (this.mString.length | 0) - 1)) | 0);
                } else {
                    this.mLeftPos = ((Math.min(this.mLeftPos + 1, (this.mString.length | 0) - 1)) | 0);
                }
            }
        }
    },
    MouseDown : function GameFramework_widgets_EditWidget$MouseDown(x, y) {
        GameFramework.widgets.ClassicWidget.prototype.MouseDown.apply(this, [x, y]);
        this.mHilitePos = -1;
        this.mCursorPos = this.GetCharAt(x, y);
        this.FocusCursor(false);
    },
    MouseUp : function GameFramework_widgets_EditWidget$MouseUp(x, y) {
        GameFramework.widgets.ClassicWidget.prototype.MouseUp.apply(this, [x, y]);
        if(this.mHilitePos == this.mCursorPos) {
            this.mHilitePos = -1;
        }
        if(this.mHadDoubleClick) {
            this.mHilitePos = -1;
            this.mCursorPos = this.GetCharAt(x, y);
            this.mHadDoubleClick = false;
            this.HiliteWord();
        }
    },
    HiliteWord : function GameFramework_widgets_EditWidget$HiliteWord() {
        var aString = this.GetDisplayString();
        if(this.mCursorPos < (aString.length | 0)) {
            this.mHilitePos = this.mCursorPos;
            while((this.mHilitePos > 0) && (this.IsPartOfWord(aString.charCodeAt(this.mHilitePos - 1)))) {
                this.mHilitePos--;
            }
            while((this.mCursorPos < (aString.length | 0) - 1) && (this.IsPartOfWord(aString.charCodeAt(this.mCursorPos + 1)))) {
                this.mCursorPos++;
            }
            if(this.mCursorPos < (aString.length | 0)) {
                this.mCursorPos++;
            }
        }
    },
    MouseMove : function GameFramework_widgets_EditWidget$MouseMove(x, y) {
        if(this.mIsDown) {
            if(this.mHilitePos == -1) {
                this.mHilitePos = this.mCursorPos;
            }
            this.mCursorPos = this.GetCharAt(x, y);
            this.FocusCursor(false);
        }
    },
    MouseEnter : function GameFramework_widgets_EditWidget$MouseEnter() {
        GameFramework.widgets.ClassicWidget.prototype.MouseEnter.apply(this);
    },
    MouseLeave : function GameFramework_widgets_EditWidget$MouseLeave() {
        GameFramework.widgets.ClassicWidget.prototype.MouseLeave.apply(this);
    }
}
GameFramework.widgets.EditWidget.staticInit = function GameFramework_widgets_EditWidget$staticInit() {
    GameFramework.widgets.EditWidget.COLOR_BKG = 0;
    GameFramework.widgets.EditWidget.COLOR_OUTLINE = 1;
    GameFramework.widgets.EditWidget.COLOR_TEXT = 2;
    GameFramework.widgets.EditWidget.COLOR_HILITE = 3;
    GameFramework.widgets.EditWidget.COLOR_HILITE_TEXT = 4;
}

JS_AddInitFunc(function() {
    GameFramework.widgets.EditWidget.registerClass('GameFramework.widgets.EditWidget', GameFramework.widgets.ClassicWidget);
});
JS_AddStaticInitFunc(function() {
    GameFramework.widgets.EditWidget.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\widgets\EditWidget.cs
//LineMap:2=10 19=16 22=72 24=49 25=69 27=75 28=77 38=88 47=34 68=99 73=102 75=102 79=105 122=149 124=152 128=161 142=185 145=189 148=190 154=192 157=193 163=233 164=235 167=239 171=244 180=254 185=258 193=262 195=263 198=265 207=270 209=271 214=275 222=280 223=282 228=289 
//LineMap:231=293 234=294 244=299 248=304 249=306 255=315 262=324 268=331 282=346 286=351 288=354 290=354 294=356 301=364 307=369 312=380 316=385 318=388 320=391 322=394 326=479 330=484 332=488 335=489 336=492 340=494 342=498 344=501 346=505 354=511 356=515 360=520 363=524 
//LineMap:374=536 380=538 382=544 386=549 389=553 396=561 402=563 404=569 406=569 408=573 410=573 412=578 416=583 418=591 421=595 425=600 428=604 434=611 439=617 444=621 446=624 448=627 449=629 451=632 452=634 457=640 458=642 460=645 467=650 469=654 479=665 486=673 492=680 
//LineMap:493=682 496=686 497=688 501=693 506=699 518=712 534=731 536=740 544=749 548=754 556=763 558=766 561=771 572=784 574=787 575=789 584=799 591=25 
//Start:widgets\Slider
/**
 * @constructor
 */
Game.Slider = function Game_Slider(theTrackImage, theThumbImage) {
    if(theTrackImage === undefined) {
        theTrackImage = null;
    }
    if(theThumbImage === undefined) {
        theThumbImage = null;
    }
    this.mStepSound = null;
    Game.Slider.initializeBase(this);
    this.mTrackImage = theTrackImage;
    this.mThumbImage = theThumbImage;
    if(this.mTrackImage != null) {
        this.mWidth = this.mTrackImage.mWidth;
        this.mHeight = this.mTrackImage.mHeight;
    } else {
        this.mWidth = 30.0;
        this.mHeight = 10.0;
    }
}
Game.Slider.prototype = {
    mVal : 0.0,
    mTrackImage : null,
    mThumbImage : null,
    mDragging : false,
    mRelX : 0.0,
    mRelY : 0.0,
    mHorizontal : true,
    mSlidingLeft : false,
    mSlidingRight : false,
    mStepMode : false,
    mNumSteps : 1,
    mCurStep : 0,
    mStepSound : null,
    mOutlineColor : GameFramework.gfx.Color.WHITE_RGB,
    mBkgColor : GameFramework.gfx.Color.RGBToInt(80, 80, 80),
    mSliderColor : GameFramework.gfx.Color.WHITE_RGB,
    mKnobSize : 5,
    SetValue : function Game_Slider$SetValue(theValue) {
        var oldval = this.mVal;
        this.mVal = theValue;
        if(this.mVal < 0.0) {
            this.mVal = 0.0;
        } else if(this.mVal > 1.0) {
            this.mVal = 1.0;
        }
        if(this.mVal != oldval) {
            var e = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.SLIDER_CHANGED);
            this.DispatchEvent(e);
        }
    },
    SetStepMode : function Game_Slider$SetStepMode(num_steps, cur_step, step_sound) {
        if(step_sound === undefined) {
            step_sound = null;
        }
        this.mStepMode = true;
        this.mNumSteps = num_steps;
        this.SetStepValue(cur_step);
        this.mStepSound = step_sound;
    },
    SetStepValue : function Game_Slider$SetStepValue(cur_step) {
        if(cur_step < 0) {
            cur_step = 0;
        }
        if(cur_step > this.mNumSteps) {
            cur_step = this.mNumSteps;
        }
        if(this.mCurStep != cur_step) {
            this.mCurStep = cur_step;
            this.SetValue(cur_step / this.mNumSteps);
            if(this.mStepSound != null) {
                GameFramework.BaseApp.mApp.PlaySound(this.mStepSound);
            }
        }
    },
    Update : function Game_Slider$Update() {
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
        this.mSlidingLeft = false;
        this.mSlidingRight = false;
    },
    HasTransparencies : function Game_Slider$HasTransparencies() {
        return true;
    },
    Draw : function Game_Slider$Draw(g) {
        if(this.mTrackImage != null) {
            if(this.mHorizontal) {
                g.DrawButton(this.mTrackImage, 0, (this.mHeight - this.mTrackImage.mHeight) / 2, this.mWidth, 0);
            } else {
            }
        } else if(this.mTrackImage == null) {
            var _t1 = g.PushColor(this.mOutlineColor);
            try {
                g.FillRect(0, 0, this.mWidth, this.mHeight);
            } finally {
                _t1.Dispose();
            }
            var _t2 = g.PushColor(this.mBkgColor);
            try {
                g.FillRect(1, 1, this.mWidth - 2, this.mHeight - 2);
            } finally {
                _t2.Dispose();
            }
        }
        if(this.mHorizontal && (this.mThumbImage != null)) {
            g.DrawImage(this.mThumbImage, ((this.mVal * (this.mWidth - this.mThumbImage.mWidth)) | 0), (this.mHeight - this.mThumbImage.mHeight) / 2);
        } else if(!this.mHorizontal && (this.mThumbImage != null)) {
            g.DrawImage(this.mThumbImage, (this.mWidth - this.mThumbImage.mWidth) / 2, ((this.mVal * (this.mHeight - this.mThumbImage.mHeight)) | 0));
        } else if(this.mThumbImage == null) {
            g.SetColor(this.mSliderColor);
            if(this.mHorizontal) {
                g.FillRect(((this.mVal * (this.mWidth - this.mKnobSize)) | 0), 0, this.mKnobSize, this.mHeight);
            } else {
                g.FillRect(0, ((this.mVal * (this.mHeight - this.mKnobSize)) | 0), this.mWidth, this.mKnobSize);
            }
        }
    },
    MouseMove : function Game_Slider$MouseMove(x, y) {
        if(this.mHorizontal) {
            var knobWidth = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mWidth;
            var aThumbX = ((this.mVal * (this.mWidth - knobWidth)) | 0);
        } else {
            var knobHeight = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mHeight;
            var aThumbY = ((this.mVal * (this.mHeight - knobHeight)) | 0);
        }
        if(this.mIsDown) {
            this.MouseDrag(x, y);
        }
    },
    MouseDown : function Game_Slider$MouseDown(x, y) {
        if(this.mHorizontal) {
            var knobWidth = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mWidth;
            var aThumbX = (this.mVal * (this.mWidth - knobWidth));
            if((x >= aThumbX) && (x < aThumbX + knobWidth)) {
                this.mDragging = true;
                this.mRelX = x - aThumbX;
            } else {
                var pos = (x - knobWidth / 2) / (this.mWidth - knobWidth);
                if(pos < 0.0) {
                    pos = 0.0;
                }
                if(pos > 1.0) {
                    pos = 1.0;
                }
                this.SetValue(pos);
                this.mDragging = true;
                this.mRelX = knobWidth / 2.0;
            }
        } else {
            var knobHeight = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mHeight;
            var aThumbY = ((this.mVal * (this.mHeight - knobHeight)) | 0);
            if((y >= aThumbY) && (y < aThumbY + knobHeight)) {
                this.mDragging = true;
                this.mRelY = y - aThumbY;
            } else {
                var pos_2 = y / this.mHeight;
                this.SetValue(pos_2);
            }
        }
        GameFramework.widgets.ClassicWidget.prototype.MouseDown.apply(this, [x, y]);
    },
    MouseDrag : function Game_Slider$MouseDrag(x, y) {
        if(this.mDragging) {
            var anOldVal = this.mVal;
            if(this.mHorizontal) {
                var knobWidth = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mWidth;
                this.mVal = (x - this.mRelX) / (this.mWidth - knobWidth);
            } else {
                var knobHeight = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mHeight;
                this.mVal = (y - this.mRelY) / (this.mHeight - knobHeight);
            }
            if(this.mVal < 0.0) {
                this.mVal = 0.0;
            }
            if(this.mVal > 1.0) {
                this.mVal = 1.0;
            }
            if(this.mVal != anOldVal) {
                var e = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.SLIDER_CHANGED);
                this.DispatchEvent(e);
            }
        }
    },
    MouseUp : function Game_Slider$MouseUp(x, y) {
        this.mDragging = false;
        var e = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.SLIDER_CHANGED);
        this.DispatchEvent(e);
        GameFramework.widgets.ClassicWidget.prototype.MouseUp.apply(this, [x, y]);
    },
    MouseLeave : function Game_Slider$MouseLeave() {
        GameFramework.widgets.ClassicWidget.prototype.MouseLeave.apply(this);
    }
}
Game.Slider.staticInit = function Game_Slider$staticInit() {
}

JS_AddInitFunc(function() {
    Game.Slider.registerClass('Game.Slider', GameFramework.widgets.ClassicWidget);
});
JS_AddStaticInitFunc(function() {
    Game.Slider.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\widgets\Slider.cs
//LineMap:1=2 2=10 5=37 7=36 8=36 9=28 11=38 13=41 21=48 27=12 30=16 33=20 34=22 36=25 40=30 43=34 45=53 51=60 52=62 61=69 62=71 64=75 71=81 73=82 76=86 78=89 88=100 110=118 112=125 115=126 121=128 124=129 131=132 133=135 134=135 136=138 137=140 144=146 157=165 159=166 
//LineMap:162=176 172=187 174=191 181=199 185=204 186=206 193=212 195=215 197=219 207=231 210=235 215=241 223=248 226=252 230=257 238=267 241=272 243=275 
//Start:widgets\WidgetEvent
/**
 * @constructor
 */
GameFramework.widgets.WidgetEvent = function GameFramework_widgets_WidgetEvent(theType) {
    GameFramework.widgets.WidgetEvent.initializeBase(this, [theType]);
}
GameFramework.widgets.WidgetEvent.prototype = {
    mX : 0,
    mY : 0,
    mString : null,
    mKeyCode : null,
    mKeyChar : 0
}
GameFramework.widgets.WidgetEvent.staticInit = function GameFramework_widgets_WidgetEvent$staticInit() {
    GameFramework.widgets.WidgetEvent.CLICKED = 'clicked';
    GameFramework.widgets.WidgetEvent.MOUSE_DOWN = 'mouse_down';
    GameFramework.widgets.WidgetEvent.MOUSE_UP = 'mouse_up';
    GameFramework.widgets.WidgetEvent.MOUSE_ENTER = 'mouse_enter';
    GameFramework.widgets.WidgetEvent.MOUSE_LEAVE = 'mouse_leave';
    GameFramework.widgets.WidgetEvent.EDIT_TEXT = 'edit_text';
    GameFramework.widgets.WidgetEvent.CHECKBOX_CHECKED = 'checkbox_checked';
    GameFramework.widgets.WidgetEvent.SLIDER_CHANGED = 'slider_changed';
    GameFramework.widgets.WidgetEvent.SLIDER_RELEASE = 'slider_release';
    GameFramework.widgets.WidgetEvent.KEY_DOWN = 'key_down';
    GameFramework.widgets.WidgetEvent.KEY_UP = 'key_down';
    GameFramework.widgets.WidgetEvent.KEY_CHAR = 'key_char';
}

JS_AddInitFunc(function() {
    GameFramework.widgets.WidgetEvent.registerClass('GameFramework.widgets.WidgetEvent', GameFramework.events.Event);
});
JS_AddStaticInitFunc(function() {
    GameFramework.widgets.WidgetEvent.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\GameFramework\widgets\WidgetEvent.cs
//LineMap:2=3 5=28 7=27 19=8 
