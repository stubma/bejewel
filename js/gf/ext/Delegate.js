///////////////////////////////////////////////////////////////////////////////
// Delegate

ss.Delegate = function Delegate$() {};
ss.Delegate.registerClass("Delegate");

ss.Delegate.Null = function () {};

ss.Delegate._contains = function Delegate$_contains(targets, object, method) {
    for (var i = 0; i < targets.length; i += 2) {
        if (targets[i] === object && targets[i + 1] === method) {
            return true;
        }
    }
    return false;
};

ss.Delegate._create = function Delegate$_create(targets) {
    var delegate = function () {
        if (targets.length == 2) {
            return targets[1].apply(targets[0], arguments);
        } else {
            var clone = targets.clone();
            for (var i = 0; i < clone.length; i += 2) {
                if (ss.Delegate._contains(targets, clone[i], clone[i + 1])) {
                    clone[i + 1].apply(clone[i], arguments);
                }
            }
            return null;
        }
    };
    delegate.invoke = delegate;
    delegate._targets = targets;

    return delegate;
};

ss.Delegate.create = function Delegate$create(object, method) {
    if (!object) {
        method.invoke = method;
        return method;
    }
    return ss.Delegate._create([object, method]);
};

ss.Delegate.combine = function Delegate$combine(delegate1, delegate2) {
    if (!delegate1) {
        if (!delegate2._targets) {
            return ss.Delegate.create(null, delegate2);
        }
        return delegate2;
    }
    if (!delegate2) {
        if (!delegate1._targets) {
            return ss.Delegate.create(null, delegate1);
        }
        return delegate1;
    }

    var targets1 = delegate1._targets ? delegate1._targets : [null, delegate1];
    var targets2 = delegate2._targets ? delegate2._targets : [null, delegate2];

    return ss.Delegate._create(targets1.concat(targets2));
};

ss.Delegate.remove = function Delegate$remove(delegate1, delegate2) {
    if (!delegate1 || delegate1 === delegate2) {
        return null;
    }
    if (!delegate2) {
        return delegate1;
    }

    var targets = delegate1._targets;
    var object = null;
    var method;
    if (delegate2._targets) {
        object = delegate2._targets[0];
        method = delegate2._targets[1];
    } else {
        method = delegate2;
    }

    for (var i = 0; i < targets.length; i += 2) {
        if (targets[i] === object && targets[i + 1] === method) {
            if (targets.length == 2) {
                return null;
            }
            targets.splice(i, 2);
            return ss.Delegate._create(targets);
        }
    }

    return delegate1;
};

ss.Delegate.createExport = function Delegate$createExport(delegate, multiUse) {
    var name = "__" + new Date().valueOf();
    ss.Delegate[name] = function () {
        if (!multiUse) {
            ss.Delegate.deleteExport(name);
        }
        delegate.apply(null, arguments);
    };

    return name;
};

ss.Delegate.deleteExport = function Delegate$deleteExport(name) {
    if (ss.Delegate[name]) {
        delete ss.Delegate[name];
    }
};

ss.Delegate.clearExport = function Delegate$clearExport(name) {
    if (ss.Delegate[name]) {
        ss.Delegate[name] = Delegate.Null;
    }
};
