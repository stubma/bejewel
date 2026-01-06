Game.Util = function Game_Util() {};
Game.Util.Rand = function Game_Util$Rand() {
    return Game.Util.gRand.Next() | 0;
};
Game.Util.ReverseIntVector = function Game_Util$ReverseIntVector(theVec) {
    for (var i = 0; i < ((theVec.length / 2) | 0); ++i) {
        var t = theVec[i];
        var swapIdx = theVec.length - 1 - i;
        theVec[i] = theVec[swapIdx];
        theVec[swapIdx] = t;
    }
};
Game.Util.RandWithin = function Game_Util$RandWithin(theMax) {
    return (Game.Util.gRand.Next() | 0) % theMax;
};
Game.Util.DbgDrawCenter = function Game_Util$DbgDrawCenter(g, theRes, theIsWidescreenSrc) {
    Game.Util.DbgDrawMarker(
        g,
        (theIsWidescreenSrc ? -160 : 0) + Game.Util.ImgCXOfs(theRes),
        Game.Util.ImgCYOfs(theRes)
    );
};
Game.Util.DbgDrawMarker = function Game_Util$DbgDrawMarker(g, x, y) {
    var _t1 = g.PushColor(0x0);
    try {
        g.FillRect(x - 12, y - 12, 24, 24);
    } finally {
        _t1.Dispose();
    }
    var _t2 = g.PushColor(0xffff0000);
    try {
        g.FillRect(x - 8, y - 8, 16, 16);
    } finally {
        _t2.Dispose();
    }
    var _t3 = g.PushColor(0xffffffff);
    try {
        g.FillRect(x - 4, y - 4, 8, 8);
    } finally {
        _t3.Dispose();
    }
};
Game.Util.ImgCXOfs = function Game_Util$ImgCXOfs(theRes) {
    return theRes.mOffsetX + ((theRes.mWidth / 2) | 0);
};
Game.Util.ImgCYOfs = function Game_Util$ImgCYOfs(theRes) {
    return theRes.mOffsetY + ((theRes.mHeight / 2) | 0);
};
Game.Util.ControlKey = function Game_Util$ControlKey(theKey) {
    return (GameFramework.Utils.GetCharCode(theKey) - 65 + 1) | 0;
};
Game.Util.DrawImageStretched = function Game_Util$DrawImageStretched(
    g,
    theImg,
    theNewWidth,
    theNewHeight,
    theX,
    theY,
    theDrawCentered
) {
    var m = new GameFramework.geom.Matrix();
    if (theDrawCentered) {
        m.translate(0 - ((theImg.mWidth / 2) | 0), 0 - ((theImg.mHeight / 2) | 0));
    }
    m.scale(theNewWidth / theImg.mWidth, theNewHeight / theImg.mHeight);
    var _t4 = g.PushMatrix(m);
    try {
        g.DrawImage(theImg, theX, theY);
    } finally {
        _t4.Dispose();
    }
};
Game.Util.DrawImageMatrix = function Game_Util$DrawImageMatrix(g, theImg, theMatrix) {
    g.PushMatrix(theMatrix);
    g.DrawImage(theImg.get_CenteredImage(), 0.0, 0.0);
    g.PopMatrix();
};
Game.Util.DrawImageMatrixT = function Game_Util$DrawImageMatrixT(g, theImg, theMatrix, theX, theY) {
    theMatrix.tx += theX;
    theMatrix.ty += theY;
    g.PushMatrix(theMatrix);
    g.DrawImage(theImg.get_CenteredImage(), 0, 0);
    g.PopMatrix();
    theMatrix.tx -= theX;
    theMatrix.ty -= theY;
};
Game.Util.DrawImageSRT = function Game_Util$DrawImageSRT(g, theImg, theScale, theRot, theX, theY) {
    var m = new GameFramework.geom.Matrix();
    m.rotate(theRot);
    m.scale(theScale, theScale);
    m.translate(theX, theY);
    g.PushMatrix(m);
    g.DrawImage(theImg, 0.0, 0.0);
    g.PopMatrix();
};
Game.Util.DrawImageRT = function Game_Util$DrawImageRT(g, theImg, theRot, theX, theY) {
    var m = new GameFramework.geom.Matrix();
    m.rotate(theRot);
    m.translate(theX, theY);
    g.PushMatrix(m);
    g.DrawImage(theImg, 0.0, 0.0);
    g.PopMatrix();
};
Game.Util.DrawImageR = function Game_Util$DrawImageR(g, theImg, theRot) {
    var m = new GameFramework.geom.Matrix();
    m.rotate(theRot);
    g.PushMatrix(m);
    g.DrawImage(theImg, 0.0, 0.0);
    g.PopMatrix();
};
Game.Util.DrawImageAtDef = function Game_Util$DrawImageAtDef(g, theImg, theIsAdditive) {
    theImg.mAdditive = theIsAdditive;
    g.DrawImage(theImg, theImg.mOffsetX, theImg.mOffsetY);
    theImg.mAdditive = false;
};
Game.Util.DrawImageAtDefXY = function Game_Util$DrawImageAtDefXY(g, theImg, theOffsetX, theOffsetY, theIsAdditive) {
    theImg.mAdditive = theIsAdditive;
    g.DrawImage(theImg, theImg.mOffsetX + theOffsetX, theImg.mOffsetY + theOffsetY);
    theImg.mAdditive = false;
};
Game.Util.DrawImageCentered = function Game_Util$DrawImageCentered(g, theImg, theOffsetX, theOffsetY) {
    g.DrawImage(theImg, theOffsetX - theImg.mWidth / 2.0, theOffsetY - theImg.mHeight / 2.0);
};
Game.Util.ShuffleIntArr = function Game_Util$ShuffleIntArr(theVec) {
    for (var i = theVec.length - 1; i >= 1; --i) {
        var j = (Game.Util.gRand.Next() | 0) % i;
        var t = theVec[i];
        theVec[i] = theVec[j];
        theVec[j] = t;
    }
};
Game.Util.RGBToHSL = function Game_Util$RGBToHSL(r, g, b) {
    var maxval = Math.max(r, Math.max(g, b)) | 0 | 0;
    var minval = Math.min(r, Math.min(g, b)) | 0 | 0;
    var hue = 0;
    var saturation = 0;
    var luminosity = ((minval + maxval) / 2) | 0;
    var delta = maxval - minval;
    if (delta != 0) {
        saturation = ((delta * 256) / (luminosity <= 128 ? minval + maxval : 512 - maxval - minval)) | 0;
        if (r == maxval) {
            hue =
                g == minval ? 1280 + ((((maxval - b) * 256) / delta) | 0) : 256 - ((((maxval - g) * 256) / delta) | 0);
        } else if (g == maxval) {
            hue = b == minval ? 256 + ((((maxval - r) * 256) / delta) | 0) : 768 - ((((maxval - b) * 256) / delta) | 0);
        } else {
            hue =
                r == minval ? 768 + ((((maxval - g) * 256) / delta) | 0) : 1280 - ((((maxval - r) * 256) / delta) | 0);
        }
        hue = (hue / 6) | 0;
    }
    return 0xff000000 | hue | (saturation << 8) | (luminosity << 16);
};
Game.Util.HSLToRGB = function Game_Util$HSLToRGB(h, s, l) {
    var r;
    var g;
    var b;
    var v = l < 128 ? ((l * (255 + s)) / 255) | 0 : l + s - (((l * s) / 255) | 0);
    var y = (2 * l - v) | 0;
    var aColorDiv = ((6 * h) / 256) | 0;
    var x = (y + ((v - y) * ((h - (((aColorDiv * 256) / 6) | 0)) * 6)) / 255) | 0;
    if (x > 255) {
        x = 255;
    }
    var z = (v - ((v - y) * ((h - (((aColorDiv * 256) / 6) | 0)) * 6)) / 255) | 0;
    if (z < 0) {
        z = 0;
    }
    switch (aColorDiv) {
        case 0: {
            r = v | 0;
            g = x | 0;
            b = y | 0;
            break;
        }
        case 1: {
            r = z | 0;
            g = v | 0;
            b = y | 0;
            break;
        }
        case 2: {
            r = y | 0;
            g = v | 0;
            b = x | 0;
            break;
        }
        case 3: {
            r = y | 0;
            g = z | 0;
            b = v | 0;
            break;
        }
        case 4: {
            r = x | 0;
            g = y | 0;
            b = v | 0;
            break;
        }
        case 5: {
            r = v | 0;
            g = y | 0;
            b = z | 0;
            break;
        }
        default: {
            r = v | 0;
            g = x | 0;
            b = y | 0;
            break;
        }
    }
    return 0xff000000 | (r << 16) | (g << 8) | b;
};
Game.Util.TicksToString = function Game_Util$TicksToString(theTicks) {
    theTicks = (theTicks / 60) | 0;
    var sec = theTicks % 60;
    theTicks = (theTicks / 60) | 0;
    var min = theTicks % 60;
    var hours = ((theTicks / 60) | 0) % 24;
    var days = (((theTicks / 60) | 0) / 24) | 0;
    if (days > 0) {
        return String.format("{0} days {1:00} hours {2:00} min {3:00} sec", days, hours, min, sec);
    } else if (hours > 0) {
        return String.format("{0:00} hours {1:00} min {2:00} sec", hours, min, sec);
    } else if (min > 0) {
        return String.format("{0:00} min {1:00} sec", min, sec);
    } else {
        return String.format("{0:00} sec", sec);
    }
};
Game.Util.SplitStr = function Game_Util$SplitStr(i_str, outVals, theType) {
    Game.Util.SplitStrEx(i_str, outVals, theType, 44, false, -1);
};
Game.Util.SplitStrEx = function Game_Util$SplitStrEx(
    i_str,
    outVals,
    theType,
    theSplitChar,
    theTrimLeadingWhitespace,
    theMaxEntries
) {
    if (i_str.length == 0) {
        return;
    }
    var idx = 0;
    var oldIdx = 0;
    var count = 0;
    while (true) {
        var lastEntry = theMaxEntries != -1 && count + 1 == theMaxEntries;
        idx = lastEntry ? -1 : i_str.indexOf(String.fromCharCode(theSplitChar), oldIdx);
        var done = idx == -1;
        if (done) {
            idx = i_str.length;
        }
        if (theTrimLeadingWhitespace) {
            while (oldIdx < idx && GameFramework.Utils.IsWhitespaceAt(i_str, oldIdx)) {
                ++oldIdx;
            }
        }
        switch (theType) {
            case Game.Util.ESplitStrType.TVector_STRING: {
                var aStrVec = Type.safeCast(outVals, GameFramework.TVector);
                aStrVec.push(i_str.substr(oldIdx, idx - oldIdx));
                break;
            }
            case Game.Util.ESplitStrType.TIntVector: {
                outVals.push(GameFramework.Utils.ToInt(i_str.substr(oldIdx, idx - oldIdx)));
                break;
            }
            case Game.Util.ESplitStrType.TVector_FLOAT: {
                var aNumVec = Type.safeCast(outVals, GameFramework.TVector);
                aNumVec.push(GameFramework.Utils.ToFloat(i_str.substr(oldIdx, idx - oldIdx)));
                break;
            }
        }
        ++count;
        if (done || lastEntry) {
            break;
        }
        oldIdx = idx + 1;
    }
};
Game.Util.CheckGraphicsState = function Game_Util$CheckGraphicsState(g) {
    var m = new Game.CheckMatrixInfo();
    m.mMatrixDepth = g.mMatrixDepth;
    m.mColorDepth = g.mColorVector.length;
    m.mGraphics = g;
    m.mProxy = new GameFramework.misc.DisposeProxy(ss.Delegate.create(this, Game.Util.CheckGraphicsStatePop));
    Game.Util.mAutoPopCheckMatrix.push(m);
    return m.mProxy;
};
Game.Util.CheckGraphicsStatePop = function Game_Util$CheckGraphicsStatePop() {
    JS_Assert(
        Game.Util.mAutoPopCheckMatrix[Game.Util.mAutoPopCheckMatrix.length - 1].mMatrixDepth ==
            Game.Util.mAutoPopCheckMatrix[Game.Util.mAutoPopCheckMatrix.length - 1].mGraphics.mMatrixDepth,
        "CheckGraphicsState MATRIX calls not aligned (check push/pop calls)"
    );
    JS_Assert(
        Game.Util.mAutoPopCheckMatrix[Game.Util.mAutoPopCheckMatrix.length - 1].mColorDepth ==
            Game.Util.mAutoPopCheckMatrix[Game.Util.mAutoPopCheckMatrix.length - 1].mGraphics.mColorVector.length,
        "CheckGraphicsState COLOR calls not aligned (check push/pop calls)"
    );
};
Game.Util.prototype = {
    GetAlphaFromColorInt: function Game_Util$GetAlphaFromColorInt(theColorInt) {
        return (theColorInt >>> 24) & 0xff;
    },
    ModAlphaOnColorInt: function Game_Util$ModAlphaOnColorInt(theColorInt, theAlpha) {
        return ((theAlpha & 0xff) << 24) | (theColorInt & 0xffffff);
    },
};
Game.Util.staticInit = function Game_Util$staticInit() {
    Game.Util.mAutoPopCheckMatrix = [];
    Game.Util.gRand = new Game.MTRand();
};

JSFExt_AddInitFunc(function () {
    Game.Util.registerClass("Game.Util", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.Util.staticInit();
});
Game.Util.ESplitStrType = {};
Game.Util.ESplitStrType.staticInit = function Game_Util_ESplitStrType$staticInit() {
    Game.Util.ESplitStrType.TIntVector = 0;
    Game.Util.ESplitStrType.TVector_STRING = 1;
    Game.Util.ESplitStrType.TVector_FLOAT = 2;
};
JSFExt_AddInitFunc(function () {
    Game.Util.ESplitStrType.staticInit();
});
