GameFramework.JSDataBufferData = function GameFramework_JSDataBufferData() {
	GameFramework.JSDataBufferData.initializeBase(this);
}
GameFramework.JSDataBufferData.prototype = {
	mData : null,
	get_DataLength : function GameFramework_JSDataBufferData$get_DataLength() {
		return this.mData.length;
	},
	ReadByte : function GameFramework_JSDataBufferData$ReadByte() {
		return ((this.mData.charCodeAt(this.mPosition++) & 0xff) | 0);
	},
	InitRead : function GameFramework_JSDataBufferData$InitRead(theData) {
		//JS
		if(typeof(theData) == "string") {
			this.mData = theData;
			return;
		}
		//-JS
		this.mData = '';
		for(var i = 0; i < theData.length; i++) {
			this.mData = this.mData + String.fromCharCode((theData[i] | 0));
		}
	},
	ReadFloat : function GameFramework_JSDataBufferData$ReadFloat() {
		var n = this.ReadInt();
		//JS
		var sign = (n >> 31) * 2 + 1
		var expo = (n >>> 23) & 0xFF
		var mant = n & 0x007FFFFF
		if(expo === 0xFF) {
			return mant ? NaN : sign / 0
		}
		expo ? ( expo -= 127, mant |= 0x00800000 ) : expo = -126
		return sign * mant * Math.pow(2, expo - 23)
		//-JS
		return 0;
	},
	ReadDouble : function GameFramework_JSDataBufferData$ReadDouble() {
		//JS
		var mantI = this.ReadInt();
		var n = this.ReadInt() << 32;
		var sign = (n >> 31) * 2 + 1
		var expo = (n >>> 20) & 0x7FF

		var mant = (mantI & 0x7FFFFFFF);
		if(mantI & 0x80000000) {
			mant += 2147483648.0;
		}
		mant += (n & 0xFFFFF) * 4294967296.0;

		if(expo === 0x7FF) {
			return mant ? NaN : sign / 0
		}
		expo ? ( expo -= 1023, mant += 4503599627370496.0) : expo = -1022
		return sign * mant * Math.pow(2, expo - 52)
		//-JS
		return 0;
	},
	ReadShort : function GameFramework_JSDataBufferData$ReadShort() {
		var a = this.ReadByte();
		var b = this.ReadByte();
		var aVal = ((a | (b << 8)) | 0);
		if((aVal & 0x8000) != 0) {
			aVal |= 0xffff0000;
		}
		return (aVal | 0);
	}
}
GameFramework.JSDataBufferData.staticInit = function GameFramework_JSDataBufferData$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.JSDataBufferData.registerClass('GameFramework.JSDataBufferData', GameFramework.DataBufferData);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.JSDataBufferData.staticInit();
});