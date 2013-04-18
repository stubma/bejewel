//Src:C:\p4_managed\PrimeSharp\prime\Bejeweled\Background.cs
//LineMap:2=3 5=18 7=19 13=22 27=31 30=209 32=208 33=208 34=33 35=55 37=58 39=210 41=214 42=216 44=95 46=104 50=109 57=117 59=120 65=127 76=137 87=40 95=49 96=51 98=54 102=59 103=61 107=144 121=157 137=174 143=181 145=184 155=195 168=226 175=248 178=252 183=259 189=268 
//LineMap:190=277 196=284 199=288 204=294 209=298 211=304 219=311 223=314 230=319 237=323 242=327 249=331 251=334 256=342 259=346 261=349 268=357 273=363 278=369 282=379 283=381 290=386 292=391 301=399 305=404 309=412 312=421 317=441 319=444 321=447 325=454 327=458 332=464 
//LineMap:337=470 342=476 344=476 345=478 347=485 349=488 351=493 355=515 362=524 365=526 371=66 372=75 373=84 374=92 
//Start:Bej3Button
/**
 * @constructor
 */
Game.Bej3Button = function Game_Bej3Button(theId) {
    Game.Bej3Button.initializeBase(this, [theId]);
}
Game.Bej3Button.prototype = {
    mScale : 1.0,
    Draw : function Game_Bej3Button$Draw(g) {
        if(this.mScale != 1.0) {
            g.PushScale(this.mScale, this.mScale, this.mWidth / 2, this.mHeight / 2);
        }
        GameFramework.widgets.ButtonWidget.prototype.Draw.apply(this, [g]);
        if(this.mScale != 1.0) {
            g.PopMatrix();
        }
    }
}
Game.Bej3Button.staticInit = function Game_Bej3Button$staticInit() {
}

JS_AddInitFunc(function() {
    Game.Bej3Button.registerClass('Game.Bej3Button', GameFramework.widgets.ButtonWidget);
});
JS_AddStaticInitFunc(function() {
    Game.Bej3Button.staticInit();
});