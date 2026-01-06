GameFramework.Utils = function GameFramework_Utils() {};
GameFramework.Utils.ToInt = function GameFramework_Utils$ToInt(theString) {
    //JS
    return theString | 0;
    //-JS
};
GameFramework.Utils.ToDouble = function GameFramework_Utils$ToDouble(theString) {
    //JS
    return Number(theString);
    //-JS
};
GameFramework.Utils.ToFloat = function GameFramework_Utils$ToFloat(theObject) {
    //JS
    return Number(theObject);
    //-JS
};
GameFramework.Utils.ToBool = function GameFramework_Utils$ToBool(theString) {
    return (
        theString != null &&
        theString != "0" &&
        theString != "no" &&
        theString != "off" &&
        theString != "false" &&
        theString.length > 0
    );
};
GameFramework.Utils.CharToUpper = function GameFramework_Utils$CharToUpper(theValue) {
    //JS
    return String.fromCharCode(theValue, 1).toUpperCase().charCodeAt(0);
    //-JS
};
GameFramework.Utils.CharToLower = function GameFramework_Utils$CharToLower(theValue) {
    //JS
    return String.fromCharCode(theValue).toLowerCase().charCodeAt(0);
    //-JS
};
GameFramework.Utils.ToUpper = function GameFramework_Utils$ToUpper(theValue) {
    //JS
    return theValue.toUpperCase();
    //-JS
};
GameFramework.Utils.ToString = function GameFramework_Utils$ToString(theValue) {
    //JS
    return theValue.toString();
    //-JS
};
GameFramework.Utils.CommaSeperate = function GameFramework_Utils$CommaSeperate(value) {
    var delimeter = ",";
    var str = "";
    var front = GameFramework.Utils.ToString(value);
    while (front.length > 3) {
        str = delimeter + front.substr(front.length - 3, 3) + str;
        front = front.substr(0, front.length - 3);
    }
    str = front + str;
    return str;
};
GameFramework.Utils.ReplaceChars = function GameFramework_Utils$ReplaceChars(
    theOrigString,
    theFindString,
    theReplaceString
) {
    var aNewString = theOrigString;
    aNewString.replaceAll(theFindString, theReplaceString);
    return aNewString;
};
GameFramework.Utils.adjustBrightness = function GameFramework_Utils$adjustBrightness(rgb, brite) {
    return rgb;
};
GameFramework.Utils.adjustBrightness2 = function GameFramework_Utils$adjustBrightness2(rgb, brite) {
    return rgb;
};
GameFramework.Utils.GetRandFloatU = function GameFramework_Utils$GetRandFloatU() {
    //JS
    return Math.random();
    //-JS
};
GameFramework.Utils.GetRandFloat = function GameFramework_Utils$GetRandFloat() {
    //JS
    return (Math.random() - 0.5) * 2.0;
    //-JS
};
GameFramework.Utils.GetRand = function GameFramework_Utils$GetRand() {
    //JS
    return (Math.random() * 0x7fffffff) | 0;
    //-JS
};
GameFramework.Utils.GetArrayObject = function GameFramework_Utils$GetArrayObject(theArray) {
    var anArray = [];

    {
        var $srcArray1 = theArray;
        for (var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
            var anObject = $srcArray1[$enum1];
            anArray.push(anObject);
        }
    }
    return anArray;
};
GameFramework.Utils.IsDictionaryEmpty = function GameFramework_Utils$IsDictionaryEmpty(theDict) {
    {
        for ($enum2 in theDict) {
            var aVal = theDict[$enum2];
            return true;
        }
    }
    return false;
};
GameFramework.Utils.IsIntDictionaryEmpty = function GameFramework_Utils$IsIntDictionaryEmpty(theDict) {
    {
        var $enum3 = ss.IEnumerator.getEnumerator(theDict);
        while ($enum3.moveNext()) {
            var aVal = $enum3.get_current();
            return true;
        }
    }
    return false;
};
GameFramework.Utils.UTF8ToString = function GameFramework_Utils$UTF8ToString(theString) {
    //JS
    return "";
    //-JS
};
GameFramework.Utils.StringToUTF8 = function GameFramework_Utils$StringToUTF8(theString) {
    //JS
    return "";
    //-JS
};
GameFramework.Utils.ByteArrayToASCII = function GameFramework_Utils$ByteArrayToASCII(theArray, theLength) {
    //JS
    return "";
    //-JS
};
GameFramework.Utils.ByteArrayToUTF8 = function GameFramework_Utils$ByteArrayToUTF8(theArray, theLength) {
    //JS
    return "";
    //-JS
};
GameFramework.Utils.StringFromCharCode = function GameFramework_Utils$StringFromCharCode(theCharCode) {
    return String.fromCharCode(theCharCode | 0);
};
GameFramework.Utils.GetCharCode = function GameFramework_Utils$GetCharCode(theChar) {
    //JS
    return theChar;
    //-JS
};
GameFramework.Utils.GetCharCodeAt = function GameFramework_Utils$GetCharCodeAt(theString, theIdx) {
    //JS
    return theString.charCodeAt(theIdx);
    //-JS
};
GameFramework.Utils.GetCharAt = function GameFramework_Utils$GetCharAt(theString, theIdx) {
    //JS
    return theString.charCodeAt(theIdx);
    //-JS
};
GameFramework.Utils.StringReplaceChar = function GameFramework_Utils$StringReplaceChar(
    theString,
    theFindChar,
    theReplaceChar
) {
    return theString.replaceAll(String.fromCharCode(theFindChar), String.fromCharCode(theReplaceChar));
};
GameFramework.Utils.IsWhitespace = function GameFramework_Utils$IsWhitespace(theChar) {
    //JS
    return theChar == " " || theChar == "\t" || theChar == "\r" || theChar == "\n";
    //-JS
};
GameFramework.Utils.IsDigit = function GameFramework_Utils$IsDigit(theChar) {
    //JS
    return theChar >= "0" && theChar <= "9";
    //-JS
};
GameFramework.Utils.IsWhitespaceAt = function GameFramework_Utils$IsWhitespaceAt(theString, theIdx) {
    //JS
    var aCharCode = theString.charCodeAt(theIdx);
    return aCharCode == 32 || aCharCode == 9 || aCharCode == 10 || aCharCode == 13;
    //-JS
};
GameFramework.Utils.IsLetterAt = function GameFramework_Utils$IsLetterAt(theString, theIdx) {
    //JS
    var aCharCode = theString.charCodeAt(theIdx);
    return (aCharCode >= 65 && aCharCode <= 90) || (aCharCode >= 97 && aCharCode <= 122);
    //-JS
};
GameFramework.Utils.IsDigitAt = function GameFramework_Utils$IsDigitAt(theString, theIdx) {
    /*CS!
	 return GameFramework.Utils.IsDigit(theString.charCodeAt(theIdx));
	 -CS*/
    //JS
    var aCharCode = theString.charCodeAt(theIdx);
    return aCharCode >= 48 && aCharCode <= 57;
    //-JS
};
GameFramework.Utils.SortIntVector = function GameFramework_Utils$SortIntVector(theIntVector) {
    //JS
    theIntVector.sort(function (a, b) {
        return a - b;
    });
    //-JS
};
GameFramework.Utils.CreateIntMapSortVector = function GameFramework_Utils$CreateIntMapSortVector(
    theIntMap,
    theCompareCallback
) {
    var anIntVector = [];

    {
        for (aKey in theIntMap) {
            anIntVector.push(aKey);
        }
    }
    anIntVector.mCSList.Sort$2(new GameFramework.misc.TMapSorter(theIntMap, theCompareCallback));
    return anIntVector;
};
GameFramework.Utils.CreateMapSortVector = function GameFramework_Utils$CreateMapSortVector(theMap, theCompareCallback) {
    var aStringVector = [];

    {
        for (aKey in theMap) {
            aStringVector.push(aKey);
        }
    }
    aStringVector.mCSList.Sort$2(new GameFramework.misc.TMapSorter(theMap, theCompareCallback));
    return aStringVector;
};
GameFramework.Utils.StrFormat = function GameFramework_Utils$StrFormat(str, $theParams) {
    var aNewString = str;
    for (var i = 0; i < aNewString.length; i++) {
        if (aNewString.charCodeAt(i) == 123) {
            var anEnd;
            for (anEnd = i + 1; anEnd < aNewString.length; anEnd++) {
                if (aNewString.charCodeAt(anEnd) == 125) {
                    break;
                }
            }
            var anIdx = aNewString.charCodeAt(i + 1) - 48;
            var aReplaceStr = "?";
            var aParam = arguments[anIdx + 1];
            if (Type.tryCast(aParam, Number)) {
                aReplaceStr = "" + (aParam | 0);
            } else if (Type.tryCast(aParam, Number)) {
                aReplaceStr = "" + (aParam | 0 | 0);
            } else if (Type.tryCast(aParam, Number)) {
                aReplaceStr = "" + aParam;
            } else if (Type.tryCast(aParam, Number)) {
                aReplaceStr = "" + aParam;
            } else if (Type.tryCast(aParam, String)) {
                aReplaceStr = aParam;
            }
            var aFormatString = aNewString.substr(i + 2, anEnd - i - 2);
            if (aFormatString == ":00") {
                if (aReplaceStr.length == 1) {
                    aReplaceStr = "0" + aReplaceStr;
                }
            }
            if (aFormatString.startsWith(":0.") && aFormatString.endsWith("#")) {
                var aDotPos = aReplaceStr.indexOf(String.fromCharCode(46));
                var aTrimLen = aReplaceStr.length - aDotPos - (aFormatString.length - 2);
                if (aTrimLen > 0) {
                    aReplaceStr = aReplaceStr.substr(0, aReplaceStr.length - aTrimLen);
                }
            }
            if (anEnd < aNewString.length - 1) {
                aNewString = aNewString.substr(0, i) + aReplaceStr + aNewString.substr(anEnd + 1);
            } else {
                aNewString = aNewString.substr(0, i) + aReplaceStr;
            }
            i += aReplaceStr.length - 1;
        }
    }
    return aNewString;
};
GameFramework.Utils.StrRemove = function GameFramework_Utils$StrRemove(str, theStart, theLength) {
    if (theLength === undefined) {
        theLength = 1;
    }
    if (theStart + theLength >= str.length) {
        return str.substr(0, theStart);
    }
    return str.substr(0, theStart) + str.substr(theStart + theLength);
};
GameFramework.Utils.StrStartsWith = function GameFramework_Utils$StrStartsWith(theString, theCheck) {
    if (theString.length < theCheck.length) {
        return false;
    }
    return theString.substr(0, theCheck.length) == theCheck;
};
GameFramework.Utils.StrEndsWith = function GameFramework_Utils$StrEndsWith(theString, theCheck) {
    if (theString.length < theCheck.length) {
        return false;
    }
    return theString.substr(theString.length - theCheck.length) == theCheck;
};
GameFramework.Utils.StrTrimStart = function GameFramework_Utils$StrTrimStart(theString) {
    var aCheckIdx = 0;
    while (true) {
        if (aCheckIdx >= theString.length) {
            return "";
        }
        if (!GameFramework.Utils.IsWhitespaceAt(theString, aCheckIdx)) {
            break;
        }
        aCheckIdx++;
    }
    return theString.substr(aCheckIdx);
};
GameFramework.Utils.StrTrimEnd = function GameFramework_Utils$StrTrimEnd(theString) {
    var aCheckIdx = theString.length - 1;
    while (true) {
        if (aCheckIdx < 0) {
            return "";
        }
        if (!GameFramework.Utils.IsWhitespaceAt(theString, aCheckIdx)) {
            break;
        }
        aCheckIdx--;
    }
    return theString.substr(0, aCheckIdx + 1);
};
GameFramework.Utils.StrTrim = function GameFramework_Utils$StrTrim(theString) {
    return GameFramework.Utils.StrTrimStart(GameFramework.Utils.StrTrimEnd(theString));
};
GameFramework.Utils.Trace = function GameFramework_Utils$Trace(theString) {};
GameFramework.Utils.Log = function GameFramework_Utils$Log(theData, theParam) {
    if (theParam === undefined) {
        theParam = null;
    }
    if (theParam == null) {
        GameFramework.Utils.mLog.push(
            Array.Create(
                2,
                null,
                new GameFramework.misc.KeyVal("Time", GameFramework.Utils.GetUnixTime()),
                new GameFramework.misc.KeyVal("Data", theData)
            )
        );
    } else {
        GameFramework.Utils.mLog.push(
            Array.Create(
                3,
                null,
                new GameFramework.misc.KeyVal("Time", GameFramework.Utils.GetUnixTime()),
                new GameFramework.misc.KeyVal("Data", theData),
                new GameFramework.misc.KeyVal("Param", theParam)
            )
        );
    }
};
GameFramework.Utils.LerpMatrix = function GameFramework_Utils$LerpMatrix(theMat1, theMat2, thePct) {
    var omp = 1.0 - thePct;
    var aMatrix = new GameFramework.geom.Matrix();
    aMatrix.a = theMat1.a * omp + theMat2.a * thePct;
    aMatrix.b = theMat1.b * omp + theMat2.b * thePct;
    aMatrix.c = theMat1.c * omp + theMat2.c * thePct;
    aMatrix.d = theMat1.d * omp + theMat2.d * thePct;
    aMatrix.tx = theMat1.tx * omp + theMat2.tx * thePct;
    aMatrix.ty = theMat1.ty * omp + theMat2.ty * thePct;
    return aMatrix;
};
GameFramework.Utils.LerpColor = function GameFramework_Utils$LerpColor(theColor1, theColor2, thePct) {
    if (theColor1 == theColor2) {
        return theColor1;
    }
    var a = (thePct * 256.0) | 0;
    var oma = 256 - a;
    var aColor =
        ((((theColor1 & 0xff) * oma + (theColor2 & 0xff) * a) >>> 8) & 0xff) |
        ((((theColor1 & 0xff00) * oma + (theColor2 & 0xff00) * a) >>> 8) & 0xff00) |
        ((((theColor1 & 0xff0000) * oma + (theColor2 & 0xff0000) * a) >>> 8) & 0xff0000) |
        (((((theColor1 >>> 24) & 0xff) * oma + ((theColor2 >>> 24) & 0xff) * a) & 0xff00) << 16);
    return aColor;
};
GameFramework.Utils.IsPacificDST = function GameFramework_Utils$IsPacificDST(theUnixTime) {
    return false;
};
GameFramework.Utils.GetWeekNum = function GameFramework_Utils$GetWeekNum(theUnixTime, theDayNumStart, theHourStart) {
    //JS
    return 0;
    //-JS
};
GameFramework.Utils.GetUnixTime = function GameFramework_Utils$GetUnixTime() {
    //JS
    return 0;
    //-JS
};
GameFramework.Utils.CreateGUID = function GameFramework_Utils$CreateGUID() {
    var aTemplate = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    var aHexChars = "0123456789abcdef";
    var aGUID = "";
    for (var i = 0; i < aTemplate.length; i++) {
        if (aTemplate.charCodeAt(i) == 120 || aTemplate.charCodeAt(i) == 121) {
            var aRandomNumber = 0;
            //JS
            aRandomNumber = gBaseRNG();
            //-JS
            var aCharIdx = (aRandomNumber * 16) | 0;
            if (aTemplate.charCodeAt(i) == 121) {
                aCharIdx = (aCharIdx & 3) | 8;
            }
            aGUID += String.fromCharCode(aHexChars.charCodeAt(aCharIdx));
        } else {
            aGUID += String.fromCharCode(aTemplate.charCodeAt(i));
        }
    }
    return aGUID;
};
GameFramework.Utils.GetRunningMilliseconds = function GameFramework_Utils$GetRunningMilliseconds() {
    //JS
    if (GameFramework.Utils.sStartTime == 0) {
        GameFramework.Utils.sStartTime = new Date().getTime();
    }
    return new Date().getTime() - GameFramework.Utils.sStartTime;
    //-JS
    return 0;
};
GameFramework.Utils.prototype = {};
GameFramework.Utils.staticInit = function GameFramework_Utils$staticInit() {
    GameFramework.Utils.mLog = [];
    GameFramework.Utils.sStartTime = 0;
};

JSFExt_AddInitFunc(function () {
    GameFramework.Utils.registerClass("GameFramework.Utils", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.Utils.staticInit();
});
