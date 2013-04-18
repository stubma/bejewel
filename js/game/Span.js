/**
 * @constructor
 */
Game.Span = function Game_Span() {
}
Game.Span.prototype = {
    mStartX : 0,
    mEndX : 0,
    mStartY : 0,
    mEndY : 0
}
Game.Span.staticInit = function Game_Span$staticInit() {
}

JS_AddInitFunc(function() {
    Game.Span.registerClass('Game.Span', null);
});
JS_AddStaticInitFunc(function() {
    Game.Span.staticInit();
});