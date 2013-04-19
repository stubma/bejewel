GameFramework.resources.PixelSnapping = {};
GameFramework.resources.PixelSnapping.staticInit = function GameFramework_resources_PixelSnapping$staticInit() {
	GameFramework.resources.PixelSnapping.Never = 0;
	GameFramework.resources.PixelSnapping.Always = 1;
	GameFramework.resources.PixelSnapping.Auto = 2;
	GameFramework.resources.PixelSnapping.Default = 3;
}
JSFExt_AddInitFunc(function() {
	GameFramework.resources.PixelSnapping.staticInit();
});