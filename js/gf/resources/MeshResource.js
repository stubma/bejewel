GameFramework.resources.MeshResource = function GameFramework_resources_MeshResource() {
    this.mPieces = [];
    GameFramework.resources.MeshResource.initializeBase(this);
};
GameFramework.resources.MeshResource.prototype = {
    mPieces: null,
    CreateMeshPiece: function GameFramework_resources_MeshResource$CreateMeshPiece() {
        return new GameFramework.resources.MeshPiece();
    },
    LoadMesh: function GameFramework_resources_MeshResource$LoadMesh(theDataBuffer, theParentStreamer) {
        if (theDataBuffer.ReadInt() != 0x3dbeef00) {
            return false;
        }
        var aVersion = theDataBuffer.ReadInt();
        if (aVersion > 2) {
            return false;
        }
        var anObjectCount = theDataBuffer.ReadShort();
        for (var anObjIdx = 0; anObjIdx < anObjectCount; anObjIdx++) {
            var anObjectName = theDataBuffer.ReadAsciiString();
            var aSetCount = theDataBuffer.ReadShort();
            var aSetIdx;
            for (aSetIdx = 0; aSetIdx < aSetCount; aSetIdx++) {
                if (aVersion > 1) {
                    var aFlags = theDataBuffer.ReadByte();
                    if (aFlags == 0) {
                        continue;
                    }
                }
                var aPiece = new GameFramework.resources.MeshPiece();
                this.mPieces.push(aPiece);
                var aSetName = theDataBuffer.ReadAsciiString();
                var aTexFileName = null;
                var aBumpFileName = null;
                aPiece.mObjectName = anObjectName;
                aPiece.mSetName = aSetName;
                var aPropCount = theDataBuffer.ReadShort();
                for (var i = 0; i < aPropCount; i++) {
                    var aPropName = theDataBuffer.ReadAsciiString();
                    var aPropValue = theDataBuffer.ReadAsciiString();
                    if (aPropName == "texture0.fileName") {
                        aTexFileName = aPropValue;
                    }
                    if (aPropName == "bump.fileName") {
                        aBumpFileName = aPropValue;
                    }
                }
                if (aTexFileName != null) {
                    aTexFileName = GameFramework.Utils.StringReplaceChar(aTexFileName, 92, 47);
                    aTexFileName = aTexFileName.substr(0, aTexFileName.indexOf(String.fromCharCode(46)));
                    var anId = GameFramework.BaseApp.mApp.mResourceManager.PathToId(
                        "images/" + GameFramework.BaseApp.mApp.mArtRes + "/tex/" + aTexFileName
                    );
                    if (anId == null) {
                        anId = GameFramework.BaseApp.mApp.mResourceManager.PathToId(
                            "images/" + GameFramework.BaseApp.mApp.mArtRes + "/NonResize/" + aTexFileName
                        );
                    }
                    var aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImage(anId);
                    aResourceStreamer.AddEventListener(
                        GameFramework.events.Event.COMPLETE,
                        ss.Delegate.create(aPiece, aPiece.ImageLoaded)
                    );
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
                }
                var aType = theDataBuffer.ReadShort();
                var aFVF = theDataBuffer.ReadInt() | 0;
                var aVertexSize = 4 * (3 + 3 + 2) + 4;
                aPiece.mSexyVF = aFVF;
                aPiece.mVertexSize = aVertexSize;
                var aReadVertexSize = aVertexSize;
                aPiece.mVertexBufferCount = theDataBuffer.ReadShort();
                var aData = Array.Create(aVertexSize * aPiece.mVertexBufferCount, 0);
                theDataBuffer.ReadBytes(aData, 0, aVertexSize * aPiece.mVertexBufferCount);
                aPiece.mVertexData = new GameFramework.DataBuffer();
                aPiece.mVertexData.InitRead(aData);
                aPiece.mIndexBufferCount = theDataBuffer.ReadShort() * 3;
                aData = Array.Create(aPiece.mIndexBufferCount * 2, 0);
                theDataBuffer.ReadBytes(aData, 0, aPiece.mIndexBufferCount * 2);
                aPiece.mIndexData = new GameFramework.DataBuffer();
                aPiece.mIndexData.InitRead(aData);
            }
            if (aSetIdx < aSetCount) {
                return false;
            }
        }
        return true;
    },
};
GameFramework.resources.MeshResource.staticInit = function GameFramework_resources_MeshResource$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.MeshResource.registerClass(
        "GameFramework.resources.MeshResource",
        GameFramework.events.EventDispatcher
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.MeshResource.staticInit();
});
