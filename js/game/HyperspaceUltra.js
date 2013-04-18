Game.HyperspaceUltra = function Game_HyperspaceUltra(theBoard) {
    this.mGemInfo = Array.Create2D(Game.Board.NUM_ROWS, Game.Board.NUM_COLS, null);
    this.mBoardInfo = new Game.BoardInfo();
    this.mGemRenderOrder = [];
    this.mCameraPersp = new GameFramework.gfx.PerspectiveCamera();
    this.mBGScale = new GameFramework.CurvedVal();
    this.mXOffsetAnim = new GameFramework.CurvedVal();
    this.mMinAlpha = new GameFramework.CurvedVal();
    this.mShatterScale = new GameFramework.CurvedVal();
    this.mWarpTubeTextureFade = new GameFramework.CurvedVal();
    this.mRingFadeTunnelIn = new GameFramework.CurvedVal();
    this.mRingFadeTunnelOut = new GameFramework.CurvedVal();
    this.mPieceAlpha = new GameFramework.CurvedVal();
    this.mBoardScreenPos = new GameFramework.geom.Vector3();
    Game.HyperspaceUltra.initializeBase(this);
    var iAnim = 0;
    iAnim = 0;
    this.mAnimSeq = Game.BejApp.mBejApp.mHyperSpaceAnims[iAnim];
    this.mAnimSeq.Reset();
    this.mCameraPersp.Init(this.GetFocalLength(), GameFramework.BaseApp.mApp.mWidth / GameFramework.BaseApp.mApp.mHeight, 100.0, this.GetZFarClip());
    this.mBoardInfo.Init(theBoard, this.mAnimSeq);
    for(var aRow = 0; aRow < Game.Board.NUM_ROWS; aRow++) {
        for(var aCol = 0; aCol < Game.Board.NUM_COLS; aCol++) {
            this.mGemInfo[this.mGemInfo.mIdxMult0 * (aRow) + aCol] = new Game.GemInfo();
            this.mGemInfo[this.mGemInfo.mIdxMult0 * (aRow) + aCol].Init(theBoard.mBoard[theBoard.mBoard.mIdxMult0 * (aRow) + aCol], this.mAnimSeq);
        }
    }
    Game.HyperspaceUltra.mHypertubeTextures[0] = Game.Resources['IMAGE_WARP_LINES_01'];
    Game.HyperspaceUltra.mHypertubeTextures[1] = Game.Resources['IMAGE_HYPERSPACE_INITIAL'];
    this.mState = Game.HyperspaceUltra.HyperSpaceState.Nil;
    this.SetState(Game.HyperspaceUltra.HyperSpaceState.Init);
}
Game.HyperspaceUltra.HypertubePredrawSet = function Game_HyperspaceUltra$HypertubePredrawSet(e) {
    var aMeshEvent = e;
    Game.HyperspaceUltra.mG3D.SetTexture(1, Game.HyperspaceUltra.mHypertubeTextures[1]);
    Game.HyperspaceUltra.mG3D.SetTexture(0, Game.HyperspaceUltra.mHypertubeTextures[0]);
}
Game.HyperspaceUltra.HypertubePostdrawSet = function Game_HyperspaceUltra$HypertubePostdrawSet(e) {
    var aMeshEvent = e;
    Game.HyperspaceUltra.mG3D.SetTexture(0, null);
    Game.HyperspaceUltra.mG3D.SetTexture(1, null);
}
Game.HyperspaceUltra.prototype = {
    mTicks : 0,
    mUVAnimTicks : 0,
    mStateStartTick : 0,
    mState : null,
    mGemInfo : null,
    mBoardInfo : null,
    mGemRenderOrder : null,
    mCameraPersp : null,
    mBGScale : null,
    mBGImage : null,
    mAnimSeq : null,
    mXOffsetAnim : null,
    mMinAlpha : null,
    mShatterScale : null,
    mWarpTubeTextureFade : null,
    mRingFadeTunnelIn : null,
    mRingFadeTunnelOut : null,
    mPieceAlpha : null,
    mFadeTo3D : 0,
    mFadeFrom3D : 0,
    mGemHitCount : 0,
    mGemHitTick : 0,
    mBoardScreenPos : null,
    GetPieceAlpha : function Game_HyperspaceUltra$GetPieceAlpha() {
        return this.mPieceAlpha.get_v();
    },
    IsUsing3DTransition : function Game_HyperspaceUltra$IsUsing3DTransition() {
        return true;
    },
    SetBGImage : function Game_HyperspaceUltra$SetBGImage(inImage) {
        this.mBGImage = inImage;
    },
    Update : function Game_HyperspaceUltra$Update() {
        Game.Hyperspace.prototype.Update.apply(this);
        this.mTicks += 1.67;
        for(; ;) {
            var prevState = this.mState;
            switch(this.mState) {
                case Game.HyperspaceUltra.HyperSpaceState.Init:
                {
                    this.SetState(Game.HyperspaceUltra.HyperSpaceState.SlideOver);
                    break;
                }
                case Game.HyperspaceUltra.HyperSpaceState.SlideOver:
                {
                    if(this.mTicks - this.mStateStartTick > 160) {
                        this.SetState(Game.HyperspaceUltra.HyperSpaceState.FadeTo3D);
                    }
                    break;
                }
                case Game.HyperspaceUltra.HyperSpaceState.FadeTo3D:
                {
                    if(this.mPieceAlpha.HasBeenTriggered()) {
                        this.SetState(Game.HyperspaceUltra.HyperSpaceState.GemRise);
                    }
                    break;
                }
                case Game.HyperspaceUltra.HyperSpaceState.GemRise:
                {
                    if(this.mAnimSeq.GetCurFrame() >= 20) {
                        this.SetState(Game.HyperspaceUltra.HyperSpaceState.GemFly);
                    }
                    break;
                }
                case Game.HyperspaceUltra.HyperSpaceState.GemFly:
                {
                    if(this.mAnimSeq.GetCurFrame() >= 65) {
                        this.SetState(Game.HyperspaceUltra.HyperSpaceState.BoardShatter);
                    }
                    break;
                }
                case Game.HyperspaceUltra.HyperSpaceState.BoardShatter:
                {
                    if(this.mAnimSeq.GetCurFrame() >= 95) {
                        this.SetState(Game.HyperspaceUltra.HyperSpaceState.PortalRide);
                    }
                    break;
                }
                case Game.HyperspaceUltra.HyperSpaceState.PortalRide:
                {
                    if(this.mAnimSeq.GetCurFrame() >= 250) {
                        this.SetState(Game.HyperspaceUltra.HyperSpaceState.LandOnBoard);
                    }
                    break;
                }
                case Game.HyperspaceUltra.HyperSpaceState.LandOnBoard:
                {
                    if(this.mAnimSeq.IsComplete()) {
                        this.SetState(Game.HyperspaceUltra.HyperSpaceState.Outro);
                    }
                    break;
                }
                case Game.HyperspaceUltra.HyperSpaceState.FadeFrom3D:
                {
                    if(this.mFadeFrom3D <= 0.0) {
                        this.SetState(Game.HyperspaceUltra.HyperSpaceState.Outro);
                    }
                    break;
                }
                case Game.HyperspaceUltra.HyperSpaceState.Outro:
                {
                    if(this.mTicks - this.mStateStartTick > 0) {
                        this.SetState(Game.HyperspaceUltra.HyperSpaceState.Complete);
                    }
                    break;
                }
            }
            if(this.mState == prevState) {
                break;
            }
        }
        this.UpdateAnimation();
        this.UpdateCamera();
        this.UpdateTransitionTo3D();
        this.UpdateBackground();
        this.Update3DGems();
        this.Update3DBoard();
        this.Update3DPortal();
        this.UpdateSounds();
    },
    Draw : function Game_HyperspaceUltra$Draw(g) {
        if(!GameFramework.BaseApp.mApp.get_Is3D()) {
            return;
        }
        Game.HyperspaceUltra.mG3D = g.Begin3DScene();
        switch(this.mState) {
            case Game.HyperspaceUltra.HyperSpaceState.SlideOver:
            {
                Game.HyperspaceUltra.mG3D.ClearDepthBuffer();
                this.Draw3DGems(g);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.FadeTo3D:
            {
                Game.HyperspaceUltra.mG3D.ClearDepthBuffer();
                this.Draw3DGems(g);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.GemRise:
            {
                Game.HyperspaceUltra.mG3D.ClearDepthBuffer();
                this.Draw3DWarpTube(g);
                this.Draw3DBoard(g);
                this.Draw3DGems(g);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.GemFly:
            {
                Game.HyperspaceUltra.mG3D.ClearDepthBuffer();
                this.Draw3DWarpTube(g);
                this.Draw3DBoard(g);
                this.Draw3DGems(g);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.BoardShatter:
            {
                Game.HyperspaceUltra.mG3D.ClearDepthBuffer();
                this.Draw3DWarpTube(g);
                g.End3DScene(Game.HyperspaceUltra.mG3D);
                this.Draw2DBoardSmash(g);
                Game.HyperspaceUltra.mG3D = g.Begin3DScene();
                this.Draw3DGems(g);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.PortalRide:
            {
                Game.HyperspaceUltra.mG3D.ClearDepthBuffer();
                this.Draw3DWarpTube(g);
                if(this.mAnimSeq.GetCurFrame() < 120) {
                    g.End3DScene(Game.HyperspaceUltra.mG3D);
                    this.Draw2DBoardSmash(g);
                    Game.HyperspaceUltra.mG3D = g.Begin3DScene();
                } else if(this.mAnimSeq.GetCurFrame() >= 170) {
                    Game.BejApp.mBejApp.mBoard.mDrawAll = true;
                    this.Draw3DBoard(g);
                }
                this.Draw3DGems(g);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.LandOnBoard:
            {
                Game.HyperspaceUltra.mG3D.ClearDepthBuffer();
                this.Draw3DWarpTube(g);
                this.Draw3DGems(g);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.FadeFrom3D:
            {
                Game.HyperspaceUltra.mG3D.ClearDepthBuffer();
                this.Draw3DGems(g);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.DebugDrawEveryOther:
            {
                Game.HyperspaceUltra.mG3D.ClearDepthBuffer();
                this.Draw3DGemsEveryOther(g);
                break;
            }
        }
        g.End3DScene(Game.HyperspaceUltra.mG3D);
    },
    DrawBackground : function Game_HyperspaceUltra$DrawBackground(g) {
        switch(this.mState) {
            case Game.HyperspaceUltra.HyperSpaceState.SlideOver:
            case Game.HyperspaceUltra.HyperSpaceState.FadeTo3D:
            case Game.HyperspaceUltra.HyperSpaceState.GemRise:
            case Game.HyperspaceUltra.HyperSpaceState.GemFly:
            case Game.HyperspaceUltra.HyperSpaceState.BoardShatter:
            {
                this.Draw3DBackground(g);
                break;
            }
        }
    },
    SetState : function Game_HyperspaceUltra$SetState(state) {
        if(state == this.mState) {
            return;
        }
        this.mStateStartTick = this.mTicks;
        this.mState = state;
        switch(this.mState) {
            case Game.HyperspaceUltra.HyperSpaceState.Init:
            {
                this.mTicks = 0;
                this.mAnimSeq.Reset();
                this.mMinAlpha.SetConstant(0.0);
                this.mXOffsetAnim.SetConstant(0.0);
                this.mRingFadeTunnelIn.SetConstant(0.0);
                this.mRingFadeTunnelOut.SetConstant(0.0);
                this.mWarpTubeTextureFade.SetConstant(1.0);
                this.mBGScale.SetConstant(1.0);
                this.mShatterScale.SetConstant(1.0);
                this.mPieceAlpha.SetConstant(1.0);
                this.mFadeTo3D = 1.0;
                this.mFadeFrom3D = 0.0;
                this.mGemHitCount = 0;
                this.mGemHitTick = (this.mTicks | 0);
                for(var row = 0; row < Game.Board.NUM_ROWS; ++row) {
                    for(var col = 0; col < Game.Board.NUM_COLS; ++col) {
                        var gemInfoPointer = this.mGemInfo[this.mGemInfo.mIdxMult0 * (row) + col];
                        gemInfoPointer.mDraw3D = false;
                    }
                }
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.SlideOver:
            {
                this.mFadeTo3D = 0.0;
                this.mXOffsetAnim.SetCurve('b+0,-234,0.009091,1,####         ~~auJ');
                this.mBoardInfo.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.Start);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.FadeTo3D:
            {
                this.mPieceAlpha.ClearTrigger();
                this.mPieceAlpha.SetCurve('b-0.02,1,0.2,1,~rgP         ~#DgP');
                for(var row_2 = 0; row_2 < Game.Board.NUM_ROWS; ++row_2) {
                    for(var col_2 = 0; col_2 < Game.Board.NUM_COLS; ++col_2) {
                        var gemInfoPointer_2 = this.mGemInfo[this.mGemInfo.mIdxMult0 * (row_2) + col_2];
                        gemInfoPointer_2.mDraw3D = true;
                    }
                }
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.GemRise:
            {
                GameFramework.BaseApp.mApp.PlaySound(Game.Resources['SOUND_HYPERSPACE']);
                this.mBoardInfo.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.HideAll);
                this.mUVAnimTicks = 0;
                this.mBGScale.SetCurve('b+1,8,0.004762,1,####     l#Pr]\'#*NA    1}dR)');
                this.mMinAlpha.SetCurve('b+0,1,0.004444,1,####Q####         O}P8x');
                this.mRingFadeTunnelIn.SetCurve('b+0,255,0.004255,1,##xa  @L6zN d~}Q&    I~P## T#<G{');
                this.mWarpTubeTextureFade.SetCurve('b+0,1,0.004348,1,####      W+(q>   I~cu?');
                var mapBgIdToHyperspaceTubeTextures = Array.Create(4, 4, Game.Resources['IMAGE_WARP_LINES_01'], Game.Resources['IMAGE_WARP_LINES_01'], Game.Resources['IMAGE_WARP_LINES_01'], Game.Resources['IMAGE_WARP_LINES_01']);
                var bgId = GameFramework.Utils.GetRand() % 4;
                Game.HyperspaceUltra.mHypertubeTextures[0] = mapBgIdToHyperspaceTubeTextures[bgId];
                Game.HyperspaceUltra.mHypertubeTextures[1] = Game.Resources['IMAGE_HYPERSPACE_INITIAL'];
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.GemFly:
            {
                this.mXOffsetAnim.SetConstant(0.0);
                this.mPieceAlpha.SetConstant(1.0);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.BoardShatter:
            {
                this.mBoardInfo.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.BoardShatter);
                this.mShatterScale.SetCurve('b+0.8,2.4,0.008333,1,#.ov         ~~###');
                {
                    Game.Resources['POPANIM_ANIMS_BOARDSHATTER'].Play('shatter');
                    GameFramework.BaseApp.mApp.PlaySound(Game.Resources['SOUND_HYPERSPACE_SHATTER_1']);
                }
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.PortalRide:
            {
                this.mBoardInfo.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.OldLevelClear);
                this.mBoardInfo.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.NextBkg);
                this.mBGScale.SetConstant(1.0);
                this.mMinAlpha.SetConstant(1.0);
                this.mRingFadeTunnelIn.SetConstant(0.0);
                this.mWarpTubeTextureFade.SetConstant(1.0);
                Game.HyperspaceUltra.mHypertubeTextures[1] = Game.Resources['IMAGE_HYPERSPACE'];
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.LandOnBoard:
            {
                for(var row_3 = 0; row_3 < Game.Board.NUM_ROWS; ++row_3) {
                    for(var col_3 = 0; col_3 < Game.Board.NUM_COLS; ++col_3) {
                        var gemInfoPointer_3 = this.mGemInfo[this.mGemInfo.mIdxMult0 * (row_3) + col_3];
                        if(gemInfoPointer_3.mBoardHitFrame > this.mAnimSeq.GetCurFrame()) {
                            gemInfoPointer_3.mPiece.mAlpha.SetConstant(0.0);
                        } else {
                            gemInfoPointer_3.mDraw3D = false;
                        }
                    }
                }
                this.mBoardInfo.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.ZoomIn);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.FadeFrom3D:
            {
                this.mFadeFrom3D = 1.0;
                this.mBoardInfo.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.SlideOver);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.Outro:
            {
                for(var row_4 = 0; row_4 < Game.Board.NUM_ROWS; ++row_4) {
                    for(var col_4 = 0; col_4 < Game.Board.NUM_COLS; ++col_4) {
                        var gemInfoPointer_4 = this.mGemInfo[this.mGemInfo.mIdxMult0 * (row_4) + col_4];
                        gemInfoPointer_4.mPiece.mAlpha.SetConstant(1.0);
                        gemInfoPointer_4.mDraw3D = false;
                    }
                }
                this.mBoardInfo.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.SlideOver);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.Complete:
            {
                this.mBoardInfo.mBoard.HyperspaceEvent(Game.Hyperspace.HyperspaceEvent.Finish);
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.DebugDrawEveryOther:
            {
                this.mAnimSeq.Reset();
                this.mMinAlpha.SetConstant(1.0);
                this.mFadeTo3D = 1.0;
                break;
            }
        }
    },
    UpdateAnimation : function Game_HyperspaceUltra$UpdateAnimation() {
        switch(this.mState) {
            case Game.HyperspaceUltra.HyperSpaceState.Init:
            case Game.HyperspaceUltra.HyperSpaceState.SlideOver:
            case Game.HyperspaceUltra.HyperSpaceState.DebugDrawEveryOther:
            case Game.HyperspaceUltra.HyperSpaceState.FadeTo3D:
            {
                return;
            }

        }
        this.mAnimSeq.Tick();
    },
    UpdateCamera : function Game_HyperspaceUltra$UpdateCamera() {
        this.mCameraPersp.Init(this.GetFocalLength(), GameFramework.BaseApp.mApp.mWidth / GameFramework.BaseApp.mApp.mHeight, 100.0, this.GetZFarClip());
        var xCamOff = 0.0;
        switch(this.mState) {
            case Game.HyperspaceUltra.HyperSpaceState.SlideOver:
            case Game.HyperspaceUltra.HyperSpaceState.FadeTo3D:
            case Game.HyperspaceUltra.HyperSpaceState.GemRise:
            {
                this.mXOffsetAnim.IncInVal();
                xCamOff = 234.0 + this.mXOffsetAnim.get_v();
                break;
            }
        }
        var animSeqFrame = this.mAnimSeq.GetCurFrame();
        var rot = this.mAnimSeq.GetCameraRot();
        var pos = this.mAnimSeq.GetCameraPos();
        var cameraCoords = new GameFramework.geom.Coords3();
        cameraCoords.RotateRadX(rot.x);
        cameraCoords.RotateRadY(rot.y);
        cameraCoords.RotateRadZ(rot.z);
        cameraCoords.Translate(pos.x - xCamOff, pos.y, pos.z);
        this.mCameraPersp.SetCoords(cameraCoords);
    },
    UpdateTransitionTo3D : function Game_HyperspaceUltra$UpdateTransitionTo3D() {
        switch(this.mState) {
            case Game.HyperspaceUltra.HyperSpaceState.SlideOver:
            {
                if(this.mTicks - this.mStateStartTick == 66) {
                }
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.FadeTo3D:
            {
                this.mFadeTo3D += (0.15) * 1.67;
                if(this.mFadeTo3D >= 1.0) {
                    this.mPieceAlpha.IncInVal();
                }
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.FadeFrom3D:
            {
                this.mFadeFrom3D -= 0.1 * 1.67;
                break;
            }
        }
    },
    UpdateBackground : function Game_HyperspaceUltra$UpdateBackground() {
        if(this.mAnimSeq.GetCurFrame() >= 177) {
        }
        switch(this.mState) {
            case Game.HyperspaceUltra.HyperSpaceState.GemRise:
            case Game.HyperspaceUltra.HyperSpaceState.GemFly:
            case Game.HyperspaceUltra.HyperSpaceState.BoardShatter:
            {
                this.mBGScale.IncInVal();
                break;
            }
        }
    },
    Update3DBoard : function Game_HyperspaceUltra$Update3DBoard() {
        var animSeqFrame = this.mAnimSeq.GetCurFrame();
        var rot = this.mAnimSeq.GetBoardRot();
        var pos = this.mAnimSeq.GetBoardPos();
        var scale = this.mAnimSeq.GetBoardScale();
        var boardCoords = new GameFramework.geom.Coords3();
        boardCoords.RotateRadX(rot.x);
        boardCoords.RotateRadY(rot.y);
        boardCoords.RotateRadZ(rot.z);
        boardCoords.Scale(scale.x, scale.y, scale.z);
        boardCoords.Translate(pos.x, pos.y, pos.z);
        this.mBoardInfo.SetCoords(boardCoords);
        if(Game.Resources['POPANIM_ANIMS_BOARDSHATTER'].IsActive()) {
            Game.Resources['POPANIM_ANIMS_BOARDSHATTER'].Update();
        }
    },
    Update3DGems : function Game_HyperspaceUltra$Update3DGems() {
        if(this.mAnimSeq.GetCurFrame() >= 68) {
            for(var row = 0; row < Game.Board.NUM_ROWS; ++row) {
                for(var col = 0; col < Game.Board.NUM_COLS; ++col) {
                    this.mGemInfo[this.mGemInfo.mIdxMult0 * (row) + col].mPiece = this.mBoardInfo.mBoard.mBoard[this.mBoardInfo.mBoard.mBoard.mIdxMult0 * (row) + col];
                }
            }
        }
        this.mGemRenderOrder.clear();
        var cameraCoords = this.mCameraPersp.GetCoords();
        var animSeqFrame = this.mAnimSeq.GetCurFrame();
        var matView = new GameFramework.geom.Matrix3D();
        var matProj = new GameFramework.geom.Matrix3D();
        var matWorld = new GameFramework.geom.Matrix3D();
        var matWorldViewProj = new GameFramework.geom.Matrix3D();
        this.mCameraPersp.GetViewMatrix(matView);
        this.mCameraPersp.GetProjectionMatrix(matProj);
        for(var row_2 = 0; row_2 < Game.Board.NUM_ROWS; ++row_2) {
            for(var col_2 = 0; col_2 < Game.Board.NUM_COLS; ++col_2) {
                var gemInfoPointer = this.mGemInfo[this.mGemInfo.mIdxMult0 * (row_2) + col_2];
                var colorIndex = this.GetGemColor(gemInfoPointer);
                if(this.mState == Game.HyperspaceUltra.HyperSpaceState.LandOnBoard && gemInfoPointer.mDraw3D && this.mAnimSeq.GetCurFrame() >= gemInfoPointer.mBoardHitFrame) {
                    gemInfoPointer.mPiece.mAlpha.SetConstant(1.0);
                    gemInfoPointer.mDraw3D = false;
                    var mapHitCountToSound = Array.Create(7, 7, Game.Resources['SOUND_HYPERSPACE_GEM_LAND_1'], Game.Resources['SOUND_HYPERSPACE_GEM_LAND_2'], Game.Resources['SOUND_HYPERSPACE_GEM_LAND_3'], Game.Resources['SOUND_HYPERSPACE_GEM_LAND_4'], Game.Resources['SOUND_HYPERSPACE_GEM_LAND_5'], Game.Resources['SOUND_HYPERSPACE_GEM_LAND_6'], Game.Resources['SOUND_HYPERSPACE_GEM_LAND_7']);
                    var landingFx;
                    var landingSoundFx;
                    var landingSoundFxPitch;
                    {
                        landingFx = Game.Resources['PIEFFECT_GEM_LANDING_FX'];
                        landingSoundFx = mapHitCountToSound[this.mGemHitCount % mapHitCountToSound.length];
                        landingSoundFxPitch = ((this.mGemHitCount / mapHitCountToSound.length) | 0);
                    }
                    if(this.mAnimSeq.GetCurFrame() > 270 && this.mTicks - this.mGemHitTick > 2) {
                        GameFramework.BaseApp.mApp.PlaySound(landingSoundFx);
                        this.mGemHitTick = (this.mTicks | 0);
                        this.mGemHitCount++;
                    }
                    var splatEffect = new Game.ParticleEffect(landingFx);
                    if((colorIndex >= 0) && (colorIndex <= (Game.DM.EGemColor.HYPERCUBE | 0))) {
                        splatEffect.SetEmitterTint(0, 0, Game.DM.gGemColors[colorIndex + 1]);
                        splatEffect.SetEmitterTint(0, 1, Game.DM.gGemColors[colorIndex + 1]);
                        splatEffect.SetEmitterTint(0, 2, Game.DM.gGemColors[colorIndex + 1]);
                    }
                    gemInfoPointer.mPiece.BindEffect(splatEffect);
                    this.mBoardInfo.mBoard.mPreFXManager.AddEffect(splatEffect);
                }
                if(!gemInfoPointer.mDraw3D) {
                    continue;
                }
                var rot = this.mAnimSeq.GetGemRot(row_2, col_2);
                var pos = this.mAnimSeq.GetGemPos(row_2, col_2);
                var scale = this.mAnimSeq.GetGemScale(row_2, col_2);
                var gemCoords = new GameFramework.geom.Coords3();
                gemCoords.RotateRadX(rot.x);
                gemCoords.RotateRadY(rot.y);
                gemCoords.RotateRadZ(rot.z);
                var mapIndexToScaleFactor = Array.Create(8, 8, 1.14, 1.04, 1.17, 1.04, 1.1, 1.09, 1.1, 1.0);
                if(colorIndex >= 0) {
                    scale = scale.Scale(mapIndexToScaleFactor[colorIndex]);
                }
                gemCoords.Scale(scale.x, scale.y, -scale.z);
                gemCoords.Translate(pos.x, pos.y, pos.z);
                gemInfoPointer.SetCoords(gemCoords);
                gemInfoPointer.mPos = pos;
                gemInfoPointer.mCoords.GetOutboundMatrix(matWorld);
                matWorldViewProj = new GameFramework.geom.Matrix3D();
                matWorldViewProj.CopyFrom(matProj);
                matWorldViewProj.Append(matView);
                matWorldViewProj.Append(matWorld);
                gemInfoPointer.mPosScreen.x = matWorldViewProj.m[matWorldViewProj.m.mIdxMult0 * (3) + 0];
                gemInfoPointer.mPosScreen.y = matWorldViewProj.m[matWorldViewProj.m.mIdxMult0 * (3) + 1];
                gemInfoPointer.mPosScreen.z = matWorldViewProj.m[matWorldViewProj.m.mIdxMult0 * (3) + 2];
                var w = matWorldViewProj.m[matWorldViewProj.m.mIdxMult0 * (3) + 3];
                var scaleFactor = gemInfoPointer.mPosScreen.z;
                gemInfoPointer.mPosScreen = gemInfoPointer.mPosScreen.Scale(1 / w);
                if(scaleFactor < 500) {
                    gemInfoPointer.mScaleScreen = 3.0;
                } else {
                    gemInfoPointer.mScaleScreen = 3225.0 / scaleFactor;
                }
                gemInfoPointer.mDistToCamera = (cameraCoords.t.Sub(gemCoords.t)).Magnitude();
                this.mGemRenderOrder.push(gemInfoPointer);
            }
        }
        this.mCameraPersp.GetViewMatrix(matView);
        this.mCameraPersp.GetProjectionMatrix(matProj);
        this.mBoardInfo.mCoords.GetOutboundMatrix(matWorld);
        matWorldViewProj = matProj;
        matWorldViewProj.Append(matView);
        matWorldViewProj.Append(matWorld);
        this.mBoardScreenPos.x = matWorldViewProj.m[matWorldViewProj.m.mIdxMult0 * (3) + 0];
        this.mBoardScreenPos.y = matWorldViewProj.m[matWorldViewProj.m.mIdxMult0 * (3) + 1];
        this.mBoardScreenPos.z = matWorldViewProj.m[matWorldViewProj.m.mIdxMult0 * (3) + 2];
        var wScreen = matWorldViewProj.m[matWorldViewProj.m.mIdxMult0 * (3) + 3];
        var scaleFactorScreen = this.mBoardScreenPos.z;
        this.mBoardScreenPos = this.mBoardScreenPos.Scale(1 / wScreen);
        if((this.mState < Game.HyperspaceUltra.HyperSpaceState.LandOnBoard) && (this.mState >= Game.HyperspaceUltra.HyperSpaceState.BoardShatter)) {
            this.mBoardInfo.mBoard.mOfsX = this.mBoardScreenPos.x * 800;
            this.mBoardInfo.mBoard.mOfsY = this.mBoardScreenPos.y * -600;
        }
        if(this.mState < Game.HyperspaceUltra.HyperSpaceState.LandOnBoard) {
            this.mBoardInfo.mBoard.mScale.SetConstant(3328.328 / scaleFactorScreen);
        }
        this.mGemRenderOrder.sort(ss.Delegate.create(this, this.GemInfoSortPredicate));
    },
    GemInfoSortPredicate : function Game_HyperspaceUltra$GemInfoSortPredicate(gemOne, gemTwo) {
        if(gemOne.mDistToCamera < gemTwo.mDistToCamera) {
            return 1;
        } else if(gemOne.mDistToCamera > gemTwo.mDistToCamera) {
            return -1;
        }
        return 0;
    },
    Update3DPortal : function Game_HyperspaceUltra$Update3DPortal() {
        switch(this.mState) {
            case Game.HyperspaceUltra.HyperSpaceState.Init:
            case Game.HyperspaceUltra.HyperSpaceState.SlideOver:
            {
                return;
            }

            case Game.HyperspaceUltra.HyperSpaceState.GemRise:
            {
                this.mUVAnimTicks += 1.67;
                this.mMinAlpha.IncInVal();
                this.mRingFadeTunnelIn.IncInVal();
                this.mWarpTubeTextureFade.IncInVal();
                this.mUVAnimTicks += 1.67;
                this.mMinAlpha.IncInVal();
                this.mShatterScale.IncInVal();
                this.mRingFadeTunnelIn.IncInVal();
                this.mWarpTubeTextureFade.IncInVal();
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.GemFly:
            case Game.HyperspaceUltra.HyperSpaceState.BoardShatter:
            {
                this.mUVAnimTicks += 1.67;
                this.mMinAlpha.IncInVal();
                this.mShatterScale.IncInVal();
                this.mRingFadeTunnelIn.IncInVal();
                this.mWarpTubeTextureFade.IncInVal();
                break;
            }
            case Game.HyperspaceUltra.HyperSpaceState.PortalRide:
            case Game.HyperspaceUltra.HyperSpaceState.DebugDrawEveryOther:
            {
                this.mUVAnimTicks += 1.67;
                break;
            }
        }
    },
    UpdateSounds : function Game_HyperspaceUltra$UpdateSounds() {
        {
            if(this.mAnimSeq.GetCurFrame() == 68) {
                GameFramework.BaseApp.mApp.PlaySoundEx(Game.Resources['SOUND_HYPERSPACE_SHATTER_2'], 0.5, 0);
            } else if(this.mAnimSeq.GetCurFrame() == 76) {
                GameFramework.BaseApp.mApp.PlaySoundEx(Game.Resources['SOUND_HYPERSPACE_SHATTER_2'], 0.5, 0);
            }
        }
    },
    Draw3DBackground : function Game_HyperspaceUltra$Draw3DBackground(g) {
        var _t1 = g.PushColor(0xff000000);
        try {
            g.FillRect(0, 0, 1920, 1200);
        } finally {
            _t1.Dispose();
        }
    },
    Draw3DWarpTube : function Game_HyperspaceUltra$Draw3DWarpTube(g) {
        this.Draw3DWarpTubeTube(g);
        switch(this.mState) {
            case Game.HyperspaceUltra.HyperSpaceState.GemRise:
            case Game.HyperspaceUltra.HyperSpaceState.GemFly:
            case Game.HyperspaceUltra.HyperSpaceState.BoardShatter:
            {
                this.Draw3DWarpTubeFlare(g);
                break;
            }
            default:

            {
                this.Draw3DWarpTubeCap(g);
                break;
            }
        }
    },
    Draw3DWarpTubeTube : function Game_HyperspaceUltra$Draw3DWarpTubeTube(g) {
        Game.HyperspaceUltra.mG3D.SetBackfaceCulling(true, false);
        Game.HyperspaceUltra.mG3D.SetDepthState(GameFramework.gfx.Graphics3D.ECompareFunc.Less, true);
        Game.HyperspaceUltra.mG3D.SetBlend(GameFramework.gfx.Graphics3D.EBlend.Default, GameFramework.gfx.Graphics3D.EBlend.Default);
        Game.HyperspaceUltra.mG3D.SetTextureWrap(0, true);
        switch(this.mState) {
            case Game.HyperspaceUltra.HyperSpaceState.GemRise:
            case Game.HyperspaceUltra.HyperSpaceState.GemFly:
            case Game.HyperspaceUltra.HyperSpaceState.BoardShatter:
            {
                Game.HyperspaceUltra.mG3D.SetTextureWrapUV(1, true, false);
                break;
            }
            default:
            {
                Game.HyperspaceUltra.mG3D.SetTextureWrap(1, true);
                break;
            }
        }
        var renderEffect = Game.Resources['EFFECT_TUBE_3D'];
        var aRunHandle = renderEffect.Begin(Game.HyperspaceUltra.mG3D, 'Tube3D');
        var _t2 = aRunHandle;
        try {
            var time = this.mUVAnimTicks / 100.0;
            renderEffect.SetFloat('time', time);
            var streamFx = 0.5;
            var brightness = 1.0;
            var alphaVals = Array.Create(4, 4, this.mMinAlpha.get_v(), this.mWarpTubeTextureFade.get_v(), streamFx, brightness);
            renderEffect.SetFloatArray('alphaVals', alphaVals);
            var aMat = new GameFramework.geom.Matrix3D();
            this.mCameraPersp.GetViewMatrix(aMat);
            Game.HyperspaceUltra.mG3D.SetViewTransform(aMat);
            aMat.Identity();
            this.mCameraPersp.GetProjectionMatrix(aMat);
            Game.HyperspaceUltra.mG3D.SetProjectionTransform(aMat);
            var coords = new GameFramework.geom.Coords3();
            coords.Scale(1.0, 1.0, -1.0);
            var matWorld = new GameFramework.geom.Matrix3D();
            coords.GetOutboundMatrix(matWorld);
            Game.HyperspaceUltra.mG3D.SetWorldTransform(matWorld);
            var _t3 = aRunHandle.BeginPass(0);
            try {
                Game.HyperspaceUltra.mG3D.RenderMesh(Game.BejApp.mBejApp.mWarpTube3D);
            } finally {
                _t3.Dispose();
            }
        } finally {
            _t2.Dispose();
        }
    },
    Draw3DWarpTubeCap : function Game_HyperspaceUltra$Draw3DWarpTubeCap(g) {
        if(this.mState != Game.HyperspaceUltra.HyperSpaceState.PortalRide && this.mState != Game.HyperspaceUltra.HyperSpaceState.LandOnBoard) {
            return;
        }
        Game.HyperspaceUltra.mG3D.SetBackfaceCulling(true, false);
        Game.HyperspaceUltra.mG3D.SetDepthState(GameFramework.gfx.Graphics3D.ECompareFunc.Less, false);
        Game.HyperspaceUltra.mG3D.SetBlend(GameFramework.gfx.Graphics3D.EBlend.SrcColor, GameFramework.gfx.Graphics3D.EBlend.One);
        Game.HyperspaceUltra.mG3D.SetTextureWrap(0, true);
        var renderEffect = Game.Resources['EFFECT_TUBECAP_3D'];
        var aRunHandle = renderEffect.Begin(Game.HyperspaceUltra.mG3D, 'TubeCap3D');
        var _t4 = aRunHandle;
        try {
            var time = this.mUVAnimTicks / 100.0;
            renderEffect.SetFloat('time', time);
            var aMat = new GameFramework.geom.Matrix3D();
            this.mCameraPersp.GetViewMatrix(aMat);
            Game.HyperspaceUltra.mG3D.SetViewTransform(aMat);
            aMat.Identity();
            this.mCameraPersp.GetProjectionMatrix(aMat);
            Game.HyperspaceUltra.mG3D.SetProjectionTransform(aMat);
            var coords = new GameFramework.geom.Coords3();
            coords.Scale(1.0, 1.0, -1.0);
            var matWorld = new GameFramework.geom.Matrix3D();
            coords.GetOutboundMatrix(matWorld);
            Game.HyperspaceUltra.mG3D.SetWorldTransform(matWorld);
            var _t5 = aRunHandle.BeginPass(0);
            try {
                Game.HyperspaceUltra.mG3D.RenderMesh(Game.BejApp.mBejApp.mWarpTubeCap3D);
            } finally {
                _t5.Dispose();
            }
        } finally {
            _t4.Dispose();
        }
        Game.HyperspaceUltra.mG3D.SetBlend(GameFramework.gfx.Graphics3D.EBlend.Default, GameFramework.gfx.Graphics3D.EBlend.Default);
    },
    Draw3DWarpTubeFlare : function Game_HyperspaceUltra$Draw3DWarpTubeFlare(g) {
    },
    Draw3DBoard : function Game_HyperspaceUltra$Draw3DBoard(g) {
    },
    Draw2DBoardSmash : function Game_HyperspaceUltra$Draw2DBoardSmash(g) {
        if(!Game.Resources['POPANIM_ANIMS_BOARDSHATTER'].IsActive()) {
            return;
        }
        var shaterAnimWidth = 1500;
        var shaterAnimHeight = 1500;
        var x = 0;
        var y = 0;
        var width = 1600;
        var height = 1200;
        var xOffset = ((((width - shaterAnimWidth) / 2) | 0)) + x + 160;
        var yOffset = ((((height - shaterAnimHeight) / 2) | 0)) + y;
        var _t6 = g.PushTranslate(xOffset, yOffset);
        try {
            var _t7 = g.PushScale(this.mShatterScale.get_v(), this.mShatterScale.get_v(), shaterAnimWidth / 2.0, shaterAnimHeight / 2.0);
            try {
                Game.Resources['POPANIM_ANIMS_BOARDSHATTER'].Draw(g);
            } finally {
                _t7.Dispose();
            }
        } finally {
            _t6.Dispose();
        }
    },
    Draw3DGems2 : function Game_HyperspaceUltra$Draw3DGems2(g) {
        var $srcArray8 = this.mGemRenderOrder;
        for(var $enum8 = 0; $enum8 < $srcArray8.length; $enum8++) {
            var gemInfoPointer = $srcArray8[$enum8];
            if(gemInfoPointer.mDraw3D) {
                var colorIndex = this.GetGemColor(gemInfoPointer);
                if(colorIndex < (Game.DM.EGemColor.HYPERCUBE | 0)) {
                }
            }
        }
    },
    Draw3DGemsEveryOther : function Game_HyperspaceUltra$Draw3DGemsEveryOther(g) {
        var $srcArray9 = this.mGemRenderOrder;
        for(var $enum9 = 0; $enum9 < $srcArray9.length; $enum9++) {
            var gemInfoPointer = $srcArray9[$enum9];
            var colorIndex = this.GetGemColor(gemInfoPointer);
            if((colorIndex >= 0) && (colorIndex < (Game.DM.EGemColor.HYPERCUBE | 0)) && (gemInfoPointer.mPiece.mRow % 2) == 0) {
            }
        }
    },
    Draw3DGems : function Game_HyperspaceUltra$Draw3DGems(g) {
        Game.HyperspaceUltra.mG3D.SetBlend(GameFramework.gfx.Graphics3D.EBlend.Default, GameFramework.gfx.Graphics3D.EBlend.Default);
        var matView = new GameFramework.geom.Matrix3D();
        this.mCameraPersp.GetViewMatrix(matView);
        matView.m[matView.m.mIdxMult0 * (0) + 0] += 0.003;
        matView.m[matView.m.mIdxMult0 * (3) + 0] += 3.0;
        matView.m[matView.m.mIdxMult0 * (1) + 1] += 0.003;
        var matProj = new GameFramework.geom.Matrix3D();
        this.mCameraPersp.GetProjectionMatrix(matProj);
        var renderEffect = Game.Resources['EFFECT_GEM_3D'];
        var aRenderEffectRunHandle = renderEffect.Begin(Game.HyperspaceUltra.mG3D, 'Gem3D');
        var _t10 = aRenderEffectRunHandle;
        try {
            Game.HyperspaceUltra.mG3D.SetViewTransform(matView);
            Game.HyperspaceUltra.mG3D.SetProjectionTransform(matProj);
            var cameraPoistion = this.mCameraPersp.GetCoords().t;
            cameraPoistion = new GameFramework.geom.Vector3(cameraPoistion.x, cameraPoistion.y, cameraPoistion.z * -1.0);
            renderEffect.SetVector('cameraPosition', cameraPoistion);
            renderEffect.SetFloatArray('ambientLightColor', Game.HyperspaceUltra.ambientLightColor);
            renderEffect.SetFloatArray('diffuseLightColor', Game.HyperspaceUltra.diffuseLightColor);
            renderEffect.SetFloatArray('specularLightColor', Game.HyperspaceUltra.specularLightColor);
            Game.HyperspaceUltra.mG3D.SetDepthState(GameFramework.gfx.Graphics3D.ECompareFunc.Less, true);
            Game.HyperspaceUltra.mG3D.SetBackfaceCulling(true, false);
            renderEffect.SetFloat('globalFade', this.mFadeTo3D);
            var aRenderEffectPass = aRenderEffectRunHandle.BeginPass(1);
            var aPass1WorldMatrices = [];
            var matWorld = new GameFramework.geom.Matrix3D();

            {
                var $srcArray11 = this.mGemRenderOrder;
                for(var $enum11 = 0; $enum11 < $srcArray11.length; $enum11++) {
                    var gemInfoPointer = $srcArray11[$enum11];
                    if(gemInfoPointer.mDraw3D) {
                        var colorIndex = this.GetGemColor(gemInfoPointer);
                        if(colorIndex < (Game.DM.EGemColor.HYPERCUBE | 0)) {
                            var distToCameraScale = Math.max(Math.min((gemInfoPointer.mDistToCamera / 3425.0), 1.0), 0.5);
                            var outlineScale = 0.99 + (distToCameraScale * 0.1);
                            var coords = new GameFramework.geom.Coords3();
                            coords.CopyFrom(gemInfoPointer.mCoords);
                            coords.GetOutboundMatrix(matWorld);
                            Game.HyperspaceUltra.mG3D.SetWorldTransform(matWorld);
                            var lightPosition = gemInfoPointer.mCoords.t.Add(Game.HyperspaceUltra.mapColorIndexToLightOffset[colorIndex]);
                            renderEffect.SetVector('lightPosition', lightPosition);
                            renderEffect.SetFloatArray('ambientMaterialColor', Game.HyperspaceUltra.mapColorIndexToMaterial[colorIndex].ambient);
                            renderEffect.SetFloatArray('diffuseMaterialColor', Game.HyperspaceUltra.mapColorIndexToMaterial[colorIndex].diffuse);
                            renderEffect.SetFloatArray('specularMaterialColor', Game.HyperspaceUltra.mapColorIndexToMaterial[colorIndex].specular);
                            renderEffect.SetFloat('specularPower', Game.HyperspaceUltra.mapColorIndexToMaterial[colorIndex].power);
                            Game.HyperspaceUltra.mG3D.RenderMesh(Game.BejApp.mBejApp.mGems3D[colorIndex]);
                        }
                    }
                }
            }
            aRenderEffectPass.Dispose();
            matProj.m[matProj.m.mIdxMult0 * (3) + 2] += 1.0;
            Game.HyperspaceUltra.mG3D.SetProjectionTransform(matProj);
            Game.HyperspaceUltra.mG3D.SetDepthState(GameFramework.gfx.Graphics3D.ECompareFunc.Less, false);
            Game.HyperspaceUltra.mG3D.SetBackfaceCulling(true, false);
            if(this.mState == Game.HyperspaceUltra.HyperSpaceState.FadeTo3D) {
                renderEffect.SetFloat('globalFade', 1.0 - this.mPieceAlpha.get_v());
            } else {
                renderEffect.SetFloat('globalFade', this.mFadeTo3D);
            }
            var matWorldScaled = new GameFramework.geom.Matrix3D();
            aRenderEffectPass = aRenderEffectRunHandle.BeginPass(0);

            {
                var $srcArray12 = this.mGemRenderOrder;
                for(var $enum12 = 0; $enum12 < $srcArray12.length; $enum12++) {
                    var gemInfoPointer_2 = $srcArray12[$enum12];
                    if(gemInfoPointer_2.mDraw3D) {
                        var aPiece = gemInfoPointer_2.mPiece;
                        var colorIndex_2 = this.GetGemColor(gemInfoPointer_2);
                        if(colorIndex_2 < (Game.DM.EGemColor.HYPERCUBE | 0)) {
                            gemInfoPointer_2.mCoords.GetOutboundMatrix(matWorld);
                            var coords_2 = new GameFramework.geom.Coords3();
                            coords_2.CopyFrom(gemInfoPointer_2.mCoords);
                            var distToCameraScale_2 = Math.max(Math.min((gemInfoPointer_2.mDistToCamera / 3425.0), 1.0), 0.5);
                            var outlineScale_2 = 0.99 + (distToCameraScale_2 * 0.1);
                            coords_2.Scale(outlineScale_2, outlineScale_2, outlineScale_2);
                            coords_2.GetOutboundMatrix(matWorldScaled);
                            aPass1WorldMatrices.push(matWorld);
                            Game.HyperspaceUltra.mG3D.SetWorldTransform(matWorldScaled);
                            Game.HyperspaceUltra.mG3D.RenderMesh(Game.BejApp.mBejApp.mGems3D[colorIndex_2]);
                        }
                        if((colorIndex_2 == (Game.DM.EGemColor.HYPERCUBE | 0)) || (aPiece.mBoundEffects.length > 0)) {
                            var hasPreFX = false;
                            var hasPostFX = false;
                            for(var anEffectIdx = 0; anEffectIdx < (aPiece.mBoundEffects.length | 0); anEffectIdx++) {
                                var anEffect = aPiece.mBoundEffects[anEffectIdx];
                                hasPreFX |= (anEffect.mFXManager == this.mBoardInfo.mBoard.mPreFXManager);
                                hasPostFX |= (anEffect.mFXManager == this.mBoardInfo.mBoard.mPostFXManager);
                            }
                            var _t13 = g.PushTranslate(160 + (gemInfoPointer_2.mPosScreen.x * 800) + 800, (gemInfoPointer_2.mPosScreen.y * -600) + 600);
                            try {
                                if(hasPreFX || (colorIndex_2 == (Game.DM.EGemColor.HYPERCUBE | 0))) {
                                    aRenderEffectPass.Dispose();
                                    Game.HyperspaceUltra.mG3D.Setup2DDrawing(Math.max(0.0, gemInfoPointer_2.mPosScreen.z + 0.0025));
                                    Game.HyperspaceUltra.mG3D.SetDepthState(GameFramework.gfx.Graphics3D.ECompareFunc.Less, false);
                                    Game.HyperspaceUltra.mG3D.SetBackfaceCulling(false, false);
                                    Game.HyperspaceUltra.mG3D.SetBlend(GameFramework.gfx.Graphics3D.EBlend.Default, GameFramework.gfx.Graphics3D.EBlend.Default);
                                    var prevAlpha = aPiece.mAlpha.get_v();
                                    aPiece.mAlpha.SetConstant(1.0);
                                    if(colorIndex_2 == (Game.DM.EGemColor.HYPERCUBE | 0)) {
                                        var _t14 = g.PushTranslate(-(aPiece.CX()), -(aPiece.CY()));
                                        try {
                                            this.mBoardInfo.mBoard.DrawPiece(g, aPiece, gemInfoPointer_2.mScaleScreen, true);
                                        } finally {
                                            _t14.Dispose();
                                        }
                                    }
                                    if(hasPreFX) {
                                        for(var anEffectIdx_2 = 0; anEffectIdx_2 < (aPiece.mBoundEffects.length | 0); anEffectIdx_2++) {
                                            var anEffect_2 = aPiece.mBoundEffects[anEffectIdx_2];
                                            if(anEffect_2.mFXManager == this.mBoardInfo.mBoard.mPreFXManager) {
                                                var _t15 = g.PushScale(gemInfoPointer_2.mScaleScreen, gemInfoPointer_2.mScaleScreen, 0.0, 0.0);
                                                try {
                                                    var _t16 = g.PushTranslate(-(anEffect_2.mX), -(anEffect_2.mY));
                                                    try {
                                                        anEffect_2.Draw(g);
                                                    } finally {
                                                        _t16.Dispose();
                                                    }
                                                } finally {
                                                    _t15.Dispose();
                                                }
                                            }
                                        }
                                    }
                                    aPiece.mAlpha.SetConstant(prevAlpha);
                                    Game.HyperspaceUltra.mG3D.End2DDrawing();
                                }
                                if(hasPostFX) {
                                    Game.HyperspaceUltra.mG3D.Setup2DDrawing(Math.max(0.0, gemInfoPointer_2.mPosScreen.z - 0.0025));
                                    Game.HyperspaceUltra.mG3D.SetDepthState(GameFramework.gfx.Graphics3D.ECompareFunc.Less, false);
                                    Game.HyperspaceUltra.mG3D.SetBackfaceCulling(false, false);
                                    Game.HyperspaceUltra.mG3D.SetBlend(GameFramework.gfx.Graphics3D.EBlend.Default, GameFramework.gfx.Graphics3D.EBlend.Default);
                                    if(hasPreFX) {
                                        for(var anEffectIdx_3 = 0; anEffectIdx_3 < (aPiece.mBoundEffects.length | 0); anEffectIdx_3++) {
                                            var anEffect_3 = aPiece.mBoundEffects[anEffectIdx_3];
                                            if(anEffect_3.mFXManager == this.mBoardInfo.mBoard.mPostFXManager) {
                                                var _t17 = g.PushScale(gemInfoPointer_2.mScaleScreen, gemInfoPointer_2.mScaleScreen, 0.0, 0.0);
                                                try {
                                                    var _t18 = g.PushTranslate(-(anEffect_3.mX), -(anEffect_3.mY));
                                                    try {
                                                        anEffect_3.Draw(g);
                                                    } finally {
                                                        _t18.Dispose();
                                                    }
                                                } finally {
                                                    _t17.Dispose();
                                                }
                                            }
                                        }
                                    }
                                    Game.HyperspaceUltra.mG3D.End2DDrawing();
                                }
                                Game.HyperspaceUltra.mG3D.SetBlend(GameFramework.gfx.Graphics3D.EBlend.Default, GameFramework.gfx.Graphics3D.EBlend.Default);
                                aRenderEffectPass = aRenderEffectRunHandle.BeginPass(0);
                                Game.HyperspaceUltra.mG3D.SetBackfaceCulling(true, false);
                            } finally {
                                _t13.Dispose();
                            }
                        }
                    }
                }
            }
            aRenderEffectPass.Dispose();
        } finally {
            _t10.Dispose();
        }
    },
    DrawBillboardEffects : function Game_HyperspaceUltra$DrawBillboardEffects(g, gemInfoPointer, front) {
        var colorIndex = this.GetGemColor(gemInfoPointer);
        var aPiece = gemInfoPointer.mPiece;
        var xScreenMax = 1600;
        var xScreenCenter = xScreenMax / 2.0;
        var yScreenMax = 1200;
        var yScreenCenter = yScreenMax / 2.0;
        if(gemInfoPointer.mPosScreen.z >= 1.0) {
            return;
        }
        Game.HyperspaceUltra.mG3D.SetBackfaceCulling(false, false);
        var _t19 = g.PushTranslate(160 + (gemInfoPointer.mPosScreen.x * xScreenCenter) + xScreenCenter, (gemInfoPointer.mPosScreen.y * -yScreenCenter) + yScreenCenter);
        try {
            var didSetup = false;
            if((colorIndex == (Game.DM.EGemColor.HYPERCUBE | 0)) && (!front)) {
                if(!didSetup) {
                    Game.HyperspaceUltra.mG3D.Setup2DDrawing(gemInfoPointer.mPosScreen.z);
                    Game.HyperspaceUltra.mG3D.SetDepthState(GameFramework.gfx.Graphics3D.ECompareFunc.Less, false);
                    didSetup = true;
                }
                var prevAlpha = aPiece.mAlpha.get_v();
                aPiece.mAlpha.SetConstant(1.0);
                var _t20 = g.PushTranslate(-(aPiece.CX()), -(aPiece.CY()));
                try {
                    this.mBoardInfo.mBoard.DrawPiece(g, aPiece, gemInfoPointer.mScaleScreen, true);
                } finally {
                    _t20.Dispose();
                }
                aPiece.mAlpha.SetConstant(prevAlpha);
            }
            for(var anEffectIdx = 0; anEffectIdx < (aPiece.mBoundEffects.length | 0); anEffectIdx++) {
                var anEffect = aPiece.mBoundEffects[anEffectIdx];
                if(((anEffect.mFXManager == this.mBoardInfo.mBoard.mPreFXManager) && (!front)) || ((anEffect.mFXManager == this.mBoardInfo.mBoard.mPostFXManager) && (front))) {
                    if(!didSetup) {
                        Game.HyperspaceUltra.mG3D.Setup2DDrawing(gemInfoPointer.mPosScreen.z);
                        Game.HyperspaceUltra.mG3D.SetDepthState(GameFramework.gfx.Graphics3D.ECompareFunc.Less, false);
                        didSetup = true;
                    }
                    var _t21 = g.PushScale(gemInfoPointer.mScaleScreen, gemInfoPointer.mScaleScreen, 0.0, 0.0);
                    try {
                        var _t22 = g.PushTranslate(-(anEffect.mX), -(anEffect.mY));
                        try {
                            anEffect.Draw(g);
                        } finally {
                            _t22.Dispose();
                        }
                    } finally {
                        _t21.Dispose();
                    }
                }
            }
            if(didSetup) {
                Game.HyperspaceUltra.mG3D.End2DDrawing();
                Game.HyperspaceUltra.mG3D.SetBlend(GameFramework.gfx.Graphics3D.EBlend.Default, GameFramework.gfx.Graphics3D.EBlend.Default);
            }
        } finally {
            _t19.Dispose();
        }
    },
    GetGemColor : function Game_HyperspaceUltra$GetGemColor(gemInfoPointer) {
        return (gemInfoPointer.mPiece.mColor | 0);
    },
    GetZFarClip : function Game_HyperspaceUltra$GetZFarClip() {
        switch(this.mState) {
            case Game.HyperspaceUltra.HyperSpaceState.GemRise:
            case Game.HyperspaceUltra.HyperSpaceState.GemFly:
            case Game.HyperspaceUltra.HyperSpaceState.BoardShatter:
            {
                return 30000.0;
            }

            default:

            {
                return 100000.0;
            }

        }
    },
    GetFocalLength : function Game_HyperspaceUltra$GetFocalLength() {
        var anAspectRatio = GameFramework.BaseApp.mApp.mWidth / GameFramework.BaseApp.mApp.mHeight;
        return 19.9 * anAspectRatio;
    }
}
Game.HyperspaceUltra.staticInit = function Game_HyperspaceUltra$staticInit() {
    Game.HyperspaceUltra.mG3D = null;
    Game.HyperspaceUltra.mHypertubeTextures = Array.Create(2, null);
    Game.HyperspaceUltra.mapColorIndexToMaterial = Array.Create(7, 7, new Game.HyperMaterial(Array.Create(4, null, 0.6, 0.6, 0.6, 0.6), Array.Create(4, null, 1.0, 1.0, 1.0, 1.0), Array.Create(4, null, 1.0, 1.0, 1.0, 0.6), 55.0), new Game.HyperMaterial(Array.Create(4, null, 0.7, 0.7, 0.7, 0.7), Array.Create(4, null, 1.0, 1.0, 1.0, 1.0), Array.Create(4, null, 1.0, 1.0, 1.0, 0.6), 55.0), new Game.HyperMaterial(Array.Create(4, null, 0.7, 0.7, 0.7, 0.7), Array.Create(4, null, 1.0, 1.0, 1.0, 1.0), Array.Create(4, null, 1.0, 1.0, 1.0, 0.6), 55.0), new Game.HyperMaterial(Array.Create(4, null, 0.7, 0.7, 0.7, 0.7), Array.Create(4, null, 1.0, 1.0, 1.0, 1.0), Array.Create(4, null, 1.0, 1.0, 1.0, 0.6), 55.0), new Game.HyperMaterial(Array.Create(4, null, 0.8, 0.8, 0.8, 0.7), Array.Create(4, null, 1.0, 1.0, 1.0, 1.0), Array.Create(4, null, 1.0, 1.0, 1.0, 0.6), 55.0), new Game.HyperMaterial(Array.Create(4, null, 0.7, 0.7, 0.7, 0.7), Array.Create(4, null, 1.0, 1.0, 1.0, 1.0), Array.Create(4, null, 1.0, 1.0, 1.0, 0.6), 55.0), new Game.HyperMaterial(Array.Create(4, null, 0.8, 0.8, 0.8, 0.7), Array.Create(4, null, 1.0, 1.0, 1.0, 1.0), Array.Create(4, null, 1.0, 1.0, 1.0, 0.6), 45.0));
    Game.HyperspaceUltra.mapColorIndexToLightOffset = Array.Create(7, 7, new GameFramework.geom.Vector3(50.0, 150.0, -200.0), new GameFramework.geom.Vector3(50.0, 150.0, -200.0), new GameFramework.geom.Vector3(50.0, 150.0, -200.0), new GameFramework.geom.Vector3(-100.0, -100.0, -200.0), new GameFramework.geom.Vector3(100.0, 50.0, 0.0), new GameFramework.geom.Vector3(50.0, 150.0, -200.0), new GameFramework.geom.Vector3(-100.0, 200.0, 0.0));
    Game.HyperspaceUltra.ambientLightColor = Array.Create(4, 4, 1.0, 1.0, 1.0, 1.0);
    Game.HyperspaceUltra.diffuseLightColor = Array.Create(4, 4, 0.6, 0.6, 0.6, 1.0);
    Game.HyperspaceUltra.specularLightColor = Array.Create(4, 4, 1.0, 1.0, 1.0, 1.0);
}

JS_AddInitFunc(function() {
    Game.HyperspaceUltra.registerClass('Game.HyperspaceUltra', Game.Hyperspace);
});
JS_AddStaticInitFunc(function() {
    Game.HyperspaceUltra.staticInit();
});
Game.HyperspaceUltra.HyperSpaceState = {};
Game.HyperspaceUltra.HyperSpaceState.staticInit = function Game_HyperspaceUltra_HyperSpaceState$staticInit() {
    Game.HyperspaceUltra.HyperSpaceState.Init = 0;
    Game.HyperspaceUltra.HyperSpaceState.SlideOver = 1;
    Game.HyperspaceUltra.HyperSpaceState.FadeTo3D = 2;
    Game.HyperspaceUltra.HyperSpaceState.GemRise = 3;
    Game.HyperspaceUltra.HyperSpaceState.GemFly = 4;
    Game.HyperspaceUltra.HyperSpaceState.BoardShatter = 5;
    Game.HyperspaceUltra.HyperSpaceState.PortalRide = 6;
    Game.HyperspaceUltra.HyperSpaceState.LandOnBoard = 7;
    Game.HyperspaceUltra.HyperSpaceState.FadeFrom3D = 8;
    Game.HyperspaceUltra.HyperSpaceState.Outro = 9;
    Game.HyperspaceUltra.HyperSpaceState.Complete = 10;
    Game.HyperspaceUltra.HyperSpaceState.DebugDrawEveryOther = 11;
    Game.HyperspaceUltra.HyperSpaceState.Max = 12;
    Game.HyperspaceUltra.HyperSpaceState.Nil = -1;
}
JS_AddInitFunc(function() {
    Game.HyperspaceUltra.HyperSpaceState.staticInit();
});