GameFramework.misc.TMapSorter = function GameFramework_misc_TMapSorter(theDict, theCompareCallback) {
    this.mDict = theDict;
    this.mCompareCallback = theCompareCallback;
};
GameFramework.misc.TMapSorter.prototype = {
    mCompareCallback: null,
    mDict: null,
    Compare: function GameFramework_misc_TMapSorter$Compare(x, y) {
        return this.mCompareCallback.invoke(this.mDict.InternalGet(x), this.mDict.InternalGet(y));
    },
};
GameFramework.misc.TMapSorter.staticInit = function GameFramework_misc_TMapSorter$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.misc.TMapSorter.registerClass("GameFramework.misc.TMapSorter", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.misc.TMapSorter.staticInit();
});
