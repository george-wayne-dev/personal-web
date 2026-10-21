"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPark, drawCloud } from "@/lib/railcode/park";

const clouds = [
  ["k1", "bank"],
  ["k2", "puff"],
  ["k3", "wisp"],
  ["k4", "drift"],
  ["k5", "wisp"],
  ["k6", "puff"],
  ["k7", "puff"],
  ["k8", "drift"],
] as const;

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function serverReducedMotion() {
  return true;
}

function RailcodeCloud({
  lane,
  shape,
}: {
  lane: string;
  shape: (typeof clouds)[number][1];
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) drawCloud(ref.current, shape);
  }, [shape]);
  return <canvas ref={ref} className={`railcode-cloud ${lane}`} />;
}

function RailcodePark({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ReturnType<typeof createPark> | null>(null);
  const elapsedRef = useRef(0.9);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = createPark(canvas);
    engineRef.current = engine;
    const resize = () => {
      if (engine.layout()) engine.draw(elapsedRef.current, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    let frame = 0;
    let previous = performance.now();
    const draw = (now: number) => {
      const delta = Math.min(0.05, Math.max(0, (now - previous) / 1000));
      previous = now;
      if (document.visibilityState === "visible") {
        elapsedRef.current += delta;
        engineRef.current?.draw(elapsedRef.current, delta);
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [paused]);

  return (
    <div className="park-landscape" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

export function AnimatedSky({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    prefersReducedMotion,
    serverReducedMotion,
  );

  return (
    <div className="landscape-sky" data-paused={paused}>
      <div className="railcode-sky-clouds" aria-hidden="true">
        {clouds.map(([lane, shape]) => (
          <RailcodeCloud lane={lane} shape={shape} key={lane} />
        ))}
      </div>
      {children}
      <RailcodePark paused={paused || reduced} />
      <button
        type="button"
        className="landscape-motion-toggle"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="currentColor"
          aria-hidden="true"
        >
          {paused ? (
            <path d="M3 1l8 5-8 5z" />
          ) : (
            <path d="M2 1h3v10H2zM7 1h3v10H7z" />
          )}
        </svg>
        {paused ? "播放动画" : "暂停动画"}
      </button>
    </div>
  );
}
