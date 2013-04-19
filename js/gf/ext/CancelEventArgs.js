///////////////////////////////////////////////////////////////////////////////
// CancelEventArgs

ss.CancelEventArgs = function CancelEventArgs$() {
	ss.CancelEventArgs.initializeBase(this);
	this._cancel = false;
}
ss.CancelEventArgs.prototype = {
	get_cancel : function ss$CancelEventArgs$get_cancel() {
		return this._cancel;
	},
	set_cancel : function ss$CancelEventArgs$set_cancel(value) {
		this._cancel = value;
	}
}
ss.CancelEventArgs.registerClass('CancelEventArgs', ss.EventArgs);