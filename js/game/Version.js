Game.Version = function Game_Version() {
}
Game.Version.Get = function Game_Version$Get() {
	return Game.Version.mVersion;
}
Game.Version.prototype = {

}
Game.Version.staticInit = function Game_Version$staticInit() {
	Game.Version.mVersion = '0.9.12.9490';
}

JS_AddInitFunc(function() {
	Game.Version.registerClass('Game.Version', null);
});
JS_AddStaticInitFunc(function() {
	Game.Version.staticInit();
});