GameFramework.resources.FontResource = function GameFramework_resources_FontResource() {
	this.mTags = [];
	this.mPixelSnappingOverride = GameFramework.resources.PixelSnapping.Default;
}
GameFramework.resources.FontResource.prototype = {
	mAscent : 0,
	mAscentPadding : 0,
	mHeight : 0,
	mLineSpacingOffset : 0,
	mInitialized : null,
	mDefaultPointSize : 0,
	mFontLayers : null,
	mLayerMap : null,
	mPointSize : 0,
	mScale : 1.0,
	mForceScaledImagesWhite : null,
	mActivateAllLayers : null,
	mTags : null,
	mActiveLayers : null,
	mActiveListValid : false,
	mPixelSnappingOverride : null,
	SetPixelSnappingOverride : function GameFramework_resources_FontResource$SetPixelSnappingOverride(thePixelSnapping) {
		this.mPixelSnappingOverride = thePixelSnapping;
	},
	Duplicate : function GameFramework_resources_FontResource$Duplicate() {
		var aFontResource = new GameFramework.resources.FontResource();
		aFontResource.mAscent = this.mAscent;
		aFontResource.mAscentPadding = this.mAscentPadding;
		aFontResource.mLineSpacingOffset = this.mLineSpacingOffset;
		aFontResource.mInitialized = this.mInitialized;
		aFontResource.mDefaultPointSize = this.mDefaultPointSize;
		aFontResource.mFontLayers = this.mFontLayers;
		aFontResource.mLayerMap = this.mLayerMap;
		aFontResource.mPointSize = this.mPointSize;
		aFontResource.mScale = this.mScale;
		aFontResource.mForceScaledImagesWhite = this.mForceScaledImagesWhite;
		aFontResource.mActivateAllLayers = this.mActivateAllLayers;

		{
			var $enum1 = ss.IEnumerator.getEnumerator(this.mTags);
			while($enum1.moveNext()) {
				var aTag = $enum1.get_current();
				aFontResource.mTags.push(aTag);
			}
		}
		aFontResource.mActiveLayers = [];

		{
			var $enum2 = ss.IEnumerator.getEnumerator(this.mFontLayers);
			while($enum2.moveNext()) {
				var aFontLayer = $enum2.get_current();
				aFontResource.mActiveLayers.push(aFontLayer);
			}
		}
		aFontResource.mActiveListValid = this.mActiveListValid;
		return aFontResource;
	},
	SerializeRead : function GameFramework_resources_FontResource$SerializeRead(theBuffer, theParentStreamer) {
		this.mFontLayers = [];
		this.mLayerMap = {};
		var aStrLen;
		var i1 = theBuffer.ReadInt();
		var i2 = theBuffer.ReadInt();
		var i3 = theBuffer.ReadInt();
		var i4 = theBuffer.ReadInt();
		this.mAscent = theBuffer.ReadInt();
		this.mAscentPadding = theBuffer.ReadInt();
		this.mHeight = theBuffer.ReadInt();
		this.mLineSpacingOffset = theBuffer.ReadInt();
		this.mInitialized = theBuffer.ReadBoolean();
		this.mDefaultPointSize = theBuffer.ReadInt();
		var aCharMapSize = theBuffer.ReadInt();
		for(var aCharMapIdx = 0; aCharMapIdx < aCharMapSize; aCharMapIdx++) {
			var aCharFrom = theBuffer.ReadShort();
			var aCharTo = theBuffer.ReadShort();
		}
		var aNumFontLayers = theBuffer.ReadInt();
		for(var aLayerIdx = 0; aLayerIdx < aNumFontLayers; aLayerIdx++) {
			var aFontLayer = new GameFramework.resources.FontLayer();
			aStrLen = theBuffer.ReadInt();
			aFontLayer.mLayerName = theBuffer.ReadAsciiBytes(aStrLen);
			var aTagIdx;
			var aNumTags = theBuffer.ReadInt();
			var aTag;
			for(aTagIdx = 0; aTagIdx < aNumTags; aTagIdx++) {
				aStrLen = theBuffer.ReadInt();
				aTag = theBuffer.ReadAsciiBytes(aStrLen);
				aFontLayer.mRequiredTags.push(aTag);
			}
			aNumTags = theBuffer.ReadInt();
			for(aTagIdx = 0; aTagIdx < aNumTags; aTagIdx++) {
				aStrLen = theBuffer.ReadInt();
				aTag = theBuffer.ReadAsciiBytes(aStrLen);
				aFontLayer.mExcludedTags.push(aTag);
			}
			var aKerningDataSize = theBuffer.ReadInt();
			aFontLayer.mKerningData = Array.Create(aKerningDataSize, 0);
			for(var aKernIdx = 0; aKernIdx < aKerningDataSize; aKernIdx++) {
				aFontLayer.mKerningData[aKernIdx] = theBuffer.ReadInt();
			}
			var aCharDataSize = theBuffer.ReadInt();
			for(var i = 0; i < aCharDataSize; i++) {
				var aFontCharData = new GameFramework.resources.FontCharData();
				var aChar = (theBuffer.ReadShort() | 0);
				aFontCharData.mChar = aChar;
				aFontCharData.mRectX = theBuffer.ReadInt();
				aFontCharData.mRectY = theBuffer.ReadInt();
				aFontCharData.mRectWidth = theBuffer.ReadInt();
				aFontCharData.mRectHeight = theBuffer.ReadInt();
				aFontCharData.mOffsetX = theBuffer.ReadInt();
				aFontCharData.mOffsetY = theBuffer.ReadInt();
				aFontCharData.mKerningFirst = theBuffer.ReadShort();
				aFontCharData.mKerningCount = theBuffer.ReadShort();
				aFontCharData.mWidth = theBuffer.ReadInt();
				aFontCharData.mOrder = theBuffer.ReadInt();
				aFontLayer.mCharHashtable[aChar] = aFontCharData;
			}
			var r = (theBuffer.ReadInt() | 0);
			var g = (theBuffer.ReadInt() | 0);
			var b = (theBuffer.ReadInt() | 0);
			var a = (theBuffer.ReadInt() | 0);
			aFontLayer.mColorMult = (a << 24) | (r << 16) | (g << 8) | b;
			r = (theBuffer.ReadInt() | 0);
			g = (theBuffer.ReadInt() | 0);
			b = (theBuffer.ReadInt() | 0);
			a = (theBuffer.ReadInt() | 0);
			aFontLayer.mColorAdd = (a << 24) | (r << 16) | (g << 8) | b;
			var aFileNameLen = theBuffer.ReadInt();
			var aFileName = theBuffer.ReadAsciiBytes(aFileNameLen);
			aFileName = GameFramework.Utils.StringReplaceChar(aFileName, 92, 47);
			var anId = GameFramework.BaseApp.mApp.mResourceManager.PathToId(aFileName);
			var aResourceStreamer;
			if(anId != null) {
				aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImage(anId);
			} else {
				aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImageFromPath(aFileName);
			}
			GameFramework.BaseApp.mApp.mResourceManager.PrioritizeResourceStreamer(aResourceStreamer);
			aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(aFontLayer, aFontLayer.ImageLoaded));
			if(theParentStreamer != null) {
				theParentStreamer.mResourceCount++;
				aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildCompleted));
				aResourceStreamer.AddEventListener(GameFramework.events.IOErrorEvent.IO_ERROR, ss.Delegate.create(theParentStreamer, theParentStreamer.ChildFailed));
			}
			aFontLayer.mDrawMode = theBuffer.ReadInt();
			aFontLayer.mOfsX = theBuffer.ReadInt();
			aFontLayer.mOfsY = theBuffer.ReadInt();
			aFontLayer.mSpacing = theBuffer.ReadInt();
			aFontLayer.mMinPointSize = theBuffer.ReadInt();
			aFontLayer.mMaxPointSize = theBuffer.ReadInt();
			aFontLayer.mPointSize = theBuffer.ReadInt();
			aFontLayer.mAscent = theBuffer.ReadInt();
			aFontLayer.mAscentPadding = theBuffer.ReadInt();
			aFontLayer.mHeight = theBuffer.ReadInt();
			aFontLayer.mDefaultHeight = theBuffer.ReadInt();
			aFontLayer.mLineSpacingOffset = theBuffer.ReadInt();
			aFontLayer.mBaseOrder = theBuffer.ReadInt();
			this.mFontLayers.push(aFontLayer);
			this.mLayerMap[aFontLayer.mLayerName] = aFontLayer;
		}
		aStrLen = theBuffer.ReadInt();
		var aSourceFile = theBuffer.ReadAsciiBytes(aStrLen);
		aStrLen = theBuffer.ReadInt();
		var aFontErrorHeader = theBuffer.ReadAsciiBytes(aStrLen);
		this.mPointSize = theBuffer.ReadInt();
		this.mScale = 1.0;
		theBuffer.ReadInt();
		theBuffer.ReadInt();
		this.mForceScaledImagesWhite = theBuffer.ReadBoolean();
		this.mActivateAllLayers = theBuffer.ReadBoolean();
		this.mActiveListValid = false;
	},
	GetPhysAscent : function GameFramework_resources_FontResource$GetPhysAscent() {
		this.Prepare();
		var aMinY = 0;

		{
			var $enum3 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
			while($enum3.moveNext()) {
				var aFontLayer = $enum3.get_current();
				var aCharData = (aFontLayer.mCharHashtable[65]);
				if((aCharData != null) && (aCharData.mRectHeight > 0)) {
					aMinY = Math.min(aMinY, aFontLayer.mOfsY + aCharData.mOffsetY - this.mAscent);
				}
			}
		}
		return -aMinY;
	},
	GetPhysDescent : function GameFramework_resources_FontResource$GetPhysDescent() {
		this.Prepare();
		var aMaxY = 0;

		{
			var $enum4 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
			while($enum4.moveNext()) {
				var aFontLayer = $enum4.get_current();
				var aCharData = (aFontLayer.mCharHashtable[65]);
				if(aCharData != null) {
					aMaxY = Math.max(aMaxY, aFontLayer.mOfsY + aCharData.mOffsetY - this.mAscent + aCharData.mRectHeight);
				}
			}
		}
		return aMaxY;
	},
	CharWidthKernPhys : function GameFramework_resources_FontResource$CharWidthKernPhys(theChar, theNextChar) {
		this.Prepare();
		var anOrderIdx = 0;
		var aCurXPos = 0;
		var aMaxXPos = 0;

		{
			var $enum5 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
			while($enum5.moveNext()) {
				var aFontLayer = $enum5.get_current();
				var aColor = aFontLayer.mColorMult;
				var aLayerXPos = aCurXPos;
				var aCharData = (aFontLayer.mCharHashtable[theChar]);
				if(aCharData != null) {
					var aCharWidth = aCharData.mWidth;
					var aSpacing;
					if(theNextChar != 0) {
						aSpacing = aFontLayer.mSpacing;
						if(aCharData.mKerningCount > 0) {
							var aKernCount = aCharData.mKerningCount;
							var aKernIdx = aCharData.mKerningFirst;
							for(var i = 0; i < aKernCount; i++) {
								if((aFontLayer.mKerningData[aKernIdx] & 0xffff) == theNextChar) {
									aSpacing += aFontLayer.mKerningData[aKernIdx] >> 16;
								}
								aKernIdx++;
							}
						}
					} else {
						aSpacing = 0;
					}
					aLayerXPos += aSpacing + aCharData.mWidth;
				}
				if(aLayerXPos > aMaxXPos) {
					aMaxXPos = aLayerXPos;
				}
				anOrderIdx++;
			}
		}
		aCurXPos = aMaxXPos;
		return aCurXPos;
	},
	CharWidthKern : function GameFramework_resources_FontResource$CharWidthKern(theChar, theNextChar) {
		return this.CharWidthKernPhys(theChar, theNextChar) / GameFramework.BaseApp.mApp.mGraphics.mScale;
	},
	StringWidthPhys : function GameFramework_resources_FontResource$StringWidthPhys(theString, theParseColorizers) {
		if(theParseColorizers === undefined) {
			theParseColorizers = true;
		}
		this.Prepare();
		var anOrderIdx = 0;
		var aCurXPos = 0;
		for(var aCharIdx = 0; aCharIdx < theString.length; aCharIdx++) {
			var aChar = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx);
			if(aChar == 94 && theParseColorizers) {
				if(aCharIdx + 1 < theString.length) {
					if(theString.charCodeAt(aCharIdx + 1) == 94) {
						aCharIdx++;
					} else {
						aCharIdx += 8;
						continue;
					}
				}
			}
			var aNextChar = 0;
			if(aCharIdx < theString.length - 1) {
				aNextChar = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx + 1);
			}
			var aMaxXPos = 0;

			{
				var $enum6 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
				while($enum6.moveNext()) {
					var aFontLayer = $enum6.get_current();
					var aColor = aFontLayer.mColorMult;
					var aLayerXPos = aCurXPos;
					var aCharData = (aFontLayer.mCharHashtable[aChar]);
					if(aCharData != null) {
						var aCharWidth = aCharData.mWidth;
						var aSpacing;
						if(aNextChar != 0) {
							aSpacing = aFontLayer.mSpacing;
							if(aCharData.mKerningCount > 0) {
								var aKernCount = aCharData.mKerningCount;
								var aKernIdx = aCharData.mKerningFirst;
								for(var i = 0; i < aKernCount; i++) {
									if((aFontLayer.mKerningData[aKernIdx] & 0xffff) == aNextChar) {
										aSpacing += aFontLayer.mKerningData[aKernIdx] >> 16;
									}
									aKernIdx++;
								}
							}
						} else {
							aSpacing = 0;
						}
						aLayerXPos += aSpacing + aCharData.mWidth;
					}
					if(aLayerXPos > aMaxXPos) {
						aMaxXPos = aLayerXPos;
					}
					anOrderIdx++;
				}
			}
			aCurXPos = aMaxXPos;
		}
		return aCurXPos;
	},
	StringWidth : function GameFramework_resources_FontResource$StringWidth(theString, theParseColorizers) {
		if(theParseColorizers === undefined) {
			theParseColorizers = true;
		}
		return this.StringWidthPhys(theString, theParseColorizers) / GameFramework.BaseApp.mApp.mGraphics.mScale;
	},
	GetAscent : function GameFramework_resources_FontResource$GetAscent() {
		return this.mAscent / GameFramework.BaseApp.mApp.mGraphics.mScale;
	},
	GetAscentPadding : function GameFramework_resources_FontResource$GetAscentPadding() {
		return this.mAscentPadding / GameFramework.BaseApp.mApp.mGraphics.mScale;
	},
	GetHeight : function GameFramework_resources_FontResource$GetHeight() {
		this.Prepare();
		return this.mHeight / GameFramework.BaseApp.mApp.mGraphics.mScale;
	},
	GetLineSpacing : function GameFramework_resources_FontResource$GetLineSpacing() {
		return (this.mHeight + this.mLineSpacingOffset) / GameFramework.BaseApp.mApp.mGraphics.mScale;
	},
	GenerateActiveFontLayers : function GameFramework_resources_FontResource$GenerateActiveFontLayers() {
		this.mActiveLayers = [];
		this.mAscent = 0;
		this.mAscentPadding = 0;
		this.mHeight = 0;
		this.mLineSpacingOffset = 0;
		var firstLayer = true;

		{
			var $enum7 = ss.IEnumerator.getEnumerator(this.mFontLayers);
			while($enum7.moveNext()) {
				var aFontLayer = $enum7.get_current();
				var active = true;

				{
					var $enum8 = ss.IEnumerator.getEnumerator(aFontLayer.mRequiredTags);
					while($enum8.moveNext()) {
						var aReqTag = $enum8.get_current();
						if(this.mTags.indexOf(aReqTag) == -1) {
							active = false;
						}
					}
				}

				{
					var $enum9 = ss.IEnumerator.getEnumerator(aFontLayer.mExcludedTags);
					while($enum9.moveNext()) {
						var aExTag = $enum9.get_current();
						if(this.mTags.indexOf(aExTag) != -1) {
							active = false;
						}
					}
				}
				if(this.mActivateAllLayers) {
					active = true;
				}
				if(active) {
					this.mActiveLayers.push(aFontLayer);
					if(aFontLayer.mAscent > this.mAscent) {
						this.mAscent = aFontLayer.mAscent;
					}
					if(aFontLayer.mHeight > this.mHeight) {
						this.mAscent = aFontLayer.mAscent;
					}
					if((firstLayer) || (aFontLayer.mAscentPadding > this.mAscentPadding)) {
						this.mAscentPadding = aFontLayer.mAscentPadding;
					}
					if((firstLayer) || (aFontLayer.mLineSpacingOffset > this.mLineSpacingOffset)) {
						this.mAscentPadding = aFontLayer.mLineSpacingOffset;
					}
					if((firstLayer) || (aFontLayer.mHeight > this.mHeight)) {
						this.mHeight = aFontLayer.mHeight;
					}
					firstLayer = false;
				}
			}
		}
	},
	Prepare : function GameFramework_resources_FontResource$Prepare() {
		if(!this.mActiveListValid) {
			this.GenerateActiveFontLayers();
			this.mActiveListValid = true;
		}
	},
	AddTag : function GameFramework_resources_FontResource$AddTag(theTag) {
		this.mTags.push(theTag);
		this.mActiveListValid = false;
	},
	RemoveTag : function GameFramework_resources_FontResource$RemoveTag(theTag) {
		this.mTags.removeAt(this.mTags.indexOf(theTag));
		this.mActiveListValid = false;
	},
	PushLayerColor : function GameFramework_resources_FontResource$PushLayerColor(theLayer, theColor) {
		var aLayer = (this.mLayerMap[theLayer]);
		aLayer.PushColor(theColor);
		aLayer = (this.mLayerMap[theLayer + '__MOD']);
		if(aLayer != null) {
			aLayer.PushColor(theColor);
		}
	},
	PopLayerColor : function GameFramework_resources_FontResource$PopLayerColor(theLayer) {
		var aLayer = (this.mLayerMap[theLayer]);
		aLayer.PopColor();
		aLayer = (this.mLayerMap[theLayer + '__MOD']);
		if(aLayer != null) {
			aLayer.PopColor();
		}
	},
	Draw : function GameFramework_resources_FontResource$Draw(g, theString, theX, theY, theParseColorizers) {
		if(theParseColorizers === undefined) {
			theParseColorizers = true;
		}
		var aString = '';
		var aXOffset = 0.0;
		for(var aCharIdx = 0; aCharIdx < theString.length; aCharIdx++) {
			var aChar = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx);
			if((theString.charCodeAt(aCharIdx) == 94) && theParseColorizers) {
				if(aCharIdx + 1 < theString.length && theString.charCodeAt(aCharIdx + 1) == 94) {
					aString += String.fromCharCode(94);
					aCharIdx++;
				} else if(aCharIdx > theString.length - 8) {
					break;
				} else {
					this.DrawUncolorized(g, aString, theX + aXOffset, theY);
					var aColor = 0;
					if(theString.charCodeAt(aCharIdx + 1) == 111) {
						if(theString.substr(aCharIdx + 1, 'oldclr'.length) == 'oldclr') {
							g.UndoSetColor();
						}
					} else {
						for(var aDigitNum = 0; aDigitNum < 6; aDigitNum++) {
							var aDigitChar = theString.charCodeAt(aCharIdx + aDigitNum + 1);
							var aVal = 0;
							if((aDigitChar >= 48) && (aDigitChar <= 57)) {
								aVal = ((aDigitChar - 48) | 0);
							} else if((aDigitChar >= 65) && (aDigitChar <= 70)) {
								aVal = (((aDigitChar - 65) + 10) | 0);
							} else if((aDigitChar >= 97) && (aDigitChar <= 102)) {
								aVal = (((aDigitChar - 97) + 10) | 0);
							}
							aColor += (aVal << ((5 - aDigitNum) * 4));
						}
						g.SetColor(GameFramework.gfx.Color.RGBAToInt((((aColor >>> 16) & 0xff) | 0), (((aColor >>> 8) & 0xff) | 0), (((aColor) & 0xff) | 0), 255));
					}
					aCharIdx += 7;
					aXOffset += this.StringWidth(aString);
					aString = '';
				}
			} else {
				aString += String.fromCharCode(theString.charCodeAt(aCharIdx));
			}
		}
		this.DrawUncolorized(g, aString, theX + aXOffset, theY);
	},
	DrawUncolorized : function GameFramework_resources_FontResource$DrawUncolorized(g, theString, theX, theY) {
		this.Prepare();
		if(this.mActiveLayers.length > 2) {
			var aDrawList = {};
			var aDrawOrderArray = [];
			var anOrderIdx = 0;
			var aCurXPos = 0;
			for(var aCharIdx = 0; aCharIdx < theString.length; aCharIdx++) {
				var aChar = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx);
				var aNextChar = 0;
				if(aCharIdx < theString.length - 1) {
					aNextChar = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx + 1);
				}
				var aMaxXPos = 0;

				{
					var $enum10 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
					while($enum10.moveNext()) {
						var aFontLayer = $enum10.get_current();
						var aColor = aFontLayer.mColorMult;
						var aLayerXPos = aCurXPos;
						var aCharData = aFontLayer.mCharHashtable[aChar];
						if(aCharData != null) {
							var aDrawOrder = ((aFontLayer.mBaseOrder + aCharData.mOrder) << 16) + anOrderIdx;
							var aFontDrawCmd;
							if(GameFramework.resources.FontResource.mDrawCmdPool.length == 0) {
								aFontDrawCmd = new GameFramework.resources.FontDrawCmd();
							} else {
								aFontDrawCmd = GameFramework.resources.FontResource.mDrawCmdPool.pop();
							}
							aFontDrawCmd.mFontLayer = aFontLayer;
							aFontDrawCmd.mCharData = aCharData;
							aFontDrawCmd.mXOfs = aLayerXPos + aFontLayer.mOfsX + aCharData.mOffsetX;
							aFontDrawCmd.mYOfs = -(aFontLayer.mAscent - aFontLayer.mOfsY - aCharData.mOffsetY);
							var aCharWidth = aCharData.mWidth;
							var aSpacing;
							if(aNextChar != 0) {
								aSpacing = aFontLayer.mSpacing;
								if(aCharData.mKerningCount > 0) {
									var aKernCount = aCharData.mKerningCount;
									var aKernIdx = aCharData.mKerningFirst;
									for(var i = 0; i < aKernCount; i++) {
										if((aFontLayer.mKerningData[aKernIdx] & 0xffff) == aNextChar) {
											aSpacing += aFontLayer.mKerningData[aKernIdx] >> 16;
										}
										aKernIdx++;
									}
								}
							} else {
								aSpacing = 0;
							}
							aDrawOrderArray.push(aDrawOrder);
							aDrawList[aDrawOrder] = aFontDrawCmd;
							aLayerXPos += aSpacing + aCharData.mWidth;
						}
						if(aLayerXPos > aMaxXPos) {
							aMaxXPos = aLayerXPos;
						}
						anOrderIdx++;
					}
				}
				aCurXPos = aMaxXPos;
			}
			if(aDrawOrderArray.length == 0) {
				return;
			}
			GameFramework.Utils.SortIntVector(aDrawOrderArray);
			var aLastColor = 0xffffffff;
			var aMatrix = g.mTempMatrix;
			aMatrix.identity();
			aMatrix.translate(theX, theY);
			aMatrix.concat(g.mMatrix);
			var aLastX = 0;
			var aLastY = 0;
			var aScaleInv = 1.0 / GameFramework.BaseApp.mApp.mGraphics.mScale;

			{
				var $srcArray11 = aDrawOrderArray;
				for(var $enum11 = 0; $enum11 < $srcArray11.length; $enum11++) {
					var aCurDrawOrder = $srcArray11[$enum11];
					var aDrawCmd = aDrawList[aCurDrawOrder];
					var aDrawCharData = aDrawCmd.mCharData;
					if(aDrawCmd.mFontLayer.mColorMult != aLastColor) {
						if(aLastColor != 0xffffffff) {
							g.PopColor();
						}
						aLastColor = aDrawCmd.mFontLayer.mColorMult;
						if(aLastColor != 0xffffffff) {
							g.PushColor(aLastColor);
						}
					}
					var aXDelta = (aDrawCmd.mXOfs * aScaleInv) - aLastX;
					var aYDelta = (aDrawCmd.mYOfs * aScaleInv) - aLastY;
					aMatrix.tx += aXDelta * aMatrix.a + aYDelta * aMatrix.b;
					aMatrix.ty += aXDelta * aMatrix.c + aYDelta * aMatrix.d;
					if(this.mPixelSnappingOverride != GameFramework.resources.PixelSnapping.Default) {
						var anOldPixelSnapping = aDrawCharData.mImageInst.mPixelSnapping;
						aDrawCharData.mImageInst.mPixelSnapping = this.mPixelSnappingOverride;
						aDrawCharData.mImageInst.DrawEx(g, aMatrix, 0, 0, 0);
						aDrawCharData.mImageInst.mPixelSnapping = anOldPixelSnapping;
					} else {
						aDrawCharData.mImageInst.DrawEx(g, aMatrix, 0, 0, 0);
					}
					aLastX += aXDelta;
					aLastY += aYDelta;
				}
			}
			if(aLastColor != 0xffffffff) {
				g.PopColor();
			}
		} else {
			var anOrderIdx_2 = 0;
			var aCurXPos_2 = 0;
			var aLastColor_2 = 0xffffffff;
			var aScaleInv_2 = 1.0 / GameFramework.BaseApp.mApp.mGraphics.mScale;
			var aMatrix_2 = g.mReserveMatrix;
			aMatrix_2.identity();
			aMatrix_2.translate(theX, theY);
			aMatrix_2.concat(g.mMatrix);
			var aLastX_2 = 0;
			var aLastY_2 = 0;
			for(var aCharIdx_2 = 0; aCharIdx_2 < theString.length; aCharIdx_2++) {
				var aChar_2 = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx_2);
				var aNextChar_2 = 0;
				if(aCharIdx_2 < theString.length - 1) {
					aNextChar_2 = GameFramework.Utils.GetCharCodeAt(theString, aCharIdx_2 + 1);
				}
				var aMaxXPos_2 = 0;

				{
					var $enum12 = ss.IEnumerator.getEnumerator(this.mActiveLayers);
					while($enum12.moveNext()) {
						var aFontLayer_2 = $enum12.get_current();
						var aColor_2 = aFontLayer_2.mColorMult;
						var aLayerXPos_2 = aCurXPos_2;
						var aCharData_2 = aFontLayer_2.mCharHashtable[aChar_2];
						if(aCharData_2 != null) {
							var aDrawOrder_2 = ((aFontLayer_2.mBaseOrder + aCharData_2.mOrder) << 16) + anOrderIdx_2;
							var aXOfs = aLayerXPos_2 + aFontLayer_2.mOfsX + aCharData_2.mOffsetX;
							var aYOfs = -(aFontLayer_2.mAscent - aFontLayer_2.mOfsY - aCharData_2.mOffsetY);
							if(aFontLayer_2.mColorMult != aLastColor_2) {
								if(aLastColor_2 != 0xffffffff) {
									g.PopColor();
								}
								aLastColor_2 = aFontLayer_2.mColorMult;
								if(aLastColor_2 != 0xffffffff) {
									g.PushColor(aLastColor_2);
								}
							}
							var aXDelta_2 = (aXOfs * aScaleInv_2) - aLastX_2;
							var aYDelta_2 = (aYOfs * aScaleInv_2) - aLastY_2;
							aMatrix_2.tx += aXDelta_2 * aMatrix_2.a + aYDelta_2 * aMatrix_2.b;
							aMatrix_2.ty += aXDelta_2 * aMatrix_2.c + aYDelta_2 * aMatrix_2.d;
							aCharData_2.mImageInst.DrawEx(g, aMatrix_2, 0, 0, 0);
							aLastX_2 += aXDelta_2;
							aLastY_2 += aYDelta_2;
							var aCharWidth_2 = aCharData_2.mWidth;
							var aSpacing_2;
							if(aNextChar_2 != 0) {
								aSpacing_2 = aFontLayer_2.mSpacing;
								if(aCharData_2.mKerningCount > 0) {
									var aKernCount_2 = aCharData_2.mKerningCount;
									var aKernIdx_2 = aCharData_2.mKerningFirst;
									for(var i_2 = 0; i_2 < aKernCount_2; i_2++) {
										if((aFontLayer_2.mKerningData[aKernIdx_2] & 0xffff) == aNextChar_2) {
											aSpacing_2 += aFontLayer_2.mKerningData[aKernIdx_2] >> 16;
										}
										aKernIdx_2++;
									}
								}
							} else {
								aSpacing_2 = 0;
							}
							aLayerXPos_2 += aSpacing_2 + aCharData_2.mWidth;
						}
						if(aLayerXPos_2 > aMaxXPos_2) {
							aMaxXPos_2 = aLayerXPos_2;
						}
						anOrderIdx_2++;
					}
				}
				aCurXPos_2 = aMaxXPos_2;
			}
			if(aLastColor_2 != 0xffffffff) {
				g.PopColor();
			}
		}
	}
}
GameFramework.resources.FontResource.staticInit = function GameFramework_resources_FontResource$staticInit() {
	GameFramework.resources.FontResource.mDrawCmdPool = [];
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.FontResource.registerClass('GameFramework.resources.FontResource', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.FontResource.staticInit();
});