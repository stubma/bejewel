GameFramework.Insets = function GameFramework_Insets(theLeft, theTop, theRight, theBottom) {
	if(theLeft === undefined) {
		theLeft = 0.0;
	}
	if(theTop === undefined) {
		theTop = 0.0;
	}
	if(theRight === undefined) {
		theRight = 0.0;
	}
	if(theBottom === undefined) {
		theBottom = 0.0;
	}
	this.mLeft = theLeft;
	this.mTop = theTop;
	this.mRight = theRight;
	this.mBottom = theBottom;
}
GameFramework.Insets.prototype = {
	mLeft : 0,
	mTop : 0,
	mRight : 0,
	mBottom : 0,
	ToRect : function GameFramework_Insets$ToRect() {
		return new GameFramework.TRect(this.mLeft, this.mBottom, this.mRight - this.mLeft, this.mTop - this.mBottom);
	}
}
GameFramework.Insets.staticInit = function GameFramework_Insets$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.Insets.registerClass('GameFramework.Insets', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.Insets.staticInit();
});