/* eslint-disable @typescript-eslint/no-unused-expressions -- Preserve expression sequences in the original compiled drawing code. */
// Drawing source: https://railcode.dev/assets/main-DUFPR3JZ.js
// Extracted 2026-10-21. Original park and cloud rendering.
import {
  Gl as t,
  Sl as n,
  Kl as r,
  yl as i,
  bl as a,
  Tl as o,
  Vl as s,
  Pl as c,
  wl as l,
  Ml as d,
  Il as f,
  Ul as p,
  Cl as m,
  Al as h,
  El as g,
  Ll as v,
  K as y,
  Bl as b,
  q as x,
  Hl as S,
  G as T,
  kl as te,
  Fl as D,
  ql as O,
  jl as re,
  uu as k,
  Dl as ie,
  du as se,
  Ol as ce,
  Nl as le,
  lu as ue,
  Wl as j,
  Rl as pe,
  xl as me,
} from "./pixels";
var gt = {
    wisp: {
      w: 12,
      h: 5,
      lumps: [
        [3, 2.3],
        [6.8, 1.9],
        [9, 1.5],
      ],
    },
    puff: {
      w: 17,
      h: 7,
      lumps: [
        [2.3, 1.9],
        [5.3, 3],
        [9, 2.6],
        [12.8, 1.9],
      ],
    },
    drift: {
      w: 23,
      h: 8,
      lumps: [
        [3, 2.3],
        [6.8, 3.8],
        [12, 3],
        [16.5, 2.6],
        [19.5, 1.9],
      ],
    },
    bank: {
      w: 29,
      h: 10,
      lumps: [
        [3.8, 2.6],
        [8.3, 4.5],
        [15, 2.8],
        [20.3, 3],
        [24.8, 2.3],
      ],
    },
  },
  _t = `#FFFFFF`,
  vt = `#D3E4F2`,
  yt = 2;
function bt(e, t) {
  let n = gt[t],
    { w: r, h: i } = n,
    a = i - 1;
  ((e.width = r),
    (e.height = i),
    (e.style.width = `${r * yt}px`),
    (e.style.height = `${i * yt}px`));
  let o = e.getContext(`2d`);
  if (!o) return;
  let s = Math.max(2, Math.round(i * 0.22)),
    c = 1 / 0,
    l = -1 / 0;
  for (let [e, t] of n.lumps)
    ((c = Math.min(c, e - t + 1)), (l = Math.max(l, e + t - 1)));
  let u = [],
    d = Array(r).fill(0);
  for (let e = 0; e <= a; e++)
    for (let t = 0; t < r; t++) {
      let i = e > a - s && t + 0.5 >= c && t + 0.5 <= l;
      for (let r = 0; r < n.lumps.length && !i; r++) {
        let o = t + 0.5 - n.lumps[r][0],
          s = e + 0.5 - (a + 1 - n.lumps[r][1]);
        i = o * o + s * s <= n.lumps[r][1] * n.lumps[r][1];
      }
      ((u[e * r + t] = i), i && d[t]++);
    }
  for (let e = 0; e <= a; e++)
    for (let t = 0; t < r; t++)
      u[e * r + t] &&
        ((o.fillStyle = e === a || (e === a - 1 && d[t] <= 3) ? vt : _t),
        o.fillRect(t, e, 1, 1));
}
function Tt(e, t, n, r) {
  k(e, t, n, 16);
  let i = n - 34,
    a = r * 0.35;
  (e.line(t - 11, n - 1, t - 1, i, l),
    e.line(t - 12, n - 1, t - 2, i, m),
    e.line(t + 11, n - 1, t + 1, i, l),
    e.line(t + 12, n - 1, t + 2, i, m),
    e.rect(t - 15, n - 2, 7, 2, g),
    e.rect(t + 9, n - 2, 7, 2, g),
    e.circ(t, i, 20, m),
    e.circ(t, i, 19, l));
  for (let n = 0; n < 8; n++) {
    let r = (n * Math.PI) / 4 + 0.35 + a;
    e.line(t, i, t + Math.cos(r) * 18, i + Math.sin(r) * 18, m);
  }
  for (let n = 0; n < 8; n++) {
    let r = (n * Math.PI) / 4 + 0.35 + a,
      s = (t + Math.cos(r) * 21) | 0,
      c = (i + Math.sin(r) * 21) | 0;
    (e.put(s, c + 1, o),
      e.rect(s - 2, c + 2, 5, 3, O[n]),
      e.rect(s - 2, c + 5, 5, 1, te));
  }
  (e.rect(t - 1, i - 1, 3, 3, o), e.put(t, i, l));
}
function Et(e, t, n, r) {
  k(e, t, n, 18);
  for (let r = n - 8; r <= n; r++) {
    let i = (r - (n - 4)) / 4.5,
      a = Math.round(17 * Math.sqrt(Math.max(0, 1 - i * i)));
    e.rect(t - a, r, a * 2 + 1, 1, r < n - 6 ? b : r > n - 2 ? S : s);
  }
  let i = [c, h, d, f],
    a = (a) => {
      let c = r * 0.8 + (a * Math.PI) / 2,
        l = (t + Math.sin(c) * 12) | 0,
        u = Math.cos(c),
        d = Math.round(n - 7.5 + u * 1.5 + Math.sin(r * 3 + a * 1.7) * 1.5);
      (e.line(l, n - 24, l, d, s),
        e.rect(l - 2, d, 5, 2, i[a]),
        e.put(l + 3, d - 1, i[a]),
        e.put(l, d - 1, re),
        e.put(l - 2, d + 2, o),
        e.put(l + 2, d + 2, o));
    };
  for (let e = 0; e < 4; e++) Math.cos(r * 0.8 + (e * Math.PI) / 2) < 0 && a(e);
  e.rect(t - 1, n - 26, 2, 20, m);
  for (let e = 0; e < 4; e++)
    Math.cos(r * 0.8 + (e * Math.PI) / 2) >= 0 && a(e);
  for (let r = n - 36; r <= n - 24; r++) {
    let i = Math.round(((r - (n - 36)) / 12) * 19);
    for (let a = t - i; a <= t + i; a++)
      e.put(a, r, r === n - 24 ? v : (((a - t + 40) / 5) | 0) & 1 ? f : D);
    (e.put(t - i, r, v), e.put(t + i, r, v));
  }
  (e.put(t, n - 37, d), e.put(t, n - 38, le));
}
function Dt(e, t, n, i) {
  k(e, t, n, 13);
  let a = n - 27;
  (e.line(t - 10, n - 1, t - 1, a + 1, l),
    e.line(t - 11, n - 1, t - 2, a + 1, m),
    e.line(t + 10, n - 1, t + 1, a + 1, l),
    e.line(t + 12, n - 1, t + 2, a + 1, m),
    e.rect(t - 14, n - 2, 7, 2, g),
    e.rect(t + 8, n - 2, 7, 2, g));
  let s = 0.72 * Math.sin(i * 1.2),
    c = Math.cos(s),
    u = Math.sin(s),
    f = t + u * 13,
    _ = a + c * 13;
  e.line(t, a, f | 0, _ | 0, o);
  for (let t = -9; t <= 9; t++) {
    let n = (t * t) / 12,
      r = (f + t * c) | 0,
      i = Math.round(_ - t * u - n);
    (e.put(r, i - 1, h),
      e.put(r, i, h),
      e.put(r, i + 1, re),
      e.put(r, i + 2, te),
      Math.abs(t) > 6 && (e.put(r, i - 2, h), e.put(r, i - 3, d)));
  }
  ([-5, -1, 3].forEach((t, n) => {
    let i = (t * t) / 12,
      a = (f + t * c) | 0,
      o = Math.round(_ - t * u - i);
    (e.put(a, o - 2, p), e.put(a, o - 3, r[(n + 1) % 8]));
  }),
    e.rect(t - 1, a - 1, 3, 3, o),
    e.put(t, a, l));
}
function Ot(e, t, n) {
  (k(e, t, n, 12),
    e.rect(t - 10, n - 12, 20, 12, D),
    e.rect(t - 10, n - 12, 20, 1, T(210, 200, 186)),
    e.rect(t + 8, n - 12, 2, 12, T(206, 196, 180)),
    e.rect(t - 6, n - 9, 11, 5, T(72, 60, 52)),
    e.put(t - 1, n - 9, r[2]),
    e.put(t - 1, n - 8, p),
    e.rect(t - 2, n - 7, 3, 3, O[6]));
  for (let r = 0; r < 4; r++)
    for (let i = t - 12; i <= t + 12; i++)
      e.put(i, n - 16 + r, ((i - t + 12) >> 2) & 1 ? h : c);
  e.rect(t - 3, n - 19, 7, 2, d);
}
var K = 7,
  q = 0.55,
  kt = Math.PI * q,
  At = K,
  jt = At + kt,
  Mt = jt + K,
  Nt = Mt + kt;
function Pt(e) {
  if (e < At) return { u: e, v: 0 };
  if (e < jt) {
    let t = (e - At) / q;
    return { u: K + q * Math.sin(t), v: q - q * Math.cos(t) };
  }
  if (e < Mt) return { u: K - (e - jt), v: 2 * q };
  let t = (e - Mt) / q;
  return { u: -0.55 * Math.sin(t), v: q + q * Math.cos(t) };
}
var Ft = [
  [0, 1.2, 0.45, 0.45, 0],
  [1.2, 4.6, 0.45, 2.2, 0.28],
  [4.6, 6.4, 2.2, 0.3, 0.3],
  [6.4, 9.4, 0.3, 0.75, 0.5],
  [9.4, 11, 0.75, 1.55, 0.5],
  [11, 12.6, 1.55, 0.55, 0.5],
  [12.6, 13.9, 0.55, 1.15, 0.5],
  [13.9, 15.2, 1.15, 0.45, 0.5],
  [15.2, 99, 0.45, 0.45, 0],
];
function It(e, t) {
  if (e <= 0) return 0;
  if (e >= 1) return 1;
  if (t >= 0.5) return e * e * (3 - 2 * e);
  let n = 1 / (2 * t * (1 - t));
  return e < t
    ? n * e * e
    : e > 1 - t
      ? 1 - n * (1 - e) * (1 - e)
      : (e - t / 2) / (1 - t);
}
function Lt(e) {
  for (let [t, n, r, i, a] of Ft)
    if (e >= t && e <= n) {
      let o = (e - t) / (n - t || 1);
      return r + (i - r) * It(o, a);
    }
  return 0.45;
}
function Rt(e, t, s) {
  let c = Math.SQRT1_2,
    u = [];
  for (let e = 0; e < Nt; e += 0.012) {
    let t = Pt(e);
    u.push({ x: (t.u + t.v) * c + 4, y: (t.v - t.u) * c + 4, z: Lt(e), d: e });
  }
  let d = u.length,
    f = new Float64Array(d);
  for (let e = 1; e < d; e++) {
    let t = u[e - 1],
      n = u[e];
    f[e] = f[e - 1] + Math.hypot(n.x - t.x, n.y - t.y, n.z - t.z);
  }
  let _ = f[d - 1],
    v = Math.round(t - 3.5 * 16 * Math.SQRT2),
    y = s - 64,
    b = (e, t, n) => [
      Math.round((e - t) * 16) + v,
      Math.round((e + t) * 8 - n * 16) + y,
    ];
  function x(e) {
    let t = Math.max(0, Math.min(_ - 1e-6, e)),
      n = 0,
      r = d - 1;
    for (; n < r;) {
      let e = (n + r + 1) >> 1;
      f[e] <= t ? (n = e) : (r = e - 1);
    }
    let i = u[n],
      a = u[Math.min(n + 1, d - 1)],
      o = f[Math.min(n + 1, d - 1)] - f[n] || 1e-9,
      s = Math.min(1, (t - f[n]) / o),
      c = a.x - i.x,
      l = a.y - i.y,
      p = a.z - i.z,
      m = Math.hypot(c, l, p) || 1e-9;
    ((c /= m), (l /= m), (p /= m));
    let h = l,
      g = -c,
      v = Math.hypot(h, g) || 1e-9;
    return (
      (h /= v),
      (g /= v),
      {
        x: i.x + (a.x - i.x) * s,
        y: i.y + (a.y - i.y) * s,
        z: i.z + (a.z - i.z) * s,
        dx: c,
        dy: l,
        dz: p,
        bx: h,
        by: g,
      }
    );
  }
  let S = (e, t, n, r = 0) => (e + t) * 64 + n * 2 + (r ? r * 0.002 : 0),
    C = [],
    w = 0.06;
  for (let t = 0; t < Math.floor(_ / w); t++) {
    let r = t * w,
      o = x(r),
      s = x(r + w);
    if (t % 4 == 0) {
      let t = b(o.x + o.bx * 0.2, o.y + o.by * 0.2, o.z),
        i = b(o.x - o.bx * 0.2, o.y - o.by * 0.2, o.z);
      C.push({
        key: S(o.x, o.y, o.z, r) - 16,
        draw: () => e.line(t[0], t[1], i[0], i[1], me, n),
      });
    }
    for (let t of [-1, 1]) {
      let n = b(o.x + o.bx * 0.16 * t, o.y + o.by * 0.16 * t, o.z),
        c = b(s.x + s.bx * 0.16 * t, s.y + s.by * 0.16 * t, s.z);
      C.push({
        key: S(o.x, o.y, o.z, r) + t * 0.01,
        draw: () => e.line(n[0], n[1], c[0], c[1], i, a),
      });
    }
  }
  function ee(t, n, r) {
    if (r < 0.25) return;
    let [i, a] = b(t, n, r),
      s = Math.round((t + n) * 8) + y;
    C.push({
      key: S(t, n, 0),
      draw: () => {
        for (let t = a; t <= s; t++)
          (e.put(i - 1, t, l), e.put(i, t, m), e.put(i + 1, t, o));
        for (let t = i - 2; t <= i + 2; t++)
          (e.put(t, s, g), e.put(t, s + 1, o));
      },
    });
  }
  let T = 0.6;
  for (let e = 0; e < d; e++)
    u[e].d >= T && (ee(u[e].x, u[e].y, u[e].z - 0.05), (T += 1.1));
  function E(t, n, i) {
    for (let n = 0; n <= 7; n++) {
      let r = -0.21 + (0.42 * n) / 7,
        [i, a] = b(t.x + t.dx * r, t.y + t.dy * r, t.z + t.dz * r);
      (e.put(i, a, te), e.put(i, a - 1, ce), e.put(i, a - 2, ie));
    }
    if (n)
      for (let n = 1; n <= 3; n++) {
        let r = 0.21 + 0.07 * n,
          [i, a] = b(t.x + t.dx * r, t.y + t.dy * r, t.z + t.dz * r);
        (e.put(i, a, h), e.put(i, a - 1, h));
      }
    let a = t.dz < -0.35;
    for (let n of [-0.1, 0.1]) {
      let o = i * 2 + +(n > 0),
        [s, c] = b(t.x + t.dx * n, t.y + t.dy * n, t.z + t.dz * n);
      (e.put(s, c - 2, O[o % 8]),
        e.put(s, c - 3, p),
        e.put(s, c - 4, r[o % 8]),
        a && (e.put(s - 1, c - 4, p), e.put(s + 1, c - 4, p)));
    }
  }
  C.sort((e, t) => e.key - t.key);
  let D = 0;
  return {
    draw(e) {
      let t = x(D);
      D = (D + (0.55 + Math.max(0, 2.2 - t.z) * 0.85) * e) % _;
      let n = C.slice();
      for (let e = 0; e < 3; e++) {
        let t = x((((D - e * 0.5) % _) + _) % _);
        n.push({ key: S(t.x, t.y, t.z, 0) + 10, draw: () => E(t, e === 0, e) });
      }
      n.sort((e, t) => e.key - t.key);
      for (let e of n) e.draw();
    },
  };
}
function J(e, t, n, r) {
  let i = Math.round(13 * r);
  (k(e, t, n, Math.round(4 * r)), e.rect(t - 1, n - 4, 2, 4, x));
  for (let a = 0; a < i; a++) {
    let o = Math.round((a / i) * 5 * r);
    e.rect(t - o, n - 4 - i + a, o * 2 + 1, 1, a % 4 < 2 ? pe : y);
  }
}
function zt(e, t, n) {
  (e.rect(t, n - 13, 1, 13, o),
    e.rect(t - 1, n - 15, 3, 2, d),
    e.rect(t - 1, n, 3, 1, o));
}
function Bt(e, t, n, r, i) {
  (e.rect(t, n - 24, 1, 24, o), e.put(t, n - 25, l));
  let a = +(Math.sin(i * 3 + t * 0.7) > 0.55);
  for (let i = 0; i < 4; i++)
    e.rect(t + 1, n - 24 + i, 4 - i + (i === 1 || i === 2 ? a : 0), 1, r);
}
function Y(e, t, n, i, a) {
  (e.put(t, n - 5, r[i % r.length]),
    e.put(t, n - 4, p),
    e.rect(t - 1, n - 3, 3, 2, O[i % O.length]),
    a === void 0
      ? (e.put(t - (i & 1), n - 1, j), e.put(t + ((i >> 1) & 1), n - 1, j))
      : a
        ? (e.put(t - 1, n - 1, j), e.put(t + 1, n - 1, j))
        : e.put(t, n - 1, j));
}
function Vt(e, t, n, r) {
  (e.rect(t - 1, n, 3, 3, r), e.put(t, n + 3, r));
}
function Ht(e, n, r, i, a, o, s) {
  Y(e, n, r, i, s);
  let c = n + 3 + Math.round(Math.sin(o * 1.1 + i * 2) * 1.5);
  (e.line(n + 1, r - 4, c, r - 11, t), Vt(e, c, r - 14, a));
}
function Ut(e, n, r, i, a) {
  Vt(e, n, r, i);
  for (let i = 1; i <= 5; i++)
    e.put(n + +(Math.sin(a * 5 + i * 0.8) > 0), r + 3 + i, t);
}
var Wt = 100,
  Gt = [
    [-330, 94, 2, 7],
    [-280, 90, 7, -6],
    [-230, 95, 4, 5],
    [-175, 88, 5, -8],
    [-168, 90, 6, 6],
    [-158, 89, 0, -5],
    [-90, 96, 1, 8],
    [-40, 93, 2, -7],
    [10, 95, 3, 6],
    [70, 92, 4, -6],
    [140, 94, 6, 7],
    [200, 96, 7, -5],
    [250, 93, 0, 6],
    [300, 95, 1, -7],
    [360, 91, 2, 5],
  ],
  Kt = [
    { id: `shaurya`, start: -110, feet: 97, look: 5, colour: h, speed: 5 },
    { id: `joshua`, start: 230, feet: 96, look: 3, colour: d, speed: -6 },
  ],
  qt = 20,
  Jt = 34,
  Yt = 7;
function Xt(e) {
  let t = e.getContext(`2d`),
    n = null,
    r = null,
    i = 0,
    a = 0,
    o = Kt.map((e) => ({
      guest: e,
      x: 0,
      held: !0,
      stoppedAt: null,
      paused: 0,
      loose: null,
    }));
  function s() {
    if (!t) return !1;
    let a = e.clientWidth;
    if (!a) return !1;
    let o = Math.ceil(a / 2);
    return (
      (e.width = o),
      (e.height = Wt),
      (n = new se(t, o, Wt)),
      (i = Math.round(o / 2)),
      (r = Rt(n, i - 15, 66)),
      !0
    );
  }
  function c(e, t, n, r) {
    return (((((i + e + t * n) % r) % r) + r) % r) | 0;
  }
  function l(e, s) {
    if (!t || !n || !r) return;
    let l = n,
      u = l.width;
    ((a = e),
      ue(l),
      Bt(l, i - 310, 62, h, e),
      Bt(l, i + 305, 62, f, e),
      J(l, i - 200, 60, 0.8),
      J(l, i + 100, 58, 0.7),
      J(l, i + 180, 61, 0.9),
      J(l, i - 520, 62, 0.8),
      J(l, i + 480, 59, 0.8),
      Y(l, i - 262, 60, 3, !!(((e * 1.3) | 0) & 1)),
      Et(l, i - 255, 78, e),
      Ot(l, i - 165, 84),
      r.draw(s),
      Dt(l, i + 135, 76, e),
      Tt(l, i + 235, 74, e),
      zt(l, i - 205, 90),
      zt(l, i + 55, 93),
      zt(l, i + 275, 91),
      J(l, i - 350, 92, 1.4),
      J(l, i - 300, 88, 1.1),
      J(l, i + 320, 90, 1.4),
      J(l, i + 420, 86, 1.2),
      J(l, i - 460, 88, 1.2));
    for (let [t, n, r, i] of Gt)
      Y(l, c(t, i, e, u), n, r, !!(((e * 6 + r) | 0) & 1));
    for (let t of o) {
      let { guest: n } = t,
        r = (t.stoppedAt ?? e) - t.paused;
      t.x = c(n.start, n.speed, r, u);
      let i = !!(((r * 6) | 0) & 1);
      t.held
        ? Ht(l, t.x, n.feet, n.look, n.colour, e, i)
        : Y(l, t.x, n.feet, n.look, t.stoppedAt === null ? i : void 0);
      let { loose: a } = t;
      a &&
        ((a.vy = Math.min(qt, a.vy + Jt * s)),
        (a.y -= a.vy * s),
        (a.x += Math.sin((e - a.born) * 1.6) * Yt * s),
        a.y < -8
          ? (t.loose = null)
          : Ut(l, Math.round(a.x), Math.round(a.y), n.colour, e));
    }
    t.putImageData(l.image, 0, 0);
  }
  return {
    layout: s,
    draw: l,
    get ready() {
      return n !== null;
    },
    hitGuest(e, t) {
      return (
        o.find(
          ({ guest: n, x: r, held: i }) =>
            i && e > r - 4 && e < r + 9 && t > n.feet - 17 && t < n.feet + 2,
        )?.guest.id ?? null
      );
    },
    guestAnchor(e) {
      let t = o.find(({ guest: t }) => t.id === e);
      return { x: t.x + 3, y: t.guest.feet - 15 };
    },
    freeGuest(e, t) {
      let n = o.find(({ guest: t }) => t.id === e);
      n.held &&
        ((n.held = !1),
        (n.stoppedAt = a),
        t && (n.loose = { x: n.x + 3, y: n.guest.feet - 14, vy: 0, born: a }));
    },
    resumeGuest(e) {
      let t = o.find(({ guest: t }) => t.id === e);
      t.stoppedAt !== null &&
        ((t.paused += a - t.stoppedAt), (t.stoppedAt = null));
    },
  };
}

export { Xt as createPark, bt as drawCloud };
