        precision mediump float;

        varying highp vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 modelPosition;
        varying vec3 vectorPuntoCamara;
        

        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;	    // color de luz direccional
        uniform vec3 uLightPosition;        // posición de la luz
        uniform vec3 RGB;
        
        uniform bool uUseLighting;          // usar iluminacion si/no

        uniform sampler2D uSampler;
        uniform sampler2D uSamplerReflection;

        const float PI = 3.1415;

        const vec3 posicion_sol = vec3(0,50,0);

        vec3 difusa(vec3 textureColor, vec3 direccion){
            return textureColor * max(dot(direccion,vNormal),0.);
        }

		// uniform float uShininess;
		uniform vec3 uCameraPosition;

        vec3 especular(vec3 textureColor, vec3 direccion) {
            vec3 ref = reflect(-direccion, vNormal);
			vec3 v = normalize(uCameraPosition - vWorldPosition);
            return textureColor * pow(max(dot(v, ref),0.0), 128.0);
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
            if (RGB == vec3(2.) || RGB == vec3(3.)){
                // vec2 vectorTextura = vec2(-modelPosition.x,modelPosition.y);
                textureColor = texture2D(uSampler, vec2(vUv.s,vUv.t)).xyz;
            }else{
                textureColor = RGB;
            }
            vec3 textureReflectionColor = vec3(0.);
            if (RGB == vec3(3.)){
                vec2 vectorTextura = vec2(-modelPosition.x,modelPosition.y);
                textureColor = texture2D(uSampler,vectorTextura/6.5 - vec2(0.5,0.55)).xyz;

                vec3 reflexion = reflect(-vectorPuntoCamara,vNormal);
                float r = length(reflexion);

                float valorAlfa = atan(reflexion.z, reflexion.x);
                float valorBeta = acos(reflexion.y / r);

                float alfa = (valorAlfa)/ (2.*PI);
                float beta = (valorBeta)/(1.*PI);
                textureReflectionColor = texture2D(uSamplerReflection, vec2(alfa,-beta)).xyz*0.3;
            }

            
            float ka = 0.3;
			float kd = 0.6;
			float ks = 0.1;
			vec3 direccion = normalize(vec3(-1,1,1));
			vec3 direccion2 = normalize(vec3(0,-1,0));
			vec3 luz_direccional = textureColor*ka +  difusa(textureColor,direccion)*kd + especular(textureColor,direccion)*ks;
            luz_direccional += textureColor*ka + difusa(textureColor,direccion2)*kd + especular(textureColor,direccion2)*ks;
            gl_FragColor = vec4(luz_direccional+ textureReflectionColor,1.0);
            // gl_FragColor = vec4(vNormal,1.0);
        }