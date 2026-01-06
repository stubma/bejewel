GameFramework.resources.JSMeshResource = function GameFramework_resources_JSMeshResource() {
    GameFramework.resources.JSMeshResource.initializeBase(this);
};
GameFramework.resources.JSMeshResource.prototype = {
    CreateMeshPiece: function GameFramework_resources_JSMeshResource$CreateMeshPiece() {
        return new GameFramework.resources.JSMeshPiece();
    },
    LoadMesh: function GameFramework_resources_JSMeshResource$LoadMesh(theDataBuffer, theParentStreamer) {
        if (!GameFramework.resources.MeshResource.prototype.LoadMesh.apply(this, [theDataBuffer, theParentStreamer])) {
            return false;
        }
        //JS
        JSFExt_SetupMesh(this);
        //-JS
        return true;
    },
};
GameFramework.resources.JSMeshResource.staticInit = function GameFramework_resources_JSMeshResource$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.JSMeshResource.registerClass(
        "GameFramework.resources.JSMeshResource",
        GameFramework.resources.MeshResource
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.JSMeshResource.staticInit();
});
