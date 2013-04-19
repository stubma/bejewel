Game.SpeedCollectEffect = function Game_SpeedCollectEffect(theSpeedBoard, theSrc, theTgt, theTimeCollected, theTimeMod) {
	this.mSpline = new GameFramework.misc.BSpline();
	this.mSplineInterp = new GameFramework.CurvedVal();
	this.mAlphaOut = new GameFramework.CurvedVal();
	this.mScaleCv = new GameFramework.CurvedVal();
	this.mStartPoint = new GameFramework.geom.TIntPoint();
	this.mTargetPoint = new GameFramework.geom.TIntPoint();
	this.mLastPoint = new GameFramework.geom.TIntPoint();
	Game.SpeedCollectEffect.initializeBase(this, [Game.Effect.EFxType.CUSTOMCLASS]);
	this.mTimeCollected = theTimeCollected;
	this.mBoard = theSpeedBoard;
	this.mX = theSrc.x;
	this.mY = theSrc.y;
	this.mLastPoint = new GameFramework.geom.TIntPoint(theSrc.x, theSrc.y);
	this.mDAlpha = 0;
	this.mUpdateCnt = 0;
	this.mStartPoint = new GameFramework.geom.TIntPoint(theSrc.x, theSrc.y);
	this.mTargetPoint = new GameFramework.geom.TIntPoint(theTgt.x, theTgt.y);
	this.mLastRotation = 0.0;
	this.mCentering = false;
	this.mTimeMod = theTimeMod;
	this.mSparkles = null;
	this.mTimeBonusEffect = null;
}
Game.SpeedCollectEffect.prototype = {
	mSpline : null,
	mSplineInterp : null,
	mAlphaOut : null,
	mScaleCv : null,
	mSparkles : null,
	mTimeBonusEffect : null,
	mUpdateCnt : 0,
	mAccel : 0,
	mBoard : null,
	mCentering : null,
	mStartPoint : null,
	mTargetPoint : null,
	mLastPoint : null,
	mLastRotation : 0,
	mTimeMod : 0,
	mTimeCollected : 0,
	Dispose : function Game_SpeedCollectEffect$Dispose() {
		if(this.mSparkles != null) {
			this.mSparkles.mDeleteMe = true;
			this.mSparkles.mRefCount--;
		}
		this.mSparkles = null;
		if(this.mTimeBonusEffect != null) {
			this.mTimeBonusEffect.mDeleteMe = true;
			this.mTimeBonusEffect.mRefCount--;
		}
		this.mTimeBonusEffect = null;
	},
	Init : function Game_SpeedCollectEffect$Init(thePiece) {
		this.mSplineInterp.mAppUpdateCountSrc = this.mFXManager;
		this.mScaleCv.mAppUpdateCountSrc = this.mFXManager;
		this.mSplineInterp.SetCurve('b-0,1,0.016667,2,####   R0+vy      N~TJe');
		this.mSplineInterp.SetInRange(0.0, this.mSplineInterp.mInMax * this.mTimeMod);
		this.mAlphaOut.SetCurve('b-0,1,0,1,~###      H~###   X####');
		this.mAlphaOut.mIncRate = this.mSplineInterp.mIncRate;
		this.mAlphaOut.mInMax = this.mSplineInterp.mInMax + 0.0;
		this.mScaleCv.SetConstant(1.0);
		this.mSpline.AddPoint(this.mX, this.mY);
		this.mSpline.AddPoint(520, 150);
		this.mSpline.AddPoint(this.mTargetPoint.x, this.mTargetPoint.y);
		this.mSpline.CalculateSpline(false);
		this.mSparkles = new Game.ParticleEffect(Game.Resources['PIEFFECT_QUEST_DIG_COLLECT_GOLD']);
		this.mSparkles.SetEmitAfterTimeline(true);
		this.mSparkles.mDoDrawTransform = false;
		this.mSparkles.mRefCount++;
		this.mFXManager.AddEffect(this.mSparkles);
		var fxArr = this.mFXManager.mBoard.mPostFXManager.mEffects[(Game.Effect.EFxType.TIME_BONUS | 0)];
		for(var i = 0; i < fxArr.length; ++i) {
			var anEffect = fxArr[(i | 0)];
			if(anEffect.mPieceIdRel == thePiece.mId) {
				this.mTimeBonusEffect = anEffect;
				this.mTimeBonusEffect.mLightIntensity = 6.0;
				this.mTimeBonusEffect.mLightSize = 300.0;
				this.mTimeBonusEffect.mValue = Array.Create(2, null);
				this.mTimeBonusEffect.mValue[0] = 50.0;
				this.mTimeBonusEffect.mValue[1] = -0.0005;
				this.mTimeBonusEffect.mRefCount++;
				this.mTimeBonusEffect.mPieceIdRel = -1;
				this.mTimeBonusEffect.mOverlay = true;
				this.mTimeBonusEffect.mCirclePct.SetCurve('b+0,1,0.04,1,####         ~~###');
				this.mTimeBonusEffect.mRadiusScale.SetCurve('b+0.65,1,0.02,1,~n%T         ~#?j,');
				break;
			}
		}
	},
	CalcRotation : function Game_SpeedCollectEffect$CalcRotation() {
		if(this.mCentering) {
			return 0.0;
		}
		if(!this.mSplineInterp.HasBeenTriggered()) {
			var rotation = Math.atan2(this.mLastPoint.y - this.mY, this.mX - this.mLastPoint.x);
			var deltaRotation = rotation - this.mLastRotation;
			deltaRotation = (deltaRotation < 0.0 ? -1.0 : 1.0) * Math.min(0.03, Math.abs(deltaRotation));
			this.mLastRotation += deltaRotation;
			this.mLastPoint.x = (this.mX | 0);
			this.mLastPoint.y = (this.mY | 0);
		}
		return this.mLastRotation;
	},
	Update : function Game_SpeedCollectEffect$Update() {
		Game.Effect.prototype.Update.apply(this);
		++this.mUpdateCnt;
		if(this.mCentering) {
			this.mX = this.mStartPoint.x + this.mSplineInterp.GetOutVal() * (this.mFXManager.mBoard.GetBoardCenterX() - this.mStartPoint.x);
			this.mY = this.mStartPoint.y + this.mSplineInterp.GetOutVal() * (this.mFXManager.mBoard.GetBoardCenterY() - this.mStartPoint.y);
			if(!this.mSplineInterp.IncInVal()) {
				Game.SoundUtil.Play(Game.Resources['SOUND_QUEST_GET']);
				this.mSplineInterp.SetCurve('b-0,1,0.01,2,####  `D2UB       A~###');
				this.mSplineInterp.SetInRange(0.0, this.mSplineInterp.mInMax * this.mTimeMod);
				this.mCentering = false;
				this.mSpline.AddPoint(this.mX, this.mY);
				this.mSpline.AddPoint(800, 150);
				this.mSpline.AddPoint(600, 175);
				this.mSpline.AddPoint(400, 150);
				this.mSpline.AddPoint(200, 300);
				this.mSpline.AddPoint(this.mTargetPoint.x, this.mTargetPoint.y);
				this.mSpline.CalculateSpline(false);
				this.mScaleCv.SetCurve('b;1,3,0.01,1,~###  q####       0####');
				this.mScaleCv.SetInRange(0.0, this.mScaleCv.mInMax * this.mTimeMod);
			}
		} else {
			this.mX = this.mSpline.GetXPoint(this.mSplineInterp.GetOutVal() * this.mSpline.GetMaxT());
			this.mY = this.mSpline.GetYPoint(this.mSplineInterp.GetOutVal() * this.mSpline.GetMaxT());
		}
		if(this.mSparkles != null) {
			this.mSparkles.mX = this.mX + -30;
			this.mSparkles.mY = this.mY + -20;
		}
		if(this.mTimeBonusEffect != null) {
			this.mTimeBonusEffect.mX = this.mX;
			this.mTimeBonusEffect.mY = this.mY;
		}
		this.mScaleCv.IncInVal();
		if(this.mCentering) {
			return;
		}
		if(!this.mSplineInterp.IncInVal()) {
		}
		if(this.mAlphaOut.IsDoingCurve()) {
			if(this.mAlphaOut.CheckUpdatesFromEndThreshold(10)) {
				this.mBoard.TimeCollected(this.mTimeCollected);
			}
			if(!this.mAlphaOut.IncInVal()) {
				this.mDeleteMe = true;
			}
			if(this.mSparkles != null) {
				this.mSparkles.mAlpha = this.mAlphaOut.GetOutVal();
			}
			if(this.mTimeBonusEffect != null) {
				this.mTimeBonusEffect.mAlpha = this.mAlphaOut.GetOutVal();
			}
		}
	},
	Draw : function Game_SpeedCollectEffect$Draw(g) {
	},
	WantExpandedTopWidget : function Game_SpeedCollectEffect$WantExpandedTopWidget() {
		return 1;
	}
}
Game.SpeedCollectEffect.staticInit = function Game_SpeedCollectEffect$staticInit() {
}

JSFExt_AddInitFunc(function() {
	Game.SpeedCollectEffect.registerClass('Game.SpeedCollectEffect', Game.Effect);
});
JSFExt_AddStaticInitFunc(function() {
	Game.SpeedCollectEffect.staticInit();
});