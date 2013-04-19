GameFramework.TArray = function GameFramework_TArray() {
	this.mCSArrayList = [];
}
GameFramework.TArray.prototype = {
	mCSArrayList : null,
	get_Item : function GameFramework_TArray$get_Item(index) {
		return this.mCSArrayList[index];
	},
	set_Item : function GameFramework_TArray$set_Item(index, value) {
		while(index > this.mCSArrayList.length) {
			this.mCSArrayList.push(null);
		}
		if(index == this.mCSArrayList.length) {
			this.mCSArrayList.push(value);
		} else {
			this.mCSArrayList[index] = value;
		}
	},
	get_Count : function GameFramework_TArray$get_Count() {
		return this.mCSArrayList.length;
	},
	set_Count : function GameFramework_TArray$set_Count(value) {
		if(value < this.mCSArrayList.length) {
			this.mCSArrayList.removeRange(value, this.mCSArrayList.length - value);
		} else {
			while(value > this.mCSArrayList.length) {
				this.mCSArrayList.push(null);
			}
		}
	},
	Add : function GameFramework_TArray$Add(item) {
		this.mCSArrayList.push(item);
	},
	Pop : function GameFramework_TArray$Pop() {
		var aThing = this[this.mCSArrayList.length - 1];
		this.mCSArrayList.removeAt(this.mCSArrayList.length - 1);
		return aThing;
	},
	Splice : function GameFramework_TArray$Splice(startIndex, deleteCount, $insert) {
		this.mCSArrayList.removeRange(startIndex, deleteCount);
		for(var i = 0; i < (arguments.length - 2); i++) {
			this.mCSArrayList.insert(startIndex + i, arguments[(i) + 2]);
		}
	},
	Compare : function GameFramework_TArray$Compare(x, y) {
		return Utils.CompareTo(x.toString(), y.toString());
	},
	Sort : function GameFramework_TArray$Sort() {
		//JS
		mCSArrayList.Sort(Compare);
		//-JS
	},
	RemoveAt : function GameFramework_TArray$RemoveAt(theIdx) {
		this.mCSArrayList.removeAt(theIdx);
	},
	RemoveRange : function GameFramework_TArray$RemoveRange(theIdx, theCount) {
		this.mCSArrayList.removeRange(theIdx, theCount);
	},
	Clear : function GameFramework_TArray$Clear() {
		this.mCSArrayList.clear();
	},
	Insert : function GameFramework_TArray$Insert(theIdx, theValue) {
		this.mCSArrayList.insert(theIdx, theValue);
	},
	IndexOf : function GameFramework_TArray$IndexOf(value) {
		return this.mCSArrayList.indexOf(value);
	},
	GetObjectArray : function GameFramework_TArray$GetObjectArray() {
		return null;
	},
	GetEnumerator : function GameFramework_TArray$GetEnumerator() {
		return this.mCSArrayList.GetEnumerator();
	}
}
GameFramework.TArray.staticInit = function GameFramework_TArray$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.TArray.registerClass('GameFramework.TArray', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.TArray.staticInit();
});