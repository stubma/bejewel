/**
 * @constructor
 */
Game.Effect = function Game_Effect(theType) {
    this.mDoubleSpeed = false;
    this.mType = theType;
    this.mOverlay = false;
    this.mX = 0;
    this.mY = 0;
    this.mZ = 0;
    this.mPieceIdRel = -1;
    this.mDX = this.mDY = this.mDZ = 0;
    this.mDXScalar = this.mDYScalar = this.mDZScalar = 1.0;
    this.mGravity = 0;
    this.mDelay = 0;
    this.mLightSize = 0;
    this.mLightIntensity = 0;
    this.mScale = 1.0;
    this.mDScale = 0.0;
    this.mMinScale = 0.0;
    this.mMaxScale = 10000.0;
    this.mFrame = 0;
    this.mAngle = this.mDAngle = 0;
    this.mColor = GameFramework.gfx.Color.WHITE_RGB;
    this.mIsCyclingColor = false;
    this.mCurHue = 0;
    this.mUpdateDiv = 1;
    this.mAlpha = 1.0;
    this.mDAlpha = -0.01;
    this.mMaxAlpha = 1.0;
    this.mImage = null;
    this.mFlags = 0;
    this.mIsAdditive = false;
    switch(this.mType) {
        case Game.Effect.EFxType.STEAM:
        {
            this.mImage = Game.Resources['IMAGE_FX_STEAM'];
            this.mGravity = (-0.005) * 1.67;
            if(GameFramework.BaseApp.mApp.get_Is3D()) {
                this.mAngle = GameFramework.Utils.GetRandFloat() * 3.141593;
                this.mDAngle = (GameFramework.Utils.GetRandFloat() * 0.04) * 1.67;
            }

            this.mAlpha = 0.85;
            this.mDAlpha = 0;
            this.mValue = Array.Create(3, null);
            this.mValue[0] = (0.5) * 1.67;
            this.mValue[1] = (-0.02) * 1.67;
            this.mValue[2] = 0.93;
            break;
        }
        case Game.Effect.EFxType.SPARKLE_SHARD:
        {
            this.mUpdateDiv = (Game.Util.Rand() % 2) + 2;
            this.mDX = (-1.0 + ((Game.Util.Rand() % 20) * 0.1)) * 1.67;
            this.mDY = (((Game.Util.Rand() % 50)) * 0.1) * 1.67;
            this.mColor = GameFramework.gfx.Color.RGBAToInt(255, 255, 255, 255);
            break;
        }
        case Game.Effect.EFxType.GEM_SHARD:
        {
            this.mValue = Array.Create(4, null);
            this.mFrame = Game.Util.Rand() % 40;
            this.mUpdateDiv = 0;
            this.mAlpha = 1.0;
            this.mDAlpha = (-0.005 + Math.abs(GameFramework.Utils.GetRandFloat()) * -0.01) * 1.67;
            this.mDecel = 1.0;
            break;
        }
        case Game.Effect.EFxType.GLITTER_SPARK:
        {
            this.mImage = Game.Resources['IMAGE_GEM_FRUIT_SPARK'];
            this.mIsAdditive = true;
            this.mGravity = 0.01;
            this.mAlpha = 1.0;
            this.mDAlpha = 0.0;
            this.mScale = 0.5;
            this.mDScale = -0.005;
            break;
        }
        case Game.Effect.EFxType.FRUIT_SPARK:
        {
            this.mGravity = 0.005;
            this.mDX = GameFramework.Utils.GetRandFloat() * 1.0;
            this.mDY = GameFramework.Utils.GetRandFloat() * 1.0;
            this.mScale = 0.2;
            this.mAlpha = 1.0;
            this.mDAlpha = -0.005;
            this.mAngle = GameFramework.Utils.GetRandFloat() * 3.141593;
            break;
        }
        case Game.Effect.EFxType.EMBER_FADEINOUT_BOTTOM:
        case Game.Effect.EFxType.EMBER_FADEINOUT:
        case Game.Effect.EFxType.EMBER_BOTTOM:
        case Game.Effect.EFxType.EMBER:
        {
            this.mImage = Game.Resources['IMAGE_FIREPARTICLE'];
            this.mColor = GameFramework.gfx.Color.RGBAToInt(255, Game.Util.Rand() % 64 + 64, Game.Util.Rand() % 32 + 30, 255);
            this.mGravity = -0.0;
            this.mScale = 0.75;
            this.mDScale = 0.005;
            this.mAngle = GameFramework.Utils.GetRandFloat() * 3.141593;
            this.mDAngle = 0.0;
            if((this.mType == Game.Effect.EFxType.EMBER_FADEINOUT) || (this.mType == Game.Effect.EFxType.EMBER_FADEINOUT_BOTTOM)) {
                this.mAlpha = 0.01;
                this.mDAlpha = 0.02;
                this.mStage = 0;
                break;
            }
        }
        case Game.Effect.EFxType.COUNTDOWN_SHARD:
        {
            var aType = Game.Util.Rand() % 2;
            var anAngle = Game.Util.Rand() % 2 * 3.141593;
            anAngle += GameFramework.Utils.GetRandFloat() * 3.141593 * 0.3;
            var aSpeed = Game.Board.GEM_WIDTH * (0.02 + Math.abs(GameFramework.Utils.GetRandFloat()) * 0.05);
            if(aType != 0) {
                this.mAngle = anAngle;
                this.mDAngle = GameFramework.Utils.GetRandFloat() * 3.141593 * 0.01;
            } else {
                this.mAngle = 0;
            }
            this.mAngle = GameFramework.Utils.GetRandFloat() * 3.141593;
            this.mDAngle = GameFramework.Utils.GetRandFloat() * 0.2;
            this.mFrame = Game.Util.Rand() % this.mImage.mNumFrames;
            this.mColor = GameFramework.gfx.Color.WHITE_RGB;
            this.mDX = Math.cos(anAngle) * aSpeed * 1.25;
            this.mDY = -Math.abs(Math.sin(anAngle) * aSpeed) * 1.5;
            this.mGravity = 0.15;
            this.mDAlpha = -0.0 + Math.abs(GameFramework.Utils.GetRandFloat()) * -0.0;
            this.mAlpha = 1.0;
            this.mScale = 0.5 + Math.abs(GameFramework.Utils.GetRandFloat()) * 0.2;
            this.mDScale = -0.0 + Math.abs(GameFramework.Utils.GetRandFloat()) * -0.01;
            this.mTimer = 0.5 + Math.abs(GameFramework.Utils.GetRandFloat()) * 0.75;
            break;
        }
        case Game.Effect.EFxType.SMOKE_PUFF:
        {
            this.mImage = Game.Resources['IMAGE_SMOKE'];
            this.mGravity = -0.005;
            this.mAlpha = 0.5;
            this.mDAlpha = -0.005;
            break;
        }
        case Game.Effect.EFxType.DROPLET:
        {
            this.mImage = Game.Resources['IMAGE_DRIP'];
            this.mDAlpha = 0;
            this.mGravity = 0.05;
            break;
        }
        case Game.Effect.EFxType.STEAM_COMET:
        {
            this.mValue = Array.Create(2, null);
            this.mImage = Game.Resources['IMAGE_FX_STEAM'];
            this.mGravity = -0.005;
            this.mAngle = GameFramework.Utils.GetRandFloat() * 3.141593;
            this.mDAngle = GameFramework.Utils.GetRandFloat() * 0.04;
            this.mAlpha = 0.85;
            this.mDAlpha = 0;
            break;
        }
        case Game.Effect.EFxType.LIGHT:
        {
            this.mValue = Array.Create(3, null);
            break;
        }
    }
    this.mDeleteMe = false;
    this.mRefCount = 0;
}
Game.Effect.prototype = {
    mType : null,
    mOverlay : null,
    mX : 0,
    mY : 0,
    mZ : 0,
    mDX : 0,
    mDY : 0,
    mDZ : 0,
    mPieceIdRel : 0,
    mDXScalar : 0,
    mDYScalar : 0,
    mDZScalar : 0,
    mGravity : 0,
    mFrame : 0,
    mDelay : 0,
    mGemType : 0,
    mDecel : 0,
    mAlpha : 0,
    mDAlpha : 0,
    mMaxAlpha : 0,
    mScale : 0,
    mDScale : 0,
    mLightSize : 0,
    mLightIntensity : 0,
    mMinScale : 0,
    mMaxScale : 0,
    mColor : GameFramework.gfx.Color.WHITE_RGB,
    mColor2 : GameFramework.gfx.Color.WHITE_RGB,
    mAngle : 0,
    mDAngle : 0,
    mStage : 0,
    mTimer : 0,
    mImage : null,
    mDoubleSpeed : null,
    mUpdateDiv : 0,
    mIsCyclingColor : null,
    mCurHue : 0,
    mIsAdditive : null,
    mValue : null,
    mPieceId : 0,
    mFlags : 0,
    mDeleteMe : null,
    mRefCount : 0,
    mFXManager : null,
    Dispose : function Game_Effect$Dispose() {
    },
    Update : function Game_Effect$Update() {
    },
    Draw : function Game_Effect$Draw(g) {
    }
}
Game.Effect.staticInit = function Game_Effect$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.Effect.registerClass('Game.Effect', null, GameFramework.IExplicitDisposable);
});
JSFExt_AddStaticInitFunc(function() {
    Game.Effect.staticInit();
});
Game.Effect.EFxType = {};
Game.Effect.EFxType.staticInit = function Game_Effect_EFxType$staticInit() {
    Game.Effect.EFxType.NONE = 0;
    Game.Effect.EFxType.CUSTOMCLASS = 1;
    Game.Effect.EFxType.BLAST_RING = 2;
    Game.Effect.EFxType.SMOKE_PUFF = 3;
    Game.Effect.EFxType.DROPLET = 4;
    Game.Effect.EFxType.STEAM_COMET = 5;
    Game.Effect.EFxType.GEM_SHARD = 6;
    Game.Effect.EFxType.STEAM = 7;
    Game.Effect.EFxType.EMBER_BOTTOM = 8;
    Game.Effect.EFxType.EMBER_FADEINOUT_BOTTOM = 9;
    Game.Effect.EFxType.EMBER = 10;
    Game.Effect.EFxType.EMBER_FADEINOUT = 11;
    Game.Effect.EFxType.FRUIT_SPARK = 12;
    Game.Effect.EFxType.COUNTDOWN_SHARD = 13;
    Game.Effect.EFxType.SPARKLE_SHARD = 14;
    Game.Effect.EFxType.GLITTER_SPARK = 15;
    Game.Effect.EFxType.CURSOR_RING = 16;
    Game.Effect.EFxType.LIGHT = 17;
    Game.Effect.EFxType.WALL_ROCK = 18;
    Game.Effect.EFxType.QUAKE_DUST = 19;
    Game.Effect.EFxType.HYPERCUBE_ENERGIZE = 20;
    Game.Effect.EFxType.TIME_BONUS = 21;
    Game.Effect.EFxType.PI = 22;
    Game.Effect.EFxType.POPANIM = 23;
    Game.Effect.EFxType.TIME_BONUS_TOP = 24;
    Game.Effect.EFxType.__COUNT = 25;
}
JSFExt_AddInitFunc(function() {
    Game.Effect.EFxType.staticInit();
});
Game.Effect.EFlag = {};
Game.Effect.EFlag.staticInit = function Game_Effect_EFlag$staticInit() {
    Game.Effect.EFlag.SCALE_FADEINOUT = 1 << 0;
    Game.Effect.EFlag.ALPHA_FADEINOUT = 1 << 1;
    Game.Effect.EFlag.ALPHA_FADEINDELAY = 1 << 2;
    Game.Effect.EFlag.HYPERSPACE_ONLY = 1 << 3;
}
JSFExt_AddInitFunc(function() {
    Game.Effect.EFlag.staticInit();
});