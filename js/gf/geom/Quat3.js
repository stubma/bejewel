GameFramework.geom.Quat3 = function GameFramework_geom_Quat3(inV, inS) {
    if (inV === undefined) {
        inV = null;
    }
    if (inS === undefined) {
        inS = 1.0;
    }
    this.v = inV != null ? inV : new GameFramework.geom.Vector3(0, 0, 0);
    this.s = inS;
};
GameFramework.geom.Quat3.CreateFromAxes = function GameFramework_geom_Quat3$CreateFromAxes(inAxes) {
    var f = inAxes.OrthoNormalize();
    var s = 0;
    var v = new GameFramework.geom.Vector3();
    var rot = Array.Create(3, 3, 1, 2, 0);
    var c = Array.Create2D(3, 3, 9, f.vX.x, f.vY.x, f.vZ.x, 0, 0, 0, 0, 0, 0);
    var i;
    var j;
    var k;
    var d;
    var sq;
    var q = Array.Create(4, null);
    d = c[c.mIdxMult0 * 0 + 0] + c[c.mIdxMult0 * 1 + 1] + c[c.mIdxMult0 * 2 + 2];
    if (d > 0.0) {
        sq = Math.sqrt(d + 1.0);
        s = sq * 0.5;
        sq = 0.5 / sq;
        v.x = (c[c.mIdxMult0 * 1 + 2] - c[c.mIdxMult0 * 2 + 1]) * sq;
        v.y = (c[c.mIdxMult0 * 2 + 0] - c[c.mIdxMult0 * 0 + 2]) * sq;
        v.z = (c[c.mIdxMult0 * 0 + 1] - c[c.mIdxMult0 * 1 + 0]) * sq;
        return new GameFramework.geom.Quat3(v, s);
    }
    i = 0;
    if (c[c.mIdxMult0 * 1 + 1] > c[c.mIdxMult0 * 0 + 0]) {
        i = 1;
    }
    if (c[c.mIdxMult0 * 2 + 2] > c[c.mIdxMult0 * i + i]) {
        i = 2;
    }
    j = rot[i];
    k = rot[j];
    sq = Math.sqrt(c[c.mIdxMult0 * i + i] - (c[c.mIdxMult0 * j + j] + c[c.mIdxMult0 * k + k]) + 1.0);
    q[i] = sq * 0.5;
    if (sq != 0.0) {
        sq = 0.5 / sq;
    }
    s = (c[c.mIdxMult0 * j + k] - c[c.mIdxMult0 * k + j]) * sq;
    q[j] = (c[c.mIdxMult0 * i + j] + c[c.mIdxMult0 * j + i]) * sq;
    q[k] = (c[c.mIdxMult0 * i + k] + c[c.mIdxMult0 * k + i]) * sq;
    v.x = q[0];
    v.y = q[1];
    v.z = q[2];
    return new GameFramework.geom.Quat3(v, s);
};
GameFramework.geom.Quat3.AxisAngle = function GameFramework_geom_Quat3$AxisAngle(inAxis, inAngleRad) {
    var q = new GameFramework.geom.Quat3();
    inAngleRad *= 0.5;
    q.v = inAxis.Normalize();
    q.v = q.v.Scale(Math.sin(inAngleRad));
    q.s = Math.cos(inAngleRad);
    return q;
};
GameFramework.geom.Quat3.Slerp = function GameFramework_geom_Quat3$Slerp(inL, inR, inAlpha, inLerpOnly) {
    if (inL.ApproxEquals(inR, 0.00001)) {
        return inL;
    }
    var omalpha = Math.min(Math.max(inAlpha, 0.0), 1.0);
    var alpha = 1.0 - omalpha;
    var tempR = inR;
    var cosang = inL.Dot(inR);
    if (cosang < 0.0) {
        cosang = -cosang;
        tempR.v.x = -tempR.v.x;
        tempR.v.y = -tempR.v.y;
        tempR.v.z = -tempR.v.z;
    }
    if (1.0 - cosang > 0.00001 && !inLerpOnly) {
        var ang = Math.acos(cosang);
        if (ang >= 0.00001 && Math.PI - ang >= 0.00001 && Math.abs(ang) < 100000000.0) {
            var sinang = Math.sin(ang);
            var oosinang = 1.0 / sinang;
            var sA = Math.sin(alpha * ang) * oosinang;
            var sB = Math.sin(omalpha * ang) * oosinang;
            var s = inL.s * sA + tempR.s * sB;
            var v = inL.v.Scale(sA).Add(tempR.v.Scale(sB));
            return new GameFramework.geom.Quat3(v, s).Normalize();
        }
    }
    var s2 = inL.s * alpha + tempR.s * omalpha;
    var v2 = inL.v.Scale(alpha).Add(tempR.v.Scale(omalpha));
    return new GameFramework.geom.Quat3(v2, s2).Normalize();
};
GameFramework.geom.Quat3.prototype = {
    v: null,
    s: 0,
    GetAxes3: function GameFramework_geom_Quat3$GetAxes3() {
        var x = this.v.x;
        var y = this.v.y;
        var z = this.v.z;
        var w = this.s;
        var x2 = x * 2.0;
        var y2 = y * 2.0;
        var z2 = z * 2.0;
        var w2 = w * 2.0;
        var xx2 = x * x2;
        var yy2 = y * y2;
        var zz2 = z * z2;
        var xy2 = x * y2;
        var xz2 = x * z2;
        var xw2 = x * w2;
        var yz2 = y * z2;
        var yw2 = y * w2;
        var zw2 = z * w2;
        return new GameFramework.geom.Axes3(
            new GameFramework.geom.Vector3(1.0 - (yy2 + zz2), xy2 + zw2, xz2 - yw2),
            new GameFramework.geom.Vector3(xy2 - zw2, 1.0 - (xx2 + zz2), yz2 + xw2),
            new GameFramework.geom.Vector3(xz2 + yw2, yz2 - xw2, 1.0 - (xx2 + yy2))
        );
    },
    ScaleDiv: function GameFramework_geom_Quat3$ScaleDiv(inT) {
        return new GameFramework.geom.Quat3(this.v.ScaleDiv(inT), this.s / inT);
    },
    Dot: function GameFramework_geom_Quat3$Dot(inQ) {
        return this.v.Dot(inQ.v) + this.s * inQ.s;
    },
    Magnitude: function GameFramework_geom_Quat3$Magnitude() {
        return Math.sqrt(this.v.x * this.v.x + this.v.y * this.v.y + this.v.z * this.v.z + this.s * this.s);
    },
    Normalize: function GameFramework_geom_Quat3$Normalize() {
        var aMag = this.Magnitude();
        return aMag != 0 ? this.ScaleDiv(aMag) : this;
    },
    ApproxEquals: function GameFramework_geom_Quat3$ApproxEquals(inQ, inTol) {
        return Math.abs(this.s - inQ.s) <= inTol && this.v.ApproxEquals(inQ.v, inTol);
    },
};
GameFramework.geom.Quat3.staticInit = function GameFramework_geom_Quat3$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.geom.Quat3.registerClass("GameFramework.geom.Quat3", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.geom.Quat3.staticInit();
});
