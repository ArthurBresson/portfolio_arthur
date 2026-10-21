/* eslint-disable react/prop-types -- React 19 n'exploite plus les propTypes */
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  MathUtils,
  PlaneGeometry,
  Points,
  ShaderMaterial,
} from "three";

// Renderer desktop (chargé en lazy) : Three.js via R3F, en frameloop
// « never » — c'est le moteur partagé qui déclenche chaque rendu, dans la
// même frame que la mise à jour des bulles DOM (aucun décalage).
//
// La caméra perspective est calée pour que le plan z = 0 corresponde
// exactement aux pixels CSS du viewport (y inversé) : liaisons et halos y
// sont alignés sur les bulles ; les particules, en profondeur, donnent la
// parallax 3D. Trois draw calls : particules, liaisons, halos/impulsions.

const MAX_BEAMS = 64;
const MAX_GLOWS = 160;
const PARTICLES = 700;
const FOV = 40;

const BEAM_VERTEX = /* glsl */ `
  attribute vec3 aColorA;
  attribute vec3 aColorB;
  attribute float aAlpha;
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vUv = uv;
    vColor = mix(aColorA, aColorB, uv.x);
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

const BEAM_FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = abs(vUv.y - 0.5) * 2.0;
    float glow = pow(1.0 - d, 3.0) * 0.5;
    float core = smoothstep(0.3, 0.0, d);
    float ends = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
    gl_FragColor = vec4(vColor, (glow + core) * vAlpha * ends);
  }
`;

const GLOW_VERTEX = /* glsl */ `
  attribute vec3 aColor;
  attribute float aAlpha;
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vUv = uv;
    vColor = aColor;
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

const GLOW_FRAGMENT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = exp(-d * d * 6.0) * 0.8 + smoothstep(0.22, 0.0, d) * 0.6;
    a *= 1.0 - smoothstep(0.8, 1.0, d);
    gl_FragColor = vec4(mix(vColor, vec3(1.0), smoothstep(0.2, 0.0, d) * 0.6), a * vAlpha);
  }
`;

const PARTICLE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uDistance;
  uniform float uFade;
  attribute float aSeed;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.15 + aSeed * 6.2831) * 0.012;
    p.y += cos(uTime * 0.12 + aSeed * 12.566) * 0.012;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * (0.5 + aSeed) * (uDistance / -mv.z);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vAlpha = uFade * (0.25 + 0.6 * fract(aSeed * 7.31)) * (0.6 + 0.4 * sin(uTime * 0.8 + aSeed * 40.0));
  }
`;

const PARTICLE_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }
`;

function additiveMaterial(vertexShader, fragmentShader, uniforms = {}) {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}

function createInstanced(capacity, material, attributes) {
  const geometry = new PlaneGeometry(1, 1);
  const buffers = {};
  for (const [name, size] of Object.entries(attributes)) {
    const attribute = new InstancedBufferAttribute(
      new Float32Array(capacity * size),
      size,
    );
    attribute.setUsage(DynamicDrawUsage);
    geometry.setAttribute(name, attribute);
    buffers[name] = attribute;
  }
  const mesh = new InstancedMesh(geometry, material, capacity);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  mesh.frustumCulled = false;
  mesh.count = 0;
  return { mesh, buffers };
}

// Matrice 2D (rotation + échelle + translation) écrite directement dans le buffer.
function writeMatrix(array, index, x, y, angle, scaleX, scaleY) {
  const offset = index * 16;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  array[offset] = cos * scaleX;
  array[offset + 1] = sin * scaleX;
  array[offset + 2] = 0;
  array[offset + 3] = 0;
  array[offset + 4] = -sin * scaleY;
  array[offset + 5] = cos * scaleY;
  array[offset + 6] = 0;
  array[offset + 7] = 0;
  array[offset + 8] = 0;
  array[offset + 9] = 0;
  array[offset + 10] = 1;
  array[offset + 11] = 0;
  array[offset + 12] = x;
  array[offset + 13] = y;
  array[offset + 14] = 0;
  array[offset + 15] = 1;
}

function createParticles(colors) {
  const positions = new Float32Array(PARTICLES * 3);
  const seeds = new Float32Array(PARTICLES);
  const tints = new Float32Array(PARTICLES * 3);
  for (let index = 0; index < PARTICLES; index += 1) {
    positions[index * 3] = Math.random() - 0.5;
    positions[index * 3 + 1] = Math.random() - 0.5;
    positions[index * 3 + 2] = -900 + Math.random() * 1150;
    seeds[index] = Math.random();
    const color =
      index % 3 === 0 ? [0.9, 0.93, 1] : colors[index % colors.length];
    tints.set(color, index * 3);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));
  geometry.setAttribute("aColor", new BufferAttribute(tints, 3));
  const material = additiveMaterial(PARTICLE_VERTEX, PARTICLE_FRAGMENT, {
    uTime: { value: 0 },
    uSize: { value: 3 },
    uDistance: { value: 1000 },
    uFade: { value: 1 },
  });
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  return points;
}

function createScene(colors) {
  const root = new Group();
  const particles = createParticles(colors);
  const beams = createInstanced(
    MAX_BEAMS,
    additiveMaterial(BEAM_VERTEX, BEAM_FRAGMENT),
    { aColorA: 3, aColorB: 3, aAlpha: 1 },
  );
  const glows = createInstanced(
    MAX_GLOWS,
    additiveMaterial(GLOW_VERTEX, GLOW_FRAGMENT),
    { aColor: 3, aAlpha: 1 },
  );
  particles.renderOrder = 0;
  beams.mesh.renderOrder = 1;
  glows.mesh.renderOrder = 2;
  root.add(particles, beams.mesh, glows.mesh);

  let width = 0;
  let height = 0;

  function syncCamera(camera, w, h) {
    width = w;
    height = h;
    const distance = h / 2 / Math.tan(MathUtils.degToRad(FOV / 2));
    camera.manual = true;
    camera.fov = FOV;
    camera.aspect = w / h;
    camera.near = 1;
    camera.far = distance + 2500;
    camera.position.set(w / 2, -h / 2, distance);
    camera.rotation.set(0, 0, 0);
    camera.updateProjectionMatrix();
    particles.position.set(w / 2, -h / 2, 0);
    particles.scale.set(w * 1.3, h * 1.3, 1);
    particles.material.uniforms.uDistance.value = distance;
  }

  function updateBeams(model) {
    const { aColorA, aColorB, aAlpha } = beams.buffers;
    const matrices = beams.mesh.instanceMatrix.array;
    let used = 0;
    for (const link of model.links) {
      if (link.intensity < 0.005 || used >= MAX_BEAMS) continue;
      const dx = link.bx - link.ax;
      const dy = -(link.by - link.ay);
      const length = Math.hypot(dx, dy);
      if (length < 1) continue;
      writeMatrix(
        matrices,
        used,
        (link.ax + link.bx) / 2,
        -(link.ay + link.by) / 2,
        Math.atan2(dy, dx),
        length,
        10 + link.energy * 8,
      );
      aColorA.array.set(link.colorA, used * 3);
      aColorB.array.set(link.colorB, used * 3);
      aAlpha.array[used] = link.intensity;
      used += 1;
    }
    beams.mesh.count = used;
    beams.mesh.instanceMatrix.needsUpdate = true;
    aColorA.needsUpdate = true;
    aColorB.needsUpdate = true;
    aAlpha.needsUpdate = true;
  }

  function updateGlows(model) {
    const { aColor, aAlpha } = glows.buffers;
    const matrices = glows.mesh.instanceMatrix.array;
    const used = Math.min(model.glowCount, MAX_GLOWS);
    for (let index = 0; index < used; index += 1) {
      const glow = model.glows[index];
      writeMatrix(matrices, index, glow.x, -glow.y, 0, glow.size, glow.size);
      aColor.array.set(glow.color, index * 3);
      aAlpha.array[index] = Math.min(1, glow.alpha);
    }
    glows.mesh.count = used;
    glows.mesh.instanceMatrix.needsUpdate = true;
    aColor.needsUpdate = true;
    aAlpha.needsUpdate = true;
  }

  return {
    root,

    update(model, state) {
      const { w, h } = model.viewport;
      if (w !== width || h !== height) syncCamera(state.camera, w, h);

      const fade = Math.pow(1 - model.eased, 1.5);
      particles.visible = fade > 0.01;
      if (particles.visible) {
        const uniforms = particles.material.uniforms;
        uniforms.uTime.value = model.time;
        uniforms.uFade.value = fade;
        uniforms.uSize.value = 3.2 * state.gl.getPixelRatio();
        // Légère rotation du champ de particules avec la souris.
        particles.rotation.y = model.pointer.x * 0.12;
        particles.rotation.x = model.pointer.y * 0.08;
      }
      updateBeams(model);
      updateGlows(model);
    },

    dispose() {
      for (const object of [particles, beams.mesh, glows.mesh]) {
        object.geometry.dispose();
        object.material.dispose();
      }
    },
  };
}

function NetworkScene({ engine }) {
  const get = useThree((state) => state.get);
  const [scene] = useState(() => createScene(engine.model.colors));

  useEffect(() => {
    const unsubscribe = engine.addRenderer((model) => {
      const state = get();
      scene.update(model, state);
      state.gl.render(state.scene, state.camera);
    });
    return () => {
      unsubscribe();
      scene.dispose();
    };
  }, [engine, get, scene]);

  // eslint-disable-next-line react/no-unknown-property -- prop R3F
  return <primitive object={scene.root} />;
}

export default function ThreeNetwork({ engine }) {
  return (
    <div className="ab-net" aria-hidden="true">
      <Canvas
        frameloop="never"
        dpr={[1, 1.5]}
        flat
        linear
        gl={{
          antialias: false,
          alpha: true,
          depth: false,
          stencil: false,
          powerPreference: "high-performance",
        }}
        camera={{ fov: FOV, near: 1, far: 5000, position: [0, 0, 1000] }}
        style={{ pointerEvents: "none" }}
      >
        <NetworkScene engine={engine} />
      </Canvas>
    </div>
  );
}
