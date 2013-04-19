///////////////////////////////////////////////////////////////////////////////
// Debug Extensions

ss.Debug = window.Debug ? window.Debug : function() {
};
ss.Debug.__typeName = 'Debug';

if(!ss.Debug.writeln) {
	ss.Debug.writeln = function Debug$writeln(text) {
		if(window.console) {
			if(window.console.debug) {
				window.console.debug(text);
				return;
			} else if(window.console.log) {
				window.console.log(text);
				return;
			}
		} else if(window.opera && window.opera.postError) {
			window.opera.postError(text);
			return;
		}
	}
}

ss.Debug._fail = function Debug$_fail(message) {
	ss.Debug.writeln(message);
	eval('debugger;');
}

ss.Debug.assert = function Debug$assert(condition, message) {
	if(!condition) {
		message = 'Assert failed: ' + message;
		if(confirm(message + '\r\n\r\nBreak into debugger?')) {
			ss.Debug._fail(message);
		}
	}
}

ss.Debug.fail = function Debug$fail(message) {
	ss.Debug._fail(message);
}

ss.Debug._traceDump = function Debug$_traceDump(sb, object, name, indentation, dumpedObjects) {
	if(object === null) {
		sb.appendLine(indentation + name + ': null');
		return;
	}
	switch(typeof (object)) {
		case 'undefined':
			sb.appendLine(indentation + name + ': undefined');
			break;
		case 'number':
		case 'string':
		case 'boolean':
			sb.appendLine(indentation + name + ': ' + object);
			break;
		default:
			if(Date.isInstanceOfType(object) || RegExp.isInstanceOfType(object)) {
				sb.appendLine(indentation + name + ': ' + object);
				break;
			}

			if(dumpedObjects.contains(object)) {
				sb.appendLine(indentation + name + ': ...');
				break;
			}
			dumpedObjects.add(object);

			var type = Type.getInstanceType(object);
			var typeName = type.get_fullName();
			var recursiveIndentation = indentation + '  ';

			if(Array.isInstanceOfType(object)) {
				sb.appendLine(indentation + name + ': {' + typeName + '}');
				var length = object.length;
				for(var i = 0; i < length; i++) {
					ss.Debug._traceDump(sb, object[i], '[' + i + ']', recursiveIndentation, dumpedObjects);
				}
			} else {
				if(object.tagName) {
					sb.appendLine(indentation + name + ': <' + object.tagName + '>');
					var attributes = object.attributes;
					for(var i = 0; i < attributes.length; i++) {
						var attrValue = attributes[i].nodeValue;
						if(attrValue) {
							ss.Debug._traceDump(sb, attrValue, attributes[i].nodeName, recursiveIndentation, dumpedObjects);
						}
					}
				} else {
					sb.appendLine(indentation + name + ': {' + typeName + '}');
					for(var field in object) {
						var v = object[field];
						if(!Function.isInstanceOfType(v)) {
							ss.Debug._traceDump(sb, v, field, recursiveIndentation, dumpedObjects);
						}
					}
				}
			}

			dumpedObjects.remove(object);
			break;
	}
}

ss.Debug.traceDump = function Debug$traceDump(object, name) {
	if((!name || !name.length) && (object !== null)) {
		name = Type.getInstanceType(object).get_fullName();
	}

	var sb = new ss.StringBuilder();
	ss.Debug._traceDump(sb, object, name, '', []);
	ss.Debug.writeLine(sb.toString());
}

ss.Debug.writeLine = function Debug$writeLine(message) {
	if(window.debugService) {
		window.debugService.trace(message);
		return;
	}
	ss.Debug.writeln(message);

	var traceTextBox = document.getElementById('_traceTextBox');
	if(traceTextBox) {
		traceTextBox.value = traceTextBox.value + '\r\n' + message;
	}
}