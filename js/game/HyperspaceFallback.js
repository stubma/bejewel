Game.HyperspaceFallback = function Game_HyperspaceFallback(theBoard) {
    this.mFromCenterPct = new GameFramework.CurvedVal();
    this.mToCenterPct = new GameFramework.CurvedVal();
    this.mBallAlpha = new GameFramework.CurvedVal();
    this.mPrevBkgAlpha = new GameFramework.CurvedVal();
    Game.HyperspaceFallback.initializeBase(this);
    this.mBoard = theBoard;
    this.mBoard = theBoard;
    this.mFromBall = new Game.CrystalBall('', 0);
    this.mToBall = new Game.CrystalBall('', 0);
    this.mToBall.mShowShadow = false;
    this.mFromCenterPct.SetCurve(('b+0,1,0.0025,1,~###  .~###   4####    b####'));
    this.mToCenterPct.SetCurveLinked(('b+0,1,0.003333,1,####   g####     K~###m~###'), this.mFromCenterPct);
    this.mFromBall.mFullPct.SetCurveLinked('b+0,1,0.003333,1,~###x~###   ]####     J####', this.mFromCenterPct);
    this.mFromBall.mScale.SetCurveLinked('b+0,1,0,1,~###|~###  @/k=] 3####     R####', this.mFromCenterPct);
    this.mToBall.mFullPct.SetCurveLinked('b+0,1,0.003333,1,####    i####     8~###', this.mFromCenterPct);
    this.mToBall.mScale.SetCurveLinked('b+0,1,0.003333,1,####   d####      =~###', this.mFromCenterPct);
    this.mBoard.mAlpha.SetCurveRefLinked('Hyperspace_cs_11_10_11__11_45_36_674', this.mFromCenterPct);
    this.mBallAlpha.SetCurveRefLinked('Hyperspace_cs_11_10_11__12_06_32_324', this.mFromCenterPct);
    this.mPrevBkgAlpha.SetCurveRefLinked('Hyperspace_cs_11_10_11__12_08_47_105', this.mFromCenterPct);
    this.mPrevBkgImage = this.mBoard.mBackground.mImage;
    this.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.Start);
}
Game.HyperspaceFallback.prototype = {
    mBoard : null,
    mFromBall : null,
    mToBall : null,
    mFromCenterPct : null,
    mToCenterPct : null,
    mBallAlpha : null,
    mPrevBkgAlpha : null,
    mPrevBkgImage : null,
    GetPieceAlpha : function Game_HyperspaceFallback$GetPieceAlpha() {
        return this.mBoard.mAlpha.get_v();
    },
    Update : function Game_HyperspaceFallback$Update() {
        Game.Hyperspace.prototype.Update.apply(this);
        if(this.mUpdateCnt == 2) {
            this.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.NextBkg);
        }
        if(this.mUpdateCnt == 100) {
            Game.BejApp.mBejApp.PlaySound(Game.Resources['SOUND_NEXTLEVEL']);
        }
        if(this.mUpdateCnt == 240) {
        }
        if(!this.mFromCenterPct.IncInVal()) {
            this.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.Finish);
        }
        if(this.mUpdateCnt == 180) {
            this.mBoard.mSideXOff.SetConstant(0);
            this.mBoard.RandomizeBoard();
            this.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.OldLevelClear);
        }
        if(this.mUpdateCnt == 250) {
            this.mBoard.RandomizeBoard();
        }
        this.mFromBall.Update();
        this.mToBall.Update();
    },
    Draw : function Game_HyperspaceFallback$Draw(g) {
        Game.Hyperspace.prototype.Draw.apply(this, [g]);
        var _t23 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mPrevBkgAlpha.get_v()));
        try {
            if(this.mPrevBkgImage.mHeight == this.mHeight) {
                g.DrawImage(this.mPrevBkgImage, (((1920 - this.mPrevBkgImage.mWidth) / 2) | 0), 0);
            } else {
                var aScaleFactor = this.mHeight / this.mPrevBkgImage.mHeight;
                var _t24 = g.PushScale(aScaleFactor, aScaleFactor, 160, 0);
                try {
                    g.DrawImage(this.mPrevBkgImage, (1920 - this.mPrevBkgImage.mWidth * aScaleFactor) / 2.0, 0.0);
                } finally {
                    _t24.Dispose();
                }
            }
        } finally {
            _t23.Dispose();
        }
        var aPositions = Array.Create(2, 2, new GameFramework.geom.TPoint(250, 600), new GameFramework.geom.TPoint(960, 600));
        var aBalls = Array.Create(2, 2, this.mFromBall, this.mToBall);
        var aCenterPct = Array.Create(2, 2, this.mFromCenterPct.get_v(), this.mToCenterPct.get_v());
        for(var i = 1; i < 2; i++) {
            var aPos = new GameFramework.geom.TPoint(this.mWidth / 2, this.mHeight / 2);
            var _t25 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mBallAlpha.get_v()));
            try {
                var _t26 = g.PushTranslate(aPos.x, aPos.y);
                try {
                    aBalls[i].mOffset = aPos.subtract(new GameFramework.geom.TPoint(aPos.x, aPos.y));
                    aBalls[i].Draw(g);
                } finally {
                    _t26.Dispose();
                }
            } finally {
                _t25.Dispose();
            }
        }
    }
}
Game.HyperspaceFallback.staticInit = function Game_HyperspaceFallback$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.HyperspaceFallback.registerClass('Game.HyperspaceFallback', Game.Hyperspace);
});
JSFExt_AddStaticInitFunc(function() {
    Game.HyperspaceFallback.staticInit();
});