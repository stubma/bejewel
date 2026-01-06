Game.MathUtil = function Game_MathUtil() {};
Game.MathUtil.Abs = function Game_MathUtil$Abs(theA) {
    return Math.abs(theA);
};
Game.MathUtil.Min = function Game_MathUtil$Min(theA, theB) {
    return Math.min(theA, theB);
};
Game.MathUtil.Max = function Game_MathUtil$Max(theA, theB) {
    return Math.max(theA, theB);
};
Game.MathUtil.prototype = {};
Game.MathUtil.staticInit = function Game_MathUtil$staticInit() {
    Game.MathUtil.PI = 3.141593;
    Game.MathUtil.PI_M2 = 6.283185;
    Game.MathUtil.PI_D2 = 1.570796;
    Game.MathUtil.E = 2.71828;
    Game.MathUtil.EPSILON = 0.001;
    Game.MathUtil.EPSILONSQ = 0.000001;
};

JSFExt_AddInitFunc(function () {
    Game.MathUtil.registerClass("Game.MathUtil", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.MathUtil.staticInit();
});
