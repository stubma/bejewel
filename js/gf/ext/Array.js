///////////////////////////////////////////////////////////////////////////////
// Array Extensions

Array.__typeName = 'Array';
Array.__interfaces = [ss.IEnumerable];

Array.Create = function Array$Create(theSize, theDefault) {
	var aNewArray = new Array(theSize);
	for(var i = 2; i < arguments.length; i++) {
		aNewArray[i - 2] = arguments[i];
	}
	var anIdx = arguments.length - 2;
	while(anIdx < theSize) {
		aNewArray[anIdx++] = theDefault;
	}
	return aNewArray;
}

// create two dimension array
// theSize0: array length
// theSize1: array element length
// theDefault: default value, after this, you can append more arguments to
// 		initialize array, then uninitialized element will be set to theDefault
Array.Create2D = function Array$Create2D(theSize0, theSize1, theDefault) {
	var aNewArray = new Array(theSize0 * theSize1);
	aNewArray.mLengths = [theSize0, theSize1];
	aNewArray.mIdxMult0 = theSize1;
	//aNewArray.GetLength = function(theDimension) { return Array_GetLength(anArray, theDimension); }
	for(var i = 3; i < arguments.length; i++) {
		aNewArray[i - 3] = arguments[i];
	}
	var anIdx = arguments.length - 3;
	while(anIdx < theSize0 * theSize1) {
		aNewArray[anIdx++] = theDefault;
	}
	return aNewArray;
}

// create three dimension array
// theSize0: array length
// theSize1: array sub length
// theSize2: final element length
// theDefault: default value, after this, you can append more arguments to
// 		initialize array, then uninitialized element will be set to theDefault
Array.Create3D = function Array$Create3D(theSize0, theSize1, theSize2, theDefault) {
	var aNewArray = new Array(theSize0 * theSize1);
	aNewArray.mLengths = [theSize0, theSize1, theSize2];
	aNewArray.mIdxMult0 = theSize1 * theSize2;
	aNewArray.mIdxMult1 = theSize2;
	//aNewArray.GetLength = function(theDimension) { return Array_GetLength(anArray, theDimension); }
	for(var i = 4; i < arguments.length; i++) {
		aNewArray[i - 4] = arguments[i];
	}
	var anIdx = arguments.length - 4;
	while(anIdx < theSize0 * theSize1) {
		aNewArray[anIdx++] = theDefault;
	}
	return aNewArray;
}

Array.prototype.add = function Array$add(item) {
	this[this.length] = item;
}

Array.prototype.addRange = function Array$addRange(items) {
	this.push.apply(this, items);
}

Array.prototype.aggregate = function Array$aggregate(seed, callback, instance) {
	var length = this.length;
	for(var i = 0; i < length; i++) {
		if(i in this) {
			seed = callback.call(instance, seed, this[i], i, this);
		}
	}
	return seed;
}

Array.prototype.clear = function Array$clear() {
	this.length = 0;
}

Array.prototype.clone = function Array$clone() {
	if(this.length === 1) {
		return [this[0]];
	} else {
		return Array.apply(null, this);
	}
}

Array.prototype.contains = function Array$contains(item) {
	var index = this.indexOf(item);
	return (index >= 0);
}

Array.prototype.dequeue = function Array$dequeue() {
	return this.shift();
}

Array.prototype.enqueue = function Array$enqueue(item) {
	// We record that this array instance is a queue, so we
	// can implement the right behavior in the peek method.
	this._queue = true;
	this.push(item);
}

Array.prototype.peek = function Array$peek() {
	if(this.length) {
		var index = this._queue ? 0 : this.length - 1;
		return this[index];
	}
	return null;
}

if(!Array.prototype.every) {
	Array.prototype.every = function Array$every(callback, instance) {
		var length = this.length;
		for(var i = 0; i < length; i++) {
			if(i in this && !callback.call(instance, this[i], i, this)) {
				return false;
			}
		}
		return true;
	}
}

Array.prototype.extract = function Array$extract(index, count) {
	if(!count) {
		return this.slice(index);
	}
	return this.slice(index, index + count);
}

if(!Array.prototype.filter) {
	Array.prototype.filter = function Array$filter(callback, instance) {
		var length = this.length;
		var filtered = [];
		for(var i = 0; i < length; i++) {
			if(i in this) {
				var val = this[i];
				if(callback.call(instance, val, i, this)) {
					filtered.push(val);
				}
			}
		}
		return filtered;
	}
}

if(!Array.prototype.forEach) {
	Array.prototype.forEach = function Array$forEach(callback, instance) {
		var length = this.length;
		for(var i = 0; i < length; i++) {
			if(i in this) {
				callback.call(instance, this[i], i, this);
			}
		}
	}
}

Array.prototype.getEnumerator = function Array$getEnumerator() {
	return new ss.ArrayEnumerator(this);
}

Array.prototype.groupBy = function Array$groupBy(callback, instance) {
	var length = this.length;
	var groups = [];
	var keys = {};
	for(var i = 0; i < length; i++) {
		if(i in this) {
			var key = callback.call(instance, this[i], i);
			if(String.isNullOrEmpty(key)) {
				continue;
			}
			var items = keys[key];
			if(!items) {
				items = [];
				items.key = key;

				keys[key] = items;
				groups.add(items);
			}
			items.add(this[i]);
		}
	}
	return groups;
}

Array.prototype.index = function Array$index(callback, instance) {
	var length = this.length;
	var items = {};
	for(var i = 0; i < length; i++) {
		if(i in this) {
			var key = callback.call(instance, this[i], i);
			if(String.isNullOrEmpty(key)) {
				continue;
			}
			items[key] = this[i];
		}
	}
	return items;
}

if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function Array$indexOf(item, startIndex) {
		startIndex = startIndex || 0;
		var length = this.length;
		if(length) {
			for(var index = startIndex; index < length; index++) {
				if(this[index] === item) {
					return index;
				}
			}
		}
		return -1;
	}
}

Array.prototype.insert = function Array$insert(index, item) {
	this.splice(index, 0, item);
}

Array.prototype.insertRange = function Array$insertRange(index, items) {
	if(index === 0) {
		this.unshift.apply(this, items);
	} else {
		for(var i = 0; i < items.length; i++) {
			this.splice(index + i, 0, items[i]);
		}
	}
}

if(!Array.prototype.map) {
	Array.prototype.map = function Array$map(callback, instance) {
		var length = this.length;
		var mapped = new Array(length);
		for(var i = 0; i < length; i++) {
			if(i in this) {
				mapped[i] = callback.call(instance, this[i], i, this);
			}
		}
		return mapped;
	}
}

Array.parse = function Array$parse(s) {
	return eval('(' + s + ')');
}

Array.prototype.remove = function Array$remove(item) {
	var index = this.indexOf(item);
	if(index >= 0) {
		this.splice(index, 1);
		return true;
	}
	return false;
}

Array.prototype.removeAt = function Array$removeAt(index) {
	this.splice(index, 1);
}

Array.prototype.removeRange = function Array$removeRange(index, count) {
	return this.splice(index, count);
}

if(!Array.prototype.some) {
	Array.prototype.some = function Array$some(callback, instance) {
		var length = this.length;
		for(var i = 0; i < length; i++) {
			if(i in this && callback.call(instance, this[i], i, this)) {
				return true;
			}
		}
		return false;
	}
}

Array.toArray = function Array$toArray(obj) {
	return Array.prototype.slice.call(obj);
}