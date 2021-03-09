function discretizadorDeCurvas(curva, deltaU) {
	var curvaDiscreta = [];
	for (var i = 0; i <= deltaU; i ++) {
		curvaDiscreta.push(curva.coordenadas(i/deltaU));
	}

	return curvaDiscreta;
}

function discretizadorNormal(curva, cant) {
	var normales = [];
	for (var i = 0; i <= cant; i ++) {
		normales.push(curva.matrizNormal(i/cant));
	}

	return normales;
}

class CurvaBezier {

	constructor(puntos) {
		this.puntos = puntos;
		this.n = puntos.length;
		this.normalAnterior = vec3.zero(vec3.create());
	}


    productoVectorial(vecA, vecB) {
        var x = vecA[1] * vecB[2] - vecA[2] * vecB[1];
        var y = vecA[2] * vecB[0] - vecA[0] * vecB[2];
        var z = vecA[0] * vecB[1] - vecA[1] * vecB[0];
        return [x,y,z];
	}
	
	productoVectorialNormal(vecA, vecB) {
		var vecC = this.productoVectorial(vecA, vecB);
		var x = vecC[0];
        var y = vecC[1];
        var z = vecC[2];
		var norm = Math.sqrt([x,y,z].flatMap(x=>Math.pow(x,2)).reduce((a,b) => a+b, 0));
		norm = norm == 0 ? 1 : norm;
		return [x/norm, y/norm, z/norm];
	}

	tangent(t) {
		var tangente = [0,0,0];
		var a = this.coordenadas(t);
		var b = this.coordenadas(t+0.001);
		tangente[0] = (b[0]-a[0])/0.001
		tangente[1] = (b[1]-a[1])/0.001
		tangente[2] = (b[2]-a[2])/0.001

		return tangente
	}

	normall(t) {
		var normal = [0,0,0];
		var a = this.tangent(t);
		var b = this.tangent(t+0.01);
		normal = this.productoVectorial(a,b)
		// console.log("Normal? "+ this.producto(a,normal))

		normal = this.productoVectorialNormal(normal,a)

		if (normal[0]==0 && normal[1]==0 && normal[2]==0){
			// console.log("ENTRE EN EL IF")
			normal = [1,0,0]
			var tmp = this.productoVectorial(normal,a)
			if (tmp[0]==0 && tmp[1]==0 && tmp[2]==0){
				normal = [0,1,0]
			}
		}



		if (vec3.squaredLength(this.normalAnterior)!= 0){
			// console.log("Entro al anterior")
			var angulo = vec3.angle(this.normalAnterior,normal)
			// console.log(angulo)
			var err = Math.abs(Math.PI - angulo)
			if (err <= 0.5*Math.PI){
				normal = vec3.scale(normal,normal,-1)
			}
		}
		return normal
	}

	producto(a,b){
		return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
	}

	calcularNuevosPuntos(puntos, t){
		var nuevosPuntos = [];
		for (var i = 0; i < puntos.length -1; i++) {
			var coordenada = [0,0,0];
			coordenada[0] = puntos[i][0] + (puntos[i+1][0] - puntos[i][0])*t;
			coordenada[1] = puntos[i][1] + (puntos[i+1][1] - puntos[i][1])*t;
			coordenada[2] = puntos[i][2] + (puntos[i+1][2] - puntos[i][2])*t;
			nuevosPuntos.push(coordenada)
		}
		return nuevosPuntos;
	}

	coordenadas(t) {
		var todosPuntos = [this.puntos]
		for (var i = 0; i < this.n - 1; i++){
			// console.log(todosPuntos[i])
			var nuevosPuntos = this.calcularNuevosPuntos(todosPuntos[i], t)
			todosPuntos.push(nuevosPuntos);
		}
		// console.log(todosPuntos[todosPuntos.length-1], t)
		return todosPuntos[todosPuntos.length-1][0];
	}


	binormal(t) {
		var normal = this.normall(t);
		var tangente = this.tangent(t);

		return this.productoVectorialNormal(tangente, normal);
	}

	matrizNormal(t) {
		var normal = this.normall(t);
		var tgn = this.tangent(t);
		var binormal = this.binormal(t);


		var m = mat3.fromValues(...normal,...binormal,...tgn);
		this.normalAnterior = normal;

		return m;
	}

}