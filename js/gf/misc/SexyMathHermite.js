GameFramework.misc.SexyMathHermite = function GameFramework_misc_SexyMathHermite() {
    this.mPoints = [];
    this.mPieces = [];
};
GameFramework.misc.SexyMathHermite.prototype = {
    mIsBuilt: null,
    mPoints: null,
    mPieces: null,
    Rebuild: function GameFramework_misc_SexyMathHermite$Rebuild() {
        this.mIsBuilt = false;
    },
    Evaluate: function GameFramework_misc_SexyMathHermite$Evaluate(inX) {
        if (!this.mIsBuilt) {
            if (!this.BuildCurve()) {
                return 0.0;
            }
            this.mIsBuilt = true;
        }
        var pieceCount = this.mPieces.length;
        for (var i = 0; i < pieceCount; i++) {
            var aPoints = Type.safeCast(this.mPoints[i + 1], Array);
            if (inX < aPoints[0]) {
                return this.EvaluatePiece(inX, i, Type.safeCast(this.mPieces[i], Array));
            }
        }
        var aResult = Type.safeCast(this.mPoints[this.mPoints.length - 1], Array);
        return aResult[1];
    },
    CreatePiece: function GameFramework_misc_SexyMathHermite$CreatePiece(thePtIdx, outPiece) {
        var q = Array.Create(GameFramework.misc.SexyMathHermite.dim * GameFramework.misc.SexyMathHermite.dim, null);
        var z = Array.Create(GameFramework.misc.SexyMathHermite.dim, null);
        var i;
        for (i = 0; i <= 1; i++) {
            var anInPoint = Type.safeCast(this.mPoints[thePtIdx + i], Array);
            var i2 = 2 * i;
            z[i2] = anInPoint[0];
            z[i2 + 1] = anInPoint[0];
            q[i2] = anInPoint[1];
            q[i2 + 1] = anInPoint[1];
            q[i2 + 1 + 1 * GameFramework.misc.SexyMathHermite.dim] = anInPoint[2];
            if (i != 0) {
                q[i2 + 1 * GameFramework.misc.SexyMathHermite.dim] = (q[i2] - q[i2 - 1]) / (z[i2] - z[i2 - 1]);
            }
        }
        for (i = 2; i < GameFramework.misc.SexyMathHermite.dim; i++) {
            for (var j = 2; j <= i; j++) {
                q[i + j * GameFramework.misc.SexyMathHermite.dim] =
                    (q[i + (j - 1) * GameFramework.misc.SexyMathHermite.dim] -
                        q[i - 1 + (j - 1) * GameFramework.misc.SexyMathHermite.dim]) /
                    (z[i] - z[i - j]);
            }
        }
        for (i = 0; i < GameFramework.misc.SexyMathHermite.dim; i++) {
            outPiece[i] = q[i + i * GameFramework.misc.SexyMathHermite.dim];
        }
    },
    EvaluatePiece: function GameFramework_misc_SexyMathHermite$EvaluatePiece(inX, thePtIdx, inPiece) {
        var xSub = Array.Create(2, null);
        xSub[0] = inX - Type.safeCast(this.mPoints[thePtIdx + 0], Array)[0];
        xSub[1] = inX - Type.safeCast(this.mPoints[thePtIdx + 1], Array)[0];
        var f = 1.0;
        var h = inPiece[0];
        for (var i = 1; i < GameFramework.misc.SexyMathHermite.dim; i++) {
            f *= xSub[((i - 1) / 2) | 0 | 0];
            h += f * inPiece[i];
        }
        return h;
    },
    BuildCurve: function GameFramework_misc_SexyMathHermite$BuildCurve() {
        this.mPieces.clear();
        var pointCount = this.mPoints.length;
        if (pointCount < 2) {
            return false;
        }
        var pieceCount = pointCount - 1;
        var i;
        for (i = 0; i < pieceCount; i++) {
            this.mPieces.push(Array.Create(4, null));
        }
        for (i = 0; i < pieceCount; i++) {
            this.CreatePiece(i, Type.safeCast(this.mPieces[i], Array));
        }
        return true;
    },
    AddPoint: function GameFramework_misc_SexyMathHermite$AddPoint(theX, theFx, theFxPrime) {
        this.mPoints.push(Array.Create(3, null, theX, theFx, theFxPrime));
    },
};
GameFramework.misc.SexyMathHermite.staticInit = function GameFramework_misc_SexyMathHermite$staticInit() {
    GameFramework.misc.SexyMathHermite.dim = 4;
};

JSFExt_AddInitFunc(function () {
    GameFramework.misc.SexyMathHermite.registerClass("GameFramework.misc.SexyMathHermite", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.misc.SexyMathHermite.staticInit();
});
