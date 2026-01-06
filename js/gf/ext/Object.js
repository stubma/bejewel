///////////////////////////////////////////////////////////////////////////////
// Object Extensions

Object.__typeName = "Object";
Object.__baseType = null;

Object.getKeyCount = function Object$getKeyCount(d) {
    var count = 0;
    for (var n in d) {
        count++;
    }
    return count;
};

Object.clearKeys = function Object$clearKeys(d) {
    for (var n in d) {
        delete d[n];
    }
};

Object.keyExists = function Object$keyExists(d, key) {
    return d[key] !== undefined;
};
