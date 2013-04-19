/**
 * @constructor
 */
Game.Bej3Dialog = function Game_Bej3Dialog(theComponentImage, theButtonComponentImage, theId, isModal, theDialogHeader, theDialogLines, theDialogFooter, theButtonMode) {
    this.mScale = new GameFramework.CurvedVal();
    this.mAlpha = new GameFramework.CurvedVal();
    this.mMouseInvisibleChildren = [];
    Game.Bej3Dialog.initializeBase(this, [theComponentImage, theButtonComponentImage, isModal, theDialogHeader, theDialogLines, theDialogFooter, theButtonMode]);
    this.mDialogId = theId;
    this.mFlushPriority = -1;
    this.mIsKilling = false;
    this.mCanEscape = false;
    this.mAllowDrag = true;
    this.mScaleCenterX = 0;
    this.mScaleCenterY = 0;
    this.mWantsDarken = true;
    this.mSpaceAfterHeader = 45;
    this.mContentInsets = new GameFramework.Insets(90, 22, 90, 45);
    this.mButtonHorzSpacing = 10;
    this.mButtonSidePadding = 25;
    this.mLineSpacingOffset = -3;
    this.SetHeaderFont(Game.Resources['FONT_DIALOG_HEADER']);
    this.SetLinesFont(Game.Resources['FONT_DIALOG_SMALL_TEXT']);
    this.SetButtonFont(Game.Resources['FONT_DIALOG_BUTTONS']);
    this.mScale.SetCurve('b+0,2,0.033333,1,####        HY### XPV}f');
    this.mAlpha.SetCurve('b+0,1,0.033333,1,#%t=.####=#2h3       J~P##  1~P##');
}
Game.Bej3Dialog.prototype = {
    mFlushPriority : 0,
    mScale : null,
    mAlpha : null,
    mCanEscape : null,
    mAllowDrag : null,
    mScaleCenterX : 0,
    mScaleCenterY : 0,
    mWantsDarken : null,
    mDialogId : null,
    mMouseInvisibleChildren : null,
    Draw : function Game_Bej3Dialog$Draw(g) {
        GameFramework.widgets.Dialog.prototype.Draw.apply(this, [g]);
    },
    DrawAll : function Game_Bej3Dialog$DrawAll(g) {
        if(this.mAlpha.get_v() != 1.0) {
            g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mAlpha.get_v()));
        }
        this.mAppState.FlushDeferDraws();
        var wantScaling = this.mScale.GetOutVal() != 1.0;
        if(wantScaling) {
            var aCenterX = this.mX + this.mWidth / 2.0;
            var aCenterY = this.mY + this.mHeight / 2.0;
            if(this.mScaleCenterX != 0) {
                aCenterX = this.mScaleCenterX;
                aCenterY = this.mScaleCenterY;
            }
            g.PushScale(this.mScale.get_v(), this.mScale.get_v(), aCenterX, aCenterY);
        }
        GameFramework.widgets.Dialog.prototype.DrawAll.apply(this, [g]);
        if(wantScaling) {
            g.PopMatrix();
        }
        if(this.mAlpha.get_v() != 1.0) {
            g.PopColor();
        }
    },
    Update : function Game_Bej3Dialog$Update() {
        GameFramework.widgets.Dialog.prototype.Update.apply(this);
        this.mScaleCenterX = this.mWidth / 2.0;
        this.mScaleCenterY = this.mHeight / 2.0;
        this.mAlpha.IncInVal();
        if(!this.mScale.IncInVal() && this.mScale.mRamp != GameFramework.CurvedVal.RAMP_LINEAR) {
            if(this.mScale.GetOutVal() == 0.0) {
                if(Game.BejApp.mBejApp.mBoard != null) {
                    Game.BejApp.mBejApp.mBoard.DialogClosed(this.mDialogId);
                }
                Game.BejApp.mBejApp.mDialogMgr.KillDialog(this.mDialogId);
            } else if(this.mScale.GetOutVal() == 1.0) {
                this.SetChildrenMouseVisible(true);
            }
        } else if(this.mScale.mRamp == GameFramework.CurvedVal.RAMP_CURVEDATA) {
            this.SetChildrenMouseVisible(false);
        }
    },
    SetChildrenMouseVisible : function Game_Bej3Dialog$SetChildrenMouseVisible(isVisible) {
    },
    Kill : function Game_Bej3Dialog$Kill() {
        if(this.mIsKilling) {
            return;
        }
        this.mIsKilling = true;
        var e = new GameFramework.widgets.DialogEvent(GameFramework.widgets.DialogEvent.CLOSED, this);
        e.mCloseResult = this.mResult;
        this.DispatchEvent(e);
        var aPrevScale = this.mScale.GetOutVal();
        this.mAlpha.SetCurve('b+0,1,0.05,1,~###    P~###     P#>%*');
        this.mScale.SetCurve('b+0,1,0.05,1,~###         ~#A5t');
        this.mScale.mOutMax = aPrevScale;
    },
    CreateButton : function Game_Bej3Dialog$CreateButton(theButtonImage) {
        var ret = new Game.Bej3Button(0);
        Game.BejApp.mBejApp.AddButtonSounds(ret);
        this.ConfigureButton(ret, theButtonImage);
        ret.mFont = Game.Resources['FONT_DIALOG_BUTTONS'];
        ret.mLabelYOfs = -4;
        ret.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.ButtonDepress));
        ret.AddEventListener(GameFramework.widgets.WidgetEvent.MOUSE_DOWN, ss.Delegate.create(this, this.ButtonPress));
        return ret;
    },
    NewButton : function Game_Bej3Dialog$NewButton(theId, theWidth) {
        return this.NewButton$2(theId, theWidth, null);
    },
    NewButton$2 : function Game_Bej3Dialog$NewButton$2(theId, theWidth, theButtonImage) {
        var aButtonImage;
        if(theButtonImage == null) {
            aButtonImage = Game.Resources['IMAGE_DIALOG_BUTTON'];
        } else {
            aButtonImage = theButtonImage;
        }
        var aButton = new Game.Bej3DialogButton(theId);
        aButton.Resize(0, 0, theWidth, aButtonImage.mHeight);
        aButton.SetFont(Game.Resources['FONT_DIALOG_BUTTONS']);
        this.AddWidget(aButton);
        Game.BejApp.mBejApp.AddButtonSounds(aButton);
        aButton.AddEventListener(GameFramework.widgets.WidgetEvent.CLICKED, ss.Delegate.create(this, this.ButtonDepress));
        aButton.AddEventListener(GameFramework.widgets.WidgetEvent.MOUSE_DOWN, ss.Delegate.create(this, this.ButtonPress));
        return aButton;
    },
    KeyDown : function Game_Bej3Dialog$KeyDown(theKey) {
        if((theKey == GameFramework.KeyCode.Escape) && (this.mCanEscape)) {
            var btn = this.mNoButton != null ? this.mNoButton : this.mYesButton;
            if(btn != null) {
                var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.CLICKED);
                aWidgetEvent.mX = btn.mX;
                aWidgetEvent.mY = btn.mY;
                btn.DispatchEvent(aWidgetEvent);
            }
        }
    },
    MouseDown : function Game_Bej3Dialog$MouseDown(x, y) {
        GameFramework.widgets.Dialog.prototype.MouseDown.apply(this, [x, y]);
    },
    ButtonPress : function Game_Bej3Dialog$ButtonPress(theEvent) {
    },
    ButtonDepress : function Game_Bej3Dialog$ButtonDepress(theEvent) {
    }
}
Game.Bej3Dialog.staticInit = function Game_Bej3Dialog$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.Bej3Dialog.registerClass('Game.Bej3Dialog', GameFramework.widgets.Dialog);
});
JSFExt_AddStaticInitFunc(function() {
    Game.Bej3Dialog.staticInit();
});
Game.Bej3Dialog.EId = {};
Game.Bej3Dialog.EId.staticInit = function Game_Bej3Dialog_EId$staticInit() {
    Game.Bej3Dialog.EId.ID_CANCEL = 1002;
}
JSFExt_AddInitFunc(function() {
    Game.Bej3Dialog.EId.staticInit();
});