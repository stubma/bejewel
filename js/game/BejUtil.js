Game.BejUtil = function Game_BejUtil() {};
Game.BejUtil.GetGemColorImage = function Game_BejUtil$GetGemColorImage(theColor) {
    switch (theColor) {
        case Game.DM.EGemColor.BLUE: {
            return Game.Resources["IMAGE_GEMS_BLUE"];
        }
        case Game.DM.EGemColor.GREEN: {
            return Game.Resources["IMAGE_GEMS_GREEN"];
        }
        case Game.DM.EGemColor.ORANGE: {
            return Game.Resources["IMAGE_GEMS_ORANGE"];
        }
        case Game.DM.EGemColor.PURPLE: {
            return Game.Resources["IMAGE_GEMS_PURPLE"];
        }
        case Game.DM.EGemColor.RED: {
            return Game.Resources["IMAGE_GEMS_RED"];
        }
        case Game.DM.EGemColor.WHITE: {
            return Game.Resources["IMAGE_GEMS_WHITE"];
        }
        case Game.DM.EGemColor.YELLOW: {
            return Game.Resources["IMAGE_GEMS_YELLOW"];
        }
    }
    JS_Assert(false);
    return Game.Resources["IMAGE_GEMS_WHITE"];
};
Game.BejUtil.GetGemColorImageShadow = function Game_BejUtil$GetGemColorImageShadow(theColor) {
    switch (theColor) {
        case Game.DM.EGemColor.BLUE: {
            return Game.Resources["IMAGE_GEMSSHADOW_BLUE"];
        }
        case Game.DM.EGemColor.GREEN: {
            return Game.Resources["IMAGE_GEMSSHADOW_GREEN"];
        }
        case Game.DM.EGemColor.ORANGE: {
            return Game.Resources["IMAGE_GEMSSHADOW_ORANGE"];
        }
        case Game.DM.EGemColor.PURPLE: {
            return Game.Resources["IMAGE_GEMSSHADOW_PURPLE"];
        }
        case Game.DM.EGemColor.RED: {
            return Game.Resources["IMAGE_GEMSSHADOW_RED"];
        }
        case Game.DM.EGemColor.WHITE: {
            return Game.Resources["IMAGE_GEMSSHADOW_WHITE"];
        }
        case Game.DM.EGemColor.YELLOW: {
            return Game.Resources["IMAGE_GEMSSHADOW_YELLOW"];
        }
    }
    JS_Assert(false);
    return Game.Resources["IMAGE_GEMSSHADOW_WHITE"];
};
Game.BejUtil.prototype = {};
Game.BejUtil.staticInit = function Game_BejUtil$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.BejUtil.registerClass("Game.BejUtil", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.BejUtil.staticInit();
});
