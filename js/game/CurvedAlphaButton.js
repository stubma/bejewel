Game.CurvedAlphaButton = function Game_CurvedAlphaButton() {
    this.mAlphaCv = GameFramework.CurvedVal.CreateAsConstant(1.0);
    Game.CurvedAlphaButton.initializeBase(this);
}
Game.CurvedAlphaButton.prototype = {
    mAlphaCv : null,
    Update : function Game_CurvedAlphaButton$Update() {
        this.mAlpha = this.mAlphaCv.get_v();
        GameFramework.widgets.ButtonWidget.prototype.Update.apply(this);
    }
}
Game.CurvedAlphaButton.staticInit = function Game_CurvedAlphaButton$staticInit() {
}

JS_AddInitFunc(function() {
    Game.CurvedAlphaButton.registerClass('Game.CurvedAlphaButton', GameFramework.widgets.ButtonWidget);
});
JS_AddStaticInitFunc(function() {
    Game.CurvedAlphaButton.staticInit();
});