GameFramework.resources.popanim.PopAnimObjectDef = function GameFramework_resources_popanim_PopAnimObjectDef() {
}
GameFramework.resources.popanim.PopAnimObjectDef.prototype = {
	mName : null,
	mSpriteDef : null
}
GameFramework.resources.popanim.PopAnimObjectDef.staticInit = function GameFramework_resources_popanim_PopAnimObjectDef$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.popanim.PopAnimObjectDef.registerClass('GameFramework.resources.popanim.PopAnimObjectDef', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.popanim.PopAnimObjectDef.staticInit();
});
