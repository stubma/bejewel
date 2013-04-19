GameFramework.connected.UserInfo = function GameFramework_connected_UserInfo() {
}
GameFramework.connected.UserInfo.prototype = {
	mName : null,
	mSocialUserId : null,
	mUserDBId : null,
	mImageResource : null,
	mLoadingProfilePicture : false,
	ProfilePicLoaded : function GameFramework_connected_UserInfo$ProfilePicLoaded(e) {
		var aResourceStreamer = e.target;
		this.mImageResource = aResourceStreamer.mResultData;
	}
}
GameFramework.connected.UserInfo.staticInit = function GameFramework_connected_UserInfo$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.connected.UserInfo.registerClass('GameFramework.connected.UserInfo', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.connected.UserInfo.staticInit();
});