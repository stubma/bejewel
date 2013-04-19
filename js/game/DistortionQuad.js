/**
 * @constructor
 */
Game.DistortionQuad = function Game_DistortionQuad(inX1, inY1, inX2, inY2) {
    this.x1 = inX1;
    this.y1 = inY1;
    this.x2 = inX2;
    this.y2 = inY2;
}
Game.DistortionQuad.prototype = {
    x1 : 0,
    y1 : 0,
    x2 : 0,
    y2 : 0
}
Game.DistortionQuad.staticInit = function Game_DistortionQuad$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.DistortionQuad.registerClass('Game.DistortionQuad', null);
});
JSFExt_AddStaticInitFunc(function() {
    Game.DistortionQuad.staticInit();
});