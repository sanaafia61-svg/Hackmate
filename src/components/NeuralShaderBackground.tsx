import React, { useEffect, useRef } from 'react';

interface NeuralShaderBackgroundProps {
  className?: string;
  opacity?: number;
}

export const NeuralShaderBackground: React.FC<NeuralShaderBackgroundProps> = ({
  className = 'absolute inset-0 w-full h-full pointer-events-none opacity-40',
  opacity = 0.4
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
    });
    resizeObserver.observe(canvas);
    syncSize();

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    
    float t = u_time * 0.12;
    
    float lineEffect = 0.0;
    
    for (float i = 1.0; i <= 4.0; i += 1.0) {
        float wave = sin(p.x * (2.2 * i) + t * (1.2 * i) + sin(p.y * 3.0 + t * 0.5) * 1.5) * 0.18;
        float dist = abs(p.y - wave + 0.15 * sin(p.x * 1.8 - t * 0.8));
        lineEffect += 0.0035 / (dist + 0.035);
    }
    
    vec2 gridUV = abs(fract(p * 6.0 - vec2(0.0, t * 0.3)) - 0.5);
    float grid = smoothstep(0.48, 0.5, max(gridUV.x, gridUV.y)) * 0.04;
    
    vec2 nCoord = p * 12.0;
    vec2 nId = floor(nCoord);
    float nRand = hash(nId);
    float nodeAlpha = 0.0;
    if (nRand > 0.88) {
        vec2 nodePos = nId + 0.5 + 0.3 * vec2(sin(t + nRand * 6.28), cos(t * 0.8 + nRand * 6.28));
        float dNode = length(nCoord - nodePos);
        nodeAlpha = smoothstep(0.25, 0.01, dNode) * (0.3 + 0.7 * sin(t * 2.0 + nRand * 10.0));
    }
    
    float vig = 1.0 - smoothstep(0.3, 0.95, length(uv - 0.5));
    float lum = (lineEffect * 0.22 + grid * 0.15 + nodeAlpha * 0.4) * vig;
    vec3 col = vec3(lum * 0.85, lum * 0.88, lum * 0.95);
    
    gl_FragColor = vec4(col, 1.0);
}`;

    function createShader(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const vShader = createShader(gl.VERTEX_SHADER, vs);
    const fShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vShader || !fShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = (t: number) => {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (gl) {
        gl.deleteProgram(prog);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        gl.deleteBuffer(buf);
      }
    };
  }, []);

  return (
    <div className={className} style={{ opacity }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: 'block' }}
      />
    </div>
  );
};
