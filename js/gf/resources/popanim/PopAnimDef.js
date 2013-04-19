GameFramework.resources.popanim.PopAnimDef = function GameFramework_resources_popanim_PopAnimDef() {
	this.mObjectNamePool = [];
}
GameFramework.resources.popanim.PopAnimDef.prototype = {
	mMainSpriteDef : null,
	mSpriteDefVector : null,
	mObjectNamePool : null
}
GameFramework.resources.popanim.PopAnimDef.staticInit = function GameFramework_resources_popanim_PopAnimDef$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.popanim.PopAnimDef.registerClass('GameFramework.resources.popanim.PopAnimDef', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.popanim.PopAnimDef.staticInit();
});
