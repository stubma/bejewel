///////////////////////////////////////////////////////////////////////////////
// CollectionChangedAction

ss.CollectionChangedAction = function CollectionChangedAction$() {
};
ss.CollectionChangedAction.prototype = {
	add : 0,
	remove : 1,
	reset : 2
}
ss.CollectionChangedAction.registerEnum('CollectionChangedAction', false);