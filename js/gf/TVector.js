GameFramework.TVector = function GameFramework_TVector($args) {
	this.mCSList = [];

	{
		var $srcArray1 = arguments;
		for(var $enum1 = 0; $enum1 < $srcArray1.length; $enum1++) {
			var arg = $srcArray1[$enum1];
			this.mCSList.Add(arg);
		}
	}
}
GameFramework.TVector.CreateSized = function GameFramework_TVector$CreateSized(theLength, isFixed) {
	var aVector = [];
	aVector.mCSList = [(theLength | 0)];
	aVector.isFixed = isFixed;
	for(var i = 0; i < theLength; i++) {
		aVector.mCSList.Add(0);
	}
	return aVector;
}
GameFramework.TVector.prototype = {
	mCSList : null,
	isFixed : false,
	get_Count : function GameFramework_TVector$get_Count() {
		return this.mCSList.get_Count();
	},
	set_Count : function GameFramework_TVector$set_Count(value) {
		if(value < this.mCSList.get_Count()) {
			this.mCSList.RemoveRange(value, this.mCSList.get_Count() - value);
		} else {
			while(value > this.mCSList.get_Count()) {
				this.mCSList.Add(0);
			}
		}
	},
	get_Item : function GameFramework_TVector$get_Item(index) {
		return this.mCSList[index];
	},
	set_Item : function GameFramework_TVector$set_Item(index, value) {
		if(index == this.mCSList.get_Count()) {
			this.mCSList.Add(value);
		} else {
			this.mCSList[index] = value;
		}
	},
	Add : function GameFramework_TVector$Add(arg) {
		this.mCSList.Add(arg);
	},
	Pop : function GameFramework_TVector$Pop() {
		var aThing = this[this.mCSList.get_Count() - 1];
		this.mCSList.RemoveAt(this.mCSList.get_Count() - 1);
		return aThing;
	},
	Slice : function GameFramework_TVector$Slice(startIndex, endIndex) {
		var aNewVector = [];
		if(aNewVector.mCSList.get_Count() == 0) {
			var $enum2 = ss.IEnumerator.getEnumerator(this.mCSList);
			while($enum2.moveNext()) {
				var aVal = $enum2.get_current();
				aNewVector.mCSList.Add(aVal);
			}
		}
		return aNewVector;
	},
	Duplicate : function GameFramework_TVector$Duplicate() {
		var aNewVector = [];

		{
			var $enum3 = ss.IEnumerator.getEnumerator(this.mCSList);
			while($enum3.moveNext()) {
				var aValue = $enum3.get_current();
				aNewVector.mCSList.Add(aValue);
			}
		}
		return aNewVector;
	},
	Splice : function GameFramework_TVector$Splice(startIndex, deleteCount) {
		this.mCSList.RemoveRange(startIndex, deleteCount);
	},
	Splice1 : function GameFramework_TVector$Splice1(startIndex, deleteCount, insert) {
		this.mCSList.RemoveRange(startIndex, deleteCount);
		this.mCSList.Insert(startIndex, insert);
	},
	RemoveAt : function GameFramework_TVector$RemoveAt(theIdx) {
		this.mCSList.RemoveAt(theIdx);
	},
	RemoveRange : function GameFramework_TVector$RemoveRange(theIdx, theCount) {
		this.mCSList.RemoveRange(theIdx, theCount);
	},
	Clear : function GameFramework_TVector$Clear() {
		this.mCSList.Clear();
	},
	Insert : function GameFramework_TVector$Insert(theIdx, theValue) {
		this.mCSList.Insert(theIdx, theValue);
	},
	IndexOf : function GameFramework_TVector$IndexOf(value) {
		return this.mCSList.IndexOf(value);
	},
	Sort : function GameFramework_TVector$Sort(theSortCallback) {
		if(theSortCallback === undefined) {
			theSortCallback = null;
		}
		if(theSortCallback == null) {
			this.mCSList.Sort();
		} else {
			this.mCSList.Sort$2(theSortCallback);
		}
	}
}
GameFramework.TVector.staticInit = function GameFramework_TVector$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.TVector.registerClass('GameFramework.TVector', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.TVector.staticInit();
});