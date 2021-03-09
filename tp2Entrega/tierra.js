class Parcela{

	constructor(latitude_bands, longitude_bands,i,j) {

        this.matrizModelado = mat4.create();
		this.latitudeBands = latitude_bands;
        this.longitudeBands = longitude_bands;
        
        this.position_buffer = null;
        this.normal_buffer = null;
        this.texture_coord_buffer = null;
        this.index_buffer = null;

        this.webgl_position_buffer = null;
        this.webgl_normal_buffer = null;
        this.webgl_texture_coord_buffer = null;
        this.webgl_index_buffer = null;
        
        this.i = i
        this.j = j
        
	}

    actualizarMatrices = function() {
        this.matrizModelado = mat4.create();
        
        gl.uniformMatrix4fv(shaderProgramTierra.mMatrixUniform, false, this.matrizModelado);

        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix,this.matrizModelado);
        
        mat4.rotateY(normalMatrix,normalMatrix,Math.PI/4)

        // normalMatrix= (inversa(traspuesta(matrizModelado)));
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix,normalMatrix);

        gl.uniformMatrix3fv(shaderProgramTierra.nMatrixUniform, false, normalMatrix);
    }

 	initTexture = function(texture_file){
            
        this.texture = gl.createTexture();
        this.texture.image = new Image();

        this.texture.image.onload = function () {
               //onTextureLoaded()
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, tierra.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tierra.texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
    
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.texture.image.src = texture_file;
    }


    // Se generan los vertices para la esfera, calculando los datos para una esfera de radio 1
    // Y también la información de las normales y coordenadas de textura para cada vertice de la esfera
    // La esfera se renderizara utilizando triangulos, para ello se arma un buffer de índices 
    // a todos los triángulos de la esfera

	initBuffers = function(){
    
        this.position_buffer = [];
        this.normal_buffer = [];
        this.texture_coord_buffer = [];

        var latNumber;
        var longNumber;
        var lado=15;

        // console.log(posicion)
        for (latNumber=0; latNumber <= this.latitudeBands; latNumber++) {



            for (longNumber=0; longNumber <= this.longitudeBands; longNumber++) {


                var x = ((latNumber/this.latitudeBands)*LADO_PARCELA + this.i*LADO_PARCELA - LADO_PARCELA*FILAS_DE_PARCELAS/2)
                var z = ((longNumber/this.longitudeBands)*LADO_PARCELA + this.j*LADO_PARCELA - LADO_PARCELA*FILAS_DE_PARCELAS/2)
                
                var y = 2;


                
                var u = ((z+(LADO_PARCELA*FILAS_DE_PARCELAS)/2 )/ (LADO_PARCELA*FILAS_DE_PARCELAS))
                var v = 1-((x+(LADO_PARCELA*FILAS_DE_PARCELAS)/2 )/ (LADO_PARCELA*FILAS_DE_PARCELAS))

                this.normal_buffer.push(0);
                this.normal_buffer.push(1);
                this.normal_buffer.push(0);

                this.texture_coord_buffer.push(u);
                this.texture_coord_buffer.push(v);
                
                this.position_buffer.push(x);
                this.position_buffer.push(y);
                this.position_buffer.push(z);
            }
        }

        // Buffer de indices de los triangulos
        this.index_buffer = [];
      
        for (latNumber=0; latNumber < this.latitudeBands; latNumber++) {
            for (longNumber=0; longNumber < this.longitudeBands; longNumber++) {

                var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
                var second = first + this.longitudeBands + 1;

                this.index_buffer.push(first);
                this.index_buffer.push(second);
                this.index_buffer.push(first + 1);

                this.index_buffer.push(second);
                this.index_buffer.push(second + 1);
                this.index_buffer.push(first + 1);
                
            }
        }

        // Creación e Inicialización de los buffers a nivel de OpenGL
        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);
        this.webgl_normal_buffer.itemSize = 3;
        this.webgl_normal_buffer.numItems = this.normal_buffer.length / 3;

        this.webgl_texture_coord_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texture_coord_buffer), gl.STATIC_DRAW);
        this.webgl_texture_coord_buffer.itemSize = 2;
        this.webgl_texture_coord_buffer.numItems = this.texture_coord_buffer.length / 2;

        this.webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);
        this.webgl_position_buffer.itemSize = 3;
        this.webgl_position_buffer.numItems = this.position_buffer.length / 3;

        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);
        this.webgl_index_buffer.itemSize = 1;
        this.webgl_index_buffer.numItems = this.index_buffer.length;
    }

    dibujar = function(textures){
        this.actualizarMatrices()
    
        // Se configuran los buffers que alimentaron el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgramTierra.vertexPositionAttribute, this.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_texture_coord_buffer);
        gl.vertexAttribPointer(shaderProgramTierra.textureCoordAttribute, this.webgl_texture_coord_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgramTierra.vertexNormalAttribute, this.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[0]);
        gl.uniform1i(shaderProgramTierra.samplerUniform0, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures[1]);
        gl.uniform1i(shaderProgramTierra.samplerUniform1, 1);
        
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, textures[2]);
        gl.uniform1i(shaderProgramTierra.samplerUniform2, 2);

        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, textures[3]);
        gl.uniform1i(shaderProgramTierra.samplerUniform3, 3);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);

        if (modo!="wireframe"){
            gl.uniform1i(shaderProgramTierra.useLightingUniform,(lighting=="true"));                    
            gl.drawElements(gl.TRIANGLES, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
        
        if (modo!="smooth") {
            gl.uniform1i(shaderProgramTierra.useLightingUniform,false);
            gl.drawElements(gl.LINE_STRIP, this.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
        
    }
    
}