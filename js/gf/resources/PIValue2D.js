GameFramework.resources.PIValue2D = function GameFramework_resources_PIValue2D() {
}
GameFramework.resources.PIValue2D.prototype = {
	mValuePoint2DVector : null,
	mBezier : null,
	mLastTime : -1,
	mLastPoint : null,
	mLastVelocityTime : 0,
	mLastVelocity : null,
	Dispose : function GameFramework_resources_PIValue2D$Dispose() {
	},
	GetValueAt : function GameFramework_resources_PIValue2D$GetValueAt(theTime) {
		if(this.mLastTime == theTime) {
			return this.mLastPoint;
		}
		this.mLastTime = theTime;
		if(this.mValuePoint2DVector.length == 1) {
			return this.mLastPoint = this.mValuePoint2DVector[0].mValue;
		}
		if(this.mBezier != null) {
			this.mLastPoint = this.mBezier.Evaluate(theTime);
			return this.mLastPoint;
		}
		for(var i = 1; i < (this.mValuePoint2DVector.length | 0); i++) {
			var aP1 = this.mValuePoint2DVector[i - 1];
			var aP2 = this.mValuePoint2DVector[i];
			if(((theTime >= aP1.mTime) && (theTime <= aP2.mTime)) || (i == (this.mValuePoint2DVector.length | 0) - 1)) {
				this.mLastPoint = GameFramework.geom.TPoint.interpolate(aP2.mValue, aP1.mValue, Math.min(1.0, (theTime - aP1.mTime) / (aP2.mTime - aP1.mTime)));
				return this.mLastPoint;
			}
		}
		return this.mLastPoint = new GameFramework.geom.TPoint(0, 0);
	},
	GetVelocityAt : function GameFramework_resources_PIValue2D$GetVelocityAt(theTime) {
		if(this.mLastVelocityTime == theTime) {
			return this.mLastVelocity;
		}
		this.mLastVelocityTime = theTime;
		if(this.mValuePoint2DVector.length <= 1) {
			return new GameFramework.geom.TPoint(0, 0);
		}
		if(this.mBezier != null) {
			return this.mLastVelocity = this.mBezier.Velocity(theTime, false);
		}
		for(var i = 1; i < (this.mValuePoint2DVector.length | 0); i++) {
			var aP1 = this.mValuePoint2DVector[i - 1];
			var aP2 = this.mValuePoint2DVector[i];
			if(((theTime >= aP1.mTime) && (theTime <= aP2.mTime)) || (i == (this.mValuePoint2DVector.length | 0) - 1)) {
				return this.mLastVelocity = aP2.mValue.subtract(aP1.mValue);
			}
		}
		return this.mLastVelocity = new GameFramework.geom.TPoint(0, 0);
	}
}
GameFramework.resources.PIValue2D.staticInit = function GameFramework_resources_PIValue2D$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIValue2D.registerClass('GameFramework.resources.PIValue2D', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PIValue2D.staticInit();
});