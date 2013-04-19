GameFramework.resources.popanim.PopAnimFrame = function GameFramework_resources_popanim_PopAnimFrame() {
}
GameFramework.resources.popanim.PopAnimFrame.prototype = {
	mFrameObjectPosVector : null,
	mHasStop : false,
	mCommandVector : null
}
GameFramework.resources.popanim.PopAnimFrame.staticInit = function GameFramework_resources_popanim_PopAnimFrame$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.popanim.PopAnimFrame.registerClass('GameFramework.resources.popanim.PopAnimFrame', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.popanim.PopAnimFrame.staticInit();
});