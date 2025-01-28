document.addEventListener("DOMContentLoaded",()=>{let e=document.getElementById("gpuCanvas"),t=e.getContext("webgl2",{antialias:!1,powerPreference:"high-performance"})||e.getContext("experimental-webgl2");if(!t)throw alert("WebGL 2.0 is not available"),Error("WebGL 2.0 unsupported");e.width=4*window.innerWidth,e.height=4*window.innerHeight;let r=`#version 300 es
            precision highp float;
            in vec2 position;
            uniform float time;
            uniform vec2 mouse;
            uniform vec2 resolution;
            
            #define ITER 50
            void main() {
                vec2 p = position;
                for(int i=0; i<ITER; i++){
                    p = vec2(
                        p.x*p.x - p.y*p.y + mouse.x*0.2,
                        2.0*p.x*p.y + mouse.y*0.2
                    );
                }
                p *= sin(time*0.5 + length(p)*10.0)*2.0;
                gl_Position = vec4(p, 0.0, 1.0);
                gl_PointSize = 32.0 * (1.0 + sin(time*2.0));
            }
        `,i=`#version 300 es
            precision highp float;
            out vec4 fragColor;
            uniform float time;
            uniform vec2 mouse;
            uniform vec2 resolution;
            
            vec3 palette(float t){
                return vec3(
                    0.5 + 0.5*cos(6.28318*(t*1.0 + 0.0)),
                    0.5 + 0.5*cos(6.28318*(t*1.0 + 0.4)),
                    0.5 + 0.5*cos(6.28318*(t*1.0 + 0.6))
                );
            }
            
            void main() {
                vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
                vec2 m = mouse * 0.5 + 0.5;
                uv += vec2(sin(time*0.7), cos(time*0.6))*0.2;
                
                vec3 col = vec3(0.0);
                for(int i=0; i<4; i++){
                    uv = abs(uv*1.5) - 1.0;
                    float d = length(uv)*exp(-length(uv));
                    col += palette(length(uv) + time*0.2 + float(i)*0.3) * d;
                }
                
                fragColor = vec4(col * 2.0, 1.0);
            }
        `;function o(e,t,r){function i(t,r){let i=e.createShader(t);return(e.shaderSource(i,r),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS))?i:(console.error(e.getShaderInfoLog(i)),e.deleteShader(i),null)}let o=i(e.VERTEX_SHADER,t),n=i(e.FRAGMENT_SHADER,r);if(!o||!n)return null;let a=e.createProgram();return(e.attachShader(a,o),e.attachShader(a,n),e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS))?a:(console.error(e.getProgramInfoLog(a)),null)}let n=o(t,r,i);if(!n)throw Error("Shader program failed to initialize");t.useProgram(n);let a=t.getAttribLocation(n,"position"),l=t.createVertexArray();t.bindVertexArray(l);let $=new Float32Array(4e6);for(let u=0;u<4e6;u+=2)$[u]=2*Math.random()-1,$[u+1]=2*Math.random()-1;let f=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,f),t.bufferData(t.ARRAY_BUFFER,$,t.STATIC_DRAW),t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0);let m=t.getUniformLocation(n,"time"),E=t.getUniformLocation(n,"mouse"),c=t.getUniformLocation(n,"resolution"),T=0,d=0;e.addEventListener("mousemove",t=>{T=t.clientX/e.width*2-1,d=-(2*(t.clientY/e.height))+1});let s=[];for(let g=0;g<4;g++){let h=t.createFramebuffer(),R=t.createTexture();t.bindTexture(t.TEXTURE_2D,R),t.texImage2D(t.TEXTURE_2D,0,t.RGBA32F,e.width,e.height,0,t.RGBA,t.FLOAT,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.bindFramebuffer(t.FRAMEBUFFER,h),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,R,0),s.push({fb:h,texture:R})}let v=0;function A(){v+=.016,t.uniform1f(m,v),t.uniform2f(E,T,d),t.uniform2f(c,e.width,e.height),s.forEach(({fb:e})=>{t.bindFramebuffer(t.FRAMEBUFFER,e),t.drawArrays(t.POINTS,0,2e6)}),t.bindFramebuffer(t.FRAMEBUFFER,null),t.clear(t.COLOR_BUFFER_BIT),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE),s.forEach(({texture:e})=>{t.bindTexture(t.TEXTURE_2D,e),t.drawArrays(t.POINTS,0,2e6)}),requestAnimationFrame(A)}t.clearColor(0,0,0,1),A()});
