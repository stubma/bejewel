GameFramework.resources.ImageInst = function GameFramework_resources_ImageInst(theImageResource) {
	this.mSource = null;
	this.mPixelSnapping = 0;
	this.mSource = theImageResource;
	this.mAdditive = this.mSource.mAdditive;
	this.mPixelSnapping = this.mSource.mPixelSnapping;
	this.mSmoothing = this.mSource.mSmoothing;
}
GameFramework.resources.ImageInst.prototype = {
	mSource : null,
	mSrcX : 0,
	mSrcY : 0,
	mSrcWidth : 0,
	mSrcHeight : 0,
	mAdditive : false,
	mPixelSnapping : null,
	mSmoothing : true,
	mSizeSnapping : false,
	mRepeatX : 1.0,
	mRepeatY : 1.0,
	get_Additive : function GameFramework_resources_ImageInst$get_Additive() {
		return this.mAdditive;
	},
	set_Additive : function GameFramework_resources_ImageInst$set_Additive(value) {
		this.mAdditive = value;
	},
	Prepare : function GameFramework_resources_ImageInst$Prepare() {
	},
	DrawEx : function GameFramework_resources_ImageInst$DrawEx(g, theMatrix, theX, theY, theCel) {
	}
}
GameFramework.resources.ImageInst.staticInit = function GameFramework_resources_ImageInst$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.ImageInst.registerClass('GameFramework.resources.ImageInst', null, GameFramework.gfx.IDrawable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.ImageInst.staticInit();
});