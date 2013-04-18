Game.HyperAnimKey = function Game_HyperAnimKey() {
    this.mPos = new GameFramework.geom.Vector3();
    this.mRot = new GameFramework.geom.Vector3();
    this.mScale = new GameFramework.geom.Vector3();
}
Game.HyperAnimKey.prototype = {
    mPos : null,
    mRot : null,
    mScale : null
}
Game.HyperAnimKey.staticInit = function Game_HyperAnimKey$staticInit() {
}

JS_AddInitFunc(function() {
    Game.HyperAnimKey.registerClass('Game.HyperAnimKey', null);
});
JS_AddStaticInitFunc(function() {
    Game.HyperAnimKey.staticInit();
});