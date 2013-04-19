/**
 * @constructor
 */
Game.DialogMgr = function Game_DialogMgr() {
    this.mDialogList = [];
    this.mDialogMap = {};
    this.mDialogDarkenBackPct = GameFramework.CurvedVal.CreateAsConstant(0.0);
    Game.DialogMgr.initializeBase(this);
    JS_Assert(Game.DialogMgr.mDialogMgr == null);
    Game.DialogMgr.mDialogMgr = this;
}
Game.DialogMgr.prototype = {
    mDialogList : null,
    mDialogMap : null,
    mDialogDarkenBackPct : null,
    KillDialog : function Game_DialogMgr$KillDialog(theDialogId, removeWidget, deleteWidget) {
        if(removeWidget === undefined) {
            removeWidget = true;
        }
        if(deleteWidget === undefined) {
            deleteWidget = true;
        }
        var aDialog = this.mDialogMap[(theDialogId | 0)];
        if(aDialog != null) {
            if(aDialog.mResult == -1) {
                aDialog.mResult = 0;
            }
            var findIdx = this.mDialogList.indexOf(aDialog);
            if(findIdx != -1) {
                this.mDialogList.removeAt(findIdx);
            }
            delete this.mDialogMap[(theDialogId | 0)];
            if((removeWidget || deleteWidget) && (aDialog.mParent != null)) {
                aDialog.mParent.RemoveWidget(aDialog);
            }
            if(aDialog.IsModal()) {
            }
            if(deleteWidget) {
            }
            return true;
        }
        return false;
    },
    DrawAll : function Game_DialogMgr$DrawAll(g) {
        this.mAppState.FlushDeferDraws();
        var aMatrixDepth = g.mMatrixDepth;
        var aColorDepth = g.mColorVector.length;
        this.Draw(g);
        JS_Assert(aMatrixDepth == g.mMatrixDepth, 'Matrix stack error - pops don\'t match pushes');
        JS_Assert(aColorDepth == g.mColorVector.length, 'Color stack error - pops don\'t match pushes');
        var darkenWidgetIdx;
        for(darkenWidgetIdx = this.mWidgets.length - 1; darkenWidgetIdx >= 0; --darkenWidgetIdx) {
            var d = Type.safeCast(this.mWidgets[darkenWidgetIdx], Game.Bej3Dialog);
            if(d == null || !d.mIsKilling) {
                break;
            }
        }
        if(darkenWidgetIdx < 0) {
            darkenWidgetIdx = 0;
        }
        for(var i = 0; i < this.mWidgets.length; ++i) {
            var aWidget = Type.safeCast(this.mWidgets[i], GameFramework.widgets.ClassicWidget);
            if(aWidget.mVisible) {
                if(i == darkenWidgetIdx) {
                    this.drawBackground(g);
                }
                var _t1 = g.PushTranslate(aWidget.mX, aWidget.mY);
                try {
                    aWidget.mLastDrawX = g.mMatrix.tx;
                    aWidget.mLastDrawY = g.mMatrix.ty;
                    aWidget.DrawAll(g);
                } finally {
                    _t1.Dispose();
                }
            }
            JS_Assert(aMatrixDepth == g.mMatrixDepth, 'Matrix stack error - pops don\'t match pushes');
            JS_Assert(aColorDepth == g.mColorVector.length, 'Color stack error - pops don\'t match pushes');
        }
        if(this.mWidgets.length == 0) {
            this.drawBackground(g);
        }
    },
    drawBackground : function Game_DialogMgr$drawBackground(g) {
        if(this.mDialogDarkenBackPct.get_v() != 0.0) {
            var _t2 = g.PushColor(GameFramework.gfx.Color.UInt_FAToInt(0, this.mDialogDarkenBackPct.get_v() * 0.65));
            try {
                g.FillRect(GameFramework.BaseApp.mApp.mX, GameFramework.BaseApp.mApp.mY, GameFramework.BaseApp.mApp.mDrawWidth, GameFramework.BaseApp.mApp.mDrawHeight);
            } finally {
                _t2.Dispose();
            }
        }
    },
    Update : function Game_DialogMgr$Update() {
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
        if(this.mDialogDarkenBackPct.get_v() != 0.0 && this.mDialogDarkenBackPct.GetOutFinalVal() != 0.0 && (this.mDialogList.length == 0 || ((Type.tryCast(this.mDialogList[this.mDialogList.length - 1], Game.Bej3Dialog)) && (!(this.mDialogList[this.mDialogList.length - 1]).mWantsDarken || (this.mDialogList.length == 1 && ((this.mDialogList[this.mDialogList.length - 1]).mIsKilling) || (this.mDialogList.length == 2 && (this.mDialogList[this.mDialogList.length - 1]).mIsKilling && !(this.mDialogList[0]).mWantsDarken)))))) {
            this.mDialogDarkenBackPct.Intercept('DialogMgr_cs_11_28_11__18_12_32_358');
        }
    },
    AddDialog : function Game_DialogMgr$AddDialog(theDialog) {
        var dialogId = theDialog.mDialogId;
        this.KillDialog(dialogId);
        if(theDialog.mWidth == 0) {
            var aWidth = this.mWidth / 2.0;
            theDialog.Resize((this.mWidth - aWidth) / 2, this.mHeight / 5, aWidth, theDialog.GetPreferredHeight(aWidth));
        }
        if(theDialog.mWantsDarken && (this.mDialogList.length == 0 || ((Type.tryCast(this.mDialogList[this.mDialogList.length - 1], Game.Bej3Dialog)) && (!(this.mDialogList[this.mDialogList.length - 1]).mWantsDarken || (this.mDialogList[this.mDialogList.length - 1]).mIsKilling)))) {
            this.mDialogDarkenBackPct.Intercept('DialogMgr_cs_11_28_11__18_12_06_572');
        }
        this.mDialogMap[(dialogId | 0)] = theDialog;
        this.mDialogList.push(theDialog);
        this.AddWidget(theDialog);
        if(theDialog.IsModal()) {
        }
    },
    GetDialog : function Game_DialogMgr$GetDialog(theDialogId) {
        return this.mDialogMap[(theDialogId | 0)];
    }
}
Game.DialogMgr.staticInit = function Game_DialogMgr$staticInit() {
    Game.DialogMgr.mDialogMgr = null;
}

JSFExt_AddInitFunc(function() {
    Game.DialogMgr.registerClass('Game.DialogMgr', GameFramework.widgets.ClassicWidget);
});
JSFExt_AddStaticInitFunc(function() {
    Game.DialogMgr.staticInit();
});