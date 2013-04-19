Game.GfxUtil = function Game_GfxUtil() {
}
Game.GfxUtil.GetEllipsisString = function Game_GfxUtil$GetEllipsisString(g, theString, theWidth) {
	if(g.StringWidth(theString) <= theWidth) {
		return theString;
	}
	var aTempString = theString;
	while((aTempString.length > 0) && (g.StringWidth(aTempString + '...') > theWidth)) {
		aTempString = aTempString.remove(aTempString.length - 1);
	}
	return aTempString + '...';
}
Game.GfxUtil.prototype = {

}
Game.GfxUtil.staticInit = function Game_GfxUtil$staticInit() {
}

JSFExt_AddInitFunc(function() {
	Game.GfxUtil.registerClass('Game.GfxUtil', null);
});
JSFExt_AddStaticInitFunc(function() {
	Game.GfxUtil.staticInit();
});