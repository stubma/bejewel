///////////////////////////////////////////////////////////////////////////////
// PropertyChangedEventArgs

ss.PropertyChangedEventArgs = function PropertyChangedEventArgs$(propertyName) {
    ss.PropertyChangedEventArgs.initializeBase(this);
    this._propName = propertyName;
};
ss.PropertyChangedEventArgs.prototype = {
    get_propertyName: function () {
        return this._propName;
    },
};
ss.PropertyChangedEventArgs.registerClass("PropertyChangedEventArgs", ss.EventArgs);
