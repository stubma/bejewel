Game.Tooltip = function Game_Tooltip() {
	this.mRequestedPos = new GameFramework.geom.TPoint(0, 0);
	this.mOffsetPos = new GameFramework.geom.TPoint(0, 0);
}
Game.Tooltip.prototype = {
	mRequestedPos : null,
	mOffsetPos : null,
	mWidth : 0,
	mHeight : 0,
	mArrowDir : null,
	mHeaderText : null,
	mBodyText : null,
	mTimer : 0,
	mAlphaPct : 0,
	mAppearing : null,
	mFontResourceTitle : null,
	mFontResource : null,
	mColor : 0
}
Game.Tooltip.staticInit = function Game_Tooltip$staticInit() {
}

JSFExt_AddInitFunc(function() {
	Game.Tooltip.registerClass('Game.Tooltip', null);
});
JSFExt_AddStaticInitFunc(function() {
	Game.Tooltip.staticInit();
});
Game.Tooltip.EArrowDir = {};
Game.Tooltip.EArrowDir.staticInit = function Game_Tooltip_EArrowDir$staticInit() {
	Game.Tooltip.EArrowDir.ARROW_UP = 0;
	Game.Tooltip.EArrowDir.ARROW_DOWN = 1;
	Game.Tooltip.EArrowDir.ARROW_LEFT = 2;
	Game.Tooltip.EArrowDir.ARROW_RIGHT = 3;
	Game.Tooltip.EArrowDir.NONE = 4;
}
JSFExt_AddInitFunc(function() {
	Game.Tooltip.EArrowDir.staticInit();
});