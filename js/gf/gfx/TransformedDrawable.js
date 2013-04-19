GameFramework.gfx.TransformedDrawable = function GameFramework_gfx_TransformedDrawable(theDrawable, theMatrix) {
	this.mDrawable = theDrawable;
	this.mMatrix = theMatrix;
}
GameFramework.gfx.TransformedDrawable.prototype = {
	mDrawable : null,
	mMatrix : null,
	get_Additive : function GameFramework_gfx_TransformedDrawable$get_Additive() {
		return this.mDrawable.get_Additive();
	},
	set_Additive : function GameFramework_gfx_TransformedDrawable$set_Additive(value) {
		this.mDrawable.set_Additive(value);
	},
	DrawEx : function GameFramework_gfx_TransformedDrawable$DrawEx(g, theMatrix, theX, theY, theCel) {
		var aNewMatrix = this.mMatrix.clone();
		aNewMatrix.tx += theX;
		aNewMatrix.ty += theY;
		aNewMatrix.concat(theMatrix);
		this.mDrawable.DrawEx(g, aNewMatrix, 0, 0, theCel);
	}
}
GameFramework.gfx.TransformedDrawable.staticInit = function GameFramework_gfx_TransformedDrawable$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.gfx.TransformedDrawable.registerClass('GameFramework.gfx.TransformedDrawable', null, GameFramework.gfx.IDrawable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.gfx.TransformedDrawable.staticInit();
});