

var superficie3D;
var mallaDeTriangulos;


var SUPERFICIE=3;

//ASD
var mat4=glMatrix.mat4;
var vec4=glMatrix.vec4;
var mat3=glMatrix.mat3;
var vec3=glMatrix.vec3;


function crearGeometria(superficie, filas, columnas){
    return generarSuperficie(superficie, filas,columnas)
}


function SuperficieBarrido(forma, recorridoDiscreto, matricesDiscretas,filas,columnas,tapa=false) {

    this.getPosicion=function(u,v){
        var cantNiveles = filas;
        var cantVertices = columnas;
        var vectorModelado = recorridoDiscreto[Math.round(v*cantNiveles)];
        if ((tapa && v==0) || (tapa && v == 1)) {
            return vectorModelado;
        }
        var matrizNormal = matricesDiscretas[Math.round(v*cantNiveles)];
        var vertice = forma[Math.round(u*cantVertices)];
        var nuevoVertice = vec3.create();
        mat3.multiply(nuevoVertice, matrizNormal, vertice);
        vec3.add(nuevoVertice, nuevoVertice, vectorModelado);

        return nuevoVertice;
    }

    this.getNormal=function(u,v){
        let normal = vec3.create();

        let posicion = this.getPosicion(u,v);
        let stepU = 1./columnas
        let stepV = 1./filas

        let dU = stepU
        let dV = stepV
        
        // if ((v < 3*stepV) && (tapa == false)){
        //     v += 0+3*stepV
        // }
        // if ((v > 1-4*stepV) && (tapa == false)){
        //     v -= 3*stepV
        // }
        if (u + dU > 1){
            dU = -stepU
        }
        if (v + dV > 1){
            dV = -stepV
        }


        if (tapa &&( v <= 0.04)){
            return [-1,0,0];
        }

        if (tapa && (v >= 0.96)){
            return [1,0,0];
        }

        let posicion1 = this.getPosicion(u+dU, v+dV);
        let posicion2 = this.getPosicion(u, v+dV);

        let tan1 = vec3.create()
        let tan2 = vec3.create()
        vec3.sub(tan1, posicion1, posicion)
        vec3.sub(tan2, posicion2, posicion)

        
        vec3.cross(normal,tan2,tan1)

        // normal = vec3.create(tan1[1],-tan1[0],0.0);
        
        if ((v == 1) && !tapa){
            vec3.cross(normal,tan1,tan2)
        }

        if (!tapa){
            normal = [normal[1], -normal[0], -normal[2]]
        }else{
            normal = [normal[2], -normal[1],normal[0]]
        }
        // vec3.multiply(normal,1,1,1);
        // normal = vec3.create(normal.x,normal.y,normal.z)
        // let newNormal = [normal[2],-normal[1],normal[0]]
        return normal;
    }

    this.corrio = false;

    this.getCoordenadasTextura=function(u,v){
        
        let xmin = 0;
        let ymin = 0;
        let xmax = 0;
        let ymax = 0;
        
        if (tapa && !this.corrio){
            
            // recorridoDiscreto.splice(0, 0, recorridoDiscreto[0]);
            // recorridoDiscreto.splice(0, 0, recorridoDiscreto[0]);
            // recorridoDiscreto.splice(recorridoDiscreto.length - 1, 0, recorridoDiscreto[recorridoDiscreto.length - 1]);
            // recorridoDiscreto.splice(recorridoDiscreto.length - 1, 0, recorridoDiscreto[recorridoDiscreto.length - 1]);
            
            // matricesDiscretas.splice(0, 0, matricesDiscretas[0]);
            // matricesDiscretas.splice(0, 0, matricesDiscretas[0]);
            // matricesDiscretas.splice(matricesDiscretas.length - 1, 0, matricesDiscretas[matricesDiscretas.length - 1]);
            // matricesDiscretas.splice(matricesDiscretas.length - 1, 0, matricesDiscretas[matricesDiscretas.length - 1]);
            this.corrio = true

            for (var i = 0 ; i < forma.length ; i++){
                xmin = Math.min(xmin, forma[i][0]);
                xmax = Math.max(xmax, forma[i][0]);
                ymin = Math.min(ymin, forma[i][1]);
                ymax = Math.max(ymax, forma[i][1]);
            }

        }
        
        let cantNiveles = recorridoDiscreto.length - 1;
        let cantVertices = forma.length - 1;

        
        let nuevoU = u;
        let nuevoV = v;
        

        if ((v <= 0.03 || v >= 0.97) && tapa) {
            
            let vertice = forma[Math.round(u * cantVertices)];
            nuevoU = (vertice[0] - xmin) / (xmax - xmin);
            nuevoV = (vertice[1] - ymin) / (ymax - ymin);

            return [nuevoU, nuevoV];
        }

        let acumuladoU = [];
        let acumulado = 0;


        for (let i = 0; i < forma.length; i++) {
            let iAnt = i - 1;
            if (i == 0){
                iAnt = 0
            }
            let restaX = forma[i][0] -forma[iAnt][0];
            let restaY = forma[i][1] -forma[iAnt][1];
            let restaZ = forma[i][2] -forma[iAnt][2];
            acumulado += Math.sqrt(restaX*restaX + restaY*restaY + restaZ*restaZ);
            acumuladoU[i] = acumulado;
        }

        let acumuladoV = [];
        acumulado = 0;

        for (let i = 0; i < recorridoDiscreto.length; i++) {
            let iAnt = i - 1;
            if (i == 0){
                iAnt = 0
            }
            let restaX = recorridoDiscreto[i][0] -recorridoDiscreto[iAnt][0];
            let restaY = recorridoDiscreto[i][1] -recorridoDiscreto[iAnt][1];
            let restaZ = recorridoDiscreto[i][2] -recorridoDiscreto[iAnt][2];
            acumulado += Math.sqrt(restaX*restaX + restaY*restaY + restaZ*restaZ);
            acumuladoV[i] = acumulado;
        }


        nuevoU = acumuladoU[Math.round(u * cantVertices)] / (acumuladoU[forma.length -1]);

        nuevoV = acumuladoV[Math.round(v * cantNiveles)] / (acumuladoV[recorridoDiscreto.length -1]);


        return [nuevoU, nuevoV];

    }
}

function Plano(ancho,largo){

    this.getPosicion=function(u,v){
        var x=(u-0.5)*ancho;
        var z=(v-0.5)*largo;
        return [x,0,z];
    }

    this.getNormal=function(u,v){
        return [0,1,0];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}

function Esfera(radio){

    this.getPosicion=function(u,v){
        var x = radio*Math.cos(2*u*Math.PI)*Math.sin(v*Math.PI);
        var y = radio*Math.cos(v*Math.PI);
        var z = radio*Math.sin(2*u*Math.PI)*Math.sin(v*Math.PI);
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        var coordenadas = this.getPosicion(u,v);
        return [(coordenadas[0]/radio), (coordenadas[1]/radio), (coordenadas[2]/radio)];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,1-v];
    }
}

function TuboSenoidal(amplitud, longitud, radio, altura, tapa = false){

    this.getPosicion=function(u,v){
        var x = Math.cos(u*2*Math.PI)*(radio + amplitud*Math.sin(v*2*Math.PI/longitud));
        var y = altura*(v-0.5);
        var z = Math.sin(u*2*Math.PI)*(radio + amplitud*Math.sin(v*2*Math.PI/longitud));

        if(tapa && (v==0 || v==1)){
            return [x,0,z]
        }
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        var coordenadas = this.getPosicion(u,v);
        var d1 = this.getPosicion(u+0.01, v);
        var d2 = this.getPosicion(u, v+0.01);

        var v1 = [d1[0] - coordenadas[0], d1[1] - coordenadas[1], d1[2] - coordenadas[2]];
        var v2 = [d2[0] - coordenadas[0], d2[1] - coordenadas[1], d2[2] - coordenadas[2]];

        return [(v1[1]*v2[2] - v2[1]*v1[2]), (v1[0]*v2[2] - v2[0]*v1[2]), (v1[0]*v2[1] - v2[0]*v1[1])];
    }

    this.getCoordenadasTextura=function(u,v){
        return [u,v];
    }
}



function generarSuperficie(superficie,filas,columnas){
    
    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {

            var u=j/columnas;
            var v=i/filas;

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs=superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);
        }
    }

    
    indexBuffer=[];  

    for (i=0; i < filas; i++) {
        for (j=0; j < columnas; j++) {

            var inicial = i*(columnas+1) + j;
            indexBuffer.push(inicial);
            indexBuffer.push(inicial+columnas+1);


        }
        var inicial = i*(columnas+1) + columnas;
        indexBuffer.push(inicial,inicial+columnas+1);
        if (i < filas - 1){
            indexBuffer.push(inicial+columnas+1,inicial+1);
        }
    }



    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

function dibujarMalla(mallaDeTriangulos, textura = false){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

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

