///////////////////////////////////////////////////////////////////////////////
// Type System Implementation

window['Type'] = Function;
Type.__typeName = 'Type';

/**
 * @constructor
 */
__Namespace = function(name) {
	this.__typeName = name;
}
__Namespace.prototype = {
	__namespace : true,
	getName : function() {
		return this.__typeName;
	}
}

Type.registerNamespace = function Type$registerNamespace(name) {
	if(!window.__namespaces) {
		window.__namespaces = {};
	}
	if(!window.__rootNamespaces) {
		window.__rootNamespaces = [];
	}

	if(window.__namespaces[name]) {
		return window.__namespaces[name];
	}

	var ns = window;
	var nameParts = name.split('.');

	for(var i = 0; i < nameParts.length; i++) {
		var part = nameParts[i];
		var nso = ns[part];
		if(!nso) {
			ns[part] = nso = new __Namespace(nameParts.slice(0, i + 1).join('.'));
			if(i == 0) {
				window.__rootNamespaces.add(nso);
			}
		}
		ns = nso;
	}

	window.__namespaces[name] = ns;
	return window.__namespaces[name];
}

Type.prototype.registerClass = function Type$registerClass(name, baseType, interfaceType) {
	this.prototype.constructor = this;
	this.__typeName = name;
	this.__class = true;
	this.__baseType = baseType || Object;
	if(baseType) {
		this.__basePrototypePending = true;
	}

	if(interfaceType) {
		this.__interfaces = [];
		for(var i = 2; i < arguments.length; i++) {
			interfaceType = arguments[i];
			this.__interfaces.add(interfaceType);
		}
	}
}

Type.prototype.invoke = function Type$invoke() {
	return this.apply(null, arguments);
}

Type.prototype.registerInterface = function Type$createInterface(name) {
	this.__typeName = name;
	this.__interface = true;
}

Type.prototype.registerEnum = function Type$createEnum(name, flags) {
	for(var field in this.prototype) {
		this[field] = this.prototype[field];
	}

	this.__typeName = name;
	this.__enum = true;
	if(flags) {
		this.__flags = true;
	}

	this.toString = ss.Enum._enumToString;
}

Type.prototype.setupBase = function Type$setupBase() {
	if(this.__basePrototypePending) {
		var baseType = this.__baseType;
		if(baseType.__basePrototypePending) {
			baseType.setupBase();
		}

		for(var memberName in baseType.prototype) {
			var memberValue = baseType.prototype[memberName];
			if(!this.prototype[memberName]) {
				this.prototype[memberName] = memberValue;
			}
		}

		delete this.__basePrototypePending;
	}
}

if(!Type.prototype.resolveInheritance) {
	// This function is not used by Script#; Visual Studio relies on it
	// for JavaScript IntelliSense support of derived types.
	Type.prototype.resolveInheritance = Type.prototype.setupBase;
}

Type.prototype.initializeBase = function Type$initializeBase(instance, args) {
	if(this.__basePrototypePending) {
		this.setupBase();
	}

	if(!args) {
		this.__baseType.apply(instance);
	} else {
		this.__baseType.apply(instance, args);
	}
}

Type.prototype.callBaseMethod = function Type$callBaseMethod(instance, name, args) {
	var baseMethod = this.__baseType.prototype[name];
	if(!args) {
		return baseMethod.apply(instance);
	} else {
		return baseMethod.apply(instance, args);
	}
}

Type.prototype.get_baseType = function Type$get_baseType() {
	return this.__baseType || null;
}

Type.prototype.get_fullName = function Type$get_fullName() {
	return this.__typeName;
}

Type.prototype.get_name = function Type$get_name() {
	var fullName = this.__typeName;
	var nsIndex = fullName.lastIndexOf('.');
	if(nsIndex > 0) {
		return fullName.substr(nsIndex + 1);
	}
	return fullName;
}

Type.prototype.getInterfaces = function Type$getInterfaces() {
	return this.__interfaces;
}

Type.prototype.isInstanceOfType = function Type$isInstanceOfType(instance) {
	if(ss.isNullOrUndefined(instance)) {
		return false;
	}
	if((this == Object) || (instance instanceof this)) {
		return true;
	}

	var type = Type.getInstanceType(instance);
	return this.isAssignableFrom(type);
}

Type.prototype.isAssignableFrom = function Type$isAssignableFrom(type) {
	if((this == Object) || (this == type)) {
		return true;
	}
	if(this.__class) {
		var baseType = type.__baseType;
		while(baseType) {
			if(this == baseType) {
				return true;
			}
			baseType = baseType.__baseType;
		}
	} else if(this.__interface) {
		var interfaces = type.__interfaces;
		if(interfaces && interfaces.contains(this)) {
			return true;
		}

		var baseType = type.__baseType;
		while(baseType) {
			interfaces = baseType.__interfaces;
			if(interfaces && interfaces.contains(this)) {
				return true;
			}
			baseType = baseType.__baseType;
		}
	}
	return false;
}

Type.isClass = function Type$isClass(type) {
	return (type.__class == true);
}

Type.isEnum = function Type$isEnum(type) {
	return (type.__enum == true);
}

Type.isFlags = function Type$isFlags(type) {
	return ((type.__enum == true) && (type.__flags == true));
}

Type.isInterface = function Type$isInterface(type) {
	return (type.__interface == true);
}

Type.isNamespace = function Type$isNamespace(object) {
	return (object.__namespace == true);
}

Type.canCast = function Type$canCast(instance, type) {
	return type.isInstanceOfType(instance);
}

Type.safeCast = function Type$safeCast(instance, type) {
	if(type.isInstanceOfType(instance)) {
		return instance;
	}
	return null;
}

Type.tryCast = function Type$tryCast(instance, type) {
	return (type.isInstanceOfType(instance));
}

Type.getInstanceType = function Type$getInstanceType(instance) {
	var ctor = null;

	// NOTE: We have to catch exceptions because the constructor
	//       cannot be looked up on native COM objects
	try {
		ctor = instance.constructor;
	} catch(ex) {
	}
	if(!ctor || !ctor.__typeName) {
		ctor = Object;
	}
	return ctor;
}

Type.getType = function Type$getType(typeName) {
	if(!typeName) {
		return null;
	}

	if(!Type.__typeCache) {
		Type.__typeCache = {};
	}

	var type = Type.__typeCache[typeName];
	if(!type) {
		type = eval(typeName);
		Type.__typeCache[typeName] = type;
	}
	return type;
}

Type.parse = function Type$parse(typeName) {
	return Type.getType(typeName);
}