GameFramework.resources.MeshPiece = function GameFramework_resources_MeshPiece() {};
GameFramework.resources.MeshPiece.prototype = {
    mObjectName: null,
    mSetName: null,
    mSexyVF: 0,
    mVertexSize: 0,
    mVertexBufferCount: 0,
    mVertexData: null,
    mIndexBufferCount: 0,
    mIndexData: null,
    mImage: null,
    ImageLoaded: function GameFramework_resources_MeshPiece$ImageLoaded(e) {
        var aResourceStreamer = e.target;
        if (aResourceStreamer.mId != null) {
            this.mImage = GameFramework.BaseApp.mApp.mResourceManager.GetImageResourceById(aResourceStreamer.mId);
        } else {
            this.mImage = aResourceStreamer.mResultData;
        }
    },
};
GameFramework.resources.MeshPiece.staticInit = function GameFramework_resources_MeshPiece$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.MeshPiece.registerClass("GameFramework.resources.MeshPiece", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.MeshPiece.staticInit();
});
