// Moteur du réseau de neurones de la hero : source UNIQUE de géométrie.
//
// Le réseau est un vrai perceptron multicouche (MLP) totalement connecté :
//   entrées (une bulle par section) → cachée 1 (5) → cachée 2 (4) → sortie (photo)
// lu de gauche à droite sur desktop, de haut en bas sur mobile.
//
// Le moteur ne dessine rien lui-même. À chaque frame il :
//   1. lit le scroll et calcule la progression du morph (p = 0 → réseau,
//      p = 1 → navbar en bulles) ;
//   2. calcule les positions de tous les éléments en coordonnées viewport
//      (px CSS) : bulles d'entrée, neurones cachés, sortie, liaisons,
//      impulsions et halos ;
//   3. écrit les transforms des éléments DOM (bulles, nœud central, bandeau) ;
//   4. appelle les renderers abonnés (Three.js ou Canvas 2D), qui ne font
//      que lire `model` pour dessiner liaisons, halos, impulsions et particules.

export const HIDDEN_LAYERS = [5, 4];

const STAGGER = 0.06; // décalage de départ du morph entre deux bulles
const MAX_PULSES = 96;
const MAX_GLOWS = 160;
const WHITE = [0.86, 0.9, 1];
const CORE_COLOR = [0.55, 0.62, 1];
// Opacité de base des liaisons, par couche de départ (entrées, cachée 1, cachée 2).
const LINK_ALPHA = [0.13, 0.11, 0.16];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (from, to, t) => from + (to - from) * t;
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

function mixInto(target, from, to, t) {
  target[0] = lerp(from[0], to[0], t);
  target[1] = lerp(from[1], to[1], t);
  target[2] = lerp(from[2], to[2], t);
  return target;
}

// Poids pseudo-aléatoires mais stables (même rendu à chaque visite).
function weight(from, to) {
  const value = Math.sin(from * 12.9898 + to * 78.233) * 43_758.5453;
  return 0.2 + 0.8 * (value - Math.floor(value));
}

export function hexToRgb(hex) {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

export function rgbaString(color, alpha) {
  return `rgba(${Math.round(color[0] * 255)}, ${Math.round(color[1] * 255)}, ${Math.round(color[2] * 255)}, ${alpha})`;
}

function readPixels(style, name, fallback) {
  const value = Number.parseFloat(style.getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

// Répartit des éléments de largeurs données sur une rangée centrée.
function spreadRow(widths, left, width) {
  const total = widths.reduce((sum, item) => sum + item, 0);
  const gap = Math.max(8, (width - total) / (widths.length + 1));
  const used = total + gap * (widths.length - 1);
  let cursor = left + (width - used) / 2;
  return widths.map((item) => {
    const center = cursor + item / 2;
    cursor += item + gap;
    return center;
  });
}

// Positions centrées de `count` neurones sur un segment de longueur `span`.
function spreadEven(count, center, span) {
  if (count === 1) return [center];
  return Array.from(
    { length: count },
    (_, index) => center - span / 2 + (index * span) / (count - 1),
  );
}

// Layout horizontal (desktop) : entrées en colonne à gauche, sortie à droite.
function horizontalLayout(stage, bubbles, outputRadius) {
  const maxHalfWidth = Math.max(...bubbles.map((bubble) => bubble.w)) / 2;
  const inputX = stage.x + maxHalfWidth + 4;
  const outputX = stage.x + stage.w - outputRadius - 12;
  const centerY = stage.y + stage.h / 2;
  const rowHeight = stage.h / bubbles.length;
  const inputs = bubbles.map((_, index) => ({
    x: inputX,
    y: stage.y + rowHeight * (index + 0.5),
  }));
  const startX = inputX + maxHalfWidth + 24;
  const endX = outputX - outputRadius - 24;
  const columns = [0.3, 0.7];
  const inputSpan = rowHeight * (bubbles.length - 1);
  const layers = HIDDEN_LAYERS.map((size, layer) => {
    const span =
      inputSpan * Math.min(1, (size - 1) / (bubbles.length - 1)) * 0.92;
    const x = lerp(startX, endX, columns[layer]);
    return spreadEven(size, centerY, span).map((y) => ({ x, y }));
  });
  return { inputs, layers, output: { x: outputX, y: centerY } };
}

// Layout vertical (mobile) : entrées en grille en haut, sortie en bas.
function verticalLayout(stage, bubbles, outputRadius) {
  const perRow = 3;
  const bubbleHeight = Math.max(...bubbles.map((bubble) => bubble.h));
  const rowGap = 12;
  const inputs = [];
  for (let start = 0; start < bubbles.length; start += perRow) {
    const row = bubbles.slice(start, start + perRow);
    const y =
      stage.y + bubbleHeight / 2 + (start / perRow) * (bubbleHeight + rowGap);
    const xs = spreadRow(
      row.map((bubble) => bubble.w),
      stage.x,
      stage.w,
    );
    for (const x of xs) inputs.push({ x, y });
  }
  const inputsBottom = inputs.at(-1).y + bubbleHeight / 2;
  const output = {
    x: stage.x + stage.w / 2,
    y: stage.y + stage.h - outputRadius - 6,
  };
  const top = inputsBottom + 20;
  const bottom = output.y - outputRadius - 20;
  const rows = [0.25, 0.72];
  const layers = HIDDEN_LAYERS.map((size, layer) => {
    const y = lerp(top, bottom, rows[layer]);
    const span = stage.w * (size === 1 ? 0 : 0.8 * (size / HIDDEN_LAYERS[0]));
    return spreadEven(size, output.x, span).map((x) => ({ x, y }));
  });
  return { inputs, layers, output };
}

// Calcule le layout statique (hors scroll) à partir des mesures DOM.
// `stage` est en coordonnées document, le reste en coordonnées viewport.
export function computeLayout({
  viewport,
  stage,
  bubbles,
  navTop,
  navHeight,
  heroHeight,
}) {
  const count = bubbles.length;
  const compact = viewport.w <= 768;
  const outputRadius = compact
    ? clamp(stage.w * 0.15, 40, 64)
    : clamp(stage.h * 0.16, 52, 96);
  const geometry = compact
    ? verticalLayout(stage, bubbles, outputRadius)
    : horizontalLayout(stage, bubbles, outputRadius);

  const hero = geometry.inputs.map((input, index) => ({
    x: clamp(
      input.x,
      bubbles[index].w / 2 + 8,
      viewport.w - bubbles[index].w / 2 - 8,
    ),
    y: input.y,
    // profondeur fictive : module la parallax souris
    depth: 0.6 + ((index * 7) % 6) / 8,
  }));
  const hidden = geometry.layers.flatMap((layer, layerIndex) =>
    layer.map((neuron) => ({ ...neuron, layer: layerIndex + 1 })),
  );

  // Slots de la navbar : une rangée centrée (ou alignée à gauche et
  // scrollable horizontalement si elle déborde).
  const navScale = compact ? 0.86 : 0.82;
  const gap = compact ? 18 : 30;
  const padding = compact ? 14 : 24;
  const widths = bubbles.map((bubble) => bubble.w * navScale);
  const total =
    widths.reduce((sum, width) => sum + width, 0) + gap * (count - 1);
  const overflow = total > viewport.w - padding * 2;
  let cursor = overflow ? padding : (viewport.w - total) / 2;
  const slotY = navTop + navHeight / 2;
  const slots = widths.map((width) => {
    const slot = { x: cursor + width / 2, y: slotY };
    cursor += width + gap;
    return slot;
  });

  return {
    count,
    compact,
    bubbles,
    hero,
    hidden,
    output: { ...geometry.output, r: outputRadius },
    slots,
    navScale,
    navTop,
    navHeight,
    overflow,
    navContentWidth: total + padding * 2,
    morphDistance: Math.max(200, Math.min(heroHeight, viewport.h) * 0.6),
  };
}

// Topologie du MLP. Identifiants de neurones :
//   [0, n)            entrées
//   [n, n + H)        neurones cachés (couches à la suite)
//   n + H             sortie
// Chaque liaison relie deux couches successives (totalement connecté).
// Pour chaque entrée i < n-1, une liaison « primaire » (vers le neurone
// caché le plus en face) glisse au scroll vers la bulle i+1 : elle devient
// la synapse de la navbar.
function buildTopology(count) {
  const layers = [Array.from({ length: count }, (_, index) => index)];
  let next = count;
  for (const size of HIDDEN_LAYERS) {
    layers.push(Array.from({ length: size }, (_, index) => next + index));
    next += size;
  }
  const output = next;
  layers.push([output]);

  const links = [];
  const outgoing = Array.from({ length: output + 1 }, () => []);
  for (let layer = 0; layer < layers.length - 1; layer += 1) {
    for (const from of layers[layer]) {
      for (const to of layers[layer + 1]) {
        outgoing[from].push(links.length);
        links.push({ from, to, layer, weight: weight(from, to), primary: -1 });
      }
    }
  }
  const firstHidden = layers[1];
  for (let input = 0; input < count - 1; input += 1) {
    const target =
      firstHidden[
        Math.round((input * (firstHidden.length - 1)) / Math.max(1, count - 1))
      ];
    const index = links.findIndex(
      (link) => link.from === input && link.to === target,
    );
    links[index].primary = input;
  }
  // Successeurs triés par poids décroissant (chemins les plus « actifs » d'abord).
  for (const list of outgoing) {
    list.sort((a, b) => links[b].weight - links[a].weight);
  }
  const primaryOf = Array.from({ length: count }, () => -1);
  for (const [index, link] of links.entries()) {
    if (link.primary >= 0) primaryOf[link.primary] = index;
  }
  return { layers, links, outgoing, output, primaryOf };
}

// Activations d'une passe forward partant de l'entrée `input` (0..1).
function forwardPass(topology, input) {
  const activation = Array.from({ length: topology.output + 1 }, () => 0);
  activation[input] = 1;
  for (let layer = 1; layer < topology.layers.length; layer += 1) {
    let max = 0;
    for (const link of topology.links) {
      if (link.layer !== layer - 1) continue;
      activation[link.to] += activation[link.from] * link.weight;
    }
    for (const id of topology.layers[layer])
      max = Math.max(max, activation[id]);
    for (const id of topology.layers[layer]) {
      // contraste : seuls les chemins forts restent vraiment lumineux
      activation[id] = max > 0 ? Math.pow(activation[id] / max, 2) : 0;
    }
  }
  return activation;
}

export function createNetworkEngine(sections) {
  const count = sections.length;
  const colors = sections.map((section) => hexToRgb(section.accent));
  const heroColors = colors.map((color) =>
    mixInto([0, 0, 0], color, WHITE, 0.45),
  );
  const topology = buildTopology(count);
  const hiddenCount = topology.output - count;
  const activations = colors.map((_, index) => forwardPass(topology, index));

  const model = {
    count,
    colors,
    viewport: { w: 0, h: 0 },
    layout: undefined,
    scrollY: 0,
    progress: 0,
    eased: 0,
    docked: false,
    navScrollX: 0,
    reducedMotion: false,
    time: 0,
    pointer: { x: 0, y: 0, targetX: 0, targetY: 0 },
    hover: -1,
    active: -1,
    nodes: colors.map(() => ({ x: 0, y: 0, scale: 1, morph: 0 })),
    hidden: Array.from({ length: hiddenCount }, () => ({
      x: 0,
      y: 0,
      energy: 0,
      flash: 0,
    })),
    hiddenAlpha: 1,
    output: { x: 0, y: 0, r: 0, scale: 1, opacity: 1, flash: 0 },
    links: topology.links.map(() => ({
      ax: 0,
      ay: 0,
      bx: 0,
      by: 0,
      colorA: WHITE,
      colorB: [1, 1, 1],
      alpha: 0,
      energy: 0,
      intensity: 0,
      // true : dégradé conseillé (synapses de la navbar)
      primary: false,
    })),
    pulses: [],
    glows: Array.from({ length: MAX_GLOWS }, () => ({
      x: 0,
      y: 0,
      size: 0,
      color: WHITE,
      alpha: 0,
    })),
    glowCount: 0,
  };

  const dom = {
    hero: undefined,
    stage: undefined,
    nav: undefined,
    band: undefined,
    core: undefined,
    spacer: undefined,
    bubbles: [],
  };
  const renderers = new Set();
  let mounted = false;
  let rafId = 0;
  let lastRender = 0;
  let forceFrame = false;
  let needsMeasure = true;
  let spawnClock = 0;
  let hoverClock = 0;
  let lastDocked;
  let lastMorphVariable = "";
  let resizeObserver;

  // ---------- Mesure ----------

  function measure() {
    needsMeasure = false;
    if (!dom.stage || !dom.hero || dom.bubbles.some((bubble) => !bubble)) {
      return false;
    }
    const root = document.documentElement;
    model.viewport.w = root.clientWidth;
    model.viewport.h = root.clientHeight;
    const scrollY = globalThis.scrollY;
    const stageRect = dom.stage.getBoundingClientRect();
    const heroRect = dom.hero.getBoundingClientRect();
    const navStyle = getComputedStyle(dom.nav);
    model.layout = computeLayout({
      viewport: model.viewport,
      stage: {
        x: stageRect.left,
        y: stageRect.top + scrollY,
        w: stageRect.width,
        h: stageRect.height,
      },
      bubbles: dom.bubbles.map((bubble) => ({
        w: bubble.offsetWidth,
        h: bubble.offsetHeight,
      })),
      navTop: readPixels(navStyle, "--ab-nav-top", 0),
      navHeight: readPixels(navStyle, "--ab-nav-height", 72),
      heroHeight: heroRect.height,
    });
    const diameter = model.layout.output.r * 2;
    dom.core.style.width = `${diameter}px`;
    dom.core.style.height = `${diameter}px`;
    dom.spacer.style.width = `${model.layout.navContentWidth}px`;
    return true;
  }

  // ---------- Simulation ----------

  // Position courante d'un neurone (entrée, caché ou sortie).
  function neuronX(id) {
    if (id < count) return model.nodes[id].x;
    if (id === topology.output) return model.output.x;
    return model.hidden[id - count].x;
  }
  function neuronY(id) {
    if (id < count) return model.nodes[id].y;
    if (id === topology.output) return model.output.y;
    return model.hidden[id - count].y;
  }

  function spawnPulse(link, options = {}) {
    if (model.pulses.length >= MAX_PULSES) return;
    if (model.links[link].alpha < 0.03) return;
    model.pulses.push({
      link,
      t: 0,
      direction: options.direction ?? 1,
      speed: options.speed ?? 300,
      strength: options.strength ?? 1,
      branches: options.branches ?? 1,
    });
  }

  function spawnAmbient() {
    if (model.docked) {
      if (count < 2) return;
      const input = Math.floor(Math.random() * (count - 1));
      spawnPulse(topology.primaryOf[input], {
        direction: Math.random() < 0.5 ? 1 : -1,
        speed: 160,
        strength: 0.7,
      });
      return;
    }
    // Passe forward ambiante : une entrée au hasard, un chemin au hasard.
    const input = Math.floor(Math.random() * count);
    const choices = topology.outgoing[input];
    spawnPulse(choices[Math.floor(Math.random() * choices.length)], {
      speed: 240,
      strength: 0.75,
    });
  }

  function spawnHoverBurst(index) {
    if (model.docked) {
      const right = topology.primaryOf[index];
      const left = index > 0 ? topology.primaryOf[index - 1] : -1;
      if (right >= 0) spawnPulse(right, { speed: 240 });
      if (left >= 0) spawnPulse(left, { direction: -1, speed: 240 });
      return;
    }
    // Forward pass : vers tous les neurones de la cachée 1, intensité selon
    // l'activation ; les impulsions fortes se ramifient ensuite.
    const activation = activations[index];
    for (const link of topology.outgoing[index]) {
      const strength = activation[topology.links[link].to];
      if (strength > 0.15) {
        spawnPulse(link, {
          speed: 380,
          strength: 0.5 + strength * 0.7,
          branches: 2,
        });
      }
    }
  }

  function continuePulse(pulse) {
    const target = topology.links[pulse.link].to;
    if (target === topology.output) {
      model.output.flash = Math.min(1, model.output.flash + 0.25);
      return;
    }
    model.hidden[target - count].flash = 1;
    const choices = topology.outgoing[target];
    if (pulse.branches > 1) {
      // passe forward guidée : on suit les liaisons les plus fortes
      for (const link of choices.slice(0, pulse.branches)) {
        spawnPulse(link, {
          speed: pulse.speed,
          strength: pulse.strength * 0.92,
          branches: 1,
        });
      }
      return;
    }
    const link = choices[Math.floor(Math.random() * choices.length)];
    spawnPulse(link, { speed: pulse.speed, strength: pulse.strength });
  }

  function updateNodes(progress) {
    const { layout, pointer, nodes } = model;
    const span = 1 - STAGGER * (count - 1);
    for (const [index, node] of nodes.entries()) {
      const local = model.reducedMotion
        ? model.eased
        : easeInOutCubic(clamp((progress - index * STAGGER) / span));
      const hero = layout.hero[index];
      const slot = layout.slots[index];
      const drift = 1 - local;
      const heroX = hero.x + pointer.x * 10 * hero.depth * drift;
      // Une bulle qui atteint le haut de l'écran s'y « accroche » au lieu
      // de sortir du viewport, puis glisse jusqu'à son slot.
      const heroY = Math.max(
        slot.y,
        hero.y - model.scrollY + pointer.y * 8 * hero.depth * drift,
      );
      node.x = lerp(heroX, slot.x - model.navScrollX, local);
      node.y = lerp(heroY, slot.y, local);
      node.scale = lerp(1, layout.navScale, local);
      node.morph = local;
    }
  }

  function updateLinks(deltaTime) {
    const { links, nodes, hover, active, docked, hiddenAlpha } = model;
    const activation = hover >= 0 && !docked ? activations[hover] : undefined;
    const ease = model.reducedMotion ? 1 : Math.min(1, deltaTime * 8);
    for (const [index, link] of links.entries()) {
      const edge = topology.links[index];
      link.ax = neuronX(edge.from);
      link.ay = neuronY(edge.from);
      let bx = neuronX(edge.to);
      let by = neuronY(edge.to);
      let target = activation ? activation[edge.from] * activation[edge.to] : 0;
      const sourceMorph = edge.from < count ? nodes[edge.from].morph : 0;
      let alpha = LINK_ALPHA[edge.layer] * hiddenAlpha * (1 - sourceMorph);

      if (edge.layer === 0) {
        link.colorA = colors[edge.from];
        mixInto(link.colorB, heroColors[edge.from], WHITE, 0.5);
      } else {
        link.colorA = WHITE;
        mixInto(
          link.colorB,
          WHITE,
          CORE_COLOR,
          edge.to === topology.output ? 1 : 0,
        );
      }

      link.primary = edge.primary >= 0;
      if (link.primary) {
        // La liaison primaire glisse vers la bulle suivante et devient
        // la synapse de la navbar.
        const from = nodes[edge.primary];
        const to = nodes[edge.primary + 1];
        // La liaison rejoint vite la bulle voisine : pendant le morph, les
        // bulles en vol restent reliées en chaîne.
        const morph = clamp(Math.min(from.morph, to.morph) * 2.5);
        bx = lerp(bx, to.x, morph);
        by = lerp(by, to.y, morph);
        mixInto(link.colorB, link.colorB, colors[edge.primary + 1], morph);
        alpha = lerp(LINK_ALPHA[0] * hiddenAlpha, 0.5, morph);
        if (morph > 0.5) {
          target =
            hover === edge.primary || hover === edge.primary + 1
              ? 1
              : active === edge.primary || active === edge.primary + 1
                ? 0.55
                : 0;
        }
      }
      link.bx = bx;
      link.by = by;
      link.alpha = alpha;
      link.energy += (target - link.energy) * ease;
      // Intensité finale partagée par les renderers : un chemin activé
      // ressort nettement, même sur une liaison de base très discrète.
      link.intensity =
        alpha < 0.004
          ? 0
          : Math.min(
              1,
              alpha * (1 + link.energy) +
                link.energy * 0.5 * Math.min(1, alpha * 8),
            );
    }
    // Énergie des neurones cachés (halo) selon la passe forward survolée.
    for (const [index, neuron] of model.hidden.entries()) {
      const target = activation ? activation[count + index] : 0;
      neuron.energy += (target - neuron.energy) * ease;
      neuron.flash = Math.max(0, neuron.flash - deltaTime * 2.5);
    }
  }

  function updatePulses(deltaTime) {
    const { pulses, links } = model;
    // Les nouvelles impulsions (ramifications) sont ajoutées en fin de
    // tableau : on parcourt une copie de la longueur initiale.
    const initial = pulses.length;
    const finished = [];
    for (let index = 0; index < initial; index += 1) {
      const pulse = pulses[index];
      const link = links[pulse.link];
      const length = Math.max(
        40,
        Math.hypot(link.bx - link.ax, link.by - link.ay),
      );
      pulse.t += (pulse.speed * deltaTime) / length;
      if (link.alpha < 0.02) {
        finished.push(index);
      } else if (pulse.t >= 1) {
        finished.push(index);
        if (!model.docked && pulse.direction > 0) continuePulse(pulse);
      }
    }
    for (let index = finished.length - 1; index >= 0; index -= 1) {
      pulses.splice(finished[index], 1);
    }
  }

  function updateGlows() {
    const { glows, nodes, layout, output, hidden, hover, active } = model;
    let used = 0;
    const push = (x, y, size, color, alpha) => {
      if (alpha < 0.004 || used >= glows.length) return;
      const glow = glows[used];
      glow.x = x;
      glow.y = y;
      glow.size = size;
      glow.color = color;
      glow.alpha = alpha;
      used += 1;
    };
    for (const [index, node] of nodes.entries()) {
      const bubble = layout.bubbles[index];
      const alpha =
        0.16 +
        (hover === index ? 0.4 : 0) +
        (active === index ? 0.35 * node.morph : 0);
      push(node.x, node.y, bubble.w * node.scale * 1.5, colors[index], alpha);
    }
    for (const neuron of hidden) {
      const boost = Math.max(neuron.energy, neuron.flash);
      push(
        neuron.x,
        neuron.y,
        30 + boost * 26,
        WHITE,
        model.hiddenAlpha * (0.6 + boost * 0.4),
      );
    }
    const heartbeat = 0.06 * Math.sin(model.time * 1.6);
    push(
      output.x,
      output.y,
      output.r * 3.4,
      CORE_COLOR,
      output.opacity * (0.45 + heartbeat + output.flash * 0.45),
    );
    for (const pulse of model.pulses) {
      const link = model.links[pulse.link];
      const t = pulse.direction > 0 ? pulse.t : 1 - pulse.t;
      push(
        lerp(link.ax, link.bx, t),
        lerp(link.ay, link.by, t),
        14 + pulse.strength * 10,
        t < 0.5 ? link.colorA : link.colorB,
        pulse.strength *
          Math.sqrt(Math.sin(Math.PI * clamp(pulse.t))) *
          Math.min(1, model.hiddenAlpha + (link.primary ? link.alpha * 2 : 0)),
      );
    }
    model.glowCount = used;
  }

  function update(deltaTime) {
    const { layout, pointer } = model;
    const reduced = model.reducedMotion;
    model.scrollY = globalThis.scrollY;
    const progress = clamp(model.scrollY / layout.morphDistance);
    model.progress = progress;
    const docked = reduced ? progress >= 0.5 : progress >= 0.999;
    model.docked = docked;
    model.eased = reduced ? (docked ? 1 : 0) : easeInOutCubic(progress);
    model.navScrollX = docked && dom.nav ? dom.nav.scrollLeft : 0;

    if (reduced) {
      pointer.x = 0;
      pointer.y = 0;
    } else {
      model.time += deltaTime;
      const follow = Math.min(1, deltaTime * 4);
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;
    }

    updateNodes(progress);

    const output = model.output;
    output.x = layout.output.x + pointer.x * 5;
    output.y = layout.output.y - model.scrollY + pointer.y * 4;
    output.scale = lerp(1, 0.25, model.eased);
    output.r = layout.output.r * output.scale;
    output.opacity = reduced
      ? docked
        ? 0
        : 1
      : 1 - smoothstep(0.35, 0.9, progress);
    output.flash = Math.max(0, output.flash - deltaTime * 1.8);

    model.hiddenAlpha = reduced
      ? docked
        ? 0
        : 1
      : 1 - smoothstep(0, 0.45, progress);
    for (const [index, neuron] of model.hidden.entries()) {
      const base = layout.hidden[index];
      const depth = base.layer * 0.5;
      neuron.x = base.x + pointer.x * 6 * depth;
      neuron.y = base.y - model.scrollY + pointer.y * 5 * depth;
    }

    updateLinks(deltaTime);

    if (reduced) {
      model.pulses.length = 0;
    } else {
      spawnClock += deltaTime;
      const interval = docked ? 0.9 : 0.3;
      while (spawnClock > interval) {
        spawnClock -= interval;
        spawnAmbient();
      }
      if (model.hover >= 0) {
        hoverClock += deltaTime;
        if (hoverClock > 0.45) {
          hoverClock = 0;
          spawnHoverBurst(model.hover);
        }
      }
      updatePulses(deltaTime);
    }

    updateGlows();
  }

  // ---------- Écriture DOM ----------

  function writeDom() {
    const { layout, nodes, output, docked } = model;
    const originY = docked ? layout.navTop : 0;
    for (const [index, element] of dom.bubbles.entries()) {
      const node = nodes[index];
      const size = layout.bubbles[index];
      const x = node.x + (docked ? model.navScrollX : 0) - size.w / 2;
      const y = node.y - originY - size.h / 2;
      element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${node.scale.toFixed(4)})`;
    }

    const base = layout.output.r;
    dom.core.style.transform = `translate3d(${(output.x - base).toFixed(2)}px, ${(output.y - base).toFixed(2)}px, 0) scale(${output.scale.toFixed(4)})`;
    dom.core.style.opacity = output.opacity.toFixed(3);
    dom.core.style.visibility = output.opacity < 0.01 ? "hidden" : "visible";

    const bandOpacity = model.reducedMotion
      ? docked
        ? 1
        : 0
      : smoothstep(0.7, 1, model.progress);
    dom.band.style.opacity = bandOpacity.toFixed(3);

    const morphVariable = model.progress.toFixed(3);
    if (morphVariable !== lastMorphVariable) {
      lastMorphVariable = morphVariable;
      dom.hero.style.setProperty("--ab-morph", morphVariable);
    }

    if (docked !== lastDocked) {
      lastDocked = docked;
      dom.nav.dataset.docked = docked ? "true" : "false";
    }
    if (dom.nav.dataset.ready !== "true") dom.nav.dataset.ready = "true";
  }

  // ---------- Boucle ----------

  function shouldRun() {
    return mounted && !document.hidden && !model.reducedMotion;
  }

  function schedule() {
    if (!rafId && mounted) rafId = requestAnimationFrame(loop);
  }

  function requestFrame() {
    forceFrame = true;
    schedule();
  }

  function loop(now) {
    rafId = 0;
    if (!mounted) return;
    if (needsMeasure && !measure()) return;
    if (!model.layout) return;

    // Navbar formée et rien de survolé : 30 fps suffisent pour les
    // impulsions ambiantes, la hero est hors écran.
    const idle = model.docked && model.hover < 0 && !forceFrame;
    if (idle && now - lastRender < 32) {
      schedule();
      return;
    }
    forceFrame = false;
    const deltaTime = lastRender
      ? Math.min(0.05, (now - lastRender) / 1000)
      : 1 / 60;
    lastRender = now;

    update(deltaTime);
    writeDom();
    for (const render of renderers) render(model, now);

    if (shouldRun()) schedule();
  }

  // ---------- Écouteurs ----------

  function onScroll() {
    // Une fois la navbar formée, le scroll ne change rien au réseau.
    if (
      model.docked &&
      model.layout &&
      globalThis.scrollY >= model.layout.morphDistance
    ) {
      schedule();
      return;
    }
    requestFrame();
  }

  function onResize() {
    needsMeasure = true;
    requestFrame();
  }

  function onPointerMove(event) {
    if (event.pointerType !== "mouse" || !model.viewport.w) return;
    model.pointer.targetX = (event.clientX / model.viewport.w) * 2 - 1;
    model.pointer.targetY = (event.clientY / model.viewport.h) * 2 - 1;
    schedule();
  }

  function onVisibilityChange() {
    if (!document.hidden) requestFrame();
  }

  return {
    model,

    setBubble(index, element) {
      dom.bubbles[index] = element ?? undefined;
      needsMeasure = true;
    },

    mount(elements) {
      Object.assign(dom, elements);
      mounted = true;
      needsMeasure = true;
      lastDocked = undefined;
      globalThis.addEventListener("scroll", onScroll, { passive: true });
      globalThis.addEventListener("resize", onResize);
      globalThis.addEventListener("pointermove", onPointerMove, {
        passive: true,
      });
      document.addEventListener("visibilitychange", onVisibilityChange);
      dom.nav.addEventListener("scroll", requestFrame, { passive: true });
      resizeObserver = new ResizeObserver(onResize);
      for (const element of [dom.hero, dom.stage, ...dom.bubbles]) {
        if (element) resizeObserver.observe(element);
      }
      // Les polices changent la largeur des bulles : on remesure une fois chargées.
      document.fonts?.ready.then(onResize);
      requestFrame();
    },

    unmount() {
      mounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      globalThis.removeEventListener("scroll", onScroll);
      globalThis.removeEventListener("resize", onResize);
      globalThis.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      dom.nav?.removeEventListener("scroll", requestFrame);
      resizeObserver?.disconnect();
    },

    setReducedMotion(value) {
      model.reducedMotion = value;
      requestFrame();
    },

    setHover(index) {
      model.hover = index;
      hoverClock = 1; // déclenche une salve immédiatement
      requestFrame();
    },

    setActive(index) {
      model.active = index;
      const { layout } = model;
      // Navbar scrollable (mobile) : on garde la bulle active visible.
      if (index >= 0 && layout?.overflow && model.docked && dom.nav) {
        dom.nav.scrollTo({
          left: layout.slots[index].x - model.viewport.w / 2,
          behavior: model.reducedMotion ? "auto" : "smooth",
        });
      }
      requestFrame();
    },

    // Hauteur à réserver en haut de l'écran lors d'un scroll vers une section.
    getNavOffset() {
      const { layout } = model;
      return layout ? layout.navTop + layout.navHeight + 16 : 0;
    },

    addRenderer(render) {
      renderers.add(render);
      requestFrame();
      return () => renderers.delete(render);
    },
  };
}
