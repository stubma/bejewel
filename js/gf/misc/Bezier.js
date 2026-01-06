GameFramework.misc.Bezier = function GameFramework_misc_Bezier() {};
GameFramework.misc.Bezier.prototype = {
    mTimes: null,
    mLengths: null,
    mTotalLength: 0,
    mCount: 0,
    mControls: null,
    mPositions: null,
    IsInitialized: function GameFramework_misc_Bezier$IsInitialized() {
        return this.mCount > 0;
    },
    GetTotalLength: function GameFramework_misc_Bezier$GetTotalLength() {
        return this.mTotalLength;
    },
    GetNumPoints: function GameFramework_misc_Bezier$GetNumPoints() {
        return this.mCount;
    },
    Distance: function GameFramework_misc_Bezier$Distance(p1x, p1y, p2x, p2y, sqrt) {
        if (sqrt === undefined) {
            sqrt = true;
        }
        var x = p2x - p1x;
        var y = p2y - p1y;
        var val = x * x + y * y;
        return sqrt ? Math.sqrt(val) : val;
    },
    Clean: function GameFramework_misc_Bezier$Clean() {
        this.mTimes = null;
        this.mLengths = null;
        this.mControls = null;
        this.mPositions = null;
        this.mCount = 0;
        this.mTotalLength = 0;
    },
    InitWithControls: function GameFramework_misc_Bezier$InitWithControls(positions, controls, times) {
        if (this.mCount != 0) {
            return false;
        }
        var count = positions.length;
        if (count < 2 || positions == null || times == null || controls == null) {
            return false;
        }
        this.mPositions = Array.Create(count, null);
        this.mControls = Array.Create(2 * (count - 1), null);
        this.mTimes = Array.Create(count, null);
        this.mCount = count;
        for (var i = 0; i < count; ++i) {
            this.mPositions[i] = positions[i];
            this.mTimes[i] = times[i];
        }
        for (var i_2 = 0; i_2 < 2 * (count - 1); ++i_2) {
            this.mControls[i_2] = controls[i_2];
        }
        this.mLengths = Array.Create(count - 1, null);
        this.mTotalLength = 0.0;
        for (var i_3 = 0; i_3 < count - 1; ++i_3) {
            this.mLengths[i_3] = this.SegmentArcLength(i_3, 0.0, 1.0);
            this.mTotalLength += this.mLengths[i_3];
        }
        return true;
    },
    Init: function GameFramework_misc_Bezier$Init(positions, times) {
        if (this.mCount != 0) {
            return false;
        }
        var count = positions.length;
        if (count < 2 || positions == null || times == null) {
            return false;
        }
        this.mPositions = Array.Create(count, null);
        this.mControls = Array.Create(2 * (count - 1), null);
        this.mTimes = Array.Create(count, null);
        this.mCount = count;
        for (var i = 0; i < count; ++i) {
            this.mPositions[i] = positions[i];
            this.mTimes[i] = times[i];
        }
        for (var i_2 = 0; i_2 < count - 1; ++i_2) {
            if (i_2 > 0) {
                var aPoint = this.mPositions[i_2 + 1].subtract(this.mPositions[i_2 - 1]);
                aPoint.x /= 3.0;
                aPoint.y /= 3.0;
                this.mControls[2 * i_2] = this.mPositions[i_2].add(aPoint);
            }
            if (i_2 < count - 2) {
                var aPoint_2 = this.mPositions[i_2 + 2].subtract(this.mPositions[i_2]);
                aPoint_2.x /= 3.0;
                aPoint_2.y /= 3.0;
                this.mControls[2 * i_2 + 1] = this.mPositions[i_2 + 1].subtract(aPoint_2);
            }
        }
        var aPt2 = this.mPositions[1].subtract(this.mPositions[0]);
        aPt2.x /= 3.0;
        aPt2.y /= 3.0;
        this.mControls[0] = this.mControls[1].subtract(aPt2);
        var aPt3 = this.mPositions[count - 1].subtract(this.mPositions[count - 2]);
        aPt3.x /= 3.0;
        aPt3.y /= 3.0;
        this.mControls[2 * count - 3] = this.mControls[2 * count - 4].add(aPt3);
        this.mLengths = Array.Create(count - 1, null);
        this.mTotalLength = 0.0;
        for (var i_3 = 0; i_3 < count - 1; ++i_3) {
            this.mLengths[i_3] = this.SegmentArcLength(i_3, 0.0, 1.0);
            this.mTotalLength += this.mLengths[i_3];
        }
        return true;
    },
    Evaluate: function GameFramework_misc_Bezier$Evaluate(t) {
        if (this.mCount < 2) {
            return new GameFramework.geom.TPoint(0, 0);
        }
        if (t <= this.mTimes[0]) {
            return this.mPositions[0];
        } else if (t >= this.mTimes[this.mCount - 1]) {
            return this.mPositions[this.mCount - 1];
        }
        var i = 0;
        for (i = 0; i < this.mCount - 1; ++i) {
            if (t < this.mTimes[i + 1]) {
                break;
            }
        }
        var t0 = this.mTimes[i];
        var t1 = this.mTimes[i + 1];
        var u = (t - t0) / (t1 - t0);
        var AX =
            this.mPositions[i + 1].x -
            this.mControls[2 * i + 1].x * 3.0 +
            this.mControls[2 * i].x * 3.0 -
            this.mPositions[i].x;
        var AY =
            this.mPositions[i + 1].y -
            this.mControls[2 * i + 1].y * 3.0 +
            this.mControls[2 * i].y * 3.0 -
            this.mPositions[i].y;
        var BX = this.mControls[2 * i + 1].x * 3.0 - this.mControls[2 * i].x * 6.0 + this.mPositions[i].x * 3.0;
        var BY = this.mControls[2 * i + 1].y * 3.0 - this.mControls[2 * i].y * 6.0 + this.mPositions[i].y * 3.0;
        var CX = this.mControls[2 * i].x * 3.0 - this.mPositions[i].x * 3.0;
        var CY = this.mControls[2 * i].y * 3.0 - this.mPositions[i].y * 3.0;
        return new GameFramework.geom.TPoint(
            this.mPositions[i].x + (CX + (BX + AX * u) * u) * u,
            this.mPositions[i].y + (CY + (BY + AY * u) * u) * u
        );
    },
    Velocity: function GameFramework_misc_Bezier$Velocity(t, clamp) {
        if (this.mCount < 2) {
            return new GameFramework.geom.TPoint(0, 0);
        }
        if (t <= this.mTimes[0]) {
            if (!clamp) {
                return new GameFramework.geom.TPoint(0, 0);
            }
            return this.mPositions[0];
        } else if (t >= this.mTimes[this.mCount - 1]) {
            if (!clamp) {
                return new GameFramework.geom.TPoint(0, 0);
            }
            return this.mPositions[this.mCount - 1];
        }
        var i;
        for (i = 0; i < this.mCount - 1; ++i) {
            if (t < this.mTimes[i + 1]) {
                break;
            }
        }
        var t0 = this.mTimes[i];
        var t1 = this.mTimes[i + 1];
        var u = (t - t0) / (t1 - t0);
        var AX =
            this.mPositions[i + 1].x -
            this.mControls[2 * i + 1].x * 3.0 +
            this.mControls[2 * i].x * 3.0 -
            this.mPositions[i].x;
        var AY =
            this.mPositions[i + 1].y -
            this.mControls[2 * i + 1].y * 3.0 +
            this.mControls[2 * i].y * 3.0 -
            this.mPositions[i].y;
        var BX = this.mControls[2 * i + 1].x * 6.0 - this.mControls[2 * i].x * 12.0 + this.mPositions[i].x * 6.0;
        var BY = this.mControls[2 * i + 1].y * 6.0 - this.mControls[2 * i].y * 12.0 + this.mPositions[i].y * 6.0;
        var CX = this.mControls[2 * i].x * 3.0 - this.mPositions[i].x * 3.0;
        var CY = this.mControls[2 * i].y * 3.0 - this.mPositions[i].y * 3.0;
        return new GameFramework.geom.TPoint(CX + (BX + AX * u * 3.0) * u, CY + (BY + AY * u * 3.0) * u);
    },
    Acceleration: function GameFramework_misc_Bezier$Acceleration(t) {
        if (this.mCount < 2) {
            return new GameFramework.geom.TPoint(0, 0);
        }
        if (t <= this.mTimes[0]) {
            return this.mPositions[0];
        } else if (t >= this.mTimes[this.mCount - 1]) {
            return this.mPositions[this.mCount - 1];
        }
        var i;
        for (i = 0; i < this.mCount - 1; ++i) {
            if (t < this.mTimes[i + 1]) {
                break;
            }
        }
        var t0 = this.mTimes[i];
        var t1 = this.mTimes[i + 1];
        var u = (t - t0) / (t1 - t0);
        var AX =
            this.mPositions[i + 1].x -
            this.mControls[2 * i + 1].x * 3.0 +
            this.mControls[2 * i].x * 3.0 -
            this.mPositions[i].x;
        var AY =
            this.mPositions[i + 1].y -
            this.mControls[2 * i + 1].y * 3.0 +
            this.mControls[2 * i].y * 3.0 -
            this.mPositions[i].y;
        var BX = this.mControls[2 * i + 1].x * 6.0 - this.mControls[2 * i].x * 12.0 + this.mPositions[i].x * 6.0;
        var BY = this.mControls[2 * i + 1].y * 6.0 - this.mControls[2 * i].y * 12.0 + this.mPositions[i].y * 6.0;
        return new GameFramework.geom.TPoint(BX + AX * u * 6.0, BY + AY * u * 6.0);
    },
    ArcLength: function GameFramework_misc_Bezier$ArcLength(t1, t2) {
        if (t2 <= t1) {
            return 0.0;
        }
        if (t1 < this.mTimes[0]) {
            t1 = this.mTimes[0];
        }
        if (t2 > this.mTimes[this.mCount - 1]) {
            t2 = this.mTimes[this.mCount - 1];
        }
        var seg1;
        for (seg1 = 0; seg1 < this.mCount - 1; ++seg1) {
            if (t1 < this.mTimes[seg1 + 1]) {
                break;
            }
        }
        var u1 = (t1 - this.mTimes[seg1]) / (this.mTimes[seg1 + 1] - this.mTimes[seg1]);
        var seg2;
        for (seg2 = 0; seg2 < this.mCount - 1; ++seg2) {
            if (t2 <= this.mTimes[seg2 + 1]) {
                break;
            }
        }
        var u2 = (t2 - this.mTimes[seg2]) / (this.mTimes[seg2 + 1] - this.mTimes[seg2]);
        var result;
        if (seg1 == seg2) {
            result = this.SegmentArcLength(seg1, u1, u2);
        } else {
            result = this.SegmentArcLength(seg1, u1, 1.0);
            for (var i = seg1 + 1; i < seg2; ++i) {
                result += this.mLengths[i];
            }
            result += this.SegmentArcLength(seg2, 0.0, u2);
        }
        return result;
    },
    SegmentArcLength: function GameFramework_misc_Bezier$SegmentArcLength(i, u1, u2) {
        if (u2 <= u1) {
            return 0.0;
        }
        if (u1 < 0.0) {
            u1 = 0.0;
        }
        if (u2 > 1.0) {
            u2 = 1.0;
        }
        var P0 = this.mPositions[i];
        var P1 = this.mControls[2 * i];
        var P2 = this.mControls[2 * i + 1];
        var P3 = this.mPositions[i + 1];
        var minus_u2 = 1.0 - u2;
        var L1X = P0.x * minus_u2 + P1.x * u2;
        var L1Y = P0.y * minus_u2 + P1.y * u2;
        var HX = P1.x * minus_u2 + P2.x * u2;
        var HY = P1.y * minus_u2 + P2.y * u2;
        var L2X = L1X * minus_u2 + HX * u2;
        var L2Y = L1Y * minus_u2 + HY * u2;
        var L3X = L2X * minus_u2 + (HX * minus_u2 + (P2.x * minus_u2 + P3.x * u2) * u2) * u2;
        var L3Y = L2Y * minus_u2 + (HY * minus_u2 + (P2.y * minus_u2 + P3.y * u2) * u2) * u2;
        var minus_u1 = 1.0 - u1;
        HX = L1X * minus_u1 + L2X * u1;
        HY = L1Y * minus_u1 + L2Y * u1;
        var R3X = L3X;
        var R3Y = L3Y;
        var R2X = L2X * minus_u1 + L3X * u1;
        var R2Y = L2Y * minus_u1 + L3Y * u1;
        var R1X = HX * minus_u1 + R2X * u1;
        var R1Y = HY * minus_u1 + R2Y * u1;
        var R0X = ((P0.x * minus_u1 + L1X * u1) * minus_u1 + HX * u1) * minus_u1 + R1X * u1;
        var R0Y = ((P0.y * minus_u1 + L1Y * u1) * minus_u1 + HY * u1) * minus_u1 + R1Y * u1;
        return this.SubdivideLength(R0X, R0Y, R1X, R1Y, R2X, R2Y, R3X, R3Y);
    },
    SubdivideLength: function GameFramework_misc_Bezier$SubdivideLength(P0X, P0Y, P1X, P1Y, P2X, P2Y, P3X, P3Y) {
        var Lmin = this.Distance(P0X, P0Y, P3X, P3Y);
        var Lmax =
            this.Distance(P0X, P0Y, P1X, P1Y) + this.Distance(P1X, P1Y, P2X, P2Y) + this.Distance(P2X, P2Y, P3X, P3Y);
        var diff = Lmin - Lmax;
        if (diff * diff < 0.001) {
            return 0.5 * (Lmin + Lmax);
        }
        var L1X = (P0X + P1X) * 0.5;
        var L1Y = (P0Y + P1Y) * 0.5;
        var HX = (P1X + P2X) * 0.5;
        var HY = (P1Y + P2Y) * 0.5;
        var L2X = (L1X + HX) * 0.5;
        var L2Y = (L1Y + HY) * 0.5;
        var R2X = (P2X + P3X) * 0.5;
        var R2Y = (P2Y + P3Y) * 0.5;
        var R1X = (HX + R2X) * 0.5;
        var R1Y = (HY + R2Y) * 0.5;
        var midX = (L2X + R1X) * 0.5;
        var midY = (L2Y + R1Y) * 0.5;
        return (
            this.SubdivideLength(P0X, P0Y, L1X, L1Y, L2X, L2Y, midX, midY) +
            this.SubdivideLength(midX, midY, R1X, R1Y, R2X, R2Y, P3X, P3Y)
        );
    },
};
GameFramework.misc.Bezier.staticInit = function GameFramework_misc_Bezier$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.misc.Bezier.registerClass("GameFramework.misc.Bezier", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.misc.Bezier.staticInit();
});
