Game.SpreadCurve = function Game_SpreadCurve(theSize) {
	this.mSize = theSize;
	this.mVals = Array.Create(this.mSize, null);
	for(var i = 0; i < this.mSize; ++i) {
		this.mVals[i] = i / theSize;
	}
}
Game.SpreadCurve.CreateFromCurve = function Game_SpreadCurve$CreateFromCurve(theCurve) {
	var ret = new Game.SpreadCurve(256);
	ret.SetToCurve(theCurve);
	return ret;
}
Game.SpreadCurve.prototype = {
	mVals : null,
	mSize : 0,
	SetToCurve : function Game_SpreadCurve$SetToCurve(theCurve) {
		var tempDist = Array.Create(this.mSize, null);
		for(var i = 0; i < this.mSize; ++i) {
			tempDist[i] = 0.0;
		}
		JS_Assert(theCurve.mOutMax <= 1.0);
		JS_Assert(theCurve.mInMax >= 0.0);
		var total = 0.0;
		for(var i_2 = 0; i_2 < this.mSize; ++i_2) {
			var val = theCurve.GetOutValAt(i_2 / this.mSize);
			tempDist[i_2] += val;
			total += val;
		}
		var cur = 0;
		var tgt = 0.0;
		var sizeDbl = this.mSize;
		for(var i_3 = 0; i_3 < this.mSize; ++i_3) {
			this.mVals[i_3] = 1.0;
			tgt += tempDist[i_3] / total * (sizeDbl - 1.0);
			var val_2 = i_3 / (sizeDbl - 1.0);
			while(cur <= tgt) {
				if(cur < sizeDbl) {
					JS_Assert(val_2 <= 1.0 && val_2 >= 0.0);
					this.mVals[cur] = val_2;
				}
				++cur;
			}
		}
	},
	GetOutVal : function Game_SpreadCurve$GetOutVal(theVal) {
		var idx = (Math.max(0, Math.min(this.mSize - 1, ((theVal * (this.mSize - 1)) | 0))) | 0);
		return this.mVals[idx];
	}
}
Game.SpreadCurve.staticInit = function Game_SpreadCurve$staticInit() {
}

JS_AddInitFunc(function() {
	Game.SpreadCurve.registerClass('Game.SpreadCurve', null);
});
JS_AddStaticInitFunc(function() {
	Game.SpreadCurve.staticInit();
});