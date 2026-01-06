GameFramework.resources.BaseRes = function GameFramework_resources_BaseRes() {};
GameFramework.resources.BaseRes.prototype = {
    mType: 0,
    mId: null,
    mPath: null,
    mParent: null,
    mGroup: null,
    mCols: 1,
    mRows: 1,
    mOffsetX: 0,
    mOffsetY: 0,
    mNumSamples: 0,
    mOrigWidth: 0,
    mOrigHeight: 0,
    mWidth: 0,
    mHeight: 0,
    mTags: null,
    mChildren: null,
    mExtensions: null,
    mRTParent: null,
    mAtlasX: 0,
    mAtlasY: 0,
    mAtlasWidth: 0,
    mAtlasHeight: 0,
    mAtlasRTX: 0,
    mAtlasRTY: 0,
    mAtlasRTFlags: 0,
    mIsRuntimeImage: null,
    mIsNotRuntimeImage: null,
    mRTChildCount: 0,
    mRTChildLoadedCount: 0,
    mDisposableResource: null,
};
GameFramework.resources.BaseRes.staticInit = function GameFramework_resources_BaseRes$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.resources.BaseRes.registerClass("GameFramework.resources.BaseRes", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.BaseRes.staticInit();
});
