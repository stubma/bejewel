GameFramework.gfx.Camera = function GameFramework_gfx_Camera() {
    this.mCoords = new GameFramework.geom.Coords3();
    this.mZNear = 1.0;
    this.mZFar = 10000.0;
};
GameFramework.gfx.Camera.prototype = {
    mCoords: null,
    mZNear: 0,
    mZFar: 0,
    GetCoords: function GameFramework_gfx_Camera$GetCoords() {
        return this.mCoords;
    },
    SetCoords: function GameFramework_gfx_Camera$SetCoords(inCoords) {
        this.mCoords = inCoords;
    },
    GetViewMatrix: function GameFramework_gfx_Camera$GetViewMatrix(outM) {
        if (outM == null) {
            return;
        }
        var tempCoords = new GameFramework.geom.Coords3();
        tempCoords.CopyFrom(this.mCoords);
        tempCoords.s = new GameFramework.geom.Vector3(tempCoords.s.x, tempCoords.s.y, -tempCoords.s.z);
        tempCoords.GetInboundMatrix(outM);
    },
    GetProjectionMatrix: function GameFramework_gfx_Camera$GetProjectionMatrix(outM) {},
    IsOrtho: function GameFramework_gfx_Camera$IsOrtho() {
        return false;
    },
    IsPerspective: function GameFramework_gfx_Camera$IsPerspective() {
        return false;
    },
    EyeToScreen: function GameFramework_gfx_Camera$EyeToScreen(inEyePos) {
        return null;
    },
    WorldToEye: function GameFramework_gfx_Camera$WorldToEye(inWorldPos) {
        return inWorldPos.Enter$2(this.mCoords);
    },
    WorldToScreen: function GameFramework_gfx_Camera$WorldToScreen(inWorldPos) {
        return this.EyeToScreen(this.WorldToEye(inWorldPos));
    },
    LookAt: function GameFramework_gfx_Camera$LookAt(inTargetPos, inUpVector) {
        var c = this.mCoords;
        if (!c.LookAt(inTargetPos, inUpVector)) {
            return false;
        }
        this.SetCoords(c);
        return true;
    },
    LookAt$2: function GameFramework_gfx_Camera$LookAt$2(inViewPos, inTargetPos, inUpVector) {
        var c = this.mCoords;
        if (!c.LookAt$2(inViewPos, inTargetPos, inUpVector)) {
            return false;
        }
        this.SetCoords(c);
        return true;
    },
};
GameFramework.gfx.Camera.staticInit = function GameFramework_gfx_Camera$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.gfx.Camera.registerClass("GameFramework.gfx.Camera", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.gfx.Camera.staticInit();
});
