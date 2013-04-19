GameFramework.misc.KeyVal = function GameFramework_misc_KeyVal(theKey, theValue) {
	this.mKey = theKey;
	this.mValue = theValue;
}
GameFramework.misc.KeyVal.prototype = {
	mKey : null,
	mValue : null
}
GameFramework.misc.KeyVal.staticInit = function GameFramework_misc_KeyVal$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.misc.KeyVal.registerClass('GameFramework.misc.KeyVal', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.misc.KeyVal.staticInit();
});