//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\Bej3Dialog.cs
//LineMap:2=3 5=17 7=16 8=18 19=25 24=29 32=33 35=37 41=44 60=58 63=80 65=67 67=76 68=79 69=81 70=85 77=97 79=100 82=104 85=108 101=112 106=116 108=121 110=124 111=126 112=128 116=133 121=139 123=142 124=144 128=149 135=157 138=161 144=170 146=170 148=177 151=177 152=183 
//LineMap:159=233 163=238 164=240 167=244 182=260 185=264 193=273 197=278 199=287 204=293 224=315 227=321 231=329 241=61 244=63 
//Start:BejApp
/**
 * @constructor
 */
Game.LoadingError = function Game_LoadingError(theDetails) {
    Game.LoadingError.initializeBase(this, [theDetails]);
    this.mDetails = theDetails;
}
Game.LoadingError.prototype = {
    mDetails : null
}
Game.LoadingError.staticInit = function Game_LoadingError$staticInit() {
}

JSFExt_AddInitFunc(function() {
    Game.LoadingError.registerClass('Game.LoadingError', System.Exception);
});
JSFExt_AddStaticInitFunc(function() {
    Game.LoadingError.staticInit();
});