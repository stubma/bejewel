Game.LoadingScreen = function Game_LoadingScreen(theApp) {
    Game.LoadingScreen.initializeBase(this);
    this.mApp = theApp;
}
Game.LoadingScreen.prototype = {
    mApp : null,
    mHasFont : false,
    mFirstDraw : true,
    mEffect : null,
    Draw : function Game_LoadingScreen$Draw(g) {
        g.PushColor(0xff000080);
        g.FillRect(-160, 0, 1920, 1200);
        g.PopColor();
        if(this.mEffect != null) {
            var _t1 = g.PushTranslate(800, 600);
            try {
                this.mEffect.Draw(g);
            } finally {
                _t1.Dispose();
            }
            return;
        }
        if(this.mHasFont) {
            g.SetFont(Game.Resources['FONT_DEFAULT']);
            var aString = 'Loading';
            if((Game.BejApp.mBejApp.mConnecting) && (Game.BejApp.mBejApp.mGroupsLoading == 1)) {
                aString = 'Connecting';
            }
            for(var i = 0; i < (((((this.mUpdateCnt / 80) | 0)) | 0)) % 4; i++) {
                aString += '.';
            }
            g.DrawString(aString, 800 - g.StringWidth('Loading') / 2, 600);
            g.DrawStringEx('(' + GameFramework.BaseApp.mApp.mResourceStreamerList.length + ' resources left)', 800, 650, 0, 0);
            g.DrawStringEx(GameFramework.Utils.ToString(GameFramework.BaseApp.mApp.mCurFPS), 1585, 1185, 0, 1);
        }
    },
    Update : function Game_LoadingScreen$Update() {
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
    }
}
Game.LoadingScreen.staticInit = function Game_LoadingScreen$staticInit() {
}

JS_AddInitFunc(function() {
    Game.LoadingScreen.registerClass('Game.LoadingScreen', GameFramework.widgets.ClassicWidget);
});
JS_AddStaticInitFunc(function() {
    Game.LoadingScreen.staticInit();
});