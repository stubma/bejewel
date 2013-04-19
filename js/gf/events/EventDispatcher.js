GameFramework.events.EventDispatcher = function GameFramework_events_EventDispatcher() {
	this.mListeners = {};
}
GameFramework.events.EventDispatcher.prototype = {
	mListeners : null,
	AddEventListener : function GameFramework_events_EventDispatcher$AddEventListener(theType, theCallback) {
		if(!this.mListeners.hasOwnProperty(theType)) {
			this.mListeners[theType] = [];
		}
		(this.mListeners[theType]).push(theCallback);
	},
	HasEventListener : function GameFramework_events_EventDispatcher$HasEventListener(theType) {
		return this.mListeners.hasOwnProperty(theType);
	},
	DispatchEvent : function GameFramework_events_EventDispatcher$DispatchEvent(theEvent) {
		if(this.mListeners == null) {
			return;
		}
		theEvent.target = this;
		if(!this.mListeners.hasOwnProperty(theEvent.type)) {
			return;
		}

		{
			var $enum1 = ss.IEnumerator.getEnumerator(this.mListeners[theEvent.type]);
			while($enum1.moveNext()) {
				var aCallback = $enum1.get_current();
				aCallback.invoke(theEvent);
			}
		}
	},
	Dispose : function GameFramework_events_EventDispatcher$Dispose() {
		this.mListeners = null;
	}
}
GameFramework.events.EventDispatcher.staticInit = function GameFramework_events_EventDispatcher$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.events.EventDispatcher.registerClass('GameFramework.events.EventDispatcher', null, System.IDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.events.EventDispatcher.staticInit();
});