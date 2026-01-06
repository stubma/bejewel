GameFramework.connected.Facebook = function GameFramework_connected_Facebook() {
    GameFramework.connected.Facebook.initializeBase(this);
};
GameFramework.connected.Facebook.prototype = {
    mAppId: "105312389549092",
    mLoginRequest: null,
    mAccessToken: null,
    SetAppInfo: function GameFramework_connected_Facebook$SetAppInfo(theAppId) {},
    ParseUserData: function GameFramework_connected_Facebook$ParseUserData(e) {
        var aConnectedRequest = e.target;
        var aDict = {};
        GameFramework.BaseApp.mApp.DecodeJSON(aConnectedRequest.mResult, aDict);
        this.mMyInfo = new GameFramework.connected.UserInfo();
        this.mMyInfo.mSocialUserId = aDict["id"];
        this.mMyInfo.mUserDBId = "fb" + aDict["id"];
        this.mMyInfo.mName = aDict["name"];
    },
    ParseFriendData: function GameFramework_connected_Facebook$ParseFriendData(e) {
        var aConnectedRequest = e.target;
        var aDict = {};
        GameFramework.BaseApp.mApp.DecodeJSON(aConnectedRequest.mResult, aDict);
        var anArray = Type.safeCast(aDict["data"], GameFramework.TArray);
        this.mFriendArray = [];

        {
            var $enum1 = ss.IEnumerator.getEnumerator(anArray);
            while ($enum1.moveNext()) {
                var aUserData = $enum1.get_current();
                var aUserInfo = new GameFramework.connected.UserInfo();
                aUserInfo.mSocialUserId = aUserData["id"];
                aUserInfo.mUserDBId = "fb" + aUserData["id"];
                aUserInfo.mName = aUserData["name"];
                this.mFriendArray.push(aUserInfo);
            }
        }
    },
    TryGetProfilePicture: function GameFramework_connected_Facebook$TryGetProfilePicture(theUserInfo) {
        if (!theUserInfo.mLoadingProfilePicture) {
            var aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImageFromPath(
                "https://graph.facebook.com/" + theUserInfo.mSocialUserId + "/picture?access_token=" + this.mAccessToken
            );
            aResourceStreamer.AddEventListener(
                GameFramework.events.Event.COMPLETE,
                ss.Delegate.create(theUserInfo, theUserInfo.ProfilePicLoaded)
            );
            theUserInfo.mLoadingProfilePicture = true;
        }
        return theUserInfo.mImageResource;
    },
    EnsureLoggedIn: function GameFramework_connected_Facebook$EnsureLoggedIn(theConnectedRequest) {
        if (this.mAccessToken == null) {
            var aLoginRequest = this.Login();
            theConnectedRequest.LinkRequest(aLoginRequest);
        }
    },
    CreateGraphRequest: function GameFramework_connected_Facebook$CreateGraphRequest(theRequest) {
        var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
        aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_FBGRAPH;
        aConnectedRequest.mRequest = theRequest;
        this.EnsureLoggedIn(aConnectedRequest);
        return aConnectedRequest;
    },
    GetUserData: function GameFramework_connected_Facebook$GetUserData() {
        var aMeId = "me";
        var aFriendRequest = this.CreateGraphRequest("/" + aMeId + "/friends");
        aFriendRequest.AddEventListener(
            GameFramework.events.Event.COMPLETE,
            ss.Delegate.create(this, this.ParseFriendData)
        );
        var aConnectedRequest = this.CreateGraphRequest("/" + aMeId);
        aConnectedRequest.AddEventListener(
            GameFramework.events.Event.COMPLETE,
            ss.Delegate.create(this, this.ParseUserData)
        );
        aConnectedRequest.LinkRequest(aFriendRequest);
        return aConnectedRequest;
    },
};
GameFramework.connected.Facebook.staticInit = function GameFramework_connected_Facebook$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.connected.Facebook.registerClass(
        "GameFramework.connected.Facebook",
        GameFramework.connected.SocialService
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.connected.Facebook.staticInit();
});
