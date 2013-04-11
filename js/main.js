var gCWSPrompt = false;

function getCookie(name) {
    var theCookies = document.cookie.split(/[; ]+/);
    for (var i = 0; i < theCookies.length; i++) {
        var aName = theCookies[i].substring(0, theCookies[i].indexOf('='));
        if (aName == name) {
            return theCookies[i].substring(name.length + 1);
        }
    }
}

function HTML5Supported() {
    if (window.location.href.indexOf('noHTML5') != -1)
        return false;
    return window.HTMLCanvasElement;
}

function wantsHighRes() {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent))
        return true; // Accelerated IE?
    if (/CrOS /.test(navigator.userAgent))
        return false; // Chromebook
    return gApp.isUseGL(); // No WebGL on these platforms means no acceleration
}

function ResizeElements() {
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

    var anInnerWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
    var anInnerHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;

    aWaitSpinner.style.visibility = "hidden";
    aWaitSpinner.style.left = "-2000px";

    aBkgImage.parentNode.draggable = false;

    var aWidthScale = anInnerWidth / 1920;
    var aHeightScale = anInnerHeight / 1080;
    var aWantScale = Math.max(1.0, Math.max(aWidthScale, aHeightScale));

    var aBkgWidth = (1920 * aWantScale) | 0;
    var aBkgHeight = (1080 * aWantScale) | 0;

    aBkgImage.style.width = aBkgWidth + "px";
    aBkgImage.style.height = aBkgHeight + "px";
    aBkgImage.style.left = (((anInnerWidth - aBkgWidth) / 2) | 0) + "px";
    aBkgImage.style.top = (((anInnerHeight - aBkgHeight) / 2) | 0) + "px";
    aBkgImage.draggable = false;

    aGameDiv.style.width = anInnerWidth + "px";
    aGameDiv.style.height = anInnerHeight + "px";
    if (/Chrome/.test(navigator.userAgent))
        aGameDiv.style.overflow = "visible";

    if (!HTML5Supported()) {
        aSorryContainer.style.visibility = "visible";
        return;
    }

    if (gCWSPrompt) {
        anInstallContainer.style.visibility = "visible";
        return;
    }
    else {
        anInstallContainer.style.visibility = "hidden";
    }


    var aCanvasHeight = Math.min(gApp.getArtRes(), (anInnerHeight - 40));

    aGameCanvas.height = aCanvasHeight;
    aGameCanvas.width = aGameCanvas.height * 4 / 3;

    gApp.onSizeChanged(aGameCanvas.width, aGameCanvas.height);

    var aCanvasLeft = ((anInnerWidth - aGameCanvas.width) / 2) | 0;

    var aCanvasTop = Math.min((((anInnerHeight - aGameCanvas.height) / 2) | 0), anInnerHeight - aGameCanvas.height - 25);

    aGameCanvas.style.left = aCanvasLeft + "px";
    aGameCanvas.style.top = aCanvasTop + "px";
    aGameCanvas.draggable = false;

    aLegal.style.top = (aCanvasTop + aCanvasHeight - 8) + "px";

    var aPillarTop = Math.max(anInnerHeight / 2.5 - 520, anInnerHeight - 1400) | 0;
    var aLeftPillarLeft = (Math.min(0, aCanvasLeft - Math.max(500, 320 + anInnerWidth / 6))) | 0;

    aLeftPillar.style.top = aPillarTop + "px";
    aLeftPillar.style.left = aLeftPillarLeft + "px";
    aLeftPillar.draggable = false;

    aLeftPillarBot.style.top = (aPillarTop + 482) + "px";
    aLeftPillarBot.style.left = (aLeftPillarLeft + 287) + "px";

    aRightPillar.style.top = aPillarTop + "px";
    aRightPillar.style.left = (anInnerWidth - aLeftPillarLeft - 506) + "px";
    aRightPillar.draggable = false;

    aRightPillarBot.style.top = (aPillarTop + 482) + "px";
    aRightPillarBot.style.left = (anInnerWidth - aLeftPillarLeft - 506 + 15) + "px";
    aRightPillarBot.draggable = false;

    if (/Chrome/.test(navigator.userAgent)) {
        var isScaled = (window.outerWidth - window.innerWidth > 50);
        if (isScaled) {
            aLeftPillar.style.visibility = "hidden";
            aLeftPillarBot.style.visibility = "hidden";
            aRightPillar.style.visibility = "hidden";
            aRightPillarBot.style.visibility = "hidden";
        }
        else {
            aLeftPillar.style.visibility = "visible";
            aLeftPillarBot.style.visibility = "visible";
            aRightPillar.style.visibility = "visible";
            aRightPillarBot.style.visibility = "visible";
        }
    }
}

// show error page when exception occurs
var gReThrowException = false;
var gAlreadyFailed = false;
function HandleException(e) {
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
        //gApp.submitStandardMetricsDict("error", { "Type": aType, "Message": aMessage, "Stack": aStack }, true, "http://errors.stats.popcap.com");
        gAlreadyFailed = true;
    }
    return !gReThrowException;
}

function ShowHelp() {
    window.open("http://support.popcap.com/bejeweled-html5");
}

function Startup() {
    gCWSPrompt = false;

    var aUserId = getCookie('user_id');
    if (aUserId != null)
        gApp.setUserId(aUserId);
    gApp.setUserAgent(navigator.userAgent);
    if (window.location.href.indexOf('debug') != -1) {
        gApp.setDebugMode(true);
        //gReThrowException = true;
    }
    if (window.location.href.indexOf('nogl') != -1)
        gApp.setUseGL(false);
    else
        gApp.setUseGL(true);
    if (HTML5Supported()) {
        JSFExt_Init(gApp, document.getElementById('GameCanvas'));
    }
    else {
        if (typeof (curApp) == "undefined") // Temporary hack
            curApp = gApp;
        if (window['JSFExt_MinInit'])
            window['JSFExt_MinInit'](gApp);
    }
    if (!wantsHighRes())
        gApp.setArtRes(480);
    if (!gApp.isUseGL())
        gApp.setPathPrefix('../html5canvas/');
    gApp.init();

    if (HTML5Supported()) {
        gApp.startLoad();
    }
    else {
        gApp.submitStandardMetricsDict("startup_failed", null, false);
    }

    ResizeElements();
}

soundManager.debugMode = false;
soundManager.flashVersion = 9;
soundManager.useHighPerformance = true;
soundManager.flashLoadTimeout = 0;
soundManager.waitForWindowLoad = true;
soundManager.onload = JSFExt_SoundManagerReady;
soundManager.onerror = JSFExt_SoundError;

JS_Init();
gApp = new Game.BejApp();
JFSExt_SetRequiresBinaryHack(false);

// gApp.setThrottlingURL("http://gats.popcap.com/bejeweled-html5.json?t=" + (new Date().getTime()));
// gApp.setMetricsURL("http://stats.popcap.com");
gApp.setThrottlingURL("http://localhost/~maruojie/bejewel/properties/jew.conf");
gApp.setMetricsURL("http://localhost/~maruojie");

gApp.setExceptionCallback(HandleException);

if ((!/Chrome/.test(navigator.userAgent)) || (chrome.app.isInstalled)) {
    Startup();
} else {
    gCWSPrompt = true;
    ResizeElements();
}
window.onresize = ResizeElements;

var aLeftPillar = document.getElementById('leftPillar');
aLeftPillar.onload = ResizeElements;
var aLeftPillarBot = document.getElementById('leftPillarBot');
aLeftPillarBot.onload = ResizeElements;

alert('ddd7');