GameFramework.geom.Vector3 = function GameFramework_geom_Vector3(theX, theY, theZ) {
    if (theX === undefined) {
        theX = 0;
    }
    if (theY === undefined) {
        theY = 0;
    }
    if (theZ === undefined) {
        theZ = 0;
    }
    this.x = theX;
    this.y = theY;
    this.z = theZ;
};
GameFramework.geom.Vector3.prototype = {
    x: null,
    y: 0,
    z: 0,
    Dot: function GameFramework_geom_Vector3$Dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    },
    Cross: function GameFramework_geom_Vector3$Cross(v) {
        return new GameFramework.geom.Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    },
    Add: function GameFramework_geom_Vector3$Add(v) {
        return new GameFramework.geom.Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    },
    Sub: function GameFramework_geom_Vector3$Sub(v) {
        return new GameFramework.geom.Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    },
    Scale: function GameFramework_geom_Vector3$Scale(t) {
        return new GameFramework.geom.Vector3(t * this.x, t * this.y, t * this.z);
    },
    Mult: function GameFramework_geom_Vector3$Mult(v) {
        return new GameFramework.geom.Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    },
    ScaleDiv: function GameFramework_geom_Vector3$ScaleDiv(t) {
        var oot = 1.0 / t;
        return new GameFramework.geom.Vector3(this.x * oot, this.y * oot, this.z * oot);
    },
    Div: function GameFramework_geom_Vector3$Div(v) {
        return new GameFramework.geom.Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
    },
    Magnitude: function GameFramework_geom_Vector3$Magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
    Normalize: function GameFramework_geom_Vector3$Normalize() {
        var aMag = this.Magnitude();
        return aMag != 0 ? this.ScaleDiv(aMag) : this;
    },
    ApproxEquals: function GameFramework_geom_Vector3$ApproxEquals(inV, inTol) {
        if (inTol === undefined) {
            inTol = 0.00001;
        }
        return (
            Math.abs(this.x - inV.x) <= inTol && Math.abs(this.y - inV.y) <= inTol && Math.abs(this.z - inV.z) <= inTol
        );
    },
    ApproxZero: function GameFramework_geom_Vector3$ApproxZero(inTol) {
        if (inTol === undefined) {
            inTol = 0.00001;
        }
        return Math.abs(this.x) <= inTol && Math.abs(this.y) <= inTol && Math.abs(this.z) <= inTol;
    },
    Enter: function GameFramework_geom_Vector3$Enter(inAxes) {
        return new GameFramework.geom.Vector3(this.Dot(inAxes.vX), this.Dot(inAxes.vY), this.Dot(inAxes.vZ));
    },
    Enter$2: function GameFramework_geom_Vector3$Enter$2(inCoords) {
        return this.Sub(inCoords.t).Enter(inCoords.r).Div(inCoords.s);
    },
    Leave: function GameFramework_geom_Vector3$Leave(inAxes) {
        return new GameFramework.geom.Vector3(
            this.x * inAxes.vX.x + this.y * inAxes.vY.x + this.z * inAxes.vZ.x,
            this.x * inAxes.vX.y + this.y * inAxes.vY.y + this.z * inAxes.vZ.y,
            this.x * inAxes.vX.z + this.y * inAxes.vY.z + this.z * inAxes.vZ.z
        );
    },
    Leave$2: function GameFramework_geom_Vector3$Leave$2(inCoords) {
        return this.Mult(inCoords.s).Leave(inCoords.r).Add(inCoords.t);
    },
};
GameFramework.geom.Vector3.staticInit = function GameFramework_geom_Vector3$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.geom.Vector3.registerClass("GameFramework.geom.Vector3", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.geom.Vector3.staticInit();
});
