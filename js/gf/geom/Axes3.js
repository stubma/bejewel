GameFramework.geom.Axes3 = function GameFramework_geom_Axes3(inX, inY, inZ) {
	if(inX === undefined) {
		inX = null;
	}
	if(inY === undefined) {
		inY = null;
	}
	if(inZ === undefined) {
		inZ = null;
	}
	this.vX = (inX != null) ? inX : new GameFramework.geom.Vector3(1, 0, 0);
	this.vY = (inY != null) ? inY : new GameFramework.geom.Vector3(0, 1, 0);
	this.vZ = (inZ != null) ? inZ : new GameFramework.geom.Vector3(0, 0, 1);
}
GameFramework.geom.Axes3.prototype = {
	vX : null,
	vY : null,
	vZ : null,
	CopyFrom : function GameFramework_geom_Axes3$CopyFrom(theAxes3) {
		this.vX = theAxes3.vX;
		this.vY = theAxes3.vY;
		this.vZ = theAxes3.vZ;
	},
	Duplicate : function GameFramework_geom_Axes3$Duplicate() {
		return new GameFramework.geom.Axes3(this.vX, this.vY, this.vZ);
	},
	Enter : function GameFramework_geom_Axes3$Enter(inAxes) {
		return new GameFramework.geom.Axes3(this.vX.Enter(inAxes), this.vY.Enter(inAxes), this.vZ.Enter(inAxes));
	},
	Leave : function GameFramework_geom_Axes3$Leave(inAxes) {
		return new GameFramework.geom.Axes3(this.vX.Leave(inAxes), this.vY.Leave(inAxes), this.vZ.Leave(inAxes));
	},
	Inverse : function GameFramework_geom_Axes3$Inverse() {
		return new GameFramework.geom.Axes3().Enter(this);
	},
	OrthoNormalize : function GameFramework_geom_Axes3$OrthoNormalize() {
		var a = new GameFramework.geom.Axes3(this.vX, this.vY, this.vZ);
		a.vX = a.vY.Cross(a.vZ).Normalize();
		a.vY = a.vZ.Cross(a.vX).Normalize();
		a.vZ = a.vX.Cross(a.vY).Normalize();
		return a;
	},
	DeltaTo : function GameFramework_geom_Axes3$DeltaTo(inAxes) {
		return inAxes.Inverse().Leave(this);
	},
	SlerpTo : function GameFramework_geom_Axes3$SlerpTo(inAxes, inAlpha, inFastButLessAccurate) {
		if(inFastButLessAccurate === undefined) {
			inFastButLessAccurate = false;
		}
		return GameFramework.geom.Quat3.Slerp(GameFramework.geom.Quat3.CreateFromAxes(this), GameFramework.geom.Quat3.CreateFromAxes(inAxes), inAlpha, inFastButLessAccurate).GetAxes3();
	},
	RotateRadAxis : function GameFramework_geom_Axes3$RotateRadAxis(inRot, inNormalizedAxis) {
		var a = GameFramework.geom.Quat3.AxisAngle(inNormalizedAxis, inRot).GetAxes3();
		this.CopyFrom(this.Leave(a));
	},
	RotateRadX : function GameFramework_geom_Axes3$RotateRadX(inRot) {
		var sinRot = Math.sin(inRot);
		var cosRot = Math.cos(inRot);
		var a = new GameFramework.geom.Axes3();
		a.vY.y = cosRot;
		a.vZ.y = -sinRot;
		a.vY.z = sinRot;
		a.vZ.z = cosRot;
		this.CopyFrom(this.Leave(a));
	},
	RotateRadY : function GameFramework_geom_Axes3$RotateRadY(inRot) {
		var sinRot = Math.sin(inRot);
		var cosRot = Math.cos(inRot);
		var a = new GameFramework.geom.Axes3();
		a.vX.x = cosRot;
		a.vX.z = -sinRot;
		a.vZ.x = sinRot;
		a.vZ.z = cosRot;
		this.CopyFrom(this.Leave(a));
	},
	RotateRadZ : function GameFramework_geom_Axes3$RotateRadZ(inRot) {
		var sinRot = Math.sin(inRot);
		var cosRot = Math.cos(inRot);
		var a = new GameFramework.geom.Axes3();
		a.vX.x = cosRot;
		a.vX.y = sinRot;
		a.vY.x = -sinRot;
		a.vY.y = cosRot;
		this.CopyFrom(this.Leave(a));
	},
	LookAt : function GameFramework_geom_Axes3$LookAt(inTargetDir, inUpVector) {
		var tempZ = inTargetDir.Normalize();
		if(Math.abs(inUpVector.Dot(tempZ)) > (1.0 - 0.00001)) {
			return;
		}
		var a = new GameFramework.geom.Axes3();
		a.vZ = tempZ;
		a.vX = inUpVector.Cross(a.vZ).Normalize();
		a.vY = a.vZ.Cross(a.vX).Normalize();
		this.CopyFrom(this.Leave(a));
	}
}
GameFramework.geom.Axes3.staticInit = function GameFramework_geom_Axes3$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.geom.Axes3.registerClass('GameFramework.geom.Axes3', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.geom.Axes3.staticInit();
});