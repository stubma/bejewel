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
    this.mURLBase = "./";
};
GameFramework.BaseApp.prototype = {
    mCommands: null,
    mVolume: 1.0,
    mState: null,
    mSoundManager: null,
    mResourceManager: null,
    mUserId: null,
    mDeviceId: null,
    mExecutionUserId: null,
    mExecutionId: null,
    mProdName: "PopCapGame",
    mVersion: "",
    mURLBase: null,
    mGraphics: null,
    mSocialService: null,
    mDatabase: null,
    mHTTPService: null,
    mDispatcher: null,
    mX: 0,
    mY: 0,
    mDrawWidth: 0,
    mDrawHeight: 0,
    mWidth: 0,
    mHeight: 0,
    mLandscapeWidth: 0,
    mLandscapeHeight: 0,
    mAllowRotation: false,
    mArtRes: 0,
    mScale: 1.0,
    mPhysWidth: 0,
    mPhysHeight: 0,
    mUpdateCnt: 0,
    mFrameTime: 10.0,
    mTimeScale: 1.0,
    mExecutionStopped: null,
    mDrawCount: 0,
    mDrawTicks: null,
    mCurFPS: 0,
    mLastCurFPSTick: 0,
    mEventQueue: null,
    mExternalCallbackMap: null,
    mResourceStreamerList: null,
    mConnectedRequestQueue: null,
    mLogArray: null,
    mExceptionString: null,
    mExceptionCallback: null,
    mBackgrounded: false,
    get_Is3D: function GameFramework_BaseApp$get_Is3D() {
        return false;
    },
    AddEventListener: function GameFramework_BaseApp$AddEventListener(theType, theCallback) {
        this.mDispatcher.AddEventListener(theType, theCallback);
    },
    HasEventListener: function GameFramework_BaseApp$HasEventListener(theType) {
        return this.mDispatcher.HasEventListener(theType);
    },
    DispatchEvent: function GameFramework_BaseApp$DispatchEvent(theEvent) {
        this.mDispatcher.DispatchEvent(theEvent);
    },
    AddExternalCallback: function GameFramework_BaseApp$AddExternalCallback(theObject, theName) {
        this.mExternalCallbackMap[theName] = theObject;
    },
    GenerateExecutionId: function GameFramework_BaseApp$GenerateExecutionId() {
        if (this.mExecutionId != null) {
            return;
        }
        if (this.mExecutionUserId == null) {
            this.mExecutionUserId = this.GetLocalData(this.mProdName, "ExecutionUserId");
        }
        if (this.mExecutionUserId == null) {
            this.mExecutionUserId = "";
            var aString = "ABCDEFGHJIJKLMNOPQRSTUVWXYZ";
            var aPrefixInt = (GameFramework.Utils.GetRandFloatU() * 1000000000) | 0;
            while (aPrefixInt != 0) {
                this.mExecutionUserId += aString.substr(aPrefixInt % aString.length, 1);
                aPrefixInt = (aPrefixInt / aString.length) | 0 | 0;
            }
            this.SetLocalData(this.mProdName, "ExecutionUserId", this.mExecutionUserId);
        }
        this.mExecutionId = this.mExecutionUserId + GameFramework.Utils.ToString(GameFramework.Utils.GetUnixTime() | 0);
    },
    SetExceptionCallback: function GameFramework_BaseApp$SetExceptionCallback(theExceptionCallback) {
        this.mExceptionCallback = theExceptionCallback;
    },
    HandleException: function GameFramework_BaseApp$HandleException(theException) {
        this.mExecutionStopped = true;
        if (this.mExceptionCallback != null) {
            if (!this.mExceptionCallback.invoke(theException)) {
                throw theException;
            }
        } else {
            throw theException;
        }
    },
    RunStep: function GameFramework_BaseApp$RunStep() {
        return true;
    },
    RunDone: function GameFramework_BaseApp$RunDone() {},
    CreateGraphics: function GameFramework_BaseApp$CreateGraphics() {},
    Init: function GameFramework_BaseApp$Init() {
        if (this.mLandscapeWidth == 0) {
            this.mLandscapeWidth = this.mWidth;
            this.mLandscapeHeight = this.mHeight;
        } else {
            this.mWidth = this.mLandscapeWidth;
            this.mHeight = this.mLandscapeHeight;
        }
        this.mDrawWidth = this.mWidth;
        this.mDrawHeight = this.mHeight;
        this.GenerateExecutionId();
        GameFramework.Utils.Log(
            "Init",
            Array.Create(
                3,
                null,
                new GameFramework.misc.KeyVal("ProdName", this.mProdName),
                new GameFramework.misc.KeyVal("Version", this.mVersion),
                new GameFramework.misc.KeyVal("ExecutionId", this.mExecutionId)
            )
        );
        this.CreateDatabase();
        this.CreateGraphics();
        this.CreateHTTPService();
    },
    SizeChanged: function GameFramework_BaseApp$SizeChanged(theWidth, theHeight) {
        this.mPhysWidth = theWidth;
        this.mPhysHeight = theHeight;
        this.mScale = this.mPhysHeight / this.mHeight;
    },
    SetBackgrounded: function GameFramework_BaseApp$SetBackgrounded(isBackgrounded) {},
    ShutdownHook: function GameFramework_BaseApp$ShutdownHook() {},
    QueueEvent: function GameFramework_BaseApp$QueueEvent(theEvent, theDispatcher) {
        //JS
        theEvent.dispatcher = theDispatcher;
        theEvent.target = theDispatcher;
        mEventQueue.Add(theEvent);
        //-JS
    },
    SendQueuedEvents: function GameFramework_BaseApp$SendQueuedEvents() {
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
    Trace: function GameFramework_BaseApp$Trace(theString) {},
    ClearUpdateBacklog: function GameFramework_BaseApp$ClearUpdateBacklog() {},
    IsMuted: function GameFramework_BaseApp$IsMuted() {
        return false;
    },
    GetSoundInst: function GameFramework_BaseApp$GetSoundInst(theSoundResource) {
        var aSoundInst = new GameFramework.resources.SoundInstance(theSoundResource);
        return aSoundInst;
    },
    PlaySound: function GameFramework_BaseApp$PlaySound(theSoundResource) {
        var aSoundInst = this.GetSoundInst(theSoundResource);
        if (aSoundInst != null) {
            aSoundInst.Play();
        }
        return aSoundInst;
    },
    PlaySoundEx: function GameFramework_BaseApp$PlaySoundEx(theSoundResource, theVolume, thePan) {
        var aSoundInst = this.GetSoundInst(theSoundResource);
        if (aSoundInst != null) {
            aSoundInst.SetVolume(theVolume);
            aSoundInst.SetPan(thePan);
            aSoundInst.PlayEx(false, true);
        }
        return aSoundInst;
    },
    TranslateString: function GameFramework_BaseApp$TranslateString(theStringId) {
        return theStringId;
    },
    ImageLoading: function GameFramework_BaseApp$ImageLoading(theId) {},
    ImageLoaded: function GameFramework_BaseApp$ImageLoaded(theId) {},
    Run: function GameFramework_BaseApp$Run() {},
    Start: function GameFramework_BaseApp$Start(theState) {
        this.mState = theState;
    },
    AddResourceStreamer: function GameFramework_BaseApp$AddResourceStreamer(theResourceStreamer) {
        this.mResourceStreamerList.push(theResourceStreamer);
    },
    GetResourceStreamerForId: function GameFramework_BaseApp$GetResourceStreamerForId(theId) {
        {
            var $enum1 = ss.IEnumerator.getEnumerator(this.mResourceStreamerList);
            while ($enum1.moveNext()) {
                var aResourceStreamer = $enum1.get_current();
                if (aResourceStreamer.mId == theId) {
                    return aResourceStreamer;
                }
            }
        }
        return null;
    },
    HasResourceStreamerForId: function GameFramework_BaseApp$HasResourceStreamerForId(theId) {
        {
            var $enum2 = ss.IEnumerator.getEnumerator(this.mResourceStreamerList);
            while ($enum2.moveNext()) {
                var aResourceStreamer = $enum2.get_current();
                if (aResourceStreamer.mId == theId) {
                    return true;
                }
            }
        }
        return false;
    },
    PrioritizeResourceStreamer: function GameFramework_BaseApp$PrioritizeResourceStreamer(theResourceStreamer) {
        {
            JS_SpliceArray(this.mResourceStreamerList, this.mResourceStreamerList.indexOf(theResourceStreamer), 1);
            JS_SpliceArray(this.mResourceStreamerList, 0, 0, theResourceStreamer);
        }
    },
    GetResourceStreamerLoadingCount: function GameFramework_BaseApp$GetResourceStreamerLoadingCount() {
        var aCount = 0;

        {
            var $enum3 = ss.IEnumerator.getEnumerator(this.mResourceStreamerList);
            while ($enum3.moveNext()) {
                var aResourceStreamer = $enum3.get_current();
                if (
                    aResourceStreamer.mResourcesLoaded == 0 &&
                    aResourceStreamer.mId != null &&
                    aResourceStreamer.mPath != null &&
                    !aResourceStreamer.mPath.startsWith("!")
                ) {
                    aCount++;
                }
            }
        }
        return aCount;
    },
    CreateDatabase: function GameFramework_BaseApp$CreateDatabase() {
        return null;
    },
    CreateHTTPService: function GameFramework_BaseApp$CreateHTTPService() {
        this.mHTTPService = new GameFramework.connected.HTTPService();
        return this.mHTTPService;
    },
    CreateSocialService: function GameFramework_BaseApp$CreateSocialService(theName) {
        return null;
    },
    CreateConnectRequest: function GameFramework_BaseApp$CreateConnectRequest() {
        var aConnectRequest = new GameFramework.connected.ConnectedRequest();
        this.mConnectedRequestQueue.push(aConnectRequest);
        return aConnectRequest;
    },
    GotScreenSize: function GameFramework_BaseApp$GotScreenSize(theWidth, theHeight) {},
    Update: function GameFramework_BaseApp$Update() {
        this.mUpdateCnt++;
        if (this.mState != null) {
            this.mState.Update();
        }
        if (this.mDatabase != null) {
            this.mDatabase.Update();
        }
        if (this.mSocialService != null) {
            this.mSocialService.Update();
        }
        if (this.mHTTPService != null) {
            this.mHTTPService.Update();
        }
        this.SendQueuedEvents();
        var anEvent = new GameFramework.events.Event("update");
        this.DispatchEvent(anEvent);
    },
    Draw: function GameFramework_BaseApp$Draw() {
        if (this.mState != null) {
            this.mState.Draw(10);
        }
        var aMS = GameFramework.Utils.GetRunningMilliseconds();
        this.mDrawTicks[this.mDrawCount % 100] = aMS;
        var aTotalDraws = 0;
        var aTotalTicks = 0;
        var aPrevTick = aMS;
        var aCheckOffset = -1;
        while (aCheckOffset > -100 && aTotalTicks < 1000) {
            var aCurTick = this.mDrawTicks[(this.mDrawCount + 100 + aCheckOffset) % 100];
            if (aCurTick == 0) {
                break;
            }
            aTotalTicks += aPrevTick - aCurTick;
            aTotalDraws++;
            aPrevTick = aCurTick;
            aCheckOffset--;
        }
        if (aTotalTicks >= 500 && aMS - this.mLastCurFPSTick >= 200) {
            this.mCurFPS = ((aTotalDraws * 1000) / aTotalTicks + 0.5) | 0;
            this.mLastCurFPSTick = aMS;
        }
        this.mDrawCount++;
    },
    ParseXML: function GameFramework_BaseApp$ParseXML(theXML, theData) {},
    DecodeJSON: function GameFramework_BaseApp$DecodeJSON(theData, theDataObject) {},
    EncodeJSON: function GameFramework_BaseApp$EncodeJSON(theDataObject) {
        return "";
    },
    GetLocalData: function GameFramework_BaseApp$GetLocalData(theGroupName, theDataName) {
        return null;
    },
    SetLocalData: function GameFramework_BaseApp$SetLocalData(theGroupName, theDataName, theData) {},
    DeleteLocalData: function GameFramework_BaseApp$DeleteLocalData(theGroupName, theDataName) {},
    Log: function GameFramework_BaseApp$Log(theEvent, theParam) {
        this.mLogArray.push(
            this.EncodeJSON(
                Array.Create(
                    3,
                    null,
                    new GameFramework.misc.KeyVal("Event", theEvent),
                    new GameFramework.misc.KeyVal("Time", GameFramework.Utils.GetUnixTime()),
                    new GameFramework.misc.KeyVal("Param", theParam)
                )
            )
        );
    },
    LogJSON: function GameFramework_BaseApp$LogJSON(theEvent, theJSONParam) {
        this.mLogArray.push(
            this.EncodeJSON(
                Array.Create(
                    3,
                    null,
                    new GameFramework.misc.KeyVal("Event", theEvent),
                    new GameFramework.misc.KeyVal("Time", GameFramework.Utils.GetUnixTime()),
                    new GameFramework.misc.KeyVal("Param", new GameFramework.misc.JSONString(theJSONParam))
                )
            )
        );
    },
    CreateBufferData: function GameFramework_BaseApp$CreateBufferData() {
        return new GameFramework.DataBufferData();
    },
    UpdateConnectedRequests: function GameFramework_BaseApp$UpdateConnectedRequests() {},
};
GameFramework.BaseApp.prototype["SetExceptionCallback"] = GameFramework.BaseApp.prototype.SetExceptionCallback;
GameFramework.BaseApp.staticInit = function GameFramework_BaseApp$staticInit() {
    GameFramework.BaseApp.mApp = null;
};

JSFExt_AddInitFunc(function () {
    GameFramework.BaseApp.registerClass("GameFramework.BaseApp", GameFramework.Sprite);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.BaseApp.staticInit();
});
