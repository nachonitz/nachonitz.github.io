precision mediump float;
            varying highp vec2 vUv;
			
			uniform float scale1;
			uniform float low;
			uniform float high;
			
            uniform sampler2D uSampler0;
			uniform sampler2D uSampler1;
			uniform sampler2D uSampler2;
			uniform sampler2D uSampler3;

			// Simplex Noise

			vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
			
			// Perlin Noise						
						
			vec3 mod289(vec3 x)
			{
			  return x - floor(x * (1.0 / 289.0)) * 289.0;
			}

			vec4 mod289(vec4 x)
			{
			  return x - floor(x * (1.0 / 289.0)) * 289.0;
			}

			// vec4 permute(vec4 x)
			// {
			//   return mod289(((x*34.0)+1.0)*x);
			// }

			// vec4 taylorInvSqrt(vec4 r)
			// {
			//   return 1.79284291400159 - 0.85373472095314 * r;
			// }

			vec3 fade(vec3 t) {
			  return t*t*t*(t*(t*6.0-15.0)+10.0);
			}
			
			
			// ***************************************************************************
			varying vec3 vNormal;
        varying vec3 vWorldPosition;
		varying vec3 vectorPuntoCamara; 

        vec3 difusa(vec3 textureColor, vec3 direccion){
            vec3 apunta = -direccion;
            return textureColor * max(dot(apunta,vNormal),1.);
        }

        vec3 especular(vec3 textureColor, vec3 direccion) {
            vec3 apunta = -direccion;
            vec3 ref = reflect(-apunta, vNormal);
            return textureColor * pow(max(dot(ref, vectorPuntoCamara),0.), 0.0003);
        }
			
            void main(void) {

				// uSampler0: tierra
				// uSampler1: roca
				// uSampler2: pasto
			
			   //vec4 textureColor = texture2D(uSampler2,vUv*3.0);
			   //vec4 textureColor = texture2D(uSampler2,vUv*3.0);
			   
			   // sampleo el pasto a diferentes escalas
			   float newHigh;
			   float newLow;

			   if (vWorldPosition.y < 3.36){
				   newLow = 1.5;
				   newHigh = 1.5;
			   }
				else{
					if (vWorldPosition.y < 4.0){
					 newLow = 0.9;
				    newHigh = -0.9;
					}else{
					 newLow = 1.1;
				    newHigh = 0.9;
					}
				}

			//    vec3 pasto1=texture2D(uSampler2,vUv*4.0*scale1).xyz;
			//    vec3 pasto2=texture2D(uSampler2,vUv*3.77*scale1).xyz;
			//    vec3 pasto3=texture2D(uSampler2,vUv*2.11*scale1).xyz;
			   
			//    // sampleo la tierra a diferentes escalas

			//    vec3 tierra1=texture2D(uSampler3,vUv*4.0*scale1).xyz;
			//    vec3 tierra2=texture2D(uSampler3,vUv*2.77*scale1).xyz;
			   
			//    // sampleo la roca
			//    vec3 roca=texture2D(uSampler1,vUv*2.77*scale1).xyz;
			   
			//    // combino los 3 sampleos del pasto con la funcion de mezcla
			//    vec3 color1=mix(mix(pasto1,pasto2,0.5),pasto3,0.3);
            //     // vec3 color1=mix(mix(pasto1,pasto1,0.5),pasto1,0.3);
			   
			//    // genero una mascara 1 a partir de ruido perlin
			//    float noise1=snoise(vUv.xyx*8.23*scale1+23.11);
			//    float noise2=snoise(vUv.xyx*11.77*scale1+9.45);
			//    float noise3=snoise(vUv.xyx*14.8*scale1+21.2);
			   
			//    float mask1=mix(mix(noise1,noise2,0.5),noise3,0.3);		
			// //    mask1=smoothstep(-0.1,0.2,mask1);
            //     // float mask1=mix(mix(noise1,noise1,0.5),noise1,0.3);	
            //     mask1=smoothstep(-0.1,0.2,mask1);
			   
			//    // combino tierra y roca usando la mascara 1
			//    vec3 color2=mix(mix(tierra1,tierra2,0.5),roca,mask1);
			   
            //     // vec3 color2=mix(mix(tierra1,tierra1,0.5),roca,mask1);
			   
			//    // genero la mascara 2 a partir del ruido perlin
			//    float noise4=snoise(vUv.xyx*8.23*scale1);
			//    float noise5=snoise(vUv.xyx*11.77*scale1);
			//    float noise6=snoise(vUv.xyx*14.8*scale1);
			   
			//    float mask2=mix(mix(noise4,noise5,0.5),noise6,0.3);
            // // float mask2=mix(mix(noise4,noise4,0.5),noise4,0.3);			   
			//    mask2=smoothstep(low,high,mask2);
			   
			//    // combino color1 (tierra y rocas) con color2 a partir de la mascara2
			//    vec3 color=mix(color1,color2,mask2);	



				vec3 pasto1=texture2D(uSampler2,vUv*4.0*scale1).xyz;
			   vec3 pasto2=texture2D(uSampler2,vUv*3.77*scale1).xyz;
			   vec3 pasto3=texture2D(uSampler2,vUv*2.11*scale1).xyz;
			   
			   // sampleo la tierra a diferentes escalas

			   vec3 tierra1=texture2D(uSampler3,vUv*4.0*scale1).xyz;
			   vec3 tierra2=texture2D(uSampler2,vUv*3.77*scale1).xyz;
			   vec3 tierra3=texture2D(uSampler3,vUv*2.11*scale1).xyz;

			   
			   // sampleo la roca
			   vec3 roca=texture2D(uSampler1,vUv*2.77*scale1).xyz;
			   
			   // combino los 3 sampleos del pasto con la funcion de mezcla
			   vec3 color1=mix(mix(tierra1,tierra2,0.5),tierra3,0.3);
                // vec3 color1=mix(mix(pasto1,pasto1,0.5),pasto1,0.3);
			   
			   // genero una mascara 1 a partir de ruido perlin
			   float noise1=snoise(vUv.xyx*8.23*scale1+23.11);
			   float noise2=snoise(vUv.xyx*11.77*scale1+9.45);
			   float noise3=snoise(vUv.xyx*14.8*scale1+21.2);
			   
			   float mask1=mix(mix(noise1,noise2,0.5),noise3,0.3);		
			//    mask1=smoothstep(-0.1,0.2,mask1);
                // float mask1=mix(mix(noise1,noise1,0.5),noise1,0.3);	
                mask1=smoothstep(-0.1,0.2,mask1);
			   
			   // combino tierra y roca usando la mascara 1
			   vec3 color2=mix(mix(pasto1,pasto2,0.5),roca,mask1);
			   
                // vec3 color2=mix(mix(tierra1,tierra1,0.5),roca,mask1);
			   
			   // genero la mascara 2 a partir del ruido perlin
			   float noise4=snoise(vUv.xyx*8.23*scale1);
			   float noise5=snoise(vUv.xyx*11.77*scale1);
			   float noise6=snoise(vUv.xyx*14.8*scale1);
			   
			   float mask2=mix(mix(noise4,noise5,0.5),noise6,0.3);
            // float mask2=mix(mix(noise4,noise4,0.5),noise4,0.3);			   
			   mask2=smoothstep(newLow,newHigh,mask2);
			   
			   // combino color1 (pasto y rocas) con color2 a partir de la mascara2
			   vec3 color=mix(color1,color2,mask2);		   

				
				vec3 luz_direccional = difusa(color,vec3(10,10,-10))*0.1+ especular(color,vec3(10,10,-10))*0.03;
				luz_direccional += difusa(color,vec3(0,-1,0))*0.1+ especular(color,vec3(0,-1,0))*0.02;
			   
			   gl_FragColor = vec4(color+luz_direccional,1.0);

			   //gl_FragColor = vec4(mask1,mask1,mask1,1.0);			   
			   
			   
            }