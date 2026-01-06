GameFramework.events.Event = function GameFramework_events_Event(theType) {
    this.type = theType;
};
GameFramework.events.Event.prototype = {
    type: null,
    text: null,
    target: null,
    dispatcher: null,
};
GameFramework.events.Event.staticInit = function GameFramework_events_Event$staticInit() {
    GameFramework.events.Event.CANCEL = "cancel";
    GameFramework.events.Event.CHANGE = "change";
    GameFramework.events.Event.COMPLETE = "complete";
    GameFramework.events.Event.ENTER_FRAME = "enterFrame";
    GameFramework.events.Event.EXIT_FRAME = "exitFrame";
};

JSFExt_AddInitFunc(function () {
    GameFramework.events.Event.registerClass("GameFramework.events.Event", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.events.Event.staticInit();
});
