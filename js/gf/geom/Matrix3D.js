GameFramework.geom.Matrix3D = function GameFramework_geom_Matrix3D() {
	this.m = Array.Create2D(4, 4, 16, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
}
GameFramework.geom.Matrix3D.prototype = {
	m : null,
	Identity : function GameFramework_geom_Matrix3D$Identity() {
		this.m[this.m.mIdxMult0 * (0) + 0] = 1;
		this.m[this.m.mIdxMult0 * (0) + 1] = 0;
		this.m[this.m.mIdxMult0 * (0) + 2] = 0;
		this.m[this.m.mIdxMult0 * (0) + 3] = 0;
		this.m[this.m.mIdxMult0 * (1) + 0] = 0;
		this.m[this.m.mIdxMult0 * (1) + 1] = 1;
		this.m[this.m.mIdxMult0 * (1) + 2] = 0;
		this.m[this.m.mIdxMult0 * (1) + 3] = 0;
		this.m[this.m.mIdxMult0 * (2) + 0] = 0;
		this.m[this.m.mIdxMult0 * (2) + 1] = 0;
		this.m[this.m.mIdxMult0 * (2) + 2] = 1;
		this.m[this.m.mIdxMult0 * (2) + 3] = 0;
		this.m[this.m.mIdxMult0 * (3) + 0] = 0;
		this.m[this.m.mIdxMult0 * (3) + 1] = 0;
		this.m[this.m.mIdxMult0 * (3) + 2] = 0;
		this.m[this.m.mIdxMult0 * (3) + 3] = 1;
	},
	CopyFrom : function GameFramework_geom_Matrix3D$CopyFrom(theMatrix) {
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
				this.m[this.m.mIdxMult0 * (i) + j] = theMatrix.m[theMatrix.m.mIdxMult0 * (i) + j];
			}
		}
	},
	Append : function GameFramework_geom_Matrix3D$Append(lhs) {
		var i;
		var j;
		for(i = 0; i < 4; i++) {
			for(j = 0; j < 4; j++) {
				GameFramework.geom.Matrix3D.aTemp[GameFramework.geom.Matrix3D.aTemp.mIdxMult0 * (i) + j] = this.m[this.m.mIdxMult0 * (i) + j];
			}
		}
		for(i = 0; i < 4; i++) {
			for(j = 0; j < 4; j++) {
				var x = 0;
				for(var k = 0; k < 4; k++) {
					x += lhs.m[lhs.m.mIdxMult0 * (i) + k] * GameFramework.geom.Matrix3D.aTemp[GameFramework.geom.Matrix3D.aTemp.mIdxMult0 * (k) + j];
				}
				this.m[this.m.mIdxMult0 * (i) + j] = x;
			}
		}
	}
}
GameFramework.geom.Matrix3D.staticInit = function GameFramework_geom_Matrix3D$staticInit() {
	GameFramework.geom.Matrix3D.aTemp = Array.Create2D(4, 4, null);
}

JSFExt_AddInitFunc(function() {
	GameFramework.geom.Matrix3D.registerClass('GameFramework.geom.Matrix3D', null);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.geom.Matrix3D.staticInit();
});