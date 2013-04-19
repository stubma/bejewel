GameFramework.resources.PIValue = function GameFramework_resources_PIValue() {
}
GameFramework.resources.PIValue.prototype = {
	mQuantTable : null,
	mValuePointVector : null,
	mBezier : null,
	mLastTime : -1.0,
	mLastValue : 0,
	mLastCurveT : 0.0,
	mLastCurveTDelta : 0.01,
	Dispose : function GameFramework_resources_PIValue$Dispose() {
	},
	QuantizeCurve : function GameFramework_resources_PIValue$QuantizeCurve() {
		var aMinTime = this.mValuePointVector[0].mTime;
		var aMaxTime = this.mValuePointVector[this.mValuePointVector.length - 1].mTime;
		this.mQuantTable = [];
		this.mQuantTable.length = GameFramework.resources.PIValue.PI_QUANT_SIZE;
		var first = true;
		var aLastGX = 0;
		var aLastX = 0;
		var aLastY = 0;
		var aCurT = aMinTime;
		var aTIncr = (aMaxTime - aMinTime) / GameFramework.resources.PIValue.PI_QUANT_SIZE / 2.0;
		var aPointIdx = 0;
		for(; ;) {
			var aFoundPoint = this.mBezier.Evaluate(aCurT);
			var aGX = (((((aFoundPoint.x) - aMinTime) / (aMaxTime - aMinTime) * (GameFramework.resources.PIValue.PI_QUANT_SIZE - 1) + 0.5)) | 0);
			var done = false;
			while(aFoundPoint.x >= this.mValuePointVector[aPointIdx + 1].mTime) {
				aPointIdx++;
				if(aPointIdx >= (this.mValuePointVector.length | 0) - 1) {
					done = true;
					break;
				}
			}
			if(done) {
				break;
			}
			if(aFoundPoint.x >= this.mValuePointVector[aPointIdx].mTime) {
				if((!first) && (aGX > aLastGX + 1)) {
					for(var aX = aLastGX; aX <= aGX; aX++) {
						var aDist = (aX - aLastGX) / (aGX - aLastGX);
						var aVal = aDist * aFoundPoint.y + (1.0 - aDist) * aLastY;
						this.mQuantTable[aX] = aVal;
					}
				} else {
					var aVal_2 = aFoundPoint.y;
					this.mQuantTable[aGX] = aVal_2;
				}
				aLastGX = aGX;
				aLastX = aFoundPoint.x;
				aLastY = aFoundPoint.y;
			}
			first = false;
			aCurT += aTIncr;
		}
		for(var i = 0; i < (this.mValuePointVector.length | 0); i++) {
			var anIdx = (((((this.mValuePointVector[i].mTime) - aMinTime) / (aMaxTime - aMinTime) * (GameFramework.resources.PIValue.PI_QUANT_SIZE - 1) + 0.5)) | 0);
			this.mQuantTable[anIdx] = this.mValuePointVector[i].mValue;
		}
	},
	GetValueAt : function GameFramework_resources_PIValue$GetValueAt(theTime, theDefault) {
		if(theDefault === undefined) {
			theDefault = 0;
		}
		if(this.mLastTime == theTime) {
			return this.mLastValue;
		}
		var aPrevTime = this.mLastTime;
		this.mLastTime = theTime;
		if(this.mValuePointVector.length == 1) {
			return this.mLastValue = this.mValuePointVector[0].mValue;
		}
		if(this.mBezier != null) {
			var aMinTime = this.mValuePointVector[0].mTime;
			var aMaxTime = this.mValuePointVector[this.mValuePointVector.length - 1].mTime;
			if(aMaxTime <= 1.001) {
				if(this.mQuantTable == null) {
					this.QuantizeCurve();
				}
				var aQPos = ((((theTime) - aMinTime) / (aMaxTime - aMinTime) * (GameFramework.resources.PIValue.PI_QUANT_SIZE - 1) + 0.5));
				if(aQPos <= 0.0) {
					return this.mLastValue = this.mValuePointVector[0].mValue;
				}
				if(aQPos >= GameFramework.resources.PIValue.PI_QUANT_SIZE - 1) {
					return this.mLastValue = this.mValuePointVector[this.mValuePointVector.length - 1].mValue;
				}
				var aLeft = (aQPos | 0);
				var aFrac = aQPos - aLeft;
				this.mLastValue = this.mQuantTable[aLeft] * (1.0 - aFrac) + this.mQuantTable[aLeft + 1] * aFrac;
				return this.mLastValue;
			}
			var aMaxError = Math.min(0.1, (aMaxTime - aMinTime) / 1000.0);
			if(theTime <= aMinTime) {
				return this.mLastValue = this.mValuePointVector[0].mValue;
			}
			if(theTime >= aMaxTime) {
				return this.mLastValue = this.mValuePointVector[this.mValuePointVector.length - 1].mValue;
			}
			var aL = aMinTime;
			var aR = aMaxTime;
			var aPt = new GameFramework.geom.TPoint();
			var aTryT = 0;
			var isBigChange = ((theTime - aPrevTime) / (aMaxTime - aMinTime)) > 0.05;
			var anErrorFactor = Array.Create(4, 4, 0.1, 0.1, 0.1, 0.5);
			var aFactors = Array.Create(3, 3, 1.0, 0.75, 1.25);
			for(var aTryCount = 0; aTryCount < 1000; aTryCount++) {
				var aWantError = aMaxError;
				if((aTryCount < 4) && (!isBigChange)) {
					aWantError *= anErrorFactor[aTryCount];
				}
				if((aTryCount < 3) && (this.mLastCurveTDelta != 0) && (!isBigChange)) {
					aTryT = this.mLastCurveT + this.mLastCurveTDelta * aFactors[aTryCount];
				} else {
					aTryT = aL + (aR - aL) / 2.0;
				}
				if((aTryT >= aL) && (aTryT <= aR)) {
					aPt = this.mBezier.Evaluate(aTryT);
					var aDiff = aPt.x - theTime;
					if(Math.abs(aDiff) <= aWantError) {
						break;
					}
					if(aDiff < 0) {
						aL = aTryT;
					} else {
						aR = aTryT;
					}
				}
			}
			this.mLastCurveTDelta = this.mLastCurveTDelta * 0.5 + (aTryT - this.mLastCurveT) * 0.5;
			this.mLastCurveT = aTryT;
			return this.mLastValue = aPt.y;
		}
		for(var i = 1; i < this.mValuePointVector.length; i++) {
			var aP1 = this.mValuePointVector[i - 1];
			var aP2 = this.mValuePointVector[i];
			if(((theTime >= aP1.mTime) && (theTime <= aP2.mTime)) || (i == (this.mValuePointVector.length | 0) - 1)) {
				return this.mLastValue = aP1.mValue + (aP2.mValue - aP1.mValue) * Math.min(1.0, (theTime - aP1.mTime) / (aP2.mTime - aP1.mTime));
			}
		}
		return this.mLastValue = theDefault;
	},
	GetLastKeyframe : function GameFramework_resources_PIValue$GetLastKeyframe(theTime) {
		for(var i = (this.mValuePointVector.length | 0) - 1; i >= 0; i--) {
			var aPt = this.mValuePointVector[i];
			if(theTime >= aPt.mTime) {
				return aPt.mValue;
			}
		}
		return 0;
	},
	GetLastKeyframeTime : function GameFramework_resources_PIValue$GetLastKeyframeTime(theTime) {
		for(var i = (this.mValuePointVector.length | 0) - 1; i >= 0; i--) {
			var aPt = this.mValuePointVector[i];
			if(theTime >= aPt.mTime) {
				return aPt.mTime;
			}
		}
		return 0;
	},
	GetNextKeyframeTime : function GameFramework_resources_PIValue$GetNextKeyframeTime(theTime) {
		for(var i = 0; i < (this.mValuePointVector.length | 0); i++) {
			var aPt = this.mValuePointVector[i];
			if(aPt.mTime >= theTime) {
				return aPt.mTime;
			}
		}
		return 0;
	},
	GetNextKeyframeIdx : function GameFramework_resources_PIValue$GetNextKeyframeIdx(theTime) {
		for(var i = 0; i < (this.mValuePointVector.length | 0); i++) {
			var aPt = this.mValuePointVector[i];
			if(aPt.mTime >= theTime) {
				return i;
			}
		}
		return -1;
	}
}
GameFramework.resources.PIValue.staticInit = function GameFramework_resources_PIValue$staticInit() {
	GameFramework.resources.PIValue.PI_QUANT_SIZE = 256;
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIValue.registerClass('GameFramework.resources.PIValue', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PIValue.staticInit();
});