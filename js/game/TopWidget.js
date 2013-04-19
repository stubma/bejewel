/**
 * @constructor
 */
Game.TopWidget = function Game_TopWidget() {
    this.mMessager = new Game.Messager();
    Game.TopWidget.initializeBase(this);
}
Game.TopWidget.prototype = {
    mMessager : null,
    mInitialized : false,
    InitMessager : function Game_TopWidget$InitMessager() {
        this.mInitialized = true;
        this.mMessager.Init(Game.Resources['FONT_FLAREGOTHIC16']);
        GameFramework.BaseApp.mApp.AddEventListener(GameFramework.widgets.WidgetEvent.KEY_CHAR, ss.Delegate.create(this, this.HandleKeyChar));
    },
    HandleKeyChar : function Game_TopWidget$HandleKeyChar(theE) {
        if(!this.mInitialized) {
            return;
        }
        if((theE).mKeyChar == 86) {
            var aVersionAppend = '';
            if(GameFramework.BaseApp.mApp.get_Is3D()) {
                aVersionAppend += '(HTML5 WebGL)';
            } else {
                aVersionAppend += '(HTML5 Canvas)';
            }
            if(this.mMessager.GetMessageCount() == 0) {
                this.mMessager.AddMessage(String.format('Version {0} ' + aVersionAppend, Game.Version.Get()));
            }
        }
    },
    Update : function Game_TopWidget$Update() {
        if(!this.mInitialized) {
            return;
        }
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
        this.mMessager.Update();
    },
    Draw : function Game_TopWidget$Draw(g) {
        if(!this.mInitialized) {
            return;
        }
        GameFramework.widgets.ClassicWidget.prototype.Draw.apply(this, [g]);
        this.mMessager.Draw(g, 10, Game.BejApp.mBejApp.mHeight + 20);
        if(Game.BejApp.mBejApp.mDebugKeysEnabled) {
            for(var i = 0; i < 2; ++i) {
                if(i == 0) {
                    g.PushColor(0xff000000);
                    g.PushTranslate(-1.0, -1.0);
                }
                g.SetFont(Game.Resources['FONT_FLAREGOTHIC16']);
                if(Game.BejApp.mBejApp.mAutoPlay != Game.DM.EAutoplay.None) {
                    g.DrawString(String.format('Autoplay: {0} -- {1}', Game.DM.gAutoplayDesc[(Game.BejApp.mBejApp.mAutoPlay | 0)], Game.Util.TicksToString(Game.Board.mTotalTicks)), 8, 22);
                }
                var s = String.format('v{0}', Game.Version.Get());
                s = 'DEBUG ' + s;
                g.DrawStringEx(s, Game.BejApp.mBejApp.mWidth - 4, 22, 0, 1);
                if(i == 0) {
                    g.PopColor();
                    g.PopMatrix();
                }
            }
        }
    }
}
Game.TopWidget.staticInit = function Game_TopWidget$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.TopWidget.registerClass('Game.TopWidget', GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function() {
    Game.TopWidget.staticInit();
});