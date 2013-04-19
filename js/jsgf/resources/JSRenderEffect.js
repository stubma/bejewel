GameFramework.resources.JSRenderEffect = function GameFramework_resources_JSRenderEffect() {
	this.mSettings = {};
	this.mTechniques = {};
	GameFramework.resources.JSRenderEffect.initializeBase(this);
}
GameFramework.resources.JSRenderEffect.prototype = {
	mDataBuffer : null,
	mTechniqueReadData : null,
	mAnnotationData : null,
	mStringsData : null,
	mValuesData : null,
	mPassesData : null,
	mSettingsData : null,
	mShadersData : null,
	mStringDataOffset : 0,
	mSettings : null,
	mCurPass : null,
	mTechniques : null,
	GetString : function GameFramework_resources_JSRenderEffect$GetString(theIndex) {
		if(theIndex == -1) {
			return null;
		}
		this.mDataBuffer.set_Position(this.mStringsData.mOffset + theIndex * 4 * 3);
		var aNumChars = this.mDataBuffer.ReadInt();
		var aFormat = this.mDataBuffer.ReadInt();
		var anOffset = this.mDataBuffer.ReadInt();
		this.mDataBuffer.set_Position(this.mStringDataOffset + anOffset);
		return this.mDataBuffer.ReadAsciiBytes(aNumChars);
	},
	ReadShader : function GameFramework_resources_JSRenderEffect$ReadShader(theShaderIdx) {
		if(theShaderIdx == -1) {
			return null;
		}
		this.mDataBuffer.set_Position(this.mShadersData.mOffset + theShaderIdx * 4 * 3);
		var aFormatStrIdx = this.mDataBuffer.ReadInt();
		var aDataStrIdx = this.mDataBuffer.ReadInt();
		var anEntryStrIdx = this.mDataBuffer.ReadInt();
		var aFormat = this.GetString(aFormatStrIdx);
		var aData = this.GetString(aDataStrIdx);
		var anEntry = this.GetString(anEntryStrIdx);
		return aData;
	},
	ReadData : function GameFramework_resources_JSRenderEffect$ReadData(theDataBuffer) {
		this.mDataBuffer = theDataBuffer;
		var anId = theDataBuffer.ReadInt();
		var aVersion = theDataBuffer.ReadInt();
		this.mTechniqueReadData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mAnnotationData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mStringsData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mValuesData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mPassesData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mSettingsData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mShadersData = new GameFramework.resources.JSRenderEffectBlock(theDataBuffer.ReadInt(), theDataBuffer.ReadInt(), theDataBuffer.ReadInt());
		this.mStringDataOffset = theDataBuffer.ReadInt();
		for(var aTechniqueIdx = 0; aTechniqueIdx < this.mTechniqueReadData.mCount; aTechniqueIdx++) {
			this.mDataBuffer.set_Position(this.mTechniqueReadData.mOffset + aTechniqueIdx * 4 * 6);
			var aJSRenderEffectTechnique = new GameFramework.resources.JSRenderEffectTechnique();
			var aNameStrIdx = this.mDataBuffer.ReadInt();
			var aTechniqueNum = this.mDataBuffer.ReadInt();
			var aNumPasses = this.mDataBuffer.ReadInt();
			var aPassStartIdx = this.mDataBuffer.ReadInt();
			var aNumAnnotations = this.mDataBuffer.ReadInt();
			var anAnnotationStartIdx = this.mDataBuffer.ReadInt();
			var aName = this.GetString(aNameStrIdx);
			for(var aPassIdx = 0; aPassIdx < aNumPasses; aPassIdx++) {
				this.mDataBuffer.set_Position(this.mPassesData.mOffset + (aPassStartIdx + aPassIdx) * 4 * 7);
				var aPassNameStrIdx = this.mDataBuffer.ReadInt();
				var aPassNumAnnotations = this.mDataBuffer.ReadInt();
				var aPassAnnotationStartIdx = this.mDataBuffer.ReadInt();
				var aPassNumSettings = this.mDataBuffer.ReadInt();
				var aPassSettingStartIdx = this.mDataBuffer.ReadInt();
				var aVertexShader = this.mDataBuffer.ReadInt();
				var aPixelShader = this.mDataBuffer.ReadInt();
				for(var aSettingIdx = 0; aSettingIdx < aPassNumSettings; aSettingIdx++) {
					this.mDataBuffer.set_Position(this.mSettingsData.mOffset + (aPassSettingStartIdx + aSettingIdx) * 4 * 5);
					var aCategory = this.mDataBuffer.ReadInt();
					var aType = this.mDataBuffer.ReadInt();
					var aNumSettingAnnotations = this.mDataBuffer.ReadInt();
					var aSettingAnnotationStartIdx = this.mDataBuffer.ReadInt();
					var aValueBegin = this.mDataBuffer.ReadInt();
				}
				var aJSRenderEffectPass = new GameFramework.resources.JSRenderEffectPass();
				var aVertexShaderStr = this.ReadShader(aVertexShader);
				var aPixelShaderStr = this.ReadShader(aPixelShader);
				if(aVertexShaderStr != null) {
					var anIdx = aVertexShaderStr.indexOf('attribute vec3 position');
					aVertexShaderStr = aVertexShaderStr.insert(anIdx, 'attribute vec3 normal;\n');
					aVertexShaderStr = aVertexShaderStr.replaceAll('vec3(gl_Normal)', 'normal');
				}
				//JS
				aJSRenderEffectPass.mGLProgram = JSFExt_CreateShaderProgram(aVertexShaderStr, aPixelShaderStr);
				//-JS
				aJSRenderEffectTechnique.mPasses.push(aJSRenderEffectPass);
			}
			this.mTechniques[aName] = aJSRenderEffectTechnique;
		}
	},
	SetFloatPhys : function GameFramework_resources_JSRenderEffect$SetFloatPhys(theName, theValue) {
		//JS
		JSFExt_SetShaderUniform1f(theName, theValue);
		//-JS
	},
	SetVectorPhys : function GameFramework_resources_JSRenderEffect$SetVectorPhys(theName, theVector) {
		//JS
		JSFExt_SetShaderUniform3f(theName, theVector.x, theVector.y, theVector.z);
		//-JS
	},
	SetFloatArrayPhys : function GameFramework_resources_JSRenderEffect$SetFloatArrayPhys(theName, theVector) {
		//JS
		if(theVector.length == 2) {
			JSFExt_SetShaderUniform3f(theName, theVector[0], theVector[1], 0.0);
		}
		if(theVector.length == 3) {
			JSFExt_SetShaderUniform3f(theName, theVector[0], theVector[1], theVector[2]);
		}
		if(theVector.length == 4) {
			JSFExt_SetShaderUniform4f(theName, theVector[0], theVector[1], theVector[2], theVector[3]);
		}
		//-JS
	},
	SetMatrixPhys : function GameFramework_resources_JSRenderEffect$SetMatrixPhys(theName, theTransform) {
		//JS
		JSFExt_SetShaderUniform4fv(theName, [theTransform.m[0, 0], theTransform.m[0, 1], theTransform.m[0, 2], theTransform.m[0, 3], theTransform.m[1, 0], theTransform.m[1, 1], theTransform.m[1, 2], theTransform.m[1, 3], theTransform.m[2, 0], theTransform.m[2, 1], theTransform.m[2, 2], theTransform.m[2, 3], theTransform.m[3, 0], theTransform.m[3, 1], theTransform.m[3, 2], theTransform.m[3, 3]]);
		//-JS
	},
	SetFloat : function GameFramework_resources_JSRenderEffect$SetFloat(theName, theValue) {
		this.mSettings[theName] = theValue;
		if(this.mCurPass != null) {
			this.SetFloatPhys(theName, theValue);
		}
	},
	SetVector : function GameFramework_resources_JSRenderEffect$SetVector(theName, theVector) {
		this.mSettings[theName] = new GameFramework.geom.Vector3(theVector.x, theVector.y, theVector.z);
		if(this.mCurPass != null) {
			this.SetVectorPhys(theName, theVector);
		}
	},
	SetFloatArray : function GameFramework_resources_JSRenderEffect$SetFloatArray(theName, theVector) {
		var aFloats = Array.Create(theVector.length, null);
		for(var i = 0; i < theVector.length; i++) {
			aFloats[i] = theVector[i];
		}
		this.mSettings[theName] = aFloats;
		if(this.mCurPass != null) {
			this.SetFloatArrayPhys(theName, theVector);
		}
	},
	SetMatrix : function GameFramework_resources_JSRenderEffect$SetMatrix(theName, theTransform) {
		var aMatrix3D = new GameFramework.geom.Matrix3D();
		aMatrix3D.CopyFrom(theTransform);
		this.mSettings[theName] = aMatrix3D;
		if(this.mCurPass != null) {
			this.SetMatrixPhys(theName, theTransform);
		}
	},
	Begin : function GameFramework_resources_JSRenderEffect$Begin(g3D, theTechnique) {
		if(theTechnique === undefined) {
			theTechnique = null;
		}
		var aRenderEffectRunHandle = new GameFramework.resources.JSRenderEffectRunHandle(this);
		var aTechnique = this.mTechniques[theTechnique];
		aRenderEffectRunHandle.mTechnique = aTechnique;
		return aRenderEffectRunHandle;
	},
	End : function GameFramework_resources_JSRenderEffect$End(theRenderEffectHandle) {
	},
	BeginPass : function GameFramework_resources_JSRenderEffect$BeginPass(theRenderEffectHandle, thePass) {
		var aRunHandle = theRenderEffectHandle;
		var aPass = aRunHandle.mTechnique.mPasses[thePass];
		//JS
		JSFExt_SetGLProgram(aPass.mGLProgram)
		//-JS
		this.mCurPass = aPass;

		for(aName in this.mSettings) {
			var anObj = this.mSettings[aName];
			if(Type.tryCast(anObj, Number)) {
				this.SetFloatPhys(aName, anObj);
			} else if(Type.tryCast(anObj, GameFramework.geom.Vector3)) {
				this.SetVectorPhys(aName, anObj);
			} else {
				this.SetFloatArrayPhys(aName, anObj);
			}
		}
	},
	EndPass : function GameFramework_resources_JSRenderEffect$EndPass(theRenderEffectHandle, thePass) {
		this.mCurPass = null;
		//JS
		JSFExt_SetGLProgram(gDefault2DShaderProgram)
		//-JS
	},
	PassUsesVertexShader : function GameFramework_resources_JSRenderEffect$PassUsesVertexShader(inPass) {
		return true;
	},
	PassUsesPixelShader : function GameFramework_resources_JSRenderEffect$PassUsesPixelShader(inPass) {
		return true;
	}
}
GameFramework.resources.JSRenderEffect.staticInit = function GameFramework_resources_JSRenderEffect$staticInit() {
}

JSFExt_AddInitFunc(function() {
	GameFramework.resources.JSRenderEffect.registerClass('GameFramework.resources.JSRenderEffect', GameFramework.resources.RenderEffect);
});
JSFExt_AddStaticInitFunc(function() {
	GameFramework.resources.JSRenderEffect.staticInit();
});