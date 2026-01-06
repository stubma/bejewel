GameFramework.resources.ResourceManager = function GameFramework_resources_ResourceManager() {
    this.mResMap = {};
    this.mResGroupMap = {};
    this.mPathToResMap = {};
    this.mImages = {};
    this.mSounds = {};
    this.mFonts = {};
    this.mPopAnims = {};
    this.mPIEffects = {};
    this.mMeshResources = {};
    this.mRenderEffects = {};
    this.mResourceStreamers = {};
};
GameFramework.resources.ResourceManager.prototype = {
    mResMap: null,
    mResGroupMap: null,
    mPathToResMap: null,
    mImages: null,
    mSounds: null,
    mFonts: null,
    mPopAnims: null,
    mPIEffects: null,
    mMeshResources: null,
    mRenderEffects: null,
    mResourceStreamers: null,
    mStreamingPaused: false,
    PauseStreaming: function GameFramework_resources_ResourceManager$PauseStreaming(pauseStreaming) {
        if (pauseStreaming === undefined) {
            pauseStreaming = true;
        }
        this.mStreamingPaused = pauseStreaming;
    },
    ParseFontData: function GameFramework_resources_ResourceManager$ParseFontData(theResourceStreamer) {
        var aBuffer = theResourceStreamer.mResultData;
        var aFontResource = new GameFramework.resources.FontResource();
        aFontResource.SerializeRead(aBuffer, theResourceStreamer);
        this.RegisterFontResource(theResourceStreamer.mId, aFontResource);
    },
    ParsePopAnimData: function GameFramework_resources_ResourceManager$ParsePopAnimData(theResourceStreamer) {
        var aBuffer = theResourceStreamer.mResultData;
        var aPopAnimResource = new GameFramework.resources.PopAnimResource();
        aPopAnimResource.SerializeRead(aBuffer, theResourceStreamer);
        this.RegisterPopAnimResource(theResourceStreamer.mId, aPopAnimResource);
    },
    ParsePIEffectData: function GameFramework_resources_ResourceManager$ParsePIEffectData(theResourceStreamer) {
        var aBuffer = theResourceStreamer.mResultData;
        var aPIEffect = new GameFramework.resources.PIEffect();
        aPIEffect.LoadEffect(aBuffer, theResourceStreamer);
        this.RegisterPIEffect(theResourceStreamer.mId, aPIEffect);
    },
    ParseMeshResourceData: function GameFramework_resources_ResourceManager$ParseMeshResourceData(theResourceStreamer) {
        var aBuffer = theResourceStreamer.mResultData;
        var aMeshResource = new GameFramework.resources.MeshResource();
        aMeshResource.LoadMesh(aBuffer, theResourceStreamer);
        this.RegisterMeshResource(theResourceStreamer.mId, aMeshResource);
    },
    ParseResourceManifest: function GameFramework_resources_ResourceManager$ParseResourceManifest(theXMLData) {
        // parse resource manifest
        var anXMLParser = new GameFramework.XMLParser();
        anXMLParser.ParseXML(theXMLData);

        // visit elements of root, but we only process Resources tag
        var anXMLList = anXMLParser.GetChildren();
        for (var aGroupIdx = 0; aGroupIdx < anXMLList.Count(); aGroupIdx++) {
            // only process resources tag
            var aGroup = anXMLList.GetItem(aGroupIdx);
            if (aGroup.GetValue() != "Resources") {
                continue;
            }

            // get id
            var aGroupName = aGroup.GetAttribute("id").GetValue();
            if (aGroup.mAttributes.hasOwnProperty("parent")) {
                aGroupName = aGroup.GetAttribute("parent").GetValue();
            }

            // lazy initialize resource map
            if (!this.mResGroupMap.hasOwnProperty(aGroupName)) {
                this.mResGroupMap[aGroupName] = {};
            }

            // get sub elements
            var aResList = aGroup.GetChildren();
            if (aResList == null) {
                continue;
            }

            // if app resolution is set, we can skip resources whose resolution is not matched
            // if not set, just set it
            if (aGroup.mAttributes.hasOwnProperty("res")) {
                var aRes = GameFramework.Utils.ToInt(aGroup.GetAttribute("res").GetValue());
                if (GameFramework.BaseApp.mApp.mArtRes == 0) {
                    GameFramework.BaseApp.mApp.mArtRes = aRes;
                } else if (GameFramework.BaseApp.mApp.mArtRes != aRes) {
                    continue;
                }
            }

            // visit sub elements of resources
            for (var aResIdx = 0; aResIdx < aResList.Count(); aResIdx++) {
                // get sub node in resources, create a base resource object
                var aResXML = aResList.GetItem(aResIdx);
                var aResType = aResXML.GetValue();
                var aBaseRes = new GameFramework.resources.BaseRes();

                // parent id, or aka group name
                aBaseRes.mGroup = aGroupName;

                // resource type
                if (aResType == "Font") {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_FONT;
                }
                if (aResType == "Image") {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_IMAGE;
                }
                if (aResType == "Sound") {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_SOUND;
                }
                if (aResType == "PopAnim") {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_POPANIM;
                }
                if (aResType == "PIEffect") {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_PIEFFECT;
                }
                if (aResType == "RenderEffect") {
                    aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_RENDEREFFECT;
                }

                // id
                aBaseRes.mId = aResXML.GetAttribute("id").GetValue();

                // parent
                if (aResXML.GetAttribute("parent").GetValue().length > 0) {
                    aBaseRes.mParent = aResXML.GetAttribute("parent").GetValue();
                }

                // increase child count of runtime parent
                if (aResXML.GetAttribute("rtparent").GetValue().length > 0) {
                    aBaseRes.mRTParent = aResXML.GetAttribute("rtparent").GetValue();
                    var aRTParent = this.mResMap[aBaseRes.mRTParent];
                    aRTParent.mRTChildCount++;
                }

                // put to parent children list
                if (aBaseRes.mParent != null) {
                    var aParent = this.mResMap[aBaseRes.mParent];
                    if (aParent.mChildren == null) {
                        aParent.mChildren = [];
                    }
                    aParent.mChildren.push(aBaseRes);
                }

                // unix style path
                aBaseRes.mPath = aResXML.GetAttribute("path").GetValue();
                aBaseRes.mPath = GameFramework.Utils.StringReplaceChar(aBaseRes.mPath, 92, 47);

                // other attributes
                if (aResXML.GetAttribute("width").GetValue().length > 0) {
                    aBaseRes.mWidth = GameFramework.Utils.ToInt(aResXML.GetAttribute("width").GetValue());
                }
                if (aResXML.GetAttribute("height").GetValue().length > 0) {
                    aBaseRes.mHeight = GameFramework.Utils.ToInt(aResXML.GetAttribute("height").GetValue());
                }
                if (aResXML.GetAttribute("origw").GetValue().length > 0) {
                    aBaseRes.mOrigWidth = GameFramework.Utils.ToInt(aResXML.GetAttribute("origw").GetValue());
                }
                if (aResXML.GetAttribute("origh").GetValue().length > 0) {
                    aBaseRes.mOrigHeight = GameFramework.Utils.ToInt(aResXML.GetAttribute("origh").GetValue());
                }
                if (aResXML.GetAttribute("cols").GetValue().length > 0) {
                    aBaseRes.mCols = GameFramework.Utils.ToInt(aResXML.GetAttribute("cols").GetValue());
                }
                if (aResXML.GetAttribute("rows").GetValue().length > 0) {
                    aBaseRes.mRows = GameFramework.Utils.ToInt(aResXML.GetAttribute("rows").GetValue());
                }
                if (aResXML.GetAttribute("samples").GetValue().length > 0) {
                    aBaseRes.mNumSamples = GameFramework.Utils.ToInt(aResXML.GetAttribute("samples").GetValue());
                }
                if (aResXML.GetAttribute("x").GetValue().length > 0) {
                    aBaseRes.mOffsetX = GameFramework.Utils.ToInt(aResXML.GetAttribute("x").GetValue());
                }
                if (aResXML.GetAttribute("y").GetValue().length > 0) {
                    aBaseRes.mOffsetY = GameFramework.Utils.ToInt(aResXML.GetAttribute("y").GetValue());
                }
                if (aResXML.GetAttribute("ax").GetValue().length > 0) {
                    aBaseRes.mAtlasX = GameFramework.Utils.ToInt(aResXML.GetAttribute("ax").GetValue());
                }
                if (aResXML.GetAttribute("ay").GetValue().length > 0) {
                    aBaseRes.mAtlasY = GameFramework.Utils.ToInt(aResXML.GetAttribute("ay").GetValue());
                }
                if (aResXML.GetAttribute("aw").GetValue().length > 0) {
                    aBaseRes.mAtlasWidth = GameFramework.Utils.ToInt(aResXML.GetAttribute("aw").GetValue());
                }
                if (aResXML.GetAttribute("ah").GetValue().length > 0) {
                    aBaseRes.mAtlasHeight = GameFramework.Utils.ToInt(aResXML.GetAttribute("ah").GetValue());
                }
                if (aResXML.GetAttribute("rtax").GetValue().length > 0) {
                    aBaseRes.mAtlasRTX = GameFramework.Utils.ToInt(aResXML.GetAttribute("rtax").GetValue());
                }
                if (aResXML.GetAttribute("rtay").GetValue().length > 0) {
                    aBaseRes.mAtlasRTY = GameFramework.Utils.ToInt(aResXML.GetAttribute("rtay").GetValue());
                }
                if (aResXML.GetAttribute("rtaflags").GetValue().length > 0) {
                    aBaseRes.mAtlasRTFlags = GameFramework.Utils.ToInt(aResXML.GetAttribute("rtaflags").GetValue());
                }
                if (aResXML.GetAttribute("runtime").GetValue().length > 0) {
                    aBaseRes.mIsRuntimeImage = aResXML.GetAttribute("runtime").GetValue() == "true";
                    aBaseRes.mIsNotRuntimeImage = aResXML.GetAttribute("runtime").GetValue() == "false";
                }
                if (aResXML.GetAttribute("tags").GetValue().length > 0) {
                    aBaseRes.mTags = aResXML.GetAttribute("tags").GetValue();
                }
                if (aResXML.GetAttribute("exts").GetValue().length > 0) {
                    aBaseRes.mExtensions = [];
                    var anExts = aResXML.GetAttribute("exts").GetValue();
                    while (anExts.indexOf(String.fromCharCode(59)) != -1) {
                        var aSemiPos = anExts.indexOf(String.fromCharCode(59));
                        aBaseRes.mExtensions.push(anExts.substr(0, aSemiPos));
                        anExts = anExts.substr(aSemiPos + 1);
                    }
                    aBaseRes.mExtensions.push(anExts);
                }
                if (aResType == "File") {
                    if (aBaseRes.mPath.endsWith(".p3d")) {
                        aBaseRes.mType = GameFramework.resources.ResourceManager.RESTYPE_MESH;
                    }
                }

                // save in map, path map and group map
                this.mResMap[aBaseRes.mId] = aBaseRes;
                this.mPathToResMap[aBaseRes.mPath] = aBaseRes;
                this.mResGroupMap[aGroupName][aBaseRes.mId] = aBaseRes;
            }
        }
    },
    RegisterResourceObject: function GameFramework_resources_ResourceManager$RegisterResourceObject(theResources) {},
    PathToId: function GameFramework_resources_ResourceManager$PathToId(thePath) {
        var aBaseRes = this.mPathToResMap[thePath];
        if (aBaseRes == null) {
            return null;
        }
        return aBaseRes.mId;
    },
    LoadResourceGroup: function GameFramework_resources_ResourceManager$LoadResourceGroup(theGroup) {},
    GetGroupResourceCount: function GameFramework_resources_ResourceManager$GetGroupResourceCount(theGroup) {
        var aHashtable = this.mResGroupMap[theGroup];
        var aCount = 0;

        {
            for ($enum1 in aHashtable) {
                var anEntry = aHashtable[$enum1];
                aCount++;
            }
        }
        return aCount;
    },
    PrioritizeResourceStreamer: function GameFramework_resources_ResourceManager$PrioritizeResourceStreamer(
        theResourceStreamer
    ) {
        GameFramework.BaseApp.mApp.PrioritizeResourceStreamer(theResourceStreamer);
    },
    UnloadResourceGroup: function GameFramework_resources_ResourceManager$UnloadResourceGroup(theGroup) {
        var aGroup = this.mResGroupMap[theGroup];

        {
            for ($enum2 in aGroup) {
                var aRes = aGroup[$enum2];
                if (aRes.mParent != null) {
                    var aParent = this.mResMap[aRes.mParent];
                    if (aParent.mDisposableResource != null) {
                        aParent.mDisposableResource.Dispose();
                        aParent.mDisposableResource = null;
                    }
                }
                if (aRes.mRTParent != null) {
                    var aParent_2 = this.mResMap[aRes.mRTParent];
                    aParent_2.mRTChildLoadedCount = 0;
                    if (aParent_2.mDisposableResource != null) {
                        aParent_2.mDisposableResource.Dispose();
                        aParent_2.mDisposableResource = null;
                    }
                }
                if (aRes.mDisposableResource != null) {
                    aRes.mDisposableResource.Dispose();
                    aRes.mDisposableResource = null;
                }
                if (this.mImages[aRes.mId] != null) {
                    this.mImages[aRes.mId].Dispose();
                    this.mImages[aRes.mId] = null;
                }
            }
        }
    },
    StreamResourceGroup: function GameFramework_resources_ResourceManager$StreamResourceGroup(theGroup) {
        // create top stream
        var aResourceStreamer = new GameFramework.resources.ResourceStreamer();
        aResourceStreamer.mGroupName = theGroup;
        aResourceStreamer.mResourceCount = 0;

        // get grouped resources
        var aGroup = this.mResGroupMap[theGroup];

        // visit every resource
        for ($enum3 in aGroup) {
            // if parent resource doesn't have stream associated, create parent resource stream and install event
            var aRes = aGroup[$enum3];
            if (aRes.mParent != null) {
                if (
                    this.mImages[aRes.mParent] == null &&
                    !GameFramework.BaseApp.mApp.HasResourceStreamerForId(aRes.mParent)
                ) {
                    var aParentResStreamer = this.StreamImage(aRes.mParent);
                    aParentResStreamer.AddEventListener(
                        GameFramework.events.IOErrorEvent.IO_ERROR,
                        ss.Delegate.create(aResourceStreamer, aResourceStreamer.ChildFailed)
                    );
                }
            }

            // for unknown type resource or runtime image, skip loading
            if (aRes.mType == GameFramework.resources.ResourceManager.RESTYPE_NONE || aRes.mIsRuntimeImage) {
                continue;
            }

            // if extensions are more than 1, should save a path in mPath2 field
            var aPath = aRes.mPath;
            var aChildResourceStreamer = new GameFramework.resources.ResourceStreamer();
            if (aRes.mExtensions != null) {
                if (aRes.mExtensions.length > 1) {
                    aChildResourceStreamer.mPath2 = aPath + aRes.mExtensions[1];
                }
                aPath += aRes.mExtensions[0];
            }

            // copy other info from parent resource
            aChildResourceStreamer.mResType = aRes.mType;
            aChildResourceStreamer.mId = aRes.mId;
            aChildResourceStreamer.mPath = aPath;
            aChildResourceStreamer.mBaseRes = aRes;
            aChildResourceStreamer.mResourceCount = 1;

            // install event
            aChildResourceStreamer.AddEventListener(
                GameFramework.events.Event.COMPLETE,
                ss.Delegate.create(aResourceStreamer, aResourceStreamer.ChildCompleted)
            );
            aChildResourceStreamer.AddEventListener(
                GameFramework.events.IOErrorEvent.IO_ERROR,
                ss.Delegate.create(aResourceStreamer, aResourceStreamer.ChildFailed)
            );

            // add stream to loading queue
            GameFramework.BaseApp.mApp.AddResourceStreamer(aChildResourceStreamer);

            // increase child count in parent resource
            aResourceStreamer.mResourceCount++;
        }

        GameFramework.BaseApp.mApp.AddResourceStreamer(aResourceStreamer);
        return aResourceStreamer;
    },
    StreamTextFile: function GameFramework_resources_ResourceManager$StreamTextFile(thePath) {
        var aResourceStreamer = new GameFramework.resources.ResourceStreamer();
        aResourceStreamer.mPath = thePath;
        aResourceStreamer.mResType = GameFramework.resources.ResourceManager.RESTYPE_TEXTFILE;
        aResourceStreamer.mResourceCount = 1;
        GameFramework.BaseApp.mApp.AddResourceStreamer(aResourceStreamer);
        return aResourceStreamer;
    },
    StreamBinaryFile: function GameFramework_resources_ResourceManager$StreamBinaryFile(theId) {
        var aRes = this.mResMap[theId];
        var aResourceStreamer = new GameFramework.resources.ResourceStreamer();
        aResourceStreamer.mPath = aRes.mPath;
        if (aRes.mExtensions != null) {
            aResourceStreamer.mPath += aRes.mExtensions[0];
        }
        aResourceStreamer.mResType = GameFramework.resources.ResourceManager.RESTYPE_BINFILE;
        aResourceStreamer.mResourceCount = 1;
        GameFramework.BaseApp.mApp.AddResourceStreamer(aResourceStreamer);
        return aResourceStreamer;
    },
    StreamImage: function GameFramework_resources_ResourceManager$StreamImage(theId) {
        var aPrevResourceStreamer = GameFramework.BaseApp.mApp.GetResourceStreamerForId(theId);
        if (aPrevResourceStreamer != null) {
            return aPrevResourceStreamer;
        }
        var aResourceStreamer = new GameFramework.resources.ResourceStreamer();
        var aBaseRes = this.mResMap[theId];
        if (aBaseRes.mParent != null) {
            if (
                this.mImages[aBaseRes.mParent] == null &&
                !GameFramework.BaseApp.mApp.HasResourceStreamerForId(aBaseRes.mParent)
            ) {
                var aParentResStreamer = this.StreamImage(aBaseRes.mParent);
                aParentResStreamer.AddEventListener(
                    GameFramework.events.IOErrorEvent.IO_ERROR,
                    ss.Delegate.create(aResourceStreamer, aResourceStreamer.ChildFailed)
                );
            }
        }
        aResourceStreamer.mId = theId;
        aResourceStreamer.mBaseRes = aBaseRes;
        aResourceStreamer.mPath = aResourceStreamer.mBaseRes.mPath;
        if (aResourceStreamer.mBaseRes.mExtensions != null) {
            aResourceStreamer.mPath = aResourceStreamer.mBaseRes.mPath + aResourceStreamer.mBaseRes.mExtensions[0];
            if (aResourceStreamer.mBaseRes.mExtensions.length > 1) {
                aResourceStreamer.mPath2 = aResourceStreamer.mBaseRes.mPath + aResourceStreamer.mBaseRes.mExtensions[1];
            }
        }
        aResourceStreamer.mPath = GameFramework.Utils.StringReplaceChar(aResourceStreamer.mPath, 92, 47);
        aResourceStreamer.mResType = GameFramework.resources.ResourceManager.RESTYPE_IMAGE;
        aResourceStreamer.mResourceCount = 1;
        GameFramework.BaseApp.mApp.AddResourceStreamer(aResourceStreamer);
        return aResourceStreamer;
    },
    StreamImageFromPath: function GameFramework_resources_ResourceManager$StreamImageFromPath(thePath) {
        var aResourceStreamer = new GameFramework.resources.ResourceStreamer();
        aResourceStreamer.mPath = thePath;
        aResourceStreamer.mResType = GameFramework.resources.ResourceManager.RESTYPE_IMAGE;
        aResourceStreamer.mResourceCount = 1;
        GameFramework.BaseApp.mApp.AddResourceStreamer(aResourceStreamer);
        return aResourceStreamer;
    },
    SetResType: function GameFramework_resources_ResourceManager$SetResType(theId, theObject) {
        var aBaseRes = this.mResMap[theId];
        aBaseRes.mDisposableResource = Type.safeCast(theObject, System.IDisposable);
    },
    RegisterFontResource: function GameFramework_resources_ResourceManager$RegisterFontResource(
        theId,
        theFontResource
    ) {
        var aBaseRes = this.mResMap[theId];
        if (aBaseRes.mTags != null) {
            var anIdx = 0;
            while (true) {
                var aSpaceIdx = aBaseRes.mTags.indexOf(" ", anIdx);
                if (aSpaceIdx != -1) {
                    theFontResource.AddTag(aBaseRes.mTags.substr(anIdx, aSpaceIdx - anIdx));
                    anIdx = aSpaceIdx + 1;
                } else {
                    theFontResource.AddTag(aBaseRes.mTags.substr(anIdx));
                    break;
                }
            }
        }
        this.mFonts[theId] = theFontResource;
        this.SetResType(theId, theFontResource);
    },
    RegisterPopAnimResource: function GameFramework_resources_ResourceManager$RegisterPopAnimResource(
        theId,
        thePopAnimResource
    ) {
        this.mPopAnims[theId] = thePopAnimResource;
        this.SetResType(theId, thePopAnimResource);
    },
    RegisterPIEffect: function GameFramework_resources_ResourceManager$RegisterPIEffect(theId, thePIEffect) {
        this.mPIEffects[theId] = thePIEffect;
        this.SetResType(theId, thePIEffect);
    },
    RegisterMeshResource: function GameFramework_resources_ResourceManager$RegisterMeshResource(
        theId,
        theMeshResource
    ) {
        this.mMeshResources[theId] = theMeshResource;
        this.SetResType(theId, theMeshResource);
    },
    RegisterRenderEffect: function GameFramework_resources_ResourceManager$RegisterRenderEffect(
        theId,
        theRenderEffect
    ) {
        this.mRenderEffects[theId] = theRenderEffect;
        this.SetResType(theId, theRenderEffect);
    },
    GetFontResourceById: function GameFramework_resources_ResourceManager$GetFontResourceById(theId) {
        return this.mFonts[theId];
    },
    GetImageResourceById: function GameFramework_resources_ResourceManager$GetImageResourceById(theId) {
        return this.mImages[theId];
    },
    GetSoundResourceById: function GameFramework_resources_ResourceManager$GetSoundResourceById(theId) {
        return this.mSounds[theId];
    },
    GetMeshResourceById: function GameFramework_resources_ResourceManager$GetMeshResourceById(theId) {
        return this.mMeshResources[theId];
    },
    GetPopAnimResourceById: function GameFramework_resources_ResourceManager$GetPopAnimResourceById(theId) {
        return this.mPopAnims[theId];
    },
    GetPIEffectById: function GameFramework_resources_ResourceManager$GetPIEffectById(theId) {
        return this.mPIEffects[theId];
    },
};
GameFramework.resources.ResourceManager.staticInit = function GameFramework_resources_ResourceManager$staticInit() {
    GameFramework.resources.ResourceManager.RESTYPE_NONE = 0;
    GameFramework.resources.ResourceManager.RESTYPE_IMAGE = 1;
    GameFramework.resources.ResourceManager.RESTYPE_SOUND = 2;
    GameFramework.resources.ResourceManager.RESTYPE_FONT = 3;
    GameFramework.resources.ResourceManager.RESTYPE_POPANIM = 4;
    GameFramework.resources.ResourceManager.RESTYPE_PIEFFECT = 5;
    GameFramework.resources.ResourceManager.RESTYPE_MESH = 6;
    GameFramework.resources.ResourceManager.RESTYPE_RENDEREFFECT = 7;
    GameFramework.resources.ResourceManager.RESTYPE_TEXTFILE = 8;
    GameFramework.resources.ResourceManager.RESTYPE_BINFILE = 9;
};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.ResourceManager.registerClass("GameFramework.resources.ResourceManager", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.ResourceManager.staticInit();
});
