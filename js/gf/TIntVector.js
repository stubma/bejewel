GameFramework.TIntVector = function GameFramework_TIntVector() {
    this.mCSList = [];
};
GameFramework.TIntVector.prototype = {
    mCSList: null,
    isFixed: false,
    get_Count: function GameFramework_TIntVector$get_Count() {
        return this.mCSList.get_Count();
    },
    set_Count: function GameFramework_TIntVector$set_Count(value) {
        if (value < this.mCSList.get_Count()) {
            this.mCSList.RemoveRange(value, this.mCSList.get_Count() - value);
        }
    },
    get_Item: function GameFramework_TIntVector$get_Item(index) {
        return this.mCSList[index] | 0;
    },
    set_Item: function GameFramework_TIntVector$set_Item(index, value) {
        while (index > this.mCSList.get_Count()) {
            this.mCSList.Add(0);
        }
        if (index == this.mCSList.get_Count()) {
            this.mCSList.Add(value);
        } else {
            this.mCSList[index] = value;
        }
    },
    Add: function GameFramework_TIntVector$Add(arg) {
        this.mCSList.Add(arg);
    },
    Pop: function GameFramework_TIntVector$Pop() {
        var aThing = this[this.mCSList.get_Count() - 1];
        this.mCSList.RemoveAt(this.mCSList.get_Count() - 1);
        return aThing;
    },
    Splice: function GameFramework_TIntVector$Splice(startIndex, deleteCount, $insert) {
        this.mCSList.RemoveRange(startIndex, deleteCount);
        for (var i = 0; i < arguments.length - 2; i++) {
            this.mCSList.Insert(startIndex + i, arguments[i + 2] | 0);
        }
    },
    RemoveAt: function GameFramework_TIntVector$RemoveAt(theIdx) {
        this.mCSList.RemoveAt(theIdx);
    },
    RemoveRange: function GameFramework_TIntVector$RemoveRange(theIdx, theCount) {
        this.mCSList.RemoveRange(theIdx, theCount);
    },
    Insert: function GameFramework_TIntVector$Insert(theIdx, theValue) {
        this.mCSList.Insert(theIdx, theValue);
    },
    IndexOf: function GameFramework_TIntVector$IndexOf(value) {
        return this.mCSList.IndexOf(value);
    },
    GetEnumerator: function GameFramework_TIntVector$GetEnumerator() {
        return this.mCSList.GetEnumerator();
    },
};
GameFramework.TIntVector.staticInit = function GameFramework_TIntVector$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.TIntVector.registerClass("GameFramework.TIntVector", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.TIntVector.staticInit();
});
