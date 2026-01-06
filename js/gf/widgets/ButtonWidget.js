GameFramework.widgets.ButtonWidget = function GameFramework_widgets_ButtonWidget(theId) {
    if (theId === undefined) {
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
};
GameFramework.widgets.ButtonWidget.prototype = {
    mColors: null,
    mAlpha: 1.0,
    mAlphaVisibilityThreshold: 0.5,
    mId: 0,
    mLabel: null,
    mLabelJustify: 0,
    mLabelYOfs: 0,
    mFont: null,
    mButtonImage: null,
    mIconImage: null,
    mOverImage: null,
    mDownImage: null,
    mDisabledImage: null,
    mNormalCel: -1,
    mOverCel: -1,
    mDownCel: -1,
    mDisabledCel: -1,
    mDisabled: false,
    mInverted: false,
    mOverAlpha: 0.0,
    mBoundsRadius: 0.0,
    mBoundsRect: null,
    IsButtonDown: function GameFramework_widgets_ButtonWidget$IsButtonDown() {
        return this.mIsDown && this.mIsOver && !this.mDisabled;
    },
    HaveButtonImage: function GameFramework_widgets_ButtonWidget$HaveButtonImage(theImage, theCel) {
        return theImage != null || theCel != -1;
    },
    MouseClicked: function GameFramework_widgets_ButtonWidget$MouseClicked(x, y) {
        if (!this.mDisabled) {
            GameFramework.widgets.ClassicWidget.prototype.MouseClicked.apply(this, [x, y]);
        }
    },
    ResizeFromImage: function GameFramework_widgets_ButtonWidget$ResizeFromImage(
        theImageResource,
        theOffsetX,
        theOffsetY
    ) {
        if (theOffsetX === undefined) {
            theOffsetX = 0;
        }
        if (theOffsetY === undefined) {
            theOffsetY = 0;
        }
        this.mX = theImageResource.mOffsetX + theOffsetX;
        this.mY = theImageResource.mOffsetY + theOffsetY;
        this.mWidth = theImageResource.mWidth;
        this.mHeight = theImageResource.mHeight;
    },
    DrawAll: function GameFramework_widgets_ButtonWidget$DrawAll(g) {
        var wantColorize = this.mAlpha != 1.0;
        if (wantColorize) {
            g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, (255.0 * this.mAlpha) | 0));
        }
        GameFramework.widgets.ClassicWidget.prototype.DrawAll.apply(this, [g]);
        if (wantColorize) {
            g.PopColor();
        }
    },
    DrawButtonImage: function GameFramework_widgets_ButtonWidget$DrawButtonImage(g, theImage, theCel, x, y) {
        var aVScale = this.mHeight / this.mButtonImage.mHeight;
        if (aVScale != 1.0) {
            g.PushScale(1.0, aVScale, 0, 0);
        }
        if (theCel != -1) {
            g.DrawButton(this.mButtonImage == null ? theImage : this.mButtonImage, x, y, this.mWidth, theCel);
        } else {
            g.DrawButton(theImage, x, y, this.mWidth, 0);
        }
        if (aVScale != 1.0) {
            g.PopMatrix();
        }
    },
    SetFont: function GameFramework_widgets_ButtonWidget$SetFont(theFont) {
        this.mFont = theFont;
    },
    SetColor: function GameFramework_widgets_ButtonWidget$SetColor(theIdx, theColor) {
        this.mColors[theIdx] = theColor;
    },
    Draw: function GameFramework_widgets_ButtonWidget$Draw(g) {
        var isDown = this.mIsDown && this.mIsOver && !this.mDisabled;
        if (this.mInverted) {
            isDown = !isDown;
        }
        var aFontX = 0;
        var aFontY = 0;
        g.SetFont(this.mFont);
        if (this.mFont != null) {
            if (this.mLabelJustify == 0) {
                aFontX = (this.mWidth - this.mFont.StringWidth(this.mLabel)) / 2;
            } else if (this.mLabelJustify == 1) {
                aFontX = this.mWidth - this.mFont.StringWidth(this.mLabel);
            }
            var aPhysAscent = this.mFont.GetPhysAscent();
            var aPhysDescent = this.mFont.GetPhysDescent();
            aFontY = this.mHeight / 2 + this.mFont.GetHeight() / 2 + this.mLabelYOfs;
        }
        var anIconX = 0;
        var anIconY = 0;
        var aDownOffset = 1.0 / GameFramework.BaseApp.mApp.mScale;
        if (this.mButtonImage == null && this.mDownImage == null) {
        } else {
            if (!isDown) {
                if (this.mDisabled && this.HaveButtonImage(this.mDisabledImage, this.mDisabledCel)) {
                    this.DrawButtonImage(g, this.mDisabledImage, this.mDisabledCel, 0, 0);
                } else if (this.mOverAlpha > 0 && this.HaveButtonImage(this.mOverImage, this.mOverCel)) {
                    if (this.HaveButtonImage(this.mButtonImage, this.mNormalCel) && this.mOverAlpha < 1) {
                        this.DrawButtonImage(g, this.mButtonImage, this.mNormalCel, 0, 0);
                    }
                    g.PushColor(GameFramework.gfx.Color.RGBAToInt(255, 255, 255, (this.mOverAlpha * 255) | 0));
                    this.DrawButtonImage(g, this.mOverImage, this.mOverCel, 0, 0);
                    g.PopColor();
                } else if ((this.mIsOver || this.mIsDown) && this.HaveButtonImage(this.mOverImage, this.mOverCel)) {
                    this.DrawButtonImage(g, this.mOverImage, this.mOverCel, 0, 0);
                } else if (this.HaveButtonImage(this.mButtonImage, this.mNormalCel)) {
                    this.DrawButtonImage(g, this.mButtonImage, this.mNormalCel, 0, 0);
                }
                if (this.mIsOver) {
                    g.PushColor(this.mColors[GameFramework.widgets.ButtonWidget.COLOR_LABEL_HILITE]);
                } else {
                    g.PushColor(this.mColors[GameFramework.widgets.ButtonWidget.COLOR_LABEL]);
                }
                if (this.mIconImage != null) {
                    g.DrawImage(this.mIconImage, anIconX, anIconY);
                } else if (this.mLabel != null) {
                    g.DrawString(this.mLabel, aFontX, aFontY);
                }
                g.PopColor();
            } else {
                if (this.HaveButtonImage(this.mDownImage, this.mDownCel)) {
                    this.DrawButtonImage(g, this.mDownImage, this.mDownCel, 0, 0);
                } else if (this.HaveButtonImage(this.mOverImage, this.mOverCel)) {
                    this.DrawButtonImage(g, this.mOverImage, this.mOverCel, 1, 1);
                } else {
                    this.DrawButtonImage(g, this.mButtonImage, this.mNormalCel, 1, 1);
                }
                g.PushColor(this.mColors[GameFramework.widgets.ButtonWidget.COLOR_LABEL_HILITE]);
                if (this.mIconImage != null) {
                    g.DrawImage(this.mIconImage, anIconX + aDownOffset, anIconY + aDownOffset);
                } else if (this.mLabel != null) {
                    g.DrawString(this.mLabel, aFontX + aDownOffset, aFontY + aDownOffset);
                }
                g.PopColor();
            }
        }
    },
    Contains: function GameFramework_widgets_ButtonWidget$Contains(x, y) {
        return (
            GameFramework.widgets.ClassicWidget.prototype.Contains.apply(this, [x, y]) &&
            this.mAlpha > this.mAlphaVisibilityThreshold &&
            (this.mBoundsRadius == 0.0 ||
                (x - this.mWidth / 2.0) * (x - this.mWidth / 2.0) +
                    (y - this.mHeight / 2.0) * (y - this.mHeight / 2.0) <
                    this.mBoundsRadius * this.mBoundsRadius) &&
            (this.mBoundsRect == null || this.mBoundsRect.Contains(x, y))
        );
    },
};
GameFramework.widgets.ButtonWidget.staticInit = function GameFramework_widgets_ButtonWidget$staticInit() {
    GameFramework.widgets.ButtonWidget.COLOR_LABEL = 0;
    GameFramework.widgets.ButtonWidget.COLOR_LABEL_HILITE = 1;
};

JSFExt_AddInitFunc(function () {
    GameFramework.widgets.ButtonWidget.registerClass(
        "GameFramework.widgets.ButtonWidget",
        GameFramework.widgets.ClassicWidget
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.widgets.ButtonWidget.staticInit();
});
