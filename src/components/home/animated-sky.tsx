"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  createWalkScene,
  WALK_START_TIME,
  WALK_STILL_TIME,
} from "@/lib/scene/ridges";

const FRAME_SECONDS = 1 / 30;

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

function RidgeWalk({ paused, still }: { paused: boolean; still: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ReturnType<typeof createWalkScene> | null>(null);
  const elapsedRef = useRef(WALK_START_TIME);
  const stillRef = useRef(still);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = createWalkScene(canvas);
    sceneRef.current = scene;
    const resize = () => {
      if (!scene.layout()) return;
      scene.draw(stillRef.current ? WALK_STILL_TIME : elapsedRef.current);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    stillRef.current = still;
    sceneRef.current?.draw(still ? WALK_STILL_TIME : elapsedRef.current);
  }, [still]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (paused || still || !canvas) return;
    let frame = 0;
    let previous = performance.now();
    let waiting = 0;
    let onScreen = true;
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    observer.observe(canvas);
    const draw = (now: number) => {
      const delta = Math.min(0.05, Math.max(0, (now - previous) / 1000));
      previous = now;
      waiting += delta;
      if (onScreen && waiting >= FRAME_SECONDS) {
        elapsedRef.current += waiting;
        waiting = 0;
        sceneRef.current?.draw(elapsedRef.current);
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [paused, still]);

  return <canvas className="ridge-walk" ref={canvasRef} aria-hidden="true" />;
}

export function AnimatedSky({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    prefersReducedMotion,
    serverReducedMotion,
  );

  return (
    <div className="landscape-sky">
      {children}
      <RidgeWalk paused={paused} still={reduced} />
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
