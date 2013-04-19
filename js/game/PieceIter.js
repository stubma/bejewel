/**
 * @constructor
 */
Game.PieceIter = function Game_PieceIter(theBoard) {
    this.mIdx = -1;
    this.mBoard = theBoard;
}
Game.PieceIter.prototype = {
    mBoard : null,
    mIdx : 0,
    HasNext : function Game_PieceIter$HasNext() {
        return this.mBoard != null && this.mIdx < this.mBoard.mColCount * this.mBoard.mRowCount - 1;
    },
    Next : function Game_PieceIter$Next() {
        if(!this.HasNext()) {
            return false;
        }
        ++this.mIdx;
        return true;
    },
    GetRow : function Game_PieceIter$GetRow() {
        return ((this.mIdx / this.mBoard.mColCount) | 0);
    },
    GetCol : function Game_PieceIter$GetCol() {
        return this.mIdx % this.mBoard.mColCount;
    },
    GetPiece : function Game_PieceIter$GetPiece() {
        if(this.mIdx < 0) {
            return null;
        }
        return this.mBoard.mBoard[this.mBoard.mBoard.mIdxMult0 * (this.GetRow()) + this.GetCol()];
    }
}
Game.PieceIter.staticInit = function Game_PieceIter$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.PieceIter.registerClass('Game.PieceIter', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.PieceIter.staticInit();
});