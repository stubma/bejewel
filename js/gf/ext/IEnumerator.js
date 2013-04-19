///////////////////////////////////////////////////////////////////////////////
// IEnumerator

ss.IEnumerator = function IEnumerator$() {
};
ss.IEnumerator.prototype = {
	get_current : null,
	moveNext : null,
	reset : null
}

ss.IEnumerator.getEnumerator = function ss_IEnumerator$getEnumerator(enumerable) {
	if(enumerable) {
		return enumerable.getEnumerator ? enumerable.getEnumerator() : new ss.ArrayEnumerator(enumerable);
	}
	return null;
}

ss.IEnumerator.registerInterface('IEnumerator');