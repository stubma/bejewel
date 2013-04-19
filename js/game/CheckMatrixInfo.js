Game.CheckMatrixInfo = function Game_CheckMatrixInfo() {
}
Game.CheckMatrixInfo.prototype = {
	mProxy : null,
	mMatrixDepth : 0,
	mColorDepth : 0,
	mGraphics : null
}
Game.CheckMatrixInfo.staticInit = function Game_CheckMatrixInfo$staticInit() {
}

JS_AddInitFunc(function() {
	Game.CheckMatrixInfo.registerClass('Game.CheckMatrixInfo', null);
});
JS_AddStaticInitFunc(function() {
	Game.CheckMatrixInfo.staticInit();
});