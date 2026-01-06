GameFramework.connected.HTTPService = function GameFramework_connected_HTTPService() {};
GameFramework.connected.HTTPService.URLEncode = function GameFramework_connected_HTTPService$URLEncode(theString) {
    var aHexChars = "0123456789ABCDEF";
    var aString = "";
    for (var i = 0; i < theString.length; i++) {
        switch (theString.charCodeAt(i)) {
            case 32:
            case 63:
            case 38:
            case 37:
            case 43:
            case 13:
            case 10:
            case 9: {
                aString += String.fromCharCode(37);
                aString += String.fromCharCode(aHexChars.charCodeAt((theString.charCodeAt(i) >> 4) & 0xf));
                aString += String.fromCharCode(aHexChars.charCodeAt(theString.charCodeAt(i) & 0xf));
                break;
            }
            default: {
                aString += String.fromCharCode(theString.charCodeAt(i));
                break;
            }
        }
    }
    return aString.toString();
};
GameFramework.connected.HTTPService.prototype = {
    Post: function GameFramework_connected_HTTPService$Post(theURL, theData) {
        var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
        aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_POST;
        aConnectedRequest.mRequest = theURL;
        aConnectedRequest.mRequestParams = theData;
        return aConnectedRequest;
    },
    Get: function GameFramework_connected_HTTPService$Get(theURL) {
        var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
        aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_GET;
        aConnectedRequest.mRequest = theURL;
        return aConnectedRequest;
    },
    BlindGet: function GameFramework_connected_HTTPService$BlindGet(theURL) {
        var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
        aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_BLIND_GET;
        aConnectedRequest.mRequest = theURL;
        return aConnectedRequest;
    },
    Update: function GameFramework_connected_HTTPService$Update() {},
};
GameFramework.connected.HTTPService.staticInit = function GameFramework_connected_HTTPService$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.connected.HTTPService.registerClass("GameFramework.connected.HTTPService", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.connected.HTTPService.staticInit();
});
