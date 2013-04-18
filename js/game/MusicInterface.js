/**
 * @constructor
 */
Game.MusicInterface = function Game_MusicInterface() {
}
Game.MusicInterface.prototype = {

    QueueEvent : function Game_MusicInterface$QueueEvent(theEvent) {
    },
    QueueEventEx : function Game_MusicInterface$QueueEventEx(theEvent, theMusicTrack, theForceRestart) {
    }
}
Game.MusicInterface.staticInit = function Game_MusicInterface$staticInit() {
}

JS_AddInitFunc(function() {
    Game.MusicInterface.registerClass('Game.MusicInterface', null);
});
JS_AddStaticInitFunc(function() {
    Game.MusicInterface.staticInit();
});