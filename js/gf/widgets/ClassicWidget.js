GameFramework.widgets.ClassicWidget = function GameFramework_widgets_ClassicWidget() {
	this.mWidgets = [];
	GameFramework.widgets.ClassicWidget.initializeBase(this);
}
GameFramework.widgets.ClassicWidget.prototype = {
	mWidgets : null,
	mUpdateCnt : 0,
	mParent : null,
	mAppState : null,
	mX : 0,
	mY : 0,
	mWidth : 0,
	mHeight : 0,
	mIsOver : false,
	mIsDown : false,
	mVisible : true,
	mMouseVisible : true,
	mHasFocus : false,
	mLastDrawX : 0,
	mLastDrawY : 0,
	RemoveAllWidgets : function GameFramework_widgets_ClassicWidget$RemoveAllWidgets(recursive) {
		if(recursive === undefined) {
			recursive = true;
		}

		{
			var $enum1 = ss.IEnumerator.getEnumerator(this.mWidgets);
			while($enum1.moveNext()) {
				var aChild = $enum1.get_current();
				if(recursive) {
					aChild.RemoveAllWidgets();
				}
				aChild.mParent = null;
				aChild.mAppState = null;
			}
		}
		this.mWidgets.clear();
	},
	Dispose : function GameFramework_widgets_ClassicWidget$Dispose() {
		if(this.mAppState != null) {
			if(this.mAppState.mFocusWidget == this) {
				this.mAppState.mFocusWidget = null;
			}
			if(this.mAppState.mLastWidgetOver == this) {
				this.mAppState.mLastWidgetOver = null;
			}
			this.mAppState = null;
		}
		this.mParent = null;

		{
			var $enum2 = ss.IEnumerator.getEnumerator(this.mWidgets);
			while($enum2.moveNext()) {
				var aChild = $enum2.get_current();
				aChild.Dispose();
			}
		}
		this.mWidgets.clear();
		GameFramework.events.EventDispatcher.prototype.Dispose.apply(this);
	},
	DeferOverlay : function GameFramework_widgets_ClassicWidget$DeferOverlay() {
		this.mAppState.mDeferDraws.push(this);
	},
	GotFocus : function GameFramework_widgets_ClassicWidget$GotFocus() {
		this.mHasFocus = true;
	},
	LostFocus : function GameFramework_widgets_ClassicWidget$LostFocus() {
		this.mHasFocus = false;
	},
	Resize : function GameFramework_widgets_ClassicWidget$Resize(theX, theY, theWidth, theHeight) {
		this.mX = theX;
		this.mY = theY;
		this.mWidth = theWidth;
		this.mHeight = theHeight;
	},
	Update : function GameFramework_widgets_ClassicWidget$Update() {
		this.mUpdateCnt++;
	},
	UpdateAll : function GameFramework_widgets_ClassicWidget$UpdateAll() {
		this.Update();
		for(var i = 0; i < this.mWidgets.length; i++) {
			var aWidget = (this.mWidgets[i]);
			aWidget.UpdateAll();
		}
	},
	SetMouseVisible : function GameFramework_widgets_ClassicWidget$SetMouseVisible(mouseVisible) {
		this.mMouseVisible = mouseVisible;
		if((this.mIsOver) && (!this.mMouseVisible)) {
			this.mAppState.RehupMouse();
		}
	},
	AddWidget : function GameFramework_widgets_ClassicWidget$AddWidget(theWidget) {
		if(theWidget.mParent != null) {
			theWidget.mParent.RemoveWidget(theWidget);
		}
		this.mWidgets.push(theWidget);
		theWidget.mParent = this;
		theWidget.mAppState = this.mAppState;
		if(this.mAppState != null) {
			this.mAppState.mWantRehupMouse = true;
		}
	},
	RemoveWidget : function GameFramework_widgets_ClassicWidget$RemoveWidget(theWidget) {
		var anIdx = this.mWidgets.indexOf(theWidget);
		this.mWidgets.removeAt(anIdx);
		if(theWidget.mAppState != null) {
			if(theWidget.mAppState.mLastWidgetOver == theWidget) {
				theWidget.MouseLeave();
				theWidget.mIsOver = false;
				theWidget.mAppState.mLastWidgetOver = null;
				this.mAppState.mWantRehupMouse = true;
			}
			if(theWidget.mAppState.mFocusWidget == theWidget) {
				theWidget.LostFocus();
				theWidget.mAppState.mFocusWidget = null;
			}
		}
		theWidget.mParent = null;
		theWidget.mAppState = null;
	},
	RemoveSelf : function GameFramework_widgets_ClassicWidget$RemoveSelf() {
		if(this.mParent != null) {
			this.mParent.RemoveWidget(this);
		}
	},
	Draw : function GameFramework_widgets_ClassicWidget$Draw(g) {
	},
	DrawOverlay : function GameFramework_widgets_ClassicWidget$DrawOverlay(g) {
	},
	DrawAll : function GameFramework_widgets_ClassicWidget$DrawAll(g) {
		var aMatrixDepth = g.mMatrixDepth;
		var aColorDepth = g.mColorVector.length;
		this.Draw(g);
		JS_Assert(aMatrixDepth == g.mMatrixDepth, 'Matrix stack error - pops don\'t match pushes');
		JS_Assert(aColorDepth == g.mColorVector.length, 'Color stack error - pops don\'t match pushes');

		{
			var $enum3 = ss.IEnumerator.getEnumerator(this.mWidgets);
			while($enum3.moveNext()) {
				var aWidget = $enum3.get_current();
				if(aWidget.mVisible) {
					g.PushTranslate(aWidget.mX, aWidget.mY);
					aWidget.mLastDrawX = g.mMatrix.tx;
					aWidget.mLastDrawY = g.mMatrix.ty;
					aWidget.DrawAll(g);
					g.PopMatrix();
				}
				JS_Assert(aMatrixDepth == g.mMatrixDepth, 'Matrix stack error - pops don\'t match pushes');
				JS_Assert(aColorDepth == g.mColorVector.length, 'Color stack error - pops don\'t match pushes');
			}
		}
	},
	Move : function GameFramework_widgets_ClassicWidget$Move(theX, theY) {
		this.mX = theX;
		this.mY = theY;
	},
	KeyDown : function GameFramework_widgets_ClassicWidget$KeyDown(theKeyCode) {
		var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_DOWN);
		aWidgetEvent.mKeyCode = theKeyCode;
		this.DispatchEvent(aWidgetEvent);
	},
	KeyUp : function GameFramework_widgets_ClassicWidget$KeyUp(theKeyCode) {
		var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_UP);
		aWidgetEvent.mKeyCode = theKeyCode;
		this.DispatchEvent(aWidgetEvent);
	},
	KeyChar : function GameFramework_widgets_ClassicWidget$KeyChar(theChar) {
		var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.KEY_CHAR);
		aWidgetEvent.mKeyChar = theChar;
		this.DispatchEvent(aWidgetEvent);
	},
	MouseEnter : function GameFramework_widgets_ClassicWidget$MouseEnter() {
		var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.MOUSE_ENTER);
		this.DispatchEvent(aWidgetEvent);
	},
	MouseLeave : function GameFramework_widgets_ClassicWidget$MouseLeave() {
		var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.MOUSE_LEAVE);
		this.DispatchEvent(aWidgetEvent);
	},
	FindWidget : function GameFramework_widgets_ClassicWidget$FindWidget(x, y) {
		for(var i = this.mWidgets.length - 1; i >= 0; --i) {
			var aWidget = (this.mWidgets[i]);
			var anOverWidget = aWidget.FindWidget(x - aWidget.mX, y - aWidget.mY);
			if(anOverWidget != null) {
				return anOverWidget;
			}
		}
		if((this.mMouseVisible) && (this.mVisible) && (this.Contains(x, y))) {
			return this;
		}
		return null;
	},
	MouseMove : function GameFramework_widgets_ClassicWidget$MouseMove(x, y) {
		for(var i = this.mWidgets.length - 1; i >= 0; i--) {
			var aWidget = (this.mWidgets[i]);
			if(aWidget.WantsMouseEvent(x - aWidget.mX, y - aWidget.mY)) {
				aWidget.MouseMove(x - aWidget.mX, y - aWidget.mY);
			}
		}
	},
	MouseDown : function GameFramework_widgets_ClassicWidget$MouseDown(x, y) {
		var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.MOUSE_DOWN);
		aWidgetEvent.mX = x;
		aWidgetEvent.mY = y;
		this.DispatchEvent(aWidgetEvent);
		if(this.mIsOver) {
			this.mIsDown = true;
		}
		for(var i = this.mWidgets.length - 1; i >= 0; i--) {
			var aWidget = (this.mWidgets[i]);
			if(aWidget.WantsMouseEvent(x - aWidget.mX, y - aWidget.mY)) {
				aWidget.MouseDown(x - aWidget.mX, y - aWidget.mY);
			}
		}
	},
	MouseClicked : function GameFramework_widgets_ClassicWidget$MouseClicked(x, y) {
		var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.CLICKED);
		aWidgetEvent.mX = x;
		aWidgetEvent.mY = y;
		this.DispatchEvent(aWidgetEvent);
	},
	MouseUp : function GameFramework_widgets_ClassicWidget$MouseUp(x, y) {
		var aWidgetEvent = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.MOUSE_UP);
		aWidgetEvent.mX = x;
		aWidgetEvent.mY = y;
		this.DispatchEvent(aWidgetEvent);
		if(this.mIsOver && this.mIsDown) {
			this.MouseClicked(x, y);
		}
		this.mIsDown = false;
		for(var i = 0; i < this.mWidgets.length; i++) {
			var aWidget = (this.mWidgets[i]);
			if(aWidget.WantsMouseEvent(x - aWidget.mX, y - aWidget.mY)) {
				aWidget.MouseUp(x - aWidget.mX, y - aWidget.mY);
			}
		}
	},
	Pause : function GameFramework_widgets_ClassicWidget$Pause() {
	},
	Contains : function GameFramework_widgets_ClassicWidget$Contains(x, y) {
		return ((this.mWidth != 0) && (x >= 0) && (y >= 0) && (x < this.mWidth) && (y < this.mHeight));
	},
	WantsMouseEvent : function GameFramework_widgets_ClassicWidget$WantsMouseEvent(x, y) {
		if(this.mIsDown || this.mIsOver) {
			return true;
		}

		{
			var $enum4 = ss.IEnumerator.getEnumerator(this.mWidgets);
			while($enum4.moveNext()) {
				var aWidget = $enum4.get_current();
				if(aWidget.WantsMouseEvent(x - aWidget.mX, y - aWidget.mY)) {
					return true;
				}
			}
		}
		return false;
	}
}
GameFramework.widgets.ClassicWidget.staticInit = function GameFramework_widgets_ClassicWidget$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.widgets.ClassicWidget.registerClass('GameFramework.widgets.ClassicWidget', GameFramework.events.EventDispatcher);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.widgets.ClassicWidget.staticInit();
});