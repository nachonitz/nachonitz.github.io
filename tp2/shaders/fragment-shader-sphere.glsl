precision mediump float;

        varying highp vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        

        uniform vec3 uAmbientColor;         // color de luz ambiente
        uniform vec3 uDirectionalColor;	    // color de luz direccional
        uniform vec3 uLightPosition;        // posición de la luz
        
        uniform bool uUseLighting;          // usar iluminacion si/no

        uniform sampler2D uSampler;

        void main(void) {
            vec4 textureColor = texture2D(uSampler, vec2(vUv.s, vUv.t));


            gl_FragColor = textureColor;

        }
