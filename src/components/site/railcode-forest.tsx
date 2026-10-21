"use client";

import { useEffect, useRef } from "react";
import { drawForest } from "@/lib/railcode/pixels";

export function RailcodeForest() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const draw = () => drawForest(canvas);
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);
  return <canvas ref={ref} className="forest-landscape" aria-hidden="true" />;
}
