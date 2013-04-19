GameFramework.widgets.ClassicWidgetAppState = function GameFramework_widgets_ClassicWidgetAppState() {
	this.mRootWidget = new GameFramework.widgets.ClassicWidget();
	this.mLastWidgetOver = null;
	this.mFocusWidget = null;
	this.mDeferDraws = [];
	this.mKeysDown = Array.Create((GameFramework.KeyCode.COUNT | 0), null);
	GameFramework.widgets.ClassicWidgetAppState.initializeBase(this);
	this.mRootWidget.mAppState = this;
}
GameFramework.widgets.ClassicWidgetAppState.prototype = {
	mRootWidget : null,
	mGraphics : null,
	mPaused : false,
	mLastWidgetOver : null,
	mFocusWidget : null,
	mDeferDraws : null,
	mLastMouseX : -1000,
	mLastMouseY : -1000,
	mWantRehupMouse : false,
	mKeysDown : null,
	handlePause : function GameFramework_widgets_ClassicWidgetAppState$handlePause(e) {
		this.togglePause(true);
	},
	handleUnpause : function GameFramework_widgets_ClassicWidgetAppState$handleUnpause(e) {
		this.togglePause(false);
	},
	togglePause : function GameFramework_widgets_ClassicWidgetAppState$togglePause(paused) {
		this.mPaused = paused;
	},
	SetFocus : function GameFramework_widgets_ClassicWidgetAppState$SetFocus(theWidget) {
		if(this.mFocusWidget != null) {
			this.mFocusWidget.LostFocus();
		}
		this.mFocusWidget = theWidget;
		if(this.mFocusWidget != null) {
			this.mFocusWidget.GotFocus();
		}
	},
	Update : function GameFramework_widgets_ClassicWidgetAppState$Update() {
		if(this.mWantRehupMouse) {
			this.RehupMouse();
			this.mWantRehupMouse = false;
		}
		if(this.mPaused) {
			return;
		}
		this.mRootWidget.UpdateAll();
	},
	FlushDeferDraws : function GameFramework_widgets_ClassicWidgetAppState$FlushDeferDraws() {
		for(var i = 0; i < this.mDeferDraws.length; i++) {
			var aClassicWidget = this.mDeferDraws[i];
			var _t1 = this.mGraphics.PushTranslate(aClassicWidget.mLastDrawX - this.mGraphics.mMatrix.tx, aClassicWidget.mLastDrawY - this.mGraphics.mMatrix.ty);
			try {
				aClassicWidget.DrawOverlay(this.mGraphics);
			} finally {
				_t1.Dispose();
			}
		}
		this.mDeferDraws.clear();
	},
	Draw : function GameFramework_widgets_ClassicWidgetAppState$Draw(elapsed) {
		if(this.mPaused) {
			return;
		}
		this.mGraphics.Reset();
		var aScale = 1.0;
		if(this.mGraphics.mScale != GameFramework.BaseApp.mApp.mScale) {
			aScale = GameFramework.BaseApp.mApp.mScale / this.mGraphics.mScale;
		}
		if(aScale != 1.0) {
			this.mGraphics.PushScale(aScale + 0.00000001, aScale + 0.00000001, 0, 0);
		}
		this.mGraphics.PushTranslate(this.mRootWidget.mX, this.mRootWidget.mY);
		this.mRootWidget.DrawAll(this.mGraphics);
		this.mGraphics.PopMatrix();
		this.FlushDeferDraws();
		if(aScale != 1.0) {
			this.mGraphics.PopMatrix();
		}
	},
	onEnter : function GameFramework_widgets_ClassicWidgetAppState$onEnter() {
	},
	onExit : function GameFramework_widgets_ClassicWidgetAppState$onExit() {
	},
	onPush : function GameFramework_widgets_ClassicWidgetAppState$onPush() {
	},
	onPop : function GameFramework_widgets_ClassicWidgetAppState$onPop() {
	},
	MouseUp : function GameFramework_widgets_ClassicWidgetAppState$MouseUp(x, y) {
		this.mRootWidget.MouseUp(x - this.mRootWidget.mX, y - this.mRootWidget.mY);
	},
	MouseDown : function GameFramework_widgets_ClassicWidgetAppState$MouseDown(x, y) {
		this.mRootWidget.MouseDown(x - this.mRootWidget.mX, y - this.mRootWidget.mY);
	},
	RehupMouse : function GameFramework_widgets_ClassicWidgetAppState$RehupMouse() {
		var aWidgetOver = this.mRootWidget.FindWidget(this.mLastMouseX - this.mRootWidget.mX, this.mLastMouseY - this.mRootWidget.mY);
		if(aWidgetOver != this.mLastWidgetOver) {
			if(this.mLastWidgetOver != null) {
				this.mLastWidgetOver.MouseLeave();
				this.mLastWidgetOver.mIsOver = false;
			}
			this.mLastWidgetOver = aWidgetOver;
			if(aWidgetOver != null) {
				this.mLastWidgetOver.MouseEnter();
				this.mLastWidgetOver.mIsOver = true;
			}
		}
	},
	MouseMove : function GameFramework_widgets_ClassicWidgetAppState$MouseMove(x, y) {
		this.mLastMouseX = x;
		this.mLastMouseY = y;
		this.RehupMouse();
		this.mRootWidget.MouseMove(x - this.mRootWidget.mX, y - this.mRootWidget.mY);
	},
	IsKeyDown : function GameFramework_widgets_ClassicWidgetAppState$IsKeyDown(theKeyCode) {
		return this.mKeysDown[(theKeyCode | 0)];
	},
	KeyUp : function GameFramework_widgets_ClassicWidgetAppState$KeyUp(theKeyCode) {
		this.mKeysDown[(theKeyCode | 0)] = false;
		var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_UP);
		aWidgetEvent.mKeyCode = theKeyCode;
		GameFramework.BaseApp.mApp.DispatchEvent(aWidgetEvent);
		if(this.mFocusWidget != null) {
			this.mFocusWidget.KeyUp(theKeyCode);
		}
	},
	KeyDown : function GameFramework_widgets_ClassicWidgetAppState$KeyDown(theKeyCode) {
		this.mKeysDown[(theKeyCode | 0)] = true;
		var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_DOWN);
		aWidgetEvent.mKeyCode = theKeyCode;
		GameFramework.BaseApp.mApp.DispatchEvent(aWidgetEvent);
		if(this.mFocusWidget != null) {
			this.mFocusWidget.KeyDown(theKeyCode);
		}
	},
	KeyChar : function GameFramework_widgets_ClassicWidgetAppState$KeyChar(theChar) {
		var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_CHAR);
		aWidgetEvent.mKeyChar = theChar;
		GameFramework.BaseApp.mApp.DispatchEvent(aWidgetEvent);
		if(this.mFocusWidget != null) {
			this.mFocusWidget.KeyChar(theChar);
		}
	}
}
GameFramework.widgets.ClassicWidgetAppState.staticInit = function GameFramework_widgets_ClassicWidgetAppState$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.widgets.ClassicWidgetAppState.registerClass('GameFramework.widgets.ClassicWidgetAppState', GameFramework.events.EventDispatcher, GameFramework.IAppState);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.widgets.ClassicWidgetAppState.staticInit();
});