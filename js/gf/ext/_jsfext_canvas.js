// create image data block for given size
function JSFExt_CreateCompositeImageData(theWidth, theHeight) {
	var aScratchCTX = document.getElementById('ScratchCanvas').getContext('2d');
	return aScratchCTX.createImageData(theWidth, theHeight);
}

// copy color and alpha info to a block of image data
function JSFExt_CopyToImageData(theDestImageData, theSrcX, theSrcY, theWidth, theHeight, theColorImage, theAlphaImage, theDestX, theDestY) {
	var aScratchCTX = document.getElementById('ScratchCanvas').getContext('2d');

	var aMaxHeight = 256;
	if((theColorImage) && (theAlphaImage)) {
		aMaxHeight = 128;
	}

	if(theHeight > aMaxHeight) {
		JSFExt_CopyToImageData(theDestImageData, theSrcX, theSrcY, theWidth, aMaxHeight, theColorImage, theAlphaImage, theDestX, theDestY);
		JSFExt_CopyToImageData(theDestImageData, theSrcX, theSrcY + aMaxHeight, theWidth, theHeight - aMaxHeight, theColorImage, theAlphaImage, theDestX, theDestY + aMaxHeight);
		return;
	}

	var aMaxWidth = 256;
	if(theWidth > aMaxWidth) {
		JSFExt_CopyToImageData(theDestImageData, theSrcX, theSrcY, aMaxWidth, theHeight, theColorImage, theAlphaImage, theDestX, theDestY);
		JSFExt_CopyToImageData(theDestImageData, theSrcX + aMaxWidth, theSrcY, theWidth - aMaxWidth, theHeight, theColorImage, theAlphaImage, theDestX + aMaxWidth, theDestY);
		return;
	}

	var aSize = theWidth * theHeight;

	var aColorImageData = null;
	var anAlphaImageData = null;

	var aCurY = 0;
	var aSrcIdx = 0;

	if(theAlphaImage) {
		aScratchCTX.drawImage(theAlphaImage, theSrcX, theSrcY, theWidth, theHeight, 0, 0, theWidth, theHeight);
		aCurY += theHeight;
	}

	if(theColorImage) {
		aScratchCTX.drawImage(theColorImage, theSrcX, theSrcY, theWidth, theHeight, 0, aCurY, theWidth, theHeight);
	}

	var anImageData = aScratchCTX.getImageData(0, 0, theWidth, aCurY + theHeight);

	var aSrcIdx = 0;
	if((theColorImage) && (theAlphaImage)) {
		aSrcIdx = (theHeight * theWidth) * 4;
		var aDestBits = theDestImageData.data;
		var aSrcBits = anImageData.data;
		var anAlphaOffset = -aSrcIdx - 3;
		for(var y = 0; y < theHeight; y++) {
			var destIdx = ((theDestY + y) * theDestImageData.width + theDestX) * 4;
			for(var x = 0; x < theWidth; x++) {
				aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
				aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
				aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
				aDestBits[destIdx++] = aSrcBits[anAlphaOffset + aSrcIdx++];

			}
		}
	} else if(theColorImage) {
		var aDestBits = theDestImageData.data;
		var aSrcBits = anImageData.data;
		for(var y = 0; y < theHeight; y++) {
			var destIdx = ((theDestY + y) * theDestImageData.width + theDestX) * 4;
			for(var x = 0; x < theWidth; x++) {
				aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
				aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
				aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
				aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
			}
		}
	} else if(theAlphaImage) {
		var aDestBits = theDestImageData.data;
		var aSrcBits = anImageData.data;
		for(var y = 0; y < theHeight; y++) {
			var destIdx = ((theDestY + y) * theDestImageData.width + theDestX) * 4;
			for(var x = 0; x < theWidth; x++) {
				aDestBits[destIdx++] = 255;
				aDestBits[destIdx++] = 255;
				aDestBits[destIdx++] = 255;
				aDestBits[destIdx++] = aSrcBits[aSrcIdx++];
				aSrcIdx += 3;
			}
		}
	}
}

// draw image using canvas, used in non-webgl mode
function JSFExt_CanvasDraw(img, alpha, additive, a, b, c, d, tx, ty, srcx, srcy, srcw, srch) {
	if(alpha == 0) {
		return;
	}

	var hasTrans = (b != 0) || (c != 0);
	if(gCanvasHasTrans != hasTrans) {
		if(!hasTrans) {
			gCTX.setTransform(1, 0, 0, 1, 0, 0);
			gCanvasHasTrans = false;
		}
	}
	if((gCanvasAdditive != additive) && (gCanvasAllowAdditive || !additive)) {
		gCTX.globalCompositeOperation = additive ? 'lighter' : 'source-over';
		gCanvasAdditive = additive;
	}
	if(alpha != gCanvasAlpha) {
		gCTX.globalAlpha = alpha;
		gCanvasAlpha = alpha;
	}
	if(hasTrans) {
		gCTX.setTransform(a, b, c, d, tx, ty);
		gCTX.drawImage(img, srcx, srcy, srcw, srch, 0, 0, srcw, srch);
		gCanvasHasTrans = true;
	} else {
		gCTX.drawImage(img, srcx, srcy, srcw, srch, tx, ty, srcw * a, srch * d);
	}
}