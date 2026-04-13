"use client";

import { useEffect, useRef } from "react";

type LineWavesProps = {
  brightness?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  colorCycleSpeed?: number;
  edgeFadeWidth?: number;
  enableMouseInteraction?: boolean;
  innerLineCount?: number;
  mouseInfluence?: number;
  outerLineCount?: number;
  rotation?: number;
  speed?: number;
  warpIntensity?: number;
};

function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    Number.parseInt(h.slice(0, 2), 16) / 255,
    Number.parseInt(h.slice(2, 4), 16) / 255,
    Number.parseInt(h.slice(4, 6), 16) / 255,
  ];
}

const VERTEX_SHADER = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform float uSpeed;
uniform float uInnerLines;
uniform float uOuterLines;
uniform float uWarpIntensity;
uniform float uRotation;
uniform float uEdgeFadeWidth;
uniform float uColorCycleSpeed;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec2 uMouse;
uniform float uMouseInfluence;
uniform bool uEnableMouse;

#define HALF_PI 1.5707963

float hashF(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

float smoothNoise(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hashF(i), hashF(i + 1.0), u);
}

float displaceA(float coord, float t) {
  float result = sin(coord * 2.123) * 0.2;
  result += sin(coord * 3.234 + t * 4.345) * 0.1;
  result += sin(coord * 0.589 + t * 0.934) * 0.5;
  return result;
}

float displaceB(float coord, float t) {
  float result = sin(coord * 1.345) * 0.3;
  result += sin(coord * 2.734 + t * 3.345) * 0.2;
  result += sin(coord * 0.189 + t * 0.934) * 0.3;
  return result;
}

vec2 rotate2D(vec2 p, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 coords = gl_FragCoord.xy / uResolution.xy;
  coords = coords * 2.0 - 1.0;
  coords = rotate2D(coords, uRotation);

  float halfT = uTime * uSpeed * 0.5;
  float fullT = uTime * uSpeed;

  float mouseWarp = 0.0;
  if (uEnableMouse) {
    vec2 mPos = rotate2D(uMouse * 2.0 - 1.0, uRotation);
    float mDist = length(coords - mPos);
    mouseWarp = uMouseInfluence * exp(-mDist * mDist * 4.0);
  }

  float warpAx = coords.x + displaceA(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpAy = coords.y - displaceA(coords.x * cos(fullT) * 1.235, halfT) * uWarpIntensity;
  float warpBx = coords.x + displaceB(coords.y, halfT) * uWarpIntensity + mouseWarp;
  float warpBy = coords.y - displaceB(coords.x * sin(fullT) * 1.235, halfT) * uWarpIntensity;

  vec2 fieldA = vec2(warpAx, warpAy);
  vec2 fieldB = vec2(warpBx, warpBy);
  vec2 blended = mix(fieldA, fieldB, mix(fieldA, fieldB, 0.5));

  float fadeTop = smoothstep(uEdgeFadeWidth, uEdgeFadeWidth + 0.4, blended.y);
  float fadeBottom = smoothstep(-uEdgeFadeWidth, -(uEdgeFadeWidth + 0.4), blended.y);
  float vMask = 1.0 - max(fadeTop, fadeBottom);

  float tileCount = mix(uOuterLines, uInnerLines, vMask);
  float scaledY = blended.y * tileCount;
  float nY = smoothNoise(abs(scaledY));

  float ridge = pow(
    step(abs(nY - blended.x) * 2.0, HALF_PI) * cos(2.0 * (nY - blended.x)),
    5.0
  );

  float lines = 0.0;
  for (float i = 1.0; i < 3.0; i += 1.0) {
    lines += pow(max(fract(scaledY), fract(-scaledY)), i * 2.0);
  }

  float pattern = vMask * lines;

  float cycleT = fullT * uColorCycleSpeed;
  float rChannel = (pattern + lines * ridge) * (cos(blended.y + cycleT * 0.234) * 0.5 + 1.0);
  float gChannel = (pattern + vMask * ridge) * (sin(blended.x + cycleT * 1.745) * 0.5 + 1.0);
  float bChannel = (pattern + lines * ridge) * (cos(blended.x + cycleT * 0.534) * 0.5 + 1.0);

  vec3 col = (rChannel * uColor1 + gChannel * uColor2 + bChannel * uColor3) * uBrightness;
  float alpha = clamp(length(col), 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
`;

export function LineWaves({
  brightness = 0.2,
  color1 = "#ffffff",
  color2 = "#ffffff",
  color3 = "#ffffff",
  colorCycleSpeed = 1.0,
  edgeFadeWidth = 0.0,
  enableMouseInteraction = true,
  innerLineCount = 32.0,
  mouseInfluence = 2.0,
  outerLineCount = 36.0,
  rotation = -45,
  speed = 0.3,
  warpIntensity = 1.0,
}: LineWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    let cancelled = false;
    let frameId = 0;
    let teardown: (() => void) | undefined;

    import("ogl").then(
      ({ Renderer, Program, Mesh, Triangle }: typeof import("ogl")) => {
        if (cancelled || !containerRef.current) {
          return;
        }

        const renderer = new Renderer({
          alpha: true,
          premultipliedAlpha: false,
        });
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);

        let mx = 0.5;
        let my = 0.5;
        let tx = 0.5;
        let ty = 0.5;

        function handleMouseMove(e: MouseEvent) {
          const rect = (gl.canvas as HTMLCanvasElement).getBoundingClientRect();
          tx = (e.clientX - rect.left) / rect.width;
          ty = 1.0 - (e.clientY - rect.top) / rect.height;
        }

        function handleMouseLeave() {
          tx = 0.5;
          ty = 0.5;
        }

        const rotationRad = (rotation * Math.PI) / 180;

        const program = new Program(gl, {
          vertex: VERTEX_SHADER,
          fragment: FRAGMENT_SHADER,
          uniforms: {
            uTime: { value: 0 },
            uResolution: {
              value: [
                gl.canvas.width,
                gl.canvas.height,
                gl.canvas.width / gl.canvas.height,
              ],
            },
            uSpeed: { value: speed },
            uInnerLines: { value: innerLineCount },
            uOuterLines: { value: outerLineCount },
            uWarpIntensity: { value: warpIntensity },
            uRotation: { value: rotationRad },
            uEdgeFadeWidth: { value: edgeFadeWidth },
            uColorCycleSpeed: { value: colorCycleSpeed },
            uBrightness: { value: brightness },
            uColor1: { value: hexToVec3(color1) },
            uColor2: { value: hexToVec3(color2) },
            uColor3: { value: hexToVec3(color3) },
            uMouse: { value: new Float32Array([0.5, 0.5]) },
            uMouseInfluence: { value: mouseInfluence },
            uEnableMouse: { value: enableMouseInteraction },
          },
        });

        function resize() {
          const el = containerRef.current;
          if (!el) {
            return;
          }
          renderer.setSize(el.offsetWidth, el.offsetHeight);
          program.uniforms.uResolution.value = [
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          ];
        }

        window.addEventListener("resize", resize);
        resize();

        const geometry = new Triangle(gl);
        const mesh = new Mesh(gl, { geometry, program });

        const canvas = gl.canvas as HTMLCanvasElement;
        canvas.style.display = "block";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        containerRef.current?.appendChild(canvas);

        if (enableMouseInteraction) {
          canvas.addEventListener("mousemove", handleMouseMove);
          canvas.addEventListener("mouseleave", handleMouseLeave);
        }

        function update(time: number) {
          frameId = requestAnimationFrame(update);
          program.uniforms.uTime.value = time * 0.001;

          const mv = program.uniforms.uMouse.value as Float32Array;
          if (enableMouseInteraction) {
            mx += 0.05 * (tx - mx);
            my += 0.05 * (ty - my);
            mv.set([mx, my]);
          } else {
            mv.set([0.5, 0.5]);
          }

          renderer.render({ scene: mesh });
        }

        frameId = requestAnimationFrame(update);

        teardown = () => {
          cancelAnimationFrame(frameId);
          window.removeEventListener("resize", resize);
          if (enableMouseInteraction) {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
          }
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
          gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
      }
    );

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [
    brightness,
    color1,
    color2,
    color3,
    colorCycleSpeed,
    edgeFadeWidth,
    enableMouseInteraction,
    innerLineCount,
    mouseInfluence,
    outerLineCount,
    rotation,
    speed,
    warpIntensity,
  ]);

  return <div className="h-full w-full" ref={containerRef} />;
}
