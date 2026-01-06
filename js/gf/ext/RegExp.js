///////////////////////////////////////////////////////////////////////////////
// RegExp Extensions

RegExp.__typeName = "RegExp";

RegExp.parse = function RegExp$parse(s) {
    if (s.startsWith("/")) {
        var endSlashIndex = s.lastIndexOf("/");
        if (endSlashIndex > 1) {
            var expression = s.substring(1, endSlashIndex);
            var flags = s.substr(endSlashIndex + 1);
            return new RegExp(expression, flags);
        }
    }

    return null;
};
