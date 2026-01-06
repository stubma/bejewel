GameFramework.resources.JSMeshPiece = function GameFramework_resources_JSMeshPiece() {
    GameFramework.resources.JSMeshPiece.initializeBase(this);
};
GameFramework.resources.JSMeshPiece.prototype = {
    mXYZArray: null,
    mNormalArray: null,
    mColorArray: null,
    mTexCoords0Array: null,
    mTexCoords1Array: null,
    mIndexBuffer: null,
};
GameFramework.resources.JSMeshPiece.staticInit = function GameFramework_resources_JSMeshPiece$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.JSMeshPiece.registerClass(
        "GameFramework.resources.JSMeshPiece",
        GameFramework.resources.MeshPiece
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.JSMeshPiece.staticInit();
});
