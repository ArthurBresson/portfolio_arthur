/* eslint-disable react/prop-types -- React 19 n'exploite plus les propTypes */
import { useEffect, useRef } from "react";
import { rgbaString } from "./networkEngine.js";

// Renderer léger (mobile / repli) : Canvas 2D plein écran, fixé sous les
// bulles. Il dessine exactement ce que décrit le moteur : liaisons, halos,
// impulsions, plus un champ de particules propre à la hero.

const MAX_DPR = 1.5;

function createParticles(compact) {
  const total = compact ? 70 : 140;
  return Array.from({ length: total }, (_, index) => ({
    x: Math.random(),
    y: Math.random(),
    depth: Math.random(),
    seed: Math.random() * Math.PI * 2,
    tint: index % 3,
  }));
}

function drawParticles(context, model, particles, width, height) {
  const fade = Math.pow(1 - model.eased, 1.5);
  if (fade < 0.01) return;
  const { pointer, time, colors } = model;
  for (const particle of particles) {
    const x =
      particle.x * width +
      Math.sin(time * 0.15 + particle.seed) * 14 +
      pointer.x * particle.depth * 26;
    const y =
      particle.y * height +
      Math.cos(time * 0.12 + particle.seed * 2) * 10 +
      pointer.y * particle.depth * 18;
    const twinkle = 0.6 + 0.4 * Math.sin(time * 0.8 + particle.seed * 7);
    const color =
      particle.tint === 0
        ? [0.9, 0.93, 1]
        : colors[(particle.tint * 2) % colors.length];
    context.fillStyle = rgbaString(
      color,
      fade * (0.15 + particle.depth * 0.45) * twinkle,
    );
    context.beginPath();
    context.arc(x, y, 0.6 + particle.depth * 1.5, 0, Math.PI * 2);
    context.fill();
  }
}

function drawLinks(context, model) {
  context.lineCap = "round";
  for (const link of model.links) {
    const intensity = link.intensity;
    if (intensity < 0.005) continue;
    // Dégradé seulement pour les synapses primaires (navbar) : les ~50
    // liaisons du MLP prennent la couleur moyenne, bien moins coûteux.
    const stroke = (alpha) => {
      if (!link.primary) {
        return rgbaString(
          [
            (link.colorA[0] + link.colorB[0]) / 2,
            (link.colorA[1] + link.colorB[1]) / 2,
            (link.colorA[2] + link.colorB[2]) / 2,
          ],
          alpha,
        );
      }
      const gradient = context.createLinearGradient(
        link.ax,
        link.ay,
        link.bx,
        link.by,
      );
      gradient.addColorStop(0, rgbaString(link.colorA, alpha));
      gradient.addColorStop(1, rgbaString(link.colorB, alpha));
      return gradient;
    };
    context.beginPath();
    context.moveTo(link.ax, link.ay);
    context.lineTo(link.bx, link.by);
    // Halo large et diffus (liaisons visibles seulement), puis cœur fin.
    if (intensity > 0.2) {
      context.strokeStyle = stroke(intensity * 0.22);
      context.lineWidth = 6 + link.energy * 5;
      context.stroke();
    }
    context.strokeStyle = stroke(intensity * 0.85);
    context.lineWidth = 1.1 + link.energy * 0.9;
    context.stroke();
  }
}

function drawGlows(context, model) {
  for (let index = 0; index < model.glowCount; index += 1) {
    const glow = model.glows[index];
    const radius = glow.size / 2;
    const alpha = Math.min(1, glow.alpha);
    const gradient = context.createRadialGradient(
      glow.x,
      glow.y,
      0,
      glow.x,
      glow.y,
      radius,
    );
    gradient.addColorStop(0, rgbaString(glow.color, alpha));
    gradient.addColorStop(0.25, rgbaString(glow.color, alpha * 0.45));
    gradient.addColorStop(1, rgbaString(glow.color, 0));
    context.fillStyle = gradient;
    context.fillRect(glow.x - radius, glow.y - radius, radius * 2, radius * 2);
  }
}

export default function CanvasNetwork({ engine }) {
  const canvasReference = useRef(null);

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let ratio = 1;
    let particles = [];

    return engine.addRenderer((model) => {
      const { w, h } = model.viewport;
      const nextRatio = Math.min(MAX_DPR, globalThis.devicePixelRatio || 1);
      if (w !== width || h !== height || nextRatio !== ratio) {
        width = w;
        height = h;
        ratio = nextRatio;
        canvas.width = Math.round(w * ratio);
        canvas.height = Math.round(h * ratio);
        particles = createParticles(model.layout.compact);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";
      drawParticles(context, model, particles, width, height);
      drawLinks(context, model);
      drawGlows(context, model);
    });
  }, [engine]);

  return (
    <div className="ab-net" aria-hidden="true">
      <canvas ref={canvasReference} className="ab-net__canvas" />
    </div>
  );
}
