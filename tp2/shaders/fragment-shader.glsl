        precision mediump float;

        varying highp vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        

        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;	    // color de luz direccional
        uniform vec3 uLightPosition;        // posición de la luz
        uniform vec3 RGB;
        
        uniform bool uUseLighting;          // usar iluminacion si/no

        uniform sampler2D uSampler;

        const vec3 posicion_sol = vec3(0,50,0);

        vec3 difusa(vec3 textureColor, vec3 direccion){
            vec3 apunta = -direccion;
            return textureColor * max(dot(apunta,vNormal),1.);
        }


        void main(void) {
            
            vec3 lightDirection= normalize(uLightPosition - vec3(vWorldPosition));
            
            vec3 color=(uAmbientColor+uDirectionalColor*max(dot(vNormal,lightDirection), 0.0));
           
           color.x=RGB.x;
           color.y=RGB.y;
           color.z=RGB.z;
           
            if (uUseLighting)
                gl_FragColor = vec4(color,1.0);
            else
                gl_FragColor = vec4(0.7,0.7,0.7,1.0);
            
            vec3 textureColor;
            if (RGB == vec3(2.)){
                textureColor = texture2D(uSampler, vec2(vUv.s, vUv.t)).xyz;
            }else{
                textureColor = RGB;
            }
            
            vec3 color_posta = textureColor + difusa(color,vec3(10,10,-10))*0.1;


            gl_FragColor = vec4(color_posta,1.0);
        }