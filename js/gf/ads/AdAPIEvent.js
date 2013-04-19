GameFramework.ads.AdAPIEvent = function GameFramework_ads_AdAPIEvent(theType) {
	GameFramework.ads.AdAPIEvent.initializeBase(this, [theType]);
}
GameFramework.ads.AdAPIEvent.prototype = {

}
GameFramework.ads.AdAPIEvent.staticInit = function GameFramework_ads_AdAPIEvent$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.ads.AdAPIEvent.registerClass('GameFramework.ads.AdAPIEvent', GameFramework.events.Event);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.ads.AdAPIEvent.staticInit();
});