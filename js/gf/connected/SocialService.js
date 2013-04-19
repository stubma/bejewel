GameFramework.connected.SocialService = function GameFramework_connected_SocialService() {
	this.mFriendArray = [];
}
GameFramework.connected.SocialService.prototype = {
	mFriendArray : null,
	mMyInfo : null,
	Init : function GameFramework_connected_SocialService$Init() {
		return null;
	},
	Login : function GameFramework_connected_SocialService$Login() {
		return null;
	},
	TryGetProfilePicture : function GameFramework_connected_SocialService$TryGetProfilePicture(theUserInfo) {
		return null;
	},
	GetUserData : function GameFramework_connected_SocialService$GetUserData() {
		return null;
	},
	Update : function GameFramework_connected_SocialService$Update() {
	}
}
GameFramework.connected.SocialService.staticInit = function GameFramework_connected_SocialService$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.connected.SocialService.registerClass('GameFramework.connected.SocialService', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.connected.SocialService.staticInit();
});