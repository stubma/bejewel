Game.DM = function Game_DM() {
}
Game.DM.prototype = {

}
Game.DM.staticInit = function Game_DM$staticInit() {
    Game.DM.gAutoplayDesc = Array.Create(5, 5, 'Off', 'Random moves', 'Aggressive moves', 'Aggressive with invalid moves', 'Test hyperspace');
    Game.DM.gTutorialNames = Array.Create(18, 18, null, null, 'LASER', 'HYPERCUBE', null, null, 'SUPERNOVA', null, 'CLASSIC_TUTORIAL_VERT_MATCH', 'CLASSIC_TUTORIAL_HORIZ_MATCH', 'CLASSIC_TUTORIAL_SPECIAL_GEM_CREATE', 'CLASSIC_TUTORIAL_SPECIAL_GEM_MATCH', 'CLASSIC_TUTORIAL_HINT_BUTTON', 'CLASSIC_TUTORIAL_MAKE_MORE_MATCHES', 'SPEED_TUTORIAL_BASIC_MATCH', 'SPEED_TUTORIAL_TIMER', 'SPEED_TUTORIAL_TIME_GEM', 'SPEED_TUTORIAL_MULTIPLIER_UP');
    Game.DM.SAVEGAME_VERSION = 17;
    Game.DM.SAVEGAME_VERSION_MIN = 17;
    Game.DM.SAVEBOARD_VERSION = 7;
    Game.DM.SAVEBOARD_VERSION_MIN = 7;
    Game.DM.DEFAULT_COMBO_LEN = 3;
    Game.DM.MAX_COMBO_LEN = 5;
    Game.DM.MAX_COMBO_POWERUP_LEVEL = 3;
    Game.DM.UI_SLIDE_LEFT = -700;
    Game.DM.UI_SLIDE_RIGHT = 1260;
    Game.DM.UI_SLIDE_UP = -400;
    Game.DM.UI_SLIDE_DOWN = 350;
    Game.DM.GRAVITY = 0.275;
    Game.DM.SPEED_TIME1 = 175;
    Game.DM.SPEED_TIME2 = 275;
    Game.DM.SPEED_START_THRESHOLD = 6;
    Game.DM.SPEED_MAX_THRESHOLD = 25;
    Game.DM.SPEED_SCORE_MULT = 50;
    Game.DM.SPEED_TIME_LEFT = 180;
    Game.DM.SPEED_TIME_RIGHT = 100;
    Game.DM.SPEED_MED_THRESHOLD = 0.25;
    Game.DM.SPEED_HIGH_THRESHOLD = 0.75;
    Game.DM.gCommonMTRand = null;
    Game.DM.gArcColors = Array.Create(8, 8, GameFramework.gfx.Color.RGBToInt(255, 96, 96), GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(128, 255, 64), GameFramework.gfx.Color.RGBToInt(225, 225, 128), GameFramework.gfx.Color.RGBToInt(225, 128, 225), GameFramework.gfx.Color.RGBToInt(255, 160, 64), GameFramework.gfx.Color.RGBToInt(48, 160, 255), GameFramework.gfx.Color.RGBToInt(0, 0, 0));
    Game.DM.gCrossoverColors = Array.Create(8, 8, GameFramework.gfx.Color.RGBToInt(255, 200, 200), GameFramework.gfx.Color.RGBToInt(255, 250, 255), GameFramework.gfx.Color.RGBToInt(220, 255, 128), GameFramework.gfx.Color.RGBToInt(255, 255, 200), GameFramework.gfx.Color.RGBToInt(255, 128, 255), GameFramework.gfx.Color.RGBToInt(255, 160, 64), GameFramework.gfx.Color.RGBToInt(80, 200, 255), GameFramework.gfx.Color.RGBToInt(0, 0, 0));
    Game.DM.gAllGemColors = Array.Create(9, null, GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(255, 0, 0), GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(0, 255, 0), GameFramework.gfx.Color.RGBToInt(255, 255, 0), GameFramework.gfx.Color.RGBToInt(255, 0, 255), GameFramework.gfx.Color.RGBToInt(255, 128, 0), GameFramework.gfx.Color.RGBToInt(0, 128, 255), GameFramework.gfx.Color.RGBToInt(255, 255, 255));
    Game.DM.gGemColors = Array.Create(9, null, GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(255, 0, 0), GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(0, 255, 0), GameFramework.gfx.Color.RGBToInt(255, 255, 0), GameFramework.gfx.Color.RGBToInt(255, 0, 255), GameFramework.gfx.Color.RGBToInt(255, 128, 0), GameFramework.gfx.Color.RGBToInt(0, 128, 255), GameFramework.gfx.Color.RGBToInt(255, 255, 255));
    Game.DM.gElectColors = Array.Create(9, null, GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(255, 0, 0), GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(0, 255, 0), GameFramework.gfx.Color.RGBToInt(255, 255, 0), GameFramework.gfx.Color.RGBToInt(255, 0, 255), GameFramework.gfx.Color.RGBToInt(255, 128, 0), GameFramework.gfx.Color.RGBToInt(0, 128, 255), GameFramework.gfx.Color.RGBToInt(255, 255, 255));
    Game.DM.gPointColors = Array.Create(9, null, GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(255, 0, 0), GameFramework.gfx.Color.RGBToInt(255, 255, 255), GameFramework.gfx.Color.RGBToInt(0, 255, 0), GameFramework.gfx.Color.RGBToInt(255, 255, 0), GameFramework.gfx.Color.RGBToInt(255, 0, 255), GameFramework.gfx.Color.RGBToInt(255, 128, 0), GameFramework.gfx.Color.RGBToInt(0, 128, 255), GameFramework.gfx.Color.RGBToInt(255, 255, 255));
    Game.DM.gComboColors = Array.Create(9, null, GameFramework.gfx.Color.RGBToInt(255, 0, 0), GameFramework.gfx.Color.RGBToInt(192, 192, 192), GameFramework.gfx.Color.RGBToInt(0, 224, 0), GameFramework.gfx.Color.RGBToInt(224, 224, 0), GameFramework.gfx.Color.RGBToInt(224, 0, 224), GameFramework.gfx.Color.RGBToInt(255, 128, 0), GameFramework.gfx.Color.RGBToInt(0, 0, 255), GameFramework.gfx.Color.RGBToInt(0, 0, 0), GameFramework.gfx.Color.RGBToInt(255, 255, 255));
    Game.DM.gRankNames = Array.Create(131, 131, 'Novice', 'Apprentice', 'Trainee', 'Beginner', 'Amateur', 'Jr. Appraiser', 'Appraiser', 'Gem Polisher', 'Gem Scraper', 'Gem Grinder', 'Jewel Thief', 'Jewel Scavenger', 'Gem Scrounger', 'Jr. Gemfinder', 'Gemfinder', 'Sr. Gemfinder', 'Jr. Jewelkeep', 'Jewelkeep', 'Master Jewelkeep', 'Gemhunter Lv 1', 'Gemhunter Lv 2', 'Gemhunter Lv 3', 'Gemhunter Lv 4', 'Gemhunter Lv 5', 'Gemcrafter Lv 1', 'Gemcrafter Lv 2', 'Gemcrafter Lv 3', 'Gemcrafter Lv 4', 'Gemcrafter Lv 5', 'Jr. Gemstalker', 'Gemstalker', 'Sr. Gemstalker', 'Topaz Hunter', 'Onyx Hunter', 'Amethyst Hunter', 'Ruby Hunter', 'Emerald Hunter', 'Opal Hunter', 'Sapphire Hunter', 'Diamond Hunter', 'Topaz Blaster', 'Onyx Blaster', 'Amethyst Blaster', 'Ruby Blaster', 'Emerald Blaster', 'Opal Blaster', 'Sapphire Blaster', 'Diamond Blaster', 'Topaz Hoarder', 'Onyx Hoarder', 'Amethyst Hoarder', 'Ruby Hoarder', 'Emerald Hoarder', 'Opal Hoarder', 'Sapphire Hoarder', 'Diamond Hoarder', 'Topaz Master', 'Onyx Master', 'Amethyst Master', 'Ruby Master', 'Emerald Master', 'Opal Master', 'Sapphire Master', 'Diamond Master', 'Lapidary Lv 1', 'Lapidary Lv 2', 'Lapidary Lv 3', 'Lapidary Lv 4', 'Lapidary Lv 5', 'Master Lapidary', 'Supreme Lapidary', 'Ruby Wizard', 'Emerald Wizard', 'Opal Wizard', 'Sapphire Wizard', 'Diamond Wizard', 'Jeweled Wizard', 'Jeweled Mage', 'Jeweled Archmage', 'Jewelcrafter', 'Jewelforger', 'Bronze Blitzer', 'Silver Blitzer', 'Gold Blitzer', 'Platinum Blitzer', 'Bronze Master', 'Silver Master', 'Gold Master', 'Platinum Master', 'Jr. Bejeweler', 'Bejeweler', 'Sr. Bejeweler', 'Master Bejeweler', 'Mega Bejeweler', 'Hyper Bejeweler', 'Ultra Bejeweler', 'Prime Bejeweler', 'Ultimate Bejeweler', 'Bejeweled Regent', 'Bejeweled Demigod', 'Supreme Bejeweler', 'Jewelmagus Lv 1', 'Jewelmagus Lv 2', 'Jewelmagus Lv 3', 'Jewelmagus Lv 4', 'Jewelmagus Lv 5', 'Jewelmagus Lv 6', 'Jewelmagus Lv 7', 'Jewelmagus Lv 8', 'Jewelmagus Lv 9', 'Elder Jewelmagus', 'Jewelknight Lv 1', 'Jewelknight Lv 2', 'Jewelknight Lv 3', 'Jewelknight Lv 4', 'Jewelknight Lv 5', 'Jewelknight Lv 6', 'Jewelknight Lv 7', 'Jewelknight Lv 8', 'Jewelknight Lv 9', 'Elder Jewelknight', 'Bejewelian Lv 1', 'Bejewelian Lv 2', 'Bejewelian Lv 3', 'Bejewelian Lv 4', 'Bejewelian Lv 5', 'Bejewelian Lv 6', 'Bejewelian Lv 7', 'Bejewelian Lv 8', 'Bejewelian Lv 9', 'Elder Bejewelian');
}

JS_AddInitFunc(function() {
    Game.DM.registerClass('Game.DM', null);
});
JS_AddStaticInitFunc(function() {
    Game.DM.staticInit();
});
Game.DM.EGemColor = {};
Game.DM.EGemColor.staticInit = function Game_DM_EGemColor$staticInit() {
    Game.DM.EGemColor._INVALID = -1;
    Game.DM.EGemColor.RED = 0;
    Game.DM.EGemColor.WHITE = 1;
    Game.DM.EGemColor.GREEN = 2;
    Game.DM.EGemColor.YELLOW = 3;
    Game.DM.EGemColor.PURPLE = 4;
    Game.DM.EGemColor.ORANGE = 5;
    Game.DM.EGemColor.BLUE = 6;
    Game.DM.EGemColor.HYPERCUBE = 7;
    Game.DM.EGemColor._COUNT = 8;
}
JS_AddInitFunc(function() {
    Game.DM.EGemColor.staticInit();
});
Game.DM.EStat = {};
Game.DM.EStat.staticInit = function Game_DM_EStat$staticInit() {
    Game.DM.EStat.SECONDS_PLAYED = 0;
    Game.DM.EStat.POINTS = 1;
    Game.DM.EStat.ZEN_POINTS = 2;
    Game.DM.EStat.SKULL_COIN_FLIPS = 3;
    Game.DM.EStat.GEMS_CLEARED = 4;
    Game.DM.EStat.RED_CLEARED = 5;
    Game.DM.EStat.WHITE_CLEARED = 6;
    Game.DM.EStat.GREEN_CLEARED = 7;
    Game.DM.EStat.YELLOW_CLEARED = 8;
    Game.DM.EStat.PURPLE_CLEARED = 9;
    Game.DM.EStat.ORANGE_CLEARED = 10;
    Game.DM.EStat.BLUE_CLEARED = 11;
    Game.DM.EStat.FLAMEGEMS_USED = 12;
    Game.DM.EStat.LASERGEMS_USED = 13;
    Game.DM.EStat.HYPERCUBES_USED = 14;
    Game.DM.EStat.NUM_MOVES = 15;
    Game.DM.EStat.NUM_MOVES_DRAG = 16;
    Game.DM.EStat.NUM_MOVES_CLICK = 17;
    Game.DM.EStat.BLAZING_SPEED_EXPLOSION = 18;
    Game.DM.EStat.FLAMEGEMS_MADE = 19;
    Game.DM.EStat.LASERGEMS_MADE = 20;
    Game.DM.EStat.HYPERCUBES_MADE = 21;
    Game.DM.EStat.NUM_GOOD_MOVES = 22;
    Game.DM.EStat.BLASTGEMS_USED = 23;
    Game.DM.EStat.SPEEDY = 24;
    Game.DM.EStat.INFERNO_COUNT = 25;
    Game.DM.EStat.BIGGESTMATCH = 26;
    Game.DM.EStat.BIGGESTMOVE = 27;
    Game.DM.EStat.MATCHES = 28;
    Game.DM.EStat.CASCADES = 29;
    Game.DM.EStat.BUTTERFLIES_COLLECTED = 30;
    Game.DM.EStat.BIGGEST_MOVE_BUTTERFLIES = 31;
    Game.DM.EStat.SUPERNOVAS_MADE = 32;
    Game.DM.EStat.SUPERNOVAS_USED = 33;
    Game.DM.EStat.POKER_FLUSHES = 34;
    Game.DM.EStat.BIGGEST_GEMS_CLEARED = 35;
    Game.DM.EStat.TIMEGEMS_COLLECTED = 36;
    Game.DM.EStat.ICESTORM_COLUMNS_SMASHED = 37;
    Game.DM.EStat.DIAMONDMINE_ARTIFACTS_COLLECTED = 38;
    Game.DM.EStat.HYPERCUBE_ANNIHILATION = 39;
    Game.DM.EStat.FPS_MAX = 40;
    Game.DM.EStat.FPS_MIN = 41;
    Game.DM.EStat.FPS_SAMPLE_COUNT = 42;
    Game.DM.EStat.FPS_SAMPLE_TOTAL = 43;
    Game.DM.EStat.HINT_USED = 44;
    Game.DM.EStat._COUNT = 45;
}
JS_AddInitFunc(function() {
    Game.DM.EStat.staticInit();
});
Game.DM.EDialog = {};
Game.DM.EDialog.staticInit = function Game_DM_EDialog$staticInit() {
    Game.DM.EDialog.INFO = 0;
    Game.DM.EDialog.TUTORIAL = 1;
    Game.DM.EDialog.HELP = 2;
    Game.DM.EDialog.NEW_GAME = 3;
    Game.DM.EDialog.OPTIONS = 4;
    Game.DM.EDialog.RESET = 5;
    Game.DM.EDialog.AWARD = 6;
    Game.DM.EDialog.OPTION_CONFIRM = 7;
    Game.DM.EDialog.DISCONNECT = 8;
    Game.DM.EDialog.CONNECTING = 9;
    Game.DM.EDialog.NOT_CONNECTED = 10;
    Game.DM.EDialog.QUIT = 11;
    Game.DM.EDialog.RANKBAR = 12;
    Game.DM.EDialog.RANK_AWARD = 13;
    Game.DM.EDialog.MAX_GAMES_PLAYED = 14;
    Game.DM.EDialog.NEED_UPDATE = 15;
    Game.DM.EDialog.STATS_LOGIN = 16;
    Game.DM.EDialog.END_LEVEL = 17;
    Game.DM.EDialog.UNLOCK = 18;
    Game.DM.EDialog.QUEST_HELP = 19;
    Game.DM.EDialog.RECORDS = 20;
    Game.DM.EDialog.MAIN_MENU_CONFIRM = 21;
    Game.DM.EDialog.PLAY_SPEED_CONFIRM = 22;
    Game.DM.EDialog.UNKNOWN_MODAL = 23;
    Game.DM.EDialog._COUNT = 24;
}
JS_AddInitFunc(function() {
    Game.DM.EDialog.staticInit();
});
Game.DM.ETutorial = {};
Game.DM.ETutorial.staticInit = function Game_DM_ETutorial$staticInit() {
    Game.DM.ETutorial.NONE = -1;
    Game.DM.ETutorial.BASICS = 0;
    Game.DM.ETutorial.FLAME = 1;
    Game.DM.ETutorial.LASER = 2;
    Game.DM.ETutorial.HYPERCUBE = 3;
    Game.DM.ETutorial.MULTIPLIER = 4;
    Game.DM.ETutorial.TIME_BONUS = 5;
    Game.DM.ETutorial.SUPERNOVA = 6;
    Game.DM.ETutorial.PLAY_CLASSIC_FIRST = 7;
    Game.DM.ETutorial.CLASSIC_TUTORIAL_VERT_MATCH = 8;
    Game.DM.ETutorial.CLASSIC_TUTORIAL_HORIZ_MATCH = 9;
    Game.DM.ETutorial.CLASSIC_TUTORIAL_SPECIAL_GEM_CREATE = 10;
    Game.DM.ETutorial.CLASSIC_TUTORIAL_SPECIAL_GEM_MATCH = 11;
    Game.DM.ETutorial.CLASSIC_TUTORIAL_HINT_BUTTON = 12;
    Game.DM.ETutorial.CLASSIC_TUTORIAL_MAKE_MORE_MATCHES = 13;
    Game.DM.ETutorial.SPEED_TUTORIAL_BASIC_MATCH = 14;
    Game.DM.ETutorial.SPEED_TUTORIAL_TIMER = 15;
    Game.DM.ETutorial.SPEED_TUTORIAL_TIME_GEM = 16;
    Game.DM.ETutorial.SPEED_TUTORIAL_MULTIPLIER_UP = 17;
    Game.DM.ETutorial._COUNT = 18;
}
JS_AddInitFunc(function() {
    Game.DM.ETutorial.staticInit();
});
Game.DM.EAutoplay = {};
Game.DM.EAutoplay.staticInit = function Game_DM_EAutoplay$staticInit() {
    Game.DM.EAutoplay.None = 0;
    Game.DM.EAutoplay.Random = 1;
    Game.DM.EAutoplay.NoDelay = 2;
    Game.DM.EAutoplay.NoDelayWithInvalidMoves = 3;
    Game.DM.EAutoplay.TestHyper = 4;
    Game.DM.EAutoplay._COUNT = 5;
}
JS_AddInitFunc(function() {
    Game.DM.EAutoplay.staticInit();
});