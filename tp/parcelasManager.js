// Como es un terreno cuadrado, van a haber FILAS_DE_PARCELAS x FILAS_DE_PARCELAS parcelas en el mapa
var FILAS_DE_PARCELAS = 8
var LADO_PARCELA = 7

class ParcelasManager{

    constructor(){
        this.parcelas = []

        this.texture = null;
    }

    iniciarParcelas = function(){
        for (var i = 0; i < FILAS_DE_PARCELAS; i++){
            var fila = []
            for (var j = 0; j < FILAS_DE_PARCELAS; j++){
                var parcela = new Parcela(150,150,i,j)
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
        var i = Math.floor((x)/LADO_PARCELA)+ Math.floor(FILAS_DE_PARCELAS/2) ;
        var j = Math.floor((z)/LADO_PARCELA)+ Math.floor(FILAS_DE_PARCELAS/2);

        for (var k = -1; k < 2; k++){
            for (var l = -1; l < 2; l++){
                if (this.estaEnRango(i+k, j+l)){
                    this.parcelas[i+k][j+l].dibujar(this.texture)
                }
            }
        }
    }


    initTexture = function(texture_file){
            
        this.texture = gl.createTexture();
        this.texture.image = new Image();

        this.texture.image.onload = function () {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, parcelasManager.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, parcelasManager.texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
    
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        this.texture.image.src = texture_file;
    }

}