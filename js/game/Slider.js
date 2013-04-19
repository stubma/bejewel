Game.Slider = function Game_Slider(theTrackImage, theThumbImage) {
	if(theTrackImage === undefined) {
		theTrackImage = null;
	}
	if(theThumbImage === undefined) {
		theThumbImage = null;
	}
	this.mStepSound = null;
	Game.Slider.initializeBase(this);
	this.mTrackImage = theTrackImage;
	this.mThumbImage = theThumbImage;
	if(this.mTrackImage != null) {
		this.mWidth = this.mTrackImage.mWidth;
		this.mHeight = this.mTrackImage.mHeight;
	} else {
		this.mWidth = 30.0;
		this.mHeight = 10.0;
	}
}
Game.Slider.prototype = {
	mVal : 0.0,
	mTrackImage : null,
	mThumbImage : null,
	mDragging : false,
	mRelX : 0.0,
	mRelY : 0.0,
	mHorizontal : true,
	mSlidingLeft : false,
	mSlidingRight : false,
	mStepMode : false,
	mNumSteps : 1,
	mCurStep : 0,
	mStepSound : null,
	mOutlineColor : GameFramework.gfx.Color.WHITE_RGB,
	mBkgColor : GameFramework.gfx.Color.RGBToInt(80, 80, 80),
	mSliderColor : GameFramework.gfx.Color.WHITE_RGB,
	mKnobSize : 5,
	SetValue : function Game_Slider$SetValue(theValue) {
		var oldval = this.mVal;
		this.mVal = theValue;
		if(this.mVal < 0.0) {
			this.mVal = 0.0;
		} else if(this.mVal > 1.0) {
			this.mVal = 1.0;
		}
		if(this.mVal != oldval) {
			var e = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.SLIDER_CHANGED);
			this.DispatchEvent(e);
		}
	},
	SetStepMode : function Game_Slider$SetStepMode(num_steps, cur_step, step_sound) {
		if(step_sound === undefined) {
			step_sound = null;
		}
		this.mStepMode = true;
		this.mNumSteps = num_steps;
		this.SetStepValue(cur_step);
		this.mStepSound = step_sound;
	},
	SetStepValue : function Game_Slider$SetStepValue(cur_step) {
		if(cur_step < 0) {
			cur_step = 0;
		}
		if(cur_step > this.mNumSteps) {
			cur_step = this.mNumSteps;
		}
		if(this.mCurStep != cur_step) {
			this.mCurStep = cur_step;
			this.SetValue(cur_step / this.mNumSteps);
			if(this.mStepSound != null) {
				GameFramework.BaseApp.mApp.PlaySound(this.mStepSound);
			}
		}
	},
	Update : function Game_Slider$Update() {
		GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
		this.mSlidingLeft = false;
		this.mSlidingRight = false;
	},
	HasTransparencies : function Game_Slider$HasTransparencies() {
		return true;
	},
	Draw : function Game_Slider$Draw(g) {
		if(this.mTrackImage != null) {
			if(this.mHorizontal) {
				g.DrawButton(this.mTrackImage, 0, (this.mHeight - this.mTrackImage.mHeight) / 2, this.mWidth, 0);
			} else {
			}
		} else if(this.mTrackImage == null) {
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
		}
		if(this.mHorizontal && (this.mThumbImage != null)) {
			g.DrawImage(this.mThumbImage, ((this.mVal * (this.mWidth - this.mThumbImage.mWidth)) | 0), (this.mHeight - this.mThumbImage.mHeight) / 2);
		} else if(!this.mHorizontal && (this.mThumbImage != null)) {
			g.DrawImage(this.mThumbImage, (this.mWidth - this.mThumbImage.mWidth) / 2, ((this.mVal * (this.mHeight - this.mThumbImage.mHeight)) | 0));
		} else if(this.mThumbImage == null) {
			g.SetColor(this.mSliderColor);
			if(this.mHorizontal) {
				g.FillRect(((this.mVal * (this.mWidth - this.mKnobSize)) | 0), 0, this.mKnobSize, this.mHeight);
			} else {
				g.FillRect(0, ((this.mVal * (this.mHeight - this.mKnobSize)) | 0), this.mWidth, this.mKnobSize);
			}
		}
	},
	MouseMove : function Game_Slider$MouseMove(x, y) {
		if(this.mHorizontal) {
			var knobWidth = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mWidth;
			var aThumbX = ((this.mVal * (this.mWidth - knobWidth)) | 0);
		} else {
			var knobHeight = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mHeight;
			var aThumbY = ((this.mVal * (this.mHeight - knobHeight)) | 0);
		}
		if(this.mIsDown) {
			this.MouseDrag(x, y);
		}
	},
	MouseDown : function Game_Slider$MouseDown(x, y) {
		if(this.mHorizontal) {
			var knobWidth = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mWidth;
			var aThumbX = (this.mVal * (this.mWidth - knobWidth));
			if((x >= aThumbX) && (x < aThumbX + knobWidth)) {
				this.mDragging = true;
				this.mRelX = x - aThumbX;
			} else {
				var pos = (x - knobWidth / 2) / (this.mWidth - knobWidth);
				if(pos < 0.0) {
					pos = 0.0;
				}
				if(pos > 1.0) {
					pos = 1.0;
				}
				this.SetValue(pos);
				this.mDragging = true;
				this.mRelX = knobWidth / 2.0;
			}
		} else {
			var knobHeight = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mHeight;
			var aThumbY = ((this.mVal * (this.mHeight - knobHeight)) | 0);
			if((y >= aThumbY) && (y < aThumbY + knobHeight)) {
				this.mDragging = true;
				this.mRelY = y - aThumbY;
			} else {
				var pos_2 = y / this.mHeight;
				this.SetValue(pos_2);
			}
		}
		GameFramework.widgets.ClassicWidget.prototype.MouseDown.apply(this, [x, y]);
	},
	MouseDrag : function Game_Slider$MouseDrag(x, y) {
		if(this.mDragging) {
			var anOldVal = this.mVal;
			if(this.mHorizontal) {
				var knobWidth = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mWidth;
				this.mVal = (x - this.mRelX) / (this.mWidth - knobWidth);
			} else {
				var knobHeight = this.mThumbImage == null ? this.mKnobSize : this.mThumbImage.mHeight;
				this.mVal = (y - this.mRelY) / (this.mHeight - knobHeight);
			}
			if(this.mVal < 0.0) {
				this.mVal = 0.0;
			}
			if(this.mVal > 1.0) {
				this.mVal = 1.0;
			}
			if(this.mVal != anOldVal) {
				var e = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.SLIDER_CHANGED);
				this.DispatchEvent(e);
			}
		}
	},
	MouseUp : function Game_Slider$MouseUp(x, y) {
		this.mDragging = false;
		var e = new GameFramework.widgets.WidgetEvent(GameFramework.widgets.WidgetEvent.SLIDER_CHANGED);
		this.DispatchEvent(e);
		GameFramework.widgets.ClassicWidget.prototype.MouseUp.apply(this, [x, y]);
	},
	MouseLeave : function Game_Slider$MouseLeave() {
		GameFramework.widgets.ClassicWidget.prototype.MouseLeave.apply(this);
	}
}
Game.Slider.staticInit = function Game_Slider$staticInit() {
}

JSFExt_AddInitFunc(function() {
	Game.Slider.registerClass('Game.Slider', GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function() {
	Game.Slider.staticInit();
});