"use client";
import React, { useRef, useEffect } from "react";
import styles from "./DotBackground.module.css";

// Responsive dot configuration
const getDotConfig = () => {
  if (typeof window === "undefined")
    return { dots: 80, radius: 2.5, distance: 120 };

  const width = window.innerWidth;
  const isMobile = width <= 768;
  const isSmallMobile = width <= 480;

  return {
    dots: isSmallMobile ? 40 : isMobile ? 60 : 80,
    radius: isSmallMobile ? 2 : isMobile ? 2.2 : 2.5,
    distance: isSmallMobile ? 80 : isMobile ? 100 : 120,
  };
};

const DOT_COLOR = "rgba(255, 255, 255, 0.7)";
const LINE_COLOR = "rgba(180, 120, 255, 0.25)";
const BG_GRADIENT = [
  { stop: 0, color: "#0a001a" },
  { stop: 0.5, color: "#14002a" },
  { stop: 0.85, color: "#1a0036" },
  { stop: 1, color: "#22003a" },
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const DotBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const dots = useRef<Dot[]>([]);
  const animationId = useRef<number | null>(null);
  const config = useRef(getDotConfig());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(devicePixelRatio, devicePixelRatio);

    config.current = getDotConfig();
    dots.current = Array.from({ length: config.current.dots }, () => ({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      vx: randomBetween(-0.5, 0.5),
      vy: randomBetween(-0.5, 0.5),
    }));

    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    function animate(currentTime: number) {
      if (currentTime - lastFrameTime < frameInterval) {
        animationId.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime;

      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const ctx = canvasEl.getContext("2d");
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, width, height);
      BG_GRADIENT.forEach(({ stop, color }) =>
        gradient.addColorStop(stop, color)
      );
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.globalAlpha = 1;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      for (const dot of dots.current) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, config.current.radius, 0, Math.PI * 2);
        ctx.fillStyle = DOT_COLOR;
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < dots.current.length; i++) {
        for (let j = i + 1; j < dots.current.length; j++) {
          const a = dots.current[i];
          const b = dots.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < config.current.distance) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = 1.2 - dist / config.current.distance;
            ctx.globalAlpha = 1 - dist / config.current.distance;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      if (window.innerWidth > 768) {
        for (const dot of dots.current) {
          const dist = Math.hypot(
            dot.x - mouse.current.x,
            dot.y - mouse.current.y
          );
          if (dist < config.current.distance) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1.5 - dist / config.current.distance;
            ctx.globalAlpha = 1 - dist / config.current.distance;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      for (const dot of dots.current) {
        dot.x += dot.vx;
        dot.y += dot.vy;
        if (dot.x < 0 || dot.x > width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > height) dot.vy *= -1;
      }

      animationId.current = requestAnimationFrame(animate);
    }

    animationId.current = requestAnimationFrame(animate);

    function onMouseMove(e: MouseEvent) {
      if (window.innerWidth > 768) {
        mouse.current.x = e.clientX;
        mouse.current.y = e.clientY;
      }
    }

    function onMouseOut() {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    }

    if (window.innerWidth > 768) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseout", onMouseOut);
    }

    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      config.current = getDotConfig();

      if (canvasRef.current) {
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvasRef.current.width = width * devicePixelRatio;
        canvasRef.current.height = height * devicePixelRatio;
        canvasRef.current.style.width = width + "px";
        canvasRef.current.style.height = height + "px";

        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.scale(devicePixelRatio, devicePixelRatio);
        }
      }

      dots.current = Array.from({ length: config.current.dots }, () => ({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: randomBetween(-0.5, 0.5),
        vy: randomBetween(-0.5, 0.5),
      }));
    }

    window.addEventListener("resize", onResize);

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default DotBackground;
