GameFramework.DataBuffer = function GameFramework_DataBuffer() {
    this.mBufferData = GameFramework.BaseApp.mApp.CreateBufferData();
};
GameFramework.DataBuffer.prototype = {
    mBufferData: null,
    mDidInit: false,
    get_BytesAvailable: function GameFramework_DataBuffer$get_BytesAvailable() {
        return this.mBufferData.get_BytesAvailable();
    },
    get_Size: function GameFramework_DataBuffer$get_Size() {
        return this.mBufferData.get_DataLength();
    },
    get_Position: function GameFramework_DataBuffer$get_Position() {
        return this.mBufferData.get_Position();
    },
    set_Position: function GameFramework_DataBuffer$set_Position(value) {
        this.mBufferData.set_Position(value);
    },
    InitRead: function GameFramework_DataBuffer$InitRead(theData) {
        this.mDidInit = true;
        this.mBufferData.InitRead(theData);
    },
    InitWrite: function GameFramework_DataBuffer$InitWrite() {
        this.mDidInit = true;
        this.mBufferData.InitWrite();
    },
    ToByteArray: function GameFramework_DataBuffer$ToByteArray() {
        return this.mBufferData.ToByteArray();
    },
    ReadByte: function GameFramework_DataBuffer$ReadByte() {
        return this.mBufferData.ReadByte();
    },
    ReadSByte: function GameFramework_DataBuffer$ReadSByte() {
        return this.mBufferData.ReadSByte();
    },
    ReadInt: function GameFramework_DataBuffer$ReadInt() {
        return this.mBufferData.ReadInt();
    },
    ReadShort: function GameFramework_DataBuffer$ReadShort() {
        return this.mBufferData.ReadShort();
    },
    ReadFloat: function GameFramework_DataBuffer$ReadFloat() {
        return this.mBufferData.ReadFloat();
    },
    ReadDouble: function GameFramework_DataBuffer$ReadDouble() {
        return this.mBufferData.ReadDouble();
    },
    ReadBoolean: function GameFramework_DataBuffer$ReadBoolean() {
        return this.mBufferData.ReadBoolean();
    },
    ReadAsciiBytes: function GameFramework_DataBuffer$ReadAsciiBytes(theCount) {
        return this.mBufferData.ReadAsciiBytes(theCount);
    },
    ReadBytes: function GameFramework_DataBuffer$ReadBytes(theBytes, theOffset, theSize) {
        this.mBufferData.ReadBytes(theBytes, theOffset, theSize);
    },
    ReadAsciiString: function GameFramework_DataBuffer$ReadAsciiString() {
        var aCount = this.ReadShort();
        return this.mBufferData.ReadAsciiBytes(aCount);
    },
    ReadUTF8Bytes: function GameFramework_DataBuffer$ReadUTF8Bytes(theCount) {
        return this.mBufferData.ReadUTF8Bytes(theCount);
    },
    ReadUTF8String: function GameFramework_DataBuffer$ReadUTF8String() {
        var aCount = this.mBufferData.ReadInt();
        return this.ReadUTF8Bytes(aCount);
    },
    ReadUTF8CString: function GameFramework_DataBuffer$ReadUTF8CString() {
        var aCurString = "";
        var aBuffer = Array.Create(1024, 0);
        var aBufferIdx = 0;
        while (true) {
            var aByte = this.ReadByte();
            if (aByte == 0) {
                break;
            }
            aBuffer[aBufferIdx++] = aByte;
            if (aBufferIdx >= 1024) {
                aCurString += GameFramework.Utils.ByteArrayToASCII(aBuffer, aBufferIdx);
                aBufferIdx = 0;
            }
        }
        aCurString += GameFramework.Utils.ByteArrayToASCII(aBuffer, aBufferIdx);
        return GameFramework.Utils.UTF8ToString(aCurString);
    },
    ReadBSON: function GameFramework_DataBuffer$ReadBSON(theObject) {
        this.mBufferData.ReadBSON(theObject);
    },
    ToUTF8String: function GameFramework_DataBuffer$ToUTF8String() {
        return this.mBufferData.ToUTF8String();
    },
    WriteInt: function GameFramework_DataBuffer$WriteInt(theInt) {
        if (!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteInt(theInt);
    },
    WriteShort: function GameFramework_DataBuffer$WriteShort(theShort) {
        if (!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteShort(theShort);
    },
    WriteByte: function GameFramework_DataBuffer$WriteByte(theByte) {
        if (!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteByte(theByte);
    },
    WriteFloat: function GameFramework_DataBuffer$WriteFloat(theFloat) {
        if (!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteFloat(theFloat);
    },
    WriteASCIICString: function GameFramework_DataBuffer$WriteASCIICString(theString) {
        if (!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteASCIIString(theString);
        this.mBufferData.WriteByte(0);
    },
    WriteASCIIString: function GameFramework_DataBuffer$WriteASCIIString(theString) {
        if (!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteInt(theString.length);
        this.mBufferData.WriteASCIIString(theString);
    },
    WriteUTF8CString: function GameFramework_DataBuffer$WriteUTF8CString(theString) {
        if (!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteASCIIString(GameFramework.Utils.StringToUTF8(theString));
        this.mBufferData.WriteByte(0);
    },
    WriteUTF8String: function GameFramework_DataBuffer$WriteUTF8String(theString) {
        if (!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteASCIIString(GameFramework.Utils.StringToUTF8(theString));
    },
    WriteBytes: function GameFramework_DataBuffer$WriteBytes(theBytes, theOffset, theSize) {
        this.mBufferData.WriteBytes(theBytes, theOffset, theSize);
    },
    WriteBSON: function GameFramework_DataBuffer$WriteBSON(theObject) {
        if (!this.mDidInit) {
            this.InitWrite();
        }
        this.mBufferData.WriteBSON(theObject);
    },
};
GameFramework.DataBuffer.staticInit = function GameFramework_DataBuffer$staticInit() {};

JSFExt_AddInitFunc(function () {
    GameFramework.DataBuffer.registerClass("GameFramework.DataBuffer", null);
});
JSFExt_AddStaticInitFunc(function () {
    GameFramework.DataBuffer.staticInit();
});
