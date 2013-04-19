GameFramework.JSONFormatException = function GameFramework_JSONFormatException(theInnerException, theData) {
	GameFramework.JSONFormatException.initializeBase(this, [theInnerException.get_Message() + ' at line ' + theData.mLineNum]);
	this.mInnerException = theInnerException;
	this.mLineNum = theData.mLineNum;
}
GameFramework.JSONFormatException.prototype = {
	mInnerException : null,
	mLineNum : 0
}
GameFramework.JSONFormatException.staticInit = function GameFramework_JSONFormatException$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.JSONFormatException.registerClass('GameFramework.JSONFormatException', System.Exception);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.JSONFormatException.staticInit();
});