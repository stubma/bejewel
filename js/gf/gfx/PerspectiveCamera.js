GameFramework.gfx.PerspectiveCamera = function GameFramework_gfx_PerspectiveCamera(inFovDegrees, inAspectRatio, inZNear, inZFar) {
	if(inFovDegrees === undefined) {
		inFovDegrees = 0;
	}
	if(inAspectRatio === undefined) {
		inAspectRatio = 0;
	}
	if(inZNear === undefined) {
		inZNear = 1.0;
	}
	if(inZFar === undefined) {
		inZFar = 10000.0;
	}
	GameFramework.gfx.PerspectiveCamera.initializeBase(this);
	if(inFovDegrees == 0) {
		this.mProjS = new GameFramework.geom.Vector3(0, 0, 0);
		this.mProjT = 0;
	} else {
		this.Init(inFovDegrees, inAspectRatio, inZNear, inZFar);
	}
}
GameFramework.gfx.PerspectiveCamera.prototype = {
	mProjS : null,
	mProjT : 0,
	Init : function GameFramework_gfx_PerspectiveCamera$Init(inFovDegrees, inAspectRatio, inZNear, inZFar) {
		if(inZNear === undefined) {
			inZNear = 1.0;
		}
		if(inZFar === undefined) {
			inZFar = 10000.0;
		}
		var aAngleX = (inFovDegrees * 0.5) * Math.PI / 180.0;
		var aAngleY = aAngleX / inAspectRatio;
		this.mProjS.y = Math.cos(aAngleY) / Math.sin(aAngleY);
		this.mProjS.x = this.mProjS.y / inAspectRatio;
		this.mProjS.z = inZFar / (inZFar - inZNear);
		this.mProjT = -this.mProjS.z * inZNear;
		this.mZNear = inZNear;
		this.mZFar = inZFar;
	},
	GetProjectionMatrix : function GameFramework_gfx_PerspectiveCamera$GetProjectionMatrix(outM) {
		if(outM == null) {
			return;
		}
		outM.Identity();
		outM.m[outM.m.mIdxMult0 * (0) + 0] = this.mProjS.x;
		outM.m[outM.m.mIdxMult0 * (1) + 1] = this.mProjS.y;
		outM.m[outM.m.mIdxMult0 * (2) + 2] = this.mProjS.z;
		outM.m[outM.m.mIdxMult0 * (2) + 3] = 1.0;
		outM.m[outM.m.mIdxMult0 * (3) + 2] = this.mProjT;
		outM.m[outM.m.mIdxMult0 * (3) + 3] = 0.0;
	},
	IsOrtho : function GameFramework_gfx_PerspectiveCamera$IsOrtho() {
		return false;
	},
	IsPerspective : function GameFramework_gfx_PerspectiveCamera$IsPerspective() {
		return true;
	},
	EyeToScreen : function GameFramework_gfx_PerspectiveCamera$EyeToScreen(inEyePos) {
		var aResult = new GameFramework.geom.Vector3();
		var negZ = -inEyePos.z;
		aResult.x = inEyePos.x * this.mProjS.x / negZ;
		aResult.y = inEyePos.y * this.mProjS.y / negZ;
		aResult.z = (negZ * this.mProjS.z + this.mProjT) / this.mZFar;
		aResult.x = (aResult.x * 0.5) + 0.5;
		aResult.y = (aResult.y * -0.5) + 0.5;
		return aResult;
	}
}
GameFramework.gfx.PerspectiveCamera.staticInit = function GameFramework_gfx_PerspectiveCamera$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.gfx.PerspectiveCamera.registerClass('GameFramework.gfx.PerspectiveCamera', GameFramework.gfx.Camera);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.gfx.PerspectiveCamera.staticInit();
});