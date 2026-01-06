GameFramework.widgets.WidgetEvent = function GameFramework_widgets_WidgetEvent(theType) {
    GameFramework.widgets.WidgetEvent.initializeBase(this, [theType]);
};
GameFramework.widgets.WidgetEvent.prototype = {
    mX: 0,
    mY: 0,
    mString: null,
    mKeyCode: null,
    mKeyChar: 0,
};
GameFramework.widgets.WidgetEvent.staticInit = function GameFramework_widgets_WidgetEvent$staticInit() {
    GameFramework.widgets.WidgetEvent.CLICKED = "clicked";
    GameFramework.widgets.WidgetEvent.MOUSE_DOWN = "mouse_down";
    GameFramework.widgets.WidgetEvent.MOUSE_UP = "mouse_up";
    GameFramework.widgets.WidgetEvent.MOUSE_ENTER = "mouse_enter";
    GameFramework.widgets.WidgetEvent.MOUSE_LEAVE = "mouse_leave";
    GameFramework.widgets.WidgetEvent.EDIT_TEXT = "edit_text";
    GameFramework.widgets.WidgetEvent.CHECKBOX_CHECKED = "checkbox_checked";
    GameFramework.widgets.WidgetEvent.SLIDER_CHANGED = "slider_changed";
    GameFramework.widgets.WidgetEvent.SLIDER_RELEASE = "slider_release";
    GameFramework.widgets.WidgetEvent.KEY_DOWN = "key_down";
    GameFramework.widgets.WidgetEvent.KEY_UP = "key_down";
    GameFramework.widgets.WidgetEvent.KEY_CHAR = "key_char";
};

JSFExt_AddInitFunc(function () {
    GameFramework.widgets.WidgetEvent.registerClass("GameFramework.widgets.WidgetEvent", GameFramework.events.Event);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.widgets.WidgetEvent.staticInit();
});
