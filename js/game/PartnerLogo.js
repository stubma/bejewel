Game.PartnerLogo = function Game_PartnerLogo() {
    this.mImage = null;
    this.mTime = 0;
    this.mOrgTime = 0;
    this.mAlpha = 0;
}
Game.PartnerLogo.prototype = {
    mImage : null,
    mTime : 0,
    mOrgTime : 0,
    mAlpha : 0
}
Game.PartnerLogo.staticInit = function Game_PartnerLogo$staticInit() {
}

JS_AddInitFunc(function() {
    Game.PartnerLogo.registerClass('Game.PartnerLogo', null);
});
JS_AddStaticInitFunc(function() {
    Game.PartnerLogo.staticInit();
});