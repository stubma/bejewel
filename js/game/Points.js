Game.Points = function Game_Points(theApp, theFont, theString, theX, theY, theLife, theJustification, theColor, theAnim) {
    this.mImage = Array.Create(Game.Points.MAX_LAYERS, null);
    this.mSubColor = GameFramework.gfx.Color.WHITE.Clone();
    this.mColorCycle = Array.Create(Game.Points.MAX_LAYERS, null);
    this.mLimitY = true;
    this.mDelay = 0;
    this.mColorCycling = false;
    this.mRotation = 0.0;
    this.mApp = theApp;
    this.mFont = theFont;
    this.mTimer = theLife;
    this.mColor = theColor;
    this.mWobbleSin = 0.0;
    this.mDoBounce = false;
    this.mWantCachedImage = false;
    this.mCachedImage = null;
    for(var i = 0; i < Game.Points.MAX_LAYERS; i++) {
        this.mImage[i] = null;
        this.mColorCycle[i] = new Game.ColorCycle();
    }
    if(theAnim < 3) {
        for(var i_2 = 0; i_2 < Game.Points.MAX_LAYERS; i_2++) {
            this.mColorCycle[i_2].mCyclePos = Math.abs(GameFramework.Utils.GetRandFloat());
            this.mColorCycle[i_2].mCycleColors.clear();
            this.mColorCycle[i_2].mColor = 0;
        }
    }
    for(var i_3 = 0; i_3 < Game.Points.MAX_LAYERS; i_3++) {
        this.mColorCycle[i_3].SetSpeed(1.8);
    }
    var aLightColor = GameFramework.gfx.Color.CreateFromInt(this.mColor);
    aLightColor.mRed = ((Math.min(255, ((aLightColor.mRed * 1.5) | 0))) | 0);
    aLightColor.mGreen = ((Math.min(255, ((aLightColor.mGreen * 1.5) | 0))) | 0);
    aLightColor.mBlue = ((Math.min(255, ((aLightColor.mBlue * 1.5) | 0))) | 0);
    var aDarkColor = GameFramework.gfx.Color.CreateFromInt(this.mColor);
    aDarkColor.mRed = ((Math.min(255, ((aDarkColor.mRed * 0.5) | 0))) | 0);
    aDarkColor.mGreen = ((Math.min(255, ((aDarkColor.mGreen * 0.5) | 0))) | 0);
    aDarkColor.mBlue = ((Math.min(255, ((aDarkColor.mBlue * 0.5) | 0))) | 0);
    switch(theAnim) {
        case 0:
        {
            this.mColorCycle[0].mCycleColors.push(aDarkColor.ToInt());
            this.mColorCycle[0].mCycleColors.push(aDarkColor.ToInt());
            break;
        }
        case 1:
        {
            this.mColorCycle[0].mCycleColors.push(aDarkColor.ToInt());
            this.mColorCycle[0].mCycleColors.push(aLightColor.ToInt());
            break;
        }
        case 2:
        {
            this.mColorCycle[0].mCycleColors.push(aDarkColor.ToInt());
            this.mColorCycle[0].mCycleColors.push(aLightColor.ToInt());
            this.mColorCycle[0].SetPosition(0.25);
            this.mColorCycle[2].mCycleColors.push(aDarkColor.ToInt());
            this.mColorCycle[2].mCycleColors.push(aLightColor.ToInt());
            this.mColorCycle[2].SetPosition(0.75);
            break;
        }
        case 3:
        default:
        {
            this.mColorCycle[0].SetPosition(0.25);
            this.mColorCycle[2].SetPosition(0.5);
            break;
        }
    }
    this.mString = theString;
    this.RestartWobble();
    var aScaleFactor = 1.0;
    var aTotalWidth = (this.mFont.StringWidth(this.mString) | 0);
    var aNewX = theX;
    if(theJustification == 0) {
        aNewX -= (((aTotalWidth / aScaleFactor) / 2) | 0);
    } else if(theJustification == 1) {
        aNewX -= ((aTotalWidth / aScaleFactor) | 0);
    }
    var aNewY = theY - (this.mFont.GetAscent() | 0);
    this.mHue = 0;
    if((aNewX + this.mWidth) > GameFramework.BaseApp.mApp.mWidth) {
        aNewX = GameFramework.BaseApp.mApp.mWidth - this.mWidth;
    }
    this.mX = theX;
    this.mY = theY;
    this.mScale = 0.0;
    this.mScaleAdd = 0.0;
    this.mDY = 1.2;
    this.mUpdateCnt = 0;
    this.mSubStringShowTick = -1;
    this.mSubFont = null;
    this.mId = -1;
    this.mMoveCreditId = -1;
    this.mState = Game.Points.EState.RISING;
    this.mAlpha = 1.0;
    this.mLayerCount = 3;
    this.mDrawn = false;
    this.mDeleteMe = false;
}
Game.Points.prototype = {
    mX : 0,
    mY : 0,
    mDY : 0,
    mLimitY : null,
    mState : null,
    mScalePoints : 0,
    mCorrectedPoints : 0,
    mWidth : 0,
    mHeight : 0,
    mApp : null,
    mTimer : 0,
    mString : null,
    mFont : null,
    mHue : 0,
    mImage : null,
    mSubString : null,
    mSubStringShowTick : 0,
    mSubFont : null,
    mSubColor : null,
    mLayerCount : 0,
    mDelay : 0,
    mScale : 0,
    mDestScale : 0,
    mScaleAdd : 0,
    mScaleDampening : 0,
    mScaleDifMult : 0,
    mColorCycle : null,
    mColorCycling : null,
    mUpdateCnt : 0,
    mColor : GameFramework.gfx.Color.WHITE_RGB,
    mWobbleSin : 0,
    mWobbleScale : 0,
    mDoBounce : null,
    mAlpha : 0,
    mWantCachedImage : null,
    mCachedImage : null,
    mRotation : 0,
    mId : 0,
    mMoveCreditId : 0,
    mValue : 0,
    mDrawn : null,
    mDeleteMe : null,
    Dispose : function Game_Points$Dispose() {
    },
    Update : function Game_Points$Update() {
        this.mUpdateCnt++;
        var aDrawWidth = (this.mFont.StringWidth(this.mString) | 0);
        if(this.mX + (((aDrawWidth / 2) | 0)) * 1.5 > 1920) {
            this.mX = 1920 - (((aDrawWidth / 2) | 0)) * 1.5;
        }
        if(this.mDelay > 0) {
            --this.mDelay;
            return;
        }
        this.mWobbleSin += (0.03 * 3.141593 * 2) * 1.67;
        if(this.mWobbleSin > 3.141593 * 2) {
            this.mWobbleSin -= 3.141593 * 2;
        }
        this.mWobbleScale -= (0.005) * 1.67;
        if(this.mWobbleScale < 0.0) {
            this.mWobbleScale = 0.0;
        }
        for(var i = 0; i < 3; i++) {
            this.mColorCycle[i].Update();
        }
        var aDif = this.mDestScale - this.mScale;
        if(this.mState == Game.Points.EState.RISING) {
            this.mScaleAdd += aDif * this.mScaleDifMult;
            this.mScaleAdd *= this.mScaleDampening;
            this.mScale += this.mScaleAdd;
            if((this.mScale < this.mDestScale) && (!this.mDoBounce)) {
                this.mScale = this.mDestScale;
            }
        } else if(this.mState == Game.Points.EState.VERT_SHIFTING) {
        } else {
            this.mAlpha -= 0.05 * 1.67;
            this.mScale -= 0.03 * 1.67;
            if(this.mScale <= 0 || this.mAlpha <= 0) {
                this.mDeleteMe = true;
            }
        }
        var aDYScale = Math.pow(Math.min(this.mY / 50.0, 1.0), 0.015);
        this.mDY *= aDYScale;
        this.mY -= this.mDY * 1.67;
        if(this.mLimitY) {
            this.mY = Math.max(75, this.mY);
        }
        this.mTimer -= 0.01 * 1.67;
        if(this.mTimer <= 0.0) {
            if(this.mState == Game.Points.EState.RISING) {
                this.StartFading();
            }
        }
    },
    Draw : function Game_Points$Draw(g) {
        if(this.mDelay > 0) {
            return;
        }
        var aScale = this.mScale + (Math.sin(this.mWobbleSin)) * this.mWobbleScale;
        if(!this.mDoBounce) {
            aScale = this.mScale;
        }
        if(this.mWantCachedImage) {
            this.UpdateCachedImage();
        }
        if(this.mWantCachedImage && this.mCachedImage != null) {
            var t = new GameFramework.geom.Matrix();
            t.identity();
            t.scale(aScale, aScale);
            t.rotate(this.mRotation);
            t.translate(this.mX, this.mY);
            Game.Util.DrawImageMatrix(g, this.mCachedImage, t);
        } else {
            if(this.mRotation != 0) {
                var aTrans = new GameFramework.geom.Matrix();
                aTrans.rotate(this.mRotation);
            }
            this.SetupForDraw(g);
            var aDrawWidth = this.mFont.StringWidth(this.mString);
            var aDrawHeight = this.mFont.GetAscent();
            g.PushScale(aScale, aScale, this.mX, this.mY);
            g.DrawString(this.mString, this.mX - aDrawWidth / 2, this.mY + aDrawHeight * 0.2);
            g.PopMatrix();
            this.FinishDraw(g);
        }
        if(this.mSubStringShowTick >= 0 && this.mSubStringShowTick <= this.mUpdateCnt && this.mSubString != '' && this.mSubFont != null) {
            var aDrawWidth_2 = (this.mFont.StringWidth(this.mString) | 0);
            var aDrawHeight_2 = (this.mFont.GetAscent() | 0);
            var aSubDrawWidth = (this.mSubFont.StringWidth(this.mSubString) | 0);
            var aSubDrawHeight = (this.mSubFont.GetAscent() | 0);
            g.SetFont(this.mSubFont);
            var locY = (this.mY | 0) + -80;
            var transInPct = (this.mUpdateCnt - this.mSubStringShowTick) / 20.0;
            var scale = aScale;
            if(transInPct < 1.0) {
                aScale = (1.0 + 0.5 * (1.0 - transInPct));
            }
        }
        this.mDrawn = true;
    },
    RestartWobble : function Game_Points$RestartWobble() {
        this.mWobbleScale = 0.3;
    },
    StartFading : function Game_Points$StartFading() {
        this.mState = Game.Points.EState.FADING;
    },
    SetupForDraw : function Game_Points$SetupForDraw(g) {
        g.SetFont(this.mFont);
        var aLayerNames = Array.Create(3, "", 'GLOW', 'MAIN', 'OUTLINE');
        if(this.mFont == Game.Resources['FONT_FLOATERS']) {
            for(var i = 0; i < aLayerNames.length; i++) {
                var aLayerColor = 0xffffffff;
                if(i == this.mLayerCount - 1) {
                    if(this.mColorCycling) {
                        aLayerColor = this.mColorCycle[this.mLayerCount - 1].GetColor();
                    } else {
                        aLayerColor = this.mColor;
                    }
                } else {
                    aLayerColor = this.mColorCycle[i].GetColor();
                }
                aLayerColor = GameFramework.gfx.Color.UInt_FAToInt(aLayerColor, this.mAlpha * ((aLayerColor >>> 24) / 255.0));
                this.mFont.PushLayerColor(aLayerNames[i], aLayerColor);
            }
        }
    },
    FinishDraw : function Game_Points$FinishDraw(g) {
        var aLayerNames = Array.Create(3, "", 'GLOW', 'MAIN', 'OUTLINE');
        if(this.mFont == Game.Resources['FONT_FLOATERS']) {
            for(var i = 0; i < aLayerNames.length; i++) {
                this.mFont.PopLayerColor(aLayerNames[i]);
            }
        }
    },
    UpdateCachedImage : function Game_Points$UpdateCachedImage() {
    }
}
Game.Points.staticInit = function Game_Points$staticInit() {
    Game.Points.MAX_LAYERS = 5;
}

JS_AddInitFunc(function() {
    Game.Points.registerClass('Game.Points', null);
});
JS_AddStaticInitFunc(function() {
    Game.Points.staticInit();
});
Game.Points.EState = {};
Game.Points.EState.staticInit = function Game_Points_EState$staticInit() {
    Game.Points.EState.RISING = 0;
    Game.Points.EState.FADING = 1;
    Game.Points.EState.VERT_SHIFTING = 2;
}
JS_AddInitFunc(function() {
    Game.Points.EState.staticInit();
});