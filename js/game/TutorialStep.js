Game.TutorialStep = function Game_TutorialStep() {
	this.mType = Game.TutorialStep.EType.ModalDialogOkBtnClear;
	this.mArrowShowPct = GameFramework.CurvedVal.CreateAsConstant(0.0);
	this.mUiAccessibleGems = [];
	this.mHighlightShowPct = GameFramework.CurvedVal.CreateAsConstant(0.0);
	this.mHighlightRect = null;
	this.mDialogInsets = null;
	this.mShowOkBtnCv = null;
	this.mAutohintPieceLoc = null;
	this.mArrowDir = Game.TutorialStep.EArrowDir.None;
	this.mTutorialId = Game.DM.ETutorial._COUNT;
	this.mBlockTimer = Game.TutorialStep.EBlockTimerType.None;
	this.mState = Game.TutorialStep.EState.Init;
	this.mSpecialBehavior = Game.TutorialStep.ESpecialBehavior.None;
	this.mHintDlg = null;
}
Game.TutorialStep.AddGemGridXYToRect = function Game_TutorialStep$AddGemGridXYToRect(theBoard, theRect, theCol, theRow, theHighlightRectGemPadding) {
	if(theHighlightRectGemPadding === undefined) {
		theHighlightRectGemPadding = 0.0;
	}
	var gemRect = new GameFramework.TRect(theBoard.GetColScreenX(theCol) - theHighlightRectGemPadding, theBoard.GetRowScreenY(theRow) - theHighlightRectGemPadding, Game.Board.GEM_WIDTH + theHighlightRectGemPadding * 2.0, Game.Board.GEM_HEIGHT + theHighlightRectGemPadding * 2.0);
	if(theRect == null || theRect.mWidth == 0 || theRect.mHeight == 0) {
		return gemRect;
	}
	return theRect.Union(gemRect);
}
Game.TutorialStep.prototype = {
	mSequence : null,
	mTextHeader : '',
	mText : '',
	mType : null,
	mArrowShowPct : null,
	mUiAccessibleGems : null,
	mLimitUiAccessibleGems : true,
	mHighlightShowPct : null,
	mHighlightRect : null,
	mDialogWidth : 0.0,
	mDialogHeight : 0.0,
	mDialogAnchorX : 0.0,
	mDialogAnchorY : 0.0,
	mDialogInsets : null,
	mDialogSpaceAfterHeader : 0,
	mWantDrawFxOnTop : false,
	mShowOkBtnCv : null,
	mAllowStandardHints : false,
	mAutohintPieceLoc : null,
	mAutohintTime : -1,
	mArrowDir : null,
	mTutorialId : null,
	mArrowX : -1.0,
	mArrowY : -1.0,
	mDelay : 0,
	mBlockDuringDelay : false,
	mBlockTimer : null,
	mBlockTimerParam : 0,
	mBlockTimerParam2 : 0,
	mHighlightRectGemPadding : 10.0,
	mState : null,
	mSpecialBehavior : null,
	mHintDlg : null,
	mUpdateCnt : 0,
	mFinishCountdown : 0,
	Finish : function Game_TutorialStep$Finish() {
		if(this.mSpecialBehavior == Game.TutorialStep.ESpecialBehavior.TimeGem && this.mState != Game.TutorialStep.EState.Finishing) {
			this.mFinishCountdown = ((60.0 * 2.5) | 0);
			this.mState = Game.TutorialStep.EState.Finishing;
		} else {
			this.mState = Game.TutorialStep.EState.Finished;
		}
	},
	WasFinished : function Game_TutorialStep$WasFinished() {
		return this.mState == Game.TutorialStep.EState.Finished;
	},
	Kill : function Game_TutorialStep$Kill(theDoFadeOut) {
		if(this.mHintDlg != null) {
			this.mHintDlg.Kill();
		}
		this.mArrowShowPct.SetCurveRef('TutorialMgr_cs_11_14_11__19_18_09_946');
		if(theDoFadeOut) {
			this.mHighlightShowPct.SetCurveRef('TutorialMgr_cs_11_14_11__19_05_53_409');
		} else {
			this.mHighlightShowPct.SetConstant(0.0);
		}
	},
	Update : function Game_TutorialStep$Update() {
		if(this.mShowOkBtnCv != null) {
			this.mShowOkBtnCv.IncInVal();
			if(this.mHintDlg != null) {
				this.mHintDlg.mShowBtnPct = this.mShowOkBtnCv.get_v();
			}
		}
		if(this.mState == Game.TutorialStep.EState.Init) {
			if(this.mDelay > 0) {
				--this.mDelay;
			} else {
				this.Start();
			}
		} else {
			++this.mUpdateCnt;
		}
		if(this.mState != Game.TutorialStep.EState.Finished && this.mFinishCountdown > 0) {
			--this.mFinishCountdown;
			if(this.mFinishCountdown == 0) {
				this.Finish();
			}
		}
	},
	Draw : function Game_TutorialStep$Draw(g) {
		if(this.mHintDlg != null) {
			this.mHintDlg.Move(this.mDialogAnchorX, this.mDialogAnchorY);
		}
		var _t1 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(Math.min(1.0, this.mHighlightShowPct.get_v())));
		try {
			if(this.mHighlightRect != null) {
				if(this.mSpecialBehavior == Game.TutorialStep.ESpecialBehavior.HintBtn) {
					Game.TutorialMgr.DrawHighlightCircle(g, this.mHighlightRect);
				} else {
					if(this.mSpecialBehavior == Game.TutorialStep.ESpecialBehavior.MultiplierUp) {
						var sepX = 450.0;
						Game.TutorialMgr.DrawHighlightBox(g, new GameFramework.TRect(62.0, 240.0, 360.0, 500.0), new GameFramework.TRect(0, 0, sepX, GameFramework.BaseApp.mApp.mHeight));
						Game.TutorialMgr.DrawHighlightBox(g, this.mHighlightRect, new GameFramework.TRect(sepX, 0, GameFramework.BaseApp.mApp.mWidth - sepX, GameFramework.BaseApp.mApp.mHeight));
					} else if(this.mSpecialBehavior == Game.TutorialStep.ESpecialBehavior.TimeGem && (this.mState == Game.TutorialStep.EState.Finishing || this.mState == Game.TutorialStep.EState.Finished)) {
						var sepX_2 = 450.0;
						Game.TutorialMgr.DrawHighlightBox(g, new GameFramework.TRect(62.0, 240.0, 360.0, 500.0), new GameFramework.TRect(0, 0, sepX_2, GameFramework.BaseApp.mApp.mHeight));
						Game.TutorialMgr.DrawHighlightBox(g, this.mHighlightRect, new GameFramework.TRect(sepX_2, 0, GameFramework.BaseApp.mApp.mWidth - sepX_2, GameFramework.BaseApp.mApp.mHeight));
					} else {
						Game.TutorialMgr.DrawHighlightBox(g, this.mHighlightRect);
					}
				}
			}
		} finally {
			_t1.Dispose();
		}
		var _t2 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mArrowShowPct.get_v()));
		try {
			if(this.mArrowDir != Game.TutorialStep.EArrowDir.None) {
				var rotation = 0.0;
				var extraDist = 50.0 + (Math.sin(this.mUpdateCnt / 10.0) / 2.0 + 0.5) * 50.0;
				var extraX = 0.0;
				var extraY = 0.0;
				var arrRes = Game.Resources['IMAGE_BOARD_HIGHLIGHT_ARROW'];
				if(this.mSpecialBehavior == Game.TutorialStep.ESpecialBehavior.Timer) {
					extraX -= (this.mSequence.mMgr.mBoard.mGameTicks - 120.0) * 0.25;
				}
				switch(this.mArrowDir) {
					case Game.TutorialStep.EArrowDir.Down:
					{
						rotation = Math.PI / 2.0;
						extraY += -extraDist;
						break;
					}
					case Game.TutorialStep.EArrowDir.Up:
					{
						rotation = -Math.PI / 2.0;
						extraY += extraDist;
						break;
					}
					case Game.TutorialStep.EArrowDir.Left:
					{
						rotation = Math.PI;
						extraX += extraDist;
						break;
					}
					default:
					{
						rotation = 0.0;
						extraX += -extraDist;
						break;
					}
				}
				var m = new GameFramework.geom.Matrix();
				m.translate(-this.mArrowX - arrRes.mWidth / 2.0, -this.mArrowY);
				m.rotate(rotation);
				m.translate(this.mArrowX + extraX, this.mArrowY + extraY);
				g.PushMatrix(m);
				g.DrawImage(arrRes.get_CenteredImage(), this.mArrowX, this.mArrowY);
				g.PopMatrix();
			}
		} finally {
			_t2.Dispose();
		}
	},
	Start : function Game_TutorialStep$Start() {
		this.mState = Game.TutorialStep.EState.Started;
		var aBoard = this.mSequence.mMgr.mBoard;
		if(this.mAutohintPieceLoc != null) {
			var aPiece = aBoard.GetPieceAtColRow(this.mAutohintPieceLoc.x, this.mAutohintPieceLoc.y);
			if(aPiece != null) {
				aBoard.mAutohintOverridePieceId = aPiece.mId;
				aBoard.mAutohintOverrideTime = this.mAutohintTime;
			}
		} else {
			aBoard.mAutohintOverridePieceId = -1;
			aBoard.mAutohintOverrideTime = -1;
		}
		if(this.mHighlightShowPct.get_v() == 0.0) {
			this.mHighlightShowPct.SetCurveRef('TutorialMgr_cs_11_11_11__15_19_51_707');
		}
		this.mArrowShowPct.SetCurveRef('TutorialMgr_cs_11_11_11__15_19_51_707');
		if(this.mHintDlg != null) {
			this.mHintDlg.Kill();
		}
		if(this.mType == Game.TutorialStep.EType.ModalDialogOkBtnClear) {
			this.mHintDlg = new Game.HintDialog(this.mTextHeader, this.mText, true, false);
			this.mHintDlg.mWantsDarken = false;
		} else if(this.mType == Game.TutorialStep.EType.ModalDialogMoveClear || this.mType == Game.TutorialStep.EType.ModalDialog) {
			this.mHintDlg = new Game.HintDialog(this.mTextHeader, this.mText, true, false);
			this.mHintDlg.mWantsDarken = false;
			this.mHintDlg.mShowBtnPct = 0.0;
		}
		Game.BejApp.mBejApp.mDialogMgr.AddDialog(this.mHintDlg);
		this.mHintDlg.AddEventListener(GameFramework.widgets.DialogEvent.CLOSED, ss.Delegate.create(this, this.handleHintDialogClosed));
		this.mHintDlg.mFlushPriority = 1;
		if(this.mDialogWidth != 0.0 || this.mDialogHeight != 0.0) {
			if(this.mDialogInsets != null) {
				this.mHintDlg.mContentInsets = this.mDialogInsets;
			}
			if(this.mDialogSpaceAfterHeader != 0) {
				this.mHintDlg.mSpaceAfterHeader = this.mDialogSpaceAfterHeader;
			}
			this.mHintDlg.Resize(this.mHintDlg.mX, this.mHintDlg.mY, this.mDialogWidth != 0.0 ? this.mDialogWidth : this.mHintDlg.mWidth, this.mDialogHeight != 0.0 ? this.mDialogHeight : this.mHintDlg.mHeight);
			this.mHintDlg.mFullHeight = this.mHintDlg.mHeight;
		}
		this.mHintDlg.Move(this.mDialogAnchorX, this.mDialogAnchorY);
	},
	handleHintDialogClosed : function Game_TutorialStep$handleHintDialogClosed(e) {
		this.mState = Game.TutorialStep.EState.Finished;
		if(this.mHintDlg != null && this.mHintDlg.mNoHintsCheckbox.IsChecked()) {
			this.mSequence.mMgr.SetTutorialEnabled(false);
			if(this.mTutorialId != Game.DM.ETutorial._COUNT) {
				Game.BejApp.mBejApp.mBoard.SetTutorialCleared(this.mTutorialId);
			}
		}
	},
	PointArrowAt : function Game_TutorialStep$PointArrowAt(theBoard, theCol, theRow, theArrowDir) {
		var gemRect = new GameFramework.TRect(theBoard.GetColScreenX(theCol), theBoard.GetRowScreenY(theRow), Game.Board.GEM_WIDTH, Game.Board.GEM_HEIGHT);
		this.mArrowDir = theArrowDir;
		this.mArrowX = gemRect.mX + gemRect.mWidth / 2;
		this.mArrowY = gemRect.mY + gemRect.mHeight / 2;
	},
	AddGemGridXY : function Game_TutorialStep$AddGemGridXY(theBoard, theCol, theRow, theIsUISelectable, theAddToHighlightRect) {
		if(theIsUISelectable === undefined) {
			theIsUISelectable = true;
		}
		if(theAddToHighlightRect === undefined) {
			theAddToHighlightRect = true;
		}
		var newPt = new GameFramework.geom.TIntPoint(theCol, theRow);
		if(theIsUISelectable) {
			this.mUiAccessibleGems.push(newPt);
		}
		if(theAddToHighlightRect) {
			this.mHighlightRect = Game.TutorialStep.AddGemGridXYToRect(theBoard, this.mHighlightRect, theCol, theRow, this.mHighlightRectGemPadding);
		}
	}
}
Game.TutorialStep.staticInit = function Game_TutorialStep$staticInit() {
}

JSFExt_AddInitFunc(function() {
	Game.TutorialStep.registerClass('Game.TutorialStep', null);
});
JSFExt_AddStaticInitFunc(function() {
	Game.TutorialStep.staticInit();
});
Game.TutorialStep.EType = {};
Game.TutorialStep.EType.staticInit = function Game_TutorialStep_EType$staticInit() {
	Game.TutorialStep.EType.ModalDialogOkBtnClear = 0;
	Game.TutorialStep.EType.ModalDialogMoveClear = 1;
	Game.TutorialStep.EType.ModalDialog = 2;
}
JSFExt_AddInitFunc(function() {
	Game.TutorialStep.EType.staticInit();
});
Game.TutorialStep.EArrowDir = {};
Game.TutorialStep.EArrowDir.staticInit = function Game_TutorialStep_EArrowDir$staticInit() {
	Game.TutorialStep.EArrowDir.None = -1;
	Game.TutorialStep.EArrowDir.Left = 0;
	Game.TutorialStep.EArrowDir.Right = 1;
	Game.TutorialStep.EArrowDir.Up = 2;
	Game.TutorialStep.EArrowDir.Down = 3;
}
JSFExt_AddInitFunc(function() {
	Game.TutorialStep.EArrowDir.staticInit();
});
Game.TutorialStep.EState = {};
Game.TutorialStep.EState.staticInit = function Game_TutorialStep_EState$staticInit() {
	Game.TutorialStep.EState.Init = 0;
	Game.TutorialStep.EState.Started = 1;
	Game.TutorialStep.EState.Finishing = 2;
	Game.TutorialStep.EState.Finished = 3;
}
JSFExt_AddInitFunc(function() {
	Game.TutorialStep.EState.staticInit();
});
Game.TutorialStep.ESpecialBehavior = {};
Game.TutorialStep.ESpecialBehavior.staticInit = function Game_TutorialStep_ESpecialBehavior$staticInit() {
	Game.TutorialStep.ESpecialBehavior.None = 0;
	Game.TutorialStep.ESpecialBehavior.HintBtn = 1;
	Game.TutorialStep.ESpecialBehavior.Timer = 2;
	Game.TutorialStep.ESpecialBehavior.TimeGem = 3;
	Game.TutorialStep.ESpecialBehavior.MultiplierUp = 4;
}
JSFExt_AddInitFunc(function() {
	Game.TutorialStep.ESpecialBehavior.staticInit();
});
Game.TutorialStep.EBlockTimerType = {};
Game.TutorialStep.EBlockTimerType.staticInit = function Game_TutorialStep_EBlockTimerType$staticInit() {
	Game.TutorialStep.EBlockTimerType.None = 0;
	Game.TutorialStep.EBlockTimerType.Pause = 1;
	Game.TutorialStep.EBlockTimerType.PauseAfterParam = 2;
	Game.TutorialStep.EBlockTimerType.PauseUntilParam = 3;
	Game.TutorialStep.EBlockTimerType.PlayBetweenParams = 4;
	Game.TutorialStep.EBlockTimerType.PauseBetweenParams = 5;
}
JSFExt_AddInitFunc(function() {
	Game.TutorialStep.EBlockTimerType.staticInit();
});