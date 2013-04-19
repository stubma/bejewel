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

JS_AddInitFunc(function() {
	Game.ElectroBolt.registerClass('Game.ElectroBolt', null);
});
JS_AddStaticInitFunc(function() {
	Game.ElectroBolt.staticInit();
});