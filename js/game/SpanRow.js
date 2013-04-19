/**
 * @constructor
 */
Game.SpanRow = function Game_SpanRow() {
    this.mSpans = [];
}
Game.SpanRow.prototype = {
    mSpans : null
}
Game.SpanRow.staticInit = function Game_SpanRow$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.SpanRow.registerClass('Game.SpanRow', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.SpanRow.staticInit();
});