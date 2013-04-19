GameFramework.gfx.Graphics = function GameFramework_gfx_Graphics(theWidth, theHeight) {
	this.mColorVector = [];
	this.mPushSetColor = [];
	this.mColorComponentVector = [];
	this.mTempMatrix = new GameFramework.geom.Matrix();
	this.mReserveMatrix = new GameFramework.geom.Matrix();
	this.mButtonPieces = {};
	this.mImageBoxPieces = {};
	this.mAutoPopMatrix = new GameFramework.misc.DisposeProxyStatic(ss.Delegate.create(this, this.PopMatrix));
	this.mAutoPopColor = new GameFramework.misc.DisposeProxyStatic(ss.Delegate.create(this, this.PopColor));
	this.mMatrixVector = [];
	this.mMatrix = new GameFramework.geom.Matrix();
	this.mMatrixDepth = 0;
	this.mScale = GameFramework.BaseApp.mApp.mArtRes / GameFramework.BaseApp.mApp.mHeight;
}
GameFramework.gfx.Graphics.WordWrapHelper = function GameFramework_gfx_Graphics$WordWrapHelper(g, theFont, theString, theX, theY, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData, theParseColorizers) {
	if(theWidth === undefined) {
		theWidth = 0;
	}
	if(theJustification === undefined) {
		theJustification = -1;
	}
	if(theTextOverflowMode === undefined) {
		theTextOverflowMode = GameFramework.gfx.ETextOverflowMode.Draw;
	}
	if(theLineSpacingOffset === undefined) {
		theLineSpacingOffset = 0;
	}
	if(theFontDrawData === undefined) {
		theFontDrawData = null;
	}
	if(theParseColorizers === undefined) {
		theParseColorizers = true;
	}
	var aCurPos = 0;
	var aLineStartPos = 0;
	var aCurWidth = 0;
	var aCurChar = 0;
	var aPrevChar = 0;
	var aSpacePos = -1;
	var aYOffset = 0;
	var aLineCount = 0;
	while(aCurPos < theString.length) {
		aCurChar = GameFramework.Utils.GetCharAt(theString, aCurPos);
		if(aCurChar == 94 && theParseColorizers) {
			if(aCurPos + 1 < theString.length) {
				if(theString.charCodeAt(aCurPos + 1) == 94) {
					aCurPos++;
				} else {
					aCurPos += 8;
					continue;
				}
			}
		} else if(aCurChar == 32) {
			aSpacePos = aCurPos;
		} else if(aCurChar == 10) {
			aCurWidth = theWidth + 1;
			aSpacePos = aCurPos;
			aCurPos++;
		}
		aCurWidth += theFont.CharWidthKern(aCurChar, aPrevChar);
		aPrevChar = aCurChar;
		if(aCurWidth > theWidth) {
			aLineCount++;
			if(aSpacePos != -1) {
				if(g != null) {
					g.DrawStringEx(theString.substr(aLineStartPos, aSpacePos - aLineStartPos), theX, theY + aYOffset, theWidth, theJustification);
				}
				aCurPos = aSpacePos + 1;
				if(aCurChar != 10) {
					while(aCurPos < theString.length && GameFramework.Utils.GetCharAt(theString, aCurPos) == 32) {
						aCurPos++;
					}
				}
				aLineStartPos = aCurPos;
			}

			aLineStartPos = aCurPos;
			aSpacePos = -1;
			aCurWidth = 0;
			aPrevChar = 0;
			aYOffset += theFont.GetLineSpacing() + theLineSpacingOffset;
		} else {
			aCurPos++;
		}
	}
	if(aLineStartPos < theString.length) {
		if(g != null) {
			g.DrawStringEx(theString.substr(aLineStartPos), theX, theY + aYOffset, theWidth, theJustification);
		}
		aYOffset += theFont.GetLineSpacing() + theLineSpacingOffset;
	} else if(aCurChar == 10) {
	}
	if(theFontDrawData != null) {
		theFontDrawData.mFontAscent = theFont.GetAscent();
		theFontDrawData.mFontDescent = aYOffset - theFontDrawData.mFontAscent;
	}
}
GameFramework.gfx.Graphics.GetDrawStringData = function GameFramework_gfx_Graphics$GetDrawStringData(theString, theFont, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData) {
	if(theWidth === undefined) {
		theWidth = 0;
	}
	if(theJustification === undefined) {
		theJustification = -1;
	}
	if(theTextOverflowMode === undefined) {
		theTextOverflowMode = GameFramework.gfx.ETextOverflowMode.Draw;
	}
	if(theLineSpacingOffset === undefined) {
		theLineSpacingOffset = 0;
	}
	if(theFontDrawData === undefined) {
		theFontDrawData = null;
	}
	if(theTextOverflowMode == GameFramework.gfx.ETextOverflowMode.Draw) {
	} else if(theTextOverflowMode == GameFramework.gfx.ETextOverflowMode.Wrap) {
		GameFramework.gfx.Graphics.WordWrapHelper(null, theFont, theString, 0, 0, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData);
	}
}
GameFramework.gfx.Graphics.prototype = {
	mMatrixVector : null,
	mMatrix : null,
	mMatrixDepth : 0,
	mColorVector : null,
	mPushSetColor : null,
	mColorComponentVector : null,
	mColor : 0xffffffff,
	mScale : 1.0,
	mColorComponents : null,
	mFont : null,
	mTempMatrix : null,
	mReserveMatrix : null,
	mAutoPopMatrix : null,
	mAutoPopColor : null,
	mButtonPieces : null,
	mImageBoxPieces : null,
	GetSnappedX : function GameFramework_gfx_Graphics$GetSnappedX(theX) {
		var aScale = this.mMatrix.a * this.mScale;
		return ((((theX * aScale) | 0)) / aScale) + 0.00001;
	},
	GetSnappedY : function GameFramework_gfx_Graphics$GetSnappedY(theY) {
		var aScale = this.mMatrix.d * this.mScale;
		return ((((theY * aScale) | 0)) / aScale) + 0.00001;
	},
	Reset : function GameFramework_gfx_Graphics$Reset() {
		this.mColor = 0xffffffff;
		this.mMatrixDepth = 0;
		this.mMatrix.identity();
		this.mFont = null;
		this.mColorVector.clear();
	},
	GetMatrix : function GameFramework_gfx_Graphics$GetMatrix() {
		return this.mMatrix;
	},
	PushColor : function GameFramework_gfx_Graphics$PushColor(theColor) {
		if(theColor === undefined) {
			theColor = 0xffffffff;
		}
		if(this.mColorComponents != null) {
			return this.PushColorComponents(((this.mColor >>> 24) | 0) & 0xff, ((this.mColor >>> 16) | 0) & 0xff, ((this.mColor >>> 8) | 0) & 0xff, ((this.mColor >>> 0) | 0) & 0xff);
		} else {
			this.mColorVector.push(this.mColor);
			if(this.mColor == 0xffffffff) {
				this.mColor = theColor;
			} else {
				this.mColor = (((((((this.mColor >>> 24) & 0xff) * ((theColor >>> 24) & 0xff)) / 255) | 0)) << 24) | (((((((this.mColor >>> 16) & 0xff) * ((theColor >>> 16) & 0xff)) / 255) | 0)) << 16) | (((((((this.mColor >>> 8) & 0xff) * ((theColor >>> 8) & 0xff)) / 255) | 0)) << 8) | (((((((this.mColor >>> 0) & 0xff) * ((theColor >>> 0) & 0xff)) / 255) | 0)) << 0);
			}
			this.mPushSetColor.push(this.mColor);
			return this.mAutoPopColor;
		}
	},
	SetColor : function GameFramework_gfx_Graphics$SetColor(theColor) {
		if(this.mColorComponents != null) {
			if(this.mColorComponentVector.length == 0) {
				this.mColorComponents = Array.Create(4, 0, ((this.mColor >>> 24) | 0) & 0xff, ((this.mColor >>> 16) | 0) & 0xff, ((this.mColor >>> 8) | 0) & 0xff, ((this.mColor >>> 0) | 0) & 0xff);
			} else {
				var aPrevColorComponents = this.mColorComponentVector[this.mColorComponentVector.length - 1];
				this.mColorComponents[0] = (((aPrevColorComponents[0] * ((this.mColor >>> 24) | 0) & 0xff) / 255) | 0);
				this.mColorComponents[1] = (((aPrevColorComponents[1] * ((this.mColor >>> 16) | 0) & 0xff) / 255) | 0);
				this.mColorComponents[2] = (((aPrevColorComponents[2] * ((this.mColor >>> 8) | 0) & 0xff) / 255) | 0);
				this.mColorComponents[3] = (((aPrevColorComponents[3] * ((this.mColor) | 0) & 0xff) / 255) | 0);
			}
		} else {
			if((this.mColorVector.length == 0) || (this.mColorVector[this.mColorVector.length - 1] == 0xffffffff)) {
				this.mColor = theColor;
			} else {
				this.mColor = this.mColorVector[this.mColorVector.length - 1];
				this.mColor = (((((((this.mColor >>> 24) & 0xff) * ((theColor >>> 24) & 0xff)) / 255) | 0)) << 24) | (((((((this.mColor >>> 16) & 0xff) * ((theColor >>> 16) & 0xff)) / 255) | 0)) << 16) | (((((((this.mColor >>> 8) & 0xff) * ((theColor >>> 8) & 0xff)) / 255) | 0)) << 8) | (((((((this.mColor >>> 0) & 0xff) * ((theColor >>> 0) & 0xff)) / 255) | 0)) << 0);
			}
		}
	},
	UndoSetColor : function GameFramework_gfx_Graphics$UndoSetColor() {
		if(this.mPushSetColor.length > 0) {
			this.mColor = this.mPushSetColor[this.mPushSetColor.length - 1];
		} else {
			this.mColor = 0xffffffff;
		}
	},
	PushColorComponents : function GameFramework_gfx_Graphics$PushColorComponents(r, g, b, a) {
		if(this.mColorComponents == null) {
			this.mColorComponents = Array.Create(4, 0, r, g, b, a);
		} else {
			this.mColorComponentVector.push(this.mColorComponents);
			this.mColorComponents[0] = (((this.mColorComponents[0] * r) / 255) | 0);
			this.mColorComponents[1] = (((this.mColorComponents[1] * g) / 255) | 0);
			this.mColorComponents[2] = (((this.mColorComponents[2] * b) / 255) | 0);
			this.mColorComponents[3] = (((this.mColorComponents[3] * a) / 255) | 0);
		}
		return this.mAutoPopColor;
	},
	PopColor : function GameFramework_gfx_Graphics$PopColor() {
		if(this.mColorComponents != null) {
			if(this.mColorComponentVector.length == 0) {
				this.mColorComponents = null;
			} else {
				this.mColorComponents = this.mColorComponentVector.pop();
			}
		} else {
			this.mColor = this.mColorVector.pop();
			this.mPushSetColor.pop();
		}
	},
	PushTranslate : function GameFramework_gfx_Graphics$PushTranslate(theX, theY) {
		this.mMatrixVector[this.mMatrixDepth++] = this.mMatrix;
		var anOldMatrix = this.mMatrix;
		this.mMatrix = new GameFramework.geom.Matrix();
		this.mMatrix.translate(theX, theY);
		this.mMatrix.concat(anOldMatrix);
		return this.mAutoPopMatrix;
	},
	PushScale : function GameFramework_gfx_Graphics$PushScale(theScaleX, theScaleY, theX, theY) {
		this.mMatrixVector[this.mMatrixDepth++] = this.mMatrix;
		var anOldMatrix = this.mMatrix;
		this.mMatrix = new GameFramework.geom.Matrix();
		this.mMatrix.translate(-theX, -theY);
		this.mMatrix.scale(theScaleX, theScaleY);
		this.mMatrix.translate(theX, theY);
		if(this.mMatrixDepth != 1) {
			this.mMatrix.concat(anOldMatrix);
		}
		return this.mAutoPopMatrix;
	},
	PushMatrix : function GameFramework_gfx_Graphics$PushMatrix(theMatrix) {
		this.mMatrixVector[this.mMatrixDepth++] = this.mMatrix;
		var anOldMatrix = this.mMatrix;
		if(this.mReserveMatrix == null) {
			this.mMatrix = theMatrix.clone();
		} else if(theMatrix == this.mTempMatrix) {
			this.mMatrix = this.mTempMatrix;
			this.mTempMatrix = this.mReserveMatrix;
			this.mReserveMatrix = null;
		} else {
			this.mMatrix = this.mReserveMatrix;
			this.mMatrix.a = theMatrix.a;
			this.mMatrix.b = theMatrix.b;
			this.mMatrix.c = theMatrix.c;
			this.mMatrix.d = theMatrix.d;
			this.mMatrix.tx = theMatrix.tx;
			this.mMatrix.ty = theMatrix.ty;
			this.mReserveMatrix = null;
		}
		if(this.mMatrixDepth != 1) {
			this.mMatrix.concat(anOldMatrix);
		}
		return this.mAutoPopMatrix;
	},
	PopMatrix : function GameFramework_gfx_Graphics$PopMatrix() {
		this.mReserveMatrix = this.mMatrix;
		this.mMatrixDepth--;
		this.mMatrix = this.mMatrixVector[this.mMatrixDepth];
	},
	DrawImageCel : function GameFramework_gfx_Graphics$DrawImageCel(img, theX, theY, theCel) {
		if(this.mColorComponents != null) {
			var aPrevColor = this.mColor;
			var aR = this.mColorComponents[0];
			var aG = this.mColorComponents[1];
			var aB = this.mColorComponents[2];
			var aA = this.mColorComponents[3];
			var aR1 = ((Math.min(aR, 255)) | 0);
			var aG1 = ((Math.min(aG, 255)) | 0);
			var aB1 = ((Math.min(aB, 255)) | 0);
			var aA1 = ((Math.min(aA, 255)) | 0);
			this.mColor = (((aA1 << 24) | (aR1 << 16) | (aB1 << 8) | (aG1)) | 0);
			img.DrawEx(this, this.mMatrix, theX, theY, theCel);
			var aR2 = ((((aR * aA) - (aR1 * aA1)) / 255) | 0);
			var aG2 = ((((aG * aA) - (aG1 * aA1)) / 255) | 0);
			var aB2 = ((((aB * aA) - (aB1 * aA1)) / 255) | 0);
			if((aR2 != 0) || (aG2 != 0) || (aB2 != 0)) {
				this.mColor = (((0xff << 24) | (aR2 << 16) | (aB2 << 8) | (aG2)) | 0);
				var wasAdditive = img.get_Additive();
				img.set_Additive(true);
				img.DrawEx(this, this.mMatrix, theX, theY, theCel);
				img.set_Additive(wasAdditive);
			}
			this.mColor = aPrevColor;
		} else {
			img.DrawEx(this, this.mMatrix, theX, theY, theCel);
		}
	},
	DrawImage : function GameFramework_gfx_Graphics$DrawImage(img, theX, theY) {
		if(this.mColorComponents != null) {
			this.DrawImageCel(img, theX, theY, 0);
		} else {
			img.DrawEx(this, this.mMatrix, theX, theY, 0);
		}
	},
	DrawButton : function GameFramework_gfx_Graphics$DrawButton(theImage, theX, theY, theWidth, theCel) {
		if(theWidth == theImage.mWidth) {
			this.DrawImageCel(theImage, theX, theY, theCel);
			return;
		}
		var aCheckId = (theImage.mId << 10) + theCel;
		var aButtonPieces = this.mButtonPieces[aCheckId];
		if(aButtonPieces == null) {
			aButtonPieces = Array.Create(3, null, theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel));
			var anOrigWidth = aButtonPieces[0].mSrcWidth;
			var aChunkWidth = ((anOrigWidth / 3) | 0);
			var anOrigX = aButtonPieces[0].mSrcX;
			aButtonPieces[0].mSrcX = anOrigX;
			aButtonPieces[0].mSrcWidth = aChunkWidth;
			aButtonPieces[1].mSrcX = anOrigX + aChunkWidth;
			aButtonPieces[1].mSrcWidth = anOrigWidth - aChunkWidth * 2;
			aButtonPieces[2].mSrcX = anOrigX + anOrigWidth - aChunkWidth;
			aButtonPieces[2].mSrcWidth = aChunkWidth;

			{
				var $srcArray1 = aButtonPieces;
				for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
					var anImageInst = $srcArray1[$enum1];
					if(!GameFramework.BaseApp.mApp.get_Is3D()) {
						anImageInst.mPixelSnapping = GameFramework.resources.PixelSnapping.Always;
						anImageInst.mSizeSnapping = true;
					} else {
						anImageInst.mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
					}
					anImageInst.Prepare();
				}
			}
			this.mButtonPieces[aCheckId] = aButtonPieces;
		}
		var aLogChunkWidth = aButtonPieces[2].mSrcWidth / this.mScale;
		this.DrawImage(aButtonPieces[0], theX, theY);
		this.PushScale((theWidth - aLogChunkWidth * 2) / (aButtonPieces[1].mSrcWidth / this.mScale), 1.0, theX + aLogChunkWidth, theY);
		this.DrawImage(aButtonPieces[1], theX + aLogChunkWidth, theY);
		this.PopMatrix();
		this.DrawImage(aButtonPieces[2], theX + theWidth - aLogChunkWidth, theY);
	},
	DrawImageBox : function GameFramework_gfx_Graphics$DrawImageBox(theImage, theX, theY, theWidth, theHeight, theCel) {
		var aCheckId = (theImage.mId << 10) + theCel;
		var aButtonPieces = this.mImageBoxPieces[aCheckId];
		if(aButtonPieces == null) {
			aButtonPieces = Array.Create(9, null, theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel), theImage.CreateImageInstCel(theCel));
			var anOrigWidth = aButtonPieces[0].mSrcWidth;
			var anOrigHeight = aButtonPieces[0].mSrcHeight;
			var aChunkWidth = ((anOrigWidth / 3) | 0);
			var aChunkHeight = ((anOrigHeight / 3) | 0);
			var anOrigX = aButtonPieces[0].mSrcX;
			var anOrigY = aButtonPieces[0].mSrcY;
			aButtonPieces[0].mSrcX = anOrigX;
			aButtonPieces[0].mSrcWidth = aChunkWidth;
			aButtonPieces[0].mSrcY = anOrigY;
			aButtonPieces[0].mSrcHeight = aChunkHeight;
			aButtonPieces[1].mSrcX = anOrigX + aChunkWidth;
			aButtonPieces[1].mSrcWidth = anOrigWidth - aChunkWidth * 2;
			aButtonPieces[1].mSrcY = anOrigY;
			aButtonPieces[1].mSrcHeight = aChunkHeight;
			aButtonPieces[2].mSrcX = anOrigX + anOrigWidth - aChunkWidth;
			aButtonPieces[2].mSrcWidth = aChunkWidth;
			aButtonPieces[2].mSrcY = anOrigY;
			aButtonPieces[2].mSrcHeight = aChunkHeight;
			aButtonPieces[3].mSrcX = anOrigX;
			aButtonPieces[3].mSrcWidth = aChunkWidth;
			aButtonPieces[3].mSrcY = anOrigY + aChunkHeight;
			aButtonPieces[3].mSrcHeight = anOrigHeight - aChunkHeight * 2;
			aButtonPieces[4].mSrcX = anOrigX + aChunkWidth;
			aButtonPieces[4].mSrcWidth = anOrigWidth - aChunkWidth * 2;
			aButtonPieces[4].mSrcY = anOrigY + aChunkHeight;
			aButtonPieces[4].mSrcHeight = anOrigHeight - aChunkHeight * 2;
			aButtonPieces[5].mSrcX = anOrigX + anOrigWidth - aChunkWidth;
			aButtonPieces[5].mSrcWidth = aChunkWidth;
			aButtonPieces[5].mSrcY = anOrigY + aChunkHeight;
			aButtonPieces[5].mSrcHeight = anOrigHeight - aChunkHeight * 2;
			aButtonPieces[6].mSrcX = anOrigX;
			aButtonPieces[6].mSrcWidth = aChunkWidth;
			aButtonPieces[6].mSrcY = anOrigY + anOrigHeight - aChunkHeight;
			aButtonPieces[6].mSrcHeight = aChunkHeight;
			aButtonPieces[7].mSrcX = anOrigX + aChunkWidth;
			aButtonPieces[7].mSrcWidth = anOrigWidth - aChunkWidth * 2;
			aButtonPieces[7].mSrcY = anOrigY + anOrigHeight - aChunkHeight;
			aButtonPieces[7].mSrcHeight = aChunkHeight;
			aButtonPieces[8].mSrcX = anOrigX + anOrigWidth - aChunkWidth;
			aButtonPieces[8].mSrcWidth = aChunkWidth;
			aButtonPieces[8].mSrcY = anOrigY + anOrigHeight - aChunkHeight;
			aButtonPieces[8].mSrcHeight = aChunkHeight;

			{
				var $srcArray2 = aButtonPieces;
				for(var $enum2 = 0; $enum2 < $srcArray2.length; $enum2++) {
					var anImageInst = $srcArray2[$enum2];
					if(!GameFramework.BaseApp.mApp.get_Is3D()) {
						anImageInst.mPixelSnapping = GameFramework.resources.PixelSnapping.Always;
						anImageInst.mSizeSnapping = true;
					} else {
						anImageInst.mPixelSnapping = GameFramework.resources.PixelSnapping.Never;
					}
					anImageInst.Prepare();
				}
			}
			this.mImageBoxPieces[aCheckId] = aButtonPieces;
		}
		var aLogChunkWidth = aButtonPieces[0].mSrcWidth / this.mScale;
		var aLogChunkHeight = aButtonPieces[0].mSrcHeight / this.mScale;
		var aRepeatX = 1.0;
		var aRepeatY = 1.0;
		var hasVertCenter = theHeight > aLogChunkHeight * 2;
		var hasHorzCenter = theWidth > aLogChunkWidth * 2;
		this.DrawImage(aButtonPieces[0], theX, theY);
		if(hasHorzCenter) {
			this.PushScale((theWidth - aLogChunkWidth * 2) / (aButtonPieces[1].mSrcWidth / this.mScale), 1.0, theX + aLogChunkWidth, theY);
			aButtonPieces[1].mRepeatX = aRepeatX;
			this.DrawImage(aButtonPieces[1], theX + aLogChunkWidth, theY);
			this.PopMatrix();
		}
		this.DrawImage(aButtonPieces[2], theX + theWidth - aLogChunkWidth, theY);
		if(hasVertCenter) {
			this.PushScale(1.0, (theHeight - aLogChunkHeight * 2) / (aButtonPieces[3].mSrcHeight / this.mScale), theX, theY + aLogChunkHeight);
			aButtonPieces[3].mRepeatY = aRepeatY;
			this.DrawImage(aButtonPieces[3], theX, theY + aLogChunkHeight);
			this.PopMatrix();
			if(hasHorzCenter) {
				this.PushScale((theWidth - aLogChunkWidth * 2) / (aButtonPieces[7].mSrcWidth / this.mScale), (theHeight - aLogChunkHeight * 2) / (aButtonPieces[4].mSrcHeight / this.mScale), theX + aLogChunkWidth, theY + aLogChunkHeight);
				aButtonPieces[4].mRepeatX = aRepeatX;
				aButtonPieces[4].mRepeatY = aRepeatY;
				this.DrawImage(aButtonPieces[4], theX + aLogChunkWidth, theY + aLogChunkHeight);
				this.PopMatrix();
			}
			this.PushScale(1.0, (theHeight - aLogChunkHeight * 2) / (aButtonPieces[5].mSrcHeight / this.mScale), theX + theWidth - aLogChunkWidth, theY + aLogChunkHeight);
			aButtonPieces[5].mRepeatY = aRepeatY;
			this.DrawImage(aButtonPieces[5], theX + theWidth - aLogChunkWidth, theY + aLogChunkHeight);
			this.PopMatrix();
		}
		this.DrawImage(aButtonPieces[6], theX, theY + theHeight - aLogChunkHeight);
		if(hasHorzCenter) {
			this.PushScale((theWidth - aLogChunkWidth * 2) / (aButtonPieces[7].mSrcWidth / this.mScale), 1.0, theX + aLogChunkWidth, theY + theHeight - aLogChunkHeight);
			aButtonPieces[7].mRepeatX = aRepeatX;
			this.DrawImage(aButtonPieces[7], theX + aLogChunkWidth, theY + theHeight - aLogChunkHeight);
			this.PopMatrix();
		}
		this.DrawImage(aButtonPieces[8], theX + theWidth - aLogChunkWidth, theY + theHeight - aLogChunkHeight);
	},
	FillRect : function GameFramework_gfx_Graphics$FillRect(x, y, w, h) {
		var aNewMatrix = new GameFramework.geom.Matrix();
		aNewMatrix.tx = x;
		aNewMatrix.ty = y;
		aNewMatrix.a = w;
		aNewMatrix.d = h;
		aNewMatrix.concat(this.mMatrix);
	},
	SetFont : function GameFramework_gfx_Graphics$SetFont(theFont) {
		this.mFont = theFont;
	},
	GetFont : function GameFramework_gfx_Graphics$GetFont() {
		return this.mFont;
	},
	DrawStringCentered : function GameFramework_gfx_Graphics$DrawStringCentered(theString, theX, theY) {
		this.DrawStringEx(theString, theX, theY, 0, 0);
	},
	DrawString : function GameFramework_gfx_Graphics$DrawString(theString, theX, theY) {
		this.mFont.Draw(this, theString, theX, theY);
	},
	DrawStringEx : function GameFramework_gfx_Graphics$DrawStringEx(theString, theX, theY, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData) {
		if(theWidth === undefined) {
			theWidth = 0;
		}
		if(theJustification === undefined) {
			theJustification = -1;
		}
		if(theTextOverflowMode === undefined) {
			theTextOverflowMode = GameFramework.gfx.ETextOverflowMode.Draw;
		}
		if(theLineSpacingOffset === undefined) {
			theLineSpacingOffset = 0;
		}
		if(theFontDrawData === undefined) {
			theFontDrawData = null;
		}
		if(theTextOverflowMode != GameFramework.gfx.ETextOverflowMode.Wrap) {
			var aCurPos = 0;
			for(; ;) {
				var aBrPos = theString.indexOf(String.fromCharCode(10), aCurPos);
				if(aBrPos == -1) {
					if(aCurPos != 0) {
						theString = theString.substr(aCurPos);
					}
					break;
				}
				this.DrawStringEx(theString.substr(aCurPos, aBrPos - aCurPos), theX, theY, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData);
				theY += this.mFont.GetLineSpacing() + theLineSpacingOffset;
				aCurPos = aBrPos + 1;
			}
		}
		if(theTextOverflowMode == GameFramework.gfx.ETextOverflowMode.Draw) {
			if(theJustification == 0) {
				theX += (theWidth - this.mFont.StringWidth(theString)) / 2.0;
			} else if(theJustification == 1) {
				theX += (theWidth - this.mFont.StringWidth(theString));
			}
			this.mFont.Draw(this, theString, theX, theY);
		} else if(theTextOverflowMode == GameFramework.gfx.ETextOverflowMode.Wrap) {
			GameFramework.gfx.Graphics.WordWrapHelper(this, this.mFont, theString, theX, theY, theWidth, theJustification, theTextOverflowMode, theLineSpacingOffset, theFontDrawData);
		}
	},
	StringWidth : function GameFramework_gfx_Graphics$StringWidth(theString) {
		return this.mFont.StringWidth(theString);
	},
	AddRect : function GameFramework_gfx_Graphics$AddRect(x, y, w, h, color) {
	},
	PolyFill : function GameFramework_gfx_Graphics$PolyFill(thePoints) {
	},
	DrawTrianglesTex : function GameFramework_gfx_Graphics$DrawTrianglesTex(theImage, theVertices) {
	},
	BeginFrame : function GameFramework_gfx_Graphics$BeginFrame() {
	},
	EndFrame : function GameFramework_gfx_Graphics$EndFrame() {
	},
	Begin3DScene : function GameFramework_gfx_Graphics$Begin3DScene(theViewMatrix, theWorldMatrix, theProjectionMatrix) {
		if(theViewMatrix === undefined) {
			theViewMatrix = null;
		}
		if(theWorldMatrix === undefined) {
			theWorldMatrix = null;
		}
		if(theProjectionMatrix === undefined) {
			theProjectionMatrix = null;
		}
		return null;
	},
	End3DScene : function GameFramework_gfx_Graphics$End3DScene(theGraphics3D) {
	}
}
GameFramework.gfx.Graphics.staticInit = function GameFramework_gfx_Graphics$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.gfx.Graphics.registerClass('GameFramework.gfx.Graphics', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.gfx.Graphics.staticInit();
});