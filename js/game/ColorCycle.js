//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\ClassicEndLevelDialog.cs
//LineMap:2=10 5=15 7=14 8=16 16=21 35=42 38=44 40=47 44=52 45=54 48=58 51=60 61=67 65=76 75=82 80=86 81=88 84=90 90=93 92=96 94=99 95=101 98=105 102=110 103=112 106=116 112=119 116=124 120=129 123=130 
//Start:ColorCycle
/**
 * @constructor
 */
Game.ColorCycle = function Game_ColorCycle() {
    this.mCycleColors = [];
    for(var i = 0; i < Game.ColorCycle.gCycleColors.length; i++) {
        this.mCycleColors.push(Game.ColorCycle.gCycleColors[i]);
    }
    this.mBrightness = 0;
    this.mLooping = true;
    this.mAlpha = 1.0;
    this.Restart();
}
Game.ColorCycle.prototype = {
    mColor : GameFramework.gfx.Color.WHITE_RGB,
    mCyclePos : 0,
    mSpeed : 0,
    mBrightness : 0,
    mAlpha : 0,
    mLooping : null,
    mCycleColors : null,
    Dispose : function Game_ColorCycle$Dispose() {
    },
    SetSpeed : function Game_ColorCycle$SetSpeed(aSpeed) {
        this.mSpeed = aSpeed;
    },
    Update : function Game_ColorCycle$Update() {
        if(this.mSpeed == 0.0) {
            return;
        }
        if(this.mCycleColors.length == 0) {
            this.mColor = 0;
            return;
        }
        if(this.mCycleColors.length == 1) {
            this.mColor = this.mCycleColors[0];
            return;
        }
        this.mCyclePos += this.mSpeed * 0.01;
        if(this.mCyclePos >= 1.0 && !this.mLooping) {
            this.mCyclePos = 1.0;
            this.mColor = this.mCycleColors[this.mCycleColors.length - 1];
            return;
        }
        while(this.mCyclePos >= 1.0) {
            this.mCyclePos -= 1.0;
        }
        var aFloatIndex = this.mCyclePos * this.mCycleColors.length;
        var anIndex = (aFloatIndex | 0);
        var aNextIndex = (anIndex + 1) % (this.mCycleColors.length | 0);
        if(!this.mLooping && aNextIndex < anIndex) {
            aNextIndex = anIndex;
        }
        var aColor = Array.Create(2, null);
        aColor[0] = GameFramework.gfx.Color.CreateFromInt(this.mCycleColors[anIndex]);
        aColor[1] = GameFramework.gfx.Color.CreateFromInt(this.mCycleColors[aNextIndex]);
        var aFraction = aFloatIndex - anIndex;
        this.mColor = GameFramework.gfx.Color.RGBAToInt(((aFraction * aColor[1].mRed + (1.0 - aFraction) * aColor[0].mRed) | 0), ((aFraction * aColor[1].mGreen + (1.0 - aFraction) * aColor[0].mGreen) | 0), ((aFraction * aColor[1].mBlue + (1.0 - aFraction) * aColor[0].mBlue) | 0), ((this.mAlpha * (aFraction * aColor[1].mAlpha + (1.0 - aFraction) * aColor[0].mAlpha)) | 0));
    },
    GetColor : function Game_ColorCycle$GetColor() {
        return this.mColor;
    },
    SetPosition : function Game_ColorCycle$SetPosition(thePos) {
        while(thePos >= 1.0) {
            thePos -= 1.0;
        }
        this.mCyclePos = thePos;
        this.Update();
    },
    SetBrightness : function Game_ColorCycle$SetBrightness(theBrightness) {
        this.mBrightness = theBrightness;
    },
    Restart : function Game_ColorCycle$Restart() {
        this.mCyclePos = 0.0;
        this.mSpeed = 1.0;
    },
    ClearColors : function Game_ColorCycle$ClearColors() {
        this.mCycleColors.clear();
        this.mCyclePos = 0;
    },
    PushColor : function Game_ColorCycle$PushColor(theColor) {
        this.mCycleColors.push(theColor);
    }
}
Game.ColorCycle.staticInit = function Game_ColorCycle$staticInit() {
    Game.ColorCycle.gCycleColors = Array.Create(6, null, 0xffff0000, 0xffffff00, 0xff00ff00, 0xff00ffff, 0xff0000ff, 0xffff00ff);
}

JSFExt_AddInitFunc(function() {
    Game.ColorCycle.registerClass('Game.ColorCycle', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.ColorCycle.staticInit();
});