GameFramework.CurvedVal = function GameFramework_CurvedVal(theOptionalCurve) {
    if (theOptionalCurve === undefined) {
        theOptionalCurve = "";
    }
    this.InitVarDefaults();
    if (theOptionalCurve.length > 0) {
        this.SetCurve(theOptionalCurve);
    }
};
GameFramework.CurvedVal.CreateAsConstant = function GameFramework_CurvedVal$CreateAsConstant(theVal) {
    var ret = new GameFramework.CurvedVal();
    ret.SetConstant(theVal);
    return ret;
};
GameFramework.CurvedVal.CVCharToFloat = function GameFramework_CurvedVal$CVCharToFloat(theChar) {
    if (theChar >= 92) {
        theChar--;
    }
    return (theChar - 35) / 90.0;
};
GameFramework.CurvedVal.CVCharToInt = function GameFramework_CurvedVal$CVCharToInt(theChar) {
    if (theChar >= 92) {
        theChar--;
    }
    return theChar - 35;
};
GameFramework.CurvedVal.CVStrToAngle = function GameFramework_CurvedVal$CVStrToAngle(theStr) {
    var aAngleInt = 0;
    aAngleInt += GameFramework.CurvedVal.CVCharToInt(GameFramework.Utils.GetCharCodeAt(theStr, 0));
    aAngleInt *= 90;
    aAngleInt += GameFramework.CurvedVal.CVCharToInt(GameFramework.Utils.GetCharCodeAt(theStr, 1));
    aAngleInt *= 90;
    aAngleInt += GameFramework.CurvedVal.CVCharToInt(GameFramework.Utils.GetCharCodeAt(theStr, 2));
    return (aAngleInt * 360.0) / (90.0 * 90.0 * 90.0);
};
GameFramework.CurvedVal.prototype = {
    mMode: 0,
    mRamp: 0,
    mIncRate: 0,
    mOutMin: 0,
    mOutMax: 0,
    mChangeIdx: 0,
    mInitAppUpdateCount: 0,
    mAppUpdateCountSrc: null,
    mLinkedVal: null,
    mRefName: null,
    mCurveCacheRecord: null,
    mCurOutVal: 0,
    mPrevOutVal: 0,
    mInMin: 0,
    mInMax: 0,
    mNoClip: null,
    mSingleTrigger: null,
    mOutputSync: null,
    mTriggered: null,
    mIsHermite: null,
    mAutoInc: null,
    mInitialized: false,
    mPrevInVal: 0,
    mInVal: 0,
    SetCurveRefLinked: function GameFramework_CurvedVal$SetCurveRefLinked(theRef, theLinkedVal) {
        var aCurveData;
        //JS
        var aCurveData = "";
        aCurveData = Game.CurvedValTable[theRef];
        //-JS
        this.SetCurveLinked(aCurveData, theLinkedVal);
        this.mRefName = theRef;
        return this;
    },
    SetCurveRef: function GameFramework_CurvedVal$SetCurveRef(theRef) {
        var aCurveData;
        //JS
        var aCurveData = "";
        aCurveData = Game.CurvedValTable[theRef];
        //-JS
        this.SetCurveLinked(aCurveData, null);
        this.mRefName = theRef;
        return this;
    },
    SetCurveLinked: function GameFramework_CurvedVal$SetCurveLinked(theData, theLinkedVal) {
        this.mRefName = null;
        if (this.mAppUpdateCountSrc != null) {
            this.mInitAppUpdateCount = this.mAppUpdateCountSrc.mUpdateCnt;
        } else {
            this.mInitAppUpdateCount = GameFramework.BaseApp.mApp.mUpdateCnt;
        }
        this.mTriggered = false;
        this.mLinkedVal = theLinkedVal;
        this.mRamp = GameFramework.CurvedVal.RAMP_CURVEDATA;
        this.ParseDataString(theData);
        this.mInVal = this.mInMin;
        return this;
    },
    SetCurve: function GameFramework_CurvedVal$SetCurve(theData) {
        this.SetCurveLinked(theData, null);
        return this;
    },
    InitVarDefaults: function GameFramework_CurvedVal$InitVarDefaults() {
        this.mMode = GameFramework.CurvedVal.MODE_CLAMP;
        this.mRamp = GameFramework.CurvedVal.RAMP_NONE;
        this.mCurveCacheRecord = null;
        this.mSingleTrigger = false;
        this.mNoClip = false;
        this.mOutputSync = false;
        this.mTriggered = false;
        this.mIsHermite = false;
        this.mAutoInc = false;
        this.mInitAppUpdateCount = 0;
        this.mAppUpdateCountSrc = null;
        this.mOutMin = 0.0;
        this.mOutMax = 1.0;
        this.mInMin = 0.0;
        this.mInMax = 1.0;
        this.mLinkedVal = null;
        this.mCurOutVal = 0;
        this.mInVal = 0.0;
        this.mPrevInVal = 0.0;
        this.mIncRate = 0;
        this.mPrevOutVal = 0;
    },
    GenerateTable: function GameFramework_CurvedVal$GenerateTable(theDataPointVector, theBuffer) {
        var aSpline = new GameFramework.misc.BSpline();
        var i;
        for (i = 0; i < (theDataPointVector.length | 0); i++) {
            var aCurvePoint = theDataPointVector[i];
            aSpline.AddPoint(aCurvePoint.mX, aCurvePoint.mY);
        }
        aSpline.CalculateSpline(false);
        var first = true;
        var aLastGX = 0;
        var aLastX = 0;
        var aLastY = 0;
        var aDataPointLength = theDataPointVector.length;
        var aBufferLength = theBuffer.length;
        for (i = 1; i < aDataPointLength; i++) {
            var aPrevPoint = theDataPointVector[i - 1];
            var aPoint = theDataPointVector[i];
            var aStartX = (aPrevPoint.mX * (aBufferLength - 1) + 0.5) | 0;
            var anEndX = (aPoint.mX * (aBufferLength - 1) + 0.5) | 0;
            for (var aCheckX = aStartX; aCheckX <= anEndX; aCheckX++) {
                var aT = i - 1 + (aCheckX - aStartX) / (anEndX - aStartX);
                var aSY = aSpline.GetYPoint(aT);
                var aSX = aSpline.GetXPoint(aT);
                var aGX = (aSX * (aBufferLength - 1) + 0.5) | 0;
                if (aGX >= aLastGX && aGX <= anEndX) {
                    if (!first) {
                        var aVal;
                        if (aGX > aLastGX + 1) {
                            for (var aX = aLastGX; aX <= aGX; aX++) {
                                var aDist = (aX - aLastGX) / (aGX - aLastGX);
                                aVal = aDist * aSY + (1.0 - aDist) * aLastY;
                                if (!this.mNoClip) {
                                    aVal = Math.min(Math.max(aVal, 0.0), 1.0);
                                }
                                theBuffer[aX] = aVal;
                            }
                        } else {
                            aVal = aSY;
                            if (!this.mNoClip) {
                                aVal = Math.min(Math.max(aVal, 0.0), 1.0);
                            }
                            theBuffer[aGX] = aVal;
                        }
                    }
                    aLastGX = aGX;
                    aLastX = aSX;
                    aLastY = aSY;
                    first = false;
                }
            }
        }
        for (i = 0; i < aDataPointLength; i++) {
            var anExactPoint = theDataPointVector[i];
            var aXPt = (anExactPoint.mX * (aBufferLength - 1) + 0.5) | 0;
            theBuffer[aXPt] = anExactPoint.mY;
        }
    },
    ParseDataString: function GameFramework_CurvedVal$ParseDataString(theString) {
        this.mIncRate = 0;
        this.mOutMin = 0;
        this.mOutMax = 1;
        this.mSingleTrigger = false;
        this.mNoClip = false;
        this.mOutputSync = false;
        this.mIsHermite = false;
        this.mAutoInc = false;
        var anIdx = 0;
        var aVersion = 0;
        var aFirstChar = GameFramework.Utils.GetCharCodeAt(theString, 0);
        if (aFirstChar >= 97 && aFirstChar <= 98) {
            aVersion = aFirstChar - 97;
        }
        anIdx++;
        if (aVersion >= 1) {
            var aFlags = GameFramework.CurvedVal.CVCharToInt(GameFramework.Utils.GetCharCodeAt(theString, anIdx++));
            this.mNoClip = (aFlags & GameFramework.CurvedVal.DFLAG_NOCLIP) != 0;
            this.mSingleTrigger = (aFlags & GameFramework.CurvedVal.DFLAG_SINGLETRIGGER) != 0;
            this.mOutputSync = (aFlags & GameFramework.CurvedVal.DFLAG_OUTPUTSYNC) != 0;
            this.mIsHermite = (aFlags & GameFramework.CurvedVal.DFLAG_HERMITE) != 0;
            this.mAutoInc = (aFlags & GameFramework.CurvedVal.DFLAG_AUTOINC) != 0;
        }
        var aCommaPos = theString.indexOf(String.fromCharCode(44), anIdx) | 0;
        if (aCommaPos == -1) {
            this.mIsHermite = true;
            return;
        }
        var aVal = GameFramework.Utils.ToFloat(theString.substr(anIdx, aCommaPos - anIdx));
        this.mOutMin = aVal;
        anIdx = aCommaPos + 1;
        aCommaPos = theString.indexOf(String.fromCharCode(44), anIdx);
        if (aCommaPos == -1) {
            return;
        }
        aVal = GameFramework.Utils.ToFloat(theString.substr(anIdx, aCommaPos - anIdx));
        this.mOutMax = aVal;
        anIdx = aCommaPos + 1;
        aCommaPos = theString.indexOf(String.fromCharCode(44), anIdx);
        if (aCommaPos == -1) {
            return;
        }
        aVal = GameFramework.Utils.ToFloat(theString.substr(anIdx, aCommaPos - anIdx));
        this.mIncRate = aVal;
        anIdx = aCommaPos + 1;
        if (aVersion >= 1) {
            aCommaPos = theString.indexOf(String.fromCharCode(44), anIdx);
            if (aCommaPos == -1) {
                return;
            }
            aVal = GameFramework.Utils.ToFloat(theString.substr(anIdx, aCommaPos - anIdx));
            this.mInMax = aVal;
            anIdx = aCommaPos + 1;
        }
        var aCurveString = theString.substr(anIdx);
        this.mChangeIdx = GameFramework.CurvedVal.mCurCurveChangeIdx;
        this.mCurveCacheRecord = GameFramework.CurvedVal.mCurveCacheMap[aCurveString];
        if (this.mCurveCacheRecord == null) {
            this.mCurveCacheRecord = new GameFramework.misc.CurveCacheRecord();
            GameFramework.CurvedVal.mCurveCacheMap[aCurveString] = this.mCurveCacheRecord;
            var aDataPointVector = [];
            var aCurTime = 0;
            while (anIdx < theString.length) {
                var aChar = GameFramework.Utils.GetCharCodeAt(theString, anIdx++);
                var aDataPoint = new GameFramework.misc.CurveValDataPoint();
                aDataPoint.mX = aCurTime;
                aDataPoint.mY = GameFramework.CurvedVal.CVCharToFloat(aChar);
                if (this.mIsHermite) {
                    var aAngleStr = theString.substr(anIdx, 3);
                    aDataPoint.mAngleDeg = GameFramework.CurvedVal.CVStrToAngle(aAngleStr);
                    anIdx += 3;
                } else {
                    aDataPoint.mAngleDeg = 0.0;
                }
                aDataPointVector.push(aDataPoint);
                while (anIdx < theString.length) {
                    aChar = GameFramework.Utils.GetCharCodeAt(theString, anIdx++);
                    if (aChar == 32) {
                        aCurTime += 0.1;
                        continue;
                    }
                    aCurTime = Math.min(aCurTime + GameFramework.CurvedVal.CVCharToFloat(aChar) * 0.1, 1.0);
                    break;
                }
            }
            if (!this.mIsHermite) {
                this.mCurveCacheRecord.mTable = Array.Create(GameFramework.CurvedVal.CV_NUM_SPLINE_POINTS, null);
                this.GenerateTable(aDataPointVector, this.mCurveCacheRecord.mTable);
            }
            this.mCurveCacheRecord.mDataStr = theString;
            this.mCurveCacheRecord.mHermiteCurve = new GameFramework.misc.SexyMathHermite();
            this.mCurveCacheRecord.mHermiteCurve.mPoints.clear();
            for (var i = 0; i < (aDataPointVector.length | 0); ++i) {
                var aPoint = aDataPointVector[i];
                var aSlope = Math.tan((aPoint.mAngleDeg * 3.14159) / 180.0);
                this.mCurveCacheRecord.mHermiteCurve.AddPoint(aPoint.mX, aPoint.mY, aSlope);
            }
            this.mCurveCacheRecord.mHermiteCurve.Rebuild();
        }
        this.mInitialized = true;
    },
    SetCurveMultLinked: function GameFramework_CurvedVal$SetCurveMultLinked(theData, theLinkedVal) {
        var aCurVal = this.GetOutVal();
        this.SetCurveLinked(theData, theLinkedVal);
        this.mOutMax *= aCurVal;
    },
    SetCurveMult: function GameFramework_CurvedVal$SetCurveMult(theData) {
        var aCurVal = this.GetOutVal();
        this.SetCurveLinked(theData, null);
        this.mOutMax *= aCurVal;
    },
    SetConstant: function GameFramework_CurvedVal$SetConstant(theValue) {
        this.mInVal = 0;
        this.mTriggered = false;
        this.mLinkedVal = null;
        this.mRamp = GameFramework.CurvedVal.RAMP_NONE;
        this.mInMin = this.mInMax = 0;
        this.mOutMin = this.mOutMax = theValue;
        this.mIncRate = 0;
        this.mInitialized = true;
    },
    IsInitialized: function GameFramework_CurvedVal$IsInitialized() {
        return this.mInitialized;
    },
    CheckCurveChange: function GameFramework_CurvedVal$CheckCurveChange() {
        if (this.mRefName != null && GameFramework.CurvedVal.mCurCurveChangeIdx != this.mChangeIdx) {
            this.ParseDataString(GameFramework.CurvedVal.mRefToStringMap[this.mRefName]);
        }
    },
    CheckClamping: function GameFramework_CurvedVal$CheckClamping() {
        this.CheckCurveChange();
        if (this.mMode == GameFramework.CurvedVal.MODE_CLAMP) {
            if (this.mInVal < this.mInMin) {
                this.mInVal = this.mInMin;
                return false;
            }
            if (this.mInVal > this.mInMax) {
                this.mInVal = this.mInMax;
                return false;
            }
        } else if (
            this.mMode == GameFramework.CurvedVal.MODE_REPEAT ||
            this.mMode == GameFramework.CurvedVal.MODE_PING_PONG
        ) {
            var aRangeSpan = this.mInMax - this.mInMin;
            if (this.mInVal > this.mInMax || this.mInVal < this.mInMin) {
                this.mInVal = this.mInMin + ((this.mInVal - this.mInMin + aRangeSpan) % aRangeSpan);
            }
        }
        return true;
    },
    SetMode: function GameFramework_CurvedVal$SetMode(theMode) {
        this.mMode = theMode;
    },
    SetRamp: function GameFramework_CurvedVal$SetRamp(theRamp) {
        this.mRamp = theRamp;
    },
    SetOutRange: function GameFramework_CurvedVal$SetOutRange(theMin, theMax) {
        this.mOutMin = theMin;
        this.mOutMax = theMax;
    },
    SetInRange: function GameFramework_CurvedVal$SetInRange(theMin, theMax) {
        this.mInMin = theMin;
        this.mInMax = theMax;
    },
    get_v: function GameFramework_CurvedVal$get_v() {
        if (this.mRamp == GameFramework.CurvedVal.RAMP_NONE) {
            return this.mOutMin;
        } else {
            return this.GetOutVal();
        }
    },
    GetOutValAt: function GameFramework_CurvedVal$GetOutValAt(theInVal) {
        var anAngle;
        switch (this.mRamp) {
            case GameFramework.CurvedVal.RAMP_NONE: {
                return this.mOutMin;
            }
            case GameFramework.CurvedVal.RAMP_LINEAR: {
                if (this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    if (theInVal - this.mInMin <= (this.mInMax - this.mInMin) / 2.0) {
                        return (
                            this.mOutMin +
                            ((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) *
                                (this.mOutMax - this.mOutMin) *
                                2.0
                        );
                    } else {
                        return (
                            this.mOutMin +
                            (1.0 - (theInVal - this.mInMin) / (this.mInMax - this.mInMin)) *
                                (this.mOutMax - this.mOutMin) *
                                2.0
                        );
                    }
                } else {
                    if (this.mInMin == this.mInMax) {
                        return this.mOutMin;
                    } else {
                        return (
                            this.mOutMin +
                            ((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) * (this.mOutMax - this.mOutMin)
                        );
                    }
                }
            }
            case GameFramework.CurvedVal.RAMP_SLOW_TO_FAST: {
                anAngle = (((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) * GameFramework.CurvedVal.PI) / 2.0;
                if (this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    anAngle *= 2.0;
                }
                if (anAngle > GameFramework.CurvedVal.PI / 2.0) {
                    anAngle = GameFramework.CurvedVal.PI - anAngle;
                }
                return this.mOutMin + (1.0 - Math.cos(anAngle)) * (this.mOutMax - this.mOutMin);
            }
            case GameFramework.CurvedVal.RAMP_FAST_TO_SLOW: {
                anAngle = (((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) * GameFramework.CurvedVal.PI) / 2.0;
                if (this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    anAngle *= 2.0;
                }
                return this.mOutMin + Math.sin(anAngle) * (this.mOutMax - this.mOutMin);
            }
            case GameFramework.CurvedVal.RAMP_SLOW_FAST_SLOW: {
                anAngle = ((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) * GameFramework.CurvedVal.PI;
                if (this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    anAngle *= 2.0;
                }
                return this.mOutMin + ((-Math.cos(anAngle) + 1.0) / 2.0) * (this.mOutMax - this.mOutMin);
            }
            case GameFramework.CurvedVal.RAMP_FAST_SLOW_FAST: {
                anAngle = ((theInVal - this.mInMin) / (this.mInMax - this.mInMin)) * GameFramework.CurvedVal.PI;
                if (this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    anAngle *= 2.0;
                }
                if (anAngle > GameFramework.CurvedVal.PI) {
                    anAngle = GameFramework.CurvedVal.PI * 2 - anAngle;
                }
                if (anAngle < GameFramework.CurvedVal.PI / 2.0) {
                    return this.mOutMin + (Math.sin(anAngle) / 2.0) * (this.mOutMax - this.mOutMin);
                } else {
                    return this.mOutMin + ((2.0 - Math.sin(anAngle)) / 2.0) * (this.mOutMax - this.mOutMin);
                }
            }
            case GameFramework.CurvedVal.RAMP_CURVEDATA: {
                this.CheckCurveChange();
                if (this.mCurveCacheRecord == null) {
                    return 0;
                }
                if (this.mInMax - this.mInMin == 0) {
                    return 0;
                }
                var aCheckInVal = Math.min((theInVal - this.mInMin) / (this.mInMax - this.mInMin), 1.0);
                if (this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
                    if (aCheckInVal > 0.5) {
                        aCheckInVal = (1.0 - aCheckInVal) * 2.0;
                    } else {
                        aCheckInVal *= 2.0;
                    }
                }
                if (this.mIsHermite) {
                    var anOutVal =
                        this.mOutMin +
                        this.mCurveCacheRecord.mHermiteCurve.Evaluate(aCheckInVal) * (this.mOutMax - this.mOutMin);
                    if (!this.mNoClip) {
                        if (this.mOutMin < this.mOutMax) {
                            anOutVal = Math.min(Math.max(anOutVal, this.mOutMin), this.mOutMax);
                        } else {
                            anOutVal = Math.max(Math.min(anOutVal, this.mOutMin), this.mOutMax);
                        }
                    }
                    return anOutVal;
                }
                var aGX = aCheckInVal * (GameFramework.CurvedVal.CV_NUM_SPLINE_POINTS - 1);
                var aLeft = aGX | 0;
                if (aLeft == GameFramework.CurvedVal.CV_NUM_SPLINE_POINTS - 1) {
                    return this.mOutMin + this.mCurveCacheRecord.mTable[aLeft] * (this.mOutMax - this.mOutMin);
                }
                var aFrac = aGX - aLeft;
                var aTableOutVal =
                    this.mOutMin +
                    (this.mCurveCacheRecord.mTable[aLeft] * (1.0 - aFrac) +
                        this.mCurveCacheRecord.mTable[aLeft + 1] * aFrac) *
                        (this.mOutMax - this.mOutMin);
                return aTableOutVal;
            }
        }
        return this.mOutMin;
    },
    GetOutFinalVal: function GameFramework_CurvedVal$GetOutFinalVal() {
        return this.GetOutValAt(this.mInMax);
    },
    GetOutVal: function GameFramework_CurvedVal$GetOutVal() {
        var anOutVal = this.GetOutValAt(this.GetInVal());
        this.mCurOutVal = anOutVal;
        return anOutVal;
    },
    GetInVal: function GameFramework_CurvedVal$GetInVal() {
        var anInVal = this.mInVal;
        if (this.mLinkedVal != null) {
            if (this.mLinkedVal.mOutputSync) {
                anInVal = this.mLinkedVal.GetOutVal();
            } else {
                anInVal = this.mLinkedVal.GetInVal();
            }
        } else if (this.mAutoInc) {
            var aCurUpdateCnt;
            if (this.mAppUpdateCountSrc != null) {
                aCurUpdateCnt = this.mAppUpdateCountSrc.mUpdateCnt;
            } else {
                aCurUpdateCnt = GameFramework.BaseApp.mApp.mUpdateCnt;
            }
            anInVal =
                this.mInMin +
                ((aCurUpdateCnt - this.mInitAppUpdateCount) * this.mIncRate * GameFramework.BaseApp.mApp.mFrameTime) /
                    10.0;
            if (
                this.mMode == GameFramework.CurvedVal.MODE_REPEAT ||
                this.mMode == GameFramework.CurvedVal.MODE_PING_PONG
            ) {
                anInVal = ((anInVal - this.mInMin) % (this.mInMax - this.mInMin)) + this.mInMin;
            } else {
                anInVal = Math.min(anInVal, this.mInMax);
            }
        }
        if (this.mMode == GameFramework.CurvedVal.MODE_PING_PONG) {
            var aCheckInVal = (anInVal - this.mInMin) / (this.mInMax - this.mInMin);
            if (aCheckInVal > 0.5) {
                return this.mInMin + (1.0 - aCheckInVal) * 2 * (this.mInMax - this.mInMin);
            } else {
                return this.mInMin + aCheckInVal * 2 * (this.mInMax - this.mInMin);
            }
        } else {
            return anInVal;
        }
    },
    SetInVal: function GameFramework_CurvedVal$SetInVal(theVal, theRealignAutoInc) {
        this.mPrevOutVal = this.GetOutVal();
        this.mTriggered = false;
        this.mPrevInVal = theVal;
        if (this.mAutoInc && theRealignAutoInc) {
            this.mInitAppUpdateCount -= (((theVal - this.mInVal) * 1000.0) / GameFramework.BaseApp.mApp.mFrameTime) | 0;
        }
        this.mInVal = theVal;
        var going = this.CheckClamping();
        if (!going) {
            if (!this.mTriggered) {
                this.mTriggered = true;
                return false;
            }
            return this.mSingleTrigger;
        }
        return true;
    },
    IncInValBy: function GameFramework_CurvedVal$IncInValBy(theInc) {
        this.mPrevOutVal = this.GetOutVal();
        this.mPrevInVal = this.mInVal;
        this.mInVal += theInc;
        var going = this.CheckClamping();
        if (!going) {
            if (!this.mTriggered) {
                this.mTriggered = true;
                return false;
            }
            return this.mSingleTrigger;
        }
        return true;
    },
    IncInVal: function GameFramework_CurvedVal$IncInVal() {
        if (this.mIncRate == 0.0) {
            return false;
        }
        return this.IncInValBy((this.mIncRate * GameFramework.BaseApp.mApp.mFrameTime) / 10.0);
    },
    CheckInThreshold: function GameFramework_CurvedVal$CheckInThreshold(theInVal) {
        var aCurInVal = this.mInVal;
        var aPrevInVal = this.mPrevInVal;
        if (this.mAutoInc) {
            aCurInVal = this.GetInVal();
            aPrevInVal = aCurInVal - this.mIncRate * 1.5;
        }
        return theInVal > aPrevInVal && theInVal <= aCurInVal;
    },
    CheckUpdatesFromEndThreshold: function GameFramework_CurvedVal$CheckUpdatesFromEndThreshold(theUpdateCount) {
        return this.CheckInThreshold(this.GetInValAtUpdate(this.GetLengthInUpdates() - theUpdateCount));
    },
    GetInValAtUpdate: function GameFramework_CurvedVal$GetInValAtUpdate(theUpdateCount) {
        return this.mInMin + theUpdateCount * this.mIncRate;
    },
    GetLengthInUpdates: function GameFramework_CurvedVal$GetLengthInUpdates() {
        if (this.mIncRate == 0) {
            return -1;
        }
        return Math.ceil((this.mInMax - this.mInMin) / this.mIncRate) | 0;
    },
    GetOutValDelta: function GameFramework_CurvedVal$GetOutValDelta() {
        return this.GetOutVal() - this.mPrevOutVal;
    },
    HasBeenTriggered: function GameFramework_CurvedVal$HasBeenTriggered() {
        if (this.mAutoInc) {
            this.mTriggered = this.GetInVal() == this.mInMax;
        }
        return this.mTriggered;
    },
    ClearTrigger: function GameFramework_CurvedVal$ClearTrigger() {
        this.mTriggered = false;
    },
    IsDoingCurve: function GameFramework_CurvedVal$IsDoingCurve() {
        return this.GetInVal() != this.mInMax && this.mRamp != GameFramework.CurvedVal.RAMP_NONE;
    },
    Intercept: function GameFramework_CurvedVal$Intercept(theDataP) {
        this.InterceptEx(theDataP, 0.01, false);
    },
    InterceptEx: function GameFramework_CurvedVal$InterceptEx(theDataP, theCheckInIncrPct, theStopAtLocalMin) {
        var curInVal = this.get_v();
        if (theDataP.indexOf(String.fromCharCode(44)) != -1) {
            this.SetCurve(theDataP);
        } else {
            this.SetCurveRef(theDataP);
        }
        this.SetInVal(this.FindClosestInToOutVal(curInVal, theCheckInIncrPct, 0.0, 1.0, theStopAtLocalMin), true);
    },
    FindClosestInToOutVal: function GameFramework_CurvedVal$FindClosestInToOutVal(
        theTargetOutVal,
        theCheckInIncrPct,
        theCheckInRangeMinPct,
        theCheckInRangeMaxPct,
        theStopAtLocalMin
    ) {
        var delta = this.mInMax - this.mInMin;
        var toVal = this.mInMin + delta * theCheckInRangeMaxPct;
        var bestOutVal = 0;
        var bestInVal = -1.0;
        for (
            var checkInVal = this.mInMin + delta * theCheckInRangeMinPct;
            checkInVal <= toVal;
            checkInVal += delta * theCheckInIncrPct
        ) {
            var curDelta = Math.abs(theTargetOutVal - this.GetOutValAt(checkInVal));
            if (bestInVal < 0.0 || curDelta < bestOutVal) {
                bestOutVal = curDelta;
                bestInVal = checkInVal;
            } else if (theStopAtLocalMin) {
                return bestInVal;
            }
        }
        return bestInVal;
    },
};
GameFramework.CurvedVal.staticInit = function GameFramework_CurvedVal$staticInit() {
    GameFramework.CurvedVal.CV_NUM_SPLINE_POINTS = 256;
    GameFramework.CurvedVal.PI = 3.14159;
    GameFramework.CurvedVal.MODE_CLAMP = 0;
    GameFramework.CurvedVal.MODE_REPEAT = 1;
    GameFramework.CurvedVal.MODE_PING_PONG = 2;
    GameFramework.CurvedVal.RAMP_NONE = 0;
    GameFramework.CurvedVal.RAMP_LINEAR = 1;
    GameFramework.CurvedVal.RAMP_SLOW_TO_FAST = 2;
    GameFramework.CurvedVal.RAMP_FAST_TO_SLOW = 3;
    GameFramework.CurvedVal.RAMP_SLOW_FAST_SLOW = 4;
    GameFramework.CurvedVal.RAMP_FAST_SLOW_FAST = 5;
    GameFramework.CurvedVal.RAMP_CURVEDATA = 6;
    GameFramework.CurvedVal.DFLAG_NOCLIP = 1;
    GameFramework.CurvedVal.DFLAG_SINGLETRIGGER = 2;
    GameFramework.CurvedVal.DFLAG_OUTPUTSYNC = 4;
    GameFramework.CurvedVal.DFLAG_HERMITE = 8;
    GameFramework.CurvedVal.DFLAG_AUTOINC = 16;
    GameFramework.CurvedVal.mRefToStringMap = null;
    GameFramework.CurvedVal.mCurvedValFileName = null;
    GameFramework.CurvedVal.mCurCurveChangeIdx = 0;
    GameFramework.CurvedVal.mCurveCacheMap = {};
};

JSFExt_AddInitFunc(function () {
    GameFramework.CurvedVal.registerClass("GameFramework.CurvedVal", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.CurvedVal.staticInit();
});
