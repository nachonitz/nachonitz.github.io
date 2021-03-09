class Helicoptero{

    constructor(controlhelicoptero){
        this.controlhelicoptero = controlhelicoptero;
        this.capsula = getCapsula()
        this.capsula.setEscalado(0.1,0.1,0.1)
        this.capsula.initReflection("img/cielo1.jpg")
        this.capsula.color = [3,3,3]
        // this.capsula.setEscalado(0.006,0.006,0.006)
        // this.capsula.color = [0.925,0.886,0.776]
        // this.capsula.color = [0.66,0.66,0.66]
        this.cilindros = []
        this.brazos = []
        this.helices = []
        this.cilindrosMedios = []
        this.patas = []

        this.crearCilindros()
        this.agregarBrazos()
        this.agregarHelices()
        this.agregarCilindrosMedios()
        this.agregarPatas()

        this.soporteGroso = getSoporteGroso()
        this.soporteGroso.setPosicion(-2,-2.1,1.5)
        this.soporteGroso.setRotacion(0,Math.PI/2,0)
        this.capsula.addChild(this.soporteGroso)

        // this.soporte1 = getSoporte()
        // this.soporte1.setPosicion(0,-2.1,1.5)
        // this.soporte1.setRotacion(0,0,Math.PI/2)
        // this.capsula.addChild(this.soporte1)

        // this.soporte2 = getSoporte()
        // this.soporte2.setPosicion(0,-2.1,-1.5)
        // this.soporte2.setRotacion(0,0,Math.PI/2)
        // this.capsula.addChild(this.soporte2)

        this.soporteGroso2 = getSoporteGroso()
        this.soporteGroso2.setPosicion(-2,-2.1,-1.5)
        this.soporteGroso2.setRotacion(0,Math.PI/2,0)
        this.capsula.addChild(this.soporteGroso2)


        this.brazoCola1 = getBrazoCola()
        this.brazoCola1.setPosicion(-3.5,1.3,.5)
        this.brazoCola1.setRotacion(Math.PI/2,0,-Math.PI/12)
        this.capsula.addChild(this.brazoCola1)

        this.brazoCola2 = getBrazoCola()
        this.brazoCola2.setPosicion(-3.5,1.3,-.5)
        this.brazoCola2.setRotacion(Math.PI/2,0,-Math.PI/12)
        this.capsula.addChild(this.brazoCola2)

        this.cilindroCola1 = getCilindroCola()
        this.cilindroCola1.setPosicion(-1.2,-0.4,.1)
        this.cilindroCola1.setRotacion(0,0,0)
        this.brazoCola1.addChild(this.cilindroCola1)

        this.paletaCola1 = getPaletaCola()
        this.paletaCola1.setRotacion(0,Math.PI/8,Math.PI/2)
        this.paletaCola1.setPosicion(0,1,0)
        this.cilindroCola1.addChild(this.paletaCola1)

        this.paletaCola2 = getPaletaCola()
        this.paletaCola2.setRotacion(0,Math.PI/8,0)
        this.paletaCola2.setPosicion(0,-1,0)
        this.cilindroCola1.addChild(this.paletaCola2)


        this.helicesLevantada = 0;
        this.cambiandoHelice = 0;
        this.angulo = 0;


    }

    agregarPatas(){

        for (var i = 0; i < 4; i++){
            var pata = getPata()
            switch(i){
                case 0:
                    pata.setPosicion(1,-1.2,1)
                    pata.setRotacion(-Math.PI/6,0,0)
                    break;
                case 1:
                    pata.setPosicion(-1,-1.2,1)
                    pata.setRotacion(-Math.PI/6,0,0)
                    break;
                case 2:
                    pata.setPosicion(1,-1.2,-1)
                    pata.setRotacion(Math.PI/6,0,0)
                    break;
                case 3:
                    pata.setPosicion(-1,-1.2,-1)
                    pata.setRotacion(Math.PI/6,0,0)
                    break;
            }
            
            this.capsula.addChild(pata)
            this.patas.push(pata)
        }
    }

    agregarCilindrosMedios(){
        for (var i = 0 ; i < this.helices.length; i++){
            var cilindroMedio = getCilindroMedio()
            this.helices[i].addChild(cilindroMedio)
            this.cilindrosMedios.push(cilindroMedio)
        }
    }

    agregarHelices(){
        for (var i = 0; i < this.brazos.length; i++){
            var helice = getHeliceRoja()
            helice.setPosicion(0,0,1.39)
            if (i >= 2){
                helice.setPosicion(0,0,-1.39)
            }
            helice.setRotacion(0,0,Math.PI/2)
            this.cilindros[i].addChild(helice)
            this.helices.push(helice)
        }
    }
    agregarBrazos(){
        for (var i = 0; i < this.cilindros.length; i++){
            var brazo = getBrazoDeHelice()
            brazo.setPosicion(0,0,0.5)
            if (i >=2){
                brazo.setPosicion(0,0,-0.5)
            }
            brazo.setRotacion(Math.PI/2,0,0)
            this.cilindros[i].addChild(brazo)
            this.brazos.push(brazo)
        }
    }

    crearCilindros(){
        let colorTapas = [0.6,0.,0.]
        var cilindro1 = new Objeto3d(null,30,30)
        cilindro1.setPosicion(0,1.3,1.5)
        cilindro1.setRotacion(0,0,Math.PI/2)
        cilindro1.invertirRotacion()
        cilindro1.color = [0.66,0.66,0.66]
        
        var tapa = getCilindro(0.5,1,colorTapas)
        tapa.setPosicion(-.5,1.3,1.7)
        tapa.setRotacion(0,Math.PI/2,0)
        tapa.invertirRotacion()
        this.capsula.addChild(tapa)
        this.capsula.addChild(cilindro1)

        var cilindro2 = new Objeto3d(null,30,30)
        cilindro2.setPosicion(-1.8,1.3,1.5)
        cilindro2.setRotacion(0,0,Math.PI/2)
        cilindro2.invertirRotacion()
        cilindro2.color = [0.66,0.66,0.66]

        var tapa2 = getCilindro(0.5,1,colorTapas)
        tapa2.setPosicion(-2.3,1.3,1.7)
        tapa2.setRotacion(0,Math.PI/2,0)
        tapa2.invertirRotacion()
        this.capsula.addChild(tapa2)
        this.capsula.addChild(cilindro2)

        var cilindro3 = new Objeto3d(null,30,30)
        cilindro3.setPosicion(0,1.3,-1.5)
        cilindro3.setRotacion(0,0,Math.PI/2)
        cilindro3.invertirRotacion()
        cilindro3.color = [0.66,0.66,0.66]

        var tapa3 = getCilindro(0.5,1,colorTapas)
        tapa3.setPosicion(-.5,1.3,-1.3)
        tapa3.setRotacion(0,Math.PI/2,0)
        tapa3.invertirRotacion()
        this.capsula.addChild(tapa3)
        this.capsula.addChild(cilindro3)

        var cilindro4 = new Objeto3d(null,30,30)
        cilindro4.setPosicion(-1.8,1.3,-1.5)
        cilindro4.setRotacion(0,0,Math.PI/2)
        cilindro4.invertirRotacion()
        cilindro4.color = [0.66,0.66,0.66]

        var tapa4 = getCilindro(0.5,1,colorTapas)
        tapa4.setPosicion(-2.3,1.3,-1.3)
        tapa4.setRotacion(0,Math.PI/2,0)
        tapa4.invertirRotacion()
        this.capsula.addChild(tapa4)
        this.capsula.addChild(cilindro4)

        this.cilindros.push(cilindro1,cilindro2,cilindro3,cilindro4)

    }

    rotacionZ(rz){
        if (rz >= 0.6){
            return 0.6
        }
        if (rz <= -0.6){
            return -0.6
        }
        return rz
    }

    actualizar(){
        this.controlhelicoptero.update();
        let pos = this.controlhelicoptero.getPosition()
        let rx = this.controlhelicoptero.getRoll()
        let ry = this.controlhelicoptero.getYaw()
        let rz = this.controlhelicoptero.getPitch()


        this.capsula.setPosicion(pos.x, pos.y, pos.z);
        this.capsula.setRotacion(rx,ry,this.rotacionZ(rz*4));

        for (var i = 0; i < this.helices.length; i++){
            this.helices[i].setRotacion(0,0,this.rotacionZ(rz*6)+Math.PI/2)
        }

        this.paletaCola1.setRotacion(Math.PI/2+rx*2,0.7*Math.PI,0)
        this.paletaCola2.setRotacion(Math.PI/2+rx*2,0.7*Math.PI,0)

        if (this.cambiandoHelice){
            if (this.helicesLevantada){
                if (this.angulo <= 0){
                    this.cambiandoHelice = 0
                    this.helicesLevantada = 0
                    return
                }
                this.angulo -= Math.PI/50
                this.rotarHelice()
            }

            else{
                if (this.angulo >= Math.PI/2){
                    this.cambiandoHelice = 0
                    this.helicesLevantada = 1
                    return
                }
                this.angulo += Math.PI/50
                this.rotarHelice()
            }
        }
    }

    comenzarRotacionHelice(){
        this.cambiandoHelice = 1
    }

    rotarHelice(){
        for (var i = 0; i < this.cilindros.length; i++){
            if (i < 2){
                this.cilindros[i].setRotacion(-this.angulo,0,Math.PI/2)
                // this.cilindros[i].setRotacion(-this.angulo,Math.PI/2,0)
            }
            else{
                this.cilindros[i].setRotacion(this.angulo,0,Math.PI/2)
            }
        }
    }

    dibujar(){
        for (var i = 0; i < this.cilindrosMedios.length; i++){
            this.cilindrosMedios[i].setRotacion(0,time*20,0)
        }
        
        this.capsula.dibujar(mat4.create())
    }
}