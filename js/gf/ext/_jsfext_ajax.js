function DecodeBase64(input) {
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;

	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	while(i < input.length) {
		enc1 = this._keyStr.indexOf(input.charAt(i++));
		enc2 = this._keyStr.indexOf(input.charAt(i++));
		enc3 = this._keyStr.indexOf(input.charAt(i++));
		enc4 = this._keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output = output + String.fromCharCode(chr1);

		if(enc3 != 64) {
			output = output + String.fromCharCode(chr2);
		}
		if(enc4 != 64) {
			output = output + String.fromCharCode(chr3);
		}

	}

	return output;
}

var gRequiresBinaryFileHack = false;
function JSFExt_SetRequiresBinaryHack(required) {
	gRequiresBinaryFileHack = required;
}
window['JSFExt_SetRequiresBinaryHack'] = JSFExt_SetRequiresBinaryHack;

function JSFExt_IsGetBinarySupported() {
	var aXMLHttpRequest = new XMLHttpRequest();
	if(aXMLHttpRequest.overrideMimeType) {
		return true;
	}
	return false;
}

function JSFExt_GetBinary(theStreamer, theURL) {
	var aXMLHttpRequest = new XMLHttpRequest();
	if((aXMLHttpRequest.overrideMimeType) || (!gRequiresBinaryFileHack)) {
		aXMLHttpRequest.open("GET", theURL, true);
	} else {
		aXMLHttpRequest.open("GET", "file_getter.php?path=" + theURL, true);
	}
	aXMLHttpRequest.onreadystatechange = function() {
		if(aXMLHttpRequest.readyState == 4) {
			if(aXMLHttpRequest.status != 200) {
				theStreamer.mFailed = true;
			} else {
				gApp.ResourceStreamerCompletedCallback(aXMLHttpRequest.responseText, theStreamer);
			}
		}
	}
	if(aXMLHttpRequest.overrideMimeType) {
		aXMLHttpRequest.overrideMimeType('text/plain;charset=x-user-defined');
	}

	aXMLHttpRequest.send();
	return aXMLHttpRequest;
}

function JSFExt_GetBinaryGroupData(theStreamer, theGroupName, theURL) {
	var isUTF8 = theURL.indexOf('.utf8') != -1;

	var aXMLHttpRequest = new XMLHttpRequest();
	if((aXMLHttpRequest.overrideMimeType) || (!gRequiresBinaryFileHack) || (isUTF8)) {
		aXMLHttpRequest.open("GET", theURL, true);
	} else {
		aXMLHttpRequest.open("GET", "file_getter.php?path=" + theURL, true);
	}
	aXMLHttpRequest.onreadystatechange = function() {
		if(aXMLHttpRequest.readyState == 4) {
			if(aXMLHttpRequest.status != 200 && !LOCAL_DEBUG) {
				theStreamer.mFailed = true;
			} else {
				gApp.BinaryGroupDataLoaded(theGroupName, aXMLHttpRequest.responseText);
			}
		}
	}
	if((aXMLHttpRequest.overrideMimeType) && (!isUTF8)) {
		aXMLHttpRequest.overrideMimeType('text/plain;charset=x-user-defined');
	}

	aXMLHttpRequest.send();
	return aXMLHttpRequest;
}

var gBlindGetObjects = [];

function JSFExt_BlindGet(theURL) {
	//var
}

$['ajaxTransport'](function(options, originalOptions, jqXHR) {
	var xdr;

	return {
		send : function(_, completeCallback) {
			xdr = new XDomainRequest();
			xdr.onload = function() {
				if(xdr.contentType.match(/\/json/)) {
					options.dataTypes.push("json");
				}

				completeCallback(200, 'success', { text : xdr.responseText });
			};
			xdr.onerror = xdr.ontimeout = function() {
				completeCallback(400, 'failed', { text : xdr.responseText });
			}

			xdr.open(options.type, options.url);
			xdr.send(options.data);
		},
		abort : function() {
			if(xdr) {
				xdr.abort();
			}
		}
	};
});


// load image from network, when done, texture will be created for it
function JSFExt_LoadImage(theStreamer, thePath1, thePath2) {
	if(thePath2) {
		var anImage = new Image();
		anImage.onload = function() {
			theStreamer.mColorImage = anImage;
			if(theStreamer.mAlphaImage != null) {
				theStreamer.mGLTex = JSFExt_CreateGLTexComb(theStreamer.mColorImage, theStreamer.mAlphaImage);
				gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
			}
		}
		anImage.onerror = function() {
			theStreamer.mFailed = true;
		}
		anImage.src = thePath1;

		var anImage2 = new Image();
		anImage2.onload = function() {
			theStreamer.mAlphaImage = anImage2;
			if(theStreamer.mColorImage != null) {
				theStreamer.mGLTex = JSFExt_CreateGLTexComb(theStreamer.mColorImage, theStreamer.mAlphaImage);
				gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
			}
		}
		anImage2.onerror = function() {
			theStreamer.mFailed = true;
		}
		anImage2.src = thePath2;
	} else {
		var anImage = new Image();
		//anImage.onload = function () { theStreamer.mGLTex = CreateGLTex(anImage); gApp.ResourceStreamerCompletedCallback(anImage, theStreamer); }
		anImage.onload = function() {
			theStreamer.mDeferredFunc = function() {
				theStreamer.mGLTex = CreateGLTex(anImage);
				gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
			}
		}
		anImage.onerror = function() {
			theStreamer.mFailed = true;
		}
		anImage.src = thePath1;
	}
	return anImage;
}

// it load images from network but doesn't create texture for it
function JSFExt_LoadImageSub(theStreamer, thePath1, thePath2) {
	if(thePath2) {
		var anImage = new Image();
		anImage.onload = function() {
			theStreamer.mColorImage = anImage;
			if(theStreamer.mAlphaImage != null) {
				gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
			}
		}
		anImage.onerror = function() {
			theStreamer.mFailed = true;
		}
		anImage.src = thePath1;

		var anImage2 = new Image();
		anImage2.onload = function() {
			theStreamer.mAlphaImage = anImage2;
			if(theStreamer.mColorImage != null) {
				gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
			}
		}
		anImage2.onerror = function() {
			theStreamer.mFailed = true;
		}
		anImage2.src = thePath2;
	} else if(thePath1.indexOf('_.') == -1) {
		var anImage = new Image();
		anImage.onload = function() {
			theStreamer.mColorImage = anImage;
			gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
		}
		anImage.onerror = function() {
			theStreamer.mFailed = true;
		}
		anImage.src = thePath1;
	} else {
		var anImage = new Image();
		anImage.onload = function() {
			theStreamer.mAlphaImage = anImage;
			gApp.ResourceStreamerCompletedCallback(anImage, theStreamer);
		}
		anImage.onerror = function() {
			theStreamer.mFailed = true;
		}
		anImage.src = thePath1;
	}
	return anImage;
}