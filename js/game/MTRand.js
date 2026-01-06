Game.MTRand = function Game_MTRand() {
    this.mt = Array.Create(Game.MTRand.gMtRandN, null);
    this.NextNoAssert_mag01 = Array.Create(2, null, 0x0, Game.MTRand.MATRIX_A);
    this.SRand(4357);
};
Game.MTRand.SetRandAllowed = function Game_MTRand$SetRandAllowed(allowed) {
    if (allowed) {
        if (Game.MTRand.gRandAllowed > 0) {
            Game.MTRand.gRandAllowed--;
        } else {
        }
    } else {
        Game.MTRand.gRandAllowed++;
    }
};
Game.MTRand.prototype = {
    mt: null,
    mti: 0,
    NextNoAssert_mag01: null,
    SRandStr: function Game_MTRand$SRandStr(theSerialData) {
        if (theSerialData.length == Game.MTRand.gMtRandN * 4 + 4) {
        } else {
            this.SRand(4357);
        }
    },
    SRand: function Game_MTRand$SRand(seed) {
        if (seed == 0) {
            seed = 4357;
        }
        //JS
        this.mt[0] = seed & 0xffffffff;
        for (this.mti = 1; this.mti < Game.MTRand.gMtRandN; this.mti++) {
            var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] =
                ((((1812433253 * ((s & 0xffff0000) >>> 16)) << 16) + 1812433253 * (s & 0x0000ffff) + this.mti) &
                    0xffffffff) >>>
                0;
        }
        return;
        //-JS
        this.mt[0] = seed & 0xffffffff;
        for (this.mti = 1; this.mti < Game.MTRand.gMtRandN; this.mti++) {
            this.mt[this.mti] = 1812433253 * (this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)) + (this.mti | 0);
            this.mt[this.mti] &= 0xffffffff;
        }
    },
    NextNoAssert: function Game_MTRand$NextNoAssert() {
        var y;
        if (this.mti >= Game.MTRand.gMtRandN) {
            var kk;
            for (kk = 0; kk < Game.MTRand.gMtRandN - Game.MTRand.MTRAND_M; kk++) {
                y = (this.mt[kk] & Game.MTRand.UPPER_MASK) | (this.mt[kk + 1] & Game.MTRand.LOWER_MASK);
                this.mt[kk] = this.mt[kk + Game.MTRand.MTRAND_M] ^ (y >>> 1) ^ this.NextNoAssert_mag01[y & 0x1];
            }
            for (; kk < Game.MTRand.gMtRandN - 1; kk++) {
                y = (this.mt[kk] & Game.MTRand.UPPER_MASK) | (this.mt[kk + 1] & Game.MTRand.LOWER_MASK);
                this.mt[kk] =
                    this.mt[kk + (Game.MTRand.MTRAND_M - Game.MTRand.gMtRandN)] ^
                    (y >>> 1) ^
                    this.NextNoAssert_mag01[y & 0x1];
            }
            y = (this.mt[Game.MTRand.gMtRandN - 1] & Game.MTRand.UPPER_MASK) | (this.mt[0] & Game.MTRand.LOWER_MASK);
            this.mt[Game.MTRand.gMtRandN - 1] =
                this.mt[Game.MTRand.MTRAND_M - 1] ^ (y >>> 1) ^ this.NextNoAssert_mag01[y & 0x1];
            this.mti = 0;
        }
        y = this.mt[this.mti++];
        y ^= y >>> 11;
        y ^= (y << 7) & Game.MTRand.TEMPERING_MASK_B;
        y ^= (y << 15) & Game.MTRand.TEMPERING_MASK_C;
        y ^= y >>> 18;
        y &= 0x7fffffff;
        return y;
    },
    Next: function Game_MTRand$Next() {
        JS_Assert(Game.MTRand.gRandAllowed == 0);
        return this.NextNoAssert();
    },
    NextInt: function Game_MTRand$NextInt() {
        JS_Assert(Game.MTRand.gRandAllowed == 0);
        return this.NextNoAssert() | 0;
    },
    NextNoAssertRange: function Game_MTRand$NextNoAssertRange(range) {
        return this.NextNoAssert() % range;
    },
    NextRange: function Game_MTRand$NextRange(range) {
        JS_Assert(Game.MTRand.gRandAllowed == 0);
        return this.NextNoAssertRange(range);
    },
    NextNoAssertRangeF: function Game_MTRand$NextNoAssertRangeF(range) {
        return (this.NextNoAssert() / 0x7fffffff) * range;
    },
    NextF: function Game_MTRand$NextF(range) {
        JS_Assert(Game.MTRand.gRandAllowed == 0);
        return this.NextNoAssertRangeF(range);
    },
    Serialize: function Game_MTRand$Serialize() {
        var aString = "";
        return aString;
    },
};
Game.MTRand.staticInit = function Game_MTRand$staticInit() {
    Game.MTRand.gMtRandN = 624;
    Game.MTRand.MTRAND_M = 397;
    Game.MTRand.MATRIX_A = 0x9908b0df;
    Game.MTRand.UPPER_MASK = 0x80000000;
    Game.MTRand.LOWER_MASK = 0x7fffffff;
    Game.MTRand.TEMPERING_MASK_B = 0x9d2c5680;
    Game.MTRand.TEMPERING_MASK_C = 0xefc60000;
    Game.MTRand.gRandAllowed = 0;
};

JSFExt_AddInitFunc(function () {
    Game.MTRand.registerClass("Game.MTRand", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.MTRand.staticInit();
});
