GameFramework.resources.PopAnimResource = function GameFramework_resources_PopAnimResource() {
	this.mTransform = new GameFramework.geom.Matrix();
	this.mOfsTab = Array.Create(3, 0, 0, 1, 2);
	this.mNextObjectPos = null;
	this.mZeroPt = new GameFramework.geom.TPoint(0, 0);
	GameFramework.resources.PopAnimResource.initializeBase(this);
	this.mMouseVisible = false;
}
GameFramework.resources.PopAnimResource.prototype = {
	mAnimRate : 0,
	mImageVector : null,
	mObjectNamePool : null,
	mMainSpriteInst : null,
	mMainAnimDef : null,
	mTransDirty : true,
	mBlendTicksTotal : 0,
	mBlendTicksCur : 0,
	mBlendDelay : 0,
	mAnimRunning : null,
	mPaused : null,
	mLastPlayedFrameLabel : null,
	mInterpolate : true,
	mTransform : null,
	mDrawScale : 1.0,
	mColor : 0xffffffff,
	mLoaded : false,
	mAdditive : false,
	mVersion : 0,
	mAnimSpeedScale : 1.0,
	mPIEffectIdSearchVector : null,
	mOfsTab : null,
	mNextObjectPos : null,
	mZeroPt : null,
	Duplicate : function GameFramework_resources_PopAnimResource$Duplicate() {
		var aPopAnimResource = new GameFramework.resources.PopAnimResource();
		aPopAnimResource.mX = this.mX;
		aPopAnimResource.mY = this.mY;
		aPopAnimResource.mWidth = this.mWidth;
		aPopAnimResource.mHeight = this.mHeight;
		aPopAnimResource.mAnimRate = this.mAnimRate;
		aPopAnimResource.mImageVector = this.mImageVector;
		aPopAnimResource.mObjectNamePool = this.mObjectNamePool;
		aPopAnimResource.mMainAnimDef = this.mMainAnimDef;
		aPopAnimResource.mDrawScale = this.mDrawScale;
		aPopAnimResource.mLoaded = this.mLoaded;
		aPopAnimResource.mMainSpriteInst = new GameFramework.resources.popanim.PopAnimSpriteInst();
		return aPopAnimResource;
	},
	Dispose : function GameFramework_resources_PopAnimResource$Dispose() {
		GameFramework.widgets.ClassicWidget.prototype.Dispose.apply(this);
		this.mMainSpriteInst.Dispose();
		this.mMainSpriteInst = null;
	},
	GetObjectInst : function GameFramework_resources_PopAnimResource$GetObjectInst(theName) {
		this.SetupSpriteInst('');
		return this.mMainSpriteInst.GetObjectInst(theName);
	},
	FrameHit : function GameFramework_resources_PopAnimResource$FrameHit(theSpriteInst, theFrame, theObjectPos) {
		theSpriteInst.mOnNewFrame = false;
		for(var anObjectPosIdx = 0; anObjectPosIdx < (theFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
			var anObjectPos = (theFrame.mFrameObjectPosVector[anObjectPosIdx]);
			if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
				var aSpriteInst = ((theSpriteInst.mChildren[anObjectPos.mData.mObjectNum])).mSpriteInst;
				if(aSpriteInst != null) {
					for(var aPreload = 0; aPreload < anObjectPos.mData.mPreloadFrames; aPreload++) {
						this.IncSpriteInstFrame(aSpriteInst, anObjectPos, ((1000.0 / GameFramework.BaseApp.mApp.mFrameTime) / theSpriteInst.mDef.mAnimRate));
					}
				}
			}
		}
		if(theFrame.mCommandVector != null) {
			for(var aCmdNum = 0; aCmdNum < (theFrame.mCommandVector.length | 0); aCmdNum++) {
				var aCommand = (theFrame.mCommandVector[aCmdNum]);
				{
					if(aCommand.mCommand.toLowerCase() == 'addparticleeffect') {
						var aParams = aCommand.mParam;
						GameFramework.Utils.Trace('addparticleeffect: ' + aParams);
						var aParticleEffect = new GameFramework.resources.popanim.PopAnimParticleEffect();
						aParticleEffect.mXOfs = 0;
						aParticleEffect.mYOfs = 0;
						aParticleEffect.mBehind = false;
						aParticleEffect.mEffect = null;
						aParticleEffect.mAttachEmitter = false;
						aParticleEffect.mTransform = false;
						aParticleEffect.mLastUpdated = this.mUpdateCnt;
						var once = false;
						var aFileName = '';
						var firstParam = true;
						while(aParams.length > 0) {
							var aCurParam;
							var aCommaPos = aParams.indexOf(String.fromCharCode(44));
							if(aCommaPos == -1) {
								aCurParam = aParams;
							} else {
								aCurParam = aParams.substr(0, aCommaPos);
							}
							aCurParam = aCurParam.trim();
							if(firstParam) {
								aParticleEffect.mName = aCurParam;
								aFileName = aCurParam;
								firstParam = false;
							} else {
								var aSpacePos;
								while((aSpacePos = (aCurParam.indexOf(String.fromCharCode(32)) | 0)) != -1) {
									aCurParam = aCurParam.remove(aSpacePos);
								}
								var aLowerParam = aCurParam.toLowerCase();
								if(aLowerParam.substr(0, 2) == 'x=') {
									aParticleEffect.mXOfs = GameFramework.Utils.ToFloat(aCurParam.substr(2));
								} else if(aLowerParam.substr(0, 2) == 'y=') {
									aParticleEffect.mYOfs = GameFramework.Utils.ToFloat(aCurParam.substr(2));
								} else if(aLowerParam == 'attachemitter') {
									aParticleEffect.mAttachEmitter = true;
								} else if(aLowerParam == 'once') {
									once = true;
								} else if(aLowerParam == 'behind') {
									aParticleEffect.mBehind = true;
								} else if(aLowerParam == 'transform') {
									aParticleEffect.mTransform = true;
								}
							}
							if(aCommaPos == -1) {
								break;
							}
							aParams = aParams.substr(aCommaPos + 1);
						}
						if(once) {
							if(theSpriteInst.mParticleEffectVector != null) {
								for(var i = 0; i < (theSpriteInst.mParticleEffectVector.length | 0); i++) {
									var aCheckParticleEffect = theSpriteInst.mParticleEffectVector[i];
									if(aCheckParticleEffect.mName == aFileName) {
										return;
									}
								}
							}
						}
						if(this.mPIEffectIdSearchVector != null) {

							{
								var $srcArray1 = this.mPIEffectIdSearchVector;
								for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
									var anIdSearch = $srcArray1[$enum1];
									aParticleEffect.mEffect = GameFramework.BaseApp.mApp.mResourceManager.GetPIEffectById(anIdSearch + aParticleEffect.mName.toUpperCase());
									if(aParticleEffect.mEffect == null) {
										break;
									}
									aParticleEffect.mEffect = aParticleEffect.mEffect.Duplicate();
								}
							}
						}
						if(aParticleEffect.mEffect != null) {
							if(theSpriteInst.mParticleEffectVector == null) {
								theSpriteInst.mParticleEffectVector = [];
							}
							theSpriteInst.mParticleEffectVector.push(aParticleEffect);
						}
					}
				}
			}
		}
	},
	DoFramesHit : function GameFramework_resources_PopAnimResource$DoFramesHit(theSpriteInst, theObjectPos) {
		var aCurFrame = (theSpriteInst.mDef.mFrames[(theSpriteInst.mFrameNum | 0)]);
		this.FrameHit(theSpriteInst, aCurFrame, theObjectPos);
		for(var anObjectPosIdx = 0; anObjectPosIdx < (aCurFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
			var anObjectPos = (aCurFrame.mFrameObjectPosVector[anObjectPosIdx]);
			if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
				var aSpriteInst = ((theSpriteInst.mChildren[anObjectPos.mData.mObjectNum])).mSpriteInst;
				if(aSpriteInst != null) {
					this.DoFramesHit(aSpriteInst, anObjectPos);
				}
			}
		}
	},
	InitSpriteInst : function GameFramework_resources_PopAnimResource$InitSpriteInst(theSpriteInst, theSpriteDef) {
		theSpriteInst.mFrameRepeats = 0;
		theSpriteInst.mDelayFrames = 0;
		theSpriteInst.mDef = theSpriteDef;
		theSpriteInst.mLastUpdated = -1;
		theSpriteInst.mOnNewFrame = true;
		theSpriteInst.mFrameNum = 0;
		theSpriteInst.mChildren = [];
		if(theSpriteDef.mObjectDefVector != null) {
			for(var anObjectNum = 0; anObjectNum < (theSpriteDef.mObjectDefVector.length | 0); anObjectNum++) {
				var anObjectDef = (theSpriteDef.mObjectDefVector[anObjectNum]);
				var anObjectInst = new GameFramework.resources.popanim.PopAnimObjectInst();
				anObjectInst.mColorMult = 0xffffffff;
				anObjectInst.mName = anObjectDef.mName;
				anObjectInst.mIsBlending = false;
				var aChildSpriteDef = anObjectDef.mSpriteDef;
				if(aChildSpriteDef != null) {
					var aChildSpriteInst = new GameFramework.resources.popanim.PopAnimSpriteInst();
					aChildSpriteInst.mParent = theSpriteInst;
					this.InitSpriteInst(aChildSpriteInst, aChildSpriteDef);
					anObjectInst.mSpriteInst = aChildSpriteInst;
				}
				theSpriteInst.mChildren.push(anObjectInst);
			}
		}
		if(theSpriteInst == this.mMainSpriteInst) {
			this.GetToFirstFrame();
		}
	},
	SetupSpriteInst : function GameFramework_resources_PopAnimResource$SetupSpriteInst(theName) {
		if(this.mMainSpriteInst == null) {
			return false;
		}
		if((this.mMainSpriteInst.mDef != null) && (theName == null)) {
			return true;
		}
		if(this.mMainAnimDef.mMainSpriteDef != null) {
			this.InitSpriteInst(this.mMainSpriteInst, this.mMainAnimDef.mMainSpriteDef);
			return true;
		}
		if(this.mMainAnimDef.mSpriteDefVector.length == 0) {
			return false;
		}
		var aName = theName;
		if(aName == null) {
			aName = 'main';
		}
		var aWantDef = null;
		for(var i = 0; i < (this.mMainAnimDef.mSpriteDefVector.length | 0); i++) {
			var aPopAnimSpriteDef = (this.mMainAnimDef.mSpriteDefVector[i]);
			if((aPopAnimSpriteDef.mName != null) && (aPopAnimSpriteDef.mName == aName)) {
				aWantDef = aPopAnimSpriteDef;
			}
		}
		if(aWantDef == null) {
			aWantDef = (this.mMainAnimDef.mSpriteDefVector[0]);
		}
		if(aWantDef != this.mMainSpriteInst.mDef) {
			if(this.mMainSpriteInst.mDef != null) {
				this.mMainSpriteInst = new GameFramework.resources.popanim.PopAnimSpriteInst();
			}
			this.InitSpriteInst(this.mMainSpriteInst, aWantDef);
			this.mTransDirty = true;
		}
		return true;
	},
	DrawParticleEffects : function GameFramework_resources_PopAnimResource$DrawParticleEffects(g, theSpriteInst, theTransform, theColor, front) {
		if((theSpriteInst.mParticleEffectVector != null) && (theSpriteInst.mParticleEffectVector.length > 0)) {
			for(var i = 0; i < (theSpriteInst.mParticleEffectVector.length | 0); i++) {
				var aParticleEffect = theSpriteInst.mParticleEffectVector[i];
				if(aParticleEffect.mTransform) {
					if(!aParticleEffect.mAttachEmitter) {
						var aTransform = new GameFramework.geom.Matrix();
						aTransform.translate(aParticleEffect.mEffect.mWidth / 2.0, aParticleEffect.mEffect.mHeight / 2.0);
						var aNewTransform = theTransform.clone();
						aNewTransform.concat(aTransform);
						aParticleEffect.mEffect.mDrawTransform = aNewTransform;
					} else {
					}
					aParticleEffect.mEffect.mColor = theColor;
				}
				if(aParticleEffect.mBehind == !front) {
					aParticleEffect.mEffect.Draw(g);
				}
			}
		}
	},
	ResetAnimHelper : function GameFramework_resources_PopAnimResource$ResetAnimHelper(theSpriteInst) {
		theSpriteInst.mFrameNum = 0;
		theSpriteInst.mFrameRepeats = 0;
		theSpriteInst.mDelayFrames = 0;
		theSpriteInst.mLastUpdated = -1;
		theSpriteInst.mOnNewFrame = true;
		if(theSpriteInst.mParticleEffectVector != null) {
			for(var i = 0; i < (theSpriteInst.mParticleEffectVector.length | 0); i++) {
				var aParticleEffect = theSpriteInst.mParticleEffectVector[i];
				aParticleEffect.mEffect.ResetAnim();
			}
		}
		for(var aSpriteIdx = 0; aSpriteIdx < (theSpriteInst.mChildren.length | 0); aSpriteIdx++) {
			var aPopAnimObjectInst = (theSpriteInst.mChildren[aSpriteIdx]);
			var aSpriteInst = (aPopAnimObjectInst.mSpriteInst);
			if(aSpriteInst != null) {
				this.ResetAnimHelper(aSpriteInst);
			}
		}
		this.mTransDirty = true;
	},
	ResetAnim : function GameFramework_resources_PopAnimResource$ResetAnim() {
		this.ResetAnimHelper(this.mMainSpriteInst);
		this.mAnimRunning = false;
		this.GetToFirstFrame();
		this.mBlendTicksTotal = 0;
		this.mBlendTicksCur = 0;
		this.mBlendDelay = 0;
	},
	GetToFirstFrame : function GameFramework_resources_PopAnimResource$GetToFirstFrame() {
		while((this.mMainSpriteInst.mDef != null) && (this.mMainSpriteInst.mFrameNum < this.mMainSpriteInst.mDef.mWorkAreaStart)) {
			var wasAnimRunning = this.mAnimRunning;
			var wasPaused = this.mPaused;
			this.mAnimRunning = true;
			this.mPaused = false;
			this.Update();
			this.mAnimRunning = wasAnimRunning;
			this.mPaused = wasPaused;
		}
	},
	PlayFrom : function GameFramework_resources_PopAnimResource$PlayFrom(theFrameNum, resetAnim) {
		if(!this.SetupSpriteInst(null)) {
			return false;
		}
		if(theFrameNum >= (this.mMainSpriteInst.mDef.mFrames.length | 0)) {
			this.mAnimRunning = false;
			return false;
		}
		if((this.mMainSpriteInst.mFrameNum != theFrameNum) && (resetAnim)) {
			this.ResetAnim();
		}
		this.mPaused = false;
		this.mAnimRunning = true;
		this.mMainSpriteInst.mDelayFrames = 0;
		this.mMainSpriteInst.mFrameNum = theFrameNum;
		this.mMainSpriteInst.mFrameRepeats = 0;
		if(this.mBlendDelay == 0) {
			this.DoFramesHit(this.mMainSpriteInst, null);
		}
		return true;
	},
	Play : function GameFramework_resources_PopAnimResource$Play(theFrameLabel, resetAnim) {
		if(theFrameLabel === undefined) {
			theFrameLabel = '';
		}
		if(resetAnim === undefined) {
			resetAnim = true;
		}
		this.mAnimRunning = false;
		if(this.mMainAnimDef.mMainSpriteDef != null) {
			if(!this.SetupSpriteInst(null)) {
				return false;
			}
			var aFrameNum = this.mMainAnimDef.mMainSpriteDef.GetLabelFrame(theFrameLabel);
			if(aFrameNum == -1) {
				return false;
			} else {
				this.mLastPlayedFrameLabel = theFrameLabel;
				return this.PlayFrom(aFrameNum, resetAnim);
			}
		} else {
			this.SetupSpriteInst(theFrameLabel);
			return this.PlayFrom(this.mMainSpriteInst.mDef.mWorkAreaStart, resetAnim);
		}
	},
	LoadSpriteDef : function GameFramework_resources_PopAnimResource$LoadSpriteDef(theBuffer, theSpriteDef) {
		var aCurObjectMap = [];
		if(this.mVersion >= 4) {
			this.mObjectNamePool.push(theBuffer.ReadAsciiString());
			theSpriteDef.mName = (this.mObjectNamePool[this.mObjectNamePool.length - 1]);
			theSpriteDef.mAnimRate = theBuffer.ReadInt() / 0x10000;
		} else {
			theSpriteDef.mAnimRate = this.mAnimRate;
		}
		var aNumFrames = theBuffer.ReadShort();
		if(this.mVersion >= 5) {
			theSpriteDef.mWorkAreaStart = theBuffer.ReadShort();
			theSpriteDef.mWorkAreaDuration = theBuffer.ReadShort();
		} else {
			theSpriteDef.mWorkAreaStart = 0;
			theSpriteDef.mWorkAreaDuration = aNumFrames - 1;
		}
		theSpriteDef.mWorkAreaDuration = ((Math.min(theSpriteDef.mWorkAreaStart + theSpriteDef.mWorkAreaDuration, aNumFrames - 1) - theSpriteDef.mWorkAreaStart) | 0);
		theSpriteDef.mFrames = [];
		for(var aFrameNum = 0; aFrameNum < aNumFrames; aFrameNum++) {
			var aFrame = new GameFramework.resources.popanim.PopAnimFrame();
			var aPopAnimObjectPos;
			var aFrameFlags = theBuffer.ReadByte();
			if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_REMOVES) != 0) {
				var aNumRemoves = theBuffer.ReadByte();
				if(aNumRemoves == 0xff) {
					aNumRemoves = theBuffer.ReadShort();
				}
				for(var aRemoveNum = 0; aRemoveNum < aNumRemoves; aRemoveNum++) {
					var anObjectId = theBuffer.ReadShort();
					if(anObjectId >= 0x7ff) {
						anObjectId = theBuffer.ReadInt();
					}
					aCurObjectMap[anObjectId] = null;
				}
			}
			if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_ADDS) != 0) {
				var aNumAdds = theBuffer.ReadByte();
				if(aNumAdds == 0xff) {
					aNumAdds = theBuffer.ReadShort();
				}
				for(var anAddNum = 0; anAddNum < aNumAdds; anAddNum++) {
					aPopAnimObjectPos = new GameFramework.resources.popanim.PopAnimObjectPos();
					aPopAnimObjectPos.mData = new GameFramework.resources.popanim.PopAnimObjectPosData();
					var anObjectNumAndType = (theBuffer.ReadShort() | 0);
					aPopAnimObjectPos.mColor = 0xffffffff;
					aPopAnimObjectPos.mAnimFrameNum = 0;
					aPopAnimObjectPos.mData.mObjectNum = (anObjectNumAndType & 0x7ff);
					if(aPopAnimObjectPos.mData.mObjectNum == 0x7ff) {
						aPopAnimObjectPos.mData.mObjectNum = theBuffer.ReadInt();
					}
					aPopAnimObjectPos.mData.mIsSprite = (anObjectNumAndType & 0x8000) != 0;
					aPopAnimObjectPos.mData.mIsAdditive = (anObjectNumAndType & 0x4000) != 0;
					aPopAnimObjectPos.mData.mResNum = theBuffer.ReadByte();
					aPopAnimObjectPos.mData.mHasSrcRect = false;
					aPopAnimObjectPos.mData.mTimeScale = 1.0;
					aPopAnimObjectPos.mData.mName = null;
					aPopAnimObjectPos.mTransform = new GameFramework.geom.Matrix();
					if((anObjectNumAndType & 0x2000) != 0) {
						aPopAnimObjectPos.mData.mPreloadFrames = theBuffer.ReadShort();
					} else {
						aPopAnimObjectPos.mData.mPreloadFrames = 0;
					}
					if((anObjectNumAndType & 0x1000) != 0) {
						this.mMainAnimDef.mObjectNamePool.push(theBuffer.ReadAsciiString());
						aPopAnimObjectPos.mData.mName = (this.mMainAnimDef.mObjectNamePool[this.mMainAnimDef.mObjectNamePool.length - 1]);
					}
					if((anObjectNumAndType & 0x800) != 0) {
						aPopAnimObjectPos.mData.mTimeScale = theBuffer.ReadInt() / 0x10000;
					}
					if(theSpriteDef.mObjectDefVector == null) {
						theSpriteDef.mObjectDefVector = [];
					}
					while(theSpriteDef.mObjectDefVector.length < aPopAnimObjectPos.mData.mObjectNum + 1) {
						theSpriteDef.mObjectDefVector.push(null);
					}
					if((theSpriteDef.mObjectDefVector[aPopAnimObjectPos.mData.mObjectNum]) == null) {
						theSpriteDef.mObjectDefVector[aPopAnimObjectPos.mData.mObjectNum] = new GameFramework.resources.popanim.PopAnimObjectDef();
					}
					((theSpriteDef.mObjectDefVector[aPopAnimObjectPos.mData.mObjectNum])).mName = aPopAnimObjectPos.mData.mName;
					if(aPopAnimObjectPos.mData.mIsSprite) {
						((theSpriteDef.mObjectDefVector[aPopAnimObjectPos.mData.mObjectNum])).mSpriteDef = (this.mMainAnimDef.mSpriteDefVector[aPopAnimObjectPos.mData.mResNum]);
					}
					while(aCurObjectMap.length <= aPopAnimObjectPos.mData.mObjectNum) {
						aCurObjectMap.push(null);
					}
					aCurObjectMap[aPopAnimObjectPos.mData.mObjectNum] = aPopAnimObjectPos;
				}
			}
			if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_MOVES) != 0) {
				var aNumMoves = theBuffer.ReadByte();
				if(aNumMoves == 0xff) {
					aNumMoves = theBuffer.ReadShort();
				}
				for(var aMoveNum = 0; aMoveNum < aNumMoves; aMoveNum++) {
					var aFlagsAndObjectNum = (theBuffer.ReadShort() | 0);
					var anObjectNum = aFlagsAndObjectNum & 0x3ff;
					if(anObjectNum == 0x3ff) {
						anObjectNum = theBuffer.ReadInt();
					}
					aPopAnimObjectPos = (aCurObjectMap[anObjectNum]);
					aPopAnimObjectPos = aPopAnimObjectPos.Duplicate();
					aCurObjectMap[anObjectNum] = aPopAnimObjectPos;
					aPopAnimObjectPos.mTransform = new GameFramework.geom.Matrix();
					if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_MATRIX) != 0) {
						aPopAnimObjectPos.mTransform.a = theBuffer.ReadInt() / 65536.0;
						aPopAnimObjectPos.mTransform.c = theBuffer.ReadInt() / 65536.0;
						aPopAnimObjectPos.mTransform.b = theBuffer.ReadInt() / 65536.0;
						aPopAnimObjectPos.mTransform.d = theBuffer.ReadInt() / 65536.0;
					} else if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_ROTATE) != 0) {
						var aRot = theBuffer.ReadShort() / 1000.0;
						aPopAnimObjectPos.mTransform.identity();
						aPopAnimObjectPos.mTransform.rotate(aRot);
					}
					var aMatrix = new GameFramework.geom.Matrix();
					if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_LONGCOORDS) != 0) {
						var i = theBuffer.ReadInt();
						aMatrix.tx = i / 20.0;
						aMatrix.ty = theBuffer.ReadInt() / 20.0;
					} else {
						aMatrix.tx = theBuffer.ReadShort() / 20.0;
						aMatrix.ty = theBuffer.ReadShort() / 20.0;
					}
					aPopAnimObjectPos.mTransform.concat(aMatrix);
					var hasSrcRect = (aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_SRCRECT) != 0;
					if(hasSrcRect != aPopAnimObjectPos.mData.mHasSrcRect) {
						aPopAnimObjectPos.mData.mHasSrcRect = hasSrcRect;
						if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_SRCRECT) != 0) {
							aPopAnimObjectPos.mData.mSrcX = ((theBuffer.ReadShort() / 20) | 0);
							aPopAnimObjectPos.mData.mSrcY = ((theBuffer.ReadShort() / 20) | 0);
							aPopAnimObjectPos.mData.mSrcWidth = ((theBuffer.ReadShort() / 20) | 0);
							aPopAnimObjectPos.mData.mSrcHeight = ((theBuffer.ReadShort() / 20) | 0);
						}
					}
					if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_COLOR) != 0) {
						var aRed = theBuffer.ReadByte();
						var aGreen = theBuffer.ReadByte();
						var aBlue = theBuffer.ReadByte();
						var anAlpha = theBuffer.ReadByte();
						aPopAnimObjectPos.mColor = (anAlpha << 24) | (aRed << 16) | (aGreen << 8) | aBlue;
					}
					if((aFlagsAndObjectNum & GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_ANIMFRAMENUM) != 0) {
						aPopAnimObjectPos.mAnimFrameNum = theBuffer.ReadShort();
					}
				}
			}
			if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_FRAME_NAME) != 0) {
				var aFrameName = theBuffer.ReadAsciiString();
				aFrameName = GameFramework.Utils.ToUpper(aFrameName);
				if(theSpriteDef.mLabels == null) {
					theSpriteDef.mLabels = {};
				}
				theSpriteDef.mLabels[aFrameName] = aFrameNum;
			}
			if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_STOP) != 0) {
				aFrame.mHasStop = true;
			}
			if((aFrameFlags & GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_COMMANDS) != 0) {
				var aNumCmds = theBuffer.ReadByte();
				aFrame.mCommandVector = [];
				for(var aCmdNum = 0; aCmdNum < aNumCmds; aCmdNum++) {
					var aPopAnimCommand = new GameFramework.resources.popanim.PopAnimCommand();
					aPopAnimCommand.mCommand = theBuffer.ReadAsciiString();
					aPopAnimCommand.mParam = theBuffer.ReadAsciiString();
					aFrame.mCommandVector.push(aPopAnimCommand);
				}
			}
			aFrame.mFrameObjectPosVector = [];
			var aCurObjectNum = 0;

			{
				var $enum2 = ss.IEnumerator.getEnumerator(aCurObjectMap);
				while($enum2.moveNext()) {
					var anObjectPos = $enum2.get_current();
					if(anObjectPos != null) {
						aFrame.mFrameObjectPosVector.push(anObjectPos);
						if(anObjectPos.mData.mPreloadFrames != 0) {
							anObjectPos.mData = anObjectPos.mData.Duplicate();
							anObjectPos.mData.mPreloadFrames = 0;
						}
					} else {
						aFrame.mFrameObjectPosVector.push(null);
					}
					++aCurObjectNum;
				}
			}
			theSpriteDef.mFrames.push(aFrame);
		}
		if(aNumFrames == 0) {
			theSpriteDef.mFrames.push(new GameFramework.resources.popanim.PopAnimFrame());
		}
	},
	SerializeRead : function GameFramework_resources_PopAnimResource$SerializeRead(theBuffer, theParentStreamer) {
		this.mMainAnimDef = new GameFramework.resources.popanim.PopAnimDef();
		this.mMainSpriteInst = new GameFramework.resources.popanim.PopAnimSpriteInst();
		this.mObjectNamePool = [];
		var aMagic = (theBuffer.ReadInt() | 0);
		this.mVersion = theBuffer.ReadInt();
		this.mAnimRate = theBuffer.ReadByte();
		this.mX = theBuffer.ReadShort() / 20.0;
		this.mY = theBuffer.ReadShort() / 20.0;
		this.mWidth = (theBuffer.ReadShort() | 0) / 20.0;
		this.mHeight = (theBuffer.ReadShort() | 0) / 20.0;
		this.mImageVector = [];
		var aNumImages = theBuffer.ReadShort();
		for(var anImageNum = 0; anImageNum < aNumImages; anImageNum++) {
			var anImage = new GameFramework.resources.popanim.PopAnimImage();
			var anOrigName = theBuffer.ReadAsciiString();
			anImage.mImageName = anOrigName;
			anImage.mCols = 1;
			anImage.mRows = 1;
			anImage.mOrigWidth = theBuffer.ReadShort();
			anImage.mOrigHeight = theBuffer.ReadShort();
			anImage.mTransform = new GameFramework.geom.Matrix();
			anImage.mTransform.a = theBuffer.ReadInt() / (65536.0 * 20.0);
			anImage.mTransform.b = theBuffer.ReadInt() / (65536.0 * 20.0);
			anImage.mTransform.c = theBuffer.ReadInt() / (65536.0 * 20.0);
			anImage.mTransform.d = theBuffer.ReadInt() / (65536.0 * 20.0);
			anImage.mTransform.tx = theBuffer.ReadShort() / 20.0;
			anImage.mTransform.ty = theBuffer.ReadShort() / 20.0;
			if((Math.abs(anImage.mTransform.a - 1.0) < 0.005) && (anImage.mTransform.b == 0.0) && (anImage.mTransform.c == 0.0) && (Math.abs(anImage.mTransform.d - 1.0) < 0.005) && (anImage.mTransform.tx == 0.0) && (anImage.mTransform.ty == 0.0)) {
				anImage.mTransform = null;
			}
			var aBarPos = anOrigName.indexOf(String.fromCharCode(124));
			if(aBarPos != -1) {
				var anId = anOrigName.substr(aBarPos + 1);
				anImage.mImageNames.push(anId);
				var aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImage(anId);
				aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(anImage, anImage.ImageLoaded));
				aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildCompleted));
				aResourceStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildFailed));
				theParentStreamer.mResourceCount++;
				GameFramework.BaseApp.mApp.mResourceManager.PrioritizeResourceStreamer(aResourceStreamer);
			} else {
				anImage.mImageNames.push(anOrigName);
			}
			this.mImageVector.push(anImage);
		}
		this.mMainAnimDef.mSpriteDefVector = [];
		var aNumSprites = theBuffer.ReadShort();
		var aSpriteIdx;
		for(aSpriteIdx = 0; aSpriteIdx < aNumSprites; aSpriteIdx++) {
			var aPopAnimSpriteDef = new GameFramework.resources.popanim.PopAnimSpriteDef();
			this.mMainAnimDef.mSpriteDefVector[aSpriteIdx] = aPopAnimSpriteDef;
		}
		for(aSpriteIdx = 0; aSpriteIdx < aNumSprites; aSpriteIdx++) {
			this.LoadSpriteDef(theBuffer, (this.mMainAnimDef.mSpriteDefVector[aSpriteIdx]));
		}
		var hasMainSpriteDef = theBuffer.ReadBoolean();
		if(hasMainSpriteDef) {
			this.mMainAnimDef.mMainSpriteDef = new GameFramework.resources.popanim.PopAnimSpriteDef();
			this.LoadSpriteDef(theBuffer, this.mMainAnimDef.mMainSpriteDef);
		}
		this.mLoaded = true;
	},
	UpdateParticles : function GameFramework_resources_PopAnimResource$UpdateParticles(theSpriteInst, theObjectPos) {
		if(theSpriteInst == null) {
			return;
		}
		if(theSpriteInst.mParticleEffectVector != null) {
			for(var i = 0; i < theSpriteInst.mParticleEffectVector.length; i++) {
				var aParticleEffect = theSpriteInst.mParticleEffectVector[i];
				var aVec = null;
				if(!aParticleEffect.mAttachEmitter) {
					aVec = theSpriteInst.mCurTransform.transformPoint(new GameFramework.geom.TPoint(aParticleEffect.mXOfs, aParticleEffect.mYOfs));
				}
				aParticleEffect.mEffect.mDrawTransform.identity();
				if(aVec != null) {
					aParticleEffect.mEffect.mDrawTransform.translate(aVec.x, aVec.y);
				}
				aParticleEffect.mEffect.mDrawTransform.scale(this.mDrawScale, this.mDrawScale);
				if((aParticleEffect.mTransform) && (theObjectPos != null)) {
					aParticleEffect.mEffect.mAnimSpeed = 1.0 / theObjectPos.mData.mTimeScale;
				}
				aParticleEffect.mEffect.Update();
				aParticleEffect.mLastUpdated = this.mUpdateCnt;
				if(!aParticleEffect.mEffect.IsActive()) {
					theSpriteInst.mParticleEffectVector.removeAt(i);
					i--;
				}
			}
		}
		var aFrame = theSpriteInst.mDef.mFrames[(theSpriteInst.mFrameNum | 0)];
		for(var anObjectPosIdx = 0; anObjectPosIdx < (aFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
			var anObjectPos = aFrame.mFrameObjectPosVector[anObjectPosIdx];
			if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
				var aChildSpriteInst = theSpriteInst.mChildren[anObjectPos.mData.mObjectNum].mSpriteInst;
				this.UpdateParticles(aChildSpriteInst, anObjectPos);
			}
		}
	},
	CleanParticles : function GameFramework_resources_PopAnimResource$CleanParticles(theSpriteInst, force) {
		if(force === undefined) {
			force = false;
		}
		if(theSpriteInst == null) {
			return;
		}
		if(theSpriteInst.mParticleEffectVector != null) {
			for(var i = 0; i < (theSpriteInst.mParticleEffectVector.length | 0); i++) {
				var aParticleEffect = theSpriteInst.mParticleEffectVector[i];
				if((aParticleEffect.mLastUpdated != this.mUpdateCnt) || (force)) {
					theSpriteInst.mParticleEffectVector.removeAt(i);
					i--;
				}
			}
		}
		for(var i_2 = 0; i_2 < (theSpriteInst.mChildren.length | 0); i_2++) {
			var aChildSpriteInst = theSpriteInst.mChildren[i_2].mSpriteInst;
			if(aChildSpriteInst != null) {
				this.CleanParticles(aChildSpriteInst, force);
			}
		}
	},
	HasParticles : function GameFramework_resources_PopAnimResource$HasParticles(theSpriteInst) {
		if(theSpriteInst == null) {
			return false;
		}
		if(theSpriteInst.mParticleEffectVector == null) {
			return false;
		}
		if(theSpriteInst.mParticleEffectVector.length != 0) {
			return true;
		}
		for(var i = 0; i < (theSpriteInst.mChildren.length | 0); i++) {
			var aChildSpriteInst = theSpriteInst.mChildren[i].mSpriteInst;
			if(aChildSpriteInst != null) {
				if(this.HasParticles(aChildSpriteInst)) {
					return true;
				}
			}
		}
		return false;
	},
	IsActive : function GameFramework_resources_PopAnimResource$IsActive() {
		if(this.mAnimRunning) {
			return true;
		}
		if(this.HasParticles(this.mMainSpriteInst)) {
			return true;
		}
		return false;
	},
	CalcObjectPos : function GameFramework_resources_PopAnimResource$CalcObjectPos(theSpriteInst, theObjectPosIdx, frozen, thePopAnimCalcObjectPosData) {
		if(this.mNextObjectPos == null) {
			this.mNextObjectPos = Array.Create(3, null, null, null, null);
		} else {
			this.mNextObjectPos[0] = null;
			this.mNextObjectPos[1] = null;
			this.mNextObjectPos[2] = null;
		}
		var iFrameNum = (theSpriteInst.mFrameNum | 0);
		var aFrame = theSpriteInst.mDef.mFrames[iFrameNum];
		var anObjectPos = (aFrame.mFrameObjectPosVector[theObjectPosIdx]);
		var anObjectInst = (theSpriteInst.mChildren[anObjectPos.mData.mObjectNum]);
		this.mOfsTab[0] = theSpriteInst.mDef.mFrames.length - 1;
		if((theSpriteInst == this.mMainSpriteInst) && (theSpriteInst.mFrameNum >= theSpriteInst.mDef.mWorkAreaStart)) {
			this.mOfsTab[0] = theSpriteInst.mDef.mWorkAreaDuration - 1;
		}
		var aCurTransform;
		var aCurColor;
		if((this.mInterpolate) && (!frozen)) {
			for(var anOfsIdx = 0; anOfsIdx < 3; anOfsIdx++) {
				var aNextFrame = theSpriteInst.mDef.mFrames[(iFrameNum + this.mOfsTab[anOfsIdx]) % theSpriteInst.mDef.mFrames.length];
				if((theSpriteInst == this.mMainSpriteInst) && (theSpriteInst.mFrameNum >= theSpriteInst.mDef.mWorkAreaStart)) {
					aNextFrame = theSpriteInst.mDef.mFrames[(iFrameNum + this.mOfsTab[anOfsIdx] - theSpriteInst.mDef.mWorkAreaStart) % (theSpriteInst.mDef.mWorkAreaDuration + 1) + theSpriteInst.mDef.mWorkAreaStart];
				} else {
					aNextFrame = theSpriteInst.mDef.mFrames[(iFrameNum + this.mOfsTab[anOfsIdx]) % theSpriteInst.mDef.mFrames.length];
				}
				if(aFrame.mHasStop) {
					aNextFrame = aFrame;
				}
				if((aNextFrame.mFrameObjectPosVector.length | 0) > theObjectPosIdx) {
					this.mNextObjectPos[anOfsIdx] = aNextFrame.mFrameObjectPosVector[theObjectPosIdx];
					if((this.mNextObjectPos[anOfsIdx] == null) || (this.mNextObjectPos[anOfsIdx].mData.mObjectNum != anObjectPos.mData.mObjectNum)) {
						this.mNextObjectPos[anOfsIdx] = null;
					}
				}
				if(this.mNextObjectPos[anOfsIdx] == null) {
					for(var aCheckObjectPosIdx = 0; aCheckObjectPosIdx < (aNextFrame.mFrameObjectPosVector.length | 0); aCheckObjectPosIdx++) {
						if((aNextFrame.mFrameObjectPosVector[aCheckObjectPosIdx] != null) && ((aNextFrame.mFrameObjectPosVector[aCheckObjectPosIdx])).mData.mObjectNum == anObjectPos.mData.mObjectNum) {
							this.mNextObjectPos[anOfsIdx] = aNextFrame.mFrameObjectPosVector[aCheckObjectPosIdx];
							break;
						}
					}
				}
			}
			if((this.mNextObjectPos[1] != null) && ((anObjectPos.mTransform != this.mNextObjectPos[1].mTransform) || (anObjectPos.mColor != this.mNextObjectPos[1].mColor))) {
				var anInterp = theSpriteInst.mFrameNum - (theSpriteInst.mFrameNum | 0);
				var aCur = anObjectPos.mTransform.transformPoint(this.mZeroPt);
				var aNext = this.mNextObjectPos[1].mTransform.transformPoint(this.mZeroPt);
				aCurTransform = GameFramework.Utils.LerpMatrix(anObjectPos.mTransform, this.mNextObjectPos[1].mTransform, anInterp);
				if(anObjectPos.mColor != this.mNextObjectPos[1].mColor) {
					aCurColor = GameFramework.Utils.LerpColor(anObjectPos.mColor, this.mNextObjectPos[1].mColor, anInterp);
				} else {
					aCurColor = anObjectPos.mColor;
				}
			} else {
				aCurTransform = anObjectPos.mTransform;
				aCurColor = anObjectPos.mColor;
			}
		} else {
			aCurTransform = anObjectPos.mTransform;
			aCurColor = anObjectPos.mColor;
		}
		var aMatrix = (anObjectInst.mTransform != null) ? anObjectInst.mTransform.clone() : new GameFramework.geom.Matrix();
		aMatrix.concat(aCurTransform);
		aCurTransform = aMatrix;
		if((anObjectInst.mIsBlending) && (this.mBlendTicksTotal != 0) && (theSpriteInst == this.mMainSpriteInst)) {
			var aBlendInterp = this.mBlendTicksCur / this.mBlendTicksTotal;
			aCurTransform = GameFramework.Utils.LerpMatrix(anObjectInst.mBlendSrcTransform, aCurTransform, aBlendInterp);
			aCurColor = GameFramework.Utils.LerpColor(anObjectInst.mBlendSrcColor, aCurColor, aBlendInterp);
		}
		thePopAnimCalcObjectPosData.mTransform = aCurTransform;
		thePopAnimCalcObjectPosData.mColor = aCurColor;
	},
	UpdateTransforms : function GameFramework_resources_PopAnimResource$UpdateTransforms(theSpriteInst, theTransform, theColor, parentFrozen) {
		if(theTransform != null) {
			theSpriteInst.mCurTransform = theTransform;
		} else {
			theSpriteInst.mCurTransform = this.mTransform;
		}
		theSpriteInst.mCurColor = theColor;
		var aFrame = theSpriteInst.mDef.mFrames[(theSpriteInst.mFrameNum | 0)];
		var aPopAnimCalcObjectPosData = new GameFramework.resources.PopAnimCalcObjectPosData();
		var aCurTransform;
		var aCurColor;
		var frozen = parentFrozen || (theSpriteInst.mDelayFrames > 0) || (aFrame.mHasStop);
		for(var anObjectPosIdx = 0; anObjectPosIdx < (aFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
			var anObjectPos = aFrame.mFrameObjectPosVector[anObjectPosIdx];
			if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
				this.CalcObjectPos(theSpriteInst, anObjectPosIdx, frozen, aPopAnimCalcObjectPosData);
				aCurTransform = aPopAnimCalcObjectPosData.mTransform;
				aCurColor = aPopAnimCalcObjectPosData.mColor;
				if(theTransform != null) {
					aCurTransform.concat(theTransform);
				}
				this.UpdateTransforms(theSpriteInst.mChildren[anObjectPos.mData.mObjectNum].mSpriteInst, aCurTransform, aCurColor, frozen);
			}
		}
		if(theSpriteInst.mParticleEffectVector != null) {
			for(var i = 0; i < (theSpriteInst.mParticleEffectVector.length | 0); i++) {
				var aParticleEffect = theSpriteInst.mParticleEffectVector[i];
				if(aParticleEffect.mAttachEmitter) {
					if(aParticleEffect.mTransform) {
						aParticleEffect.mEffect.mEmitterTransform.identity();
						aParticleEffect.mEffect.mEmitterTransform.translate(aParticleEffect.mEffect.mWidth / 2.0, aParticleEffect.mEffect.mHeight / 2.0);
						aParticleEffect.mEffect.mEmitterTransform.concat(theSpriteInst.mCurTransform);
					}
				}
			}
		}
	},
	IncSpriteInstFrame : function GameFramework_resources_PopAnimResource$IncSpriteInstFrame(theSpriteInst, theObjectPos, theFrac) {
		var aLastFrameNum = (theSpriteInst.mFrameNum | 0);
		var aLastFrame = theSpriteInst.mDef.mFrames[aLastFrameNum];
		if(aLastFrame.mHasStop) {
			return;
		}
		var aTimeScale = (theObjectPos != null) ? theObjectPos.mData.mTimeScale : 1.0;
		theSpriteInst.mFrameNum += theFrac * (theSpriteInst.mDef.mAnimRate / (1000.0 / GameFramework.BaseApp.mApp.mFrameTime)) / aTimeScale;
		if(theSpriteInst == this.mMainSpriteInst) {
			if(!theSpriteInst.mDef.mFrames[theSpriteInst.mDef.mFrames.length - 1].mHasStop) {
				if((theSpriteInst.mFrameNum | 0) >= theSpriteInst.mDef.mWorkAreaStart + theSpriteInst.mDef.mWorkAreaDuration + 1) {
					theSpriteInst.mFrameRepeats++;
					theSpriteInst.mFrameNum -= theSpriteInst.mDef.mWorkAreaDuration + 1;
				}
			} else {
				if((theSpriteInst.mFrameNum | 0) >= theSpriteInst.mDef.mWorkAreaStart + theSpriteInst.mDef.mWorkAreaDuration) {
					theSpriteInst.mOnNewFrame = true;
					theSpriteInst.mFrameNum = (theSpriteInst.mDef.mWorkAreaStart + theSpriteInst.mDef.mWorkAreaDuration);
					if(theSpriteInst.mDef.mWorkAreaDuration != 0) {
						this.mAnimRunning = false;
						var anEvent = new GameFramework.resources.popanim.PopAnimEvent(GameFramework.resources.popanim.PopAnimEvent.STOPPED);
						this.DispatchEvent(anEvent);
						return;
					} else {
						theSpriteInst.mFrameRepeats++;
					}
				}
			}
		} else if((theSpriteInst.mFrameNum | 0) >= theSpriteInst.mDef.mFrames.length) {
			theSpriteInst.mFrameRepeats++;
			theSpriteInst.mFrameNum -= theSpriteInst.mDef.mFrames.length;
		}
		theSpriteInst.mOnNewFrame = (theSpriteInst.mFrameNum | 0) != aLastFrameNum;
		if((theSpriteInst.mOnNewFrame) && (theSpriteInst.mDelayFrames > 0)) {
			theSpriteInst.mOnNewFrame = false;
			theSpriteInst.mFrameNum = aLastFrameNum;
			theSpriteInst.mDelayFrames--;
			return;
		}
		for(var anObjectPosIdx = 0; anObjectPosIdx < (aLastFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
			var anObjectPos = aLastFrame.mFrameObjectPosVector[anObjectPosIdx];
			if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
				var aSpriteInst = theSpriteInst.mChildren[anObjectPos.mData.mObjectNum].mSpriteInst;
				this.IncSpriteInstFrame(aSpriteInst, anObjectPos, theFrac / aTimeScale);
			}
		}
	},
	PrepSpriteInstFrame : function GameFramework_resources_PopAnimResource$PrepSpriteInstFrame(theSpriteInst, theObjectPos) {
		var aCurFrame = (theSpriteInst.mDef.mFrames[(theSpriteInst.mFrameNum | 0)]);
		if(theSpriteInst.mOnNewFrame) {
			this.FrameHit(theSpriteInst, aCurFrame, theObjectPos);
		}
		if(aCurFrame.mHasStop) {
			if(theSpriteInst == this.mMainSpriteInst) {
				this.mAnimRunning = false;
			}
			return;
		}
		for(var anObjectPosIdx = 0; anObjectPosIdx < (aCurFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
			var anObjectPos = (aCurFrame.mFrameObjectPosVector[anObjectPosIdx]);
			if((anObjectPos != null) && (anObjectPos.mData.mIsSprite)) {
				var aSpriteInst = ((theSpriteInst.mChildren[anObjectPos.mData.mObjectNum])).mSpriteInst;
				if(aSpriteInst != null) {
					var aPhysFrameNum = (theSpriteInst.mFrameNum | 0) + theSpriteInst.mFrameRepeats * (theSpriteInst.mDef.mFrames.length | 0);
					var aPhysLastFrameNum = aPhysFrameNum - 1;
					if((aSpriteInst.mLastUpdated != aPhysLastFrameNum) && (aSpriteInst.mLastUpdated != aPhysFrameNum)) {
						aSpriteInst.mFrameNum = 0;
						aSpriteInst.mFrameRepeats = 0;
						aSpriteInst.mDelayFrames = 0;
						aSpriteInst.mOnNewFrame = true;
					}
					this.PrepSpriteInstFrame(aSpriteInst, anObjectPos);
					aSpriteInst.mLastUpdated = aPhysFrameNum;
				}
			}
		}
	},
	AnimUpdate : function GameFramework_resources_PopAnimResource$AnimUpdate(theFrac) {
		if(!this.mAnimRunning) {
			return;
		}
		if(this.mBlendTicksTotal > 0) {
			this.mBlendTicksCur += theFrac;
			if(this.mBlendTicksCur >= this.mBlendTicksTotal) {
				this.mBlendTicksTotal = 0;
			}
		}
		this.mTransDirty = true;
		if(this.mBlendDelay > 0) {
			this.mBlendDelay -= theFrac;
			if(this.mBlendDelay <= 0) {
				this.mBlendDelay = 0;
				this.DoFramesHit(this.mMainSpriteInst, null);
			}
			return;
		} else {
			this.IncSpriteInstFrame(this.mMainSpriteInst, null, theFrac);
		}
		this.PrepSpriteInstFrame(this.mMainSpriteInst, null);
	},
	DrawSprite : function GameFramework_resources_PopAnimResource$DrawSprite(g, theSpriteInst, theTransform, theColor, additive, parentFrozen) {
		this.DrawParticleEffects(g, theSpriteInst, theTransform, theColor, false);
		var aFrame = theSpriteInst.mDef.mFrames[(theSpriteInst.mFrameNum | 0)];
		var aCurTransform;
		var aCurColor;
		var aChildSpriteInst;
		var aPopAnimCalcObjectPosData = new GameFramework.resources.PopAnimCalcObjectPosData();
		var frozen = parentFrozen || (theSpriteInst.mDelayFrames > 0) || (aFrame.mHasStop);
		for(var anObjectPosIdx = 0; anObjectPosIdx < (aFrame.mFrameObjectPosVector.length | 0); anObjectPosIdx++) {
			var anObjectPos = aFrame.mFrameObjectPosVector[anObjectPosIdx];
			if(anObjectPos == null) {
				continue;
			}
			var anObjectInst = theSpriteInst.mChildren[anObjectPos.mData.mObjectNum];
			if(anObjectPos.mData.mIsSprite) {
				aChildSpriteInst = theSpriteInst.mChildren[anObjectPos.mData.mObjectNum].mSpriteInst;
				aCurColor = aChildSpriteInst.mCurColor;
				aCurTransform = aChildSpriteInst.mCurTransform;
			} else {
				this.CalcObjectPos(theSpriteInst, anObjectPosIdx, frozen, aPopAnimCalcObjectPosData);
				aCurTransform = aPopAnimCalcObjectPosData.mTransform;
				aCurColor = aPopAnimCalcObjectPosData.mColor;
			}
			if(anObjectInst.mPredrawCallback != null) {
				aCurColor = anObjectInst.mPredrawCallback.invoke(g, theSpriteInst, anObjectInst, theTransform, aCurColor);
			}
			var aNewTransform;
			if((theTransform == null) && (this.mDrawScale != 1.0)) {
				var aTrans = this.mTransform.clone();
				aTrans.scale(this.mDrawScale, this.mDrawScale);
				aNewTransform = aCurTransform.clone();
				aNewTransform.concat(aTrans);
			} else if((theTransform == null) || (anObjectPos.mData.mIsSprite)) {
				aNewTransform = aCurTransform;
				if(this.mDrawScale != 1.0) {
					var aDrawScaleTrans = aNewTransform.clone();
					aDrawScaleTrans.scale(this.mDrawScale, this.mDrawScale);
					aNewTransform.concat(aDrawScaleTrans);
				}
				aNewTransform.concat(this.mTransform);
			} else {
				aNewTransform = aCurTransform.clone();
				aNewTransform.concat(theTransform);
			}
			var aNewColor = GameFramework.gfx.Color.Mult(GameFramework.gfx.Color.Mult(aCurColor, theColor), anObjectInst.mColorMult);
			if((aNewColor & 0xff000000) == 0) {
				continue;
			}
			if(anObjectPos.mData.mIsSprite) {
				aChildSpriteInst = theSpriteInst.mChildren[anObjectPos.mData.mObjectNum].mSpriteInst;
				this.DrawSprite(g, aChildSpriteInst, aNewTransform, aNewColor, anObjectPos.mData.mIsAdditive || additive, frozen);
			} else {
				for(var anImageDrawCount = 0; true; anImageDrawCount++) {
					var anImage = (this.mImageVector[anObjectPos.mData.mResNum]);
					var anImageTransform;
					if(anImage.mTransform != null) {
						anImageTransform = anImage.mTransform.clone();
						anImageTransform.concat(aNewTransform);
					} else {
						anImageTransform = aNewTransform;
					}
					if(aNewColor != 0xffffffff) {
						g.PushColor(aNewColor);
					}
					var aDrawImage;
					var aDrawFrame;
					g.PushMatrix(anImageTransform);
					if((anObjectPos.mAnimFrameNum == 0) || (anImage.mImages.length == 1)) {
						aDrawImage = (anImage.mImages[0]);
						aDrawFrame = anObjectPos.mAnimFrameNum;
					} else {
						aDrawImage = (anImage.mImages[anObjectPos.mAnimFrameNum]);
						aDrawFrame = 0;
					}
					aDrawImage.mAdditive = (anObjectPos.mData.mIsAdditive) || (anImage.mDrawMode == 1);
					g.DrawImageCel(aDrawImage, 0, 0, aDrawFrame);
					g.PopMatrix();
					if(aNewColor != 0xffffffff) {
						g.PopColor();
					}
					break;
				}
			}
		}
		this.DrawParticleEffects(g, theSpriteInst, theTransform, theColor, true);
	},
	Draw : function GameFramework_resources_PopAnimResource$Draw(g) {
		if(!this.mLoaded) {
			return;
		}
		if(!this.SetupSpriteInst(null)) {
			return;
		}
		if(this.mTransDirty) {
			this.UpdateTransforms(this.mMainSpriteInst, null, this.mColor, false);
			this.mTransDirty = false;
		}
		this.DrawSprite(g, this.mMainSpriteInst, null, this.mColor, this.mAdditive, false);
	},
	UpdateF : function GameFramework_resources_PopAnimResource$UpdateF(theFrac) {
		if(this.mPaused) {
			return;
		}
		this.AnimUpdate(theFrac);
	},
	Update : function GameFramework_resources_PopAnimResource$Update() {
		if(!this.mLoaded) {
			return;
		}
		GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
		if(!this.SetupSpriteInst(null)) {
			return;
		}
		this.UpdateF(this.mAnimSpeedScale);
		this.UpdateTransforms(this.mMainSpriteInst, null, this.mColor, false);
		this.mTransDirty = false;
		if(!this.mPaused) {
			this.UpdateParticles(this.mMainSpriteInst, null);
			this.CleanParticles(this.mMainSpriteInst);
		}
	}
}
GameFramework.resources.PopAnimResource.staticInit = function GameFramework_resources_PopAnimResource$staticInit() {
	GameFramework.resources.PopAnimResource.POPANIM_MAGIC = 0xbaf01954;
	GameFramework.resources.PopAnimResource.POPANIM_VERSION = 5;
	GameFramework.resources.PopAnimResource.POPANIM_STATE_VERSION = 1;
	GameFramework.resources.PopAnimResource.PI = 3.14159;
	GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_REMOVES = 0x1;
	GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_ADDS = 0x2;
	GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_MOVES = 0x4;
	GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_FRAME_NAME = 0x8;
	GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_STOP = 0x10;
	GameFramework.resources.PopAnimResource.FRAMEFLAGS_HAS_COMMANDS = 0x20;
	GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_SRCRECT = 0x8000;
	GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_ROTATE = 0x4000;
	GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_COLOR = 0x2000;
	GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_MATRIX = 0x1000;
	GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_LONGCOORDS = 0x800;
	GameFramework.resources.PopAnimResource.MOVEFLAGS_HAS_ANIMFRAMENUM = 0x400;
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.PopAnimResource.registerClass('GameFramework.resources.PopAnimResource', GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.PopAnimResource.staticInit();
});