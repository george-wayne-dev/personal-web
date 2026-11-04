// 细线刻出的树，和山脊是同一种手法：先用底色遮住后面的景物，再刻上细线。

const TAU = Math.PI * 2;
const DROOP = 0.42;

export type TreeStyle = {
  /** 树的底色，用来遮住后面的树。 */
  fill: string;
  /** 刻在树身上的线。 */
  stroke: string;
  strokeAlpha: number;
  /** 树干和轮廓。 */
  trunk: string;
  trunkAlpha: number;
  /** 枝条上挂一排针叶，只给近处的杉树：越近细节越多，但不涂成实心。 */
  needles?: boolean;
};

type Random = () => number;

/** 杉树：脚下是 (x, y)。一根主干，枝条从上到下越来越长，微微下垂。 */
export function drawFir(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  random: Random,
  style: TreeStyle,
) {
  const top = y - height;
  const tiers = Math.max(5, Math.round(height / (style.needles ? 7 : 5)));
  const branches = Array.from({ length: tiers }, (_, index) => {
    const along = index / (tiers - 1);
    const reach = height * (0.035 + 0.2 * along);
    return {
      y: top + height * (0.05 + 0.72 * along),
      left: reach * (0.75 + random() * 0.5),
      right: reach * (0.75 + random() * 0.5),
    };
  });

  context.fillStyle = style.fill;
  context.beginPath();
  context.moveTo(x, top);
  for (const branch of branches) {
    const tip = branch.y + branch.right * DROOP;
    context.lineTo(x + branch.right, tip);
    context.lineTo(x + branch.right * 0.5, tip + 0.5);
  }
  for (const branch of [...branches].reverse()) {
    const tip = branch.y + branch.left * DROOP;
    context.lineTo(x - branch.left * 0.5, tip + 0.5);
    context.lineTo(x - branch.left, tip);
  }
  context.closePath();
  context.fill();

  context.strokeStyle = style.trunk;
  context.globalAlpha = style.trunkAlpha;
  context.lineWidth = Math.max(1, height * 0.014);
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x, top);
  context.stroke();

  context.strokeStyle = style.stroke;
  context.lineWidth = 1;
  context.globalAlpha = style.strokeAlpha;
  for (const branch of branches) {
    context.beginPath();
    for (const reach of [branch.right, -branch.left]) {
      context.moveTo(x, branch.y);
      context.quadraticCurveTo(
        x + reach * 0.6,
        branch.y + Math.abs(reach) * 0.08,
        x + reach,
        branch.y + Math.abs(reach) * DROOP,
      );
    }
    context.stroke();
  }

  if (style.needles) {
    context.beginPath();
    for (const branch of branches) {
      for (const reach of [branch.right, -branch.left]) {
        const count = Math.max(3, Math.round(Math.abs(reach) / 2.4));
        for (let step = 1; step <= count; step += 1) {
          const t = step / count;
          const bend = 2 * t * (1 - t);
          const tipX = x + reach * (bend * 0.6 + t * t);
          const tipY =
            branch.y + Math.abs(reach) * (bend * 0.08 + t * t * DROOP);
          const length = 2 + random() * 2.5;
          context.moveTo(tipX, tipY);
          context.lineTo(
            tipX + Math.sign(reach) * length * 0.35,
            tipY + length,
          );
        }
      }
    }
    context.stroke();
  }
  context.globalAlpha = 1;
}

/** 阔叶树：脚下是 (x, y)。树干分叉，树冠外缘一簇簇鼓起，里面刻着一片片叶簇，右下方更密。 */
export function drawBroadleaf(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  random: Random,
  style: TreeStyle,
) {
  const centerX = x + (random() - 0.5) * height * 0.08;
  const centerY = y - height * 0.66;
  const radiusY = height * 0.33;
  const radiusX = radiusY * (1 + random() * 0.45);
  const lobes = 6 + Math.floor(random() * 4);
  const lobePhase = random() * TAU;
  const leanPhase = random() * TAU;
  // 树冠底部比顶部平。
  const squash = (angle: number) => (Math.sin(angle) > 0 ? 0.72 : 1);

  context.strokeStyle = style.trunk;
  context.globalAlpha = style.trunkAlpha;
  context.lineCap = "round";
  context.lineWidth = Math.max(1, height * 0.026);
  context.beginPath();
  context.moveTo(x, y);
  context.quadraticCurveTo(x, y - height * 0.3, centerX, centerY);
  context.stroke();
  context.lineWidth = Math.max(1, height * 0.014);
  context.beginPath();
  for (const side of [-1, 1]) {
    context.moveTo(x, y - height * 0.24);
    context.quadraticCurveTo(
      x + side * radiusX * 0.2,
      y - height * 0.32,
      centerX + side * radiusX * 0.6,
      centerY,
    );
  }
  context.stroke();
  context.lineCap = "butt";

  context.beginPath();
  for (let step = 0; step < 96; step += 1) {
    const angle = (step / 96) * TAU;
    const size =
      0.84 +
      0.16 * Math.abs(Math.sin((angle * lobes) / 2 + lobePhase)) +
      0.07 * Math.sin(angle * 2 + leanPhase);
    const pointX = centerX + Math.cos(angle) * radiusX * size;
    const pointY =
      centerY + Math.sin(angle) * radiusY * size * squash(angle);
    if (step) context.lineTo(pointX, pointY);
    else context.moveTo(pointX, pointY);
  }
  context.closePath();
  context.fillStyle = style.fill;
  context.globalAlpha = 1;
  context.fill();
  context.lineWidth = 1;
  context.globalAlpha = style.trunkAlpha;
  context.stroke();

  context.strokeStyle = style.stroke;
  const clusters = Math.round(height * 0.6);
  for (let index = 0; index < clusters; index += 1) {
    const angle = random() * TAU;
    const distance = Math.sqrt(random()) * 0.8;
    const across = Math.cos(angle) * distance;
    const down = Math.sin(angle) * distance;
    const size = 1.4 + height * 0.02 + random() * height * 0.012;
    context.globalAlpha =
      style.strokeAlpha * (0.25 + 0.75 * Math.max(0, (across + down + 1) / 2));
    context.beginPath();
    context.arc(
      centerX + across * radiusX,
      centerY + down * radiusY * squash(angle),
      size,
      Math.PI * 1.1,
      Math.PI * 1.9,
    );
    context.stroke();
  }
  context.globalAlpha = 1;
}

/** 一丛草，几片叶子从 (x, y) 向两边弯。 */
export function drawGrass(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  random: Random,
  color: string,
) {
  const blades = 3 + Math.floor(random() * 3);
  context.strokeStyle = color;
  context.lineWidth = 1;
  context.beginPath();
  for (let blade = 0; blade < blades; blade += 1) {
    const offset = (blade - (blades - 1) / 2) * 1.4;
    const tall = height * (0.6 + random() * 0.4);
    context.moveTo(x + offset, y);
    context.quadraticCurveTo(
      x + offset * 1.2,
      y - tall * 0.6,
      x + offset * 2.6,
      y - tall,
    );
  }
  context.stroke();
}
