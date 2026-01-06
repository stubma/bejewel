GameFramework.widgets.Dialog = function GameFramework_widgets_Dialog(
    theComponentImage,
    theButtonComponentImage,
    isModal,
    theDialogHeader,
    theDialogLines,
    theDialogFooter,
    theButtonMode
) {
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
    if (
        this.mButtonMode == GameFramework.widgets.Dialog.BUTTONS_YES_NO ||
        this.mButtonMode == GameFramework.widgets.Dialog.BUTTONS_OK_CANCEL
    ) {
        this.mYesButton = this.CreateButton(theButtonComponentImage);
        this.mYesButton.AddEventListener(
            GameFramework.widgets.WidgetEvent.CLICKED,
            ss.Delegate.create(this, this.HandleYesBtnClicked)
        );
        this.mNoButton = this.CreateButton(theButtonComponentImage);
        this.mNoButton.AddEventListener(
            GameFramework.widgets.WidgetEvent.CLICKED,
            ss.Delegate.create(this, this.HandleNoBtnClicked)
        );
        if (this.mButtonMode == GameFramework.widgets.Dialog.BUTTONS_YES_NO) {
            this.mYesButton.mLabel = "YES";
            this.mNoButton.mLabel = "NO";
        } else {
            this.mYesButton.mLabel = "OK";
            this.mNoButton.mLabel = "CANCEL";
        }
    } else if (this.mButtonMode == GameFramework.widgets.Dialog.BUTTONS_FOOTER) {
        this.mYesButton = this.CreateButton(theButtonComponentImage);
        this.mYesButton.mLabel = this.mDialogFooter;
        this.mYesButton.AddEventListener(
            GameFramework.widgets.WidgetEvent.CLICKED,
            ss.Delegate.create(this, this.HandleYesBtnClicked)
        );
        this.AddWidget(this.mYesButton);
        this.mNoButton = null;
    } else {
        this.mYesButton = null;
        this.mNoButton = null;
        this.mNumButtons = 0;
    }
    this.mDialogLines = theDialogLines;
    this.mButtonHeight = theButtonComponentImage == null ? 24 : theButtonComponentImage.mHeight;
    this.mHeaderFont = null;
    this.mLinesFont = null;
    this.mDragging = false;
    if (theButtonComponentImage == null) {
        this.mColors[GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT] = 0xff000000;
        this.mColors[GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT_HILITE] = 0xff000000;
    } else {
        this.mColors[GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT] = 0xffffffff;
        this.mColors[GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT_HILITE] = 0xffffffff;
    }
};
GameFramework.widgets.Dialog.prototype = {
    mColors: null,
    mComponentImage: null,
    mStretchBG: null,
    mYesButton: null,
    mNoButton: null,
    mNumButtons: 0,
    mDialogHeader: null,
    mDialogFooter: null,
    mDialogLines: null,
    mIsKilling: null,
    mButtonMode: 0,
    mHeaderFont: null,
    mLinesFont: null,
    mTextAlign: 0,
    mLineSpacingOffset: 0,
    mButtonHeight: 0,
    mBackgroundInsets: null,
    mContentInsets: null,
    mSpaceAfterHeader: 0,
    mAllowDragging: null,
    mDragging: null,
    mDragMouseX: 0,
    mDragMouseY: 0,
    mIsModal: null,
    mResult: 0,
    mButtonHorzSpacing: 0,
    mButtonSidePadding: 0,
    CreateButton: function GameFramework_widgets_Dialog$CreateButton(theButtonImage) {
        var ret = new GameFramework.widgets.ButtonWidget(0);
        this.ConfigureButton(ret, theButtonImage);
        return ret;
    },
    ConfigureButton: function GameFramework_widgets_Dialog$ConfigureButton(theBtn, theButtonImage) {
        theBtn.mButtonImage = theButtonImage;
        theBtn.mOverImage = theButtonImage;
        theBtn.mOverCel = Math.min(1, theButtonImage.mNumFrames - 1) | 0;
        theBtn.mDownImage = theButtonImage;
        theBtn.mDownCel = Math.min(2, theButtonImage.mNumFrames - 1) | 0;
        theBtn.mWidth = theBtn.mButtonImage.mWidth;
        theBtn.mHeight = theBtn.mButtonImage.mHeight;
        this.AddWidget(theBtn);
    },
    SetColor: function GameFramework_widgets_Dialog$SetColor(theIdx, theColor) {
        if (theIdx == GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT) {
            if (this.mYesButton != null) {
                this.mYesButton.SetColor(GameFramework.widgets.ButtonWidget.COLOR_LABEL, theColor);
            }
            if (this.mNoButton != null) {
                this.mNoButton.SetColor(GameFramework.widgets.ButtonWidget.COLOR_LABEL, theColor);
            }
        } else if (theIdx == GameFramework.widgets.Dialog.COLOR_BUTTON_TEXT_HILITE) {
            if (this.mYesButton != null) {
                this.mYesButton.SetColor(GameFramework.widgets.ButtonWidget.COLOR_LABEL_HILITE, theColor);
            }
            if (this.mNoButton != null) {
                this.mNoButton.SetColor(GameFramework.widgets.ButtonWidget.COLOR_LABEL_HILITE, theColor);
            }
        }
        this.mColors[theIdx] = theColor;
    },
    SetButtonFont: function GameFramework_widgets_Dialog$SetButtonFont(theFont) {
        if (this.mYesButton != null) {
            this.mYesButton.SetFont(theFont);
        }
        if (this.mNoButton != null) {
            this.mNoButton.SetFont(theFont);
        }
    },
    SetHeaderFont: function GameFramework_widgets_Dialog$SetHeaderFont(theFont) {
        this.mHeaderFont = theFont;
    },
    SetLinesFont: function GameFramework_widgets_Dialog$SetLinesFont(theFont) {
        this.mLinesFont = theFont;
    },
    EnsureFonts: function GameFramework_widgets_Dialog$EnsureFonts() {},
    GetPreferredHeight: function GameFramework_widgets_Dialog$GetPreferredHeight(theWidth) {
        this.EnsureFonts();
        var aHeight =
            this.mContentInsets.mTop +
            this.mContentInsets.mBottom +
            this.mBackgroundInsets.mTop +
            this.mBackgroundInsets.mBottom;
        var needSpace = false;
        if (this.mDialogHeader.length > 0 && this.mHeaderFont != null) {
            aHeight += this.mHeaderFont.GetHeight() - this.mHeaderFont.GetAscentPadding();
            needSpace = true;
        }
        if (this.mDialogLines.length > 0 && this.mLinesFont != null) {
            if (needSpace) {
                aHeight += this.mSpaceAfterHeader;
            }
            var aFontDrawData = new GameFramework.resources.FontDrawData();
            GameFramework.gfx.Graphics.GetDrawStringData(
                this.mDialogLines,
                this.mLinesFont,
                theWidth -
                    this.mContentInsets.mLeft -
                    this.mContentInsets.mRight -
                    this.mBackgroundInsets.mLeft -
                    this.mBackgroundInsets.mRight -
                    4,
                0,
                GameFramework.gfx.ETextOverflowMode.Wrap,
                this.mLineSpacingOffset,
                aFontDrawData
            );
            aHeight += aFontDrawData.mFontDescent + aFontDrawData.mFontAscent;
            needSpace = true;
        }
        if (
            this.mDialogFooter != null &&
            this.mDialogFooter.length != 0 &&
            this.mButtonMode != GameFramework.widgets.Dialog.BUTTONS_FOOTER &&
            this.mHeaderFont != null
        ) {
            if (needSpace) {
                aHeight += this.mLinesFont.GetHeight() - this.mLinesFont.GetAscent();
            }
            aHeight += this.mHeaderFont.GetLineSpacing() | 0;
            needSpace = true;
        }
        if (this.mYesButton != null) {
            if (needSpace) {
                aHeight += this.mLinesFont.GetHeight() - this.mLinesFont.GetAscent();
            }
            aHeight += this.mButtonHeight + 8;
        }
        return aHeight;
    },
    Draw: function GameFramework_widgets_Dialog$Draw(g) {
        this.mAppState.FlushDeferDraws();
        this.EnsureFonts();
        var aBoxRect = new GameFramework.TRect(
            this.mBackgroundInsets.mLeft,
            this.mBackgroundInsets.mTop,
            this.mWidth - this.mBackgroundInsets.mLeft - this.mBackgroundInsets.mRight,
            this.mHeight - this.mBackgroundInsets.mTop - this.mBackgroundInsets.mBottom
        );
        if (this.mComponentImage != null) {
            if (!this.mStretchBG) {
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
        if (this.mDialogHeader.length > 0) {
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
            while (true) {
                lastChar = this.mDialogHeader.indexOf(String.fromCharCode(10), lastChar + 1);
                if (lastChar == -1) {
                    break;
                }
                aCurY += this.mHeaderFont.GetHeight();
            }
            aCurY += this.mSpaceAfterHeader;
        }
        g.SetFont(this.mLinesFont);
        var aRect = new GameFramework.TRect(
            this.mBackgroundInsets.mLeft + this.mContentInsets.mLeft + 2,
            aCurY,
            this.mWidth -
                this.mContentInsets.mLeft -
                this.mContentInsets.mRight -
                this.mBackgroundInsets.mLeft -
                this.mBackgroundInsets.mRight -
                4,
            0
        );
        var _t4 = g.PushColor(this.mColors[GameFramework.widgets.Dialog.COLOR_LINES]);
        try {
            g.DrawStringEx(
                this.mDialogLines,
                this.mBackgroundInsets.mLeft + this.mContentInsets.mLeft + 2,
                aCurY + this.mLinesFont.GetAscent(),
                this.mWidth -
                    this.mContentInsets.mLeft -
                    this.mContentInsets.mRight -
                    this.mBackgroundInsets.mLeft -
                    this.mBackgroundInsets.mRight -
                    4,
                this.mTextAlign,
                GameFramework.gfx.ETextOverflowMode.Wrap,
                this.mLineSpacingOffset
            );
        } finally {
            _t4.Dispose();
        }
        if (
            this.mDialogFooter != null &&
            this.mDialogFooter.length != 0 &&
            this.mButtonMode != GameFramework.widgets.Dialog.BUTTONS_FOOTER
        ) {
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
    Resize: function GameFramework_widgets_Dialog$Resize(theX, theY, theWidth, theHeight) {
        GameFramework.widgets.ClassicWidget.prototype.Resize.apply(this, [theX, theY, theWidth, theHeight]);
        if (this.mYesButton != null && this.mNoButton != null) {
            var aBtnWidth =
                (this.mWidth -
                    this.mContentInsets.mLeft -
                    this.mContentInsets.mRight -
                    this.mBackgroundInsets.mLeft -
                    this.mBackgroundInsets.mRight -
                    this.mButtonSidePadding * 2 -
                    this.mButtonHorzSpacing) /
                2;
            var aBtnHeight = this.mButtonHeight;
            this.mYesButton.Resize(
                this.mBackgroundInsets.mLeft + this.mContentInsets.mLeft + this.mButtonSidePadding,
                this.mHeight - this.mContentInsets.mBottom - this.mBackgroundInsets.mBottom - aBtnHeight,
                aBtnWidth,
                aBtnHeight
            );
            this.mNoButton.Resize(
                this.mYesButton.mX + aBtnWidth + this.mButtonHorzSpacing,
                this.mYesButton.mY,
                aBtnWidth,
                aBtnHeight
            );
        } else if (this.mYesButton != null) {
            var aBtnHeight_2 = this.mButtonHeight;
            this.mYesButton.Resize(
                this.mContentInsets.mLeft + this.mBackgroundInsets.mLeft,
                this.mHeight - this.mContentInsets.mBottom - this.mBackgroundInsets.mBottom - aBtnHeight_2,
                this.mWidth -
                    this.mContentInsets.mLeft -
                    this.mContentInsets.mRight -
                    this.mBackgroundInsets.mLeft -
                    this.mBackgroundInsets.mRight,
                aBtnHeight_2
            );
        }
    },
    MouseDown: function GameFramework_widgets_Dialog$MouseDown(x, y) {
        if (
            this.mIsOver &&
            this.mAllowDragging &&
            !this.mDragging &&
            GameFramework.widgets.ClassicWidget.prototype.Contains.apply(this, [x, y])
        ) {
            this.mDragging = true;
            this.mDragMouseX = x;
            this.mDragMouseY = y;
        }
        GameFramework.widgets.ClassicWidget.prototype.MouseDown.apply(this, [x, y]);
    },
    MouseMove: function GameFramework_widgets_Dialog$MouseMove(x, y) {
        GameFramework.widgets.ClassicWidget.prototype.MouseMove.apply(this, [x, y]);
        if (this.mDragging) {
            var aNewX = this.mX + x - this.mDragMouseX;
            var aNewY = this.mY + y - this.mDragMouseY;
            if (aNewX < -8) {
                aNewX = -8;
            } else if (aNewX + this.mWidth > GameFramework.BaseApp.mApp.mWidth + 8) {
                aNewX = GameFramework.BaseApp.mApp.mWidth - this.mWidth + 8;
            }
            if (aNewY < -8) {
                aNewY = -8;
            } else if (aNewY + this.mHeight > GameFramework.BaseApp.mApp.mHeight + 8) {
                aNewY = GameFramework.BaseApp.mApp.mHeight - this.mHeight + 8;
            }
            this.mDragMouseX = this.mX + x - aNewX;
            this.mDragMouseY = this.mY + y - aNewY;
            if (this.mDragMouseX < 8) {
                this.mDragMouseX = 8;
            } else if (this.mDragMouseX > this.mWidth - 9) {
                this.mDragMouseX = this.mWidth - 9;
            }
            if (this.mDragMouseY < 8) {
                this.mDragMouseY = 8;
            } else if (this.mDragMouseY > this.mHeight - 9) {
                this.mDragMouseY = this.mHeight - 9;
            }
            this.Move(aNewX, aNewY);
        }
    },
    Contains: function GameFramework_widgets_Dialog$Contains(x, y) {
        return this.mIsModal || GameFramework.widgets.ClassicWidget.prototype.Contains.apply(this, [x, y]);
    },
    MouseUp: function GameFramework_widgets_Dialog$MouseUp(x, y) {
        if (this.mDragging) {
            this.mDragging = false;
        }
        GameFramework.widgets.ClassicWidget.prototype.MouseUp.apply(this, [x, y]);
    },
    Update: function GameFramework_widgets_Dialog$Update() {
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
    },
    IsModal: function GameFramework_widgets_Dialog$IsModal() {
        return this.mIsModal;
    },
    Kill: function GameFramework_widgets_Dialog$Kill() {
        if (this.mIsKilling) {
            return;
        }
        this.mIsKilling = true;
        var e = new GameFramework.widgets.DialogEvent(GameFramework.widgets.DialogEvent.CLOSED, this);
        e.mCloseResult = this.mResult;
        this.DispatchEvent(e);
        this.mParent.RemoveWidget(this);
    },
    HandleYesBtnClicked: function GameFramework_widgets_Dialog$HandleYesBtnClicked(theEvent) {
        if (!this.mIsKilling) {
            this.mResult = GameFramework.widgets.Dialog.ID_YES;
            this.Kill();
        }
    },
    HandleNoBtnClicked: function GameFramework_widgets_Dialog$HandleNoBtnClicked(theEvent) {
        if (!this.mIsKilling) {
            this.mResult = GameFramework.widgets.Dialog.ID_NO;
            this.Kill();
        }
    },
};
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
};

JSFExt_AddInitFunc(function () {
    GameFramework.widgets.Dialog.registerClass("GameFramework.widgets.Dialog", GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.widgets.Dialog.staticInit();
});
