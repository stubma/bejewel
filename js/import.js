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
var jsfiles = new Array(
	"sound/soundmanager2.js",
	"jquery-1.9.1.js",
	"gf/JSGameFramework_ext.js",
	"gf/GameFramework.js",
	"gf/JSGameFramework.js",
	"game/_namespace.js",
	"game/Announcement.js",
	"game/Background.js",
	"game/BackgroundLoader.js",
	"game/BarInstance.js",
	"game/Bej3Button.js",
	"game/Bej3Dialog.js",
	"game/Bej3DialogButton.js",
	"game/Bej3EditWidget.js",
	"game/BejApp.js",
	"game/BejUtil.js",
	"game/Board.js",
	"game/BoardInfo.js",
	"game/CheckMatrixInfo.js",
	"game/ClassicBoard.js",
	"game/ClassicEndLevelDialog.js",
	"game/ColorCycle.js",
	"game/ColorTracker.js",
	"game/CrystalBall.js",
	"game/CurvedAlphaButton.js",
	"game/CurvedValTable.js",
	"game/DeferredSound.js",
	"game/DeferredTutorial.js",
	"game/DialogMgr.js",
	"game/DistortionQuad.js",
	"game/DM.js",
	"game/Effect.js",
	"game/EffectsManager.js",
	"game/ElectroBolt.js",
	"game/ElectrocutedCel.js",
	"game/EndLevelDialog.js",
	"game/FrameButton.js",
	"game/GemInfo.js",
	"game/GemOutlines.js",
	"game/GfxUtil.js",
	"game/GlobalMembersEndLevelDialog.js",
	"game/GlobalMembersHighScoreMgr.js",
	"game/GridData.js",
	"game/GridTileData.js",
	"game/HighScoreEntry.js",
	"game/HighScoreMgr.js",
	"game/HighScoreTable.js",
	"game/HintDialog.js",
	"game/HyperAnimKey.js",
	"game/HyperAnimSequence.js",
	"game/HyperMaterial.js",
	"game/Hyperspace.js",
	"game/HyperspaceFallback.js",
	"game/HyperspaceUltra.js",
	"game/IconButton.js",
	"game/Lightning.js",
	"game/LightningBarFillEffect.js",
	"game/LightningStorm.js",
	"game/LightningZap.js",
	"game/LoadingError.js",
	"game/LoadingScreen.js",
	"game/MainMenu.js",
	"game/MatchSet.js",
	"game/MathUtil.js",
	"game/Messager.js",
	"game/MessagerMsg.js",
	"game/Metrics.js",
	"game/MoveData.js",
	"game/MTRand.js",
	"game/MusicInterface.js",
	"game/OptionsDialog.js",
	"game/ParticleEffect.js",
	"game/PartnerLogo.js",
	"game/Piece.js",
	"game/PieceIter.js",
	"game/Points.js",
	"game/PointsManager.js",
	"game/PopAnimEffect.js",
	"game/Profile.js",
	"game/QuasiRandom.js",
	"game/QueuedMove.js",
	"game/RankBarWidget.js",
	"game/RankUpDialog.js",
	"game/RecordsDialog.js",
	"game/ResourceCache.js",
	"game/Resources.js",
	"game/ScalingIconButton.js",
	"game/SoundUtil.js",
	"game/Span.js",
	"game/SpanRow.js",
	"game/SpeedBoard.js",
	"game/SpeedCollectEffect.js",
	"game/SpeedEndLevelDialog.js",
	"game/SpreadCurve.js",
	"game/StateInfo.js",
	"game/SwapData.js",
	"game/TextButton.js",
	"game/TextNotifyEffect.js",
	"game/TimeBonusEffect.js",
	"game/TimeBonusEffectTop.js",
	"game/Tooltip.js",
	"game/TooltipManager.js",
	"game/TopWidget.js",
	"game/TutorialMgr.js",
	"game/TutorialSequence.js",
	"game/TutorialStep.js",
	"game/Util.js",
	"game/Version.js",
	"main.js"
);
if(typeof(__IMPORTER__) == "undefined") {
	(function() {

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