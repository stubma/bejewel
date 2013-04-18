Game.GemInfo = function Game_GemInfo() {
    this.mLightingCamOffset = new GameFramework.geom.Vector3();
    this.mCoords = new GameFramework.geom.Coords3();
    this.mPos = new GameFramework.geom.Vector3();
    this.mPosScreen = new GameFramework.geom.Vector3();
}
Game.GemInfo.prototype = {
    mLightingCamOffset : null,
    mCoords : null,
    mPos : null,
    mPosScreen : null,
    mScaleScreen : 0,
    mPiece : null,
    mDistToCamera : 0,
    mBoardHitFrame : 0,
    mColorIndexStart : 0,
    mColorIndexEnd : 0,
    mDraw3D : null,
    SetCoords : function Game_GemInfo$SetCoords(inCoords) {
        this.mCoords = inCoords;
    },
    Init : function Game_GemInfo$Init(piece, animSeq) {
        this.mPiece = piece;
        this.mColorIndexStart = (this.mPiece.mColor | 0);
        this.mColorIndexEnd = -1;
        this.mDraw3D = false;
        this.mBoardHitFrame = animSeq.GetGemHitFrame(piece.mRow, piece.mCol);
        var rot = animSeq.GetGemRot(piece.mRow, piece.mCol);
        var pos = animSeq.GetGemPos(piece.mRow, piece.mCol);
        var scale = animSeq.GetGemScale(piece.mRow, piece.mCol);
        this.mPos = pos;
        var gemCoords = new GameFramework.geom.Coords3();
        gemCoords.RotateRadX(rot.x);
        gemCoords.RotateRadY(rot.y);
        gemCoords.RotateRadZ(rot.z);
        gemCoords.Scale(scale.x, scale.y, scale.z);
        gemCoords.Translate(pos.x, pos.y, pos.z);
        this.mLightingCamOffset = gemCoords.t.Scale(-1.0);
        this.mLightingCamOffset.z = 0.0;
        this.SetCoords(gemCoords);
    }
}
Game.GemInfo.staticInit = function Game_GemInfo$staticInit() {
}

JS_AddInitFunc(function() {
    Game.GemInfo.registerClass('Game.GemInfo', null);
});
JS_AddStaticInitFunc(function() {
    Game.GemInfo.staticInit();
});