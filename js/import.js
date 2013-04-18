Importer = new Object();
Importer._scriptName = typeof(__IMPORTER__) == "undefined" ? "js/import.js" : "import.js";

// get script location of import.js
Importer._getScriptLocation = function() {
    var scriptLocation = "";
    var SCRIPT_NAME = Importer._scriptName;

    var scripts = document.getElementsByTagName('script');
    for(var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute('src');
        if(src) {
            var index = src.lastIndexOf(SCRIPT_NAME);
            // is it found, at the end of the URL?
            if((index > -1) && (index + SCRIPT_NAME.length == src.length)) {
                scriptLocation = src.slice(0, -SCRIPT_NAME.length);
                break;
            }
        }
    }
    return scriptLocation;
}

/*
 The original code appeared to use a try/catch block
 to avoid polluting the global namespace,
 we now use a anonymous function to achieve the same result.
 */
if(typeof(__IMPORTER__) == "undefined") {
    (function() {
        var jsfiles = new Array(
            "soundmanager2.js",
            "jquery-1.9.1.js",
            "JSGameFramework_ext.js",
            "GameFramework.js",
            "JSGameFramework.js",
            "Bejeweled.js",
            "main.js"
        );

        var allScriptTags = "";
        var host = Importer._getScriptLocation() + "js/";

        for(var i = 0; i < jsfiles.length; i++) {
            if(/MSIE/.test(navigator.userAgent) || /Safari/.test(navigator.userAgent)) {
                var currentScriptTag = "<script src='" + host + jsfiles[i] + "'></script>";
                allScriptTags += currentScriptTag;
            } else {
                var s = document.createElement("script");
                s.src = host + jsfiles[i];
                var h = document.getElementsByTagName("body").length ? document.getElementsByTagName("body")[0] : document.body;
                h.appendChild(s);
            }
        }
        if(allScriptTags) {
            document.write(allScriptTags);
        }
    })();
}