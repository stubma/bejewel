GameFramework.misc.BSpline = function GameFramework_misc_BSpline() {
    this.Reset();
};
GameFramework.misc.BSpline.prototype = {
    mXPoints: null,
    mYPoints: null,
    mArcLengths: null,
    mXCoef: null,
    mYCoef: null,
    eqs: null,
    sol: null,
    mRowSize: 0,
    mCurRow: 0,
    Reset: function GameFramework_misc_BSpline$Reset() {
        this.mXPoints = [];
        this.mYPoints = [];
        this.mArcLengths = [];
        this.mXCoef = [];
        this.mYCoef = [];
    },
    AddPoint: function GameFramework_misc_BSpline$AddPoint(x, y) {
        this.mXPoints.push(x);
        this.mYPoints.push(y);
    },
    CalcArcLengths: function GameFramework_misc_BSpline$CalcArcLengths() {
        this.mArcLengths = [];
        var numCurves = (this.mXPoints.length | 0) - 1;
        for (var i = 0; i < numCurves; i++) {
            var x1 = this.mXPoints[i];
            var y1 = this.mYPoints[i];
            var x2 = this.mXPoints[i + 1];
            var y2 = this.mYPoints[i + 1];
            var aLength = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            this.mArcLengths.push(aLength);
        }
    },
    GetNextPoint: function GameFramework_misc_BSpline$GetNextPoint(theVals) {
        var t = theVals[2];
        var anIndex = Math.floor(t) | 0;
        if (anIndex < 0 || anIndex >= (this.mXPoints.length | 0) - 1) {
            theVals[0] = this.GetXPoint(t);
            theVals[1] = this.GetYPoint(t);
            return false;
        }
        var aLength = 1 / (this.mArcLengths[anIndex] * 100);
        var ox = this.GetXPoint(t);
        var oy = this.GetYPoint(t);
        var nt = t;
        var nx;
        var ny;
        while (true) {
            nt += aLength;
            nx = this.GetXPoint(nt);
            ny = this.GetYPoint(nt);
            var dist = (nx - ox) * (nx - ox) + (ny - oy) * (ny - oy);
            if (dist >= 1.0) {
                break;
            }
            if (nt > this.mXPoints.length - 1) {
                break;
            }
        }
        theVals[0] = nx;
        theVals[1] = ny;
        theVals[2] = nt;
        return true;
    },
    GetMaxT: function GameFramework_misc_BSpline$GetMaxT() {
        return (this.mXPoints.length | 0) - 1;
    },
    EquationSystem_Init: function GameFramework_misc_BSpline$EquationSystem_Init(theNumVariables, theSol) {
        this.mRowSize = theNumVariables + 1;
        this.mCurRow = 0;
        this.eqs = [];
        for (var anEqNum = 0; anEqNum < this.mRowSize * theNumVariables; anEqNum++) {
            this.eqs.push(0.0);
        }
        this.sol = theSol;
        for (var aSols = 0; aSols < theNumVariables; aSols++) {
            this.sol.push(0.0);
        }
    },
    EquationSystem_SetCoefficientAtRow: function GameFramework_misc_BSpline$EquationSystem_SetCoefficientAtRow(
        theRow,
        theCol,
        theValue
    ) {
        var anIndex = this.mRowSize * theRow + theCol;
        this.eqs[anIndex] = theValue;
    },
    EquationSystem_SetCoefficient: function GameFramework_misc_BSpline$EquationSystem_SetCoefficient(theCol, theValue) {
        this.EquationSystem_SetCoefficientAtRow(this.mCurRow, theCol, theValue);
    },
    EquationSystem_SetConstantTerm: function GameFramework_misc_BSpline$EquationSystem_SetConstantTerm(theValue) {
        this.EquationSystem_SetConstantTermAtRow(this.mCurRow, theValue);
    },
    EquationSystem_SetConstantTermAtRow: function GameFramework_misc_BSpline$EquationSystem_SetConstantTermAtRow(
        theRow,
        theValue
    ) {
        var anIndex = this.mRowSize * theRow + this.mRowSize - 1;
        this.eqs[anIndex] = theValue;
    },
    EquationSystem_NextEquation: function GameFramework_misc_BSpline$EquationSystem_NextEquation() {
        this.mCurRow++;
    },
    EquationSystem_Solve: function GameFramework_misc_BSpline$EquationSystem_Solve() {
        var i;
        var j;
        var k;
        var max;
        var r;
        var N;
        var temp;
        r = this.mRowSize;
        N = this.mRowSize - 1;
        for (i = 0; i < N; i++) {
            max = i;
            for (j = i + 1; j < N; j++) {
                if (Math.abs(this.eqs[j * r + i]) > Math.abs(this.eqs[max * r + i])) {
                    max = j;
                }
            }
            for (k = 0; k < N + 1; k++) {
                var swap = this.eqs[i * r + k];
                this.eqs[i * r + k] = this.eqs[max * r + k];
                this.eqs[max * r + k] = swap;
            }
            for (j = i + 1; j < N; j++) {
                var mult = this.eqs[j * r + i] / this.eqs[i * r + i];
                if (mult == 0) {
                    continue;
                }
                for (k = N; k >= i; k--) {
                    this.eqs[j * r + k] = this.eqs[j * r + k] - this.eqs[i * r + k] * mult;
                }
            }
        }
        for (j = N - 1; j >= 0; j--) {
            temp = 0;
            for (k = j + 1; k < N; k++) {
                temp += this.eqs[j * r + k] * this.sol[k];
            }
            this.sol[j] = (this.eqs[j * r + N] - temp) / this.eqs[j * r + j];
        }
    },
    CalculateSplinePrv: function GameFramework_misc_BSpline$CalculateSplinePrv(thePoints, theCoef) {
        if (thePoints.length < 2) {
            return;
        }
        var numCurves = (thePoints.length | 0) - 1;
        var numVariables = numCurves * 4;
        var i;
        this.EquationSystem_Init(numVariables, theCoef);
        this.EquationSystem_SetCoefficient(2, 1);
        this.EquationSystem_NextEquation();
        var c = 0;
        for (i = 0; i < numCurves; i++, c += 4) {
            this.EquationSystem_SetCoefficient(c + 3, 1);
            this.EquationSystem_SetConstantTerm(thePoints[i]);
            this.EquationSystem_NextEquation();
            this.EquationSystem_SetCoefficient(c, 1);
            this.EquationSystem_SetCoefficient(c + 1, 1);
            this.EquationSystem_SetCoefficient(c + 2, 1);
            this.EquationSystem_SetConstantTerm(thePoints[i + 1] - thePoints[i]);
            this.EquationSystem_NextEquation();
            this.EquationSystem_SetCoefficient(c, 3);
            this.EquationSystem_SetCoefficient(c + 1, 2);
            this.EquationSystem_SetCoefficient(c + 2, 1);
            if (i < numCurves - 1) {
                this.EquationSystem_SetCoefficient(c + 6, -1);
            }
            this.EquationSystem_NextEquation();
            if (i < numCurves - 1) {
                this.EquationSystem_SetCoefficient(c, 6);
                this.EquationSystem_SetCoefficient(c + 1, 2);
                this.EquationSystem_SetCoefficient(c + 5, -2);
                this.EquationSystem_NextEquation();
            }
        }
        this.EquationSystem_Solve();
    },
    CalculateSplinePrvSemiLinear: function GameFramework_misc_BSpline$CalculateSplinePrvSemiLinear(thePoints, theCoef) {
        if (thePoints.length < 2) {
            return;
        }
        var numCurves = (thePoints.length | 0) - 1;
        var i;
        var aNewPoints = [];
        var p1;
        var p2;
        for (i = 0; i < numCurves; i++) {
            var mix = this.mArcLengths[i];
            if (mix <= 100) {
                mix = 1;
            } else {
                mix = 100 / mix;
            }
            mix = 0.3;
            p1 = thePoints[i];
            p2 = thePoints[i + 1];
            if (i > 0) {
                aNewPoints.push(mix * p2 + (1 - mix) * p1);
            } else {
                aNewPoints.push(p1);
            }
            if (i < numCurves - 1) {
                aNewPoints.push(mix * p1 + (1 - mix) * p2);
            } else {
                aNewPoints.push(p2);
            }
        }
        thePoints = aNewPoints;
        numCurves = (aNewPoints.length | 0) - 1;
        for (i = 0; i < numCurves; i++) {
            p1 = aNewPoints[i];
            p2 = aNewPoints[i + 1];
            var c = i * 4;
            if ((i & 1) != 0 && i < numCurves - 1) {
                var p0 = aNewPoints[i - 1];
                var p3 = aNewPoints[i + 2];
                var A;
                var B;
                var C;
                var D;
                D = p1;
                C = p1 - p0;
                A = -2 * (p2 - 2 * p1 + p0) - C + (p3 - p2);
                B = -A + p2 - 2 * p1 + p0;
                theCoef.push(A);
                theCoef.push(B);
                theCoef.push(C);
                theCoef.push(D);
            } else {
                theCoef.push(0.0);
                theCoef.push(0.0);
                theCoef.push(p2 - p1);
                theCoef.push(p1);
            }
        }
    },
    CalculateSplinePrvLinear: function GameFramework_misc_BSpline$CalculateSplinePrvLinear(thePoints, theCoef) {
        if (thePoints.length < 2) {
            return;
        }
        var numCurves = (thePoints.length | 0) - 1;
        for (var i = 0; i < numCurves; i++) {
            var c = i * 4;
            var p1 = thePoints[i];
            var p2 = thePoints[i + 1];
            theCoef.push(0.0);
            theCoef.push(0.0);
            theCoef.push(p2 - p1);
            theCoef.push(p1);
        }
    },
    CalculateSpline: function GameFramework_misc_BSpline$CalculateSpline(linear) {
        this.CalcArcLengths();
        if (linear) {
            this.CalculateSplinePrvLinear(this.mXPoints, this.mXCoef);
            this.CalculateSplinePrvLinear(this.mYPoints, this.mYCoef);
        } else {
            this.CalculateSplinePrv(this.mXPoints, this.mXCoef);
            this.CalculateSplinePrv(this.mYPoints, this.mYCoef);
        }
        this.CalcArcLengths();
    },
    GetPoint: function GameFramework_misc_BSpline$GetPoint(t, theCoef) {
        var anIndex = Math.floor(t) | 0;
        if (anIndex < 0) {
            anIndex = 0;
            t = 0;
        } else if (anIndex >= (this.mXPoints.length | 0) - 1) {
            anIndex = (this.mXPoints.length | 0) - 2;
            t = anIndex + 1;
        }
        var s = t - anIndex;
        anIndex *= 4;
        var A = theCoef[anIndex];
        var B = theCoef[anIndex + 1];
        var C = theCoef[anIndex + 2];
        var D = theCoef[anIndex + 3];
        var s2 = s * s;
        var s3 = s2 * s;
        return A * s3 + B * s2 + C * s + D;
    },
    GetXPoint: function GameFramework_misc_BSpline$GetXPoint(t) {
        return this.GetPoint(t, this.mXCoef);
    },
    GetYPoint: function GameFramework_misc_BSpline$GetYPoint(t) {
        return this.GetPoint(t, this.mYCoef);
    },
};
GameFramework.misc.BSpline.staticInit = function GameFramework_misc_BSpline$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.misc.BSpline.registerClass("GameFramework.misc.BSpline", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.misc.BSpline.staticInit();
});
