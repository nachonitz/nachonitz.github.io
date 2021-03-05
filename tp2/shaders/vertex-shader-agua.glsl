 // atributos del vértice (cada uno se alimenta de un ARRAY_BUFFER distinto)

        attribute vec3 aPosition;   //posicion (x,y,z)
        attribute vec3 aNormal;     //vector normal (x,y,z)
        attribute vec2 aUv;         //coordenadas de texture (x,y)  x e y (en este caso) van de 0 a 1

        // variables Uniform (son globales a todos los vértices y de solo-lectura)

        uniform mat4 uMMatrix;     // matriz de modelado
        uniform mat4 uVMatrix;     // matriz de vista
        uniform mat4 uPMatrix;     // matriz de proyección
        uniform mat3 uNMatrix;     // matriz de normales
        uniform mat4 uMatrixCamera;
                        
        uniform float time;                 // tiempo en segundos
        
        uniform sampler2D uSampler;         // sampler de textura de la tierra
        uniform sampler2D uSamplerReflection;


        // variables varying (comunican valores entre el vertex-shader y el fragment-shader)
        // Es importante remarcar que no hay una relacion 1 a 1 entre un programa de vertices y uno de fragmentos
        // ya que por ejemplo 1 triangulo puede generar millones de pixeles (dependiendo de su tamaño en pantalla)
        // por cada vertice se genera un valor de salida en cada varying.
        // Luego cada programa de fragmentos recibe un valor interpolado de cada varying en funcion de la distancia
        // del pixel a cada uno de los 3 vértices. Se realiza un promedio ponderado

        varying vec3 vWorldPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        varying vec3 vectorPuntoCamara;                        
        
        // constantes
        
        const float PI=3.141592653;

        void main(void) {
                    
            


            vec4 worldPos = uMMatrix*vec4(aPosition, 1.0);

            vec3 cameraPosition = vec3(uMatrixCamera[3]);

            vectorPuntoCamara = -normalize(vec3(worldPos) - cameraPosition.xyz);

            // vectorPuntoCamara = normalize(-vec3(uVMatrix*worldPos) / (uVMatrix*worldPos).w);                  

            gl_Position = uPMatrix*uVMatrix*worldPos;

            vWorldPosition=worldPos.xyz;              
            // vNormal=normalize(uNMatrix * aNormal);
            vNormal=vec3(0.,1.,0.);
            vUv=aUv;	
        }