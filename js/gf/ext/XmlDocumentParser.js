///////////////////////////////////////////////////////////////////////////////
// XmlDocumentParser

ss.XmlDocumentParser = function XmlDocumentParser$() {
}
ss.XmlDocumentParser.registerClass('XmlDocumentParser');

ss.XmlDocumentParser.parse = function XmlDocumentParser$parse(markup) {
	if(!window['DOMParser']) {
		var progIDs = ['Msxml2.DOMDocument.3.0', 'Msxml2.DOMDocument'];

		for(var i = 0; i < progIDs.length; i++) {
			try {
				var xmlDOM = new ActiveXObject(progIDs[i]);
				xmlDOM.async = false;
				xmlDOM.loadXML(markup);
				xmlDOM.setProperty('SelectionLanguage', 'XPath');

				return xmlDOM;
			} catch(ex) {
			}
		}
	} else {
		try {
			var domParser = new window['DOMParser']();
			return domParser['parseFromString'](markup, 'text/xml');
		} catch(ex) {
		}
	}

	return null;
}