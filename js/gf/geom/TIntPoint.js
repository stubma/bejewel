GameFramework.geom.TIntPoint = function GameFramework_geom_TIntPoint(theX, theY) {
	if(theX === undefined) {
		theX = 0;
	}
	if(theY === undefined) {
		theY = 0;
	}
	this.x = theX;
	this.y = theY;
}
GameFramework.geom.TIntPoint.distance = function GameFramework_geom_TIntPoint$distance(a, b) {
	var dx = a.x - b.x;
	var dy = a.y - b.y;
	return Math.sqrt(dx * dx + dy * dy);
}
GameFramework.geom.TIntPoint.prototype = {
	x : 0,
	y : 0,
	get_length : function GameFramework_geom_TIntPoint$get_length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
}
GameFramework.geom.TIntPoint.staticInit = function GameFramework_geom_TIntPoint$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.geom.TIntPoint.registerClass('GameFramework.geom.TIntPoint', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.geom.TIntPoint.staticInit();
});