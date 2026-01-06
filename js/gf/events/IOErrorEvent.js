GameFramework.events.IOErrorEvent = function GameFramework_events_IOErrorEvent(theType) {
    GameFramework.events.IOErrorEvent.initializeBase(this, [theType]);
};
GameFramework.events.IOErrorEvent.prototype = {};
GameFramework.events.IOErrorEvent.staticInit = function GameFramework_events_IOErrorEvent$staticInit() {
    GameFramework.events.IOErrorEvent.IO_ERROR = "ioError";
};

JSFExt_AddInitFunc(function () {
    GameFramework.events.IOErrorEvent.registerClass("GameFramework.events.IOErrorEvent", GameFramework.events.Event);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.events.IOErrorEvent.staticInit();
});
