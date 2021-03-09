var forma;
var formaDiscretizada;
var recorrido;
var recorridoDiscreto;
var matricesNormales;
var capsula
var brazo

function getCapsula(){
    var forma = new CurvaBezier([[-3,1.5,0],[-1.4,-1,0],[-1,-1.2,0],[2,-1.2,0],[4,-1.8,0],[3,1.5,0],[0,2,0],[-3,1.5,0]]);
    var formaDiscretizada = discretizadorDeCurvas(forma, 40);
    var recorrido = new CurvaBezier([[0,0,-1.5],[0,0,1.5]]);
    var recorridoDiscreto = discretizadorDeCurvas(recorrido, 40);
    var matricesDiscretas = discretizadorNormal(recorrido,40);
    return new Objeto3d(new SuperficieBarrido(formaDiscretizada,recorridoDiscreto,matricesDiscretas
    ,40,40,true),40,40, makeTexture('/img/cabina.png'));
}

function circuloArriba(radio,largo,color){
    var forma = new CurvaBezier([[0,0,0],[0,-0.655,0],[1,-0.655,0],[1,0,0]]);
    var formaDiscretizada = discretizadorDeCurvas(forma, 40);
    var recorrido = new CurvaBezier([[0,0,0],[0,0,largo]]);
    var recorridoDiscreto = discretizadorDeCurvas(recorrido, 40);
    var matricesDiscretas = discretizadorNormal(recorrido,40);
    var c = new Objeto3d(new SuperficieBarrido(formaDiscretizada,recorridoDiscreto,matricesDiscretas
        ,40,40,true),40,40);
    c.setEscalado(radio,radio,1)
    c.color = color
    return c
}
function circuloAbajo(radio,largo,color){
    var forma = new CurvaBezier([[0,0,0],[0,0.655,0],[1,0.655,0],[1,0,0]]);
    var formaDiscretizada = discretizadorDeCurvas(forma, 40);
    var recorrido = new CurvaBezier([[0,0,0],[0,0,largo]]);
    var recorridoDiscreto = discretizadorDeCurvas(recorrido, 40);
    var matricesDiscretas = discretizadorNormal(recorrido,40);
    var c = new Objeto3d(new SuperficieBarrido(formaDiscretizada,recorridoDiscreto,matricesDiscretas
        ,40,40,true),40,40);
    c.setEscalado(radio,radio,1)
    c.color = color
    return c
}

function getCilindro(radio,largo,color){
    var circulo = new Objeto3d(null,10,10)
    var cArriba = circuloArriba(radio,largo,color)
    var cAbajo = circuloAbajo(radio,largo,color)

    


    circulo.addChild(cArriba);
    circulo.addChild(cAbajo);

    return circulo
}

function getBrazoDeHelice(){
    var brazo = new Objeto3d(new TuboSenoidal(0, 1, .1, 0.8),30,30)
    brazo.color = [.5,0,0]
    return brazo
}

function getPaleta(){
    var paleta =  new Objeto3d(new Plano(.15,1),5,5)
    paleta.color = [0.66,0.66,0.66]
    return paleta
}

function getCilindroMedio(){
    var cilindroMedio = new Objeto3d(new TuboSenoidal(0,1, .1, .35),30,30)
    var paleta1 = getPaleta()
    paleta1.setRotacion(0,0,Math.PI/4)
    
    var paleta2 = getPaleta()
    paleta2.setRotacion(0,Math.PI/6,Math.PI/4)

    var paleta3 = getPaleta()
    paleta3.setRotacion(0,2*Math.PI/6,Math.PI/4)

    var paleta4 = getPaleta()
    paleta4.setRotacion(0,3*Math.PI/6,Math.PI/4)

    var paleta5 = getPaleta()
    paleta5.setRotacion(0,4*Math.PI/6,Math.PI/4)

    var paleta6 = getPaleta()
    paleta6.setRotacion(0,5*Math.PI/6,Math.PI/4)


    cilindroMedio.addChild(paleta1)
    cilindroMedio.addChild(paleta2)
    cilindroMedio.addChild(paleta3)
    cilindroMedio.addChild(paleta4)
    cilindroMedio.addChild(paleta5)
    cilindroMedio.addChild(paleta6)
    return cilindroMedio
}

function getHeliceRojaMitad1(formaHelice){
    var forma = new CurvaBezier(formaHelice);
    var formaDiscretizada = discretizadorDeCurvas(forma, 40);
    var recorrido = new CurvaBezier([[0, -5.7, 0],
        [7.95, -5.7, 0],
        [7.95, 5.7, 0],
        [0, 5.7, 0]]);
    var recorridoDiscreto = discretizadorDeCurvas(recorrido, 40);
    var matricesDiscretas = discretizadorNormal(recorrido,40);
    var c = new Objeto3d(new SuperficieBarrido(formaDiscretizada,recorridoDiscreto,matricesDiscretas
        ,40,40,false),40,40);
    // c.setEscalado(radio,radio,1)
    c.setEscalado(0.1, 0.1, 0.22645);
    c.setRotacion(Math.PI / 2, -.00, 0);
    c.setPosicion(-.0,0,.00)
    // c.setRotacion(0,0,0)
    c.color = [0.6,0.,0.]
    return c
}
function getHeliceRojaMitad2(formaHelice){
    var forma = new CurvaBezier(formaHelice);
    var formaDiscretizada = discretizadorDeCurvas(forma, 40);
    var recorrido = new CurvaBezier([[0, 5.7, 0],
        [-7.95, 5.7, 0],
        [-7.95, -5.7, 0],
        [0, -5.7, 0]]);
    var recorridoDiscreto = discretizadorDeCurvas(recorrido, 40);
    var matricesDiscretas = discretizadorNormal(recorrido,40);
    var c = new Objeto3d(new SuperficieBarrido(formaDiscretizada,recorridoDiscreto,matricesDiscretas
        ,40,40,false),40,40);
    // c.setEscalado(radio,radio,1)
    c.setEscalado(0.1, 0.1, 0.22645);
    c.setRotacion(Math.PI / 2, -.00, 0);
    c.setPosicion(.0,0.0,.00)
    c.color = [.6,0.,0.]
    return c
}

function getHeliceRoja(){
    // var helice = new Objeto3d(new TuboSenoidal(0, 1, .5, 0.35),30,30)
    // helice.color = [1,0,0]
    var formaHelice = [[0, -1.1, 0],[1.5, -1.1, 0],[1.5, 1.1, 0],[0, 1.1, 0],[0, 1.1, 0],
    [-1.5, 1.1, 0],[-1.5, -1.1, 0],[0, -1.1, 0]]


    var helice = new Objeto3d(null,30,30)
    helice.addChild(getHeliceRojaMitad1(formaHelice))
    helice.addChild(getHeliceRojaMitad2(formaHelice))
    return helice
}

function getPata(){
    var pata = new Objeto3d(new TuboSenoidal(0, 1, 0.05, 2),10,10)
    pata.color = [0,0,0]
    return pata
}

function getSoporte(){
    var soporte = new Objeto3d(new TuboSenoidal(0, 1, 0.05, 3.5),10,10)
    soporte.color = [0,0,0]
    return soporte

}

function soporteArriba(color){
    var forma = [[.1,.1,0],[-.1,.1,0],[-.1,-.1,0],[.1,-.1,0],[.1,.1,0]]
    // var forma = new CurvaBezier([[0,0,0],[0,-0.655,0],[1,-0.655,0],[1,0,0]]);
    // var formaDiscretizada = discretizadorDeCurvas(forma, 40);
    var recorrido = new CurvaBezier([[0,0.29,0],[0,0,0],[0,0,3.2],[0,0.29,4]]);
    var recorridoDiscreto = discretizadorDeCurvas(recorrido, 40);
    var matricesDiscretas = discretizadorNormal(recorrido,40);
    var c = new Objeto3d(new SuperficieBarrido(forma,recorridoDiscreto,matricesDiscretas
        ,40,4,true),40,4);
    c.color = color
    return c
}
// function soporteAbajo(color){
//     // var forma = [[.3,.1,0],[-.3,.1,0],[-.3,-.1,0],[.3,-.1,0],[.3,.1,0]]
//     var forma = new CurvaBezier([[0,0,0],[0,-0.655/3,0],[1/3,-0.655/3,0],[1/3,0,0]]);
//     var formaDiscretizada = discretizadorDeCurvas(forma, 40);
//     var recorrido = new CurvaBezier([[0,0.29,0],[0,0,0],[0,0,3.2],[0,0.29,3.2]]);
//     var recorridoDiscreto = discretizadorDeCurvas(recorrido, 40);
//     var matricesDiscretas = discretizadorNormal(recorrido,40);
//     var c = new Objeto3d(new SuperficieBarrido(formaDiscretizada,recorridoDiscreto,matricesDiscretas
//         ,40,40,true),40,40);
//     c.color = color
//     return c
// }

function getSoporteGroso(){
    var soporte = new Objeto3d(null,0,0)
    var sopAr = soporteArriba([0,0,0])
    // var sopAb = soporteAbajo([0,0,0])
    // sopAb.setPosicion(0,2,0)
    soporte.addChild(sopAr)
    return soporte
}

function getBrazoCola(){
    var forma = [[.1,1.15,0],[-.1,1.15,0],[-.1,-1.15,0],[.1,-1.15,0],[.1,1.15,0]]
    var forma = [[1.15,.1,0],[1.15,-.1,0],[-1.15,-.1,0],[-1.15,.1,0],[1.15,.1,0]]

    var recorrido = new CurvaBezier([[0,0,0],[0,0,.2]])
    var recorridoDiscreto = discretizadorDeCurvas(recorrido, 40);
    var matricesDiscretas = discretizadorNormal(recorrido,40);
    var brazoCola = new Objeto3d(new SuperficieBarrido(forma,recorridoDiscreto,matricesDiscretas
    ,40,4,true),40,4);

    brazoCola.color = [0.925,0.886,0.776]
    return brazoCola
}

function getCilindroCola(){
    var brazo = new Objeto3d(new TuboSenoidal(0, 1, .1, 1.9),30,30)
    brazo.color = [0.925,0.886,0.776]
    return brazo
}

function getPaletaCola(){
    var forma = [[1,.5,0],[-1,.5,0],[-1,-.5,0],[1,-.5,0],[1,.5,0]]
    var recorrido = new CurvaBezier([[0,0,0],[0,0,.2]])
    var recorridoDiscreto = discretizadorDeCurvas(recorrido, 40);
    var matricesDiscretas = discretizadorNormal(recorrido,40);
    var paletaCola = new Objeto3d(new SuperficieBarrido(forma,recorridoDiscreto,matricesDiscretas
    ,40,4,true),40,4);

    paletaCola.color = [.6,0,0]
    return paletaCola
}


function getPistaAterrizaje(){
    var forma = [[1,.5,0],[-1,.5,0],[-1,-.5,0],[1,-.5,0],[1,.5,0]]
    var recorrido = new CurvaBezier([[0,0,0],[0,0,2.1]])
    var recorridoDiscreto = discretizadorDeCurvas(recorrido, 40);
    var matricesDiscretas = discretizadorNormal(recorrido,40);
    var pista2 = new Objeto3d(new SuperficieBarrido(forma,recorridoDiscreto,matricesDiscretas
    ,40,4,true),40,4);
    var pista = new Objeto3d(new Plano(2,2),50,50, makeTexture('img/helipad.jpg'))
    pista.setPosicion(0,3.486,-1)
    // pista.color = [0.,0.,0.]
    // pista.setEscalado(2,2,1)
    pista.setPosicion(0,4,0)
    pista.setRotacion(0,Math.PI/2,0)
    pista.addChild(pista2)
    pista2.color=[0.66,0.66,0.66]
    pista2.setPosicion(0,-.501,-1.05)

    return pista
}