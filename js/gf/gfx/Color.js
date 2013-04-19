GameFramework.gfx.Color = function GameFramework_gfx_Color(r, g, b, a) {
	this.mRed = r;
	this.mGreen = g;
	this.mBlue = b;
	this.mAlpha = a;
}
GameFramework.gfx.Color.CreateFromRGB = function GameFramework_gfx_Color$CreateFromRGB(r, g, b) {
	return new GameFramework.gfx.Color(r, g, b, 255);
}
GameFramework.gfx.Color.CreateFromInt = function GameFramework_gfx_Color$CreateFromInt(theColorInt) {
	return new GameFramework.gfx.Color(((theColorInt >>> 16) | 0) & 0xff, ((theColorInt >>> 8) | 0) & 0xff, (theColorInt | 0) & 0xff, ((theColorInt >>> 24) | 0) & 0xff);
}
GameFramework.gfx.Color.CreateFromIntAlpha = function GameFramework_gfx_Color$CreateFromIntAlpha(theColorInt, theAlpha) {
	return new GameFramework.gfx.Color(((theColorInt >>> 16) | 0) & 0xff, ((theColorInt >>> 8) | 0) & 0xff, (theColorInt | 0) & 0xff, (theAlpha | 0) & 0xff);
}
GameFramework.gfx.Color.CreateFromFAlpha = function GameFramework_gfx_Color$CreateFromFAlpha(theAlpha) {
	return GameFramework.gfx.Color.CreateFromInt(0xffffff | ((((255.0 * theAlpha) | 0)) << 24));
}
GameFramework.gfx.Color.FAlphaToInt = function GameFramework_gfx_Color$FAlphaToInt(theAlpha) {
	return 0xffffff | ((((255.0 * theAlpha) | 0)) << 24);
}
GameFramework.gfx.Color.GetAlphaFromInt = function GameFramework_gfx_Color$GetAlphaFromInt(theColor) {
	return ((0xff & (theColor >>> 24))) / 255.0;
}
GameFramework.gfx.Color.RGBAToInt = function GameFramework_gfx_Color$RGBAToInt(r, g, b, a) {
	return (((a << 24) | (r << 16) | (g << 8) | (b)) | 0);
}
GameFramework.gfx.Color.UInt_AToInt = function GameFramework_gfx_Color$UInt_AToInt(rgb, a) {
	return ((((a | 0) << 24) | (rgb & 0xffffff)) | 0);
}
GameFramework.gfx.Color.UInt_FAToInt = function GameFramework_gfx_Color$UInt_FAToInt(rgb, a) {
	return (((((a * 255) | 0) << 24) | (rgb & 0xffffff)) | 0);
}
GameFramework.gfx.Color.RGBToInt = function GameFramework_gfx_Color$RGBToInt(r, g, b) {
	return ((((0xff000000 | 0)) | ((r | 0) << 16) | ((g | 0) << 8) | ((b | 0))) | 0);
}
GameFramework.gfx.Color.HSLAToInt = function GameFramework_gfx_Color$HSLAToInt(h, s, l, a) {
	var r;
	var g;
	var b;
	var v = (l < 128) ? (((l * (255 + s)) / 255) | 0) : (l + s - ((l * s / 255) | 0));
	var y = ((2 * l - v) | 0);
	var aColorDiv = (((6 * h) / 256) | 0);
	var x = ((y + (v - y) * ((h - (((aColorDiv * 256 / 6) | 0))) * 6) / 255) | 0);
	if(x > 255) {
		x = 255;
	}
	var z = ((v - (v - y) * ((h - (((aColorDiv * 256 / 6) | 0))) * 6) / 255) | 0);
	if(z < 0) {
		z = 0;
	}
	switch(aColorDiv) {
		case 0:
		{
			r = (v | 0);
			g = x;
			b = y;
			break;
		}
		case 1:
		{
			r = z;
			g = (v | 0);
			b = y;
			break;
		}
		case 2:
		{
			r = y;
			g = (v | 0);
			b = x;
			break;
		}
		case 3:
		{
			r = y;
			g = z;
			b = (v | 0);
			break;
		}
		case 4:
		{
			r = x;
			g = y;
			b = (v | 0);
			break;
		}
		case 5:
		{
			r = (v | 0);
			g = y;
			b = z;
			break;
		}
		default:
		{
			r = (v | 0);
			g = x;
			b = y;
			break;
		}
	}
	return (((a << 24) | (r << 16) | (g << 8) | (b)) | 0);
}
GameFramework.gfx.Color.Mult = function GameFramework_gfx_Color$Mult(theColor, theColorMult) {
	if(theColor == 0xffffffff) {
		return theColorMult;
	}
	if(theColorMult == 0xffffffff) {
		return theColor;
	}
	var aResult = (((((((theColor >>> 24) & 0xff) * ((theColorMult >>> 24) & 0xff)) / 255) | 0)) << 24) | (((((((theColor >>> 16) & 0xff) * ((theColorMult >>> 16) & 0xff)) / 255) | 0)) << 16) | (((((((theColor >>> 8) & 0xff) * ((theColorMult >>> 8) & 0xff)) / 255) | 0)) << 8) | ((((((theColor) & 0xff) * ((theColorMult) & 0xff)) / 255) | 0));
	return aResult;
}
GameFramework.gfx.Color.prototype = {
	mRed : 0,
	mGreen : 0,
	mBlue : 0,
	mAlpha : 0,
	ToInt : function GameFramework_gfx_Color$ToInt() {
		return GameFramework.gfx.Color.RGBAToInt(this.mRed, this.mGreen, this.mBlue, this.mAlpha);
	},
	Clone : function GameFramework_gfx_Color$Clone() {
		return new GameFramework.gfx.Color(this.mRed, this.mGreen, this.mBlue, this.mAlpha);
	}
}
GameFramework.gfx.Color.staticInit = function GameFramework_gfx_Color$staticInit() {
	GameFramework.gfx.Color.BLACK = new GameFramework.gfx.Color(0, 0, 0, 255);
	GameFramework.gfx.Color.WHITE = new GameFramework.gfx.Color(255, 255, 255, 255);
	GameFramework.gfx.Color.BLACK_RGB = GameFramework.gfx.Color.BLACK.ToInt();
	GameFramework.gfx.Color.WHITE_RGB = GameFramework.gfx.Color.WHITE.ToInt();
}

JSFExt_AddInitFunc(function() {
	GameFramework.gfx.Color.registerClass('GameFramework.gfx.Color', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.gfx.Color.staticInit();
});