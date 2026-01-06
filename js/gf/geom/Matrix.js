GameFramework.geom.Matrix = function GameFramework_geom_Matrix() {
    this.identity();
};
GameFramework.geom.Matrix.Create = function GameFramework_geom_Matrix$Create(_a, _b, _c, _d, _tx, _ty) {
    var aMatrix = new GameFramework.geom.Matrix();
    aMatrix.a = _a;
    aMatrix.b = _b;
    aMatrix.c = _c;
    aMatrix.d = _d;
    aMatrix.tx = _tx;
    aMatrix.ty = _ty;
    return aMatrix;
};
GameFramework.geom.Matrix.prototype = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    tx: 0,
    ty: 0,
    clone: function GameFramework_geom_Matrix$clone() {
        return GameFramework.geom.Matrix.Create(this.a, this.b, this.c, this.d, this.tx, this.ty);
    },
    identity: function GameFramework_geom_Matrix$identity() {
        this.tx = 0;
        this.ty = 0;
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
    },
    translate: function GameFramework_geom_Matrix$translate(theX, theY) {
        this.tx += theX;
        this.ty += theY;
    },
    scale: function GameFramework_geom_Matrix$scale(theScaleX, theScaleY) {
        this.a *= theScaleX;
        this.b *= theScaleY;
        this.c *= theScaleX;
        this.d *= theScaleY;
        this.tx *= theScaleX;
        this.ty *= theScaleY;
    },
    rotate: function GameFramework_geom_Matrix$rotate(theAngle) {
        var _a = this.a;
        var _b = this.b;
        var _c = this.c;
        var _d = this.d;
        var _tx = this.tx;
        var _ty = this.ty;
        var sin = Math.sin(theAngle);
        var cos = Math.cos(theAngle);
        this.a = _a * cos - _b * sin;
        this.b = _a * sin + _b * cos;
        this.c = _c * cos - _d * sin;
        this.d = _c * sin + _d * cos;
        this.tx = _tx * cos - _ty * sin;
        this.ty = _tx * sin + _ty * cos;
    },
    concat: function GameFramework_geom_Matrix$concat(theMat2) {
        var _a = this.a;
        var _b = this.b;
        var _c = this.c;
        var _d = this.d;
        var _tx = this.tx;
        var _ty = this.ty;
        this.a = _a * theMat2.a + _b * theMat2.c;
        this.b = _a * theMat2.b + _b * theMat2.d;
        this.c = _c * theMat2.a + _d * theMat2.c;
        this.d = _c * theMat2.b + _d * theMat2.d;
        this.tx = _tx * theMat2.a + _ty * theMat2.c + theMat2.tx;
        this.ty = _tx * theMat2.b + _ty * theMat2.d + theMat2.ty;
    },
    invert: function GameFramework_geom_Matrix$invert() {
        var _a = this.a;
        var _b = this.b;
        var _c = this.c;
        var _d = this.d;
        var _tx = this.tx;
        var _ty = this.ty;
        var den = this.a * this.d - this.b * this.c;
        this.a = _d / den;
        this.b = -_b / den;
        this.c = -_c / den;
        this.d = _a / den;
        this.tx = (_c * _ty - _d * _tx) / den;
        this.ty = -(_a * _ty - _b * _tx) / den;
    },
    transformPoint: function GameFramework_geom_Matrix$transformPoint(thePoint) {
        return new GameFramework.geom.TPoint(
            this.tx + this.a * thePoint.x + this.c * thePoint.y,
            this.ty + this.b * thePoint.x + this.d * thePoint.y
        );
    },
    deltaTransformPoint: function GameFramework_geom_Matrix$deltaTransformPoint(thePoint) {
        return new GameFramework.geom.TPoint(
            this.a * thePoint.x + this.c * thePoint.y,
            this.b * thePoint.x + this.d * thePoint.y
        );
    },
};
GameFramework.geom.Matrix.staticInit = function GameFramework_geom_Matrix$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.geom.Matrix.registerClass("GameFramework.geom.Matrix", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.geom.Matrix.staticInit();
});
