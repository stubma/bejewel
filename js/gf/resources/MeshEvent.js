GameFramework.resources.MeshEvent = function GameFramework_resources_MeshEvent(theType) {
    GameFramework.resources.MeshEvent.initializeBase(this, [theType]);
};
GameFramework.resources.MeshEvent.prototype = {
    mMeshResource: null,
    mSetName: null,
};
GameFramework.resources.MeshEvent.staticInit = function GameFramework_resources_MeshEvent$staticInit() {
    GameFramework.resources.MeshEvent.PREDRAW = "mesh_predraw";
    GameFramework.resources.MeshEvent.POSTDRAW = "mesh_postdraw";
    GameFramework.resources.MeshEvent.PREDRAW_SET = "mesh_predrawset";
    GameFramework.resources.MeshEvent.POSTDRAW_SET = "mesh_postdrawset";
};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.MeshEvent.registerClass("GameFramework.resources.MeshEvent", GameFramework.events.Event);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.MeshEvent.staticInit();
});
