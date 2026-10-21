"use client";

import { useEffect, useRef } from "react";
import { drawHorizon } from "@/lib/railcode/pixels";

export function RailcodeHorizon() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const draw = () => drawHorizon(canvas);
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);
  return <canvas ref={ref} className="landscape-horizon" aria-hidden="true" />;
}
