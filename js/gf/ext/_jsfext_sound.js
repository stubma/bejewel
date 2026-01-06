var gSoundManagerReady = false;

function JSFExt_AudioSetVolume(theSound, theVolume) {
    theSound.setVolume(theVolume * 100);
}

function JSFExt_SoundManagerReady() {
    gSoundManagerReady = true;
}
window["JSFExt_SoundManagerReady"] = JSFExt_SoundManagerReady;

function JSFExt_SoundLoaded(theId, theStreamer) {
    gApp.ResourceStreamerCompletedCallback(theId, theStreamer);
}

function JSFExt_SoundError() {
    gApp.HandleException(new Error("SoundManager2 error"));
}
window["JSFExt_SoundError"] = JSFExt_SoundError;

function JSFExt_LoadAudio(theStreamer, thePath) {
    //if (aSoundCount > 2)
    //  return;

    if (!soundManager.ok()) {
        // Fake success
        gApp.ResourceStreamerCompletedCallback(anId, theStreamer);
        return;
    }

    var anId = theStreamer.mId;

    if (!soundManager.preferFlash) {
        var aSound = soundManager.createSound({ id: anId, url: thePath, autoLoad: true, multiShot: true });
        JSFExt_SoundLoaded(anId, theStreamer);
    } else {
        var aSound = soundManager.createSound({
            id: anId,
            url: thePath,
            autoLoad: true,
            multiShot: true,
            onload: function () {
                JSFExt_SoundLoaded(anId, theStreamer);
            },
        });
    }
    return aSound;
}

function JSFExt_LoadAudio2(theStreamer, thePath) {
    var anAudio = new Audio(thePath);
    //anAudio.onload = function () { alert("Loaded: " + thePath);  gApp.ResourceStreamerCompletedCallback(anAudio, theStreamer); }
    anAudio.load();
    //anAudio.play();
    gApp.ResourceStreamerCompletedCallback(anAudio, theStreamer);
    return anAudio;
}

var gGlobalVolume = 1.0;

function JSFExt_PlayAudio(s, vol, pan, looping, numSamples) {
    if (s == null) {
        return;
    }
    var aSound = soundManager.getSoundById(s);
    //if (!aSound)
    //  return null;
    if (!aSound) {
        aSound = s;
    }
    var aSettings = { volume: gGlobalVolume * vol * 100, pan: pan * 100, numSamples: numSamples };
    if (looping) {
        aSettings["loops"] = 3;
    }
    aSound.play(aSettings);
    return aSound;
}

function JSFExt_StopAudio(sound) {
    if (sound) {
        sound.stop();
    }
}

function JSFExt_PlayAudio2(s) {
    if (s == null) {
        return;
    }

    for (a = 0; a < audiochannels.length; a++) {
        thistime = new Date();
        if (audiochannels[a]["finished"] < thistime.getTime()) {
            // is this channel finished?
            audiochannels[a]["finished"] = thistime.getTime() + s.duration * 1000;
            //audiochannels[a]['channel'] = s.cloneNode(true);
            audiochannels[a]["channel"].src = s.src;
            audiochannels[a]["channel"].load();

            audiochannels[a]["channel"].play();
            break;
        }
    }
}
