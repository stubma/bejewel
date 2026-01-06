Game.OptionsDialog = function Game_OptionsDialog(theIsInGame) {
    Game.OptionsDialog.initializeBase(this, [
        Game.Resources["IMAGE_DIALOG_HEADERLESS_BKG"],
        Game.Resources["IMAGE_DIALOG_BUTTON"],
        Game.DM.EDialog.OPTIONS,
        true,
        "",
        "",
        "",
        GameFramework.widgets.Dialog.BUTTONS_FOOTER,
    ]);
    this.mWantAllowBackgroundOption =
        (!Game.BejApp.mBejApp.mIsSlow && Game.BejApp.mBejApp.get_Is3D()) ||
        !Game.BejApp.mBejApp.mProfile.mAnimateBackground;
    this.mIsInGame = theIsInGame;
    var height = this.mIsInGame ? 740 : 850;
    if (!this.mWantAllowBackgroundOption) {
        height -= 94;
    }
    this.mContentInsets = new GameFramework.Insets(128, 20, 128, 88);
    this.Resize(350, this.mIsInGame ? 250 : 180, 900, height);
    Game.BejApp.mBejApp.mBaseWidgetAppState.SetFocus(this);
    this.mYesButton.mLabel = "OK";
    this.mYesButton.AddEventListener(
        GameFramework.widgets.WidgetEvent.CLICKED,
        ss.Delegate.create(this, this.HandleYesClicked)
    );
    this.mResetButton = this.CreateButton(Game.Resources["IMAGE_DIALOG_BUTTON"]);
    this.mResetButton.mLabel = "  RESET";
    this.mResetButton.mScale = 0.7;
    this.mResetButton.AddEventListener(
        GameFramework.widgets.WidgetEvent.CLICKED,
        ss.Delegate.create(this, this.HandleResetBtnClicked)
    );
    this.mIsModal = true;
    this.mHelpButton = this.CreateButton(Game.Resources["IMAGE_DIALOG_BUTTON"]);
    this.mHelpButton.mLabel = "HELP";
    if (!this.mIsInGame) {
        this.mHelpButton.mLabel = " " + this.mHelpButton.mLabel;
    }
    this.mHelpButton.AddEventListener(
        GameFramework.widgets.WidgetEvent.CLICKED,
        ss.Delegate.create(this, this.HandleMenuBtnClicked)
    );
    if (this.mIsInGame) {
        this.mBackToMainButton = this.CreateButton(Game.Resources["IMAGE_DIALOG_BUTTON"]);
        this.mBackToMainButton.mLabel = "MAIN MENU";
        this.mBackToMainButton.AddEventListener(
            GameFramework.widgets.WidgetEvent.CLICKED,
            ss.Delegate.create(this, this.HandleMenuBtnClicked)
        );
        this.mResumeButton = this.CreateButton(Game.Resources["IMAGE_DIALOG_BUTTON"]);
        this.mResumeButton.mLabel = "RESUME PLAY";
        this.mResumeButton.AddEventListener(
            GameFramework.widgets.WidgetEvent.CLICKED,
            ss.Delegate.create(this, this.HandleMenuBtnClicked)
        );
    }
    this.mMusicSlider = new Game.Slider(
        Game.Resources["IMAGE_DIALOG_SLIDERBAR"],
        Game.Resources["IMAGE_DIALOG_SLIDERHANDLE"]
    );
    this.mMusicSlider.AddEventListener(
        GameFramework.widgets.WidgetEvent.SLIDER_CHANGED,
        ss.Delegate.create(this, this.HandleSliderChanged)
    );
    this.AddWidget(this.mMusicSlider);
    this.mFXSlider = new Game.Slider(
        Game.Resources["IMAGE_DIALOG_SLIDERBAR"],
        Game.Resources["IMAGE_DIALOG_SLIDERHANDLE"]
    );
    this.mFXSlider.AddEventListener(
        GameFramework.widgets.WidgetEvent.SLIDER_CHANGED,
        ss.Delegate.create(this, this.HandleSliderChanged)
    );
    this.mFXSlider.AddEventListener(
        GameFramework.widgets.WidgetEvent.MOUSE_UP,
        ss.Delegate.create(this, this.HandleSliderMouseUp)
    );
    this.AddWidget(this.mFXSlider);
    if (this.mWantAllowBackgroundOption) {
        this.mAnimateBackgroundCheckbox = new Game.Checkbox(
            Game.Resources["IMAGE_DIALOG_CHECKBOX_BLANK"],
            Game.Resources["IMAGE_DIALOG_CHECKBOX_CHECKED"]
        );
        this.AddWidget(this.mAnimateBackgroundCheckbox);
    }
    this.mTutorialsEnabled = new Game.Checkbox(
        Game.Resources["IMAGE_DIALOG_CHECKBOX_BLANK"],
        Game.Resources["IMAGE_DIALOG_CHECKBOX_CHECKED"]
    );
    this.AddWidget(this.mTutorialsEnabled);
    this.UpdateValues();
    this.mFlushPriority = 100;
    this.mAllowDrag = false;
    this.mYesButton.mX -= 20;
    this.mYesButton.mWidth += 40;
};
Game.OptionsDialog.prototype = {
    mMusicSlider: null,
    mFXSlider: null,
    mAnimateBackgroundCheckbox: null,
    mTutorialsEnabled: null,
    mResetButton: null,
    mIsInGame: null,
    mInsets: null,
    mFieldSeperation: 0,
    mWantAllowBackgroundOption: null,
    mResumeButton: null,
    mBackToMainButton: null,
    mHelpButton: null,
    HandleMenuBtnClicked: function Game_OptionsDialog$HandleMenuBtnClicked(theE) {
        if (theE.target == this.mHelpButton) {
            //JS
            window["ShowHelp"]();
            //-JS
        } else if (theE.target == this.mBackToMainButton) {
            var aDialog = Game.BejApp.mBejApp.DoModalDialog(
                "MAIN MENU",
                "Abandon the current game and go to main menu?",
                "",
                GameFramework.widgets.Dialog.BUTTONS_YES_NO,
                Game.DM.EDialog.MAIN_MENU_CONFIRM
            );
            var aWidth = 850;
            aDialog.Resize(
                this.mX + this.mWidth / 2 - ((aWidth / 2) | 0),
                350,
                aWidth,
                aDialog.GetPreferredHeight(aWidth)
            );
            aDialog.AddEventListener(
                GameFramework.widgets.DialogEvent.CLOSED,
                ss.Delegate.create(this, this.handleMenuDialogClosed)
            );
        } else if (theE.target == this.mResumeButton) {
            this.mResult = Game.OptionsDialog.EResult.ResumePlay | 0;
            this.Save();
            this.Kill();
        }
    },
    Kill: function Game_OptionsDialog$Kill() {
        Game.Bej3Dialog.prototype.Kill.apply(this);
        if (Game.BejApp.mBejApp.mBoard != null) {
            Game.BejApp.mBejApp.mBaseWidgetAppState.SetFocus(Game.BejApp.mBejApp.mBoard);
        }
    },
    handleMenuDialogClosed: function Game_OptionsDialog$handleMenuDialogClosed(theE) {
        if (theE.WasYesPressed()) {
            this.mResult = Game.OptionsDialog.EResult.BackToMain | 0;
            this.Save();
            this.Kill();
        }
    },
    HandleSliderMouseUp: function Game_OptionsDialog$HandleSliderMouseUp(theE) {
        if (theE.target == this.mFXSlider) {
            Game.BejApp.mBejApp.SetSoundVolume(this.mFXSlider.mVal);
            Game.BejApp.mBejApp.PlaySound(Game.Resources["SOUND_COMBO_2"]);
        }
    },
    HandleSliderChanged: function Game_OptionsDialog$HandleSliderChanged(theE) {
        if (theE.target == this.mFXSlider) {
            Game.BejApp.mBejApp.SetSoundVolume(this.mFXSlider.mVal);
        } else if (theE.target == this.mMusicSlider) {
            Game.BejApp.mBejApp.SetMusicVolume(this.mMusicSlider.mVal);
        }
    },
    HandleResetBtnClicked: function Game_OptionsDialog$HandleResetBtnClicked(theE) {
        var aDialog;
        if (!this.mIsInGame) {
            aDialog = Game.BejApp.mBejApp.DoModalDialog(
                "RESET TUTORIALS",
                "This will reset all hints\nand tutorials.\nContinue?",
                "",
                GameFramework.widgets.Dialog.BUTTONS_YES_NO,
                Game.DM.EDialog.MAIN_MENU_CONFIRM
            );
        } else {
            aDialog = Game.BejApp.mBejApp.DoModalDialog(
                "SHOW TUTORIAL?",
                "This will end your current game and start the tutorial. Continue?",
                "",
                GameFramework.widgets.Dialog.BUTTONS_YES_NO,
                Game.DM.EDialog.MAIN_MENU_CONFIRM
            );
        }
        var aWidth = 850;
        aDialog.Resize(this.mX + this.mWidth / 2 - ((aWidth / 2) | 0), 350, aWidth, aDialog.GetPreferredHeight(aWidth));
        aDialog.AddEventListener(
            GameFramework.widgets.DialogEvent.CLOSED,
            ss.Delegate.create(this, this.handleResetConfirmationDialogClosed)
        );
    },
    Save: function Game_OptionsDialog$Save() {
        this.ApplyValues();
        Game.BejApp.mBejApp.mProfile.WriteProfile();
    },
    HandleYesClicked: function Game_OptionsDialog$HandleYesClicked(theE) {
        this.Save();
    },
    handleResetConfirmationDialogClosed: function Game_OptionsDialog$handleResetConfirmationDialogClosed(theE) {
        if (theE.WasYesPressed()) {
            Game.BejApp.mBejApp.mProfile.mTutorialFlags =
                Game.BejApp.mBejApp.mProfile.mTutorialFlags & (1 << (Game.DM.ETutorial.PLAY_CLASSIC_FIRST | 0));
            Game.BejApp.mBejApp.mProfile.mTutorialEnabled = true;
            this.mTutorialsEnabled.mChecked = true;
            this.mResult = Game.OptionsDialog.EResult.LaunchTutorial | 0;
            this.Save();
            if (this.mIsInGame) {
                this.Kill();
            }
        }
    },
    UpdateValues: function Game_OptionsDialog$UpdateValues() {
        var p = Game.BejApp.mBejApp.mProfile;
        this.mMusicSlider.SetValue(p.mMusicVolume);
        this.mFXSlider.SetValue(p.mSfxVolume);
        if (this.mAnimateBackgroundCheckbox != null) {
            this.mAnimateBackgroundCheckbox.mChecked = p.mAnimateBackground;
        }
        this.mTutorialsEnabled.mChecked = p.mTutorialEnabled;
    },
    ApplyValues: function Game_OptionsDialog$ApplyValues() {
        var p = Game.BejApp.mBejApp.mProfile;
        if (this.mAnimateBackgroundCheckbox != null) {
            p.mAnimateBackground = this.mAnimateBackgroundCheckbox.mChecked;
        }
        p.mTutorialEnabled = this.mTutorialsEnabled.mChecked;
        p.mSfxVolume = this.mFXSlider.mVal;
        p.mMusicVolume = this.mMusicSlider.mVal;
    },
    UpdatePositions: function Game_OptionsDialog$UpdatePositions() {
        if (this.mIsInGame) {
            this.mInsets = new GameFramework.Insets(120.0, 175.0, this.mWidth - 120.0, this.mHeight - 200.0);
            this.mYesButton.mVisible = false;
        } else {
            this.mInsets = new GameFramework.Insets(120.0, 300.0, this.mWidth - 120.0, this.mHeight - 200.0);
        }
        this.mFieldSeperation = 80.0;
        var w = 510.0;
        var x = this.mInsets.mRight - w;
        var y = this.mInsets.mTop - 40.0;
        var bg = GameFramework.BaseApp.mApp.mGraphics;
        this.mFXSlider.Resize(
            bg.GetSnappedX(x),
            bg.GetSnappedY(y),
            w,
            Game.Resources["IMAGE_DIALOG_SLIDERHANDLE"].mHeight
        );
        this.mMusicSlider.Resize(
            bg.GetSnappedX(x),
            bg.GetSnappedY(y + this.mFieldSeperation),
            w,
            Game.Resources["IMAGE_DIALOG_SLIDERHANDLE"].mHeight
        );
        this.mTutorialsEnabled.Resize(
            bg.GetSnappedX(this.mInsets.mRight - this.mTutorialsEnabled.mWidth),
            bg.GetSnappedY(y + this.mFieldSeperation * 2 + 1),
            Game.Resources["IMAGE_DIALOG_CHECKBOX_CHECKED"].mWidth,
            Game.Resources["IMAGE_DIALOG_CHECKBOX_CHECKED"].mHeight
        );
        this.mResetButton.Move(
            bg.GetSnappedX(this.mInsets.mRight - this.mResetButton.mWidth - this.mTutorialsEnabled.mWidth + 14),
            bg.GetSnappedY(y + this.mFieldSeperation * 2 - 16)
        );
        if (this.mAnimateBackgroundCheckbox != null) {
            this.mAnimateBackgroundCheckbox.Resize(
                bg.GetSnappedX(this.mInsets.mRight - this.mAnimateBackgroundCheckbox.mWidth),
                bg.GetSnappedY(y + this.mFieldSeperation * 3 + 1),
                Game.Resources["IMAGE_DIALOG_CHECKBOX_CHECKED"].mWidth,
                Game.Resources["IMAGE_DIALOG_CHECKBOX_CHECKED"].mHeight
            );
        }
        y = this.mInsets.mBottom;
        if (this.mResumeButton != null) {
            this.mResumeButton.Resize(this.mYesButton.mX, y, this.mYesButton.mWidth, this.mYesButton.mHeight);
            y -= this.mYesButton.mHeight;
        }
        if (this.mBackToMainButton != null) {
            this.mBackToMainButton.Resize(
                this.mYesButton.mX,
                y,
                this.mYesButton.mWidth / 2 - 5,
                this.mYesButton.mHeight
            );
        }
        if (this.mHelpButton != null) {
            if (this.mIsInGame) {
                this.mHelpButton.Resize(
                    this.mYesButton.mX + this.mYesButton.mWidth - this.mHelpButton.mWidth,
                    y,
                    this.mYesButton.mWidth / 2 - 5,
                    this.mYesButton.mHeight
                );
            } else {
                this.mHelpButton.Resize(
                    this.mYesButton.mX + this.mYesButton.mWidth - this.mHelpButton.mWidth,
                    y - 50,
                    this.mYesButton.mWidth,
                    this.mYesButton.mHeight
                );
            }
        }
    },
    Draw: function Game_OptionsDialog$Draw(g) {
        Game.Bej3Dialog.prototype.Draw.apply(this, [g]);
        this.UpdatePositions();
        var _t1 = g.PushTranslate(this.mInsets.mLeft, this.mInsets.mTop);
        try {
            g.SetFont(Game.Resources["FONT_DIALOG_TEXT"]);
            var _t2 = g.PushColor(0xff000000);
            try {
                g.DrawString("Sound", 0.0, 0.0);
                g.DrawString("Music", 0.0, this.mFieldSeperation);
                g.DrawString("Tutorials", 0.0, this.mFieldSeperation * 2);
                if (this.mWantAllowBackgroundOption) {
                    g.DrawString("Animate Backdrops", 0.0, this.mFieldSeperation * 3);
                }
            } finally {
                _t2.Dispose();
            }
        } finally {
            _t1.Dispose();
        }
        if (!this.mIsInGame) {
            var stampX = this.mWidth / 2.0 - 2;
            var stampY = 142.0;
            var _t3 = g.PushScale(0.65, 0.65, stampX, stampY);
            try {
                g.DrawImage(Game.Resources["IMAGE_GAMEOVER_STAMP"].get_CenteredImage(), stampX, stampY);
            } finally {
                _t3.Dispose();
            }
            g.SetFont(Game.Resources["FONT_GAMEOVER_DIALOG_HUGE"]);
            g.GetFont().PushLayerColor("MAIN", 0xff884818);
            g.DrawStringCentered("Options", this.mWidth / 2, 152);
            g.GetFont().PopLayerColor("MAIN");
        }
    },
    MouseDown: function Game_OptionsDialog$MouseDown(x, y) {
        Game.Bej3Dialog.prototype.MouseDown.apply(this, [x, y]);
    },
};
Game.OptionsDialog.staticInit = function Game_OptionsDialog$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.OptionsDialog.registerClass("Game.OptionsDialog", Game.Bej3Dialog);
});
JSFExt_AddStaticInitFunc(function () {
    Game.OptionsDialog.staticInit();
});
Game.OptionsDialog.EResult = {};
Game.OptionsDialog.EResult.staticInit = function Game_OptionsDialog_EResult$staticInit() {
    Game.OptionsDialog.EResult.BackToMain = 0;
    Game.OptionsDialog.EResult.ResumePlay = 1;
    Game.OptionsDialog.EResult.LaunchTutorial = 2;
};
JSFExt_AddInitFunc(function () {
    Game.OptionsDialog.EResult.staticInit();
});
