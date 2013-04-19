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

JSFExt_AddInitFunc(function() {
	Game.Checkbox.registerClass('Game.Checkbox', GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function() {
	Game.Checkbox.staticInit();
});