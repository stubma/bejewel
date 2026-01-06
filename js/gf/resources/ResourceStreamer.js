GameFramework.resources.ResourceStreamer = function GameFramework_resources_ResourceStreamer() {
    this.mFailedChild = null;
    GameFramework.resources.ResourceStreamer.initializeBase(this);
};
GameFramework.resources.ResourceStreamer.prototype = {
    mGroupName: null,
    mParentResId: null,
    mId: null,
    mPath: null,
    mPath2: null,
    mBaseRes: null,
    mResultData: null,
    mResType: 0,
    mResourceCount: 0,
    mResourcesLoaded: 0,
    mFailed: false,
    mFailedChild: null,
    get_percentage: function GameFramework_resources_ResourceStreamer$get_percentage() {
        return this.mResourcesLoaded / this.mResourceCount;
    },
    ChildCompleted: function GameFramework_resources_ResourceStreamer$ChildCompleted(e) {
        this.mResourcesLoaded++;
    },
    ChildFailed: function GameFramework_resources_ResourceStreamer$ChildFailed(e) {
        this.mFailedChild = Type.safeCast(e.target, GameFramework.resources.ResourceStreamer);
        this.DispatchEvent(e);
    },
};
GameFramework.resources.ResourceStreamer.staticInit = function GameFramework_resources_ResourceStreamer$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.ResourceStreamer.registerClass(
        "GameFramework.resources.ResourceStreamer",
        GameFramework.events.EventDispatcher
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.ResourceStreamer.staticInit();
});
