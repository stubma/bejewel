GameFramework.connected.ConnectedRequest = function GameFramework_connected_ConnectedRequest() {
    GameFramework.connected.ConnectedRequest.initializeBase(this);
    GameFramework.connected.ConnectedRequest.mRequestCount++;
    this.mRequestId = GameFramework.connected.ConnectedRequest.mRequestCount;
};
GameFramework.connected.ConnectedRequest.LinkedRequestDoneStatic =
    function GameFramework_connected_ConnectedRequest$LinkedRequestDoneStatic(e) {};
GameFramework.connected.ConnectedRequest.prototype = {
    mRequestType: GameFramework.connected.ConnectedRequest.REQUESTTYPE_NONE,
    mRequestId: 0,
    mLinkedRequestCount: 0,
    mRequest: null,
    mRequestParams: null,
    mGetterObject: null,
    mDataTarget: null,
    mError: null,
    mWantsRecv: null,
    mResult: null,
    mIsDone: null,
    mIsMultiResult: null,
    LinkRequest: function GameFramework_connected_ConnectedRequest$LinkRequest(theRequiredRequest) {
        this.mLinkedRequestCount++;
        theRequiredRequest.AddEventListener(
            GameFramework.events.Event.COMPLETE,
            ss.Delegate.create(this, this.LinkedRequestDone)
        );
    },
    LinkedRequestDone: function GameFramework_connected_ConnectedRequest$LinkedRequestDone(e) {
        this.mLinkedRequestCount--;
    },
};
GameFramework.connected.ConnectedRequest.staticInit = function GameFramework_connected_ConnectedRequest$staticInit() {
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_NONE = 0;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_GET = 1;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_BLIND_GET = 2;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_POST = 3;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_FBGRAPH = 4;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_DATABASE_UPDATE = 5;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_DATABASE_QUERY = 6;
    GameFramework.connected.ConnectedRequest.REQUESTTYPE_CUSTOM = 7;
    GameFramework.connected.ConnectedRequest.mRequestCount = 0;
};

JSFExt_AddInitFunc(function () {
    GameFramework.connected.ConnectedRequest.registerClass(
        "GameFramework.connected.ConnectedRequest",
        GameFramework.events.EventDispatcher
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.connected.ConnectedRequest.staticInit();
});
