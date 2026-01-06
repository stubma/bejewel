GameFramework.resources.popanim.PopAnimEvent = function GameFramework_resources_popanim_PopAnimEvent(theType) {
    GameFramework.resources.popanim.PopAnimEvent.initializeBase(this, [theType]);
};
GameFramework.resources.popanim.PopAnimEvent.prototype = {};
GameFramework.resources.popanim.PopAnimEvent.staticInit =
    function GameFramework_resources_popanim_PopAnimEvent$staticInit() {
        GameFramework.resources.popanim.PopAnimEvent.STOPPED = "popanim.stopped";
    };

JSFExt_AddInitFunc(function () {
    GameFramework.resources.popanim.PopAnimEvent.registerClass(
        "GameFramework.resources.popanim.PopAnimEvent",
        GameFramework.events.Event
    );
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.resources.popanim.PopAnimEvent.staticInit();
});
