class Objeto3d{

    constructor(superficie, filas, columnas){
        this.matrizModelado = mat4.create()
        this.posicion = vec3.create()
        this.rotacion = vec3.create()
        this.escalado = vec3.fromValues(1,1,1)
        this.color = [1,1,1]
        this.hijos = [];
        this.invRotacion = false;

        if (superficie){
            this.malla = crearGeometria(superficie,filas,columnas);
        }
    }

    

    setPosicion(x,y,z){
        this.posicion[0] = x
        this.posicion[1] = y
        this.posicion[2] = z
    }

    setEscalado(x,y,z){
        this.escalado = vec3.fromValues(x,y,z)
    }

    setRotacion(x,y,z){
        this.rotacion[0] = x
        this.rotacion[1] = y
        this.rotacion[2] = z
    }

    invertirRotacion(){
        this.invRotacion = true
    }

    addChild(objeto3d){
        this.hijos.push(objeto3d)
    }

    actualizarMatrizModelado(mat){
        mat4.identity(this.matrizModelado);

        mat4.translate(this.matrizModelado, this.matrizModelado, this.posicion)
        
        if (this.invRotacion){
            mat4.rotateX(this.matrizModelado, this.matrizModelado, this.rotacion[0]);
            mat4.rotateY(this.matrizModelado, this.matrizModelado, this.rotacion[1]);
            mat4.rotateZ(this.matrizModelado, this.matrizModelado, this.rotacion[2]);
        }
        else{
            mat4.rotateY(this.matrizModelado, this.matrizModelado, this.rotacion[1]);
            mat4.rotateZ(this.matrizModelado, this.matrizModelado, this.rotacion[2]);
            mat4.rotateX(this.matrizModelado, this.matrizModelado, this.rotacion[0]);
        }

        mat4.scale(this.matrizModelado,this.matrizModelado, this.escalado)

        var matrizPadre = mat4.create()
        mat4.multiply(matrizPadre,mat,this.matrizModelado)

        gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, matrizPadre);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix,matrizPadre);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix,normalMatrix);
        
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
        gl.uniform3fv(shaderProgram.color, this.color)
        
        return matrizPadre;
    }

    dibujar(mat){
        var matrizPadre = this.actualizarMatrizModelado(mat)
        if (this.malla){
            this.dibujarMalla(this.malla)
        }
        for (var i=0; i< this.hijos.length; i++){
            this.hijos[i].dibujar(matrizPadre)
        }

    }
   
    dibujarMalla(mallaDeTriangulos){
    
        // Se configuran los buffers que alimentaron el pipeline
        gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);
    
        // gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
        // gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
           
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);
    
    
        if (modo!="wireframe"){
            gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
            /*
                Aqui es necesario modificar la primitiva por triangle_strip
            */
            gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
        
        if (modo!="smooth") {
            gl.uniform1i(shaderProgram.useLightingUniform,false);
            gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
     
    }
    
}