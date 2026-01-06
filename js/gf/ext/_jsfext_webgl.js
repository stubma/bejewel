// create an empty texture with given size
function JSFExt_CreateGLTexSize(theWidth, theHeight) {
    var texture = gGL.createTexture();
    gGL.bindTexture(gGL.TEXTURE_2D, texture);
    gGL.texImage2D(gGL.TEXTURE_2D, 0, gGL.RGBA, theWidth, theHeight, 0, gGL.RGBA, gGL.UNSIGNED_BYTE, null);
    gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MAG_FILTER, gGL.LINEAR);
    gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MIN_FILTER, gGL.LINEAR);
    gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_S, gGL.CLAMP_TO_EDGE);
    gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_T, gGL.CLAMP_TO_EDGE);
    gGL.bindTexture(gGL.TEXTURE_2D, null);
    return texture;
}

function JSFExt_CopyTexBits(
    theGLTex,
    theSrcX,
    theSrcY,
    theWidth,
    theHeight,
    theColorImage,
    theAlphaImage,
    theDestX,
    theDestY
) {
    var aScratchCTX = document.getElementById("ScratchCanvas").getContext("2d");

    var aSize = theWidth * theHeight;

    var aColorImageData = null;
    var anAlphaImageData = null;
    var aDestImageData = null;

    var anAlphaBits;

    if (theAlphaImage != null) {
        aScratchCTX.drawImage(theAlphaImage, theSrcX, theSrcY, theWidth, theHeight, 0, 0, theWidth, theHeight);
        anAlphaImageData = aScratchCTX.getImageData(0, 0, theWidth, theHeight);
    }

    if (theColorImage != null) {
        if (anAlphaImageData != null) {
            anAlphaBits = new Uint8Array(theWidth * theHeight);
            for (var i = 0; i < aSize; i++) {
                anAlphaBits[i] = anAlphaImageData.data[i * 4];
            }
        }
        aScratchCTX.drawImage(theColorImage, theSrcX, theSrcY, theWidth, theHeight, 0, 0, theWidth, theHeight);
        aColorImageData = aScratchCTX.getImageData(0, 0, theWidth, theHeight);
    }

    if (aColorImageData != null && anAlphaImageData != null) {
        aDestImageData = aColorImageData;
        for (var i = 0; i < aSize; i++) {
            aDestImageData.data[i * 4 + 3] = anAlphaBits[i];
        }
    } else if (anAlphaImageData != null) {
        aDestImageData = anAlphaImageData;
        for (var i = 0; i < aSize; i++) {
            aDestImageData.data[i * 4 + 3] = anAlphaImageData[i * 4];
            aDestImageData.data[i * 4] = 255;
            aDestImageData.data[i * 4 + 1] = 255;
            aDestImageData.data[i * 4 + 2] = 255;
        }
    } else {
        aDestImageData = aColorImageData;
    }

    gGL.bindTexture(gGL.TEXTURE_2D, theGLTex);
    gGL.texSubImage2D(gGL.TEXTURE_2D, 0, theDestX, theDestY, gGL.RGBA, gGL.UNSIGNED_BYTE, aDestImageData);
    gGL.bindTexture(gGL.TEXTURE_2D, null);
}

// combine color and alpha image data, then create a texture from it
function JSFExt_CreateGLTexComb(theColorImage, theAlphaImage) {
    var aCompositeImageData = JSFExt_CreateCompositeImageData(theColorImage.width, theColorImage.height);
    JSFExt_CopyToImageData(
        aCompositeImageData,
        0,
        0,
        theColorImage.width,
        theColorImage.height,
        theColorImage,
        theAlphaImage,
        0,
        0
    );
    return CreateGLTex(aCompositeImageData);
}

// create an empty texture, no size
function JSFExt_CreateEmptyGLTex(theGLTex, theImage) {
    if (gGL != null) {
        var texture = gGL.createTexture();
        return texture;
    }
}

// copy image data to an existed texture
function JSFExt_SetGLTexImage(theGLTex, theImage) {
    if (gGL != null) {
        gGL.bindTexture(gGL.TEXTURE_2D, theGLTex);
        gGL.texImage2D(gGL.TEXTURE_2D, 0, gGL.RGBA, gGL.RGBA, gGL.UNSIGNED_BYTE, theImage);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MAG_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MIN_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_S, gGL.CLAMP_TO_EDGE);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_T, gGL.CLAMP_TO_EDGE);
        gGL.bindTexture(gGL.TEXTURE_2D, null);
    }
}

// create texture from a block image data in rgba8888 format
function CreateGLTex(theImage) {
    if (gGL != null) {
        var texture = gGL.createTexture();
        gGL.bindTexture(gGL.TEXTURE_2D, texture);
        gGL.texImage2D(gGL.TEXTURE_2D, 0, gGL.RGBA, gGL.RGBA, gGL.UNSIGNED_BYTE, theImage);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MAG_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MIN_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_S, gGL.CLAMP_TO_EDGE);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_T, gGL.CLAMP_TO_EDGE);
        gGL.bindTexture(gGL.TEXTURE_2D, null);
        return texture;
    }
}

// create texture with specified size
function CreateGLTexPixels(theWidth, theHeight, thePixels) {
    if (gGL != null) {
        var texture = gGL.createTexture();
        gGL.bindTexture(gGL.TEXTURE_2D, texture);
        gGL.texImage2D(gGL.TEXTURE_2D, 0, gGL.RGBA, theWidth, theHeight, 0, gGL.RGBA, gGL.UNSIGNED_BYTE, thePixels);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MAG_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_MIN_FILTER, gGL.LINEAR);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_S, gGL.CLAMP_TO_EDGE);
        gGL.texParameteri(gGL.TEXTURE_2D, gGL.TEXTURE_WRAP_T, gGL.CLAMP_TO_EDGE);
        gGL.bindTexture(gGL.TEXTURE_2D, null);
        return texture;
    }
}

// create one shader
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gGL.createShader(gGL.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gGL.createShader(gGL.VERTEX_SHADER);
    } else {
        return null;
    }

    gGL.shaderSource(shader, str);
    gGL.compileShader(shader);

    if (!gGL.getShaderParameter(shader, gGL.COMPILE_STATUS)) {
        throw new Error("Shader compilation error: " + gGL.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

// create shader program, and the shader source will be loaded from DOM
function initShaders() {
    var fragmentShader = getShader(gGL, "shader-fs");
    var vertexShader = getShader(gGL, "shader-vs");
    gGlobalVertexShader = vertexShader;

    gLastShaderProgram = gGL.createProgram();
    gGL.attachShader(gLastShaderProgram, vertexShader);
    gGL.attachShader(gLastShaderProgram, fragmentShader);
    gGL.linkProgram(gLastShaderProgram);

    if (!gGL.getProgramParameter(gLastShaderProgram, gGL.LINK_STATUS)) {
        throw new Error("Could not initialise shaders");
    }

    gGL.useProgram(gLastShaderProgram);

    gLastShaderProgram.positionAttribute = gGL.getAttribLocation(gLastShaderProgram, "aPosition");
    gGL.enableVertexAttribArray(gLastShaderProgram.positionAttribute);

    gLastShaderProgram.colorAttribute = gGL.getAttribLocation(gLastShaderProgram, "aVertexColor");
    gGL.enableVertexAttribArray(gLastShaderProgram.colorAttribute);

    gLastShaderProgram.samplerUniform = gGL.getUniformLocation(gLastShaderProgram, "sTexture");

    gLastShaderProgram.writeDepth = gGL.getUniformLocation(gLastShaderProgram, "writeDepth");

    gDefault2DShaderProgram = gLastShaderProgram;
    gWantShaderProgram = gDefault2DShaderProgram;
}

// create shader program
function JSFExt_CreateShaderProgram(theVertexShaderData, thePixelShaderData) {
    if (gGL == null) {
        return null;
    }

    var vertexShader;

    if (theVertexShaderData != null) {
        var vertexShader = gGL.createShader(gGL.VERTEX_SHADER);
        gGL.shaderSource(vertexShader, theVertexShaderData);
        gGL.compileShader(vertexShader);
        if (!gGL.getShaderParameter(vertexShader, gGL.COMPILE_STATUS)) {
            throw new Error("Vertex shader compilation error: " + gGL.getShaderInfoLog(vertexShader));
            return null;
        }
    } else {
        vertexShader = gGlobalVertexShader;
    }

    var pixelShader = gGL.createShader(gGL.FRAGMENT_SHADER);
    gGL.shaderSource(pixelShader, thePixelShaderData);
    gGL.compileShader(pixelShader);
    if (!gGL.getShaderParameter(pixelShader, gGL.COMPILE_STATUS)) {
        throw new Error("Pixel shader compilation error: " + gGL.getShaderInfoLog(pixelShader));
        return null;
    }

    var aShaderProgram = gGL.createProgram();
    gGL.attachShader(aShaderProgram, vertexShader);
    gGL.attachShader(aShaderProgram, pixelShader);
    gGL.linkProgram(aShaderProgram);

    if (!gGL.getProgramParameter(aShaderProgram, gGL.LINK_STATUS)) {
        throw new Error("Shader getProgramParameter error: " + gGL.getShaderInfoLog(aShaderProgram));
    }

    aShaderProgram.positionAttribute = gGL.getAttribLocation(aShaderProgram, "position");
    aShaderProgram.colorAttribute = gGL.getAttribLocation(aShaderProgram, "color");
    aShaderProgram.normalAttribute = gGL.getAttribLocation(aShaderProgram, "normal");
    aShaderProgram.texcoord0Attribute = gGL.getAttribLocation(aShaderProgram, "texcoord0");
    aShaderProgram.texcoord1Attribute = gGL.getAttribLocation(aShaderProgram, "texcoord1");
    aShaderProgram.worldAttribute = gGL.getUniformLocation(aShaderProgram, "world");
    aShaderProgram.viewAttribute = gGL.getUniformLocation(aShaderProgram, "view");
    aShaderProgram.projectionAttribute = gGL.getUniformLocation(aShaderProgram, "projection");
    aShaderProgram.worldViewProjAttribute = gGL.getUniformLocation(aShaderProgram, "worldViewProj");
    aShaderProgram.Tex0Attribute = gGL.getUniformLocation(aShaderProgram, "Tex0");
    aShaderProgram.Tex1Attribute = gGL.getUniformLocation(aShaderProgram, "Tex1");

    return aShaderProgram;
}

// convert blend type to GL constant
function GetGLBlendType(theBlend, theDefault) {
    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.Default) {
        return theDefault;
    }

    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.Zero) {
        return gGL.ZERO;
    }
    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.One) {
        return gGL.ONE;
    }
    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.SrcColor) {
        return gGL.SRC_COLOR;
    }
    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.InvSrcColor) {
        return gGL.ONE_MINUS_SRC_COLOR;
    }
    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.SrcAlpha) {
        return gGL.SRC_ALPHA;
    }
    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.InvSrcAlpha) {
        return gGL.ONE_MINUS_SRC_ALPHA;
    }
    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.DestAlpha) {
        return gGL.DST_ALPHA;
    }
    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.InvDestAlpha) {
        return gGL.ONE_MINUS_DST_ALPHA;
    }
    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.DestColor) {
        return gGL.DST_COLOR;
    }
    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.InvDestColor) {
        return gGL.ONE_MINUS_DST_COLOR;
    }
    if (theBlend == GameFramework.gfx.Graphics3D.EBlend.SrcAlphaSat) {
        return gGL.SRC_ALPHA_SATURATE;
    }
}

// reset depth and program to prepare drawing
function JSFExt_Setup2DDrawing(theDrawDepth) {
    gWriteDepth = theDrawDepth;
    gWantShaderProgram = gDefault2DShaderProgram;
    gLastTex = false; // Force change
}

// flush when drawing done
function JSFExt_End2DDrawing() {
    JSFExt_Flush();
}

// set blend function
function JSFExt_SetBlend(theSrcBlend, theDestBlend) {
    theSrcBlend = GetGLBlendType(theSrcBlend, gGL.SRC_ALPHA);
    theDestBlend = GetGLBlendType(theDestBlend, gGL.ONE_MINUS_SRC_ALPHA);
    if (theSrcBlend == gGL.SRC_ALPHA && theDestBlend == gGL.ONE_MINUS_SRC_ALPHA) {
        gAdditive = false;
    } else if (theSrcBlend == gGL.SRC_ALPHA && theDestBlend == gGL.ONE) {
        gAdditive = true;
    } else {
        gAdditive = undefined;
    }
    gGL.blendFunc(theSrcBlend, theDestBlend);
}

// set gl program want to used in next flush
function JSFExt_SetGLProgram(theProgram) {
    gWantShaderProgram = theProgram;
}

// perpare to render 3d scene
function JSFExt_Begin3DScene(theProgram) {
    JSFExt_Flush();
}

// reset state after 3d scene rendering
function JSFExt_End3DScene(theProgram) {
    gGL.activeTexture(gGL.TEXTURE0);
    gGL.blendFunc(gGL.SRC_ALPHA, gGL.ONE_MINUS_SRC_ALPHA);
    gGL.disable(gGL.CULL_FACE);
    gGL.disable(gGL.DEPTH_TEST);
    gAdditive = false;
    gLastTex = false; // Force change
    gWriteDepth = 1.0;
    gGL.disableVertexAttribArray(2);
    gGL.disableVertexAttribArray(3);
    gGL.disableVertexAttribArray(4);
}

function JSFExt_SetupMesh(theMesh) {
    if (gGL == null) {
        return;
    }

    for (var aPieceIdx = 0; aPieceIdx < theMesh.mPieces.length; aPieceIdx++) {
        var aMeshPiece = theMesh.mPieces[aPieceIdx];

        if ((aMeshPiece.mSexyVF & 0x002) /*SexyVF_XYZ*/ != 0) {
            aMeshPiece.mXYZArray = new Float32Array(aMeshPiece.mVertexBufferCount * 3);
        }
        if ((aMeshPiece.mSexyVF & 0x010) /*SexyVF_Normal*/ != 0) {
            aMeshPiece.mNormalArray = new Float32Array(aMeshPiece.mVertexBufferCount * 3);
        }
        if ((aMeshPiece.mSexyVF & 0x040) /*SexyVF_Diffuse*/ != 0) {
            aMeshPiece.mColorArray = new Float32Array(aMeshPiece.mVertexBufferCount * 4);
        }
        if ((aMeshPiece.mSexyVF & 0x200) /*SexyVF_Tex2*/ != 0) {
            aMeshPiece.mTexCoords0Array = new Float32Array(aMeshPiece.mVertexBufferCount * 2);
            aMeshPiece.mTexCoords1Array = new Float32Array(aMeshPiece.mVertexBufferCount * 2);
        } else if ((aMeshPiece.mSexyVF & 0x100) /*SexyVF_Tex1*/ != 0) {
            aMeshPiece.mTexCoords0Array = new Float32Array(aMeshPiece.mVertexBufferCount * 2);
        }
        //;

        for (var anIdx = 0; anIdx < aMeshPiece.mVertexBufferCount; anIdx++) {
            if (aMeshPiece.mXYZArray != null) {
                aMeshPiece.mXYZArray[anIdx * 3 + 0] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mXYZArray[anIdx * 3 + 1] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mXYZArray[anIdx * 3 + 2] = aMeshPiece.mVertexData.ReadFloat();
            }

            if (aMeshPiece.mNormalArray != null) {
                aMeshPiece.mNormalArray[anIdx * 3 + 0] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mNormalArray[anIdx * 3 + 1] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mNormalArray[anIdx * 3 + 2] = aMeshPiece.mVertexData.ReadFloat();
            }

            if (aMeshPiece.mColorArray != null) {
                aMeshPiece.mColorArray[anIdx * 4 + 0] = aMeshPiece.mVertexData.ReadByte() / 255.0;
                aMeshPiece.mColorArray[anIdx * 4 + 1] = aMeshPiece.mVertexData.ReadByte() / 255.0;
                aMeshPiece.mColorArray[anIdx * 4 + 2] = aMeshPiece.mVertexData.ReadByte() / 255.0;
                aMeshPiece.mColorArray[anIdx * 4 + 3] = aMeshPiece.mVertexData.ReadByte() / 255.0;
            }

            if (aMeshPiece.mTexCoords0Array != null) {
                aMeshPiece.mTexCoords0Array[anIdx * 2 + 0] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mTexCoords0Array[anIdx * 2 + 1] = aMeshPiece.mVertexData.ReadFloat();
            }

            if (aMeshPiece.mTexCoords1Array != null) {
                aMeshPiece.mTexCoords1Array[anIdx * 2 + 0] = aMeshPiece.mVertexData.ReadFloat();
                aMeshPiece.mTexCoords1Array[anIdx * 2 + 1] = aMeshPiece.mVertexData.ReadFloat();
            }
        }

        if (aMeshPiece.mXYZArray != null) {
            aMeshPiece.mXYZAttribArray = gGL.createBuffer();
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mXYZAttribArray);
            gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mXYZArray, gGL.STATIC_DRAW);
        }

        if (aMeshPiece.mColorArray != null) {
            aMeshPiece.mColorAttribArray = gGL.createBuffer();
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mColorAttribArray);
            gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mColorArray, gGL.STATIC_DRAW);
        }

        if (aMeshPiece.mNormalArray != null) {
            aMeshPiece.mNormalAttribArray = gGL.createBuffer();
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mNormalAttribArray);
            gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mNormalArray, gGL.STATIC_DRAW);
        }

        if (aMeshPiece.mTexCoords0Array != null) {
            aMeshPiece.mTexCoords0AttribArray = gGL.createBuffer();
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords0AttribArray);
            gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords0Array, gGL.STATIC_DRAW);
        }

        if (aMeshPiece.mTexCoords1Array != null) {
            aMeshPiece.mTexCoords1AttribArray = gGL.createBuffer();
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords1AttribArray);
            gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords1Array, gGL.STATIC_DRAW);
        }

        aMeshPiece.mIndexBuffer = new Uint16Array(aMeshPiece.mIndexBufferCount);
        for (var anIdx = 0; anIdx < aMeshPiece.mIndexBufferCount; anIdx++) {
            aMeshPiece.mIndexBuffer[anIdx] = aMeshPiece.mIndexData.ReadShort();
        }

        aMeshPiece.mIndexAttribArray = gGL.createBuffer();
        gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, aMeshPiece.mIndexAttribArray);
        gGL.bufferData(gGL.ELEMENT_ARRAY_BUFFER, aMeshPiece.mIndexBuffer, gGL.STATIC_DRAW);
    }
}

// activate current shader program and enable all default attributes
function JSFExt_ActivateShader() {
    if (gWantShaderProgram != gLastShaderProgram) {
        gLastShaderProgram = gWantShaderProgram;
        gGL.useProgram(gLastShaderProgram);

        if (gLastShaderProgram.positionAttribute != -1) {
            gGL.enableVertexAttribArray(gLastShaderProgram.positionAttribute);
        }
        if (gLastShaderProgram.colorAttribute != -1) {
            gGL.enableVertexAttribArray(gLastShaderProgram.colorAttribute);
        }
        if (gLastShaderProgram.normalAttribute != -1) {
            gGL.enableVertexAttribArray(gLastShaderProgram.normalAttribute);
        }
        if (gLastShaderProgram.texcoord0Attribute != -1) {
            gGL.enableVertexAttribArray(gLastShaderProgram.texcoord0Attribute);
        }
        if (gLastShaderProgram.texcoord1Attribute != -1) {
            gGL.enableVertexAttribArray(gLastShaderProgram.texcoord1Attribute);
        }
    }
}

// get uniform location
function JSFExt_GetUniformLocation(theName) {
    JSFExt_ActivateShader();
    if (gLastShaderProgram[theName] !== undefined) {
        return gLastShaderProgram[theName];
    }
    gLastShaderProgram[theName] = gGL.getUniformLocation(gLastShaderProgram, theName);
}

// set float uniform
function JSFExt_SetShaderUniform1f(theName, val1) {
    var aUniform = JSFExt_GetUniformLocation(theName);
    if (aUniform != null) {
        gGL.uniform4f(aUniform, val1, 0, 0, 0);
    }
}

// set 3 float uniform
function JSFExt_SetShaderUniform3f(theName, val1, val2, val3) {
    var aUniform = JSFExt_GetUniformLocation(theName);
    if (aUniform != null) {
        gGL.uniform4f(aUniform, val1, val2, val3, 1);
    }
}

// set 4 float uniform
function JSFExt_SetShaderUniform4f(theName, val1, val2, val3, val4) {
    var aUniform = JSFExt_GetUniformLocation(theName);
    if (aUniform != null) {
        gGL.uniform4f(aUniform, val1, val2, val3, val4);
    }
}

// set float array uniform
function JSFExt_SetShaderUniform4fv(theName, val) {
    var aUniform = JSFExt_GetUniformLocation(theName);
    if (aUniform != null) {
        gGL.uniform4fv(aUniform, false, new Float32Array(val));
    }
}

// render a 3d mesh with current shader program
function JSFExt_RenderMesh(theGraphics3D, theMesh, theWorldMatrix, theViewMatrix, theProjMatrix) {
    // enable shader
    JSFExt_ActivateShader();

    // matrix
    if (gLastShaderProgram.worldAttribute != null) {
        gGL.uniformMatrix4fv(gLastShaderProgram.worldAttribute, false, theWorldMatrix.m);
    }
    if (gLastShaderProgram.viewAttribute != null) {
        gGL.uniformMatrix4fv(gLastShaderProgram.viewAttribute, false, theViewMatrix.m);
    }
    if (gLastShaderProgram.viewAttribute != null) {
        gGL.uniformMatrix4fv(gLastShaderProgram.projectionAttribute, false, theProjMatrix.m);
    }
    if (gLastShaderProgram.worldViewProjAttribute != null) {
        var aWorldViewProjMatrix = new GameFramework.geom.Matrix3D();
        aWorldViewProjMatrix.CopyFrom(theProjMatrix);
        aWorldViewProjMatrix.Append(theViewMatrix);
        aWorldViewProjMatrix.Append(theWorldMatrix);
        gGL.uniformMatrix4fv(gLastShaderProgram.worldViewProjAttribute, false, aWorldViewProjMatrix.m);
    }

    // tex
    if (gLastShaderProgram.Tex0Attribute != null) {
        gGL.uniform1i(gLastShaderProgram.Tex0Attribute, 0);
    }
    if (gLastShaderProgram.Tex1Attribute != null) {
        gGL.uniform1i(gLastShaderProgram.Tex1Attribute, 1);
    }

    // render every piece
    for (var aPieceIdx = 0; aPieceIdx < theMesh.mPieces.length; aPieceIdx++) {
        var aMeshPiece = theMesh.mPieces[aPieceIdx];

        theGraphics3D.SetTexture(0, aMeshPiece.mImage);

        var anEvent = new GameFramework.resources.popanim.PopAnimEvent(GameFramework.resources.MeshEvent.PREDRAW_SET);
        theMesh.DispatchEvent(anEvent);

        if (aMeshPiece.mXYZArray != null) {
            //gGL.enableVertexAttribArray(gLastShaderProgram.positionAttribute);

            //gGL.bindBuffer(gGL.ARRAY_BUFFER, positionBuffer);
            //gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mXYZArray, gGL.STATIC_DRAW);
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mXYZAttribArray);
            gGL.vertexAttribPointer(gLastShaderProgram.positionAttribute, 3, gGL.FLOAT, false, 0, 0);
        }

        if (aMeshPiece.mColorArray != null) {
            //gGL.enableVertexAttribArray(gLastShaderProgram.colorAttribute);

            //gGL.bindBuffer(gGL.ARRAY_BUFFER, colorBuffer);
            //gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mColorArray, gGL.STATIC_DRAW);
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mColorAttribArray);
            gGL.vertexAttribPointer(gLastShaderProgram.colorAttribute, 4, gGL.FLOAT, false, 0, 0);
        }

        if (aMeshPiece.mNormalArray != null) {
            //gGL.enableVertexAttribArray(gLastShaderProgram.normalAttribute);
            //gGL.bindBuffer(gGL.ARRAY_BUFFER, normalBuffer);
            //gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mNormalArray, gGL.STATIC_DRAW);
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mNormalAttribArray);
            gGL.vertexAttribPointer(gLastShaderProgram.normalAttribute, 3, gGL.FLOAT, false, 0, 0);
        }

        if (aMeshPiece.mTexCoords0Array != null) {
            //gGL.enableVertexAttribArray(gLastShaderProgram.texcoord0Attribute);
            //gGL.bindBuffer(gGL.ARRAY_BUFFER, texCoords0Buffer);
            //gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords0Array, gGL.STATIC_DRAW);
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords0AttribArray);
            gGL.vertexAttribPointer(gLastShaderProgram.texcoord0Attribute, 2, gGL.FLOAT, false, 0, 0);
        }

        if (aMeshPiece.mTexCoords1Array != null) {
            //gGL.enableVertexAttribArray(gLastShaderProgram.texcoord1Attribute);
            //gGL.bindBuffer(gGL.ARRAY_BUFFER, texCoords1Buffer);
            //gGL.bufferData(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords1Array, gGL.STATIC_DRAW);
            gGL.bindBuffer(gGL.ARRAY_BUFFER, aMeshPiece.mTexCoords1AttribArray);
            gGL.vertexAttribPointer(gLastShaderProgram.texcoord1Attribute, 2, gGL.FLOAT, false, 0, 0);
        }

        gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, aMeshPiece.mIndexAttribArray);
        //gGL.bindBuffer(gGL.ELEMENT_ARRAY_BUFFER, indexBuffer);
        //gGL.bufferData(gGL.ELEMENT_ARRAY_BUFFER, aMeshPiece.mIndexBuffer, gGL.STATIC_DRAW);
        gGL.drawElements(gGL.TRIANGLES, aMeshPiece.mIndexBufferCount, gGL.UNSIGNED_SHORT, 0);

        // trigger a post draw event
        anEvent = new GameFramework.resources.popanim.PopAnimEvent(GameFramework.resources.MeshEvent.POSTDRAW_SET);
        theMesh.DispatchEvent(anEvent);
    }
}

// populate a quad vertex and color
// the tex coordinates are saved in zw components of vertex buffer
function drawQuadAt(x, y, a, b, c, d, src_x, src_y, src_w, src_h, stripW, stripH, color) {
    var tex_x = src_x / stripW;
    var tex_y = src_y / stripH;
    var tex_w = src_w / stripW;
    var tex_h = src_h / stripH;

    //1
    positionArray[vertexIndex++] = (x + c * src_h) / gApp.mPhysWidth; //x / gApp.mWidth;
    positionArray[vertexIndex++] = (y + d * src_h) / gApp.mPhysHeight; // (y + src_h) / gApp.mHeight;
    positionArray[vertexIndex++] = tex_x;
    positionArray[vertexIndex++] = tex_y + tex_h;

    //2
    positionArray[vertexIndex++] = x / gApp.mPhysWidth;
    positionArray[vertexIndex++] = y / gApp.mPhysHeight;
    positionArray[vertexIndex++] = tex_x;
    positionArray[vertexIndex++] = tex_y;

    //3
    positionArray[vertexIndex++] = (x + a * src_w + c * src_h) / gApp.mPhysWidth; //(x + src_w) / gApp.mWidth;
    positionArray[vertexIndex++] = (y + b * src_w + d * src_h) / gApp.mPhysHeight; //(y + src_h) / gApp.mHeight;
    positionArray[vertexIndex++] = tex_x + tex_w;
    positionArray[vertexIndex++] = tex_y + tex_h;

    //2
    positionArray[vertexIndex++] = x / gApp.mPhysWidth;
    positionArray[vertexIndex++] = y / gApp.mPhysHeight;
    positionArray[vertexIndex++] = tex_x;
    positionArray[vertexIndex++] = tex_y;

    //3
    positionArray[vertexIndex++] = (x + a * src_w + c * src_h) / gApp.mPhysWidth; //(x + src_w) / gApp.mWidth;
    positionArray[vertexIndex++] = (y + b * src_w + d * src_h) / gApp.mPhysHeight; //(y + src_h) / gApp.mHeight;
    positionArray[vertexIndex++] = tex_x + tex_w;
    positionArray[vertexIndex++] = tex_y + tex_h;

    //4
    positionArray[vertexIndex++] = (x + a * src_w) / gApp.mPhysWidth; //(x + src_w) / gApp.mWidth;
    positionArray[vertexIndex++] = (y + b * src_w) / gApp.mPhysHeight; //y / gApp.mHeight;
    positionArray[vertexIndex++] = tex_x + tex_w;
    positionArray[vertexIndex++] = tex_y;

    for (i = 0; i < 6; i++) {
        colorArray[colorIndex++] = color[0];
        colorArray[colorIndex++] = color[1];
        colorArray[colorIndex++] = color[2];
        colorArray[colorIndex++] = color[3];
    }
}

// it flush current buffer to screen
function JSFExt_Flush() {
    if (vertexIndex > 0 && positionBuffer != undefined) {
        // ensure shader is used
        if (gWantShaderProgram != gLastShaderProgram) {
            gLastShaderProgram = gWantShaderProgram;
            gGL.useProgram(gLastShaderProgram);
        }

        // bind vertex buffer
        gGL.bindBuffer(gGL.ARRAY_BUFFER, positionBuffer);
        gGL.bufferData(gGL.ARRAY_BUFFER, positionArray, gGL.STREAM_DRAW);
        positionBuffer.itemSize = 4;
        positionBuffer.numItems = vertexIndex / 4;
        gGL.vertexAttribPointer(gLastShaderProgram.positionAttribute, positionBuffer.itemSize, gGL.FLOAT, false, 0, 0);

        // bind color buffer
        gGL.bindBuffer(gGL.ARRAY_BUFFER, colorBuffer);
        gGL.bufferData(gGL.ARRAY_BUFFER, colorArray, gGL.STREAM_DRAW);
        colorBuffer.itemSize = 4;
        colorBuffer.numItems = colorIndex / 4;
        gGL.vertexAttribPointer(gLastShaderProgram.colorAttribute, colorBuffer.itemSize, gGL.FLOAT, false, 0, 0);

        // ensure write depth is correct
        if (gWriteDepth != gLastWriteDepth) {
            gGL.uniform1f(gLastShaderProgram.writeDepth, gWriteDepth);
            gLastWriteDepth = gWriteDepth;
        }

        // draw and clear counter
        gGL.drawArrays(gGL.TRIANGLES, 0, positionBuffer.numItems);
        vertexIndex = 0;
        colorIndex = 0;
    }
}

// fill buffer for one texture, if buffer has many data, the buffer may be flushed
// if texture to be drawn is different with current texture, buffer will be flushed
// theX, theY, a, b, c, d are matrix values
function JSFExt_GLDraw(
    theTex,
    theX,
    theY,
    a,
    b,
    c,
    d,
    theSrcX,
    theSrcY,
    theSrcW,
    theSrcH,
    theImgW,
    theImgH,
    isAdditive,
    color
) {
    // if buffer is large, flush
    if (vertexIndex > 1000) {
        JSFExt_Flush();
    }

    // if tex or additive is different with current, flush and set
    if (gLastTex != theTex || gAdditive != isAdditive) {
        JSFExt_Flush();
        gGL.bindTexture(gGL.TEXTURE_2D, theTex);
        gLastTex = theTex;
    }

    // ensure additive is correct
    if (gAdditive != isAdditive) {
        gGL.blendFunc(gGL.SRC_ALPHA, isAdditive ? gGL.ONE : gGL.ONE_MINUS_SRC_ALPHA);
        gAdditive = isAdditive;
    }

    // fill quad
    drawQuadAt(theX, theY, a, b, c, d, theSrcX, theSrcY, theSrcW, theSrcH, theImgW, theImgH, [
        ((color >> 16) & 0xff) / 255.0,
        ((color >> 8) & 0xff) / 255.0,
        (color & 0xff) / 255.0,
        ((color >> 24) & 0xff) / 255.0,
    ]);
}

// draw a triangle but with texture
function JSFExt_GLDrawTriTex(
    theTex,
    theX1,
    theY1,
    theU1,
    theV1,
    theColor1,
    theX2,
    theY2,
    theU2,
    theV2,
    theColor2,
    theX3,
    theY3,
    theU3,
    theV3,
    theColor3,
    isAdditive
) {
    // if buffer is large, flush
    if (vertexIndex > 1000) {
        JSFExt_Flush();
    }

    // if tex or additive is different with current, flush and set
    if (gLastTex != theTex || gAdditive != isAdditive) {
        JSFExt_Flush();
        gGL.bindTexture(gGL.TEXTURE_2D, theTex);
        gLastTex = theTex;
    }

    // ensure additive is correct
    if (gAdditive != isAdditive) {
        gGL.blendFunc(gGL.SRC_ALPHA, isAdditive ? gGL.ONE : gGL.ONE_MINUS_SRC_ALPHA);
        gAdditive = isAdditive;
    }

    // color in array format
    var aColor1 = [
        ((theColor1 >> 16) & 0xff) / 255.0,
        ((theColor1 >> 8) & 0xff) / 255.0,
        (theColor1 & 0xff) / 255.0,
        ((theColor1 >> 24) & 0xff) / 255.0,
    ];
    var aColor2 =
        theColor2 == theColor1
            ? aColor1
            : [
                  ((theColor2 >> 16) & 0xff) / 255.0,
                  ((theColor2 >> 8) & 0xff) / 255.0,
                  (theColor2 & 0xff) / 255.0,
                  ((theColor2 >> 24) & 0xff) / 255.0,
              ];
    var aColor3 =
        theColor3 == theColor1
            ? aColor1
            : [
                  ((theColor3 >> 16) & 0xff) / 255.0,
                  ((theColor3 >> 8) & 0xff) / 255.0,
                  (theColor3 & 0xff) / 255.0,
                  ((theColor3 >> 24) & 0xff) / 255.0,
              ];

    // 1
    positionArray[vertexIndex++] = theX1 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY1 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = theU1;
    positionArray[vertexIndex++] = theV1;

    // 2
    positionArray[vertexIndex++] = theX2 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY2 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = theU2;
    positionArray[vertexIndex++] = theV2;

    // 3
    positionArray[vertexIndex++] = theX3 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY3 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = theU3;
    positionArray[vertexIndex++] = theV3;

    // color 1
    colorArray[colorIndex++] = aColor1[0];
    colorArray[colorIndex++] = aColor1[1];
    colorArray[colorIndex++] = aColor1[2];
    colorArray[colorIndex++] = aColor1[3];

    // color 2
    colorArray[colorIndex++] = aColor2[0];
    colorArray[colorIndex++] = aColor2[1];
    colorArray[colorIndex++] = aColor2[2];
    colorArray[colorIndex++] = aColor2[3];

    // color 3
    colorArray[colorIndex++] = aColor3[0];
    colorArray[colorIndex++] = aColor3[1];
    colorArray[colorIndex++] = aColor3[2];
    colorArray[colorIndex++] = aColor3[3];
}

// draw a triangle shape
function JSFExt_GLDrawTri(theTex, theX1, theY1, theX2, theY2, theX3, theY3, isAdditive, color) {
    // if buffer is large, flush
    if (vertexIndex > 1000) {
        JSFExt_Flush();
    }

    // if tex or additive is different with current, flush and set
    if (gLastTex != theTex || gAdditive != isAdditive) {
        JSFExt_Flush();
        gGL.bindTexture(gGL.TEXTURE_2D, theTex);
        gLastTex = theTex;
    }

    // ensure additive is correct
    if (gAdditive != isAdditive) {
        gGL.blendFunc(gGL.SRC_ALPHA, isAdditive ? gGL.ONE : gGL.ONE_MINUS_SRC_ALPHA);
        gAdditive = isAdditive;
    }

    // color in array format
    var aColor = [
        ((color >> 16) & 0xff) / 255.0,
        ((color >> 8) & 0xff) / 255.0,
        (color & 0xff) / 255.0,
        ((color >> 24) & 0xff) / 255.0,
    ];

    // 1
    positionArray[vertexIndex++] = theX1 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY1 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = 0;
    positionArray[vertexIndex++] = 0;

    // 2
    positionArray[vertexIndex++] = theX2 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY2 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = 0;
    positionArray[vertexIndex++] = 0;

    // 3
    positionArray[vertexIndex++] = theX3 / gApp.mPhysWidth;
    positionArray[vertexIndex++] = theY3 / gApp.mPhysHeight;
    positionArray[vertexIndex++] = 0;
    positionArray[vertexIndex++] = 0;

    // color
    for (i = 0; i < 3; i++) {
        colorArray[colorIndex++] = aColor[0];
        colorArray[colorIndex++] = aColor[1];
        colorArray[colorIndex++] = aColor[2];
        colorArray[colorIndex++] = aColor[3];
    }
}
