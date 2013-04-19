window['ss'] = {
	version : '0.6.1.0',

	isUndefined : function(o) {
		return (o === undefined);
	},

	isNull : function(o) {
		return (o === null);
	},

	isNullOrUndefined : function(o) {
		return (o === null) || (o === undefined);
	}
};