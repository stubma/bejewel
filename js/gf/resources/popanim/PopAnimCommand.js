GameFramework.resources.popanim.PopAnimCommand = function GameFramework_resources_popanim_PopAnimCommand() {
}
GameFramework.resources.popanim.PopAnimCommand.prototype = {
	mCommand : null,
	mParam : null
}
GameFramework.resources.popanim.PopAnimCommand.staticInit = function GameFramework_resources_popanim_PopAnimCommand$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.popanim.PopAnimCommand.registerClass('GameFramework.resources.popanim.PopAnimCommand', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.popanim.PopAnimCommand.staticInit();
});