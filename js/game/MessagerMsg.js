Game.MessagerMsg = function Game_MessagerMsg() {
}
Game.MessagerMsg.prototype = {
    Text : null,
    LifeLeft : 0,
    TextColor : 0
}
Game.MessagerMsg.staticInit = function Game_MessagerMsg$staticInit() {
}

JS_AddInitFunc(function() {
    Game.MessagerMsg.registerClass('Game.MessagerMsg', null);
});
JS_AddStaticInitFunc(function() {
    Game.MessagerMsg.staticInit();
});