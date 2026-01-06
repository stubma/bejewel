Game.HyperAnimSequence = function Game_HyperAnimSequence() {
    this.mGemHitFrame = Array.Create2D(Game.Board.NUM_ROWS, Game.Board.NUM_COLS, 0);
    this.mFrameCount = 0;
    this.mLightCount = 0;
    this.mCamera = null;
    this.mBoard = null;
};
Game.HyperAnimSequence.EulerInterpolate = function Game_HyperAnimSequence$EulerInterpolate(from, to, u) {
    var diff = (to - from) % (Math.PI * 2);
    if (diff < 0) {
        diff = Math.PI * 2 + diff;
    }
    if (diff > Math.PI) {
        diff = -1.0 * (Math.PI * 2 - diff);
    }
    var angle = (from + diff * u) % (Math.PI * 2);
    if (angle < 0) {
        angle = Math.PI * 2 + angle;
    }
    return angle;
};
Game.HyperAnimSequence.prototype = {
    mFrameCount: 0,
    mLightCount: 0,
    mGemHitFrame: null,
    mCamera: null,
    mBoard: null,
    mGems: null,
    mLights: null,
    mTickF: 0,
    GetCurFrame: function Game_HyperAnimSequence$GetCurFrame() {
        return this.mTickF | 0;
    },
    IsComplete: function Game_HyperAnimSequence$IsComplete() {
        return this.mTickF >= this.mFrameCount - 1.01;
    },
    GetGemHitFrame: function Game_HyperAnimSequence$GetGemHitFrame(row, col) {
        return this.mGemHitFrame[this.mGemHitFrame.mIdxMult0 * row + col];
    },
    Reset: function Game_HyperAnimSequence$Reset() {
        this.mTickF = 0;
    },
    Tick: function Game_HyperAnimSequence$Tick() {
        this.mTickF += 1.67 / 2.0;
        var aMaxTickF = this.mFrameCount - 1.01;
        if (this.mTickF >= aMaxTickF) {
            this.mTickF = aMaxTickF;
        }
    },
    GetGemPos: function Game_HyperAnimSequence$GetGemPos(row, col) {
        var aFrame = this.mTickF | 0;
        var a = this.mTickF - aFrame;
        var oma = 1.0 - a;
        return new GameFramework.geom.Vector3(
            this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame].mPos.x * oma +
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame + 1].mPos.x * a,
            this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame].mPos.y * oma +
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame + 1].mPos.y * a,
            this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame].mPos.z * oma +
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame + 1].mPos.z * a
        );
    },
    GetGemRot: function Game_HyperAnimSequence$GetGemRot(row, col) {
        var aFrame = this.mTickF | 0;
        var a = this.mTickF - aFrame;
        return new GameFramework.geom.Vector3(
            Game.HyperAnimSequence.EulerInterpolate(
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame].mRot.x,
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame + 1].mRot.x,
                a
            ),
            Game.HyperAnimSequence.EulerInterpolate(
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame].mRot.y,
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame + 1].mRot.y,
                a
            ),
            Game.HyperAnimSequence.EulerInterpolate(
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame].mRot.z,
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame + 1].mRot.z,
                a
            )
        );
    },
    GetGemScale: function Game_HyperAnimSequence$GetGemScale(row, col) {
        var aFrame = this.mTickF | 0;
        var a = this.mTickF - aFrame;
        var oma = 1.0 - a;
        return new GameFramework.geom.Vector3(
            this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame].mScale.x * oma +
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame + 1].mScale.x * a,
            this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame].mScale.y * oma +
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame + 1].mScale.y * a,
            this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame].mScale.z * oma +
                this.mGems[this.mGems.mIdxMult0 * row + this.mGems.mIdxMult1 * col + aFrame + 1].mScale.z * a
        );
    },
    GetBoardPos: function Game_HyperAnimSequence$GetBoardPos() {
        var aFrame = this.mTickF | 0;
        var a = this.mTickF - aFrame;
        var oma = 1.0 - a;
        return new GameFramework.geom.Vector3(
            this.mBoard[aFrame].mPos.x * oma + this.mBoard[aFrame + 1].mPos.x * a,
            this.mBoard[aFrame].mPos.y * oma + this.mBoard[aFrame + 1].mPos.y * a,
            this.mBoard[aFrame].mPos.z * oma + this.mBoard[aFrame + 1].mPos.z * a
        );
    },
    GetBoardRot: function Game_HyperAnimSequence$GetBoardRot() {
        var aFrame = this.mTickF | 0;
        var a = this.mTickF - aFrame;
        return new GameFramework.geom.Vector3(
            Game.HyperAnimSequence.EulerInterpolate(this.mBoard[aFrame].mRot.x, this.mBoard[aFrame + 1].mRot.x, a),
            Game.HyperAnimSequence.EulerInterpolate(this.mBoard[aFrame].mRot.y, this.mBoard[aFrame + 1].mRot.y, a),
            Game.HyperAnimSequence.EulerInterpolate(this.mBoard[aFrame].mRot.z, this.mBoard[aFrame + 1].mRot.z, a)
        );
    },
    GetBoardScale: function Game_HyperAnimSequence$GetBoardScale() {
        var aFrame = this.mTickF | 0;
        var a = this.mTickF - aFrame;
        var oma = 1.0 - a;
        return new GameFramework.geom.Vector3(
            this.mBoard[aFrame].mScale.x * oma + this.mBoard[aFrame + 1].mScale.x * a,
            this.mBoard[aFrame].mScale.y * oma + this.mBoard[aFrame + 1].mScale.y * a,
            this.mBoard[aFrame].mScale.z * oma + this.mBoard[aFrame + 1].mScale.z * a
        );
    },
    GetCameraPos: function Game_HyperAnimSequence$GetCameraPos() {
        var aFrame = this.mTickF | 0;
        var a = this.mTickF - aFrame;
        var oma = 1.0 - a;
        return new GameFramework.geom.Vector3(
            this.mCamera[aFrame].mPos.x * oma + this.mCamera[aFrame + 1].mPos.x * a,
            this.mCamera[aFrame].mPos.y * oma + this.mCamera[aFrame + 1].mPos.y * a,
            this.mCamera[aFrame].mPos.z * oma + this.mCamera[aFrame + 1].mPos.z * a
        );
    },
    GetCameraRot: function Game_HyperAnimSequence$GetCameraRot() {
        var aFrame = this.mTickF | 0;
        var a = this.mTickF - aFrame;
        return new GameFramework.geom.Vector3(
            Game.HyperAnimSequence.EulerInterpolate(this.mCamera[aFrame].mRot.x, this.mCamera[aFrame + 1].mRot.x, a),
            Game.HyperAnimSequence.EulerInterpolate(this.mCamera[aFrame].mRot.y, this.mCamera[aFrame + 1].mRot.y, a),
            Game.HyperAnimSequence.EulerInterpolate(this.mCamera[aFrame].mRot.z, this.mCamera[aFrame + 1].mRot.z, a)
        );
    },
    GetCameraScale: function Game_HyperAnimSequence$GetCameraScale() {
        var aFrame = this.mTickF | 0;
        var a = this.mTickF - aFrame;
        var oma = 1.0 - a;
        return new GameFramework.geom.Vector3(
            this.mCamera[aFrame].mScale.x * oma + this.mCamera[aFrame + 1].mScale.x * a,
            this.mCamera[aFrame].mScale.y * oma + this.mCamera[aFrame + 1].mScale.y * a,
            this.mCamera[aFrame].mScale.z * oma + this.mCamera[aFrame + 1].mScale.z * a
        );
    },
};
Game.HyperAnimSequence.staticInit = function Game_HyperAnimSequence$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.HyperAnimSequence.registerClass("Game.HyperAnimSequence", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.HyperAnimSequence.staticInit();
});
