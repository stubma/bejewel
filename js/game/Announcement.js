/**
 * @constructor
 */
Game.Announcement = function Game_Announcement(theBoard, theText) {
    this.mPos = new GameFramework.geom.TPoint(0, 0);
    this.mAlpha = new GameFramework.CurvedVal();
    this.mScale = new GameFramework.CurvedVal();
    this.mHorzScaleMult = new GameFramework.CurvedVal();
    this.mBoard = theBoard;
    if(this.mBoard != null) {
        this.mPos = new GameFramework.geom.TPoint(this.mBoard.GetBoardCenterX(), 500);
        if(!this.mBoard.mDrawGameElements) {
            this.mPos.x = 800.0;
        }
    }
    this.mText = theText;
    this.mAlpha.SetCurve('b+0,1,0.003333,1,#### Q~###      ~~### O####');
    this.mScale.SetCurve('b+0,1,0.003333,1,#### Q~###       #~### O####');
    this.mHorzScaleMult.SetConstant(1.0);
    this.mDarkenBoard = true;
    this.mBlocksPlay = true;
    this.mFont = Game.Resources['FONT_HUGE'];
    if(this.mBoard != null) {
        this.mBoard.HandleAnnouncementAdded(this);
    }
}
Game.Announcement.prototype = {
    mPos : null,
    mText : null,
    mAlpha : null,
    mScale : null,
    mHorzScaleMult : null,
    mDarkenBoard : null,
    mBlocksPlay : null,
    mBoard : null,
    mFont : null,
    End : function Game_Announcement$End() {
        if(this.mAlpha.GetInVal() < 0.85) {
            this.mAlpha.SetInVal(0.85, true);
            this.mScale.SetInVal(0.85, true);
            this.mHorzScaleMult.SetInVal(0.85, true);
        }
    },
    Update : function Game_Announcement$Update() {
        this.mAlpha.IncInVal();
        this.mScale.IncInVal();
        this.mHorzScaleMult.IncInVal();
        if(!this.mAlpha.IsDoingCurve() && !this.mScale.IsDoingCurve()) {
            if(this.mBoard != null) {
                this.mBoard.HandleAnnouncementComplete(this);
            }
            return;
        }
        if((this.mDarkenBoard) && (this.mBoard != null)) {
            this.mBoard.mBoardDarkenAnnounce = this.mAlpha.GetOutVal();
        }
    },
    Draw : function Game_Announcement$Draw(g) {
        if(this.mScale.GetOutVal() == 0.0) {
            return;
        }
        g.SetFont(this.mFont);
        var aColor = GameFramework.gfx.Color.WHITE.Clone();
        if(this.mBoard != null) {
            aColor.mAlpha = ((this.mAlpha.GetOutVal() * this.mBoard.GetPieceAlpha() * 255) | 0);
        } else {
            aColor.mAlpha = ((this.mAlpha.GetOutVal() * 255) | 0);
        }
        g.PushColor(aColor.ToInt());
        var aCenterX = this.mPos.x + (this.mBoard != null ? this.mBoard.mSideXOff.GetOutVal() : 0.0);
        var aCenterY = this.mPos.y;
        var aLines = 1;
        for(var i = 0; i < this.mText.length; i++) {
            if(GameFramework.Utils.GetCharCodeAt(this.mText, i) == 10) {
                aLines++;
            }
        }
        g.PushScale(this.mScale.GetOutVal() * this.mHorzScaleMult.GetOutVal(), this.mScale.GetOutVal(), aCenterX, aCenterY);
        var aLineNum = 0;
        var aPos = 0;
        for(var i_2 = 0; i_2 < this.mText.length; i_2++) {
            if(GameFramework.Utils.GetCharCodeAt(this.mText, i_2) == 10) {
                g.DrawStringEx(this.mText.substr(aPos, i_2 - aPos), aCenterX, aCenterY - aLines * 70 + aLineNum * 140 + 120, 0, 0);
                aPos = i_2 + 1;
                aLineNum++;
            }
        }
        g.DrawStringEx(this.mText.substr(aPos), aCenterX, aCenterY - aLines * 70 + aLineNum * 140 + 120, 0, 0);
        g.PopMatrix();
        g.PopColor();
    }
}
Game.Announcement.staticInit = function Game_Announcement$staticInit() {
}

JS_AddInitFunc(function() {
    Game.Announcement.registerClass('Game.Announcement', null);
});
JS_AddStaticInitFunc(function() {
    Game.Announcement.staticInit();
});