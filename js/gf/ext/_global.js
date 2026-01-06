// log flag
var TRACE = true;

// Debug with file:// url
// chrome need add --allow-file-access-from-files option
var LOCAL_DEBUG = true;

// global reference of app, gl and context
var gApp;
var gGL = null;
var gCTX = null;

// global canvas reference
var gCanvas = null;

// default gl state
var gDefault2DShaderProgram;
var gGlobalVertexShader;
var gWriteDepth = 1.0;

// shader want to be used in next flush
var gWantShaderProgram;

// shader, tex and write depth currently used
var gLastShaderProgram;
var gLastTex;
var gLastWriteDepth;
var gAdditive;

// for non-webgl mode
var gCanvasHasTrans = false;
var gCanvasAdditive = false;
var gCanvasAlpha = 1.0;
var gCanvasAllowAdditive = true;

// dummy tex
var gWhiteDotTex;

// vertex buffer and counter
// actually, the tex coordinates is saved in vertex buffer zw components
var positionBuffer;
var positionArray;
var vertexIndex = 0;

// color buffer and counter
var colorBuffer;
var colorArray;
var colorIndex = 0;

// normal buffer and index buffer
var normalBuffer;
var texCoords0Buffer;
var texCoords1Buffer;
var indexBuffer;

// game loop control variables
var gLastTime = new Date().getTime();
var gTimeAcc = 0;
var gColorAcc = 0.2;
var gTimeScale = 1.0;
var gCatchExceptions = true;

// viewport size
var gDeferredNewWidth;
var gDeferredNewHeight;

///////////////////////////////////////////////////////////////////////////////
// XMLHttpRequest

if (!window.XMLHttpRequest) {
    window.XMLHttpRequest = function () {
        var progIDs = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];

        for (var i = 0; i < progIDs.length; i++) {
            try {
                var xmlHttp = new ActiveXObject(progIDs[i]);
                return xmlHttp;
            } catch (ex) {}
        }

        return null;
    };
}
