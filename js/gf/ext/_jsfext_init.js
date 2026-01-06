// the flag indicating JSFExt_Init is called
var gDidJSFExtInit = false;

// webkit call
var gWebKitAnimationCall;

// global init for html5 environment
function JSFExt_Init(theApp, theCanvas) {
    // global reference of app and canvas
    gApp = theApp;
    gCanvas = theCanvas;

    // get webgl context if using webgl
    if (theApp.mUseGL) {
        var gl_attribs = {
            alpha: true,
            depth: true,
            stencil: false,
            antialias: false,
            premultipliedAlpha: false,
        };

        try {
            gGL = theCanvas.getContext("experimental-webgl", gl_attribs);
            theCanvas.addEventListener(
                "webglcontextlost",
                function (event) {
                    JSFExt_Reinit();
                },
                false
            );
            theCanvas.addEventListener("webglcontextrestored", JSFExt_Reinit, false);
        } catch (e) {}
        if (gGL == null) {
            theApp.mUseGL = false;
        }
    }

    // init gl state if using webgl
    if (theApp.mUseGL) {
        gGL.viewportWidth = theCanvas.width;
        gGL.viewportHeight = theCanvas.height;

        gGL.clearColor(0.0, 0.5, 0.0, 1.0);
        gGL.enable(gGL.BLEND);

        gGL.activeTexture(gGL.TEXTURE0);

        positionBuffer = gGL.createBuffer();
        positionArray = new Float32Array(1024 * 4);

        colorBuffer = gGL.createBuffer();
        colorArray = new Float32Array(1024 * 4);

        normalBuffer = gGL.createBuffer();
        texCoords0Buffer = gGL.createBuffer();
        texCoords1Buffer = gGL.createBuffer();
        indexBuffer = gGL.createBuffer();

        initShaders();
        gGL.uniform1i(gLastShaderProgram.samplerUniform, 0);
        gGL.blendFunc(gGL.SRC_ALPHA, gGL.ONE_MINUS_SRC_ALPHA);

        var aWhitePixels = new Uint8Array([255, 255, 255, 255]);
        gWhiteDotTex = CreateGLTexPixels(1, 1, aWhitePixels);
    }

    // install event handlers
    document.onkeypress = JSFExt_OnKeyPress;
    document.onkeydown = JSFExt_OnKeyDown;
    document.onkeyup = JSFExt_OnKeyUp;
    theCanvas.addEventListener("mousedown", JSFExt_OnMouseDown, false);
    theCanvas.addEventListener("mouseup", JSFExt_OnMouseUp, false);
    theCanvas.addEventListener("mousemove", JSFExt_OnMouseMove, false);
    document.addEventListener("webkitvisibilitychange", JSFExt_OnVisibilityChange, false);
    window.addEventListener(
        "touchmove",
        function (event) {
            event.preventDefault();
            JSFExt_OnMouseMove(event);
        },
        false
    );
    window.addEventListener(
        "touchstart",
        function (event) {
            event.preventDefault();
            JSFExt_OnMouseDown(event);
        },
        false
    );
    window.addEventListener(
        "touchend",
        function (event) {
            event.preventDefault();
            JSFExt_OnMouseUp(event);
        },
        false
    );

    // set flag
    gDidJSFExtInit = true;
}
window["JSFExt_Init"] = JSFExt_Init;

// main game loop, responsible for triggering updating and drawing
function JSFExt_Timer() {
    var aCurTime = new Date().getTime();
    gTimeAcc += (aCurTime - gLastTime) * gTimeScale;
    gLastTime = aCurTime;
    if (gTimeAcc >= 500) {
        gTimeAcc = 500;
    }
    if (gApp != null && !gApp.mExecutionStopped) {
        var anItr = 0;
        var didUpdate = false;
        while (gTimeAcc >= gApp.mFrameTime) {
            if (gCatchExceptions) {
                try {
                    gApp.Update();
                } catch (e) {
                    gApp.HandleException(e);
                }
            } else {
                gApp.Update();
            }
            gTimeAcc -= gApp.mFrameTime;
            if (++anItr >= 50) {
                break;
            }
            didUpdate = true;
        }
        if (didUpdate && gDidJSFExtInit) {
            if (gGL) {
                if (gDeferredNewWidth) {
                    gGL.viewport(0, 0, gDeferredNewWidth, gDeferredNewHeight);
                    gDeferredNewWidth = 0;
                    gDeferredNewHeight = 0;
                }

                if (gColorAcc > 0.5) {
                    gColorAcc = 0;
                }
                gGL.clearColor(0.0, 0.0, 0.1, 1.0);

                gGL.colorMask(1, 1, 1, 1); // Note the last '0' disables writing to dest-alpha
                gGL.clear(gGL.COLOR_BUFFER_BIT);
                gGL.colorMask(1, 1, 1, 0); // Note the last '0' disables writing to dest-alpha
                gLastTex = null;
            }
            gCTX = document.getElementById("GameCanvas").getContext("2d");
            if (gCatchExceptions) {
                try {
                    gApp.Draw();
                } catch (e) {
                    gApp.HandleException(e);
                }
            } else {
                gApp.Draw();
            }
            JSFExt_Flush();
            if (gGL) {
                gGL.colorMask(1, 1, 1, 1); // Note the last '0' disables writing to dest-alpha
                gGL.flush();
            }
        }
    }
    if (gWebKitAnimationCall) {
        gWebKitAnimationCall(JSFExt_Timer);
    }
}
window["JSFExt_Timer"] = JSFExt_Timer;

// reload page
function JSFExt_Reload() {
    window.location.reload();
}

// reload page
function JSFExt_Reinit() {
    window.location.href = window.location.href;
}

// class init and static init entry list
var gInitFunc = [];
var gStaticInitFunc = [];

// add class init entry
function JSFExt_AddInitFunc(theFunc) {
    gInitFunc[gInitFunc.length] = theFunc;
}

// add class static init entry
function JSFExt_AddStaticInitFunc(theFunc) {
    gStaticInitFunc[gStaticInitFunc.length] = theFunc;
}

// init all classes, it will be called from main.js
function JSFExt_InitClasses() {
    for (var i = 0; i < gInitFunc.length; i++) {
        gInitFunc[i]();
    }
    for (var i = 0; i < gStaticInitFunc.length; i++) {
        gStaticInitFunc[i]();
    }
}
window["JSFExt_InitClasses"] = JSFExt_InitClasses;

// use webkit animation call or not
if (typeof webkitRequestAnimationFrame == "function") {
    gWebKitAnimationCall = webkitRequestAnimationFrame;
} else if (typeof window.mozRequestAnimationFrame == "function") {
    gWebKitAnimationCall = window.mozRequestAnimationFrame;
}

// if has webkitRequestAnimationFrame, use it, or use setInterval
if (gWebKitAnimationCall) {
    gWebKitAnimationCall(JSFExt_Timer);
} else {
    setInterval("JSFExt_Timer()", 16);
}
