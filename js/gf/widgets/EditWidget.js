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

JSFExt_AddInitFunc(function() {
	GameFramework.widgets.EditWidget.registerClass('GameFramework.widgets.EditWidget', GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.widgets.EditWidget.staticInit();
});