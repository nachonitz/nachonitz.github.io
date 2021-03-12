
        // atributos del vértice (cada uno se alimenta de un ARRAY_BUFFER distinto)

        attribute vec3 aPosition;   //posicion (x,y,z)
        attribute vec3 aNormal;     //vector normal (x,y,z)
        attribute vec2 aUv;         //coordenadas de texture (x,y)  x e y (en este caso) van de 0 a 1

        // variables Uniform (son globales a todos los vértices y de solo-lectura)

        uniform mat4 uMMatrix;     // matriz de modelado
        uniform mat4 uVMatrix;     // matriz de vista
        uniform mat4 uPMatrix;     // matriz de proyección
        uniform mat3 uNMatrix;     // matriz de normales
                        
        uniform float time;                 // tiempo en segundos
        
        uniform sampler2D uSampler;         // sampler de textura de la tierra

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

        const float epsilon=8.0*1.0/1024.0; 

        const float amplitud=8.0;


        // controla la cantidad de muestras que se promedian

        const int samplingRange=3; // 0 = 1 muestra,  1 = 9 muestras, 2= 25 muestras, 3 = 49 muestras
        
        // toma un promedio ponderados de muestras de una textura

        float multisample(sampler2D texture,vec2 coord){


            float sum=0.0;
            float totalWeight;
            float pixelDistance=(1.0/1024.);

            for (int i=-samplingRange;i<=samplingRange;i++){
                for (int j=-samplingRange;j<=samplingRange;j++){

                    float weight=1.0/(1.0+sqrt(pow(float(j),2.0)+pow(float(i),2.0)));
                    totalWeight+=weight;

                    vec2 uv=coord+vec2(float(i),float(j))*pixelDistance*2.0;
                    sum+=weight*texture2D(texture, vec2(uv.s, uv.t)).x;
                }
            }

            return sum/totalWeight;
        }


        void main(void) {
                    
            // vec3 position = aPosition;		
            // vec3 normal = aNormal;	
            // vec2 uv = aUv;
                                   	
            // vec4 center = texture2D(uSampler, vec2(uv.s, uv.t));                     
            // vec4 masU = texture2D(uSampler, vec2(uv.s+epsilon, uv.t));  
            // vec4 masV = texture2D(uSampler, vec2(uv.s, uv.t+epsilon));  

            // vec4 menosU = texture2D(uSampler, vec2(uv.s-epsilon, uv.t));  
            // vec4 menosV = texture2D(uSampler, vec2(uv.s, uv.t-epsilon));  


            // // elevamos la coordenada Y
            // position.y+=-1.5 + center.x*amplitud;

            // vec4 worldPos = uMMatrix*vec4(position, 1.0);                        

            // gl_Position = uPMatrix*uVMatrix*worldPos;

            // vWorldPosition=worldPos.xyz;              
            
            // // tangentes en U y en V
            // // vec3 gradU1=vec3(0.,(masU.x-center.x)*amplitud,epsilon);
            // // vec3 gradV1=vec3(epsilon,(masV.x-center.x)*amplitud,0.0);

            // // vNormal=normalize(cross(gradV1,gradU1));

            // float angU=atan((masU.x-center.x)*amplitud,epsilon);
            // float angV=atan((masV.x-center.x)*amplitud,epsilon);

            // // tangentes en U y en V
            // vec3 gradU1=vec3(cos(angU),sin(angU),0.0);
            // vec3 gradV1=vec3(0.0      ,sin(angV),cos(angV));
            
            // angU=atan((center.x-menosU.x)*amplitud,epsilon);
            // angV=atan((center.x-menosV.x)*amplitud,epsilon);

            // // segundo conjunto de tangentes en U y en V
            // vec3 gradU2=vec3(cos(angU),sin(angU),0.0);
            // vec3 gradV2=vec3(0.0      ,sin(angV),cos(angV));


            
            // // calculo el producto vectorial
            // vec3 tan1=(gradV1+gradV2)/2.0;
            // vec3 tan2=(gradU1+gradU2)/2.0;
            // vNormal=cross(tan1,tan2);



            // vectorPuntoCamara = normalize(-vec3(uVMatrix*worldPos) / (uVMatrix*worldPos).w);                  

            // // gl_Position = uPMatrix*uVMatrix*worldPos;
            // vUv=uv;


                    
            vec3 position = aPosition;		            
            vec2 uv = aUv;

            float epsilon=1.0/1024.;
            
            float center = multisample(uSampler, vec2(uv.s, uv.t));
    
            float centerMasX = multisample(uSampler, vec2(uv.s+epsilon, uv.t));  
            float centerMasZ = multisample(uSampler, vec2(uv.s, uv.t+epsilon));  

            // elevamos la coordenada Y
            position.y+=-1.5+center*amplitud;

            vec4 worldPos = uMMatrix*vec4(position, 1.0);                        
            gl_Position = uPMatrix*uVMatrix*worldPos;

            vWorldPosition=worldPos.xyz;        

            /*
              hay que calcular la normal de la superficie

              La idea es calcular la diferencia de altura entre 2 puntos muy prÃ³ximos (separados por Epsilon)
              obtener la pendiente  y estimar el vector tangente en el sentido del eje "X" y el eje "Z" (+Y es arriba)


                    * - - - - -  - - - - - - - - - - - }
                    |                                  }  deltaElevationX
                    |                       *  - - - - }
                    |                       |
                ----|-----------------------|--------> +X
                    * center               * centerMasX

                    < -      epsilon     - >
            */

            // diferencias de elevaciÃ³n entre 2 puntos proximos
            
            float deltaElevationX=(centerMasX-center)*amplitud;
            float deltaElevationZ=(centerMasZ-center)*amplitud;
  

            // angulo del vector tangente en el plano XY, ZY respectivamente            
            float angEnX=atan(deltaElevationX,epsilon);
            float angEnZ=atan(deltaElevationZ,epsilon);

            // vectores tangentes
            vec3 tangenteX=vec3(cos(angEnX),sin(angEnX),0.0);
            vec3 tangenteZ=vec3(0.0      ,sin(angEnZ),cos(angEnZ));

            // vector normal
            vNormal=cross(tangenteZ,tangenteX);
            vUv=uv;		
        }