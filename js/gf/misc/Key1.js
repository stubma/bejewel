GameFramework.misc.Key1 = function GameFramework_misc_Key1(theKey) {
    GameFramework.misc.Key1.initializeBase(this, [theKey, 1]);
};
GameFramework.misc.Key1.prototype = {};
GameFramework.misc.Key1.staticInit = function GameFramework_misc_Key1$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.misc.Key1.registerClass("GameFramework.misc.Key1", GameFramework.misc.KeyVal);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.misc.Key1.staticInit();
});
