GameFramework.resources.PIInterpolator = function GameFramework_resources_PIInterpolator() {
	this.mInterpolatorPointVector = [];
}
GameFramework.resources.PIInterpolator.prototype = {
	mInterpolatorPointVector : null,
	Dispose : function GameFramework_resources_PIInterpolator$Dispose() {
	},
	GetValueAt : function GameFramework_resources_PIInterpolator$GetValueAt(theTime) {
		if(this.mInterpolatorPointVector.length == 1) {
			return this.mInterpolatorPointVector[0].mValue;
		}
		var aScaledTime = this.mInterpolatorPointVector[0].mTime + theTime * (this.mInterpolatorPointVector[this.mInterpolatorPointVector.length - 1].mTime - this.mInterpolatorPointVector[0].mTime);
		for(var i = 1; i < (this.mInterpolatorPointVector.length | 0); i++) {
			var aP1 = this.mInterpolatorPointVector[i - 1];
			var aP2 = this.mInterpolatorPointVector[i];
			if((aScaledTime >= aP1.mTime) && (aScaledTime <= aP2.mTime)) {
				return GameFramework.Utils.LerpColor(aP1.mValue, aP2.mValue, Math.min(1.0, (aScaledTime - aP1.mTime) / (aP2.mTime - aP1.mTime)));
			}
			if(i == (this.mInterpolatorPointVector.length | 0) - 1) {
				return aP2.mValue;
			}
		}
		return 0;
	},
	GetKeyframeNum : function GameFramework_resources_PIInterpolator$GetKeyframeNum(theIdx) {
		if(this.mInterpolatorPointVector.length == 0) {
			return 0;
		}
		return this.mInterpolatorPointVector[theIdx % this.mInterpolatorPointVector.length].mValue;
	},
	GetKeyframeTime : function GameFramework_resources_PIInterpolator$GetKeyframeTime(theIdx) {
		if(this.mInterpolatorPointVector.length == 0) {
			return 0;
		}
		return this.mInterpolatorPointVector[theIdx % this.mInterpolatorPointVector.length].mTime;
	}
}
GameFramework.resources.PIInterpolator.staticInit = function GameFramework_resources_PIInterpolator$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PIInterpolator.registerClass('GameFramework.resources.PIInterpolator', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PIInterpolator.staticInit();
});