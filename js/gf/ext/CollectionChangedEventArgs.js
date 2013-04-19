///////////////////////////////////////////////////////////////////////////////
// CollectionChangedEventArgs

ss.CollectionChangedEventArgs = function CollectionChangedEventArgs$(action, item, index) {
	ss.CollectionChangedEventArgs.initializeBase(this);
	this._action = action;
	this._item = item || null;
	this._index = index || -1;
}
ss.CollectionChangedEventArgs.prototype = {
	get_action : function() {
		return this._action;
	},
	get_index : function() {
		return this._index;
	},
	get_item : function() {
		return this._item;
	}
}
ss.CollectionChangedEventArgs.registerClass('CollectionChangedEventArgs', ss.EventArgs);