GameFramework.DataBufferData = function GameFramework_DataBufferData() {};
GameFramework.DataBufferData.prototype = {
    mLength: 0,
    mPosition: 0,
    get_BytesAvailable: function GameFramework_DataBufferData$get_BytesAvailable() {
        return (this.mLength - this.mPosition) | 0;
    },
    get_DataLength: function GameFramework_DataBufferData$get_DataLength() {
        return this.mLength | 0;
    },
    get_Position: function GameFramework_DataBufferData$get_Position() {
        return this.mPosition | 0;
    },
    set_Position: function GameFramework_DataBufferData$set_Position(value) {
        this.mPosition = value;
    },
    InitRead: function GameFramework_DataBufferData$InitRead(theData) {},
    InitWrite: function GameFramework_DataBufferData$InitWrite() {},
    ToByteArray: function GameFramework_DataBufferData$ToByteArray() {
        return null;
    },
    ReadByte: function GameFramework_DataBufferData$ReadByte() {
        return 0;
    },
    ReadSByte: function GameFramework_DataBufferData$ReadSByte() {
        var aSByte = this.ReadByte();
        return aSByte;
    },
    ReadInt: function GameFramework_DataBufferData$ReadInt() {
        var a = this.ReadByte();
        var b = this.ReadByte();
        var c = this.ReadByte();
        var d = this.ReadByte();
        return a | (b << 8) | (c << 16) | (d << 24);
    },
    ReadShort: function GameFramework_DataBufferData$ReadShort() {
        var a = this.ReadByte();
        var b = this.ReadByte();
        return a | (b << 8) | 0;
    },
    ReadFloat: function GameFramework_DataBufferData$ReadFloat() {
        return 0;
    },
    ReadDouble: function GameFramework_DataBufferData$ReadDouble() {
        return 0;
    },
    ReadBoolean: function GameFramework_DataBufferData$ReadBoolean() {
        return this.ReadByte() != 0;
    },
    ReadBytes: function GameFramework_DataBufferData$ReadBytes(theBytes, theOffset, theSize) {
        for (var i = 0; i < theSize; i++) {
            theBytes[i + theOffset] = this.ReadByte();
        }
    },
    ReadAsciiBytes: function GameFramework_DataBufferData$ReadAsciiBytes(theCount) {
        var aString = "";
        for (var i = 0; i < theCount; i++) {
            aString += GameFramework.Utils.StringFromCharCode(this.ReadByte());
        }
        return aString;
    },
    ReadUTF8Bytes: function GameFramework_DataBufferData$ReadUTF8Bytes(theCount) {
        return GameFramework.Utils.StringToUTF8(this.ReadAsciiBytes(theCount));
    },
    ToUTF8String: function GameFramework_DataBufferData$ToUTF8String() {
        return "";
    },
    ReadBSON: function GameFramework_DataBufferData$ReadBSON(theObject) {},
    WriteByte: function GameFramework_DataBufferData$WriteByte(theByte) {},
    WriteASCIIString: function GameFramework_DataBufferData$WriteASCIIString(theString) {
        for (var i = 0; i < theString.length; i++) {
            this.WriteByte(GameFramework.Utils.GetCharCodeAt(theString, i) | 0);
        }
    },
    WriteInt: function GameFramework_DataBufferData$WriteInt(theInt) {
        this.WriteByte((theInt & 0xff) | 0);
        this.WriteByte(((theInt >> 8) & 0xff) | 0);
        this.WriteByte(((theInt >> 16) & 0xff) | 0);
        this.WriteByte(((theInt >> 24) & 0xff) | 0);
    },
    WriteShort: function GameFramework_DataBufferData$WriteShort(theShort) {
        this.WriteByte((theShort & 0xff) | 0);
        this.WriteByte(((theShort >> 8) & 0xff) | 0);
    },
    WriteFloat: function GameFramework_DataBufferData$WriteFloat(theFloat) {},
    WriteBytes: function GameFramework_DataBufferData$WriteBytes(theBytes, theOffset, theSize) {
        for (var i = 0; i < theSize; i++) {
            this.WriteByte(theBytes[i + theOffset]);
        }
    },
    WriteBSON: function GameFramework_DataBufferData$WriteBSON(theObject) {},
};
GameFramework.DataBufferData.staticInit = function GameFramework_DataBufferData$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.DataBufferData.registerClass("GameFramework.DataBufferData", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.DataBufferData.staticInit();
});
