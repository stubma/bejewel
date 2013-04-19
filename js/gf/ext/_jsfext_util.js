function JS_AssertException(message) {
	this.message = message;
}

JS_AssertException.prototype.toString = function() {
	return 'AssertException: ' + this.message;
}

function JS_Assert(exp, message) {
	if(!exp) {
		if(message == null) {
			message = "Assertion failed";
		}
		var anException = new JS_AssertException(message);
		anException.stackStr = arguments.callee.caller.name;
		throw anException;
	}
}

function JS_SpliceArray(anArray, startIndex, deleteCount) {
	anArray.removeRange(startIndex, deleteCount);
	for(var i = 3; i < arguments.length; i++) {
		anArray.insert(startIndex + i - 3, arguments[i]);
	}
}