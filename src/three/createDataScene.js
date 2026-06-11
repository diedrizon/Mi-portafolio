import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  PlaneGeometry,
  ExtrudeGeometry,
  EdgesGeometry,
  Shape,
  Path,
  ShaderMaterial,
  MeshBasicMaterial,
  LineBasicMaterial,
  LineSegments,
  LineLoop,
  Mesh,
  Group,
  BufferGeometry,
  BufferAttribute,
  Points,
  Color,
  AdditiveBlending,
  MathUtils,
} from 'three';

/* ------------------------------------------------------------------
 * "Superficie de datos": un plano desplazado por ruido simplex en el
 * vertex shader (cero CPU por frame) con rejilla de papel milimetrado
 * antialiasada en el fragment, más un campo de partículas ámbar.
 * Todo el movimiento vive en la GPU vía un único uniform de tiempo.
 * ------------------------------------------------------------------ */

/* Ruido simplex 3D (Ashima Arts / Stefan Gustavson, MIT) */
const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const TERRAIN_VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying vec3 vWorld;
varying float vElev;
${SIMPLEX}
float fbm(vec3 p){
  float v = 0.0;
  v += 0.62 * snoise(p);
  v += 0.27 * snoise(p * 2.1 + 11.3);
  v += 0.11 * snoise(p * 4.3 + 31.7);
  return v;
}
void main(){
  vec3 pos = position;
  float t = uTime * 0.085;
  float e = fbm(vec3(pos.x * 0.21, pos.y * 0.21, t));
  /* canal lateral despejado hacia el horizonte */
  float canyon = smoothstep(0.0, 3.4, abs(pos.x));
  e *= mix(0.34, 1.0, canyon);
  pos.z += e * uAmp;
  vElev = e;
  vec4 world = modelMatrix * vec4(pos, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const TERRAIN_FRAG = /* glsl */ `
uniform vec3 uInk;
uniform vec3 uBg;
uniform vec3 uPaper;
uniform vec3 uAmber;
uniform float uGridGain;
varying vec3 vWorld;
varying float vElev;

float gridLine(vec2 p, float scale){
  vec2 g = abs(fract(p * scale - 0.5) - 0.5) / fwidth(p * scale);
  return 1.0 - min(min(g.x, g.y), 1.0);
}
void main(){
  /* base: tinta que respira ámbar en las crestas */
  vec3 col = uInk;
  float peaks = smoothstep(0.18, 0.95, vElev);
  col = mix(col, uAmber * 0.55, peaks * 0.30);

  /* papel milimetrado: línea fina + línea mayor */
  float minor = gridLine(vWorld.xz, 2.0);
  float major = gridLine(vWorld.xz, 0.4);
  col = mix(col, uPaper, minor * 0.085 * uGridGain);
  col = mix(col, uAmber, major * (0.16 + peaks * 0.22) * uGridGain);

  /* niebla manual hacia el color de fondo de la página */
  float d = distance(vWorld, cameraPosition);
  float fog = smoothstep(3.0, 10.5, d);
  col = mix(col, uBg, fog);

  gl_FragColor = vec4(col, 1.0);
}
`;

const DUST_VERT = /* glsl */ `
uniform float uTime;
uniform float uPx;
attribute float aSeed;
attribute float aSize;
varying float vTw;
void main(){
  vec3 pos = position;
  /* deriva ascendente con envoltura + vaivén lateral por semilla */
  pos.y = mod(pos.y + uTime * (0.06 + aSeed * 0.05), 3.4);
  pos.x += sin(uTime * 0.35 + aSeed * 6.2831) * 0.18;
  vTw = 0.55 + 0.45 * sin(uTime * (1.2 + aSeed) + aSeed * 40.0);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float dist = max(-mv.z, 0.4);
  /* aSize = px deseados a 5 unidades de distancia; uPx = dpr * 5 */
  gl_PointSize = clamp(aSize * uPx / dist, 1.0, uPx * 6.5);
  gl_Position = projectionMatrix * mv;
}
`;

const DUST_FRAG = /* glsl */ `
uniform vec3 uAmber;
varying float vTw;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.08, d) * vTw;
  gl_FragColor = vec4(uAmber, a * 0.85);
}
`;

const SPIKE_VERT = /* glsl */ `
uniform float uGrow;
attribute float aH;
attribute float aOff;
attribute float aTip;
varying float vT;
varying float vG;
void main(){
  float g = smoothstep(0.0, 1.0, clamp(uGrow * 1.6 - aOff, 0.0, 1.0));
  vec3 pos = position;
  pos.y = aTip * aH * g;
  vT = aTip;
  vG = g;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const SPIKE_FRAG = /* glsl */ `
uniform vec3 uAmber;
varying float vT;
varying float vG;
void main(){
  if (vG < 0.01) discard;
  vec3 col = mix(uAmber * 0.8, vec3(1.0, 0.84, 0.47), vT);
  float a = vG * (0.1 + 0.9 * vT * vT);
  gl_FragColor = vec4(col, a);
}
`;

const TIP_VERT = /* glsl */ `
uniform float uGrow;
uniform float uTime;
uniform float uPx;
attribute float aH;
attribute float aOff;
attribute float aSeed;
varying float vA;
void main(){
  float g = smoothstep(0.0, 1.0, clamp(uGrow * 1.6 - aOff, 0.0, 1.0));
  vec3 pos = position;
  pos.y = aH * g;
  float tw = 0.65 + 0.35 * sin(uTime * 1.8 + aSeed * 40.0);
  vA = g * tw;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float dist = max(-mv.z, 0.4);
  gl_PointSize = clamp((3.2 + aSeed * 2.4) * uPx / dist, 1.0, uPx * 7.0);
  gl_Position = projectionMatrix * mv;
}
`;

const TIP_FRAG = /* glsl */ `
uniform vec3 uAmber;
varying float vA;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.08, length(c)) * vA;
  if (a < 0.01) discard;
  gl_FragColor = vec4(mix(uAmber, vec3(1.0, 0.88, 0.6), 0.4), a);
}
`;

const ORBIT_VERT = /* glsl */ `
uniform float uTime;
uniform float uPx;
attribute float aSeed;
attribute float aSize;
varying float vTw;
void main(){
  float a = uTime * (0.22 + aSeed * 0.1) + aSeed * 6.2831;
  vec3 pos = position;
  float r = length(pos.xz);
  pos.x = cos(a) * r;
  pos.z = sin(a) * r;
  vTw = 0.5 + 0.5 * sin(uTime * 1.6 + aSeed * 40.0);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float dist = max(-mv.z, 0.4);
  gl_PointSize = clamp(aSize * uPx / dist, 1.0, uPx * 6.0);
  gl_Position = projectionMatrix * mv;
}
`;

const ORBIT_FRAG = /* glsl */ `
uniform vec3 uAmber;
uniform float uFade;
varying float vTw;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.1, length(c)) * vTw * uFade;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uAmber, a * 0.9);
}
`;

/* Letras D y F como polígonos ortogonales (extruidas) */
function letterD() {
  const sh = new Shape();
  sh.moveTo(0, 0);
  sh.lineTo(0.62, 0);
  sh.lineTo(1.0, 0.38);
  sh.lineTo(1.0, 1.22);
  sh.lineTo(0.62, 1.6);
  sh.lineTo(0, 1.6);
  sh.closePath();
  const hole = new Path();
  hole.moveTo(0.32, 0.32);
  hole.lineTo(0.32, 1.28);
  hole.lineTo(0.5, 1.28);
  hole.lineTo(0.68, 1.1);
  hole.lineTo(0.68, 0.5);
  hole.lineTo(0.5, 0.32);
  hole.closePath();
  sh.holes.push(hole);
  return sh;
}

function letterF() {
  const sh = new Shape();
  sh.moveTo(0, 0);
  sh.lineTo(0.34, 0);
  sh.lineTo(0.34, 0.62);
  sh.lineTo(0.88, 0.62);
  sh.lineTo(0.88, 0.96);
  sh.lineTo(0.34, 0.96);
  sh.lineTo(0.34, 1.26);
  sh.lineTo(1.0, 1.26);
  sh.lineTo(1.0, 1.6);
  sh.lineTo(0, 1.6);
  sh.closePath();
  return sh;
}

const easeP = (p) => p * p * (3 - 2 * p);

export function createDataScene(canvas) {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  const bg = new Color('#0a0d12');
  renderer.setClearColor(bg, 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 40);

  /* --- calidad por dispositivo --- */
  const small = window.innerWidth < 760;
  const SEG = small ? 96 : 150;
  const DUST = small ? 150 : 320;
  const maxDpr = small ? 1.5 : 1.75;

  /* --- terreno --- */
  const terrainUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.55 },
    uGridGain: { value: 1 },
    uInk: { value: new Color('#10141d') },
    uBg: { value: bg },
    uPaper: { value: new Color('#ede8dd') },
    uAmber: { value: new Color('#f5a623') },
  };
  const terrain = new Mesh(
    new PlaneGeometry(18, 18, SEG, SEG),
    new ShaderMaterial({
      vertexShader: TERRAIN_VERT,
      fragmentShader: TERRAIN_FRAG,
      uniforms: terrainUniforms,
    })
  );
  terrain.rotation.x = -Math.PI / 2;
  scene.add(terrain);

  /* --- polvo de datos --- */
  const dustGeo = new BufferGeometry();
  const pos = new Float32Array(DUST * 3);
  const seed = new Float32Array(DUST);
  const size = new Float32Array(DUST);
  for (let i = 0; i < DUST; i += 1) {
    pos[i * 3] = (Math.random() - 0.5) * 11;
    pos[i * 3 + 1] = Math.random() * 3.4;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 11;
    seed[i] = Math.random();
    size[i] = 1.6 + Math.random() * 3.6;
  }
  dustGeo.setAttribute('position', new BufferAttribute(pos, 3));
  dustGeo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  dustGeo.setAttribute('aSize', new BufferAttribute(size, 1));
  const dustUniforms = {
    uTime: { value: 0 },
    uPx: { value: 1 },
    uAmber: { value: new Color('#f5a623') },
  };
  const dust = new Points(
    dustGeo,
    new ShaderMaterial({
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      uniforms: dustUniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
  scene.add(dust);

  const amberCol = new Color('#f5a623');
  const fillMat = new MeshBasicMaterial({ color: new Color('#121826') });

  /* --- pilares de luz (fase perfil): skyline de datos --- */
  const SPIKE_DEF = [
    /* los 4 KPI al centro */
    { x: -1.5, z: -2.6, h: 1.5, off: 0.0 },
    { x: -0.5, z: -2.7, h: 2.3, off: 0.12 },
    { x: 0.5, z: -2.6, h: 1.5, off: 0.24 },
    { x: 1.5, z: -2.7, h: 1.1, off: 0.36 },
    /* ambiente */
    { x: -3.2, z: -3.6, h: 0.7, off: 0.18 },
    { x: -2.4, z: -4.4, h: 0.5, off: 0.3 },
    { x: -1.1, z: -4.9, h: 0.85, off: 0.42 },
    { x: 0.2, z: -4.2, h: 0.45, off: 0.06 },
    { x: 1.2, z: -4.8, h: 0.65, off: 0.34 },
    { x: 2.3, z: -4.1, h: 0.9, off: 0.2 },
    { x: 3.3, z: -3.5, h: 0.55, off: 0.44 },
    { x: -3.6, z: -2.2, h: 0.4, off: 0.4 },
    { x: 3.6, z: -2.3, h: 0.42, off: 0.26 },
    { x: -2.2, z: -1.9, h: 0.6, off: 0.1 },
    { x: 2.1, z: -2.0, h: 0.62, off: 0.32 },
    { x: 0.0, z: -5.4, h: 1.0, off: 0.48 },
  ];
  const NS = SPIKE_DEF.length;
  const sPos = new Float32Array(NS * 2 * 3);
  const sH = new Float32Array(NS * 2);
  const sOff = new Float32Array(NS * 2);
  const sTip = new Float32Array(NS * 2);
  const tPos = new Float32Array(NS * 3);
  const tH = new Float32Array(NS);
  const tOff = new Float32Array(NS);
  const tSeed = new Float32Array(NS);
  SPIKE_DEF.forEach((d, i) => {
    for (let k = 0; k < 2; k += 1) {
      const v = i * 2 + k;
      sPos[v * 3] = d.x;
      sPos[v * 3 + 1] = 0;
      sPos[v * 3 + 2] = d.z;
      sH[v] = d.h;
      sOff[v] = d.off;
      sTip[v] = k;
    }
    tPos[i * 3] = d.x;
    tPos[i * 3 + 1] = 0;
    tPos[i * 3 + 2] = d.z;
    tH[i] = d.h;
    tOff[i] = d.off;
    tSeed[i] = (i * 0.618) % 1;
  });
  const spikeGeo = new BufferGeometry();
  spikeGeo.setAttribute('position', new BufferAttribute(sPos, 3));
  spikeGeo.setAttribute('aH', new BufferAttribute(sH, 1));
  spikeGeo.setAttribute('aOff', new BufferAttribute(sOff, 1));
  spikeGeo.setAttribute('aTip', new BufferAttribute(sTip, 1));
  const spikeUniforms = { uGrow: { value: 0 }, uAmber: { value: new Color('#f5a623') } };
  const spikes = new LineSegments(
    spikeGeo,
    new ShaderMaterial({
      vertexShader: SPIKE_VERT,
      fragmentShader: SPIKE_FRAG,
      uniforms: spikeUniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
  spikes.position.y = -0.05;
  spikes.frustumCulled = false; // la altura vive en el shader
  spikes.visible = false;
  scene.add(spikes);

  const tipGeo = new BufferGeometry();
  tipGeo.setAttribute('position', new BufferAttribute(tPos, 3));
  tipGeo.setAttribute('aH', new BufferAttribute(tH, 1));
  tipGeo.setAttribute('aOff', new BufferAttribute(tOff, 1));
  tipGeo.setAttribute('aSeed', new BufferAttribute(tSeed, 1));
  const tipUniforms = {
    uGrow: { value: 0 },
    uTime: { value: 0 },
    uPx: { value: 1 },
    uAmber: { value: new Color('#f5a623') },
  };
  const tips = new Points(
    tipGeo,
    new ShaderMaterial({
      vertexShader: TIP_VERT,
      fragmentShader: TIP_FRAG,
      uniforms: tipUniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
  tips.position.y = -0.05;
  tips.frustumCulled = false;
  tips.visible = false;
  scene.add(tips);

  /* --- dial de instrumento (fase proyectos): radar profundo y sutil --- */
  const dial = new Group();
  dial.position.set(0, 2.25, -9);
  dial.rotation.x = -0.42;

  const ringMats = [];
  const makeRing = (radius, opacity) => {
    const pts = new Float32Array(96 * 3);
    for (let i = 0; i < 96; i += 1) {
      const a = (i / 96) * Math.PI * 2;
      pts[i * 3] = Math.cos(a) * radius;
      pts[i * 3 + 1] = Math.sin(a) * radius;
      pts[i * 3 + 2] = 0;
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(pts, 3));
    const m = new LineBasicMaterial({
      color: new Color('#f5a623'),
      transparent: true,
      opacity: 0,
    });
    m.userData.max = opacity;
    ringMats.push(m);
    const loop = new LineLoop(g, m);
    dial.add(loop);
    return g;
  };
  const ringGeos = [makeRing(1.15, 0.3), makeRing(1.85, 0.24), makeRing(2.6, 0.18)];

  /* marcas radiales sobre el anillo exterior */
  const TICKS = 36;
  const tkPos = new Float32Array(TICKS * 2 * 3);
  for (let i = 0; i < TICKS; i += 1) {
    const a = (i / TICKS) * Math.PI * 2;
    const r0 = 2.6;
    const r1 = i % 6 === 0 ? 2.92 : 2.76;
    tkPos[i * 6] = Math.cos(a) * r0;
    tkPos[i * 6 + 1] = Math.sin(a) * r0;
    tkPos[i * 6 + 2] = 0;
    tkPos[i * 6 + 3] = Math.cos(a) * r1;
    tkPos[i * 6 + 4] = Math.sin(a) * r1;
    tkPos[i * 6 + 5] = 0;
  }
  const tickGeo = new BufferGeometry();
  tickGeo.setAttribute('position', new BufferAttribute(tkPos, 3));
  const tickMat = new LineBasicMaterial({
    color: new Color('#f5a623'),
    transparent: true,
    opacity: 0,
  });
  tickMat.userData.max = 0.34;
  ringMats.push(tickMat);
  const ticks = new LineSegments(tickGeo, tickMat);
  dial.add(ticks);

  dial.visible = false;
  scene.add(dial);

  /* --- final: DF extruido + anillo de partículas --- */
  const finale = new Group();
  finale.position.set(0, 2.1, -14.6);
  const extrudeOpts = { depth: 0.3, bevelEnabled: false };
  const dGeo = new ExtrudeGeometry(letterD(), extrudeOpts);
  const fGeo = new ExtrudeGeometry(letterF(), extrudeOpts);
  const makeLetter = (geo, x) => {
    const g = new Group();
    g.add(new Mesh(geo, fillMat));
    g.add(
      new LineSegments(
        new EdgesGeometry(geo, 12),
        new LineBasicMaterial({ color: amberCol, transparent: true, opacity: 0.95 })
      )
    );
    /* centrar la letra en su propio eje para rotarla limpia */
    g.children.forEach((c) => c.position.set(-0.5, -0.8, -0.15));
    g.position.x = x;
    finale.add(g);
    return g;
  };
  const letterDG = makeLetter(dGeo, -0.62);
  const letterFG = makeLetter(fGeo, 0.62);

  const ORBIT_N = small ? 50 : 90;
  const oPos = new Float32Array(ORBIT_N * 3);
  const oSeed = new Float32Array(ORBIT_N);
  const oSize = new Float32Array(ORBIT_N);
  for (let i = 0; i < ORBIT_N; i += 1) {
    const r = 1.75 + Math.random() * 0.55;
    const a = Math.random() * Math.PI * 2;
    oPos[i * 3] = Math.cos(a) * r;
    oPos[i * 3 + 1] = (Math.random() - 0.5) * 0.9;
    oPos[i * 3 + 2] = Math.sin(a) * r;
    oSeed[i] = Math.random();
    oSize[i] = 1.4 + Math.random() * 2.6;
  }
  const orbitGeo = new BufferGeometry();
  orbitGeo.setAttribute('position', new BufferAttribute(oPos, 3));
  orbitGeo.setAttribute('aSeed', new BufferAttribute(oSeed, 1));
  orbitGeo.setAttribute('aSize', new BufferAttribute(oSize, 1));
  const orbitUniforms = {
    uTime: { value: 0 },
    uPx: { value: 1 },
    uFade: { value: 0 },
    uAmber: { value: amberCol },
  };
  const orbit = new Points(
    orbitGeo,
    new ShaderMaterial({
      vertexShader: ORBIT_VERT,
      fragmentShader: ORBIT_FRAG,
      uniforms: orbitUniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
  finale.add(orbit);
  finale.visible = false;
  scene.add(finale);

  /* --- estado de cámara: viaje por fases --- */
  /* Estaciones del viaje: hero → torres → constelación → DF */
  const STATIONS = [
    { px: 0, py: 2.3, pz: 6.4, lx: 0, ly: 0.55, lz: 0 },      // S0 reposo
    { px: 0, py: 0.72, pz: 2.3, lx: 0, ly: 1.35, lz: -1 },    // S1 inmersión
    { px: 0, py: 1.6, pz: -0.4, lx: 0, ly: 1.5, lz: -4.5 },   // S2 sobre torres
    { px: 0, py: 2.1, pz: -5.6, lx: 0, ly: 2.25, lz: -9 },    // S3 constelación
    { px: 0, py: 2.1, pz: -11.3, lx: 0, ly: 2.1, lz: -14.6 }, // S4 frente al DF
  ];
  const phase = { hero: 0, stats: 0, nodes: 0, finale: 0 };
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };

  function applyCamera() {
    const total =
      easeP(phase.hero) + easeP(phase.stats) + easeP(phase.nodes) + easeP(phase.finale);
    const seg = Math.min(Math.floor(total), 3);
    const f = easeP(MathUtils.clamp(total - seg, 0, 1));
    const A = STATIONS[seg];
    const B = STATIONS[seg + 1];
    const par = 1 - phase.finale * 0.5; // menos parallax cerca del DF
    camera.position.x = MathUtils.lerp(A.px, B.px, f) + pointer.cx * 0.34 * par;
    camera.position.y = MathUtils.lerp(A.py, B.py, f) + pointer.cy * 0.16 * par;
    camera.position.z = MathUtils.lerp(A.pz, B.pz, f);
    camera.lookAt(
      MathUtils.lerp(A.lx, B.lx, f) + pointer.cx * 0.55 * par,
      MathUtils.lerp(A.ly, B.ly, f) + pointer.cy * 0.2 * par,
      MathUtils.lerp(A.lz, B.lz, f)
    );
    terrainUniforms.uAmp.value = MathUtils.lerp(0.55, 0.95, easeP(phase.hero));
    terrainUniforms.uGridGain.value = MathUtils.lerp(1, 1.6, easeP(phase.hero));
  }

  /* Estados por fase (crecimiento, dibujado, ensamblado) */
  function applyPhases(t) {
    const sp = phase.stats;
    const spikesOn = sp > 0.001;
    spikes.visible = spikesOn;
    tips.visible = spikesOn;
    if (spikesOn) {
      const g = easeP(sp);
      spikeUniforms.uGrow.value = g;
      tipUniforms.uGrow.value = g;
      tipUniforms.uTime.value = t;
    }

    const np = phase.nodes;
    dial.visible = np > 0.001;
    if (dial.visible) {
      const e = easeP(np);
      ringMats.forEach((m) => {
        m.opacity = m.userData.max * e;
      });
      dial.rotation.z = t * 0.045 + e * 0.25;
      ticks.rotation.z = -t * 0.075;
      dial.scale.setScalar(0.85 + 0.15 * e);
    }

    const fp = phase.finale;
    finale.visible = fp > 0.001;
    if (finale.visible) {
      const e = easeP(fp);
      finale.scale.setScalar(0.25 + 0.75 * e);
      finale.rotation.y = t * 0.28 + (1 - e) * 1.4 + pointer.cx * 0.25;
      finale.position.y = 2.1 + Math.sin(t * 0.6) * 0.07;
      letterDG.rotation.y = (1 - e) * 1.5;
      letterFG.rotation.y = -(1 - e) * 1.5;
      orbitUniforms.uFade.value = e;
      orbitUniforms.uTime.value = t;
    }
  }

  /* --- bucle --- */
  let running = false;
  let rafId = 0;
  let t0 = performance.now();
  let elapsed = 0;

  function frame(now) {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    const dt = Math.min((now - t0) / 1000, 0.05);
    t0 = now;
    elapsed += dt;
    pointer.cx += (pointer.x - pointer.cx) * Math.min(dt * 4.5, 1);
    pointer.cy += (pointer.y - pointer.cy) * Math.min(dt * 4.5, 1);
    terrainUniforms.uTime.value = elapsed;
    dustUniforms.uTime.value = elapsed;
    applyPhases(elapsed);
    applyCamera();
    renderer.render(scene, camera);
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dustUniforms.uPx.value = dpr * 5.0;
    orbitUniforms.uPx.value = dpr * 5.0;
    tipUniforms.uPx.value = dpr * 5.0;
  }

  resize();
  applyCamera();
  renderer.render(scene, camera); // primer frame inmediato (preloader)

  return {
    start() {
      if (running) return;
      running = true;
      t0 = performance.now();
      rafId = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(rafId);
    },
    resize,
    setPhase(name, p) {
      phase[name] = MathUtils.clamp(p, 0, 1);
      if (!running) {
        applyPhases(elapsed);
        applyCamera();
        renderer.render(scene, camera);
      }
    },
    setPointer(nx, ny) {
      pointer.x = nx;
      pointer.y = ny;
    },
    dispose() {
      this.stop();
      terrain.geometry.dispose();
      terrain.material.dispose();
      dustGeo.dispose();
      dust.material.dispose();
      spikeGeo.dispose();
      tipGeo.dispose();
      ringGeos.forEach((g) => g.dispose());
      tickGeo.dispose();
      dGeo.dispose();
      fGeo.dispose();
      orbitGeo.dispose();
      scene.traverse((o) => {
        if (o.material && o.material.dispose) o.material.dispose();
        if (o.geometry && o.geometry.dispose) o.geometry.dispose();
      });
      renderer.dispose();
    },
  };
}
