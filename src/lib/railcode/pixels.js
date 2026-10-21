/* eslint-disable @typescript-eslint/no-unused-expressions -- Preserve expression sequences in the original compiled drawing code. */
// Drawing source: https://railcode.dev/assets/useOverscrollGround-DDwJDorI.js
// Extracted 2026-10-21. Palette, pixel buffer and grove drawing only.
var G = (e, t, n) => ((255 << 24) | (n << 16) | (t << 8) | e) >>> 0,
  fl = G(226, 239, 248),
  pl = G(205, 229, 176),
  ml = G(190, 219, 162),
  hl = G(176, 208, 146),
  gl = G(222, 238, 200),
  _l = G(156, 193, 120),
  vl = G(170, 203, 138),
  yl = G(20, 148, 140),
  bl = G(10, 82, 78),
  xl = G(16, 110, 104),
  Sl = G(8, 60, 56),
  Cl = G(45, 49, 60),
  wl = G(84, 90, 104),
  Tl = G(21, 23, 29),
  El = G(122, 124, 132),
  Dl = G(248, 200, 32),
  Ol = G(198, 142, 12),
  kl = G(40, 26, 10),
  Al = G(206, 28, 14),
  jl = G(110, 10, 6),
  Ml = G(248, 200, 32),
  Nl = G(198, 142, 12),
  Pl = G(244, 241, 235),
  Fl = G(238, 230, 218),
  Il = G(20, 148, 140),
  Ll = G(10, 82, 78),
  Rl = G(52, 132, 56),
  K = G(34, 96, 40),
  q = G(94, 62, 34),
  J = G(84, 172, 78),
  Y = G(22, 70, 32),
  X = G(126, 90, 54),
  zl = G(62, 40, 20),
  Bl = G(190, 160, 124),
  Vl = G(168, 138, 104),
  Hl = G(120, 96, 70),
  Ul = G(224, 154, 98),
  Wl = G(44, 36, 30),
  Gl = G(168, 158, 146),
  Kl = [
    G(46, 30, 16),
    G(24, 24, 28),
    G(198, 152, 64),
    G(150, 54, 22),
    G(90, 60, 30),
    G(34, 34, 92),
    G(20, 20, 20),
    G(170, 120, 40),
  ],
  ql = [
    G(58, 100, 200),
    G(204, 60, 40),
    G(58, 158, 68),
    G(152, 70, 182),
    G(230, 140, 30),
    G(46, 168, 168),
    G(228, 88, 140),
    G(120, 122, 48),
  ],
  Jl = G(74, 52, 35),
  Yl = G(104, 74, 47),
  Xl = G(96, 68, 44),
  Zl = G(56, 38, 25),
  Ql = G(54, 36, 22),
  $l = G(146, 137, 126),
  eu = G(182, 174, 164),
  tu = G(104, 96, 87),
  nu = G(146, 106, 68),
  ru = G(106, 76, 46),
  iu = G(214, 140, 146),
  au = G(168, 100, 108),
  ou = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];
function su(e, t) {
  let n = (Math.imul(e, 374761393) + Math.imul(t, 668265263)) | 0;
  return ((n = Math.imul(n ^ (n >>> 13), 1274126177)), (n ^ (n >>> 16)) >>> 0);
}
function cu(e) {
  let t = ((e % 32) + 32) % 32;
  return 52 + (Math.abs(t - 16) - 8) / 2;
}
function lu(e) {
  e.fill(fl);
  for (let t = 0; t < e.width; t++) {
    let n = Math.round(cu(t));
    e.put(t, n, _l);
    for (let r = n + 1; r < e.height; r++) {
      let n =
          (Math.floor((t / 16 + (r - 52) / 8) / 2) +
            Math.floor(((r - 52) / 8 - t / 16) / 2)) &
          1
            ? ml
            : pl,
        i = su(t, r) & 31;
      (i < 3 ? (n = hl) : i === 31 && (n = gl),
        n !== pl &&
          r > 78 &&
          (r - 78) / 18 > (ou[r & 3][t & 3] + 0.5) / 16 &&
          (n = pl),
        e.put(t, r, n));
    }
  }
}
function uu(e, t, n, r) {
  for (let i = -r; i <= r; i++)
    (e.put(t + i, n, vl), Math.abs(i) < r * 0.6 && e.put(t + i, n + 1, vl));
}
var du = class {
    width;
    height;
    image;
    buf;
    constructor(e, t, n) {
      ((this.width = t),
        (this.height = n),
        (this.image = e.createImageData(t, n)),
        (this.buf = new Uint32Array(this.image.data.buffer)));
    }
    fill(e) {
      this.buf.fill(e);
    }
    put(e, t, n) {
      let r = e | 0,
        i = t | 0;
      r >= 0 &&
        r < this.width &&
        i >= 0 &&
        i < this.height &&
        (this.buf[i * this.width + r] = n);
    }
    rect(e, t, n, r, i) {
      for (let a = 0; a < r; a++)
        for (let r = 0; r < n; r++) this.put(e + r, t + a, i);
    }
    line(e, t, n, r, i, a) {
      let o = e | 0,
        s = t | 0,
        c = n | 0,
        l = r | 0,
        u = Math.abs(c - o),
        d = Math.abs(l - s),
        f = +(d > u),
        p = d > u ? 0 : 1,
        m = u,
        h = -d,
        g = o < c ? 1 : -1,
        _ = s < l ? 1 : -1,
        v = m + h;
      for (
        ;
        this.put(o, s, i),
          a !== void 0 && this.put(o + f, s + p, a),
          !(o === c && s === l);
      ) {
        let e = 2 * v;
        (e >= h && ((v += h), (o += g)), e <= m && ((v += m), (s += _)));
      }
    }
    circ(e, t, n, r) {
      let i = n,
        a = 0,
        o = 1 - n;
      for (; i >= a;)
        (this.put(e + i, t + a, r),
          this.put(e - i, t + a, r),
          this.put(e + i, t - a, r),
          this.put(e - i, t - a, r),
          this.put(e + a, t + i, r),
          this.put(e - a, t + i, r),
          this.put(e + a, t - i, r),
          this.put(e - a, t - i, r),
          a++,
          o < 0 ? (o += 2 * a + 1) : (i--, (o += 2 * (a - i) + 1)));
    }
  },
  fu = 52,
  pu = 20,
  mu = 26,
  hu = 96,
  gu = 112,
  _u = 10,
  vu = (e, t) => (ou[t & 3][e & 3] + 0.5) / 16;
function yu(e) {
  for (let t = 0; t < e.width; t++)
    for (let n = 0; n < fu; n++) {
      let r =
          (Math.floor((t / 16 + n / 8) / 2) +
            Math.floor((n / 8 - t / 16) / 2)) &
          1
            ? ml
            : pl,
        i = su(t, n) & 31;
      (i < 3 ? (r = hl) : i === 31 && (r = gl),
        r !== pl && n < pu && (pu - n) / 18 > vu(t, n) && (r = pl),
        e.put(t, n, r));
    }
}
function bu(e) {
  let t = 108 - fu;
  for (let n = 0; n < e.width; n++)
    for (let r = fu; r < 108; r++) {
      let i = vu(n, r),
        a = (r - fu) / t,
        o = a < 0.5 && (0.5 - a) / 0.5 > i ? Yl : Jl,
        s = o,
        c = su(n, r + 91) & 63;
      (c < 5 ? (s = Zl) : c > 59 && (s = Xl),
        s !== o && (r - (108 - mu)) / mu > i && (s = o),
        e.put(n, r, s));
    }
}
function xu(e) {
  for (let t = 0; t < e.width; t++) {
    (su(t, 5) & 7 || e.put(t, fu - 1, hl), e.put(t, fu, _l));
    let n = 1 + (su(t, 3) % 3);
    for (let r = 1; r <= n; r++) e.put(t, fu + r, Ql);
  }
}
function Su(e, t, n, r, i) {
  for (let a = 0; a < i; a++) {
    let o = +(a === i - 1);
    e.rect(t + o, n + a, r - o * 2, 1, a === i - 1 ? tu : $l);
  }
  e.put(t + 1, n, eu);
}
function Cu(e) {
  let t = 108 - fu - mu - 4;
  for (let n = 0; n * 44 < e.width + 44; n++) {
    let r = su(n, 61);
    Su(
      e,
      n * 44 + (r & 31),
      58 + ((r >>> 5) % t),
      3 + ((r >>> 11) & 2),
      2 + ((r >>> 13) & 1),
    );
  }
  for (let n = 0; n * 190 < e.width + 190; n++) {
    let r = su(n, 23);
    wu(e, n * 190 + (r & 127), 60 + ((r >>> 7) % t), r & 7);
  }
}
function wu(e, t, n, r) {
  for (let i = 0; i < 9; i++) {
    let a = n + Math.round(Math.sin(i * 0.85 + r) * 1.6);
    (e.put(t + i, a, iu), e.put(t + i, a + 1, au));
  }
}
function Tu(e, t, n, r, i, a, o) {
  let s = t,
    c = Math.round(i * 0.4);
  for (let t = 0; t < i && n + t < 108; t++) {
    let l = Math.round(s),
      u = n + t;
    ((u - (108 - mu)) / mu <= vu(l, u) &&
      (e.put(l, u, nu), t < i * 0.45 && e.put(l + (r >= 0 ? 1 : -1), u, ru)),
      o &&
        t === c &&
        Tu(e, l, u, r >= 0 ? -0.75 : 0.75, Math.round(i * 0.6), a + 7, !1),
      (s += r + Math.sin((u + a) * 0.55) * 0.25));
  }
}
function Eu(e, t, n, r) {
  (Tu(e, t, 55, 0, Math.round(46 * r), n, !0),
    Tu(e, t - 2, 56, -0.85, Math.round(24 * r), n + 3, !0),
    Tu(e, t + 2, 56, 0.85, Math.round(26 * r), n + 11, !0));
}
function Du(e, t, n, r, i, a) {
  for (let o = -i; o <= i; o++)
    for (let s = -r; s <= r; s++) {
      let c = 1 + 0.09 * Math.sin(Math.atan2(o, s) * 3 + a);
      if ((s / (r * c)) ** 2 + (o / (i * c)) ** 2 > 1) continue;
      let l =
          (s / r) * -0.55 - (o / i) * 0.85 + (vu(t + s, n + o) - 0.5) * 0.34,
        u = Rl;
      l > 0.5 ? (u = J) : l < -0.8 ? (u = Y) : l < -0.15 && (u = K);
      let d = su(t + s, n + o) & 15;
      (d === 0 ? (u = u === J ? Rl : K) : d === 15 && u === Rl && (u = J),
        e.put(t + s, n + o, u));
    }
}
function Ou(e, t, n, r, i) {
  let a = Math.round(15 * r),
    o = Math.max(2, Math.round(3.4 * r)),
    s = n - a;
  for (let n = 0; n < a; n++) {
    let r = o + (n > a - 3 ? 2 : 0),
      i = t - (r >> 1);
    (e.rect(i, s + n, r, 1, q),
      e.put(i, s + n, X),
      e.put(i + r - 1, s + n, zl));
  }
  let c = Math.round(11 * r);
  Du(e, t, s - c + Math.round(3 * r), Math.round(13 * r), c, i);
}
var ku = [5, 8, 11, 14];
function Au(e, t, n, r) {
  let i = Math.max(3, Math.round(5 * r));
  (e.rect(t - 1, n - i, 3, i, q),
    e.rect(t - 1, n - i, 1, i, X),
    e.rect(t + 1, n - i, 1, i, zl));
  let a = Math.max(4, Math.round(10 * r)),
    o = Math.round(3 * r),
    s = n - i - (ku.length * (a - o) + o) + 1;
  for (let n of ku) {
    let i = Math.round(n * r);
    for (let n = 0; n < a; n++) {
      let r = Math.round((i * (n + 1)) / a);
      for (let i = -r; i <= r; i++) {
        let o = n === a - 1 ? Y : i < -r + 2 ? J : i > r - 3 ? K : Rl,
          c = su(t + i, s + n) & 15;
        (c === 0 && o !== Y ? (o = K) : c === 15 && o === Rl && (o = J),
          e.put(t + i, s + n, o));
      }
    }
    s += a - o;
  }
}
function ju(e, t, n, r, i) {
  let a = Math.round(4 * r);
  Du(e, t, n - a, Math.round(6 * r), a, i);
}
function Mu(e, t, n, r, i, a) {
  let o = [],
    s = Math.ceil(e / (2 * t)) + 1;
  for (let c = -s; c <= s; c++) {
    let s = su(c, a),
      l = Math.round(e / 2) + c * t + ((s & 31) - 16);
    l < -n ||
      l > e + n ||
      o.push({
        x: l,
        scale: r + (((s >>> 5) & 7) / 7) * (i - r),
        conifer: ((s >>> 9) & 3) > 1,
        seed: (s >>> 12) & 255,
      });
  }
  return o;
}
function Nu(e, t, n) {
  (uu(e, t.x, n - 2, Math.round(8 * t.scale)),
    t.conifer ? Au(e, t.x, n, t.scale) : Ou(e, t.x, n, t.scale, t.seed));
}
function Pu(e) {
  let t = e.getContext(`2d`);
  if (!t) return;
  let n = e.clientWidth;
  if (!n) return;
  let r = Math.ceil(n / 2);
  ((e.width = r), (e.height = 108));
  let i = new du(t, r, 108);
  (yu(i), bu(i), Cu(i), xu(i));
  let a = Math.min(hu, Math.max(56, Math.round(r / 4))),
    o = Math.round((gu * a) / hu);
  for (let e of Mu(r, o, 16, 0.4, 0.56, 41)) Nu(i, e, fu - _u);
  let s = Mu(r, a, 24, 0.72, 0.98, 17);
  for (let e of s) Eu(i, e.x, e.seed, e.scale);
  for (let e of s)
    (e.seed & 1 &&
      ju(
        i,
        e.x - Math.round(a / 2),
        fu - 1,
        0.7 + ((e.seed >>> 2) & 3) / 12,
        e.seed,
      ),
      Nu(i, e, fu));
  t.putImageData(i.image, 0, 0);
}

// Original blog horizon: https://railcode.dev/assets/HorizonBand-BPHc8EQU.js
// Reuses the original pixel buffer, palette, hash and dithering above.
function drawHorizon(canvas) {
  const context = canvas.getContext("2d");
  const width = Math.ceil(canvas.clientWidth / 2);
  if (!context || !width) return;
  canvas.width = width;
  canvas.height = 60;
  const pixels = new du(context, width, 60);
  pixels.fill(fl);
  for (let x = 0; x < width; x++) {
    const top = Math.round(
      20 + (Math.abs((((x % 32) + 32) % 32) - 16) - 8) / 2,
    );
    pixels.put(x, top, _l);
    for (let y = top + 1; y < 60; y++) {
      let color =
        (Math.floor((x / 16 + (y - 20) / 8) / 2) +
          Math.floor(((y - 20) / 8 - x / 16) / 2)) &
        1
          ? ml
          : pl;
      const noise = su(x, y) & 31;
      if (noise < 3) color = hl;
      else if (noise === 31) color = gl;
      if (
        color !== pl &&
        y > 40 &&
        (y - 40) / 20 > (ou[y & 3][x & 3] + 0.5) / 16
      )
        color = pl;
      pixels.put(x, y, color);
    }
  }
  context.putImageData(pixels.image, 0, 0);
}

export {
  drawHorizon,
  Al,
  Bl,
  Cl,
  Dl,
  El,
  Fl,
  G,
  Gl,
  Hl,
  Il,
  K,
  Kl,
  Ll,
  Ml,
  Nl,
  Ol,
  Pl,
  Rl,
  Sl,
  Tl,
  Ul,
  Vl,
  Wl,
  bl,
  du,
  jl,
  kl,
  lu,
  q,
  ql,
  uu,
  wl,
  xl,
  yl,
  Pu as drawForest,
};
