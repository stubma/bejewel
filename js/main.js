// show chrome installation prompt or not
var gCWSPrompt = false;

// rethrow exception or not
var gReThrowException = false;

// true means an exception is thrown before
var gAlreadyFailed = false;

// get cookie value
function getCookie(name) {
    var theCookies = document.cookie.split(/[; ]+/);
    for (var i = 0; i < theCookies.length; i++) {
        var aName = theCookies[i].substring(0, theCookies[i].indexOf('='));
        if (aName == name) {
            return theCookies[i].substring(name.length + 1);
        }
    }
}

// check html5 support
function isHTML5Supported() {
    if (window.location.href.indexOf('noHTML5') != -1)
        return false;
    return window.HTMLCanvasElement;
}

// use 768 images for some config
function wantsHighRes() {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
        return true; // Accelerated IE?
    if (/CrOS /.test(navigator.userAgent))
        return false; // Chromebook
    return gApp.isUseGL(); // No WebGL on these platforms means no acceleration
}

// resize UI when window changed
function resizeElements() {
	// get element in html
    var aGameDiv = document.getElementById('gamediv');
    var aWaitSpinner = document.getElementById('waitSpinner');
    var aBkgImage = document.getElementById('bkgImage');
    var aGameCanvas = document.getElementById('GameCanvas');
    var aLeftPillar = document.getElementById('leftPillar');
    var aLeftPillarBot = document.getElementById('leftPillarBot');
    var aRightPillar = document.getElementById('rightPillar');
    var aRightPillarBot = document.getElementById('rightPillarBot');
    var aSorryContainer = document.getElementById('sorry-container');
    var anInstallContainer = document.getElementById('install-container');
    var aLegal = document.getElementById('legal');

	// get window size, or just use client size
    var anInnerWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
    var anInnerHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;

	// hide progress timer
    aWaitSpinner.style.visibility = "hidden";
    aWaitSpinner.style.left = "-2000px";

	// disable drag for background image parent
    aBkgImage.parentNode.draggable = false;

	// default background size is 1920x1080, so calculate the scale to get
	// the final background size
    var aWidthScale = anInnerWidth / 1920;
    var aHeightScale = anInnerHeight / 1080;
    var aWantScale = Math.max(1.0, Math.max(aWidthScale, aHeightScale));
    var aBkgWidth = (1920 * aWantScale) | 0;
    var aBkgHeight = (1080 * aWantScale) | 0;

	// background image offset
    aBkgImage.style.width = aBkgWidth + "px";
    aBkgImage.style.height = aBkgHeight + "px";
    aBkgImage.style.left = (((anInnerWidth - aBkgWidth) / 2) | 0) + "px";
    aBkgImage.style.top = (((anInnerHeight - aBkgHeight) / 2) | 0) + "px";
    aBkgImage.draggable = false;

	// set game div size to window size
    aGameDiv.style.width = anInnerWidth + "px";
    aGameDiv.style.height = anInnerHeight + "px";
    if (/Chrome/.test(navigator.userAgent))
        aGameDiv.style.overflow = "visible";

	// if no html5 support, show sorry UI
    if (!isHTML5Supported()) {
        aSorryContainer.style.visibility = "visible";
        return;
    }

	// if no chrome web container, show install prompt UI
    if (gCWSPrompt) {
        anInstallContainer.style.visibility = "visible";
        return;
    } else {
        anInstallContainer.style.visibility = "hidden";
    }

	// proper canvas height, and width should 4/3 of height
    var aCanvasHeight = Math.min(gApp.getArtRes(), (anInnerHeight - 40));
    aGameCanvas.height = aCanvasHeight;
    aGameCanvas.width = aGameCanvas.height * 4 / 3;

	// trigger size changed to app
    gApp.onSizeChanged(aGameCanvas.width, aGameCanvas.height);

	// canvas left and top offset
    var aCanvasLeft = ((anInnerWidth - aGameCanvas.width) / 2) | 0;
    var aCanvasTop = Math.min((((anInnerHeight - aGameCanvas.height) / 2) | 0), anInnerHeight - aGameCanvas.height - 25);

	// apply left and top offset to canvas
    aGameCanvas.style.left = aCanvasLeft + "px";
    aGameCanvas.style.top = aCanvasTop + "px";
    aGameCanvas.draggable = false;

	// legal info offset
    aLegal.style.top = (aCanvasTop + aCanvasHeight - 8) + "px";

	// left pillar offset
    var aPillarTop = Math.max(anInnerHeight / 2.5 - 520, anInnerHeight - 1400) | 0;
    var aLeftPillarLeft = (Math.min(0, aCanvasLeft - Math.max(500, 320 + anInnerWidth / 6))) | 0;
    aLeftPillar.style.top = aPillarTop + "px";
    aLeftPillar.style.left = aLeftPillarLeft + "px";
    aLeftPillar.draggable = false;

	// left bottom pillar offset
    aLeftPillarBot.style.top = (aPillarTop + 482) + "px";
    aLeftPillarBot.style.left = (aLeftPillarLeft + 287) + "px";

	// right pillar offset
    aRightPillar.style.top = aPillarTop + "px";
    aRightPillar.style.left = (anInnerWidth - aLeftPillarLeft - 506) + "px";
    aRightPillar.draggable = false;

	// right bottom pillar offset
    aRightPillarBot.style.top = (aPillarTop + 482) + "px";
    aRightPillarBot.style.left = (anInnerWidth - aLeftPillarLeft - 506 + 15) + "px";
    aRightPillarBot.draggable = false;

	// if border is large enough, show pillar images
    if (/Chrome/.test(navigator.userAgent)) {
        var isScaled = (window.outerWidth - window.innerWidth > 50);
        if (isScaled) {
            aLeftPillar.style.visibility = "hidden";
            aLeftPillarBot.style.visibility = "hidden";
            aRightPillar.style.visibility = "hidden";
            aRightPillarBot.style.visibility = "hidden";
        } else {
            aLeftPillar.style.visibility = "visible";
            aLeftPillarBot.style.visibility = "visible";
            aRightPillar.style.visibility = "visible";
            aRightPillarBot.style.visibility = "visible";
        }
    }
}

// show error page when exception occurs
function handleException(e) {
    var aGameCanvas = document.getElementById('GameCanvas');
    var aSorryContainerError = document.getElementById('sorry-container-error');
    aGameCanvas.style.visibility = 'hidden';
    aSorryContainerError.style.visibility = 'visible';
    if (!gAlreadyFailed) {
        var aType = e.type ? e.type : "error";
        var aStack = e.stackStr ? e.stackStr : e.stack ? e.stack.replaceAll('\n', '').substring(0, 1024) : "";
        var aMessage = e.message;
        if (e.GetDetails) {
            aMessage = e.GetDetails();
            aType = "loadingError";
        }
		TRACE && ss.Debug.writeln("error msg: " + aMessage);
		TRACE && ss.Debug.writeln("stack:" + aStack);
        gAlreadyFailed = true;
    }
    return !gReThrowException;
}

function showHelp() {
    window.open("http://localhost");
}

// bootstrap
function startup() {
    gCWSPrompt = false;

	// user id
    var aUserId = getCookie('user_id');
    if (aUserId != null)
        gApp.setUserId(aUserId);

	// user agent
    gApp.setUserAgent(navigator.userAgent);

	// debug mode or not
    if (window.location.href.indexOf('debug') != -1) {
        gApp.setDebugMode(true);
    }

	// webgl or not
    if (window.location.href.indexOf('nogl') != -1)
        gApp.setUseGL(false);
    else
        gApp.setUseGL(true);

	// save app reference to curApp
	if (typeof (curApp) == "undefined")
		curApp = gApp;

	// html5 or not
    if (isHTML5Supported()) {
        JSFExt_Init(gApp, document.getElementById('GameCanvas'));
    } else {
        if (window['JSFExt_MinInit'])
            window['JSFExt_MinInit'](gApp);
    }

	// high resolution or not
    if (!wantsHighRes())
        gApp.setArtRes(480);

	// if not webgl, access different set of resources
    if (!gApp.isUseGL())
        gApp.setPathPrefix('../html5canvas/');

	// init app
    gApp.init();

	// start load resource if html5 supported, or failed directly
    if(isHTML5Supported()) {
        gApp.startLoad();
    } else {
        gApp.submitStandardMetricsDict("startup_failed", null, false);
    }

	// relayout
    resizeElements();
}

// some window handler for resize and sound event
window.onresize = resizeElements;
window.JSFExt_SoundManagerReady = function() {
};
window.JSFExt_SoundError = function() {
	gApp.onException(Error("SoundManager2 error"))
};

// setup sound manager
soundManager.debugMode = false;
soundManager.flashVersion = 9;
soundManager.useHighPerformance = true;
soundManager.flashLoadTimeout = 0;
soundManager.waitForWindowLoad = true;
soundManager.onload = JSFExt_SoundManagerReady;
soundManager.onerror = JSFExt_SoundError;

// init classes
JS_Init();

// create app instance
gApp = new Game.BejApp();

// no binary hack for resources
JFSExt_SetRequiresBinaryHack(false);

// conf url, metrics url
gApp.setThrottlingURL("http://localhost/~maruojie/bejewel/properties/jew.conf");
gApp.setMetricsURL("http://localhost/~maruojie");

// exception handler
gApp.setExceptionCallback(handleException);

// check chrome app installed or not
if ((!/Chrome/.test(navigator.userAgent)) || (chrome.app.isInstalled)) {
    startup();
} else {
    gCWSPrompt = true;
    resizeElements();
}

// layout when loaded
var aLeftPillar = document.getElementById('leftPillar');
aLeftPillar.onload = resizeElements;
var aLeftPillarBot = document.getElementById('leftPillarBot');
aLeftPillarBot.onload = resizeElements;

alert('sd');