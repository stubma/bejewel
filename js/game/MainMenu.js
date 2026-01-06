Game.MainMenu = function Game_MainMenu() {
    this.mSelectedMode = Game.MainMenu.EMode._NONE;
    this.mPartnerLogos = [];
    this.mCamera = new GameFramework.gfx.PerspectiveCamera();
    this.mButtonCamera = new GameFramework.gfx.PerspectiveCamera();
    this.mRotation = new GameFramework.CurvedVal();
    this.mButtonRotationAdd = new GameFramework.CurvedVal();
    this.mForeBlackAlpha = new GameFramework.CurvedVal();
    this.mBkgBlackAlpha = new GameFramework.CurvedVal();
    this.mBWPct = new GameFramework.CurvedVal();
    this.mLogoAlpha = new GameFramework.CurvedVal();
    this.mLoaderAlpha = new GameFramework.CurvedVal();
    this.mGeomGlowAlpha = new GameFramework.CurvedVal();
    this.mCrystalAppearAlpha = new GameFramework.CurvedVal();
    this.mTitleAlpha = new GameFramework.CurvedVal();
    this.mOfflineUIAlpha = new GameFramework.CurvedVal();
    this.mTipTextAlpha = new GameFramework.CurvedVal();
    this.mBtns = [];
    this.mSDButtonTextAlpha = GameFramework.CurvedVal.CreateAsConstant(0.0);
    this.mHDButtonTextAlpha = GameFramework.CurvedVal.CreateAsConstant(0.0);
    this.Draw_txtAlpha = new GameFramework.CurvedVal("b;0,1,0.01,5,####  ,####K~###      ^~###m####");
    Game.MainMenu.initializeBase(this);
    Game.BejApp.mBejApp.mProfile.LoadProfile();
    this.mNeedsInit = true;
    this.mBkgBlackAlpha.SetConstant(0.0);
    this.mForeBlackAlpha.SetCurve("b;0,1,0.00125,1,~### Q~###        O####");
    this.mBWPct.SetConstant(1.0);
    this.mLogoAlpha.SetCurve("b;0,1,0.005,1,####         ~~###");
    this.mLoaderAlpha.SetCurve("b;0,1,0.005,1,####         ~~###");
    this.mTipTextAlpha.SetCurve("b;0,1,0.002,1,#### O####    R~###   }~###");
    this.mGeomGlowAlpha.SetConstant(1.0);
    this.mCrystalAppearAlpha.SetConstant(0.0);
    this.mTitleAlpha.SetConstant(0);
    this.mOfflineUIAlpha.SetConstant(0);
    this.CheckNeedsInit();
};
Game.MainMenu.prototype = {
    mSelectedMode: null,
    mNeedsInit: true,
    mPartnerLogos: null,
    mPartnerBlackAlpha: 0,
    mCamera: null,
    mButtonCamera: null,
    mRotation: null,
    mButtonRotationAdd: null,
    mForeBlackAlpha: null,
    mBkgBlackAlpha: null,
    mBWPct: null,
    mLogoAlpha: null,
    mLoaderAlpha: null,
    mGeomGlowAlpha: null,
    mCrystalAppearAlpha: null,
    mTitleAlpha: null,
    mOfflineUIAlpha: null,
    mTipTextAlpha: null,
    mHighestVirtFPS: 0,
    mBtns: null,
    mBackground: null,
    mPlayBackground: null,
    mLeftButton: null,
    mRightButton: null,
    mRecordsButton: null,
    mSDButtonTextAlpha: null,
    mSDButton: null,
    mHDButtonTextAlpha: null,
    mHDButton: null,
    mMenuButton: null,
    mUserNameFont: null,
    mDispLoadPct: 0,
    mLoaded: null,
    mFinishedLoadSequence: null,
    mSwitchedMusic: null,
    mDrawMainMenu: true,
    mHasLoaderResources: true,
    mHighestResCount: 1,
    Draw_txtAlpha: null,

    // invoked when Init group resource is loaded
    InitLoadingComplete: function Game_MainMenu$InitLoadingComplete() {
        // add standard resolution button
        var aButton = new GameFramework.widgets.ButtonWidget();
        aButton.mButtonImage = Game.Resources["IMAGE_BOARD_SD"];
        aButton.mX = aButton.mButtonImage.mOffsetX - 160;
        aButton.mY = aButton.mButtonImage.mOffsetY;
        aButton.mWidth = aButton.mButtonImage.mWidth;
        aButton.mHeight = aButton.mButtonImage.mHeight;
        if (Game.BejApp.mBejApp.mArtRes == 768) {
            aButton.mNormalCel = 0;
            aButton.mOverImage = aButton.mButtonImage;
            aButton.mOverCel = 1;
            aButton.mDownImage = aButton.mButtonImage;
            aButton.mDownCel = 1;
        } else {
            aButton.mNormalCel = 2;
            aButton.mDisabled = true;
        }
        aButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.SDClicked));
        this.AddWidget(aButton);
        this.mSDButton = aButton;

        // add high resolution button
        aButton = new Game.FrameButton();
        aButton.mButtonImage = Game.Resources["IMAGE_BOARD_HD"];
        aButton.mX = aButton.mButtonImage.mOffsetX - 160;
        aButton.mY = aButton.mButtonImage.mOffsetY;
        aButton.mWidth = aButton.mButtonImage.mWidth;
        aButton.mHeight = aButton.mButtonImage.mHeight;
        if (Game.BejApp.mBejApp.mArtRes == 480) {
            aButton.mNormalCel = 0;
            aButton.mOverImage = aButton.mButtonImage;
            aButton.mOverCel = 1;
            aButton.mDownImage = aButton.mButtonImage;
            aButton.mDownCel = 1;
        } else {
            aButton.mNormalCel = 2;
            aButton.mDisabled = true;
        }
        aButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.HDClicked));
        this.AddWidget(aButton);
        this.mHDButton = aButton;
    },

    HandleMenuClicked: function Game_MainMenu$HandleMenuClicked(e) {
        var aDialog = new Game.OptionsDialog(false);
        Game.BejApp.mBejApp.mDialogMgr.AddDialog(aDialog);
    },
    SDConfirmed: function Game_MainMenu$SDConfirmed(e) {
        Game.BejApp.mBejApp.ChangeArtRes(480);
    },
    SDClicked: function Game_MainMenu$SDClicked(e) {
        if (this.mLoaded) {
            var aDialog = Game.BejApp.mBejApp.DoModalDialog(
                "SWITCH RESOLUTION",
                "Are you sure you want to switch to Standard Definition?\n\nThis will reload the game.",
                null,
                GameFramework.widgets.Dialog.BUTTONS_YES_NO
            );
            aDialog.mYesButton.AddEventListener(
                GameFramework.widgets.WidgetEvent.CLICKED,
                ss.Delegate.create(this, this.SDConfirmed)
            );
            aDialog.mNoButton.AddEventListener(
                GameFramework.widgets.WidgetEvent.CLICKED,
                ss.Delegate.create(Game.BejApp.mBejApp, Game.BejApp.mBejApp.ButtonCloseDialog)
            );
        } else {
            this.SDConfirmed(e);
        }
    },
    HDConfirmed: function Game_MainMenu$HDConfirmed(e) {
        Game.BejApp.mBejApp.ChangeArtRes(768);
    },
    HDClicked: function Game_MainMenu$HDClicked(e) {
        if (this.mLoaded) {
            var aDialog = Game.BejApp.mBejApp.DoModalDialog(
                "SWITCH RESOLUTION",
                "Are you sure you want to switch to High Definition?\n\nThis will reload the game.",
                null,
                GameFramework.widgets.Dialog.BUTTONS_YES_NO
            );
            aDialog.mYesButton.AddEventListener(
                GameFramework.widgets.WidgetEvent.CLICKED,
                ss.Delegate.create(this, this.HDConfirmed)
            );
            aDialog.mNoButton.AddEventListener(
                GameFramework.widgets.WidgetEvent.CLICKED,
                ss.Delegate.create(Game.BejApp.mBejApp, Game.BejApp.mBejApp.ButtonCloseDialog)
            );
        } else {
            this.HDConfirmed(e);
        }
    },
    Reset: function Game_MainMenu$Reset() {},
    CheckNeedsInit: function Game_MainMenu$CheckNeedsInit() {
        if (!this.mNeedsInit) {
            return false;
        } else if (!Game.BejApp.mBejApp.mLoadingThreadComplete) {
            return true;
        }
        this.mNeedsInit = false;
        this.mRotation.SetConstant(0);
        this.mLeftButton = new Game.CrystalBall("CLASSIC", Game.MainMenu.EId.ClassicBtn | 0);
        this.mBtns[Game.MainMenu.EId.ClassicBtn | 0] = this.mLeftButton;
        this.AddWidget(this.mLeftButton);
        this.mRightButton = new Game.CrystalBall("SPEED", Game.MainMenu.EId.SpeedBtn | 0);
        this.mBtns[Game.MainMenu.EId.SpeedBtn | 0] = this.mRightButton;
        this.AddWidget(this.mRightButton);
        this.mRecordsButton = new Game.CrystalBall("RECORDS", Game.MainMenu.EId.RecordsBtn | 0);
        this.mBtns[Game.MainMenu.EId.RecordsBtn | 0] = this.mRecordsButton;
        this.AddWidget(this.mRecordsButton);
        for (var i = 0; i < this.mBtns.length; ++i) {
            this.mBtns[i].AddEventListener(
                GameFramework.widgets.WidgetEvent.MOUSE_DOWN,
                ss.Delegate.create(this, this.ButtonDepress)
            );
            this.mBtns[i].AddEventListener(
                GameFramework.widgets.WidgetEvent.MOUSE_ENTER,
                ss.Delegate.create(this, this.ButtonMouseEnter)
            );
        }
        this.mUserNameFont = null;
        this.mDrawMainMenu = true;
        this.mLeftButton.mVisible = false;
        this.mRightButton.mVisible = false;
        this.mRecordsButton.mVisible = false;
        this.mLoaded = false;
        this.mSwitchedMusic = false;
        this.mFinishedLoadSequence = false;
        this.SetupBackground();
        return false;
    },
    AddMainMenuBtn: function Game_MainMenu$AddMainMenuBtn() {
        var aButton = new Game.CurvedAlphaButton();
        aButton.mAlphaCv.SetCurveRef("MainMenu_cs_11_21_11__15_34_43_243");
        aButton.mButtonImage = Game.Resources["IMAGE_BOARD_MENUBTN"];
        aButton.mX = aButton.mButtonImage.mOffsetX - 160;
        aButton.mY = aButton.mButtonImage.mOffsetY;
        aButton.mWidth = aButton.mButtonImage.mWidth;
        aButton.mHeight = aButton.mButtonImage.mHeight;
        aButton.mFont = Game.Resources["FONT_FLAREGOTHICBOLD42"];
        aButton.mLabel = "MENU";
        Game.BejApp.mBejApp.AddButtonSounds(aButton);
        aButton.mLabelYOfs = -10;
        aButton.mNormalCel = 0;
        aButton.mOverImage = aButton.mButtonImage;
        aButton.mOverCel = 1;
        aButton.mDownImage = aButton.mButtonImage;
        aButton.mDownCel = 1;
        aButton.AddEventListener(
            GameFramework.widgets.WidgetEvent.CLICKED,
            ss.Delegate.create(this, this.HandleMenuClicked)
        );
        this.AddWidget(aButton);
        this.mMenuButton = aButton;
    },
    SetupBackground: function Game_MainMenu$SetupBackground() {},
    Update: function Game_MainMenu$Update() {
        if (!Game.BejApp.mBejApp.mInitLoadingComplete) {
            GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
            return;
        }
        if (this.mSDButton != null && this.mSDButton.mIsOver & !this.mSDButton.mDisabled) {
            if (this.mSDButtonTextAlpha.GetOutFinalVal() != 1.0) {
                this.mSDButtonTextAlpha.Intercept("MainMenu_cs_11_29_11__14_35_51_418");
            }
        } else {
            if (this.mSDButtonTextAlpha.GetOutFinalVal() != 0.0) {
                this.mSDButtonTextAlpha.Intercept("MainMenu_cs_11_29_11__14_37_36_539");
            }
        }
        if (this.mHDButton != null && this.mHDButton.mIsOver & !this.mHDButton.mDisabled) {
            if (this.mHDButtonTextAlpha.GetOutFinalVal() != 1.0) {
                this.mHDButtonTextAlpha.Intercept("MainMenu_cs_11_29_11__14_35_51_418");
            }
        } else {
            if (this.mHDButtonTextAlpha.GetOutFinalVal() != 0.0) {
                this.mHDButtonTextAlpha.Intercept("MainMenu_cs_11_29_11__14_37_36_539");
            }
        }
        this.CheckNeedsInit();
        this.mVisible =
            Game.BejApp.mBejApp.mBoard == null ||
            !Game.BejApp.mBejApp.mBoard.mVisible ||
            (Game.BejApp.mBejApp.mBoard.mAlpha.GetOutVal() < 1.0 && Game.BejApp.mBejApp.mBoard.mHyperspace == null);
        if (!this.IsTransitioning() && this.mVisible && Game.BejApp.mBejApp.mBoard != null) {
            Game.BejApp.mBejApp.mBoard.RemoveSelf();
            Game.BejApp.mBejApp.mBoard.Dispose();
            Game.BejApp.mBejApp.mBoard = null;
        }
        this.mDrawMainMenu = this.mVisible;
        if (this.mLoaded) {
            this.mLeftButton.mVisible = this.mDrawMainMenu;
            this.mRightButton.mVisible = this.mDrawMainMenu;
            this.mRecordsButton.mVisible = this.mDrawMainMenu;
        }
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
        if (!this.mDrawMainMenu) {
            return;
        }
        if (this.mPartnerLogos.length > 0) {
            this.mPartnerBlackAlpha = 1.0;
            var pl = this.mPartnerLogos[0];
            if (pl.mAlpha < 255 && pl.mTime == pl.mOrgTime) {
                pl.mAlpha += 5;
                if (pl.mAlpha >= 255) {
                    pl.mAlpha = 255;
                }
            } else if (--pl.mTime <= 0) {
                pl.mAlpha -= 5;
                if (pl.mAlpha <= 0) {
                    this.mPartnerLogos.removeAt(0);
                }
            }
            return;
        } else {
            this.mPartnerBlackAlpha = Math.max(0.0, this.mPartnerBlackAlpha - 0.05);
        }
        if (this.mLoaded && this.mRotation.GetOutVal() == 0 && !this.mFinishedLoadSequence) {
            this.AddMainMenuBtn();
            this.mFinishedLoadSequence = true;
            if (Game.BejApp.mBejApp.mProfile.mProfileName.length == 0) {
                Game.BejApp.mBejApp.PlayVoice(Game.Resources["SOUND_VOICE_WELCOMETOBEJEWELED"]);
            } else {
                Game.BejApp.mBejApp.PlayVoice(Game.Resources["SOUND_VOICE_WELCOMEBACK"]);
            }
        }
        if (this.mLoaded && this.mRotation.GetOutVal() == 0 && Game.BejApp.mBejApp.mProfile.mProfileName.length == 0) {
        }
        if (this.mLeftButton != null && this.mLeftButton.mFullPct.GetOutVal() == 1.0) {
            this.mLeftButton.mScale.SetConstant(0.17);
            this.mLeftButton.mFullPct.SetConstant(0.0);
            this.mVisible = false;
            return;
        }
        if (this.mRightButton != null && this.mRightButton.mFullPct.GetOutVal() == 1.0) {
            this.mRightButton.mFullPct.SetConstant(0.0);
            this.mRightButton.mScale.SetConstant(0.17);
            this.mVisible = false;
            return;
        }
        if (this.mRecordsButton != null) {
            this.mRecordsButton.Move(this.mWidth / 2 - this.mRecordsButton.mWidth / 2, this.mHeight / 2 + 250);
        }
        if (Game.BejApp.mBejApp.mProfile.mProfileName.length == 0) {
            if (!this.mOfflineUIAlpha.IsDoingCurve() && this.mOfflineUIAlpha.GetOutVal() > 0) {
                this.mOfflineUIAlpha.SetCurveMult("b;0,1,0.025,1,~###         ~####");
            }
        } else {
            if (
                !this.mOfflineUIAlpha.IsDoingCurve() &&
                this.mOfflineUIAlpha.GetOutVal() == 0 &&
                this.mRotation.GetOutVal() == 0 &&
                !this.mRotation.IsDoingCurve()
            ) {
                this.mOfflineUIAlpha.SetCurve("b;0,1,0.025,1,####         ~~###");
            }
        }
        this.mHighestResCount =
            Math.max(GameFramework.BaseApp.mApp.GetResourceStreamerLoadingCount(), this.mHighestResCount) | 0;
        var aLoadPct =
            (this.mHighestResCount - GameFramework.BaseApp.mApp.GetResourceStreamerLoadingCount()) /
            this.mHighestResCount;
        if (Game.BejApp.mBejApp.mLoadingThreadComplete) {
            aLoadPct = 1.0;
        }
        this.mDispLoadPct += Math.min(
            Math.max(0, aLoadPct - this.mDispLoadPct),
            Math.max(0.02, (aLoadPct - this.mDispLoadPct) * 0.02)
        );
        if (
            !this.mNeedsInit &&
            !this.mLoaded &&
            this.mDispLoadPct >= 0.995 &&
            Game.BejApp.mBejApp.mLoadingThreadComplete
        ) {
            Game.BejApp.mBejApp.AddButtonSounds(this.mSDButton);
            Game.BejApp.mBejApp.AddButtonSounds(this.mHDButton);
            this.mTipTextAlpha.SetCurveMult("b;0,1,0.005,1,~###   R~###      N####");
            this.mBWPct.SetCurve("b;0,1,0.0025,1,~###b~###         ?####");
            this.mLogoAlpha.SetCurve("b;0,1,0.006667,1,~###         ~####");
            this.mButtonRotationAdd.SetCurveMult("b;0,1,0.00303,1,~###         ~####");
            this.mGeomGlowAlpha.SetCurve("b;0,1,0.005,1,~###         ~####");
            this.mLoaderAlpha.SetCurve("b;0,1,0.01,1,~###         ~####");
            this.mCrystalAppearAlpha.SetCurve("b;0,1,0.006667,1,####         ~~###");
            this.mTitleAlpha.SetCurve("b;0,1,0.001429,1,#########  3~###       n~###");
            if (Game.BejApp.mBejApp.mProfile.mProfileName.length > 0) {
                this.mOfflineUIAlpha.SetCurve("b;0,1,0.001429,1,####       s#### Q~###Z~###");
            }
            this.mLeftButton.mScale.SetCurve("b;0,0.335,0.006667,1,####   P####      PP###");
            this.mRightButton.mScale.SetCurve("b;0,0.335,0.006667,1,####   P####      PP###");
            this.mRecordsButton.mScale.SetCurve("b;0,0.1,0.006667,1,####   P####      P~###");
            this.mLeftButton.mVisible = true;
            this.mRightButton.mVisible = true;
            this.mRecordsButton.mVisible = true;
            if (!this.mSwitchedMusic) {
                this.mSwitchedMusic = true;
            }
            this.mLoaded = true;
            this.ResizeButtons();
        }
        if (aLoadPct >= 0.2) {
            this.mBkgBlackAlpha.SetCurve("b;0,1,0.005,1,####         ~~###");
        }
        if (this.mRotation.HasBeenTriggered()) {
            this.ResizeButtons();
        }
        if (this.mRotation.IsInitialized()) {
            var aStarsHeight = this.mHasLoaderResources ? 1500 : 0;
        }
        if (!this.mLoaded) {
            return;
        }
        var anAspectRatio = Game.BejApp.mBejApp.mWidth / Game.BejApp.mBejApp.mHeight;
        var aLensAngle = 38.5 * anAspectRatio;
        this.mCamera.Init(aLensAngle, anAspectRatio, 0.1, 1000.0);
        this.mCamera.LookAt$2(
            new GameFramework.geom.Vector3(0, 0, 0.25),
            new GameFramework.geom.Vector3(0, 10.0, 2.35),
            new GameFramework.geom.Vector3(0, 0, 1)
        );
        this.mButtonCamera.Init(aLensAngle, anAspectRatio, 0.1, 1000.0);
        this.mButtonCamera.LookAt$2(
            new GameFramework.geom.Vector3(0, 0, 0.25),
            new GameFramework.geom.Vector3(0, 10.0, 2.35),
            new GameFramework.geom.Vector3(0, 0, 1)
        );
        var aTransCoords = new GameFramework.geom.Coords3();
        aTransCoords.Translate(0, -0.4, 0);
        this.mCamera.SetCoords(this.mCamera.GetCoords().Leave(aTransCoords));
        this.mButtonCamera.SetCoords(this.mButtonCamera.GetCoords().Leave(aTransCoords));
        var aRotCoords = new GameFramework.geom.Coords3();
        aRotCoords.RotateRadZ(this.mRotation.GetOutVal() * -0.78);
        this.mCamera.SetCoords(this.mCamera.GetCoords().Leave(aRotCoords));
        aRotCoords.RotateRadZ(this.mButtonRotationAdd.GetOutVal());
        this.mButtonCamera.SetCoords(this.mButtonCamera.GetCoords().Leave(aRotCoords));
        var aScreenPt = this.mButtonCamera.WorldToScreen(new GameFramework.geom.Vector3(0, 2.0, 0.7));
        var aW = 180;
        var aH = 180;
        var aPtAct = new GameFramework.geom.TPoint(aScreenPt.x * 1600, aScreenPt.y * 1200);
        var aPtCenter = new GameFramework.geom.TPoint(this.mWidth / 2, this.mHeight / 2);
        var aPt = new GameFramework.geom.TPoint(
            aPtCenter.x * this.mLeftButton.mFullPct.GetOutVal() +
                aPtAct.x * (1.0 - this.mLeftButton.mFullPct.GetOutVal()),
            aPtCenter.y * this.mLeftButton.mFullPct.GetOutVal() +
                aPtAct.y * (1.0 - this.mLeftButton.mFullPct.GetOutVal())
        );
        this.mRecordsButton.mOffset.x = 0;
        this.mRecordsButton.mOffset.y = 0;
        this.mRecordsButton.Resize(
            (aPtCenter.x | 0) - ((aW / 2) | 0),
            (aPtCenter.y | 0) - ((aH / 2) | 0) + 350,
            aW,
            aH
        );
        this.mRecordsButton.mZ = aScreenPt.z;
        this.mLeftButton.mOffset.x = aPt.x - (aPt.x | 0);
        this.mLeftButton.mOffset.y = aPt.y - (aPt.y | 0);
        this.mLeftButton.Resize((aPt.x | 0) - ((aW / 2) | 0), (aPt.y | 0) - ((aH / 2) | 0), aW, aH);
        this.mLeftButton.mZ = aScreenPt.z;
        aW = 120;
        aH = 120;
        aScreenPt = this.mButtonCamera.WorldToScreen(new GameFramework.geom.Vector3(-0.602, 1.93, 0.54));
        aScreenPt.x =
            0.5 * this.mLeftButton.mFullPct.GetOutVal() + aScreenPt.x * (1.0 - this.mLeftButton.mFullPct.GetOutVal());
        aScreenPt.y =
            0.5 * this.mLeftButton.mFullPct.GetOutVal() + aScreenPt.y * (1.0 - this.mLeftButton.mFullPct.GetOutVal());
        aPt = new GameFramework.geom.TPoint(aScreenPt.x * 1600, aScreenPt.y * 1200);
        this.mLeftButton.Resize((aPt.x | 0) - ((aW / 2) | 0), (aPt.y | 0) - ((aH / 2) | 0), aW, aH);
        this.mLeftButton.mZ = aScreenPt.z;
        this.mLeftButton.mMouseVisible = !this.mRotation.IsDoingCurve();
        if (this.mRotation.GetOutVal() < 0) {
            this.mLeftButton.mTextAlpha = this.mTitleAlpha.GetOutVal();
        }
        aScreenPt = this.mButtonCamera.WorldToScreen(new GameFramework.geom.Vector3(0.602, 1.93, 0.54));
        aScreenPt.x =
            0.5 * this.mRightButton.mFullPct.GetOutVal() + aScreenPt.x * (1.0 - this.mRightButton.mFullPct.GetOutVal());
        aScreenPt.y =
            0.5 * this.mRightButton.mFullPct.GetOutVal() + aScreenPt.y * (1.0 - this.mRightButton.mFullPct.GetOutVal());
        aPt = new GameFramework.geom.TPoint(aScreenPt.x * 1600, aScreenPt.y * 1200);
        this.mRightButton.Resize((aPt.x | 0) - ((aW / 2) | 0), (aPt.y | 0) - ((aH / 2) | 0), aW, aH);
        this.mRightButton.mZ = aScreenPt.z;
        this.mRightButton.mMouseVisible = !this.mRotation.IsDoingCurve();
        if (this.mRotation.GetOutVal() > 0) {
            this.mRightButton.mTextAlpha = this.mTitleAlpha.GetOutVal();
        }
    },
    Draw: function Game_MainMenu$Draw(g) {
        if (!this.mDrawMainMenu) {
            return;
        }
        if (this.mPartnerBlackAlpha > 0 && this.mTitleAlpha.get_v() < 1.0) {
            var _t2 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(0, 0, 0, (255.0 * this.mPartnerBlackAlpha) | 0));
            try {
                g.FillRect(0, 0, this.mWidth, this.mHeight);
            } finally {
                _t2.Dispose();
            }
        }

        // if Init group resources are not loaded, and update ticks more than 200, it will
        // draw a circle dot progress timer
        // the Init group resournces contains logo and other basic resources, so we won't
        // go ahead if it is not loaded
        if (!Game.BejApp.mBejApp.mInitLoadingComplete) {
            var _t3 = g.PushColor(0xff000000);
            try {
                g.FillRect(0, 0, this.mWidth, this.mHeight);
            } finally {
                _t3.Dispose();
            }
            if (this.mUpdateCnt > 200) {
                for (var i = 0; i < 12; i++) {
                    var anOffset = i + ((this.mUpdateCnt / 6) | 0);
                    var anAngle = (anOffset / 12.0) * Math.PI * 2.0;
                    var aX = g.GetSnappedX(this.mWidth / 2 + Math.cos(anAngle) * 80);
                    var aY = g.GetSnappedY(this.mHeight / 2 + Math.sin(anAngle) * 80);
                    var _t4 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(Math.max(0.2, i / 11.0)));
                    try {
                        g.FillRect(aX, aY, 6, 6);
                    } finally {
                        _t4.Dispose();
                    }
                }
            }
            return;
        }

        // draw parter logo, if has, don't draw original logo
        if (this.mPartnerLogos.length > 0) {
            var pl = this.mPartnerLogos[0];
            var _t5 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, pl.mAlpha));
            try {
                g.DrawImage(pl.mImage, 160, 0);
            } finally {
                _t5.Dispose();
            }
            return;
        }

        // draw background
        // the background color and after can be changed dynamically if curve val is set properly
        // by default, it doesn't change, just black
        var aBackAlpha = Math.min(1.0, 2.3 - this.mDispLoadPct * this.mBkgBlackAlpha.GetOutVal() * 2.0);
        var aColor = Math.max(0.0, Math.min(1.0, this.mDispLoadPct * this.mBkgBlackAlpha.GetOutVal() * 3.0));
        aBackAlpha -= aColor * 0.4;
        if (this.mTitleAlpha.get_v() < 1.0) {
            var _t6 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(0, 0, 0, (255 * aBackAlpha) | 0));
            try {
                g.FillRect(
                    GameFramework.BaseApp.mApp.mX,
                    GameFramework.BaseApp.mApp.mY,
                    GameFramework.BaseApp.mApp.mDrawWidth,
                    GameFramework.BaseApp.mApp.mDrawHeight
                );
            } finally {
                _t6.Dispose();
            }
        }

        // paint main menu background if all resources are loaded
        if (this.mTitleAlpha.GetOutVal() > 0.0 && this.mLoaded) {
            var _t7 = g.PushColor(
                GameFramework.gfx.Color.RGBAToInt(255, 255, 255, (255.0 * this.mTitleAlpha.GetOutVal()) | 0)
            );
            try {
                g.DrawImage(Game.Resources["IMAGE_TITLE"], GameFramework.BaseApp.mApp.mX, 0);
            } finally {
                _t7.Dispose();
            }
        }

        // draw logo, the alpha will fade to zero when all resources are loaded
        if (this.mLogoAlpha != null) {
            var _t8 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mLogoAlpha.GetOutVal()));
            try {
                g.DrawImage(
                    Game.Resources["IMAGE_LOADER_POPCAP"],
                    this.mWidth / 2 - ((Game.Resources["IMAGE_LOADER_POPCAP"].mWidth / 2) | 0),
                    300
                );
            } finally {
                _t8.Dispose();
            }
        }

        // set font, and push outline and glow color
        g.SetFont(Game.Resources["FONT_LOADER_TIP"]);
        g.mFont.PushLayerColor("GLOW", GameFramework.gfx.Color.RGBAToInt(64, 0, 32, 128));
        g.mFont.PushLayerColor("OUTLINE", 0);

        // draw loading string, and loading percentage
        var anAlpha = (0.5 * Math.sin(this.mUpdateCnt * 0.03) * 0.5 * 0.5 + 0.75) * this.mLoaderAlpha.GetOutVal();
        if (anAlpha > 0) {
            var _t9 = g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, (255 * anAlpha) | 0));
            try {
                var aString = "Loading";
                if (Game.BejApp.mBejApp.mConnecting && Game.BejApp.mBejApp.mGroupsLoading == 1) {
                    aString = "Connecting";
                }
                for (var i_2 = 0; i_2 < ((this.mUpdateCnt / 80) | 0 | 0) % 4; i_2++) {
                    aString += ".";
                }
                g.DrawString(aString, 800 - g.StringWidth("Loading..") / 2, 850);
                g.DrawStringEx(((this.mDispLoadPct * 100) | 0) + "%", 800, 900, 0, 0);
            } finally {
                _t9.Dispose();
            }
        }

        // balance push layer color
        g.mFont.PopLayerColor("OUTLINE");
        g.mFont.PopLayerColor("GLOW");

        // if using webgl, draw a circle progress loader bar
        // it will populate the vertices based on current loading progress
        if (Game.BejApp.mBejApp.get_Is3D() && this.mLoaderAlpha.GetOutVal() > 0.0) {
            var aVertices = Array.Create2D((Game.MainMenu.NUM_LOADERBAR_POINTS - 1) * 2, 3, null);
            var aCurPct = 0;
            var anAlpha_2 = (0.5 * Math.sin(this.mUpdateCnt * 0.03) * 0.5 * 0.5 + 0.75) * this.mLoaderAlpha.GetOutVal();
            var aTriColor = GameFramework.gfx.Color.FAlphaToInt(anAlpha_2);
            var aTriIdx = 0;
            var aPrevVtx1 = null;
            var aPrevVtx2 = null;
            for (var aLoaderBarPt = 0; aLoaderBarPt < Game.MainMenu.NUM_LOADERBAR_POINTS; aLoaderBarPt++) {
                var aThisAdd = (1.0 / (Game.MainMenu.NUM_LOADERBAR_POINTS - 1)) * this.mDispLoadPct;
                if (aLoaderBarPt == 0 || aLoaderBarPt == Game.MainMenu.NUM_LOADERBAR_POINTS - 2) {
                    aThisAdd = 1.0 / (Game.MainMenu.NUM_LOADERBAR_POINTS - 1);
                }
                aThisAdd *= 1.022;
                var anAng = -3.141593 / 2 + aCurPct * 3.141593 * 2;
                aCurPct += aThisAdd;
                var aU;
                if (aLoaderBarPt == 0) {
                    aU = 0;
                } else if (aLoaderBarPt == Game.MainMenu.NUM_LOADERBAR_POINTS - 1) {
                    aU = 1;
                } else {
                    aU = 0.5;
                }

                var aDist1 = 180;
                var aDist2 = 180 + 60;
                var aVtx1 = new GameFramework.gfx.TriVertex(
                    this.mWidth / 2 + Math.cos(anAng) * aDist1,
                    300 + ((Game.Resources["IMAGE_LOADER_POPCAP"].mHeight / 2) | 0) + Math.sin(anAng) * aDist1,
                    aU,
                    0,
                    aTriColor
                );
                var aVtx2 = new GameFramework.gfx.TriVertex(
                    this.mWidth / 2 + Math.cos(anAng) * aDist2,
                    300 + ((Game.Resources["IMAGE_LOADER_POPCAP"].mHeight / 2) | 0) + Math.sin(anAng) * aDist2,
                    aU,
                    1,
                    aTriColor
                );
                if (aLoaderBarPt != 0) {
                    aVertices[aVertices.mIdxMult0 * aTriIdx + 0] = aPrevVtx1;
                    aVertices[aVertices.mIdxMult0 * aTriIdx + 1] = aPrevVtx2;
                    aVertices[aVertices.mIdxMult0 * aTriIdx + 2] = aVtx1;
                    aTriIdx++;
                    aVertices[aVertices.mIdxMult0 * aTriIdx + 0] = aPrevVtx2;
                    aVertices[aVertices.mIdxMult0 * aTriIdx + 1] = aVtx1;
                    aVertices[aVertices.mIdxMult0 * aTriIdx + 2] = aVtx2;
                    aTriIdx++;
                }
                aPrevVtx1 = aVtx1;
                aPrevVtx2 = aVtx2;
            }
            g.DrawTrianglesTex(Game.Resources["IMAGE_LOADER_WHITEDOT"], aVertices);
        }

        // draw tip string in the middle bottom
        if (Game.BejApp.mBejApp.mTips.length != 0 && Game.BejApp.mBejApp.mTipIdx > 0) {
            var _t10 = g.PushColor(
                GameFramework.gfx.Color.RGBAToInt(
                    255,
                    255,
                    255,
                    (255.0 *
                        this.mTipTextAlpha.GetOutVal() *
                        Math.max(0.0, Math.min(1.0, this.mDispLoadPct * 2.0 - 0.15))) |
                        0
                )
            );
            try {
                g.SetFont(Game.Resources["FONT_LOADER_TIP"]);
                g.mFont.PushLayerColor("GLOW", GameFramework.gfx.Color.RGBAToInt(64, 0, 32, 128));
                g.mFont.PushLayerColor("OUTLINE", 0);
                g.DrawStringCentered(
                    Game.BejApp.mBejApp.mTips[(Game.BejApp.mBejApp.mTipIdx - 1) % Game.BejApp.mBejApp.mTips.length],
                    this.mWidth / 2,
                    1165
                );
                g.mFont.PopLayerColor("OUTLINE");
                g.mFont.PopLayerColor("GLOW");
            } finally {
                _t10.Dispose();
            }
        }

        // if mouse is hover on SD button and SD button is not activated, show a hint text
        if (this.mSDButtonTextAlpha.get_v() > 0.0) {
            var _t11 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mSDButtonTextAlpha.get_v()));
            try {
                g.DrawStringEx("Switch to\nStandard Definition", 1416, 1030, 0, 0);
            } finally {
                _t11.Dispose();
            }
        }

        // if mouse if hover on HD button and HD button is not activated, show a hint text
        if (this.mHDButtonTextAlpha.get_v() > 0.0) {
            var _t12 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mHDButtonTextAlpha.get_v()));
            try {
                g.DrawStringEx("Switch to\nHigh Definition", 1416, 1030, 0, 0);
            } finally {
                _t12.Dispose();
            }
        }
    },
    StopHoverText: function Game_MainMenu$StopHoverText() {},
    PlayLeaveAnim: function Game_MainMenu$PlayLeaveAnim() {
        this.StopHoverText();
        var selectedModeBtn = this.GetSelectedModeBtn();
        selectedModeBtn.mFullPct.SetCurve("b;0,1,0.006667,1,~###         ~####");
        selectedModeBtn.mScale.SetCurve("b;0.17,0.88,0.006667,1,~###         ~#Q(j");
        this.mAppState.SetFocus(this);
    },
    IsTransitioning: function Game_MainMenu$IsTransitioning() {
        return (
            (this.mLeftButton != null && this.mLeftButton.mScale.IsDoingCurve()) ||
            (this.mRightButton != null && this.mRightButton.mScale.IsDoingCurve())
        );
    },
    ButtonMouseEnter: function Game_MainMenu$ButtonMouseEnter(e) {
        if (!this.mLoaded || !this.mVisible) {
            return;
        }
        Game.BejApp.mBejApp.PlaySound(Game.Resources["SOUND_BUTTON_MOUSEOVER"]);
    },
    ButtonDepress: function Game_MainMenu$ButtonDepress(e) {
        if (!this.mLoaded || !this.mVisible) {
            return;
        }
        var i = 0;
        while (i < (Game.MainMenu.EId._COUNT | 0)) {
            if (this.mBtns[i] == e.target) {
                break;
            }
            ++i;
        }
        if (i >= (Game.MainMenu.EId._COUNT | 0)) {
            return;
        }
        if (
            this.mLeftButton.mScale.IsDoingCurve() ||
            this.mRightButton.mScale.IsDoingCurve() ||
            Game.BejApp.mBejApp.GetDialog(Game.DM.EDialog.RECORDS) != null
        ) {
            return;
        }
        switch (i) {
            case Game.MainMenu.EId.ClassicBtn | 0: {
                this.mSelectedMode = Game.MainMenu.EMode.Classic;
                Game.BejApp.mBejApp.mProfile.SetTutorialCleared(Game.DM.ETutorial.PLAY_CLASSIC_FIRST | 0);
                Game.BejApp.mBejApp.DoNewClassicGame();
                this.DoBtnAnimation(this.mLeftButton);
                break;
            }
            case Game.MainMenu.EId.SpeedBtn | 0: {
                if (
                    Game.BejApp.mBejApp.mProfile != null &&
                    !Game.BejApp.mBejApp.mProfile.HasClearedTutorial(Game.DM.ETutorial.PLAY_CLASSIC_FIRST | 0)
                ) {
                    var aDialog = Game.BejApp.mBejApp.DoModalDialog(
                        "SPEED MODE",
                        "New to Bejeweled?\nTry Classic Mode first.\n\nPlay Speed Mode?",
                        "",
                        GameFramework.widgets.Dialog.BUTTONS_YES_NO,
                        Game.DM.EDialog.PLAY_SPEED_CONFIRM
                    );
                    aDialog.AddEventListener(
                        GameFramework.widgets.DialogEvent.CLOSED,
                        ss.Delegate.create(this, this.handlePlayClassicFirstCheckDlgClosed)
                    );
                } else {
                    this.DoSpeedBtnPress();
                }
                break;
            }
            case Game.MainMenu.EId.RecordsBtn | 0: {
                var dlg = new Game.RecordsDialog();
                Game.BejApp.mBejApp.PlaySound(Game.Resources["SOUND_MENUSPIN"]);
                Game.BejApp.mBejApp.mDialogMgr.AddDialog(dlg);
                break;
            }
            default: {
                break;
            }
        }
    },
    handlePlayClassicFirstCheckDlgClosed: function Game_MainMenu$handlePlayClassicFirstCheckDlgClosed(theE) {
        Game.BejApp.mBejApp.mProfile.SetTutorialCleared(Game.DM.ETutorial.PLAY_CLASSIC_FIRST | 0);
        if (theE.WasYesPressed()) {
            this.DoSpeedBtnPress();
        }
    },
    DoSpeedBtnPress: function Game_MainMenu$DoSpeedBtnPress() {
        var anActivateBtn = this.mRightButton;
        this.mSelectedMode = Game.MainMenu.EMode.Speed;
        Game.BejApp.mBejApp.DoNewSpeedGame();
        this.DoBtnAnimation(anActivateBtn);
    },
    DoBtnAnimation: function Game_MainMenu$DoBtnAnimation(theActivateBtn) {
        if (theActivateBtn != null) {
            var aBoard = Game.BejApp.mBejApp.mBoard;
            Game.BejApp.mBejApp.PlaySound(Game.Resources["SOUND_CLICKFLYIN"]);
            theActivateBtn.mFullPct.SetCurve("b;0,1,0.01,1,####         ~~###");
            theActivateBtn.mScale.SetCurve("b;0.17,0.88,0.01,1,####         ~~Q(j");
            var aParent = theActivateBtn.mParent;
            if (aParent != null) {
                aParent.RemoveWidget(theActivateBtn);
                aParent.AddWidget(theActivateBtn);
            }
            if (aBoard != null) {
                if (GameFramework.BaseApp.mApp.get_Is3D()) {
                    aBoard.mAlpha.SetCurve("b;0,1,0.01,1,####  Z####       F~###");
                    aBoard.mScale.SetCurve("b;1,5,0.01,1,~pF[         ~####");
                    theActivateBtn.mImage = aBoard.mBackground.GetBackgroundImage$3(true, false);
                    theActivateBtn.mImageSrcRect = new GameFramework.TIntRect(0, 0, 0, 0);
                } else {
                    aBoard.mAlpha.SetCurve("b;0,1,0.012,1,#########         ~~###");
                    aBoard.mBackground.mImageOverlayAlpha.SetCurve("b;0.001,1,0.012,1,####   B####      _~###");
                }
            } else {
                theActivateBtn.mImage = Game.Resources["IMAGE_BACKGROUNDS_HORSE_FOREST_TREE_FLATTENEDPAM"];
            }
        }
    },
    GetSelectedModeBtn: function Game_MainMenu$GetSelectedModeBtn() {
        if (this.mSelectedMode == Game.MainMenu.EMode.Classic) {
            return this.mLeftButton;
        } else if (this.mSelectedMode == Game.MainMenu.EMode.Speed) {
            return this.mRightButton;
        }
        return null;
    },
    UpdateBackgroundImageForActiveBtn: function Game_MainMenu$UpdateBackgroundImageForActiveBtn(theRes) {
        var aBtn = this.GetSelectedModeBtn();
        if (aBtn != null) {
            aBtn.mImage = theRes;
        }
    },
    ResizeButtons: function Game_MainMenu$ResizeButtons() {
        if (!this.mLoaded) {
            return;
        }
        if (this.mRotation.GetOutVal() == 0) {
        } else if (this.mLeftButton.mDisabled && this.mRotation.GetOutVal() == -1) {
            this.mLeftButton.mDisabled = false;
        } else if (this.mRightButton.mDisabled && this.mRotation.GetOutVal() == 1) {
            this.mRightButton.mDisabled = false;
        }
    },
};
Game.MainMenu.staticInit = function Game_MainMenu$staticInit() {
    Game.MainMenu.NUM_LOADERBAR_POINTS = 50;
};

JSFExt_AddInitFunc(function () {
    Game.MainMenu.registerClass("Game.MainMenu", GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function () {
    Game.MainMenu.staticInit();
});
Game.MainMenu.EId = {};
Game.MainMenu.EId.staticInit = function Game_MainMenu_EId$staticInit() {
    Game.MainMenu.EId.ClassicBtn = 0;
    Game.MainMenu.EId.SpeedBtn = 1;
    Game.MainMenu.EId.RecordsBtn = 2;
    Game.MainMenu.EId._COUNT = 3;
};
JSFExt_AddInitFunc(function () {
    Game.MainMenu.EId.staticInit();
});
Game.MainMenu.EMode = {};
Game.MainMenu.EMode.staticInit = function Game_MainMenu_EMode$staticInit() {
    Game.MainMenu.EMode._NONE = -1;
    Game.MainMenu.EMode.Classic = 0;
    Game.MainMenu.EMode.Speed = 1;
    Game.MainMenu.EMode._COUNT = 2;
};
JSFExt_AddInitFunc(function () {
    Game.MainMenu.EMode.staticInit();
});
