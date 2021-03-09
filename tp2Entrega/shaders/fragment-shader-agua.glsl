precision mediump float;

        varying highp vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vectorPuntoCamara;
        

        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;	    // color de luz direccional
        uniform vec3 uLightPosition;        // posición de la luz
        
        uniform bool uUseLighting;          // usar iluminacion si/no

        uniform sampler2D uSampler;
        uniform sampler2D uSamplerReflection;

        const float PI = 3.1415;

        vec3 difusa(vec3 textureColor, vec3 direccion){
            vec3 apunta = -direccion;
            return textureColor * max(dot(apunta,vNormal),1.);
        }

        void main(void) {
            vec3 textureColor = texture2D(uSampler, vec2(vUv.s, vUv.t)).xyz;

            vec3 reflexion = reflect(-vectorPuntoCamara, vNormal);
            float r = length(reflexion);

            float valorAlfa = atan(reflexion.z, reflexion.x);
            float valorBeta = acos(reflexion.y / r);

            float alfa = (valorAlfa)/ (2.*PI);
            float beta = (valorBeta)/(1.*PI);
            vec3 textureReflectionColor = texture2D(uSamplerReflection, vec2(alfa,-beta)).xyz*0.4;

            vec3 color_difuso = difusa(textureColor,vec3(10,10,-10))*0.2;

            gl_FragColor = vec4(textureColor+textureReflectionColor+color_difuso,1.0);

        }
