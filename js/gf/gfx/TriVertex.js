GameFramework.gfx.TriVertex = function GameFramework_gfx_TriVertex(theX, theY, theU, theV, theColor) {
	if(theX === undefined) {
		theX = 0;
	}
	if(theY === undefined) {
		theY = 0;
	}
	if(theU === undefined) {
		theU = 0;
	}
	if(theV === undefined) {
		theV = 0;
	}
	if(theColor === undefined) {
		theColor = 0xffffffff;
	}
	this.x = theX;
	this.y = theY;
	this.u = theU;
	this.v = theV;
	this.color = theColor;
}
GameFramework.gfx.TriVertex.prototype = {
	x : 0,
	y : 0,
	u : 0,
	v : 0,
	color : 0
}
GameFramework.gfx.TriVertex.staticInit = function GameFramework_gfx_TriVertex$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.gfx.TriVertex.registerClass('GameFramework.gfx.TriVertex', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.gfx.TriVertex.staticInit();
});