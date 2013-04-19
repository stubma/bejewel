GameFramework.gfx.JSGraphics3D = function GameFramework_gfx_JSGraphics3D(aJSGraphics) {
	this.mViewMatrix = new GameFramework.geom.Matrix3D();
	this.mWorldMatrix = new GameFramework.geom.Matrix3D();
	this.mProjMatrix = new GameFramework.geom.Matrix3D();
	this.mWrapU = Array.Create(3, 3, false, false, false);
	this.mWrapV = Array.Create(3, 3, false, false, false);
	GameFramework.gfx.JSGraphics3D.initializeBase(this, [aJSGraphics]);
}
GameFramework.gfx.JSGraphics3D.prototype = {
	mViewMatrix : null,
	mWorldMatrix : null,
	mProjMatrix : null,
	mWrapU : null,
	mWrapV : null,
	Setup2DDrawing : function GameFramework_gfx_JSGraphics3D$Setup2DDrawing(theDrawDepth) {
		if(theDrawDepth === undefined) {
			theDrawDepth = 0.0;
		}
		//JS
		JSFExt_Setup2DDrawing(theDrawDepth);
		//-JS
	},
	End2DDrawing : function GameFramework_gfx_JSGraphics3D$End2DDrawing() {
		//JS
		JSFExt_End2DDrawing();
		//-JS
	},
	SetViewTransform : function GameFramework_gfx_JSGraphics3D$SetViewTransform(theTransform) {
		this.mViewMatrix.CopyFrom(theTransform);
	},
	SetProjectionTransform : function GameFramework_gfx_JSGraphics3D$SetProjectionTransform(theTransform) {
		this.mProjMatrix.CopyFrom(theTransform);
	},
	SetWorldTransform : function GameFramework_gfx_JSGraphics3D$SetWorldTransform(theTransform) {
		this.mWorldMatrix.CopyFrom(theTransform);
	},
	SetTexture : function GameFramework_gfx_JSGraphics3D$SetTexture(inTextureIndex, inImage) {
		//JS
		if(inTextureIndex != 0) {
			gGL.activeTexture(gGL.TEXTURE0 + inTextureIndex);
		}
		if(inImage != null) {
			gGL.bindTexture(gGL.TEXTURE_2D, inImage.mGLTex);
			gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_S, this.mWrapU[inTextureIndex] ? gGL.REPEAT : gGL.CLAMP_TO_EDGE);
			gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_T, this.mWrapV[inTextureIndex] ? gGL.REPEAT : gGL.CLAMP_TO_EDGE);
		} else {
			gGL.bindTexture(gGL.TEXTURE_2D, null);
		}
		if(inTextureIndex != 0) {
			gGL.activeTexture(gGL.TEXTURE0);
		}
		//-JS
		return true;
	},
	SetTextureWrap : function GameFramework_gfx_JSGraphics3D$SetTextureWrap(inTextureIndex, inWrap) {
		if(inWrap === undefined) {
			inWrap = true;
		}
		this.SetTextureWrapUV(inTextureIndex, inWrap, inWrap);
	},
	SetTextureWrapUV : function GameFramework_gfx_JSGraphics3D$SetTextureWrapUV(inTextureIndex, inWrapU, inWrapV) {
		if(inWrapU === undefined) {
			inWrapU = true;
		}
		if(inWrapV === undefined) {
			inWrapV = true;
		}
		this.mWrapU[inTextureIndex] = inWrapU;
		this.mWrapV[inTextureIndex] = inWrapV;
	},
	SetBlend : function GameFramework_gfx_JSGraphics3D$SetBlend(theSrcBlend, theDestBlend) {
		//JS
		JSFExt_SetBlend(theSrcBlend, theDestBlend);
		//-JS
	},
	SetBackfaceCulling : function GameFramework_gfx_JSGraphics3D$SetBackfaceCulling(cullClockwise, cullCounterClockwise) {
		if(cullClockwise || cullCounterClockwise) {
			//JS
			gGL.enable(gGL.CULL_FACE);
			if(cullClockwise & cullCounterClockwise) {
				gGL.cullFace(gGL.FRONT_AND_BACK);
			} else if(cullClockwise) {
				gGL.cullFace(gGL.BACK);
			} else if(cullCounterClockwise) {
				gGL.cullFace(gGL.FRONT);
			}
			//-JS
		} else {
			//JS
			gGL.disable(gGL.CULL_FACE);
			//-JS
		}
	},
	SetDepthState : function GameFramework_gfx_JSGraphics3D$SetDepthState(theDepthCompare, depthWriteEnable) {
		//JS
		if(depthWriteEnable || (theDepthCompare != GameFramework.gfx.Graphics3D.ECompareFunc.Always)) {
			gGL.enable(gGL.DEPTH_TEST);

			if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.Always) {
				gGL.depthFunc(gGL.ALWAYS);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.Less) {
				gGL.depthFunc(gGL.LESS);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.LessEqual) {
				gGL.depthFunc(gGL.LEQUAL);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.Greater) {
				gGL.depthFunc(gGL.GREATER);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.GreaterEqual) {
				gGL.depthFunc(gGL.GEQUAL);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.Equal) {
				gGL.depthFunc(gGL.EQUAL);
			} else if(theDepthCompare == GameFramework.gfx.Graphics3D.ECompareFunc.Never) {
				gGL.depthFunc(gGL.NEVER);
			}
		}

		gGL.depthMask(depthWriteEnable);
		//-JS
	},
	ClearDepthBuffer : function GameFramework_gfx_JSGraphics3D$ClearDepthBuffer() {
		//JS
		gGL.depthMask(true);
		gGL.clearDepth(1.0);
		gGL.clear(gGL.DEPTH_BUFFER_BIT);
		//-JS
	},
	RenderMesh : function GameFramework_gfx_JSGraphics3D$RenderMesh(theMeshResource) {
		//JS
		JSFExt_RenderMesh(this, theMeshResource, this.mWorldMatrix, this.mViewMatrix, this.mProjMatrix);
		//-JS
	}
}
GameFramework.gfx.JSGraphics3D.staticInit = function GameFramework_gfx_JSGraphics3D$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.gfx.JSGraphics3D.registerClass('GameFramework.gfx.JSGraphics3D', GameFramework.gfx.Graphics3D);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.gfx.JSGraphics3D.staticInit();
});