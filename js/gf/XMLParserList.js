GameFramework.XMLParserList = function GameFramework_XMLParserList() {};
GameFramework.XMLParserList.prototype = {
    mEntries: null,
    mValue: null,
    Count: function GameFramework_XMLParserList$Count() {
        if (this.mEntries != null) {
            return this.mEntries.length;
        }
        if (this.mValue != null) {
            return 1;
        }
        return 0;
    },
    GetItem: function GameFramework_XMLParserList$GetItem(key) {
        if (this.mEntries == null) {
            return null;
        }
        return this.mEntries[key];
    },
    GetValue: function GameFramework_XMLParserList$GetValue() {
        if (this.mEntries == null) {
            if (this.mValue == null) {
                return "";
            } else {
                return this.mValue;
            }
        }
        return this.mEntries[0];
    },
};
GameFramework.XMLParserList.staticInit = function GameFramework_XMLParserList$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.XMLParserList.registerClass("GameFramework.XMLParserList", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.XMLParserList.staticInit();
});
