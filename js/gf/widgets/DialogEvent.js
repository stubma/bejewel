GameFramework.widgets.DialogEvent = function GameFramework_widgets_DialogEvent(theType, theDialog) {
    GameFramework.widgets.DialogEvent.initializeBase(this, [theType]);
    this.mDialog = theDialog;
};
GameFramework.widgets.DialogEvent.prototype = {
    mCloseResult: -1,
    mDialog: null,
    WasYesPressed: function GameFramework_widgets_DialogEvent$WasYesPressed() {
        return this.mCloseResult == GameFramework.widgets.Dialog.ID_YES;
    },
};
GameFramework.widgets.DialogEvent.staticInit = function GameFramework_widgets_DialogEvent$staticInit() {
    GameFramework.widgets.DialogEvent.CLOSED = "closed";
};

JSFExt_AddInitFunc(function () {
    GameFramework.widgets.DialogEvent.registerClass("GameFramework.widgets.DialogEvent", GameFramework.events.Event);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.widgets.DialogEvent.staticInit();
});
