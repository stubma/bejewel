GameFramework.geom.TPoint = function GameFramework_geom_TPoint(theX, theY) {
    if (theX === undefined) {
        theX = 0;
    }
    if (theY === undefined) {
        theY = 0;
    }
    this.x = theX;
    this.y = theY;
};
GameFramework.geom.TPoint.distance = function GameFramework_geom_TPoint$distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
};
GameFramework.geom.TPoint.interpolate = function GameFramework_geom_TPoint$interpolate(p1, p2, aPct) {
    return new GameFramework.geom.TPoint(p2.x + (p1.x - p2.x) * aPct, p2.y + (p1.y - p2.y) * aPct);
};
GameFramework.geom.TPoint.prototype = {
    x: 0,
    y: 0,
    get_length: function GameFramework_geom_TPoint$get_length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    clone: function GameFramework_geom_TPoint$clone() {
        return new GameFramework.geom.TPoint(this.x, this.y);
    },
    offset: function GameFramework_geom_TPoint$offset(ofsX, ofsY) {
        this.x += ofsX;
        this.y += ofsY;
    },
    add: function GameFramework_geom_TPoint$add(pt) {
        return new GameFramework.geom.TPoint(this.x + pt.x, this.y + pt.y);
    },
    subtract: function GameFramework_geom_TPoint$subtract(pt) {
        return new GameFramework.geom.TPoint(this.x - pt.x, this.y - pt.y);
    },
    scale: function GameFramework_geom_TPoint$scale(scale) {
        return new GameFramework.geom.TPoint(this.x * scale, this.y * scale);
    },
    normalize: function GameFramework_geom_TPoint$normalize(thickness) {
        var aScale = thickness / this.get_length();
        this.x *= aScale;
        this.y *= aScale;
    },
};
GameFramework.geom.TPoint.staticInit = function GameFramework_geom_TPoint$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.geom.TPoint.registerClass("GameFramework.geom.TPoint", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.geom.TPoint.staticInit();
});
