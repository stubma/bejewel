///////////////////////////////////////////////////////////////////////////////
// ArrayEnumerator

/**
 * @constructor
 */
ss.ArrayEnumerator = function ArrayEnumerator$(array) {
	this._array = array;
	this._index = -1;
}
ss.ArrayEnumerator.prototype = {
	get_current : function ArrayEnumerator$get_current() {
		return this._array[this._index];
	},
	moveNext : function ArrayEnumerator$moveNext() {
		this._index++;
		return (this._index < this._array.length);
	},
	reset : function ArrayEnumerator$reset() {
		this._index = -1;
	}
}

ss.ArrayEnumerator.registerClass('ArrayEnumerator', null, ss.IEnumerator);