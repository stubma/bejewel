Game.HintDialog = function Game_HintDialog(theHeader, theText, theHasButton, theIsModal, disableBox) {
    if(theIsModal === undefined) {
        theIsModal = true;
    }
    if(disableBox === undefined) {
        disableBox = true;
    }
    this.mNoHintsPct = GameFramework.CurvedVal.CreateAsConstant(0.0);
    this.mTutorialFlag = Game.DM.ETutorial.NONE;
    Game.HintDialog.initializeBase(this, [theIsModal ? Game.Resources['IMAGE_DIALOG_BACKGROUND'] : Game.Resources['IMAGE_DIALOG_HEADERLESS_BKG'], Game.Resources['IMAGE_DIALOG_BUTTON'], Game.DM.EDialog.TUTORIAL, true, theHeader, theText, '', theHasButton ? GameFramework.widgets.Dialog.BUTTONS_FOOTER : GameFramework.widgets.Dialog.BUTTONS_NONE]);
    this.mWantDisableBox = disableBox;
    this.mWantsDarken = theIsModal;
    this.mIsModal = theIsModal;
    this.mContentInsets = new GameFramework.Insets(128, 20, 128, 64);
    this.SetButtonFont(Game.Resources['FONT_DIALOG_BUTTONS']);
    this.SetHeaderFont(Game.Resources['FONT_DIALOG_HEADER']);
    this.SetColor(GameFramework.widgets.Dialog.COLOR_LINES, 0xff000000);
    this.mSpaceAfterHeader = 32;
    if(this.mComponentImage == Game.Resources['IMAGE_DIALOG_HEADERLESS_BKG']) {
        this.mContentInsets.mTop += 30.0;
        this.mContentInsets.mBottom += 20.0;
        this.mSpaceAfterHeader -= 15;
    }
    if(this.mWantDisableBox) {
        this.mNoHintsCheckbox = new Game.Checkbox(Game.Resources['IMAGE_DIALOG_CHECKBOX_BLANK'], Game.Resources['IMAGE_DIALOG_CHECKBOX_CHECKED']);
        this.mNoHintsCheckbox.Resize(0, 0, Game.Resources['IMAGE_DIALOG_CHECKBOX_CHECKED'].mWidth, Game.Resources['IMAGE_DIALOG_CHECKBOX_CHECKED'].mHeight);
        this.mNoHintsCheckbox.mChecked = false;
        this.mNoHintsCheckbox.mAlpha = 1.0;
        this.mNoHintsCheckbox.AddEventListener(GameFramework.widgets.WidgetEvent.CHECKBOX_CHECKED, ss.Delegate.create(this, this.handleCheckboxChecked));
        this.AddWidget(this.mNoHintsCheckbox);
    }
    if(this.mYesButton != null) {
        this.mYesButton.mLabel = 'OK';
    }
    if(this.mNoButton != null) {
        this.mNoButton.mLabel = 'REPLAY';
    }
    this.Resize(0, 0, 800, this.GetPreferredHeight(800));
    this.mFullHeight = this.mHeight;
}
Game.HintDialog.prototype = {
    mNoHintsCheckbox : null,
    mWantDisableBox : null,
    mNoHintsPct : null,
    mShowBtnPct : 1.0,
    mFullHeight : 0,
    mTutorialFlag : null,
    Resize : function Game_HintDialog$Resize(theX, theY, theWidth, theHeight) {
        Game.Bej3Dialog.prototype.Resize.apply(this, [theX, theY, theWidth, theHeight]);
        if(this.mYesButton != null && this.mComponentImage == Game.Resources['IMAGE_DIALOG_HEADERLESS_BKG']) {
            this.mYesButton.mY += 20.0;
        }
    },
    handleCheckboxChecked : function Game_HintDialog$handleCheckboxChecked(theE) {
        this.DispatchEvent(theE);
    },
    Dispose : function Game_HintDialog$Dispose() {
        this.RemoveAllWidgets(true);
        Game.Bej3Dialog.prototype.Dispose.apply(this);
    },
    Update : function Game_HintDialog$Update() {
        Game.Bej3Dialog.prototype.Update.apply(this);
        if(this.mNoHintsCheckbox.IsChecked() && this.mNoHintsPct.GetOutFinalVal() != 1.0) {
            this.mNoHintsPct.SetCurveRef('HintDialog_cs_11_14_11__18_37_44_846');
        } else if(!this.mNoHintsCheckbox.IsChecked() && this.mNoHintsPct.GetOutFinalVal() != 0.0) {
            this.mNoHintsPct.SetCurveRef('HintDialog_cs_11_14_11__18_38_10_200');
        }
        var showBtnPct = Math.max(this.mShowBtnPct, this.mNoHintsPct.get_v());
        this.Resize(this.mX, this.mY, this.mWidth, this.mFullHeight - (100.0 * (1.0 - showBtnPct)));
    },
    Draw : function Game_HintDialog$Draw(g) {
        this.mNoHintsCheckbox.mAlpha = 0.5 + 0.5 * this.mNoHintsPct.get_v();
        var showBtnPct = Math.max(this.mShowBtnPct, this.mNoHintsPct.get_v());
        if(this.mYesButton != null) {
            this.mYesButton.mAlpha = Math.max(0.0, Math.min(1.0, (showBtnPct - 0.5) * 2.0));
        }
        if(this.mComponentImage == Game.Resources['IMAGE_DIALOG_HEADERLESS_BKG']) {
            this.mHeaderFont.PushLayerColor('MAIN', 0xfffee2b7);
            this.mHeaderFont.PushLayerColor('GLOW', 0xff000000);
            this.mHeaderFont.PushLayerColor('OUTLINE', 0xff000000);
        }
        Game.Bej3Dialog.prototype.Draw.apply(this, [g]);
        if(this.mComponentImage == Game.Resources['IMAGE_DIALOG_HEADERLESS_BKG']) {
            this.mHeaderFont.PopLayerColor('MAIN');
            this.mHeaderFont.PopLayerColor('GLOW');
            this.mHeaderFont.PopLayerColor('OUTLINE');
        }
        if(this.mWantDisableBox) {
            g.SetFont(Game.Resources['FONT_DISABLE_HINTS']);
            var alpha = (((0.5 + 0.5 * this.mNoHintsPct.get_v()) * 255.0) | 0);
            var _t1 = g.PushColor(GameFramework.gfx.Color.UInt_AToInt(0xffffffff, alpha));
            try {
                var x = this.mWidth / 2 - 45;
                var y = this.mHeight - 160;
                if(this.mYesButton == null) {
                    y += 85.0;
                } else {
                    y += (1.0 - showBtnPct) * 100.0;
                }
                if(this.mComponentImage == Game.Resources['IMAGE_DIALOG_HEADERLESS_BKG']) {
                    y -= 20.0;
                }
                g.DrawString('Disable Hints', x, y);
                this.mNoHintsCheckbox.Move(x - 60, y - 30);
            } finally {
                _t1.Dispose();
            }
        }
    },
    GetPreferredHeight : function Game_HintDialog$GetPreferredHeight(theWidth) {
        var aHeight = Game.Bej3Dialog.prototype.GetPreferredHeight.apply(this, [theWidth]);
        if(this.mWantDisableBox) {
            aHeight += 50.0;
            this.mNoHintsCheckbox.Move(theWidth / 2 - 125, aHeight - 190);
        }
        return aHeight;
    }
}
Game.HintDialog.staticInit = function Game_HintDialog$staticInit() {
}

JS_AddInitFunc(function() {
    Game.HintDialog.registerClass('Game.HintDialog', Game.Bej3Dialog);
});
JS_AddStaticInitFunc(function() {
    Game.HintDialog.staticInit();
});