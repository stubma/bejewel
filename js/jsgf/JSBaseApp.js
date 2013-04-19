GameFramework.JSBaseApp = function GameFramework_JSBaseApp() {
	this.mHTTPToResourceStreamer = {};
	this.mGroupBinDataDict = {};
	GameFramework.JSBaseApp.initializeBase(this);
	GameFramework.JSBaseApp.mJSApp = this;
	this.mLastResourceLoadedTick = GameFramework.Utils.GetRunningMilliseconds();
}
GameFramework.JSBaseApp.prototype = {
	mJSResourceManager : null,
	mJSGraphics : null,
	mHTTPToResourceStreamer : null,
	mUseGL : true,
	mLastDrawMS : 0,
	mPathPrefix : '',
	mDistributeLoadTime : true,
	mGroupBinDataDict : null,
	mLastResourceLoadedTick : 0,
	mHasLoadedSound : false,
	get_Is3D : function GameFramework_JSBaseApp$get_Is3D() {
		return this.mUseGL;
	},
	Init : function GameFramework_JSBaseApp$Init() {
		GameFramework.BaseApp.prototype.Init.apply(this);
		this.mResourceManager = this.mJSResourceManager = new GameFramework.resources.JSResourceManager();
	},
	ClearUpdateBacklog : function GameFramework_JSBaseApp$ClearUpdateBacklog() {
		//JS
		gTimeAcc = 0;
		//-JS
	},
	SizeChanged : function GameFramework_JSBaseApp$SizeChanged(theWidth, theHeight) {
		GameFramework.BaseApp.prototype.SizeChanged.apply(this, [theWidth, theHeight]);
		//JS
		gDeferredNewWidth = theWidth;
		gDeferredNewHeight = theHeight;
		//-JS
	},
	CreateBufferData : function GameFramework_JSBaseApp$CreateBufferData() {
		return new GameFramework.JSDataBufferData();
	},
	CreateGraphics : function GameFramework_JSBaseApp$CreateGraphics() {
		this.mGraphics = this.mJSGraphics = new GameFramework.gfx.JSGraphics(this.mPhysWidth, this.mPhysHeight);
	},
	GetLocalData : function GameFramework_JSBaseApp$GetLocalData(theGroupName, theDataName) {
		//JS
		return localStorage.getItem(theGroupName + "/" + theDataName);
		//-JS
		return null;
	},
	SetLocalData : function GameFramework_JSBaseApp$SetLocalData(theGroupName, theDataName, theData) {
		//JS
		localStorage.setItem(theGroupName + "/" + theDataName, theData);
		//-JS
	},
	DeleteLocalData : function GameFramework_JSBaseApp$DeleteLocalData(theGroupName, theDataName) {
		//JS
		return localStorage.removeItem(theGroupName + "/" + theDataName);
		//-JS
	},
	UpdateConnectedRequests : function GameFramework_JSBaseApp$UpdateConnectedRequests() {
		for(var aReqIdx = 0; aReqIdx < this.mConnectedRequestQueue.length; aReqIdx++) {
			var aConnectedRequest = this.mConnectedRequestQueue[aReqIdx];
			if(aConnectedRequest.mLinkedRequestCount == 0) {
				if(aConnectedRequest.mGetterObject == null) {
					if(aConnectedRequest.mRequestType == GameFramework.connected.ConnectedRequest.REQUESTTYPE_BLIND_GET) {
						//JS
						JSFExt_BlindGet(aConnectedRequest.mRequest);
						aConnectedRequest.mResult = true;
						//-JS
					} else if(aConnectedRequest.mRequestType == GameFramework.connected.ConnectedRequest.REQUESTTYPE_GET) {
						//JS
						aConnectedRequest.mGetterObject = $['get'](aConnectedRequest.mRequest, null, function(data) {
							aConnectedRequest.mResult = data;
						}, 'text');
						//-JS
					} else if(aConnectedRequest.mRequestType == GameFramework.connected.ConnectedRequest.REQUESTTYPE_POST) {
						//JS
						aConnectedRequest.mGetterObject = $['post'](aConnectedRequest.mRequest, aConnectedRequest.mRequestParams, function(data) {
							aConnectedRequest.mResult = data;
						}, 'text');
						//-JS
					}
				} else {
					if(aConnectedRequest.mRequestType == GameFramework.connected.ConnectedRequest.REQUESTTYPE_FBGRAPH) {
					} else if((aConnectedRequest.mRequestType == GameFramework.connected.ConnectedRequest.REQUESTTYPE_POST) || (aConnectedRequest.mRequestType == GameFramework.connected.ConnectedRequest.REQUESTTYPE_GET)) {
					}
				}
				if(aConnectedRequest.mResult != null) {
					var aDoneEvent = new GameFramework.events.Event(GameFramework.events.Event.COMPLETE);
					aConnectedRequest.DispatchEvent(aDoneEvent);
					aConnectedRequest.mIsDone = true;
				}
			}
			if(aConnectedRequest.mIsDone) {
				this.mConnectedRequestQueue.removeAt(aReqIdx);
				aReqIdx--;
			}
		}
	},
	Update : function GameFramework_JSBaseApp$Update() {
		// super
		GameFramework.BaseApp.prototype.Update.apply(this);

		// visit every stream in queue
		var didRemove = false;
		var hasSounds = false;
		var hasNonSounds = false;
		for(var anIdx = 0; anIdx < this.mResourceStreamerList.length; anIdx++) {
			// don't block drawing, so ensure draw is performed at least 10fps
			if(this.mDistributeLoadTime) {
				var aCurMS = GameFramework.Utils.GetRunningMilliseconds();
				if(aCurMS - this.mLastDrawMS >= 100) {
					break;
				}
			}

			// if it is sound or not, record
			var aResourceStreamer = this.mResourceStreamerList[anIdx];
			if(aResourceStreamer.mResType == GameFramework.resources.ResourceManager.RESTYPE_SOUND) {
				hasSounds = true;
			} else if(aResourceStreamer.mResType != GameFramework.resources.ResourceManager.RESTYPE_NONE) {
				hasNonSounds = true;
			}

			// if data is null, then this stream is not started yet, we can go on
			if((aResourceStreamer.mResultData == null) && (aResourceStreamer.mPath != null)) {
				if(aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_IMAGE) {
					if((aResourceStreamer.mBaseRes != null) && (aResourceStreamer.mBaseRes.mParent != null)) {
						var anImageResource = this.mResourceManager.GetImageResourceById(aResourceStreamer.mBaseRes.mParent);
						if((anImageResource != null) && (aResourceStreamer.mResourcesLoaded != aResourceStreamer.mResourceCount)) {
							aResourceStreamer.mResourcesLoaded++;
						}
					} else {
						if((aResourceStreamer.mBaseRes != null) && (aResourceStreamer.mBaseRes.mIsNotRuntimeImage)) {
							aResourceStreamer.mResultData = JSFExt_LoadImageSub(aResourceStreamer, aResourceStreamer.mPath ? (this.mPathPrefix + aResourceStreamer.mPath) : null, aResourceStreamer.mPath2 ? (this.mPathPrefix + aResourceStreamer.mPath2) : null);
						} else {
							aResourceStreamer.mResultData = JSFExt_LoadImage(aResourceStreamer, aResourceStreamer.mPath ? (this.mPathPrefix + aResourceStreamer.mPath) : null, aResourceStreamer.mPath2 ? (this.mPathPrefix + aResourceStreamer.mPath2) : null);
						}
					}
				} else if(aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_SOUND) {
					var aPath = aResourceStreamer.mPath;
					if(aPath.indexOf('.') === -1) {
						aPath += aResourceStreamer.mBaseRes.mExtensions[0];
					}
					aResourceStreamer.mResultData = JSFExt_LoadAudio(aResourceStreamer, aPath);
					this.mResourceManager.ResourceLoaded(aResourceStreamer);
				} else if(aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_FONT || aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_POPANIM || aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_PIEFFECT || aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_MESH || aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_RENDEREFFECT || aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_BINFILE) {
					if(aResourceStreamer.mPath.startsWith('!ref:')) {
						var aRefedFont = this.mResourceManager.GetFontResourceById(aResourceStreamer.mPath.substr(5));
						if((aRefedFont != null) && (aResourceStreamer.mResourcesLoaded != aResourceStreamer.mResourceCount)) {
							this.mResourceManager.RegisterFontResource(aResourceStreamer.mId, aRefedFont.Duplicate());
							aResourceStreamer.mResourcesLoaded++;
						}
					} else {
						var aRequest = null;
						var aFullURL = this.mPathPrefix + aResourceStreamer.mPath;

						// the grouped binary will have a @ in full path
						var anAtIdx = aResourceStreamer.mPath.indexOf('@');
						if(anAtIdx != -1) {
							var aColonPos = aResourceStreamer.mPath.indexOf(':', anAtIdx);
							var aDashPos = aResourceStreamer.mPath.indexOf('-', anAtIdx);
							var aGroupBinDataName = aResourceStreamer.mPath.substr(anAtIdx + 1, aColonPos - anAtIdx - 1);
							var aStartPos = aResourceStreamer.mPath.substr(aColonPos + 1, aDashPos - aColonPos - 1) | 0;
							var anEndPos = aResourceStreamer.mPath.substr(aDashPos + 1) | 0;

							// if group binary data is got, it will be saved in mGroupBinDataDict
							// so first check it, if it is here then we can call complete callback
							// if it is not here, call ajax
							var aData = this.mGroupBinDataDict[aGroupBinDataName];
							if(aData) {
								var aData = this.mGroupBinDataDict[aGroupBinDataName];
								if(typeof(aData) == "string") {
									// Data is ready!
									var aSubData = aData.substr(aStartPos, anEndPos - aStartPos);
									this.ResourceStreamerCompletedCallback(aSubData, aResourceStreamer);
								}
							} else {
								this.mGroupBinDataDict[aGroupBinDataName] = true; // Placeholder

								var aGetPath = this.mPathPrefix + aGroupBinDataName;
								if(!JSFExt_IsGetBinarySupported()) {
									var aDotBinPos = aGetPath.indexOf('.bin');
									if(aDotBinPos != -1) {
										aGetPath = aGetPath.substr(0, aDotBinPos) + ".utf8";
									}
								}

								aRequest = JSFExt_GetBinaryGroupData(aResourceStreamer, aGroupBinDataName, aGetPath);
							}
						} else {
							aRequest = JSFExt_GetBinary(aResourceStreamer, this.mPathPrefix + aResourceStreamer.mPath);
							aRequest.mResourceStreamer = aResourceStreamer;
							this.mHTTPToResourceStreamer[aRequest.toString()] = aResourceStreamer;
							aResourceStreamer.mResultData = aRequest;
						}
					}
				} else {
					var aRequest;
					if(aResourceStreamer.mPath.indexOf('.json') !== -1) {
						aRequest = $['get'](this.mPathPrefix + aResourceStreamer.mPath, null, ss.Delegate.create(this, this.ResourceStreamerAjaxCallback), 'text');
					} else {
						aRequest = $['get'](this.mPathPrefix + aResourceStreamer.mPath, null, ss.Delegate.create(this, this.ResourceStreamerAjaxCallback));
					}
					aRequest.mResourceStreamer = aResourceStreamer;
					this.mHTTPToResourceStreamer[aRequest.toString()] = aResourceStreamer;
					aResourceStreamer.mResultData = aRequest;
				}
			}

			if((aResourceStreamer.mDeferredFunc) && (!GameFramework.BaseApp.mApp.mResourceManager.mStreamingPaused)) {
				aResourceStreamer.mDeferredFunc();
				aResourceStreamer.mDeferredFunc = null;
			}

			if((aResourceStreamer.mFailed) || ((aResourceStreamer.mResourcesLoaded == aResourceStreamer.mResourceCount) && (!GameFramework.BaseApp.mApp.mResourceManager.mStreamingPaused))) {
				if(!aResourceStreamer.mFailed) {
					this.mJSResourceManager.ResourceLoaded(aResourceStreamer);
					var anEvent = new GameFramework.events.Event(GameFramework.events.Event.COMPLETE);
					aResourceStreamer.DispatchEvent(anEvent);
				} else {
					var anEvent_2 = new GameFramework.events.Event(GameFramework.events.IOErrorEvent.IO_ERROR);
					aResourceStreamer.DispatchEvent(anEvent_2);
				}
				this.mResourceStreamerList.removeAt(anIdx);
				anIdx--;
				didRemove = true;
			}
			if((anIdx == this.mResourceStreamerList.length - 1) && (didRemove)) {
				anIdx = -1;
				didRemove = false;
			}
		}
		if((hasSounds) && (!hasNonSounds) && (!this.mHasLoadedSound) && (GameFramework.Utils.GetRunningMilliseconds() - this.mLastResourceLoadedTick >= 30000)) {
			throw new System.Exception('Sound loading stalled');
		}
		this.UpdateConnectedRequests();
	},
	Draw : function GameFramework_JSBaseApp$Draw() {
		GameFramework.BaseApp.prototype.Draw.apply(this);
		this.mLastDrawMS = GameFramework.Utils.GetRunningMilliseconds();
	},
	ResourceStreamerCompletedCallback : function GameFramework_JSBaseApp$ResourceStreamerCompletedCallback(theData, theResourceStreamer) {
		this.mLastResourceLoadedTick = GameFramework.Utils.GetRunningMilliseconds();
		theResourceStreamer.mResultData = theData;
		if(theResourceStreamer.mResType == GameFramework.resources.ResourceManager.RESTYPE_SOUND) {
			this.mHasLoadedSound = true;
		}
		if(theResourceStreamer.mResType == GameFramework.resources.ResourceManager.RESTYPE_FONT) {
			var aDataBuffer = new GameFramework.DataBuffer();
			((aDataBuffer.mBufferData)).mData = theResourceStreamer.mResultData;
			theResourceStreamer.mResultData = aDataBuffer;
			this.mJSResourceManager.ParseFontData(theResourceStreamer);
		}
		if(theResourceStreamer.mResType == GameFramework.resources.ResourceManager.RESTYPE_POPANIM) {
			var aDataBuffer_2 = new GameFramework.DataBuffer();
			((aDataBuffer_2.mBufferData)).mData = theResourceStreamer.mResultData;
			theResourceStreamer.mResultData = aDataBuffer_2;
			this.mJSResourceManager.ParsePopAnimData(theResourceStreamer);
		}
		if(theResourceStreamer.mResType == GameFramework.resources.ResourceManager.RESTYPE_PIEFFECT) {
			var aDataBuffer_3 = new GameFramework.DataBuffer();
			((aDataBuffer_3.mBufferData)).mData = theResourceStreamer.mResultData;
			theResourceStreamer.mResultData = aDataBuffer_3;
			this.mJSResourceManager.ParsePIEffectData(theResourceStreamer);
		}
		if(theResourceStreamer.mResType == GameFramework.resources.ResourceManager.RESTYPE_MESH) {
			var aDataBuffer_4 = new GameFramework.DataBuffer();
			((aDataBuffer_4.mBufferData)).mData = theResourceStreamer.mResultData;
			theResourceStreamer.mResultData = aDataBuffer_4;
			this.mJSResourceManager.ParseMeshResourceData(theResourceStreamer);
		}
		if(theResourceStreamer.mResType == GameFramework.resources.ResourceManager.RESTYPE_RENDEREFFECT) {
			var aDataBuffer_5 = new GameFramework.DataBuffer();
			((aDataBuffer_5.mBufferData)).mData = theResourceStreamer.mResultData;
			theResourceStreamer.mResultData = aDataBuffer_5;
			this.mJSResourceManager.ParseRenderEffectData(theResourceStreamer);
		}
		theResourceStreamer.mResourcesLoaded++;
	},
	ResourceStreamerAjaxCallback : function GameFramework_JSBaseApp$ResourceStreamerAjaxCallback(theData, theTextStatus, theRequest) {
		var aResourceStreamer = null;
		//JS
		aResourceStreamer = theRequest.mResourceStreamer;
		//-JS
		if(aResourceStreamer != null) {
			this.ResourceStreamerCompletedCallback(theData, aResourceStreamer);
		}
	},
	BinaryGroupDataLoaded : function GameFramework_JSBaseApp$BinaryGroupDataLoaded(theGroupName, theData) {
		this.mGroupBinDataDict[theGroupName] = theData;
	},
	ParseXMLHelper : function GameFramework_JSBaseApp$ParseXMLHelper(theXML, theXmlNode) {
		//JS
		theXML.mName = theXmlNode.nodeName;
		var $enum1 = ss.IEnumerator.getEnumerator(theXmlNode.attributes);
		while($enum1.moveNext()) {
			var anAttr = $enum1.get_current();
			var aCurXML = theXML;
			if(aCurXML.mAttributes == null) {
				aCurXML.mAttributes = {};
				aCurXML.mAttribueNames = [];
			}
			var aKey = anAttr.nodeName;
			var aValue = anAttr.nodeValue;
			var anAttribVal = new GameFramework.XMLParserList();
			anAttribVal.mValue = aValue;
			aCurXML.mAttributes[aKey] = anAttribVal;
			aCurXML.mAttribueNames.push(aKey);
		}
		var $enum2 = ss.IEnumerator.getEnumerator(theXmlNode.childNodes);
		while($enum2.moveNext()) {
			var aChild = $enum2.get_current();
			if(aChild.nodeType === 1) {
				var aCurXML = theXML;
				var aChildName = aChild.nodeName;
				var anElementXML = new GameFramework.XMLParser();
				anElementXML.mParent = aCurXML;
				var aGroupContainer;
				anElementXML.mName = aChildName;
				if(aCurXML.mChildren == null) {
					aCurXML.mChildren = new GameFramework.XMLParserList();
					aCurXML.mChildren.mEntries = [];
				}
				aCurXML.mChildren.mEntries.push(anElementXML);
				if(aCurXML.mGroupedChildren == null) {
					aCurXML.mGroupedChildren = new GameFramework.TDictionary();
				}
				if(aCurXML.mGroupedChildren[aChildName] == null) {
					aGroupContainer = new GameFramework.XMLParserList();
					aCurXML.mGroupedChildren[aChildName] = aGroupContainer;
				} else {
					aGroupContainer = aCurXML.mGroupedChildren[aChildName];
				}
				if(aGroupContainer.mEntries == null) {
					aGroupContainer.mEntries = [];
				}
				aGroupContainer.mEntries.push(anElementXML);
				this.ParseXMLHelper(anElementXML, aChild);
			}
		}
		//-JS
	},
	ParseXML : function GameFramework_JSBaseApp$ParseXML(theXML, theData) {
		//JS
		var anXMLDoc;
		if(!(Type.canCast(theData, String))) {
			anXMLDoc = theData;
		} else {
			anXMLDoc = ss.XmlDocumentParser.parse(theData);
		}
		var anXMLNode = anXMLDoc.documentElement;
		this.ParseXMLHelper(theXML, anXMLNode);
		//-JS
	},
	JSONUnslash : function GameFramework_JSBaseApp$JSONUnslash(theString) {
		for(var i = 0; i < theString.length - 1; i++) {
			if(theString.charCodeAt(i) == 92) {
				var aNextChar = theString.charCodeAt(i + 1);
				if((aNextChar == 117) && (i < theString.length - 5)) {
					aNextChar = System.Convert.ToChar$8(((theString.substr(i + 2, 4), 16) | 0));
					theString = theString.substr(0, i) + String.fromCharCode(aNextChar) + theString.substr(i + 6);
				} else {
					if(aNextChar == 98) {
						aNextChar = 8;
					}
					if(aNextChar == 102) {
						aNextChar = 12;
					}
					if(aNextChar == 110) {
						aNextChar = 10;
					}
					if(aNextChar == 114) {
						aNextChar = 13;
					}
					if(aNextChar == 116) {
						aNextChar = 9;
					}
					theString = theString.substr(0, i) + String.fromCharCode(aNextChar) + theString.substr(i + 2);
				}
			}
		}
		return theString;
	},
	ParseJSONHelper : function GameFramework_JSBaseApp$ParseJSONHelper(theJSONString, theDataObject, theHelperData) {
		try {
			var aDataStart = -1;
			var aLastWasSlash = false;
			var isDataQuoted = false;
			var isInQuote = false;
			var aCurName = null;
			var aCurData = null;
			var gotCurData = false;
			while(theHelperData.mStrIdx < theJSONString.length) {
				var aChar = theJSONString.charCodeAt(theHelperData.mStrIdx++);
				if(aLastWasSlash) {
					aLastWasSlash = false;
					continue;
				}
				if(aChar == 92) {
					aLastWasSlash = true;
				} else if((aChar == 34) && (!aLastWasSlash)) {
					isInQuote = !isInQuote;
					if((aCurName == null) && (Type.tryCast(theDataObject, Object))) {
						if(aDataStart == -1) {
							aDataStart = theHelperData.mStrIdx;
						} else {
							aCurName = this.JSONUnslash(theJSONString.substr(aDataStart, theHelperData.mStrIdx - aDataStart - 1));
							aDataStart = -1;
						}
					} else {
						if(aDataStart == -1) {
							isDataQuoted = true;
							aDataStart = theHelperData.mStrIdx;
						} else {
							aCurData = this.JSONUnslash(theJSONString.substr(aDataStart, theHelperData.mStrIdx - aDataStart - 1));
							aDataStart = -1;
							gotCurData = true;
						}
					}
				} else if((aDataStart != -1) && (!isDataQuoted)) {
					if((GameFramework.Utils.IsWhitespace(aChar)) || (aChar == 44) || (aChar == 125) || (aChar == 93)) {
						var aDataString = theJSONString.substr(aDataStart, theHelperData.mStrIdx - aDataStart - 1);
						if(aDataString == 'null') {
							aCurData = null;
						} else if(aDataString == 'true') {
							aCurData = true;
						} else if(aDataString == 'false') {
							aCurData = false;
						} else if((aDataString.indexOf('.') != -1)) {
							aCurData = ((aDataString) + 0.0);
						} else {
							aCurData = ((aDataString) | 0);
						}
						gotCurData = true;
						aDataStart = -1;
					}
				} else if((aDataStart == -1) && (aChar != 44) && (aChar != 58) && (aChar != 91) && (aChar != 123) && (!GameFramework.Utils.IsWhitespace(aChar))) {
					aDataStart = theHelperData.mStrIdx - 1;
					isDataQuoted = false;
				}
				if(aChar == 10) {
					++theHelperData.mLineNum;
				}
				if(!isInQuote) {
					if(aChar == 91) {
						aCurData = [];
						this.ParseJSONHelper(theJSONString, aCurData, theHelperData);
						gotCurData = true;
					}
					if(aChar == 123) {
						aCurData = {};
						this.ParseJSONHelper(theJSONString, aCurData, theHelperData);
						gotCurData = true;
					}
					if(gotCurData) {
						if(aCurName != null) {
							(theDataObject)[aCurName] = aCurData;
						} else {
							(theDataObject).push(aCurData);
						}
						aCurName = null;
						aCurData = null;
						gotCurData = false;
					}
					if(aChar == 125) {
						return;
					}
					if(aChar == 93) {
						return;
					}
				}
			}
		} catch(ex) {
			throw new GameFramework.JSONFormatException(ex, theHelperData);
		}
	},
	DecodeJSON : function GameFramework_JSBaseApp$DecodeJSON(theJSONString, theDataObject) {
		if(theJSONString.length == 0) {
			return;
		}
		var aJSONHelperData = new GameFramework.JSONHelperData();
		while((aJSONHelperData.mStrIdx < theJSONString.length) && (GameFramework.Utils.IsWhitespace(theJSONString.charCodeAt(aJSONHelperData.mStrIdx)))) {
			aJSONHelperData.mStrIdx++;
		}
		aJSONHelperData.mStrIdx++;
		this.ParseJSONHelper(theJSONString, theDataObject, aJSONHelperData);
	},
	EncodeJSON : function GameFramework_JSBaseApp$EncodeJSON(theDataObject) {
		if(theDataObject == null) {
			return 'null';
		}
		if((Type.tryCast(theDataObject, Number)) && (theDataObject == (theDataObject | 0))) {
			return GameFramework.Utils.ToString((theDataObject | 0));
		}
		if(Type.tryCast(theDataObject, Number)) {
			return String.format('{0:f}', theDataObject);
		}
		if(Type.tryCast(theDataObject, Number)) {
			return String.format('{0:f}', theDataObject);
		}
		if(Type.tryCast(theDataObject, Boolean)) {
			if(theDataObject) {
				return 'true';
			} else {
				return 'false';
			}
		}
		if(Type.tryCast(theDataObject, GameFramework.misc.JSONString)) {
			return (theDataObject).mString;
		}
		if(Type.tryCast(theDataObject, String)) {
			var aString = theDataObject;
			for(var i = 0; i < aString.length; i++) {
				var aChar = aString.charCodeAt(i);
				if(aChar == 8) {
					aString = aString.substr(0, i) + '\\b' + aString.substr(i + 1);
				}
				if(aChar == 12) {
					aString = aString.substr(0, i) + '\\f' + aString.substr(i + 1);
				}
				if(aChar == 10) {
					aString = aString.substr(0, i) + '\\n' + aString.substr(i + 1);
				}
				if(aChar == 13) {
					aString = aString.substr(0, i) + '\\r' + aString.substr(i + 1);
				}
				if(aChar == 9) {
					aString = aString.substr(0, i) + '\\t' + aString.substr(i + 1);
				}
				if(aChar == 34) {
					aString = aString.substr(0, i) + '\\"' + aString.substr(i + 1);
					i++;
				}
				if(aChar == 92) {
					aString = aString.substr(0, i) + '\\\\' + aString.substr(i + 1);
					i++;
				}
			}
			return '"' + aString + '"';
		}
		if(Type.tryCast(theDataObject, GameFramework.TArray)) {
			var aStringBuilder = "";
			var anArray = theDataObject;
			aStringBuilder += '[';
			for(var anIdx = 0; anIdx < anArray.length; anIdx++) {
				if(anIdx != 0) {
					aStringBuilder += ',';
				}
				aStringBuilder += this.EncodeJSON(anArray[anIdx]);
			}
			aStringBuilder += ']';
			return aStringBuilder.toString();
		}
		if(Type.tryCast(theDataObject, GameFramework.misc.KeyVal)) {
			var aStringBuilder_2 = "";
			var aKeyVal = theDataObject;
			aStringBuilder_2 += '{';
			aStringBuilder_2 += this.EncodeJSON(aKeyVal.mKey);
			aStringBuilder_2 += ':';
			aStringBuilder_2 += this.EncodeJSON(aKeyVal.mValue);
			aStringBuilder_2 += '}';
			return aStringBuilder_2.toString();
		}
		if(Type.tryCast(theDataObject, Array)) {
			if(((theDataObject).length > 0) && (Type.tryCast((theDataObject)[0], GameFramework.misc.KeyVal))) {
				var aStringBuilder_3 = "";
				var aKeyVals = theDataObject;
				aStringBuilder_3 += '{';
				for(var anIdx_2 = 0; anIdx_2 < aKeyVals.length; anIdx_2++) {
					if(anIdx_2 != 0) {
						aStringBuilder_3 += ',';
					}
					aStringBuilder_3 += this.EncodeJSON(aKeyVals[anIdx_2].mKey);
					aStringBuilder_3 += ':';
					aStringBuilder_3 += this.EncodeJSON(aKeyVals[anIdx_2].mValue);
				}
				aStringBuilder_3 += '}';
				return aStringBuilder_3.toString();
			} else {
				var aStringBuilder_4 = "";
				var anArray_2 = theDataObject;
				aStringBuilder_4 += '[';
				for(var anIdx_3 = 0; anIdx_3 < anArray_2.length; anIdx_3++) {
					if(anIdx_3 != 0) {
						aStringBuilder_4 += ',';
					}
					aStringBuilder_4 += this.EncodeJSON(anArray_2[anIdx_3]);
				}
				aStringBuilder_4 += ']';
				return aStringBuilder_4.toString();
			}
		}
		if((Type.safeCast(theDataObject, Object)) != null) {
			var aStringBuilder_5 = "";
			var aDict = theDataObject;
			var anIdx_4 = 0;
			aStringBuilder_5 += '{';

			for(aKey in aDict) {
				if(anIdx_4 != 0) {
					aStringBuilder_5 += ',';
				}
				if(Type.tryCast(aKey, Number)) {
					aStringBuilder_5 += this.EncodeJSON(System.Convert.ToString$8((aKey | 0)));
				} else {
					aStringBuilder_5 += this.EncodeJSON(aKey);
				}
				aStringBuilder_5 += ':';
				aStringBuilder_5 += this.EncodeJSON(aDict[aKey]);
				anIdx_4++;
			}

			aStringBuilder_5 += '}';
			return aStringBuilder_5.toString();
		}
		throw new System.Exception('Invalid JSON data format');
	},
	GetSoundInst : function GameFramework_JSBaseApp$GetSoundInst(theSoundResource) {
		var aSoundInst = new GameFramework.resources.JSSoundInstance((theSoundResource));
		return aSoundInst;
	}
}
GameFramework.JSBaseApp.staticInit = function GameFramework_JSBaseApp$staticInit() {
	GameFramework.JSBaseApp.mJSApp = null;
}

JSFExt_AddInitFunc(function() {
	GameFramework.JSBaseApp.registerClass('GameFramework.JSBaseApp', GameFramework.BaseApp);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.JSBaseApp.staticInit();
});