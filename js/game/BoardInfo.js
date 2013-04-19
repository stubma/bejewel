Game.BoardInfo = function Game_BoardInfo() {
}
Game.BoardInfo.prototype = {
    mCoords : null,
    mBoard : null,
    SetCoords : function Game_BoardInfo$SetCoords(inCoords) {
        this.mCoords = inCoords;
    },
    Init : function Game_BoardInfo$Init(board, animSeq) {
        this.mBoard = board;
        var rot = animSeq.GetBoardRot();
        var pos = animSeq.GetBoardPos();
        var scale = animSeq.GetBoardScale();
        var boardCoords = new GameFramework.geom.Coords3();
        boardCoords.RotateRadX(rot.x);
        boardCoords.RotateRadY(rot.y);
        boardCoords.RotateRadZ(rot.z);
        boardCoords.Scale(scale.x, scale.y, scale.z);
        boardCoords.Translate(pos.x, pos.y, pos.z);
        this.SetCoords(boardCoords);
    }
}
Game.BoardInfo.staticInit = function Game_BoardInfo$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.BoardInfo.registerClass('Game.BoardInfo', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.BoardInfo.staticInit();
});