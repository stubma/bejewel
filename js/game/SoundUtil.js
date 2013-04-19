Game.SoundUtil = function Game_SoundUtil() {
}
Game.SoundUtil.Play = function Game_SoundUtil$Play(theSound) {
	Game.SoundUtil.PlayEx(theSound, 0.0, 1.0);
}
Game.SoundUtil.PlayEx = function Game_SoundUtil$PlayEx(theSound, thePan, theVolume) {
	GameFramework.BaseApp.mApp.PlaySoundEx(theSound, theVolume, thePan);
}
Game.SoundUtil.PlayVoice = function Game_SoundUtil$PlayVoice(theSound) {
	Game.SoundUtil.PlayVoiceEx(theSound, 0.0, 1.0, -1);
}
Game.SoundUtil.PlayVoiceEx = function Game_SoundUtil$PlayVoiceEx(theSound, thePan, theVolume, theInterruptId) {
	if(Game.SoundUtil.mIgnoreSound) {
		return;
	}
	Game.SoundUtil.PlayEx(theSound, thePan, theVolume);
	if(Game.SoundUtil.mNextVoice != null) {
	}
}
Game.SoundUtil.prototype = {

}
Game.SoundUtil.staticInit = function Game_SoundUtil$staticInit() {
	Game.SoundUtil.mIgnoreSound = false;
	Game.SoundUtil.mNextVoice = null;
}

JSFExt_AddInitFunc(function() {
	Game.SoundUtil.registerClass('Game.SoundUtil', null);
});
JSFExt_AddStaticInitFunc(function() {
	Game.SoundUtil.staticInit();
});