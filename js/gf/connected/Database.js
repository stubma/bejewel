GameFramework.connected.Database = function GameFramework_connected_Database() {
	this.mRequestIdToRequest = {};
	this.mLinkedRequestMap = {};
}
GameFramework.connected.Database.prototype = {
	mRequestId : 0,
	mURL : 'http://mooami.internal.popcap.com/p4_managed/PrimeSharp/prime/Database/query_engine.php',
	mRequestIdToRequest : null,
	mLinkedRequestMap : null,
	UpdateDB : function GameFramework_connected_Database$UpdateDB(theDBName, theCollectionName, theSelector, theUpdate, theFlags) {
		var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
		var aFlags = null;
		if(theFlags != 0) {
			aFlags = {};
			if((theFlags & GameFramework.connected.Database.FLAGS_UPSERT) != 0) {
				aFlags['upsert'] = true;
			}
			if((theFlags & GameFramework.connected.Database.FLAGS_MULTIUPDATE) != 0) {
				aFlags['multiupdate'] = true;
			}
		}
		var aJSONString = GameFramework.BaseApp.mApp.EncodeJSON(Array.Create(7, null, new GameFramework.misc.KeyVal('db', theDBName), new GameFramework.misc.KeyVal('collection', theCollectionName), new GameFramework.misc.KeyVal('cmd', 'update'), new GameFramework.misc.KeyVal('flags', aFlags), new GameFramework.misc.KeyVal('reqid', this.mRequestId), new GameFramework.misc.KeyVal('selector', theSelector), new GameFramework.misc.KeyVal('update', theUpdate)));
		aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_DATABASE_UPDATE;
		aConnectedRequest.mRequest = new GameFramework.misc.JSONString(aJSONString);
		aConnectedRequest.mWantsRecv = false;
		this.mRequestIdToRequest[this.mRequestId] = aConnectedRequest;
		this.mRequestId++;
		return aConnectedRequest;
	},
	UpdateId : function GameFramework_connected_Database$UpdateId(theDBName, theCollectionName, theId, theUpdate, theFlags) {
		return this.UpdateDB(theDBName, theCollectionName, Array.Create(1, null, new GameFramework.misc.KeyVal('_id', theId)), theUpdate, theFlags);
	},
	QueryDB : function GameFramework_connected_Database$QueryDB(theDBName, theCollectionName, theQuery, theFieldSelector, theFlags) {
		var aConnectedRequest = GameFramework.BaseApp.mApp.CreateConnectRequest();
		var aCmd;
		if((theFlags & GameFramework.connected.Database.FLAGS_EXHAUST) != 0) {
			aCmd = 'find';
		} else {
			aCmd = 'findOne';
		}
		var aJSONString = GameFramework.BaseApp.mApp.EncodeJSON(Array.Create(6, null, new GameFramework.misc.KeyVal('db', theDBName), new GameFramework.misc.KeyVal('collection', theCollectionName), new GameFramework.misc.KeyVal('cmd', aCmd), new GameFramework.misc.KeyVal('reqid', this.mRequestId), new GameFramework.misc.KeyVal('query', theQuery), new GameFramework.misc.KeyVal('fields', theFieldSelector)));
		aConnectedRequest.mRequestType = GameFramework.connected.ConnectedRequest.REQUESTTYPE_DATABASE_QUERY;
		aConnectedRequest.mRequest = new GameFramework.misc.JSONString(aJSONString);
		aConnectedRequest.mWantsRecv = true;
		this.mRequestIdToRequest[this.mRequestId] = aConnectedRequest;
		this.mRequestId++;
		return aConnectedRequest;
	},
	QueryId : function GameFramework_connected_Database$QueryId(theDBName, theCollectionName, theId, theFieldSelector, theFlags) {
		return this.QueryDB(theDBName, theCollectionName, new GameFramework.misc.KeyVal('_id', theId), theFieldSelector, theFlags);
	},
	ParseResponse : function GameFramework_connected_Database$ParseResponse(theJSONData) {
		var aResponseArray = [];
		GameFramework.BaseApp.mApp.DecodeJSON(theJSONData, aResponseArray);

		{
			var $enum1 = ss.IEnumerator.getEnumerator(aResponseArray);
			while($enum1.moveNext()) {
				var aResponseData = $enum1.get_current();
				var aRequestId = (aResponseData['reqid'] | 0);
				var aResult = aResponseData['result'];
				var anError = aResponseData['error'];
				var aConnectedRequest = this.mRequestIdToRequest[aRequestId];
				if(aConnectedRequest != null) {
					delete this.mRequestIdToRequest[aRequestId];
					aConnectedRequest.mResult = true;
					aConnectedRequest.mDataTarget = aResult;
					aConnectedRequest.mError = anError;
				}
			}
		}
	},
	Update : function GameFramework_connected_Database$Update() {
	}
}
GameFramework.connected.Database.staticInit = function GameFramework_connected_Database$staticInit() {
	GameFramework.connected.Database.FLAGS_UPSERT = 1;
	GameFramework.connected.Database.FLAGS_MULTIUPDATE = 2;
	GameFramework.connected.Database.FLAGS_EXHAUST = 1 << 6;
}

JSFExt_AddInitFunc(function() {
	GameFramework.connected.Database.registerClass('GameFramework.connected.Database', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.connected.Database.staticInit();
});