///////////////////////////////////////////////////////////////////////////////
// INotifyCollectionChanged

ss.INotifyCollectionChanged = function INotifyCollectionChanged$() {
};
ss.INotifyCollectionChanged.prototype = {
	add_collectionChanged : null,
	remove_collectionChanged : null
}
ss.INotifyCollectionChanged.registerInterface('INotifyCollectionChanged');