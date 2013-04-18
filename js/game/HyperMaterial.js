Game.HyperMaterial = function Game_HyperMaterial(theAmbient, theDiffuse, theSpecular, thePower) {
    if(theAmbient === undefined) {
        theAmbient = null;
    }
    if(theDiffuse === undefined) {
        theDiffuse = null;
    }
    if(theSpecular === undefined) {
        theSpecular = null;
    }
    if(thePower === undefined) {
        thePower = 0;
    }
    this.ambient = (theAmbient != null) ? theAmbient : Array.Create(4, null);
    this.diffuse = (theDiffuse != null) ? theDiffuse : Array.Create(4, null);
    this.specular = (theSpecular != null) ? theSpecular : Array.Create(4, null);
    this.power = thePower;
}
Game.HyperMaterial.prototype = {
    ambient : null,
    diffuse : null,
    specular : null,
    power : 0
}
Game.HyperMaterial.staticInit = function Game_HyperMaterial$staticInit() {
}

JS_AddInitFunc(function() {
    Game.HyperMaterial.registerClass('Game.HyperMaterial', null);
});
JS_AddStaticInitFunc(function() {
    Game.HyperMaterial.staticInit();
});