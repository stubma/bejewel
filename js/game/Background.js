/**
 * @constructor
 */
Game.Background = function Game_Background(wantFlatImage, wantAnim) {
    if(wantFlatImage === undefined) {
        wantFlatImage = true;
    }
    if(wantAnim === undefined) {
        wantAnim = true;
    }
    this.mAnim = null;
    this.mUpdateSpeed = new GameFramework.CurvedVal();
    this.mImageOverlayAlpha = new GameFramework.CurvedVal();
    this.mFlash = new GameFramework.CurvedVal();
    Game.Background.initializeBase(this);
    this.mWantAnim = false;
    this.mImageOverlayAlpha.SetConstant(1.0);
    this.mNoParticles = true;
    this.mNoParticles = false;
}
Game.Background.StartBkgLoad = function Game_Background$StartBkgLoad(theBkgIdx) {
    if(!Game.Background.mIsBkgLoaded[theBkgIdx]) {
        var aBackgroundLoader = new Game.BackgroundLoader(theBkgIdx);
        var aResourceStreamer;
        if(Game.Background.mBkgGroupNames[theBkgIdx] != null) {
            aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamResourceGroup(Game.Background.mBkgGroupNames[theBkgIdx]);
        } else {
            aResourceStreamer = GameFramework.BaseApp.mApp.mResourceManager.StreamImageFromPath(Game.Background.mFlattenedNames[theBkgIdx]);
        }
        aResourceStreamer.AddEventListener(GameFramework.events.Event.COMPLETE, ss.Delegate.create(aBackgroundLoader, aBackgroundLoader.BackgroundLoaded));
        return aResourceStreamer;
    }
    return null;
}
Game.Background.SetBkgImagePath = function Game_Background$SetBkgImagePath(theIdx, thePath) {
    Game.Background.mBkgGroupNames[theIdx] = null;
    Game.Background.mPopAnimNames[theIdx] = null;
    Game.Background.mFlattenedNames[theIdx] = thePath;
}
Game.Background.BkgUnload = function Game_Background$BkgUnload(theBkgIdx) {
    if(Game.Background.mIsBkgLoaded[theBkgIdx]) {
        if(Game.Background.mBkgGroupNames[theBkgIdx] != null) {
            GameFramework.BaseApp.mApp.mResourceManager.UnloadResourceGroup(Game.Background.mBkgGroupNames[theBkgIdx]);
        } else {
            Game.Background.mLoadedImages[theBkgIdx].Dispose();
            Game.Background.mLoadedImages[theBkgIdx] = null;
        }
        Game.Background.mIsBkgLoaded[theBkgIdx] = false;
    }
}
Game.Background.prototype = {
    mAnim : null,
    mImage : null,
    mNoParticles : null,
    mAnimActive : false,
    mWantAnim : false,
    mKeepFlatImage : false,
    mHasRenderTargetFlatImage : false,
    mRenderTargetFlatImageDirty : false,
    mExtraImgScale : 1.0,
    mExtraDrawScale : 1.0,
    mAllowRealign : true,
    mStage : 0,
    mScoreWaitLevel : 0,
    mScoreWaitsPassed : 0,
    mUpdateAcc : 0,
    mUpdateSpeed : null,
    mImageOverlayAlpha : null,
    mFlash : null,
    mColor : ~0,
    mCurBkgIdx : -1,
    mWantNextBkgStream : -1,
    mWantNextBkgUnload : -1,
    TryLoadBackground : function Game_Background$TryLoadBackground(theIdx) {
        if(Game.Background.mIsBkgLoaded[theIdx]) {
            this.mImageOverlayAlpha.SetConstant(1.0);
            this.mAnim = null;
            this.mAnimActive = false;
            if(Game.Background.mLoadedImages[theIdx] != null) {
                this.mImage = Game.Background.mLoadedImages[theIdx];
            } else {
                this.mImage = GameFramework.BaseApp.mApp.mResourceManager.GetImageResourceById(Game.Background.mFlattenedNames[theIdx]);
                if((GameFramework.BaseApp.mApp.get_Is3D()) && (!Game.BejApp.mBejApp.mIsSlow)) {
                    this.mAnim = GameFramework.BaseApp.mApp.mResourceManager.GetPopAnimResourceById(Game.Background.mPopAnimNames[theIdx]);
                    this.mAnim.mPIEffectIdSearchVector = [];
                    this.mAnim.mPIEffectIdSearchVector.push('PIEFFECT_BACKGROUNDS_');
                }
            }
            return true;
        }
        return false;
    },
    NextBkg : function Game_Background$NextBkg() {
        var aPrevBkgIdx = this.mCurBkgIdx;
        for(var aCount = 0; aCount < Game.Background.mBkgGroupNames.length; aCount++) {
            this.mCurBkgIdx = (this.mCurBkgIdx + 1) % Game.Background.mBkgGroupNames.length;
            if(this.TryLoadBackground(this.mCurBkgIdx)) {
                break;
            }
        }
        var aLoadingBkgIdx = (this.mCurBkgIdx + 1) % Game.Background.mBkgGroupNames.length;
        this.mWantNextBkgStream = aLoadingBkgIdx;
        for(var anIdx = 0; anIdx < Game.Background.mBkgGroupNames.length; anIdx++) {
            if((anIdx != 0) && (anIdx != aPrevBkgIdx) && (anIdx != this.mCurBkgIdx) && (anIdx != aLoadingBkgIdx) && (Game.Background.mIsBkgLoaded[anIdx])) {
                if(this.mWantNextBkgUnload == -1) {
                    this.mWantNextBkgUnload = anIdx;
                } else {
                    Game.Background.BkgUnload(this.mWantNextBkgUnload);
                }
            }
        }
        this.mStage = 0;
    },
    SetPopAnim : function Game_Background$SetPopAnim(thePopAnimResource) {
        this.mAnim = thePopAnimResource;
    },
    SetImage : function Game_Background$SetImage(theImage) {
        this.mImage = theImage;
    },
    GetPopAnim : function Game_Background$GetPopAnim(wait) {
        if(this.mAnim == null) {
            if(!wait) {
                return null;
            }
        }
        return this.mAnim;
    },
    LoadAnimProc : function Game_Background$LoadAnimProc() {
        this.mStage++;
    },
    Dispose : function Game_Background$Dispose() {
        if(this.mAnim != null) {
            this.RemoveWidget(this.mAnim);
        }
        this.RemoveAllWidgets(true);
        GameFramework.widgets.ClassicWidget.prototype.Dispose.apply(this);
    },
    Draw : function Game_Background$Draw(g) {
        var didDraw = false;
        var wantColor = this.mColor != GameFramework.gfx.Color.WHITE_RGB;
        if(wantColor) {
            g.PushColor(this.mColor);
        }
        if((this.mAnim != null) && (this.mAnim.mLoaded) && (this.mAnimActive)) {
            this.mAnim.Draw(g);
            didDraw = true;
        }
        if((this.mImage != null) && (this.mImageOverlayAlpha.GetOutVal() > 0.0)) {
            var _t1 = g.PushColor(GameFramework.gfx.Color.FAlphaToInt(this.mImageOverlayAlpha.GetOutVal()));
            try {
                if(this.mImage.mHeight == this.mHeight) {
                    if(this.mAllowRealign) {
                        g.DrawImage(this.mImage, (((1920 - this.mImage.mWidth) / 2) | 0), 0);
                    } else {
                        g.DrawImage(this.mImage, 0, 0);
                    }
                } else {
                    var aScaleFactor = this.mHeight / this.mImage.mHeight;
                    var _t2 = g.PushScale(aScaleFactor, aScaleFactor, 160, 0);
                    try {
                        g.DrawImage(this.mImage, (1920 - this.mImage.mWidth * aScaleFactor) / 2.0, 0.0);
                    } finally {
                        _t2.Dispose();
                    }
                }
                didDraw = true;
            } finally {
                _t1.Dispose();
            }
        }
        if(!didDraw) {
            var _t3 = g.PushColor(GameFramework.gfx.Color.RGBToInt(64, 0, 0));
            try {
                g.FillRect(0, 0, this.mWidth * 2, this.mHeight);
            } finally {
                _t3.Dispose();
            }
        }
        if(wantColor) {
            g.PopColor();
        }
        if(this.mFlash.GetOutVal() > 0.0) {
        }
    },
    Update : function Game_Background$Update() {
        GameFramework.widgets.ClassicWidget.prototype.Update.apply(this);
        var wantedAnim = this.mWantAnim;
        this.mWantAnim = Game.BejApp.mBejApp.mProfile.mAnimateBackground && Game.BejApp.mBejApp.get_Is3D();
        if(wantedAnim != this.mWantAnim) {
            if(this.mWantAnim && this.mAnim == null) {
                this.TryLoadBackground(this.mCurBkgIdx);
            }
        }
        if((this.mWantNextBkgStream != -1) && (Game.BejApp.mBejApp.mBoard != null) && (Game.BejApp.mBejApp.mBoard.mHyperspace == null) && (this.mWantAnim) && (Game.BejApp.mBejApp.mBoard.mSideXOff.get_v() == 0)) {
            Game.Background.StartBkgLoad(this.mWantNextBkgStream);
            this.mWantNextBkgStream = -1;
        }
        if((this.mWantNextBkgUnload != -1) && (Game.BejApp.mBejApp.mBoard != null) && (Game.BejApp.mBejApp.mBoard.mHyperspace == null) && (this.mWantAnim) && (Game.BejApp.mBejApp.mBoard.mSideXOff.get_v() == 0)) {
            Game.Background.BkgUnload(this.mWantNextBkgUnload);
            this.mWantNextBkgUnload = -1;
        }
        if((Game.BejApp.mBejApp.get_Is3D()) && (true) && (this.mWantAnim) && (this.mStage == 1) && ((this.mVisible) || (this.mParent == null))) {
            this.mStage++;
        }
        {
            if(this.mAnim != null) {
                if(!this.mWantAnim) {
                    this.mAnim.mPaused = true;
                    this.mAnim.mAnimRunning = false;
                } else if((!this.mAnimActive) && (this.mVisible)) {
                    this.mAnim.Play();
                    this.mAnim.Resize(0, 0, 1920, 1200);
                    if(this.mImage != null) {
                        this.mUpdateSpeed.SetCurve('b;0,1,0.0025,1,####         ~~###');
                        this.mImageOverlayAlpha.SetCurve('b;0,1,0.01,1,~###         ~####');
                    } else {
                        this.mUpdateSpeed.SetConstant(1.0);
                    }
                    this.mAnimActive = true;
                }
            }
            if((!this.mHasRenderTargetFlatImage) && (this.mAnim != null) && (!this.mKeepFlatImage) && (this.mImageOverlayAlpha.GetOutVal() == 0.0)) {
            }
        }
        if(this.mAnimActive) {
            this.mRenderTargetFlatImageDirty = true;
            if(this.mWantAnim) {
                this.mAnim.mAnimSpeedScale = this.mUpdateSpeed.GetOutVal();
                this.mAnim.Update();
            }
            if(!this.mWantAnim) {
                this.mStage = 0;
                this.mAnimActive = false;
                if(this.mAnim != null) {
                    if(this.mAnim.mParent != null) {
                        this.RemoveWidget(this.mAnim);
                    }
                    this.mAnim = null;
                }
                this.mImageOverlayAlpha.SetConstant(1.0);
            }
        }
    },
    GetBackgroundImage : function Game_Background$GetBackgroundImage(wait) {
        return this.GetBackgroundImage$3(wait, true);
    },
    GetBackgroundImage$2 : function Game_Background$GetBackgroundImage$2() {
        return this.GetBackgroundImage$3(true, true);
    },
    GetBackgroundImage$3 : function Game_Background$GetBackgroundImage$3(wait, removeAnim) {
        if(removeAnim === undefined) {
            removeAnim = true;
        }
        if((this.mImage == null) || (this.mHasRenderTargetFlatImage)) {
            if((this.mImage == null) || (this.mRenderTargetFlatImageDirty)) {
                if(this.mAnim != null) {
                    this.mHasRenderTargetFlatImage = true;
                    this.mRenderTargetFlatImageDirty = false;
                } else {
                    if(this.mHasRenderTargetFlatImage) {
                        this.mHasRenderTargetFlatImage = false;
                    }
                }
            }
        }
        return this.mImage;
    },
    PrepBackgroundImage : function Game_Background$PrepBackgroundImage() {
    }
}
Game.Background.staticInit = function Game_Background$staticInit() {
    Game.Background.mBkgGroupNames = Array.Create(
        7,
        7,
        'BG_LionTowerCascade',
        'BG_HorseForestTree',
        'BG_FloatingRockCity',
        'BG_LanternPlantsWorld',
        'BG_SnowyCliffsCastle',
        'BG_PointyIcePath',
        'BG_WaterfallCliff'
    );
    Game.Background.mPopAnimNames = Array.Create(
        7,
        7,
        'POPANIM_BACKGROUNDS_LION_TOWER_CASCADE',
        'POPANIM_BACKGROUNDS_HORSE_FOREST_TREE',
        'POPANIM_BACKGROUNDS_FLOATING_ROCK_CITY',
        'POPANIM_BACKGROUNDS_LANTERN_PLANTS_WORLD',
        'POPANIM_BACKGROUNDS_SNOWY_CLIFFS_CASTLE',
        'POPANIM_BACKGROUNDS_POINTY_ICE_PATH',
        'POPANIM_BACKGROUNDS_WATER_FALL_CLIFF'
    );
    Game.Background.mFlattenedNames = Array.Create(
        7,
        7,
        'IMAGE_BACKGROUNDS_LION_TOWER_CASCADE_FLATTENEDPAM',
        'IMAGE_BACKGROUNDS_HORSE_FOREST_TREE_FLATTENEDPAM',
        'IMAGE_BACKGROUNDS_FLOATING_ROCK_CITY_FLATTENEDPAM',
        'IMAGE_BACKGROUNDS_LANTERN_PLANTS_WORLD_FLATTENEDPAM',
        'IMAGE_BACKGROUNDS_SNOWY_CLIFFS_CASTLE_FLATTENEDPAM',
        'IMAGE_BACKGROUNDS_POINTY_ICE_PATH_FLATTENEDPAM',
        'IMAGE_BACKGROUNDS_WATER_FALL_CLIFF_FLATTENEDPAM'
    );
    Game.Background.mIsBkgLoaded = Array.Create(Game.Background.mBkgGroupNames.length, null);
    Game.Background.mLoadedImages = Array.Create(Game.Background.mBkgGroupNames.length, null);
}

JS_AddInitFunc(function() {
    Game.Background.registerClass('Game.Background', GameFramework.widgets.ClassicWidget);
});
JS_AddStaticInitFunc(function() {
    Game.Background.staticInit();
});