GameFramework.geom.Coords3 = function GameFramework_geom_Coords3(inT, inR, inS) {
	if(inT === undefined) {
		inT = null;
	}
	if(inR === undefined) {
		inR = null;
	}
	if(inS === undefined) {
		inS = null;
	}
	this.t = (inT != null) ? inT : new GameFramework.geom.Vector3(0, 0, 0);
	this.r = (inR != null) ? inR : new GameFramework.geom.Axes3();
	this.s = (inS != null) ? inS : new GameFramework.geom.Vector3(1, 1, 1);
}
GameFramework.geom.Coords3.prototype = {
	t : null,
	r : null,
	s : null,
	CopyFrom : function GameFramework_geom_Coords3$CopyFrom(inC) {
		this.t = inC.t;
		this.r = inC.r;
		this.s = inC.s;
		return this;
	},
	Enter : function GameFramework_geom_Coords3$Enter(inCoords) {
		return new GameFramework.geom.Coords3(this.t.Enter$2(inCoords), this.r.Enter(inCoords.r), this.s.Div(inCoords.s));
	},
	Leave : function GameFramework_geom_Coords3$Leave(inCoords) {
		return new GameFramework.geom.Coords3(this.t.Leave$2(inCoords), this.r.Leave(inCoords.r), this.s.Mult(inCoords.s));
	},
	Inverse : function GameFramework_geom_Coords3$Inverse() {
		return new GameFramework.geom.Coords3().Enter(this);
	},
	DeltaTo : function GameFramework_geom_Coords3$DeltaTo(inCoords) {
		return inCoords.Inverse().Leave(this);
	},
	Translate : function GameFramework_geom_Coords3$Translate(inX, inY, inZ) {
		this.t = this.t.Add(new GameFramework.geom.Vector3(inX, inY, inZ));
	},
	RotateRadAxis : function GameFramework_geom_Coords3$RotateRadAxis(inRot, inNormalizedAxis) {
		this.r.RotateRadAxis(inRot, inNormalizedAxis);
	},
	RotateRadX : function GameFramework_geom_Coords3$RotateRadX(inRot) {
		this.r.RotateRadX(inRot);
	},
	RotateRadY : function GameFramework_geom_Coords3$RotateRadY(inRot) {
		this.r.RotateRadY(inRot);
	},
	RotateRadZ : function GameFramework_geom_Coords3$RotateRadZ(inRot) {
		this.r.RotateRadZ(inRot);
	},
	Scale : function GameFramework_geom_Coords3$Scale(inX, inY, inZ) {
		this.s = this.s.Mult(new GameFramework.geom.Vector3(inX, inY, inZ));
	},
	LookAt : function GameFramework_geom_Coords3$LookAt(inTargetPos, inUpVector) {
		var tempZ = this.t.Sub(inTargetPos);
		if(tempZ.ApproxZero()) {
			return false;
		}
		tempZ = tempZ.Normalize();
		if(Math.abs(inUpVector.Dot(tempZ)) > (1.0 - 0.0000001)) {
			return false;
		}
		this.r.vZ = tempZ;
		this.r.vX = inUpVector.Cross(this.r.vZ).Normalize();
		this.r.vY = this.r.vZ.Cross(this.r.vX).Normalize();
		return true;
	},
	LookAt$2 : function GameFramework_geom_Coords3$LookAt$2(inViewPos, inTargetPos, inUpVector) {
		this.t = inViewPos;
		return this.LookAt(inTargetPos, inUpVector);
	},
	GetInboundMatrix : function GameFramework_geom_Coords3$GetInboundMatrix(outM) {
		if(outM == null) {
			return;
		}
		var negT = this.t.Scale(-1.0);
		var vsX = this.r.vX.ScaleDiv(this.s.x);
		var vsY = this.r.vY.ScaleDiv(this.s.y);
		var vsZ = this.r.vZ.ScaleDiv(this.s.z);
		outM.m[outM.m.mIdxMult0 * (0) + 0] = vsX.x;
		outM.m[outM.m.mIdxMult0 * (0) + 1] = vsY.x;
		outM.m[outM.m.mIdxMult0 * (0) + 2] = vsZ.x;
		outM.m[outM.m.mIdxMult0 * (0) + 3] = 0.0;
		outM.m[outM.m.mIdxMult0 * (1) + 0] = vsX.y;
		outM.m[outM.m.mIdxMult0 * (1) + 1] = vsY.y;
		outM.m[outM.m.mIdxMult0 * (1) + 2] = vsZ.y;
		outM.m[outM.m.mIdxMult0 * (1) + 3] = 0.0;
		outM.m[outM.m.mIdxMult0 * (2) + 0] = vsX.z;
		outM.m[outM.m.mIdxMult0 * (2) + 1] = vsY.z;
		outM.m[outM.m.mIdxMult0 * (2) + 2] = vsZ.z;
		outM.m[outM.m.mIdxMult0 * (2) + 3] = 0.0;
		outM.m[outM.m.mIdxMult0 * (3) + 0] = negT.Dot(vsX);
		outM.m[outM.m.mIdxMult0 * (3) + 1] = negT.Dot(vsY);
		outM.m[outM.m.mIdxMult0 * (3) + 2] = negT.Dot(vsZ);
		outM.m[outM.m.mIdxMult0 * (3) + 3] = 1.0;
	},
	GetOutboundMatrix : function GameFramework_geom_Coords3$GetOutboundMatrix(outM) {
		if(outM == null) {
			return;
		}
		outM.m[outM.m.mIdxMult0 * (0) + 0] = this.r.vX.x * this.s.x;
		outM.m[outM.m.mIdxMult0 * (0) + 1] = this.r.vX.y * this.s.x;
		outM.m[outM.m.mIdxMult0 * (0) + 2] = this.r.vX.z * this.s.x;
		outM.m[outM.m.mIdxMult0 * (0) + 3] = 0.0;
		outM.m[outM.m.mIdxMult0 * (1) + 0] = this.r.vY.x * this.s.y;
		outM.m[outM.m.mIdxMult0 * (1) + 1] = this.r.vY.y * this.s.y;
		outM.m[outM.m.mIdxMult0 * (1) + 2] = this.r.vY.z * this.s.y;
		outM.m[outM.m.mIdxMult0 * (1) + 3] = 0.0;
		outM.m[outM.m.mIdxMult0 * (2) + 0] = this.r.vZ.x * this.s.z;
		outM.m[outM.m.mIdxMult0 * (2) + 1] = this.r.vZ.y * this.s.z;
		outM.m[outM.m.mIdxMult0 * (2) + 2] = this.r.vZ.z * this.s.z;
		outM.m[outM.m.mIdxMult0 * (2) + 3] = 0.0;
		outM.m[outM.m.mIdxMult0 * (3) + 0] = this.t.x;
		outM.m[outM.m.mIdxMult0 * (3) + 1] = this.t.y;
		outM.m[outM.m.mIdxMult0 * (3) + 2] = this.t.z;
		outM.m[outM.m.mIdxMult0 * (3) + 3] = 1.0;
	}
}
GameFramework.geom.Coords3.staticInit = function GameFramework_geom_Coords3$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.geom.Coords3.registerClass('GameFramework.geom.Coords3', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.geom.Coords3.staticInit();
});