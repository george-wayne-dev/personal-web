"use client";

import { useEffect, useRef } from "react";
import { drawScene, type SceneVariant } from "@/lib/scene/ridges";

export function RidgeScene({
  variant,
  seed,
  className,
}: {
  variant: SceneVariant;
  seed: string;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const draw = () => drawScene(canvas, variant, seed);
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [variant, seed]);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
