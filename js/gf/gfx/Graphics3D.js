GameFramework.gfx.Graphics3D = function GameFramework_gfx_Graphics3D(theGraphics) {
	this.mGraphics = theGraphics;
}
GameFramework.gfx.Graphics3D.prototype = {
	mGraphics : null,
	Dispose : function GameFramework_gfx_Graphics3D$Dispose() {
		this.mGraphics.End3DScene(this);
	},
	Setup2DDrawing : function GameFramework_gfx_Graphics3D$Setup2DDrawing(theDrawDepth) {
		if(theDrawDepth === undefined) {
			theDrawDepth = 0.0;
		}
	},
	End2DDrawing : function GameFramework_gfx_Graphics3D$End2DDrawing() {
	},
	SetViewTransform : function GameFramework_gfx_Graphics3D$SetViewTransform(theTransform) {
	},
	SetProjectionTransform : function GameFramework_gfx_Graphics3D$SetProjectionTransform(theTransform) {
	},
	SetWorldTransform : function GameFramework_gfx_Graphics3D$SetWorldTransform(theTransform) {
	},
	SetTexture : function GameFramework_gfx_Graphics3D$SetTexture(inTextureIndex, inImage) {
		return false;
	},
	SetTextureWrap : function GameFramework_gfx_Graphics3D$SetTextureWrap(inTextureIndex, inWrap) {
		if(inWrap === undefined) {
			inWrap = true;
		}
	},
	SetTextureWrapUV : function GameFramework_gfx_Graphics3D$SetTextureWrapUV(inTextureIndex, inWrapU, inWrapV) {
		if(inWrapU === undefined) {
			inWrapU = true;
		}
		if(inWrapV === undefined) {
			inWrapV = true;
		}
	},
	SetBlend : function GameFramework_gfx_Graphics3D$SetBlend(theSrcBlend, theDestBlend) {
	},
	SetBackfaceCulling : function GameFramework_gfx_Graphics3D$SetBackfaceCulling(cullClockwise, cullCounterClockwise) {
	},
	SetDepthState : function GameFramework_gfx_Graphics3D$SetDepthState(theDepthCompare, depthWriteEnable) {
	},
	ClearDepthBuffer : function GameFramework_gfx_Graphics3D$ClearDepthBuffer() {
	},
	RenderMesh : function GameFramework_gfx_Graphics3D$RenderMesh(theMeshResource) {
	}
}
GameFramework.gfx.Graphics3D.staticInit = function GameFramework_gfx_Graphics3D$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.gfx.Graphics3D.registerClass('GameFramework.gfx.Graphics3D', null, System.IDisposable);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.gfx.Graphics3D.staticInit();
});
GameFramework.gfx.Graphics3D.ECompareFunc = {};
GameFramework.gfx.Graphics3D.ECompareFunc.staticInit = function GameFramework_gfx_Graphics3D_ECompareFunc$staticInit() {
	GameFramework.gfx.Graphics3D.ECompareFunc.Never = 1;
	GameFramework.gfx.Graphics3D.ECompareFunc.Less = 2;
	GameFramework.gfx.Graphics3D.ECompareFunc.Equal = 3;
	GameFramework.gfx.Graphics3D.ECompareFunc.LessEqual = 4;
	GameFramework.gfx.Graphics3D.ECompareFunc.Greater = 5;
	GameFramework.gfx.Graphics3D.ECompareFunc.GreaterEqual = 6;
	GameFramework.gfx.Graphics3D.ECompareFunc.Always = 7;
}
JSFExt_AddInitFunc(function() {
	GameFramework.gfx.Graphics3D.ECompareFunc.staticInit();
});
GameFramework.gfx.Graphics3D.EBlend = {};
GameFramework.gfx.Graphics3D.EBlend.staticInit = function GameFramework_gfx_Graphics3D_EBlend$staticInit() {
	GameFramework.gfx.Graphics3D.EBlend.Zero = 1;
	GameFramework.gfx.Graphics3D.EBlend.One = 2;
	GameFramework.gfx.Graphics3D.EBlend.SrcColor = 3;
	GameFramework.gfx.Graphics3D.EBlend.InvSrcColor = 4;
	GameFramework.gfx.Graphics3D.EBlend.SrcAlpha = 5;
	GameFramework.gfx.Graphics3D.EBlend.InvSrcAlpha = 6;
	GameFramework.gfx.Graphics3D.EBlend.DestAlpha = 7;
	GameFramework.gfx.Graphics3D.EBlend.InvDestAlpha = 8;
	GameFramework.gfx.Graphics3D.EBlend.DestColor = 9;
	GameFramework.gfx.Graphics3D.EBlend.InvDestColor = 10;
	GameFramework.gfx.Graphics3D.EBlend.SrcAlphaSat = 11;
	GameFramework.gfx.Graphics3D.EBlend.Default = 0xffff;
}
JSFExt_AddInitFunc(function() {
	GameFramework.gfx.Graphics3D.EBlend.staticInit();
});