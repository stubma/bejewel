GameFramework.XMLParser = function GameFramework_XMLParser() {
	this.mParent = null;
}
GameFramework.XMLParser.prototype = {
	mGroupedChildren : null,
	mChildren : null,
	mAttributes : null,
	mAttribueNames : null,
	mName : null,
	mParent : null,
	ParseXML : function GameFramework_XMLParser$ParseXML(theXMLData) {
		GameFramework.BaseApp.mApp.ParseXML(this, theXMLData);
	},
	Name : function GameFramework_XMLParser$Name() {
		return this.mName;
	},
	GetValue : function GameFramework_XMLParser$GetValue() {
		return this.mName;
	},
	GetChildren : function GameFramework_XMLParser$GetChildren() {
		return this.mChildren;
	},
	GetGroupedChildren : function GameFramework_XMLParser$GetGroupedChildren(key) {
		if(this.mGroupedChildren == null) {
			return new GameFramework.XMLParserList();
		}
		if(this.mGroupedChildren[key] != null) {
			return (this.mGroupedChildren[key]);
		}
		return new GameFramework.XMLParserList();
	},
	GetAttribute : function GameFramework_XMLParser$GetAttribute(theName) {
		if(this.mAttributes == null) {
			return new GameFramework.XMLParserList();
		}
		if(this.mAttributes[theName] == null) {
			return new GameFramework.XMLParserList();
		}
		return (this.mAttributes[theName]);
	},
	GetAttributesLength : function GameFramework_XMLParser$GetAttributesLength() {
		return this.mAttribueNames.length;
	},
	GetAttributeType : function GameFramework_XMLParser$GetAttributeType(theIdx) {
		return (this.mAttribueNames[theIdx]);
	},
	GetAttributeValue : function GameFramework_XMLParser$GetAttributeValue(theIdx) {
		return (this.mAttributes[this.mAttribueNames[theIdx]]);
	}
}
GameFramework.XMLParser.staticInit = function GameFramework_XMLParser$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.XMLParser.registerClass('GameFramework.XMLParser', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.XMLParser.staticInit();
});