window.onload=function(){const canvas=document.getElementById("сpuCanvas"),gl=canvas.getContext("webgl2",{antialias:!1,powerPreference:"high-performance"})||canvas.getContext("experimental-webgl2");if(!gl)throw alert("WebGL 2.0 is not available"),Error("WebGL 2.0 unsupported");/*by DAFFIER*/const DPR=4;canvas.width=4*window.innerWidth,canvas.height=4*window.innerHeight;const vertexShader=`#version 300 es
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
        `,fragmentShader=`#version 300 es
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
        `;function initShaderProgram(e,r,o){function t(r,o){let t=e.createShader(r);return(e.shaderSource(t,o),e.compileShader(t),e.getShaderParameter(t,e.COMPILE_STATUS))?t:(console.error(e.getShaderInfoLog(t)),e.deleteShader(t),null)}let a=t(e.VERTEX_SHADER,r),n=t(e.FRAGMENT_SHADER,o);if(!a||!n)return null;let l=e.createProgram();return(e.attachShader(l,a),e.attachShader(l,n),e.linkProgram(l),e.getProgramParameter(l,e.LINK_STATUS))?l:(console.error(e.getProgramInfoLog(l)),null)}const program=initShaderProgram(gl,vertexShader,fragmentShader);if(!program)throw Error("Shader program failed to initialize");gl.useProgram(program);const positionLocation=gl.getAttribLocation(program,"position"),vao=gl.createVertexArray();gl.bindVertexArray(vao);const PARTICLE_COUNT=2e6,positions=new Float32Array(4e6);for(let i=0;i<4e6;i+=2)positions[i]=2*Math.random()-1,positions[i+1]=2*Math.random()-1;const vbo=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vbo),gl.bufferData(gl.ARRAY_BUFFER,positions,gl.STATIC_DRAW),gl.enableVertexAttribArray(positionLocation),gl.vertexAttribPointer(positionLocation,2,gl.FLOAT,!1,0,0);const timeLoc=gl.getUniformLocation(program,"time"),mouseLoc=gl.getUniformLocation(program,"mouse"),resLoc=gl.getUniformLocation(program,"resolution");let mouseX=0,mouseY=0;canvas.addEventListener("mousemove",e=>{mouseX=e.clientX/canvas.width*2-1,mouseY=-(2*(e.clientY/canvas.height))+1});const FB_COUNT=4,framebuffers=[];for(let i=0;i<4;i++){let e=gl.createFramebuffer(),r=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,r),gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA32F,canvas.width,canvas.height,0,gl.RGBA,gl.FLOAT,null),gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR),gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE),gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE),gl.bindFramebuffer(gl.FRAMEBUFFER,e),gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,r,0),framebuffers.push({fb:e,texture:r})}let time=0;function render(){time+=.016,gl.uniform1f(timeLoc,time),gl.uniform2f(mouseLoc,mouseX,mouseY),gl.uniform2f(resLoc,canvas.width,canvas.height),framebuffers.forEach(({fb:e})=>{gl.bindFramebuffer(gl.FRAMEBUFFER,e),gl.drawArrays(gl.POINTS,0,2e6)}),gl.bindFramebuffer(gl.FRAMEBUFFER,null),gl.clear(gl.COLOR_BUFFER_BIT),gl.enable(gl.BLEND),gl.blendFunc(gl.ONE,gl.ONE),framebuffers.forEach(({texture:e})=>{gl.bindTexture(gl.TEXTURE_2D,e),gl.drawArrays(gl.POINTS,0,2e6)}),requestAnimationFrame(render)}gl.clearColor(0,0,0,1),render();};
