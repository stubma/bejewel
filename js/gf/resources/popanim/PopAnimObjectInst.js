GameFramework.resources.popanim.PopAnimObjectInst = function GameFramework_resources_popanim_PopAnimObjectInst() {
}
GameFramework.resources.popanim.PopAnimObjectInst.prototype = {
	mName : null,
	mSpriteInst : null,
	mBlendSrcTransform : null,
	mBlendSrcColor : 0,
	mIsBlending : null,
	mTransform : null,
	mColorMult : 0xffffffff,
	mPredrawCallback : null
}
GameFramework.resources.popanim.PopAnimObjectInst.staticInit = function GameFramework_resources_popanim_PopAnimObjectInst$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.popanim.PopAnimObjectInst.registerClass('GameFramework.resources.popanim.PopAnimObjectInst', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.popanim.PopAnimObjectInst.staticInit();
});