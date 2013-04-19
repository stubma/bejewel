/**
 * @constructor
 */
Game.BejApp = function Game_BejApp() {
    this.mRankNames = Game.DM.gRankNames;
    this.mTips = [];
    this.mGemOutlines = new Game.GemOutlines();
    this.mAutoPlay = Game.DM.EAutoplay.None;
    this.mHyperSpaceAnims = [];
    this.mGems3D = [];
    this.mMetrics = new Game.Metrics();
    this.mRecentFPSVector = [];
    Game.BejApp.initializeBase(this);
    GameFramework.Utils.Trace('BejApp()');
    JS_Assert(Game.BejApp.mBejApp == null);
    this.mFrameTime = 1000.0 / 60.0;
    this.mLandscapeWidth = 1600;
    this.mLandscapeHeight = 1200;
    this.mPhysWidth = 1024;
    this.mPhysHeight = 768;
    this.mArtRes = this.mPhysHeight;
    this.mScale = this.mPhysHeight / this.mLandscapeHeight;
    this.mProfile = new Game.Profile();
    this.mMusicInterface = new Game.MusicInterface();
    this.mResCache = new Game.ResourceCache();
    this.mHighScoreMgr = new Game.HighScoreMgr();
    this.mResCache.MakeShrunkenGems();
    Game.BejApp.mBejApp = this;
}
Game['BejApp'] = Game.BejApp;
Game.BejApp.RotToShort = function Game_BejApp$RotToShort(theRot) {
    var aRotToInt = ((theRot * 0x7fff / 3.14159) | 0);
    return (aRotToInt | 0);
}
Game.BejApp.ShortToRot = function Game_BejApp$ShortToRot(theShort) {
    return (theShort * 3.14159 / 0x7fff);
}
Game.BejApp.FloatToByte = function Game_BejApp$FloatToByte(theFloat, theMaxScale) {
    return ((theFloat * 127 / theMaxScale) | 0);
}
Game.BejApp.ByteToFloat = function Game_BejApp$ByteToFloat(theByte, theMaxScale) {
    if(theByte >= 128) {
        return ((theByte | 0xffffff00) | 0) * theMaxScale / 127.0;
    } else {
        return theByte * theMaxScale / 127.0;
    }
}
Game.BejApp.prototype = {
    mMessager : null,
    mBaseWidgetAppState : null,
    mRootWidget : null,
    mGameLayerWidget : null,
    mTopLayerWidget : null,
    mBoard : null,
    mProfile : null,
    mMainMenu : null,
    mLoadingScreen : null,
    mDebugKeysEnabled : null,
    mMusicInterface : null,
    mDialogMgr : null,
    mResCache : null,
    mLoadingThreadComplete : false,
    mInitLoadingComplete : false,
    mGroupsLoading : 0,
    mInitResourceStreamer : null,
    mPauseFrames : 0,
    mRankNames : null,
    mTips : null,
    mTipIdx : 0,
    mTooltipManager : null,
    mHighScoreMgr : null,
    mGemOutlines : null,
    mAutoPlay : null,
    mAutoLevelUpCount : 0,
    mConnecting : null,
    mIsSlow : true,
    mHyperSpaceAnims : null,
    mGems3D : null,
    mWarpTube3D : null,
    mWarpTubeCap3D : null,
    mMetrics : null,
    mInitializedMetrics : false,
    mSessionId : null,
    mRecentFPSVector : null,
    mRecentMaxFPS : 0,
    mRecentMinFPS : 60,
    mFXScale : 1.0,
    mFailed : false,
    mWantMusicInstanceId : null,
    mMusicInstance : null,
    mMusicFade : null,
    mCurMusicVolume : 1.0,
    mWantMusicVolume : 1.0,
    mWantMusic : null,
    mLoopMusic : null,
    mUserAgent : 'unknown',
    Update : function Game_BejApp$Update() {
        this.mMetrics.Update();
        if(this.mMainMenu == null) {
            GameFramework.JSBaseApp.prototype.Update.apply(this);
            return;
        }
        if(this.mMainMenu.mLoaded) {
            if(this.mUpdateCnt % 20 == 0) {
                this.mRecentFPSVector.push(this.mCurFPS);
                while(this.mRecentFPSVector.length > 5) {
                    this.mRecentFPSVector.removeAt(0);
                }
                this.mRecentMaxFPS = 0;

                {
                    var $srcArray2 = this.mRecentFPSVector;
                    for(var $enum2 = 0; $enum2 < $srcArray2.length; $enum2++) {
                        var aFPS = $srcArray2[$enum2];
                        this.mRecentMaxFPS = ((Math.max(this.mRecentMaxFPS, aFPS)) | 0);
                    }
                }
                this.mRecentMinFPS = 60;

                {
                    var $srcArray3 = this.mRecentFPSVector;
                    for(var $enum3 = 0; $enum3 < $srcArray3.length; $enum3++) {
                        var aFPS_2 = $srcArray3[$enum3];
                        this.mRecentMinFPS = ((Math.min(this.mRecentMinFPS, aFPS_2)) | 0);
                    }
                }
            }
            if(this.mUpdateCnt % 20 == 0) {
            }
            if(this.mIsSlow) {
                this.mFXScale = 1.0;
            } else if((this.mRecentMaxFPS != 0) && (this.mBoard != null) && (this.mBoard.mHyperspace == null)) {
                var aTargetFPSDiff = this.mRecentMaxFPS - 50;
                if(aTargetFPSDiff < 0) {
                    this.mFXScale = Math.max(0, this.mFXScale + aTargetFPSDiff * 0.00025);
                }
                aTargetFPSDiff = this.mRecentMinFPS - 50;
                if(aTargetFPSDiff > 0) {
                    this.mFXScale = Math.min(1, this.mFXScale + aTargetFPSDiff * 0.00025);
                }
            }
            if(this.mRecentMaxFPS >= 55) {
                this.mIsSlow = false;
            }
        }
        var aWantPauseFrames = 0;
        if(this.mBoard != null && this.mBoard.WantsHideOnPause()) {
            aWantPauseFrames = 35;
        }
        if(this.mPauseFrames <= aWantPauseFrames) {
            GameFramework.JSBaseApp.prototype.Update.apply(this);
        }
        this.UpdateMusic();
    },
    GotScreenSize : function Game_BejApp$GotScreenSize(theWidth, theHeight) {
        this.SetRes(theWidth, theHeight);
    },
    SetRes : function Game_BejApp$SetRes(theWidth, theHeight) {
        var anArtRes = ((Math.min(theWidth, theHeight)) | 0);
        if((anArtRes == 768) || (anArtRes == 480) || (anArtRes == 320)) {
            this.mPhysWidth = ((Math.max(theWidth, theHeight)) | 0);
            this.mPhysHeight = ((Math.min(theWidth, theHeight)) | 0);
            this.mScale = this.mPhysHeight / this.mLandscapeHeight;
            this.mArtRes = anArtRes;
        } else {
            this.mPhysWidth = ((this.mArtRes * 1600 / 1200) | 0);
            this.mPhysHeight = this.mArtRes;
        }
    },
    GetConfig : function Game_BejApp$GetConfig(theName) {
        return this.mDatabase.QueryDB(this.mProdName, 'config', new GameFramework.misc.KeyVal('_id', theName), null, 0);
    },
    AddButtonSounds : function Game_BejApp$AddButtonSounds(theWidget) {
        theWidget.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.PlayButtonClick));
        theWidget.AddEventListener(GameFramework.widgets.WidgetEvent.MOUSE_DOWN, ss.Delegate.create(this, this.PlayButtonDown));
    },
    ButtonCloseDialog : function Game_BejApp$ButtonCloseDialog(e) {
        var aWidgetEvent = e;
        var aWidget = aWidgetEvent.target;
        if(Type.tryCast(aWidget.mParent, GameFramework.widgets.Dialog)) {
            (aWidget.mParent).Kill();
        } else {
            aWidget.mParent.mParent.RemoveWidget(aWidget.mParent);
        }
    },
    PlayVoice : function Game_BejApp$PlayVoice(theSoundResource) {
        this.PlaySound(theSoundResource);
    },
    PlayButtonDown : function Game_BejApp$PlayButtonDown(e) {
        var aButtonWidget = Type.safeCast(e.target, GameFramework.widgets.ButtonWidget);
        if((aButtonWidget != null) && (aButtonWidget.mDisabled)) {
            return;
        }
        this.PlaySound(Game.Resources['SOUND_BUTTON_PRESS']);
    },
    PlayButtonClick : function Game_BejApp$PlayButtonClick(e) {
        this.PlaySound(Game.Resources['SOUND_BUTTON_RELEASE']);
    },
    SetDebugMode : function Game_BejApp$SetDebugMode(debugMode) {
        this.mDebugKeysEnabled = true;
    },
    GetArtRes : function Game_BejApp$GetArtRes() {
        return this.mArtRes;
    },
    SetArtRes : function Game_BejApp$SetArtRes(theArtRes) {
        this.mArtRes = theArtRes;
    },
    SetPathPrefix : function Game_BejApp$SetPathPrefix(thePathPrefix) {
        //JS
        this.mPathPrefix = thePathPrefix;
        //-JS
    },
    SetMetricsURL : function Game_BejApp$SetMetricsURL(theURL) {
        this.mMetrics.SetMetricsURL(theURL);
    },
    SetThrottlingURL : function Game_BejApp$SetThrottlingURL(theURL) {
        this.mMetrics.SetThrottlingURL(theURL);
    },
    SetUserAgent : function Game_BejApp$SetUserAgent(theUserAgent) {
        this.mUserAgent = theUserAgent;
    },
    SetUserId : function Game_BejApp$SetUserId(theUserID) {
        this.mUserId = theUserID;
    },
    GetUserId : function Game_BejApp$GetUserId() {
        return this.mUserId;
    },
    SetUseGL : function Game_BejApp$SetUseGL(useWebGL) {
        //JS
        this.mUseGL = useWebGL;
        //-JS
    },
    GetUseGL : function Game_BejApp$GetUseGL() {
        //JS
        return this.mUseGL;
        //-JS
        return this.get_Is3D();
    },
    SetBkgImagePath : function Game_BejApp$SetBkgImagePath(theIdx, thePath) {
        Game.Background.SetBkgImagePath(theIdx, thePath);
    },
    SizeChanged : function Game_BejApp$SizeChanged(theWidth, theHeight) {
        GameFramework.JSBaseApp.prototype.SizeChanged.apply(this, [theWidth, theHeight]);
    },
    Init : function Game_BejApp$Init() {
        this.mProdName = 'Bejeweled';
        //JS
        gCanvasAllowAdditive = false;
        //-JS
        Game.Util.gRand.SRand((GameFramework.Utils.GetRand() | 0));
        var aDefaultArtRes = this.mArtRes;
        var anArtResStr = this.GetLocalData(this.mProdName, 'ArtRes');
        if(anArtResStr != null) {
            this.mArtRes = GameFramework.Utils.ToInt(anArtResStr);
        }
        GameFramework.JSBaseApp.prototype.Init.apply(this);
        if(this.mUserId != null) {
        }
        this.mSessionId = GameFramework.Utils.CreateGUID();
        if(this.mUserId == null) {
            this.mUserId = this.GetLocalData('Global', 'UserId');
        }
        if(this.mUserId == null) {
            this.mUserId = GameFramework.Utils.CreateGUID();
            this.SetLocalData('Global', 'UserId', this.mUserId);
        }
        if(!this.mInitializedMetrics) {
            this.mMetrics.Init();
            this.mInitializedMetrics = true;
        }
        var aThrottleIdx = 0;
        for(var i = 0; i < this.mUserId.length; i++) {
            aThrottleIdx ^= ((this.mUserId.charCodeAt(i) | 0) << ((i % 4) * 8));
        }
        if(this.mMetrics.mSamplingProbRoll == 0.0) {
            this.mMetrics.SetSamplingProbRoll(((aThrottleIdx % 1234567) / 1234567));
        }
        this.mHighScoreMgr.Load();
        this.InitDefaultHighScores();
        this.mScale = this.mPhysHeight / this.mLandscapeHeight;
        if(this.mDatabase != null) {
            this.mDatabase.mURL = 'http://10.1.244.102/query_engine.php';
        }
        this.SubmitStandardMetrics('startup', [new GameFramework.misc.KeyVal('DefaultArtRes', aDefaultArtRes), new GameFramework.misc.KeyVal('WebGL', this.get_Is3D()), new GameFramework.misc.KeyVal('ArtRes', this.mArtRes), new GameFramework.misc.KeyVal('PlatformInfo', this.mUserAgent)]);
        this.mBaseWidgetAppState = new GameFramework.widgets.ClassicWidgetAppState();
        this.mBaseWidgetAppState.mGraphics = this.mGraphics;
        this.mRootWidget = this.mBaseWidgetAppState.mRootWidget;
        this.Start(this.mBaseWidgetAppState);
    },
    InitDefaultHighScores : function Game_BejApp$InitDefaultHighScores() {
        this.mHighScoreMgr.GenerateDefaults$2('Classic', 60000, 10000);
        this.mHighScoreMgr.GenerateDefaults$2('Lightning', 100000, 50000);
    },
    StartLoad : function Game_BejApp$StartLoad() {
        var anExpectedWidth = (((1600 * this.mPhysHeight) / 1200) | 0);
        this.mRootWidget.mX = (((this.mPhysWidth - anExpectedWidth) / 2) | 0) / this.mScale;
        this.mX = (-this.mRootWidget.mX | 0);
        this.mDrawWidth = this.mWidth + this.mRootWidget.mX * 2;
        this.mDrawHeight = this.mHeight;
        this.mGameLayerWidget = new GameFramework.widgets.ClassicWidget();
        this.mRootWidget.AddWidget(this.mGameLayerWidget);
        this.mDialogMgr = new Game.DialogMgr();
        this.mRootWidget.AddWidget(this.mDialogMgr);
        this.mTopLayerWidget = new Game.TopWidget();
        this.mMessager = this.mTopLayerWidget.mMessager;
        this.mRootWidget.AddWidget(this.mTopLayerWidget);
        if(this.mLoadingScreen == null) {
            this.mMainMenu = new Game.MainMenu();
            this.mMainMenu.mWidth = 1600;
            this.mMainMenu.mHeight = 1200;
            this.mGameLayerWidget.AddWidget(this.mMainMenu);
            this.mMainMenu.Update();
            this.mBaseWidgetAppState.SetFocus(this.mMainMenu);
            this.mTooltipManager = new Game.TooltipManager();
            this.mRootWidget.AddWidget(this.mTooltipManager);
        }
        var aResourceStreamer = this.mResourceManager.StreamTextFile('properties/resources.xml');
        aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(this, this.ResourceXMLLoaded));
        aResourceStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(this, this.LoadFailed));
    },
    ResourceXMLLoaded : function Game_BejApp$ResourceXMLLoaded(e) {
        var aResourceStreamer = e.target;
        this.mResourceManager.ParseResourceManifest(aResourceStreamer.mResultData);
        this.StreamInitResources();
    },
    SubmitStandardMetricsDict : function Game_BejApp$SubmitStandardMetricsDict(theMetricsType, theMetricsData, force, theAlternateURL) {
        if(theMetricsData === undefined) {
            theMetricsData = null;
        }
        if(force === undefined) {
            force = false;
        }
        if(theAlternateURL === undefined) {
            theAlternateURL = null;
        }
        if(!this.mInitializedMetrics) {
            this.mMetrics.Init();
            this.mInitializedMetrics = true;
        }
        var aStats = [];
        if(theMetricsData != null) {

            {
                for(aKey in theMetricsData) {
                    aStats.push(new GameFramework.misc.KeyVal(aKey, theMetricsData[aKey]));
                }
            }
        }
        this.SubmitStandardMetrics(theMetricsType, aStats, force, theAlternateURL);
    },
    SubmitStandardMetrics : function Game_BejApp$SubmitStandardMetrics(theMetricsType, theMetricsData, force, theAlternateURL) {
        if(force === undefined) {
            force = false;
        }
        if(theAlternateURL === undefined) {
            theAlternateURL = null;
        }
        var aStats = [new GameFramework.misc.KeyVal('PlayerId', this.mUserId), new GameFramework.misc.KeyVal('ProductName', 'Bejeweled'), new GameFramework.misc.KeyVal('PlatformName', 'HTML5'), new GameFramework.misc.KeyVal('ClientVersion', Game.Version.Get()), new GameFramework.misc.KeyVal('SessionId', this.mSessionId)];
        if(theMetricsData != null) {

            {
                var $srcArray5 = theMetricsData;
                for(var $enum5 = 0; $enum5 < $srcArray5.length; $enum5++) {
                    var aKeyVal = $srcArray5[$enum5];
                    aStats.push(aKeyVal);
                }
            }
        }
        this.mMetrics.SubmitReport(theMetricsType, aStats, force, theAlternateURL);
    },
    LoadFailed : function Game_BejApp$LoadFailed(e) {
        if(!this.mFailed) {
            var aDetails = 'Loading failed';
            var aResourceStreamer = Type.safeCast(e.target, GameFramework.resources.ResourceStreamer);
            while(aResourceStreamer.mFailedChild != null) {
                aResourceStreamer = aResourceStreamer.mFailedChild;
            }
            if(aResourceStreamer != null) {
                if(aResourceStreamer.mPath != null) {
                    aDetails = 'Failed to load \'' + aResourceStreamer.mPath + '\'';
                } else if(aResourceStreamer.mGroupName != null) {
                    aDetails = 'Failed to load group \'' + aResourceStreamer.mGroupName + '\'';
                }
            }
            this.Trace(aDetails);
            this.mFailed = true;
            throw new Game.LoadingError(aDetails);
        }
    },

    // start to load Init group resources, Init group is used for loading screen
    StreamInitResources : function Game_BejApp$StreamInitResources() {
        this.mInitResourceStreamer = this.mResourceManager.StreamResourceGroup('Init');
        this.mInitResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(this, this.InitLoadingComplete));
        this.mInitResourceStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(this, this.LoadFailed));
    },

    // start to load a group resources
    StreamResourceGroup : function Game_BejApp$StreamResourceGroup(theName) {
        var aStreamer = this.mResourceManager.StreamResourceGroup(theName);
        this.mGroupsLoading++;
        aStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(this, this.LoadingThreadLoadingComplete));
        aStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(this, this.LoadFailed));
    },

    // save highscores
    SaveHighscores : function Game_BejApp$SaveHighscores(theForceSave) {
        this.mHighScoreMgr.Save();
    },

    // invoked when Init group is loaded
    InitLoadingComplete : function Game_BejApp$InitLoadingComplete(e) {
        // check init load time, if larger than 25 seconds, disable music
        var anInitLoadTimeMS = GameFramework.Utils.GetRunningMilliseconds();
        if(anInitLoadTimeMS > 25000) {
            this.mProfile.mMusicVolume = 0.0;
        }

        // if has loading screen, set font flag
        if(this.mLoadingScreen != null) {
            this.mLoadingScreen.mHasFont = true;
        }

        // set flag
        this.mInitLoadingComplete = true;

        // notify main menu
        this.mMainMenu.InitLoadingComplete();

        // load background resource group
        var aBgStreamer = Game.Background.StartBkgLoad(0);
        this.mGroupsLoading++;
        aBgStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(this, this.LoadingThreadLoadingComplete));
        aBgStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(this, this.LoadFailed));

        // other resource grouips
        this.StreamResourceGroup('Gameplay');
        this.StreamResourceGroup('Fonts');
        this.StreamResourceGroup('LoadingThread');
        this.StreamResourceGroup('Dialog');
        this.StreamResourceGroup('Board');
        this.StreamResourceGroup('Additive');
        this.StreamResourceGroup('MainMenu');

        // load hyperspace anim resource group
        var aStreamer = this.mResourceManager.StreamBinaryFile(Game.Resources.RESFILE_3D_HYPERSPACE_MAIN_0_ID);
        this.mGroupsLoading++;
        aStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(this, this.HyperspaceAnimLoaded));
        aStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(this, this.LoadFailed));
    },

    // invoked when hyperspace animation group loaded
    HyperspaceAnimLoaded : function Game_BejApp$HyperspaceAnimLoaded(e) {
        var aStreamer = e.target;
        var aByteArray = aStreamer.mResultData;
        var aDataBuffer = new GameFramework.DataBuffer();
        aDataBuffer.InitRead(aByteArray);
        var aHyperAnimSequence = new Game.HyperAnimSequence();
        this.LoadHyperspaceAnim(aDataBuffer, aHyperAnimSequence);
        this.mHyperSpaceAnims.push(aHyperAnimSequence);
        this.LoadingThreadLoadingComplete(e);
    },

    // change resulotion
    ChangeArtRes : function Game_BejApp$ChangeArtRes(theWantRes) {
        this.SetLocalData(this.mProdName, 'ArtRes', GameFramework.Utils.ToString(theWantRes));
        //JS
        JSFExt_Reload();
        //-JS
    },

    SocialConnected : function Game_BejApp$SocialConnected(e) {
        this.mConnecting = false;
        this.LoadingThreadLoadingComplete(e);
    },

    // invoked when one group resource is loaded
    LoadingThreadLoadingComplete : function Game_BejApp$LoadingThreadLoadingComplete(e) {
        this.mGroupsLoading--;
        if((this.mGroupsLoading == 0) && (!this.mLoadingThreadComplete)) {
            //JS
            this.mDistributeLoadTime = false;
            //-JS
            this.StreamResourceGroup('Music');
            this.SubmitStandardMetrics('load_complete', [new GameFramework.misc.KeyVal('LoadSeconds', ((GameFramework.Utils.GetRunningMilliseconds() / 1000) | 0))]);
            this.SetMusicVolume(this.mProfile.mMusicVolume);
            this.SetSoundVolume(this.mProfile.mSfxVolume);
            this.PlayMusic(Game.Resources.SOUND_MUSIC_MENU_ID);
            this.mTopLayerWidget.InitMessager();
            this.mLoadingThreadComplete = true;
            Game.Resources['FONT_DIALOG_BUTTONS'].PushLayerColor('MAIN', GameFramework.gfx.Color.RGBAToInt(255, 255, 255, 230));
            Game.Resources['FONT_DIALOG_BUTTONS'].PushLayerColor('OUTLINE', GameFramework.gfx.Color.RGBAToInt(255, 255, 255, 255));
            Game.Resources['FONT_DIALOG_BUTTONS'].PushLayerColor('GLOW', GameFramework.gfx.Color.RGBAToInt(255, 255, 255, 128));
            Game.Resources['FONT_DIALOG_HEADER'].PushLayerColor('MAIN', GameFramework.gfx.Color.RGBAToInt(255, 255, 255, 230));
            Game.Resources['FONT_DIALOG_HEADER'].PushLayerColor('OUTLINE', GameFramework.gfx.Color.RGBAToInt(255, 255, 255, 255));
            Game.Resources['FONT_DIALOG_HEADER'].PushLayerColor('GLOW', GameFramework.gfx.Color.RGBAToInt(255, 255, 255, 128));
            Game.Resources['IMAGE_BOARD_TIMER'].mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
            Game.Resources['IMAGE_BOARD_TIMER_RED'].mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
            Game.Resources['IMAGE_BOARD_TIMER_GOLD'].mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
            Game.Resources['IMAGE_LIGHTNING_TIMER_LIGHTNING'].mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
            Game.Resources['IMAGE_LIGHTNING_TIMER_GOLD_LIGHTNING'].mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
            Game.Resources['IMAGE_LIGHTNING_TIMER_RED_LIGHTNING'].mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
            Game.Resources['FONT_TIMER_LARGE'].SetPixelSnappingOverride(GameFramework.resources.PixelSnapping.Never);
            Game.Resources['FONT_TIMER_SMALL'].SetPixelSnappingOverride(GameFramework.resources.PixelSnapping.Never);
            this.mGems3D.push(this.mResourceManager.GetMeshResourceById(this.mResourceManager.PathToId('3d/gemRed.p3d')));
            this.mGems3D.push(this.mResourceManager.GetMeshResourceById(this.mResourceManager.PathToId('3d/gemWhite.p3d')));
            this.mGems3D.push(this.mResourceManager.GetMeshResourceById(this.mResourceManager.PathToId('3d/gemGreen.p3d')));
            this.mGems3D.push(this.mResourceManager.GetMeshResourceById(this.mResourceManager.PathToId('3d/gemYellow.p3d')));
            this.mGems3D.push(this.mResourceManager.GetMeshResourceById(this.mResourceManager.PathToId('3d/gemPurple.p3d')));
            this.mGems3D.push(this.mResourceManager.GetMeshResourceById(this.mResourceManager.PathToId('3d/gemOrange.p3d')));
            this.mGems3D.push(this.mResourceManager.GetMeshResourceById(this.mResourceManager.PathToId('3d/gemBlue.p3d')));
            this.mWarpTube3D = this.mResourceManager.GetMeshResourceById(this.mResourceManager.PathToId('3d/warptube.p3d'));
            this.mWarpTube3D.AddEventListener(GameFramework.resources.MeshEvent.PREDRAW_SET, ss.Delegate.create(Game.HyperspaceUltra, Game.HyperspaceUltra.HypertubePredrawSet));
            this.mWarpTube3D.AddEventListener(GameFramework.resources.MeshEvent.POSTDRAW_SET, ss.Delegate.create(Game.HyperspaceUltra, Game.HyperspaceUltra.HypertubePostdrawSet));
            this.mWarpTubeCap3D = this.mResourceManager.GetMeshResourceById(this.mResourceManager.PathToId('3d/warptube_cap.p3d'));
        }
    },

    DoModalDialog : function Game_BejApp$DoModalDialog(theDialogHeader, theDialogLines, theDialogFooter, theButtonMode, theDialogId) {
        if(theDialogId === undefined) {
            theDialogId = Game.DM.EDialog.UNKNOWN_MODAL;
        }
        var aDialog = new Game.Bej3Dialog(Game.Resources['IMAGE_DIALOG_BACKGROUND'], Game.Resources['IMAGE_DIALOG_BUTTON'], theDialogId, true, theDialogHeader, theDialogLines, theDialogFooter, theButtonMode);
        aDialog.SetButtonFont(Game.Resources['FONT_DIALOG_BUTTONS']);
        aDialog.SetHeaderFont(Game.Resources['FONT_DIALOG_HEADER']);
        aDialog.SetLinesFont(Game.Resources['FONT_DIALOG_TEXT']);
        aDialog.mContentInsets = new GameFramework.Insets(128, 20, 128, 64);
        aDialog.SetColor(GameFramework.widgets.Dialog.COLOR_LINES, 0xff000000);
        aDialog.mSpaceAfterHeader = 32;
        aDialog.Resize(((1600 / 2) | 0) - ((1000 / 2) | 0), 300, 1000, aDialog.GetPreferredHeight(1000));
        this.mDialogMgr.AddDialog(aDialog);
        return aDialog;
    },
    DoSimpleDialog : function Game_BejApp$DoSimpleDialog(theDialogHeader, theDialogLines, theDialogFooter, theButtonMode) {
        if(theDialogFooter === undefined) {
            theDialogFooter = '';
        }
        if(theButtonMode === undefined) {
            theButtonMode = GameFramework.widgets.Dialog.BUTTONS_FOOTER;
        }
        var aDialog = this.DoModalDialog(theDialogHeader, theDialogLines, theDialogFooter, theButtonMode);
        aDialog.mYesButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.ButtonCloseDialog));
    },
    ClearBoard : function Game_BejApp$ClearBoard() {
        if(this.mBoard != null) {
            this.mGameLayerWidget.RemoveWidget(this.mBoard);
            this.mBoard.Dispose();
            this.mBoard = null;
        }
    },
    doNewGame : function Game_BejApp$doNewGame(theBoard) {
        this.ClearBoard();
        this.mBoard = theBoard;
        this.mGameLayerWidget.AddWidget(this.mBoard);
        this.mBoard.Init();
        this.mBoard.NewGame();
        this.mBoard.Resize(0, 0, 1600, 1200);
        this.mBaseWidgetAppState.SetFocus(this.mBoard);
        if(!this.mIsSlow) {
        } else {
        }
        this.mBoard.mBackground.mVisible = false;
        if(this.mMainMenu != null) {
            this.mMainMenu.mLeftButton.mImage = Game.Resources['IMAGE_BACKGROUNDS_HORSE_FOREST_TREE_FLATTENEDPAM'];
        }
        //JS
        gTimeAcc = 0;
        //-JS
    },
    SetSoundVolume : function Game_BejApp$SetSoundVolume(theVolume) {
        this.mSoundManager.SetVolume(theVolume, 0);
    },
    SetMusicVolume : function Game_BejApp$SetMusicVolume(theVolume) {
        this.mWantMusicVolume = theVolume;
    },
    PlayMusic : function Game_BejApp$PlayMusic(theSoundResourceId, theFadeout, loopMusic) {
        if(theFadeout === undefined) {
            theFadeout = null;
        }
        if(loopMusic === undefined) {
            loopMusic = true;
        }
        if(theSoundResourceId != this.mWantMusicInstanceId) {
            if(theFadeout == null) {
                if(this.mMusicInstance != null) {
                    this.mMusicInstance.Stop();
                    this.mMusicInstance = null;
                }
            }
            this.mMusicFade = theFadeout;
            this.mWantMusicInstanceId = theSoundResourceId;
        }
        this.mLoopMusic = loopMusic;
    },
    UpdateMusic : function Game_BejApp$UpdateMusic() {
        var aVolume = this.mWantMusicVolume;
        if(aVolume < 0.04) {
            aVolume = 0.0;
        }
        if(this.mMusicFade != null) {
            this.mMusicFade.IncInVal();
            aVolume = aVolume * this.mMusicFade.get_v();
        }
        if(aVolume == 0) {
            this.mMusicFade = null;
        }
        if((this.mMusicInstance != null) && (aVolume == 0)) {
            this.mMusicInstance.Stop();
            this.mMusicInstance = null;
        }
        if(this.mBackgrounded) {
            aVolume = 0.0;
        }
        if((this.mMusicInstance == null) && (this.mWantMusicInstanceId != null) && (aVolume > 0)) {
            var aSoundResource = this.mResourceManager.GetSoundResourceById(this.mWantMusicInstanceId);
            if(aSoundResource != null) {
                this.mMusicInstance = this.GetSoundInst(aSoundResource);
                if(this.mMusicInstance != null) {
                    this.mMusicInstance.SetSoundGroup(1);
                    this.mMusicInstance.SetVolume(aVolume);
                    this.mMusicInstance.PlayEx(this.mLoopMusic, false);
                }
                this.mCurMusicVolume = aVolume;
            }
        }
        if((this.mMusicInstance != null) && (aVolume != this.mCurMusicVolume)) {
            this.mMusicInstance.SetVolume(aVolume);
            this.mCurMusicVolume = aVolume;
        }
    },
    BackToMenu : function Game_BejApp$BackToMenu() {
        if(this.mBoard != null) {
            this.mMainMenu.UpdateBackgroundImageForActiveBtn(this.mBoard.mBackground.GetBackgroundImage$2());
        }
        this.mMainMenu.mVisible = true;
        this.mMainMenu.PlayLeaveAnim();
        var aMusicFade = new GameFramework.CurvedVal();
        aMusicFade.SetCurveRef('BejApp_cs_11_21_11__05_46_54_679');
        Game.BejApp.mBejApp.PlayMusic(Game.Resources.SOUND_MUSIC_MENU_ID, aMusicFade);
    },
    DoNewClassicGame : function Game_BejApp$DoNewClassicGame() {
        this.doNewGame(new Game.ClassicBoard(this));
    },
    DoNewSpeedGame : function Game_BejApp$DoNewSpeedGame() {
        this.doNewGame(new Game.SpeedBoard(this));
    },
    GetDialog : function Game_BejApp$GetDialog(theDialogId) {
        return this.mDialogMgr.GetDialog(theDialogId);
    },
    LoadHyperspaceAnimConv : function Game_BejApp$LoadHyperspaceAnimConv(theDataBuffer, theHyperSpaceAnim, theOutBuffer) {
        var formatVer = theDataBuffer.ReadInt();
        if(formatVer != 0x3 && formatVer != 0x2) {
            return false;
        }
        theOutBuffer.WriteInt(4);
        var frameCount = theDataBuffer.ReadInt();
        theOutBuffer.WriteInt(frameCount);
        var lightCount = theDataBuffer.ReadInt();
        theOutBuffer.WriteInt(lightCount);
        if(theHyperSpaceAnim != null) {
        }
        theHyperSpaceAnim.mFrameCount = frameCount;
        theHyperSpaceAnim.mLightCount = lightCount;
        theHyperSpaceAnim.mCamera = Array.Create(frameCount, null);
        theHyperSpaceAnim.mBoard = Array.Create(frameCount, null);
        theHyperSpaceAnim.mGems = Array.Create3D(Game.Board.NUM_ROWS, Game.Board.NUM_COLS, frameCount, null);
        theHyperSpaceAnim.mLights = Array.Create2D(lightCount, frameCount, null);
        for(var row = 0; row < Game.Board.NUM_ROWS; ++row) {
            for(var col = 0; col < Game.Board.NUM_COLS; ++col) {
                theHyperSpaceAnim.mGemHitFrame[theHyperSpaceAnim.mGemHitFrame.mIdxMult0 * (row) + col] = theHyperSpaceAnim.mFrameCount;
            }
        }
        if(formatVer >= 0x3) {
            var numHiddenObjects = theDataBuffer.ReadInt();
            theOutBuffer.WriteInt(numHiddenObjects);
            for(var hiddenObjTableIdx = 0; hiddenObjTableIdx < numHiddenObjects; ++hiddenObjTableIdx) {
                var trackId = theDataBuffer.ReadInt();
                theOutBuffer.WriteInt(trackId);
                var shouldHideAtFrameNum = theDataBuffer.ReadInt();
                theOutBuffer.WriteInt(shouldHideAtFrameNum);
                if(trackId < 2 || trackId > 65) {
                    continue;
                }
                var gemCol = (trackId - 2) % 8;
                var gemRow = (((((trackId - 2) - gemCol) / 8) | 0));
                theHyperSpaceAnim.mGemHitFrame[theHyperSpaceAnim.mGemHitFrame.mIdxMult0 * (gemRow) + gemCol] = shouldHideAtFrameNum;
            }
        }
        var aTrackingRot = Array.Create2D(8, 8, null);
        var aTrackingPos = Array.Create2D(8, 8, null);
        var aTrackingPosPrev = Array.Create2D(8, 8, null);
        for(var frame = 0; frame < frameCount; ++frame) {
            var trackId_2;
            var trackKind;
            if(frame != theDataBuffer.ReadInt()) {
                return false;
            }
            trackId_2 = theDataBuffer.ReadInt();
            if(trackId_2 != 0) {
                return false;
            }
            trackKind = theDataBuffer.ReadInt();
            theHyperSpaceAnim.mCamera[frame] = new Game.HyperAnimKey();
            theHyperSpaceAnim.mCamera[frame].mPos.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mPos.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mPos.z = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mRot.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mRot.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mRot.z = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mScale.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mScale.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mScale.z = theDataBuffer.ReadFloat();
            {
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mCamera[frame].mPos.x);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mCamera[frame].mPos.y);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mCamera[frame].mPos.z);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mCamera[frame].mRot.x);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mCamera[frame].mRot.y);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mCamera[frame].mRot.z);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mCamera[frame].mScale.x);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mCamera[frame].mScale.y);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mCamera[frame].mScale.z);
            }
            trackId_2 = theDataBuffer.ReadInt();
            if(trackId_2 != 1) {
                return false;
            }
            trackKind = theDataBuffer.ReadInt();
            theHyperSpaceAnim.mBoard[frame] = new Game.HyperAnimKey();
            theHyperSpaceAnim.mBoard[frame].mPos.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mPos.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mPos.z = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mRot.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mRot.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mRot.z = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mScale.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mScale.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mScale.z = theDataBuffer.ReadFloat();
            {
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mBoard[frame].mPos.x);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mBoard[frame].mPos.y);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mBoard[frame].mPos.z);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mBoard[frame].mRot.x);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mBoard[frame].mRot.y);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mBoard[frame].mRot.z);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mBoard[frame].mScale.x);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mBoard[frame].mScale.y);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mBoard[frame].mScale.z);
            }
            var aXDeltaScale = 0;
            var aYDeltaScale = 0;
            var aZDeltaScale = 0;
            var aXRotDeltaScale = 0;
            var aYRotDeltaScale = 0;
            var aZRotDeltaScale = 0;
            for(var row_2 = 0; row_2 < Game.Board.NUM_ROWS; ++row_2) {
                for(var col_2 = 0; col_2 < Game.Board.NUM_COLS; ++col_2) {
                    trackId_2 = theDataBuffer.ReadInt();
                    trackKind = theDataBuffer.ReadInt();
                    theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame] = new Game.HyperAnimKey();
                    theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.x = theDataBuffer.ReadFloat();
                    theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.y = theDataBuffer.ReadFloat();
                    theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.z = theDataBuffer.ReadFloat();
                    theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.x = theDataBuffer.ReadFloat();
                    theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.y = theDataBuffer.ReadFloat();
                    theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.z = theDataBuffer.ReadFloat();
                    theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.x = theDataBuffer.ReadFloat();
                    theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.y = theDataBuffer.ReadFloat();
                    theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.z = theDataBuffer.ReadFloat();
                    if(frame > 0) {
                        var aDelta = Math.abs(aTrackingPos[aTrackingPos.mIdxMult0 * (row_2) + col_2].x - theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.x);
                        aXDeltaScale = Math.max(aDelta, aXDeltaScale);
                        aDelta = Math.abs(aTrackingPos[aTrackingPos.mIdxMult0 * (row_2) + col_2].y - theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.y);
                        aYDeltaScale = Math.max(aDelta, aYDeltaScale);
                        aDelta = Math.abs(aTrackingPos[aTrackingPos.mIdxMult0 * (row_2) + col_2].z - theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.z);
                        aZDeltaScale = Math.max(aDelta, aZDeltaScale);
                        aDelta = Math.abs(aTrackingRot[aTrackingRot.mIdxMult0 * (row_2) + col_2].x - theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.x);
                        aXRotDeltaScale = Math.max(aDelta, aXRotDeltaScale);
                        aDelta = Math.abs(aTrackingRot[aTrackingRot.mIdxMult0 * (row_2) + col_2].y - theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.y);
                        aYRotDeltaScale = Math.max(aDelta, aYRotDeltaScale);
                        aDelta = Math.abs(aTrackingRot[aTrackingRot.mIdxMult0 * (row_2) + col_2].z - theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.z);
                        aZRotDeltaScale = Math.max(aDelta, aZRotDeltaScale);
                    }
                }
            }
            aXDeltaScale = Math.min(aXDeltaScale, 50.0);
            aYDeltaScale = Math.min(aYDeltaScale, 50.0);
            aZDeltaScale = Math.min(aZDeltaScale, frame * 1.0);
            aXRotDeltaScale = Math.min(aXRotDeltaScale, 0.25);
            aYRotDeltaScale = Math.min(aYRotDeltaScale, 0.25);
            aZRotDeltaScale = Math.min(aZRotDeltaScale, 0.25);
            theOutBuffer.WriteFloat(aXDeltaScale);
            theOutBuffer.WriteFloat(aYDeltaScale);
            theOutBuffer.WriteFloat(aZDeltaScale);
            theOutBuffer.WriteFloat(aXRotDeltaScale);
            theOutBuffer.WriteFloat(aYRotDeltaScale);
            theOutBuffer.WriteFloat(aZRotDeltaScale);
            for(var row_3 = 0; row_3 < Game.Board.NUM_ROWS; ++row_3) {
                for(var col_3 = 0; col_3 < Game.Board.NUM_COLS; ++col_3) {
                    if(frame == 0) {
                        aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3] = new GameFramework.geom.Vector3(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.x, theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.y, theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.z);
                        aTrackingRot[aTrackingRot.mIdxMult0 * (row_3) + col_3] = new GameFramework.geom.Vector3(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.x, theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.y, theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.z);
                        theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.x);
                        theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.y);
                        theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.z);
                        theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.x);
                        theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.y);
                        theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.z);
                        theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mScale.x);
                        theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mScale.y);
                        theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mScale.z);
                    } else {
                        var aFlags = 0;
                        var xbyte = 0;
                        var ybyte = 0;
                        var zbyte = 0;
                        var xrotbyte = 0;
                        var yrotbyte = 0;
                        var zrotbyte = 0;
                        var aDelta_2 = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.x - aTrackingRot[aTrackingRot.mIdxMult0 * (row_3) + col_3].x;
                        if(Math.abs(aDelta_2) <= aXRotDeltaScale) {
                            xrotbyte = Game.BejApp.FloatToByte(aDelta_2, aXRotDeltaScale);
                            if(xrotbyte != 0) {
                                aTrackingRot[aTrackingRot.mIdxMult0 * (row_3) + col_3].x += Game.BejApp.ByteToFloat(xrotbyte, aXRotDeltaScale);
                                aFlags |= 1;
                            }
                        } else {
                            aTrackingRot[aTrackingRot.mIdxMult0 * (row_3) + col_3].x = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.x;
                            aFlags |= 1024;
                        }
                        aDelta_2 = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.y - aTrackingRot[aTrackingRot.mIdxMult0 * (row_3) + col_3].y;
                        if(Math.abs(aDelta_2) <= aYRotDeltaScale) {
                            yrotbyte = Game.BejApp.FloatToByte(aDelta_2, aYRotDeltaScale);
                            if(yrotbyte != 0) {
                                aTrackingRot[aTrackingRot.mIdxMult0 * (row_3) + col_3].y += Game.BejApp.ByteToFloat(yrotbyte, aYRotDeltaScale);
                                aFlags |= 2;
                            }
                        } else {
                            aTrackingRot[aTrackingRot.mIdxMult0 * (row_3) + col_3].y = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.y;
                            aFlags |= 2048;
                        }
                        aDelta_2 = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.z - aTrackingRot[aTrackingRot.mIdxMult0 * (row_3) + col_3].z;
                        if(Math.abs(aDelta_2) <= aZRotDeltaScale) {
                            zrotbyte = Game.BejApp.FloatToByte(aDelta_2, aZRotDeltaScale);
                            if(zrotbyte != 0) {
                                aTrackingRot[aTrackingRot.mIdxMult0 * (row_3) + col_3].z += Game.BejApp.ByteToFloat(zrotbyte, aZRotDeltaScale);
                                aFlags |= 4;
                            }
                        } else {
                            aTrackingRot[aTrackingRot.mIdxMult0 * (row_3) + col_3].z = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.z;
                            aFlags |= 4096;
                        }
                        var aPrevTrackingPos = new GameFramework.geom.Vector3(aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].x, aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].y, aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].z);
                        var aString = '' + frame + ' Cur:' + theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (0) + theHyperSpaceAnim.mGems.mIdxMult1 * (0) + frame].mPos.x;
                        if(aTrackingPos[aTrackingPos.mIdxMult0 * (0) + 0] != null) {
                            aString += ' TrackingPos:' + aTrackingPos[aTrackingPos.mIdxMult0 * (0) + 0].x;
                        }
                        if(aTrackingPosPrev[aTrackingPosPrev.mIdxMult0 * (0) + 0] != null) {
                            aString += ' TrackingPosPrev:' + aTrackingPosPrev[aTrackingPosPrev.mIdxMult0 * (0) + 0].x;
                        }
                        if(frame == 1) {
                            aFlags |= 16 | 64 | 256;
                            aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3] = new GameFramework.geom.Vector3(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.x, theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.y, theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.z);
                            aTrackingPosPrev[aTrackingPosPrev.mIdxMult0 * (row_3) + col_3] = aPrevTrackingPos;
                            aTrackingRot[aTrackingRot.mIdxMult0 * (row_3) + col_3] = new GameFramework.geom.Vector3(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.x, theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.y, theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.z);
                        } else {
                            if(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.x != theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame - 1].mPos.x) {
                                aDelta_2 = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.x - aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].x;
                                if(Math.abs(aDelta_2) <= aXDeltaScale) {
                                    xbyte = Game.BejApp.FloatToByte(aDelta_2, aXDeltaScale);
                                    if(xbyte != 0) {
                                        aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].x += Game.BejApp.ByteToFloat(xbyte, aXDeltaScale);
                                        aString += ' Guessing:' + aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].x;
                                        aFlags |= 8;
                                    }
                                } else {
                                    aString += ' Setting:' + theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.x;
                                    aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].x = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.x;
                                    aFlags |= 16;
                                }
                            }
                            if(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.y != theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame - 1].mPos.y) {
                                aDelta_2 = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.y - aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].y;
                                if(Math.abs(aDelta_2) <= aYDeltaScale) {
                                    ybyte = Game.BejApp.FloatToByte(aDelta_2, aYDeltaScale);
                                    if(ybyte != 0) {
                                        aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].y += Game.BejApp.ByteToFloat(ybyte, aYDeltaScale);
                                        aFlags |= 32;
                                    }
                                } else {
                                    aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].y = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.y;
                                    aFlags |= 64;
                                }
                            }
                            if(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.z != theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame - 1].mPos.z) {
                                aDelta_2 = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.z - aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].z;
                                if(Math.abs(aDelta_2) <= aZDeltaScale) {
                                    zbyte = Game.BejApp.FloatToByte(aDelta_2, aZDeltaScale);
                                    if(xbyte != 0) {
                                        aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].z += Game.BejApp.ByteToFloat(zbyte, aZDeltaScale);
                                        aFlags |= 128;
                                    }
                                } else {
                                    aTrackingPos[aTrackingPos.mIdxMult0 * (row_3) + col_3].z = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.z;
                                    aFlags |= 256;
                                }
                            }
                        }
                        aTrackingPosPrev[aTrackingPosPrev.mIdxMult0 * (row_3) + col_3] = aPrevTrackingPos;
                        if((theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mScale.x != theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame - 1].mScale.x) || (theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mScale.y != theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame - 1].mScale.y) || (theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mScale.z != theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame - 1].mScale.z)) {
                            aFlags |= 512;
                        }
                        theOutBuffer.WriteShort(aFlags);
                        if((aFlags & 1) != 0) {
                            theOutBuffer.WriteByte(xrotbyte);
                        } else if((aFlags & 1024) != 0) {
                            theOutBuffer.WriteShort(Game.BejApp.RotToShort(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.x));
                        }
                        if((aFlags & 2) != 0) {
                            theOutBuffer.WriteByte(yrotbyte);
                        } else if((aFlags & 2048) != 0) {
                            theOutBuffer.WriteShort(Game.BejApp.RotToShort(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.y));
                        }
                        if((aFlags & 4) != 0) {
                            theOutBuffer.WriteByte(zrotbyte);
                        } else if((aFlags & 4096) != 0) {
                            theOutBuffer.WriteShort(Game.BejApp.RotToShort(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mRot.z));
                        }
                        if((aFlags & 8) != 0) {
                            theOutBuffer.WriteByte(xbyte);
                        }
                        if((aFlags & 16) != 0) {
                            theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.x);
                        }
                        if((aFlags & 32) != 0) {
                            theOutBuffer.WriteByte(ybyte);
                        }
                        if((aFlags & 64) != 0) {
                            theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.y);
                        }
                        if((aFlags & 128) != 0) {
                            theOutBuffer.WriteByte(zbyte);
                        }
                        if((aFlags & 256) != 0) {
                            theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mPos.z);
                        }
                        if((aFlags & 512) != 0) {
                            theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mScale.x);
                            theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mScale.y);
                            theOutBuffer.WriteFloat(theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_3) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_3) + frame].mScale.z);
                        }
                    }
                }
            }
            for(var light = 0; light < lightCount; ++light) {
                trackId_2 = theDataBuffer.ReadInt();
                trackKind = theDataBuffer.ReadInt();
                theHyperSpaceAnim.mLights[theHyperSpaceAnim.mLights.mIdxMult0 * (light) + frame] = new Game.HyperAnimKey();
                theHyperSpaceAnim.mLights[theHyperSpaceAnim.mLights.mIdxMult0 * (light) + frame].mPos.x = theDataBuffer.ReadFloat();
                theHyperSpaceAnim.mLights[theHyperSpaceAnim.mLights.mIdxMult0 * (light) + frame].mPos.y = theDataBuffer.ReadFloat();
                theHyperSpaceAnim.mLights[theHyperSpaceAnim.mLights.mIdxMult0 * (light) + frame].mPos.z = theDataBuffer.ReadFloat();
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mLights[theHyperSpaceAnim.mLights.mIdxMult0 * (light) + frame].mPos.x);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mLights[theHyperSpaceAnim.mLights.mIdxMult0 * (light) + frame].mPos.y);
                theOutBuffer.WriteFloat(theHyperSpaceAnim.mLights[theHyperSpaceAnim.mLights.mIdxMult0 * (light) + frame].mPos.z);
            }
        }
        return true;
    },
    SetBackgrounded : function Game_BejApp$SetBackgrounded(isBackgrounded) {
        this.mBackgrounded = isBackgrounded;
        this.UpdateMusic();
    },
    LoadHyperspaceAnim : function Game_BejApp$LoadHyperspaceAnim(theDataBuffer, theHyperSpaceAnim) {
        var formatVer = theDataBuffer.ReadInt();
        if(formatVer != 0x4) {
            return false;
        }
        var frameCount = theDataBuffer.ReadInt();
        var lightCount = theDataBuffer.ReadInt();
        theHyperSpaceAnim.mFrameCount = frameCount;
        theHyperSpaceAnim.mLightCount = lightCount;
        theHyperSpaceAnim.mCamera = Array.Create(frameCount, null);
        theHyperSpaceAnim.mBoard = Array.Create(frameCount, null);
        theHyperSpaceAnim.mGems = Array.Create3D(Game.Board.NUM_ROWS, Game.Board.NUM_COLS, frameCount, null);
        theHyperSpaceAnim.mLights = Array.Create2D(lightCount, frameCount, null);
        for(var row = 0; row < Game.Board.NUM_ROWS; ++row) {
            for(var col = 0; col < Game.Board.NUM_COLS; ++col) {
                theHyperSpaceAnim.mGemHitFrame[theHyperSpaceAnim.mGemHitFrame.mIdxMult0 * (row) + col] = theHyperSpaceAnim.mFrameCount;
            }
        }
        if(formatVer >= 0x3) {
            var numHiddenObjects = theDataBuffer.ReadInt();
            for(var hiddenObjTableIdx = 0; hiddenObjTableIdx < numHiddenObjects; ++hiddenObjTableIdx) {
                var trackId = theDataBuffer.ReadInt();
                var shouldHideAtFrameNum = theDataBuffer.ReadInt();
                if(trackId < 2 || trackId > 65) {
                    continue;
                }
                var gemCol = (trackId - 2) % 8;
                var gemRow = (((((trackId - 2) - gemCol) / 8) | 0));
                theHyperSpaceAnim.mGemHitFrame[theHyperSpaceAnim.mGemHitFrame.mIdxMult0 * (gemRow) + gemCol] = shouldHideAtFrameNum;
            }
        }
        for(var frame = 0; frame < frameCount; ++frame) {
            theHyperSpaceAnim.mCamera[frame] = new Game.HyperAnimKey();
            theHyperSpaceAnim.mCamera[frame].mPos.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mPos.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mPos.z = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mRot.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mRot.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mRot.z = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mScale.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mScale.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mCamera[frame].mScale.z = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame] = new Game.HyperAnimKey();
            theHyperSpaceAnim.mBoard[frame].mPos.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mPos.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mPos.z = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mRot.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mRot.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mRot.z = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mScale.x = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mScale.y = theDataBuffer.ReadFloat();
            theHyperSpaceAnim.mBoard[frame].mScale.z = theDataBuffer.ReadFloat();
            var aXDeltaScale = theDataBuffer.ReadFloat();
            var aYDeltaScale = theDataBuffer.ReadFloat();
            var aZDeltaScale = theDataBuffer.ReadFloat();
            var aXRotDeltaScale = theDataBuffer.ReadFloat();
            var aYRotDeltaScale = theDataBuffer.ReadFloat();
            var aZRotDeltaScale = theDataBuffer.ReadFloat();
            for(var row_2 = 0; row_2 < Game.Board.NUM_ROWS; ++row_2) {
                for(var col_2 = 0; col_2 < Game.Board.NUM_COLS; ++col_2) {
                    theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame] = new Game.HyperAnimKey();
                    if(frame == 0) {
                        theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.x = theDataBuffer.ReadFloat();
                        theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.y = theDataBuffer.ReadFloat();
                        theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.z = theDataBuffer.ReadFloat();
                        theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.x = theDataBuffer.ReadFloat();
                        theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.y = theDataBuffer.ReadFloat();
                        theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.z = theDataBuffer.ReadFloat();
                        theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.x = theDataBuffer.ReadFloat();
                        theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.y = theDataBuffer.ReadFloat();
                        theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.z = theDataBuffer.ReadFloat();
                    } else {
                        var aFlags = theDataBuffer.ReadShort();
                        if((aFlags & 1) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.x = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mRot.x + Game.BejApp.ByteToFloat(theDataBuffer.ReadByte(), aXRotDeltaScale);
                        } else if((aFlags & 1024) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.x = Game.BejApp.ShortToRot(theDataBuffer.ReadShort());
                        } else {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.x = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mRot.x;
                        }
                        if((aFlags & 2) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.y = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mRot.y + Game.BejApp.ByteToFloat(theDataBuffer.ReadByte(), aYRotDeltaScale);
                        } else if((aFlags & 2048) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.y = Game.BejApp.ShortToRot(theDataBuffer.ReadShort());
                        } else {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.y = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mRot.y;
                        }
                        if((aFlags & 4) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.z = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mRot.z + Game.BejApp.ByteToFloat(theDataBuffer.ReadByte(), aZRotDeltaScale);
                        } else if((aFlags & 4096) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.z = Game.BejApp.ShortToRot(theDataBuffer.ReadShort());
                        } else {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mRot.z = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mRot.z;
                        }
                        if((aFlags & 8) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.x = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mPos.x + Game.BejApp.ByteToFloat(theDataBuffer.ReadByte(), aXDeltaScale);
                        } else if((aFlags & 16) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.x = theDataBuffer.ReadFloat();
                        } else {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.x = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mPos.x;
                        }
                        if((aFlags & 32) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.y = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mPos.y + Game.BejApp.ByteToFloat(theDataBuffer.ReadByte(), aYDeltaScale);
                        } else if((aFlags & 64) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.y = theDataBuffer.ReadFloat();
                        } else {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.y = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mPos.y;
                        }
                        if((aFlags & 128) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.z = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mPos.z + Game.BejApp.ByteToFloat(theDataBuffer.ReadByte(), aZDeltaScale);
                        } else if((aFlags & 256) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.z = theDataBuffer.ReadFloat();
                        } else {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mPos.z = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mPos.z;
                        }
                        if((aFlags & 512) != 0) {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.x = theDataBuffer.ReadFloat();
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.y = theDataBuffer.ReadFloat();
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.z = theDataBuffer.ReadFloat();
                        } else {
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.x = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mScale.x;
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.y = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mScale.y;
                            theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame].mScale.z = theHyperSpaceAnim.mGems[theHyperSpaceAnim.mGems.mIdxMult0 * (row_2) + theHyperSpaceAnim.mGems.mIdxMult1 * (col_2) + frame - 1].mScale.z;
                        }
                    }
                }
            }
            for(var light = 0; light < lightCount; ++light) {
                theHyperSpaceAnim.mLights[theHyperSpaceAnim.mLights.mIdxMult0 * (light) + frame] = new Game.HyperAnimKey();
                theHyperSpaceAnim.mLights[theHyperSpaceAnim.mLights.mIdxMult0 * (light) + frame].mPos.x = theDataBuffer.ReadFloat();
                theHyperSpaceAnim.mLights[theHyperSpaceAnim.mLights.mIdxMult0 * (light) + frame].mPos.y = theDataBuffer.ReadFloat();
                theHyperSpaceAnim.mLights[theHyperSpaceAnim.mLights.mIdxMult0 * (light) + frame].mPos.z = theDataBuffer.ReadFloat();
            }
        }
        return true;
    }
}
Game.BejApp.prototype['SetDebugMode'] = Game.BejApp.prototype.SetDebugMode;
Game.BejApp.prototype['GetArtRes'] = Game.BejApp.prototype.GetArtRes;
Game.BejApp.prototype['SetArtRes'] = Game.BejApp.prototype.SetArtRes;
Game.BejApp.prototype['SetPathPrefix'] = Game.BejApp.prototype.SetPathPrefix;
Game.BejApp.prototype['SetMetricsURL'] = Game.BejApp.prototype.SetMetricsURL;
Game.BejApp.prototype['SetThrottlingURL'] = Game.BejApp.prototype.SetThrottlingURL;
Game.BejApp.prototype['SetUserAgent'] = Game.BejApp.prototype.SetUserAgent;
Game.BejApp.prototype['SetUserId'] = Game.BejApp.prototype.SetUserId;
Game.BejApp.prototype['GetUserId'] = Game.BejApp.prototype.GetUserId;
Game.BejApp.prototype['SetUseGL'] = Game.BejApp.prototype.SetUseGL;
Game.BejApp.prototype['GetUseGL'] = Game.BejApp.prototype.GetUseGL;
Game.BejApp.prototype['SetBkgImagePath'] = Game.BejApp.prototype.SetBkgImagePath;
Game.BejApp.prototype['SizeChanged'] = Game.BejApp.prototype.SizeChanged;
Game.BejApp.prototype['Init'] = Game.BejApp.prototype.Init;
Game.BejApp.prototype['StartLoad'] = Game.BejApp.prototype.StartLoad;
Game.BejApp.prototype['SubmitStandardMetricsDict'] = Game.BejApp.prototype.SubmitStandardMetricsDict;
Game.BejApp.staticInit = function Game_BejApp$staticInit() {
    Game.BejApp.mBejApp = null;
}

JSFExt_AddInitFunc(function() {
    Game.BejApp.registerClass('Game.BejApp', GameFramework.JSBaseApp);
});
JSFExt_AddStaticInitFunc(function() {
    Game.BejApp.staticInit();
});