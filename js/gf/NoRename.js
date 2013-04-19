GameFramework.NoRename = function GameFramework_NoRename() {
	GameFramework.NoRename.initializeBase(this);
}
GameFramework.NoRename.prototype = {

}
GameFramework.NoRename.staticInit = function GameFramework_NoRename$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.NoRename.registerClass('GameFramework.NoRename', System.Attribute);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.NoRename.staticInit();
});