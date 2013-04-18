//Start:JSBaseApp
GameFramework = Type.registerNamespace('GameFramework');
/**
 * @constructor
 */
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
					} else {
					}
				}

				else {
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
							aResourceStreamer.mResultData = JSFExt_LoadImageSub(aResourceStreamer,
								aResourceStreamer.mPath ? (this.mPathPrefix + aResourceStreamer.mPath) : null,
								aResourceStreamer.mPath2 ? (this.mPathPrefix + aResourceStreamer.mPath2) : null);
						} else {
							aResourceStreamer.mResultData = JSFExt_LoadImage(aResourceStreamer,
								aResourceStreamer.mPath ? (this.mPathPrefix + aResourceStreamer.mPath) : null,
								aResourceStreamer.mPath2 ? (this.mPathPrefix + aResourceStreamer.mPath2) : null);
						}
					}
				} else if(aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_SOUND) {
					var aPath = aResourceStreamer.mPath;
					if(aPath.indexOf('.') === -1) {
						aPath += aResourceStreamer.mBaseRes.mExtensions[0];
					}
					aResourceStreamer.mResultData = JSFExt_LoadAudio(aResourceStreamer, aPath);
					this.mResourceManager.ResourceLoaded(aResourceStreamer);
				} else if(aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_FONT ||
						aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_POPANIM ||
						aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_PIEFFECT ||
						aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_MESH ||
						aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_RENDEREFFECT ||
						aResourceStreamer.mResType === GameFramework.resources.ResourceManager.RESTYPE_BINFILE) {
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
								if(!JFSExt_IsGetBinarySupported()) {
									var aDotBinPos = aGetPath.indexOf('.bin');
									if(aDotBinPos != -1) {
										aGetPath = aGetPath.substr(0, aDotBinPos) + ".utf8";
									}
								}

								aRequest = JFSExt_GetBinaryGroupData(aResourceStreamer, aGroupBinDataName, aGetPath);
							}
						} else {
							aRequest = JFSExt_GetBinary(aResourceStreamer, this.mPathPrefix + aResourceStreamer.mPath);
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
				}

				else {
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
						}

						else {
							aCurName = this.JSONUnslash(theJSONString.substr(aDataStart, theHelperData.mStrIdx - aDataStart - 1));
							aDataStart = -1;
						}
					}

					else {
						if(aDataStart == -1) {
							isDataQuoted = true;
							aDataStart = theHelperData.mStrIdx;
						}

						else {
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
						}

						else {
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
			}

			else {
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

			{
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

JS_AddInitFunc(function() {
	GameFramework.JSBaseApp.registerClass('GameFramework.JSBaseApp', GameFramework.BaseApp);
});
JS_AddStaticInitFunc(function() {
	GameFramework.JSBaseApp.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\JSGameFramework\JSBaseApp.cs
//LineMap:2=17 3=33 6=34 8=21 9=27 11=35 19=23 29=31 32=39 91=99 95=122 102=123 108=130 114=148 119=156 121=157 124=158 128=225 135=233 143=243 146=249 149=253 157=262 158=264 160=267 276=386 278=396 287=404 290=408 294=413 300=420 304=425 313=435 317=440 319=443 326=451 
//LineMap:333=459 340=467 347=475 354=483 359=490 456=586 470=601 478=608 482=613 485=617 488=621 493=627 496=631 497=633 506=641 513=647 521=654 527=656 529=662 534=668 535=668 536=670 537=670 538=672 541=676 545=677 547=682 550=686 552=689 560=698 566=705 575=713 577=716 
//LineMap:581=721 587=728 589=731 597=740 601=746 656=802 660=807 668=816 670=819 674=824 679=830 681=833 687=840 697=851 702=855 704=858 712=867 715=871 718=875 719=877 723=879 736=891 737=893 739=896 
//Start:JSDataBufferData
/**
 * @constructor
 */
GameFramework.JSDataBufferData = function GameFramework_JSDataBufferData() {
	GameFramework.JSDataBufferData.initializeBase(this);
}
GameFramework.JSDataBufferData.prototype = {
	mData : null,
	get_DataLength : function GameFramework_JSDataBufferData$get_DataLength() {
		return this.mData.length;
	},
	ReadByte : function GameFramework_JSDataBufferData$ReadByte() {
		return ((this.mData.charCodeAt(this.mPosition++) & 0xff) | 0);
	},
	InitRead : function GameFramework_JSDataBufferData$InitRead(theData) {
		//JS
		if(typeof(theData) == "string") {
			this.mData = theData;
			return;
		}
		//-JS
		this.mData = '';
		for(var i = 0; i < theData.length; i++) {
			this.mData = this.mData + String.fromCharCode((theData[i] | 0));
		}
	},
	ReadFloat : function GameFramework_JSDataBufferData$ReadFloat() {
		var n = this.ReadInt();
		//JS
		var sign = (n >> 31) * 2 + 1
		var expo = (n >>> 23) & 0xFF
		var mant = n & 0x007FFFFF
		if(expo === 0xFF) return mant ? NaN : sign / 0
		expo ? ( expo -= 127, mant |= 0x00800000 ) : expo = -126
		return sign * mant * Math.pow(2, expo - 23)
		//-JS
		return 0;
	},
	ReadDouble : function GameFramework_JSDataBufferData$ReadDouble() {
		//JS
		var mantI = this.ReadInt();
		var n = this.ReadInt() << 32;
		var sign = (n >> 31) * 2 + 1
		var expo = (n >>> 20) & 0x7FF

		var mant = (mantI & 0x7FFFFFFF);
		if(mantI & 0x80000000) {
			mant += 2147483648.0;
		}
		mant += (n & 0xFFFFF) * 4294967296.0;

		if(expo === 0x7FF) return mant ? NaN : sign / 0
		expo ? ( expo -= 1023, mant += 4503599627370496.0) : expo = -1022
		return sign * mant * Math.pow(2, expo - 52)
		//-JS
		return 0;
	},
	ReadShort : function GameFramework_JSDataBufferData$ReadShort() {
		var a = this.ReadByte();
		var b = this.ReadByte();
		var aVal = ((a | (b << 8)) | 0);
		if((aVal & 0x8000) != 0) {
			aVal |= 0xffff0000;
		}
		return (aVal | 0);
	}
}
GameFramework.JSDataBufferData.staticInit = function GameFramework_JSDataBufferData$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.JSDataBufferData.registerClass('GameFramework.JSDataBufferData', GameFramework.DataBufferData);
});
JS_AddStaticInitFunc(function() {
	GameFramework.JSDataBufferData.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\JSGameFramework\JSDataBufferData.cs
//LineMap:2=5 13=9 76=73 78=76 
//Start:gfx\JSGraphics
GameFramework.gfx = Type.registerNamespace('GameFramework.gfx');
/**
 * @constructor
 */
GameFramework.gfx.JSGraphics = function GameFramework_gfx_JSGraphics(theWidth, theHeight) {
	GameFramework.gfx.JSGraphics.initializeBase(this, [theWidth, theHeight]);
}
GameFramework.gfx.JSGraphics.prototype = {
	mLastColor : 0,
	mLastColorStr : '#800000',
	GetColorString : function GameFramework_gfx_JSGraphics$GetColorString() {
		if(this.mColor != this.mLastColor) {
			this.mLastColorStr = 'rgba(' + ((this.mColor >>> 16) & 0xff) + ',' + ((this.mColor >>> 8) & 0xff) + ',' + ((this.mColor) & 0xff) + ',' + (((this.mColor >>> 24) & 0xff) / 255.0) + ')';
			this.mLastColor = this.mColor;
		}
		return this.mLastColorStr;
	},
	FillRect : function GameFramework_gfx_JSGraphics$FillRect(x, y, w, h) {
		var aColorStr = this.GetColorString();
		if(GameFramework.JSBaseApp.mJSApp.mUseGL) {
			//JS
			var aStartX = ((x * this.mMatrix.a + this.mMatrix.tx) * this.mScale) | 0;
			var aStartY = ((y * this.mMatrix.d + this.mMatrix.ty) * this.mScale) | 0;
			var anEndX = ((((x + w) * this.mMatrix.a) + this.mMatrix.tx) * this.mScale) | 0;
			var anEndY = ((((y + h) * this.mMatrix.d) + this.mMatrix.ty) * this.mScale) | 0;
			JSFExt_GLDraw(gWhiteDotTex, aStartX, aStartY, 1, 0, 0, 1, 0, 0, anEndX - aStartX, anEndY - aStartY, 1, 1, false, this.mColor);
			//-JS
		}

		else {
			//JS
			var ctx = document.getElementById('GameCanvas').getContext('2d');
			ctx.fillStyle = aColorStr;
			ctx.globalAlpha = 1.0;
			gCanvasAlpha = 1.0;
			if((this.mMatrix.b == 0) && (this.mMatrix.c == 0)) {
				var aScaleX = this.mScale * this.mMatrix.a;
				var aScaleY = this.mScale * this.mMatrix.d;

				var aStartX = (this.mMatrix.tx * this.mScale + x * aScaleX) | 0;
				var aStartY = (this.mMatrix.ty * this.mScale + y * aScaleY) | 0;
				var anEndX = (this.mMatrix.tx * this.mScale + (x + w) * aScaleX) | 0;
				var anEndY = (this.mMatrix.ty * this.mScale + (y + h) * aScaleY) | 0;
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.fillRect(aStartX, aStartY, anEndX - aStartX, anEndY - aStartY);
				gCanvasHasTrans = false;
			} else {
				var aNewMatrix = new GameFramework.geom.Matrix();
				aNewMatrix.identity();
				aNewMatrix.tx = x;
				aNewMatrix.ty = y;
				aNewMatrix.a = w;
				aNewMatrix.d = h;
				aNewMatrix.concat(this.mMatrix);

				ctx.setTransform(aNewMatrix.a, aNewMatrix.b, aNewMatrix.c, aNewMatrix.d, aNewMatrix.tx, aNewMatrix.ty);
				ctx.fillRect(0, 0, 1, 1);
				gCanvasHasTrans = true;
			}
			//-JS
		}
	},
	PolyFill : function GameFramework_gfx_JSGraphics$PolyFill(thePoints) {
		for(var aPtIdx = 0; aPtIdx < (((thePoints.length / 2) | 0)) - 2; aPtIdx++) {
			var aX1 = (this.mMatrix.tx + this.mMatrix.a * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 0] + this.mMatrix.c * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 1]) * this.mScale;
			var aY1 = (this.mMatrix.ty + this.mMatrix.c * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 0] + this.mMatrix.d * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 1]) * this.mScale;
			var aX2 = (this.mMatrix.tx + this.mMatrix.a * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 2] + this.mMatrix.c * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 3]) * this.mScale;
			var aY2 = (this.mMatrix.ty + this.mMatrix.c * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 2] + this.mMatrix.d * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 3]) * this.mScale;
			var aX3 = (this.mMatrix.tx + this.mMatrix.a * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 4] + this.mMatrix.c * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 5]) * this.mScale;
			var aY3 = (this.mMatrix.ty + this.mMatrix.c * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 4] + this.mMatrix.d * thePoints[thePoints.mIdxMult0 * (aPtIdx) + 5]) * this.mScale;
			if(GameFramework.JSBaseApp.mJSApp.mUseGL) {
				//JS
				JSFExt_GLDrawTri(gWhiteDotTex, aX1, aY1, aX2, aY2, aX3, aY3, false, this.mColor);
				//-JS
			}

			else {
				var aColorStr = this.GetColorString();
				//JS
				var ctx = document.getElementById('GameCanvas').getContext('2d');
				ctx.fillStyle = aColorStr;
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.beginPath();
				ctx.moveTo(aX1, aY1);
				ctx.lineTo(aX2, aY2);
				ctx.lineTo(aX3, aY3);
				ctx.closePath();
				ctx.fill();
				//-JS
			}
		}
	},
	DrawTrianglesTex : function GameFramework_gfx_JSGraphics$DrawTrianglesTex(theImage, theVertices) {
		for(var aVtxIdx = 0; aVtxIdx < ((theVertices.length / 3) | 0); aVtxIdx++) {
			var aX1 = (this.mMatrix.tx + this.mMatrix.a * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 0].x + this.mMatrix.c * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 0].y) * this.mScale;
			var aY1 = (this.mMatrix.ty + this.mMatrix.c * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 0].x + this.mMatrix.d * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 0].y) * this.mScale;
			var aX2 = (this.mMatrix.tx + this.mMatrix.a * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 1].x + this.mMatrix.c * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 1].y) * this.mScale;
			var aY2 = (this.mMatrix.ty + this.mMatrix.c * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 1].x + this.mMatrix.d * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 1].y) * this.mScale;
			var aX3 = (this.mMatrix.tx + this.mMatrix.a * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 2].x + this.mMatrix.c * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 2].y) * this.mScale;
			var aY3 = (this.mMatrix.ty + this.mMatrix.c * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 2].x + this.mMatrix.d * theVertices[theVertices.mIdxMult0 * (aVtxIdx) + 2].y) * this.mScale;
			if(GameFramework.JSBaseApp.mJSApp.mUseGL) {
				//JS
				JSFExt_GLDrawTriTex(theImage.mGLTex, aX1, aY1, (theVertices[aVtxIdx * 3 + 0].u * theImage.mPhysCelWidth + theImage.mTexOfsX) / theImage.mTexWidth, (theVertices[aVtxIdx * 3 + 0].v * theImage.mPhysCelHeight + theImage.mTexOfsY) / theImage.mTexHeight, theVertices[aVtxIdx * 3 + 0].color, aX2, aY2, (theVertices[aVtxIdx * 3 + 1].u * theImage.mPhysCelWidth + theImage.mTexOfsX) / theImage.mTexWidth, (theVertices[aVtxIdx * 3 + 1].v * theImage.mPhysCelHeight + theImage.mTexOfsY) / theImage.mTexHeight, theVertices[aVtxIdx * 3 + 1].color, aX3, aY3, (theVertices[aVtxIdx * 3 + 2].u * theImage.mPhysCelWidth + theImage.mTexOfsX) / theImage.mTexWidth, (theVertices[aVtxIdx * 3 + 2].v * theImage.mPhysCelHeight + theImage.mTexOfsY) / theImage.mTexHeight, theVertices[aVtxIdx * 3 + 2].color, theImage.mAdditive);
				//-JS
			}
		}
	},
	Begin3DScene : function GameFramework_gfx_JSGraphics$Begin3DScene(theViewMatrix, theWorldMatrix, theProjectionMatrix) {
		if(theViewMatrix === undefined) theViewMatrix = null;
		if(theWorldMatrix === undefined) theWorldMatrix = null;
		if(theProjectionMatrix === undefined) theProjectionMatrix = null;
		//JS
		JSFExt_Begin3DScene();
		//-JS
		var aGraphics3D = new GameFramework.gfx.JSGraphics3D(this);
		if(theViewMatrix != null) {
			aGraphics3D.SetViewTransform(theViewMatrix);
		}
		if(theWorldMatrix != null) {
			aGraphics3D.SetViewTransform(theWorldMatrix);
		}
		if(theProjectionMatrix != null) {
			aGraphics3D.SetViewTransform(theProjectionMatrix);
		}
		return aGraphics3D;
	},
	End3DScene : function GameFramework_gfx_JSGraphics$End3DScene(theGraphics3D) {
		//JS
		JSFExt_End3DScene();
		//-JS
	}
}
GameFramework.gfx.JSGraphics.staticInit = function GameFramework_gfx_JSGraphics$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.gfx.JSGraphics.registerClass('GameFramework.gfx.JSGraphics', GameFramework.gfx.Graphics);
});
JS_AddStaticInitFunc(function() {
	GameFramework.gfx.JSGraphics.staticInit();
});
/**
 * @constructor
 */
GameFramework.gfx.JSGraphics3D = function GameFramework_gfx_JSGraphics3D(aJSGraphics) {
	this.mViewMatrix = new GameFramework.geom.Matrix3D();
	this.mWorldMatrix = new GameFramework.geom.Matrix3D();
	this.mProjMatrix = new GameFramework.geom.Matrix3D();
	this.mWrapU = Array.Create(3, 3, false, false, false);
	this.mWrapV = Array.Create(3, 3, false, false, false);
	GameFramework.gfx.JSGraphics3D.initializeBase(this, [aJSGraphics]);
}
GameFramework.gfx.JSGraphics3D.prototype = {
	mViewMatrix : null,
	mWorldMatrix : null,
	mProjMatrix : null,
	mWrapU : null,
	mWrapV : null,
	Setup2DDrawing : function GameFramework_gfx_JSGraphics3D$Setup2DDrawing(theDrawDepth) {
		if(theDrawDepth === undefined) theDrawDepth = 0.0;
		//JS
		JSFXExt_Setup2DDrawing(theDrawDepth);
		//-JS
	},
	End2DDrawing : function GameFramework_gfx_JSGraphics3D$End2DDrawing() {
		//JS
		JSFXExt_End2DDrawing();
		//-JS
	},
	SetViewTransform : function GameFramework_gfx_JSGraphics3D$SetViewTransform(theTransform) {
		this.mViewMatrix.CopyFrom(theTransform);
	},
	SetProjectionTransform : function GameFramework_gfx_JSGraphics3D$SetProjectionTransform(theTransform) {
		this.mProjMatrix.CopyFrom(theTransform);
	},
	SetWorldTransform : function GameFramework_gfx_JSGraphics3D$SetWorldTransform(theTransform) {
		this.mWorldMatrix.CopyFrom(theTransform);
	},
	SetTexture : function GameFramework_gfx_JSGraphics3D$SetTexture(inTextureIndex, inImage) {
		//JS
		if(inTextureIndex != 0) {
			gGL.activeTexture(gGL.TEXTURE0 + inTextureIndex);
		}
		if(inImage != null) {
			gGL.bindTexture(gGL.TEXTURE_2D, inImage.mGLTex);
			gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_S, this.mWrapU[inTextureIndex] ? gGL.REPEAT : gGL.CLAMP_TO_EDGE);
			gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_T, this.mWrapV[inTextureIndex] ? gGL.REPEAT : gGL.CLAMP_TO_EDGE);
		} else {
			gGL.bindTexture(gGL.TEXTURE_2D, null);
		}
		if(inTextureIndex != 0) {
			gGL.activeTexture(gGL.TEXTURE0);
		}
		//-JS
		return true;
	},
	SetTextureWrap : function GameFramework_gfx_JSGraphics3D$SetTextureWrap(inTextureIndex, inWrap) {
		if(inWrap === undefined) inWrap = true;
		this.SetTextureWrapUV(inTextureIndex, inWrap, inWrap);
	},
	SetTextureWrapUV : function GameFramework_gfx_JSGraphics3D$SetTextureWrapUV(inTextureIndex, inWrapU, inWrapV) {
		if(inWrapU === undefined) inWrapU = true;
		if(inWrapV === undefined) inWrapV = true;
		this.mWrapU[inTextureIndex] = inWrapU;
		this.mWrapV[inTextureIndex] = inWrapV;
	},
	SetBlend : function GameFramework_gfx_JSGraphics3D$SetBlend(theSrcBlend, theDestBlend) {
		//JS
		JSFExt_SetBlend(theSrcBlend, theDestBlend);
		//-JS
	},
	SetBackfaceCulling : function GameFramework_gfx_JSGraphics3D$SetBackfaceCulling(cullClockwise, cullCounterClockwise) {
		if(cullClockwise || cullCounterClockwise) {
			//JS
			gGL.enable(gGL.CULL_FACE);
			if(cullClockwise & cullCounterClockwise) {
				gGL.cullFace(gGL.FRONT_AND_BACK);
			} else if(cullClockwise) {
				gGL.cullFace(gGL.BACK);
			} else if(cullCounterClockwise) {
				gGL.cullFace(gGL.FRONT);
			}
			//-JS
		}

		else {
			//JS
			gGL.disable(gGL.CULL_FACE);
			//-JS
		}
	},
	SetDepthState : function GameFramework_gfx_JSGraphics3D$SetDepthState(theDepthCompare, depthWriteEnable) {
		//JS            
		if(depthWriteEnable || (theDepthCompare != GameFramework.gfx.Graphics3D.ECompareFunc.Always)) {
			gGL.enable(gGL.DEPTH_TEST);

			if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.Always) {
				gGL.depthFunc(gGL.ALWAYS);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.Less) {
				gGL.depthFunc(gGL.LESS);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.LessEqual) {
				gGL.depthFunc(gGL.LEQUAL);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.Greater) {
				gGL.depthFunc(gGL.GREATER);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.GreaterEqual) {
				gGL.depthFunc(gGL.GEQUAL);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.Equal) {
				gGL.depthFunc(gGL.EQUAL);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.Never) {
				gGL.depthFunc(gGL.NEVER);
			}
		}

		gGL.depthMask(depthWriteEnable);
		//-JS
	},
	ClearDepthBuffer : function GameFramework_gfx_JSGraphics3D$ClearDepthBuffer() {
		//JS
		gGL.depthMask(true);
		gGL.clearDepth(1.0);
		gGL.clear(gGL.DEPTH_BUFFER_BIT);
		//-JS
	},
	RenderMesh : function GameFramework_gfx_JSGraphics3D$RenderMesh(theMeshResource) {
		//JS
		JSFXExt_RenderMesh(this, theMeshResource, this.mWorldMatrix, this.mViewMatrix, this.mProjMatrix);
		//-JS
	}
}
GameFramework.gfx.JSGraphics3D.staticInit = function GameFramework_gfx_JSGraphics3D$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.gfx.JSGraphics3D.registerClass('GameFramework.gfx.JSGraphics3D', GameFramework.gfx.Graphics3D);
});
JS_AddStaticInitFunc(function() {
	GameFramework.gfx.JSGraphics3D.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\JSGameFramework\gfx\JSGraphics.cs
//LineMap:2=3 3=13 6=15 8=14 12=10 15=18 20=27 22=30 28=37 39=51 77=98 79=102 83=107 85=110 87=113 96=121 112=142 122=153 137=166 138=166 139=166 143=174 166=192 169=201 171=194 176=200 186=205 188=205 194=212 234=254 239=257 240=259 245=262 246=262 247=264 281=297 
//Start:resources\JSImageInst
GameFramework.resources = Type.registerNamespace('GameFramework.resources');
/**
 * @constructor
 */
GameFramework.resources.JSImageInst = function GameFramework_resources_JSImageInst(theImageResource) {
	GameFramework.resources.JSImageInst.initializeBase(this, [theImageResource]);
}
GameFramework.resources.JSImageInst.prototype = {

	DrawEx : function GameFramework_resources_JSImageInst$DrawEx(g, theMatrix, theX, theY, theCel) {
		if((this.mSrcWidth == 0) || (this.mSrcHeight == 0)) {
			return;
		}
		var aGlobalAlpha = (g.mColor >>> 24) / 255.0;
		var aNewMatrix = new GameFramework.geom.Matrix();
		aNewMatrix.tx = theX;
		aNewMatrix.ty = theY;
		aNewMatrix.concat(theMatrix);
		aNewMatrix.tx *= g.mScale;
		aNewMatrix.ty *= g.mScale;
		if((this.mPixelSnapping == GameFramework.resources.PixelSnapping.Always) || ((this.mPixelSnapping == GameFramework.resources.PixelSnapping.Auto) && (aNewMatrix.a == 1) && (aNewMatrix.b == 0) && (aNewMatrix.c == 0) && (aNewMatrix.d == 1))) {
			var aSnappedX = (((aNewMatrix.tx) | 0));
			var aSnappedY = (((aNewMatrix.ty) | 0));
			if(this.mSizeSnapping) {
				aNewMatrix.a = ((((aNewMatrix.tx + this.mSrcWidth * aNewMatrix.a) | 0)) - aSnappedX) / this.mSrcWidth;
				aNewMatrix.d = ((((aNewMatrix.ty + this.mSrcHeight * aNewMatrix.d) | 0)) - aSnappedY) / this.mSrcHeight;
			}
			aNewMatrix.tx = aSnappedX;
			aNewMatrix.ty = aSnappedY;
		}
		if(GameFramework.JSBaseApp.mJSApp.mUseGL) {
			//JS               
			JSFExt_GLDraw(this.mSource.mGLTex, aNewMatrix.tx, aNewMatrix.ty, aNewMatrix.a, aNewMatrix.b, aNewMatrix.c, aNewMatrix.d, this.mSrcX + this.mSource.mTexOfsX, this.mSrcY + this.mSource.mTexOfsY, this.mSrcWidth, this.mSrcHeight, this.mSource.mTexWidth, this.mSource.mTexHeight, this.mAdditive, g.mColor);
			//-JS
		}

		else {
			//JS
			JSFExt_CanvasDraw(this.mSource.mHTMLImageResource, aGlobalAlpha, this.mAdditive, aNewMatrix.a, aNewMatrix.b, aNewMatrix.c, aNewMatrix.d, aNewMatrix.tx, aNewMatrix.ty, this.mSource.mTexOfsX + this.mSrcX, this.mSource.mTexOfsY + this.mSrcY, this.mSrcWidth, this.mSrcHeight);
			//-JS
		}
	}
}
GameFramework.resources.JSImageInst.staticInit = function GameFramework_resources_JSImageInst$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSImageInst.registerClass('GameFramework.resources.JSImageInst', GameFramework.resources.ImageInst);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSImageInst.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\JSGameFramework\resources\JSImageInst.cs
//LineMap:2=7 3=9 6=10 8=9 17=19 18=21 22=26 24=29 26=32 28=35 33=41 36=45 
//Start:resources\JSImageResource
/**
 * @constructor
 */
GameFramework.resources.JSImageResource = function GameFramework_resources_JSImageResource() {
	GameFramework.resources.JSImageResource.initializeBase(this);
}
GameFramework.resources.JSImageResource.prototype = {
	mHTMLImageResource : null,
	mColorImage : null,
	mAlphaImage : null,
	mGLTex : null,
	mCompositeImageData : null,
	mOwnsImageData : null,
	mTexOfsX : 0,
	mTexOfsY : 0,
	mTexWidth : 0,
	mTexHeight : 0,
	DrawEx : function GameFramework_resources_JSImageResource$DrawEx(g, theMatrix, theX, theY, theCel) {
		var aCol = (((theCel | 0) % this.mCols) | 0);
		var aRow = (((((theCel | 0) / this.mCols) | 0)) | 0);
		var aColPX = this.mPhysCelWidth;
		var aRowPX = this.mPhysCelHeight;
		var aNewMatrix = new GameFramework.geom.Matrix();
		aNewMatrix.identity();
		aNewMatrix.tx = theX;
		aNewMatrix.ty = theY;
		aNewMatrix.concat(theMatrix);
		aNewMatrix.tx *= g.mScale;
		aNewMatrix.ty *= g.mScale;
		if((this.mPixelSnapping == GameFramework.resources.PixelSnapping.Always) || ((this.mPixelSnapping == GameFramework.resources.PixelSnapping.Auto) && (aNewMatrix.a == 1) && (aNewMatrix.b == 0) && (aNewMatrix.c == 0) && (aNewMatrix.d == 1))) {
			var aSnappedX = Math.round(aNewMatrix.tx);
			var aSnappedY = Math.round(aNewMatrix.ty);
			if(this.mSizeSnapping) {
				aNewMatrix.a = (Math.round(aNewMatrix.tx + this.mPhysCelWidth * aNewMatrix.a) - aSnappedX) / this.mPhysCelWidth;
				aNewMatrix.d = (Math.round(aNewMatrix.ty + this.mPhysCelHeight * aNewMatrix.d) - aSnappedY) / this.mPhysCelHeight;
			}
			aNewMatrix.tx = aSnappedX;
			aNewMatrix.ty = aSnappedY;
		}
		var aJSGraphics = g;
		if(GameFramework.JSBaseApp.mJSApp.mUseGL) {
			//JS                
			JSFExt_GLDraw(this.mGLTex, aNewMatrix.tx, aNewMatrix.ty, aNewMatrix.a, aNewMatrix.b, aNewMatrix.c, aNewMatrix.d, aCol * aColPX + this.mTexOfsX, aRow * aRowPX + this.mTexOfsY, aColPX, aRowPX, this.mTexWidth, this.mTexHeight, this.mAdditive, g.mColor);
			//-JS
		}

		else {
			var aGlobalAlpha = (g.mColor >>> 24) / 255.0;
			//JS                                            
			JSFExt_CanvasDraw(this.mHTMLImageResource, aGlobalAlpha, this.mAdditive, aNewMatrix.a, aNewMatrix.b, aNewMatrix.c, aNewMatrix.d, aNewMatrix.tx, aNewMatrix.ty, this.mTexOfsX + aCol * aColPX, this.mTexOfsY + aRow * aRowPX, aColPX, aRowPX);
			//-JS
		}
	},
	Dispose : function GameFramework_resources_JSImageResource$Dispose() {
		GameFramework.resources.ImageResource.prototype.Dispose.apply(this);
		if((this.mGLTex != null) && (this.mOwnsImageData)) {
			//JS
			gGL.deleteTexture(this.mGLTex);
			//-JS
		}
		this.mGLTex = null;
		this.mHTMLImageResource = null;
	},
	CreateImageInst : function GameFramework_resources_JSImageResource$CreateImageInst() {
		var anImageInst = new GameFramework.resources.JSImageInst(this);
		anImageInst.mSrcX = 0;
		anImageInst.mSrcY = 0;
		anImageInst.mSrcWidth = this.mPhysCelWidth;
		anImageInst.mSrcHeight = this.mPhysCelHeight;
		return anImageInst;
	},
	CreateImageInstCel : function GameFramework_resources_JSImageResource$CreateImageInstCel(theCel) {
		var aCol = theCel % this.mCols;
		var aRow = ((theCel / this.mCols) | 0);
		var anImageInst = new GameFramework.resources.JSImageInst(this);
		anImageInst.mSrcX = aCol * this.mPhysCelWidth;
		anImageInst.mSrcY = aRow * this.mPhysCelHeight;
		anImageInst.mSrcWidth = this.mPhysCelWidth;
		anImageInst.mSrcHeight = this.mPhysCelHeight;
		return anImageInst;
	},
	CreateImageInstRect : function GameFramework_resources_JSImageResource$CreateImageInstRect(theSrcX, theSrcY, theSrcWidth, theSrcHeight) {
		var anImageInst = new GameFramework.resources.JSImageInst(this);
		anImageInst.mSrcX = theSrcX;
		anImageInst.mSrcY = theSrcY;
		anImageInst.mSrcWidth = theSrcWidth;
		anImageInst.mSrcHeight = theSrcHeight;
		return anImageInst;
	}
}
GameFramework.resources.JSImageResource.staticInit = function GameFramework_resources_JSImageResource$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSImageResource.registerClass('GameFramework.resources.JSImageResource', GameFramework.resources.ImageResource);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSImageResource.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\JSGameFramework\resources\JSImageResource.cs
//LineMap:2=3 17=16 24=25 28=30 33=36 35=39 37=42 39=45 44=51 47=55 48=57 57=65 69=78 75=85 93=104 
//Start:resources\JSMeshResource
/**
 * @constructor
 */
GameFramework.resources.JSMeshPiece = function GameFramework_resources_JSMeshPiece() {
	GameFramework.resources.JSMeshPiece.initializeBase(this);
}
GameFramework.resources.JSMeshPiece.prototype = {
	mXYZArray : null,
	mNormalArray : null,
	mColorArray : null,
	mTexCoords0Array : null,
	mTexCoords1Array : null,
	mIndexBuffer : null
}
GameFramework.resources.JSMeshPiece.staticInit = function GameFramework_resources_JSMeshPiece$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSMeshPiece.registerClass('GameFramework.resources.JSMeshPiece', GameFramework.resources.MeshPiece);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSMeshPiece.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.JSMeshResource = function GameFramework_resources_JSMeshResource() {
	GameFramework.resources.JSMeshResource.initializeBase(this);
}
GameFramework.resources.JSMeshResource.prototype = {

	CreateMeshPiece : function GameFramework_resources_JSMeshResource$CreateMeshPiece() {
		return new GameFramework.resources.JSMeshPiece();
	},
	LoadMesh : function GameFramework_resources_JSMeshResource$LoadMesh(theDataBuffer, theParentStreamer) {
		if(!GameFramework.resources.MeshResource.prototype.LoadMesh.apply(this, [theDataBuffer, theParentStreamer])) {
			return false;
		}
		//JS
		JSFExt_SetupMesh(this);
		//-JS
		return true;
	}
}
GameFramework.resources.JSMeshResource.staticInit = function GameFramework_resources_JSMeshResource$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSMeshResource.registerClass('GameFramework.resources.JSMeshResource', GameFramework.resources.MeshResource);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSMeshResource.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\JSGameFramework\resources\JSMeshResource.cs
//LineMap:2=8 24=18 34=20 46=33 
//Start:resources\JSRenderEffect
/**
 * @constructor
 */
GameFramework.resources.JSRenderEffectBlock = function GameFramework_resources_JSRenderEffectBlock(theCount, theOffset, theSize) {
	this.mCount = theCount;
	this.mOffset = theOffset;
	this.mSize = theSize;
}
GameFramework.resources.JSRenderEffectBlock.prototype = {
	mCount : 0,
	mOffset : 0,
	mSize : 0
}
GameFramework.resources.JSRenderEffectBlock.staticInit = function GameFramework_resources_JSRenderEffectBlock$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSRenderEffectBlock.registerClass('GameFramework.resources.JSRenderEffectBlock', null);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSRenderEffectBlock.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.JSRenderEffectPass = function GameFramework_resources_JSRenderEffectPass() {
}
GameFramework.resources.JSRenderEffectPass.prototype = {
	mGLProgram : null
}
GameFramework.resources.JSRenderEffectPass.staticInit = function GameFramework_resources_JSRenderEffectPass$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSRenderEffectPass.registerClass('GameFramework.resources.JSRenderEffectPass', null);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSRenderEffectPass.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.JSRenderEffectTechnique = function GameFramework_resources_JSRenderEffectTechnique() {
	this.mPasses = [];
}
GameFramework.resources.JSRenderEffectTechnique.prototype = {
	mPasses : null
}
GameFramework.resources.JSRenderEffectTechnique.staticInit = function GameFramework_resources_JSRenderEffectTechnique$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSRenderEffectTechnique.registerClass('GameFramework.resources.JSRenderEffectTechnique', null);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSRenderEffectTechnique.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.JSRenderEffectRunHandle = function GameFramework_resources_JSRenderEffectRunHandle(theRenderEffect) {
	GameFramework.resources.JSRenderEffectRunHandle.initializeBase(this, [theRenderEffect]);
}
GameFramework.resources.JSRenderEffectRunHandle.prototype = {
	mTechnique : null,
	get_NumPasses : function GameFramework_resources_JSRenderEffectRunHandle$get_NumPasses() {
		return this.mTechnique.mPasses.length;
	}
}
GameFramework.resources.JSRenderEffectRunHandle.staticInit = function GameFramework_resources_JSRenderEffectRunHandle$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSRenderEffectRunHandle.registerClass('GameFramework.resources.JSRenderEffectRunHandle', GameFramework.resources.RenderEffectRunHandle);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSRenderEffectRunHandle.staticInit();
});
/**
 * @constructor
 */
GameFramework.resources.JSRenderEffect = function GameFramework_resources_JSRenderEffect() {
	this.mSettings = {};
	this.mTechniques = {};
	GameFramework.resources.JSRenderEffect.initializeBase(this);
}
GameFramework.resources.JSRenderEffect.prototype = {
	mDataBuffer : null,
	mTechniqueReadData : null,
	mAnnotationData : null,
	mStringsData : null,
	mValuesData : null,
	mPassesData : null,
	mSettingsData : null,
	mShadersData : null,
	mStringDataOffset : 0,
	mSettings : null,
	mCurPass : null,
	mTechniques : null,
	GetString : function GameFramework_resources_JSRenderEffect$GetString(theIndex) {
		if(theIndex == -1) {
			return null;
		}
		this.mDataBuffer.set_Position(this.mStringsData.mOffset + theIndex * 4 * 3);
		var aNumChars = this.mDataBuffer.ReadInt();
		var aFormat = this.mDataBuffer.ReadInt();
		var anOffset = this.mDataBuffer.ReadInt();
		this.mDataBuffer.set_Position(this.mStringDataOffset + anOffset);
		return this.mDataBuffer.ReadAsciiBytes(aNumChars);
	},
	ReadShader : function GameFramework_resources_JSRenderEffect$ReadShader(theShaderIdx) {
		if(theShaderIdx == -1) {
			return null;
		}
		this.mDataBuffer.set_Position(this.mShadersData.mOffset + theShaderIdx * 4 * 3);
		var aFormatStrIdx = this.mDataBuffer.ReadInt();
		var aDataStrIdx = this.mDataBuffer.ReadInt();
		var anEntryStrIdx = this.mDataBuffer.ReadInt();
		var aFormat = this.GetString(aFormatStrIdx);
		var aData = this.GetString(aDataStrIdx);
		var anEntry = this.GetString(anEntryStrIdx);
		return aData;
	},
	ReadData : function GameFramework_resources_JSRenderEffect$ReadData(theDataBuffer) {
		this.mDataBuffer = theDataBuffer;
		var anId = theDataBuffer.ReadInt();
		var aVersion = theDataBuffer.ReadInt();
		this.mTechniqueReadData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mAnnotationData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mStringsData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mValuesData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mPassesData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mSettingsData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mShadersData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mStringDataOffset = theDataBuffer.ReadInt();
		for(var aTechniqueIdx = 0; aTechniqueIdx < this.mTechniqueReadData.mCount; aTechniqueIdx++) {
			this.mDataBuffer.set_Position(this.mTechniqueReadData.mOffset + aTechniqueIdx * 4 * 6);
			var aJSRenderEffectTechnique = new GameFramework.resources.JSRenderEffectTechnique();
			var aNameStrIdx = this.mDataBuffer.ReadInt();
			var aTechniqueNum = this.mDataBuffer.ReadInt();
			var aNumPasses = this.mDataBuffer.ReadInt();
			var aPassStartIdx = this.mDataBuffer.ReadInt();
			var aNumAnnotations = this.mDataBuffer.ReadInt();
			var anAnnotationStartIdx = this.mDataBuffer.ReadInt();
			var aName = this.GetString(aNameStrIdx);
			for(var aPassIdx = 0; aPassIdx < aNumPasses; aPassIdx++) {
				this.mDataBuffer.set_Position(this.mPassesData.mOffset + (aPassStartIdx + aPassIdx) * 4 * 7);
				var aPassNameStrIdx = this.mDataBuffer.ReadInt();
				var aPassNumAnnotations = this.mDataBuffer.ReadInt();
				var aPassAnnotationStartIdx = this.mDataBuffer.ReadInt();
				var aPassNumSettings = this.mDataBuffer.ReadInt();
				var aPassSettingStartIdx = this.mDataBuffer.ReadInt();
				var aVertexShader = this.mDataBuffer.ReadInt();
				var aPixelShader = this.mDataBuffer.ReadInt();
				for(var aSettingIdx = 0; aSettingIdx < aPassNumSettings; aSettingIdx++) {
					this.mDataBuffer.set_Position(this.mSettingsData.mOffset + (aPassSettingStartIdx + aSettingIdx) * 4 * 5);
					var aCategory = this.mDataBuffer.ReadInt();
					var aType = this.mDataBuffer.ReadInt();
					var aNumSettingAnnotations = this.mDataBuffer.ReadInt();
					var aSettingAnnotationStartIdx = this.mDataBuffer.ReadInt();
					var aValueBegin = this.mDataBuffer.ReadInt();
				}
				var aJSRenderEffectPass = new GameFramework.resources.JSRenderEffectPass();
				var aVertexShaderStr = this.ReadShader(aVertexShader);
				var aPixelShaderStr = this.ReadShader(aPixelShader);
				if(aVertexShaderStr != null) {
					var anIdx = aVertexShaderStr.indexOf('attribute vec3 position');
					aVertexShaderStr = aVertexShaderStr.insert(anIdx, 'attribute vec3 normal;\n');
					aVertexShaderStr = aVertexShaderStr.replaceAll('vec3(gl_Normal)', 'normal');
				}
				//JS
				aJSRenderEffectPass.mGLProgram = JSFExt_CreateShaderProgram(aVertexShaderStr, aPixelShaderStr);
				//-JS
				aJSRenderEffectTechnique.mPasses.push(aJSRenderEffectPass);
			}
			this.mTechniques[aName] = aJSRenderEffectTechnique;
		}
	},
	SetFloatPhys : function GameFramework_resources_JSRenderEffect$SetFloatPhys(theName, theValue) {
		//JS
		JSFExt_SetShaderUniform1f(theName, theValue);
		//-JS
	},
	SetVectorPhys : function GameFramework_resources_JSRenderEffect$SetVectorPhys(theName, theVector) {
		//JS
		JSFExt_SetShaderUniform3f(theName, theVector.x, theVector.y, theVector.z);
		//-JS
	},
	SetFloatArrayPhys : function GameFramework_resources_JSRenderEffect$SetFloatArrayPhys(theName, theVector) {
		//JS
		if(theVector.length == 2) {
			JSFExt_SetShaderUniform3f(theName, theVector[0], theVector[1], 0.0);
		}
		if(theVector.length == 3) {
			JSFExt_SetShaderUniform3f(theName, theVector[0], theVector[1], theVector[2]);
		}
		if(theVector.length == 4) {
			JSFExt_SetShaderUniform4f(theName, theVector[0], theVector[1], theVector[2], theVector[3]);
		}
		//-JS
	},
	SetMatrixPhys : function GameFramework_resources_JSRenderEffect$SetMatrixPhys(theName, theTransform) {
		//JS
		JSFExt_SetShaderUniform4fv(theName, [theTransform.m[0, 0], theTransform.m[0, 1], theTransform.m[0, 2], theTransform.m[0, 3], theTransform.m[1, 0], theTransform.m[1, 1], theTransform.m[1, 2], theTransform.m[1, 3], theTransform.m[2, 0], theTransform.m[2, 1], theTransform.m[2, 2], theTransform.m[2, 3], theTransform.m[3, 0], theTransform.m[3, 1], theTransform.m[3, 2], theTransform.m[3, 3]]);
		//-JS
	},
	SetFloat : function GameFramework_resources_JSRenderEffect$SetFloat(theName, theValue) {
		this.mSettings[theName] = theValue;
		if(this.mCurPass != null) {
			this.SetFloatPhys(theName, theValue);
		}
	},
	SetVector : function GameFramework_resources_JSRenderEffect$SetVector(theName, theVector) {
		this.mSettings[theName] = new GameFramework.geom.Vector3(theVector.x, theVector.y, theVector.z);
		if(this.mCurPass != null) {
			this.SetVectorPhys(theName, theVector);
		}
	},
	SetFloatArray : function GameFramework_resources_JSRenderEffect$SetFloatArray(theName, theVector) {
		var aFloats = Array.Create(theVector.length, null);
		for(var i = 0; i < theVector.length; i++) {
			aFloats[i] = theVector[i];
		}
		this.mSettings[theName] = aFloats;
		if(this.mCurPass != null) {
			this.SetFloatArrayPhys(theName, theVector);
		}
	},
	SetMatrix : function GameFramework_resources_JSRenderEffect$SetMatrix(theName, theTransform) {
		var aMatrix3D = new GameFramework.geom.Matrix3D();
		aMatrix3D.CopyFrom(theTransform);
		this.mSettings[theName] = aMatrix3D;
		if(this.mCurPass != null) {
			this.SetMatrixPhys(theName, theTransform);
		}
	},
	Begin : function GameFramework_resources_JSRenderEffect$Begin(g3D, theTechnique) {
		if(theTechnique === undefined) theTechnique = null;
		var aRenderEffectRunHandle = new GameFramework.resources.JSRenderEffectRunHandle(this);
		var aTechnique = this.mTechniques[theTechnique];
		aRenderEffectRunHandle.mTechnique = aTechnique;
		return aRenderEffectRunHandle;
	},
	End : function GameFramework_resources_JSRenderEffect$End(theRenderEffectHandle) {
	},
	BeginPass : function GameFramework_resources_JSRenderEffect$BeginPass(theRenderEffectHandle, thePass) {
		var aRunHandle = theRenderEffectHandle;
		var aPass = aRunHandle.mTechnique.mPasses[thePass];
		//JS
		JSFExt_SetGLProgram(aPass.mGLProgram)
		//-JS
		this.mCurPass = aPass;

		{
			for(aName in this.mSettings) {
				var anObj = this.mSettings[aName];
				if(Type.tryCast(anObj, Number)) {
					this.SetFloatPhys(aName, anObj);
				} else if(Type.tryCast(anObj, GameFramework.geom.Vector3)) {
					this.SetVectorPhys(aName, anObj);
				} else {
					this.SetFloatArrayPhys(aName, anObj);
				}
			}
		}
	},
	EndPass : function GameFramework_resources_JSRenderEffect$EndPass(theRenderEffectHandle, thePass) {
		this.mCurPass = null;
		//JS
		JSFExt_SetGLProgram(gDefault2DShaderProgram)
		//-JS
	},
	PassUsesVertexShader : function GameFramework_resources_JSRenderEffect$PassUsesVertexShader(inPass) {
		return true;
	},
	PassUsesPixelShader : function GameFramework_resources_JSRenderEffect$PassUsesPixelShader(inPass) {
		return true;
	}
}
GameFramework.resources.JSRenderEffect.staticInit = function GameFramework_resources_JSRenderEffect$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSRenderEffect.registerClass('GameFramework.resources.JSRenderEffect', GameFramework.resources.RenderEffect);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSRenderEffect.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\JSGameFramework\resources\JSRenderEffect.cs
//LineMap:2=10 7=14 23=26 39=31 44=33 56=37 59=41 61=40 67=45 69=45 78=48 83=61 84=64 102=66 106=71 107=73 110=77 118=86 119=88 122=92 125=96 131=103 133=106 140=114 141=116 144=120 145=122 151=129 152=131 155=135 162=143 165=147 171=154 174=158 183=169 185=172 261=246 
//LineMap:262=248 272=260 282=268 285=272 287=275 294=281 302=290 
//Start:resources\JSResourceManager
/**
 * @constructor
 */
GameFramework.resources.JSResourceManager = function GameFramework_resources_JSResourceManager() {
	GameFramework.resources.JSResourceManager.initializeBase(this);
}
GameFramework.resources.JSResourceManager.prototype = {

	SetResType : function GameFramework_resources_JSResourceManager$SetResType(theId, theObject) {
		GameFramework.resources.ResourceManager.prototype.SetResType.apply(this, [theId, theObject]);
		//JS            
		Game.Resources[theId] = theObject;
		//-JS
	},
	ParseRenderEffectData : function GameFramework_resources_JSResourceManager$ParseRenderEffectData(theResourceStreamer) {
		var aJSRenderEffect = new GameFramework.resources.JSRenderEffect();
		aJSRenderEffect.ReadData(theResourceStreamer.mResultData);
		this.RegisterRenderEffect(theResourceStreamer.mId, aJSRenderEffect);
	},
	ParseMeshResourceData : function GameFramework_resources_JSResourceManager$ParseMeshResourceData(theResourceStreamer) {
		var aBuffer = theResourceStreamer.mResultData;
		var aMeshResource = new GameFramework.resources.JSMeshResource();
		aMeshResource.LoadMesh(aBuffer, theResourceStreamer);
		this.RegisterMeshResource(theResourceStreamer.mId, aMeshResource);
	},
	ResourceLoaded : function GameFramework_resources_JSResourceManager$ResourceLoaded(theResourceStreamer) {
		if(theResourceStreamer.mResType == GameFramework.resources.ResourceManager.RESTYPE_IMAGE) {
			if((theResourceStreamer.mId != null) && (this.mImages[theResourceStreamer.mId] != null)) {
				theResourceStreamer.mResultData = this.mImages[theResourceStreamer.mId];
				return;
			}
			var anImageResource = new GameFramework.resources.JSImageResource();
			var aContentScale = 1;
			anImageResource.mContentScale = aContentScale;
			anImageResource.mHTMLImageResource = theResourceStreamer.mResultData;
			if(theResourceStreamer.mBaseRes != null) {
				anImageResource.mCols = theResourceStreamer.mBaseRes.mCols;
				anImageResource.mRows = theResourceStreamer.mBaseRes.mRows;
				anImageResource.mWidth = theResourceStreamer.mBaseRes.mOrigWidth;
				anImageResource.mHeight = theResourceStreamer.mBaseRes.mOrigHeight;
				anImageResource.mOffsetX = theResourceStreamer.mBaseRes.mOffsetX;
				anImageResource.mOffsetY = theResourceStreamer.mBaseRes.mOffsetY;
			}
			anImageResource.mNumFrames = anImageResource.mCols * anImageResource.mRows;
			if((theResourceStreamer.mBaseRes != null) && (theResourceStreamer.mBaseRes.mRTParent != null)) {
				var aRTParent = this.mImages[theResourceStreamer.mBaseRes.mRTParent];
				var aParent = this.mImages[theResourceStreamer.mBaseRes.mParent];
				var aRTParentBaseRes = this.mResMap[theResourceStreamer.mBaseRes.mRTParent];
				if(aRTParent == null) {
					aRTParent = new GameFramework.resources.JSImageResource();
					aRTParent.mTexWidth = aRTParentBaseRes.mWidth;
					aRTParent.mTexHeight = aRTParentBaseRes.mHeight;
					aRTParent.mOwnsImageData = true;
					//JS                        
					aRTParent.mGLTex = JFSExt_CreateEmptyGLTex();
					aRTParent.mCompositeImageData = JSFExt_CreateCompositeImageData(aRTParentBaseRes.mWidth, aRTParentBaseRes.mHeight);
					//-JS
					this.mImages[aRTParentBaseRes.mId] = aRTParent;
				}
				//JS                    
				//JSFXExt_CopyTexBits(aRTParent.mGLTex, theResourceStreamer.mBaseRes.mAtlasX, theResourceStreamer.mBaseRes.mAtlasY, theResourceStreamer.mBaseRes.mAtlasWidth, theResourceStreamer.mBaseRes.mAtlasHeight,
				//aParent.mColorImage, aParent.mAlphaImage, theResourceStreamer.mBaseRes.mAtlasRTX, theResourceStreamer.mBaseRes.mAtlasRTY);
				JSFXExt_CopyToImageData(aRTParent.mCompositeImageData, theResourceStreamer.mBaseRes.mAtlasX, theResourceStreamer.mBaseRes.mAtlasY, theResourceStreamer.mBaseRes.mAtlasWidth, theResourceStreamer.mBaseRes.mAtlasHeight, aParent.mColorImage, aParent.mAlphaImage, theResourceStreamer.mBaseRes.mAtlasRTX, theResourceStreamer.mBaseRes.mAtlasRTY);
				//-JS
				aRTParentBaseRes.mRTChildLoadedCount++;
				if(aRTParentBaseRes.mRTChildLoadedCount == aRTParentBaseRes.mRTChildCount) {
					//JS
					JFSExt_SetGLTexImage(aRTParent.mGLTex, aRTParent.mCompositeImageData);
					aRTParent.mCompositeImageData = null; // We're done with this now...
					//-JS
				}
				anImageResource.mGLTex = aRTParent.mGLTex;
				anImageResource.mTexOfsX = theResourceStreamer.mBaseRes.mAtlasRTX;
				anImageResource.mTexOfsY = theResourceStreamer.mBaseRes.mAtlasRTY;
				anImageResource.mPhysCelWidth = ((theResourceStreamer.mBaseRes.mAtlasWidth / theResourceStreamer.mBaseRes.mCols) | 0);
				anImageResource.mPhysCelHeight = ((theResourceStreamer.mBaseRes.mAtlasHeight / theResourceStreamer.mBaseRes.mRows) | 0);
				anImageResource.mTexWidth = aRTParent.mTexWidth;
				anImageResource.mTexHeight = aRTParent.mTexHeight;
			} else if(anImageResource.mHTMLImageResource == null) {
				var aParentImageResource = this.GetImageResourceById(theResourceStreamer.mBaseRes.mParent);
				anImageResource.mHTMLImageResource = aParentImageResource.mHTMLImageResource;
				anImageResource.mGLTex = aParentImageResource.mGLTex;
				anImageResource.mTexOfsX = theResourceStreamer.mBaseRes.mAtlasX;
				anImageResource.mTexOfsY = theResourceStreamer.mBaseRes.mAtlasY;
				anImageResource.mPhysCelWidth = ((theResourceStreamer.mBaseRes.mAtlasWidth / theResourceStreamer.mBaseRes.mCols) | 0);
				anImageResource.mPhysCelHeight = ((theResourceStreamer.mBaseRes.mAtlasHeight / theResourceStreamer.mBaseRes.mRows) | 0);
				anImageResource.mTexWidth = aParentImageResource.mTexWidth;
				anImageResource.mTexHeight = aParentImageResource.mTexHeight;
			} else {
				//JS
				anImageResource.mOwnsImageData = true;
				anImageResource.mGLTex = theResourceStreamer.mGLTex;
				anImageResource.mTexWidth = anImageResource.mHTMLImageResource.width;
				anImageResource.mTexHeight = anImageResource.mHTMLImageResource.height;
				anImageResource.mPhysCelWidth = anImageResource.mHTMLImageResource.width / anImageResource.mCols;
				anImageResource.mPhysCelHeight = anImageResource.mHTMLImageResource.height / anImageResource.mRows;
				anImageResource.mColorImage = theResourceStreamer.mColorImage;
				anImageResource.mAlphaImage = theResourceStreamer.mAlphaImage;
				//-JS
			}
			if(theResourceStreamer.mBaseRes == null) {
				anImageResource.mWidth = ((anImageResource.mPhysCelWidth / GameFramework.BaseApp.mApp.mGraphics.mScale) | 0);
				anImageResource.mHeight = ((anImageResource.mPhysCelHeight / GameFramework.BaseApp.mApp.mGraphics.mScale) | 0);
			}
			anImageResource.mAdjustedWidth = anImageResource.mPhysCelWidth / GameFramework.BaseApp.mApp.mGraphics.mScale;
			anImageResource.mAdjustedHeight = anImageResource.mPhysCelHeight / GameFramework.BaseApp.mApp.mGraphics.mScale;
			theResourceStreamer.mResultData = anImageResource;
			if(theResourceStreamer.mId != null) {
				this.SetResType(theResourceStreamer.mId, anImageResource);
				this.mImages[theResourceStreamer.mId] = anImageResource;
			}
		} else if(theResourceStreamer.mResType == GameFramework.resources.ResourceManager.RESTYPE_SOUND) {
			var aSoundResource = new GameFramework.resources.JSSoundResource();
			aSoundResource.mHTML5Audio = theResourceStreamer.mResultData;
			if(theResourceStreamer.mBaseRes != null) {
				aSoundResource.mNumSamples = theResourceStreamer.mBaseRes.mNumSamples;
			}
			this.SetResType(theResourceStreamer.mId, aSoundResource);
			this.mSounds[theResourceStreamer.mId] = aSoundResource;
		}
	},
	ZResourceLoaded : function GameFramework_resources_JSResourceManager$ZResourceLoaded(theId, theData) {
		var aBaseRes = this.mResMap[theId];
		if(aBaseRes.mType == GameFramework.resources.ResourceManager.RESTYPE_IMAGE) {
			var anImageResource = new GameFramework.resources.JSImageResource();
			anImageResource.mHTMLImageResource = theData;
			anImageResource.mCols = aBaseRes.mCols;
			anImageResource.mRows = aBaseRes.mRows;
			//JS
			anImageResource.mColPX = theData.width / anImageResource.mCols;
			anImageResource.mRowPX = theData.height / anImageResource.mRows;
			//-JS
			this.SetResType(theId, anImageResource);
			this.mImages[theId] = anImageResource;
		}
	}
}
GameFramework.resources.JSResourceManager.staticInit = function GameFramework_resources_JSResourceManager$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSResourceManager.registerClass('GameFramework.resources.JSResourceManager', GameFramework.resources.ResourceManager);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSResourceManager.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\JSGameFramework\resources\JSResourceManager.cs
//LineMap:2=6 12=8 20=17 23=21 27=26 30=30 32=33 44=47 45=49 48=53 57=63 58=65 63=71 73=82 81=93 82=95 89=104 97=110 99=115 109=126 127=154 129=158 130=160 136=163 138=168 160=192 
//Start:resources\JSSoundInstance
/**
 * @constructor
 */
GameFramework.resources.JSSoundInstance = function GameFramework_resources_JSSoundInstance(theSoundResource) {
	GameFramework.resources.JSSoundInstance.initializeBase(this, [theSoundResource]);
	this.mJSSoundResource = theSoundResource;
}
GameFramework.resources.JSSoundInstance.prototype = {
	mJSSoundResource : null,
	mVolume : 1.0,
	mPan : 0.0,
	mSoundObject : null,
	mSoundGroup : 0,
	SetPan : function GameFramework_resources_JSSoundInstance$SetPan(thePan) {
		this.mPan = thePan;
	},
	SetSoundGroup : function GameFramework_resources_JSSoundInstance$SetSoundGroup(theGroup) {
		this.mSoundGroup = theGroup;
		this.RehupVolume();
	},
	RehupVolume : function GameFramework_resources_JSSoundInstance$RehupVolume() {
		var aVolume = this.mVolume * GameFramework.BaseApp.mApp.mSoundManager.mGroupVolumes[this.mSoundGroup];
		//JS
		if(this.mSoundObject) {
			JSFExt_AudioSetVolume(this.mSoundObject, aVolume);
		}
		//-JS
	},
	SetVolume : function GameFramework_resources_JSSoundInstance$SetVolume(volume) {
		if(this.mVolume != volume) {
			this.mVolume = volume;
			this.RehupVolume();
		}
	},
	PlayEx : function GameFramework_resources_JSSoundInstance$PlayEx(looping, autoRelease) {
		var aHTML5Audio = this.mJSSoundResource.mHTML5Audio;
		var aVolume = this.mVolume * GameFramework.BaseApp.mApp.mSoundManager.mGroupVolumes[this.mSoundGroup];
		//JS
		this.mSoundObject = JSFExt_PlayAudio(aHTML5Audio, aVolume, this.mPan, looping, this.mJSSoundResource.mNumSamples);
		//-JS
	},
	Stop : function GameFramework_resources_JSSoundInstance$Stop(dispose) {
		if(dispose === undefined) dispose = true;
		GameFramework.resources.SoundInstance.prototype.Stop.apply(this, [dispose]);
		//JS
		JSFExt_StopAudio(this.mSoundObject);
		//-JS
	},
	Dispose : function GameFramework_resources_JSSoundInstance$Dispose() {
		//JS            
		if(this.mSoundObject) {
			JSFExt_StopAudio(this.mSoundObject);
		}
		//-JS
		this.mSoundObject = null;
	}
}
GameFramework.resources.JSSoundInstance.staticInit = function GameFramework_resources_JSSoundInstance$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSSoundInstance.registerClass('GameFramework.resources.JSSoundInstance', GameFramework.resources.SoundInstance);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSSoundInstance.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\JSGameFramework\resources\JSSoundInstance.cs
//LineMap:2=5 5=43 7=42 8=44 13=8 47=47 58=56 59=58 
//Start:resources\JSSoundResource
/**
 * @constructor
 */
GameFramework.resources.JSSoundResource = function GameFramework_resources_JSSoundResource() {
	GameFramework.resources.JSSoundResource.initializeBase(this);
}
GameFramework.resources.JSSoundResource.prototype = {
	mHTML5Audio : null
}
GameFramework.resources.JSSoundResource.staticInit = function GameFramework_resources_JSSoundResource$staticInit() {
}

JS_AddInitFunc(function() {
	GameFramework.resources.JSSoundResource.registerClass('GameFramework.resources.JSSoundResource', GameFramework.resources.SoundResource);
});
JS_AddStaticInitFunc(function() {
	GameFramework.resources.JSSoundResource.staticInit();
});

//Src:C:\p4_managed\PrimeSharp\prime\PrimeSharp\JSGameFramework\resources\JSSoundResource.cs
//LineMap:2=5 
