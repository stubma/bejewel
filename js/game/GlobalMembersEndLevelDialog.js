Game.GlobalMembersEndLevelDialog = function Game_GlobalMembersEndLevelDialog() {};
Game.GlobalMembersEndLevelDialog.Unkern = function Game_GlobalMembersEndLevelDialog$Unkern(theString) {
    var aString = "";
    for (var i = 0; i < (theString.length | 0); i++) {
        aString += String.fromCharCode(theString.charCodeAt(i)) + "~";
    }
    return aString;
};
Game.GlobalMembersEndLevelDialog.prototype = {};
Game.GlobalMembersEndLevelDialog.staticInit = function Game_GlobalMembersEndLevelDialog$staticInit() {};

JSFExt_AddInitFunc(function () {
    Game.GlobalMembersEndLevelDialog.registerClass("Game.GlobalMembersEndLevelDialog", null);
});
JSFExt_AddStaticInitFunc(function () {
    Game.GlobalMembersEndLevelDialog.staticInit();
});
