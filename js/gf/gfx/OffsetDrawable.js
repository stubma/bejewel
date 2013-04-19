GameFramework.gfx.OffsetDrawable = function GameFramework_gfx_OffsetDrawable(theDrawable, theOffsetX, theOffsetY) {
	this.mDrawable = theDrawable;
	this.mOffsetX = theOffsetX;
	this.mOffsetY = theOffsetY;
}
GameFramework.gfx.OffsetDrawable.prototype = {
	mDrawable : null,
	mOffsetX : 0,
	mOffsetY : 0,
	get_Additive : function GameFramework_gfx_OffsetDrawable$get_Additive() {
		return this.mDrawable.get_Additive();
	},
	set_Additive : function GameFramework_gfx_OffsetDrawable$set_Additive(value) {
		this.mDrawable.set_Additive(value);
	},
	DrawEx : function GameFramework_gfx_OffsetDrawable$DrawEx(g, theMatrix, theX, theY, theCel) {
		this.mDrawable.DrawEx(g, theMatrix, theX + this.mOffsetX, theY + this.mOffsetY, theCel);
	}
}
GameFramework.gfx.OffsetDrawable.staticInit = function GameFramework_gfx_OffsetDrawable$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.gfx.OffsetDrawable.registerClass('GameFramework.gfx.OffsetDrawable', null, GameFramework.gfx.IDrawable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.gfx.OffsetDrawable.staticInit();
});