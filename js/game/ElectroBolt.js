Game.ElectroBolt = function Game_ElectroBolt() {
	this.mMidPointsPos = Array.Create(8, null);
	this.mMidPointsPosD = Array.Create(8, null);
}
Game.ElectroBolt.prototype = {
	mAngStart : 0,
	mAngStartD : 0,
	mAngEnd : 0,
	mAngEndD : 0,
	mCrossover : null,
	mHitOtherGem : null,
	mHitOtherGemId : 0,
	mMidPointsPos : null,
	mMidPointsPosD : null,
	mNumMidPoints : 0
}
Game.ElectroBolt.staticInit = function Game_ElectroBolt$staticInit() {
}

JSFExt_AddInitFunc(function() {
	Game.ElectroBolt.registerClass('Game.ElectroBolt', null);
});
JSFExt_AddStaticInitFunc(function() {
	Game.ElectroBolt.staticInit();
});