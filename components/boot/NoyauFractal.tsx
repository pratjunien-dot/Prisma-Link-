"use client";
import { useEffect, useRef, useCallback } from "react";

interface Props { accent: string; onDone: () => void; }

export function NoyauFractal({ accent, onDone }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const done = useCallback(onDone, [onDone]);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const cx = W / 2, cy = H / 2;
    let frame = 0, raf: number;

    const hexPts = (r: number, rot: number) =>
      Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i + rot;
        return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
      });

    const animate = () => {
      frame++;
      const ease = 1 - Math.pow(1 - Math.min(frame / 100, 1), 3);
      const t = frame / 60;

      ctx.clearRect(0, 0, W, H);

      // Gradient ambient central
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 70 * ease);
      g.addColorStop(0, accent + "18");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // 4 anneaux hexagonaux
      for (let ring = 1; ring <= 4; ring++) {
        const pts = hexPts(ring * 22 * ease, t * (ring % 2 === 0 ? 0.35 : -0.35));
        ctx.beginPath();
        pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
        ctx.closePath();
        ctx.strokeStyle = accent + Math.round(0.55 * ease * 255).toString(16).padStart(2, "0");
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // 12 lignes radiales
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 / 12) * i + t * 0.1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + 110 * ease * Math.cos(a), cy + 110 * ease * Math.sin(a));
        ctx.strokeStyle = accent + "18";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Point central glow
      ctx.beginPath();
      ctx.arc(cx, cy, 3 * ease, 0, Math.PI * 2);
      ctx.fillStyle = accent;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (frame < 130) raf = requestAnimationFrame(animate);
      else done();
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [accent, done]);

  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}
