///////////////////////////////////////////////////////////////////////////////
// Boolean Extensions

Boolean.__typeName = "Boolean";

Boolean.parse = function Boolean$parse(s) {
    return s.toLowerCase() == "true";
};
