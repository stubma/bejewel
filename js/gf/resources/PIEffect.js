GameFramework.resources.PIEffect = function GameFramework_resources_PIEffect() {
    this.mStringVector = [];
    this.mDrawTransform = new GameFramework.geom.Matrix();
    this.mEmitterTransform = new GameFramework.geom.Matrix();
    this.mLoaded = false;
    this.mFileIdx = 0;
    this.mAutoPadImages = true;
    this.mFrameNum = 0;
    this.mUpdateCnt = 0;
    this.mCurNumParticles = 0;
    this.mCurNumEmitters = 0;
    this.mLastDrawnPixelCount = 0;
    this.mFirstFrameNum = 0;
    this.mLastFrameNum = 0;
    this.mWantsSRand = true;
    this.mAnimSpeed = 1.0;
    this.mColor = 0xffffffff;
    this.mDebug = false;
    this.mDrawBlockers = true;
    this.mEmitAfterTimeline = false;
    this.mFrameTime = GameFramework.BaseApp.mApp.mFrameTime;
    if (this.mFrameTime < 10) {
        this.mFrameTime *= 2.0;
    }
    this.mDef = new GameFramework.resources.PIEffectDef();
};
GameFramework.resources.PIEffect.WrapFloat = function GameFramework_resources_PIEffect$WrapFloat(theNum, theRepeat) {
    if (theRepeat == 1) {
        return theNum;
    } else {
        theNum *= theRepeat;
        return theNum - (theNum | 0);
    }
};
GameFramework.resources.PIEffect.DegToRad = function GameFramework_resources_PIEffect$DegToRad(theDeg) {
    return (theDeg * 3.14159) / 180.0;
};
GameFramework.resources.PIEffect.LineSegmentIntersects =
    function GameFramework_resources_PIEffect$LineSegmentIntersects(aPtA1, aPtA2, aPtB1, aPtB2) {
        var aDenom = (aPtB2.y - aPtB1.y) * (aPtA2.x - aPtA1.x) - (aPtB2.x - aPtB1.x) * (aPtA2.y - aPtA1.y);
        if (aDenom != 0) {
            var aUa = ((aPtB2.x - aPtB1.x) * (aPtA1.y - aPtB1.y) - (aPtB2.y - aPtB1.y) * (aPtA1.x - aPtB1.x)) / aDenom;
            if (aUa >= 0.0 && aUa <= 1.0) {
                var aUb =
                    ((aPtA2.x - aPtA1.x) * (aPtA1.y - aPtB1.y) - (aPtA2.y - aPtA1.y) * (aPtA1.x - aPtB1.x)) / aDenom;
                if (aUb >= 0.0 && aUb <= 1.0) {
                    var aRetVal = Array.Create(
                        3,
                        3,
                        aUa,
                        aPtA1.x + (aPtA2.x - aPtA1.x) * aUa,
                        aPtA1.y + (aPtA2.y - aPtA1.y) * aUa
                    );
                    return aRetVal;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    };
GameFramework.resources.PIEffect.IntegrateAffectors = function GameFramework_resources_PIEffect$IntegrateAffectors(
    thePIEffect,
    theLayer,
    theEmitterInstance,
    theEmitter,
    theParticleDef,
    theParticleGroup,
    theCurVel,
    theLayerDef,
    theParticleInstance
) {
    var aCurPhysPoint = null;
    if (
        theParticleInstance.mLifePctInt == theParticleInstance.mLifePctIntInc &&
        theLayerDef.mDeflectorVector.length > 0
    ) {
        var aPrevPhysPoint = theParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
        var aPrevPos = theParticleInstance.mPos;
        theParticleInstance.mPos.x += theCurVel.x;
        theParticleInstance.mPos.y += theCurVel.y;
        thePIEffect.CalcParticleTransform(
            theLayer,
            theEmitterInstance,
            theEmitter,
            theParticleDef,
            theParticleGroup,
            theParticleInstance
        );
        aCurPhysPoint = theParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
        for (var aDeflectorIdx = 0; aDeflectorIdx < (theLayerDef.mDeflectorVector.length | 0); aDeflectorIdx++) {
            var aDeflector = theLayerDef.mDeflectorVector[aDeflectorIdx];
            if (aDeflector.mActive.GetLastKeyframe(thePIEffect.mFrameNum) < 0.99) {
                continue;
            }
            for (var aPtIdx = 1; aPtIdx < (aDeflector.mCurPoints.length | 0); aPtIdx++) {
                var aPt1 = aDeflector.mCurPoints[aPtIdx - 1].subtract(
                    new GameFramework.geom.TPoint(thePIEffect.mDrawTransform.tx, thePIEffect.mDrawTransform.ty)
                );
                var aPt2 = aDeflector.mCurPoints[aPtIdx].subtract(
                    new GameFramework.geom.TPoint(thePIEffect.mDrawTransform.tx, thePIEffect.mDrawTransform.ty)
                );
                var aLineDir = new GameFramework.geom.TPoint(aPt2.x - aPt1.x, aPt2.y - aPt1.y);
                var aLineNormal = aLineDir.clone();
                aLineNormal.normalize(1.0);
                var aTemp = aLineNormal.x;
                aLineNormal.x = -aLineNormal.y;
                aLineNormal.y = aTemp;
                var aLineTranslate = new GameFramework.geom.TPoint(aLineNormal.x, aLineNormal.y);
                aLineTranslate.x =
                    aLineTranslate.x * aDeflector.mThickness * theParticleInstance.mThicknessHitVariation;
                aLineTranslate.y =
                    aLineTranslate.y * aDeflector.mThickness * theParticleInstance.mThicknessHitVariation;
                var aLineSegmentResult = GameFramework.resources.PIEffect.LineSegmentIntersects(
                    aPrevPhysPoint,
                    aCurPhysPoint,
                    aPt1.add(aLineTranslate),
                    aPt2.add(aLineTranslate)
                );
                if (aLineSegmentResult != null) {
                    var aCollPoint = new GameFramework.geom.TPoint(aLineSegmentResult[1], aLineSegmentResult[2]);
                    if (thePIEffect.GetRandFloatU() > aDeflector.mHits) {
                        continue;
                    }
                    var aLifePct = theParticleInstance.mLifePctInt / 0x7fffffff;
                    var aBounce = aDeflector.mBounce;
                    if (theParticleGroup.mIsSuperEmitter) {
                        aBounce *=
                            (theParticleGroup.mWasEmitted
                                ? theEmitter.mValues[GameFramework.resources.PIEmitter.Value.BOUNCE | 0].GetValueAt(
                                      thePIEffect.mFrameNum
                                  )
                                : theEmitterInstance.mEmitterInstanceDef.mValues[
                                      GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0
                                  ].GetValueAt(thePIEffect.mFrameNum)) *
                            theEmitter.mValues[
                                GameFramework.resources.PIEmitter.Value.F_BOUNCE_OVER_LIFE | 0
                            ].GetValueAt(aLifePct, 1.0) *
                            (theEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_BOUNCE | 0].GetValueAt(
                                thePIEffect.mFrameNum
                            ) +
                                theParticleInstance.mVariationValues[
                                    GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0
                                ]);
                    } else {
                        aBounce *=
                            (theParticleGroup.mWasEmitted
                                ? theEmitter.mValues[GameFramework.resources.PIEmitter.Value.BOUNCE | 0].GetValueAt(
                                      thePIEffect.mFrameNum
                                  )
                                : theEmitterInstance.mEmitterInstanceDef.mValues[
                                      GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0
                                  ].GetValueAt(thePIEffect.mFrameNum)) *
                            theParticleDef.mValues[
                                GameFramework.resources.PIParticleDef.Value.BOUNCE_OVER_LIFE | 0
                            ].GetValueAt(aLifePct) *
                            (theParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.BOUNCE | 0].GetValueAt(
                                thePIEffect.mFrameNum
                            ) +
                                theParticleInstance.mVariationValues[
                                    GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0
                                ]);
                    }
                    var aCurVelVec = new GameFramework.geom.TPoint(theCurVel.x, theCurVel.y);
                    var aDot = aCurVelVec.x * aLineNormal.x + aCurVelVec.y * aLineNormal.y;
                    var aNewVel = new GameFramework.geom.TPoint(
                        aCurVelVec.x - aLineNormal.x * 2 * aDot,
                        aCurVelVec.y - aLineNormal.y * 2 * aDot
                    );
                    var aPctBounce = Math.min(1.0, Math.abs(aNewVel.y / aNewVel.x));
                    aNewVel.y *= 1.0 - aPctBounce + aPctBounce * Math.pow(aBounce, 0.5);
                    theParticleInstance.mVel.x = aNewVel.x * 100.0;
                    theParticleInstance.mVel.y = aNewVel.y * 100.0;
                    if (aBounce > 0.001) {
                        theParticleInstance.mPos = aPrevPos;
                    }
                    thePIEffect.CalcParticleTransform(
                        theLayer,
                        theEmitterInstance,
                        theEmitter,
                        theParticleDef,
                        theParticleGroup,
                        theParticleInstance
                    );
                    aCurPhysPoint = theParticleInstance.mTransform.transformPoint(
                        new GameFramework.geom.TPoint(0.0, 0.0)
                    );
                }
            }
        }
    } else {
        theParticleInstance.mPos.x += theCurVel.x;
        theParticleInstance.mPos.y += theCurVel.y;
        if (theLayerDef.mForceVector.length > 0) {
            thePIEffect.CalcParticleTransform(
                theLayer,
                theEmitterInstance,
                theEmitter,
                theParticleDef,
                theParticleGroup,
                theParticleInstance
            );
            aCurPhysPoint = theParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0.0, 0.0));
        }
    }
    for (var aForceIdx = 0; aForceIdx < (theLayerDef.mForceVector.length | 0); aForceIdx++) {
        var aForce = theLayerDef.mForceVector[aForceIdx];
        if (aForce.mActive.GetLastKeyframe(thePIEffect.mFrameNum) < 0.99) {
            continue;
        }
        var inside = false;
        var i;
        var j;
        for (i = 0, j = 4 - 1; i < 4; j = i++) {
            if (
                ((aForce.mCurPoints[i].y <= aCurPhysPoint.y && aCurPhysPoint.y < aForce.mCurPoints[j].y) ||
                    (aForce.mCurPoints[j].y <= aCurPhysPoint.y && aCurPhysPoint.y < aForce.mCurPoints[i].y)) &&
                aCurPhysPoint.x <
                    ((aForce.mCurPoints[j].x - aForce.mCurPoints[i].x) * (aCurPhysPoint.y - aForce.mCurPoints[i].y)) /
                        (aForce.mCurPoints[j].y - aForce.mCurPoints[i].y) +
                        aForce.mCurPoints[i].x
            ) {
                inside = !inside;
            }
        }
        if (inside) {
            var anAngle =
                GameFramework.resources.PIEffect.DegToRad(-aForce.mDirection.GetValueAt(thePIEffect.mFrameNum)) +
                GameFramework.resources.PIEffect.DegToRad(-aForce.mAngle.GetValueAt(thePIEffect.mFrameNum));
            var aFactor = (0.085 * thePIEffect.mFramerate) / 100.0;
            aFactor *= 1.0 + (thePIEffect.mFramerate - 100.0) * 0.004;
            var aStrength = aForce.mStrength.GetValueAt(thePIEffect.mFrameNum) * aFactor;
            theParticleInstance.mVel.x += Math.cos(anAngle) * aStrength * 100.0;
            theParticleInstance.mVel.y += Math.sin(anAngle) * aStrength * 100.0;
        }
    }
};
GameFramework.resources.PIEffect.prototype = {
    mAllowDeferredUpdate: false,
    mGlobalAllowPreserveColor: true,
    mReadBuffer: null,
    mFileChecksum: 0,
    mIsPPF: null,
    mAutoPadImages: null,
    mVersion: 0,
    mSrcFileName: null,
    mDestFileName: null,
    mStartupState: null,
    mBufTemp: 0,
    mBufPos: 0,
    mChecksumPos: 0,
    mNotes: null,
    mFileIdx: 0,
    mStringVector: null,
    mWidth: 0,
    mHeight: 0,
    mBkgColor: 0,
    mFramerate: 0,
    mFirstFrameNum: 0,
    mLastFrameNum: 0,
    mThumbnail: null,
    mNotesParams: null,
    mDef: null,
    mLayerVector: null,
    mError: null,
    mLoaded: null,
    mUpdateCnt: 0,
    mFrameNum: 0,
    mIsNewFrame: null,
    mHasEmitterTransform: null,
    mHasDrawTransform: null,
    mDrawTransformSimple: null,
    mCurNumParticles: 0,
    mCurNumEmitters: 0,
    mLastDrawnPixelCount: 0,
    mAnimSpeed: 0,
    mColor: 0,
    mDebug: null,
    mDrawBlockers: null,
    mEmitAfterTimeline: null,
    mRandSeeds: null,
    mWantsSRand: null,
    mDrawTransform: null,
    mEmitterTransform: null,
    mFrameTime: 0,
    InitFrom: function GameFramework_resources_PIEffect$InitFrom(rhs) {
        if (--this.mDef.mRefCount == 0) {
            this.mDef.Dispose();
        }
        this.mFileChecksum = rhs.mFileChecksum;
        this.mSrcFileName = rhs.mSrcFileName;
        this.mVersion = rhs.mVersion;
        this.mStartupState = rhs.mStartupState;
        this.mNotes = rhs.mNotes;
        this.mWidth = rhs.mWidth;
        this.mHeight = rhs.mHeight;
        this.mBkgColor = rhs.mBkgColor;
        this.mFramerate = rhs.mFramerate;
        this.mFirstFrameNum = rhs.mFirstFrameNum;
        this.mLastFrameNum = rhs.mLastFrameNum;
        this.mNotesParams = rhs.mNotesParams;
        this.mError = rhs.mError;
        this.mLoaded = rhs.mLoaded;
        this.mAnimSpeed = rhs.mAnimSpeed;
        this.mColor = rhs.mColor;
        this.mDebug = rhs.mDebug;
        this.mDrawBlockers = rhs.mDrawBlockers;
        this.mEmitAfterTimeline = rhs.mEmitAfterTimeline;
        this.mRandSeeds = rhs.mRandSeeds;
        this.mWantsSRand = rhs.mWantsSRand;
        this.mDrawTransform = rhs.mDrawTransform;
        if (this.mDrawTransform != null) {
            this.mDrawTransform = this.mDrawTransform.clone();
        }
        this.mEmitterTransform = rhs.mEmitterTransform;
        if (this.mEmitterTransform != null) {
            this.mEmitterTransform = this.mEmitterTransform.clone();
        }
        this.mFrameTime = rhs.mFrameTime;
        this.mFileIdx = 0;
        this.mFrameNum = 0;
        this.mUpdateCnt = 0;
        this.mIsNewFrame = false;
        this.mHasEmitterTransform = false;
        this.mHasDrawTransform = false;
        this.mDrawTransformSimple = false;
        this.mCurNumParticles = 0;
        this.mCurNumEmitters = 0;
        this.mLastDrawnPixelCount = 0;
        this.mDef = rhs.mDef;
        this.mDef.mRefCount++;
        this.mLayerVector = [];
        this.mLayerVector.length = this.mDef.mLayerDefVector.length;
        for (var aLayerIdx = 0; aLayerIdx < (this.mLayerVector.length | 0); aLayerIdx++) {
            var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
            var aLayer;
            this.mLayerVector[aLayerIdx] = aLayer = new GameFramework.resources.PILayer();
            aLayer.mLayerDef = aLayerDef;
            aLayer.mEmitterInstanceVector = [];
            aLayer.mEmitterInstanceVector.length = aLayerDef.mEmitterInstanceDefVector.length;
            for (var anEmitterIdx = 0; anEmitterIdx < aLayerDef.mEmitterInstanceDefVector.length; anEmitterIdx++) {
                var aRHSEmitterInstance = rhs.mLayerVector[aLayerIdx].mEmitterInstanceVector[anEmitterIdx];
                var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterIdx];
                var anEmitterInstance;
                aLayer.mEmitterInstanceVector[anEmitterIdx] = anEmitterInstance =
                    new GameFramework.resources.PIEmitterInstance();
                var anEmitter = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                anEmitterInstance.mEmitterInstanceDef = anEmitterInstanceDef;
                anEmitterInstance.mTintColor = aRHSEmitterInstance.mTintColor;
                anEmitterInstance.mParticleDefInstanceVector = [];
                anEmitterInstance.mParticleDefInstanceVector.length = anEmitter.mParticleDefVector.length;
                for (var i = 0; i < anEmitterInstance.mParticleDefInstanceVector.length; i++) {
                    anEmitterInstance.mParticleDefInstanceVector[i] =
                        new GameFramework.resources.PIParticleDefInstance();
                }
                anEmitterInstance.mSuperEmitterParticleDefInstanceVector = [];
                anEmitterInstance.mSuperEmitterParticleDefInstanceVector.length =
                    aRHSEmitterInstance.mSuperEmitterParticleDefInstanceVector.length;
                for (var i_2 = 0; i_2 < anEmitterInstance.mSuperEmitterParticleDefInstanceVector.length; i_2++) {
                    anEmitterInstance.mSuperEmitterParticleDefInstanceVector[i_2] =
                        new GameFramework.resources.PIParticleDefInstance();
                }
            }
        }
        this.DetermineGroupFlags();
        this.ResetAnim();
    },
    Dispose: function GameFramework_resources_PIEffect$Dispose() {
        this.ResetAnim();

        {
            var $srcArray1 = this.mLayerVector;
            for (var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
                var aLayer = $srcArray1[$enum1];

                {
                    var $srcArray2 = aLayer.mEmitterInstanceVector;
                    for (var $enum2 = 0; $enum2 < $srcArray2.length; $enum2++) {
                        var anEmitterInstance = $srcArray2[$enum2];

                        {
                            var $srcArray3 = anEmitterInstance.mParticleDefInstanceVector;
                            for (var $enum3 = 0; $enum3 < $srcArray3.length; $enum3++) {
                                var aParticleDefInstance = $srcArray3[$enum3];
                                aParticleDefInstance.Dispose();
                            }
                        }
                        anEmitterInstance.Dispose();
                    }
                }
                aLayer.Dispose();
            }
        }
        this.mLayerVector = null;
        if (--this.mDef.mRefCount == 0) {
            this.mDef.Dispose();
        }
    },
    IsIdentityMatrix: function GameFramework_resources_PIEffect$IsIdentityMatrix(theMatrix) {
        return (
            theMatrix.a == 1.0 &&
            theMatrix.b == 0.0 &&
            theMatrix.c == 0.0 &&
            theMatrix.d == 1.0 &&
            theMatrix.tx == 0.0 &&
            theMatrix.ty == 0.0
        );
    },
    InterpColor: function GameFramework_resources_PIEffect$InterpColor(theColor1, theColor2, thePct) {
        var Pct = (thePct * 256.0) | 0;
        var InvPct = 256 - Pct;
        var aColor =
            (theColor1 & 0xff000000) |
            ((((theColor1 & 0xff00ff) * InvPct + (theColor2 & 0xff00ff) * Pct) >>> 8) & 0xff00ff) |
            ((((theColor1 & 0xff00) * InvPct + (theColor2 & 0xff00) * Pct) >>> 8) & 0xff00);
        return aColor;
    },
    InterpColorI: function GameFramework_resources_PIEffect$InterpColorI(theColor1, theColor2, Pct) {
        var InvPct = (256 - Pct) | 0;
        var aColor =
            (theColor1 & 0xff000000) |
            ((((((theColor1 & 0xff00ff) * InvPct) | 0) + (((theColor2 & 0xff00ff) * Pct) | 0)) >>> 8) & 0xff00ff) |
            ((((((theColor1 & 0xff00) * InvPct) | 0) + (((theColor2 & 0xff00) * Pct) | 0)) >>> 8) & 0xff00);
        return aColor;
    },
    Duplicate: function GameFramework_resources_PIEffect$Duplicate() {
        var aPIEffect = new GameFramework.resources.PIEffect();
        aPIEffect.InitFrom(this);
        return aPIEffect;
    },
    GetImage: function GameFramework_resources_PIEffect$GetImage(theName, theFilename, theParentStreamer) {
        var aBarPos = theFilename.indexOf(String.fromCharCode(124));
        if (aBarPos != -1) {
            var anId = theFilename.substr(aBarPos + 1);
            var aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImage(anId);
            aResourceStreamer.AddEventListener(
                GameFramework.events.Event.COMPLETE,
                ss.Delegate.create(theParentStreamer, theParentStreamer.ChildCompleted)
            );
            aResourceStreamer.AddEventListener(
                GameFramework.events.IOErrorEvent.IO_ERROR,
                ss.Delegate.create(theParentStreamer, theParentStreamer.ChildFailed)
            );
            theParentStreamer.mResourceCount++;
            GameFramework.BaseApp.mApp.mResourceManager.PrioritizeResourceStreamer(aResourceStreamer);
            return aResourceStreamer;
        }
        return null;
    },
    Fail: function GameFramework_resources_PIEffect$Fail(theError) {
        if (this.mError.length == 0) {
            this.mError = theError;
        }
        return false;
    },
    GetRandFloat: function GameFramework_resources_PIEffect$GetRandFloat() {
        return GameFramework.Utils.GetRandFloat();
    },
    GetRandFloatU: function GameFramework_resources_PIEffect$GetRandFloatU() {
        return GameFramework.Utils.GetRandFloatU();
    },
    GetRandSign: function GameFramework_resources_PIEffect$GetRandSign() {
        if (GameFramework.Utils.GetRand() % 2 == 0) {
            return 1;
        } else {
            return -1;
        }
    },
    GetVariationScalar: function GameFramework_resources_PIEffect$GetVariationScalar() {
        return this.GetRandFloat() * this.GetRandFloat();
    },
    GetVariationScalarU: function GameFramework_resources_PIEffect$GetVariationScalarU() {
        return this.GetRandFloatU() * this.GetRandFloatU();
    },
    ReadTransform2D: function GameFramework_resources_PIEffect$ReadTransform2D(theDataBuffer) {
        var aMatrix = new GameFramework.geom.Matrix();
        aMatrix.a = theDataBuffer.ReadFloat();
        aMatrix.b = theDataBuffer.ReadFloat();
        theDataBuffer.ReadFloat();
        aMatrix.c = theDataBuffer.ReadFloat();
        aMatrix.d = theDataBuffer.ReadFloat();
        theDataBuffer.ReadFloat();
        aMatrix.tx = theDataBuffer.ReadFloat();
        aMatrix.ty = theDataBuffer.ReadFloat();
        theDataBuffer.ReadFloat();
        return aMatrix;
    },
    ReadString: function GameFramework_resources_PIEffect$ReadString() {
        var aLen = this.mReadBuffer.ReadByte();
        return this.mReadBuffer.ReadAsciiBytes(aLen);
    },
    ReadStringS: function GameFramework_resources_PIEffect$ReadStringS() {
        var aLen = this.mReadBuffer.ReadShort();
        var aString;
        if (aLen == -1) {
            var aSomething = this.mReadBuffer.ReadShort();
            aLen = this.mReadBuffer.ReadShort();
        } else if ((aLen & 0x8000) != 0) {
            aString = this.mStringVector[(aLen | 0) & 0x7fff];
            this.mStringVector.push(aString);
            return aString;
        }
        aString = this.mReadBuffer.ReadAsciiBytes(aLen);
        this.mStringVector.push(aString);
        this.mStringVector.push(aString);
        return aString;
    },
    ExpectCmd: function GameFramework_resources_PIEffect$ExpectCmd(theCmdExpected) {
        if (this.mIsPPF) {
            return true;
        }
        var aString = this.ReadStringS();
        if (aString != theCmdExpected) {
            return this.Fail("Expected '" + theCmdExpected + "'");
        }
        return true;
    },
    ReadValue2D: function GameFramework_resources_PIEffect$ReadValue2D(theValue2D) {
        var aKeyCount = this.mReadBuffer.ReadShort();
        var aTimes = Array.Create(aKeyCount, null);
        var aPoints = Array.Create(aKeyCount, null);
        var aControlPoints = Array.Create(aKeyCount, null);
        var hasCurve = false;
        if (this.mIsPPF && aKeyCount > 1) {
            hasCurve = this.mReadBuffer.ReadBoolean();
        }
        theValue2D.mValuePoint2DVector = [];
        for (var aKeyIdx = 0; aKeyIdx < aKeyCount; aKeyIdx++) {
            this.ExpectCmd("CKey");
            var aTime = this.mReadBuffer.ReadInt();
            aTimes[aKeyIdx] = aTime;
            var aPt = new GameFramework.geom.TPoint();
            aPt.x = this.mReadBuffer.ReadFloat();
            aPt.y = this.mReadBuffer.ReadFloat();
            aPoints[aKeyIdx] = aPt;
            if (!this.mIsPPF || hasCurve) {
                var aControlPt1 = new GameFramework.geom.TPoint();
                aControlPt1.x = this.mReadBuffer.ReadFloat();
                aControlPt1.y = this.mReadBuffer.ReadFloat();
                if (aKeyIdx > 0) {
                    aControlPoints[aKeyIdx] = aPt.add(aControlPt1);
                }
                var aControlPt2 = new GameFramework.geom.TPoint();
                aControlPt2.x = this.mReadBuffer.ReadFloat();
                aControlPt2.y = this.mReadBuffer.ReadFloat();
                aControlPoints[aKeyIdx] = aPt.add(aControlPt2);
            }
            if (!this.mIsPPF) {
                var aFlags1 = this.mReadBuffer.ReadInt();
                var aFlags2 = this.mReadBuffer.ReadInt();
                hasCurve |= (aFlags2 & 1) == 0;
            }
            var aValuePoint2D = new GameFramework.resources.PIValuePoint2D();
            aValuePoint2D.mValue = aPt;
            aValuePoint2D.mTime = aTime;
            theValue2D.mValuePoint2DVector.push(aValuePoint2D);
        }
        if (aKeyCount > 1 && hasCurve) {
            theValue2D.mBezier.InitWithControls(aPoints, aControlPoints, aTimes);
        }
    },
    ReadEPoint: function GameFramework_resources_PIEffect$ReadEPoint(theValue2D) {
        var aPointCount = this.mReadBuffer.ReadShort();
        theValue2D.mValuePoint2DVector = [];
        for (var i = 0; i < aPointCount; i++) {
            this.ExpectCmd("CPointKey");
            var aPoint = new GameFramework.resources.PIValuePoint2D();
            aPoint.mTime = this.mReadBuffer.ReadInt();
            aPoint.mValue = new GameFramework.geom.TPoint();
            aPoint.mValue.x = this.mReadBuffer.ReadFloat();
            aPoint.mValue.y = this.mReadBuffer.ReadFloat();
            theValue2D.mValuePoint2DVector.push(aPoint);
        }
    },
    ReadValue: function GameFramework_resources_PIEffect$ReadValue(theValue) {
        var aFlags = this.mIsPPF ? this.mReadBuffer.ReadByte() : 0 | 0;
        var aDataCount = aFlags & 7;
        if (!this.mIsPPF || aDataCount == 7) {
            aDataCount = this.mReadBuffer.ReadShort();
        }
        var hasCurve = false;
        if (aDataCount > 1) {
            hasCurve |= (aFlags & 8) != 0;
        }
        var aTimes = Array.Create(aDataCount, null);
        var aPoints = Array.Create(aDataCount, null);
        var aControlPoints = Array.Create(Math.max(aDataCount * 2 - 1, 0), null);
        var anArrayIdx = 0;
        var aControlIdx = 0;
        theValue.mValuePointVector = [];
        theValue.mValuePointVector.length = aDataCount;
        for (var aDataIdx = 0; aDataIdx < aDataCount; aDataIdx++) {
            var okay = true;
            var aCmd = null;
            if (!this.mIsPPF) {
                aCmd = this.ReadStringS();
                okay = aCmd == "CDataKey" || aCmd == "CDataOverLifeKey";
            }
            if (okay) {
                var aTime;
                if ((aFlags & 0x10) != 0 && aDataIdx == 0) {
                    aTime = 0.0;
                } else if (aCmd == "CDataKey") {
                    aTime = this.mReadBuffer.ReadInt();
                } else {
                    aTime = this.mReadBuffer.ReadFloat();
                }
                aTimes[anArrayIdx] = aTime;
                var aValue;
                if (aDataIdx != 0 || (aFlags & 0x60) == 0x0) {
                    aValue = this.mReadBuffer.ReadFloat();
                } else if ((aFlags & 0x60) == 0x20) {
                    aValue = 0.0;
                } else if ((aFlags & 0x60) == 0x40) {
                    aValue = 1.0;
                } else {
                    aValue = 2.0;
                }
                var aPt = new GameFramework.geom.TPoint();
                aPt.x = aTime;
                aPt.y = aValue;
                aPoints[anArrayIdx] = aPt;
                if (!this.mIsPPF || hasCurve) {
                    var aControlPt1 = new GameFramework.geom.TPoint();
                    aControlPt1.x = this.mReadBuffer.ReadFloat();
                    aControlPt1.y = this.mReadBuffer.ReadFloat();
                    if (aDataIdx > 0) {
                        aControlPoints[aControlIdx++] = aPt.add(aControlPt1);
                    }
                    var aControlPt2 = new GameFramework.geom.TPoint();
                    aControlPt2.x = this.mReadBuffer.ReadFloat();
                    aControlPt2.y = this.mReadBuffer.ReadFloat();
                    aControlPoints[aControlIdx++] = aPt.add(aControlPt2);
                }
                if (!this.mIsPPF) {
                    var aFlags1 = this.mReadBuffer.ReadInt();
                    var aFlags2 = this.mReadBuffer.ReadInt();
                    hasCurve |= (aFlags2 & 1) == 0;
                }
                var aValuePoint = new GameFramework.resources.PIValuePoint();
                aValuePoint.mValue = aPt.y;
                aValuePoint.mTime = aTime;
                theValue.mValuePointVector[aDataIdx] = aValuePoint;
                anArrayIdx++;
            } else {
                this.Fail("CDataKey or CDataOverLifeKey expected");
            }
        }
        if (
            !hasCurve &&
            theValue.mValuePointVector.length == 2 &&
            theValue.mValuePointVector[0].mValue == theValue.mValuePointVector[1].mValue
        ) {
            theValue.mValuePointVector.length--;
        }
        if (aDataCount > 1 && hasCurve) {
            theValue.mBezier = new GameFramework.misc.Bezier();
            theValue.mBezier.InitWithControls(aPoints, aControlPoints, aTimes);
        }
    },
    ReadEmitterType: function GameFramework_resources_PIEffect$ReadEmitterType(theEmitter) {
        var aMyst1 = this.mReadBuffer.ReadInt();
        theEmitter.mName = this.ReadString();
        theEmitter.mKeepInOrder = this.mReadBuffer.ReadBoolean();
        var l = this.mReadBuffer.ReadInt();
        theEmitter.mOldestInFront = this.mReadBuffer.ReadBoolean();
        var aParticleCount = this.mReadBuffer.ReadShort();
        theEmitter.mParticleDefVector = [];
        theEmitter.mParticleDefVector.length = aParticleCount;
        for (var aParticleIdx = 0; aParticleIdx < aParticleCount; aParticleIdx++) {
            GameFramework.resources.PIEffect.gParticleTypeCount++;
            var aParticle = new GameFramework.resources.PIParticleDef();
            this.ExpectCmd("CEmParticleType");
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadFloat();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            this.mReadBuffer.ReadInt();
            aParticle.mIntense = this.mReadBuffer.ReadBoolean();
            aParticle.mSingleParticle = this.mReadBuffer.ReadBoolean();
            aParticle.mPreserveColor = this.mReadBuffer.ReadBoolean();
            if (aParticle.mPreserveColor && !this.mGlobalAllowPreserveColor) {
                aParticle.mPreserveColor = false;
            }
            aParticle.mAttachToEmitter = this.mReadBuffer.ReadBoolean();
            aParticle.mAttachVal = this.mReadBuffer.ReadFloat();
            aParticle.mFlipHorz = this.mReadBuffer.ReadBoolean();
            aParticle.mFlipVert = this.mReadBuffer.ReadBoolean();
            aParticle.mAnimStartOnRandomFrame = this.mReadBuffer.ReadBoolean();
            aParticle.mRepeatColor = this.mReadBuffer.ReadInt();
            aParticle.mRepeatAlpha = this.mReadBuffer.ReadInt();
            aParticle.mLinkTransparencyToColor = this.mReadBuffer.ReadBoolean();
            aParticle.mName = this.ReadString();
            aParticle.mAngleAlignToMotion = this.mReadBuffer.ReadBoolean();
            aParticle.mAngleRandomAlign = this.mReadBuffer.ReadBoolean();
            aParticle.mAngleKeepAlignedToMotion = this.mReadBuffer.ReadBoolean();
            aParticle.mAngleValue = this.mReadBuffer.ReadInt();
            aParticle.mAngleAlignOffset = this.mReadBuffer.ReadInt();
            aParticle.mAnimSpeed = this.mReadBuffer.ReadInt();
            aParticle.mRandomGradientColor = this.mReadBuffer.ReadBoolean();
            l = this.mReadBuffer.ReadInt();
            aParticle.mTextureIdx = this.mReadBuffer.ReadInt();
            aParticle.mColor = new GameFramework.resources.PIInterpolator();
            var aColorPointCount = this.mReadBuffer.ReadShort();
            for (var anIdx = 0; anIdx < aColorPointCount; anIdx++) {
                this.ExpectCmd("CColorPoint");
                var r = this.mReadBuffer.ReadByte();
                var g = this.mReadBuffer.ReadByte();
                var b = this.mReadBuffer.ReadByte();
                var aColor = 0xff000000 | ((r | 0) << 16) | ((g | 0) << 8) | ((b | 0) << 0);
                var aPct = this.mReadBuffer.ReadFloat();
                var aPoint = new GameFramework.resources.PIInterpolatorPoint();
                aPoint.mValue = aColor;
                aPoint.mTime = aPct;
                aParticle.mColor.mInterpolatorPointVector.push(aPoint);
            }
            aParticle.mAlpha = new GameFramework.resources.PIInterpolator();
            var anAlphaPointCount = this.mReadBuffer.ReadShort();
            for (var anIdx_2 = 0; anIdx_2 < anAlphaPointCount; anIdx_2++) {
                this.ExpectCmd("CAlphaPoint");
                var a = this.mReadBuffer.ReadByte();
                var aPct_2 = this.mReadBuffer.ReadFloat();
                var aPoint_2 = new GameFramework.resources.PIInterpolatorPoint();
                aPoint_2.mValue = a;
                aPoint_2.mTime = aPct_2;
                aParticle.mAlpha.mInterpolatorPointVector.push(aPoint_2);
            }
            aParticle.mValues = [];
            aParticle.mValues.length = GameFramework.resources.PIParticleDef.Value.__COUNT | 0;
            for (var aValIdx = 0; aValIdx < (GameFramework.resources.PIParticleDef.Value.__COUNT | 0); aValIdx++) {
                aParticle.mValues[aValIdx] = new GameFramework.resources.PIValue();
            }
            for (var aValIdx_2 = 0; aValIdx_2 < 23; aValIdx_2++) {
                this.ReadValue(aParticle.mValues[aValIdx_2]);
            }
            aParticle.mRefPointOfs = new GameFramework.geom.TPoint();
            aParticle.mRefPointOfs.x = this.mReadBuffer.ReadFloat();
            aParticle.mRefPointOfs.y = this.mReadBuffer.ReadFloat();
            if (!this.mIsPPF) {
                var anImage = this.mDef.mTextureVector[aParticle.mTextureIdx].mImageVector[0];
                aParticle.mRefPointOfs.x /= anImage.mWidth;
                aParticle.mRefPointOfs.y /= anImage.mHeight;
            }
            aParticle.mTextureChunkVector = this.mDef.mTextureVector[aParticle.mTextureIdx].mTextureChunkVector;
            for (var aChunkIdx = 0; aChunkIdx < (aParticle.mTextureChunkVector.length | 0); aChunkIdx++) {
                aParticle.mTextureChunkVector[aChunkIdx].mRefOfsX =
                    -aParticle.mRefPointOfs.x * aParticle.mTextureChunkVector[aChunkIdx].mScaleRef;
                aParticle.mTextureChunkVector[aChunkIdx].mRefOfsY =
                    -aParticle.mRefPointOfs.y * aParticle.mTextureChunkVector[aChunkIdx].mScaleRef;
                if (aParticle.mFlipHorz) {
                    aParticle.mTextureChunkVector[aChunkIdx].mScaleXFactor *= -1.0;
                }
                if (aParticle.mFlipVert) {
                    aParticle.mTextureChunkVector[aChunkIdx].mScaleYFactor *= -1.0;
                }
            }
            l = this.mReadBuffer.ReadInt();
            l = this.mReadBuffer.ReadInt();
            aParticle.mLockAspect = this.mReadBuffer.ReadBoolean();
            this.ReadValue(aParticle.mValues[GameFramework.resources.PIParticleDef.Value.SIZE_Y | 0]);
            this.ReadValue(aParticle.mValues[GameFramework.resources.PIParticleDef.Value.SIZE_Y_VARIATION | 0]);
            this.ReadValue(aParticle.mValues[GameFramework.resources.PIParticleDef.Value.SIZE_Y_OVER_LIFE | 0]);
            aParticle.mAngleRange = this.mReadBuffer.ReadInt();
            aParticle.mAngleOffset = this.mReadBuffer.ReadInt();
            aParticle.mGetColorFromLayer = this.mReadBuffer.ReadBoolean();
            aParticle.mUpdateColorFromLayer = this.mReadBuffer.ReadBoolean();
            aParticle.mUseEmitterAngleAndRange = this.mReadBuffer.ReadBoolean();
            this.ReadValue(aParticle.mValues[GameFramework.resources.PIParticleDef.Value.EMISSION_ANGLE | 0]);
            this.ReadValue(aParticle.mValues[GameFramework.resources.PIParticleDef.Value.EMISSION_RANGE | 0]);
            l = this.mReadBuffer.ReadInt();
            var aValue = new GameFramework.resources.PIValue();
            this.ReadValue(aValue);
            aParticle.mUseKeyColorsOnly = this.mReadBuffer.ReadBoolean();
            aParticle.mUpdateTransparencyFromLayer = this.mReadBuffer.ReadBoolean();
            aParticle.mUseNextColorKey = this.mReadBuffer.ReadBoolean();
            aParticle.mNumberOfEachColor = this.mReadBuffer.ReadInt();
            aParticle.mGetTransparencyFromLayer = this.mReadBuffer.ReadBoolean();
            var aPILifeValueTable = new GameFramework.resources.PILifeValueTable();
            aPILifeValueTable.mLifeValuesSampleTable = Array.Create(
                GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE + 1,
                null
            );
            for (
                var aLifeValueIdx = 0;
                aLifeValueIdx < (GameFramework.resources.PILifeValueTable.LifeValue.__COUNT | 0);
                aLifeValueIdx++
            ) {
                var aPIValue = null;
                var aPIInterpolator = null;
                var aValuePointVector = [];
                switch (aLifeValueIdx) {
                    case GameFramework.resources.PILifeValueTable.LifeValue.SIZE_X | 0: {
                        aPIValue = aParticle.mValues[GameFramework.resources.PIParticleDef.Value.SIZE_X_OVER_LIFE | 0];
                        break;
                    }
                    case GameFramework.resources.PILifeValueTable.LifeValue.SIZE_Y | 0: {
                        aPIValue = aParticle.mValues[GameFramework.resources.PIParticleDef.Value.SIZE_Y_OVER_LIFE | 0];
                        break;
                    }
                    case GameFramework.resources.PILifeValueTable.LifeValue.VELOCITY | 0: {
                        aPIValue =
                            aParticle.mValues[GameFramework.resources.PIParticleDef.Value.VELOCITY_OVER_LIFE | 0];
                        break;
                    }
                    case GameFramework.resources.PILifeValueTable.LifeValue.WEIGHT | 0: {
                        aPIValue = aParticle.mValues[GameFramework.resources.PIParticleDef.Value.WEIGHT_OVER_LIFE | 0];
                        break;
                    }
                    case GameFramework.resources.PILifeValueTable.LifeValue.SPIN | 0: {
                        aPIValue = aParticle.mValues[GameFramework.resources.PIParticleDef.Value.SPIN_OVER_LIFE | 0];
                        break;
                    }
                    case GameFramework.resources.PILifeValueTable.LifeValue.MOTION_RAND | 0: {
                        aPIValue =
                            aParticle.mValues[GameFramework.resources.PIParticleDef.Value.MOTION_RAND_OVER_LIFE | 0];
                        break;
                    }
                    case GameFramework.resources.PILifeValueTable.LifeValue.COLOR | 0: {
                        aPIInterpolator = aParticle.mColor;
                        break;
                    }
                    case GameFramework.resources.PILifeValueTable.LifeValue.ALPHA | 0: {
                        aPIInterpolator = aParticle.mAlpha;
                        break;
                    }
                }
                for (
                    var aSampleIdx = 0;
                    aSampleIdx < GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE + 1;
                    aSampleIdx++
                ) {
                    var aSampleTime = aSampleIdx / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE;
                    if (aLifeValueIdx == (GameFramework.resources.PILifeValueTable.LifeValue.COLOR | 0)) {
                        aSampleTime = aSampleTime * (aParticle.mRepeatColor + 1);
                    } else if (aLifeValueIdx == (GameFramework.resources.PILifeValueTable.LifeValue.ALPHA | 0)) {
                        aSampleTime = aSampleTime * (aParticle.mRepeatAlpha + 1);
                    }
                    if (aSampleTime > 1.0001) {
                        aSampleTime -= aSampleTime | 0;
                    }
                    var aIVal = 0;
                    var aFVal = 0;
                    if (aPIValue != null) {
                        aFVal = aPIValue.GetValueAt(aSampleTime);
                    } else {
                        aIVal = aPIInterpolator.GetValueAt(aSampleTime);
                    }
                    switch (aLifeValueIdx) {
                        case GameFramework.resources.PILifeValueTable.LifeValue.SIZE_X | 0: {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx] =
                                new GameFramework.resources.PILifeValueSample();
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mSizeX = aFVal;
                            break;
                        }
                        case GameFramework.resources.PILifeValueTable.LifeValue.SIZE_Y | 0: {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mSizeY = aFVal;
                            break;
                        }
                        case GameFramework.resources.PILifeValueTable.LifeValue.VELOCITY | 0: {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mVelocity = aFVal;
                            break;
                        }
                        case GameFramework.resources.PILifeValueTable.LifeValue.WEIGHT | 0: {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mWeight = aFVal - 1.0;
                            break;
                        }
                        case GameFramework.resources.PILifeValueTable.LifeValue.SPIN | 0: {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mSpin = aFVal - 1.0;
                            break;
                        }
                        case GameFramework.resources.PILifeValueTable.LifeValue.MOTION_RAND | 0: {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mMotionRand = aFVal;
                            break;
                        }
                        case GameFramework.resources.PILifeValueTable.LifeValue.COLOR | 0: {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mColor = aIVal & 0xffffff;
                            break;
                        }
                        case GameFramework.resources.PILifeValueTable.LifeValue.ALPHA | 0: {
                            aPILifeValueTable.mLifeValuesSampleTable[aSampleIdx].mColor |= aIVal << 24;
                            break;
                        }
                    }
                }
                if (aValuePointVector.length == 1) {
                    var aPIValuePoint = new GameFramework.resources.PIValuePoint();
                    aPIValuePoint.mTime = 1.0;
                    aPIValuePoint.mValue = aValuePointVector[0].mValue;
                    aValuePointVector.push(aPIValuePoint);
                }
            }
            aParticle.mLifeValueTable = aPILifeValueTable;
            aParticle.mCalcParticleTransformWantsBaseRotTrans = aParticle.mAttachToEmitter || aParticle.mSingleParticle;
            if (theEmitter.mOldestInFront) {
                theEmitter.mParticleDefVector[aParticleCount - aParticleIdx - 1] = aParticle;
            } else {
                theEmitter.mParticleDefVector[aParticleIdx] = aParticle;
            }
        }
        var aMyst2 = this.mReadBuffer.ReadInt();
        theEmitter.mValues = Array.Create(42, null);
        for (var aValIdx_3 = 0; aValIdx_3 < 42; aValIdx_3++) {
            theEmitter.mValues[aValIdx_3] = new GameFramework.resources.PIValue();
            this.ReadValue(theEmitter.mValues[aValIdx_3]);
        }
        theEmitter.mIsSuperEmitter = theEmitter.mValues[0].mValuePointVector.length != 0;
        var aMyst3 = this.mReadBuffer.ReadInt();
        var aMyst4 = this.mReadBuffer.ReadInt();
    },
    LoadParticleDefInstance: function GameFramework_resources_PIEffect$LoadParticleDefInstance(
        theBuffer,
        theParticleDefInstance
    ) {
        theParticleDefInstance.mNumberAcc = theBuffer.ReadFloat();
        theParticleDefInstance.mCurNumberVariation = theBuffer.ReadFloat();
        theParticleDefInstance.mParticlesEmitted = theBuffer.ReadInt();
        theParticleDefInstance.mTicks = theBuffer.ReadInt();
    },
    LoadParticle: function GameFramework_resources_PIEffect$LoadParticle(theBuffer, theLayer, theParticle) {
        theParticle.mTicks = theBuffer.ReadFloat();
        theParticle.mLife = theBuffer.ReadFloat();
        theParticle.mLifePct = theBuffer.ReadFloat();
        theParticle.mZoom = theBuffer.ReadFloat();
        var anUpdateRate = 1000.0 / this.mFrameTime / this.mAnimSpeed;
        var aLifeTicks = theParticle.mLife / (1.0 / anUpdateRate);
        theParticle.mLifePctInt = (theParticle.mLifePct * 0x7fffffff) | 0;
        theParticle.mLifePctIntInc = (0x7fffffff / aLifeTicks) | 0;
        if (theParticle.mLifePctInt < 0) {
            theParticle.mLifePctInt = 0x7fffffff;
        }
        theParticle.mLifeValueDeltaIdx = 0;
        if (theParticle.mParticleDef != null && theParticle.mParticleDef.mSingleParticle) {
            theParticle.mLifePctInt = 1;
            theParticle.mLifePctIntInc = 0;
            theParticle.mLifePctInc = 0;
        }
        theParticle.mPos = new GameFramework.geom.TPoint();
        theParticle.mPos.x = theBuffer.ReadDouble();
        theParticle.mPos.y = theBuffer.ReadDouble();
        theParticle.mVel = new GameFramework.geom.TPoint();
        theParticle.mVel.x = theBuffer.ReadDouble();
        theParticle.mVel.y = theBuffer.ReadDouble();
        theParticle.mEmittedPos = new GameFramework.geom.TPoint();
        theParticle.mEmittedPos.x = theBuffer.ReadDouble();
        theParticle.mEmittedPos.y = theBuffer.ReadDouble();
        theParticle.mOrigPos = new GameFramework.geom.TPoint();
        if (theParticle.mParticleDef != null && theParticle.mParticleDef.mAttachToEmitter) {
            theParticle.mOrigPos.x = theBuffer.ReadDouble();
            theParticle.mOrigPos.y = theBuffer.ReadDouble();
            theParticle.mOrigEmitterAng = theBuffer.ReadFloat();
        }
        theParticle.mImgAngle = theBuffer.ReadFloat();
        var aVariationFlags = theBuffer.ReadShort();
        for (var aVar = 0; aVar < (GameFramework.resources.PIParticleInstance.Variation.__COUNT | 0); aVar++) {
            if ((aVariationFlags & (1 << aVar)) != 0) {
                theParticle.mVariationValues[aVar] = theBuffer.ReadFloat();
            } else {
                theParticle.mVariationValues[aVar] = 0.0;
            }
        }
        theParticle.mSrcSizeXMult = theBuffer.ReadFloat();
        theParticle.mSrcSizeYMult = theBuffer.ReadFloat();
        theParticle.mColorMask = 0xffffffff;
        theParticle.mColorOr = 0;
        if (theParticle.mParticleDef != null && theParticle.mParticleDef.mRandomGradientColor) {
            var aParticleDef = theParticle.mParticleDef;
            theParticle.mGradientRand = theBuffer.ReadFloat();
            theParticle.mColorMask &= 0xff000000;
            if (aParticleDef.mUseKeyColorsOnly) {
                var aKeyframe =
                    Math.max(
                        (theParticle.mGradientRand * aParticleDef.mColor.mInterpolatorPointVector.length) | 0,
                        aParticleDef.mColor.mInterpolatorPointVector.length - 1
                    ) | 0;
                theParticle.mColorOr |= aParticleDef.mColor.GetKeyframeNum(aKeyframe) & 0xffffff;
            } else {
                var aColorPosUsed = theParticle.mGradientRand;
                theParticle.mColorOr |= aParticleDef.mColor.GetValueAt(aColorPosUsed) & 0xffffff;
            }
        }
        if (theParticle.mParticleDef != null && theParticle.mParticleDef.mUseNextColorKey) {
            var aParticleDef_2 = theParticle.mParticleDef;
            var aKeyframe_2 =
                ((theParticle.mNum / aParticleDef_2.mNumberOfEachColor) | 0) %
                (aParticleDef_2.mColor.mInterpolatorPointVector.length | 0);
            theParticle.mColorOr |= aParticleDef_2.mColor.GetKeyframeNum(aKeyframe_2) & 0xffffff;
            theParticle.mColorMask &= 0xff000000;
        }
        if (theParticle.mParticleDef != null && theParticle.mParticleDef.mAnimStartOnRandomFrame) {
            theParticle.mAnimFrameRand = theBuffer.ReadShort();
        }
        if (theLayer.mLayerDef.mDeflectorVector.length > 0) {
            theParticle.mThicknessHitVariation = theBuffer.ReadFloat();
        }
        if (theParticle.mParticleDef != null && theParticle.mParticleDef.mAnimStartOnRandomFrame) {
            theParticle.mAnimFrameRand = GameFramework.Utils.GetRand() & 0x7fff;
        } else {
            theParticle.mAnimFrameRand = 0;
        }
    },
    GetGeomPos: function GameFramework_resources_PIEffect$GetGeomPos(
        theEmitterInstance,
        theParticleInstance,
        thePIGeomDataEx
    ) {
        if (thePIGeomDataEx === undefined) {
            thePIGeomDataEx = null;
        }
        var aPos = null;
        var anEmitterInstanceDef = theEmitterInstance.mEmitterInstanceDef;
        switch (anEmitterInstanceDef.mEmitterGeom) {
            case GameFramework.resources.PIEmitterInstanceDef.Geom.LINE:
                {
                    if (anEmitterInstanceDef.mPoints.length >= 2) {
                        var aStartIdx = 0;
                        var aPct = 0;
                        var aPt1;
                        var aPt2;
                        var aPtDiff;
                        var aLenSq;
                        var aTotalLengthSq = 0;
                        for (var i = 0; i < (anEmitterInstanceDef.mPoints.length | 0) - 1; i++) {
                            aPt1 = anEmitterInstanceDef.mPoints[i].GetValueAt(this.mFrameNum);
                            aPt2 = anEmitterInstanceDef.mPoints[i + 1].GetValueAt(this.mFrameNum);
                            aPtDiff = aPt2.subtract(aPt1);
                            aLenSq = aPtDiff.x * aPtDiff.x + aPtDiff.y * aPtDiff.y;
                            aTotalLengthSq += aLenSq | 0;
                        }
                        var aWantLenSq;
                        if (anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                            var aPointIdx = theParticleInstance.mNum % anEmitterInstanceDef.mEmitAtPointsNum;
                            aWantLenSq = (aPointIdx * aTotalLengthSq) / (anEmitterInstanceDef.mEmitAtPointsNum - 1);
                        } else {
                            aWantLenSq = this.GetRandFloatU() * aTotalLengthSq;
                        }
                        aTotalLengthSq = 0;
                        for (var i_2 = 0; i_2 < (anEmitterInstanceDef.mPoints.length | 0) - 1; i_2++) {
                            aPt1 = anEmitterInstanceDef.mPoints[i_2].GetValueAt(this.mFrameNum);
                            aPt2 = anEmitterInstanceDef.mPoints[i_2 + 1].GetValueAt(this.mFrameNum);
                            aPtDiff = aPt2.subtract(aPt1);
                            aLenSq = aPtDiff.x * aPtDiff.x + aPtDiff.y * aPtDiff.y;
                            if (aWantLenSq >= aTotalLengthSq && aWantLenSq <= aTotalLengthSq + aLenSq) {
                                aPct = (aWantLenSq - aTotalLengthSq) / aLenSq;
                                aStartIdx = i_2;
                                break;
                            }
                            aTotalLengthSq += aLenSq | 0;
                        }
                        aPt1 = anEmitterInstanceDef.mPoints[aStartIdx].GetValueAt(this.mFrameNum);
                        aPt2 = anEmitterInstanceDef.mPoints[aStartIdx + 1].GetValueAt(this.mFrameNum);
                        aPtDiff = aPt2.subtract(aPt1);
                        aPos = GameFramework.geom.TPoint.interpolate(aPt2, aPt1, aPct);
                        var aSign = anEmitterInstanceDef.mEmitIn
                            ? anEmitterInstanceDef.mEmitOut
                                ? this.GetRandSign()
                                : -1
                            : 1;
                        if (thePIGeomDataEx != null) {
                            var anAngleChange =
                                Math.atan2(aPtDiff.y, aPtDiff.x) + Math.PI / 2.0 + (aSign * Math.PI) / 2.0;
                            thePIGeomDataEx.mTravelAngle += anAngleChange;
                        }
                    }
                }

                break;
            case GameFramework.resources.PIEmitterInstanceDef.Geom.ECLIPSE:
                {
                    var aXRad = theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0
                    ].GetValueAt(this.mFrameNum);
                    var aYRad = theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.YRADIUS | 0
                    ].GetValueAt(this.mFrameNum);
                    var anAng;
                    if (anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                        var aPointIdx_2 = theParticleInstance.mNum % anEmitterInstanceDef.mEmitAtPointsNum;
                        anAng = (aPointIdx_2 * Math.PI * 2) / anEmitterInstanceDef.mEmitAtPointsNum;
                        if (anAng > Math.PI) {
                            anAng = anAng - Math.PI * 2;
                        }
                    } else {
                        anAng = this.GetRandFloat() * Math.PI;
                    }
                    if (aXRad > aYRad) {
                        var aFavorSidesFactor = 1.0 + (aXRad / aYRad - 1.0) * 0.3;
                        if (anAng < -Math.PI / 2) {
                            anAng =
                                Math.PI +
                                (Math.pow((anAng + Math.PI) / (Math.PI / 2), aFavorSidesFactor) * Math.PI) / 2;
                        } else if (anAng < 0) {
                            anAng = (-Math.pow(-anAng / (Math.PI / 2), aFavorSidesFactor) * Math.PI) / 2;
                        } else if (anAng < Math.PI / 2) {
                            anAng = (Math.pow(anAng / (Math.PI / 2), aFavorSidesFactor) * Math.PI) / 2;
                        } else {
                            anAng =
                                Math.PI -
                                (Math.pow((Math.PI - anAng) / (Math.PI / 2), aFavorSidesFactor) * Math.PI) / 2;
                        }
                    } else if (aYRad > aXRad) {
                        var aFavorSidesFactor_2 = 1.0 + (aYRad / aXRad - 1.0) * 0.3;
                        if (anAng < -Math.PI / 2) {
                            anAng =
                                -Math.PI / 2 -
                                (Math.pow((-Math.PI / 2 - anAng) / (Math.PI / 2), aFavorSidesFactor_2) * Math.PI) / 2;
                        } else if (anAng < 0) {
                            anAng =
                                -Math.PI / 2 +
                                (Math.pow((anAng + Math.PI / 2) / (Math.PI / 2), aFavorSidesFactor_2) * Math.PI) / 2;
                        } else if (anAng < Math.PI / 2) {
                            anAng =
                                Math.PI / 2 -
                                (Math.pow((Math.PI / 2 - anAng) / (Math.PI / 2), aFavorSidesFactor_2) * Math.PI) / 2;
                        } else {
                            anAng =
                                Math.PI / 2 +
                                (Math.pow((anAng - Math.PI / 2) / (Math.PI / 2), aFavorSidesFactor_2) * Math.PI) / 2;
                        }
                    }
                    aPos = new GameFramework.geom.TPoint(Math.cos(anAng) * aXRad, Math.sin(anAng) * aYRad);
                    if (thePIGeomDataEx != null) {
                        var aSign_2 = anEmitterInstanceDef.mEmitIn
                            ? anEmitterInstanceDef.mEmitOut
                                ? this.GetRandSign()
                                : -1
                            : 1;
                        var anAngleChange_2 = anAng + (aSign_2 * Math.PI) / 2.0;
                        thePIGeomDataEx.mTravelAngle += anAngleChange_2;
                    }
                }

                break;
            case GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE:
                {
                    var aRad = theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0
                    ].GetValueAt(this.mFrameNum);
                    var anAng_2;
                    if (anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                        var aPointIdx_3 = theParticleInstance.mNum % anEmitterInstanceDef.mEmitAtPointsNum;
                        anAng_2 = (aPointIdx_3 * Math.PI * 2) / anEmitterInstanceDef.mEmitAtPointsNum;
                    } else {
                        anAng_2 = this.GetRandFloat() * Math.PI;
                    }
                    aPos = new GameFramework.geom.TPoint(Math.cos(anAng_2) * aRad, Math.sin(anAng_2) * aRad);
                    if (thePIGeomDataEx != null) {
                        var aSign_3 = anEmitterInstanceDef.mEmitIn
                            ? anEmitterInstanceDef.mEmitOut
                                ? this.GetRandSign()
                                : -1
                            : 1;
                        var anAngleChange_3 = anAng_2 + (aSign_3 * Math.PI) / 2.0;
                        thePIGeomDataEx.mTravelAngle += anAngleChange_3;
                    }
                }

                break;
            case GameFramework.resources.PIEmitterInstanceDef.Geom.AREA:
                {
                    var aW = theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0
                    ].GetValueAt(this.mFrameNum);
                    var aH = theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.YRADIUS | 0
                    ].GetValueAt(this.mFrameNum);
                    if (anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                        var aPointIdxX = theParticleInstance.mNum % anEmitterInstanceDef.mEmitAtPointsNum;
                        var aPointIdxY =
                            ((theParticleInstance.mNum / anEmitterInstanceDef.mEmitAtPointsNum) | 0) %
                            anEmitterInstanceDef.mEmitAtPointsNum2;
                        aPos = new GameFramework.geom.TPoint();
                        if (anEmitterInstanceDef.mEmitAtPointsNum > 1) {
                            aPos.x = (aPointIdxX / (anEmitterInstanceDef.mEmitAtPointsNum - 1) - 0.5) * aW;
                        }
                        if (anEmitterInstanceDef.mEmitAtPointsNum2 > 1) {
                            aPos.y = (aPointIdxY / (anEmitterInstanceDef.mEmitAtPointsNum2 - 1) - 0.5) * aH;
                        }
                    } else {
                        aPos = new GameFramework.geom.TPoint(
                            (this.GetRandFloat() * aW) / 2.0,
                            (this.GetRandFloat() * aH) / 2.0
                        );
                    }
                    if (theEmitterInstance.mMaskImage != null && thePIGeomDataEx != null) {
                        var aXPct = aPos.x / aW + 0.5;
                        var aYPct = aPos.y / aH + 0.5;
                        var anImgW = theEmitterInstance.mMaskImage.mWidth;
                        var anImgH = theEmitterInstance.mMaskImage.mHeight;
                    }
                }

                break;
            case GameFramework.resources.PIEmitterInstanceDef.Geom.POINT: {
                aPos = new GameFramework.geom.TPoint();
                break;
            }
        }
        aPos = aPos.add(this.GetEmitterPos(theEmitterInstance, false));
        aPos.offset(theEmitterInstance.mOffset.x, theEmitterInstance.mOffset.y);
        aPos = theEmitterInstance.mTransform.transformPoint(aPos);
        if (this.mEmitterTransform != null) {
            aPos = this.mEmitterTransform.transformPoint(aPos);
        }
        return aPos;
    },
    LoadEffect: function GameFramework_resources_PIEffect$LoadEffect(theDataBuffer, theParentStreamer) {
        this.mDef = new GameFramework.resources.PIEffectDef();
        this.Clear();
        this.mVersion = 0;
        this.mFileChecksum = 0;
        this.mReadBuffer = theDataBuffer;
        this.mIsPPF = true;
        var aHeader = this.ReadString();
        if (this.mIsPPF) {
            this.mVersion = this.mReadBuffer.ReadInt();
        }
        if (this.mVersion < GameFramework.resources.PIEffect.PPF_MIN_VERSION) {
            this.Fail("PPF version too old");
        }
        this.mNotes = this.ReadString();
        this.mDef.mTextureVector = [];
        var aTexCount = this.mReadBuffer.ReadShort();
        for (var aTexIdx = 0; aTexIdx < aTexCount; aTexIdx++) {
            this.ExpectCmd("CMultiTexture");
            var aTexture = new GameFramework.resources.PITexture();
            aTexture.mName = this.ReadString();
            var aCount = this.mReadBuffer.ReadShort();
            aTexture.mNumCels = aCount;
            if (this.mIsPPF) {
                var aRowCount = this.mReadBuffer.ReadShort();
                aTexture.mPadded = this.mReadBuffer.ReadBoolean();
                var aFileName = this.ReadString();
                var aResourceStreamer = this.GetImage(aTexture.mName, aFileName, theParentStreamer);
                var aBaseRes = aResourceStreamer.mBaseRes;
                aResourceStreamer.AddEventListener(
                    GameFramework.events.Event.COMPLETE,
                    ss.Delegate.create(aTexture, aTexture.ImageLoaded)
                );
                for (var aCelIdx = 0; aCelIdx < aCount; aCelIdx++) {
                    var aPITextureChunk = new GameFramework.resources.PITextureChunk();
                    aPITextureChunk.mSrcTexture = aTexture;
                    aPITextureChunk.mCel = aCelIdx;
                    aPITextureChunk.mScaleRef = Math.max(aBaseRes.mOrigWidth, aBaseRes.mOrigHeight);
                    aPITextureChunk.mScaleXFactor = aBaseRes.mOrigWidth / aPITextureChunk.mScaleRef;
                    aPITextureChunk.mScaleYFactor = aBaseRes.mOrigHeight / aPITextureChunk.mScaleRef;
                    aTexture.mTextureChunkVector.push(aPITextureChunk);
                }
            }

            this.mDef.mTextureVector.push(aTexture);
        }
        var anEmitterCount = this.mReadBuffer.ReadShort();
        this.mDef.mEmitterVector = [];
        this.mDef.mEmitterVector.length = anEmitterCount;
        for (var anEmitterIdx = 0; anEmitterIdx < anEmitterCount; anEmitterIdx++) {
            this.mDef.mEmitterVector[anEmitterIdx] = new GameFramework.resources.PIEmitter();
            this.ExpectCmd("CEmitterType");
            if (!this.mIsPPF) {
                this.mDef.mEmitterRefMap[this.mStringVector.length | 0] = anEmitterIdx;
            }
            this.ReadEmitterType(this.mDef.mEmitterVector[anEmitterIdx]);
        }
        var anEmitterDefUsedVector = [];
        anEmitterDefUsedVector.length = this.mDef.mEmitterVector.length;
        var aTextureUsedVector = [];
        aTextureUsedVector.length = this.mDef.mTextureVector.length;
        var aLayerCount = this.mReadBuffer.ReadShort();
        this.mDef.mLayerDefVector = [];
        this.mDef.mLayerDefVector.length = aLayerCount;
        this.mLayerVector = [];
        this.mLayerVector.length = aLayerCount;
        for (var aLayerIdx = 0; aLayerIdx < aLayerCount; aLayerIdx++) {
            var aLayerDef;
            this.mDef.mLayerDefVector[aLayerIdx] = aLayerDef = new GameFramework.resources.PILayerDef();
            var aLayer;
            this.mLayerVector[aLayerIdx] = aLayer = new GameFramework.resources.PILayer();
            aLayer.mLayerDef = aLayerDef;
            this.ExpectCmd("CLayer");
            aLayerDef.mName = this.ReadString();
            anEmitterCount = this.mReadBuffer.ReadShort();
            aLayer.mEmitterInstanceVector = [];
            aLayer.mEmitterInstanceVector.length = anEmitterCount;
            aLayerDef.mEmitterInstanceDefVector = [];
            aLayerDef.mEmitterInstanceDefVector.length = anEmitterCount;
            for (var anEmitterIdx_2 = 0; anEmitterIdx_2 < anEmitterCount; anEmitterIdx_2++) {
                var anEmitterInstanceDef;
                aLayerDef.mEmitterInstanceDefVector[anEmitterIdx_2] = anEmitterInstanceDef =
                    new GameFramework.resources.PIEmitterInstanceDef();
                var anEmitterInstance;
                aLayer.mEmitterInstanceVector[anEmitterIdx_2] = anEmitterInstance =
                    new GameFramework.resources.PIEmitterInstance();
                anEmitterInstance.mEmitterInstanceDef = anEmitterInstanceDef;
                this.ExpectCmd("CEmitter");
                var f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                var l = this.mReadBuffer.ReadInt();
                l = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mFramesToPreload = this.mReadBuffer.ReadInt();
                l = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mName = this.ReadString();
                anEmitterInstanceDef.mEmitterGeom = this.mReadBuffer.ReadInt();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
                var isCircle = this.mReadBuffer.ReadBoolean();
                if (
                    isCircle &&
                    anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.ECLIPSE
                ) {
                    anEmitterInstanceDef.mEmitterGeom = GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE;
                }
                anEmitterInstanceDef.mEmitIn = this.mReadBuffer.ReadBoolean();
                anEmitterInstanceDef.mEmitOut = this.mReadBuffer.ReadBoolean();
                var aColor;
                aColor = ((this.mReadBuffer.ReadByte() | 0 | 0) << 16) | 0xff000000;
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                aColor |= (this.mReadBuffer.ReadByte() | 0 | 0) << 8;
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                aColor |= this.mReadBuffer.ReadByte() | 0;
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                this.mReadBuffer.ReadByte();
                anEmitterInstance.mTintColor = aColor;
                l = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mEmitAtPointsNum = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mEmitterDefIdx = this.mReadBuffer.ReadInt();
                anEmitterDefUsedVector[anEmitterInstanceDef.mEmitterDefIdx] = true;
                var anEmitter = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                anEmitterInstance.mParticleDefInstanceVector = [];
                anEmitterInstance.mParticleDefInstanceVector.length = anEmitter.mParticleDefVector.length;
                for (var aParticleIdx = 0; aParticleIdx < (anEmitter.mParticleDefVector.length | 0); aParticleIdx++) {
                    anEmitterInstance.mParticleDefInstanceVector[aParticleIdx] =
                        new GameFramework.resources.PIParticleDefInstance();
                    aTextureUsedVector[anEmitter.mParticleDefVector[aParticleIdx].mTextureIdx] = true;
                }
                anEmitterInstanceDef.mPosition = new GameFramework.resources.PIValue2D();
                this.ReadValue2D(anEmitterInstanceDef.mPosition);
                var aNumEPoints = this.mReadBuffer.ReadShort();
                anEmitterInstanceDef.mPoints = [];
                for (var i = 0; i < aNumEPoints; i++) {
                    this.ExpectCmd("CEPoint");
                    var aV1 = this.mReadBuffer.ReadFloat();
                    var aV2 = this.mReadBuffer.ReadFloat();
                    var aPoint2D = new GameFramework.resources.PIValue2D();
                    this.ReadEPoint(aPoint2D);
                    anEmitterInstanceDef.mPoints.push(aPoint2D);
                }
                anEmitterInstanceDef.mValues = [];
                anEmitterInstanceDef.mValues.length = GameFramework.resources.PIEmitterInstanceDef.Value.__COUNT | 0;
                for (var i_2 = 0; i_2 < (GameFramework.resources.PIEmitterInstanceDef.Value.__COUNT | 0); i_2++) {
                    anEmitterInstanceDef.mValues[i_2] = new GameFramework.resources.PIValue();
                }
                for (var i_3 = 0; i_3 < 17; i_3++) {
                    this.ReadValue(anEmitterInstanceDef.mValues[i_3]);
                }
                anEmitterInstanceDef.mEmitAtPointsNum2 = this.mReadBuffer.ReadInt();
                l = this.mReadBuffer.ReadInt();
                this.ReadValue(
                    anEmitterInstanceDef.mValues[GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_Y | 0]
                );
                l = this.mReadBuffer.ReadInt();
                this.ReadValue(
                    anEmitterInstanceDef.mValues[GameFramework.resources.PIEmitterInstanceDef.Value.UNKNOWN4 | 0]
                );
                var anImgCount = this.mReadBuffer.ReadShort();
                var aMaskImageName = null;
                for (var i_4 = 0; i_4 < anImgCount; i_4++) {
                    aMaskImageName = this.ReadString();
                }
                var hasMaskImage = this.mReadBuffer.ReadBoolean();
                var aMaskImagePath = this.ReadString();
                l = this.mReadBuffer.ReadInt();
                l = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mInvertMask = this.mReadBuffer.ReadBoolean();
                l = this.mReadBuffer.ReadInt();
                l = this.mReadBuffer.ReadInt();
                anEmitterInstanceDef.mIsSuperEmitter = this.mReadBuffer.ReadBoolean();
                anEmitterInstanceDef.mFreeEmitterIndices = [];
                var aNumFreeEmitters = this.mReadBuffer.ReadShort();
                for (var i_5 = 0; i_5 < aNumFreeEmitters; i_5++) {
                    if (this.mIsPPF) {
                        var anEmitterIdxInner = this.mReadBuffer.ReadShort();
                        anEmitterInstanceDef.mFreeEmitterIndices.push(anEmitterIdxInner);
                        anEmitterDefUsedVector[anEmitterIdx_2] = true;
                    } else {
                        var aStringIdx = this.mReadBuffer.ReadShort();
                        anEmitterInstanceDef.mFreeEmitterIndices.push(this.mDef.mEmitterRefMap[aStringIdx]);
                        anEmitterDefUsedVector[this.mDef.mEmitterRefMap[aStringIdx]] = true;
                    }
                }
                anEmitterInstance.mSuperEmitterParticleDefInstanceVector = [];
                anEmitterInstance.mSuperEmitterParticleDefInstanceVector.length = aNumFreeEmitters;
                for (var i_6 = 0; i_6 < anEmitterInstance.mSuperEmitterParticleDefInstanceVector.length; i_6++) {
                    anEmitterInstance.mSuperEmitterParticleDefInstanceVector[i_6] =
                        new GameFramework.resources.PIParticleDefInstance();
                }
                l = this.mReadBuffer.ReadInt();
                f = this.mReadBuffer.ReadFloat();
                f = this.mReadBuffer.ReadFloat();
            }
            aLayerDef.mDeflectorVector = [];
            var aDeflectorCount = this.mReadBuffer.ReadShort();
            for (var i_7 = 0; i_7 < aDeflectorCount; i_7++) {
                var aDeflector = new GameFramework.resources.PIDeflector();
                this.ExpectCmd("CDeflector");
                aDeflector.mName = this.ReadString();
                aDeflector.mBounce = this.mReadBuffer.ReadFloat();
                aDeflector.mHits = this.mReadBuffer.ReadFloat();
                aDeflector.mThickness = this.mReadBuffer.ReadFloat();
                aDeflector.mVisible = this.mReadBuffer.ReadBoolean();
                aDeflector.mPos = new GameFramework.resources.PIValue2D();
                this.ReadValue2D(aDeflector.mPos);
                var aNumEPoints_2 = this.mReadBuffer.ReadShort();
                aDeflector.mPoints = [];
                aDeflector.mCurPoints = [];
                for (var j = 0; j < aNumEPoints_2; j++) {
                    this.ExpectCmd("CEPoint");
                    var aV1_2 = this.mReadBuffer.ReadFloat();
                    var aV2_2 = this.mReadBuffer.ReadFloat();
                    var aPoint2D_2 = new GameFramework.resources.PIValue2D();
                    this.ReadEPoint(aPoint2D_2);
                    aDeflector.mPoints.push(aPoint2D_2);
                    aDeflector.mCurPoints.push(new GameFramework.geom.TPoint());
                }
                aDeflector.mActive = new GameFramework.resources.PIValue();
                this.ReadValue(aDeflector.mActive);
                aDeflector.mAngle = new GameFramework.resources.PIValue();
                this.ReadValue(aDeflector.mAngle);
                aLayerDef.mDeflectorVector.push(aDeflector);
            }
            var aBlockerCount = this.mReadBuffer.ReadShort();
            for (var i_8 = 0; i_8 < aBlockerCount; i_8++) {
                var aBlocker = new GameFramework.resources.PIBlocker();
                this.ExpectCmd("CBlocker");
                aBlocker.mName = this.ReadString();
                var l_2 = this.mReadBuffer.ReadInt();
                l_2 = this.mReadBuffer.ReadInt();
                l_2 = this.mReadBuffer.ReadInt();
                l_2 = this.mReadBuffer.ReadInt();
                l_2 = this.mReadBuffer.ReadInt();
                aBlocker.mPos = new GameFramework.resources.PIValue2D();
                this.ReadValue2D(aBlocker.mPos);
                var aNumEPoints_3 = this.mReadBuffer.ReadShort();
                aBlocker.mPoints = [];
                for (var j_2 = 0; j_2 < aNumEPoints_3; j_2++) {
                    this.ExpectCmd("CEPoint");
                    var aV1_3 = this.mReadBuffer.ReadFloat();
                    var aV2_3 = this.mReadBuffer.ReadFloat();
                    var aPoint2D_3 = new GameFramework.resources.PIValue2D();
                    this.ReadEPoint(aPoint2D_3);
                    aBlocker.mPoints.push(aPoint2D_3);
                }
                aBlocker.mActive = new GameFramework.resources.PIValue();
                this.ReadValue(aBlocker.mActive);
                aBlocker.mAngle = new GameFramework.resources.PIValue();
                this.ReadValue(aBlocker.mAngle);
                aLayerDef.mBlockerVector.push(aBlocker);
            }
            aLayerDef.mOffset = new GameFramework.resources.PIValue2D();
            this.ReadValue2D(aLayerDef.mOffset);
            aLayerDef.mOrigOffset = aLayerDef.mOffset.GetValueAt(0.0);
            aLayerDef.mAngle = new GameFramework.resources.PIValue();
            this.ReadValue(aLayerDef.mAngle);
            var aBkgPath = this.ReadString();
            for (var i_9 = 0; i_9 < 32; i_9++) {
                this.mReadBuffer.ReadByte();
            }
            var aCount_2 = this.mReadBuffer.ReadShort();
            var aBkgFileName;
            for (var i_10 = 0; i_10 < aCount_2; i_10++) {
                aBkgFileName = this.ReadString();
            }
            for (var i_11 = 0; i_11 < 36; i_11++) {
                this.mReadBuffer.ReadByte();
            }
            aLayerDef.mForceVector = [];
            var aForceCount = this.mReadBuffer.ReadShort();
            for (var aForceIdx = 0; aForceIdx < aForceCount; aForceIdx++) {
                this.ExpectCmd("CForce");
                var aForce = new GameFramework.resources.PIForce();
                aForce.mName = this.ReadString();
                aForce.mVisible = this.mReadBuffer.ReadBoolean();
                aForce.mPos = new GameFramework.resources.PIValue2D();
                this.ReadValue2D(aForce.mPos);
                aForce.mActive = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mActive);
                var aVal = new GameFramework.resources.PIValue();
                this.ReadValue(aVal);
                aForce.mStrength = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mStrength);
                aForce.mWidth = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mWidth);
                aForce.mHeight = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mHeight);
                aForce.mAngle = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mAngle);
                aForce.mDirection = new GameFramework.resources.PIValue();
                this.ReadValue(aForce.mDirection);
                aLayerDef.mForceVector.push(aForce);
            }
            for (var i_12 = 0; i_12 < 28; i_12++) {
                this.mReadBuffer.ReadByte();
            }
        }
        var anEmitterRemapMap = [];
        anEmitterRemapMap.length = this.mDef.mEmitterVector.length;
        var anEmittersUsedCount = 0;
        for (var anEmitterIdx_3 = 0; anEmitterIdx_3 < (this.mDef.mEmitterVector.length | 0); anEmitterIdx_3++) {
            if (anEmitterDefUsedVector[anEmitterIdx_3]) {
                anEmitterRemapMap[anEmitterIdx_3] = anEmittersUsedCount++;
            }
        }
        var aCheckIdx = 0;
        var anEraseIdx = 0;
        for (var anEmitterIdx_4 = 0; anEmitterIdx_4 < (this.mDef.mEmitterVector.length | 0); anEmitterIdx_4++) {
            if (!anEmitterDefUsedVector[aCheckIdx]) {
                this.mDef.mEmitterVector.removeAt(anEraseIdx);
                anEmitterIdx_4--;
            } else {
                anEraseIdx++;
            }
            aCheckIdx++;
        }
        for (var aLayerIdx_2 = 0; aLayerIdx_2 < (this.mDef.mLayerDefVector.length | 0); aLayerIdx_2++) {
            var aLayer_2 = this.mDef.mLayerDefVector[aLayerIdx_2];
            for (var anEmitterIdx_5 = 0; anEmitterIdx_5 < aLayer_2.mEmitterInstanceDefVector.length; anEmitterIdx_5++) {
                var anEmitterInstance_2 = aLayer_2.mEmitterInstanceDefVector[anEmitterIdx_5];
                anEmitterInstance_2.mEmitterDefIdx = anEmitterRemapMap[anEmitterInstance_2.mEmitterDefIdx];
                for (
                    var aFreeEmitterIdx = 0;
                    aFreeEmitterIdx < anEmitterInstance_2.mFreeEmitterIndices.length;
                    aFreeEmitterIdx++
                ) {
                    anEmitterInstance_2.mFreeEmitterIndices[aFreeEmitterIdx] =
                        anEmitterRemapMap[anEmitterInstance_2.mFreeEmitterIndices[aFreeEmitterIdx]];
                }
            }
        }
        var aTextureRemapMap = [];
        aTextureRemapMap.length = this.mDef.mTextureVector.length;
        var aTexturesUsedCount = 0;
        for (var anTextureIdx = 0; anTextureIdx < (this.mDef.mTextureVector.length | 0); anTextureIdx++) {
            if (aTextureUsedVector[anTextureIdx]) {
                aTextureRemapMap[anTextureIdx] = aTexturesUsedCount++;
            }
        }
        aCheckIdx = 0;
        anEraseIdx = 0;
        for (var anTextureIdx_2 = 0; anTextureIdx_2 < (this.mDef.mTextureVector.length | 0); anTextureIdx_2++) {
            if (!aTextureUsedVector[aCheckIdx]) {
                this.mDef.mTextureVector.removeAt(anEraseIdx);
                anTextureIdx_2--;
            } else {
                anEraseIdx++;
            }
            aCheckIdx++;
        }
        for (var anEmitterIdx_6 = 0; anEmitterIdx_6 < (this.mDef.mEmitterVector.length | 0); anEmitterIdx_6++) {
            var anEmitter_2 = this.mDef.mEmitterVector[anEmitterIdx_6];
            for (var aParticleIdx_2 = 0; aParticleIdx_2 < anEmitter_2.mParticleDefVector.length; aParticleIdx_2++) {
                var aParticleDef = anEmitter_2.mParticleDefVector[aParticleIdx_2];
                aParticleDef.mTextureIdx = aTextureRemapMap[aParticleDef.mTextureIdx];
            }
        }
        var aBkgColor;
        aBkgColor = ((this.mReadBuffer.ReadByte() | 0) << 16) | 0xff000000;
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        aBkgColor |= (this.mReadBuffer.ReadByte() | 0) << 8;
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        aBkgColor |= this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        this.mReadBuffer.ReadByte();
        this.mBkgColor = aBkgColor;
        this.mReadBuffer.ReadInt();
        this.mReadBuffer.ReadInt();
        this.mFramerate = this.mReadBuffer.ReadShort();
        this.mReadBuffer.ReadShort();
        this.mReadBuffer.ReadShort();
        this.mReadBuffer.ReadShort();
        this.mWidth = this.mReadBuffer.ReadInt();
        this.mHeight = this.mReadBuffer.ReadInt();
        var aJunk = this.mReadBuffer.ReadInt();
        aJunk = this.mReadBuffer.ReadInt();
        aJunk = this.mReadBuffer.ReadInt();
        aJunk = this.mReadBuffer.ReadInt();
        aJunk = this.mReadBuffer.ReadInt();
        this.mFirstFrameNum = this.mReadBuffer.ReadInt();
        this.mLastFrameNum = this.mReadBuffer.ReadInt();
        var aThumbString = this.ReadString();
        var aByte = this.mReadBuffer.ReadByte();
        var aThumbWidth = this.mReadBuffer.ReadShort();
        var aThumbHeight = this.mReadBuffer.ReadShort();
        if (this.mIsPPF && this.mVersion >= 1) {
            var aStartupStateSize = this.mReadBuffer.ReadInt();
            if (aStartupStateSize > 0) {
                this.mStartupState = new GameFramework.DataBuffer();
                var aBytes = Array.Create(aStartupStateSize, 0);
                theDataBuffer.ReadBytes(aBytes, 0, aStartupStateSize);
                this.mStartupState.InitRead(aBytes);
            }
        } else {
            this.mStartupState = null;
        }
        var aCurCrPos = 0;
        while (aCurCrPos < (this.mNotes.length | 0)) {
            var aLine;
            var aCommaPos = this.mNotes.indexOf(String.fromCharCode(10), aCurCrPos) | 0;
            if (aCommaPos != (-1 | 0)) {
                aLine = this.mNotes.substr(aCurCrPos, aCommaPos - aCurCrPos).trim();
                aCurCrPos = aCommaPos + 1;
            } else {
                aLine = this.mNotes.substr(aCurCrPos).trim();
                aCurCrPos = this.mNotes.length;
            }
            if (aLine.length > 0) {
                if (this.mNotesParams == null) {
                    this.mNotesParams = {};
                }
                var aColonPos = aLine.indexOf(String.fromCharCode(58));
                if (aColonPos != -1) {
                    this.mNotesParams[aLine.substr(0, aColonPos).toUpperCase()] = aLine.substr(aColonPos + 1).trim();
                } else {
                    this.mNotesParams[aLine.toUpperCase()] = "";
                }
            }
        }
        var aRandParam = this.GetNotesParam("Rand");
        var aCurPos = 0;
        while (aCurPos < (aRandParam.length | 0)) {
            var aCommaPos_2 = aRandParam.indexOf(String.fromCharCode(44), aCurPos) | 0;
            if (aCommaPos_2 != (-1 | 0)) {
                this.mRandSeeds.push(
                    GameFramework.Utils.ToInt(aRandParam.substr(aCurPos, aCommaPos_2 - aCurPos).trim())
                );
                aCurPos = aCommaPos_2 + 1;
            } else {
                this.mRandSeeds.push(GameFramework.Utils.ToInt(aRandParam.substr(aCurPos).trim()));
                break;
            }
        }
        this.mEmitAfterTimeline = this.GetNotesParam("EmitAfter", "no") != "no";
        this.DetermineGroupFlags();
        return (this.mLoaded = this.mError == null);
    },
    DetermineGroupFlags: function GameFramework_resources_PIEffect$DetermineGroupFlags() {
        for (var aLayerIdx = 0; aLayerIdx < (this.mDef.mLayerDefVector.length | 0); aLayerIdx++) {
            var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
            var aLayer = this.mLayerVector[aLayerIdx];
            for (
                var anEmitterInstanceIdx = 0;
                anEmitterInstanceIdx < aLayer.mEmitterInstanceVector.length;
                anEmitterInstanceIdx++
            ) {
                var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
                var anEmitterInstance = aLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
                if (anEmitterInstanceDef.mIsSuperEmitter) {
                    for (
                        var aFreeEmitterIdx = 0;
                        aFreeEmitterIdx < anEmitterInstanceDef.mFreeEmitterIndices.length;
                        aFreeEmitterIdx++
                    ) {
                        var anEmitter =
                            this.mDef.mEmitterVector[anEmitterInstanceDef.mFreeEmitterIndices[aFreeEmitterIdx]];
                        for (
                            var aParticleDefIdx = 0;
                            (aParticleDefIdx | 0) < anEmitter.mParticleDefVector.length;
                            aParticleDefIdx++
                        ) {
                            var aParticleGroup = anEmitterInstance.mParticleGroup;
                            var aParticleDef = anEmitter.mParticleDefVector[aParticleDefIdx];
                            anEmitterInstance.mParticleGroup.mHasColorSampling |=
                                aParticleDef.mUpdateColorFromLayer || aParticleDef.mUpdateTransparencyFromLayer;
                            anEmitterInstance.mParticleGroup.mHasVelocityEffectors |=
                                aLayer.mLayerDef.mForceVector.length > 0 ||
                                aLayer.mLayerDef.mDeflectorVector.length > 0;
                            anEmitterInstance.mParticleGroup.mHasAlignToMotion |= aParticleDef.mAngleAlignToMotion;
                            anEmitterInstance.mParticleGroup.mHasIntense |= aParticleDef.mIntense;
                            anEmitterInstance.mParticleGroup.mHasPreserveColor |= aParticleDef.mPreserveColor;
                            anEmitterInstance.mParticleGroup.mHasSingleParticles |= aParticleDef.mSingleParticle;
                            anEmitterInstance.mParticleGroup.mHasAttachToEmitters |= aParticleDef.mAttachToEmitter;
                            var aTexture = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                            anEmitterInstance.mParticleGroup.mHasImageCycle |=
                                aParticleDef.mAnimSpeed != -1 && aTexture.mNumCels > 1;
                        }
                    }
                } else {
                    var anEmitter_2 = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                    for (
                        var aParticleDefIdx_2 = 0;
                        aParticleDefIdx_2 < anEmitter_2.mParticleDefVector.length;
                        aParticleDefIdx_2++
                    ) {
                        var aParticleGroup_2 = anEmitterInstance.mParticleGroup;
                        var aParticleDef_2 = anEmitter_2.mParticleDefVector[aParticleDefIdx_2];
                        anEmitterInstance.mParticleGroup.mHasColorSampling |=
                            aParticleDef_2.mUpdateColorFromLayer || aParticleDef_2.mUpdateTransparencyFromLayer;
                        anEmitterInstance.mParticleGroup.mHasVelocityEffectors |=
                            aLayer.mLayerDef.mForceVector.length > 0 || aLayer.mLayerDef.mDeflectorVector.length > 0;
                        anEmitterInstance.mParticleGroup.mHasAlignToMotion |= aParticleDef_2.mAngleAlignToMotion;
                        anEmitterInstance.mParticleGroup.mHasIntense |= aParticleDef_2.mIntense;
                        anEmitterInstance.mParticleGroup.mHasPreserveColor |= aParticleDef_2.mPreserveColor;
                        anEmitterInstance.mParticleGroup.mHasSingleParticles |= aParticleDef_2.mSingleParticle;
                        anEmitterInstance.mParticleGroup.mHasAttachToEmitters |= aParticleDef_2.mAttachToEmitter;
                        var aTexture_2 = this.mDef.mTextureVector[aParticleDef_2.mTextureIdx];
                        anEmitterInstance.mParticleGroup.mHasImageCycle |=
                            aParticleDef_2.mAnimSpeed != -1 && aTexture_2.mNumCels > 1;
                    }
                }
            }
        }
    },
    LoadState: function GameFramework_resources_PIEffect$LoadState(theBuffer, shortened) {
        if (this.mError != null) {
            return false;
        }
        this.ResetAnim();
        var aSize = theBuffer.ReadInt();
        var anEnd = theBuffer.get_Size();
        var aVersion = theBuffer.ReadShort();
        if (!shortened) {
            var aSrcFileName = theBuffer.ReadAsciiString();
            var aChecksum = theBuffer.ReadInt();
            if (aChecksum != this.mFileChecksum) {
                return false;
            }
        }
        this.mFrameNum = theBuffer.ReadFloat();
        if (!shortened) {
            var aRandSeed = theBuffer.ReadAsciiString();
            this.mWantsSRand = false;
        }
        if (!shortened) {
            this.mEmitAfterTimeline = theBuffer.ReadBoolean();
            this.mEmitterTransform = this.ReadTransform2D(theBuffer);
            this.mDrawTransform = this.ReadTransform2D(theBuffer);
        } else if (aVersion == 0) {
            theBuffer.ReadBoolean();
        }
        if (this.mFrameNum > 0.0) {
            for (var aLayerIdx = 0; aLayerIdx < (this.mDef.mLayerDefVector.length | 0); aLayerIdx++) {
                var aLayer = this.mLayerVector[aLayerIdx];
                var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
                for (
                    var anEmitterInstanceIdx = 0;
                    anEmitterInstanceIdx < aLayerDef.mEmitterInstanceDefVector.length;
                    anEmitterInstanceIdx++
                ) {
                    var anEmitterInstance = aLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
                    var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
                    if (theBuffer.ReadBoolean()) {
                        anEmitterInstance.mTransform = this.ReadTransform2D(theBuffer);
                    }
                    anEmitterInstance.mWasActive = theBuffer.ReadBoolean();
                    anEmitterInstance.mWithinLifeFrame = theBuffer.ReadBoolean();
                    var aDefEmitter = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                    for (
                        var aParticleDefIdx = 0;
                        aParticleDefIdx < aDefEmitter.mParticleDefVector.length;
                        aParticleDefIdx++
                    ) {
                        var aParticleDefInstance = anEmitterInstance.mParticleDefInstanceVector[aParticleDefIdx];
                        this.LoadParticleDefInstance(theBuffer, aParticleDefInstance);
                    }
                    for (
                        var aFreeEmitterIdx = 0;
                        aFreeEmitterIdx < anEmitterInstanceDef.mFreeEmitterIndices.length;
                        aFreeEmitterIdx++
                    ) {
                        var aParticleDefInstance_2 =
                            anEmitterInstance.mSuperEmitterParticleDefInstanceVector[aFreeEmitterIdx];
                        this.LoadParticleDefInstance(theBuffer, aParticleDefInstance_2);
                    }
                    var aSuperEmitterCount = theBuffer.ReadInt();
                    for (var aSuperEmitterIdx = 0; aSuperEmitterIdx < aSuperEmitterCount; aSuperEmitterIdx++) {
                        var aChildEmitterInstance = new GameFramework.resources.PIFreeEmitterInstance();
                        var anEmitterIdx = theBuffer.ReadShort();
                        aChildEmitterInstance.mEmitterSrc =
                            this.mDef.mEmitterVector[anEmitterInstanceDef.mFreeEmitterIndices[anEmitterIdx]];
                        aChildEmitterInstance.mParentFreeEmitter = null;
                        aChildEmitterInstance.mParticleDef = null;
                        aChildEmitterInstance.mNum = aSuperEmitterIdx;
                        this.LoadParticle(theBuffer, aLayer, aChildEmitterInstance);
                        var anEmitter = aChildEmitterInstance.mEmitterSrc;
                        aChildEmitterInstance.mEmitter.mParticleDefInstanceVector = [];
                        for (
                            var aParticleDefIdx_2 = 0;
                            aParticleDefIdx_2 < anEmitter.mParticleDefVector.length;
                            aParticleDefIdx_2++
                        ) {
                            var aParticleDefInstance_3 = new GameFramework.resources.PIParticleDefInstance();
                            aChildEmitterInstance.mEmitter.mParticleDefInstanceVector.push(aParticleDefInstance_3);
                            this.LoadParticleDefInstance(theBuffer, aParticleDefInstance_3);
                        }
                        if (aSuperEmitterIdx > 0) {
                            anEmitterInstance.mSuperEmitterGroup.mTail.mNext = aChildEmitterInstance;
                            aChildEmitterInstance.mPrev = anEmitterInstance.mSuperEmitterGroup.mTail;
                        } else {
                            anEmitterInstance.mSuperEmitterGroup.mHead = aChildEmitterInstance;
                        }
                        anEmitterInstance.mSuperEmitterGroup.mTail = aChildEmitterInstance;
                        anEmitterInstance.mSuperEmitterGroup.mCount++;
                        var aParticlesCount = theBuffer.ReadInt();
                        for (var aParticleIdx = 0; aParticleIdx < aParticlesCount; aParticleIdx++) {
                            var aParticleInstance = new GameFramework.resources.PIParticleInstance();
                            aParticleInstance.mEmitterSrc = aChildEmitterInstance.mEmitterSrc;
                            aParticleInstance.mParentFreeEmitter = aChildEmitterInstance;
                            var aParticleDefIdx_3 = theBuffer.ReadShort();
                            aParticleInstance.mParticleDef =
                                aParticleInstance.mEmitterSrc.mParticleDefVector[aParticleDefIdx_3];
                            aParticleInstance.mParticleDefInstance =
                                aChildEmitterInstance.mEmitter.mParticleDefInstanceVector[aParticleDefIdx_3];
                            aParticleInstance.mNum = aParticleIdx;
                            this.LoadParticle(theBuffer, aLayer, aParticleInstance);
                            this.CalcParticleTransform(
                                aLayer,
                                anEmitterInstance,
                                aParticleInstance.mEmitterSrc,
                                aParticleInstance.mParticleDef,
                                aChildEmitterInstance.mEmitter.mParticleGroup,
                                aParticleInstance
                            );
                            if (aParticleIdx > 0) {
                                aChildEmitterInstance.mEmitter.mParticleGroup.mTail.mNext = aParticleInstance;
                                aParticleInstance.mPrev = aChildEmitterInstance.mEmitter.mParticleGroup.mTail;
                            } else {
                                aChildEmitterInstance.mEmitter.mParticleGroup.mHead = aParticleInstance;
                            }
                            aChildEmitterInstance.mEmitter.mParticleGroup.mTail = aParticleInstance;
                            aChildEmitterInstance.mEmitter.mParticleGroup.mCount++;
                        }
                    }
                    var aParticleCount = theBuffer.ReadInt();
                    for (var aParticleIdx_2 = 0; aParticleIdx_2 < aParticleCount; aParticleIdx_2++) {
                        var aParticleInstance_2 = new GameFramework.resources.PIParticleInstance();
                        aParticleInstance_2.mEmitterSrc = aDefEmitter;
                        aParticleInstance_2.mParentFreeEmitter = null;
                        var aParticleDefIdx_4 = theBuffer.ReadShort();
                        aParticleInstance_2.mParticleDef =
                            aParticleInstance_2.mEmitterSrc.mParticleDefVector[aParticleDefIdx_4];
                        aParticleInstance_2.mParticleDefInstance =
                            anEmitterInstance.mParticleDefInstanceVector[aParticleDefIdx_4];
                        aParticleInstance_2.mNum = aParticleIdx_2;
                        this.LoadParticle(theBuffer, aLayer, aParticleInstance_2);
                        this.CalcParticleTransform(
                            aLayer,
                            anEmitterInstance,
                            aParticleInstance_2.mEmitterSrc,
                            aParticleInstance_2.mParticleDef,
                            anEmitterInstance.mParticleGroup,
                            aParticleInstance_2
                        );
                        if (aParticleIdx_2 > 0) {
                            anEmitterInstance.mParticleGroup.mTail.mNext = aParticleInstance_2;
                            aParticleInstance_2.mPrev = anEmitterInstance.mParticleGroup.mTail;
                        } else {
                            anEmitterInstance.mParticleGroup.mHead = aParticleInstance_2;
                        }
                        anEmitterInstance.mParticleGroup.mTail = aParticleInstance_2;
                        anEmitterInstance.mParticleGroup.mCount++;
                    }
                }
            }
        } else {
            theBuffer.set_Position(anEnd);
        }
        return true;
    },
    ResetAnim: function GameFramework_resources_PIEffect$ResetAnim() {
        this.mFrameNum = 0;
        if (this.mDef.mLayerDefVector != null) {
            for (var aLayerIdx = 0; aLayerIdx < this.mDef.mLayerDefVector.length; aLayerIdx++) {
                var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
                var aLayer = this.mLayerVector[aLayerIdx];
                for (
                    var anEmitterInstanceIdx = 0;
                    anEmitterInstanceIdx < (aLayer.mEmitterInstanceVector.length | 0);
                    anEmitterInstanceIdx++
                ) {
                    var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
                    var anEmitterInstance = aLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
                    var aParticleInstance;
                    var aChildEmitterInstance = anEmitterInstance.mSuperEmitterGroup.mHead;
                    while (aChildEmitterInstance != null) {
                        var aNext = aChildEmitterInstance.mNext;
                        aParticleInstance = aChildEmitterInstance.mEmitter.mParticleGroup.mHead;
                        while (aParticleInstance != null) {
                            var anotherNext = aParticleInstance.mNext;
                            aParticleInstance.Dispose();
                            aParticleInstance = anotherNext;
                        }
                        aChildEmitterInstance.Dispose();
                        aChildEmitterInstance = aNext;
                    }
                    anEmitterInstance.mSuperEmitterGroup.mHead = null;
                    anEmitterInstance.mSuperEmitterGroup.mTail = null;
                    anEmitterInstance.mSuperEmitterGroup.mCount = 0;
                    aParticleInstance = anEmitterInstance.mParticleGroup.mHead;
                    while (aParticleInstance != null) {
                        var aNext_2 = aParticleInstance.mNext;
                        aParticleInstance.Dispose();
                        aParticleInstance = aNext_2;
                    }
                    anEmitterInstance.mParticleGroup.mHead = null;
                    anEmitterInstance.mParticleGroup.mTail = null;
                    anEmitterInstance.mParticleGroup.mCount = 0;
                    for (
                        var aFreeEmitterIdx = 0;
                        aFreeEmitterIdx < (anEmitterInstanceDef.mFreeEmitterIndices.length | 0);
                        aFreeEmitterIdx++
                    ) {
                        var aParticleDefInstance =
                            anEmitterInstance.mSuperEmitterParticleDefInstanceVector[aFreeEmitterIdx];
                        aParticleDefInstance.Reset();
                    }
                    var anEmitter = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                    for (
                        var aParticleDefIdx = 0;
                        (aParticleDefIdx | 0) < (anEmitter.mParticleDefVector.length | 0);
                        aParticleDefIdx++
                    ) {
                        var aParticleDefInstance_2 = anEmitterInstance.mParticleDefInstanceVector[aParticleDefIdx];
                        aParticleDefInstance_2.Reset();
                    }
                    anEmitterInstance.mWithinLifeFrame = true;
                    anEmitterInstance.mWasActive = false;
                }
            }
        }
        this.mCurNumEmitters = 0;
        this.mCurNumParticles = 0;
        this.mLastDrawnPixelCount = 0;
        this.mWantsSRand = true;
    },
    Clear: function GameFramework_resources_PIEffect$Clear() {
        this.mError = null;
        this.ResetAnim();
        this.mStringVector = null;
        this.mNotesParams = null;
        this.mDef.mEmitterVector = null;
        this.mDef.mTextureVector = null;
        this.mDef.mLayerDefVector = null;
        this.mDef.mEmitterRefMap = null;
        this.mRandSeeds = null;
        this.mVersion = 0;
        this.mLoaded = false;
    },
    GetLayer: function GameFramework_resources_PIEffect$GetLayer(theIdx) {
        if (theIdx < (this.mDef.mLayerDefVector.length | 0)) {
            return this.mLayerVector[theIdx];
        }
        return null;
    },
    GetLayer$2: function GameFramework_resources_PIEffect$GetLayer$2(theName) {
        for (var i = 0; i < (this.mDef.mLayerDefVector.length | 0); i++) {
            if (theName.length == 0 || this.mDef.mLayerDefVector[i].mName == theName) {
                return this.mLayerVector[i];
            }
        }
        return null;
    },
    GetEmitterPos: function GameFramework_resources_PIEffect$GetEmitterPos(theEmitterInstance, doTransform) {
        var aCurPoint = theEmitterInstance.mEmitterInstanceDef.mPosition.GetValueAt(this.mFrameNum);
        if (doTransform) {
            aCurPoint = theEmitterInstance.mTransform.transformPoint(aCurPoint);
            if (this.mEmitterTransform != null) {
                aCurPoint = this.mEmitterTransform.transformPoint(aCurPoint);
            }
            aCurPoint.offset(theEmitterInstance.mOffset.x, theEmitterInstance.mOffset.y);
        }
        return aCurPoint;
    },
    CountParticles: function GameFramework_resources_PIEffect$CountParticles(theStart) {
        var aCount = 0;
        while (theStart != null) {
            aCount++;
            theStart = theStart.mNext;
        }
        return aCount;
    },
    CalcParticleTransform: function GameFramework_resources_PIEffect$CalcParticleTransform(
        theLayer,
        theEmitterInstance,
        theEmitter,
        theParticleDef,
        theParticleGroup,
        theParticleInstance
    ) {
        var anEmitter = theEmitter;
        var aParticleDef = theParticleDef;
        var aParticleInstance = theParticleInstance;
        var aLifePct = aParticleInstance.mLifePct;
        var anEmitterDef = theEmitterInstance.mEmitterInstanceDef;
        var aBaseRotTrans = new GameFramework.geom.Matrix();
        var aScaleX;
        var aScaleY;
        var aTransform = new GameFramework.geom.Matrix();
        var anEmitterPos;
        if (theParticleDef != null) {
            var anIdx =
                (aParticleInstance.mLifePctInt /
                    ((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0)) |
                0;
            var aLifeValueSample = theParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx];
            var aTextureChunk = theParticleDef.mTextureChunkVector[aParticleInstance.mImgIdx];
            aParticleInstance.mTextureChunk = aTextureChunk;
            if (theParticleDef.mSingleParticle) {
                aParticleInstance.mSrcSizeXMult =
                    theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_X | 0
                    ].GetValueAt(this.mFrameNum) *
                    (aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.SIZE_X | 0].GetValueAt(
                        this.mFrameNum
                    ) +
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0
                        ]);
                aParticleInstance.mSrcSizeYMult =
                    theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_Y | 0
                    ].GetValueAt(this.mFrameNum) *
                    (aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.SIZE_Y | 0].GetValueAt(
                        this.mFrameNum
                    ) +
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0
                        ]);
            }
            var aSizeX = Math.max(aLifeValueSample.mSizeX * aParticleInstance.mSrcSizeXMult, 1.5);
            var aSizeY = Math.max(aLifeValueSample.mSizeY * aParticleInstance.mSrcSizeYMult, 1.5);
            aScaleX = aSizeX * aTextureChunk.mScaleXFactor;
            aScaleY = aSizeY * aTextureChunk.mScaleYFactor;
            if (theParticleDef.mCalcParticleTransformWantsBaseRotTrans) {
                aBaseRotTrans.identity();
                var anEmitterRot = anEmitterDef.mCurAngle;
                if (anEmitterRot != 0) {
                    aBaseRotTrans.rotate(anEmitterRot);
                }
                if (
                    aParticleInstance.mParentFreeEmitter != null &&
                    aParticleInstance.mParentFreeEmitter.mImgAngle != 0
                ) {
                    aBaseRotTrans.rotate(-aParticleInstance.mParentFreeEmitter.mImgAngle);
                }
            }
            var aRot = aParticleInstance.mImgAngle;
            if (theParticleDef.mAttachToEmitter) {
                if (aParticleInstance.mParentFreeEmitter != null) {
                    aRot +=
                        (aParticleInstance.mParentFreeEmitter.mImgAngle - aParticleInstance.mOrigEmitterAng) *
                        theParticleDef.mAttachVal;
                } else {
                    aRot += anEmitterDef.mCurAngle * theParticleDef.mAttachVal;
                }
            }
            if (theParticleDef.mSingleParticle) {
                if (!theParticleDef.mAngleKeepAlignedToMotion || theParticleDef.mAttachToEmitter) {
                    aRot += anEmitterDef.mCurAngle;
                }
            }
            if (theParticleDef != null && theParticleDef.mSingleParticle) {
                aParticleInstance.mZoom =
                    theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.ZOOM | 0
                    ].GetValueAt(this.mFrameNum) *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.ZOOM | 0].GetValueAt(this.mFrameNum, 1.0);
            }
            var aParticlePos = aParticleInstance.mPos;
            if (theParticleDef.mAttachToEmitter) {
                var aBackTrans = new GameFramework.geom.Matrix();
                aBackTrans.rotate(aParticleInstance.mOrigEmitterAng);
                var aBackPoint = aBackTrans.transformPoint(aParticlePos);
                var aCurRotPos = aBaseRotTrans.transformPoint(aBackPoint);
                aParticlePos.x =
                    aParticlePos.x * (1.0 - theParticleDef.mAttachVal) + aCurRotPos.x * theParticleDef.mAttachVal;
                aParticlePos.y =
                    aParticlePos.y * (1.0 - theParticleDef.mAttachVal) + aCurRotPos.y * theParticleDef.mAttachVal;
            }
            if (aParticleInstance.mZoom != 1.0) {
                var sin = Math.sin(aRot) * aParticleInstance.mZoom;
                var cos = Math.cos(aRot) * aParticleInstance.mZoom;
                aTransform.a = cos * aScaleX;
                aTransform.b = sin * aScaleX;
                aTransform.c = -sin * aScaleY;
                aTransform.d = cos * aScaleY;
                aTransform.tx = (aParticlePos.x + aTextureChunk.mRefOfsX * aScaleX) * aParticleInstance.mZoom;
                aTransform.ty = (aParticlePos.y + aTextureChunk.mRefOfsY * aScaleY) * aParticleInstance.mZoom;
            } else {
                var sin_2 = Math.sin(aRot);
                var cos_2 = Math.cos(aRot);
                aTransform.a = cos_2 * aScaleX;
                aTransform.b = sin_2 * aScaleX;
                aTransform.c = -sin_2 * aScaleY;
                aTransform.d = cos_2 * aScaleY;
                aTransform.tx = aParticlePos.x + aTextureChunk.mRefOfsX * aScaleX;
                aTransform.ty = aParticlePos.y + aTextureChunk.mRefOfsY * aScaleY;
            }
            anEmitterPos = aParticleInstance.mEmittedPos;
            if (theParticleDef.mSingleParticle) {
                var aCurEmitPos = aBaseRotTrans.transformPoint(aParticleInstance.mOrigPos);
                var aTempEmitterPos = this.GetEmitterPos(theEmitterInstance, !theParticleGroup.mWasEmitted);
                aCurEmitPos.x += aTempEmitterPos.x;
                aCurEmitPos.y += aTempEmitterPos.y;
                anEmitterPos = aCurEmitPos;
            } else if (theParticleDef.mAttachToEmitter && !theParticleGroup.mIsSuperEmitter) {
                var aCurEmitPos_2;
                if (aParticleInstance.mParentFreeEmitter != null) {
                    aCurEmitPos_2 = new GameFramework.geom.TPoint(
                        aParticleInstance.mParentFreeEmitter.mLastEmitterPos.x +
                            aParticleInstance.mParentFreeEmitter.mOrigPos.x +
                            aParticleInstance.mParentFreeEmitter.mPos.x,
                        aParticleInstance.mParentFreeEmitter.mLastEmitterPos.y +
                            aParticleInstance.mParentFreeEmitter.mOrigPos.y +
                            aParticleInstance.mParentFreeEmitter.mPos.y
                    );
                } else {
                    aCurEmitPos_2 = aBaseRotTrans.transformPoint(aParticleInstance.mOrigPos);
                    var aCurEmitterPos = this.GetEmitterPos(theEmitterInstance, !theParticleGroup.mWasEmitted);
                    aCurEmitPos_2.x += aCurEmitterPos.x;
                    aCurEmitPos_2.y += aCurEmitterPos.y;
                }
                anEmitterPos.x =
                    anEmitterPos.x * (1.0 - theParticleDef.mAttachVal) + aCurEmitPos_2.x * theParticleDef.mAttachVal;
                anEmitterPos.y =
                    anEmitterPos.y * (1.0 - theParticleDef.mAttachVal) + aCurEmitPos_2.y * theParticleDef.mAttachVal;
            }
        } else {
            if (aParticleInstance.mImgAngle != 0) {
                aTransform.rotate(aParticleInstance.mImgAngle);
            }
            var aParticlePos_2 = aParticleInstance.mPos;
            aTransform.translate(aParticlePos_2.x, aParticlePos_2.y);
            if (aParticleInstance.mZoom != 1.0) {
                aTransform.scale(aParticleInstance.mZoom, aParticleInstance.mZoom);
            }
            anEmitterPos = aParticleInstance.mEmittedPos;
        }
        aParticleInstance.mLastEmitterPos = anEmitterPos;
        aTransform.translate(anEmitterPos.x + theLayer.mCurOffset.x, anEmitterPos.y + theLayer.mCurOffset.y);
        if (theLayer.mCurAngle != 0) {
            aTransform.rotate(theLayer.mCurAngle);
        }
        theParticleInstance.mTransform = aTransform;
    },
    CalcParticleTransformSimple: function GameFramework_resources_PIEffect$CalcParticleTransformSimple(
        theLayer,
        theEmitterInstance,
        theEmitter,
        theParticleDef,
        theParticleGroup,
        theParticleInstance,
        theScaleX,
        theScaleY
    ) {
        var anEmitter = theEmitter;
        var aParticleDef = theParticleDef;
        var aParticleInstance = theParticleInstance;
        var aLifePct = aParticleInstance.mLifePct;
        var anEmitterDef = theEmitterInstance.mEmitterInstanceDef;
        var aBaseRotTrans = new GameFramework.geom.Matrix();
        var aScaleX;
        var aScaleY;
        var aTransform = theParticleInstance.mTransform;
        var anEmitterPos;
        var aTextureChunk = theParticleDef.mTextureChunkVector[aParticleInstance.mImgIdx];
        aParticleInstance.mTextureChunk = aTextureChunk;
        var aSizeX = Math.max(theScaleX * aParticleInstance.mSrcSizeXMult, 1.5);
        var aSizeY = Math.max(theScaleY * aParticleInstance.mSrcSizeYMult, 1.5);
        aScaleX = aSizeX * aTextureChunk.mScaleXFactor;
        aScaleY = aSizeY * aTextureChunk.mScaleYFactor;
        if (aParticleInstance.mZoom != 1.0) {
            var sin = Math.sin(aParticleInstance.mImgAngle) * aParticleInstance.mZoom;
            var cos = Math.cos(aParticleInstance.mImgAngle) * aParticleInstance.mZoom;
            aTransform.a = cos * aScaleX;
            aTransform.b = sin * aScaleX;
            aTransform.c = -sin * aScaleY;
            aTransform.d = cos * aScaleY;
            aTransform.tx = (aParticleInstance.mPos.x + aTextureChunk.mRefOfsX * aScaleX) * aParticleInstance.mZoom;
            aTransform.ty = (aParticleInstance.mPos.y + aTextureChunk.mRefOfsY * aScaleY) * aParticleInstance.mZoom;
        } else {
            var sin_2 = Math.sin(aParticleInstance.mImgAngle);
            var cos_2 = Math.cos(aParticleInstance.mImgAngle);
            aTransform.a = cos_2 * aScaleX;
            aTransform.b = sin_2 * aScaleX;
            aTransform.c = -sin_2 * aScaleY;
            aTransform.d = cos_2 * aScaleY;
            aTransform.tx = aParticleInstance.mPos.x + aTextureChunk.mRefOfsX * aScaleX;
            aTransform.ty = aParticleInstance.mPos.y + aTextureChunk.mRefOfsY * aScaleY;
        }
        anEmitterPos = aParticleInstance.mEmittedPos;
        aTransform.translate(anEmitterPos.x + theLayer.mCurOffset.x, anEmitterPos.y + theLayer.mCurOffset.y);
        if (theLayer.mCurAngle != 0) {
            aTransform.rotate(theLayer.mCurAngle);
        }
    },
    UpdateParticleDef: function GameFramework_resources_PIEffect$UpdateParticleDef(
        theLayer,
        theEmitter,
        theEmitterInstance,
        theParticleDef,
        theParticleDefInstance,
        theParticleGroup,
        theFreeEmitter
    ) {
        var anEmitterInstanceDef = theEmitterInstance.mEmitterInstanceDef;
        var anUpdateRate = 1000.0 / this.mFrameTime / this.mAnimSpeed;
        var anEmitter = theEmitter;
        var aParticleDef = theParticleDef;
        var anEmitterLifePct = 0;
        if (theFreeEmitter != null) {
            anEmitterLifePct = theFreeEmitter.mLifePct;
        }
        if (aParticleDef != null) {
            var anOrigAlphaI =
                ((((((this.mColor >>> 24) & 0xff) * (((theLayer.mColor >>> 24) & 0xff) * 256)) / 255) | 0) / 255) |
                0 |
                0;
            theParticleDefInstance.mAlphaI =
                (anOrigAlphaI *
                    theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.VISIBILITY | 0
                    ].GetValueAt(this.mFrameNum) *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.VISIBILITY | 0].GetValueAt(
                        this.mFrameNum,
                        1.0
                    ) *
                    aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.VISIBILITY | 0].GetValueAt(
                        this.mFrameNum
                    )) |
                0;
            theParticleDefInstance.mCurWeight = aParticleDef.mValues[
                GameFramework.resources.PIParticleDef.Value.WEIGHT | 0
            ].GetValueAt(this.mFrameNum);
            theParticleDefInstance.mCurSpin = aParticleDef.mValues[
                GameFramework.resources.PIParticleDef.Value.SPIN | 0
            ].GetValueAt(this.mFrameNum);
            theParticleDefInstance.mCurMotionRand = aParticleDef.mValues[
                GameFramework.resources.PIParticleDef.Value.MOTION_RAND | 0
            ].GetValueAt(this.mFrameNum);
        }
        if (theParticleDefInstance.mTicks % 25 == 0) {
            if (!theParticleGroup.mIsSuperEmitter) {
                if (theParticleDefInstance.mTicks == 0) {
                    theParticleDefInstance.mCurNumberVariation =
                        (this.GetRandFloat() *
                            0.5 *
                            aParticleDef.mValues[
                                GameFramework.resources.PIParticleDef.Value.NUMBER_VARIATION | 0
                            ].GetValueAt(this.mFrameNum)) /
                        2.0;
                } else {
                    theParticleDefInstance.mCurNumberVariation =
                        (this.GetRandFloat() *
                            0.75 *
                            aParticleDef.mValues[
                                GameFramework.resources.PIParticleDef.Value.NUMBER_VARIATION | 0
                            ].GetValueAt(this.mFrameNum)) /
                        2.0;
                }
            }
        }
        theParticleDefInstance.mTicks++;
        var aNumber;
        if (theParticleGroup.mIsSuperEmitter) {
            aNumber =
                anEmitter.mValues[GameFramework.resources.PIEmitter.Value.NUMBER | 0].GetValueAt(this.mFrameNum) *
                theEmitterInstance.mEmitterInstanceDef.mValues[
                    GameFramework.resources.PIEmitterInstanceDef.Value.NUMBER | 0
                ].GetValueAt(this.mFrameNum);
        } else {
            aNumber =
                (theParticleGroup.mWasEmitted
                    ? anEmitter.mValues[GameFramework.resources.PIEmitter.Value.NUMBER | 0].GetValueAt(this.mFrameNum)
                    : theEmitterInstance.mEmitterInstanceDef.mValues[
                          GameFramework.resources.PIEmitterInstanceDef.Value.NUMBER | 0
                      ].GetValueAt(this.mFrameNum)) *
                (aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.NUMBER | 0].GetValueAt(
                    this.mFrameNum
                ) +
                    theParticleDefInstance.mCurNumberVariation) *
                anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_NUMBER_OVER_LIFE | 0].GetValueAt(
                    anEmitterLifePct,
                    1.0
                );
            aNumber = Math.max(0.0, aNumber);
            if (theParticleGroup.mWasEmitted && anEmitterLifePct >= 1.0) {
                aNumber = 0;
            }
        }
        aNumber *= theEmitterInstance.mNumberScale;
        if (theParticleGroup.mIsSuperEmitter) {
            aNumber *= 30.0;
        } else if (!theParticleGroup.mWasEmitted) {
            switch (anEmitterInstanceDef.mEmitterGeom) {
                case GameFramework.resources.PIEmitterInstanceDef.Geom.LINE:
                    {
                        if (anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                            aNumber *= anEmitterInstanceDef.mEmitAtPointsNum;
                        } else {
                            var aTotalLength = 0.0;
                            for (var i = 0; i < (anEmitterInstanceDef.mPoints.length | 0) - 1; i++) {
                                var aPt1 = anEmitterInstanceDef.mPoints[i].GetValueAt(this.mFrameNum);
                                var aPt2 = anEmitterInstanceDef.mPoints[i + 1].GetValueAt(this.mFrameNum);
                                aTotalLength += GameFramework.geom.TPoint.distance(aPt2, aPt1);
                            }
                            aNumber *= aTotalLength / 35.0;
                        }
                    }

                    break;
                case GameFramework.resources.PIEmitterInstanceDef.Geom.ECLIPSE:
                    {
                        var aXRad = theEmitterInstance.mEmitterInstanceDef.mValues[
                            GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0
                        ].GetValueAt(this.mFrameNum);
                        var aYRad = theEmitterInstance.mEmitterInstanceDef.mValues[
                            GameFramework.resources.PIEmitterInstanceDef.Value.YRADIUS | 0
                        ].GetValueAt(this.mFrameNum);
                        if (anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                            aNumber *= anEmitterInstanceDef.mEmitAtPointsNum;
                        } else {
                            var aCircumf = 3.14159 * 2.0 * Math.sqrt((aXRad * aXRad + aYRad * aYRad) / 2.0);
                            aNumber *= aCircumf / 35.0;
                        }
                    }

                    break;
                case GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE:
                    {
                        var aRad = theEmitterInstance.mEmitterInstanceDef.mValues[
                            GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0
                        ].GetValueAt(this.mFrameNum);
                        if (anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                            aNumber *= anEmitterInstanceDef.mEmitAtPointsNum;
                        } else {
                            var aCircumf_2 = 3.14159 * 2.0 * Math.sqrt(aRad * aRad);
                            aNumber *= aCircumf_2 / 35.0;
                        }
                    }

                    break;
                case GameFramework.resources.PIEmitterInstanceDef.Geom.AREA:
                    {
                        if (anEmitterInstanceDef.mEmitAtPointsNum != 0) {
                            aNumber *= anEmitterInstanceDef.mEmitAtPointsNum * anEmitterInstanceDef.mEmitAtPointsNum2;
                        } else {
                            var aW = theEmitterInstance.mEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.XRADIUS | 0
                            ].GetValueAt(this.mFrameNum);
                            var aH = theEmitterInstance.mEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.YRADIUS | 0
                            ].GetValueAt(this.mFrameNum);
                            aNumber *= 1.0 + (aW * aH) / 900.0 / 4.0;
                        }
                    }

                    break;
            }
        }
        theParticleDefInstance.mNumberAcc +=
            (aNumber / anUpdateRate) * GameFramework.resources.PIEffect.mGlobalCountScale * this.mDef.mCountScale;
        if (
            (!anEmitterInstanceDef.mIsSuperEmitter && !theEmitterInstance.mWasActive) ||
            !theEmitterInstance.mWithinLifeFrame
        ) {
            theParticleDefInstance.mNumberAcc = 0.0;
        }
        var canUseGeom = true;
        if (!theParticleGroup.mIsSuperEmitter && theParticleDef.mSingleParticle) {
            var aWantCount;
            if (
                anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.LINE ||
                anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE
            ) {
                aWantCount = anEmitterInstanceDef.mEmitAtPointsNum;
            } else if (anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.AREA) {
                aWantCount = anEmitterInstanceDef.mEmitAtPointsNum * anEmitterInstanceDef.mEmitAtPointsNum2;
            } else {
                aWantCount = 1;
            }
            if (aWantCount == 0) {
                canUseGeom = false;
                aWantCount = 1;
            }
            var aCount = 0;
            var aCheckInstance = theParticleGroup.mHead;
            while (aCheckInstance != null) {
                if (aCheckInstance.mParticleDef == aParticleDef) {
                    aCount++;
                }
                aCheckInstance = aCheckInstance.mNext;
            }
            theParticleDefInstance.mNumberAcc = aWantCount - aCount;
        }
        while (theParticleDefInstance.mNumberAcc >= 1.0) {
            theParticleDefInstance.mNumberAcc -= 1.0;
            var aParticleInstance;
            if (theParticleGroup.mIsSuperEmitter) {
                var anEmitterInstance = new GameFramework.resources.PIFreeEmitterInstance();
                anEmitterInstance.mEmitter.mParticleDefInstanceVector = [];
                for (var i_2 = 0; i_2 < theEmitter.mParticleDefVector.length; i_2++) {
                    anEmitterInstance.mEmitter.mParticleDefInstanceVector.push(
                        new GameFramework.resources.PIParticleDefInstance()
                    );
                }
                aParticleInstance = anEmitterInstance;
            } else {
                aParticleInstance = new GameFramework.resources.PIParticleInstance();
            }
            aParticleInstance.mParticleDef = theParticleDef;
            aParticleInstance.mParticleDefInstance = theParticleDefInstance;
            aParticleInstance.mEmitterSrc = theEmitter;
            aParticleInstance.mParentFreeEmitter = theFreeEmitter;
            aParticleInstance.mNum = theParticleDefInstance.mParticlesEmitted++;
            var anAngle;
            if (!theParticleGroup.mIsSuperEmitter) {
                if (theParticleDef.mUseEmitterAngleAndRange) {
                    if (theParticleGroup.mWasEmitted) {
                        anAngle =
                            anEmitter.mValues[GameFramework.resources.PIEmitter.Value.EMISSION_ANGLE | 0].GetValueAt(
                                this.mFrameNum
                            ) +
                            (anEmitter.mValues[GameFramework.resources.PIEmitter.Value.EMISSION_RANGE | 0].GetValueAt(
                                this.mFrameNum
                            ) *
                                this.GetRandFloat()) /
                                2.0;
                    } else {
                        anAngle =
                            theEmitterInstance.mEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_ANGLE | 0
                            ].GetValueAt(this.mFrameNum) +
                            (theEmitterInstance.mEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_RANGE | 0
                            ].GetValueAt(this.mFrameNum) *
                                this.GetRandFloat()) /
                                2.0;
                    }
                } else {
                    anAngle =
                        aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.EMISSION_ANGLE | 0].GetValueAt(
                            this.mFrameNum
                        ) +
                        (aParticleDef.mValues[
                            GameFramework.resources.PIParticleDef.Value.EMISSION_RANGE | 0
                        ].GetValueAt(this.mFrameNum) *
                            this.GetRandFloat()) /
                            2.0;
                }
            } else {
                anAngle =
                    theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_ANGLE | 0
                    ].GetValueAt(this.mFrameNum) +
                    (theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.EMISSION_RANGE | 0
                    ].GetValueAt(this.mFrameNum) *
                        this.GetRandFloat()) /
                        2.0;
            }
            anAngle = GameFramework.resources.PIEffect.DegToRad(-anAngle);
            var anEmitterAngle;
            if (theFreeEmitter != null) {
                anEmitterAngle = theFreeEmitter.mImgAngle;
            } else {
                anEmitterAngle = GameFramework.resources.PIEffect.DegToRad(
                    -theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0
                    ].GetValueAt(this.mFrameNum)
                );
            }
            anAngle += anEmitterAngle;
            aParticleInstance.mOrigEmitterAng = anEmitterAngle;
            if (theParticleDef != null && theParticleDef.mAnimStartOnRandomFrame) {
                aParticleInstance.mAnimFrameRand = GameFramework.Utils.GetRand() & 0x7fff;
            } else {
                aParticleInstance.mAnimFrameRand = 0;
            }
            if (aParticleDef != null) {
                var aTexture = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                aParticleInstance.mImgIdx = aParticleInstance.mAnimFrameRand % aTexture.mNumCels;
                if (aParticleDef.mAnimSpeed == -1) {
                    aParticleInstance.mImgIdx = aParticleInstance.mAnimFrameRand % aTexture.mNumCels;
                }
            }
            aParticleInstance.mZoom = theParticleGroup.mWasEmitted
                ? anEmitter.mValues[GameFramework.resources.PIEmitter.Value.ZOOM | 0].GetValueAt(this.mFrameNum)
                : theEmitterInstance.mEmitterInstanceDef.mValues[
                      GameFramework.resources.PIEmitterInstanceDef.Value.ZOOM | 0
                  ].GetValueAt(this.mFrameNum);
            if (!theParticleGroup.mIsSuperEmitter) {
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.LIFE | 0] =
                    this.GetVariationScalar() *
                    aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.LIFE_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0] =
                    this.GetVariationScalar() *
                    aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.SIZE_X_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                if (theParticleDef == null || theParticleDef.mLockAspect) {
                    aParticleInstance.mVariationValues[
                        GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0
                    ] =
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0
                        ];
                } else {
                    aParticleInstance.mVariationValues[
                        GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0
                    ] =
                        this.GetVariationScalar() *
                        aParticleDef.mValues[
                            GameFramework.resources.PIParticleDef.Value.SIZE_Y_VARIATION | 0
                        ].GetValueAt(this.mFrameNum);
                }
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.VELOCITY | 0] =
                    this.GetVariationScalar() *
                    aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.VELOCITY_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0] =
                    this.GetVariationScalar() *
                    aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.WEIGHT_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.SPIN | 0] =
                    this.GetVariationScalar() *
                    aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.SPIN_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                aParticleInstance.mVariationValues[
                    GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0
                ] =
                    this.GetVariationScalar() *
                    aParticleDef.mValues[
                        GameFramework.resources.PIParticleDef.Value.MOTION_RAND_VARIATION | 0
                    ].GetValueAt(this.mFrameNum);
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0] =
                    this.GetVariationScalar() *
                    aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.BOUNCE_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                aParticleInstance.mSrcSizeXMult =
                    (theParticleGroup.mWasEmitted
                        ? anEmitter.mValues[GameFramework.resources.PIEmitter.Value.SIZE_X | 0].GetValueAt(
                              this.mFrameNum
                          )
                        : theEmitterInstance.mEmitterInstanceDef.mValues[
                              GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_X | 0
                          ].GetValueAt(this.mFrameNum)) *
                    (aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.SIZE_X | 0].GetValueAt(
                        this.mFrameNum
                    ) +
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0
                        ]);
                aParticleInstance.mSrcSizeYMult =
                    (theParticleGroup.mWasEmitted
                        ? anEmitter.mValues[GameFramework.resources.PIEmitter.Value.SIZE_Y | 0].GetValueAt(
                              this.mFrameNum
                          )
                        : theEmitterInstance.mEmitterInstanceDef.mValues[
                              GameFramework.resources.PIEmitterInstanceDef.Value.SIZE_Y | 0
                          ].GetValueAt(this.mFrameNum)) *
                    (aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.SIZE_Y | 0].GetValueAt(
                        this.mFrameNum
                    ) +
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0
                        ]);
                if (theParticleGroup.mWasEmitted) {
                    aParticleInstance.mSrcSizeXMult *=
                        (1.0 +
                            theFreeEmitter.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0
                            ]) *
                        anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_SIZE_X_OVER_LIFE | 0].GetValueAt(
                            anEmitterLifePct,
                            1.0
                        );
                    aParticleInstance.mSrcSizeYMult *=
                        (1.0 +
                            theFreeEmitter.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0
                            ]) *
                        anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_SIZE_Y_OVER_LIFE | 0].GetValueAt(
                            anEmitterLifePct,
                            1.0
                        );
                    aParticleInstance.mZoom *=
                        (1.0 +
                            theFreeEmitter.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.ZOOM | 0
                            ]) *
                        anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_ZOOM_OVER_LIFE | 0].GetValueAt(
                            anEmitterLifePct,
                            1.0
                        );
                }
            } else {
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.LIFE | 0] =
                    this.GetVariationScalar() *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_LIFE_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0] =
                    this.GetRandFloat() *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_SIZE_X_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                if (theParticleDef == null || theParticleDef.mLockAspect) {
                    aParticleInstance.mVariationValues[
                        GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0
                    ] =
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.SIZE_X | 0
                        ];
                } else {
                    aParticleInstance.mVariationValues[
                        GameFramework.resources.PIParticleInstance.Variation.SIZE_Y | 0
                    ] =
                        this.GetRandFloat() *
                        anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_SIZE_Y_VARIATION | 0].GetValueAt(
                            this.mFrameNum
                        );
                }
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.VELOCITY | 0] =
                    this.GetVariationScalar() *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_VELOCITY_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0] =
                    this.GetVariationScalar() *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_WEIGHT_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.SPIN | 0] =
                    this.GetVariationScalar() *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_SPIN_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                aParticleInstance.mVariationValues[
                    GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0
                ] =
                    this.GetVariationScalar() *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_MOTION_RAND_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0] =
                    this.GetVariationScalar() *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_BOUNCE_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
                aParticleInstance.mVariationValues[GameFramework.resources.PIParticleInstance.Variation.ZOOM | 0] =
                    this.GetVariationScalar() *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_ZOOM_VARIATION | 0].GetValueAt(
                        this.mFrameNum
                    );
            }
            GameFramework.resources.PIEffect.sPIGeomDataEx.mTravelAngle = anAngle;
            GameFramework.resources.PIEffect.sPIGeomDataEx.isMaskedOut = false;
            aParticleInstance.mGradientRand = this.GetRandFloatU();
            aParticleInstance.mTicks = 0;
            aParticleInstance.mThicknessHitVariation = this.GetRandFloat();
            aParticleInstance.mImgAngle = 0;
            if (theParticleGroup.mIsSuperEmitter) {
                aParticleInstance.mLife =
                    (anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_LIFE | 0].GetValueAt(this.mFrameNum) +
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.LIFE | 0
                        ]) *
                    5 *
                    theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.LIFE | 0
                    ].GetValueAt(this.mFrameNum);
            } else {
                aParticleInstance.mLife =
                    (theParticleGroup.mWasEmitted
                        ? anEmitter.mValues[GameFramework.resources.PIEmitter.Value.LIFE | 0].GetValueAt(this.mFrameNum)
                        : theEmitterInstance.mEmitterInstanceDef.mValues[
                              GameFramework.resources.PIEmitterInstanceDef.Value.LIFE | 0
                          ].GetValueAt(this.mFrameNum)) *
                    (aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.LIFE | 0].GetValueAt(
                        this.mFrameNum
                    ) +
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.LIFE | 0
                        ]);
            }
            if (aParticleInstance.mLife <= 0.00000001) {
                aParticleInstance.mLifePct = 1.0;
            }
            var aLifeTicks = aParticleInstance.mLife / (1.0 / anUpdateRate);
            aParticleInstance.mLifePctInc = 1.0 / aLifeTicks;
            aParticleInstance.mLifePctInt = 0;
            aParticleInstance.mLifePctIntInc = (0x7fffffff / aLifeTicks) | 0;
            aParticleInstance.mLifeValueDeltaIdx = 0;
            if (aParticleDef != null && aParticleDef.mSingleParticle) {
                aParticleInstance.mLifePctInt = 1;
                aParticleInstance.mLifePctIntInc = 0;
                aParticleInstance.mLifePctInc = 0;
            }
            var aPos = null;
            if (theParticleGroup.mWasEmitted) {
                if (theFreeEmitter.mLastEmitterPos == null) {
                    theFreeEmitter.mLastEmitterPos = new GameFramework.geom.TPoint();
                }
                aParticleInstance.mEmittedPos = theFreeEmitter.mLastEmitterPos.add(theFreeEmitter.mPos);
                aParticleInstance.mLastEmitterPos = aParticleInstance.mEmittedPos;
                aPos = new GameFramework.geom.TPoint();
            } else {
                aParticleInstance.mEmittedPos = this.GetEmitterPos(theEmitterInstance, true);
                aParticleInstance.mLastEmitterPos = aParticleInstance.mEmittedPos;
                var isMaskedOut = false;
                if (canUseGeom) {
                    aPos = this.GetGeomPos(
                        theEmitterInstance,
                        aParticleInstance,
                        GameFramework.resources.PIEffect.sPIGeomDataEx
                    ).subtract(aParticleInstance.mEmittedPos);
                }
                if (isMaskedOut) {
                    continue;
                }
            }
            var aVelScale;
            if (theParticleGroup.mIsSuperEmitter) {
                aVelScale =
                    theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.VELOCITY | 0
                    ].GetValueAt(this.mFrameNum) *
                    (anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_VELOCITY | 0].GetValueAt(
                        this.mFrameNum
                    ) +
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.VELOCITY | 0
                        ]) *
                    160.0;
            } else {
                aVelScale =
                    (theParticleGroup.mWasEmitted
                        ? anEmitter.mValues[GameFramework.resources.PIEmitter.Value.VELOCITY | 0].GetValueAt(
                              this.mFrameNum
                          )
                        : theEmitterInstance.mEmitterInstanceDef.mValues[
                              GameFramework.resources.PIEmitterInstanceDef.Value.VELOCITY | 0
                          ].GetValueAt(this.mFrameNum)) *
                    (aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.VELOCITY | 0].GetValueAt(
                        this.mFrameNum
                    ) +
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.VELOCITY | 0
                        ]);
            }
            aParticleInstance.mPos = new GameFramework.geom.TPoint(0, 0);
            aParticleInstance.mVel = new GameFramework.geom.TPoint(
                Math.cos(GameFramework.resources.PIEffect.sPIGeomDataEx.mTravelAngle) * aVelScale,
                Math.sin(GameFramework.resources.PIEffect.sPIGeomDataEx.mTravelAngle) * aVelScale
            );
            if (!theParticleGroup.mIsSuperEmitter) {
                if (theParticleDef.mAngleAlignToMotion) {
                    if (aParticleInstance.mVel.x == 0.0 && aParticleInstance.mVel.y == 0.0) {
                        GameFramework.resources.PIEffect.sPIGeomDataEx.mTravelAngle = 0;
                        aParticleInstance.mImgAngle = 0;
                        if (
                            theParticleDef.mSingleParticle &&
                            theParticleDef.mAngleKeepAlignedToMotion &&
                            !theParticleDef.mAttachToEmitter
                        ) {
                            aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad(
                                theEmitterInstance.mEmitterInstanceDef.mValues[
                                    GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0
                                ].GetValueAt(this.mFrameNum)
                            );
                        }
                    } else {
                        aParticleInstance.mImgAngle = -GameFramework.resources.PIEffect.sPIGeomDataEx.mTravelAngle;
                    }
                    aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad(
                        theParticleDef.mAngleAlignOffset
                    );
                } else if (theParticleDef.mAngleRandomAlign) {
                    aParticleInstance.mImgAngle = GameFramework.resources.PIEffect.DegToRad(
                        -(theParticleDef.mAngleOffset + (this.GetRandFloat() * theParticleDef.mAngleRange) / 2.0)
                    );
                } else {
                    aParticleInstance.mImgAngle = GameFramework.resources.PIEffect.DegToRad(theParticleDef.mAngleValue);
                }
            }
            aParticleInstance.mColorMask = 0xffffffff;
            aParticleInstance.mColorOr = 0;
            if (aParticleDef != null) {
                if (aParticleDef.mRandomGradientColor) {
                    aParticleInstance.mColorMask &= 0xff000000;
                    if (aParticleDef.mUseKeyColorsOnly) {
                        var aKeyframe =
                            Math.max(
                                (aParticleInstance.mGradientRand *
                                    aParticleDef.mColor.mInterpolatorPointVector.length) |
                                    0,
                                aParticleDef.mColor.mInterpolatorPointVector.length - 1
                            ) | 0;
                        aParticleInstance.mColorOr |= aParticleDef.mColor.GetKeyframeNum(aKeyframe) & 0xffffff;
                    } else {
                        var aColorPosUsed = aParticleInstance.mGradientRand;
                        aParticleInstance.mColorOr |= aParticleDef.mColor.GetValueAt(aColorPosUsed) & 0xffffff;
                    }
                } else if (aParticleDef.mUseNextColorKey) {
                    aParticleInstance.mColorMask &= 0xff000000;
                    var aKeyframe_2 =
                        ((aParticleInstance.mNum / aParticleDef.mNumberOfEachColor) | 0) %
                        (aParticleDef.mColor.mInterpolatorPointVector.length | 0);
                    aParticleInstance.mColorOr |= aParticleDef.mColor.GetKeyframeNum(aKeyframe_2) & 0xffffff;
                }
            }
            aParticleInstance.mPos = new GameFramework.geom.TPoint();
            aParticleInstance.mOrigPos = aPos;
            var aTransform = new GameFramework.geom.Matrix();
            aTransform.rotate(
                -GameFramework.resources.PIEffect.DegToRad(
                    theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0
                    ].GetValueAt(this.mFrameNum)
                )
            );
            var aTransPoint = aTransform.transformPoint(aPos);
            aParticleInstance.mEmittedPos.x += aTransPoint.x;
            aParticleInstance.mEmittedPos.y += aTransPoint.y;
            if (theEmitter.mOldestInFront) {
                if (theParticleGroup.mHead != null) {
                    theParticleGroup.mHead.mPrev = aParticleInstance;
                }
                aParticleInstance.mNext = theParticleGroup.mHead;
                if (theParticleGroup.mTail == null) {
                    theParticleGroup.mTail = aParticleInstance;
                }
                theParticleGroup.mHead = aParticleInstance;
            } else {
                if (theParticleGroup.mTail != null) {
                    theParticleGroup.mTail.mNext = aParticleInstance;
                }
                aParticleInstance.mPrev = theParticleGroup.mTail;
                if (theParticleGroup.mHead == null) {
                    theParticleGroup.mHead = aParticleInstance;
                }
                theParticleGroup.mTail = aParticleInstance;
            }
            theParticleGroup.mCount++;
        }
    },
    FreeParticle: function GameFramework_resources_PIEffect$FreeParticle(
        theEffect,
        theParticleInstance,
        theParticleGroup
    ) {
        if (theParticleInstance.mPrev != null) {
            theParticleInstance.mPrev.mNext = theParticleInstance.mNext;
        }
        if (theParticleInstance.mNext != null) {
            theParticleInstance.mNext.mPrev = theParticleInstance.mPrev;
        }
        if (theParticleGroup.mHead == theParticleInstance) {
            theParticleGroup.mHead = theParticleInstance.mNext;
        }
        if (theParticleGroup.mTail == theParticleInstance) {
            theParticleGroup.mTail = theParticleInstance.mPrev;
        }
        theParticleGroup.mCount--;
        theParticleInstance.Dispose();
    },
    UpdateParticleGroupSuperEmitter: function GameFramework_resources_PIEffect$UpdateParticleGroupSuperEmitter(
        theLayer,
        theEmitterInstance,
        theParticleGroup
    ) {
        var anUpdateRate = 1000.0 / this.mFrameTime / this.mAnimSpeed;
        var aParticleInstance = theParticleGroup.mHead;
        var aLayerDef = theLayer.mLayerDef;
        var anEmitterInstanceDef = theEmitterInstance.mEmitterInstanceDef;
        while (aParticleInstance != null) {
            var aNext = aParticleInstance.mNext;
            var anEmitter = aParticleInstance.mEmitterSrc;
            var aParticleDef = aParticleInstance.mParticleDef;
            var anEmitterLifePct = 0;
            if (aParticleInstance.mParentFreeEmitter != null) {
                anEmitterLifePct = aParticleInstance.mParentFreeEmitter.mLifePct;
            }
            var isNew = aParticleInstance.mTicks == 0.0;
            aParticleInstance.mTicks += 1.0 / anUpdateRate;
            var aLifePct;
            if (aParticleDef != null && aParticleDef.mSingleParticle) {
                var aNextToggleTime = theEmitterInstance.mEmitterInstanceDef.mValues[
                    GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0
                ].GetNextKeyframeTime(this.mFrameNum);
                var aNextKeyIdx = theEmitterInstance.mEmitterInstanceDef.mValues[
                    GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0
                ].GetNextKeyframeIdx(this.mFrameNum);
                if (aNextToggleTime >= this.mFrameNum && aNextKeyIdx == 1) {
                    aLifePct = Math.min(
                        1.0,
                        (this.mFrameNum + anEmitterInstanceDef.mFramesToPreload) / Math.max(1, aNextToggleTime)
                    );
                } else {
                    aLifePct = 0.02;
                }
            } else {
                aLifePct = aParticleInstance.mTicks / aParticleInstance.mLife;
            }
            aParticleInstance.mLifePct = aLifePct;
            if (
                aParticleInstance.mLifePct >= 0.9999999 ||
                aParticleInstance.mLife <= 0.00000001 ||
                (!theEmitterInstance.mWasActive && !anEmitterInstanceDef.mIsSuperEmitter)
            ) {
                if (theParticleGroup.mIsSuperEmitter && aParticleInstance.mEmitter.mParticleGroup.mHead != null) {
                    aParticleInstance = aNext;
                    continue;
                }
                if (
                    !theParticleGroup.mIsSuperEmitter &&
                    aParticleDef.mSingleParticle &&
                    theEmitterInstance.mWasActive
                ) {
                } else {
                    aParticleInstance.Dispose();
                    if (aParticleInstance.mPrev != null) {
                        aParticleInstance.mPrev.mNext = aParticleInstance.mNext;
                    }
                    if (aParticleInstance.mNext != null) {
                        aParticleInstance.mNext.mPrev = aParticleInstance.mPrev;
                    }
                    if (theParticleGroup.mHead == aParticleInstance) {
                        theParticleGroup.mHead = aParticleInstance.mNext;
                    }
                    if (theParticleGroup.mTail == aParticleInstance) {
                        theParticleGroup.mTail = aParticleInstance.mPrev;
                    }
                    theParticleGroup.mCount--;
                    aParticleInstance = aNext;
                    continue;
                }
            }
            if (aParticleDef != null) {
                var aTexture = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                if (aParticleDef.mAnimSpeed == -1) {
                    aParticleInstance.mImgIdx = aParticleInstance.mAnimFrameRand % aTexture.mNumCels;
                } else {
                    aParticleInstance.mImgIdx =
                        ((((aParticleInstance.mTicks * this.mFramerate) / (aParticleDef.mAnimSpeed + 1)) | 0) +
                            aParticleInstance.mAnimFrameRand) %
                        aTexture.mNumCels;
                }
            }
            if (theParticleGroup.mIsSuperEmitter || !aParticleDef.mSingleParticle) {
                if (this.mIsNewFrame) {
                    var aRand1 = this.GetRandFloat() * this.GetRandFloat();
                    var aRand2 = this.GetRandFloat() * this.GetRandFloat();
                    var aMotionRand;
                    if (theParticleGroup.mIsSuperEmitter) {
                        aMotionRand =
                            Math.max(
                                0.0,
                                theEmitterInstance.mEmitterInstanceDef.mValues[
                                    GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0
                                ].GetValueAt(this.mFrameNum) *
                                    anEmitter.mValues[
                                        GameFramework.resources.PIEmitter.Value.F_MOTION_RAND_OVER_LIFE | 0
                                    ].GetValueAt(aLifePct, 1.0) *
                                    (anEmitter.mValues[
                                        GameFramework.resources.PIEmitter.Value.F_MOTION_RAND | 0
                                    ].GetValueAt(this.mFrameNum) +
                                        aParticleInstance.mVariationValues[
                                            GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0
                                        ])
                            ) * 30.0;
                    } else {
                        aMotionRand = Math.max(
                            0.0,
                            (theParticleGroup.mWasEmitted
                                ? anEmitter.mValues[GameFramework.resources.PIEmitter.Value.MOTION_RAND | 0].GetValueAt(
                                      this.mFrameNum
                                  )
                                : theEmitterInstance.mEmitterInstanceDef.mValues[
                                      GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0
                                  ].GetValueAt(this.mFrameNum)) *
                                aParticleDef.mValues[
                                    GameFramework.resources.PIParticleDef.Value.MOTION_RAND | 0
                                ].GetValueAt(aLifePct) *
                                (aParticleDef.mValues[
                                    GameFramework.resources.PIParticleDef.Value.MOTION_RAND | 0
                                ].GetValueAt(this.mFrameNum) +
                                    aParticleInstance.mVariationValues[
                                        GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0
                                    ])
                        );
                    }
                    aParticleInstance.mVel.x += aRand1 * aMotionRand;
                    aParticleInstance.mVel.y += aRand2 * aMotionRand;
                }
                var aWeight;
                if (theParticleGroup.mIsSuperEmitter) {
                    aWeight =
                        ((theEmitterInstance.mEmitterInstanceDef.mValues[
                            GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0
                        ].GetValueAt(this.mFrameNum) *
                            (anEmitter.mValues[
                                GameFramework.resources.PIEmitter.Value.F_WEIGHT_OVER_LIFE | 0
                            ].GetValueAt(aLifePct, 1.0) -
                                1.0) *
                            (anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_WEIGHT | 0].GetValueAt(
                                this.mFrameNum
                            ) +
                                aParticleInstance.mVariationValues[
                                    GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0
                                ])) /
                            2.0) *
                        100.0;
                } else {
                    aWeight =
                        theEmitterInstance.mEmitterInstanceDef.mValues[
                            GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0
                        ].GetValueAt(this.mFrameNum) *
                        (aParticleDef.mValues[
                            GameFramework.resources.PIParticleDef.Value.WEIGHT_OVER_LIFE | 0
                        ].GetValueAt(aLifePct) -
                            1.0) *
                        (aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.WEIGHT | 0].GetValueAt(
                            this.mFrameNum
                        ) +
                            aParticleInstance.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0
                            ]) *
                        100.0;
                }
                aWeight *= 1.0 + (this.mFramerate - 100.0) * 0.0005;
                aParticleInstance.mVel.y += aWeight / anUpdateRate;
                var aVelScale;
                if (theParticleGroup.mIsSuperEmitter) {
                    aVelScale = anEmitter.mValues[
                        GameFramework.resources.PIEmitter.Value.F_VELOCITY_OVER_LIFE | 0
                    ].GetValueAt(aLifePct, 1.0);
                } else {
                    aVelScale =
                        aParticleDef.mValues[
                            GameFramework.resources.PIParticleDef.Value.VELOCITY_OVER_LIFE | 0
                        ].GetValueAt(aLifePct);
                }
                var aCurVel = new GameFramework.geom.TPoint(
                    (aParticleInstance.mVel.x * aVelScale) / anUpdateRate,
                    (aParticleInstance.mVel.y * aVelScale) / anUpdateRate
                );
                var aCurPhysPoint = null;
                if (!isNew && aLayerDef.mDeflectorVector.length > 0) {
                    var aPrevPhysPoint = aParticleInstance.mTransform.transformPoint(
                        new GameFramework.geom.TPoint(0.0, 0.0)
                    );
                    var aPrevPos = aParticleInstance.mPos;
                    aParticleInstance.mPos.x += aCurVel.x;
                    aParticleInstance.mPos.y += aCurVel.y;
                    this.CalcParticleTransform(
                        theLayer,
                        theEmitterInstance,
                        anEmitter,
                        aParticleDef,
                        theParticleGroup,
                        aParticleInstance
                    );
                    aCurPhysPoint = aParticleInstance.mTransform.transformPoint(
                        new GameFramework.geom.TPoint(0.0, 0.0)
                    );
                    for (
                        var aDeflectorIdx = 0;
                        aDeflectorIdx < (aLayerDef.mDeflectorVector.length | 0);
                        aDeflectorIdx++
                    ) {
                        var aDeflector = aLayerDef.mDeflectorVector[aDeflectorIdx];
                        if (aDeflector.mActive.GetLastKeyframe(this.mFrameNum) < 0.99) {
                            continue;
                        }
                        for (var aPtIdx = 1; aPtIdx < (aDeflector.mCurPoints.length | 0); aPtIdx++) {
                            var aPt1 = aDeflector.mCurPoints[aPtIdx - 1].subtract(
                                new GameFramework.geom.TPoint(this.mDrawTransform.tx, this.mDrawTransform.ty)
                            );
                            var aPt2 = aDeflector.mCurPoints[aPtIdx].subtract(
                                new GameFramework.geom.TPoint(this.mDrawTransform.tx, this.mDrawTransform.ty)
                            );
                            var aLineDir = new GameFramework.geom.TPoint(aPt2.x - aPt1.x, aPt2.y - aPt1.y);
                            var aLineNormal = aLineDir.clone();
                            aLineNormal.normalize(1.0);
                            var aTemp = aLineNormal.x;
                            aLineNormal.x = -aLineNormal.y;
                            aLineNormal.y = aTemp;
                            var aLineTranslate = new GameFramework.geom.TPoint(aLineNormal.x, aLineNormal.y);
                            aLineTranslate.x =
                                aLineTranslate.x * aDeflector.mThickness * aParticleInstance.mThicknessHitVariation;
                            aLineTranslate.y =
                                aLineTranslate.y * aDeflector.mThickness * aParticleInstance.mThicknessHitVariation;
                            var aLineSegmentResult = GameFramework.resources.PIEffect.LineSegmentIntersects(
                                aPrevPhysPoint,
                                aCurPhysPoint,
                                aPt1.add(aLineTranslate),
                                aPt2.add(aLineTranslate)
                            );
                            if (aLineSegmentResult != null) {
                                var aCollPoint = new GameFramework.geom.TPoint(
                                    aLineSegmentResult[1],
                                    aLineSegmentResult[2]
                                );
                                if (this.GetRandFloatU() > aDeflector.mHits) {
                                    continue;
                                }
                                var aBounce = aDeflector.mBounce;
                                if (theParticleGroup.mIsSuperEmitter) {
                                    aBounce *=
                                        (theParticleGroup.mWasEmitted
                                            ? anEmitter.mValues[
                                                  GameFramework.resources.PIEmitter.Value.BOUNCE | 0
                                              ].GetValueAt(this.mFrameNum)
                                            : theEmitterInstance.mEmitterInstanceDef.mValues[
                                                  GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0
                                              ].GetValueAt(this.mFrameNum)) *
                                        anEmitter.mValues[
                                            GameFramework.resources.PIEmitter.Value.F_BOUNCE_OVER_LIFE | 0
                                        ].GetValueAt(aLifePct, 1.0) *
                                        (anEmitter.mValues[
                                            GameFramework.resources.PIEmitter.Value.F_BOUNCE | 0
                                        ].GetValueAt(this.mFrameNum) +
                                            aParticleInstance.mVariationValues[
                                                GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0
                                            ]);
                                } else {
                                    aBounce *=
                                        (theParticleGroup.mWasEmitted
                                            ? anEmitter.mValues[
                                                  GameFramework.resources.PIEmitter.Value.BOUNCE | 0
                                              ].GetValueAt(this.mFrameNum)
                                            : theEmitterInstance.mEmitterInstanceDef.mValues[
                                                  GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0
                                              ].GetValueAt(this.mFrameNum)) *
                                        aParticleDef.mValues[
                                            GameFramework.resources.PIParticleDef.Value.BOUNCE_OVER_LIFE | 0
                                        ].GetValueAt(aLifePct) *
                                        (aParticleDef.mValues[
                                            GameFramework.resources.PIParticleDef.Value.BOUNCE | 0
                                        ].GetValueAt(this.mFrameNum) +
                                            aParticleInstance.mVariationValues[
                                                GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0
                                            ]);
                                }
                                var aCurVelVec = new GameFramework.geom.TPoint(aCurVel.x, aCurVel.y);
                                var aDot = aCurVelVec.x * aLineNormal.x + aCurVelVec.y * aLineNormal.y;
                                var aNewVel = new GameFramework.geom.TPoint(
                                    aCurVelVec.x - aLineNormal.x * 2 * aDot,
                                    aCurVelVec.y - aLineNormal.y * 2 * aDot
                                );
                                var aPctBounce = Math.min(1.0, Math.abs(aNewVel.y / aNewVel.x));
                                aNewVel.y *= 1.0 - aPctBounce + aPctBounce * Math.pow(aBounce, 0.5);
                                aParticleInstance.mVel.x = aNewVel.x * 100.0;
                                aParticleInstance.mVel.y = aNewVel.y * 100.0;
                                if (aBounce > 0.001) {
                                    aParticleInstance.mPos = aPrevPos;
                                }
                                this.CalcParticleTransform(
                                    theLayer,
                                    theEmitterInstance,
                                    anEmitter,
                                    aParticleDef,
                                    theParticleGroup,
                                    aParticleInstance
                                );
                                aCurPhysPoint = aParticleInstance.mTransform.transformPoint(
                                    new GameFramework.geom.TPoint(0.0, 0.0)
                                );
                            }
                        }
                    }
                } else {
                    aParticleInstance.mPos.x += aCurVel.x;
                    aParticleInstance.mPos.y += aCurVel.y;
                    if (aLayerDef.mForceVector.length > 0) {
                        this.CalcParticleTransform(
                            theLayer,
                            theEmitterInstance,
                            anEmitter,
                            aParticleDef,
                            theParticleGroup,
                            aParticleInstance
                        );
                        aCurPhysPoint = aParticleInstance.mTransform.transformPoint(
                            new GameFramework.geom.TPoint(0.0, 0.0)
                        );
                    }
                }
                for (var aForceIdx = 0; aForceIdx < (aLayerDef.mForceVector.length | 0); aForceIdx++) {
                    var aForce = aLayerDef.mForceVector[aForceIdx];
                    if (aForce.mActive.GetLastKeyframe(this.mFrameNum) < 0.99) {
                        continue;
                    }
                    var inside = false;
                    var i;
                    var j;
                    for (i = 0, j = 4 - 1; i < 4; j = i++) {
                        if (
                            ((aForce.mCurPoints[i].y <= aCurPhysPoint.y && aCurPhysPoint.y < aForce.mCurPoints[j].y) ||
                                (aForce.mCurPoints[j].y <= aCurPhysPoint.y &&
                                    aCurPhysPoint.y < aForce.mCurPoints[i].y)) &&
                            aCurPhysPoint.x <
                                ((aForce.mCurPoints[j].x - aForce.mCurPoints[i].x) *
                                    (aCurPhysPoint.y - aForce.mCurPoints[i].y)) /
                                    (aForce.mCurPoints[j].y - aForce.mCurPoints[i].y) +
                                    aForce.mCurPoints[i].x
                        ) {
                            inside = !inside;
                        }
                    }
                    if (inside) {
                        var anAngle =
                            GameFramework.resources.PIEffect.DegToRad(-aForce.mDirection.GetValueAt(this.mFrameNum)) +
                            GameFramework.resources.PIEffect.DegToRad(-aForce.mAngle.GetValueAt(this.mFrameNum));
                        var aFactor = (0.085 * this.mFramerate) / 100.0;
                        aFactor *= 1.0 + (this.mFramerate - 100.0) * 0.004;
                        var aStrength = aForce.mStrength.GetValueAt(this.mFrameNum) * aFactor;
                        aParticleInstance.mVel.x += Math.cos(anAngle) * aStrength * 100.0;
                        aParticleInstance.mVel.y += Math.sin(anAngle) * aStrength * 100.0;
                    }
                }
                if (
                    !theParticleGroup.mIsSuperEmitter &&
                    aParticleDef.mAngleAlignToMotion &&
                    aParticleDef.mAngleKeepAlignedToMotion
                ) {
                    aParticleInstance.mImgAngle =
                        Math.atan2(aCurVel.y, aCurVel.x) +
                        GameFramework.resources.PIEffect.DegToRad(aParticleDef.mAngleAlignOffset);
                }
            } else if (aParticleDef.mSingleParticle) {
                var canUseGeom = false;
                if (
                    anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.LINE ||
                    anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE
                ) {
                    canUseGeom = anEmitterInstanceDef.mEmitAtPointsNum != 0;
                } else if (
                    anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.AREA
                ) {
                    canUseGeom = anEmitterInstanceDef.mEmitAtPointsNum * anEmitterInstanceDef.mEmitAtPointsNum2 != 0;
                }
                if (canUseGeom) {
                    var aPos = this.GetGeomPos(theEmitterInstance, aParticleInstance);
                    aParticleInstance.mEmittedPos = this.GetEmitterPos(theEmitterInstance, true);
                    aParticleInstance.mLastEmitterPos = aParticleInstance.mEmittedPos;
                    aParticleInstance.mOrigPos = aPos.subtract(aParticleInstance.mEmittedPos);
                    var aTransform = new GameFramework.geom.Matrix();
                    aTransform.rotate(
                        GameFramework.resources.PIEffect.DegToRad(
                            theEmitterInstance.mEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0
                            ].GetValueAt(this.mFrameNum)
                        )
                    );
                    var anAddPoint = aTransform.transformPoint(aPos);
                    aParticleInstance.mEmittedPos.x += anAddPoint.x;
                    aParticleInstance.mEmittedPos.y += anAddPoint.y;
                }
                if (aParticleDef.mAngleKeepAlignedToMotion && !aParticleDef.mAttachToEmitter) {
                    var aCurVel_2 = anEmitterInstanceDef.mPosition.GetVelocityAt(this.mFrameNum);
                    if (aCurVel_2.x != 0 || aCurVel_2.y != 0) {
                        aParticleInstance.mImgAngle = Math.atan2(aCurVel_2.y, aCurVel_2.x);
                    } else {
                        aParticleInstance.mImgAngle = 0;
                    }
                    aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad(
                        aParticleDef.mAngleAlignOffset
                    );
                }
            }
            if (aParticleDef != null) {
                var wantColor =
                    (!aParticleInstance.mHasDrawn && aParticleDef.mGetColorFromLayer) ||
                    aParticleDef.mUpdateColorFromLayer;
                var wantTransparency =
                    (!aParticleInstance.mHasDrawn && aParticleDef.mGetTransparencyFromLayer) ||
                    aParticleDef.mUpdateTransparencyFromLayer;
                if (wantColor || wantTransparency) {
                    var aDrawPoint = aParticleInstance.mTransform.transformPoint(new GameFramework.geom.TPoint(0, 0));
                    var aCheckX = (aDrawPoint.x + theLayer.mBkgImgDrawOfs.x) | 0;
                    var aCheckY = (aDrawPoint.y + theLayer.mBkgImgDrawOfs.y) | 0;
                    var aColor = 0;
                    if (
                        theLayer.mBkgImage != null &&
                        aCheckX >= 0 &&
                        aCheckY >= 0 &&
                        aCheckX < theLayer.mBkgImage.mWidth &&
                        aCheckY < theLayer.mBkgImage.mHeight
                    ) {
                    } else {
                        aColor = 0;
                    }
                    if (wantColor) {
                        aParticleInstance.mBkgColor = (aParticleInstance.mBkgColor & 0xff000000) | (aColor & 0xffffff);
                    }
                    if (wantTransparency) {
                        aParticleInstance.mBkgColor = (aParticleInstance.mBkgColor & 0xffffff) | (aColor & 0xff000000);
                    }
                }
            }
            if (theParticleGroup.mIsSuperEmitter) {
                aParticleInstance.mImgAngle +=
                    (GameFramework.resources.PIEffect.DegToRad(
                        -(
                            theEmitterInstance.mEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0
                            ].GetValueAt(this.mFrameNum) *
                            (anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_SPIN_OVER_LIFE | 0].GetValueAt(
                                aLifePct,
                                1.0
                            ) -
                                1.0) *
                            (anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_SPIN | 0].GetValueAt(
                                this.mFrameNum
                            ) +
                                aParticleInstance.mVariationValues[
                                    GameFramework.resources.PIParticleInstance.Variation.SPIN | 0
                                ])
                        )
                    ) /
                        anUpdateRate) *
                    160.0;
            } else if (!aParticleDef.mAngleKeepAlignedToMotion) {
                aParticleInstance.mImgAngle +=
                    GameFramework.resources.PIEffect.DegToRad(
                        -(
                            (theParticleGroup.mWasEmitted
                                ? anEmitter.mValues[GameFramework.resources.PIEmitter.Value.SPIN | 0].GetValueAt(
                                      this.mFrameNum
                                  )
                                : theEmitterInstance.mEmitterInstanceDef.mValues[
                                      GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0
                                  ].GetValueAt(this.mFrameNum)) *
                            (aParticleDef.mValues[
                                GameFramework.resources.PIParticleDef.Value.SPIN_OVER_LIFE | 0
                            ].GetValueAt(aLifePct) -
                                1.0) *
                            (aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.SPIN | 0].GetValueAt(
                                this.mFrameNum
                            ) +
                                aParticleInstance.mVariationValues[
                                    GameFramework.resources.PIParticleInstance.Variation.SPIN | 0
                                ])
                        )
                    ) / anUpdateRate;
            }
            aParticleInstance = aNext;
        }
    },
    UpdateParticleGroupWithSingleParticles:
        function GameFramework_resources_PIEffect$UpdateParticleGroupWithSingleParticles(
            theLayer,
            theEmitterInstance,
            theParticleGroup
        ) {
            var anUpdateRate = 1000.0 / this.mFrameTime / this.mAnimSpeed;
            var aParticleInstance = theParticleGroup.mHead;
            var aLayerDef = theLayer.mLayerDef;
            var anEmitterInstanceDef = theEmitterInstance.mEmitterInstanceDef;
            while (aParticleInstance != null) {
                var aNext = aParticleInstance.mNext;
                var anEmitter = aParticleInstance.mEmitterSrc;
                var aParticleDef = aParticleInstance.mParticleDef;
                var anEmitterLifePct = 0;
                if (aParticleInstance.mParentFreeEmitter != null) {
                    anEmitterLifePct = aParticleInstance.mParentFreeEmitter.mLifePct;
                }
                var isNew = aParticleInstance.mTicks == 0.0;
                aParticleInstance.mTicks += 1.0 / anUpdateRate;
                var aLifePct;
                if (aParticleDef != null && aParticleDef.mSingleParticle) {
                    var aNextToggleTime = theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0
                    ].GetNextKeyframeTime(this.mFrameNum);
                    var aNextKeyIdx = theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0
                    ].GetNextKeyframeIdx(this.mFrameNum);
                    if (aNextToggleTime >= this.mFrameNum && aNextKeyIdx == 1) {
                        aLifePct = Math.min(
                            1.0,
                            (this.mFrameNum + anEmitterInstanceDef.mFramesToPreload) / Math.max(1, aNextToggleTime)
                        );
                    } else {
                        aLifePct = 0.02;
                    }
                } else {
                    aLifePct = aParticleInstance.mTicks / aParticleInstance.mLife;
                }
                aParticleInstance.mLifePct = aLifePct;
                aParticleInstance.mLifePctInt += aParticleInstance.mLifePctIntInc;
                if ((aParticleInstance.mLifePctInt & 0x80000000) != 0) {
                    this.FreeParticle(this, aParticleInstance, theParticleGroup);
                    aParticleInstance = aNext;
                    continue;
                }
                var anIdx =
                    (aParticleInstance.mLifePctInt /
                        ((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0)) |
                    0;
                var aLifeValueSample = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx];
                if (aParticleDef != null) {
                    var aTexture = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                    if (aParticleDef.mAnimSpeed == -1) {
                        aParticleInstance.mImgIdx = aParticleInstance.mAnimFrameRand % aTexture.mNumCels;
                    } else {
                        aParticleInstance.mImgIdx =
                            ((((aParticleInstance.mTicks * this.mFramerate) / (aParticleDef.mAnimSpeed + 1)) | 0) +
                                aParticleInstance.mAnimFrameRand) %
                            aTexture.mNumCels;
                    }
                }
                if (theParticleGroup.mIsSuperEmitter || !aParticleDef.mSingleParticle) {
                    if (this.mIsNewFrame) {
                        var aRand1 = this.GetRandFloat() * this.GetRandFloat();
                        var aRand2 = this.GetRandFloat() * this.GetRandFloat();
                        var aMotionRand;
                        if (theParticleGroup.mIsSuperEmitter) {
                            aMotionRand =
                                Math.max(
                                    0.0,
                                    theEmitterInstance.mEmitterInstanceDef.mValues[
                                        GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0
                                    ].GetValueAt(this.mFrameNum) *
                                        anEmitter.mValues[
                                            GameFramework.resources.PIEmitter.Value.F_MOTION_RAND_OVER_LIFE | 0
                                        ].GetValueAt(aLifePct, 1.0) *
                                        (anEmitter.mValues[
                                            GameFramework.resources.PIEmitter.Value.F_MOTION_RAND | 0
                                        ].GetValueAt(this.mFrameNum) +
                                            aParticleInstance.mVariationValues[
                                                GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0
                                            ])
                                ) * 30.0;
                        } else {
                            aMotionRand = Math.max(
                                0.0,
                                (theParticleGroup.mWasEmitted
                                    ? anEmitter.mValues[
                                          GameFramework.resources.PIEmitter.Value.MOTION_RAND | 0
                                      ].GetValueAt(this.mFrameNum)
                                    : theEmitterInstance.mEmitterInstanceDef.mValues[
                                          GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0
                                      ].GetValueAt(this.mFrameNum)) *
                                    aParticleDef.mValues[
                                        GameFramework.resources.PIParticleDef.Value.MOTION_RAND_OVER_LIFE | 0
                                    ].GetValueAt(aLifePct) *
                                    (aParticleDef.mValues[
                                        GameFramework.resources.PIParticleDef.Value.MOTION_RAND | 0
                                    ].GetValueAt(this.mFrameNum) +
                                        aParticleInstance.mVariationValues[
                                            GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0
                                        ])
                            );
                        }
                        aParticleInstance.mVel.x += aRand1 * aMotionRand;
                        aParticleInstance.mVel.y += aRand2 * aMotionRand;
                    }
                    var aWeight;
                    if (theParticleGroup.mIsSuperEmitter) {
                        aWeight =
                            ((theEmitterInstance.mEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0
                            ].GetValueAt(this.mFrameNum) *
                                (anEmitter.mValues[
                                    GameFramework.resources.PIEmitter.Value.F_WEIGHT_OVER_LIFE | 0
                                ].GetValueAt(aLifePct, 1.0) -
                                    1.0) *
                                (anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_WEIGHT | 0].GetValueAt(
                                    this.mFrameNum
                                ) +
                                    aParticleInstance.mVariationValues[
                                        GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0
                                    ])) /
                                2.0) *
                            100.0;
                    } else {
                        aWeight =
                            theEmitterInstance.mEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0
                            ].GetValueAt(this.mFrameNum) *
                            (aParticleDef.mValues[
                                GameFramework.resources.PIParticleDef.Value.WEIGHT_OVER_LIFE | 0
                            ].GetValueAt(aLifePct) -
                                1.0) *
                            (aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.WEIGHT | 0].GetValueAt(
                                this.mFrameNum
                            ) +
                                aParticleInstance.mVariationValues[
                                    GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0
                                ]) *
                            100.0;
                    }
                    aWeight *= 1.0 + (this.mFramerate - 100.0) * 0.0005;
                    aParticleInstance.mVel.y += aWeight / anUpdateRate;
                    var aVelScale;
                    if (theParticleGroup.mIsSuperEmitter) {
                        aVelScale = anEmitter.mValues[
                            GameFramework.resources.PIEmitter.Value.F_VELOCITY_OVER_LIFE | 0
                        ].GetValueAt(aLifePct, 1.0);
                    } else {
                        aVelScale =
                            aParticleDef.mValues[
                                GameFramework.resources.PIParticleDef.Value.VELOCITY_OVER_LIFE | 0
                            ].GetValueAt(aLifePct);
                    }
                    var aCurVel = new GameFramework.geom.TPoint(
                        (aParticleInstance.mVel.x * aVelScale) / anUpdateRate,
                        (aParticleInstance.mVel.y * aVelScale) / anUpdateRate
                    );
                    var aCurPhysPoint = null;
                    if (!isNew && aLayerDef.mDeflectorVector.length > 0) {
                        var aPrevPhysPoint = aParticleInstance.mTransform.transformPoint(
                            new GameFramework.geom.TPoint(0.0, 0.0)
                        );
                        var aPrevPos = aParticleInstance.mPos;
                        aParticleInstance.mPos.x += aCurVel.x;
                        aParticleInstance.mPos.y += aCurVel.y;
                        this.CalcParticleTransform(
                            theLayer,
                            theEmitterInstance,
                            anEmitter,
                            aParticleDef,
                            theParticleGroup,
                            aParticleInstance
                        );
                        aCurPhysPoint = aParticleInstance.mTransform.transformPoint(
                            new GameFramework.geom.TPoint(0.0, 0.0)
                        );
                        for (
                            var aDeflectorIdx = 0;
                            aDeflectorIdx < (aLayerDef.mDeflectorVector.length | 0);
                            aDeflectorIdx++
                        ) {
                            var aDeflector = aLayerDef.mDeflectorVector[aDeflectorIdx];
                            if (aDeflector.mActive.GetLastKeyframe(this.mFrameNum) < 0.99) {
                                continue;
                            }
                            for (var aPtIdx = 1; aPtIdx < (aDeflector.mCurPoints.length | 0); aPtIdx++) {
                                var aPt1 = aDeflector.mCurPoints[aPtIdx - 1].subtract(
                                    new GameFramework.geom.TPoint(this.mDrawTransform.tx, this.mDrawTransform.ty)
                                );
                                var aPt2 = aDeflector.mCurPoints[aPtIdx].subtract(
                                    new GameFramework.geom.TPoint(this.mDrawTransform.tx, this.mDrawTransform.ty)
                                );
                                var aLineDir = new GameFramework.geom.TPoint(aPt2.x - aPt1.x, aPt2.y - aPt1.y);
                                var aLineNormal = aLineDir.clone();
                                aLineNormal.normalize(1.0);
                                var aTemp = aLineNormal.x;
                                aLineNormal.x = -aLineNormal.y;
                                aLineNormal.y = aTemp;
                                var aLineTranslate = new GameFramework.geom.TPoint(aLineNormal.x, aLineNormal.y);
                                aLineTranslate.x =
                                    aLineTranslate.x * aDeflector.mThickness * aParticleInstance.mThicknessHitVariation;
                                aLineTranslate.y =
                                    aLineTranslate.y * aDeflector.mThickness * aParticleInstance.mThicknessHitVariation;
                                var aLineSegmentResult = GameFramework.resources.PIEffect.LineSegmentIntersects(
                                    aPrevPhysPoint,
                                    aCurPhysPoint,
                                    aPt1.add(aLineTranslate),
                                    aPt2.add(aLineTranslate)
                                );
                                if (aLineSegmentResult != null) {
                                    var aCollPoint = new GameFramework.geom.TPoint(
                                        aLineSegmentResult[1],
                                        aLineSegmentResult[2]
                                    );
                                    if (this.GetRandFloatU() > aDeflector.mHits) {
                                        continue;
                                    }
                                    var aBounce = aDeflector.mBounce;
                                    if (theParticleGroup.mIsSuperEmitter) {
                                        aBounce *=
                                            (theParticleGroup.mWasEmitted
                                                ? anEmitter.mValues[
                                                      GameFramework.resources.PIEmitter.Value.BOUNCE | 0
                                                  ].GetValueAt(this.mFrameNum)
                                                : theEmitterInstance.mEmitterInstanceDef.mValues[
                                                      GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0
                                                  ].GetValueAt(this.mFrameNum)) *
                                            anEmitter.mValues[
                                                GameFramework.resources.PIEmitter.Value.F_BOUNCE_OVER_LIFE | 0
                                            ].GetValueAt(aLifePct, 1.0) *
                                            (anEmitter.mValues[
                                                GameFramework.resources.PIEmitter.Value.F_BOUNCE | 0
                                            ].GetValueAt(this.mFrameNum) +
                                                aParticleInstance.mVariationValues[
                                                    GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0
                                                ]);
                                    } else {
                                        aBounce *=
                                            (theParticleGroup.mWasEmitted
                                                ? anEmitter.mValues[
                                                      GameFramework.resources.PIEmitter.Value.BOUNCE | 0
                                                  ].GetValueAt(this.mFrameNum)
                                                : theEmitterInstance.mEmitterInstanceDef.mValues[
                                                      GameFramework.resources.PIEmitterInstanceDef.Value.BOUNCE | 0
                                                  ].GetValueAt(this.mFrameNum)) *
                                            aParticleDef.mValues[
                                                GameFramework.resources.PIParticleDef.Value.BOUNCE_OVER_LIFE | 0
                                            ].GetValueAt(aLifePct) *
                                            (aParticleDef.mValues[
                                                GameFramework.resources.PIParticleDef.Value.BOUNCE | 0
                                            ].GetValueAt(this.mFrameNum) +
                                                aParticleInstance.mVariationValues[
                                                    GameFramework.resources.PIParticleInstance.Variation.BOUNCE | 0
                                                ]);
                                    }
                                    var aCurVelVec = new GameFramework.geom.TPoint(aCurVel.x, aCurVel.y);
                                    var aDot = aCurVelVec.x * aLineNormal.x + aCurVelVec.y * aLineNormal.y;
                                    var aNewVel = new GameFramework.geom.TPoint(
                                        aCurVelVec.x - aLineNormal.x * 2 * aDot,
                                        aCurVelVec.y - aLineNormal.y * 2 * aDot
                                    );
                                    var aPctBounce = Math.min(1.0, Math.abs(aNewVel.y / aNewVel.x));
                                    aNewVel.y *= 1.0 - aPctBounce + aPctBounce * Math.pow(aBounce, 0.5);
                                    aParticleInstance.mVel.x = aNewVel.x * 100.0;
                                    aParticleInstance.mVel.y = aNewVel.y * 100.0;
                                    if (aBounce > 0.001) {
                                        aParticleInstance.mPos = aPrevPos;
                                    }
                                    this.CalcParticleTransform(
                                        theLayer,
                                        theEmitterInstance,
                                        anEmitter,
                                        aParticleDef,
                                        theParticleGroup,
                                        aParticleInstance
                                    );
                                    aCurPhysPoint = aParticleInstance.mTransform.transformPoint(
                                        new GameFramework.geom.TPoint(0.0, 0.0)
                                    );
                                }
                            }
                        }
                    } else {
                        aParticleInstance.mPos.x += aCurVel.x;
                        aParticleInstance.mPos.y += aCurVel.y;
                        if (aLayerDef.mForceVector.length > 0) {
                            this.CalcParticleTransform(
                                theLayer,
                                theEmitterInstance,
                                anEmitter,
                                aParticleDef,
                                theParticleGroup,
                                aParticleInstance
                            );
                            aCurPhysPoint = aParticleInstance.mTransform.transformPoint(
                                new GameFramework.geom.TPoint(0.0, 0.0)
                            );
                        }
                    }
                    for (var aForceIdx = 0; aForceIdx < (aLayerDef.mForceVector.length | 0); aForceIdx++) {
                        var aForce = aLayerDef.mForceVector[aForceIdx];
                        if (aForce.mActive.GetLastKeyframe(this.mFrameNum) < 0.99) {
                            continue;
                        }
                        var inside = false;
                        var i;
                        var j;
                        for (i = 0, j = 4 - 1; i < 4; j = i++) {
                            if (
                                ((aForce.mCurPoints[i].y <= aCurPhysPoint.y &&
                                    aCurPhysPoint.y < aForce.mCurPoints[j].y) ||
                                    (aForce.mCurPoints[j].y <= aCurPhysPoint.y &&
                                        aCurPhysPoint.y < aForce.mCurPoints[i].y)) &&
                                aCurPhysPoint.x <
                                    ((aForce.mCurPoints[j].x - aForce.mCurPoints[i].x) *
                                        (aCurPhysPoint.y - aForce.mCurPoints[i].y)) /
                                        (aForce.mCurPoints[j].y - aForce.mCurPoints[i].y) +
                                        aForce.mCurPoints[i].x
                            ) {
                                inside = !inside;
                            }
                        }
                        if (inside) {
                            var anAngle =
                                GameFramework.resources.PIEffect.DegToRad(
                                    -aForce.mDirection.GetValueAt(this.mFrameNum)
                                ) +
                                GameFramework.resources.PIEffect.DegToRad(-aForce.mAngle.GetValueAt(this.mFrameNum));
                            var aFactor = (0.085 * this.mFramerate) / 100.0;
                            aFactor *= 1.0 + (this.mFramerate - 100.0) * 0.004;
                            var aStrength = aForce.mStrength.GetValueAt(this.mFrameNum) * aFactor;
                            aParticleInstance.mVel.x += Math.cos(anAngle) * aStrength * 100.0;
                            aParticleInstance.mVel.y += Math.sin(anAngle) * aStrength * 100.0;
                        }
                    }
                    if (
                        !theParticleGroup.mIsSuperEmitter &&
                        aParticleDef.mAngleAlignToMotion &&
                        aParticleDef.mAngleKeepAlignedToMotion
                    ) {
                        aParticleInstance.mImgAngle =
                            Math.atan2(aCurVel.y, aCurVel.x) +
                            GameFramework.resources.PIEffect.DegToRad(aParticleDef.mAngleAlignOffset);
                    }
                } else if (aParticleDef.mSingleParticle) {
                    var canUseGeom = false;
                    if (
                        anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.LINE ||
                        anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.CIRCLE
                    ) {
                        canUseGeom = anEmitterInstanceDef.mEmitAtPointsNum != 0;
                    } else if (
                        anEmitterInstanceDef.mEmitterGeom == GameFramework.resources.PIEmitterInstanceDef.Geom.AREA
                    ) {
                        canUseGeom =
                            anEmitterInstanceDef.mEmitAtPointsNum * anEmitterInstanceDef.mEmitAtPointsNum2 != 0;
                    }
                    if (canUseGeom) {
                        var aPos = this.GetGeomPos(theEmitterInstance, aParticleInstance);
                        aParticleInstance.mEmittedPos = this.GetEmitterPos(theEmitterInstance, true);
                        aParticleInstance.mLastEmitterPos = aParticleInstance.mEmittedPos;
                        aParticleInstance.mOrigPos = aPos.subtract(aParticleInstance.mEmittedPos);
                        var aTransform = new GameFramework.geom.Matrix();
                        aTransform.rotate(
                            GameFramework.resources.PIEffect.DegToRad(
                                theEmitterInstance.mEmitterInstanceDef.mValues[
                                    GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0
                                ].GetValueAt(this.mFrameNum)
                            )
                        );
                        var anAddPoint = aTransform.transformPoint(aPos);
                        aParticleInstance.mEmittedPos.x += anAddPoint.x;
                        aParticleInstance.mEmittedPos.y += anAddPoint.y;
                    }
                    if (aParticleDef.mAngleKeepAlignedToMotion && !aParticleDef.mAttachToEmitter) {
                        var aCurVel_2 = anEmitterInstanceDef.mPosition.GetVelocityAt(this.mFrameNum);
                        if (aCurVel_2.x != 0 || aCurVel_2.y != 0) {
                            aParticleInstance.mImgAngle = Math.atan2(aCurVel_2.y, aCurVel_2.x);
                        } else {
                            aParticleInstance.mImgAngle = 0;
                        }
                        aParticleInstance.mImgAngle += GameFramework.resources.PIEffect.DegToRad(
                            aParticleDef.mAngleAlignOffset
                        );
                    }
                }
                if (aParticleDef != null) {
                    var wantColor =
                        (!aParticleInstance.mHasDrawn && aParticleDef.mGetColorFromLayer) ||
                        aParticleDef.mUpdateColorFromLayer;
                    var wantTransparency =
                        (!aParticleInstance.mHasDrawn && aParticleDef.mGetTransparencyFromLayer) ||
                        aParticleDef.mUpdateTransparencyFromLayer;
                    if (wantColor || wantTransparency) {
                        var aDrawPoint = aParticleInstance.mTransform.transformPoint(
                            new GameFramework.geom.TPoint(0, 0)
                        );
                        var aCheckX = (aDrawPoint.x + theLayer.mBkgImgDrawOfs.x) | 0;
                        var aCheckY = (aDrawPoint.y + theLayer.mBkgImgDrawOfs.y) | 0;
                        var aColor = 0;
                        if (
                            theLayer.mBkgImage != null &&
                            aCheckX >= 0 &&
                            aCheckY >= 0 &&
                            aCheckX < theLayer.mBkgImage.mWidth &&
                            aCheckY < theLayer.mBkgImage.mHeight
                        ) {
                        } else {
                            aColor = 0;
                        }
                        if (wantColor) {
                            aParticleInstance.mBkgColor =
                                (aParticleInstance.mBkgColor & 0xff000000) | (aColor & 0xffffff);
                        }
                        if (wantTransparency) {
                            aParticleInstance.mBkgColor =
                                (aParticleInstance.mBkgColor & 0xffffff) | (aColor & 0xff000000);
                        }
                    }
                }
                if (theParticleGroup.mIsSuperEmitter) {
                    aParticleInstance.mImgAngle +=
                        (GameFramework.resources.PIEffect.DegToRad(
                            -(
                                theEmitterInstance.mEmitterInstanceDef.mValues[
                                    GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0
                                ].GetValueAt(this.mFrameNum) *
                                (anEmitter.mValues[
                                    GameFramework.resources.PIEmitter.Value.F_SPIN_OVER_LIFE | 0
                                ].GetValueAt(aLifePct, 1.0) -
                                    1.0) *
                                (anEmitter.mValues[GameFramework.resources.PIEmitter.Value.F_SPIN | 0].GetValueAt(
                                    this.mFrameNum
                                ) +
                                    aParticleInstance.mVariationValues[
                                        GameFramework.resources.PIParticleInstance.Variation.SPIN | 0
                                    ])
                            )
                        ) /
                            anUpdateRate) *
                        160.0;
                } else if (!aParticleDef.mAngleKeepAlignedToMotion) {
                    aParticleInstance.mImgAngle +=
                        GameFramework.resources.PIEffect.DegToRad(
                            -(
                                (theParticleGroup.mWasEmitted
                                    ? anEmitter.mValues[GameFramework.resources.PIEmitter.Value.SPIN | 0].GetValueAt(
                                          this.mFrameNum
                                      )
                                    : theEmitterInstance.mEmitterInstanceDef.mValues[
                                          GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0
                                      ].GetValueAt(this.mFrameNum)) *
                                (aParticleDef.mValues[
                                    GameFramework.resources.PIParticleDef.Value.SPIN_OVER_LIFE | 0
                                ].GetValueAt(aLifePct) -
                                    1.0) *
                                (aParticleDef.mValues[GameFramework.resources.PIParticleDef.Value.SPIN | 0].GetValueAt(
                                    this.mFrameNum
                                ) +
                                    aParticleInstance.mVariationValues[
                                        GameFramework.resources.PIParticleInstance.Variation.SPIN | 0
                                    ])
                            )
                        ) / anUpdateRate;
                }
                aParticleInstance = aNext;
            }
        },
    UpdateParticleGroup: function GameFramework_resources_PIEffect$UpdateParticleGroup(
        theLayer,
        theEmitterInstance,
        theParticleGroup
    ) {
        if (GameFramework.resources.PIEffect.gRandSquareIdx == -1) {
            GameFramework.resources.PIEffect.gRandSquareTable = Array.Create(1024, null);
            for (var i = 0; i < 1024; i++) {
                GameFramework.resources.PIEffect.gRandSquareTable[i] = this.GetRandFloat() * this.GetRandFloat();
            }
            GameFramework.resources.PIEffect.gRandSquareIdx = 0;
        }
        if (theParticleGroup.mHasSingleParticles) {
            this.UpdateParticleGroupWithSingleParticles(theLayer, theEmitterInstance, theParticleGroup);
            return;
        }
        if (theParticleGroup.mIsSuperEmitter) {
            this.UpdateParticleGroupSuperEmitter(theLayer, theEmitterInstance, theParticleGroup);
            return;
        }
        var anUpdateRate = 1000.0 / this.mFrameTime / this.mAnimSpeed;
        var aWeightscale = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate;
        var aSpinScale = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate);
        var aParticleInstance = theParticleGroup.mHead;
        var aLayerDef = theLayer.mLayerDef;
        var anEmitterInstanceDef = theEmitterInstance.mEmitterInstanceDef;
        var aParticleDef = null;
        var aParticleDefInstance = null;
        var anEmitter = null;
        var hasVelocityEffectors = aLayerDef.mForceVector.length > 0 && aLayerDef.mDeflectorVector.length > 0;

        var doImageCycle = theParticleGroup.mHasImageCycle;
        var checkColorSampling = false;
        var aParamEmitterWeight = 0;
        var aParamParticleDefWeight = 0;
        var aParamEmitterSpin = 0;
        var aParamParticleDefSpin = 0;
        var aParamEmitterMotionRand = 0;
        var aParamParticleDefMotionRand = 0;
        if (!theEmitterInstance.mWasActive) {
            var aClearParticleInstance = theParticleGroup.mHead;
            while (aClearParticleInstance != null) {
                var aNext = aClearParticleInstance.mNext;
                aClearParticleInstance.mLifePct = 0x80000000;
                aClearParticleInstance = aNext;
            }
        }
        if (theParticleGroup.mHasColorSampling || theParticleGroup.mHasVelocityEffectors) {
            doImageCycle = false;
            while (aParticleInstance != null) {
                var aNext_2 = aParticleInstance.mNext;
                if (aParticleDef != aParticleInstance.mParticleDef) {
                    anEmitter = aParticleInstance.mEmitterSrc;
                    aParticleDef = aParticleInstance.mParticleDef;
                    aParamEmitterWeight =
                        theEmitterInstance.mEmitterInstanceDef.mValues[
                            GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0
                        ].GetValueAt(this.mFrameNum) * 100.0;
                    aParamParticleDefWeight = aParticleDef.mValues[
                        GameFramework.resources.PIParticleDef.Value.WEIGHT | 0
                    ].GetValueAt(this.mFrameNum);
                    aParamEmitterSpin =
                        theEmitterInstance.mEmitterInstanceDef.mValues[
                            GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0
                        ].GetValueAt(this.mFrameNum) * aSpinScale;
                    aParamParticleDefSpin = aParticleDef.mValues[
                        GameFramework.resources.PIParticleDef.Value.SPIN | 0
                    ].GetValueAt(this.mFrameNum);
                    aParamEmitterMotionRand = theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0
                    ].GetValueAt(this.mFrameNum);
                    aParamParticleDefMotionRand = aParticleDef.mValues[
                        GameFramework.resources.PIParticleDef.Value.MOTION_RAND | 0
                    ].GetValueAt(this.mFrameNum);
                    checkColorSampling =
                        aParticleDef != null &&
                        (aParticleDef.mGetColorFromLayer ||
                            aParticleDef.mUpdateColorFromLayer ||
                            aParticleDef.mGetTransparencyFromLayer ||
                            aParticleDef.mUpdateTransparencyFromLayer);
                    var aTexture = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                    doImageCycle = aParticleDef.mAnimSpeed != -1 && aTexture.mNumCels > 1;
                }
                aParticleInstance.mLifePctInt += aParticleInstance.mLifePctIntInc;
                if ((aParticleInstance.mLifePctInt & 0x80000000) != 0) {
                    this.FreeParticle(this, aParticleInstance, theParticleGroup);
                    aParticleInstance = aNext_2;
                    continue;
                }
                var anIdx =
                    (aParticleInstance.mLifePctInt /
                        ((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0)) |
                    0;
                var aLifeValueSample = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx];
                if (doImageCycle) {
                    var aTexture_2 = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                    aParticleInstance.mImgIdx =
                        ((((aParticleInstance.mTicks * this.mFramerate) / (aParticleDef.mAnimSpeed + 1)) | 0) +
                            aParticleInstance.mAnimFrameRand) %
                        aTexture_2.mNumCels;
                }
                if (this.mIsNewFrame) {
                    var aRand1 =
                        GameFramework.resources.PIEffect.gRandSquareTable[
                            GameFramework.resources.PIEffect.gRandSquareIdx
                        ];
                    var aRand2 =
                        GameFramework.resources.PIEffect.gRandSquareTable[
                            GameFramework.resources.PIEffect.gRandSquareIdx + 1
                        ];
                    GameFramework.resources.PIEffect.gRandSquareIdx =
                        (GameFramework.resources.PIEffect.gRandSquareIdx + 2) % 1024;
                    var aMotionRand =
                        aParamEmitterMotionRand *
                        aLifeValueSample.mMotionRand *
                        (aParamParticleDefMotionRand +
                            aParticleInstance.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0
                            ]);
                    if (aMotionRand > 0) {
                        aParticleInstance.mVel.x += aRand1 * aMotionRand;
                        aParticleInstance.mVel.y += aRand2 * aMotionRand;
                    }
                }
                var aWeight =
                    aParamEmitterWeight *
                    aLifeValueSample.mWeight *
                    (aParamParticleDefWeight +
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0
                        ]);
                aWeight *= aWeightscale;
                aParticleInstance.mVel.y += aWeight;
                var aCurVel = new GameFramework.geom.TPoint(
                    (aParticleInstance.mVel.x / anUpdateRate) * aLifeValueSample.mVelocity,
                    (aParticleInstance.mVel.y / anUpdateRate) * aLifeValueSample.mVelocity
                );
                if (!hasVelocityEffectors) {
                    aParticleInstance.mPos.x += aCurVel.x;
                    aParticleInstance.mPos.y += aCurVel.y;
                } else {
                    GameFramework.resources.PIEffect.IntegrateAffectors(
                        this,
                        theLayer,
                        theEmitterInstance,
                        anEmitter,
                        aParticleDef,
                        theParticleGroup,
                        aCurVel,
                        aLayerDef,
                        aParticleInstance
                    );
                }
                if (checkColorSampling) {
                    var wantColor =
                        (!aParticleInstance.mHasDrawn && aParticleDef.mGetColorFromLayer) ||
                        aParticleDef.mUpdateColorFromLayer;
                    var wantTransparency =
                        (!aParticleInstance.mHasDrawn && aParticleDef.mGetTransparencyFromLayer) ||
                        aParticleDef.mUpdateTransparencyFromLayer;
                    if (wantColor || wantTransparency) {
                        var aDrawPoint = aParticleInstance.mTransform.transformPoint(
                            new GameFramework.geom.TPoint(0, 0)
                        );
                        var aCheckX = (aDrawPoint.x + theLayer.mBkgImgDrawOfs.x) | 0;
                        var aCheckY = (aDrawPoint.y + theLayer.mBkgImgDrawOfs.y) | 0;
                        var aColor = 0;
                        if (
                            theLayer.mBkgImage != null &&
                            aCheckX >= 0 &&
                            aCheckY >= 0 &&
                            aCheckX < theLayer.mBkgImage.mWidth &&
                            aCheckY < theLayer.mBkgImage.mHeight
                        ) {
                        } else {
                            aColor = 0;
                        }
                        if (wantColor) {
                            aParticleInstance.mBkgColor =
                                (aParticleInstance.mBkgColor & 0xff000000) | (aColor & 0xffffff);
                        }
                        if (wantTransparency) {
                            aParticleInstance.mBkgColor =
                                (aParticleInstance.mBkgColor & 0xffffff) | (aColor & 0xff000000);
                        }
                    }
                }
                if (!aParticleDef.mAngleAlignToMotion) {
                    aParticleInstance.mImgAngle +=
                        aParamEmitterSpin *
                        aLifeValueSample.mSpin *
                        (aParamParticleDefSpin +
                            aParticleInstance.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.SPIN | 0
                            ]);
                } else {
                    if (aParticleDef.mAngleKeepAlignedToMotion) {
                        aParticleInstance.mImgAngle =
                            Math.atan2(aCurVel.y, aCurVel.x) +
                            GameFramework.resources.PIEffect.DegToRad(aParticleDef.mAngleAlignOffset);
                    }
                }
                aParticleInstance = aNext_2;
            }
        } else if (theParticleGroup.mHasImageCycle || theParticleGroup.mHasAlignToMotion) {
            doImageCycle = false;
            while (aParticleInstance != null) {
                var aNext_3 = aParticleInstance.mNext;
                if (aParticleDef != aParticleInstance.mParticleDef) {
                    anEmitter = aParticleInstance.mEmitterSrc;
                    aParticleDef = aParticleInstance.mParticleDef;
                    aParticleDefInstance = aParticleInstance.mParticleDefInstance;
                    var aTexture_3 = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                    doImageCycle = aParticleDef.mAnimSpeed != -1 && aTexture_3.mNumCels > 1;
                }
                aParticleInstance.mLifePctInt += aParticleInstance.mLifePctIntInc;
                if ((aParticleInstance.mLifePctInt & 0x80000000) != 0) {
                    this.FreeParticle(this, aParticleInstance, theParticleGroup);
                    aParticleInstance = aNext_3;
                    continue;
                }
                var anIdx_2 =
                    (aParticleInstance.mLifePctInt /
                        ((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0)) |
                    0;
                var aLifeValueSample_2 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_2];
                if (doImageCycle) {
                    aParticleInstance.mTicks += 1.0 / anUpdateRate;
                    var aTexture_4 = this.mDef.mTextureVector[aParticleDef.mTextureIdx];
                    aParticleInstance.mImgIdx =
                        ((((aParticleInstance.mTicks * this.mFramerate) / (aParticleDef.mAnimSpeed + 1)) | 0) +
                            aParticleInstance.mAnimFrameRand) %
                        aTexture_4.mNumCels;
                }
                if (this.mIsNewFrame) {
                    var aRand1_2 =
                        GameFramework.resources.PIEffect.gRandSquareTable[
                            GameFramework.resources.PIEffect.gRandSquareIdx
                        ];
                    var aRand2_2 =
                        GameFramework.resources.PIEffect.gRandSquareTable[
                            GameFramework.resources.PIEffect.gRandSquareIdx + 1
                        ];
                    GameFramework.resources.PIEffect.gRandSquareIdx =
                        (GameFramework.resources.PIEffect.gRandSquareIdx + 2) % 1024;
                    var aMotionRand_2 =
                        anEmitter.mCurMotionRand *
                        aLifeValueSample_2.mMotionRand *
                        (aParticleDefInstance.mCurMotionRand +
                            aParticleInstance.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0
                            ]);
                    if (aMotionRand_2 > 0) {
                        aParticleInstance.mVel.x += aRand1_2 * aMotionRand_2;
                        aParticleInstance.mVel.y += aRand2_2 * aMotionRand_2;
                    }
                }
                var aWeight_2 =
                    anEmitter.mCurWeight *
                    aLifeValueSample_2.mWeight *
                    (aParticleDefInstance.mCurWeight +
                        aParticleInstance.mVariationValues[
                            GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0
                        ]);
                aParticleInstance.mVel.y += aWeight_2;
                var aVelX = (aParticleInstance.mVel.x / anUpdateRate) * aLifeValueSample_2.mVelocity;
                var aVelY = (aParticleInstance.mVel.y / anUpdateRate) * aLifeValueSample_2.mVelocity;
                aParticleInstance.mVel.y += aWeight_2;
                aParticleInstance.mPos.x += aVelX;
                aParticleInstance.mPos.y += aVelY;
                if (!aParticleDef.mAngleAlignToMotion) {
                    aParticleInstance.mImgAngle +=
                        aParamEmitterSpin *
                        aLifeValueSample_2.mSpin *
                        (aParamParticleDefSpin +
                            aParticleInstance.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.SPIN | 0
                            ]);
                } else {
                    if (aParticleDef.mAngleKeepAlignedToMotion) {
                        aParticleInstance.mImgAngle =
                            Math.atan2(aVelY, aVelX) +
                            GameFramework.resources.PIEffect.DegToRad(aParticleDef.mAngleAlignOffset);
                    }
                }
                aParticleInstance = aNext_3;
            }
        } else if (
            !theParticleGroup.mHasDeferredUpdate &&
            !theParticleGroup.mHasSingleParticles &&
            this.mAllowDeferredUpdate
        ) {
            theParticleGroup.mHasDeferredUpdate = true;
        } else {
            if (this.mIsNewFrame) {
                while (aParticleInstance != null) {
                    var aNext_4 = aParticleInstance.mNext;
                    aParticleDef = aParticleInstance.mParticleDef;
                    aParticleDefInstance = aParticleInstance.mParticleDefInstance;
                    anEmitter = aParticleInstance.mEmitterSrc;
                    aParticleInstance.mLifePctInt += aParticleInstance.mLifePctIntInc;
                    if ((aParticleInstance.mLifePctInt & 0x80000000) != 0) {
                        this.FreeParticle(this, aParticleInstance, theParticleGroup);
                        aParticleInstance = aNext_4;
                        continue;
                    }
                    var anIdx_3 =
                        (aParticleInstance.mLifePctInt /
                            ((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0)) |
                        0;
                    var aLifeValueSample_3 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_3];
                    var aRand1_3 =
                        GameFramework.resources.PIEffect.gRandSquareTable[
                            GameFramework.resources.PIEffect.gRandSquareIdx
                        ];
                    var aRand2_3 =
                        GameFramework.resources.PIEffect.gRandSquareTable[
                            GameFramework.resources.PIEffect.gRandSquareIdx + 1
                        ];
                    GameFramework.resources.PIEffect.gRandSquareIdx =
                        (GameFramework.resources.PIEffect.gRandSquareIdx + 2) % 1024;
                    var aMotionRand_3 =
                        anEmitter.mCurMotionRand *
                        aLifeValueSample_3.mMotionRand *
                        (aParticleDefInstance.mCurMotionRand +
                            aParticleInstance.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0
                            ]);
                    if (aMotionRand_3 > 0) {
                        aParticleInstance.mVel.x += aRand1_3 * aMotionRand_3;
                        aParticleInstance.mVel.y += aRand2_3 * aMotionRand_3;
                    }
                    var aWeight_3 =
                        anEmitter.mCurWeight *
                        aLifeValueSample_3.mWeight *
                        (aParticleDefInstance.mCurWeight +
                            aParticleInstance.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0
                            ]);
                    aParticleInstance.mVel.y += aWeight_3;
                    aParticleInstance.mPos.x +=
                        (aParticleInstance.mVel.x / anUpdateRate) * aLifeValueSample_3.mVelocity;
                    aParticleInstance.mPos.y +=
                        (aParticleInstance.mVel.y / anUpdateRate) * aLifeValueSample_3.mVelocity;
                    aParticleInstance.mImgAngle +=
                        anEmitter.mCurSpin *
                        aLifeValueSample_3.mSpin *
                        (aParticleDefInstance.mCurSpin +
                            aParticleInstance.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.SPIN | 0
                            ]);
                    aParticleInstance = aNext_4;
                }
            } else {
                while (aParticleInstance != null) {
                    var aNext_5 = aParticleInstance.mNext;
                    aParticleDef = aParticleInstance.mParticleDef;
                    aParticleDefInstance = aParticleInstance.mParticleDefInstance;
                    anEmitter = aParticleInstance.mEmitterSrc;
                    aParticleInstance.mLifePctInt += aParticleInstance.mLifePctIntInc;
                    if ((aParticleInstance.mLifePctInt & 0x80000000) != 0) {
                        this.FreeParticle(this, aParticleInstance, theParticleGroup);
                        aParticleInstance = aNext_5;
                        continue;
                    }
                    var anIdx_4 =
                        (aParticleInstance.mLifePctInt /
                            ((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0)) |
                        0;
                    var aLifeValueSample_4 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_4];
                    var aWeight_4 =
                        anEmitter.mCurWeight *
                        aLifeValueSample_4.mWeight *
                        (aParticleDefInstance.mCurWeight +
                            aParticleInstance.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0
                            ]);
                    aParticleInstance.mVel.y += aWeight_4;
                    aParticleInstance.mPos.x +=
                        (aParticleInstance.mVel.x / anUpdateRate) * aLifeValueSample_4.mVelocity;
                    aParticleInstance.mPos.y +=
                        (aParticleInstance.mVel.y / anUpdateRate) * aLifeValueSample_4.mVelocity;
                    aParticleInstance.mImgAngle +=
                        anEmitter.mCurSpin *
                        aLifeValueSample_4.mSpin *
                        (aParticleDefInstance.mCurSpin +
                            aParticleInstance.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.SPIN | 0
                            ]);
                    aParticleInstance = aNext_5;
                }
            }
        }
    },
    Update: function GameFramework_resources_PIEffect$Update() {
        if (this.mError != null) {
            return;
        }
        this.mUpdateCnt++;
        if (this.mFrameTime == GameFramework.BaseApp.mApp.mFrameTime * 2.0 && this.mUpdateCnt % 2 == 0) {
            return;
        }
        var isFirstFrame = this.mFrameNum == 0.0;
        if (isFirstFrame && this.mStartupState != null) {
            this.mStartupState.set_Position(0);
            this.LoadState(this.mStartupState, true);
            this.mWantsSRand = false;
            return;
        }
        var doOneFrame = true;
        while (this.mFrameNum < this.mFirstFrameNum || doOneFrame) {
            doOneFrame = false;
            this.mCurNumEmitters = 0;
            this.mCurNumParticles = 0;
            var anUpdateRate = 1000.0 / this.mFrameTime / this.mAnimSpeed;
            var aPrevFrameI = this.mFrameNum | 0;
            if (isFirstFrame) {
                this.mFrameNum += 0.0001;
            } else {
                this.mFrameNum += this.mFramerate / anUpdateRate;
            }
            this.mIsNewFrame = aPrevFrameI != (this.mFrameNum | 0);
            for (var aLayerIdx = 0; aLayerIdx < (this.mDef.mLayerDefVector.length | 0); aLayerIdx++) {
                var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
                var aLayer = this.mLayerVector[aLayerIdx];
                aLayer.mCurOffset = aLayerDef.mOffset.GetValueAt(this.mFrameNum).subtract(aLayerDef.mOrigOffset);
                aLayer.mCurAngle = -GameFramework.resources.PIEffect.DegToRad(
                    aLayerDef.mAngle.GetValueAt(this.mFrameNum)
                );
                if (aLayer.mVisible) {
                    for (
                        var aDeflectorIdx = 0;
                        aDeflectorIdx < (aLayerDef.mDeflectorVector.length | 0);
                        aDeflectorIdx++
                    ) {
                        var aDeflector = aLayerDef.mDeflectorVector[aDeflectorIdx];
                        var aTransform = new GameFramework.geom.Matrix();
                        var aDeflectorAng = aDeflector.mAngle.GetValueAt(this.mFrameNum);
                        if (aDeflectorAng != 0) {
                            aTransform.rotate(GameFramework.resources.PIEffect.DegToRad(aDeflectorAng));
                        }
                        var aDeflectorPos = aDeflector.mPos.GetValueAt(this.mFrameNum);
                        aTransform.translate(aDeflectorPos.x, aDeflectorPos.y);
                        var anOffset = aLayerDef.mOffset.GetValueAt(this.mFrameNum);
                        aTransform.translate(anOffset.x, anOffset.y);
                        var anAngle = aLayerDef.mAngle.GetValueAt(this.mFrameNum);
                        if (anAngle != 0) {
                            aTransform.rotate(GameFramework.resources.PIEffect.DegToRad(anAngle));
                        }
                        aTransform.concat(this.mDrawTransform);
                        for (var i = 0; i < (aDeflector.mPoints.length | 0); i++) {
                            aDeflector.mCurPoints[i] = aTransform.transformPoint(
                                aDeflector.mPoints[i].GetValueAt(this.mFrameNum)
                            );
                        }
                    }
                    for (var aForceIdx = 0; aForceIdx < (aLayerDef.mForceVector.length | 0); aForceIdx++) {
                        var aForce = aLayerDef.mForceVector[aForceIdx];
                        var aTransform_2 = new GameFramework.geom.Matrix();
                        aTransform_2.scale(
                            aForce.mWidth.GetValueAt(this.mFrameNum) / 2.0,
                            aForce.mHeight.GetValueAt(this.mFrameNum) / 2.0
                        );
                        var aForceAngle = aForce.mAngle.GetValueAt(this.mFrameNum);
                        if (aForceAngle != 0) {
                            aTransform_2.rotate(GameFramework.resources.PIEffect.DegToRad(aForceAngle));
                        }
                        var aForcePos = aForce.mPos.GetValueAt(this.mFrameNum);
                        aTransform_2.translate(aForcePos.x, aForcePos.y);
                        var anOffset_2 = aLayerDef.mOffset.GetValueAt(this.mFrameNum);
                        aTransform_2.translate(anOffset_2.x, anOffset_2.y);
                        var anAngle_2 = aLayerDef.mAngle.GetValueAt(this.mFrameNum);
                        if (anAngle_2 != 0) {
                            aTransform_2.rotate(GameFramework.resources.PIEffect.DegToRad(anAngle_2));
                        }
                        aTransform_2.concat(this.mDrawTransform);
                        var aPoints = Array.Create(
                            5,
                            5,
                            new GameFramework.geom.TPoint(-1, -1),
                            new GameFramework.geom.TPoint(1, -1),
                            new GameFramework.geom.TPoint(1, 1),
                            new GameFramework.geom.TPoint(-1, 1),
                            new GameFramework.geom.TPoint(0, 0)
                        );
                        for (var aPtIdx = 0; aPtIdx < 5; aPtIdx++) {
                            aForce.mCurPoints[aPtIdx] = aTransform_2.transformPoint(aPoints[aPtIdx]);
                        }
                    }
                    for (
                        var anEmitterInstanceIdx = 0;
                        anEmitterInstanceIdx < (aLayer.mEmitterInstanceVector.length | 0);
                        anEmitterInstanceIdx++
                    ) {
                        var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
                        var anEmitterInstance = aLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
                        anEmitterInstance.mTintColorI = anEmitterInstance.mTintColor;
                        anEmitterInstanceDef.mCurAngle = GameFramework.resources.PIEffect.DegToRad(
                            anEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.ANGLE | 0
                            ].GetValueAt(this.mFrameNum)
                        );
                        var anEmitterCount = 0;
                        var aParticleCount = 0;
                        var anIterationsLeft = 1;
                        while (anEmitterInstance.mVisible && anIterationsLeft > 0) {
                            anEmitterCount = 0;
                            aParticleCount = 0;
                            anIterationsLeft--;
                            var isActive =
                                anEmitterInstanceDef.mValues[
                                    GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0
                                ].GetLastKeyframe(this.mFrameNum) > 0.99;
                            if (!isActive) {
                                anIterationsLeft = 0;
                            } else if (!anEmitterInstance.mWasActive) {
                                anIterationsLeft +=
                                    ((anEmitterInstanceDef.mFramesToPreload * anUpdateRate) / this.mFramerate) | 0;
                            }
                            anEmitterInstance.mWasActive = isActive;
                            var aFirstTime =
                                anEmitterInstanceDef.mValues[
                                    GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0
                                ].GetNextKeyframeTime(0.0);
                            var aLastTime = anEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0
                            ].GetLastKeyframeTime(this.mLastFrameNum + 1.0);
                            var aLastValue = anEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0
                            ].GetLastKeyframe(this.mLastFrameNum + 1.0);
                            anEmitterInstance.mWithinLifeFrame =
                                this.mFrameNum >= aFirstTime &&
                                (this.mFrameNum < aLastTime || aLastValue > 0.99) &&
                                (this.mEmitAfterTimeline || this.mFrameNum < this.mLastFrameNum);
                            if (
                                isActive ||
                                (anEmitterInstanceDef.mIsSuperEmitter && anEmitterInstance.mWithinLifeFrame)
                            ) {
                                anEmitterCount++;
                            }
                            if (anEmitterInstanceDef.mIsSuperEmitter) {
                                for (
                                    var aFreeEmitterIdx = 0;
                                    aFreeEmitterIdx < (anEmitterInstanceDef.mFreeEmitterIndices.length | 0);
                                    aFreeEmitterIdx++
                                ) {
                                    var anEmitter =
                                        this.mDef.mEmitterVector[
                                            anEmitterInstanceDef.mFreeEmitterIndices[aFreeEmitterIdx]
                                        ];
                                    var aWeightscale = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate;
                                    var aSpinScale = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate);
                                    anEmitter.mCurWeight =
                                        anEmitter.mValues[
                                            GameFramework.resources.PIEmitter.Value.WEIGHT | 0
                                        ].GetValueAt(this.mFrameNum) *
                                        100.0 *
                                        aWeightscale;
                                    anEmitter.mCurSpin =
                                        anEmitter.mValues[GameFramework.resources.PIEmitter.Value.SPIN | 0].GetValueAt(
                                            this.mFrameNum
                                        ) * aSpinScale;
                                    anEmitter.mCurMotionRand = anEmitter.mValues[
                                        GameFramework.resources.PIEmitter.Value.MOTION_RAND | 0
                                    ].GetValueAt(this.mFrameNum);
                                    var aParticleDefInstance =
                                        anEmitterInstance.mSuperEmitterParticleDefInstanceVector[aFreeEmitterIdx];
                                    this.UpdateParticleDef(
                                        aLayer,
                                        anEmitter,
                                        anEmitterInstance,
                                        null,
                                        aParticleDefInstance,
                                        anEmitterInstance.mSuperEmitterGroup,
                                        null
                                    );
                                }
                                this.UpdateParticleGroup(
                                    aLayer,
                                    anEmitterInstance,
                                    anEmitterInstance.mSuperEmitterGroup
                                );
                                var aChildEmitterInstance = anEmitterInstance.mSuperEmitterGroup.mHead;
                                while (aChildEmitterInstance != null) {
                                    var aNext = aChildEmitterInstance.mNext;
                                    var anEmitter_2 = aChildEmitterInstance.mEmitterSrc;
                                    for (
                                        var aParticleDefIdx = 0;
                                        (aParticleDefIdx | 0) < anEmitter_2.mParticleDefVector.length;
                                        aParticleDefIdx++
                                    ) {
                                        var aParticleDef = anEmitter_2.mParticleDefVector[aParticleDefIdx];
                                        var aParticleDefInstance_2 =
                                            aChildEmitterInstance.mEmitter.mParticleDefInstanceVector[aParticleDefIdx];
                                        this.UpdateParticleDef(
                                            aLayer,
                                            anEmitter_2,
                                            anEmitterInstance,
                                            aParticleDef,
                                            aParticleDefInstance_2,
                                            aChildEmitterInstance.mEmitter.mParticleGroup,
                                            aChildEmitterInstance
                                        );
                                    }
                                    this.UpdateParticleGroup(
                                        aLayer,
                                        anEmitterInstance,
                                        aChildEmitterInstance.mEmitter.mParticleGroup
                                    );
                                    aParticleCount += aChildEmitterInstance.mEmitter.mParticleGroup.mCount;
                                    anEmitterCount++;
                                    aChildEmitterInstance = aNext;
                                }
                            } else {
                                var anEmitter_3 = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                                var theEmitterInstance = anEmitterInstance;
                                var aWeightscale_2 = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate;
                                var aSpinScale_2 = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate);
                                anEmitter_3.mCurWeight =
                                    theEmitterInstance.mEmitterInstanceDef.mValues[
                                        GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0
                                    ].GetValueAt(this.mFrameNum) *
                                    100.0 *
                                    aWeightscale_2;
                                anEmitter_3.mCurSpin =
                                    theEmitterInstance.mEmitterInstanceDef.mValues[
                                        GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0
                                    ].GetValueAt(this.mFrameNum) * aSpinScale_2;
                                anEmitter_3.mCurMotionRand = theEmitterInstance.mEmitterInstanceDef.mValues[
                                    GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0
                                ].GetValueAt(this.mFrameNum);
                                for (
                                    var aParticleDefIdx_2 = 0;
                                    (aParticleDefIdx_2 | 0) < (anEmitter_3.mParticleDefVector.length | 0);
                                    aParticleDefIdx_2++
                                ) {
                                    var aParticleGroup = anEmitterInstance.mParticleGroup;
                                    var aParticleDef_2 = anEmitter_3.mParticleDefVector[aParticleDefIdx_2];
                                    var aParticleDefInstance_3 =
                                        anEmitterInstance.mParticleDefInstanceVector[aParticleDefIdx_2];
                                    this.UpdateParticleDef(
                                        aLayer,
                                        anEmitter_3,
                                        anEmitterInstance,
                                        aParticleDef_2,
                                        aParticleDefInstance_3,
                                        aParticleGroup,
                                        null
                                    );
                                }
                                this.UpdateParticleGroup(aLayer, anEmitterInstance, anEmitterInstance.mParticleGroup);
                                aParticleCount += anEmitterInstance.mParticleGroup.mCount;
                            }
                        }
                        this.mCurNumEmitters += anEmitterCount;
                        this.mCurNumParticles += aParticleCount;
                    }
                }
            }
            isFirstFrame = false;
        }
    },
    DrawParticleGroup: function GameFramework_resources_PIEffect$DrawParticleGroup(
        g,
        theLayer,
        theEmitterInstance,
        theParticleGroup,
        isDarkeningPass
    ) {
        if (!theEmitterInstance.mWasActive) {
            return;
        }
        var aColorMult = GameFramework.gfx.Color.Mult(this.mColor, theLayer.mColor);
        var anOrigAlpha = ((this.mColor >>> 24) | 0) & 0xff;
        var anOrigAlphaI = (((((this.mColor >>> 24) & 0xff) * 256) | 0) / 255) | 0;
        var anAlphaI = ((this.mColor >>> 24) & 0xff) | 0;
        var hasColor = (aColorMult & 0xffffff) != 0xffffff;
        var aParticleDef = null;
        var aParticleDefInstance = null;
        var anEmitter = null;
        var aTintPct = 0.0;
        var doPass = false;
        var additive = false;
        if (theParticleGroup.mHasColorSampling || theParticleGroup.mHasPreserveColor) {
            var aParticleInstance = theParticleGroup.mHead;
            while (aParticleInstance != null) {
                var aNext = aParticleInstance.mNext;
                if (aParticleDef != aParticleInstance.mParticleDef) {
                    aParticleDef = aParticleInstance.mParticleDef;
                    aParticleDefInstance = aParticleInstance.mParticleDefInstance;
                    if (aParticleDef.mIntense && !isDarkeningPass) {
                        additive = true;
                    } else {
                        additive = false;
                    }
                    doPass = (!aParticleDef.mIntense || !aParticleDef.mPreserveColor) && isDarkeningPass;
                }
                if (doPass) {
                    aParticleInstance = aNext;
                    continue;
                }
                if (anEmitter != aParticleInstance.mEmitterSrc) {
                    anEmitter = aParticleInstance.mEmitterSrc;
                    aTintPct =
                        theEmitterInstance.mEmitterInstanceDef.mValues[
                            GameFramework.resources.PIEmitterInstanceDef.Value.TINT_STRENGTH | 0
                        ].GetValueAt(this.mFrameNum) *
                        anEmitter.mValues[GameFramework.resources.PIEmitter.Value.TINT_STRENGTH | 0].GetValueAt(
                            this.mFrameNum,
                            1.0
                        );
                }
                var anEmitterLifePct = 0;
                if (aParticleInstance.mParentFreeEmitter != null) {
                    anEmitterLifePct = aParticleInstance.mParentFreeEmitter.mLifePct;
                }
                var anIdx =
                    (aParticleInstance.mLifePctInt /
                        ((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0)) |
                    0;
                var aLifeValueSample = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx];
                var aColorI = aLifeValueSample.mColor;
                if (aParticleDef.mGetColorFromLayer) {
                    aColorI = (aColorI & 0xff000000) | (aParticleInstance.mBkgColor & 0xffffff);
                }
                if (aParticleDef.mGetTransparencyFromLayer) {
                    aColorI = (aColorI & 0xffffff) | (aParticleInstance.mBkgColor & 0xff000000);
                }
                if (aTintPct != 0.0) {
                    aColorI = this.InterpColor(aColorI, theEmitterInstance.mTintColor, aTintPct);
                }
                if (isDarkeningPass) {
                    aColorI = aColorI & 0xff000000;
                }
                if (hasColor) {
                    aColorI = GameFramework.gfx.Color.Mult(aColorI, aColorMult);
                } else if (aParticleDefInstance.mAlphaI != 256) {
                    aColorI =
                        (aColorI & 0xffffff) |
                        (((((aColorI >>> 24) * aParticleDefInstance.mAlphaI) | 0) & 0xff00) << 16);
                }
                if ((aColorI & 0xff000000) != 0) {
                    this.CalcParticleTransform(
                        theLayer,
                        theEmitterInstance,
                        anEmitter,
                        aParticleDef,
                        theParticleGroup,
                        aParticleInstance
                    );
                    var aMatrix = aParticleInstance.mTransform;
                    var aPITextureChunk = aParticleInstance.mTextureChunk;
                    var anImageResource = aPITextureChunk.mSrcTexture.mImageStrip;
                    if (this.mHasDrawTransform) {
                        aMatrix.concat(this.mDrawTransform);
                    } else {
                        var aW = anImageResource.mWidth * 0.5;
                        var aH = anImageResource.mHeight * 0.5;
                        aMatrix.tx += -aMatrix.a - aMatrix.c;
                        aMatrix.ty += -aMatrix.b - aMatrix.d;
                        aMatrix.tx = aMatrix.tx * this.mDrawTransform.a + this.mDrawTransform.tx;
                        aMatrix.ty = aMatrix.ty * this.mDrawTransform.d + this.mDrawTransform.ty;
                        aMatrix.a *= this.mDrawTransform.a / aW;
                        aMatrix.b *= this.mDrawTransform.a / aW;
                        aMatrix.c *= this.mDrawTransform.d / aH;
                        aMatrix.d *= this.mDrawTransform.d / aH;
                    }
                    aParticleInstance.mTextureChunk.mSrcTexture.mImageStrip.set_Additive(additive);
                    var _t4 = g.PushColor(aColorI);
                    try {
                        aParticleInstance.mTextureChunk.mSrcTexture.mImageStrip.DrawEx(
                            g,
                            aMatrix,
                            0,
                            0,
                            aPITextureChunk.mCel
                        );
                    } finally {
                        _t4.Dispose();
                    }
                    aParticleInstance.mHasDrawn = true;
                }
                aParticleInstance = aNext;
            }
        } else if (theParticleGroup.mHasSingleParticles || theParticleGroup.mHasAttachToEmitters) {
            if (isDarkeningPass) {
                return;
            }
            var aParticleInstance_2 = theParticleGroup.mHead;
            if (aParticleInstance_2 != null) {
                aParticleDef = aParticleInstance_2.mParticleDef;
                aParticleDefInstance = aParticleInstance_2.mParticleDefInstance;
                anEmitter = aParticleInstance_2.mEmitterSrc;
                aTintPct =
                    theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.TINT_STRENGTH | 0
                    ].GetValueAt(this.mFrameNum) *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.TINT_STRENGTH | 0].GetValueAt(
                        this.mFrameNum,
                        1.0
                    );
            }
            while (aParticleInstance_2 != null) {
                var aNext_2 = aParticleInstance_2.mNext;
                aParticleDef = aParticleInstance_2.mParticleDef;
                var anIdx_2 =
                    (aParticleInstance_2.mLifePctInt /
                        ((0x7fffffff / GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SIZE) | 0)) |
                    0;
                var aLifeValueSample_2 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_2];
                var aColorI_2 =
                    (aLifeValueSample_2.mColor & aParticleInstance_2.mColorMask) | aParticleInstance_2.mColorOr;
                if (aTintPct != 0.0) {
                    aColorI_2 = this.InterpColor(aColorI_2, theEmitterInstance.mTintColorI, aTintPct);
                }
                if (hasColor) {
                    aColorI_2 =
                        ((((((aColorI_2 >>> 24) & 0xff) * aParticleDefInstance.mAlphaI) << 16) | 0) & 0xff000000) |
                        ((((((aColorI_2 >>> 16) & 0xff) * (((aColorMult >>> 16) & 0xff) + 1)) << 8) | 0) & 0xff0000) |
                        (((((aColorI_2 >>> 8) & 0xff) * (((aColorMult >>> 8) & 0xff) + 1)) | 0) & 0xff00) |
                        (((((aColorI_2 & 0xff) * ((aColorMult & 0xff) + 1)) >>> 8) | 0) & 0xff);
                } else if (aParticleDefInstance.mAlphaI != 256) {
                    aColorI_2 =
                        (aColorI_2 & 0xffffff) |
                        (((((aColorI_2 >>> 24) * aParticleDefInstance.mAlphaI) | 0) & 0xff00) << 16);
                }
                if ((aColorI_2 & 0xff000000) != 0) {
                    this.CalcParticleTransform(
                        theLayer,
                        theEmitterInstance,
                        anEmitter,
                        aParticleDef,
                        theParticleGroup,
                        aParticleInstance_2
                    );
                    var aMatrix_2 = aParticleInstance_2.mTransform;
                    var aPITextureChunk_2 = aParticleInstance_2.mTextureChunk;
                    var anImageResource_2 = aPITextureChunk_2.mSrcTexture.mImageStrip;
                    if (this.mHasDrawTransform) {
                        aMatrix_2.concat(this.mDrawTransform);
                    } else {
                        var aW_2 = anImageResource_2.mWidth * 0.5;
                        var aH_2 = anImageResource_2.mHeight * 0.5;
                        aMatrix_2.tx += -aMatrix_2.a - aMatrix_2.c;
                        aMatrix_2.ty += -aMatrix_2.b - aMatrix_2.d;
                        aMatrix_2.tx = aMatrix_2.tx * this.mDrawTransform.a + this.mDrawTransform.tx;
                        aMatrix_2.ty = aMatrix_2.ty * this.mDrawTransform.d + this.mDrawTransform.ty;
                        aMatrix_2.a *= this.mDrawTransform.a / aW_2;
                        aMatrix_2.b *= this.mDrawTransform.a / aW_2;
                        aMatrix_2.c *= this.mDrawTransform.d / aH_2;
                        aMatrix_2.d *= this.mDrawTransform.d / aH_2;
                    }
                    aParticleInstance_2.mTextureChunk.mSrcTexture.mImageStrip.set_Additive(
                        aParticleInstance_2.mParticleDef.mIntense
                    );
                    var _t5 = g.PushColor(aColorI_2);
                    try {
                        aParticleInstance_2.mTextureChunk.mSrcTexture.mImageStrip.DrawEx(
                            g,
                            aMatrix_2,
                            0,
                            0,
                            aPITextureChunk_2.mCel
                        );
                    } finally {
                        _t5.Dispose();
                    }
                    aParticleInstance_2.mHasDrawn = true;
                }
                aParticleInstance_2 = aNext_2;
            }
        } else if (theParticleGroup.mHasDeferredUpdate) {
            if (isDarkeningPass) {
                return;
            }
            var anUpdateRate = 1000.0 / this.mFrameTime / this.mAnimSpeed;
            var aWeightscale = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate;
            var aSpinScale = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate);
            anAlphaI = 256;
            var aParticleInstance_3 = theParticleGroup.mHead;
            if (aParticleInstance_3 != null) {
                aParticleDef = aParticleInstance_3.mParticleDef;
                aParticleDefInstance = aParticleInstance_3.mParticleDefInstance;
                anEmitter = aParticleInstance_3.mEmitterSrc;
                aTintPct =
                    theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.TINT_STRENGTH | 0
                    ].GetValueAt(this.mFrameNum) *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.TINT_STRENGTH | 0].GetValueAt(
                        this.mFrameNum,
                        1.0
                    );
            }
            if (this.mIsNewFrame) {
                while (aParticleInstance_3 != null) {
                    var aNext_3 = aParticleInstance_3.mNext;
                    aParticleDef = aParticleInstance_3.mParticleDef;
                    aParticleInstance_3.mLifePctInt += aParticleInstance_3.mLifePctIntInc;
                    if ((aParticleInstance_3.mLifePctInt & 0x80000000) != 0) {
                        this.FreeParticle(this, aParticleInstance_3, theParticleGroup);
                        aParticleInstance_3 = aNext_3;
                        continue;
                    }
                    var anIdx_3 =
                        aParticleInstance_3.mLifePctInt >>
                        GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT;
                    var aLifeValueSample_3 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_3];
                    var aLifeValueSampleNext = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_3 + 1];
                    var aPct =
                        (aParticleInstance_3.mLifePctInt &
                            ((1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT) - 1)) /
                        (1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT);
                    var aSizeX = aLifeValueSample_3.mSizeX * (1.0 - aPct) + aLifeValueSampleNext.mSizeX * aPct;
                    var aSizeY = aLifeValueSample_3.mSizeY * (1.0 - aPct) + aLifeValueSampleNext.mSizeY * aPct;
                    var aRand1 =
                        GameFramework.resources.PIEffect.gRandSquareTable[
                            GameFramework.resources.PIEffect.gRandSquareIdx
                        ];
                    var aRand2 =
                        GameFramework.resources.PIEffect.gRandSquareTable[
                            GameFramework.resources.PIEffect.gRandSquareIdx + 1
                        ];
                    GameFramework.resources.PIEffect.gRandSquareIdx =
                        (GameFramework.resources.PIEffect.gRandSquareIdx + 2) % 1024;
                    var aMotionRand =
                        anEmitter.mCurMotionRand *
                        aLifeValueSample_3.mMotionRand *
                        (aParticleDefInstance.mCurMotionRand +
                            aParticleInstance_3.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.MOTION_RAND | 0
                            ]);
                    if (aMotionRand > 0) {
                        aParticleInstance_3.mVel.x += aRand1 * aMotionRand;
                        aParticleInstance_3.mVel.y += aRand2 * aMotionRand;
                    }
                    var aWeight =
                        anEmitter.mCurWeight *
                        aLifeValueSample_3.mWeight *
                        (aParticleDefInstance.mCurWeight +
                            aParticleInstance_3.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0
                            ]);
                    aParticleInstance_3.mVel.y += aWeight;
                    aParticleInstance_3.mPos.x +=
                        (aParticleInstance_3.mVel.x / anUpdateRate) * aLifeValueSample_3.mVelocity;
                    aParticleInstance_3.mPos.y +=
                        (aParticleInstance_3.mVel.y / anUpdateRate) * aLifeValueSample_3.mVelocity;
                    aParticleInstance_3.mImgAngle +=
                        anEmitter.mCurSpin *
                        aLifeValueSample_3.mSpin *
                        (aParticleDefInstance.mCurSpin +
                            aParticleInstance_3.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.SPIN | 0
                            ]);
                    var aColorI_3 =
                        (this.InterpColor(aLifeValueSample_3.mColor, aLifeValueSampleNext.mColor, aPct) &
                            aParticleInstance_3.mColorMask) |
                        aParticleInstance_3.mColorOr;
                    if (aTintPct != 0.0) {
                        aColorI_3 = this.InterpColor(aColorI_3, theEmitterInstance.mTintColorI, aTintPct);
                    }
                    if (hasColor) {
                        aColorI_3 =
                            ((((((aColorI_3 >>> 24) & 0xff) * aParticleDefInstance.mAlphaI) << 16) | 0) & 0xff000000) |
                            ((((((aColorI_3 >>> 16) & 0xff) * (((aColorMult >>> 16) & 0xff) + 1)) << 8) | 0) &
                                0xff0000) |
                            (((((aColorI_3 >>> 8) & 0xff) * (((aColorMult >>> 8) & 0xff) + 1)) | 0) & 0xff00) |
                            (((((aColorI_3 & 0xff) * ((aColorMult & 0xff) + 1)) >>> 8) | 0) & 0xff);
                    } else if (aParticleDefInstance.mAlphaI != 256) {
                        aColorI_3 =
                            (aColorI_3 & 0xffffff) |
                            (((((aColorI_3 >>> 24) * aParticleDefInstance.mAlphaI) | 0) & 0xff00) << 16);
                    }
                    if ((aColorI_3 & 0xff000000) != 0) {
                        this.CalcParticleTransform(
                            theLayer,
                            theEmitterInstance,
                            anEmitter,
                            aParticleDef,
                            theParticleGroup,
                            aParticleInstance_3
                        );
                        var aMatrix_3 = aParticleInstance_3.mTransform;
                        var aPITextureChunk_3 = aParticleInstance_3.mTextureChunk;
                        var anImageResource_3 = aPITextureChunk_3.mSrcTexture.mImageStrip;
                        if (this.mHasDrawTransform) {
                            aMatrix_3.concat(this.mDrawTransform);
                        } else {
                            var aW_3 = anImageResource_3.mWidth * 0.5;
                            var aH_3 = anImageResource_3.mHeight * 0.5;
                            aMatrix_3.tx += -aMatrix_3.a - aMatrix_3.c;
                            aMatrix_3.ty += -aMatrix_3.b - aMatrix_3.d;
                            aMatrix_3.tx = aMatrix_3.tx * this.mDrawTransform.a + this.mDrawTransform.tx;
                            aMatrix_3.ty = aMatrix_3.ty * this.mDrawTransform.d + this.mDrawTransform.ty;
                            aMatrix_3.a *= this.mDrawTransform.a / aW_3;
                            aMatrix_3.b *= this.mDrawTransform.a / aW_3;
                            aMatrix_3.c *= this.mDrawTransform.d / aH_3;
                            aMatrix_3.d *= this.mDrawTransform.d / aH_3;
                        }
                        aParticleInstance_3.mTextureChunk.mSrcTexture.mImageStrip.set_Additive(
                            aParticleInstance_3.mParticleDef.mIntense
                        );
                        var _t6 = g.PushColor(aColorI_3);
                        try {
                            aParticleInstance_3.mTextureChunk.mSrcTexture.mImageStrip.DrawEx(
                                g,
                                aMatrix_3,
                                0,
                                0,
                                aPITextureChunk_3.mCel
                            );
                        } finally {
                            _t6.Dispose();
                        }
                        aParticleInstance_3.mHasDrawn = true;
                    }
                    aParticleInstance_3 = aNext_3;
                }
            } else {
                while (aParticleInstance_3 != null) {
                    var aNext_4 = aParticleInstance_3.mNext;
                    aParticleDef = aParticleInstance_3.mParticleDef;
                    aParticleDefInstance = aParticleInstance_3.mParticleDefInstance;
                    aParticleInstance_3.mLifePctInt += aParticleInstance_3.mLifePctIntInc;
                    if ((aParticleInstance_3.mLifePctInt & 0x80000000) != 0) {
                        this.FreeParticle(this, aParticleInstance_3, theParticleGroup);
                        aParticleInstance_3 = aNext_4;
                        continue;
                    }
                    var anIdx_4 =
                        aParticleInstance_3.mLifePctInt >>
                        GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT;
                    var aLifeValueSample_4 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_4];
                    var aLifeValueSampleNext_2 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_4 + 1];
                    var aPct_2 =
                        (aParticleInstance_3.mLifePctInt &
                            ((1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT) - 1)) /
                        (1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT);
                    var aSizeX_2 = aLifeValueSample_4.mSizeX * (1.0 - aPct_2) + aLifeValueSampleNext_2.mSizeX * aPct_2;
                    var aSizeY_2 = aLifeValueSample_4.mSizeY * (1.0 - aPct_2) + aLifeValueSampleNext_2.mSizeY * aPct_2;
                    var aWeight_2 =
                        anEmitter.mCurWeight *
                        aLifeValueSample_4.mWeight *
                        (aParticleDefInstance.mCurWeight +
                            aParticleInstance_3.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.WEIGHT | 0
                            ]);
                    aParticleInstance_3.mVel.y += aWeight_2;
                    aParticleInstance_3.mPos.x +=
                        (aParticleInstance_3.mVel.x / anUpdateRate) * aLifeValueSample_4.mVelocity;
                    aParticleInstance_3.mPos.y +=
                        (aParticleInstance_3.mVel.y / anUpdateRate) * aLifeValueSample_4.mVelocity;
                    aParticleInstance_3.mImgAngle +=
                        anEmitter.mCurSpin *
                        aLifeValueSample_4.mSpin *
                        (aParticleDefInstance.mCurSpin +
                            aParticleInstance_3.mVariationValues[
                                GameFramework.resources.PIParticleInstance.Variation.SPIN | 0
                            ]);
                    var aColorI_4 =
                        (this.InterpColor(aLifeValueSample_4.mColor, aLifeValueSampleNext_2.mColor, aPct_2) &
                            aParticleInstance_3.mColorMask) |
                        aParticleInstance_3.mColorOr;
                    if (aTintPct != 0.0) {
                        aColorI_4 = this.InterpColor(aColorI_4, theEmitterInstance.mTintColorI, aTintPct);
                    }
                    if (hasColor) {
                        aColorI_4 =
                            ((((((aColorI_4 >>> 24) & 0xff) * aParticleDefInstance.mAlphaI) << 16) | 0) & 0xff000000) |
                            ((((((aColorI_4 >>> 16) & 0xff) * (((aColorMult >>> 16) & 0xff) + 1)) << 8) | 0) &
                                0xff0000) |
                            (((((aColorI_4 >>> 8) & 0xff) * (((aColorMult >>> 8) & 0xff) + 1)) | 0) & 0xff00) |
                            (((((aColorI_4 & 0xff) * ((aColorMult & 0xff) + 1)) >>> 8) | 0) & 0xff);
                    } else if (aParticleDefInstance.mAlphaI != 256) {
                        aColorI_4 =
                            (aColorI_4 & 0xffffff) |
                            (((((aColorI_4 >>> 24) * aParticleDefInstance.mAlphaI) | 0) & 0xff00) << 16);
                    }
                    if ((aColorI_4 & 0xff000000) != 0) {
                        this.CalcParticleTransformSimple(
                            theLayer,
                            theEmitterInstance,
                            anEmitter,
                            aParticleDef,
                            theParticleGroup,
                            aParticleInstance_3,
                            aSizeX_2,
                            aSizeY_2
                        );
                        var aMatrix_4 = aParticleInstance_3.mTransform;
                        var aPITextureChunk_4 = aParticleInstance_3.mTextureChunk;
                        var anImageResource_4 = aPITextureChunk_4.mSrcTexture.mImageStrip;
                        if (this.mHasDrawTransform) {
                            aMatrix_4.concat(this.mDrawTransform);
                        } else {
                            var aW_4 = anImageResource_4.mWidth * 0.5;
                            var aH_4 = anImageResource_4.mHeight * 0.5;
                            aMatrix_4.tx += -aMatrix_4.a - aMatrix_4.c;
                            aMatrix_4.ty += -aMatrix_4.b - aMatrix_4.d;
                            aMatrix_4.tx = aMatrix_4.tx * this.mDrawTransform.a + this.mDrawTransform.tx;
                            aMatrix_4.ty = aMatrix_4.ty * this.mDrawTransform.d + this.mDrawTransform.ty;
                            aMatrix_4.a *= this.mDrawTransform.a / aW_4;
                            aMatrix_4.b *= this.mDrawTransform.a / aW_4;
                            aMatrix_4.c *= this.mDrawTransform.d / aH_4;
                            aMatrix_4.d *= this.mDrawTransform.d / aH_4;
                        }
                        aParticleInstance_3.mTextureChunk.mSrcTexture.mImageStrip.set_Additive(
                            aParticleInstance_3.mParticleDef.mIntense
                        );
                        var _t7 = g.PushColor(aColorI_4);
                        try {
                            aParticleInstance_3.mTextureChunk.mSrcTexture.mImageStrip.DrawEx(
                                g,
                                aMatrix_4,
                                0,
                                0,
                                aPITextureChunk_4.mCel
                            );
                        } finally {
                            _t7.Dispose();
                        }
                        aParticleInstance_3.mHasDrawn = true;
                    }
                    aParticleInstance_3 = aNext_4;
                }
            }
            theParticleGroup.mHasDeferredUpdate = false;
        } else {
            if (isDarkeningPass) {
                return;
            }
            var aParticleInstance_4 = theParticleGroup.mHead;
            if (aParticleInstance_4 != null) {
                aParticleDef = aParticleInstance_4.mParticleDef;
                anEmitter = aParticleInstance_4.mEmitterSrc;
                aTintPct =
                    theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.TINT_STRENGTH | 0
                    ].GetValueAt(this.mFrameNum) *
                    anEmitter.mValues[GameFramework.resources.PIEmitter.Value.TINT_STRENGTH | 0].GetValueAt(
                        this.mFrameNum,
                        1.0
                    );
            }
            while (aParticleInstance_4 != null) {
                var aNext_5 = aParticleInstance_4.mNext;
                aParticleDef = aParticleInstance_4.mParticleDef;
                aParticleDefInstance = aParticleInstance_4.mParticleDefInstance;
                var anIdx_5 =
                    aParticleInstance_4.mLifePctInt >> GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT;
                if (anIdx_5 + 1 >= aParticleDef.mLifeValueTable.mLifeValuesSampleTable.length) {
                    aParticleInstance_4 = aNext_5;
                    continue;
                }
                var aLifeValueSample_5 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_5];
                var aLifeValueSampleNext_3 = aParticleDef.mLifeValueTable.mLifeValuesSampleTable[anIdx_5 + 1];
                var aPct_3 =
                    (aParticleInstance_4.mLifePctInt &
                        ((1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT) - 1)) /
                    (1 << GameFramework.resources.PILifeValueTable.LIFEVALUE_SAMPLE_SHIFT);
                var aSizeX_3 = aLifeValueSample_5.mSizeX * (1.0 - aPct_3) + aLifeValueSampleNext_3.mSizeX * aPct_3;
                var aSizeY_3 = aLifeValueSample_5.mSizeY * (1.0 - aPct_3) + aLifeValueSampleNext_3.mSizeY * aPct_3;
                var aColorI_5 =
                    (this.InterpColor(aLifeValueSample_5.mColor, aLifeValueSampleNext_3.mColor, aPct_3) &
                        aParticleInstance_4.mColorMask) |
                    aParticleInstance_4.mColorOr;
                if (aTintPct != 0.0) {
                    aColorI_5 = this.InterpColor(aColorI_5, theEmitterInstance.mTintColorI, aTintPct);
                }
                if (hasColor) {
                    aColorI_5 =
                        ((((((aColorI_5 >>> 24) & 0xff) * aParticleDefInstance.mAlphaI) << 16) | 0) & 0xff000000) |
                        ((((((aColorI_5 >>> 16) & 0xff) * (((aColorMult >>> 16) & 0xff) + 1)) << 8) | 0) & 0xff0000) |
                        (((((aColorI_5 >>> 8) & 0xff) * (((aColorMult >>> 8) & 0xff) + 1)) | 0) & 0xff00) |
                        (((((aColorI_5 & 0xff) * ((aColorMult & 0xff) + 1)) >>> 8) | 0) & 0xff);
                } else if (aParticleDefInstance.mAlphaI != 256) {
                    aColorI_5 =
                        (aColorI_5 & 0xffffff) |
                        (((((aColorI_5 >>> 24) * aParticleDefInstance.mAlphaI) | 0) & 0xff00) << 16);
                }
                if ((aColorI_5 & 0xff000000) != 0) {
                    this.CalcParticleTransformSimple(
                        theLayer,
                        theEmitterInstance,
                        anEmitter,
                        aParticleDef,
                        theParticleGroup,
                        aParticleInstance_4,
                        aSizeX_3,
                        aSizeY_3
                    );
                    var aMatrix_5 = aParticleInstance_4.mTransform;
                    var aPITextureChunk_5 = aParticleInstance_4.mTextureChunk;
                    var anImageResource_5 = aPITextureChunk_5.mSrcTexture.mImageStrip;
                    if (this.mHasDrawTransform) {
                        aMatrix_5.concat(this.mDrawTransform);
                    } else {
                        var aW_5 = anImageResource_5.mWidth * 0.5;
                        var aH_5 = anImageResource_5.mHeight * 0.5;
                        aMatrix_5.tx += -aMatrix_5.a - aMatrix_5.c;
                        aMatrix_5.ty += -aMatrix_5.b - aMatrix_5.d;
                        aMatrix_5.tx = aMatrix_5.tx * this.mDrawTransform.a + this.mDrawTransform.tx;
                        aMatrix_5.ty = aMatrix_5.ty * this.mDrawTransform.d + this.mDrawTransform.ty;
                        aMatrix_5.a *= this.mDrawTransform.a / aW_5;
                        aMatrix_5.b *= this.mDrawTransform.a / aW_5;
                        aMatrix_5.c *= this.mDrawTransform.d / aH_5;
                        aMatrix_5.d *= this.mDrawTransform.d / aH_5;
                    }
                    aParticleInstance_4.mTextureChunk.mSrcTexture.mImageStrip.set_Additive(
                        aParticleInstance_4.mParticleDef.mIntense
                    );
                    var _t8 = g.PushColor(aColorI_5);
                    try {
                        aParticleInstance_4.mTextureChunk.mSrcTexture.mImageStrip.DrawEx(
                            g,
                            aMatrix_5,
                            0,
                            0,
                            aPITextureChunk_5.mCel
                        );
                    } finally {
                        _t8.Dispose();
                    }
                    aParticleInstance_4.mHasDrawn = true;
                }
                aParticleInstance_4 = aNext_5;
            }
        }
    },
    DrawLayer: function GameFramework_resources_PIEffect$DrawLayer(g, theLayer) {
        var aLayerDef = theLayer.mLayerDef;
        for (
            var anEmitterInstanceIdx = 0;
            anEmitterInstanceIdx < (theLayer.mEmitterInstanceVector.length | 0);
            anEmitterInstanceIdx++
        ) {
            var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
            var anEmitterInstance = theLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
            if (!anEmitterInstance.mVisible) {
                continue;
            }
            for (var aPass = 0; aPass < 2; aPass++) {
                if (aPass == 0 && !this.mGlobalAllowPreserveColor) {
                    continue;
                }
                if (anEmitterInstanceDef.mIsSuperEmitter) {
                    for (
                        var aFreeEmitterIdx = 0;
                        aFreeEmitterIdx < (anEmitterInstanceDef.mFreeEmitterIndices.length | 0);
                        aFreeEmitterIdx++
                    ) {
                        var anUpdateRate = 1000.0 / this.mFrameTime / this.mAnimSpeed;
                        var anEmitter =
                            this.mDef.mEmitterVector[anEmitterInstanceDef.mFreeEmitterIndices[aFreeEmitterIdx]];
                        var aWeightscale = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate;
                        var aSpinScale = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate);
                        anEmitter.mCurWeight =
                            anEmitter.mValues[GameFramework.resources.PIEmitter.Value.WEIGHT | 0].GetValueAt(
                                this.mFrameNum
                            ) *
                            100.0 *
                            aWeightscale;
                        anEmitter.mCurSpin =
                            anEmitter.mValues[GameFramework.resources.PIEmitter.Value.SPIN | 0].GetValueAt(
                                this.mFrameNum
                            ) * aSpinScale;
                        anEmitter.mCurMotionRand = anEmitter.mValues[
                            GameFramework.resources.PIEmitter.Value.MOTION_RAND | 0
                        ].GetValueAt(this.mFrameNum);
                        var aChildEmitterInstance = anEmitterInstance.mSuperEmitterGroup.mHead;
                        while (aChildEmitterInstance != null) {
                            this.DrawParticleGroup(
                                g,
                                theLayer,
                                anEmitterInstance,
                                aChildEmitterInstance.mEmitter.mParticleGroup,
                                aPass == 0
                            );
                            aChildEmitterInstance = aChildEmitterInstance.mNext;
                        }
                    }
                } else {
                    var anEmitter_2 = this.mDef.mEmitterVector[anEmitterInstanceDef.mEmitterDefIdx];
                    var theEmitterInstance = anEmitterInstance;
                    var anUpdateRate_2 = 1000.0 / this.mFrameTime / this.mAnimSpeed;
                    var aWeightscale_2 = (1.0 + (this.mFramerate - 100.0) * 0.0005) / anUpdateRate_2;
                    var aSpinScale_2 = -GameFramework.resources.PIEffect.DegToRad(1 / anUpdateRate_2);
                    anEmitter_2.mCurWeight =
                        theEmitterInstance.mEmitterInstanceDef.mValues[
                            GameFramework.resources.PIEmitterInstanceDef.Value.WEIGHT | 0
                        ].GetValueAt(this.mFrameNum) *
                        100.0 *
                        aWeightscale_2;
                    anEmitter_2.mCurSpin =
                        theEmitterInstance.mEmitterInstanceDef.mValues[
                            GameFramework.resources.PIEmitterInstanceDef.Value.SPIN | 0
                        ].GetValueAt(this.mFrameNum) * aSpinScale_2;
                    anEmitter_2.mCurMotionRand = theEmitterInstance.mEmitterInstanceDef.mValues[
                        GameFramework.resources.PIEmitterInstanceDef.Value.MOTION_RAND | 0
                    ].GetValueAt(this.mFrameNum);
                    this.DrawParticleGroup(
                        g,
                        theLayer,
                        anEmitterInstance,
                        anEmitterInstance.mParticleGroup,
                        aPass == 0
                    );
                }
            }
        }
    },
    Draw: function GameFramework_resources_PIEffect$Draw(g) {
        var anOldMatrix = this.mDrawTransform;
        g.PushMatrix(this.mDrawTransform);
        this.mDrawTransform = g.mMatrix;
        this.mHasDrawTransform = this.mDrawTransform.b != 0.0 || this.mDrawTransform.c != 0.0;
        this.mLastDrawnPixelCount = 0;
        for (var aLayerIdx = 0; aLayerIdx < (this.mDef.mLayerDefVector.length | 0); aLayerIdx++) {
            var aLayer = this.mLayerVector[aLayerIdx];
            if (aLayer.mVisible) {
                this.DrawLayer(g, aLayer);
            }
        }
        g.PopMatrix();
        this.mDrawTransform = anOldMatrix;
    },
    HasTimelineExpired: function GameFramework_resources_PIEffect$HasTimelineExpired() {
        return this.mFrameNum >= this.mLastFrameNum;
    },
    IsActive: function GameFramework_resources_PIEffect$IsActive() {
        for (var aLayerIdx = 0; aLayerIdx < (this.mDef.mLayerDefVector.length | 0); aLayerIdx++) {
            var aLayerDef = this.mDef.mLayerDefVector[aLayerIdx];
            var aLayer = this.mLayerVector[aLayerIdx];
            if (aLayer.mVisible) {
                for (
                    var anEmitterInstanceIdx = 0;
                    anEmitterInstanceIdx < aLayer.mEmitterInstanceVector.length;
                    anEmitterInstanceIdx++
                ) {
                    var anEmitterInstanceDef = aLayerDef.mEmitterInstanceDefVector[anEmitterInstanceIdx];
                    var anEmitterInstance = aLayer.mEmitterInstanceVector[anEmitterInstanceIdx];
                    if (anEmitterInstance.mVisible) {
                        if (
                            anEmitterInstanceDef.mValues[
                                GameFramework.resources.PIEmitterInstanceDef.Value.ACTIVE | 0
                            ].GetNextKeyframeTime(this.mFrameNum) >= this.mFrameNum
                        ) {
                            return true;
                        }
                        if (anEmitterInstance.mWithinLifeFrame) {
                            return true;
                        }
                        if (anEmitterInstance.mSuperEmitterGroup.mHead != null) {
                            return true;
                        }
                        if (anEmitterInstance.mParticleGroup.mHead != null) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },
    GetNotesParam: function GameFramework_resources_PIEffect$GetNotesParam(theName, theDefault) {
        if (theDefault === undefined) {
            theDefault = "";
        }
        theName = theName.toUpperCase();
        if (this.mNotesParams != null && this.mNotesParams.hasOwnProperty(theName)) {
            return this.mNotesParams[theName];
        } else {
            return theDefault;
        }
    },
};
GameFramework.resources.PIEffect.staticInit = function GameFramework_resources_PIEffect$staticInit() {
    GameFramework.resources.PIEffect.PPF_MIN_VERSION = 0;
    GameFramework.resources.PIEffect.PPF_VERSION = 1;
    GameFramework.resources.PIEffect.PPF_STATE_VERSION = 1;
    GameFramework.resources.PIEffect.mGlobalCountScale = 1.0;
    GameFramework.resources.PIEffect.gParticleTypeCount = 0;
    GameFramework.resources.PIEffect.sPIGeomDataEx = new GameFramework.resources.PIGeomDataEx();
    GameFramework.resources.PIEffect.gRandSquareTable = null;
    GameFramework.resources.PIEffect.gRandSquareIdx = -1;
};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.PIEffect.registerClass(
        "GameFramework.resources.PIEffect",
        null,
        GameFramework.IExplicitDisposable
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.PIEffect.staticInit();
});
