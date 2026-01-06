GameFramework.misc.JSONString = function GameFramework_misc_JSONString(theString) {
    this.mString = theString;
};
GameFramework.misc.JSONString.prototype = {
    mString: null,
};
GameFramework.misc.JSONString.staticInit = function GameFramework_misc_JSONString$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.misc.JSONString.registerClass("GameFramework.misc.JSONString", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.misc.JSONString.staticInit();
});
