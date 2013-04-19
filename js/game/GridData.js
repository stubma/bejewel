/**
 * @constructor
 */
Game.GridData = function Game_GridData(theColCount, theRowCount) {
    this.mTiles = [];
    this.mColCount = theColCount;
    this.mRowCount = theRowCount;
}
Game.GridData.prototype = {
    mTiles : null,
    mColCount : 0,
    mRowCount : 0,
    GetRowCount : function Game_GridData$GetRowCount() {
        return ((this.mTiles.length / this.mColCount) | 0);
    },
    AddRow : function Game_GridData$AddRow() {
        for(var i = 0; i < this.mColCount; ++i) {
            this.mTiles.push(new Game.GridTileData());
        }
    },
    At : function Game_GridData$At(theRow, theCol) {
        var idx = this.mColCount * theRow + theCol;
        while(this.mTiles.length < idx) {
            this.mTiles.push(new Game.GridTileData());
        }
        return this.mTiles[idx];
    }
}
Game.GridData.staticInit = function Game_GridData$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.GridData.registerClass('Game.GridData', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.GridData.staticInit();
});