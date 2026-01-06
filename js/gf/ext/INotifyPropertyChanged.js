///////////////////////////////////////////////////////////////////////////////
// INotifyPropertyChanged

ss.INotifyPropertyChanged = function INotifyPropertyChanged$() {};
ss.INotifyPropertyChanged.prototype = {
    add_propertyChanged: null,
    remove_propertyChanged: null,
};
ss.INotifyPropertyChanged.registerInterface("INotifyPropertyChanged");
