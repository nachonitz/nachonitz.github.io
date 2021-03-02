// Como es un terreno cuadrado, van a haber FILAS_DE_PARCELAS x FILAS_DE_PARCELAS parcelas en el mapa
var FILAS_DE_PARCELAS = 10
var LADO_PARCELA = 9

class ParcelasManager{

    constructor(){
        this.parcelas = []

        this.textures = [];
    }

    iniciarParcelas = function(){
        for (var i = 0; i < FILAS_DE_PARCELAS; i++){
            var fila = []
            for (var j = 0; j < FILAS_DE_PARCELAS; j++){
                var parcela = new Parcela(128,128,i,j)
                parcela.initBuffers()
                fila.push(parcela)
            }
            this.parcelas.push(fila)
        }
    }

    estaEnRango = function(i,j){
        if ((i >= 0 && i < FILAS_DE_PARCELAS) && (j >= 0 && j < FILAS_DE_PARCELAS)){
            return true;
        }
        else{
            return false;
        }
    }

    dibujar = function(x, z){
        var i = Math.floor((x)/LADO_PARCELA)+ Math.floor(FILAS_DE_PARCELAS/2)-1;
        var j = Math.floor((z)/LADO_PARCELA)+ Math.floor(FILAS_DE_PARCELAS/2)-1;

        for (var k = -1; k < 4; k++){
            for (var l = -1; l < 4; l++){
                if (this.estaEnRango(i+k, j+l)){
                    this.parcelas[i+k][j+l].dibujar(this.textures)
                }
            }
        }
    }


    initTexture = function(texture_file){
        
        var texture = gl.createTexture();
				texture.image = new Image();
				
				this.textures.push(texture);

				texture.image.onload = function () {
				
					gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 					// invierto el ejeY					
					gl.bindTexture(gl.TEXTURE_2D, texture); 						// activo la textura
					
					gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);	// cargo el bitmap en la GPU
					
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);					// selecciono filtro de magnificacion
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);	// selecciono filtro de minificacion
					
					gl.generateMipmap(gl.TEXTURE_2D);		// genero los mipmaps
					gl.bindTexture(gl.TEXTURE_2D, null);
					

				}
				texture.image.src = texture_file;
			}

}