// 「数字山水」：用细线刻出的山脊。所有场景都由种子生成，每次访问看到的山都一样，
// 每个作品也有自己的一座山。颜色取自 CSS 变量，这里不写死色值。

import { drawBroadleaf, drawFir, drawGrass, type TreeStyle } from "./trees";

type Ridge = (x: number) => number;

type Layer = {
  /** 山脊可能到达的最高和最低位置，相对于画布高度（0 为顶部）。 */
  top: number;
  bottom: number;
  /** 这一层的线条数量和第一条线的间距。 */
  lines: number;
  gap: number;
  stroke: string;
  strokeAlpha: number;
  /** 这一层的底色，用来遮住后面的山。 */
  fill: string;
  /** 平缓的山脊，人能走在上面。 */
  gentle?: boolean;
};

type Theme = {
  sky: string;
  ground: string;
  ink: string;
  muted: string;
  seal: string;
  paper: string;
};

export type SceneVariant = "band" | "footer" | "card" | "vignette";

const WAVELENGTHS = [520, 230, 96, 38];
const WEIGHTS = [1, 0.5, 0.25, 0.1];
const TOTAL_WEIGHT = WEIGHTS.reduce((sum, weight) => sum + weight, 0);
const LABEL_FONT = '500 13px "PingFang SC", "Microsoft YaHei", sans-serif';

function hash(seed: string) {
  let value = 2166136261;
  for (const character of seed) {
    value ^= character.codePointAt(0) ?? 0;
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function seededRandom(seed: string) {
  let state = hash(seed);
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function createRidge(
  seed: string,
  width: number,
  height: number,
  { top, bottom, gentle }: Pick<Layer, "top" | "bottom" | "gentle">,
): Ridge {
  const random = seededRandom(seed);
  const scale = Math.max(0.45, Math.min(1, width / 1100));
  const octaves = WAVELENGTHS.map((wavelength) => {
    const step = wavelength * scale;
    const points = Array.from({ length: Math.ceil(width / step) + 2 }, random);
    return { step, points };
  });
  return (x) => {
    let total = 0;
    octaves.forEach(({ step, points }, index) => {
      const position = Math.max(0, x) / step;
      const left = Math.floor(position);
      const blend = position - left;
      const smooth = blend * blend * (3 - 2 * blend);
      const start = points[left] ?? 0;
      const end = points[left + 1] ?? start;
      total += (start + (end - start) * smooth) * WEIGHTS[index];
    });
    // 噪声大多落在中段，先拉开，山峰和山谷才分明。低于 0 的部分继续往下沉，
    // 不要截平，否则山谷会变成一条贯穿全宽的直线。
    const low = gentle ? 0.2 : 0.3;
    const spread = (total / TOTAL_WEIGHT - low) / (1 - 2 * low);
    const peak = gentle ? spread : 1 - Math.abs(2 * spread - 1);
    const shaped = peak > 0 ? Math.pow(peak, 1.15) : peak;
    return height * (bottom - (bottom - top) * shaped);
  };
}

function trace(
  context: CanvasRenderingContext2D,
  width: number,
  y: (x: number) => number,
) {
  context.beginPath();
  context.moveTo(0, y(0));
  for (let x = 4; x < width + 4; x += 4) context.lineTo(x, y(x));
}

function drawLayer(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  ridge: Ridge,
  layer: Layer,
) {
  trace(context, width, ridge);
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.closePath();
  context.fillStyle = layer.fill;
  context.fill();

  const middle = ridge(width / 2);
  context.strokeStyle = layer.stroke;
  context.lineWidth = 1;
  for (let line = 0; line < layer.lines; line += 1) {
    const offset = line * layer.gap * (1 + line * 0.09);
    // 越靠下的线越平，也越淡，像墨色慢慢化开。
    const flatten = line / (layer.lines * 2.6);
    context.globalAlpha =
      layer.strokeAlpha * Math.pow(1 - line / layer.lines, 1.5);
    trace(
      context,
      width,
      (x) => ridge(x) + (middle - ridge(x)) * flatten + offset,
    );
    context.stroke();
  }
  context.globalAlpha = 1;
}

function prepare(canvas: HTMLCanvasElement) {
  const { width, height } = canvas.getBoundingClientRect();
  if (!width || !height) return null;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const context = canvas.getContext("2d");
  context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  return context ? { context, width, height, ratio } : null;
}

function readTheme(element: Element): Theme {
  const styles = getComputedStyle(element);
  const color = (name: string) => styles.getPropertyValue(name).trim();
  return {
    sky: color("--land-sky"),
    ground: color("--land-grass"),
    ink: color("--land-ink"),
    muted: color("--land-muted"),
    seal: color("--land-seal"),
    paper: color("--land-surface"),
  };
}

function fadeInto(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  from: number,
) {
  const gradient = context.createLinearGradient(0, height * from, 0, height);
  // 画布里的 transparent 是透明黑，直接过渡会发灰，所以用同色的全透明。
  gradient.addColorStop(0, `${color}00`);
  gradient.addColorStop(1, color);
  context.fillStyle = gradient;
  context.fillRect(0, height * from, width, height * (1 - from));
}

/**
 * 一个人提着代表 AI 的灯笼，脚下是 (x, y)。人自己走路，灯替他照亮前路。
 * time 让灯笼随步子摆动、火光跳动；不动的场景传 0。
 */
function drawFigures(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  colors: { figure: string; lantern: string },
  time: number,
) {
  const alpha = context.globalAlpha;
  const swing = Math.sin(time * 2.4) * 0.16;
  const flicker =
    0.85 + Math.sin(time * 5.3) * 0.08 + Math.sin(time * 8.1) * 0.05;
  context.save();
  context.translate(x, y);
  context.scale(1.25, 1.25);
  context.fillStyle = colors.figure;
  context.beginPath();
  context.arc(0, -13.5, 2.5, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.moveTo(-3.6, 0);
  context.quadraticCurveTo(-2.6, -7, -0.8, -10.5);
  context.lineTo(0.8, -10.5);
  context.quadraticCurveTo(2.6, -7, 3.6, 0);
  context.closePath();
  context.fill();

  // 提杆
  context.strokeStyle = colors.figure;
  context.lineWidth = 0.8;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(1.2, -8);
  context.lineTo(10, -12.5);
  context.stroke();

  // 灯笼绕杆头摆动
  context.translate(10, -12.5);
  context.rotate(swing);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(0, 2.6);
  context.stroke();
  context.fillStyle = colors.lantern;
  context.globalAlpha = alpha * 0.16 * flicker;
  context.beginPath();
  context.arc(0, 6, 8.5, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = alpha;
  context.beginPath();
  context.ellipse(0, 6, 2.7, 3.2, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = colors.figure;
  context.fillRect(-1.3, 2.5, 2.6, 0.7);
  context.fillRect(-1.3, 8.9, 2.6, 0.7);
  context.restore();
}

function layersFor(
  variant: Exclude<SceneVariant, "footer">,
  theme: Theme,
): Layer[] {
  const { ink, sky, paper } = theme;
  switch (variant) {
    case "band":
      return [
        {
          top: 0.1,
          bottom: 0.62,
          lines: 4,
          gap: 6,
          stroke: ink,
          strokeAlpha: 0.2,
          fill: sky,
        },
        {
          top: 0.42,
          bottom: 0.86,
          lines: 5,
          gap: 6,
          stroke: ink,
          strokeAlpha: 0.36,
          fill: sky,
        },
      ];
    case "card":
      return [
        {
          top: 0.22,
          bottom: 0.56,
          lines: 6,
          gap: 5,
          stroke: paper,
          strokeAlpha: 0.34,
          fill: ink,
        },
        {
          top: 0.46,
          bottom: 0.76,
          lines: 7,
          gap: 5,
          stroke: paper,
          strokeAlpha: 0.72,
          fill: ink,
        },
      ];
    case "vignette":
      return [
        {
          top: 0.3,
          bottom: 0.6,
          lines: 4,
          gap: 5,
          stroke: ink,
          strokeAlpha: 0.26,
          fill: sky,
        },
        {
          top: 0.58,
          bottom: 0.76,
          lines: 5,
          gap: 5,
          stroke: ink,
          strokeAlpha: 0.7,
          fill: sky,
        },
      ];
  }
}

/**
 * 页脚：一片树林和脚下的地，由远到近三排。越近的树越大、墨色越重，
 * 最近一排和地连成一片，再往下就是墨色的页脚。
 */
function drawGrove(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: Theme,
  seed: string,
) {
  const { ink, ground, paper } = theme;
  const scale = Math.max(0.6, Math.min(1, width / 1100));
  const rows: {
    land: Layer;
    spacing: number;
    size: [number, number];
    tree: TreeStyle;
    fir?: TreeStyle;
  }[] = [
    {
      land: {
        top: 0.6,
        bottom: 0.68,
        lines: 3,
        gap: 5,
        stroke: ink,
        strokeAlpha: 0.24,
        fill: ground,
        gentle: true,
      },
      spacing: 34,
      size: [24, 42],
      tree: {
        fill: ground,
        stroke: ink,
        strokeAlpha: 0.3,
        trunk: ink,
        trunkAlpha: 0.38,
      },
    },
    {
      land: {
        top: 0.7,
        bottom: 0.76,
        lines: 3,
        gap: 5,
        stroke: ink,
        strokeAlpha: 0.4,
        fill: ground,
        gentle: true,
      },
      spacing: 70,
      size: [50, 90],
      tree: {
        fill: ground,
        stroke: ink,
        strokeAlpha: 0.6,
        trunk: ink,
        trunkAlpha: 0.72,
      },
    },
    {
      land: {
        top: 0.76,
        bottom: 0.87,
        lines: 6,
        gap: 7,
        stroke: paper,
        strokeAlpha: 0.42,
        fill: ink,
        gentle: true,
      },
      spacing: 150,
      size: [100, 165],
      tree: {
        fill: ink,
        stroke: paper,
        strokeAlpha: 0.42,
        trunk: ink,
        trunkAlpha: 1,
      },
      fir: {
        fill: ground,
        stroke: ink,
        strokeAlpha: 0.85,
        trunk: ink,
        trunkAlpha: 1,
        needles: true,
      },
    },
  ];

  let land: Ridge | undefined;
  rows.forEach((row, index) => {
    const ridge = createRidge(`${seed}:${index}`, width, height, row.land);
    const random = seededRandom(`${seed}:trees:${index}`);
    // 两个随机数相乘，间距大多偏小，偶尔很大，树才会成丛，中间留出空地。
    let x = -10 + random() * row.spacing * scale;
    let previous = false;
    let run = 0;
    while (x < width + 10) {
      const tall = (row.size[0] + random() * (row.size[1] - row.size[0])) * scale;
      const y = ridge(x) + 2;
      // 同一种树最多连着两棵，深色的阔叶树才不会全挤在一边。
      let fir = random() < 0.55;
      if (fir === previous && run === 2) fir = !fir;
      run = fir === previous ? run + 1 : 1;
      previous = fir;
      if (fir) drawFir(context, x, y, tall, random, row.fir ?? row.tree);
      else drawBroadleaf(context, x, y, tall, random, row.tree);
      x += row.spacing * scale * (0.3 + random() * random() * 3.2);
    }
    drawLayer(context, width, height, ridge, row.land);
    land = ridge;
  });

  if (!land) return;
  const random = seededRandom(`${seed}:grass`);
  for (let x = random() * 30; x < width; x += 14 + random() * random() * 120) {
    drawGrass(context, x, land(x) + 1, 5 + random() * 6, random, ink);
  }
}

/** 不动的场景：内页分隔带、页脚、作品配图和空状态配图。 */
export function drawScene(
  canvas: HTMLCanvasElement,
  variant: SceneVariant,
  seed: string,
) {
  const prepared = prepare(canvas);
  if (!prepared) return;
  const { context, width, height } = prepared;
  const theme = readTheme(canvas);
  context.clearRect(0, 0, width, height);

  if (variant === "footer") {
    drawGrove(context, width, height, theme, seed);
    return;
  }

  const layers = layersFor(variant, theme);
  let front: Ridge | undefined;
  layers.forEach((layer, index) => {
    front = createRidge(`${seed}:${index}`, width, height, layer);
    drawLayer(context, width, height, front, layer);
  });

  if (variant === "band") fadeInto(context, width, height, theme.ground, 0.5);
  if (variant === "vignette" && front) {
    const colors = { figure: theme.ink, lantern: theme.seal };
    drawFigures(context, width * 0.42, front(width * 0.42), colors, 0);
  }
  if (variant === "card" && front) {
    // 夜山上的人用浅色，站在种子选中那一段的最高处，不会落进山谷或画面外。
    const start = width * (0.15 + seededRandom(`${seed}:walker`)() * 0.4);
    let x = start;
    for (let next = start; next <= start + width * 0.3; next += 2) {
      if (front(next) < front(x)) x = next;
    }
    const colors = { figure: theme.paper, lantern: theme.seal };
    drawFigures(context, x, front(x), colors, 0);
  }
}

const STATIONS = [
  { label: "「需求」", at: 0.11 },
  { label: "「取舍」", at: 0.37 },
  { label: "「上线」", at: 0.63 },
  { label: "「结果」", at: 0.89 },
];
const CROSSING_SECONDS = 68;
const REST_SECONDS = 2.6;
const END_SECONDS = 7;
const QUIET_SECONDS = 1.5;
const WALK_LAYERS = (theme: Theme): Layer[] => [
  {
    top: 0.03,
    bottom: 0.56,
    lines: 9,
    gap: 3.5,
    stroke: theme.ink,
    strokeAlpha: 0.22,
    fill: theme.sky,
  },
  {
    top: 0.18,
    bottom: 0.68,
    lines: 10,
    gap: 4,
    stroke: theme.ink,
    strokeAlpha: 0.36,
    fill: theme.sky,
  },
  {
    top: 0.4,
    bottom: 0.78,
    lines: 10,
    gap: 4.5,
    stroke: theme.ink,
    strokeAlpha: 0.54,
    fill: theme.sky,
  },
];
const FRONT_LAYER = (theme: Theme): Layer => ({
  top: 0.68,
  bottom: 0.8,
  lines: 7,
  gap: 6,
  stroke: theme.ink,
  strokeAlpha: 0.74,
  fill: theme.sky,
  gentle: true,
});

/** 走完全程后回到起点。返回这一刻走到的横向比例和这一轮的进度。 */
function walkPosition(elapsed: number) {
  const walking = CROSSING_SECONDS;
  const lastStation = STATIONS[STATIONS.length - 1].at;
  const cycle =
    lastStation * walking +
    REST_SECONDS * (STATIONS.length - 1) +
    END_SECONDS +
    QUIET_SECONDS;
  let remaining = elapsed % cycle;
  let previous = 0;
  for (let index = 0; index < STATIONS.length; index += 1) {
    const { at } = STATIONS[index];
    const leg = (at - previous) * walking;
    if (remaining < leg) {
      return { progress: previous + remaining / walking, ending: 0 };
    }
    remaining -= leg;
    previous = at;
    const rest = index === STATIONS.length - 1 ? END_SECONDS : REST_SECONDS;
    if (remaining < rest) {
      const last = index === STATIONS.length - 1;
      return {
        progress: at,
        ending: last ? Math.max(0, (remaining - rest + 2) / 2) : 0,
      };
    }
    remaining -= rest;
  }
  return { progress: previous, ending: 1 };
}

/** 进入页面时刚走到「需求」这一站。 */
export const WALK_START_TIME = STATIONS[0].at * CROSSING_SECONDS + 0.4;

/** 不想看动画时停在「上线」这一站。 */
export const WALK_STILL_TIME =
  STATIONS[2].at * CROSSING_SECONDS + REST_SECONDS * 2.5;

/** 首页的长卷：一个人提着灯笼沿最近的山脊，依次走过四站。 */
export function createWalkScene(canvas: HTMLCanvasElement) {
  let width = 0;
  let height = 0;
  let ratio = 1;
  let theme: Theme | undefined;
  let ridge: Ridge | undefined;
  const backdrop = document.createElement("canvas");

  const layout = () => {
    const prepared = prepare(canvas);
    if (!prepared) return false;
    ({ width, height, ratio } = prepared);
    theme = readTheme(canvas);
    backdrop.width = canvas.width;
    backdrop.height = canvas.height;
    const context = backdrop.getContext("2d");
    if (!context) return false;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    WALK_LAYERS(theme).forEach((layer, index) => {
      const back = createRidge(`scroll:${index}`, width, height, layer);
      drawLayer(context, width, height, back, layer);
    });
    const front = FRONT_LAYER(theme);
    ridge = createRidge("scroll:front", width, height, front);
    drawLayer(context, width, height, ridge, front);
    fadeInto(context, width, height, theme.ground, 0.84);
    return true;
  };

  const draw = (elapsed: number) => {
    const context = canvas.getContext("2d");
    if (!context || !theme || !ridge) return;
    const walkRidge = ridge;
    const { progress, ending } = walkPosition(elapsed);
    const x = progress * width;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(backdrop, 0, 0);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    context.globalAlpha = 1 - ending;
    context.strokeStyle = theme.seal;
    context.lineWidth = 1.5;
    trace(context, x, walkRidge);
    context.stroke();
    context.globalAlpha = 1;

    context.font = LABEL_FONT;
    context.textAlign = "center";
    context.lineJoin = "round";
    for (const station of STATIONS) {
      const stationX = station.at * width;
      const stationY = walkRidge(stationX);
      const reached = progress >= station.at;
      context.strokeStyle = theme.ink;
      context.globalAlpha = reached ? 0.8 : 0.35;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(stationX, stationY);
      context.lineTo(stationX, stationY - 28);
      context.stroke();
      context.globalAlpha = 1;
      context.lineWidth = 4;
      context.strokeStyle = theme.sky;
      context.strokeText(station.label, stationX, stationY - 34);
      context.fillStyle = reached ? theme.ink : theme.muted;
      context.fillText(station.label, stationX, stationY - 34);
    }

    context.globalAlpha = 1 - ending;
    drawFigures(
      context,
      x,
      walkRidge(x),
      { figure: theme.ink, lantern: theme.seal },
      elapsed,
    );
    context.globalAlpha = 1;
  };

  return { layout, draw };
}
